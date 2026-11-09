/* apps/icefish/icefish.js — 시작(티징) → 얼음 낚시(캔버스, 옆에서 본 얼음 호수) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 icefish-core.js(ICEFISH_CORE, 언어 무관, 고정 시간 간격), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 흐름: 시작 버튼 → 준비("얼음 아래를 누르고 있으면 줄이 내려가요") → 첫 입력(필드 누르기·↓/↑·스페이스)이 판을 시작(track('start'))
 *   → 60초가 끝나면 잠시 뒤 끝 화면(track('done')). 다시 하기 = 새 준비 상태(첫 입력에서 다시 track('start')).
 * 입력: 필드를 누르고 있는 동안 hold = true, 누른 자리의 깊이 = target(손가락을 움직이면 따라감, 여러 손가락이면 마지막 손가락).
 *   ↓/S·스페이스 = 아래로(줄다리기 중엔 감기), ↑/W = 위로. 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지(시계도 멈춤). P/Esc 일시정지.
 *   prefers-reduced-motion 이면 장식 효과(거품·빛줄기 흔들림·떠오르는 글자·번쩍임)를 끈다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 *   말이 안 되는 점수(C.plausible 거짓)는 보내지 않는다.
 * 그리기: requestAnimationFrame, devicePixelRatio(최대 2.5), 세계(360×600 단위)를 필드 크기에 맞춰 늘림. 그림은 모두 코드로 그린다.
 * 디버그/검사용 핸들: window.ICE_APP (phase(), state(), best(), timeScale(k), control(hold, target), autopilot(on), begin())
 */
