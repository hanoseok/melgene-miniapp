/* apps/percent/percent.js — 한 화면 퍼센트 계산기: 계산 탭 6개(of · what · change · adjust · reverse · points) →
 *   고른 카드에 두 숫자를 넣는 대로 결과 + 계산식("어떻게 계산했나") + 복사 → "요약 보기" → 요약 카드 + 공통 끝 화면.
 * 로직은 percent-core.js(PERCENT_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별). 숫자 모양은 Intl.NumberFormat.
 * 입력: 언어의 소수점 기준으로 "," 와 "." 둘 다 받는다(core.parseNum). 결과는 소수 10자리까지, 끝의 0 은 뺀다.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(요약·끝 화면이 나오면 숨김). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 한 판 = 이번 판에서 처음으로 결과가 나온 순간 track('start') 한 번 → "요약 보기"를 처음 누르면 track('done') 한 번.
 *       다시 하기(setRetry) = 입력을 비우고 새 판.
 * 저장: localStorage 'mg_percent_mode' 에 마지막 탭(계산 종류)만. 숫자는 서버 전송·저장·주소(#·?) 어디에도 넣지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.PERCENT_APP (mode(), results(), rounds())
 */
(function () {
  'use strict';

  var CORE = window.PERCENT_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var N = I.num || { pct: '{n}%', pp: '{n} pp', plus: '+', minus: '−' };
  var MODES = I.modes || {};
  var E = I.errors || {};
  var LANG = I.lang || 'en';
  var DEC = CORE.decimalSep(LANG);
  var MODE_KEY = 'mg_percent_mode';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    tabs: [].slice.call(document.querySelectorAll('.pc-tab')),
    finish: $('finish-btn'), finishErr: $('finish-err'), result: $('result'), sumList: $('sum-list'), summary: $('summary-card'),
    live: $('live'), adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var nf = null;
  try { nf = new Intl.NumberFormat(LANG, { maximumFractionDigits: 10 }); } catch (e) { /* noop */ }
  function num(x) { return nf ? nf.format(x) : String(x); }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function pct(x) { return fmt(N.pct, { n: num(x) }); }
  function signed(x, tpl) {
    var s = x > 0 ? N.plus : x < 0 ? N.minus : '';
    return s + fmt(tpl, { n: num(Math.abs(x)) });
  }

  var panels = {};          // mode → { el, a, b, dir, out… , res }
  var current = CORE.MODES[0];
  var started = false;      // 이번 판에 track('start') 했나
  var doneRound = false;    // 이번 판에 track('done') 했나
  var rounds = { start: 0, done: 0 };

  function track(ev) {
    rounds[ev] = (rounds[ev] || 0) + 1;
    try { if (window.track) window.track(ev, {}); } catch (e) { /* noop */ }
  }
  function storeGet() { try { return window.localStorage.getItem(MODE_KEY); } catch (e) { return null; } }
  function storeSet(v) { try { window.localStorage.setItem(MODE_KEY, v); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 결과 문구
  // core 결과 → { lead, big, sub, warn, how, copy }
  function describe(c, M) {
    var v = {
      a: num(c.a), b: num(c.b), pa: pct(c.a), pb: pct(c.b), r: num(c.r), pr: pct(c.r), sr: signed(c.r, N.pct), spp: signed(c.r, N.pp),
      s: c.s != null ? num(c.s) : '', d: c.d != null ? num(Math.abs(c.d)) : '', f: c.f != null ? num(c.f) : '', w: c.w != null ? num(c.w) : '',
      base: c.a < 0 ? '|' + num(c.a) + '|' : num(c.a), rel: c.rel != null ? signed(c.rel, N.pct) : ''
    };
    switch (c.mode) {
      case 'of': return { lead: fmt(M.lead, v), big: v.r, how: fmt(M.how, v), copy: fmt(M.copy, v) };
      case 'what': return { lead: fmt(M.lead, v), big: v.pr, how: fmt(M.how, v), copy: fmt(M.copy, v) };
      case 'change': return {
        lead: fmt(M.lead, v), big: v.sr, tone: c.r > 0 ? 'up' : c.r < 0 ? 'down' : '',
        sub: c.d > 0 ? fmt(M.up, v) : c.d < 0 ? fmt(M.down, v) : M.same, how: fmt(M.how, v), copy: fmt(M.copy, v)
      };
      case 'adjust': {
        var dn = c.dir === 'down';
        return {
          lead: fmt(dn ? M.leadDown : M.leadUp, v), big: v.r, tone: dn ? 'down' : 'up',
          sub: fmt(dn ? M.saveDown : M.saveUp, v), how: fmt(dn ? M.howDown : M.howUp, v), copy: fmt(dn ? M.copyDown : M.copyUp, v)
        };
      }
      case 'reverse': {
        var down = c.dir === 'down';
        return {
          lead: fmt(down ? M.leadDown : M.leadUp, v), big: v.r, sub: c.d ? fmt(M.diff, v) : '',
          warn: c.b ? fmt(down ? M.wrongDown : M.wrongUp, v) : '', how: fmt(down ? M.howDown : M.howUp, v), copy: fmt(M.copy, v)
        };
      }
      case 'points': return {
        lead: fmt(M.lead, v), big: v.spp, tone: c.r > 0 ? 'up' : c.r < 0 ? 'down' : '',
        sub: c.rel == null ? M.relZero : fmt(M.rel, v), how: fmt(M.how, v), copy: fmt(M.copy, v)
      };
    }
    return { lead: '', big: '', how: '', copy: '' };
  }

  // ---------------------------------------------------------------- 카드 하나 계산·그리기
  function setText(el, text) {
    el.textContent = text || '';
    el.hidden = !text;
  }
  function update(mode) {
    var P = panels[mode];
    var M = MODES[mode] || {};
    var c = CORE.run(mode, P.a.value, P.b.value, P.dir, DEC);
    P.a.removeAttribute('aria-invalid');
    P.b.removeAttribute('aria-invalid');
    P.out.classList.remove('is-up', 'is-down', 'is-err', 'is-ok');
    if (c.empty || c.error) {
      P.res = null;
      P.lead.textContent = U.waiting;
      P.big.textContent = '—';
      P.big.classList.remove('is-long');
      setText(P.sub, '');
      setText(P.warn, '');
      P.howBox.hidden = true;
      P.copy.disabled = true;
      setText(P.err, c.error ? E[c.error] || E.badNum : '');
      if (c.error) {
        P.out.classList.add('is-err');
        (c.field === 'b' ? P.b : P.a).setAttribute('aria-invalid', 'true');
      }
      return;
    }
    var t = describe(c, M);
    P.res = { mode: mode, title: M.title, copy: t.copy, how: t.how, big: t.big };
    P.out.classList.add('is-ok');
    if (t.tone) P.out.classList.add('is-' + t.tone);
    P.lead.textContent = t.lead;
    P.big.textContent = t.big;
    P.big.classList.toggle('is-long', String(t.big).length > 12);
    setText(P.sub, t.sub);
    setText(P.warn, t.warn);
    setText(P.err, '');
    P.how.textContent = t.how;
    P.howBox.hidden = false;
    P.copy.disabled = false;
    if (els.finishErr) els.finishErr.hidden = true;
    if (!started) { started = true; track('start'); }
  }
  var liveTimer = null;
  function announce(mode) {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      var P = panels[mode];
      if (P && P.res && els.live) els.live.textContent = fmt(U.live, { text: P.res.copy });
    }, 700);
  }

  // ---------------------------------------------------------------- 탭
  function select(mode, focus) {
    if (!panels[mode]) mode = CORE.MODES[0];
    current = mode;
    els.tabs.forEach(function (t) {
      var on = t.getAttribute('data-mode') === mode;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    CORE.MODES.forEach(function (m) { panels[m].el.hidden = m !== mode; });
    storeSet(mode);
  }
  els.tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('data-mode')); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = els.tabs.length, j = -1;
      if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % n;
      else if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + n) % n;
      else if (k === 'Home') j = 0;
      else if (k === 'End') j = n - 1;
      if (j >= 0) { e.preventDefault(); select(els.tabs[j].getAttribute('data-mode'), true); }
    });
  });

  // ---------------------------------------------------------------- 카드 이벤트
  function setDir(P, dir) {
    P.dir = dir;
    [].forEach.call(P.el.querySelectorAll('.pc-seg-btn'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-dir') === dir ? 'true' : 'false'); });
  }
  function syncChips(P) {
    var v = CORE.parseNum(P.b.value, DEC);
    [].forEach.call(P.el.querySelectorAll('.pc-chip'), function (c) {
      c.setAttribute('aria-pressed', P.dir === 'down' && v.value === Number(c.getAttribute('data-chip')) ? 'true' : 'false');
    });
  }
  function copyText(text) {
    var done = function () { if (window.toast) window.toast(U.copied); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); }); return; }
    } catch (e) { /* noop */ }
    fallback(text);
    done();
  }
  function fallback(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  CORE.MODES.forEach(function (mode) {
    var el = $('panel-' + mode);
    var q = function (s) { return el.querySelector(s); };
    var P = panels[mode] = {
      el: el, a: q('[data-in="a"]'), b: q('[data-in="b"]'), dir: CORE.DIR_MODES[mode] || null,
      out: q('[data-out]'), lead: q('[data-lead]'), big: q('[data-big]'), sub: q('[data-sub]'), warn: q('[data-warn]'), err: q('[data-err]'),
      howBox: q('[data-howbox]'), how: q('[data-how]'), copy: q('[data-copy]'), res: null
    };
    [P.a, P.b].forEach(function (inp) {
      inp.addEventListener('input', function () { update(mode); if (mode === 'adjust') syncChips(P); announce(mode); });
      inp.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (inp === P.a) P.b.focus(); else inp.blur();
      });
    });
    [].forEach.call(el.querySelectorAll('.pc-seg-btn'), function (b) {
      b.addEventListener('click', function () { setDir(P, b.getAttribute('data-dir')); update(mode); if (mode === 'adjust') syncChips(P); announce(mode); });
    });
    [].forEach.call(el.querySelectorAll('.pc-chip'), function (c) {
      c.addEventListener('click', function () {
        setDir(P, 'down');
        P.b.value = new Intl.NumberFormat(LANG, { useGrouping: false }).format(Number(c.getAttribute('data-chip')));
        update(mode);
        syncChips(P);
        announce(mode);
        if (!P.a.value) P.a.focus();
      });
    });
    P.copy.addEventListener('click', function () { if (P.res) copyText(P.res.copy + '\n' + P.res.how); });
  });

  // ---------------------------------------------------------------- 요약(끝 화면)
  function results() {
    var out = [];
    // 지금 보고 있는 탭을 맨 앞에
    [current].concat(CORE.MODES.filter(function (m) { return m !== current; })).forEach(function (m) { if (panels[m].res) out.push(panels[m].res); });
    return out;
  }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  function finish() {
    var list = results();
    if (!list.length) {
      els.finishErr.textContent = U.needOne;
      els.finishErr.hidden = false;
      return;
    }
    els.finishErr.hidden = true;
    els.sumList.innerHTML = '';
    list.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'pc-sum-item';
      var t = document.createElement('span');
      t.className = 'pc-sum-t';
      t.textContent = r.title;
      var big = document.createElement('b');
      big.className = 'pc-sum-big';
      big.textContent = r.big;
      var line = document.createElement('span');
      line.className = 'pc-sum-line';
      line.textContent = r.copy;
      var how = document.createElement('span');
      how.className = 'pc-sum-how';
      how.textContent = r.how;
      li.appendChild(t); li.appendChild(big); li.appendChild(line); li.appendChild(how);
      els.sumList.appendChild(li);
    });
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;     // 요약·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    if (!doneRound) { doneRound = true; track('done'); }
    setTimeout(function () { smoothTo(els.summary, 70); }, 20);
  }
  els.finish.addEventListener('click', finish);

  // 다시 하기: 요약을 닫고 모든 입력을 비운 뒤 새 판
  function reset() {
    started = false;
    doneRound = false;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    els.finishErr.hidden = true;
    els.sumList.innerHTML = '';
    CORE.MODES.forEach(function (m) {
      var P = panels[m];
      P.a.value = '';
      P.b.value = '';
      if (CORE.DIR_MODES[m]) setDir(P, CORE.DIR_MODES[m]);
      update(m);
      if (m === 'adjust') syncChips(P);
    });
    try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    try { panels[current].a.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  // 공통 끝 화면 공유: 깨끗한 주소(숫자 없음) + 고정 문구
  function baseUrl() {
    var base = window.location.href.split('#')[0].split('?')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  if (window.setShareData) window.setShareData(function () { return { title: U.shareTitle, text: U.shareText, url: baseUrl() }; });
  if (window.setRetry) window.setRetry({ label: U.again, action: reset });

  window.PERCENT_APP = {
    mode: function () { return current; },
    results: function () { return JSON.parse(JSON.stringify(results())); },
    rounds: function () { return { start: rounds.start, done: rounds.done }; }
  };

  select(storeGet() || CORE.MODES[0]);
})();
