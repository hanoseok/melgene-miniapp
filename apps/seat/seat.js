/* apps/seat/seat.js — 한 화면 자리 바꾸기: 이름 → 교실(줄·칸·자리 지도: 빈자리/고정 자리) → 규칙(떨어뜨리기·앞자리) → 섞기 → 자리가 하나씩 뒤집히며 공개 → 자리표 (+ 공통 끝 화면)
 * 로직은 seat-core.js(SEAT_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 배치는 먼저 crypto 로 정하고, 뒤집기 연출은 그 결과를 보여 주기만 한다(건너뛰기 가능). 움직임 줄이기(prefers-reduced-motion)면 바로 결과.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(결과·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 섞기를 누를 때 track('start') 한 번, 자리가 다 공개될 때 track('done') 한 번(다시 섞을 때마다 또). 공유 링크로 본 자리표는 세지 않는다.
 * 저장: 마지막 이름·교실·규칙만 이 기기 localStorage(mg_seat_last_v1, try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): 이름 + 교실 + 배치. 받은 사람은 다시 섞지 않고 그 자리표를 "공유된 자리표"로 본다. 다시 하기 = "나도 만들기".
 * 디버그/검사용 읽기 전용 핸들: window.SEAT_APP
 */
(function () {
  'use strict';

  var CORE = window.SEAT_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_seat_last_v1';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('st-form'), names: $('names'), sample: $('sample-btn'), clear: $('clear-btn'), namesCount: $('names-count'), seatsCount: $('seats-count'), warn: $('names-warn'),
    rows: $('rows'), rowsDec: $('rows-dec'), rowsInc: $('rows-inc'), cols: $('cols'), colsDec: $('cols-dec'), colsInc: $('cols-inc'),
    modeBlock: $('mode-block'), modePin: $('mode-pin'), pinPick: $('pin-pick'), pinName: $('pin-name'), map: $('map'),
    more: $('more'), moreBtn: $('more-btn'), apartA: $('apart-a'), apartB: $('apart-b'), apartAdd: $('apart-add'), apartList: $('apart-list'),
    frontName: $('front-name'), frontAdd: $('front-add'), frontList: $('front-list'), pinList: $('pin-list'),
    error: $('error'), shuffle: $('shuffle-btn'),
    result: $('result'), card: $('result-card'), badge: $('shared-badge'), note: $('shared-note'), viewStudent: $('view-student'), viewTeacher: $('view-teacher'),
    skip: $('skip-btn'), board: $('board'), live: $('live'), actions: $('actions'), copy: $('copy-btn'), png: $('png-btn'), link: $('link-btn'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  // ---------------------------------------------------------------- 상태
  var st = { rows: CORE.DEFAULTS.rows, cols: CORE.DEFAULTS.cols, blocked: {}, pins: {}, apart: [], front: [], mode: 'block' };
  var parsed = { names: [], numbered: false, dropped: 0 };
  var view = 'student';
  var last = null;       // { rows, cols, blocked, names, seats, t }
  var shared = false;
  var busy = false;
  var doneSent = true;
  var timers = [];
  var saveTimer = null;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); }); timers = []; }
  function toast(msg) { if (window.toast) window.toast(msg); }
  function dateText(ms) {
    try { return new Intl.DateTimeFormat(I.lang || 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms)); } catch (e) { return new Date(ms).toLocaleString(); }
  }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  function blockedList() { return Object.keys(st.blocked).map(Number).sort(function (a, b) { return a - b; }); }
  function rcText(s) { return { r: CORE.rowOf(s, st.cols) + 1, c: CORE.colOf(s, st.cols) + 1 }; }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      var data = { text: els.names.value, rows: st.rows, cols: st.cols, blocked: blockedList(), pins: st.pins, apart: st.apart, front: st.front };
      try { window.localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) { /* noop */ }
    }, 250);
  }
  function load() {
    var d = null;
    try { d = JSON.parse(window.localStorage.getItem(STORE) || 'null'); } catch (e) { d = null; }
    if (!d || typeof d !== 'object') return;
    if (typeof d.text === 'string') els.names.value = d.text.slice(0, 5000);
    st.rows = CORE.clampSide(d.rows, CORE.MAX_ROWS);
    st.cols = CORE.clampSide(d.cols, CORE.MAX_COLS);
    st.blocked = {};
    CORE.cleanBlocked(d.blocked, st.rows * st.cols).forEach(function (s) { st.blocked[s] = 1; });
    st.pins = {};
    if (d.pins && typeof d.pins === 'object') Object.keys(d.pins).forEach(function (n) { var s = d.pins[n]; if (Number.isInteger(s) && s >= 0 && s < st.rows * st.cols && !st.blocked[s]) st.pins[n] = s; });
    st.apart = Array.isArray(d.apart) ? d.apart.filter(function (p) { return Array.isArray(p) && typeof p[0] === 'string' && typeof p[1] === 'string'; }).slice(0, CORE.MAX_PAIRS) : [];
    st.front = Array.isArray(d.front) ? d.front.filter(function (n) { return typeof n === 'string'; }) : [];
  }

  // ---------------------------------------------------------------- 이름
  function hasName(n) { return parsed.names.indexOf(n) >= 0; }
  function fillSelect(sel, keep) {
    var cur = keep ? sel.value : '';
    while (sel.options.length > 1) sel.remove(1);
    parsed.names.forEach(function (n) { var o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
    sel.value = cur && hasName(cur) ? cur : '';
  }
  function refreshNames() {
    parsed = CORE.parseNames(els.names.value);
    // 없어진 이름이 걸린 규칙은 지운다
    Object.keys(st.pins).forEach(function (n) { if (!hasName(n)) delete st.pins[n]; });
    st.apart = st.apart.filter(function (p) { return hasName(p[0]) && hasName(p[1]); });
    st.front = st.front.filter(hasName);
    [els.pinName, els.apartA, els.apartB, els.frontName].forEach(function (s) { fillSelect(s, true); });
    els.warn.hidden = !parsed.dropped;
    els.warn.textContent = parsed.dropped ? fmt(U.tooMany, { max: CORE.MAX_NAMES }) : '';
    renderCounts();
    renderRules();
    renderMap();
  }
  function renderCounts() {
    els.namesCount.textContent = fmt(U.namesCount, { n: parsed.names.length });
    var open = st.rows * st.cols - blockedList().length;
    els.seatsCount.textContent = fmt(U.seatsCount, { n: open });
    els.seatsCount.classList.toggle('is-short', parsed.names.length > open);
  }

  // ---------------------------------------------------------------- 자리 지도 (학생 쪽에서 본 모양: 교탁이 위)
  function pinAt(s) {
    var keys = Object.keys(st.pins);
    for (var i = 0; i < keys.length; i++) if (st.pins[keys[i]] === s) return keys[i];
    return null;
  }
  function renderMap() {
    var total = st.rows * st.cols;
    els.map.style.setProperty('--cols', String(st.cols));
    els.map.innerHTML = '';
    var frag = document.createDocumentFragment();
    var showFront = st.front.length > 0;
    for (var s = 0; s < total; s++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'st-mseat';
      b.setAttribute('data-s', String(s));
      var pin = pinAt(s);
      var rc = rcText(s);
      var label = fmt(U.seatAria, rc);
      if (st.blocked[s]) { b.classList.add('is-blocked'); label += ', ' + U.seatBlocked; }
      if (pin) { b.classList.add('is-pinned'); label += ', ' + pin; var sp = document.createElement('span'); sp.className = 'st-mseat-name'; sp.textContent = pin; b.appendChild(sp); }
      if (showFront && CORE.isFront(s, st.cols)) b.classList.add('is-front');
      b.setAttribute('aria-label', label);
      b.setAttribute('aria-pressed', String(st.mode === 'block' ? !!st.blocked[s] : !!pin));
      frag.appendChild(b);
    }
    els.map.appendChild(frag);
    renderCounts();
  }
  function onMapClick(s) {
    if (busy) return;
    clearError();
    var pin = pinAt(s);
    if (st.mode === 'block') {
      if (st.blocked[s]) delete st.blocked[s];
      else { st.blocked[s] = 1; if (pin) delete st.pins[pin]; }
    } else if (pin) {
      delete st.pins[pin];
    } else {
      var name = els.pinName.value;
      if (!name || !hasName(name)) { toast(U.pinFirst); try { els.pinName.focus({ preventScroll: true }); } catch (e) { /* noop */ } return; }
      st.pins[name] = s;
      delete st.blocked[s];
    }
    renderMap();
    renderRules();
    var btn = els.map.querySelector('[data-s="' + s + '"]');
    if (btn) try { btn.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    save();
  }
  function setSide(which, d) {
    if (busy) return;
    var max = which === 'rows' ? CORE.MAX_ROWS : CORE.MAX_COLS;
    var oldCols = st.cols;
    var next = Math.min(max, Math.max(CORE.MIN_SIDE, st[which] + d));
    if (next === st[which]) return;
    var nr = which === 'rows' ? next : st.rows;
    var nc = which === 'cols' ? next : st.cols;
    var nb = {};
    Object.keys(st.blocked).forEach(function (k) { var m = CORE.remapSeat(Number(k), oldCols, nr, nc); if (m != null) nb[m] = 1; });
    var np = {};
    Object.keys(st.pins).forEach(function (n) { var m = CORE.remapSeat(st.pins[n], oldCols, nr, nc); if (m != null) np[n] = m; });
    st.rows = nr; st.cols = nc; st.blocked = nb; st.pins = np;
    els.rows.textContent = String(st.rows);
    els.cols.textContent = String(st.cols);
    updateSteppers();
    clearError();
    renderMap();
    renderRules();
    save();
  }
  function updateSteppers() {
    els.rowsDec.disabled = st.rows <= CORE.MIN_SIDE; els.rowsInc.disabled = st.rows >= CORE.MAX_ROWS;
    els.colsDec.disabled = st.cols <= CORE.MIN_SIDE; els.colsInc.disabled = st.cols >= CORE.MAX_COLS;
  }
  function setMode(m) {
    st.mode = m;
    els.modeBlock.setAttribute('aria-checked', String(m === 'block'));
    els.modePin.setAttribute('aria-checked', String(m === 'pin'));
    els.pinPick.hidden = m !== 'pin';
    els.map.classList.toggle('is-pin-mode', m === 'pin');
    renderMap();
  }

  // ---------------------------------------------------------------- 규칙 목록
  function chip(text, onRemove, removeName) {
    var li = document.createElement('li');
    li.className = 'st-chip';
    var t = document.createElement('span');
    t.className = 'st-chip-text';
    t.textContent = text;
    var x = document.createElement('button');
    x.type = 'button';
    x.className = 'st-chip-x';
    x.textContent = '×';
    x.setAttribute('aria-label', fmt(U.remove, { name: removeName || text }));
    x.addEventListener('click', function () { if (busy) return; onRemove(); renderRules(); renderMap(); save(); });
    li.appendChild(t);
    li.appendChild(x);
    return li;
  }
  function emptyChip() {
    var li = document.createElement('li');
    li.className = 'st-chip-none';
    li.textContent = U.none;
    return li;
  }
  function renderRules() {
    els.apartList.innerHTML = '';
    st.apart.forEach(function (p, i) {
      els.apartList.appendChild(chip(p[0] + ' ↔ ' + p[1], function () { st.apart.splice(i, 1); }));
    });
    if (!st.apart.length) els.apartList.appendChild(emptyChip());
    els.frontList.innerHTML = '';
    st.front.forEach(function (n, i) { els.frontList.appendChild(chip(n, function () { st.front.splice(i, 1); })); });
    if (!st.front.length) els.frontList.appendChild(emptyChip());
    els.pinList.innerHTML = '';
    Object.keys(st.pins).forEach(function (n) {
      var rc = rcText(st.pins[n]);
      els.pinList.appendChild(chip(fmt(U.pinnedAt, { name: n, r: rc.r, c: rc.c }), function () { delete st.pins[n]; }, n));
    });
    if (!Object.keys(st.pins).length) els.pinList.appendChild(emptyChip());
  }
  function addApart() {
    var a = els.apartA.value, b = els.apartB.value;
    if (!a || !b) return;
    if (a === b) { toast(E.samePair); return; }
    clearError();
    var dup = st.apart.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); });
    if (!dup && st.apart.length < CORE.MAX_PAIRS) st.apart.push([a, b]);
    els.apartA.value = ''; els.apartB.value = '';
    renderRules(); save();
  }
  function addFront() {
    var n = els.frontName.value;
    if (!n) return;
    clearError();
    if (st.front.indexOf(n) < 0) st.front.push(n);
    els.frontName.value = '';
    renderRules(); renderMap(); save();
  }
  function setMore(open) {
    els.more.hidden = !open;
    els.moreBtn.setAttribute('aria-expanded', String(open));
  }

  // ---------------------------------------------------------------- 오류
  function clearError() { els.error.hidden = true; els.error.textContent = ''; els.names.removeAttribute('aria-invalid'); }
  function showError(v) {
    var vars = Object.assign({ max: CORE.MAX_NAMES }, v.vars || {});
    els.error.textContent = fmt(E[v.error] || E.impossible, vars);
    els.error.hidden = false;
    if (v.error === 'noNames' || v.error === 'tooMany') els.names.setAttribute('aria-invalid', 'true');
    smoothTo(els.error, 160);
  }

  // ---------------------------------------------------------------- 섞기
  function buildPlan() {
    var idx = {};
    parsed.names.forEach(function (n, i) { idx[n] = i; });
    var fixed = Object.keys(st.pins).filter(function (n) { return idx[n] != null; }).map(function (n) { return [idx[n], st.pins[n]]; });
    return {
      names: parsed.names, rows: st.rows, cols: st.cols, blocked: blockedList(), fixed: fixed,
      front: st.front.filter(function (n) { return idx[n] != null; }).map(function (n) { return idx[n]; }),
      apart: st.apart.filter(function (p) { return idx[p[0]] != null && idx[p[1]] != null; }).map(function (p) { return [idx[p[0]], idx[p[1]]]; })
    };
  }
  function lock(on) {
    busy = on;
    els.shuffle.disabled = on;
    els.shuffle.textContent = on ? U.shuffling : U.shuffle;
    els.shuffle.setAttribute('aria-busy', String(on));
    els.skip.hidden = !on;
    [els.copy, els.png, els.link].forEach(function (b) { b.disabled = on; });
  }
  function shuffleSeats() {
    if (busy) return;
    refreshNames();
    var v = CORE.validate(buildPlan());
    if (!v.ok) { showError(v); return; }
    var r = CORE.arrange(v.p);
    if (!r.ok) { showError(r); return; }
    clearError();
    var rec = { rows: v.p.rows, cols: v.p.cols, blocked: v.p.blocked, names: v.p.names.slice(), seats: r.seats, t: Date.now() };
    if (shared) { clearSharedHash(); setShared(false); }
    last = rec;
    track('start');
    doneSent = false;
    showResult(rec, true);
    later(function () { smoothTo(els.card, 70); }, 20);
  }
  function again() { if (!busy) shuffleSeats(); }

  // ---------------------------------------------------------------- 자리표
  function renderBoard(rec, hidden) {
    var order = CORE.displayOrder(rec.rows, rec.cols, view);
    var bset = {};
    rec.blocked.forEach(function (s) { bset[s] = 1; });
    els.board.innerHTML = '';
    els.board.className = 'st-board' + (view === 'teacher' ? ' is-teacher' : '');
    els.board.style.setProperty('--cols', String(rec.cols));
    var desk = document.createElement('div');
    desk.className = 'st-desk st-desk-board';
    desk.textContent = U.desk;
    var grid = document.createElement('div');
    grid.className = 'st-grid';
    grid.setAttribute('role', 'list');
    order.forEach(function (s) {
      var cell = document.createElement('div');
      cell.setAttribute('data-s', String(s));
      var k = rec.seats[s];
      if (bset[s]) {
        cell.className = 'st-seat is-aisle';
        cell.setAttribute('aria-hidden', 'true');
      } else {
        cell.className = 'st-seat' + (k < 0 ? ' is-empty' : '') + (hidden ? '' : ' is-on');
        cell.setAttribute('role', 'listitem');
        var rc = { r: CORE.rowOf(s, rec.cols) + 1, c: CORE.colOf(s, rec.cols) + 1 };
        cell.setAttribute('aria-label', fmt(U.seatAria, rc) + ': ' + (k >= 0 ? rec.names[k] : R.empty));
        var flip = document.createElement('span');
        flip.className = 'st-flip';
        var back = document.createElement('span');
        back.className = 'st-face st-back';
        back.setAttribute('aria-hidden', 'true');
        var front = document.createElement('span');
        front.className = 'st-face st-front';
        var nm = document.createElement('span');
        nm.className = 'st-name';
        nm.textContent = k >= 0 ? rec.names[k] : R.empty;
        front.appendChild(nm);
        flip.appendChild(back);
        flip.appendChild(front);
        cell.appendChild(flip);
      }
      grid.appendChild(cell);
    });
    if (view === 'teacher') { els.board.appendChild(grid); els.board.appendChild(desk); }
    else { els.board.appendChild(desk); els.board.appendChild(grid); }
    fitNames();
  }
  // 이름이 자리 카드 안에 들어갈 때까지 글자를 줄인다(단어 중간에서 자르지 않음, 최대 2줄, 가장 작게 8px — 그래도 길면 말줄임)
  function fitNames() {
    Array.prototype.forEach.call(els.board.querySelectorAll('.st-name'), function (el) {
      el.style.fontSize = '';
      el.classList.remove('is-clip');
      var box = el.parentNode;
      var maxW = box.clientWidth - 6;
      var maxH = box.clientHeight - 4;
      if (maxW <= 0) return;
      var size = parseFloat(getComputedStyle(el).fontSize) || 14;
      var guard = 0;
      while ((el.scrollWidth > maxW || el.offsetHeight > maxH) && size > 8 && guard++ < 40) {
        size -= 0.5;
        el.style.fontSize = size + 'px';
      }
      if (el.scrollWidth > maxW || el.offsetHeight > maxH) el.classList.add('is-clip');
    });
  }
  function revealAll() {
    clearTimers();
    Array.prototype.forEach.call(els.board.querySelectorAll('.st-seat:not(.is-aisle)'), function (c) { c.classList.add('is-on'); });
    if (busy) finish();
  }
  function finish() {
    lock(false);
    if (!last) return;
    var seated = last.seats.filter(function (k) { return k >= 0; }).length;
    els.live.textContent = fmt(R.live, { n: seated });
    if (!shared && !doneSent) { doneSent = true; track('done'); }
  }
  // animate: 하나씩 뒤집는 연출(새로 섞을 때만). 공유 자리표·움직임 줄이기 = 바로.
  function showResult(rec, animate) {
    clearTimers();
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 결과·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    els.badge.hidden = !shared;
    els.card.classList.toggle('is-shared', shared);
    els.note.hidden = !shared;
    els.note.textContent = shared ? fmt(R.sharedNote, { date: dateText(rec.t) }) : '';
    var play = animate && !REDUCED;
    renderBoard(rec, play);
    if (!play) { lock(false); if (animate) { busy = true; later(finish, 30); } else finish(); return; }
    lock(true);
    // 앞줄부터(자리 번호 순) 하나씩
    var seats = [];
    for (var s = 0; s < rec.rows * rec.cols; s++) if (rec.blocked.indexOf(s) < 0) seats.push(s);
    var step = Math.max(40, Math.min(150, Math.floor(2600 / Math.max(1, seats.length))));
    seats.forEach(function (s2, i) {
      later(function () { var c = els.board.querySelector('.st-seat[data-s="' + s2 + '"]'); if (c) c.classList.add('is-on'); }, 300 + i * step);
    });
    later(finish, 300 + seats.length * step + 450);
  }
  function setView(v) {
    if (view === v) return;
    view = v;
    els.viewStudent.setAttribute('aria-checked', String(v === 'student'));
    els.viewTeacher.setAttribute('aria-checked', String(v === 'teacher'));
    if (!last) return;
    if (busy) revealAll();
    renderBoard(last, false);
  }

  // ---------------------------------------------------------------- 공유 링크
  function clearSharedHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function setShared(on) {
    shared = on;
    if (window.setRetry) window.setRetry(on ? { label: R.makeOwn, action: makeOwn } : { label: R.again, action: again });
  }
  function makeOwn() {
    if (busy) return;
    clearSharedHash();
    setShared(false);
    last = null;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    smoothTo(els.form, 70);
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
    lock(false);
    // 받은 교실을 입력 칸에도 채운다(저장은 사용자가 고칠 때만)
    els.names.value = CORE.isNumbered(rec.names) ? String(rec.names.length) : rec.names.join('\n');
    st.rows = rec.rows; st.cols = rec.cols; st.blocked = {}; st.pins = {}; st.apart = []; st.front = [];
    rec.blocked.forEach(function (s) { st.blocked[s] = 1; });
    els.rows.textContent = String(st.rows); els.cols.textContent = String(st.cols);
    updateSteppers();
    refreshNames();
    last = rec;
    setShared(true);
    showResult(rec, false);
    return true;
  }
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  function shareUrl(rec) { return baseUrl().split('#')[0] + '#d=' + CORE.encodeShare(rec); }

  // ---------------------------------------------------------------- 복사 · PNG
  function copyText(text, msg) {
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
      toast(msg);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast(msg); }).catch(fallback);
    else fallback();
  }
  function chartText() {
    if (!last) return '';
    return CORE.toText(last, { title: R.textTitle, desk: U.desk, empty: R.empty, aisle: R.textAisle }, view);
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
  function fitText(ctx, text, maxW, size, minSize, family, weight) {
    var s = size;
    ctx.font = weight + ' ' + s + 'px ' + family;
    while (ctx.measureText(text).width > maxW && s > minSize) { s -= 1; ctx.font = weight + ' ' + s + 'px ' + family; }
    if (ctx.measureText(text).width <= maxW) return text;
    var a = Array.from(text);
    while (a.length > 1 && ctx.measureText(a.join('') + '…').width > maxW) a.pop();
    return a.join('') + '…';
  }
  function drawChart(rec) {
    var cs = getComputedStyle(document.body);
    var sans = cs.fontFamily || 'sans-serif';
    var display = (getComputedStyle(document.documentElement).getPropertyValue('--font-display') || '').trim() || sans;
    var W = 1200, pad = 56, gap = 14;
    var cw = Math.floor((W - pad * 2 - gap * (rec.cols - 1)) / rec.cols);
    var ch = Math.max(64, Math.min(120, Math.round(cw * 0.6)));
    var deskH = 64, titleH = 110, footH = 70;
    var gridH = rec.rows * ch + (rec.rows - 1) * gap;
    var H = titleH + deskH + 28 + gridH + footH;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#f7f2e6'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#24493a';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(fitText(ctx, R.textTitle, W - pad * 2, 50, 24, display, '800'), W / 2, 62);
    var teacher = view === 'teacher';
    var gridTop = teacher ? titleH : titleH + deskH + 28;
    var deskTop = teacher ? titleH + gridH + 28 : titleH;
    var dw = Math.min(520, W - pad * 2);
    roundRect(ctx, (W - dw) / 2, deskTop, dw, deskH, 16);
    ctx.fillStyle = '#b5763c'; ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(fitText(ctx, U.desk, dw - 30, 28, 14, sans, '800'), W / 2, deskTop + deskH / 2 + 1);
    var order = CORE.displayOrder(rec.rows, rec.cols, view);
    var bset = {};
    rec.blocked.forEach(function (s) { bset[s] = 1; });
    order.forEach(function (s, i) {
      var r = Math.floor(i / rec.cols), col = i % rec.cols;
      var x = pad + col * (cw + gap), y = gridTop + r * (ch + gap);
      var k = rec.seats[s];
      if (bset[s]) {
        ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = 'rgba(36,73,58,.25)'; ctx.lineWidth = 2;
        roundRect(ctx, x + 1, y + 1, cw - 2, ch - 2, 14); ctx.stroke(); ctx.restore();
        return;
      }
      roundRect(ctx, x, y, cw, ch, 14);
      ctx.fillStyle = k >= 0 ? '#ffffff' : 'rgba(255,255,255,.5)'; ctx.fill();
      ctx.strokeStyle = k >= 0 ? '#24493a' : 'rgba(36,73,58,.3)'; ctx.lineWidth = k >= 0 ? 3 : 2; ctx.stroke();
      ctx.fillStyle = k >= 0 ? '#1d2b24' : 'rgba(29,43,36,.45)';
      var label = k >= 0 ? rec.names[k] : R.empty;
      ctx.fillText(fitText(ctx, label, cw - 14, Math.min(34, Math.round(ch * 0.36)), 11, sans, k >= 0 ? '800' : '600'), x + cw / 2, y + ch / 2 + 1);
    });
    ctx.fillStyle = '#24493a'; ctx.fillRect(0, H - footH + 16, W, footH - 16);
    ctx.fillStyle = '#f2c14e';
    ctx.font = '700 24px ' + sans;
    ctx.fillText('🪑 ' + R.shareTitle + ' · melgene.com', W / 2, H - (footH - 16) / 2);
    return c;
  }
  function pngBlob() {
    return new Promise(function (resolve) {
      if (!last) { resolve(null); return; }
      var c = drawChart(last);
      if (c.toBlob) c.toBlob(function (b) { resolve(b); }, 'image/png');
      else resolve(null);
    });
  }
  function savePng() {
    if (!last || busy) return;
    pngBlob().then(function (b) {
      var a = document.createElement('a');
      a.download = (R.pngFile || 'seating-chart') + '.png';
      var url = b ? URL.createObjectURL(b) : drawChart(last).toDataURL('image/png');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (b) setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast(R.pngSaved);
    });
  }

  if (window.setShareData) {
    window.setShareData(function () {
      if (!last) return { title: R.shareTitle, text: R.shareTitle, url: baseUrl() };
      var n = last.seats.filter(function (k) { return k >= 0; }).length;
      return { title: R.shareTitle, text: fmt(R.shareText, { n: n }), url: shareUrl(last) };
    });
  }
  setShared(false);

  // ---------------------------------------------------------------- 이벤트
  var inputTimer = null;
  els.names.addEventListener('input', function () {
    clearError();
    clearTimeout(inputTimer);
    inputTimer = setTimeout(refreshNames, 180);
    save();
  });
  els.sample.addEventListener('click', function () {
    if (busy) return;
    els.names.value = (I.sample || []).join('\n');
    refreshNames(); clearError(); save();
  });
  els.clear.addEventListener('click', function () {
    if (busy) return;
    els.names.value = '';
    st.pins = {}; st.apart = []; st.front = [];
    refreshNames(); clearError(); save();
    try { els.names.focus(); } catch (e) { /* noop */ }
  });
  els.rowsDec.addEventListener('click', function () { setSide('rows', -1); });
  els.rowsInc.addEventListener('click', function () { setSide('rows', 1); });
  els.colsDec.addEventListener('click', function () { setSide('cols', -1); });
  els.colsInc.addEventListener('click', function () { setSide('cols', 1); });
  els.modeBlock.addEventListener('click', function () { setMode('block'); });
  els.modePin.addEventListener('click', function () { setMode('pin'); });
  els.pinName.addEventListener('change', clearError);
  els.map.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.st-mseat') : null;
    if (b) onMapClick(Number(b.getAttribute('data-s')));
  });
  els.moreBtn.addEventListener('click', function () { setMore(els.more.hidden); });
  els.apartAdd.addEventListener('click', addApart);
  els.frontAdd.addEventListener('click', addFront);
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.shuffle.addEventListener('click', shuffleSeats);
  els.skip.addEventListener('click', revealAll);
  els.viewStudent.addEventListener('click', function () { setView('student'); });
  els.viewTeacher.addEventListener('click', function () { setView('teacher'); });
  els.copy.addEventListener('click', function () { if (last && !busy) copyText(chartText(), R.copied); });
  els.png.addEventListener('click', savePng);
  els.link.addEventListener('click', function () { if (last && !busy) copyText(shareUrl(last), R.linkCopied); });
  window.addEventListener('hashchange', function () { if (!busy) loadShared(); });
  var resizeTimer = null;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(function () { if (last && !els.result.hidden) fitNames(); }, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (last && !els.result.hidden) fitNames(); });

  window.SEAT_APP = {
    busy: function () { return busy; },
    shared: function () { return shared; },
    view: function () { return view; },
    last: function () { return last ? JSON.parse(JSON.stringify(last)) : null; },
    state: function () { return { names: parsed.names.slice(), rows: st.rows, cols: st.cols, blocked: blockedList(), pins: JSON.parse(JSON.stringify(st.pins)), apart: JSON.parse(JSON.stringify(st.apart)), front: st.front.slice(), mode: st.mode }; },
    text: chartText,
    pngSize: function () { return pngBlob().then(function (b) { return b ? b.size : 0; }); },
    pngUrl: function () { return last ? drawChart(last).toDataURL('image/png') : ''; }
  };

  load();
  els.rows.textContent = String(st.rows);
  els.cols.textContent = String(st.cols);
  updateSteppers();
  refreshNames();
  if ((st.apart.length || st.front.length) && els.more.hidden) setMore(true);
  loadShared();
})();
