/* apps/pumpkin/pumpkin.js — 시작(티징) → 편집기 → 끝 화면(완성 호박 + 이미지 저장 + 공통 끝 화면)
 * 부품·그림·공유 인코딩은 pumpkin-core.js(PUMPKIN_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 편집기 아래 .mg-ad 한 자리뿐(시작 화면에는 없음). 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 한 판(디자인)을 시작할 때 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 그 호박을 끝 화면에 바로 보여 주고, 다시 하기 = "나도 만들기".
 * 디버그/검사용 읽기 전용 핸들: window.PUMPKIN_APP (design(), lastImage)
 */
(function () {
  'use strict';

  var CORE = window.PUMPKIN_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var R = UI.result || {};
  var FACE = { eyes: 1, nose: 1, mouth: 1 };
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'),
    startBtn: $('start-btn'), preview: $('preview'), previewArt: $('preview-art'),
    glowBtn: $('glow-btn'), nightBtn: $('night-btn'), tabs: $('tabs'), options: $('options'),
    name: $('name-input'), randomBtn: $('random-btn'), doneBtn: $('done-btn'),
    eyebrow: $('end-eyebrow'), endArt: $('end-art'), endName: $('end-name'),
    saveBtn: $('save-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var design = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 디자인 (공유 링크 = 이것)
  var part = CORE.PARTS[0];
  var friend = false;    // 공유 링크로 받은 호박을 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var saving = false;
  var app = { lastImage: null, design: function () { return CORE.copy(design); }, shown: function () { return shown && CORE.copy(shown); } };
  window.PUMPKIN_APP = app;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.edit.hidden = name !== 'edit';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 편집기
  function renderPreview(bump) {
    els.previewArt.innerHTML = CORE.render(design, { prefix: 'pv', attrs: ' aria-hidden="true" focusable="false"' });
    if (bump && !REDUCED) {
      els.preview.classList.remove('is-bump');
      void els.preview.offsetWidth; // 애니메이션 다시 시작
      els.preview.classList.add('is-bump');
    }
  }
  function optionArt(i) {
    if (FACE[part.id]) return CORE.thumb(part.id, i, { color: design.c, glow: design.g === 1 });
    var d = CORE.copy(design);
    d[part.key] = i;
    return CORE.render(d, { prefix: 'op' + i, simple: true, attrs: ' aria-hidden="true" focusable="false"' });
  }
  function renderOptions() {
    var n = CORE.COUNTS[part.key];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pk-opt' + (FACE[part.id] ? ' is-face' : '');
      b.setAttribute('data-i', String(i));
      b.setAttribute('aria-pressed', String(design[part.key] === i));
      b.setAttribute('aria-label', fmt(E.optionAria, { part: E.tabs[part.id], n: i + 1 }));
      b.innerHTML = optionArt(i);
      frag.appendChild(b);
    }
    els.options.innerHTML = '';
    els.options.appendChild(frag);
    els.options.setAttribute('aria-labelledby', 'tab-' + part.id);
  }
  function syncPressed() {
    Array.prototype.forEach.call(els.options.querySelectorAll('.pk-opt'), function (b) {
      b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-i')) === design[part.key]));
    });
  }
  function syncToggles() {
    els.glowBtn.setAttribute('aria-pressed', String(design.g === 1));
    els.nightBtn.setAttribute('aria-pressed', String(design.k === 1));
  }
  function selectTab(id) {
    CORE.PARTS.forEach(function (p) { if (p.id === id) part = p; });
    Array.prototype.forEach.call(els.tabs.querySelectorAll('.pk-tab'), function (t) {
      var on = t.getAttribute('data-part') === part.id;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
      if (on && t.scrollIntoView && els.tabs.scrollWidth > els.tabs.clientWidth) {
        els.tabs.scrollTo({ left: t.offsetLeft - (els.tabs.clientWidth - t.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
      }
    });
    renderOptions();
  }
  function renderEditor() {
    renderPreview(false);
    syncToggles();
    renderOptions();
    els.name.value = design.name || '';
  }

  function startDesign(fresh) {
    if (fresh) {
      design = CORE.defaults();
      part = CORE.PARTS[0];
      selectTab(part.id);
    }
    if (!started) { started = true; doneSent = false; track('start'); }
    renderEditor();
    show('edit');
  }

  // ---------------------------------------------------------------- 끝 화면
  function shareUrl() {
    return window.location.href.split('#')[0] + '#d=' + (CORE.encode(shown || design) || '');
  }
  function showEnd(d, fromFriend) {
    shown = CORE.copy(d);
    friend = !!fromFriend;
    var title = shown.name || R.untitled;
    els.eyebrow.textContent = friend ? R.eyebrowFriend : R.eyebrowMine;
    els.endArt.innerHTML = CORE.render(shown, { prefix: 'end', attrs: ' aria-hidden="true" focusable="false"' });
    els.endArt.setAttribute('aria-label', fmt(R.imageAlt, { name: title }));
    els.endName.textContent = title;
    els.editBtn.hidden = friend;
    els.status.textContent = '';
    els.end.classList.toggle('is-friend', friend);
    if (window.setRetry) window.setRetry({ label: friend ? R.retryFriend : R.retry, action: retry });
    show('end');
  }
  function finish() {
    design.name = CORE.cleanName(els.name.value);
    els.name.value = design.name;
    showEnd(design, false);
    if (!doneSent) { doneSent = true; track('done'); }
    track('pk_done', { s: design.s, c: design.c, e: design.e, n: design.n, m: design.m, t: design.t, x: design.x, g: design.g, k: design.k, named: design.name ? 1 : 0 });
  }
  function retry() {
    if (friend || /^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
    friend = false;
    started = false;
    startDesign(true);
  }

  // ---------------------------------------------------------------- 이미지 저장 (SVG → canvas → PNG)
  function status(msg, bad) {
    els.status.textContent = msg || '';
    els.status.classList.toggle('is-bad', !!bad);
  }
  function makePng(d) {
    return new Promise(function (resolve, reject) {
      var W = 1080;
      var H = 1300;
      var svg = CORE.render(d, { prefix: 'img', attrs: ' width="' + W + '" height="' + W + '"' });
      var img = new Image();
      img.onload = function () {
        try {
          var cv = document.createElement('canvas');
          cv.width = W;
          cv.height = H;
          var ctx = cv.getContext('2d');
          ctx.fillStyle = d.k === 1 ? '#110722' : '#ffdcb8';
          ctx.fillRect(0, 0, W, H);
          ctx.drawImage(img, 0, 0, W, W);
          var fam = window.getComputedStyle(els.endName).fontFamily || 'sans-serif';
          var weight = window.getComputedStyle(els.endName).fontWeight || '700';
          var title = d.name || R.untitled;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = d.k === 1 ? '#ffd98a' : '#5a2400';
          var size = 76;
          ctx.font = weight + ' ' + size + 'px ' + fam;
          while (ctx.measureText(title).width > W - 120 && size > 36) { size -= 4; ctx.font = weight + ' ' + size + 'px ' + fam; }
          ctx.fillText(title, W / 2, W + 96);
          ctx.globalAlpha = 0.6;
          ctx.font = '600 28px ' + fam;
          var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
          ctx.fillText('🎃 ' + host, W / 2, H - 44);
          ctx.globalAlpha = 1;
          cv.toBlob(function (blob) { if (blob && blob.size) resolve(blob); else reject(new Error('empty image')); }, 'image/png');
        } catch (e) { reject(e); }
      };
      img.onerror = function () { reject(new Error('svg image')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
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
    var d = CORE.copy(shown);
    var fontReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    fontReady.then(function () { return makePng(d); }).then(function (blob) {
      var name = (R.fileName || 'pumpkin') + '.png';
      app.lastImage = { w: 1080, h: 1300, size: blob.size, type: blob.type };
      var file = null;
      try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
      var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
          status(R.saved);
          track('pk_save', { via: 'share' });
        }, function (err) {
          if (err && err.name === 'AbortError') { status(''); return; }
          download(blob, name);
          status(R.saved);
          track('pk_save', { via: 'download' });
        });
      }
      download(blob, name);
      status(R.saved);
      track('pk_save', { via: 'download' });
      return null;
    }).catch(function () {
      status(R.saveFail, true);
      track('pk_save_fail');
    }).then(function () {
      saving = false;
      els.saveBtn.disabled = false;
    });
  }

  // ---------------------------------------------------------------- 공유 링크
  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    return CORE.decode(h.slice(3));
  }

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { startDesign(true); });
  els.tabs.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.pk-tab') : null;
    if (t) selectTab(t.getAttribute('data-part'));
  });
  els.tabs.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var i = CORE.PARTS.indexOf(part);
    var next = CORE.PARTS[(i + (e.key === 'ArrowRight' ? 1 : -1) + CORE.PARTS.length) % CORE.PARTS.length];
    selectTab(next.id);
    var btn = $('tab-' + next.id);
    if (btn) btn.focus();
    e.preventDefault();
  });
  els.options.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.pk-opt') : null;
    if (!b) return;
    design[part.key] = Number(b.getAttribute('data-i'));
    syncPressed();
    renderPreview(true);
  });
  // 호박을 누르면 지금 탭의 다음 모양으로
  els.preview.addEventListener('click', function () {
    design = CORE.cycle(design, part.key, 1);
    syncPressed();
    renderPreview(true);
  });
  els.glowBtn.addEventListener('click', function () {
    design.g = design.g === 1 ? 0 : 1;
    syncToggles();
    renderPreview(true);
    renderOptions();
  });
  els.nightBtn.addEventListener('click', function () {
    design.k = design.k === 1 ? 0 : 1;
    syncToggles();
    renderPreview(false);
    if (!FACE[part.id]) renderOptions();
  });
  els.name.addEventListener('input', function () { design.name = CORE.cleanName(els.name.value); });
  els.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); els.name.blur(); } });
  els.name.addEventListener('blur', function () { els.name.value = design.name = CORE.cleanName(els.name.value); });
  els.randomBtn.addEventListener('click', function () {
    design = CORE.random(design);
    design.name = CORE.cleanName(els.name.value);
    renderPreview(true);
    renderOptions();
    track('pk_random');
  });
  els.doneBtn.addEventListener('click', finish);
  els.saveBtn.addEventListener('click', saveImage);
  els.editBtn.addEventListener('click', function () {
    design = CORE.copy(shown || design);
    renderEditor();
    show('edit');
  });

  // 공통 끝 화면: 공유 = 지금 보이는 호박의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var d = shown || design;
      return { title: R.shareTitle, text: d.name ? fmt(R.shareText, { name: d.name }) : R.shareTextNoName, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown)) { showEnd(d, true); track('pk_open_shared'); }
  });

  var initial = readHash();
  if (initial) {
    showEnd(initial, true);
    track('pk_open_shared');
  } else {
    show('start');
  }
})();
