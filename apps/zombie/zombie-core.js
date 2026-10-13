/* apps/zombie/zombie-core.js
 * 좀비 생존 테스트 — 언어와 무관한 로직: 생존자 역할 8종(id·이모지·색·최고/최악의 파트너) + 12문항의 보기별 점수(주 유형 +2, 보조 유형 +1)
 * + 채점(유형별 합 → 최고점, 동점이면 "늦은 문항에서 더 받은 쪽" → 그래도 같으면 ORDER 순) + 서버 비율(poll) 인코딩.
 * 문구(상황·보기·결과 설명·생존 팁)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 점수로 채점된다.
 * 브라우저(<script src="zombie-core.js"> → window.ZOMBIE_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-zombie.js (전수 4^12 = 16,777,216가지 + 무작위, 각 결과 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.ZOMBIE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['leader', 'strategist', 'medic', 'scavenger', 'engineer', 'lonewolf', 'cheer', 'lucky'];

  // emoji: 결과 그림 가운데, color: 강조색(밤 배경에서 빛나는 색), deep: 짙은 테두리·그림자색, ink: 아주 어두운 카드 바탕색,
  // best/worst: 최고의 파트너·최악의 파트너 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    leader: { emoji: '📣', color: '#ffb02e', deep: '#a3600a', ink: '#2b1f0c', best: 'medic', worst: 'lonewolf' },
    strategist: { emoji: '🗺️', color: '#5ec8ff', deep: '#1f6f9e', ink: '#0e2130', best: 'engineer', worst: 'lucky' },
    medic: { emoji: '🩹', color: '#ff7a8a', deep: '#a53346', ink: '#2c1318', best: 'leader', worst: 'scavenger' },
    scavenger: { emoji: '🎒', color: '#e3a35f', deep: '#8a5521', ink: '#2a1c10', best: 'engineer', worst: 'medic' },
    engineer: { emoji: '🔧', color: '#9aa7ff', deep: '#4652b0', ink: '#161a33', best: 'scavenger', worst: 'cheer' },
    lonewolf: { emoji: '🐺', color: '#b4c2cc', deep: '#56656f', ink: '#1a2025', best: 'strategist', worst: 'leader' },
    cheer: { emoji: '🎸', color: '#ff8ad8', deep: '#a33a86', ink: '#2c1226', best: 'lucky', worst: 'lonewolf' },
    lucky: { emoji: '🍀', color: '#7fe08a', deep: '#2f8a3c', ink: '#112716', best: 'cheer', worst: 'strategist' }
  };

  // 12문항. c[j] = [주 유형, 보조 유형] — j번 보기를 고르면 주 유형 +2, 보조 유형 +1.
  // 8종이 각각 주 유형으로 6번씩. 보기 순서가 섞여 있어 "늘 첫 번째 = 같은 유형" 같은 규칙이 없다.
  // 보조 유형은 보기마다 그럴듯한 후보 2~3개 중에서 전수 분포가 가장 고르게 나오도록 탐색해 정했다(바꾸면 check 를 다시 돌린다).
  // emoji 는 상황 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '⏰', c: [['leader', 'medic'], ['strategist', 'lonewolf'], ['lonewolf', 'strategist'], ['lucky', 'cheer']] }, // 아침 7시, 발생 알림
    { emoji: '🧳', c: [['medic', 'leader'], ['scavenger', 'leader'], ['engineer', 'scavenger'], ['cheer', 'scavenger']] }, // 5분 안에 가방 하나
    { emoji: '🏠', c: [['scavenger', 'cheer'], ['lonewolf', 'engineer'], ['leader', 'medic'], ['engineer', 'lonewolf']] }, // 은신처 고르기
    { emoji: '🚪', c: [['medic', 'lucky'], ['strategist', 'engineer'], ['cheer', 'leader'], ['lonewolf', 'lucky']] }, // 낯선 사람들의 노크
    { emoji: '🗳️', c: [['leader', 'strategist'], ['strategist', 'leader'], ['cheer', 'medic'], ['lucky', 'cheer']] }, // 의견이 갈림
    { emoji: '🐈', c: [['medic', 'cheer'], ['lucky', 'scavenger'], ['strategist', 'engineer'], ['engineer', 'cheer']] }, // 수상한 긁힌 자국
    { emoji: '🌙', c: [['engineer', 'lonewolf'], ['cheer', 'lucky'], ['scavenger', 'leader'], ['lucky', 'lonewolf']] }, // 밤 경계 근무
    { emoji: '🥫', c: [['scavenger', 'lucky'], ['leader', 'medic'], ['engineer', 'strategist'], ['lonewolf', 'scavenger']] }, // 식량 부족
    { emoji: '📡', c: [['strategist', 'engineer'], ['leader', 'medic'], ['medic', 'strategist'], ['cheer', 'lonewolf']] }, // 먼 안전 지대 무전
    { emoji: '🚧', c: [['strategist', 'scavenger'], ['lonewolf', 'lucky'], ['engineer', 'scavenger'], ['lucky', 'strategist']] }, // 길을 막은 좀비 무리
    { emoji: '🃏', c: [['medic', 'leader'], ['scavenger', 'engineer'], ['cheer', 'lucky'], ['lucky', 'cheer']] }, // 은신처의 한가한 오후
    { emoji: '✨', c: [['leader', 'medic'], ['medic', 'engineer'], ['scavenger', 'lonewolf'], ['lonewolf', 'strategist']] } // 생존 모토
  ];
  var N = ORDER.length;
  var MAIN = 2, SIDE = 1;

  // 점수 벡터(8칸)와 "늦은 문항 가중" 벡터. answers[i] = i번 문항에서 고른 보기 번호(없으면 null).
  function tally(answers) {
    var s = new Array(N).fill(0), w = new Array(N).fill(0);
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var ch = QUESTIONS[qi].c[ci];
      if (!ch) continue;
      var m = ORDER.indexOf(ch[0]), d = ORDER.indexOf(ch[1]);
      s[m] += MAIN; w[m] += MAIN * (qi + 1);
      s[d] += SIDE; w[d] += SIDE * (qi + 1);
    }
    return { s: s, w: w };
  }

  // 결과: 합이 가장 큰 유형. 동점 → 늦은 문항 가중합이 큰 쪽 → ORDER 앞쪽.
  function pickIndex(s, w) {
    var best = 0;
    for (var i = 1; i < N; i++) {
      if (s[i] > s[best] || (s[i] === s[best] && w[i] > w[best])) best = i;
    }
    return best;
  }
  function result(answers) {
    var t = tally(answers);
    var k = pickIndex(t.s, t.w);
    return { id: ORDER[k], scores: t.s };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'zombie';
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

  return {
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, MAIN: MAIN, SIDE: SIDE,
    tally: tally, pickIndex: pickIndex, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
