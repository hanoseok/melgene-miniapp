/* apps/snowball/snowball.js — 시작(티징) → 눈싸움(캔버스, 눈 요새가 있는 겨울 마당) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 snowball-core.js(SNOWBALL_CORE, 언어 무관, 고정 시간 간격), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 흐름: 시작 버튼 → 준비(안내 표시, 시간 안 흐름) → 첫 입력(마당 누르기·숙이기 버튼·키)이 판을 시작(track('start'))
 *   → 60초가 끝나거나 하트 3개를 다 잃으면 잠시 뒤 끝 화면(track('done')). 다시 하기 = 새 준비 상태.
 * 입력: 마당(내 눈벽 위)을 누르면 그 자리로 던진다(상대가 있으면 그 상대를 겨냥). 내 눈벽(아래쪽)이나 숙이기 버튼을 누르고 있으면 숙임.
 *   키보드: ←/→(A/D) 겨냥할 요새 고르기, ↑/W/F/Enter 던지기, 스페이스/↓/S 누르고 있으면 숙임, P/Esc 일시정지.
 *   탭을 떠나면(visibilitychange·pagehide) 자동 일시정지(시계도 멈춤).
 *   prefers-reduced-motion 이면 내리는 눈을 적게·멈춘 채로 두고, 흔들림·번쩍임·떠오르는 글자 움직임을 끈다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 *   말이 안 되는 점수(C.plausible 거짓)는 보내지 않는다.
 * 그리기: requestAnimationFrame, devicePixelRatio(최대 2.5), 세계(360×600 단위)를 필드 크기에 맞춰 늘림. 그림은 모두 코드로 그린다(저작권 캐릭터 없음).
 * 디버그/검사용 핸들: window.SB_APP (phase(), state(), best(), timeScale(k), control(duck), autopilot(on), begin(), throwAt(x, y))
 */
