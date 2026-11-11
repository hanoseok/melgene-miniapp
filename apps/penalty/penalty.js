/* apps/penalty/penalty.js — 벌칙 카드 뒤집기: 시작 → 설정 → 뒤집기(뒷면 카드 격자) → 끝(누가 벌칙인지)
 * 로직은 penalty-core.js(PENALTY_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 카드는 "카드 섞기"를 누르는 순간 모두 정해진다. 뒤집는 것은 보여 주기만 한다(되돌리기 없음).
 * 다시 섞기는 아무 카드도 뒤집기 전에만 된다(같은 판을 새로 배정: 기록은 다시 세지 않는다).
 * 움직임 줄이기(prefers-reduced-motion)면 CSS 전환을 끈다(style.css).
 * 기록: "카드 섞기"로 판이 시작될 때 track('start') 한 번, 모든 카드를 뒤집어 끝 화면에 닿을 때 track('done') 한 번.
 *   공유 링크로 본 결과는 세지 않는다.
 * 저장: 마지막 설정(인원·벌칙 장수·문구·이름)만 localStorage penalty_state(try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): 받은 사람은 다시 섞지 않고 같은 결과를 "공유된 결과"로 본다. 끝 화면 "나도 해 보기" = 설정 화면.
 * 디버그/검사용 읽기 전용 핸들: window.PENALTY_APP
 */
