/* apps/game2048/game2048.js — 시작(티징) → 게임(HUD + 4×4 판, 광고 없음) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 규칙·점수는 game2048-core.js(G2048_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 판 위에서 스와이프(터치·마우스 끌기), 방향키·WASD. 2048 을 만들면 "계속하기 / 여기서 끝내기", 더 못 움직이면 끝.
 *   prefers-reduced-motion 이면 미끄러짐·튀어나옴·점수 떠오름을 끈다.
 * 디버그/검사용 핸들: window.G2048_APP (phase(), state(), move(dir), best())
 */
(function () {
  'use strict';

  var C = window.G2048_CORE;
  var UI = window.PAGE_I18N || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'game2048_best_v1';
  var SLIDE_MS = REDUCED ? 0 : 110;
  var OVER_DELAY = REDUCED ? 300 : 1100;
  var SWIPE_MIN = 24;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), best: $('hud-best'), gain: $('hud-gain'),
    board: $('board'), tiles: $('tiles'), won: $('won-overlay'), keepBtn: $('keep-btn'), finishBtn: $('finish-btn'), over: $('over-overlay'),
    reason: $('res-reason'), resScore: $('res-score'), newBest: $('res-newbest'), resBest: $('res-best'),
    biggest: $('res-biggest'), moves: $('res-moves'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | play | won | end
  var state = null;
  var nodes = {};          // 타일 id → 요소
  var pending = null, pendingTimer = 0;
  var runId = 0, doneSent = false, endTimer = 0;
  var geo = { cs: 0, gap: 0 };
  var swipe = null;
  var bestAtStart = 0;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 최고 기록 (이 브라우저)
  function getBest() {
    try { var v = Number(localStorage.getItem(BEST_KEY)); return isFinite(v) && v > 0 ? Math.floor(v) : 0; } catch (e) { return 0; }
  }
  function setBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 타일 그리기
  function tileClass(v) { return 'tf-tile tf-v' + (v <= 2048 ? v : 'big') + ' tf-d' + String(v).length; }
  function layout() {
    var w = els.board.clientWidth;
    if (!w) return;
    geo.gap = Math.max(6, Math.round(w * 0.03));
    geo.cs = (w - geo.gap * 5) / C.SIZE;
    els.board.style.setProperty('--cs', geo.cs + 'px');
    els.board.style.setProperty('--gap', geo.gap + 'px');
    Object.keys(nodes).forEach(function (id) { place(nodes[id], nodes[id]._r, nodes[id]._c); });
  }
  function place(el, r, c) {
    el._r = r; el._c = c;
    el.style.transform = 'translate(' + (geo.gap + c * (geo.cs + geo.gap)) + 'px,' + (geo.gap + r * (geo.cs + geo.gap)) + 'px)';
  }
  function addTile(t, kind) {
    var el = document.createElement('div');
    el.className = tileClass(t.v);
    var face = document.createElement('span');
    face.className = 'tf-face' + (kind ? ' tf-' + kind : '');
    face.textContent = t.v;
    el.appendChild(face);
    place(el, t.r, t.c);
    els.tiles.appendChild(el);
    nodes[t.id] = el;
  }
  function renderAll() {
    els.tiles.textContent = '';
    nodes = {};
    C.tiles(state).forEach(function (t) { addTile(t, 'new'); });
  }
  function flush() {
    clearTimeout(pendingTimer);
    var res = pending;
    pending = null;
    if (!res) return;
    res.removed.forEach(function (id) { var el = nodes[id]; if (el && el.parentNode) el.parentNode.removeChild(el); delete nodes[id]; });
    res.merged.forEach(function (t) { addTile(t, REDUCED ? '' : 'merged'); });
    if (res.spawn) addTile(res.spawn, REDUCED ? '' : 'new');
  }
  function animate(res) {
    flush();
    res.slides.forEach(function (s) { var el = nodes[s.id]; if (el) place(el, s.r, s.c); });
    res.removed.forEach(function (id) { var el = nodes[id]; if (el) el.style.zIndex = '1'; });
    pending = res;
    if (SLIDE_MS) pendingTimer = setTimeout(flush, SLIDE_MS); else flush();
  }

  function updateHud(gained) {
    els.score.textContent = num(state.score);
    els.best.textContent = num(Math.max(bestAtStart, state.score));
    if (gained && !REDUCED) {
      var g = els.gain;
      g.textContent = '+' + num(gained);
      g.classList.remove('tf-gain-on');
      void g.offsetWidth; // 애니메이션 다시 시작
      g.classList.add('tf-gain-on');
    }
  }

  // ---------------------------------------------------------------- 시작 · 밀기 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    pending = null; clearTimeout(pendingTimer);
    state = C.newGame();
    bestAtStart = getBest();
    doneSent = false;
    phase = 'play';
    els.won.hidden = true;
    els.over.hidden = true;
    show('play');
    layout();
    renderAll();
    updateHud(0);
    track('start');
    try { els.board.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  function move(dir) {
    if (phase !== 'play' || !state) return false;
    var res = C.move(state, dir);
    if (!res) return false;
    animate(res);
    updateHud(res.gained);
    if (res.over) {
      phase = 'over';
      var myRun = runId;
      endTimer = setTimeout(function () {
        if (myRun !== runId) return;
        flush();
        els.over.hidden = false;
        endTimer = setTimeout(function () { if (myRun === runId) finish(); }, OVER_DELAY);
      }, SLIDE_MS + 120);
    } else if (res.justWon) {
      phase = 'won';
      setTimeout(function () {
        if (phase !== 'won') return;
        els.won.hidden = false;
        try { els.keepBtn.focus({ preventScroll: true }); } catch (e) { /* noop */ }
      }, SLIDE_MS + 160);
    }
    return true;
  }

  function keepGoing() {
    if (phase !== 'won') return;
    els.won.hidden = true;
    phase = 'play';
    try { els.board.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  function finish() {
    if (phase === 'end' || !state) return;
    phase = 'end';
    clearTimeout(endTimer);
    flush();
    var s = state;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    els.won.hidden = true;
    els.over.hidden = true;
    els.reason.textContent = s.won ? R.won : R.over;
    els.reason.className = 'tf-eyebrow' + (s.won ? ' tf-eyebrow-won' : '');
    els.resScore.textContent = num(s.score);
    els.newBest.hidden = !isNew;
    els.resBest.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
    els.resBest.hidden = isNew;
    els.biggest.className = 'tf-stat-tile ' + tileClass(s.maxTile);
    els.biggest.textContent = s.maxTile;
    els.moves.textContent = num(s.moves);
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(s, runId);
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

  // 한 판에 한 번 점수를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(s, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || s.submitted) return;
    s.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(s.score);
    withTimeout(supa.submitScore(C.GAME, b), 8000).then(function (rows) {
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

  // ---------------------------------------------------------------- 입력
  var KEYS = {
    ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
    a: 'left', d: 'right', w: 'up', s: 'down', A: 'left', D: 'right', W: 'up', S: 'down'
  };
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var dir = KEYS[e.key];
    if (!dir) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    move(dir);
  });

  els.board.addEventListener('pointerdown', function (e) {
    if (phase !== 'play') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    swipe = { id: e.pointerId, x: e.clientX, y: e.clientY };
    try { els.board.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
  });
  function endSwipe(e) {
    if (!swipe || e.pointerId !== swipe.id) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    swipe = null;
    var ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < SWIPE_MIN) return;
    move(ax > ay ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  }
  els.board.addEventListener('pointerup', endSwipe);
  els.board.addEventListener('pointercancel', function () { swipe = null; });
  // iOS 사파리에서 판 위 스와이프가 화면 스크롤로 새지 않게
  els.board.addEventListener('touchmove', function (e) { if (phase === 'play') e.preventDefault(); }, { passive: false });

  window.addEventListener('resize', function () { if (!els.play.hidden) layout(); });

  els.startBtn.addEventListener('click', start);
  els.keepBtn.addEventListener('click', keepGoing);
  els.finishBtn.addEventListener('click', finish);

  if (window.setShareData) {
    window.setShareData(function () {
      var done = phase === 'end' && state;
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { score: num(state.score) }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.G2048_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: state.score, moves: state.moves, maxTile: state.maxTile, won: state.won, over: state.over,
        tiles: C.tiles(state), dom: els.tiles.children.length };
    },
    move: move,
    best: getBest
  };
  show('start');
})();
