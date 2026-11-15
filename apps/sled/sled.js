/* apps/sled/sled.js — 시작(티징) → 썰매 레이스(캔버스, 위에서 내려다본 끝없는 눈 언덕) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 sled-core.js(SLED_CORE, 언어 무관, 고정 시간 간격), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 흐름: 시작 버튼 → 준비(안내 표시, 시간 안 흐름) → 첫 입력(필드 누르기·방향키)이 판을 시작(track('start'))
 *   → 90초(결승선)가 끝나거나 하트 3개를 다 잃으면 잠시 뒤 끝 화면(track('done')). 다시 하기 = 새 준비 상태.
 * 입력: 필드 왼쪽/오른쪽 절반을 누르고 있으면 그쪽으로 꺾음. 누른 채 옆으로 끌면(12px 넘게) 끈 만큼 썰매가 따라감(목표 x).
 *   키보드: ←/→(A/D) 누르고 있기, P/Esc 일시정지. 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지(시계도 멈춤).
 *   prefers-reduced-motion 이면 내리는 눈·눈보라를 멈추고, 흔들림·번쩍임·떠오르는 글자 움직임을 끈다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 *   말이 안 되는 점수(C.plausible 거짓)는 보내지 않는다.
 * 그리기: requestAnimationFrame + dt, devicePixelRatio(최대 2.5), 세계(360×600 단위)를 필드 크기에 맞춰 늘림. 그림은 모두 코드로 그린다(저작권 캐릭터 없음).
 * 디버그/검사용 핸들: window.SLED_APP (phase(), state(), best(), timeScale(k), steer(dir), target(x), autopilot(on), begin())
 */
