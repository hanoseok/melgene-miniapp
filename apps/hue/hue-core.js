/* apps/hue/hue-core.js — 다른 색 찾기(절대색감 테스트) 로직 (언어 무관, UMD: 브라우저 window.HUE_CORE + Node 검사 공용)
 *
 * 한 판 = 60초(TIME_MS). 레벨마다 n×n 판에 같은 색 타일이 깔리고, 딱 한 칸만 아주 조금 다른 색이다. 그 칸을 누르면 다음 레벨.
 *   판 크기 sizeOf(level): 2×2 → 3×3 → … 최대 8×8 (SIZES 표, 그 뒤로는 8).
 *   색 차이 deltaOf(level): OKLab 밝기(L) 차이. 0.15 에서 시작해 레벨마다 ×0.89, 바닥 MIN_DELTA(0.016 — 눈으로 겨우 보이는 정도).
 *   색: 레벨마다 무작위 색상(hue 0..360) · 채도(OKLCH chroma 0.06..0.15) · 밝기(L 0.52..0.78 — 아주 어둡거나 하얀 색은 피함).
 *       다른 칸은 L 을 +delta 또는 −delta(범위 안쪽으로). 두 색 모두 sRGB 안에 들도록 chroma 를 줄인다(같은 chroma·hue, 밝기만 다름).
 * 틀린 칸을 누르면 PENALTY_MS(3초) 깎임. 점수 = 깬 레벨 수(정수).
 * 등급 tierOf(score): TIERS 기준(0·5·10·15·20·26) → 0..5 (문구는 언어 파일 result.tiers).
 * 같은 시드 = 같은 레벨들(mulberry32).
 * 서버 점수 분포(supa.submitScore): bucket(score) = 점수 그대로(0..1999).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HUE_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var GAME = 'hue';
  var TIME_MS = 60000;
  var PENALTY_MS = 3000;
  var SIZES = [2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 8];
  var MAX_SIZE = 8;
  var START_DELTA = 0.15;
  var DECAY = 0.89;
  var MIN_DELTA = 0.016;
  var TIERS = [0, 5, 10, 15, 20, 26];
  var MAX_BUCKET = 1999;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

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

  function sizeOf(level) {
    var l = Math.max(0, Math.floor(Number(level) || 0));
    return l < SIZES.length ? SIZES[l] : MAX_SIZE;
  }
  function deltaOf(level) {
    var l = Math.max(0, Math.floor(Number(level) || 0));
    return Math.max(MIN_DELTA, START_DELTA * Math.pow(DECAY, l));
  }

  // ---------------------------------------------------------------- 색 (OKLCH → sRGB)
  function oklchToRgb(L, C, h) {
    var hr = h * Math.PI / 180;
    var a = C * Math.cos(hr), b = C * Math.sin(hr);
    var l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    var m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    var s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    var l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    return [
      +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    ];
  }
  function inGamut(rgb) { return rgb.every(function (v) { return v >= -0.0005 && v <= 1.0005; }); }
  function gammaOf(v) {
    v = clamp(v, 0, 1);
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  }
  function toHex(rgb) {
    return '#' + rgb.map(function (v) {
      var n = Math.round(gammaOf(v) * 255);
      return (n < 16 ? '0' : '') + n.toString(16);
    }).join('');
  }
  // 두 밝기 모두 sRGB 안에 들어오는 가장 큰 chroma(≤ C)
  function fitChroma(L1, L2, C, h) {
    var c = C;
    while (c > 0 && !(inGamut(oklchToRgb(L1, c, h)) && inGamut(oklchToRgb(L2, c, h)))) c -= 0.004;
    return Math.max(0, c);
  }

  /* 레벨 하나: { level, size, count, odd(다른 칸 번호), delta, base, oddColor(#hex), baseL, oddL, chroma, hue } */
  function makeRound(level, rnd) {
    var size = sizeOf(level), count = size * size;
    var delta = deltaOf(level);
    var hue = rnd() * 360;
    var L = 0.52 + rnd() * 0.26;
    var C = 0.06 + rnd() * 0.09;
    var sign = rnd() < 0.5 ? -1 : 1;
    var L2 = L + sign * delta;
    if (L2 > 0.86 || L2 < 0.42) { sign = -sign; L2 = L + sign * delta; }
    var c = fitChroma(L, L2, C, hue);
    return {
      level: level, size: size, count: count, odd: Math.floor(rnd() * count), delta: delta,
      base: toHex(oklchToRgb(L, c, hue)), oddColor: toHex(oklchToRgb(L2, c, hue)),
      baseL: L, oddL: L2, chroma: c, hue: hue
    };
  }

  // ---------------------------------------------------------------- 한 판
  function newGame(seed) {
    if (seed == null) seed = Math.floor(Math.random() * 4294967296);
    var g = { seed: seed >>> 0, rnd: mulberry32(seed), level: 0, score: 0, misses: 0, penaltyMs: 0, over: false, round: null };
    g.round = makeRound(0, g.rnd);
    return g;
  }
  /* 칸 i 를 눌렀다: 맞으면 { ok: true, score } + 다음 레벨, 틀리면 { ok: false, penalty }. 끝난 판이면 null. */
  function pick(g, i) {
    if (!g || g.over) return null;
    i = Math.floor(Number(i));
    if (!(i >= 0 && i < g.round.count)) return null;
    if (i === g.round.odd) {
      g.score++;
      g.level++;
      var prev = g.round;
      g.round = makeRound(g.level, g.rnd);
      return { ok: true, score: g.score, prev: prev };
    }
    g.misses++;
    g.penaltyMs += PENALTY_MS;
    return { ok: false, penalty: PENALTY_MS, misses: g.misses };
  }
  function timeLeft(g, elapsedMs) { return Math.max(0, TIME_MS - Math.max(0, elapsedMs) - (g ? g.penaltyMs : 0)); }

  function tierOf(score) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (score >= TIERS[i]) t = i;
    return t;
  }

  // ---------------------------------------------------------------- 서버 점수 분포
  function bucket(score) {
    var n = Math.round(Number(score));
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }
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
  /* 분포에서 내 위치 (rows = 내 점수를 넣은 뒤의 전체 분포). 같은 구간은 절반만 이긴 것으로.
   * 다른 사람이 없으면 { first: true }(화면에는 숨김). rows 가 배열이 아니면(실패) null. */
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
    GAME: GAME, TIME_MS: TIME_MS, PENALTY_MS: PENALTY_MS, SIZES: SIZES, MAX_SIZE: MAX_SIZE,
    START_DELTA: START_DELTA, DECAY: DECAY, MIN_DELTA: MIN_DELTA, TIERS: TIERS, MAX_BUCKET: MAX_BUCKET,
    mulberry32: mulberry32, sizeOf: sizeOf, deltaOf: deltaOf, oklchToRgb: oklchToRgb, inGamut: inGamut, toHex: toHex,
    makeRound: makeRound, newGame: newGame, pick: pick, timeLeft: timeLeft, tierOf: tierOf,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
