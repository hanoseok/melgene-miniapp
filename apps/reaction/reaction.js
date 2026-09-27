/* apps/reaction/reaction.js — 반응속도 테스트 화면 로직
 * 흐름: 대기 화면(idle) --탭--> [빨강 wait --(1.5~4.5초 암호 난수)--> 초록 go --탭--> 기록 hit] × 5 --> 결과
 *   - wait 중 탭 / go 뒤 100ms 안의 탭 = 부정 출발(foul) → 같은 라운드 다시
 *   - wait·go 중 화면을 벗어나면(visibilitychange) 그 라운드는 버리고 다시(abort)
 *   - 초록 뒤 2초가 넘어서 누르면 반응이 아니므로 기록하지 않고 다시(abort, kind 'slow')
 * 시간 측정: 초록을 칠한 다음 프레임 시각(= 화면에 초록이 올라간 때에 가장 가까운 값, 프레임이 밀리면
 *   칠한 시각)부터 pointerdown/keydown 이벤트의 timeStamp(없으면 performance.now())까지.
 * 타이밍이 중요한 입력(wait·go)은 pointerdown 으로, 나머지 "다음으로" 입력은 click 으로 받는다
 *   → 터치 뒤에 따라오는 합성 click 이 다음 화면의 버튼을 누르지 않는다.
 * 문자열은 페이지에 인라인된 window.PAGE_I18N (tools/i18n/<lang>.js 의 ui).
 */
