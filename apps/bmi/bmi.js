/* apps/bmi/bmi.js — 한 화면 BMI 계산기: 단위(cm·kg / ft·in·lb) → 키·몸무게를 넣는 대로 BMI(소수 1자리)·단계·색 막대·
 *   내 키의 정상 체중 범위·정상까지 남은 몸무게 → (선택) 나이·성별 안내 → "아시아 기준" 토글 → "요약 보기" → 요약 카드 + 공통 끝 화면.
 * 로직은 bmi-core.js(BMI_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별). 숫자 모양은 Intl.NumberFormat.
 * 입력: "," 와 "." 둘 다 소수점(core.parseNum).
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(요약·끝 화면이 나오면 숨김). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 한 판 = 이번 판에서 처음으로 숫자가 제대로 들어온 순간 track('start') 한 번 → "요약 보기"를 처음 누르면 track('done') 한 번.
 *       다시 하기(setRetry) = 입력을 비우고 새 판.
 * 저장: localStorage 'mg_bmi_unit' 에 마지막 단위(metric | imperial)만. 키·몸무게·나이는 서버 전송·저장·주소(#·?) 어디에도 넣지 않는다.
 * 디버그/검사용 읽기 전용 핸들: window.BMI_APP (unit(), scale(), result(), rounds())
 */
