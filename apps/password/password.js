/* apps/password/password.js — 한 화면 비밀번호 생성기: 종류(비밀번호/패스프레이즈)·옵션 → 만들기 → 결과(1개 또는 5개, 복사) + 강도·깨는 시간 (+ 공통 끝 화면)
 * 로직은 password-core.js(PASSWORD_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 값은 먼저 crypto 로 만들고, 글자가 잠깐 뒤섞이다 멈추는 연출은 보여 주기만 한다. 움직임 줄이기(prefers-reduced-motion)면 바로.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(결과·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 만들기를 누를 때 track('start') 한 번, 결과가 다 보일 때 track('done') 한 번(다시 만들 때마다 또).
 * 보안: 만든 비밀번호는 화면(textContent)과 사용자가 누른 복사(클립보드)에만. 저장소·주소·공유 문구·서버·통계에 넣지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.PASSWORD_APP (busy(), last(), options())
 */
(function () {
  'use strict';

  var CORE = window.PASSWORD_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SCRAMBLE_MS = 520;
  var SCRAMBLE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789#$%&*+=?@';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('pw-form'), modes: document.querySelectorAll('[data-mode]'), counts: document.querySelectorAll('[data-count]'), seps: document.querySelectorAll('[data-sep]'),
    optPw: $('opt-password'), optPh: $('opt-passphrase'), length: $('length'), lengthOut: $('length-out'), words: $('words'), wordsOut: $('words-out'),
    upper: $('t-upper'), lower: $('t-lower'), digits: $('t-digits'), symbols: $('t-symbols'), similar: $('similar'), capitalize: $('capitalize'), number: $('number'),
    error: $('error'), gen: $('gen-btn'), result: $('result'), card: $('result-card'), title: $('res-title'), list: $('pw-list'),
    meter: $('meter'), word: $('meter-word'), bits: $('meter-bits'), crack: $('meter-crack'), tip: $('meter-tip'), live: $('live'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var state = { mode: CORE.DEFAULTS.mode, count: CORE.DEFAULTS.count, sep: CORE.DEFAULTS.sep };
  var busy = false;
  var last = null;   // { p, list, bits } — 이 페이지 메모리에만
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); timers = []; }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  function numText(n, opts) {
    try { return new Intl.NumberFormat(I.lang || 'en', opts || {}).format(n); } catch (e) { return String(n); }
  }

  // ---------------------------------------------------------------- 옵션
  function options() {
    return CORE.normalize({
      mode: state.mode, count: state.count, sep: state.sep,
      length: els.length.value, upper: els.upper.checked, lower: els.lower.checked, digits: els.digits.checked, symbols: els.symbols.checked,
      similar: els.similar.checked, words: els.words.value, capitalize: els.capitalize.checked, number: els.number.checked
    });
  }
  function radio(list, attr, val) { list.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(val))); }); }
  function setMode(m) {
    if (busy) return;
    state.mode = m === 'passphrase' ? 'passphrase' : 'password';
    radio(els.modes, 'data-mode', state.mode);
    els.optPw.hidden = state.mode !== 'password';
    els.optPh.hidden = state.mode !== 'passphrase';
    clearError();
  }
  function setCount(n) { if (busy) return; state.count = Number(n) === 5 ? 5 : 1; radio(els.counts, 'data-count', state.count); }
  function setSep(k) { if (busy) return; if (CORE.SEPARATORS[k] != null) { state.sep = k; radio(els.seps, 'data-sep', k); } }
  function syncOutputs() {
    els.lengthOut.textContent = els.length.value;
    els.wordsOut.textContent = els.words.value;
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(key) {
    els.error.textContent = U[key] || U.needType;
    els.error.hidden = false;
    smoothTo(els.error, 160);
  }
  function lock(on) {
    busy = on;
    els.gen.disabled = on;
    els.gen.textContent = on ? U.generating : U.generate;
    els.gen.setAttribute('aria-busy', String(on));
  }

  // ---------------------------------------------------------------- 복사
  function copyText(text, btn) {
    var ok = function () {
      if (window.toast) window.toast(R.copied);
      if (btn) { btn.classList.add('is-copied'); later(function () { btn.classList.remove('is-copied'); }, 1400); }
    };
    function fallback() {
      var done = false;
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        done = document.execCommand('copy');
        ta.value = '';
        document.body.removeChild(ta);
      } catch (e) { done = false; }
      if (done) ok(); else if (window.toast) window.toast(R.copyFail);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok).catch(fallback);
    else fallback();
  }

  // ---------------------------------------------------------------- 결과 그리기
  function crackText(bits) {
    var c = CORE.crackTime(bits);
    if (c.unit === 'instant') return R.crackInstant;
    if (c.unit === 'forever') return R.crackForever;
    var opts = { style: 'unit', unit: c.unit, unitDisplay: 'long' };
    if (c.value >= 1e6) { opts.notation = 'compact'; opts.compactDisplay = 'long'; opts.maximumSignificantDigits = 2; }
    else opts.maximumFractionDigits = 0;
    var s;
    try { s = new Intl.NumberFormat(I.lang || 'en', opts).format(c.value); } catch (e) { s = numText(c.value) + ' ' + c.unit; }
    return s;
  }
  function renderMeter(bits) {
    var level = CORE.strength(bits);
    els.meter.setAttribute('data-level', level);
    els.word.textContent = R.strength[level];
    els.bits.textContent = fmt(R.bits, { bits: numText(Math.floor(bits)) });
    els.crack.textContent = fmt(R.crack, { time: crackText(bits) });
    els.tip.textContent = R.tips[level];
    return level;
  }
  function heading(p, n) {
    if (p.mode === 'passphrase') return n > 1 ? R.headingPhrases : R.headingPhrase;
    return n > 1 ? R.headingMany : R.heading;
  }
  function buildRows(rec) {
    els.list.innerHTML = '';
    els.list.className = 'pw-list' + (rec.list.length === 1 ? ' is-one' : '') + (rec.p.mode === 'passphrase' ? ' is-phrase' : '');
    var rows = [];
    rec.list.forEach(function (pw, i) {
      var li = document.createElement('li');
      li.className = 'pw-row';
      var code = document.createElement('code');
      code.className = 'pw-pass';
      code.setAttribute('translate', 'no');
      code.setAttribute('spellcheck', 'false');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pw-copy';
      btn.textContent = R.copy;
      btn.setAttribute('aria-label', fmt(R.copyAria, { n: i + 1 }));
      btn.addEventListener('click', function () { if (last && last.list[i] != null && !busy) copyText(last.list[i], btn); });
      li.appendChild(code);
      li.appendChild(btn);
      els.list.appendChild(li);
      rows.push(code);
    });
    return rows;
  }
  function scrambleOf(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      out += (ch === ' ' || ch === '-' || ch === '.' || ch === '_') && s.length > 20 ? ch : SCRAMBLE_CHARS.charAt(CORE.cryptoInt(SCRAMBLE_CHARS.length));
    }
    return out;
  }
  function finish(rec, level) {
    rec.rows.forEach(function (c, i) { c.textContent = rec.list[i]; c.classList.remove('is-scrambling'); });
    els.live.textContent = fmt(R.live, { label: R.strength[level] });
    lock(false);
    track('done');
  }
  function show(rec) {
    clearTimers();
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 결과·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    els.title.textContent = heading(rec.p, rec.list.length);
    rec.rows = buildRows(rec);
    var level = renderMeter(rec.bits);
    if (REDUCED) { later(function () { finish(rec, level); }, 30); return; }
    rec.rows.forEach(function (c, i) { c.classList.add('is-scrambling'); c.textContent = scrambleOf(rec.list[i]); });
    var spin = setInterval(function () { rec.rows.forEach(function (c, i) { c.textContent = scrambleOf(rec.list[i]); }); }, 60);
    timers.push(spin);
    later(function () { clearInterval(spin); finish(rec, level); }, SCRAMBLE_MS);
  }

  // ---------------------------------------------------------------- 만들기
  function generate() {
    if (busy) return;
    var v = CORE.validate(options());
    if (!v.ok) { showError(v.error); return; }
    clearError();
    var rec = { p: v.p, list: CORE.generateMany(v.p), bits: CORE.entropy(v.p) };   // 값 먼저 — 연출은 보여 주기만
    last = rec;
    lock(true);
    track('start');
    show(rec);
    later(function () { smoothTo(els.card, 70); }, 20);
  }

  if (window.setRetry) window.setRetry({ label: R.again, action: generate });
  if (window.setShareData) {
    // 앱 주소와 일반 문구만 공유한다 — 만든 비밀번호는 절대 넣지 않는다
    window.setShareData(function () {
      var base = window.location.href.split('#')[0].split('?')[0];
      return { title: R.shareTitle, text: R.shareText, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }

  // ---------------------------------------------------------------- 이벤트
  els.modes.forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
  els.counts.forEach(function (b) { b.addEventListener('click', function () { setCount(b.getAttribute('data-count')); }); });
  els.seps.forEach(function (b) { b.addEventListener('click', function () { setSep(b.getAttribute('data-sep')); }); });
  [els.length, els.words].forEach(function (el) { el.addEventListener('input', syncOutputs); });
  [els.upper, els.lower, els.digits, els.symbols].forEach(function (el) { el.addEventListener('change', clearError); });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); generate(); });
  els.gen.addEventListener('click', generate);

  window.PASSWORD_APP = {
    busy: function () { return busy; },
    last: function () { return last ? { p: JSON.parse(JSON.stringify(last.p)), list: last.list.slice(), bits: last.bits } : null; },
    options: options
  };

  syncOutputs();
})();
