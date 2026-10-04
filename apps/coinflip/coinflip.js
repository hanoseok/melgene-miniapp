/* apps/coinflip/coinflip.js — 시작(티징) → 동전/주사위 도구 화면 → 결과 하나 + 이번 세션 누적 (+ 공통 끝 화면)
 * 로직은 coinflip-core.js(COINFLIP_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 결과는 먼저 crypto 로 뽑고, 던지는 연출은 그곳에 멈추는 모습만 보여 준다(움직임 줄이기면 바로 결과).
 * 광고: 도구 화면 던지기 버튼 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리. 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 던지기를 누를 때 track('start') 한 번, 결과가 보일 때 track('done') 한 번(다시 던질 때마다 또).
 * 숫자: 서버 숫자 없음 — 누적 횟수는 이 페이지를 연 동안 직접 던진 횟수뿐(저장하지 않음).
 * 저장: 두 선택지 이름은 저장하지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.COINFLIP_APP (busy(), last(), tally(), tab())
 */
(function () {
  'use strict';

  var CORE = window.COINFLIP_CORE;
  var UI = window.PAGE_I18N || {};
  var T = UI.tool || {};
  var R = UI.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COIN_MS = 1700;
  var DICE_MS = 950;
  var HOLD_MS = 650;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), tool: $('screen-tool'), result: $('screen-result'),
    startBtn: $('start-btn'),
    tabCoin: $('tab-coin'), tabDice: $('tab-dice'), panelCoin: $('panel-coin'), panelDice: $('panel-dice'),
    nameA: $('name-a'), nameB: $('name-b'), coin: $('coin'), coinA: $('coin-a'), coinB: $('coin-b'), coinStage: $('coin-stage'),
    throwBtn: $('throw-btn'),
    counts: document.querySelectorAll('[data-dice]'), diceStage: $('dice-stage'), rollBtn: $('roll-btn'),
    resTitle: $('res-title'), resCoin: $('res-coin'), resDice: $('res-dice'), resName: $('res-name'), resSum: $('res-sum'),
    tallyCount: $('tally-count'), tallySides: $('tally-sides'),
    again: $('again-btn'), change: $('change-btn'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var tab = 'coin';
  var diceCount = 1;
  var tally = CORE.newTally();
  var last = null;       // { kind:'coin', side, names:[a,b] } | { kind:'dice', values:[…] }
  var rot = 0;
  var busy = false;
  var timers = [];
  var shuffle = null;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; if (shuffle) { clearInterval(shuffle); shuffle = null; } }
  var plural = null;
  try { plural = new Intl.PluralRules(UI.lang || 'en'); } catch (e) { /* noop */ }
  function countText(table, n) {
    var cat = plural ? plural.select(n) : (n === 1 ? 'one' : 'other');
    return fmt(table[cat] || table.other, { n: n });
  }
  function names() {
    return [CORE.cleanLabel(els.nameA.value, T.sideA), CORE.cleanLabel(els.nameB.value, T.sideB)];
  }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.tool.hidden = name !== 'tool';
    els.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 주사위 그림
  function dieHtml(v) {
    return '<span class="cf-die" data-v="' + v + '"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';
  }
  function diceHtml(values) { return values.map(dieHtml).join(''); }
  function idleDice() {
    var a = [];
    for (var i = 0; i < diceCount; i++) a.push(i === 0 ? 6 : (i === 1 ? 3 : 5));
    els.diceStage.innerHTML = diceHtml(a);
    els.diceStage.className = 'cf-dice-stage';
  }

  // ---------------------------------------------------------------- 도구 화면
  function refreshNames() {
    var n = names();
    els.coinA.textContent = n[0];
    els.coinB.textContent = n[1];
  }
  function setTab(t) {
    if (busy || tab === t) return;
    tab = t;
    var coin = t === 'coin';
    els.tabCoin.setAttribute('aria-selected', String(coin));
    els.tabDice.setAttribute('aria-selected', String(!coin));
    els.tabCoin.tabIndex = coin ? 0 : -1;
    els.tabDice.tabIndex = coin ? -1 : 0;
    els.panelCoin.hidden = !coin;
    els.panelDice.hidden = coin;
    registerRetry();
  }
  function setDiceCount(n) {
    if (busy) return;
    diceCount = CORE.clampDice(n);
    els.counts.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-dice')) === diceCount)); });
    idleDice();
  }
  function lock(on) {
    busy = on;
    els.throwBtn.disabled = on;
    els.rollBtn.disabled = on;
  }

  // ---------------------------------------------------------------- 던지기
  function throwCoin() {
    if (busy) return;
    clearTimers();
    show('tool');
    var side = CORE.flip();            // 결과는 먼저 정해지고, 동전은 그 면으로 떨어지는 연출
    var n = names();
    last = { kind: 'coin', side: side, names: n };
    lock(true);
    track('start');
    refreshNames();
    var want = side * 180;
    var next = rot + 1800 + ((want - (rot % 360)) + 360) % 360;
    els.coinStage.classList.remove('is-landed');
    els.coin.style.transition = 'none';
    els.coin.style.transform = 'rotateY(' + (rot % 360) + 'deg)';
    rot = next;
    if (REDUCED) {
      els.coin.style.transform = 'rotateY(' + (rot % 360) + 'deg)';
    } else {
      void els.coin.offsetHeight;
      els.coinStage.classList.add('is-tossing');
      els.coin.style.transition = 'transform ' + COIN_MS + 'ms cubic-bezier(0.2, 0.7, 0.25, 1)';
      els.coin.style.transform = 'rotateY(' + rot + 'deg)';
    }
    rot = rot % 360;
    later(function () {
      els.coinStage.classList.remove('is-tossing');
      els.coinStage.classList.add('is-landed');
      later(function () { showResult(); }, REDUCED ? 60 : HOLD_MS);
    }, REDUCED ? 60 : COIN_MS + 80);
  }

  function rollDice() {
    if (busy) return;
    clearTimers();
    show('tool');
    var values = CORE.roll(diceCount);   // 결과 먼저
    last = { kind: 'dice', values: values };
    lock(true);
    track('start');
    els.diceStage.className = 'cf-dice-stage';
    if (REDUCED) {
      els.diceStage.innerHTML = diceHtml(values);
      els.diceStage.classList.add('is-landed');
      later(function () { showResult(); }, 60);
      return;
    }
    els.diceStage.classList.add('is-rolling');
    shuffle = setInterval(function () {
      var tmp = [];
      for (var i = 0; i < values.length; i++) tmp.push(CORE.cryptoInt(CORE.SIDES) + 1);
      els.diceStage.innerHTML = diceHtml(tmp);
    }, 90);
    later(function () {
      clearInterval(shuffle); shuffle = null;
      els.diceStage.innerHTML = diceHtml(values);
      els.diceStage.classList.remove('is-rolling');
      els.diceStage.classList.add('is-landed');
      later(function () { showResult(); }, HOLD_MS);
    }, DICE_MS);
  }

  function showResult() {
    var coin = last.kind === 'coin';
    els.resCoin.hidden = !coin;
    els.resDice.hidden = coin;
    els.resTitle.textContent = coin ? R.titleCoin : R.titleDice;
    if (coin) {
      CORE.addCoin(tally, last.side);
      els.resName.textContent = last.names[last.side];
      els.resCoin.setAttribute('data-side', String(last.side));
      els.tallyCount.textContent = countText(UI.count, CORE.coinTotal(tally));
      els.tallySides.textContent = last.names.map(function (nm, i) { return fmt(R.tallySide, { name: nm, n: tally.coin[i] }); }).join('  ·  ');
      els.tallySides.hidden = false;
      els.again.textContent = '🪙 ' + R.againCoin;
    } else {
      CORE.addDice(tally);
      els.resDice.innerHTML = diceHtml(last.values);
      els.resSum.textContent = last.values.length > 1 ? fmt(R.sum, { n: CORE.sum(last.values) }) : '';
      els.resSum.hidden = last.values.length < 2;
      els.tallyCount.textContent = countText(UI.countDice, tally.dice);
      els.tallySides.hidden = true;
      els.again.textContent = '🎲 ' + R.againDice;
    }
    lock(false);
    registerRetry();
    show('result');
    track('done');
  }

  function again() { if (busy || !last) return; if (last.kind === 'coin') throwCoin(); else rollDice(); }
  function change() { if (busy) return; show('tool'); }

  function registerRetry() {
    if (!window.setRetry) return;
    var kind = last ? last.kind : tab;
    window.setRetry({ label: kind === 'dice' ? R.againDice : R.againCoin, action: again });
  }

  if (window.setShareData) {
    window.setShareData(function () {
      var base = window.location.href.split('#')[0];
      var text = R.shareTitle;
      if (last && last.kind === 'coin') text = fmt(R.shareTextCoin, { name: last.names[last.side] });
      else if (last && last.kind === 'dice') text = fmt(R.shareTextDice, { n: last.values.join(' · ') });
      return { title: R.shareTitle, text: text, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }
  registerRetry();

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { show('tool'); });
  els.tabCoin.addEventListener('click', function () { setTab('coin'); });
  els.tabDice.addEventListener('click', function () { setTab('dice'); });
  [els.tabCoin, els.tabDice].forEach(function (b) {
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var to = tab === 'coin' ? 'dice' : 'coin';
        setTab(to);
        (to === 'coin' ? els.tabCoin : els.tabDice).focus();
      }
    });
  });
  els.nameA.addEventListener('input', refreshNames);
  els.nameB.addEventListener('input', refreshNames);
  els.counts.forEach(function (b) { b.addEventListener('click', function () { setDiceCount(b.getAttribute('data-dice')); }); });
  els.throwBtn.addEventListener('click', throwCoin);
  els.rollBtn.addEventListener('click', rollDice);
  els.again.addEventListener('click', again);
  els.change.addEventListener('click', change);

  window.COINFLIP_APP = {
    busy: function () { return busy; },
    last: function () { return last; },
    tally: function () { return { coin: tally.coin.slice(), dice: tally.dice }; },
    tab: function () { return tab; }
  };

  idleDice();
  refreshNames();
  show('start');
})();
