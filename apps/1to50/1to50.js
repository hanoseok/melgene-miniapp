/* apps/1to50/1to50.js — 시작(티징 + 모드) → 게임(HUD + 5×5 판, 3-2-1, 광고 없음) → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 1to50-core.js(ONE50_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 입력: 칸을 pointerdown 으로 바로 받는다(300ms 지연 없음, touch-action: manipulation 으로 더블탭 확대 없음). 키보드 Enter/Space 도 같은 동작(click detail 0).
 * 다음 숫자가 아닌 칸 = 실수: 흔들림 + 시간 +0.5초(PENALTY_MS). 빈 칸은 무시.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 탭을 숨기면 시간이 멈추고 판이 가려진다(돌아와 탭하면 3-2-1 뒤 이어서). prefers-reduced-motion 이면 흔들림·진동을 줄인다.
 * 최고 기록(모드별 최단 시간, 벌점 포함): localStorage one50_best_v1. 마지막 모드: one50_mode_v1.
 * 디버그/검사용 핸들: window.ONE50_APP (phase(), state(), elapsed(), mode(), best())
 */
(function () {
  'use strict';

  var C = window.ONE50_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var S = UI.start || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'one50_best_v1';
  var LAST_KEY = 'one50_mode_v1';
  var COUNT_STEP = 700;
  var END_DELAY = REDUCED ? 250 : 650;
  var LANG = document.documentElement.lang || 'en';
  var NF2 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch (e) { return null; } })();
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'), modes: $('modes'),
    next: $('hud-next'), time: $('hud-time'), pen: $('hud-pen'), prog: $('hud-prog'), bar: $('bar-fill'),
    field: $('field'), board: $('board'), count: $('count'), pause: $('pause-btn'),
    mode: $('res-mode'), big: $('res-big'), newBest: $('res-newbest'), resBest: $('res-best'),
    miss: $('res-miss'), per: $('res-per'), penNote: $('res-pen'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | count | play | paused | ending | end
  var state = null;
  var mode = 'classic';
  var runId = 0, doneSent = false, endTimer = 0, countTimer = 0, raf = 0, penTimer = 0;
  var baseMs = 0, t0 = 0, running = false, finalMs = 0;
  var cells = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function secs2(ms) { var v = Math.floor(ms / 10) / 100; return NF2 ? NF2.format(v) : v.toFixed(2); }
  function secs1(ms) { var v = Math.round(ms / 100) / 10; return NF1 ? NF1.format(v) : v.toFixed(1); }
  function buzz(ms) { if (!REDUCED && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* noop */ } } }
  function seed() {
    try { var a = new Uint32Array(1); window.crypto.getRandomValues(a); return a[0]; } catch (e) { return Math.floor(Math.random() * 4294967296); }
  }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 저장 (이 브라우저)
  function readBest() {
    try {
      var o = JSON.parse(localStorage.getItem(BEST_KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) { return {}; }
  }
  function getBest(m) { var v = Number(readBest()[m]); return isFinite(v) && v > 0 ? v : 0; }
  function setBest(m, ms) {
    var o = readBest();
    o[m] = Math.round(ms);
    try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ }
  }
  function loadMode() {
    try { var m = localStorage.getItem(LAST_KEY); if (m && C.MODES[m]) return m; } catch (e) { /* noop */ }
    return 'classic';
  }
  function saveMode(m) { try { localStorage.setItem(LAST_KEY, m); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 모드 고르기
  function selectMode(m) {
    mode = m;
    Array.prototype.forEach.call(els.modes.querySelectorAll('.ot-mode'), function (b) {
      var on = b.getAttribute('data-mode') === m;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }
  els.modes.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.ot-mode') : null;
    if (!b) return;
    selectMode(b.getAttribute('data-mode'));
    saveMode(mode);
  });
  els.modes.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'ArrowUp' && k !== 'ArrowDown') return;
    e.preventDefault();
    var i = C.MODE_ORDER.indexOf(mode) + (k === 'ArrowLeft' || k === 'ArrowUp' ? -1 : 1);
    i = (i + C.MODE_ORDER.length) % C.MODE_ORDER.length;
    selectMode(C.MODE_ORDER[i]);
    saveMode(mode);
    var b = els.modes.querySelector('[data-mode="' + mode + '"]');
    if (b) b.focus();
  });

  // ---------------------------------------------------------------- 시간 (0.01초, 벌점 포함해서 보여 준다)
  function clockMs() { return baseMs + (running ? performance.now() - t0 : 0); }
  function elapsed() { return state ? clockMs() + C.penaltyMs(state) : 0; }
  function drawTime() { els.time.textContent = secs2(elapsed()); }
  function loop() {
    drawTime();
    if (running) raf = requestAnimationFrame(loop);
  }
  function startClock() {
    if (running) return;
    t0 = performance.now();
    running = true;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }
  function stopClock() {
    if (running) { baseMs += performance.now() - t0; running = false; }
    cancelAnimationFrame(raf);
    drawTime();
  }

  // ---------------------------------------------------------------- 판
  function renderCell(i) {
    var v = state.cells[i], el = cells[i];
    var covered = phase === 'count' || phase === 'paused';
    var cls = 'ot-cell' + (v === 0 ? ' is-off' : v > C.CELLS ? ' is-hi' : '') + (covered ? ' is-covered' : '');
    if (el.className.replace(/\s*is-(pop|shake)\b/g, '') !== cls) el.className = cls;
    var txt = covered || !v ? '' : String(v);
    if (el.textContent !== txt) el.textContent = txt;
    if (!v) el.setAttribute('aria-label', P.aBlank); else el.removeAttribute('aria-label');
    if (!v || covered) el.setAttribute('aria-disabled', 'true'); else el.removeAttribute('aria-disabled');
    el.setAttribute('data-n', covered ? '' : String(v));
  }
  function renderAll() { for (var i = 0; i < C.CELLS; i++) renderCell(i); }
  function buildBoard() {
    els.board.textContent = '';
    cells = [];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < C.CELLS; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ot-cell is-covered';
      b.setAttribute('data-i', String(i));
      cells.push(b);
      frag.appendChild(b);
    }
    els.board.appendChild(frag);
  }
  function drawHud() {
    var n = Math.min(state.next, state.max);
    els.next.textContent = state.status === 'done' ? '✓' : String(n);
    els.prog.textContent = String(state.next - 1) + '/' + state.max;
    els.bar.style.width = (C.progress(state) * 100).toFixed(1) + '%';
    drawTime();
  }
  function flash(el, cls, ms) {
    el.classList.remove(cls);
    void el.offsetWidth;   // 같은 애니메이션을 다시 걸기
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms);
  }
  function penFlash() {
    els.pen.textContent = '+' + secs1(C.PENALTY_MS);
    flash(els.pen, 'is-on', 650);
    clearTimeout(penTimer);
    penTimer = setTimeout(function () { els.pen.textContent = ''; }, 700);
  }

  // ---------------------------------------------------------------- 3-2-1
  function countdown(then) {
    var myRun = runId;
    var n = 3;
    phase = 'count';
    renderAll();
    els.count.hidden = false;
    clearTimeout(countTimer);
    function step() {
      if (myRun !== runId || phase !== 'count') return;
      if (n > 0) {
        els.count.textContent = String(n);
        flash(els.count, 'is-tick', COUNT_STEP);
        n--;
        countTimer = setTimeout(step, COUNT_STEP);
        return;
      }
      els.count.textContent = P.go;
      flash(els.count, 'is-tick', 450);
      phase = 'play';
      renderAll();
      startClock();
      countTimer = setTimeout(function () { if (myRun === runId && els.count.textContent === P.go) els.count.hidden = true; }, 450);
      if (then) then();
    }
    step();
  }

  // ---------------------------------------------------------------- 일시정지 (탭을 숨기면)
  function pauseNow() {
    if (phase !== 'play' && phase !== 'count') return;
    clearTimeout(countTimer);
    stopClock();
    phase = 'paused';
    els.count.hidden = true;
    renderAll();
    els.pause.hidden = false;
  }
  function resumeNow() {
    if (phase !== 'paused') return;
    els.pause.hidden = true;
    countdown();
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseNow(); });
  els.pause.addEventListener('click', resumeNow);

  // ---------------------------------------------------------------- 입력
  function hit(i) {
    if (phase !== 'play' || !state) return;
    var r = C.tap(state, i);
    if (!r.ok) return;
    var el = cells[i];
    if (r.wrong) {
      if (!REDUCED) flash(el, 'is-shake', 320); else flash(el, 'is-bad', 320);
      penFlash();
      buzz(35);
      drawHud();
      return;
    }
    renderCell(i);
    if (!REDUCED && r.replaced) flash(el, 'is-pop', 220);
    drawHud();
    if (r.done) finish();
  }
  function cellOf(e) { var t = e.target.closest ? e.target.closest('.ot-cell') : null; return t ? Number(t.getAttribute('data-i')) : -1; }
  els.board.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var i = cellOf(e);
    if (i < 0) return;
    e.preventDefault();   // 포커스·글자 선택·길게 누르기 메뉴 막기 — 누르는 순간 바로 처리
    hit(i);
  });
  // 키보드: Enter/Space 는 click(detail 0) 으로 들어온다 (포인터 click 은 pointerdown 에서 이미 처리)
  els.board.addEventListener('click', function (e) {
    if (e.detail !== 0) return;
    var i = cellOf(e);
    if (i >= 0) hit(i);
  });
  els.board.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  els.board.addEventListener('selectstart', function (e) { e.preventDefault(); });
  els.board.addEventListener('dragstart', function (e) { e.preventDefault(); });
  els.board.addEventListener('dblclick', function (e) { e.preventDefault(); });

  // ---------------------------------------------------------------- 끝
  function finish() {
    if (phase !== 'play') return;
    phase = 'ending';
    stopClock();
    finalMs = elapsed();
    var myRun = runId;
    clearTimeout(endTimer);
    endTimer = setTimeout(function () { if (myRun === runId) showEnd(myRun); }, END_DELAY);
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, ms);
      Promise.resolve(promise).then(function (v) {
        if (done) return;
        done = true; clearTimeout(timer); resolve(v);
      }, function () {
        if (done) return;
        done = true; clearTimeout(timer); resolve(null);
      });
    });
  }

  // 끝낸 판마다 한 번 시간을 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(sec, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || state.submitted || state.status !== 'done' || !C.plausible(mode, sec)) return;
    state.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(sec);
    withTimeout(supa.submitScore(C.MODES[mode].game, b), 8000).then(function (rows) {
      if (myRun !== runId) return;
      var p = C.percentile(rows, b);
      if (!p || p.first) { els.rank.hidden = true; return; }
      els.comparing.hidden = true;
      els.rankBody.hidden = false;
      els.top.textContent = fmt(R.top, { n: p.top });
      els.beat.textContent = p.beatPct >= 100 ? R.beatAll : fmt(R.beat, { pct: p.beatPct });
      els.others.textContent = fmt(R.others, { n: num(p.others) });
    });
  }

  function showEnd(myRun) {
    var s = state;
    var ms = finalMs;
    phase = 'end';
    els.mode.textContent = ((S.modes || {})[mode] || mode) + ' · 1 → ' + s.max;
    els.big.textContent = secs2(ms);
    els.miss.textContent = num(s.mistakes);
    els.per.textContent = secs2(ms / s.max);
    els.penNote.hidden = !s.mistakes;
    els.penNote.textContent = s.mistakes ? fmt(R.penNote, { s: secs1(C.penaltyMs(s)) }) : '';
    els.newBest.hidden = true;
    var prev = getBest(mode);
    if (!prev || ms < prev) {
      setBest(mode, ms);
      els.newBest.hidden = !prev;   // 첫 기록은 "새 최고 기록!" 이라 하지 않는다
      prev = ms;
    }
    els.resBest.textContent = fmt(R.best, { t: secs2(prev) + ' ' + R.sec });
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    submitScore(ms / 1000, myRun);
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
  }

  // ---------------------------------------------------------------- 시작
  function start() {
    runId++;
    clearTimeout(endTimer);
    clearTimeout(countTimer);
    cancelAnimationFrame(raf);
    doneSent = false;
    running = false;
    baseMs = 0;
    finalMs = 0;
    state = C.newGame(mode, seed());
    els.pause.hidden = true;
    els.pen.textContent = '';
    phase = 'count';
    buildBoard();
    drawHud();
    show('play');
    track('start');
    countdown();
  }
  els.startBtn.addEventListener('click', start);

  selectMode(loadMode());

  if (window.setShareData) {
    window.setShareData(function () {
      var done = phase === 'end' && state && state.status === 'done';
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { time: secs2(finalMs), max: state.max }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.ONE50_APP = {
    phase: function () { return phase; },
    state: function () { return state; },
    best: getBest,
    elapsed: elapsed,
    mode: function () { return mode; }
  };
}());
