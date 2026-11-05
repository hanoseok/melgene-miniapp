/* apps/aim/aim.js — 시작(티징 + 모드 Classic·Timed) → 에임 연습 → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 aim-core.js(AIM_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 가운데 시작 과녁을 맞혀 판이 시작될 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 입력: 플레이 영역의 pointerdown 만 받는다(마우스 왼쪽 버튼·터치·펜). 맞힘 판정은 누른 점과 과녁 중심의 거리로 한다
 *   (지금 보이는 반지름 + 터치는 조금 더 여유). click/mousedown/touchstart 로는 세지 않아 두 번 세어지지 않는다. 키보드는 쓰지 않는다.
 *   영역에서는 확대·글자 선택·길게 눌러 메뉴·더블 탭 확대를 막는다(CSS touch-action:none + 이벤트 기본 동작 막기).
 * 위치는 crypto.getRandomValues 로 고른다(없으면 Math.random).
 * 시간: performance.now() + requestAnimationFrame. 누른 시각은 입력 이벤트의 timeStamp(같은 시간 기준).
 *   끝나면 0.6초 동안 입력을 무시하고(LOCK_MS) 끝 화면으로 간다.
 * 진행 중 탭을 떠나면(visibilitychange hidden) 그 판은 무효 — 안내 후 같은 모드로 다시 준비한다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만(모드별 게임 이름). 서버 없음·실패·다른 기록 없음이면 숨긴다.
 *   사람이 낼 수 없는 값(평균 150ms 미만·Timed 100개 초과)은 보내지도, 최고 기록에 넣지도 않는다(s.valid).
 * prefers-reduced-motion 이면 과녁 등장·맞힘 효과·시작 과녁 깜빡임을 끈다(Timed 의 줄어드는 크기는 규칙이라 그대로).
 * 디버그/검사용 핸들: window.AIM_APP (phase(), state(), simulate(opts), best())
 */