(function () {
  'use strict';

  var CORE = window.BMI_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var N = I.num || { kg: '{n} kg', lb: '{n} lb', range: '{min} – {max}' };
  var S = I.scales || {};
  var E = I.errors || {};
  var LANG = I.lang || 'en';
  var ALT = I.alt || 'asia';
  var UNIT_KEY = 'mg_bmi_unit';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    units: [].slice.call(document.querySelectorAll('[data-unit]')), boxes: [].slice.call(document.querySelectorAll('[data-unit-box]')),
    inputs: {}, more: $('more-btn'), moreBox: $('more-box'), sexBtns: [].slice.call(document.querySelectorAll('[data-sex]')), asia: $('asia-toggle'),
    out: $('out'), lead: $('out-lead'), big: $('out-big'), cat: $('out-cat'), bar: $('bar'), marker: $('marker'), ticks: $('ticks'), scaleNote: $('scale-note'),
    range: $('range'), rangeV: $('range-v'), rangeD: $('range-d'), err: $('out-err'), minor: $('note-minor'), senior: $('note-senior'), sexNote: $('note-sex'),
    finish: $('finish-btn'), finishErr: $('finish-err'), result: $('result'), summary: $('summary-card'),
    sumBig: $('sum-big'), sumCat: $('sum-cat'), sumScale: $('sum-scale'), sumRange: $('sum-range'), sumDiff: $('sum-diff'),
    live: $('live'), adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  ['cm', 'kg', 'ft', 'inch', 'lb', 'age'].forEach(function (k) { els.inputs[k] = $('in-' + k); });
  if (els.year) els.year.textContent = new Date().getFullYear();

  var nf1 = null, nf0 = null;
  try {
    nf1 = new Intl.NumberFormat(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    nf0 = new Intl.NumberFormat(LANG, { maximumFractionDigits: 1, useGrouping: false });
  } catch (e) { /* noop */ }
  function n1(x) { return nf1 ? nf1.format(x) : x.toFixed(1); }
  function nIn(x) { return nf0 ? nf0.format(x) : String(x); }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  var unit = 'metric';
  var sex = '';
  var res = null;
  var started = false;      // 이번 판에 track('start') 했나
  var doneRound = false;    // 이번 판에 track('done') 했나
  var rounds = { start: 0, done: 0 };

  function track(ev) {
    rounds[ev] = (rounds[ev] || 0) + 1;
    try { if (window.track) window.track(ev, {}); } catch (e) { /* noop */ }
  }
  function storeGet() { try { return window.localStorage.getItem(UNIT_KEY); } catch (e) { return null; } }
  function storeSet(v) { try { window.localStorage.setItem(UNIT_KEY, v); } catch (e) { /* noop */ } }

  function scaleId() { return els.asia && els.asia.checked ? ALT : 'who'; }
  function scaleText() { return els.asia && els.asia.checked ? S.alt : S.who; }
  function w(kg, u) { return fmt(u === 'imperial' ? N.lb : N.kg, { n: n1(CORE.weightIn(kg, u)) }); }
  function wDiff(kg, u) { return fmt(u === 'imperial' ? N.lb : N.kg, { n: n1(CORE.diffIn(kg, u)) }); }

  // ---------------------------------------------------------------- 색 막대 (기준이 바뀔 때마다 다시 그림)
  function drawBar() {
    var id = scaleId(), cuts = CORE.SCALES[id], txt = scaleText();
    var edges = [CORE.BAR[0]].concat(cuts, [CORE.BAR[1]]);
    els.bar.innerHTML = '';
    els.ticks.innerHTML = '';
    for (var i = 0; i < edges.length - 1; i++) {
      var seg = document.createElement('span');
      seg.className = 'bm-seg-c bm-c' + Math.min(i, 5);
      seg.style.width = ((edges[i + 1] - edges[i]) / (CORE.BAR[1] - CORE.BAR[0]) * 100) + '%';
      seg.title = (txt.labels || [])[i] || '';
      els.bar.appendChild(seg);
    }
    cuts.forEach(function (c) {
      var t = document.createElement('span');
      t.className = 'bm-tick';
      t.style.left = (CORE.barPos(c) * 100) + '%';
      t.textContent = nIn(c);
      els.ticks.appendChild(t);
    });
    els.bar.setAttribute('aria-label', U.scaleLabel + ' (' + txt.name + ')');
    els.scaleNote.textContent = txt.note || '';
  }

  // ---------------------------------------------------------------- 계산·그리기
  function setText(el, text) { el.textContent = text || ''; el.hidden = !text; }
  function values() {
    var o = { unit: unit, scale: scaleId() };
    Object.keys(els.inputs).forEach(function (k) { o[k] = els.inputs[k].value; });
    return o;
  }
  function update() {
    var c = CORE.run(values());
    Object.keys(els.inputs).forEach(function (k) { els.inputs[k].removeAttribute('aria-invalid'); });
    els.out.className = 'bm-card bm-out';
    if (c.started && !started) { started = true; track('start'); }
    if (!c.ok) {
      res = null;
      els.lead.textContent = U.waiting;
      els.big.textContent = '—';
      setText(els.cat, '');
      els.marker.hidden = true;
      els.range.hidden = true;
      els.minor.hidden = true;
      els.senior.hidden = true;
      els.sexNote.hidden = !sex;
      setText(els.err, c.error ? E[c.error] || E.badNum : '');
      if (c.error) {
        els.out.classList.add('is-err');
        if (els.inputs[c.field]) els.inputs[c.field].setAttribute('aria-invalid', 'true');
      }
      return;
    }
    var labels = scaleText().labels || [];
    res = c;
    els.out.classList.add('is-ok', 'is-c' + Math.min(c.cat, 5));
    els.lead.textContent = U.yourBmi;
    els.big.textContent = n1(c.bmi);
    setText(els.cat, labels[c.cat] || '');
    els.marker.hidden = false;
    els.marker.style.left = (c.pos * 100) + '%';
    els.rangeV.textContent = fmt(N.range, { min: w(c.minKg, c.unit), max: w(c.maxKg, c.unit) });
    els.rangeD.textContent = c.dir === 'in' ? U.inRange : fmt(c.dir === 'lose' ? U.toLose : U.toGain, { w: wDiff(c.diffKg, c.unit) });
    els.range.hidden = false;
    setText(els.err, '');
    els.minor.hidden = !c.minor;
    els.senior.hidden = !c.senior;
    els.sexNote.hidden = !sex;
    if (els.finishErr) els.finishErr.hidden = true;
    if (!els.result.hidden) fillSummary();
  }
  var liveTimer = null;
  function announce() {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      if (res && els.live) els.live.textContent = fmt(U.live, { bmi: n1(res.bmi), cat: (scaleText().labels || [])[res.cat] || '' });
    }, 700);
  }

  // ---------------------------------------------------------------- 단위 (바꾸면 들어 있는 값을 새 단위로 옮긴다)
  function setUnit(u, convert) {
    if (u !== 'metric' && u !== 'imperial') u = 'metric';
    if (convert && u !== unit) {
      var I2 = els.inputs;
      if (u === 'imperial') {
        var cm = CORE.parseNum(I2.cm.value), kg = CORE.parseNum(I2.kg.value);
        if (cm.value != null && cm.value > 0) { var fi = CORE.cmToFtIn(cm.value); I2.ft.value = String(fi.ft); I2.inch.value = nIn(fi.inch); }
        if (kg.value != null && kg.value > 0) I2.lb.value = nIn(CORE.round1(CORE.kgToLb(kg.value)));
      } else {
        var ft = CORE.parseNum(I2.ft.value), inch = CORE.parseNum(I2.inch.value), lb = CORE.parseNum(I2.lb.value);
        if (ft.value != null || inch.value != null) {
          var cm2 = CORE.ftInToCm(ft.value || 0, inch.value || 0);
          if (cm2 > 0) I2.cm.value = nIn(CORE.round1(cm2));
        }
        if (lb.value != null && lb.value > 0) I2.kg.value = nIn(CORE.round1(CORE.lbToKg(lb.value)));
      }
    }
    unit = u;
    els.units.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-unit') === u ? 'true' : 'false'); });
    els.boxes.forEach(function (b) { b.hidden = b.getAttribute('data-unit-box') !== u; });
    storeSet(u);
  }
  els.units.forEach(function (b) {
    b.addEventListener('click', function () { setUnit(b.getAttribute('data-unit'), true); update(); announce(); });
  });

  // ---------------------------------------------------------------- 입력·선택 항목
  var ORDER = { cm: 'kg', ft: 'inch', inch: 'lb' };
  Object.keys(els.inputs).forEach(function (k) {
    var inp = els.inputs[k];
    inp.addEventListener('input', function () { update(); announce(); });
    inp.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (ORDER[k]) els.inputs[ORDER[k]].focus(); else inp.blur();
    });
  });
  els.more.addEventListener('click', function () {
    var open = els.moreBox.hidden;
    els.moreBox.hidden = !open;
    els.more.setAttribute('aria-expanded', open ? 'true' : 'false');
    els.more.textContent = open ? U.less : U.more;
    if (open) { try { els.inputs.age.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  });
  function setSex(v) {
    sex = v || '';
    els.sexBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-sex') === sex ? 'true' : 'false'); });
  }
  els.sexBtns.forEach(function (b) { b.addEventListener('click', function () { setSex(b.getAttribute('data-sex')); update(); }); });
  if (els.asia) els.asia.addEventListener('change', function () { drawBar(); update(); announce(); });

  // ---------------------------------------------------------------- 요약(끝 화면)
  function fillSummary() {
    if (!res) return;
    var txt = scaleText();
    els.sumBig.textContent = n1(res.bmi);
    els.sumCat.textContent = (txt.labels || [])[res.cat] || '';
    els.sumCat.className = 'bm-sum-cat bm-c' + Math.min(res.cat, 5);
    els.sumScale.textContent = txt.name;
    els.sumRange.textContent = fmt(N.range, { min: w(res.minKg, res.unit), max: w(res.maxKg, res.unit) });
    els.sumDiff.textContent = res.dir === 'in' ? U.inRange : fmt(res.dir === 'lose' ? U.toLose : U.toGain, { w: wDiff(res.diffKg, res.unit) });
  }
  function smoothTo(el, offset) {
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
  }
  function finish() {
    if (!res) {
      els.finishErr.textContent = U.needOne;
      els.finishErr.hidden = false;
      return;
    }
    els.finishErr.hidden = true;
    fillSummary();
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true;     // 요약·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    if (!doneRound) { doneRound = true; track('done'); }
    setTimeout(function () { smoothTo(els.summary, 70); }, 20);
  }
  els.finish.addEventListener('click', finish);

  // 다시 하기: 요약을 닫고 모든 입력을 비운 뒤 새 판 (단위·아시아 기준은 그대로)
  function reset() {
    started = false;
    doneRound = false;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    els.finishErr.hidden = true;
    Object.keys(els.inputs).forEach(function (k) { els.inputs[k].value = ''; });
    setSex('');
    update();
    try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    try { els.inputs[unit === 'imperial' ? 'ft' : 'cm'].focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  // 공통 끝 화면 공유: 깨끗한 주소(숫자 없음) + 고정 문구
  function baseUrl() {
    var base = window.location.href.split('#')[0].split('?')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  if (window.setShareData) window.setShareData(function () { return { title: U.shareTitle, text: U.shareText, url: baseUrl() }; });
  if (window.setRetry) window.setRetry({ label: U.again, action: reset });

  window.BMI_APP = {
    unit: function () { return unit; },
    scale: function () { return scaleId(); },
    result: function () { return res ? JSON.parse(JSON.stringify(res)) : null; },
    rounds: function () { return { start: rounds.start, done: rounds.done }; }
  };

  setUnit(storeGet() || 'metric', false);
  drawBar();
  update();
})();
