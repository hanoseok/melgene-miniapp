/* apps/spend/spend-core.js
 * 소비 성향 테스트 — 언어와 무관한 로직: 결과 8종(id·이모지·색) + 12문항의 보기별 소비 습관(축) + 채점 + 서버 비율(poll) 인코딩.
 * 축 4개: 0 = 짠테크(S, 모으기) · 1 = 가성비(V, 비교·딜 찾기) · 2 = 플렉스(F, 나에게 선물) · 3 = 충동(I, 그 순간 지르기).
 * 한 문항의 보기 4개는 네 축을 하나씩 갖고, 위치는 문항마다 라틴 방진으로 섞여 있다(축마다 각 위치에 정확히 3번).
 * 채점(순서와 무관, 축별 선택 횟수 c = [S, V, F, I], 합 12):
 *   - 정렬: 많이 고른 순, 같으면 가성비 → 플렉스 → 짠테크 → 충동 순(고정 규칙). 1위 X, 2위 Y.
 *   - 제곱합 ≤ 40 이고 (S+V) − (F+I) = 0 → 균형 가계부형(고르게 섞임, 아끼는 쪽과 쓰는 쪽이 같음)
 *   - 1위가 2위보다 3개 이상 많으면 → 1위 축의 단일 유형(짠테크 요정 / 가성비 탐정 / 플렉스 주인공 / 지름신 강림형)
 *   - 아니면(1·2위가 비슷) → 짠테크+플렉스 = 짠플 반전형, 가성비+충동 = 세일 헌터, 가성비+플렉스 = 가심비 장인, 나머지 조합은 1위 축의 단일 유형
 *   같은 답이면 언제나 같은 결과. 내 답의 축별 비율(%)은 사용자 자신의 답으로 계산한 진짜 숫자.
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].v[j] = j번 보기의 축 — 각 언어 파일 questions[i].choices[j] 와 1:1(언어 파일은 이 순서로 만들어 둠, check-spend.js 가 축 순서로 다시 확인).
 * 브라우저(<script src="spend-core.js"> → window.SPEND_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-spend.js (전수 4^12 = 16,777,216가지 + 무작위, 각 결과 10%~17%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.SPEND_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['saver', 'value', 'flex', 'impulse', 'saverflex', 'dealhunter', 'quality', 'balance'];
  var AXES = ['saver', 'value', 'flex', 'impulse'];
  var SINGLE = ['saver', 'value', 'flex', 'impulse']; // 축 → 단일 유형
  var TIE = [1, 2, 0, 3]; // 같은 횟수일 때 앞서는 축 순서 (가성비 → 플렉스 → 짠테크 → 충동)
  var BAL_SQ = 40;        // 제곱합이 이 이하이고 아끼는 쪽 = 쓰는 쪽이면 균형
  var LEAD = 3;           // 1위가 2위보다 이만큼 많으면 단일 유형

  // emoji: 결과 그림 가운데, color: 강조색, deep: 짙은 테두리·글자색, ink: 아주 옅은 카드 바탕색
  var TYPES = {
    saver: { emoji: '🐷', color: '#2bb38a', deep: '#167357', ink: '#eaf8f2' },
    value: { emoji: '🔍', color: '#3b82f6', deep: '#1d4ed8', ink: '#eaf2ff' },
    flex: { emoji: '💎', color: '#8a5cf6', deep: '#5631b8', ink: '#f3eeff' },
    impulse: { emoji: '🛒', color: '#ff5a6e', deep: '#b8243a', ink: '#fff0f2' },
    saverflex: { emoji: '🎁', color: '#f59e0b', deep: '#975a00', ink: '#fff7e6' },
    dealhunter: { emoji: '🏷️', color: '#f97316', deep: '#a8470a', ink: '#fff2e8' },
    quality: { emoji: '🧥', color: '#0ea5b7', deep: '#0b6b78', ink: '#e8f8fb' },
    balance: { emoji: '⚖️', color: '#c9a227', deep: '#7f6510', ink: '#fbf6e2' }
  };

  // 라틴 방진 4행 (각 열에 네 축이 하나씩): 보기 j 의 축 = row[j]
  var L1 = [2, 0, 3, 1], L2 = [1, 3, 0, 2], L3 = [0, 2, 1, 3], L4 = [3, 1, 2, 0];
  // 12문항. emoji 는 상황 카드 장식(결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '💰', v: L1 }, // 월급날
    { emoji: '🍽️', v: L3 }, // 비싼 맛집 초대
    { emoji: '🎧', v: L2 }, // 이어폰 고장
    { emoji: '🏷️', v: L4 }, // 대규모 세일
    { emoji: '📺', v: L3 }, // 무료 체험 → 유료
    { emoji: '☕', v: L1 }, // 커피 타임
    { emoji: '🧾', v: L4 }, // 모임 계산서
    { emoji: '🛍️', v: L2 }, // 계산대 추가 상품
    { emoji: '✈️', v: L2 }, // 휴가 계획
    { emoji: '📱', v: L4 }, // 월말 은행 앱
    { emoji: '🎨', v: L1 }, // 새 취미
    { emoji: '💬', v: L3 }  // 나를 닮은 한마디
  ];
  var N = ORDER.length;

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { c: [S, V, F, I], n: 답한 문항 수 }
  function tally(answers) {
    var c = [0, 0, 0, 0], n = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var a = QUESTIONS[qi].v[ci];
      if (a == null) continue;
      c[a] += 1; n += 1;
    }
    return { c: c, n: n };
  }

  // 축별 횟수 → 결과 id (순서와 무관)
  function classify(c) {
    var order = [0, 1, 2, 3].sort(function (a, b) { return c[b] - c[a] || TIE.indexOf(a) - TIE.indexOf(b); });
    var X = order[0], Y = order[1];
    var sq = c[0] * c[0] + c[1] * c[1] + c[2] * c[2] + c[3] * c[3];
    if (sq <= BAL_SQ && c[0] + c[1] === c[2] + c[3]) return 'balance';
    if (c[X] - c[Y] >= LEAD) return SINGLE[X];
    var key = Math.min(X, Y) * 10 + Math.max(X, Y);
    if (key === 2) return 'saverflex';   // 0 + 2
    if (key === 13) return 'dealhunter'; // 1 + 3
    if (key === 12) return 'quality';    // 1 + 2
    return SINGLE[X];
  }

  // 축별 % (정수, 합이 정확히 100 — 가장 큰 나머지 순으로 올림). 답이 없으면 모두 0.
  function percents(c, n) {
    if (!n) return [0, 0, 0, 0];
    var raw = c.map(function (x) { return (x * 100) / n; });
    var out = raw.map(Math.floor);
    var left = 100 - out.reduce(function (a, b) { return a + b; }, 0);
    var idx = [0, 1, 2, 3].sort(function (a, b) { return (raw[b] - out[b]) - (raw[a] - out[a]) || a - b; });
    for (var i = 0; i < left; i++) out[idx[i]] += 1;
    return out;
  }

  function result(answers) {
    var s = tally(answers);
    return { id: classify(s.c), pct: percents(s.c, s.n), c: s.c, n: s.n };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'spend';
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
    ORDER: ORDER, AXES: AXES, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N,
    tally: tally, classify: classify, percents: percents, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
