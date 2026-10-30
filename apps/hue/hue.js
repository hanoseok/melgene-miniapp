/* apps/hue/hue.js — 시작(티징) → 다른 색 찾기(n×n 색 판 + 60초) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·색은 hue-core.js(HUE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 칸을 누르기(마우스·터치 click), 키보드(판 #board 포커스 — 화살표로 옮기고 Enter/Space 로 고르기).
 * 탭을 떠나면(visibilitychange hidden) 시계를 멈추고, 돌아오면 이어 간다.
 * prefers-reduced-motion 이면 흔들림·떠오름 애니메이션을 끄고 끝 화면도 빨리.
 * 디버그/검사용 핸들: window.HUE_APP (phase(), state(), pick(i), oddIndex(), solve(n), miss(), expire(), best())
 */
(function () {
  'use strict';

  var C = window.HUE_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'hue_best_v1';
  var END_DELAY = REDUCED ? 500 : 1400;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    level: $('hud-level'), time: $('hud-time'), best: $('hud-best'), fill: $('time-fill'),
    board: $('board'), pops: $('pops'), over: $('over-overlay'), hint: $('play-hint'),
    resScore: $('res-score'), tier: $('res-tier'), newBest: $('res-newbest'), bestLine: $('res-best'),
    misses: $('res-misses'), grid: $('res-grid'), rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';      // start | play | over | end
  var g = null;
  var tiles = [];
  var runId = 0, doneSent = false, endTimer = 0, raf = 0;
  var t0 = 0, pausedAt = 0, pausedMs = 0;
  var cursor = -1;          // 키보드 커서(칸 번호), -1 = 안 보임
  var lastSec = -1;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

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

  // ---------------------------------------------------------------- 시간
  function elapsed() {
    var t = now() - t0 - pausedMs;
    if (pausedAt) t -= now() - pausedAt;
    return Math.max(0, t);
  }
  function left() { return g ? C.timeLeft(g, elapsed()) : C.TIME_MS; }
  function renderTime() {
    var ms = left();
    var sec = Math.ceil(ms / 1000);
    if (sec !== lastSec) {
      lastSec = sec;
      els.time.textContent = num(sec);
      els.time.parentNode.classList.toggle('low', sec <= 10);
    }
    els.fill.style.transform = 'scaleX(' + (ms / C.TIME_MS).toFixed(4) + ')';
    return ms;
  }
  function loop() {
    raf = 0;
    if (phase !== 'play') return;
    if (renderTime() <= 0) { timeUp(); return; }
    if (!pausedAt) raf = requestAnimationFrame(loop);
  }
  function startLoop() { if (!raf && phase === 'play' && !pausedAt) raf = requestAnimationFrame(loop); }

  document.addEventListener('visibilitychange', function () {
    if (phase !== 'play') return;
    if (document.hidden) {
      if (!pausedAt) pausedAt = now();
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    } else if (pausedAt) {
      pausedMs += now() - pausedAt;
      pausedAt = 0;
      startLoop();
    }
  });

  // ---------------------------------------------------------------- 그리기
  function renderRound() {
    var rd = g.round;
    var n = rd.size;
    els.board.style.setProperty('--n', n);
    els.board.setAttribute('data-n', n);
    var frag = document.createDocumentFragment();
    tiles = [];
    for (var i = 0; i < rd.count; i++) {
      var d = document.createElement('div');
      d.className = 'hue-tile';
      d.setAttribute('data-i', i);
      d.style.background = i === rd.odd ? rd.oddColor : rd.base;
      frag.appendChild(d);
      tiles.push(d);
    }
    els.board.innerHTML = '';
    els.board.appendChild(frag);
    if (cursor >= rd.count) cursor = rd.count - 1;
    renderCursor();
    els.level.textContent = num(g.score);
  }
  function renderCursor() {
    tiles.forEach(function (t, i) { t.classList.toggle('cur', i === cursor); });
  }

  function pop(text, i, cls) {
    var t = tiles[i];
    if (!t) return;
    var n = g.round.size;
    var d = document.createElement('div');
    d.className = 'hue-pop' + (cls ? ' ' + cls : '') + (REDUCED ? ' still' : '');
    d.textContent = text;
    d.style.left = (((i % n) + 0.5) / n * 100).toFixed(2) + '%';
    d.style.top = ((Math.floor(i / n) + 0.5) / n * 100).toFixed(2) + '%';
    els.pops.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, REDUCED ? 600 : 900);
    while (els.pops.children.length > 5) els.pops.removeChild(els.pops.firstChild);
  }

  // ---------------------------------------------------------------- 고르기
  function choose(i) {
    if (phase !== 'play' || !g || pausedAt) return null;
    var res = C.pick(g, i);
    if (!res) return null;
    if (res.ok) {
      renderRound();
      els.board.classList.remove('bump', 'shake');
      if (!REDUCED) { void els.board.offsetWidth; els.board.classList.add('bump'); }
    } else {
      var t = tiles[i];
      if (t) {
        t.classList.remove('bad');
        void t.offsetWidth;
        t.classList.add('bad');
      }
      pop(fmt(P.penalty, { n: Math.round(C.PENALTY_MS / 1000) }), i, 'minus');
      els.board.classList.remove('shake', 'bump');
      if (!REDUCED) { void els.board.offsetWidth; els.board.classList.add('shake'); }
      if (renderTime() <= 0) timeUp();
    }
    return res;
  }

  els.board.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('.hue-tile') : null;
    if (!t) return;
    if (e.detail !== 0) { cursor = -1; renderCursor(); }
    choose(Number(t.getAttribute('data-i')));
  });
  els.board.addEventListener('animationend', function (e) {
    if (e.target === els.board) els.board.classList.remove('shake', 'bump');
    else if (e.target.classList) e.target.classList.remove('bad');
  });
  els.board.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  els.board.addEventListener('keydown', function (e) {
    if (phase !== 'play' || !g || e.altKey || e.ctrlKey || e.metaKey) return;
    var n = g.round.size, k = e.key;
    var dr = k === 'ArrowUp' ? -1 : k === 'ArrowDown' ? 1 : 0;
    var dc = k === 'ArrowLeft' ? -1 : k === 'ArrowRight' ? 1 : 0;
    if (dr || dc) {
      e.preventDefault();
      if (cursor < 0) cursor = 0;
      else {
        var r = Math.max(0, Math.min(n - 1, Math.floor(cursor / n) + dr));
        var c = Math.max(0, Math.min(n - 1, (cursor % n) + dc));
        cursor = r * n + c;
      }
      renderCursor();
      return;
    }
    if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
      e.preventDefault();
      if (cursor < 0) { cursor = 0; renderCursor(); return; }
      choose(cursor);
    }
  });

  // ---------------------------------------------------------------- 시작 · 끝
  function start(byKey) {
    runId++;
    clearTimeout(endTimer);
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    g = C.newGame();
    doneSent = false;
    phase = 'play';
    t0 = now(); pausedAt = 0; pausedMs = 0; lastSec = -1;
    cursor = byKey ? 0 : -1;
    els.over.hidden = true;
    els.pops.innerHTML = '';
    els.board.classList.remove('shake', 'bump', 'done');
    els.best.textContent = num(getBest());
    show('play');
    renderRound();
    renderTime();
    if (byKey) { try { els.board.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
    track('start');
    startLoop();
  }

  function timeUp() {
    if (phase !== 'play') return;
    phase = 'over';
    g.over = true;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    els.time.textContent = '0';
    els.fill.style.transform = 'scaleX(0)';
    // 정답 칸 살짝 보여 주기(방금 그 판의 것만)
    var t = tiles[g.round.odd];
    if (t) t.classList.add('reveal');
    els.board.classList.add('done');
    els.over.hidden = false;
    var myRun = runId;
    clearTimeout(endTimer);
    endTimer = setTimeout(function () { if (myRun === runId) finish(); }, END_DELAY);
  }

  function finish() {
    if (phase === 'end' || !g) return;
    phase = 'end';
    var myRun = runId;
    var prev = getBest();
    var isNew = g.score > prev;
    if (isNew) setBest(g.score);
    var tiers = R.tiers || [];
    var tier = tiers[C.tierOf(g.score)] || '';
    els.resScore.textContent = num(g.score);
    els.tier.textContent = tier;
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, g.score)) });
    els.bestLine.hidden = isNew;
    els.misses.textContent = num(g.misses);
    els.grid.textContent = fmt(R.gridValue, { n: g.round.size });
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(g, myRun);
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
  function submitScore(st, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || st.submitted) return;
    st.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(st.score);
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

  els.startBtn.addEventListener('click', function (e) { start(e.detail === 0); });

  if (window.setShareData) {
    window.setShareData(function () {
      var done = g && (phase === 'over' || phase === 'end');
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { n: num(g.score), tier: (R.tiers || [])[C.tierOf(g.score)] || '' }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: function () { start(false); } });

  window.HUE_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!g) return null;
      return { seed: g.seed, level: g.level, score: g.score, misses: g.misses, size: g.round.size, count: g.round.count,
        base: g.round.base, oddColor: g.round.oddColor, delta: g.round.delta, left: left(), paused: !!pausedAt, cursor: cursor };
    },
    pick: function (i) { var r = choose(i); return r ? { ok: r.ok } : null; },
    oddIndex: function () { return g ? g.round.odd : -1; },
    solve: function (n) { var k = 0; while (phase === 'play' && k < (n || 1)) { if (!choose(g.round.odd)) break; k++; } return k; },
    miss: function () { if (!g) return null; var i = g.round.odd === 0 ? 1 : 0; var r = choose(i); return r ? { ok: r.ok, index: i } : null; },
    expire: function () { if (phase !== 'play' || !g) return false; g.penaltyMs += C.TIME_MS; loop(); return true; },
    best: getBest
  };
  show('start');
})();
