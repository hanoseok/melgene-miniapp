/* apps/yesno/yesno.js — 한 화면 예스 노 결정기: 질문(선택) · 모드 → 묻기 → 구슬이 돌다 답(또는 best-of 각 판이 하나씩) → 답 + 이번 세션 누적 + 최근 10개 (+ 공통 끝 화면)
 * 로직은 yesno-core.js(YESNO_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 답은 먼저 crypto 로 정하고, 연출(구슬 흔들기 약 1.8초 · best-of 판마다 0.42초)은 그 답을 보여 주기만 한다. 움직임 줄이기(prefers-reduced-motion)면 바로 답.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(답·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 묻기를 누를 때 track('start') 한 번, 답이 보일 때 track('done') 한 번(다시 물을 때마다 또). 공유 링크로 본 답은 세지 않는다.
 * 질문: 이 기기에만 둔다(최근 10개 localStorage mg_yesno_history, try/catch). 서버로 보내지 않는다.
 *       "이 답 공유하기"를 눌렀을 때만 질문이 링크(#d=)에 들어간다. 공통 끝 화면의 공유는 언제나 깨끗한 주소(질문 없음).
 * 서버 숫자: 없음 — 보이는 숫자는 이 페이지에서 직접 물은 횟수뿐.
 * 디버그/검사용 읽기 전용 핸들: window.YESNO_APP (busy(), last(), shared(), tally(), history(), mode())
 */
