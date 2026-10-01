/* apps/merge/merge.js — 시작(티징) → 게임(병 + 캔버스, 광고 없음) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 규칙·물리·점수는 merge-core.js(MERGE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(조준하다 실수로 누르기 쉬움). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 병 위에서 끌거나(터치) 마우스를 움직여 조준, 손을 떼거나 클릭하면 떨어뜨림. ←/→(A/D) 조준, Space·Enter·↓ 떨어뜨림, P/Esc 일시정지.
 *   탭을 떠나면(visibilitychange·pagehide) 자동 일시정지. prefers-reduced-motion 이면 합치기 고리·파편·선 깜빡임·글자 이동·굴림 회전을 끈다.
 * 디버그/검사용 핸들: window.MERGE_APP (phase(), state(), bodies(), timeScale(k), best())
 */
(function () {
  'use strict';

  var C = window.MERGE_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var TIER_NAMES = UI.tiers || [];
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'merge_best_v1';
  var END_DELAY = REDUCED ? 300 : 1100;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();
  var EMOJI_FONT = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";
  var INK = '#1b1026';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), best: $('hud-best'), next: $('hud-next'), pauseBtn: $('pause-btn'),
    chain: $('sk-chain'), field: $('field'), canvas: $('sk-canvas'), full: $('full-overlay'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    reason: $('res-reason'), resScore: $('res-score'), newBest: $('res-newbest'), resBest: $('res-best'),
    biggestIco: $('res-biggest-ico'), biggest: $('res-biggest'), merges: $('res-merges'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | play | paused | end
  var state = null;
  var keys = { left: false, right: false };
  var pointerDown = false;
  var raf = 0, last = 0, speed = 1;
  var fx = [];             // 합치기 고리·떠오르는 점수·파편
  var runId = 0, doneSent = false, endTimer = 0;
  var hud = { score: -1, best: -1, next: -1, maxTier: -1 };
  var view = { w: 0, h: 0, dpr: 1, k: 1 };
  var sprites = [];
  var fontFamily = 'sans-serif';
  var bestShown = 0;

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

  // ---------------------------------------------------------------- 조각 그림
  function disc(g, r, color) {
    var grd = g.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.55)');
    grd.addColorStop(0.35, color);
    grd.addColorStop(1, color);
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2);
    g.fillStyle = color; g.fill();
    g.fillStyle = grd; g.fill();
    g.lineWidth = Math.max(2, r * 0.07); g.strokeStyle = INK; g.stroke();
  }
  function shine(g, r) {
    g.fillStyle = 'rgba(255,255,255,0.45)';
    g.beginPath(); g.ellipse(-r * 0.42, -r * 0.5, r * 0.2, r * 0.11, -0.7, 0, Math.PI * 2); g.fill();
  }
  function emoji(g, r, ch, scale) {
    g.font = Math.round(r * (scale || 1.2) * 10) / 10 + 'px ' + EMOJI_FONT;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(ch, 0, r * 0.06);
  }
  // 호박 몸통 (골 3개 + 꼭지)
  function pumpkinBody(g, r, color, dark) {
    g.save();
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.clip();
    g.fillStyle = color; g.fillRect(-r, -r, r * 2, r * 2);
    g.strokeStyle = dark; g.lineWidth = r * 0.06;
    [-0.55, 0, 0.55].forEach(function (k) {
      g.beginPath(); g.ellipse(k * r, r * 0.04, r * (k ? 0.42 : 0.3), r * 0.95, 0, 0, Math.PI * 2); g.stroke();
    });
    var grd = g.createRadialGradient(-r * 0.3, -r * 0.4, r * 0.1, 0, 0, r * 1.05);
    grd.addColorStop(0, 'rgba(255,255,255,0.35)'); grd.addColorStop(0.5, 'rgba(255,255,255,0)'); grd.addColorStop(1, 'rgba(80,20,0,0.35)');
    g.fillStyle = grd; g.fillRect(-r, -r, r * 2, r * 2);
    g.restore();
    g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.lineWidth = Math.max(2, r * 0.06); g.strokeStyle = INK; g.stroke();
    // 꼭지
    g.fillStyle = '#4f7a2a'; g.strokeStyle = INK; g.lineWidth = Math.max(1.6, r * 0.04);
    g.beginPath(); g.moveTo(-r * 0.09, -r * 0.86); g.quadraticCurveTo(-r * 0.05, -r * 1.12, r * 0.14, -r * 1.16); g.lineTo(r * 0.16, -r * 1.02); g.quadraticCurveTo(r * 0.06, -r * 0.98, r * 0.1, -r * 0.84); g.closePath();
    g.fill(); g.stroke();
  }
  var DRAW = {
    corn: function (g, r) {
      disc(g, r, '#fff1c4');
      // 캔디콘: 노랑(아래) · 주황(가운데) · 흰색(끝) 삼각형
      g.save();
      g.beginPath(); g.moveTo(0, -r * 0.78); g.lineTo(r * 0.6, r * 0.62); g.quadraticCurveTo(0, r * 0.86, -r * 0.6, r * 0.62); g.closePath();
      g.clip();
      g.fillStyle = '#ffd23f'; g.fillRect(-r, r * 0.18, r * 2, r);
      g.fillStyle = '#ff8a1f'; g.fillRect(-r, -r * 0.22, r * 2, r * 0.4);
      g.fillStyle = '#fffaf0'; g.fillRect(-r, -r, r * 2, r * 0.78);
      g.restore();
      g.beginPath(); g.moveTo(0, -r * 0.78); g.lineTo(r * 0.6, r * 0.62); g.quadraticCurveTo(0, r * 0.86, -r * 0.6, r * 0.62); g.closePath();
      g.lineWidth = Math.max(1.4, r * 0.08); g.strokeStyle = INK; g.stroke();
    },
    pumpkin: function (g, r) {
      pumpkinBody(g, r, '#ff8a1f', 'rgba(150,60,0,0.55)');
      shine(g, r);
    },
    jack: function (g, r) {
      // 은은한 빛 테두리 (shadowBlur 대신 원형 그라데이션 — 작은 캔버스에서 네모 자국이 남지 않게)
      var halo = g.createRadialGradient(0, 0, r * 0.9, 0, 0, r * 1.4);
      halo.addColorStop(0, 'rgba(255, 200, 60, 0.55)'); halo.addColorStop(1, 'rgba(255, 200, 60, 0)');
      g.beginPath(); g.arc(0, 0, r * 1.4, 0, Math.PI * 2); g.fillStyle = halo; g.fill();
      pumpkinBody(g, r, '#ff9a1f', 'rgba(150,60,0,0.55)');
      // 빛나는 얼굴
      g.fillStyle = '#fff3a0'; g.strokeStyle = '#5a1e00'; g.lineWidth = Math.max(1.4, r * 0.03);
      g.save(); g.shadowColor = 'rgba(255, 240, 120, 0.95)'; g.shadowBlur = r * 0.18;
      g.beginPath(); g.moveTo(-r * 0.52, -r * 0.1); g.lineTo(-r * 0.32, -r * 0.42); g.lineTo(-r * 0.12, -r * 0.1); g.closePath();
      g.moveTo(r * 0.52, -r * 0.1); g.lineTo(r * 0.32, -r * 0.42); g.lineTo(r * 0.12, -r * 0.1); g.closePath();
      g.moveTo(-r * 0.08, r * 0.02); g.lineTo(r * 0.08, r * 0.02); g.lineTo(0, r * 0.16); g.closePath();
      g.moveTo(-r * 0.6, r * 0.24);
      g.quadraticCurveTo(0, r * 0.82, r * 0.6, r * 0.24);
      g.lineTo(r * 0.42, r * 0.3); g.lineTo(r * 0.34, r * 0.44); g.lineTo(r * 0.22, r * 0.32); g.lineTo(r * 0.08, r * 0.48);
      g.lineTo(-r * 0.06, r * 0.32); g.lineTo(-r * 0.2, r * 0.46); g.lineTo(-r * 0.32, r * 0.3); g.lineTo(-r * 0.44, r * 0.4);
      g.closePath();
      g.fill();
      g.restore();
      g.stroke();
    }
  };
  function drawTier(g, tier, r) {
    var T = C.TIERS[tier];
    if (DRAW[T.id]) { DRAW[T.id](g, r); return; }
    disc(g, r, T.color);
    shine(g, r);
    emoji(g, r, T.emoji, T.id === 'ghost' || T.id === 'bat' ? 1.25 : 1.18);
  }
  function makeSprite(sizeUnits, k, draw) {
    var c = document.createElement('canvas');
    c.width = Math.max(2, Math.ceil(sizeUnits * k));
    c.height = c.width;
    var g = c.getContext('2d');
    g.setTransform(k, 0, 0, k, c.width / 2, c.height / 2);
    g.lineJoin = 'round'; g.lineCap = 'round';
    draw(g);
    return { c: c, size: c.width / k };
  }
  function buildSprites() {
    var k = view.k;
    sprites = C.TIERS.map(function (T, i) {
      var pad = T.id === 'jack' ? T.r * 0.45 : T.id === 'pumpkin' ? T.r * 0.3 : 4;
      return makeSprite((T.r + pad) * 2, k, function (g) { drawTier(g, i, T.r); });
    });
  }
  // 조각 하나를 (x, y)에 반지름 r 로 그린다 (스프라이트는 원래 반지름 기준)
  function blitTier(g, tier, x, y, r, angle) {
    var sp = sprites[tier];
    if (!sp) return;
    var s = sp.size * (r / C.TIERS[tier].r);
    if (angle && !REDUCED) {
      g.save(); g.translate(x, y); g.rotate(angle);
      g.drawImage(sp.c, -s / 2, -s / 2, s, s);
      g.restore();
    } else g.drawImage(sp.c, x - s / 2, y - s / 2, s, s);
  }

  // 작은 캔버스(다음 조각·끝 화면 아이콘)에 조각 하나
  function drawIcon(canvas, tier) {
    if (!canvas) return;
    var css = canvas.clientWidth || 40;
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(css * dpr); canvas.height = Math.round(css * dpr);
    var g = canvas.getContext('2d');
    var T = C.TIERS[tier];
    var pad = T.id === 'jack' ? 1.45 : T.id === 'pumpkin' ? 1.3 : 1.08;
    var k = canvas.width / (T.r * 2 * pad);
    g.setTransform(k, 0, 0, k, canvas.width / 2, canvas.height / 2 + (T.id === 'pumpkin' || T.id === 'jack' ? T.r * 0.08 : 0));
    g.lineJoin = 'round'; g.lineCap = 'round';
    drawTier(g, tier, T.r);
  }

  // 단계 사슬(병 위 띠): 만들어 본 단계까지만 또렷하게
  function drawChain() {
    var cv = els.chain;
    var css = cv.clientWidth;
    if (!css) return;
    var hCss = cv.clientHeight || 30;
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    cv.width = Math.round(css * dpr); cv.height = Math.round(hCss * dpr);
    var g = cv.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height);
    var n = C.TIERS.length;
    var cell = cv.width / n;
    var maxT = state ? state.maxTier : 0;
    for (var i = 0; i < n; i++) {
      var T = C.TIERS[i];
      var rr = Math.min(cell * 0.42, cv.height * 0.42) * (0.62 + 0.38 * i / (n - 1));
      var pad = T.id === 'jack' ? 1.45 : T.id === 'pumpkin' ? 1.3 : 1.0;
      var k = rr / (T.r * pad);
      g.save();
      g.globalAlpha = i <= maxT ? 1 : 0.22;
      g.setTransform(k, 0, 0, k, cell * (i + 0.5), cv.height / 2 + (pad > 1 ? rr * 0.1 : 0));
      g.lineJoin = 'round'; g.lineCap = 'round';
      drawTier(g, i, T.r);
      g.restore();
    }
  }

  // ---------------------------------------------------------------- 캔버스 크기
  function layout() {
    var shell = els.play.parentNode;
    var avail = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    els.field.style.width = '';
    var rect = els.field.getBoundingClientRect();
    var maxH = Math.max(330, window.innerHeight - Math.max(0, rect.top) - 14);
    var w = avail, h = w * 1.5;
    if (h > maxH) { h = maxH; w = h / 1.5; }
    w = Math.floor(w); h = Math.floor(w * 1.5);
    els.field.style.width = w + 'px';
    els.field.style.height = h + 'px';
    els.chain.style.width = w + 'px';
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    els.canvas.width = Math.round(w * dpr);
    els.canvas.height = Math.round(h * dpr);
    els.canvas.style.width = w + 'px';
    els.canvas.style.height = h + 'px';
    view = { w: w, h: h, dpr: dpr, k: els.canvas.width / C.W };
    var ff = getComputedStyle(document.body).getPropertyValue('--font-display');
    fontFamily = (ff && ff.trim()) || 'sans-serif';
    buildSprites();
    drawChain();
    hud.next = -1;
  }

  // ---------------------------------------------------------------- 그리기
  function draw() {
    var k = view.k;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    if (!state) return;
    ctx.setTransform(k, 0, 0, k, 0, 0);
    var t = state.t;
    // 선
    var warn = state.danger > 0;
    var pulse = warn && !REDUCED ? 0.55 + 0.45 * Math.sin(t / 90) : 1;
    ctx.save();
    ctx.setLineDash([10, 8]);
    ctx.lineWidth = warn ? 3 : 2;
    ctx.strokeStyle = warn ? 'rgba(255, 77, 94, ' + (0.5 + 0.5 * pulse).toFixed(3) + ')' : 'rgba(255, 246, 234, 0.32)';
    ctx.beginPath(); ctx.moveTo(6, C.LINE_Y); ctx.lineTo(C.W - 6, C.LINE_Y); ctx.stroke();
    ctx.restore();
    // 조준선 + 손에 든 조각
    var holding = phase === 'play' && C.canDrop(state);
    if (holding || phase === 'paused') {
      var hr = C.TIERS[state.cur].r;
      var hx = state.aimX;
      if (holding) {
        ctx.save();
        ctx.setLineDash([4, 8]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(184, 255, 92, 0.38)';
        ctx.beginPath(); ctx.moveTo(hx, C.DROP_Y + hr + 4); ctx.lineTo(hx, C.H - 4); ctx.stroke();
        ctx.restore();
      }
      if (C.canDrop(state)) blitTier(ctx, state.cur, hx, C.DROP_Y, hr, 0);
    }
    // 조각들
    for (var i = 0; i < state.bodies.length; i++) {
      var b = state.bodies[i];
      blitTier(ctx, b.tier, b.x, b.y, b.r, b.a);
    }
    // 효과
    for (var j = 0; j < fx.length; j++) {
      var f = fx[j];
      var p = f.age / f.life;
      if (f.kind === 'ring') {
        ctx.globalAlpha = Math.max(0, 1 - p);
        ctx.lineWidth = 4 * (1 - p) + 1;
        ctx.strokeStyle = f.color;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + p * 0.6), 0, Math.PI * 2); ctx.stroke();
      } else if (f.kind === 'text') {
        ctx.globalAlpha = Math.max(0, 1 - p * p);
        ctx.font = '400 ' + (f.big ? 30 : 22) + 'px ' + fontFamily;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var ty = f.y - (REDUCED ? 0 : p * 40);
        ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.strokeText(f.text, f.x, ty);
        ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, ty);
      } else {
        ctx.globalAlpha = Math.max(0, 1 - p);
        ctx.fillStyle = f.color;
        ctx.beginPath(); ctx.arc(f.x + f.vx * p, f.y + f.vy * p + 30 * p * p, f.r * (1 - p * 0.5), 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function addFx(e) {
    if (e.type !== 'merge' && e.type !== 'pop') return;
    var T = C.TIERS[Math.min(e.tier, C.TOP)];
    var big = e.type === 'pop' || e.tier >= 7;
    var ty = Math.max(30, e.y - (e.type === 'pop' ? 20 : T.r * 0.6));
    fx.push({ kind: 'text', text: '+' + e.points, x: Math.max(30, Math.min(C.W - 30, e.x)), y: ty, age: 0, life: 800, color: big ? '#b8ff5c' : '#fff4c7', big: big });
    if (!REDUCED) {
      fx.push({ kind: 'ring', x: e.x, y: e.y, r: T.r, age: 0, life: 420, color: e.type === 'pop' ? '#fff3a0' : 'rgba(255, 246, 234, 0.85)' });
      var n = e.type === 'pop' ? 18 : 7;
      for (var i = 0; i < n; i++) {
        var a = Math.random() * Math.PI * 2;
        var sp = (e.type === 'pop' ? 90 : 40) + Math.random() * 30;
        fx.push({ kind: 'dot', x: e.x, y: e.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 20, r: 3 + Math.random() * 3, age: 0, life: 520, color: T.color });
      }
    }
    if (fx.length > 120) fx.splice(0, fx.length - 120);
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    if (force || hud.score !== state.score) { hud.score = state.score; els.score.textContent = num(state.score); }
    var best = Math.max(bestShown, state.score);
    if (force || hud.best !== best) { hud.best = best; els.best.textContent = num(best); }
    if (force || hud.next !== state.next) {
      hud.next = state.next;
      drawIcon(els.next, state.next);
      els.next.setAttribute('aria-label', fmt(P.nextAria, { name: TIER_NAMES[state.next] || '' }));
    }
    if (force || hud.maxTier !== state.maxTier) { hud.maxTier = state.maxTier; drawChain(); }
  }

  // ---------------------------------------------------------------- 루프
  function loop(now) {
    raf = 0;
    if (phase !== 'play') return;
    var dt = Math.min(100, Math.max(0, now - last));
    last = now;
    if (keys.left || keys.right) C.aim(state, state.aimX + ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 0.42 * dt);
    var events = C.step(state, dt * speed);
    for (var i = 0; i < events.length; i++) addFx(events[i]);
    for (var j = fx.length - 1; j >= 0; j--) { fx[j].age += dt; if (fx[j].age >= fx[j].life) fx.splice(j, 1); }
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

  // ---------------------------------------------------------------- 시작 · 일시정지 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    stopLoop();
    state = C.newGame();
    fx = [];
    bestShown = getBest();
    hud = { score: -1, best: -1, next: -1, maxTier: -1 };
    keys.left = keys.right = false; pointerDown = false;
    doneSent = false;
    phase = 'play';
    els.pausedBox.hidden = true;
    els.full.hidden = true;
    show('play');
    layout();
    updateHud(true);
    draw();
    track('start');
    try { els.field.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    startLoop();
  }

  function pause() {
    if (phase !== 'play') return;
    phase = 'paused';
    stopLoop();
    keys.left = keys.right = false; pointerDown = false;
    draw();
    els.pausedBox.hidden = false;
    try { els.resumeBtn.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }
  function resume() {
    if (phase !== 'paused') return;
    phase = 'play';
    els.pausedBox.hidden = true;
    try { els.field.focus({ preventScroll: true }); } catch (e) { /* noop */ }
    startLoop();
  }

  function finish() {
    if (phase === 'end') return;
    phase = 'end';
    stopLoop();
    draw();
    els.full.hidden = false;
    var myRun = runId;
    var s = state;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    endTimer = setTimeout(function () {
      if (myRun !== runId) return;
      els.full.hidden = true;
      els.reason.textContent = R.full;
      els.resScore.textContent = num(s.score);
      els.newBest.hidden = !isNew;
      els.resBest.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
      els.resBest.hidden = isNew;
      els.biggest.textContent = TIER_NAMES[s.maxTier] || '';
      els.merges.textContent = num(s.merges + s.pops);
      show('end');
      drawIcon(els.biggestIco, s.maxTier);
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
  function toField(clientX) {
    var r = els.canvas.getBoundingClientRect();
    if (!r.width) return null;
    return (clientX - r.left) / r.width * C.W;
  }
  function aimAt(clientX) {
    var x = toField(clientX);
    if (x != null && state) C.aim(state, x);
  }
  function dropNow() {
    if (phase !== 'play' || !state) return false;
    return !!C.drop(state);
  }
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerDown = true;
    try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    aimAt(e.clientX);
    e.preventDefault();
  });
  els.field.addEventListener('pointermove', function (e) {
    if (phase !== 'play') return;
    if (e.pointerType === 'mouse' || pointerDown) aimAt(e.clientX);
  });
  els.field.addEventListener('pointerup', function (e) {
    if (!pointerDown) return;
    pointerDown = false;
    if (phase !== 'play') return;
    aimAt(e.clientX);
    dropNow();
  });
  els.field.addEventListener('pointercancel', function () { pointerDown = false; });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play') e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; e.preventDefault(); }
    else if (k === ' ' || k === 'Enter' || k === 'ArrowDown' || k === 's' || k === 'S') {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON' && (k === ' ' || k === 'Enter')) return;
      if (!e.repeat) dropNow();
      e.preventDefault();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('keyup', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
  });
  window.addEventListener('blur', function () { keys.left = keys.right = false; });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('resize', function () {
    if (phase === 'play' || phase === 'paused') { layout(); updateHud(true); draw(); }
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

  window.MERGE_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, t: state.t, score: state.score, merges: state.merges, pops: state.pops, drops: state.drops,
        maxTier: state.maxTier, cur: state.cur, next: state.next, aimX: state.aimX, cooldown: state.cooldown,
        danger: state.danger, over: state.over, reason: state.reason, bodies: state.bodies.length };
    },
    bodies: function () { return state ? state.bodies.map(function (b) { return { id: b.id, tier: b.tier, x: b.x, y: b.y, r: b.r }; }) : []; },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(12, Number(k) || 1)); return speed; },
    best: getBest
  };
  show('start');
})();
