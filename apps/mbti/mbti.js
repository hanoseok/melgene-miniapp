/* apps/mbti/mbti.js — 시작(티징) → 20문항(5단계 동의 척도) → 분석 중 → 결과 페이지(r/<id>.html#d=<축 비율>)로 이동
 * 채점은 mbti-core.js(MBTI_CORE, 언어 무관), 질문·척도 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 질문 화면 안의 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 보일 때만). 결과 페이지는 공통 끝 화면을 쓴다.
 * 한 판이 시작될 때(첫 질문이 보일 때) track('start'), 끝날 때 track('done') 한 번씩.
 * 결과 페이지가 "방금 푼 결과"인지 알도록 sessionStorage 에 표시한다.
 */
(function () {
  'use strict';

  var CORE = window.MBTI_CORE;
  var UI = window.PAGE_I18N || {};
  var TEXT = UI.questions || [];
  var SCALE = UI.scale || [];
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
  var busy = false;     // 답을 누른 뒤 다음 문항으로 넘어가는 동안 연타 무시
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
    els.fill.style.width = Math.round((index / TOTAL) * 100) + '%';
    els.fill.parentNode.setAttribute('aria-valuenow', String(index));
    els.num.textContent = (index + 1) + ' / ' + TOTAL;

    var card = document.createElement('div');
    card.className = 'mb-q-card';
    var top = document.createElement('div');
    top.className = 'mb-q-top';
    var emo = document.createElement('span');
    emo.className = 'mb-q-emoji';
    emo.setAttribute('aria-hidden', 'true');
    emo.textContent = q.emoji || '';
    var lab = document.createElement('span');
    lab.className = 'mb-q-num';
    lab.textContent = fmt(UI.qLabel || 'Q{n}', { n: index + 1 });
    top.appendChild(emo);
    top.appendChild(lab);
    card.appendChild(top);

    var h = document.createElement('h2');
    h.className = 'mb-q-text';
    h.textContent = TEXT[index] || '';
    card.appendChild(h);

    // 5단계: 위에서부터 매우 그렇다(4) → 전혀 아니다(0). 왼쪽 점의 크기·색으로 강도를 보여 준다.
    var list = document.createElement('div');
    list.className = 'mb-scale';
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', TEXT[index] || '');
    for (var v = CORE.SCALE - 1; v >= 0; v--) {
      (function (val) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'mb-choice mb-v' + val + (answers[index] === val ? ' is-picked' : '');
        b.setAttribute('data-v', String(val));
        var dot = document.createElement('span');
        dot.className = 'mb-dot';
        dot.setAttribute('aria-hidden', 'true');
        var t = document.createElement('span');
        t.className = 'mb-choice-text';
        t.textContent = SCALE[val] || '';
        b.appendChild(dot);
        b.appendChild(t);
        b.addEventListener('click', function () { pick(index, val); });
        list.appendChild(b);
      })(v);
    }
    card.appendChild(list);
    els.host.innerHTML = '';
    els.host.appendChild(card);
    if (els.quiz.getBoundingClientRect().top < 0) window.scrollTo(0, 0);
  }

  function pick(index, val) {
    if (busy || finished) return;
    busy = true;
    answers[index] = val;
    Array.prototype.forEach.call(els.host.querySelectorAll('.mb-choice'), function (b) {
      b.classList.toggle('is-picked', Number(b.getAttribute('data-v')) === val);
    });
    window.setTimeout(function () {
      busy = false;
      if (index < TOTAL - 1) { current = index + 1; render(current); }
      else finish();
    }, REDUCED ? 60 : 220);
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
    try { sessionStorage.setItem('mb_took', '1'); sessionStorage.setItem('mb_new', r.id); } catch (e) { /* noop */ }
    show('loading');
    window.setTimeout(function () {
      window.location.href = 'r/' + r.id + '.html#d=' + CORE.encodePct(r.pct);
    }, REDUCED ? 400 : 1800);
  }

  function start() {
    finished = false;
    busy = false;
    answers = new Array(TOTAL).fill(null);
    current = 0;
    show('quiz');
    render(0);
    try { if (window.track) window.track('start'); } catch (e) { /* noop */ }
  }

  els.startBtn.addEventListener('click', start);
  els.backBtn.addEventListener('click', back);
  show('start');
  // 결과 페이지에서 뒤로 오면(bfcache) 분석 중 화면에 멈춰 있지 않게 시작 화면으로
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { finished = false; busy = false; show('start'); }
  });
})();
