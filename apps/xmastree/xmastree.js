/* apps/xmastree/xmastree.js — 시작(티징) → 꾸미기(canvas 트리에 장식 달기·옮기기·지우기, 되돌리기·모두 지우기·자동 꾸미기,
 * 트리 모양·배경·꼭대기·눈·전구, 이름·메시지) → 끝 화면(트리 + 이미지 저장·계속 꾸미기 + 공통 끝 화면)
 * 모양·검증·공유 인코딩·전구·눈 위치는 xmastree-core.js(XTREE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 그림: 정적 층(배경·트리·전구 줄·장식·꼭대기·글)을 화면 밖 canvas 에 한 번 그리고, 매 프레임 그 위에 전구 반짝임·내리는 눈만 더한다.
 *   prefers-reduced-motion 이면 움직이지 않고 한 장만 그린다. PNG 저장도 같은 그림(멈춘 한 장, 1080×1350).
 * 광고는 꾸미기 화면 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 꾸미기를 처음 실제로 할 때(장식 달기·모양 바꾸기 등) track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 그 트리를 끝 화면에 보여 준다(start/done 안 셈), 다시 하기 = "나도 꾸미기".
 * 이름·메시지는 서버로 보내지 않는다(공유 링크 안에만). 꾸미던 트리는 localStorage(xmastree_draft)에만 잠깐 둔다.
 * 디버그/검사용 읽기 전용 핸들: window.XTREE_APP (tree(), shown(), lastImage, frames(), tool())
 */
