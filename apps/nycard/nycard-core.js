/* apps/nycard/nycard-core.js — 2027 연하장 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="nycard-core.js">)와 Node(tools/check-nycard.js)가 같은 코드를 쓴다.
 *
 * 카드 = { t 디자인, g 인사말, o 표시 비트(1 띠 배지 · 2 큰 "2027" · 4 반짝이), to 받는 사람, fr 보내는 사람, m 메시지 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"t":0,"g":0,"o":7,"to":"..","fr":"..","m":".."} )> (빈 글 칸은 키째 생략)
 * 그림은 nycard.js 가 canvas 로 그린다(인사말·띠 문구는 언어별이라 브라우저에서). 여기에는 디자인(색·이모지·장식 위치),
 * 글 정리·검증·인코딩, 줄바꿈 계산(wrap: 단어 단위 Intl.Segmenter, 긴 토막은 글자 단위), 점 위치(seeded)만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.NY_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var LIMITS = { to: 20, fr: 20, m: 120 }; // 코드 포인트 기준
  var W = 1080;
  var H = 1350;
  var YEAR = 2027; // 정미년(丁未) — 양(염소)띠 해
  var GREETINGS = ['happy', 'formal', 'luck', 'year'];
  var DECOS = [{ id: 'zodiac', bit: 1, emoji: '🐐' }, { id: 'year', bit: 2, emoji: '🗓️' }, { id: 'sparkle', bit: 4, emoji: '✨' }];
  var ALL_DECO = 7;
  // 디자인: bg 위→아래 그라데이션 3색, accent 강조색, text 본문색, sub 보조색, dot 점(눈·별) 색, scene 배경 그림 종류, mark 구분선 가운데 글자,
  // deco = [이모지, x(0~1), y(0~1), 크기(px), 기울기(도)] — 글이 들어가는 가운데를 피해 가장자리에만 둔다(반짝이 켰을 때).
  var THEMES = [
    { id: 'red', emoji: '🧧', bg: ['#c8102e', '#a30d25', '#6e0717'], accent: '#ffd36a', text: '#fff7e6', sub: '#ffe2a8', dot: '#ffd36a', scene: 'clouds', mark: '◆',
      deco: [['🏮', 0.1, 0.1, 76, -8], ['🏮', 0.9, 0.1, 76, 8], ['🪙', 0.1, 0.9, 62, -10], ['🧧', 0.9, 0.9, 70, 10], ['✨', 0.065, 0.55, 46, 0], ['✨', 0.935, 0.55, 46, 0]] },
    { id: 'washi', emoji: '🎍', bg: ['#fbf5e9', '#f5ecdb', '#ecdfc6'], accent: '#c0392b', text: '#2a211b', sub: '#6b5a4c', dot: '#d9c7a6', scene: 'washi', mark: '❀',
      deco: [['🌸', 0.1, 0.12, 60, -12], ['🎍', 0.9, 0.12, 72, 6], ['🌸', 0.935, 0.5, 46, 10], ['🗻', 0.1, 0.9, 64, 0], ['🌸', 0.065, 0.5, 46, -6], ['🎴', 0.9, 0.9, 60, 8]] },
    { id: 'goat', emoji: '🐐', bg: ['#dff6ea', '#cdeedd', '#b9e4cf'], accent: '#e2557a', text: '#2b3a33', sub: '#4f6b5e', dot: '#ffffff', scene: 'meadow', mark: '♥',
      deco: [['🌼', 0.1, 0.1, 62, -10], ['☁️', 0.88, 0.1, 76, 0], ['🌷', 0.065, 0.5, 46, 6], ['🌼', 0.935, 0.5, 46, -6], ['🍀', 0.88, 0.3, 48, 12], ['💗', 0.12, 0.3, 46, 0]] },
    { id: 'minimal', emoji: '🌅', bg: ['#fdfcf8', '#f8f5ee', '#f1ece1'], accent: '#b23a2e', text: '#1f1c19', sub: '#6a635b', dot: '#d8d0c2', scene: 'line', mark: '●',
      deco: [['✦', 0.12, 0.1, 44, 0], ['✦', 0.88, 0.1, 44, 0], ['✦', 0.1, 0.9, 38, 0], ['✦', 0.9, 0.9, 38, 0], ['·', 0.065, 0.5, 46, 0], ['·', 0.935, 0.5, 46, 0]] },
    { id: 'snowy', emoji: '❄️', bg: ['#1c3d7a', '#132a58', '#0a1734'], accent: '#a8dcff', text: '#f3f8ff', sub: '#cfe4ff', dot: '#ffffff', scene: 'hills', mark: '❄',
      deco: [['🌙', 0.86, 0.11, 90, 12], ['⭐', 0.12, 0.11, 52, -10], ['✨', 0.935, 0.42, 46, 8], ['⭐', 0.065, 0.44, 44, 6], ['❄️', 0.065, 0.7, 46, -6], ['❄️', 0.935, 0.7, 46, 10]] },
    { id: 'fireworks', emoji: '🎆', bg: ['#1a1240', '#100b2c', '#06041a'], accent: '#ffcf5c', text: '#fbf6ff', sub: '#d8ccff', dot: '#ffffff', scene: 'bursts', mark: '✦',
      deco: [['🎉', 0.1, 0.9, 70, -10], ['🥂', 0.9, 0.9, 70, 10], ['✨', 0.1, 0.12, 54, 0], ['🎇', 0.9, 0.12, 64, 8], ['✨', 0.065, 0.55, 44, 0], ['⭐', 0.935, 0.55, 44, 0]] },
  ];
  var KEYS = ['t', 'g', 'o', 'to', 'fr', 'm'];
  var TEXT_KEYS = ['to', 'fr', 'm'];

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
    if (!validIndex(x.t, THEMES.length) || !validIndex(x.g, GREETINGS.length) || !validIndex(x.o, ALL_DECO + 1)) return null;
    return { t: x.t, g: x.g, o: x.o, to: cleanText(x.to, LIMITS.to), fr: cleanText(x.fr, LIMITS.fr), m: cleanText(x.m, LIMITS.m) };
  }
  function copy(x) { return { t: x.t, g: x.g, o: x.o, to: x.to || '', fr: x.fr || '', m: x.m || '' }; }
  function greetingIndex(id) { var i = GREETINGS.indexOf(id); return i < 0 ? 0 : i; }
  // zodiacOn: 띠 배지를 처음부터 켤지(한중일·베트남어는 켬, 그 밖은 끔 — 언어 파일 editor.zodiacOn)
  function defaults(greetingId, zodiacOn) { return { t: 0, g: greetingIndex(greetingId), o: (zodiacOn ? 1 : 0) | 2 | 4, to: '', fr: '', m: '' }; }
  function same(a, b) {
    return !!a && !!b && KEYS.every(function (k) { return (a[k] == null ? '' : a[k]) === (b[k] == null ? '' : b[k]); });
  }
  function hasDeco(x, id) {
    for (var i = 0; i < DECOS.length; i++) if (DECOS[i].id === id) return (x.o & DECOS[i].bit) !== 0;
    return false;
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
  var MAX_HASH = 1400;
  function encode(card) {
    var x = normalize(card);
    if (!x) return null;
    var p = { v: 1, t: x.t, g: x.g, o: x.o };
    TEXT_KEYS.forEach(function (k) { if (x[k]) p[k] = x[k]; });
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      var o = { t: p.t, g: p.g, o: p.o };
      var bad = false;
      TEXT_KEYS.forEach(function (k) {
        if (p[k] == null) { o[k] = ''; return; }
        if (typeof p[k] !== 'string') { bad = true; return; }
        o[k] = p[k];
      });
      return bad ? null : normalize(o);
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
  // 점(눈·별) 위치 (디자인마다 같은 자리 — 같은 카드 = 같은 그림)
  // ---------------------------------------------------------------
  function snowflakes(seed, n) {
    var s = (seed * 2654435761 + 12345) >>> 0;
    function rnd() { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }
    var out = [];
    for (var i = 0; i < n; i++) {
      var f = { x: rnd() * W, y: rnd() * H, r: 3 + rnd() * 9, a: 0.35 + rnd() * 0.55 };
      if (f.x > 120 && f.x < W - 120 && f.y > 470 && f.y < 1200) continue; // 글 자리는 비워 둔다 (읽기 쉽게)
      out.push(f);
    }
    return out;
  }

  return {
    W: W, H: H, YEAR: YEAR, KEYS: KEYS, LIMITS: LIMITS, THEMES: THEMES, GREETINGS: GREETINGS, DECOS: DECOS, ALL_DECO: ALL_DECO, MAX_HASH: MAX_HASH,
    cleanText: cleanText, normalize: normalize, copy: copy, defaults: defaults, greetingIndex: greetingIndex, same: same, hasDeco: hasDeco,
    encode: encode, decode: decode, graphemes: graphemes, wrap: wrap, snowflakes: snowflakes,
  };
});
