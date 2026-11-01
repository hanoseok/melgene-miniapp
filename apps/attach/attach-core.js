/* apps/attach/attach-core.js
 * 애착 유형 테스트 — 언어와 무관한 로직: 결과 4종(id·이모지·색·잘 맞는 유형) + 11문항의 보기별 점수 + 채점 + 서버 비율(poll) 인코딩.
 * 두 축(성인 애착의 2차원 모형 — Brennan·Clark·Shaver 1998, Bartholomew 1991):
 *   a = 불안  (+ 관계가 흔들릴까 걱정함 / − 마음이 편안함)
 *   b = 회피  (+ 거리·혼자만의 공간이 편함 / − 가까워지는 것이 편함)
 * 보기마다 [a, b] (모두 +1 또는 −1). 문항마다 보기 4개 = 네 부호 조합 {−−, +−, −+, ++} 하나씩(순서는 문항마다 다름)
 *   → 축마다 +/− 반반, 두 축이 서로 독립 → 무작위로 답하면 네 결과가 정확히 1/4 씩.
 * 문항이 11개(홀수)이고 모든 점수가 ±1 이라 다 답하면 두 축 합이 절대 0 이 되지 않는다 → 동점 규칙이 필요 없다.
 * 결과 = 두 축 부호 조합 2×2 = 4종: −− secure · +− anxious · −+ avoidant(dismissive) · ++ fearful(fearful-avoidant).
 * 재미·자기 성찰용이다 — 임상 진단이 아니다(결과 페이지·FAQ·가이드에 밝힌다).
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].w[j] = j번 보기의 점수 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="attach-core.js"> → window.ATTACH_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-attach.js (전수 4^11 = 4,194,304가지 + 무작위, 각 결과 20%~30%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.ATTACH_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['secure', 'anxious', 'avoidant', 'fearful'];

  // sign: 두 축 부호 [불안, 회피], emoji: 공유 문구·그림, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕,
  // match: 잘 맞는 유형(보여주기만, 링크 없음). 연구에서 안정형 짝이 모든 유형의 관계를 편안하게 해 준다는 결과가 많아 모두 secure.
  var TYPES = {
    secure:   { sign: [-1, -1], emoji: '🌳', main: '#3fae7a', deep: '#1d7349', ink: '#e8f7ef', match: 'secure' },
    anxious:  { sign: [1, -1],  emoji: '💌', main: '#ef6f9c', deep: '#b03a66', ink: '#fdeef4', match: 'secure' },
    avoidant: { sign: [-1, 1],  emoji: '🐈', main: '#4a8fe0', deep: '#235ea6', ink: '#eaf2fd', match: 'secure' },
    fearful:  { sign: [1, 1],   emoji: '🦔', main: '#9b7bd6', deep: '#5f40a0', ink: '#f3eefc', match: 'secure' }
  };

  // 11문항. w[j] = j번 보기의 [불안, 회피]. emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var P = 1, M = -1;
  var S = [M, M], AX = [P, M], AV = [M, P], F = [P, P];
  var QUESTIONS = [
    { emoji: '📱', w: [S, AX, AV, F] },   // 친구가 하루 종일 답장이 없을 때
    { emoji: '🌷', w: [AX, S, F, AV] },   // 막 가까워진 사람이 "너랑 있으면 좋아"라고 할 때
    { emoji: '🌧️', w: [AV, F, S, AX] },   // 힘든 한 주를 보낼 때
    { emoji: '📅', w: [F, AV, AX, S] },   // 약속이 갑자기 취소됐을 때
    { emoji: '📖', w: [S, F, AX, AV] },   // 새 친구에게 내 이야기를 꺼낼 때
    { emoji: '⚡', w: [AX, AV, S, F] },   // 가까운 사람과 의견이 부딪혔을 때
    { emoji: '✈️', w: [AV, S, F, AX] },   // 일주일 떨어져 있을 때 연락
    { emoji: '🎁', w: [F, AX, AV, S] },   // 뜻밖의 친절을 받았을 때
    { emoji: '💭', w: [S, AV, AX, F] },   // 가까운 사람들을 떠올리면
    { emoji: '👋', w: [AV, AX, F, S] },   // 무리에 새 사람이 들어와 다들 좋아할 때
    { emoji: '🫶', w: [F, S, AV, AX] }    // 누군가 "요즘 무슨 일 있어?"라고 물을 때
  ];
  var N = ORDER.length;
  var AXES = 2;
  var MAX = QUESTIONS.length; // 축마다 최대 절댓값(모든 점수 ±1)

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [A, B], n }
  function tally(answers) {
    var s = [0, 0], n = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var w = QUESTIONS[qi].w[ci];
      if (!w) continue;
      s[0] += w[0]; s[1] += w[1]; n += 1;
    }
    return { s: s, n: n };
  }

  // [A, B] → 결과 id. 다 답하면 0 이 없다. 답이 모자라 0 이면 − 쪽(편안한 쪽, 정해진 규칙, 결정적).
  function classify(s) {
    var sg = s.map(function (x) { return x > 0 ? 1 : -1; });
    for (var i = 0; i < ORDER.length; i++) {
      var t = TYPES[ORDER[i]].sign;
      if (t[0] === sg[0] && t[1] === sg[1]) return ORDER[i];
    }
    return ORDER[0];
  }

  // 축별 위치(0~100, 50 = 가운데). 0 쪽 = 편안함/다가감, 100 쪽 = 걱정/거리 (게이지 왼쪽이 − 쪽)
  function leanings(s) {
    return s.map(function (x) {
      var p = 50 + (x / MAX) * 50;
      return Math.max(0, Math.min(100, Math.round(p)));
    });
  }

  function result(answers) {
    var r = tally(answers);
    return { id: classify(r.s), s: r.s, n: r.n, lean: leanings(r.s) };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~3 → 4종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'attach';
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
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, AXES: AXES, MAX: MAX,
    tally: tally, classify: classify, leanings: leanings, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
