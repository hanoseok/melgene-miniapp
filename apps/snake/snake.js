/* apps/snake/snake.js — 시작(티징) → 카운트다운 → 뱀 게임(캔버스) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 snake-core.js(SNAKE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(액션 게임). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 필드 위 스와이프(터치·마우스 끌기)·방향키·WASD. 탭을 떠나면(visibilitychange) 자동 일시정지.
 *   prefers-reduced-motion 이면 먹을 때 퍼지는 고리·점수 글자 이동·카운트다운 팝을 끈다.
 * 디버그/검사용 핸들: window.SNAKE_APP (phase(), state(), best(), timeScale(k), turn(d))
 */
(function () {
  'use strict';

  var C = window.SNAKE_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'sn_best_v1';
  var COUNT_MS = 2400;          // 3 · 2 · 1 · Go!
  var END_DELAY = REDUCED ? 250 : 700;
  var SWIPE_MIN = 16;           // 스와이프로 칠 최소 이동(px)
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), best: $('hud-best'), pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('sn-canvas'), count: $('countdown'), countNum: $('countdown-num'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    reason: $('res-reason'), resScore: $('res-score'), newBest: $('res-newbest'), bestLine: $('res-best'),
    ate: $('res-ate'), level: $('res-level'), rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | count | play | paused | end
  var resumeTo = 'play';
  var state = null;
  var raf = 0, last = 0, speed = 1, countLeft = 0;
  var fx = [];             // 먹을 때 퍼지는 고리·떠오르는 점수 글자
  var runId = 0, doneSent = false, endTimer = 0;
  var hudScore = -1;
  var view = { w: 0, h: 0, dpr: 1, cell: 24 };
  var fontFamily = 'sans-serif';
  var swipe = null;        // { x, y, id }
  var crash = null;        // { x, y, age }

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

  // ---------------------------------------------------------------- 캔버스 크기
  function layout() {
    var shell = els.play.parentNode;
    var avail = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    var rect = els.field.getBoundingClientRect();
    var maxH = Math.max(300, window.innerHeight - Math.max(0, rect.top) - 14);
    var side = Math.max(200, Math.min(avail, maxH));
    var cell = Math.floor(side / C.COLS);
    side = cell * C.COLS;
    els.field.style.width = side + 'px';
    els.field.style.height = side + 'px';
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    els.canvas.width = Math.round(side * dpr);
    els.canvas.height = Math.round(side * dpr);
    els.canvas.style.width = side + 'px';
    els.canvas.style.height = side + 'px';
    view = { w: side, h: side, dpr: dpr, cell: cell };
    var ff = getComputedStyle(document.body).getPropertyValue('--font-display');
    fontFamily = (ff && ff.trim()) || 'sans-serif';
  }

  // ---------------------------------------------------------------- 그리기
  var INK = '#04140d';
  function rr(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function drawBoard(g, cs) {
    for (var y = 0; y < C.ROWS; y++) {
      for (var x = 0; x < C.COLS; x++) {
        g.fillStyle = (x + y) % 2 ? '#0f2a1d' : '#12331f';
        g.fillRect(x * cs, y * cs, cs, cs);
      }
    }
  }

  function drawFood(g, cs, f, tms) {
    var cx = (f.x + 0.5) * cs, cy = (f.y + 0.5) * cs;
    var pulse = REDUCED ? 1 : 1 + Math.sin(tms / 160) * 0.06;
    var r = cs * 0.38 * pulse;
    g.fillStyle = 'rgba(255, 90, 90, 0.22)';
    g.beginPath(); g.arc(cx, cy, r * 1.55, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ff4d4d';
    g.strokeStyle = INK; g.lineWidth = Math.max(1.5, cs * 0.07);
    g.beginPath(); g.arc(cx, cy + cs * 0.03, r, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.65)';
    g.beginPath(); g.ellipse(cx - r * 0.38, cy - r * 0.32, r * 0.2, r * 0.12, -0.6, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#6b3b1d'; g.lineWidth = Math.max(1.5, cs * 0.08); g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx, cy - r * 0.8); g.lineTo(cx + r * 0.1, cy - r * 1.25); g.stroke();
    g.fillStyle = '#7dff5a';
    g.beginPath(); g.ellipse(cx + r * 0.5, cy - r * 1.05, r * 0.42, r * 0.2, -0.5, 0, Math.PI * 2); g.fill();
  }

  function drawSnake(g, cs, s, dead) {
    var n = s.snake.length;
    var pad = cs * 0.08;
    for (var i = n - 1; i >= 0; i--) {
      var p = s.snake[i];
      var t = n > 1 ? i / (n - 1) : 0;
      var light = 62 - t * 18;
      g.fillStyle = dead ? 'hsl(120, 12%, ' + (light - 12) + '%)' : 'hsl(' + (96 + t * 22) + ', 78%, ' + light + '%)';
      g.strokeStyle = INK; g.lineWidth = Math.max(1.5, cs * 0.06);
      rr(g, p.x * cs + pad, p.y * cs + pad, cs - pad * 2, cs - pad * 2, cs * (i === 0 ? 0.36 : 0.26));
      g.fill(); g.stroke();
    }
    // 머리: 눈 두 개 (진행 방향 쪽으로)
    var h = s.snake[0];
    var d = s.dir;
    var fx0 = C.DX[d], fy0 = C.DY[d];
    var px = -fy0, py = fx0;
    var cx = (h.x + 0.5) * cs, cy = (h.y + 0.5) * cs;
    [-1, 1].forEach(function (side) {
      var ex = cx + fx0 * cs * 0.14 + px * side * cs * 0.2;
      var ey = cy + fy0 * cs * 0.14 + py * side * cs * 0.2;
      g.fillStyle = '#fff'; g.beginPath(); g.arc(ex, ey, cs * 0.14, 0, Math.PI * 2); g.fill();
      g.fillStyle = INK; g.beginPath(); g.arc(ex + fx0 * cs * 0.05, ey + fy0 * cs * 0.05, cs * 0.075, 0, Math.PI * 2); g.fill();
    });
  }

  function drawFx(g, cs) {
    for (var i = 0; i < fx.length; i++) {
      var f = fx[i];
      var k = f.age / f.life;
      var x = (f.x + 0.5) * cs, y = (f.y + 0.5) * cs;
      if (f.kind === 'ring') {
        g.strokeStyle = 'rgba(255, 240, 140, ' + (1 - k).toFixed(2) + ')';
        g.lineWidth = Math.max(2, cs * 0.12);
        g.beginPath(); g.arc(x, y, cs * (0.4 + k * 1.1), 0, Math.PI * 2); g.stroke();
      } else if (f.kind === 'text') {
        g.globalAlpha = 1 - k * k;
        g.fillStyle = '#fff6b0'; g.strokeStyle = INK; g.lineWidth = Math.max(2, cs * 0.12);
        g.font = Math.round(cs * 0.8) + 'px ' + fontFamily;
        g.textAlign = 'center'; g.textBaseline = 'middle';
        var ty = y - cs * (0.6 + k * 0.9);
        g.strokeText('+' + f.points, x, ty); g.fillText('+' + f.points, x, ty);
        g.globalAlpha = 1;
      }
    }
  }

  function draw() {
    var g = ctx;
    var cs = view.cell * view.dpr;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, els.canvas.width, els.canvas.height);
    if (!state) return;
    drawBoard(g, cs);
    if (state.food) drawFood(g, cs, state.food, performance.now());
    drawSnake(g, cs, state, state.over && state.reason !== 'full');
    drawFx(g, cs);
    if (crash && !REDUCED) {
      var k = Math.min(1, crash.age / 420);
      g.fillStyle = 'rgba(255, 80, 80, ' + (0.35 * (1 - k)).toFixed(3) + ')';
      g.fillRect(0, 0, els.canvas.width, els.canvas.height);
    }
  }

  function addFx(ev) {
    if (ev.type === 'eat') {
      if (!REDUCED) {
        fx.push({ kind: 'ring', x: ev.x, y: ev.y, age: 0, life: 380 });
        fx.push({ kind: 'text', x: ev.x, y: ev.y, age: 0, life: 650, points: ev.points });
      }
    } else if (ev.type === 'crash') {
      crash = { x: ev.x, y: ev.y, age: 0 };
    }
    if (fx.length > 40) fx.splice(0, fx.length - 40);
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    if (force || hudScore !== state.score) { hudScore = state.score; els.score.textContent = num(state.score); }
  }

  // ---------------------------------------------------------------- 루프
  function loop(now) {
    raf = 0;
    if (phase !== 'play' && phase !== 'count') return;
    var dt = Math.min(100, Math.max(0, now - last));
    last = now;
    var gdt = dt * speed;
    if (phase === 'count') {
      countLeft -= gdt;
      renderCount();
      if (countLeft <= 0) {
        phase = 'play';
        els.count.hidden = true;
      }
    } else {
      var events = C.step(state, gdt);
      for (var i = 0; i < events.length; i++) addFx(events[i]);
    }
    for (var j = fx.length - 1; j >= 0; j--) { fx[j].age += dt; if (fx[j].age >= fx[j].life) fx.splice(j, 1); }
    if (crash) crash.age += dt;
    draw();
    updateHud(false);
    if (state.over) { finish(); return; }
    raf = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (raf) cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  var countShown = '';
  function renderCount() {
    var n = Math.ceil((countLeft - 450) / 650);
    var label = n >= 1 ? String(Math.min(3, n)) : P.go;
    if (label !== countShown) {
      countShown = label;
      els.countNum.textContent = label;
      els.countNum.classList.toggle('is-go', n < 1);
      if (!REDUCED) { els.countNum.classList.remove('is-pop'); void els.countNum.offsetWidth; els.countNum.classList.add('is-pop'); }
    }
  }

  // ---------------------------------------------------------------- 시작 · 일시정지 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    stopLoop();
    state = C.newGame();
    fx = []; crash = null; swipe = null;
    hudScore = -1;
    doneSent = false;
    phase = 'count';
    countLeft = COUNT_MS;
    countShown = '';
    els.pausedBox.hidden = true;
    els.count.hidden = false;
    els.best.textContent = num(getBest());
    show('play');
    layout();
    renderCount();
    updateHud(true);
    draw();
    track('start');
    try { els.field.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    startLoop();
  }

  function pause() {
    if (phase !== 'play' && phase !== 'count') return;
    resumeTo = phase;
    phase = 'paused';
    stopLoop();
    swipe = null;
    els.pausedBox.hidden = false;
    try { els.resumeBtn.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }
  function resume() {
    if (phase !== 'paused') return;
    phase = resumeTo;
    els.pausedBox.hidden = true;
    try { els.field.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    startLoop();
  }

  function finish() {
    if (phase === 'end') return;
    phase = 'end';
    stopLoop();
    var myRun = runId;
    var s = state;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    endTimer = setTimeout(function () {
      if (myRun !== runId) return;
      els.reason.textContent = R[s.reason] || R.wall;
      els.reason.setAttribute('data-reason', s.reason);
      els.resScore.textContent = num(s.score);
      els.newBest.hidden = !isNew;
      els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
      els.bestLine.hidden = isNew;
      els.ate.textContent = num(s.ate);
      els.level.textContent = num(C.level(s.ate));
      show('end');
      if (!doneSent) { doneSent = true; track('done'); }
      submitScore(s, myRun);
    }, END_DELAY);
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
  function doTurn(d) {
    if (!state || (phase !== 'play' && phase !== 'count')) return;
    C.turn(state, d);
  }
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'count') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    swipe = { x: e.clientX, y: e.clientY };
    try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    e.preventDefault();
  });
  els.field.addEventListener('pointermove', function (e) {
    if (!swipe || (phase !== 'play' && phase !== 'count')) return;
    var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;
    if (Math.abs(dx) > Math.abs(dy)) doTurn(dx > 0 ? 1 : 3); else doTurn(dy > 0 ? 2 : 0);
    swipe = { x: e.clientX, y: e.clientY };
  });
  function up() { swipe = null; }
  els.field.addEventListener('pointerup', up);
  els.field.addEventListener('pointercancel', up);
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play') e.preventDefault(); });

  var KEYDIR = { ArrowUp: 0, w: 0, W: 0, ArrowRight: 1, d: 1, D: 1, ArrowDown: 2, s: 2, S: 2, ArrowLeft: 3, a: 3, A: 3 };
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (Object.prototype.hasOwnProperty.call(KEYDIR, k)) { doTurn(KEYDIR[k]); e.preventDefault(); }
    else if (k === 'p' || k === 'P' || k === 'Escape' || (k === ' ' && document.activeElement === els.field)) {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('resize', function () {
    if (phase === 'play' || phase === 'count' || phase === 'paused') { layout(); draw(); }
  });

  els.startBtn.addEventListener('click', start);
  els.pauseBtn.addEventListener('click', function () { if (phase === 'paused') resume(); else pause(); });
  els.resumeBtn.addEventListener('click', resume);

  if (window.setShareData) {
    window.setShareData(function () {
      var done = state && state.over;
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { score: num(state.score) }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.SNAKE_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: state.score, ate: state.ate, ticks: state.ticks, len: state.snake.length, dir: state.dir,
        head: state.snake[0], food: state.food, over: state.over, reason: state.reason };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(20, Number(k) || 1)); return speed; },
    turn: doTurn,
    best: getBest
  };
  show('start');
})();
