/* apps/stack/stack.js — 시작(티징) → 탑 쌓기(캔버스, 아이소메트릭) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 stack-core.js(STACK_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다(액션 게임). 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력: 필드 탭/클릭(pointerdown)·스페이스·엔터·↓. 탭을 떠나면(visibilitychange·pagehide) 자동 일시정지.
 *   prefers-reduced-motion 이면 퍼펙트 물결·글자 떠오름·조각 회전 낙하·끝난 뒤 줌아웃 애니메이션을 끈다(조각은 제자리에서 짧게 사라짐).
 * 그리기: requestAnimationFrame, devicePixelRatio(최대 2.5), 아이소메트릭 상자(윗면·왼면·오른면), 층마다 색이 조금씩 바뀜, 카메라가 위로 따라감.
 * 디버그/검사용 핸들: window.STACK_APP (phase(), state(), best(), timeScale(k), drop(), aim(offset))
 */
(function () {
  'use strict';

  var C = window.STACK_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'st_best_v1';
  var END_DELAY = REDUCED ? 450 : 1500;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();
  var COS = Math.cos(Math.PI / 6), SIN = 0.5;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), best: $('hud-best'), pauseBtn: $('pause-btn'),
    field: $('field'), canvas: $('st-canvas'), hint: $('tap-hint'),
    pausedBox: $('pause-overlay'), resumeBtn: $('resume-btn'),
    resScore: $('res-score'), newBest: $('res-newbest'), bestLine: $('res-best'),
    perfects: $('res-perfects'), combo: $('res-combo'), rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var ctx = els.canvas.getContext('2d');

  var phase = 'start';     // start | play | paused | over | end
  var state = null;
  var raf = 0, last = 0, speed = 1;
  var runId = 0, doneSent = false, endTimer = 0;
  var hudScore = -1;
  var view = { w: 320, h: 440, dpr: 1, k: 1 };
  var cam = 0, zoom = 1, zoomTarget = 1, camTarget = 0;
  var debris = [];         // 떨어지는 조각 { box, y, vy, rot, vr, age, life }
  var ripples = [];        // 퍼펙트 물결 { box, age, life }
  var label = null;        // { text, sub, age, life }
  var fontFamily = 'sans-serif';
  var overAt = 0;

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
    var w = Math.min((shell && shell.clientWidth ? shell.clientWidth - 32 : window.innerWidth - 32), 448);
    w = Math.max(240, Math.floor(w));
    var rect = els.field.getBoundingClientRect();
    var availH = window.innerHeight - Math.max(0, rect.top) - 14;
    var h = Math.floor(Math.max(360, Math.min(availH, w * 1.45, 640)));
    els.field.style.width = w + 'px';
    els.field.style.height = h + 'px';
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    els.canvas.width = Math.round(w * dpr);
    els.canvas.height = Math.round(h * dpr);
    els.canvas.style.width = w + 'px';
    els.canvas.style.height = h + 'px';
    // 받침 블록의 마름모 폭이 캔버스 폭의 약 52%
    view = { w: w, h: h, dpr: dpr, k: (w * 0.52) / (2 * C.BASE * COS) };
    var ff = getComputedStyle(document.body).getPropertyValue('--font-display');
    fontFamily = (ff && ff.trim()) || 'sans-serif';
  }

  // ---------------------------------------------------------------- 색 (층마다 조금씩)
  function hueOf(level) { return ((state ? state.hue0 : 200) + level * 7) % 360; }
  function topLevel() { return state ? state.blocks[state.blocks.length - 1].level : 0; }

  // ---------------------------------------------------------------- 그리기
  function proj(x, y, z) {
    var k = view.k * zoom;
    return [view.w / 2 + (x - z) * COS * k, view.h * 0.46 + (x + z) * SIN * k - (y - cam) * k];
  }
  function poly(g, pts) {
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
  }
  // 상자: 바닥 x..x+w, z..z+d, 높이 y0..y1
  function drawBox(g, b, y0, y1, hue, alpha) {
    var x0 = b.x, x1 = b.x + b.w, z0 = b.z, z1 = b.z + b.d;
    if (alpha != null && alpha < 1) g.globalAlpha = Math.max(0, alpha);
    // 왼쪽 면 (z = z1)
    poly(g, [proj(x0, y1, z1), proj(x1, y1, z1), proj(x1, y0, z1), proj(x0, y0, z1)]);
    g.fillStyle = 'hsl(' + hue + ', 52%, 60%)'; g.fill();
    // 오른쪽 면 (x = x1)
    poly(g, [proj(x1, y1, z0), proj(x1, y1, z1), proj(x1, y0, z1), proj(x1, y0, z0)]);
    g.fillStyle = 'hsl(' + hue + ', 48%, 48%)'; g.fill();
    // 윗면
    poly(g, [proj(x0, y1, z0), proj(x1, y1, z0), proj(x1, y1, z1), proj(x0, y1, z1)]);
    g.fillStyle = 'hsl(' + hue + ', 64%, 72%)'; g.fill();
    g.strokeStyle = 'rgba(255, 255, 255, 0.35)'; g.lineWidth = 1; g.stroke();
    g.globalAlpha = 1;
  }

  function drawBackground(g) {
    var h = hueOf(topLevel());
    var bg = (h + 28) % 360;
    var grd = g.createLinearGradient(0, 0, 0, view.h);
    grd.addColorStop(0, 'hsl(' + bg + ', 52%, 84%)');
    grd.addColorStop(1, 'hsl(' + ((bg + 24) % 360) + ', 46%, 63%)');
    g.fillStyle = grd;
    g.fillRect(0, 0, view.w, view.h);
  }

  function drawTower(g) {
    var H = C.BLOCK_H;
    var k = view.k * zoom;
    var blocks = state.blocks;
    // 화면 아래로 충분히 내려간 층은 건너뛴다 (불투명하므로 위 블록에 가려짐)
    var below = Math.ceil((view.h * 0.6) / (H * k)) + 8;
    var minLevel = Math.max(0, Math.floor(cam / H) - below);
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.level < minLevel) continue;
      // 받침 블록은 화면 아래까지 이어지는 기둥
      var y0 = b.level === 0 ? -H * 60 : b.level * H;
      drawBox(g, b, y0, (b.level + 1) * H, hueOf(b.level));
    }
  }

  function drawMoving(g) {
    var m = state.moving;
    if (!m) return;
    drawBox(g, m, m.level * C.BLOCK_H, (m.level + 1) * C.BLOCK_H, hueOf(m.level));
  }

  // behind = true: 탑 뒤쪽(화면 깊이가 맨 위 블록보다 먼) 조각만, false: 앞쪽 조각만 — 뒤 조각은 탑보다 먼저 그려 가려지게
  function drawDebris(g, behind) {
    var top = state.blocks[state.blocks.length - 1];
    var topDepth = top.x + top.w / 2 + top.z + top.d / 2;
    for (var i = 0; i < debris.length; i++) {
      var d = debris[i];
      var depth = d.box.x + d.box.w / 2 + d.box.z + d.box.d / 2;
      if ((depth < topDepth) !== behind) continue;
      var a = d.age > d.life * 0.55 ? 1 - (d.age - d.life * 0.55) / (d.life * 0.45) : 1;
      var y0 = d.box.level * C.BLOCK_H + d.y;
      drawBox(g, d.box, y0, y0 + C.BLOCK_H, hueOf(d.box.level), a);
    }
  }

  function drawRipples(g) {
    for (var i = 0; i < ripples.length; i++) {
      var r = ripples[i];
      var t = r.age / r.life;
      var grow = 2 + t * 22;
      var b = r.box, y = (b.level + 1) * C.BLOCK_H;
      poly(g, [proj(b.x - grow, y, b.z - grow), proj(b.x + b.w + grow, y, b.z - grow), proj(b.x + b.w + grow, y, b.z + b.d + grow), proj(b.x - grow, y, b.z + b.d + grow)]);
      g.strokeStyle = 'rgba(255, 255, 255, ' + (0.85 * (1 - t)).toFixed(3) + ')';
      g.lineWidth = 2.5;
      g.stroke();
    }
  }

  function drawLabel(g) {
    if (!label) return;
    var t = label.age / label.life;
    var alpha = t < 0.75 ? 1 : 1 - (t - 0.75) / 0.25;
    var rise = REDUCED ? 0 : t * 14;
    var size = Math.round(Math.min(34, view.w * 0.09));
    g.globalAlpha = Math.max(0, alpha);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = size + 'px ' + fontFamily;
    g.lineWidth = Math.max(3, size * 0.16); g.lineJoin = 'round';
    g.strokeStyle = 'rgba(30, 20, 60, 0.55)';
    g.fillStyle = '#ffffff';
    var y = view.h * 0.14 - rise;
    g.strokeText(label.text, view.w / 2, y); g.fillText(label.text, view.w / 2, y);
    if (label.sub) {
      var s2 = Math.round(size * 0.58);
      g.font = s2 + 'px ' + fontFamily;
      g.lineWidth = Math.max(2, s2 * 0.16);
      g.fillStyle = '#fff6b0';
      g.strokeText(label.sub, view.w / 2, y + size * 0.95); g.fillText(label.sub, view.w / 2, y + size * 0.95);
    }
    g.globalAlpha = 1;
  }

  function draw() {
    var g = ctx;
    g.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    if (!state) { g.clearRect(0, 0, view.w, view.h); return; }
    drawBackground(g);
    drawDebris(g, true);
    drawTower(g);
    drawRipples(g);
    drawMoving(g);
    drawDebris(g, false);
    drawLabel(g);
  }

  // ---------------------------------------------------------------- 사건 → 효과
  function addDebris(box) {
    debris.push({ box: box, y: 0, vy: 0, age: 0, life: REDUCED ? 260 : 1100 });
    if (debris.length > 12) debris.splice(0, debris.length - 12);
  }
  function onEvent(ev) {
    if (!ev) return;
    if (ev.type === 'place') {
      if (ev.cut) addDebris(ev.cut);
      if (ev.perfect) {
        if (!REDUCED) ripples.push({ box: ev.block, age: 0, life: 520 });
        label = { text: P.perfect, sub: ev.combo >= 2 ? fmt(P.combo, { n: num(ev.combo) }) : '', age: 0, life: 900 };
      }
      camTarget = (ev.block.level + 1) * C.BLOCK_H;
      if (REDUCED) cam = camTarget;
    } else if (ev.type === 'miss') {
      addDebris(ev.piece);
      // 끝난 뒤 탑 전체가 보이게 물러난다
      var towerH = (state.score + 2) * C.BLOCK_H;
      var fit = (view.h * 0.5) / (towerH * view.k);
      zoomTarget = Math.max(0.22, Math.min(1, fit));
      camTarget = towerH * 0.5;
      if (REDUCED) { zoom = zoomTarget; cam = camTarget; }
    }
  }

  // ---------------------------------------------------------------- HUD
  function updateHud(force) {
    if (!state) return;
    if (force || hudScore !== state.score) { hudScore = state.score; els.score.textContent = num(state.score); }
  }

  // ---------------------------------------------------------------- 루프
  function loop(now) {
    raf = 0;
    if (phase !== 'play' && phase !== 'over') return;
    var dt = Math.min(100, Math.max(0, now - last));
    last = now;
    var gdt = dt * speed;
    if (phase === 'play') C.step(state, gdt);
    // 카메라·줌 (부드럽게 따라감)
    var ease = 1 - Math.exp(-gdt / 110);
    cam += (camTarget - cam) * ease;
    zoom += (zoomTarget - zoom) * (1 - Math.exp(-gdt / 260));
    for (var i = debris.length - 1; i >= 0; i--) {
      var d = debris[i];
      d.age += gdt;
      if (!REDUCED) { d.vy -= 900 * gdt / 1000; d.y += d.vy * gdt / 1000; }
      if (d.age >= d.life) debris.splice(i, 1);
    }
    for (var j = ripples.length - 1; j >= 0; j--) { ripples[j].age += gdt; if (ripples[j].age >= ripples[j].life) ripples.splice(j, 1); }
    if (label) { label.age += gdt; if (label.age >= label.life) label = null; }
    draw();
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

  // ---------------------------------------------------------------- 시작 · 떨어뜨리기 · 일시정지 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    stopLoop();
    state = C.newGame();
    debris = []; ripples = []; label = null;
    cam = camTarget = C.BLOCK_H; zoom = zoomTarget = 1;
    hudScore = -1;
    doneSent = false;
    phase = 'play';
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

  function doDrop() {
    if (phase !== 'play' || !state) return null;
    var ev = C.drop(state);
    els.hint.hidden = true;
    onEvent(ev);
    updateHud(false);
    if (ev && ev.type === 'miss') { phase = 'over'; overAt = performance.now(); }
    return ev;
  }

  function pause() {
    if (phase !== 'play') return;
    phase = 'paused';
    stopLoop();
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
    var myRun = runId;
    var s = state;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    els.resScore.textContent = num(s.score);
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
    els.bestLine.hidden = isNew;
    els.perfects.textContent = num(s.perfects);
    els.combo.textContent = num(s.bestCombo);
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
    if (phase !== 'play') return;
    if (e.target && e.target.closest && e.target.closest('button')) return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    doDrop();
  });
  els.field.addEventListener('contextmenu', function (e) { if (phase === 'play') e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === ' ' || k === 'Spacebar' || k === 'Enter' || k === 'ArrowDown') {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON' && document.activeElement !== els.field) return;
      e.preventDefault();
      if (!e.repeat) doDrop();
    } else if (k === 'p' || k === 'P' || k === 'Escape') {
      if (phase === 'paused') resume(); else pause();
      e.preventDefault();
    }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('resize', function () {
    if (phase === 'play' || phase === 'paused' || phase === 'over') { layout(); draw(); }
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

  window.STACK_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!state) return null;
      var m = state.moving;
      return { seed: state.seed, score: state.score, combo: state.combo, bestCombo: state.bestCombo, perfects: state.perfects,
        over: state.over, top: state.blocks[state.blocks.length - 1], moving: m ? { axis: m.axis, offset: m.offset, w: m.w, d: m.d } : null };
    },
    timeScale: function (k) { speed = Math.max(0.1, Math.min(20, Number(k) || 1)); return speed; },
    drop: doDrop,
    // 검사용: 움직이는 블록을 맨 위 블록에서 offset 만큼 떨어진 자리로 옮긴다
    aim: function (o) {
      if (!state || !state.moving) return false;
      var m = state.moving, top = state.blocks[state.blocks.length - 1];
      m.offset = Math.max(-C.SPAN, Math.min(C.SPAN, Number(o) || 0));
      m[m.axis] = top[m.axis] + m.offset;
      return true;
    },
    best: getBest
  };
  show('start');
})();
