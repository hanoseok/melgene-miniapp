/* apps/raffle/raffle.js — 경품 추첨기: 준비(참가자·경품·순서·한 번만 당첨) → 추첨(한 명씩 이름 셔플 공개·남은 인원 한꺼번에·되돌리기·발표 모드) → 결과(상별 당첨자·텍스트 복사·공유 링크 #r= + 공통 끝 화면)
 * 로직은 raffle-core.js(RAFFLE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 뽑기: 누를 때마다 그 순간 crypto 로 한 명을 정한다(미리 섞지 않음). 이름 셔플 연출(약 1.7초)은 값을 정한 뒤 보여 주기만 하고, 건너뛰기·움직임 줄이기면 바로 공개.
 * 광고: 준비 화면 맨 아래 .mg-ad-start 한 자리(준비 화면이 숨으면 같이 숨음). 추첨 화면(발표·TV)에는 광고 없음. 결과 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 한 추첨의 첫 당첨자를 뽑을 때 track('start') 한 번, 모든 상을 다 뽑았거나 결과 화면을 열 때 track('done') 한 번(raffle.done). 다시 뽑기면 다시 한 번씩.
 * 저장: localStorage raffle_state(try/catch) = 입력 초안(참가자·경품·순서·옵션) + 진행 중 추첨. 새로 고침해도 이어진다. 서버로 보내지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.RAFFLE_APP
 */
