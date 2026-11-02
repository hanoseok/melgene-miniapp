/* apps/wrapped/wrapped.js — 시작(티징) → 편집기(테마 + 이름·올해의 한 단어·6칸 + canvas 미리보기) → 끝 화면(카드 + 이미지 저장·텍스트 복사 + 공통 끝 화면)
 * 테마·검증·공유 인코딩·줄바꿈·연도는 wrapped-core.js(WRAPPED_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 카드 그림은 canvas 하나(미리보기·끝 화면·PNG 저장이 같은 drawCard, 1080×1350). 외부 그림 없음 — 도형·이모지만.
 * 연도: 문구에 연도를 쓰지 않는다. {year} = 카드의 y(만들 때 CORE.reviewYear()), {next} = y + 1.
 * 광고는 편집기 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 카드 만들기를 시작할 때 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 그 카드를 바로 끝 화면에 보여 준다(start/done 안 센다), 다시 하기 = "나도 만들기".
 * 쓴 글은 서버로 보내지 않는다(공유 링크 안에만). 쓰던 카드는 localStorage(wrapped_draft)에만 둔다.
 * 디버그/검사용 읽기 전용 핸들: window.WRAPPED_APP (card(), shown(), lastImage, lastCopy)
 */
(function () {
  'use strict';

  var CORE = window.WRAPPED_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.card || {};
  var R = UI.result || {};
  var FONTS = UI.fonts || {};
  var W = CORE.W;
  var H = CORE.H;
  var EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var DRAFT_KEY = 'wrapped_draft';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'),
    startBtn: $('start-btn'), themes: $('themes'), preview: $('preview-canvas'), ideas: $('ideas'),
    word: $('f-w'), hint: $('word-hint'), doneBtn: $('done-btn'),
    eyebrow: $('end-eyebrow'), endTitle: $('end-title'), endCanvas: $('end-canvas'),
    saveBtn: $('save-btn'), copyBtn: $('copy-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  var inputs = Array.prototype.slice.call(document.querySelectorAll('#screen-edit .wr-input[data-k]'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var card = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 카드 (공유 링크 = 이것)
  var friend = false;    // 공유 링크로 받은 카드를 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var saving = false;
  var drawQueued = false;
  var app = { lastImage: null, lastCopy: null, card: function () { return CORE.copy(card); }, shown: function () { return shown && CORE.copy(shown); } };
  window.WRAPPED_APP = app;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function yv(x) { return { year: x.y, next: x.y + 1 }; }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 문구
  function titleOf(x) {
    return x.nm ? fmt(C.titleName, { name: x.nm, year: x.y }) : fmt(C.titleMine, yv(x));
  }
  function rowLabel(x, id) { return fmt(C.rows[id], yv(x)); }
  function cardText(x) {
    var lines = [titleOf(x), C.word + ': ' + x.w];
    CORE.filledRows(x).forEach(function (f) { lines.push(f.emoji + ' ' + rowLabel(x, f.id) + ': ' + x[f.id]); });
    return lines.join('\n');
  }
  function shareUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + (CORE.encode(shown || card) || '');
  }

  // ---------------------------------------------------------------- 카드 그림 (canvas)
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
  function scene(ctx, th) {
    var i;
    if (th.scene === 'blobs') {
      [[0.15, 0.12, 380, 'rgba(255,95,143,0.32)'], [0.92, 0.3, 420, 'rgba(90,180,255,0.22)'], [0.1, 0.9, 420, 'rgba(120,255,200,0.16)'], [0.85, 0.95, 360, 'rgba(255,211,110,0.18)']].forEach(function (b) {
        var g = ctx.createRadialGradient(b[0] * W, b[1] * H, 10, b[0] * W, b[1] * H, b[2]);
        g.addColorStop(0, b[3]);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });
    } else if (th.scene === 'sun') {
      ctx.fillStyle = 'rgba(255,240,200,0.28)';
      ctx.beginPath(); ctx.arc(W * 0.82, 250, 170, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(80,10,60,0.18)';
      for (i = 0; i < 4; i++) { ctx.fillRect(0, H - 120 - i * 44, W, 18); }
    } else if (th.scene === 'dots') {
      ctx.fillStyle = 'rgba(15,122,85,0.12)';
      for (var yy = 40; yy < H; yy += 64) for (var xx = (yy / 64) % 2 ? 40 : 72; xx < W; xx += 64) { ctx.beginPath(); ctx.arc(xx, yy, 5, 0, Math.PI * 2); ctx.fill(); }
    } else if (th.scene === 'stars') {
      ctx.fillStyle = 'rgba(243,199,107,0.16)';
      ctx.beginPath(); ctx.arc(W * 0.86, 200, 120, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = th.bg[1];
      ctx.beginPath(); ctx.arc(W * 0.86 + 50, 170, 110, 0, Math.PI * 2); ctx.fill();
    } else if (th.scene === 'lines') {
      ctx.strokeStyle = 'rgba(120,90,60,0.14)';
      ctx.lineWidth = 2;
      for (var ly = 90; ly < H; ly += 54) { ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(210,72,58,0.3)';
      ctx.beginPath(); ctx.moveTo(84, 0); ctx.lineTo(84, H); ctx.stroke();
    } else if (th.scene === 'bars') {
      var cols = ['rgba(198,255,61,0.16)', 'rgba(61,220,255,0.14)', 'rgba(255,61,190,0.14)'];
      for (i = 0; i < 9; i++) {
        var bh = 120 + ((i * 97) % 260);
        ctx.fillStyle = cols[i % 3];
        ctx.fillRect(40 + i * 114, H - 60 - bh, 70, bh);
      }
    }
  }
  // 목록 칸 배치 (k = 줄임 배율). 맨 아래가 너무 내려가면 줄여서 다시.
  function planRows(ctx, x, F, k, top) {
    var rows = [];
    var y = top;
    var lang = UI.lang;
    var measure = function (s) { return ctx.measureText(s).width; };
    CORE.filledRows(x).forEach(function (f) {
      var lf = F.weight + ' ' + Math.round(30 * k) + 'px ' + F.fam + ',' + EMOJI;
      var vf = F.weight + ' ' + Math.round(44 * k) + 'px ' + F.fam + ',' + EMOJI;
      ctx.font = vf;
      var lines = CORE.wrap(measure, x[f.id], 720, lang).slice(0, 2);
      var lh = Math.round(56 * k);
      var hgt = Math.round(40 * k) + lines.length * lh;
      rows.push({ f: f, label: rowLabel(x, f.id), lf: lf, vf: vf, lines: lines, lh: lh, y: y, h: hgt, k: k });
      y += hgt + Math.round(30 * k);
    });
    return { rows: rows, bottom: y };
  }
  function drawCard(cv, x) {
    var th = CORE.THEMES[x.t];
    var F = fontParts();
    cv.width = W;
    cv.height = H;
    var ctx = cv.getContext('2d');
    var lang = UI.lang;
    var measure = function (s) { return ctx.measureText(s).width; };
    // 배경
    var g = ctx.createLinearGradient(0, 0, W * 0.3, H);
    g.addColorStop(0, th.bg[0]);
    g.addColorStop(0.55, th.bg[1]);
    g.addColorStop(1, th.bg[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    scene(ctx, th);
    ctx.fillStyle = th.accent;
    CORE.sparkles(x.t + 1, 120).forEach(function (s) {
      ctx.globalAlpha = s.a;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    // 커다란 연도(배경)
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'right';
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = th.text;
    ctx.font = '900 300px ' + F.fam;
    ctx.fillText(String(x.y), W - 40, 330);
    ctx.globalAlpha = 1;
    // 머리: 작은 표제 + 제목
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = th.accent;
    ctx.font = F.weight + ' 34px ' + F.fam + ',' + EMOJI;
    ctx.fillText(th.emoji + '  ' + C.kicker, 100, 128);
    var title = titleOf(x);
    var ts = 76;
    for (; ts > 40; ts -= 4) { ctx.font = F.weight + ' ' + ts + 'px ' + F.fam + ',' + EMOJI; if (measure(title) <= 880) break; }
    ctx.fillStyle = th.text;
    ctx.fillText(title, 100, 212);
    // 올해의 한 단어
    ctx.textAlign = 'center';
    ctx.fillStyle = th.sub;
    ctx.font = F.weight + ' 34px ' + F.fam + ',' + EMOJI;
    ctx.fillText(C.word, W / 2, 330);
    var ws = 150;
    var wl;
    for (; ws > 52; ws -= 6) {
      ctx.font = F.scriptWeight + ' ' + ws + 'px ' + F.script + ',' + EMOJI;
      wl = CORE.wrap(measure, x.w, 880, lang);
      if (wl.length <= 1) break;
    }
    wl = (wl || []).slice(0, 2);
    ctx.fillStyle = th.accent;
    ctx.shadowColor = th.accent + '88';
    ctx.shadowBlur = 30;
    var wlh = Math.round(ws * 1.15);
    var wy = 450 - ((wl.length - 1) * wlh) / 2;
    wl.forEach(function (ln, i) { ctx.fillText(ln, W / 2, wy + i * wlh); });
    ctx.shadowBlur = 0;
    // 목록 (빈 칸은 그리지 않는다)
    var top = 600;
    var maxBottom = 1180;
    var p = planRows(ctx, x, F, 1, top + 44);
    for (var k = 0.95; p.bottom > maxBottom && k >= 0.6; k -= 0.05) p = planRows(ctx, x, F, k, top + 44);
    if (p.rows.length) {
      var panelH = p.bottom - top + 10;
      ctx.fillStyle = th.panel;
      roundRect(ctx, 70, top, W - 140, Math.min(panelH, H - top - 110), 40);
      ctx.fill();
      ctx.textAlign = 'left';
      p.rows.forEach(function (r) {
        ctx.textBaseline = 'middle';
        ctx.fillStyle = th.text; // 이모지도 fillStyle 의 투명도를 따르므로 불투명 색으로
        ctx.font = Math.round(r.lh * 0.95) + 'px ' + EMOJI;
        ctx.fillText(r.f.emoji, 118, r.y + r.h / 2);
        ctx.fillStyle = th.sub;
        ctx.font = r.lf;
        ctx.fillText(r.label, 200, r.y + 16 * r.k);
        ctx.fillStyle = th.text;
        ctx.font = r.vf;
        r.lines.forEach(function (ln, i) { ctx.fillText(ln, 200, r.y + 40 * r.k + i * r.lh + r.lh / 2 - 2); });
      });
    }
    // 맨 아래 주소
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = th.text;
    ctx.font = '600 26px ' + F.fam + ',' + EMOJI;
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText('🎁 ' + host, W / 2, H - 64);
    ctx.globalAlpha = 1;
  }
  function drawPreview() {
    drawQueued = false;
    drawCard(els.preview, previewCard());
  }
  // 미리보기: 한 단어가 비어 있으면 자리표시자(…)로 그린다
  function previewCard() {
    var x = CORE.copy(card);
    if (!x.w) x.w = '…';
    return x;
  }
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    window.requestAnimationFrame(drawPreview);
  }
  function drawEnd() {
    if (!shown) return;
    drawCard(els.endCanvas, shown);
    els.endCanvas.setAttribute('aria-label', fmt(R.imageAlt, { word: shown.w, year: shown.y }));
  }
  // 웹폰트(특히 canvas 에만 쓰는 한 단어 글꼴)를 불러온 뒤 다시 그린다
  function whenFonts(fn) {
    var jobs = [];
    if (document.fonts) {
      if (FONTS.script && document.fonts.load) {
        jobs.push(document.fonts.load((FONTS.scriptWeight || 400) + ' 60px ' + FONTS.script, (card.w || '') + (shown ? shown.w : '') + 'Aa').catch(function () { return null; }));
      }
      if (document.fonts.ready) jobs.push(document.fonts.ready);
    }
    Promise.all(jobs).then(fn, fn);
  }

  // ---------------------------------------------------------------- 쓰던 카드 (localStorage, 이 기기에만)
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(card)); } catch (e) { /* noop */ }
  }
  function loadDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      var x = raw ? CORE.normalize(JSON.parse(raw)) : null;
      if (x) x.y = CORE.reviewYear(); // 연도는 언제나 오늘 기준
      return x;
    } catch (e) { return null; }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 편집기
  function readInputs() {
    inputs.forEach(function (el) {
      var k = el.getAttribute('data-k');
      card[k] = CORE.cleanText(el.value, CORE.LIMITS[k]);
    });
  }
  function fillInputs() {
    inputs.forEach(function (el) { el.value = card[el.getAttribute('data-k')] || ''; });
    syncChips();
  }
  function syncChips() {
    Array.prototype.forEach.call(els.themes.querySelectorAll('.wr-theme'), function (b) {
      var on = Number(b.getAttribute('data-t')) === card.t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    Array.prototype.forEach.call(els.ideas.querySelectorAll('.wr-idea'), function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-w') === card.w);
    });
  }
  function hint(msg) {
    els.hint.textContent = msg || '';
    els.word.classList.toggle('is-bad', !!msg);
    if (msg) els.word.setAttribute('aria-invalid', 'true'); else els.word.removeAttribute('aria-invalid');
  }
  function changed() { syncChips(); saveDraft(); queueDraw(); }
  function startCard(fresh) {
    var draft = fresh ? null : loadDraft();
    card = draft || CORE.defaults();
    if (fresh) clearDraft();
    if (!started) { started = true; doneSent = false; track('start'); }
    hint('');
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  }
  function pickIdea(w) {
    els.word.value = w;
    readInputs();
    hint('');
    changed();
    track('wr_idea');
  }

  // ---------------------------------------------------------------- 끝 화면
  function showEnd(x, fromFriend) {
    shown = CORE.copy(x);
    friend = !!fromFriend;
    els.eyebrow.textContent = friend
      ? (shown.nm ? fmt(R.eyebrowFriend, { name: shown.nm, year: shown.y }) : fmt(R.eyebrowFriendNoName, yv(shown)))
      : fmt(R.eyebrowMine, yv(shown));
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
    if (!CORE.canFinish(card)) {
      hint(E.needWord);
      els.word.focus();
      return;
    }
    var x = CORE.normalize(card);
    if (!x) return;
    card = x;
    hint('');
    saveDraft();
    showEnd(card, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('wr_done', { t: card.t, rows: CORE.filledRows(card).length, nm: card.nm ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    started = false;
    startCard(true);
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
        drawCard(cv, x);
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
        var name = (R.fileName || 'year-in-review') + '-' + x.y + '.png';
        app.lastImage = { w: W, h: H, size: blob.size, type: blob.type, name: name };
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
            status(R.saved);
            track('wr_save', { via: 'share' });
          }, function (err) {
            if (err && err.name === 'AbortError') { status(''); return; }
            download(blob, name);
            status(R.saved);
            track('wr_save', { via: 'download' });
          });
        }
        download(blob, name);
        status(R.saved);
        track('wr_save', { via: 'download' });
        return null;
      }).catch(function () {
        status(R.saveFail, true);
        track('wr_save_fail');
      }).then(function () {
        saving = false;
        els.saveBtn.disabled = false;
      });
    });
  }

  // ---------------------------------------------------------------- 텍스트 복사
  function copyText() {
    if (!shown) return;
    var text = cardText(shown) + '\n' + shareUrl();
    app.lastCopy = text;
    function ok() { status(R.copied); track('wr_copy'); }
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
  els.startBtn.addEventListener('click', function () { startCard(false); });
  els.themes.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.wr-theme') : null;
    if (!b) return;
    card.t = Number(b.getAttribute('data-t'));
    changed();
  });
  els.themes.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var n = CORE.THEMES.length;
    card.t = (card.t + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    changed();
    var btn = els.themes.querySelector('.wr-theme[data-t="' + card.t + '"]');
    if (btn) btn.focus();
    e.preventDefault();
  });
  els.ideas.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.wr-idea') : null;
    if (b) pickIdea(b.getAttribute('data-w'));
  });
  inputs.forEach(function (el, i) {
    el.addEventListener('input', function () {
      readInputs();
      if (el === els.word && card.w) hint('');
      changed();
    });
    el.addEventListener('blur', function () {
      var k = el.getAttribute('data-k');
      el.value = CORE.cleanText(el.value, CORE.LIMITS[k]);
      readInputs();
      changed();
    });
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      if (inputs[i + 1]) inputs[i + 1].focus(); else el.blur();
    });
  });
  els.doneBtn.addEventListener('click', finish);
  els.saveBtn.addEventListener('click', saveImage);
  els.copyBtn.addEventListener('click', copyText);
  els.editBtn.addEventListener('click', function () {
    card = CORE.copy(shown || card);
    hint('');
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  });

  // 공통 끝 화면: 공유 = 지금 보이는 카드의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var x = shown || card;
      return { title: R.shareTitle, text: x.nm ? fmt(R.shareText, { name: x.nm, year: x.y }) : fmt(R.shareTextNoName, yv(x)), url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown)) { showEnd(d, true); track('wr_open_shared'); }
  });

  var initial = readHash();
  if (initial) { showEnd(initial, true); track('wr_open_shared'); }
  else show('start');
})();
