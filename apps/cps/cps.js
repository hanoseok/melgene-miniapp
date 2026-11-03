/* apps/cps/cps.js — 시작(티징 + 모드 1·5·10초) → 클릭 속도 테스트 → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 cps-core.js(CPS_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 클릭 영역을 처음 눌러 시계가 시작될 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 입력: 클릭 영역의 pointerdown 만 센다(마우스 왼쪽 버튼·터치·펜, 멀티 터치는 손가락마다 1회).
 *   click/mousedown/touchstart 는 듣지 않으므로 터치 + 호환 마우스 이벤트가 두 번 세어지지 않는다.
 *   키보드(Space/Enter)는 세지 않는다 — 키를 누르고 있으면 자동 반복으로 클릭이 쏟아지므로(공정성). FAQ 에 적어 둔다.
 *   영역에서는 확대·글자 선택·길게 눌러 메뉴·더블 탭 확대를 막는다(CSS touch-action:none + 이벤트 기본 동작 막기).
 * 시간: performance.now() + requestAnimationFrame. 클릭 시각은 입력 이벤트의 timeStamp(같은 시간 기준)로 잰다.
 *   시간이 끝나면 0.6초 동안 영역 입력을 무시하고(LOCK_MS — 마지막 연타가 다음 판을 바로 시작하지 않게) 끝 화면으로 간다.
 * 진행 중 탭을 떠나면(visibilitychange hidden) 그 판은 무효 — 안내 후 같은 모드로 다시 준비한다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만(모드별 게임 이름). 서버 없음·실패·다른 기록 없음이면 숨긴다.
 *   25 CPS 를 넘는 결과(사람이 낼 수 없음)는 보내지도, 최고 기록에 넣지도 않는다.
 * prefers-reduced-motion 이면 클릭 물결·숫자 튀기 애니메이션을 끈다.
 * 디버그/검사용 핸들: window.CPS_APP (phase(), state(), simulate(clicks), best())
 */
