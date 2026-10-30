/**
 * 새해 목표 빙고 — 언어 무관 로직 (UMD: 브라우저 window.BINGO_CORE + Node 검사).
 *   판 모양: { s: 3|4|5, t: 제목, f: 가운데 자유칸(홀수 판만), h: 색 테마 번호, c: [칸 글 s×s], m: 도장 비트마스크 }
 *   빙고 줄 = 가로·세로·대각선 2개, 자유칸은 언제나 찍힌 것으로 센다.
 *   공유(#d=)·저장(localStorage)은 같은 모양을 UTF-8 base64url JSON 으로(크기 제한, 열 때 정리). 서버로 보내는 것은 없다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BINGO_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var SIZES = [3, 4, 5];
  var LIMIT = { title: 40, cell: 40, link: 8000 };
  // 색 테마 (이름은 언어 파일 themes.<id>)
  var THEMES = [
    { id: 'sunrise', bg: '#fff4e6', bg2: '#ffd9c2', card: '#ffffff', cell: '#fff8ef', cell2: '#ffeede', ink: '#2a1d3a', dim: '#7a6a80', accent: '#ff6b3d', stamp: 'rgba(255,107,61,0.88)', line: '#ff6b3d' },
    { id: 'mint', bg: '#e8f7ef', bg2: '#c4ecd8', card: '#ffffff', cell: '#f3fbf6', cell2: '#e1f4ea', ink: '#14372a', dim: '#5d7a6d', accent: '#13a06b', stamp: 'rgba(19,160,107,0.85)', line: '#0e7f55' },
    { id: 'berry', bg: '#fdeef4', bg2: '#f8c9dc', card: '#ffffff', cell: '#fff6fa', cell2: '#fbe3ee', ink: '#3d1430', dim: '#8a6077', accent: '#e0457b', stamp: 'rgba(224,69,123,0.85)', line: '#c22e64' },
    { id: 'night', bg: '#1b1f3b', bg2: '#2f2a5c', card: '#262b52', cell: '#2f3563', cell2: '#363c70', ink: '#fdf6e3', dim: '#b8b3d6', accent: '#ffc94a', stamp: 'rgba(255,201,74,0.88)', line: '#ffc94a' },
    { id: 'ocean', bg: '#e9f3ff', bg2: '#c6defc', card: '#ffffff', cell: '#f4f9ff', cell2: '#e2eefd', ink: '#10284a', dim: '#5b7090', accent: '#2f6fe0', stamp: 'rgba(47,111,224,0.85)', line: '#1f56b8' },
    { id: 'paper', bg: '#f3ede2', bg2: '#e3d6c0', card: '#fffdf8', cell: '#fffaf0', cell2: '#f5ecdc', ink: '#2b2118', dim: '#7d6c5a', accent: '#c0392b', stamp: 'rgba(192,57,43,0.85)', line: '#a12d21' },
  ];

  function cleanText(v, max) {
    var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ').replace(/\s+/g, ' ').trim();
    var a = Array.from(s);
    return a.length > max ? a.slice(0, max).join('').trim() : s;
  }
  function freeIndex(s, f) { return f && s % 2 === 1 ? (s * s - 1) / 2 : -1; }
  function defaultYear(d) { d = d || new Date(); return d.getMonth() >= 9 ? d.getFullYear() + 1 : d.getFullYear(); }

  function lines(s) {
    var out = [], r, c, row, col, d1 = [], d2 = [];
    for (r = 0; r < s; r++) { row = []; col = []; for (c = 0; c < s; c++) { row.push(r * s + c); col.push(c * s + r); } out.push(row); out.push(col); }
    for (r = 0; r < s; r++) { d1.push(r * s + r); d2.push(r * s + (s - 1 - r)); }
    out.push(d1); out.push(d2);
    return out;
  }
  function isMarked(b, i) { return i === freeIndex(b.s, b.f) || ((b.m >>> 0) & (1 << i)) !== 0; }
  // 빙고 줄 수·완성 줄·찍은 목표 수(자유칸 제외)
  function score(b) {
    var done = lines(b.s).filter(function (ln) { return ln.every(function (i) { return isMarked(b, i); }); });
    var fi = freeIndex(b.s, b.f), goals = 0, marked = 0;
    for (var i = 0; i < b.s * b.s; i++) { if (i === fi) continue; goals++; if (isMarked(b, i)) marked++; }
    return { count: done.length, lines: done, marked: marked, goals: goals, full: marked === goals };
  }
  function toggle(b, i) {
    if (i < 0 || i >= b.s * b.s || i === freeIndex(b.s, b.f)) return b;
    b.m = ((b.m >>> 0) ^ (1 << i)) >>> 0;
    return b;
  }

  function defaultBoard(size, title) {
    var s = SIZES.indexOf(size) >= 0 ? size : 5;
    var c = []; for (var i = 0; i < s * s; i++) c.push('');
    return { s: s, t: cleanText(title || '', LIMIT.title), f: s % 2 === 1, h: 0, c: c, m: 0 };
  }
  // 크기를 바꾸면 적어 둔 글을 순서대로 옮긴다(자유칸 자리는 건너뜀), 도장은 지운다
  function resize(b, size) {
    if (SIZES.indexOf(size) < 0 || size === b.s) return b;
    var texts = b.c.filter(function (x, i) { return String(x || '').trim() && i !== freeIndex(b.s, b.f); });
    var nb = defaultBoard(size, b.t);
    nb.h = b.h; nb.f = size % 2 === 1 ? (b.s % 2 === 1 ? b.f : true) : false;
    var fi = freeIndex(nb.s, nb.f), k = 0;
    for (var i = 0; i < size * size && k < texts.length; i++) { if (i === fi) continue; nb.c[i] = texts[k++]; }
    return nb;
  }
  function setFree(b, on) {
    if (b.s % 2 === 0) { b.f = false; return b; }
    var fi = (b.s * b.s - 1) / 2;
    if (on && b.c[fi]) {
      // 가운데 글을 빈칸으로 옮긴다(없으면 버림)
      var empty = b.c.indexOf('');
      if (empty >= 0 && empty !== fi) b.c[empty] = b.c[fi];
    }
    if (on) b.c[fi] = '';
    b.f = !!on; b.m = 0;
    return b;
  }
  function filledCount(b) {
    var fi = freeIndex(b.s, b.f), n = 0, total = 0;
    for (var i = 0; i < b.s * b.s; i++) { if (i === fi) continue; total++; if (String(b.c[i] || '').trim()) n++; }
    return { n: n, total: total };
  }
  function rndInt(rnd, n) { return Math.floor(rnd() * n) % n; }
  // 빈칸을 아이디어로 채운다(이미 있는 글과 겹치지 않게)
  function fillIdeas(b, ideas, rnd) {
    rnd = rnd || Math.random;
    var fi = freeIndex(b.s, b.f);
    var used = {}; b.c.forEach(function (x) { x = cleanText(x, LIMIT.cell); if (x) used[x.toLowerCase()] = 1; });
    var pool = ideas.map(function (x) { return cleanText(x, LIMIT.cell); }).filter(function (x) { return x && !used[x.toLowerCase()]; });
    for (var i = pool.length - 1; i > 0; i--) { var j = rndInt(rnd, i + 1); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    var k = 0;
    for (var c = 0; c < b.s * b.s; c++) { if (c === fi || String(b.c[c] || '').trim()) continue; if (k >= pool.length) break; b.c[c] = pool[k++]; }
    b.m = 0;
    return k;
  }
  function shuffle(b, rnd) {
    rnd = rnd || Math.random;
    var fi = freeIndex(b.s, b.f), idx = [];
    for (var i = 0; i < b.s * b.s; i++) if (i !== fi) idx.push(i);
    var vals = idx.map(function (i) { return b.c[i]; });
    for (var a = vals.length - 1; a > 0; a--) { var j = rndInt(rnd, a + 1); var t = vals[a]; vals[a] = vals[j]; vals[j] = t; }
    idx.forEach(function (i, k) { b.c[i] = vals[k]; });
    b.m = 0;
    return b;
  }

  // ---------------- 저장·공유 모양
  function sanitize(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    var s = Number(o.s);
    if (SIZES.indexOf(s) < 0) return null;
    if (!Array.isArray(o.c) || o.c.length !== s * s) return null;
    var b = defaultBoard(s, typeof o.t === 'string' ? o.t : '');
    b.f = s % 2 === 1 && o.f === true;
    var h = Number(o.h);
    b.h = Number.isInteger(h) && h >= 0 && h < THEMES.length ? h : 0;
    var fi = freeIndex(s, b.f);
    b.c = o.c.map(function (x, i) { return i === fi || typeof x !== 'string' ? '' : cleanText(x, LIMIT.cell); });
    var m = Number(o.m);
    var mask = s * s >= 31 ? 0xffffffff : (Math.pow(2, s * s) - 1);
    b.m = Number.isInteger(m) && m >= 0 && m <= 0xffffffff ? ((m & mask) >>> 0) : 0;
    if (fi >= 0) b.m = (b.m & ~(1 << fi)) >>> 0;
    return b;
  }
  function toWire(b) { var x = sanitize(b); return x ? { s: x.s, t: x.t, f: x.f, h: x.h, c: x.c, m: x.m } : null; }
  function utf8Bytes(str) { return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(str) : Buffer.from(str, 'utf8'); }
  function b64urlEncode(str) {
    var bytes = utf8Bytes(str), bin = '';
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
  function encodeShare(b) { var w = toWire(b); if (!w) return null; var d = b64urlEncode(JSON.stringify(w)); return d.length <= LIMIT.link ? d : null; }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > LIMIT.link || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    return sanitize(o);
  }

  // ---------------- 캔버스 글 줄바꿈 (measure = 글 폭 함수). 띄어쓰기 없는 말(한중일·태국어)은 Intl.Segmenter 로 끊는다.
  function graphemes(s) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), function (x) { return x.segment; });
    return Array.from(s);
  }
  function tokens(text, lang) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try { return Array.from(new Intl.Segmenter(lang || undefined, { granularity: 'word' }).segment(text), function (x) { return x.segment; }); } catch (e) { /* noop */ }
    }
    return text.split(/(\s+)/);
  }
  function wrap(measure, text, maxW, lang) {
    var out = [], cur = '';
    tokens(String(text || ''), lang).forEach(function (tk) {
      if (!tk) return;
      var next = cur + tk;
      if (measure(next.trim()) <= maxW) { cur = next; return; }
      if (cur.trim()) out.push(cur.trim());
      cur = /^\s+$/.test(tk) ? '' : tk;
      // 한 토막이 너무 길면 글자 단위로 자른다
      if (measure(cur) > maxW) {
        var piece = '';
        graphemes(cur).forEach(function (g) {
          if (measure(piece + g) > maxW && piece) { out.push(piece); piece = g; } else piece += g;
        });
        cur = piece;
      }
    });
    if (cur.trim()) out.push(cur.trim());
    return out;
  }

  return {
    SIZES: SIZES, LIMIT: LIMIT, THEMES: THEMES,
    cleanText: cleanText, freeIndex: freeIndex, defaultYear: defaultYear, lines: lines, isMarked: isMarked, score: score, toggle: toggle,
    defaultBoard: defaultBoard, resize: resize, setFree: setFree, filledCount: filledCount, fillIdeas: fillIdeas, shuffle: shuffle,
    sanitize: sanitize, toWire: toWire, encodeShare: encodeShare, decodeShare: decodeShare, wrap: wrap,
  };
});
