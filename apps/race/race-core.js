/* apps/race/race-core.js — 동물 달리기 시합 언어 무관 로직 (UMD: 브라우저 window.RACE_CORE + Node 검사 공용)
 *   - 2~10명. 레인 i 에 동물 ANIMALS[i] 가 달린다(동물은 꾸밈일 뿐 — 확률과 상관없음).
 *   - 순위를 먼저 정한다: crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음) + Fisher–Yates 로 레인 순서를 섞은 것이 곧 도착 순서.
 *   - 그 다음 연출 계획(planRace)을 만든다: 순위별 도착 시각(1등 6.0~7.6초, 전체 9초 안, 승부가 갈리는 자리는 0.03~0.1초 차),
 *     레인마다 속도 곡선(출발은 0에서, 구간마다 속도가 바뀌고 가끔 질주·비틀거림). 위치 = 속도를 적분한 거리 / 전체 거리 →
 *     모든 레인이 자기 도착 시각에 정확히 1(결승선)에 닿고 그 전에는 1보다 작다. 그래서 화면 속 도착 순서 = 정한 순위.
 *   - 모드: win(1등이 이김) · lose(꼴찌가 짐/삼). 모드는 연출의 접전 자리만 바꾸고 순위 확률에는 영향이 없다.
 *   - 공유 링크(#d=): 이름(빈 칸은 '' = 받는 사람 언어의 기본 이름)과 모드만. 결과는 담지 않는다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RACE_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_RUNNERS = 2;
  var MAX_RUNNERS = 10;
  var DEFAULT_RUNNERS = 4;
  var MAX_NAME = 14;
  var HISTORY_MAX = 10;
  // 레인 순서대로 맡는 동물(널리 그려지는 이모지만: Unicode 6~10). 모두 왼쪽을 보고 있어 화면에서는 좌우를 뒤집는다.
  var ANIMALS = ['🐇', '🐢', '🐎', '🐕', '🐈', '🐧', '🦆', '🐖', '🐘', '🦒'];
  var WIN_MIN_MS = 6000;      // 1등 도착 시각
  var WIN_MAX_MS = 7600;
  var MAX_TOTAL_MS = 9000;    // 꼴찌 도착 시각 한도
  var CLOSE_MIN_MS = 30;      // 승부 자리(win: 1·2등, lose: 꼴찌·그 앞) 차이
  var CLOSE_MAX_MS = 100;
  var GAP_MIN_MS = 90;        // 그 밖의 순위 사이 차이
  var GAP_MAX_MS = 340;
  var SEGMENTS = 8;           // 속도가 바뀌는 구간 수
  var BURST_V = 1.75;         // 이 속도 이상 = 질주(💨), 이하 = 비틀거림
  var STUMBLE_V = 0.4;
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('race-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('race-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('race-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }
  // [a, b] 사이 실수(연출용, 0.0001 단위, crypto)
  function randRange(a, b, randInt) { var ri = randInt || cryptoInt; return a + (b - a) * (ri(10001) / 10000); }

  // Fisher–Yates (뒤에서부터, j = 0..i 균등). randInt 주입 가능(검사용). 원본은 건드리지 않는다.
  function shuffle(arr, randInt) {
    var ri = randInt || cryptoInt;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  // 도착 순서: order[k] = k 등(0 = 1등) 레인 번호. n! 가지가 모두 같은 확률.
  function finishOrder(n, randInt) {
    var lanes = [];
    for (var i = 0; i < n; i++) lanes.push(i);
    return shuffle(lanes, randInt);
  }

  // ---------------------------------------------------------------- 글자 정리 · 이름
  function cleanText(v, max) {
    var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069<>{}]/g, ' ').replace(/\s+/g, ' ').trim();
    var chars = Array.from(s);
    return chars.length > max ? chars.slice(0, max).join('').trim() : s;
  }
  function textLen(s) { return Array.from(String(s)).length; }
  function clampCount(n) {
    n = Math.round(Number(n));
    if (!isFinite(n)) return DEFAULT_RUNNERS;
    return Math.max(MIN_RUNNERS, Math.min(MAX_RUNNERS, n));
  }
  // 입력 칸 값 목록 → 보일 이름. 빈 칸은 placeholder(i)(예: "Player 1"), 같은 이름은 " 2" " 3".
  function resolveNames(inputs, placeholder) {
    var ph = typeof placeholder === 'function' ? placeholder : function (i) { return String(i + 1); };
    var seen = {};
    return (inputs || []).map(function (raw, i) {
      var n = cleanText(raw, MAX_NAME) || cleanText(ph(i), MAX_NAME + 6) || String(i + 1);
      var base = n;
      var k = 1;
      while (seen[n.toLowerCase()]) { k++; n = cleanText(base, MAX_NAME - String(k).length - 1) + ' ' + k; }
      seen[n.toLowerCase()] = 1;
      return n;
    });
  }
  // raw = { mode:'win'|'lose', names:[입력 칸 값…] }
  function validate(raw, placeholder) {
    raw = raw || {};
    var list = Array.isArray(raw.names) ? raw.names : [];
    if (list.length < MIN_RUNNERS) return { ok: false, error: 'tooFew' };
    if (list.length > MAX_RUNNERS) return { ok: false, error: 'tooMany', n: list.length };
    var long = list.some(function (x) { return textLen(cleanText(x, 200)) > MAX_NAME; });
    return { ok: true, cfg: { mode: raw.mode === 'lose' ? 'lose' : 'win', names: resolveNames(list, placeholder) }, longName: long };
  }

  // ---------------------------------------------------------------- 연출 계획
  // 레인마다의 흐름(속도 배율 곡선): 고르게 · 초반 강세 · 막판 스퍼트 · 중반 질주 · 들쭉날쭉. 순위와 무관하게 crypto 로 고른다.
  var PROFILES = [
    function () { return 1; },
    function (x) { return 1.3 - 0.55 * x; },
    function (x) { return 0.75 + 0.55 * x; },
    function (x) { return 0.85 + 0.45 * Math.sin(Math.PI * x); },
    function (x) { return 1 + 0.3 * Math.sin(Math.PI * 3 * x); }
  ];
  // order = finishOrder 결과, mode = 'win'|'lose'. 반환 { n, mode, order, rankOf[레인], total(ms), winMs, runners[레인] }
  //   runner = { lane, rank, finish(ms), v:[SEGMENTS+1 개 속도], cum:[구간 시작까지 거리], dist(전체 거리), fx:[구간별 'burst'|'stumble'|''] }
  function planRace(order, mode, randInt) {
    var ri = randInt || cryptoInt;
    var n = order.length;
    if (n < MIN_RUNNERS || n > MAX_RUNNERS) throw new Error('race-core: bad runner count ' + n);
    var lose = mode === 'lose';
    var winMs = WIN_MIN_MS + ri(WIN_MAX_MS - WIN_MIN_MS + 1);
    var closeAt = lose ? n - 1 : 1;                  // gaps[k] = (k-1)등 ↔ k등 차이
    var gaps = [0];
    var sumOther = 0;
    for (var k = 1; k < n; k++) {
      var g = k === closeAt ? CLOSE_MIN_MS + ri(CLOSE_MAX_MS - CLOSE_MIN_MS + 1) : GAP_MIN_MS + ri(GAP_MAX_MS - GAP_MIN_MS + 1);
      gaps.push(g);
      if (k !== closeAt) sumOther += g;
    }
    var room = MAX_TOTAL_MS - winMs - gaps[closeAt];
    if (sumOther > room) {
      var scale = room / sumOther;
      for (k = 1; k < n; k++) if (k !== closeAt) gaps[k] = Math.max(CLOSE_MIN_MS, Math.floor(gaps[k] * scale));
    }
    var finishByRank = [];
    var t = winMs;
    for (k = 0; k < n; k++) { t += gaps[k]; finishByRank.push(t); }
    var rankOf = [];
    order.forEach(function (lane, r) { rankOf[lane] = r; });
    var runners = [];
    for (var lane = 0; lane < n; lane++) {
      var prof = PROFILES[ri(PROFILES.length)];
      var v = [0];
      var fx = [];
      for (var j = 1; j <= SEGMENTS; j++) {
        var x = j / SEGMENTS;
        var sp = prof(x) * randRange(0.72, 1.28, ri);
        var ev = ri(100);
        if (j < SEGMENTS && ev < 12) sp = randRange(1.8, 2.25, ri);        // 질주
        else if (j > 1 && j < SEGMENTS && ev >= 92) sp = randRange(0.2, 0.36, ri); // 비틀거림
        v.push(Math.max(0.18, sp));
      }
      var cum = [0];
      for (j = 0; j < SEGMENTS; j++) {
        cum.push(cum[j] + (v[j] + v[j + 1]) / 2);
        var hi = Math.max(v[j], v[j + 1]);
        var lo = Math.min(v[j], v[j + 1]);
        fx.push(hi >= BURST_V ? 'burst' : (j > 0 && lo <= STUMBLE_V) ? 'stumble' : '');
      }
      runners.push({ lane: lane, rank: rankOf[lane], finish: finishByRank[rankOf[lane]], v: v, cum: cum, dist: cum[SEGMENTS], fx: fx });
    }
    return { n: n, mode: lose ? 'lose' : 'win', order: order.slice(), rankOf: rankOf, winMs: winMs, total: finishByRank[n - 1], runners: runners };
  }
  // 레인의 시각 t(ms) 위치 0~1 (1 = 결승선). 속도는 구간 안에서 직선으로 바뀌고(이어짐), 위치는 그 적분.
  function positionAt(plan, lane, t) {
    var R = plan.runners[lane];
    if (!(t > 0)) return 0;
    if (t >= R.finish) return 1;
    var h = R.finish / SEGMENTS;
    var j = Math.min(SEGMENTS - 1, Math.floor(t / h));
    var tau = (t - j * h) / h;                       // 구간 안 0~1
    var d = R.cum[j] + R.v[j] * tau + (R.v[j + 1] - R.v[j]) * tau * tau / 2;
    return Math.min(1, d / R.dist);
  }
  // 그 시각의 연출 표시('burst' 질주 · 'stumble' 비틀거림 · '' 보통 · 'done' 도착)
  function fxAt(plan, lane, t) {
    var R = plan.runners[lane];
    if (t >= R.finish) return 'done';
    if (!(t > 0)) return '';
    var j = Math.min(SEGMENTS - 1, Math.floor(t / (R.finish / SEGMENTS)));
    return R.fx[j];
  }
  // 그 시각 선두 레인(가장 앞선 위치, 같으면 먼저 도착하는 쪽)
  function leaderAt(plan, t) {
    var best = -1;
    var bp = -1;
    for (var i = 0; i < plan.n; i++) {
      var p = positionAt(plan, i, t);
      if (p > bp + 1e-12 || (Math.abs(p - bp) <= 1e-12 && plan.rankOf[i] < plan.rankOf[best])) { bp = p; best = i; }
    }
    return best;
  }

  // ---------------------------------------------------------------- 기록
  function pushHistory(list, item) {
    var out = [item].concat(Array.isArray(list) ? list : []);
    return out.slice(0, HISTORY_MAX);
  }
  // 저장된 기록 읽기: 모양이 맞는 것만(손상·변조된 값은 버린다)
  function sanitizeHistory(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (h) {
      return h && typeof h === 'object' && typeof h.t === 'number' && isFinite(h.t) && (h.m === 'win' || h.m === 'lose') &&
        h.n === Math.floor(h.n) && h.n >= MIN_RUNNERS && h.n <= MAX_RUNNERS && typeof h.who === 'string' && h.who && textLen(h.who) <= MAX_NAME + 6;
    }).map(function (h) { return { t: h.t, m: h.m, n: h.n, who: cleanText(h.who, MAX_NAME + 6) }; }).slice(0, HISTORY_MAX);
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=…) — 이름 칸 + 모드만
  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    return Buffer.from(str, 'utf8');
  }
  function b64urlEncode(str) {
    var bytes = utf8Bytes(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    var b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  // o = { names:[입력 칸 값(빈 칸 '')], mode }
  function encodeShare(o) {
    if (!o || !Array.isArray(o.names) || o.names.length < MIN_RUNNERS || o.names.length > MAX_RUNNERS) return null;
    var m = o.names.map(function (x) { return cleanText(x, MAX_NAME); });
    return b64urlEncode(JSON.stringify({ v: 1, m: m, o: o.mode === 'lose' ? 'l' : 'w' }));
  }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1) return null;
    if (!Array.isArray(o.m) || o.m.length < MIN_RUNNERS || o.m.length > MAX_RUNNERS) return null;
    if (o.m.some(function (x) { return typeof x !== 'string' || textLen(x) > MAX_NAME * 2; })) return null;
    if (o.o !== 'w' && o.o !== 'l') return null;
    return { names: o.m.map(function (x) { return cleanText(x, MAX_NAME); }), mode: o.o === 'l' ? 'lose' : 'win' };
  }

  return {
    MIN_RUNNERS: MIN_RUNNERS, MAX_RUNNERS: MAX_RUNNERS, DEFAULT_RUNNERS: DEFAULT_RUNNERS, MAX_NAME: MAX_NAME, HISTORY_MAX: HISTORY_MAX,
    ANIMALS: ANIMALS, WIN_MIN_MS: WIN_MIN_MS, WIN_MAX_MS: WIN_MAX_MS, MAX_TOTAL_MS: MAX_TOTAL_MS,
    CLOSE_MIN_MS: CLOSE_MIN_MS, CLOSE_MAX_MS: CLOSE_MAX_MS, SEGMENTS: SEGMENTS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, randRange: randRange, shuffle: shuffle, finishOrder: finishOrder,
    cleanText: cleanText, clampCount: clampCount, resolveNames: resolveNames, validate: validate,
    planRace: planRace, positionAt: positionAt, fxAt: fxAt, leaderAt: leaderAt,
    pushHistory: pushHistory, sanitizeHistory: sanitizeHistory,
    b64urlEncode: b64urlEncode, encodeShare: encodeShare, decodeShare: decodeShare
  };
});