(function () {
  'use strict';

  var CORE = window.YESNO_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var A = I.answers || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_yesno_history';
  var ORB_MS = 1800;
  var FLIP_MS = 420;
  var HOLD_MS = 320;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('yn-form'), question: $('question'), modes: document.querySelectorAll('[data-mode]'), modeHint: $('mode-hint'),
    ask: $('ask-btn'), error: $('error'),
    result: $('result'), card: $('result-card'), badge: $('shared-badge'), resQ: $('res-question'),
    orb: $('orb'), orbText: $('orb-text'), flips: $('flips'), flipsTitle: $('flips-title'), flipsList: $('flips-list'), flipsScore: $('flips-score'),
    tone: $('res-tone'), live: $('live'), note: $('shared-note'), link: $('link-btn'),
    tYes: $('tally-yes'), tNo: $('tally-no'), tMaybe: $('tally-maybe'), tTotal: $('tally-total'),
    historyCard: $('history-card'), historyList: $('history-list'), historyClear: $('history-clear'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = 'classic';
  var busy = false;
  var last = null;      // { m, a, f, q, t }
  var shared = false;
  var tally = CORE.newTally();
  var history = loadHistory();
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }
  var numFmt = null;
  try { numFmt = new Intl.NumberFormat(I.lang || 'en'); } catch (e) { /* noop */ }
  function num(n) { return numFmt ? numFmt.format(n) : String(n); }
  function dateText(ms) {
    try { return new Intl.DateTimeFormat(I.lang || 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms)); } catch (e) { return new Date(ms).toLocaleString(); }
  }
  function timeText(ms) {
    try { return new Intl.DateTimeFormat(I.lang || 'en', { hour: '2-digit', minute: '2-digit' }).format(new Date(ms)); } catch (e) { return ''; }
  }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }

  // 답 문구: 구슬 답은 그 문장, 그 밖은 YES / NO / MAYBE
  function answerText(rec) {
    if (rec.m === 'oracle') return (I.oracle || [])[rec.a] || '';
    return A[CORE.outcome(rec)] || '';
  }

  // ---------------------------------------------------------------- 기록 (localStorage, 실패해도 동작)
  function loadHistory() {
    try { return CORE.cleanHistory(JSON.parse(window.localStorage.getItem(STORE) || '[]')); } catch (e) { return []; }
  }
  function saveHistory() {
    try {
      if (history.length) window.localStorage.setItem(STORE, JSON.stringify(history));
      else window.localStorage.removeItem(STORE);
    } catch (e) { /* noop */ }
  }
  function renderHistory() {
    els.historyList.innerHTML = '';
    history.forEach(function (h) {
      var li = document.createElement('li');
      li.className = 'is-' + CORE.outcome(h);
      var ans = document.createElement('span');
      ans.className = 'yn-h-ans';
      ans.textContent = answerText(h);
      var q = document.createElement('span');
      q.className = 'yn-h-q' + (h.q ? '' : ' is-empty');
      q.textContent = h.q || R.noQuestion;
      var meta = document.createElement('span');
      meta.className = 'yn-h-meta';
      meta.textContent = (U.modes || {})[h.m] || '';
      var time = document.createElement('time');
      time.className = 'yn-h-time';
      time.dateTime = new Date(h.t).toISOString();
      time.textContent = timeText(h.t);
      li.appendChild(ans);
      li.appendChild(meta);
      li.appendChild(time);
      li.appendChild(q);
      els.historyList.appendChild(li);
    });
    els.historyCard.hidden = history.length === 0;
  }
  function renderTally() {
    els.tYes.textContent = num(tally.yes);
    els.tNo.textContent = num(tally.no);
    els.tMaybe.textContent = num(tally.maybe);
    els.tTotal.textContent = fmt(I.tally && I.tally.total, { n: num(CORE.tallyTotal(tally)) });
  }

  // ---------------------------------------------------------------- 모드
  function setMode(m, focus) {
    if (busy || !CORE.isMode(m)) return;
    mode = m;
    els.modes.forEach(function (b) {
      var on = b.getAttribute('data-mode') === m;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    els.modeHint.textContent = (U.modeHints || {})[m] || '';
  }
  function lock(on) {
    busy = on;
    els.ask.disabled = on;
    els.ask.textContent = on ? U.asking : U.ask;
    els.ask.setAttribute('aria-busy', String(on));
    els.link.disabled = on;
    els.modes.forEach(function (b) { b.disabled = on; });
  }

  // ---------------------------------------------------------------- 답 그리기
  function setOrb(state, text, cls) {
    els.orb.className = 'yn-orb' + (state ? ' ' + state : '') + (cls ? ' ' + cls : '');
    els.orbText.textContent = text || '';
    els.orbText.className = 'yn-orb-text' + (text && Array.from(text).length > 12 ? ' is-long' : '');
  }
  function flipItem(s, landed) {
    var li = document.createElement('li');
    li.className = 'yn-flip' + (landed ? ' is-landed ' + (s === 0 ? 'is-yes' : 'is-no') : ' is-pending');
    li.textContent = landed ? (s === 0 ? R.flipYes : R.flipNo) : '·';
    return li;
  }
  function renderFlips(rec, shown) {
    var n = CORE.bestN(rec.m);
    els.flips.hidden = !n;
    if (!n) return;
    els.flipsTitle.textContent = fmt(R.bestOf, { n: n });
    els.flipsList.innerHTML = '';
    for (var i = 0; i < n; i++) {
      var li = i < shown ? flipItem(rec.f[i], true) : flipItem(0, false);
      if (i >= rec.f.length && shown >= rec.f.length) li.className = 'yn-flip is-unused';
      els.flipsList.appendChild(li);
    }
    var w = [0, 0];
    for (var j = 0; j < shown; j++) w[rec.f[j]]++;
    els.flipsScore.textContent = fmt(R.score, { yes: A.yes, no: A.no, a: w[0], b: w[1] });
  }
  function renderHead(rec) {
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 답·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    els.badge.hidden = !shared;
    els.card.classList.toggle('is-shared', shared);
    els.resQ.textContent = rec.q ? '“' + rec.q + '”' : R.noQuestion;
    els.resQ.classList.toggle('is-empty', !rec.q);
    els.note.hidden = !shared;
    els.note.textContent = shared ? fmt(R.sharedNote, { date: dateText(rec.t) }) : '';
    els.tone.hidden = true;
  }
  function reveal(rec) {
    var o = CORE.outcome(rec);
    setOrb('is-revealed', answerText(rec), 'is-' + o);
    if (CORE.bestN(rec.m)) renderFlips(rec, rec.f.length);
    if (rec.m === 'oracle') {
      els.tone.textContent = (I.tones || {})[CORE.tone(rec.a)] || '';
      els.tone.className = 'yn-tone is-' + o;
      els.tone.hidden = false;
    }
    els.live.textContent = fmt(R.live, { answer: answerText(rec) });
  }
  function finish(rec) {
    CORE.addTally(tally, rec);
    renderTally();
    history = CORE.pushHistory(history, { m: rec.m, a: rec.a, f: rec.f, q: rec.q || undefined, t: rec.t });
    saveHistory();
    renderHistory();
    lock(false);
    track('done');
  }
  // animate: 새로 물을 때만. 공유 답·움직임 줄이기 = 바로.
  function showAnswer(rec, animate) {
    clearTimers();
    renderHead(rec);
    if (!animate) { reveal(rec); return; }
    if (REDUCED) { reveal(rec); later(function () { finish(rec); }, 30); return; }
    var n = CORE.bestN(rec.m);
    if (n) {
      setOrb('is-thinking', '');
      renderFlips(rec, 0);
      rec.f.forEach(function (s, i) {
        later(function () { renderFlips(rec, i + 1); }, FLIP_MS * (i + 1));
      });
      later(function () { reveal(rec); later(function () { finish(rec); }, HOLD_MS); }, FLIP_MS * rec.f.length + HOLD_MS);
      return;
    }
    els.flips.hidden = true;
    setOrb('is-shaking', '');
    later(function () { reveal(rec); later(function () { finish(rec); }, HOLD_MS); }, ORB_MS);
  }

  // ---------------------------------------------------------------- 묻기
  function clearSharedHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function setShared(on) {
    shared = on;
    if (window.setRetry) window.setRetry(on ? { label: R.askOwn, action: askOwn } : { label: R.again, action: again });
  }
  function ask() {
    if (busy) return;
    els.error.hidden = true;
    var rec = CORE.ask(mode);                       // 답 먼저 — 연출은 이 답을 보여 주기만 한다
    rec.q = CORE.cleanQuestion(els.question.value);
    rec.t = Date.now();
    if (shared) { clearSharedHash(); setShared(false); }
    last = rec;
    lock(true);
    track('start');
    showAnswer(rec, true);
    later(function () { smoothTo(els.card, 70); }, 20);
  }
  function again() { if (!busy) ask(); }
  function askOwn() {
    if (busy) return;
    clearSharedHash();
    setShared(false);
    ask();
  }
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) {
      els.error.textContent = (I.errors || {}).badLink || '';
      els.error.hidden = false;
      return false;
    }
    clearTimers();
    lock(false);
    els.question.value = rec.q || '';
    setMode(rec.m);
    last = rec;
    setShared(true);
    showAnswer(rec, false);
    return true;
  }

  // ---------------------------------------------------------------- 공유
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
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  // "이 답 공유하기"를 누를 때만 질문이 담긴 #d= 링크를 만든다.
  function answerUrl(rec) { var d = CORE.encodeShare(rec); return d ? baseUrl() + '#d=' + d : baseUrl(); }

  // 공통 끝 화면의 공유: 깨끗한 주소(질문 없음), 문구에는 답만.
  if (window.setShareData) {
    window.setShareData(function () {
      var text = last ? fmt(R.shareText, { answer: answerText(last) }) : R.shareTitle;
      return { title: R.shareTitle, text: text, url: baseUrl() };
    });
  }
  setShared(false);

  // ---------------------------------------------------------------- 이벤트
  els.modes.forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    b.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var i = CORE.MODES.indexOf(mode);
      setMode(CORE.MODES[(i + dir + CORE.MODES.length) % CORE.MODES.length], true);
    });
  });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); ask(); });
  els.question.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ask(); } });
  els.ask.addEventListener('click', ask);
  els.link.addEventListener('click', function () { if (last && !busy) copyText(answerUrl(last), R.linkCopied); });
  els.historyClear.addEventListener('click', function () { history = []; saveHistory(); renderHistory(); });
  window.addEventListener('hashchange', function () { if (!busy) loadShared(); });

  window.YESNO_APP = {
    busy: function () { return busy; },
    last: function () { return last ? JSON.parse(JSON.stringify(last)) : null; },
    shared: function () { return shared; },
    tally: function () { return JSON.parse(JSON.stringify(tally)); },
    history: function () { return JSON.parse(JSON.stringify(history)); },
    mode: function () { return mode; }
  };

  renderTally();
  renderHistory();   // 기록 카드는 결과 영역(#result) 안 — 답이 처음 보일 때 함께 보인다
  setMode('classic');
  loadShared();
})();
