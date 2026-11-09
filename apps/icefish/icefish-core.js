/* apps/icefish/icefish-core.js — 얼음 낚시(Ice Fishing) 로직 (언어 무관, UMD: 브라우저 window.ICEFISH_CORE + Node 검사 공용)
 *
 * 좌표(게임 단위, 화면 px 아님): 폭 W(360), 높이 H(600). 옆에서 본 얼음 호수 단면 — 위는 하늘·얼음판, ICE_Y 아래가 물, BOTTOM 이 바닥.
 *   - 얼음 구멍은 HOLE_X. 낚싯줄은 구멍에서 곧게 내려가고 바늘 깊이 = hookY (HOOK_MIN..HOOK_MAX).
 *   - 입력은 두 가지뿐: hold(누르고 있음) + target(누른 자리의 깊이, 세계 y).
 *     내리기(phase 'line'): 누르고 있는 동안 바늘이 target 쪽으로 LINE_SPEED 로 움직인다(위·아래 모두). 떼면 그 자리에 멈춘다.
 *     줄다리기(phase 'fight'): 누르고 있으면 감기(바늘이 올라옴, 장력 상승), 떼면 장력이 내려가고 물고기가 줄을 끌고 내려간다.
 *       장력 ≥ 1 → 줄이 끊어짐(snap). 장력이 거의 0 으로 SLACK_MS 넘게 느슨하면 물고기가 빠져나감(escape).
 *       장력이 RED(0.75) 이상 = 빨간 구간 → 그때 손을 떼야 한다. 물고기마다 힘(str)·발버둥(tug, 갑자기 장력 +)이 다르다.
 *       바늘이 얼음 아래(ICE_Y)에 닿으면 잡힘(catch) → 점수 += 그 물고기 점수(장화 같은 쓰레기 = 0).
 *   - 물고기: 종류별 깊이 띠·속도·크기·점수·힘. 옆으로 헤엄쳐 지나간다(MAX_FISH 마리 유지, 빠지면 새로 나옴).
 *     바늘이 멈춰 있을 때 가까이 오는 물고기는 바늘 깊이로 조금씩 끌려오고(ATTRACT), 바늘 바로 앞에 오면 한 번 입질을 굴린다
 *     (확률 bite — 난수). 실패하면 그 물고기는 그냥 지나간다.
 *   - 한 판 = ROUND_MS(60초). 첫 입력(start) 뒤부터 시간이 흐른다. 시간이 다 되면 끝(걸려 있던 물고기는 놓침).
 *   - 난수: 시드 = crypto.getRandomValues(없으면 Math.random), 판 안의 모든 무작위(물고기 등장·입질·발버둥) = mulberry32(시드).
 *   - 고정 시간 간격: step(s, dtMs, ctrl) 는 dt 를 모아 TICK_MS(1/120초)마다 tick → 같은 시드 + 같은 입력 = 같은 판. 큰 dt 는 MAX_STEP 으로 자른다.
 *     ctrl(s) 가 { hold, target } 을 돌려주면 그 tick 의 입력으로 쓴다(자동 낚시·검사용).
 *   - 사건 배열: { type:'bite'|'catch'|'snap'|'escape', kind, pts? } | { type:'time' }.
 * 서버 점수 분포(supa.submitScore): bucket(score) = min(MAX_BUCKET, floor(score / 5)). plausible(s) 가 거짓이면 보내지 않는다.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ICEFISH_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 600;
  var ICE_TOP = 112, ICE_Y = 150;     // 얼음판 위·아래(물 시작)
  var BOTTOM = 574;                    // 호수 바닥
  var HOLE_X = 206, HOLE_HALF = 15;    // 얼음 구멍
  var HOOK_MIN = ICE_Y + 14, HOOK_MAX = BOTTOM - 14;
  var LINE_SPEED = 330;                // 바늘 내리기·올리기(단위/초)
  var REEL_SPEED = 200;                // 감기(힘 0 기준, 단위/초)
  var RED = 0.75;                      // 빨간 구간 시작
  var TENSION0 = 0.3;                  // 입질 직후 장력
  var TENSION_UP = 0.22, TENSION_STR = 0.6;   // 감을 때 장력 상승 = UP + STR × 힘 (/초)
  var TENSION_DOWN = 1.05;             // 뗐을 때 장력 하강(/초)
  var PULL0 = 15, PULL_STR = 35;       // 뗐을 때 물고기가 끌고 내려가는 속도(단위/초)
  var TUG_MIN = 0.1, TUG_RANGE = 0.12; // 발버둥 한 번의 장력 증가
  var SLACK_EPS = 0.04, SLACK_MS = 1800;
  var COOL_MS = 450;                   // 잡기·놓치기 뒤 잠깐 쉼(줄이 다시 내려갈 준비)
  var ROUND_MS = 60000;
  var MAX_FISH = 7;
  var ATTRACT_DY = 64, ATTRACT_DX = 120, ATTRACT_V = 34;
  var BITE_DX = 14, BITE_DY = 18;
  var KINDS = [
    { id: 'minnow', pts: 10, len: 16, y0: 178, y1: 300, v0: 62, v1: 92, str: 0.22, tug: 0.35, bite: 0.8, w: 30 },
    { id: 'perch', pts: 20, len: 22, y0: 230, y1: 400, v0: 46, v1: 70, str: 0.38, tug: 0.55, bite: 0.75, w: 26 },
    { id: 'trout', pts: 35, len: 30, y0: 300, y1: 480, v0: 50, v1: 76, str: 0.52, tug: 0.75, bite: 0.7, w: 18 },
    { id: 'pike', pts: 60, len: 42, y0: 400, y1: 540, v0: 40, v1: 60, str: 0.7, tug: 0.95, bite: 0.65, w: 10 },
    { id: 'golden', pts: 150, len: 26, y0: 380, y1: 540, v0: 86, v1: 116, str: 0.86, tug: 1.25, bite: 0.6, w: 2.5 },
    { id: 'boot', pts: 0, len: 22, y0: 546, y1: 556, v0: 8, v1: 14, str: 0.1, tug: 0.1, bite: 1, w: 8, junk: true }
  ];
  var KIND_BY_ID = {};
  KINDS.forEach(function (k, i) { k.index = i; KIND_BY_ID[k.id] = k; });
  var TICK_MS = 1000 / 120;
  var MAX_STEP = 100;
  var GAME = 'icefish';
  var MAX_BUCKET = 400;
  var MAX_PLAUSIBLE = 1500;            // 이보다 높은 점수·아래 잡은 수는 서버에 보내지 않는다(조작 의심)
  var MAX_PLAUSIBLE_CATCHES = 30;
  var TIERS = [0, 80, 180, 300, 450, 650];   // 등급 6단계 하한(점)

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

  var TOTAL_W = KINDS.reduce(function (a, k) { return a + k.w; }, 0);
  function pickKind(r) {
    var x = r * TOTAL_W;
    for (var i = 0; i < KINDS.length; i++) { x -= KINDS[i].w; if (x < 0) return KINDS[i]; }
    return KINDS[0];
  }

  function spawnFish(s, anywhere) {
    var k = pickKind(s.rnd());
    var dir = s.rnd() < 0.5 ? 1 : -1;
    var y = k.y0 + s.rnd() * (k.y1 - k.y0);
    var x = anywhere ? 20 + s.rnd() * (W - 40) : (dir > 0 ? -k.len - 10 : W + k.len + 10);
    var f = { id: ++s.fishSeq, kind: k.id, x: x, y: y, baseY: y, dir: dir, v: k.v0 + s.rnd() * (k.v1 - k.v0), declined: false, hooked: false, wob: s.rnd() * 6.28 };
    s.fish.push(f);
    return f;
  }

  function newGame(seed) {
    var sd = seed == null ? randomSeed() : seed >>> 0;
    var s = {
      seed: sd, rnd: mulberry32(sd),
      phase: 'line',            // line | fight | cool
      started: false, over: false, endReason: '',
      timeLeft: ROUND_MS, elapsed: 0,
      hookY: HOOK_MIN, target: HOOK_MIN, hold: false, moving: false,
      fish: [], fishSeq: 0, hooked: null, spawnCd: 0.6,
      tension: 0, slack: 0, cool: 0,
      score: 0, caught: 0, junk: 0, snapped: 0, escaped: 0, bestPts: 0, bestKind: '', catches: [],
      acc: 0, ticks: 0, submitted: false
    };
    for (var i = 0; i < 5; i++) spawnFish(s, true);
    return s;
  }
  function start(s) { if (!s.started && !s.over) s.started = true; return s; }
  function setInput(s, hold, target) {
    s.hold = !!hold;
    if (target != null && isFinite(Number(target))) s.target = clamp(Number(target), HOOK_MIN, HOOK_MAX);
  }
  function kindOf(f) { return KIND_BY_ID[f && f.kind] || KINDS[0]; }

  function releaseHooked(s, gone) {
    var f = s.hooked;
    s.hooked = null;
    if (f) {
      f.hooked = false;
      if (gone) { var i = s.fish.indexOf(f); if (i >= 0) s.fish.splice(i, 1); }
      else { f.declined = true; f.v *= 2.2; f.y = Math.min(f.y + 6, BOTTOM - 10); }
    }
    s.tension = 0; s.slack = 0;
    s.hookY = HOOK_MIN; s.target = HOOK_MIN;
    s.phase = 'cool'; s.cool = COOL_MS;
  }

  function tick(s, evs, ctrl) {
    var dt = TICK_MS / 1000;
    s.ticks++;
    if (ctrl) { var c = ctrl(s); if (c) setInput(s, c.hold, c.target); }
    // 시간
    s.timeLeft -= TICK_MS; s.elapsed += TICK_MS;
    if (s.timeLeft <= 0) {
      s.timeLeft = 0;
      if (s.hooked) releaseHooked(s, false);
      s.over = true; s.endReason = 'time'; s.phase = 'cool';
      evs.push({ type: 'time' });
      return;
    }
    // 물고기 헤엄
    for (var i = s.fish.length - 1; i >= 0; i--) {
      var f = s.fish[i];
      if (f.hooked) continue;
      f.x += f.dir * f.v * dt;
      f.wob += dt * 3;
      var k = kindOf(f);
      var waiting = s.phase === 'line' && !s.moving;
      var dx = f.x - HOLE_X, dy = s.hookY - f.y;
      if (waiting && !f.declined && !k.junk && Math.abs(dx) < ATTRACT_DX && dx * f.dir < 0 && Math.abs(dy) < ATTRACT_DY) {
        f.y += clamp(dy, -ATTRACT_V * dt, ATTRACT_V * dt);
      } else if (!k.junk) {
        f.y += clamp(f.baseY - f.y, -12 * dt, 12 * dt);
      }
      if (f.x < -60 || f.x > W + 60) { s.fish.splice(i, 1); continue; }
      // 입질: 바늘 바로 앞, 한 마리당 한 번만 굴린다
      if (waiting && !s.hooked && !f.declined && Math.abs(dx) < BITE_DX && Math.abs(s.hookY - f.y) < BITE_DY) {
        if (s.rnd() < k.bite) {
          f.hooked = true; s.hooked = f;
          s.phase = 'fight'; s.tension = TENSION0; s.slack = 0;
          evs.push({ type: 'bite', kind: k.id });
        } else f.declined = true;
      }
    }
    // 새 물고기
    s.spawnCd -= dt;
    if (s.spawnCd <= 0 && s.fish.length < MAX_FISH) { spawnFish(s, false); s.spawnCd = 0.5 + s.rnd() * 0.9; }

    if (s.phase === 'cool') {
      s.cool -= TICK_MS; s.moving = false;
      if (s.cool <= 0) { s.phase = 'line'; s.cool = 0; }
      return;
    }
    if (s.phase === 'line') {
      var prev = s.hookY;
      if (s.hold) {
        var d = s.target - s.hookY, stepMax = LINE_SPEED * dt;
        s.hookY += clamp(d, -stepMax, stepMax);
      }
      s.hookY = clamp(s.hookY, HOOK_MIN, HOOK_MAX);
      s.moving = Math.abs(s.hookY - prev) > 1e-6;
      return;
    }
    // 줄다리기
    var hf = s.hooked, hk = kindOf(hf);
    if (s.hold) {
      s.tension += (TENSION_UP + TENSION_STR * hk.str) * dt;
      s.hookY -= REEL_SPEED * (1 - 0.4 * hk.str) * dt;
    } else {
      s.tension -= TENSION_DOWN * dt;
      s.hookY = Math.min(HOOK_MAX, s.hookY + (PULL0 + PULL_STR * hk.str) * dt);
    }
    if (s.rnd() < hk.tug * dt) s.tension += TUG_MIN + TUG_RANGE * s.rnd();
    if (s.tension < 0) s.tension = 0;
    hf.x = HOLE_X + Math.sin(s.ticks / 9) * 5;
    hf.y = s.hookY + 4;
    if (s.tension >= 1) {
      s.snapped++;
      evs.push({ type: 'snap', kind: hk.id });
      releaseHooked(s, false);
      return;
    }
    if (s.tension < SLACK_EPS) s.slack += TICK_MS; else s.slack = 0;
    if (s.slack >= SLACK_MS) {
      s.escaped++;
      evs.push({ type: 'escape', kind: hk.id });
      releaseHooked(s, false);
      return;
    }
    if (s.hookY <= ICE_Y + 2) {
      s.score += hk.pts;
      if (hk.junk) s.junk++; else s.caught++;
      if (hk.pts > s.bestPts) { s.bestPts = hk.pts; s.bestKind = hk.id; }
      s.catches.push(hk.id);
      evs.push({ type: 'catch', kind: hk.id, pts: hk.pts });
      releaseHooked(s, true);
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
  function tierOf(sc) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (sc >= TIERS[i]) t = i;
    return t;
  }
  function plausible(s) {
    return !!s && s.over && s.endReason === 'time' && s.score >= 0 && s.score <= MAX_PLAUSIBLE &&
      (s.caught + s.junk) <= MAX_PLAUSIBLE_CATCHES && s.elapsed >= ROUND_MS - 1;
  }

  // 자동 낚시(검사·흐름 검사용): 다가오는 물고기 깊이로 바늘을 맞추고, 줄다리기는 장력이 낮을 때만 감는다.
  function autoPlay(s) {
    if (s.phase === 'fight') return { hold: s.tension < 0.55 };
    if (s.phase !== 'line') return { hold: false };
    var best = null, bestT = 1e9;
    for (var i = 0; i < s.fish.length; i++) {
      var f = s.fish[i], k = kindOf(f);
      if (f.declined || f.hooked || k.junk) continue;
      var dx = HOLE_X - f.x;
      if (dx * f.dir <= 0) continue;
      var t = Math.abs(dx) / f.v - k.pts / 60;
      if (t < bestT) { bestT = t; best = f; }
    }
    if (!best) return { hold: false };
    var ty = clamp(best.y, HOOK_MIN, HOOK_MAX);
    return { hold: Math.abs(s.hookY - ty) > 2, target: ty };
  }

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
    W: W, H: H, ICE_TOP: ICE_TOP, ICE_Y: ICE_Y, BOTTOM: BOTTOM, HOLE_X: HOLE_X, HOLE_HALF: HOLE_HALF, HOOK_MIN: HOOK_MIN, HOOK_MAX: HOOK_MAX,
    LINE_SPEED: LINE_SPEED, REEL_SPEED: REEL_SPEED, RED: RED, TENSION0: TENSION0, SLACK_MS: SLACK_MS, COOL_MS: COOL_MS, ROUND_MS: ROUND_MS,
    MAX_FISH: MAX_FISH, KINDS: KINDS, KIND_BY_ID: KIND_BY_ID, TICK_MS: TICK_MS, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET,
    MAX_PLAUSIBLE: MAX_PLAUSIBLE, MAX_PLAUSIBLE_CATCHES: MAX_PLAUSIBLE_CATCHES, TIERS: TIERS,
    mulberry32: mulberry32, randomSeed: randomSeed, pickKind: pickKind, spawnFish: spawnFish, newGame: newGame, start: start,
    setInput: setInput, step: step, score: score, tierOf: tierOf, plausible: plausible, autoPlay: autoPlay,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
