/* apps/snowman/snowman.js — 시작(티징) → 만들기(canvas 미리보기 + 단계 9개, 무작위·이전·다음, 이름) → 끝 화면(눈사람 + 이미지 저장·계속 만들기 + 공통 끝 화면)
 * 선택지·검증·공유 인코딩·눈덩이 배치는 snowman-core.js(SNOWMAN_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별)과 생성된 HTML.
 * 그림은 모두 코드(canvas 도형)로 그린다 — 외부 이미지·이모지 그림 없음. 정적 층(배경·눈사람·이름)을 화면 밖 canvas 에 한 번 그리고,
 *   매 프레임 그 위에 내리는 눈·반짝이만 더한다. prefers-reduced-motion 이면 멈춘 한 장. PNG 저장도 같은 그림(1080×1350).
 * 끝 화면: 완성하면 눈사람이 아래부터 쌓이는 짧은 애니메이션. 받은 링크(#d=)는 눈에 덮인 그림 + "눈 털기" 버튼 → 같은 애니메이션(공개).
 * 기록: 시작 버튼(만들기 시작)에 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번. 받은 링크는 둘 다 안 셈.
 * 이름은 서버로 보내지 않는다(공유 링크 안에만). 만들던 눈사람은 localStorage(snowman_draft)에만 둔다.
 * 디버그/검사용 읽기 전용 핸들: window.SNOWMAN_APP (state(), shown(), step(), lastImage, frames(), revealed())
 */
