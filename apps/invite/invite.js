/* apps/invite/invite.js — 시작(티징) → 편집기(테마·입력 + canvas 미리보기) → 끝 화면(초대장 + 이미지 저장·텍스트 복사 + 공통 끝 화면)
 * 테마·검증·공유 인코딩·줄바꿈은 invite-core.js(INVITE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 초대장 그림은 canvas 하나(미리보기·끝 화면·PNG 저장이 같은 drawCard). 날짜·시간은 Intl 로 그 언어 서식(그레고리력)으로 쓴다.
 * 광고는 편집기 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 한 판(초대장 만들기)을 시작할 때 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 그 초대장을 끝 화면에 바로 보여 주고(start/done 안 센다), 다시 하기 = "나도 만들기".
 * 디버그/검사용 읽기 전용 핸들: window.INVITE_APP (invite(), shown(), lastImage, lastCopy)
 */
(function () {
  'use strict';

  var CORE = window.INVITE_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.card || {};
  var R = UI.result || {};
  var W = 1080;
  var H = 1500;
  var EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'),
    startBtn: $('start-btn'), themes: $('themes'), preview: $('preview-canvas'),
    title: $('f-title'), date: $('f-date'), time: $('f-time'), place: $('f-place'), note: $('f-note'), doneBtn: $('done-btn'),
    eyebrow: $('end-eyebrow'), endTitle: $('end-title'), endCanvas: $('end-canvas'),
    saveBtn: $('save-btn'), copyBtn: $('copy-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var inv = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 초대장 (공유 링크 = 이것)
  var friend = false;    // 공유 링크로 받은 초대장을 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var saving = false;
  var drawQueued = false;
  var app = { lastImage: null, lastCopy: null, invite: function () { return CORE.copy(inv); }, shown: function () { return shown && CORE.copy(shown); } };
  window.INVITE_APP = app;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 문구·서식
  function locale() {
    var l = UI.lang || document.documentElement.lang || 'en';
    return (l === 'pt' ? 'pt-BR' : l) + '-u-ca-gregory';
  }
  function dateText(d) {
    if (!d || !CORE.validDate(d)) return '';
    var p = d.split('-');
    try {
      return new Intl.DateTimeFormat(locale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(+p[0], +p[1] - 1, +p[2], 12));
    } catch (e) { return d; }
  }
  function timeText(h) {
    if (!h || !CORE.validTime(h)) return '';
    var p = h.split(':');
    try {
      return new Intl.DateTimeFormat(locale(), { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, +p[0], +p[1]));
    } catch (e) { return h; }
  }
  function titleOf(x) { return x.n || C.defaultTitle; }
  function inviteText(x) {
    var lines = [titleOf(x)];
    var d = dateText(x.d);
    var t = timeText(x.h);
    if (d) lines.push('📅 ' + d);
    if (t) lines.push('🕖 ' + t);
    if (x.p) lines.push('📍 ' + x.p);
    if (x.m) lines.push(x.m);
    return lines.join('\n');
  }
  function shareUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + (CORE.encode(shown || inv) || '');
  }

  // ---------------------------------------------------------------- 초대장 그림 (canvas)
  function fontParts() {
    var cs = window.getComputedStyle(els.eyebrow);
    return { fam: cs.fontFamily || 'sans-serif', weight: cs.fontWeight || '700' };
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
  // 글 덩어리 배치 (k = 줄임 배율). 맨 아래가 너무 내려가면 줄여서 다시.
  function plan(ctx, x, F, k) {
    var blocks = [];
    var y = 500;
    var measure = function (s) { return ctx.measureText(s).width; };
    function font(px) { ctx.font = F.weight + ' ' + px + 'px ' + F.fam + ',' + EMOJI; }
    function add(text, px, lh, color, maxW, maxLines, extra) {
      font(px);
      var lines = CORE.wrap(measure, text, maxW).slice(0, maxLines);
      blocks.push({ lines: lines, px: px, lh: lh, y: y, color: color, extra: extra || null });
      y += lines.length * lh;
    }
    add(C.invited, Math.round(46 * k), Math.round(60 * k), x.th.accent, 860, 1);
    y += 24 * k;
    // 제목: 석 줄 안에 들어가는 가장 큰 글자
    var size = Math.round(108 * k);
    var lines;
    for (; size > 40; size -= 4) {
      ctx.font = F.weight + ' ' + size + 'px ' + F.fam + ',' + EMOJI;
      lines = CORE.wrap(measure, titleOf(x.inv), 860);
      if (lines.length <= 3) break;
    }
    blocks.push({ lines: lines.slice(0, 3), px: size, lh: Math.round(size * 1.2), y: y, color: x.th.text, extra: 'title' });
    y += Math.min(3, lines.length) * Math.round(size * 1.2) + 30 * k;
    blocks.push({ divider: true, y: y + 8 * k });
    y += 46 * k;
    var rows = [['📅', x.dateText], ['🕖', x.timeText], ['📍', x.inv.p]];
    rows.forEach(function (r) {
      if (!r[1]) return;
      add(r[0] + ' ' + r[1], Math.round(46 * k), Math.round(60 * k), x.th.text, 860, 3);
      y += 6 * k;
    });
    if (x.inv.m) {
      y += 24 * k;
      add(x.inv.m, Math.round(40 * k), Math.round(54 * k), x.th.sub, 800, 4);
    }
    return { blocks: blocks, bottom: y };
  }
  function drawCard(cv, x) {
    var th = CORE.THEMES[x.inv.t];
    var F = fontParts();
    cv.width = W;
    cv.height = H;
    var ctx = cv.getContext('2d');
    // 배경
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, th.bg[0]);
    g.addColorStop(0.5, th.bg[1]);
    g.addColorStop(1, th.bg[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    var glow = ctx.createRadialGradient(W / 2, 300, 20, W / 2, 300, 340);
    glow.addColorStop(0, th.accent + '55');
    glow.addColorStop(1, th.accent + '00');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 700);
    // 테두리
    ctx.lineWidth = 6;
    ctx.strokeStyle = th.accent + 'aa';
    roundRect(ctx, 36, 36, W - 72, H - 72, 54);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = th.accent + '55';
    roundRect(ctx, 58, 58, W - 116, H - 116, 40);
    ctx.stroke();
    // 장식 이모지
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    th.deco.forEach(function (d) {
      ctx.save();
      ctx.translate(d[1] * W, d[2] * H);
      ctx.rotate(d[4] * Math.PI / 180);
      ctx.globalAlpha = 0.9;
      ctx.font = d[3] + 'px ' + EMOJI;
      ctx.fillText(d[0], 0, 0);
      ctx.restore();
    });
    // 큰 이모지
    ctx.font = '250px ' + EMOJI;
    ctx.fillText(th.emoji, W / 2, 300);
    // 글
    x.th = th;
    var p = plan(ctx, x, F, 1);
    for (var k = 0.95; p.bottom > 1370 && k >= 0.55; k -= 0.05) p = plan(ctx, x, F, k);
    var shift = Math.max(0, Math.min(70, (1370 - p.bottom) / 2));
    p.blocks.forEach(function (b) {
      if (b.divider) {
        var cy = b.y + shift;
        ctx.strokeStyle = th.accent + '88';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 250, cy);
        ctx.lineTo(W / 2 - 34, cy);
        ctx.moveTo(W / 2 + 34, cy);
        ctx.lineTo(W / 2 + 250, cy);
        ctx.stroke();
        ctx.fillStyle = th.accent;
        ctx.beginPath();
        ctx.moveTo(W / 2, cy - 12); ctx.lineTo(W / 2 + 12, cy); ctx.lineTo(W / 2, cy + 12); ctx.lineTo(W / 2 - 12, cy);
        ctx.closePath();
        ctx.fill();
        return;
      }
      ctx.font = F.weight + ' ' + b.px + 'px ' + F.fam + ',' + EMOJI;
      ctx.fillStyle = b.color;
      if (b.extra === 'title') { ctx.shadowColor = th.accent + '99'; ctx.shadowBlur = 28; } else { ctx.shadowBlur = 0; }
      b.lines.forEach(function (ln, i) { ctx.fillText(ln, W / 2, b.y + shift + i * b.lh + b.lh / 2); });
      ctx.shadowBlur = 0;
    });
    // 맨 아래 주소
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = th.text;
    ctx.font = '600 28px ' + F.fam + ',' + EMOJI;
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText(th.emoji + ' ' + host, W / 2, H - 92);
    ctx.globalAlpha = 1;
  }
  function ctxData(x) { return { inv: x, dateText: dateText(x.d), timeText: timeText(x.h) }; }
  function drawPreview() {
    drawQueued = false;
    drawCard(els.preview, ctxData(inv));
  }
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    window.requestAnimationFrame(drawPreview);
  }
  function drawEnd() {
    if (!shown) return;
    drawCard(els.endCanvas, ctxData(shown));
    els.endCanvas.setAttribute('aria-label', fmt(R.imageAlt, { title: titleOf(shown) }));
  }
  function whenFonts(fn) {
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(fn, fn);
  }

  // ---------------------------------------------------------------- 편집기
  function readInputs() {
    inv.n = CORE.cleanText(els.title.value, CORE.LIMITS.n);
    inv.d = CORE.validDate(els.date.value) ? els.date.value : '';
    inv.h = CORE.validTime(els.time.value) ? els.time.value : '';
    inv.p = CORE.cleanText(els.place.value, CORE.LIMITS.p);
    inv.m = CORE.cleanText(els.note.value, CORE.LIMITS.m);
  }
  function fillInputs() {
    els.title.value = inv.n;
    els.date.value = inv.d;
    els.time.value = inv.h;
    els.place.value = inv.p;
    els.note.value = inv.m;
    syncThemes();
  }
  function syncThemes() {
    Array.prototype.forEach.call(els.themes.querySelectorAll('.iv-theme'), function (b) {
      var on = Number(b.getAttribute('data-t')) === inv.t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  function startInvite(fresh) {
    if (fresh) inv = CORE.defaults();
    if (!started) { started = true; doneSent = false; track('start'); }
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  }

  // ---------------------------------------------------------------- 끝 화면
  function showEnd(x, fromFriend) {
    shown = CORE.copy(x);
    friend = !!fromFriend;
    els.eyebrow.textContent = friend ? R.eyebrowFriend : R.eyebrowMine;
    els.endTitle.textContent = titleOf(shown);
    els.editBtn.hidden = friend;
    els.status.textContent = '';
    els.status.classList.remove('is-bad');
    if (window.setRetry) window.setRetry({ label: friend ? R.retryFriend : R.retry, action: retry });
    show('end');
    drawEnd();
    whenFonts(drawEnd);
  }
  function finish() {
    readInputs();
    var x = CORE.normalize(inv);
    if (!x) return;
    inv = x;
    showEnd(inv, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('iv_done', { t: inv.t, date: inv.d ? 1 : 0, time: inv.h ? 1 : 0, place: inv.p ? 1 : 0, note: inv.m ? 1 : 0, named: inv.n ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    started = false;
    startInvite(true);
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
        drawCard(cv, ctxData(x));
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
        var name = (R.fileName || 'party-invitation') + '.png';
        app.lastImage = { w: W, h: H, size: blob.size, type: blob.type };
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
            status(R.saved);
            track('iv_save', { via: 'share' });
          }, function (err) {
            if (err && err.name === 'AbortError') { status(''); return; }
            download(blob, name);
            status(R.saved);
            track('iv_save', { via: 'download' });
          });
        }
        download(blob, name);
        status(R.saved);
        track('iv_save', { via: 'download' });
        return null;
      }).catch(function () {
        status(R.saveFail, true);
        track('iv_save_fail');
      }).then(function () {
        saving = false;
        els.saveBtn.disabled = false;
      });
    });
  }

  // ---------------------------------------------------------------- 텍스트 복사
  function copyText() {
    if (!shown) return;
    var text = inviteText(shown) + '\n' + shareUrl();
    app.lastCopy = text;
    function ok() { status(R.copied); track('iv_copy'); }
    function fail() { status(R.copyFail, true); }
    function legacy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var done = false;
      try { done = document.execCommand('copy'); } catch (e) { done = false; }
      ta.parentNode.removeChild(ta);
      if (done) ok(); else fail();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, legacy);
    else legacy();
  }

  // ---------------------------------------------------------------- 공유 링크
  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    return CORE.decode(h.slice(3));
  }

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { startInvite(true); });
  els.themes.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.iv-theme') : null;
    if (!b) return;
    inv.t = Number(b.getAttribute('data-t'));
    syncThemes();
    queueDraw();
  });
  els.themes.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var n = CORE.THEMES.length;
    inv.t = (inv.t + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    syncThemes();
    var btn = els.themes.querySelector('.iv-theme[data-t="' + inv.t + '"]');
    if (btn) btn.focus();
    queueDraw();
    e.preventDefault();
  });
  [els.title, els.date, els.time, els.place, els.note].forEach(function (el) {
    el.addEventListener('input', function () { readInputs(); queueDraw(); });
    el.addEventListener('change', function () { readInputs(); queueDraw(); });
  });
  [els.title, els.place, els.note].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (el === els.title) els.date.focus(); else if (el === els.place) els.note.focus(); else el.blur();
    });
    el.addEventListener('blur', function () {
      var max = el === els.title ? CORE.LIMITS.n : el === els.place ? CORE.LIMITS.p : CORE.LIMITS.m;
      el.value = CORE.cleanText(el.value, max);
      readInputs();
      queueDraw();
    });
  });
  els.doneBtn.addEventListener('click', finish);
  els.saveBtn.addEventListener('click', saveImage);
  els.copyBtn.addEventListener('click', copyText);
  els.editBtn.addEventListener('click', function () {
    inv = CORE.copy(shown || inv);
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  });

  // 공통 끝 화면: 공유 = 지금 보이는 초대장의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var x = shown || inv;
      return { title: R.shareTitle, text: x.n ? fmt(R.shareText, { title: x.n }) : R.shareTextNoTitle, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown)) { showEnd(d, true); track('iv_open_shared'); }
  });

  var initial = readHash();
  if (initial) {
    showEnd(initial, true);
    track('iv_open_shared');
  } else {
    show('start');
  }
})();
