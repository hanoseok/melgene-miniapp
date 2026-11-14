/* apps/order/order.js — 순서 정하기: 입력(첫 화면) → 공개(번호 카드 한 장씩) → 끝(1번째 → N번째 전체 순서)
 * 로직은 order-core.js(ORDER_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 순서는 "섞기"를 누르는 순간 한 번에 정해진다(crypto 거부 샘플링 + Fisher–Yates). 공개는 보여 주기만 한다.
 * 공개: 탭/다음 = 한 장, 자동 = 1.2초마다 한 장, 모두 보기 = 바로 끝 화면. 움직임 줄이기면 카드 애니메이션 없이 바로 바뀐다.
 * 기록: 섞기를 누를 때 track('start') 한 번, 전체 목록(끝 화면)이 보일 때 track('done') 한 번. 공유 링크로 본 결과는 세지 않는다.
 * 저장: 마지막 입력(모드·이름 글·N·프리셋·공개 방향)만 localStorage order_state(try/catch). 서버로 보내지 않는다.
 * 공유 링크(#r=…): 받은 사람은 같은 순서를 "공유된 순서"로 본다. 다시 하기 = 같은 이름으로 입력 화면(나도 섞기).
 * 사용자 글은 언제나 textContent 로만 넣는다(innerHTML 금지).
 * 디버그/검사용 읽기 전용 핸들: window.ORDER_APP
 */
