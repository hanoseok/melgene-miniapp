/* apps/lots/lots-core.js — 제비뽑기 언어 무관 로직 (UMD: 브라우저 window.LOTS_CORE + Node 검사 공용)
 *   - 쪽지: 2 ~ 50장. 종류(라벨 + 장수 + 축하 여부) 1 ~ 10가지, 라벨 20자. 간단 모드 = 당첨 N장 + 나머지 꽝.
 *   - 참가자 이름(선택): 이름이 있으면 쪽지 수 = 이름 수(차례마다 "OO 차례").
 *   - 섞기: crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음) → Fisher–Yates. 쪽지 위치마다 내용은 섞는 순간 정해진다.
 *     사람은 아무 쪽지나 고르지만 배치가 이미 균등하게 섞여 있으므로 고르는 방법과 상관없이 누구나 같은 확률.
 *   - 공유 링크: #d=<UTF-8 base64url(JSON {v,k,m?,r,t})> — 받은 사람은 다시 뽑지 않고 그 결과를 그대로 본다(꼼꼼히 검사·정리).
 *   - 최근 설정: 화면 쪽 localStorage. 여기서는 목록 다루기만.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LOTS_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_SLIPS = 2;
  var MAX_SLIPS = 50;
  var MAX_KINDS = 10;
  var MAX_LABEL = 20;
  var MAX_NAME = 20;
  var HISTORY_MAX = 5;
  var U32 = 4294967296;
  var DEFAULTS = { count: 6, winners: 1, mode: 'simple', hide: true, fx: true };

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('lots-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('lots-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('lots-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // Fisher–Yates (뒤에서부터, j = 0..i 균등). randInt(max) 주입 가능(검사용). 원본은 건드리지 않는다.
  function shuffle(arr, randInt) {
    var ri = randInt || cryptoInt;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 글자 정리
  // 제어 문자·꺾쇠·중괄호 제거, 공백 하나로, 앞뒤 공백 제거, 글자(코드 포인트) 기준 max 자.
  function cleanText(v, max) {
    var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069<>{}]/g, ' ').replace(/\s+/g, ' ').trim();
    var chars = Array.from(s);
    return chars.length > max ? chars.slice(0, max).join('').trim() : s;
  }
  function textLen(s) { return Array.from(String(s)).length; }

  // 이름: 줄바꿈·쉼표로 나눈다. 같은 이름은 " 2" " 3" 을 붙여 구분.
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

  function toInt(v) {
    if (typeof v === 'number') return Number.isInteger(v) ? v : NaN;
    var s = String(v == null ? '' : v).trim();
    if (!/^\d{1,4}$/.test(s)) return NaN;
    return Number(s);
  }

  // ---------------------------------------------------------------- 검사
  // raw = { count, mode:'simple'|'custom', winners, winLabel, blankLabel, kinds:[{l,n,w}], names(text|array), hide, fx }
  // → { ok:true, p:{ k:[{l,n,w}], names:[], total, hide, fx }, mode } | { ok:false, error, field, … }
  function validate(raw) {
    raw = raw || {};
    var nm = parseNames(raw.names);
    var names = nm.names;
    var total;
    if (names.length) {
      if (names.length < MIN_SLIPS) return { ok: false, error: 'namesTooFew', field: 'names' };
      if (names.length > MAX_SLIPS) return { ok: false, error: 'namesTooMany', field: 'names', n: names.length };
      total = names.length;
    } else {
      total = toInt(raw.count);
      if (isNaN(total) || total < MIN_SLIPS || total > MAX_SLIPS) return { ok: false, error: 'countRange', field: 'count' };
    }
    var mode = raw.mode === 'custom' ? 'custom' : 'simple';
    var kinds = [];
    if (mode === 'simple') {
      var w = toInt(raw.winners);
      if (isNaN(w) || w < 1 || w > total) return { ok: false, error: 'winnersRange', field: 'winners', n: total };
      var wl = cleanText(raw.winLabel, MAX_LABEL) || 'O';
      var bl = cleanText(raw.blankLabel, MAX_LABEL) || 'X';
      if (wl.toLowerCase() === bl.toLowerCase()) bl = bl + ' ·';
      kinds.push({ l: wl, n: w, w: true });
      if (total - w > 0) kinds.push({ l: bl, n: total - w, w: false });
    } else {
      var rows = Array.isArray(raw.kinds) ? raw.kinds : [];
      if (!rows.length) return { ok: false, error: 'kindsEmpty', field: 'kinds' };
      if (rows.length > MAX_KINDS) return { ok: false, error: 'kindsTooMany', field: 'kinds' };
      var seen = {};
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i] || {};
        var l = cleanText(r.l, MAX_LABEL);
        var n = toInt(r.n);
        if (!l) return { ok: false, error: 'kindLabel', field: 'kinds', index: i };
        if (isNaN(n) || n < 1 || n > MAX_SLIPS) return { ok: false, error: 'kindCount', field: 'kinds', index: i };
        if (seen[l.toLowerCase()]) return { ok: false, error: 'kindDup', field: 'kinds', index: i, label: l };
        seen[l.toLowerCase()] = 1;
        kinds.push({ l: l, n: n, w: r.w !== false && r.w !== 0 });
      }
      var sum = kinds.reduce(function (a, k) { return a + k.n; }, 0);
      if (sum !== total) return { ok: false, error: 'totalMismatch', field: 'kinds', sum: sum, n: total };
    }
    return { ok: true, mode: mode, p: { k: kinds, names: names, total: total, hide: raw.hide !== false, fx: raw.fx !== false }, longName: nm.long };
  }

  // ---------------------------------------------------------------- 뽑기 판
  // 쪽지 종류 번호를 장수만큼 펼친 뒤 섞는다 → deck[위치] = 종류 번호. 섞는 순간 모든 쪽지가 정해진다.
  function makeDeck(p, randInt) {
    var flat = [];
    p.k.forEach(function (k, i) { for (var j = 0; j < k.n; j++) flat.push(i); });
    return shuffle(flat, randInt);
  }
  function newSession(p, randInt, now) {
    return { p: p, deck: makeDeck(p, randInt), taken: [], t: now || Date.now() };
  }
  // 위치 pos 의 쪽지를 지금 차례 사람이 가져간다 → 종류 번호 (이미 가져간 쪽지·범위 밖이면 -1)
  function pick(s, pos) {
    if (!s || !Number.isInteger(pos) || pos < 0 || pos >= s.deck.length || s.taken.indexOf(pos) >= 0) return -1;
    s.taken.push(pos);
    return s.deck[pos];
  }
  function results(s) { return s.taken.map(function (pos) { return s.deck[pos]; }); }
  function isDone(s) { return s.taken.length >= s.deck.length; }

  // 종류별로 누가 받았는지: [{ kind, l, w, who:[차례 번호…] }] (종류 순서 그대로, 아무도 안 뽑은 종류도 포함)
  function tally(p, r) {
    var out = p.k.map(function (k, i) { return { kind: i, l: k.l, w: k.w, who: [] }; });
    r.forEach(function (ki, turn) { if (out[ki]) out[ki].who.push(turn); });
    return out;
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
  // rec = { p:{k,names,total}, r:[종류 번호(차례 순서)], t: 뽑은 시각(ms) }
  function encodeShare(rec) {
    if (!rec || !rec.p || !Array.isArray(rec.r) || !rec.r.length) return null;
    var o = { v: 1, k: rec.p.k.map(function (k) { return [k.l, k.n, k.w ? 1 : 0]; }), r: rec.r.slice(), t: Math.floor((rec.t || 0) / 1000) };
    if (rec.p.names && rec.p.names.length) o.m = rec.p.names.slice();
    return b64urlEncode(JSON.stringify(o));
  }
  // 받은 문자열을 꼼꼼히 검사: 종류(라벨·장수·축하), 이름 수 = 쪽지 수, 결과 수 ≤ 쪽지 수, 종류마다 받은 수 ≤ 장수. 라벨·이름은 정리한 값을 쓴다.
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 8000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || o.v !== 1 || !Array.isArray(o.k) || !Array.isArray(o.r)) return null;
    if (!Number.isInteger(o.t) || o.t < 0 || o.t > 99999999999) return null;
    if (o.k.length < 1 || o.k.length > MAX_KINDS) return null;
    var rows = [];
    for (var i = 0; i < o.k.length; i++) {
      var row = o.k[i];
      if (!Array.isArray(row) || row.length !== 3 || typeof row[0] !== 'string' || !Number.isInteger(row[1]) || (row[2] !== 0 && row[2] !== 1)) return null;
      if (textLen(row[0]) > MAX_LABEL * 2) return null;
      rows.push({ l: row[0], n: row[1], w: row[2] === 1 });
    }
    var total = rows.reduce(function (a, k) { return a + (k.n > 0 ? k.n : 0); }, 0);
    var names = [];
    if (o.m != null) {
      if (!Array.isArray(o.m) || o.m.length !== total || o.m.some(function (x) { return typeof x !== 'string' || textLen(x) > MAX_NAME * 2; })) return null;
      names = o.m;
    }
    var chk = validate({ mode: 'custom', kinds: rows, count: total, names: names });
    if (!chk.ok) return null;
    if (names.length && chk.p.names.length !== names.length) return null;
    var p = chk.p;
    if (o.r.length < 1 || o.r.length > p.total) return null;
    var used = p.k.map(function () { return 0; });
    for (var j = 0; j < o.r.length; j++) {
      var ki = o.r[j];
      if (!Number.isInteger(ki) || ki < 0 || ki >= p.k.length) return null;
      used[ki]++;
      if (used[ki] > p.k[ki].n) return null;
    }
    return { p: { k: p.k, names: p.names, total: p.total, hide: true, fx: false }, r: o.r.slice(), t: o.t * 1000 };
  }

  // ---------------------------------------------------------------- 최근 설정
  // entry = { mode, winners, p:{k,names,total,hide,fx}, t }
  function setupKey(e) { return JSON.stringify([e.mode, e.p.k, e.p.names, e.p.total]); }
  function pushHistory(list, entry) {
    var key = setupKey(entry);
    var rest = (Array.isArray(list) ? list : []).filter(function (h) { return setupKey(h) !== key; });
    return [entry].concat(rest).slice(0, HISTORY_MAX);
  }
  // localStorage 에서 읽은 값 정리(검사를 다시 통과한 것만)
  function cleanHistory(list) {
    if (!Array.isArray(list)) return [];
    var out = [];
    list.forEach(function (h) {
      if (!h || !h.p || !Array.isArray(h.p.k) || !Number.isFinite(h.t)) return;
      var raw = h.mode === 'simple' && h.p.k[0]
        ? { mode: 'simple', count: h.p.total, winners: h.p.k[0].n, winLabel: h.p.k[0].l, blankLabel: h.p.k[1] ? h.p.k[1].l : '', names: h.p.names || [], hide: h.p.hide, fx: h.p.fx }
        : { mode: 'custom', count: h.p.total, kinds: h.p.k, names: h.p.names || [], hide: h.p.hide, fx: h.p.fx };
      var v = validate(raw);
      if (!v.ok) return;
      out.push({ mode: v.mode, p: v.p, t: h.t });
    });
    return out.slice(0, HISTORY_MAX);
  }

  return {
    MIN_SLIPS: MIN_SLIPS, MAX_SLIPS: MAX_SLIPS, MAX_KINDS: MAX_KINDS, MAX_LABEL: MAX_LABEL, MAX_NAME: MAX_NAME, HISTORY_MAX: HISTORY_MAX,
    DEFAULTS: DEFAULTS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, shuffle: shuffle, cleanText: cleanText, textLen: textLen, parseNames: parseNames,
    validate: validate, makeDeck: makeDeck, newSession: newSession, pick: pick, results: results, isDone: isDone, tally: tally,
    encodeShare: encodeShare, decodeShare: decodeShare, b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode,
    pushHistory: pushHistory, cleanHistory: cleanHistory,
  };
});
