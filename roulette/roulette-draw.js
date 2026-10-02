/* apps/roulette/roulette-draw.js — 돌림판 그리기 (캔버스). 페이지(roulette.js)와 OG 이미지(tools/og-card.html)가 같이 쓴다.
 * roulette-core.js 뒤에 로드한다. 좌표는 CSS 픽셀 기준이고 DPR 배율은 호출하는 쪽에서 ctx 에 건다.
 *   drawWheel(ctx, o)   휠 면(칸·글자·핀·광택). 회전은 o.rotation 으로 구워 넣을 수 있다.
 *   createRim(o)        테두리 링 + 전구(켜짐 정도 0~1을 전구마다 받아 다시 그린다). 링/전구 스프라이트는 미리 그려 둔다.
 *   pointerSvg()        포인터(바늘) SVG 마크업
 */
(function (root, factory) {
  var core = (typeof module !== 'undefined' && module.exports) ? require('./roulette-core.js') : root.ROULETTE_CORE;
  var api = factory(core);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.ROULETTE_DRAW = api;
})(typeof window !== 'undefined' ? window : globalThis, function (CORE) {
  'use strict';

  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;

  // 색 테마. 칸 색은 순서대로 돌려 쓰고, 이웃한 칸(마지막↔첫 칸 포함)이 같은 색이 되지 않게 고른다.
  var THEMES = {
    candy: ['#FF4D7D', '#FF9F43', '#FFD84D', '#3ED6B0', '#4DB8FF', '#9C6BFF', '#FF85C8', '#A6E35A'],
    macaron: ['#FFB0C4', '#FFD3A3', '#FBEA9A', '#BDEDB5', '#A6E3EE', '#B3C5FF', '#D3C0FF', '#FFC4EA'],
    circus: ['#E2334B', '#FFF4E4', '#24357F', '#F4B63F', '#FFF4E4', '#1F9E8A'],
    jewel: ['#C8184A', '#F2A516', '#0F9D74', '#2D5BD8', '#7B3FE4', '#E0457B', '#0E8AA8', '#E86A1C'],
  };
  var INK = '#3B1C2C';

  function hexRgb(hex) {
    var h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function luminance(hex) {
    var c = hexRgb(hex).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  // 흰 글자와 진한 글자 중 대비가 큰 쪽
  function textColorFor(hex) {
    var L = luminance(hex);
    var withWhite = 1.05 / (L + 0.05);
    var withInk = (L + 0.05) / (luminance(INK) + 0.05);
    return withWhite >= withInk * 0.9 ? '#FFFFFF' : INK;
  }

  function sliceColors(n, themeId) {
    var pal = THEMES[themeId] || THEMES.candy;
    var out = [];
    for (var i = 0; i < n; i++) {
      var c = pal[i % pal.length];
      if (i > 0 && c === out[i - 1]) c = pal[(i + 1) % pal.length];
      if (i === n - 1 && n > 1) {
        var k = i;
        while (c === out[0] || c === out[i - 1]) { k++; c = pal[k % pal.length]; if (k > i + pal.length) break; }
      }
      out.push(c);
    }
    return out;
  }

  // 테마 미리보기용 conic-gradient
  function themePreview(themeId) {
    var pal = THEMES[themeId] || THEMES.candy;
    var n = Math.min(pal.length, 6);
    var stops = [];
    for (var i = 0; i < n; i++) {
      stops.push(pal[i] + ' ' + (i * 100 / n).toFixed(2) + '% ' + ((i + 1) * 100 / n).toFixed(2) + '%');
    }
    return 'conic-gradient(' + stops.join(', ') + ')';
  }

  // ---------------------------------------------------------------
  // 칸 글자 맞추기: 반지름 방향으로 쓰고(가운데 → 테두리), 테두리 쪽에 오른쪽 정렬.
  // 글자 높이가 가장 좁은 안쪽 끝의 현(chord) 안에 들어가는 가장 큰 크기를 찾고, 최소 크기에서도 길면 말줄임.
  // ---------------------------------------------------------------
  function fitLabel(ctx, text, span, r, innerR, family, n) {
    var outer = r * 0.865;
    var innerMin = innerR + r * 0.05;
    var maxF = Math.min(r * (n <= 3 ? 0.155 : n <= 6 ? 0.13 : n <= 10 ? 0.115 : 0.1), 30);
    var minF = Math.max(9, Math.min(12, r * 0.062));
    var half = Math.min(span / 2, HALF_PI * 0.98);
    var sinH = Math.sin(half);
    var f;
    for (f = Math.round(maxF); f >= minF; f--) {
      ctx.font = '800 ' + f + 'px ' + family;
      var w = ctx.measureText(text).width;
      var rIn = outer - w;
      if (rIn < innerMin) continue;
      if (f * 1.1 <= 2 * rIn * sinH) return { text: text, size: f, outer: outer };
    }
    f = Math.round(minF);
    ctx.font = '800 ' + f + 'px ' + family;
    var rNeed = (f * 1.1) / (2 * sinH);
    var avail = outer - Math.max(innerMin, rNeed);
    if (avail < f * 1.15) return null; // 칸이 너무 좁다 — 색만 보여 준다
    var chars = Array.from(text);
    var lo = 0, hi = chars.length;
    while (lo < hi) {
      var mid = (lo + hi + 1) >> 1;
      if (ctx.measureText(chars.slice(0, mid).join('').trimEnd() + '…').width <= avail) lo = mid; else hi = mid - 1;
    }
    if (lo === 0) return null;
    return { text: chars.slice(0, lo).join('').trimEnd() + '…', size: f, outer: outer };
  }

  // 휠 면. o = { cx, cy, r, items, weights, theme, rotation, highlight, family, hubR }
  function drawWheel(ctx, o) {
    var n = o.items.length;
    var lay = CORE.layout(o.weights);
    var colors = sliceColors(n, o.theme);
    var r = o.r;
    var hubR = o.hubR != null ? o.hubR : r * 0.27;
    var i;

    ctx.save();
    ctx.translate(o.cx, o.cy);
    ctx.rotate(o.rotation || 0);

    // 1) 칸
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, lay.starts[i] - HALF_PI, lay.ends[i] - HALF_PI);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }

    // 2) 사탕처럼 볼록한 음영 (가운데 밝고 테두리로 갈수록 살짝 어둡게)
    var dome = ctx.createRadialGradient(0, 0, hubR * 0.6, 0, 0, r);
    dome.addColorStop(0, 'rgba(255,255,255,0.20)');
    dome.addColorStop(0.42, 'rgba(255,255,255,0.05)');
    dome.addColorStop(0.8, 'rgba(255,255,255,0)');
    dome.addColorStop(0.94, 'rgba(70,14,40,0.10)');
    dome.addColorStop(1, 'rgba(70,14,40,0.26)');
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fillStyle = dome;
    ctx.fill();

    // 3) 당첨 강조: 나머지 칸을 어둡게
    var hi = o.highlight != null ? o.highlight : -1;
    if (hi >= 0 && hi < n) {
      for (i = 0; i < n; i++) {
        if (i === hi) continue;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r, lay.starts[i] - HALF_PI, lay.ends[i] - HALF_PI);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,238,244,0.62)'; // 우유빛 베일: 색이 탁해지지 않고 파스텔로 물러난다
        ctx.fill();
      }
    }

    // 4) 칸 사이 선
    if (n > 1) {
      ctx.strokeStyle = 'rgba(255,255,255,0.62)';
      ctx.lineWidth = Math.max(1.25, r * 0.009);
      ctx.lineCap = 'round';
      for (i = 0; i < n; i++) {
        var a = lay.starts[i] - HALF_PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * hubR * 0.9, Math.sin(a) * hubR * 0.9);
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.stroke();
      }
    }

    // 5) 글자
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (i = 0; i < n; i++) {
      var span = lay.ends[i] - lay.starts[i];
      var fit = fitLabel(ctx, o.items[i], span, r, hubR, o.family, n);
      if (!fit) continue;
      var mid = (lay.starts[i] + lay.ends[i]) / 2 - HALF_PI;
      var fg = textColorFor(colors[i]);
      ctx.save();
      ctx.rotate(mid);
      ctx.font = '800 ' + fit.size + 'px ' + o.family;
      if (fg === '#FFFFFF') {
        ctx.shadowColor = 'rgba(60,10,30,0.35)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetY = 1;
      }
      var dimmed = hi >= 0 && i !== hi;
      if (dimmed) { ctx.shadowColor = 'transparent'; }
      ctx.globalAlpha = dimmed ? 0.5 : 1;
      ctx.fillStyle = dimmed ? INK : fg;
      ctx.fillText(fit.text, fit.outer, 0);
      ctx.restore();
    }

    // 6) 당첨 칸 테두리
    if (hi >= 0 && hi < n) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r - 2, lay.starts[hi] - HALF_PI, lay.ends[hi] - HALF_PI);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255,255,255,0.95)';
      ctx.lineWidth = Math.max(2.5, r * 0.02);
      ctx.lineJoin = 'round';
      ctx.stroke();
    }

    // 7) 핀 (칸 경계마다 — 포인터가 이 핀을 치면서 틱 소리가 난다)
    var pinR = Math.max(2.4, r * 0.021);
    var pinD = r * 0.935;
    for (i = 0; i < n; i++) {
      var pa = lay.starts[i] - HALF_PI;
      var px = Math.cos(pa) * pinD;
      var py = Math.sin(pa) * pinD;
      var pg = ctx.createRadialGradient(px - pinR * 0.4, py - pinR * 0.4, pinR * 0.1, px, py, pinR);
      pg.addColorStop(0, '#FFF6D6');
      pg.addColorStop(0.45, '#F4B63F');
      pg.addColorStop(1, '#9A5F12');
      ctx.beginPath();
      ctx.arc(px, py, pinR, 0, TAU);
      ctx.fillStyle = pg;
      ctx.fill();
    }

    // 8) 바깥 가장자리
    ctx.beginPath();
    ctx.arc(0, 0, r - 0.5, 0, TAU);
    ctx.strokeStyle = 'rgba(70,14,40,0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 9) 가운데 허브 자리 (허브 버튼 밑 그림자)
    var well = ctx.createRadialGradient(0, 0, hubR * 0.7, 0, 0, hubR * 1.18);
    well.addColorStop(0, 'rgba(70,14,40,0.28)');
    well.addColorStop(1, 'rgba(70,14,40,0)');
    ctx.beginPath();
    ctx.arc(0, 0, hubR * 1.18, 0, TAU);
    ctx.fillStyle = well;
    ctx.fill();

    ctx.restore();
    return { layout: lay, colors: colors };
  }

  // ---------------------------------------------------------------
  // 테두리 링 + 전구. o = { size, dpr, r (휠 반지름), w (링 두께), bulbs }
  // draw(levelOf) — levelOf(i) 는 i번 전구의 밝기 0~1
  // ---------------------------------------------------------------
  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }

  function createRim(o) {
    var size = o.size;
    var dpr = o.dpr || 1;
    var cx = size / 2;
    var r = o.r;
    var w = o.w;
    var bulbs = o.bulbs;
    var bulbR = Math.max(3, w * 0.27);
    var glowR = bulbR * 2.7;

    // 링 (고정)
    var base = makeCanvas(size * dpr, size * dpr);
    var b = base.getContext('2d');
    b.scale(dpr, dpr);
    var ring = b.createLinearGradient(cx - r - w, cx - r - w, cx + r + w, cx + r + w);
    ring.addColorStop(0, '#FFE7A8');
    ring.addColorStop(0.35, '#F6BD47');
    ring.addColorStop(0.7, '#DC951F');
    ring.addColorStop(1, '#A9660F');
    b.beginPath();
    b.arc(cx, cx, r + w, 0, TAU);
    b.arc(cx, cx, r - 1, 0, TAU, true);
    b.fillStyle = ring;
    b.fill();
    // 링 안팎 경계
    b.lineWidth = 1.5;
    b.strokeStyle = 'rgba(110,50,8,0.55)';
    b.beginPath(); b.arc(cx, cx, r + w - 0.75, 0, TAU); b.stroke();
    b.strokeStyle = 'rgba(110,50,8,0.45)';
    b.beginPath(); b.arc(cx, cx, r + 0.25, 0, TAU); b.stroke();
    // 윗부분 반사광
    b.lineWidth = Math.max(1.5, w * 0.14);
    b.lineCap = 'round';
    b.strokeStyle = 'rgba(255,255,255,0.55)';
    b.beginPath(); b.arc(cx, cx, r + w * 0.78, Math.PI * 1.1, Math.PI * 1.62); b.stroke();

    // 전구 소켓
    var ringMid = r + w / 2;
    var pos = [];
    for (var i = 0; i < bulbs; i++) {
      var a = (i / bulbs) * TAU - HALF_PI + Math.PI / bulbs;
      pos.push([cx + Math.cos(a) * ringMid, cx + Math.sin(a) * ringMid]);
      b.beginPath();
      b.arc(pos[i][0], pos[i][1] + 0.6, bulbR + 1.4, 0, TAU);
      b.fillStyle = 'rgba(110,52,8,0.5)';
      b.fill();
    }

    // 전구 스프라이트: 꺼짐 / 켜짐(빛 번짐 포함)
    function sprite(lit) {
      var s = glowR * 2;
      var c = makeCanvas(s * dpr, s * dpr);
      var x = c.getContext('2d');
      x.scale(dpr, dpr);
      var m = s / 2;
      if (lit) {
        var gl = x.createRadialGradient(m, m, bulbR * 0.6, m, m, glowR);
        gl.addColorStop(0, 'rgba(255,236,170,0.75)');
        gl.addColorStop(1, 'rgba(255,220,130,0)');
        x.fillStyle = gl;
        x.beginPath(); x.arc(m, m, glowR, 0, TAU); x.fill();
      }
      var g = x.createRadialGradient(m - bulbR * 0.35, m - bulbR * 0.4, bulbR * 0.1, m, m, bulbR);
      if (lit) {
        g.addColorStop(0, '#FFFFFF');
        g.addColorStop(0.45, '#FFF4C2');
        g.addColorStop(1, '#FFC640');
      } else {
        g.addColorStop(0, '#FBEBC8');
        g.addColorStop(0.5, '#E2B868');
        g.addColorStop(1, '#B07A26');
      }
      x.fillStyle = g;
      x.beginPath(); x.arc(m, m, bulbR, 0, TAU); x.fill();
      return c;
    }
    var off = sprite(false);
    var on = sprite(true);

    var canvas = o.canvas || makeCanvas(size * dpr, size * dpr);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    var ctx = canvas.getContext('2d');

    function draw(levelOf) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var s = glowR * 2;
      for (var i = 0; i < bulbs; i++) {
        var lv = levelOf ? levelOf(i) : 1;
        var x = pos[i][0] - glowR;
        var y = pos[i][1] - glowR;
        if (lv < 1) { ctx.globalAlpha = 1; ctx.drawImage(off, x, y, s, s); }
        if (lv > 0) { ctx.globalAlpha = lv; ctx.drawImage(on, x, y, s, s); }
      }
      ctx.globalAlpha = 1;
    }

    return { canvas: canvas, draw: draw, bulbs: bulbs };
  }

  // 포인터(바늘): 머리(원) 중심이 회전축. viewBox 60×80, 축 = (30, 26)
  function pointerSvg(uid) {
    uid = uid || 'p';
    return '<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
      '<defs>' +
      '<linearGradient id="' + uid + 'b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF6E93"/><stop offset=".5" stop-color="#E8285A"/><stop offset="1" stop-color="#A70E38"/></linearGradient>' +
      '<linearGradient id="' + uid + 'g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFEFB8"/><stop offset=".5" stop-color="#F4B63F"/><stop offset="1" stop-color="#A9660F"/></linearGradient>' +
      '<radialGradient id="' + uid + 'j" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFBEA"/><stop offset=".45" stop-color="#F6C04F"/><stop offset="1" stop-color="#9A5F12"/></radialGradient>' +
      '</defs>' +
      '<path d="M30 77 C25 64 12 46 12 29 A18 18 0 1 1 48 29 C48 46 35 64 30 77 Z" fill="url(#' + uid + 'b)" stroke="url(#' + uid + 'g)" stroke-width="3.2" stroke-linejoin="round"/>' +
      '<path d="M19 22 A13 13 0 0 1 33 13" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3.2" stroke-linecap="round"/>' +
      '<circle cx="30" cy="27" r="7.5" fill="url(#' + uid + 'j)" stroke="rgba(120,60,8,.55)" stroke-width="1"/>' +
      '</svg>';
  }

  return {
    THEMES: THEMES,
    INK: INK,
    sliceColors: sliceColors,
    textColorFor: textColorFor,
    themePreview: themePreview,
    fitLabel: fitLabel,
    drawWheel: drawWheel,
    createRim: createRim,
    pointerSvg: pointerSvg,
  };
});