(function () {
  'use strict';

  var C = window.ICEFISH_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var FISH = UI.fish || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'icefish_best_v1';
  var END_DELAY = REDUCED ? 450 : 1200;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), time: $('hud-time'), timeBox: null, pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('ice-canvas'), hint: $('tap-hint'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), newBest: $('res-newbest'), bestLine: $('res-best'),
    caught: $('res-caught'), snapped: $('res-snapped'), bestCatch: $('res-bestcatch'), tier: $('res-tier'),
    rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  els.timeBox = els.time ? els.time.closest('.ice-hud-box') : null;
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | ready | play | paused | over | end
  var pausedFrom = 'play';
  var state = null;
  var raf = 0, last = 0, speed = 1, auto = false;
  var runId = 0, doneSent = false;
  var hudScore = -1, hudTime = -1;
  var view = { w: 320, h: 533, dpr: 1, k: 1 };
  var clock = 0;           // 장식 애니메이션 시간(ms)
  var pops = [];           // 떠오르는 글자 { x, y, text, tone, age }
  var bubbles = [];        // 거품 (장식)
  var flash = 0, overAt = 0, biteAt = -9999;
  var fontFamily = 'sans-serif';
  // 입력
  var keys = { up: false, down: false, space: false };
  var pointers = [];       // [{ id, y(세계) }]
  var forced = null;       // 검사용 ICE_APP.control(hold, target)

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

  // ---------------------------------------------------------------- 거품 (장식, 고정 시드)
  (function makeBubbles() {
    var seed = 7;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 18; i++) bubbles.push({ x: 20 + r() * (C.W - 40), y: C.ICE_Y + r() * (C.BOTTOM - C.ICE_Y), s: 1.2 + r() * 2.4, v: 14 + r() * 26, p: r() * 6.28 });
  })();

  // ---------------------------------------------------------------- 캔버스 크기 (세계 비율 W:H 그대로)
  function layout() {
    var shell = els.play.parentNode;
    var w = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    w = Math.max(240, Math.floor(w));
    var h = Math.round(w * C.H / C.W);
    var rect = els.field.getBoundingClientRect();
    var availH = Math.max(380, window.innerHeight - Math.max(0, rect.top) - 14);
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
  var HX = C.HOLE_X, IT = C.ICE_TOP, IY = C.ICE_Y;
  function drawSky(g) {
    var grd = g.createLinearGradient(0, 0, 0, IT);
    grd.addColorStop(0, '#bcdcf2'); grd.addColorStop(1, '#eef6fc');
    g.fillStyle = grd; g.fillRect(0, 0, C.W, IT);
    // 먼 산·숲
    g.fillStyle = '#a9c8e0';
    g.beginPath(); g.moveTo(0, 82); g.lineTo(40, 48); g.lineTo(70, 70); g.lineTo(110, 36); g.lineTo(150, 74); g.lineTo(190, 52); g.lineTo(240, 80); g.lineTo(290, 44); g.lineTo(330, 70); g.lineTo(360, 56); g.lineTo(360, IT); g.lineTo(0, IT); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(110, 36); g.lineTo(122, 48); g.lineTo(98, 48); g.fill();
    g.beginPath(); g.moveTo(290, 44); g.lineTo(301, 55); g.lineTo(279, 55); g.fill();
    g.fillStyle = '#6f97b8';
    for (var i = 0; i < 12; i++) {
      var tx = 8 + i * 31 + (i % 3) * 4, th = 16 + (i * 7) % 10;
      g.beginPath(); g.moveTo(tx, IT - 6 - th); g.lineTo(tx + 7, IT - 6); g.lineTo(tx - 7, IT - 6); g.fill();
    }
    // 눈 덮인 호숫가
    g.fillStyle = '#f7fbff';
    g.beginPath(); g.moveTo(0, IT - 8); g.quadraticCurveTo(180, IT - 18, 360, IT - 8); g.lineTo(360, IT); g.lineTo(0, IT); g.fill();
  }

  function drawIce(g) {
    // 얼음판 (구멍 양쪽)
    var grd = g.createLinearGradient(0, IT, 0, IY);
    grd.addColorStop(0, '#f4fbff'); grd.addColorStop(0.35, '#d7ecf9'); grd.addColorStop(1, '#a9d3ee');
    g.fillStyle = grd;
    g.fillRect(0, IT, HX - C.HOLE_HALF, IY - IT);
    g.fillRect(HX + C.HOLE_HALF, IT, C.W - HX - C.HOLE_HALF, IY - IT);
    g.fillStyle = '#ffffff';
    g.fillRect(0, IT - 3, HX - C.HOLE_HALF - 2, 5);
    g.fillRect(HX + C.HOLE_HALF + 2, IT - 3, C.W - HX - C.HOLE_HALF, 5);
    // 금 간 선
    g.strokeStyle = 'rgba(120, 175, 215, 0.55)'; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(40, IT + 8); g.lineTo(62, IT + 22); g.lineTo(58, IT + 34);
    g.moveTo(270, IT + 6); g.lineTo(288, IT + 18); g.lineTo(312, IT + 20); g.stroke();
    // 구멍 가장자리
    g.fillStyle = 'rgba(70, 140, 190, 0.35)';
    g.fillRect(HX - C.HOLE_HALF - 3, IT, 3, IY - IT);
    g.fillRect(HX + C.HOLE_HALF, IT, 3, IY - IT);
  }

  function drawWater(g) {
    var grd = g.createLinearGradient(0, IY, 0, C.H);
    grd.addColorStop(0, '#2e86b9'); grd.addColorStop(0.55, '#145a8a'); grd.addColorStop(1, '#082742');
    g.fillStyle = grd;
    g.fillRect(0, IY, C.W, C.H - IY);
    g.fillRect(HX - C.HOLE_HALF, IT, C.HOLE_HALF * 2, IY - IT);
    // 구멍에서 들어오는 빛줄기
    var sway = REDUCED ? 0 : Math.sin(clock / 1400) * 10;
    var lg = g.createLinearGradient(0, IY, 0, IY + 260);
    lg.addColorStop(0, 'rgba(210, 240, 255, 0.28)'); lg.addColorStop(1, 'rgba(210, 240, 255, 0)');
    g.fillStyle = lg;
    g.beginPath(); g.moveTo(HX - C.HOLE_HALF, IY); g.lineTo(HX + C.HOLE_HALF, IY); g.lineTo(HX + 60 + sway, IY + 260); g.lineTo(HX - 60 + sway, IY + 260); g.fill();
    // 얼음 아랫면 그림자
    g.fillStyle = 'rgba(255, 255, 255, 0.16)';
    g.fillRect(0, IY, HX - C.HOLE_HALF, 4); g.fillRect(HX + C.HOLE_HALF, IY, C.W, 4);
    // 바닥: 모래·돌·수초
    g.fillStyle = '#0a2238';
    g.beginPath(); g.moveTo(0, C.BOTTOM); g.quadraticCurveTo(90, C.BOTTOM - 8, 180, C.BOTTOM - 2); g.quadraticCurveTo(270, C.BOTTOM + 4, 360, C.BOTTOM - 6); g.lineTo(360, C.H); g.lineTo(0, C.H); g.fill();
    g.fillStyle = '#163a55';
    [[30, 2, 9], [118, 4, 7], [250, 1, 10], [320, 3, 6]].forEach(function (r) { g.beginPath(); g.ellipse(r[0], C.BOTTOM + r[1], r[2], r[2] * 0.6, 0, 0, Math.PI * 2); g.fill(); });
    g.strokeStyle = '#2f7a5e'; g.lineWidth = 3; g.lineCap = 'round';
    [[60, 46], [76, 34], [150, 40], [290, 52], [304, 38]].forEach(function (wd, i) {
      var sw = REDUCED ? 0 : Math.sin(clock / 900 + i) * 6;
      g.beginPath(); g.moveTo(wd[0], C.BOTTOM + 2); g.quadraticCurveTo(wd[0] + sw, C.BOTTOM - wd[1] / 2, wd[0] + sw * 1.4, C.BOTTOM - wd[1]); g.stroke();
    });
  }

  function drawBubbles(g, dt) {
    if (REDUCED) return;
    g.strokeStyle = 'rgba(200, 235, 255, 0.5)'; g.lineWidth = 1;
    for (var i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];
      b.y -= b.v * dt / 1000;
      b.x += Math.sin(clock / 700 + b.p) * 0.15;
      if (b.y < IY + 6) { b.y = C.BOTTOM - 4; }
      g.beginPath(); g.arc(b.x, b.y, b.s, 0, Math.PI * 2); g.stroke();
    }
  }

  // 물고기: 몸통 타원 + 꼬리 + 지느러미 + 눈 (종류마다 색·크기)
  var LOOK = {
    minnow: { body: '#b9d7e6', belly: '#e8f4fa', fin: '#8fb6cb', stripe: null },
    perch: { body: '#8cc66b', belly: '#e7f2c9', fin: '#e8753a', stripe: '#3f6e33' },
    trout: { body: '#9ab0bf', belly: '#f1d9d6', fin: '#7d93a3', stripe: '#e48a8a' },
    pike: { body: '#6e8f55', belly: '#dfe8c4', fin: '#4f6a3b', stripe: '#c9d98e' },
    golden: { body: '#f4b63f', belly: '#ffe7a3', fin: '#e39a1f', stripe: '#fff3c4' }
  };
  function drawFish(g, f, hooked) {
    var k = C.KIND_BY_ID[f.kind];
    if (k.junk) return drawBoot(g, f);
    var L = k.len, Hh = L * (f.kind === 'pike' ? 0.26 : 0.38);
    var lk = LOOK[f.kind];
    var wig = REDUCED ? 0 : Math.sin(f.wob * 3) * 0.12;
    g.save();
    g.translate(f.x, f.y);
    if (hooked) g.rotate(-Math.PI / 2 + Math.sin(clock / 70) * 0.25);
    g.scale(hooked ? 1 : f.dir, 1);
    if (f.kind === 'golden' && !REDUCED) {
      g.fillStyle = 'rgba(255, 220, 120, ' + (0.18 + 0.1 * Math.sin(clock / 200)).toFixed(3) + ')';
      g.beginPath(); g.ellipse(0, 0, L * 1.1, L * 0.7, 0, 0, Math.PI * 2); g.fill();
    }
    // 꼬리
    g.fillStyle = lk.fin;
    g.save(); g.translate(-L * 0.78, 0); g.rotate(wig);
    g.beginPath(); g.moveTo(0, 0); g.lineTo(-L * 0.42, -Hh * 0.9); g.lineTo(-L * 0.34, 0); g.lineTo(-L * 0.42, Hh * 0.9); g.closePath(); g.fill();
    g.restore();
    // 등지느러미
    g.beginPath(); g.moveTo(-L * 0.2, -Hh * 0.8); g.quadraticCurveTo(0, -Hh * 1.5, L * 0.18, -Hh * 0.8); g.fill();
    // 몸통
    g.fillStyle = lk.body;
    g.beginPath(); g.ellipse(0, 0, L * 0.8, Hh, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = lk.belly;
    g.beginPath(); g.ellipse(L * 0.05, Hh * 0.38, L * 0.6, Hh * 0.5, 0, 0, Math.PI * 2); g.fill();
    if (lk.stripe) {
      g.fillStyle = lk.stripe;
      if (f.kind === 'perch') { for (var i = -1; i <= 1; i++) g.fillRect(i * L * 0.22 - 1.5, -Hh * 0.85, 3, Hh * 1.1); }
      else if (f.kind === 'trout') { g.fillRect(-L * 0.55, -1, L * 1.05, 2.4); }
      else if (f.kind === 'pike') { for (var j = 0; j < 4; j++) { g.beginPath(); g.ellipse(-L * 0.45 + j * L * 0.25, -Hh * 0.2, 2.6, 1.4, 0, 0, Math.PI * 2); g.fill(); } }
      else { g.beginPath(); g.ellipse(-L * 0.1, -Hh * 0.35, L * 0.3, Hh * 0.18, 0, 0, Math.PI * 2); g.fill(); }
    }
    // 눈·입
    g.fillStyle = '#ffffff';
    g.beginPath(); g.arc(L * 0.5, -Hh * 0.2, Math.max(2, L * 0.09), 0, Math.PI * 2); g.fill();
    g.fillStyle = '#0b2238';
    g.beginPath(); g.arc(L * 0.53, -Hh * 0.2, Math.max(1.1, L * 0.05), 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(11, 34, 56, 0.55)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(L * 0.8, Hh * 0.1); g.lineTo(L * 0.66, Hh * 0.22); g.stroke();
    g.restore();
  }
  function drawBoot(g, f) {
    g.save();
    g.translate(f.x, f.y);
    g.scale(f.dir, 1);
    g.fillStyle = '#6b4a34';
    g.beginPath(); g.moveTo(-8, -14); g.lineTo(2, -14); g.lineTo(2, -2); g.lineTo(14, 0); g.quadraticCurveTo(17, 6, 12, 7); g.lineTo(-8, 7); g.closePath(); g.fill();
    g.fillStyle = '#4b3324'; g.fillRect(-9, 5, 23, 3);
    g.fillStyle = '#8a6648'; g.fillRect(-8, -14, 10, 3);
    g.strokeStyle = '#d9c39a'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(-3, -9); g.lineTo(1, -8); g.moveTo(-3, -5); g.lineTo(1, -4); g.stroke();
    g.restore();
  }

  function drawAngler(g, tipX, tipY) {
    // 접이식 의자 + 낚시꾼(파카·털모자) + 낚싯대
    var bx = HX - 62, by = IT - 2;
    g.strokeStyle = '#5a4130'; g.lineWidth = 2.4;
    g.beginPath(); g.moveTo(bx - 12, by); g.lineTo(bx + 10, by - 18); g.moveTo(bx + 10, by); g.lineTo(bx - 12, by - 18); g.stroke();
    g.fillStyle = '#7a5638'; g.fillRect(bx - 14, by - 21, 26, 4);
    // 몸
    g.fillStyle = '#e8574c';
    g.beginPath(); g.ellipse(bx, by - 34, 13, 16, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#c4433a'; g.fillRect(bx - 13, by - 30, 26, 3);
    // 다리·장화
    g.fillStyle = '#2f5d8a'; g.fillRect(bx + 2, by - 22, 14, 7);
    g.fillStyle = '#26384d'; g.fillRect(bx + 12, by - 22, 6, 20); g.fillRect(bx + 12, by - 4, 10, 4);
    // 머리·모자
    g.fillStyle = '#ffd9b8'; g.beginPath(); g.arc(bx + 2, by - 56, 9, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#2f5d8a'; g.beginPath(); g.moveTo(bx - 8, by - 57); g.quadraticCurveTo(bx + 2, by - 74, bx + 12, by - 57); g.closePath(); g.fill();
    g.fillStyle = '#ffffff'; g.fillRect(bx - 8, by - 59, 20, 4);
    g.beginPath(); g.arc(bx + 2, by - 72, 3.6, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#0b2238'; g.beginPath(); g.arc(bx + 6, by - 55, 1.2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f29a8c'; g.beginPath(); g.arc(bx + 8, by - 52, 2, 0, Math.PI * 2); g.fill();
    // 팔 + 낚싯대 (손 → 대 끝, 줄다리기 땐 휘어짐)
    var hx = bx + 10, hy = by - 36;
    g.strokeStyle = '#3a2a1e'; g.lineWidth = 2.6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(hx - 4, hy + 4); g.quadraticCurveTo((hx + tipX) / 2, Math.min(hy, tipY) - 10 + (tipY - hy) * 0.5, tipX, tipY); g.stroke();
    g.fillStyle = '#e8574c'; g.beginPath(); g.arc(hx, hy, 4, 0, Math.PI * 2); g.fill();
  }

  function drawLine(g, tipX, tipY) {
    var hy = state ? state.hookY : C.HOOK_MIN;
    var fight = state && state.phase === 'fight';
    g.strokeStyle = fight && state.tension >= C.RED ? 'rgba(255, 120, 110, 0.95)' : 'rgba(240, 248, 255, 0.85)';
    g.lineWidth = fight ? 1.4 : 1;
    g.beginPath(); g.moveTo(tipX, tipY); g.lineTo(HX, IT - 2); g.lineTo(HX, hy); g.stroke();
    // 봉돌 + 바늘 (걸린 물고기가 있으면 물고기가 가린다)
    g.fillStyle = '#c9d2db';
    g.beginPath(); g.ellipse(HX, hy - 8, 2.4, 3.4, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#dfe6ec'; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(HX, hy - 4); g.lineTo(HX, hy + 3); g.quadraticCurveTo(HX, hy + 7, HX - 4, hy + 5); g.stroke();
    g.fillStyle = '#e8574c'; g.beginPath(); g.arc(HX, hy + 2, 2, 0, Math.PI * 2); g.fill();
  }

  function drawTarget(g) {
    if (!state || state.phase !== 'line' || !state.hold || phase !== 'play') return;
    var ty = state.target;
    g.strokeStyle = 'rgba(255, 255, 255, 0.55)'; g.setLineDash([4, 4]); g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(HX - 34, ty); g.lineTo(HX + 34, ty); g.stroke();
    g.setLineDash([]);
  }

  function drawTension(g) {
    if (!state || state.phase !== 'fight') return;
    var x = C.W - 30, y0 = IY + 24, y1 = C.BOTTOM - 24, h = y1 - y0, w = 16;
    var t = Math.max(0, Math.min(1, state.tension));
    g.fillStyle = 'rgba(6, 26, 44, 0.65)';
    roundRect(g, x - 4, y0 - 4, w + 8, h + 8, 8); g.fill();
    // 빨간 구간
    g.fillStyle = 'rgba(232, 87, 76, 0.4)';
    g.fillRect(x, y0, w, h * (1 - C.RED));
    g.strokeStyle = '#ff8a7f'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(x - 4, y0 + h * (1 - C.RED)); g.lineTo(x + w + 4, y0 + h * (1 - C.RED)); g.stroke();
    // 채움
    var col = t >= C.RED ? '#ff5a4d' : t >= 0.5 ? '#ffcf4a' : '#6fdc9a';
    if (t >= C.RED && !REDUCED && Math.floor(clock / 120) % 2) col = '#ffffff';
    g.fillStyle = col;
    g.fillRect(x + 2, y1 - h * t, w - 4, h * t);
    g.strokeStyle = 'rgba(255, 255, 255, 0.7)'; g.lineWidth = 1.5;
    roundRect(g, x, y0, w, h, 4); g.stroke();
    // 남은 거리(얼음까지)
    var prog = 1 - (state.hookY - IY) / (C.HOOK_MAX - IY);
    g.fillStyle = 'rgba(255, 255, 255, 0.85)';
    g.beginPath(); g.arc(18, IY + 20 + (C.BOTTOM - IY - 40) * (1 - prog), 5, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(255, 255, 255, 0.35)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(18, IY + 20); g.lineTo(18, C.BOTTOM - 20); g.stroke();
  }
  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  function drawPops(g) {
    if (!pops.length) return;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '600 19px ' + fontFamily;
    g.lineJoin = 'round'; g.lineWidth = 4;
    for (var i = 0; i < pops.length; i++) {
      var p = pops[i], t = p.age / 1100;
      g.globalAlpha = Math.max(0, 1 - t * t);
      g.strokeStyle = 'rgba(6, 26, 44, 0.85)';
      g.fillStyle = p.tone === 'good' ? '#ffe27a' : p.tone === 'bad' ? '#ff8a7f' : '#ffffff';
      var yy = p.y - (REDUCED ? 0 : t * 26);
      g.strokeText(p.text, p.x, yy); g.fillText(p.text, p.x, yy);
    }
    g.globalAlpha = 1;
  }

  function draw(dt) {
    var g = ctx;
    g.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    g.clearRect(0, 0, view.w, view.h);
    g.setTransform(view.dpr * view.k, 0, 0, view.dpr * view.k, 0, 0);
    drawSky(g);
    drawWater(g);
    drawBubbles(g, dt || 0);
    var fight = state && state.phase === 'fight';
    var bend = fight ? Math.min(1, state.tension) : (clock - biteAt < 300 ? 0.5 : 0);
    var tipX = HX - 2, tipY = IT - 58 + bend * 30;
    if (state) {
      for (var i = 0; i < state.fish.length; i++) if (!state.fish[i].hooked) drawFish(g, state.fish[i], false);
    }
    drawIce(g);
    drawTarget(g);
    drawLine(g, tipX, tipY);
    if (state && state.hooked) drawFish(g, state.hooked, true);
    drawAngler(g, tipX, tipY);
    drawTension(g);
    drawPops(g);
    if (flash > 0) { g.fillStyle = 'rgba(255, 255, 255, ' + (0.55 * flash).toFixed(3) + ')'; g.fillRect(0, 0, C.W, C.H); }
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    var sc = C.score(state);
    if (force || hudScore !== sc) { hudScore = sc; els.score.textContent = num(sc); }
    var tl = Math.ceil(state.timeLeft / 1000);
    if (force || hudTime !== tl) {
      hudTime = tl; els.time.textContent = num(tl);
      if (els.timeBox) els.timeBox.classList.toggle('is-low', tl <= 10 && state.started);
    }
  }

  // ---------------------------------------------------------------- 입력 → { hold, target }
  function currentInput() {
    if (forced) return forced;
    if (pointers.length) return { hold: true, target: pointers[pointers.length - 1].y };
    if (keys.up) return { hold: true, target: C.HOOK_MIN };
    if (keys.down || keys.space) return { hold: true, target: C.HOOK_MAX };
    return { hold: false, target: null };
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function pop(text, tone, y) { if (text) pops.push({ x: Math.max(70, Math.min(C.W - 70, HX)), y: y, text: text, tone: tone, age: 0 }); }
  function onEvents(evs) {
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.type === 'bite') {
        biteAt = clock;
        pop(P.bite, 'plain', Math.max(C.ICE_Y + 40, state.hookY - 30));
        try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) { /* noop */ }
      } else if (ev.type === 'catch') {
        pop(fmt(P.catchPop, { fish: FISH[ev.kind] || ev.kind, n: ev.pts }), ev.pts > 0 ? 'good' : 'plain', C.ICE_TOP - 30);
      } else if (ev.type === 'snap') {
        pop(P.snap, 'bad', C.ICE_Y + 50);
        if (!REDUCED) flash = 0.8;
      } else if (ev.type === 'escape') {
        pop(P.escape, 'bad', C.ICE_Y + 50);
      } else if (ev.type === 'time') {
        pop(P.timeUp, 'plain', C.H * 0.45);
        phase = 'over';
        overAt = performance.now();
      }
    }
    if (pops.length > 4) pops.splice(0, pops.length - 4);
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
      if (!auto) { var inp = currentInput(); C.setInput(state, inp.hold, inp.target); }
      // 큰 timeScale 에서도 tick 이 MAX_STEP 에 잘리지 않게 나눠서 넣는다
      var rest = gdt;
      while (rest > 0 && phase === 'play') {
        var part = Math.min(rest, C.MAX_STEP);
        onEvents(C.step(state, part, auto ? C.autoPlay : null));
        rest -= part;
      }
    }
    for (var i = pops.length - 1; i >= 0; i--) { pops[i].age += gdt; if (pops[i].age >= 1100) pops.splice(i, 1); }
    if (flash > 0) flash = Math.max(0, flash - gdt / 300);
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
    pops = []; flash = 0; auto = false; forced = null;
    keys.up = keys.down = keys.space = false; pointers = [];
    hudScore = -1; hudTime = -1;
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
    keys.up = keys.down = keys.space = false; pointers = [];
    if (state) C.setInput(state, false, null);
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
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, sc)) });
    els.bestLine.hidden = isNew;
    els.caught.textContent = num(s.caught);
    els.snapped.textContent = num(s.snapped);
    els.bestCatch.textContent = s.bestKind ? fmt(R.bestCatch, { fish: FISH[s.bestKind] || s.bestKind }) : R.noCatch;
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

  // ---------------------------------------------------------------- 입력
  function worldY(e) {
    var r = els.field.getBoundingClientRect();
    return (e.clientY - r.top) / (r.height || 1) * C.H;
  }
  function dropPointer(id) {
    for (var i = pointers.length - 1; i >= 0; i--) if (pointers[i].id === id) pointers.splice(i, 1);
  }
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'ready') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    dropPointer(e.pointerId);
    pointers.push({ id: e.pointerId, y: worldY(e) });
    if (phase === 'ready') begin();
  });
  els.field.addEventListener('pointermove', function (e) {
    for (var i = 0; i < pointers.length; i++) if (pointers[i].id === e.pointerId) pointers[i].y = worldY(e);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    els.field.addEventListener(t, function (e) { dropPointer(e.pointerId); });
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play' || phase === 'ready') e.preventDefault(); });

  function keyName(k) {
    if (k === 'ArrowUp' || k === 'Up' || k === 'w' || k === 'W') return 'up';
    if (k === 'ArrowDown' || k === 'Down' || k === 's' || k === 'S') return 'down';
    if (k === ' ' || k === 'Spacebar' || k === 'Enter') return 'space';
    return '';
  }
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    var nm = keyName(k);
    if (nm) {
      if (nm === 'space' && document.activeElement && document.activeElement.tagName === 'BUTTON') return;
      e.preventDefault();
      if (phase === 'paused') return;
      keys[nm] = true;
      if (phase === 'ready') begin();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('keyup', function (e) {
    var nm = keyName(e.key);
    if (nm) keys[nm] = false;
  });
  window.addEventListener('blur', function () { keys.up = keys.down = keys.space = false; });
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

  window.ICE_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: C.score(state), phase: state.phase, hookY: state.hookY, target: state.target, hold: state.hold, tension: state.tension,
        timeLeft: state.timeLeft, started: state.started, over: state.over, caught: state.caught, junk: state.junk, snapped: state.snapped,
        escaped: state.escaped, bestKind: state.bestKind, fish: state.fish.length, hooked: !!state.hooked };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(40, Number(k) || 1)); return speed; },
    control: function (hold, target) { forced = hold == null ? null : { hold: !!hold, target: target == null ? null : Number(target) }; return forced; },
    autopilot: function (on) { auto = !!on; return auto; },
    begin: begin,
    best: getBest
  };
  show('start');
})();
