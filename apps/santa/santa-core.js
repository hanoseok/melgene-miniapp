/* apps/santa/santa-core.js — 마니또 뽑기 언어 무관 로직 (UMD: 브라우저 window.SANTA_CORE + Node 검사 공용)
 *   - 이름 3~30명(줄바꿈·쉼표). 같은 이름은 " 2" " 3" 을 붙여 구분.
 *   - 제외 쌍("이 둘은 서로 안 뽑기", 예: 커플): 둘 다 서로를 뽑지 않는다. "2명끼리 서로 뽑기 막기"(2-cycle 없음) 옵션.
 *   - 뽑기 = crypto.getRandomValues 거부 샘플링으로 균등한 순열(Fisher–Yates)을 만들고, 조건(자기 자신 없음·제외 쌍·2-cycle)을
 *     만족할 때까지 버리고 다시(최대 MAX_TRIES 번). 그래서 결과는 "조건을 만족하는 모든 배정" 위에서 정확히 균등하다.
 *   - 불가능한 조건은 먼저 백트래킹(가장 선택지가 적은 사람부터)으로 찾는다: 하나도 없으면 'impossible',
 *     있는데 샘플링이 다 실패하면(아주 빡빡한 조건) 'tooHard' — 어떤 경우에도 치우친 결과를 대신 내놓지 않는다.
 *   - 개인 링크(#d=…): {v:1, e:모임 이름, g:주는 사람, r:받는 사람, b:예산, t:교환일} JSON → UTF-8 → 가벼운 XOR 가림(무작위 4바이트 씨앗)
 *     → base64url. 받는 사람 이름을 한눈에 읽을 수 없게 할 뿐 암호는 아니다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SANTA_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_PEOPLE = 3;
  var MAX_PEOPLE = 30;
  var MAX_NAME = 16;
  var MAX_EVENT = 40;
  var MAX_BUDGET = 24;
  var MAX_EXCL = 40;
  var MAX_TRIES = 200000;     // 거부 샘플링 최대 횟수(30명이라도 1초 안팎)
  var SEARCH_LIMIT = 200000;  // 백트래킹 최대 노드 수
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max (거부 샘플링: limit 이상은 버리고 다시)
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('santa-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('santa-core: random source keeps returning rejected values');
  }
  var pool = null, poolPos = 0;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('santa-core: crypto.getRandomValues is not available');
    if (!pool || poolPos >= pool.length) { pool = new Uint32Array(4096); c.getRandomValues(pool); poolPos = 0; }
    return pool[poolPos++];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // 균등한 순열(Fisher–Yates, 뒤에서부터 j = 0..i)
  function randomPerm(n, randInt) {
    var ri = randInt || cryptoInt;
    var a = new Array(n);
    for (var i = 0; i < n; i++) a[i] = i;
    for (var k = n - 1; k > 0; k--) {
      var j = ri(k + 1);
      var t = a[k]; a[k] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 글자 정리 · 이름
  function cleanText(v, max) {
    var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069<>{}]/g, ' ').replace(/\s+/g, ' ').trim();
    var chars = Array.from(s);
    return chars.length > max ? chars.slice(0, max).join('').trim() : s;
  }
  function textLen(s) { return Array.from(String(s)).length; }
  function parseNames(text) {
    var list = Array.isArray(text) ? text : String(text == null ? '' : text).split(/[\n\r,，、;；]+/);
    var out = [];
    var seen = {};
    var long = false;
    list.forEach(function (raw) {
      var n = cleanText(raw, MAX_NAME + 50);
      if (!n) return;
      if (textLen(n) > MAX_NAME) { long = true; n = cleanText(n, MAX_NAME); }
      var base = n;
      var k = 1;
      while (seen[n.toLowerCase()]) { k++; n = cleanText(base, MAX_NAME - String(k).length - 1) + ' ' + k; }
      seen[n.toLowerCase()] = 1;
      out.push(n);
    });
    return { names: out, long: long };
  }
  // 예산·날짜
  function cleanDate(v) {
    var s = String(v == null ? '' : v).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return '';
    var d = new Date(s + 'T00:00:00Z');
    if (isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) return '';
    return s;
  }

  // 제외 쌍: [[이름, 이름], …] → 이름 목록에 있는 서로 다른 두 사람만, 중복 없이(순서 무관), 최대 MAX_EXCL
  function pairKey(a, b) { return a < b ? a + '\u0001' + b : b + '\u0001' + a; }
  function cleanPairs(pairs, names) {
    var idx = {};
    (names || []).forEach(function (n, i) { idx[n] = i; });
    var seen = {};
    var out = [];
    (Array.isArray(pairs) ? pairs : []).forEach(function (p) {
      if (!Array.isArray(p) || p.length !== 2) return;
      var a = String(p[0]), b = String(p[1]);
      if (a === b || !(a in idx) || !(b in idx)) return;
      var k = pairKey(a, b);
      if (seen[k] || out.length >= MAX_EXCL) return;
      seen[k] = 1;
      out.push(idx[a] < idx[b] ? [a, b] : [b, a]);
    });
    return out;
  }

  // ---------------------------------------------------------------- 조건 · 검사
  // 허용 행렬: ok[g][r] = g 가 r 을 뽑아도 되는가 (자기 자신 X, 제외 쌍 X)
  function allowMatrix(n, pairIdx) {
    var ok = [];
    for (var g = 0; g < n; g++) { ok.push([]); for (var r = 0; r < n; r++) ok[g].push(g !== r); }
    (pairIdx || []).forEach(function (p) { ok[p[0]][p[1]] = false; ok[p[1]][p[0]] = false; });
    return ok;
  }
  // a[g] = g 가 선물할 사람(받는 사람) 번호
  function isValid(a, n, ok, noPairs) {
    if (!Array.isArray(a) || a.length !== n) return false;
    var used = new Array(n);
    for (var g = 0; g < n; g++) {
      var r = a[g];
      if (typeof r !== 'number' || r < 0 || r >= n || r !== Math.floor(r) || used[r] || !ok[g][r]) return false;
      used[r] = true;
      if (noPairs && a[r] === g) return false;
    }
    return true;
  }
  // 백트래킹: 가능한 배정이 하나라도 있는가. 'yes' | 'no' | 'unknown'(한도 초과)
  function feasible(n, ok, noPairs, limit) {
    var a = new Array(n).fill(-1);
    var usedR = new Array(n).fill(false);
    var nodes = 0;
    var max = limit || SEARCH_LIMIT;
    function options(g) {
      var list = [];
      for (var r = 0; r < n; r++) {
        if (usedR[r] || !ok[g][r]) continue;
        if (noPairs && a[r] === g) continue;
        list.push(r);
      }
      return list;
    }
    function receiverStuck() {
      // 아직 아무도 안 뽑은 사람 중, 뽑아 줄 수 있는 남은 사람이 없는 사람이 있으면 막다른 길
      for (var r = 0; r < n; r++) {
        if (usedR[r]) continue;
        var any = false;
        for (var g = 0; g < n && !any; g++) if (a[g] < 0 && ok[g][r] && !(noPairs && a[r] === g)) any = true;
        if (!any) return true;
      }
      return false;
    }
    function go(depth) {
      if (depth === n) return true;
      if (++nodes > max) throw new Error('limit');
      if (receiverStuck()) return false;
      var best = -1, bestOpts = null;
      for (var g = 0; g < n; g++) {
        if (a[g] >= 0) continue;
        var o = options(g);
        if (!o.length) return false;
        if (!bestOpts || o.length < bestOpts.length) { best = g; bestOpts = o; }
      }
      for (var i = 0; i < bestOpts.length; i++) {
        var r = bestOpts[i];
        a[best] = r; usedR[r] = true;
        if (go(depth + 1)) return true;
        a[best] = -1; usedR[r] = false;
      }
      return false;
    }
    try { return go(0) ? 'yes' : 'no'; } catch (e) { if (e.message === 'limit') return 'unknown'; throw e; }
  }

  // raw = { event, names:text|array, budget, date, pairs:[[a,b]], noPairs:bool }
  function validate(raw) {
    raw = raw || {};
    var nm = parseNames(raw.names);
    if (nm.names.length < MIN_PEOPLE) return { ok: false, error: 'namesTooFew', n: nm.names.length };
    if (nm.names.length > MAX_PEOPLE) return { ok: false, error: 'namesTooMany', n: nm.names.length };
    var cfg = {
      event: cleanText(raw.event, MAX_EVENT),
      names: nm.names,
      budget: cleanText(raw.budget, MAX_BUDGET),
      date: cleanDate(raw.date),
      pairs: cleanPairs(raw.pairs, nm.names),
      noPairs: !!raw.noPairs
    };
    return { ok: true, cfg: cfg, longName: nm.long };
  }
  function pairIndexes(cfg) {
    var idx = {};
    cfg.names.forEach(function (n, i) { idx[n] = i; });
    return cfg.pairs.map(function (p) { return [idx[p[0]], idx[p[1]]]; });
  }

  // 뽑기: { ok:true, a:[…], tries } | { ok:false, error:'impossible'|'tooHard' }
  function draw(cfg, randInt, opts) {
    opts = opts || {};
    var n = cfg.names.length;
    var ok = allowMatrix(n, pairIndexes(cfg));
    var f = feasible(n, ok, cfg.noPairs, opts.searchLimit);
    if (f === 'no') return { ok: false, error: 'impossible' };
    var max = opts.maxTries || MAX_TRIES;
    for (var t = 1; t <= max; t++) {
      var a = randomPerm(n, randInt);
      if (isValid(a, n, ok, cfg.noPairs)) return { ok: true, a: a, tries: t };
    }
    return { ok: false, error: 'tooHard' };
  }

  // ---------------------------------------------------------------- 확인 진행
  function progress(checked, n) {
    var k = 0;
    for (var i = 0; i < n; i++) if (checked && checked[i]) k++;
    return { k: k, n: n, all: n > 0 && k === n };
  }

  // ---------------------------------------------------------------- 저장된 뽑기 정리 (localStorage, 이번 뽑기만)
  function sanitizeDraw(o) {
    if (!o || typeof o !== 'object' || o.v !== 1) return null;
    var v = validate({ event: o.event, names: Array.isArray(o.names) ? o.names : [], budget: o.budget, date: o.date, pairs: o.pairs, noPairs: o.noPairs });
    if (!v.ok || v.cfg.names.length !== (o.names || []).length || v.cfg.names.some(function (x, i) { return x !== o.names[i]; })) return null;
    var n = v.cfg.names.length;
    var ok = allowMatrix(n, pairIndexes(v.cfg));
    if (!isValid(o.a, n, ok, v.cfg.noPairs)) return null;
    var checked = [];
    for (var i = 0; i < n; i++) checked.push(!!(Array.isArray(o.checked) && o.checked[i]));
    return { v: 1, event: v.cfg.event, names: v.cfg.names, budget: v.cfg.budget, date: v.cfg.date, pairs: v.cfg.pairs, noPairs: v.cfg.noPairs, a: o.a.slice(), checked: checked, done: !!o.done };
  }

  // ---------------------------------------------------------------- 개인 링크 (#d=…)
  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    return Buffer.from(str, 'utf8');
  }
  function bytesToB64url(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    var b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlToBytes(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  // 가벼운 가림: 씨앗 4바이트로 xorshift32 키 흐름을 만들어 XOR (암호가 아니라 "한눈에 안 보이게")
  function maskBytes(bytes, seed) {
    var out = new Uint8Array(bytes.length);
    var x = (seed >>> 0) || 0x9e3779b9;
    for (var i = 0; i < bytes.length; i++) {
      x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
      out[i] = bytes[i] ^ (x & 0xff) ^ ((i * 31 + 7) & 0xff);
    }
    return out;
  }
  function encodeLink(o, seed) {
    if (!o) return null;
    var g = cleanText(o.g, MAX_NAME), r = cleanText(o.r, MAX_NAME);
    if (!g || !r || g === r) return null;
    var payload = { v: 1, e: cleanText(o.e, MAX_EVENT), g: g, r: r, b: cleanText(o.b, MAX_BUDGET), t: cleanDate(o.t) };
    var s = seed == null ? cryptoU32() : (seed >>> 0);
    var body = maskBytes(utf8Bytes(JSON.stringify(payload)), s);
    var all = new Uint8Array(4 + body.length);
    all[0] = (s >>> 24) & 0xff; all[1] = (s >>> 16) & 0xff; all[2] = (s >>> 8) & 0xff; all[3] = s & 0xff;
    all.set(body, 4);
    return bytesToB64url(all);
  }
  function decodeLink(str) {
    if (!str || typeof str !== 'string' || str.length > 1200 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try {
      var all = b64urlToBytes(str);
      if (all.length < 6) return null;
      var s = ((all[0] << 24) | (all[1] << 16) | (all[2] << 8) | all[3]) >>> 0;
      var json = new TextDecoder('utf-8', { fatal: true }).decode(maskBytes(all.subarray(4), s));
      o = JSON.parse(json);
    } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1) return null;
    var keys = ['v', 'e', 'g', 'r', 'b', 't'];
    if (Object.keys(o).some(function (k) { return keys.indexOf(k) < 0; })) return null;
    if (['e', 'g', 'r', 'b', 't'].some(function (k) { return o[k] != null && typeof o[k] !== 'string'; })) return null;
    if (textLen(o.g || '') > MAX_NAME * 2 || textLen(o.r || '') > MAX_NAME * 2 || textLen(o.e || '') > MAX_EVENT * 2 || textLen(o.b || '') > MAX_BUDGET * 2) return null;
    var g = cleanText(o.g, MAX_NAME), r = cleanText(o.r, MAX_NAME);
    if (!g || !r || g === r) return null;
    return { e: cleanText(o.e, MAX_EVENT), g: g, r: r, b: cleanText(o.b, MAX_BUDGET), t: cleanDate(o.t) };
  }

  return {
    MIN_PEOPLE: MIN_PEOPLE, MAX_PEOPLE: MAX_PEOPLE, MAX_NAME: MAX_NAME, MAX_EVENT: MAX_EVENT, MAX_BUDGET: MAX_BUDGET, MAX_EXCL: MAX_EXCL, MAX_TRIES: MAX_TRIES,
    uniformInt: uniformInt, cryptoInt: cryptoInt, randomPerm: randomPerm,
    cleanText: cleanText, parseNames: parseNames, cleanDate: cleanDate, cleanPairs: cleanPairs,
    allowMatrix: allowMatrix, isValid: isValid, feasible: feasible, validate: validate, pairIndexes: pairIndexes, draw: draw,
    progress: progress, sanitizeDraw: sanitizeDraw, maskBytes: maskBytes, encodeLink: encodeLink, decodeLink: decodeLink
  };
});
