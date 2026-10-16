/* apps/dday/dday.js — 한 화면 디데이 계산기: 모드(디데이 · 며칠째 · 날짜 계산) → 제목·날짜·옵션·이모지·색 → 계산하기 → 달력 카드(실시간) + 기념일 (+ 공통 끝 화면)
 * 로직은 dday-core.js(DDAY_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별). 날짜·요일 표기는 Intl.DateTimeFormat.
 * 날짜 = 기기의 달력 날짜. 날짜 차이는 core 의 UTC 정오 셈(서머타임 무관), 남은 시·분·초만 실제 시간.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(결과·끝 화면이 나오면 숨김). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 계산하기(빠른 선택·저장 목록 열기 포함)를 누를 때 track('start') 한 번, 카드가 보일 때 track('done') 한 번 — 계산할 때마다 한 판.
 *       공유 링크로 본 카드는 세지 않는다. 이모지·색만 바꾸면 카드만 다시 그린다(새 판 아님).
 * 저장: 이 기기 localStorage mg_dday_saved 최대 10개(try/catch). 서버로 보내지 않는다.
 *       "카드 링크 복사" 를 누를 때만 제목·날짜가 #d= 링크에 들어간다. 공통 끝 화면 공유는 언제나 깨끗한 주소(제목·날짜 없음).
 * 디버그/검사용 읽기 전용 핸들: window.DDAY_APP (last(), shared(), saved(), mode(), view())
 */