(function () {
  'use strict';

  var C = window.SLED_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'sled_best_v1';
  var END_DELAY = REDUCED ? 450 : 1300;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), dist: $('hud-dist'), lives: $('hud-lives'), livesBox: null, timebar: $('hud-timebar'), pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('sd-canvas'), hint: $('tap-hint'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), reason: $('res-reason'), newBest: $('res-newbest'), bestLine: $('res-best'),
    resDist: $('res-dist'), items: $('res-items'), jumps: $('res-jumps'), tier: $('res-tier'),
    rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  els.livesBox = els.lives ? els.lives.closest('.sd-hud-box') : null;
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | ready | play | paused | over | end
  var pausedFrom = 'play';
  var state = null;
  var raf = 0, last = 0, speed = 1, auto = false;
  var runId = 0, doneSent = false;
  var hudScore = -1, hudDist = -1, hudLives = -1, hudBar = -1;
  var view = { w: 320, h: 533, dpr: 1, k: 1 };
  var clock = 0;           // 장식 애니메이션 시간(ms)
  var pops = [];           // 떠오르는 글자 { x, y, text, tone, age }
  var sparks = [];         // 반짝임·눈보라 { x, y, vx, vy, r, age, life, color }
  var trail = [];          // 썰매 자국 { x, y(세계), air }
  var flakes = [];         // 내리는 눈 (장식, 화면 좌표)
  var flash = 0, shake = 0, overAt = 0, tumble = 0;
  var fontFamily = 'sans-serif';
  // 입력
  var keys = { left: false, right: false };
  var ptr = null;          // { id, x0(클라이언트), sx0(세계 x), mode: 'half'|'drag', wx(세계 x) }
  var forced = null;       // 검사용 SLED_APP.steer/target: { dir } | { tx }

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

  // ---------------------------------------------------------------- 내리는 눈 (장식, 고정 시드). 움직임 줄이기 = 적게, 멈춘 채로
  (function makeFlakes() {
    var seed = 7;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var n = REDUCED ? 16 : 54;
    for (var i = 0; i < n; i++) flakes.push({ x: r() * C.W, y: r() * C.H, s: 0.8 + r() * 2.1, v: 14 + r() * 26, p: r() * 6.28 });
  })();

  // ---------------------------------------------------------------- 캔버스 크기 (세계 비율 W:H 그대로)
  function layout() {
    var shell = els.play.parentNode;
    var w = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    w = Math.max(240, Math.floor(w));
    var h = Math.round(w * C.H / C.W);
    var rect = els.field.getBoundingClientRect();
    var availH = Math.max(340, window.innerHeight - Math.max(0, rect.top) - 14);
    if (h > availH) { h = Math.floor(availH); w = Math.floor(h * C.W / C.H); }
    els.field.style.width = w + 'px';
    els.field.style.height = h + 'px';
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    els.canvas.width = Math.round(w * dpr);
    els.canvas.height = Math.round(h * dpr);
    els.canvas.style.width = w + 'px';
    els.canvas.style.height = h + 'px';
    view = { w: w, h: h, dpr: dpr, k: w / C.W };
    var ff = getComputedStyle(document.body).getPropertyValue('--font-num');
    fontFamily = (ff && ff.trim()) || 'sans-serif';
  }

  // ---------------------------------------------------------------- 그리기 (세계 단위로 그린 뒤 k 배)
  var SY = C.SLED_Y;
  var COATS = ['#2f6fbf', '#3aa36b', '#8a5cc9', '#e08a2c'];
  var GIFTS = [['#e8574c', '#f4d35e'], ['#3aa36b', '#f4b63f'], ['#2f7de1', '#ffffff'], ['#8a5cc9', '#f4b63f']];

  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function circle(g, x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function scrY(wy) { return SY + (wy - (state ? state.dist : 0)); }

  function drawScene(g) {
    var dist = state ? state.dist : 0;
    var grd = g.createLinearGradient(0, 0, 0, C.H);
    grd.addColorStop(0, '#e6f1fb'); grd.addColorStop(0.5, '#f4f9fe'); grd.addColorStop(1, '#ffffff');
    g.fillStyle = grd; g.fillRect(0, 0, C.W, C.H);
    // 눈 언덕 결 (세계에 붙어서 흐름)
    var band = 70;
    var k0 = Math.floor((dist - SY) / band) - 1, k1 = Math.ceil((dist - SY + C.H) / band) + 1;
    g.lineWidth = 1.6; g.lineCap = 'round';
    for (var k = k0; k <= k1; k++) {
      var y = scrY(k * band);
      var x0 = 30 + hash(k) * 200, len = 60 + hash(k + 0.5) * 90, bend = (hash(k + 0.3) - 0.5) * 18;
      g.strokeStyle = 'rgba(150, 188, 222, ' + (0.28 + 0.2 * hash(k + 0.9)).toFixed(3) + ')';
      g.beginPath(); g.moveTo(x0, y); g.quadraticCurveTo(x0 + len / 2, y + bend, x0 + len, y + 2); g.stroke();
      // 작은 눈 둔덕 그림자
      if (hash(k + 0.7) > 0.55) {
        var mx = 40 + hash(k + 1.7) * 280;
        g.fillStyle = 'rgba(170, 202, 230, 0.28)';
        g.beginPath(); g.ellipse(mx, y + 30, 16, 5, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = 'rgba(255, 255, 255, 0.9)';
        g.beginPath(); g.ellipse(mx - 2, y + 28, 13, 3.5, 0, 0, Math.PI * 2); g.fill();
      }
    }
    // 양쪽 눈둑 (가장자리 = 막힘)
    var eg = g.createLinearGradient(0, 0, C.EDGE + 10, 0);
    eg.addColorStop(0, 'rgba(120, 165, 210, 0.55)'); eg.addColorStop(1, 'rgba(120, 165, 210, 0)');
    g.fillStyle = eg; g.fillRect(0, 0, C.EDGE + 10, C.H);
    var eg2 = g.createLinearGradient(C.W, 0, C.W - C.EDGE - 10, 0);
    eg2.addColorStop(0, 'rgba(120, 165, 210, 0.55)'); eg2.addColorStop(1, 'rgba(120, 165, 210, 0)');
    g.fillStyle = eg2; g.fillRect(C.W - C.EDGE - 10, 0, C.EDGE + 10, C.H);
    // 가장자리 작은 나무 (장식)
    var tb = 110;
    var t0 = Math.floor((dist - SY) / tb) - 1, t1 = Math.ceil((dist - SY + C.H) / tb) + 1;
    for (var t = t0; t <= t1; t++) {
      var side = t % 2 ? -1 : 1;
      var tx = side < 0 ? 4 + hash(t) * 6 : C.W - 4 - hash(t) * 6;
      drawPine(g, tx, scrY(t * tb + hash(t + 2) * 50), 0.6, 0);
    }
  }

  // 결승선 (남은 시간 × 지금 속도로 대강 — 마지막에는 썰매 자리로 모인다)
  function drawFinish(g) {
    if (!state || !state.started) return;
    var y = state.over && state.endReason === 'finish' ? SY + 6 : scrY(state.dist + state.speed * state.timeLeft / 1000);
    if (y > C.H + 30 || y < -30) return;
    var sq = 12;
    for (var i = 0; i * sq < C.W; i++) {
      for (var j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#1d2a3a' : '#ffffff'; g.fillRect(i * sq, y + j * sq, sq, sq); }
    }
    g.fillStyle = '#e8574c'; g.fillRect(6, y - 30, 5, 54); g.fillRect(C.W - 11, y - 30, 5, 54);
  }

  function drawFlakes(g, dt) {
    g.fillStyle = 'rgba(255, 255, 255, 0.92)';
    var rise = state && phase === 'play' ? state.speed * 0.18 : 0;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      if (!REDUCED) {
        f.y += (f.v - rise) * dt / 1000;
        f.x += Math.sin(clock / 900 + f.p) * 0.25;
        if (f.y > C.H + 4) f.y = -4; else if (f.y < -4) f.y = C.H + 4;
        if (f.x < -4) f.x = C.W + 4; else if (f.x > C.W + 4) f.x = -4;
      }
      g.beginPath(); g.arc(f.x, f.y, f.s, 0, Math.PI * 2); g.fill();
      g.strokeStyle = 'rgba(160, 196, 226, 0.5)'; g.lineWidth = 0.6; g.stroke();
    }
  }

  // ---- 물건
  function shadow(g, x, y, rx, ry) { g.fillStyle = 'rgba(110, 150, 195, 0.28)'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); }
  function drawPine(g, x, y, s, look) {
    g.save(); g.translate(x, y); g.scale(s, s);
    shadow(g, 4, 18, 20, 6);
    g.fillStyle = '#7a5638'; g.fillRect(-3, 10, 6, 10);
    var greens = [['#2f7a5c', '#245f48'], ['#357f5f', '#27634b'], ['#2c7158', '#1f5640'], ['#3b8462', '#2a6a4d']][look % 4];
    g.fillStyle = greens[1]; g.beginPath(); g.moveTo(0, -12); g.lineTo(21, 14); g.lineTo(-21, 14); g.closePath(); g.fill();
    g.fillStyle = greens[0]; g.beginPath(); g.moveTo(0, -26); g.lineTo(16, 2); g.lineTo(-16, 2); g.closePath(); g.fill();
    g.fillStyle = greens[1]; g.beginPath(); g.moveTo(0, -36); g.lineTo(11, -12); g.lineTo(-11, -12); g.closePath(); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(0, -36); g.lineTo(5, -26); g.lineTo(1, -27); g.lineTo(-2, -24); g.lineTo(-5, -26); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-14, 0); g.quadraticCurveTo(-6, -4, 2, 0); g.quadraticCurveTo(-6, 2, -14, 0); g.fill();
    g.beginPath(); g.moveTo(4, 12); g.quadraticCurveTo(11, 8, 18, 12); g.quadraticCurveTo(11, 14, 4, 12); g.fill();
    g.restore();
  }
  function drawRock(g, x, y, look) {
    shadow(g, x + 3, y + 9, 18, 6);
    g.fillStyle = look % 2 ? '#8c9aab' : '#7f8ea0';
    g.beginPath(); g.moveTo(x - 16, y + 8); g.quadraticCurveTo(x - 17, y - 6, x - 6, y - 12); g.quadraticCurveTo(x + 6, y - 15, x + 14, y - 5);
    g.quadraticCurveTo(x + 18, y + 4, x + 14, y + 9); g.closePath(); g.fill();
    g.fillStyle = '#a7b4c3'; g.beginPath(); g.moveTo(x - 9, y - 4); g.quadraticCurveTo(x - 4, y - 10, x + 4, y - 9); g.quadraticCurveTo(x - 1, y - 4, x - 9, y - 4); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(x - 12, y - 6); g.quadraticCurveTo(x - 2, y - 17, x + 12, y - 7); g.quadraticCurveTo(x + 2, y - 10, x - 12, y - 6); g.fill();
  }
  function drawSnowman(g, x, y, look, hit) {
    shadow(g, x + 3, y + 13, 16, 5);
    g.lineWidth = 1.4; g.strokeStyle = '#b9d3e8'; g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(x, y + 2, 13, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.arc(x, y - 14, 9.5, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = ['#e8574c', '#2f7de1', '#3aa36b', '#8a5cc9'][look % 4]; rr(g, x - 8, y - 7, 16, 4, 2); g.fill();
    g.fillStyle = '#2a2a33'; g.beginPath(); g.rect(x - 7, y - 25, 14, 3); g.rect(x - 4.5, y - 33, 9, 8); g.fill();
    circle(g, x - 3, y - 15, 1.4, '#2a2a33'); circle(g, x + 3, y - 15, 1.4, '#2a2a33');
    g.fillStyle = '#f08a2c'; g.beginPath(); g.moveTo(x, y - 13); g.lineTo(x + 8, y - 11.5); g.lineTo(x, y - 10.5); g.fill();
    g.strokeStyle = '#6b4a34'; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x - 11, y); g.lineTo(x - 21, y - 8); g.moveTo(x + 11, y); g.lineTo(x + 21, y - 8); g.stroke();
    if (hit) { g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.arc(x - 12, y + 10, 4, 0, Math.PI * 2); g.arc(x + 13, y + 6, 3, 0, Math.PI * 2); g.fill(); }
  }
  function drawFlag(g, x, y) {
    var wave = REDUCED ? 0 : Math.sin(clock / 150 + x) * 2.5;
    shadow(g, x + 2, y + 8, 7, 2.5);
    g.fillStyle = '#6b4a34'; g.fillRect(x - 1.5, y - 18, 3, 26);
    g.fillStyle = '#e8574c'; g.beginPath(); g.moveTo(x + 1.5, y - 18); g.quadraticCurveTo(x + 10, y - 15 + wave, x + 16, y - 12); g.lineTo(x + 1.5, y - 6); g.closePath(); g.fill();
    circle(g, x, y - 19, 2.2, '#f4b63f');
  }
  function drawGift(g, x, y, look) {
    var c = GIFTS[look % 4];
    var bob = REDUCED ? 0 : Math.sin(clock / 260 + x) * 1.5;
    shadow(g, x + 2, y + 10, 12, 3.5);
    g.save(); g.translate(x, y + bob);
    g.fillStyle = c[0]; rr(g, -10, -8, 20, 17, 3); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(-10, 3, 20, 6);
    g.fillStyle = c[1]; g.fillRect(-2, -8, 4, 17); g.fillRect(-10, -2, 20, 4);
    g.beginPath(); g.ellipse(-4, -10, 4.5, 3, -0.5, 0, Math.PI * 2); g.ellipse(4, -10, 4.5, 3, 0.5, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function star(g, x, y, r1, r2, rot) {
    g.beginPath();
    for (var i = 0; i < 10; i++) {
      var a = rot + i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? r2 : r1;
      g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    g.closePath();
  }
  function drawStar(g, x, y) {
    var pulse = REDUCED ? 0 : Math.sin(clock / 160);
    g.fillStyle = 'rgba(255, 214, 102, ' + (0.32 + 0.12 * pulse).toFixed(3) + ')';
    g.beginPath(); g.arc(x, y, 22 + pulse * 2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffd34d'; g.strokeStyle = '#c48a12'; g.lineWidth = 1.6;
    star(g, x, y, 14, 6, REDUCED ? 0 : clock / 900); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(x - 3, y - 4, 2.4, 0, Math.PI * 2); g.fill();
  }
  function drawRamp(g, x, y, used) {
    var w = 30;
    shadow(g, x + 3, y + 14, w + 4, 6);
    g.fillStyle = used ? '#9cc4e6' : '#7cb6e6';
    g.beginPath(); g.moveTo(x - w, y + 12); g.lineTo(x + w, y + 12); g.lineTo(x + w - 6, y - 10); g.lineTo(x - w + 6, y - 10); g.closePath(); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(x - w + 6, y - 10); g.lineTo(x + w - 6, y - 10); g.lineTo(x + w - 9, y - 16); g.lineTo(x - w + 9, y - 16); g.closePath(); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = 2.6; g.lineCap = 'round'; g.lineJoin = 'round';
    var a = REDUCED || used ? 0 : (clock / 300) % 1;
    g.globalAlpha = used ? 0.5 : 1;
    for (var i = 0; i < 2; i++) {
      var yy = y + 8 - i * 9 - a * 3;
      g.beginPath(); g.moveTo(x - 8, yy); g.lineTo(x, yy - 6); g.lineTo(x + 8, yy); g.stroke();
    }
    g.globalAlpha = 1;
    g.strokeStyle = '#5c93c4'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - w, y + 12); g.lineTo(x + w, y + 12); g.stroke();
  }

  function drawObjects(g) {
    if (!state) return;
    var list = state.objs;
    // 점프대 → 그 밖 (y 순서)
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 0; i < list.length; i++) {
        var o = list[i];
        var y = scrY(o.y);
        if (y < -50 || y > C.H + 50) continue;
        var isRamp = o.kind === 'ramp';
        if ((pass === 0) !== isRamp) continue;
        if (isRamp) { drawRamp(g, o.x, y, o.done); continue; }
        if (o.done && !o.hit) continue;  // 모은 것은 사라짐
        if (o.kind === 'tree') drawPine(g, o.x, y, 1, o.look);
        else if (o.kind === 'rock') drawRock(g, o.x, y, o.look);
        else if (o.kind === 'snowman') drawSnowman(g, o.x, y, o.look, o.hit);
        else if (o.kind === 'flag') drawFlag(g, o.x, y);
        else if (o.kind === 'gift') drawGift(g, o.x, y, o.look);
        else if (o.kind === 'star') drawStar(g, o.x, y);
      }
    }
  }

  // 썰매 자국 (두 줄, 공중에서는 끊김)
  function drawTrail(g) {
    if (trail.length < 2) return;
    g.strokeStyle = 'rgba(150, 186, 218, 0.55)'; g.lineWidth = 2.2; g.lineCap = 'round';
    [-7, 7].forEach(function (off) {
      g.beginPath();
      var pen = false;
      for (var i = 0; i < trail.length; i++) {
        var p = trail[i];
        if (p.air) { pen = false; continue; }
        var y = scrY(p.y) - 14;
        if (!pen) { g.moveTo(p.x + off, y); pen = true; } else g.lineTo(p.x + off, y);
      }
      g.stroke();
    });
  }

  // 썰매 + 아이 (위에서 본 모습, 아래로 내려감 = 머리는 아래쪽)
  function drawSled(g) {
    if (!state) return;
    var x = state.x;
    var airP = state.air > 0 ? 1 - state.air / C.AIR_MS : 0;
    var lift = state.air > 0 ? Math.sin(Math.PI * airP) : 0;
    var sc = 1 + 0.38 * lift;
    var tilt = (state.vx / C.MAX_VX) * 0.32;
    // 그림자
    g.fillStyle = 'rgba(90, 130, 175, ' + (0.32 - 0.14 * lift).toFixed(3) + ')';
    g.beginPath(); g.ellipse(x + 4 + lift * 10, SY + 6 + lift * 22, 17 * (1 - lift * 0.2), 22 * (1 - lift * 0.2), tilt, 0, Math.PI * 2); g.fill();
    var blink = state.inv > 0 && !state.over && Math.floor(clock / 90) % 2 === 0;
    g.save();
    g.globalAlpha = blink ? 0.35 : 1;
    g.translate(x, SY - lift * 12);
    g.rotate(tilt + (phase === 'over' && state.endReason === 'crash' ? tumble : 0));
    g.scale(sc, sc);
    // 활주부(러너)
    g.strokeStyle = '#8a2d22'; g.lineWidth = 2.6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-12, -22); g.lineTo(-12, 20); g.quadraticCurveTo(-12, 28, -4, 29); g.moveTo(12, -22); g.lineTo(12, 20); g.quadraticCurveTo(12, 28, 4, 29); g.stroke();
    // 나무판
    g.fillStyle = '#e8574c'; rr(g, -14, -24, 28, 48, 9); g.fill();
    g.fillStyle = '#c8402f'; rr(g, -11, -20, 22, 40, 6); g.fill();
    g.strokeStyle = 'rgba(255, 255, 255, 0.35)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(-11, -6); g.lineTo(11, -6); g.moveTo(-11, 8); g.lineTo(11, 8); g.stroke();
    // 끈
    g.strokeStyle = '#f4d35e'; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(-10, 22); g.quadraticCurveTo(0, 32, 10, 22); g.stroke();
    // 아이 (등·목도리·모자)
    var coat = COATS[(state.seed >>> 3) % 4];
    g.fillStyle = coat; rr(g, -11, -16, 22, 24, 9); g.fill();
    // 팔 (줄 잡음)
    circle(g, -11, 9, 4.2, coat); circle(g, 11, 9, 4.2, coat);
    circle(g, -9, 14, 3.4, '#f4b63f'); circle(g, 9, 14, 3.4, '#f4b63f');
    // 목도리 (펄럭임)
    var flap = REDUCED ? 0 : Math.sin(clock / 70) * 2.5;
    g.fillStyle = '#ffffff'; rr(g, -10, 4, 20, 6, 3); g.fill();
    g.beginPath(); g.moveTo(-6, 6); g.lineTo(-10 + flap, -12); g.lineTo(-4 + flap, -13); g.lineTo(-1, 6); g.fill();
    // 머리 (모자)
    circle(g, 0, 14, 8.5, '#f4b63f');
    g.fillStyle = '#ffffff'; rr(g, -8.5, 9, 17, 4, 2); g.fill();
    circle(g, 0, 22, 3.6, '#ffffff');
    g.restore();
    g.globalAlpha = 1;
  }

  function drawSparks(g) {
    for (var i = 0; i < sparks.length; i++) {
      var q = sparks[i], t = q.age / q.life;
      g.globalAlpha = Math.max(0, 1 - t);
      g.fillStyle = q.color;
      if (q.star) { star(g, q.x, q.y, q.r, q.r * 0.45, t * 3); g.fill(); }
      else { g.beginPath(); g.arc(q.x, q.y, q.r * (1 - t * 0.4), 0, Math.PI * 2); g.fill(); }
    }
    g.globalAlpha = 1;
  }

  function drawPops(g) {
    if (!pops.length) return;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineJoin = 'round'; g.lineWidth = 4;
    for (var i = 0; i < pops.length; i++) {
      var p = pops[i], t = p.age / 1000;
      g.font = '700 ' + (p.big ? 22 : 18) + 'px ' + fontFamily;
      g.globalAlpha = Math.max(0, 1 - t * t);
      g.strokeStyle = 'rgba(15, 44, 80, 0.85)';
      g.fillStyle = p.tone === 'good' ? '#ffde59' : p.tone === 'bad' ? '#ff8a7f' : '#ffffff';
      var yy = p.y - (REDUCED ? 0 : t * 26);
      g.strokeText(p.text, p.x, yy); g.fillText(p.text, p.x, yy);
    }
    g.globalAlpha = 1;
  }

  function draw(dt) {
    var g = ctx;
    g.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    g.clearRect(0, 0, view.w, view.h);
    var sx = shake > 0 && !REDUCED ? Math.sin(clock / 18) * 5 * shake : 0;
    g.setTransform(view.dpr * view.k, 0, 0, view.dpr * view.k, sx * view.dpr * view.k, 0);
    drawScene(g);
    drawFinish(g);
    drawTrail(g);
    drawObjects(g);
    drawSled(g);
    drawSparks(g);
    drawFlakes(g, dt || 0);
    drawPops(g);
    if (flash > 0) { g.fillStyle = 'rgba(232, 87, 76, ' + (0.32 * flash).toFixed(3) + ')'; g.fillRect(0, 0, C.W, C.H); }
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    var sc = C.score(state);
    if (force || hudScore !== sc) { hudScore = sc; els.score.textContent = num(sc); }
    var m = C.meters(state);
    if (force || hudDist !== m) { hudDist = m; els.dist.textContent = num(m); }
    if (force || hudLives !== state.hearts) {
      var hurt = hudLives > state.hearts && !force;
      hudLives = state.hearts;
      var hs = els.lives.children;
      for (var i = 0; i < hs.length; i++) hs[i].classList.toggle('is-lost', i >= state.hearts);
      if (els.livesBox && hurt && !REDUCED) { els.livesBox.classList.remove('is-hurt'); void els.livesBox.offsetWidth; els.livesBox.classList.add('is-hurt'); }
    }
    var bar = Math.round(1000 * state.timeLeft / C.ROUND_MS) / 10;
    if (force || hudBar !== bar) { hudBar = bar; els.timebar.style.width = bar + '%'; }
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function pop(text, tone, x, y, big) {
    if (!text) return;
    pops.push({ x: Math.max(60, Math.min(C.W - 60, x)), y: y, text: text, tone: tone, age: 0, big: !!big });
  }
  function burst(x, y, n, color, isStar) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = REDUCED ? 0 : 40 + Math.random() * 90;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: isStar ? 4 : 2 + Math.random() * 2.5, age: 0, life: 520, color: color, star: !!isStar });
    }
  }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* noop */ } }
  function onEvents(evs) {
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.type === 'item') {
        if (ev.kind === 'star') { burst(state.x, SY, 10, '#ffd34d', true); pop(fmt(P.star, { n: ev.pts }), 'good', state.x, SY - 40, true); }
        else { burst(state.x, SY, 6, ev.kind === 'gift' ? '#f4b63f' : '#ff8a7f'); pop('+' + num(ev.pts), 'good', state.x, SY - 36, ev.kind === 'gift'); }
      } else if (ev.type === 'jump') {
        pop(fmt(P.air, { n: ev.pts }), 'good', state.x, SY - 44, true);
      } else if (ev.type === 'land') {
        burst(state.x, SY + 18, 8, '#ffffff');
      } else if (ev.type === 'ouch') {
        if (!REDUCED) { flash = 1; shake = 1; }
        burst(ev.x, SY, 10, '#ffffff');
        pop(P.ouch, 'bad', state.x, SY - 40, true);
        buzz(90);
      } else if (ev.type === 'finish' || ev.type === 'crash') {
        pop(ev.type === 'finish' ? P.finish : P.crash, 'plain', C.W / 2, C.H * 0.5, true);
        if (ev.type === 'finish') burst(state.x, SY, 16, '#ffd34d', true);
        phase = 'over';
        overAt = performance.now();
      }
    }
    if (pops.length > 5) pops.splice(0, pops.length - 5);
    if (sparks.length > 80) sparks.splice(0, sparks.length - 80);
  }

  // ---------------------------------------------------------------- 입력 → 조종
  function applySteer() {
    if (!state || auto) return;
    if (forced) { if (forced.tx != null) C.setTarget(state, forced.tx); else C.setSteer(state, forced.dir); return; }
    var kd = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (kd) { C.setSteer(state, kd); return; }
    if (ptr) {
      if (ptr.mode === 'drag') C.setTarget(state, ptr.sx0 + (ptr.wx - ptr.wx0));
      else C.setSteer(state, ptr.wx < C.W / 2 ? -1 : 1);
      return;
    }
    C.setSteer(state, 0);
  }

  // ---------------------------------------------------------------- 루프
  function loop(now) {
    raf = 0;
    if (phase !== 'ready' && phase !== 'play' && phase !== 'over') return;
    var dt = Math.min(100, Math.max(0, now - last));
    last = now;
    var gdt = dt * speed;
    clock += gdt;
    if (phase === 'play') {
      applySteer();
      // 큰 timeScale 에서도 tick 이 MAX_STEP 에 잘리지 않게 나눠서 넣는다
      var rest = gdt;
      while (rest > 0 && phase === 'play') {
        var part = Math.min(rest, C.MAX_STEP);
        onEvents(C.step(state, part, auto ? C.autoPlay : null));
        rest -= part;
      }
      // 자국·눈보라
      trail.push({ x: state.x, y: state.dist, air: state.air > 0 });
      while (trail.length && scrY(trail[0].y) < -30) trail.shift();
      if (trail.length > 240) trail.splice(0, trail.length - 240);
      if (!REDUCED && state.air <= 0 && Math.abs(state.vx) > C.MAX_VX * 0.6 && Math.random() < 0.6) {
        var side = state.vx > 0 ? -1 : 1;
        sparks.push({ x: state.x + side * 12, y: SY + 18, vx: side * (30 + Math.random() * 40), vy: -20 - Math.random() * 30, r: 1.6 + Math.random() * 2, age: 0, life: 380, color: '#ffffff' });
      }
    }
    if (phase === 'over' && state && state.endReason === 'crash' && !REDUCED) tumble = Math.min(1.4, tumble + gdt / 400);
    for (var i = pops.length - 1; i >= 0; i--) { pops[i].age += gdt; if (pops[i].age >= 1000) pops.splice(i, 1); }
    for (var j = sparks.length - 1; j >= 0; j--) {
      var q = sparks[j];
      q.age += gdt; q.x += q.vx * gdt / 1000; q.y += q.vy * gdt / 1000;
      if (q.age >= q.life) sparks.splice(j, 1);
    }
    if (flash > 0) flash = Math.max(0, flash - gdt / 300);
    if (shake > 0) shake = Math.max(0, shake - gdt / 320);
    draw(gdt);
    updateHud(false);
    if (phase === 'over' && now - overAt >= END_DELAY / Math.max(0.1, speed)) { finish(); return; }
    raf = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (raf) cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  // ---------------------------------------------------------------- 준비 · 시작 · 일시정지 · 끝
  function ready() {
    runId++;
    stopLoop();
    state = C.newGame();
    pops = []; sparks = []; trail = []; flash = 0; shake = 0; tumble = 0; auto = false; forced = null;
    keys.left = false; keys.right = false; ptr = null;
    hudScore = -1; hudDist = -1; hudLives = -1; hudBar = -1;
    doneSent = false;
    phase = 'ready';
    els.pausedBox.hidden = true;
    els.hint.hidden = false;
    show('play');
    layout();
    updateHud(true);
    draw(0);
    try { els.field.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    startLoop();
  }

  // 첫 입력이 판을 시작한다 (한 판에 한 번 track('start'))
  function begin() {
    if (phase !== 'ready' || !state) return false;
    phase = 'play';
    els.hint.hidden = true;
    C.start(state);
    track('start');
    return true;
  }

  function pause() {
    if (phase !== 'play' && phase !== 'ready') return;
    pausedFrom = phase;
    phase = 'paused';
    stopLoop();
    keys.left = false; keys.right = false; ptr = null;
    if (state) C.setSteer(state, 0);
    els.pausedBox.hidden = false;
    try { els.resumeBtn.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }
  function resume() {
    if (phase !== 'paused') return;
    phase = pausedFrom;
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
    var sc = C.score(s);
    var prev = getBest();
    var isNew = sc > prev;
    if (isNew) setBest(sc);
    els.resScore.textContent = num(sc);
    els.reason.textContent = s.endReason === 'crash' ? R.reasonCrash : R.reasonFinish;
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, sc)) });
    els.bestLine.hidden = isNew;
    els.resDist.textContent = num(C.meters(s));
    els.items.textContent = num(C.items(s));
    els.jumps.textContent = num(s.jumps);
    els.tier.textContent = (R.tiers || [])[C.tierOf(sc)] || '';
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(s, sc, myRun);
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

  // 한 판에 한 번 점수를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음·말이 안 되는 점수 → 통째로 숨김.
  function submitScore(s, sc, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || s.submitted || !C.plausible(s)) return;
    s.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(sc);
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

  // ---------------------------------------------------------------- 입력 연결
  function worldX(e) {
    var r = els.field.getBoundingClientRect();
    return (e.clientX - r.left) / (r.width || 1) * C.W;
  }
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'ready') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    var wx = worldX(e);
    ptr = { id: e.pointerId, x0: e.clientX, wx0: wx, wx: wx, sx0: state ? state.x : C.W / 2, mode: 'half' };
    if (phase === 'ready') begin();
  });
  els.field.addEventListener('pointermove', function (e) {
    if (!ptr || e.pointerId !== ptr.id) return;
    ptr.wx = worldX(e);
    if (ptr.mode === 'half' && Math.abs(e.clientX - ptr.x0) > 12) {
      ptr.mode = 'drag';
      ptr.wx0 = ptr.wx; ptr.sx0 = state ? state.x : C.W / 2;
    }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    els.field.addEventListener(t, function (e) { if (ptr && e.pointerId === ptr.id) ptr = null; });
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play' || phase === 'ready') e.preventDefault(); });

  function keyName(k) {
    if (k === 'ArrowLeft' || k === 'Left' || k === 'a' || k === 'A') return 'left';
    if (k === 'ArrowRight' || k === 'Right' || k === 'd' || k === 'D') return 'right';
    if (k === ' ' || k === 'Spacebar' || k === 'Enter' || k === 'ArrowDown' || k === 'Down' || k === 'ArrowUp' || k === 'Up') return 'go';
    return '';
  }
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    var nm = keyName(k);
    if (nm) {
      var onBtn = document.activeElement && document.activeElement.tagName === 'BUTTON';
      if (onBtn && (k === ' ' || k === 'Enter')) return;
      e.preventDefault();
      if (phase === 'paused') return;
      if (nm === 'left') keys.left = true;
      else if (nm === 'right') keys.right = true;
      if (phase === 'ready') begin();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('keyup', function (e) {
    var nm = keyName(e.key);
    if (nm === 'left') keys.left = false;
    else if (nm === 'right') keys.right = false;
  });
  window.addEventListener('blur', function () { keys.left = false; keys.right = false; ptr = null; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('resize', function () {
    if (phase === 'ready' || phase === 'play' || phase === 'paused' || phase === 'over') { layout(); draw(0); }
  });

  els.startBtn.addEventListener('click', ready);
  els.pauseBtn.addEventListener('click', function () { if (phase === 'paused') resume(); else pause(); });
  els.resumeBtn.addEventListener('click', resume);

  if (window.setShareData) {
    window.setShareData(function () {
      var done = state && state.over;
      var sc = done ? C.score(state) : 0;
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { n: num(sc), tier: (R.tiers || [])[C.tierOf(sc)] || '' }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: ready });

  window.SLED_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: C.score(state), meters: C.meters(state), timeLeft: state.timeLeft, started: state.started, over: state.over, endReason: state.endReason,
        hearts: state.hearts, x: state.x, vx: state.vx, dir: state.dir, tx: state.tx, speed: state.speed, air: state.air, inv: state.inv,
        items: C.items(state), flags: state.flags, gifts: state.gifts, stars: state.stars, jumps: state.jumps, hits: state.hits, bonus: state.bonus,
        objs: state.objs.length };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(40, Number(k) || 1)); return speed; },
    steer: function (dir) { forced = dir == null ? null : { dir: Number(dir) || 0 }; return forced; },
    target: function (x) { forced = x == null ? null : { tx: Number(x) }; return forced; },
    autopilot: function (on) { auto = !!on; return auto; },
    begin: begin,
    best: getBest
  };
  show('start');
})();
