/* apps/lunch/lunch.js — 시작(티징) → 끼니·기분 고르기 + 슬롯머신 릴 → 뽑힌 메뉴 하나(+ 공통 끝 화면)
 * 후보·뽑기는 lunch-core.js(LUNCH_CORE, 언어 무관), 문구와 메뉴 목록은 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 고르기 화면 뽑기 버튼 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 보일 때만). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 뽑기를 누를 때 track('start') 한 번, 결과가 보일 때 track('done') 한 번(다시 뽑기마다 또).
 * 숫자: 서버 숫자는 쓰지 않는다(보이는 숫자는 후보 개수·제외 개수뿐).
 * 저장: 마지막 끼니·기분 태그는 이 브라우저 localStorage(lunch_last_v1)에만. 제외한 메뉴는 이 페이지를 연 동안만(저장하지 않음).
 * 디버그/검사용 읽기 전용 핸들: window.LUNCH_APP (busy(), result(), pool(), excluded(), state())
 */
(function () {
  'use strict';

  var CORE = window.LUNCH_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.pick || {};
  var R = UI.result || {};
  var MENUS = CORE.parseMenus(UI.menus);
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LS_KEY = 'lunch_last_v1';
  var SPIN_MS = 2100;     // 릴이 돌아가는 시간
  var HOLD_MS = 700;      // 멈춘 뒤 결과 화면으로 넘어가기 전 잠깐
  var CELLS = 24;         // 릴 띠 칸 수

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), pick: $('screen-pick'), result: $('screen-result'),
    startBtn: $('start-btn'), meals: document.querySelectorAll('[data-meal]'), tags: document.querySelectorAll('[data-tag]'),
    count: $('cand-count'), note: $('pick-note'), exLine: $('ex-line'), exCount: $('ex-count'), exReset: $('ex-reset'),
    reel: $('reel'), strip: $('reel-strip'), spin: $('spin-btn'),
    resEmoji: $('res-emoji'), resName: $('res-name'), resMeal: $('res-meal'),
    again: $('again-btn'), exclude: $('exclude-btn'), change: $('change-btn'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var state = { meal: CORE.defaultMeal(new Date().getHours()), tags: [] };
  var excluded = {};
  var current = -1;
  var busy = false;
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 사생활 보호 모드 등 */ } }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function toast(m) { if (window.toast) window.toast(m); }
  var plural = null;
  try { plural = new Intl.PluralRules(UI.lang || 'en'); } catch (e) { /* noop */ }
  function countText(n) {
    var C = UI.count || {};
    var cat = plural ? plural.select(n) : (n === 1 ? 'one' : 'other');
    return fmt(C[cat] || C.other, { n: n });
  }
  function excludedN() { return Object.keys(excluded).length; }
  function poolNow() { return CORE.pool(MENUS, state.meal, state.tags, excluded); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.pick.hidden = name !== 'pick';
    els.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 저장
  function save() { lsSet(LS_KEY, JSON.stringify({ meal: state.meal, tags: state.tags })); }
  function load() {
    try {
      var s = JSON.parse(lsGet(LS_KEY) || 'null');
      if (!s || typeof s !== 'object') return;
      if (CORE.MEALS.indexOf(s.meal) >= 0) state.meal = s.meal;
      if (Array.isArray(s.tags)) state.tags = s.tags.filter(function (t, i) { return CORE.TAGS.indexOf(t) >= 0 && s.tags.indexOf(t) === i; });
    } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 릴
  function cellHtml(m) {
    return '<div class="lc-cell"><span class="lc-cell-emoji" aria-hidden="true">' + m.emoji + '</span><span class="lc-cell-name"></span></div>';
  }
  function fillStrip(items) {
    els.strip.innerHTML = items.map(function (it) { return cellHtml(it.m); }).join('');
    var names = els.strip.querySelectorAll('.lc-cell-name');
    items.forEach(function (it, i) { names[i].textContent = it.m.name; });
  }
  function idleReel() {
    els.reel.classList.remove('is-landed', 'is-spinning');
    els.strip.style.transition = 'none';
    els.strip.style.transform = 'translateY(0)';
    fillStrip([{ m: { emoji: '🍽️', name: P.idle || '?' } }]);
  }

  // ---------------------------------------------------------------- 고르기 화면
  function refresh() {
    els.meals.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-meal') === state.meal)); });
    els.tags.forEach(function (b) { b.setAttribute('aria-pressed', String(state.tags.indexOf(b.getAttribute('data-tag')) >= 0)); });
    var list = poolNow();
    els.count.textContent = countText(list.length);
    var n = excludedN();
    els.exLine.hidden = !n;
    els.exCount.textContent = fmt(P.skipped, { n: n });
    var note = '';
    if (!list.length) note = CORE.pool(MENUS, state.meal, state.tags, null).length ? P.noneLeft : P.none;
    els.note.textContent = note;
    els.note.hidden = !note;
    els.spin.disabled = !list.length || busy;
  }
  function setMeal(m) {
    if (busy || state.meal === m) return;
    state.meal = m;
    save();
    refresh();
  }
  function toggleTag(t) {
    if (busy) return;
    var i = state.tags.indexOf(t);
    if (i >= 0) state.tags.splice(i, 1); else state.tags.push(t);
    save();
    refresh();
  }

  // ---------------------------------------------------------------- 뽑기
  function spin() {
    if (busy) return;
    var list = poolNow();
    if (!list.length) { show('pick'); refresh(); return; }
    clearTimers();
    show('pick');
    current = CORE.pickOne(list);      // 결과는 먼저 정해지고, 릴은 그곳에 멈추는 연출
    busy = true;
    track('start');
    refresh();
    var m = MENUS[current];
    var mealPool = CORE.pool(MENUS, state.meal, [], null);
    var idx = REDUCED ? [current] : CORE.strip(mealPool, current, CELLS);
    fillStrip(idx.map(function (i) { return { m: MENUS[i] }; }));
    els.reel.classList.remove('is-landed');
    els.reel.classList.add('is-spinning');
    els.strip.style.transition = 'none';
    els.strip.style.transform = 'translateY(0)';
    if (!REDUCED) {
      var h = els.strip.firstElementChild.getBoundingClientRect().height;
      void els.strip.offsetHeight;
      els.strip.style.transition = 'transform ' + SPIN_MS + 'ms cubic-bezier(0.15, 0.75, 0.2, 1)';
      els.strip.style.transform = 'translateY(' + (-(idx.length - 1) * h) + 'px)';
    }
    later(function () {
      els.reel.classList.remove('is-spinning');
      els.reel.classList.add('is-landed');
      later(function () { showResult(m); }, REDUCED ? 60 : HOLD_MS);
    }, REDUCED ? 60 : SPIN_MS + 80);
  }

  function showResult(m) {
    els.resEmoji.textContent = m.emoji;
    els.resName.textContent = m.name;
    els.resMeal.textContent = (P.meals || {})[state.meal] || '';
    busy = false;
    show('result');
    track('done');
    refresh();
  }

  function again() { if (!busy) spin(); }
  function exclude() {
    if (busy || current < 0) return;
    var name = MENUS[current].name;
    excluded[current] = true;
    toast(fmt(R.excluded, { name: name }));
    if (poolNow().length) spin();
    else { current = -1; idleReel(); show('pick'); refresh(); }
  }
  function change() { if (busy) return; idleReel(); show('pick'); refresh(); }
  function resetExcluded() { excluded = {}; refresh(); }

  if (window.setShareData) {
    window.setShareData(function () {
      var base = window.location.href.split('#')[0];
      return {
        title: R.shareTitle,
        text: current >= 0 ? fmt(R.shareText, { name: MENUS[current].name }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl(base) : base
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: again });

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { refresh(); show('pick'); });
  els.meals.forEach(function (b) { b.addEventListener('click', function () { setMeal(b.getAttribute('data-meal')); }); });
  els.tags.forEach(function (b) { b.addEventListener('click', function () { toggleTag(b.getAttribute('data-tag')); }); });
  els.exReset.addEventListener('click', resetExcluded);
  els.spin.addEventListener('click', spin);
  els.again.addEventListener('click', again);
  els.exclude.addEventListener('click', exclude);
  els.change.addEventListener('click', change);

  window.LUNCH_APP = {
    busy: function () { return busy; },
    result: function () { return current >= 0 ? current : null; },
    pool: poolNow,
    excluded: function () { return Object.keys(excluded).map(Number); },
    state: function () { return { meal: state.meal, tags: state.tags.slice() }; }
  };

  load();
  idleReel();
  refresh();
  show('start');
})();
