/* apps/invite/invite-core.js — 할로윈 파티 초대장 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="invite-core.js">)와 Node(tools/check-invite.js)가 같은 코드를 쓴다.
 *
 * 초대장 = { t 테마, n 파티 이름, d 날짜 'YYYY-MM-DD'(없으면 ''), h 시간 'HH:MM'(없으면 ''), p 장소, m 한마디 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"t":0,"n":"..","d":"..","h":"..","p":"..","m":".."} )> (빈 칸은 키째 생략)
 * 그림은 invite.js 가 canvas 로 그린다(문구·날짜 서식은 언어별이라 브라우저에서). 여기에는 테마(색·이모지·장식 위치),
 * 글 정리·검증·인코딩, 줄바꿈 계산(wrap)만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.INVITE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var LIMITS = { n: 30, p: 40, m: 80 }; // 코드 포인트 기준
  // 테마: bg 위→아래 그라데이션 3색, accent 강조색, text 본문색, sub 부제색,
  // deco = [이모지, x(0~1), y(0~1), 크기(px), 기울기(도)] — 글이 들어가는 가운데를 피해 가장자리에만 둔다.
  var THEMES = [
    { id: 'ghost', emoji: '👻', bg: ['#3b2d80', '#1a1440', '#0c0920'], accent: '#9ff0d0', text: '#f5f1ff', sub: '#c9b8ff',
      deco: [['🌙', 0.84, 0.07, 110, 12], ['✨', 0.12, 0.1, 70, -10], ['🦇', 0.1, 0.3, 80, -14], ['⭐', 0.92, 0.33, 54, 10], ['✨', 0.07, 0.62, 56, 8], ['🦇', 0.92, 0.72, 74, 16], ['⭐', 0.09, 0.86, 52, -8], ['✨', 0.9, 0.9, 60, 6]] },
    { id: 'pumpkin', emoji: '🎃', bg: ['#a8400a', '#4a1a05', '#1f0a02'], accent: '#ffd27a', text: '#fff4e0', sub: '#ffc58a',
      deco: [['🍂', 0.1, 0.08, 88, -20], ['🕯️', 0.9, 0.1, 90, 8], ['🦇', 0.09, 0.3, 76, 12], ['🍬', 0.92, 0.34, 66, 18], ['🍂', 0.07, 0.64, 70, 24], ['🍬', 0.92, 0.7, 62, -16], ['🕯️', 0.1, 0.88, 80, -6], ['🍂', 0.9, 0.9, 78, 20]] },
    { id: 'bat', emoji: '🦇', bg: ['#4b1a73', '#1c0b33', '#07040f'], accent: '#ff8ad8', text: '#f8ecff', sub: '#e0b4ff',
      deco: [['🌕', 0.14, 0.07, 120, 0], ['⭐', 0.9, 0.09, 56, -12], ['🦇', 0.88, 0.28, 84, 14], ['🕸️', 0.07, 0.34, 76, 0], ['🦇', 0.08, 0.64, 70, -12], ['⭐', 0.93, 0.6, 50, 8], ['🕸️', 0.92, 0.88, 82, 0], ['⭐', 0.1, 0.9, 54, -6]] },
    { id: 'witch', emoji: '🧙', bg: ['#2f7a3f', '#0f3a24', '#04140c'], accent: '#d9ff7a', text: '#f0ffe6', sub: '#aef0b8',
      deco: [['🔮', 0.1, 0.08, 90, -8], ['✨', 0.9, 0.09, 66, 10], ['🧪', 0.08, 0.32, 78, -14], ['🕸️', 0.92, 0.34, 70, 0], ['✨', 0.07, 0.64, 58, 6], ['🧪', 0.92, 0.7, 76, 14], ['🔮', 0.1, 0.88, 74, 8], ['✨', 0.9, 0.9, 62, -10]] },
    { id: 'spider', emoji: '🕷️', bg: ['#585868', '#23232d', '#0a0a0f'], accent: '#ff6b6b', text: '#ffffff', sub: '#d6d6e4',
      deco: [['🕸️', 0.1, 0.08, 104, 0], ['💀', 0.9, 0.1, 74, 10], ['🕯️', 0.08, 0.32, 82, -8], ['🩸', 0.92, 0.34, 64, 12], ['💀', 0.08, 0.64, 66, -12], ['🕯️', 0.92, 0.7, 80, 8], ['🕸️', 0.9, 0.9, 92, 0], ['🩸', 0.1, 0.88, 60, -10]] },
  ];
  var KEYS = ['t', 'n', 'd', 'h', 'p', 'm'];

  // ---------------------------------------------------------------
  // 글 정리 · 날짜·시간 검증
  // ---------------------------------------------------------------
  function cleanText(s, max) {
    var str = String(s == null ? '' : s)
      .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ')
      .replace(/<[^<>]*>/g, '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    var chars = Array.from(str);
    if (chars.length > max) str = chars.slice(0, max).join('').trim();
    return str;
  }
  function validDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return false;
    var y = +m[1], mo = +m[2], da = +m[3];
    if (y < 2000 || y > 2100) return false;
    var t = new Date(Date.UTC(y, mo - 1, da));
    return t.getUTCFullYear() === y && t.getUTCMonth() === mo - 1 && t.getUTCDate() === da;
  }
  function validTime(s) {
    var m = /^(\d{2}):(\d{2})$/.exec(s);
    return !!m && +m[1] < 24 && +m[2] < 60;
  }
  // 올해 10월 31일 (이미 지났으면 내년) — 날짜 칸의 처음 값
  function halloweenDate(now) {
    var n = now || new Date();
    var y = n.getFullYear();
    if (n.getMonth() > 9 || (n.getMonth() === 9 && n.getDate() > 31)) y += 1;
    return y + '-10-31';
  }

  function validIndex(v, n) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= 0 && v < n; }
  // 쓸 수 있는 초대장이면 새 객체, 아니면 null
  function normalize(x) {
    if (!x || typeof x !== 'object') return null;
    if (!validIndex(x.t, THEMES.length)) return null;
    if (x.d != null && x.d !== '' && !(typeof x.d === 'string' && validDate(x.d))) return null;
    if (x.h != null && x.h !== '' && !(typeof x.h === 'string' && validTime(x.h))) return null;
    return { t: x.t, n: cleanText(x.n, LIMITS.n), d: x.d || '', h: x.h || '', p: cleanText(x.p, LIMITS.p), m: cleanText(x.m, LIMITS.m) };
  }
  function copy(x) { return { t: x.t, n: x.n || '', d: x.d || '', h: x.h || '', p: x.p || '', m: x.m || '' }; }
  function defaults() { return { t: 0, n: '', d: halloweenDate(), h: '19:00', p: '', m: '' }; }
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
  var MAX_HASH = 1200;
  function encode(inv) {
    var x = normalize(inv);
    if (!x) return null;
    var p = { v: 1, t: x.t };
    ['n', 'd', 'h', 'p', 'm'].forEach(function (k) { if (x[k]) p[k] = x[k]; });
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      var o = { t: p.t };
      var bad = false;
      ['n', 'd', 'h', 'p', 'm'].forEach(function (k) {
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
  // 줄바꿈 (canvas 용): measure(문자열) → 폭(px). 공백에서 우선 끊고, 공백 없는 글(한·중·일·태국)은 글자 단위로.
  // ---------------------------------------------------------------
  function segments(text) {
    var s = String(text);
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      var out = [];
      var it = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s)[Symbol.iterator]();
      for (var r = it.next(); !r.done; r = it.next()) out.push(r.value.segment);
      return out;
    }
    return Array.from(s);
  }
  function wrap(measure, text, max) {
    var segs = segments(text);
    var lines = [];
    var cur = [];
    var lastSp = -1;
    var join = function (a) { return a.join(''); };
    for (var i = 0; i < segs.length; i++) {
      var sg = segs[i];
      if (/^\s$/.test(sg) && !cur.length) continue;
      cur.push(sg);
      if (/^\s$/.test(sg)) lastSp = cur.length - 1;
      if (cur.length > 1 && measure(join(cur).replace(/\s+$/, '')) > max) {
        if (lastSp > 0 && !/^\s$/.test(sg)) {
          lines.push(join(cur.slice(0, lastSp)).trim());
          cur = cur.slice(lastSp + 1);
        } else {
          var last = cur.pop();
          lines.push(join(cur).trim());
          cur = /^\s$/.test(last) ? [] : [last];
        }
        lastSp = -1;
        for (var j = 0; j < cur.length; j++) if (/^\s$/.test(cur[j])) lastSp = j;
      }
    }
    if (cur.length) lines.push(join(cur).trim());
    return lines.filter(Boolean);
  }

  return {
    KEYS: KEYS, LIMITS: LIMITS, THEMES: THEMES, MAX_HASH: MAX_HASH,
    cleanText: cleanText, validDate: validDate, validTime: validTime, halloweenDate: halloweenDate,
    normalize: normalize, copy: copy, defaults: defaults, same: same, encode: encode, decode: decode,
    segments: segments, wrap: wrap,
  };
});
