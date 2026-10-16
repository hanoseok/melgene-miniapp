/* apps/lots/lots.js — 제비뽑기: 설정(시작 화면) → 접힌 쪽지 격자(휴대폰을 돌려 가며 한 장씩) → 누가 뭘 뽑았나(끝 화면)
 * 로직은 lots-core.js(LOTS_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 쪽지는 "접기"를 누르는 순간 crypto 로 한 번 섞여 위치마다 내용이 정해진다. 펼치는 연출은 그 값을 보여 주기만 한다.
 * 움직임 줄이기(prefers-reduced-motion)면 펼침·꽃가루 없이 바로.
 * 광고: 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면과 함께 숨음). 뽑기 화면에는 광고 없음. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 쪽지를 접고 뽑기를 시작할 때 track('start') 한 번, 결과(끝 화면)가 보일 때 track('done') 한 번(다시 뽑을 때마다 또). 공유 링크로 본 결과는 세지 않는다.
 * 저장: 최근 설정 5개만 이 기기 localStorage(mg_lots_recent_v1, try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): "결과 링크 복사" 버튼만. 받은 사람은 다시 뽑지 않고 그 결과를 "공유된 결과"로 본다. 다시 하기 = "나도 만들기"(설정으로).
 *   끝 화면 공통 공유(setShareData)는 언어 없는 깨끗한 주소.
 * 디버그/검사용 읽기 전용 핸들: window.LOTS_APP
 */
