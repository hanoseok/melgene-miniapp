/* apps/life/life.js — 내 인생 애니메이션 앱 (입력 → 재생 → 끝 화면, 공유 링크, 영상 저장)
 * 빌드 도구 없이 그대로 동작해야 하므로 순수 vanilla JS, ES5 스타일.
 * 언어별 문자열은 페이지에 인라인된 window.PAGE_I18N (tools/i18n/<lang>.js 의 ui) 에서 읽는다.
 * 끝 화면 = 그림 제목·맺음말 + 영상 저장/영상 공유(이 앱만의 결과) 아래 공통 <div data-mg-end="life">
 *   (별점·하트·광고·공유·FAQ·다시 하기·다른 앱). 공유 내용은 window.setShareData, 다시 하기는 window.setRetry 로 넘긴다.
 * 필요한 전역: LIFE_CORE(life-core.js), LIFE_ENGINE(life-engine.js), SITE_CONFIG, SITE_I18N, common.js 의 toast/track/setShareData/setRetry.
 */
(function () {
  'use strict';

  var CORE = window.LIFE_CORE;
  var ENGINE = window.LIFE_ENGINE;
  var UI = window.PAGE_I18N || {};
  var CFG = window.SITE_CONFIG || {};
  var LANG = window.PAGE_LANG || 'ko';
  var LS_KEY = 'life_last' + (LANG === 'ko' ? '' : '_' + LANG);
  var FONTS = UI.canvasFont || { hand: 'cursive', weight: '400', scale: 1 };
  var fmt = CORE.fmt;
  var NS = 'http://www.w3.org/2000/svg';

  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }

  var today = new Date();
  var NOW = { y: today.getFullYear(), m: today.getMonth() + 1 };
  var MAX_BIRTH = CORE.maxBirth(NOW.y);

  function $(id) { return document.getElementById(id); }
  // 손그림 테두리(SVG)가 든 버튼은 글자 span 만 바꾼다
  function setLabel(btn, text) { var sp = btn.querySelector('span'); if (sp) sp.textContent = text; else btn.textContent = text; }
  function labelOf(btn) { var sp = btn.querySelector('span'); return (sp || btn).textContent; }
  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function toast(msg) { if (window.toast) window.toast(msg); }
  function ageText(n) { return CORE.ageText(UI, n); } // 0살·1살 특별 문구, 복수형 표(ui.plural, ru)까지 life-core.js 와 같게
  function pl(key, n) { return CORE.plural(UI, key, n); }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function bytes(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }

  // ---------------------------------------------------------------
  // 손으로 그린 테두리 / 스크리블 채움 (SVG)
  // ---------------------------------------------------------------
  var INK = (function () {
    function f(v) { return Math.round(v * 10) / 10; }
    function rnd(seed) { var r = CORE.mulberry32(seed); return function (a, b) { return a + (b - a) * r(); }; }
    function side(a, b, R, bow) {
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1, k = R(-bow, bow);
      return 'M' + f(a[0]) + ' ' + f(a[1]) + 'Q' + f((a[0] + b[0]) / 2 - dy / L * k) + ' ' + f((a[1] + b[1]) / 2 + dx / L * k) + ' ' + f(b[0]) + ' ' + f(b[1]);
    }
    function rect(w, h, R, j, ov) {
      var p = 4;
      var c = [[p + R(-j, j), p + R(-j, j)], [p + w + R(-j, j), p + R(-j, j)], [p + w + R(-j, j), p + h + R(-j, j)], [p + R(-j, j), p + h + R(-j, j)]];
      var d = '';
      [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(function (e) {
        var a = c[e[0]], b = c[e[1]], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
        var o0 = R(0, ov), o1 = R(0, ov);
        d += side([a[0] - dx / L * o0, a[1] - dy / L * o0], [b[0] + dx / L * o1, b[1] + dy / L * o1], R, Math.min(2.4, L * 0.012 + 0.5));
      });
      return d;
    }
    function circle(w, h, R) {
      var cx = 4 + w / 2, cy = 4 + h / 2, rx = w / 2 + 0.5, ry = h / 2 + 0.5, a0 = R(-2.4, -1.6), n = 26, d = '';
      for (var i = 0; i <= n; i++) {
        var a = a0 + (Math.PI * 2 * 1.07) * i / n, k = 1 + R(-0.025, 0.025) + (i / n) * 0.06;
        d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * rx * k) + ' ' + f(cy + Math.sin(a) * ry * k);
      }
      return d;
    }
    // 마커로 칠한 듯한 채움: 가로로 오가며 촘촘히 칠하고 끝은 거칠게
    function scribble(w, h, R) {
      var p = 4, y = p + 3.2, left = true, pts = [[p + 2 + R(0, 3), y]];
      while (y < p + h - 3) {
        pts.push([left ? p + w - 2 - R(0, 4) : p + 2 + R(0, 4), y + R(-0.6, 0.6)]);
        y += 4.4 + R(-0.4, 0.5);
        pts.push([left ? p + w - 3 - R(0, 5) : p + 3 + R(0, 5), Math.min(p + h - 3, y)]);
        left = !left;
      }
      var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]), len = 0;
      for (var i = 1; i < pts.length; i++) {
        d += 'L' + f(pts[i][0]) + ' ' + f(pts[i][1]);
        len += Math.sqrt(Math.pow(pts[i][0] - pts[i - 1][0], 2) + Math.pow(pts[i][1] - pts[i - 1][1], 2));
      }
      return { d: d, len: Math.ceil(len) + 12 };
    }
    function draw(el) {
      var w = el.offsetWidth, h = el.offsetHeight, o = el._inkOpt;
      if (!o || !w || !h) return;
      if (el._inkWH === w + 'x' + h) return;
      el._inkWH = w + 'x' + h;
      var R = rnd(CORE.hash32((el.getAttribute('data-id') || el.getAttribute('data-pen') || '') + el.textContent.length + ':' + w));
      var svg = el._inkSvg;
      if (!svg) {
        svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('class', 'lf-ink');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        el.insertBefore(svg, el.firstChild);
        el._inkSvg = svg;
      }
      svg.setAttribute('width', w + 8);
      svg.setAttribute('height', h + 8);
      svg.setAttribute('viewBox', '0 0 ' + (w + 8) + ' ' + (h + 8));
      var html = '';
      if (o.scribble) {
        var s = scribble(w, h, R);
        html += '<path class="lf-scribble" d="' + s.d + '" style="--len:' + s.len + '" stroke-width="' + (o.sw || 7.2) + '"/>';
      }
      html += '<path d="' + (o.circle ? circle(w, h, R) : rect(w, h, R, 1.3, o.ov || 4)) + '" stroke-width="' + (o.lw || 1.6) + '"/>';
      if (o.twice) html += '<path d="' + rect(w, h, R, 2.2, 3) + '" stroke-width="1" opacity=".4"/>';
      svg.innerHTML = html;
      el.classList.add('is-inked');
      if (o.scribble) el.classList.add('has-scribble');
    }
    var ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(function (list) { list.forEach(function (e) { draw(e.target); }); }) : null;
    function apply(el, o) {
      if (!el || el._inkOpt) return;
      el._inkOpt = o || {};
      draw(el);
      if (ro) ro.observe(el);
    }
    function all(sel, o) { Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) { apply(el, o); }); }
    return { apply: apply, all: all };
  })();

  // ---------------------------------------------------------------
  // 요소
  // ---------------------------------------------------------------
  var els = {
    home: $('screen-home'), filmScreen: $('screen-film'),
    heroCanvas: $('hero-canvas'), heroCta: $('hero-cta'),
    form: $('make'), birth: $('birth-year'), birthMinus: $('birth-minus'), birthPlus: $('birth-plus'), birthError: $('birth-error'),
    month: $('birth-month'), name: $('name'), custom: $('custom-text'),
    count: $('count'), timeline: $('timeline-list'), playMeta: $('play-meta'), playBtn: $('play-btn'),
    back: $('back-btn'), shared: $('shared-banner'), stage: $('stage'), canvas: $('film-canvas'), wait: $('stage-wait'),
    live: $('caption-live'), controls: $('controls'), pp: $('pp-btn'), replay: $('replay-btn'), speed: $('speed-btn'),
    timeNow: $('time-now'), timeTotal: $('time-total'),
    recBar: $('rec-bar'), recText: $('rec-text'), recFill: $('rec-fill'),
    endWrap: $('end-wrap'), end: $('end-card'), endTitle: $('end-title'), endClose: $('end-close'),
    recipientCta: $('recipient-cta'), save: $('save-btn'), saveNote: $('save-note'),
    recPanel: $('rec-panel'), recStatus: $('rec-status'), recInfo: $('rec-info'),
    recDownload: $('rec-download'), recShare: $('rec-share'), recCancel: $('rec-cancel'),
    year: $('year')
  };
  if (!els.form || !CORE || !ENGINE) return;
  if (els.year) els.year.textContent = NOW.y;

  // ---------------------------------------------------------------
  // 입력 상태
  // ---------------------------------------------------------------
  var state = { birth: 1996, month: 0, name: '', pen: CORE.PENS[0], sel: [], years: {}, custom: { text: '', year: null }, touched: false };

  function rawInput() {
    return {
      name: state.name, birth: state.birth, month: state.month, pen: state.pen, now: NOW,
      moments: state.sel.map(function (id) { return { id: id, year: state.years[id] != null ? state.years[id] : null }; }),
      custom: state.custom.text.trim() ? { text: state.custom.text, year: state.custom.year } : null
    };
  }
  function currentInput() { return CORE.normalizeInput(rawInput(), NOW); }
  function selCount() { return state.sel.length + (state.custom.text.trim() ? 1 : 0); }
  function birthValid() { return state.birth >= CORE.MIN_BIRTH && state.birth <= MAX_BIRTH; }

  function applyInput(inp) {
    state.birth = inp.birth;
    state.month = inp.month || 0;
    state.name = inp.name || '';
    state.pen = inp.pen;
    state.sel = inp.moments.map(function (m) { return m.id; });
    state.years = {};
    inp.moments.forEach(function (m) { if (m.year != null) state.years[m.id] = m.year; });
    state.custom = inp.custom ? { text: inp.custom.text, year: inp.custom.year } : { text: '', year: null };
    state.touched = true;
  }
  function applyDefaults() {
    state.sel = CORE.defaultMoments(NOW.y - state.birth, LANG);
    state.years = {};
    state.touched = false;
  }
  function loadSaved() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      var p = JSON.parse(raw);
      p.y = NOW.y; p.o = NOW.m;
      return CORE.fromPayload(p);
    } catch (e) { return null; }
  }
  function saveLast(inp) { try { localStorage.setItem(LS_KEY, JSON.stringify(CORE.toPayload(inp))); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------
  // 입력 화면 렌더링
  // ---------------------------------------------------------------
  function syncFields() {
    els.birth.value = String(state.birth);
    els.birth.removeAttribute('aria-invalid');
    els.birthError.hidden = true;
    els.month.value = String(state.month || 0);
    els.name.value = state.name;
    els.custom.value = state.custom.text;
    renderChips();
    renderPens();
    renderAll();
  }

  function renderChips() {
    Array.prototype.forEach.call(document.querySelectorAll('.lf-chip[data-id]'), function (c) {
      c.setAttribute('aria-pressed', state.sel.indexOf(c.getAttribute('data-id')) !== -1 ? 'true' : 'false');
    });
  }

  function renderCount() {
    var n = selCount();
    els.count.textContent = fmt(pl('count', n), { n: n });
    els.count.classList.remove('is-warn');
  }

  function iconSvg(id) {
    return '<svg class="lf-ico" aria-hidden="true" focusable="false"><use href="#i-' + id + '"></use></svg>';
  }
  function escHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function renderTimeline() {
    var list = els.timeline;
    if (!birthValid()) { list.innerHTML = ''; return; }
    var inp = currentInput();
    if (!inp) { list.innerHTML = ''; return; }
    var items = CORE.estimateYears(inp);
    var N = CORE.lifeYears(inp.birth, inp.month, NOW.y, NOW.m);
    var html = '<li class="is-end">' + iconSvg('birth') + '<span class="lf-tl-label">' + escHtml(UI.birthLabel) + '</span><span class="lf-tl-age">' + escHtml(ageText(0)) + '</span><span class="lf-tl-fixed">' + inp.birth + '</span></li>';
    items.forEach(function (it) {
      var label = it.kind === 'custom' ? it.text : (UI.moments[it.id] || {}).label;
      var key = it.kind === 'custom' ? 'custom' : it.id;
      html += '<li>' + iconSvg(key) + '<span class="lf-tl-label">' + escHtml(label) + '</span><span class="lf-tl-age">' + escHtml(ageText(it.age)) + '</span>' +
        '<input class="lf-tl-year" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" data-key="' + key + '" value="' + (it.estimated ? '' : it.year) + '" placeholder="' + it.year + '" aria-label="' + escHtml(fmt(UI.yearAria, { label: label })) + '"></li>';
    });
    html += '<li class="is-end">' + iconSvg('today') + '<span class="lf-tl-label">' + escHtml(UI.todayLabel) + '</span><span class="lf-tl-age">' + escHtml(ageText(N)) + '</span><span class="lf-tl-fixed">' + NOW.y + '</span></li>';
    list.innerHTML = html;
  }

  function renderMeta() {
    var inp = birthValid() ? currentInput() : null;
    if (!inp) { els.playMeta.textContent = ''; return; }
    var n = CORE.momentCount(inp);
    var total = CORE.planFilm(inp, UI).total;
    els.playMeta.textContent = fmt(pl('summary', n + 2), { n: n + 2, s: Math.round(total) });
  }

  function renderAll() {
    renderCount();
    renderTimeline();
    renderMeta();
  }

  function renderPens() {
    Array.prototype.forEach.call(document.querySelectorAll('.lf-pen'), function (b) {
      var on = b.getAttribute('data-pen') === state.pen;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.setAttribute('tabindex', on ? '0' : '-1');
    });
    document.body.setAttribute('data-pen', state.pen);
  }

  // ---------------------------------------------------------------
  // 입력 이벤트
  // ---------------------------------------------------------------
  // 타이 페이지: 불기(พ.ศ.)로 입력해도 받아서 서기로 바꾼다 (예: 2539 → 1996)
  var YO = UI.yearOffset || 0;
  function fromLocalYear(n) { return YO && n >= CORE.MIN_BIRTH + YO ? n - YO : n; }
  function setBirth(v, fromTyping) {
    var n = parseInt(v, 10);
    if (isFinite(n) && fromLocalYear(n) !== n) { n = fromLocalYear(n); els.birth.value = String(n); }
    var ok = n >= CORE.MIN_BIRTH && n <= MAX_BIRTH;
    if (!ok) {
      if (!fromTyping || String(v).length >= 4) {
        els.birth.setAttribute('aria-invalid', 'true');
        els.birthError.textContent = fmt(UI.birthError, { min: CORE.MIN_BIRTH, max: MAX_BIRTH });
        els.birthError.hidden = false;
      }
      state.birth = isFinite(n) ? n : state.birth;
      renderTimeline();
      els.playMeta.textContent = '';
      return false;
    }
    els.birth.removeAttribute('aria-invalid');
    els.birthError.hidden = true;
    state.birth = n;
    // 연도를 벗어난 장면 연도는 지운다
    Object.keys(state.years).forEach(function (k) { if (state.years[k] < n || state.years[k] > NOW.y) delete state.years[k]; });
    if (state.custom.year != null && (state.custom.year < n || state.custom.year > NOW.y)) state.custom.year = null;
    if (!state.touched) { applyDefaults(); renderChips(); }
    renderAll();
    return true;
  }

  els.birth.addEventListener('input', function () {
    var v = els.birth.value.replace(/\D/g, '').slice(0, 4);
    if (v !== els.birth.value) els.birth.value = v;
    if (v.length === 4) setBirth(v, true);
    else { els.birth.removeAttribute('aria-invalid'); els.birthError.hidden = true; }
  });
  els.birth.addEventListener('blur', function () { setBirth(els.birth.value, false); });
  function stepBirth(d) {
    var n = parseInt(els.birth.value, 10);
    if (!isFinite(n)) n = state.birth;
    n = Math.max(CORE.MIN_BIRTH, Math.min(MAX_BIRTH, n + d));
    els.birth.value = String(n);
    setBirth(n, false);
  }
  els.birthMinus.addEventListener('click', function () { stepBirth(-1); });
  els.birthPlus.addEventListener('click', function () { stepBirth(1); });
  els.month.addEventListener('change', function () { state.month = parseInt(els.month.value, 10) || 0; renderAll(); });
  els.name.addEventListener('input', function () { state.name = els.name.value; });
  els.custom.addEventListener('input', function () {
    state.custom.text = els.custom.value;
    if (selCount() > CORE.MAX_MOMENTS && state.sel.length) {
      // 나만의 장면을 넣어 8개를 넘으면 마지막으로 고른 칩 하나를 뺀다
      delete state.years[state.sel.pop()];
      renderChips();
    }
    renderAll();
  });

  document.querySelector('.lf-make').addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.lf-chip[data-id]') : null;
    if (!chip) return;
    var id = chip.getAttribute('data-id');
    var i = state.sel.indexOf(id);
    if (i !== -1) {
      state.sel.splice(i, 1);
      delete state.years[id];
    } else {
      if (selCount() >= CORE.MAX_MOMENTS) {
        chip.classList.remove('is-bump');
        void chip.offsetWidth;
        chip.classList.add('is-bump');
        els.count.textContent = UI.countMax;
        els.count.classList.add('is-warn');
        return;
      }
      state.sel.push(id);
      track('life_chip', { id: id });
    }
    state.touched = true;
    renderChips();
    renderAll();
  });

  els.timeline.addEventListener('input', function (e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains('lf-tl-year')) return;
    var v = t.value.replace(/\D/g, '').slice(0, 4);
    if (v !== t.value) t.value = v;
    var n = fromLocalYear(parseInt(v, 10));
    if (v.length === 4 && !(n >= state.birth && n <= NOW.y)) t.setAttribute('aria-invalid', 'true');
    else t.removeAttribute('aria-invalid');
  });
  els.timeline.addEventListener('change', function (e) {
    var t = e.target;
    if (!t.classList || !t.classList.contains('lf-tl-year')) return;
    var key = t.getAttribute('data-key');
    var v = t.value.trim();
    var n = fromLocalYear(parseInt(v, 10));
    var val = null;
    if (v) {
      if (n >= state.birth && n <= NOW.y) val = n;
      else { toast(fmt(UI.yearError, { min: state.birth, max: NOW.y })); val = null; }
    }
    if (key === 'custom') state.custom.year = val;
    else if (val == null) delete state.years[key];
    else state.years[key] = val;
    state.touched = true;
    renderAll();
  });

  // Enter 는 재생 대신 입력칸을 닫는다 (재생 버튼 자체는 그대로 동작)
  els.form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') { e.preventDefault(); e.target.blur(); }
  });

  // 펜 선택
  var penGroup = document.querySelector('.lf-pens');
  var doodleStop = {};
  function doodle(btn, animate) {
    var c = btn.querySelector('canvas');
    var id = btn.getAttribute('data-pen');
    if (!c) return;
    if (doodleStop[id]) doodleStop[id]();
    doodleStop[id] = ENGINE.drawDoodle(c, id, { animate: animate && !reduced });
  }
  if (penGroup) {
    penGroup.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.lf-pen') : null;
      if (!b) return;
      state.pen = b.getAttribute('data-pen');
      renderPens();
      doodle(b, true);
      renderMeta();
      track('life_pen', { pen: state.pen });
    });
    penGroup.addEventListener('keydown', function (e) {
      if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].indexOf(e.key) === -1) return;
      e.preventDefault();
      var i = CORE.PENS.indexOf(state.pen), d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      state.pen = CORE.PENS[(i + d + CORE.PENS.length) % CORE.PENS.length];
      renderPens();
      var b = penGroup.querySelector('[data-pen="' + state.pen + '"]');
      if (b) { b.focus(); doodle(b, true); }
    });
  }
  function initDoodles() {
    var btns = document.querySelectorAll('.lf-pen');
    var run = function () { Array.prototype.forEach.call(btns, function (b) { doodle(b, true); }); };
    if (typeof IntersectionObserver === 'undefined' || !penGroup) { run(); return; }
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(penGroup);
  }

  // ---------------------------------------------------------------
  // 글꼴 (캔버스 손글씨는 글꼴이 로드된 뒤 측정해야 캡션 박스가 맞는다)
  // ---------------------------------------------------------------
  function planTexts(plan) {
    var t = [];
    plan.scenes.forEach(function (s) { t.push(s.meta || '', s.line || '', s.title1 || '', s.title2 || '', s.closing || '', s.tbc || ''); });
    t.push('0123456789 ' + plan.birth);
    return t.join(' ');
  }
  function loadFonts(text) {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var p;
    try {
      p = Promise.all([
        document.fonts.load(FONTS.weight + ' 48px ' + FONTS.hand, text),
        document.fonts.load(FONTS.weight + ' 48px ' + FONTS.hand, 'Aa0')
      ]).catch(function () {});
    } catch (e) { return Promise.resolve(); }
    return Promise.race([p, new Promise(function (r) { setTimeout(r, 2600); })]);
  }

  // ---------------------------------------------------------------
  // 랜딩 샘플 (반복 재생, 화면 밖이면 멈춤)
  // ---------------------------------------------------------------
  var hero = null, heroVisible = true;
  function startHero() {
    var c = els.heroCanvas;
    if (!c) return;
    var inp = CORE.normalizeInput({ birth: 1994, pen: 'brush', moments: ['steps', 'school', 'love', 'travel', 'wedding'].map(function (id) { return { id: id }; }) }, NOW);
    var plan = CORE.planFilm(inp, UI, { hero: true });
    loadFonts(planTexts(plan)).then(function () {
      hero = ENGINE.createFilm(c, plan, { hd: 1440, loop: true, fonts: FONTS, dpr: Math.min(1.75, window.devicePixelRatio || 1), drift: !reduced });
      if (reduced) { hero.renderPage(1); return; }
      // 첫 화면부터 그림이 보이도록 첫 컷이 반쯤 그려진 시점에서 시작한다
      hero.seek(3.2);
      if (typeof IntersectionObserver !== 'undefined') {
        new IntersectionObserver(function (en) {
          heroVisible = en[0].isIntersecting;
          syncHero();
        }, { threshold: 0.05 }).observe(c);
      }
      syncHero();
    });
  }
  function syncHero() {
    if (!hero || reduced) return;
    var on = heroVisible && !document.hidden && document.body.getAttribute('data-screen') === 'home';
    if (on) hero.play(); else hero.pause();
  }

  // ---------------------------------------------------------------
  // 재생 화면
  // ---------------------------------------------------------------
  var film = null, plan = null, current = null, recipient = false, pushed = false, slow = reduced, lastVideo = null, rec = null, lastTimeUpdate = 0;
  var doneSent = false; // track('done') 은 필름 한 편을 끝까지 봤을 때 한 번만
  var videoUrl = null;

  function sizeStage(force) {
    var top = els.stage.getBoundingClientRect().top + (window.pageYOffset || 0);
    if (!(top > 0)) top = 100;
    var availH = window.innerHeight - top - 80;
    var availW = els.filmScreen.clientWidth || (window.innerWidth - 32);
    var h = Math.max(300, availH), w = Math.round(h * 9 / 16);
    if (w > availW) { w = Math.floor(availW); h = Math.round(w * 16 / 9); }
    var cw = parseFloat(els.stage.style.width) || 0, ch = parseFloat(els.stage.style.height) || 0;
    if (!force && Math.abs(cw - w) < 2 && Math.abs(ch - h) < 120) return false;
    els.stage.style.width = w + 'px';
    els.stage.style.height = h + 'px';
    return true;
  }

  function setScreen(name) {
    var film_ = name === 'film';
    document.body.setAttribute('data-screen', name);
    els.home.hidden = film_;
    els.home.classList.toggle('active', !film_);
    els.filmScreen.hidden = !film_;
    els.filmScreen.classList.toggle('active', film_);
    syncHero();
  }

  function updatePP() {
    var playing = film && film.playing;
    els.pp.classList.toggle('is-paused', !playing);
    els.pp.setAttribute('aria-label', playing ? UI.pause : UI.play);
  }

  function onScene(i, s) {
    var text = s.key === 'end' ? (s.title1 + ' ' + s.title2) : (s.meta + ' — ' + s.line);
    els.live.textContent = text;
  }
  function onFrame(f) {
    var n = performance.now();
    if (n - lastTimeUpdate > 250) {
      lastTimeUpdate = n;
      els.timeNow.textContent = mmss(f.t);
    }
  }

  function endTitleText() {
    var last = plan.scenes[plan.scenes.length - 1];
    return { title: fmt(UI.endHeading, { title1: last.title1, title2: last.title2 }), closing: last.closing };
  }

  function onEnd() {
    updatePP();
    els.timeNow.textContent = mmss(plan.total);
    var e = endTitleText();
    els.endTitle.textContent = e.title;
    els.endClose.textContent = e.closing;
    els.recipientCta.hidden = !recipient;
    // 공통 끝 화면의 "다시 하기": 만든 사람은 장면을 고쳐 다시 그리기, 받은 사람은 처음부터 다시 보기
    if (window.setRetry) window.setRetry({ label: recipient ? UI.retryRecipient : UI.retry, action: retry });
    els.endWrap.hidden = false;
    INK.apply(els.end, { lw: 1.6, twice: true });
    INK.all('.lf-end .lf-btn', { lw: 1.8, ov: 5 });
    INK.all('.mg-end .mg-share-btn', { lw: 1.5, ov: 4 });
    INK.all('.mg-end .more-test-card', { lw: 1.5, ov: 5 });
    track('life_end', { scenes: plan.scenes.length, recipient: recipient });
    if (!recipient && !doneSent) { doneSent = true; track('done'); }
    if (!recipient) ensureShort(current); // 공유 버튼을 누르기 전에 짧은 링크를 미리 만든다
    setTimeout(function () {
      if (!els.endWrap.hidden && !rec) els.end.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }, 900);
  }

  function destroyFilm() {
    if (film) { film.destroy(); film = null; }
  }

  function resetRecUi() {
    els.recPanel.hidden = true;
    els.recStatus.textContent = '';
    els.recStatus.classList.remove('is-error');
    els.recInfo.textContent = '';
    els.recDownload.hidden = true;
    els.recShare.hidden = true;
    els.recCancel.hidden = true;
    els.save.disabled = false;
  }

  function showFilm(inp, opts) {
    opts = opts || {};
    if (rec) cancelRec();
    current = inp;
    recipient = !!opts.recipient;
    doneSent = false;
    var myPlan = plan = CORE.planFilm(inp, UI);
    setScreen('film');
    window.scrollTo(0, 0);
    els.endWrap.hidden = true;
    resetRecUi();
    lastVideo = null;
    if (recipient) {
      els.shared.textContent = inp.name ? fmt(UI.sharedFrom, { name: inp.name }) : UI.sharedFromNoName;
      els.shared.hidden = false;
    } else {
      els.shared.hidden = true;
    }
    setLabel(els.back, recipient ? (els.back.getAttribute('data-make') || labelOf(els.back)) : (els.back.getAttribute('data-back') || labelOf(els.back)));
    els.timeTotal.textContent = mmss(plan.total);
    els.timeNow.textContent = '0:00';
    els.speed.setAttribute('aria-pressed', slow ? 'true' : 'false');
    sizeStage(true);
    destroyFilm();
    els.wait.hidden = false;
    var ctx = els.canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
    loadFonts(planTexts(myPlan)).then(function () {
      if (plan !== myPlan) return;
      film = ENGINE.createFilm(els.canvas, myPlan, {
        hd: 1920, fonts: FONTS, drift: !slow && !reduced, speed: slow ? 0.6 : 1,
        onScene: onScene, onEnd: onEnd, onFrame: onFrame
      });
      els.wait.hidden = true;
      film.play();
      updatePP();
      track('life_play', { moments: CORE.momentCount(current), pen: current.pen, recipient: recipient, lang: LANG });
      if (!recipient) track('start'); // done 과 짝: 만든 사람이 필름을 틀 때마다 한 번 (받은 사람은 done 도 세지 않는다)
    });
  }

  function showHome(scrollToMake) {
    if (rec) cancelRec();
    destroyFilm();
    plan = null;
    setScreen('home');
    if (scrollToMake) {
      setTimeout(function () { els.form.scrollIntoView({ behavior: 'auto', block: 'start' }); }, 0);
    } else window.scrollTo(0, 0);
  }

  function hashFor(inp) { return '#d=' + CORE.encodeShare(CORE.toPayload(inp)); }
  function hashInput() {
    var m = /^#d=([^&]+)/.exec(window.location.hash || '');
    if (!m) return null;
    try { return CORE.fromPayload(CORE.decodeShare(decodeURIComponent(m[1]))); } catch (e) { return null; }
  }
  function cleanUrl() {
    var q = window.location.search.replace(/([?&])s=[^&]*&?/, '$1').replace(/[?&]$/, '');
    return window.location.pathname + q;
  }

  // Supabase 짧은 공유 링크 (?s=<id>). 설정이 비어 있거나 실패하면 해시 링크(#d=)로 대체한다.
  var shortIds = {};
  function supaOn() { return !!(window.supa && window.supa.enabled()); }
  function ensureShort(inp) {
    if (!supaOn() || !inp) return Promise.resolve(null);
    var key = hashFor(inp);
    if (shortIds[key]) return Promise.resolve(shortIds[key]);
    return window.supa.createShare('life', CORE.toPayload(inp)).then(function (id) {
      if (id) shortIds[key] = id;
      return id;
    });
  }
  function shareUrlFor(inp) {
    var id = shortIds[hashFor(inp)];
    return id ? window.supa.shareUrl(id) : window.location.href.split('#')[0].split('?')[0] + hashFor(inp);
  }

  // 공통 공유 버튼(끝 화면)이 쓸 내용: 짧은 링크(?s=)가 있으면 그것, 없으면 해시 링크(#d=).
  // 짧은 링크는 필름이 끝날 때 미리 만들어 두므로 보통 바로 나온다. 늦어지면 1.5초만 기다리고 해시 링크로 대체.
  function shareData() {
    var inp = current;
    if (!inp) return {};
    var title = inp.name ? fmt(UI.shareTitle, { name: inp.name }) : UI.shareTitleNoName;
    var wait = new Promise(function (r) { setTimeout(r, 1500); });
    return Promise.race([ensureShort(inp), wait]).then(function () {
      return { title: title, text: UI.shareText, url: shareUrlFor(inp) };
    });
  }
  if (window.setShareData) window.setShareData(shareData);

  function play() {
    if (!setBirth(els.birth.value, false)) { els.birth.focus(); return; }
    var inp = currentInput();
    if (!inp) return;
    if (!CORE.isPlayable(inp)) {
      els.count.textContent = CORE.momentCount(inp) < CORE.MIN_MOMENTS ? UI.countMin : UI.countMax;
      els.count.classList.add('is-warn');
      els.count.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    saveLast(inp);
    try { window.history.pushState({ life: 1 }, '', hashFor(inp)); pushed = true; } catch (e) { window.location.hash = hashFor(inp); }
    showFilm(inp, { recipient: false });
  }
  els.form.addEventListener('submit', function (e) { e.preventDefault(); play(); });

  if (els.heroCta) {
    els.heroCta.addEventListener('click', function (e) {
      e.preventDefault();
      els.form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      track('life_hero_cta');
    });
  }

  // 재생 조작
  els.pp.addEventListener('click', function () { if (film && !rec) { film.toggle(); updatePP(); } });
  els.replay.addEventListener('click', function () {
    if (!film || rec) return;
    els.endWrap.hidden = true;
    film.restart();
    updatePP();
    track('life_replay');
  });
  function replayFromTop() {
    if (!film || rec) return;
    els.endWrap.hidden = true;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    film.restart();
    updatePP();
    track('life_replay');
  }
  els.speed.addEventListener('click', function () {
    slow = !slow;
    els.speed.setAttribute('aria-pressed', slow ? 'true' : 'false');
    setLabel(els.speed, slow ? UI.normal : UI.slow);
    if (film) { film.setSpeed(slow ? 0.6 : 1); film.setDrift(!slow && !reduced); }
  });
  setLabel(els.speed, slow ? UI.normal : UI.slow);

  els.back.setAttribute('data-back', labelOf(els.back));
  function goEdit() {
    if (recipient) { startOwn(); return; }
    if (current) { applyInput(current); syncFields(); }
    if (pushed) { pushed = false; window.history.back(); return; }
    try { window.history.replaceState(null, '', cleanUrl()); } catch (e) { /* noop */ }
    showHome(true);
  }
  els.back.addEventListener('click', goEdit);
  function retry() {
    if (recipient) { replayFromTop(); return; }
    track('life_edit');
    goEdit();
  }
  if (window.setRetry) window.setRetry({ label: UI.retry, action: retry });

  function startOwn() {
    recipient = false;
    try { window.history.replaceState(null, '', cleanUrl()); } catch (e) { /* noop */ }
    pushed = false;
    var saved = loadSaved();
    if (saved) applyInput(saved); else { state.birth = 1996; state.month = 0; state.name = ''; state.custom = { text: '', year: null }; applyDefaults(); }
    syncFields();
    showHome(true);
    track('life_recipient_cta');
  }
  els.recipientCta.addEventListener('click', startOwn);

  window.addEventListener('popstate', function () {
    var inp = hashInput();
    if (inp) { showFilm(inp, { recipient: recipient }); return; }
    pushed = false;
    showHome(true);
  });

  // ---------------------------------------------------------------
  // 영상 저장 (canvas.captureStream + MediaRecorder, 기기 안에서 녹화)
  // ---------------------------------------------------------------
  function pickMime() {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) return '';
    var c = ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    for (var i = 0; i < c.length; i++) { try { if (MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) { /* noop */ } }
    return '';
  }
  function recSize() {
    var coarse = false;
    try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) { /* noop */ }
    var st = film ? film.stats() : null;
    var slowDevice = st && st.frames > 60 && st.avgFps < 50;
    var cores = navigator.hardwareConcurrency || 4;
    if (!coarse && !slowDevice && cores >= 4) return { w: 1080, h: 1920, bps: 4500000 };
    return { w: 720, h: 1280, bps: 2800000 };
  }
  // 영상 워터마크: 설정의 이 사이트 주소(예: miniapp.melgene.com/life). 자리표시자면 현재 주소로 대체.
  function watermark() {
    var me = (CFG.SITES || []).filter(function (s) { return s.id === 'life'; })[0];
    var p = String(me && me.path || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
    if (p && !/example\.com/.test(p)) return p;
    var dirs = ((window.SITE_I18N || {}).LOCALES || []).map(function (l) { return l.dir; }).filter(Boolean).concat('en');
    var path = window.location.pathname.replace(/\/[^\/]*\.html$/, '/').replace(/\/+$/, '');
    var seg = path.split('/');
    if (dirs.indexOf(seg[seg.length - 1]) !== -1) seg.pop();
    return window.location.host + seg.join('/');
  }
  function recStatus(msg, err) {
    els.recPanel.hidden = false;
    els.recStatus.textContent = msg;
    els.recStatus.classList.toggle('is-error', !!err);
  }
  function mirror(f) {
    var c = els.canvas, x = c.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.drawImage(f.canvas, 0, 0, c.width, c.height);
    var p = Math.min(1, f.t / f.duration);
    els.recText.textContent = fmt(UI.recording, { p: Math.floor(p * 100) });
    els.recFill.style.width = (p * 100).toFixed(1) + '%';
  }
  function cleanupRec(r) {
    if (!r) return;
    cancelAnimationFrame(r.hold);
    try { r.rf.destroy(); } catch (e) { /* noop */ }
    try { r.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) { /* noop */ }
    if (r.rc.parentNode) r.rc.parentNode.removeChild(r.rc);
    els.controls.classList.remove('is-recording');
    els.recBar.hidden = true;
    els.recCancel.hidden = true;
    els.save.disabled = false;
    if (film) film.draw();
  }
  function finishRec(r) {
    rec = null;
    cleanupRec(r);
    if (r.canceled) { recStatus(UI.recCanceled); return; }
    var type = String(r.mr.mimeType || r.mime || 'video/webm').split(';')[0] || 'video/webm';
    var blob = new Blob(r.chunks, { type: type });
    if (!blob.size) { recStatus(UI.recFail, true); track('life_video_fail', { reason: 'empty' }); return; }
    var ext = /mp4/.test(type) ? 'mp4' : 'webm';
    var name = (UI.fileBase || 'my-life') + '-' + current.birth + '.' + ext;
    if (videoUrl) { try { URL.revokeObjectURL(videoUrl); } catch (e) { /* noop */ } }
    videoUrl = URL.createObjectURL(blob);
    lastVideo = { blob: blob, type: type, size: blob.size, name: name, w: r.size.w, h: r.size.h, url: videoUrl };
    els.recDownload.href = videoUrl;
    els.recDownload.setAttribute('download', name);
    els.recDownload.hidden = false;
    var file = null;
    try { file = new File([blob], name, { type: type }); } catch (e) { file = null; }
    els.recShare.hidden = !(file && navigator.canShare && navigator.canShare({ files: [file] }));
    lastVideo.file = file;
    recStatus(UI.recDone);
    els.recInfo.textContent = fmt(UI.recInfo, { type: ext.toUpperCase(), w: r.size.w, h: r.size.h, size: bytes(blob.size) });
    INK.all('.lf-rec-actions .lf-btn', { lw: 1.8, ov: 5 });
    track('life_video_done', { type: ext, w: r.size.w, kb: Math.round(blob.size / 1024) });
  }
  function cancelRec() {
    if (!rec) return;
    rec.canceled = true;
    try { if (rec.mr.state !== 'inactive') rec.mr.stop(); else finishRec(rec); } catch (e) { finishRec(rec); }
  }
  function startRec() {
    if (rec || !plan || !current) return;
    resetRecUi();
    var mime = typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype.captureStream ? pickMime() : '';
    if (!mime) { recStatus(UI.recUnsupported, true); track('life_video_fail', { reason: 'unsupported' }); return; }
    var size = recSize();
    var rc = document.createElement('canvas');
    rc.width = size.w;
    rc.height = size.h;
    rc.className = 'lf-rec-canvas';
    rc.setAttribute('aria-hidden', 'true');
    document.body.appendChild(rc);
    if (film) film.pause();
    updatePP();
    var r = { rc: rc, size: size, mime: mime, chunks: [], canceled: false, hold: 0 };
    try {
      r.rf = ENGINE.createFilm(rc, plan, {
        width: size.w, height: size.h, hd: 1920, fonts: FONTS, watermark: watermark(), drift: !reduced, fps: 30,
        onFrame: mirror,
        onEnd: function () {
          var t0 = performance.now();
          (function hold() {
            if (rec !== r) return;
            r.rf.draw();
            mirror(r.rf);
            if (performance.now() - t0 < 2500) r.hold = requestAnimationFrame(hold);
            else if (r.mr.state !== 'inactive') r.mr.stop();
          })();
        }
      });
      r.stream = rc.captureStream(30);
      try { r.mr = new MediaRecorder(r.stream, { mimeType: mime, videoBitsPerSecond: size.bps }); }
      catch (e1) { r.mr = new MediaRecorder(r.stream); }
    } catch (e) {
      if (rc.parentNode) rc.parentNode.removeChild(rc);
      recStatus(UI.recFail, true);
      track('life_video_fail', { reason: 'init' });
      return;
    }
    r.mr.ondataavailable = function (ev) { if (ev.data && ev.data.size) r.chunks.push(ev.data); };
    r.mr.onstop = function () { finishRec(r); };
    r.mr.onerror = function () { r.canceled = false; try { r.mr.stop(); } catch (e) { finishRec(r); } };
    rec = r;
    els.controls.classList.add('is-recording');
    els.recBar.hidden = false;
    els.save.disabled = true;
    els.recCancel.hidden = false;
    recStatus(UI.recKeep);
    INK.all('.lf-rec-actions .lf-btn', { lw: 1.8, ov: 5 });
    els.stage.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    r.mr.start(1000);
    r.rf.play();
    track('life_video_start', { mime: mime.split(';')[0], w: size.w });
  }
  els.save.addEventListener('click', startRec);
  els.recCancel.addEventListener('click', cancelRec);
  els.recShare.addEventListener('click', function () {
    if (!lastVideo || !lastVideo.file || !navigator.share) return;
    var title = current && current.name ? fmt(UI.shareTitle, { name: current.name }) : UI.shareTitleNoName;
    navigator.share({ files: [lastVideo.file], title: title, text: UI.shareText }).then(function () {
      track('life_video_share');
    }).catch(function () {});
  });
  els.recDownload.addEventListener('click', function () { track('life_video_download'); });

  document.addEventListener('visibilitychange', function () {
    if (rec) {
      try {
        if (document.hidden) { rec.rf.pause(); if (rec.mr.state === 'recording') rec.mr.pause(); }
        else { if (rec.mr.state === 'paused') rec.mr.resume(); if (!rec.rf.ended) rec.rf.play(); }
      } catch (e) { /* noop */ }
    } else if (film && document.hidden && film.playing) { film.pause(); updatePP(); }
    syncHero();
  });

  var rt = 0;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (hero) hero.resize();
      if (document.body.getAttribute('data-screen') === 'film' && sizeStage(false) && film && !rec) film.resize();
    }, 160);
  });

  // 디버그/검증용 읽기 전용 핸들
  window.LIFE_APP = {
    get film() { return film; },
    get hero() { return hero; },
    get plan() { return plan; },
    get lastVideo() { return lastVideo; },
    get recording() { return !!rec; },
    get recFilm() { return rec ? rec.rf : null; },
    shareUrl: function () { return current ? shareUrlFor(current) : ''; }
  };

  // ---------------------------------------------------------------
  // 시작
  // ---------------------------------------------------------------
  function init() {
    var saved = loadSaved();
    if (saved) applyInput(saved);
    else applyDefaults();
    syncFields();

    INK.all('.lf-chip', { scribble: true, lw: 1.5 });
    INK.all('.lf-btn-ink', { lw: 1.4, ov: 6, twice: true });
    INK.all('.lf-btn-line, .lf-toggle', { lw: 1.6, ov: 5 });
    INK.all('.lf-round, .lf-num', { lw: 1.6, circle: true });
    INK.all('.lf-pen', { lw: 1.5, ov: 4 });
    INK.apply(document.querySelector('.lf-controls'), { lw: 1.5, ov: 5 });
    INK.apply(document.querySelector('.lf-playbar'), { lw: 1.6, ov: 7 });

    initDoodles();
    startHero();

    var fromHash = hashInput();
    var sid = window.supa ? window.supa.currentShareId() : null;
    if (fromHash) {
      showFilm(fromHash, { recipient: true });
    } else if (sid && supaOn()) {
      setScreen('home');
      window.supa.getShare(sid).then(function (row) {
        var inp = null;
        try { inp = row && row.payload ? CORE.fromPayload(row.payload) : null; } catch (e) { inp = null; }
        if (inp) { shortIds[hashFor(inp)] = sid; showFilm(inp, { recipient: true }); }
      });
    } else {
      setScreen('home');
    }
    showShareCount();
  }

  function showShareCount() {
    var el = document.getElementById('share-count');
    if (!el || !supaOn() || !UI.sharedCount) return;
    window.supa.count('life').then(function (n) {
      if (typeof n !== 'number' || n < 20) return; // 너무 적은 숫자는 보여주지 않는다
      el.textContent = fmt(pl('sharedCount', n), { n: n.toLocaleString(LANG) });
      el.hidden = false;
    });
  }
  init();
})();
