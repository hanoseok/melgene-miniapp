/* apps/past-life/quiz.js — 시작(티징) + 12문항 퀴즈 + 로딩 흐름 (SPA 방식, 같은 페이지 안에서 화면 전환)
 * 채점 가중치는 data.js(PAST_LIFE_DATA, 언어 무관), 질문/보기 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 퀴즈 화면 안의 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 보일 때만). 결과 페이지는 공통 끝 화면을 쓴다.
 */
(function () {
  'use strict';

  var DATA = window.PAST_LIFE_DATA;
  var QUESTIONS = DATA.questions;
  var TEXT = (window.PAGE_I18N || {}).questions || [];
  var TOTAL = QUESTIONS.length;

  var els = {
    landing: document.getElementById('screen-landing'),
    quiz: document.getElementById('screen-quiz'),
    loading: document.getElementById('screen-loading'),
    startBtn: document.getElementById('start-btn'),
    backBtn: document.getElementById('back-btn'),
    progressFill: document.getElementById('progress-fill'),
    progressNum: document.getElementById('progress-num'),
    questionHost: document.getElementById('question-host'),
    year: document.getElementById('year'),
  };

  if (els.year) els.year.textContent = new Date().getFullYear();

  var current = 0;
  var answers = new Array(TOTAL).fill(null); // 각 문항에서 고른 choice index
  var busy = false; // 보기를 누른 뒤 다음 문항으로 넘어가는 0.26초 동안 연타 무시
  var finished = false; // track('done') 은 한 판에 한 번

  function showScreen(name) {
    els.landing.classList.toggle('active', name === 'landing');
    els.quiz.classList.toggle('active', name === 'quiz');
    els.loading.classList.toggle('active', name === 'loading');
    // landing엔 원래 .active 토글 클래스가 없으니 display로 직접 제어
    els.landing.style.display = name === 'landing' ? '' : 'none';
  }

  function renderQuestion(index) {
    var q = QUESTIONS[index];
    var qt = TEXT[index] || { q: '', choices: [] };
    var picked = answers[index];

    els.progressFill.style.width = Math.round((index / TOTAL) * 100) + '%';
    els.progressNum.textContent = (index + 1) + ' / ' + TOTAL;
    els.backBtn.style.visibility = 'visible';

    var wrap = document.createElement('div');
    wrap.className = 'pl-q-card pl-q-transition';

    var num = document.createElement('div');
    num.className = 'pl-q-num';
    num.textContent = 'Q' + (index + 1);
    wrap.appendChild(num);

    var text = document.createElement('h2');
    text.className = 'pl-q-text';
    text.textContent = qt.q;
    wrap.appendChild(text);

    var choicesEl = document.createElement('div');
    choicesEl.className = 'pl-choices';

    q.choices.forEach(function (choice, ci) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pl-choice' + (picked === ci ? ' picked' : '');
      btn.textContent = qt.choices[ci] || '';
      btn.addEventListener('click', function () { onAnswer(index, ci); });
      choicesEl.appendChild(btn);
    });

    wrap.appendChild(choicesEl);
    els.questionHost.innerHTML = '';
    els.questionHost.appendChild(wrap);
    // 아래(광고 쪽)로 스크롤해 둔 상태면 새 문항이 보이게 올린다
    if (els.quiz.getBoundingClientRect().top < 0) window.scrollTo(0, 0);
  }

  function onAnswer(index, choiceIndex) {
    if (busy || finished) return;
    busy = true;
    answers[index] = choiceIndex;
    // 선택 즉시 시각 피드백
    var buttons = els.questionHost.querySelectorAll('.pl-choice');
    buttons.forEach(function (b, i) { b.classList.toggle('picked', i === choiceIndex); });

    window.setTimeout(function () {
      busy = false;
      if (index < TOTAL - 1) {
        current = index + 1;
        renderQuestion(current);
      } else {
        finishQuiz();
      }
    }, 260);
  }

  function goBack() {
    if (busy || finished) return;
    if (current === 0) {
      showScreen('landing');
      return;
    }
    current -= 1;
    renderQuestion(current);
  }

  function computeResult() {
    var totals = {};
    answers.forEach(function (choiceIndex, qi) {
      if (choiceIndex === null) return;
      var weights = QUESTIONS[qi].choices[choiceIndex].weights;
      Object.keys(weights).forEach(function (typeId) {
        totals[typeId] = (totals[typeId] || 0) + weights[typeId];
      });
    });
    // 동점 시 order 배열 순서상 앞선 타입이 우선 (tools/check-reach.js와 동일 규칙)
    var best = DATA.order[0];
    var bestVal = -Infinity;
    DATA.order.forEach(function (id) {
      var v = totals[id] || 0;
      if (v > bestVal) { bestVal = v; best = id; }
    });
    return best;
  }

  function finishQuiz() {
    if (finished) return;
    finished = true;
    try { window.track && window.track('quiz_complete'); window.track && window.track('done'); } catch (e) {}
    showScreen('loading');
    var resultId = computeResult();
    window.setTimeout(function () {
      window.location.href = 'r/' + resultId + '.html';
    }, 1500);
  }

  function startQuiz() {
    finished = false;
    busy = false;
    answers = new Array(TOTAL).fill(null);
    try { sessionStorage.setItem('pl_took_quiz', '1'); } catch (e) {}
    try { window.track && window.track('quiz_start'); window.track && window.track('start'); } catch (e) {}
    current = 0;
    showScreen('quiz');
    renderQuestion(0);
  }

  els.startBtn.addEventListener('click', startQuiz);
  els.backBtn.addEventListener('click', goBack);

  showScreen('landing');
  // 결과 페이지에서 뒤로 오면(bfcache) 로딩 화면에 멈춰 있지 않게 시작 화면으로 되돌린다
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { finished = false; busy = false; showScreen('landing'); }
  });
})();
