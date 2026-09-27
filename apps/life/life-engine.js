/* apps/life/life-engine.js — 펜 드로잉 만화 렌더러 (vanilla JS, ES5, UMD)
 *
 * 모든 선은 매 프레임 코드로 그린다. 영상/이미지 모델은 쓰지 않는다.
 *   - 펜 선: 흔들리는 중심선(Catmull-Rom + 저주파 노이즈) + 필압 테이퍼 → 폭이 변하는 리본 다각형.
 *     진행도(0~1)만큼만 채워서 "그려지는 중"을 보여준다. 연필은 겹선, 만년필은 펜촉 각도에 따라 굵기가 변한다.
 *   - 드라이 브러시 띠: 수십 가닥 털끝(bristle) 리본 + 노이즈로 끊김.
 *   - 해칭: 다각형을 평행선으로 잘라 짧은 선을 차례로 긋는다.
 *   - 만화 페이지: 1~3컷 패널(기울어진 여백), 흔들리는 굵은 테두리, 캡션 박스(손글씨), 말풍선.
 *   - 페이지 넘김(세로 슬라이스 원근) / 먹 띠 와이프 전환.
 *   - 끝 장면: 태어난 날부터 오늘까지의 나를 키 순서로 세운 "성장 라인업".
 * 좌표는 폭 1080 기준 디자인 단위. 필름 모드는 높이 1920(9:16), 랜딩은 1440(3:4)으로 고정해서
 * 기기·해상도가 달라도(공유 링크, 1080x1920 녹화) 같은 입력이면 같은 그림이 나온다.
 * 완성된 획은 페이지 레이어 캔버스에 구워 두고, 그리는 중인 획만 매 프레임 다시 그린다.
 *
 * Node 에서는 buildAll()(획 계획 생성)만 쓸 수 있다 — tools/check-life.js 의 결정성 검사용.
 */
