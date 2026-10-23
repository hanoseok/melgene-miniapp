/* apps/bomb/bomb.js — 폭탄 돌리기: 시작 화면(누가·이름·심지·힌트·벌칙) → 게임 화면(폭탄 누르고 넘기기, 째깍 소리·진동) → 펑 → 결과·최근 기록 → 공통 끝 화면
 * 로직은 bomb-core.js(BOMB_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 터지는 시각을 먼저 정한다: 불붙이기를 누르는 순간 crypto 로 심지 길이(drawFuse)와 째깍 박자(planTicks), 첫 사람(firstHolder)을 정하고, 화면에는 보여 주지 않는다.
 * 탭이 숨으면(visibilitychange) 심지도 멈춘다(fusePause). 돌아오면 "계속하기"를 눌러야 다시 탄다.
 * 소리: WebAudio(사용자가 불붙이기를 누른 뒤에만 만든다), 끄기 버튼은 이 기기에 저장. 진동은 navigator.vibrate 가 있을 때만.
 * 움직임 줄이기(prefers-reduced-motion)면 터질 때 흔들림·파편 없이 짧은 번쩍임만.
 * 광고: 시작 화면 맨 아래 .mg-ad-start 한 자리(게임 화면으로 넘어가면 화면째 숨음). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 불붙일 때마다 track('start') 한 번, 터질 때 track('done') 한 번. 공유 링크로 이름만 불러온 것은 세지 않는다.
 * 저장: 설정(모드·이름·심지·힌트·벌칙·소리)과 최근 결과 10개만 이 기기 localStorage(try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): "이 이름으로 링크 복사" 버튼만(이름만, 결과·심지 없음). 끝 화면 공통 공유(setShareData)는 언어 없는 깨끗한 주소.
 * 디버그/검사용 읽기 전용 핸들: window.BOMB_APP (심지 길이는 끝난 뒤에만 알려 준다)
 */
