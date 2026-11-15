/* apps/sled/sled-core.js — 썰매 레이스(Sled Race) 로직 (언어 무관, UMD: 브라우저 window.SLED_CORE + Node 검사 공용)
 *
 * 좌표(게임 단위, 화면 px 아님): 폭 W(360), 높이 H(600). 위에서 내려다본 끝없는 눈 언덕.
 *   - 썰매는 화면 위쪽 SLED_Y 에 고정, 세계(dist)가 위로 흐른다. 물건의 세계 y = 언덕 위 거리, 화면 y = SLED_Y + (y − dist).
 *   - 조종: 방향 dir(−1·0·1) 또는 목표 x(tx). 옆 속도 vx 는 목표(dir × MAX_VX)를 STEER_RESP 로 따라간다. 양 끝(EDGE)은 막힘.
 *   - 속도: 시간에 따라 targetSpeed(elapsed) 로 빨라진다(SPEED_MIN → SPEED_MAX, RAMP_MS 에 최대). 부딪히면 HIT_SLOW 배로 느려졌다가 ACCEL 로 회복.
 *   - 코스: 줄(row) 단위로 미리 만든다. 줄마다 안전한 길(path) 이 있고(장애물은 길 양쪽 CORR 안에 두지 않음),
 *     다음 줄의 길은 썰매가 따라갈 수 있는 만큼만 움직인다 → 언제나 지나갈 수 있다(check 가 자동 조종으로 확인).
 *   - 물건: 장애물(tree 소나무·rock 바위·snowman 눈사람) — 닿으면 하트 −1·HIT_INV 동안 무적(깜빡임)·속도 줄어듦.
 *           모을 것(flag 깃발 +10 · gift 선물 +30 · star 황금 별 +100, 드묾).
 *           점프대(ramp) — 땅에 있을 때 지나면 AIR_MS 동안 공중(장애물 무시) + AIR_PTS 보너스.
 *   - 점수 = 내려온 거리 점수(floor(dist / DIST_DIV)) + 보너스(모은 것·점프). 거리(m) = dist / 10.
 *   - 한 판 = ROUND_MS(90초, 결승선 finish) 또는 하트 3개를 다 잃을 때(crash). 첫 입력(start) 뒤부터 시간이 흐른다.
 *   - 난수: 시드 = crypto.getRandomValues(없으면 Math.random), 판 안의 모든 무작위 = mulberry32(시드).
 *   - 고정 시간 간격: step(s, dtMs, ctrl) 는 dt 를 모아 TICK_MS(1/120초)마다 tick → 같은 시드 + 같은 입력 = 같은 판. 큰 dt 는 MAX_STEP 으로 자른다.
 *     ctrl(s) 가 { dir } 또는 { tx } 를 돌려주면 그 tick 의 입력으로 쓴다(자동 조종·검사용).
 *   - 사건: { type:'item'|'ouch'|'jump'|'land'|'finish'|'crash', ... }.
 * 서버 점수 분포(supa.submitScore): bucket(score) = min(MAX_BUCKET, floor(score / 10)). plausible(s) 가 거짓이면 보내지 않는다.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SLED_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 600;
  var SLED_Y = 180, SLED_R = 11;
  var EDGE = 18;
  var MAX_VX = 260, STEER_RESP = 10;
  var SPEED_MIN = 210, SPEED_MAX = 500, ACCEL = 150, HIT_SLOW = 0.55;
  var ROUND_MS = 90000, RAMP_MS = 75000;
  var HEARTS = 3, HIT_INV = 1600;
  var AIR_MS = 950, AIR_PTS = 20;
  var DIST_DIV = 40;                   // 거리 점수: 40 단위(4 m)마다 1점
  var FIRST_ROW = 380;
  var KINDS = [
    { id: 'tree', type: 'obstacle', r: 17 },
    { id: 'rock', type: 'obstacle', r: 14 },
    { id: 'snowman', type: 'obstacle', r: 15 },
    { id: 'flag', type: 'item', r: 12, pts: 10 },
    { id: 'gift', type: 'item', r: 13, pts: 30 },
    { id: 'star', type: 'item', r: 13, pts: 100 },
    { id: 'ramp', type: 'ramp', r: 26, h: 10 }
  ];
  var KIND_BY_ID = {};
  KINDS.forEach(function (k, i) { k.index = i; KIND_BY_ID[k.id] = k; });
  var HIT_K = 0.78;                    // 장애물 충돌 반지름 = r × HIT_K (그림보다 조금 작게)
  var GRAB_PAD = 6;                    // 모을 것은 조금 넉넉하게
  var TICK_MS = 1000 / 120;
  var MAX_STEP = 100;
  var GAME = 'sled';
  var MAX_BUCKET = 600;
  var MAX_PLAUSIBLE = 6000;            // 이보다 높은 점수는 서버에 보내지 않는다(조작 의심)
  var TIERS = [0, 500, 1100, 1700, 2400, 3100];  // 등급 6단계 하한(점)

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
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

  // 난이도 0..1 (지난 시간 기준)
  function level(s) { return clamp(s.elapsed / RAMP_MS, 0, 1); }
  function targetSpeed(elapsed) { return lerp(SPEED_MIN, SPEED_MAX, clamp(elapsed / RAMP_MS, 0, 1)); }
  function rules(s) {
    var d = level(s);
    return {
      gap: lerp(170, 108, d),
      corr: lerp(60, 46, d),
      more1: lerp(0.4, 0.8, d),
      more2: lerp(0.05, 0.5, d),
      itemChance: lerp(0.5, 0.42, d)
    };
  }

  function newGame(seed) {
    var sd = seed == null ? randomSeed() : seed >>> 0;
    var s = {
      seed: sd, rnd: mulberry32(sd),
      started: false, over: false, endReason: '',
      timeLeft: ROUND_MS, elapsed: 0,
      x: W / 2, vx: 0, dir: 0, tx: null,
      dist: 0, speed: SPEED_MIN,
      hearts: HEARTS, inv: 0, air: 0,
      objs: [], objSeq: 0, rows: [], rowCount: 0, lastRowY: 0, path: W / 2, nextRamp: 5, lastRamp: false,
      bonus: 0, flags: 0, gifts: 0, stars: 0, jumps: 0, hits: 0,
      acc: 0, ticks: 0, submitted: false
    };
    s.lastRowY = FIRST_ROW - 170;
    fill(s);
    return s;
  }
  function start(s) { if (!s.started && !s.over) s.started = true; return s; }
  function setSteer(s, dir) { s.tx = null; s.dir = clamp(Math.round(Number(dir) || 0), -1, 1); }
  function setTarget(s, tx) { if (tx == null || !isFinite(Number(tx))) { s.tx = null; return; } s.tx = clamp(Number(tx), EDGE, W - EDGE); }

  function addObj(s, kind, x, y, row) {
    var o = { id: ++s.objSeq, kind: kind, x: x, y: y, row: row, done: false, look: Math.floor(s.rnd() * 4) };
    s.objs.push(o);
    return o;
  }
  function freeAt(list, x, minD) {
    for (var i = 0; i < list.length; i++) if (Math.abs(list[i] - x) < minD) return false;
    return true;
  }

  // 줄 하나 만들기: 길(path) 이동 → 장애물(길 양쪽 corr 밖) → (가끔) 점프대 → 줄 사이 모을 것
  function makeRow(s) {
    var R = rules(s);
    var gap = R.gap * (0.9 + 0.2 * s.rnd());
    var y = s.lastRowY + gap;
    // 썰매가 이 줄까지 오는 동안 옆으로 갈 수 있는 거리의 절반 정도만 길을 옮긴다
    var fast = targetSpeed(s.elapsed + 2500);
    var maxShift = MAX_VX * (gap / fast) * 0.5;
    var prev = s.path;
    var path = clamp(prev + (s.rnd() * 2 - 1) * maxShift, 52, W - 52);
    var idx = s.rowCount;
    var rampRow = idx >= s.nextRamp;
    var n = 1 + (s.rnd() < R.more1 ? 1 : 0) + (s.rnd() < R.more2 ? 1 : 0) + (s.lastRamp ? 1 : 0);
    var xs = [];
    for (var i = 0; i < n; i++) {
      for (var tries = 0; tries < 8; tries++) {
        var x = EDGE + 2 + s.rnd() * (W - 2 * EDGE - 4);
        if (Math.abs(x - path) < R.corr || !freeAt(xs, x, 36)) continue;
        xs.push(x);
        var r = s.rnd();
        addObj(s, r < 0.5 ? 'tree' : r < 0.8 ? 'rock' : 'snowman', x, y + (s.rnd() * 10 - 5), idx);
        break;
      }
    }
    if (rampRow) {
      addObj(s, 'ramp', path, y, idx);
      s.nextRamp = idx + 9 + Math.floor(s.rnd() * 6);
    }
    // 줄과 줄 사이(다음 줄 쪽 절반 지점)에 모을 것
    if (s.rnd() < R.itemChance) {
      var kr = s.rnd();
      var kind = kr < (rampRow ? 0.12 : 0.03) ? 'star' : kr < 0.27 ? 'gift' : 'flag';
      var iy = y + gap * 0.5;
      var ix;
      if (s.rnd() < 0.7) ix = clamp(path + (s.rnd() * 2 - 1) * 22, EDGE + 6, W - EDGE - 6);
      else ix = EDGE + 10 + s.rnd() * (W - 2 * EDGE - 20);
      addObj(s, kind, ix, iy, idx);
    }
    s.rows.push({ y: y, path: path, ramp: rampRow });
    s.rowCount++;
    s.lastRamp = rampRow;
    s.path = path;
    s.lastRowY = y;
  }

  // 화면 아래 끝 너머까지 코스를 채우고, 지나간 것은 버린다
  function fill(s) {
    while (s.lastRowY < s.dist + (H - SLED_Y) + 80) makeRow(s);
    var cut = s.dist - SLED_Y - 60;
    if (s.objs.length && s.objs[0].y < cut) s.objs = s.objs.filter(function (o) { return o.y >= cut; });
    while (s.rows.length > 1 && s.rows[0].y < cut) s.rows.shift();
  }

  function kindOf(o) { return KIND_BY_ID[o && o.kind] || KINDS[0]; }
  function score(s) { return s ? Math.floor(s.dist / DIST_DIV) + s.bonus : 0; }
  function meters(s) { return s ? Math.floor(s.dist / 10) : 0; }
  function items(s) { return s ? s.flags + s.gifts + s.stars : 0; }

  function collide(s, evs) {
    for (var i = 0; i < s.objs.length; i++) {
      var o = s.objs[i];
      if (o.done) continue;
      var dy = o.y - s.dist;
      if (dy > 40) break;              // 물건은 y 순서로 쌓인다 (줄 단위) — 멀리 있는 것은 아직
      if (dy < -40) continue;
      var k = kindOf(o);
      var dx = o.x - s.x;
      if (k.type === 'ramp') {
        if (s.air <= 0 && Math.abs(dx) < k.r + 3 && Math.abs(dy) < k.h + SLED_R * 0.5) {
          o.done = true;
          s.air = AIR_MS; s.jumps++; s.bonus += AIR_PTS;
          evs.push({ type: 'jump', pts: AIR_PTS, x: o.x });
        }
        continue;
      }
      var d2 = dx * dx + dy * dy;
      if (k.type === 'item') {
        var rr = k.r + SLED_R + GRAB_PAD;
        if (d2 < rr * rr) {
          o.done = true;
          s.bonus += k.pts;
          if (k.id === 'flag') s.flags++; else if (k.id === 'gift') s.gifts++; else s.stars++;
          evs.push({ type: 'item', kind: k.id, pts: k.pts, x: o.x });
        }
        continue;
      }
      if (s.air > 0 || s.inv > 0) continue;
      var hr = k.r * HIT_K + SLED_R;
      if (d2 < hr * hr) {
        o.done = true; o.hit = true;
        s.hearts = Math.max(0, s.hearts - 1); s.hits++;
        s.inv = HIT_INV; s.speed *= HIT_SLOW; s.vx *= 0.3;
        evs.push({ type: 'ouch', kind: k.id, hearts: s.hearts, x: o.x });
        if (s.hearts <= 0) {
          s.over = true; s.endReason = 'crash';
          evs.push({ type: 'crash' });
          return;
        }
      }
    }
  }

  function tick(s, evs, ctrl) {
    var dt = TICK_MS, sec = dt / 1000;
    s.ticks++;
    if (ctrl) {
      var c = ctrl(s);
      if (c) {
        if (c.tx != null) setTarget(s, c.tx);
        else if (c.dir != null) setSteer(s, c.dir);
      }
    }
    s.timeLeft -= dt; s.elapsed += dt;
    if (s.timeLeft <= 0) {
      s.timeLeft = 0;
      s.over = true; s.endReason = 'finish';
      evs.push({ type: 'finish' });
      return;
    }
    // 옆으로
    var dir = s.dir;
    if (s.tx != null) dir = clamp((s.tx - s.x) / 26, -1, 1);
    s.vx += (dir * MAX_VX - s.vx) * Math.min(1, STEER_RESP * sec);
    s.x += s.vx * sec;
    if (s.x < EDGE) { s.x = EDGE; if (s.vx < 0) s.vx = 0; }
    else if (s.x > W - EDGE) { s.x = W - EDGE; if (s.vx > 0) s.vx = 0; }
    // 앞으로
    var ts = targetSpeed(s.elapsed);
    if (s.speed < ts) s.speed = Math.min(ts, s.speed + ACCEL * sec);
    else s.speed = ts;
    s.dist += s.speed * sec;
    if (s.inv > 0) s.inv = Math.max(0, s.inv - dt);
    if (s.air > 0) {
      s.air -= dt;
      if (s.air <= 0) { s.air = 0; evs.push({ type: 'land' }); }
    }
    collide(s, evs);
    if (s.over) return;
    fill(s);
  }

  // dtMs 만큼 진행 (TICK_MS 단위로 쪼갬). 준비 상태·끝난 판은 움직이지 않는다.
  function step(s, dtMs, ctrl) {
    var evs = [];
    if (!s.started || s.over) return evs;
    s.acc += clamp(Number(dtMs) || 0, 0, MAX_STEP);
    while (s.acc >= TICK_MS && !s.over) { s.acc -= TICK_MS; tick(s, evs, ctrl); }
    return evs;
  }

  function tierOf(sc) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (sc >= TIERS[i]) t = i;
    return t;
  }
  function plausible(s) {
    if (!s || !s.over) return false;
    var sc = score(s);
    if (sc < 0 || sc > MAX_PLAUSIBLE) return false;
    if (s.dist > SPEED_MAX * s.elapsed / 1000 + 1) return false;
    if (s.bonus !== s.flags * 10 + s.gifts * 30 + s.stars * 100 + s.jumps * AIR_PTS) return false;
    if (s.endReason === 'finish') return s.elapsed >= ROUND_MS - 1 && s.hearts > 0;
    if (s.endReason === 'crash') return s.hearts === 0 && s.hits === HEARTS && s.elapsed > 0;
    return false;
  }

  // 자동 조종(검사·흐름 검사용): 다가오는 줄의 안전한 길을 따라가고, 가까운 모을 것이 길 근처면 줍는다.
  function autoPlay(s) {
    var row = null;
    for (var i = 0; i < s.rows.length; i++) { if (s.rows[i].y > s.dist - 4) { row = s.rows[i]; break; } }
    if (!row) return { tx: W / 2 };
    var tx = row.path;
    var R = rules(s);
    for (var j = 0; j < s.objs.length; j++) {
      var o = s.objs[j];
      if (o.done || kindOf(o).type !== 'item') continue;
      var dy = o.y - s.dist;
      if (dy < 0 || dy > row.y - s.dist + 1) continue;
      if (Math.abs(o.x - row.path) < R.corr - 16) { tx = o.x; break; }
    }
    return { tx: tx };
  }

  function bucket(sc) {
    var n = Math.floor(Number(sc) / 10);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }
  // Supabase 응답 [{ score_bucket, players }] → [{ bucket, players }] (정렬, 같은 구간 합치기, 잘못된 행 버리기)
  function normalizeHist(rows) {
    if (!Array.isArray(rows)) return null;
    var map = {};
    rows.forEach(function (r) {
      if (!r) return;
      var b = Number(r.score_bucket != null ? r.score_bucket : r.bucket);
      var p = Number(r.players);
      if (!isFinite(b) || !isFinite(p) || p <= 0 || b < 0 || b > MAX_BUCKET) return;
      b = Math.round(b);
      map[b] = (map[b] || 0) + Math.round(p);
    });
    return Object.keys(map).map(Number).sort(function (a, b) { return a - b; })
      .map(function (b) { return { bucket: b, players: map[b] }; });
  }
  // 높을수록 좋음. 내 구간의 다른 사람은 절반만 이긴 것으로 센다.
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
    W: W, H: H, SLED_Y: SLED_Y, SLED_R: SLED_R, EDGE: EDGE, MAX_VX: MAX_VX, STEER_RESP: STEER_RESP,
    SPEED_MIN: SPEED_MIN, SPEED_MAX: SPEED_MAX, ACCEL: ACCEL, HIT_SLOW: HIT_SLOW, ROUND_MS: ROUND_MS, RAMP_MS: RAMP_MS,
    HEARTS: HEARTS, HIT_INV: HIT_INV, AIR_MS: AIR_MS, AIR_PTS: AIR_PTS, DIST_DIV: DIST_DIV, KINDS: KINDS, KIND_BY_ID: KIND_BY_ID, HIT_K: HIT_K,
    TICK_MS: TICK_MS, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET, MAX_PLAUSIBLE: MAX_PLAUSIBLE, TIERS: TIERS,
    mulberry32: mulberry32, randomSeed: randomSeed, level: level, targetSpeed: targetSpeed, rules: rules, kindOf: kindOf,
    newGame: newGame, start: start, setSteer: setSteer, setTarget: setTarget, step: step, fill: fill,
    score: score, meters: meters, items: items, tierOf: tierOf, plausible: plausible, autoPlay: autoPlay,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
