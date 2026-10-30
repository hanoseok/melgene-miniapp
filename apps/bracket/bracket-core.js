/* apps/bracket/bracket-core.js — 토너먼트 대진표 언어 무관 로직 (UMD: 브라우저 window.BRACKET_CORE + Node 검사 공용)
 *   - 참가 항목 2~64개(줄바꿈, 한 줄이면 쉼표). 앞뒤 공백 정리, 대소문자 무시 중복 제거, 항목당 24자.
 *   - 시드: 무작위(crypto.getRandomValues 거부 샘플링 Fisher–Yates — 모든 순서가 정확히 같은 확률) 또는 입력 순서 그대로.
 *   - 대진표 크기 = 2의 거듭제곱(size ≥ n). 부전승(bye) = size − n 개. 표준 시드 배치(1 vs size, 2 vs size−1 …)에 시드 n+1..size 를 bye 로 두어
 *     bye 는 늘 진짜 참가자와 만나고(bye 끼리 없음), 위/아래 절반에 고르게(차이 ≤ 1) 퍼진다. bye 경기는 경기 수에 넣지 않고 자동 진출.
 *   - 진짜 경기 수 = n − 1, 우승자 1명.
 *   - 상태 { v:1, t:제목, n:[시드 순 이름], s:'r'|'o', m:'p'(한 판씩 고르기)|'d'(대진표만), w:[경기별 -1|0|1] } — 경기 번호는 라운드 순(1라운드 0..size/2-1, 다음 라운드 …).
 *   - 승자를 바꾸거나 지우면 그 경기에서 결승까지 이어지는 경기 결과를 지운다(그 자리 사람이 바뀌었으므로).
 *   - 공유 링크 #d= = 상태 JSON(w 는 '0','1','-' 문자열) → UTF-8 → base64url. 읽을 때 sanitize(모양·길이·중복·경기 순서 재검사).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BRACKET_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_ITEMS = 2;
  var MAX_ITEMS = 64;
  var MAX_NAME = 24;
  var MAX_TITLE = 40;
  var MAX_LINK = 12000; // #d= 글자 수 한도
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max (거부 샘플링: limit 이상은 버리고 다시)
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('bracket-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('bracket-core: random source keeps returning rejected values');
  }
  var pool = null, poolPos = 0;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('bracket-core: crypto.getRandomValues is not available');
    if (!pool || poolPos >= pool.length) { pool = new Uint32Array(1024); c.getRandomValues(pool); poolPos = 0; }
    return pool[poolPos++];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }
  // 균등 섞기(Fisher–Yates) — 새 배열
  function shuffle(list, randInt) {
    var ri = randInt || cryptoInt;
    var a = list.slice();
    for (var k = a.length - 1; k > 0; k--) {
      var j = ri(k + 1);
      var t = a[k]; a[k] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 글자 정리 · 항목
  function cleanText(v, max) {
    var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069<>{}]/g, ' ').replace(/\s+/g, ' ').trim();
    var chars = Array.from(s);
    return chars.length > max ? chars.slice(0, max).join('').trim() : s;
  }
  function textLen(s) { return Array.from(String(s)).length; }
  // 줄바꿈으로 나눈다. 한 줄뿐이고 쉼표가 있으면 쉼표로 나눈다. → { items, dupes, long }
  function parseItems(text) {
    var list;
    if (Array.isArray(text)) list = text;
    else {
      var s = String(text == null ? '' : text);
      var lines = s.split(/\r?\n|\r/).filter(function (x) { return x.trim(); });
      list = lines.length === 1 && /[,，、]/.test(lines[0]) ? lines[0].split(/[,，、]/) : lines;
    }
    var out = [], seen = {}, dupes = 0, long = false;
    list.forEach(function (raw) {
      if (typeof raw !== 'string' && typeof raw !== 'number') return;
      var n = cleanText(raw, MAX_NAME + 200);
      if (!n) return;
      if (textLen(n) > MAX_NAME) { long = true; n = cleanText(n, MAX_NAME); }
      var key = n.toLowerCase();
      if (seen[key]) { dupes++; return; }
      seen[key] = 1;
      out.push(n);
    });
    return { items: out, dupes: dupes, long: long };
  }
  function validate(raw) {
    raw = raw || {};
    var p = parseItems(raw.items);
    if (p.items.length < MIN_ITEMS) return { ok: false, error: 'tooFew', n: p.items.length };
    if (p.items.length > MAX_ITEMS) return { ok: false, error: 'tooMany', n: p.items.length };
    return { ok: true, items: p.items, title: cleanText(raw.title, MAX_TITLE), seed: raw.seed === 'o' ? 'o' : 'r', mode: raw.mode === 'd' ? 'd' : 'p', dupes: p.dupes, long: p.long };
  }

  // ---------------------------------------------------------------- 대진표 모양
  function bracketSize(n) { var s = 2; while (s < n) s *= 2; return s; }
  function roundsOf(size) { var r = 0; while ((1 << r) < size) r++; return r; }
  // 표준 시드 배치: 자리 순서대로 시드 번호(1부터). size 2 → [1,2], 4 → [1,4,2,3], 8 → [1,8,4,5,2,7,3,6]
  function seedOrder(size) {
    var a = [1];
    while (a.length < size) {
      var L = a.length * 2, b = [];
      for (var i = 0; i < a.length; i++) b.push(a[i], L + 1 - a[i]);
      a = b;
    }
    return a;
  }
  // 1라운드 자리: 참가자 번호(시드 순 이름의 index) 또는 -1(bye)
  function firstSlots(n) {
    var size = bracketSize(n);
    return seedOrder(size).map(function (s) { return s <= n ? s - 1 : -1; });
  }
  function roundOffset(size, r) { return size - (size >> r); }
  function matchIndex(size, r, m) { return roundOffset(size, r) + m; }

  // 새 대진표. randInt 는 검사용(없으면 crypto)
  function create(v, randInt) {
    var names = v.seed === 'o' ? v.items.slice() : shuffle(v.items, randInt);
    var size = bracketSize(names.length);
    var w = [];
    for (var i = 0; i < size - 1; i++) w.push(-1);
    return { v: 1, t: v.title || '', n: names, s: v.seed === 'o' ? 'o' : 'r', m: v.mode === 'd' ? 'd' : 'p', w: w };
  }

  // 상태 → 경기 목록·자리·우승자. 자리 값: 참가자 번호 ≥ 0, -1 = bye, -2 = 아직 모름
  function resolve(st) {
    var n = st.n.length, size = bracketSize(n), R = roundsOf(size);
    var S = [firstSlots(n)];
    var matches = [];
    var real = 0, decided = 0;
    for (var r = 0; r < R; r++) {
      var next = [];
      var cnt = size >> (r + 1);
      for (var m = 0; m < cnt; m++) {
        var idx = matchIndex(size, r, m);
        var a = S[r][2 * m], b = S[r][2 * m + 1];
        var bye = r === 0 && (a === -1 || b === -1);
        var ready = a >= 0 && b >= 0;
        var pick = st.w[idx];
        var win = -2;
        if (bye) win = a === -1 ? b : a;
        else if (ready && (pick === 0 || pick === 1)) win = pick === 0 ? a : b;
        if (!bye) { real++; if (win >= 0) decided++; }
        matches.push({ idx: idx, r: r, m: m, a: a, b: b, bye: bye, ready: ready && !bye, pick: bye ? -1 : pick, win: win });
        next.push(win);
      }
      S.push(next);
    }
    var champ = S[R][0];
    return { size: size, rounds: R, slots: S, matches: matches, real: real, decided: decided, champion: champ >= 0 ? champ : -1 };
  }
  // 이 경기에서 결승까지 이어지는 경기 번호들(자기 자신 제외)
  function downstream(size, idx) {
    var R = roundsOf(size), out = [];
    var r = 0;
    while (r < R && idx >= roundOffset(size, r + 1)) r++;
    var m = idx - roundOffset(size, r);
    for (var rr = r + 1; rr < R; rr++) { m = m >> 1; out.push(matchIndex(size, rr, m)); }
    return out;
  }
  // 승자 고르기: 바뀌면 이어지는 경기 결과를 지운다. → true(바뀜) | false
  function setPick(st, idx, side) {
    if (side !== 0 && side !== 1) return false;
    var res = resolve(st);
    var mt = res.matches[idx];
    if (!mt || !mt.ready) return false;
    if (st.w[idx] === side) return false;
    st.w[idx] = side;
    downstream(res.size, idx).forEach(function (j) { st.w[j] = -1; });
    return true;
  }
  function clearPick(st, idx) {
    if (!(idx >= 0 && idx < st.w.length) || st.w[idx] === -1) return false;
    st.w[idx] = -1;
    downstream(bracketSize(st.n.length), idx).forEach(function (j) { st.w[j] = -1; });
    return true;
  }
  // 다음에 고를 경기(라운드 순, 위에서부터) 또는 null
  function nextMatch(st) {
    var res = resolve(st);
    for (var i = 0; i < res.matches.length; i++) { var mt = res.matches[i]; if (mt.ready && mt.win < 0) return mt; }
    return null;
  }
  // 라운드 이름 정보: key = final | semi | quarter | of, n = 남은 인원(자리 수), h = n/2
  function roundInfo(r, rounds) {
    var left = 1 << (rounds - r);
    return { key: left === 2 ? 'final' : left === 4 ? 'semi' : left === 8 ? 'quarter' : 'of', n: left, h: left / 2 };
  }

  // ---------------------------------------------------------------- 상태 검사 (localStorage · #d=)
  function sanitize(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1 || !Array.isArray(o.n)) return null;
    if (o.n.length < MIN_ITEMS || o.n.length > MAX_ITEMS) return null;
    if (o.n.some(function (x) { return typeof x !== 'string' || textLen(x) > MAX_NAME * 2; })) return null;
    var p = parseItems(o.n);
    if (p.items.length !== o.n.length) return null; // 빈 이름·중복이 있으면 거절
    if (o.t != null && (typeof o.t !== 'string' || textLen(o.t) > MAX_TITLE * 2)) return null;
    var size = bracketSize(p.items.length);
    var wRaw = o.w == null ? '' : o.w;
    var w = [];
    if (typeof wRaw === 'string') {
      if (wRaw && (wRaw.length !== size - 1 || !/^[01-]+$/.test(wRaw))) return null;
      for (var i = 0; i < size - 1; i++) w.push(wRaw ? (wRaw[i] === '-' ? -1 : Number(wRaw[i])) : -1);
    } else if (Array.isArray(wRaw)) {
      if (wRaw.length !== size - 1) return null;
      for (var j = 0; j < size - 1; j++) { var x = wRaw[j]; if (x !== -1 && x !== 0 && x !== 1) return null; w.push(x); }
    } else return null;
    var st = { v: 1, t: cleanText(o.t, MAX_TITLE), n: p.items, s: o.s === 'o' ? 'o' : 'r', m: o.m === 'd' ? 'd' : 'p', w: w };
    // 아직 정해지지 않은 경기(또는 bye)의 결과는 지운다 — 라운드 순으로 한 번 훑으면 앞 라운드가 먼저 정리된다
    for (var k = 0; k < st.w.length; k++) {
      if (st.w[k] === -1) continue;
      var mt = resolve(st).matches[k];
      if (!mt.ready) st.w[k] = -1;
    }
    return st;
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=, base64url UTF-8 JSON)
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
  function compact(st) {
    return { v: 1, t: st.t || '', n: st.n.slice(), s: st.s, m: st.m, w: st.w.map(function (x) { return x === -1 ? '-' : String(x); }).join('') };
  }
  // → 문자열 또는 null(너무 길면)
  function encode(st) {
    var s = bytesToB64url(utf8Bytes(JSON.stringify(compact(st))));
    return s.length > MAX_LINK ? null : s;
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_LINK || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try {
      var json = new TextDecoder('utf-8', { fatal: true }).decode(b64urlToBytes(str));
      o = JSON.parse(json);
    } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    var keys = ['v', 't', 'n', 's', 'm', 'w'];
    if (Object.keys(o).some(function (k) { return keys.indexOf(k) < 0; })) return null;
    if (typeof o.w !== 'string') return null;
    return sanitize(o);
  }

  // ---------------------------------------------------------------- 글로 복사
  // L = { title, round(info) → 이름, vs, bye, champion }
  function toText(st, L) {
    var res = resolve(st);
    var lines = ['🏆 ' + (st.t || L.title)];
    for (var r = 0; r < res.rounds; r++) {
      lines.push('');
      lines.push('[' + L.round(roundInfo(r, res.rounds)) + ']');
      res.matches.filter(function (mt) { return mt.r === r; }).forEach(function (mt) {
        var nm = function (x) { return x >= 0 ? st.n[x] : x === -1 ? L.bye : '?'; };
        if (mt.bye) { lines.push('• ' + nm(mt.win) + ' (' + L.bye + ')'); return; }
        var line = '• ' + nm(mt.a) + ' ' + L.vs + ' ' + nm(mt.b);
        if (mt.win >= 0) line += ' → ' + st.n[mt.win];
        lines.push(line);
      });
    }
    if (res.champion >= 0) { lines.push(''); lines.push(L.champion + ': ' + st.n[res.champion]); }
    return lines.join('\n');
  }

  return {
    MIN_ITEMS: MIN_ITEMS, MAX_ITEMS: MAX_ITEMS, MAX_NAME: MAX_NAME, MAX_TITLE: MAX_TITLE, MAX_LINK: MAX_LINK,
    uniformInt: uniformInt, cryptoInt: cryptoInt, shuffle: shuffle,
    cleanText: cleanText, parseItems: parseItems, validate: validate,
    bracketSize: bracketSize, roundsOf: roundsOf, seedOrder: seedOrder, firstSlots: firstSlots, matchIndex: matchIndex,
    create: create, resolve: resolve, downstream: downstream, setPick: setPick, clearPick: clearPick, nextMatch: nextMatch, roundInfo: roundInfo,
    sanitize: sanitize, compact: compact, encode: encode, decode: decode, toText: toText
  };
});