(function () {
  'use strict';

  var C = window.AIM_CORE;
  var UI = window.PAGE_I18N || {};
  var M = UI.modes || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var PREFS_KEY = 'aim_prefs_v1';
  var BEST_KEY = 'aim_best_v1';
  var LOCK_MS = 600;
  var MAX_MARKS = 8;
  var LANG = document.documentElement.lang || 'en';
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    playMode: $('play-mode'), time: $('hud-time'), hits: $('hud-hits'), acc: $('hud-acc'), bar: $('hud-bar'),
    area: $('area'), marks: $('marks'), target: $('target'), areaMain: $('area-main'), areaSub: $('area-sub'), note: $('play-note'), change: $('change-btn'),
    resMode: $('res-mode'), resLabel: $('res-score-label'), resScore: $('res-score'), resUnit: $('res-unit'),
    resAcc: $('res-acc'), resAvg: $('res-avg'), resMisses: $('res-misses'), resTotal: $('res-total'), resEscaped: $('res-escaped'),
    cellAvg: $('cell-avg'), cellMisses: $('cell-misses'), cellTotal: $('cell-total'), cellEscaped: $('cell-escaped'),
    tier: $('res-tier'), newBest: $('res-newbest'), pb: $('res-pb'), invalid: $('res-invalid'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'),
    year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | ready | run | over | end
  var run = null;
  var mode = C.DEFAULT_MODE;
  var raf = 0, endTimer = 0, finishTimer = 0, runSeq = 0;
  var tracked = false, doneSent = false;
  var geo = { w: 0, h: 0, r: 30 };

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function one(n) { return NF1 ? NF1.format(n) : Number(n).toFixed(1); }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function eventTime(e) {
    var n = now();
    var ts = e && typeof e.timeStamp === 'number' ? e.timeStamp : 0;
    return ts > 0 && ts <= n + 1 && n - ts < 1000 ? ts : n;
  }
  // 위치용 난수: crypto 우선
  var rnd = (function () {
    var cr = window.crypto || window.msCrypto;
    if (cr && cr.getRandomValues) {
      var buf = new Uint32Array(1);
      return function () { cr.getRandomValues(buf); return buf[0] / 4294967296; };
    }
    return Math.random;
  })();

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 설정 · 최고 기록 (이 브라우저)
  function loadPrefs() {
    try { mode = C.validMode(JSON.parse(localStorage.getItem(PREFS_KEY) || '{}').mode); } catch (e) { mode = C.DEFAULT_MODE; }
  }
  function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify({ mode: mode })); } catch (e) { /* noop */ } }
  function readBests() { try { var o = JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function getBest(key) {
    var v = Number(readBests()[key]);
    if (!isFinite(v) || v <= 0) return null;
    if (key === C.gameKey('classic')) return v >= C.MIN_AVG_MS ? v : null;
    return v <= C.MAX_TIMED_HITS ? v : null;
  }
  function setBest(key, v) { var o = readBests(); o[key] = v; try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ } }
  function better(m, a, b) { return b == null || (C.lowerBetter(m) ? a < b : a > b); }

  function syncStartForm() {
    var radios = document.querySelectorAll('input[name="mode"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = radios[i].value === mode;
  }
  function readStartForm() {
    var sel = document.querySelector('input[name="mode"]:checked');
    mode = C.validMode(sel ? sel.value : mode);
    savePrefs();
  }

  // ---------------------------------------------------------------- 영역 · 과녁 그리기
  function measure() {
    var rect = els.area.getBoundingClientRect();
    geo.w = rect.width;
    geo.h = rect.height;
    geo.r = Math.max(24, Math.min(36, rect.width * 0.08));
    return rect;
  }
  // 정규화 좌표 → 영역 안 px (가장자리에 붙지 않게 반지름 + 여유)
  function toPx(x, y) {
    var pad = geo.r + 8;
    return { x: pad + x * Math.max(0, geo.w - pad * 2), y: pad + y * Math.max(0, geo.h - pad * 2) };
  }
  var cur = { x: 0, y: 0, r: 0, id: 0 };
  function placeTarget(cx, cy, r, isStart) {
    cur.x = cx; cur.y = cy; cur.r = r;
    var t = els.target;
    t.style.width = t.style.height = (r * 2) + 'px';
    t.style.left = (cx - r) + 'px';
    t.style.top = (cy - r) + 'px';
    t.style.transform = 'scale(1)';
    t.className = 'am-target' + (isStart ? ' is-start' : '');
    t.hidden = false;
    if (!REDUCED && !isStart) { void t.offsetWidth; t.classList.add('spawn'); }
  }
  function drawStartTarget() {
    measure();
    placeTarget(geo.w / 2, geo.h / 2, geo.r * 1.25, true);
    cur.id = 0;
  }
  function drawTarget() {
    if (!run || !run.target) { els.target.hidden = true; return; }
    measure();
    var p = toPx(run.target.x, run.target.y);
    placeTarget(p.x, p.y, geo.r, false);
    cur.id = run.target.id;
  }
  function scaleNow(t) {
    var s = C.scaleAt(run, t);
    els.target.style.transform = 'scale(' + s.toFixed(3) + ')';
    return s;
  }
  function mark(x, y, kind) {
    if (!els.marks) return;
    var d = document.createElement('i');
    d.className = kind;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    while (els.marks.childElementCount >= MAX_MARKS) els.marks.removeChild(els.marks.firstChild);
    els.marks.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, REDUCED ? 300 : 500);
  }
  function clearMarks() { if (els.marks) els.marks.innerHTML = ''; }

  function setArea(state, main, sub) {
    els.area.className = 'am-area is-' + state;
    els.areaMain.textContent = main || '';
    els.areaSub.textContent = sub || '';
    els.areaMain.hidden = !main;
  }
  function renderHud(t) {
    if (!run) return;
    var classic = run.mode === 'classic';
    var secs = classic ? C.elapsed(run, t) : C.remaining(run, t);
    els.time.textContent = one(classic ? Math.floor(secs / 100) / 10 : Math.ceil(secs / 100) / 10);
    els.hits.textContent = classic ? num(run.hits) + '/' + num(C.CLASSIC_TARGETS) : num(run.hits);
    var clicks = run.hits + run.misses;
    els.acc.textContent = clicks ? num(C.accuracy(run.hits, run.misses)) + '%' : '–';
    var frac = classic ? run.hits / C.CLASSIC_TARGETS : (run.startAt == null ? 1 : secs / C.TIMED_MS);
    els.bar.style.width = (Math.max(0, Math.min(1, frac)) * 100).toFixed(2) + '%';
  }

  function stopTimers() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (endTimer) { clearTimeout(endTimer); endTimer = 0; }
    if (finishTimer) { clearTimeout(finishTimer); finishTimer = 0; }
  }

  // ---------------------------------------------------------------- 판 준비 · 진행 · 끝
  function newRun(note) {
    stopTimers();
    runSeq++;
    run = C.newRun(mode);
    tracked = false;
    doneSent = false;
    phase = 'ready';
    els.playMode.textContent = M[run.mode] || '';
    els.note.hidden = !note;
    els.note.textContent = note || '';
    els.change.hidden = false;
    clearMarks();
    setArea('ready', P.ready, P.readySub);
    show('play');
    drawStartTarget();
    renderHud(now());
  }

  function loop() {
    raf = 0;
    if (phase !== 'run') return;
    var t = now();
    var res = C.tick(run, t, rnd);
    if (res === 'over' || run.over) { endRun(); return; }
    if (res === 'escape') {
      // 놓친 과녁 자리에 표시하고 새 과녁
      mark(cur.x, cur.y, 'esc');
      drawTarget();
    }
    if (run.mode === 'timed') scaleNow(t);
    renderHud(t);
    raf = requestAnimationFrame(loop);
  }

  function begin(t) {
    phase = 'run';
    els.note.hidden = true;
    els.change.hidden = true;
    setArea('run', '', '');
    drawTarget();
    if (!tracked) { tracked = true; track('start'); }
    if (run.mode === 'timed') {
      var seq = runSeq;
      endTimer = setTimeout(function () { endTimer = 0; if (seq === runSeq && phase === 'run') { C.tick(run, now(), rnd); if (run.over) endRun(); } }, C.TIMED_MS + 40);
    }
    if (!raf) raf = requestAnimationFrame(loop);
    renderHud(t);
  }

  function endRun() {
    if (phase !== 'run') return;
    stopTimers();
    phase = 'over';
    els.target.hidden = true;
    setArea('over', run.mode === 'classic' ? P.done : P.timeUp, '');
    renderHud(run.endAt != null ? run.endAt : now());
    var seq = runSeq;
    finishTimer = setTimeout(function () { finishTimer = 0; if (seq === runSeq) finish(); }, LOCK_MS);
  }

  function onPointerDown(e) {
    if (e.button != null && e.button > 0) return; // 오른쪽·가운데 버튼은 무시
    if (e.cancelable) e.preventDefault();
    if (phase !== 'ready' && phase !== 'run') return;
    var t = eventTime(e);
    var rect = els.area.getBoundingClientRect();
    var x = e.clientX - rect.left, y = e.clientY - rect.top;
    var tol = e.pointerType === 'touch' ? 8 : 2;
    var scale = phase === 'run' && run.mode === 'timed' ? C.scaleAt(run, t) : 1;
    var dx = x - cur.x, dy = y - cur.y;
    var inside = Math.sqrt(dx * dx + dy * dy) <= cur.r * scale + tol;

    if (phase === 'ready') {
      if (!inside) return; // 시작 전 빗나감은 세지 않음
      if (C.start(run, t, rnd)) begin(t);
      return;
    }
    // run
    if (run.mode === 'timed') {
      // 이미 수명이 끝난 과녁(화면 갱신 전)은 먼저 정리
      var res0 = C.tick(run, t, rnd);
      if (res0 === 'over' || run.over) { endRun(); return; }
      if (res0 === 'escape') { mark(cur.x, cur.y, 'esc'); drawTarget(); inside = false; }
    }
    if (inside && run.target && run.target.id === cur.id) {
      var res = C.hit(run, t, rnd);
      if (res) {
        if (!REDUCED) mark(cur.x, cur.y, 'hit');
        if (res === 'done') { endRun(); return; }
        drawTarget();
      } else if (run.over) { endRun(); return; }
    } else {
      if (C.miss(run, t)) mark(x, y, 'miss');
      else if (run.over) { endRun(); return; }
    }
    renderHud(now());
  }

  function cancelRun() {
    if (phase !== 'run') return;
    newRun(P.cancelled);
  }

  els.area.addEventListener('pointerdown', onPointerDown);
  ['contextmenu', 'dblclick', 'selectstart', 'dragstart', 'gesturestart'].forEach(function (ev) {
    els.area.addEventListener(ev, function (e) { if (e.cancelable) e.preventDefault(); });
  });
  // iOS: 영역에서의 터치 스크롤·두 손가락 확대 막기 (touch-action 보조)
  els.area.addEventListener('touchstart', function (e) { if (e.cancelable && phase !== 'start') e.preventDefault(); }, { passive: false });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) return;
    if (phase === 'run') cancelRun();                       // 진행 중 → 무효
    else if (phase === 'over') { stopTimers(); finish(); }  // 이미 끝난 판(잠금 중) → 결과 그대로
  });
  window.addEventListener('resize', function () {
    if (phase === 'ready') drawStartTarget();
    else if (phase === 'run') drawTarget();
  });

  els.change.addEventListener('click', function () {
    if (phase === 'run' || phase === 'over') return;
    stopTimers();
    phase = 'start';
    syncStartForm();
    show('start');
  });

  function finish() {
    if (!run || !run.over || phase === 'end') return;
    phase = 'end';
    var mySeq = runSeq;
    var s = C.summary(run);
    if (!s) return;
    var classic = s.mode === 'classic';
    var key = C.gameKey(s.mode);
    var prev = getBest(key);
    var isNew = s.valid && better(s.mode, s.score, prev);
    if (isNew) setBest(key, s.score);
    var best = getBest(key);
    els.resMode.textContent = M[s.mode] || '';
    els.resLabel.textContent = classic ? R.scoreClassic : R.scoreTimed;
    els.resScore.textContent = num(s.score);
    els.resUnit.textContent = classic ? R.unitMs : R.unitHits;
    els.resAcc.textContent = num(s.acc) + '%';
    els.resAvg.textContent = fmt(R.msValue, { n: num(s.avg) });
    els.resMisses.textContent = num(s.misses);
    els.resTotal.textContent = fmt(R.secValue, { n: one(s.total / 1000) });
    els.resEscaped.textContent = num(s.escaped);
    els.cellAvg.hidden = classic;
    els.cellEscaped.hidden = classic;
    els.cellMisses.hidden = !classic;
    els.cellTotal.hidden = !classic;
    els.tier.textContent = (R.tiers || [])[s.tier] || '';
    els.newBest.hidden = !(isNew && prev != null);
    els.pb.textContent = best != null ? fmt(classic ? R.pbClassic : R.pbTimed, { n: num(best) }) : '';
    els.pb.hidden = best == null || (isNew && prev != null);
    els.invalid.hidden = s.valid;
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(run, s, mySeq);
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

  // 한 판에 한 번 점수 구간을 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음·유효하지 않음 → 통째로 숨김.
  function submitScore(r, s, mySeq) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!s.valid || !supa || !supa.enabled || !supa.enabled() || r.submitted) return;
    r.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(r.mode, s.score);
    withTimeout(supa.submitScore(C.gameKey(r.mode), b), 8000).then(function (rows) {
      if (mySeq !== runSeq || run !== r) return;
      var p = C.percentile(rows, b, r.mode);
      if (!p || p.first) { els.rank.hidden = true; return; }
      els.comparing.hidden = true;
      els.rankBody.hidden = false;
      els.top.textContent = fmt(R.top, { n: p.top });
      els.beat.textContent = p.beatPct >= 100 ? R.beatAll : fmt(R.beat, { pct: p.beatPct });
      els.others.textContent = fmt(R.others, { n: num(p.others) });
    });
  }

  els.startBtn.addEventListener('click', function () {
    readStartForm();
    newRun();
  });

  if (window.setShareData) {
    window.setShareData(function () {
      var s = run && run.over ? C.summary(run) : null;
      var text = R.shareTitle;
      if (s) {
        var vars = { avg: num(s.avg), hits: num(s.hits), acc: num(s.acc), tier: (R.tiers || [])[s.tier] || '' };
        text = fmt(s.mode === 'classic' ? R.shareClassic : R.shareTimed, vars);
      }
      return { title: R.shareTitle, text: text, url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0] };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: function () { newRun(); } });

  window.AIM_APP = {
    phase: function () { return phase; },
    state: function () {
      return { phase: phase, mode: mode, hits: run ? run.hits : 0, misses: run ? run.misses : 0, escaped: run ? run.escaped : 0,
        over: !!(run && run.over), target: run && run.target ? { x: cur.x, y: cur.y, r: cur.r } : (phase === 'ready' ? { x: cur.x, y: cur.y, r: cur.r } : null),
        hud: { time: els.time.textContent, hits: els.hits.textContent, acc: els.acc.textContent } };
    },
    // 검사용: 준비 상태에서 한 판을 바로 끝낸다(잠금 없이 끝 화면까지). opts = { hits, misses, ms }
    simulate: function (opts) {
      opts = opts || {};
      if (phase !== 'ready') newRun();
      var ms = Math.max(1, Number(opts.ms) || 450);
      var hits = run.mode === 'classic' ? C.CLASSIC_TARGETS : Math.max(0, Math.floor(Number(opts.hits) || 40));
      var t = now() - (run.mode === 'classic' ? hits * ms : C.TIMED_MS) - 10;
      C.start(run, t, rnd);
      begin(t);
      for (var i = 0; i < (Number(opts.misses) || 0); i++) C.miss(run, t + 1);
      for (var j = 0; j < hits && !run.over; j++) { t += ms; C.hit(run, t, rnd); }
      if (!run.over) { run.over = true; run.endAt = run.startAt + C.TIMED_MS; run.target = null; }
      endRun();
      if (finishTimer) { clearTimeout(finishTimer); finishTimer = 0; }
      finish();
      return C.summary(run);
    },
    best: function (key) { return getBest(key || C.gameKey(mode)); }
  };

  loadPrefs();
  syncStartForm();
  show('start');
})();