(function () {
  'use strict';

  var CORE = window.DDAY_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var R = I.result || {};
  var E = I.errors || {};
  var LANG = I.lang || 'en';
  var STORE = 'mg_dday_saved';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PRESET_EMOJI = { halloween: 9, christmas: 10, newyear: 1, valentine: 3 };

  var $ = function (id) { return document.getElementById(id); };
  var all = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };
  var els = {
    tabs: all('[data-mode]'), modeHint: $('mode-hint'), form: $('dd-form'),
    title: $('title'), date: $('date'), dateLabel: $('date-label'), todayBtn: $('today-btn'), time: $('time'), day1: $('day1'),
    presets: all('[data-preset]'), presetBox: document.querySelector('.dd-presets'), signs: all('[data-sign]'), ndays: $('ndays'), qns: all('[data-n]'),
    emojis: all('[data-emoji]'), themes: all('[data-theme]'), fields: all('[data-for]'),
    calc: $('calc-btn'), error: $('error'),
    savedCard: $('saved-card'), savedList: $('saved-list'), savedCount: $('saved-count'),
    result: $('result'), card: $('result-card'), badge: $('shared-badge'), rEmoji: $('r-emoji'), rTitle: $('r-title'), rBig: $('r-big'), rSub: $('r-sub'),
    rDate: $('r-date'), rLive: $('r-live'), liveLabel: $('live-label'), lvD: $('lv-d'), lvH: $('lv-h'), lvM: $('lv-m'), lvS: $('lv-s'), rExtra: $('r-extra'),
    note: $('shared-note'), png: $('png-btn'), link: $('link-btn'), save: $('save-btn'), msCard: $('ms-card'), msList: $('ms-list'), live: $('live'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var mode = 'countdown';
  var emoji = 0;
  var theme = 0;
  var sign = 1;
  var last = null;       // 지금 카드의 rec
  var view = null;       // 마지막으로 그린 compute 결과
  var shared = false;
  var ticker = null;
  var dayKey = '';
  var saved = loadSaved();

  function track(ev) { try { if (window.track) window.track(ev, {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  var numFmt = null, pr = null;
  try { numFmt = new Intl.NumberFormat(LANG); } catch (e) { /* noop */ }
  try { pr = new Intl.PluralRules(LANG); } catch (e) { /* noop */ }
  function num(n) { return numFmt ? numFmt.format(n) : String(n); }
  function plural(obj, n, vars) {
    var tpl = obj;
    if (obj && typeof obj === 'object') { var cat = pr ? pr.select(n) : (n === 1 ? 'one' : 'other'); tpl = obj[cat] || obj.other; }
    var v = { n: num(n) };
    for (var k in vars || {}) v[k] = vars[k];
    return fmt(tpl, v);
  }
  function utcNoon(o) { var d = new Date(Date.UTC(2000, 0, 1, 12)); d.setUTCFullYear(o.y, o.m - 1, o.d); return d; }
  function dateFmt(o, opts) {
    try { return new Intl.DateTimeFormat(LANG, Object.assign({ timeZone: 'UTC' }, opts)).format(utcNoon(o)); } catch (e) { return CORE.fmtYmd(o); }
  }
  function longDate(o) { return dateFmt(o, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }); }
  function shortDate(o) { return dateFmt(o, { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }); }
  function timeFmt(h) {
    try { var d = new Date(Date.UTC(2000, 0, 1, h.h, h.min)); return new Intl.DateTimeFormat(LANG, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(d); } catch (e) { return CORE.fmtHm(h); }
  }
  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  function todayYmd() { return CORE.today(new Date()); }

  // ---------------------------------------------------------------- 라디오 묶음 (탭·이모지·색·방향)
  function radio(nodes, attr, onPick) {
    function pick(i, focus) {
      nodes.forEach(function (b, j) {
        b.setAttribute('aria-checked', String(i === j));
        b.tabIndex = i === j ? 0 : -1;
        if (i === j && focus) b.focus();
      });
      onPick(nodes[i].getAttribute(attr));
    }
    nodes.forEach(function (b, i) {
      b.addEventListener('click', function () { pick(i); });
      b.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        pick((i + dir + nodes.length) % nodes.length, true);
      });
    });
    return function (value) {
      var i = -1;
      nodes.forEach(function (b, j) { if (b.getAttribute(attr) === String(value)) i = j; });
      if (i >= 0) pick(i);
    };
  }

  var setModeUi = radio(els.tabs, 'data-mode', function (m) { applyMode(m); });
  var setEmojiUi = radio(els.emojis, 'data-emoji', function (v) { emoji = +v; restyle(); });
  var setThemeUi = radio(els.themes, 'data-theme', function (v) { theme = +v; restyle(); });
  var setSignUi = radio(els.signs, 'data-sign', function (v) { sign = +v; });

  function applyMode(m) {
    if (!CORE.isMode(m)) return;
    mode = m;
    els.modeHint.textContent = (U.modeHints || {})[m] || '';
    els.dateLabel.textContent = (U.dateLabel || {})[m] || '';
    els.title.placeholder = (U.titlePh || {})[m] || '';
    els.fields.forEach(function (f) { f.hidden = f.getAttribute('data-for').split(' ').indexOf(m) < 0; });
    if (m === 'math' && !els.date.value) els.date.value = CORE.fmtYmd(todayYmd());
    els.error.hidden = true;
  }
  // 이모지·색만 바꾸면 지금 카드만 다시 그린다(새 판 아님, 공유 카드는 그대로)
  function restyle() {
    if (!last || shared || els.result.hidden) return;
    last.e = emoji; last.c = theme;
    render();
  }

  // ---------------------------------------------------------------- 빠른 선택 (해마다 돌아오는 날, 코드로 계산)
  function renderPresets() {
    var list = CORE.presets(todayYmd());
    list.forEach(function (p) {
      var btn = els.presetBox.querySelector('[data-preset="' + p.id + '"]');
      if (!btn) return;
      btn.querySelector('.dd-preset-d').textContent = CORE.ddayLabel(p.diff);
      btn.title = longDate(p.date);
      els.presetBox.appendChild(btn);   // 가까운 날 순서로
    });
  }
  function usePreset(id) {
    var p = CORE.presets(todayYmd()).filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    setModeUi('countdown');
    els.date.value = CORE.fmtYmd(p.date);
    els.time.value = '';
    var names = U.presets || {};
    var cur = CORE.cleanTitle(els.title.value);
    if (!cur || Object.keys(names).some(function (k) { return names[k] === cur; })) els.title.value = names[id] || '';
    if (PRESET_EMOJI[id] != null) setEmojiUi(PRESET_EMOJI[id]);
    calculate();
  }

  // ---------------------------------------------------------------- 입력 → rec
  function readForm() {
    var raw = els.date.value;
    if (!raw) return { error: E.noDate };
    var d = CORE.parseYmd(raw);
    if (!d) return { error: E.badDate };
    var rec = { k: mode, t: CORE.cleanTitle(els.title.value), d: d, e: emoji, c: theme };
    if (mode === 'countdown') rec.h = CORE.parseHm(els.time.value) || null;
    if (mode === 'since') rec.o = !!els.day1.checked;
    if (mode === 'math') {
      var n = CORE.cleanN(els.ndays.value);
      if (n == null || n < 0) return { error: E.badDays };
      rec.n = sign * n;
    }
    return { rec: rec };
  }
  function fillForm(rec) {
    setModeUi(rec.k);
    els.title.value = rec.t || '';
    els.date.value = CORE.fmtYmd(rec.d);
    els.time.value = rec.h ? CORE.fmtHm(rec.h) : '';
    if (rec.k === 'since') els.day1.checked = !!rec.o;
    if (rec.k === 'math') { setSignUi(rec.n < 0 ? -1 : 1); els.ndays.value = String(Math.abs(rec.n)); }
    setEmojiUi(rec.e);
    setThemeUi(rec.c);
  }
  function showError(msg) {
    els.error.textContent = msg || '';
    els.error.hidden = !msg;
  }

  // ---------------------------------------------------------------- 계산 · 그리기
  function calculate() {
    var r = readForm();
    if (r.error) { showError(r.error); try { (r.error === E.badDays ? els.ndays : els.date).focus(); } catch (e) { /* noop */ } return; }
    showError('');
    if (shared) { clearSharedHash(); setShared(false); }
    track('start');
    show(r.rec);
    track('done');
    setTimeout(function () { smoothTo(els.card, 70); }, 20);
  }
  function show(rec) {
    last = rec;
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;   // 결과·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    render();
    els.live.textContent = fmt(R.live, { label: bigText() });
    startTicker();
  }
  function bigText() { return els.rBig.textContent; }
  function titleOf(rec) { return rec.t || (R.untitled || {})[rec.k] || ''; }

  function render() {
    if (!last) return;
    var rec = last;
    var now = Date.now();
    var c = CORE.compute(rec, now);
    view = c;
    dayKey = CORE.fmtYmd(todayYmd());
    var th = CORE.THEMES[rec.c] || CORE.THEMES[0];
    els.card.className = 'dd-cal theme-' + th.id + ' is-' + rec.k + (shared ? ' is-shared' : '') + (c.state ? ' is-' + c.state : '');
    els.badge.hidden = !shared;
    els.note.hidden = !shared;
    els.rEmoji.textContent = CORE.EMOJIS[rec.e] || CORE.EMOJIS[0];
    els.rTitle.textContent = titleOf(rec);
    els.rLive.hidden = true;
    els.rExtra.hidden = true;
    els.rDate.hidden = false;
    els.msCard.hidden = true;
    var big = '', sub = '', date = '', extra = '';
    if (rec.k === 'countdown') {
      big = c.state === 'today' ? R.dday : c.label;
      sub = c.state === 'today' ? R.today : plural(c.state === 'future' ? R.future : R.past, Math.abs(c.diff));
      date = longDate(rec.d) + (rec.h ? ' · ' + timeFmt(rec.h) : '');
      els.rLive.hidden = false;
      updateLive(c);
    } else if (rec.k === 'since') {
      if (c.state === 'future') {
        big = c.label;
        sub = plural(R.sinceStarts, c.until);
      } else {
        big = rec.o ? fmt(R.sinceDay1, { n: num(c.count) }) : plural(R.sincePlain, c.count);
        sub = fmt(R.sinceSub, { date: shortDate(rec.d) });
        extra = fmt(R.ymd, { y: num(c.ymd.y), m: num(c.ymd.m), d: num(c.ymd.d), w: num(c.weeks.w) });
      }
      date = c.state === 'future' ? longDate(rec.d) : '';
      renderMilestones(rec, c);
    } else {
      big = dateFmt(c.result, { year: 'numeric', month: 'short', day: 'numeric' });
      sub = dateFmt(c.result, { weekday: 'long' });
      var n = Math.abs(rec.n);
      date = rec.n === 0 ? fmt(R.mathSame, { date: shortDate(rec.d) }) : plural(rec.n > 0 ? R.mathAfter : R.mathBefore, n, { date: shortDate(rec.d) });
      extra = fmt(R.fromToday, { label: c.diffToday === 0 ? R.dday : CORE.ddayLabel(c.diffToday) });
    }
    els.rBig.textContent = big;
    var L = Array.from(big).length;
    els.rBig.className = 'dd-big' + (L > 12 ? ' is-xlong' : L > 7 ? ' is-long' : '');
    els.rSub.textContent = sub;
    els.rDate.textContent = date;
    els.rDate.hidden = !date;
    els.rExtra.textContent = extra;
    els.rExtra.hidden = !extra;
  }
  function updateLive(c) {
    var b = c.live;
    els.liveLabel.textContent = c.ms >= 0 ? R.remaining : R.elapsed;
    els.lvD.textContent = num(b.days);
    els.lvH.textContent = pad2(b.h);
    els.lvM.textContent = pad2(b.m);
    els.lvS.textContent = pad2(b.s);
  }
  function msLabel(rec, m) {
    if (m.kind === 'years') return plural(R.anniv, m.n);
    return fmt(rec.o ? R.milestoneDay1 : R.milestonePlain, { n: num(m.n) });
  }
  function renderMilestones(rec, c) {
    els.msList.innerHTML = '';
    (c.milestones || []).forEach(function (m) {
      var li = document.createElement('li');
      li.className = 'dd-ms-item' + (m.diff === 0 ? ' is-today' : '');
      var name = document.createElement('span');
      name.className = 'dd-ms-name';
      name.textContent = msLabel(rec, m);
      var date = document.createElement('time');
      date.className = 'dd-ms-date';
      date.dateTime = CORE.fmtYmd(m.date);
      date.textContent = shortDate(m.date);
      var d = document.createElement('span');
      d.className = 'dd-ms-d';
      d.textContent = m.diff === 0 ? R.milestoneToday : CORE.ddayLabel(m.diff);
      li.appendChild(name);
      li.appendChild(date);
      li.appendChild(d);
      els.msList.appendChild(li);
    });
    els.msCard.hidden = !(c.milestones && c.milestones.length);
  }

  // 1초마다: 남은 시간만 고치고, 날짜가 바뀌면 전부 다시 그린다
  function tick() {
    if (!last || els.result.hidden || document.hidden) return;
    if (CORE.fmtYmd(todayYmd()) !== dayKey) { render(); renderSaved(); renderPresets(); return; }
    if (last.k === 'countdown') {
      var c = CORE.compute(last, Date.now());
      if (c.diff !== view.diff) render(); else updateLive(c);
    }
  }
  function startTicker() { if (!ticker) ticker = setInterval(tick, 1000); }
  function stopTicker() { if (ticker) { clearInterval(ticker); ticker = null; } }

  // ---------------------------------------------------------------- 저장 목록 (localStorage, 실패해도 동작)
  function loadSaved() {
    try { return CORE.cleanSaved(JSON.parse(window.localStorage.getItem(STORE) || '[]')); } catch (e) { return []; }
  }
  function storeSaved() {
    try {
      if (saved.length) window.localStorage.setItem(STORE, JSON.stringify(CORE.serializeSaved(saved)));
      else window.localStorage.removeItem(STORE);
    } catch (e) { /* noop */ }
  }
  function savedLabel(rec) {
    var c = CORE.compute(rec, Date.now());
    if (rec.k === 'countdown') return c.state === 'today' ? R.dday : c.label;
    if (rec.k === 'since') return c.state === 'future' ? c.label : rec.o ? fmt(R.sinceDay1, { n: num(c.count) }) : plural(R.sincePlain, c.count);
    return dateFmt(c.result, { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function renderSaved() {
    els.savedList.innerHTML = '';
    saved.forEach(function (rec) {
      var li = document.createElement('li');
      li.className = 'dd-saved-item theme-' + (CORE.THEMES[rec.c] || CORE.THEMES[0]).id;
      var open = document.createElement('button');
      open.type = 'button';
      open.className = 'dd-saved-open';
      var em = document.createElement('span');
      em.className = 'dd-saved-emoji';
      em.setAttribute('aria-hidden', 'true');
      em.textContent = CORE.EMOJIS[rec.e] || '';
      var t = document.createElement('span');
      t.className = 'dd-saved-t';
      t.textContent = titleOf(rec);
      var lab = document.createElement('span');
      lab.className = 'dd-saved-d';
      lab.textContent = savedLabel(rec);
      open.appendChild(em); open.appendChild(t); open.appendChild(lab);
      open.addEventListener('click', function () { fillForm(rec); calculate(); });
      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'dd-saved-del';
      del.setAttribute('aria-label', (U.savedDelete || '') + ' ' + titleOf(rec));
      del.textContent = '×';
      del.addEventListener('click', function () {
        saved = saved.filter(function (x) { return x.id !== rec.id; });
        storeSaved();
        renderSaved();
      });
      li.appendChild(open);
      li.appendChild(del);
      els.savedList.appendChild(li);
    });
    els.savedCount.textContent = fmt(U.savedCount, { n: num(saved.length) });
    els.savedCard.hidden = saved.length === 0;
  }
  function saveCurrent() {
    if (!last) return;
    var r = CORE.pushSaved(saved, last, Date.now());
    saved = r.list;
    storeSaved();
    renderSaved();
    if (window.toast) window.toast(r.dupe ? R.savedDupe : r.dropped ? R.savedFull : R.savedToast);
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=)
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  function cardUrl(rec) { var d = CORE.encodeShare(rec); return d ? baseUrl() + '#d=' + d : baseUrl(); }
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
  function clearSharedHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function setShared(on) {
    shared = on;
    if (window.setRetry) window.setRetry(on ? { label: R.makeOwn, action: makeOwn } : { label: R.again, action: newRound });
  }
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) { showError(E.badLink); return false; }
    showError('');
    fillForm(rec);
    setShared(true);
    show(rec);
    return true;
  }
  // 새 디데이: 결과를 닫고 입력 칸을 비운 뒤 첫 화면으로
  function newRound() {
    stopTicker();
    last = null; view = null;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    els.title.value = '';
    els.time.value = '';
    if (mode !== 'math') els.date.value = '';
    showError('');
    try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    try { els.title.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }
  function makeOwn() {
    clearSharedHash();
    setShared(false);
    setModeUi('countdown');
    els.day1.checked = !!(I.defaults && I.defaults.day1);
    els.date.value = '';
    newRound();
  }

  // ---------------------------------------------------------------- 이미지 저장 (canvas → PNG)
  function cssVar(name, fallback) {
    try { var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fallback; } catch (e) { return fallback; }
  }
  function fitFont(ctx, text, weight, family, max, min, width) {
    var size = max;
    for (;;) {
      ctx.font = weight + ' ' + size + 'px ' + family;
      if (ctx.measureText(text).width <= width || size <= min) return size;
      size -= 4;
    }
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawCard() {
    var W = 1080, H = 1350;
    var cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    var th = CORE.THEMES[last.c] || CORE.THEMES[0];
    var display = cssVar('--font-display', 'sans-serif').replace(/var\(--font-sans\)/, 'sans-serif');
    var sans = cssVar('--font-sans', 'sans-serif');
    var numF = "'Unbounded', " + display;
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, th.a); g.addColorStop(1, th.b);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // 종이 한 장
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.22)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
    roundRect(ctx, 90, 140, 900, 1040, 56); ctx.fillStyle = '#fffdf8'; ctx.fill();
    ctx.restore();
    ctx.save(); roundRect(ctx, 90, 140, 900, 1040, 56); ctx.clip();
    ctx.fillStyle = th.id === 'ink' ? th.accent : th.a; ctx.fillRect(90, 140, 900, 120);
    ctx.restore();
    [330, 750].forEach(function (x) {
      ctx.beginPath(); ctx.arc(x, 140, 26, 0, Math.PI * 2); ctx.fillStyle = 'rgba(20,26,46,0.85)'; ctx.fill();
      ctx.beginPath(); ctx.arc(x, 140, 12, 0, Math.PI * 2); ctx.fillStyle = '#fffdf8'; ctx.fill();
    });
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.font = '120px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    ctx.fillText(els.rEmoji.textContent, W / 2, 420);
    var ink = '#1d2238';
    ctx.fillStyle = ink;
    fitFont(ctx, els.rTitle.textContent, cssVar('--display-weight', '800'), display, 66, 34, 780);
    ctx.fillText(els.rTitle.textContent, W / 2, 530);
    ctx.fillStyle = th.id === 'mint' ? '#14957a' : th.id === 'ink' ? ink : th.a;
    fitFont(ctx, els.rBig.textContent, '800', numF, 220, 60, 800);
    ctx.fillText(els.rBig.textContent, W / 2, 790);
    ctx.fillStyle = '#39405a';
    fitFont(ctx, els.rSub.textContent, '800', sans, 50, 26, 800);
    ctx.fillText(els.rSub.textContent, W / 2, 890);
    ctx.fillStyle = '#6b7088';
    var y = 970;
    [els.rDate.hidden ? '' : els.rDate.textContent, els.rExtra.hidden ? '' : els.rExtra.textContent].forEach(function (t) {
      if (!t) return;
      fitFont(ctx, t, '700', sans, 38, 22, 800);
      ctx.fillText(t, W / 2, y);
      y += 64;
    });
    ctx.fillStyle = th.fg;
    fitFont(ctx, I.brand || '', '700', display, 36, 22, 900);
    ctx.fillText(I.brand || '', W / 2, 1275);
    return cv;
  }
  function savePng() {
    if (!last) return;
    var fams = ["800 100px 'Unbounded'"];
    var ready = document.fonts && document.fonts.load ? Promise.all(fams.map(function (f) { return document.fonts.load(f).catch(function () { return null; }); })) : Promise.resolve();
    ready.then(function () {
      var cv = drawCard();
      var name = 'dday-' + CORE.fmtYmd(last.k === 'math' && view && view.result ? view.result : last.d) + '.png';
      var finish = function (href, revoke) {
        var a = document.createElement('a');
        a.href = href; a.download = name;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        if (revoke) setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
        if (window.toast) window.toast(R.pngSaved);
      };
      if (cv.toBlob) cv.toBlob(function (b) { if (b) finish(URL.createObjectURL(b), true); else finish(cv.toDataURL('image/png'), false); }, 'image/png');
      else finish(cv.toDataURL('image/png'), false);
    });
  }

  // 공통 끝 화면 공유: 깨끗한 주소(제목·날짜 없음), 문구에는 큰 숫자만
  if (window.setShareData) {
    window.setShareData(function () {
      var text = last ? fmt(R.shareText, { label: bigText() }) : R.shareTitle;
      return { title: R.shareTitle, text: text, url: baseUrl() };
    });
  }

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); calculate(); });
  [els.title, els.ndays].forEach(function (inp) {
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); calculate(); } });
  });
  els.ndays.addEventListener('input', function () {
    var v = els.ndays.value.replace(/[^0-9]/g, '').slice(0, 5);
    if (v !== els.ndays.value) els.ndays.value = v;
  });
  els.qns.forEach(function (b) { b.addEventListener('click', function () { els.ndays.value = b.getAttribute('data-n'); }); });
  els.todayBtn.addEventListener('click', function () { els.date.value = CORE.fmtYmd(todayYmd()); els.error.hidden = true; });
  els.presets.forEach(function (b) { b.addEventListener('click', function () { usePreset(b.getAttribute('data-preset')); }); });
  els.calc.addEventListener('click', calculate);
  els.png.addEventListener('click', savePng);
  els.link.addEventListener('click', function () { if (last) copyText(cardUrl(last), R.linkCopied); });
  els.save.addEventListener('click', saveCurrent);
  window.addEventListener('hashchange', loadShared);
  document.addEventListener('visibilitychange', tick);

  window.DDAY_APP = {
    last: function () { return last ? JSON.parse(JSON.stringify(last)) : null; },
    shared: function () { return shared; },
    saved: function () { return JSON.parse(JSON.stringify(saved)); },
    mode: function () { return mode; },
    view: function () { return view ? JSON.parse(JSON.stringify(view)) : null; }
  };

  els.day1.checked = !!(I.defaults && I.defaults.day1);
  setShared(false);
  applyMode('countdown');
  renderPresets();
  renderSaved();
  loadShared();
})();
