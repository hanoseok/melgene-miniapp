/* apps/qr/qr.js — 한 화면 QR코드 생성기: 종류(링크·글자·와이파이·이메일·전화) → 입력 → 실시간 미리보기 → PNG·SVG 저장 / 이미지 복사 (+ 공통 끝 화면)
 * 인코더는 qr-core.js(QR_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 모든 처리는 브라우저 안에서만: 입력한 내용은 저장(localStorage 등)도 전송도 하지 않는다. 공유 버튼은 앱 주소만 공유한다(내용 X).
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(첫 저장 뒤 결과·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 한 판 = 코드를 처음 만든 순간 track('start') → 그 코드를 처음 저장/복사한 순간 track('done').
 *       같은 코드를 PNG·SVG 로 또 저장해도 done 은 한 번. done 뒤 내용·옵션이 바뀌어 새 코드가 생기면 새 판(start 다시).
 * 디버그/검사용 읽기 전용 핸들: window.QR_APP (state(), lastImage, lastSvg, lastCopy)
 */
(function () {
  'use strict';

  var CORE = window.QR_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var R = I.result || {};
  var D = I.defaults || { type: 'link', ecc: 'M', size: 1024, margin: 4, fg: '#111111', bg: '#ffffff' };
  var FILE = I.fileName || 'qr-code';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    types: document.querySelectorAll('[data-type]'), groups: document.querySelectorAll('.qr-fields'),
    link: $('f-link'), text: $('f-text'), ssid: $('f-ssid'), pass: $('f-pass'), sec: $('f-sec'), hidden: $('f-hidden'),
    to: $('f-to'), subject: $('f-subject'), body: $('f-body'), phone: $('f-phone'),
    preview: $('preview'), canvas: $('qr-canvas'), empty: $('qr-empty'), info: $('qr-info'), payload: $('qr-payload'),
    error: $('qr-error'), warn: $('qr-warn'), png: $('dl-png'), svg: $('dl-svg'), copy: $('copy-img'), status: $('status'),
    fg: $('c-fg'), bg: $('c-bg'), reset: $('c-reset'), eccs: document.querySelectorAll('[data-ecc]'), sizes: document.querySelectorAll('[data-size]'),
    margin: $('margin'), marginOut: $('margin-out'), result: $('result'), adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var st = { type: D.type, ecc: D.ecc, size: D.size, margin: D.margin, fg: D.fg, bg: D.bg };
  var qr = null;          // 지금 미리보기의 코드 (QR_CORE.encode 결과)
  var payload = '';
  var codeKey = '';       // 내용 + 옵션 — 같은 코드인지 판단
  var run = { started: false, done: false }; // 한 판: 시작(start) → 저장(done)
  var app = { lastImage: null, lastSvg: null, lastCopy: null };
  var timer = 0;
  var canCopy = !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem && window.isSecureContext);

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  var numFmt = null;
  try { numFmt = new Intl.NumberFormat(I.lang || 'en'); } catch (e) { /* noop */ }
  function num(n) { return numFmt ? numFmt.format(n) : String(n); }
  function status(msg, bad) {
    els.status.textContent = msg || '';
    els.status.classList.toggle('is-bad', !!bad);
  }
  function show(el, text) { el.textContent = text || ''; el.hidden = !text; }

  // ---------------------------------------------------------------- 내용
  function fields() {
    return {
      link: els.link.value, text: els.text.value, ssid: els.ssid.value, password: els.pass.value, auth: els.sec.value, hidden: els.hidden.checked,
      to: els.to.value, subject: els.subject.value, body: els.body.value, phone: els.phone.value
    };
  }
  function setType(t) {
    if (CORE.TYPES.indexOf(t) < 0) return;
    st.type = t;
    els.types.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-type') === t)); });
    els.groups.forEach(function (g) { g.hidden = g.getAttribute('data-for') !== t; });
    update();
  }

  // ---------------------------------------------------------------- 그리기
  function drawTo(canvas, code, px) {
    var ctx = canvas.getContext('2d');
    var n = code.size + st.margin * 2;
    var e = CORE.cellEdges(n, px);
    canvas.width = px; canvas.height = px;
    ctx.fillStyle = st.bg;
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = st.fg;
    for (var y = 0; y < code.size; y++) {
      var row = code.modules[y];
      for (var x = 0; x < code.size; x++) {
        if (!row[x]) continue;
        var run = 1;
        while (x + run < code.size && row[x + run]) run++;
        var x0 = e[x + st.margin], x1 = e[x + run + st.margin], y0 = e[y + st.margin], y1 = e[y + 1 + st.margin];
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        x += run - 1;
      }
    }
  }
  function drawPreview() {
    var css = els.canvas.getBoundingClientRect().width || 280;
    var dpr = Math.min(3, window.devicePixelRatio || 1);
    drawTo(els.canvas, qr, Math.max(120, Math.round(css * dpr)));
  }

  // ---------------------------------------------------------------- 생성 (입력·옵션이 바뀔 때마다)
  function update() {
    clearTimeout(timer);
    timer = 0;
    payload = CORE.buildPayload(st.type, fields());
    var cc = CORE.colorCheck(st.fg, st.bg);
    var warn = '';
    if (cc.low) warn = fmt(U.warnContrast, { ratio: (Math.floor(cc.ratio * 10) / 10).toFixed(1) });
    else if (cc.inverted) warn = U.warnInverted;
    else if (st.margin < 2) warn = U.warnQuiet;
    show(els.warn, warn);
    show(els.error, '');
    qr = null;
    if (payload) {
      try {
        qr = CORE.encode(payload, { ecc: st.ecc });
      } catch (e) {
        qr = null;
        show(els.error, e && e.code === 'TOO_LONG' ? U.tooLong : U.encodeFail);
      }
    }
    var has = !!qr;
    els.preview.classList.toggle('is-empty', !has);
    els.empty.hidden = has;
    els.png.disabled = !has; els.svg.disabled = !has; els.copy.disabled = !has;
    if (!has) {
      var ctx = els.canvas.getContext('2d');
      ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
      els.canvas.setAttribute('aria-label', U.previewLabel);
      show(els.info, '');
      show(els.payload, '');
      return;
    }
    drawPreview();
    var bytes = CORE.utf8Bytes(payload).length;
    els.info.textContent = fmt(U.info, { bytes: num(bytes), v: qr.version, n: qr.size });
    els.info.hidden = false;
    els.canvas.setAttribute('aria-label', fmt(U.previewReady, { v: qr.version }));
    var showPayload = st.type === 'link' || st.type === 'phone' || st.type === 'email';
    show(els.payload, showPayload ? fmt(U.encodes, { value: payload.length > 90 ? payload.slice(0, 88) + '…' : payload }) : '');
    var key = [payload, st.ecc, st.fg, st.bg, st.margin, st.size].join('\u0001');
    if (key !== codeKey) {
      codeKey = key;
      if (run.done) run = { started: false, done: false }; // 저장한 뒤 바뀐 코드 = 새 판
      status('');
    }
    if (!run.started) { run.started = true; track('start'); }
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(update, 120); }

  // ---------------------------------------------------------------- 저장 · 복사
  function pngBlob() {
    return new Promise(function (resolve, reject) {
      var cv = document.createElement('canvas');
      drawTo(cv, qr, st.size);
      cv.toBlob(function (blob) { if (blob && blob.size) resolve(blob); else reject(new Error('empty image')); }, 'image/png');
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
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }
  function finished() {
    if (!run.done) { run.done = true; track('done'); }
    if (els.result.hidden) {
      els.result.hidden = false;
      if (els.adStart) els.adStart.hidden = true; // 끝 화면 광고와 한 화면에 둘이 되지 않게
    }
  }
  function savePng() {
    if (!qr) return;
    if (timer) update();
    pngBlob().then(function (blob) {
      app.lastImage = { w: st.size, h: st.size, size: blob.size, type: blob.type };
      download(blob, FILE + '.png');
      status(U.savedPng);
      finished();
    }).catch(function () { status(U.saveFail, true); });
  }
  function saveSvg() {
    if (!qr) return;
    if (timer) update();
    try {
      var svg = CORE.toSvg(qr, { fg: st.fg, bg: st.bg, margin: st.margin, px: st.size });
      var blob = new Blob([svg], { type: 'image/svg+xml' });
      app.lastSvg = { size: blob.size, type: blob.type, modules: qr.size };
      download(blob, FILE + '.svg');
      status(U.savedSvg);
      finished();
    } catch (e) { status(U.saveFail, true); }
  }
  function copyImage() {
    if (!qr || !canCopy) return;
    if (timer) update();
    var p = pngBlob();
    var item;
    try { item = new window.ClipboardItem({ 'image/png': p }); } catch (e) { status(U.copyFail, true); return; }
    navigator.clipboard.write([item]).then(function () {
      return p.then(function (blob) { app.lastCopy = { size: blob.size, type: blob.type }; });
    }).then(function () {
      status(U.copied);
      finished();
    }).catch(function () { status(U.copyFail, true); });
  }

  // ---------------------------------------------------------------- 옵션
  function radio(list, attr, val) { list.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(val))); }); }
  function setColor(which, v) {
    if (!CORE.parseHex(v)) return;
    st[which] = v.toLowerCase();
    update();
  }

  // 다시 하기 = 새 코드: 지금 종류의 입력을 비우고 입력 칸으로 (옵션은 그대로)
  function again() {
    ['link', 'text', 'ssid', 'pass', 'to', 'subject', 'body', 'phone'].forEach(function (k) { els[k].value = ''; });
    els.hidden.checked = false;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    run = { started: false, done: false };
    codeKey = '';
    status('');
    update();
    var top = document.querySelector('.qr-input').getBoundingClientRect().top + window.pageYOffset - 70;
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
    var first = { link: els.link, text: els.text, wifi: els.ssid, email: els.to, phone: els.phone }[st.type];
    try { first.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  if (window.setRetry) window.setRetry({ label: R.again, action: again });
  if (window.setShareData) {
    // 앱 주소만 공유한다 — 사용자가 만든 QR 내용은 절대 넣지 않는다
    window.setShareData(function () {
      var base = window.location.href.split('#')[0].split('?')[0];
      return { title: R.shareTitle, text: R.shareText, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }

  // ---------------------------------------------------------------- 이벤트
  els.types.forEach(function (b) { b.addEventListener('click', function () { setType(b.getAttribute('data-type')); }); });
  [els.types, els.eccs, els.sizes].forEach(function (group) {
    var list = Array.prototype.slice.call(group);
    list.forEach(function (b, i) {
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var to = list[(i + d + list.length) % list.length];
        to.focus(); to.click();
      });
    });
  });
  ['link', 'text', 'ssid', 'pass', 'to', 'subject', 'body', 'phone'].forEach(function (k) { els[k].addEventListener('input', schedule); });
  els.sec.addEventListener('change', update);
  els.hidden.addEventListener('change', update);
  els.eccs.forEach(function (b) { b.addEventListener('click', function () { st.ecc = b.getAttribute('data-ecc'); radio(els.eccs, 'data-ecc', st.ecc); update(); }); });
  els.sizes.forEach(function (b) { b.addEventListener('click', function () { st.size = Number(b.getAttribute('data-size')); radio(els.sizes, 'data-size', st.size); update(); }); });
  els.margin.addEventListener('input', function () { st.margin = Math.max(0, Math.min(8, Number(els.margin.value) || 0)); els.marginOut.textContent = String(st.margin); update(); });
  els.fg.addEventListener('input', function () { setColor('fg', els.fg.value); });
  els.bg.addEventListener('input', function () { setColor('bg', els.bg.value); });
  els.reset.addEventListener('click', function () { els.fg.value = D.fg; els.bg.value = D.bg; st.fg = D.fg; st.bg = D.bg; update(); });
  els.png.addEventListener('click', savePng);
  els.svg.addEventListener('click', saveSvg);
  if (canCopy) { els.copy.hidden = false; els.copy.addEventListener('click', copyImage); }
  var resizeT = 0;
  window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(function () { if (qr) drawPreview(); }, 150); });

  window.QR_APP = {
    state: function () {
      return { type: st.type, ecc: st.ecc, size: st.size, margin: st.margin, fg: st.fg, bg: st.bg, payload: payload,
        version: qr ? qr.version : 0, modules: qr ? qr.size : 0, mask: qr ? qr.mask : -1, started: run.started, done: run.done };
    },
    matrix: function () { return qr ? qr.modules.map(function (r) { return r.map(function (v) { return v ? 1 : 0; }); }) : null; },
    get lastImage() { return app.lastImage; },
    get lastSvg() { return app.lastSvg; },
    get lastCopy() { return app.lastCopy; },
    canCopy: canCopy
  };

  update();
})();
