/* apps/ladder/ladder.js — 사다리타기 SPA 로직 (설정 → 플레이 화면, 시드 기반 사다리 생성/공유)
 * 빌드 도구 없이 그대로 동작해야 하므로 순수 vanilla JS, ES5 스타일 유지.
 * 언어별 문자열(기본 이름, 프리셋, 공유 문구, aria-label)은 페이지에 인라인된 window.PAGE_I18N 에서 읽는다
 * (tools/i18n/<lang>.js 의 ui → tools/gen-i18n.js 가 주입).
 */
(function () {
  'use strict';

  var CORE = window.LADDER_CORE;
  var MIN_N = CORE.MIN_N;
  var MAX_N = CORE.MAX_N;
  var clamp = CORE.clamp;
  var randomSeed = CORE.randomSeed;
  var rowsForN = CORE.rowsForN;
  var mulberry32 = CORE.mulberry32;
  var generateRungs = CORE.generateRungs;
  var computeMapping = CORE.computeMapping;

  var PLAYER_COLORS = [
    '#ff5d5d', '#ff9f45', '#ffc93c', '#8bc34a', '#2fbf71',
    '#17beb8', '#2ea8e5', '#3d5afe', '#9b5de5', '#f15bb5'
  ];

  var UI = window.PAGE_I18N || {};
  var PRESET_POOLS = UI.pools || {};
  function fmt(tpl, vars) {
    return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }

  // 마지막 설정은 언어별로 따로 저장한다 (ko 는 기존 키 그대로).
  var PAGE_LANG = window.PAGE_LANG || 'ko';
  var LS_KEY = 'ldr_last_setup' + (PAGE_LANG === 'ko' ? '' : '_' + PAGE_LANG);

  // ---------------------------------------------------------------
  // base64url (UTF-8 safe) — 공유 링크 인코딩/디코딩
  // ---------------------------------------------------------------
  function encodeShareData(obj) {
    var json = JSON.stringify(obj);
    var bytes = new TextEncoder().encode(json);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    var b64 = btoa(bin);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeShareData(str) {
    var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    var json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  }

  // ---------------------------------------------------------------
  // 사다리 생성: 가로줄(rungs) 배치 + 매핑(permutation) 계산
  // 규칙: 같은 줄(row)에서 이웃한 두 칸(gap)에 동시에 가로줄이 생기지 않는다 → 항상 유효한(경로가
  // 겹치지 않는) 사다리가 되고, 그 결과 참가자→결과 매핑은 항상 순열(permutation)이 된다.
  // ---------------------------------------------------------------
  function buildPathPoints(n, rows, rungs, geom, startCol) {
    var points = [];
    var colX = function (c) { return (c + 0.5) * geom.colW; };
    var cur = startCol;
    points.push({ x: colX(cur), y: geom.padY });
    for (var r = 0; r < rows; r++) {
      var y = geom.padY + (r + 1) * geom.rowH;
      var row = rungs[r];
      points.push({ x: colX(cur), y: y });
      if (cur > 0 && row[cur - 1]) {
        cur -= 1;
        points.push({ x: colX(cur), y: y });
      } else if (cur < n - 1 && row[cur]) {
        cur += 1;
        points.push({ x: colX(cur), y: y });
      }
    }
    points.push({ x: colX(cur), y: geom.cssHeight - geom.padY });
    return { points: points, endCol: cur };
  }

  function pathWithLengths(points) {
    var segLens = [];
    var total = 0;
    for (var i = 1; i < points.length; i++) {
      var dx = points[i].x - points[i - 1].x;
      var dy = points[i].y - points[i - 1].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      segLens.push(len);
      total += len;
    }
    return { points: points, segLens: segLens, total: total };
  }

  // ---------------------------------------------------------------
  // 상태
  // ---------------------------------------------------------------
  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { /* noop */ }

  var state = {
    setup: { count: 4, names: [], results: [] },
    game: null // { n, names, results, seed, rows, rungs, mapping, colors, revealed, activePaths, geom, busy }
  };

  var els = {
    setupScreen: document.getElementById('screen-setup'),
    playScreen: document.getElementById('screen-play'),
    countMinus: document.getElementById('count-minus'),
    countPlus: document.getElementById('count-plus'),
    countNum: document.getElementById('count-num'),
    presetRow: document.getElementById('preset-row'),
    namesList: document.getElementById('names-list'),
    resultsList: document.getElementById('results-list'),
    shuffleBtn: document.getElementById('shuffle-results-btn'),
    buildBtn: document.getElementById('build-btn'),
    editBtn: document.getElementById('edit-btn'),
    rebuildBtn: document.getElementById('rebuild-btn'),
    playersRow: document.getElementById('players-row'),
    resultsRow: document.getElementById('results-row'),
    canvasWrap: document.getElementById('canvas-wrap'),
    canvas: document.getElementById('ladder-canvas'),
    revealAllBtn: document.getElementById('reveal-all-btn'),
    resultsSection: document.getElementById('results-section'),
    resultsTable: document.getElementById('results-table'),
    year: document.getElementById('year'),
  };

  if (els.year) els.year.textContent = new Date().getFullYear();

  // ---------------------------------------------------------------
  // 기본값 / 로컬 저장
  // ---------------------------------------------------------------
  function defaultNames(n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(fmt(UI.defaultName, { n: i + 1 }));
    return arr;
  }
  function defaultResults(n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i === 0 ? UI.win : UI.lose);
    return arr;
  }

  function saveLastSetup() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({
        count: state.setup.count,
        names: state.setup.names,
        results: state.setup.results,
      }));
    } catch (e) { /* noop */ }
  }

  function loadLastSetup() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.names) || !Array.isArray(parsed.results)) return null;
      return parsed;
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------
  // 설정 화면 렌더링
  // ---------------------------------------------------------------
  function resizeSetupArrays() {
    var n = state.setup.count;
    var names = state.setup.names;
    var results = state.setup.results;
    var defN = defaultNames(n);
    var defR = defaultResults(n);
    while (names.length < n) names.push(defN[names.length]);
    while (results.length < n) results.push(defR[results.length]);
    names.length = n;
    results.length = n;
  }

  function renderEditList(host, values, ariaTpl) {
    host.innerHTML = '';
    values.forEach(function (val, i) {
      var row = document.createElement('div');
      row.className = 'ldr-edit-row';

      var dot = document.createElement('span');
      dot.className = 'ldr-edit-dot';
      dot.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];
      row.appendChild(dot);

      var input = document.createElement('input');
      input.type = 'text';
      input.value = val;
      input.maxLength = 12;
      input.setAttribute('aria-label', fmt(ariaTpl, { n: i + 1 }));
      input.addEventListener('input', function () {
        values[i] = input.value;
      });
      row.appendChild(input);

      host.appendChild(row);
    });
  }

  function renderSetup() {
    resizeSetupArrays();
    els.countNum.textContent = String(state.setup.count);
    renderEditList(els.namesList, state.setup.names, UI.ariaName);
    renderEditList(els.resultsList, state.setup.results, UI.ariaResult);
  }

  function changeCount(delta) {
    state.setup.count = clamp(state.setup.count + delta, MIN_N, MAX_N);
    renderSetup();
  }

  function applyPreset(key) {
    var n = state.setup.count;
    var results = [];
    if (key === 'coffee') {
      for (var i = 0; i < n; i++) results.push(i === 0 ? UI.coffeeWin : UI.coffeeLose);
    } else if (key === 'order') {
      var labels = UI.order || [];
      for (var j = 0; j < n; j++) results.push(labels[j] || String(j + 1));
    } else {
      var pool = PRESET_POOLS[key] || [];
      for (var k = 0; k < n; k++) results.push(pool[k % pool.length]);
    }
    state.setup.results = results;
    renderEditList(els.resultsList, state.setup.results, UI.ariaResult);
  }

  function shuffleResults() {
    var arr = state.setup.results;
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    renderEditList(els.resultsList, arr, UI.ariaResult);
  }

  // ---------------------------------------------------------------
  // 화면 전환
  // ---------------------------------------------------------------
  function showScreen(name) {
    els.setupScreen.classList.toggle('active', name === 'setup');
    els.playScreen.classList.toggle('active', name === 'play');
  }

  // ---------------------------------------------------------------
  // 캔버스 / 사다리 그리기
  // ---------------------------------------------------------------
  function setupCanvasSize(canvas, cssWidth, cssHeight) {
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function layoutBoard() {
    var g = state.game;
    var cssWidth = els.canvasWrap.clientWidth || 320;
    var rowH = 22;
    var padY = 12;
    g.geom = {
      cssWidth: cssWidth,
      rowH: rowH,
      padY: padY,
      rows: g.rows,
      colW: cssWidth / g.n,
      cssHeight: g.rows * rowH + padY * 2,
    };
    g.ctx = setupCanvasSize(els.canvas, g.geom.cssWidth, g.geom.cssHeight);
  }

  function colXOf(geom, c) { return (c + 0.5) * geom.colW; }

  function drawStaticLadder(ctx, g) {
    var geom = g.geom;
    ctx.clearRect(0, 0, geom.cssWidth, geom.cssHeight);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 세로줄
    ctx.strokeStyle = 'rgba(34,30,20,0.85)';
    ctx.lineWidth = 3;
    for (var c = 0; c < g.n; c++) {
      var x = colXOf(geom, c);
      ctx.beginPath();
      ctx.moveTo(x, geom.padY);
      ctx.lineTo(x, geom.cssHeight - geom.padY);
      ctx.stroke();
    }

    // 가로줄(rung)
    ctx.strokeStyle = 'rgba(34,30,20,0.85)';
    ctx.lineWidth = 3;
    for (var r = 0; r < g.rows; r++) {
      var y = geom.padY + (r + 1) * geom.rowH;
      var row = g.rungs[r];
      for (var gi = 0; gi < row.length; gi++) {
        if (!row[gi]) continue;
        var x1 = colXOf(geom, gi);
        var x2 = colXOf(geom, gi + 1);
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    }
  }

  function drawPartialPath(ctx, pathObj, progress, color) {
    var points = pathObj.points;
    var segLens = pathObj.segLens;
    var total = pathObj.total;
    var target = total * clamp(progress, 0, 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    var acc = 0;
    var tipX = points[0].x, tipY = points[0].y;
    for (var i = 0; i < segLens.length; i++) {
      var segLen = segLens[i];
      var next = points[i + 1];
      if (acc + segLen <= target) {
        ctx.lineTo(next.x, next.y);
        tipX = next.x; tipY = next.y;
        acc += segLen;
      } else {
        var remain = target - acc;
        var t = segLen === 0 ? 0 : remain / segLen;
        var prev = points[i];
        var ix = prev.x + (next.x - prev.x) * t;
        var iy = prev.y + (next.y - prev.y) * t;
        ctx.lineTo(ix, iy);
        tipX = ix; tipY = iy;
        acc = target;
        break;
      }
    }
    ctx.stroke();

    // 진행 중인 끝점에 작은 원(트레이스 느낌)
    if (target < total) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(tipX, tipY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function redraw() {
    var g = state.game;
    if (!g || !g.ctx) return;
    drawStaticLadder(g.ctx, g);
    Object.keys(g.activePaths).forEach(function (key) {
      var ap = g.activePaths[key];
      drawPartialPath(g.ctx, ap.path, ap.progress, ap.color);
    });
  }

  // ---------------------------------------------------------------
  // 참가자 행 / 결과 행 렌더링
  // ---------------------------------------------------------------
  function renderPlayRows() {
    var g = state.game;
    els.playersRow.innerHTML = '';
    els.resultsRow.innerHTML = '';

    for (var i = 0; i < g.n; i++) {
      (function (i) {
        var color = g.colors[i];

        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ldr-player-chip';
        chip.setAttribute('aria-label', fmt(UI.ariaTrace, { name: g.names[i] }));

        var avatar = document.createElement('span');
        avatar.className = 'ldr-player-avatar';
        avatar.style.background = color;
        avatar.textContent = String(i + 1);
        chip.appendChild(avatar);

        var label = document.createElement('span');
        label.className = 'ldr-player-name';
        label.textContent = g.names[i];
        chip.appendChild(label);

        chip.addEventListener('click', function () { onPlayerTap(i); });
        els.playersRow.appendChild(chip);

        var resultChip = document.createElement('div');
        resultChip.className = 'ldr-result-chip';
        resultChip.id = 'result-chip-' + i;
        resultChip.textContent = '?';
        resultChip.setAttribute('aria-label', fmt(UI.ariaHidden, { n: i + 1 }));
        els.resultsRow.appendChild(resultChip);
      })(i);
    }
  }

  function revealResultChip(endCol, color) {
    var chipEl = document.getElementById('result-chip-' + endCol);
    if (!chipEl) return;
    var g = state.game;
    chipEl.textContent = g.results[endCol];
    chipEl.classList.remove('revealed');
    // 리플로우로 애니메이션 재시작
    void chipEl.offsetWidth;
    chipEl.classList.add('revealed');
    chipEl.style.borderColor = color;
    chipEl.setAttribute('aria-label', fmt(UI.ariaRevealed, { result: g.results[endCol] }));
  }

  // ---------------------------------------------------------------
  // 경로 애니메이션
  // ---------------------------------------------------------------
  function animatePlayer(startCol, onDone) {
    var g = state.game;
    if (g.revealed[startCol]) {
      // 이미 공개된 경우 다시 탭하면 애니메이션만 재생(리플레이)
    }
    var built = buildPathPoints(g.n, g.rows, g.rungs, g.geom, startCol);
    var path = pathWithLengths(built.points);
    var color = g.colors[startCol];
    var key = 'p' + startCol;

    g.activePaths[key] = { path: path, progress: reduceMotion ? 1 : 0, color: color };
    g.busy = true;

    var duration = reduceMotion ? 0 : clamp(path.total * 2.2, 500, 1400);
    var t0 = null;

    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = duration <= 0 ? 1 : Math.min(1, (ts - t0) / duration);
      g.activePaths[key].progress = p;
      redraw();
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        g.revealed[startCol] = true;
        revealResultChip(built.endCol, color);
        var playerChip = els.playersRow.children[startCol];
        if (playerChip) playerChip.classList.add('revealed');
        g.busy = false;
        checkAllRevealed();
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(frame);
  }

  // 만들기 버튼으로 만든 사다리는 만들 때, 공유 링크·다시 만들기로 받은 사다리는 처음 탭/모두 공개할 때 start
  function markStarted() {
    var g = state.game;
    if (!g || g.started) return;
    g.started = true;
    try { window.track && window.track('start'); } catch (e) {}
  }

  function onPlayerTap(i) {
    var g = state.game;
    if (!g || g.busy) return;
    markStarted();
    try { window.track && window.track('ladder_tap', { i: i }); } catch (e) {}
    animatePlayer(i);
  }

  function revealAll() {
    var g = state.game;
    if (!g || g.busy) return;
    markStarted();
    try { window.track && window.track('ladder_reveal_all'); } catch (e) {}
    var order = [];
    for (var i = 0; i < g.n; i++) if (!g.revealed[i]) order.push(i);
    if (!order.length) { showResultsTable(); return; }

    var idx = 0;
    function next() {
      if (idx >= order.length) return;
      var col = order[idx];
      idx++;
      animatePlayer(col, function () {
        if (idx < order.length) next();
      });
    }
    next();
  }

  function checkAllRevealed() {
    var g = state.game;
    if (g.revealed.every(function (v) { return v; })) {
      if (!g.doneSent) {
        g.doneSent = true;
        markStarted();
        try { window.track && window.track('done'); } catch (e) {}
      }
      showResultsTable();
    }
  }

  function showResultsTable() {
    var g = state.game;
    els.resultsTable.innerHTML = '';
    for (var i = 0; i < g.n; i++) {
      var tr = document.createElement('tr');
      var tdName = document.createElement('td');
      var dot = document.createElement('span');
      dot.className = 'ldr-results-dot';
      dot.style.background = g.colors[i];
      tdName.appendChild(dot);
      tdName.appendChild(document.createTextNode(g.names[i]));

      var tdResult = document.createElement('td');
      tdResult.textContent = g.results[g.mapping[i]];

      tr.appendChild(tdName);
      tr.appendChild(tdResult);
      els.resultsTable.appendChild(tr);
    }
    els.resultsSection.classList.add('show');
  }

  // ---------------------------------------------------------------
  // 사다리 생성 / 공유 URL
  // ---------------------------------------------------------------
  function currentShareUrl() {
    var g = state.game;
    var payload = { n: g.names, r: g.results, s: g.seed, rows: g.rows, v: 1 };
    var hash = 'd=' + encodeShareData(payload);
    return window.location.href.split('#')[0] + '#' + hash;
  }

  function updateHash() {
    var g = state.game;
    var payload = { n: g.names, r: g.results, s: g.seed, rows: g.rows, v: 1 };
    var hash = '#d=' + encodeShareData(payload);
    try { window.history.replaceState(null, '', hash); } catch (e) { window.location.hash = hash; }
  }

  function buildLadder(opts) {
    var names = opts.names.slice();
    var results = opts.results.slice();
    var n = names.length;
    var rows = opts.rows || rowsForN(n);
    var seed = (opts.seed == null) ? randomSeed() : opts.seed;
    var rand = mulberry32(seed);
    var rungs = generateRungs(n, rows, rand);
    var mapping = computeMapping(n, rows, rungs);
    var colors = [];
    for (var i = 0; i < n; i++) colors.push(PLAYER_COLORS[i % PLAYER_COLORS.length]);

    state.game = {
      n: n, names: names, results: results, seed: seed, rows: rows,
      rungs: rungs, mapping: mapping, colors: colors,
      revealed: new Array(n).fill(false),
      activePaths: {}, busy: false, geom: null, ctx: null,
      started: false, doneSent: false, // 사다리 하나마다 track('start')·track('done') 한 번씩
    };
    if (opts.start) markStarted();

    els.resultsSection.classList.remove('show');
    renderPlayRows();
    layoutBoard();
    redraw();
    showScreen('play');
    updateHash();

    state.setup.count = n;
    state.setup.names = names.slice();
    state.setup.results = results.slice();
    saveLastSetup();
  }

  function rebuildRungsOnly() {
    var g = state.game;
    if (!g || g.busy) return;
    try { window.track && window.track('ladder_rebuild'); } catch (e) {}
    buildLadder({ names: g.names, results: g.results, seed: randomSeed() });
  }

  // ---------------------------------------------------------------
  // 이벤트 바인딩
  // ---------------------------------------------------------------
  els.countMinus.addEventListener('click', function () { changeCount(-1); });
  els.countPlus.addEventListener('click', function () { changeCount(1); });
  els.shuffleBtn.addEventListener('click', shuffleResults);
  els.presetRow.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.ldr-preset-btn');
    if (!btn) return;
    applyPreset(btn.getAttribute('data-preset'));
  });

  els.buildBtn.addEventListener('click', function () {
    try { window.track && window.track('ladder_build'); } catch (e) {}
    buildLadder({ names: state.setup.names, results: state.setup.results, start: true });
  });

  els.editBtn.addEventListener('click', function () {
    var g = state.game;
    if (g) {
      state.setup.count = g.n;
      state.setup.names = g.names.slice();
      state.setup.results = g.results.slice();
      renderSetup();
    }
    showScreen('setup');
  });

  els.rebuildBtn.addEventListener('click', rebuildRungsOnly);
  els.revealAllBtn.addEventListener('click', revealAll);

  // 공통 끝 화면(data-mg-end)이 쓰는 공유 데이터 / 다시 하기 액션 등록
  window.setShareData && window.setShareData(function () {
    if (!state.game) return null;
    return { title: UI.shareTitle, text: UI.shareText, url: currentShareUrl() };
  });
  window.setRetry && window.setRetry({ label: UI.retryLabel, action: rebuildRungsOnly });

  window.addEventListener('resize', function () {
    if (!state.game) return;
    layoutBoard();
    redraw();
  });

  // ---------------------------------------------------------------
  // 초기화: 공유 링크(#d=...) 우선, 없으면 로컬 저장값 → 기본값
  // ---------------------------------------------------------------
  function initFromHash() {
    var hash = window.location.hash || '';
    var m = /^#d=(.+)$/.exec(hash);
    if (!m) return false;
    try {
      var payload = decodeShareData(decodeURIComponent(m[1]));
      if (!payload || !Array.isArray(payload.n) || !Array.isArray(payload.r)) return false;
      var n = payload.n.length;
      if (n < MIN_N || n > MAX_N || payload.r.length !== n) return false;
      buildLadder({ names: payload.n, results: payload.r, seed: payload.s, rows: payload.rows });
      return true;
    } catch (e) {
      return false;
    }
  }

  function initSetupDefaults() {
    var saved = loadLastSetup();
    if (saved) {
      state.setup.count = clamp(saved.names.length, MIN_N, MAX_N);
      state.setup.names = saved.names.slice(0, state.setup.count);
      state.setup.results = saved.results.slice(0, state.setup.count);
    } else {
      state.setup.count = 4;
      state.setup.names = defaultNames(4);
      state.setup.results = defaultResults(4);
    }
    renderSetup();
    showScreen('setup');
  }

  if (!initFromHash()) {
    initSetupDefaults();
  }
})();
