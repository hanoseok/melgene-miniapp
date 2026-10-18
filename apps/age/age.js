/* apps/age/age.js — 한 화면 만 나이 계산기: 생년월일(연·월·일 선택) + 기준일(선택, 비우면 오늘) → 계산하기 →
 *   나이 카드(만 나이 년·개월·일, 태어난 요일) + (ko 만) 한국 나이 비교 + 다음 생일 D-n + 살아온 날 + 요일·별자리·띠 + 기념일 (+ 공통 끝 화면)
 * 로직은 age-core.js(AGE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별). 날짜·요일·달 이름은 Intl.DateTimeFormat.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(결과·끝 화면이 나오면 숨김). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 한 판 = 계산하기를 처음 누른 순간 track('start') 한 번 → 결과가 보이면 track('done') 한 번. 결과 뒤 다시 계산하면 새 판.
 *       입력이 틀려 결과가 안 나오면 start 만 남고, 고쳐서 다시 누르면 같은 판의 done.
 * 개인정보: 생년월일은 이 페이지 안에서만 계산한다 — 서버 전송·localStorage·주소(#·?) 어디에도 넣지 않는다.
 *       공통 끝 화면 공유 = 깨끗한 주소 + "살아온 날수" 문구뿐(생년월일·나이 없음).
 * 디버그/검사용 읽기 전용 핸들: window.AGE_APP (view(), rounds())
 */
