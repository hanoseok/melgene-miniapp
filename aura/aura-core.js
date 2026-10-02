/* apps/aura/aura-core.js
 * 오라 컬러 테스트 — 언어와 무관한 로직: 결과 8종(id·이모지·그라데이션 색·찰떡/상극 오라) + 12문항의 채점 가중치 + 채점 함수 + 서버 비율 인코딩.
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].choices[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 가중치로 채점된다.
 * 브라우저(<script src="aura-core.js"> → window.AURA_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-aura.js (전수 4^12 = 16,777,216가지 + 무작위 20만 회, 각 유형 8%~18%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.AURA_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 동점 규칙의 마지막 단계에서 쓰는 고정 순서 (앞쪽이 우선). 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'pink'];

  // emoji: 공유 문구용, core/mid/edge: 오라 그라데이션(안쪽 → 바깥), ink: 이름 글자색(어두운 배경 위),
  // best/clash: 찰떡 오라·상극 오라 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    red: { emoji: '❤️‍🔥', core: '#fff1e8', mid: '#ff4d5e', edge: '#b3122e', ink: '#ff7a86', best: 'yellow', clash: 'blue' },
    orange: { emoji: '🧡', core: '#fff6e6', mid: '#ff9a3c', edge: '#e0521b', ink: '#ffae66', best: 'pink', clash: 'indigo' },
    yellow: { emoji: '💛', core: '#fffdf0', mid: '#ffd84d', edge: '#f0a500', ink: '#ffe07a', best: 'green', clash: 'violet' },
    green: { emoji: '💚', core: '#f2fff4', mid: '#5fdc8c', edge: '#138a5a', ink: '#7fe8a6', best: 'blue', clash: 'red' },
    blue: { emoji: '💙', core: '#eefaff', mid: '#4fb6ff', edge: '#1a5fd6', ink: '#7ccaff', best: 'indigo', clash: 'orange' },
    indigo: { emoji: '🌌', core: '#eef0ff', mid: '#6f6bff', edge: '#2e1f9e', ink: '#a19eff', best: 'violet', clash: 'yellow' },
    violet: { emoji: '💜', core: '#fbf0ff', mid: '#c46bff', edge: '#7a1fc7', ink: '#d49bff', best: 'red', clash: 'green' },
    pink: { emoji: '🩷', core: '#fff0f6', mid: '#ff7eb6', edge: '#d63384', ink: '#ff9cc8', best: 'orange', clash: 'red' }
  };

  // 12문항 × 보기 4개. 보기마다 { 유형: 점수 } — 대표 유형 3점 + 곁다리 유형 1점.
  // 대표 유형은 문항마다 서로 다르고, 12문항 전체에서 각 유형이 대표 6번씩(48 = 8 × 6).
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '☀️', choices: [ // 느긋한 주말 아침
      { red: 3, yellow: 1 }, { orange: 3, red: 1 }, { green: 3, blue: 1 }, { indigo: 3, violet: 1 }
    ] },
    { emoji: '📱', choices: [ // 친구가 "얘기 좀 할 수 있어?"
      { pink: 3, green: 1 }, { blue: 3, indigo: 1 }, { yellow: 3, orange: 1 }, { violet: 3, pink: 1 }
    ] },
    { emoji: '🎈', choices: [ // 처음 가 본 파티
      { orange: 3, yellow: 1 }, { yellow: 3, pink: 1 }, { indigo: 3, blue: 1 }, { red: 3, orange: 1 }
    ] },
    { emoji: '🏡', choices: [ // 1년 동안 살 곳
      { green: 3, pink: 1 }, { blue: 3, green: 1 }, { violet: 3, indigo: 1 }, { red: 3, violet: 1 }
    ] },
    { emoji: '⏰', choices: [ // 내일 마감인 팀 과제
      { red: 3, blue: 1 }, { blue: 3, green: 1 }, { violet: 3, yellow: 1 }, { pink: 3, indigo: 1 }
    ] },
    { emoji: '✨', choices: [ // 초능력 하나
      { indigo: 3, violet: 1 }, { orange: 3, yellow: 1 }, { green: 3, pink: 1 }, { yellow: 3, orange: 1 }
    ] },
    { emoji: '📷', choices: [ // 사진첩에 가장 많은 것
      { pink: 3, orange: 1 }, { green: 3, blue: 1 }, { violet: 3, indigo: 1 }, { orange: 3, red: 1 }
    ] },
    { emoji: '🌧️', choices: [ // 스트레스가 쌓였을 때
      { blue: 3, indigo: 1 }, { red: 3, orange: 1 }, { indigo: 3, violet: 1 }, { yellow: 3, pink: 1 }
    ] },
    { emoji: '👀', choices: [ // 처음 본 사람이 느끼는 나
      { red: 3, violet: 1 }, { pink: 3, yellow: 1 }, { blue: 3, green: 1 }, { violet: 3, indigo: 1 }
    ] },
    { emoji: '🎁', choices: [ // 받고 싶은 선물
      { green: 3, pink: 1 }, { yellow: 3, orange: 1 }, { indigo: 3, blue: 1 }, { orange: 3, red: 1 }
    ] },
    { emoji: '💬', choices: [ // 말다툼이 시작될 때
      { blue: 3, green: 1 }, { pink: 3, red: 1 }, { yellow: 3, red: 1 }, { indigo: 3, violet: 1 }
    ] },
    { emoji: '🌙', choices: [ // 내 인생의 좌우명
      { orange: 3, red: 1 }, { green: 3, blue: 1 }, { violet: 3, yellow: 1 }, { pink: 3, green: 1 }
    ] }
  ];

  // 채점: 합계가 가장 높은 유형. 동점이면 ① 대표(3점) 보기로 더 많이 뽑힌 유형 ② 더 나중 문항에서 점수를 받은 유형
  // ③ ORDER 앞쪽 순. 같은 답이면 언제나 같은 결과(결정적). answers[i] = i번 문항에서 고른 보기 번호(없으면 null).
  function score(answers) {
    var total = {}, main = {}, last = {};
    ORDER.forEach(function (id) { total[id] = 0; main[id] = 0; last[id] = -1; });
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var w = QUESTIONS[qi].choices[ci];
      if (!w) continue;
      for (var id in w) {
        if (!Object.prototype.hasOwnProperty.call(w, id)) continue;
        total[id] += w[id];
        if (w[id] >= 3) main[id]++;
        last[id] = qi;
      }
    }
    var best = ORDER[0];
    for (var k = 1; k < ORDER.length; k++) {
      var c = ORDER[k];
      if (total[c] > total[best] ||
          (total[c] === total[best] && (main[c] > main[best] ||
            (main[c] === main[best] && last[c] > last[best])))) best = c;
    }
    return best;
  }

  // 같은 오라가 나온 사람 비율(서버 실제 값): poll_vote 는 보기 번호가 0~9 라서 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'aura';
  function pollSlot(id) { return { qid: 'r0', opt: ORDER.indexOf(id) }; }
  // poll_results 행([{ qid, option, votes }]) → { total, counts: { 유형: 명 } } 또는 null
  function pollCounts(rows) {
    if (!Array.isArray(rows)) return null;
    var counts = {}, total = 0;
    rows.forEach(function (r) {
      var o = Number(r.option), v = Number(r.votes) || 0;
      if (r.qid !== 'r0' || !(o >= 0 && o < ORDER.length)) return;
      counts[ORDER[o]] = (counts[ORDER[o]] || 0) + v;
      total += v;
    });
    return { total: total, counts: counts };
  }

  return { ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, score: score, POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts };
});
