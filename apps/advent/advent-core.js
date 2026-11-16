/* apps/advent/advent-core.js — 어드벤트 캘린더 만들기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="advent-core.js">)와 Node(tools/check-advent.js)가 같은 코드를 쓴다.
 *
 * 캘린더 = { t 디자인(0~3), to 받는 사람, fr 보내는 사람, m [24칸 메시지 — 빈 칸은 ''] }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"t":0,"to":"..","fr":"..","m":["..","",..]} )> — 빈 이름은 키째 생략, 끝의 빈 칸은 잘라 낸다.
 * 디코딩은 길이·형식을 검사하고 글은 cleanText 로 다시 정리한다(꺾쇠·태그·제어 문자 제거, 길이 자르기). 화면에는 textContent·canvas 로만 쓴다.
 * 날짜: 문 N(1~24)은 받는 사람 기기의 날짜가 그해 12월 N일 이상이면 열린다. 12월 25일~1월 31일은 모두 열림, 2월~11월은 모두 잠김(12월 1일을 기다림).
 * 메시지는 서버로 보내지 않는다 — 링크 안에만 있다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.AD_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var DAYS = 24;
  var LIMITS = { to: 20, fr: 20, m: 80 }; // 코드 포인트 기준
  var MAX_HASH = 11000; // 최악(24칸 × 이모지 80개) ≈ 10.7k 자
  var RAW_MAX = 400;    // 디코딩 전 글 하나의 최대 길이(정리 전)
  // 디자인: bg 배경 2색, door 문 2색, frame 문 테두리, num 숫자, inside 문 안쪽, accent 강조, deco 장식 점 색들
  var THEMES = [
    { id: 'classic', emoji: '🎄', bg: ['#1f5b3a', '#123a26'], door: ['#d8362f', '#a8231f'], frame: '#f4c95d', num: '#fff7e6', inside: '#fff3dc', accent: '#f4c95d', deco: ['#f4c95d', '#ffffff', '#ff8a7a'] },
    { id: 'snow', emoji: '❄️', bg: ['#2b4f86', '#18305c'], door: ['#f4f8ff', '#d6e4f7'], frame: '#9cc3f0', num: '#1f3f73', inside: '#e8f1ff', accent: '#bfe0ff', deco: ['#ffffff', '#bfe0ff', '#e8f1ff'] },
    { id: 'gold', emoji: '⭐', bg: ['#1b1f3b', '#0d1024'], door: ['#e9c46a', '#c99a2e'], frame: '#fff1c4', num: '#2a1d00', inside: '#fff8e4', accent: '#ffd36e', deco: ['#ffd36e', '#fff1c4', '#ffffff'] },
    { id: 'candy', emoji: '🍭', bg: ['#ffd6e4', '#ffeef4'], door: ['#ff6f9c', '#e84a7f'], frame: '#ffffff', num: '#ffffff', inside: '#fff6fa', accent: '#2bb3a3', deco: ['#2bb3a3', '#ff9ec0', '#ffffff'] },
  ];
  // 빈 칸에 보이는 작은 선물 (날짜별 고정)
  var TREATS = ['🍪', '🍬', '⛄', '🧦', '🎁', '⭐', '🦌', '🔔', '🕯️', '🍫', '❄️', '🧸', '🍭', '☕', '🧤', '🎅', '🌟', '🍩', '🎶', '🛷', '🥨', '🎀', '🤶', '🎄'];

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

  function blankMessages() { var a = []; for (var i = 0; i < DAYS; i++) a.push(''); return a; }
  function defaults() { return { t: 0, to: '', fr: '', m: blankMessages() }; }
  // 쓸 수 있는 캘린더면 새 객체, 아니면 null
  function normalize(x) {
    if (!x || typeof x !== 'object' || !validIndex(x.t, THEMES.length)) return null;
    if (x.m != null && !Array.isArray(x.m)) return null;
    var src = x.m || [];
    if (src.length > DAYS) return null;
    var m = blankMessages();
    for (var i = 0; i < src.length; i++) {
      if (src[i] == null) continue;
      if (typeof src[i] !== 'string') return null;
      m[i] = cleanText(src[i], LIMITS.m);
    }
    return { t: x.t, to: cleanText(x.to, LIMITS.to), fr: cleanText(x.fr, LIMITS.fr), m: m };
  }
  function copy(x) { return { t: x.t, to: x.to || '', fr: x.fr || '', m: (x.m || blankMessages()).slice() }; }
  function filled(x) { return (x && x.m ? x.m : []).filter(function (s) { return !!s; }).length; }
  function same(a, b) {
    if (!a || !b || a.t !== b.t || (a.to || '') !== (b.to || '') || (a.fr || '') !== (b.fr || '')) return false;
    for (var i = 0; i < DAYS; i++) if ((a.m[i] || '') !== (b.m[i] || '')) return false;
    return true;
  }

  // ---------------------------------------------------------------
  // 공유 링크 (#d=...) — UTF-8 안전 base64url, 압축 없음
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
  function encode(cal) {
    var x = normalize(cal);
    if (!x) return null;
    var p = { v: 1, t: x.t };
    if (x.to) p.to = x.to;
    if (x.fr) p.fr = x.fr;
    var m = x.m.slice();
    while (m.length && !m[m.length - 1]) m.pop();
    p.m = m;
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      if (!Array.isArray(p.m) || p.m.length > DAYS) return null;
      var o = { t: p.t, to: '', fr: '', m: [] };
      var k;
      var keys = ['to', 'fr'];
      for (k = 0; k < keys.length; k++) {
        var v = p[keys[k]];
        if (v == null) continue;
        if (typeof v !== 'string' || v.length > RAW_MAX) return null;
        o[keys[k]] = v;
      }
      for (k = 0; k < p.m.length; k++) {
        if (typeof p.m[k] !== 'string' || p.m[k].length > RAW_MAX) return null;
        o.m.push(p.m[k]);
      }
      return normalize(o);
    } catch (e) {
      return null;
    }
  }

  // ---------------------------------------------------------------
  // 날짜 — now 는 받는 사람 기기의 Date (지역 시간의 연·월·일만 쓴다)
  // ---------------------------------------------------------------
  // phase: before(2~11월 — 모두 잠김) · during(12월 1~24일) · after(12월 25일~1월 31일 — 모두 열림). year = 이번 시즌의 12월이 있는 해
  function season(now) {
    var n = now || new Date();
    var y = n.getFullYear(), mo = n.getMonth() + 1, d = n.getDate();
    if (mo === 12) return d > DAYS ? { phase: 'after', year: y, day: d } : { phase: 'during', year: y, day: d };
    if (mo === 1) return { phase: 'after', year: y - 1, day: 0 };
    return { phase: 'before', year: y, day: 0 };
  }
  function validDay(day) { return typeof day === 'number' && Math.floor(day) === day && day >= 1 && day <= DAYS; }
  function doorUnlocked(day, now) {
    if (!validDay(day)) return false;
    var s = season(now);
    if (s.phase === 'after') return true;
    if (s.phase === 'during') return day <= s.day;
    return false;
  }
  // 그 문이 열리기까지 남은 날 (열렸으면 0)
  function daysUntil(day, now) {
    if (!validDay(day)) return -1;
    if (doorUnlocked(day, now)) return 0;
    var n = now || new Date();
    var s = season(n);
    var a = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate());
    var b = Date.UTC(s.year, 11, day);
    return Math.round((b - a) / 864e5);
  }
  function openCount(now) {
    var c = 0;
    for (var d = 1; d <= DAYS; d++) if (doorUnlocked(d, now)) c++;
    return c;
  }
  // 그 언어의 "12월 N일" (Intl, UTC 로 고정)
  function decDate(day, lang) {
    if (!validDay(day)) return '';
    var dt = new Date(Date.UTC(2026, 11, day));
    try { return new Intl.DateTimeFormat(lang || 'en', { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(dt); } catch (e) { return '12/' + day; }
  }

  // ---------------------------------------------------------------
  // 문 배치 — 섞어 보이지만 같은 캘린더면 언제나 같은 순서
  // ---------------------------------------------------------------
  function hash(str) {
    var h = 0x811c9dc5;
    var s = String(str);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }
  function layout(seed) {
    var s = ((seed >>> 0) || 1) >>> 0;
    var rnd = function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    var a = [];
    for (var i = 1; i <= DAYS; i++) a.push(i);
    for (var j = a.length - 1; j > 0; j--) { var k = Math.floor(rnd() * (j + 1)); var tmp = a[j]; a[j] = a[k]; a[k] = tmp; }
    return a;
  }
  function seedOf(x) { return hash((x.t || 0) + '|' + (x.to || '') + '|' + (x.fr || '')); }
  // 열어 본 문을 기억할 localStorage 키 (링크마다 다름)
  function storeKey(encoded) { return 'advent_open_' + hash(String(encoded || '')).toString(36); }
  function parseOpened(raw) {
    try {
      var a = JSON.parse(raw);
      if (!Array.isArray(a)) return [];
      return a.filter(function (d, i) { return validDay(d) && a.indexOf(d) === i; });
    } catch (e) { return []; }
  }

  // 복수형: forms = { one, few, many, other … } (Intl.PluralRules 범주), 없으면 other
  function plural(forms, n, lang) {
    if (!forms || typeof forms !== 'object') return '';
    var cat = 'other';
    try { cat = new Intl.PluralRules(lang || 'en').select(n); } catch (e) { cat = 'other'; }
    return forms[cat] || forms.other || '';
  }

  return {
    DAYS: DAYS, LIMITS: LIMITS, MAX_HASH: MAX_HASH, THEMES: THEMES, TREATS: TREATS,
    cleanText: cleanText, defaults: defaults, normalize: normalize, copy: copy, filled: filled, same: same,
    encode: encode, decode: decode,
    season: season, doorUnlocked: doorUnlocked, daysUntil: daysUntil, openCount: openCount, decDate: decDate,
    hash: hash, layout: layout, seedOf: seedOf, storeKey: storeKey, parseOpened: parseOpened, plural: plural,
  };
});
