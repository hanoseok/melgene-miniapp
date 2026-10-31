/* apps/finger/finger.js — 손가락 룰렛: 시작 화면(무엇을 뽑나·몇 명·몇 팀) → 손가락 판(멀티터치 또는 클릭 점) → 가만히 → 뽑기 → 결과·최근 기록 → 공통 끝 화면
 * 로직은 finger-core.js(FINGER_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 입력: Pointer Events. 판(#pad)은 touch-action:none + touchstart/touchmove/contextmenu/gesturestart 막기(스크롤·확대·길게 누르기 메뉴 없음, iOS 포함).
 *   손가락(touch/pen): 누르는 동안만 점이 있다(최대 10개). 마우스이거나 화면이 멀티터치를 못 하면(maxTouchPoints < 2) 클릭 모드:
 *   누를 때마다 점이 생기고(다시 누르면 지움) Go 를 눌러 뽑는다.
 * 뽑는 순간: 손가락 수가 바뀌지 않은 채 STABLE_MS(클릭 모드는 Go 뒤 GO_MS)가 지나면, 그 순간 판 위에 있는 점들 사이에서 crypto 로 뽑는다(CORE.decide).
 *   점 색은 들어온 순서로 정해지고 결과와 무관하다. 손가락을 올리거나 떼면 기다림이 처음부터.
 * 연출: 나머지는 흐려지고 뽑힌 원이 커진다(팀 모드는 팀 색으로 바뀜). 움직임 줄이기면 바로. 진동은 navigator.vibrate 가 있을 때만.
 * 광고: 시작 화면 맨 아래 .mg-ad-start 한 자리(판 화면으로 넘어가면 화면째 숨음). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 판에 첫 손가락(첫 점)이 올라갈 때 track('start') 한 번, 결과 화면이 보일 때 track('done') 한 번. 다시 하기면 다시 한 번씩.
 * 저장: 설정(모드·N·팀 수)만 이 기기 localStorage(try/catch). 최근 결과 10개는 메모리에만. 서버로 보내는 것 없음.
 * 디버그/검사용 읽기 전용 핸들: window.FINGER_APP
 */
