/* apps/mole/mole.js — 시작(티징) → 게임(HUD + 3×3 구멍, 광고 없음) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 규칙·점수·시간 진행은 mole-core.js(MOLE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(연타 게임 — 실수로 누르기 쉬움). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 구멍 누르기(터치·마우스, pointerdown 으로 바로 반응), 키보드 1~9(왼쪽 위부터 줄 순서)·구멍에 포커스 후 Enter/Space.
 *   prefers-reduced-motion 이면 올라오는 움직임·망치·점수 떠오름·흔들림을 끈다. 탭을 숨기면 시간도 멈춘다(프레임 시간 상한).
 * 디버그/검사용 핸들: window.MOLE_APP (phase(), state(), whack(i), best())
 */
(function () {
  'use strict';

  var C = window.MOLE_CORE;
  var UI = window.PAGE_I18N || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'mole_best_v1';
  var END_DELAY = REDUCED ? 300 : 1000;
  var FRAME_CAP = 100;     // 한 프레임에 진행하는 시간 상한(ms) — 탭이 숨겨졌다 돌아와도 한꺼번에 점프하지 않음
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), time: $('hud-time'), best: $('hud-best'), bar: $('hud-bar'),
    board: $('board'), over: $('over-overlay'),
    reason: $('res-reason'), resScore: $('res-score'), newBest: $('res-newbest'), resBest: $('res-best'),
    tierEmoji: $('res-tier-emoji'), tierName: $('res-tier'), hits: $('res-hits'), bombs: $('res-bombs'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  var holes = Array.prototype.slice.call(els.board.querySelectorAll('.tf-hole'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | play | ending | end
  var state = null;
  var runId = 0, doneSent = false, endTimer = 0, raf = 0, lastTs = 0;
  var bestAtStart = 0;
  var fxTimers = [];

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

  // ---------------------------------------------------------------- 구멍 그리기
  function setHole(i, st, kind) {
    var h = holes[i];
    if (!h) return;
    if (kind) h.setAttribute('data-kind', kind);
    h.setAttribute('data-state', st);
  }
  function clearHole(i) {
    var h = holes[i];
    h.setAttribute('data-state', '');
    h.removeAttribute('data-kind');
    var fx = h.querySelector('.tf-fx');
    if (fx) { fx.textContent = ''; fx.className = 'tf-fx'; }
  }
  function resetBoard() {
    fxTimers.forEach(clearTimeout);
    fxTimers = [];
    holes.forEach(function (h, i) { clearHole(i); });
    els.board.classList.remove('tf-shake');
  }
  function later(fn, ms) { var id = setTimeout(fn, ms); fxTimers.push(id); }

  function updateHud() {
    var left = Math.max(0, C.DURATION - state.t);
    els.score.textContent = num(state.score);
    els.best.textContent = num(Math.max(bestAtStart, state.score));
    els.time.textContent = String(Math.ceil(left / 1000));
    els.bar.style.transform = 'scaleX(' + (left / C.DURATION).toFixed(4) + ')';
    els.time.parentNode.classList.toggle('tf-low', left <= 5000 && left > 0);
  }

  function applyEvents(events) {
    events.forEach(function (e) {
      if (e.type === 'spawn') setHole(e.hole, 'up', e.kind);
      else if (e.type === 'leave') {
        var h = holes[e.hole];
        if (h && h.getAttribute('data-state') === 'up') { clearHole(e.hole); }
      }
    });
  }

  function popFx(i, text, cls) {
    var fx = holes[i].querySelector('.tf-fx');
    if (!fx) return;
    fx.textContent = text;
    fx.className = 'tf-fx';
    void fx.offsetWidth; // 애니메이션 다시 시작
    fx.className = 'tf-fx ' + cls;
  }

  function swing(i) {
    var h = holes[i];
    h.classList.remove('tf-swing');
    void h.offsetWidth;
    h.classList.add('tf-swing');
  }

  // ---------------------------------------------------------------- 시작 · 진행 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    cancelAnimationFrame(raf);
    resetBoard();
    state = C.newGame();
    bestAtStart = getBest();
    doneSent = false;
    phase = 'play';
    els.over.hidden = true;
    show('play');
    updateHud();
    track('start');
    lastTs = 0;
    raf = requestAnimationFrame(frame);
  }

  function frame(ts) {
    if (phase !== 'play') return;
    var dt = lastTs ? Math.min(FRAME_CAP, ts - lastTs) : 0;
    lastTs = ts;
    var events = C.tick(state, dt);
    applyEvents(events);
    updateHud();
    if (state.over) { timeUp(); return; }
    raf = requestAnimationFrame(frame);
  }

  function timeUp() {
    phase = 'ending';
    var myRun = runId;
    els.over.hidden = false;
    endTimer = setTimeout(function () { if (myRun === runId) finish(); }, END_DELAY);
  }

  function whack(i) {
    if (phase !== 'play' || !state) return null;
    swing(i);
    var res = C.whack(state, i);
    if (res.kind === 'mole' || res.kind === 'gold') {
      setHole(i, 'hit', res.kind);
      popFx(i, '+' + res.points, res.kind === 'gold' ? 'tf-fx-gold' : 'tf-fx-up');
      later(function () { if (holes[i].getAttribute('data-state') === 'hit') clearHole(i); }, REDUCED ? 220 : 340);
    } else if (res.kind === 'bomb') {
      setHole(i, 'boom', 'bomb');
      popFx(i, res.points ? String(res.points) : '0', 'tf-fx-down');
      if (!REDUCED) { els.board.classList.remove('tf-shake'); void els.board.offsetWidth; els.board.classList.add('tf-shake'); }
      later(function () { if (holes[i].getAttribute('data-state') === 'boom') clearHole(i); }, REDUCED ? 260 : 420);
    }
    updateHud();
    return res;
  }

  function finish() {
    if (phase === 'end' || !state) return;
    phase = 'end';
    clearTimeout(endTimer);
    cancelAnimationFrame(raf);
    resetBoard();
    var s = state;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    els.over.hidden = true;
    els.reason.textContent = R.timeUp;
    els.resScore.textContent = num(s.score);
    var tier = C.tierOf(s.score);
    els.tierEmoji.textContent = C.TIER_EMOJI[tier];
    els.tierName.textContent = (R.tiers || [])[tier] || '';
    els.newBest.hidden = !isNew;
    els.resBest.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
    els.resBest.hidden = isNew;
    els.hits.textContent = num(s.hits);
    els.bombs.textContent = num(s.bombs);
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
  els.board.addEventListener('pointerdown', function (e) {
    if (phase !== 'play') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var h = e.target && e.target.closest ? e.target.closest('.tf-hole') : null;
    if (!h) return;
    e.preventDefault();
    whack(holes.indexOf(h));
  });
  // 키보드(Enter/Space)로 눌렀을 때 — 마우스·터치는 pointerdown 에서 이미 처리(detail > 0)
  els.board.addEventListener('click', function (e) {
    if (e.detail !== 0) return;
    var h = e.target && e.target.closest ? e.target.closest('.tf-hole') : null;
    if (h) whack(holes.indexOf(h));
  });
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!/^[1-9]$/.test(e.key)) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    e.preventDefault();
    whack(Number(e.key) - 1);
  });
  els.board.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  // iOS 사파리에서 판 위 연타가 확대·스크롤로 새지 않게
  els.board.addEventListener('touchmove', function (e) { if (phase === 'play') e.preventDefault(); }, { passive: false });

  els.startBtn.addEventListener('click', start);

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

  window.MOLE_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, t: state.t, score: state.score, hits: state.hits, bombs: state.bombs, over: state.over,
        holes: state.holes.map(function (c) { return c ? c.kind : null; }) };
    },
    whack: whack,
    best: getBest
  };
  show('start');
})();