(function () {
  'use strict';

  var CORE = window.PENALTY_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var E = I.errors || {};
  var D = I.draw || {};
  var R = I.result || {};
  var LIM = I.limits || { minPlayers: 2, maxPlayers: 12, maxItems: 30, maxItemLen: 60 };
  var DEFAULT_ITEMS = I.defaults || [];
  var STORE = 'penalty_state';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), goSetup: $('go-setup'),
    setup: $('screen-setup'), form: $('pn-form'),
    players: $('players'), playersDec: $('players-dec'), playersInc: $('players-inc'),
    penalties: $('penalties'), penaltiesDec: $('penalties-dec'), penaltiesInc: $('penalties-inc'),
    items: $('items'), resetItems: $('reset-items'), itemsCount: $('items-count'),
    namesBtn: $('names-btn'), namesBox: $('names-box'), names: $('names'),
    error: $('error'), shuffle: $('shuffle-btn'),
    flip: $('screen-flip'), progress: $('progress'), left: $('left'), turn: $('turn'),
    barFill: $('bar-fill'), grid: $('grid'), reveal: $('reveal'),
    flipAll: $('flip-all'), reshuffle: $('reshuffle'), seeResults: $('see-results'), live: $('live'),
    end: $('screen-end'), badge: $('shared-badge'), note: $('shared-note'), summary: $('summary'),
    list: $('list'), safeList: $('safe-list'),
    copy: $('copy-btn'), link: $('link-btn'), edit: $('edit-btn')
  };

  var session = null;      // 지금 판 (CORE.newSession 결과)
  var opts = null;         // 지금 판을 만든 설정 (다시 섞기에 쓴다)
  var last = null;         // 끝 화면 기록 { n, names, results, shared }
  var shared = false;      // 공유 링크로 보고 있는지
  var roundDone = false;   // 이 판의 done 기록을 이미 남겼는지
  var phase = 'start';
  var penaltiesTouched = false;

  function fmt(tpl, v) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function track(ev) { try { if (window.track) window.track(ev, {}); } catch (e) { /* 통계 실패는 무시 */ } }
  function toast(msg) { try { if (window.toast) window.toast(msg); } catch (e) { /* noop */ } }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function scrollTop() { try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); } }
  function clampInt(v, lo, hi, fallback) {
    var n = Math.floor(Number(v));
    if (!isFinite(n)) return fallback;
    return Math.min(hi, Math.max(lo, n));
  }

  // ---------------------------------------------------------------- 저장 (localStorage, try/catch)
  function loadState() {
    try { return CORE.cleanState(JSON.parse(window.localStorage.getItem(STORE) || 'null')); } catch (e) { return CORE.cleanState(null); }
  }
  function saveState(o) {
    try { window.localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) { /* 저장이 안 돼도 동작은 한다 */ }
  }

  // ---------------------------------------------------------------- 화면 전환
  function show(name) {
    phase = name;
    els.start.hidden = name !== 'start';
    els.setup.hidden = name !== 'setup';
    els.flip.hidden = name !== 'flip';
    els.end.hidden = name !== 'end';
    scrollTop();
  }

  // ---------------------------------------------------------------- 설정 화면
  function currentPlayers() { return clampInt(els.players.value, LIM.minPlayers, LIM.maxPlayers, 6); }

  function syncPenaltyLimit() {
    var n = currentPlayers();
    if (!penaltiesTouched) els.penalties.value = CORE.autoPenalties(n);
    var k = clampInt(els.penalties.value, 1, n, CORE.autoPenalties(n));
    els.penalties.value = k;
    els.penalties.max = String(n);
  }

  function updateItemsCount() {
    var count = CORE.cleanItems(els.items.value).length;
    els.itemsCount.textContent = count ? fmt(U.itemsCount, { count: count }) : '';
  }

  function stepValue(input, delta, lo, hi) {
    var v = clampInt(input.value, lo, hi, lo);
    input.value = clampInt(v + delta, lo, hi, v);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setError(code) {
    if (!code) { els.error.hidden = true; els.error.textContent = ''; return; }
    els.error.textContent = E[code] || code;
    els.error.hidden = false;
  }

  function readForm() {
    var n = clampInt(els.players.value, LIM.minPlayers, LIM.maxPlayers, NaN);
    var k = clampInt(els.penalties.value, 1, isFinite(n) ? n : LIM.maxPlayers, NaN);
    return {
      players: n,
      penalties: penaltiesTouched ? k : (isFinite(n) ? CORE.autoPenalties(n) : NaN),
      items: CORE.cleanItems(els.items.value),
      names: CORE.cleanNames(els.names.value),
      rawItems: els.items.value,
      rawNames: els.names.value
    };
  }

  function fillForm(st) {
    els.players.value = String(st.players);
    penaltiesTouched = st.penalties != null;
    els.penalties.value = String(penaltiesTouched ? st.penalties : CORE.autoPenalties(st.players));
    els.items.value = (st.items && st.items.length ? st.items : DEFAULT_ITEMS).join('\n');
    els.names.value = st.names || '';
    if (st.names) {
      els.namesBox.hidden = false;
      els.namesBtn.setAttribute('aria-expanded', 'true');
    }
    syncPenaltyLimit();
    updateItemsCount();
    setError(null);
  }

  function goSetup() {
    shared = false;
    last = null;
    clearHash();
    fillForm(loadState());
    show('setup');
    setShare(null);
    setRetryMode('setup');
  }

  function shuffleNow() {
    var f = readForm();
    var errs = CORE.validate({ players: f.players, penalties: f.penalties, items: f.items, names: f.names });
    if (errs.length) { setError(errs[0]); return; }
    setError(null);
    opts = { players: f.players, penalties: f.penalties, items: f.items, names: f.names };
    saveState({ players: f.players, penalties: penaltiesTouched ? f.penalties : null, items: f.items, names: f.rawNames });
    startRound();
    track('start');
  }

  // ---------------------------------------------------------------- 뒤집기 화면
  function whoLabel(name, k) { return name || fmt(D.numbered, { k: k }); }

  function cardCountClass(n) {
    if (n <= 4) return 'is-few';
    if (n <= 9) return 'is-mid';
    return 'is-many';
  }

  function buildGrid() {
    els.grid.innerHTML = '';
    els.grid.className = 'pn-grid ' + cardCountClass(session.n);
    var names = CORE.sessionNames(session);
    var frag = document.createDocumentFragment();
    for (var p = 0; p < session.n; p++) {
      var b = el('button', 'pn-card-btn');
      b.type = 'button';
      b.setAttribute('data-pos', String(p));
      b.setAttribute('aria-label', fmt(D.cardAria, { k: p + 1 }));
      var inner = el('span', 'pn-inner');
      var back = el('span', 'pn-face pn-back');
      back.appendChild(el('span', 'pn-num', String(p + 1)));
      var front = el('span', 'pn-face pn-front');
      front.appendChild(el('span', 'pn-tag'));
      front.appendChild(el('span', 'pn-who'));
      inner.appendChild(back);
      inner.appendChild(front);
      b.appendChild(inner);
      b.dataset.name = names[p] || '';
      frag.appendChild(b);
    }
    els.grid.appendChild(frag);
  }

  function cardAt(pos) { return els.grid.querySelector('[data-pos="' + pos + '"]'); }

  // 뒤집힌 한 장을 화면에 그린다. r = CORE.flip 결과 { k, name, text }
  function markCard(pos, r) {
    var b = cardAt(pos);
    if (!b) return;
    var who = whoLabel(r.name, r.k);
    b.classList.add('is-open');
    b.classList.add(r.text ? 'is-penalty' : 'is-safe');
    b.disabled = true;
    b.querySelector('.pn-tag').textContent = r.text ? D.penaltyTag : D.safeTag;
    b.querySelector('.pn-who').textContent = who;
    b.setAttribute('aria-label', r.text ? fmt(D.revealPenalty, { who: who, text: r.text }) : fmt(D.revealSafe, { who: who }));
  }

  function updateProgress() {
    var done = session.flipped.length;
    var n = session.n;
    els.progress.textContent = fmt(D.progress, { done: done, n: n });
    els.left.textContent = fmt(D.left, { n: n - done });
    els.barFill.style.width = Math.round((done / n) * 100) + '%';
    var finished = CORE.isDone(session);
    els.seeResults.hidden = !finished;
    els.flipAll.disabled = finished;
    els.reshuffle.disabled = done > 0;
    if (finished) {
      els.turn.textContent = D.done;
    } else {
      var next = done + 1;
      var nextName = session.names && session.names[done] ? session.names[done] : null;
      els.turn.textContent = fmt(D.turn, { who: whoLabel(nextName, next) });
    }
  }

  function setReveal(r) {
    if (!r) { els.reveal.textContent = D.revealNone; return; }
    var who = whoLabel(r.name, r.k);
    var line = r.text ? fmt(D.revealPenalty, { who: who, text: r.text }) : fmt(D.revealSafe, { who: who });
    els.reveal.textContent = line;
    els.live.textContent = r.text ? fmt(D.live, { who: who, text: r.text }) : fmt(D.liveSafe, { who: who });
  }

  function flipOne(pos) {
    if (!session || shared || CORE.isDone(session)) return;
    var r = CORE.flip(session, pos);
    if (!r) return;
    markCard(pos, r);
    setReveal(r);
    updateProgress();
  }

  function flipEverything() {
    if (!session || shared) return;
    for (var p = 0; p < session.n; p++) {
      var r = CORE.flip(session, p);
      if (r) markCard(p, r);
    }
    setReveal(null);
    els.reveal.textContent = D.done;
    updateProgress();
  }

  function reshuffleNow() {
    if (!session || !opts || session.flipped.length > 0) return;
    session = CORE.newSession(opts);
    buildGrid();
    updateProgress();
    setReveal(null);
  }

  function startRound() {
    session = CORE.newSession(opts);
    roundDone = false;
    shared = false;
    last = null;
    clearHash();
    buildGrid();
    setReveal(null);
    updateProgress();
    show('flip');
    setRetryMode('setup');
  }

  function finishRound() {
    if (!session || !CORE.isDone(session)) return;
    last = { n: session.n, names: CORE.sessionNames(session), results: CORE.results(session), shared: false };
    renderEnd(last);
    show('end');
    if (!roundDone) { roundDone = true; track('done'); }
  }

  // ---------------------------------------------------------------- 끝 화면
  function penaltyLines(rec) {
    return rec.results.map(function (x) {
      return { who: whoLabel(x.name, x.k), text: x.text };
    });
  }

  function renderEnd(rec) {
    var lines = penaltyLines(rec);
    var pen = lines.filter(function (x) { return !!x.text; });
    var safe = lines.filter(function (x) { return !x.text; });
    els.badge.hidden = !rec.shared;
    els.note.hidden = !rec.shared;
    els.summary.textContent = fmt(pen.length === 1 ? R.summary : R.summaryMany, { k: pen.length, s: safe.length });
    els.list.innerHTML = '';
    pen.forEach(function (x) {
      var li = el('li', 'pn-item');
      li.appendChild(el('span', 'pn-item-who', x.who));
      li.appendChild(el('span', 'pn-item-text', x.text));
      els.list.appendChild(li);
    });
    if (safe.length) {
      els.safeList.hidden = false;
      els.safeList.textContent = fmt(R.safeList, { names: safe.map(function (x) { return x.who; }).join(', ') });
    } else {
      els.safeList.hidden = true;
      els.safeList.textContent = '';
    }
    setShare(baseUrl());
    setRetryMode('setup');
  }

  function textResult(rec) {
    var lines = [R.textTitle];
    penaltyLines(rec).forEach(function (x) {
      lines.push(x.who + ': ' + (x.text || R.textSafe));
    });
    return lines.join('\n');
  }

  function shareUrl(rec) {
    var enc = CORE.encodeShare({ n: rec.n, names: rec.names && rec.names.some(function (s) { return !!s; }) ? rec.names : null, r: rec.results.map(function (x) { return x.text; }) });
    return baseUrl() + '#d=' + enc;
  }

  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }

  function setShare(url) {
    if (!window.setShareData) return;
    window.setShareData(function () {
      return { title: R.shareTitle, text: R.shareText, url: url || baseUrl() };
    });
  }

  function setRetryMode() {
    if (!window.setRetry) return;
    window.setRetry({ label: R.again, action: function () { goSetup(); } });
  }

  function copyText(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 복사 불가 */ }
    document.body.removeChild(ta);
  }

  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=)
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) {
      show('setup');
      fillForm(loadState());
      setError('badLink');
      return true;
    }
    session = null;
    shared = true;
    var names = [];
    for (var i = 0; i < rec.n; i++) names.push(rec.names && rec.names[i] || null);
    last = {
      n: rec.n,
      names: names,
      results: rec.r.map(function (text, j) { return { k: j + 1, name: names[j], text: text }; }),
      shared: true
    };
    renderEnd(last);
    show('end');
    return true;
  }

  function onHashChange() {
    if (phase === 'setup' || phase === 'end' || phase === 'start') loadShared();
  }

  // ---------------------------------------------------------------- 연결
  function bindStepper(input, dec, inc, lo, hi, onChange) {
    dec.addEventListener('click', function () { stepValue(input, -1, lo, hi); });
    inc.addEventListener('click', function () { stepValue(input, 1, lo, hi); });
    input.addEventListener('change', function () {
      input.value = String(clampInt(input.value, lo, hi, lo));
      if (onChange) onChange();
    });
  }

  bindStepper(els.players, els.playersDec, els.playersInc, LIM.minPlayers, LIM.maxPlayers, function () { syncPenaltyLimit(); setError(null); });
  bindStepper(els.penalties, els.penaltiesDec, els.penaltiesInc, 1, LIM.maxPlayers, function () {
    penaltiesTouched = true;
    syncPenaltyLimit();
    setError(null);
  });
  els.penalties.addEventListener('input', function () { penaltiesTouched = true; });
  els.items.addEventListener('input', function () { updateItemsCount(); setError(null); });
  els.resetItems.addEventListener('click', function () {
    els.items.value = DEFAULT_ITEMS.join('\n');
    updateItemsCount();
    setError(null);
  });
  els.names.addEventListener('input', function () { setError(null); });
  els.namesBtn.addEventListener('click', function () {
    var open = els.namesBox.hidden;
    els.namesBox.hidden = !open;
    els.namesBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) els.names.focus();
  });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); shuffleNow(); });
  els.form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') e.preventDefault();
  });
  els.goSetup.addEventListener('click', goSetup);
  els.shuffle.addEventListener('click', shuffleNow);
  els.grid.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('.pn-card-btn') : null;
    if (!b || b.disabled) return;
    flipOne(Number(b.getAttribute('data-pos')));
  });
  els.flipAll.addEventListener('click', flipEverything);
  els.reshuffle.addEventListener('click', reshuffleNow);
  els.seeResults.addEventListener('click', finishRound);
  els.copy.addEventListener('click', function () { if (last) copyText(textResult(last), R.copied); });
  els.link.addEventListener('click', function () { if (last && !shared) copyText(shareUrl(last), R.linkCopied); else if (last) copyText(window.location.href.split('#')[0] + window.location.hash, R.linkCopied); });
  els.edit.addEventListener('click', function () { goSetup(); });
  window.addEventListener('hashchange', onHashChange);

  window.PENALTY_APP = {
    phase: function () { return phase; },
    shared: function () { return shared; },
    deck: function () { return session ? session.deck.slice() : null; },
    flipped: function () { return session ? session.flipped.slice() : null; },
    last: function () { return last ? JSON.parse(JSON.stringify(last)) : null; },
    text: function () { return last ? textResult(last) : ''; },
    link: function () { return last && !shared ? shareUrl(last) : ''; },
    state: function () { return readForm(); }
  };

  // 처음 열면 시작 화면. #d= 링크로 열면 공유된 결과를 바로 보여 준다.
  var st = loadState();
  fillForm(st);
  show('start');
  loadShared();
  setRetryMode('setup');
})();
