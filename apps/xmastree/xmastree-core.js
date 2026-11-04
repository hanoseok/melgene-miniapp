/* apps/xmastree/xmastree-core.js — 크리스마스 트리 꾸미기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="xmastree-core.js">)와 Node(tools/check-xmastree.js)가 같은 코드를 쓴다.
 *
 * 트리 = { s 트리 모양, b 배경, t 꼭대기 장식, f 비트(1 눈 · 2 전구 줄), p 장식 [{k 종류, x, y}], m 메시지, n 이름 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"s":0,"b":0,"t":1,"f":3,"p":"a0f1k…","m":"..","n":".."} )>
 *   p = 장식마다 5글자: 종류 1글자(a~m) + x/2 (base36 2글자) + y/2 (base36 2글자). 빈 글 칸·빈 장식은 키째 생략.
 * 그림은 xmastree.js 가 canvas 로 그린다. 여기에는 모양·배경·장식 목록, 트리 영역(inTree), 전구 위치, 눈송이(seeded),
 * 자동 꾸미기(seeded), 누른 장식 찾기(hit), 글 정리·검증·인코딩, 줄바꿈(wrap)만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.XTREE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var W = 1080;
  var H = 1350;
  var CX = W / 2;
  var LIMITS = { n: 20, m: 50, orn: 60 }; // 글은 코드 포인트 기준, orn = 장식 최대 개수
  var FLAG = { snow: 1, lights: 2 };
  var ALL_FLAGS = 3;
  // 트리 모양: leaf 위→아래 3색, edge 가장자리 밝은 색, trunk 줄기, frost 눈 덮인 끝, tiers [꼭대기 y, 밑단 y, 밑단 반폭]
  var CLASSIC_TIERS = [[250, 480, 175], [380, 660, 275], [530, 850, 365], [690, 1040, 455]];
  var SLIM_TIERS = [[230, 430, 112], [330, 565, 165], [450, 705, 215], [580, 860, 265], [720, 1040, 315]];
  var STYLES = [
    { id: 'classic', emoji: '🎄', leaf: ['#2a9a57', '#1a7a42', '#0f5a2f'], edge: '#3fbf72', trunk: '#7a4a24', frost: false, tiers: CLASSIC_TIERS },
    { id: 'snowy', emoji: '❄️', leaf: ['#3a9c80', '#25795f', '#155744'], edge: '#5fc4a2', trunk: '#6f4422', frost: true, tiers: CLASSIC_TIERS },
    { id: 'nordic', emoji: '🌲', leaf: ['#22704f', '#16543b', '#0b3727'], edge: '#319070', trunk: '#5c3a1e', frost: false, tiers: SLIM_TIERS },
    { id: 'pink', emoji: '🌸', leaf: ['#f9b3cf', '#f08fb7', '#db6a9e'], edge: '#ffd0e2', trunk: '#a8744c', frost: false, tiers: CLASSIC_TIERS },
  ];
  var BGS = [
    { id: 'night', emoji: '🌙' },
    { id: 'cozy', emoji: '🛋️' },
    { id: 'snowfield', emoji: '⛄' },
    { id: 'red', emoji: '❤️' },
  ];
  var TOPPERS = [
    { id: 'none', emoji: '○' },
    { id: 'star', emoji: '⭐' },
    { id: 'angel', emoji: '👼' },
    { id: 'bow', emoji: '🎀' },
  ];
  // 장식: r = 반지름(그림 px), ball = 유리 공 색, shape = 직접 그리는 모양, emoji = 이모지로 그림
  var KINDS = [
    { id: 'red', r: 42, ball: '#e23d4f' },
    { id: 'gold', r: 42, ball: '#f3c14b' },
    { id: 'blue', r: 42, ball: '#3d8bff' },
    { id: 'purple', r: 42, ball: '#9a5cf0' },
    { id: 'silver', r: 42, ball: '#d6e0ea' },
    { id: 'star', r: 44, shape: 'star' },
    { id: 'bell', r: 46, emoji: '🔔' },
    { id: 'cane', r: 46, shape: 'cane' },
    { id: 'gift', r: 58, emoji: '🎁' },
    { id: 'bow', r: 44, emoji: '🎀' },
    { id: 'sock', r: 48, emoji: '🧦' },
    { id: 'flake', r: 40, emoji: '❄️' },
    { id: 'cookie', r: 44, emoji: '🍪' },
  ];
  var KCH = 'abcdefghijklm';
  var LIGHT_COLORS = ['#ff4d5e', '#ffd25a', '#4dd18a', '#5ab4ff', '#ff8ad8', '#ffffff'];
  var TEXT_KEYS = ['m', 'n'];

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
  function clampPos(x, y) {
    var cx = Math.min(W - 24, Math.max(24, Number(x) || 0));
    var cy = Math.min(H - 24, Math.max(24, Number(y) || 0));
    return { x: Math.round(cx / 2) * 2, y: Math.round(cy / 2) * 2 };
  }
  function normOrn(o) {
    if (!o || typeof o !== 'object' || !validIndex(o.k, KINDS.length)) return null;
    if (typeof o.x !== 'number' || typeof o.y !== 'number' || !isFinite(o.x) || !isFinite(o.y)) return null;
    var p = clampPos(o.x, o.y);
    return { k: o.k, x: p.x, y: p.y };
  }
  // 쓸 수 있는 트리면 새 객체, 아니면 null
  function normalize(x) {
    if (!x || typeof x !== 'object') return null;
    if (!validIndex(x.s, STYLES.length) || !validIndex(x.b, BGS.length) || !validIndex(x.t, TOPPERS.length) || !validIndex(x.f, ALL_FLAGS + 1)) return null;
    if (!Array.isArray(x.p) || x.p.length > LIMITS.orn) return null;
    var p = [];
    for (var i = 0; i < x.p.length; i++) {
      var o = normOrn(x.p[i]);
      if (!o) return null;
      p.push(o);
    }
    return { s: x.s, b: x.b, t: x.t, f: x.f, p: p, m: cleanText(x.m, LIMITS.m), n: cleanText(x.n, LIMITS.n) };
  }
  function copy(x) {
    return { s: x.s, b: x.b, t: x.t, f: x.f, p: (x.p || []).map(function (o) { return { k: o.k, x: o.x, y: o.y }; }), m: x.m || '', n: x.n || '' };
  }
  function defaults() { return { s: 0, b: 0, t: 1, f: ALL_FLAGS, p: [], m: '', n: '' }; }
  function hasFlag(x, id) { return (x.f & FLAG[id]) !== 0; }

  // ---------------------------------------------------------------
  // 장식 목록 ↔ 짧은 글자열 (종류 1 + x/2 base36 2 + y/2 base36 2)
  // ---------------------------------------------------------------
  function b36(n) { var s = n.toString(36); return s.length < 2 ? '0' + s : s; }
  function packOrn(list) {
    return (list || []).map(function (o) { return KCH.charAt(o.k) + b36(Math.round(o.x / 2)) + b36(Math.round(o.y / 2)); }).join('');
  }
  function unpackOrn(str) {
    if (typeof str !== 'string' || str.length % 5 || str.length > LIMITS.orn * 5 || !/^(?:[a-m][0-9a-z]{4})*$/.test(str)) return null;
    var out = [];
    for (var i = 0; i < str.length; i += 5) {
      var k = KCH.indexOf(str.charAt(i));
      var x = parseInt(str.substr(i + 1, 2), 36) * 2;
      var y = parseInt(str.substr(i + 3, 2), 36) * 2;
      if (k < 0 || k >= KINDS.length || x > W || y > H) return null;
      out.push({ k: k, x: x, y: y });
    }
    return out;
  }
  function same(a, b) {
    if (!a || !b) return false;
    var na = normalize(a);
    var nb = normalize(b);
    if (!na || !nb) return false;
    return na.s === nb.s && na.b === nb.b && na.t === nb.t && na.f === nb.f && na.m === nb.m && na.n === nb.n && packOrn(na.p) === packOrn(nb.p);
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
  function encode(tree) {
    var x = normalize(tree);
    if (!x) return null;
    var p = { v: 1, s: x.s, b: x.b, t: x.t, f: x.f };
    if (x.p.length) p.p = packOrn(x.p);
    TEXT_KEYS.forEach(function (k) { if (x[k]) p[k] = x[k]; });
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      var o = { s: p.s, b: p.b, t: p.t, f: p.f, p: [] };
      if (p.p != null) {
        o.p = unpackOrn(p.p);
        if (!o.p) return null;
      }
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
  // 트리 영역 · 전구 · 눈 · 자동 꾸미기
  // ---------------------------------------------------------------
  function tiers(s) { return STYLES[s].tiers.map(function (t) { return { top: t[0], base: t[1], half: t[2] }; }); }
  function halfAt(t, y) { return t.half * (y - t.top) / (t.base - t.top); }
  // margin > 0 이면 가장자리에서 그만큼 안쪽만
  function inTree(s, x, y, margin) {
    var m = margin || 0;
    return tiers(s).some(function (t) { return y >= t.top + m && y <= t.base - m * 0.5 && Math.abs(x - CX) <= halfAt(t, y) - m; });
  }
  function treeTop(s) { return STYLES[s].tiers[0][0]; }
  function treeBottom() { return 1040; }
  // 전구 줄: 단마다 처진 줄 하나. wires [x0, x1, y, sag], bulbs [{x, y, c, ph}]
  function lights(s) {
    var wires = [];
    var bulbs = [];
    var n = 0;
    tiers(s).forEach(function (t, i) {
      var y = t.base - (t.base - t.top) * 0.3;
      var hw = halfAt(t, y) * 0.94;
      var sag = 26 + i * 6;
      wires.push([CX - hw, CX + hw, y, sag]);
      var count = Math.max(3, Math.round((hw * 2) / 72));
      for (var j = 0; j <= count; j++) {
        var u = j / count;
        var bx = CX - hw + u * hw * 2;
        bulbs.push({ x: bx, y: y + 4 * u * (1 - u) * sag + 12, c: LIGHT_COLORS[n % LIGHT_COLORS.length], ph: (n * 1.7) % (Math.PI * 2) });
        n++;
      }
    });
    return { wires: wires, bulbs: bulbs };
  }
  function rng(seed) {
    var s = (seed * 2654435761 + 12345) >>> 0 || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  function snowflakes(seed, n) {
    var rnd = rng(seed);
    var out = [];
    for (var i = 0; i < n; i++) out.push({ x: rnd() * W, y: rnd() * H, r: 3 + rnd() * 8, a: 0.4 + rnd() * 0.5, sp: 30 + rnd() * 50, dr: rnd() * Math.PI * 2 });
    return out;
  }
  // 이미 있는 장식을 피해 트리 위에 장식을 더한다(밑동에는 선물 몇 개). 새 장식 목록(기존 + 추가)을 돌려준다.
  function autoDecorate(s, seed, existing) {
    var rnd = rng(seed);
    var list = (existing || []).map(function (o) { return { k: o.k, x: o.x, y: o.y }; });
    var room = LIMITS.orn - list.length;
    if (room <= 0) return list;
    var want = Math.min(room, 20);
    var POOL = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12];
    var far = function (x, y, d) { return list.every(function (o) { return (o.x - x) * (o.x - x) + (o.y - y) * (o.y - y) >= d * d; }); };
    var added = 0;
    // 선물 2~3개
    var gifts = Math.min(want, 2 + Math.floor(rnd() * 2));
    for (var g = 0, tries = 0; g < gifts && tries < 80; tries++) {
      var gx = CX + (rnd() < 0.5 ? -1 : 1) * (150 + rnd() * 170);
      var gy = 1080 + rnd() * 30;
      if (!far(gx, gy, 100)) continue;
      var pg = clampPos(gx, gy);
      list.push({ k: 8, x: pg.x, y: pg.y });
      g++; added++;
    }
    var top = treeTop(s);
    for (var t = 0; added < want && t < 600; t++) {
      var x = CX + (rnd() * 2 - 1) * 460;
      var y = top + 60 + rnd() * (treeBottom() - top - 80);
      if (!inTree(s, x, y, 34) || !far(x, y, 80)) continue;
      var p = clampPos(x, y);
      list.push({ k: POOL[Math.floor(rnd() * POOL.length)], x: p.x, y: p.y });
      added++;
    }
    return list;
  }
  // (x, y) 에 있는 맨 위 장식의 번호, 없으면 -1
  function hit(list, x, y) {
    for (var i = (list || []).length - 1; i >= 0; i--) {
      var o = list[i];
      var r = KINDS[o.k].r * 1.15;
      if ((o.x - x) * (o.x - x) + (o.y - y) * (o.y - y) <= r * r) return i;
    }
    return -1;
  }

  // ---------------------------------------------------------------
  // 줄바꿈 (canvas 용) — xmascard 와 같은 방식
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

  return {
    W: W, H: H, CX: CX, LIMITS: LIMITS, FLAG: FLAG, ALL_FLAGS: ALL_FLAGS, STYLES: STYLES, BGS: BGS, TOPPERS: TOPPERS, KINDS: KINDS,
    LIGHT_COLORS: LIGHT_COLORS, MAX_HASH: MAX_HASH,
    cleanText: cleanText, clampPos: clampPos, normalize: normalize, copy: copy, defaults: defaults, hasFlag: hasFlag, same: same,
    packOrn: packOrn, unpackOrn: unpackOrn, encode: encode, decode: decode,
    tiers: tiers, inTree: inTree, treeTop: treeTop, lights: lights, snowflakes: snowflakes, autoDecorate: autoDecorate, hit: hit,
    graphemes: graphemes, wrap: wrap,
  };
});
