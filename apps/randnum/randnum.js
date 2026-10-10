/* apps/randnum/randnum.js — 한 화면 랜덤 숫자 뽑기: 범위·개수·옵션 → 뽑기 → 숫자 릴(슬롯처럼 굴러가다 멈춤) → 결과 + 최근 10번 (+ 공통 끝 화면)
 * 로직은 randnum-core.js(RANDNUM_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 결과는 먼저 crypto 로 뽑고, 릴이 굴러가는 연출은 그 값에 멈추는 모습만 보여 준다. 움직임 줄이기(prefers-reduced-motion)면 바로 결과.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(결과·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 뽑기를 누를 때 track('start') 한 번, 결과가 다 보일 때 track('done') 한 번(다시 뽑을 때마다 또). 공유 링크로 본 결과는 세지 않는다.
 * 저장: 최근 10번만 이 기기 localStorage(mg_randnum_history, try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): 받은 사람은 다시 뽑지 않고 그 결과를 "공유된 결과"로 본다. 다시 하기 = "나도 뽑기"(같은 설정으로 새로 뽑음).
 * 디버그/검사용 읽기 전용 핸들: window.RANDNUM_APP (busy(), last(), shared(), history())
 */
(function () {
  'use strict';

  var CORE = window.RANDNUM_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_randnum_history';
  var STORE_MAX_R = 100;     // 기록 한 줄에 저장하는 숫자 수(화면에는 앞 몇 개만)
  var ROLL_MAX_TILES = 80;   // 이보다 많으면 앞쪽만 굴리고 나머지는 같이 멈춘다

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('rn-form'), min: $('min'), max: $('max'), count: $('count'), dec: $('count-dec'), inc: $('count-inc'),
    dup: $('dup'), sort: $('sort'), more: $('more'), moreBtn: $('more-btn'), exclude: $('exclude'), label: $('label'),
    presets: document.querySelectorAll('[data-preset]'), error: $('error'), draw: $('draw-btn'),
    result: $('result'), card: $('result-card'), badge: $('shared-badge'), title: $('res-title'), resLabel: $('res-label'),
    tags: $('res-tags'), reels: $('reels'), live: $('live'), note: $('shared-note'), copy: $('copy-btn'), link: $('link-btn'),
    historyCard: $('history-card'), historyList: $('history-list'), historyClear: $('history-clear'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var busy = false;
  var last = null;      // { p, r, t }
  var shared = false;
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
  function listText(r, max) {
    var shown = r.slice(0, max).map(num).join(', ');
    return r.length > max ? shown + ' ' + fmt(R.more, { n: num(r.length - max) }) : shown;
  }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
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
      var range = document.createElement('span');
      range.className = 'rn-h-range';
      range.textContent = fmt(R.range, { min: num(h.p.a), max: num(h.p.b) }) + ' ' + fmt(R.countTag, { n: num(h.p.n) });
      var vals = document.createElement('span');
      vals.className = 'rn-h-vals';
      var more = Math.max(h.p.n, h.r.length) - Math.min(h.r.length, 8);
      vals.textContent = h.r.slice(0, 8).map(num).join(', ') + (more > 0 ? ' ' + fmt(R.more, { n: num(more) }) : '');
      var time = document.createElement('time');
      time.className = 'rn-h-time';
      time.dateTime = new Date(h.t).toISOString();
      time.textContent = timeText(h.t);
      li.appendChild(range);
      if (h.p.l) {
        var lab = document.createElement('span');
        lab.className = 'rn-h-label';
        lab.textContent = h.p.l;
        li.appendChild(lab);
      }
      li.appendChild(time);
      li.appendChild(vals);
      els.historyList.appendChild(li);
    });
    els.historyCard.hidden = history.length === 0;
  }

  // ---------------------------------------------------------------- 입력
  function readForm() {
    return {
      min: els.min.value, max: els.max.value, count: els.count.value,
      dup: els.dup.checked, sort: els.sort.checked, exclude: els.exclude.value, label: els.label.value
    };
  }
  function fillForm(p) {
    els.min.value = p.a; els.max.value = p.b; els.count.value = p.n;
    els.dup.checked = !!p.u; els.sort.checked = !!p.s;
    els.exclude.value = (p.x || []).join(', ');
    els.label.value = p.l || '';
    if ((p.x && p.x.length) || p.l) setMore(true);
    updatePresets();
  }
  var FIELDS = { min: 'min', max: 'max', count: 'count', exclude: 'exclude' };
  function clearError() {
    els.error.hidden = true;
    els.error.textContent = '';
    Object.keys(FIELDS).forEach(function (k) { els[FIELDS[k]].removeAttribute('aria-invalid'); });
  }
  function showError(v) {
    var msg = fmt(E[v.error] || E.minInvalid, { n: num(v.available || 0), list: (v.bad || []).slice(0, 5).join(', ') });
    els.error.textContent = msg;
    els.error.hidden = false;
    var f = v.field && els[FIELDS[v.field]];
    if (f) {
      if (v.field === 'exclude') setMore(true);
      f.setAttribute('aria-invalid', 'true');
      try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); }
    }
    smoothTo(els.error, 140);
  }
  function updatePresets() {
    var id = CORE.presetMatch(CORE.parseIntStrict(els.min.value), CORE.parseIntStrict(els.max.value));
    els.presets.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-preset') === id)); });
  }
  function setPreset(id) {
    if (busy) return;
    var p = CORE.PRESETS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    els.min.value = p.a; els.max.value = p.b;
    if (p.n != null) els.count.value = p.n;
    if (p.u != null) els.dup.checked = p.u;
    if (p.s != null) els.sort.checked = p.s;
    clearError();
    updatePresets();
  }
  function stepCount(d) {
    if (busy) return;
    var n = CORE.parseIntStrict(els.count.value);
    if (n === null || isNaN(n)) n = 1;
    n = Math.min(CORE.MAX_COUNT, Math.max(1, n + d));
    els.count.value = n;
    clearError();
  }
  function setMore(open) {
    els.more.hidden = !open;
    els.moreBtn.setAttribute('aria-expanded', String(open));
  }
  function lock(on) {
    busy = on;
    els.draw.disabled = on;
    els.draw.textContent = on ? U.drawing : U.draw;
    els.draw.setAttribute('aria-busy', String(on));
    els.copy.disabled = on;
    els.link.disabled = on;
  }

  // ---------------------------------------------------------------- 결과 그리기
  function sizeClass(n) { return n === 1 ? 'is-one' : n <= 6 ? 'is-few' : n <= 30 ? 'is-mid' : 'is-many'; }
  function renderTags(rec) {
    var p = rec.p;
    var tags = [fmt(R.range, { min: num(p.a), max: num(p.b) }), fmt(R.countTag, { n: num(p.n) }), p.u ? R.repeat : R.noRepeat];
    if (p.s) tags.push(R.sorted);
    if (p.x && p.x.length) tags.push(fmt(R.excluded, { n: num(p.x.length) }));
    els.tags.innerHTML = '';
    tags.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; els.tags.appendChild(li); });
  }
  function renderHead(rec) {
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 결과·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    els.badge.hidden = !shared;
    els.card.classList.toggle('is-shared', shared);
    els.title.textContent = rec.r.length === 1 ? R.headingOne : R.heading;
    els.resLabel.textContent = rec.p.l || '';
    els.resLabel.hidden = !rec.p.l;
    els.note.hidden = !shared;
    els.note.textContent = shared ? fmt(R.sharedNote, { date: dateText(rec.t) }) : '';
    renderTags(rec);
  }
  // 타일을 만든다. 글자 수(가장 긴 숫자)에 맞춰 글자 크기를 줄인다(--len).
  function buildTiles(rec) {
    var r = rec.r;
    var maxLen = Math.max(num(rec.p.a).length, num(rec.p.b).length, 1);
    els.reels.className = 'rn-reels ' + sizeClass(r.length);
    els.reels.style.setProperty('--len', String(maxLen));
    els.reels.innerHTML = '';
    var frag = document.createDocumentFragment();
    var tiles = [];
    for (var i = 0; i < r.length; i++) {
      var t = document.createElement('span');
      t.className = 'rn-tile';
      var s = document.createElement('span');
      s.className = 'rn-num';
      t.appendChild(s);
      frag.appendChild(t);
      tiles.push(t);
    }
    els.reels.appendChild(frag);
    return tiles;
  }
  function landTile(t, v) {
    t.firstChild.textContent = num(v);
    t.classList.remove('is-rolling');
    t.classList.add('is-landed');
  }
  function finish(rec, counted) {
    els.live.textContent = fmt(R.live, { nums: listText(rec.r, 20) });
    if (counted) {
      history = CORE.pushHistory(history, { p: { a: rec.p.a, b: rec.p.b, n: rec.p.n, u: rec.p.u, s: rec.p.s, l: rec.p.l }, r: rec.r.slice(0, STORE_MAX_R), t: rec.t });
      saveHistory();
      renderHistory();
      lock(false);
      track('done');
    }
  }
  // animate: 굴리는 연출(새로 뽑을 때만). 공유 결과·움직임 줄이기 = 바로.
  function showResult(rec, animate) {
    clearTimers();
    renderHead(rec);
    var tiles = buildTiles(rec);
    var r = rec.r;
    if (!animate || REDUCED) {
      tiles.forEach(function (t, i) { landTile(t, r[i]); });
      if (animate) later(function () { finish(rec, true); }, 30);
      else finish(rec, false);
      return;
    }
    var span = rec.p.b - rec.p.a + 1;
    var landed = [];
    var rolling = tiles.slice(0, ROLL_MAX_TILES);
    tiles.forEach(function (t, i) {
      t.classList.add('is-rolling');
      t.firstChild.textContent = num(rec.p.a + CORE.cryptoInt(span));   // 보여 주기용 숫자(결과와 무관)
      landed[i] = false;
    });
    var spin = setInterval(function () {
      for (var i = 0; i < rolling.length; i++) if (!landed[i]) rolling[i].firstChild.textContent = num(rec.p.a + CORE.cryptoInt(span));
    }, 55);
    timers.push(spin);
    var n = r.length;
    var base = 650;
    var step = n <= 12 ? 150 : n <= ROLL_MAX_TILES ? Math.max(12, Math.floor(900 / n)) : 0;
    var end = 0;
    tiles.forEach(function (t, i) {
      var at = base + Math.min(i, ROLL_MAX_TILES) * step;
      end = Math.max(end, at);
      later(function () { landed[i] = true; landTile(t, r[i]); }, at);
    });
    later(function () { clearInterval(spin); finish(rec, true); }, end + 380);
  }

  // ---------------------------------------------------------------- 뽑기
  function clearSharedHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function setShared(on) {
    shared = on;
    if (window.setRetry) window.setRetry(on ? { label: R.drawOwn, action: drawOwn } : { label: R.again, action: again });
  }
  function draw() {
    if (busy) return;
    var v = CORE.validate(readForm());
    if (!v.ok) { showError(v); return; }
    clearError();
    var rec = { p: v.p, r: CORE.draw(v.p), t: Date.now() };   // 결과 먼저 — 연출은 이 값으로 멈춘다
    if (shared) { clearSharedHash(); setShared(false); }
    last = rec;
    lock(true);
    track('start');
    showResult(rec, true);
    later(function () { smoothTo(els.card, 70); }, 20);
  }
  function again() {
    if (busy) return;
    draw();
  }
  function drawOwn() {
    if (busy) return;
    clearSharedHash();
    setShared(false);
    draw();
  }
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) {
      els.error.textContent = E.badLink;
      els.error.hidden = false;
      return false;
    }
    clearTimers();
    lock(false);
    fillForm(rec.p);
    last = rec;
    setShared(true);
    showResult(rec, false);
    return true;
  }

  // ---------------------------------------------------------------- 복사 · 공유
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
  function shareUrl(rec) { return baseUrl().split('#')[0] + '#d=' + CORE.encodeShare(rec); }

  if (window.setShareData) {
    window.setShareData(function () {
      if (!last) return { title: R.shareTitle, text: R.shareTitle, url: baseUrl() };
      var vars = { nums: listText(last.r, 10), min: num(last.p.a), max: num(last.p.b), label: last.p.l };
      return { title: R.shareTitle, text: fmt(last.p.l ? R.shareTextLabel : R.shareText, vars), url: shareUrl(last) };
    });
  }
  setShared(false);

  // ---------------------------------------------------------------- 이벤트
  els.presets.forEach(function (b) { b.addEventListener('click', function () { setPreset(b.getAttribute('data-preset')); }); });
  [els.min, els.max].forEach(function (el) { el.addEventListener('input', function () { updatePresets(); clearError(); }); });
  [els.count, els.exclude].forEach(function (el) { el.addEventListener('input', clearError); });
  els.dec.addEventListener('click', function () { stepCount(-1); });
  els.inc.addEventListener('click', function () { stepCount(1); });
  els.moreBtn.addEventListener('click', function () { setMore(els.more.hidden); });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); draw(); });
  els.form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') { e.preventDefault(); draw(); }
  });
  els.draw.addEventListener('click', draw);
  els.copy.addEventListener('click', function () {
    if (!last) return;
    copyText((last.p.l ? last.p.l + ': ' : '') + last.r.join(', '), R.copied);
  });
  els.link.addEventListener('click', function () { if (last) copyText(shareUrl(last), R.linkCopied); });
  els.historyClear.addEventListener('click', function () { history = []; saveHistory(); renderHistory(); });
  window.addEventListener('hashchange', function () { if (!busy) loadShared(); });

  window.RANDNUM_APP = {
    busy: function () { return busy; },
    last: function () { return last ? { p: JSON.parse(JSON.stringify(last.p)), r: last.r.slice(), t: last.t } : null; },
    shared: function () { return shared; },
    history: function () { return JSON.parse(JSON.stringify(history)); }
  };

  renderHistory();   // 기록 카드는 결과 영역(#result) 안 — 결과가 처음 보일 때 함께 보인다
  updatePresets();
  loadShared();
})();
