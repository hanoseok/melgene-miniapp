/* apps/memory/memory.js — 시작(티징 + 난이도) → 게임(HUD + 카드 판, 광고 없음) → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 memory-core.js(MEMORY_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 입력: 카드를 pointerdown 으로 바로 받는다(300ms 지연 없음, touch-action: manipulation 으로 더블탭 확대 없음). 키보드 Enter/Space 도 같은 동작(click detail 0).
 * 두 장이 다르면 MISS_MS(0.7초) 뒤 다시 엎는다 — 그 전에 다른 카드를 누르면 바로 엎고 새 카드를 뒤집는다(core.flip).
 * 시계: 첫 카드를 뒤집을 때 시작, 0.1초 표시. 탭을 숨기면(visibilitychange) 멈추고 판을 가린다 → 누르면 이어서.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 최고 기록(난이도별 최단 시간 + 그때 횟수): localStorage memory_best_v1. 마지막 난이도: memory_level_v1.
 * 앞면 그림은 카드가 앞면일 때만 DOM 에 넣는다(엎으면 애니메이션 뒤 지움).
 * 디버그/검사용 핸들: window.MEMORY_APP (phase(), state(), elapsed(), level(), best())
 */
(function () {
  'use strict';

  var C = window.MEMORY_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var S = UI.start || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'memory_best_v1';
  var LAST_KEY = 'memory_level_v1';
  var MISS_MS = 700;
  var FLIP_MS = REDUCED ? 0 : 320;
  var END_DELAY = REDUCED ? 300 : 750;
  var LANG = document.documentElement.lang || 'en';
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'), levels: $('levels'),
    time: $('hud-time'), moves: $('hud-moves'), pairs: $('hud-pairs'), bar: $('bar-fill'),
    field: $('field'), board: $('board'), pause: $('pause-btn'),
    level: $('res-level'), big: $('res-big'), newBest: $('res-newbest'), resBest: $('res-best'),
    resMoves: $('res-moves'), acc: $('res-acc'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | ready | play | paused | ending | end
  var state = null;
  var level = 'easy';
  var runId = 0, doneSent = false, endTimer = 0, missTimer = 0, raf = 0;
  var baseMs = 0, t0 = 0, running = false, finalMs = 0;
  var cards = [];
  var clearTimers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function secs1(ms) { var v = Math.floor(ms / 100) / 10; return NF1 ? NF1.format(v) : v.toFixed(1); }
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
  function getBest(lv) {
    var b = readBest()[lv];
    var ms = b && Number(b.ms);
    return isFinite(ms) && ms > 0 ? { ms: ms, moves: Number(b.moves) || 0 } : null;
  }
  function setBest(lv, ms, moves) {
    var o = readBest();
    o[lv] = { ms: Math.round(ms), moves: moves };
    try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ }
  }
  function loadLevel() {
    try { var m = localStorage.getItem(LAST_KEY); if (m && C.LEVELS[m]) return m; } catch (e) { /* noop */ }
    return 'easy';
  }
  function saveLevel(m) { try { localStorage.setItem(LAST_KEY, m); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 난이도 고르기
  function selectLevel(m) {
    level = m;
    Array.prototype.forEach.call(els.levels.querySelectorAll('.mm-level'), function (b) {
      var on = b.getAttribute('data-level') === m;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }
  els.levels.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.mm-level') : null;
    if (!b) return;
    selectLevel(b.getAttribute('data-level'));
    saveLevel(level);
  });
  els.levels.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'ArrowUp' && k !== 'ArrowDown') return;
    e.preventDefault();
    var i = C.LEVEL_ORDER.indexOf(level) + (k === 'ArrowLeft' || k === 'ArrowUp' ? -1 : 1);
    i = (i + C.LEVEL_ORDER.length) % C.LEVEL_ORDER.length;
    selectLevel(C.LEVEL_ORDER[i]);
    saveLevel(level);
    var b = els.levels.querySelector('[data-level="' + level + '"]');
    if (b) b.focus();
  });

  // ---------------------------------------------------------------- 시간 (0.1초)
  function clockMs() { return baseMs + (running ? performance.now() - t0 : 0); }
  function drawTime() { els.time.textContent = secs1(clockMs()); }
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
  function renderCard(i) {
    var c = state.cards[i], el = cards[i];
    var covered = phase === 'paused';
    var face = (c.up || c.matched) && !covered;
    el.classList.toggle('is-up', face);
    el.classList.toggle('is-matched', c.matched);
    var front = el.firstChild.lastChild;
    clearTimeout(clearTimers[i]);
    if (face) {
      if (front.textContent !== C.SYMBOLS[c.sym]) front.textContent = C.SYMBOLS[c.sym];
      el.removeAttribute('aria-label');
    } else {
      // 뒤집히는 동안은 그림을 남겨 두고, 다 엎은 뒤 지운다
      if (FLIP_MS) clearTimers[i] = setTimeout(function () { if (!el.classList.contains('is-up')) front.textContent = ''; }, FLIP_MS + 40);
      else front.textContent = '';
      el.setAttribute('aria-label', fmt(P.aDown, { n: i + 1 }));
    }
    if (c.matched || covered) el.setAttribute('aria-disabled', 'true'); else el.removeAttribute('aria-disabled');
    el.setAttribute('data-state', covered ? 'covered' : c.matched ? 'matched' : c.up ? 'up' : 'down');
  }
  function renderAll() { for (var i = 0; i < state.cards.length; i++) renderCard(i); }
  function buildBoard() {
    els.board.textContent = '';
    els.board.setAttribute('data-level', level);
    els.field.setAttribute('data-level', level);
    els.board.style.gridTemplateColumns = 'repeat(' + state.cols + ', 1fr)';
    cards = [];
    clearTimers.forEach(function (t) { clearTimeout(t); });
    clearTimers = [];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < state.cards.length; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'mm-card';
      b.setAttribute('data-i', String(i));
      var inner = document.createElement('span');
      inner.className = 'mm-card-inner';
      var back = document.createElement('span');
      back.className = 'mm-card-back';
      back.setAttribute('aria-hidden', 'true');
      var front = document.createElement('span');
      front.className = 'mm-card-front';
      inner.appendChild(back);
      inner.appendChild(front);
      b.appendChild(inner);
      cards.push(b);
      frag.appendChild(b);
    }
    els.board.appendChild(frag);
    renderAll();
  }
  function drawHud() {
    els.moves.textContent = num(state.moves);
    els.pairs.textContent = state.found + '/' + state.pairs;
    els.bar.style.width = (C.progress(state) * 100).toFixed(1) + '%';
    drawTime();
  }
  function flash(el, cls, ms) {
    el.classList.remove(cls);
    void el.offsetWidth;   // 같은 애니메이션을 다시 걸기
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms);
  }

  // ---------------------------------------------------------------- 일시정지 (탭을 숨기면)
  function pauseNow() {
    if (phase !== 'play' && phase !== 'ready') return;
    stopClock();
    clearTimeout(missTimer);
    C.hideMismatch(state);   // 틀린 두 장은 엎어 둔다 (가린 채로 외우기 방지)
    phase = 'paused';
    renderAll();
    els.pause.hidden = false;
  }
  function resumeNow() {
    if (phase !== 'paused') return;
    els.pause.hidden = true;
    phase = state.flips ? 'play' : 'ready';
    renderAll();
    if (phase === 'play') startClock();
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseNow(); });
  els.pause.addEventListener('click', resumeNow);

  // ---------------------------------------------------------------- 입력
  function hit(i) {
    if ((phase !== 'play' && phase !== 'ready') || !state) return;
    var r = C.flip(state, i);
    if (!r.ok) return;
    if (phase === 'ready') { phase = 'play'; startClock(); }
    clearTimeout(missTimer);
    (r.hidden || []).forEach(renderCard);
    renderCard(i);
    if (r.match) {
      r.pair.forEach(function (k) { renderCard(k); if (!REDUCED) flash(cards[k], 'is-pop', 420); });
      buzz(20);
    } else if (r.mismatch) {
      if (!REDUCED) r.pair.forEach(function (k) { flash(cards[k], 'is-miss', 420); });
      var myRun = runId;
      missTimer = setTimeout(function () {
        if (myRun !== runId || phase !== 'play') return;
        C.hideMismatch(state).forEach(renderCard);
      }, MISS_MS);
    }
    drawHud();
    if (r.done) finish();
  }
  function cardOf(e) { var t = e.target.closest ? e.target.closest('.mm-card') : null; return t ? Number(t.getAttribute('data-i')) : -1; }
  els.board.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var i = cardOf(e);
    if (i < 0) return;
    e.preventDefault();   // 포커스·글자 선택·길게 누르기 메뉴 막기 — 누르는 순간 바로 처리
    hit(i);
  });
  // 키보드: Enter/Space 는 click(detail 0) 으로 들어온다 (포인터 click 은 pointerdown 에서 이미 처리)
  els.board.addEventListener('click', function (e) {
    if (e.detail !== 0) return;
    var i = cardOf(e);
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
    finalMs = clockMs();
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
    if (!supa || !supa.enabled || !supa.enabled() || state.submitted || state.status !== 'done' || !C.plausible(level, sec, state.moves)) return;
    state.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(sec);
    withTimeout(supa.submitScore(C.LEVELS[level].game, b), 8000).then(function (rows) {
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
    var L = C.LEVELS[level];
    phase = 'end';
    els.level.textContent = ((S.levels || {})[level] || level) + ' · ' + L.cols + ' × ' + L.rows;
    els.big.textContent = secs1(ms);
    els.resMoves.textContent = num(s.moves);
    els.acc.textContent = num(C.accuracy(s)) + '%';
    els.newBest.hidden = true;
    var prev = getBest(level);
    if (!prev || ms < prev.ms) {
      setBest(level, ms, s.moves);
      els.newBest.hidden = !prev;   // 첫 기록은 "새 최고 기록!" 이라 하지 않는다
      prev = { ms: ms, moves: s.moves };
    }
    els.resBest.textContent = fmt(R.best, { t: secs1(prev.ms) + ' ' + R.sec });
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
    clearTimeout(missTimer);
    cancelAnimationFrame(raf);
    doneSent = false;
    running = false;
    baseMs = 0;
    finalMs = 0;
    state = C.newGame(level);
    els.pause.hidden = true;
    phase = 'ready';      // 첫 카드를 뒤집으면 시계가 돈다
    buildBoard();
    drawHud();
    show('play');
    track('start');
  }
  els.startBtn.addEventListener('click', start);

  selectLevel(loadLevel());

  if (window.setShareData) {
    window.setShareData(function () {
      var done = phase === 'end' && state && state.status === 'done';
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { time: secs1(finalMs), moves: num(state.moves), pairs: state.pairs }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.MEMORY_APP = {
    phase: function () { return phase; },
    state: function () { return state; },
    best: getBest,
    elapsed: clockMs,
    level: function () { return level; }
  };
}());
