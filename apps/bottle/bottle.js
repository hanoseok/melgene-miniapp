/* apps/bottle/bottle.js — 병 돌리기: 옵션 → 테이블 위 병 → 돌리기 → 결과(+미션 카드) → 최근 기록 → 공통 끝 화면
 * 로직은 bottle-core.js(BOTTLE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 결과를 먼저 정한다: 돌리기를 누르거나 병을 튕기는 순간 crypto 로 자리(또는 각도)를 고르고, 그 자리를 가리키도록 회전량을 계산해 연출만 한다.
 *   손가락으로 튕긴 세기·방향은 회전 방향에만 쓰이고 결과에는 영향이 없다.
 * 움직임 줄이기(prefers-reduced-motion)면 거의 바로 멈춘다(짧은 전환).
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리. 결과(끝 화면, 광고 포함)가 보이면 숨긴다. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 돌릴 때마다 track('start') 한 번, 결과가 보일 때 track('done') 한 번. 공유 링크로 이름만 불러온 것은 세지 않는다.
 * 저장: 마지막 모드·이름 목록만 이 기기 localStorage(mg_bottle_v1, try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): "이 이름으로 링크 복사" 버튼만(이름 목록 + 겹치지 않기). 끝 화면 공통 공유(setShareData)는 언어 없는 깨끗한 주소.
 * 디버그/검사용 읽기 전용 핸들: window.BOTTLE_APP
 */
