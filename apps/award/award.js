/* apps/award/award.js — 상장 만들기: 시작(티징) → 편집기(디자인·상 이름·받는 사람·수상 이유(🎲)·날짜·주는 사람·도장 + canvas 미리보기) → 끝 화면(상장 + PNG 저장 + 공통 끝 화면)
 * 디자인·검증·공유 인코딩·줄바꿈은 award-core.js(AW_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 상장 그림은 canvas 하나(미리보기·끝 화면·PNG 저장이 같은 drawCert, 1240×1754 = A4 비율). 외부 그림 없음 — 도형·글자만.
 * 광고는 편집기 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 편집기를 시작할 때 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 상장 수여식(두루마리 펼치기) → 그 상장을 끝 화면에 보여 준다(start/done 안 셈), 다시 하기 = "나도 만들기".
 * 사용자가 쓴 글은 서버로 보내지 않는다(공유 링크 안에만). 쓰던 상장은 localStorage(award_draft)에만 잠깐 둔다.
 * 사용자 글은 textContent·canvas fillText 로만 쓴다(innerHTML 금지).
 * 디버그/검사용 읽기 전용 핸들: window.AW_APP (card(), shown(), lastImage)
 */
(function () {
  'use strict';

  var CORE = window.AW_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.card || {};
  var O = UI.open || {};
  var R = UI.result || {};
  var FONTS = UI.fonts || {};
  var W = CORE.W;
  var H = CORE.H;
  var EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji"';
  var DRAFT_KEY = 'award_draft';
  var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), open: $('screen-open'), end: $('screen-end'),
    startBtn: $('start-btn'), themes: $('themes'), seals: $('seals'), examples: $('examples'), preview: $('preview-canvas'),
    title: $('f-title'), to: $('f-to'), msg: $('f-msg'), date: $('f-date'), issuer: $('f-issuer'), count: $('msg-count'), dice: $('dice-btn'), doneBtn: $('done-btn'),
    openFor: $('open-for'), scroll: $('open-btn'), openCta: $('open-cta'),
    eyebrow: $('end-eyebrow'), endTitle: $('end-title'), endCanvas: $('end-canvas'),
    saveBtn: $('save-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var card = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 상장 (공유 링크 = 이것)
  var pending = null;    // 수여식에서 펼칠 받은 상장
  var friend = false;    // 공유 링크로 받은 상장을 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var saving = false;
  var opening = false;
  var drawQueued = false;
  var lastReason = -1;
  var app = { lastImage: null, card: function () { return CORE.copy(card); }, shown: function () { return shown && CORE.copy(shown); } };
  window.AW_APP = app;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.open.hidden = name !== 'open';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  function titleOf(x) { return x.ti || C.defaultTitle || ''; }
  function shareUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + (CORE.encode(shown || card) || '');
  }

  // ---------------------------------------------------------------- 상장 그림 (canvas)
  function fontParts() {
    var cs = window.getComputedStyle(els.eyebrow);
    var fam = cs.fontFamily || 'sans-serif';
    return {
      fam: fam + ',' + EMOJI,
      weight: cs.fontWeight || '700',
      serif: (FONTS.serif || 'serif') + ',' + fam + ',' + EMOJI,
      serifWeight: FONTS.serifWeight || 700
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
  function star(ctx, cx, cy, r1, r2, n) {
    ctx.beginPath();
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 ? r2 : r1;
      var a = -Math.PI / 2 + (i * Math.PI) / n;
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
  }
  function heart(ctx, cx, cy, s) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.35);
    ctx.bezierCurveTo(cx - s * 1.1, cy - s * 0.35, cx - s * 0.45, cy - s * 1.05, cx, cy - s * 0.45);
    ctx.bezierCurveTo(cx + s * 0.45, cy - s * 1.05, cx + s * 1.1, cy - s * 0.35, cx, cy + s * 0.35);
    ctx.closePath();
  }
  // 고정된 점 위치(같은 상장 = 같은 그림)
  function seeded(seed) {
    var s = (seed * 2654435761 + 12345) >>> 0;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }

  // 디자인별 배경·테두리
  function frame(ctx, th) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, th.bg[0]);
    g.addColorStop(1, th.bg[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    var i, rnd;
    if (th.style === 'gold') {
      // 잔잔한 무늬 + 금색 두 겹 테두리 + 귀퉁이 장식
      ctx.strokeStyle = 'rgba(184,137,43,0.08)';
      ctx.lineWidth = 2;
      for (i = -H; i < W + H; i += 46) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H, H); ctx.stroke(); }
      ctx.fillStyle = th.paper;
      ctx.fillRect(92, 92, W - 184, H - 184);
      ctx.strokeStyle = th.frame;
      ctx.lineWidth = 22;
      ctx.strokeRect(46, 46, W - 92, H - 92);
      ctx.strokeStyle = th.frame2;
      ctx.lineWidth = 4;
      ctx.strokeRect(78, 78, W - 156, H - 156);
      ctx.strokeRect(96, 96, W - 192, H - 192);
      [[96, 96], [W - 96, 96], [96, H - 96], [W - 96, H - 96]].forEach(function (c) {
        ctx.fillStyle = th.frame;
        ctx.beginPath(); ctx.arc(c[0], c[1], 30, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = th.frame2;
        star(ctx, c[0], c[1], 22, 9, 8); ctx.fill();
        ctx.fillStyle = th.paper;
        ctx.beginPath(); ctx.arc(c[0], c[1], 6, 0, Math.PI * 2); ctx.fill();
      });
    } else if (th.style === 'pastel') {
      rnd = seeded(7);
      var cols = ['#ffd1e3', '#c9ecff', '#fff1b8', '#d9f7d2', '#e8d9ff'];
      for (i = 0; i < 90; i++) {
        var x = rnd() * W, y = rnd() * H;
        if (x > 150 && x < W - 150 && y > 150 && y < H - 150) continue;
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath(); ctx.arc(x, y, 6 + rnd() * 14, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = th.paper;
      roundRect(ctx, 80, 80, W - 160, H - 160, 70); ctx.fill();
      ctx.setLineDash([34, 20]);
      ctx.lineCap = 'round';
      ctx.strokeStyle = th.frame;
      ctx.lineWidth = 12;
      roundRect(ctx, 80, 80, W - 160, H - 160, 70); ctx.stroke();
      ctx.setLineDash([2, 22]);
      ctx.strokeStyle = th.frame2;
      ctx.lineWidth = 10;
      roundRect(ctx, 112, 112, W - 224, H - 224, 52); ctx.stroke();
      ctx.setLineDash([]);
      [[150, 160, '#f49ac1'], [W - 150, 160, '#9ad7f4'], [150, H - 160, '#9ad7f4'], [W - 150, H - 160, '#f49ac1']].forEach(function (c, k) {
        ctx.fillStyle = c[2];
        if (k % 2) { star(ctx, c[0], c[1], 34, 15, 5); ctx.fill(); } else { heart(ctx, c[0], c[1] + 6, 34); ctx.fill(); }
      });
    } else if (th.style === 'minimal') {
      ctx.fillStyle = th.accent;
      ctx.fillRect(0, 0, W, 26);
      ctx.fillRect(0, H - 26, W, 26);
      ctx.strokeStyle = th.frame;
      ctx.lineWidth = 3;
      ctx.strokeRect(84, 84, W - 168, H - 168);
      ctx.strokeStyle = th.frame2;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(100, 100, W - 200, H - 200);
      ctx.fillStyle = th.accent;
      [[84, 84], [W - 84, 84], [84, H - 84], [W - 84, H - 84]].forEach(function (c) { ctx.fillRect(c[0] - 9, c[1] - 9, 18, 18); });
    } else if (th.style === 'ribbon') {
      // 크라프트 종이 결 + 햇살 + 갈색 두 겹 테두리(물결 귀퉁이)
      rnd = seeded(3);
      ctx.fillStyle = 'rgba(122,59,29,0.07)';
      for (i = 0; i < 380; i++) ctx.fillRect(rnd() * W, rnd() * H, 2 + rnd() * 10, 1.5);
      ctx.save();
      ctx.translate(W / 2, 330);
      ctx.fillStyle = 'rgba(201,74,58,0.07)';
      for (i = 0; i < 24; i++) {
        ctx.rotate(Math.PI / 12);
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -900); ctx.lineTo(60, -900); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      ctx.strokeStyle = th.frame;
      ctx.lineWidth = 14;
      roundRect(ctx, 54, 54, W - 108, H - 108, 30); ctx.stroke();
      ctx.lineWidth = 3;
      roundRect(ctx, 86, 86, W - 172, H - 172, 18); ctx.stroke();
      ctx.fillStyle = th.frame2;
      [[86, 86], [W - 86, 86], [86, H - 86], [W - 86, H - 86]].forEach(function (c) {
        for (var k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(c[0], c[1], 20 - k * 6, 0, Math.PI * 2); ctx.fillStyle = k % 2 ? th.paper : th.frame2; ctx.fill(); }
      });
    }
  }
  // 레트로 리본: 머리글 뒤 리본 띠 (꼬리 두 개)
  function ribbonBanner(ctx, th, cy, w) {
    var h = 150;
    var x0 = W / 2 - w / 2;
    ctx.fillStyle = '#8f2620';
    [[x0 - 70, -1], [x0 + w + 70, 1]].forEach(function (t) {
      ctx.beginPath();
      ctx.moveTo(t[0] - t[1] * 0, cy - h / 2 + 30);
      ctx.lineTo(t[0] + t[1] * 120, cy - h / 2 + 30);
      ctx.lineTo(t[0] + t[1] * 90, cy + 15);
      ctx.lineTo(t[0] + t[1] * 120, cy + h / 2 + 30);
      ctx.lineTo(t[0], cy + h / 2 + 30);
      ctx.closePath();
      ctx.fill();
    });
    ctx.fillStyle = '#6e1b16';
    ctx.beginPath(); ctx.moveTo(x0, cy + h / 2); ctx.lineTo(x0 - 70, cy + h / 2 + 30); ctx.lineTo(x0, cy + h / 2 + 30); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x0 + w, cy + h / 2); ctx.lineTo(x0 + w + 70, cy + h / 2 + 30); ctx.lineTo(x0 + w, cy + h / 2 + 30); ctx.closePath(); ctx.fill();
    var g = ctx.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
    g.addColorStop(0, '#d9534a');
    g.addColorStop(1, th.frame2);
    ctx.fillStyle = g;
    ctx.fillRect(x0 - 70, cy - h / 2, w + 140, h);
    ctx.strokeStyle = 'rgba(255,240,210,0.6)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    ctx.strokeRect(x0 - 56, cy - h / 2 + 14, w + 112, h - 28);
    ctx.setLineDash([]);
  }
  // 빨간 도장 (인주 느낌: 조금 기울고 군데군데 빈 곳)
  function redSeal(ctx, cx, cy, r, ch, F, paper) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.14);
    ctx.globalAlpha = 0.9;
    var red = '#d22f27';
    ctx.strokeStyle = red;
    ctx.lineWidth = r * 0.11;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = r * 0.035;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = red;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var size = r * 1.0;
    ctx.font = '900 ' + Math.round(size) + 'px ' + F.serif;
    while (ctx.measureText(ch).width > r * 1.3 && size > 20) { size -= 4; ctx.font = '900 ' + Math.round(size) + 'px ' + F.serif; }
    ctx.fillText(ch, 0, r * 0.06);
    // 인주가 덜 묻은 자리
    var rnd = seeded(ch.codePointAt(0) || 1);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = paper;
    for (var i = 0; i < 26; i++) {
      var a = rnd() * Math.PI * 2, d = rnd() * r * 1.05;
      ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 1.5 + rnd() * 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // 금메달 (톱니 원 + 리본 꼬리 두 개)
  function goldMedal(ctx, cx, cy, r) {
    ctx.save();
    ctx.translate(cx, cy);
    [['#c0392b', -1], ['#2563eb', 1]].forEach(function (t) {
      ctx.fillStyle = t[0];
      ctx.beginPath();
      ctx.moveTo(t[1] * r * 0.15, r * 0.3);
      ctx.lineTo(t[1] * r * 0.75, r * 1.75);
      ctx.lineTo(t[1] * r * 0.45, r * 1.55);
      ctx.lineTo(t[1] * r * 0.25, r * 1.85);
      ctx.lineTo(t[1] * -r * 0.25, r * 0.4);
      ctx.closePath();
      ctx.fill();
    });
    var g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 1.1);
    g.addColorStop(0, '#fff3b0');
    g.addColorStop(0.5, '#f2c84b');
    g.addColorStop(1, '#b8860b');
    ctx.fillStyle = g;
    star(ctx, 0, 0, r * 1.08, r * 0.94, 28); ctx.fill();
    ctx.strokeStyle = '#9a6f08';
    ctx.lineWidth = r * 0.05;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.74, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff7d1';
    star(ctx, 0, 0, r * 0.48, r * 0.2, 5); ctx.fill();
    ctx.restore();
  }

  // 글 배치 (k = 줄임 배율). 아래 칸(날짜·주는 사람)을 침범하면 줄여서 다시.
  function fitFont(ctx, weight, fam, text, maxW, start, min) {
    var size = start;
    ctx.font = weight + ' ' + size + 'px ' + fam;
    while (ctx.measureText(text).width > maxW && size > min) { size -= 2; ctx.font = weight + ' ' + size + 'px ' + fam; }
    return size;
  }
  function plan(ctx, x, th, F, k) {
    var lang = UI.lang;
    var measure = function (s) { return ctx.measureText(s).width; };
    var b = [];
    var y = th.style === 'ribbon' ? 330 : 310;
    // 머리글 (한 줄, 폭에 맞춰 줄임)
    var hs = fitFont(ctx, '900', F.serif, C.heading, 820, Math.round(124 * k), 52);
    b.push({ text: C.heading, font: '900 ' + hs + 'px ' + F.serif, y: y, color: th.style === 'ribbon' ? '#fff6e6' : th.ink, kind: 'heading', w: ctx.measureText(C.heading).width });
    y += Math.round(hs * 0.62) + 70 * k;
    b.push({ divider: true, y: y });
    y += 70 * k;
    // 상 이름 (두 줄까지)
    var ti = titleOf(x);
    var ts = Math.round(92 * k), tl;
    for (; ts > 44; ts -= 4) {
      ctx.font = F.serifWeight + ' ' + ts + 'px ' + F.serif;
      tl = CORE.wrap(measure, ti, 940, lang);
      if (tl.length <= 2) break;
    }
    tl.slice(0, 2).forEach(function (ln) { b.push({ text: ln, font: F.serifWeight + ' ' + ts + 'px ' + F.serif, y: y + ts * 0.5, color: th.accent }); y += ts * 1.3; });
    y += 40 * k;
    // 받는 사람
    if (x.to) {
      var ps = Math.round(38 * k);
      ctx.font = F.weight + ' ' + ps + 'px ' + F.fam;
      CORE.wrap(measure, C.presented, 900, lang).slice(0, 2).forEach(function (ln) { b.push({ text: ln, font: F.weight + ' ' + ps + 'px ' + F.fam, y: y + ps * 0.5, color: th.sub }); y += ps * 1.45; });
      y += 18 * k;
      var nameText = fmt(C.name, { name: x.to });
      var ns = fitFont(ctx, '900', F.serif, nameText, 880, Math.round(104 * k), 40);
      b.push({ text: nameText, font: '900 ' + ns + 'px ' + F.serif, y: y + ns * 0.5, color: th.ink, kind: 'name', w: ctx.measureText(nameText).width, size: ns });
      y += ns * 1.25 + 40 * k;
    }
    // 수상 이유 + 맺음말
    if (x.m) {
      var ms = Math.round(46 * k);
      ctx.font = F.serifWeight + ' ' + ms + 'px ' + F.serif;
      CORE.wrap(measure, x.m, 900, lang).slice(0, 7).forEach(function (ln) { b.push({ text: ln, font: F.serifWeight + ' ' + ms + 'px ' + F.serif, y: y + ms * 0.5, color: th.ink }); y += ms * 1.6; });
      y += 26 * k;
    }
    var cs = Math.round(40 * k);
    ctx.font = F.weight + ' ' + cs + 'px ' + F.fam;
    CORE.wrap(measure, C.closing, 900, lang).slice(0, 3).forEach(function (ln) { b.push({ text: ln, font: F.weight + ' ' + cs + 'px ' + F.fam, y: y + cs * 0.5, color: th.sub }); y += cs * 1.5; });
    return { blocks: b, bottom: y };
  }

  function drawCert(cv, x) {
    var th = CORE.THEMES[x.t];
    var F = fontParts();
    cv.width = W;
    cv.height = H;
    var ctx = cv.getContext('2d');
    frame(ctx, th);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var LIMIT = H - 430;
    var p = plan(ctx, x, th, F, 1);
    for (var k = 0.95; p.bottom > LIMIT && k >= 0.6; k -= 0.05) p = plan(ctx, x, th, F, k);
    var shift = Math.max(0, Math.min(90, (LIMIT - p.bottom) / 2));
    p.blocks.forEach(function (b) {
      if (b.divider) {
        var cy = b.y + shift;
        ctx.strokeStyle = th.frame;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(W / 2 - 260, cy); ctx.lineTo(W / 2 - 40, cy); ctx.moveTo(W / 2 + 40, cy); ctx.lineTo(W / 2 + 260, cy); ctx.stroke();
        ctx.fillStyle = th.frame;
        if (th.style === 'pastel') { heart(ctx, W / 2, cy + 4, 18); ctx.fill(); } else { star(ctx, W / 2, cy, 20, 8, 4); ctx.fill(); }
        return;
      }
      var by = b.kind === 'heading' ? b.y : b.y + shift;
      if (b.kind === 'heading' && th.style === 'ribbon') ribbonBanner(ctx, th, by, Math.min(900, Math.max(420, b.w + 80)));
      ctx.font = b.font;
      ctx.fillStyle = b.color;
      ctx.fillText(b.text, W / 2, by, 980);
      if (b.kind === 'name') {
        ctx.strokeStyle = th.frame;
        ctx.lineWidth = 3;
        var half = Math.min(460, Math.max(220, b.w / 2 + 50));
        ctx.beginPath(); ctx.moveTo(W / 2 - half, by + b.size * 0.62); ctx.lineTo(W / 2 + half, by + b.size * 0.62); ctx.stroke();
      }
    });
    // 아래: 날짜 · 주는 사람 · 도장
    var dateText = CORE.formatDate(x.d, UI.lang);
    ctx.fillStyle = th.sub;
    ctx.font = F.weight + ' 42px ' + F.fam;
    ctx.fillText(dateText, W / 2, H - 360, 900);
    var issuerY = H - 262;
    var iw = 0;
    if (x.is) {
      fitFont(ctx, '900', F.serif, x.is, 620, 64, 34);
      ctx.fillStyle = th.ink;
      ctx.fillText(x.is, W / 2, issuerY, 640);
      iw = Math.min(620, ctx.measureText(x.is).width);
    }
    if (x.s === 1) {
      var ch = CORE.sealChar(x.is, C.sealFallback);
      redSeal(ctx, Math.min(W - 200, W / 2 + Math.max(110, iw / 2 + 96)), issuerY - 4, 82, ch, F, th.paper);
    } else if (x.s === 2) {
      goldMedal(ctx, th.style === 'minimal' ? 250 : 240, H - 330, 92);
    }
    // 맨 아래 주소
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = th.sub;
    ctx.font = '600 24px ' + F.fam;
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText('🏆 ' + host, W / 2, H - 140, 800);
    ctx.globalAlpha = 1;
  }
  function drawPreview() {
    drawQueued = false;
    drawCert(els.preview, card);
  }
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    window.requestAnimationFrame(drawPreview);
  }
  function drawEnd() {
    if (!shown) return;
    drawCert(els.endCanvas, shown);
    els.endCanvas.setAttribute('aria-label', fmt(R.imageAlt, { title: titleOf(shown) }));
  }
  // 웹폰트(특히 canvas 에만 쓰는 상장 글꼴)를 불러온 뒤 다시 그린다
  function whenFonts(fn) {
    var jobs = [];
    if (document.fonts) {
      if (FONTS.serif && document.fonts.load) {
        var sample = [C.heading, C.defaultTitle, C.presented, C.closing].join('');
        jobs.push(document.fonts.load((FONTS.serifWeight || 700) + ' 60px ' + FONTS.serif, sample).catch(function () { return null; }));
        jobs.push(document.fonts.load('900 60px ' + FONTS.serif, sample).catch(function () { return null; }));
      }
      if (document.fonts.ready) jobs.push(document.fonts.ready);
    }
    Promise.all(jobs).then(fn, fn);
  }

  // ---------------------------------------------------------------- 쓰던 상장 (localStorage, 이 기기에만)
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(card)); } catch (e) { /* noop */ }
  }
  function loadDraft() {
    try { var raw = localStorage.getItem(DRAFT_KEY); return raw ? CORE.normalize(JSON.parse(raw)) : null; } catch (e) { return null; }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 편집기
  function readInputs() {
    card.ti = CORE.cleanText(els.title.value, CORE.LIMITS.ti);
    card.to = CORE.cleanText(els.to.value, CORE.LIMITS.to);
    card.m = CORE.cleanText(els.msg.value, CORE.LIMITS.m);
    card.is = CORE.cleanText(els.issuer.value, CORE.LIMITS.is);
    if (CORE.validDate(els.date.value)) card.d = els.date.value;
    updateCount();
  }
  function updateCount() {
    var n = Array.from(CORE.cleanText(els.msg.value, 9999)).length;
    els.count.textContent = fmt(E.counter, { n: Math.min(n, CORE.LIMITS.m), max: CORE.LIMITS.m });
    els.count.classList.toggle('is-full', n >= CORE.LIMITS.m);
  }
  function fillInputs() {
    els.title.value = card.ti;
    els.to.value = card.to;
    els.msg.value = card.m;
    els.issuer.value = card.is;
    els.date.value = card.d;
    updateCount();
    syncChips();
  }
  function syncChips() {
    Array.prototype.forEach.call(els.themes.querySelectorAll('.aw-theme'), function (b) {
      var on = Number(b.getAttribute('data-t')) === card.t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    Array.prototype.forEach.call(els.seals.querySelectorAll('.aw-seal'), function (b) {
      var on = Number(b.getAttribute('data-s')) === card.s;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  function changed() { syncChips(); saveDraft(); queueDraw(); }
  function startCard(fresh) {
    var draft = fresh ? null : loadDraft();
    card = draft || CORE.defaults();
    if (fresh) clearDraft();
    if (!started) { started = true; doneSent = false; track('start'); }
    lastReason = -1;
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  }
  function randomReason() {
    var list = E.reasons || [];
    if (!list.length) return;
    var i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === lastReason) i = (i + 1) % list.length;
    lastReason = i;
    els.msg.value = CORE.cleanText(list[i], CORE.LIMITS.m);
    readInputs();
    saveDraft();
    queueDraw();
    track('aw_dice');
  }

  // ---------------------------------------------------------------- 끝 화면
  function showEnd(x, fromFriend) {
    shown = CORE.copy(x);
    friend = !!fromFriend;
    els.eyebrow.textContent = friend ? (shown.to ? fmt(R.eyebrowFriend, { name: shown.to }) : R.eyebrowFriendNoName) : R.eyebrowMine;
    els.endTitle.textContent = titleOf(shown);
    els.editBtn.hidden = friend;
    els.status.textContent = '';
    els.status.classList.remove('is-bad');
    els.end.classList.toggle('is-friend', friend);
    if (window.setRetry) window.setRetry({ label: friend ? R.retryFriend : R.retry, action: retry });
    show('end');
    drawEnd();
    whenFonts(drawEnd);
  }
  function finish() {
    readInputs();
    var x = CORE.normalize(card);
    if (!x) return;
    card = x;
    saveDraft();
    showEnd(card, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('aw_done', { t: card.t, s: card.s, ti: card.ti ? 1 : 0, to: card.to ? 1 : 0, m: card.m ? 1 : 0, is: card.is ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    started = false;
    startCard(true);
  }

  // ---------------------------------------------------------------- 받은 상장: 수여식 (두루마리 펼치기)
  function showOpen(x) {
    pending = CORE.copy(x);
    opening = false;
    els.open.classList.remove('is-opening');
    els.openFor.textContent = pending.to ? fmt(O.forName, { name: pending.to }) : O.forNone;
    show('open');
    track('aw_open_shared');
  }
  function openCert() {
    if (!pending || opening) return;
    opening = true;
    var x = pending;
    var go = function () { pending = null; opening = false; showEnd(x, true); };
    if (REDUCED.matches) { go(); return; }
    els.open.classList.add('is-opening');
    window.setTimeout(go, 1200);
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
        drawCert(cv, x);
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
        var name = (R.fileName || 'award-certificate') + '.png';
        app.lastImage = { w: W, h: H, size: blob.size, type: blob.type };
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
            status(R.saved);
            track('aw_save', { via: 'share' });
          }, function (err) {
            if (err && err.name === 'AbortError') { status(''); return; }
            download(blob, name);
            status(R.saved);
            track('aw_save', { via: 'download' });
          });
        }
        download(blob, name);
        status(R.saved);
        track('aw_save', { via: 'download' });
        return null;
      }).catch(function () {
        status(R.saveFail, true);
        track('aw_save_fail');
      }).then(function () {
        saving = false;
        els.saveBtn.disabled = false;
      });
    });
  }

  // ---------------------------------------------------------------- 공유 링크
  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    return CORE.decode(h.slice(3));
  }

  // ---------------------------------------------------------------- 이벤트
  function radioKeys(container, sel, attr, n, set) {
    container.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var cur = set();
      var next = (cur + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
      set(next);
      changed();
      var btn = container.querySelector(sel + '[' + attr + '="' + next + '"]');
      if (btn) btn.focus();
      e.preventDefault();
    });
  }
  els.startBtn.addEventListener('click', function () { startCard(false); });
  els.themes.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.aw-theme') : null;
    if (!b) return;
    card.t = Number(b.getAttribute('data-t'));
    changed();
  });
  els.seals.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.aw-seal') : null;
    if (!b) return;
    card.s = Number(b.getAttribute('data-s'));
    changed();
  });
  els.examples.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.aw-ex') : null;
    if (!b) return;
    els.title.value = CORE.cleanText(b.textContent, CORE.LIMITS.ti);
    readInputs();
    saveDraft();
    queueDraw();
  });
  radioKeys(els.themes, '.aw-theme', 'data-t', CORE.THEMES.length, function (v) { if (v != null) card.t = v; return card.t; });
  radioKeys(els.seals, '.aw-seal', 'data-s', CORE.SEALS.length, function (v) { if (v != null) card.s = v; return card.s; });
  var LIM = { 'f-title': CORE.LIMITS.ti, 'f-to': CORE.LIMITS.to, 'f-msg': CORE.LIMITS.m, 'f-issuer': CORE.LIMITS.is };
  [els.title, els.to, els.msg, els.issuer].forEach(function (el) {
    el.addEventListener('input', function () { readInputs(); saveDraft(); queueDraw(); });
    el.addEventListener('blur', function () {
      el.value = CORE.cleanText(el.value, LIM[el.id]);
      readInputs();
      saveDraft();
      queueDraw();
    });
  });
  els.date.addEventListener('change', function () { readInputs(); saveDraft(); queueDraw(); });
  els.date.addEventListener('blur', function () { if (!CORE.validDate(els.date.value)) els.date.value = card.d; });
  [els.title, els.to].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      if (el === els.title) els.to.focus(); else els.msg.focus();
    });
  });
  els.issuer.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); els.issuer.blur(); }
  });
  els.dice.addEventListener('click', randomReason);
  els.doneBtn.addEventListener('click', finish);
  els.scroll.addEventListener('click', openCert);
  els.openCta.addEventListener('click', openCert);
  els.saveBtn.addEventListener('click', saveImage);
  els.editBtn.addEventListener('click', function () {
    card = CORE.copy(shown || card);
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  });

  // 공통 끝 화면: 공유 = 지금 보이는 상장의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var x = shown || card;
      return { title: R.shareTitle, text: x.to ? fmt(R.shareText, { name: x.to }) : R.shareTextNoName, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown) && !CORE.same(d, pending)) showOpen(d);
  });

  var initial = readHash();
  if (initial) showOpen(initial);
  else show('start');
})();
