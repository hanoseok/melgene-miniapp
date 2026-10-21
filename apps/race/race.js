/* apps/race/race.js — 동물 달리기 시합: 시작 화면(모드·인원·이름) → 경주 화면(카운트다운 → 레인 달리기) → 결과·최근 기록 → 공통 끝 화면
 * 로직은 race-core.js(RACE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 순위를 먼저 정한다: 출발을 누르는 순간 crypto 로 도착 순서를 섞고(finishOrder), 그 순서대로 들어오도록 연출 계획(planRace)을 세운 뒤 애니메이션만 한다.
 * 움직임 줄이기(prefers-reduced-motion)면 카운트다운·달리기 없이 바로 결승 장면과 결과.
 * 광고: 시작 화면 맨 아래 .mg-ad-start 한 자리(경주 화면으로 넘어가면 화면째 숨음). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 출발할 때마다 track('start') 한 번, 결과가 보일 때 track('done') 한 번. 공유 링크로 이름만 불러온 것은 세지 않는다.
 * 저장: 마지막 설정(모드·이름 칸)과 최근 결과 10개만 이 기기 localStorage(try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): "이 이름으로 링크 복사" 버튼만(이름 칸 + 모드, 결과 없음). 끝 화면 공통 공유(setShareData)는 언어 없는 깨끗한 주소.
 * 디버그/검사용 읽기 전용 핸들: window.RACE_APP
 */
