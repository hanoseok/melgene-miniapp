/* apps/reindeer/reindeer.js — 시작(티징) → 순록 점프(캔버스, 옆에서 본 눈 덮인 밤 지붕 가로 스크롤) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 reindeer-core.js(REINDEER_CORE, 언어 무관, 고정 시간 간격), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 흐름: 시작 버튼 → 준비(안내 표시, 시간 안 흐름) → 첫 입력(필드 누르기·스페이스/↑)이 판을 시작(track('start'), 그 입력으로는 뛰지 않음)
 *   → 틈에 빠지거나 하트 3개를 다 잃으면 잠시 뒤 끝 화면(track('done')). 다시 하기 = 새 준비 상태.
 * 입력(한 버튼): 필드 어디든 누르는 순간 점프(공중이면 한 번 2단 점프), 누르고 있으면 더 높이. 여러 손가락이면 하나라도 누르고 있는 동안.
 *   키보드: 스페이스·↑·W 누르기/누르고 있기(자동 반복은 무시), P/Esc 일시정지. 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지(시계도 멈춤).
 *   prefers-reduced-motion 이면 내리는 눈을 멈추고 굴뚝 연기·흔들림·번쩍임·떠오르는 글자 움직임을 끈다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 *   말이 안 되는 점수(C.plausible 거짓)는 보내지 않는다.
 * 그리기: requestAnimationFrame + dt, devicePixelRatio(최대 2.5), 세계(360×420 단위)를 필드 크기에 맞춰 늘림. 그림은 모두 코드로 그린다(저작권 캐릭터 없음).
 * 디버그/검사용 핸들: window.REINDEER_APP (phase(), state(), best(), timeScale(k), hold(on), autopilot(on), begin())
 */
