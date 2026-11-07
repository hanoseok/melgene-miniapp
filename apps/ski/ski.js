/* apps/ski/ski.js — 시작(티징) → 스키 활강(캔버스, 눈 덮인 슬로프) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 ski-core.js(SKI_CORE, 언어 무관, 고정 시간 간격), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(액션 게임). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 흐름: 시작 버튼 → 준비(스키어가 출발선에 서 있고 "탭해서 출발") → 첫 입력(필드 누르기·←/→·A/D·스페이스)이 판을 시작(track('start'))
 *   → 장애물에 부딪히면 넘어지고 잠시 뒤 끝 화면(track('done')). 다시 하기 = 새 준비 상태(첫 입력에서 다시 track('start')).
 * 입력: 필드의 왼쪽/오른쪽 절반을 누르고 있는 동안 그쪽으로(pointer, 여러 손가락이면 마지막 손가락), ←/→·A/D 키를 누르고 있는 동안.
 *   탭을 떠나면(visibilitychange·pagehide) 자동 일시정지. P/Esc 일시정지.
 *   prefers-reduced-motion 이면 장식 효과(눈송이·보너스 떠오름·부딪힘 번쩍임·화면 흔들림)를 끈다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 그리기: requestAnimationFrame, devicePixelRatio(최대 2.5), 세계(360×600 단위)를 필드 크기에 맞춰 늘림.
 * 디버그/검사용 핸들: window.SKI_APP (phase(), state(), best(), timeScale(k), steer(v), autopilot(on), begin())
 */