(function () {
  'use strict';

  var CORE = window.BOMB_CORE;
  var I = window.PAGE_I18N || {};
  var LANG = I.lang || 'en';
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var MISSIONS = Array.isArray(I.missions) ? I.missions : [];
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_bomb_v1';
  var HIST = 'mg_bomb_hist_v1';
  var LOOP_MS = 30;
  var BOOM_MS = REDUCED ? 450 : 1500;
  var STEADY_SPARK_MS = 520;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), play: $('screen-play'), form: $('bm-form'), modeFree: $('mode-free'), modeNames: $('mode-names'),
    namesBox: $('names-box'), names: $('names'), namesCount: $('names-count'), hints: $('hints'), missions: $('missions'),
    error: $('error'), note: $('shared-note'), start: $('start-btn'),
    banner: $('play-banner'), mute: $('mute-btn'), stop: $('stop-btn'), stage: $('stage'), holder: $('holder'), bomb: $('bomb-btn'),
    passMsg: $('pass-msg'), passCount: $('pass-count'), paused: $('paused'), resume: $('resume-btn'), boom: $('boom'), live: $('live'),
    result: $('result'), title: $('res-title'), sub: $('res-sub'), stats: $('res-stats'), missionCard: $('mission-card'), missionText: $('mission-text'),
    edit: $('edit-btn'), link: $('link-btn'), historyCard: $('history-card'), history: $('history'), historyClear: $('history-clear'), year: $('year')
  };
  var fuseBtns = Array.prototype.slice.call(document.querySelectorAll('.bm-fuse-btn'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var settings = { mode: 'free', names: '', fuse: 'normal', hints: false, missions: false, muted: false };
  var phase = 'setup';          // setup | play | paused | boom | result
  var cfg = null;               // CORE.validate 결과 cfg
  var fuse = null;              // CORE.newFuse
  var ticks = [];               // 째깍 박자 시각(ms, 흐른 시간 기준)
  var ti = 0;                   // 다음에 울릴 박자 번호
  var holder = -1;              // 들고 있는 사람(이름 모드)
  var passes = 0;
  var lastPassAt = null;
  var loopId = 0;
  var timers = [];
  var deck = null;
  var history = [];
  var audio = null;             // { ctx, master }
  var tickHigh = false;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, key) { return vars[key] != null ? vars[key] : m; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function now() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* noop */ } }
  function seconds(ms) {
    try { return new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(Math.floor(ms / 100) / 10); } catch (e) { return (Math.floor(ms / 100) / 10).toFixed(1); }
  }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function loadSaved() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (o && typeof o === 'object') {
        return {
          mode: o.mode === 'names' ? 'names' : 'free', names: typeof o.names === 'string' ? o.names.slice(0, 400) : '',
          fuse: CORE.FUSES[o.fuse] ? o.fuse : 'normal', hints: !!o.hints, missions: !!o.missions, muted: !!o.muted
        };
      }
    } catch (e) { /* noop */ }
    return null;
  }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify(settings)); } catch (e) { /* noop */ }
  }
  function loadHistory() {
    try { return CORE.sanitizeHistory(JSON.parse(window.localStorage.getItem(HIST) || '[]')); } catch (e) { return []; }
  }
  function saveHistory() {
    try { window.localStorage.setItem(HIST, JSON.stringify(history)); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 소리 (WebAudio, 사용자 동작 뒤에만)
  function ensureAudio() {
    if (audio) { try { if (audio.ctx.state === 'suspended') audio.ctx.resume(); } catch (e) { /* noop */ } return audio; }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      var ctx = new AC();
      var master = ctx.createGain();
      master.gain.value = settings.muted ? 0 : 0.9;
      master.connect(ctx.destination);
      audio = { ctx: ctx, master: master };
    } catch (e) { audio = null; }
    return audio;
  }
  function setMuted(m) {
    settings.muted = !!m;
    els.mute.textContent = settings.muted ? '🔇' : '🔊';
    els.mute.setAttribute('aria-pressed', String(settings.muted));
    els.mute.setAttribute('aria-label', settings.muted ? U.soundOn : U.soundOff);
    if (audio) { try { audio.master.gain.setValueAtTime(settings.muted ? 0 : 0.9, audio.ctx.currentTime); } catch (e) { /* noop */ } }
  }
  function playTick(fast) {
    if (!audio || settings.muted) return;
    try {
      var c = audio.ctx;
      var t = c.currentTime;
      var o = c.createOscillator();
      var g = c.createGain();
      tickHigh = !tickHigh;
      o.type = 'square';
      o.frequency.value = (tickHigh ? 1650 : 1250) + (fast ? 250 : 0);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
      o.connect(g); g.connect(audio.master);
      o.start(t); o.stop(t + 0.06);
    } catch (e) { /* noop */ }
  }
  function playBoom() {
    if (!audio || settings.muted) return;
    try {
      var c = audio.ctx;
      var t = c.currentTime;
      var len = Math.floor(c.sampleRate * 1.4);
      var b = c.createBuffer(1, len, c.sampleRate);
      var d = b.getChannelData(0);
      var seed = new Uint32Array(len);
      for (var off = 0; off < len; off += 16384) window.crypto.getRandomValues(seed.subarray(off, Math.min(len, off + 16384)));
      for (var i = 0; i < len; i++) d[i] = (seed[i] / 2147483648 - 1) * Math.pow(1 - i / len, 2.2);
      var src = c.createBufferSource();
      src.buffer = b;
      var lp = c.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(2400, t);
      lp.frequency.exponentialRampToValueAtTime(90, t + 1.2);
      var g = c.createGain();
      g.gain.setValueAtTime(1, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      src.connect(lp); lp.connect(g); g.connect(audio.master);
      var o = c.createOscillator();
      var og = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(110, t);
      o.frequency.exponentialRampToValueAtTime(38, t + 0.6);
      og.gain.setValueAtTime(0.9, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      o.connect(og); og.connect(audio.master);
      src.start(t); o.start(t); o.stop(t + 0.85);
    } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 시작 화면
  function setMode(m) {
    settings.mode = m === 'names' ? 'names' : 'free';
    els.modeFree.setAttribute('aria-checked', String(settings.mode === 'free'));
    els.modeNames.setAttribute('aria-checked', String(settings.mode === 'names'));
    els.namesBox.hidden = settings.mode !== 'names';
    updateCount();
  }
  function setFuse(k) {
    settings.fuse = CORE.FUSES[k] ? k : 'normal';
    fuseBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-fuse') === settings.fuse)); });
  }
  function updateCount() {
    var n = CORE.parseNames(els.names.value).names.length;
    els.namesCount.textContent = n ? fmt(U.namesCount, { n: n }) : '';
    els.namesCount.classList.toggle('is-bad', n > CORE.MAX_PLAYERS || (n > 0 && n < CORE.MIN_PLAYERS));
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(msg) { els.error.textContent = msg; els.error.hidden = false; scrollTo(els.error, 'center'); }

  // ---------------------------------------------------------------- 게임
  function bannerText() { return settings.fuse === 'short' ? U.bannerShort : settings.fuse === 'long' ? U.bannerLong : U.bannerNormal; }
  function startGame() {
    if (phase === 'play' || phase === 'paused' || phase === 'boom') return;
    settings.names = els.names.value;
    var v = CORE.validate({ mode: settings.mode, names: settings.names, fuse: settings.fuse, hints: settings.hints, missions: settings.missions });
    if (!v.ok) { showError(fmt(E[v.error] || E.namesTooFew, { n: v.n })); return; }
    clearError();
    els.note.hidden = true;
    clearTimers();
    stopLoop();
    cfg = v.cfg;
    save();
    ensureAudio();                                     // 사용자가 누른 순간에만 소리를 준비한다
    fuse = CORE.newFuse(CORE.drawFuse(cfg.fuse));      // 터지는 시각은 여기서 정해진다(crypto) — 화면에는 보이지 않음
    ticks = CORE.planTicks(fuse.total);
    ti = 0;
    holder = cfg.mode === 'names' ? CORE.firstHolder(cfg.names.length) : -1;
    passes = 0;
    lastPassAt = null;
    if (cfg.missions && (!deck || deck.len !== MISSIONS.length)) deck = CORE.missionDeck(MISSIONS.length);
    els.setup.hidden = true;
    els.play.hidden = false;
    els.result.hidden = true;
    els.stage.hidden = false;
    els.paused.hidden = true;
    els.boom.hidden = true;
    els.play.classList.remove('is-exploded');
    els.play.classList.toggle('has-hints', cfg.hints);
    els.banner.textContent = bannerText();
    els.bomb.disabled = false;
    els.passMsg.textContent = '';
    renderHolder();
    setSpark(STEADY_SPARK_MS);
    scrollTo(els.play, 'start');
    track('start');
    els.live.textContent = U.liveStart;
    phase = 'play';
    CORE.fuseStart(fuse, now());
    startLoop();
    focusSoft(els.bomb);
  }
  function renderHolder() {
    var named = cfg && cfg.mode === 'names';
    els.holder.textContent = named ? '💣 ' + fmt(U.holding, { name: cfg.names[holder] }) : U.holdingFree;
    els.passCount.textContent = fmt(U.passCount, { p: passes });
  }
  function setSpark(ms) { els.play.style.setProperty('--spark-ms', Math.round(ms) + 'ms'); }
  function startLoop() { stopLoop(); loopId = setInterval(step, LOOP_MS); step(); }
  function stopLoop() { if (loopId) clearInterval(loopId); loopId = 0; }
  function step() {
    if (phase !== 'play') return;
    var t = CORE.fuseElapsed(fuse, now());
    var rang = false;
    while (ti < ticks.length && ticks[ti] <= t) { ti++; rang = true; }
    if (rang) {
      var gap = CORE.tickGap(ticks, t);
      playTick(gap < 220);
      vibrate(gap < 220 ? 12 : 22);
      els.bomb.classList.remove('is-tick');
      void els.bomb.offsetWidth;   // 애니메이션 다시 시작
      els.bomb.classList.add('is-tick');
      setSpark(cfg.hints ? Math.max(90, Math.min(900, gap * 0.9)) : STEADY_SPARK_MS);
    }
    if (CORE.fuseDone(fuse, now())) explode();
  }
  function pass() {
    if (phase !== 'play') return;
    var t = now();
    if (!CORE.canPass(lastPassAt, t)) return;
    lastPassAt = t;
    passes++;
    if (cfg.mode === 'names') {
      holder = CORE.nextHolder(holder, cfg.names.length);
      els.passMsg.textContent = fmt(U.passTo, { name: cfg.names[holder] });
    } else {
      els.passMsg.textContent = U.passFree;
    }
    renderHolder();
    els.passMsg.classList.remove('is-pop');
    void els.passMsg.offsetWidth;
    els.passMsg.classList.add('is-pop');
    els.bomb.disabled = true;
    later(function () { if (phase === 'play') els.bomb.disabled = false; }, CORE.PASS_COOLDOWN_MS);
    vibrate(30);
  }
  function pause() {
    if (phase !== 'play') return;
    CORE.fusePause(fuse, now());
    stopLoop();
    phase = 'paused';
    els.paused.hidden = false;
    els.bomb.disabled = true;
    els.play.classList.add('is-paused');
    try { if (audio && audio.ctx.state === 'running') audio.ctx.suspend(); } catch (e) { /* noop */ }
  }
  function resume() {
    if (phase !== 'paused' || document.hidden) return;
    ensureAudio();
    els.paused.hidden = true;
    els.bomb.disabled = false;
    els.play.classList.remove('is-paused');
    phase = 'play';
    CORE.fuseStart(fuse, now());
    startLoop();
    focusSoft(els.bomb);
  }
  function explode() {
    if (phase !== 'play') return;
    stopLoop();
    clearTimers();
    CORE.fusePause(fuse, now());
    phase = 'boom';
    els.bomb.disabled = true;
    els.play.classList.add('is-exploded');
    els.boom.classList.toggle('is-reduced', !!REDUCED);
    els.boom.hidden = false;
    playBoom();
    vibrate([320, 90, 420]);
    var named = cfg.mode === 'names';
    var who = named ? cfg.names[holder] : '';
    var mission = cfg.missions && MISSIONS.length ? MISSIONS[CORE.nextMission(deck)] : '';
    history = CORE.pushHistory(history, { t: Date.now(), who: who, n: named ? cfg.names.length : 0, p: passes, ms: fuse.total, f: cfg.fuse });
    saveHistory();
    els.live.textContent = named ? fmt(R.liveLoser, { name: who }) : R.liveFree;
    track('done');
    later(function () { showResult(who, mission); }, BOOM_MS);
  }
  function showResult(who, mission) {
    if (phase !== 'boom') return;
    phase = 'result';
    els.boom.hidden = true;
    els.stage.hidden = true;
    var named = cfg.mode === 'names';
    els.title.textContent = named ? fmt(R.loserTitle, { name: who }) : R.freeTitle;
    els.sub.textContent = named ? fmt(R.loserSub, { name: who }) : R.freeSub;
    els.stats.textContent = fmt(R.stats, { s: seconds(fuse.total), p: passes });
    els.missionCard.hidden = !mission;
    els.missionText.textContent = mission || '';
    els.link.hidden = !named;
    renderHistory();
    els.result.hidden = false;
    scrollTo(els.result, 'start');
  }
  function whenText(t) {
    try { return new Date(t).toLocaleString(LANG, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }
  function renderHistory() {
    els.history.innerHTML = '';
    history.forEach(function (h, i) {
      var li = el('li', 'bm-hist-row' + (i === 0 ? ' is-new' : ''));
      li.appendChild(el('span', 'bm-hist-who', h.who ? '💥 ' + h.who : R.historyFree));
      li.appendChild(el('span', 'bm-hist-meta', fmt(R.historyMeta, { s: seconds(h.ms), p: h.p }) + ' · ' + whenText(h.t)));
      els.history.appendChild(li);
    });
    els.historyCard.hidden = !history.length;
  }
  function backToSetup() {
    stopLoop();
    clearTimers();
    phase = 'setup';
    els.play.hidden = true;
    els.paused.hidden = true;
    els.boom.hidden = true;
    els.setup.hidden = false;
    scrollTo(els.setup, 'start');
    focusSoft(els.start);
  }
  function playAgain() {
    if (phase === 'play' || phase === 'paused' || phase === 'boom') return;
    startGame();
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
    var list = cfg && cfg.mode === 'names' ? cfg.names : CORE.parseNames(els.names.value).names;
    var enc = CORE.encodeShare({ names: list });
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
    els.names.value = o.names.join('\n');
    settings.names = els.names.value;
    setMode('names');
    save();
    els.note.hidden = false;
    return true;
  }

  if (window.setShareData) {
    window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: playAgain });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.modeFree.addEventListener('click', function () { clearError(); setMode('free'); save(); });
  els.modeNames.addEventListener('click', function () { clearError(); setMode('names'); save(); if (!els.names.value) focusSoft(els.names); });
  fuseBtns.forEach(function (b) { b.addEventListener('click', function () { setFuse(b.getAttribute('data-fuse')); save(); }); });
  els.hints.addEventListener('change', function () { settings.hints = els.hints.checked; save(); });
  els.missions.addEventListener('change', function () { settings.missions = els.missions.checked; save(); });
  var saveTimer = null;
  els.names.addEventListener('input', function () {
    clearError();
    els.note.hidden = true;
    updateCount();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { settings.names = els.names.value; save(); }, 200);
  });
  els.start.addEventListener('click', startGame);
  els.bomb.addEventListener('click', pass);
  els.mute.addEventListener('click', function () { setMuted(!settings.muted); save(); });
  els.stop.addEventListener('click', backToSetup);
  els.resume.addEventListener('click', resume);
  els.edit.addEventListener('click', backToSetup);
  els.link.addEventListener('click', function () { var u = namesLink(); if (u) copyText(u, R.linkCopied); });
  els.historyClear.addEventListener('click', function () {
    history = [];
    saveHistory();
    renderHistory();
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pause(); });
  window.addEventListener('pagehide', pause);
  window.addEventListener('hashchange', function () { if (phase === 'setup' || phase === 'result') loadShared(); });

  window.BOMB_APP = {
    phase: function () { return phase; },
    mode: function () { return settings.mode; },
    fuseMode: function () { return settings.fuse; },
    names: function () { return cfg ? cfg.names.slice() : []; },
    holder: function () { return holder; },
    passes: function () { return passes; },
    elapsed: function () { return fuse ? CORE.fuseElapsed(fuse, now()) : 0; },
    total: function () { return fuse && (phase === 'boom' || phase === 'result') ? fuse.total : null; },
    history: function () { return JSON.parse(JSON.stringify(history)); },
    link: namesLink
  };

  history = loadHistory();
  var saved = loadSaved();
  if (saved) settings = saved;
  els.names.value = settings.names;
  els.hints.checked = settings.hints;
  els.missions.checked = settings.missions;
  setMode(settings.mode);
  setFuse(settings.fuse);
  setMuted(settings.muted);
  loadShared();
})();
