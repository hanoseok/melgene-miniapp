/* apps/costume/costume-core.js
 * 할로윈 코스튬 추천 테스트 — 언어와 무관한 로직: 코스튬 8종(id·이모지·색·찰떡 단짝/라이벌) + 12문항의 채점 가중치 + 채점 함수 + 서버 비율 인코딩.
 * 문구(질문·보기·결과 설명·코스튬 팁)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].choices[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 가중치로 채점된다.
 * 브라우저(<script src="costume-core.js"> → window.COSTUME_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-costume.js (전수 4^12 = 16,777,216가지 + 무작위 20만 회, 각 유형 8%~18%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.COSTUME_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 동점 규칙의 마지막 단계에서 쓰는 고정 순서 (앞쪽이 우선). 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['vampire', 'witch', 'ghost', 'zombie', 'blackcat', 'mummy', 'pumpkin', 'skeleton'];

  // emoji: 공유 문구용, color: 결과 강조색, deep: 짙은 색(그라데이션 바깥), ink: 이름 글자색(어두운 배경 위),
  // best/rival: 찰떡 단짝 · 티격태격 라이벌 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    vampire: { emoji: '🧛', color: '#e0334f', deep: '#6e0f22', ink: '#ff8597', best: 'witch', rival: 'skeleton' },
    witch: { emoji: '🧙', color: '#9b5cff', deep: '#3d1a7a', ink: '#c7a3ff', best: 'blackcat', rival: 'zombie' },
    ghost: { emoji: '👻', color: '#b9e6ff', deep: '#3f6f99', ink: '#d8f1ff', best: 'mummy', rival: 'pumpkin' },
    zombie: { emoji: '🧟', color: '#8fd14f', deep: '#2f5a17', ink: '#b5ec7d', best: 'skeleton', rival: 'vampire' },
    blackcat: { emoji: '🐈‍⬛', color: '#ffd23f', deep: '#5a4500', ink: '#ffe27a', best: 'witch', rival: 'ghost' },
    mummy: { emoji: '🩹', color: '#e8d3a2', deep: '#6b5530', ink: '#f3e4bf', best: 'ghost', rival: 'zombie' },
    pumpkin: { emoji: '🎃', color: '#ff8a1f', deep: '#7a3300', ink: '#ffb066', best: 'skeleton', rival: 'blackcat' },
    skeleton: { emoji: '💀', color: '#f2efe6', deep: '#4d4a5c', ink: '#ffffff', best: 'pumpkin', rival: 'mummy' }
  };

  // 12문항 × 보기 4개. 보기마다 { 유형: 점수 } — 대표 유형 3점 + 곁다리 유형 1점.
  // 대표 유형은 문항마다 서로 다르고, 12문항 전체에서 각 유형이 대표 6번씩(48 = 8 × 6).
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '💌', choices: [ // 할로윈 파티 초대장이 왔다
      { vampire: 3, witch: 1 }, { pumpkin: 3, skeleton: 1 }, { ghost: 3, zombie: 1 }, { witch: 3, mummy: 1 }
    ] },
    { emoji: '🛍️', choices: [ // 코스튬 가게에서 먼저 가는 곳
      { vampire: 3, blackcat: 1 }, { zombie: 3, skeleton: 1 }, { blackcat: 3, ghost: 1 }, { mummy: 3, witch: 1 }
    ] },
    { emoji: '🚪', choices: [ // 파티장에 들어서면
      { skeleton: 3, pumpkin: 1 }, { pumpkin: 3, vampire: 1 }, { blackcat: 3, ghost: 1 }, { zombie: 3, mummy: 1 }
    ] },
    { emoji: '🔔', choices: [ // 사탕 받으러 온 아이들
      { skeleton: 3, pumpkin: 1 }, { ghost: 3, skeleton: 1 }, { mummy: 3, pumpkin: 1 }, { witch: 3, blackcat: 1 }
    ] },
    { emoji: '🎶', choices: [ // 좋아하는 노래가 나온다
      { skeleton: 3, zombie: 1 }, { vampire: 3, blackcat: 1 }, { zombie: 3, ghost: 1 }, { pumpkin: 3, mummy: 1 }
    ] },
    { emoji: '📸', choices: [ // 단체 사진
      { vampire: 3, pumpkin: 1 }, { ghost: 3, blackcat: 1 }, { skeleton: 3, zombie: 1 }, { mummy: 3, witch: 1 }
    ] },
    { emoji: '🕯️', choices: [ // 무서운 이야기 하자
      { witch: 3, vampire: 1 }, { ghost: 3, mummy: 1 }, { skeleton: 3, pumpkin: 1 }, { blackcat: 3, zombie: 1 }
    ] },
    { emoji: '🍕', choices: [ // 간식 테이블
      { zombie: 3, pumpkin: 1 }, { witch: 3, blackcat: 1 }, { blackcat: 3, vampire: 1 }, { mummy: 3, ghost: 1 }
    ] },
    { emoji: '🌑', choices: [ // 자정에 불이 꺼졌다
      { mummy: 3, pumpkin: 1 }, { skeleton: 3, ghost: 1 }, { blackcat: 3, vampire: 1 }, { zombie: 3, skeleton: 1 }
    ] },
    { emoji: '🏆', choices: [ // 코스튬 대회에서 받을 상
      { vampire: 3, witch: 1 }, { witch: 3, mummy: 1 }, { pumpkin: 3, skeleton: 1 }, { ghost: 3, blackcat: 1 }
    ] },
    { emoji: '🏚️', choices: [ // 귀신의 집 체험
      { pumpkin: 3, zombie: 1 }, { blackcat: 3, witch: 1 }, { ghost: 3, skeleton: 1 }, { witch: 3, mummy: 1 }
    ] },
    { emoji: '🌅', choices: [ // 파티 다음 날 아침
      { vampire: 3, zombie: 1 }, { mummy: 3, ghost: 1 }, { pumpkin: 3, witch: 1 }, { zombie: 3, vampire: 1 }
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

  // 같은 코스튬이 나온 사람 비율(서버 실제 값): poll_vote 는 보기 번호가 0~9 라서 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'costume';
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
