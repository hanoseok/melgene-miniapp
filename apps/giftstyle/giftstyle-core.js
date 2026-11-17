/* apps/giftstyle/giftstyle-core.js
 * 선물 스타일 테스트 — 언어와 무관한 로직: 결과 8종(id·축 값·이모지·색·단짝/정반대) + 12문항의 보기별 값 + 채점 + 선물 준비 게이지(0~100) + 서버 비율(poll) 인코딩.
 *
 * 전제(정직하게): 재미로 보는 테스트다. 선물을 고르고 건네는 흔한 장면(생일·마니또/시크릿 산타·막판 선물·포장·마음에 안 드는 선물·예산·손수 만든 선물 등)에서
 * 세 가지 습관을 가볍게 본다. 임상·심리 검사가 아니고 아무것도 진단하지 않는다(결과 페이지·FAQ·가이드에 밝힌다).
 *
 * 8종 = 세 가지 두 갈래 축의 조합(2×2×2 = 8칸, 겹치는 칸 없음):
 *   축 0 timing : 0 spark(그때그때 즉흥적으로)   · 1 plan(미리미리 계획)          — 선물 준비 시점
 *   축 1 focus  : 0 useful(쓸모·실용)           · 1 heart(의미·추억·경험)       — 선물에서 중요하게 보는 것
 *   축 2 style  : 0 surprise(깜짝 선물)         · 1 ask(물어보고·위시리스트)    — 고르는 방식
 * 결과 이름은 언어별(tools/i18n/<lang>.js types.<id>.name). 어느 유형도 나쁘지 않다 — 모두 다정한 "선물하는 사람" 캐릭터로 쓴다.
 * 문항 12개 = 축마다 4문항(qi % 3 = 축). 문항마다 보기 4개 = 축의 두 값 각각 "강한" 보기(2점) + "약한" 보기(1점) → 0↔1 을 바꿔도 대칭.
 * 축마다 점수가 큰 값. 동점이면 그 축에서 마지막으로 고른 값(대칭을 지키는 결정적 규칙).
 *   → 무작위 답에서 축마다 정확히 50%, 8종 각각 정확히 12.5% (node tools/check-giftstyle.js 가 전수 4^12 로 매번 계산).
 * 선물 준비 게이지(planPct): 그 사람의 timing 문항 4개 답에서 계산한 "미리 준비하는 쪽" 비율 — 강한 plan 3, 약한 plan 2, 약한 spark 1, 강한 spark 0 을 더해 12 로 나눔.
 *   서버 통계가 아니라 본인 답으로 만든 값이다(가짜 숫자 아님). 결과 주소 #g=<0~100>.
 *   구간: ≤33 즉흥 · 34~66 균형 · ≥67 미리미리 — timing 축 결과와 어긋나지 않는다(check 가 전수로 확인).
 * 단짝(best) = timing 축만 반대(즉흥파와 계획파가 서로 채워 줌), 정반대(rival) = 세 축 모두 반대. 결과 페이지에 이름·그림만(링크 없음).
 * 문구는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="giftstyle-core.js"> → window.GIFT_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.GIFT_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['quickfind', 'helper', 'moment', 'together', 'detective', 'wishlist', 'crafter', 'curator'];
  var AXES = ['timing', 'focus', 'style'];

  // v: [timing, focus, style], emoji: 배지·공유 문구, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕, best/rival: 결과의 일부(보여주기만)
  var TYPES = {
    quickfind: { v: [0, 0, 0], emoji: '⚡', main: '#e8902a', deep: '#7d4606', ink: '#fdf1e1', best: 'detective', rival: 'curator' },
    helper: { v: [0, 0, 1], emoji: '🧰', main: '#3c9e86', deep: '#145847', ink: '#e3f4ef', best: 'wishlist', rival: 'crafter' },
    moment: { v: [0, 1, 0], emoji: '🎆', main: '#d9506e', deep: '#821a37', ink: '#fce9ee', best: 'crafter', rival: 'wishlist' },
    together: { v: [0, 1, 1], emoji: '🍰', main: '#c77bb8', deep: '#6e2862', ink: '#f8ecf5', best: 'curator', rival: 'detective' },
    detective: { v: [1, 0, 0], emoji: '🔍', main: '#4f7fc4', deep: '#1b4479', ink: '#e8f0fa', best: 'quickfind', rival: 'together' },
    wishlist: { v: [1, 0, 1], emoji: '📝', main: '#7b6ad3', deep: '#3b2c8a', ink: '#efecfb', best: 'helper', rival: 'moment' },
    crafter: { v: [1, 1, 0], emoji: '🧶', main: '#c4583a', deep: '#74250f', ink: '#fbebe5', best: 'moment', rival: 'helper' },
    curator: { v: [1, 1, 1], emoji: '🎟️', main: '#2f9bb6', deep: '#0f5468', ink: '#e2f3f8', best: 'together', rival: 'quickfind' }
  };

  // 12문항. axis = qi % 3. c[j] = j번 보기의 값, w[j] = 점수(강한 보기 2 · 약한 보기 1). 값마다 강한 것 하나·약한 것 하나.
  // emoji 는 질문 카드 장식(결과 이모지와 겹치지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '🎂', c: [0, 1, 1, 0], w: [2, 1, 2, 1] }, // 친구 생일이 3주 남음
    { axis: 1, emoji: '👛', c: [1, 0, 0, 1], w: [2, 2, 1, 1] }, // 예산이 넉넉하지 않을 때
    { axis: 2, emoji: '🤫', c: [0, 1, 0, 1], w: [1, 2, 2, 1] }, // 마니또·시크릿 산타 이름을 뽑음
    { axis: 0, emoji: '📅', c: [1, 0, 0, 1], w: [1, 2, 1, 2] }, // 연말 선물 쇼핑은 언제부터
    { axis: 1, emoji: '✂️', c: [0, 1, 1, 0], w: [1, 2, 1, 2] }, // 손수 만든 선물 vs 산 선물
    { axis: 2, emoji: '🙅', c: [1, 1, 0, 0], w: [2, 1, 1, 2] }, // "아무것도 사 오지 마"
    { axis: 0, emoji: '🎀', c: [0, 0, 1, 1], w: [1, 2, 2, 1] }, // 포장은 언제
    { axis: 1, emoji: '💼', c: [0, 1, 0, 1], w: [2, 1, 1, 2] }, // 잘 모르는 동료에게 줄 선물
    { axis: 2, emoji: '😅', c: [1, 0, 1, 0], w: [1, 1, 2, 2] }, // 마음에 안 드는 선물을 받았을 때
    { axis: 0, emoji: '☀️', c: [1, 0, 1, 0], w: [2, 1, 1, 2] }, // 여름에 겨울 생일 선물을 발견
    { axis: 1, emoji: '💭', c: [1, 1, 0, 0], w: [1, 2, 2, 1] }, // 내가 받고 싶은 최고의 선물
    { axis: 2, emoji: '🎁', c: [0, 1, 1, 0], w: [2, 2, 1, 1] }  // 선물을 건네는 방법
  ];
  var N = ORDER.length;
  // 게이지 점수: [세기][값] → 미리 준비하는 쪽 점수(0~3)
  var EP = { 2: [0, 3], 1: [1, 2] };

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [축][값] 점수, last: [축별 마지막 값], n, E: 게이지 점수 합, En: timing 답 수 }
  function tally(answers) {
    var s = [[0, 0], [0, 0], [0, 0]], last = [null, null, null], n = 0, E = 0, En = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var q = QUESTIONS[qi];
      var v = q.c[ci];
      if (v == null) continue;
      s[q.axis][v] += q.w[ci];
      last[q.axis] = v;
      if (q.axis === 0) { E += EP[q.w[ci]][v]; En += 1; }
      n += 1;
    }
    return { s: s, last: last, n: n, E: E, En: En };
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

  function pctOf(r) {
    return r.En ? Math.round((r.E / (r.En * 3)) * 100) : 50;
  }

  // 선물 준비 게이지 = 미리 준비하는 쪽 비율(0~100 정수). timing 답이 없으면 50.
  function planPct(answers) { return pctOf(tally(answers)); }

  function result(answers) {
    var r = tally(answers);
    var v = [0, 1, 2].map(function (a) { return pick(r.s[a], r.last[a]); });
    return { id: typeOf(v), v: v, scores: r.s, n: r.n, plan: pctOf(r) };
  }
  function score(answers) { return result(answers).id; }

  // 공유 링크의 게이지 값: #g=<0~100>. 이상한 값이면 null.
  function parseScore(hash) {
    var m = /(?:^#|[#&])g=(\d{1,3})(?:&|$)/.exec(String(hash || ''));
    if (!m) return null;
    var n = Number(m[1]);
    return n >= 0 && n <= 100 ? n : null;
  }

  // 게이지 구간: 0 즉흥(≤33) · 1 균형(34~66) · 2 미리미리(≥67)
  function band(n) { return n >= 67 ? 2 : n <= 33 ? 0 : 1; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'giftstyle';
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
    ORDER: ORDER, AXES: AXES, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, EP: EP,
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score, planPct: planPct, parseScore: parseScore, band: band,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
