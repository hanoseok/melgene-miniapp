/* apps/mentalage/mentalage.js — 시작(티징) → 질문 12개 → 마음 나이 재는 중 → 결과 페이지(r/<id>.html#a=<나이>)로 이동
 * 채점은 mentalage-core.js(MENTALAGE_CORE, 언어 무관), 질문·보기 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 질문 화면 안의 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 보일 때만). 결과 페이지는 공통 끝 화면을 쓴다.
 * 한 판이 시작될 때 track('start'), 끝날 때 track('done') 한 번씩. 결과 페이지가 "방금 푼 결과"인지 알도록 sessionStorage 에 표시한다.
 */
(function () {
  'use strict';

  var CORE = window.MENTALAGE_CORE;
  var UI = window.PAGE_I18N || {};
  var TEXT = UI.questions || [];
  var TOTAL = CORE.QUESTIONS.length;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), quiz: $('screen-quiz'), loading: $('screen-loading'),
    startBtn: $('start-btn'), backBtn: $('back-btn'),
    fill: $('progress-fill'), num: $('progress-num'), host: $('question-host'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var current = 0;
  var answers = [];
  var busy = false;     // 보기를 누른 뒤 다음 문항으로 넘어가는 동안 연타 무시
  var finished = false; // track('done') 은 한 판에 한 번

  function show(name) {
    els.start.hidden = name !== 'start';
    els.quiz.hidden = name !== 'quiz';
    els.loading.hidden = name !== 'loading';
    window.scrollTo(0, 0);
  }

  function fmt(tpl, vars) {
    return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }

  function render(index) {
    var q = CORE.QUESTIONS[index];
    var qt = TEXT[index] || { q: '', choices: [] };
    els.fill.style.width = Math.round((index / TOTAL) * 100) + '%';
    els.fill.parentNode.setAttribute('aria-valuenow', String(index));
    els.num.textContent = (index + 1) + ' / ' + TOTAL;

    var card = document.createElement('div');
    card.className = 'ma-q-card';
    var top = document.createElement('div');
    top.className = 'ma-q-top';
    var emo = document.createElement('span');
    emo.className = 'ma-q-emoji';
    emo.setAttribute('aria-hidden', 'true');
    emo.textContent = q.emoji || '';
    var lab = document.createElement('span');
    lab.className = 'ma-q-num';
    lab.textContent = fmt(UI.qLabel || 'Q{n}', { n: index + 1 });
    top.appendChild(emo);
    top.appendChild(lab);
    card.appendChild(top);

    var h = document.createElement('h2');
    h.className = 'ma-q-text';
    h.textContent = qt.q;
    card.appendChild(h);

    var list = document.createElement('div');
    list.className = 'ma-choices';
    q.points.forEach(function (p, ci) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'ma-choice' + (answers[index] === ci ? ' is-picked' : '');
      b.textContent = qt.choices[ci] || '';
      b.addEventListener('click', function () { pick(index, ci); });
      list.appendChild(b);
    });
    card.appendChild(list);
    els.host.innerHTML = '';
    els.host.appendChild(card);
    if (els.quiz.getBoundingClientRect().top < 0) window.scrollTo(0, 0);
  }

  function pick(index, ci) {
    if (busy || finished) return;
    busy = true;
    answers[index] = ci;
    Array.prototype.forEach.call(els.host.querySelectorAll('.ma-choice'), function (b, i) {
      b.classList.toggle('is-picked', i === ci);
    });
    window.setTimeout(function () {
      busy = false;
      if (index < TOTAL - 1) { current = index + 1; render(current); }
      else finish();
    }, REDUCED ? 60 : 240);
  }

  function back() {
    if (busy || finished) return;
    if (current === 0) { show('start'); return; }
    current -= 1;
    render(current);
  }

  function finish() {
    if (finished) return;
    finished = true;
    var r = CORE.result(answers);
    try { if (window.track) window.track('done'); } catch (e) { /* noop */ }
    try { sessionStorage.setItem('ma_took', '1'); sessionStorage.setItem('ma_new', r.id); } catch (e) { /* noop */ }
    show('loading');
    window.setTimeout(function () {
      window.location.href = 'r/' + r.id + '.html#a=' + r.age;
    }, REDUCED ? 400 : 2000);
  }

  function start() {
    finished = false;
    busy = false;
    answers = new Array(TOTAL).fill(null);
    current = 0;
    try { if (window.track) window.track('start'); } catch (e) { /* noop */ }
    show('quiz');
    render(0);
  }

  els.startBtn.addEventListener('click', start);
  els.backBtn.addEventListener('click', back);
  show('start');
  // 결과 페이지에서 뒤로 오면(bfcache) 재는 중 화면에 멈춰 있지 않게 시작 화면으로
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { finished = false; busy = false; show('start'); }
  });
})();