(function () {
  'use strict';

  var C = window.SKI_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'ski_best_v1';
  var END_DELAY = REDUCED ? 450 : 1100;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    dist: $('hud-dist'), best: $('hud-best'), pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('ski-canvas'), hint: $('tap-hint'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), newBest: $('res-newbest'), bestLine: $('res-best'),
    gates: $('res-gates'), time: $('res-time'), tier: $('res-tier'),
    rank: $('res-rank'), comparing: $('res-comparing'),
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
  var pops = [];           // 기문 보너스 { x, y(세계), text, ok, age }
  var trail = [];          // 스키 자국 { x, y(세계) }
  var flakes = [];         // 눈송이 (화면 좌표, 세계 단위)
  var flash = 0, shake = 0;
  var overAt = 0;
  var fontFamily = 'sans-serif';
  // 입력
  var keys = { left: false, right: false };
  var pointers = [];       // [{ id, side }]
  var forced = null;       // 검사용 SKI_APP.steer(v)

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

  // ---------------------------------------------------------------- 눈송이 (장식, 고정 시드)
  function makeFlakes() {
    var a = [], seed = 11;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 44; i++) a.push({ x: r() * C.W, y: r() * C.H, s: 1.2 + r() * 2.2, v: 26 + r() * 40, p: r() * 6.28 });
    return a;
  }
  flakes = makeFlakes();

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

  // 세계 y → 화면 y
  function sy(y) { return y - (state ? state.dist : 0) + C.SKIER_Y; }

  // ---------------------------------------------------------------- 그리기 (세계 단위로 그린 뒤 k 배)
  function drawSnow(g) {
    var grd = g.createLinearGradient(0, 0, 0, C.H);
    grd.addColorStop(0, '#eaf3fb');
    grd.addColorStop(1, '#f8fbfe');
    g.fillStyle = grd;
    g.fillRect(0, 0, C.W, C.H);
    // 눈 결 (거리 따라 흐름)
    var off = state ? state.dist % 120 : 0;
    g.strokeStyle = 'rgba(120, 160, 205, 0.16)';
    g.lineWidth = 2;
    for (var y = -off; y < C.H + 120; y += 120) {
      g.beginPath();
      g.moveTo(0, y + 30);
      g.bezierCurveTo(90, y + 4, 180, y + 60, 360, y + 18);
      g.stroke();
    }
    // 양옆 그늘(슬로프 가장자리)
    var l = g.createLinearGradient(0, 0, 26, 0);
    l.addColorStop(0, 'rgba(70, 120, 180, 0.32)'); l.addColorStop(1, 'rgba(70, 120, 180, 0)');
    g.fillStyle = l; g.fillRect(0, 0, 26, C.H);
    var rr = g.createLinearGradient(C.W, 0, C.W - 26, 0);
    rr.addColorStop(0, 'rgba(70, 120, 180, 0.32)'); rr.addColorStop(1, 'rgba(70, 120, 180, 0)');
    g.fillStyle = rr; g.fillRect(C.W - 26, 0, 26, C.H);
    // 가장자리 울타리 점선
    g.fillStyle = 'rgba(232, 72, 85, 0.55)';
    var fo = state ? state.dist % 40 : 0;
    for (var fy = -fo; fy < C.H; fy += 40) { g.fillRect(4, fy, 3, 16); g.fillRect(C.W - 7, fy, 3, 16); }
  }

  function drawTrail(g) {
    if (trail.length < 2) return;
    g.strokeStyle = 'rgba(110, 150, 196, 0.45)';
    g.lineWidth = 1.6;
    [-3.5, 3.5].forEach(function (off) {
      g.beginPath();
      for (var i = 0; i < trail.length; i++) {
        var p = trail[i];
        var yy = sy(p.y);
        if (i === 0) g.moveTo(p.x + off, yy); else g.lineTo(p.x + off, yy);
      }
      g.stroke();
    });
  }

  function drawTree(g, x, y, v) {
    // 그림자
    g.fillStyle = 'rgba(60, 100, 150, 0.18)';
    g.beginPath(); g.ellipse(x + 6, y + 6, 15, 5, 0, 0, Math.PI * 2); g.fill();
    // 줄기
    g.fillStyle = '#6b4a34'; g.fillRect(x - 2.5, y - 2, 5, 8);
    // 잎 3단
    var tones = ['#1f5f4a', '#26705a', '#1b5443'];
    var c = tones[v % 3];
    for (var i = 0; i < 3; i++) {
      var ty = y - 6 - i * 9, w = 15 - i * 3.6;
      g.fillStyle = c;
      g.beginPath(); g.moveTo(x - w, ty); g.lineTo(x, ty - 14); g.lineTo(x + w, ty); g.closePath(); g.fill();
      g.fillStyle = '#ffffff';
      g.beginPath(); g.moveTo(x - w * 0.55, ty - 6); g.lineTo(x, ty - 14); g.lineTo(x + w * 0.55, ty - 6); g.quadraticCurveTo(x, ty - 9, x - w * 0.55, ty - 6); g.fill();
    }
  }
  function drawRock(g, x, y, v) {
    g.fillStyle = 'rgba(60, 100, 150, 0.18)';
    g.beginPath(); g.ellipse(x + 4, y + 5, 13, 5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = v === 1 ? '#6f7f93' : '#7c8a9c';
    g.beginPath();
    g.moveTo(x - 12, y + 4); g.lineTo(x - 9, y - 6); g.lineTo(x - 2, y - 10); g.lineTo(x + 8, y - 7); g.lineTo(x + 12, y + 2); g.lineTo(x + 6, y + 6); g.closePath();
    g.fill();
    g.fillStyle = '#9aa8b8';
    g.beginPath(); g.moveTo(x - 8, y - 5); g.lineTo(x - 2, y - 9); g.lineTo(x + 4, y - 6); g.lineTo(x - 3, y - 3); g.closePath(); g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath(); g.ellipse(x - 1, y - 8.5, 6, 2.2, -0.2, 0, Math.PI * 2); g.fill();
  }
  function drawSnowman(g, x, y, v) {
    g.fillStyle = 'rgba(60, 100, 150, 0.18)';
    g.beginPath(); g.ellipse(x + 5, y + 6, 13, 5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff'; g.strokeStyle = '#b7cbe0'; g.lineWidth = 1.4;
    g.beginPath(); g.arc(x, y, 10, 0, Math.PI * 2); g.fill(); g.stroke();
    g.beginPath(); g.arc(x, y - 13, 7, 0, Math.PI * 2); g.fill(); g.stroke();
    // 목도리·모자·눈·코
    var scarf = ['#e84855', '#2f7de1', '#f2b632'][v % 3];
    g.fillStyle = scarf; g.fillRect(x - 7, y - 8, 14, 3.4); g.fillRect(x + 2, y - 6, 3.4, 7);
    g.fillStyle = '#16243a'; g.fillRect(x - 6, y - 21, 12, 2.4); g.fillRect(x - 4, y - 27, 8, 6);
    g.beginPath(); g.arc(x - 2.4, y - 14, 1.1, 0, Math.PI * 2); g.arc(x + 2.4, y - 14, 1.1, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#f08a24'; g.beginPath(); g.moveTo(x, y - 12.5); g.lineTo(x + 6, y - 11.5); g.lineTo(x, y - 10.6); g.fill();
    g.fillStyle = '#16243a';
    g.beginPath(); g.arc(x, y - 2, 1.1, 0, Math.PI * 2); g.arc(x, y + 2.5, 1.1, 0, Math.PI * 2); g.fill();
  }

  function drawGate(g, gt) {
    var y = sy(gt.y);
    var col = gt.color === 0 ? '#e84855' : '#2f7de1';
    var dark = gt.color === 0 ? '#a8222f' : '#1a4f9a';
    // 지난 기문의 결과 표시(점선)
    if (gt.done) {
      g.strokeStyle = gt.ok ? 'rgba(46, 170, 120, 0.55)' : 'rgba(232, 72, 85, 0.35)';
      g.setLineDash([4, 5]); g.lineWidth = 2;
      g.beginPath(); g.moveTo(gt.cx - gt.half, y); g.lineTo(gt.cx + gt.half, y); g.stroke();
      g.setLineDash([]);
    } else {
      g.strokeStyle = 'rgba(47, 125, 225, 0.18)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(gt.cx - gt.half, y); g.lineTo(gt.cx + gt.half, y); g.stroke();
    }
    [-1, 1].forEach(function (sd) {
      var x = gt.cx + sd * gt.half;
      g.fillStyle = 'rgba(60, 100, 150, 0.2)';
      g.beginPath(); g.ellipse(x + 4, y + 3, 6, 2.4, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#1c2b40'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(x, y + 2); g.lineTo(x, y - 24); g.stroke();
      g.fillStyle = col;
      g.beginPath(); g.moveTo(x, y - 24); g.lineTo(x - sd * 14, y - 19); g.lineTo(x, y - 13); g.closePath(); g.fill();
      g.fillStyle = dark; g.fillRect(x - 1, y - 24, 2, 11);
    });
  }

  function drawSkier(g) {
    var x = state ? state.x : C.W / 2;
    var y = C.SKIER_Y;
    var vx = state ? state.vx : 0;
    var lean = Math.max(-1, Math.min(1, vx / C.MAX_VX));
    var down = state && state.over;
    g.save();
    g.translate(x, y);
    // 그림자
    g.fillStyle = 'rgba(40, 80, 130, 0.22)';
    g.beginPath(); g.ellipse(5, 6, 13, 5, 0, 0, Math.PI * 2); g.fill();
    if (down) {
      // 넘어진 모습: 스키가 엇갈리고 몸이 옆으로
      g.rotate(1.2 + Math.min(0.6, (clock - overAt) / 900));
      g.strokeStyle = '#16243a'; g.lineWidth = 2.6; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-14, -6); g.lineTo(14, 8); g.moveTo(-12, 9); g.lineTo(12, -9); g.stroke();
    } else {
      // 스키 (진행 방향으로 기울어짐)
      var ang = lean * 0.55;
      g.save(); g.rotate(-ang);
      g.strokeStyle = '#16243a'; g.lineWidth = 2.8; g.lineCap = 'round';
      g.beginPath(); g.moveTo(-4, -10); g.lineTo(-4, 14); g.moveTo(4, -10); g.lineTo(4, 14); g.stroke();
      g.strokeStyle = '#ffcd3c'; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(-4, 11); g.lineTo(-4, 15); g.moveTo(4, 11); g.lineTo(4, 15); g.stroke();
      g.restore();
      // 폴
      g.strokeStyle = '#5c6b80'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(-9, -2); g.lineTo(-12 - lean * 3, -14); g.moveTo(9, -2); g.lineTo(12 - lean * 3, -14); g.stroke();
    }
    // 몸(재킷)
    g.save();
    if (!down) g.rotate(-lean * 0.25);
    g.fillStyle = '#0d2a4a';
    g.beginPath(); g.ellipse(0, -2, 8, 9.5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#6ec6ff';
    g.fillRect(-8, -4, 16, 3);
    // 머리·모자·고글
    g.fillStyle = '#e84855';
    g.beginPath(); g.arc(0, -11, 5.6, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(0, -16.5, 2.3, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ffcd3c'; g.fillRect(-4.6, -10.5, 9.2, 3);
    g.restore();
    g.restore();
  }

  function drawFlakes(g, dt) {
    if (REDUCED) return;
    g.fillStyle = 'rgba(150, 190, 230, 0.75)';
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      // 스키어가 내려가니 눈송이는 위로 흘러가고, 바람에 살짝 흔들린다
      var up = (state && (phase === 'play' || phase === 'over') ? state.speed * 0.35 : 0) - f.v;
      f.y -= up * dt / 1000;
      f.x += Math.sin(clock / 900 + f.p) * 0.25;
      if (f.y > C.H + 6) { f.y = -6; }
      if (f.y < -6) { f.y = C.H + 6; }
      if (f.x < -4) f.x = C.W + 4; if (f.x > C.W + 4) f.x = -4;
      g.beginPath(); g.arc(f.x, f.y, f.s, 0, Math.PI * 2); g.fill();
    }
  }

  function drawPops(g) {
    if (!pops.length) return;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '600 18px ' + fontFamily;
    g.lineJoin = 'round'; g.lineWidth = 4;
    for (var i = 0; i < pops.length; i++) {
      var p = pops[i], t = p.age / 800;
      g.globalAlpha = Math.max(0, 1 - t);
      g.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      g.fillStyle = p.ok ? '#1f8a5b' : '#c8323f';
      var yy = C.SKIER_Y - 30 - t * 30;
      g.strokeText(p.text, p.x, yy); g.fillText(p.text, p.x, yy);
    }
    g.globalAlpha = 1;
  }

  function draw(dt) {
    var g = ctx;
    g.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    g.clearRect(0, 0, view.w, view.h);
    var ox = 0, oy = 0;
    if (shake > 0 && !REDUCED) { ox = (Math.random() - 0.5) * shake; oy = (Math.random() - 0.5) * shake; }
    g.setTransform(view.dpr * view.k, 0, 0, view.dpr * view.k, ox * view.dpr, oy * view.dpr);
    drawSnow(g);
    drawTrail(g);
    if (state) {
      // 기문·장애물: 화면 위쪽(뒤)부터 그려 겹침이 자연스럽게
      var items = [];
      for (var i = 0; i < state.gates.length; i++) items.push({ y: state.gates[i].y, gate: state.gates[i] });
      for (var j = 0; j < state.objs.length; j++) items.push({ y: state.objs[j].y, obj: state.objs[j] });
      items.sort(function (a, b) { return a.y - b.y; });
      var skierDrawn = false;
      for (var k = 0; k < items.length; k++) {
        var it = items[k];
        var yy = sy(it.y);
        if (yy < -40 || yy > C.H + 40) continue;
        if (!skierDrawn && it.y > state.dist) { drawSkier(g); skierDrawn = true; }
        if (it.gate) drawGate(g, it.gate);
        else if (it.obj.kind === 'tree') drawTree(g, it.obj.x, yy, it.obj.v);
        else if (it.obj.kind === 'rock') drawRock(g, it.obj.x, yy, it.obj.v);
        else drawSnowman(g, it.obj.x, yy, it.obj.v);
      }
      if (!skierDrawn) drawSkier(g);
    } else drawSkier(g);
    drawFlakes(g, dt || 0);
    drawPops(g);
    if (flash > 0) { g.fillStyle = 'rgba(255, 255, 255, ' + (0.6 * flash).toFixed(3) + ')'; g.fillRect(0, 0, C.W, C.H); }
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    var sc = C.score(state);
    if (force || hudScore !== sc) { hudScore = sc; els.dist.textContent = num(sc); }
  }

  // ---------------------------------------------------------------- 입력 → steer
  function currentSteer() {
    if (forced != null) return forced;
    if (keys.left !== keys.right) return keys.left ? -1 : 1;
    if (pointers.length) return pointers[pointers.length - 1].side;
    return 0;
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function onEvents(evs) {
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.type === 'gate' && !REDUCED) {
        pops.push({ x: Math.max(40, Math.min(C.W - 40, ev.x)), ok: ev.ok, text: ev.ok ? fmt(P.gateOk, { n: ev.add, c: ev.combo }) : P.gateMiss, age: 0 });
      }
      if (ev.type === 'crash') {
        phase = 'over';
        overAt = performance.now();
        if (!REDUCED) { flash = 1; shake = 7; }
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
    if (phase === 'play' || phase === 'over') {
      if (phase === 'play' && !auto) C.setSteer(state, currentSteer());
      var evs = C.step(state, gdt, auto && phase === 'play' ? C.autoSteer : null);
      onEvents(evs);
      var lastT = trail[trail.length - 1];
      if (!lastT || state.dist - lastT.y > 6) trail.push({ x: state.x, y: state.dist });
      while (trail.length && trail[0].y < state.dist - C.SKIER_Y - 20) trail.shift();
    }
    for (var i = pops.length - 1; i >= 0; i--) { pops[i].age += gdt; if (pops[i].age >= 800) pops.splice(i, 1); }
    if (flash > 0) flash = Math.max(0, flash - gdt / 260);
    if (shake > 0) shake = Math.max(0, shake - gdt / 30);
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

  // ---------------------------------------------------------------- 준비 · 출발 · 일시정지 · 끝
  function ready() {
    runId++;
    stopLoop();
    state = C.newGame();
    pops = []; trail = []; flash = 0; shake = 0; auto = false; forced = null;
    keys.left = keys.right = false; pointers = [];
    hudScore = -1;
    doneSent = false;
    phase = 'ready';
    els.pausedBox.hidden = true;
    els.hint.hidden = false;
    els.best.textContent = num(getBest());
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
    keys.left = keys.right = false; pointers = [];
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
    els.gates.textContent = num(s.gatesPassed);
    els.time.textContent = fmt(R.timeValue, { s: num1(s.runTicks * C.TICK_MS / 1000) });
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

  // 한 판에 한 번 점수를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(s, sc, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || s.submitted) return;
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
  function sideOf(e) {
    var r = els.field.getBoundingClientRect();
    return e.clientX < r.left + r.width / 2 ? -1 : 1;
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
    pointers.push({ id: e.pointerId, side: sideOf(e) });
    if (phase === 'ready') begin();
  });
  els.field.addEventListener('pointermove', function (e) {
    for (var i = 0; i < pointers.length; i++) if (pointers[i].id === e.pointerId) pointers[i].side = sideOf(e);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    els.field.addEventListener(t, function (e) { dropPointer(e.pointerId); });
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play' || phase === 'ready') e.preventDefault(); });

  function keySide(k) {
    if (k === 'ArrowLeft' || k === 'Left' || k === 'a' || k === 'A') return -1;
    if (k === 'ArrowRight' || k === 'Right' || k === 'd' || k === 'D') return 1;
    return 0;
  }
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    var sd = keySide(k);
    if (sd) {
      e.preventDefault();
      if (phase === 'paused') return;
      if (sd < 0) keys.left = true; else keys.right = true;
      if (phase === 'ready') begin();
    } else if (k === ' ' || k === 'Spacebar' || k === 'Enter' || k === 'ArrowDown') {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON' && document.activeElement !== els.field) return;
      e.preventDefault();
      if (phase === 'ready') begin();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('keyup', function (e) {
    var sd = keySide(e.key);
    if (sd < 0) keys.left = false;
    if (sd > 0) keys.right = false;
  });
  window.addEventListener('blur', function () { keys.left = keys.right = false; });
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

  window.SKI_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: C.score(state), meters: C.meters(state), x: state.x, vx: state.vx, steer: state.steer, dist: state.dist,
        started: state.started, over: state.over, crash: state.crash, gatesPassed: state.gatesPassed, combo: state.combo, objs: state.objs.length, gates: state.gates.length };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(20, Number(k) || 1)); return speed; },
    steer: function (v) { forced = v == null ? null : Math.max(-1, Math.min(1, Math.round(v))); return forced; },
    autopilot: function (on) { auto = !!on; return auto; },
    begin: begin,
    best: getBest
  };
  show('start');
})();
