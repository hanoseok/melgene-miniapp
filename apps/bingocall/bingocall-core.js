/* apps/bingocall/bingocall-core.js — 빙고 번호 추첨기 언어 무관 로직 (UMD: 브라우저 window.BINGOCALL_CORE + Node 검사 공용)
 *   - 방식: '75'(B-I-N-G-O, 1~75) · '90'(영국식 1~90) · 'custom'(직접 범위, 예: 아이들용 1~30).
 *   - 뽑기: 누를 때마다 아직 안 나온 번호 중 하나를 crypto.getRandomValues + 거부 샘플링(모듈로 치우침 없음)으로 고른다.
 *     미리 섞어 두지 않으므로 저장소를 들여다봐도 다음 번호를 알 수 없다. 이미 나온 번호는 절대 다시 나오지 않는다.
 *     모두 뽑으면 drawn 은 전체 번호의 순열이 된다. 되돌리기 = 마지막 번호를 다시 넣는다.
 *   - 상태(localStorage bingocall_state)는 sanitize 로만 읽는다(모양·범위·중복 검사, 틀리면 버림).
 *   - 일반 의사 난수는 쓰지 않는다(연출용 숫자도 crypto).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BINGOCALL_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MODES = ['75', '90', 'custom'];
  var LETTERS = ['B', 'I', 'N', 'G', 'O'];
  var CUSTOM_LO = 1;          // 직접 범위: 가장 작은 수
  var CUSTOM_HI = 999;        //            가장 큰 수
  var CUSTOM_MIN_SIZE = 5;    //            번호 개수 5~150
  var CUSTOM_MAX_SIZE = 150;
  var DEFAULT_CUSTOM = { a: 1, b: 30 };
  var INTERVALS = [3, 5, 8];  // 자동 뽑기 간격(초)
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('bingocall-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('bingocall-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('bingocall-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  function isInt(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }

  // 방식 → 번호 범위 { a, b }. custom 은 a·b 를 검사해서 쓴다.
  function rangeOf(mode, a, b) {
    if (mode === '75') return { a: 1, b: 75 };
    if (mode === '90') return { a: 1, b: 90 };
    return { a: a, b: b };
  }
  // 직접 범위 검사: 정수, 1~999, 개수 5~150.
  function validateRange(a, b) {
    a = Number(a); b = Number(b);
    if (!isInt(a) || !isInt(b) || a < CUSTOM_LO || b > CUSTOM_HI || a > CUSTOM_HI || b < CUSTOM_LO) return { ok: false, error: 'rangeBad' };
    var n = b - a + 1;
    if (n < CUSTOM_MIN_SIZE) return { ok: false, error: 'rangeSmall', n: n };
    if (n > CUSTOM_MAX_SIZE) return { ok: false, error: 'rangeBig', n: n };
    return { ok: true, a: a, b: b, n: n };
  }

  // 75볼 글자: B 1–15 · I 16–30 · N 31–45 · G 46–60 · O 61–75. 다른 방식은 ''.
  function letterOf(mode, n) {
    if (mode !== '75' || !isInt(n) || n < 1 || n > 75) return '';
    return LETTERS[Math.floor((n - 1) / 15)];
  }

  function newGame(mode, a, b) {
    var m = MODES.indexOf(mode) >= 0 ? mode : '75';
    var r;
    if (m === 'custom') {
      var v = validateRange(a, b);
      if (!v.ok) return null;
      r = { a: v.a, b: v.b };
    } else r = rangeOf(m);
    return { v: 1, mode: m, a: r.a, b: r.b, drawn: [], t0: 0, t1: 0, done: false, ended: false };
  }
  function total(g) { return g ? g.b - g.a + 1 : 0; }
  function remaining(g) {
    if (!g) return [];
    var seen = {};
    g.drawn.forEach(function (x) { seen[x] = 1; });
    var out = [];
    for (var x = g.a; x <= g.b; x++) if (!seen[x]) out.push(x);
    return out;
  }
  function isComplete(g) { return !!g && g.drawn.length >= total(g); }

  // 한 번호 뽑기: 남은 번호 중 하나(균등). 다 뽑았으면 -1. randInt 주입 가능(검사용).
  function draw(g, randInt, now) {
    if (!g || g.ended) return -1;
    var rest = remaining(g);
    if (!rest.length) return -1;
    var x = rest[(randInt || cryptoInt)(rest.length)];
    g.drawn.push(x);
    if (!g.t0) g.t0 = now || Date.now();
    return x;
  }
  // 되돌리기: 마지막 번호를 빼서 돌려준다(없으면 -1). 다시 남은 번호로 돌아간다.
  function undo(g) {
    if (!g || g.ended || !g.drawn.length) return -1;
    return g.drawn.pop();
  }
  // 끝내기: 끝난 시각을 남긴다. 한 번만.
  function end(g, now) {
    if (!g || g.ended) return false;
    g.ended = true;
    g.t1 = now || Date.now();
    return true;
  }
  // 걸린 시간(초): 첫 번호부터 끝낸 때까지(아직이면 지금까지). 첫 번호 전이면 0.
  function durationSec(g, now) {
    if (!g || !g.t0) return 0;
    var e = g.t1 || now || Date.now();
    return Math.max(0, Math.round((e - g.t0) / 1000));
  }
  // 시·분·초로 나눈다(문구는 언어 파일 템플릿).
  function splitDuration(sec) {
    sec = Math.max(0, Math.floor(Number(sec) || 0));
    return { h: Math.floor(sec / 3600), m: Math.floor((sec % 3600) / 60), s: sec % 60 };
  }

  // 판 모양: 75 = 글자 5줄 × 15칸, 90·직접 = 10칸씩 줄.
  function boardRows(g) {
    var rows = [];
    if (!g) return rows;
    if (g.mode === '75') {
      LETTERS.forEach(function (L, i) {
        var cells = [];
        for (var k = 1; k <= 15; k++) cells.push(i * 15 + k);
        rows.push({ letter: L, cells: cells });
      });
      return rows;
    }
    var start = g.mode === '90' ? 1 : g.a;
    for (var x = start; x <= g.b; x += 10) {
      var c = [];
      for (var y = x; y <= Math.min(g.b, x + 9); y++) c.push(y);
      rows.push({ letter: '', cells: c });
    }
    return rows;
  }

  // 저장된 상태 읽기: 모양·범위·중복을 검사하고 틀리면 null.
  function sanitize(o) {
    if (!o || typeof o !== 'object' || o.v !== 1 || MODES.indexOf(o.mode) < 0) return null;
    var g = newGame(o.mode, o.a, o.b);
    if (!g) return null;
    if (!Array.isArray(o.drawn) || o.drawn.length > total(g)) return null;
    var seen = {};
    for (var i = 0; i < o.drawn.length; i++) {
      var x = o.drawn[i];
      if (!isInt(x) || x < g.a || x > g.b || seen[x]) return null;
      seen[x] = 1;
    }
    g.drawn = o.drawn.slice();
    g.t0 = isInt(o.t0) && o.t0 > 0 ? o.t0 : 0;
    g.t1 = isInt(o.t1) && o.t1 >= g.t0 ? o.t1 : 0;
    if (g.drawn.length && !g.t0) g.t0 = Date.now();
    g.done = o.done === true;
    g.ended = o.ended === true;
    return g;
  }

  // 연출(굴러가는 숫자)용: 남은 번호 중 하나를 crypto 로. 결과에는 영향 없음.
  function teaseNumber(g) {
    var rest = remaining(g);
    if (!rest.length) return g ? g.a : 1;
    return rest[cryptoInt(rest.length)];
  }

  return {
    MODES: MODES,
    LETTERS: LETTERS,
    CUSTOM_LO: CUSTOM_LO,
    CUSTOM_HI: CUSTOM_HI,
    CUSTOM_MIN_SIZE: CUSTOM_MIN_SIZE,
    CUSTOM_MAX_SIZE: CUSTOM_MAX_SIZE,
    DEFAULT_CUSTOM: DEFAULT_CUSTOM,
    INTERVALS: INTERVALS,
    uniformInt: uniformInt,
    cryptoInt: cryptoInt,
    rangeOf: rangeOf,
    validateRange: validateRange,
    letterOf: letterOf,
    newGame: newGame,
    total: total,
    remaining: remaining,
    isComplete: isComplete,
    draw: draw,
    undo: undo,
    end: end,
    durationSec: durationSec,
    splitDuration: splitDuration,
    boardRows: boardRows,
    sanitize: sanitize,
    teaseNumber: teaseNumber
  };
});