(function () {
  'use strict';

  var C = window.REINDEER_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'reindeer_best_v1';
  var END_DELAY = REDUCED ? 450 : 1300;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), dist: $('hud-dist'), lives: $('hud-lives'), livesBox: null, pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('rd-canvas'), hint: $('tap-hint'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), reason: $('res-reason'), newBest: $('res-newbest'), bestLine: $('res-best'),
    resDist: $('res-dist'), presents: $('res-presents'), bells: $('res-bells'), tier: $('res-tier'),
    rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  els.livesBox = els.lives ? els.lives.closest('.rd-hud-box') : null;
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | ready | play | paused | over | end
  var pausedFrom = 'play';
  var state = null;
  var raf = 0, last = 0, speed = 1, auto = false;
  var runId = 0, doneSent = false;
  var hudScore = -1, hudDist = -1, hudLives = -1;
  var view = { w: 320, h: 373, dpr: 1, k: 1 };
  var clock = 0;           // 장식 애니메이션 시간(ms)
  var pops = [];           // 떠오르는 글자 { x, y, text, tone, age }
  var sparks = [];         // 반짝임·눈가루 { x, y, vx, vy, r, age, life, color }
  var flakes = [];         // 내리는 눈 (장식, 화면 좌표)
  var stars = [];          // 밤하늘 별 (장식, 고정)
  var flash = 0, shake = 0, overAt = 0, fallY = 0;
  var fontFamily = 'sans-serif';
  // 입력: 누르고 있는 손가락·키
  var pointers = {};
  var keyDown = false;
  var forced = null;       // 검사용 REINDEER_APP.hold: true | false | null

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

  // ---------------------------------------------------------------- 내리는 눈·별 (장식, 고정 시드). 움직임 줄이기 = 적게, 멈춘 채로
  (function makeSky() {
    var seed = 11;
    function r() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var n = REDUCED ? 14 : 46;
    for (var i = 0; i < n; i++) flakes.push({ x: r() * C.W, y: r() * C.H, s: 0.8 + r() * 1.9, v: 16 + r() * 26, p: r() * 6.28 });
    for (var j = 0; j < 40; j++) stars.push({ x: r() * C.W, y: r() * 190, s: 0.5 + r() * 1.2, p: r() * 6.28 });
  })();

  // ---------------------------------------------------------------- 캔버스 크기 (세계 비율 W:H 그대로)
  function layout() {
    var shell = els.play.parentNode;
    var w = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    w = Math.max(240, Math.floor(w));
    var h = Math.round(w * C.H / C.W);
    var rect = els.field.getBoundingClientRect();
    var availH = Math.max(300, window.innerHeight - Math.max(0, rect.top) - 14);
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
  var RY = C.ROOF_Y;
  var WALLS = ['#3f5487', '#5b3f6e', '#33605f', '#6a4a3a', '#4a4f7a', '#2f4a6e'];
  var GIFTS = [['#e5484d', '#ffd36e'], ['#2f9e6b', '#ffd36e'], ['#3b7de0', '#ffffff'], ['#8a5cc9', '#ffd36e']];

  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h); g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }
  function circle(g, x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
  function hash(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function dist() { return state ? state.dist : 0; }
  function sx(wx) { return wx - dist(); }

  function drawSky(g) {
    var grd = g.createLinearGradient(0, 0, 0, C.H);
    grd.addColorStop(0, '#0b1533'); grd.addColorStop(0.55, '#1c2c5c'); grd.addColorStop(1, '#2c3f7a');
    g.fillStyle = grd; g.fillRect(0, 0, C.W, C.H);
    // 별 (반짝임)
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = REDUCED ? 0.8 : 0.55 + 0.45 * Math.sin(clock / 700 + s.p);
      g.globalAlpha = tw; circle(g, s.x, s.y, s.s, '#ffffff');
    }
    g.globalAlpha = 1;
    // 달
    circle(g, 292, 62, 26, 'rgba(255, 244, 207, 0.16)');
    circle(g, 292, 62, 19, '#fff4cf');
    circle(g, 286, 56, 3.4, '#efe1b0'); circle(g, 298, 68, 2.6, '#efe1b0'); circle(g, 296, 54, 1.8, '#efe1b0');
    // 먼 언덕·도시 그림자 (느린 시차)
    var off = (dist() * 0.12) % 90;
    g.fillStyle = '#1a2852';
    g.beginPath(); g.moveTo(0, 250);
    for (var x = -off; x < C.W + 90; x += 90) { g.quadraticCurveTo(x + 45, 214, x + 90, 250); }
    g.lineTo(C.W, C.H); g.lineTo(0, C.H); g.closePath(); g.fill();
    var off2 = dist() * 0.3;
    var b0 = Math.floor(off2 / 46) - 1;
    g.fillStyle = '#22336a';
    for (var b = b0; b < b0 + 11; b++) {
      var bx = b * 46 - off2, bh = 30 + hash(b) * 46;
      g.fillRect(bx, 262 - bh, 40, bh + 160);
      if (hash(b + 0.4) > 0.5) { g.beginPath(); g.moveTo(bx - 3, 262 - bh); g.lineTo(bx + 20, 262 - bh - 18); g.lineTo(bx + 43, 262 - bh); g.fill(); }
    }
    g.fillStyle = 'rgba(255, 211, 110, 0.55)';
    for (var b2 = b0; b2 < b0 + 11; b2++) {
      var bx2 = b2 * 46 - off2, bh2 = 30 + hash(b2) * 46;
      for (var wy = 0; wy < 3; wy++) for (var wx = 0; wx < 3; wx++) if (hash(b2 * 9 + wy * 3 + wx) > 0.72) g.fillRect(bx2 + 6 + wx * 11, 268 - bh2 + wy * 14, 5, 6);
    }
  }

  // 지붕(건물 윗부분): 벽, 불 켜진 창, 눈 덮인 처마
  function drawRoofs(g) {
    if (!state) return;
    var list = state.roofs;
    for (var i = 0; i < list.length; i++) {
      var r = list[i];
      var x0 = sx(r.x0), x1 = sx(r.x1);
      if (x1 < -10 || x0 > C.W + 10) continue;
      var a = Math.max(-10, x0), b = Math.min(C.W + 10, x1);
      g.fillStyle = WALLS[r.look % WALLS.length];
      g.fillRect(a, RY + 4, b - a, C.H - RY);
      // 벽돌·판자 결
      g.fillStyle = 'rgba(0, 0, 0, 0.12)';
      for (var yy = RY + 22; yy < C.H; yy += 18) g.fillRect(a, yy, b - a, 2);
      // 창문 (건물 x 에 붙은 무늬)
      var step = 34, w0 = Math.ceil((r.x0 + 12) / step) * step;
      for (var wx = w0; wx < r.x1 - 20; wx += step) {
        var px = sx(wx);
        if (px < -24 || px > C.W + 4) continue;
        for (var row = 0; row < 3; row++) {
          var lit = hash(wx * 0.37 + row * 7.1 + r.look) > 0.38;
          g.fillStyle = lit ? '#ffd36e' : 'rgba(10, 18, 40, 0.55)';
          rr(g, px, RY + 30 + row * 40, 16, 20, 3); g.fill();
          if (lit) { g.fillStyle = 'rgba(255, 160, 60, 0.35)'; g.fillRect(px + 7, RY + 30 + row * 40, 2, 20); }
        }
      }
      // 처마 끝 그림자 + 눈 덮인 지붕
      g.fillStyle = 'rgba(0, 0, 0, 0.25)'; g.fillRect(x0, RY + 4, 4, C.H); g.fillRect(x1 - 4, RY + 4, 4, C.H);
      g.fillStyle = '#ffffff';
      rr(g, x0 - 3, RY - 3, x1 - x0 + 6, 11, 5); g.fill();
      g.fillStyle = '#dce6f7';
      g.fillRect(x0 - 2, RY + 5, x1 - x0 + 4, 3);
      // 녹아 흐른 눈 방울
      for (var d = Math.ceil(r.x0 / 23) * 23; d < r.x1 - 6; d += 23) {
        if (hash(d * 0.11) < 0.45) continue;
        var dx = sx(d);
        if (dx < -6 || dx > C.W + 6) continue;
        g.beginPath(); g.ellipse(dx, RY + 8, 3, 4 + hash(d) * 4, 0, 0, Math.PI * 2); g.fill();
      }
    }
  }

  function drawFlakes(g, dt) {
    g.fillStyle = 'rgba(255, 255, 255, 0.85)';
    var drift = state && phase === 'play' ? state.speed * 0.25 : 0;
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      if (!REDUCED) {
        f.y += f.v * dt / 1000;
        f.x += (Math.sin(clock / 900 + f.p) * 8 - drift) * dt / 1000;
        if (f.y > C.H + 4) f.y = -4;
        if (f.x < -4) f.x = C.W + 4; else if (f.x > C.W + 4) f.x = -4;
      }
      g.beginPath(); g.arc(f.x, f.y, f.s, 0, Math.PI * 2); g.fill();
    }
  }

  // ---- 장애물·모을 것
  function drawChimney(g, x, o) {
    var w = o.w, h = o.h, top = RY - h;
    g.fillStyle = '#b6533f'; g.fillRect(x - w / 2, top, w, h + 4);
    g.fillStyle = 'rgba(0, 0, 0, 0.18)'; g.fillRect(x + w / 2 - 6, top, 6, h + 4);
    g.strokeStyle = '#8d3b2c'; g.lineWidth = 1.6;
    for (var yy = top + 9, k = 0; yy < RY; yy += 9, k++) {
      g.beginPath(); g.moveTo(x - w / 2, yy); g.lineTo(x + w / 2, yy); g.stroke();
      var off = k % 2 ? w / 4 : -w / 4;
      g.beginPath(); g.moveTo(x + off, yy - 9); g.lineTo(x + off, yy); g.stroke();
    }
    g.fillStyle = '#ffffff'; rr(g, x - w / 2 - 4, top - 6, w + 8, 9, 4); g.fill();
    // 연기 (장식, 닿아도 괜찮음)
    if (!REDUCED) {
      for (var i = 0; i < 3; i++) {
        var t = ((clock / 1400) + i / 3 + o.look * 0.17) % 1;
        g.fillStyle = 'rgba(214, 222, 240, ' + (0.5 * (1 - t)).toFixed(3) + ')';
        g.beginPath(); g.arc(x - 4 - t * 16, top - 12 - t * 44, 5 + t * 8, 0, Math.PI * 2); g.fill();
      }
    } else {
      g.fillStyle = 'rgba(214, 222, 240, 0.35)';
      g.beginPath(); g.arc(x - 6, top - 18, 7, 0, Math.PI * 2); g.arc(x - 12, top - 32, 9, 0, Math.PI * 2); g.fill();
    }
  }
  function drawPile(g, x) {
    g.fillStyle = '#eef3fc';
    g.beginPath(); g.moveTo(x - 24, RY + 2);
    g.quadraticCurveTo(x - 18, RY - 16, x - 4, RY - 18); g.quadraticCurveTo(x + 10, RY - 24, x + 18, RY - 10); g.quadraticCurveTo(x + 24, RY - 4, x + 25, RY + 2);
    g.closePath(); g.fill();
    g.fillStyle = '#c9d6ee';
    g.beginPath(); g.moveTo(x - 10, RY + 2); g.quadraticCurveTo(x + 6, RY - 8, x + 25, RY + 2); g.closePath(); g.fill();
    circle(g, x - 8, RY - 12, 2, '#ffffff');
  }
  function drawIce(g, x) {
    g.fillStyle = '#9fd6f2';
    g.beginPath(); g.moveTo(x - 12, RY + 2); g.lineTo(x - 9, RY - 18); g.lineTo(x - 4, RY - 26); g.lineTo(x + 3, RY - 20); g.lineTo(x + 8, RY - 27); g.lineTo(x + 12, RY + 2); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255, 255, 255, 0.75)';
    g.beginPath(); g.moveTo(x - 6, RY - 2); g.lineTo(x - 4, RY - 20); g.lineTo(x - 1, RY - 4); g.closePath(); g.fill();
    g.strokeStyle = '#5aa9d6'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(x - 12, RY + 2); g.lineTo(x - 9, RY - 18); g.lineTo(x - 4, RY - 26); g.lineTo(x + 3, RY - 20); g.lineTo(x + 8, RY - 27); g.lineTo(x + 12, RY + 2); g.stroke();
  }
  function drawCrow(g, x, o) {
    var k = C.KIND_BY_ID.crow;
    var y = RY - (k.h0 + k.h1) / 2;
    var bob = REDUCED ? 0 : Math.sin(clock / 160 + o.id) * 2;
    var flap = REDUCED ? 0.4 : Math.sin(clock / 70 + o.id);
    g.save(); g.translate(x, y + bob);
    g.fillStyle = '#141a2b';
    g.beginPath(); g.ellipse(2, 0, 13, 7, 0, 0, Math.PI * 2); g.fill();
    circle(g, -10, -3, 6, '#141a2b');
    g.beginPath(); g.moveTo(13, -2); g.lineTo(22, -6); g.lineTo(21, 3); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-2, -2); g.lineTo(10, -2); g.lineTo(6 + flap * 2, -6 - flap * 12); g.closePath(); g.fill();
    g.fillStyle = '#f2b632'; g.beginPath(); g.moveTo(-15, -4); g.lineTo(-22, -2); g.lineTo(-15, 0); g.closePath(); g.fill();
    circle(g, -11, -5, 1.4, '#ffffff');
    g.restore();
  }
  function drawPresent(g, x, ih, look) {
    var c = GIFTS[look % 4];
    var y = RY - ih;
    var bob = REDUCED ? 0 : Math.sin(clock / 260 + x * 0.05) * 1.5;
    g.save(); g.translate(x, y + bob);
    g.fillStyle = c[0]; rr(g, -10, -8, 20, 17, 3); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.14)'; g.fillRect(-10, 3, 20, 6);
    g.fillStyle = c[1]; g.fillRect(-2, -8, 4, 17); g.fillRect(-10, -2, 20, 4);
    g.beginPath(); g.ellipse(-4, -10, 4.5, 3, -0.5, 0, Math.PI * 2); g.ellipse(4, -10, 4.5, 3, 0.5, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  function drawBell(g, x, ih) {
    var y = RY - ih;
    var sw = REDUCED ? 0 : Math.sin(clock / 180) * 0.25;
    var pulse = REDUCED ? 0 : Math.sin(clock / 220);
    g.fillStyle = 'rgba(255, 211, 110, ' + (0.22 + 0.1 * pulse).toFixed(3) + ')';
    g.beginPath(); g.arc(x, y, 19 + pulse * 2, 0, Math.PI * 2); g.fill();
    g.save(); g.translate(x, y - 8); g.rotate(sw);
    g.fillStyle = '#f2b632';
    g.beginPath(); g.moveTo(-11, 14); g.quadraticCurveTo(-11, -2, 0, -3); g.quadraticCurveTo(11, -2, 11, 14); g.closePath(); g.fill();
    g.fillStyle = '#d2921c'; rr(g, -13, 13, 26, 4, 2); g.fill();
    circle(g, 0, 19, 3, '#d2921c');
    g.strokeStyle = '#d2921c'; g.lineWidth = 2; g.beginPath(); g.arc(0, -5, 2.6, 0, Math.PI * 2); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(-5, 4, 2, 5, 0.3, 0, Math.PI * 2); g.fill();
    g.restore();
  }

  function drawObjects(g) {
    if (!state) return;
    var list = state.objs;
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      var x = sx(o.x);
      if (x < -60 || x > C.W + 60) continue;
      if (o.done && !o.hit) continue;  // 모은 것은 사라짐
      var hitFade = o.hit ? 0.55 : 1;
      g.globalAlpha = hitFade;
      if (o.kind === 'chimney') drawChimney(g, x, o);
      else if (o.kind === 'pile') drawPile(g, x);
      else if (o.kind === 'ice') drawIce(g, x);
      else if (o.kind === 'crow') drawCrow(g, x, o);
      else if (o.kind === 'present') drawPresent(g, x, o.ih, o.look);
      else if (o.kind === 'bell') drawBell(g, x, o.ih);
      g.globalAlpha = 1;
    }
  }

  // 순록 (옆모습, 오른쪽을 봄). 발 = (RX, RY − h)
  function drawReindeer(g) {
    if (!state) return;
    var x = C.RX;
    var y = RY - state.h + (phase === 'over' && state.endReason === 'fall' ? fallY : 0);
    var air = !state.ground;
    var ph = state.dist / 16;
    var blink = state.inv > 0 && !state.over && Math.floor(clock / 90) % 2 === 0;
    g.save();
    g.globalAlpha = blink ? 0.35 : 1;
    // 그림자 (지붕 위일 때만)
    if (C.supported(state, C.px(state)) && state.h >= 0) {
      var sh = Math.max(0.25, 1 - state.h / 160);
      g.fillStyle = 'rgba(10, 20, 50, ' + (0.28 * sh).toFixed(3) + ')';
      g.beginPath(); g.ellipse(x, RY + 1, 20 * sh, 4 * sh, 0, 0, Math.PI * 2); g.fill();
    }
    g.translate(x, y);
    var tilt = air ? Math.max(-0.25, Math.min(0.3, -state.vh / 2600)) : 0;
    if (phase === 'over' && state.endReason === 'crash' && !REDUCED) tilt = Math.min(1.2, fallY / 30);
    g.rotate(tilt);
    // 다리 (달리기: 번갈아, 공중: 앞뒤로 뻗음)
    g.strokeStyle = '#7a5233'; g.lineWidth = 4.2; g.lineCap = 'round';
    function leg(hx, ang, len) {
      var fx = hx + Math.sin(ang) * len, fy = -14 + Math.cos(ang) * len;
      g.beginPath(); g.moveTo(hx, -16); g.lineTo(fx, fy); g.stroke();
      g.fillStyle = '#3a2a1e'; g.beginPath(); g.arc(fx, fy, 2.4, 0, Math.PI * 2); g.fill();
    }
    if (air) { leg(-12, 0.9, 13); leg(-8, 0.6, 13); leg(10, -0.8, 13); leg(14, -0.5, 13); }
    else {
      var a = REDUCED ? 0.35 : Math.sin(ph) * 0.6;
      leg(-12, a, 14); leg(-8, -a, 14); leg(10, -a, 14); leg(14, a, 14);
    }
    // 꼬리
    g.fillStyle = '#f3e6d2'; g.beginPath(); g.ellipse(-21, -25, 4, 3, -0.5, 0, Math.PI * 2); g.fill();
    // 몸통
    g.fillStyle = '#9a6a43'; g.beginPath(); g.ellipse(0, -22, 20, 10, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#d9b48a'; g.beginPath(); g.ellipse(2, -17, 14, 4.5, 0, 0, Math.PI * 2); g.fill();
    // 목·머리
    g.fillStyle = '#9a6a43';
    g.beginPath(); g.moveTo(10, -28); g.quadraticCurveTo(18, -34, 20, -44); g.lineTo(27, -42); g.quadraticCurveTo(25, -30, 18, -20); g.closePath(); g.fill();
    g.save(); g.translate(26, -45); g.rotate(0.25);
    g.beginPath(); g.ellipse(0, 0, 9, 6, 0, 0, Math.PI * 2); g.fill();
    g.restore();
    g.fillStyle = '#3a2a1e'; g.beginPath(); g.ellipse(34, -42, 3.2, 2.8, 0, 0, Math.PI * 2); g.fill();
    circle(g, 26, -47, 1.5, '#141414');
    g.fillStyle = '#8a5c39'; g.beginPath(); g.moveTo(20, -49); g.quadraticCurveTo(13, -53, 11, -50); g.quadraticCurveTo(15, -47, 20, -47); g.fill();
    // 뿔
    g.strokeStyle = '#e9d6b0'; g.lineWidth = 2.4;
    g.beginPath();
    g.moveTo(22, -50); g.lineTo(18, -62); g.moveTo(19, -58); g.lineTo(13, -61); g.moveTo(18, -62); g.lineTo(20, -67); g.moveTo(18, -62); g.lineTo(14, -66);
    g.moveTo(27, -51); g.lineTo(30, -63); g.moveTo(29, -59); g.lineTo(35, -62); g.moveTo(30, -63); g.lineTo(28, -68); g.moveTo(30, -63); g.lineTo(34, -67);
    g.stroke();
    // 목도리 + 방울
    var flap = REDUCED ? 0 : Math.sin(clock / 80) * 2;
    g.strokeStyle = '#2f9e6b'; g.lineWidth = 4.5;
    g.beginPath(); g.moveTo(11, -31); g.quadraticCurveTo(17, -25, 24, -32); g.stroke();
    g.beginPath(); g.moveTo(12, -29); g.lineTo(4 + flap, -32 - flap); g.stroke();
    circle(g, 18, -25, 3, '#f2b632');
    g.restore();
    g.globalAlpha = 1;
  }

  function drawSparks(g) {
    for (var i = 0; i < sparks.length; i++) {
      var q = sparks[i], t = q.age / q.life;
      g.globalAlpha = Math.max(0, 1 - t);
      circle(g, q.x, q.y, q.r * (1 - t * 0.4), q.color);
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
      g.strokeStyle = 'rgba(10, 18, 40, 0.9)';
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
    var shx = shake > 0 && !REDUCED ? Math.sin(clock / 18) * 5 * shake : 0;
    g.setTransform(view.dpr * view.k, 0, 0, view.dpr * view.k, shx * view.dpr * view.k, 0);
    drawSky(g);
    drawRoofs(g);
    drawObjects(g);
    drawReindeer(g);
    drawSparks(g);
    drawFlakes(g, dt || 0);
    drawPops(g);
    if (flash > 0) { g.fillStyle = 'rgba(229, 72, 77, ' + (0.32 * flash).toFixed(3) + ')'; g.fillRect(0, 0, C.W, C.H); }
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
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function pop(text, tone, x, y, big) {
    if (!text) return;
    pops.push({ x: Math.max(60, Math.min(C.W - 60, x)), y: y, text: text, tone: tone, age: 0, big: !!big });
  }
  function burst(x, y, n, color) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = REDUCED ? 0 : 40 + Math.random() * 90;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 2 + Math.random() * 2.5, age: 0, life: 520, color: color });
    }
  }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* noop */ } }
  function onEvents(evs) {
    var ry = RY - (state ? state.h : 0);
    for (var i = 0; i < evs.length; i++) {
      var ev = evs[i];
      if (ev.type === 'item') {
        if (ev.kind === 'bell') { burst(C.RX + 6, ry - 20, 12, '#ffd36e'); pop(fmt(P.bell, { n: ev.pts }), 'good', C.RX + 40, ry - 70, true); }
        else { burst(C.RX + 6, ry - 18, 7, '#ff8a7f'); pop('+' + num(ev.pts), 'good', C.RX + 30, ry - 62, false); }
      } else if (ev.type === 'djump') {
        burst(C.RX - 6, ry, 8, '#ffffff');
      } else if (ev.type === 'land') {
        if (!REDUCED) burst(C.RX, RY, 4, '#ffffff');
      } else if (ev.type === 'ouch') {
        if (!REDUCED) { flash = 1; shake = 1; }
        burst(C.RX + 12, ry - 16, 10, '#ffffff');
        pop(P.ouch, 'bad', C.RX + 40, ry - 70, true);
        buzz(90);
      } else if (ev.type === 'fall' || ev.type === 'crash') {
        pop(ev.type === 'fall' ? P.fall : P.crash, 'plain', C.W / 2, C.H * 0.4, true);
        buzz(160);
        phase = 'over';
        overAt = performance.now();
      }
    }
    if (pops.length > 5) pops.splice(0, pops.length - 5);
    if (sparks.length > 80) sparks.splice(0, sparks.length - 80);
  }

  // ---------------------------------------------------------------- 입력 → 누르기
  function holding() {
    if (forced != null) return forced;
    if (keyDown) return true;
    for (var k in pointers) if (pointers[k]) return true;
    return false;
  }
  function applyHold() { if (state && !auto && phase === 'play') C.setHold(state, holding()); }

  // ---------------------------------------------------------------- 루프
  function loop(now) {
    raf = 0;
    if (phase !== 'ready' && phase !== 'play' && phase !== 'over') return;
    var dt = Math.min(100, Math.max(0, now - last));
    last = now;
    var gdt = dt * speed;
    clock += gdt;
    if (phase === 'play') {
      applyHold();
      // 큰 timeScale 에서도 tick 이 MAX_STEP 에 잘리지 않게 나눠서 넣는다
      var rest = gdt;
      while (rest > 0 && phase === 'play') {
        var part = Math.min(rest, C.MAX_STEP);
        onEvents(C.step(state, part, auto ? C.autoPlay : null));
        rest -= part;
      }
      // 달리는 발밑 눈가루
      if (!REDUCED && state.ground && Math.random() < 0.35) {
        sparks.push({ x: C.RX - 14, y: RY - 1, vx: -40 - Math.random() * 50, vy: -20 - Math.random() * 30, r: 1.4 + Math.random() * 1.6, age: 0, life: 360, color: '#ffffff' });
      }
    }
    if (phase === 'over' && state) fallY = Math.min(160, fallY + gdt * (state.endReason === 'fall' ? 0.35 : 0.08));
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
    pops = []; sparks = []; flash = 0; shake = 0; fallY = 0; auto = false; forced = null;
    pointers = {}; keyDown = false;
    hudScore = -1; hudDist = -1; hudLives = -1;
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

  // 첫 입력이 판을 시작한다 (한 판에 한 번 track('start')). 그 입력으로는 뛰지 않는다(누른 채면 뗄 때까지 무시).
  function begin() {
    if (phase !== 'ready' || !state) return false;
    phase = 'play';
    els.hint.hidden = true;
    C.start(state);
    state.hold = true;   // 지금 누르고 있는 손가락은 점프로 세지 않음(떼었다가 다시 누르면 점프)
    track('start');
    return true;
  }

  function pause() {
    if (phase !== 'play' && phase !== 'ready') return;
    pausedFrom = phase;
    phase = 'paused';
    stopLoop();
    pointers = {}; keyDown = false;
    if (state) C.setHold(state, false);
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
    els.reason.textContent = s.endReason === 'crash' ? R.reasonCrash : R.reasonFall;
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, sc)) });
    els.bestLine.hidden = isNew;
    els.resDist.textContent = num(C.meters(s));
    els.presents.textContent = num(s.presents);
    els.bells.textContent = num(s.bells);
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
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'ready') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    pointers[e.pointerId] = true;
    if (phase === 'ready') { begin(); return; }
    applyHold();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    els.field.addEventListener(t, function (e) {
      if (!pointers[e.pointerId]) return;
      delete pointers[e.pointerId];
      applyHold();
    });
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play' || phase === 'ready') e.preventDefault(); });

  function isJumpKey(k) { return k === ' ' || k === 'Spacebar' || k === 'ArrowUp' || k === 'Up' || k === 'w' || k === 'W'; }
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (isJumpKey(k) || k === 'Enter') {
      var onBtn = document.activeElement && document.activeElement.tagName === 'BUTTON';
      if (onBtn && (k === ' ' || k === 'Enter')) return;
      e.preventDefault();
      if (phase === 'paused' || e.repeat) return;
      if (phase === 'ready') { begin(); keyDown = true; return; }
      if (!isJumpKey(k)) return;
      keyDown = true;
      applyHold();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('keyup', function (e) {
    if (isJumpKey(e.key) || e.key === 'Enter') { keyDown = false; applyHold(); }
  });
  window.addEventListener('blur', function () { keyDown = false; pointers = {}; applyHold(); });
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

  window.REINDEER_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, score: C.score(state), meters: C.meters(state), elapsed: state.elapsed, started: state.started, over: state.over, endReason: state.endReason,
        hearts: state.hearts, h: state.h, vh: state.vh, ground: state.ground, dbl: state.dbl, hold: state.hold, speed: state.speed, inv: state.inv,
        items: C.items(state), presents: state.presents, bells: state.bells, jumps: state.jumps, djumps: state.djumps, hits: state.hits, bonus: state.bonus,
        objs: state.objs.length, roofs: state.roofs.length };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(40, Number(k) || 1)); return speed; },
    hold: function (on) { forced = on == null ? null : !!on; applyHold(); return forced; },
    autopilot: function (on) { auto = !!on; if (!auto && state) C.setHold(state, holding()); return auto; },
    begin: begin,
    best: getBest
  };
  show('start');
})();