(function (root, factory) {
  var E = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = E;
  } else {
    root.LIFE_ENGINE = E;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var TAU = Math.PI * 2;
  var DW = 1080;
  var NIB = -0.62; // 만년필 펜촉 각도(rad)
  var PAPER = [242, 239, 232];

  // ---------------------------------------------------------------
  // 난수
  // ---------------------------------------------------------------
  function mulberry32(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function mix(a, b) {
    var h = Math.imul((a ^ b) >>> 0, 0x9E3779B1);
    h ^= h >>> 15;
    h = Math.imul(h, 0x85EBCA6B);
    return (h ^ (h >>> 13)) >>> 0;
  }
  function Rng(seed) {
    var r = mulberry32(seed);
    var f = function () { return r(); };
    f.range = function (a, b) { return a + (b - a) * r(); };
    f.pick = function (arr) { return arr[Math.floor(r() * arr.length)]; };
    f.chance = function (p) { return r() < p; };
    f.gauss = function () { return (r() + r() + r() + r() - 2) * 1.732; };
    f.sign = function () { return r() < 0.5 ? -1 : 1; };
    return f;
  }
  function noise1(rng) {
    var N = 64;
    var v = new Float32Array(N);
    for (var i = 0; i < N; i++) v[i] = rng() * 2 - 1;
    var off = rng() * N;
    return function (x) {
      x += off;
      var i0 = Math.floor(x);
      var f = x - i0;
      var a = v[((i0 % N) + N) % N];
      var b = v[(((i0 + 1) % N) + N) % N];
      return a + (b - a) * f * f * (3 - 2 * f);
    };
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ext(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // ---------------------------------------------------------------
  // 펜
  // ---------------------------------------------------------------
  var PENS = {
    brush: { ink: [22, 21, 19], alpha: 1, w: 1.32, taper: [0.1, 0.3], press: 0.3, wobble: 1, doubled: 0, nib: 0, overshoot: 0, band: 'bristle', hatchW: 2.4, hatchGap: 13, accent: null },
    pencil: { ink: [58, 58, 64], alpha: 0.8, w: 0.78, taper: [0.05, 0.12], press: 0.22, wobble: 1.3, doubled: 0.55, nib: 0, overshoot: 1, band: 'graphite', hatchW: 1.9, hatchGap: 10, accent: null, grain: true },
    ballpoint: { ink: [31, 64, 156], alpha: 0.93, w: 0.6, taper: [0.03, 0.07], press: 0.1, wobble: 0.9, doubled: 0, nib: 0, overshoot: 0, band: 'crosshatch', hatchW: 1.6, hatchGap: 8, accent: null, blob: true },
    fountain: { ink: [24, 26, 42], alpha: 0.97, w: 1.08, taper: [0.06, 0.2], press: 0.14, wobble: 0.85, doubled: 0, nib: 0.6, overshoot: 0, band: 'bristle', hatchW: 1.9, hatchGap: 12, accent: [196, 45, 40] }
  };
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  // ---------------------------------------------------------------
  // 도형 / 선 기하
  // ---------------------------------------------------------------
  function dist(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1]; return Math.sqrt(dx * dx + dy * dy); }

  function resampleLinear(pts, step) {
    var out = [pts[0].slice()];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var n = Math.max(1, Math.ceil(dist(a, b) / step));
      for (var j = 1; j <= n; j++) out.push([a[0] + (b[0] - a[0]) * j / n, a[1] + (b[1] - a[1]) * j / n]);
    }
    return out;
  }
  function resampleCatmull(pts, step) {
    var n = pts.length;
    if (n < 3) return resampleLinear(pts, step);
    var out = [];
    for (var i = 0; i < n - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      var m = Math.max(1, Math.ceil(dist(p1, p2) / step));
      for (var j = 0; j < m; j++) {
        var t = j / m, t2 = t * t, t3 = t2 * t;
        out.push([
          0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
          0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        ]);
      }
    }
    out.push(pts[n - 1].slice());
    return out;
  }
  function ellipsePts(cx, cy, rx, ry, a0, a1, n) {
    var out = [];
    for (var i = 0; i <= n; i++) {
      var a = a0 + (a1 - a0) * i / n;
      out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
    }
    return out;
  }
  function ellipsePoly(cx, cy, rx, ry, n) { return ellipsePts(cx, cy, rx, ry, 0, TAU, n || 20).slice(0, -1); }
  function rectPoly(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
  function heartPts(cx, cy, s) {
    var out = [];
    for (var i = 0; i <= 40; i++) {
      var t = TAU * i / 40;
      var x = 16 * Math.pow(Math.sin(t), 3);
      var y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      out.push([cx + x * s / 16, cy + y * s / 16]);
    }
    return out;
  }
  function starPts(cx, cy, r, rot) {
    var out = [];
    for (var i = 0; i <= 10; i++) {
      var a = -Math.PI / 2 + rot + i * Math.PI / 5;
      var rr = i % 2 ? r * 0.44 : r;
      out.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
    }
    return out;
  }
  function normalsOf(pts) {
    var n = pts.length, nx = new Float32Array(n), ny = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy) || 1;
      nx[i] = -dy / l; ny[i] = dx / l;
    }
    return { nx: nx, ny: ny };
  }
  function cumLen(pts) {
    var s = new Float32Array(pts.length);
    for (var i = 1; i < pts.length; i++) s[i] = s[i - 1] + dist(pts[i - 1], pts[i]);
    return s;
  }

  // 펜 한 획의 리본 기하
  function makeGeom(ctrl, o, pen, rng) {
    var w = (o.w || 6) * pen.w;
    var step = Math.max(2.2, Math.min(6, w * 0.7));
    var pts = o.sharp ? resampleLinear(ctrl, step) : resampleCatmull(ctrl, step);
    if (pts.length < 2) pts.push([pts[0][0] + 0.6, pts[0][1] + 0.2]);
    var ov = o.overshoot != null ? o.overshoot : pen.overshoot;
    var e0 = rng.range(3, 9) * (ov || 0), e1 = rng.range(3, 11) * (ov || 0);
    if (ov) {
      var a = pts[0], b = pts[1], la = dist(a, b) || 1;
      pts.unshift([a[0] + (a[0] - b[0]) / la * e0, a[1] + (a[1] - b[1]) / la * e0]);
      var z = pts[pts.length - 1], y = pts[pts.length - 2], lz = dist(y, z) || 1;
      pts.push([z[0] + (z[0] - y[0]) / lz * e1, z[1] + (z[1] - y[1]) / lz * e1]);
    }
    var s = cumLen(pts);
    var len = s[s.length - 1] || 1;
    var wob = (o.wobble != null ? o.wobble : 1) * pen.wobble;
    var nA = noise1(rng), nB = noise1(rng), nP = noise1(rng);
    if (wob > 0) {
      var N0 = normalsOf(pts);
      var amp = wob * (1.1 + Math.min(len, 700) * 0.0034);
      for (var i = 0; i < pts.length; i++) {
        var off = nA(s[i] / 120) * amp + nB(s[i] / 21) * wob * 0.38;
        pts[i][0] += N0.nx[i] * off;
        pts[i][1] += N0.ny[i] * off;
      }
      s = cumLen(pts);
      len = s[s.length - 1] || 1;
    }
    var n = pts.length;
    var NN = normalsOf(pts);
    var X = new Float32Array(n), Y = new Float32Array(n), LX = new Float32Array(n), LY = new Float32Array(n);
    var RX = new Float32Array(n), RY = new Float32Array(n), WW = new Float32Array(n);
    var ti = pen.taper[0] * (o.taperIn != null ? o.taperIn : 1);
    var to = pen.taper[1] * (o.taperOut != null ? o.taperOut : 1);
    for (var k = 0; k < n; k++) {
      var u = s[k] / len;
      var ta = ti > 0 ? Math.min(1, u / ti) : 1;
      var tb = to > 0 ? Math.min(1, (1 - u) / to) : 1;
      var shape = (0.22 + 0.78 * Math.pow(ta, 0.6)) * (0.1 + 0.9 * Math.pow(tb, 0.75));
      var press = 1 + pen.press * nP(s[k] / 160);
      var nib = 1;
      if (pen.nib) {
        var ang = Math.atan2(NN.nx[k], -NN.ny[k]);
        nib = (1 - pen.nib) + pen.nib * 1.55 * Math.abs(Math.sin(ang - NIB));
      }
      var ww = Math.max(0.55, w * shape * press * nib);
      X[k] = pts[k][0]; Y[k] = pts[k][1]; WW[k] = ww;
      LX[k] = X[k] + NN.nx[k] * ww / 2; LY[k] = Y[k] + NN.ny[k] * ww / 2;
      RX[k] = X[k] - NN.nx[k] * ww / 2; RY[k] = Y[k] - NN.ny[k] * ww / 2;
    }
    return { n: n, x: X, y: Y, lx: LX, ly: LY, rx: RX, ry: RY, w: WW, s: s, len: len };
  }

  function drawGeom(ctx, g, p, cap) {
    var target = g.len * p;
    if (target <= 0.01) return;
    var n = g.n, s = g.s, k = n - 1;
    if (p < 1) {
      var lo = 0, hi = n - 1;
      while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (s[mid] <= target) lo = mid; else hi = mid - 1; }
      k = lo;
    }
    ctx.beginPath();
    ctx.moveTo(g.lx[0], g.ly[0]);
    for (var i = 1; i <= k; i++) ctx.lineTo(g.lx[i], g.ly[i]);
    var tx = g.x[k], ty = g.y[k], tw = g.w[k];
    if (k < n - 1) {
      var f = (target - s[k]) / Math.max(1e-6, s[k + 1] - s[k]);
      ctx.lineTo(lerp(g.lx[k], g.lx[k + 1], f), lerp(g.ly[k], g.ly[k + 1], f));
      ctx.lineTo(lerp(g.rx[k], g.rx[k + 1], f), lerp(g.ry[k], g.ry[k + 1], f));
      tx = lerp(g.x[k], g.x[k + 1], f); ty = lerp(g.y[k], g.y[k + 1], f); tw = lerp(g.w[k], g.w[k + 1], f);
    }
    for (var j = k; j >= 0; j--) ctx.lineTo(g.rx[j], g.ry[j]);
    ctx.closePath();
    ctx.fill();
    if (cap && p < 1 && tw > 1.2) {
      ctx.beginPath();
      ctx.arc(tx, ty, tw * 0.5, 0, TAU);
      ctx.fill();
    }
  }

  // 드라이 브러시 (털끝 여러 가닥)
  function makeBristle(ctrl, o, rng) {
    var W = o.w || 60, B = o.bristles || 20, dry = o.dry != null ? o.dry : 0.5;
    var sp = resampleCatmull(ctrl, 5);
    var nW = noise1(rng);
    var s0 = cumLen(sp);
    var N0 = normalsOf(sp);
    for (var i = 0; i < sp.length; i++) {
      var off = nW(s0[i] / 90) * W * 0.06;
      sp[i][0] += N0.nx[i] * off; sp[i][1] += N0.ny[i] * off;
    }
    var s = cumLen(sp), len = s[s.length - 1] || 1, n = sp.length, NN = normalsOf(sp);
    var nG = noise1(rng);
    var bristles = [];
    for (var b = 0; b < B; b++) {
      var t = B === 1 ? 0 : b / (B - 1) - 0.5;
      var edge = Math.abs(t) * 2;
      var boff = t * W + rng.gauss() * W * 0.012;
      var bw = W / B * rng.range(0.9, 2.2);
      var u0 = rng.range(0, 0.05) + edge * rng.range(0, 0.08);
      var u1 = 1 - rng.range(0, 0.22) * (0.3 + edge);
      var phase = rng() * 60;
      var LX = new Float32Array(n), LY = new Float32Array(n), RX = new Float32Array(n), RY = new Float32Array(n);
      var segs = [], cur = -1;
      for (var k = 0; k < n; k++) {
        var u = s[k] / len;
        var shrink = 0.82 + 0.18 * Math.sin(Math.PI * clamp(u, 0, 1));
        var cxk = sp[k][0] + NN.nx[k] * boff * shrink, cyk = sp[k][1] + NN.ny[k] * boff * shrink;
        var tw = bw * (0.5 + 0.5 * Math.min(1, (u - u0) / 0.05)) * (0.4 + 0.6 * Math.min(1, (u1 - u) / 0.12));
        tw = Math.max(0.4, tw);
        LX[k] = cxk + NN.nx[k] * tw / 2; LY[k] = cyk + NN.ny[k] * tw / 2;
        RX[k] = cxk - NN.nx[k] * tw / 2; RY[k] = cyk - NN.ny[k] * tw / 2;
        var th = -1 + dry * (0.45 + 1.15 * u);
        var on = u >= u0 && u <= u1 && nG(s[k] / 34 + phase + b * 3.7) >= th;
        if (on && cur < 0) cur = k;
        if (!on && cur >= 0) { if (k - cur > 1) segs.push([cur, k - 1]); cur = -1; }
      }
      if (cur >= 0 && n - 1 - cur > 1) segs.push([cur, n - 1]);
      bristles.push({ lx: LX, ly: LY, rx: RX, ry: RY, segs: segs, a: rng.range(0.5, 1) });
    }
    return { n: n, s: s, len: len, bristles: bristles };
  }
  function drawBristle(ctx, g, p, alpha, step) {
    var target = g.len * p, s = g.s, k = g.n - 1;
    if (p < 1) { k = 0; while (k < g.n - 1 && s[k + 1] <= target) k++; }
    step = step || 1;
    for (var b = 0; b < g.bristles.length; b += step) {
      var br = g.bristles[b];
      ctx.globalAlpha = alpha * br.a * (step > 1 ? 1.25 : 1);
      ctx.beginPath();
      for (var j = 0; j < br.segs.length; j++) {
        var sg = br.segs[j];
        if (sg[0] > k) break;
        var e = Math.min(sg[1], k);
        ctx.moveTo(br.lx[sg[0]], br.ly[sg[0]]);
        for (var i = sg[0] + 1; i <= e; i++) ctx.lineTo(br.lx[i], br.ly[i]);
        for (i = e; i >= sg[0]; i--) ctx.lineTo(br.rx[i], br.ry[i]);
        ctx.closePath();
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 다각형을 평행선으로 잘라 해칭 선분을 만든다
  function hatchSegments(poly, angle, gap, rng, maxN) {
    var ca = Math.cos(-angle), sa = Math.sin(-angle);
    var rp = poly.map(function (p) { return [p[0] * ca - p[1] * sa, p[0] * sa + p[1] * ca]; });
    var minY = Infinity, maxY = -Infinity;
    rp.forEach(function (p) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); });
    if (maxN && (maxY - minY) / gap > maxN) gap = (maxY - minY) / maxN;
    var cb = Math.cos(angle), sb = Math.sin(angle);
    var segs = [];
    for (var y = minY + gap * rng.range(0.3, 0.8); y < maxY; y += gap * rng.range(0.85, 1.15)) {
      var xs = [];
      for (var i = 0; i < rp.length; i++) {
        var a = rp[i], b = rp[(i + 1) % rp.length];
        if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
      }
      xs.sort(function (p, q) { return p - q; });
      for (var j = 0; j + 1 < xs.length; j += 2) {
        var x0 = xs[j], x1 = xs[j + 1], L = x1 - x0;
        if (L < gap * 0.6) continue;
        x0 += L * rng.range(0.02, 0.14);
        x1 -= L * rng.range(0.02, 0.14);
        segs.push([[x0 * cb - y * sb, x0 * sb + y * cb], [x1 * cb - y * sb, x1 * sb + y * cb]]);
      }
    }
    return segs;
  }

  function jitterPts(pts, rng, a) {
    var dx = rng.range(-a, a), dy = rng.range(-a, a);
    return pts.map(function (p) { return [p[0] + dx + rng.range(-a, a) * 0.4, p[1] + dy + rng.range(-a, a) * 0.4]; });
  }

  // ---------------------------------------------------------------
  // 줄바꿈
  //   띄어쓰기가 있는 언어(ko, en, fr, de, es, vi): 띄어쓰기 단위
  //   일본어·중국어: 글자 단위 + 간단한 금칙(닫는 문장부호는 줄 앞에 오지 않고, 여는 괄호는 줄 끝에 남지 않는다)
  //   타이어(띄어쓰기 없음): Intl.Segmenter 단어 단위 (없으면 글자 묶음 단위)
  //   한 단어가 한 줄보다 길면 글자 묶음(grapheme) 단위로 자른다 — 타이 모음·성조, 베트남어 결합 부호, 이모지를 쪼개지 않는다.
  // ---------------------------------------------------------------
  var CJK_RE = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;
  var THAI_RE = /[\u0e00-\u0e7f]/;
  var CLOSE_RE = /^([、。，．・」』）》〉】〕”’；：!?！？…ー%]+)/;
  var OPEN_RE = /([「『（《〈【〔“‘]+)$/;
  var segCache = {};
  function segmenter(lang, gran) {
    var k = lang + gran;
    if (segCache[k] !== undefined) return segCache[k];
    var sg = null;
    try { if (typeof Intl !== 'undefined' && Intl.Segmenter) sg = new Intl.Segmenter(lang, { granularity: gran }); } catch (e) { sg = null; }
    segCache[k] = sg;
    return sg;
  }
  function isMarkCp(c) {
    return (c >= 0x0300 && c <= 0x036f) || c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e) ||
      c === 0x200d || (c >= 0xfe00 && c <= 0xfe0f) || (c >= 0x1f3fb && c <= 0x1f3ff);
  }
  // 글자 묶음: 결합 부호·ZWJ 는 앞 글자에, 타이 앞 모음(เ แ โ ใ ไ)은 뒤 글자에 붙인다
  function clusters(str) {
    var g = segmenter('und', 'grapheme'), out = [];
    if (g) {
      var it = g.segment(String(str));
      if (typeof Symbol !== 'undefined' && it[Symbol.iterator]) {
        var x = it[Symbol.iterator](), r;
        while (!(r = x.next()).done) out.push(r.value.segment);
      }
    } else {
      Array.from(String(str)).forEach(function (ch) {
        var c = ch.codePointAt(0), prev = out.length ? out[out.length - 1] : '';
        if (out.length && (isMarkCp(c) || /\u200d$/.test(prev))) out[out.length - 1] += ch;
        else out.push(ch);
      });
    }
    for (var i = out.length - 2; i >= 0; i--) {
      if (/^[\u0e40-\u0e44]$/.test(out[i])) { out[i] += out[i + 1]; out.splice(i + 1, 1); }
    }
    return out;
  }
  function thaiWords(part) {
    var sg = segmenter('th', 'word');
    if (!sg) return clusters(part);
    var out = [], it = sg.segment(part);
    if (typeof Symbol === 'undefined' || !it[Symbol.iterator]) return clusters(part);
    var x = it[Symbol.iterator](), r;
    while (!(r = x.next()).done) out.push(r.value.segment);
    return out;
  }
  function tokenize(str) {
    var out = [];
    str = String(str);
    if (str.normalize) str = str.normalize('NFC'); // 베트남어를 결합 부호로 입력해도 한 글자로
    str.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { if (out.length) out[out.length - 1] += ' '; return; }
      if (CJK_RE.test(part) && part.length > 1) {
        clusters(part).forEach(function (ch) { out.push(ch); });
      } else if (THAI_RE.test(part) && part.length > 1) {
        thaiWords(part).forEach(function (w) { out.push(w); });
      } else out.push(part);
    });
    return out;
  }
  function wrapText(str, maxW, font, measure) {
    var toks = tokenize(str);
    var lines = [], cur = '';
    toks.forEach(function (tok) {
      var test = cur + tok;
      if (!cur || measure(test.replace(/\s+$/, ''), font) <= maxW) {
        cur = test;
        if (measure(cur.replace(/\s+$/, ''), font) > maxW && clusters(cur).length > 1) {
          // 한 단어가 너무 길면 글자 묶음 단위로 자른다
          var chs = clusters(cur), part = '';
          chs.forEach(function (ch) {
            if (part && measure(part + ch, font) > maxW) { lines.push(part); part = ch; } else part += ch;
          });
          cur = part;
        }
      } else {
        lines.push(cur.replace(/\s+$/, ''));
        cur = tok.replace(/^\s+/, '');
      }
    });
    if (cur.replace(/\s+/g, '')) lines.push(cur.replace(/\s+$/, ''));
    for (var i = 1; i < lines.length; i++) {
      var m = CLOSE_RE.exec(lines[i]);
      if (m) { lines[i - 1] += m[1]; lines[i] = lines[i].slice(m[1].length); }
      var o = OPEN_RE.exec(lines[i - 1]);
      if (o && lines[i - 1].length > o[1].length) { lines[i] = o[1] + lines[i]; lines[i - 1] = lines[i - 1].slice(0, -o[1].length); }
    }
    return lines.filter(function (l) { return l.length; });
  }

  // 줄 수는 그대로 두고 폭을 줄여 가며 다시 나눠 본다 → 마지막 줄에 한 단어만 남는 일을 줄인다(캡션용)
  // 줄 끝이 모두 토큰(단어·글자) 경계인지 — 좁힌 폭에서 단어가 글자 단위로 잘리면 쓰지 않는다
  function breaksAtTokens(lines, toks) {
    var ends = {}, pos = 0;
    toks.forEach(function (t) { pos += t.replace(/\s+/g, '').length; ends[pos] = true; });
    var acc = 0;
    for (var i = 0; i < lines.length - 1; i++) {
      acc += lines[i].replace(/\s+/g, '').length;
      if (!ends[acc]) return false;
    }
    return true;
  }
  function balanceWrap(str, maxW, font, measure) {
    var best = wrapText(str, maxW, font, measure);
    if (best.length < 2) return best;
    var toks = tokenize(str), okBase = breaksAtTokens(best, toks);
    for (var k = 0.94; k >= 0.6; k -= 0.06) {
      var t = wrapText(str, maxW * k, font, measure);
      if (t.length !== best.length || (okBase && !breaksAtTokens(t, toks))) break;
      best = t;
    }
    return best;
  }

  // ---------------------------------------------------------------
  // 획 계획(Builder): 트랙별로 순서대로 쌓고, 마지막에 장면 시간창에 맞춘다
  // ---------------------------------------------------------------
  var SPEED = { border: 3000, band: 2600, title: 900, draw: 1000, hatch: 1800, cap: 2200, fx: 1300 };
  var GAP = { border: 0.03, band: 0.02, title: 0.06, draw: 0.05, hatch: 0.012, cap: 0.04, fx: 0.05 };
  // 한 컷을 그리는 순서: 테두리 → 먹 띠 → 캡션(먼저 읽히도록) → 그림 → 해칭 → 효과선
  var WIN = { border: [0, 0.6], band: [0.45, 0.95], cap: [0.75, 1.75], draw: [1.55, 3.55], hatch: [3.35, 4.0], fx: [3.9, 4.4] };
  var END_WIN = { title: [0.1, 1.9], border: [1.8, 2.3], draw: [2.3, 4.9], hatch: [4.8, 5.5], cap: [5.4, 6.4], fx: [6.3, 6.9] };
  var TRANS_DUR = { none: 0, flip: 0.85, wipe: 1.15 };

  function Builder(env, rng) {
    this.pen = env.pen;
    this.fonts = env.fonts;
    this.measure = env.measure;
    this.rng = rng;
    this.tracks = {};
    this.clip = null;
  }
  Builder.prototype.push = function (name, op, natural) {
    var t = this.tracks[name];
    if (!t) t = this.tracks[name] = { ops: [], cur: 0 };
    op.rt = t.cur;
    op.dur = natural;
    if (op.clip === undefined) op.clip = this.clip;
    t.cur += natural + (GAP[name] != null ? GAP[name] : 0.04);
    t.ops.push(op);
    return op;
  };
  Builder.prototype.line = function (name, pts, o) {
    o = o || {};
    var pen = this.pen, rng = this.rng;
    if (pen.blob && o.blob !== false && rng() < 0.1) {
      this.push(name, { type: 'fill', pts: ellipsePoly(pts[0][0], pts[0][1], 2.6, 2.3, 10), color: o.color || 'ink', alpha: 0.9 }, 0.01);
    }
    var g = makeGeom(pts, o, pen, rng);
    var op = { type: 'line', g: g, color: o.color || 'ink', alpha: o.alpha != null ? o.alpha : 1 };
    if (pen.doubled && o.doubled !== false && g.len > 24) {
      op.g2 = makeGeom(jitterPts(pts, rng, 1.4 + (o.w || 6) * 0.22), ext(o, { overshoot: 1.4, wobble: (o.wobble != null ? o.wobble : 1) * 1.25 }), pen, rng);
      op.a2 = pen.doubled;
    }
    var sp = o.speed || SPEED[name] || 1000;
    var d = Math.max(o.minDur || 0.07, Math.min(o.maxDur || 0.9, g.len / sp));
    return this.push(name, op, d);
  };
  Builder.prototype.poly = function (name, pts, o) { return this.line(name, pts, ext({ sharp: true }, o || {})); };
  Builder.prototype.circle = function (name, cx, cy, r, o) {
    o = o || {};
    var a0 = o.a0 != null ? o.a0 : -Math.PI * 0.62 + this.rng.range(-0.4, 0.4);
    var sweep = o.sweep != null ? o.sweep : TAU * 1.05;
    var n = Math.max(14, Math.round(Math.abs(sweep) * Math.max(r, o.ry || r) / 9));
    return this.line(name, ellipsePts(cx, cy, r, o.ry || r, a0, a0 + sweep, n), ext({ sharp: true, taperIn: 0.6, taperOut: 0.6 }, o));
  };
  Builder.prototype.box = function (name, x, y, w, h, o) {
    o = o || {};
    var rng = this.rng, j = o.j != null ? o.j : 2.5, ov = o.ov != null ? o.ov : 5;
    var c = [[x + rng.range(-j, j), y + rng.range(-j, j)], [x + w + rng.range(-j, j), y + rng.range(-j, j)],
      [x + w + rng.range(-j, j), y + h + rng.range(-j, j)], [x + rng.range(-j, j), y + h + rng.range(-j, j)]];
    var self = this;
    [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(function (e) {
      var a = c[e[0]], b = c[e[1]], L = dist(a, b) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
      var o0 = rng.range(0, ov), o1 = rng.range(0, ov);
      self.line(name, [[a[0] - ux * o0, a[1] - uy * o0], [b[0] + ux * o1, b[1] + uy * o1]], ext({ taperIn: 0.5, taperOut: 0.6 }, o));
    });
    return c;
  };
  Builder.prototype.fill = function (name, pts, color, o) {
    o = o || {};
    return this.push(name, { type: 'fill', pts: pts, color: color || 'ink', alpha: o.alpha != null ? o.alpha : 1, clip: o.clip }, o.dur || 0.08);
  };
  Builder.prototype.dot = function (name, x, y, r, color) {
    return this.fill(name, ellipsePoly(x, y, r, r * this.rng.range(0.9, 1.08), 16), color || 'ink', { dur: 0.06 });
  };
  Builder.prototype.hatch = function (name, poly, o) {
    o = o || {};
    var pen = this.pen, rng = this.rng, self = this;
    var gap = (o.gap || pen.hatchGap) * (pen.band === 'crosshatch' ? 0.8 : 1);
    var segs = hatchSegments(poly, o.angle != null ? o.angle : 0.9, gap, rng, o.max || 34);
    segs.forEach(function (sg) {
      var mid = [lerp(sg[0][0], sg[1][0], 0.5) + rng.range(-1, 1), lerp(sg[0][1], sg[1][1], 0.5) + rng.range(-1, 1)];
      self.line(name, [sg[0], mid, sg[1]], { w: (o.w || pen.hatchW) * (o.wMul || 1), taperIn: 0.7, taperOut: 1.6, wobble: 0.3, doubled: false, blob: false, color: o.color, speed: 1900, minDur: 0.035, maxDur: 0.12, alpha: o.alpha });
    });
    if (o.cross) this.hatch(name, poly, ext(o, { cross: false, angle: (o.angle != null ? o.angle : 0.9) + Math.PI / 2 }));
    return segs.length;
  };
  Builder.prototype.bristle = function (name, pts, o) {
    var g = makeBristle(pts, o, this.rng);
    return this.push(name, { type: 'bristle', g: g, alpha: o.alpha != null ? o.alpha : 0.92, color: o.color || 'ink' }, Math.max(0.2, Math.min(0.8, g.len / (o.speed || SPEED[name] || 2400))));
  };
  Builder.prototype.smudge = function (name, x, y, rx, ry, o) {
    o = o || {};
    return this.push(name, { type: 'smudge', x: x, y: y, rx: rx, ry: ry, rot: o.rot || 0, alpha: o.alpha || 0.1 }, 0.3);
  };
  Builder.prototype.dashed = function (name, pts, o) {
    o = o || {};
    var dense = resampleCatmull(pts, 4), s = cumLen(dense), len = s[s.length - 1];
    var dash = o.dash || 16, gapL = o.gapL || 12, cur = [], acc = 0, on = true, self = this;
    for (var i = 0; i < dense.length; i++) {
      if (on) cur.push(dense[i]);
      var seg = i ? s[i] - s[i - 1] : 0;
      acc += seg;
      if (on && acc >= dash) { if (cur.length > 1) self.line(name, cur, ext({ taperIn: 0.4, taperOut: 0.5, doubled: false, blob: false, speed: 1600, minDur: 0.03 }, o)); cur = []; acc = 0; on = false; }
      else if (!on && acc >= gapL) { acc = 0; on = true; cur = [dense[i]]; }
    }
    if (on && cur.length > 1) self.line(name, cur, ext({ doubled: false, blob: false, minDur: 0.03 }, o));
    return len;
  };
  Builder.prototype.font = function (size) {
    var f = this.fonts;
    return f.weight + ' ' + Math.round(size * 10) / 10 + 'px ' + f.hand;
  };
  // 한 줄 손글씨. o.align 'right' 면 x 는 오른쪽 끝
  Builder.prototype.text = function (name, str, x, y, o) {
    o = o || {};
    if (!str) return null;
    var size = o.size || 40, font = this.font(size), w = this.measure(str, font);
    if (o.maxW && w > o.maxW) { size *= o.maxW / w; font = this.font(size); w = this.measure(str, font); }
    var lx = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
    var op = { type: 'text', lines: [{ s: str, x: lx, y: y, w: w }], font: font, size: size, color: o.color || 'ink', alpha: o.alpha != null ? o.alpha : 1, clip: null };
    this.push(name, op, Math.max(0.25, Array.from(str).length / (o.cps || 14)));
    return { x: lx, y: y, w: w, size: size };
  };
  // 만화 캡션 박스: 종이색 바탕 + 흔들리는 테두리 + 손글씨(메타 한 줄 + 본문)
  Builder.prototype.caption = function (name, o, meta, line) {
    var rng = this.rng, fs = this.fonts.scale, measure = this.measure;
    var size = o.size * fs, msize = size * 0.72;
    var font = this.font(size), mfont = this.font(msize);
    var padX = 24, padY = 18;
    var maxTW = o.maxW - padX * 2;
    var mLines = meta ? wrapText(meta, maxTW, mfont, measure) : [];
    var lines = line ? balanceWrap(line, maxTW, font, measure) : [];
    var tw = 0;
    mLines.forEach(function (l) { tw = Math.max(tw, measure(l, mfont)); });
    lines.forEach(function (l) { tw = Math.max(tw, measure(l, font)); });
    var lead = this.fonts.lh || 1.12; // 줄 간격: 윗 모음·성조가 쌓이는 타이어는 언어 파일에서 넓힌다
    var lh = size * lead, mlh = msize * (lead + 0.06);
    var bw = Math.min(o.maxW, tw + padX * 2 + 8);
    var bh = padY * 2 + mLines.length * mlh + (mLines.length && lines.length ? 6 : 0) + lines.length * lh - size * 0.06;
    var x = o.align === 'right' ? o.x + o.w - bw : o.x;
    var y = o.y;
    this.fill(name, rectPoly(x - 2, y - 2, bw + 4, bh + 4), 'paper', { dur: 0.06, clip: null });
    var saved = this.clip;
    this.clip = null;
    this.box(name, x, y, bw, bh, { w: 4.4, j: 2, ov: 6 });
    var cy = y + padY + msize * 0.82;
    var self = this;
    mLines.forEach(function (l, i) {
      var tw1 = measure(l, mfont);
      self.push(name, { type: 'text', lines: [{ s: l, x: x + padX, y: cy + i * mlh, w: tw1 }], font: mfont, size: msize, color: 'ink', alpha: 0.78, clip: null }, Math.max(0.2, Array.from(l).length / 18));
      if (i === 0) {
        var uy = cy + i * mlh + msize * 0.22;
        var ux = x + padX, uw = Math.min(tw1, 180);
        self.line(name, [[ux, uy], [ux + uw * 0.3, uy + 3], [ux + uw * 0.62, uy - 2], [ux + uw, uy + 2]], { w: 2.6, taperIn: 0.4, doubled: false, blob: false, speed: 1400, alpha: 0.7 });
      }
    });
    var by = cy + (mLines.length ? (mLines.length - 1) * mlh + mlh * 0.2 + 6 + size * 0.95 : size * 0.1);
    if (!mLines.length) by = y + padY + size * 0.86;
    lines.forEach(function (l, i) {
      var w1 = measure(l, font);
      self.push(name, { type: 'text', lines: [{ s: l, x: x + padX, y: by + i * lh, w: w1 }], font: font, size: size, color: 'ink', alpha: 1, clip: null }, Math.max(0.25, Array.from(l).length / 15));
    });
    this.clip = saved;
    return { x: x, y: y, w: bw, h: bh, lines: lines.length + mLines.length };
  };
  Builder.prototype.bubble = function (name, x, y, rx, ry, tail, sym) {
    var rng = this.rng;
    this.fill(name, ellipsePoly(x, y, rx, ry, 22), 'paper', { dur: 0.05 });
    this.circle(name, x, y, rx, { ry: ry, w: 4, a0: Math.PI * 0.5 + 0.35 });
    this.line(name, [[x + (tail[0] - x) * 0.35 - 10, y + ry * 0.82], [tail[0], tail[1]], [x + (tail[0] - x) * 0.35 + 10, y + ry * 0.9]], { w: 3.8, sharp: true });
    this.symbol(name, sym, x, y, Math.min(rx, ry) * 0.62);
  };
  Builder.prototype.symbol = function (name, sym, x, y, r) {
    var self = this;
    if (sym === 'heart') this.line(name, heartPts(x, y + r * 0.1, r * 0.85), { w: 4.4, color: 'accent', sharp: true });
    else if (sym === '!') { this.line(name, [[x, y - r * 0.8], [x + 1, y + r * 0.3]], { w: 6 }); this.dot(name, x + 1, y + r * 0.72, 4.2); }
    else if (sym === '?') { this.line(name, [[x - r * 0.45, y - r * 0.4], [x - r * 0.1, y - r * 0.85], [x + r * 0.45, y - r * 0.5], [x + r * 0.05, y - r * 0.05], [x, y + r * 0.3]], { w: 5.2 }); this.dot(name, x, y + r * 0.74, 4); }
    else if (sym === 'note') {
      this.circle(name, x - r * 0.3, y + r * 0.5, r * 0.26, { ry: r * 0.2, w: 4 });
      this.line(name, [[x - r * 0.05, y + r * 0.5], [x - r * 0.02, y - r * 0.75], [x + r * 0.5, y - r * 0.45]], { w: 4.2, sharp: true });
    } else if (sym === 'dots') { [-1, 0, 1].forEach(function (k) { self.dot(name, x + k * r * 0.5, y + r * 0.1, 4.2); }); }
    else if (sym === 'spark') this.sparkle(name, x, y, r * 0.8);
  };
  Builder.prototype.sparkle = function (name, x, y, r, o) {
    o = o || {};
    this.line(name, [[x, y - r], [x, y + r]], { w: 3.4, color: o.color, doubled: false });
    this.line(name, [[x - r, y], [x + r, y]], { w: 3.4, color: o.color, doubled: false });
  };
  Builder.prototype.ticks = function (name, x, y, r0, r1, a0, a1, n, o) {
    for (var i = 0; i < n; i++) {
      var a = a0 + (a1 - a0) * (n === 1 ? 0.5 : i / (n - 1));
      this.line(name, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], ext({ w: 3.4, taperIn: 0.5, doubled: false }, o || {}));
    }
  };
  Builder.prototype.cloud = function (name, cx, cy, w) {
    var rng = this.rng, bumps = 3 + Math.floor(rng() * 2), pts = [], x = cx - w / 2, step = w / bumps;
    pts.push([x - 4, cy]);
    for (var i = 0; i < bumps; i++) {
      var r = step * 0.5 * rng.range(0.9, 1.25), mx = x + step * (i + 0.5);
      var arc = ellipsePts(mx, cy, step * 0.55, r * (i === 1 || i === 2 ? 1.25 : 0.9), Math.PI, TAU, 8);
      pts = pts.concat(arc.slice(1));
    }
    pts.push([cx + w / 2 + 4, cy]);
    this.line(name, pts, { w: 4.4 });
    this.line(name, [[cx - w * 0.42, cy + 2], [cx + w * 0.45, cy + 1]], { w: 3.4, alpha: 0.9 });
  };
  Builder.prototype.finalize = function (t0, dur, shift, win) {
    var need = 0, k, name;
    for (name in win) need = Math.max(need, win[name][1]);
    k = clamp((dur - 0.35 - shift) / need, 0.5, 1.15);
    var prevEnd = 0, all = [], self = this;
    var names = Object.keys(this.tracks).sort(function (a, b) { return (win[a] ? win[a][0] : 0) - (win[b] ? win[b][0] : 0); });
    names.forEach(function (nm) {
      var tr = self.tracks[nm];
      if (!tr || !tr.ops.length) return;
      var w = win[nm] || [0, need];
      var a = w[0] * k, b = w[1] * k;
      var start = Math.max(a, prevEnd - 0.08 * k);
      var avail = Math.max(0.12, b - start);
      var sc = tr.cur > avail ? avail / tr.cur : 1;
      tr.ops.forEach(function (op) {
        op.t0 = t0 + shift + start + op.rt * sc;
        op.dur = Math.max(0.025, op.dur * sc);
        delete op.rt;
        all.push(op);
      });
      prevEnd = start + tr.cur * sc;
    });
    all.sort(function (p, q) { return p.t0 - q.t0; });
    return all;
  };

  // ---------------------------------------------------------------
  // 사람 (나이에 따라 키가 자란다)
  // ---------------------------------------------------------------
  function heightFor(age) {
    var T = [[0, 0.2], [1, 0.34], [3, 0.43], [5, 0.5], [7, 0.57], [10, 0.67], [13, 0.79], [16, 0.92], [18, 0.98], [20, 1]];
    if (age >= 20) return age > 65 ? 0.97 : 1;
    for (var i = 1; i < T.length; i++) {
      if (age <= T[i][0]) { var a = T[i - 1], b = T[i]; return a[1] + (b[1] - a[1]) * (age - a[0]) / (b[0] - a[0]); }
    }
    return 1;
  }

  function figure(B, x, gy, age, S, o) {
    o = o || {};
    var dir = o.dir || 1, pose = o.pose || 'down', rng = B.rng, W = 5.6;
    if (age <= 0) {
      var r = 11 * clamp(S, 0.7, 1.2);
      B.dot('draw', x, gy - r - 3, r);
      B.line('draw', [[x - r * 2.1, gy - r * 0.2], [x - r * 0.4, gy + r * 0.2], [x + r * 1.9, gy - r * 0.5]], { w: 3.6 });
      var hl = [x - r * 1.4, gy - r], hrr = [x + r * 1.4, gy - r];
      return { top: gy - r * 2 - 4, head: [x, gy - r - 3], hr: r, handL: hl, handR: hrr, handF: dir > 0 ? hrr : hl, handB: dir > 0 ? hl : hrr, cx: x, h: r * 2, sh: gy - r * 1.6, hem: gy - r * 0.4, bw: r };
    }
    var h = 300 * S * heightFor(age) * (o.scale || 1);
    var ad = clamp((age - 2) / 16, 0, 1);
    var hr = h * (0.1 + 0.06 * (1 - ad));
    var leg = h * (0.34 + 0.1 * ad);
    var hem = gy - leg;
    var neck = gy - h + hr * 2.1;
    var hcY = neck - hr * 1.05;
    var sh = neck + h * 0.045;
    var bw = h * (0.12 + 0.02 * ad);
    if (o.knock) {
      // 뒤에 있는 선을 가리는 종이색 실루엣 (앞에 선 사람)
      B.fill('draw', ellipsePoly(x, hcY, hr * 1.25, hr * 1.28, 16), 'paper', { dur: 0.02 });
      B.fill('draw', [[x - hr * 0.5, neck - 2], [x + hr * 0.5, neck - 2], [x + bw * 1.25, hem + 4], [x + bw * 0.6, gy + 4], [x - bw * 0.6, gy + 4], [x - bw * 1.25, hem + 4]], 'paper', { dur: 0.02 });
    }
    var a0 = -Math.PI * 0.6 + rng.range(-0.3, 0.3);
    B.line('draw', ellipsePts(x, hcY, hr, hr * 1.04, a0, a0 + TAU * 1.06, 26), { w: W * 0.95, sharp: true, taperIn: 0.6, taperOut: 0.5 });
    if (!o.noHair) B.line('draw', [[x - hr * 0.35 * dir, hcY - hr * 0.88], [x + hr * 0.05 * dir, hcY - hr * 1.34], [x + hr * 0.52 * dir, hcY - hr * 1.16]], { w: W * 0.8 });
    B.line('draw', [[x - bw, hem], [x - bw * 0.55, sh + h * 0.02], [x - hr * 0.3, neck], [x + hr * 0.3, neck], [x + bw * 0.55, sh + h * 0.02], [x + bw, hem]], { w: W, taperIn: 0.4, taperOut: 0.5 });
    B.line('draw', [[x - bw - 3, hem + 1], [x + bw + 3, hem - 1]], { w: W * 0.85 });
    var spread = o.legs === 'walk' ? h * 0.1 : h * 0.028;
    var lx0 = x - bw * 0.36, rx0 = x + bw * 0.36;
    var fl = h * 0.05 * dir;
    B.line('draw', [[lx0, hem + 2], [lx0 - spread, gy], [lx0 - spread + fl, gy + 1]], { w: W * 0.88, sharp: true, taperOut: 0.4 });
    B.line('draw', [[rx0, hem + 2], [rx0 + spread, gy], [rx0 + spread + fl, gy + 1]], { w: W * 0.88, sharp: true, taperOut: 0.4 });

    var sl = [x - bw * 0.6, sh + h * 0.02], sr = [x + bw * 0.6, sh + h * 0.02];
    var front = dir > 0 ? sr : sl, back = dir > 0 ? sl : sr, fs = dir;
    var handF, handB, elbF, elbB;
    switch (pose) {
      case 'wave':
        handB = [back[0] - fs * bw * 0.45, back[1] + h * 0.27]; elbB = [back[0] - fs * bw * 0.35, back[1] + h * 0.13];
        handF = [front[0] + fs * bw * 0.95, front[1] - h * 0.25]; elbF = [front[0] + fs * bw * 0.85, front[1] + h * 0.02];
        break;
      case 'up':
        handB = [back[0] - fs * bw * 0.9, back[1] - h * 0.24]; elbB = [back[0] - fs * bw * 0.85, back[1] + h * 0.01];
        handF = [front[0] + fs * bw * 0.9, front[1] - h * 0.24]; elbF = [front[0] + fs * bw * 0.85, front[1] + h * 0.01];
        break;
      case 'out':
        handB = [back[0] - fs * bw * 1.35, back[1] + h * 0.1]; elbB = [back[0] - fs * bw * 0.7, back[1] + h * 0.04];
        handF = [front[0] + fs * bw * 1.35, front[1] + h * 0.1]; elbF = [front[0] + fs * bw * 0.7, front[1] + h * 0.04];
        break;
      case 'hold':
        handB = [back[0] - fs * bw * 0.45, back[1] + h * 0.27]; elbB = [back[0] - fs * bw * 0.35, back[1] + h * 0.13];
        handF = [front[0] + fs * bw * 1.25, front[1] + h * 0.24]; elbF = [front[0] + fs * bw * 0.65, front[1] + h * 0.13];
        break;
      case 'carry':
        handB = [x + fs * bw * 1.2, sh + h * 0.2]; elbB = [back[0] + fs * bw * 0.1, back[1] + h * 0.17];
        handF = [x + fs * bw * 1.55, sh + h * 0.17]; elbF = [front[0] + fs * bw * 0.4, front[1] + h * 0.14];
        break;
      case 'salute':
        handB = [back[0] - fs * bw * 0.4, back[1] + h * 0.27]; elbB = [back[0] - fs * bw * 0.3, back[1] + h * 0.13];
        handF = [x + fs * hr * 0.9, hcY - hr * 0.5]; elbF = [front[0] + fs * bw * 1.1, front[1] + h * 0.02];
        break;
      case 'hips':
        handB = [back[0] + fs * bw * 0.05, hem - h * 0.03]; elbB = [back[0] - fs * bw * 0.8, back[1] + h * 0.1];
        handF = [front[0] - fs * bw * 0.05, hem - h * 0.03]; elbF = [front[0] + fs * bw * 0.8, front[1] + h * 0.1];
        break;
      case 'reach':
        handB = [back[0] - fs * bw * 0.45, back[1] + h * 0.27]; elbB = [back[0] - fs * bw * 0.35, back[1] + h * 0.13];
        handF = [front[0] + fs * bw * 1.15, front[1] - h * 0.3]; elbF = [front[0] + fs * bw * 0.8, front[1] - h * 0.07];
        break;
      default:
        handB = [back[0] - fs * bw * 0.45, back[1] + h * 0.27]; elbB = [back[0] - fs * bw * 0.34, back[1] + h * 0.13];
        handF = [front[0] + fs * bw * 0.45, front[1] + h * 0.27]; elbF = [front[0] + fs * bw * 0.34, front[1] + h * 0.13];
    }
    B.line('draw', [back, elbB, handB], { w: W * 0.82, taperOut: 0.4 });
    B.line('draw', [front, elbF, handF], { w: W * 0.82, taperOut: 0.4 });
    if (o.pack) {
      var px = x - dir * (bw * 0.55), pw = bw * 0.9;
      B.box('draw', dir > 0 ? px - pw : px, sh + h * 0.02, pw, h * 0.22, { w: 4 });
    }
    if (!o.noHatch) B.hatch('hatch', [[x - bw * 0.42, sh + h * 0.07], [x + bw * 0.42, sh + h * 0.07], [x + bw * 0.86, hem - 5], [x - bw * 0.86, hem - 5]], { angle: 1.05, gap: Math.max(8, h * 0.045), max: 7 });
    if (!o.noShadow) B.hatch('hatch', ellipsePoly(x + dir * h * 0.05, gy + 6, h * 0.22 + 10, h * 0.03 + 4, 14), { angle: 0.1, gap: 6, wMul: 0.8, max: 4 });
    var hands = dir > 0 ? [handB, handF] : [handF, handB];
    return { top: hcY - hr, head: [x, hcY], hr: hr, handL: hands[0], handR: hands[1], handF: handF, handB: handB, cx: x, h: h, sh: sh, hem: hem, bw: bw };
  }

  function ground(B, cx, gy, S, span) {
    var rng = B.rng, x0 = cx - span * S, x1 = cx + span * S, mid = cx + rng.range(-0.35, 0.35) * span * S;
    B.line('draw', [[x0, gy + rng.range(-3, 3)], [(x0 + mid) / 2, gy + rng.range(-2, 2)], [mid - 14, gy + rng.range(-3, 3)]], { w: 5 });
    B.line('draw', [[mid + 8, gy + rng.range(-3, 3)], [x1, gy + rng.range(-4, 4)]], { w: 5 });
  }

  // ---------------------------------------------------------------
  // 장면별 그림 (dx, dy 는 지면 중앙 기준, S 배율)
  // ---------------------------------------------------------------
  function M(c) {
    return function (dx, dy) { return [c.cx + dx * c.S, c.gy + dy * c.S]; };
  }
  var MOTIFS = {
    birth: function (B, c) {
      var p = M(c), S = c.S;
      B.line('draw', [p(-135, -82), p(-112, -22), p(-60, 8), p(60, 8), p(112, -22), p(135, -82)], { w: 5.6 });
      B.line('draw', [p(-150, -84), p(0, -90), p(150, -80)], { w: 5.2 });
      B.dot('draw', p(-40, -112)[0], p(-40, -112)[1], 13 * clamp(S, 0.7, 1.2));
      B.line('draw', [p(-122, -84), p(-70, -104), p(-10, -88), p(58, -106), p(118, -84)], { w: 4.6 });
      B.ticks('draw', p(-40, -112)[0], p(-40, -112)[1], 26 * S, 44 * S, -2.5, -0.6, 4, { w: 3 });
      B.line('draw', [p(-150, 34), p(0, 46), p(150, 32)], { w: 4.6 });
      B.circle('draw', p(170, -400)[0], p(170, -400)[1], 46 * S, { sweep: Math.PI * 1.25, a0: -2.2, w: 4.6 });
      B.line('draw', starPts(p(-190, -330)[0], p(-190, -330)[1], 28 * S, 0.1), { w: 3.8, sharp: true, color: 'accent' });
      B.sparkle('fx', p(-80, -470)[0], p(-80, -470)[1], 12 * S);
      B.hatch('hatch', [p(-120, -76), p(120, -74), p(100, -20), p(55, 2), p(-55, 2), p(-100, -20)], { angle: 1.1, max: 12 });
      B.hatch('hatch', ellipsePoly(c.cx, c.gy + 44 * S, 150 * S, 14 * S, 14), { angle: 0.08, gap: 7, max: 4 });
    },
    steps: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 360);
      for (var i = 0; i < 5; i++) {
        var fx = -330 + i * 58, fy = -8 + (i % 2 ? 10 : -6);
        B.circle('draw', p(fx, fy)[0], p(fx, fy)[1], 9 * S, { ry: 14 * S, w: 3.4, doubled: false });
      }
      var f = figure(B, c.cx + 80 * S, c.gy, Math.max(1, c.age), S, { pose: 'out', legs: 'walk', dir: 1 });
      B.line('fx', [[f.cx - f.h * 0.55, c.gy - f.h * 0.12], [f.cx - f.h * 0.62, c.gy - f.h * 0.3]], { w: 3 });
      B.line('fx', [[f.cx + f.h * 0.55, c.gy - f.h * 0.12], [f.cx + f.h * 0.62, c.gy - f.h * 0.3]], { w: 3 });
      B.bubble('fx', f.cx + 120 * S, f.top - 60 * S, 44 * S, 36 * S, [f.cx + 30 * S, f.top - 12 * S], '!');
    },
    kinder: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 380);
      var h0 = p(-280, -210);
      B.box('draw', h0[0], h0[1], 220 * S, 210 * S, { w: 5.2 });
      B.poly('draw', [p(-300, -205), p(-170, -330), p(-40, -205)], { w: 5.6 });
      B.box('draw', p(-200, -110)[0], p(-200, -110)[1], 60 * S, 110 * S, { w: 4.4 });
      B.circle('draw', p(-110, -150)[0], p(-110, -150)[1], 22 * S, { w: 4 });
      B.hatch('hatch', [p(-285, -208), p(-170, -318), p(-55, -208)], { angle: -0.7, max: 12 });
      var f = figure(B, c.cx + 130 * S, c.gy, c.age, S, { pose: 'reach', dir: 1, pack: true });
      var bx = f.handF[0] + 30 * S, by = f.handF[1] - 190 * S;
      B.line('draw', [f.handF, [f.handF[0] + 16 * S, f.handF[1] - 80 * S], [bx, by + 58 * S]], { w: 3, doubled: false });
      B.circle('draw', bx, by, 44 * S, { ry: 56 * S, w: 4.6 });
      B.hatch('hatch', ellipsePoly(bx + 12 * S, by + 10 * S, 26 * S, 38 * S, 12), { angle: 0.8, max: 6 });
    },
    school: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 420);
      var b0 = p(-340, -300);
      B.box('draw', b0[0], b0[1], 430 * S, 300 * S, { w: 5.4 });
      B.poly('draw', [p(90, -300), p(150, -330), p(150, -28), p(90, 0)], { w: 5 });
      B.box('draw', p(-165, -410)[0], p(-165, -410)[1], 90 * S, 110 * S, { w: 5 });
      B.circle('draw', p(-120, -360)[0], p(-120, -360)[1], 24 * S, { w: 4 });
      B.poly('draw', [p(-120, -374), p(-120, -360), p(-108, -354)], { w: 3.4, doubled: false });
      B.line('draw', [p(-120, -410), p(-121, -500)], { w: 4.2 });
      B.poly('draw', [p(-120, -500), p(-62, -484), p(-120, -466)], { w: 4.2, color: 'accent' });
      for (var r = 0; r < 2; r++) for (var k = 0; k < 4; k++) {
        if (k === 1 && r === 1) continue;
        B.box('draw', p(-310 + k * 100, -250 + r * 110)[0], p(-310 + k * 100, -250 + r * 110)[1], 52 * S, 52 * S, { w: 3.4, ov: 3 });
      }
      B.box('draw', p(-235, -110)[0], p(-235, -110)[1], 70 * S, 110 * S, { w: 4.2 });
      B.hatch('hatch', [p(92, -296), p(148, -324), p(148, -32), p(92, -4)], { angle: 0.25, gap: 11, max: 14 });
      figure(B, c.cx + 260 * S, c.gy, c.age, S, { pose: 'down', dir: -1, pack: true });
      // 흩날리는 꽃잎
      for (var i = 0; i < 4; i++) {
        var q = p(-40 + i * 90, -560 + (i % 2) * 60), a = 0.6 + i * 0.7;
        B.line('fx', ellipsePts(q[0], q[1], 9 * S, 5 * S, a, a + TAU * 1.02, 12), { w: 2.8, sharp: true, doubled: false, taperIn: 0.5, taperOut: 0.5 });
      }
    },
    friend: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 340);
      var a = figure(B, c.cx - 80 * S, c.gy, c.age, S, { pose: 'hold', dir: 1 });
      var b = figure(B, c.cx + 80 * S, c.gy, c.age, S, { pose: 'hold', dir: -1 });
      B.line('draw', [a.handF, [(a.handF[0] + b.handF[0]) / 2, a.handF[1] + 6 * S], b.handF], { w: 4.4, doubled: false });
      var k = p(220, -520);
      B.poly('draw', [[k[0], k[1] - 70 * S], [k[0] + 52 * S, k[1]], [k[0], k[1] + 80 * S], [k[0] - 52 * S, k[1]], [k[0], k[1] - 70 * S]], { w: 4.6 });
      B.line('draw', [[k[0], k[1] - 70 * S], [k[0], k[1] + 80 * S]], { w: 3, doubled: false });
      B.line('draw', [[k[0] - 52 * S, k[1]], [k[0] + 52 * S, k[1]]], { w: 3, doubled: false });
      B.line('draw', [[k[0], k[1] + 80 * S], [k[0] - 20 * S, k[1] + 150 * S], [k[0] + 10 * S, k[1] + 210 * S], [k[0] - 10 * S, k[1] + 260 * S]], { w: 3.2 });
      B.dashed('fx', [[b.cx + b.bw * 0.7, b.sh + b.h * 0.24], [k[0] - 30 * S, k[1] + 160 * S], [k[0] - 4 * S, k[1] + 82 * S]], { w: 2.4, dash: 10, gapL: 9 });
      B.cloud('fx', p(-250, -470)[0], p(-250, -470)[1], 150 * S);
      B.hatch('hatch', [[k[0], k[1] - 70 * S], [k[0] + 52 * S, k[1]], [k[0], k[1]]], { angle: 1.2, max: 6 });
    },
    teen: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 300);
      var f = figure(B, c.cx - 60 * S, c.gy, c.age, S, { pose: 'down', dir: 1 });
      B.circle('draw', f.head[0], f.head[1] - f.hr * 0.1, f.hr * 1.35, { sweep: Math.PI * 1.05, a0: Math.PI * 1.0, w: 4.6 });
      B.box('draw', f.head[0] - f.hr * 1.55, f.head[1] - f.hr * 0.3, f.hr * 0.42, f.hr * 0.75, { w: 3.6, ov: 2 });
      B.box('draw', f.head[0] + f.hr * 1.13, f.head[1] - f.hr * 0.3, f.hr * 0.42, f.hr * 0.75, { w: 3.6, ov: 2 });
      var t = [f.cx + 190 * S, f.top - 150 * S];
      B.cloud('draw', t[0], t[1] + 40 * S, 240 * S);
      B.circle('fx', f.cx + 50 * S, f.top - 30 * S, 9 * S, { w: 3 });
      B.circle('fx', f.cx + 84 * S, f.top - 60 * S, 14 * S, { w: 3.4 });
      B.symbol('fx', '?', t[0] - 30 * S, t[1] - 20 * S, 52 * S);
      B.symbol('fx', 'note', t[0] + 58 * S, t[1] - 16 * S, 40 * S);
    },
    love: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 330);
      var a = figure(B, c.cx - 110 * S, c.gy, c.age, S, { pose: 'hold', dir: 1 });
      var b = figure(B, c.cx + 110 * S, c.gy, c.age, S, { pose: 'down', dir: -1 });
      var hy = Math.min(a.top, b.top) - 120 * S;
      B.line('draw', heartPts(c.cx, hy, 70 * S), { w: 5.2, color: 'accent', sharp: true });
      B.hatch('hatch', heartPts(c.cx, hy, 60 * S), { angle: 0.85, gap: 11, color: 'accent', max: 12 });
      B.line('fx', heartPts(c.cx + 110 * S, hy - 90 * S, 26 * S), { w: 3.6, color: 'accent', sharp: true });
      B.ticks('fx', c.cx, hy, 92 * S, 118 * S, -2.6, -0.5, 3, { w: 3 });
    },
    exam: function (B, c) {
      var p = M(c), S = c.S, rng = B.rng;
      ground(B, c.cx, c.gy, S, 360);
      var y = 0;
      for (var i = 0; i < 6; i++) {
        var bh = rng.range(36, 50), bw = rng.range(180, 230), off = rng.range(-18, 18);
        var q = p(-150 - bw / 2 + off, y - bh);
        B.box('draw', q[0], q[1], bw * S, bh * S, { w: 4.2, ov: 3 });
        B.line('draw', [[q[0] + bw * S * 0.12, q[1] + 6 * S], [q[0] + bw * S * 0.12, q[1] + bh * S - 6 * S]], { w: 2.6, doubled: false });
        if (i % 2 === 0) B.hatch('hatch', rectPoly(q[0] + bw * S * 0.16, q[1] + 4 * S, bw * S * 0.8, bh * S - 8 * S), { angle: 0.7, gap: 12, max: 6 });
        y -= bh;
      }
      var f = figure(B, c.cx + 120 * S, c.gy, c.age, S, { pose: 'hips', dir: -1, knock: true });
      B.bubble('fx', f.cx + 110 * S, f.top - 70 * S, 52 * S, 38 * S, [f.cx + 30 * S, f.top - 10 * S], 'dots');
      B.circle('draw', p(230, -520)[0], p(230, -520)[1], 40 * S, { w: 4.2 });
      B.poly('draw', [p(230, -546), p(230, -520), p(250, -508)], { w: 3.4, doubled: false });
    },
    military: function (B, c) {
      var p = M(c), S = c.S;
      B.poly('draw', [p(-400, -150), p(-290, -300), p(-200, -200), p(-80, -360), p(40, -210), p(140, -280), p(260, -170), p(400, -240)], { w: 4.4 });
      ground(B, c.cx, c.gy, S, 380);
      B.hatch('hatch', [p(-290, -290), p(-200, -196), p(-80, -350), p(-150, -250)], { angle: -0.6, gap: 12, max: 8 });
      var f = figure(B, c.cx - 80 * S, c.gy, c.age, S, { pose: 'salute', dir: 1, noHair: true });
      var e = p(190, -470);
      B.box('draw', e[0] - 80 * S, e[1] - 52 * S, 160 * S, 104 * S, { w: 4.4 });
      B.poly('draw', [[e[0] - 76 * S, e[1] - 48 * S], [e[0], e[1] + 8 * S], [e[0] + 76 * S, e[1] - 48 * S]], { w: 3.6 });
      B.line('fx', heartPts(e[0] + 50 * S, e[1] + 22 * S, 14 * S), { w: 3, color: 'accent', sharp: true });
      for (var i = 0; i < 3; i++) B.line('fx', [[e[0] - 110 * S - i * 12 * S, e[1] - 30 * S + i * 28 * S], [e[0] - 160 * S - i * 14 * S, e[1] - 26 * S + i * 30 * S]], { w: 3, doubled: false });
      void f;
    },
    gapyear: function (B, c) {
      var p = M(c), S = c.S;
      B.poly('draw', [p(-420, -190), p(-320, -300), p(-240, -230), p(-150, -330), p(-60, -220)], { w: 4 });
      ground(B, c.cx, c.gy, S, 400);
      B.line('draw', [p(40, 0), p(70, -70), p(30, -140), p(80, -200)], { w: 3.6 });
      B.line('draw', [p(180, 0), p(150, -70), p(170, -140), p(110, -200)], { w: 3.6 });
      B.line('draw', [p(-250, 0), p(-252, -250)], { w: 5 });
      B.poly('draw', [p(-250, -240), p(-150, -240), p(-120, -214), p(-150, -190), p(-250, -190)], { w: 4.2 });
      B.poly('draw', [p(-252, -170), p(-340, -170), p(-366, -146), p(-340, -122), p(-252, -122)], { w: 4.2 });
      figure(B, c.cx - 60 * S, c.gy, c.age, S, { pose: 'down', dir: 1, pack: true, legs: 'walk' });
      B.circle('fx', p(250, -470)[0], p(250, -470)[1], 38 * S, { w: 4, color: 'accent' });
    },
    college: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 400);
      B.poly('draw', [p(-360, -300), p(-170, -390), p(20, -300), p(-360, -300)], { w: 5.2 });
      for (var i = 0; i < 4; i++) B.line('draw', [p(-320 + i * 100, -290), p(-320 + i * 100, -30)], { w: 4.6 });
      B.line('draw', [p(-370, -20), p(30, -18)], { w: 5 });
      B.line('draw', [p(-385, -2), p(45, 0)], { w: 5 });
      B.hatch('hatch', [p(-330, -306), p(-170, -380), p(-10, -306)], { angle: -0.4, gap: 12, max: 10 });
      var f = figure(B, c.cx + 190 * S, c.gy, c.age, S, { pose: 'up', dir: -1 });
      var cp = [f.cx + 40 * S, f.top - 200 * S];
      B.poly('draw', [[cp[0] - 70 * S, cp[1]], [cp[0], cp[1] - 26 * S], [cp[0] + 70 * S, cp[1]], [cp[0], cp[1] + 26 * S], [cp[0] - 70 * S, cp[1]]], { w: 4.6 });
      B.line('draw', [[cp[0], cp[1]], [cp[0] + 40 * S, cp[1] + 30 * S], [cp[0] + 44 * S, cp[1] + 70 * S]], { w: 3 });
      B.hatch('hatch', [[cp[0] - 60 * S, cp[1]], [cp[0], cp[1] - 22 * S], [cp[0] + 60 * S, cp[1]], [cp[0], cp[1] + 22 * S]], { angle: 1.3, gap: 8, max: 8 });
      B.ticks('fx', cp[0], cp[1], 90 * S, 118 * S, -2.8, -0.3, 4, { w: 3 });
    },
    parttime: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 380);
      B.line('draw', [p(-270, -40), p(-10, -40)], { w: 5 });
      B.line('draw', [p(-230, -210), p(-222, -110), p(-190, -62), p(-110, -58), p(-78, -108), p(-70, -210)], { w: 5.4 });
      B.line('draw', [p(-236, -212), p(-64, -212)], { w: 4.6 });
      B.circle('draw', p(-50, -150)[0], p(-50, -150)[1], 30 * S, { sweep: Math.PI * 1.3, a0: -1.9, w: 4.6 });
      B.circle('draw', p(-150, -36)[0], p(-150, -36)[1], 130 * S, { ry: 16 * S, w: 4.2, sweep: TAU * 1.02 });
      for (var i = 0; i < 3; i++) {
        var sx = -190 + i * 42;
        B.line('fx', [p(sx, -240), p(sx + 14, -275), p(sx - 6, -310), p(sx + 10, -350)], { w: 3.2 });
      }
      B.hatch('hatch', [p(-218, -200), p(-80, -200), p(-90, -110), p(-115, -70), p(-185, -70), p(-212, -110)], { angle: 0.9, max: 10 });
      var f = figure(B, c.cx + 160 * S, c.gy, c.age, S, { pose: 'down', dir: -1 });
      B.box('draw', f.cx - f.bw * 0.55, f.sh + f.h * 0.1, f.bw * 1.1, f.h * 0.28, { w: 3.4, ov: 2 });
    },
    job: function (B, c) {
      var p = M(c), S = c.S, rng = B.rng;
      ground(B, c.cx, c.gy, S, 420);
      var x = -420;
      var tall = [260, 420, 330, 500, 290, 380];
      for (var i = 0; i < 6; i++) {
        var bw = rng.range(100, 140), bh = tall[i] * rng.range(0.9, 1.08);
        var q = p(x, -bh);
        B.box('draw', q[0], q[1], bw * S, bh * S, { w: 4.4, ov: 4 });
        if (i % 2 === 1) B.hatch('hatch', rectPoly(q[0] + 4, q[1] + 6, bw * S - 8, bh * S - 12), { angle: 0.6, gap: 14, max: 12, wMul: 0.9 });
        else for (var r = 0; r < 3; r++) B.dot('fx', q[0] + bw * S * (0.3 + 0.4 * (r % 2)), q[1] + bh * S * (0.2 + r * 0.18), 3.6);
        x += bw + rng.range(-6, 10);
      }
      var f = figure(B, c.cx + 10 * S, c.gy, c.age, S, { pose: 'down', dir: 1, knock: true });
      B.box('draw', f.handF[0] - 8 * S, f.handF[1], 58 * S, 40 * S, { w: 4.2 });
    },
    ownplace: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 360);
      var d = p(-260, -360);
      B.box('draw', d[0], d[1], 180 * S, 360 * S, { w: 5.2 });
      B.dot('draw', p(-110, -180)[0], p(-110, -180)[1], 6);
      B.box('draw', p(-200, -330)[0], p(-200, -330)[1], 60 * S, 30 * S, { w: 3.2, ov: 2 });
      B.hatch('hatch', rectPoly(d[0] + 10, d[1] + 70 * S, 40 * S, 270 * S), { angle: 1.3, gap: 10, max: 10 });
      var f = figure(B, c.cx + 120 * S, c.gy, c.age, S, { pose: 'reach', dir: 1 });
      var k = [f.handF[0] + 14 * S, f.handF[1] - 40 * S];
      B.circle('draw', k[0], k[1], 30 * S, { w: 4.6, color: 'accent' });
      B.poly('draw', [[k[0], k[1] + 30 * S], [k[0], k[1] + 120 * S], [k[0] + 24 * S, k[1] + 120 * S]], { w: 4.6, color: 'accent' });
      B.line('draw', [[k[0], k[1] + 92 * S], [k[0] + 20 * S, k[1] + 92 * S]], { w: 4, color: 'accent' });
      B.ticks('fx', k[0], k[1], 48 * S, 70 * S, -2.8, -0.4, 4, { w: 3 });
    },
    move: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 380);
      var boxes = [[-380, -150, 170, 150], [-200, -130, 150, 130], [-330, -270, 150, 120]];
      boxes.forEach(function (b, i) {
        var q = p(b[0], b[1]);
        B.box('draw', q[0], q[1], b[2] * S, b[3] * S, { w: 4.8 });
        B.line('draw', [[q[0] + b[2] * S * 0.5, q[1]], [q[0] + b[2] * S * 0.5, q[1] + b[3] * S * 0.35]], { w: 3.4, doubled: false });
        if (i !== 1) B.hatch('hatch', rectPoly(q[0] + b[2] * S * 0.62, q[1] + 8, b[2] * S * 0.32, b[3] * S - 16), { angle: 1.2, gap: 10, max: 8 });
      });
      B.poly('fx', [p(-300, -50), p(-300, -100), p(-316, -84)], { w: 3.2 });
      B.poly('fx', [p(-300, -100), p(-284, -84)], { w: 3.2 });
      var f = figure(B, c.cx + 160 * S, c.gy, c.age, S, { pose: 'carry', dir: -1, legs: 'walk' });
      B.box('draw', f.handF[0] - 70 * S, f.handF[1] - 60 * S, 90 * S, 76 * S, { w: 4.6 });
    },
    travel: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 400);
      B.cloud('draw', p(-220, -420)[0], p(-220, -420)[1], 190 * S);
      B.cloud('draw', p(200, -300)[0], p(200, -300)[1], 150 * S);
      var a = p(60, -520);
      B.line('draw', [[a[0] - 130 * S, a[1] + 10 * S], [a[0] - 40 * S, a[1] - 2 * S], [a[0] + 110 * S, a[1] - 20 * S], [a[0] + 140 * S, a[1] - 14 * S], [a[0] + 110 * S, a[1] + 2 * S], [a[0] - 20 * S, a[1] + 20 * S], [a[0] - 130 * S, a[1] + 10 * S]], { w: 5 });
      B.poly('draw', [[a[0] - 10 * S, a[1] + 6 * S], [a[0] - 70 * S, a[1] + 80 * S], [a[0] - 30 * S, a[1] + 80 * S], [a[0] + 50 * S, a[1] + 4 * S]], { w: 4.6 });
      B.poly('draw', [[a[0] - 20 * S, a[1]], [a[0] + 30 * S, a[1] - 60 * S], [a[0] + 60 * S, a[1] - 60 * S], [a[0] + 40 * S, a[1] - 8 * S]], { w: 4.2 });
      B.poly('draw', [[a[0] - 110 * S, a[1] + 8 * S], [a[0] - 140 * S, a[1] - 40 * S], [a[0] - 116 * S, a[1] - 40 * S], [a[0] - 86 * S, a[1] + 4 * S]], { w: 4.2 });
      B.dashed('fx', [[a[0] - 150 * S, a[1] + 12 * S], [a[0] - 280 * S, a[1] + 60 * S], [a[0] - 400 * S, a[1] + 20 * S]], { w: 2.8, dash: 14, gapL: 11 });
      var f = figure(B, c.cx - 200 * S, c.gy, c.age, S, { pose: 'wave', dir: 1 });
      B.box('draw', f.cx - f.bw * 2.6, c.gy - 90 * S, 70 * S, 90 * S, { w: 4.4 });
      B.line('draw', [[f.cx - f.bw * 2.6 + 20 * S, c.gy - 90 * S], [f.cx - f.bw * 2.6 + 24 * S, c.gy - 110 * S], [f.cx - f.bw * 2.6 + 50 * S, c.gy - 110 * S], [f.cx - f.bw * 2.6 + 50 * S, c.gy - 90 * S]], { w: 3.6 });
      B.hatch('hatch', [[a[0] - 20 * S, a[1] + 8 * S], [a[0] + 100 * S, a[1] - 8 * S], [a[0] + 104 * S, a[1] + 4 * S], [a[0] - 16 * S, a[1] + 18 * S]], { angle: 0.1, gap: 6, max: 4 });
    },
    pet: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 360);
      var f = figure(B, c.cx - 140 * S, c.gy, c.age, S, { pose: 'hold', dir: 1 });
      var d = p(120, 0);
      B.line('draw', [[d[0] - 70 * S, d[1]], [d[0] - 76 * S, d[1] - 60 * S], [d[0] - 40 * S, d[1] - 110 * S], [d[0] + 30 * S, d[1] - 110 * S], [d[0] + 60 * S, d[1] - 70 * S], [d[0] + 64 * S, d[1]]], { w: 5.2 });
      B.circle('draw', d[0] + 40 * S, d[1] - 150 * S, 44 * S, { w: 5 });
      B.line('draw', [[d[0] + 12 * S, d[1] - 180 * S], [d[0] - 14 * S, d[1] - 150 * S], [d[0] - 4 * S, d[1] - 110 * S]], { w: 4.6 });
      B.dot('draw', d[0] + 58 * S, d[1] - 158 * S, 4.4);
      B.dot('draw', d[0] + 86 * S, d[1] - 138 * S, 6);
      B.line('draw', [[d[0] - 72 * S, d[1] - 30 * S], [d[0] - 120 * S, d[1] - 60 * S], [d[0] - 130 * S, d[1] - 100 * S]], { w: 4.2 });
      B.line('draw', [[d[0] - 10 * S, d[1] - 20 * S], [d[0] - 6 * S, d[1]]], { w: 4 });
      B.line('draw', [[d[0] + 30 * S, d[1] - 20 * S], [d[0] + 34 * S, d[1]]], { w: 4 });
      B.ticks('fx', d[0] - 130 * S, d[1] - 100 * S, 18 * S, 34 * S, -2.9, -1.9, 2, { w: 2.8 });
      B.hatch('hatch', [[d[0] - 60 * S, d[1] - 50 * S], [d[0] - 30 * S, d[1] - 100 * S], [d[0] + 20 * S, d[1] - 100 * S], [d[0] + 50 * S, d[1] - 60 * S], [d[0] + 50 * S, d[1] - 8 * S], [d[0] - 60 * S, d[1] - 8 * S]], { angle: 1.1, gap: 12, max: 8 });
      B.bubble('fx', d[0] + 110 * S, d[1] - 250 * S, 42 * S, 34 * S, [d[0] + 60 * S, d[1] - 200 * S], 'heart');
      void f;
    },
    wedding: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 330);
      var a = figure(B, c.cx - 80 * S, c.gy, c.age, S, { pose: 'hold', dir: 1 });
      var b = figure(B, c.cx + 80 * S, c.gy, c.age, S, { pose: 'hold', dir: -1 });
      B.line('draw', [a.handF, [c.cx, a.handF[1] + 8 * S], b.handF], { w: 4.2, doubled: false });
      B.circle('draw', b.head[0] + 4 * S, b.head[1] + 4 * S, b.hr * 1.5, { sweep: Math.PI * 0.95, a0: -Math.PI * 0.05, w: 3.2 });
      var ry = Math.min(a.top, b.top) - 130 * S;
      B.circle('draw', c.cx - 30 * S, ry, 44 * S, { w: 5, color: 'accent' });
      B.circle('draw', c.cx + 30 * S, ry, 44 * S, { w: 5, color: 'accent' });
      B.sparkle('fx', c.cx - 110 * S, ry - 50 * S, 16 * S);
      B.sparkle('fx', c.cx + 120 * S, ry - 20 * S, 12 * S);
      B.sparkle('fx', c.cx + 70 * S, ry - 90 * S, 9 * S);
      var bq = a.handB;
      B.circle('fx', bq[0], bq[1] - 18 * S, 20 * S, { w: 3.6 });
      B.hatch('fx', ellipsePoly(bq[0], bq[1] - 18 * S, 16 * S, 16 * S, 10), { angle: 0.7, gap: 7, max: 4 });
    },
    baby: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 330);
      var a = figure(B, c.cx - 70 * S, c.gy, c.age, S, { pose: 'hold', dir: 1 });
      var b = figure(B, c.cx + 80 * S, c.gy, 2, S, { pose: 'reach', dir: -1 });
      B.line('draw', [a.handF, [(a.handF[0] + b.handF[0]) / 2, (a.handF[1] + b.handF[1]) / 2 + 10 * S], b.handF], { w: 4, doubled: false });
      B.line('fx', heartPts(c.cx + 10 * S, a.top - 70 * S, 34 * S), { w: 4.4, color: 'accent', sharp: true });
      B.ticks('fx', c.cx + 10 * S, a.top - 70 * S, 48 * S, 66 * S, -2.6, -0.5, 3, { w: 2.8 });
      void p;
    },
    newjob: function (B, c) {
      var p = M(c), S = c.S;
      B.line('draw', [p(-420, -260), p(420, -262)], { w: 4.2 });
      B.line('draw', [p(-200, 20), p(-40, -140), p(-120, -262)], { w: 4.8 });
      B.line('draw', [p(200, 20), p(40, -140), p(120, -262)], { w: 4.8 });
      B.line('draw', [p(-30, -150), p(0, -175), p(30, -150)], { w: 4 });
      B.line('draw', [p(-4, -175), p(-2, -262)], { w: 3 });
      B.line('draw', [p(270, -40), p(268, -250)], { w: 5 });
      B.poly('draw', [p(268, -240), p(370, -240), p(396, -216), p(370, -192), p(268, -192)], { w: 4.2 });
      B.poly('draw', [p(268, -170), p(180, -170), p(154, -146), p(180, -122), p(268, -122)], { w: 4.2 });
      B.hatch('hatch', [p(-200, 20), p(-40, -140), p(-60, -160), p(-240, 20)], { angle: -0.8, gap: 10, max: 10 });
      figure(B, c.cx - 70 * S, c.gy - 30 * S, c.age, S * 0.78, { pose: 'down', dir: 1, legs: 'walk', noShadow: true });
    },
    startup: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 420);
      var s0 = p(-360, -330);
      B.box('draw', s0[0], s0[1], 440 * S, 330 * S, { w: 5.2 });
      var aw = [];
      for (var i = 0; i <= 6; i++) aw.push(p(-380 + i * 80, -360 + (i % 2 ? 26 : 0)));
      B.line('draw', [p(-380, -400), p(100, -400)], { w: 4.6 });
      B.poly('draw', [p(-380, -400)].concat(aw.map(function (q, j) { return j % 2 ? q : [q[0], q[1] - 4]; })), { w: 4.6 });
      for (var k = 0; k < 6; k += 2) B.hatch('hatch', [p(-380 + k * 80, -398), p(-300 + k * 80, -398), p(-300 + k * 80, -334), p(-380 + k * 80, -360)], { angle: 1.4, gap: 9, max: 8 });
      B.box('draw', p(-320, -260)[0], p(-320, -260)[1], 200 * S, 150 * S, { w: 4.2 });
      B.box('draw', p(-70, -200)[0], p(-70, -200)[1], 100 * S, 200 * S, { w: 4.2 });
      B.box('draw', p(-275, -225)[0], p(-275, -225)[1], 110 * S, 44 * S, { w: 3.2, ov: 2, color: 'accent' });
      B.line('fx', [p(-262, -202), p(-240, -210), p(-220, -198), p(-196, -208), p(-178, -200)], { w: 2.8, color: 'accent', doubled: false });
      figure(B, c.cx + 250 * S, c.gy, c.age, S, { pose: 'hips', dir: -1 });
    },
    challenge: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 430);
      B.poly('draw', [p(-430, 0), p(-40, -560), p(380, 0)], { w: 5.6 });
      B.poly('draw', [p(-150, -400), p(-110, -380), p(-80, -420), p(-50, -380), p(-10, -410), p(40, -450)], { w: 4 });
      B.line('draw', [p(-40, -560), p(-38, -660)], { w: 4.2 });
      B.poly('draw', [p(-38, -660), p(30, -640), p(-38, -616)], { w: 4.2, color: 'accent' });
      B.hatch('hatch', [p(-40, -548), p(370, -8), p(160, -8)], { angle: 0.35, gap: 12, max: 16 });
      var sx = 170, sy = -560 * (380 - sx) / 420;
      figure(B, c.cx + sx * S, c.gy + sy * S, c.age, S * 0.62, { pose: 'reach', dir: -1, noShadow: true, noHatch: true, knock: true });
    },
    today: function (B, c) {
      var p = M(c), S = c.S;
      B.line('draw', [p(-440, 0), p(440, -2)], { w: 5 });
      var sc = p(170, 0);
      B.line('draw', ellipsePts(sc[0], sc[1] - 4, 120 * S, 116 * S, Math.PI, TAU, 22), { w: 5.4, color: 'accent', sharp: true });
      B.ticks('draw', sc[0], sc[1] - 4, 150 * S, 210 * S, Math.PI + 0.35, TAU - 0.35, 5, { w: 4, color: 'accent' });
      for (var i = 0; i < 4; i++) B.line('hatch', [p(90 + i * 18 - i * i * 4, 26 + i * 18), p(250 - i * 16 + i * i * 3, 28 + i * 18)], { w: 3, doubled: false, color: 'accent' });
      var f = figure(B, c.cx - 150 * S, c.gy, Math.max(1, c.age), S, { pose: 'up', dir: 1 });
      B.line('fx', [p(-20, -440), p(0, -420), p(22, -444)], { w: 3.4 });
      B.line('fx', [p(50, -500), p(66, -484), p(84, -504)], { w: 3 });
      B.line('fx', [p(-300, -380), p(-286, -366), p(-270, -384)], { w: 3 });
      void f;
    },
    custom: function (B, c) {
      var p = M(c), S = c.S;
      ground(B, c.cx, c.gy, S, 340);
      var f = figure(B, c.cx - 110 * S, c.gy, Math.max(1, c.age), S, { pose: 'reach', dir: 1 });
      var st = [f.cx + 240 * S, f.top - 150 * S];
      B.line('draw', starPts(st[0], st[1], 74 * S, 0.12), { w: 5.2, sharp: true, color: 'accent' });
      B.hatch('hatch', starPts(st[0], st[1], 60 * S, 0.12), { angle: 0.9, gap: 10, max: 8, color: 'accent' });
      B.sparkle('fx', st[0] - 120 * S, st[1] - 60 * S, 14 * S);
      B.sparkle('fx', st[0] + 100 * S, st[1] + 70 * S, 10 * S);
      B.ticks('fx', st[0], st[1], 96 * S, 124 * S, 2.3, 3.6, 3, { w: 3 });
    }
  };

  // ---------------------------------------------------------------
  // 페이지 / 패널 배치
  // ---------------------------------------------------------------
  function frameBox(hd, timeline) { return { x0: 64, x1: 1016, y0: 100, y1: hd - (timeline ? 206 : 70) }; }
  function quadBox(q) {
    var x0 = Math.max(q[0][0], q[3][0]), x1 = Math.min(q[1][0], q[2][0]);
    var y0 = Math.max(q[0][1], q[1][1]), y1 = Math.min(q[2][1], q[3][1]);
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function jq(rng, p, a) { return [p[0] + rng.range(-a, a), p[1] + rng.range(-a, a)]; }
  function panelQuads(n, F, rng) {
    var g = 34, x0 = F.x0, x1 = F.x1, y0 = F.y0, y1 = F.y1, J = 5;
    if (n === 1) return [[jq(rng, [x0, y0], J), jq(rng, [x1, y0], J), jq(rng, [x1, y1], J), jq(rng, [x0, y1], J)]];
    if (n === 2) {
      var ym = y0 + (y1 - y0) * rng.range(0.45, 0.55), tl = rng.range(-30, 30);
      return [
        [jq(rng, [x0, y0], J), jq(rng, [x1, y0], J), [x1, ym + tl - g / 2], [x0, ym - tl - g / 2]],
        [[x0, ym - tl + g / 2], [x1, ym + tl + g / 2], jq(rng, [x1, y1], J), jq(rng, [x0, y1], J)]
      ];
    }
    var topWide = rng() < 0.55;
    var ys = y0 + (y1 - y0) * (topWide ? rng.range(0.38, 0.44) : rng.range(0.56, 0.62));
    var tl2 = rng.range(-16, 16), xm = x0 + (x1 - x0) * rng.range(0.46, 0.54), tx = rng.range(-24, 24);
    function gy(x, off) { return ys + off + tl2 * ((x - x0) / (x1 - x0) * 2 - 1); }
    if (topWide) {
      return [
        [jq(rng, [x0, y0], J), jq(rng, [x1, y0], J), [x1, gy(x1, -g / 2)], [x0, gy(x0, -g / 2)]],
        [[x0, gy(x0, g / 2)], [xm - tx - g / 2, gy(xm - tx - g / 2, g / 2)], [xm + tx - g / 2, y1], jq(rng, [x0, y1], J)],
        [[xm - tx + g / 2, gy(xm - tx + g / 2, g / 2)], [x1, gy(x1, g / 2)], jq(rng, [x1, y1], J), [xm + tx + g / 2, y1]]
      ];
    }
    return [
      [jq(rng, [x0, y0], J), [xm + tx - g / 2, y0], [xm - tx - g / 2, gy(xm - tx - g / 2, -g / 2)], [x0, gy(x0, -g / 2)]],
      [[xm + tx + g / 2, y0], jq(rng, [x1, y0], J), [x1, gy(x1, -g / 2)], [xm - tx + g / 2, gy(xm - tx + g / 2, -g / 2)]],
      [[x0, gy(x0, g / 2)], [x1, gy(x1, g / 2)], jq(rng, [x1, y1], J), jq(rng, [x0, y1], J)]
    ];
  }

  function layoutPages(plan, hd, opts) {
    var rng = Rng(mix(plan.seed, 0xA11CE));
    var F = frameBox(hd, opts.timeline);
    var sc = plan.scenes;
    var todayIdx = -1, endIdx = -1;
    sc.forEach(function (s, i) { if (s.key === 'today') todayIdx = i; if (s.key === 'end') endIdx = i; });
    var groups = [[0]];
    var mids = [];
    for (var i = 1; i < todayIdx; i++) mids.push(i);
    var j = 0;
    while (j < mids.length) {
      var rem = mids.length - j, r = rng();
      var size = r < 0.2 ? 1 : r < 0.66 ? 2 : 3;
      if (size > rem) size = rem;
      groups.push(mids.slice(j, j + size));
      j += size;
    }
    if (todayIdx >= 0) groups.push([todayIdx]);
    if (endIdx >= 0) groups.push([endIdx]);
    var sceneToPage = {}, sceneSlot = {};
    var pages = groups.map(function (g, pi) {
      var kind = sc[g[0]].key === 'end' ? 'end' : 'panels';
      g.forEach(function (si, k) { sceneToPage[si] = pi; sceneSlot[si] = k; });
      var last = sc[g[g.length - 1]];
      return {
        index: pi, scenes: g, kind: kind,
        quads: kind === 'end' ? [] : panelQuads(g.length, F, rng),
        trans: pi === 0 ? (opts.loop ? 'flip' : 'none') : (kind === 'end' ? 'wipe' : 'flip'),
        t0: sc[g[0]].t0, t1: last.t0 + last.dur
      };
    });
    return { F: F, hd: hd, pages: pages, sceneToPage: sceneToPage, sceneSlot: sceneSlot };
  }

  function buildPanelScene(B, plan, s, page, slot, L) {
    var rng = B.rng, q = page.quads[slot], box = quadBox(q), pen = B.pen;
    B.clip = null;
    var sides = [[0, 1], [1, 2], [2, 3], [3, 0]];
    sides.forEach(function (e) {
      var a = q[e[0]], b = q[e[1]], L0 = dist(a, b), ux = (b[0] - a[0]) / L0, uy = (b[1] - a[1]) / L0;
      var o0 = rng.range(2, 12), o1 = rng.range(4, 16);
      var mid = [lerp(a[0], b[0], 0.5) + rng.range(-3, 3), lerp(a[1], b[1], 0.5) + rng.range(-3, 3)];
      B.line('border', [[a[0] - ux * o0, a[1] - uy * o0], mid, [b[0] + ux * o1, b[1] + uy * o1]], { w: rng.range(10, 13.5), taperIn: 0.35, taperOut: 0.5, wobble: 1.25 });
    });
    var capH = 150 + (box.w < 600 ? 60 : 0);
    var S = clamp(Math.min(box.w / 700, (box.h - capH) / 640), 0.4, 1.42);
    var tall = box.h / box.w > 1.35;
    var c = { cx: box.x + box.w * 0.5, gy: box.y + box.h * (tall ? 0.74 : 0.86), S: S, box: box, age: s.age, scene: s, plan: plan };
    B.clip = q;
    var bandRoll = rng(), bandSide = rng(), bandW = rng.range(40, 78);
    if (bandRoll < (box.w < 600 ? 0.22 : 0.42)) {
      var left = bandSide < 0.5, bw = box.w < 600 ? bandW * 0.6 : bandW;
      var bx = left ? box.x + bw * 0.42 : box.x + box.w - bw * 0.42;
      var pts = [[bx + rng.range(-6, 6), box.y - 24], [bx + rng.range(-10, 10), box.y + box.h * 0.5], [bx + rng.range(-6, 6), box.y + box.h + 24]];
      if (rng() < 0.5) pts.reverse();
      if (pen.band === 'crosshatch') {
        var rx = left ? box.x - 4 : box.x + box.w - bw * 0.9;
        B.hatch('band', rectPoly(rx, box.y - 10, bw * 0.9, box.h + 20), { angle: 1.25, gap: 6, cross: true, max: 60, wMul: 0.9 });
      } else {
        B.bristle('band', pts, { w: bw, bristles: pen.band === 'graphite' ? 26 : 20, dry: rng.range(0.4, 0.68), alpha: pen.band === 'graphite' ? 0.42 : 0.92 });
      }
      if (rng() < 0.7) B.smudge('band', bx + (left ? bw : -bw) * 0.8, box.y + box.h * rng.range(0.3, 0.7), bw * 0.9, box.h * 0.2, { alpha: 0.07 });
    }
    var fn = MOTIFS[s.motif] || MOTIFS.custom;
    fn(B, c);
    var alignRight = rng() < 0.28;
    if (rng() < 0.35 && box.w > 500) {
      var ca = rng.range(120, 200) * Math.max(0.6, S), cb = rng.range(90, 150) * Math.max(0.6, S);
      var cor = alignRight ? [box.x, box.y] : [box.x + box.w, box.y], sgn = alignRight ? 1 : -1;
      B.hatch('hatch', [cor, [cor[0] + sgn * ca, cor[1]], [cor[0], cor[1] + cb]], { angle: -0.75 * sgn, gap: 12, max: 12 });
    }
    B.clip = null;
    var narrow = box.w < 600;
    var capSize = narrow ? 36 : S > 0.95 ? 46 : 40;
    B.caption('cap', {
      x: box.x - 10 + rng.range(-4, 6), y: box.y - 14 + rng.range(-4, 6), w: box.w + 20,
      maxW: Math.min(box.w * (narrow ? 0.94 : 0.74), 760), align: alignRight ? 'right' : 'left', size: capSize
    }, s.meta, s.line);
    if (slot === 0) B.text('fx', String(page.index + 1), L.F.x1 - 4, L.F.y0 - 36, { size: 30 * B.fonts.scale, align: 'right', alpha: 0.55 });
  }

  function buildEnd(B, plan, s, L) {
    var F = L.F, rng = B.rng, fs = B.fonts.scale;
    var x0 = F.x0 + 20, maxW = F.x1 - F.x0 - 40;
    var t1 = B.text('title', s.title1, x0, F.y0 + 104, { size: 78 * fs, maxW: maxW, cps: 11 });
    var size2 = 112 * fs;
    var y2 = F.y0 + 104 + (t1 ? t1.size : 78) * 0.9 + Math.min(size2, maxW) * 0.92;
    var t2 = B.text('title', s.title2, x0, y2, { size: size2, maxW: maxW, cps: 11 });
    var w2 = t2 ? t2.w : 300;
    B.line('title', [[x0 - 8, y2 + 28], [x0 + w2 * 0.45, y2 + 38], [x0 + w2 + 14, y2 + 24]], { w: 9, color: 'accent', taperIn: 0.5 });
    var py0 = y2 + 110;
    var py1 = py0 + Math.min(760, (F.y1 - py0) * 0.66);
    var q = [jq(rng, [F.x0, py0], 5), jq(rng, [F.x1, py0], 8), jq(rng, [F.x1, py1], 5), jq(rng, [F.x0, py1], 8)];
    [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(function (e) {
      var a = q[e[0]], b = q[e[1]], L0 = dist(a, b), ux = (b[0] - a[0]) / L0, uy = (b[1] - a[1]) / L0;
      B.line('border', [[a[0] - ux * 8, a[1] - uy * 8], [b[0] + ux * 12, b[1] + uy * 12]], { w: rng.range(10, 13), taperIn: 0.35, taperOut: 0.5, wobble: 1.2 });
    });
    B.clip = q;
    var box = quadBox(q);
    var people = plan.scenes.filter(function (x) { return x.key !== 'end'; });
    var n = people.length;
    var gyy = box.y + box.h * 0.78;
    var padX = 92, span = box.w - padX * 2, step = n > 1 ? span / (n - 1) : 0;
    var S = Math.min((box.h * 0.62) / 300, n > 1 ? step / 104 : 1, 0.95);
    B.line('draw', [[box.x + 30, gyy + 2], [box.x + box.w * 0.5, gyy - 2], [box.x + box.w - 30, gyy + 3]], { w: 5 });
    var tops = [];
    people.forEach(function (pp, j) {
      var x = n > 1 ? box.x + padX + step * j : box.x + box.w / 2;
      var f = figure(B, x, gyy, pp.age, S, { pose: j === n - 1 ? 'wave' : 'down', dir: 1, noShadow: true, noHatch: true });
      tops.push([x, f.top - 16]);
      B.text('hatch', String(pp.year + (plan.yearOffset || 0)), x, gyy + 52 * fs, { size: 27 * fs, align: 'center', alpha: 0.72, cps: 20 });
    });
    if (tops.length > 1) B.dashed('hatch', tops, { w: 2.8, color: 'accent', dash: 12, gapL: 10, alpha: 0.9 });
    B.clip = null;
    B.caption('cap', { x: F.x0 + 24, y: py1 + 56, w: F.x1 - F.x0 - 48, maxW: 860, align: 'left', size: 46 }, null, s.closing);
    if (s.tbc) {
      var tb = B.text('fx', s.tbc, F.x1 - 30, F.y1 - 14, { size: 40 * fs, align: 'right', alpha: 0.85 });
      if (tb) B.line('fx', [[tb.x, F.y1 + 6], [tb.x + tb.w * 0.5, F.y1 + 12], [tb.x + tb.w + 10, F.y1 + 4]], { w: 3, doubled: false });
    }
  }

  // env: { pen:PENS[..], fonts:{hand, weight, scale, lh?}, measure(text, font) }
  function buildScene(plan, L, i, env) {
    var s = plan.scenes[i];
    var page = L.pages[L.sceneToPage[i]];
    var slot = L.sceneSlot[i];
    var B = new Builder(env, Rng(mix(plan.seed, i * 7919 + 17)));
    if (page.kind === 'end') buildEnd(B, plan, s, L);
    else buildPanelScene(B, plan, s, page, slot, L);
    var shift = slot === 0 ? TRANS_DUR[page.trans] : 0;
    return B.finalize(s.t0, s.dur, shift, page.kind === 'end' ? END_WIN : WIN);
  }

  function heuristicMeasure(text, font) {
    var m = /([\d.]+)px/.exec(font);
    var size = m ? parseFloat(m[1]) : 40;
    var u = 0;
    Array.from(String(text)).forEach(function (ch) {
      var c = ch.codePointAt(0);
      if (isMarkCp(c)) return;
      if (c >= 0x1100 && c <= 0xd7af || c >= 0x3000 && c <= 0x9fff || c >= 0xff00) u += 0.92;
      else if (c >= 0x0e00 && c <= 0x0e7f) u += 0.54;
      else if ((c >= 0x00c0 && c <= 0x024f) || (c >= 0x1e00 && c <= 0x1eff)) u += ch !== ch.toLowerCase() ? 0.56 : 0.46;
      else if (/[A-Z]/.test(ch)) u += 0.56;
      else if (/[a-z0-9]/.test(ch)) u += 0.46;
      else u += 0.28;
    });
    return u * size;
  }

  // Node/테스트용: 모든 장면의 획 계획
  function buildAll(plan, opts) {
    opts = opts || {};
    var hd = opts.hd || (plan.hero ? 1440 : 1920);
    var L = layoutPages(plan, hd, { timeline: opts.timeline !== false && !plan.hero, loop: !!opts.loop });
    var env = { pen: PENS[plan.pen] || PENS.brush, fonts: opts.fonts || { hand: 'cursive', weight: '400', scale: 1 }, measure: opts.measure || heuristicMeasure };
    var scenes = plan.scenes.map(function (s, i) { return buildScene(plan, L, i, env); });
    return { layout: L, scenes: scenes };
  }

  // ---------------------------------------------------------------
  // 브라우저 런타임
  // ---------------------------------------------------------------
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }
  function makeMeasure() {
    var c = makeCanvas(4, 4).getContext('2d');
    return function (text, font) { c.font = font; return c.measureText(text).width; };
  }

  var paperCache = {};
  function makePaper(w, h) {
    var key = w + 'x' + h;
    if (paperCache[key]) return paperCache[key];
    var c = makeCanvas(w, h), x = c.getContext('2d'), rng = Rng(0xBEEF);
    x.fillStyle = rgba(PAPER, 1);
    x.fillRect(0, 0, w, h);
    var T = 160, tile = makeCanvas(T, T), tx = tile.getContext('2d'), img = tx.createImageData(T, T), d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = rng();
      var dark = v < 0.5;
      d[i] = d[i + 1] = d[i + 2] = dark ? 70 : 255;
      d[i + 3] = dark ? Math.floor(rng() * 16) : Math.floor(rng() * 20);
    }
    tx.putImageData(img, 0, 0);
    x.fillStyle = x.createPattern(tile, 'repeat');
    x.fillRect(0, 0, w, h);
    var sc = Math.max(w, h) / 1000;
    for (i = 0; i < 18; i++) {
      var gx = rng() * w, gyy = rng() * h, gr = (120 + rng() * 260) * sc;
      var g = x.createRadialGradient(gx, gyy, 0, gx, gyy, gr);
      g.addColorStop(0, rng() < 0.5 ? 'rgba(120,105,80,0.022)' : 'rgba(255,255,250,0.05)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(gx - gr, gyy - gr, gr * 2, gr * 2);
    }
    x.strokeStyle = 'rgba(90,80,60,0.05)';
    x.lineWidth = Math.max(0.5, sc * 0.7);
    for (i = 0; i < 90; i++) {
      var fx = rng() * w, fy = rng() * h, fl = (10 + rng() * 40) * sc, fa = rng() * TAU;
      x.beginPath();
      x.moveTo(fx, fy);
      x.quadraticCurveTo(fx + Math.cos(fa) * fl * 0.5 + rng() * 6, fy + Math.sin(fa) * fl * 0.5, fx + Math.cos(fa) * fl, fy + Math.sin(fa) * fl);
      x.stroke();
    }
    var vg = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.4, w / 2, h / 2, Math.max(w, h) * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(70,60,40,0.05)');
    x.fillStyle = vg;
    x.fillRect(0, 0, w, h);
    paperCache = {};
    paperCache[key] = c;
    return c;
  }

  function pencilPattern(ctx, pen) {
    var T = 48, c = makeCanvas(T, T), x = c.getContext('2d'), img = x.createImageData(T, T), d = img.data, rng = Rng(77);
    for (var i = 0; i < d.length; i += 4) {
      d[i] = pen.ink[0]; d[i + 1] = pen.ink[1]; d[i + 2] = pen.ink[2];
      d[i + 3] = Math.floor(255 * pen.alpha * (0.45 + 0.55 * rng()));
    }
    x.putImageData(img, 0, 0);
    return ctx.createPattern(c, 'repeat');
  }

  function Film(canvas, plan, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.plan = plan;
    this.o = opts || {};
    this.pen = PENS[plan.pen] || PENS.brush;
    this.fonts = this.o.fonts || { hand: 'cursive', weight: '400', scale: 1 };
    this.hd = this.o.hd || (plan.hero ? 1440 : 1920);
    this.loop = !!this.o.loop;
    this.speed = this.o.speed || 1;
    this.drift = this.o.drift !== false;
    this.timeline = this.o.timeline !== false && !plan.hero;
    this.quality = 2;
    this.t = 0;
    this.playing = false;
    this.ended = false;
    this._raf = 0;
    this._last = 0;
    this._dts = [];
    this._costs = [];
    this._ema = 16.7;
    this._qFrames = 0;
    this.measure = makeMeasure();
    this.env = { pen: this.pen, fonts: this.fonts, measure: this.measure };
    this.L = layoutPages(plan, this.hd, { timeline: this.timeline, loop: this.loop });
    this.sceneOps = [];
    this.pageIdx = -1;
    this.trans = null;
    this.sceneIdx = -1;
    this.duration = plan.total;
    this._tick = this._tick.bind(this);
    this.resize();
  }

  Film.prototype.resize = function () {
    var o = this.o, W, H;
    if (o.width) { W = o.width; H = o.height; }
    else {
      var dpr = o.dpr || Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
      var r = this.canvas.getBoundingClientRect();
      W = Math.max(2, Math.round(r.width * dpr));
      H = Math.max(2, Math.round(r.height * dpr));
    }
    if (this.canvas.width !== W) this.canvas.width = W;
    if (this.canvas.height !== H) this.canvas.height = H;
    this.W = W; this.H = H;
    this.u = Math.min(W / DW, H / this.hd);
    this.ox = (W - DW * this.u) / 2;
    this.oy = (H - this.hd * this.u) / 2;
    this.m = Math.round(0.05 * Math.max(W, H));
    this.layer = makeCanvas(W + 2 * this.m, H + 2 * this.m);
    this.lctx = this.layer.getContext('2d');
    this.prev = makeCanvas(W + 2 * this.m, H + 2 * this.m);
    this.pctx = this.prev.getContext('2d');
    this.paper = makePaper(this.layer.width, this.layer.height);
    this.inkCss = rgba(this.pen.ink, this.pen.alpha);
    this.accentCss = this.pen.accent ? rgba(this.pen.accent, 0.95) : this.inkCss;
    this.paperCss = rgba(PAPER, 1);
    this.grain = this.pen.grain ? pencilPattern(this.ctx, this.pen) : null;
    this.lgrain = this.pen.grain ? pencilPattern(this.lctx, this.pen) : null;
    this._tl = null;
    this._band = null;
    // 현재 페이지를 지금 시간까지 다시 굽는다
    var pi = this.pageIdx;
    this.pageIdx = -1;
    this.trans = null;
    if (pi >= 0) this._enterPage(pi, false);
    this._bakeUpTo(this.t);
    this.draw();
  };

  Film.prototype._designTx = function (ctx, cam) {
    ctx.setTransform(cam.s * this.u, 0, 0, cam.s * this.u, cam.x + cam.s * (this.m + this.ox), cam.y + cam.s * (this.m + this.oy));
  };
  Film.prototype._camera = function (t) {
    var W = this.W, H = this.H, m = this.m;
    if (!this.drift) return { s: 1, x: -m, y: -m };
    var s = 1 + 0.016 * (0.5 - 0.5 * Math.cos(t * TAU / 19));
    var dx = m * 0.2 * Math.sin(t * TAU / 23), dy = m * 0.16 * Math.sin(t * TAU / 29 + 1);
    return { s: s, x: W / 2 + dx - s * (m + W / 2), y: H / 2 + dy - s * (m + H / 2) };
  };
  Film.prototype._ops = function (i) {
    if (!this.sceneOps[i]) this.sceneOps[i] = buildScene(this.plan, this.L, i, this.env);
    return this.sceneOps[i];
  };
  Film.prototype._pageAt = function (t) {
    var pages = this.L.pages;
    for (var i = pages.length - 1; i >= 0; i--) if (t >= pages[i].t0) return i;
    return 0;
  };
  Film.prototype._color = function (ctx, key) {
    if (key === 'paper') return this.paperCss;
    if (key === 'accent') return this.accentCss;
    if (this.pen.grain) return ctx === this.lctx ? this.lgrain : this.grain;
    return this.inkCss;
  };
  Film.prototype._drawOp = function (ctx, op, p, baking) {
    var clip = op.clip;
    if (clip) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(clip[0][0], clip[0][1]);
      for (var i = 1; i < clip.length; i++) ctx.lineTo(clip[i][0], clip[i][1]);
      ctx.closePath();
      ctx.clip();
    }
    var hi = baking || this.quality >= 2;
    switch (op.type) {
      case 'line':
        ctx.fillStyle = this._color(ctx, op.color);
        ctx.globalAlpha = op.alpha;
        drawGeom(ctx, op.g, p, !baking);
        if (op.g2 && hi) { ctx.globalAlpha = op.alpha * op.a2; drawGeom(ctx, op.g2, Math.min(1, p * 1.08), false); }
        ctx.globalAlpha = 1;
        break;
      case 'bristle':
        ctx.fillStyle = this._color(ctx, op.color);
        drawBristle(ctx, op.g, p, op.alpha, baking || this.quality >= 1 ? 1 : 2);
        break;
      case 'fill':
        ctx.fillStyle = this._color(ctx, op.color);
        ctx.globalAlpha = op.alpha * clamp(p * 1.4, 0, 1);
        ctx.beginPath();
        ctx.moveTo(op.pts[0][0], op.pts[0][1]);
        for (var k = 1; k < op.pts.length; k++) ctx.lineTo(op.pts[k][0], op.pts[k][1]);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        break;
      case 'smudge':
        ctx.save();
        ctx.translate(op.x, op.y);
        ctx.rotate(op.rot);
        ctx.scale(op.rx, op.ry);
        var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        g.addColorStop(0, rgba(this.pen.ink, op.alpha * clamp(p, 0, 1)));
        g.addColorStop(1, rgba(this.pen.ink, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, TAU);
        ctx.fill();
        ctx.restore();
        break;
      case 'text':
        ctx.font = op.font;
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = op.color === 'accent' ? this.accentCss : this.inkCss;
        ctx.globalAlpha = op.alpha;
        var ln = op.lines[0];
        if (p >= 1) ctx.fillText(ln.s, ln.x, ln.y);
        else {
          ctx.save();
          ctx.beginPath();
          ctx.rect(ln.x - op.size * 0.2, ln.y - op.size * 1.3, (ln.w + op.size * 0.2) * p + op.size * 0.1, op.size * 1.9);
          ctx.clip();
          ctx.fillText(ln.s, ln.x, ln.y);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
        break;
    }
    if (clip) ctx.restore();
  };
  Film.prototype._bake = function (op) {
    var c = this.lctx;
    c.setTransform(this.u, 0, 0, this.u, this.m + this.ox, this.m + this.oy);
    this._drawOp(c, op, 1, true);
    op.done = true;
  };
  Film.prototype._clearLayer = function () {
    this.lctx.setTransform(1, 0, 0, 1, 0, 0);
    this.lctx.globalAlpha = 1;
    this.lctx.drawImage(this.paper, 0, 0);
  };
  Film.prototype._finishPage = function (pi) {
    if (pi < 0) return;
    var self = this;
    this.L.pages[pi].scenes.forEach(function (si) {
      self._ops(si).forEach(function (op) { if (!op.done) self._bake(op); });
    });
  };
  Film.prototype._enterPage = function (pi, animate) {
    var page = this.L.pages[pi];
    var self = this;
    if (animate && page.trans !== 'none') {
      this.pctx.setTransform(1, 0, 0, 1, 0, 0);
      this.pctx.drawImage(this.layer, 0, 0);
      this.trans = { kind: page.trans, t0: page.t0, dur: TRANS_DUR[page.trans] };
    } else this.trans = null;
    this._clearLayer();
    page.scenes.forEach(function (si) {
      if (self.sceneOps[si]) self.sceneOps[si].forEach(function (op) { op.done = false; });
    });
    this.pageIdx = pi;
  };
  Film.prototype._bakeUpTo = function (t) {
    var pi = this._pageAt(t);
    if (pi !== this.pageIdx) {
      if (this.pageIdx >= 0) this._finishPage(this.pageIdx);
      this._enterPage(pi, this.pageIdx >= 0);
    }
    var self = this;
    this.L.pages[this.pageIdx].scenes.forEach(function (si) {
      if (self.plan.scenes[si].t0 > t + 0.001) return;
      self._ops(si).forEach(function (op) { if (!op.done && t >= op.t0 + op.dur) self._bake(op); });
    });
    // 다음 장면 획 계획을 미리 만들어 둔다 (프레임 끊김 방지)
    var sc = this.plan.scenes;
    for (var i = 0; i < sc.length; i++) {
      if (t >= sc[i].t0 && t < sc[i].t0 + sc[i].dur) {
        if (i !== this.sceneIdx) {
          this.sceneIdx = i;
          if (this.o.onScene) try { this.o.onScene(i, sc[i]); } catch (e) { /* noop */ }
        }
        if (i + 1 < sc.length && t > sc[i].t0 + sc[i].dur * 0.45) this._ops(i + 1);
        if (i + 2 < sc.length && t > sc[i].t0 + sc[i].dur * 0.75) this._ops(i + 2);
        break;
      }
    }
  };

  Film.prototype._drawTransition = function (ctx, cam) {
    var tr = this.trans, p = clamp((this.t - tr.t0) / tr.dur, 0, 1);
    if (p >= 1) { this.trans = null; return; }
    var LW = this.prev.width, LH = this.prev.height, m = this.m;
    ctx.setTransform(cam.s, 0, 0, cam.s, cam.x, cam.y);
    if (tr.kind === 'flip') {
      var e = ease(p), th = e * Math.PI / 2, cs = Math.cos(th), sn = Math.sin(th);
      var spine = m * 0.6, N = 40, far = spine + (LW - spine) * cs;
      var shw = (60 + 140 * sn) * this.u;
      var sg = ctx.createLinearGradient(far, 0, far + shw, 0);
      sg.addColorStop(0, 'rgba(40,32,20,' + (0.2 * sn) + ')');
      sg.addColorStop(1, 'rgba(40,32,20,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(far, 0, shw, LH);
      for (var i = 0; i < N; i++) {
        var sx = i * LW / N, sw = LW / N;
        if (sx + sw < spine) { ctx.drawImage(this.prev, sx, 0, sw, LH, sx, 0, sw, LH); continue; }
        var rel = Math.max(0, (sx - spine) / (LW - spine));
        var dx = spine + (sx - spine) * cs;
        var grow = 1 + 0.1 * sn * rel;
        var dh = LH * grow;
        ctx.drawImage(this.prev, sx, 0, sw, LH, dx, LH / 2 - dh / 2, sw * cs + 0.8, dh);
      }
      var gg = ctx.createLinearGradient(spine, 0, far, 0);
      gg.addColorStop(0, 'rgba(30,25,18,0)');
      gg.addColorStop(1, 'rgba(30,25,18,' + (0.3 * sn) + ')');
      ctx.fillStyle = gg;
      var gh = LH * (1 + 0.1 * sn);
      ctx.beginPath();
      ctx.moveTo(spine, 0); ctx.lineTo(far, LH / 2 - gh / 2); ctx.lineTo(far, LH / 2 + gh / 2); ctx.lineTo(spine, LH);
      ctx.closePath();
      ctx.fill();
    } else if (tr.kind === 'wipe') {
      var e2 = ease(p), bw = LW * 0.3, X = -bw + e2 * (LW + bw * 2);
      ctx.save();
      ctx.beginPath();
      ctx.rect(X, 0, LW - X, LH);
      ctx.clip();
      ctx.drawImage(this.prev, 0, 0);
      ctx.restore();
      if (!this._band) {
        var rng = Rng(mix(this.plan.seed, 99));
        this._band = makeBristle([[0, -LH * 0.05], [bw * 0.08, LH * 0.5], [-bw * 0.04, LH * 1.05]], { w: bw, bristles: 34, dry: 0.28 }, rng);
      }
      ctx.translate(X, 0);
      ctx.fillStyle = this.inkCss;
      drawBristle(ctx, this._band, 1, 0.96, this.quality >= 1 ? 1 : 2);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  Film.prototype._timelineFrac = function () {
    var sc = this.plan.scenes, t = this.t, span = Math.max(1, this.plan.now.y - this.plan.birth);
    function f(s) { return s.key === 'end' ? 1 : clamp((s.year - sc[0].year) / span, 0, 1); }
    for (var i = 0; i < sc.length; i++) {
      var s = sc[i];
      if (t < s.t0 + s.dur || i === sc.length - 1) {
        var nx = sc[i + 1] ? f(sc[i + 1]) : 1;
        return lerp(f(s), nx, clamp((t - s.t0) / s.dur, 0, 1));
      }
    }
    return 1;
  };
  Film.prototype._drawTimeline = function (ctx) {
    var u = this.u, hd = this.hd;
    ctx.setTransform(u, 0, 0, u, this.ox, this.oy);
    var y = hd - 112, x0 = 150, x1 = 930;
    if (!this._tl) {
      var rng = Rng(mix(this.plan.seed, 7));
      var pen = ext(this.pen, { taper: [0.02, 0.04], press: 0.05 });
      var sc = this.plan.scenes, span = Math.max(1, this.plan.now.y - this.plan.birth);
      this._tl = {
        base: makeGeom([[x0, y], [x0 + (x1 - x0) * 0.33, y + 2], [x0 + (x1 - x0) * 0.66, y - 2], [x1, y + 1]], { w: 2.6, wobble: 0.6 }, pen, rng),
        prog: makeGeom([[x0, y], [x0 + (x1 - x0) * 0.33, y + 2], [x0 + (x1 - x0) * 0.66, y - 2], [x1, y + 1]], { w: 6, wobble: 0.6 }, pen, rng),
        ticks: sc.filter(function (s) { return s.key !== 'end'; }).map(function (s) { return x0 + (x1 - x0) * clamp((s.year - sc[0].year) / span, 0, 1); })
      };
    }
    var tl = this._tl, fs = this.fonts.scale;
    ctx.fillStyle = this.inkCss;
    ctx.globalAlpha = 0.35;
    drawGeom(ctx, tl.base, 1, false);
    tl.ticks.forEach(function (tx) { ctx.fillRect(tx - 1.3, y - 10, 2.6, 20); });
    ctx.globalAlpha = 1;
    var fr = this._timelineFrac();
    drawGeom(ctx, tl.prog, fr, true);
    ctx.beginPath();
    ctx.arc(x0 + (x1 - x0) * fr, y + 1, 9, 0, TAU);
    ctx.fill();
    ctx.font = this.fonts.weight + ' ' + Math.round(30 * fs) + 'px ' + this.fonts.hand;
    ctx.globalAlpha = 0.62;
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    var yo = this.plan.yearOffset || 0;
    ctx.fillText(String(this.plan.birth + yo), x0 - 6, y + 50 * fs);
    ctx.textAlign = 'right';
    ctx.fillText(String(this.plan.now.y + yo), x1 + 6, y + 50 * fs);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
    if (this.o.watermark) {
      var last = this.plan.scenes[this.plan.scenes.length - 1];
      var a = clamp((this.t - last.t0 - 1.5) / 0.8, 0, 1);
      if (last.key === 'end' && a > 0) {
        ctx.globalAlpha = 0.55 * a;
        ctx.font = this.fonts.weight + ' ' + Math.round(28 * fs) + 'px ' + this.fonts.hand;
        ctx.textAlign = 'center';
        ctx.fillText(this.o.watermark, DW / 2, hd - 34);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      }
    }
  };

  Film.prototype.draw = function () {
    var ctx = this.ctx, t = this.t;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    var cam = this._camera(t);
    ctx.setTransform(cam.s, 0, 0, cam.s, cam.x, cam.y);
    ctx.drawImage(this.layer, 0, 0);
    if (this.pageIdx >= 0) {
      this._designTx(ctx, cam);
      var self = this;
      this.L.pages[this.pageIdx].scenes.forEach(function (si) {
        if (!self.sceneOps[si] || self.plan.scenes[si].t0 > t + 0.001) return;
        self.sceneOps[si].forEach(function (op) {
          if (!op.done && t >= op.t0) self._drawOp(ctx, op, clamp((t - op.t0) / op.dur, 0, 1), false);
        });
      });
    }
    if (this.trans) this._drawTransition(ctx, cam);
    if (this.timeline) this._drawTimeline(ctx);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  Film.prototype._tick = function (ts) {
    if (!this.playing) return;
    this._raf = requestAnimationFrame(this._tick);
    var rdt;
    if (!this._last) rdt = 1000 / (this.o.fps || 60);
    else {
      rdt = ts - this._last;
      if (this.o.fps && rdt < 1000 / this.o.fps - 2) return;
    }
    this._last = ts;
    var t0 = performance.now();
    var dt = Math.min(0.1, rdt / 1000) * this.speed;
    this.t += dt;
    if (this.t >= this.duration) {
      if (this.loop) {
        this._finishPage(this.pageIdx);
        this.t -= this.duration;
        this.sceneIdx = -1;
      } else {
        this.t = this.duration;
        this._bakeUpTo(this.t - 0.0005);
        this._finishPage(this.pageIdx);
        this.draw();
        this.playing = false;
        this.ended = true;
        cancelAnimationFrame(this._raf);
        if (this.o.onFrame) this.o.onFrame(this);
        if (this.o.onEnd) this.o.onEnd(this);
        return;
      }
    }
    this._bakeUpTo(this.t);
    this.draw();
    var cost = performance.now() - t0;
    if (this._dts.length > 900) { this._dts.shift(); this._costs.shift(); }
    this._dts.push(rdt);
    this._costs.push(cost);
    // 적응형 품질: 프레임 간격이 20ms 를 넘는 상태가 40프레임 이상 이어질 때만 한 단계 낮춘다 (순간 끊김은 무시)
    this._ema = this._ema * 0.9 + Math.min(rdt, 50) * 0.1;
    this._qFrames = this._ema > 20 ? this._qFrames + 1 : 0;
    if (!this.o.fps && this._qFrames > 40 && this.quality > 0) { this.quality--; this._qFrames = 0; }
    if (this.o.onFrame) this.o.onFrame(this);
  };
  Film.prototype.play = function () {
    if (this.playing) return;
    if (this.ended) this.restart(true);
    this.playing = true;
    this._last = 0;
    this._raf = requestAnimationFrame(this._tick);
  };
  Film.prototype.pause = function () {
    this.playing = false;
    cancelAnimationFrame(this._raf);
  };
  Film.prototype.toggle = function () { if (this.playing) this.pause(); else this.play(); return this.playing; };
  Film.prototype.restart = function (keepPaused) {
    this.pause();
    this.t = 0;
    this.ended = false;
    this.pageIdx = -1;
    this.sceneIdx = -1;
    this.trans = null;
    this._clearLayer();
    this._bakeUpTo(0);
    this.draw();
    if (!keepPaused) this.play();
  };
  Film.prototype.setSpeed = function (s) { this.speed = s; };
  Film.prototype.setDrift = function (on) { this.drift = !!on; };
  Film.prototype.destroy = function () { this.pause(); this.o.onFrame = null; this.o.onEnd = null; this.o.onScene = null; };
  Film.prototype.stats = function () {
    var a = this._dts, c = this._costs, n = a.length;
    if (!n) return { frames: 0 };
    var sum = 0, cs = 0, worst = 0, slow = 0;
    for (var i = 0; i < n; i++) { sum += a[i]; cs += c[i]; worst = Math.max(worst, a[i]); if (a[i] > 20) slow++; }
    return { frames: n, avgFps: Math.round(1000 / (sum / n) * 10) / 10, avgFrameMs: Math.round(sum / n * 100) / 100, avgDrawMs: Math.round(cs / n * 100) / 100, worstMs: Math.round(worst * 10) / 10, slowFrames: slow, quality: this.quality };
  };
  // 한 페이지를 완성된 상태로 그린다 (OG 이미지, 움직임 줄이기 정지 화면)
  Film.prototype.renderPage = function (pi) {
    this.pause();
    var page = this.L.pages[clamp(pi, 0, this.L.pages.length - 1)];
    this.pageIdx = -1;
    this.trans = null;
    this._enterPage(page.index, false);
    this._finishPage(page.index);
    this.t = page.t1 - 0.01;
    var d = this.drift;
    this.drift = false;
    this.draw();
    this.drift = d;
  };
  Film.prototype.pageCount = function () { return this.L.pages.length; };
  // 특정 시간으로 이동 (앞으로는 1/30초씩 진행하며 구워서 재생과 같은 그림, 뒤로는 처음부터 다시)
  Film.prototype.seek = function (t) {
    var wasPlaying = this.playing;
    this.pause();
    t = clamp(t, 0, this.duration);
    if (t < this.t) this.restart(true);
    while (this.t < t) {
      this.t = Math.min(t, this.t + 1 / 30);
      this._bakeUpTo(this.t);
    }
    if (this.trans && this.t >= this.trans.t0 + this.trans.dur) this.trans = null;
    this.ended = false;
    this.draw();
    if (wasPlaying) this.play();
    return this.t;
  };

  // 펜 미리보기 낙서 (펜 스타일 선택 버튼)
  function drawDoodle(canvas, penId, opts) {
    opts = opts || {};
    var pen = PENS[penId] || PENS.brush;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var r = canvas.getBoundingClientRect();
    var W = Math.max(2, Math.round(r.width * dpr)), H = Math.max(2, Math.round(r.height * dpr));
    canvas.width = W; canvas.height = H;
    var u = W / 240;
    var rng = Rng(mix(hashStr(penId), 5));
    var geoms = [];
    var o = { w: 6 };
    geoms.push({ g: makeGeom([[26, 76], [58, 44], [92, 70], [78, 96], [60, 70], [104, 38], [150, 66], [128, 92], [112, 66], [160, 40], [206, 58]], o, pen, rng) });
    geoms.push({ g: makeGeom(heartPts(196, 96, 18), { w: 5, sharp: true }, pen, rng), accent: true });
    for (var i = 0; i < 5; i++) geoms.push({ g: makeGeom([[30 + i * 16, 118], [44 + i * 16, 100]], { w: 3 }, pen, rng) });
    if (pen.doubled) geoms.push({ g: makeGeom(jitterPts([[26, 76], [58, 44], [92, 70], [78, 96], [60, 70], [104, 38], [150, 66], [128, 92], [112, 66], [160, 40], [206, 58]], rng, 2), { w: 5, overshoot: 1.5 }, pen, rng), a: pen.doubled });
    var total = geoms.reduce(function (s, x) { return s + x.g.len; }, 0);
    var ink = rgba(pen.ink, pen.alpha), acc = pen.accent ? rgba(pen.accent, 1) : ink;
    var start = null, dur = opts.animate === false ? 0 : 900, raf = 0;
    function frame(ts) {
      if (start === null) start = ts;
      var p = dur ? clamp((ts - start) / dur, 0, 1) : 1;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.setTransform(u, 0, 0, u, 0, (H - 140 * u) / 2);
      var acc2 = 0;
      geoms.forEach(function (x) {
        var a0 = acc2 / total, a1 = (acc2 + x.g.len) / total;
        acc2 += x.g.len;
        var lp = clamp((p - a0) / Math.max(1e-6, a1 - a0), 0, 1);
        if (lp <= 0) return;
        ctx.fillStyle = x.accent ? acc : ink;
        ctx.globalAlpha = x.a || 1;
        drawGeom(ctx, x.g, lp, lp < 1);
      });
      ctx.globalAlpha = 1;
      if (p < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return function () { cancelAnimationFrame(raf); };
  }
  function hashStr(str) {
    var h = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return h >>> 0;
  }

  return {
    PENS: PENS,
    PAPER: PAPER,
    heightFor: heightFor,
    layoutPages: layoutPages,
    buildAll: buildAll,
    wrapText: wrapText,
    balanceWrap: balanceWrap,
    heuristicMeasure: heuristicMeasure,
    createFilm: function (canvas, plan, opts) { return new Film(canvas, plan, opts); },
    drawDoodle: drawDoodle,
    TRANS_DUR: TRANS_DUR
  };
});
