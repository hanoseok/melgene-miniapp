/* apps/xmascard/xmascard.js — 시작(티징) → 편집기(테마·인사말·장식·이름·메시지 + canvas 미리보기) → 끝 화면(카드 + 이미지 저장·텍스트 복사 + 공통 끝 화면)
 * 테마·검증·공유 인코딩·줄바꿈은 xmascard-core.js(XMAS_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 카드 그림은 canvas 하나(미리보기·끝 화면·PNG 저장이 같은 drawCard, 1080×1350). 외부 그림 없음 — 도형·이모지만.
 * 광고는 편집기 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 카드 만들기를 시작할 때 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 봉투 열기 화면 → 그 카드를 끝 화면에 보여 준다(start/done 안 센다), 다시 하기 = "나도 만들기".
 * 메시지 내용은 서버로 보내지 않는다(공유 링크 안에만). 쓰던 카드는 localStorage(xmascard_draft)에만 잠깐 둔다.
 * 디버그/검사용 읽기 전용 핸들: window.XMAS_APP (card(), shown(), lastImage, lastCopy)
 */
(function () {
  'use strict';

  var CORE = window.XMAS_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var C = UI.card || {};
  var O = UI.open || {};
  var R = UI.result || {};
  var FONTS = UI.fonts || {};
  var W = CORE.W;
  var H = CORE.H;
  var EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  var DRAFT_KEY = 'xmascard_draft';
  var REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), open: $('screen-open'), end: $('screen-end'),
    startBtn: $('start-btn'), themes: $('themes'), greets: $('greetings'), decos: $('decos'), preview: $('preview-canvas'),
    to: $('f-to'), from: $('f-from'), msg: $('f-msg'), count: $('msg-count'), idea: $('idea-btn'), doneBtn: $('done-btn'),
    openFrom: $('open-from'), env: $('open-btn'), openCta: $('open-cta'),
    eyebrow: $('end-eyebrow'), endTitle: $('end-title'), endCanvas: $('end-canvas'),
    saveBtn: $('save-btn'), copyBtn: $('copy-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var card = CORE.defaults(E.defaultGreeting);
  var shown = null;      // 끝 화면에 보이는 카드 (공유 링크 = 이것)
  var pending = null;    // 봉투 안에 든 받은 카드
  var friend = false;    // 공유 링크로 받은 카드를 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var saving = false;
  var opening = false;
  var drawQueued = false;
  var ideaAt = -1;
  var app = { lastImage: null, lastCopy: null, card: function () { return CORE.copy(card); }, shown: function () { return shown && CORE.copy(shown); } };
  window.XMAS_APP = app;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.open.hidden = name !== 'open';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 문구
  function greetingOf(x) { return C.greetings[CORE.GREETINGS[x.g]] || ''; }
  function cardText(x) {
    var lines = [greetingOf(x)];
    if (x.to) lines.push(fmt(C.to, { name: x.to }));
    if (x.m) lines.push(x.m);
    if (x.fr) lines.push(fmt(C.from, { name: x.fr }));
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
  function tree(ctx, x, baseY, w, h, color) {
    ctx.fillStyle = color;
    for (var i = 0; i < 3; i++) {
      var top = baseY - h + i * h * 0.26;
      var half = w * (0.32 + i * 0.12);
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x + half, top + h * 0.42);
      ctx.lineTo(x - half, top + h * 0.42);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillRect(x - w * 0.06, baseY - h * 0.06, w * 0.12, h * 0.1);
  }
  function scene(ctx, th) {
    if (th.scene === 'hills') {
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.beginPath(); ctx.moveTo(0, H - 230); ctx.quadraticCurveTo(W * 0.3, H - 330, W * 0.6, H - 220); ctx.quadraticCurveTo(W * 0.85, H - 150, W, H - 240); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.beginPath(); ctx.moveTo(0, H - 140); ctx.quadraticCurveTo(W * 0.45, H - 230, W, H - 120); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    } else if (th.scene === 'trees') {
      [[0.08, 300, 'rgba(0,0,0,0.25)'], [0.2, 220, 'rgba(0,0,0,0.2)'], [0.82, 260, 'rgba(0,0,0,0.25)'], [0.94, 330, 'rgba(0,0,0,0.2)'], [0.7, 180, 'rgba(0,0,0,0.16)'], [0.32, 160, 'rgba(0,0,0,0.16)']].forEach(function (t) {
        tree(ctx, t[0] * W, H - 40, t[1] * 0.7, t[1], t[2]);
      });
    } else if (th.scene === 'rays') {
      ctx.save();
      ctx.translate(W / 2, 300);
      for (var i = 0; i < 24; i++) {
        ctx.rotate(Math.PI / 12);
        ctx.fillStyle = i % 2 ? 'rgba(243,199,107,0.07)' : 'rgba(243,199,107,0.03)';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, -1100); ctx.lineTo(60, -1100); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    } else if (th.scene === 'dots') {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      for (var yy = 40; yy < H; yy += 70) for (var xx = (yy / 70) % 2 ? 40 : 75; xx < W; xx += 70) { ctx.beginPath(); ctx.arc(xx, yy, 6, 0, Math.PI * 2); ctx.fill(); }
    } else if (th.scene === 'holly') {
      ctx.strokeStyle = 'rgba(255,215,106,0.18)';
      ctx.lineWidth = 2;
      for (var k = -H; k < W; k += 46) { ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k + H, H); ctx.stroke(); }
    }
  }
  function lights(ctx) {
    var cols = ['#ff4d5e', '#ffd25a', '#4dd18a', '#5ab4ff', '#ff8ad8'];
    ctx.strokeStyle = 'rgba(30,30,30,0.55)';
    ctx.lineWidth = 4;
    var y0 = 70;
    var sag = 70;
    ctx.beginPath();
    for (var x = 30; x <= W - 30; x += 6) {
      var t = ((x - 30) / ((W - 60) / 3)) % 1;
      var y = y0 + Math.sin(t * Math.PI) * sag;
      if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    for (var i = 0; i < 16; i++) {
      var bx = 50 + i * ((W - 100) / 15);
      var tt = ((bx - 30) / ((W - 60) / 3)) % 1;
      var by = y0 + Math.sin(tt * Math.PI) * sag + 16;
      var c = cols[i % cols.length];
      var g = ctx.createRadialGradient(bx, by, 2, bx, by, 34);
      g.addColorStop(0, c + 'aa');
      g.addColorStop(1, c + '00');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(bx, by, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.ellipse(bx, by, 11, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(40,40,40,0.8)';
      ctx.fillRect(bx - 6, by - 22, 12, 9);
    }
  }
  // 글 덩어리 배치 (k = 줄임 배율). 맨 아래가 너무 내려가면 줄여서 다시.
  function plan(ctx, x, F, k) {
    var blocks = [];
    var y = 470;
    var lang = UI.lang;
    var measure = function (s) { return ctx.measureText(s).width; };
    // 인사말: 두 줄 안에 들어가는 가장 큰 글자
    var size = Math.round(118 * k);
    var lines;
    for (; size > 44; size -= 4) {
      ctx.font = F.scriptWeight + ' ' + size + 'px ' + F.script + ',' + EMOJI;
      lines = CORE.wrap(measure, greetingOf(x.card), 900, lang);
      if (lines.length <= 2) break;
    }
    var glh = Math.round(size * 1.28);
    blocks.push({ lines: lines.slice(0, 2), font: F.scriptWeight + ' ' + size + 'px ' + F.script + ',' + EMOJI, lh: glh, y: y, color: x.th.accent, extra: 'greeting' });
    y += Math.min(2, lines.length) * glh + 18 * k;
    blocks.push({ divider: true, y: y + 10 * k });
    y += 52 * k;
    function add(text, px, lh, color, maxW, maxLines) {
      var font = F.weight + ' ' + px + 'px ' + F.fam + ',' + EMOJI;
      ctx.font = font;
      var ls = CORE.wrap(measure, text, maxW, lang).slice(0, maxLines);
      blocks.push({ lines: ls, font: font, lh: lh, y: y, color: color });
      y += ls.length * lh;
    }
    if (x.card.to) { add(fmt(C.to, { name: x.card.to }), Math.round(46 * k), Math.round(62 * k), x.th.text, 800, 2); y += 14 * k; }
    if (x.card.m) { add(x.card.m, Math.round(44 * k), Math.round(64 * k), x.th.text, 760, 6); y += 18 * k; }
    if (x.card.fr) add(fmt(C.from, { name: x.card.fr }), Math.round(42 * k), Math.round(58 * k), x.th.sub, 800, 2);
    return { blocks: blocks, bottom: y };
  }
  function drawCard(cv, x) {
    var th = CORE.THEMES[x.card.t];
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
    scene(ctx, th);
    var glow = ctx.createRadialGradient(W / 2, 270, 20, W / 2, 270, 320);
    glow.addColorStop(0, th.accent + '55');
    glow.addColorStop(1, th.accent + '00');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, 640);
    // 눈
    if (CORE.hasDeco(x.card, 'snow')) {
      ctx.fillStyle = th.snow;
      CORE.snowflakes(x.card.t + 1, 160).forEach(function (s) {
        ctx.globalAlpha = s.a;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
    }
    // 테두리
    ctx.lineWidth = 6;
    ctx.strokeStyle = th.accent + 'bb';
    roundRect(ctx, 36, 36, W - 72, H - 72, 54);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.strokeStyle = th.accent + '66';
    roundRect(ctx, 58, 58, W - 116, H - 116, 40);
    ctx.stroke();
    if (CORE.hasDeco(x.card, 'lights')) lights(ctx);
    // 반짝이 장식
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (CORE.hasDeco(x.card, 'sparkle')) {
      th.deco.forEach(function (d) {
        ctx.save();
        ctx.translate(d[1] * W, d[2] * H);
        ctx.rotate(d[4] * Math.PI / 180);
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = th.accent;
        ctx.font = d[3] + 'px ' + EMOJI;
        ctx.fillText(d[0], 0, 0);
        ctx.restore();
      });
    }
    // 큰 이모지
    ctx.font = '230px ' + EMOJI;
    ctx.fillText(th.emoji, W / 2, 270);
    // 글
    x.th = th;
    var p = plan(ctx, x, F, 1);
    for (var k = 0.95; p.bottom > 1190 && k >= 0.55; k -= 0.05) p = plan(ctx, x, F, k);
    var shift = Math.max(0, Math.min(80, (1190 - p.bottom) / 2));
    p.blocks.forEach(function (b) {
      if (b.divider) {
        var cy = b.y + shift;
        ctx.strokeStyle = th.accent + '99';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 240, cy); ctx.lineTo(W / 2 - 36, cy);
        ctx.moveTo(W / 2 + 36, cy); ctx.lineTo(W / 2 + 240, cy);
        ctx.stroke();
        ctx.fillStyle = th.accent;
        ctx.font = '40px ' + EMOJI;
        ctx.fillText('❄', W / 2, cy + 2);
        return;
      }
      ctx.font = b.font;
      ctx.fillStyle = b.color;
      if (b.extra === 'greeting') { ctx.shadowColor = th.accent + '88'; ctx.shadowBlur = 24; } else { ctx.shadowBlur = 0; }
      b.lines.forEach(function (ln, i) { ctx.fillText(ln, W / 2, b.y + shift + i * b.lh + b.lh / 2); });
      ctx.shadowBlur = 0;
    });
    // 맨 아래 주소
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = th.text;
    ctx.font = '600 26px ' + F.fam + ',' + EMOJI;
    var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
    ctx.fillText(th.emoji + ' ' + host, W / 2, H - 92);
    ctx.globalAlpha = 1;
  }
  function drawPreview() {
    drawQueued = false;
    drawCard(els.preview, { card: card });
  }
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    window.requestAnimationFrame(drawPreview);
  }
  function drawEnd() {
    if (!shown) return;
    drawCard(els.endCanvas, { card: shown });
    els.endCanvas.setAttribute('aria-label', fmt(R.imageAlt, { greeting: greetingOf(shown) }));
  }
  // 웹폰트(특히 canvas 에만 쓰는 인사말 글꼴)를 불러온 뒤 다시 그린다
  function whenFonts(fn) {
    var jobs = [];
    if (document.fonts) {
      if (FONTS.script && document.fonts.load) {
        var sample = C.greetings ? Object.keys(C.greetings).map(function (k) { return C.greetings[k]; }).join('') : 'Aa';
        jobs.push(document.fonts.load((FONTS.scriptWeight || 400) + ' 60px ' + FONTS.script, sample).catch(function () { return null; }));
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
    try { var raw = localStorage.getItem(DRAFT_KEY); return raw ? CORE.normalize(JSON.parse(raw)) : null; } catch (e) { return null; }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 편집기
  function readInputs() {
    card.to = CORE.cleanText(els.to.value, CORE.LIMITS.to);
    card.fr = CORE.cleanText(els.from.value, CORE.LIMITS.fr);
    card.m = CORE.cleanText(els.msg.value, CORE.LIMITS.m);
    updateCount();
  }
  function updateCount() {
    var n = Array.from(CORE.cleanText(els.msg.value, 9999)).length;
    els.count.textContent = fmt(E.counter, { n: Math.min(n, CORE.LIMITS.m), max: CORE.LIMITS.m });
    els.count.classList.toggle('is-full', n >= CORE.LIMITS.m);
  }
  function fillInputs() {
    els.to.value = card.to;
    els.from.value = card.fr;
    els.msg.value = card.m;
    updateCount();
    syncChips();
  }
  function syncChips() {
    Array.prototype.forEach.call(els.themes.querySelectorAll('.xc-theme'), function (b) {
      var on = Number(b.getAttribute('data-t')) === card.t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    Array.prototype.forEach.call(els.greets.querySelectorAll('.xc-greet'), function (b) {
      var on = Number(b.getAttribute('data-g')) === card.g;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    Array.prototype.forEach.call(els.decos.querySelectorAll('.xc-deco'), function (b) {
      var on = (card.o & Number(b.getAttribute('data-bit'))) !== 0;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }
  function changed() { syncChips(); saveDraft(); queueDraw(); }
  function startCard(fresh) {
    var draft = fresh ? null : loadDraft();
    card = draft || CORE.defaults(E.defaultGreeting);
    if (fresh) clearDraft();
    if (!started) { started = true; doneSent = false; track('start'); }
    ideaAt = -1;
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  }
  function nextIdea() {
    var list = E.presets || [];
    if (!list.length) return;
    ideaAt = (ideaAt + 1) % list.length;
    els.msg.value = CORE.cleanText(list[ideaAt], CORE.LIMITS.m);
    readInputs();
    saveDraft();
    queueDraw();
    track('xc_idea');
  }

  // ---------------------------------------------------------------- 끝 화면
  function showEnd(x, fromFriend) {
    shown = CORE.copy(x);
    friend = !!fromFriend;
    els.eyebrow.textContent = friend ? (shown.fr ? fmt(R.eyebrowFriend, { name: shown.fr }) : R.eyebrowFriendNoName) : R.eyebrowMine;
    els.endTitle.textContent = greetingOf(shown);
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
    var x = CORE.normalize(card);
    if (!x) return;
    card = x;
    saveDraft();
    showEnd(card, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('xc_done', { t: card.t, g: card.g, o: card.o, to: card.to ? 1 : 0, fr: card.fr ? 1 : 0, m: card.m ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    started = false;
    startCard(true);
  }

  // ---------------------------------------------------------------- 받은 카드: 봉투 열기
  function showOpen(x) {
    pending = CORE.copy(x);
    opening = false;
    els.open.classList.remove('is-opening');
    els.openFrom.textContent = pending.fr ? fmt(O.fromName, { name: pending.fr }) : O.fromNone;
    show('open');
    track('xc_open_shared');
  }
  function openCard() {
    if (!pending || opening) return;
    opening = true;
    var x = pending;
    var go = function () { pending = null; opening = false; showEnd(x, true); };
    if (REDUCED.matches) { go(); return; }
    els.open.classList.add('is-opening');
    window.setTimeout(go, 1100);
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
        drawCard(cv, { card: x });
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
        var name = (R.fileName || 'christmas-card') + '.png';
        app.lastImage = { w: W, h: H, size: blob.size, type: blob.type };
        var file = null;
        try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
        var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
        if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
          return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
            status(R.saved);
            track('xc_save', { via: 'share' });
          }, function (err) {
            if (err && err.name === 'AbortError') { status(''); return; }
            download(blob, name);
            status(R.saved);
            track('xc_save', { via: 'download' });
          });
        }
        download(blob, name);
        status(R.saved);
        track('xc_save', { via: 'download' });
        return null;
      }).catch(function () {
        status(R.saveFail, true);
        track('xc_save_fail');
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
    function ok() { status(R.copied); track('xc_copy'); }
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
    var b = e.target.closest ? e.target.closest('.xc-theme') : null;
    if (!b) return;
    card.t = Number(b.getAttribute('data-t'));
    changed();
  });
  els.greets.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.xc-greet') : null;
    if (!b) return;
    card.g = Number(b.getAttribute('data-g'));
    changed();
  });
  els.decos.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.xc-deco') : null;
    if (!b) return;
    card.o ^= Number(b.getAttribute('data-bit'));
    changed();
  });
  radioKeys(els.themes, '.xc-theme', 'data-t', CORE.THEMES.length, function (v) { if (v != null) card.t = v; return card.t; });
  radioKeys(els.greets, '.xc-greet', 'data-g', CORE.GREETINGS.length, function (v) { if (v != null) card.g = v; return card.g; });
  [els.to, els.from, els.msg].forEach(function (el) {
    el.addEventListener('input', function () { readInputs(); saveDraft(); queueDraw(); });
    el.addEventListener('blur', function () {
      var max = el === els.to ? CORE.LIMITS.to : el === els.from ? CORE.LIMITS.fr : CORE.LIMITS.m;
      el.value = CORE.cleanText(el.value, max);
      readInputs();
      saveDraft();
      queueDraw();
    });
  });
  [els.to, els.from].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (el === els.to) els.from.focus(); else els.msg.focus();
    });
  });
  els.msg.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); els.msg.blur(); }
  });
  els.idea.addEventListener('click', nextIdea);
  els.doneBtn.addEventListener('click', finish);
  els.env.addEventListener('click', openCard);
  els.openCta.addEventListener('click', openCard);
  els.saveBtn.addEventListener('click', saveImage);
  els.copyBtn.addEventListener('click', copyText);
  els.editBtn.addEventListener('click', function () {
    card = CORE.copy(shown || card);
    fillInputs();
    show('edit');
    drawPreview();
    whenFonts(drawPreview);
  });

  // 공통 끝 화면: 공유 = 지금 보이는 카드의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var x = shown || card;
      return { title: R.shareTitle, text: x.fr ? fmt(R.shareText, { name: x.fr }) : R.shareTextNoName, url: shareUrl() };
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