(function () {
  'use strict';

  var C = window.CPS_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var PREFS_KEY = 'cps_prefs_v1';
  var BEST_KEY = 'cps_best_v1';
  var LOCK_MS = 600;     // 시간이 끝난 뒤 입력을 무시하는 시간
  var MAX_RIPPLES = 18;
  var LANG = document.documentElement.lang || 'en';
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    playMode: $('play-mode'), time: $('hud-time'), clicks: $('hud-clicks'), cps: $('hud-cps'), bar: $('hud-bar'),
    zone: $('zone'), ripples: $('ripples'), zoneMain: $('zone-main'), zoneSub: $('zone-sub'), note: $('play-note'), change: $('change-btn'),
    resMode: $('res-mode'), resCps: $('res-cps'), resClicks: $('res-clicks'), resTime: $('res-time'), tier: $('res-tier'),
    newBest: $('res-newbest'), pb: $('res-pb'), tooFast: $('res-toofast'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'),
    year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | ready | run | over | end
  var round = null;
  var mode = C.DEFAULT_MODE;
  var raf = 0, endTimer = 0, finishTimer = 0, runSeq = 0;
  var tracked = false, doneSent = false;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function one(n) { return NF1 ? NF1.format(n) : Number(n).toFixed(1); }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  // 이벤트 시각(performance.now 와 같은 기준이면 그것, 아니면 지금)
  function eventTime(e) {
    var n = now();
    var ts = e && typeof e.timeStamp === 'number' ? e.timeStamp : 0;
    return ts > 0 && ts <= n + 1 && n - ts < 1000 ? ts : n;
  }

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
  function getBest(key) { var v = Number(readBests()[key]); return isFinite(v) && v > 0 && v <= C.MAX_CPS ? v : null; }
  function setBest(key, v) { var o = readBests(); o[key] = v; try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ } }

  function syncStartForm() {
    var radios = document.querySelectorAll('input[name="mode"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = Number(radios[i].value) === mode;
  }
  function readStartForm() {
    var sel = document.querySelector('input[name="mode"]:checked');
    mode = C.validMode(sel ? sel.value : mode);
    savePrefs();
  }

  // ---------------------------------------------------------------- 그리기
  function setZone(state, main, sub) {
    els.zone.className = 'cp-zone is-' + state;
    els.zoneMain.textContent = main;
    els.zoneSub.textContent = sub || '';
  }
  function renderHud(t) {
    var rem = C.remaining(round, t);
    els.time.textContent = one(Math.ceil(rem / 100) / 10);
    els.clicks.textContent = num(round.clicks);
    els.cps.textContent = one(phase === 'run' ? C.liveCps(round, t) : round.over ? C.cpsOf(round.clicks, round.mode) : 0);
    els.bar.style.width = (round.dur ? (rem / round.dur) * 100 : 0).toFixed(2) + '%';
  }
  function bump() {
    if (REDUCED) return;
    els.zoneMain.classList.remove('bump');
    void els.zoneMain.offsetWidth; // 애니메이션 다시 시작
    els.zoneMain.classList.add('bump');
  }
  function ripple(e) {
    if (REDUCED || !els.ripples || !e || typeof e.clientX !== 'number') return;
    var rect = els.zone.getBoundingClientRect();
    var d = document.createElement('i');
    d.style.left = (e.clientX - rect.left) + 'px';
    d.style.top = (e.clientY - rect.top) + 'px';
    while (els.ripples.childElementCount >= MAX_RIPPLES) els.ripples.removeChild(els.ripples.firstChild);
    els.ripples.appendChild(d);
    d.addEventListener('animationend', function () { if (d.parentNode) d.parentNode.removeChild(d); });
  }
  function clearRipples() { if (els.ripples) els.ripples.innerHTML = ''; }

  function stopTimers() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (endTimer) { clearTimeout(endTimer); endTimer = 0; }
    if (finishTimer) { clearTimeout(finishTimer); finishTimer = 0; }
  }

  // ---------------------------------------------------------------- 판 준비 · 진행 · 끝
  function newRound(note) {
    stopTimers();
    runSeq++;
    round = C.newRound(mode);
    tracked = false;
    doneSent = false;
    phase = 'ready';
    els.playMode.textContent = fmt(P.mode, { n: round.mode });
    els.note.hidden = !note;
    els.note.textContent = note || '';
    els.change.hidden = false;
    clearRipples();
    setZone('ready', P.ready, P.readySub);
    show('play');
    renderHud(now());
  }

  function loop() {
    raf = 0;
    if (phase !== 'run') return;
    var t = now();
    if (C.tick(round, t)) { endRun(); return; }
    renderHud(t);
    raf = requestAnimationFrame(loop);
  }

  function begin(t) {
    phase = 'run';
    els.note.hidden = true;
    els.change.hidden = true;
    setZone('run', num(round.clicks), P.go);
    if (!tracked) { tracked = true; track('start'); }
    var seq = runSeq;
    // rAF 가 늦어도 시간이 되면 끝나게(탭이 보이는 동안)
    endTimer = setTimeout(function () { endTimer = 0; if (seq === runSeq && phase === 'run' && C.tick(round, now())) endRun(); }, round.dur + 40);
    if (!raf) raf = requestAnimationFrame(loop);
    renderHud(t);
  }

  function endRun() {
    if (phase !== 'run') return;
    stopTimers();
    round.over = true;
    phase = 'over';
    setZone('over', P.over, '');
    renderHud(round.startAt + round.dur);
    var seq = runSeq;
    finishTimer = setTimeout(function () { finishTimer = 0; if (seq === runSeq) finish(); }, LOCK_MS);
  }

  function onPointerDown(e) {
    if (e.button != null && e.button > 0) return; // 마우스 오른쪽·가운데 버튼은 세지 않음
    if (e.cancelable) e.preventDefault();        // 글자 선택·포커스·호환 마우스 이벤트·더블 탭 확대 막기
    if (phase !== 'ready' && phase !== 'run') return; // 끝난 뒤(잠금 포함)는 무시
    var t = eventTime(e);
    var res = C.tap(round, t);
    if (res === 'start') { begin(t); ripple(e); bump(); return; }
    if (res === 'tap') {
      els.zoneMain.textContent = num(round.clicks);
      ripple(e); bump();
      renderHud(now());
      return;
    }
    if (round.over && phase === 'run') endRun();
  }

  function cancelRun() {
    if (phase !== 'run') return;
    newRound(P.cancelled);
  }

  els.zone.addEventListener('pointerdown', onPointerDown);
  ['contextmenu', 'dblclick', 'selectstart', 'dragstart', 'gesturestart'].forEach(function (ev) {
    els.zone.addEventListener(ev, function (e) { if (e.cancelable) e.preventDefault(); });
  });
  // iOS: 영역에서의 터치 스크롤·두 손가락 확대 막기 (touch-action 보조)
  els.zone.addEventListener('touchstart', function (e) { if (e.cancelable && phase !== 'start') e.preventDefault(); }, { passive: false });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) return;
    if (phase === 'run') cancelRun();                       // 진행 중 → 무효
    else if (phase === 'over') { stopTimers(); finish(); }  // 이미 끝난 판(잠금 중) → 결과 그대로 보여 줌
  });

  els.change.addEventListener('click', function () {
    if (phase === 'run' || phase === 'over') return;
    stopTimers();
    phase = 'start';
    syncStartForm();
    show('start');
  });

  function finish() {
    if (!round || !round.over || phase === 'end') return;
    phase = 'end';
    var mySeq = runSeq;
    var s = C.summary(round);
    if (!s) return;
    var key = C.gameKey(s.mode);
    var prev = getBest(key);
    var isNew = s.valid && (prev == null || s.cps > prev);
    if (isNew) setBest(key, s.cps);
    var best = getBest(key);
    els.resMode.textContent = fmt(R.mode, { n: s.mode });
    els.resCps.textContent = one(s.cps);
    els.resClicks.textContent = num(s.clicks);
    els.resTime.textContent = fmt(P.sec, { n: num(s.sec) });
    els.tier.textContent = (R.tiers || [])[s.tier] || '';
    els.newBest.hidden = !(isNew && prev != null);
    els.pb.textContent = best != null ? fmt(R.pb, { n: one(best) }) : '';
    els.pb.hidden = best == null || (isNew && prev != null);
    els.tooFast.hidden = s.valid;
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(round, s, mySeq);
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

  // 한 판에 한 번 CPS(×10 구간)를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음·25 CPS 초과 → 통째로 숨김.
  function submitScore(r, s, mySeq) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!s.valid || !supa || !supa.enabled || !supa.enabled() || r.submitted) return;
    r.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(s.cps);
    withTimeout(supa.submitScore(C.gameKey(r.mode), b), 8000).then(function (rows) {
      if (mySeq !== runSeq || round !== r) return;
      var p = C.percentile(rows, b);
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
    newRound();
  });

  if (window.setShareData) {
    window.setShareData(function () {
      var s = round && round.over ? C.summary(round) : null;
      return {
        title: R.shareTitle,
        text: s ? fmt(R.shareText, { cps: one(s.cps), clicks: num(s.clicks), sec: num(s.sec), tier: (R.tiers || [])[s.tier] || '' }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: function () { newRound(); } });

  window.CPS_APP = {
    phase: function () { return phase; },
    state: function () {
      return { phase: phase, mode: mode, clicks: round ? round.clicks : 0, over: !!(round && round.over), startAt: round ? round.startAt : null,
        hud: { time: els.time.textContent, clicks: els.clicks.textContent, cps: els.cps.textContent } };
    },
    // 검사용: 준비 상태에서 한 판을 clicks 번 클릭한 것으로 바로 끝낸다(잠금 없이 끝 화면까지)
    simulate: function (clicks) {
      if (phase !== 'ready') newRound();
      var t = now() - round.dur;
      C.tap(round, t);
      begin(t);
      round.clicks = Math.max(1, Math.floor(Number(clicks) || 1));
      endRun();
      if (finishTimer) { clearTimeout(finishTimer); finishTimer = 0; }
      finish();
      return C.summary(round);
    },
    best: function (key) { return getBest(key || C.gameKey(mode)); }
  };

  loadPrefs();
  syncStartForm();
  show('start');
})();
