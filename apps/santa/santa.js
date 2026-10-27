/* apps/santa/santa.js — 마니또 뽑기: 시작 화면(모임·이름·예산·교환일·제외 쌍·2명끼리 막기) → 뽑기 → 확인 화면
 *   (휴대폰 돌리기: 자기 이름 → "정말 ○○님인가요?" → 선물 상자 열기 → "확인했어요, 가리기" → 이름 회색)
 *   + 진행자 도구(개인 링크 · 경고 뒤 전체 결과 · 다 확인했어요 · 새로 뽑기 · 명단 고치기) → 완료 카드 → 공통 끝 화면.
 * 개인 링크(#d=…)로 열면 그 사람의 선물 상자 하나만 보인다.
 * 로직은 santa-core.js(SANTA_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 뽑기는 이 기기에서 crypto 로(조건을 만족하는 배정 중 균등). 누가 누구를 뽑았는지는 기본으로 아무에게도 보이지 않는다.
 * 기록: 뽑을 때마다 track('start') 한 번, 모두 확인했을 때·"다 확인했어요"·개인 링크 상자를 열었을 때 track('done') 한 번(markDone).
 * 저장: 명단·제외 쌍·예산 등 설정(mg_santa_v1)과 이번 뽑기(mg_santa_draw_v1, 휴대폰을 돌리는 동안만 — 새로 뽑기·명단 고치기에서 지움).
 *       localStorage(try/catch). 이름은 서버로 보내지 않는다.
 * 움직임 줄이기(prefers-reduced-motion)면 상자 뚜껑 애니메이션 없이 바로 열린다.
 */
