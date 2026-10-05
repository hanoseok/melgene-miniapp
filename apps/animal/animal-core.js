/* apps/animal/animal-core.js
 * 나와 닮은 동물 테스트 — 언어와 무관한 로직: 동물 8종(id·이모지·색·찰떡궁합/앙숙) + 8문항의 채점 가중치 + 채점 함수 + 서버 비율 인코딩.
 * 문구(질문·보기·결과 설명·성격 꿀팁)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].choices[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 가중치로 채점된다.
 * 브라우저(<script src="animal-core.js"> → window.ANIMAL_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-animal.js (전수 4^8 = 65,536가지 + 무작위 20만 회, 각 유형 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.ANIMAL_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 동점 규칙의 마지막 단계에서 쓰는 고정 순서 (앞쪽이 우선). 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['wolf', 'owl', 'otter', 'lion', 'panda', 'eagle', 'sloth', 'deer'];

  // emoji: 캐릭터(결과 그림·공유 문구), color: 결과 강조색, deep: 짙은 색(이름 글자색, 밝은 배경 위), ink: 옅은 배경색,
  // best/rival: 찰떡궁합 · 티격태격 앙숙 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    wolf: { emoji: '🐺', color: '#7c8aa5', deep: '#3d4a66', ink: '#eaeef5', best: 'deer', rival: 'sloth' },
    owl: { emoji: '🦉', color: '#a47c52', deep: '#6b4520', ink: '#f6ede3', best: 'otter', rival: 'lion' },
    otter: { emoji: '🦦', color: '#2fb5c4', deep: '#0b6b78', ink: '#e0f6f8', best: 'owl', rival: 'eagle' },
    lion: { emoji: '🦁', color: '#f2a93b', deep: '#a3600a', ink: '#fff2dc', best: 'panda', rival: 'owl' },
    panda: { emoji: '🐼', color: '#4caf6a', deep: '#1f6b3a', ink: '#e3f5e8', best: 'lion', rival: 'wolf' },
    eagle: { emoji: '🦅', color: '#e0583d', deep: '#9c2a14', ink: '#ffe8e2', best: 'sloth', rival: 'otter' },
    sloth: { emoji: '🦥', color: '#b08ad6', deep: '#6a3fa0', ink: '#f1e9fa', best: 'eagle', rival: 'wolf' },
    deer: { emoji: '🦌', color: '#e58fa8', deep: '#a53d5f', ink: '#fdeaf0', best: 'wolf', rival: 'lion' }
  };

  // 8문항 × 보기 4개. 보기마다 { 유형: 점수 } — 대표 유형 3점 + 곁다리 유형 1점.
  // 대표 유형은 문항마다 서로 다르고, 8문항 전체에서 각 유형이 대표 4번 · 곁다리 4번(32 = 8 × 4).
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '📅', choices: [ // 약속이 갑자기 취소된 주말
      { wolf: 3, lion: 1 }, { owl: 3, deer: 1 }, { otter: 3, lion: 1 }, { lion: 3, eagle: 1 }
    ] },
    { emoji: '🧩', choices: [ // 팀 과제가 떨어졌다
      { sloth: 3, panda: 1 }, { panda: 3, sloth: 1 }, { eagle: 3, owl: 1 }, { deer: 3, otter: 1 }
    ] },
    { emoji: '📞', choices: [ // 친구가 한밤중에 전화
      { otter: 3, deer: 1 }, { eagle: 3, wolf: 1 }, { wolf: 3, eagle: 1 }, { panda: 3, otter: 1 }
    ] },
    { emoji: '🎉', choices: [ // 아는 사람이 한 명뿐인 파티
      { deer: 3, owl: 1 }, { lion: 3, wolf: 1 }, { owl: 3, sloth: 1 }, { sloth: 3, panda: 1 }
    ] },
    { emoji: '🧳', choices: [ // 꿈의 여행
      { panda: 3, deer: 1 }, { wolf: 3, otter: 1 }, { deer: 3, sloth: 1 }, { owl: 3, eagle: 1 }
    ] },
    { emoji: '⚠️', choices: [ // 갑작스러운 문제
      { eagle: 3, lion: 1 }, { otter: 3, lion: 1 }, { sloth: 3, owl: 1 }, { lion: 3, wolf: 1 }
    ] },
    { emoji: '💬', choices: [ // 친구들이 말하는 나
      { deer: 3, wolf: 1 }, { eagle: 3, panda: 1 }, { wolf: 3, owl: 1 }, { otter: 3, sloth: 1 }
    ] },
    { emoji: '🌙', choices: [ // 완벽한 저녁
      { lion: 3, otter: 1 }, { panda: 3, eagle: 1 }, { owl: 3, deer: 1 }, { sloth: 3, panda: 1 }
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
  var POLL = 'animal';
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
