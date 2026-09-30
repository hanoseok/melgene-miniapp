/* apps/ghost/ghost.js — 시작(티징) → 편집기 → 끝 화면(완성 유령 + 이미지 저장 + 공통 끝 화면)
 * 부품·그림·공유 인코딩은 ghost-core.js(GHOST_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 편집기 아래 .mg-ad 한 자리뿐(시작 화면에는 없음). 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 한 판(디자인)을 시작할 때 track('start') 한 번, 완성해서 끝 화면에 닿을 때 track('done') 한 번.
 * 공유 링크(#d=...)로 들어오면 그 유령을 끝 화면에 바로 보여 주고, 다시 하기 = "나도 만들기".
 * 둥실둥실 움직임은 style.css(.gh-float) — prefers-reduced-motion 이면 멈춘다.
 * 디버그/검사용 읽기 전용 핸들: window.GHOST_APP (design(), shown(), lastImage)
 */
(function () {
  'use strict';

  var CORE = window.GHOST_CORE;
  var UI = window.PAGE_I18N || {};
  var E = UI.editor || {};
  var R = UI.result || {};
  var FACE = { eyes: 1, mouth: 1, cheeks: 1 };
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), edit: $('screen-edit'), end: $('screen-end'),
    startBtn: $('start-btn'), preview: $('preview'), previewArt: $('preview-art'),
    tabs: $('tabs'), options: $('options'),
    name: $('name-input'), randomBtn: $('random-btn'), doneBtn: $('done-btn'),
    eyebrow: $('end-eyebrow'), endArt: $('end-art'), endName: $('end-name'),
    saveBtn: $('save-btn'), editBtn: $('edit-btn'), status: $('save-status'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var design = CORE.defaults();
  var shown = null;      // 끝 화면에 보이는 디자인 (공유 링크 = 이것)
  var part = CORE.PARTS[0];
  var friend = false;    // 공유 링크로 받은 유령을 보는 중
  var started = false;   // track('start') 는 한 판에 한 번
  var doneSent = false;  // track('done') 도 한 판에 한 번
  var saving = false;
  var app = { lastImage: null, design: function () { return CORE.copy(design); }, shown: function () { return shown && CORE.copy(shown); } };
  window.GHOST_APP = app;

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
    if (FACE[part.id]) return CORE.thumb(part.id, i, { color: design.c });
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
      b.className = 'gh-opt' + (FACE[part.id] ? ' is-face' : '');
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
    Array.prototype.forEach.call(els.options.querySelectorAll('.gh-opt'), function (b) {
      b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-i')) === design[part.key]));
    });
  }
  function selectTab(id) {
    CORE.PARTS.forEach(function (p) { if (p.id === id) part = p; });
    Array.prototype.forEach.call(els.tabs.querySelectorAll('.gh-tab'), function (t) {
      var on = t.getAttribute('data-part') === part.id;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', String(on));
      if (on && els.tabs.scrollWidth > els.tabs.clientWidth) {
        els.tabs.scrollTo({ left: t.offsetLeft - (els.tabs.clientWidth - t.offsetWidth) / 2, behavior: REDUCED ? 'auto' : 'smooth' });
      }
    });
    renderOptions();
  }
  function renderEditor() {
    renderPreview(false);
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
    var base = window.mgCleanUrl ? window.mgCleanUrl() : window.location.href;
    return String(base).split('#')[0] + '#d=' + (CORE.encode(shown || design) || '');
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
    track('gh_done', { b: design.b, c: design.c, e: design.e, m: design.m, k: design.k, h: design.h, i: design.i, g: design.g, named: design.name ? 1 : 0 });
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
      var dark = CORE.isDark(d.g);
      var svg = CORE.render(d, { prefix: 'img', attrs: ' width="' + W + '" height="' + W + '"' });
      var img = new Image();
      img.onload = function () {
        try {
          var cv = document.createElement('canvas');
          cv.width = W;
          cv.height = H;
          var ctx = cv.getContext('2d');
          ctx.fillStyle = CORE.BG_FILL[d.g];
          ctx.fillRect(0, 0, W, H);
          ctx.drawImage(img, 0, 0, W, W);
          var fam = window.getComputedStyle(els.endName).fontFamily || 'sans-serif';
          var weight = window.getComputedStyle(els.endName).fontWeight || '700';
          var title = d.name || R.untitled;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = dark ? '#f3edff' : '#3a2366';
          var size = 76;
          ctx.font = weight + ' ' + size + 'px ' + fam;
          while (ctx.measureText(title).width > W - 120 && size > 36) { size -= 4; ctx.font = weight + ' ' + size + 'px ' + fam; }
          ctx.fillText(title, W / 2, W + 96);
          ctx.globalAlpha = 0.6;
          ctx.font = '600 28px ' + fam;
          var host = (window.location.host + window.location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
          ctx.fillText('👻 ' + host, W / 2, H - 44);
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
      var name = (R.fileName || 'my-ghost') + '.png';
      app.lastImage = { w: 1080, h: 1300, size: blob.size, type: blob.type };
      var file = null;
      try { file = new File([blob], name, { type: 'image/png' }); } catch (e) { file = null; }
      var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      if (file && coarse && navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file], title: R.shareTitle }).then(function () {
          status(R.saved);
          track('gh_save', { via: 'share' });
        }, function (err) {
          if (err && err.name === 'AbortError') { status(''); return; }
          download(blob, name);
          status(R.saved);
          track('gh_save', { via: 'download' });
        });
      }
      download(blob, name);
      status(R.saved);
      track('gh_save', { via: 'download' });
      return null;
    }).catch(function () {
      status(R.saveFail, true);
      track('gh_save_fail');
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
    var t = e.target.closest ? e.target.closest('.gh-tab') : null;
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
    var b = e.target.closest ? e.target.closest('.gh-opt') : null;
    if (!b) return;
    design[part.key] = Number(b.getAttribute('data-i'));
    syncPressed();
    renderPreview(true);
    if (part.id === 'color') renderOptions(); // 색 탭은 보기 그림도 새 색으로
  });
  // 유령을 누르면 지금 탭의 다음 모양으로
  els.preview.addEventListener('click', function () {
    design = CORE.cycle(design, part.key, 1);
    syncPressed();
    renderPreview(true);
  });
  els.name.addEventListener('input', function () { design.name = CORE.cleanName(els.name.value); });
  els.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); els.name.blur(); } });
  els.name.addEventListener('blur', function () { els.name.value = design.name = CORE.cleanName(els.name.value); });
  els.randomBtn.addEventListener('click', function () {
    design = CORE.random(design);
    design.name = CORE.cleanName(els.name.value);
    renderPreview(true);
    renderOptions();
    track('gh_random');
  });
  els.doneBtn.addEventListener('click', finish);
  els.saveBtn.addEventListener('click', saveImage);
  els.editBtn.addEventListener('click', function () {
    design = CORE.copy(shown || design);
    renderEditor();
    show('edit');
  });

  // 공통 끝 화면: 공유 = 지금 보이는 유령의 #d= 링크(클릭 때마다 새로 계산)
  if (window.setShareData) {
    window.setShareData(function () {
      var d = shown || design;
      return { title: R.shareTitle, text: d.name ? fmt(R.shareText, { name: d.name }) : R.shareTextNoName, url: shareUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: retry });

  window.addEventListener('hashchange', function () {
    var d = readHash();
    if (d && !CORE.same(d, shown)) { showEnd(d, true); track('gh_open_shared'); }
  });

  var initial = readHash();
  if (initial) {
    showEnd(initial, true);
    track('gh_open_shared');
  } else {
    show('start');
  }
})();