(function () {
  'use strict';

  var CORE = window.XTREE_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.card || {};
  var R = UI.result || {};
  var FONTS = UI.fonts || {};
  var W = CORE.W;
  var H = CORE.H;
  var CX = CORE.CX;
  var EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var DRAFT_KEY = 'xmastree_draft';
  var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var MAX_UNDO = 60;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'),
    startBtn: $('start-btn'), canvas: $('tree-canvas'), palette: $('palette'), count: $('orn-count'),
    undo: $('undo-btn'), clear: $('clear-btn'), auto: $('auto-btn'), editStatus: $('edit-status'),
    styles: $('styles'), bgs: $('bgs'), toppers: $('toppers'), flags: $('flags'),
    name: $('f-name'), msg: $('f-msg'), msgCount: $('msg-count'), idea: $('idea-btn'), doneBtn: $('done-btn'),
    eyebrow: $('end-eyebrow'), endTitle: $('end-title'), endCanvas: $('end-canvas'),
    saveBtn: $('save-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var tree = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 트리 (공유 링크 = 이것)
  var friend = false;    // 공유 링크로 받은 트리를 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var tool = 0;          // 고른 장식 (KINDS 번호, -1 = 지우개)
  var undoStack = [];
  var drag = null;
  var saving = false;
  var ideaAt = -1;
  var autoSeed = 1;
  var screen = 'start';
  var layers = { edit: null, end: null };
  var layerKey = { edit: '', end: '' };
  var frames = 0;
  var raf = 0;
  var lastFrame = 0;
  var t0 = Date.now();
  var app = {
    lastImage: null,
    tree: function () { return CORE.copy(tree); },
    shown: function () { return shown && CORE.copy(shown); },
    frames: function () { return frames; },
    tool: function () { return tool; }
  };
  window.XTREE_APP = app;

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

  // ---------------------------------------------------------------- 그림 도구
  function fontParts() {
    var cs = window.getComputedStyle(els.eyebrow);
    return {
      fam: cs.fontFamily || 'sans-serif',
      weight: cs.fontWeight || '700',
      script: (FONTS.script || cs.fontFamily || 'serif') + ',' + (cs.fontFamily || 'sans-serif'),
      scriptWeight: FONTS.scriptWeight || 400
    };
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function rnd(seed) {
    var s = (seed * 2654435761 + 7) >>> 0 || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  function starPath(ctx, x, y, r, inner) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5;
      var rr = i % 2 ? r * (inner || 0.45) : r;
      if (i) ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); else ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16);
    var f = function (v) { return Math.max(0, Math.min(255, Math.round(v + amt * 255))); };
    var r = f(n >> 16), g = f((n >> 8) & 255), b = f(n & 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  // ---------------------------------------------------------------- 배경
  function background(ctx, b) {
    var id = CORE.BGS[b].id;
    var g;
    var r = rnd(b + 3);
    if (id === 'night') {
      g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#081433'); g.addColorStop(0.6, '#1a2d61'); g.addColorStop(1, '#2b4580');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#ffffff';
      for (var i = 0; i < 90; i++) { ctx.globalAlpha = 0.3 + r() * 0.6; ctx.beginPath(); ctx.arc(r() * W, r() * 900, 1 + r() * 2.6, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#fff6d5';
      ctx.beginPath(); ctx.arc(900, 170, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a2d61';
      ctx.beginPath(); ctx.arc(876, 152, 56, 0, Math.PI * 2); ctx.fill();
      ground(ctx, '#e9f2ff', '#c9d9f2');
    } else if (id === 'cozy') {
      g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#7a3a2f'); g.addColorStop(1, '#4e2219');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,220,180,0.06)';
      for (var x = 0; x < W; x += 60) ctx.fillRect(x, 0, 26, 1100);
      // 창문
      ctx.fillStyle = '#f2d7a6'; roundRect(ctx, 70, 150, 250, 330, 18); ctx.fill();
      g = ctx.createLinearGradient(0, 165, 0, 465);
      g.addColorStop(0, '#13234f'); g.addColorStop(1, '#2f4d8c');
      ctx.fillStyle = g; roundRect(ctx, 86, 166, 218, 298, 10); ctx.fill();
      ctx.fillStyle = '#ffffff';
      for (var k = 0; k < 22; k++) { ctx.globalAlpha = 0.5 + r() * 0.5; ctx.beginPath(); ctx.arc(92 + r() * 206, 172 + r() * 286, 2 + r() * 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#f2d7a6'; ctx.fillRect(190, 166, 10, 298); ctx.fillRect(86, 310, 218, 10);
      // 바닥
      g = ctx.createLinearGradient(0, 1090, 0, H);
      g.addColorStop(0, '#8a5a34'); g.addColorStop(1, '#5c3a20');
      ctx.fillStyle = g; ctx.fillRect(0, 1090, W, H - 1090);
      ctx.strokeStyle = 'rgba(40,20,8,0.35)'; ctx.lineWidth = 3;
      for (var y = 1130; y < H; y += 46) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.fillStyle = 'rgba(178,34,52,0.55)';
      ctx.beginPath(); ctx.ellipse(CX, 1150, 470, 70, 0, 0, Math.PI * 2); ctx.fill();
    } else if (id === 'snowfield') {
      g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#7fc0f2'); g.addColorStop(0.7, '#cfe9ff'); g.addColorStop(1, '#eef7ff');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.beginPath(); ctx.moveTo(0, 900); ctx.quadraticCurveTo(260, 800, 560, 900); ctx.quadraticCurveTo(820, 980, W, 860); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      [[90, 880, 120], [200, 900, 90], [930, 860, 130], [1010, 900, 90]].forEach(function (t) {
        ctx.fillStyle = 'rgba(40,90,80,0.35)';
        ctx.beginPath(); ctx.moveTo(t[0], t[1] - t[2]); ctx.lineTo(t[0] + t[2] * 0.35, t[1]); ctx.lineTo(t[0] - t[2] * 0.35, t[1]); ctx.closePath(); ctx.fill();
      });
      ground(ctx, '#ffffff', '#dfeefa');
    } else {
      g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#c41c33'); g.addColorStop(0.6, '#8a0f20'); g.addColorStop(1, '#5c0814');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,215,106,0.13)'; ctx.lineWidth = 2;
      for (var d = -H; d < W; d += 52) { ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + H, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(d + H, 0); ctx.lineTo(d, H); ctx.stroke(); }
      ctx.fillStyle = 'rgba(255,215,106,0.5)';
      for (var j = 0; j < 40; j++) { ctx.beginPath(); ctx.arc(r() * W, r() * 1050, 2 + r() * 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = 'rgba(40,0,8,0.45)';
      ctx.fillRect(0, 1100, W, H - 1100);
    }
  }
  function ground(ctx, top, bottom) {
    var g = ctx.createLinearGradient(0, 1060, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, 1110); ctx.quadraticCurveTo(CX, 1050, W, 1110); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
  }

  // ---------------------------------------------------------------- 트리
  function drawTree(ctx, s) {
    var st = CORE.STYLES[s];
    var tiers = CORE.tiers(s);
    var bottom = tiers[tiers.length - 1].base;
    var tw = st.tiers === CORE.STYLES[2].tiers ? 42 : 56;
    // 그림자 · 줄기
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(CX, 1112, 300, 26, 0, 0, Math.PI * 2); ctx.fill();
    var tg = ctx.createLinearGradient(CX - tw, 0, CX + tw, 0);
    tg.addColorStop(0, shade(st.trunk, -0.12)); tg.addColorStop(0.5, st.trunk); tg.addColorStop(1, shade(st.trunk, -0.18));
    ctx.fillStyle = tg;
    ctx.fillRect(CX - tw, bottom - 30, tw * 2, 1110 - bottom + 30);
    for (var i = tiers.length - 1; i >= 0; i--) {
      var t = tiers[i];
      var g = ctx.createLinearGradient(CX - t.half, t.top, CX + t.half, t.base);
      g.addColorStop(0, st.leaf[0]); g.addColorStop(0.55, st.leaf[1]); g.addColorStop(1, st.leaf[2]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(CX, t.top);
      ctx.quadraticCurveTo(CX + t.half * 0.45, t.top + (t.base - t.top) * 0.55, CX + t.half, t.base);
      var bumps = Math.max(4, Math.round(t.half / 55));
      var bw = (t.half * 2) / bumps;
      for (var b = 0; b < bumps; b++) {
        var x1 = CX + t.half - (b + 1) * bw;
        ctx.quadraticCurveTo(x1 + bw / 2, t.base + 26, x1, t.base);
      }
      ctx.quadraticCurveTo(CX - t.half * 0.45, t.top + (t.base - t.top) * 0.55, CX, t.top);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = st.edge;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.globalAlpha = 1;
      // 잎 결
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 3;
      for (var n = 1; n < 4; n++) {
        var yy = t.top + (t.base - t.top) * (0.3 + n * 0.17);
        var hh = t.half * (yy - t.top) / (t.base - t.top) * 0.8;
        ctx.beginPath(); ctx.moveTo(CX - hh, yy); ctx.quadraticCurveTo(CX, yy + 22, CX + hh, yy); ctx.stroke();
      }
      if (st.frost) {
        ctx.fillStyle = 'rgba(255,255,255,0.92)';
        for (var f = 0; f < bumps; f++) {
          var fx = CX + t.half - (f + 0.5) * bw;
          ctx.beginPath(); ctx.ellipse(fx, t.base + 4, bw * 0.42, 15, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.beginPath(); ctx.ellipse(CX, t.top + 18, 22, 12, 0, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function lightWires(ctx, s) {
    var L = CORE.lights(s);
    ctx.strokeStyle = 'rgba(20,40,30,0.75)';
    ctx.lineWidth = 3;
    L.wires.forEach(function (w) {
      ctx.beginPath();
      for (var i = 0; i <= 40; i++) {
        var u = i / 40;
        var x = w[0] + (w[1] - w[0]) * u;
        var y = w[2] + 4 * u * (1 - u) * w[3];
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    });
    L.bulbs.forEach(function (b) {
      ctx.fillStyle = 'rgba(30,30,30,0.85)';
      ctx.fillRect(b.x - 5, b.y - 17, 10, 8);
      ctx.fillStyle = shade(b.c, -0.25);
      ctx.beginPath(); ctx.ellipse(b.x, b.y, 9, 13, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  function glows(ctx, s, t) {
    CORE.lights(s).bulbs.forEach(function (b) {
      var a = t == null ? 0.85 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 2.4 + b.ph));
      ctx.globalAlpha = a;
      var g = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, 38);
      g.addColorStop(0, b.c + 'cc');
      g.addColorStop(1, b.c + '00');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(b.x, b.y, 38, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = b.c;
      ctx.beginPath(); ctx.ellipse(b.x, b.y, 9, 13, 0, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // ---------------------------------------------------------------- 장식
  function drawOrn(ctx, k, x, y, sc) {
    var K = CORE.KINDS[k];
    var r = K.r * (sc || 1);
    ctx.save();
    if (K.ball) {
      ctx.fillStyle = '#c9c9c9';
      ctx.fillRect(x - r * 0.22, y - r * 1.16, r * 0.44, r * 0.3);
      ctx.strokeStyle = '#b08a3c'; ctx.lineWidth = Math.max(1, r * 0.06);
      ctx.beginPath(); ctx.arc(x, y - r * 1.26, r * 0.12, 0, Math.PI * 2); ctx.stroke();
      var g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.08, x, y, r);
      g.addColorStop(0, shade(K.ball, 0.35)); g.addColorStop(0.45, K.ball); g.addColorStop(1, shade(K.ball, -0.3));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r * 0.95, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.ellipse(x - r * 0.35, y - r * 0.38, r * 0.2, r * 0.12, -0.7, 0, Math.PI * 2); ctx.fill();
    } else if (K.shape === 'star') {
      var sg = ctx.createLinearGradient(x, y - r, x, y + r);
      sg.addColorStop(0, '#fff3a8'); sg.addColorStop(1, '#f0a81e');
      ctx.fillStyle = sg;
      starPath(ctx, x, y, r, 0.46);
      ctx.fill();
      ctx.strokeStyle = '#b8750a'; ctx.lineWidth = Math.max(1, r * 0.07); ctx.stroke();
    } else if (K.shape === 'cane') {
      ctx.lineCap = 'round';
      var path = function () {
        ctx.beginPath();
        ctx.moveTo(x + r * 0.15, y + r * 0.95);
        ctx.lineTo(x + r * 0.15, y - r * 0.3);
        ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.4, 0, Math.PI, true);
        ctx.lineTo(x - r * 0.65, y - r * 0.05);
      };
      ctx.lineWidth = r * 0.36; ctx.strokeStyle = '#ffffff'; path(); ctx.stroke();
      ctx.setLineDash([r * 0.22, r * 0.22]); ctx.strokeStyle = '#e23d4f'; ctx.lineCap = 'butt'; path(); ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = Math.round(r * 1.9) + 'px ' + EMOJI;
      ctx.fillText(K.emoji, x, y + r * 0.06);
    }
    ctx.restore();
  }
  function drawTopper(ctx, x) {
    var id = CORE.TOPPERS[x.t].id;
    var top = CORE.treeTop(x.s);
    if (id === 'none') return;
    if (id === 'star') {
      var gl = ctx.createRadialGradient(CX, top - 30, 10, CX, top - 30, 150);
      gl.addColorStop(0, 'rgba(255,230,140,0.55)'); gl.addColorStop(1, 'rgba(255,230,140,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(CX, top - 30, 150, 0, Math.PI * 2); ctx.fill();
      drawOrn(ctx, 5, CX, top - 34, 1.9);
      return;
    }
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = (id === 'angel' ? 130 : 112) + 'px ' + EMOJI;
    ctx.fillText(id === 'angel' ? '👼' : '🎀', CX, top - (id === 'angel' ? 46 : 30));
    ctx.restore();
  }
  function banner(ctx, x, F) {
    if (!x.m && !x.n) return;
    var lang = UI.lang;
    var measure = function (s) { return ctx.measureText(s).width; };
    var lines = [];
    var size = 64;
    if (x.m) {
      for (; size > 34; size -= 4) {
        ctx.font = F.scriptWeight + ' ' + size + 'px ' + F.script + ',' + EMOJI;
        lines = CORE.wrap(measure, x.m, 900, lang);
        if (lines.length <= 2) break;
      }
      lines = lines.slice(0, 2);
    }
    var lh = Math.round(size * 1.25);
    var by = x.n ? fmt(C.by, { name: x.n }) : '';
    var h = lines.length * lh + (by ? 56 : 0) + 40;
    var top = H - 40 - h;
    ctx.fillStyle = 'rgba(8,18,14,0.62)';
    roundRect(ctx, 60, top, W - 120, h, 36);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,211,110,0.7)'; ctx.lineWidth = 3;
    roundRect(ctx, 60, top, W - 120, h, 36);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var y = top + 20;
    ctx.fillStyle = '#ffd76a';
    ctx.font = F.scriptWeight + ' ' + size + 'px ' + F.script + ',' + EMOJI;
    ctx.shadowColor = 'rgba(255,215,106,0.5)'; ctx.shadowBlur = 16;
    lines.forEach(function (ln) { ctx.fillText(ln, CX, y + lh / 2); y += lh; });
    ctx.shadowBlur = 0;
    if (by) {
      ctx.fillStyle = '#fff8ec';
      ctx.font = F.weight + ' 38px ' + F.fam + ',' + EMOJI;
      var bl = CORE.wrap(measure, by, 900, lang)[0] || by;
      ctx.fillText(bl, CX, y + 28);
    }
  }
  // 정적 층 (전구 반짝임·눈 빼고 전부)
  function buildLayer(x) {
    var cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    var ctx = cv.getContext('2d');
    var F = fontParts();
    background(ctx, x.b);
    drawTree(ctx, x.s);
    if (CORE.hasFlag(x, 'lights')) lightWires(ctx, x.s);
    x.p.forEach(function (o) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5;
      drawOrn(ctx, o.k, o.x, o.y, 1);
      ctx.restore();
    });
    drawTopper(ctx, x);
    banner(ctx, x, F);
    // 맨 아래 주소
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = CORE.BGS[x.b].id === 'snowfield' ? '#36506b' : '#fff8ec';
    ctx.font = '600 24px ' + F.fam + ',' + EMOJI;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText('🎄 ' + host, CX, H - 20);
    ctx.globalAlpha = 1;
    return cv;
  }
  var FLAKES = CORE.snowflakes(7, 120);
  function snow(ctx, t) {
    ctx.fillStyle = '#ffffff';
    FLAKES.forEach(function (f) {
      var y = t == null ? f.y : (f.y + t * f.sp) % (H + 20) - 10;
      var x = t == null ? f.x : f.x + Math.sin(t * 0.8 + f.dr) * 14;
      ctx.globalAlpha = f.a;
      ctx.beginPath(); ctx.arc(x, y, f.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  // t = 초(움직임), null = 멈춘 한 장
  function paint(cv, layer, x, t) {
    if (cv.width !== W) cv.width = W;
    if (cv.height !== H) cv.height = H;
    var ctx = cv.getContext('2d');
    ctx.drawImage(layer, 0, 0);
    if (CORE.hasFlag(x, 'lights')) glows(ctx, x.s, t);
    if (CORE.hasFlag(x, 'snow')) snow(ctx, t);
  }
  function layerOf(which, x) {
    var key = CORE.encode(x) + '|' + fontsReady;
    if (!layers[which] || layerKey[which] !== key) { layers[which] = buildLayer(x); layerKey[which] = key; }
    return layers[which];
  }
  function current() {
    if (screen === 'edit') return { cv: els.canvas, x: tree, which: 'edit' };
    if (screen === 'end' && shown) return { cv: els.endCanvas, x: shown, which: 'end' };
    return null;
  }
  function drawNow() {
    var c = current();
    if (!c) return;
    var moving = !REDUCED.matches && (CORE.hasFlag(c.x, 'lights') || CORE.hasFlag(c.x, 'snow'));
    paint(c.cv, layerOf(c.which, c.x), c.x, moving ? (Date.now() - t0) / 1000 : null);
    frames++;
    return moving;
  }
  function loop(now) {
    raf = 0;
    if (document.hidden) return;
    if (now - lastFrame < 33) { raf = window.requestAnimationFrame(loop); return; }
    lastFrame = now;
    if (drawNow()) raf = window.requestAnimationFrame(loop);
  }
  // 다시 그리기 (움직임이 있으면 루프가 이어 간다)
  function kick() {
    if (raf) return;
    raf = window.requestAnimationFrame(function (now) { lastFrame = 0; loop(now); });
  }
  var fontsReady = 0;
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

  // 팔레트 아이콘 (같은 drawOrn)
  Array.prototype.forEach.call(els.palette.querySelectorAll('.xt-kind[data-k]'), function (b) {
    var k = Number(b.getAttribute('data-k'));
    var ic = b.querySelector('canvas');
    if (!ic || k < 0) return;
    var ctx = ic.getContext('2d');
    var r = CORE.KINDS[k].r;
    drawOrn(ctx, k, 48, CORE.KINDS[k].ball ? 54 : 48, 34 / r);
  });

  // ---------------------------------------------------------------- 꾸미던 트리 (localStorage, 이 기기에만)
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(tree)); } catch (e) { /* noop */ }
  }
  function loadDraft() {
    try { var raw = localStorage.getItem(DRAFT_KEY); return raw ? CORE.normalize(JSON.parse(raw)) : null; } catch (e) { return null; }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 꾸미기
  function markStart() {
    if (started) return;
    started = true;
    doneSent = false;
    track('start');
  }
  function editStatus(msg) { els.editStatus.textContent = msg || ''; }
  function syncUi() {
    var sync = function (box, sel, attr, val) {
      Array.prototype.forEach.call(box.querySelectorAll(sel), function (b) {
        var on = Number(b.getAttribute(attr)) === val;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-checked', String(on));
        b.tabIndex = on ? 0 : -1;
      });
    };
    sync(els.palette, '.xt-kind', 'data-k', tool);
    sync(els.styles, '.xt-style', 'data-s', tree.s);
    sync(els.bgs, '.xt-bg', 'data-b', tree.b);
    sync(els.toppers, '.xt-topper', 'data-t', tree.t);
    Array.prototype.forEach.call(els.flags.querySelectorAll('.xt-flag'), function (b) {
      var on = (tree.f & Number(b.getAttribute('data-bit'))) !== 0;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    els.count.textContent = fmt(E.count, { n: tree.p.length, max: CORE.LIMITS.orn });
    els.undo.disabled = !undoStack.length;
    els.clear.disabled = !tree.p.length;
    els.auto.disabled = tree.p.length >= CORE.LIMITS.orn;
  }
  function changed() { syncUi(); saveDraft(); kick(); }
  function pushUndo(snap) {
    undoStack.push(CORE.copy(snap || tree));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
  }
  function readInputs() {
    tree.n = CORE.cleanText(els.name.value, CORE.LIMITS.n);
    tree.m = CORE.cleanText(els.msg.value, CORE.LIMITS.m);
    var n = Array.from(CORE.cleanText(els.msg.value, 9999)).length;
    els.msgCount.textContent = fmt(E.counter, { n: Math.min(n, CORE.LIMITS.m), max: CORE.LIMITS.m });
    els.msgCount.classList.toggle('is-full', n >= CORE.LIMITS.m);
  }
  function fillInputs() {
    els.name.value = tree.n;
    els.msg.value = tree.m;
    readInputs();
    syncUi();
  }
  function startTree(fresh) {
    var draft = fresh ? null : loadDraft();
    tree = draft || CORE.defaults();
    if (fresh) clearDraft();
    undoStack = [];
    ideaAt = -1;
    editStatus('');
    fillInputs();
    show('edit');
  }
  function toCanvas(e) {
    var r = els.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  }
  function onDown(e) {
    if (e.button != null && e.button > 0) return;
    var p = toCanvas(e);
    var i = CORE.hit(tree.p, p.x, p.y);
    e.preventDefault();
    if (tool < 0) {
      if (i < 0) return;
      markStart();
      pushUndo();
      tree.p.splice(i, 1);
      editStatus('');
      changed();
      track('xt_erase');
      return;
    }
    if (i >= 0) {
      drag = { i: i, moved: false, snap: CORE.copy(tree), dx: tree.p[i].x - p.x, dy: tree.p[i].y - p.y, id: e.pointerId };
    } else {
      if (tree.p.length >= CORE.LIMITS.orn) { editStatus(E.full); return; }
      markStart();
      pushUndo();
      var q = CORE.clampPos(p.x, p.y);
      tree.p.push({ k: tool, x: q.x, y: q.y });
      drag = { i: tree.p.length - 1, moved: true, snap: null, dx: 0, dy: 0, id: e.pointerId };
      editStatus('');
      changed();
    }
    try { els.canvas.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  }
  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    e.preventDefault();
    var p = toCanvas(e);
    var q = CORE.clampPos(p.x + drag.dx, p.y + drag.dy);
    var o = tree.p[drag.i];
    if (!o || (o.x === q.x && o.y === q.y)) return;
    if (!drag.moved) {
      markStart();
      pushUndo(drag.snap);
      // 옮기는 장식을 맨 위로
      tree.p.splice(drag.i, 1);
      tree.p.push(o);
      drag.i = tree.p.length - 1;
      drag.moved = true;
    }
    o.x = q.x;
    o.y = q.y;
    syncUi();
    kick();
  }
  function onUp(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    drag = null;
    saveDraft();
  }
  function undo() {
    if (!undoStack.length) return;
    markStart();
    tree = undoStack.pop();
    editStatus('');
    fillInputs();
    saveDraft();
    kick();
  }
  function clearAll() {
    if (!tree.p.length) return;
    markStart();
    pushUndo();
    tree.p = [];
    editStatus('');
    changed();
    track('xt_clear');
  }
  function autoDecorate() {
    if (tree.p.length >= CORE.LIMITS.orn) { editStatus(E.full); return; }
    markStart();
    pushUndo();
    tree.p = CORE.autoDecorate(tree.s, (Date.now() % 100000) + autoSeed++, tree.p);
    editStatus('');
    changed();
    track('xt_auto');
  }
  function nextIdea() {
    var list = E.presets || [];
    if (!list.length) return;
    markStart();
    ideaAt = (ideaAt + 1) % list.length;
    els.msg.value = CORE.cleanText(list[ideaAt], CORE.LIMITS.m);
    readInputs();
    saveDraft();
    kick();
    track('xt_idea');
  }

  // ---------------------------------------------------------------- 끝 화면
  function showEnd(x, fromFriend) {
    shown = CORE.copy(x);
    friend = !!fromFriend;
    els.eyebrow.textContent = friend ? (shown.n ? fmt(R.eyebrowFriend, { name: shown.n }) : R.eyebrowFriendNoName) : R.eyebrowMine;
    els.endTitle.textContent = fmt(R.imageAlt, { n: shown.p.length });
    els.endCanvas.setAttribute('aria-label', fmt(R.imageAlt, { n: shown.p.length }));
    els.editBtn.hidden = friend;
    els.status.textContent = '';
    els.status.classList.remove('is-bad');
    if (window.setRetry) window.setRetry({ label: friend ? R.retryFriend : R.retry, action: retry });
    show('end');
  }
  function finish() {
    readInputs();
    var x = CORE.normalize(tree);
    if (!x) return;
    tree = x;
    saveDraft();
    markStart();
    showEnd(tree, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('xt_done', { n: tree.p.length, s: tree.s, b: tree.b, t: tree.t, f: tree.f, m: tree.m ? 1 : 0, nm: tree.n ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    started = false;
    startTree(true);
  }

  // ---------------------------------------------------------------- 이미지 저장 (canvas → PNG)
  function status(msg, bad) {
    els.status.textContent = msg || '';
    els.status.classList.toggle('is-bad', !!bad);
  }
  function makePng(x) {
    return new Promise(function (resolve, reject) {
      try {
        var cv = document.createElement('canvas');
        paint(cv, buildLayer(x), x, null);
        cv.toBlob(function (blob) { if (blob && blob.size) resolve(blob); else reject(new Error('empty image')); }, 'image/png');
      } catch (e) { reject(e); }
    });
  }
  function download(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.parentNode.removeChild(a);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function saveImage() {
    if (saving || !shown) return;
    saving = true;
    els.saveBtn.disabled = true;
    status(R.saving);
    var x = CORE.copy(shown);
    whenFonts(function () {
      makePng(x).then(function (blob) {
        var name = (R.fileName || 'christmas-tree') + '.png';
        app.lastImage = { w: W, h: H, size: blob.size, type: blob.type };
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
            status(R.saved);
            track('xt_save', { via: 'share' });
          }, function (err) {
            if (err && err.name === 'AbortError') { status(''); return; }
            download(blob, name);
            status(R.saved);
            track('xt_save', { via: 'download' });
          });
        }
        download(blob, name);
        status(R.saved);
        track('xt_save', { via: 'download' });
        return null;
      }).catch(function () {
        status(R.saveFail, true);
        track('xt_save_fail');
      }).then(function () {
        saving = false;
        els.saveBtn.disabled = false;
      });
    });
  }

  // ---------------------------------------------------------------- 공유 링크
  function shareUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + (CORE.encode(shown || tree) || '');
  }
  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    return CORE.decode(h.slice(3));
  }

  // ---------------------------------------------------------------- 이벤트
  function radioGroup(box, sel, attr, n, get, set, first) {
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest(sel) : null;
      if (!b) return;
      set(Number(b.getAttribute(attr)));
    });
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var lo = first || 0;
      var size = n - lo;
      var cur = get() - lo;
      var next = ((cur + (e.key === 'ArrowRight' ? 1 : -1)) % size + size) % size + lo;
      set(next);
      var btn = box.querySelector(sel + '[' + attr + '="' + next + '"]');
      if (btn) btn.focus();
      e.preventDefault();
    });
  }
  function setter(key, ev) {
    return function (v) {
      if (tree[key] === v) return;
      markStart();
      pushUndo();
      tree[key] = v;
      changed();
      track(ev, { v: v });
    };
  }
  els.startBtn.addEventListener('click', function () { startTree(false); });
  radioGroup(els.palette, '.xt-kind', 'data-k', CORE.KINDS.length, function () { return tool; }, function (v) { tool = v; editStatus(''); syncUi(); }, -1);
  radioGroup(els.styles, '.xt-style', 'data-s', CORE.STYLES.length, function () { return tree.s; }, setter('s', 'xt_style'));
  radioGroup(els.bgs, '.xt-bg', 'data-b', CORE.BGS.length, function () { return tree.b; }, setter('b', 'xt_bg'));
  radioGroup(els.toppers, '.xt-topper', 'data-t', CORE.TOPPERS.length, function () { return tree.t; }, setter('t', 'xt_topper'));
  els.flags.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.xt-flag') : null;
    if (!b) return;
    markStart();
    pushUndo();
    tree.f ^= Number(b.getAttribute('data-bit'));
    changed();
  });
  els.canvas.addEventListener('pointerdown', onDown);
  els.canvas.addEventListener('pointermove', onMove);
  els.canvas.addEventListener('pointerup', onUp);
  els.canvas.addEventListener('pointercancel', onUp);
  els.canvas.addEventListener('lostpointercapture', onUp);
  els.undo.addEventListener('click', undo);
  els.clear.addEventListener('click', clearAll);
  els.auto.addEventListener('click', autoDecorate);
  [els.name, els.msg].forEach(function (el) {
    el.addEventListener('input', function () { markStart(); readInputs(); saveDraft(); kick(); });
    el.addEventListener('blur', function () {
      el.value = CORE.cleanText(el.value, el === els.name ? CORE.LIMITS.n : CORE.LIMITS.m);
      readInputs();
      saveDraft();
      kick();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      if (el === els.name) els.msg.focus(); else els.msg.blur();
    });
  });
  els.idea.addEventListener('click', nextIdea);
  els.doneBtn.addEventListener('click', finish);
  els.saveBtn.addEventListener('click', saveImage);
  els.editBtn.addEventListener('click', function () {
    tree = CORE.copy(shown || tree);
    fillInputs();
    show('edit');
  });

  // 공통 끝 화면: 공유 = 지금 보이는 트리의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var x = shown || tree;
      return { title: R.shareTitle, text: x.n ? fmt(R.shareText, { name: x.n }) : R.shareTextNoName, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown)) { showEnd(d, true); track('xt_open_shared'); }
  });

  var initial = readHash();
  if (initial) { showEnd(initial, true); track('xt_open_shared'); }
  else show('start');
})();
