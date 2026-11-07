/* apps/brain/brain-core.js
 * 좌뇌 우뇌 테스트 — 언어와 무관한 로직: 결과 8종(id·축 값·이모지·색·단짝/라이벌) + 12문항의 보기별 값 + 채점 + 좌/우 비율 + 서버 비율(poll) 인코딩.
 *
 * 전제(정직하게): "좌뇌형·우뇌형" 우세는 대중적인 속설이다. 실제 뇌는 두 반구가 늘 함께 일한다(결과 페이지·FAQ·가이드에 밝힌다).
 * 이 테스트는 흔히 "좌뇌식/우뇌식"이라고 부르는 생각 습관 세 가지의 선호를 재미로 본다.
 *
 * 8종 = 세 가지 두 갈래 축의 조합(2×2×2 = 8칸, 겹치는 칸 없음). 각 축의 0 = 흔히 말하는 "좌뇌식", 1 = "우뇌식":
 *   축 0 think  : 0 logic(따져 보기)   · 1 intuition(느낌·직감)
 *   축 1 plan   : 0 plan(계획·순서)    · 1 flow(즉흥·흐름)
 *   축 2 express: 0 words(말·글)       · 1 images(그림·공간)
 * 문항 12개 = 축마다 4문항(qi % 3 = 축). 문항마다 보기 4개 = 축의 두 값 각각 "강한" 보기(2점) + "약한" 보기(1점) → 0↔1 을 바꿔도 대칭.
 * 축마다 점수가 큰 값. 동점이면 그 축에서 마지막으로 고른 값(대칭을 지키는 결정적 규칙).
 *   → 무작위 답에서 축마다 정확히 50%, 8종 각각 정확히 12.5% (node tools/check-brain.js 가 전수 4^12 로 매번 계산).
 * 좌/우 막대(leftPct): 그 사람의 12개 답에서 계산한 "좌뇌식 습관" 비율 — 강한 좌 3:0, 약한 좌 2:1, 약한 우 1:2, 강한 우 0:3 을 모두 더한 L/(L+R).
 *   서버 통계가 아니라 본인 답으로 만든 값이다(가짜 숫자 아님).
 * 단짝(best) = think 축만 반대(좌우가 서로 채워 줌), 라이벌(rival) = 세 축 모두 반대. 결과 페이지에 이름·그림만(링크 없음).
 * 문구는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="brain-core.js"> → window.BRAIN_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.BRAIN_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['architect', 'mapmaker', 'debater', 'hacker', 'weaver', 'designer', 'firework', 'dreamer'];
  var AXES = ['think', 'plan', 'express'];

  // v: [think, plan, express], emoji: 배지·공유 문구, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕, best/rival: 결과의 일부(보여주기만)
  var TYPES = {
    architect: { v: [0, 0, 0], emoji: '📐', main: '#e0663a', deep: '#8a3214', ink: '#fff0e8', best: 'weaver', rival: 'dreamer' },
    mapmaker: { v: [0, 0, 1], emoji: '🗺️', main: '#c98a12', deep: '#6e4a05', ink: '#fff6df', best: 'designer', rival: 'firework' },
    debater: { v: [0, 1, 0], emoji: '🎤', main: '#d6435f', deep: '#8a1c33', ink: '#fdebef', best: 'firework', rival: 'designer' },
    hacker: { v: [0, 1, 1], emoji: '🧩', main: '#8f5bd6', deep: '#4e2a86', ink: '#f2ebfc', best: 'dreamer', rival: 'weaver' },
    weaver: { v: [1, 0, 0], emoji: '📖', main: '#2f8f83', deep: '#145a52', ink: '#e4f5f2', best: 'architect', rival: 'hacker' },
    designer: { v: [1, 0, 1], emoji: '🎨', main: '#3a78d4', deep: '#1c4486', ink: '#e8f0fc', best: 'mapmaker', rival: 'debater' },
    firework: { v: [1, 1, 0], emoji: '🎆', main: '#5a54d6', deep: '#2c2788', ink: '#ecebfc', best: 'debater', rival: 'mapmaker' },
    dreamer: { v: [1, 1, 1], emoji: '🌈', main: '#1fa3b8', deep: '#0b6070', ink: '#e1f6f9', best: 'hacker', rival: 'architect' }
  };

  // 12문항. axis = qi % 3. c[j] = j번 보기의 값(0 좌뇌식 / 1 우뇌식), w[j] = 점수(강한 보기 2 · 약한 보기 1). 값마다 강한 것 하나·약한 것 하나.
  // emoji 는 질문 카드 장식(결과 이모지와 겹치지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '📱', c: [0, 1, 1, 0], w: [2, 1, 2, 1] }, // 새 휴대폰 고르기
    { axis: 1, emoji: '🗓️', c: [1, 0, 0, 1], w: [2, 2, 1, 1] }, // 빈 토요일
    { axis: 2, emoji: '☕', c: [0, 1, 0, 1], w: [1, 2, 2, 1] }, // 카페 길 알려 주기
    { axis: 0, emoji: '💼', c: [1, 0, 0, 1], w: [1, 2, 1, 2] }, // 친구의 이직 고민
    { axis: 1, emoji: '🧳', c: [0, 1, 1, 0], w: [1, 2, 1, 2] }, // 주말 여행 짐 싸기
    { axis: 2, emoji: '💡', c: [1, 1, 0, 0], w: [2, 1, 1, 2] }, // 기억하는 방법
    { axis: 0, emoji: '🎲', c: [0, 0, 1, 1], w: [1, 2, 2, 1] }, // 새 보드게임 규칙서
    { axis: 1, emoji: '✅', c: [0, 1, 0, 1], w: [2, 1, 1, 2] }, // 할 일 목록
    { axis: 2, emoji: '📊', c: [1, 0, 1, 0], w: [1, 1, 2, 2] }, // 새 아이디어 설명
    { axis: 0, emoji: '🤔', c: [1, 0, 1, 0], w: [2, 1, 1, 2] }, // 처음 만난 사람의 묘한 느낌
    { axis: 1, emoji: '🏙️', c: [1, 1, 0, 0], w: [1, 2, 2, 1] }, // 낯선 도시에서 하루
    { axis: 2, emoji: '🌙', c: [0, 1, 1, 0], w: [2, 2, 1, 1] }  // 쉬는 시간에 즐기는 것
  ];
  var N = ORDER.length;
  // 좌/우 막대: [강도][값] → [좌, 우] 점수
  var LR = { 2: [[3, 0], [0, 3]], 1: [[2, 1], [1, 2]] };

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [축][값] 점수, last: [축별 마지막 값], n, L, R }
  function tally(answers) {
    var s = [[0, 0], [0, 0], [0, 0]], last = [null, null, null], n = 0, L = 0, R = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var q = QUESTIONS[qi];
      var v = q.c[ci];
      if (v == null) continue;
      s[q.axis][v] += q.w[ci];
      last[q.axis] = v;
      L += LR[q.w[ci]][v][0];
      R += LR[q.w[ci]][v][1];
      n += 1;
    }
    return { s: s, last: last, n: n, L: L, R: R };
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

  // 좌뇌식 습관 비율(0~100 정수). 답이 없으면 50.
  function leftPct(answers) {
    var r = tally(answers);
    if (!(r.L + r.R)) return 50;
    return Math.round((r.L / (r.L + r.R)) * 100);
  }

  function result(answers) {
    var r = tally(answers);
    var v = [0, 1, 2].map(function (a) { return pick(r.s[a], r.last[a]); });
    var left = r.L + r.R ? Math.round((r.L / (r.L + r.R)) * 100) : 50;
    return { id: typeOf(v), v: v, scores: r.s, n: r.n, left: left };
  }
  function score(answers) { return result(answers).id; }

  // 공유 링크의 좌/우 값: #l=<0~100>. 이상한 값이면 null.
  function parseLeft(hash) {
    var m = /(?:^#|[#&])l=(\d{1,3})(?:&|$)/.exec(String(hash || ''));
    if (!m) return null;
    var n = Number(m[1]);
    return n >= 0 && n <= 100 ? n : null;
  }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'brain';
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
    ORDER: ORDER, AXES: AXES, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, LR: LR,
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score, leftPct: leftPct, parseLeft: parseLeft,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