(function () {
  'use strict';

  var C = window.SNOWBALL_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'snowball_best_v1';
  var END_DELAY = REDUCED ? 450 : 1300;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();
  var PF = (function () { try { return new Intl.NumberFormat(LANG, { style: 'percent', maximumFractionDigits: 0 }); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), time: $('hud-time'), timeBox: null, lives: $('hud-lives'), livesBox: null, pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('sb-canvas'), hint: $('tap-hint'), duckBtn: $('duck-btn'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), reason: $('res-reason'), newBest: $('res-newbest'), bestLine: $('res-best'),
    hits: $('res-hits'), acc: $('res-acc'), combo: $('res-combo'), tier: $('res-tier'),
    rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  els.timeBox = els.time ? els.time.closest('.sb-hud-box') : null;
  els.livesBox = els.lives ? els.lives.closest('.sb-hud-box') : null;
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | ready | play | paused | over | end
  var pausedFrom = 'play';
  var state = null;
  var raf = 0, last = 0, speed = 1, auto = false;
  var runId = 0, doneSent = false;
  var hudScore = -1, hudTime = -1, hudLives = -1, hudAlert = null;
  var view = { w: 320, h: 533, dpr: 1, k: 1 };
  var clock = 0;           // 장식 애니메이션 시간(ms)
  var pops = [];           // 떠오르는 글자 { x, y, text, tone, age }
  var puffs = [];          // 눈 튀김 { x, y, r, age }
  var flakes = [];         // 내리는 눈 (장식)
  var flash = 0, shake = 0, overAt = 0, throwAnim = 0, duckK = 0;
  var fontFamily = 'sans-serif';
  // 입력
  var keys = { duck: false };
  var duckPtrs = [];       // 숙이기 중인 포인터 id
  var forcedDuck = null;   // 검사용 SB_APP.control(duck)
  var AIM_ORDER = C.SLOTS.map(function (s, i) { return i; }).sort(function (a, b) { return C.SLOTS[a].x - C.SLOTS[b].x; });
  var aim = AIM_ORDER.indexOf(3), kbAim = false;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function pct(r) { return PF ? PF.format(r) : Math.round(r * 100) + '%'; }

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
    var seed = 11;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var n = REDUCED ? 14 : 46;
    for (var i = 0; i < n; i++) flakes.push({ x: r() * C.W, y: r() * C.H, s: 0.8 + r() * 2.2, v: 18 + r() * 34, p: r() * 6.28 });
  })();

  // ---------------------------------------------------------------- 캔버스 크기 (세계 비율 W:H 그대로, 숙이기 버튼 자리 남김)
  function layout() {
    var shell = els.play.parentNode;
    var w = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    w = Math.max(240, Math.floor(w));
    var h = Math.round(w * C.H / C.W);
    var rect = els.field.getBoundingClientRect();
    var duckH = els.duckBtn ? els.duckBtn.offsetHeight + 8 : 68;
    var availH = Math.max(340, window.innerHeight - Math.max(0, rect.top) - duckH - 12);
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
  var HZ = C.HORIZON, WY = C.WALL_Y;
  var COATS = ['#e8574c', '#2f7de1', '#3aa36b', '#8a5cc9'];
  var HATS = ['#2f6fbf', '#f4b63f', '#e8574c', '#3aa36b'];
  var SKINS = ['#ffd9b8', '#f1c09a', '#c98e64', '#8d5a3b'];

  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function circle(g, x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }

  function drawScene(g) {
    // 하늘
    var grd = g.createLinearGradient(0, 0, 0, HZ);
    grd.addColorStop(0, '#86bdec'); grd.addColorStop(1, '#dcedfb');
    g.fillStyle = grd; g.fillRect(0, 0, C.W, HZ + 2);
    // 먼 언덕·나무
    g.fillStyle = '#c4dcf0';
    g.beginPath(); g.moveTo(0, HZ - 22); g.quadraticCurveTo(70, HZ - 52, 150, HZ - 28); g.quadraticCurveTo(240, HZ - 6, 360, HZ - 40); g.lineTo(360, HZ + 2); g.lineTo(0, HZ + 2); g.fill();
    g.fillStyle = '#3f7a64';
    [[22, 30], [40, 22], [300, 34], [322, 26], [340, 20], [128, 18]].forEach(function (t) {
      g.beginPath(); g.moveTo(t[0], HZ - 4 - t[1]); g.lineTo(t[0] + t[1] * 0.34, HZ - 2); g.lineTo(t[0] - t[1] * 0.34, HZ - 2); g.fill();
    });
    g.fillStyle = '#ffffff';
    [[22, 30], [40, 22], [300, 34], [322, 26], [340, 20], [128, 18]].forEach(function (t) {
      g.beginPath(); g.moveTo(t[0], HZ - 4 - t[1]); g.lineTo(t[0] + t[1] * 0.12, HZ - 4 - t[1] * 0.66); g.lineTo(t[0] - t[1] * 0.12, HZ - 4 - t[1] * 0.66); g.fill();
    });
    // 눈 마당
    var sg = g.createLinearGradient(0, HZ, 0, C.H);
    sg.addColorStop(0, '#eef6fd'); sg.addColorStop(1, '#ffffff');
    g.fillStyle = sg; g.fillRect(0, HZ, C.W, C.H - HZ);
    g.strokeStyle = 'rgba(160, 196, 226, 0.45)'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(0, 300); g.quadraticCurveTo(180, 286, 360, 302); g.moveTo(0, 420); g.quadraticCurveTo(180, 404, 360, 422); g.stroke();
  }

  function drawFlakes(g, dt) {
    g.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      if (!REDUCED) {
        f.y += f.v * dt / 1000;
        f.x += Math.sin(clock / 900 + f.p) * 0.25;
        if (f.y > C.H + 4) { f.y = -4; }
        if (f.x < -4) f.x = C.W + 4; else if (f.x > C.W + 4) f.x = -4;
      }
      g.beginPath(); g.arc(f.x, f.y, f.s, 0, Math.PI * 2); g.fill();
    }
  }

  // 눈 요새 (slot.y = 윗선)
  function drawFort(g, sl) {
    var s = sl.s, x = sl.x, y = sl.y, w = 62 * s, h = 46 * s;
    g.fillStyle = 'rgba(120, 160, 200, 0.22)';
    g.beginPath(); g.ellipse(x, y + h, w + 6 * s, 7 * s, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(x - w, y + h); g.lineTo(x - w, y + 9 * s); g.quadraticCurveTo(x - w, y, x - w + 10 * s, y);
    g.lineTo(x + w - 10 * s, y); g.quadraticCurveTo(x + w, y, x + w, y + 9 * s); g.lineTo(x + w, y + h); g.closePath(); g.fill();
    g.strokeStyle = '#b9d3e8'; g.lineWidth = 2; g.stroke();
    // 눈 벽돌
    g.strokeStyle = '#dbe9f5'; g.lineWidth = 1.6;
    g.beginPath();
    for (var r = 1; r <= 2; r++) { var yy = y + h * r / 3; g.moveTo(x - w + 3, yy); g.lineTo(x + w - 3, yy); }
    for (var c = -1; c <= 1; c++) { g.moveTo(x + c * w * 0.5 + (c ? 0 : w * 0.25), y + 2); g.lineTo(x + c * w * 0.5 + (c ? 0 : w * 0.25), y + h / 3); }
    for (var d = -1; d <= 1; d += 2) { g.moveTo(x + d * w * 0.25, y + h / 3); g.lineTo(x + d * w * 0.25, y + h * 2 / 3); }
    g.stroke();
    g.fillStyle = 'rgba(255, 255, 255, 0.9)';
    g.beginPath(); g.ellipse(x - w * 0.4, y + 2, w * 0.3, 3 * s, 0, 0, Math.PI * 2); g.fill();
  }

  // 아이 (look = 0..3: 옷·모자·피부색)
  function drawKid(g, p, flagFriend) {
    var look = p.look || 0;
    var coat = COATS[look], hat = HATS[(look + 1) % 4], skin = SKINS[(look + p.id) % 4];
    var winding = p.wind > 0 && p.phase !== 'hit';
    // 몸·목도리
    g.fillStyle = coat; rr(g, -20, -30, 40, 56, 14); g.fill();
    g.fillStyle = flagFriend ? '#f4b63f' : '#ffffff';
    rr(g, -17, -32, 34, 8, 4); g.fill(); g.fillRect(8, -28, 7, 16);
    // 팔
    g.strokeStyle = coat; g.lineWidth = 9; g.lineCap = 'round';
    if (winding) {
      var lift = Math.min(1, 1 - p.wind / (p.windMs || 500)) ;
      g.beginPath(); g.moveTo(15, -20); g.lineTo(22 + lift * 4, -46 - lift * 10); g.stroke();
      circle(g, 23 + lift * 4, -52 - lift * 10, 8.5, '#ffffff');
      g.strokeStyle = '#b9d3e8'; g.lineWidth = 1.2; g.beginPath(); g.arc(23 + lift * 4, -52 - lift * 10, 8.5, 0, Math.PI * 2); g.stroke();
    } else if (!flagFriend) {
      circle(g, -17, -4, 6, hat); circle(g, 17, -4, 6, hat);
    }
    if (flagFriend) {
      // 흰 깃발 (항복 — 친구)
      var wave = REDUCED ? 0 : Math.sin(clock / 160 + p.id) * 4;
      g.strokeStyle = '#7a5638'; g.lineWidth = 3; g.beginPath(); g.moveTo(16, 0); g.lineTo(22, -86); g.stroke();
      g.fillStyle = '#ffffff'; g.strokeStyle = '#9fb6ca'; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(22, -86); g.quadraticCurveTo(36, -90 + wave, 50, -84); g.lineTo(48, -62 + wave * 0.5); g.quadraticCurveTo(36, -68 - wave, 21, -64); g.closePath(); g.fill(); g.stroke();
      circle(g, 17, -8, 6, hat);
      circle(g, -17, -4, 6, hat);
    }
    // 머리
    circle(g, 0, -44, 17, skin);
    // 모자
    g.fillStyle = hat;
    g.beginPath(); g.moveTo(-17, -46); g.quadraticCurveTo(-17, -66, 0, -66); g.quadraticCurveTo(17, -66, 17, -46); g.closePath(); g.fill();
    g.fillStyle = '#ffffff'; rr(g, -18, -50, 36, 7, 3); g.fill();
    circle(g, 0, -68, 5, '#ffffff');
    drawFace(g, p, 0, -40);
  }
  function drawFace(g, p, cx, cy) {
    if (p.phase === 'hit') {
      g.strokeStyle = '#1d2a3a'; g.lineWidth = 1.8; g.lineCap = 'round';
      [-6, 6].forEach(function (ex) { g.beginPath(); g.moveTo(cx + ex - 2.5, cy - 4.5); g.lineTo(cx + ex + 2.5, cy + 0.5); g.moveTo(cx + ex + 2.5, cy - 4.5); g.lineTo(cx + ex - 2.5, cy + 0.5); g.stroke(); });
      // 얼굴에 눈 철퍽
      g.fillStyle = '#ffffff';
      [[-4, -2, 7], [5, 2, 6], [0, 5, 5], [-9, 4, 4], [9, -4, 4]].forEach(function (b) { g.beginPath(); g.arc(cx + b[0], cy + b[1], b[2], 0, Math.PI * 2); g.fill(); });
      return;
    }
    circle(g, cx - 6, cy - 2, 2, '#1d2a3a'); circle(g, cx + 6, cy - 2, 2, '#1d2a3a');
    g.fillStyle = 'rgba(240, 120, 120, 0.45)';
    g.beginPath(); g.arc(cx - 10, cy + 3, 3, 0, Math.PI * 2); g.arc(cx + 10, cy + 3, 3, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#1d2a3a'; g.lineWidth = 1.6; g.lineCap = 'round';
    if (p.wind > 0) { circle(g, cx, cy + 5, 3, '#8a2d2d'); }
    else { g.beginPath(); g.moveTo(cx - 4, cy + 4); g.quadraticCurveTo(cx, cy + 8, cx + 4, cy + 4); g.stroke(); }
  }

  function drawSnowman(g, p, golden) {
    var body = golden ? '#f6c64a' : '#ffffff', edge = golden ? '#d9a21f' : '#b9d3e8';
    if (golden && !REDUCED) {
      g.fillStyle = 'rgba(255, 214, 102, ' + (0.28 + 0.12 * Math.sin(clock / 180)).toFixed(3) + ')';
      g.beginPath(); g.arc(0, -30, 44, 0, Math.PI * 2); g.fill();
    }
    g.lineWidth = 1.6; g.strokeStyle = edge;
    g.fillStyle = body; g.beginPath(); g.arc(0, 2, 25, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.arc(0, -40, 18, 0, Math.PI * 2); g.fill(); g.stroke();
    // 단추
    circle(g, 0, -12, 2.4, '#2a2a33'); circle(g, 0, -2, 2.4, '#2a2a33');
    // 목도리
    g.fillStyle = golden ? '#e8574c' : '#2f7de1'; rr(g, -15, -26, 30, 6, 3); g.fill(); g.fillRect(6, -24, 6, 13);
    // 막대 팔
    g.strokeStyle = '#6b4a34'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-20, -14); g.lineTo(-38, -30); g.moveTo(-31, -24); g.lineTo(-36, -36); g.stroke();
    if (p.wind > 0 && p.phase !== 'hit') {
      g.beginPath(); g.moveTo(20, -14); g.lineTo(30, -52); g.stroke();
      circle(g, 31, -58, 8.5, '#ffffff');
      g.strokeStyle = '#b9d3e8'; g.lineWidth = 1.2; g.beginPath(); g.arc(31, -58, 8.5, 0, Math.PI * 2); g.stroke();
    } else { g.beginPath(); g.moveTo(20, -14); g.lineTo(38, -28); g.stroke(); }
    // 모자 (황금 = 왕관)
    if (golden) {
      g.fillStyle = '#ffde59'; g.strokeStyle = '#c48a12'; g.lineWidth = 1.2;
      g.beginPath(); g.moveTo(-12, -54); g.lineTo(-12, -66); g.lineTo(-6, -60); g.lineTo(0, -70); g.lineTo(6, -60); g.lineTo(12, -66); g.lineTo(12, -54); g.closePath(); g.fill(); g.stroke();
      if (!REDUCED) {
        g.fillStyle = '#ffffff';
        var tw = (clock / 260) % 6.28;
        [[-30, -60], [28, -70], [34, -20]].forEach(function (s, i) { var r = 2 + 1.5 * Math.sin(tw + i * 2); g.beginPath(); g.moveTo(s[0], s[1] - r * 2); g.lineTo(s[0] + r * 0.6, s[1]); g.lineTo(s[0], s[1] + r * 2); g.lineTo(s[0] - r * 0.6, s[1]); g.fill(); });
      }
    } else {
      g.fillStyle = '#8a5cc9';
      g.beginPath(); g.moveTo(-15, -50); g.quadraticCurveTo(-14, -66, 0, -66); g.quadraticCurveTo(14, -66, 15, -50); g.closePath(); g.fill();
      circle(g, 0, -67, 4, '#ffffff');
    }
    // 얼굴
    if (p.phase === 'hit') { drawFace(g, p, 0, -38); return; }
    circle(g, -6, -44, 2.2, '#2a2a33'); circle(g, 6, -44, 2.2, '#2a2a33');
    g.fillStyle = '#f08a2c'; g.beginPath(); g.moveTo(0, -39); g.lineTo(16, -36); g.lineTo(0, -34); g.closePath(); g.fill();
    g.fillStyle = '#2a2a33';
    [-6, -2, 2, 6].forEach(function (mx, i) { g.beginPath(); g.arc(mx, -29 + (i === 0 || i === 3 ? -1.5 : 0), 1.2, 0, Math.PI * 2); g.fill(); });
  }

  function drawDog(g, p) {
    var fur = '#c98e54', dark = '#7a5230';
    // 친구 표시: 하트 말풍선
    if (p.phase !== 'hit') {
      g.fillStyle = '#ffffff'; rr(g, 14, -84, 28, 22, 8); g.fill();
      g.beginPath(); g.moveTo(20, -63); g.lineTo(18, -56); g.lineTo(27, -63); g.fill();
      g.fillStyle = '#e8574c';
      g.beginPath(); g.moveTo(28, -66); g.bezierCurveTo(18, -72, 22, -80, 28, -76); g.bezierCurveTo(34, -80, 38, -72, 28, -66); g.fill();
    }
    // 앞발
    circle(g, -13, -2, 7, fur); circle(g, 13, -2, 7, fur);
    g.fillStyle = fur; rr(g, -18, -26, 36, 30, 12); g.fill();
    // 머리·귀
    circle(g, 0, -38, 18, fur);
    var flop = REDUCED ? 0 : Math.sin(clock / 220 + p.id) * 0.12;
    g.fillStyle = dark;
    g.save(); g.translate(-16, -46); g.rotate(0.35 + flop); g.beginPath(); g.ellipse(0, 8, 6, 13, 0, 0, Math.PI * 2); g.fill(); g.restore();
    g.save(); g.translate(16, -46); g.rotate(-0.35 - flop); g.beginPath(); g.ellipse(0, 8, 6, 13, 0, 0, Math.PI * 2); g.fill(); g.restore();
    if (p.phase === 'hit') { drawFace(g, p, 0, -38); return; }
    g.fillStyle = '#f1d3ad'; g.beginPath(); g.ellipse(0, -31, 10, 8, 0, 0, Math.PI * 2); g.fill();
    circle(g, -7, -42, 2.3, '#1d2a3a'); circle(g, 7, -42, 2.3, '#1d2a3a');
    circle(g, 0, -35, 3.2, '#1d2a3a');
    g.fillStyle = '#ef7d8c'; rr(g, -3, -29, 6, 8, 3); g.fill();
  }

  function drawPop(g, p) {
    var sl = C.SLOTS[p.slot];
    var rise = p.phase === 'hit' ? Math.max(0, 1 - Math.pow(p.t / C.HIT_MS, 1.6)) : p.rise;
    if (rise <= 0) return;
    var s = sl.s;
    g.save();
    g.beginPath(); g.rect(sl.x - 70 * s, 0, 140 * s, sl.y + 1); g.clip();
    g.translate(sl.x, sl.y + (1 - rise) * 92 * s);
    g.scale(s, s);
    if (p.phase === 'hit' && !REDUCED) g.rotate(Math.min(0.5, p.t / 500) * (p.id % 2 ? 1 : -1));
    if (p.kind === 'kid') drawKid(g, p, false);
    else if (p.kind === 'flag') drawKid(g, p, true);
    else if (p.kind === 'snowman') drawSnowman(g, p, false);
    else if (p.kind === 'golden') drawSnowman(g, p, true);
    else drawDog(g, p);
    g.restore();
    // 팔을 든 상대 위 경고
    if (p.wind > 0 && p.phase === 'up') {
      var a = REDUCED ? 1 : 0.6 + 0.4 * Math.sin(clock / 70);
      g.globalAlpha = a;
      var wx = sl.x, wy = sl.y - 96 * s;
      circle(g, wx, wy, 9 * s + 3, '#e8574c');
      g.fillStyle = '#ffffff'; g.font = '700 ' + Math.round(14 * s + 2) + 'px ' + fontFamily; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('!', wx, wy + 1);
      g.globalAlpha = 1;
    }
  }

  // 내가 던진 공: 손 → 목표 (작아지며 포물선)
  function drawBalls(g) {
    if (!state) return;
    for (var i = 0; i < state.balls.length; i++) {
      var b = state.balls[i], t = Math.min(1, b.t / b.dur);
      var x0 = C.THROW_X + 26, y0 = C.THROW_Y - 30;
      var x = x0 + (b.x - x0) * t, y = y0 + (b.y - y0) * t - Math.sin(Math.PI * t) * 46;
      var far = b.dur >= C.FLIGHT_FAR;
      var r = 12 + ((far ? 5 : 6.5) - 12) * t;
      circle(g, x, y, r, '#ffffff');
      g.strokeStyle = '#a9c6de'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
    }
  }
  // 날아오는 공: 상대 → 나 (커지며 다가옴)
  function drawIncoming(g) {
    if (!state || !state.incoming.length) return;
    for (var i = 0; i < state.incoming.length; i++) {
      var b = state.incoming[i], t = Math.min(1, b.t / b.dur);
      var x = b.x0 + (C.THROW_X - b.x0) * t, y = b.y0 + (WY - 24 - b.y0) * t - Math.sin(Math.PI * t) * 34;
      var r = 4 + 30 * t * t;
      g.fillStyle = 'rgba(30, 60, 100, 0.18)';
      g.beginPath(); g.ellipse(x, Math.min(C.H - 6, y + 26 + 40 * t), r * 0.9, r * 0.28, 0, 0, Math.PI * 2); g.fill();
      circle(g, x, y, r, '#ffffff');
      g.strokeStyle = '#8fb0cc'; g.lineWidth = 1.4; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
      g.fillStyle = 'rgba(200, 220, 240, 0.9)'; g.beginPath(); g.arc(x + r * 0.3, y + r * 0.25, r * 0.35, 0, Math.PI * 2); g.fill();
    }
    // 경고: 벽 위 빨간 느낌표 + 가장자리 붉은 빛
    var a = REDUCED ? 1 : 0.65 + 0.35 * Math.sin(clock / 60);
    g.globalAlpha = a;
    circle(g, C.THROW_X + 72, WY - 34, 15, '#e8574c');
    g.fillStyle = '#ffffff'; g.font = '700 22px ' + fontFamily; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('!', C.THROW_X + 72, WY - 33);
    g.globalAlpha = 1;
    if (!REDUCED) {
      var vg = g.createRadialGradient(C.W / 2, C.H / 2, C.H * 0.38, C.W / 2, C.H / 2, C.H * 0.72);
      vg.addColorStop(0, 'rgba(232, 87, 76, 0)'); vg.addColorStop(1, 'rgba(232, 87, 76, ' + (0.28 * a).toFixed(3) + ')');
      g.fillStyle = vg; g.fillRect(0, 0, C.W, C.H);
    }
  }

  // 나: 눈벽 뒤 (뒷모습 — 털모자), 숙이면 벽 뒤로 내려감
  function drawPlayer(g) {
    var hy = WY - 26 + duckK * 34;
    var hx = C.THROW_X;
    g.fillStyle = '#e8574c'; rr(g, hx - 26, hy + 12, 52, 50, 16); g.fill();
    circle(g, hx, hy, 22, '#6b4a34');
    g.fillStyle = '#2f7de1';
    g.beginPath(); g.moveTo(hx - 22, hy + 2); g.quadraticCurveTo(hx - 22, hy - 26, hx, hy - 26); g.quadraticCurveTo(hx + 22, hy - 26, hx + 22, hy + 2); g.closePath(); g.fill();
    g.fillStyle = '#ffffff'; rr(g, hx - 23, hy - 2, 46, 8, 4); g.fill();
    circle(g, hx, hy - 28, 6.5, '#ffffff');
    // 장갑 (던지는 손)
    if (duckK < 0.5) {
      var up = throwAnim > 0 ? throwAnim / 160 : 0;
      circle(g, hx - 30, hy + 20, 9, '#2f7de1');
      circle(g, hx + 30 + up * 4, hy + 18 - up * 26, 9, '#2f7de1');
      if (!up && state && state.throwCd <= 0) { circle(g, hx + 30, hy + 8, 7, '#ffffff'); }
    }
  }
  function drawWall(g) {
    g.fillStyle = '#ffffff';
    g.beginPath(); g.moveTo(0, C.H); g.lineTo(0, WY + 14); g.quadraticCurveTo(0, WY, 16, WY); g.lineTo(C.W - 16, WY); g.quadraticCurveTo(C.W, WY, C.W, WY + 14); g.lineTo(C.W, C.H); g.closePath(); g.fill();
    g.strokeStyle = '#b9d3e8'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(0, WY + 14); g.quadraticCurveTo(0, WY, 16, WY); g.lineTo(C.W - 16, WY); g.quadraticCurveTo(C.W, WY, C.W, WY + 14); g.stroke();
    g.strokeStyle = '#dbe9f5'; g.lineWidth = 2;
    g.beginPath();
    for (var r = 0; r < 3; r++) {
      var y = WY + 34 + r * 34; g.moveTo(8, y); g.lineTo(C.W - 8, y);
      for (var c = 0; c < 6; c++) { var x = 30 + c * 60 + (r % 2 ? 30 : 0); g.moveTo(x, y - 34 + (r ? 0 : 20)); g.lineTo(x, y); }
    }
    g.stroke();
    g.fillStyle = 'rgba(255, 255, 255, 0.95)';
    g.beginPath(); g.ellipse(70, WY + 2, 50, 5, 0, 0, Math.PI * 2); g.ellipse(270, WY + 3, 44, 4, 0, 0, Math.PI * 2); g.fill();
  }

  function drawAim(g) {
    if (!kbAim || phase !== 'play') return;
    var sl = C.SLOTS[AIM_ORDER[aim]], c = C.hitCenter(sl);
    g.strokeStyle = 'rgba(232, 87, 76, 0.9)'; g.lineWidth = 2.4;
    var r = C.HIT_R * sl.s;
    g.beginPath(); g.arc(c.x, c.y, r, 0, Math.PI * 2);
    g.moveTo(c.x - r - 6, c.y); g.lineTo(c.x - r + 8, c.y); g.moveTo(c.x + r - 8, c.y); g.lineTo(c.x + r + 6, c.y);
    g.moveTo(c.x, c.y - r - 6); g.lineTo(c.x, c.y - r + 8); g.moveTo(c.x, c.y + r - 8); g.lineTo(c.x, c.y + r + 6);
    g.stroke();
  }

  function drawCombo(g) {
    if (!state || state.combo < 2 || phase !== 'play') return;
    var txt = fmt(P.combo, { n: state.combo });
    g.font = '700 17px ' + fontFamily; g.textAlign = 'left'; g.textBaseline = 'middle';
    var w = g.measureText(txt).width + 20;
    g.fillStyle = 'rgba(29, 78, 137, 0.88)'; rr(g, 10, 12, w, 28, 14); g.fill();
    g.fillStyle = '#ffde59'; g.fillText(txt, 20, 27);
  }

  function drawPuffs(g) {
    for (var i = 0; i < puffs.length; i++) {
      var q = puffs[i], t = q.age / 420;
      g.globalAlpha = Math.max(0, 1 - t);
      g.fillStyle = '#ffffff';
      var spread = REDUCED ? q.r : q.r * (1 + t * 1.4);
      for (var j = 0; j < 6; j++) {
        var an = j * 1.047 + q.r;
        g.beginPath(); g.arc(q.x + Math.cos(an) * spread, q.y + Math.sin(an) * spread * 0.7, q.r * 0.45 * (1 - t * 0.5), 0, Math.PI * 2); g.fill();
      }
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
      var yy = p.y - (REDUCED ? 0 : t * 24);
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
    var list = state ? state.pops : [];
    // 뒷줄: 상대 → 요새, 앞줄: 상대 → 요새
    [0, 1].forEach(function (row) {
      list.forEach(function (p) { if (C.SLOTS[p.slot].row === row) drawPop(g, p); });
      C.SLOTS.forEach(function (sl) { if (sl.row === row) drawFort(g, sl); });
    });
    drawAim(g);
    drawBalls(g);
    drawPuffs(g);
    drawFlakes(g, dt || 0);
    drawPlayer(g);
    drawWall(g);
    drawIncoming(g);
    drawCombo(g);
    drawPops(g);
    if (flash > 0) { g.fillStyle = 'rgba(255, 255, 255, ' + (0.6 * flash).toFixed(3) + ')'; g.fillRect(0, 0, C.W, C.H); }
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
    if (force || hudLives !== state.hearts) {
      var hurt = hudLives > state.hearts && !force;
      hudLives = state.hearts;
      var hs = els.lives.children;
      for (var i = 0; i < hs.length; i++) hs[i].classList.toggle('is-lost', i >= state.hearts);
      if (els.livesBox && hurt && !REDUCED) { els.livesBox.classList.remove('is-hurt'); void els.livesBox.offsetWidth; els.livesBox.classList.add('is-hurt'); }
    }
    var alert = state.incoming.length > 0 && phase === 'play';
    if (force || hudAlert !== alert) { hudAlert = alert; els.duckBtn.classList.toggle('is-alert', alert); }
    els.duckBtn.classList.toggle('is-down', duckNow());
  }

  // ---------------------------------------------------------------- 입력
  function duckNow() {
    if (forcedDuck != null) return forcedDuck;
    return keys.duck || duckPtrs.length > 0;
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function pop(text, tone, x, y, big) {
    if (!text) return;
    pops.push({ x: Math.max(60, Math.min(C.W - 60, x)), y: y, text: text, tone: tone, age: 0, big: !!big });
  }
  function puff(x, y, r) { puffs.push({ x: x, y: y, r: r || 8, age: 0 }); }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* noop */ } }
  function onEvents(evs) {
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.type === 'hit') {
        puff(ev.x, ev.y, 10);
        pop(ev.kind === 'golden' ? fmt(P.golden, { n: ev.pts }) : '+' + num(ev.pts), 'good', ev.x, ev.y - 34, ev.kind === 'golden');
      } else if (ev.type === 'oops') {
        puff(ev.x, ev.y, 10);
        pop(fmt(P.oops, { n: num(Math.abs(ev.pts)) }), 'bad', ev.x, ev.y - 34, true);
        buzz(60);
      } else if (ev.type === 'miss') {
        puff(ev.x, ev.y, 6);
        pop(P.miss, 'plain', ev.x, ev.y - 26);
      } else if (ev.type === 'block') {
        puff(C.THROW_X, WY - 4, 14);
        pop(P.block, 'good', C.THROW_X, WY - 120);
      } else if (ev.type === 'ouch') {
        if (!REDUCED) { flash = 0.9; shake = 1; }
        pop(P.ouch, 'bad', C.THROW_X, WY - 120, true);
        buzz(90);
      } else if (ev.type === 'time' || ev.type === 'out') {
        pop(ev.type === 'time' ? P.timeUp : P.out, 'plain', C.W / 2, C.H * 0.42, true);
        phase = 'over';
        overAt = performance.now();
      }
    }
    if (pops.length > 5) pops.splice(0, pops.length - 5);
    if (puffs.length > 10) puffs.splice(0, puffs.length - 10);
  }

  function doThrow(x, y) {
    if (phase !== 'play' || !state) return null;
    var b = C.throwAt(state, x, y);
    if (b) throwAnim = 160;
    return b;
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
      if (!auto) C.setDuck(state, duckNow());
      // 큰 timeScale 에서도 tick 이 MAX_STEP 에 잘리지 않게 나눠서 넣는다
      var rest = gdt;
      while (rest > 0 && phase === 'play') {
        var part = Math.min(rest, C.MAX_STEP);
        onEvents(C.step(state, part, auto ? C.autoPlay : null));
        rest -= part;
      }
    }
    var target = state && state.duck ? 1 : 0;
    duckK += (target - duckK) * Math.min(1, gdt / (REDUCED ? 1 : 60));
    if (throwAnim > 0) throwAnim = Math.max(0, throwAnim - gdt);
    for (var i = pops.length - 1; i >= 0; i--) { pops[i].age += gdt; if (pops[i].age >= 1000) pops.splice(i, 1); }
    for (var j = puffs.length - 1; j >= 0; j--) { puffs[j].age += gdt; if (puffs[j].age >= 420) puffs.splice(j, 1); }
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
    pops = []; puffs = []; flash = 0; shake = 0; auto = false; forcedDuck = null; throwAnim = 0; duckK = 0;
    keys.duck = false; duckPtrs = []; kbAim = false; aim = AIM_ORDER.indexOf(3);
    hudScore = -1; hudTime = -1; hudLives = -1; hudAlert = null;
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
    keys.duck = false; duckPtrs = [];
    if (state) C.setDuck(state, false);
    els.duckBtn.classList.remove('is-down');
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
    els.reason.textContent = s.endReason === 'out' ? R.reasonOut : R.reasonTime;
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, sc)) });
    els.bestLine.hidden = isNew;
    els.hits.textContent = num(s.hits);
    els.acc.textContent = pct(C.accuracy(s));
    els.combo.textContent = num(s.bestCombo);
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
  function worldXY(e) {
    var r = els.field.getBoundingClientRect();
    return { x: (e.clientX - r.left) / (r.width || 1) * C.W, y: (e.clientY - r.top) / (r.height || 1) * C.H };
  }
  function dropDuck(id) {
    for (var i = duckPtrs.length - 1; i >= 0; i--) if (duckPtrs[i] === id) duckPtrs.splice(i, 1);
  }
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'ready') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    if (phase === 'ready') { begin(); return; }
    kbAim = false;
    var w = worldXY(e);
    if (w.y >= WY - 6) {
      // 내 눈벽을 누르고 있으면 숙임
      try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      dropDuck(e.pointerId); duckPtrs.push(e.pointerId);
      return;
    }
    doThrow(w.x, w.y);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    els.field.addEventListener(t, function (e) { dropDuck(e.pointerId); });
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play' || phase === 'ready') e.preventDefault(); });

  els.duckBtn.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'ready') return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    try { els.duckBtn.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    dropDuck(e.pointerId); duckPtrs.push(e.pointerId);
    if (phase === 'ready') begin();
    updateHud(false);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    els.duckBtn.addEventListener(t, function (e) { dropDuck(e.pointerId); updateHud(false); });
  });
  els.duckBtn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  // 키보드로 버튼을 "누르면"(Enter/Space) 잠깐 숙임 — 키 처리는 아래 keydown 이 한다
  els.duckBtn.addEventListener('click', function (e) { e.preventDefault(); });

  function keyName(k) {
    if (k === ' ' || k === 'Spacebar' || k === 'ArrowDown' || k === 'Down' || k === 's' || k === 'S') return 'duck';
    if (k === 'ArrowLeft' || k === 'Left' || k === 'a' || k === 'A') return 'left';
    if (k === 'ArrowRight' || k === 'Right' || k === 'd' || k === 'D') return 'right';
    if (k === 'ArrowUp' || k === 'Up' || k === 'w' || k === 'W' || k === 'f' || k === 'F' || k === 'Enter') return 'throw';
    return '';
  }
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    var nm = keyName(k);
    if (nm) {
      var onBtn = document.activeElement && document.activeElement.tagName === 'BUTTON' && document.activeElement !== els.duckBtn;
      if (onBtn && (k === ' ' || k === 'Enter')) return;
      e.preventDefault();
      if (phase === 'paused') return;
      if (phase === 'ready') { begin(); if (nm === 'duck') keys.duck = true; return; }
      if (phase !== 'play') return;
      if (nm === 'duck') keys.duck = true;
      else if (nm === 'left' || nm === 'right') { if (!e.repeat || kbAim) { kbAim = true; aim = (aim + (nm === 'left' ? -1 : 1) + AIM_ORDER.length) % AIM_ORDER.length; } }
      else if (nm === 'throw' && !e.repeat) {
        kbAim = true;
        var c = C.hitCenter(C.SLOTS[AIM_ORDER[aim]]);
        C.setDuck(state, duckNow());
        doThrow(c.x, c.y);
      }
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('keyup', function (e) {
    if (keyName(e.key) === 'duck') keys.duck = false;
  });
  window.addEventListener('blur', function () { keys.duck = false; duckPtrs = []; });
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

  window.SB_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: C.score(state), timeLeft: state.timeLeft, started: state.started, over: state.over, endReason: state.endReason,
        hearts: state.hearts, duck: state.duck, hits: state.hits, throws: state.throws, misses: state.misses, friendHits: state.friendHits,
        combo: state.combo, bestCombo: state.bestCombo, blocked: state.blocked, taken: state.taken,
        pops: state.pops.map(function (p) { return { id: p.id, slot: p.slot, kind: p.kind, phase: p.phase, wind: p.wind }; }),
        balls: state.balls.length, incoming: state.incoming.length };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(40, Number(k) || 1)); return speed; },
    control: function (duck) { forcedDuck = duck == null ? null : !!duck; return forcedDuck; },
    autopilot: function (on) { auto = !!on; return auto; },
    throwAt: function (x, y) { return !!doThrow(x, y); },
    begin: begin,
    best: getBest
  };
  show('start');
})();