(function () {
  'use strict';

  var CORE = window.AGE_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var R = I.result || {};
  var E = I.errors || {};
  var K = I.korea || {};
  var LANG = I.lang || 'en';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('ag-form'), by: $('by'), bm: $('bm'), bd: $('bd'), asof: $('asof'), todayBtn: $('today-btn'), calc: $('calc-btn'), error: $('error'),
    result: $('result'), card: $('result-card'), rAsof: $('r-asof'), rBig: $('r-big'), rYmd: $('r-ymd'), rBorn: $('r-born'),
    krMan: $('kr-man'), krYeon: $('kr-yeon'), krCount: $('kr-count'),
    nD: $('n-d'), nSub: $('n-sub'), nDate: $('n-date'), nLeap: $('n-leap'),
    tDays: $('t-days'), tWeeks: $('t-weeks'), tMonths: $('t-months'), tHours: $('t-hours'),
    sWeekday: $('s-weekday'), sZodiac: $('s-zodiac'), sZodiacIco: $('s-zodiac-ico'), sAnimal: $('s-animal'), sAnimalIco: $('s-animal-ico'),
    msList: $('ms-list'), live: $('live'), adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var view = null;          // 마지막 compute 결과
  var started = false;      // 이번 판에 track('start') 했나
  var rounds = { start: 0, done: 0 };

  function track(ev) {
    rounds[ev] = (rounds[ev] || 0) + 1;
    try { if (window.track) window.track(ev, {}); } catch (e) { /* noop */ }
  }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  var numFmt = null, pr = null;
  try { numFmt = new Intl.NumberFormat(LANG); } catch (e) { /* noop */ }
  try { pr = new Intl.PluralRules(LANG); } catch (e) { /* noop */ }
  function num(n) { return numFmt ? numFmt.format(n) : String(n); }
  function pick(obj, n) {
    if (!obj || typeof obj !== 'object') return obj || '';
    var cat = pr ? pr.select(n) : (n === 1 ? 'one' : 'other');
    return obj[cat] || obj.other || '';
  }
  function plural(obj, n, vars) {
    var v = { n: num(n) };
    for (var k in vars || {}) v[k] = vars[k];
    return fmt(pick(obj, n), v);
  }
  function utcNoon(o) { var d = new Date(Date.UTC(2000, 0, 1, 12)); d.setUTCFullYear(o.y, o.m - 1, o.d); return d; }
  function dateFmt(o, opts) {
    try { return new Intl.DateTimeFormat(LANG, Object.assign({ timeZone: 'UTC' }, opts)).format(utcNoon(o)); } catch (e) { return CORE.fmtYmd(o); }
  }
  function longDate(o) { return dateFmt(o, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }); }
  function shortDate(o) { return dateFmt(o, { year: 'numeric', month: 'short', day: 'numeric' }); }
  function weekdayName(o) { return dateFmt(o, { weekday: 'long' }); }
  function todayYmd() { return CORE.today(new Date()); }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  // 템플릿의 {n} 자리만 크게: '{n} years old' → <b>36</b><span> years old</span>
  function setBig(el, tpl, n) {
    el.textContent = '';
    String(tpl || '{n}').split('{n}').forEach(function (part, i) {
      if (i) { var b = document.createElement('b'); b.textContent = num(n); el.appendChild(b); }
      if (part) { var s = document.createElement('span'); s.textContent = part; el.appendChild(s); }
    });
  }

  // ---------------------------------------------------------------- 선택 상자 채우기
  function option(sel, value, label) {
    var o = document.createElement('option');
    o.value = String(value);
    o.textContent = label;
    sel.appendChild(o);
  }
  function fillYears() {
    var top = todayYmd().y;
    for (var y = top; y >= top - CORE.MAX_AGE; y--) {
      var label = dateFmt({ y: y, m: 6, d: 15 }, { year: 'numeric' });
      // 다른 연호(예: th 불기 พ.ศ. 2569)로 나오면 서기 연도를 함께 적는다
      if (label.indexOf(String(y)) < 0) label += ' (' + y + ')';
      option(els.by, y, label);
    }
  }
  function fillMonths() {
    for (var m = 1; m <= 12; m++) option(els.bm, m, dateFmt({ y: 2001, m: m, d: 1 }, { month: 'long' }));
  }
  // 그달 날수만큼(연·월이 아직 없으면 31일). 고른 날이 없어지면 말일로.
  function fillDays() {
    var y = Number(els.by.value) || 2000;          // 연도를 모르면 윤년(2000)으로 29일을 남긴다
    var m = Number(els.bm.value) || 1;
    var max = CORE.daysInMonth(y, m);
    var cur = els.bd.value;
    while (els.bd.options.length > 1) els.bd.remove(1);
    for (var d = 1; d <= max; d++) option(els.bd, d, dateFmt({ y: 2001, m: 1, d: d }, { day: 'numeric' }));
    if (cur) els.bd.value = String(Math.min(Number(cur), max));
  }

  // ---------------------------------------------------------------- 입력 → 결과
  function showError(key) {
    var msg = key ? E[key] || E.noDate : '';
    els.error.textContent = msg;
    els.error.hidden = !msg;
  }
  function read() {
    var b = CORE.fromParts(els.by.value, els.bm.value, els.bd.value);
    if (b.error) return { error: b.error, focus: b.error === 'badDate' ? els.bd : [els.by, els.bm, els.bd].filter(function (s) { return !s.value; })[0] || els.by };
    var asOf = todayYmd();
    if (els.asof.value) {
      asOf = CORE.parseYmd(els.asof.value, CORE.AS_OF_MIN, CORE.MAX_YEAR);
      if (!asOf) return { error: 'badAsOf', focus: els.asof };
    }
    var c = CORE.compute(b.date, asOf);
    if (c.error) return { error: c.error, focus: c.error === 'badAsOf' ? els.asof : els.by };
    return { view: c };
  }
  function calculate() {
    if (!started) { started = true; track('start'); }
    var r = read();
    if (r.error) {
      showError(r.error);
      try { r.focus.focus(); } catch (e) { /* noop */ }
      return;
    }
    showError('');
    show(r.view);
    started = false;          // 다음 계산은 새 판
    track('done');
    setTimeout(function () { smoothTo(els.card, 70); }, 20);
  }

  function show(c) {
    view = c;
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;     // 결과·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    var isToday = CORE.cmp(c.asOf, todayYmd()) === 0;
    els.rAsof.textContent = fmt(R.asOf, { date: longDate(c.asOf) });
    els.card.classList.toggle('is-birthday', c.next.today);
    els.card.classList.toggle('is-past', !isToday);
    setBig(els.rBig, pick(R.big, c.age.y), c.age.y);
    els.rYmd.textContent = [plural(R.y, c.age.y), plural(R.m, c.age.m), plural(R.d, c.age.d)].join(R.sep != null ? R.sep : ' ');
    els.rBorn.textContent = fmt(R.born, { weekday: weekdayName(c.birth) });

    if (K.show && els.krMan) {
      els.krMan.textContent = fmt(K.unit, { n: num(c.age.y) });
      els.krYeon.textContent = fmt(K.unit, { n: num(c.korean.yeon) });
      els.krCount.textContent = fmt(K.unit, { n: num(c.korean.counting) });
    }

    var nx = c.next;
    els.nD.textContent = nx.today ? R.birthdayToday : 'D-' + num(nx.diff);
    els.nD.classList.toggle('is-today', nx.today);
    els.nSub.textContent = nx.today ? fmt(R.turnedToday, { n: num(nx.turning) }) : plural(R.nextIn, nx.diff) + ' · ' + fmt(R.turning, { n: num(nx.turning) });
    els.nDate.textContent = longDate(nx.date);
    els.nLeap.hidden = !c.leapBirth;

    els.tDays.textContent = num(c.totals.days);
    els.tWeeks.textContent = num(c.totals.weeks);
    els.tWeeks.title = fmt(R.weeksRest, { w: num(c.totals.weeks), d: num(c.totals.weekRest) });
    els.tMonths.textContent = num(c.totals.months);
    els.tHours.textContent = num(c.totals.hours);

    els.sWeekday.textContent = weekdayName(c.birth);
    els.sZodiacIco.textContent = CORE.ZODIAC_EMOJI[c.zodiac] || '';
    els.sZodiac.textContent = (R.zodiac || {})[c.zodiac] || '';
    els.sAnimalIco.textContent = CORE.ANIMAL_EMOJI[c.animal] || '';
    els.sAnimal.textContent = (R.animals || {})[c.animal] || '';

    renderMilestones(c);
    els.live.textContent = fmt(R.live, { label: els.rBig.textContent + ' · ' + els.rYmd.textContent });
  }

  function renderMilestones(c) {
    els.msList.innerHTML = '';
    c.milestones.forEach(function (m) {
      var li = document.createElement('li');
      li.className = 'ag-ms-item' + (m.passed ? ' is-passed' : '') + (m.diff === 0 ? ' is-today' : '');
      var name = document.createElement('span');
      name.className = 'ag-ms-name';
      name.textContent = m.kind === 'days' ? fmt(R.msDays, { n: num(m.n) }) : fmt(R.msRound, { n: num(m.n) });
      var date = document.createElement('time');
      date.className = 'ag-ms-date';
      date.dateTime = CORE.fmtYmd(m.date);
      date.textContent = shortDate(m.date);
      var d = document.createElement('span');
      d.className = 'ag-ms-d';
      d.textContent = m.diff === 0 ? R.msToday : m.passed ? R.msPassed : 'D-' + num(m.diff);
      li.appendChild(name);
      li.appendChild(date);
      li.appendChild(d);
      els.msList.appendChild(li);
    });
  }

  // 다시 하기: 결과를 닫고 입력을 비운 뒤 첫 화면으로
  function reset() {
    view = null;
    started = false;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    els.by.value = ''; els.bm.value = ''; els.asof.value = '';
    fillDays();
    els.bd.value = '';
    showError('');
    try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    try { els.by.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  // 공통 끝 화면 공유: 깨끗한 주소(생년월일 없음), 문구에는 살아온 날수만
  function baseUrl() {
    var base = window.location.href.split('#')[0].split('?')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  if (window.setShareData) {
    window.setShareData(function () {
      var text = view ? fmt(R.shareText, { days: num(view.totals.days) }) : R.shareTitle;
      return { title: R.shareTitle, text: text, url: baseUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: reset });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); calculate(); });
  [els.by, els.bm].forEach(function (s) { s.addEventListener('change', function () { fillDays(); els.error.hidden = true; }); });
  els.bd.addEventListener('change', function () { els.error.hidden = true; });
  els.asof.addEventListener('change', function () { els.error.hidden = true; });
  els.asof.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); calculate(); } });
  els.todayBtn.addEventListener('click', function () { els.asof.value = CORE.fmtYmd(todayYmd()); els.error.hidden = true; });
  els.calc.addEventListener('click', calculate);

  window.AGE_APP = {
    view: function () { return view ? JSON.parse(JSON.stringify(view)) : null; },
    rounds: function () { return { start: rounds.start, done: rounds.done }; }
  };

  fillYears();
  fillMonths();
  fillDays();
})();
