/* apps/brick/brick.js — 시작(티징) → 게임(HUD + 캔버스, 광고 없음) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 규칙·물리는 brick-core.js(BRICK_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 캔버스: 논리 좌표(C.W×C.H)를 화면 크기 × devicePixelRatio 로 늘려 그린다(선명하게). 배경·벽돌은 바뀔 때만 따로 그려 둔 층(layer)을 붙인다.
 * 입력: 판 위를 끌기(터치·펜) / 마우스 움직이기 → 패들 x, 손을 떼거나 클릭 → 발사. 키보드 ← → (A D) 이동, Space·↑·Enter 발사.
 *   캔버스는 touch-action: none — 패들을 끄는 동안 페이지가 스크롤되지 않는다. 게임 중 화살표·Space 의 기본 스크롤도 막는다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * prefers-reduced-motion 이면 파편·깜빡임을 끈다. 탭을 숨기면 시간도 멈춘다(프레임 시간 상한).
 * 디버그/검사용 핸들: window.BRICK_APP (phase(), state(), best(), endNow())
 */
(function () {
  'use strict';

  var C = window.BRICK_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'brick_best_v1';
  var END_DELAY = REDUCED ? 500 : 1300;
  var FRAME_CAP = 50;          // 한 프레임에 진행하는 시간 상한(ms)
  var KEY_SPEED = 470;         // 키보드 패들 속도(논리 단위/초)
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();
  // 줄 색 (style.css 의 --pink --orange --yellow --lime --cyan --violet 와 같은 값)
  var ROW_COLORS = ['#ff3ea5', '#ff8a3d', '#ffd319', '#8bff5a', '#2de2e6', '#9b5cff', '#ff3ea5', '#ff8a3d'];

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), stage: $('hud-stage'), lives: $('hud-lives'),
    field: $('field'), canvas: $('board'), msg: $('field-msg'), msgText: $('field-msg-text'),
    reason: $('res-reason'), resScore: $('res-score'), newBest: $('res-newbest'), resBest: $('res-best'),
    tierEmoji: $('res-tier-emoji'), tierName: $('res-tier'), resStage: $('res-stage'), resBricks: $('res-bricks'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | play | ending | end
  var state = null;
  var runId = 0, doneSent = false, endTimer = 0, raf = 0, lastTs = 0, msgTimer = 0;
  var keys = { left: false, right: false };
  var pointerDown = false;
  var parts = [];          // 파편 { x, y, vx, vy, life, color }
  var view = { w: 0, h: 0, dpr: 1, k: 1 };
  var layers = { bg: null, bricks: null, bricksDirty: true };

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

  // ---------------------------------------------------------------- 캔버스 크기 (DPR)
  function makeLayer() { var c = document.createElement('canvas'); c.width = els.canvas.width; c.height = els.canvas.height; return c; }
  function resize() {
    var w = els.field.clientWidth, h = els.field.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    if (pw === els.canvas.width && ph === els.canvas.height) return;
    els.canvas.width = pw;
    els.canvas.height = ph;
    view = { w: w, h: h, dpr: dpr, k: pw / C.W };
    layers.bg = makeLayer();
    drawBg(layers.bg.getContext('2d'));
    layers.bricks = makeLayer();
    layers.bricksDirty = true;
    if (state) draw();
  }
  function scaled(c) { c.setTransform(view.k, 0, 0, els.canvas.height / C.H, 0, 0); return c; }

  function drawBg(g) {
    scaled(g);
    var grd = g.createLinearGradient(0, 0, 0, C.H);
    grd.addColorStop(0, '#120a33');
    grd.addColorStop(1, '#07061a');
    g.fillStyle = grd;
    g.fillRect(0, 0, C.W, C.H);
    g.strokeStyle = 'rgba(155, 92, 255, 0.10)';
    g.lineWidth = 1;
    g.beginPath();
    for (var x = 0; x <= C.W; x += 24) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, C.H); }
    for (var y = 0; y <= C.H; y += 24) { g.moveTo(0, y + 0.5); g.lineTo(C.W, y + 0.5); }
    g.stroke();
    // 패들 높이 아래 위험선
    g.strokeStyle = 'rgba(255, 62, 165, 0.25)';
    g.setLineDash([6, 6]);
    g.beginPath();
    g.moveTo(0, C.PADDLE_Y + C.PADDLE_H + 8);
    g.lineTo(C.W, C.PADDLE_Y + C.PADDLE_H + 8);
    g.stroke();
    g.setLineDash([]);
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function drawBricks(g) {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, g.canvas.width, g.canvas.height);
    scaled(g);
    state.bricks.forEach(function (b) {
      var col = ROW_COLORS[b.row % ROW_COLORS.length];
      g.shadowColor = col;
      g.shadowBlur = 8 * view.k;
      g.fillStyle = col;
      g.globalAlpha = b.max > 1 && b.hp < b.max ? 0.55 : 1;
      roundRect(g, b.x, b.y, b.w, b.h, 3);
      g.fill();
      g.shadowBlur = 0;
      g.globalAlpha = 1;
      // 윗면 반짝임
      g.fillStyle = 'rgba(255, 255, 255, 0.35)';
      g.fillRect(b.x + 3, b.y + 2, b.w - 6, 3);
      if (b.max > 1) {
        g.strokeStyle = b.hp < b.max ? 'rgba(255, 255, 255, 0.5)' : '#fff';
        g.lineWidth = 1.6;
        roundRect(g, b.x + 1.5, b.y + 1.5, b.w - 3, b.h - 3, 2);
        g.stroke();
        if (b.hp < b.max) {   // 금 간 모양
          g.beginPath();
          g.moveTo(b.x + b.w * 0.35, b.y + 2);
          g.lineTo(b.x + b.w * 0.5, b.y + b.h * 0.55);
          g.lineTo(b.x + b.w * 0.42, b.y + b.h - 2);
          g.stroke();
        }
      }
    });
    layers.bricksDirty = false;
  }

  function draw() {
    if (!state || !view.w) return;
    var g = ctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, els.canvas.width, els.canvas.height);
    if (layers.bg) g.drawImage(layers.bg, 0, 0);
    if (layers.bricksDirty) drawBricks(layers.bricks.getContext('2d'));
    g.drawImage(layers.bricks, 0, 0);
    scaled(g);
    // 파편
    parts.forEach(function (p) {
      g.globalAlpha = Math.max(0, p.life / p.max);
      g.fillStyle = p.color;
      g.fillRect(p.x - 2, p.y - 2, 4, 4);
    });
    g.globalAlpha = 1;
    // 떨어지는 캡슐
    state.drops.forEach(function (d) {
      var col = d.kind === 'wide' ? '#2de2e6' : '#ffd319';
      g.shadowColor = col;
      g.shadowBlur = 10 * view.k;
      g.fillStyle = col;
      roundRect(g, d.x - C.DROP_W / 2, d.y - C.DROP_H / 2, C.DROP_W, C.DROP_H, C.DROP_H / 2);
      g.fill();
      g.shadowBlur = 0;
      g.fillStyle = '#0b0820';
      if (d.kind === 'wide') {
        g.fillRect(d.x - 9, d.y - 1.2, 18, 2.4);
        g.beginPath(); g.moveTo(d.x - 11, d.y); g.lineTo(d.x - 6, d.y - 4); g.lineTo(d.x - 6, d.y + 4); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(d.x + 11, d.y); g.lineTo(d.x + 6, d.y - 4); g.lineTo(d.x + 6, d.y + 4); g.closePath(); g.fill();
      } else {
        [-7, 0, 7].forEach(function (o) { g.beginPath(); g.arc(d.x + o, d.y, 2.6, 0, Math.PI * 2); g.fill(); });
      }
    });
    // 패들
    var pw = C.paddleW(state), px = state.paddle.x - pw / 2;
    var wide = pw > C.PADDLE_W;
    g.shadowColor = wide ? '#ffd319' : '#2de2e6';
    g.shadowBlur = 14 * view.k;
    var pg = g.createLinearGradient(0, C.PADDLE_Y, 0, C.PADDLE_Y + C.PADDLE_H);
    pg.addColorStop(0, '#ffffff');
    pg.addColorStop(0.35, wide ? '#ffd319' : '#2de2e6');
    pg.addColorStop(1, wide ? '#b88f00' : '#139ea1');
    g.fillStyle = pg;
    roundRect(g, px, C.PADDLE_Y, pw, C.PADDLE_H, C.PADDLE_H / 2);
    g.fill();
    // 공
    g.shadowColor = '#ffffff';
    g.shadowBlur = 12 * view.k;
    g.fillStyle = '#ffffff';
    state.balls.forEach(function (b) {
      g.beginPath();
      g.arc(b.x, b.y, C.BALL_R, 0, Math.PI * 2);
      g.fill();
    });
    g.shadowBlur = 0;
  }

  // ---------------------------------------------------------------- 메시지 (판 위 한 줄)
  function showMsg(text, big, ms) {
    clearTimeout(msgTimer);
    els.msgText.textContent = text;
    els.msg.classList.toggle('tf-msg-big', !!big);
    els.msg.hidden = false;
    if (ms) msgTimer = setTimeout(idleMsg, ms);
  }
  function idleMsg() {
    clearTimeout(msgTimer);
    if (phase === 'play' && state && state.serving) showMsg(P.launch, false, 0);
    else els.msg.hidden = true;
  }

  function updateHud() {
    els.score.textContent = num(state.score);
    els.stage.textContent = num(state.stage);
    els.lives.textContent = state.lives > 0 ? new Array(state.lives + 1).join('♥') : '0';
  }

  function burst(x, y, color) {
    if (REDUCED) return;
    for (var i = 0; i < 9; i++) {
      var a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 140;
      parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 450, max: 450, color: color });
    }
    if (parts.length > 160) parts.splice(0, parts.length - 160);
  }

  function applyEvents(events) {
    events.forEach(function (e) {
      if (e.type === 'brick') {
        layers.bricksDirty = true;
        if (e.broken) burst(e.x, e.y, ROW_COLORS[e.row % ROW_COLORS.length]);
      } else if (e.type === 'launch') {
        if (!els.msg.classList.contains('tf-msg-big')) els.msg.hidden = true;
      } else if (e.type === 'stage') {
        layers.bricksDirty = true;
        parts = [];
        showMsg(fmt(P.stageClear, { n: num(e.stage) }), true, 1400);
      } else if (e.type === 'lose') {
        if (e.lives > 0) showMsg(P.lifeLost, true, 1100);
      } else if (e.type === 'catch') {
        showMsg(e.kind === 'wide' ? P.wide : P.multi, false, 900);
      } else if (e.type === 'over') {
        showMsg(P.gameOver, true, 0);
      }
    });
  }

  // ---------------------------------------------------------------- 시작 · 진행 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    cancelAnimationFrame(raf);
    state = C.newGame();
    parts = [];
    keys.left = keys.right = false;
    pointerDown = false;
    doneSent = false;
    phase = 'play';
    show('play');
    resize();
    layers.bricksDirty = true;
    updateHud();
    showMsg(P.launch, false, 0);
    track('start');
    lastTs = 0;
    raf = requestAnimationFrame(frame);
  }

  function frame(ts) {
    if (phase !== 'play' && phase !== 'ending') return;
    var dt = lastTs ? Math.min(FRAME_CAP, ts - lastTs) : 0;
    lastTs = ts;
    if (phase === 'play') {
      var dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      if (dir) C.setPaddle(state, state.paddle.x + dir * KEY_SPEED * dt / 1000);
      var events = C.step(state, dt);
      applyEvents(events);
      updateHud();
      if (state.over) gameOver();
    }
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt / 1000;
      p.y += p.vy * dt / 1000;
      p.vy += 420 * dt / 1000;
    }
    draw();
    raf = requestAnimationFrame(frame);
  }

  function gameOver() {
    if (phase !== 'play') return;
    phase = 'ending';
    var myRun = runId;
    endTimer = setTimeout(function () { if (myRun === runId) finish(); }, END_DELAY);
  }

  function finish() {
    if (phase === 'end' || !state) return;
    phase = 'end';
    clearTimeout(endTimer);
    clearTimeout(msgTimer);
    cancelAnimationFrame(raf);
    els.msg.hidden = true;
    var s = state;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    els.reason.textContent = R.gameOver;
    els.resScore.textContent = num(s.score);
    var tier = C.tierOf(s.score);
    els.tierEmoji.textContent = C.TIER_EMOJI[tier];
    els.tierName.textContent = (R.tiers || [])[tier] || '';
    els.newBest.hidden = !isNew;
    els.resBest.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
    els.resBest.hidden = isNew;
    els.resStage.textContent = num(s.stage);
    els.resBricks.textContent = num(s.broken);
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
  function toLogicalX(clientX) {
    var r = els.canvas.getBoundingClientRect();
    return r.width ? (clientX - r.left) / r.width * C.W : C.W / 2;
  }
  function tryLaunch() {
    if (phase !== 'play' || !state || !state.serving) return;
    applyEvents(C.launch(state));
  }
  els.canvas.addEventListener('pointerdown', function (e) {
    if (phase !== 'play') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    pointerDown = true;
    try { els.canvas.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    C.setPaddle(state, toLogicalX(e.clientX));
  });
  els.canvas.addEventListener('pointermove', function (e) {
    if (phase !== 'play') return;
    if (e.pointerType !== 'mouse' && !pointerDown) return;
    C.setPaddle(state, toLogicalX(e.clientX));
  });
  function release() {
    if (!pointerDown) return;
    pointerDown = false;
    tryLaunch();
  }
  els.canvas.addEventListener('pointerup', release);
  els.canvas.addEventListener('pointercancel', function () { pointerDown = false; });
  els.canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  // iOS 사파리: 판 위 끌기가 스크롤·확대로 새지 않게
  els.field.addEventListener('touchmove', function (e) { if (phase === 'play') e.preventDefault(); }, { passive: false });

  var KEY_LEFT = { ArrowLeft: 1, a: 1, A: 1 };
  var KEY_RIGHT = { ArrowRight: 1, d: 1, D: 1 };
  var KEY_FIRE = { ' ': 1, Spacebar: 1, ArrowUp: 1, Enter: 1 };
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (KEY_LEFT[e.key]) { keys.left = true; e.preventDefault(); }
    else if (KEY_RIGHT[e.key]) { keys.right = true; e.preventDefault(); }
    else if (KEY_FIRE[e.key] || e.key === 'ArrowDown') { e.preventDefault(); if (KEY_FIRE[e.key]) tryLaunch(); }
  });
  document.addEventListener('keyup', function (e) {
    if (KEY_LEFT[e.key]) keys.left = false;
    else if (KEY_RIGHT[e.key]) keys.right = false;
  });
  window.addEventListener('blur', function () { keys.left = keys.right = false; pointerDown = false; });

  if (window.ResizeObserver) new ResizeObserver(resize).observe(els.field);
  else window.addEventListener('resize', resize);

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

  window.BRICK_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, t: state.t, score: state.score, stage: state.stage, lives: state.lives, broken: state.broken,
        bricks: state.bricks.length, balls: state.balls.length, serving: state.serving, over: state.over, paddle: state.paddle.x,
        canvas: [els.canvas.width, els.canvas.height] };
    },
    best: getBest,
    // 검사용: 지금 판을 바로 끝낸다 (목숨을 0으로 → 끝 화면)
    endNow: function () {
      if (phase !== 'play' || !state) return false;
      state.lives = 1;
      state.balls = [];
      state.serving = false;
      state.balls.push({ x: C.W / 2, y: C.H + 50, vx: 0, vy: 100, stuck: false });
      return true;
    }
  };
  show('start');
})();
