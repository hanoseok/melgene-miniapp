/* apps/snowball/snowball-core.js — 눈싸움(Snowball Fight) 로직 (언어 무관, UMD: 브라우저 window.SNOWBALL_CORE + Node 검사 공용)
 *
 * 좌표(게임 단위, 화면 px 아님): 폭 W(360), 높이 H(600). 위에서 아래로 = 멀리서 가까이.
 *   - 눈 요새 자리(SLOTS) 5곳: 뒷줄 2곳(작게, s 0.78) + 앞줄 3곳(s 1). slot.y = 요새 윗선. 상대는 그 뒤에서 솟아오른다.
 *   - 맨 아래 WALL_Y 부터는 내 눈벽. 나는 벽 뒤에서 던지고(THROW_X, THROW_Y), 숙이면(duck) 벽 뒤로 숨는다.
 *   - 상대(pop): rise(솟기 RISE_MS) → up(upMs 동안 보임) → fall(내려가기) / 맞으면 hit(HIT_MS 동안 쓰러짐) 뒤 사라짐.
 *     종류: kid(10점, 던짐) · snowman(15점, 던짐) · golden(황금 눈사람 50점, 드묾, 짧게, 안 던짐) · dog·flag(친구 — 맞히면 −25점, 콤보 끊김).
 *   - 내 던지기: throwAt(s, x, y) — 누른 자리의 상대를 겨냥(없으면 그 자리로). 공은 FLIGHT_MS 뒤 도착하고,
 *     그때 상대가 아직 맞을 수 있는 상태(hittable)면 맞음. 아니면 빗나감(콤보 0). 숙인 동안·쿨다운(THROW_CD)·공 MAX_BALLS 개 날아가는 중엔 못 던짐.
 *     콤보: 연속으로 맞힐수록 점수 × (1 + 0.1 × min(콤보−1, 10)). 빗나감·친구 맞힘·내가 맞음 = 콤보 0.
 *   - 상대 던지기: up 동안 정해진 때(throwAt)에 팔을 든다(wind, 경고) → windMs 뒤 공을 던짐(incoming, dur 동안 날아옴).
 *     팔을 드는 중에 맞히면 던지지 못한다. 공이 도착할 때 숙이고 있으면 막음(block), 아니면 하트 −1(ouch). 하트 0 = 끝(out).
 *   - 난이도: 지난 시간에 따라 등장 간격·동시에 보이는 수·보이는 시간·던질 확률·공 속도가 점점 어려워진다(RAMP_MS 에 최대).
 *   - 한 판 = ROUND_MS(60초) 또는 하트 3개를 다 잃을 때까지. 첫 입력(start) 뒤부터 시간이 흐른다.
 *   - 난수: 시드 = crypto.getRandomValues(없으면 Math.random), 판 안의 모든 무작위 = mulberry32(시드).
 *   - 고정 시간 간격: step(s, dtMs, ctrl) 는 dt 를 모아 TICK_MS(1/120초)마다 tick → 같은 시드 + 같은 입력 = 같은 판. 큰 dt 는 MAX_STEP 으로 자른다.
 *     ctrl(s) 가 { duck, throwAt: {x, y} } 를 돌려주면 그 tick 의 입력으로 쓴다(자동 플레이·검사용).
 *   - 사건: { type:'pop'|'wind'|'throw'|'hit'|'oops'|'miss'|'ouch'|'block'|'time'|'out', ... }.
 * 서버 점수 분포(supa.submitScore): bucket(score) = min(MAX_BUCKET, floor(score / 10)). plausible(s) 가 거짓이면 보내지 않는다.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SNOWBALL_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 600;
  var HORIZON = 150;                   // 먼 언덕 선
  var WALL_Y = 478;                    // 내 눈벽 윗선
  var THROW_X = 180, THROW_Y = 500;    // 내 손(공이 출발하는 곳)
  var SLOTS = [
    { x: 96, y: 232, s: 0.78, row: 0 },
    { x: 264, y: 232, s: 0.78, row: 0 },
    { x: 62, y: 356, s: 1, row: 1 },
    { x: 180, y: 356, s: 1, row: 1 },
    { x: 298, y: 356, s: 1, row: 1 }
  ];
  var KINDS = [
    { id: 'kid', pts: 10, w: 60, throws: true, upMul: 1 },
    { id: 'snowman', pts: 15, w: 22, throws: true, upMul: 0.9 },
    { id: 'golden', pts: 50, w: 4, throws: false, upMul: 0.6 },
    { id: 'dog', pts: -25, w: 8, throws: false, upMul: 1, friend: true },
    { id: 'flag', pts: -25, w: 6, throws: false, upMul: 1, friend: true }
  ];
  var KIND_BY_ID = {};
  KINDS.forEach(function (k, i) { k.index = i; KIND_BY_ID[k.id] = k; });
  var RISE_MS = 170, FALL_MS = 170, HIT_MS = 420;
  var HIT_R = 30;                      // 맞는 범위(반지름, × slot.s), 몸 가운데 = slot.y − 34 × s
  var TAP_PAD = 8;                     // 누를 때 여유
  var FLIGHT_FAR = 300, FLIGHT_NEAR = 240;
  var THROW_CD = 200, MAX_BALLS = 3;
  var HEARTS = 3;
  var ROUND_MS = 60000, RAMP_MS = 50000;
  var FIRST_POP_MS = 500;
  var COMBO_STEP = 0.1, COMBO_CAP = 10;
  var TICK_MS = 1000 / 120;
  var MAX_STEP = 100;
  var GAME = 'snowball';
  var MAX_BUCKET = 350;
  var MAX_PLAUSIBLE = 3500;            // 이보다 높은 점수·아래 맞힌 수는 서버에 보내지 않는다(조작 의심)
  var MAX_PLAUSIBLE_HITS = 160;
  var TIERS = [0, 150, 350, 600, 900, 1300];  // 등급 6단계 하한(점)

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

  var TOTAL_W = KINDS.reduce(function (a, k) { return a + k.w; }, 0);
  function pickKind(r) {
    var x = r * TOTAL_W;
    for (var i = 0; i < KINDS.length; i++) { x -= KINDS[i].w; if (x < 0) return KINDS[i]; }
    return KINDS[0];
  }

  // 난이도 0..1 (지난 시간 기준)
  function level(s) { return clamp(s.elapsed / RAMP_MS, 0, 1); }
  function rules(s) {
    var d = level(s);
    return {
      gap: lerp(1050, 470, d),
      maxUp: d < 0.3 ? 2 : d < 0.65 ? 3 : 4,
      upMs: lerp(1750, 950, d),
      throwChance: lerp(0.3, 0.65, d),
      windMs: lerp(600, 380, d),
      incomingMs: lerp(1000, 720, d)
    };
  }

  function hitCenter(slot) { return { x: slot.x, y: slot.y - 34 * slot.s }; }
  function kindOf(p) { return KIND_BY_ID[p && p.kind] || KINDS[0]; }
  function hittable(p) {
    if (!p || p.phase === 'hit') return false;
    if (p.phase === 'up') return true;
    return p.rise >= 0.5;
  }

  function newGame(seed) {
    var sd = seed == null ? randomSeed() : seed >>> 0;
    return {
      seed: sd, rnd: mulberry32(sd),
      started: false, over: false, endReason: '',
      timeLeft: ROUND_MS, elapsed: 0,
      hearts: HEARTS, duck: false,
      pops: [], popSeq: 0, spawnCd: FIRST_POP_MS,
      balls: [], ballSeq: 0, throwCd: 0,
      incoming: [], inSeq: 0,
      score: 0, hits: 0, throws: 0, misses: 0, friendHits: 0, goldens: 0, combo: 0, bestCombo: 0,
      blocked: 0, taken: 0,
      acc: 0, ticks: 0, submitted: false
    };
  }
  function start(s) { if (!s.started && !s.over) s.started = true; return s; }
  function setDuck(s, on) { s.duck = !!on; }

  function spawnPop(s) {
    var R = rules(s);
    var free = [];
    var busy = {};
    s.pops.forEach(function (p) { busy[p.slot] = true; });
    for (var i = 0; i < SLOTS.length; i++) if (!busy[i]) free.push(i);
    var live = s.pops.filter(function (p) { return p.phase !== 'hit'; }).length;
    if (!free.length || live >= R.maxUp) return null;
    var slot = free[Math.floor(s.rnd() * free.length)];
    var k = pickKind(s.rnd());
    var upMs = R.upMs * (0.85 + 0.3 * s.rnd()) * k.upMul;
    var p = { id: ++s.popSeq, slot: slot, kind: k.id, phase: 'rise', rise: 0, t: 0, upMs: upMs, throwAt: -1, wind: 0, windMs: R.windMs, thrown: false, look: Math.floor(s.rnd() * 4) };
    if (k.throws && s.rnd() < R.throwChance) {
      var latest = upMs - R.windMs - 120;
      if (latest < 140) { p.upMs = R.windMs + 260; latest = 140; }
      p.throwAt = 100 + s.rnd() * Math.max(0, latest - 100);
    }
    s.pops.push(p);
    return p;
  }

  function popById(s, id) {
    for (var i = 0; i < s.pops.length; i++) if (s.pops[i].id === id) return s.pops[i];
    return null;
  }

  // 누른 자리(세계 좌표)에 맞을 수 있는 상대가 있으면 그 상대 (가장 가까운 것)
  function popAt(s, x, y) {
    var best = null, bd = 1e9;
    s.pops.forEach(function (p) {
      if (!hittable(p)) return;
      var sl = SLOTS[p.slot], c = hitCenter(sl);
      var d = Math.sqrt((x - c.x) * (x - c.x) + (y - c.y) * (y - c.y));
      if (d <= HIT_R * sl.s + TAP_PAD && d < bd) { bd = d; best = p; }
    });
    return best;
  }

  // 던지기. 성공하면 공 객체, 못 던지면 null.
  function throwAt(s, x, y) {
    if (!s.started || s.over || s.duck || s.throwCd > 0 || s.balls.length >= MAX_BALLS) return null;
    if (!isFinite(Number(x)) || !isFinite(Number(y))) return null;
    x = clamp(Number(x), 0, W); y = clamp(Number(y), 0, WALL_Y - 8);
    var p = popAt(s, x, y);
    var tx = x, ty = y, far = y < (SLOTS[0].y + SLOTS[2].y) / 2;
    if (p) { var c = hitCenter(SLOTS[p.slot]); tx = c.x; ty = c.y; far = SLOTS[p.slot].row === 0; }
    var b = { id: ++s.ballSeq, popId: p ? p.id : 0, x: tx, y: ty, t: 0, dur: far ? FLIGHT_FAR : FLIGHT_NEAR };
    s.balls.push(b);
    s.throws++;
    s.throwCd = THROW_CD;
    return b;
  }

  function land(s, b, evs) {
    var p = b.popId ? popById(s, b.popId) : null;
    if (!p || !hittable(p)) {
      s.misses++; s.combo = 0;
      evs.push({ type: 'miss', x: b.x, y: b.y });
      return;
    }
    var k = kindOf(p);
    p.phase = 'hit'; p.t = 0;
    if (k.friend) {
      s.friendHits++; s.combo = 0;
      s.score = Math.max(0, s.score + k.pts);
      evs.push({ type: 'oops', kind: k.id, pts: k.pts, x: b.x, y: b.y });
      return;
    }
    s.combo++;
    if (s.combo > s.bestCombo) s.bestCombo = s.combo;
    var gained = Math.round(k.pts * (1 + COMBO_STEP * Math.min(s.combo - 1, COMBO_CAP)));
    s.score += gained;
    s.hits++;
    if (k.id === 'golden') s.goldens++;
    evs.push({ type: 'hit', kind: k.id, pts: gained, combo: s.combo, x: b.x, y: b.y, stopped: p.wind > 0 });
  }

  function tick(s, evs, ctrl) {
    var dt = TICK_MS;
    s.ticks++;
    if (ctrl) {
      var c = ctrl(s);
      if (c) {
        if (c.duck != null) setDuck(s, c.duck);
        if (c.throwAt) throwAt(s, c.throwAt.x, c.throwAt.y);
      }
    }
    s.timeLeft -= dt; s.elapsed += dt;
    if (s.timeLeft <= 0) {
      s.timeLeft = 0;
      s.over = true; s.endReason = 'time';
      evs.push({ type: 'time' });
      return;
    }
    if (s.throwCd > 0) s.throwCd = Math.max(0, s.throwCd - dt);
    var R = rules(s);
    // 내 공
    for (var i = s.balls.length - 1; i >= 0; i--) {
      var b = s.balls[i];
      b.t += dt;
      if (b.t >= b.dur) { s.balls.splice(i, 1); land(s, b, evs); }
    }
    // 상대
    for (var j = s.pops.length - 1; j >= 0; j--) {
      var p = s.pops[j];
      if (p.phase === 'rise') {
        p.rise += dt / RISE_MS;
        if (p.rise >= 1) { p.rise = 1; p.phase = 'up'; p.t = 0; evs.push({ type: 'pop', kind: p.kind, slot: p.slot }); }
      } else if (p.phase === 'up') {
        p.t += dt;
        if (p.throwAt >= 0 && !p.thrown && p.wind <= 0 && p.t >= p.throwAt) {
          p.wind = p.windMs;
          evs.push({ type: 'wind', slot: p.slot });
        } else if (p.wind > 0) {
          p.wind -= dt;
          if (p.wind <= 0) {
            p.wind = 0; p.thrown = true;
            var sl = SLOTS[p.slot];
            s.incoming.push({ id: ++s.inSeq, slot: p.slot, x0: sl.x + 14 * sl.s, y0: sl.y - 58 * sl.s, t: 0, dur: R.incomingMs });
            if (p.upMs < p.t + 260) p.upMs = p.t + 260;
            evs.push({ type: 'throw', slot: p.slot });
          }
        }
        if (p.t >= p.upMs && p.wind <= 0) p.phase = 'fall';
      } else if (p.phase === 'fall') {
        p.rise -= dt / FALL_MS;
        if (p.rise <= 0) { s.pops.splice(j, 1); }
      } else if (p.phase === 'hit') {
        p.t += dt;
        if (p.t >= HIT_MS) s.pops.splice(j, 1);
      }
    }
    // 날아오는 공
    for (var q = s.incoming.length - 1; q >= 0; q--) {
      var inb = s.incoming[q];
      inb.t += dt;
      if (inb.t < inb.dur) continue;
      s.incoming.splice(q, 1);
      if (s.duck) { s.blocked++; evs.push({ type: 'block' }); }
      else {
        s.hearts = Math.max(0, s.hearts - 1); s.taken++; s.combo = 0;
        evs.push({ type: 'ouch', hearts: s.hearts });
        if (s.hearts <= 0) {
          s.over = true; s.endReason = 'out';
          evs.push({ type: 'out' });
          return;
        }
      }
    }
    // 새 상대
    s.spawnCd -= dt;
    if (s.spawnCd <= 0) {
      spawnPop(s);
      s.spawnCd = R.gap * (0.7 + 0.6 * s.rnd());
    }
  }

  // dtMs 만큼 진행 (TICK_MS 단위로 쪼갬). 준비 상태·끝난 판은 움직이지 않는다.
  function step(s, dtMs, ctrl) {
    var evs = [];
    if (!s.started || s.over) return evs;
    s.acc += clamp(Number(dtMs) || 0, 0, MAX_STEP);
    while (s.acc >= TICK_MS && !s.over) { s.acc -= TICK_MS; tick(s, evs, ctrl); }
    return evs;
  }

  function score(s) { return s ? s.score : 0; }
  function accuracy(s) { return s && s.throws ? s.hits / s.throws : 0; }
  function tierOf(sc) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (sc >= TIERS[i]) t = i;
    return t;
  }
  function plausible(s) {
    if (!s || !s.over || s.score < 0 || s.score > MAX_PLAUSIBLE || s.hits > MAX_PLAUSIBLE_HITS) return false;
    if (s.hits + s.friendHits > s.throws || s.throws > ROUND_MS / THROW_CD + 1) return false;
    if (s.endReason === 'time') return s.elapsed >= ROUND_MS - 1;
    if (s.endReason === 'out') return s.hearts === 0 && s.taken === HEARTS && s.elapsed > 0;
    return false;
  }

  // 자동 플레이(검사·흐름 검사용): 날아오는 공이 곧 닿으면 숙이고, 아니면 보인 지 조금 된 상대를 겨냥한다(친구는 피함).
  var REACT_MS = 380, AUTO_GAP_MS = 420;
  function autoPlay(s) {
    for (var i = 0; i < s.incoming.length; i++) {
      if (s.incoming[i].dur - s.incoming[i].t < 230) return { duck: true };
    }
    if (s.throwCd > 0 || s.balls.length >= MAX_BALLS || s.elapsed - (s.autoLast || -1e9) < AUTO_GAP_MS) return { duck: false };
    var best = null, bestScore = -1e9;
    s.pops.forEach(function (p) {
      var k = kindOf(p);
      if (k.friend || p.phase !== 'up' || p.t < REACT_MS) return;
      if (s.balls.some(function (b) { return b.popId === p.id; })) return;
      var sl = SLOTS[p.slot];
      var flight = sl.row === 0 ? FLIGHT_FAR : FLIGHT_NEAR;
      var left = Math.max(p.upMs - p.t, p.wind);
      if (left < flight + 60) return;
      var v = k.pts + (p.wind > 0 ? 30 : 0) - left / 100;
      if (v > bestScore) { bestScore = v; best = p; }
    });
    if (!best) return { duck: false };
    var c = hitCenter(SLOTS[best.slot]);
    s.autoLast = s.elapsed;
    return { duck: false, throwAt: { x: c.x, y: c.y } };
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
    W: W, H: H, HORIZON: HORIZON, WALL_Y: WALL_Y, THROW_X: THROW_X, THROW_Y: THROW_Y, SLOTS: SLOTS, KINDS: KINDS, KIND_BY_ID: KIND_BY_ID,
    RISE_MS: RISE_MS, FALL_MS: FALL_MS, HIT_MS: HIT_MS, HIT_R: HIT_R, FLIGHT_FAR: FLIGHT_FAR, FLIGHT_NEAR: FLIGHT_NEAR,
    THROW_CD: THROW_CD, MAX_BALLS: MAX_BALLS, HEARTS: HEARTS, ROUND_MS: ROUND_MS, RAMP_MS: RAMP_MS, COMBO_STEP: COMBO_STEP, COMBO_CAP: COMBO_CAP,
    TICK_MS: TICK_MS, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET, MAX_PLAUSIBLE: MAX_PLAUSIBLE, MAX_PLAUSIBLE_HITS: MAX_PLAUSIBLE_HITS, TIERS: TIERS,
    mulberry32: mulberry32, randomSeed: randomSeed, pickKind: pickKind, level: level, rules: rules, hitCenter: hitCenter, hittable: hittable,
    newGame: newGame, start: start, setDuck: setDuck, spawnPop: spawnPop, popAt: popAt, throwAt: throwAt, step: step,
    score: score, accuracy: accuracy, tierOf: tierOf, plausible: plausible, autoPlay: autoPlay,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
