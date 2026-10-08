/* apps/hangul-name/hangul-name.js — 시작(티징 + 이름 입력) → 결과(이름 카드·스타일·이미지 저장/복사·음절 풀이) → 공통 끝 화면
 * 변환은 hangul-name-core.js(HANGUL_NAME_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 이름 카드는 canvas 로 그리고, "이미지 저장" 은 같은 canvas → PNG 를 링크로 내려받는다(모두 브라우저 안, 서버 전송 없음).
 * 기록: 이름을 내고(시작 버튼) 결과가 나올 때 track('start') → track('done') 한 번씩. 공유 링크(#d=…)로 들어온 방문자는 세지 않는다.
 * 공유: mgCleanUrl() + #d=<base64url {v,n,s}> — 받는 사람도 같은 카드(같은 스타일)를 본다. 다시 하기 = 이름 입력으로.
 * 디버그/검사용 읽기 전용 핸들: window.HANGUL_NAME_APP (state(), shareUrl(), lastImage)
 */
(function () {
  'use strict';

  var CORE = window.HANGUL_NAME_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.errors || {};
  var R = UI.result || {};
  var STY = UI.styles || {};

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), result: $('screen-result'), form: $('name-form'), input: $('name-input'), error: $('name-error'),
    eyebrow: $('result-eyebrow'), canvas: $('card-canvas'), chips: $('style-chips'), save: $('save-btn'), copy: $('copy-btn'),
    status: $('status'), breakdown: $('breakdown'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var W = 1080;
  var H = 1080;
  var state = { name: '', res: null, style: CORE.STYLES[0], friend: false };
  var saving = false;
  var app = { lastImage: null, lastCopy: '' };

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(s, o) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  // 카드 글꼴(한글 글리프) — unicode-range 조각이라 쓰는 글자만 내려받는다. 첫 화면을 막지 않도록 스크립트에서 붙인다.
  (function loadCardFonts() {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = CORE.CARD_FONTS_CSS;
    document.head.appendChild(l);
  })();

  function show(name) {
    els.start.hidden = name !== 'start';
    els.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }
  function status(msg, bad) {
    els.status.textContent = msg || '';
    els.status.classList.toggle('is-bad', !!bad);
  }
  function shareUrl() {
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + CORE.encode(state.name, state.style);
  }

  // ---------------------------------------------------------------- 이름 카드 (canvas)
  var LOOK = {
    brush: { bg: '#f6efe0', ink: '#1d1a17', sub: '#6b5d4f', line: '#d9cbb0', accent: '#c8102e' },
    cute: { bg: '#ffe4ee', ink: '#d6336c', sub: '#a4506e', line: '#ffb8cf', accent: '#ff8fb3' },
    bold: { bg: '#14213d', ink: '#fcbf3a', sub: '#e9e3d1', line: '#2c3d63', accent: '#e63946' },
    classic: { bg: '#fffdf7', ink: '#1f2a44', sub: '#6d6250', line: '#b08d57', accent: '#b08d57' }
  };
  function uiFont() {
    var cs = window.getComputedStyle(document.body);
    return cs.fontFamily || 'sans-serif';
  }
  function displayFont() {
    var cs = window.getComputedStyle(els.eyebrow);
    return { fam: cs.fontFamily || 'sans-serif', weight: cs.fontWeight || '800' };
  }
  function cardFontSpec(style, px) {
    var f = CORE.CARD_FONTS[style];
    return f.weight + ' ' + px + 'px "' + f.family + '", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif';
  }
  var SAMPLE = String.fromCharCode(0xD55C); // 견본 글자(한)
  function fontsReady(style, text) {
    var f = CORE.CARD_FONTS[style];
    var list = [];
    try {
      if (document.fonts && document.fonts.load) {
        list.push(document.fonts.load(f.weight + ' 100px "' + f.family + '"', text || SAMPLE));
        if (style === 'brush') list.push(document.fonts.load('800 100px "Nanum Myeongjo"', text || SAMPLE));
        list.push(document.fonts.ready);
      }
    } catch (e) { /* noop */ }
    // 글꼴이 늦거나 막혀도 2.5초 뒤엔 그대로 그린다
    return Promise.race([Promise.all(list).catch(function () { return null; }), new Promise(function (r) { setTimeout(r, 2500); })]);
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
  // 이름 줄 나누기: 한 줄에 다 들어가면 한 줄, 아니면 단어마다 줄 (최대 3줄)
  function nameLines(ctx, words, style, maxW, maxH) {
    var tries = [words.join(' ')];
    if (words.length > 1) {
      if (words.length <= 3) tries.push(words.slice());
      else tries.push([words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')]);
    }
    var best = null;
    tries.forEach(function (t) {
      var lines = Array.isArray(t) ? t : [t];
      var size = 300;
      for (; size > 48; size -= 6) {
        ctx.font = cardFontSpec(style, size);
        var wOk = lines.every(function (l) { return ctx.measureText(l).width <= maxW; });
        if (wOk && lines.length * size * 1.15 <= maxH) break;
      }
      if (!best || size > best.size + 20) best = { lines: lines, size: size };
    });
    return best;
  }
  function drawCard(cv, st) {
    var ctx = cv.getContext('2d');
    var lk = LOOK[st.style] || LOOK.brush;
    var res = st.res;
    cv.width = W;
    cv.height = H;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = lk.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // 바탕 무늬
    if (st.style === 'brush') {
      ctx.strokeStyle = lk.line; ctx.lineWidth = 2;
      for (var y = 70; y < H; y += 46) { ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(W - 60, y + 6); ctx.stroke(); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = lk.ink; ctx.lineWidth = 4; ctx.strokeRect(48, 48, W - 96, H - 96);
    } else if (st.style === 'cute') {
      ctx.fillStyle = lk.line;
      for (var gy = 60; gy < H; gy += 90) for (var gx = 60 + ((gy / 90) % 2) * 45; gx < W; gx += 90) { ctx.beginPath(); ctx.arc(gx, gy, 9, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#fff'; roundRect(ctx, 70, 70, W - 140, H - 140, 64); ctx.fill();
      ctx.strokeStyle = lk.ink; ctx.lineWidth = 8; roundRect(ctx, 70, 70, W - 140, H - 140, 64); ctx.stroke();
    } else if (st.style === 'bold') {
      ctx.fillStyle = lk.accent; ctx.fillRect(0, 0, W, 26); ctx.fillRect(0, H - 26, W, 26);
      ctx.strokeStyle = lk.sub; ctx.lineWidth = 3; ctx.strokeRect(54, 66, W - 108, H - 132);
    } else {
      var band = ['#c8102e', '#1f4e9c', '#1b8a5a', '#f2b705', '#ffffff'];
      band.forEach(function (c, i) { ctx.fillStyle = c; ctx.fillRect(i * (W / band.length), 0, W / band.length + 1, 22); });
      ctx.strokeStyle = lk.line; ctx.lineWidth = 3; ctx.strokeRect(60, 70, W - 120, H - 140);
      ctx.lineWidth = 1.5; ctx.strokeRect(74, 84, W - 148, H - 168);
    }

    var ui = uiFont();
    var disp = displayFont();
    // 위: 카드 꼬리표 (언어별 문구)
    ctx.fillStyle = lk.sub;
    ctx.font = disp.weight + ' 38px ' + disp.fam;
    ctx.fillText(fitText(ctx, R.cardTag || '', 760), W / 2, 178);

    // 가운데: 한글 이름
    var words = res.words.map(function (w) { return w.hangul; });
    var fit = nameLines(ctx, words, st.style, 860, 470);
    ctx.fillStyle = lk.ink;
    ctx.font = cardFontSpec(st.style, fit.size);
    var lh = fit.size * 1.15;
    var top = 250 + (470 - fit.lines.length * lh) / 2;
    fit.lines.forEach(function (l, i) { ctx.fillText(l, W / 2, top + lh * (i + 0.8)); });

    // 아래: 로마자 읽기 + 원래 이름
    var roman = res.words.map(function (w) { return w.blocks.map(function (b) { return b.r; }).join('·'); }).join('  ');
    ctx.fillStyle = lk.sub;
    ctx.font = '600 40px ' + ui;
    ctx.fillText(fitText(ctx, roman, 860), W / 2, 800);
    if (res.input && res.input !== res.hangul) {
      ctx.fillStyle = lk.ink;
      ctx.font = disp.weight + ' 50px ' + disp.fam;
      ctx.fillText(fitText(ctx, res.input, 860), W / 2, 878);
    }
    // 붓글씨: 빨간 도장 (이름 첫 글자)
    if (st.style === 'brush') {
      var sx = W - 210, sy = 84, ss = 118;
      ctx.fillStyle = lk.accent; roundRect(ctx, sx, sy, ss, ss, 14); ctx.fill();
      ctx.fillStyle = '#fff6ea';
      ctx.font = '800 76px "Nanum Myeongjo", serif';
      ctx.fillText(words[0].charAt(0), sx + ss / 2, sy + ss / 2 + 27);
    }
    // 맨 아래: 브랜드
    ctx.fillStyle = lk.sub;
    ctx.globalAlpha = 0.85;
    ctx.font = '700 28px ' + ui;
    ctx.fillText(UI.brand || '', W / 2, H - (st.style === 'bold' ? 92 : 112));
    ctx.globalAlpha = 1;
  }
  function fitText(ctx, text, maxW) {
    var t = String(text || '');
    if (ctx.measureText(t).width <= maxW) return t;
    var chars = Array.from(t);
    while (chars.length > 1 && ctx.measureText(chars.join('') + '…').width > maxW) chars.pop();
    return chars.join('') + '…';
  }
  var drawSeq = 0;
  function redraw() {
    if (!state.res) return;
    var seq = ++drawSeq;
    try { drawCard(els.canvas, state); } catch (e) { /* 글꼴 전 첫 그림 실패해도 아래에서 다시 */ }
    fontsReady(state.style, state.res.hangul).then(function () {
      if (seq === drawSeq) { try { drawCard(els.canvas, state); } catch (e) { /* noop */ } }
    });
  }

  // ---------------------------------------------------------------- 음절 풀이 · 스타일
  function renderBreakdown(res) {
    els.breakdown.textContent = '';
    res.words.forEach(function (w) {
      var box = document.createElement('div');
      box.className = 'hn-word';
      var src = document.createElement('p');
      src.className = 'hn-word-src';
      var from = document.createElement('span');
      from.textContent = w.src;
      src.appendChild(from);
      if (w.latin && w.latin.toLowerCase() !== w.src.toLowerCase()) {
        var lat = document.createElement('span');
        lat.className = 'hn-word-latin';
        lat.textContent = fmt(R.fromLatin, { name: w.latin });
        src.appendChild(lat);
      }
      if (w.src !== w.hangul) {
        var arrow = document.createElement('span');
        arrow.className = 'hn-arrow';
        arrow.textContent = '→';
        arrow.setAttribute('aria-hidden', 'true');
        var to = document.createElement('b');
        to.lang = 'ko';
        to.textContent = w.hangul;
        src.appendChild(arrow);
        src.appendChild(to);
      }
      box.appendChild(src);
      var ol = document.createElement('ol');
      ol.className = 'hn-blocks';
      w.blocks.forEach(function (b) {
        var li = document.createElement('li');
        var h = document.createElement('span');
        h.className = 'hn-bh';
        h.lang = 'ko';
        h.textContent = b.h;
        var r = document.createElement('span');
        r.className = 'hn-br';
        r.textContent = b.r;
        li.appendChild(h);
        li.appendChild(r);
        ol.appendChild(li);
      });
      box.appendChild(ol);
      els.breakdown.appendChild(box);
    });
  }
  function syncChips() {
    Array.prototype.forEach.call(els.chips.querySelectorAll('.hn-chip'), function (b) {
      var on = b.getAttribute('data-style') === state.style;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.classList.toggle('is-on', on);
      b.tabIndex = on ? 0 : -1;
    });
  }
  function setStyle(id) {
    if (CORE.STYLES.indexOf(id) < 0 || id === state.style) return;
    state.style = id;
    syncChips();
    redraw();
  }

  // ---------------------------------------------------------------- 결과
  function showResult(name, style, friend) {
    var res = CORE.convert(name);
    if (!res.ok) return false;
    state.name = res.input;
    state.res = res;
    state.style = CORE.STYLES.indexOf(style) >= 0 ? style : CORE.STYLES[0];
    state.friend = !!friend;
    els.eyebrow.textContent = friend ? R.eyebrowFriend : R.eyebrow;
    els.canvas.setAttribute('aria-label', res.hangul + ' (' + res.roman + ')');
    status('');
    renderBreakdown(res);
    syncChips();
    show('result');
    redraw();
    return true;
  }
  function submit(e) {
    if (e) e.preventDefault();
    var res = CORE.convert(els.input.value);
    if (!res.ok) {
      els.error.textContent = res.reason === 'empty' ? E.empty : E.invalid;
      els.error.hidden = false;
      els.input.focus();
      return;
    }
    els.error.hidden = true;
    track('start');
    if (/^#d=/.test(window.location.hash)) clearHash();
    if (showResult(res.input, state.style, false)) track('done');
  }
  function clearHash() {
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
  }
  function retry() {
    if (state.friend || /^#d=/.test(window.location.hash)) clearHash();
    state.friend = false;
    els.error.hidden = true;
    show('start');
    try { els.input.focus(); els.input.select(); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 이미지 저장 · 복사
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
    if (saving || !state.res) return;
    saving = true;
    els.save.disabled = true;
    status(R.saving);
    var snap = { name: state.name, res: state.res, style: state.style };
    fontsReady(snap.style, snap.res.hangul).then(function () {
      return new Promise(function (resolve, reject) {
        try {
          var cv = document.createElement('canvas');
          drawCard(cv, snap);
          cv.toBlob(function (blob) { if (blob && blob.size) resolve(blob); else reject(new Error('empty image')); }, 'image/png');
        } catch (e) { reject(e); }
      });
    }).then(function (blob) {
      app.lastImage = { w: W, h: H, size: blob.size, type: blob.type };
      download(blob, (R.fileName || 'hangul-name') + '.png');
      status(R.saved);
      track('hn_save', { style: snap.style });
    }).catch(function () {
      status(R.saveFail, true);
    }).then(function () {
      saving = false;
      els.save.disabled = false;
    });
  }
  function copyText() {
    if (!state.res) return;
    var text = fmt(R.copyText, { name: state.res.input, hangul: state.res.hangul, roman: state.res.roman }) + '\n' + shareUrl();
    app.lastCopy = text;
    function ok() { status(R.copied); track('hn_copy'); }
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
  els.form.addEventListener('submit', submit);
  els.input.addEventListener('input', function () { if (!els.error.hidden) els.error.hidden = true; });
  els.chips.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.hn-chip') : null;
    if (b) setStyle(b.getAttribute('data-style'));
  });
  els.chips.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var n = CORE.STYLES.length;
    var i = (CORE.STYLES.indexOf(state.style) + (e.key === 'ArrowRight' ? 1 : -1) + n) % n;
    setStyle(CORE.STYLES[i]);
    var btn = els.chips.querySelector('.hn-chip[data-style="' + state.style + '"]');
    if (btn) btn.focus();
    e.preventDefault();
  });
  els.save.addEventListener('click', saveImage);
  els.copy.addEventListener('click', copyText);

  // 공통 끝 화면: 공유 = 지금 보이는 카드의 #d= 링크(누를 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      return { title: R.shareTitle, text: state.res ? fmt(R.shareText, { hangul: state.res.hangul }) : R.shareTitle, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && d.name !== state.name) { showResult(d.name, d.style, true); track('hn_open_shared'); }
  });

  window.HANGUL_NAME_APP = {
    state: function () { return { name: state.name, hangul: state.res && state.res.hangul, roman: state.res && state.res.roman, style: state.style, friend: state.friend }; },
    shareUrl: shareUrl,
    get lastImage() { return app.lastImage; },
    get lastCopy() { return app.lastCopy; }
  };

  var initial = readHash();
  if (initial && showResult(initial.name, initial.style, true)) {
    track('hn_open_shared');
  } else {
    show('start');
  }
})();
