/* apps/baseball/baseball.js — 시작(티징 + 자릿수·타이머 선택) → 게임(HUD + 입력칸 + 숫자 패드 + 추리 기록, 광고 없음) → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙은 baseball-core.js(BASEBALL_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 입력: 화면 숫자 패드(pointerdown 으로 바로 받음 — 300ms 지연 없음, touch-action: manipulation) + 키보드(숫자·Backspace·Enter). 키보드 Enter/Space 로 버튼을 누르면 click(detail 0).
 * 힌트·풀이 도움 없음. 포기하면 정답만 보여 준다(한 번 더 눌러야 함).
 * 시계(선택): 첫 숫자를 누를 때 시작, 0.1초 표시. 탭을 숨기면(visibilitychange) 멈추고 돌아오면 이어 간다. 꺼 둔 판은 결과에도 시간을 보이지 않는다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만(맞힌 판만). 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 최고 기록(자릿수별 최소 시도 횟수 + 그때 시간): localStorage baseball_best_v1. 마지막 자릿수: baseball_level_v1. 타이머 선택: baseball_timer_v1.
 * 디버그/검사용 핸들: window.BASEBALL_APP (phase(), state(), elapsed(), level(), best(), input())
 */
(function () {
  'use strict';

  var C = window.BASEBALL_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var S = UI.start || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'baseball_best_v1';
  var LAST_KEY = 'baseball_level_v1';
  var TIMER_KEY = 'baseball_timer_v1';
  var END_DELAY = REDUCED ? 200 : 600;
  var SURE_MS = 4000;
  var LANG = document.documentElement.lang || 'en';
  var NF1 = (function () { try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return null; } })();
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'), levels: $('levels'), timerOpt: $('timer-opt'),
    tries: $('hud-tries'), timeBox: $('hud-time-box'), time: $('hud-time'),
    slots: $('slots'), msg: $('msg'), pad: $('pad'), del: $('del-btn'), enter: $('enter-btn'),
    history: $('history'), historyEmpty: $('history-empty'), giveUp: $('giveup-btn'),
    level: $('res-level'), head: $('res-head'), secretLabel: $('res-secret-label'), secret: $('res-secret'), big: $('res-big'),
    newBest: $('res-newbest'), resBest: $('res-best'), timeStatBox: $('res-time-box'), timeStat: $('res-time'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | play | ending | end
  var state = null;
  var level = 'd3';
  var cur = '';            // 지금 입력 중인 숫자
  var timerOn = false;
  var runId = 0, doneSent = false, endTimer = 0, sureTimer = 0, raf = 0, sureArmed = false;
  var baseMs = 0, t0 = 0, running = false, clockStarted = false, finalMs = 0, usedTimer = false;
  var slotEls = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function secs1(ms) { var v = Math.floor(ms / 100) / 10; return NF1 ? NF1.format(v) : v.toFixed(1); }
  function buzz(ms) { if (!REDUCED && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* noop */ } } }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 저장 (이 브라우저)
  function readBest() {
    try {
      var o = JSON.parse(localStorage.getItem(BEST_KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) { return {}; }
  }
  function getBest(lv) {
    var b = readBest()[lv];
    var n = b && Number(b.n);
    return isFinite(n) && n >= 1 ? { n: n, ms: Number(b.ms) > 0 ? Number(b.ms) : 0 } : null;
  }
  function setBest(lv, n, ms) {
    var o = readBest();
    o[lv] = { n: n, ms: Math.round(ms) };
    try { localStorage.setItem(BEST_KEY, JSON.stringify(o)); } catch (e) { /* noop */ }
  }
  function loadLevel() {
    try { var m = localStorage.getItem(LAST_KEY); if (m && C.LEVELS[m]) return m; } catch (e) { /* noop */ }
    return 'd3';
  }
  function saveLevel(m) { try { localStorage.setItem(LAST_KEY, m); } catch (e) { /* noop */ } }
  function loadTimer() { try { return localStorage.getItem(TIMER_KEY) === '1'; } catch (e) { return false; } }
  function saveTimer(on) { try { localStorage.setItem(TIMER_KEY, on ? '1' : '0'); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 시작 화면 선택
  function selectLevel(m) {
    level = m;
    Array.prototype.forEach.call(els.levels.querySelectorAll('.bb-level'), function (b) {
      var on = b.getAttribute('data-level') === m;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }
  els.levels.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.bb-level') : null;
    if (!b) return;
    selectLevel(b.getAttribute('data-level'));
    saveLevel(level);
  });
  els.levels.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'ArrowUp' && k !== 'ArrowDown') return;
    e.preventDefault();
    var i = C.LEVEL_ORDER.indexOf(level) + (k === 'ArrowLeft' || k === 'ArrowUp' ? -1 : 1);
    i = (i + C.LEVEL_ORDER.length) % C.LEVEL_ORDER.length;
    selectLevel(C.LEVEL_ORDER[i]);
    saveLevel(level);
    var b = els.levels.querySelector('[data-level="' + level + '"]');
    if (b) b.focus();
  });
  els.timerOpt.addEventListener('change', function () { timerOn = els.timerOpt.checked; saveTimer(timerOn); });

  // ---------------------------------------------------------------- 시간 (0.1초, 선택)
  function clockMs() { return baseMs + (running ? performance.now() - t0 : 0); }
  function drawTime() { els.time.textContent = secs1(clockMs()); }
  function loop() {
    drawTime();
    if (running) raf = requestAnimationFrame(loop);
  }
  function startClock() {
    if (running) return;
    t0 = performance.now();
    running = true;
    clockStarted = true;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  }
  function stopClock() {
    if (running) { baseMs += performance.now() - t0; running = false; }
    cancelAnimationFrame(raf);
    drawTime();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (phase === 'play') stopClock(); }
    else if (phase === 'play' && clockStarted) startClock();
  });

  // ---------------------------------------------------------------- 판 그리기
  function buildSlots() {
    els.slots.textContent = '';
    slotEls = [];
    for (var i = 0; i < state.digits; i++) {
      var d = document.createElement('span');
      d.className = 'bb-slot';
      d.setAttribute('role', 'img');
      els.slots.appendChild(d);
      slotEls.push(d);
    }
    els.slots.setAttribute('data-n', String(state.digits));
  }
  function drawSlots() {
    for (var i = 0; i < slotEls.length; i++) {
      var ch = cur.charAt(i);
      slotEls[i].textContent = ch;
      slotEls[i].classList.toggle('is-on', i === cur.length && cur.length < slotEls.length);
      slotEls[i].classList.toggle('is-full', !!ch);
      slotEls[i].setAttribute('aria-label', fmt(P.slotAria, { n: i + 1 }) + (ch ? ': ' + ch : ''));
    }
    Array.prototype.forEach.call(els.pad.querySelectorAll('.bb-key[data-d]'), function (k) {
      var used = cur.indexOf(k.getAttribute('data-d')) >= 0;
      k.classList.toggle('is-used', used);
      if (used) k.setAttribute('aria-disabled', 'true'); else k.removeAttribute('aria-disabled');
    });
  }
  function drawHud() {
    els.tries.textContent = num(state.tries);
    els.timeBox.hidden = !usedTimer;
    drawTime();
  }
  function chipsFor(e, into) {
    function chip(cls, text) {
      var c = document.createElement('span');
      c.className = 'bb-chip ' + cls;
      c.textContent = text;
      into.appendChild(c);
    }
    if (e.out) { chip('bb-chip-o', P.out); return; }
    if (e.s) chip('bb-chip-s', P.strike + ' ' + e.s);
    if (e.b) chip('bb-chip-b', P.ball + ' ' + e.b);
  }
  function say(text, kind) {
    els.msg.textContent = text || '';
    els.msg.className = 'bb-msg' + (kind ? ' is-' + kind : '');
    if (kind === 'err' && !REDUCED) {
      els.slots.classList.remove('is-shake');
      void els.slots.offsetWidth;
      els.slots.classList.add('is-shake');
    }
  }
  function sayResult(e) {
    els.msg.textContent = '';
    els.msg.className = 'bb-msg is-res';
    var g = document.createElement('span');
    g.className = 'bb-msg-guess';
    g.textContent = e.guess;
    els.msg.appendChild(g);
    chipsFor(e, els.msg);
  }
  function addHistory(e, n) {
    els.historyEmpty.hidden = true;
    var li = document.createElement('li');
    li.className = 'bb-row';
    var a = document.createElement('span'); a.className = 'bb-row-n'; a.textContent = String(n);
    var g = document.createElement('span'); g.className = 'bb-row-g'; g.textContent = e.guess;
    var c = document.createElement('span'); c.className = 'bb-row-c';
    chipsFor(e, c);
    li.appendChild(a); li.appendChild(g); li.appendChild(c);
    els.history.insertBefore(li, els.history.firstChild);
  }

  // ---------------------------------------------------------------- 입력
  function disarm() {
    sureArmed = false;
    clearTimeout(sureTimer);
    els.giveUp.textContent = P.giveUp;
    els.giveUp.classList.remove('is-sure');
  }
  function pressDigit(d) {
    if (phase !== 'play' || !state || state.status !== 'play') return;
    if (cur.length >= state.digits) return;
    if (cur.indexOf(d) >= 0) { say(P.errDup, 'err'); buzz(15); return; }
    if (usedTimer && !clockStarted) startClock();
    cur += d;
    say('');
    disarm();
    drawSlots();
  }
  function pressDel() {
    if (phase !== 'play' || !cur) return;
    cur = cur.slice(0, -1);
    say('');
    drawSlots();
  }
  function pressEnter() {
    if (phase !== 'play' || !state || state.status !== 'play') return;
    if (cur.length !== state.digits) { say(fmt(P.errLen, { n: state.digits }), 'err'); buzz(15); return; }
    var r = C.guess(state, cur);
    if (!r.ok) {
      say(r.err === 'again' ? P.errAgain : r.err === 'dup' ? P.errDup : fmt(P.errLen, { n: state.digits }), 'err');
      buzz(15);
      return;
    }
    var e = state.history[state.history.length - 1];
    cur = '';
    disarm();
    drawSlots();
    drawHud();
    addHistory(e, state.tries);
    sayResult(e);
    if (r.done) finish(true);
  }
  function keyOf(e) { var t = e.target.closest ? e.target.closest('.bb-key') : null; return t || null; }
  function activate(k) {
    if (k === els.del) pressDel();
    else if (k === els.enter) pressEnter();
    else pressDigit(k.getAttribute('data-d'));
  }
  els.pad.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var k = keyOf(e);
    if (!k) return;
    e.preventDefault();   // 포커스·글자 선택·길게 누르기 메뉴 막기 — 누르는 순간 바로 처리
    activate(k);
  });
  // 키보드로 버튼을 눌렀을 때(Enter/Space → click detail 0). 포인터 click 은 pointerdown 에서 이미 처리했다.
  els.pad.addEventListener('click', function (e) {
    if (e.detail !== 0) return;
    var k = keyOf(e);
    if (k) activate(k);
  });
  els.pad.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  els.pad.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    if (phase !== 'play' || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = e.target && e.target.tagName;
    if (tag === 'BUTTON' || tag === 'SELECT' || tag === 'INPUT' || tag === 'A') return;
    if (/^[0-9]$/.test(e.key)) { e.preventDefault(); pressDigit(e.key); }
    else if (e.key === 'Backspace') { e.preventDefault(); pressDel(); }
    else if (e.key === 'Enter') { e.preventDefault(); pressEnter(); }
  });

  // 포기: 한 번 누르면 확인 문구, 4초 안에 한 번 더 누르면 정답 공개
  els.giveUp.addEventListener('click', function () {
    if (phase !== 'play' || !state || state.status !== 'play') return;
    if (!sureArmed) {
      sureArmed = true;
      els.giveUp.textContent = P.giveUpSure;
      els.giveUp.classList.add('is-sure');
      clearTimeout(sureTimer);
      sureTimer = setTimeout(disarm, SURE_MS);
      return;
    }
    disarm();
    C.giveUp(state);
    finish(false);
  });

  // ---------------------------------------------------------------- 끝
  function finish(won) {
    if (phase !== 'play') return;
    phase = 'ending';
    stopClock();
    finalMs = clockMs();
    var myRun = runId;
    clearTimeout(endTimer);
    endTimer = setTimeout(function () { if (myRun === runId) showEnd(myRun, won); }, won ? END_DELAY : 0);
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

  // 맞힌 판마다 한 번 시도 횟수를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(tries, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || state.submitted || state.status !== 'won' || !C.plausible(level, tries)) return;
    state.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(tries);
    withTimeout(supa.submitScore(C.LEVELS[level].game, b), 8000).then(function (rows) {
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

  function drawSecret(secret) {
    els.secret.textContent = '';
    for (var i = 0; i < secret.length; i++) {
      var t = document.createElement('span');
      t.className = 'bb-tile';
      t.textContent = secret.charAt(i);
      els.secret.appendChild(t);
    }
  }

  function showEnd(myRun, won) {
    var s = state;
    phase = 'end';
    els.level.textContent = (S.levels || {})[level] || level;
    els.head.textContent = won ? R.done : R.gaveUp;
    els.secretLabel.hidden = !won;
    drawSecret(s.secret);
    els.big.textContent = num(s.tries);
    els.newBest.hidden = true;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    els.timeStatBox.hidden = !usedTimer;
    if (usedTimer) els.timeStat.textContent = secs1(finalMs) + ' ' + R.sec;
    var prev = getBest(level);
    if (won) {
      var ms = usedTimer ? finalMs : 0;
      if (!prev || s.tries < prev.n) {
        setBest(level, s.tries, ms);
        els.newBest.hidden = !prev;   // 첫 기록은 "새 최고 기록!" 이라 하지 않는다
        prev = { n: s.tries, ms: ms };
      } else if (s.tries === prev.n && ms > 0 && (!prev.ms || ms < prev.ms)) {
        setBest(level, s.tries, ms);
        prev = { n: s.tries, ms: ms };
      }
    }
    if (prev) els.resBest.textContent = fmt(R.best, { n: num(prev.n) }) + (usedTimer && prev.ms ? ' · ' + secs1(prev.ms) + ' ' + R.sec : '');
    else els.resBest.textContent = '';
    els.resBest.hidden = !prev;
    if (won) submitScore(s.tries, myRun);
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
  }

  // ---------------------------------------------------------------- 시작
  function start() {
    runId++;
    clearTimeout(endTimer);
    cancelAnimationFrame(raf);
    disarm();
    doneSent = false;
    running = false;
    clockStarted = false;
    baseMs = 0;
    finalMs = 0;
    cur = '';
    usedTimer = timerOn;
    state = C.newGame(level);
    els.history.textContent = '';
    els.historyEmpty.hidden = false;
    say('');
    phase = 'play';
    buildSlots();
    drawSlots();
    drawHud();
    show('play');
    track('start');
  }
  els.startBtn.addEventListener('click', start);

  selectLevel(loadLevel());
  timerOn = loadTimer();
  els.timerOpt.checked = timerOn;

  if (window.setShareData) {
    window.setShareData(function () {
      var won = phase === 'end' && state && state.status === 'won';
      return {
        title: R.shareTitle,
        text: won ? fmt(R.shareText, { d: state.digits, n: state.tries }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  window.BASEBALL_APP = {
    phase: function () { return phase; },
    state: function () { return state; },
    best: getBest,
    elapsed: clockMs,
    level: function () { return level; },
    input: function () { return cur; }
  };
}());
