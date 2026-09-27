/* apps/roulette/roulette-core.js — 돌림판 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="roulette-core.js">)와 Node(tools/check-roulette.js)가 같은 코드를 검증한다.
 *
 * 각도 규칙 (라디안)
 *   - 휠 좌표: 포인터(12시) 방향을 0으로, 시계 방향으로 칸이 이어진다. i번 칸 = [starts[i], ends[i]).
 *   - rotation: 휠을 시계 방향으로 돌린 각도(CSS rotate 와 같은 방향). 포인터 밑에 오는 휠 각도는 (-rotation) mod 2π.
 * 공정성: 결과(당첨 칸)는 애니메이션을 시작하기 전에 crypto.getRandomValues 로 먼저 뽑고,
 *         휠은 그 칸 안의 한 점이 포인터 밑에서 멈추도록 계산된 각도까지 감속하며 돌 뿐이다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.ROULETTE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var MIN_ITEMS = 2;
  var MAX_ITEMS = 16;
  var MIN_WEIGHT = 1;
  var MAX_WEIGHT = 5;
  var MAX_LABEL = 24; // UTF-16 길이 기준 (input maxLength 와 같다). 서로게이트 쌍은 자르지 않는다.
  var TAU = Math.PI * 2;
  var THEME_IDS = ['candy', 'macaron', 'circus', 'jewel'];
  var DEFAULT_THEME = 'candy';
  var LAND_MARGIN = 0.12; // 칸 경계(핀)에서 12% 이상 떨어진 곳에 멈춘다 — 경계에 걸쳐 보이지 않게

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ---------------------------------------------------------------
  // 난수: crypto.getRandomValues (없으면 Math.random). 정수는 거부 샘플링으로 치우침 없이 뽑는다.
  // ---------------------------------------------------------------
  function cryptoSource() {
    var g = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : {});
    return g.crypto && typeof g.crypto.getRandomValues === 'function' ? g.crypto : null;
  }
  var buf = new Uint32Array(1);
  function randomUint32() {
    var c = cryptoSource();
    if (c) { c.getRandomValues(buf); return buf[0]; }
    return Math.floor(Math.random() * 4294967296);
  }
  // [0, max) 정수. max 는 2^32 이하.
  function randomInt(max) {
    max = Math.floor(max);
    if (!(max > 1)) return 0;
    var limit = 4294967296 - (4294967296 % max);
    var x;
    do { x = randomUint32(); } while (x >= limit);
    return x % max;
  }
  function randomFloat() { return randomUint32() / 4294967296; } // [0, 1)

  // ---------------------------------------------------------------
  // 항목/가중치 정규화
  // ---------------------------------------------------------------
  function normWeight(w) {
    var n = Math.round(Number(w));
    return isFinite(n) ? clamp(n, MIN_WEIGHT, MAX_WEIGHT) : MIN_WEIGHT;
  }

  function cleanLabel(s) {
    var str = String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
    if (str.length <= MAX_LABEL) return str;
    var out = '';
    var chars = Array.from(str);
    for (var i = 0; i < chars.length; i++) {
      if (out.length + chars[i].length > MAX_LABEL) break;
      out += chars[i];
    }
    return out.trim();
  }

  // 공유 링크·저장값에서 온 설정을 안전한 모양으로. 쓸 수 없으면 null.
  // { items: [문자열], weights: [1~5], weighted: bool, theme: id }
  function normalizeSetup(raw) {
    if (!raw || !Array.isArray(raw.items)) return null;
    var items = [];
    var weights = [];
    var srcW = Array.isArray(raw.weights) ? raw.weights : [];
    for (var i = 0; i < raw.items.length && items.length < MAX_ITEMS; i++) {
      if (typeof raw.items[i] !== 'string' && typeof raw.items[i] !== 'number') continue;
      var label = cleanLabel(raw.items[i]);
      if (!label) continue;
      items.push(label);
      weights.push(normWeight(srcW[i] == null ? 1 : srcW[i]));
    }
    if (items.length < MIN_ITEMS) return null;
    var weighted = !!raw.weighted || weights.some(function (w) { return w !== 1; });
    var theme = THEME_IDS.indexOf(raw.theme) >= 0 ? raw.theme : DEFAULT_THEME;
    return { items: items, weights: weights, weighted: weighted, theme: theme };
  }

  // ---------------------------------------------------------------
  // 가중치 추첨 + 칸 배치
  // ---------------------------------------------------------------
  // 정수 가중치 합 W 에서 0..W-1 을 고르게 뽑아 누적 구간으로 찾는다 → 확률 = w_i / W (정확히)
  function pickIndex(weights, randInt) {
    randInt = randInt || randomInt;
    var total = 0;
    for (var i = 0; i < weights.length; i++) total += normWeight(weights[i]);
    var r = randInt(total);
    for (var j = 0; j < weights.length; j++) {
      var w = normWeight(weights[j]);
      if (r < w) return j;
      r -= w;
    }
    return weights.length - 1;
  }

  // 칸 넓이 = 가중치 비율. 마지막 칸은 정확히 2π 에서 끝난다.
  function layout(weights) {
    var total = 0;
    var i;
    for (i = 0; i < weights.length; i++) total += normWeight(weights[i]);
    var starts = [];
    var ends = [];
    var acc = 0;
    for (i = 0; i < weights.length; i++) {
      starts.push((acc / total) * TAU);
      acc += normWeight(weights[i]);
      ends.push(i === weights.length - 1 ? TAU : (acc / total) * TAU);
    }
    return { n: weights.length, starts: starts, ends: ends, total: total };
  }

  function normAngle(a) {
    a = a % TAU;
    if (a < 0) a += TAU;
    return a;
  }

  // 휠이 rotation 만큼 돌아가 있을 때 포인터(12시) 밑에 있는 칸
  function sliceAt(rotation, lay) {
    var phi = normAngle(-rotation);
    var lo = 0;
    var hi = lay.n - 1;
    while (lo < hi) { // ends[i] > phi 인 첫 칸
      var mid = (lo + hi) >> 1;
      if (lay.ends[mid] > phi) hi = mid; else lo = mid + 1;
    }
    return lo;
  }

  // ---------------------------------------------------------------
  // 스핀 계획: 먼저 결과(index)와 칸 안의 멈출 위치(frac)를 정하고, 거기에 맞는 최종 각도를 계산한다.
  // opts: { current, weights, index?, frac?, duration?, reduced? }
  // ---------------------------------------------------------------
  function spinDuration(reduced) {
    return reduced ? 1400 + randomInt(401) : 4000 + randomInt(3001); // 4~7초 (모션 감소: 1.4~1.8초)
  }

  function planSpin(opts) {
    var lay = layout(opts.weights);
    var index = opts.index != null ? opts.index : pickIndex(opts.weights);
    var frac = opts.frac != null ? opts.frac : LAND_MARGIN + randomFloat() * (1 - 2 * LAND_MARGIN);
    var reduced = !!opts.reduced;
    var duration = opts.duration != null ? opts.duration : spinDuration(reduced);
    // 초당 약 2.5~3.5바퀴로 출발해 감속하도록 바퀴 수를 길이에 맞춘다
    var turns = opts.turns != null ? opts.turns : (reduced ? 1 : Math.floor((duration / 1000) * 0.85) + 1);
    var current = Number(opts.current) || 0;
    var phiT = lay.starts[index] + frac * (lay.ends[index] - lay.starts[index]);
    var delta = normAngle(normAngle(-phiT) - normAngle(current));
    return {
      index: index,
      frac: frac,
      from: current,
      to: current + turns * TAU + delta,
      duration: duration,
      windup: reduced ? 0 : 240,
      windupAngle: reduced ? 0 : 0.09,
      power: reduced ? 2 : 3, // 모션 감소: 더 완만한 2차 감속
      layout: lay,
    };
  }

  // 감속 곡선: ease-out (처음이 가장 빠르고 끝으로 갈수록 천천히). power 3 = 3차
  function easeOut(t, power) {
    t = clamp(t, 0, 1);
    return 1 - Math.pow(1 - t, power || 3);
  }
  function easeInOut(t) {
    t = clamp(t, 0, 1);
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // 시작 후 elapsed(ms) 시점의 휠 각도. 짧게 뒤로 당겼다가(windup) 놓아 주는 느낌 → 감속하며 plan.to 에 정확히 멈춘다.
  function angleAt(plan, elapsed) {
    if (elapsed <= 0) return plan.from;
    if (elapsed < plan.windup) {
      return plan.from - plan.windupAngle * easeInOut(elapsed / plan.windup);
    }
    var t = (elapsed - plan.windup) / plan.duration;
    if (t >= 1) return plan.to;
    var start = plan.from - plan.windupAngle;
    return start + (plan.to - start) * easeOut(t, plan.power);
  }
  function totalTime(plan) { return plan.windup + plan.duration; }

  // ---------------------------------------------------------------
  // 공유 링크 (#d=...) — UTF-8 안전 base64url
  // ---------------------------------------------------------------
  function b64urlEncode(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }

  // 설정 → 해시 문자열 (d= 뒤). 가중치가 모두 1이면 w, 기본 테마면 t 를 생략해 링크를 줄인다.
  function encodeShare(setup) {
    var s = normalizeSetup(setup);
    if (!s) return null;
    var p = { v: 1, i: s.items };
    if (s.weighted && s.weights.some(function (w) { return w !== 1; })) p.w = s.weights;
    if (s.theme !== DEFAULT_THEME) p.t = s.theme;
    return b64urlEncode(JSON.stringify(p));
  }

  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 8000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object') return null;
      return normalizeSetup({ items: p.i, weights: p.w, theme: p.t });
    } catch (e) {
      return null;
    }
  }

  // Fisher–Yates (crypto 난수) — 항목과 가중치를 같이 섞는다
  function shuffleTogether(a, b) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
      if (b) { t = b[i]; b[i] = b[j]; b[j] = t; }
    }
  }

  return {
    MIN_ITEMS: MIN_ITEMS,
    MAX_ITEMS: MAX_ITEMS,
    MIN_WEIGHT: MIN_WEIGHT,
    MAX_WEIGHT: MAX_WEIGHT,
    MAX_LABEL: MAX_LABEL,
    TAU: TAU,
    THEME_IDS: THEME_IDS,
    DEFAULT_THEME: DEFAULT_THEME,
    LAND_MARGIN: LAND_MARGIN,
    clamp: clamp,
    randomInt: randomInt,
    randomFloat: randomFloat,
    normWeight: normWeight,
    cleanLabel: cleanLabel,
    normalizeSetup: normalizeSetup,
    pickIndex: pickIndex,
    layout: layout,
    normAngle: normAngle,
    sliceAt: sliceAt,
    spinDuration: spinDuration,
    planSpin: planSpin,
    easeOut: easeOut,
    angleAt: angleAt,
    totalTime: totalTime,
    b64urlEncode: b64urlEncode,
    b64urlDecode: b64urlDecode,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    shuffleTogether: shuffleTogether,
  };
});