(function () {
  'use strict';

  var CORE = window.FINGER_CORE;
  var I = window.PAGE_I18N || {};
  var LANG = I.lang || 'en';
  var U = I.ui || {};
  var R = I.result || {};
  var TEAM_NAMES = Array.isArray(R.teamNames) ? R.teamNames : [];
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_finger_v1';
  var LOOP_MS = 40;
  var REVEAL_MS = REDUCED ? 0 : 1300;
  var DOT_HIT = 34;  // 클릭 모드: 이 거리(px) 안을 다시 누르면 그 점을 지운다
  var COLORS = ['#ff5d8f', '#4cc9f0', '#ffd23f', '#7bdc65', '#b388ff', '#ff9f43', '#2ee6c9', '#ff6b6b', '#5b8cff', '#f78cff'];
  var TEAM_COLORS = ['#ff4d6d', '#3d8bff', '#2ecc71', '#ffc93c'];

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), play: $('screen-play'), form: $('fg-form'), nBox: $('n-box'), nValue: $('n-value'), nLess: $('n-less'), nMore: $('n-more'),
    teamsBox: $('teams-box'), start: $('start-btn'), banner: $('play-banner'), settingsBtn: $('settings-btn'), pad: $('pad'), dots: $('dots'),
    status: $('pad-status'), count: $('pad-count'), clickBar: $('click-bar'), go: $('go-btn'), clear: $('clear-btn'), live: $('live'),
    result: $('result'), title: $('res-title'), sub: $('res-sub'), teams: $('res-teams'), edit: $('edit-btn'),
    historyCard: $('history-card'), history: $('history'), historyClear: $('history-clear'), year: $('year')
  };
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('.fg-mode-btn'));
  var teamBtns = Array.prototype.slice.call(document.querySelectorAll('.fg-team-btn'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var settings = CORE.normalize({});
  var phase = 'setup';        // setup | wait | hold | reveal | result
  var points = [];            // { id, fx, fy, color, el, kind }
  var inputMode = null;       // null | 'touch' | 'click' (한 판 안에서 정해짐)
  var changedAt = null;       // 손가락 수가 마지막으로 바뀐 시각(performance.now)
  var holdMs = CORE.STABLE_MS;
  var roundStarted = false;
  var colorNext = 0;
  var dotSeq = 0;
  var loopId = 0;
  var timers = [];
  var last = null;            // 마지막 결정(CORE.decide 결과)
  var history = [];           // 메모리에만
  var decisions = 0;
  var maxedAt = 0;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, key) { return vars[key] != null ? vars[key] : m; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* noop */ } }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function multiTouch() { return (navigator.maxTouchPoints || 0) >= 2; }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function loadSaved() {
    try { var o = JSON.parse(window.localStorage.getItem(STORE) || 'null'); if (o && typeof o === 'object') return CORE.normalize(o); } catch (e) { /* noop */ }
    return null;
  }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify(settings)); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 시작 화면
  function renderSettings() {
    modeBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-mode') === settings.mode)); });
    teamBtns.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-teams')) === settings.teams)); });
    els.nBox.hidden = settings.mode !== 'n';
    els.teamsBox.hidden = settings.mode !== 'teams';
    els.nValue.textContent = fmt(U.nValue, { n: settings.n });
    els.nLess.disabled = settings.n <= 1;
    els.nMore.disabled = settings.n >= CORE.MAX_N;
  }
  function setSetting(k, v) {
    var o = { mode: settings.mode, n: settings.n, teams: settings.teams };
    o[k] = v;
    settings = CORE.normalize(o);
    renderSettings();
    save();
  }
  function bannerText() {
    if (settings.mode === 'n') return fmt(U.bannerN, { n: settings.n });
    if (settings.mode === 'teams') return fmt(U.bannerTeams, { t: settings.teams });
    return U.bannerOne;
  }

  // ---------------------------------------------------------------- 판 열기 · 닫기
  function openPad() {
    if (phase !== 'setup') return;
    els.setup.hidden = true;
    els.play.hidden = false;
    els.banner.textContent = bannerText();
    resetRound();
    scrollTo(els.play, 'start');
    startLoop();
  }
  function resetRound() {
    clearTimers();
    clearPoints();
    inputMode = null;
    changedAt = null;
    roundStarted = false;
    colorNext = 0;
    last = null;
    phase = 'wait';
    els.pad.classList.remove('is-reveal', 'is-done', 'is-hold');
    els.pad.style.setProperty('--p', '0');
    els.result.hidden = true;
    renderPad();
  }
  function backToSetup() {
    stopLoop();
    clearTimers();
    clearPoints();
    phase = 'setup';
    els.play.hidden = true;
    els.result.hidden = true;
    els.setup.hidden = false;
    scrollTo(els.setup, 'start');
    focusSoft(els.start);
  }
  function playAgain() {
    if (phase === 'setup') { openPad(); return; }
    if (phase === 'reveal') return;
    resetRound();
    startLoop();
    scrollTo(els.play, 'start');
  }

  // ---------------------------------------------------------------- 점
  function clearPoints() {
    points.forEach(function (p) { if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el); });
    points = [];
  }
  function padPos(e) {
    var r = els.pad.getBoundingClientRect();
    return { fx: Math.max(0, Math.min(1, (e.clientX - r.left) / Math.max(1, r.width))), fy: Math.max(0, Math.min(1, (e.clientY - r.top) / Math.max(1, r.height))), r: r };
  }
  function placeEl(p) { p.el.style.left = (p.fx * 100) + '%'; p.el.style.top = (p.fy * 100) + '%'; }
  function addPoint(id, pos, kind) {
    var color = COLORS[colorNext % COLORS.length];
    colorNext++;
    var d = el('span', 'fg-dot' + (kind === 'dot' ? ' is-click' : ''));
    d.style.setProperty('--c', color);
    d.appendChild(el('span', 'fg-dot-ring'));
    var p = { id: id, fx: pos.fx, fy: pos.fy, color: color, el: d, kind: kind };
    placeEl(p);
    els.dots.appendChild(d);
    points.push(p);
    changed();
    vibrate(15);
  }
  function removePoint(id) {
    for (var i = 0; i < points.length; i++) {
      if (points[i].id === id) {
        var p = points.splice(i, 1)[0];
        if (p.el.parentNode) p.el.parentNode.removeChild(p.el);
        changed();
        return true;
      }
    }
    return false;
  }
  function findPoint(id) { for (var i = 0; i < points.length; i++) if (points[i].id === id) return points[i]; return null; }
  function changed() {
    changedAt = now();
    if (inputMode === 'click' && phase === 'hold') phase = 'wait';   // Go 뒤 점이 바뀌면 다시 Go
    if (!roundStarted && points.length > 0) { roundStarted = true; track('start'); }
    if (inputMode === 'touch' && !points.length) inputMode = null;   // 모두 떼면 입력 방식을 다시 고를 수 있다
    renderPad();
  }

  // ---------------------------------------------------------------- 입력 (Pointer Events)
  function onDown(e) {
    if (phase !== 'wait' && phase !== 'hold') return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    var mouse = e.pointerType === 'mouse';
    if (!inputMode) inputMode = (mouse || !multiTouch()) ? 'click' : 'touch';
    var pos = padPos(e);
    if (inputMode === 'touch') {
      if (mouse || findPoint('t' + e.pointerId)) return;
      if (points.length >= CORE.MAX_TOUCHES) { maxedAt = now(); renderPad(); return; }
      try { els.pad.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      addPoint('t' + e.pointerId, pos, 'touch');
      return;
    }
    // 클릭 모드: 가까운 점을 누르면 지우고, 아니면 새 점
    for (var i = points.length - 1; i >= 0; i--) {
      var p = points[i];
      var dx = (p.fx - pos.fx) * pos.r.width, dy = (p.fy - pos.fy) * pos.r.height;
      if (dx * dx + dy * dy <= DOT_HIT * DOT_HIT) { removePoint(p.id); return; }
    }
    if (points.length >= CORE.MAX_TOUCHES) { maxedAt = now(); renderPad(); return; }
    addPoint('d' + (++dotSeq), pos, 'dot');
  }
  function onMove(e) {
    if (inputMode !== 'touch' || (phase !== 'wait' && phase !== 'hold')) return;
    var p = findPoint('t' + e.pointerId);
    if (!p) return;
    e.preventDefault();
    var pos = padPos(e);
    p.fx = pos.fx; p.fy = pos.fy;
    placeEl(p);
  }
  function onUp(e) {
    if (inputMode !== 'touch' || (phase !== 'wait' && phase !== 'hold')) return;
    removePoint('t' + e.pointerId);
  }
  function goClick() {
    if (inputMode !== 'click' || phase !== 'wait' || !CORE.canDecide(settings, points.length)) return;
    phase = 'hold';
    changedAt = now();
    renderPad();
  }

  // ---------------------------------------------------------------- 기다림 → 뽑기
  function startLoop() { stopLoop(); loopId = setInterval(step, LOOP_MS); step(); }
  function stopLoop() { if (loopId) clearInterval(loopId); loopId = 0; }
  function step() {
    if (phase !== 'wait' && phase !== 'hold') return;
    var t = now();
    var ok = CORE.canDecide(settings, points.length);
    if (inputMode === 'touch') {
      if (ok && phase === 'wait') { phase = 'hold'; renderPad(); }
      else if (!ok && phase === 'hold') { phase = 'wait'; renderPad(); }
      holdMs = CORE.STABLE_MS;
    } else {
      holdMs = CORE.GO_MS;
      if (phase === 'hold' && !ok) { phase = 'wait'; renderPad(); }
    }
    var prog = phase === 'hold' ? CORE.holdProgress(changedAt, t, holdMs) : 0;
    els.pad.style.setProperty('--p', prog.toFixed(3));
    if (maxedAt && t - maxedAt > 1800) { maxedAt = 0; renderPad(); }
    if (phase === 'hold' && CORE.holdDone(changedAt, t, holdMs)) decide();
  }
  function decide() {
    var ids = points.map(function (p) { return p.id; });
    var res = CORE.decide(settings, ids);   // 이 순간 판 위의 점들 사이에서 crypto 로 뽑는다
    if (!res) { phase = 'wait'; renderPad(); return; }
    stopLoop();
    last = res;
    decisions++;
    phase = 'reveal';
    els.pad.classList.add('is-reveal');
    els.pad.classList.remove('is-hold');
    points.forEach(function (p) {
      if (res.mode === 'teams') {
        var team = res.assign[p.id];
        p.el.style.setProperty('--c', TEAM_COLORS[team]);
        p.el.classList.add('is-team');
        p.el.setAttribute('data-team', String(team + 1));
      } else if (res.winners.indexOf(p.id) >= 0) p.el.classList.add('is-win');
      else p.el.classList.add('is-out');
    });
    vibrate([60, 40, 140]);
    var item = { t: Date.now(), mode: res.mode, k: res.k };
    if (res.mode === 'teams') { item.teams = res.teams; item.sizes = res.sizes.slice(); } else item.n = res.n;
    history = CORE.pushHistory(history, item);
    renderPad();
    later(showResult, REVEAL_MS);
  }
  function showResult() {
    if (phase !== 'reveal' || !last) return;
    phase = 'result';
    els.pad.classList.add('is-done');
    var res = last;
    els.teams.innerHTML = '';
    if (res.mode === 'teams') {
      els.title.textContent = fmt(R.titleTeams, { t: res.teams });
      els.sub.textContent = fmt(R.subTeams, { k: res.k, t: res.teams });
      res.sizes.forEach(function (c, i) {
        var li = el('li', 'fg-team');
        var sw = el('span', 'fg-swatch');
        sw.style.setProperty('--c', TEAM_COLORS[i]);
        sw.textContent = String(i + 1);
        li.appendChild(sw);
        li.appendChild(el('span', 'fg-team-name', fmt(R.teamLine, { name: TEAM_NAMES[i] || String(i + 1), c: c })));
        els.teams.appendChild(li);
      });
      els.teams.hidden = false;
      els.live.textContent = fmt(R.liveTeams, { t: res.teams });
    } else {
      var one = res.mode === 'one';
      els.title.textContent = one ? R.titleOne : fmt(R.titleN, { n: res.n });
      els.sub.textContent = one ? fmt(R.subOne, { k: res.k }) : fmt(R.subN, { n: res.n, k: res.k });
      els.teams.hidden = true;
      els.live.textContent = one ? fmt(R.liveOne, { k: res.k }) : fmt(R.liveN, { n: res.n, k: res.k });
    }
    renderPad();
    renderHistory();
    els.result.hidden = false;
    track('done');
    scrollTo(els.result, 'start');
  }

  // ---------------------------------------------------------------- 그리기
  function renderPad() {
    var c = points.length;
    var m = CORE.minTouches(settings);
    var s = '';
    if (phase === 'reveal') s = U.picking;
    else if (phase === 'result') s = '';
    else if (maxedAt) s = U.maxed;
    else if (!c) s = (inputMode === 'click' || !multiTouch()) ? U.waitClick : U.waitTouch;
    else if (c < m) s = fmt(U.needMore, { c: c, m: m });
    else if (phase === 'hold') s = U.hold;
    else s = U.clickHint;
    els.status.textContent = s;
    els.count.textContent = c && phase !== 'result' ? fmt(U.liveCount, { c: c }) : '';
    els.pad.classList.toggle('is-hold', phase === 'hold');
    els.pad.classList.toggle('is-empty', !c);
    var clickUi = (inputMode === 'click' || (!inputMode && !multiTouch())) && (phase === 'wait' || phase === 'hold');
    els.clickBar.hidden = !clickUi;
    els.go.disabled = !(inputMode === 'click' && phase === 'wait' && CORE.canDecide(settings, c));
    els.clear.disabled = !c || phase !== 'wait';
  }
  function whenText(t) {
    try { return new Date(t).toLocaleTimeString(LANG, { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function renderHistory() {
    els.history.innerHTML = '';
    history.forEach(function (h, i) {
      var li = el('li', 'fg-hist-row' + (i === 0 ? ' is-new' : ''));
      var txt = h.mode === 'teams' ? '🎨 ' + fmt(R.historyTeams, { k: h.k, t: h.teams }) + ' (' + h.sizes.join('·') + ')'
        : h.mode === 'n' ? '✌️ ' + fmt(R.historyN, { n: h.n, k: h.k }) : '👆 ' + fmt(R.historyOne, { k: h.k });
      li.appendChild(el('span', 'fg-hist-what', txt));
      li.appendChild(el('span', 'fg-hist-meta', whenText(h.t)));
      els.history.appendChild(li);
    });
    els.historyCard.hidden = !history.length;
  }

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  if (window.setShareData) window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  if (window.setRetry) window.setRetry({ label: R.again, action: playAgain });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  modeBtns.forEach(function (b) { b.addEventListener('click', function () { setSetting('mode', b.getAttribute('data-mode')); }); });
  teamBtns.forEach(function (b) { b.addEventListener('click', function () { setSetting('teams', Number(b.getAttribute('data-teams'))); }); });
  els.nLess.addEventListener('click', function () { setSetting('n', settings.n - 1); });
  els.nMore.addEventListener('click', function () { setSetting('n', settings.n + 1); });
  els.start.addEventListener('click', openPad);
  els.settingsBtn.addEventListener('click', backToSetup);
  els.edit.addEventListener('click', backToSetup);
  els.go.addEventListener('click', goClick);
  els.clear.addEventListener('click', function () { if (phase !== 'wait') return; clearPoints(); changed(); });
  els.historyClear.addEventListener('click', function () { history = []; renderHistory(); });

  var pad = els.pad;
  pad.addEventListener('pointerdown', onDown);
  pad.addEventListener('pointermove', onMove);
  pad.addEventListener('pointerup', onUp);
  pad.addEventListener('pointercancel', onUp);
  pad.addEventListener('lostpointercapture', onUp);
  // 스크롤·확대·길게 누르기 메뉴·텍스트 선택 막기 (iOS 포함)
  var stop = function (e) { if (e.cancelable) e.preventDefault(); };
  pad.addEventListener('touchstart', stop, { passive: false });
  pad.addEventListener('touchmove', stop, { passive: false });
  pad.addEventListener('touchend', stop, { passive: false });
  pad.addEventListener('contextmenu', stop);
  pad.addEventListener('selectstart', stop);
  pad.addEventListener('dragstart', stop);
  document.addEventListener('gesturestart', function (e) { if (phase === 'wait' || phase === 'hold') stop(e); }, { passive: false });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden || (phase !== 'wait' && phase !== 'hold')) return;
    if (inputMode === 'touch') { clearPoints(); changed(); }   // 숨으면 손가락은 이미 떨어진 것
    else if (phase === 'hold') { phase = 'wait'; renderPad(); }
  });

  window.FINGER_APP = {
    phase: function () { return phase; },
    settings: function () { return JSON.parse(JSON.stringify(settings)); },
    count: function () { return points.length; },
    inputMode: function () { return inputMode; },
    points: function () { return points.map(function (p) { return { id: p.id, color: p.color, kind: p.kind, win: p.el.classList.contains('is-win'), out: p.el.classList.contains('is-out'), team: p.el.getAttribute('data-team') }; }); },
    last: function () { return last && (phase === 'reveal' || phase === 'result') ? JSON.parse(JSON.stringify(last)) : null; },
    history: function () { return JSON.parse(JSON.stringify(history)); },
    decisions: function () { return decisions; }
  };

  var saved = loadSaved();
  if (saved) settings = saved;
  renderSettings();
})();
