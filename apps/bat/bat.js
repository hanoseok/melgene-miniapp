/* apps/bat/bat.js — 시작(티징) → 박쥐 날기(캔버스, 달밤 묘지) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 bat-core.js(BAT_CORE, 언어 무관, 고정 시간 간격), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(액션 게임). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 흐름: 시작 버튼 → 준비(박쥐가 제자리에서 둥실, "탭해서 날기") → 첫 탭이 판을 시작 → 부딪히면 박쥐가 떨어지고 잠시 뒤 끝 화면.
 * 입력: 필드 탭/클릭(pointerdown)·스페이스·엔터·↑·W. 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지. P/Esc 일시정지.
 *   prefers-reduced-motion 이면 장식 효과(별 반짝임·구름/언덕 흐름·날개 퍼덕임·둥실·+1 떠오름·부딪힘 번쩍임·화면 흔들림)를 끈다.
 * 그리기: requestAnimationFrame, devicePixelRatio(최대 2.5), 세계(360×600 단위)를 필드 크기에 맞춰 늘림.
 * 디버그/검사용 핸들: window.BAT_APP (phase(), state(), best(), timeScale(k), flap(), autopilot(on))
 */
(function () {
  'use strict';

  var C = window.BAT_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'bat_best_v1';
  var END_DELAY = REDUCED ? 450 : 1200;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), best: $('hud-best'), pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('bat-canvas'), hint: $('tap-hint'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), newBest: $('res-newbest'), bestLine: $('res-best'),
    flaps: $('res-flaps'), time: $('res-time'), rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | ready | play | paused | over | end
  var pausedFrom = 'play';
  var state = null;
  var raf = 0, last = 0, speed = 1, auto = false;
  var runId = 0, doneSent = false;
  var hudScore = -1;
  var view = { w: 320, h: 533, dpr: 1, k: 1 };
  var clock = 0;           // 장식 애니메이션 시간(ms)
  var flapAt = -1000;      // 마지막 날갯짓 시각(clock)
  var pops = [];           // +1 { x, y, age }
  var flash = 0, shake = 0;
  var overAt = 0;
  var fontFamily = 'sans-serif';

  // 별(고정 자리, 시드 없이 결정적)
  var STARS = (function () {
    var a = [], seed = 7;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 46; i++) a.push({ x: r() * C.W, y: r() * C.GROUND * 0.62, s: 0.6 + r() * 1.3, p: r() * 6.28 });
    return a;
  })();

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function num1(n) { return NF1 ? NF1.format(n) : n.toFixed(1); }

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
    var ff = getComputedStyle(document.body).getPropertyValue('--font-display');
    fontFamily = (ff && ff.trim()) || 'sans-serif';
  }

  // ---------------------------------------------------------------- 그리기 (세계 단위로 그린 뒤 k 배)
  function drawSky(g) {
    var grd = g.createLinearGradient(0, 0, 0, C.GROUND);
    grd.addColorStop(0, '#120a2c');
    grd.addColorStop(0.55, '#2b1957');
    grd.addColorStop(1, '#4a2a6e');
    g.fillStyle = grd;
    g.fillRect(0, 0, C.W, C.H);
    // 별
    for (var i = 0; i < STARS.length; i++) {
      var st = STARS[i];
      var a = REDUCED ? 0.7 : 0.45 + 0.4 * Math.sin(clock / 700 + st.p);
      g.globalAlpha = a;
      g.fillStyle = '#fff6d8';
      g.fillRect(st.x, st.y, st.s, st.s);
    }
    g.globalAlpha = 1;
    // 달 + 빛무리
    var mx = 268, my = 96;
    var glow = g.createRadialGradient(mx, my, 30, mx, my, 120);
    glow.addColorStop(0, 'rgba(255, 236, 170, 0.35)');
    glow.addColorStop(1, 'rgba(255, 236, 170, 0)');
    g.fillStyle = glow;
    g.fillRect(mx - 130, my - 130, 260, 260);
    g.beginPath(); g.arc(mx, my, 44, 0, Math.PI * 2); g.fillStyle = '#ffeeb8'; g.fill();
    g.fillStyle = 'rgba(214, 186, 120, 0.45)';
    g.beginPath(); g.arc(mx - 14, my - 10, 9, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(mx + 15, my + 12, 6, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(mx + 6, my - 20, 4, 0, Math.PI * 2); g.fill();
  }

  // 먼 언덕·성 실루엣 (천천히 흐름, 움직임 줄이기면 고정)
  function drawHills(g) {
    var off = REDUCED || !state ? 0 : (state.dist * 0.18) % 240;
    g.fillStyle = '#1d1240';
    g.beginPath();
    g.moveTo(0, C.GROUND);
    for (var x = -off; x <= C.W + 240; x += 240) {
      g.quadraticCurveTo(x + 60, C.GROUND - 92, x + 120, C.GROUND - 52);
      g.quadraticCurveTo(x + 180, C.GROUND - 16, x + 240, C.GROUND - 70);
    }
    g.lineTo(C.W + 240, C.GROUND); g.closePath(); g.fill();
    // 성 (언덕 하나에 하나)
    for (var cx = -off + 96; cx <= C.W + 120; cx += 480) {
      var by = C.GROUND - 70;
      g.fillRect(cx, by - 34, 34, 40);
      g.fillRect(cx - 10, by - 52, 12, 58);
      g.fillRect(cx + 30, by - 46, 12, 52);
      g.beginPath(); g.moveTo(cx - 13, by - 52); g.lineTo(cx - 4, by - 70); g.lineTo(cx + 5, by - 52); g.fill();
      g.beginPath(); g.moveTo(cx + 27, by - 46); g.lineTo(cx + 36, by - 62); g.lineTo(cx + 45, by - 46); g.fill();
      g.fillStyle = '#ffcf6b';
      g.fillRect(cx + 13, by - 22, 6, 8);
      g.fillStyle = '#1d1240';
    }
  }

  // 위 기둥 = 거꾸로 매달린 유령 나무 줄기, 아래 기둥 = 묘비(kind 0) 또는 유령 나무(kind 1). 그림은 충돌 사각형 안에 딱 맞춘다.
  function drawTrunk(g, x, y0, y1, fromTop) {
    var w = C.PW;
    var grd = g.createLinearGradient(x, 0, x + w, 0);
    grd.addColorStop(0, '#3b2a3f'); grd.addColorStop(0.5, '#5a4152'); grd.addColorStop(1, '#2e2032');
    g.fillStyle = grd;
    g.fillRect(x + 6, y0, w - 12, y1 - y0);
    // 끝(틈 쪽)의 넓은 뿌리/가지 머리
    var capH = 22;
    var cy = fromTop ? y1 - capH : y0;
    g.fillStyle = '#4a3446';
    g.beginPath();
    if (fromTop) {
      g.moveTo(x + 6, cy); g.lineTo(x, y1 - 6); g.lineTo(x + 10, y1); g.lineTo(x + 24, y1 - 5); g.lineTo(x + 38, y1); g.lineTo(x + 52, y1 - 5); g.lineTo(x + w, y1 - 2); g.lineTo(x + w - 6, cy);
    } else {
      g.moveTo(x + 6, y0 + capH); g.lineTo(x, y0 + 6); g.lineTo(x + 12, y0); g.lineTo(x + 26, y0 + 5); g.lineTo(x + 40, y0); g.lineTo(x + 54, y0 + 4); g.lineTo(x + w, y0 + 2); g.lineTo(x + w - 6, y0 + capH);
    }
    g.closePath(); g.fill();
    // 나무껍질 결
    g.strokeStyle = 'rgba(20, 10, 24, 0.45)'; g.lineWidth = 2;
    for (var lx = x + 16; lx < x + w - 10; lx += 13) {
      g.beginPath(); g.moveTo(lx, y0 + (fromTop ? 0 : capH)); g.lineTo(lx + 3, y1 - (fromTop ? capH : 0)); g.stroke();
    }
    // 옹이 눈(빛나는 두 점)
    var ey = fromTop ? y1 - capH - 26 : y0 + capH + 22;
    if ((fromTop ? y1 - y0 : y1 - y0) > 70) {
      g.fillStyle = '#ffb545';
      g.beginPath(); g.ellipse(x + w / 2 - 9, ey, 4, 2.6, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(x + w / 2 + 9, ey, 4, 2.6, 0, 0, Math.PI * 2); g.fill();
    }
  }
  function drawGrave(g, x, y0, y1) {
    var w = C.PW, r = w / 2;
    var grd = g.createLinearGradient(x, 0, x + w, 0);
    grd.addColorStop(0, '#8a8aa6'); grd.addColorStop(0.55, '#a7a7c2'); grd.addColorStop(1, '#6f6f8c');
    g.fillStyle = grd;
    g.beginPath();
    g.moveTo(x, y1); g.lineTo(x, y0 + r); g.arc(x + r, y0 + r, r, Math.PI, 0); g.lineTo(x + w, y1); g.closePath();
    g.fill();
    g.strokeStyle = 'rgba(30, 24, 52, 0.55)'; g.lineWidth = 2.5; g.stroke();
    // 새긴 십자가
    g.fillStyle = 'rgba(40, 32, 66, 0.55)';
    g.fillRect(x + r - 3, y0 + 16, 6, 30);
    g.fillRect(x + r - 11, y0 + 24, 22, 6);
    // 이끼·금
    g.fillStyle = 'rgba(96, 170, 110, 0.55)';
    g.beginPath(); g.ellipse(x + 12, y0 + r + 14, 9, 5, 0.4, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(40, 32, 66, 0.4)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(x + w - 14, y0 + 60); g.lineTo(x + w - 20, y0 + 74); g.lineTo(x + w - 15, y0 + 86); g.stroke();
  }
  function drawPillars(g) {
    if (!state) return;
    for (var i = 0; i < state.pillars.length; i++) {
      var p = state.pillars[i];
      if (p.x > C.W + 4 || p.x + C.PW < -4) continue;
      var top = p.gapY - p.gap / 2, bot = p.gapY + p.gap / 2;
      drawTrunk(g, p.x, -4, top, true);
      if (p.kind === 0) drawGrave(g, p.x, bot, C.GROUND + 2);
      else drawTrunk(g, p.x, bot, C.GROUND + 2, false);
    }
  }

  function drawGround(g) {
    var off = state ? state.dist % 32 : 0;
    g.fillStyle = '#24152e';
    g.fillRect(0, C.GROUND, C.W, C.H - C.GROUND);
    g.fillStyle = '#3b6b48';
    g.fillRect(0, C.GROUND, C.W, 6);
    g.fillStyle = '#2d5238';
    for (var x = -off; x < C.W + 32; x += 32) {
      g.beginPath(); g.moveTo(x, C.GROUND + 6); g.lineTo(x + 6, C.GROUND - 6); g.lineTo(x + 12, C.GROUND + 6); g.fill();
      g.fillStyle = 'rgba(255, 160, 60, 0.18)';
      g.fillRect(x + 18, C.GROUND + 18, 8, 4);
      g.fillStyle = '#2d5238';
    }
    // 안개(장식)
    if (!REDUCED) {
      var fog = g.createLinearGradient(0, C.GROUND - 40, 0, C.GROUND + 4);
      fog.addColorStop(0, 'rgba(200, 190, 255, 0)');
      fog.addColorStop(1, 'rgba(200, 190, 255, 0.16)');
      g.fillStyle = fog;
      g.fillRect(0, C.GROUND - 40, C.W, 44);
    }
  }

  function drawBat(g) {
    var y = state ? state.y : C.GROUND * 0.45;
    if (state && !state.started && !REDUCED) y += Math.sin(clock / 260) * 6;
    var vy = state ? state.vy : 0;
    var tilt = state && state.started ? Math.max(-0.45, Math.min(1.1, vy / 620)) : 0;
    if (state && state.over) tilt = Math.min(1.5, 0.6 + vy / 500);
    var since = clock - flapAt;
    // 날개: 날갯짓 직후 크게 퍼덕이고, 준비 상태에선 천천히 (움직임 줄이기면 펼친 채)
    var wing = REDUCED ? 0.2 : state && state.started && !state.over ? (since < 260 ? Math.cos(since / 260 * Math.PI * 2) : 0.15 + 0.15 * Math.sin(clock / 120)) : Math.sin(clock / 180) * 0.7;
    if (state && state.over) wing = -0.4;
    g.save();
    g.translate(C.BAT_X, y);
    g.rotate(tilt);
    var R0 = C.BAT_R;
    // 날개 (양쪽)
    g.fillStyle = '#3a1f52';
    g.strokeStyle = '#1a0b28'; g.lineWidth = 1.6;
    [-1, 1].forEach(function (sd) {
      var lift = -wing * 16;
      g.beginPath();
      g.moveTo(sd * 6, -4);
      g.quadraticCurveTo(sd * 22, -16 + lift, sd * 34, -8 + lift);
      g.quadraticCurveTo(sd * 30, 0 + lift * 0.5, sd * 26, 4 + lift * 0.3);
      g.quadraticCurveTo(sd * 20, 0 + lift * 0.3, sd * 16, 7 + lift * 0.2);
      g.quadraticCurveTo(sd * 12, 3, sd * 6, 6);
      g.closePath();
      g.fill(); g.stroke();
    });
    // 귀
    g.fillStyle = '#4b2a66';
    g.beginPath(); g.moveTo(-10, -9); g.lineTo(-7, -R0 - 6); g.lineTo(-2, -11); g.fill();
    g.beginPath(); g.moveTo(10, -9); g.lineTo(7, -R0 - 6); g.lineTo(2, -11); g.fill();
    // 몸
    var body = g.createRadialGradient(-4, -5, 2, 0, 0, R0);
    body.addColorStop(0, '#7a4aa0'); body.addColorStop(1, '#3d2058');
    g.fillStyle = body;
    g.beginPath(); g.ellipse(0, 0, R0 * 0.82, R0 * 0.78, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#1a0b28'; g.lineWidth = 1.6; g.stroke();
    // 눈 · 송곳니
    var dead = state && state.over;
    g.fillStyle = '#fff8e8';
    g.beginPath(); g.ellipse(-5, -3, 4.2, 4.8, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(6, -3, 4.2, 4.8, 0, 0, Math.PI * 2); g.fill();
    if (dead) {
      g.strokeStyle = '#1a0b28'; g.lineWidth = 1.6;
      [[-5, -3], [6, -3]].forEach(function (e) {
        g.beginPath(); g.moveTo(e[0] - 2.5, e[1] - 2.5); g.lineTo(e[0] + 2.5, e[1] + 2.5); g.moveTo(e[0] + 2.5, e[1] - 2.5); g.lineTo(e[0] - 2.5, e[1] + 2.5); g.stroke();
      });
    } else {
      g.fillStyle = '#1a0b28';
      g.beginPath(); g.arc(-4, -2.4, 2, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(7, -2.4, 2, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = '#fff8e8';
    g.beginPath(); g.moveTo(-3, 5); g.lineTo(-1.5, 9); g.lineTo(0, 5); g.fill();
    g.beginPath(); g.moveTo(2, 5); g.lineTo(3.5, 9); g.lineTo(5, 5); g.fill();
    g.fillStyle = 'rgba(255, 120, 160, 0.5)';
    g.beginPath(); g.ellipse(-10, 3, 2.6, 1.6, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(11, 3, 2.6, 1.6, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }

  function drawPops(g) {
    if (!pops.length) return;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '22px ' + fontFamily;
    g.lineJoin = 'round'; g.lineWidth = 4;
    for (var i = 0; i < pops.length; i++) {
      var p = pops[i], t = p.age / 700;
      g.globalAlpha = Math.max(0, 1 - t);
      g.strokeStyle = 'rgba(20, 10, 40, 0.7)';
      g.fillStyle = '#ffcf6b';
      g.strokeText('+1', p.x, p.y - t * 26); g.fillText('+1', p.x, p.y - t * 26);
    }
    g.globalAlpha = 1;
  }

  function draw() {
    var g = ctx;
    g.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    g.clearRect(0, 0, view.w, view.h);
    var sx = 0, sy = 0;
    if (shake > 0 && !REDUCED) { sx = (Math.random() - 0.5) * shake; sy = (Math.random() - 0.5) * shake; }
    g.setTransform(view.dpr * view.k, 0, 0, view.dpr * view.k, sx * view.dpr, sy * view.dpr);
    drawSky(g);
    drawHills(g);
    drawPillars(g);
    drawGround(g);
    drawBat(g);
    drawPops(g);
    if (flash > 0) { g.fillStyle = 'rgba(255, 255, 255, ' + (0.55 * flash).toFixed(3) + ')'; g.fillRect(0, 0, C.W, C.H); }
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    if (force || hudScore !== state.score) { hudScore = state.score; els.score.textContent = num(state.score); }
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function onEvents(evs) {
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.type === 'score' && !REDUCED) pops.push({ x: C.BAT_X + 30, y: state.y - 26, age: 0 });
      if (ev.type === 'hit') {
        phase = 'over';
        overAt = performance.now();
        if (!REDUCED) { flash = 1; shake = 8; }
      }
    }
    if (pops.length > 6) pops.splice(0, pops.length - 6);
  }

  // ---------------------------------------------------------------- 루프
  function loop(now) {
    raf = 0;
    if (phase !== 'ready' && phase !== 'play' && phase !== 'over') return;
    var dt = Math.min(100, Math.max(0, now - last));
    last = now;
    var gdt = dt * speed;
    clock += gdt;
    if (phase === 'play' || phase === 'over') {
      var evs = C.step(state, gdt, auto && phase === 'play' ? function (s) { var f = C.autoFlap(s); if (f) flapAt = clock; return f; } : null);
      onEvents(evs);
    }
    for (var i = pops.length - 1; i >= 0; i--) { pops[i].age += gdt; if (pops[i].age >= 700) pops.splice(i, 1); }
    if (flash > 0) flash = Math.max(0, flash - gdt / 260);
    if (shake > 0) shake = Math.max(0, shake - gdt / 30);
    draw();
    updateHud(false);
    if (phase === 'over' && now - overAt >= END_DELAY / Math.max(0.1, speed) && (state.grounded || REDUCED || now - overAt > 2600)) { finish(); return; }
    raf = requestAnimationFrame(loop);
  }
  function startLoop() {
    if (raf) cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }
  function stopLoop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  // ---------------------------------------------------------------- 시작 · 날갯짓 · 일시정지 · 끝
  function start() {
    runId++;
    stopLoop();
    state = C.newGame();
    pops = []; flash = 0; shake = 0; auto = false;
    hudScore = -1;
    doneSent = false;
    phase = 'ready';
    els.pausedBox.hidden = true;
    els.hint.hidden = false;
    els.best.textContent = num(getBest());
    show('play');
    layout();
    updateHud(true);
    draw();
    track('start');
    try { els.field.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    startLoop();
  }

  function doFlap() {
    if ((phase !== 'ready' && phase !== 'play') || !state) return false;
    if (phase === 'ready') { phase = 'play'; els.hint.hidden = true; }
    flapAt = clock;
    return C.flap(state);
  }

  function pause() {
    if (phase !== 'play' && phase !== 'ready') return;
    pausedFrom = phase;
    phase = 'paused';
    stopLoop();
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
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    els.resScore.textContent = num(s.score);
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
    els.bestLine.hidden = isNew;
    els.flaps.textContent = num(s.flaps);
    els.time.textContent = fmt(R.timeValue, { s: num1(s.flyTicks * C.TICK_MS / 1000) });
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(s, myRun);
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
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'ready') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    doFlap();
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play' || phase === 'ready') e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === ' ' || k === 'Spacebar' || k === 'Enter' || k === 'ArrowUp' || k === 'w' || k === 'W') {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON' && document.activeElement !== els.field) return;
      e.preventDefault();
      if (!e.repeat) doFlap();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('resize', function () {
    if (phase === 'ready' || phase === 'play' || phase === 'paused' || phase === 'over') { layout(); draw(); }
  });

  els.startBtn.addEventListener('click', start);
  els.pauseBtn.addEventListener('click', function () { if (phase === 'paused') resume(); else pause(); });
  els.resumeBtn.addEventListener('click', resume);

  if (window.setShareData) {
    window.setShareData(function () {
      var done = state && state.over;
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { n: num(state.score) }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.BAT_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      var p = C.nextPillar(state);
      return { seed: state.seed, score: state.score, flaps: state.flaps, y: state.y, vy: state.vy, started: state.started, over: state.over,
        hit: state.hit, pillars: state.pillars.length, next: p ? { x: p.x, gapY: p.gapY, gap: p.gap } : null };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(20, Number(k) || 1)); return speed; },
    flap: doFlap,
    autopilot: function (on) { auto = !!on; return auto; },
    best: getBest
  };
  show('start');
})();