(function () {
  'use strict';

  var CORE = window.SANTA_CORE;
  var I = window.PAGE_I18N || {};
  var LANG = I.lang || 'en';
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_santa_v1';
  var DRAW = 'mg_santa_draw_v1';
  var OPEN_MS = REDUCED ? 0 : 650;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), play: $('screen-play'), form: $('sn-form'), event: $('event'), names: $('names'), namesCount: $('names-count'),
    budget: $('budget'), date: $('date'), exclA: $('excl-a'), exclB: $('excl-b'), exclAdd: $('excl-add'), exclList: $('excl-list'), noPairs: $('no-pairs'),
    error: $('error'), draw: $('draw-btn'),
    evTitle: $('ev-title'), evMeta: $('ev-meta'), pass: $('pass'), progress: $('progress'), who: $('who-list'),
    secret: $('secret'), secretFor: $('secret-for'), gift: $('gift-btn'), openHint: $('open-hint'), secretBody: $('secret-body'),
    secretName: $('secret-name'), secretMeta: $('secret-meta'), hide: $('hide-btn'),
    org: $('org'), linksBtn: $('links-btn'), doneBtn: $('done-btn'), allBtn: $('all-btn'), redraw: $('redraw-btn'), edit: $('edit-btn'),
    links: $('links'), linksList: $('links-list'), all: $('all'), allList: $('all-list'), allHide: $('all-hide'),
    ask: $('ask'), askText: $('ask-text'), askSub: $('ask-sub'), askYes: $('ask-yes'), askNo: $('ask-no'), live: $('live'),
    done: $('done'), doneTitle: $('done-title'), doneText: $('done-text'), doneMeta: $('done-meta'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var settings = { event: '', names: '', budget: '', date: '', pairs: [], noPairs: false };
  var cur = null;          // 이번 뽑기 (CORE.sanitizeDraw 모양) — 휴대폰 돌리기 모드
  var link = null;         // 개인 링크로 연 경우 { e, g, r, b, t }
  var mode = 'setup';      // setup | pass | secret | link
  var viewer = -1;         // 지금 상자를 보는 사람
  var doneTracked = false; // 이번 뽑기(또는 링크)에서 done 을 셌는가
  var askFn = null;
  var lastFocus = null;
  var openTimer = 0;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, key) { return vars[key] != null ? vars[key] : m; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function dateText(d) {
    if (!d) return '';
    try { return new Intl.DateTimeFormat(LANG, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(d + 'T00:00:00Z')); } catch (e) { return d; }
  }
  function metaText(budget, date) {
    var parts = [];
    if (budget) parts.push(fmt(U.budgetChip, { b: budget }));
    if (date) parts.push(fmt(U.dateChip, { d: dateText(date) }));
    return parts.join('   ');
  }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function loadSaved() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (o && typeof o === 'object') {
        return {
          event: typeof o.event === 'string' ? o.event.slice(0, CORE.MAX_EVENT) : '',
          names: typeof o.names === 'string' ? o.names.slice(0, 900) : '',
          budget: typeof o.budget === 'string' ? o.budget.slice(0, CORE.MAX_BUDGET) : '',
          date: CORE.cleanDate(o.date),
          pairs: Array.isArray(o.pairs) ? o.pairs.filter(function (p) { return Array.isArray(p) && p.length === 2 && typeof p[0] === 'string' && typeof p[1] === 'string'; }).slice(0, CORE.MAX_EXCL) : [],
          noPairs: !!o.noPairs
        };
      }
    } catch (e) { /* noop */ }
    return null;
  }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify(settings)); } catch (e) { /* noop */ }
  }
  function loadDraw() {
    try { return CORE.sanitizeDraw(JSON.parse(window.localStorage.getItem(DRAW) || 'null')); } catch (e) { return null; }
  }
  function saveDraw() {
    try { if (cur) window.localStorage.setItem(DRAW, JSON.stringify(cur)); } catch (e) { /* noop */ }
  }
  function clearDraw() {
    cur = null;
    try { window.localStorage.removeItem(DRAW); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 시작 화면
  function readForm() {
    settings.event = els.event.value;
    settings.names = els.names.value;
    settings.budget = els.budget.value;
    settings.date = CORE.cleanDate(els.date.value);
  }
  function currentNames() { return CORE.parseNames(els.names.value).names; }
  function updateCount() {
    var n = currentNames().length;
    els.namesCount.textContent = n ? fmt(U.namesCount, { n: n }) : '';
    els.namesCount.classList.toggle('is-bad', n > CORE.MAX_PEOPLE || (n > 0 && n < CORE.MIN_PEOPLE));
  }
  function fillSelect(sel, names, keep) {
    sel.innerHTML = '';
    var o0 = el('option', null, U.exclPick);
    o0.value = '';
    sel.appendChild(o0);
    names.forEach(function (n) { var o = el('option', null, n); o.value = n; sel.appendChild(o); });
    sel.value = names.indexOf(keep) >= 0 ? keep : '';
  }
  function renderExcl() {
    var names = currentNames();
    fillSelect(els.exclA, names, els.exclA.value);
    fillSelect(els.exclB, names, els.exclB.value);
    var valid = CORE.cleanPairs(settings.pairs, names);
    els.exclList.innerHTML = '';
    valid.forEach(function (p) {
      var li = el('li', 'sn-excl-item');
      li.appendChild(el('span', 'sn-excl-names', p[0] + ' ↔ ' + p[1]));
      var x = el('button', 'sn-excl-del', '×');
      x.type = 'button';
      x.setAttribute('aria-label', fmt(U.exclRemove, { a: p[0], b: p[1] }));
      x.addEventListener('click', function () {
        settings.pairs = settings.pairs.filter(function (q) { return !((q[0] === p[0] && q[1] === p[1]) || (q[0] === p[1] && q[1] === p[0])); });
        save();
        renderExcl();
      });
      li.appendChild(x);
      els.exclList.appendChild(li);
    });
    els.exclList.hidden = !valid.length;
  }
  function addPair() {
    clearError();
    var names = currentNames();
    if (names.length < 2) return showError(E.exclNeed);
    var a = els.exclA.value, b = els.exclB.value;
    if (!a || !b || a === b) return showError(E.exclSame);
    var valid = CORE.cleanPairs(settings.pairs, names);
    if (valid.some(function (p) { return (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a); })) return showError(E.exclDup);
    if (valid.length >= CORE.MAX_EXCL) return showError(E.exclMax);
    settings.pairs = valid.concat([[a, b]]);
    save();
    els.exclA.value = '';
    els.exclB.value = '';
    renderExcl();
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(msg) { els.error.textContent = msg; els.error.hidden = false; scrollTo(els.error, 'center'); }

  // ---------------------------------------------------------------- 뽑기
  function doDraw() {
    closeAsk();
    if (mode === 'setup') readForm();
    var v = CORE.validate({ event: settings.event, names: settings.names, budget: settings.budget, date: settings.date, pairs: settings.pairs, noPairs: settings.noPairs });
    if (!v.ok) { backToSetup(); showError(fmt(E[v.error] || E.namesTooFew, { n: v.n })); return; }
    var res = CORE.draw(v.cfg);
    if (!res.ok) { backToSetup(); showError(E[res.error] || E.impossible); return; }
    clearError();
    settings.pairs = v.cfg.pairs;
    save();
    link = null;
    clearHash();
    cur = { v: 1, event: v.cfg.event, names: v.cfg.names, budget: v.cfg.budget, date: v.cfg.date, pairs: v.cfg.pairs, noPairs: v.cfg.noPairs, a: res.a, checked: v.cfg.names.map(function () { return false; }), done: false };
    saveDraw();
    doneTracked = false;
    track('start');
    showPass();
    els.live.textContent = U.liveDrawn;
    scrollTo(els.play, 'start');
  }
  function markDone() {
    if (doneTracked) return;
    doneTracked = true;
    track('done');
  }

  // ---------------------------------------------------------------- 확인 화면 (휴대폰 돌리기)
  function renderEvent(ev, budget, date) {
    els.evTitle.textContent = ev || U.eventDefault;
    var m = metaText(budget, date);
    els.evMeta.textContent = m;
    els.evMeta.hidden = !m;
  }
  function resetSecret() {
    clearTimeout(openTimer);
    els.gift.classList.remove('is-open');
    els.gift.disabled = false;
    els.gift.hidden = false;
    els.openHint.hidden = false;
    els.secretBody.hidden = true;
    els.secretName.textContent = '';
    els.secretMeta.textContent = '';
  }
  function showPass() {
    mode = 'pass';
    viewer = -1;
    els.setup.hidden = true;
    els.play.hidden = false;
    renderEvent(cur.event, cur.budget, cur.date);
    resetSecret();
    els.secret.hidden = true;
    els.pass.hidden = false;
    els.org.hidden = false;
    els.links.hidden = true;
    hideAll();
    renderWho();
    if (cur.done) showDone(false); else els.done.hidden = true;
  }
  function renderWho() {
    els.who.innerHTML = '';
    cur.names.forEach(function (n, i) {
      var b = el('button', 'sn-who-btn' + (cur.checked[i] ? ' is-seen' : ''));
      b.type = 'button';
      b.setAttribute('role', 'listitem');
      b.appendChild(el('span', 'sn-who-name', n));
      if (cur.checked[i]) {
        b.appendChild(el('span', 'sn-who-mark', '✓'));
        b.setAttribute('aria-label', n + ' · ' + U.seenMark);
      }
      b.addEventListener('click', function () { tapName(i); });
      els.who.appendChild(b);
    });
    var p = CORE.progress(cur.checked, cur.names.length);
    els.progress.textContent = fmt(U.progress, { k: p.k, n: p.n });
  }
  function tapName(i) {
    if (mode !== 'pass' || !cur) return;
    var name = cur.names[i];
    var seen = cur.checked[i];
    ask(fmt(seen ? U.againQ : U.confirmQ, { name: name }), fmt(seen ? U.againSub : U.confirmSub, { name: name }), U.confirmYes, U.cancel, function () { openSecret(i); });
  }
  function openSecret(i) {
    mode = 'secret';
    viewer = i;
    resetSecret();
    els.pass.hidden = true;
    els.org.hidden = true;
    els.done.hidden = true;
    els.secretFor.textContent = fmt(U.secretFor, { name: cur.names[i] });
    els.hide.hidden = false;
    els.secret.hidden = false;
    scrollTo(els.secret, 'start');
    focusSoft(els.gift);
  }
  function openGift() {
    if (els.gift.disabled) return;
    var who, meta;
    if (mode === 'secret' && cur && viewer >= 0) { who = cur.names[cur.a[viewer]]; meta = metaText(cur.budget, cur.date); }
    else if (mode === 'link' && link) { who = link.r; meta = metaText(link.b, link.t); }
    else return;
    els.gift.disabled = true;
    els.gift.classList.add('is-open');
    openTimer = setTimeout(function () {
      els.gift.hidden = true;
      els.openHint.hidden = true;
      els.secretName.textContent = who;
      els.secretMeta.textContent = meta;
      els.secretMeta.hidden = !meta;
      els.secretBody.hidden = false;
      if (mode === 'link') { markDone(); showDone(true); }
      else focusSoft(els.hide);
    }, OPEN_MS);
  }
  function hideSecret() {
    if (mode !== 'secret' || !cur) return;
    cur.checked[viewer] = true;
    saveDraw();
    resetSecret();
    els.secret.hidden = true;
    showPass();
    if (CORE.progress(cur.checked, cur.names.length).all) finish();
    else scrollTo(els.play, 'start');
  }
  function finish() {
    if (!cur) return;
    cur.done = true;
    saveDraw();
    markDone();
    showDone(false);
    scrollTo(els.done, 'start');
  }
  function showDone(isLink) {
    els.doneTitle.textContent = isLink ? R.linkDoneTitle : R.doneTitle;
    els.doneText.textContent = isLink ? R.linkDoneText : R.doneText;
    var m = isLink ? metaText(link.b, link.t) : metaText(cur.budget, cur.date);
    els.doneMeta.textContent = m;
    els.doneMeta.hidden = !m;
    els.done.hidden = false;
  }

  // ---------------------------------------------------------------- 진행자 도구
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function personLink(i) {
    var enc = CORE.encodeLink({ e: cur.event, g: cur.names[i], r: cur.names[cur.a[i]], b: cur.budget, t: cur.date });
    return enc ? baseUrl() + '#d=' + enc : '';
  }
  function copyText(text, done) {
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
  function renderLinks() {
    els.linksList.innerHTML = '';
    cur.names.forEach(function (n, i) {
      var li = el('li', 'sn-link-row');
      li.appendChild(el('span', 'sn-link-name', n));
      var b = el('button', 'sn-mini sn-mini-strong', U.linkCopy);
      b.type = 'button';
      b.addEventListener('click', function () {
        var u = personLink(i);
        if (!u) return;
        copyText(fmt(U.linkMsg, { name: n, url: u }), function () {
          b.textContent = U.linkCopied;
          li.classList.add('is-copied');
          if (window.toast) window.toast(fmt(U.toastCopied, { name: n }));
        });
      });
      li.appendChild(b);
      els.linksList.appendChild(li);
    });
  }
  function toggleLinks() {
    if (!cur) return;
    var show = els.links.hidden;
    if (show) renderLinks(); else els.linksList.innerHTML = '';
    els.links.hidden = !show;
    els.linksBtn.setAttribute('aria-expanded', String(show));
    if (show) scrollTo(els.links, 'start');
  }
  function showAll() {
    closeAsk();
    if (!cur) return;
    els.allList.innerHTML = '';
    cur.names.forEach(function (n, i) {
      var li = el('li', 'sn-all-row');
      li.appendChild(el('span', 'sn-all-g', n));
      li.appendChild(el('span', 'sn-all-arrow', '→'));
      li.appendChild(el('span', 'sn-all-r', cur.names[cur.a[i]]));
      els.allList.appendChild(li);
    });
    els.all.hidden = false;
    scrollTo(els.all, 'start');
  }
  function hideAll() { els.all.hidden = true; els.allList.innerHTML = ''; }

  // ---------------------------------------------------------------- 확인 창 (#ask)
  function ask(text, sub, yes, no, fn) {
    lastFocus = document.activeElement;
    askFn = fn;
    els.askText.textContent = text;
    els.askSub.textContent = sub || '';
    els.askSub.hidden = !sub;
    els.askYes.textContent = yes;
    els.askNo.textContent = no;
    els.ask.hidden = false;
    focusSoft(els.askYes);
  }
  function closeAsk() {
    if (els.ask.hidden) return;
    els.ask.hidden = true;
    askFn = null;
    if (lastFocus && document.contains(lastFocus)) focusSoft(lastFocus);
  }

  // ---------------------------------------------------------------- 화면 전환
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function backToSetup() {
    closeAsk();
    resetSecret();
    mode = 'setup';
    viewer = -1;
    els.play.hidden = true;
    els.secret.hidden = true;
    els.done.hidden = true;
    els.setup.hidden = false;
    hideAll();
    renderExcl();
    updateCount();
    scrollTo(els.setup, 'start');
  }
  function startOwn() {
    // 링크로 열었던 사람이 직접 마니또를 뽑으려 할 때: 링크를 지우고 시작 화면으로
    link = null;
    clearHash();
    backToSetup();
    focusSoft(els.names);
  }
  function loadLink() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var o = CORE.decodeLink(window.location.hash.slice(3));
    if (!o) { clearHash(); backToSetup(); showError(E.badLink); return true; }
    link = o;
    doneTracked = false;
    mode = 'link';
    viewer = -1;
    els.setup.hidden = true;
    els.play.hidden = false;
    renderEvent(o.e, o.b, o.t);
    els.pass.hidden = true;
    els.org.hidden = true;
    els.done.hidden = true;
    resetSecret();
    els.secretFor.textContent = fmt(U.linkFor, { name: o.g });
    els.hide.hidden = true;
    els.secret.hidden = false;
    return true;
  }
  function retry() {
    if (mode === 'link' || !cur) { startOwn(); return; }
    doDraw();
  }

  if (window.setShareData) {
    window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: retry });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  var saveTimer = null;
  function onInput() {
    clearError();
    updateCount();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { readForm(); save(); renderExcl(); }, 250);
  }
  [els.event, els.names, els.budget].forEach(function (x) { x.addEventListener('input', onInput); });
  els.date.addEventListener('change', function () { readForm(); save(); });
  els.noPairs.addEventListener('change', function () { settings.noPairs = els.noPairs.checked; save(); });
  els.exclAdd.addEventListener('click', addPair);
  els.draw.addEventListener('click', doDraw);
  els.gift.addEventListener('click', openGift);
  els.hide.addEventListener('click', hideSecret);
  els.linksBtn.addEventListener('click', toggleLinks);
  els.doneBtn.addEventListener('click', finish);
  els.allBtn.addEventListener('click', function () { if (els.all.hidden) ask(U.allQ, U.allSub, U.allYes, U.cancel, showAll); else hideAll(); });
  els.allHide.addEventListener('click', hideAll);
  els.redraw.addEventListener('click', function () { ask(U.redrawQ, U.redrawSub, U.redrawYes, U.cancel, doDraw); });
  els.edit.addEventListener('click', function () { ask(U.editQ, U.editSub, U.editYes, U.cancel, function () { clearDraw(); backToSetup(); focusSoft(els.names); }); });
  els.askYes.addEventListener('click', function () { var f = askFn; closeAsk(); if (f) f(); });
  els.askNo.addEventListener('click', closeAsk);
  els.ask.addEventListener('click', function (e) { if (e.target === els.ask) closeAsk(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAsk(); });
  window.addEventListener('hashchange', function () { if (mode !== 'secret') loadLink(); });

  // 검사용 읽기 전용 핸들 (배정은 내주지 않는다)
  window.SANTA_APP = {
    mode: function () { return mode; },
    names: function () { return cur ? cur.names.slice() : []; },
    checked: function () { return cur ? cur.checked.slice() : []; },
    hasDraw: function () { return !!cur; },
    linkFor: function (i) { return cur ? personLink(i) : ''; }
  };

  var saved = loadSaved();
  if (saved) settings = saved;
  els.event.value = settings.event;
  els.names.value = settings.names;
  els.budget.value = settings.budget;
  els.date.value = settings.date;
  els.noPairs.checked = settings.noPairs;
  updateCount();
  renderExcl();
  if (!loadLink()) {
    cur = loadDraw();
    if (cur) { doneTracked = cur.done; showPass(); }
  }
})();