(function () {
  'use strict';

  var CORE = window.LOTS_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var E = I.errors || {};
  var D = I.draw || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_lots_recent_v1';
  var UNFOLD_MS = 900;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), drawScr: $('screen-draw'), end: $('screen-end'),
    form: $('lt-form'), count: $('count'), countDec: $('count-dec'), countInc: $('count-inc'), countNote: $('count-note'),
    namesBtn: $('names-btn'), namesBox: $('names-box'), names: $('names'),
    modeSimple: $('mode-simple'), modeCustom: $('mode-custom'), simpleBox: $('simple-box'), customBox: $('custom-box'),
    winners: $('winners'), winDec: $('winners-dec'), winInc: $('winners-inc'), preview: $('simple-preview'),
    kinds: $('kinds'), kindAdd: $('kind-add'), fillBlank: $('fill-blank'), total: $('total'),
    hide: $('hide'), fx: $('fx'), error: $('error'), start: $('start-btn'),
    recent: $('recent'), recentList: $('recent-list'), recentClear: $('recent-clear'),
    progress: $('progress'), bar: $('bar-fill'), turn: $('turn'), grid: $('grid'), finish: $('finish-btn'), live: $('live'),
    reveal: $('reveal'), revealWho: $('reveal-who'), paper: $('paper'), paperNo: $('paper-no'), flapNo: $('flap-no'),
    paperLabel: $('paper-label'), paperTag: $('paper-tag'), next: $('next-btn'), confetti: $('confetti'),
    pass: $('pass'), passTitle: $('pass-title'), ready: $('ready-btn'),
    card: $('result-card'), badge: $('shared-badge'), note: $('shared-note'), tags: $('res-tags'), summary: $('summary'),
    leftover: $('leftover'), tally: $('tally'), copy: $('copy-btn'), link: $('link-btn'), edit: $('edit-btn'),
    year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = 'simple';
  var kinds = [];            // 직접 쓰기 모드의 줄 [{ l, n, w }]
  var session = null;        // CORE.newSession
  var phase = 'setup';       // setup | pick | reveal | pass | end
  var last = null;           // { p, r, t } — 끝 화면에 보이는 결과
  var shared = false;
  var history = loadHistory();
  var timers = [];
  var finishArmed = 0;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); }); timers = []; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dateText(ms) {
    try { return new Intl.DateTimeFormat(I.lang || 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms)); } catch (e) { return new Date(ms).toLocaleString(); }
  }
  function toInt(v, d) { var n = parseInt(v, 10); return isNaN(n) ? d : n; }
  function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
  function scrollTop() { try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); } }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // ---------------------------------------------------------------- 최근 설정 (localStorage, 실패해도 동작)
  function loadHistory() {
    try { return CORE.cleanHistory(JSON.parse(window.localStorage.getItem(STORE) || '[]')); } catch (e) { return []; }
  }
  function saveHistory() {
    try {
      if (history.length) window.localStorage.setItem(STORE, JSON.stringify(history));
      else window.localStorage.removeItem(STORE);
    } catch (e) { /* noop */ }
  }
  function setupSummary(h) {
    var parts = [fmt(U.recentSlips, { n: h.p.total })];
    parts.push(h.p.k.map(function (k) { return k.l + ' ' + k.n; }).join(' · '));
    if (h.p.names.length) parts.push(fmt(U.recentNames, { n: h.p.names.length }));
    return parts.join(' · ');
  }
  function renderHistory() {
    els.recentList.innerHTML = '';
    history.forEach(function (h, i) {
      var li = el('li');
      var b = el('button', 'lt-recent-item', setupSummary(h));
      b.type = 'button';
      b.setAttribute('data-recent', String(i));
      b.addEventListener('click', function () { fillForm(h.mode, h.p); clearError(); });
      li.appendChild(b);
      els.recentList.appendChild(li);
    });
    els.recent.hidden = history.length === 0;
  }

  // ---------------------------------------------------------------- 설정 화면
  function namesList() { return CORE.parseNames(els.names.value).names; }
  function slipCount() {
    var nm = namesList();
    if (nm.length) return nm.length;
    return clamp(toInt(els.count.value, CORE.DEFAULTS.count), CORE.MIN_SLIPS, CORE.MAX_SLIPS);
  }
  function syncNames() {
    var nm = namesList();
    var on = nm.length > 0;
    els.count.disabled = on; els.countDec.disabled = on; els.countInc.disabled = on;
    if (on) els.count.value = clamp(nm.length, 0, 999);
    els.countNote.hidden = !on;
    els.countNote.textContent = on ? fmt(U.countNote, { n: nm.length }) : '';
    updatePreview();
  }
  function setNamesOpen(open) {
    els.namesBox.hidden = !open;
    els.namesBtn.setAttribute('aria-expanded', String(open));
  }
  function setMode(m) {
    mode = m === 'custom' ? 'custom' : 'simple';
    els.modeSimple.setAttribute('aria-checked', String(mode === 'simple'));
    els.modeCustom.setAttribute('aria-checked', String(mode === 'custom'));
    els.simpleBox.hidden = mode !== 'simple';
    els.customBox.hidden = mode !== 'custom';
    if (mode === 'custom' && !kinds.length) {
      kinds = (U.customExample || []).map(function (k) { return { l: k.l, n: k.n, w: k.w !== false }; });
      fillBlank();
    }
    renderKinds();
    updatePreview();
  }
  function updatePreview() {
    var n = slipCount();
    var w = clamp(toInt(els.winners.value, 1), 1, n);
    els.preview.textContent = fmt(U.simplePreview, { w: w, b: n - w, win: U.winLabel, blank: U.blankLabel });
    var sum = kinds.reduce(function (a, k) { return a + (toInt(k.n, 0) || 0); }, 0);
    els.total.textContent = fmt(U.total, { sum: sum, n: n });
    els.total.classList.toggle('is-ok', sum === n);
    els.total.classList.toggle('is-bad', sum !== n);
  }
  function blankIndex() {
    var bl = String(U.blankLabel).toLowerCase();
    for (var i = 0; i < kinds.length; i++) if (String(kinds[i].l).trim().toLowerCase() === bl) return i;
    return -1;
  }
  function fillBlank() {
    var n = slipCount();
    var bi = blankIndex();
    var others = kinds.reduce(function (a, k, i) { return i === bi ? a : a + (toInt(k.n, 0) || 0); }, 0);
    var rest = n - others;
    if (rest > 0) {
      if (bi >= 0) kinds[bi].n = rest;
      else if (kinds.length < CORE.MAX_KINDS) kinds.push({ l: U.blankLabel, n: rest, w: false });
    } else if (bi >= 0) {
      kinds.splice(bi, 1);
    }
  }
  function renderKinds() {
    els.kinds.innerHTML = '';
    kinds.forEach(function (k, i) {
      var li = el('li', 'lt-kind');
      li.setAttribute('data-kind', String(i));
      var inp = el('input', 'lt-input lt-kind-label');
      inp.type = 'text'; inp.value = k.l; inp.maxLength = CORE.MAX_LABEL; inp.placeholder = U.kindPh;
      inp.setAttribute('aria-label', U.kindPh);
      inp.addEventListener('input', function () { kinds[i].l = inp.value; clearError(); });
      var st = el('div', 'lt-stepper lt-stepper-sm');
      var dec = el('button', 'lt-step', '−'); dec.type = 'button'; dec.setAttribute('aria-label', U.countDec);
      var num = el('input', 'lt-input lt-input-num'); num.type = 'number'; num.min = '1'; num.max = String(CORE.MAX_SLIPS); num.step = '1';
      num.inputMode = 'numeric'; num.value = k.n; num.setAttribute('aria-label', U.kindCountAria);
      var inc = el('button', 'lt-step', '+'); inc.type = 'button'; inc.setAttribute('aria-label', U.countInc);
      function setN(v) { kinds[i].n = clamp(v, 1, CORE.MAX_SLIPS); num.value = kinds[i].n; clearError(); updatePreview(); }
      dec.addEventListener('click', function () { setN(toInt(num.value, 1) - 1); });
      inc.addEventListener('click', function () { setN(toInt(num.value, 0) + 1); });
      num.addEventListener('input', function () { kinds[i].n = num.value; clearError(); updatePreview(); });
      st.appendChild(dec); st.appendChild(num); st.appendChild(inc);
      var win = el('button', 'lt-kind-win', '🎉'); win.type = 'button';
      win.setAttribute('aria-pressed', String(!!k.w)); win.setAttribute('aria-label', U.kindWin); win.title = U.kindWin;
      win.addEventListener('click', function () { kinds[i].w = !kinds[i].w; win.setAttribute('aria-pressed', String(kinds[i].w)); });
      var rm = el('button', 'lt-kind-rm', '×'); rm.type = 'button'; rm.setAttribute('aria-label', U.kindRemove); rm.title = U.kindRemove;
      rm.addEventListener('click', function () { kinds.splice(i, 1); clearError(); renderKinds(); updatePreview(); });
      li.appendChild(inp); li.appendChild(st); li.appendChild(win); li.appendChild(rm);
      els.kinds.appendChild(li);
    });
    els.kindAdd.disabled = kinds.length >= CORE.MAX_KINDS;
    updatePreview();
  }
  function readRaw() {
    return {
      count: els.count.value, mode: mode, winners: els.winners.value, winLabel: U.winLabel, blankLabel: U.blankLabel,
      kinds: kinds.map(function (k) { return { l: k.l, n: k.n, w: k.w }; }), names: els.names.value,
      hide: els.hide.checked, fx: els.fx.checked
    };
  }
  function fillForm(m, p) {
    els.names.value = (p.names || []).join('\n');
    setNamesOpen(!!(p.names && p.names.length));
    els.count.value = p.total;
    els.hide.checked = p.hide !== false;
    els.fx.checked = p.fx !== false;
    if (m === 'simple') {
      els.winners.value = p.k[0] ? p.k[0].n : 1;
    } else {
      kinds = p.k.map(function (k) { return { l: k.l, n: k.n, w: !!k.w }; });
    }
    setMode(m);
    syncNames();
  }
  function clearError() {
    els.error.hidden = true;
    els.error.textContent = '';
    [els.count, els.winners, els.names].forEach(function (f) { f.removeAttribute('aria-invalid'); });
    Array.prototype.forEach.call(els.kinds.querySelectorAll('[aria-invalid]'), function (f) { f.removeAttribute('aria-invalid'); });
  }
  function showError(v) {
    els.error.textContent = fmt(E[v.error] || E.countRange, { n: v.n, sum: v.sum, label: v.label || '' });
    els.error.hidden = false;
    var f = null;
    if (v.field === 'count') f = els.count;
    else if (v.field === 'winners') f = els.winners;
    else if (v.field === 'names') { setNamesOpen(true); f = els.names; }
    else if (v.field === 'kinds' && v.index != null) {
      var row = els.kinds.querySelector('[data-kind="' + v.index + '"]');
      if (row) f = row.querySelector(v.error === 'kindCount' ? '.lt-input-num' : '.lt-kind-label');
    }
    if (f) { f.setAttribute('aria-invalid', 'true'); try { f.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
    try { els.error.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ }
  }
  function stepCount(d) {
    if (els.count.disabled) return;
    els.count.value = clamp(toInt(els.count.value, CORE.DEFAULTS.count) + d, CORE.MIN_SLIPS, CORE.MAX_SLIPS);
    clearError();
    updatePreview();
  }
  function stepWinners(d) {
    els.winners.value = clamp(toInt(els.winners.value, 1) + d, 1, slipCount());
    clearError();
    updatePreview();
  }

  // ---------------------------------------------------------------- 화면 전환
  function show(name) {
    els.setup.hidden = name !== 'setup';
    els.drawScr.hidden = name !== 'draw';
    els.end.hidden = name !== 'end';
    scrollTop();
  }

  // ---------------------------------------------------------------- 뽑기
  function whoOf(p, turn) { return p.names && p.names[turn] ? p.names[turn] : fmt(R.personNum, { k: turn + 1 }); }
  function begin() {
    var v = CORE.validate(readRaw());
    if (!v.ok) { showError(v); return; }
    clearError();
    history = CORE.pushHistory(history, { mode: v.mode, p: v.p, t: Date.now() });
    saveHistory();
    renderHistory();
    startSession(v.p);
  }
  function startSession(p) {
    clearTimers();
    if (shared) { clearSharedHash(); setShared(false); }
    session = CORE.newSession(p);    // 여기서 모든 쪽지가 정해진다
    last = null;
    phase = 'pick';
    els.reveal.hidden = true;
    els.pass.hidden = true;
    disarmFinish();
    buildGrid();
    updateTurn();
    show('draw');
    track('start');
  }
  function tilt(i) { return ((i * 37) % 9) - 4; }
  function buildGrid() {
    els.grid.innerHTML = '';
    var n = session.deck.length;
    els.grid.className = 'lt-grid' + (n > 30 ? ' is-many' : n > 12 ? ' is-mid' : ' is-few');
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var b = el('button', 'lt-slip');
      b.type = 'button';
      b.setAttribute('data-i', String(i));
      b.style.setProperty('--tilt', tilt(i) + 'deg');
      b.setAttribute('aria-label', fmt(D.slipAria, { k: i + 1 }));
      b.appendChild(el('span', 'lt-slip-no', 'No.' + pad(i + 1)));
      b.appendChild(el('span', 'lt-slip-label'));
      frag.appendChild(b);
    }
    els.grid.appendChild(frag);
  }
  function updateTurn() {
    var k = session.taken.length;
    var n = session.deck.length;
    els.progress.textContent = fmt(D.progress, { k: k, n: n });
    els.bar.style.width = (n ? (k / n) * 100 : 0) + '%';
    var p = session.p;
    els.turn.textContent = k < n ? (p.names.length ? fmt(D.turnName, { name: p.names[k] }) : fmt(D.turnNum, { k: k + 1 })) : '';
    els.finish.disabled = k === 0 || k >= n;
  }
  function onSlip(e) {
    var b = e.target.closest ? e.target.closest('.lt-slip') : null;
    if (!b || phase !== 'pick') return;
    var pos = Number(b.getAttribute('data-i'));
    var turn = session.taken.length;
    var ki = CORE.pick(session, pos);
    if (ki < 0) return;
    disarmFinish();
    var kind = session.p.k[ki];
    b.disabled = true;
    b.classList.add('is-taken');
    b.setAttribute('aria-label', fmt(D.slipTaken, { k: pos + 1 }));
    if (!session.p.hide) {
      b.classList.add('is-open');
      b.classList.toggle('is-win', !!kind.w);
      b.querySelector('.lt-slip-label').textContent = kind.l;
    }
    updateTurn();
    showReveal(turn, ki, pos);
  }
  function showReveal(turn, ki, pos) {
    var p = session.p;
    var kind = p.k[ki];
    phase = 'reveal';
    els.revealWho.textContent = p.names.length ? fmt(D.gotName, { name: p.names[turn] }) : fmt(D.gotNum, { k: turn + 1 });
    els.paperNo.textContent = 'No.' + pad(pos + 1);
    els.flapNo.textContent = 'No.' + pad(pos + 1);
    els.paperLabel.textContent = kind.l;
    els.paperTag.textContent = kind.w ? D.winTag : (kind.l === U.blankLabel ? D.blankTag : '');
    els.paper.classList.toggle('is-win', !!kind.w);
    els.next.textContent = CORE.isDone(session) ? D.seeResults : D.next;
    els.live.textContent = fmt(D.live, { who: whoOf(p, turn), label: kind.l });
    els.confetti.innerHTML = '';
    els.reveal.hidden = false;
    if (REDUCED) {
      els.paper.className = 'lt-paper is-open' + (kind.w ? ' is-win' : '');
      els.next.disabled = false;
      focusSoft(els.next);
      return;
    }
    els.paper.className = 'lt-paper' + (kind.w ? ' is-win' : '');
    els.next.disabled = true;
    // 다음 프레임에 펼침(transition) 시작
    void els.paper.offsetWidth;
    later(function () { els.paper.classList.add('is-open'); }, 30);
    later(function () {
      els.next.disabled = false;
      focusSoft(els.next);
      if (p.fx && kind.w) confetti();
    }, UNFOLD_MS);
  }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  var COLORS = ['#e2412b', '#f2b632', '#1f7a6d', '#2f5fd0', '#ff8fa3', '#fffaf0'];
  function confetti() {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 36; i++) {
      var s = el('i', 'lt-bit');
      s.style.setProperty('--x', (CORE.cryptoInt(200) - 100) + '%');
      s.style.setProperty('--y', (CORE.cryptoInt(60) + 40) + 'vh');
      s.style.setProperty('--r', (CORE.cryptoInt(720) - 360) + 'deg');
      s.style.setProperty('--d', (CORE.cryptoInt(300)) + 'ms');
      s.style.left = (CORE.cryptoInt(80) + 10) + '%';
      s.style.background = COLORS[CORE.cryptoInt(COLORS.length)];
      frag.appendChild(s);
    }
    els.confetti.appendChild(frag);
    later(function () { els.confetti.innerHTML = ''; }, 2200);
  }
  function onNext() {
    if (phase !== 'reveal' || els.next.disabled) return;
    clearTimers();
    els.reveal.hidden = true;
    els.confetti.innerHTML = '';
    if (CORE.isDone(session)) { finishDraw(); return; }
    var p = session.p;
    if (p.hide) {
      var k = session.taken.length;
      els.passTitle.textContent = p.names.length ? fmt(D.passName, { name: p.names[k] }) : D.passNext;
      els.pass.hidden = false;
      phase = 'pass';
      focusSoft(els.ready);
    } else {
      phase = 'pick';
    }
  }
  function onReady() {
    if (phase !== 'pass') return;
    els.pass.hidden = true;
    phase = 'pick';
  }
  function disarmFinish() {
    finishArmed = 0;
    els.finish.textContent = D.finish;
    els.finish.classList.remove('is-armed');
  }
  function onFinish() {
    if (phase !== 'pick' || !session || !session.taken.length) return;
    if (!finishArmed) {
      finishArmed = 1;
      els.finish.textContent = D.finishConfirm;
      els.finish.classList.add('is-armed');
      later(disarmFinish, 3500);
      return;
    }
    finishDraw();
  }
  function finishDraw() {
    clearTimers();
    disarmFinish();
    els.reveal.hidden = true;
    els.pass.hidden = true;
    last = { p: session.p, r: CORE.results(session), t: session.t };
    phase = 'end';
    renderEnd(last);
    show('end');
    track('done');
  }

  // ---------------------------------------------------------------- 끝 화면
  function renderEnd(rec) {
    var p = rec.p;
    els.badge.hidden = !shared;
    els.card.classList.toggle('is-shared', shared);
    els.note.hidden = !shared;
    els.note.textContent = shared ? fmt(R.sharedNote, { date: dateText(rec.t) }) : '';
    els.tags.innerHTML = '';
    [fmt(R.slipsTag, { n: p.total }), fmt(R.drawnTag, { k: rec.r.length })].forEach(function (t) { els.tags.appendChild(el('li', null, t)); });
    els.summary.innerHTML = '';
    rec.r.forEach(function (ki, turn) {
      var k = p.k[ki];
      var li = el('li', 'lt-sum-row' + (k.w ? ' is-win' : ''));
      li.appendChild(el('span', 'lt-sum-who', whoOf(p, turn)));
      li.appendChild(el('span', 'lt-sum-dots'));
      li.appendChild(el('span', 'lt-sum-label', (k.w ? '🎉 ' : '') + k.l));
      els.summary.appendChild(li);
    });
    var left = p.total - rec.r.length;
    els.leftover.hidden = left <= 0;
    els.leftover.textContent = left > 0 ? fmt(R.leftover, { n: left }) : '';
    els.tally.innerHTML = '';
    CORE.tally(p, rec.r).forEach(function (t) {
      var li = el('li', 'lt-tally-row' + (t.w ? ' is-win' : ''));
      li.appendChild(el('span', 'lt-tally-label', t.l + ' ×' + p.k[t.kind].n));
      li.appendChild(el('span', 'lt-tally-who', t.who.length ? t.who.map(function (turn) { return whoOf(p, turn); }).join(', ') : R.nobody));
      els.tally.appendChild(li);
    });
  }
  function resultText(rec) {
    var p = rec.p;
    var lines = [R.textTitle + ' (' + fmt(R.slipsTag, { n: p.total }) + ')'];
    rec.r.forEach(function (ki, turn) { lines.push((turn + 1) + '. ' + whoOf(p, turn) + ' — ' + p.k[ki].l + (p.k[ki].w ? ' 🎉' : '')); });
    var left = p.total - rec.r.length;
    if (left > 0) lines.push(fmt(R.textLeftover, { n: left }));
    return lines.join('\n');
  }

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function clearSharedHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function setShared(on) {
    shared = on;
    if (window.setRetry) window.setRetry(on ? { label: R.makeOwn, action: makeOwn } : { label: R.again, action: again });
  }
  function again() {
    if (shared) { makeOwn(); return; }
    if (!last) { show('setup'); phase = 'setup'; return; }
    startSession(last.p);
  }
  function makeOwn() {
    var p = last && last.p;
    clearSharedHash();
    setShared(false);
    if (p) fillForm('custom', p);
    last = null;
    phase = 'setup';
    show('setup');
  }
  function editSetup() {
    if (shared) { makeOwn(); return; }
    phase = 'setup';
    show('setup');
  }
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) {
      clearSharedHash();
      els.error.textContent = E.badLink;
      els.error.hidden = false;
      return false;
    }
    clearTimers();
    last = rec;
    session = null;
    phase = 'end';
    setShared(true);
    renderEnd(rec);
    show('end');
    return true;
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
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function shareUrl(rec) { return baseUrl() + '#d=' + CORE.encodeShare(rec); }

  if (window.setShareData) {
    window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  }
  setShared(false);

  // ---------------------------------------------------------------- 이벤트
  els.countDec.addEventListener('click', function () { stepCount(-1); });
  els.countInc.addEventListener('click', function () { stepCount(1); });
  els.count.addEventListener('input', function () { clearError(); updatePreview(); });
  els.winDec.addEventListener('click', function () { stepWinners(-1); });
  els.winInc.addEventListener('click', function () { stepWinners(1); });
  els.winners.addEventListener('input', function () { clearError(); updatePreview(); });
  els.namesBtn.addEventListener('click', function () { setNamesOpen(els.namesBox.hidden); if (!els.namesBox.hidden) focusSoft(els.names); });
  var namesTimer = null;
  els.names.addEventListener('input', function () { clearError(); clearTimeout(namesTimer); namesTimer = setTimeout(syncNames, 150); });
  els.modeSimple.addEventListener('click', function () { clearError(); setMode('simple'); });
  els.modeCustom.addEventListener('click', function () { clearError(); setMode('custom'); });
  els.kindAdd.addEventListener('click', function () {
    if (kinds.length >= CORE.MAX_KINDS) return;
    var bi = blankIndex();
    var row = { l: '', n: 1, w: true };
    if (bi >= 0) kinds.splice(bi, 0, row); else kinds.push(row);
    clearError();
    renderKinds();
    var inputs = els.kinds.querySelectorAll('.lt-kind-label');
    focusSoft(inputs[bi >= 0 ? bi : inputs.length - 1]);
  });
  els.fillBlank.addEventListener('click', function () { fillBlank(); clearError(); renderKinds(); });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); begin(); });
  els.form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') e.preventDefault();
  });
  els.start.addEventListener('click', begin);
  els.recentClear.addEventListener('click', function () { history = []; saveHistory(); renderHistory(); });
  els.grid.addEventListener('click', onSlip);
  els.next.addEventListener('click', onNext);
  els.ready.addEventListener('click', onReady);
  els.finish.addEventListener('click', onFinish);
  els.copy.addEventListener('click', function () { if (last) copyText(resultText(last), R.copied); });
  els.link.addEventListener('click', function () { if (last) copyText(shareUrl(last), R.linkCopied); });
  els.edit.addEventListener('click', editSetup);
  window.addEventListener('hashchange', function () { if (phase === 'setup' || phase === 'end') loadShared(); });

  window.LOTS_APP = {
    phase: function () { return phase; },
    shared: function () { return shared; },
    deck: function () { return session ? session.deck.slice() : null; },
    taken: function () { return session ? session.taken.slice() : null; },
    last: function () { return last ? JSON.parse(JSON.stringify(last)) : null; },
    text: function () { return last ? resultText(last) : ''; },
    link: function () { return last ? shareUrl(last) : ''; },
    history: function () { return JSON.parse(JSON.stringify(history)); },
    state: function () { return { mode: mode, kinds: JSON.parse(JSON.stringify(kinds)), count: slipCount(), names: namesList() }; }
  };

  renderHistory();
  setMode('simple');
  syncNames();
  loadShared();
})();
