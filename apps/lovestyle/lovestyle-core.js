/* apps/lovestyle/lovestyle-core.js
 * 연애 유형 테스트 — 언어와 무관한 로직: 연애 유형 8종(id·이모지·색·찰떡궁합/앙숙) + 10문항의 채점 가중치 + 채점 함수 + 서버 비율 인코딩.
 * 문구(질문·보기·결과 설명·연애 팁)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].choices[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 가중치로 채점된다.
 * 브라우저(<script src="lovestyle-core.js"> → window.LOVESTYLE_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-lovestyle.js (전수 4^10 = 1,048,576가지 + 무작위 20만 회, 각 유형 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.LOVESTYLE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 동점 규칙의 마지막 단계에서 쓰는 고정 순서 (앞쪽이 우선). 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['puppy', 'cat', 'fox', 'bear', 'bunny', 'penguin', 'hamster', 'dolphin'];

  // emoji: 캐릭터(결과 그림·공유 문구), color: 결과 강조색, deep: 짙은 색(이름 글자색, 밝은 배경 위), ink: 옅은 배경색,
  // best/rival: 찰떡궁합 · 티격태격 앙숙 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    puppy: { emoji: '🐶', color: '#ffa94d', deep: '#b8560a', ink: '#fff1e0', best: 'cat', rival: 'fox' },
    cat: { emoji: '🐱', color: '#9d8cff', deep: '#5b45d6', ink: '#f0edff', best: 'puppy', rival: 'hamster' },
    fox: { emoji: '🦊', color: '#ff6b3d', deep: '#c2370f', ink: '#ffece5', best: 'bear', rival: 'puppy' },
    bear: { emoji: '🐻', color: '#c08552', deep: '#7a4a22', ink: '#f8eee4', best: 'fox', rival: 'dolphin' },
    bunny: { emoji: '🐰', color: '#ff7eb6', deep: '#c42a72', ink: '#ffeaf3', best: 'penguin', rival: 'dolphin' },
    penguin: { emoji: '🐧', color: '#4fb6f0', deep: '#14679a', ink: '#e6f5fd', best: 'bunny', rival: 'fox' },
    hamster: { emoji: '🐹', color: '#f2c14e', deep: '#946a00', ink: '#fdf6e1', best: 'dolphin', rival: 'cat' },
    dolphin: { emoji: '🐬', color: '#2ec4b6', deep: '#0b7a70', ink: '#e2f8f6', best: 'hamster', rival: 'bear' }
  };

  // 10문항 × 보기 4개. 보기마다 { 유형: 점수 } — 대표 유형 3점 + 곁다리 유형 1점.
  // 대표 유형은 문항마다 서로 다르고(두 문항씩 8종 전부), 10문항 전체에서 각 유형이 대표 5번 · 곁다리 5번(40 = 8 × 5).
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '💬', choices: [ // 썸 상대에게 먼저 연락이 왔다
      { puppy: 3, hamster: 1 }, { cat: 3, fox: 1 }, { fox: 3, dolphin: 1 }, { bear: 3, penguin: 1 }
    ] },
    { emoji: '☕', choices: [ // 첫 데이트 장소
      { bunny: 3, fox: 1 }, { penguin: 3, bear: 1 }, { hamster: 3, puppy: 1 }, { dolphin: 3, fox: 1 }
    ] },
    { emoji: '🎁', choices: [ // 연인의 생일
      { puppy: 3, hamster: 1 }, { fox: 3, cat: 1 }, { bunny: 3, penguin: 1 }, { hamster: 3, dolphin: 1 }
    ] },
    { emoji: '🌧️', choices: [ // 연인이 힘든 하루를 보냈다
      { cat: 3, penguin: 1 }, { bear: 3, puppy: 1 }, { penguin: 3, bunny: 1 }, { dolphin: 3, hamster: 1 }
    ] },
    { emoji: '📱', choices: [ // 연락 빈도
      { puppy: 3, bunny: 1 }, { bear: 3, penguin: 1 }, { bunny: 3, puppy: 1 }, { dolphin: 3, cat: 1 }
    ] },
    { emoji: '⚡', choices: [ // 작은 다툼
      { cat: 3, penguin: 1 }, { fox: 3, bunny: 1 }, { penguin: 3, bear: 1 }, { hamster: 3, dolphin: 1 }
    ] },
    { emoji: '💓', choices: [ // 설레는 순간
      { puppy: 3, bunny: 1 }, { hamster: 3, dolphin: 1 }, { dolphin: 3, fox: 1 }, { cat: 3, bear: 1 }
    ] },
    { emoji: '🗓️', choices: [ // 이상적인 주말 데이트
      { fox: 3, bunny: 1 }, { bear: 3, hamster: 1 }, { bunny: 3, puppy: 1 }, { penguin: 3, cat: 1 }
    ] },
    { emoji: '💭', choices: [ // 누군가 좋아지면
      { puppy: 3, hamster: 1 }, { fox: 3, cat: 1 }, { penguin: 3, bear: 1 }, { dolphin: 3, puppy: 1 }
    ] },
    { emoji: '🔑', choices: [ // 연애에서 가장 중요한 것
      { cat: 3, dolphin: 1 }, { bear: 3, cat: 1 }, { bunny: 3, fox: 1 }, { hamster: 3, bear: 1 }
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

  // 같은 유형이 나온 사람 비율(서버 실제 값): poll_vote 는 보기 번호가 0~9 라서 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'lovestyle';
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
