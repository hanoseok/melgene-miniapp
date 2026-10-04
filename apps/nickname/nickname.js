/* apps/nickname/nickname.js — 시작(티징) → 분위기·이름 고르기 → 닉네임 하나 + 복사(+ 공통 끝 화면)
 * 조합·뽑기는 nickname-core.js(NICKNAME_CORE, 언어 무관), 문구와 단어 목록은 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 고르기 화면 만들기 버튼 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 보일 때만). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 만들기를 누를 때 track('start') 한 번, 결과가 확정될 때 track('done') 한 번(다시 뽑기마다 또).
 * 숫자: 서버 숫자는 쓰지 않는다. 입력한 이름은 이 브라우저 안에서만 쓰고 저장·전송하지 않는다.
 * 저장: 마지막 분위기·숫자 붙이기만 localStorage(nickname_last_v1).
 * 디버그/검사용 읽기 전용 핸들: window.NICKNAME_APP (busy(), result(), state())
 */
(function () {
  'use strict';

  var CORE = window.NICKNAME_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.make || {};
  var R = UI.result || {};
  var WORDS = UI.words || {};
  var STYLE = UI.style || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LS_KEY = 'nickname_last_v1';
  var FRAMES = 9;        // 글자가 휘리릭 바뀌는 횟수
  var FRAME_MS = 70;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), make: $('screen-make'), result: $('screen-result'),
    startBtn: $('start-btn'), moods: document.querySelectorAll('[data-mood]'), name: $('name-input'),
    numToggle: $('num-toggle'), makeBtn: $('make-btn'), pool: $('pool-count'),
    nick: $('nick-text'), nickMood: $('nick-mood'), copy: $('copy-btn'), again: $('again-btn'), change: $('change-btn'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var state = { mood: 'cute', numbers: false };
  var current = '';
  var busy = false;
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 사생활 보호 모드 등 */ } }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function toast(m) { if (window.toast) window.toast(m); }
  function opts() { return { mood: state.mood, name: els.name.value, numbers: state.numbers, style: STYLE }; }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.make.hidden = name !== 'make';
    els.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 저장
  function save() { lsSet(LS_KEY, JSON.stringify({ mood: state.mood, numbers: state.numbers })); }
  function load() {
    try {
      var s = JSON.parse(lsGet(LS_KEY) || 'null');
      if (!s || typeof s !== 'object') return;
      if (CORE.MOODS.indexOf(s.mood) >= 0) state.mood = s.mood;
      state.numbers = !!s.numbers;
    } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 고르기 화면
  function refresh() {
    els.moods.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-mood') === state.mood)); });
    els.numToggle.setAttribute('aria-pressed', String(state.numbers));
    els.pool.textContent = fmt(P.poolCount, { n: CORE.combos(WORDS, state.mood) });
    els.makeBtn.disabled = busy;
  }
  function setMood(m) {
    if (busy || state.mood === m) return;
    state.mood = m;
    save();
    refresh();
  }
  function toggleNumbers() {
    if (busy) return;
    state.numbers = !state.numbers;
    save();
    refresh();
  }

  // ---------------------------------------------------------------- 만들기
  function generate() {
    if (busy) return;
    clearTimers();
    var r = CORE.generate(WORDS, opts(), null, current);
    if (!r) return;
    busy = true;
    track('start');
    show('result');
    els.nickMood.textContent = (P.moods || {})[state.mood] || '';
    els.nick.classList.remove('is-final');
    els.nick.classList.add('is-spinning');
    setButtons(true);
    var n = REDUCED ? 0 : FRAMES;
    for (var i = 0; i < n; i++) {
      later(function () { var f = CORE.make(WORDS, opts()); if (f) els.nick.textContent = f.text; }, i * FRAME_MS);
    }
    later(function () {
      current = r.text;
      els.nick.textContent = current;
      els.nick.classList.remove('is-spinning');
      els.nick.classList.add('is-final');
      busy = false;
      setButtons(false);
      track('done');
    }, n * FRAME_MS + 20);
  }
  function setButtons(off) {
    els.copy.disabled = off;
    els.again.disabled = off;
    els.change.disabled = off;
  }

  function copy() {
    if (!current) return;
    var done = function () { toast(R.copied); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = current;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast(R.copyFail); }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(current).then(done, fallback);
    else fallback();
  }
  function change() { if (busy) return; show('make'); refresh(); }

  if (window.setShareData) {
    window.setShareData(function () {
      var base = window.location.href.split('#')[0];
      return {
        title: R.shareTitle,
        text: current ? fmt(R.shareText, { nick: current }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl(base) : base
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: generate });

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { refresh(); show('make'); });
  els.moods.forEach(function (b) { b.addEventListener('click', function () { setMood(b.getAttribute('data-mood')); }); });
  els.numToggle.addEventListener('click', toggleNumbers);
  els.makeBtn.addEventListener('click', generate);
  els.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); generate(); } });
  els.copy.addEventListener('click', copy);
  els.again.addEventListener('click', generate);
  els.change.addEventListener('click', change);

  window.NICKNAME_APP = {
    busy: function () { return busy; },
    result: function () { return current || null; },
    state: function () { return { mood: state.mood, numbers: state.numbers }; }
  };

  load();
  refresh();
  show('start');
})();
