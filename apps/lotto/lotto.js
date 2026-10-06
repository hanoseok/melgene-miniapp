/* apps/lotto/lotto.js — 시작(티징) → 설정 도구(추첨기 연출) → 게임별 정렬된 공 결과 (+ 공통 끝 화면)
 * 로직은 lotto-core.js(LOTTO_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 번호는 먼저 crypto 로 뽑고, 추첨기·공이 굴러 나오는 연출은 그 결과를 보여 줄 뿐이다(움직임 줄이기면 바로 결과).
 * 광고: 설정 화면 뽑기 버튼 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 뽑기를 누를 때 track('start') 한 번, 결과가 보일 때 track('done') 한 번(다시 뽑을 때마다 또).
 * 저장: 입력한 번호·결과는 저장하지도 서버로 보내지도 않는다. 당첨 확률 계산·예측은 하지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.LOTTO_APP (busy(), games(), preset(), config())
 */
(function () {
  'use strict';

  var CORE = window.LOTTO_CORE;
  var UI = window.PAGE_I18N || {};
  var T = UI.tool || {};
  var R = UI.result || {};
  var ERR = T.errors || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DRAW_MS = 1500;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), tool: $('screen-tool'), result: $('screen-result'),
    startBtn: $('start-btn'),
    presetBtns: document.querySelectorAll('[data-preset]'), presetInfo: $('preset-info'),
    customBox: $('custom-box'), customPick: $('custom-pick'), customMax: $('custom-max'),
    gameBtns: document.querySelectorAll('[data-games]'),
    fixed: $('fixed-in'), exclude: $('exclude-in'), error: $('tool-error'),
    machine: $('machine'), drawBtn: $('draw-btn'),
    games: $('res-games'), copy: $('copy-btn'), again: $('again-btn'), change: $('change-btn'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var preset = 'kr';
  var gameCount = 1;
  var busy = false;
  var games = [];
  var lastCfg = null;
  var timers = [];
  var flicker = null;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; if (flicker) { clearInterval(flicker); flicker = null; } }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.tool.hidden = name !== 'tool';
    els.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }

  function currentConfig() {
    return CORE.configFor(preset, { pick: els.customPick.value, max: els.customMax.value });
  }

  // ---------------------------------------------------------------- 설정 화면
  function setError(msg) {
    els.error.textContent = msg || '';
    els.error.hidden = !msg;
  }
  function setPreset(id) {
    if (busy || id === preset) return;
    preset = id;
    els.presetBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-preset') === id)); });
    els.presetInfo.textContent = T.presetInfo[id];
    els.customBox.hidden = id !== 'custom';
    setError('');
  }
  function setGames(n) {
    if (busy) return;
    gameCount = CORE.clampGames(n);
    els.gameBtns.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-games')) === gameCount)); });
  }
  function lock(on) {
    busy = on;
    els.drawBtn.disabled = on;
    els.drawBtn.textContent = on ? T.drawing : T.draw;
    els.machine.classList.toggle('is-drawing', on && !REDUCED);
  }

  // ---------------------------------------------------------------- 뽑기
  function draw() {
    if (busy) return;
    clearTimers();
    show('tool');
    var cfg = currentConfig();
    els.customPick.value = cfg.pick;
    els.customMax.value = cfg.max;
    var fx = CORE.parseNumbers(els.fixed.value, cfg.max);
    var ex = CORE.parseNumbers(els.exclude.value, cfg.max);
    if (fx.bad || ex.bad) { setError(fmt(ERR.bad, { max: cfg.max, pick: cfg.pick })); return; }
    var v = CORE.validate(cfg, fx.list, ex.list);
    if (!v.ok) {
      var key = v.code === 'tooManyFixed' ? 'tooMany' : v.code;
      setError(fmt(ERR[key], { max: cfg.max, pick: cfg.pick }));
      return;
    }
    setError('');
    games = CORE.drawGames(cfg, gameCount, fx.list, ex.list);   // 결과 먼저
    lastCfg = cfg;
    lock(true);
    track('start');
    if (REDUCED) { later(finish, 60); return; }
    var balls = els.machine.querySelectorAll('.lt-m-ball');
    flicker = setInterval(function () {
      balls.forEach(function (b) { b.textContent = String(CORE.cryptoInt(cfg.max) + 1); });
    }, 90);
    later(finish, DRAW_MS);
  }

  function ballHtml(n, k, extra) {
    return '<span class="lt-ball' + (extra ? ' is-extra' : '') + '" data-c="' + CORE.colorIndex(n) + '"' + (extra ? ' data-x="' + preset + '"' : '') +
      ' style="--k:' + k + '">' + n + '</span>';
  }
  function render() {
    var cfg = lastCfg;
    var total = cfg.pick + cfg.xPick;
    var size = total <= 6 ? 44 : (total <= 8 ? 34 : 30);
    els.games.innerHTML = games.map(function (g, i) {
      var k = 0;
      var html = g.main.map(function (n) { return ballHtml(n, k++, false); }).join('');
      if (g.extra.length) {
        html += '<span class="lt-plus" aria-hidden="true">+</span>' + g.extra.map(function (n) { return ballHtml(n, k++, true); }).join('');
      }
      var extraName = g.extra.length && R.extraNames && R.extraNames[preset] ? '<p class="lt-extra-name">+ ' + R.extraNames[preset] + '</p>' : '';
      return '<div class="lt-game"><p class="lt-game-name">' + fmt(R.game, { n: i + 1 }) + '</p><div class="lt-balls" style="--b:' + size + 'px">' + html + '</div>' + extraName + '</div>';
    }).join('');
  }
  function finish() {
    if (flicker) { clearInterval(flicker); flicker = null; }
    els.machine.querySelectorAll('.lt-m-ball').forEach(function (b) { b.textContent = ''; });
    render();
    lock(false);
    show('result');
    track('done');
  }

  function numbersText() { return CORE.gamesText(games, null, '+'); }
  function copyNumbers() {
    if (!games.length) return;
    var text = numbersText();
    var done = function () { if (window.toast) window.toast(R.copied); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  function again() { if (busy) return; draw(); }
  function change() { if (busy) return; show('tool'); }

  if (window.setShareData) {
    window.setShareData(function () {
      var base = window.location.href.split('#')[0];
      return { title: R.shareTitle, text: games.length ? fmt(R.shareText, { numbers: numbersText() }) : R.shareTitle, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: again });

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { show('tool'); });
  els.presetBtns.forEach(function (b) { b.addEventListener('click', function () { setPreset(b.getAttribute('data-preset')); }); });
  els.gameBtns.forEach(function (b) { b.addEventListener('click', function () { setGames(b.getAttribute('data-games')); }); });
  els.drawBtn.addEventListener('click', draw);
  els.copy.addEventListener('click', copyNumbers);
  els.again.addEventListener('click', again);
  els.change.addEventListener('click', change);
  [els.fixed, els.exclude].forEach(function (i) { i.addEventListener('input', function () { setError(''); }); });

  window.LOTTO_APP = {
    busy: function () { return busy; },
    games: function () { return games.map(function (g) { return { main: g.main.slice(), extra: g.extra.slice() }; }); },
    preset: function () { return preset; },
    config: function () { return lastCfg; }
  };

  show('start');
})();
