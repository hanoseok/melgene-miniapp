/* apps/xmastype/xmastype-core.js
 * 크리스마스 성격 테스트 — 언어와 무관한 로직: 결과 8종(id·축 값·이모지·색·찰떡궁합/라이벌) + 12문항의 보기별 값 + 채점 + 서버 비율(poll) 인코딩.
 *
 * 8종 = 세 가지 두 갈래 축의 조합(2×2×2 = 8칸, 겹치는 칸 없음):
 *   축 0 energy: 0 sparkle(사람들 속에서 반짝) · 1 cozy(조용하고 포근하게)
 *   축 1 style : 0 classic(전통·계획·의식)     · 1 playful(즉흥·새로움·장난)
 *   축 2 focus : 0 heart(함께·챙김)            · 1 spark(나만의 모험·만들기·탐험)
 * 문항 12개 = 축마다 4문항(qi % 3 = 축). 두 축은 서로 다른 문항에서만 점수를 받으므로 무작위로 답하면 세 축이 독립.
 * 문항마다 보기 4개 = 축의 두 값 각각 "강한" 보기(2점) 하나 + "약한" 보기(1점) 하나 → 두 값을 바꿔도(0↔1) 점수 분포가 똑같다(대칭).
 * 축마다 점수가 큰 값. 동점이면 그 축에서 마지막으로 고른 값(대칭을 지키는 결정적 규칙).
 *   → 무작위 답에서 축마다 정확히 50%, 8종 각각 정확히 12.5% (node tools/check-xmastype.js 가 전수 4^12 로 매번 계산).
 * 찰떡궁합(best) = energy 만 반대(같은 취향, 반대 에너지), 티격태격 라이벌(rival) = 세 축 모두 반대. 결과 페이지에 이름·그림만(링크 없음).
 * 재미용이다 — 심리 검사나 진단이 아니다(결과 페이지·FAQ·가이드에 밝힌다).
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="xmastype-core.js"> → window.XMASTYPE_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.XMASTYPE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['star', 'reindeer', 'bell', 'candy', 'candle', 'cookie', 'snowman', 'snowflake'];
  var AXES = ['energy', 'style', 'focus'];

  // v: [energy, style, focus], emoji: 공유 문구, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕, best/rival: 결과의 일부(보여주기만)
  var TYPES = {
    star: { v: [0, 0, 0], emoji: '⭐', main: '#e9a800', deep: '#7a5300', ink: '#fff6d8', best: 'candle', rival: 'snowflake' },
    reindeer: { v: [0, 0, 1], emoji: '🦌', main: '#8b5a3c', deep: '#5a3320', ink: '#f6ece4', best: 'cookie', rival: 'snowman' },
    bell: { v: [0, 1, 0], emoji: '🔔', main: '#2e9e5b', deep: '#17603a', ink: '#e6f6ec', best: 'snowman', rival: 'cookie' },
    candy: { v: [0, 1, 1], emoji: '🍬', main: '#e23b4e', deep: '#9c1626', ink: '#fdeaec', best: 'snowflake', rival: 'candle' },
    candle: { v: [1, 0, 0], emoji: '🕯️', main: '#d9662b', deep: '#8f3a0e', ink: '#fdefe5', best: 'star', rival: 'candy' },
    cookie: { v: [1, 0, 1], emoji: '🍪', main: '#c0507a', deep: '#7e2147', ink: '#fbe9f0', best: 'reindeer', rival: 'bell' },
    snowman: { v: [1, 1, 0], emoji: '⛄', main: '#4b6cb7', deep: '#26407c', ink: '#e9eefa', best: 'bell', rival: 'reindeer' },
    snowflake: { v: [1, 1, 1], emoji: '❄️', main: '#2aa9c2', deep: '#0f6577', ink: '#e3f6f9', best: 'candy', rival: 'star' }
  };

  // 12문항. axis = qi % 3. c[j] = j번 보기의 값(0/1), w[j] = 점수(강한 보기 2 · 약한 보기 1). 값마다 강한 것 하나·약한 것 하나.
  // emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '🎉', c: [0, 1, 1, 0], w: [2, 1, 2, 1] }, // 금요일 연말 파티 초대
    { axis: 1, emoji: '🎄', c: [1, 0, 0, 1], w: [2, 2, 1, 1] }, // 장식은 언제
    { axis: 2, emoji: '🎁', c: [0, 1, 0, 1], w: [1, 2, 2, 1] }, // 선물 고르는 법
    { axis: 0, emoji: '🌨️', c: [1, 0, 0, 1], w: [1, 2, 1, 2] }, // 첫눈
    { axis: 1, emoji: '🍽️', c: [0, 1, 1, 0], w: [1, 2, 1, 2] }, // 연말 저녁 메뉴
    { axis: 2, emoji: '🧣', c: [1, 1, 0, 0], w: [2, 1, 1, 2] }, // 12월의 빈 오후
    { axis: 0, emoji: '🎶', c: [0, 0, 1, 1], w: [1, 2, 2, 1] }, // 카페에서 캐럴
    { axis: 1, emoji: '📅', c: [0, 1, 0, 1], w: [2, 1, 1, 2] }, // 12월 달력
    { axis: 2, emoji: '💌', c: [1, 0, 1, 0], w: [1, 1, 2, 2] }, // 연말에 가장 좋은 것
    { axis: 0, emoji: '🧦', c: [1, 0, 1, 0], w: [2, 1, 1, 2] }, // 어글리 스웨터 데이
    { axis: 1, emoji: '🎲', c: [1, 1, 0, 0], w: [1, 2, 2, 1] }, // 연말 게임 밤
    { axis: 2, emoji: '🌅', c: [0, 1, 1, 0], w: [2, 2, 1, 1] }  // 새해 소원
  ];
  var N = ORDER.length;

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [축][값] 점수, last: [축별 마지막 값], n }
  function tally(answers) {
    var s = [[0, 0], [0, 0], [0, 0]], last = [null, null, null], n = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var q = QUESTIONS[qi];
      var v = q.c[ci];
      if (v == null) continue;
      s[q.axis][v] += q.w[ci];
      last[q.axis] = v;
      n += 1;
    }
    return { s: s, last: last, n: n };
  }

  // 한 축: 점수가 큰 값, 동점이면 마지막으로 고른 값(답이 없으면 0)
  function pick(sc, last) {
    if (sc[0] !== sc[1]) return sc[0] > sc[1] ? 0 : 1;
    return last == null ? 0 : last;
  }

  function typeOf(v) {
    for (var i = 0; i < ORDER.length; i++) {
      var t = TYPES[ORDER[i]].v;
      if (t[0] === v[0] && t[1] === v[1] && t[2] === v[2]) return ORDER[i];
    }
    return ORDER[0];
  }

  function result(answers) {
    var r = tally(answers);
    var v = [0, 1, 2].map(function (a) { return pick(r.s[a], r.last[a]); });
    return { id: typeOf(v), v: v, scores: r.s, n: r.n };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'xmastype';
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
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
