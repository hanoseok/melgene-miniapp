/* apps/wordcount/wordcount.js — 글자수 세기 한 화면: 글 입력 → 실시간 숫자(글자·공백 제외·단어·바이트·문장·문단·줄·읽기/말하기 시간)
 *   → 목표 글자수(진행 막대·넘침 경고) → 자주 쓴 단어 → "결과 보기" → 요약 카드 + 공통 끝 화면.
 * 로직은 wordcount-core.js(WORDCOUNT_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(요약·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게).
 * 기록: 처음 글을 쓸 때(또는 지운 뒤 다시 쓸 때) track('start') 한 번, "결과 보기"를 누를 때 track('done') 한 번(같은 판에서는 한 번만).
 * 개인정보: 글은 이 기기 localStorage 초안(mg_wordcount_draft)에만. 주소·공유 문구·서버·통계에 넣지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.WORDCOUNT_APP (stats(), prefs(), started(), done())
 */
(function () {
  'use strict';

  var CORE = window.WORDCOUNT_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var R = I.result || {};
  var LANG = I.lang || 'en';
  var NUM_LOCALE = LANG === 'pt' ? 'pt-BR' : LANG === 'zh' ? 'zh-CN' : LANG;
  var DRAFT_KEY = 'mg_wordcount_draft';
  var PREFS_KEY = 'mg_wordcount_prefs';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    text: $('text'), limitbar: $('limitbar'), fill: $('limit-fill'), limitText: $('limit-text'),
    copy: $('btn-copy'), tidy: $('btn-tidy'), join: $('btn-join'), clear: $('btn-clear'), undo: $('btn-undo'), saved: $('saved-note'),
    chips: document.querySelectorAll('[data-limit]'), custom: $('limit-custom'), spaces: $('limit-spaces'),
    modes: document.querySelectorAll('[data-bytemode]'), byteHint: $('byte-hint'),
    kw: $('kw'), kwList: $('kw-list'), kwEmpty: $('kw-empty'),
    error: $('error'), finish: $('finish-btn'), live: $('live'),
    result: $('result'), card: $('result-card'), sumList: $('sum-list'), sumLimit: $('sum-limit'), copySum: $('btn-copy-sum'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var prefs = CORE.normalizePrefs(readJson(PREFS_KEY));
  var stats = CORE.analyze('', { lang: LANG });
  var started = false;      // 이번 판에서 track('start') 를 보냈는지
  var doneSent = false;     // 이번 판에서 track('done') 을 보냈는지
  var undoText = null;      // 되돌리기 한 단계
  var saveTimer = null, kwTimer = null, undoTimer = null;

  // ---------------------------------------------------------------- 도우미
  function track(ev) { try { if (window.track) window.track(ev); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { try { return new Intl.NumberFormat(NUM_LOCALE).format(n); } catch (e) { return String(n); } }
  function toast(msg) { if (msg && window.toast) window.toast(msg); }
  function readJson(key) { try { var v = window.localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function store(key, val) { try { if (val == null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); } catch (e) { /* 저장 못 해도 동작 */ } }
  function timeText(sec) {
    var t = CORE.splitTime(sec);
    if (!t.m) return fmt(U.time.sec, { s: num(t.s) });
    if (!t.s) return fmt(U.time.min, { m: num(t.m) });
    return fmt(U.time.minSec, { m: num(t.m), s: num(t.s) });
  }
  function smoothTo(el) {
    if (!el) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var top = el.getBoundingClientRect().top + window.pageYOffset - 70;
    try { window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  function radio(list, attr, val) { list.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(val))); }); }

  // ---------------------------------------------------------------- 그리기
  function limitCount() { return prefs.limitSpaces ? stats.chars : stats.noSpaces; }
  function renderLimit() {
    var st = CORE.limitStatus(limitCount(), prefs.limit);
    els.limitbar.hidden = !st.on;
    if (!st.on) return st;
    els.limitbar.setAttribute('data-state', st.over ? 'over' : st.pct >= 90 ? 'near' : 'ok');
    els.fill.style.width = st.pct + '%';
    els.limitText.textContent = fmt(U.limitText, { n: num(limitCount()), max: num(prefs.limit) }) + ' · ' +
      (st.over ? fmt(U.limitOver, { n: num(st.over) }) : fmt(U.limitLeft, { n: num(st.left) }));
    return st;
  }
  function renderStats() {
    $('bar-chars').textContent = num(stats.chars);
    $('bar-noSpaces').textContent = num(stats.noSpaces);
    $('bar-words').textContent = num(stats.words);
    $('bar-bytes').textContent = num(stats.bytes[prefs.byteMode]);
    ['chars', 'noSpaces', 'words', 'sentences', 'paragraphs', 'lines'].forEach(function (k) { $('st-' + k).textContent = num(stats[k]); });
    $('st-reading').textContent = timeText(stats.readingSec);
    $('st-speaking').textContent = timeText(stats.speakingSec);
    $('st-bytes').textContent = num(stats.bytes[prefs.byteMode]);
    renderLimit();
    if (!els.result.hidden) renderSummary();
  }
  function renderKeywords() {
    var list = CORE.keywords(els.text.value, { lang: LANG, top: 5 });
    els.kwList.textContent = '';
    list.forEach(function (k) {
      var li = document.createElement('li');
      var w = document.createElement('span'); w.className = 'wc-kw-word'; w.textContent = k.word;
      var c = document.createElement('span'); c.className = 'wc-kw-count'; c.textContent = fmt(U.kwCount, { n: num(k.count) }) + ' · ' + num(k.pct) + '%';
      li.appendChild(w); li.appendChild(c);
      els.kwList.appendChild(li);
    });
    els.kwEmpty.hidden = list.length > 0;
  }
  function summaryRows() {
    var S = U.stats;
    return [
      [S.words, num(stats.words)], [S.sentences, num(stats.sentences)], [S.paragraphs, num(stats.paragraphs)], [S.lines, num(stats.lines)],
      [S.bytes + ' (' + U.byteMode[prefs.byteMode] + ')', num(stats.bytes[prefs.byteMode])],
      [S.reading, timeText(stats.readingSec)], [S.speaking, timeText(stats.speakingSec)]
    ];
  }
  function limitSummary() {
    var st = CORE.limitStatus(limitCount(), prefs.limit);
    if (!st.on) return '';
    return st.over ? fmt(R.limitOver, { n: num(st.over), max: num(prefs.limit) }) : fmt(R.limitOk, { max: num(prefs.limit), pct: num(st.pct) });
  }
  function renderSummary() {
    $('sum-chars').textContent = num(stats.chars);
    $('sum-noSpaces').textContent = num(stats.noSpaces);
    els.sumList.textContent = '';
    summaryRows().forEach(function (r) {
      var dt = document.createElement('dt'); dt.textContent = r[0];
      var dd = document.createElement('dd'); dd.textContent = r[1];
      els.sumList.appendChild(dt); els.sumList.appendChild(dd);
    });
    var ls = limitSummary();
    els.sumLimit.hidden = !ls;
    els.sumLimit.textContent = ls;
    els.sumLimit.setAttribute('data-over', String(CORE.limitStatus(limitCount(), prefs.limit).over > 0));
  }

  // ---------------------------------------------------------------- 입력
  function recount() {
    stats = CORE.analyze(els.text.value, { lang: LANG });
    renderStats();
    clearTimeout(kwTimer);
    kwTimer = setTimeout(renderKeywords, 250);
  }
  function saveSoon() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { store(DRAFT_KEY, els.text.value ? els.text.value : null); }, 400);
  }
  function onInput() {
    if (!started && els.text.value.trim()) { started = true; doneSent = false; track('start'); }
    clearError();
    recount();
    saveSoon();
  }
  function setText(value, msg) {
    els.text.value = value;
    recount();
    store(DRAFT_KEY, value ? value : null);
    toast(msg);
  }
  function rememberUndo(prev) {
    undoText = prev;
    els.undo.hidden = false;
    clearTimeout(undoTimer);
    undoTimer = setTimeout(function () { undoText = null; els.undo.hidden = true; }, 15000);
  }
  function hideResult() {
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
  }
  function resetRound() { started = false; doneSent = false; }

  // ---------------------------------------------------------------- 도구
  function copyText(text, okMsg) {
    var ok = function () { toast(okMsg); };
    function fallback() {
      var done = false;
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        done = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { done = false; }
      if (done) ok(); else toast(U.copyFail);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok).catch(fallback);
    else fallback();
  }
  function transform(fn, msg) {
    var prev = els.text.value;
    var next = fn(prev);
    if (next === prev) { toast(U.nothing); return; }
    rememberUndo(prev);
    setText(next, msg);
  }
  function clearAll(focus) {
    var prev = els.text.value;
    if (prev) rememberUndo(prev);
    setText('', prev ? U.cleared : '');
    resetRound();
    hideResult();
    clearError();
    if (focus) { try { els.text.focus({ preventScroll: true }); } catch (e) { els.text.focus(); } smoothTo(els.text); }
  }
  function undo() {
    if (undoText == null) return;
    var t = undoText;
    undoText = null;
    els.undo.hidden = true;
    clearTimeout(undoTimer);
    setText(t, U.undone);
    if (!started && t.trim()) { started = true; doneSent = false; track('start'); }
  }

  // ---------------------------------------------------------------- 설정
  function savePrefs() { store(PREFS_KEY, prefs); }
  function setLimit(n, fromCustom) {
    prefs.limit = CORE.cleanLimit(n);
    var preset = CORE.LIMIT_PRESETS.indexOf(prefs.limit) >= 0 && (!fromCustom || !prefs.limit);
    radio(els.chips, 'data-limit', preset ? prefs.limit : -1);
    if (!fromCustom) els.custom.value = preset ? '' : (prefs.limit ? String(prefs.limit) : '');
    savePrefs();
    renderStats();
  }
  function setByteMode(m) {
    if (CORE.BYTE_MODES.indexOf(m) < 0) return;
    prefs.byteMode = m;
    radio(els.modes, 'data-bytemode', m);
    els.byteHint.textContent = U.byteHint[m];
    savePrefs();
    renderStats();
  }

  // ---------------------------------------------------------------- 결과 보기
  function clearError() { if (!els.error.hidden) { els.error.hidden = true; els.error.textContent = ''; } }
  function finish() {
    if (!els.text.value.trim()) {
      els.error.textContent = U.needText;
      els.error.hidden = false;
      try { els.text.focus({ preventScroll: true }); } catch (e) { els.text.focus(); }
      smoothTo(els.text);
      return;
    }
    clearError();
    stats = CORE.analyze(els.text.value, { lang: LANG });
    renderStats();
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 요약·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    renderSummary();
    els.live.textContent = fmt(R.live, { chars: num(stats.chars), words: num(stats.words) });
    if (!started) { started = true; track('start'); }   // 불러온 초안으로 바로 결과를 본 경우
    if (!doneSent) { doneSent = true; track('done'); }
    setTimeout(function () { smoothTo(els.card); }, 20);
  }
  function summaryText() {
    var lines = [R.summaryTitle, U.stats.chars + ': ' + num(stats.chars), U.stats.noSpaces + ': ' + num(stats.noSpaces)];
    summaryRows().forEach(function (r) { lines.push(r[0] + ': ' + r[1]); });
    var ls = limitSummary();
    if (ls) lines.push(ls);
    return lines.join('\n');
  }

  if (window.setRetry) window.setRetry({ label: R.again, action: function () { clearAll(true); } });
  if (window.setShareData) {
    // 앱 주소와 일반 문구만 공유한다 — 사용자의 글은 절대 넣지 않는다
    window.setShareData(function () {
      var base = window.location.href.split('#')[0].split('?')[0];
      return { title: R.shareTitle, text: R.shareText, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }

  // ---------------------------------------------------------------- 이벤트
  els.text.addEventListener('input', onInput);
  els.copy.addEventListener('click', function () { if (els.text.value) copyText(els.text.value, U.copied); else toast(U.nothing); });
  els.tidy.addEventListener('click', function () { transform(CORE.tidySpaces, U.tidied); });
  els.join.addEventListener('click', function () { transform(CORE.joinLines, U.joined); });
  els.clear.addEventListener('click', function () { clearAll(true); });
  els.undo.addEventListener('click', undo);
  els.chips.forEach(function (b) { b.addEventListener('click', function () { setLimit(b.getAttribute('data-limit'), false); }); });
  els.custom.addEventListener('input', function () {
    var digits = els.custom.value.replace(/[^\d]/g, '');
    if (digits !== els.custom.value) els.custom.value = digits;
    setLimit(digits, true);
  });
  els.spaces.addEventListener('change', function () { prefs.limitSpaces = els.spaces.checked; savePrefs(); renderStats(); });
  els.modes.forEach(function (b) { b.addEventListener('click', function () { setByteMode(b.getAttribute('data-bytemode')); }); });
  els.finish.addEventListener('click', finish);
  els.copySum.addEventListener('click', function () { copyText(summaryText(), R.summaryCopied); });

  window.WORDCOUNT_APP = {
    stats: function () { return JSON.parse(JSON.stringify(stats)); },
    prefs: function () { return JSON.parse(JSON.stringify(prefs)); },
    started: function () { return started; },
    done: function () { return doneSent; }
  };

  // ---------------------------------------------------------------- 시작: 저장된 설정·초안 불러오기
  els.spaces.checked = prefs.limitSpaces;
  setByteMode(prefs.byteMode);
  setLimit(prefs.limit, false);
  if (prefs.limit && CORE.LIMIT_PRESETS.indexOf(prefs.limit) < 0) els.custom.value = String(prefs.limit);
  var draft = null;
  try { draft = window.localStorage.getItem(DRAFT_KEY); } catch (e) { draft = null; }
  if (draft) els.text.value = draft;
  recount();
  renderKeywords();
})();
