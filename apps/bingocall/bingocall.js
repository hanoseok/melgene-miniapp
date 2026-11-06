/* apps/bingocall/bingocall.js — 빙고 번호 추첨기: 시작(방식·범위) → 진행(큰 공·지난 5개·뽑기·되돌리기·자동 뽑기·읽어 주기·소리·전체 판) → 끝(요약 숫자 + 공통 끝 화면)
 * 로직은 bingocall-core.js(BINGOCALL_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 뽑기: 누를 때마다 남은 번호 중 crypto 로 하나(반복 없음). 값은 먼저 정하고, 굴러가는 숫자 연출(약 0.9초)은 보여 주기만 한다(움직임 줄이기면 바로).
 * 광고: 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 숨으면 같이 숨음). 진행 화면은 TV·프로젝터에 띄우므로 광고 없음. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 한 게임의 첫 번호를 뽑을 때 track('start') 한 번, 끝내기(또는 모든 번호를 다 뽑았을 때) track('done') 한 번. 새 게임이면 다시 한 번씩.
 * 저장: localStorage bingocall_state(try/catch) = 진행 중 게임 + 설정(간격·읽어 주기·소리·마지막 방식/범위). 새로 고침해도 게임이 이어진다. 서버로 보내지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.BINGOCALL_APP
 */
