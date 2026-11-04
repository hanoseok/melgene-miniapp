/* apps/truth/truth.js — 진실 게임: 시작(이름·팩) → 진행(이번 차례 → 진실/도전/랜덤 → 카드 한 장 → 다른 카드·완료) → 끝(요약 숫자 + 공통 끝 화면)
 * 로직은 truth-core.js(TRUTH_CORE, 언어 무관), 문구·카드는 페이지에 인라인된 PAGE_I18N(언어별).
 * 순서: 이름 모드면 crypto 로 섞은 바퀴(모두 한 번씩, 연속 차례 없음). 이름 없이면 "옆 사람에게 넘기기".
 * 카드: 팩·종류별 섞은 덱에서 한 장씩(세션 안 반복 없음). 랜덤 = crypto 반반.
 * 광고: 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 숨으면 같이 숨음). 진행 화면에는 없음. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 게임을 시작할 때(첫 차례) track('start') 한 번, 끝 화면이 보일 때 track('done') 한 번. 다시 하기면 다시 한 번씩.
 * 저장: 마지막 모드·이름 목록·팩만 이 기기 localStorage(mg_truth_v1, try/catch). 서버로 보내지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.TRUTH_APP
 */
(function () {
  'use strict';

  var CORE = window.TRUTH_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var ER = I.errors || {};
  var EN = I.end || {};
  var PACKS = I.packs || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_truth_v1';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), play: $('screen-play'), end: $('screen-end'),
    form: $('td-form'), modeNames: $('mode-names'), modeFree: $('mode-free'), namesBox: $('names-box'), names: $('names'),
    namesCount: $('names-count'), freeBox: $('free-box'), error: $('error'), start: $('start-btn'),
    round: $('round'), packChip: $('pack-chip'), finish: $('finish-btn'),
    turnKicker: $('turn-kicker'), turnName: $('turn-name'), turnSub: $('turn-sub'),
    choose: $('choose'), flip: $('flip'), cardType: $('card-type'), cardText: $('card-text'), randomNote: $('random-note'),
    actions: $('card-actions'), skip: $('skip-btn'), next: $('next-btn'), live: $('live'),
    sRounds: $('stat-rounds'), sTruths: $('stat-truths'), sDares: $('stat-dares'), sSkips: $('stat-skips'),
    endSub: $('end-sub'), endNone: $('end-none'), edit: $('edit-btn'), year: $('year')
  };
  var pickBtns = Array.prototype.slice.call(document.querySelectorAll('.td-pick'));
  var packBtns = Array.prototype.slice.call(document.querySelectorAll('.td-pack'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = 'names';
  var pack = CORE.PACKS[0];
  var cfg = null;        // 지금 게임 설정 { mode, names, pack }
  var turns = null;      // CORE.newTurns (이름 모드)
  var decks = null;      // CORE.newDecks
  var stats = CORE.newStats();
  var turnNo = 0;
  var player = -1;
  var card = null;       // { type, idx, text, random }
  var flipTimer = 0;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function typeLabel(t) { return t === 'dare' ? U.dare : U.truth; }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function loadSaved() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (o && typeof o === 'object') {
        return { mode: o.mode === 'free' ? 'free' : 'names', names: typeof o.names === 'string' ? o.names.slice(0, 800) : '', pack: CORE.PACKS.indexOf(o.pack) >= 0 ? o.pack : CORE.PACKS[0] };
      }
    } catch (e) { /* noop */ }
    return null;
  }
  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify({ mode: mode, names: els.names.value.slice(0, 800), pack: pack })); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 시작 화면
  function setMode(m) {
    mode = m === 'free' ? 'free' : 'names';
    els.modeNames.setAttribute('aria-checked', String(mode === 'names'));
    els.modeFree.setAttribute('aria-checked', String(mode === 'free'));
    els.namesBox.hidden = mode !== 'names';
    els.freeBox.hidden = mode !== 'free';
    syncCount();
  }
  function setPack(p) {
    pack = CORE.PACKS.indexOf(p) >= 0 ? p : CORE.PACKS[0];
    packBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-pack') === pack)); });
  }
  function syncCount() {
    var n = CORE.parseNames(els.names.value).names.length;
    els.namesCount.textContent = n ? fmt(U.namesCount, { n: n }) : '';
    els.namesCount.classList.toggle('is-bad', n > CORE.MAX_PLAYERS || n === 1);
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; els.names.removeAttribute('aria-invalid'); }
  function showError(v) {
    els.error.textContent = fmt(ER[v.error] || ER.namesTooFew, { n: v.n });
    els.error.hidden = false;
    els.names.setAttribute('aria-invalid', 'true');
    focusSoft(els.names);
    scrollTo(els.error, 'center');
  }
  function show(screen) {
    els.setup.hidden = screen !== 'setup';
    els.play.hidden = screen !== 'play';
    els.end.hidden = screen !== 'end';
  }

  // ---------------------------------------------------------------- 게임
  function begin(c) {
    cfg = c;
    turns = cfg.mode === 'names' ? CORE.newTurns(cfg.names.length) : null;
    decks = CORE.newDecks(PACKS[cfg.pack]);
    stats = CORE.newStats();
    turnNo = 0;
    card = null;
    els.packChip.textContent = (U.packs && U.packs[cfg.pack] && U.packs[cfg.pack].name) || '';
    show('play');
    track('start');
    nextTurn();
    scrollTo(els.play, 'start');
  }
  function startFromForm() {
    var v = CORE.validate({ mode: mode, names: els.names.value, pack: pack });
    if (!v.ok) { showError(v); return; }
    clearError();
    save();
    begin(v.cfg);
  }
  function nextTurn() {
    turnNo++;
    card = null;
    player = turns ? CORE.nextPlayer(turns) : -1;
    els.round.textContent = fmt(U.round, { r: turnNo });
    var named = player >= 0;
    els.turnKicker.hidden = !named;
    els.turnName.textContent = named ? cfg.names[player] : U.turnFree;
    els.turnSub.hidden = named;
    els.next.textContent = named ? U.next : U.nextFree;
    els.turnName.classList.remove('is-pop');
    void els.turnName.offsetWidth;
    els.turnName.classList.add('is-pop');
    clearTimeout(flipTimer);
    els.flip.classList.remove('is-flipped', 'is-truth', 'is-dare');
    els.choose.hidden = false;
    els.actions.hidden = true;
    els.randomNote.hidden = true;
    pickBtns.forEach(function (b) { b.disabled = false; });
    els.live.textContent = named ? fmt(U.liveTurn, { name: cfg.names[player] }) : U.turnFree;
  }
  function drawCard(type, wasRandom) {
    var list = (PACKS[cfg.pack] && PACKS[cfg.pack][type]) || [];
    var idx = CORE.nextCard(decks[type]);
    card = { type: type, idx: idx, text: idx >= 0 ? list[idx] : '', random: !!wasRandom };
    els.cardType.textContent = typeLabel(type);
    els.cardText.textContent = card.text;
    els.randomNote.hidden = !wasRandom;
    els.randomNote.textContent = wasRandom ? fmt(U.randomPicked, { type: typeLabel(type) }) : '';
    els.flip.classList.toggle('is-truth', type === 'truth');
    els.flip.classList.toggle('is-dare', type === 'dare');
    els.live.textContent = fmt(U.liveCard, { type: typeLabel(type), text: card.text });
  }
  function flipIn() {
    clearTimeout(flipTimer);
    els.flip.classList.remove('is-flipped');
    void els.flip.offsetWidth;
    flipTimer = setTimeout(function () { els.flip.classList.add('is-flipped'); }, REDUCED ? 0 : 30);
  }
  function pick(choice) {
    if (!cfg || card) return;
    var type = CORE.pickType(choice);
    drawCard(type, choice === 'random');
    els.choose.hidden = true;
    els.actions.hidden = false;
    pickBtns.forEach(function (b) { b.disabled = true; });
    flipIn();
    try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(30); } catch (e) { /* noop */ }
  }
  function skip() {
    if (!card) return;
    CORE.recordSkip(stats);
    var wasRandom = card.random;
    drawCard(card.type, wasRandom);
    flipIn();
  }
  function done() {
    if (!card) return;
    CORE.recordTurn(stats, card.type, card.random);
    nextTurn();
    scrollTo(els.play, 'start');
  }
  function finish() {
    if (!cfg) return;
    if (card) { CORE.recordTurn(stats, card.type, card.random); card = null; }
    clearTimeout(flipTimer);
    els.sRounds.textContent = String(stats.rounds);
    els.sTruths.textContent = String(stats.truths);
    els.sDares.textContent = String(stats.dares);
    els.sSkips.textContent = String(stats.skips);
    els.endSub.hidden = stats.rounds === 0;
    els.endNone.hidden = stats.rounds !== 0;
    show('end');
    track('done');
    scrollTo(els.end, 'start');
  }
  function playAgain() {
    if (cfg) begin(cfg);
    else { show('setup'); scrollTo(els.setup, 'start'); }
  }
  function edit() {
    cfg = null;
    card = null;
    show('setup');
    scrollTo(els.setup, 'start');
  }

  // ---------------------------------------------------------------- 공유 · 다시 하기
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  if (window.setShareData) {
    window.setShareData(function () { return { title: EN.shareTitle, text: EN.shareText, url: baseUrl() }; });
  }
  if (window.setRetry) window.setRetry({ label: EN.again, action: playAgain });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.modeNames.addEventListener('click', function () { clearError(); setMode('names'); save(); if (!els.names.value) focusSoft(els.names); });
  els.modeFree.addEventListener('click', function () { clearError(); setMode('free'); save(); });
  packBtns.forEach(function (b) { b.addEventListener('click', function () { setPack(b.getAttribute('data-pack')); save(); }); });
  var namesTimer = null;
  els.names.addEventListener('input', function () { clearError(); clearTimeout(namesTimer); namesTimer = setTimeout(function () { syncCount(); save(); }, 150); });
  els.start.addEventListener('click', startFromForm);
  pickBtns.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-pick')); }); });
  els.skip.addEventListener('click', skip);
  els.next.addEventListener('click', done);
  els.finish.addEventListener('click', finish);
  els.edit.addEventListener('click', edit);

  window.TRUTH_APP = {
    screen: function () { return !els.play.hidden ? 'play' : !els.end.hidden ? 'end' : 'setup'; },
    stats: function () { return JSON.parse(JSON.stringify(stats)); },
    card: function () { return card ? JSON.parse(JSON.stringify(card)) : null; },
    player: function () { return player >= 0 && cfg ? cfg.names[player] : null; },
    turn: function () { return turnNo; },
    cfg: function () { return cfg ? JSON.parse(JSON.stringify(cfg)) : null; }
  };

  var saved = loadSaved();
  if (saved) els.names.value = saved.names;
  setPack(saved ? saved.pack : CORE.PACKS[0]);
  setMode(saved ? saved.mode : 'names');
})();
