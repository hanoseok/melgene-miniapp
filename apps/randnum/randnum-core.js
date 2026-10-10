/* apps/randnum/randnum-core.js — 랜덤 숫자 뽑기 언어 무관 로직 (UMD: 브라우저 window.RANDNUM_CORE + Node 검사 공용)
 *   - 범위: 정수 min ~ max (음수 가능, 각각 -1e9 ~ 1e9), 개수 1 ~ 1000, 중복 허용/불가, 정렬, 뺄 숫자(최대 1000개).
 *   - 뽑기: crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음). 범위 크기는 최대 2e9+1 < 2^32 이라 32비트 한 번으로 충분.
 *     뺄 숫자가 있으면 "남은 숫자 k 번째"로 바로 옮긴다(배열을 만들지 않음).
 *     중복 불가 = 희소(Map) 부분 Fisher–Yates → 범위가 10억이어도 메모리는 뽑는 개수만큼.
 *   - 공유 링크: #d=<UTF-8 base64url(JSON {v,a,b,n,u,s,x,r,t,l})> — 받는 사람은 다시 뽑지 않고 그 결과를 그대로 본다.
 *   - 기록: 최근 10번(저장은 화면 쪽 localStorage, 여기서는 목록 다루기만).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RANDNUM_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LIMIT = 1000000000;      // |min|, |max| ≤ 1e9
  var MAX_COUNT = 1000;
  var MAX_EXCLUDE = 1000;      // 뺄 숫자(펼친 뒤) 최대 개수
  var MAX_LABEL = 60;
  var HISTORY_MAX = 10;
  var U32 = 4294967296;
  var DEFAULTS = { a: 1, b: 100, n: 1, u: false, s: false };
  var PRESETS = [
    { id: '1-6', a: 1, b: 6 },
    { id: '1-10', a: 1, b: 10 },
    { id: '1-45', a: 1, b: 45, n: 6, u: false, s: true },
    { id: '1-100', a: 1, b: 100 },
  ];

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('randnum-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('randnum-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('randnum-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // ---------------------------------------------------------------- 입력 읽기
  // 정수 문자열 → 숫자 (공백·천 단위 쉼표/점/공백 허용 안 함: "1e3" "1.5" 는 거절). 빈 값 → null
  function parseIntStrict(v) {
    if (typeof v === 'number') return Number.isInteger(v) ? v : NaN;
    var s = String(v == null ? '' : v).trim().replace(/[−–]/g, '-');
    if (!s) return null;
    if (!/^[-+]?\d{1,12}$/.test(s)) return NaN;
    return Number(s);
  }
  // 뺄 숫자: 쉼표·공백·세미콜론·줄바꿈으로 나눔. "7" "-3" "10-15" "-5--2" "3~8" "3..8" (범위는 작은 쪽→큰 쪽 상관없음)
  function parseExclude(text) {
    var out = [];
    var bad = [];
    var seen = {};
    var tooMany = false;
    var parts = String(text == null ? '' : text).replace(/[−]/g, '-').replace(/[–—]/g, '~').split(/[\s,;、，；]+/);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p) continue;
      var m = /^([-+]?\d{1,10})(?:-|~|\.\.)([-+]?\d{1,10})$/.exec(p);
      var lo, hi;
      if (m) { lo = Number(m[1]); hi = Number(m[2]); if (lo > hi) { var tmp = lo; lo = hi; hi = tmp; } }
      else if (/^[-+]?\d{1,10}$/.test(p)) { lo = hi = Number(p); }
      else { bad.push(p); continue; }
      if (Math.abs(lo) > LIMIT || Math.abs(hi) > LIMIT) { bad.push(p); continue; }
      if (hi - lo + 1 > MAX_EXCLUDE) { tooMany = true; continue; }
      for (var v = lo; v <= hi; v++) {
        if (!seen[v]) { seen[v] = 1; out.push(v); if (out.length > MAX_EXCLUDE) { tooMany = true; break; } }
      }
      if (tooMany) break;
    }
    out.sort(function (x, y) { return x - y; });
    return { values: out.slice(0, MAX_EXCLUDE), bad: bad, tooMany: tooMany };
  }

  // ---------------------------------------------------------------- 검사
  // raw = { min, max, count, dup, sort, exclude(text) | x(array), label }
  // → { ok:true, p:{ a,b,n,u,s,x,l }, available } | { ok:false, error, field }
  function validate(raw) {
    raw = raw || {};
    var a = parseIntStrict(raw.min);
    var b = parseIntStrict(raw.max);
    var n = parseIntStrict(raw.count);
    if (a === null || isNaN(a)) return { ok: false, error: 'minInvalid', field: 'min' };
    if (b === null || isNaN(b)) return { ok: false, error: 'maxInvalid', field: 'max' };
    if (Math.abs(a) > LIMIT || Math.abs(b) > LIMIT) return { ok: false, error: 'outOfLimit', field: Math.abs(a) > LIMIT ? 'min' : 'max' };
    if (a > b) return { ok: false, error: 'minGtMax', field: 'min' };
    if (n === null || isNaN(n) || n < 1) return { ok: false, error: 'countInvalid', field: 'count' };
    if (n > MAX_COUNT) return { ok: false, error: 'countTooBig', field: 'count' };
    var x;
    if (Array.isArray(raw.x)) {
      x = raw.x.filter(function (v) { return Number.isInteger(v); });
      if (x.length > MAX_EXCLUDE) return { ok: false, error: 'excludeTooMany', field: 'exclude' };
    } else {
      var ex = parseExclude(raw.exclude);
      if (ex.bad.length) return { ok: false, error: 'excludeBad', field: 'exclude', bad: ex.bad };
      if (ex.tooMany) return { ok: false, error: 'excludeTooMany', field: 'exclude' };
      x = ex.values;
    }
    // 범위 안의 뺄 숫자만 (정렬·중복 제거)
    var inRange = [];
    var seen = {};
    x.slice().sort(function (p, q) { return p - q; }).forEach(function (v) {
      if (v >= a && v <= b && !seen[v]) { seen[v] = 1; inRange.push(v); }
    });
    var u = !!raw.dup;
    var available = (b - a + 1) - inRange.length;
    if (available < 1) return { ok: false, error: 'allExcluded', field: 'exclude' };
    if (!u && n > available) return { ok: false, error: 'notEnough', field: 'count', available: available };
    var l = String(raw.label == null ? '' : raw.label).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, MAX_LABEL);
    return { ok: true, p: { a: a, b: b, n: n, u: u, s: !!raw.sort, x: inRange, l: l }, available: available };
  }

  // 남은 숫자(뺄 숫자 제외) 가운데 k 번째(0부터) 값. ex = 범위 안 뺄 숫자(오름차순)
  function nthAllowed(a, ex, k) {
    var v = a + k;
    for (var i = 0; i < ex.length; i++) {
      if (ex[i] <= v) v++;
      else break;
    }
    return v;
  }

  // p = validate().p, randInt(max) 주입 가능(검사용) → 결과 배열(뽑힌 순서, s 면 오름차순)
  function draw(p, randInt) {
    var ri = randInt || cryptoInt;
    var ex = p.x || [];
    var size = (p.b - p.a + 1) - ex.length;
    var out = [];
    var i;
    if (p.u) {
      for (i = 0; i < p.n; i++) out.push(nthAllowed(p.a, ex, ri(size)));
    } else {
      // 희소 부분 Fisher–Yates: 0..size-1 가상 배열에서 앞 n 칸을 섞는다
      var swap = new Map();
      for (i = 0; i < p.n; i++) {
        var j = i + ri(size - i);
        var vj = swap.has(j) ? swap.get(j) : j;
        var vi = swap.has(i) ? swap.get(i) : i;
        swap.set(j, vi);
        swap.set(i, vj);
        out.push(nthAllowed(p.a, ex, vj));
      }
    }
    if (p.s) out.sort(function (x, y) { return x - y; });
    return out;
  }

  function presetMatch(a, b) {
    for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].a === a && PRESETS[i].b === b) return PRESETS[i].id;
    return '';
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=…)
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
  // rec = { p:{a,b,n,u,s,x,l}, r:[…], t: 뽑은 시각(ms) }
  function encodeShare(rec) {
    if (!rec || !rec.p || !Array.isArray(rec.r)) return null;
    var p = rec.p;
    var o = { v: 1, a: p.a, b: p.b, n: p.n, u: p.u ? 1 : 0, s: p.s ? 1 : 0, r: rec.r, t: Math.floor((rec.t || 0) / 1000) };
    if (p.x && p.x.length) o.x = p.x;
    if (p.l) o.l = p.l;
    return b64urlEncode(JSON.stringify(o));
  }
  // 받은 문자열을 꼼꼼히 검사: 범위·개수·뺄 숫자·결과(범위 안, 뺄 숫자 아님, 중복 불가면 서로 다름, 정렬이면 오름차순)
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 60000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || o.v !== 1 || !Array.isArray(o.r)) return null;
    if (o.x != null && !Array.isArray(o.x)) return null;
    if (o.l != null && typeof o.l !== 'string') return null;
    if (!Number.isInteger(o.t) || o.t < 0 || o.t > 99999999999) return null;
    var chk = validate({ min: o.a, max: o.b, count: o.n, dup: o.u === 1, sort: o.s === 1, x: o.x || [], label: o.l || '' });
    if (!chk.ok) return null;
    var p = chk.p;
    if ((o.x || []).length !== p.x.length) return null;
    if (o.r.length !== p.n) return null;
    var exSet = {};
    p.x.forEach(function (v) { exSet[v] = 1; });
    var seen = {};
    for (var i = 0; i < o.r.length; i++) {
      var v = o.r[i];
      if (!Number.isInteger(v) || v < p.a || v > p.b || exSet[v]) return null;
      if (!p.u) { if (seen[v]) return null; seen[v] = 1; }
      if (p.s && i && v < o.r[i - 1]) return null;
    }
    return { p: p, r: o.r.slice(), t: o.t * 1000 };
  }

  // ---------------------------------------------------------------- 기록
  function pushHistory(list, entry) {
    return [entry].concat(Array.isArray(list) ? list : []).slice(0, HISTORY_MAX);
  }
  // localStorage 에서 읽은 값 정리(모양이 틀린 항목은 버림)
  function cleanHistory(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (h) {
      return h && h.p && Number.isInteger(h.p.a) && Number.isInteger(h.p.b) && Array.isArray(h.r) && h.r.length && h.r.every(Number.isInteger) && Number.isFinite(h.t);
    }).slice(0, HISTORY_MAX);
  }

  return {
    LIMIT: LIMIT, MAX_COUNT: MAX_COUNT, MAX_EXCLUDE: MAX_EXCLUDE, MAX_LABEL: MAX_LABEL, HISTORY_MAX: HISTORY_MAX,
    DEFAULTS: DEFAULTS, PRESETS: PRESETS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, parseIntStrict: parseIntStrict, parseExclude: parseExclude,
    validate: validate, nthAllowed: nthAllowed, draw: draw, presetMatch: presetMatch,
    encodeShare: encodeShare, decodeShare: decodeShare, b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode,
    pushHistory: pushHistory, cleanHistory: cleanHistory,
  };
});
