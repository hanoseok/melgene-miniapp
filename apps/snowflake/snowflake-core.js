/* apps/snowflake/snowflake-core.js — 눈꽃 만들기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="snowflake-core.js">)와 Node(tools/check-snowflake.js)가 같은 코드를 쓴다.
 *
 * 눈꽃 = { s 시드(0 ~ 2^32-1), n 가지 수(2~6), c 복잡도(1~3), z 크기(0~2), h 가지 모양(0~3), k 색(0~4) }
 *   - 한 가지(arm, 위쪽을 향함)를 시드로 만든 뒤 60도씩 6번 돌리고, 각 가지를 좌우로 뒤집어 12개 가지를 채운다.
 *   - 같은 p = 같은 그림. 시드는 crypto.getRandomValues 로 새로 뽑는다.
 * 공유 링크: #d=<base64url 인코딩한 {"v":1,"s","n","c","z","h","k"} JSON>. 서버 저장 없음.
 * 그림 자체(canvas)는 snowflake.js 가 그린다. 여기에는 파라미터, 무작위, 선·판 목록(primitives), 색, 인코딩만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.SNOWFLAKE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var SIZE = 1080;
  var C = SIZE / 2;
  var REACH = 440; // 가지 길이 기준(캔버스 픽셀, 크기 0~2가 곱해진다). 아래 글자 자리를 남기려고 470 보다 짧다
  var TAU = Math.PI * 2;
  var MAX_HASH = 200;
  var DEFAULTS = { n: 4, c: 2, z: 1, h: 0, k: 0 };
  var RANGE = { n: [2, 6], c: [1, 3], z: [0, 2], h: [0, 3], k: [0, 4] };
  var KEYS = ['n', 'c', 'z', 'h', 'k'];
  var SHAPES = ['needle', 'plate', 'spike', 'feather'];
  var PALETTES = [
    { id: 'ice', bg: ['#0b2545', '#1b4a7a'], ink: '#eaf8ff', accent: '#9fe3ff' },
    { id: 'frost', bg: ['#eef7fc', '#cfe6f5'], ink: '#2d6aa3', accent: '#5f9fd1' },
    { id: 'lilac', bg: ['#2a1846', '#5a3d8c'], ink: '#f5eaff', accent: '#d0b4ff' },
    { id: 'gold', bg: ['#06070f', '#1f2440'], ink: '#ffe9a8', accent: '#ffd166' },
    { id: 'mint', bg: ['#0c3b3a', '#1f7068'], ink: '#e0fff6', accent: '#7cf2d0' },
  ];
  var LENGTH = [0.6, 0.78, 0.94]; // 크기 0·1·2 = 팔 길이 비율

  function isInt(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }

  // 쓸 수 있는 눈꽃이면 새 객체, 아니면 null
  function normalize(o) {
    if (!o || typeof o !== 'object') return null;
    if (!isInt(o.s) || o.s < 0 || o.s > 4294967295) return null;
    var out = { s: o.s };
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      var r = RANGE[k];
      if (!isInt(o[k]) || o[k] < r[0] || o[k] > r[1]) return null;
      out[k] = o[k];
    }
    return out;
  }
  // 시드만 정하고 나머지는 기본값
  function fresh(seed) {
    var out = { s: seed >>> 0 };
    KEYS.forEach(function (k) { out[k] = DEFAULTS[k]; });
    return out;
  }
  function copy(p) {
    var out = { s: p.s };
    KEYS.forEach(function (k) { out[k] = p[k]; });
    return out;
  }
  function same(a, b) {
    var x = normalize(a);
    var y = normalize(b);
    return !!(x && y) && x.s === y.s && KEYS.every(function (k) { return x[k] === y[k]; });
  }

  // 무작위: 브라우저는 crypto, 없으면 Math.random
  function randomSeed() {
    try {
      if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        var a = new Uint32Array(1);
        crypto.getRandomValues(a);
        return a[0];
      }
    } catch (e) { /* 아래 fallback */ }
    return Math.floor(Math.random() * 4294967296) >>> 0;
  }
  // mulberry32 (시드 고정 — 같은 시드면 같은 수열)
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------------------------------------------------------------
  // 가지 한 개의 도형 목록 (위쪽을 향한 로컬 좌표, 원점 = 눈꽃 중심)
  //   {t:'l', a:[x1,y1,x2,y2], w}  선       {t:'p', pts, f(1=채움), c(무게중심)}  다각형
  //   at: 0~0.75 — 그리는 순서(애니메이션용). 목록 순서대로 자란다.
  // ---------------------------------------------------------------
  function armPrims(p) {
    var r = rng(p.s);
    var shape = SHAPES[p.h];
    var L = LENGTH[p.z] * REACH;
    var depth = shape === 'feather' ? p.c : p.c - 1;
    var kids = shape === 'feather' ? 3 : 2;
    var out = [];

    function line(x1, y1, x2, y2, w) { out.push({ t: 'l', a: [x1, y1, x2, y2], w: w }); }
    function poly(pts, filled) {
      var sx = 0;
      var sy = 0;
      pts.forEach(function (q) { sx += q[0]; sy += q[1]; });
      out.push({ t: 'p', pts: pts, f: filled ? 1 : 0, c: [sx / pts.length, sy / pts.length] });
    }
    function hexPts(x, y, rad, rot) {
      var pts = [];
      for (var i = 0; i < 6; i++) {
        var a = rot + i * Math.PI / 3;
        pts.push([x + Math.cos(a) * rad, y + Math.sin(a) * rad]);
      }
      return pts;
    }
    function grow(x, y, ang, len, d, w) {
      var sx = Math.sin(ang);
      var sy = -Math.cos(ang);
      var ex = x + sx * len;
      var ey = y + sy * len;
      if (shape === 'spike') {
        var nx = -sy * w * 1.25;
        var ny = sx * w * 1.25;
        poly([[x + nx, y + ny], [x - nx, y - ny], [ex, ey]], true);
      } else {
        line(x, y, ex, ey, w);
      }
      if (shape === 'plate') poly(hexPts(ex, ey, Math.max(9, len * 0.14), ang), d % 2 === 0);
      if (d > 0) {
        for (var i = 0; i < kids; i++) {
          var f = 0.3 + (i + 0.5) * (0.6 / kids);
          var px = x + (ex - x) * f;
          var py = y + (ey - y) * f;
          var side = i % 2 ? 1 : -1;
          var sub = len * (0.45 + 0.12 * r());
          grow(px, py, ang + side * (0.6 + 0.25 * r()), sub, d - 1, Math.max(3, w * 0.66));
        }
      }
    }

    out.push({ t: 'l', a: [0, 0, 0, -L], w: 14 });
    for (var i = 0; i < p.n; i++) {
      var t = 0.18 + (p.n > 1 ? i / (p.n - 1) : 0) * 0.66 + (r() - 0.5) * 0.04;
      var by = -L * t;
      var base = L * (0.46 - 0.22 * t);
      var w0 = 6 + 4 * (1 - t);
      [-1, 1].forEach(function (side) {
        var ang = side * (0.72 + 0.3 * r());
        grow(0, by, ang, base * (0.8 + 0.4 * r()), depth, w0);
      });
    }
    poly([[0, -L - 28], [14, -L - 6], [0, -L + 14], [-14, -L - 6]], true);

    var total = out.length;
    out.forEach(function (q, idx) { q.at = total > 1 ? (idx / total) * 0.75 : 0; });
    return out;
  }

  // 가운데 육각형(눈꽃 중심, 한 번만 그린다)
  function centerPrims() {
    var hex = function (rad, rot) {
      var pts = [];
      for (var i = 0; i < 6; i++) {
        var a = rot + i * Math.PI / 3;
        pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
      }
      return pts;
    };
    return [
      { t: 'p', pts: hex(46, Math.PI / 6), f: 0, c: [0, 0], at: 0 },
      { t: 'p', pts: hex(20, Math.PI / 6), f: 1, c: [0, 0], at: 0.02 },
    ];
  }

  // 배경에 흩뿌리는 작은 반짝이 (시드마다 다름)
  function sparkles(seed) {
    var r = rng((seed ^ 0x9e3779b9) >>> 0);
    var out = [];
    for (var i = 0; i < 42; i++) {
      out.push({ x: r() * SIZE, y: r() * SIZE, r: 1.5 + r() * 3, a: 0.25 + r() * 0.55 });
    }
    return out;
  }

  // ---------------------------------------------------------------
  // 공유 링크 (#d=...) — base64url
  // ---------------------------------------------------------------
  function b64encode(str) {
    if (typeof btoa === 'function') return btoa(str);
    return Buffer.from(str, 'utf8').toString('base64');
  }
  function b64decode(str) {
    if (typeof atob === 'function') return atob(str);
    return Buffer.from(str, 'base64').toString('utf8');
  }
  function encode(p) {
    var x = normalize(p);
    if (!x) return null;
    var payload = { v: 1, s: x.s, n: x.n, c: x.c, z: x.z, h: x.h, k: x.k };
    return b64encode(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var p = JSON.parse(b64decode(b64));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      return normalize(p);
    } catch (e) {
      return null;
    }
  }

  return {
    SIZE: SIZE, C: C, TAU: TAU, MAX_HASH: MAX_HASH,
    DEFAULTS: DEFAULTS, RANGE: RANGE, KEYS: KEYS, SHAPES: SHAPES, PALETTES: PALETTES, LENGTH: LENGTH,
    normalize: normalize, fresh: fresh, copy: copy, same: same,
    randomSeed: randomSeed, rng: rng,
    armPrims: armPrims, centerPrims: centerPrims, sparkles: sparkles,
    encode: encode, decode: decode,
  };
});
