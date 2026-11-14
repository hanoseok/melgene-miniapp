/* apps/award/award-core.js — 상장 만들기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="award-core.js">)와 Node(tools/check-award.js · flow-test.js)가 같은 코드를 쓴다.
 *
 * 상장 = { t 디자인(0~3), s 도장(0 없음 · 1 빨간 도장 · 2 금메달), ti 상 이름, to 받는 사람, m 수상 이유, d 날짜(YYYY-MM-DD), is 주는 사람·단체 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"t":0,"s":1,"d":"2026-12-24","ti":"..","to":"..","m":"..","is":".."} )> (빈 글 칸은 키째 생략)
 * 디코딩은 길이·문자·형식을 검사하고 글은 cleanText 로 다시 정리한다(꺾쇠·태그·제어 문자 제거, 길이 자르기). 화면에는 textContent·canvas 로만 쓴다.
 * 그림은 award.js 가 canvas 로 그린다(1240×1754, A4 비율). 여기에는 디자인 색·글 정리·검증·인코딩·날짜·줄바꿈(wrap)·도장 글자만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.AW_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var LIMITS = { ti: 24, to: 20, m: 140, is: 24 }; // 코드 포인트 기준
  var W = 1240;
  var H = 1754; // A4 (1 : 1.4145)
  // 디자인: bg 배경 2색(위→아래), paper 안쪽 종이, frame 테두리, accent 강조(상 이름), ink 본문, sub 보조, emoji 칩·OG 용
  var THEMES = [
    { id: 'gold', emoji: '🏆', bg: ['#fbf3dc', '#f3e5bf'], paper: '#fffaf0', frame: '#b8892b', frame2: '#e2c06a', accent: '#8a5a12', ink: '#2b2116', sub: '#6b5a43', style: 'gold' },
    { id: 'pastel', emoji: '🌸', bg: ['#ffeaf2', '#e6f6ff'], paper: '#fffdfd', frame: '#f49ac1', frame2: '#9ad7f4', accent: '#e0528f', ink: '#3a2f44', sub: '#7a6a86', style: 'pastel' },
    { id: 'minimal', emoji: '◻️', bg: ['#ffffff', '#f6f6f4'], paper: '#ffffff', frame: '#1d2433', frame2: '#c9ccd3', accent: '#1d4ed8', ink: '#141821', sub: '#5c6370', style: 'minimal' },
    { id: 'ribbon', emoji: '🎀', bg: ['#f4e6cf', '#e9d2ad'], paper: '#fbf1de', frame: '#7a3b1d', frame2: '#c94a3a', accent: '#b8322a', ink: '#3b2414', sub: '#7a5638', style: 'ribbon' },
  ];
  var SEALS = ['none', 'red', 'gold'];
  var KEYS = ['t', 's', 'd', 'ti', 'to', 'm', 'is'];
  var TEXT_KEYS = ['ti', 'to', 'm', 'is'];
  var MAX_HASH = 1800;

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

  // 날짜: 'YYYY-MM-DD' (2000~2099, 실제 있는 날만)
  function validDate(d) {
    if (typeof d !== 'string' || !/^20\d\d-\d\d-\d\d$/.test(d)) return false;
    var y = +d.slice(0, 4), m = +d.slice(5, 7), day = +d.slice(8, 10);
    var dt = new Date(Date.UTC(y, m - 1, day));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === day;
  }
  function today(now) {
    var n = now || new Date();
    var p = function (v) { return (v < 10 ? '0' : '') + v; };
    return n.getFullYear() + '-' + p(n.getMonth() + 1) + '-' + p(n.getDate());
  }
  // 그 언어 날짜 모양 (Intl, UTC 로 고정 — 시간대 때문에 하루 밀리지 않게)
  function formatDate(d, lang) {
    if (!validDate(d)) return '';
    var dt = new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)));
    try { return new Intl.DateTimeFormat(lang || 'en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(dt); } catch (e) { return d; }
  }

  // 쓸 수 있는 상장이면 새 객체, 아니면 null
  function normalize(x) {
    if (!x || typeof x !== 'object') return null;
    if (!validIndex(x.t, THEMES.length) || !validIndex(x.s, SEALS.length) || !validDate(x.d)) return null;
    return { t: x.t, s: x.s, d: x.d, ti: cleanText(x.ti, LIMITS.ti), to: cleanText(x.to, LIMITS.to), m: cleanText(x.m, LIMITS.m), is: cleanText(x.is, LIMITS.is) };
  }
  function copy(x) { return { t: x.t, s: x.s, d: x.d, ti: x.ti || '', to: x.to || '', m: x.m || '', is: x.is || '' }; }
  function defaults(now) { return { t: 0, s: 1, d: today(now), ti: '', to: '', m: '', is: '' }; }
  function same(a, b) {
    return !!a && !!b && KEYS.every(function (k) { return (a[k] == null ? '' : a[k]) === (b[k] == null ? '' : b[k]); });
  }

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
  function encode(card) {
    var x = normalize(card);
    if (!x) return null;
    var p = { v: 1, t: x.t, s: x.s, d: x.d };
    TEXT_KEYS.forEach(function (k) { if (x[k]) p[k] = x[k]; });
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      var o = { t: p.t, s: p.s, d: p.d };
      var bad = false;
      TEXT_KEYS.forEach(function (k) {
        if (p[k] == null) { o[k] = ''; return; }
        if (typeof p[k] !== 'string' || p[k].length > 400) { bad = true; return; }
        o[k] = p[k];
      });
      return bad ? null : normalize(o);
    } catch (e) {
      return null;
    }
  }

  // ---------------------------------------------------------------
  // 줄바꿈 (canvas 용): measure(문자열) → 폭(px). 단어 단위(Intl.Segmenter — 한중일·태국어도 단어 경계),
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
      // 문장 부호는 줄 첫머리에 오지 않게: 앞 단어와 함께 다음 줄로
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

  // 도장 글자: 주는 사람 이름의 첫 글자(문자 우선, 없으면 숫자, 라틴은 대문자). 없으면 fallback(언어 파일 card.sealFallback)
  function sealChar(issuer, fallback) {
    var gs = graphemes(cleanText(issuer, LIMITS.is));
    var i;
    for (i = 0; i < gs.length; i++) if (/\p{L}/u.test(gs[i])) return gs[i].toLocaleUpperCase();
    for (i = 0; i < gs.length; i++) if (/\p{N}/u.test(gs[i])) return gs[i];
    return fallback || '★';
  }

  return {
    W: W, H: H, KEYS: KEYS, LIMITS: LIMITS, THEMES: THEMES, SEALS: SEALS, MAX_HASH: MAX_HASH,
    cleanText: cleanText, validDate: validDate, today: today, formatDate: formatDate, normalize: normalize, copy: copy, defaults: defaults, same: same,
    encode: encode, decode: decode, graphemes: graphemes, wrap: wrap, sealChar: sealChar,
  };
});
