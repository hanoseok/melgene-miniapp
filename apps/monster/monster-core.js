/* apps/monster/monster-core.js
 * 할로윈 몬스터 테스트 — 언어와 무관한 로직: 결과 12종(id·이모지·색·단짝·라이벌) + 10문항의 채점 가중치 + 채점 함수.
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. questions[i].choices[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 가중치로 채점된다.
 * 브라우저(<script src="monster-core.js"> → window.MONSTER_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-monster.js (무작위 20만 회, 각 유형 3%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.MONSTER_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 동점 규칙의 마지막 단계에서 쓰는 고정 순서 (앞쪽이 우선)
  var ORDER = [
    'vampire', 'werewolf', 'witch', 'ghost', 'zombie', 'mummy',
    'frank', 'pumpkin', 'blackcat', 'reaper', 'fox', 'skeleton'
  ];

  // emoji: 공유 문구용(그림은 tools/art.js 의 SVG), color: 결과 카드 강조색, best/rival: 단짝·라이벌 (결과의 일부)
  var TYPES = {
    vampire: { emoji: '🧛', color: '#e0445c', best: 'fox', rival: 'werewolf' },
    werewolf: { emoji: '🐺', color: '#b07a4f', best: 'frank', rival: 'vampire' },
    witch: { emoji: '🧙', color: '#9b5cff', best: 'blackcat', rival: 'fox' },
    ghost: { emoji: '👻', color: '#9fd8ff', best: 'mummy', rival: 'pumpkin' },
    zombie: { emoji: '🧟', color: '#8fcf5a', best: 'frank', rival: 'reaper' },
    mummy: { emoji: '🩹', color: '#e8d3a2', best: 'ghost', rival: 'zombie' },
    frank: { emoji: '⚡', color: '#5fcf8f', best: 'werewolf', rival: 'witch' },
    pumpkin: { emoji: '🎃', color: '#ff8a1f', best: 'skeleton', rival: 'ghost' },
    blackcat: { emoji: '🐈‍⬛', color: '#ffd23f', best: 'witch', rival: 'werewolf' },
    reaper: { emoji: '⌛', color: '#8c8cff', best: 'ghost', rival: 'skeleton' },
    fox: { emoji: '🦊', color: '#ff7a3d', best: 'vampire', rival: 'witch' },
    skeleton: { emoji: '💀', color: '#f4f1e8', best: 'pumpkin', rival: 'reaper' }
  };

  // 10문항. 보기마다 { 유형: 점수 } — 대표 유형 3점 + 곁다리 유형 1점.
  // emoji 는 질문 카드 장식(언어 무관).
  var QUESTIONS = [
    { emoji: '💌', choices: [ // 오늘 밤 할로윈 파티 초대장
      { vampire: 3, fox: 1 },
      { werewolf: 3, zombie: 1 },
      { ghost: 3, blackcat: 1 },
      { pumpkin: 3, witch: 1 }
    ] },
    { emoji: '🎉', choices: [ // 파티 30분 뒤 어디에?
      { skeleton: 3, pumpkin: 1 },
      { zombie: 3, werewolf: 1 },
      { reaper: 3, ghost: 1 },
      { fox: 3, vampire: 1 }
    ] },
    { emoji: '😱', choices: [ // 어두운 복도에서 비명
      { pumpkin: 3, skeleton: 1 },
      { werewolf: 3, frank: 1 },
      { ghost: 3, mummy: 1 },
      { reaper: 3, fox: 1 }
    ] },
    { emoji: '🍫', choices: [ // 자정의 야식
      { vampire: 3, blackcat: 1 },
      { zombie: 3, werewolf: 1 },
      { witch: 3, mummy: 1 }
    ] },
    { emoji: '🧵', choices: [ // 의상 전략
      { frank: 3, witch: 1 },
      { ghost: 3, zombie: 1 },
      { mummy: 3, skeleton: 1 },
      { fox: 3, pumpkin: 1 }
    ] },
    { emoji: '🚪', choices: [ // 트릭 오어 트릿 초인종
      { pumpkin: 3, frank: 1 },
      { skeleton: 3, ghost: 1 },
      { blackcat: 3, mummy: 1 }
    ] },
    { emoji: '🗣️', choices: [ // 친구들이 말하는 나
      { frank: 3, werewolf: 1 },
      { reaper: 3, mummy: 1 },
      { blackcat: 3, fox: 1 },
      { witch: 3, vampire: 1 }
    ] },
    { emoji: '🕒', choices: [ // 새벽 3시 파티 막바지
      { vampire: 3, skeleton: 1 },
      { zombie: 3, blackcat: 1 },
      { mummy: 3, reaper: 1 },
      { frank: 3, werewolf: 1 }
    ] },
    { emoji: '🌕', choices: [ // 보름달이 떴다
      { werewolf: 3, skeleton: 1 },
      { ghost: 3, vampire: 1 },
      { mummy: 3, zombie: 1 },
      { fox: 3, witch: 1 }
    ] },
    { emoji: '🪄', choices: [ // 오늘 밤의 좌우명
      { skeleton: 3, pumpkin: 1 },
      { blackcat: 3, zombie: 1 },
      { reaper: 3, frank: 1 },
      { witch: 3, fox: 1 }
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

  // 같은 결과를 받은 사람 비율(서버 실제 값): poll_vote 는 보기 번호가 0~9 라서 12종을 두 질문 id 로 나눈다.
  var POLL = 'monster';
  function pollSlot(id) {
    var i = ORDER.indexOf(id);
    return { qid: i < 6 ? 'r0' : 'r1', opt: i % 6 };
  }
  // poll_results 행([{ qid, option, votes }]) → { total, counts: { 유형: 명 } } 또는 null
  function pollCounts(rows) {
    if (!Array.isArray(rows)) return null;
    var counts = {}, total = 0;
    rows.forEach(function (r) {
      var base = r.qid === 'r0' ? 0 : r.qid === 'r1' ? 6 : -1;
      var o = Number(r.option), v = Number(r.votes) || 0;
      if (base < 0 || !(o >= 0 && o < 6)) return;
      var id = ORDER[base + o];
      counts[id] = (counts[id] || 0) + v;
      total += v;
    });
    return { total: total, counts: counts };
  }

  return { ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, score: score, POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts };
});