(function () {
  'use strict';

  var CORE = window.RAFFLE_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var ER = I.errors || {};
  var EN = I.end || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'raffle_state';
  var SPIN_MS = 1700;
  var SPIN_REST_MS = 1100;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), draw: $('screen-draw'), end: $('screen-end'),
    names: $('names'), namesBox: $('names-box'), numBox: $('numbers-box'), num: $('num-n'), stat: $('names-stat'), dup: $('dup-warn'),
    sample: $('sample-btn'), clear: $('clear-btn'), prizes: $('prize-list'), addPrize: $('add-prize'), slotsInfo: $('slots-info'),
    unique: $('unique'), error: $('error'), start: $('start-btn'),
    prog: $('prog'), present: $('present-btn'), finish: $('finish-btn'),
    stage: $('stage'), prizeNow: $('prize-now'), prizeSub: $('prize-sub'), slot: $('slot'), slotName: $('slot-name'), slotMulti: $('slot-multi'),
    ready: $('ready'), confetti: $('confetti'), drawBtn: $('draw-btn'), skip: $('skip-btn'), rest: $('rest-btn'), undo: $('undo-btn'),
    left: $('left-info'), board: $('board'), boardWrap: $('board-wrap'), newBtn: $('new-btn'), live: $('live'),
    endKicker: $('end-kicker'), results: $('results'), endNone: $('end-none'), copy: $('copy-btn'), own: $('own-btn'), edit: $('edit-btn'), year: $('year')
  };
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('.rf-mode'));
  var orderBtns = Array.prototype.slice.call(document.querySelectorAll('.rf-order'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var draft = { mode: 'names', text: '', N: 100, prizes: (U.defaultPrizes || []).map(function (p) { return { n: p.n, c: p.c }; }), order: 'up', unique: true };
  var raffle = null;        // CORE.newRaffle
  var lastCfg = null;       // 다시 뽑기용 설정
  var view = null;          // 결과 화면: { mode, groups, shared, code }
  var rolling = false;
  var spinTimer = 0;
  var pending = null;       // 연출 중인 당첨 [win…]
  var saveTimer = 0;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function ask(msg) { try { return window.confirm(msg); } catch (e) { return true; } }
  function toast(m) { if (window.toast) window.toast(m); }
  function rnd(n) { return CORE.uniformInt(n, CORE.cryptoU32); }
  function autoName(i) { return fmt(U.prizeAuto, { n: i }); }
  function label(mode, x) { return mode === 'numbers' ? fmt(U.numFmt, { n: x }) : String(x); }
  function nameOf(e) { return label(raffle.mode, CORE.labelOf(raffle, e)); }
  function el(tag, cls, text) { var x = document.createElement(tag); if (cls) x.className = cls; if (text != null) x.textContent = text; return x; }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function load() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (!o || typeof o !== 'object') return null;
      var d = o.draft || {};
      if (CORE.MODES.indexOf(d.mode) >= 0) draft.mode = d.mode;
      if (typeof d.text === 'string') draft.text = d.text.slice(0, 60000);
      if (Number(d.N) >= CORE.NUM_MIN && Number(d.N) <= CORE.NUM_MAX) draft.N = Math.floor(Number(d.N));
      if (Array.isArray(d.prizes) && d.prizes.length) draft.prizes = CORE.cleanPrizes(d.prizes, autoName);
      if (CORE.ORDERS.indexOf(d.order) >= 0) draft.order = d.order;
      draft.unique = d.unique !== false;
      return CORE.sanitize(o.raffle);
    } catch (e) { return null; }
  }
  function save() {
    clearTimeout(saveTimer);
    var o = { draft: draft, raffle: raffle && !raffle.ended ? raffle : null };
    try { window.localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) { /* noop */ }
  }
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }

  // ---------------------------------------------------------------- 준비 화면
  function show(screen) {
    els.setup.hidden = screen !== 'setup';
    els.draw.hidden = screen !== 'draw';
    els.end.hidden = screen !== 'end';
    if (screen !== 'draw') setPresent(false);
  }
  function setMode(m) {
    draft.mode = CORE.MODES.indexOf(m) >= 0 ? m : 'names';
    modeBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-mode') === draft.mode)); });
    els.namesBox.hidden = draft.mode !== 'names';
    els.numBox.hidden = draft.mode !== 'numbers';
    refreshSetup();
  }
  function setOrder(o) {
    draft.order = CORE.ORDERS.indexOf(o) >= 0 ? o : 'up';
    orderBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-order') === draft.order)); });
  }
  function parsed() { return CORE.parseEntries(els.names.value); }
  function refreshSetup() {
    var p = parsed();
    if (draft.mode === 'names') {
      els.stat.textContent = p.weighted ? fmt(U.statTickets, { n: p.entries.length, t: p.tickets }) : fmt(U.statPeople, { n: p.entries.length });
      var warn = [];
      if (p.dups.length) warn.push(fmt(U.dupWarn, { list: p.dups.slice(0, 5).map(function (d) { return d.name + ' ×' + d.count; }).join(', ') + (p.dups.length > 5 ? ' …' : '') }));
      if (p.dropped) warn.push(fmt(U.droppedWarn, { max: CORE.MAX_ENTRIES }));
      els.dup.textContent = warn.join(' ');
      els.dup.hidden = !warn.length;
    }
    var n = CORE.slotCount(CORE.cleanPrizes(readPrizes(), autoName));
    els.slotsInfo.textContent = fmt(U.slotsInfo, { n: n });
  }
  function readPrizes() {
    return Array.prototype.map.call(els.prizes.querySelectorAll('.rf-prize'), function (row) {
      return { n: row.querySelector('.rf-prize-name').value, c: Number(row.querySelector('.rf-prize-count').textContent) || 1 };
    });
  }
  function syncPrizes() { draft.prizes = readPrizes().map(function (p) { return { n: p.n.slice(0, CORE.PRIZE_LEN), c: p.c }; }); refreshSetup(); saveSoon(); }
  function prizeRow(p, i) {
    var li = el('li', 'rf-prize');
    var rank = el('span', 'rf-prize-rank', String(i + 1));
    rank.setAttribute('aria-hidden', 'true');
    var inp = el('input', 'rf-prize-name');
    inp.type = 'text';
    inp.value = p.n;
    inp.maxLength = CORE.PRIZE_LEN;
    inp.setAttribute('aria-label', U.prizeName + ' ' + (i + 1));
    inp.setAttribute('enterkeyhint', 'done');
    inp.addEventListener('input', syncPrizes);
    var step = el('div', 'rf-step');
    var minus = el('button', 'rf-step-btn', '−');
    minus.type = 'button';
    minus.setAttribute('aria-label', U.minus);
    var cnt = el('span', 'rf-prize-count', String(p.c));
    cnt.setAttribute('aria-label', U.prizeCount);
    cnt.setAttribute('aria-live', 'polite');
    var plus = el('button', 'rf-step-btn', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', U.plus);
    function bump(d) {
      var v = Math.max(1, Math.min(CORE.MAX_PRIZE_COUNT, (Number(cnt.textContent) || 1) + d));
      cnt.textContent = String(v);
      minus.disabled = v <= 1;
      plus.disabled = v >= CORE.MAX_PRIZE_COUNT;
      syncPrizes();
    }
    minus.disabled = p.c <= 1;
    minus.addEventListener('click', function () { bump(-1); });
    plus.addEventListener('click', function () { bump(1); });
    step.appendChild(minus); step.appendChild(cnt); step.appendChild(plus);
    var rm = el('button', 'rf-prize-rm', '×');
    rm.type = 'button';
    rm.setAttribute('aria-label', U.remove);
    rm.addEventListener('click', function () {
      if (els.prizes.children.length <= 1) return;
      li.parentNode.removeChild(li);
      syncPrizes();
      renderPrizes();
    });
    li.appendChild(rank); li.appendChild(inp); li.appendChild(step); li.appendChild(rm);
    return li;
  }
  function renderPrizes() {
    clear(els.prizes);
    draft.prizes.forEach(function (p, i) { els.prizes.appendChild(prizeRow(p, i)); });
    var one = draft.prizes.length <= 1;
    Array.prototype.forEach.call(els.prizes.querySelectorAll('.rf-prize-rm'), function (b) { b.disabled = one; });
    els.addPrize.disabled = draft.prizes.length >= CORE.MAX_PRIZES;
    refreshSetup();
  }
  function addPrize() {
    if (draft.prizes.length >= CORE.MAX_PRIZES) return;
    draft.prizes = readPrizes();
    draft.prizes.push({ n: autoName(draft.prizes.length + 1), c: 1 });
    renderPrizes();
    saveSoon();
    var last = els.prizes.lastElementChild && els.prizes.lastElementChild.querySelector('.rf-prize-name');
    if (last) { try { last.focus({ preventScroll: true }); last.select(); } catch (e) { /* noop */ } }
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(v) {
    var msg = fmt(ER[v.error] || ER.noEntries, { min: v.error === 'numRange' ? CORE.NUM_MIN : CORE.MIN_ENTRIES, max: v.error === 'numRange' ? CORE.NUM_MAX : CORE.MAX_SLOTS, n: v.need, need: v.need, have: v.have, prize: v.n });
    els.error.textContent = msg;
    els.error.hidden = false;
    scrollTo(els.error, 'center');
  }
  function config() {
    var prizes = CORE.cleanPrizes(readPrizes(), autoName);
    var cfg = { mode: draft.mode, prizes: prizes, order: draft.order, unique: els.unique.checked };
    if (draft.mode === 'numbers') cfg.N = els.num.value === '' ? NaN : Number(els.num.value);
    else cfg.entries = parsed().entries;
    return cfg;
  }
  function startFromForm() {
    var cfg = config();
    var v = CORE.validate(cfg);
    if (!v.ok) { showError(v); return; }
    clearError();
    draft.prizes = cfg.prizes;
    renderPrizes();
    begin(cfg);
  }
  function cfgOf(r) {
    return { mode: r.mode, entries: r.entries, N: r.N, prizes: r.prizes.map(function (p) { return { n: p.n, c: p.c }; }), order: r.order, unique: r.unique };
  }
  function begin(cfg) {
    var r = CORE.newRaffle(cfg);
    if (!r) return;
    raffle = r;
    lastCfg = cfgOf(r);
    view = null;
    save();
    show('draw');
    renderDraw();
    scrollTo(els.draw, 'start');
  }

  // ---------------------------------------------------------------- 추첨 화면
  function lastBatch() {
    var w = raffle.wins;
    if (!w.length) return [];
    var b = w[w.length - 1].b;
    return w.filter(function (x) { return x.b === b; });
  }
  function setSlot(names, pop) {
    clear(els.slotMulti);
    if (names.length > 1) {
      els.slotName.hidden = true;
      els.slotMulti.hidden = false;
      names.forEach(function (n) { els.slotMulti.appendChild(el('li', 'rf-slot-chip', n)); });
    } else {
      els.slotMulti.hidden = true;
      els.slotName.hidden = false;
      els.slotName.textContent = names.length ? names[0] : '?';
      els.slotName.classList.toggle('is-long', names.length && Array.from(names[0]).length > 12);
    }
    els.slot.classList.toggle('is-empty', !names.length);
    els.slot.classList.remove('is-pop');
    if (pop) { void els.slot.offsetWidth; els.slot.classList.add('is-pop'); }
  }
  function renderDraw() {
    if (!raffle) return;
    var tot = CORE.total(raffle);
    var n = raffle.wins.length;
    var done = CORE.isComplete(raffle);
    var cur = CORE.currentPrize(raffle);
    var lb = lastBatch();
    // 무대 제목: 셔플 중이면 그 상, 방금 공개했으면 공개한 상, 처음이면 첫 상
    var shownP = rolling && pending ? pending[0].p : n ? lb[0].p : cur;
    els.prog.textContent = fmt(U.progress, { n: n, m: tot });
    els.prizeNow.textContent = raffle.prizes[shownP].n;
    if (done && !rolling) els.prizeSub.textContent = U.allDrawn;
    else {
      var k = rolling && pending ? CORE.wonIn(raffle, shownP) - pending.length + 1 : n ? CORE.wonIn(raffle, shownP) : 1;
      els.prizeSub.textContent = fmt(U.prizeOf, { k: k, c: raffle.prizes[shownP].c });
    }
    els.stage.classList.toggle('is-grand', shownP === 0);
    if (!rolling) setSlot(lb.map(function (w) { return nameOf(w.e); }), false);
    els.ready.hidden = n > 0 || rolling;
    els.drawBtn.textContent = rolling ? U.drawing : done ? U.allDone : n ? U.draw : U.drawFirst;
    els.drawBtn.disabled = rolling;
    els.drawBtn.classList.toggle('is-finish', done);
    els.skip.hidden = !rolling;
    var left = cur >= 0 ? CORE.leftIn(raffle, cur) : 0;
    els.rest.hidden = done || left < 2;
    els.rest.disabled = rolling;
    els.rest.textContent = fmt(U.rest, { k: left });
    els.undo.disabled = rolling || !n;
    var leftTxt = fmt(U.leftInfo, { n: CORE.eligible(raffle).length });
    els.left.textContent = done ? '' : n && !rolling ? fmt(U.nextUp, { prize: raffle.prizes[cur].n }) + ' · ' + leftTxt : leftTxt;
    els.left.hidden = done;
    renderBoard();
  }
  function renderBoard() {
    clear(els.board);
    var hide = rolling && pending ? pending.length : 0;
    var wins = raffle.wins.slice(0, raffle.wins.length - hide);
    var lastB = wins.length ? wins[wins.length - 1].b : -1;
    var any = false;
    raffle.prizes.forEach(function (pr, i) {
      var mine = wins.filter(function (w) { return w.p === i; });
      if (!mine.length) return;
      any = true;
      var box = el('div', 'rf-group');
      var h = el('h3', 'rf-group-h');
      h.appendChild(el('span', 'rf-group-name', pr.n));
      h.appendChild(el('span', 'rf-group-count', mine.length + ' / ' + pr.c));
      box.appendChild(h);
      var ol = el('ol', 'rf-group-list');
      mine.forEach(function (w) { ol.appendChild(el('li', 'rf-winner' + (w.b === lastB ? ' is-new' : ''), nameOf(w.e))); });
      box.appendChild(ol);
      els.board.appendChild(box);
    });
    els.boardWrap.hidden = !any;
  }

  function drawOne() {
    if (rolling || !raffle || raffle.ended) return;
    if (CORE.isComplete(raffle)) { finish(); return; }
    var first = !raffle.t0;
    var w = CORE.draw(raffle);
    if (!w) return;
    if (first) track('start');
    save();
    play([w], SPIN_MS);
  }
  function drawRestNow() {
    if (rolling || !raffle || raffle.ended || CORE.isComplete(raffle)) return;
    var first = !raffle.t0;
    var ws = CORE.drawRest(raffle);
    if (!ws.length) return;
    if (first) track('start');
    save();
    play(ws, SPIN_REST_MS);
  }
  // 연출: 이미 정한 당첨자를 이름 셔플 뒤에 공개(점점 느려짐). 건너뛰기 = 바로 공개
  function play(ws, ms) {
    pending = ws;
    if (REDUCED) { reveal(); return; }
    rolling = true;
    renderDraw();
    els.slotMulti.hidden = true;
    els.slotName.hidden = false;
    els.slot.classList.add('is-rolling');
    els.slot.classList.remove('is-empty', 'is-pop');
    var t0 = Date.now();
    var gap = 55;
    (function spin() {
      var t = Date.now() - t0;
      if (t >= ms) { reveal(); return; }
      var id = CORE.teaseId(raffle);
      var s = id < 0 ? '?' : nameOf(id);
      els.slotName.textContent = s;
      els.slotName.classList.toggle('is-long', Array.from(s).length > 12);
      gap = 55 + Math.round(230 * Math.pow(t / ms, 2));
      spinTimer = setTimeout(spin, gap);
    })();
  }
  function reveal() {
    if (!pending) return;
    clearTimeout(spinTimer);
    var ws = pending;
    pending = null;
    rolling = false;
    els.slot.classList.remove('is-rolling');
    renderDraw();
    setSlot(ws.map(function (w) { return nameOf(w.e); }), !REDUCED);
    if (!REDUCED) burst(ws[0].p === 0 ? 34 : 18);
    els.live.textContent = fmt(U.liveWin, { prize: raffle.prizes[ws[0].p].n, name: ws.map(function (w) { return nameOf(w.e); }).join(', ') });
    if (CORE.isComplete(raffle)) { markDone(); save(); renderDraw(); }
  }
  function burst(n) {
    var colors = ['#ffcf4d', '#ff6b6b', '#ffffff', '#6fd3a6', '#ff9ec7'];
    clear(els.confetti);
    for (var i = 0; i < n; i++) {
      var s = el('span', 'rf-bit');
      s.style.left = (5 + rnd(90)) + '%';
      s.style.background = colors[rnd(colors.length)];
      s.style.animationDelay = (rnd(250)) + 'ms';
      s.style.setProperty('--dx', (rnd(120) - 60) + 'px');
      s.style.setProperty('--rot', (rnd(720) - 360) + 'deg');
      els.confetti.appendChild(s);
    }
    setTimeout(function () { clear(els.confetti); }, 2200);
  }
  function undoLast() {
    if (rolling || !raffle) return;
    var out = CORE.undo(raffle);
    if (!out.length) return;
    save();
    renderDraw();
    els.live.textContent = fmt(U.liveUndo, { name: out.map(function (w) { return nameOf(w.e); }).join(', ') });
  }
  function markDone() {
    if (!raffle || raffle.done || !raffle.t0) return;
    raffle.done = true;
    track('done');
  }
  function finish() {
    if (!raffle || rolling) return;
    if (raffle.wins.length && !CORE.isComplete(raffle) && !ask(U.finishConfirm)) return;
    CORE.end(raffle);
    markDone();
    lastCfg = cfgOf(raffle);
    var code = CORE.encodeResult(raffle);
    view = { mode: raffle.mode, groups: CORE.grouped(raffle).filter(function (g) { return g.winners.length; }), shared: false, code: code };
    save();
    showResults();
  }
  function newRaffleAsk() {
    if (rolling) return;
    if (raffle && raffle.wins.length && !ask(U.newConfirm)) return;
    raffle = null;
    save();
    show('setup');
    refreshSetup();
    scrollTo(els.setup, 'start');
  }

  // ---------------------------------------------------------------- 결과 화면
  function showResults() {
    clear(els.results);
    var groups = view ? view.groups : [];
    groups.forEach(function (g) {
      var box = el('section', 'rf-res');
      var h = el('h3', 'rf-res-h');
      h.appendChild(el('span', 'rf-res-name', g.n));
      h.appendChild(el('span', 'rf-res-count', String(g.winners.length)));
      box.appendChild(h);
      var ol = el('ol', 'rf-res-list');
      g.winners.forEach(function (x) { ol.appendChild(el('li', 'rf-res-item', label(view.mode, x))); });
      box.appendChild(ol);
      els.results.appendChild(box);
    });
    var none = !groups.length;
    els.results.hidden = none;
    els.endNone.hidden = !none;
    els.copy.hidden = none;
    els.endKicker.textContent = view && view.shared ? EN.sharedKicker : EN.kicker;
    els.own.hidden = !(view && view.shared);
    els.edit.hidden = !!(view && view.shared);
    if (window.setRetry) window.setRetry(view && view.shared ? { label: EN.own, action: makeOwn } : { label: EN.again, action: playAgain });
    if (view && view.code && !view.shared) setHash(view.code);
    show('end');
    scrollTo(els.end, 'start');
  }
  function resultText() {
    if (!view || !view.groups.length) return '';
    var blocks = view.groups.map(function (g) {
      return [g.n + ' (' + g.winners.length + ')'].concat(g.winners.map(function (x) { return '- ' + label(view.mode, x); })).join('\n');
    });
    return EN.textTitle + '\n\n' + blocks.join('\n\n') + '\n\n' + shareUrl();
  }
  function copyText(text) {
    var done = function () { toast(U.copied); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  function playAgain() {
    if (lastCfg) { clearHash(); begin(lastCfg); return; }
    makeOwn();
  }
  function makeOwn() {
    view = null;
    clearHash();
    show('setup');
    refreshSetup();
    scrollTo(els.setup, 'start');
  }
  function edit() {
    view = null;
    raffle = null;
    clearHash();
    save();
    show('setup');
    refreshSetup();
    scrollTo(els.setup, 'start');
  }

  // ---------------------------------------------------------------- 발표 모드(크게, 전체 화면 지원하면 함께)
  var FS_OK = !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
  function isPresent() { return document.body.classList.contains('rf-present'); }
  function setPresent(on) {
    document.body.classList.toggle('rf-present', !!on);
    els.present.setAttribute('aria-pressed', String(!!on));
    els.present.setAttribute('aria-label', on ? U.exitPresent : U.present);
    els.present.title = on ? U.exitPresent : U.present;
    try {
      if (on && FS_OK && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(function () { /* noop */ });
      if (!on && document.fullscreenElement) document.exitFullscreen();
    } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function shareUrl() { return baseUrl() + (view && view.code ? '#r=' + view.code : ''); }
  function setHash(code) {
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search + '#r=' + code); } catch (e) { /* noop */ }
  }
  function clearHash() {
    if (!/^#r=/.test(window.location.hash)) return;
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
  }
  if (window.setShareData) {
    window.setShareData(function () { return { title: EN.shareTitle, text: view && view.code ? EN.shareText : EN.shareTextEmpty, url: shareUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: EN.again, action: playAgain });

  // ---------------------------------------------------------------- 이벤트
  modeBtns.forEach(function (b) { b.addEventListener('click', function () { clearError(); setMode(b.getAttribute('data-mode')); saveSoon(); }); });
  orderBtns.forEach(function (b) { b.addEventListener('click', function () { setOrder(b.getAttribute('data-order')); saveSoon(); }); });
  els.names.addEventListener('input', function () { clearError(); draft.text = els.names.value; refreshSetup(); saveSoon(); });
  els.num.addEventListener('input', function () { clearError(); var v = Number(els.num.value); if (v >= CORE.NUM_MIN && v <= CORE.NUM_MAX) draft.N = Math.floor(v); saveSoon(); });
  els.num.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); startFromForm(); } });
  els.unique.addEventListener('change', function () { clearError(); draft.unique = els.unique.checked; saveSoon(); });
  els.sample.addEventListener('click', function () { els.names.value = (U.sampleNames || []).join('\n'); draft.text = els.names.value; clearError(); refreshSetup(); save(); });
  els.clear.addEventListener('click', function () { els.names.value = ''; draft.text = ''; refreshSetup(); save(); try { els.names.focus(); } catch (e) { /* noop */ } });
  els.addPrize.addEventListener('click', addPrize);
  els.start.addEventListener('click', startFromForm);
  els.drawBtn.addEventListener('click', drawOne);
  els.rest.addEventListener('click', drawRestNow);
  els.skip.addEventListener('click', reveal);
  els.stage.addEventListener('click', function () { if (rolling) reveal(); });
  els.undo.addEventListener('click', undoLast);
  els.finish.addEventListener('click', finish);
  els.newBtn.addEventListener('click', newRaffleAsk);
  els.present.addEventListener('click', function () { setPresent(!isPresent()); });
  els.copy.addEventListener('click', function () { var t = resultText(); if (t) copyText(t); });
  els.own.addEventListener('click', makeOwn);
  els.edit.addEventListener('click', edit);
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && isPresent()) setPresent(false); });
  // 발표용 리모컨·키보드: 추첨 화면에서 Space·Enter·→·PageDown = 뽑기(연출 중이면 건너뛰기), Esc = 발표 모드 끄기
  document.addEventListener('keydown', function (e) {
    if (els.draw.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape' && isPresent()) { setPresent(false); return; }
    var t = e.target && e.target.tagName;
    if (t === 'BUTTON' || t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA' || t === 'A') return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); if (rolling) reveal(); else drawOne(); }
  });

  window.RAFFLE_APP = {
    screen: function () { return !els.draw.hidden ? 'draw' : !els.end.hidden ? 'end' : 'setup'; },
    raffle: function () { return raffle ? JSON.parse(JSON.stringify(raffle)) : null; },
    view: function () { return view ? JSON.parse(JSON.stringify(view)) : null; },
    rolling: function () { return rolling; },
    text: resultText,
    shareUrl: shareUrl
  };

  // ---------------------------------------------------------------- 처음: 공유 링크(#r=) → 결과, 진행 중 추첨 → 추첨 화면, 아니면 준비 화면
  var saved = load();
  els.names.value = draft.text;
  els.num.value = String(draft.N);
  els.unique.checked = draft.unique;
  setOrder(draft.order);
  renderPrizes();
  setMode(draft.mode);
  function openShared() {
    var h = window.location.hash || '';
    if (!/^#r=/.test(h)) return false;
    var res = CORE.decodeResult(h.slice(3));
    if (res) {
      view = { mode: res.mode, groups: res.groups, shared: true, code: h.slice(3) };
      showResults();
      return true;
    }
    clearHash();
    setTimeout(function () { toast(U.badShare); }, 400);
    return false;
  }
  window.addEventListener('hashchange', function () { if (!rolling && /^#r=/.test(window.location.hash) && !(view && view.code === window.location.hash.slice(3))) openShared(); });
  if (!openShared() && saved && !saved.ended) {
    raffle = saved;
    show('draw');
    renderDraw();
  }
})();