(function () {
  'use strict';

  var CORE = window.BOTTLE_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var BUILTIN = Array.isArray(I.prompts) ? I.prompts : [];
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_bottle_v1';
  var REDUCED_MS = 250;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('bt-form'), modeFree: $('mode-free'), modeNames: $('mode-names'), namesBox: $('names-box'), names: $('names'),
    namesCount: $('names-count'), skip: $('skip'), prompts: $('prompts'), promptsBox: $('prompts-box'),
    srcBuiltin: $('src-builtin'), srcCustom: $('src-custom'), customBox: $('custom-box'), custom: $('custom'),
    error: $('error'), note: $('shared-note'), stage: $('stage'), seats: $('seats'), bottle: $('bottle'),
    spin: $('spin-btn'), live: $('live'), result: $('result'), kicker: $('res-kicker'), title: $('res-title'), sub: $('res-sub'),
    round: $('res-round'), promptCard: $('prompt-card'), promptText: $('prompt-text'), reset: $('reset-btn'), link: $('link-btn'),
    historyCard: $('history-card'), history: $('history'), adStart: document.querySelector('#screen-bottle > .mg-ad-start'),
    year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = 'free';
  var src = 'builtin';
  var rot = 0;               // 병의 현재 회전(도, 0 = 목이 위)
  var spinning = false;
  var raf = 0;
  var round = null;          // CORE.newRound — 이름 목록이 바뀌면 새로
  var roundSig = '';
  var deck = null;           // CORE.promptDeck — 미션 목록이 바뀌면 새로
  var deckSig = '';
  var history = [];
  var last = null;           // { mode, seat, name, deg, prompt }
  var seatNames = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function degText(d) { return fmt(R.angle, { deg: Math.round(CORE.norm(d)) % 360 }); }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function loadSaved() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (o && typeof o === 'object') return { mode: o.mode === 'names' ? 'names' : 'free', names: typeof o.names === 'string' ? o.names.slice(0, 600) : '' };
    } catch (e) { /* noop */ }
    return null;
  }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify({ mode: mode, names: els.names.value.slice(0, 600) })); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 옵션
  function setSeg(a, b, onA) { a.setAttribute('aria-checked', String(onA)); b.setAttribute('aria-checked', String(!onA)); }
  function setMode(m) {
    mode = m === 'names' ? 'names' : 'free';
    setSeg(els.modeFree, els.modeNames, mode === 'free');
    els.namesBox.hidden = mode !== 'names';
    els.stage.classList.toggle('is-names', mode === 'names');
    syncNames();
  }
  function setSrc(s) {
    src = s === 'custom' ? 'custom' : 'builtin';
    setSeg(els.srcBuiltin, els.srcCustom, src === 'builtin');
    els.customBox.hidden = src !== 'custom';
  }
  function syncPrompts() { els.promptsBox.hidden = !els.prompts.checked; }
  function currentNames() { return mode === 'names' ? CORE.parseNames(els.names.value).names.slice(0, CORE.MAX_SEATS) : []; }
  function syncNames() {
    var nm = mode === 'names' ? CORE.parseNames(els.names.value).names : [];
    els.namesCount.textContent = nm.length ? fmt(U.namesCount, { n: nm.length }) : '';
    seatNames = nm.slice(0, CORE.MAX_SEATS);
    var sig = seatNames.join('\n');
    if (sig !== roundSig) { roundSig = sig; round = seatNames.length >= CORE.MIN_SEATS ? CORE.newRound(seatNames.length) : null; }
    renderSeats();
  }
  function readRaw() {
    return { mode: mode, names: els.names.value, skip: els.skip.checked, prompts: els.prompts.checked, promptSrc: src, custom: els.custom.value };
  }
  function clearError() {
    els.error.hidden = true;
    els.error.textContent = '';
    els.names.removeAttribute('aria-invalid');
    els.custom.removeAttribute('aria-invalid');
  }
  function showError(v) {
    els.error.textContent = fmt(E[v.error] || E.namesTooFew, { n: v.n });
    els.error.hidden = false;
    var f = v.field === 'custom' ? els.custom : els.names;
    if (v.field === 'custom') { els.prompts.checked = true; syncPrompts(); setSrc('custom'); }
    f.setAttribute('aria-invalid', 'true');
    focusSoft(f);
    try { els.error.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 테이블(자리)
  function renderSeats() {
    els.seats.innerHTML = '';
    var n = seatNames.length;
    els.seats.hidden = !(mode === 'names' && n >= CORE.MIN_SEATS);
    if (els.seats.hidden) return;
    var frag = document.createDocumentFragment();
    seatNames.forEach(function (name, i) {
      var li = el('li', 'bt-seat');
      var a = CORE.seatAngle(i, n) * Math.PI / 180;
      li.style.left = (50 + 41 * Math.sin(a)).toFixed(3) + '%';
      li.style.top = (50 - 41 * Math.cos(a)).toFixed(3) + '%';
      li.setAttribute('data-seat', String(i));
      li.appendChild(el('span', 'bt-seat-name', name));
      li.title = name;
      if (round && els.skip.checked && round.picked.indexOf(i) >= 0 && round.left.length) li.classList.add('is-done');
      frag.appendChild(li);
    });
    els.seats.appendChild(frag);
    layout();
  }
  function layout() {
    var w = els.stage.clientWidth || 320;
    var n = Math.max(seatNames.length, 2);
    var arc = 2 * Math.PI * 0.41 * w / n;               // 이웃 자리 사이 둘레
    var chip = Math.max(44, Math.min(0.32 * w, arc * 0.9));
    els.seats.style.setProperty('--chip-w', Math.floor(chip) + 'px');
    els.seats.style.setProperty('--chip-fs', (n > 9 ? 11.5 : n > 6 ? 12.5 : 14) + 'px');
  }
  function markSeat(seat) {
    Array.prototype.forEach.call(els.seats.children, function (li) {
      var i = Number(li.getAttribute('data-seat'));
      li.classList.toggle('is-picked', i === seat);
      var done = round && els.skip.checked && round.picked.indexOf(i) >= 0 && round.left.length > 0 && i !== seat;
      li.classList.toggle('is-done', !!done);
    });
  }

  // ---------------------------------------------------------------- 병 회전
  function applyRot(d) { els.bottle.style.setProperty('--rot', d.toFixed(2) + 'deg'); }
  // 숨은 탭 등으로 requestAnimationFrame 이 멈춰도 ms + 0.5초 뒤에는 반드시 끝낸다(결과는 이미 정해져 있음).
  function animateTo(from, to, ms, done) {
    cancelAnimationFrame(raf);
    var ended = false;
    function end() { if (ended) return; ended = true; cancelAnimationFrame(raf); clearTimeout(guard); applyRot(to); done(); }
    var guard = setTimeout(end, Math.max(0, ms) + 500);
    if (ms <= 0) { end(); return; }
    var t0 = 0;
    function step(ts) {
      if (ended) return;
      if (!t0) t0 = ts;
      var t = Math.min(1, (ts - t0) / ms);
      applyRot(from + (to - from) * CORE.ease(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else end();
    }
    raf = requestAnimationFrame(step);
  }
  function setBusy(on) {
    spinning = on;
    els.spin.disabled = on;
    els.spin.textContent = on ? U.spinning : U.spin;
    els.stage.classList.toggle('is-spinning', on);
    els.bottle.setAttribute('aria-disabled', String(on));
    [els.modeFree, els.modeNames, els.names, els.skip, els.prompts, els.srcBuiltin, els.srcCustom, els.custom, els.reset].forEach(function (x) { x.disabled = on; });
  }

  // ---------------------------------------------------------------- 돌리기 (결과 먼저 → 연출)
  function pickPrompt(cfg) {
    if (!cfg.prompts) return '';
    var list = cfg.promptSrc === 'custom' ? cfg.custom : BUILTIN;
    var sig = cfg.promptSrc + '\n' + list.join('\n');
    if (sig !== deckSig || !deck) { deckSig = sig; deck = CORE.promptDeck(list.length); }
    var i = CORE.nextPrompt(deck);
    return i >= 0 ? list[i] : '';
  }
  function spin(dir) {
    if (spinning) return;
    var v = CORE.validate(readRaw());
    if (!v.ok) { showError(v); return; }
    clearError();
    els.note.hidden = true;
    var cfg = v.cfg;
    var res = { mode: cfg.mode, seat: -1, name: '', deg: 0, prompt: '' };
    var target;
    if (cfg.mode === 'names') {
      syncNames();
      if (!round) round = CORE.newRound(cfg.names.length);
      var n = cfg.names.length;
      res.seat = CORE.chooseSeat(round, cfg.skip);
      target = CORE.targetAngle(res.seat, n, CORE.randomFrac());
      if (CORE.angleToSeat(target, n) !== res.seat) target = CORE.seatAngle(res.seat, n); // 안전장치(일어나지 않음)
      res.name = cfg.names[res.seat];
    } else {
      target = CORE.randomAngle();
    }
    res.deg = target;
    res.prompt = pickPrompt(cfg);
    var plan = CORE.spinPlan();
    var to = CORE.planRotation(rot, target, plan.turns, dir);
    var from = rot;
    save();
    markSeat(-1);
    setBusy(true);
    track('start');
    animateTo(from, to, REDUCED ? REDUCED_MS : plan.ms, function () {
      rot = CORE.norm(to);
      applyRot(rot);
      finish(res, cfg);
    });
  }
  function finish(res, cfg) {
    setBusy(false);
    last = res;
    try { if (navigator.vibrate) navigator.vibrate([40, 30, 60]); } catch (e) { /* noop */ }
    if (res.mode === 'names') markSeat(res.seat);
    history = CORE.pushHistory(history, { name: res.mode === 'names' ? res.name : R.historyFree + ' · ' + degText(res.deg), prompt: res.prompt });
    renderResult(res, cfg);
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 결과·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    els.live.textContent = res.mode === 'names' ? fmt(R.live, { name: res.name }) : fmt(R.liveFree, { deg: Math.round(res.deg) % 360 });
    track('done');
    try { els.result.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ }
  }
  function renderRound() {
    var on = !!(last && last.mode === 'names' && els.skip.checked && round);
    els.round.hidden = !on;
    els.reset.hidden = !on;
    if (!on) return;
    els.round.textContent = round.left.length
      ? fmt(R.round, { r: round.round, k: round.picked.length, n: round.n })
      : fmt(R.roundDone, { r: round.round + 1 });
  }
  function renderResult(res, cfg) {
    var named = res.mode === 'names';
    els.kicker.hidden = !named;
    els.title.textContent = named ? res.name : R.freeTitle;
    els.sub.textContent = named ? '' : R.freeText;
    els.sub.hidden = named;
    els.promptCard.hidden = !res.prompt;
    els.promptText.textContent = res.prompt || '';
    els.link.hidden = !(named && cfg.names.length >= CORE.MIN_SEATS);
    renderRound();
    els.history.innerHTML = '';
    history.forEach(function (h, i) {
      var li = el('li', 'bt-hist-row' + (i === 0 ? ' is-new' : ''));
      li.appendChild(el('span', 'bt-hist-who', h.name));
      if (h.prompt) li.appendChild(el('span', 'bt-hist-prompt', h.prompt));
      els.history.appendChild(li);
    });
    els.historyCard.hidden = history.length < 2;
  }
  function resetRound() {
    if (spinning || !seatNames.length) return;
    round = CORE.newRound(seatNames.length);
    markSeat(last && last.mode === 'names' ? last.seat : -1);
    Array.prototype.forEach.call(els.seats.children, function (li) { li.classList.remove('is-done'); });
    renderRound();
    if (window.toast) window.toast(R.resetDone);
  }

  // ---------------------------------------------------------------- 병 튕기기 (pointer events) — 결과는 언제나 crypto
  var drag = null;
  function pointerAngle(e) {
    var r = els.stage.getBoundingClientRect();
    return Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
  }
  els.bottle.addEventListener('pointerdown', function (e) {
    if (spinning || (e.button != null && e.button > 0)) return;
    try { els.bottle.setPointerCapture(e.pointerId); } catch (x) { /* noop */ }
    var a = pointerAngle(e);
    drag = { id: e.pointerId, a: a, acc: 0, t0: e.timeStamp || Date.now(), start: rot, samples: [{ t: e.timeStamp || Date.now(), acc: 0 }] };
    e.preventDefault();
  });
  els.bottle.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var a = pointerAngle(e);
    var d = a - drag.a;
    if (d > 180) d -= 360; else if (d < -180) d += 360;
    drag.a = a;
    drag.acc += d;
    var t = e.timeStamp || Date.now();
    drag.samples.push({ t: t, acc: drag.acc });
    while (drag.samples.length > 2 && t - drag.samples[0].t > 140) drag.samples.shift();
    rot = drag.start + drag.acc;
    applyRot(rot);
  });
  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag;
    drag = null;
    if (cancelled) return;
    var t = e.timeStamp || Date.now();
    var s0 = d.samples[0];
    var v = (d.acc - s0.acc) / Math.max(16, t - s0.t);   // 도/ms
    var tap = Math.abs(d.acc) < 8 && t - d.t0 < 600;
    if (tap) spin(1);
    else if (Math.abs(v) > 0.25) spin(v < 0 ? -1 : 1);
  }
  els.bottle.addEventListener('pointerup', function (e) { endDrag(e, false); });
  els.bottle.addEventListener('pointercancel', function (e) { endDrag(e, true); });
  els.bottle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); spin(1); }
  });

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function copyText(text, msg) {
    var done = function () { if (window.toast) window.toast(msg); };
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { /* noop */ }
      done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(fallback);
    else fallback();
  }
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var o = CORE.decodeShare(window.location.hash.slice(3));
    clearHash();
    if (!o) { els.error.textContent = E.badLink; els.error.hidden = false; return false; }
    els.names.value = o.names.join('\n');
    els.skip.checked = o.skip;
    setMode('names');
    els.note.hidden = false;
    return true;
  }
  function again() {
    try { els.stage.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ }
    spin(1);
  }

  if (window.setShareData) {
    window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: again });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.modeFree.addEventListener('click', function () { clearError(); setMode('free'); save(); });
  els.modeNames.addEventListener('click', function () { clearError(); setMode('names'); save(); if (!els.names.value) focusSoft(els.names); });
  var namesTimer = null;
  els.names.addEventListener('input', function () { clearError(); clearTimeout(namesTimer); namesTimer = setTimeout(function () { syncNames(); save(); }, 150); });
  els.skip.addEventListener('change', function () { if (round) round = CORE.newRound(round.n); renderSeats(); renderRound(); });
  els.prompts.addEventListener('change', function () { clearError(); syncPrompts(); });
  els.srcBuiltin.addEventListener('click', function () { clearError(); setSrc('builtin'); });
  els.srcCustom.addEventListener('click', function () { clearError(); setSrc('custom'); focusSoft(els.custom); });
  els.custom.addEventListener('input', clearError);
  els.spin.addEventListener('click', function () { spin(1); });
  els.reset.addEventListener('click', resetRound);
  els.link.addEventListener('click', function () {
    var enc = CORE.encodeShare({ names: seatNames, skip: els.skip.checked });
    if (enc) copyText(baseUrl() + '#d=' + enc, R.linkCopied);
  });
  window.addEventListener('resize', layout);
  window.addEventListener('hashchange', function () { if (!spinning) loadShared(); });

  window.BOTTLE_APP = {
    spinning: function () { return spinning; },
    rot: function () { return rot; },
    mode: function () { return mode; },
    names: function () { return currentNames(); },
    round: function () { return round ? JSON.parse(JSON.stringify(round)) : null; },
    last: function () { return last ? JSON.parse(JSON.stringify(last)) : null; },
    history: function () { return JSON.parse(JSON.stringify(history)); },
    seatAtRot: function () { return seatNames.length >= CORE.MIN_SEATS ? CORE.angleToSeat(rot, seatNames.length) : -1; }
  };

  var saved = loadSaved();
  if (saved) els.names.value = saved.names;
  setSrc('builtin');
  syncPrompts();
  setMode(saved ? saved.mode : 'free');
  applyRot(rot);
  loadShared();
})();