(function () {
  'use strict';

  var CORE = window.RACE_CORE;
  var I = window.PAGE_I18N || {};
  var LANG = I.lang || 'en';
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_race_v1';
  var HIST = 'mg_race_hist_v1';
  var MEDALS = ['🥇', '🥈', '🥉'];
  var COUNT_STEP_MS = 650;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), race: $('screen-race'), form: $('rc-form'), modeWin: $('mode-win'), modeLose: $('mode-lose'),
    less: $('count-less'), more: $('count-more'), countOut: $('count-out'), entries: $('entries'), error: $('error'), note: $('shared-note'),
    start: $('start-btn'), banner: $('race-banner'), track: $('track'), countdown: $('countdown'), countdownNum: $('countdown-num'), live: $('live'),
    result: $('result'), kicker: $('res-kicker'), title: $('res-title'), sub: $('res-sub'), ranking: $('ranking'), edit: $('edit-btn'), link: $('link-btn'),
    historyCard: $('history-card'), history: $('history'), historyClear: $('history-clear'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = 'win';
  var count = CORE.DEFAULT_RUNNERS;
  var inputs = [];             // 이름 칸 값(최대 10칸, 인원을 줄여도 값은 남겨 둔다)
  var phase = 'setup';         // setup | countdown | race | result
  var cfg = null;              // { mode, names }
  var plan = null;             // CORE.planRace
  var lanes = [];              // 레인 DOM { li, runner, place, done }
  var travel = 0;              // 출발선 → 결승선 이동 거리(px)
  var raf = 0;
  var timers = [];
  var t0 = 0;
  var history = [];
  for (var k = 0; k < CORE.MAX_RUNNERS; k++) inputs.push('');

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, key) { return vars[key] != null ? vars[key] : m; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function placeholder(i) { return fmt(U.playerN, { n: i + 1 }); }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); raf = 0; }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function loadSaved() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (o && typeof o === 'object' && Array.isArray(o.names)) {
        return { mode: o.mode === 'lose' ? 'lose' : 'win', count: CORE.clampCount(o.count), names: o.names.slice(0, CORE.MAX_RUNNERS).map(function (x) { return CORE.cleanText(x, CORE.MAX_NAME); }) };
      }
    } catch (e) { /* noop */ }
    return null;
  }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify({ mode: mode, count: count, names: inputs.slice() })); } catch (e) { /* noop */ }
  }
  function loadHistory() {
    try { return CORE.sanitizeHistory(JSON.parse(window.localStorage.getItem(HIST) || '[]')); } catch (e) { return []; }
  }
  function saveHistory() {
    try { window.localStorage.setItem(HIST, JSON.stringify(history)); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 시작 화면
  function setMode(m) {
    mode = m === 'lose' ? 'lose' : 'win';
    els.modeWin.setAttribute('aria-checked', String(mode === 'win'));
    els.modeLose.setAttribute('aria-checked', String(mode === 'lose'));
  }
  function renderEntries() {
    var have = els.entries.children.length;
    for (var i = have; i < count; i++) {
      var li = el('li', 'rc-entry');
      li.appendChild(el('span', 'rc-entry-animal', CORE.ANIMALS[i])).setAttribute('aria-hidden', 'true');
      var inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'rc-input';
      inp.maxLength = CORE.MAX_NAME;
      inp.placeholder = placeholder(i);
      inp.setAttribute('aria-label', fmt(U.nameAria, { n: i + 1 }));
      inp.setAttribute('enterkeyhint', i === count - 1 ? 'go' : 'next');
      inp.setAttribute('data-i', String(i));
      inp.value = inputs[i] || '';
      li.appendChild(inp);
      els.entries.appendChild(li);
    }
    while (els.entries.children.length > count) els.entries.removeChild(els.entries.lastChild);
    Array.prototype.forEach.call(els.entries.querySelectorAll('.rc-input'), function (x, j) { x.setAttribute('enterkeyhint', j === count - 1 ? 'go' : 'next'); });
    els.countOut.textContent = fmt(U.countValue, { n: count });
    els.less.disabled = count <= CORE.MIN_RUNNERS;
    els.more.disabled = count >= CORE.MAX_RUNNERS;
  }
  function setCount(n) {
    count = CORE.clampCount(n);
    renderEntries();
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(msg) { els.error.textContent = msg; els.error.hidden = false; scrollTo(els.error, 'center'); }

  // ---------------------------------------------------------------- 트랙
  function laneHeight(n) { return n <= 4 ? 52 : n <= 6 ? 44 : n <= 8 ? 36 : 32; }
  function buildTrack(names) {
    els.track.innerHTML = '';
    lanes = [];
    var n = names.length;
    els.track.style.setProperty('--lane-h', laneHeight(n) + 'px');
    els.track.style.setProperty('--name-fs', (n > 8 ? 11.5 : n > 6 ? 12.5 : 13.5) + 'px');
    names.forEach(function (name, i) {
      var li = el('li', 'rc-lane');
      li.setAttribute('data-lane', String(i));
      li.appendChild(el('span', 'rc-lane-name', name));
      var runner = el('span', 'rc-runner');
      runner.setAttribute('aria-hidden', 'true');
      runner.appendChild(el('span', 'rc-dust'));
      runner.appendChild(el('span', 'rc-animal', CORE.ANIMALS[i]));
      li.appendChild(runner);
      var place = el('span', 'rc-place');
      place.setAttribute('aria-hidden', 'true');
      li.appendChild(place);
      els.track.appendChild(li);
      lanes.push({ li: li, runner: runner, place: place, done: false });
    });
    measure();
  }
  function measure() {
    if (!lanes.length) return;
    var li = lanes[0].li;
    var cs = window.getComputedStyle(els.track);
    var start = parseFloat(cs.getPropertyValue('--start-x')) || 28;
    var finish = parseFloat(cs.getPropertyValue('--finish-w')) || 14;
    travel = Math.max(40, li.clientWidth - start - finish - (lanes[0].runner.offsetWidth || 30) - 2);
  }
  function placeLabel(rank) { return rank < MEDALS.length ? MEDALS[rank] : String(rank + 1); }
  function drawAt(t) {
    var lead = phase === 'race' ? CORE.leaderAt(plan, t) : -1;
    var allDone = true;
    // 등수 순서로 돈다: 한 프레임에 여럿이 들어와도 표시(is-finished)는 도착 순서대로 붙는다
    plan.order.forEach(function (i) {
      var L = lanes[i];
      var p = CORE.positionAt(plan, i, t);
      L.runner.style.transform = 'translateX(' + (p * travel).toFixed(1) + 'px)';
      var fx = CORE.fxAt(plan, i, t);
      L.li.classList.toggle('is-burst', fx === 'burst');
      L.li.classList.toggle('is-stumble', fx === 'stumble');
      L.li.classList.toggle('is-leader', i === lead && !L.done);
      if (p >= 1 && !L.done) {
        L.done = true;
        var rank = plan.rankOf[i];
        L.place.textContent = placeLabel(rank);
        L.li.classList.add('is-finished');
        L.li.classList.toggle('is-first', rank === 0);
        L.li.classList.toggle('is-last', rank === plan.n - 1);
      }
      if (!L.done) allDone = false;
    });
    return allDone;
  }

  // ---------------------------------------------------------------- 경주 (순위 먼저 → 연출)
  function startRace() {
    if (phase === 'countdown' || phase === 'race') return;
    var v = CORE.validate({ mode: mode, names: inputs.slice(0, count) }, placeholder);
    if (!v.ok) { showError(fmt(E[v.error] || E.tooFew, { n: v.n })); return; }
    clearError();
    els.note.hidden = true;
    clearTimers();
    cfg = v.cfg;
    save();
    var order = CORE.finishOrder(cfg.names.length);   // 결과는 여기서 정해진다(crypto)
    plan = CORE.planRace(order, cfg.mode);            // 그 순서대로 들어오는 연출
    els.setup.hidden = true;
    els.race.hidden = false;
    els.result.hidden = true;
    els.banner.textContent = cfg.mode === 'lose' ? U.bannerLose : U.bannerWin;
    els.race.classList.toggle('is-lose', cfg.mode === 'lose');
    buildTrack(cfg.names);
    drawAt(0);
    scrollTo(els.race, 'start');
    track('start');
    els.live.textContent = U.liveStart;
    if (REDUCED) {
      phase = 'race';
      drawAt(plan.total);
      later(finishRace, 300);
      return;
    }
    phase = 'countdown';
    var steps = ['3', '2', '1', U.go];
    els.countdown.hidden = false;
    steps.forEach(function (s, i) {
      later(function () {
        els.countdownNum.textContent = s;
        els.countdownNum.classList.remove('is-tick');
        void els.countdownNum.offsetWidth;   // 애니메이션 다시 시작
        els.countdownNum.classList.add('is-tick');
        els.countdown.classList.toggle('is-go', i === steps.length - 1);
        if (i === steps.length - 1) run();
      }, i * COUNT_STEP_MS);
    });
    later(function () { els.countdown.hidden = true; }, steps.length * COUNT_STEP_MS);
  }
  function run() {
    phase = 'race';
    t0 = 0;
    els.race.classList.add('is-running');
    // 숨은 탭 등으로 requestAnimationFrame 이 멈춰도 결승 시각 + 1.5초 뒤에는 반드시 끝낸다(순위는 이미 정해져 있음).
    later(function () { if (phase === 'race') { drawAt(plan.total); finishRace(); } }, plan.total + 1500);
    function step(ts) {
      if (phase !== 'race') return;
      if (!t0) t0 = ts;
      var done = drawAt(ts - t0);
      if (done) { raf = 0; later(finishRace, 650); return; }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  function finishRace() {
    if (phase !== 'race') return;
    clearTimers();
    drawAt(plan.total);
    phase = 'result';
    els.race.classList.remove('is-running');
    els.countdown.hidden = true;
    lanes.forEach(function (L) { L.li.classList.remove('is-leader', 'is-burst', 'is-stumble'); });
    var n = plan.n;
    var key = cfg.mode === 'lose' ? plan.order[n - 1] : plan.order[0];
    var name = cfg.names[key];
    history = CORE.pushHistory(history, { t: Date.now(), m: cfg.mode, n: n, who: name });
    saveHistory();
    renderResult(key, name);
    els.result.hidden = false;
    els.live.textContent = fmt(cfg.mode === 'lose' ? R.liveLose : R.liveWin, { name: name });
    try { if (navigator.vibrate) navigator.vibrate([40, 30, 60]); } catch (e) { /* noop */ }
    track('done');
    scrollTo(els.result, 'start');
  }
  function renderResult(key, name) {
    var lose = cfg.mode === 'lose';
    els.result.classList.toggle('is-lose', lose);
    els.kicker.textContent = lose ? R.loseKicker : R.winKicker;
    els.title.textContent = fmt(lose ? R.loseTitle : R.winTitle, { name: name });
    els.sub.textContent = fmt(lose ? R.loseSub : R.winSub, { name: name });
    els.ranking.innerHTML = '';
    plan.order.forEach(function (lane, r) {
      var li = el('li', 'rc-rank-row');
      li.appendChild(el('span', 'rc-rank-pos', placeLabel(r)));
      li.appendChild(el('span', 'rc-rank-animal', CORE.ANIMALS[lane])).setAttribute('aria-hidden', 'true');
      li.appendChild(el('span', 'rc-rank-name', cfg.names[lane]));
      if (lane === key) {
        li.classList.add(lose ? 'is-lose' : 'is-win');
        li.appendChild(el('span', 'rc-rank-tag', lose ? R.tagLose : R.tagWin));
      }
      els.ranking.appendChild(li);
    });
    renderHistory();
  }
  function whenText(t) {
    try { return new Date(t).toLocaleString(LANG, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function renderHistory() {
    els.history.innerHTML = '';
    history.forEach(function (h, i) {
      var li = el('li', 'rc-hist-row' + (i === 0 ? ' is-new' : ''));
      li.appendChild(el('span', 'rc-hist-who', fmt(h.m === 'lose' ? R.historyLose : R.historyWin, { name: h.who })));
      li.appendChild(el('span', 'rc-hist-meta', fmt(R.historyMeta, { n: h.n }) + ' · ' + whenText(h.t)));
      els.history.appendChild(li);
    });
    els.historyCard.hidden = !history.length;
  }
  function backToSetup() {
    clearTimers();
    phase = 'setup';
    els.race.hidden = true;
    els.race.classList.remove('is-running');
    els.countdown.hidden = true;
    els.setup.hidden = false;
    scrollTo(els.setup, 'start');
    focusSoft(els.start);
  }
  function raceAgain() {
    if (phase === 'countdown' || phase === 'race') return;
    startRace();
  }

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function namesLink() {
    var enc = CORE.encodeShare({ names: inputs.slice(0, count), mode: mode });
    return enc ? baseUrl() + '#d=' + enc : '';
  }
  function copyText(text, msg) {
    var done = function () { if (window.toast) window.toast(msg); };
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { /* noop */ }
      done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(fallback);
    else fallback();
  }
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var o = CORE.decodeShare(window.location.hash.slice(3));
    clearHash();
    if (!o) { els.error.textContent = E.badLink; els.error.hidden = false; return false; }
    if (phase !== 'setup') backToSetup();
    o.names.forEach(function (x, i) { inputs[i] = x; });
    for (var i = o.names.length; i < CORE.MAX_RUNNERS; i++) inputs[i] = '';
    els.entries.innerHTML = '';
    setMode(o.mode);
    setCount(o.names.length);
    save();
    els.note.hidden = false;
    return true;
  }

  if (window.setShareData) {
    window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: raceAgain });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.modeWin.addEventListener('click', function () { setMode('win'); save(); });
  els.modeLose.addEventListener('click', function () { setMode('lose'); save(); });
  els.less.addEventListener('click', function () { clearError(); setCount(count - 1); save(); });
  els.more.addEventListener('click', function () {
    clearError();
    setCount(count + 1);
    save();
    var last = els.entries.lastElementChild && els.entries.lastElementChild.querySelector('input');
    if (last && !last.value) focusSoft(last);
  });
  var saveTimer = null;
  els.entries.addEventListener('input', function (e) {
    var i = Number(e.target.getAttribute('data-i'));
    if (!(i >= 0)) return;
    inputs[i] = e.target.value;
    clearError();
    els.note.hidden = true;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 200);
  });
  els.entries.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.isComposing) return;
    e.preventDefault();
    var i = Number(e.target.getAttribute('data-i'));
    var next = els.entries.querySelector('input[data-i="' + (i + 1) + '"]');
    if (next) focusSoft(next);
    else startRace();
  });
  els.start.addEventListener('click', startRace);
  els.edit.addEventListener('click', backToSetup);
  els.link.addEventListener('click', function () { var u = namesLink(); if (u) copyText(u, R.linkCopied); });
  els.historyClear.addEventListener('click', function () {
    history = [];
    saveHistory();
    renderHistory();
  });
  window.addEventListener('resize', function () { measure(); if (plan && phase === 'result') drawAt(plan.total); });
  window.addEventListener('hashchange', function () { if (phase !== 'countdown' && phase !== 'race') loadShared(); });

  window.RACE_APP = {
    phase: function () { return phase; },
    mode: function () { return mode; },
    count: function () { return count; },
    inputs: function () { return inputs.slice(0, count); },
    names: function () { return cfg ? cfg.names.slice() : []; },
    order: function () { return plan ? plan.order.slice() : null; },
    total: function () { return plan ? plan.total : 0; },
    history: function () { return JSON.parse(JSON.stringify(history)); },
    link: namesLink
  };

  history = loadHistory();
  var saved = loadSaved();
  if (saved) {
    saved.names.forEach(function (x, i) { inputs[i] = x; });
    setMode(saved.mode);
    count = saved.count;
  } else {
    setMode('win');
  }
  renderEntries();
  loadShared();
})();
