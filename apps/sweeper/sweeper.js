/* apps/sweeper/sweeper.js — 시작(티징 + 난이도) → 게임(HUD + 칸 격자, 광고 없음) → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 sweeper-core.js(SWEEPER_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 입력: 탭/클릭 = 열기(깃발 모드면 깃발), 길게 누르기(터치·펜 420ms)·마우스 오른쪽 = 깃발, 열린 숫자 탭 = 코드(chord), 키보드 ← ↑ → ↓ 이동 · Enter/Space 열기 · F 깃발.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만(이긴 판만). 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 탭을 숨기면 시간이 멈추고 판이 가려진다(돌아와 탭하면 이어서). prefers-reduced-motion 이면 움직임·진동을 끈다.
 * 최고 기록(난이도별 최단 시간): localStorage sweeper_best_v1.
 * 디버그/검사용 핸들: window.SWEEPER_APP (phase(), state(), best(), elapsed())
 */
(function () {
  'use strict';

  var C = window.SWEEPER_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var S = UI.start || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'sweeper_best_v1';
  var LAST_KEY = 'sweeper_diff_v1';
  var END_DELAY = REDUCED ? 400 : 1300;
  var LONG_MS = 420;
  var MOVE_SLOP = 10;
  var LANG = document.documentElement.lang || 'en';
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'), diffs: $('diffs'),
    mines: $('hud-mines'), time: $('hud-time'), mode: $('mode-btn'), modeIco: $('mode-ico'), modeTxt: $('mode-txt'),
    field: $('field'), board: $('board'), pause: $('pause-btn'),
    reason: $('res-reason'), headEmoji: $('res-head-emoji'), head: $('res-head'), big: $('res-big'), unit: $('res-unit'),
    newBest: $('res-newbest'), resBest: $('res-best'), resTime: $('res-time'), resClear: $('res-clear'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | play | ending | end
  var state = null;
  var diff = 'beginner';
  var flagMode = false;
  var runId = 0, doneSent = false, endTimer = 0, tickTimer = 0;
  var baseMs = 0, t0 = 0, running = false, paused = false;
  var cells = [];
  var focusIdx = 0;
  var press = null;        // { i, x, y, timer, long, moved }

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function secs(ms) { var v = Math.round(ms / 100) / 10; return NF1 ? NF1.format(v) : v.toFixed(1); }
  function buzz(ms) { if (!REDUCED && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* noop */ } } }

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
  function getBest(d) { var v = Number(readBest()[d]); return isFinite(v) && v > 0 ? v : 0; }
  function setBest(d, ms) {
    var o = readBest();
    o[d] = Math.round(ms);
    try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ }
  }
  function loadDiff() {
    try { var d = localStorage.getItem(LAST_KEY); if (d && C.DIFFS[d]) return d; } catch (e) { /* noop */ }
    return 'beginner';
  }
  function saveDiff(d) { try { localStorage.setItem(LAST_KEY, d); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 난이도 고르기
  function selectDiff(d) {
    diff = d;
    Array.prototype.forEach.call(els.diffs.querySelectorAll('.tf-diff'), function (b) {
      var on = b.getAttribute('data-diff') === d;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }
  els.diffs.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.tf-diff') : null;
    if (!b) return;
    selectDiff(b.getAttribute('data-diff'));
    saveDiff(diff);
  });
  els.diffs.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'ArrowUp' && k !== 'ArrowDown') return;
    e.preventDefault();
    var i = C.DIFF_ORDER.indexOf(diff) + (k === 'ArrowLeft' || k === 'ArrowUp' ? -1 : 1);
    i = (i + C.DIFF_ORDER.length) % C.DIFF_ORDER.length;
    selectDiff(C.DIFF_ORDER[i]);
    saveDiff(diff);
    var b = els.diffs.querySelector('[data-diff="' + diff + '"]');
    if (b) b.focus();
  });

  // ---------------------------------------------------------------- 시간 (탭을 숨기면 멈춘다)
  function elapsed() { return baseMs + (running ? performance.now() - t0 : 0); }
  function drawTime() { els.time.textContent = String(Math.min(999, Math.floor(elapsed() / 1000))); }
  function startClock() {
    if (running) return;
    t0 = performance.now();
    running = true;
    clearInterval(tickTimer);
    tickTimer = setInterval(drawTime, 100);
  }
  function stopClock() {
    if (running) { baseMs += performance.now() - t0; running = false; }
    clearInterval(tickTimer);
    drawTime();
  }
  function pauseNow() {
    if (phase !== 'play' || paused || !state || state.status !== 'play') return;
    paused = true;
    stopClock();
    els.pause.hidden = false;
  }
  function resumeNow() {
    if (!paused) return;
    paused = false;
    els.pause.hidden = true;
    if (phase === 'play' && state && state.status === 'play') startClock();
    focusCell(focusIdx);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseNow(); });
  els.pause.addEventListener('click', resumeNow);

  // ---------------------------------------------------------------- 판 그리기
  function cellLabel(i) {
    var s = state;
    if (s.flag[i] && !(s.status === 'lost' && s.mine[i])) return P.aFlag;
    if (s.open[i]) return fmt(P.aNum, { n: s.adj[i] });
    if (s.status === 'lost' && s.mine[i]) return P.aMine;
    return P.aHidden;
  }
  function renderCell(i) {
    var s = state, el = cells[i];
    var lost = s.status === 'lost';
    var cls = 'tf-cell';
    var txt = '';
    if (s.open[i]) {
      cls += ' is-open';
      if (s.adj[i] > 0) { cls += ' n' + s.adj[i]; txt = String(s.adj[i]); }
    } else if (lost && s.mine[i] && !s.flag[i]) {
      cls += ' is-mine' + (i === s.exploded ? ' is-boom' : '');
      txt = '💣';
    } else if (lost && s.flag[i] && !s.mine[i]) {
      cls += ' is-wrong';
      txt = '🚩';
    } else if (s.flag[i]) {
      cls += ' is-flag';
      txt = '🚩';
    }
    if (el.className !== cls) el.className = cls;
    if (el.textContent !== txt) el.textContent = txt;
    el.setAttribute('aria-label', cellLabel(i));
    if (s.open[i]) el.setAttribute('aria-disabled', 'true'); else el.removeAttribute('aria-disabled');
  }
  function renderAll() { for (var i = 0; i < state.n; i++) renderCell(i); }

  function sizeBoard() {
    if (!state) return;
    var avail = Math.max(240, (els.play.clientWidth || 448) - 12 - 4);
    var byW = Math.floor((avail - (state.w - 1) * 2) / state.w);
    var vh = window.innerHeight || 800;
    var byH = Math.floor((vh - 230 - (state.h - 1) * 2) / state.h);
    var px = Math.max(22, Math.min(byW, Math.max(byH, 26), 40));
    els.board.style.setProperty('--cell', px + 'px');
  }

  function buildBoard() {
    els.board.textContent = '';
    els.board.style.gridTemplateColumns = 'repeat(' + state.w + ', var(--cell))';
    els.board.setAttribute('aria-colcount', String(state.w));
    els.board.setAttribute('aria-rowcount', String(state.h));
    cells = [];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < state.n; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tf-cell';
      b.setAttribute('data-i', String(i));
      b.tabIndex = -1;
      b.setAttribute('aria-label', P.aHidden);
      cells.push(b);
      frag.appendChild(b);
    }
    els.board.appendChild(frag);
    focusIdx = Math.floor(state.n / 2);
    cells[focusIdx].tabIndex = 0;
    sizeBoard();
  }
  function focusCell(i) {
    if (!cells[i]) return;
    if (cells[focusIdx]) cells[focusIdx].tabIndex = -1;
    focusIdx = i;
    cells[i].tabIndex = 0;
    cells[i].focus({ preventScroll: true });
  }

  function drawHud() {
    els.mines.textContent = String(C.minesLeft(state));
    drawTime();
  }

  function setMode(on) {
    flagMode = !!on;
    els.mode.setAttribute('aria-pressed', flagMode ? 'true' : 'false');
    els.modeIco.textContent = flagMode ? '🚩' : '⛏️';
    els.modeTxt.textContent = flagMode ? P.flagMode : P.digMode;
  }
  els.mode.addEventListener('click', function () { setMode(!flagMode); });

  // ---------------------------------------------------------------- 동작
  function applyReveal(res) {
    if (res.started) startClock();
    res.opened.forEach(renderCell);
    if (res.boom) { buzz(60); finish(); return; }
    if (state.status === 'won') { buzz([20, 40, 20]); finish(); }
  }
  function actOpen(i) {
    if (phase !== 'play' || paused) return;
    var s = state;
    if (s.open[i]) {
      var cr = C.chord(s, i);
      if (!cr.ok) return;
      if (cr.boom) { renderAll(); buzz(60); finish(); return; }
      cr.opened.forEach(renderCell);
      if (s.status === 'won') { renderAll(); drawHud(); buzz([20, 40, 20]); finish(); }
      return;
    }
    if (s.flag[i]) return;
    var res = C.reveal(s, i);
    if (!res.ok) return;
    if (s.status === 'won' || s.status === 'lost') renderAll(); else renderCell(i);
    applyReveal(res);
    drawHud();
  }
  function actFlag(i) {
    if (phase !== 'play' || paused) return;
    if (C.toggleFlag(state, i)) { renderCell(i); drawHud(); buzz(15); }
  }
  function actTap(i) {
    if (phase !== 'play') return;
    if (state.open[i]) actOpen(i);
    else if (flagMode) actFlag(i);
    else actOpen(i);
  }

  // 포인터: 탭 = 열기(또는 깃발 모드면 깃발), 길게 누르기 = 깃발, 마우스 오른쪽 = contextmenu
  function cellOf(e) { var t = e.target.closest ? e.target.closest('.tf-cell') : null; return t ? Number(t.getAttribute('data-i')) : -1; }
  els.board.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' || paused) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var i = cellOf(e);
    if (i < 0) return;
    cancelPress();
    press = { i: i, x: e.clientX, y: e.clientY, long: false, moved: false, timer: 0 };
    if (e.pointerType !== 'mouse') {
      press.timer = setTimeout(function () {
        if (!press) return;
        press.long = true;
        if (!state.open[press.i]) actFlag(press.i);
      }, LONG_MS);
    }
  });
  els.board.addEventListener('pointermove', function (e) {
    if (!press || press.moved) return;
    if (Math.abs(e.clientX - press.x) > MOVE_SLOP || Math.abs(e.clientY - press.y) > MOVE_SLOP) { press.moved = true; clearTimeout(press.timer); }
  });
  els.board.addEventListener('pointerup', function (e) {
    if (!press) return;
    var p = press;
    cancelPress();
    if (p.long || p.moved || (e.pointerType === 'mouse' && e.button !== 0)) return;
    var i = cellOf(e);
    if (i === p.i) { focusIdx = i; actTap(i); }
  });
  els.board.addEventListener('pointercancel', cancelPress);
  els.board.addEventListener('pointerleave', cancelPress);
  function cancelPress() { if (press) { clearTimeout(press.timer); press = null; } }
  els.board.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var i = cellOf(e);
    if (i >= 0 && e.pointerType !== 'touch' && !press) actFlag(i);
  });
  // 키보드: Enter/Space 는 click(detail 0) 으로 들어온다
  els.board.addEventListener('click', function (e) {
    if (e.detail !== 0) return;
    var i = cellOf(e);
    if (i >= 0) actTap(i);
  });
  els.board.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var i = cellOf(e);
    if (i < 0) return;
    var x = i % state.w, y = Math.floor(i / state.w), nx = x, ny = y;
    if (e.key === 'ArrowLeft') nx--; else if (e.key === 'ArrowRight') nx++;
    else if (e.key === 'ArrowUp') ny--; else if (e.key === 'ArrowDown') ny++;
    else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); actFlag(i); return; }
    else return;
    e.preventDefault();
    if (nx >= 0 && ny >= 0 && nx < state.w && ny < state.h) focusCell(ny * state.w + nx);
  });
  // 가로채는 기본 동작: 길게 누르기 메뉴·더블탭 확대·끌기 선택
  els.board.addEventListener('selectstart', function (e) { e.preventDefault(); });
  els.board.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // ---------------------------------------------------------------- 끝
  function finish() {
    if (phase !== 'play') return;
    phase = 'ending';
    stopClock();
    cancelPress();
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

  // 이긴 판에서만 한 번 시간을 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(sec, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || state.submitted) return;
    state.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(sec);
    withTimeout(supa.submitScore(C.DIFFS[diff].game, b), 8000).then(function (rows) {
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
    var won = s.status === 'won';
    var ms = elapsed();
    var pct = Math.round(C.progress(s) * 100);
    phase = 'end';
    els.reason.textContent = (S.diffs || {})[diff] || diff;
    els.headEmoji.textContent = won ? '🏆' : '💥';
    els.head.textContent = won ? R.win : R.lose;
    els.big.textContent = won ? secs(ms) : String(pct);
    els.unit.textContent = won ? R.sec : '%';
    els.resTime.textContent = secs(ms) + ' ' + R.sec;
    els.resClear.textContent = pct + '%';
    els.newBest.hidden = true;
    var prev = getBest(diff);
    if (won && (!prev || ms < prev)) {
      setBest(diff, ms);
      els.newBest.hidden = !prev;   // 첫 기록은 "새 최고 기록!" 이라 하지 않는다
      prev = ms;
    }
    els.resBest.textContent = prev ? fmt(R.best, { t: secs(prev) + ' ' + R.sec }) : '';
    els.resBest.hidden = !prev;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (won) submitScore(ms / 1000, myRun);
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
  }

  // ---------------------------------------------------------------- 시작
  function start() {
    runId++;
    clearTimeout(endTimer);
    clearInterval(tickTimer);
    cancelPress();
    doneSent = false;
    paused = false;
    running = false;
    baseMs = 0;
    state = C.newGame(diff);
    els.pause.hidden = true;
    setMode(false);
    buildBoard();
    drawHud();
    phase = 'play';
    show('play');
    track('start');
  }
  els.startBtn.addEventListener('click', start);
  window.addEventListener('resize', sizeBoard);
  if (window.ResizeObserver) new ResizeObserver(sizeBoard).observe(els.play);

  selectDiff(loadDiff());

  if (window.setShareData) {
    window.setShareData(function () {
      var won = phase === 'end' && state && state.status === 'won';
      var lost = phase === 'end' && state && state.status === 'lost';
      var name = (S.diffs || {})[diff] || diff;
      return {
        title: R.shareTitle,
        text: won ? fmt(R.shareWin, { time: secs(elapsed()), diff: name }) : lost ? fmt(R.shareLose, { pct: Math.round(C.progress(state) * 100), diff: name }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.SWEEPER_APP = {
    phase: function () { return phase; },
    state: function () { return state; },
    best: getBest,
    elapsed: elapsed,
    diff: function () { return diff; }
  };
}());
