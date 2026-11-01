/* apps/timer/timer.js — 시작(티징 + 목표·블라인드) → 10초 맞추기(시도 3번) → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 timer-core.js(TIMER_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 한 판의 첫 시도가 실제로 시작될 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 시간: performance.now() + requestAnimationFrame. 멈춘 시각은 입력 이벤트의 timeStamp(같은 시간 기준)로 잰다.
 * 입력: STOP 버튼, 달리는 동안 게임 화면 아무 데나 누르기(pointerdown), Space/Enter.
 * 달리는 중 탭을 떠나면(visibilitychange hidden) 그 시도는 무효 — 다시 같은 시도를 한다.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만(모드별 게임 이름). 서버 없음·실패·다른 기록 없음이면 숨긴다.
 * prefers-reduced-motion 이면 딱 맞춤 축하(꽃가루)·흔들림을 끈다.
 * 디버그/검사용 핸들: window.TIMER_APP (phase(), state(), simulate(ms), best())
 */
(function () {
  'use strict';

  var C = window.TIMER_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var PREFS_KEY = 'timer_prefs_v1';
  var BEST_KEY = 'timer_best_v1';
  var LOCK_MS = 450; // 멈춘 직후 연타로 다음 시도가 바로 시작되지 않게
  var LANG = document.documentElement.lang || 'en';
  var NF3 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 3, maximumFractionDigits: 3 }); } catch (e) { return null; } })();
  var NF2 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'), blindToggle: $('blind-toggle'),
    playTarget: $('play-target'), playBlind: $('play-blind'), tries: $('tries'), area: $('play-area'), attempt: $('attempt-label'),
    clock: $('clock'), verdict: $('verdict'), main: $('main-btn'), hint: $('play-hint'), change: $('change-btn'), confetti: $('confetti'),
    resMode: $('res-mode'), resPerfect: $('res-perfect'), resErr: $('res-err'), resTime: $('res-time'), tier: $('res-tier'),
    newBest: $('res-newbest'), pb: $('res-pb'), avg: $('res-avg'), list: $('res-list'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'),
    year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | ready | run | stopped | end
  var round = null;
  var t0 = 0, raf = 0, lockUntil = 0, lastKeyAt = 0, hiddenShown = false;
  var tracked = false, doneSent = false, runSeq = 0;
  var target = C.DEFAULT_TARGET, blind = false;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  // 이벤트 시각(performance.now 와 같은 기준이면 그것, 아니면 지금)
  function eventTime(e) {
    var n = now();
    var ts = e && typeof e.timeStamp === 'number' ? e.timeStamp : 0;
    return ts > 0 && ts <= n + 1 && n - ts < 1000 ? ts : n;
  }
  function secText(ms, digits) {
    var v = ms / 1000;
    var f = digits === 2 ? NF2 : NF3;
    return fmt(P.sec, { n: f ? f.format(v) : v.toFixed(digits || 3) });
  }
  function targetText() { return fmt(P.sec, { n: NF2 ? NF2.format(target) : target.toFixed(2) }); }
  // 부호 있는 오차: +0.023 s / −0.104 s / 0.000 s
  function errText(err) {
    var sign = err > 0 ? '+' : err < 0 ? '−' : '±';
    return sign + secText(Math.abs(err), 3);
  }

  // 큰 오차 표시: 숫자(시계 글꼴) + 작은 단위(언어별 "s"·"초"·"วินาที" …) — 긴 단위가 한 줄을 넘지 않게
  function setBigErr(err) {
    var full = errText(err);
    var abs = Math.abs(err) / 1000;
    var numTxt = full.charAt(0) + (NF3 ? NF3.format(abs) : abs.toFixed(3));
    var at = full.indexOf(numTxt);
    els.resErr.textContent = '';
    if (at < 0) { els.resErr.textContent = full; return; }
    if (at > 0) els.resErr.appendChild(document.createTextNode(full.slice(0, at)));
    var n = document.createElement('span'); n.className = 'tm-err-num'; n.textContent = numTxt;
    var u = document.createElement('span'); u.className = 'tm-err-unit'; u.textContent = full.slice(at + numTxt.length);
    els.resErr.appendChild(n); els.resErr.appendChild(u);
  }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 설정 · 최고 기록 (이 브라우저)
  function loadPrefs() {
    try {
      var p = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
      target = C.validTarget(p.target);
      blind = !!p.blind;
    } catch (e) { target = C.DEFAULT_TARGET; blind = false; }
  }
  function savePrefs() { try { localStorage.setItem(PREFS_KEY, JSON.stringify({ target: target, blind: blind })); } catch (e) { /* noop */ } }
  function readBests() { try { var o = JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; } }
  function getBest(key) { var v = Number(readBests()[key]); return isFinite(v) && v >= 0 ? v : null; }
  function setBest(key, v) { var o = readBests(); o[key] = v; try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ } }

  function syncStartForm() {
    var radios = document.querySelectorAll('input[name="target"]');
    for (var i = 0; i < radios.length; i++) radios[i].checked = Number(radios[i].value) === target;
    if (els.blindToggle) els.blindToggle.checked = blind;
  }
  function readStartForm() {
    var sel = document.querySelector('input[name="target"]:checked');
    target = C.validTarget(sel ? sel.value : target);
    blind = !!(els.blindToggle && els.blindToggle.checked);
    savePrefs();
  }

  // ---------------------------------------------------------------- 그리기
  function renderTries() {
    var lis = els.tries.querySelectorAll('.tm-try');
    for (var i = 0; i < lis.length; i++) {
      var a = round && round.attempts[i];
      var cur = round && i === round.attempts.length && phase !== 'end';
      lis[i].classList.toggle('done', !!a);
      lis[i].classList.toggle('cur', !!cur);
      lis[i].classList.toggle('perfect', !!(a && a.perfect));
      lis[i].querySelector('.tm-try-v').textContent = a ? C.formatShort(a.ms) : '–';
    }
  }
  function setClock(ms, hide) {
    if (hide) {
      if (!hiddenShown) { hiddenShown = true; els.clock.textContent = P.hidden; els.clock.classList.add('is-hidden'); }
      return;
    }
    els.clock.textContent = C.formatClock(ms);
  }
  function setMain(label, cls) {
    els.main.textContent = label;
    els.main.className = 'tm-btn ' + cls;
  }
  function renderReady(note) {
    var n = round.attempts.length;
    els.attempt.textContent = fmt(P.attempt, { n: n + 1, total: C.ATTEMPTS });
    hiddenShown = false;
    els.clock.classList.remove('is-hidden', 'running', 'perfect', 'shake');
    setClock(0);
    els.verdict.textContent = '';
    els.verdict.className = 'tm-verdict';
    setMain(P.go, 'tm-btn-go');
    els.hint.textContent = note || fmt(P.readyHint, { t: targetText() });
    els.change.hidden = n !== 0;
    renderTries();
  }

  // ---------------------------------------------------------------- 시계
  function loop() {
    raf = 0;
    if (phase !== 'run') return;
    var ms = now() - t0;
    if (ms >= C.MAX_RUN_MS) { stop(t0 + C.MAX_RUN_MS); return; }
    setClock(ms, blind && ms >= C.BLIND_AFTER_MS);
    raf = requestAnimationFrame(loop);
  }

  function begin(at) {
    if (phase !== 'ready' || !round) return;
    phase = 'run';
    runSeq++;
    t0 = typeof at === 'number' ? at : now();
    hiddenShown = false;
    els.clock.classList.add('running');
    els.verdict.textContent = '';
    setMain(P.stop, 'tm-btn-stop');
    els.hint.textContent = P.runHint;
    els.change.hidden = true;
    if (!tracked && round.attempts.length === 0) { tracked = true; track('start'); }
    renderTries();
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function stop(at, forcedMs) {
    if (phase !== 'run' || !round) return null;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    var ms = typeof forcedMs === 'number' ? forcedMs : (typeof at === 'number' ? at : now()) - t0;
    var a = C.record(round, ms);
    if (!a) return null;
    phase = 'stopped';
    lockUntil = now() + LOCK_MS;
    hiddenShown = false;
    els.clock.classList.remove('running', 'is-hidden');
    setClock(a.ms);
    if (a.perfect) {
      els.clock.classList.add('perfect');
      els.verdict.textContent = fmt(P.perfect, { t: targetText() });
      els.verdict.className = 'tm-verdict perfect';
      celebrate();
    } else {
      els.verdict.textContent = fmt(a.err < 0 ? P.early : P.late, { n: secText(Math.abs(a.err), 3) });
      els.verdict.className = 'tm-verdict ' + (a.err < 0 ? 'early' : 'late');
    }
    var last = round.over;
    setMain(last ? P.finish : P.next, last ? 'tm-btn-finish' : 'tm-btn-next');
    els.hint.textContent = '';
    renderTries();
    return a;
  }

  function cancelRun() {
    if (phase !== 'run') return;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    phase = 'ready';
    renderReady(P.cancelled);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden && phase === 'run') cancelRun();
  });

  // ---------------------------------------------------------------- 축하 (딱 맞춤)
  var CONF_COLORS = ['#38f2a6', '#ffd166', '#ff5d6c', '#7aa7ff', '#ffffff'];
  function celebrate() {
    if (REDUCED || !els.confetti) return;
    els.confetti.innerHTML = '';
    for (var i = 0; i < 36; i++) {
      var d = document.createElement('i');
      d.style.left = (Math.random() * 100).toFixed(1) + '%';
      d.style.background = CONF_COLORS[i % CONF_COLORS.length];
      d.style.animationDelay = (Math.random() * 0.4).toFixed(2) + 's';
      d.style.animationDuration = (1.6 + Math.random() * 1.2).toFixed(2) + 's';
      d.style.setProperty('--dx', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
      d.style.setProperty('--rot', (Math.random() * 720 - 360).toFixed(0) + 'deg');
      els.confetti.appendChild(d);
    }
    setTimeout(function () { if (els.confetti) els.confetti.innerHTML = ''; }, 3400);
  }

  // ---------------------------------------------------------------- 입력
  function act(e, fromKey) {
    var t = eventTime(e);
    if (phase === 'run') return stop(t);
    if (now() < lockUntil) return null;
    if (phase === 'ready') return begin(t);
    if (phase === 'stopped') {
      if (round.over) finish();
      else { phase = 'ready'; renderReady(); }
    }
    return null;
  }

  // 달리는 동안: 게임 화면 아무 데나 누르면 바로 멈춤(누르는 순간, pointerdown)
  els.play.addEventListener('pointerdown', function (e) {
    if (phase !== 'run') return;
    if (e.button != null && e.button > 0) return;
    e.preventDefault();
    stop(eventTime(e));
  });
  els.main.addEventListener('click', function (e) {
    if (phase === 'run') { stop(eventTime(e)); return; } // 키보드 등 pointerdown 이 없는 경우
    if (e.detail === 0 && now() - lastKeyAt < 400) return; // Space/Enter 는 keydown 에서 이미 처리
    act(e);
  });
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey || e.repeat) return;
    if (e.key !== ' ' && e.key !== 'Spacebar' && e.key !== 'Enter') return;
    if (document.activeElement === els.change) return;
    e.preventDefault();
    lastKeyAt = now();
    act(e, true);
  });
  els.play.addEventListener('contextmenu', function (e) { if (phase === 'run') e.preventDefault(); });

  els.change.addEventListener('click', function () {
    if (phase === 'run') return;
    phase = 'start';
    syncStartForm();
    show('start');
  });

  // ---------------------------------------------------------------- 판 시작 · 끝
  function newRound() {
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    round = C.newRound(target, blind);
    tracked = false;
    doneSent = false;
    lockUntil = 0;
    phase = 'ready';
    els.playTarget.textContent = fmt(P.target, { t: targetText() });
    els.playBlind.hidden = !blind;
    if (els.confetti) els.confetti.innerHTML = '';
    show('play');
    renderReady();
  }

  function finish() {
    if (!round || !round.over || phase === 'end') return;
    phase = 'end';
    var mySeq = runSeq;
    var s = C.summary(round);
    var key = C.gameKey(round.target, round.blind);
    var prev = getBest(key);
    var isNew = prev == null || s.best.abs < prev;
    if (isNew) setBest(key, s.best.abs);
    els.resMode.textContent = fmt(R.mode, { t: targetText() }) + (round.blind ? ' · ' + P.blindTag : '');
    els.resPerfect.hidden = !s.perfect;
    els.resPerfect.textContent = s.perfect ? fmt(R.perfect, { t: targetText() }) : '';
    setBigErr(s.best.err);
    els.resTime.textContent = fmt(R.stoppedAt, { time: C.formatClock(s.best.ms) });
    els.tier.textContent = (R.tiers || [])[s.tier] || '';
    els.newBest.hidden = !(isNew && prev != null);
    els.pb.textContent = fmt(R.pb, { n: secText(Math.min(prev == null ? s.best.abs : prev, s.best.abs), 3) });
    els.pb.hidden = isNew && prev != null;
    els.avg.textContent = secText(s.avg, 3);
    els.list.innerHTML = '';
    round.attempts.forEach(function (a) {
      var li = document.createElement('li');
      li.className = 'tm-res-row' + (a === s.best ? ' best' : '') + (a.perfect ? ' perfect' : '');
      var n = document.createElement('span'); n.className = 'tm-res-n'; n.textContent = String(a.index + 1);
      var t = document.createElement('span'); t.className = 'tm-res-t'; t.textContent = C.formatShort(a.ms);
      var e = document.createElement('span'); e.className = 'tm-res-e'; e.textContent = errText(a.err);
      li.appendChild(n); li.appendChild(t); li.appendChild(e);
      els.list.appendChild(li);
    });
    show('end');
    if (s.perfect) celebrate();
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

  // 한 판에 한 번 가장 작은 오차(ms)를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(r, s, mySeq) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || r.submitted) return;
    r.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(s.best.abs);
    withTimeout(supa.submitScore(C.gameKey(r.target, r.blind), b), 8000).then(function (rows) {
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
    try { els.main.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  });

  if (window.setShareData) {
    window.setShareData(function () {
      var s = round && round.over ? C.summary(round) : null;
      return {
        title: R.shareTitle,
        text: s ? fmt(R.shareText, { n: secText(s.best.abs, 3), t: targetText(), tier: (R.tiers || [])[s.tier] || '' }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: function () { newRound(); } });

  window.TIMER_APP = {
    phase: function () { return phase; },
    state: function () {
      return { phase: phase, target: target, blind: blind, attempts: round ? round.attempts.slice() : [], over: !!(round && round.over),
        clock: els.clock.textContent, elapsed: phase === 'run' ? now() - t0 : null };
    },
    // 검사용: 준비 상태에서 시도 하나를 정확히 ms 로 끝낸다
    simulate: function (ms) {
      if (phase === 'stopped') { lockUntil = 0; act(null); }
      if (phase !== 'ready') return null;
      begin(now());
      return stop(null, ms);
    },
    unlock: function () { lockUntil = 0; },
    best: function (key) { return getBest(key || C.gameKey(target, blind)); }
  };

  loadPrefs();
  syncStartForm();
  show('start');
})();