(function () {
  'use strict';

  var CORE = window.SNOWMAN_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.card || {};
  var R = UI.result || {};
  var FONTS = UI.fonts || {};
  var W = CORE.W;
  var H = CORE.H;
  var CX = CORE.CX;
  var DRAFT_KEY = 'snowman_draft';
  var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var BUILD_MS = 1600;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'), startBtn: $('start-btn'),
    canvas: $('snow-canvas'), steps: $('steps'), stepOf: $('step-of'),
    back: $('back-btn'), random: $('random-btn'), next: $('next-btn'), doneBtn: $('done-btn'),
    name: $('f-name'), nameCount: $('name-count'), idea: $('idea-btn'),
    eyebrow: $('end-eyebrow'), endTitle: $('end-title'), endCanvas: $('end-canvas'), reveal: $('reveal'), revealBtn: $('reveal-btn'),
    saveBtn: $('save-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var panels = Array.prototype.slice.call(document.querySelectorAll('.sm-panel'));
  var tabs = Array.prototype.slice.call(els.steps.querySelectorAll('.sm-step'));

  var man = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 눈사람 (공유 링크 = 이것)
  var friend = false;    // 공유 링크로 받은 눈사람을 보는 중
  var covered = false;   // 받은 눈사람이 아직 눈에 덮여 있음
  var buildAt = 0;       // 쌓이는 애니메이션 시작 시각 (0 = 다 쌓임)
  var started = false;
  var doneSent = false;
  var step = 0;
  var saving = false;
  var ideaAt = -1;
  var randSeed = 1;
  var screen = 'start';
  var layers = { edit: null, end: null };
  var layerKey = { edit: '', end: '' };
  var frames = 0;
  var raf = 0;
  var lastFrame = 0;
  var t0 = Date.now();
  var fontsReady = 0;
  window.SNOWMAN_APP = {
    lastImage: null,
    state: function () { return CORE.copy(man); },
    shown: function () { return shown && CORE.copy(shown); },
    step: function () { return step; },
    frames: function () { return frames; },
    revealed: function () { return !covered; }
  };
  var app = window.SNOWMAN_APP;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function show(name) {
    screen = name;
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
    kick();
  }

  // ================================================================ 그림 도구
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(v + amt * 255))); };
    return 'rgb(' + f(n >> 16) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')';
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
  function flakeShape(ctx, x, y, r, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    ctx.lineCap = 'round';
    for (var i = 0; i < 6; i++) {
      ctx.rotate(Math.PI / 3);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r * 0.55); ctx.lineTo(-r * 0.25, -r * 0.78); ctx.moveTo(0, -r * 0.55); ctx.lineTo(r * 0.25, -r * 0.78); ctx.stroke();
    }
    ctx.restore();
  }

  // ================================================================ 배경
  function background(ctx, g) {
    var id = CORE.SCENES[g].id;
    var r = CORE.rng(g + 11);
    var gr;
    if (id === 'night') {
      gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#071433'); gr.addColorStop(0.62, '#1b3266'); gr.addColorStop(1, '#2f4f8f');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      for (var i = 0; i < 80; i++) { ctx.globalAlpha = 0.3 + r() * 0.6; circle(ctx, r() * W, r() * 820, 1 + r() * 2.4); ctx.fill(); }
      ctx.globalAlpha = 1;
      var mg = ctx.createRadialGradient(170, 190, 20, 170, 190, 170);
      mg.addColorStop(0, 'rgba(255,246,213,0.45)'); mg.addColorStop(1, 'rgba(255,246,213,0)');
      ctx.fillStyle = mg; circle(ctx, 170, 190, 170); ctx.fill();
      ctx.fillStyle = '#fff6d5'; circle(ctx, 170, 190, 64); ctx.fill();
      // 먼 언덕과 나무
      ctx.fillStyle = '#c7d7f0';
      ctx.beginPath(); ctx.moveTo(0, 1000); ctx.quadraticCurveTo(300, 900, 620, 990); ctx.quadraticCurveTo(860, 1050, W, 960); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      pines(ctx, [[110, 985, 150], [210, 975, 110], [880, 985, 160], [990, 965, 120]], '#18305e');
      ground(ctx, '#f2f7ff', '#cbdaf2');
    } else if (id === 'sunny') {
      gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#4fa8ef'); gr.addColorStop(0.62, '#a9dbff'); gr.addColorStop(1, '#e8f6ff');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      var sg = ctx.createRadialGradient(880, 200, 30, 880, 200, 240);
      sg.addColorStop(0, 'rgba(255,240,170,0.9)'); sg.addColorStop(1, 'rgba(255,240,170,0)');
      ctx.fillStyle = sg; circle(ctx, 880, 200, 240); ctx.fill();
      ctx.fillStyle = '#ffe27a'; circle(ctx, 880, 200, 86); ctx.fill();
      // 구름
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      [[190, 220, 1], [470, 140, 0.75]].forEach(function (c) {
        var s = c[2];
        circle(ctx, c[0], c[1], 52 * s); ctx.fill(); circle(ctx, c[0] + 60 * s, c[1] - 22 * s, 64 * s); ctx.fill();
        circle(ctx, c[0] + 128 * s, c[1], 50 * s); ctx.fill(); ctx.fillRect(c[0], c[1], 128 * s, 50 * s);
      });
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.moveTo(0, 960); ctx.quadraticCurveTo(250, 860, 540, 950); ctx.quadraticCurveTo(820, 1030, W, 900); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      pines(ctx, [[90, 950, 140], [190, 960, 100], [930, 915, 150], [1020, 930, 110]], '#2f7a62');
      ground(ctx, '#ffffff', '#e0f0fb');
      // 반짝이는 눈밭
      ctx.fillStyle = '#ffffff';
      for (var k = 0; k < 30; k++) { ctx.globalAlpha = 0.5 + r() * 0.5; var sx = r() * W; var sy = 1130 + r() * 200; ctx.fillRect(sx - 1, sy - 6, 2, 12); ctx.fillRect(sx - 6, sy - 1, 12, 2); }
      ctx.globalAlpha = 1;
    } else {
      gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, '#2a1b4d'); gr.addColorStop(0.5, '#5a3a7a'); gr.addColorStop(1, '#c27a8a');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      for (var j = 0; j < 40; j++) { ctx.globalAlpha = 0.25 + r() * 0.5; circle(ctx, r() * W, r() * 500, 1 + r() * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      // 마을 집들
      var houses = [[30, 980, 150, 150, '#8a4b3c'], [170, 1000, 120, 120, '#3f5a8a'], [300, 970, 130, 160, '#6b4a8a'], [690, 975, 140, 150, '#3f7a6a'], [820, 995, 120, 120, '#8a5a3c'], [935, 965, 150, 165, '#5a4a8a']];
      houses.forEach(function (hs, n) {
        var x = hs[0], y = hs[1], w = hs[2], h = hs[3];
        ctx.fillStyle = hs[4]; ctx.fillRect(x, y - h, w, h);
        ctx.fillStyle = '#2b1f3a';
        ctx.beginPath(); ctx.moveTo(x - 14, y - h + 4); ctx.lineTo(x + w / 2, y - h - w * 0.5); ctx.lineTo(x + w + 14, y - h + 4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.moveTo(x - 14, y - h + 4); ctx.lineTo(x + w / 2, y - h - w * 0.5); ctx.lineTo(x + w + 14, y - h + 4); ctx.lineTo(x + w + 6, y - h + 16); ctx.lineTo(x + w / 2, y - h - w * 0.5 + 16); ctx.lineTo(x - 6, y - h + 16); ctx.closePath(); ctx.fill();
        var lit = ['#ffd56a', '#ffbf5a', '#ffe48a'];
        ctx.fillStyle = lit[n % 3];
        ctx.shadowColor = 'rgba(255,200,90,0.9)'; ctx.shadowBlur = 18;
        ctx.fillRect(x + w * 0.18, y - h * 0.62, w * 0.24, h * 0.22);
        ctx.fillRect(x + w * 0.58, y - h * 0.62, w * 0.24, h * 0.22);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#3a2a2a'; ctx.fillRect(x + w * 0.4, y - h * 0.32, w * 0.2, h * 0.32);
      });
      // 줄 전구
      ctx.strokeStyle = 'rgba(30,20,40,0.8)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, 640); ctx.quadraticCurveTo(CX, 760, W, 640); ctx.stroke();
      var cols = ['#ff5a6c', '#ffd25a', '#5ad18a', '#5ab4ff', '#ff9ae0'];
      for (var b = 0; b <= 16; b++) {
        var u = b / 16;
        var bx = u * W;
        var by = (1 - u) * (1 - u) * 640 + 2 * (1 - u) * u * 760 + u * u * 640 + 14;
        ctx.fillStyle = cols[b % cols.length];
        ctx.shadowColor = cols[b % cols.length]; ctx.shadowBlur = 16;
        ctx.beginPath(); ctx.ellipse(bx, by, 9, 13, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      ground(ctx, '#f6f1ff', '#d9cdee');
    }
  }
  function pines(ctx, list, col) {
    ctx.fillStyle = col;
    list.forEach(function (t) {
      ctx.beginPath(); ctx.moveTo(t[0], t[1] - t[2]); ctx.lineTo(t[0] + t[2] * 0.36, t[1]); ctx.lineTo(t[0] - t[2] * 0.36, t[1]); ctx.closePath(); ctx.fill();
    });
  }
  function ground(ctx, top, bottom) {
    var g = ctx.createLinearGradient(0, 1060, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, 1110); ctx.quadraticCurveTo(CX, 1060, W, 1110); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  }

  // ================================================================ 눈사람 부분
  function snowball(ctx, b) {
    var g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.1, b.x, b.y, b.r * 1.05);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.65, '#f1f5fb'); g.addColorStop(1, '#c9d6ea');
    ctx.fillStyle = g;
    circle(ctx, b.x, b.y, b.r); ctx.fill();
    ctx.strokeStyle = 'rgba(120,140,175,0.35)'; ctx.lineWidth = Math.max(1, b.r * 0.025);
    ctx.stroke();
  }
  function eyes(ctx, hd, e) {
    var id = CORE.EYES[e].id;
    var r = hd.r;
    [-1, 1].forEach(function (s) {
      var x = hd.x + s * r * 0.34;
      var y = hd.y - r * 0.16;
      if (id === 'coal') {
        ctx.fillStyle = '#1d1d24'; circle(ctx, x, y, r * 0.09); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; circle(ctx, x - r * 0.03, y - r * 0.03, r * 0.025); ctx.fill();
      } else if (id === 'buttons') {
        ctx.fillStyle = '#3d6fd6'; circle(ctx, x, y, r * 0.11); ctx.fill();
        ctx.strokeStyle = '#26478f'; ctx.lineWidth = r * 0.02; ctx.stroke();
        ctx.fillStyle = '#1b2f5f';
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (d) { circle(ctx, x + d[0] * r * 0.03, y + d[1] * r * 0.03, r * 0.016); ctx.fill(); });
      } else if (id === 'sparkly') {
        ctx.fillStyle = '#1d1d24'; ctx.beginPath(); ctx.ellipse(x, y, r * 0.11, r * 0.14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff'; circle(ctx, x - r * 0.035, y - r * 0.05, r * 0.04); ctx.fill();
        circle(ctx, x + r * 0.04, y + r * 0.04, r * 0.018); ctx.fill();
        ctx.fillStyle = 'rgba(255,120,150,0.35)'; ctx.beginPath(); ctx.ellipse(hd.x + s * r * 0.55, hd.y + r * 0.12, r * 0.12, r * 0.07, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = '#1d1d24'; ctx.lineWidth = r * 0.045; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(x, y - r * 0.02, r * 0.09, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      }
    });
  }
  function mouth(ctx, hd, m) {
    var id = CORE.MOUTHS[m].id;
    var r = hd.r;
    var y0 = hd.y + r * 0.3;
    ctx.lineCap = 'round';
    if (id === 'pebbles') {
      ctx.fillStyle = '#1d1d24';
      for (var i = 0; i < 6; i++) {
        var a = Math.PI * (0.22 + i * 0.112);
        circle(ctx, hd.x + Math.cos(a) * r * 0.42, hd.y + r * 0.02 + Math.sin(a) * r * 0.36, r * 0.042); ctx.fill();
      }
    } else if (id === 'smile') {
      ctx.strokeStyle = '#3a2a2a'; ctx.lineWidth = r * 0.05;
      ctx.beginPath(); ctx.arc(hd.x, hd.y + r * 0.02, r * 0.36, 0.22 * Math.PI, 0.78 * Math.PI); ctx.stroke();
    } else if (id === 'grin') {
      ctx.fillStyle = '#5a1f2a';
      ctx.beginPath(); ctx.moveTo(hd.x - r * 0.34, y0 - r * 0.06); ctx.quadraticCurveTo(hd.x, y0 + r * 0.42, hd.x + r * 0.34, y0 - r * 0.06); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff7a8a';
      ctx.beginPath(); ctx.ellipse(hd.x, y0 + r * 0.12, r * 0.13, r * 0.06, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.fillRect(hd.x - r * 0.16, y0 - r * 0.04, r * 0.32, r * 0.06);
    } else {
      ctx.fillStyle = '#3a2a2a'; ctx.beginPath(); ctx.ellipse(hd.x, y0 + r * 0.04, r * 0.08, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  function nose(ctx, hd, n) {
    var id = CORE.NOSES[n].id;
    var r = hd.r;
    var x = hd.x;
    var y = hd.y + r * 0.06;
    if (id === 'carrot' || id === 'long') {
      var len = r * (id === 'long' ? 0.95 : 0.55);
      var g = ctx.createLinearGradient(x, y - r * 0.08, x, y + r * 0.08);
      g.addColorStop(0, '#ffa040'); g.addColorStop(1, '#e06a10');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(x - r * 0.04, y - r * 0.09); ctx.quadraticCurveTo(x + len * 0.6, y - r * 0.02, x + len, y + r * 0.03); ctx.quadraticCurveTo(x + len * 0.6, y + r * 0.06, x - r * 0.04, y + r * 0.09); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(150,60,0,0.5)'; ctx.lineWidth = r * 0.015;
      for (var i = 1; i < 4; i++) { var lx = x + len * i * 0.22; ctx.beginPath(); ctx.moveTo(lx, y - r * 0.05 + i * r * 0.01); ctx.lineTo(lx + r * 0.03, y + r * 0.01); ctx.stroke(); }
    } else if (id === 'berry') {
      var bg = ctx.createRadialGradient(x - r * 0.04, y - r * 0.04, r * 0.01, x, y, r * 0.11);
      bg.addColorStop(0, '#ff8a8a'); bg.addColorStop(1, '#c4162a');
      ctx.fillStyle = bg; circle(ctx, x, y, r * 0.11); ctx.fill();
    } else {
      ctx.fillStyle = '#8a5a2b'; ctx.beginPath(); ctx.ellipse(x + r * 0.06, y, r * 0.16, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#5c3a18'; ctx.lineWidth = r * 0.018;
      for (var k = -1; k <= 1; k++) { ctx.beginPath(); ctx.arc(x + r * 0.06 + k * r * 0.07, y, r * 0.06, -0.6 * Math.PI, 0.6 * Math.PI); ctx.stroke(); }
    }
  }
  function hat(ctx, hd, h) {
    var id = CORE.HATS[h].id;
    var r = hd.r;
    var x = hd.x;
    var top = hd.y - r;
    if (id === 'top') {
      ctx.fillStyle = '#1e1e26';
      ctx.beginPath(); ctx.ellipse(x, top + r * 0.18, r * 0.95, r * 0.18, -0.06, 0, Math.PI * 2); ctx.fill();
      roundRect(ctx, x - r * 0.6, top - r * 1.05, r * 1.2, r * 1.2, r * 0.08); ctx.fill();
      ctx.fillStyle = '#c4162a'; ctx.fillRect(x - r * 0.6, top - r * 0.1, r * 1.2, r * 0.2);
      ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x - r * 0.5, top - r * 0.98, r * 0.14, r * 0.8);
    } else if (id === 'beanie') {
      ctx.fillStyle = '#2f8fd6';
      ctx.beginPath(); ctx.moveTo(x - r * 0.88, top + r * 0.38); ctx.quadraticCurveTo(x - r * 0.9, top - r * 0.62, x, top - r * 0.62); ctx.quadraticCurveTo(x + r * 0.9, top - r * 0.62, x + r * 0.88, top + r * 0.38); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = r * 0.03;
      for (var i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x + i * r * 0.22, top + r * 0.2); ctx.lineTo(x + i * r * 0.16, top - r * 0.5); ctx.stroke(); }
      ctx.fillStyle = '#1f6aa8'; roundRect(ctx, x - r * 0.95, top + r * 0.16, r * 1.9, r * 0.3, r * 0.12); ctx.fill();
      ctx.fillStyle = '#ffffff'; circle(ctx, x, top - r * 0.72, r * 0.2); ctx.fill();
    } else if (id === 'santa') {
      ctx.fillStyle = '#d62839';
      ctx.beginPath(); ctx.moveTo(x - r * 0.85, top + r * 0.3); ctx.quadraticCurveTo(x - r * 0.4, top - r * 1.1, x + r * 0.55, top - r * 0.9); ctx.quadraticCurveTo(x + r * 1.0, top - r * 0.6, x + r * 1.05, top - r * 0.1); ctx.quadraticCurveTo(x + r * 0.7, top - r * 0.4, x + r * 0.85, top + r * 0.3); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff'; roundRect(ctx, x - r * 0.95, top + r * 0.12, r * 1.9, r * 0.32, r * 0.16); ctx.fill();
      circle(ctx, x + r * 1.05, top - r * 0.08, r * 0.18); ctx.fill();
    } else if (id === 'bucket') {
      ctx.save();
      ctx.translate(x, top + r * 0.1);
      ctx.rotate(-0.12);
      var g = ctx.createLinearGradient(-r * 0.7, 0, r * 0.7, 0);
      g.addColorStop(0, '#8d99a8'); g.addColorStop(0.45, '#dfe6ee'); g.addColorStop(1, '#7c8796');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-r * 0.75, r * 0.2); ctx.lineTo(-r * 0.55, -r * 0.85); ctx.lineTo(r * 0.55, -r * 0.85); ctx.lineTo(r * 0.75, r * 0.2); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#5f6a78'; ctx.lineWidth = r * 0.04;
      ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.05); ctx.lineTo(r * 0.7, -r * 0.05); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.6); ctx.lineTo(r * 0.6, -r * 0.6); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, -r * 0.4, r * 0.62, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.restore();
    } else if (id === 'earmuffs') {
      ctx.strokeStyle = '#7a5ad6'; ctx.lineWidth = r * 0.1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(x, hd.y - r * 0.05, r * 0.98, 1.08 * Math.PI, 1.92 * Math.PI); ctx.stroke();
      [-1, 1].forEach(function (s) {
        var mx = x + s * r * 0.92;
        var my = hd.y - r * 0.12;
        ctx.fillStyle = '#ff9ec4';
        for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; circle(ctx, mx + Math.cos(a) * r * 0.13, my + Math.sin(a) * r * 0.13, r * 0.12); ctx.fill(); }
        ctx.fillStyle = '#ffc4dc'; circle(ctx, mx, my, r * 0.16); ctx.fill();
      });
    }
  }
  function scarf(ctx, L, s, p) {
    var S = CORE.SCARVES[s];
    if (!S.c) return;
    var hd = L.head;
    var below = L.balls[L.balls.length - 2];
    var ny = hd.y + hd.r * 0.86;
    var w = hd.r * 1.06;
    var th = hd.r * 0.32;
    var col = S.c;
    var pat = CORE.PATTERNS[p].id;
    function deco(x0, y0, x1, y1, vertical) {
      ctx.save();
      ctx.clip();
      if (pat === 'stripes') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        if (vertical) for (var yy = y0 + 12; yy < y1; yy += 34) ctx.fillRect(x0 - 20, yy, x1 - x0 + 40, 13);
        else for (var xx = x0 + 10; xx < x1; xx += 38) ctx.fillRect(xx, y0 - 20, 14, y1 - y0 + 40);
      } else if (pat === 'dots') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        for (var dy = y0 + 10; dy < y1; dy += 26) for (var dx = x0 + 10 + ((dy / 26) % 2) * 13; dx < x1; dx += 26) { circle(ctx, dx, dy, 5.5); ctx.fill(); }
      }
      ctx.restore();
    }
    // 매듭에서 늘어진 꼬리
    var tx = hd.x + w * 0.45;
    var tailLen = Math.min(below.r * 0.95, 190);
    ctx.fillStyle = shade(col, -0.08);
    ctx.beginPath(); ctx.moveTo(tx - th * 0.5, ny); ctx.lineTo(tx + th * 0.55, ny); ctx.lineTo(tx + th * 0.85, ny + tailLen); ctx.lineTo(tx - th * 0.15, ny + tailLen + 6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(tx - th * 0.5, ny); ctx.lineTo(tx + th * 0.55, ny); ctx.lineTo(tx + th * 0.85, ny + tailLen); ctx.lineTo(tx - th * 0.15, ny + tailLen + 6); ctx.closePath();
    deco(tx - th, ny, tx + th, ny + tailLen + 8, true);
    // 술
    ctx.strokeStyle = shade(col, -0.2); ctx.lineWidth = 5;
    for (var f = 0; f < 4; f++) { var fx = tx - th * 0.1 + f * th * 0.26; ctx.beginPath(); ctx.moveTo(fx, ny + tailLen + 2); ctx.lineTo(fx + 3, ny + tailLen + 26); ctx.stroke(); }
    // 목에 감긴 띠
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(hd.x, ny, w, th, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hd.x, ny, w, th, 0, 0, Math.PI * 2);
    deco(hd.x - w, ny - th, hd.x + w, ny + th, false);
    ctx.strokeStyle = shade(col, -0.18); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(hd.x, ny, w, th, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = shade(col, -0.12); circle(ctx, tx, ny, th * 0.55); ctx.fill();
  }
  function branch(ctx, x0, y0, x1, y1, w) {
    ctx.strokeStyle = '#6b4423'; ctx.lineWidth = w; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    var dx = x1 - x0, dy = y1 - y0;
    var fx = x0 + dx * 0.7, fy = y0 + dy * 0.7;
    var a = Math.atan2(dy, dx);
    ctx.lineWidth = w * 0.6;
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + Math.cos(a - 0.7) * 50, fy + Math.sin(a - 0.7) * 50); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + Math.cos(a + 0.6) * 34, y1 + Math.sin(a + 0.6) * 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + Math.cos(a - 0.5) * 30, y1 + Math.sin(a - 0.5) * 30); ctx.stroke();
  }
  function mitten(ctx, x, y, a, col) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(a);
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(18, 0, 34, 27, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(16, -26, 11, 16, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff'; roundRect(ctx, -22, -22, 18, 44, 7); ctx.fill();
    ctx.restore();
  }
  // 팔 끝 위치 [왼쪽, 오른쪽] (새·빗자루가 쓴다)
  function armEnds(L, a) {
    var t = L.torso;
    var id = CORE.ARMS[a].id;
    var y = t.y - t.r * 0.25;
    var reach = Math.min(250, 120 + t.r * 0.8);
    var left = { x0: t.x - t.r * 0.9, y0: y, x: t.x - t.r * 0.9 - reach, y: y - reach * 0.35 };
    var right = { x0: t.x + t.r * 0.9, y0: y, x: t.x + t.r * 0.9 + reach, y: y - reach * 0.35 };
    if (id === 'wave') { right.x = t.x + t.r * 0.9 + reach * 0.55; right.y = y - reach * 1.05; left.y = y + reach * 0.15; }
    return { left: left, right: right, id: id };
  }
  function arms(ctx, L, a, scarfColor) {
    var A = armEnds(L, a);
    if (A.id === 'none') return;
    var w = 16;
    [A.left, A.right].forEach(function (s) {
      branch(ctx, s.x0, s.y0, s.x, s.y, w);
      if (A.id === 'mittens') mitten(ctx, s.x, s.y, Math.atan2(s.y - s.y0, s.x - s.x0), scarfColor || '#e23d4f');
    });
  }
  function buttons(ctx, L) {
    var t = L.torso;
    var n = 3;
    ctx.fillStyle = '#1d1d24';
    for (var i = 0; i < n; i++) { circle(ctx, t.x, t.y - t.r * 0.35 + i * t.r * 0.36, Math.max(9, t.r * 0.075)); ctx.fill(); }
    if (L.balls.length >= 3) { var b = L.balls[0]; for (var j = 0; j < 2; j++) { circle(ctx, b.x, b.y - b.r * 0.45 + j * b.r * 0.32, Math.max(9, b.r * 0.07)); ctx.fill(); } }
  }
  function broom(ctx, L) {
    var b = L.balls[0];
    var x0 = b.x + b.r + 70;
    var top = L.torso.y - L.torso.r * 0.9;
    ctx.save();
    ctx.translate(x0, CORE.GROUND - 10);
    ctx.rotate(0.16);
    var len = CORE.GROUND - 10 - top;
    ctx.fillStyle = '#9a6a3a'; roundRect(ctx, -9, -len, 18, len - 150, 9); ctx.fill();
    ctx.fillStyle = '#c4162a'; ctx.fillRect(-26, -175, 52, 20);
    ctx.fillStyle = '#e8c06a';
    ctx.beginPath(); ctx.moveTo(-24, -160); ctx.lineTo(24, -160); ctx.lineTo(62, 0); ctx.lineTo(-62, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(140,100,30,0.6)'; ctx.lineWidth = 3;
    for (var i = -5; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(i * 4, -158); ctx.lineTo(i * 11, -2); ctx.stroke(); }
    ctx.restore();
  }
  function bird(ctx, x, y, sc, flip) {
    ctx.save();
    ctx.translate(x, y); ctx.scale(sc * (flip ? -1 : 1), sc);
    ctx.fillStyle = '#6b4a35';
    ctx.beginPath(); ctx.ellipse(0, 0, 34, 28, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-28, -4); ctx.lineTo(-58, -16); ctx.lineTo(-52, 6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8553a'; ctx.beginPath(); ctx.ellipse(12, 8, 20, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6b4a35'; circle(ctx, 24, -20, 18); ctx.fill();
    ctx.fillStyle = '#1d1d24'; circle(ctx, 30, -23, 3.5); ctx.fill();
    ctx.fillStyle = '#f4b030'; ctx.beginPath(); ctx.moveTo(40, -20); ctx.lineTo(54, -16); ctx.lineTo(40, -12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5a3a28'; ctx.beginPath(); ctx.ellipse(-6, -2, 20, 12, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-4, 26); ctx.lineTo(-6, 36); ctx.moveTo(8, 26); ctx.lineTo(8, 36); ctx.stroke();
    ctx.restore();
  }
  function birdSpot(L, x) {
    var A = armEnds(L, x.a);
    if (A.id !== 'none') return { x: A.left.x + 30, y: A.left.y - 38, flip: false };
    var hd = L.head;
    var hatId = CORE.HATS[x.h].id;
    if (hatId === 'top') return { x: hd.x - hd.r * 0.15, y: hd.y - hd.r * 2.1 - 30, flip: false };
    return { x: L.torso.x - L.torso.r * 0.75, y: L.torso.y - L.torso.r * 0.75 - 30, flip: false };
  }
  function sparkleSpots(L) {
    var hd = L.head;
    return [[hd.x - hd.r * 2.3, hd.y - hd.r * 0.6, 34], [hd.x + hd.r * 2.4, hd.y - hd.r * 1.2, 26], [hd.x + hd.r * 2.1, hd.y + hd.r * 1.4, 30], [hd.x - hd.r * 2.6, hd.y + hd.r * 1.9, 24], [hd.x + hd.r * 0.2, hd.y - hd.r * 2.6, 22]];
  }
  // 눈사람 전체. stage 0~1 (쌓이는 애니메이션): 0.0~0.45 눈덩이 떨어짐, 그 뒤 얼굴·소품
  function drawMan(ctx, x, stage) {
    var L = CORE.layout(x.b);
    var st = stage == null ? 1 : stage;
    var n = L.balls.length;
    var scarfC = CORE.SCARVES[x.s].c;
    // 그림자
    ctx.fillStyle = 'rgba(40,60,100,0.22)';
    ctx.beginPath(); ctx.ellipse(CX, CORE.GROUND - 6, L.balls[0].r * 1.1, 28, 0, 0, Math.PI * 2); ctx.fill();
    var parts = st >= 0.5;
    if (parts && CORE.hasExtra(x, 'broom')) broom(ctx, L);
    if (parts) arms(ctx, L, x.a, scarfC);
    L.balls.forEach(function (b, i) {
      var t0b = (i / n) * 0.45;
      var p = Math.max(0, Math.min(1, (st - t0b) / (0.45 / n)));
      if (p <= 0) return;
      var ease = 1 - Math.pow(1 - p, 3);
      var bb = { x: b.x, y: b.y - (1 - ease) * 700, r: b.r };
      snowball(ctx, bb);
    });
    if (!parts) return;
    ctx.globalAlpha = Math.min(1, (st - 0.5) / 0.25);
    if (CORE.hasExtra(x, 'buttons')) buttons(ctx, L);
    scarf(ctx, L, x.s, x.p);
    eyes(ctx, L.head, x.e);
    mouth(ctx, L.head, x.m);
    nose(ctx, L.head, x.n);
    hat(ctx, L.head, x.h);
    if (CORE.hasExtra(x, 'bird')) { var bs = birdSpot(L, x); bird(ctx, bs.x, bs.y, 0.95, bs.flip); }
    ctx.globalAlpha = 1;
  }
  function fontParts() {
    var cs = window.getComputedStyle(els.eyebrow);
    return {
      fam: cs.fontFamily || 'sans-serif',
      weight: cs.fontWeight || '700',
      script: (FONTS.script || cs.fontFamily || 'serif') + ',' + (cs.fontFamily || 'sans-serif'),
      scriptWeight: FONTS.scriptWeight || 400
    };
  }
  function nameBanner(ctx, x, F) {
    if (!x.t) return;
    var txt = fmt(C.named, { name: x.t });
    var size = 72;
    var measure = function (s) { return ctx.measureText(s).width; };
    ctx.font = F.scriptWeight + ' ' + size + 'px ' + F.script;
    while (measure(txt) > 860 && size > 44) { size -= 4; ctx.font = F.scriptWeight + ' ' + size + 'px ' + F.script; }
    txt = CORE.fit(measure, txt, 880);
    var w = Math.min(940, measure(txt) + 110);
    var h = size * 1.5 + 20;
    var top = H - 64 - h;
    ctx.fillStyle = 'rgba(14,31,68,0.68)';
    roundRect(ctx, CX - w / 2, top, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 3;
    roundRect(ctx, CX - w / 2, top, w, h, h / 2); ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(140,190,255,0.7)'; ctx.shadowBlur = 16;
    ctx.fillText(txt, CX, top + h / 2 + 2);
    ctx.shadowBlur = 0;
  }
  function footerHost(ctx, x, F) {
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = CORE.SCENES[x.g].id === 'sunny' ? '#36506b' : '#3c3a5a';
    ctx.font = '600 24px ' + F.fam;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText(host, CX, H - 24);
    ctx.globalAlpha = 1;
  }
  // 정적 층 (내리는 눈·반짝임 빼고 전부). stage 가 있으면 쌓이는 중
  function buildLayer(x, stage) {
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    var F = fontParts();
    background(ctx, x.g);
    drawMan(ctx, x, stage);
    if (stage == null || stage >= 1) nameBanner(ctx, x, F);
    footerHost(ctx, x, F);
    return cv;
  }
  var FLAKES = CORE.snowflakes(7, 110);
  function snow(ctx, x, t) {
    var sunny = CORE.SCENES[x.g].id === 'sunny';
    ctx.fillStyle = '#ffffff';
    FLAKES.forEach(function (f, i) {
      if (sunny && i % 3) return; // 맑은 날은 조금만
      var y = t == null ? f.y : (f.y + t * f.sp) % (H + 20) - 10;
      var xx = t == null ? f.x : f.x + Math.sin(t * 0.7 + f.dr) * 16;
      ctx.globalAlpha = sunny ? f.a * 0.8 : f.a;
      circle(ctx, xx, y, f.r); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function sparkles(ctx, x, t) {
    if (!CORE.hasExtra(x, 'flakes')) return;
    var L = CORE.layout(x.b);
    ctx.strokeStyle = '#ffffff';
    sparkleSpots(L).forEach(function (s, i) {
      var a = t == null ? 0.9 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.3));
      ctx.globalAlpha = a;
      ctx.lineWidth = 5;
      ctx.shadowColor = 'rgba(160,210,255,0.9)'; ctx.shadowBlur = 14;
      flakeShape(ctx, s[0], s[1], s[2] * (t == null ? 1 : 0.9 + 0.12 * Math.sin(t * 2 + i)), t == null ? 0 : t * 0.3 + i);
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
  // 받은 눈사람: 눈에 덮인 그림 (흐릿한 실루엣 + 눈 더미)
  function cover(ctx) {
    ctx.fillStyle = 'rgba(240,246,255,0.96)';
    ctx.fillRect(0, 0, W, H);
    var r = CORE.rng(3);
    for (var i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(255,255,255,' + (0.5 + r() * 0.5) + ')';
      circle(ctx, r() * W, 200 + r() * (H - 200), 60 + r() * 120); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(150,190,240,0.7)'; ctx.lineWidth = 6;
    flakeShape(ctx, CX, 520, 120, 0.2);
  }
  // t = 초(움직임), null = 멈춘 한 장
  function paint(cv, layer, x, t, covering) {
    if (cv.width !== W) cv.width = W;
    if (cv.height !== H) cv.height = H;
    var ctx = cv.getContext('2d');
    ctx.drawImage(layer, 0, 0);
    if (covering) { cover(ctx); snow(ctx, x, t); return; }
    sparkles(ctx, x, t);
    snow(ctx, x, t);
  }
  function stageNow() {
    if (!buildAt) return null;
    var p = (Date.now() - buildAt) / BUILD_MS;
    if (p >= 1) { buildAt = 0; return null; }
    return p;
  }
  function layerOf(which, x, stage) {
    if (stage != null) return buildLayer(x, stage);
    var key = CORE.encode(x) + '|' + fontsReady;
    if (!layers[which] || layerKey[which] !== key) { layers[which] = buildLayer(x); layerKey[which] = key; }
    return layers[which];
  }
  function current() {
    if (screen === 'edit') return { cv: els.canvas, x: man, which: 'edit' };
    if (screen === 'end' && shown) return { cv: els.endCanvas, x: shown, which: 'end' };
    return null;
  }
  function drawNow() {
    var c = current();
    if (!c) return false;
    var stage = c.which === 'end' && !covered ? stageNow() : null;
    var moving = !REDUCED.matches;
    paint(c.cv, layerOf(c.which, c.x, stage), c.x, moving ? (Date.now() - t0) / 1000 : null, c.which === 'end' && covered);
    frames++;
    return moving || stage != null;
  }
  function loop(now) {
    raf = 0;
    if (document.hidden) return;
    if (now - lastFrame < 33) { raf = window.requestAnimationFrame(loop); return; }
    lastFrame = now;
    if (drawNow()) raf = window.requestAnimationFrame(loop);
  }
  function kick() {
    if (raf) return;
    raf = window.requestAnimationFrame(function (now) { lastFrame = 0; loop(now); });
  }
  function whenFonts(fn) {
    var jobs = [];
    if (document.fonts) {
      if (FONTS.script && document.fonts.load) jobs.push(document.fonts.load((FONTS.scriptWeight || 400) + ' 60px ' + FONTS.script, 'Aa').catch(function () { return null; }));
      if (document.fonts.ready) jobs.push(document.fonts.ready);
    }
    Promise.all(jobs).then(fn, fn);
  }
  whenFonts(function () { fontsReady = 1; kick(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
  if (REDUCED.addEventListener) REDUCED.addEventListener('change', kick);

  // ================================================================ 선택지 아이콘 (같은 그림 함수, 작은 canvas)
  function icon(ctx, field, v) {
    var S = 96;
    ctx.clearRect(0, 0, S, S);
    ctx.save();
    var base = CORE.defaults();
    if (field === 'b') {
      var L = CORE.layout(v);
      var sc = 84 / (CORE.GROUND - L.top);
      ctx.translate(S / 2 - CX * sc, 92 - CORE.GROUND * sc);
      ctx.scale(sc, sc);
      L.balls.forEach(function (b) { snowball(ctx, b); });
      ctx.restore();
      return;
    }
    if (field === 'g') {
      ctx.beginPath(); ctx.arc(S / 2, S / 2, 44, 0, Math.PI * 2); ctx.clip();
      ctx.translate(S / 2 - CX * 0.1, S / 2 - 720 * 0.1);
      ctx.scale(0.1, 0.1);
      background(ctx, v);
      ctx.restore();
      return;
    }
    // 머리 하나 위에 그 부분만
    var hd = { x: 48, y: 52, r: 30 };
    var face = field === 'e' || field === 'm' || field === 'n';
    if (field === 's' || field === 'p') {
      var col = field === 's' ? CORE.SCARVES[v].c : '#e23d4f';
      if (!col) { noneMark(ctx); ctx.restore(); return; }
      ctx.translate(48 - CX * 0.2, 4 - 520 * 0.2);
      ctx.scale(0.2, 0.2);
      var L2 = CORE.layout(0);
      var hs = { x: CX, y: 520 - 100, r: 120 };
      var lay = { head: hs, balls: [L2.balls[1], hs] };
      scarf(ctx, lay, field === 's' ? v : 0, field === 'p' ? v : 1);
      ctx.restore();
      return;
    }
    if (field === 'a') {
      if (CORE.ARMS[v].id === 'none') { noneMark(ctx); ctx.restore(); return; }
      var L3 = CORE.layout(0);
      ctx.translate(48 - CX * 0.085, 60 - L3.torso.y * 0.085);
      ctx.scale(0.085, 0.085);
      arms(ctx, L3, v, '#e23d4f');
      snowball(ctx, L3.torso);
      ctx.restore();
      return;
    }
    if (field === 'x') {
      var id = CORE.EXTRAS[v].id;
      if (id === 'bird') bird(ctx, 50, 54, 0.75, false);
      else if (id === 'flakes') { ctx.strokeStyle = '#7fb6ff'; ctx.lineWidth = 4; flakeShape(ctx, 48, 48, 32, 0); }
      else if (id === 'buttons') { ctx.fillStyle = '#eef3fa'; circle(ctx, 48, 48, 40); ctx.fill(); ctx.fillStyle = '#1d1d24'; for (var i = 0; i < 3; i++) { circle(ctx, 48, 24 + i * 24, 7); ctx.fill(); } }
      else { var L4 = CORE.layout(0); ctx.translate(48 - (L4.balls[0].r + 70 + CX) * 0.1, 92 - CORE.GROUND * 0.1); ctx.scale(0.1, 0.1); broom(ctx, L4); }
      ctx.restore();
      return;
    }
    if (field === 'h') { hd = { x: 48, y: 66, r: 24 }; }
    if (field === 'h' && CORE.HATS[v].id === 'none') { snowball(ctx, hd); noneMark(ctx); ctx.restore(); return; }
    if (face && field === 'n') hd = { x: 40, y: 48, r: 34 };
    if (face && field !== 'n') hd = { x: 48, y: 48, r: 40 };
    snowball(ctx, hd);
    if (field === 'e') eyes(ctx, hd, v);
    if (field === 'm') mouth(ctx, hd, v);
    if (field === 'n') nose(ctx, hd, v);
    if (field === 'h') hat(ctx, hd, v);
    void base;
    ctx.restore();
  }
  function noneMark(ctx) {
    ctx.strokeStyle = 'rgba(160,175,200,0.9)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    circle(ctx, 48, 48, 26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 66); ctx.lineTo(66, 30); ctx.stroke();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.sm-opt'), function (b) {
    var ic = b.querySelector('canvas');
    if (!ic) return;
    var field = b.getAttribute('data-f') || 'x';
    var v = field === 'x' ? CORE.EXTRAS.map(function (e) { return e.bit; }).indexOf(Number(b.getAttribute('data-bit'))) : Number(b.getAttribute('data-v'));
    try { icon(ic.getContext('2d'), field, v); } catch (e) { /* noop */ }
  });

  // ================================================================ 만들던 눈사람 (localStorage, 이 기기에만)
  function saveDraft() { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(man)); } catch (e) { /* noop */ } }
  function loadDraft() { try { var raw = localStorage.getItem(DRAFT_KEY); return raw ? CORE.normalize(JSON.parse(raw)) : null; } catch (e) { return null; } }
  function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ } }

  // ================================================================ 만들기
  function markStart() {
    if (started) return;
    started = true;
    doneSent = false;
    track('start');
  }
  function syncUi() {
    Array.prototype.forEach.call(document.querySelectorAll('.sm-opt[data-f]'), function (b) {
      var on = man[b.getAttribute('data-f')] === Number(b.getAttribute('data-v'));
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    Array.prototype.forEach.call(document.querySelectorAll('.sm-extra'), function (b) {
      var on = (man.x & Number(b.getAttribute('data-bit'))) !== 0;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    // 목도리 없음이면 무늬는 흐리게
    var noScarf = !CORE.SCARVES[man.s].c;
    Array.prototype.forEach.call(document.querySelectorAll('.sm-opt[data-f="p"]'), function (b) { b.classList.toggle('is-dim', noScarf); });
  }
  function setStep(i, focus) {
    step = Math.max(0, Math.min(CORE.STEPS.length - 1, i));
    panels.forEach(function (p, n) { p.hidden = n !== step; });
    tabs.forEach(function (t, n) {
      t.setAttribute('aria-selected', String(n === step));
      t.classList.toggle('is-on', n === step);
      t.classList.toggle('is-done', n < step);
      t.tabIndex = n === step ? 0 : -1;
    });
    var tab = tabs[step];
    if (tab && tab.scrollIntoView && els.steps.scrollWidth > els.steps.clientWidth) {
      var left = tab.offsetLeft - (els.steps.clientWidth - tab.offsetWidth) / 2;
      els.steps.scrollTo ? els.steps.scrollTo({ left: left, behavior: 'smooth' }) : (els.steps.scrollLeft = left);
    }
    if (focus && tab) tab.focus();
    els.stepOf.textContent = fmt(E.stepOf, { n: step + 1, max: CORE.STEPS.length });
    els.back.disabled = step === 0;
    var last = step === CORE.STEPS.length - 1;
    els.next.disabled = last;
    els.next.classList.toggle('is-hidden', last);
  }
  function changed() { syncUi(); saveDraft(); kick(); }
  function readName() {
    man.t = CORE.cleanText(els.name.value, CORE.LIMITS.t);
    var n = Array.from(CORE.cleanText(els.name.value, 9999)).length;
    els.nameCount.textContent = fmt(E.counter, { n: Math.min(n, CORE.LIMITS.t), max: CORE.LIMITS.t });
    els.nameCount.classList.toggle('is-full', n >= CORE.LIMITS.t);
  }
  function fillInputs() {
    els.name.value = man.t;
    readName();
    syncUi();
  }
  function startBuild(fresh) {
    var draft = fresh ? null : loadDraft();
    man = draft || CORE.defaults();
    if (fresh) clearDraft();
    ideaAt = -1;
    fillInputs();
    setStep(0);
    show('edit');
  }
  function pick(field, v) {
    if (man[field] === v) return;
    man[field] = v;
    changed();
    track('sm_pick', { f: field, v: v });
  }
  function toggleExtra(bit) {
    man.x ^= bit;
    changed();
  }
  function randomize() {
    man = CORE.randomize((Date.now() % 100000) + randSeed++, man);
    fillInputs();
    saveDraft();
    kick();
    track('sm_random');
  }
  function nextIdea() {
    var list = E.namePresets || [];
    if (!list.length) return;
    ideaAt = (ideaAt + 1) % list.length;
    els.name.value = CORE.cleanText(list[ideaAt], CORE.LIMITS.t);
    readName();
    saveDraft();
    kick();
    track('sm_idea');
  }

  // ================================================================ 끝 화면
  function setEyebrow() {
    if (!friend) { els.eyebrow.textContent = R.eyebrowMine; return; }
    els.eyebrow.textContent = shown.t ? fmt(R.eyebrowFriend, { name: shown.t }) : R.eyebrowFriendNoName;
  }
  function showEnd(x, fromFriend) {
    shown = CORE.copy(x);
    friend = !!fromFriend;
    covered = friend;
    buildAt = !friend && !REDUCED.matches ? Date.now() : 0;
    setEyebrow();
    var alt = shown.t ? R.imageAlt + ' — ' + fmt(C.named, { name: shown.t }) : R.imageAlt;
    els.endTitle.textContent = alt;
    els.endCanvas.setAttribute('aria-label', alt);
    els.reveal.hidden = !covered;
    els.editBtn.hidden = friend;
    els.saveBtn.hidden = covered;
    els.status.textContent = '';
    els.status.classList.remove('is-bad');
    if (window.setRetry) window.setRetry({ label: friend ? R.retryFriend : R.retry, action: retry });
    show('end');
  }
  function reveal() {
    if (!covered) return;
    covered = false;
    buildAt = REDUCED.matches ? 0 : Date.now();
    els.reveal.hidden = true;
    els.saveBtn.hidden = false;
    kick();
    track('sm_reveal');
  }
  function finish() {
    readName();
    var x = CORE.normalize(man);
    if (!x) return;
    man = x;
    saveDraft();
    markStart();
    showEnd(man, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('sm_done', { b: man.b, h: man.h, s: man.s, g: man.g, x: man.x, nm: man.t ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    covered = false;
    started = false;
    markStart();
    startBuild(true);
  }

  // ================================================================ 이미지 저장 (canvas → PNG)
  function status(msg, bad) {
    els.status.textContent = msg || '';
    els.status.classList.toggle('is-bad', !!bad);
  }
  function makePng(x) {
    return new Promise(function (resolve, reject) {
      try {
        var cv = document.createElement('canvas');
        paint(cv, buildLayer(x), x, null, false);
        cv.toBlob(function (blob) { if (blob && blob.size) resolve(blob); else reject(new Error('empty image')); }, 'image/png');
      } catch (e) { reject(e); }
    });
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function saveImage() {
    if (saving || !shown || covered) return;
    saving = true;
    els.saveBtn.disabled = true;
    status(R.saving);
    var x = CORE.copy(shown);
    whenFonts(function () {
      makePng(x).then(function (blob) {
        var name = (R.fileName || 'snowman') + '.png';
        app.lastImage = { w: W, h: H, size: blob.size, type: blob.type };
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
            status(R.saved); track('sm_save', { via: 'share' });
          }, function (err) {
            if (err && err.name === 'AbortError') { status(''); return; }
            download(blob, name); status(R.saved); track('sm_save', { via: 'download' });
          });
        }
        download(blob, name);
        status(R.saved);
        track('sm_save', { via: 'download' });
        return null;
      }).catch(function () {
        status(R.saveFail, true);
        track('sm_save_fail');
      }).then(function () {
        saving = false;
        els.saveBtn.disabled = false;
      });
    });
  }

  // ================================================================ 공유 링크
  function shareUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + (CORE.encode(shown || man) || '');
  }
  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    return CORE.decode(h.slice(3));
  }

  // ================================================================ 이벤트
  els.startBtn.addEventListener('click', function () { markStart(); startBuild(false); });
  document.querySelectorAll('.sm-opts').forEach(function (box) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.sm-opt') : null;
      if (!b) return;
      if (b.hasAttribute('data-bit')) toggleExtra(Number(b.getAttribute('data-bit')));
      else pick(b.getAttribute('data-f'), Number(b.getAttribute('data-v')));
    });
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var f = box.getAttribute('data-group');
      if (f === 'x') return;
      var n = CORE.FIELDS[f].length;
      var next = ((man[f] + (e.key === 'ArrowRight' ? 1 : -1)) % n + n) % n;
      pick(f, next);
      var btn = box.querySelector('.sm-opt[data-v="' + next + '"]');
      if (btn) btn.focus();
      e.preventDefault();
    });
  });
  els.steps.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.sm-step') : null;
    if (t) setStep(Number(t.getAttribute('data-step')));
  });
  els.steps.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    setStep(step + (e.key === 'ArrowRight' ? 1 : -1), true);
    e.preventDefault();
  });
  els.back.addEventListener('click', function () { setStep(step - 1); });
  els.next.addEventListener('click', function () { setStep(step + 1); });
  els.random.addEventListener('click', randomize);
  els.name.addEventListener('input', function () { readName(); saveDraft(); kick(); });
  els.name.addEventListener('blur', function () { els.name.value = CORE.cleanText(els.name.value, CORE.LIMITS.t); readName(); saveDraft(); kick(); });
  els.name.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); els.name.blur(); } });
  els.idea.addEventListener('click', nextIdea);
  els.doneBtn.addEventListener('click', finish);
  els.revealBtn.addEventListener('click', reveal);
  els.saveBtn.addEventListener('click', saveImage);
  els.editBtn.addEventListener('click', function () {
    man = CORE.copy(shown || man);
    fillInputs();
    show('edit');
  });

  if (window.setShareData) {
    window.setShareData(function () {
      var x = shown || man;
      return { title: R.shareTitle, text: x.t ? fmt(R.shareText, { name: x.t }) : R.shareTextNoName, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown)) { showEnd(d, true); track('sm_open_shared'); }
  });

  setStep(0);
  var initial = readHash();
  if (initial) { showEnd(initial, true); track('sm_open_shared'); }
  else show('start');
})();
