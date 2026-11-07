/* apps/ski/ski-core.js — 스키 활강(Ski Downhill) 로직 (언어 무관, UMD: 브라우저 window.SKI_CORE + Node 검사 공용)
 *
 * 좌표(게임 단위, 화면 px 아님): 슬로프 폭 W(360), 화면 높이 H(600). x 는 오른쪽, y 는 산 아래쪽(앞)으로 커진다.
 *   - 스키어: 세계 y = dist(내려온 거리, 단위), x·vx. 화면에서는 위에서 SKIER_Y 자리에 고정, 세계가 위로 흐른다.
 *     조종 steer(-1 왼쪽 · 0 · +1 오른쪽) → 옆 속도 vx 가 목표(steer × MAX_VX)로 부드럽게 따라간다(STEER_RESP).
 *     양 끝(EDGE)은 막혀 있을 뿐 넘어지지 않는다. 크게 꺾을수록 앞 속도가 조금 줄어든다(TURN_DRAG, 카빙 마찰).
 *   - 앞 속도 speedAt(dist) = min(MAX_SPEED, SPEED0 + ACCEL × dist) — 거리에 따라 빨라진다(같은 시드 = 같은 코스).
 *   - 코스는 "줄(row)" 단위로 미리 만든다. 줄 간격 rowGapAt(y) 는 점점 좁아진다. 줄마다 안전한 길(lane)이 있고,
 *     다음 줄의 lane 은 앞 줄에서 shiftAt(y) 이하로만 움직인다(최고 옆 속도로 언제나 따라갈 수 있게).
 *     장애물 줄: 나무·바위·눈사람을 0~4개, lane 양옆 LANE_HALF + 반지름 안에는 두지 않는다.
 *     기문 줄: 빨강/파랑 깃발 두 개(lane ± half), 장애물 없음. 깃발 사이를 지나면 콤보 +1, 보너스 = GATE_BONUS × min(콤보, COMBO_MAX) m.
 *     깃발 바깥으로 지나면 콤보 0(넘어지지는 않음).
 *   - 충돌: 원-원(스키어 HIT_R, 장애물 r — 그림보다 작게, 너그러운 판정). 부딪히면 끝(over), 그 뒤엔 미끄러지며 멈춘다(그림용).
 *   - 점수(m) = floor(runDist / PX_PER_M) + bonus. 시드 = crypto.getRandomValues(없으면 Math.random), 코스 = mulberry32(시드).
 *   - 고정 시간 간격: step(s, dtMs) 는 dt 를 모아 TICK_MS(1/120초)마다 tick → 같은 시드 + 같은 입력 = 같은 판. 큰 dt 는 MAX_STEP 으로 자른다.
 *   - 준비 상태(started = false): 아무것도 움직이지 않는다. start(s) 가 판을 시작한다.
 * step(s, dt, onTick) — onTick(s) 가 숫자를 돌려주면 그 tick 의 steer 로 쓴다(자동 조종·검사용). 돌려주는 값 = 사건 배열
 *   [{ type:'gate', ok, combo, add } | { type:'crash', kind }].
 * autoSteer(s) — 다음 줄의 lane 을 따라가는 단순한 자동 조종(검사·흐름 검사용).
 * 서버 점수 분포(supa.submitScore): bucket(score) = min(1999, floor(score / 5)) (5 m 구간, 높을수록 좋음).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SKI_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 600;
  var SKIER_Y = 190;          // 화면에서 스키어 자리(위에서)
  var EDGE = 16;              // 스키어가 갈 수 있는 양 끝
  var HIT_R = 7;              // 스키어 충돌 반지름(그림보다 작게)
  var MAX_VX = 260;           // 최고 옆 속도(단위/초)
  var STEER_RESP = 7.5;       // 옆 속도가 목표를 따라가는 빠르기(1/초)
  var TURN_DRAG = 0.12;       // 최고로 꺾을 때 앞 속도 감소 비율
  var SPEED0 = 220, ACCEL = 0.012, MAX_SPEED = 540;   // 앞 속도(단위/초)
  var GAP0 = 96, GAP_SHRINK = 0.0012, GAP_MIN = 66;   // 줄 간격(단위)
  var SHIFT_K = 0.5;          // lane 이동 한도 = SHIFT_K × MAX_VX × 줄 간격 / 앞 속도
  var LANE_MIN = 64;          // lane 이 양 끝에서 떨어진 최소 거리(기문 깃발 포함)
  var LANE_HALF = 34;         // lane 가운데에서 장애물 가장자리까지 비워 두는 거리
  var JITTER = 8;             // 장애물 세로 흔들림(자연스럽게)
  var OBJ_X0 = 18;            // 장애물 x 범위 끝
  var FIRST_ROW = 430;        // 첫 줄의 세계 y (시작하고 잠시 비어 있음)
  var SPAWN_AHEAD = 700;      // 이만큼 앞까지 미리 만든다
  var KINDS = ['tree', 'rock', 'snowman'];
  var RADIUS = { tree: 11, rock: 10, snowman: 10 };
  var GATE_FIRST = 4;         // 첫 기문 줄 번호
  var GATE_EVERY = 6, GATE_EVERY_RANGE = 4;           // 기문 사이 줄 수 6~9
  var GATE_HALF0 = 46, GATE_HALF_MIN = 34, GATE_HALF_SHRINK = 0.0006;
  var FLAG_R = 4;             // 깃발 막대 여유
  var GATE_BONUS = 5, COMBO_MAX = 5;                  // 보너스(m)
  var PX_PER_M = 10;          // 10 단위 = 1 m
  var CRASH_DECEL = 900;      // 넘어진 뒤 미끄러짐 감속
  var TICK_MS = 1000 / 120;
  var MAX_STEP = 100;
  var GAME = 'ski';
  var MAX_BUCKET = 1999;
  var TIERS = [0, 300, 700, 1300, 2200, 3500];         // 등급 6단계 하한(m)

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomSeed() {
    try {
      var c = (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto : null;
      if (c) { var a = new Uint32Array(1); c.getRandomValues(a); return a[0] >>> 0; }
    } catch (e) { /* 아래로 */ }
    return (Math.random() * 4294967296) >>> 0;
  }

  function speedAt(d) { return Math.min(MAX_SPEED, SPEED0 + ACCEL * Math.max(0, d)); }
  function rowGapAt(y) { return Math.max(GAP_MIN, GAP0 - GAP_SHRINK * Math.max(0, y)); }
  function shiftAt(y) { return SHIFT_K * MAX_VX * rowGapAt(y) / speedAt(y); }
  function gateHalfAt(y) { return Math.max(GATE_HALF_MIN, GATE_HALF0 - GATE_HALF_SHRINK * Math.max(0, y)); }
  // 한 줄에 놓을 장애물 수의 기댓값 (0.8 → 2.6)
  function densityAt(y) { return 0.8 + Math.min(1.8, Math.max(0, y) * 0.00009); }

  function spawnRow(s) {
    var y = s.nextRowY;
    var n = s.rowN++;
    var gap = rowGapAt(y);
    var sh = shiftAt(y);
    var lane = clamp(s.lane + (s.rnd() * 2 - 1) * sh, LANE_MIN, W - LANE_MIN);
    lane = Math.round(lane * 100) / 100;
    s.lane = lane;
    s.rows.push({ n: n, y: y, lane: lane });
    if (n >= s.nextGateRow) {
      var half = Math.round(gateHalfAt(y) * 100) / 100;
      s.gates.push({ n: s.gateN, y: y, cx: lane, half: half, color: s.gateN % 2, done: false, ok: false });
      s.gateN++;
      s.nextGateRow = n + GATE_EVERY + Math.floor(s.rnd() * GATE_EVERY_RANGE);
    } else {
      var dens = densityAt(y);
      var count = Math.min(4, Math.floor(dens) + (s.rnd() < dens - Math.floor(dens) ? 1 : 0));
      var placed = [];
      for (var i = 0; i < count; i++) {
        var kr = s.rnd();
        var kind = kr < 0.55 ? 'tree' : kr < 0.8 ? 'rock' : 'snowman';
        var r = RADIUS[kind];
        for (var tries = 0; tries < 8; tries++) {
          var x = OBJ_X0 + s.rnd() * (W - OBJ_X0 * 2);
          if (Math.abs(x - lane) < LANE_HALF + r) continue;
          var clash = false;
          for (var j = 0; j < placed.length; j++) if (Math.abs(placed[j].x - x) < placed[j].r + r + 8) { clash = true; break; }
          if (clash) continue;
          var o = { x: Math.round(x * 100) / 100, y: y + Math.round((s.rnd() * 2 - 1) * JITTER * 100) / 100, kind: kind, r: r, v: Math.floor(s.rnd() * 3) };
          placed.push(o);
          s.objs.push(o);
          break;
        }
      }
    }
    s.nextRowY = y + gap;
  }
  function spawnAhead(s) {
    while (s.nextRowY < s.dist + SPAWN_AHEAD) spawnRow(s);
  }

  function newGame(seed) {
    var sd = seed == null ? randomSeed() : seed >>> 0;
    var s = {
      seed: sd, rnd: mulberry32(sd),
      x: W / 2, vx: 0, steer: 0, dist: 0, runDist: 0, speed: 0,
      started: false, over: false, crash: null, crashX: 0, crashY: 0,
      objs: [], gates: [], rows: [], rowN: 0, gateN: 0, nextRowY: FIRST_ROW, lane: W / 2,
      nextGateRow: GATE_FIRST,
      gatesPassed: 0, gatesMissed: 0, combo: 0, maxCombo: 0, bonus: 0,
      ticks: 0, runTicks: 0, acc: 0
    };
    spawnAhead(s);
    return s;
  }

  function start(s) {
    if (s.over || s.started) return false;
    s.started = true;
    return true;
  }
  function setSteer(s, v) { s.steer = clamp(Math.round(Number(v) || 0), -1, 1); return s.steer; }

  function meters(s) { return Math.floor(s.runDist / PX_PER_M); }
  function score(s) { return meters(s) + s.bonus; }

  function tick(s, events) {
    var dt = TICK_MS / 1000;
    s.ticks++;
    if (!s.started) return;
    if (s.over) {
      s.speed = Math.max(0, s.speed - CRASH_DECEL * dt);
      s.dist += s.speed * dt;
      s.vx *= 0.92;
      s.x = clamp(s.x + s.vx * dt, EDGE, W - EDGE);
      return;
    }
    s.runTicks++;
    var target = s.steer * MAX_VX;
    s.vx += (target - s.vx) * Math.min(1, STEER_RESP * dt);
    s.x += s.vx * dt;
    if (s.x < EDGE) { s.x = EDGE; if (s.vx < 0) s.vx = 0; }
    if (s.x > W - EDGE) { s.x = W - EDGE; if (s.vx > 0) s.vx = 0; }
    s.speed = speedAt(s.dist) * (1 - TURN_DRAG * Math.abs(s.vx) / MAX_VX);
    s.dist += s.speed * dt;
    s.runDist = s.dist;
    spawnAhead(s);
    // 기문
    for (var g = 0; g < s.gates.length; g++) {
      var gt = s.gates[g];
      if (gt.done || gt.y > s.dist) continue;
      gt.done = true;
      if (Math.abs(s.x - gt.cx) < gt.half - FLAG_R) {
        gt.ok = true;
        s.gatesPassed++;
        s.combo++;
        if (s.combo > s.maxCombo) s.maxCombo = s.combo;
        var add = GATE_BONUS * Math.min(s.combo, COMBO_MAX);
        s.bonus += add;
        events.push({ type: 'gate', ok: true, combo: s.combo, add: add, x: gt.cx });
      } else {
        s.gatesMissed++;
        s.combo = 0;
        events.push({ type: 'gate', ok: false, combo: 0, add: 0, x: gt.cx });
      }
    }
    // 장애물
    for (var i = 0; i < s.objs.length; i++) {
      var o = s.objs[i];
      var dy = o.y - s.dist;
      if (dy > 30 || dy < -30) continue;
      var dx = o.x - s.x;
      var rr = o.r + HIT_R;
      if (dx * dx + dy * dy < rr * rr) {
        s.over = true;
        s.crash = o.kind;
        s.crashX = o.x; s.crashY = o.y;
        events.push({ type: 'crash', kind: o.kind });
        return;
      }
    }
    // 지나간 것 치우기
    var cut = s.dist - SKIER_Y - 60;
    while (s.objs.length && s.objs[0].y < cut) s.objs.shift();
    while (s.gates.length && s.gates[0].y < cut) s.gates.shift();
    while (s.rows.length > 2 && s.rows[1].y < s.dist - 10) s.rows.shift();
  }

  // dt(ms) 만큼 고정 간격 tick 을 돈다. onTick(s) 가 숫자를 돌려주면 그 tick 의 steer.
  function step(s, dt, onTick) {
    var events = [];
    s.acc += clamp(Number(dt) || 0, 0, MAX_STEP);
    while (s.acc >= TICK_MS - 1e-9) {
      s.acc -= TICK_MS;
      if (onTick && s.started && !s.over) {
        var v = onTick(s);
        if (typeof v === 'number') setSteer(s, v);
      }
      tick(s, events);
    }
    return events;
  }

  // 아직 지나지 않은 가장 가까운 줄
  function nextRow(s) {
    for (var i = 0; i < s.rows.length; i++) if (s.rows[i].y > s.dist + 2) return s.rows[i];
    return null;
  }
  // 자동 조종: 다음 줄의 lane(기문이면 기문 가운데)을 향해, 옆 속도의 관성까지 생각해서 꺾는다
  function autoSteer(s) {
    var r = nextRow(s);
    if (!r) return 0;
    var predict = s.x + s.vx / STEER_RESP;   // 지금 놓으면 멈출 자리
    var d = r.lane - predict;
    return d > 4 ? 1 : d < -4 ? -1 : 0;
  }

  function tierOf(sc) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (sc >= TIERS[i]) t = i;
    return t;
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (높을수록 좋음)
  function bucket(sc) {
    var n = Math.floor(Number(sc) / 5);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }

  // Supabase 응답 [{ score_bucket, players }] → [{ bucket, players }] (정렬, 같은 구간 합치기, 잘못된 행 버리기)
  function normalizeHist(rows) {
    if (!Array.isArray(rows)) return null;
    var map = {};
    rows.forEach(function (r) {
      if (!r) return;
      var b = Number(r.score_bucket != null ? r.score_bucket : r.bucket);
      var n = Number(r.players);
      if (!isFinite(b) || !isFinite(n) || n <= 0 || b < 0) return;
      b = Math.round(b);
      map[b] = (map[b] || 0) + Math.round(n);
    });
    return Object.keys(map).map(Number).sort(function (a, b) { return a - b; })
      .map(function (b) { return { bucket: b, players: map[b] }; });
  }

  /* 분포에서 내 위치 (rows = 내 점수를 넣은 뒤의 전체 분포, submit_score 응답. 내 구간이 없으면 한 명 더한다).
   * 같은 구간은 절반만 이긴 것으로 친다. top = "상위 N%" 1~100, beatPct = "N%보다 높아요" 0~100.
   * 다른 사람이 없으면 { first: true }(화면에는 숨김). rows 가 배열이 아니면(실패) null.
   */
  function percentile(rows, myBucket) {
    var hist = normalizeHist(rows);
    if (!hist || myBucket == null || !isFinite(Number(myBucket))) return null;
    myBucket = Math.round(Number(myBucket));
    var lower = 0, same = 0, higher = 0;
    hist.forEach(function (h) {
      if (h.bucket < myBucket) lower += h.players;
      else if (h.bucket > myBucket) higher += h.players;
      else same += h.players;
    });
    if (same === 0) same = 1;
    var total = lower + same + higher;
    var others = total - 1;
    var base = { total: total, others: others, lower: lower, same: same, higher: higher };
    if (others <= 0) { base.first = true; return base; }
    var beat = (lower + (same - 1) / 2) / others;
    var topRaw = Math.round((1 - beat) * 1e6) / 1e4;
    base.first = false;
    base.beat = beat;
    base.top = clamp(Math.ceil(topRaw), 1, 100);
    base.beatPct = clamp(Math.floor(Math.round(beat * 1e6) / 1e4), 0, 100);
    return base;
  }

  return {
    W: W, H: H, SKIER_Y: SKIER_Y, EDGE: EDGE, HIT_R: HIT_R, MAX_VX: MAX_VX, STEER_RESP: STEER_RESP, TURN_DRAG: TURN_DRAG,
    SPEED0: SPEED0, ACCEL: ACCEL, MAX_SPEED: MAX_SPEED, GAP0: GAP0, GAP_MIN: GAP_MIN, SHIFT_K: SHIFT_K, LANE_MIN: LANE_MIN,
    LANE_HALF: LANE_HALF, JITTER: JITTER, FIRST_ROW: FIRST_ROW, SPAWN_AHEAD: SPAWN_AHEAD, KINDS: KINDS, RADIUS: RADIUS,
    GATE_HALF_MIN: GATE_HALF_MIN, GATE_HALF0: GATE_HALF0, FLAG_R: FLAG_R, GATE_BONUS: GATE_BONUS, COMBO_MAX: COMBO_MAX,
    PX_PER_M: PX_PER_M, TICK_MS: TICK_MS, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET, TIERS: TIERS,
    mulberry32: mulberry32, randomSeed: randomSeed, speedAt: speedAt, rowGapAt: rowGapAt, shiftAt: shiftAt, gateHalfAt: gateHalfAt,
    densityAt: densityAt, spawnAhead: spawnAhead, newGame: newGame, start: start, setSteer: setSteer, step: step, meters: meters, score: score,
    nextRow: nextRow, autoSteer: autoSteer, tierOf: tierOf, bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
