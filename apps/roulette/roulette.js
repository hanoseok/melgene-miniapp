/* apps/roulette/roulette.js — 돌림판 앱 (항목 편집 → 돌리기 → 결과 창, 기록, 공유 링크, 소리)
 * 빌드 없이 그대로 동작하는 vanilla JS (ES5 스타일). 언어별 문자열은 window.PAGE_I18N(tools/i18n/<lang>.js 의 ui).
 * 핵심 계산은 roulette-core.js, 그리기는 roulette-draw.js 에 있다.
 * 렌더링 구조: 휠 면 캔버스는 CSS transform 으로만 돌리고(합성만 일어남), 멈추면 각도를 캔버스에 다시 구워
 * transform 을 0으로 돌려 글자를 선명하게 만든다. 테두리 전구는 휠이 전구 한 칸만큼 돌 때만 다시 그린다.
 */
(function () {
  'use strict';

  var CORE = window.ROULETTE_CORE;
  var DRAW = window.ROULETTE_DRAW;
  if (!CORE || !DRAW) return;
  var UI = window.PAGE_I18N || {};
  var TAU = CORE.TAU;
  var LANG = window.PAGE_LANG || (document.documentElement.lang || 'ko');
  var LS_KEY = 'rlt_last_' + LANG; // 마지막 돌림판(언어별 — 기본 언어가 무엇이든 같은 규칙)
  var SOUND_KEY = 'rlt_sound'; // '1' = 켬 (처음엔 꺼짐)
  var SPUN_KEY = 'rlt_spun';
  var DEFAULT_PRESET = 'lunch';

  function fmt(tpl, vars) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 사생활 보호 모드 등 */ } }
  function $(id) { return document.getElementById(id); }
  function raf(fn) { return window.requestAnimationFrame(fn); }
  function toast(msg) { if (window.toast) window.toast(msg); }

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduceMotion = !!(mq && mq.matches);
  if (mq) {
    var onMq = function () { reduceMotion = mq.matches; };
    if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
  }

  var els = {
    stage: $('stage'), rim: $('rim'), disc: $('disc'), wheel: $('wheel'), pointer: $('pointer'),
    spinBtn: $('spin-btn'), soundBtn: $('sound-btn'), soundLabel: $('sound-label'),
    live: $('live'), history: $('history'), historyList: $('history-list'), historyClear: $('history-clear'),
    editor: $('editor'), count: $('item-count'), list: $('item-list'), addBtn: $('add-btn'), shuffleBtn: $('shuffle-btn'),
    restoreBtn: $('restore-btn'), weighted: $('weighted-toggle'), presets: document.querySelector('.rlt-presets'),
    themes: document.querySelector('.rlt-themes'),
    modal: $('result'), modalCard: $('result-card'), resultLabel: $('result-label'),
    againBtn: $('again-btn'), removeBtn: $('remove-btn'), closeBtn: $('close-btn'),
    confetti: $('confetti'), year: $('year'),
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var pointerSvg = els.pointer.querySelector('svg');

  var state = {
    items: [],
    weights: [],
    weighted: false,
    theme: CORE.DEFAULT_THEME,
    rotation: 0, // 지금 휠 각도
    baked: 0, // 캔버스에 구워 넣은 각도
    highlight: -1,
    colors: [],
    spinning: false,
    history: [],
    removed: [], // "빼고 다시 돌리기"로 뺀 항목 { label, weight, index }
    hashMode: false, // 공유 링크로 열었거나 공유한 뒤에는 주소 해시를 설정과 맞춰 둔다
    sound: lsGet(SOUND_KEY) === '1',
    spins: 0,
    winner: -1,
  };

  // ---------------------------------------------------------------
  // 항목 값
  // ---------------------------------------------------------------
  function labelOf(i) {
    var s = CORE.cleanLabel(state.items[i]);
    return s || fmt(UI.itemN, { n: i + 1 });
  }
  function effLabels() { return state.items.map(function (_, i) { return labelOf(i); }); }
  function effWeights() {
    return state.weights.map(function (w) { return state.weighted ? CORE.normWeight(w) : 1; });
  }
  function setupSnapshot() {
    return { items: effLabels(), weights: effWeights(), weighted: state.weighted, theme: state.theme };
  }

  // ---------------------------------------------------------------
  // 크기 / 캔버스
  // ---------------------------------------------------------------
  var geo = { size: 0, dpr: 1, rim: 0, r: 0, hubR: 0 };
  var rim = null;
  var fontFamily = '';

  function measure() {
    var size = Math.round(els.stage.clientWidth);
    if (!size) return false;
    var dpr = Math.min(window.devicePixelRatio || 1, 3);
    var rimW = Math.max(12, Math.round(size * 0.055));
    geo = { size: size, dpr: dpr, rim: rimW, r: size / 2 - rimW, hubR: size * 0.14 };
    els.stage.style.setProperty('--rim', rimW + 'px');
    fontFamily = window.getComputedStyle(document.body).fontFamily || 'sans-serif';

    var bulbs = Math.max(16, Math.round((TAU * (geo.r + rimW / 2)) / 40 / 2) * 2);
    rim = DRAW.createRim({ size: size, dpr: dpr, r: geo.r, w: rimW, bulbs: bulbs, canvas: els.rim });
    els.rim.style.width = size + 'px';
    els.rim.style.height = size + 'px';
    drawBulbs(bulbIdle);

    // 포인터: 끝이 핀 줄(반지름 93.5%) 바로 안쪽까지 들어오게
    var pw = size * 0.12;
    var ph = pw * (80 / 60);
    var tipY = size / 2 - geo.r * 0.905;
    els.pointer.style.width = pw + 'px';
    els.pointer.style.height = ph + 'px';
    els.pointer.style.top = (tipY - ph * (77 / 80)) + 'px';
    return true;
  }

  function renderWheel() {
    if (!geo.size) return;
    var d = geo.r * 2;
    var c = els.wheel;
    var pw = Math.round(d * geo.dpr);
    if (c.width !== pw || c.height !== pw) { c.width = pw; c.height = pw; }
    var ctx = c.getContext('2d');
    ctx.setTransform(geo.dpr, 0, 0, geo.dpr, 0, 0);
    ctx.clearRect(0, 0, d, d);
    var labels = effLabels();
    var info = DRAW.drawWheel(ctx, {
      cx: geo.r, cy: geo.r, r: geo.r,
      items: labels, weights: effWeights(), theme: state.theme,
      rotation: state.baked, highlight: state.highlight, family: fontFamily, hubR: geo.hubR,
    });
    state.colors = info.colors;
    c.style.transform = 'rotate(' + (state.rotation - state.baked) + 'rad)';
    c.setAttribute('aria-label', fmt(UI.wheelAria, { n: labels.length, list: labels.join(', ') }));
  }

  var wheelQueued = false;
  function queueWheel() {
    if (wheelQueued) return;
    wheelQueued = true;
    raf(function () { wheelQueued = false; renderWheel(); });
  }

  // 전구 밝기
  function bulbIdle() { return 1; }
  var bulbState = null;
  function drawBulbs(fn) {
    if (!rim) return;
    bulbState = fn;
    rim.draw(fn);
  }
  var flashTimer = null;
  function flashBulbs() {
    if (!rim) return;
    clearInterval(flashTimer);
    if (reduceMotion) { drawBulbs(bulbIdle); return; }
    var k = 0;
    flashTimer = setInterval(function () {
      k++;
      var odd = k % 2;
      drawBulbs(function (i) { return (i % 2) === odd ? 1 : 0.12; });
      if (k >= 10) { clearInterval(flashTimer); drawBulbs(bulbIdle); }
    }, 130);
  }

  // ---------------------------------------------------------------
  // 포인터 흔들림 (핀에 맞으면 옆으로 튕겼다가 스프링처럼 돌아온다)
  // ---------------------------------------------------------------
  var flap = { angle: 0, vel: 0, running: false };
  function kickFlap(strength) {
    var a = -(10 + 12 * strength);
    if (flap.angle > a) { flap.angle = a; flap.vel = 0; }
  }
  function stepFlap(dt) {
    var acc = -900 * flap.angle - 30 * flap.vel;
    flap.vel += acc * dt;
    flap.angle += flap.vel * dt;
    if (flap.angle < -26) flap.angle = -26;
    pointerSvg.style.transform = 'rotate(' + flap.angle.toFixed(2) + 'deg)';
  }
  function settleFlap() {
    if (flap.running) return;
    flap.running = true;
    var last = null;
    function f(ts) {
      var dt = last == null ? 0.016 : Math.min(0.05, (ts - last) / 1000);
      last = ts;
      stepFlap(dt);
      if (Math.abs(flap.angle) > 0.05 || Math.abs(flap.vel) > 0.5) raf(f);
      else { flap.angle = 0; flap.vel = 0; pointerSvg.style.transform = ''; flap.running = false; }
    }
    raf(f);
  }

  // ---------------------------------------------------------------
  // 소리 (WebAudio로 즉석 합성 — 파일 없음). 처음 방문엔 꺼짐, 켜면 기억한다.
  // ---------------------------------------------------------------
  var audio = null;
  var master = null;
  var noiseBuf = null;
  function ensureAudio() {
    if (!state.sound) return null;
    try {
      if (!audio) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audio = new AC();
        master = audio.createGain();
        master.gain.value = 0.7;
        master.connect(audio.destination);
        var len = Math.floor(audio.sampleRate * 0.03);
        noiseBuf = audio.createBuffer(1, len, audio.sampleRate);
        var data = noiseBuf.getChannelData(0);
        for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
      if (audio.state === 'suspended') audio.resume();
    } catch (e) { audio = null; }
    return audio;
  }
  var lastTickAt = 0;
  function tickSound(strength) {
    if (!state.sound || !audio || audio.state !== 'running') return;
    var now = audio.currentTime;
    if (now - lastTickAt < 0.028) return;
    lastTickAt = now;
    var src = audio.createBufferSource();
    src.buffer = noiseBuf;
    src.playbackRate.value = 0.9 + Math.random() * 0.25;
    var bp = audio.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2600 + strength * 900;
    bp.Q.value = 1.4;
    var g = audio.createGain();
    g.gain.value = 0.5 + 0.5 * strength;
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(now);
  }
  function winSound() {
    if (!state.sound || !audio || audio.state !== 'running') return;
    var t = audio.currentTime + 0.02;
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      var o = audio.createOscillator();
      var g = audio.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      var s = t + i * 0.085;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.2, s + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, s + (i === 3 ? 0.7 : 0.32));
      o.connect(g); g.connect(master);
      o.start(s); o.stop(s + 0.75);
    });
  }
  function renderSound() {
    els.soundBtn.setAttribute('aria-pressed', state.sound ? 'true' : 'false');
    els.soundLabel.textContent = state.sound ? UI.soundOn : UI.soundOff;
    var icon = els.soundBtn.querySelector('.rlt-pill-icon');
    if (icon) icon.textContent = state.sound ? '🔊' : '🔈';
  }

  // ---------------------------------------------------------------
  // 편집기
  // ---------------------------------------------------------------
  var GRIP = '<svg viewBox="0 0 12 18" width="12" height="18" aria-hidden="true" focusable="false"><g fill="currentColor"><circle cx="3" cy="3" r="1.6"/><circle cx="9" cy="3" r="1.6"/><circle cx="3" cy="9" r="1.6"/><circle cx="9" cy="9" r="1.6"/><circle cx="3" cy="15" r="1.6"/><circle cx="9" cy="15" r="1.6"/></g></svg>';

  function rowIndex(el) {
    var li = el.closest('.rlt-item');
    return li ? Array.prototype.indexOf.call(els.list.children, li) : -1;
  }

  function renderEditor() {
    var n = state.items.length;
    els.list.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var li = document.createElement('li');
      li.className = 'rlt-item';

      var handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'rlt-handle';
      handle.innerHTML = GRIP;
      li.appendChild(handle);

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'rlt-input';
      input.value = state.items[i];
      input.maxLength = CORE.MAX_LABEL;
      input.autocomplete = 'off';
      input.setAttribute('enterkeyhint', 'next');
      li.appendChild(input);

      var pct = document.createElement('span');
      pct.className = 'rlt-pct';
      li.appendChild(pct);

      var wbtn = document.createElement('button');
      wbtn.type = 'button';
      wbtn.className = 'rlt-weight';
      li.appendChild(wbtn);

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'rlt-del';
      del.innerHTML = '<span aria-hidden="true">×</span>';
      li.appendChild(del);

      els.list.appendChild(li);
    }
    refreshRows();
    els.count.textContent = fmt(UI.count, { n: n, max: CORE.MAX_ITEMS });
    els.addBtn.disabled = n >= CORE.MAX_ITEMS;
    els.weighted.checked = state.weighted;
    els.editor.classList.toggle('is-weighted', state.weighted);
    renderRestore();
    renderThemes();
  }

  // 순서·색·확률처럼 순서에 따라 바뀌는 것만 다시 칠한다 (입력 포커스를 건드리지 않음)
  function refreshRows() {
    var n = state.items.length;
    var colors = DRAW.sliceColors(n, state.theme);
    var w = effWeights();
    var total = w.reduce(function (a, b) { return a + b; }, 0) || 1;
    Array.prototype.forEach.call(els.list.children, function (li, i) {
      li.style.setProperty('--c', colors[i]);
      var input = li.querySelector('.rlt-input');
      input.placeholder = fmt(UI.itemN, { n: i + 1 });
      input.setAttribute('aria-label', fmt(UI.ariaItem, { n: i + 1 }));
      li.querySelector('.rlt-handle').setAttribute('aria-label', fmt(UI.ariaHandle, { n: i + 1 }));
      var del = li.querySelector('.rlt-del');
      del.setAttribute('aria-label', fmt(UI.ariaDelete, { n: i + 1 }));
      del.disabled = n <= CORE.MIN_ITEMS;
      var wb = li.querySelector('.rlt-weight');
      var wi = CORE.normWeight(state.weights[i]);
      wb.textContent = '×' + wi;
      wb.setAttribute('aria-label', fmt(UI.ariaWeight, { n: i + 1, w: wi }));
      li.querySelector('.rlt-pct').textContent = Math.round((w[i] / total) * 100) + '%';
    });
  }

  function renderRestore() {
    var k = state.removed.length;
    var fits = state.items.length + k <= CORE.MAX_ITEMS;
    els.restoreBtn.hidden = !(k > 0 && fits);
    if (k) els.restoreBtn.textContent = fmt(UI.restore, { n: k });
  }

  function renderThemes() {
    Array.prototype.forEach.call(els.themes.querySelectorAll('.rlt-theme'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-theme') === state.theme ? 'true' : 'false');
    });
  }

  function changed(opts) {
    opts = opts || {};
    state.highlight = -1;
    if (opts.clearRemoved) state.removed = [];
    if (opts.editor) renderEditor(); else refreshRows();
    queueWheel();
    if (opts.soon) saveSoon(); else save();
  }

  function addItem(focus) {
    if (state.items.length >= CORE.MAX_ITEMS) { toast(fmt(UI.maxReached, { max: CORE.MAX_ITEMS })); return; }
    state.items.push('');
    state.weights.push(1);
    changed({ editor: true });
    if (focus) {
      var inputs = els.list.querySelectorAll('.rlt-input');
      inputs[inputs.length - 1].focus();
    }
  }

  function deleteItem(i, focusPrev) {
    if (state.items.length <= CORE.MIN_ITEMS) { toast(UI.minReached); return; }
    state.items.splice(i, 1);
    state.weights.splice(i, 1);
    changed({ editor: true });
    var inputs = els.list.querySelectorAll('.rlt-input');
    var t = focusPrev ? Math.max(0, i - 1) : Math.min(i, inputs.length - 1);
    if (inputs[t]) inputs[t].focus();
  }

  function swap(a, b) {
    var t = state.items[a]; state.items[a] = state.items[b]; state.items[b] = t;
    t = state.weights[a]; state.weights[a] = state.weights[b]; state.weights[b] = t;
  }

  function applyPreset(key) {
    var list = (UI.presets && UI.presets[key]) || [];
    if (list.length < CORE.MIN_ITEMS) return;
    state.items = list.slice(0, CORE.MAX_ITEMS);
    state.weights = state.items.map(function () { return 1; });
    changed({ editor: true, clearRemoved: true });
  }

  els.list.addEventListener('input', function (e) {
    if (!e.target.classList.contains('rlt-input')) return;
    var i = rowIndex(e.target);
    if (i < 0) return;
    state.items[i] = e.target.value;
    changed({ soon: true });
  });

  els.list.addEventListener('keydown', function (e) {
    var t = e.target;
    var i = rowIndex(t);
    if (i < 0) return;
    if (t.classList.contains('rlt-input')) {
      if (e.key === 'Enter' && !e.isComposing) {
        e.preventDefault();
        var inputs = els.list.querySelectorAll('.rlt-input');
        if (i < inputs.length - 1) inputs[i + 1].focus();
        else addItem(true);
      } else if (e.key === 'Backspace' && t.value === '' && state.items.length > CORE.MIN_ITEMS) {
        e.preventDefault();
        deleteItem(i, true);
      }
    } else if (t.classList.contains('rlt-handle') && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      var j = e.key === 'ArrowUp' ? i - 1 : i + 1;
      if (j < 0 || j >= state.items.length) return;
      swap(i, j);
      changed({ editor: true });
      els.list.children[j].querySelector('.rlt-handle').focus();
    }
  });

  els.list.addEventListener('click', function (e) {
    var i = rowIndex(e.target);
    if (i < 0) return;
    if (e.target.closest('.rlt-del')) deleteItem(i, false);
    else if (e.target.closest('.rlt-weight')) {
      state.weights[i] = (CORE.normWeight(state.weights[i]) % CORE.MAX_WEIGHT) + 1;
      changed();
    }
  });

  // 끌어서 순서 바꾸기: 끌고 있는 줄은 DOM 에서 옮기지 않고(포인터 캡처 유지) 이웃 줄을 넘겨 준다
  els.list.addEventListener('pointerdown', function (e) {
    var handle = e.target.closest('.rlt-handle');
    if (!handle || state.spinning || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    var li = handle.closest('.rlt-item');
    var cur = rowIndex(li);
    var from = cur;
    var startY = e.clientY;
    var step = li.offsetHeight + 6;
    try { handle.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    li.classList.add('is-dragging');

    function move(ev) {
      var dy = ev.clientY - startY;
      var target = CORE.clamp(from + Math.round(dy / step), 0, state.items.length - 1);
      while (cur < target) { els.list.insertBefore(li.nextElementSibling, li); swap(cur, cur + 1); cur++; }
      while (cur > target) { els.list.insertBefore(li.previousElementSibling, li.nextElementSibling); swap(cur, cur - 1); cur--; }
      li.style.transform = 'translateY(' + (dy - (cur - from) * step) + 'px)';
      if (cur !== li._last) { li._last = cur; refreshRows(); state.highlight = -1; queueWheel(); }
    }
    function up() {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      li.classList.remove('is-dragging');
      li.style.transform = '';
      if (cur !== from) changed({ editor: true });
    }
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  });

  els.addBtn.addEventListener('click', function () { addItem(true); });
  els.shuffleBtn.addEventListener('click', function () {
    CORE.shuffleTogether(state.items, state.weights);
    changed({ editor: true });
  });
  els.restoreBtn.addEventListener('click', function () {
    while (state.removed.length) {
      var r = state.removed.pop();
      var at = Math.min(r.index, state.items.length);
      state.items.splice(at, 0, r.label);
      state.weights.splice(at, 0, r.weight);
    }
    changed({ editor: true });
  });
  els.presets.addEventListener('click', function (e) {
    var b = e.target.closest('[data-preset]');
    if (b) applyPreset(b.getAttribute('data-preset'));
  });
  els.themes.addEventListener('click', function (e) {
    var b = e.target.closest('[data-theme]');
    if (!b) return;
    state.theme = b.getAttribute('data-theme');
    renderThemes();
    refreshRows();
    queueWheel();
    save();
  });
  els.weighted.addEventListener('change', function () {
    state.weighted = els.weighted.checked;
    els.editor.classList.toggle('is-weighted', state.weighted);
    changed();
  });

  // ---------------------------------------------------------------
  // 저장 / 공유 링크
  // ---------------------------------------------------------------
  function save() {
    clearTimeout(saveTimer);
    lsSet(LS_KEY, JSON.stringify({ items: state.items, weights: state.weights, weighted: state.weighted, theme: state.theme }));
    if (state.hashMode) updateHash();
  }
  var saveTimer = null;
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 300); }

  function shareHash() {
    var code = CORE.encodeShare(setupSnapshot());
    return code ? '#d=' + code : '';
  }
  function shareUrl() { return window.location.href.split('#')[0] + shareHash(); }
  var lastHash = '';
  function updateHash() {
    var h = shareHash();
    if (!h || h === window.location.hash) return;
    lastHash = h;
    try { window.history.replaceState(null, '', h); } catch (e) { /* noop */ }
  }

  function applySetup(s) {
    state.items = s.items.slice();
    state.weights = s.weights.slice();
    state.weighted = !!s.weighted;
    state.theme = s.theme;
    state.removed = [];
    state.highlight = -1;
  }

  function readHash() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return null;
    var s = CORE.decodeShare(h.slice(3));
    return s || false;
  }

  // 공유 데이터는 공통 끝 화면(data-mg-end)의 공유 버튼들이 쓴다 — 클릭 때마다 shareUrl()을 새로 계산해 최신 #d= 링크를 준다.
  window.setShareData(function () {
    state.hashMode = true;
    updateHash();
    return { title: UI.shareTitle, text: UI.shareText, url: shareUrl() };
  });

  window.addEventListener('hashchange', function () {
    if (window.location.hash === lastHash || state.spinning) return;
    var s = readHash();
    if (!s) return;
    applySetup(s);
    state.hashMode = true;
    renderEditor();
    renderWheel();
    save();
    toast(UI.loadedShare);
  });

  // ---------------------------------------------------------------
  // 돌리기
  // ---------------------------------------------------------------
  var perf = { frames: 0, worst: 0, slow: 0, total: 0 };
  var modalTimer = null; // 멈춘 뒤 결과 창을 여는 타이머 — 그 사이에 다시 돌리면 취소한다

  function setBusy(busy) {
    state.spinning = busy;
    els.editor.disabled = busy;
    els.spinBtn.setAttribute('aria-disabled', busy ? 'true' : 'false');
    els.stage.classList.toggle('is-spinning', busy);
  }

  function spin() {
    if (state.spinning) return;
    if (state.items.length < CORE.MIN_ITEMS) { toast(UI.minReached); return; }
    clearTimeout(modalTimer);
    closeModal(false);
    ensureAudio();
    clearInterval(flashTimer);
    els.spinBtn.classList.remove('is-invite');

    var labels = effLabels();
    var weights = effWeights();
    // 결과를 먼저 뽑는다 (crypto) → 그 칸에 멈추는 각도를 계산 → 애니메이션
    var plan = CORE.planSpin({ current: state.rotation, weights: weights, reduced: reduceMotion });
    var lay = plan.layout;

    setBusy(true);
    if (window.track) window.track('start'); // 한 번 돌리기 = start 한 번 + (결과가 나오면) done 한 번
    if (state.highlight !== -1) { state.highlight = -1; renderWheel(); }

    var bulbStep = TAU / rim.bulbs;
    var lastSlice = CORE.sliceAt(state.rotation, lay);
    var lastPhase = null;
    var t0 = null;
    var prevTs = null;
    var prevAng = state.rotation;
    var end = CORE.totalTime(plan);
    perf = { frames: 0, worst: 0, slow: 0, total: 0 };

    function frame(ts) {
      if (t0 === null) { t0 = ts; prevTs = ts; }
      var elapsed = ts - t0;
      var dtMs = ts - prevTs;
      prevTs = ts;
      if (perf.frames > 0) {
        perf.total += dtMs;
        if (dtMs > perf.worst) perf.worst = dtMs;
        if (dtMs > 20) perf.slow++;
      }
      perf.frames++;

      var ang = CORE.angleAt(plan, elapsed);
      els.wheel.style.transform = 'rotate(' + (ang - state.baked) + 'rad)';

      var dt = Math.min(0.05, dtMs / 1000) || 0.016;
      var speed = Math.abs(ang - prevAng) / dt; // rad/s
      prevAng = ang;
      var s = CORE.sliceAt(ang, lay);
      if (s !== lastSlice) {
        lastSlice = s;
        var strength = Math.min(1, speed / 14);
        kickFlap(0.35 + 0.65 * strength);
        tickSound(0.35 + 0.65 * (1 - strength));
      }
      stepFlap(dt);

      if (!reduceMotion) { // 전구가 휠과 같이 흐른다 (휠이 느려지면 전구도 느려진다)
        var phase = Math.floor(ang / bulbStep) % 3;
        if (phase !== lastPhase) {
          lastPhase = phase;
          drawBulbs(function (i) { return ((i + phase) % 3) === 0 ? 1 : 0.16; });
        }
      }

      if (elapsed < end) raf(frame);
      else finish(plan, labels);
    }
    raf(frame);
  }

  function finish(plan, labels) {
    state.rotation = CORE.normAngle(plan.to);
    state.baked = state.rotation;
    state.highlight = plan.index;
    state.winner = plan.index;
    renderWheel();
    settleFlap();
    setBusy(false);

    var landed = CORE.sliceAt(state.rotation, plan.layout);
    var label = labels[plan.index];
    var color = state.colors[plan.index];
    state.spins++;
    state.history.unshift({ n: state.spins, label: label, color: color });
    if (state.history.length > 50) state.history.length = 50;
    renderHistory();
    lsSet(SPUN_KEY, '1');

    if (window.track) window.track('done');
    winSound();
    flashBulbs();
    els.live.textContent = fmt(UI.announce, { label: label });

    APP.lastSpin = {
      index: plan.index, landed: landed, label: label, labelAtPointer: labels[landed],
      rotation: state.rotation, duration: plan.duration, frac: plan.frac,
      fps: perf.frames > 1 ? Math.round((1000 * (perf.frames - 1)) / perf.total * 10) / 10 : null,
      worstFrameMs: Math.round(perf.worst * 10) / 10, slowFrames: perf.slow, frames: perf.frames,
    };
    if (landed !== plan.index && window.console) console.error('roulette: landing mismatch', APP.lastSpin);

    clearTimeout(modalTimer);
    modalTimer = setTimeout(function () { if (!state.spinning) openModal(label, color); }, reduceMotion ? 120 : 380);
  }

  function renderHistory() {
    els.history.hidden = state.spins === 0;
    els.historyList.innerHTML = '';
    state.history.slice(0, 30).forEach(function (h) {
      var li = document.createElement('li');
      var num = document.createElement('span');
      num.className = 'rlt-h-num';
      num.textContent = h.n;
      num.setAttribute('aria-label', fmt(UI.historyItem, { n: h.n }));
      var dot = document.createElement('span');
      dot.className = 'rlt-h-dot';
      dot.style.background = h.color;
      var lab = document.createElement('span');
      lab.className = 'rlt-h-label';
      lab.textContent = h.label;
      li.appendChild(num); li.appendChild(dot); li.appendChild(lab);
      els.historyList.appendChild(li);
    });
  }

  els.historyClear.addEventListener('click', function () {
    state.history = [];
    renderHistory();
    els.history.hidden = false;
  });

  els.spinBtn.addEventListener('click', spin);
  els.disc.addEventListener('click', spin);
  els.soundBtn.addEventListener('click', function () {
    state.sound = !state.sound;
    lsSet(SOUND_KEY, state.sound ? '1' : '0');
    renderSound();
    if (state.sound && ensureAudio()) {
      setTimeout(function () { tickSound(0.8); }, 30);
    }
  });

  // ---------------------------------------------------------------
  // 결과 창 + 색종이
  // ---------------------------------------------------------------
  var lastFocus = null;
  function openModal(label, color) {
    els.resultLabel.textContent = label;
    els.modalCard.style.setProperty('--win', color);
    els.modalCard.style.setProperty('--win-fg', DRAW.textColorFor(color));
    els.removeBtn.hidden = state.items.length <= CORE.MIN_ITEMS;
    lastFocus = document.activeElement;
    els.modal.hidden = false;
    document.documentElement.classList.add('rlt-modal-open');
    els.againBtn.focus({ preventScroll: true });
    if (!reduceMotion) {
      var r = els.modalCard.getBoundingClientRect();
      confettiBurst(r.left + r.width / 2, r.top + r.height * 0.3);
    }
  }
  function closeModal(restore) {
    if (els.modal.hidden) return;
    els.modal.hidden = true;
    document.documentElement.classList.remove('rlt-modal-open');
    if (restore !== false) {
      var target = lastFocus && document.contains(lastFocus) && lastFocus !== document.body ? lastFocus : els.spinBtn;
      try { target.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    }
  }
  els.modal.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeModal();
  });
  els.againBtn.addEventListener('click', function () { closeModal(false); els.spinBtn.focus({ preventScroll: true }); spin(); });
  els.removeBtn.addEventListener('click', function () {
    var i = state.winner;
    closeModal(false);
    if (i < 0 || i >= state.items.length || state.items.length <= CORE.MIN_ITEMS) return;
    state.removed.push({ label: state.items[i] || labelOf(i), weight: state.weights[i], index: i });
    state.items.splice(i, 1);
    state.weights.splice(i, 1);
    state.winner = -1;
    changed({ editor: true });
    renderWheel();
    els.spinBtn.focus({ preventScroll: true });
    spin();
  });
  document.addEventListener('keydown', function (e) {
    if (els.modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key === 'Tab') { // 창 안에서만 포커스 이동
      var f = Array.prototype.filter.call(els.modal.querySelectorAll('button'), function (b) { return !b.hidden && b.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  var confettiRun = null;
  function confettiBurst(x, y) {
    var c = els.confetti;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    // 색종이 캔버스는 가운데 앱 열(--app-width) 크기 — 좌표도 그 안쪽 기준으로 바꾼다
    var box = c.getBoundingClientRect();
    var W = Math.round(box.width) || window.innerWidth, H = Math.round(box.height) || window.innerHeight;
    x -= box.left;
    y -= box.top;
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    var ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var palette = (DRAW.THEMES[state.theme] || DRAW.THEMES.candy).concat(['#F4B63F', '#FFFFFF', '#E8285A']);
    var parts = [];
    var count = W < 500 ? 110 : 160;
    for (var i = 0; i < count; i++) {
      var a = -Math.PI / 2 + (CORE.randomFloat() - 0.5) * 2.3;
      var v = 420 + CORE.randomFloat() * 720;
      parts.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        w: 6 + CORE.randomFloat() * 6, h: 8 + CORE.randomFloat() * 8,
        rot: CORE.randomFloat() * TAU, vr: (CORE.randomFloat() - 0.5) * 14,
        tilt: CORE.randomFloat() * TAU, vt: 6 + CORE.randomFloat() * 10,
        color: palette[i % palette.length], round: i % 4 === 0,
      });
    }
    var start = null;
    var prev = null;
    var token = {};
    confettiRun = token;
    function f(ts) {
      if (confettiRun !== token) return;
      if (start === null) { start = ts; prev = ts; }
      var dt = Math.min(0.04, (ts - prev) / 1000);
      prev = ts;
      var age = (ts - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      var alive = 0;
      var fade = age > 1.9 ? Math.max(0, 1 - (age - 1.9) / 0.7) : 1;
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        p.vx *= Math.pow(0.32, dt);
        p.vy = p.vy * Math.pow(0.32, dt) + 1500 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.tilt += p.vt * dt;
        if (p.y > H + 30) continue;
        alive++;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillStyle = p.color;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w * 0.45, 0, TAU); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * 0.55);
        ctx.restore();
      }
      if (alive && fade > 0) raf(f);
      else { ctx.clearRect(0, 0, W, H); confettiRun = null; }
    }
    raf(f);
  }

  // ---------------------------------------------------------------
  // 초기화: 공유 링크(#d=) → 마지막 저장값 → 기본 프리셋
  // ---------------------------------------------------------------
  function loadSaved() {
    try {
      var raw = JSON.parse(lsGet(LS_KEY) || 'null');
      var s = CORE.normalizeSetup(raw);
      if (s) s.weighted = !!raw.weighted;
      return s;
    } catch (e) { return null; }
  }

  function init() {
    var fromHash = readHash();
    var saved = null;
    if (fromHash) {
      applySetup(fromHash);
      state.hashMode = true;
      lastHash = window.location.hash;
    } else if ((saved = loadSaved())) {
      applySetup(saved);
    } else {
      applySetup({ items: (UI.presets && UI.presets[DEFAULT_PRESET]) || ['A', 'B'], weights: [], weighted: false, theme: CORE.DEFAULT_THEME });
      state.weights = state.items.map(function () { return 1; });
    }
    renderEditor();
    renderSound();
    renderHistory();
    measure();
    renderWheel();
    if (!lsGet(SPUN_KEY) && !reduceMotion) els.spinBtn.classList.add('is-invite');
    if (fromHash) setTimeout(function () { toast(UI.loadedShare); }, 400);
    else if (fromHash === false) setTimeout(function () { toast(UI.badShare); }, 400);

    // 웹폰트가 늦게 오면 휠 글자를 다시 그린다
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { fontFamily = window.getComputedStyle(document.body).fontFamily; queueWheel(); });
    }
    var lastW = geo.size;
    var onResize = function () {
      var w = Math.round(els.stage.clientWidth);
      if (!w || w === lastW) return;
      lastW = w;
      measure();
      renderWheel();
    };
    if (window.ResizeObserver) new ResizeObserver(onResize).observe(els.stage);
    else window.addEventListener('resize', onResize);
  }

  // 검증용 읽기 전용 핸들 (tools/check-roulette.js 가 아닌 브라우저 확인용)
  var APP = {
    lastSpin: null,
    spin: spin,
    get state() {
      return { items: effLabels(), weights: effWeights(), theme: state.theme, rotation: state.rotation, spinning: state.spinning, history: state.history.slice() };
    },
    shareUrl: shareUrl,
  };
  window.ROULETTE_APP = APP;

  // 공통 끝 화면의 "다시 하기" = 다시 돌리기 (라벨은 PAGE_I18N.retryLabel = result.again, gen-i18n.js 가 넣는다)
  window.setRetry({ label: UI.retryLabel, action: spin });

  init();
})();
