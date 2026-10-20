/* apps/homebody/homebody-core.js
 * 집순이·집돌이 지수 테스트 — 언어와 무관한 로직: 결과 6단계(id·이모지·색·찰떡/상극) + 10문항의 보기 점수 + 채점 함수 + 서버 백분위 인코딩.
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].choices[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 점수로 채점된다.
 * 브라우저(<script src="homebody-core.js"> → window.HOMEBODY_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-homebody.js (전수 4^10 = 1,048,576가지 + 무작위 20만 회, 각 단계 10%~24%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.HOMEBODY_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 집순이·집돌이 지수가 낮은 순서 → 높은 순서. 서버 백분위(poll)는 id 가 아니라 지수 구간(0~9)이라서 이 순서는 poll 과 무관하지만 바꾸지 않는다.
  var ORDER = ['wild', 'roamer', 'switch', 'nester', 'homebody', 'legend'];

  // 단계 경계: 지수(0~100)가 CUTS[i] 이상이면 ORDER[i+1] 이상. (균등 무작위 응답 기준 6등분에 가깝게 잡았다)
  var CUTS = [31, 42, 51, 60, 70];

  // emoji: 공유 문구용, core/mid/edge: 결과 페이지 색, ink: 이름 글자색(어두운 배경 위),
  // best/clash: 찰떡·상극 유형 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    wild: { emoji: '🏕️', core: '#f2fff4', mid: '#5fdc8c', edge: '#138a5a', ink: '#8aeaa9', best: 'switch', clash: 'legend' },
    roamer: { emoji: '🎒', core: '#eefaff', mid: '#4fc3ff', edge: '#1a6fd6', ink: '#86d2ff', best: 'nester', clash: 'legend' },
    switch: { emoji: '⚖️', core: '#fffdf0', mid: '#ffd84d', edge: '#d99a00', ink: '#ffe27a', best: 'nester', clash: 'wild' },
    nester: { emoji: '🛋️', core: '#fff6e6', mid: '#ffa24d', edge: '#d9581b', ink: '#ffb878', best: 'switch', clash: 'wild' },
    homebody: { emoji: '🏠', core: '#fff0ea', mid: '#ff7f66', edge: '#c93c3c', ink: '#ff9d89', best: 'nester', clash: 'wild' },
    legend: { emoji: '🛌', core: '#fbf0ff', mid: '#c46bff', edge: '#7a1fc7', ink: '#d9a0ff', best: 'homebody', clash: 'roamer' }
  };

  // 10문항 × 보기 4개. 보기마다 점수(0·3·7·10) — 높을수록 집을 좋아하는 쪽. 보기 순서는 문항마다 섞어 둔다.
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '🌆', choices: [10, 3, 7, 0] }, // 금요일 저녁, 단톡방 "한잔?"
    { emoji: '🗓️', choices: [0, 10, 3, 7] }, // 연휴 주말
    { emoji: '🔔', choices: [3, 7, 0, 10] }, // 약속 없는데 초인종
    { emoji: '🏘️', choices: [7, 0, 10, 3] }, // 이상적인 동네
    { emoji: '🌧️', choices: [10, 0, 7, 3] }, // 비 오는 일요일
    { emoji: '🎟️', choices: [3, 10, 0, 7] }, // 2주 뒤 모임 초대
    { emoji: '🚪', choices: [0, 3, 10, 7] }, // 하루 종일 밖에서 돌아온 뒤
    { emoji: '🍽️', choices: [7, 3, 0, 10] }, // 저녁 식사
    { emoji: '⏳', choices: [0, 10, 3, 7] }, // 집에서 며칠 연속
    { emoji: '💸', choices: [3, 0, 10, 7] }  // 쓰고 싶은 돈
  ];

  var MIN_SUM = 20, MAX_SUM = 80; // 균등 무작위 응답은 대부분 이 안에 들어온다 → 0~100 으로 펴서 지수로 쓴다

  // 지수(0~100). answers[i] = i번 문항에서 고른 보기 번호(없으면 null). 안 푼 문항은 중간(5점)으로 계산한다.
  function score(answers) {
    var sum = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi], p = ci == null ? 5 : QUESTIONS[qi].choices[ci];
      sum += p == null ? 5 : p;
    }
    var pct = Math.round(((sum - MIN_SUM) / (MAX_SUM - MIN_SUM)) * 100);
    return Math.max(0, Math.min(100, pct));
  }

  // 지수 → 단계 id
  function tierOf(pct) {
    var i = 0;
    while (i < CUTS.length && pct >= CUTS[i]) i++;
    return ORDER[i];
  }
  // 단계의 지수 범위 [lo, hi] (결과 페이지에 처음부터 보여 주는 값)
  function range(id) {
    var i = ORDER.indexOf(id);
    return [i === 0 ? 0 : CUTS[i - 1], i === CUTS.length ? 100 : CUTS[i] - 1];
  }

  // 백분위(서버 실제 값): poll_vote 는 보기 번호가 0~9 라서 지수를 10점 구간(0~9, 100 은 9)으로 나눠 질문 id 'r0' 하나에 담는다.
  var POLL = 'homebody';
  function bucket(pct) { return Math.max(0, Math.min(9, Math.floor(pct / 10))); }
  function pollSlot(pct) { return { qid: 'r0', opt: bucket(pct) }; }
  // poll_results 행([{ qid, option, votes }]) → { total, counts: [구간 0~9 명수] } 또는 null
  function pollCounts(rows) {
    if (!Array.isArray(rows)) return null;
    var counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], total = 0;
    rows.forEach(function (r) {
      var o = Number(r.option), v = Number(r.votes) || 0;
      if (r.qid !== 'r0' || !(o >= 0 && o < 10)) return;
      counts[o] += v;
      total += v;
    });
    return { total: total, counts: counts };
  }
  // "나보다 집순이·집돌이인 사람" 비율(0~100): 내 구간보다 높은 구간 + 같은 구간의 절반
  function moreHomebodyShare(counts, total, pct) {
    if (!total) return null;
    var b = bucket(pct), above = 0;
    for (var i = b + 1; i < 10; i++) above += counts[i];
    return ((above + counts[b] / 2) / total) * 100;
  }

  return {
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, CUTS: CUTS,
    score: score, tierOf: tierOf, range: range,
    POLL: POLL, bucket: bucket, pollSlot: pollSlot, pollCounts: pollCounts, moreHomebodyShare: moreHomebodyShare
  };
});