(function () {
  'use strict';

  var CORE = window.BINGOCALL_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var ER = I.errors || {};
  var EN = I.end || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'bingocall_state';
  var ROLL_MS = 900;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), play: $('screen-play'), end: $('screen-end'),
    form: $('bc-form'), customBox: $('custom-box'), from: $('from'), to: $('to'), error: $('error'), start: $('start-btn'),
    chip: $('mode-chip'), count: $('count'), fs: $('fs-btn'), finish: $('finish-btn'),
    ball: $('ball'), letter: $('ball-letter'), num: $('ball-num'), ready: $('ready'), prev: $('prev'),
    draw: $('draw-btn'), autoBar: $('auto-bar'), autoFill: $('auto-fill'), undo: $('undo-btn'), auto: $('auto'),
    voiceWrap: $('voice-wrap'), voice: $('voice'), sound: $('sound'), board: $('board'), newGame: $('new-btn'), live: $('live'),
    sDrawn: $('stat-drawn'), sOf: $('stat-of'), sTime: $('stat-time'), endNone: $('end-none'), edit: $('edit-btn'), year: $('year')
  };
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('.bc-mode'));
  var secBtns = Array.prototype.slice.call(document.querySelectorAll('#interval .bc-seg-btn'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = '75';
  var game = null;          // CORE.newGame
  var prefs = { iv: 5, voice: false, sound: false, a: CORE.DEFAULT_CUSTOM.a, b: CORE.DEFAULT_CUSTOM.b };
  var rolling = false;
  var rollTimer = 0;
  var autoTimer = 0;
  var cells = {};           // 번호 → 판 칸
  var voiceObj = null;
  var audio = null;
  var wakeLock = null;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function ask(msg) { try { return window.confirm(msg); } catch (e) { return true; } }
  function callText(n) { var L = CORE.letterOf(game.mode, n); return L ? L + ' ' + n : String(n); }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function load() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (!o || typeof o !== 'object') return null;
      if (CORE.INTERVALS.indexOf(o.iv) >= 0) prefs.iv = o.iv;
      prefs.voice = o.voice === true;
      prefs.sound = o.sound === true;
      if (CORE.MODES.indexOf(o.mode) >= 0) mode = o.mode;
      if (CORE.validateRange(o.a, o.b).ok) { prefs.a = o.a; prefs.b = o.b; }
      return CORE.sanitize(o.game);
    } catch (e) { return null; }
  }
  function save() {
    var o = { iv: prefs.iv, voice: prefs.voice, sound: prefs.sound, mode: mode, a: prefs.a, b: prefs.b, game: game && !game.ended ? game : null };
    try { window.localStorage.setItem(STORE, JSON.stringify(o)); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 시작 화면
  function setMode(m) {
    mode = CORE.MODES.indexOf(m) >= 0 ? m : '75';
    modeBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-mode') === mode)); });
    els.customBox.hidden = mode !== 'custom';
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; els.from.removeAttribute('aria-invalid'); els.to.removeAttribute('aria-invalid'); }
  function showError(v) {
    els.error.textContent = fmt(ER[v.error] || ER.rangeBad, { n: v.n, min: CORE.CUSTOM_MIN_SIZE, max: CORE.CUSTOM_MAX_SIZE, lo: CORE.CUSTOM_LO, hi: CORE.CUSTOM_HI });
    els.error.hidden = false;
    els.from.setAttribute('aria-invalid', 'true');
    els.to.setAttribute('aria-invalid', 'true');
    scrollTo(els.error, 'center');
  }
  function show(screen) {
    els.setup.hidden = screen !== 'setup';
    els.play.hidden = screen !== 'play';
    els.end.hidden = screen !== 'end';
    if (screen === 'play') keepAwake(); else letSleep();
  }
  function startFromForm() {
    var g;
    if (mode === 'custom') {
      var v = CORE.validateRange(els.from.value === '' ? NaN : Number(els.from.value), els.to.value === '' ? NaN : Number(els.to.value));
      if (!v.ok) { showError(v); return; }
      prefs.a = v.a; prefs.b = v.b;
      g = CORE.newGame('custom', v.a, v.b);
    } else g = CORE.newGame(mode);
    clearError();
    begin(g);
  }
  function begin(g) {
    stopAuto();
    game = g;
    mode = g.mode;
    save();
    buildBoard();
    show('play');
    render();
    scrollTo(els.play, 'start');
  }

  // ---------------------------------------------------------------- 진행 화면
  function buildBoard() {
    while (els.board.firstChild) els.board.removeChild(els.board.firstChild);
    cells = {};
    els.board.className = 'bc-board bc-board-' + game.mode;
    CORE.boardRows(game).forEach(function (row) {
      var r = document.createElement('div');
      r.className = 'bc-row';
      if (row.letter) {
        var h = document.createElement('span');
        h.className = 'bc-row-letter c-' + row.letter;
        h.textContent = row.letter;
        r.appendChild(h);
      }
      row.cells.forEach(function (n) {
        var c = document.createElement('span');
        c.className = 'bc-cell' + (row.letter ? ' c-' + row.letter : '');
        c.textContent = String(n);
        cells[n] = c;
        r.appendChild(c);
      });
      els.board.appendChild(r);
    });
  }
  function setBall(n, pop) {
    var L = n > 0 ? CORE.letterOf(game.mode, n) : '';
    els.ball.className = 'bc-ball ' + (n > 0 ? (L ? 'c-' + L : 'c-x') : 'is-empty') + (pop ? ' is-pop' : '') + (rolling ? ' is-rolling' : '');
    els.letter.textContent = L;
    els.letter.hidden = !L;
    els.num.textContent = n > 0 ? String(n) : '?';
  }
  function render() {
    if (!game) return;
    var d = game.drawn;
    var m = CORE.total(game);
    var cur = d.length ? d[d.length - 1] : 0;
    var done = CORE.isComplete(game);
    els.chip.textContent = game.mode === 'custom' ? fmt(U.customChip, { a: game.a, b: game.b }) : U.modes[game.mode].name;
    els.count.textContent = fmt(U.count, { n: d.length, m: m });
    if (!rolling) setBall(cur, false);
    els.ready.hidden = d.length > 0;
    while (els.prev.firstChild) els.prev.removeChild(els.prev.firstChild);
    d.slice(-6, -1).reverse().forEach(function (n) {
      var li = document.createElement('li');
      var L = CORE.letterOf(game.mode, n);
      li.className = 'bc-prev-ball ' + (L ? 'c-' + L : 'c-x');
      li.textContent = callText(n);
      els.prev.appendChild(li);
    });
    els.prev.parentNode.hidden = d.length < 2;
    Object.keys(cells).forEach(function (k) { cells[k].classList.remove('is-on', 'is-last'); });
    d.forEach(function (n) { if (cells[n]) cells[n].classList.add('is-on'); });
    if (cur && cells[cur] && !rolling) cells[cur].classList.add('is-last');
    els.draw.textContent = rolling ? U.drawing : done ? U.allDone : d.length ? U.draw : U.drawFirst;
    els.draw.disabled = rolling;
    els.draw.classList.toggle('is-finish', done);
    els.undo.disabled = rolling || !d.length;
    els.auto.disabled = done;
  }

  function drawOne() {
    if (rolling || !game || game.ended) return;
    if (CORE.isComplete(game)) { finish(); return; }
    var first = !game.t0;
    var x = CORE.draw(game);
    if (x < 0) return;
    if (first) track('start');
    save();
    clearTimeout(autoTimer);
    els.autoBar.hidden = true;
    if (REDUCED) { reveal(x); return; }
    rolling = true;
    render();
    var t0 = Date.now();
    (function spin() {
      if (Date.now() - t0 >= ROLL_MS) { rolling = false; reveal(x); return; }
      setBall(CORE.teaseNumber(game), false);
      rollTimer = setTimeout(spin, 70);
    })();
  }
  function reveal(x) {
    rolling = false;
    clearTimeout(rollTimer);
    setBall(x, !REDUCED);
    render();
    els.live.textContent = fmt(U.liveCall, { call: callText(x) });
    if (prefs.voice) speak(x);
    if (prefs.sound) ding();
    if (CORE.isComplete(game)) { markDone(); stopAuto(); save(); render(); }
    else scheduleAuto();
  }
  function undoLast() {
    if (rolling || !game) return;
    var x = CORE.undo(game);
    if (x < 0) return;
    save();
    render();
    els.live.textContent = fmt(U.liveUndo, { call: callText(x) });
    scheduleAuto();
  }
  function markDone() {
    if (!game || game.done || !game.t0) return;
    game.done = true;
    track('done');
  }
  function finish() {
    if (!game || rolling) return;
    if (game.drawn.length && !CORE.isComplete(game) && !ask(U.finishConfirm)) return;
    stopAuto();
    CORE.end(game);
    markDone();
    var n = game.drawn.length;
    els.sDrawn.textContent = String(n);
    els.sOf.textContent = fmt(EN.of, { m: CORE.total(game) });
    els.sTime.textContent = durText(CORE.durationSec(game));
    els.sDrawn.parentNode.parentNode.hidden = n === 0;
    els.endNone.hidden = n !== 0;
    save();
    exitFullscreen();
    show('end');
    scrollTo(els.end, 'start');
  }
  function durText(sec) {
    var p = CORE.splitDuration(sec);
    if (p.h) return fmt(EN.durH, p);
    if (p.m) return fmt(EN.durM, p);
    return fmt(EN.durS, p);
  }
  function newGameAsk() {
    if (rolling) return;
    if (game && game.drawn.length && !ask(U.newConfirm)) return;
    stopAuto();
    exitFullscreen();
    game = null;
    save();
    setMode(mode);
    show('setup');
    scrollTo(els.setup, 'start');
  }
  function playAgain() {
    var last = game;
    if (last) begin(CORE.newGame(last.mode, last.a, last.b));
    else { show('setup'); scrollTo(els.setup, 'start'); }
  }
  function edit() {
    if (game) setMode(game.mode);
    game = null;
    save();
    show('setup');
    scrollTo(els.setup, 'start');
  }

  // ---------------------------------------------------------------- 자동 뽑기
  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (!els.auto.checked || !game || game.ended || CORE.isComplete(game)) { els.autoBar.hidden = true; return; }
    els.autoBar.hidden = false;
    els.autoFill.style.transition = 'none';
    els.autoFill.style.width = '0%';
    void els.autoFill.offsetWidth;
    if (!REDUCED) { els.autoFill.style.transition = 'width ' + prefs.iv + 's linear'; els.autoFill.style.width = '100%'; }
    autoTimer = setTimeout(drawOne, prefs.iv * 1000);
  }
  function stopAuto() {
    clearTimeout(autoTimer);
    els.auto.checked = false;
    els.autoBar.hidden = true;
  }
  function setInterval_(s) {
    prefs.iv = CORE.INTERVALS.indexOf(s) >= 0 ? s : 5;
    secBtns.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-sec')) === prefs.iv)); });
  }

  // ---------------------------------------------------------------- 읽어 주기 · 소리
  function findVoice() {
    try {
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return null;
      var want = String(I.lang || 'en').toLowerCase();
      var list = window.speechSynthesis.getVoices().filter(function (v) { return String(v.lang || '').toLowerCase().replace('_', '-').split('-')[0] === want; });
      if (!list.length) return null;
      var pref = { pt: 'pt-br', zh: 'zh-cn', en: 'en-us' }[want];
      return list.filter(function (v) { return String(v.lang).toLowerCase().replace('_', '-') === pref; })[0] || list.filter(function (v) { return v.localService; })[0] || list[0];
    } catch (e) { return null; }
  }
  function syncVoice() {
    voiceObj = findVoice();
    els.voiceWrap.hidden = !voiceObj;
    if (!voiceObj) prefs.voice = false;
    els.voice.checked = prefs.voice;
  }
  function speak(n) {
    if (!voiceObj) return;
    try {
      var L = CORE.letterOf(game.mode, n);
      var u = new window.SpeechSynthesisUtterance(L ? fmt(U.say75, { letter: L, n: n }) : fmt(U.sayNum, { n: n }));
      u.voice = voiceObj;
      u.lang = voiceObj.lang;
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) { /* noop */ }
  }
  function ding() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audio) audio = new AC();
      if (audio.state === 'suspended') audio.resume();
      var t = audio.currentTime;
      [880, 1318.5].forEach(function (f, i) {
        var o = audio.createOscillator();
        var gn = audio.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        gn.gain.setValueAtTime(0.0001, t + i * 0.12);
        gn.gain.exponentialRampToValueAtTime(0.25, t + i * 0.12 + 0.02);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.12 + 0.5);
        o.connect(gn); gn.connect(audio.destination);
        o.start(t + i * 0.12); o.stop(t + i * 0.12 + 0.55);
      });
    } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 전체 화면 · 화면 꺼짐 막기
  var FS_OK = !!(document.fullscreenEnabled && document.documentElement.requestFullscreen);
  function isFs() { return !!document.fullscreenElement; }
  function syncFs() {
    els.fs.hidden = !FS_OK;
    els.fs.setAttribute('aria-label', isFs() ? U.exitFullscreen : U.fullscreen);
    els.fs.title = isFs() ? U.exitFullscreen : U.fullscreen;
    els.fs.setAttribute('aria-pressed', String(isFs()));
    document.body.classList.toggle('is-fs', isFs());
  }
  function toggleFs() {
    try {
      if (isFs()) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(function () { /* noop */ });
    } catch (e) { /* noop */ }
  }
  function exitFullscreen() { try { if (isFs()) document.exitFullscreen(); } catch (e) { /* noop */ } }
  function keepAwake() {
    try {
      if (wakeLock || !navigator.wakeLock || document.visibilityState !== 'visible') return;
      navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; l.addEventListener('release', function () { wakeLock = null; }); }).catch(function () { /* noop */ });
    } catch (e) { /* noop */ }
  }
  function letSleep() { try { if (wakeLock) wakeLock.release(); } catch (e) { /* noop */ } wakeLock = null; }

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  if (window.setShareData) {
    window.setShareData(function () { return { title: EN.shareTitle, text: EN.shareText, url: baseUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: EN.again, action: playAgain });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); startFromForm(); });
  modeBtns.forEach(function (b) { b.addEventListener('click', function () { clearError(); setMode(b.getAttribute('data-mode')); save(); }); });
  [els.from, els.to].forEach(function (inp) {
    inp.addEventListener('input', clearError);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); startFromForm(); } });
  });
  els.start.addEventListener('click', startFromForm);
  els.draw.addEventListener('click', drawOne);
  els.undo.addEventListener('click', undoLast);
  els.finish.addEventListener('click', finish);
  els.newGame.addEventListener('click', newGameAsk);
  els.edit.addEventListener('click', edit);
  els.fs.addEventListener('click', toggleFs);
  els.auto.addEventListener('change', function () { if (els.auto.checked) scheduleAuto(); else stopAuto(); });
  secBtns.forEach(function (b) { b.addEventListener('click', function () { setInterval_(Number(b.getAttribute('data-sec'))); save(); if (els.auto.checked && !rolling) scheduleAuto(); }); });
  els.voice.addEventListener('change', function () { prefs.voice = els.voice.checked && !!voiceObj; save(); });
  els.sound.addEventListener('change', function () { prefs.sound = els.sound.checked; save(); if (prefs.sound) ding(); });
  document.addEventListener('fullscreenchange', syncFs);
  document.addEventListener('visibilitychange', function () { if (!els.play.hidden) keepAwake(); });
  // 발표용 리모컨·키보드: 진행 화면에서 Space·Enter·→·PageDown = 뽑기 (버튼·입력에 초점이 있을 때는 그대로)
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target && e.target.tagName;
    if (t === 'BUTTON' || t === 'INPUT' || t === 'SELECT' || t === 'TEXTAREA' || t === 'A') return;
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); drawOne(); }
  });
  try { if (window.speechSynthesis) window.speechSynthesis.addEventListener('voiceschanged', syncVoice); } catch (e) { /* noop */ }

  window.BINGOCALL_APP = {
    screen: function () { return !els.play.hidden ? 'play' : !els.end.hidden ? 'end' : 'setup'; },
    game: function () { return game ? JSON.parse(JSON.stringify(game)) : null; },
    rolling: function () { return rolling; },
    prefs: function () { return JSON.parse(JSON.stringify(prefs)); }
  };

  // ---------------------------------------------------------------- 처음
  var saved = load();
  els.from.value = String(prefs.a);
  els.to.value = String(prefs.b);
  setInterval_(prefs.iv);
  els.sound.checked = prefs.sound;
  syncVoice();
  syncFs();
  setMode(mode);
  if (saved && !saved.ended) {
    game = saved;
    mode = game.mode;
    buildBoard();
    show('play');
    render();
  }
})();