(function () {
  'use strict';

  var CORE = window.ORDER_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var P = I.presets || [];
  var E = I.errors || {};
  var V = I.reveal || {};
  var R = I.result || {};
  var LIM = I.limits || { min: 2, max: 40 };
  var STORE = 'order_state';
  var AUTO_MS = 1200;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    input: $('screen-input'), form: $('or-form'),
    chips: Array.prototype.slice.call(document.querySelectorAll('.or-chip')),
    modeNames: $('mode-names'), modeNumbers: $('mode-numbers'),
    namesBox: $('names-box'), names: $('names'), clear: $('clear-names'), namesCount: $('names-count'),
    numbersBox: $('numbers-box'), count: $('count'), countDec: $('count-dec'), countInc: $('count-inc'),
    fromFirst: $('from-first'), fromLast: $('from-last'),
    error: $('error'), shuffle: $('shuffle-btn'),
    reveal: $('screen-reveal'), rvHeading: $('rv-heading'), rvProgress: $('rv-progress'), rvBar: $('rv-bar'),
    stage: $('stage'), stageCard: $('stage-card'), stageNum: $('stage-num'), stageName: $('stage-name'),
    rvLive: $('rv-live'), next: $('next-btn'), auto: $('auto-btn'), all: $('all-btn'),
    soFarHead: $('so-far-head'), soFar: $('so-far'),
    end: $('screen-end'), badge: $('shared-badge'), resTitle: $('res-title'), note: $('shared-note'),
    summary: $('summary'), list: $('list'),
    copy: $('copy-btn'), link: $('link-btn'), edit: $('edit-btn')
  };

  var form = CORE.cleanState(null); // 지금 입력 상태 { mode, names, n, preset, from }
  var round = null;    // 지금 판 { mode, items, preset, from }
  var seq = [];        // 공개할 자리 번호(0부터) 순서
  var shown = 0;       // 공개한 장 수
  var timer = null;    // 자동 공개 타이머
  var roundDone = false;
  var shared = null;   // 공유 링크로 보고 있으면 { mode, items, preset }
  var phase = 'input';
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }

  function fmt(tpl, v) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function track(ev) { try { if (window.track) window.track(ev, {}); } catch (e) { /* 통계 실패는 무시 */ } }
  function toast(msg) { try { if (window.toast) window.toast(msg); } catch (e) { /* noop */ } }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function scrollTop() { try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); } }
  function clampInt(v, lo, hi, fallback) {
    var n = Math.floor(Number(v));
    if (!isFinite(n)) return fallback;
    return Math.min(hi, Math.max(lo, n));
  }
  function heading(preset) { return (P[preset] && P[preset].heading) || (P[0] && P[0].heading) || ''; }
  function label(mode, item) { return mode === 'numbers' ? fmt(U.numberItem, { n: item }) : String(item); }

  // ---------------------------------------------------------------- 저장 (localStorage, try/catch)
  function loadState() {
    try { return CORE.cleanState(JSON.parse(window.localStorage.getItem(STORE) || 'null')); } catch (e) { return CORE.cleanState(null); }
  }
  function saveState() {
    try { window.localStorage.setItem(STORE, JSON.stringify(form)); } catch (e) { /* 저장이 안 돼도 동작은 한다 */ }
  }

  // ---------------------------------------------------------------- 화면 전환
  function show(name) {
    phase = name;
    els.input.hidden = name !== 'input';
    els.reveal.hidden = name !== 'reveal';
    els.end.hidden = name !== 'end';
    if (name !== 'reveal') stopAuto();
    scrollTop();
  }

  // ---------------------------------------------------------------- 입력 화면
  function pressed(btn, on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }

  function renderForm() {
    els.chips.forEach(function (b) { pressed(b, Number(b.getAttribute('data-preset')) === form.preset); });
    pressed(els.modeNames, form.mode === 'names');
    pressed(els.modeNumbers, form.mode === 'numbers');
    els.namesBox.hidden = form.mode !== 'names';
    els.numbersBox.hidden = form.mode !== 'numbers';
    pressed(els.fromFirst, form.from === 'first');
    pressed(els.fromLast, form.from === 'last');
    if (els.names.value !== form.names) els.names.value = form.names;
    els.count.value = String(form.n);
    updateCount();
  }

  function updateCount() {
    var c = CORE.cleanNames(els.names.value).length;
    els.namesCount.textContent = c ? fmt(U.namesCount, { n: c, max: LIM.max }) : '';
    els.namesCount.classList.toggle('is-over', c > LIM.max);
  }

  function setError(code) {
    if (!code) { els.error.hidden = true; els.error.textContent = ''; return; }
    els.error.textContent = E[code] || code;
    els.error.hidden = false;
  }

  function goInput() {
    shared = null;
    clearHash();
    renderForm();
    setError(null);
    show('input');
    setRetryMode();
  }

  function shuffleNow() {
    form.names = els.names.value;
    form.n = clampInt(els.count.value, LIM.min, LIM.max, form.n);
    var err = CORE.validate(form);
    if (err) { setError(err); return; }
    setError(null);
    saveState();
    startRound();
  }

  // ---------------------------------------------------------------- 공개 화면
  function startRound() {
    round = CORE.makeOrder(form);   // 여기서 한 번만 섞는다
    seq = CORE.revealSequence(round.items.length, round.from);
    shown = 0;
    roundDone = false;
    shared = null;
    clearHash();
    track('start');
    els.rvHeading.textContent = heading(round.preset);
    els.stageNum.textContent = '?';
    els.stageName.textContent = '';
    els.stageCard.classList.remove('is-pop', 'is-open');
    els.soFar.innerHTML = '';
    els.soFarHead.hidden = true;
    pressed(els.auto, false);
    els.auto.textContent = V.auto;
    updateReveal();
    show('reveal');
    setRetryMode();
  }

  function updateReveal() {
    var n = round.items.length;
    els.rvProgress.textContent = fmt(V.progress, { k: shown, n: n });
    els.rvBar.style.width = Math.round((shown / n) * 100) + '%';
    els.next.textContent = shown >= n ? V.done : (shown === 0 ? V.first : V.next);
    els.auto.disabled = shown >= n;
  }

  function placeLine(place, item) { return fmt(V.live, { k: place, who: label(round.mode, item) }); }

  function revealOne() {
    if (!round || phase !== 'reveal') return;
    var n = round.items.length;
    if (shown >= n) { finishRound(); return; }
    var idx = seq[shown];
    shown++;
    var item = round.items[idx];
    els.stageNum.textContent = String(idx + 1);
    els.stageName.textContent = label(round.mode, item);
    els.stageCard.classList.add('is-open');
    if (!reduced) {
      els.stageCard.classList.remove('is-pop');
      void els.stageCard.offsetWidth; // 애니메이션 다시 시작
      els.stageCard.classList.add('is-pop');
    }
    els.rvLive.textContent = placeLine(idx + 1, item);
    renderSoFar();
    updateReveal();
    if (shown >= n) stopAuto();
  }

  // 지금까지 공개된 자리를 1번째부터 차례로
  function renderSoFar() {
    var places = seq.slice(0, shown).slice().sort(function (a, b) { return a - b; });
    els.soFar.innerHTML = '';
    places.forEach(function (idx) {
      var li = el('li', 'or-item');
      li.appendChild(el('span', 'or-num', String(idx + 1)));
      li.appendChild(el('span', 'or-name', label(round.mode, round.items[idx])));
      els.soFar.appendChild(li);
    });
    els.soFarHead.hidden = places.length === 0;
  }

  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
    pressed(els.auto, false);
    if (els.auto) els.auto.textContent = V.auto;
  }
  function toggleAuto() {
    if (timer) { stopAuto(); return; }
    if (!round || shown >= round.items.length) return;
    pressed(els.auto, true);
    els.auto.textContent = V.autoStop;
    revealOne();
    if (shown < round.items.length) timer = setInterval(revealOne, AUTO_MS);
    else stopAuto();
  }

  function finishRound() {
    if (!round) return;
    stopAuto();
    renderEnd({ mode: round.mode, items: round.items, preset: round.preset }, false);
    show('end');
    if (!roundDone) { roundDone = true; track('done'); }
  }

  // ---------------------------------------------------------------- 끝 화면
  function renderEnd(rec, isShared) {
    els.badge.hidden = !isShared;
    els.note.hidden = !isShared;
    els.resTitle.textContent = heading(rec.preset);
    els.summary.textContent = fmt(R.summary, { n: rec.items.length });
    els.list.innerHTML = '';
    rec.items.forEach(function (item, i) {
      var li = el('li', 'or-item');
      li.appendChild(el('span', 'or-num', String(i + 1)));
      li.appendChild(el('span', 'or-name', label(rec.mode, item)));
      els.list.appendChild(li);
    });
    els.edit.hidden = !!isShared;
    setShare(rec);
    setRetryMode();
  }

  function currentRec() {
    if (shared) return shared;
    return round ? { mode: round.mode, items: round.items, preset: round.preset } : null;
  }

  function textResult(rec) {
    var lines = [fmt(R.textTitle, { heading: heading(rec.preset) })];
    rec.items.forEach(function (item, i) { lines.push((i + 1) + '. ' + label(rec.mode, item)); });
    var url = shareUrl(rec);
    if (url) lines.push('', url);
    return lines.join('\n');
  }

  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function shareUrl(rec) {
    var enc = CORE.encodeShare(rec);
    return enc ? baseUrl() + '#r=' + enc : null;
  }

  function setShare(rec) {
    if (!window.setShareData) return;
    window.setShareData(function () {
      var r = rec || currentRec();
      return { title: R.shareTitle, text: R.shareText, url: (r && shareUrl(r)) || baseUrl() };
    });
  }

  // 다시 하기: 내 결과면 같은 이름으로 바로 다시 섞기, 공유 결과면 그 이름을 입력 화면에 채워 나도 섞기
  function setRetryMode() {
    if (!window.setRetry) return;
    if (shared) {
      window.setRetry({ label: R.againShared, action: function () { adoptShared(); } });
    } else {
      window.setRetry({ label: R.again, action: function () { if (round) { form.mode = round.mode; startRoundAgain(); } else goInput(); } });
    }
  }
  function startRoundAgain() {
    var err = CORE.validate(form);
    if (err) { goInput(); setError(err); return; }
    startRound();
  }
  function adoptShared() {
    var s = shared;
    if (s) {
      form.preset = s.preset;
      form.mode = s.mode;
      if (s.mode === 'numbers') form.n = s.items.length;
      else form.names = s.items.join('\n');
      saveState();
    }
    goInput();
  }

  function copyText(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 복사 불가 */ }
    document.body.removeChild(ta);
  }

  function clearHash() {
    if (/^#r=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }

  // ---------------------------------------------------------------- 공유 링크 (#r=)
  function loadShared() {
    if (!/^#r=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) {
      goInput();
      setError('badLink');
      return true;
    }
    stopAuto();
    shared = rec;
    renderEnd(rec, true);
    show('end');
    return true;
  }

  // ---------------------------------------------------------------- 연결
  els.chips.forEach(function (b) {
    b.addEventListener('click', function () { form.preset = Number(b.getAttribute('data-preset')) || 0; renderForm(); saveState(); });
  });
  [els.modeNames, els.modeNumbers].forEach(function (b) {
    b.addEventListener('click', function () { form.mode = b.getAttribute('data-mode'); form.names = els.names.value; renderForm(); setError(null); saveState(); });
  });
  [els.fromFirst, els.fromLast].forEach(function (b) {
    b.addEventListener('click', function () { form.from = b.getAttribute('data-from'); renderForm(); saveState(); });
  });
  els.names.addEventListener('input', function () { form.names = els.names.value; updateCount(); setError(null); saveState(); });
  els.clear.addEventListener('click', function () { els.names.value = ''; form.names = ''; updateCount(); saveState(); els.names.focus(); });
  function step(d) {
    form.n = clampInt(clampInt(els.count.value, LIM.min, LIM.max, form.n) + d, LIM.min, LIM.max, form.n);
    els.count.value = String(form.n);
    setError(null);
    saveState();
  }
  els.countDec.addEventListener('click', function () { step(-1); });
  els.countInc.addEventListener('click', function () { step(1); });
  els.count.addEventListener('change', function () { step(0); });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); shuffleNow(); });
  els.form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') e.preventDefault();
  });
  els.shuffle.addEventListener('click', shuffleNow);
  els.stage.addEventListener('click', function () { stopAuto(); revealOne(); });
  els.next.addEventListener('click', function () { stopAuto(); revealOne(); });
  els.auto.addEventListener('click', toggleAuto);
  els.all.addEventListener('click', finishRound);
  els.copy.addEventListener('click', function () { var r = currentRec(); if (r) copyText(textResult(r), R.copied); });
  els.link.addEventListener('click', function () {
    var r = currentRec();
    if (!r) return;
    var u = shareUrl(r);
    if (u) copyText(u, R.linkCopied);
    else copyText(baseUrl(), R.linkTooLong);
  });
  els.edit.addEventListener('click', goInput);
  window.addEventListener('hashchange', function () { if (phase !== 'reveal') loadShared(); });

  window.ORDER_APP = {
    phase: function () { return phase; },
    shared: function () { return !!shared; },
    order: function () { var r = currentRec(); return r ? r.items.slice() : null; },
    shown: function () { return shown; },
    text: function () { var r = currentRec(); return r ? textResult(r) : ''; },
    link: function () { var r = currentRec(); return r ? shareUrl(r) || '' : ''; },
    form: function () { return JSON.parse(JSON.stringify(form)); }
  };

  // 처음 열면 입력 화면(지난 입력 복원). #r= 링크로 열면 공유된 순서를 바로 보여 준다.
  form = loadState();
  renderForm();
  show('input');
  setRetryMode();
  loadShared();
})();