(function () {
  'use strict';

  var C = window.REACTION_CORE;
  var UI = window.PAGE_I18N || {};
  var GAME = 'reaction';
  var LANG = window.PAGE_LANG || document.documentElement.lang || undefined; // 숫자 표기용 (없으면 브라우저 기본)
  var ROUNDS = C.ROUNDS;
  // 차트에 그리는 구간 (15 = 150ms, 60 = 600ms). 바깥 기록은 양 끝 칸에 모인다.
  var CHART_LO = 15;
  var CHART_HI = 60;

  function fmt(tpl, vars) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  function num(n) { try { return Number(n).toLocaleString(LANG); } catch (e) { return String(n); } }
  function $(id) { return document.getElementById(id); }
  function now() { return window.performance && performance.now ? performance.now() : Date.now(); }

  var el = {
    arena: $('arena'), start: $('start-btn'), quit: $('quit-btn'), round: $('hud-round'),
    sigTitle: $('sig-title'), sigNum: $('sig-num'), sigMs: $('sig-ms'), sigEmoji: $('sig-emoji'),
    sigSub: $('sig-sub'), sigAct: $('sig-act'), sigKey: $('sig-key'), laps: $('laps'),
    result: $('result'), resAvg: $('res-avg'), resEmoji: $('res-emoji'), resTier: $('res-tier'),
    resTierDesc: $('res-tier-desc'), resLaps: $('res-laps'), resMeta: $('res-meta'),
    resRank: $('res-rank'), resComparing: $('res-comparing'), resRankBody: $('res-rank-body'),
    resTop: $('res-top'), resBeat: $('res-beat'), resChart: $('res-chart'), resReadout: $('res-readout'),
    resNote: $('res-note')
  };
  if (!el.arena || !C) return;

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }

  // ---------------------------------------------------------------
  // 상태
  // ---------------------------------------------------------------
  var runSeq = 0;
  function newRun() {
    runSeq++;
    return { id: runSeq, times: [], fouls: 0, started: false, tracked: false, submitted: false, summary: null, pct: null, hist: null, bucket: null };
  }
  var run = newRun();
  var phase = 'idle';
  var seq = 0; // 단계가 바뀔 때마다 +1
  var live = false; // 측정 중(화면 전체)
  var waitTimer = null;
  var goT1 = 0; // 초록을 칠한 프레임의 rAF 시각
  var goT0 = 0; // 그다음 프레임의 rAF 시각 (초록이 화면에 보인 시각에 가장 가깝다)
  var downSeq = -1; // 마지막 pointerdown 이 일어난 단계. click 은 같은 단계에서 시작된 것만 받는다
  var guardUntil = 0; // 기록/부정 출발 직후 연타로 다음 라운드가 바로 시작되지 않게

  function clearWait() {
    if (waitTimer) { clearTimeout(waitTimer); waitTimer = null; }
  }

  function setPhase(p, opts) {
    phase = p;
    seq++;
    el.arena.setAttribute('data-phase', p);
    renderSignal(p, opts || {});
    renderHud();
    renderLaps();
  }

  // ---------------------------------------------------------------
  // 화면 그리기
  // ---------------------------------------------------------------
  function renderSignal(p, o) {
    var title = '', sub = '', act = '', ms = null;
    if (p === 'ready') { title = UI.readyTitle; sub = UI.readySub; }
    else if (p === 'wait') { title = UI.waitTitle; sub = UI.waitSub; }
    else if (p === 'go') { title = UI.goTitle; }
    else if (p === 'hit') { ms = o.ms; act = run.times.length >= ROUNDS ? UI.hitLast : UI.hitNext; }
    else if (p === 'foul') { title = UI.foulTitle; sub = o.kind === 'guess' ? UI.foulGuess : UI.foulEarly; act = UI.foulRetry; }
    else if (p === 'abort') {
      title = o.kind === 'slow' ? UI.slowTitle : UI.abortTitle;
      sub = o.kind === 'slow' ? UI.slowSub : UI.abortSub;
      act = UI.abortRetry;
    }

    el.sigTitle.textContent = title || '';
    el.sigSub.textContent = sub || '';
    el.sigAct.textContent = act || '';
    if (ms != null) {
      el.sigMs.textContent = String(ms);
      el.sigEmoji.textContent = C.TIERS[C.tierIndex(ms)].emoji;
      el.sigNum.hidden = false;
    } else {
      el.sigNum.hidden = true;
    }
    // 키보드 안내는 "다음으로" 단계에서만 (신호를 기다릴 때는 화면을 비운다)
    if (el.sigKey) el.sigKey.hidden = !(p === 'ready' || p === 'hit' || p === 'foul' || p === 'abort');
  }

  function renderHud() {
    var n = Math.min(ROUNDS, run.times.length + (phase === 'hit' ? 0 : 1));
    el.round.textContent = fmt(UI.round, { n: Math.max(1, n), total: ROUNDS });
  }

  function renderLaps() {
    var items = el.laps.children;
    var cur = live && phase !== 'hit' && run.times.length < ROUNDS ? run.times.length : -1;
    for (var i = 0; i < items.length; i++) {
      var li = items[i];
      var done = i < run.times.length;
      li.classList.toggle('is-done', done);
      li.classList.toggle('is-current', i === cur);
      var msEl = li.querySelector('.rx-lap-ms');
      var txt = done ? String(run.times[i]) : '–';
      if (msEl.textContent !== txt) msEl.textContent = txt;
      li.setAttribute('aria-label', done ? fmt(UI.lapAria, { n: i + 1, ms: run.times[i] }) : fmt(UI.lapEmpty, { n: i + 1 }));
    }
  }

  // ---------------------------------------------------------------
  // 진행
  // ---------------------------------------------------------------
  // "탭!" 은 언어마다 길이가 달라서 화면 폭에 맞는 크기를 미리 정해 둔다
  // (초록이 켜지는 순간에는 아무 계산도 하지 않도록 측정 전에 끝낸다)
  function fitGoTitle() {
    try {
      var cs = getComputedStyle(el.sigTitle);
      var probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;line-height:1;font-size:100px;' +
        'font-family:' + cs.fontFamily + ';font-weight:' + cs.fontWeight + ';font-stretch:' + cs.fontStretch + ';';
      probe.textContent = UI.goTitle || '';
      document.body.appendChild(probe);
      var w = probe.getBoundingClientRect().width || 100;
      document.body.removeChild(probe);
      // 측정 화면 폭 = 모바일 한 줄(--app-width) 또는 폰 화면 전체 중 작은 쪽
      var col = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-width')) || 480;
      var avail = (Math.min(window.innerWidth, col) - 48) * 0.9;
      var size = Math.max(56, Math.min(240, (100 * avail) / w, window.innerHeight * 0.34));
      el.arena.style.setProperty('--go-size', Math.round(size) + 'px');
    } catch (e) { /* 기본 크기(CSS) 사용 */ }
  }

  function enterLive() {
    fitGoTitle();
    live = true;
    document.body.classList.add('rx-live');
    try { el.arena.focus({ preventScroll: true }); } catch (e) { try { el.arena.focus(); } catch (e2) { /* noop */ } }
  }
  function exitLive() {
    live = false;
    document.body.classList.remove('rx-live');
  }

  function begin() {
    run = newRun();
    enterLive();
    startWait();
  }

  function startWait() {
    clearWait();
    // 한 판(run)의 첫 라운드가 시작될 때 track('start') 한 번 (부정 출발·다시 시도는 같은 판)
    if (!run.started) {
      run.started = true;
      try { window.track && window.track('start'); } catch (e) { /* noop */ }
    }
    setPhase('wait');
    var mySeq = seq;
    waitTimer = setTimeout(function () {
      waitTimer = null;
      if (phase !== 'wait' || seq !== mySeq) return;
      if (document.hidden) { abortRound(); return; } // 가려진 화면에서는 프레임이 돌지 않는다 → 멈추지 말고 다시
      requestAnimationFrame(function () {
        if (phase !== 'wait' || seq !== mySeq) return;
        goT0 = 0;
        setPhase('go');
        goT1 = now(); // 초록을 칠한 직후 (rAF 인자 시각은 콜백보다 앞설 수 있어 쓰지 않는다)
        var goSeq = seq;
        requestAnimationFrame(function () {
          if (phase === 'go' && seq === goSeq && !goT0) goT0 = now();
        });
      });
    }, C.randomDelay());
  }

  // 타이밍 입력. 처리했으면 true.
  function press(t) {
    if (phase === 'wait') { foul('early'); return true; }
    if (phase === 'go') { react(t); return true; }
    return false;
  }

  // 초록이 화면에 보인 시각의 추정치. 다음 프레임이 제때(≤34ms, 60Hz 두 프레임) 오면 그 시각,
  // 프레임이 밀린 기기(버벅임·절전)에서는 칠한 시각 — 늦게 온 프레임 시각을 쓰면 기록이 실제보다 빠르게 나온다.
  function goStart() {
    return goT0 && goT0 - goT1 <= 34 ? goT0 : goT1;
  }

  function react(t) {
    var ms = t - goStart();
    if (ms < 0) { foul('early'); return; }
    if (ms < C.ANTICIPATION_MS) { foul('guess'); return; }
    if (ms > C.MISS_MS) { missed(); return; }
    ms = Math.round(ms);
    run.times.push(ms);
    guardUntil = now() + 250;
    setPhase('hit', { ms: ms });
  }

  function foul(kind) {
    clearWait();
    run.fouls++;
    guardUntil = now() + 450;
    setPhase('foul', { kind: kind });
    try { window.track && window.track('reaction_foul'); } catch (e) { /* noop */ }
  }

  // 초록 뒤 2초가 넘도록 안 누름 → 기록하지 않고 같은 라운드 다시
  function missed() {
    clearWait();
    guardUntil = now() + 300;
    setPhase('abort', { kind: 'slow' });
  }

  function abortRound() {
    if (!live || (phase !== 'wait' && phase !== 'go')) return;
    clearWait();
    setPhase('abort');
  }

  // "다음으로": 준비/기록/부정 출발/중단 화면에서
  function advance() {
    if (now() < guardUntil) return;
    if (phase === 'hit' && run.times.length >= ROUNDS) { finish(); return; }
    if (phase === 'ready' || phase === 'hit' || phase === 'foul' || phase === 'abort') startWait();
  }

  function quit() {
    clearWait();
    exitLive();
    run = newRun();
    setPhase('idle');
    try { el.start.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------
  // 입력
  // ---------------------------------------------------------------
  function eventTime(e) {
    var n = now();
    var ts = e && e.timeStamp;
    // 이벤트 timeStamp 는 performance.now() 와 같은 기준(고해상도)이어야 쓴다
    if (typeof ts === 'number' && ts > 0 && ts <= n + 1 && n - ts < 1000) return ts;
    return n;
  }
  function noTap(e) { return !!(e.target && e.target.closest && e.target.closest('[data-no-tap]')); }

  el.arena.addEventListener('pointerdown', function (e) {
    if (!live || noTap(e)) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.isPrimary === false) return;
    e.preventDefault();
    var t = eventTime(e);
    downSeq = seq;
    if (press(t)) downSeq = -1; // 이 누름에 이어지는 click 은 무시
  });

  el.arena.addEventListener('click', function (e) {
    if (noTap(e)) return;
    if (!live) { if (phase === 'idle') begin(); return; }
    if (downSeq !== seq) return;
    downSeq = -1;
    advance();
  });

  el.quit.addEventListener('click', function (e) { e.stopPropagation(); quit(); });

  document.addEventListener('keydown', function (e) {
    if (!live) return;
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); quit(); return; }
    var isSpace = e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space';
    if (!isSpace && e.key !== 'Enter') return;
    if (e.key === 'Enter' && document.activeElement === el.quit) return; // 그만하기 버튼
    e.preventDefault();
    if (e.repeat) return;
    if (!press(eventTime(e))) advance();
  });

  ['contextmenu', 'selectstart', 'dragstart'].forEach(function (type) {
    el.arena.addEventListener(type, function (e) { e.preventDefault(); });
  });

  document.addEventListener('visibilitychange', function () { if (document.hidden) abortRound(); });
  window.addEventListener('pagehide', abortRound);

  // ---------------------------------------------------------------
  // 결과
  // ---------------------------------------------------------------
  function finish() {
    clearWait();
    exitLive();
    setPhase('done');
    var s = C.summarize(run.times);
    run.summary = s;
    run.bucket = C.toBucket(s.avg);
    if (!run.tracked) {
      run.tracked = true;
      try { window.track && window.track('done'); } catch (e) { /* noop */ }
    }
    showResult(s);
    submit(s);
  }

  function countUp(node, to) {
    if (reduceMotion) { node.textContent = String(to); return; }
    var t0 = now();
    var dur = 700;
    function step() {
      var k = Math.min(1, (now() - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      node.textContent = String(Math.round(to * eased));
      if (k < 1) requestAnimationFrame(step);
    }
    step();
  }

  function showResult(s) {
    var avg = Math.round(s.avg);
    var idx = C.tierIndex(s.avg);
    var tierText = (UI.tiers && UI.tiers[idx]) || { title: '', desc: '' };

    el.arena.hidden = true;
    el.result.hidden = false;
    el.result.classList.remove('is-revealing');
    void el.result.offsetWidth; // 애니메이션 다시 시작
    el.result.classList.add('is-revealing');

    countUp(el.resAvg, avg);
    el.resEmoji.textContent = C.TIERS[idx].emoji;
    el.resTier.textContent = tierText.title;
    el.resTierDesc.textContent = tierText.desc;

    // 라운드별 막대
    el.resLaps.innerHTML = '';
    var max = Math.max.apply(null, run.times.concat([1]));
    var bestI = run.times.indexOf(Math.min.apply(null, run.times));
    run.times.forEach(function (ms, i) {
      var li = document.createElement('li');
      li.className = 'rx-lapbar' + (i === bestI ? ' is-best' : '');
      li.setAttribute('aria-label', fmt(UI.lapAria, { n: i + 1, ms: ms }));
      var n = document.createElement('span');
      n.className = 'rx-lapbar-n';
      n.textContent = String(i + 1);
      var track = document.createElement('span');
      track.className = 'rx-lapbar-track';
      var fill = document.createElement('span');
      var pct = Math.max(6, (ms / max) * 100);
      fill.className = 'rx-lapbar-fill';
      fill.style.width = pct.toFixed(1) + '%';
      track.appendChild(fill);
      if (i === bestI) {
        var tag = document.createElement('span');
        tag.className = 'rx-lapbar-tag' + (pct > 72 ? ' is-inside' : '');
        tag.style.left = pct.toFixed(1) + '%';
        tag.textContent = UI.best;
        track.appendChild(tag);
      }
      var v = document.createElement('span');
      v.className = 'rx-lapbar-ms';
      v.textContent = fmt(UI.msValue, { ms: ms });
      li.appendChild(n);
      li.appendChild(track);
      li.appendChild(v);
      el.resLaps.appendChild(li);
    });

    el.resMeta.innerHTML = '';
    var metaParts = [fmt(UI.bestLine, { ms: Math.round(s.best) })];
    if (run.fouls > 0) metaParts.push(fmt(UI.foulsLine, { n: run.fouls }));
    metaParts.forEach(function (txt) {
      var sp = document.createElement('span');
      sp.textContent = txt;
      el.resMeta.appendChild(sp);
    });

    try { window.scrollTo(0, 0); } catch (e) { /* noop */ }
    el.result.setAttribute('tabindex', '-1');
    try { el.result.focus({ preventScroll: true }); } catch (e) { /* noop */ }
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

  function hideRank() {
    el.resRank.hidden = true;
  }

  // 5라운드를 마칠 때마다 딱 한 번 기록을 보내고, 돌아온 전체 분포로 순위를 계산한다.
  // Supabase 가 없거나 실패하면 순위·차트는 통째로 숨긴다 (가짜 숫자는 보여주지 않는다).
  function submit(s) {
    var supa = window.supa;
    var bucket = run.bucket;
    if (run.submitted || bucket == null || !supa || !supa.enabled || !supa.enabled()) { hideRank(); return; }
    run.submitted = true;
    var myRun = run.id;
    el.resRank.hidden = false;
    el.resComparing.hidden = false;
    el.resRankBody.hidden = true;
    el.resNote.textContent = '';
    withTimeout(supa.submitScore(GAME, bucket), 8000).then(function (rows) {
      if (run.id !== myRun) return;
      var p = C.percentile(rows, bucket);
      if (!p) { hideRank(); return; }
      run.pct = p;
      run.hist = rows;
      renderRank(p, s);
    });
  }

  function renderRank(p, s) {
    el.resComparing.hidden = true;
    if (p.first) {
      el.resRankBody.hidden = true;
      el.resNote.textContent = UI.firstRecord;
      return;
    }
    el.resRankBody.hidden = false;
    el.resTop.textContent = fmt(UI.top, { n: p.top });
    el.resBeat.textContent = p.beatPct >= 100
      ? fmt(UI.beatAll, { others: num(p.others) })
      : fmt(UI.beatLine, { others: num(p.others), pct: p.beatPct });
    el.resNote.textContent = p.others < 30 ? UI.fewPlayers : '';
    drawChart();
  }

  // ---------------------------------------------------------------
  // 분포 차트 (SVG, 단일 계열 → 범례 없음. 내 구간만 노랑 + "나" 표시)
  // ---------------------------------------------------------------
  var SVGNS = 'http://www.w3.org/2000/svg';
  function svgEl(name, attrs) {
    var node = document.createElementNS(SVGNS, name);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function binText(b, players) {
    var n = num(players);
    if (b.edge === 'lo') return fmt(UI.binLo, { to: b.bucket * 10 + 5, n: n });
    if (b.edge === 'hi') return fmt(UI.binHi, { from: b.bucket * 10 - 5, n: n });
    return fmt(UI.binLabel, { from: b.bucket * 10 - 5, to: b.bucket * 10 + 4, n: n });
  }

  function drawChart() {
    var host = el.resChart;
    if (!run.hist || !run.pct || run.pct.first || el.result.hidden) return;
    var bins = C.chartBins(run.hist, CHART_LO, CHART_HI);
    var mine = C.clamp(run.bucket, CHART_LO, CHART_HI) - CHART_LO;
    if (bins[mine].players < 1) bins[mine].players = 1;

    var W = Math.max(260, Math.round(host.clientWidth || 340));
    var H = 168, padTop = 34, padBottom = 24;
    var plotH = H - padTop - padBottom;
    var base = padTop + plotH;
    var n = bins.length;
    var gap = 2;
    var bw = (W - gap * (n - 1)) / n;
    var step = bw + gap;
    var maxP = 1;
    bins.forEach(function (b) { if (b.players > maxP) maxP = b.players; });

    var svg = svgEl('svg', {
      viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
      'aria-label': fmt(UI.chartAria, { total: num(run.pct.total), ms: Math.round(run.summary.avg), n: run.pct.top })
    });

    var bars = [];
    bins.forEach(function (b, i) {
      var h = b.players > 0 ? Math.max(2, (b.players / maxP) * plotH) : 0;
      var x = i * step;
      var y = base - h;
      var fill = i === mine ? '#ffe83a' : i < mine ? 'rgba(242,245,255,0.26)' : 'rgba(242,245,255,0.62)';
      var r = Math.min(2, bw / 2, h);
      var d = h > 0
        ? 'M' + x + ',' + base + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
          'H' + (x + bw - r) + 'Q' + (x + bw) + ',' + y + ' ' + (x + bw) + ',' + (y + r) + 'V' + base + 'Z'
        : '';
      var path = svgEl('path', { d: d, fill: fill });
      bars.push(path);
      svg.appendChild(path);
    });

    // 기준선
    svg.appendChild(svgEl('line', { x1: 0, x2: W, y1: base + 0.5, y2: base + 0.5, stroke: 'rgba(242,245,255,0.3)', 'stroke-width': 1 }));

    // x축 눈금 (200/300/400/500ms) + 마지막 칸은 그 이상을 모두 모은 칸이라 "600+"
    var ticks = [200, 300, 400, 500].map(function (ms, k) {
      return { x: (ms / 10 - CHART_LO) * step + bw / 2, text: k === 0 ? ms + UI.axisUnit : String(ms), anchor: 'middle' };
    });
    ticks.push({ x: W, text: CHART_HI * 10 + '+', anchor: 'end' });
    ticks.forEach(function (tk) {
      var t = svgEl('text', {
        x: tk.x, y: H - 6, 'text-anchor': tk.anchor, fill: 'rgba(242,245,255,0.54)',
        'font-size': 11, 'font-family': 'Archivo, sans-serif', 'font-weight': 600
      });
      t.textContent = tk.text;
      svg.appendChild(t);
    });

    // "나" 표시: 노란 세로선 + 점, 글자는 흰색(글자에는 데이터 색을 쓰지 않는다)
    var mx = mine * step + bw / 2;
    var myTop = base - Math.max(2, (bins[mine].players / maxP) * plotH);
    svg.appendChild(svgEl('line', { x1: mx, x2: mx, y1: 20, y2: myTop - 3, stroke: '#ffe83a', 'stroke-width': 2, 'stroke-linecap': 'round' }));
    svg.appendChild(svgEl('circle', { cx: mx, cy: 20, r: 4, fill: '#ffe83a', stroke: '#0b1c86', 'stroke-width': 2 }));
    var label = svgEl('text', {
      x: mx, y: 11, 'text-anchor': 'middle', fill: '#f2f5ff',
      'font-size': 12, 'font-weight': 800, 'font-family': 'Archivo, sans-serif'
    });
    label.textContent = fmt(UI.chartYou, { you: UI.you, ms: Math.round(run.summary.avg) });
    svg.appendChild(label);

    // 막대 위 호버/탭 → 아래 한 줄에 구간과 인원
    var hit = svgEl('rect', { x: 0, y: 0, width: W, height: H, class: 'bar-hit' });
    svg.appendChild(hit);
    var hover = -1;
    function show(i) {
      if (hover >= 0 && hover !== mine) bars[hover].setAttribute('fill-opacity', '1');
      hover = i;
      if (i >= 0 && i !== mine) bars[i].setAttribute('fill-opacity', '0.55');
      var b = bins[i >= 0 ? i : mine];
      el.resReadout.textContent = binText(b, b.players) + (i < 0 || i === mine ? fmt(UI.youMark, { you: UI.you }) : '');
    }
    function pick(e) {
      var rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      var x = ((e.clientX - rect.left) / rect.width) * W;
      show(C.clamp(Math.floor(x / step), 0, n - 1));
    }
    hit.addEventListener('pointermove', pick);
    hit.addEventListener('pointerdown', pick);
    hit.addEventListener('pointerleave', function () { show(-1); });

    host.innerHTML = '';
    host.appendChild(svg);

    // 라벨이 양 끝에서 잘리지 않게
    try {
      var bb = label.getBBox();
      var half = bb.width / 2 + 2;
      label.setAttribute('x', String(C.clamp(mx, half, W - half)));
    } catch (e) { /* noop */ }
    show(-1);
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { drawChart(); if (phase !== 'go') fitGoTitle(); }, 150);
  });

  // ---------------------------------------------------------------
  // 공유 / 다시 하기: 공통 끝 화면(data-mg-end)에 등록만 한다 (버튼은 공통 컴포넌트가 그린다)
  // ---------------------------------------------------------------
  function shareData() {
    if (!run.summary) return null; // 아직 결과가 없으면 공통 컴포넌트가 페이지 제목/설명으로 대신한다
    var s = run.summary;
    var idx = C.tierIndex(s.avg);
    var tier = (UI.tiers && UI.tiers[idx]) || { title: '' };
    var top = run.pct && !run.pct.first ? fmt(UI.shareTop, { n: run.pct.top }) : '';
    var text = fmt(UI.shareText, { ms: Math.round(s.avg), emoji: C.TIERS[idx].emoji, tier: tier.title, top: top });
    return { title: UI.shareTitle, text: text, url: location.origin + location.pathname };
  }
  window.setShareData && window.setShareData(shareData);

  function playAgain() {
    run = newRun();
    el.result.hidden = true;
    el.resRank.hidden = true;
    el.resChart.innerHTML = '';
    el.resTop.textContent = el.resBeat.textContent = el.resNote.textContent = el.resReadout.textContent = '';
    el.arena.hidden = false;
    enterLive();
    setPhase('ready');
  }
  window.setRetry && window.setRetry(playAgain);

  // ---------------------------------------------------------------
  // 시작
  // ---------------------------------------------------------------
  var year = $('year');
  if (year) year.textContent = String(new Date().getFullYear());
  setPhase('idle');
  fitGoTitle();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGoTitle);

  // 검증 스크립트용 읽기 전용 핸들
  window.REACTION_APP = {
    state: function () {
      return {
        phase: phase, seq: seq, live: live, round: run.times.length, times: run.times.slice(), fouls: run.fouls,
        submitted: run.submitted, started: run.started, tracked: run.tracked, bucket: run.bucket, pct: run.pct, goT0: goT0, goT1: goT1
      };
    }
  };
})();
