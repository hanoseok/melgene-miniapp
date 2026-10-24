/* apps/bat/bat-core.js — 할로윈 박쥐 날기(Flappy Bat) 로직 (언어 무관, UMD: 브라우저 window.BAT_CORE + Node 검사 공용)
 *
 * 좌표(게임 단위, 화면 px 아님): 세계 W×H(360×600), 땅 윗면 y = GROUND. y 는 아래로 갈수록 커진다.
 *   - 박쥐: x = BAT_X 고정, y·vy. 그림 반지름 BAT_R, 충돌 반지름 HIT_R(그림보다 작게 — 너그러운 판정).
 *   - 기둥(묘비·유령 나무): { n, x, gapY(틈 가운데), gap(틈 높이), kind, scored }, 폭 PW. 위 기둥 = y < gapY - gap/2, 아래 기둥 = y > gapY + gap/2.
 *     n 번째 기둥의 틈 = gapOf(n) = max(GAP_MIN, GAP0 - GAP_STEP × n), 앞 기둥과 틈 가운데 차이는 MAX_SHIFT 이하(언제나 지나갈 수 있게).
 *     기둥 사이 거리는 SPACING(단위, 고정). 속도 speedOf(점수) = min(MAX_SPEED, SPEED0 + SPEED_STEP × 점수) 단위/초.
 *   - 고정 시간 간격: step(s, dtMs) 는 dt 를 모아 TICK_MS(1/120초)마다 tick 을 돈다 → 같은 시드 + 같은 tick 에 같은 날갯짓 = 같은 판.
 *     큰 dt 는 MAX_STEP 으로 자른다(탭 전환·느린 프레임 보호).
 *   - 준비 상태(started = false): 박쥐는 제자리, 기둥 없음. 첫 flap() 이 판을 시작한다.
 *   - 점수: 기둥 오른쪽 끝이 박쥐 충돌 원 왼쪽을 지나면 +1. 기둥(원-사각형)이나 땅에 닿으면 끝(over). 천장은 막혀 있을 뿐(죽지 않음).
 *   - 끝난 뒤에도 tick 은 박쥐를 땅까지 떨어뜨린다(그림용, grounded).
 * step(s, dt, onTick) — onTick(s) 가 true 를 돌려주면 그 tick 직전에 날갯짓(자동 비행·검사용). 돌려주는 값 = 이번에 생긴 사건 배열
 *   [{ type:'score', score } | { type:'hit', what:'pillar'|'ground' }].
 * autoFlap(s, aim) — 다음 틈 가운데보다 조금 아래를 노리는 단순한 자동 비행(검사·흐름 검사용).
 * 서버 점수 분포(supa.submitScore): bucket(score) = score (0..1999 정수 — 서버 한도 2000 구간 안).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BAT_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 600;
  var GROUND = 548;           // 땅 윗면
  var BAT_X = 104;            // 박쥐 가로 위치(고정)
  var BAT_R = 17;             // 그림 반지름
  var HIT_R = 11;             // 충돌 반지름(그림보다 작게)
  var GRAVITY = 1500;         // 단위/초²
  var FLAP_V = -430;          // 날갯짓 직후 세로 속도
  var MAX_FALL = 700;         // 최대 낙하 속도
  var PW = 62;                // 기둥 폭
  var SPACING = 214;          // 기둥 사이 거리(앞 기둥 x → 다음 기둥 x)
  var FIRST_X = W + 20;       // 첫 기둥이 나타나는 자리
  var SPEED0 = 138, SPEED_STEP = 2, MAX_SPEED = 196;   // 단위/초
  var GAP0 = 178, GAP_STEP = 2, GAP_MIN = 134;         // 틈 높이
  var MARGIN = 64;            // 틈 위·아래 끝이 화면 위/땅에서 떨어진 최소 거리
  var MAX_SHIFT = 120;        // 앞 기둥과 틈 가운데의 최대 차이
  var TICK_MS = 1000 / 120;
  var MAX_STEP = 100;
  var GAME = 'bat';
  var MAX_BUCKET = 1999;

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

  function speedOf(score) { return Math.min(MAX_SPEED, SPEED0 + SPEED_STEP * Math.max(0, score)); }
  function gapOf(n) { return Math.max(GAP_MIN, GAP0 - GAP_STEP * Math.max(0, n)); }
  function gapRange(gap) { return [MARGIN + gap / 2, GROUND - MARGIN - gap / 2]; }

  function spawnPillar(s, x) {
    var n = s.nextN++;
    var gap = gapOf(n);
    var r = gapRange(gap);
    var y;
    if (s.lastGapY == null) y = r[0] + (r[1] - r[0]) * (0.3 + 0.4 * s.rnd());
    else {
      var lo = Math.max(r[0], s.lastGapY - MAX_SHIFT), hi = Math.min(r[1], s.lastGapY + MAX_SHIFT);
      y = lo + (hi - lo) * s.rnd();
    }
    y = Math.round(y * 100) / 100;
    s.lastGapY = y;
    var p = { n: n, x: x, gapY: y, gap: gap, kind: s.rnd() < 0.5 ? 0 : 1, scored: false };
    s.pillars.push(p);
    return p;
  }

  function newGame(seed) {
    var sd = seed == null ? (Math.random() * 4294967296) >>> 0 : seed >>> 0;
    return {
      seed: sd, rnd: mulberry32(sd),
      y: GROUND * 0.45, vy: 0, started: false, over: false, grounded: false, hit: null,
      pillars: [], nextN: 0, lastGapY: null,
      score: 0, flaps: 0, ticks: 0, flyTicks: 0, dist: 0, acc: 0
    };
  }

  function flap(s) {
    if (s.over) return false;
    s.started = true;
    s.vy = FLAP_V;
    s.flaps++;
    return true;
  }

  // 원(cx, cy, r) 과 사각형(x0..x1, y0..y1) 이 겹치는지
  function circleRect(cx, cy, r, x0, y0, x1, y1) {
    var dx = Math.max(x0 - cx, 0, cx - x1);
    var dy = Math.max(y0 - cy, 0, cy - y1);
    return dx * dx + dy * dy < r * r;
  }
  function hitsPillar(p, y) {
    var top = p.gapY - p.gap / 2, bot = p.gapY + p.gap / 2;
    return circleRect(BAT_X, y, HIT_R, p.x, -10000, p.x + PW, top) || circleRect(BAT_X, y, HIT_R, p.x, bot, p.x + PW, GROUND + 10000);
  }

  function tick(s, events) {
    var dt = TICK_MS / 1000;
    s.ticks++;
    if (!s.started) return;
    if (s.over) {
      if (s.grounded) return;
      s.vy = Math.min(MAX_FALL, s.vy + GRAVITY * dt);
      s.y += s.vy * dt;
      if (s.y < HIT_R) s.y = HIT_R;
      if (s.y >= GROUND - BAT_R * 0.6) { s.y = GROUND - BAT_R * 0.6; s.vy = 0; s.grounded = true; }
      return;
    }
    s.flyTicks++;
    s.vy = Math.min(MAX_FALL, s.vy + GRAVITY * dt);
    s.y += s.vy * dt;
    if (s.y < HIT_R) { s.y = HIT_R; if (s.vy < 0) s.vy = 0; }
    var dx = speedOf(s.score) * dt;
    s.dist += dx;
    if (!s.pillars.length) spawnPillar(s, FIRST_X);
    for (var i = 0; i < s.pillars.length; i++) s.pillars[i].x -= dx;
    var last = s.pillars[s.pillars.length - 1];
    if (last.x <= FIRST_X - SPACING) spawnPillar(s, last.x + SPACING);
    while (s.pillars.length && s.pillars[0].x + PW < -20) s.pillars.shift();
    for (var j = 0; j < s.pillars.length; j++) {
      var p = s.pillars[j];
      if (!p.scored && p.x + PW < BAT_X - HIT_R) {
        p.scored = true;
        s.score++;
        events.push({ type: 'score', score: s.score });
      }
      if (hitsPillar(p, s.y)) { s.over = true; s.hit = 'pillar'; s.vy = Math.max(0, s.vy); events.push({ type: 'hit', what: 'pillar' }); return; }
    }
    if (s.y + HIT_R >= GROUND) {
      s.y = GROUND - HIT_R;
      s.over = true; s.hit = 'ground';
      events.push({ type: 'hit', what: 'ground' });
    }
  }

  // dt(ms) 만큼 고정 간격 tick 을 돈다. onTick(s) → true 면 그 tick 직전에 날갯짓.
  function step(s, dt, onTick) {
    var events = [];
    s.acc += clamp(Number(dt) || 0, 0, MAX_STEP);
    while (s.acc >= TICK_MS - 1e-9) {
      s.acc -= TICK_MS;
      if (onTick && !s.over && onTick(s)) flap(s);
      tick(s, events);
    }
    return events;
  }

  // 아직 지나지 않은 가장 가까운 기둥
  function nextPillar(s) {
    for (var i = 0; i < s.pillars.length; i++) if (s.pillars[i].x + PW >= BAT_X - HIT_R) return s.pillars[i];
    return null;
  }

  // 자동 비행: 틈 가운데보다 aim(기본 틈 높이의 0.2) 아래를 목표로, 그보다 낮고 떨어지는 중이면 날갯짓
  function autoFlap(s, aim) {
    if (s.over) return false;
    var p = nextPillar(s);
    var target = p ? p.gapY + p.gap * (aim == null ? 0.2 : aim) : GROUND * 0.5;
    return s.y > target && s.vy > -90;
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (높을수록 좋음)
  function bucket(score) {
    var n = Math.round(Number(score));
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
   * 같은 구간은 절반만 이긴 것으로 친다. beat 0~1, top = "상위 N%" 1~100, beatPct = "N%보다 높아요" 0~100.
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
    W: W, H: H, GROUND: GROUND, BAT_X: BAT_X, BAT_R: BAT_R, HIT_R: HIT_R, GRAVITY: GRAVITY, FLAP_V: FLAP_V, MAX_FALL: MAX_FALL,
    PW: PW, SPACING: SPACING, FIRST_X: FIRST_X, SPEED0: SPEED0, SPEED_STEP: SPEED_STEP, MAX_SPEED: MAX_SPEED,
    GAP0: GAP0, GAP_STEP: GAP_STEP, GAP_MIN: GAP_MIN, MARGIN: MARGIN, MAX_SHIFT: MAX_SHIFT, TICK_MS: TICK_MS, MAX_STEP: MAX_STEP,
    GAME: GAME, MAX_BUCKET: MAX_BUCKET,
    speedOf: speedOf, gapOf: gapOf, gapRange: gapRange, newGame: newGame, flap: flap, step: step,
    circleRect: circleRect, hitsPillar: hitsPillar, nextPillar: nextPillar, autoFlap: autoFlap,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
