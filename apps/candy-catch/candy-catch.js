/* apps/candy-catch/candy-catch.js — 시작(티징) → 카운트다운 → 50초 게임(캔버스) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 candy-catch-core.js(CANDY_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(액션 게임). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 필드 위 끌기(터치)·마우스 이동·←/→(A/D) 키. 탭을 떠나면(visibilitychange) 자동 일시정지. prefers-reduced-motion 이면
 *   흔들림·파편·회전·떠오르는 글자 이동을 끈다(게임 자체의 낙하는 그대로).
 * 디버그/검사용 핸들: window.CANDY_APP (phase(), state(), items(), timeScale(k))
 */
(function () {
  'use strict';

  var C = window.CANDY_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'cc_best_v1';
  var COUNT_MS = 2600;          // 3 · 2 · 1 · Go!
  var END_DELAY = REDUCED ? 250 : 650;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), time: $('hud-time'), timebar: $('hud-timebar'), lives: $('hud-lives'), pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('cc-canvas'), combo: $('combo'), count: $('countdown'), countNum: $('countdown-num'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    reason: $('res-reason'), resScore: $('res-score'), newBest: $('res-newbest'), best: $('res-best'),
    caught: $('res-caught'), streak: $('res-streak'), rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | count | play | paused | end
  var resumeTo = 'play';
  var state = null;
  var input = { target: null, dir: 0 };
  var keys = { left: false, right: false };
  var pointerDown = false;
  var raf = 0, last = 0, speed = 1, countLeft = 0;
  var fx = [];             // 떠오르는 점수 글자·파편
  var shake = 0, hurt = 0, comboBump = 0;
  var runId = 0, doneSent = false, endTimer = 0;
  var hud = { score: -1, sec: -1, lives: -1, mult: -1 };
  var view = { w: 0, h: 0, dpr: 1, k: 1 };
  var sprites = {};
  var fontFamily = 'sans-serif';

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

  // ---------------------------------------------------------------- 캔버스 크기 · 스프라이트
  function layout() {
    var shell = els.play.parentNode;
    var avail = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    var rect = els.field.getBoundingClientRect();
    var maxH = Math.max(320, window.innerHeight - Math.max(0, rect.top) - 14);
    var w = avail, h = w * 1.5;
    if (h > maxH) { h = maxH; w = h / 1.5; }
    w = Math.floor(w); h = Math.floor(w * 1.5);
    els.field.style.width = w + 'px';
    els.field.style.height = h + 'px';
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    els.canvas.width = Math.round(w * dpr);
    els.canvas.height = Math.round(h * dpr);
    els.canvas.style.width = w + 'px';
    els.canvas.style.height = h + 'px';
    view = { w: w, h: h, dpr: dpr, k: els.canvas.width / C.W };
    var ff = getComputedStyle(document.body).getPropertyValue('--font-display');
    fontFamily = (ff && ff.trim()) || 'sans-serif';
    buildSprites();
  }

  var INK = '#1b1026';
  function makeSprite(wUnits, hUnits, draw) {
    var k = view.k;
    var c = document.createElement('canvas');
    c.width = Math.max(2, Math.ceil(wUnits * k));
    c.height = Math.max(2, Math.ceil(hUnits * k));
    var g = c.getContext('2d');
    g.setTransform(k, 0, 0, k, c.width / 2, c.height / 2);
    g.lineJoin = 'round';
    g.lineCap = 'round';
    draw(g);
    return { c: c, w: c.width / k, h: c.height / k };
  }
  function star(g, r, inner, n) {
    g.beginPath();
    for (var i = 0; i < n * 2; i++) {
      var a = -Math.PI / 2 + i * Math.PI / n;
      var rr = i % 2 ? inner : r;
      g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    g.closePath();
  }
  var DRAW = {
    wrap: function (g, r) {
      g.fillStyle = '#ff8cc0'; g.strokeStyle = INK; g.lineWidth = 2.2;
      [-1, 1].forEach(function (s) {
        g.beginPath(); g.moveTo(s * r * 0.42, 0); g.lineTo(s * r * 1.02, -r * 0.58); g.lineTo(s * r * 0.86, 0); g.lineTo(s * r * 1.02, r * 0.58); g.closePath();
        g.fill(); g.stroke();
      });
      g.beginPath(); g.arc(0, 0, r * 0.6, 0, Math.PI * 2); g.fillStyle = '#ff5fa2'; g.fill();
      g.save(); g.clip();
      g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = r * 0.16;
      for (var i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * r * 0.42 - r, -r); g.lineTo(i * r * 0.42 + r, r); g.stroke(); }
      g.restore();
      g.beginPath(); g.arc(0, 0, r * 0.6, 0, Math.PI * 2); g.strokeStyle = INK; g.lineWidth = 2.2; g.stroke();
    },
    lolly: function (g, r) {
      g.strokeStyle = INK; g.lineWidth = r * 0.26;
      g.beginPath(); g.moveTo(0, r * 0.2); g.lineTo(0, r * 1.05); g.stroke();
      g.strokeStyle = '#fff4e0'; g.lineWidth = r * 0.14;
      g.beginPath(); g.moveTo(0, r * 0.2); g.lineTo(0, r * 1.0); g.stroke();
      var cy = -r * 0.18, rr = r * 0.78;
      g.beginPath(); g.arc(0, cy, rr, 0, Math.PI * 2); g.fillStyle = '#ffb020'; g.fill();
      g.strokeStyle = '#ff5a36'; g.lineWidth = rr * 0.2;
      g.beginPath();
      for (var t = 0; t < Math.PI * 5.2; t += 0.15) { var q = rr * 0.92 * (t / (Math.PI * 5.2)); g.lineTo(Math.cos(t) * q, cy + Math.sin(t) * q); }
      g.stroke();
      g.beginPath(); g.arc(0, cy, rr, 0, Math.PI * 2); g.strokeStyle = INK; g.lineWidth = 2.2; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(-rr * 0.4, cy - rr * 0.45, rr * 0.22, rr * 0.12, -0.6, 0, Math.PI * 2); g.fill();
    },
    choco: function (g, r) {
      var w = r * 1.6, h = r * 1.1;
      g.save(); g.rotate(-0.18);
      g.beginPath(); g.roundRect ? g.roundRect(-w / 2, -h / 2, w, h, r * 0.16) : g.rect(-w / 2, -h / 2, w, h);
      g.fillStyle = '#7a4424'; g.fill();
      g.strokeStyle = 'rgba(40,18,8,0.6)'; g.lineWidth = 1.4;
      for (var i = 1; i < 3; i++) { g.beginPath(); g.moveTo(-w / 2 + i * w / 6, -h / 2); g.lineTo(-w / 2 + i * w / 6, h / 2); g.stroke(); }
      g.beginPath(); g.moveTo(-w / 2, 0); g.lineTo(0, 0); g.stroke();
      // 포장지 (오른쪽 절반, 은박 톱니)
      g.beginPath(); g.moveTo(-w * 0.02, -h / 2);
      for (var j = 0; j <= 6; j++) g.lineTo(j % 2 ? w * 0.06 : -w * 0.04, -h / 2 + j * h / 6);
      g.lineTo(w / 2, h / 2); g.lineTo(w / 2, -h / 2); g.closePath();
      g.fillStyle = '#7b3fe4'; g.fill();
      g.fillStyle = '#ffd24a'; g.fillRect(w * 0.14, -h * 0.14, w * 0.26, h * 0.28);
      g.beginPath(); g.roundRect ? g.roundRect(-w / 2, -h / 2, w, h, r * 0.16) : g.rect(-w / 2, -h / 2, w, h);
      g.strokeStyle = INK; g.lineWidth = 2.2; g.stroke();
      g.restore();
    },
    star: function (g, r) {
      g.shadowColor = 'rgba(255, 224, 102, 0.9)'; g.shadowBlur = r * 0.8;
      star(g, r, r * 0.46, 5); g.fillStyle = '#ffd23f'; g.fill();
      g.shadowBlur = 0;
      g.strokeStyle = INK; g.lineWidth = 2.2; g.stroke();
      star(g, r * 0.55, r * 0.26, 5); g.fillStyle = '#fff3a6'; g.fill();
    },
    spider: function (g, r) {
      g.strokeStyle = INK; g.lineWidth = r * 0.13;
      for (var s = -1; s <= 1; s += 2) {
        for (var i = 0; i < 4; i++) {
          var a = -0.75 + i * 0.5;
          g.beginPath(); g.moveTo(0, r * 0.1);
          g.quadraticCurveTo(s * r * 0.75, r * 0.1 + Math.sin(a) * r * 0.9 - r * 0.35, s * r * 1.0, r * 0.1 + Math.sin(a) * r * 0.95 + r * 0.25);
          g.stroke();
        }
      }
      g.fillStyle = '#2a1840';
      g.beginPath(); g.ellipse(0, r * 0.18, r * 0.52, r * 0.6, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#6b4ca0'; g.lineWidth = 1.6; g.stroke();
      g.beginPath(); g.arc(0, -r * 0.46, r * 0.34, 0, Math.PI * 2); g.fillStyle = '#2a1840'; g.fill(); g.stroke();
      g.fillStyle = '#ff3b5c';
      g.beginPath(); g.arc(-r * 0.14, -r * 0.5, r * 0.1, 0, Math.PI * 2); g.arc(r * 0.14, -r * 0.5, r * 0.1, 0, Math.PI * 2); g.fill();
      // 등의 빨간 모래시계 무늬
      g.beginPath(); g.moveTo(-r * 0.16, r * 0.02); g.lineTo(r * 0.16, r * 0.02); g.lineTo(-r * 0.16, r * 0.38); g.lineTo(r * 0.16, r * 0.38); g.closePath(); g.fill();
    },
    ghost: function (g, r) {
      var w = r * 0.85;
      g.beginPath();
      g.moveTo(-w, r * 0.75);
      g.lineTo(-w, -r * 0.1);
      g.arc(0, -r * 0.1, w, Math.PI, 0);
      g.lineTo(w, r * 0.75);
      for (var i = 0; i < 4; i++) {
        var x0 = w - i * (w * 2 / 4);
        g.quadraticCurveTo(x0 - w / 4, r * (i % 2 ? 0.95 : 0.5), x0 - w / 2, r * 0.75);
      }
      g.closePath();
      g.fillStyle = 'rgba(244, 246, 255, 0.96)'; g.fill();
      g.strokeStyle = '#8a7bc4'; g.lineWidth = 2; g.stroke();
      g.fillStyle = INK;
      g.beginPath(); g.ellipse(-w * 0.36, -r * 0.18, r * 0.12, r * 0.19, 0, 0, Math.PI * 2); g.ellipse(w * 0.36, -r * 0.18, r * 0.12, r * 0.19, 0, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.ellipse(0, r * 0.2, r * 0.14, r * 0.18, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255, 143, 177, 0.55)';
      g.beginPath(); g.arc(-w * 0.62, r * 0.08, r * 0.1, 0, Math.PI * 2); g.arc(w * 0.62, r * 0.08, r * 0.1, 0, Math.PI * 2); g.fill();
    }
  };
  function drawBucket(g, color) {
    var bw = C.BASKET_W;
    g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.moveTo(-bw * 0.36, -18); g.bezierCurveTo(-bw * 0.36, -56, bw * 0.36, -56, bw * 0.36, -18); g.stroke();
    g.beginPath();
    g.moveTo(-bw / 2 - 4, -22); g.lineTo(bw / 2 + 4, -22);
    g.lineTo(bw * 0.42, 26); g.quadraticCurveTo(bw * 0.4, 34, bw * 0.3, 34);
    g.lineTo(-bw * 0.3, 34); g.quadraticCurveTo(-bw * 0.4, 34, -bw * 0.42, 26);
    g.closePath();
    g.fillStyle = color; g.fill();
    g.lineWidth = 4; g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(-bw / 2 + 6, -19, bw - 12, 5);
    g.fillStyle = INK;
    g.beginPath(); g.moveTo(-bw * 0.24, -8); g.lineTo(-bw * 0.13, 5); g.lineTo(-bw * 0.35, 5); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(bw * 0.24, -8); g.lineTo(bw * 0.35, 5); g.lineTo(bw * 0.13, 5); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-bw * 0.28, 12); g.quadraticCurveTo(0, 32, bw * 0.28, 12);
    g.lineTo(bw * 0.18, 13); g.lineTo(bw * 0.12, 19); g.lineTo(bw * 0.05, 14); g.lineTo(-bw * 0.03, 20); g.lineTo(-bw * 0.1, 14); g.lineTo(-bw * 0.17, 19); g.lineTo(-bw * 0.22, 13);
    g.closePath(); g.fill();
  }
  function buildSprites() {
    sprites = {};
    C.ITEMS.forEach(function (it) {
      var pad = it.id === 'star' ? it.r * 0.9 : 6;
      var size = (it.r + pad) * 2 + (it.id === 'lolly' ? it.r * 0.5 : 0);
      sprites[it.id] = makeSprite(size, size, function (g) { DRAW[it.id](g, it.r); });
    });
    sprites.bucket = makeSprite(C.BASKET_W + 24, 104, function (g) { g.translate(0, 8); drawBucket(g, '#ff8a1f'); });
    sprites.bucketHurt = makeSprite(C.BASKET_W + 24, 104, function (g) { g.translate(0, 8); drawBucket(g, '#ff4d5e'); });
  }
  function blit(sp, x, y) { ctx.drawImage(sp.c, x - sp.w / 2, y - sp.h / 2, sp.w, sp.h); }

  // ---------------------------------------------------------------- 그리기
  function draw() {
    var k = view.k;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    if (!state) return;
    var sx = (!REDUCED && shake > 0) ? (Math.random() - 0.5) * shake : 0;
    ctx.setTransform(k, 0, 0, k, sx * k, 0);
    var t = state.t;
    for (var i = 0; i < state.items.length; i++) {
      var it = state.items[i];
      var sp = sprites[it.type];
      if (!sp) continue;
      if (it.type === 'spider') {
        ctx.strokeStyle = 'rgba(230, 220, 255, 0.55)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(it.x, it.y - 12); ctx.lineTo(it.x, Math.max(-10, it.y - 110)); ctx.stroke();
      }
      if (!REDUCED && C.BY_ID[it.type].kind === 'candy') {
        ctx.save(); ctx.translate(it.x, it.y); ctx.rotate(it.spin * (t - it.born) / 1000);
        ctx.drawImage(sp.c, -sp.w / 2, -sp.h / 2, sp.w, sp.h);
        ctx.restore();
      } else {
        blit(sp, it.x, it.y);
      }
    }
    // 바구니 (맞은 뒤 무적 동안 깜빡임)
    var blink = C.invulnerable(state) && Math.floor(t / 110) % 2 === 0;
    ctx.globalAlpha = blink ? 0.45 : 1;
    blit(hurt > 0 ? sprites.bucketHurt : sprites.bucket, state.x, C.BASKET_Y);
    ctx.globalAlpha = 1;
    // 효과
    for (var j = 0; j < fx.length; j++) {
      var f = fx[j];
      var p = f.age / f.life;
      if (f.kind === 'text') {
        ctx.globalAlpha = Math.max(0, 1 - p * p);
        ctx.font = '400 ' + (f.big ? 26 : 21) + 'px ' + fontFamily;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var ty = f.y - (REDUCED ? 0 : p * 46);
        ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.strokeText(f.text, f.x, ty);
        ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, ty);
      } else {
        ctx.globalAlpha = Math.max(0, 1 - p);
        ctx.fillStyle = f.color;
        ctx.beginPath(); ctx.arc(f.x + f.vx * p, f.y + f.vy * p + 40 * p * p, f.r * (1 - p * 0.5), 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function addFx(e) {
    var type = C.BY_ID[e.item];
    if (e.type === 'catch') {
      fx.push({ kind: 'text', text: '+' + e.points, x: e.x, y: C.RIM_Y - 26, age: 0, life: 700, color: e.mult > 1 ? '#b8ff5c' : '#fff4c7', big: e.mult > 1 });
      if (!REDUCED) for (var i = 0; i < 6; i++) {
        var a = Math.random() * Math.PI * 2;
        fx.push({ kind: 'dot', x: e.x, y: C.RIM_Y - 6, vx: Math.cos(a) * 34, vy: -18 - Math.random() * 30, r: 3 + Math.random() * 2.5, age: 0, life: 460, color: type.color });
      }
    } else if (e.type === 'hit') {
      hurt = 420;
      shake = 7;
      fx.push({ kind: 'text', text: '−1 ♥', x: e.x, y: C.RIM_Y - 30, age: 0, life: 800, color: '#ff6b81', big: true });
    }
    if (fx.length > 80) fx.splice(0, fx.length - 80);
  }

  // ---------------------------------------------------------------- HUD
  var HEART = '<svg viewBox="0 0 24 22" aria-hidden="true" focusable="false"><path d="M12 21s-8.3-5.3-10.4-10.2A5.8 5.8 0 0 1 12 4.8a5.8 5.8 0 0 1 10.4 6C20.3 15.7 12 21 12 21z"/></svg>';
  function updateHud(force) {
    if (!state) return;
    if (force || hud.score !== state.score) { hud.score = state.score; els.score.textContent = num(state.score); }
    var sec = C.secondsLeft(state);
    if (force || hud.sec !== sec) {
      hud.sec = sec;
      els.time.textContent = String(sec);
      els.time.parentNode.classList.toggle('is-low', sec <= 10 && phase !== 'count');
    }
    els.timebar.style.transform = 'scaleX(' + (C.timeLeft(state) / C.DURATION).toFixed(4) + ')';
    if (force || hud.lives !== state.lives) {
      hud.lives = state.lives;
      var h = '';
      for (var i = 0; i < C.LIVES; i++) h += '<span class="cc-heart' + (i < state.lives ? '' : ' is-off') + '">' + HEART + '</span>';
      els.lives.innerHTML = h;
      els.lives.setAttribute('aria-label', fmt(P.livesAria, { n: state.lives }));
    }
    var mult = C.multiplier(state.combo);
    if (force || hud.mult !== mult) {
      if (mult > hud.mult && mult > 1 && !REDUCED) comboBump = 1;
      hud.mult = mult;
      els.combo.textContent = mult > 1 ? fmt(P.combo, { n: mult }) : '';
      els.combo.classList.toggle('is-on', mult > 1);
      els.combo.setAttribute('data-mult', String(mult));
      if (comboBump) { els.combo.classList.remove('is-bump'); void els.combo.offsetWidth; els.combo.classList.add('is-bump'); comboBump = 0; }
    }
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
      input.dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
      var events = C.step(state, gdt, input);
      for (var i = 0; i < events.length; i++) addFx(events[i]);
    }
    for (var j = fx.length - 1; j >= 0; j--) { fx[j].age += dt; if (fx[j].age >= fx[j].life) fx.splice(j, 1); }
    if (shake > 0) shake = Math.max(0, shake - dt * 0.03);
    if (hurt > 0) hurt = Math.max(0, hurt - dt);
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
    var n = Math.ceil((countLeft - 500) / 700);
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
    fx = []; shake = 0; hurt = 0;
    hud = { score: -1, sec: -1, lives: -1, mult: -1 };
    input.target = null; input.dir = 0; keys.left = keys.right = false; pointerDown = false;
    doneSent = false;
    phase = 'count';
    countLeft = COUNT_MS;
    countShown = '';
    els.pausedBox.hidden = true;
    els.count.hidden = false;
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
    keys.left = keys.right = false; pointerDown = false;
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
      els.reason.textContent = s.reason === 'lives' ? R.outOfLives : R.timeUp;
      els.reason.setAttribute('data-reason', s.reason);
      els.resScore.textContent = num(s.score);
      els.newBest.hidden = !isNew;
      els.best.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
      els.best.hidden = isNew;
      els.caught.textContent = num(s.caught);
      els.streak.textContent = num(s.maxCombo);
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
  function toField(clientX) {
    var r = els.canvas.getBoundingClientRect();
    if (!r.width) return null;
    return (clientX - r.left) / r.width * C.W;
  }
  els.field.addEventListener('pointerdown', function (e) {
    if (phase !== 'play' && phase !== 'count') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    pointerDown = true;
    try { els.field.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
    input.target = toField(e.clientX);
    e.preventDefault();
  });
  els.field.addEventListener('pointermove', function (e) {
    if (phase !== 'play' && phase !== 'count') return;
    if (e.pointerType === 'mouse' || pointerDown) input.target = toField(e.clientX);
  });
  function up() { pointerDown = false; }
  els.field.addEventListener('pointerup', up);
  els.field.addEventListener('pointercancel', up);
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play') e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; input.target = null; e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; input.target = null; e.preventDefault(); }
    else if (k === 'p' || k === 'P' || k === 'Escape' || (k === ' ' && document.activeElement === els.field)) {
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

  window.CANDY_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      return { seed: state.seed, t: state.t, score: state.score, lives: state.lives, combo: state.combo, maxCombo: state.maxCombo,
        caught: state.caught, missed: state.missed, hits: state.hits, spawned: state.spawned, x: state.x, over: state.over, reason: state.reason, items: state.items.length };
    },
    items: function () { return state ? state.items.map(function (it) { return { type: it.type, x: it.x, y: it.y }; }) : []; },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(20, Number(k) || 1)); return speed; },
    best: getBest
  };
  show('start');
})();
