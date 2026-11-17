/* apps/reindeer/reindeer-core.js — 순록 점프(Reindeer Jump) 로직 (언어 무관, UMD: 브라우저 window.REINDEER_CORE + Node 검사 공용)
 *
 * 좌표(게임 단위, 화면 px 아님): 폭 W(360), 높이 H(420). 옆에서 본 끝없는 눈 덮인 밤 지붕들(가로 스크롤).
 *   - 순록은 화면 x = RX 에 고정, 세계가 왼쪽으로 흐른다. 세계 x 는 오른쪽으로 커진다. 순록의 세계 x = dist + RX.
 *   - 높이 h = 발이 지붕 높이(ROOF_Y)보다 얼마나 위에 있나(위가 +). 모든 지붕은 같은 높이, 지붕과 지붕 사이에 틈(gap).
 *   - 점프(한 버튼): 누르는 순간 땅이면 점프(JUMP_V), 공중이면 한 번만 2단 점프(DJUMP_V). 누르고 있는 동안 올라갈 때는
 *     중력이 약하다(G_HOLD) → 길게 누르면 높이, 짧게 누르면 낮게(G_FALL). 땅에서 막 벗어난 직후(COYOTE_MS)도 점프 가능,
 *     착지 직전에 누른 것(BUFFER_MS)은 착지하자마자 점프.
 *   - 틈에 빠지면(발이 지붕 높이보다 FALL_DEAD 아래) 바로 끝(fall). 장애물(굴뚝 chimney · 눈 더미 pile · 고드름 얼음 ice · 까마귀 crow)에
 *     닿으면 하트 −1, HIT_INV 동안 무적(깜빡임). 하트 3개를 다 잃으면 끝(crash). 굴뚝 연기는 장식(닿아도 괜찮음).
 *   - 모을 것: 선물 present +10, 황금 방울 bell +50(드묾). 달린 거리도 계속 점수(floor(dist / DIST_DIV)).
 *   - 속도: 시간에 따라 SPEED_MIN → SPEED_MAX(RAMP_MS 에 최대). 부딪혀도 느려지지 않는다(→ 만든 뒤 속도는 줄지 않음).
 *   - 코스: 위험(틈·장애물)마다 "꼭대기가 위험 한가운데 오도록 길게 누른 점프"(JUMP 표, 이 파일이 tick 으로 직접 잰 값)로
 *     넘을 수 있게 만든다. 틈 폭 ≤ GAP_FRAC × 지금 속도 × 공중 시간, 위험 사이 간격 ≥ 착지 → 다음 도약 사이 RUN_S 초 달리기
 *     (나중 속도 vHi 기준). 만든 뒤 속도는 오르기만 하므로 언제나 넘을 수 있다(check 가 물리 계산 + 자동 점프 40판으로 확인).
 *   - 난수: 시드 = crypto.getRandomValues(없으면 Math.random), 판 안의 모든 무작위 = mulberry32(시드).
 *   - 고정 시간 간격: step(s, dtMs, ctrl) 는 dt 를 모아 TICK_MS(1/120초)마다 tick → 같은 시드 + 같은 입력 = 같은 판. 큰 dt 는 MAX_STEP 으로 자른다.
 *     ctrl(s) 가 { hold: true|false } 를 돌려주면 그 tick 의 입력으로 쓴다(자동 점프·검사용).
 *   - 사건: { type:'jump'|'djump'|'land'|'item'|'ouch'|'fall'|'crash', ... }.
 * 서버 점수 분포(supa.submitScore): bucket(score) = min(MAX_BUCKET, floor(score / 10)). plausible(s) 가 거짓이면 보내지 않는다.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.REINDEER_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 420;
  var ROOF_Y = 300;                     // 지붕 윗면의 화면 y
  var RX = 86;                          // 순록의 화면 x (가운데)
  var HW = 15, HH = 30;                 // 순록 충돌 상자: 가로 ±HW, 높이 HH (그림보다 조금 작게)
  var FOOT = 11;                        // 발 폭 ±FOOT 중 한 곳이라도 지붕 위면 서 있음
  var JUMP_V = 640, DJUMP_V = 560, G_HOLD = 1500, G_FALL = 2900, MAX_FALL = 1100, CEIL = 262;
  var COYOTE_MS = 90, BUFFER_MS = 120;
  var FALL_DEAD = 8;
  var SPEED_MIN = 250, SPEED_MAX = 520, RAMP_MS = 150000;
  var HEARTS = 3, HIT_INV = 1500;
  var DIST_DIV = 20;                    // 20 단위 = 1 m = 1점
  var GAP_FRAC = 0.72, GAP_MIN = 56;
  var RUN_S = 0.14;                     // 착지 → 다음 도약 사이 최소 달리기(초)
  var LOOK_MS = 9000;                   // 만든 뒤 도착까지 걸릴 수 있는 최대 시간(속도 상한 vHi 계산)
  var KINDS = [
    { id: 'chimney', type: 'obstacle' },
    { id: 'pile', type: 'obstacle', w: 44, h: 18 },
    { id: 'ice', type: 'obstacle', w: 24, h: 26 },
    { id: 'crow', type: 'obstacle', w: 30, h0: 20, h1: 42 },
    { id: 'present', type: 'item', r: 12, pts: 10 },
    { id: 'bell', type: 'item', r: 12, pts: 50 }
  ];
  var KIND_BY_ID = {};
  KINDS.forEach(function (k, i) { k.index = i; KIND_BY_ID[k.id] = k; });
  var GRAB_PAD = 6;
  var TICK_MS = 1000 / 120;
  var MAX_STEP = 100;
  var GAME = 'reindeer';
  var MAX_BUCKET = 20000;
  var MAX_PLAUSIBLE = 200000;           // 이보다 높은 점수는 서버에 보내지 않는다(조작 의심)
  var ITEMS_PER_S = 4;                  // 1초에 이보다 많이 모을 수는 없다(plausible)
  var TIERS = [0, 300, 800, 1600, 3000, 5500];  // 등급 6단계 하한(점)

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

  // 점프 한 번의 모양을 tick 으로 직접 잰다(평평한 지붕, 틈 없음): hold = 누르고 있는 시간(초, Infinity = 꼭대기까지)
  function profile(holdS) {
    var dt = TICK_MS / 1000, h = 0, vh = JUMP_V, t = 0, peak = 0, tPeak = 0, hs = [];
    for (var i = 0; i < 2000; i++) {
      var g = (t < holdS && vh > 0) ? G_HOLD : G_FALL;
      vh = Math.max(-MAX_FALL, vh - g * dt);
      h += vh * dt; t += dt;
      if (h > peak) { peak = h; tPeak = t; }
      if (h <= 0) { hs.push(0); break; }
      hs.push(h);
    }
    return { air: t, peak: peak, tPeak: tPeak, hs: hs };
  }
  var JUMP = profile(Infinity);         // 길게 누른 점프 (코스 보장의 기준)
  var TAP = profile(0);                 // 짧게 톡 친 점프

  // 장애물 충돌 상자(지붕 기준 높이)
  function boxOf(o) {
    var k = KIND_BY_ID[o.kind];
    if (o.kind === 'chimney') return { x0: o.x - o.w / 2, x1: o.x + o.w / 2, h0: 0, h1: o.h };
    if (o.kind === 'crow') return { x0: o.x - k.w / 2, x1: o.x + k.w / 2, h0: k.h0, h1: k.h1 };
    return { x0: o.x - k.w / 2, x1: o.x + k.w / 2, h0: 0, h1: k.h };
  }

  function level(s) { return clamp(s.elapsed / RAMP_MS, 0, 1); }
  function targetSpeed(elapsed) { return lerp(SPEED_MIN, SPEED_MAX, clamp(elapsed / RAMP_MS, 0, 1)); }
  function rules(s) {
    var d = level(s);
    return {
      gapChance: lerp(0.55, 0.92, d),
      obsMax: d < 0.15 ? 1 : d < 0.5 ? 2 : 3,
      obsChance: lerp(0.55, 0.85, d),
      crowChance: d < 0.18 ? 0 : lerp(0.15, 0.4, d),
      chimH: lerp(40, 62, d),
      roofS: [lerp(2.6, 1.7, d), lerp(4.2, 2.8, d)],   // 지붕 길이(초 × 속도)
      gapHi: lerp(0.55, 1, d),                         // 틈 폭 상한 비율(0..1 → GAP_FRAC 까지)
      extraRun: lerp(0.5, 0.15, d)                     // 위험 사이 여유 달리기(초, 최대)
    };
  }

  function newGame(seed) {
    var sd = seed == null ? randomSeed() : seed >>> 0;
    var s = {
      seed: sd, rnd: mulberry32(sd),
      started: false, over: false, endReason: '',
      elapsed: 0, dist: 0, speed: SPEED_MIN,
      h: 0, vh: 0, ground: true, holding: false, hold: false, pressQ: false, coyote: 0, buffer: 0, dbl: false,
      hearts: HEARTS, inv: 0,
      roofs: [], objs: [], haz: [], objSeq: 0,
      genX: 0, lastC: -1e9, lastA: 0,
      bonus: 0, presents: 0, bells: 0, jumps: 0, djumps: 0, hits: 0,
      acc: 0, ticks: 0, submitted: false
    };
    // 첫 지붕: 순록 뒤에서부터 넉넉하게
    s.roofs.push({ x0: -400, x1: RX + 560, look: 0 });
    s.genX = RX + 560;
    s.lastC = RX + 200; s.lastA = JUMP.air; // 첫 위험은 출발 뒤 조금 달린 다음부터
    fill(s);
    return s;
  }
  function start(s) { if (!s.started && !s.over) s.started = true; return s; }
  // 누름/뗌: 누르는 순간을 기억해 다음 tick 에 처리(한 프레임 안에 눌렀다 떼도 톡 점프 한 번)
  function setHold(s, on) {
    on = !!on;
    if (on && !s.hold) s.pressQ = true;
    s.hold = on;
  }

  function addObj(s, kind, x, extra) {
    var o = { id: ++s.objSeq, kind: kind, x: x, done: false, look: Math.floor(s.rnd() * 4) };
    if (extra) for (var k in extra) o[k] = extra[k];
    s.objs.push(o);
    return o;
  }
  function addHaz(s, kind, c, a, extra) {
    var z = { kind: kind, c: c, a: a };
    if (extra) for (var k in extra) z[k] = extra[k];
    s.haz.push(z);
    s.lastC = c; s.lastA = a;
    return z;
  }
  // 이전 위험(lastC, lastA) 뒤에 a 짜리 새 위험의 한가운데가 올 수 있는 가장 가까운 x (속도 v 기준)
  function nextC(s, a, v) { return s.lastC + v * (a + JUMP.air - s.lastA + RUN_S) + 10; }
  // 두 위험 사이 달리는 구간 [이전 착지, 다음 도약] 에 선물
  function presentsBetween(s, c0, a0, c1, a1, vHi) {
    var x0 = c0 - vHi * a0 + vHi * JUMP.air + 18;
    var x1 = c1 - vHi * a1 - 18;
    if (x1 - x0 < 30 || s.rnd() > 0.5) return;
    var n = Math.min(3, 1 + Math.floor((x1 - x0) / 60), 1 + Math.floor(s.rnd() * 3));
    var mid = (x0 + x1) / 2;
    for (var i = 0; i < n; i++) addObj(s, 'present', mid + (i - (n - 1) / 2) * 30, { ih: 14 });
  }

  // 지붕 하나 + (있으면) 그 끝의 틈을 만든다. 장애물은 지붕 위에, 위험 사이 간격은 vHi 기준.
  function makeRoof(s) {
    var R = rules(s);
    var vLo = targetSpeed(s.elapsed), vHi = targetSpeed(s.elapsed + LOOK_MS);
    var x0 = s.genX;                    // 이 지붕의 시작 (= 앞 틈의 끝)
    var len = vHi * lerp(R.roofS[0], R.roofS[1], s.rnd());
    var planned = x0 + len;
    var a = JUMP.tPeak;
    // 장애물
    var n = 0;
    for (var i = 0; i < R.obsMax; i++) if (s.rnd() < R.obsChance) n++;
    for (var j = 0; j < n; j++) {
      var kind, w, hgt;
      var kr = s.rnd();
      if (kr < R.crowChance) kind = 'crow';
      else if (kr < R.crowChance + (1 - R.crowChance) * 0.5) kind = 'chimney';
      else if (s.rnd() < 0.5) kind = 'pile';
      else kind = 'ice';
      if (kind === 'chimney') { w = 28 + Math.floor(s.rnd() * 7); hgt = Math.round(R.chimH * (0.85 + 0.15 * s.rnd())); }
      else w = KIND_BY_ID[kind].w;
      var c = Math.max(nextC(s, a, vHi) + s.rnd() * vHi * R.extraRun, x0 + w / 2 + 14);
      // 이 장애물을 넘은 뒤 지붕 끝 틈까지 달릴 자리가 있어야 함
      if (c + w / 2 + 14 > planned - vHi * 0.6) break;
      var pc = s.lastC, pa = s.lastA;
      var o = addObj(s, kind, c, kind === 'chimney' ? { w: w, h: hgt } : null);
      addHaz(s, kind, c, a, { w: w, top: kind === 'chimney' ? hgt : kind === 'crow' ? KIND_BY_ID.crow.h1 : KIND_BY_ID[kind].h, id: o.id });
      presentsBetween(s, pc, pa, c, a, vHi);
      // 굴뚝·까마귀 위 점프 꼭대기에 가끔 황금 방울
      if (s.rnd() < (kind === 'crow' ? 0.3 : 0.12)) addObj(s, 'bell', c, { ih: JUMP.peak + 8 });
    }
    // 끝의 틈
    var gapOn = s.rnd() < R.gapChance;
    var gMax = Math.max(GAP_MIN, GAP_FRAC * R.gapHi * vLo * JUMP.air);
    var g = gapOn ? GAP_MIN + s.rnd() * (gMax - GAP_MIN) : 0;
    var x1 = planned;
    if (gapOn) {
      var ga = JUMP.air / 2;
      var minC = nextC(s, ga, vHi);
      if (x1 + g / 2 < minC) x1 = minC - g / 2;
      var pc2 = s.lastC, pa2 = s.lastA;
      addHaz(s, 'gap', x1 + g / 2, ga, { w: g, x0: x1, x1: x1 + g });
      presentsBetween(s, pc2, pa2, x1 + g / 2, ga, vHi);
      if (s.rnd() < 0.18) addObj(s, 'bell', x1 + g / 2, { ih: JUMP.peak + 8 });
    }
    // 지붕 (틈이 없으면 다음 지붕과 맞붙음 — 모양만 다른 건물)
    s.roofs.push({ x0: x0, x1: x1, look: Math.floor(s.rnd() * 6), gapAfter: g, tall: Math.floor(s.rnd() * 3) });
    s.genX = x1 + g;
  }

  // 화면 오른쪽 너머까지 코스를 채우고, 지나간 것은 버린다
  function fill(s) {
    // 첫 지붕(출발 지붕) 다음부터 만든다
    var made = false;
    while (s.genX < s.dist + W + 420) { makeRoof(s); made = true; }
    if (made) s.objs.sort(function (a, b) { return a.x - b.x; });
    var cut = s.dist - 120;
    if (s.objs.length && s.objs[0].x < cut) s.objs = s.objs.filter(function (o) { return o.x >= cut; });
    while (s.roofs.length > 2 && s.roofs[0].x1 < cut) s.roofs.shift();
    while (s.haz.length && s.haz[0].c + (s.haz[0].w || 0) < cut) s.haz.shift();
  }

  function kindOf(o) { return KIND_BY_ID[o && o.kind] || KINDS[0]; }
  function px(s) { return s.dist + RX; }
  function score(s) { return s ? Math.floor(s.dist / DIST_DIV) + s.bonus : 0; }
  function meters(s) { return s ? Math.floor(s.dist / DIST_DIV) : 0; }
  function items(s) { return s ? s.presents + s.bells : 0; }

  function supported(s, x) {
    for (var i = 0; i < s.roofs.length; i++) {
      var r = s.roofs[i];
      if (x + FOOT > r.x0 && x - FOOT < r.x1) return true;
    }
    return false;
  }
  function roofAt(s, x) {
    for (var i = 0; i < s.roofs.length; i++) if (x >= s.roofs[i].x0 && x < s.roofs[i].x1) return s.roofs[i];
    return null;
  }

  function doJump(s, evs) {
    s.vh = JUMP_V; s.ground = false; s.coyote = 0; s.buffer = 0; s.holding = s.hold; s.jumps++;
    evs.push({ type: 'jump' });
  }
  function press(s, evs) {
    if (s.ground || s.coyote > 0) doJump(s, evs);
    else if (!s.dbl) { s.dbl = true; s.vh = DJUMP_V; s.holding = s.hold; s.djumps++; s.buffer = 0; evs.push({ type: 'djump' }); }
    else s.buffer = BUFFER_MS;
  }

  function collide(s, evs) {
    var x = px(s);
    for (var i = 0; i < s.objs.length; i++) {
      var o = s.objs[i];
      if (o.done) continue;
      if (o.x > x + 80) break;          // 물건은 x 순서로 쌓인다(지붕 단위) — 먼 것은 아직
      if (o.x < x - 80) continue;
      var k = kindOf(o);
      if (k.type === 'item') {
        var r = k.r + GRAB_PAD;
        if (o.x + r > x - HW && o.x - r < x + HW && o.ih + r > s.h && o.ih - r < s.h + HH) {
          o.done = true;
          s.bonus += k.pts;
          if (k.id === 'present') s.presents++; else s.bells++;
          evs.push({ type: 'item', kind: k.id, pts: k.pts, x: o.x, ih: o.ih });
        }
        continue;
      }
      if (s.inv > 0) continue;
      var b = boxOf(o);
      if (b.x1 > x - HW && b.x0 < x + HW && b.h1 > s.h && b.h0 < s.h + HH) {
        o.done = true; o.hit = true;
        s.hearts = Math.max(0, s.hearts - 1); s.hits++;
        s.inv = HIT_INV;
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
    if (ctrl) { var c = ctrl(s); if (c && c.hold != null) setHold(s, c.hold); }
    s.elapsed += dt;
    // 앞으로 (속도는 오르기만)
    s.speed = targetSpeed(s.elapsed);
    s.dist += s.speed * sec;
    var x = px(s);
    // 입력
    if (s.pressQ) { s.pressQ = false; press(s, evs); }
    if (!s.hold) s.holding = false;
    if (s.coyote > 0) s.coyote = Math.max(0, s.coyote - dt);
    if (s.buffer > 0) s.buffer = Math.max(0, s.buffer - dt);
    // 위아래
    if (s.ground) {
      if (!supported(s, x)) { s.ground = false; s.vh = 0; s.coyote = COYOTE_MS; }
    }
    if (!s.ground) {
      var g = (s.holding && s.vh > 0) ? G_HOLD : G_FALL;
      var prevH = s.h;
      s.vh = Math.max(-MAX_FALL, s.vh - g * sec);
      s.h += s.vh * sec;
      if (s.h > CEIL) { s.h = CEIL; if (s.vh > 0) s.vh = 0; }
      if (s.h <= 0 && s.vh <= 0) {
        if (prevH >= 0 && supported(s, x)) {
          s.h = 0; s.vh = 0; s.ground = true; s.dbl = false; s.coyote = 0;
          evs.push({ type: 'land' });
          if (s.buffer > 0) doJump(s, evs);
        } else if (s.h < -FALL_DEAD) {
          s.over = true; s.endReason = 'fall';
          evs.push({ type: 'fall' });
          return;
        }
      }
    }
    if (s.inv > 0) s.inv = Math.max(0, s.inv - dt);
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
    if (!s || !s.over || !(s.elapsed > 0)) return false;
    var sc = score(s);
    if (sc < 0 || sc > MAX_PLAUSIBLE) return false;
    if (s.dist > SPEED_MAX * s.elapsed / 1000 + 1) return false;
    if (s.bonus !== s.presents * 10 + s.bells * 50) return false;
    if (items(s) > ITEMS_PER_S * s.elapsed / 1000 + 3) return false;
    if (s.endReason === 'fall') return s.hearts > 0 && s.hits === HEARTS - s.hearts;
    if (s.endReason === 'crash') return s.hearts === 0 && s.hits === HEARTS;
    return false;
  }

  // 자동 점프(검사·흐름 검사용): 다음 위험의 한가운데가 "꼭대기 시간 × 속도" 앞에 오면 길게 누른다. 땅에 닿으면 뗀다.
  function autoPlay(s) {
    var x = px(s);
    if (!s.ground) return { hold: s.vh > 0 };
    for (var i = 0; i < s.haz.length; i++) {
      var z = s.haz[i];
      if (z.done) continue;
      if (z.c + (z.w || 0) / 2 < x - HW) { z.done = true; continue; }
      if (z.c - x <= s.speed * z.a + s.speed * TICK_MS / 2000) { z.done = true; return { hold: true }; }
      break;
    }
    return { hold: false };
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
    W: W, H: H, ROOF_Y: ROOF_Y, RX: RX, HW: HW, HH: HH, FOOT: FOOT,
    JUMP_V: JUMP_V, DJUMP_V: DJUMP_V, G_HOLD: G_HOLD, G_FALL: G_FALL, MAX_FALL: MAX_FALL, CEIL: CEIL, COYOTE_MS: COYOTE_MS, BUFFER_MS: BUFFER_MS, FALL_DEAD: FALL_DEAD,
    SPEED_MIN: SPEED_MIN, SPEED_MAX: SPEED_MAX, RAMP_MS: RAMP_MS, HEARTS: HEARTS, HIT_INV: HIT_INV, DIST_DIV: DIST_DIV,
    GAP_FRAC: GAP_FRAC, GAP_MIN: GAP_MIN, RUN_S: RUN_S, LOOK_MS: LOOK_MS, KINDS: KINDS, KIND_BY_ID: KIND_BY_ID, GRAB_PAD: GRAB_PAD,
    TICK_MS: TICK_MS, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET, MAX_PLAUSIBLE: MAX_PLAUSIBLE, ITEMS_PER_S: ITEMS_PER_S, TIERS: TIERS,
    JUMP: JUMP, TAP: TAP, profile: profile, boxOf: boxOf,
    mulberry32: mulberry32, randomSeed: randomSeed, level: level, targetSpeed: targetSpeed, rules: rules, kindOf: kindOf,
    newGame: newGame, start: start, setHold: setHold, step: step, fill: fill, supported: supported, roofAt: roofAt, px: px,
    score: score, meters: meters, items: items, tierOf: tierOf, plausible: plausible, autoPlay: autoPlay,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
