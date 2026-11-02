/* apps/wrapped/wrapped-core.js — 올해 결산 카드 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="wrapped-core.js"> → window.WRAPPED_CORE)와 Node(tools/check-wrapped.js)가 같은 코드를 쓴다.
 *
 * 카드 = { t 테마, y 결산 연도, nm 이름, w 올해의 한 단어, mo 최고의 순간, so 올해의 노래, fo 올해의 음식, pl 올해의 장소, th 고마운 사람, go 내년 목표 }
 *   글 칸은 모두 선택이지만 완성하려면 w(올해의 한 단어)는 있어야 한다(canFinish).
 * 연도: 문자열에 연도를 쓰지 않는다. reviewYear(오늘) = 1월이면 지난해, 그 밖에는 올해(12월 연말 결산 → 그해).
 *   공유 링크에는 만든 사람의 연도(y)가 들어가서 받는 사람도 같은 연도로 본다.
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"t":0,"y":2026,"w":"..",...} )> (빈 글 칸은 키째 생략)
 * 그림은 wrapped.js 가 canvas 로 그린다(라벨 문구는 언어별이라 브라우저에서). 여기에는 테마(색·이모지·배경 그림 종류),
 * 글 정리·검증·인코딩, 줄바꿈 계산(wrap: 단어 단위 Intl.Segmenter, 긴 토막은 글자 단위), 반짝이 위치(seeded)만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.WRAPPED_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var W = 1080;
  var H = 1350;
  // 글 칸: id, 최대 길이(코드 포인트), 카드에 그릴 때 이모지
  var FIELDS = [
    { id: 'nm', max: 20 },
    { id: 'w', max: 16 },
    { id: 'mo', max: 40, emoji: '🌟' },
    { id: 'so', max: 40, emoji: '🎧' },
    { id: 'fo', max: 30, emoji: '🍜' },
    { id: 'pl', max: 30, emoji: '📍' },
    { id: 'th', max: 30, emoji: '💌' },
    { id: 'go', max: 40, emoji: '🚀' },
  ];
  var TEXT_KEYS = FIELDS.map(function (f) { return f.id; });
  var LIMITS = {};
  FIELDS.forEach(function (f) { LIMITS[f.id] = f.max; });
  var ROWS = FIELDS.filter(function (f) { return !!f.emoji; }); // 카드 목록에 들어가는 6칸 (순서 = 그리는 순서)
  var KEYS = ['t', 'y'].concat(TEXT_KEYS);
  var YEAR_MIN = 2000;
  var YEAR_MAX = 2100;
  // 테마: bg 위→아래 그라데이션 3색, accent 강조색(큰 단어·연도), text 본문색, sub 라벨색, panel 목록 바탕(rgba), scene 배경 그림 종류
  var THEMES = [
    { id: 'aurora', emoji: '🌌', bg: ['#2b1258', '#4a1f7a', '#12082b'], accent: '#ffd36e', text: '#fdf8ff', sub: '#d9c6ff', panel: 'rgba(255,255,255,0.08)', scene: 'blobs' },
    { id: 'sunset', emoji: '🌅', bg: ['#ff8a5c', '#f2577b', '#7a2a6e'], accent: '#fff4c2', text: '#fffaf5', sub: '#ffe0d4', panel: 'rgba(60,10,40,0.22)', scene: 'sun' },
    { id: 'mint', emoji: '🍃', bg: ['#e6fbf2', '#c9f2e1', '#a8e6cf'], accent: '#0f7a55', text: '#173a2e', sub: '#3f6b5b', panel: 'rgba(255,255,255,0.6)', scene: 'dots' },
    { id: 'midnight', emoji: '🌙', bg: ['#0e1838', '#14214a', '#060b1c'], accent: '#f3c76b', text: '#f4f6ff', sub: '#b8c4ee', panel: 'rgba(255,255,255,0.07)', scene: 'stars' },
    { id: 'paper', emoji: '📝', bg: ['#fbf6ec', '#f6efe1', '#efe5d2'], accent: '#d2483a', text: '#2b2420', sub: '#7a6a5c', panel: 'rgba(120,90,60,0.08)', scene: 'lines' },
    { id: 'neon', emoji: '⚡', bg: ['#0b0b0f', '#121218', '#050507'], accent: '#c6ff3d', text: '#f2fff0', sub: '#9fe8c9', panel: 'rgba(198,255,61,0.08)', scene: 'bars' },
  ];
  var SCENES = ['blobs', 'sun', 'dots', 'stars', 'lines', 'bars'];

  // ---------------------------------------------------------------
  // 연도 (문자열에 연도를 쓰지 않는다 — 오늘 날짜로 계산)
  // ---------------------------------------------------------------
  function reviewYear(d) {
    var now = d instanceof Date ? d : new Date();
    var y = now.getFullYear();
    return now.getMonth() === 0 ? y - 1 : y; // 1월 = 지난해 결산, 2~12월 = 올해
  }
  function validYear(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= YEAR_MIN && v <= YEAR_MAX; }

  // ---------------------------------------------------------------
  // 글 정리
  // ---------------------------------------------------------------
  function cleanText(s, max) {
    var str = String(s == null ? '' : s)
      .replace(/[\u0000-\u001f\u007f-\u009f\u200b\u200c\u200e\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ')
      .replace(/<[^<>]*>/g, '')
      .replace(/[<>]/g, '')
      .replace(/[ \t\n\r\f\v\u1680\u2000-\u200a\u2028\u2029\u205f\u3000]+/g, ' ') // \u00a0·\u202f(프랑스어 ?! 앞 좁은 공백)는 남긴다
      .replace(/^ +| +$/g, '');
    var chars = Array.from(str);
    if (chars.length > max) str = chars.slice(0, max).join('').trim();
    return str;
  }
  function validIndex(v, n) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= 0 && v < n; }
  // 쓸 수 있는 카드면 새 객체, 아니면 null
  function normalize(x) {
    if (!x || typeof x !== 'object') return null;
    if (!validIndex(x.t, THEMES.length) || !validYear(x.y)) return null;
    var o = { t: x.t, y: x.y };
    FIELDS.forEach(function (f) { o[f.id] = cleanText(x[f.id], f.max); });
    return o;
  }
  function copy(x) {
    var o = { t: x.t, y: x.y };
    TEXT_KEYS.forEach(function (k) { o[k] = x[k] || ''; });
    return o;
  }
  function defaults(year) {
    var o = { t: 0, y: validYear(year) ? year : reviewYear() };
    TEXT_KEYS.forEach(function (k) { o[k] = ''; });
    return o;
  }
  function same(a, b) {
    return !!a && !!b && KEYS.every(function (k) { return (a[k] == null ? '' : a[k]) === (b[k] == null ? '' : b[k]); });
  }
  function canFinish(x) { return !!x && !!cleanText(x.w, LIMITS.w); }
  function filledRows(x) { return ROWS.filter(function (f) { return !!(x && x[f.id]); }); }

  // ---------------------------------------------------------------
  // 공유 링크 (#d=...) — UTF-8 안전 base64url
  // ---------------------------------------------------------------
  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    return Buffer.from(str, 'utf8');
  }
  function b64urlEncode(str) {
    var bytes = utf8Bytes(str);
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
  var MAX_HASH = 2000;
  function encode(card) {
    var x = normalize(card);
    if (!x) return null;
    var p = { v: 1, t: x.t, y: x.y };
    TEXT_KEYS.forEach(function (k) { if (x[k]) p[k] = x[k]; });
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      var o = { t: p.t, y: p.y };
      var bad = false;
      TEXT_KEYS.forEach(function (k) {
        if (p[k] == null) { o[k] = ''; return; }
        if (typeof p[k] !== 'string') { bad = true; return; }
        o[k] = p[k];
      });
      if (bad) return null;
      var x = normalize(o);
      return x && canFinish(x) ? x : null; // 받은 카드는 한 단어가 있어야 보여 줄 수 있다
    } catch (e) {
      return null;
    }
  }

  // ---------------------------------------------------------------
  // 줄바꿈 (canvas 용): measure(문자열) → 폭(px). 단어 단위(Intl.Segmenter word — 한중일·태국어도 단어 경계),
  // 한 토막이 폭보다 길면 글자(grapheme) 단위로 자른다.
  // ---------------------------------------------------------------
  function graphemes(s) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(String(s)), function (x) { return x.segment; });
    }
    return Array.from(String(s));
  }
  function tokens(text, lang) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      try { return Array.from(new Intl.Segmenter(lang || undefined, { granularity: 'word' }).segment(text), function (x) { return x.segment; }); } catch (e) { /* noop */ }
    }
    return text.split(/(\s+)/);
  }
  var PUNCT = /^[\s  ]*[、。，．,.!?！？…」』)）»”’:;]+$/;
  function wrap(measure, text, maxW, lang) {
    var out = [];
    var cur = [];
    var join = function (a) { return a.join('').trim(); };
    tokens(String(text || ''), lang).forEach(function (tk) {
      if (!tk) return;
      if (measure(join(cur.concat(tk))) <= maxW) { cur.push(tk); return; }
      var carry = [];
      // 문장 부호(、。,.!?)는 줄 첫머리에 오지 않게: 앞 단어와 함께 다음 줄로
      if (PUNCT.test(tk) && cur.length > 1) {
        while (cur.length > 1 && /^\s+$/.test(cur[cur.length - 1])) cur.pop();
        carry = [cur.pop()];
      }
      if (join(cur)) out.push(join(cur));
      cur = carry.concat(/^\s+$/.test(tk) ? [] : [tk]);
      if (measure(join(cur)) > maxW) {
        var piece = '';
        graphemes(join(cur)).forEach(function (g) {
          if (measure(piece + g) > maxW && piece) { out.push(piece.trim()); piece = g; } else piece += g;
        });
        cur = [piece];
      }
    });
    if (join(cur)) out.push(join(cur));
    return out.filter(Boolean);
  }

  // ---------------------------------------------------------------
  // 반짝이 위치 (테마마다 같은 자리 — 같은 카드 = 같은 그림). 글 자리(가운데)는 비운다.
  // ---------------------------------------------------------------
  function sparkles(seed, n) {
    var s = (seed * 2654435761 + 12345) >>> 0;
    function rnd() { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    var out = [];
    for (var i = 0; i < n; i++) {
      var f = { x: rnd() * W, y: rnd() * H, r: 2 + rnd() * 6, a: 0.25 + rnd() * 0.55 };
      if (f.x > 100 && f.x < W - 100 && f.y > 120 && f.y < H - 120) continue;
      out.push(f);
    }
    return out;
  }

  return {
    W: W, H: H, KEYS: KEYS, TEXT_KEYS: TEXT_KEYS, FIELDS: FIELDS, ROWS: ROWS, LIMITS: LIMITS, THEMES: THEMES, SCENES: SCENES,
    MAX_HASH: MAX_HASH, YEAR_MIN: YEAR_MIN, YEAR_MAX: YEAR_MAX,
    reviewYear: reviewYear, validYear: validYear, cleanText: cleanText, normalize: normalize, copy: copy, defaults: defaults, same: same,
    canFinish: canFinish, filledRows: filledRows, encode: encode, decode: decode, graphemes: graphemes, wrap: wrap, sparkles: sparkles,
  };
});
