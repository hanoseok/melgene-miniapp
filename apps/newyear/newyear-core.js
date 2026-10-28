/* apps/newyear/newyear-core.js
 * 새해 운세 테스트 — 언어와 무관한 로직: 대상 연도(YEAR, 해마다 이 한 줄만 바꾼다) + 결과 8종(id·이모지·색·행운의 색/달/물건·단짝/라이벌)
 * + 11문항의 보기별 점수 + 채점 + 서버 비율(poll) 인코딩.
 * 축 3개(보기마다 [a, b, c], 모두 +1 또는 −1):
 *   a = 도전   (+ 새로운 것에 뛰어든다 / − 익숙한 리듬을 지킨다)
 *   b = 함께   (+ 사람들과 함께 / − 나만의 시간)
 *   c = 계획   (+ 미리 계획한다 / − 흐름에 맡긴다)
 * 문항이 11개(홀수)이고 모든 점수가 ±1 이라 다 답하면 세 축 합이 절대 0 이 되지 않는다 → 동점 규칙이 필요 없다.
 * 문항마다 보기 4개는 부호 묶음 {+++, +−−, −+−, −−+}(짝) 또는 {−−−, −++, +−+, ++−}(홀) — 축마다 +/− 가 반반이고 두 축끼리도 고르게 섞인다.
 * 결과 = 세 축 부호의 조합 2×2×2 = 8종 (같은 답이면 언제나 같은 결과).
 * 행운의 색·달·물건은 결과의 재미 설정값이다 — 예측·통계가 아니다(재미용).
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].w[j] = j번 보기의 점수 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="newyear-core.js"> → window.NEWYEAR_CORE)와 Node(tools/*.js·app.config.js·언어 파일에서 require) 공용(UMD).
 * 분포 검증: node tools/check-newyear.js (전수 4^11 = 4,194,304가지 + 무작위, 각 결과 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.NEWYEAR_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 대상 연도 — 해가 바뀌면 이 숫자만 바꾸고 node tools/gen-all.js (+ --og). 언어 파일·가이드·app.config 가 모두 이 값을 쓴다.
  // (가이드 ko/ja/zh/vi 의 띠 이야기 한 문장은 해마다 손으로 고친다 — README 참고)
  var YEAR = 2027;

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['voyage', 'festival', 'summit', 'adventure', 'nest', 'bond', 'seed', 'pause'];

  // sign: 세 축 부호 [a, b, c], emoji: 공유 문구·그림, main/deep/ink: 결과 강조색·짙은 색·옅은 카드 바탕,
  // lucky: 행운의 색 견본(hex, 이름은 언어 파일 types.<id>.color), month: 행운의 달(1~12, 이름은 언어 파일 months),
  // item: 행운의 물건 이모지(이름은 언어 파일 types.<id>.item), buddy/rival: 잘 맞는/티격태격하는 결과(보여주기만, 링크 없음)
  var TYPES = {
    voyage:    { sign: [1, 1, 1],    emoji: '⛵', main: '#5ec8ff', deep: '#1f7fb8', ink: '#0b2233', lucky: '#2f80d1', month: 4,  item: '🗺️', buddy: 'nest',      rival: 'pause' },
    festival:  { sign: [1, 1, -1],   emoji: '🎉', main: '#ff8a65', deep: '#c2492a', ink: '#2c120a', lucky: '#ff6f61', month: 7,  item: '🎈', buddy: 'bond',      rival: 'seed' },
    summit:    { sign: [1, -1, 1],   emoji: '🏔️', main: '#7ed6a0', deep: '#2f9a5c', ink: '#0c2616', lucky: '#2e8b57', month: 10, item: '👟', buddy: 'seed',      rival: 'festival' },
    adventure: { sign: [1, -1, -1],  emoji: '🧭', main: '#ffb347', deep: '#c27a12', ink: '#2b1d08', lucky: '#ff8c1a', month: 8,  item: '🎒', buddy: 'festival',  rival: 'nest' },
    nest:      { sign: [-1, 1, 1],   emoji: '🏡', main: '#e8c39e', deep: '#a8794c', ink: '#2a1d12', lucky: '#d2b48c', month: 12, item: '🕯️', buddy: 'voyage',    rival: 'adventure' },
    bond:      { sign: [-1, 1, -1],  emoji: '🍵', main: '#ff9ec4', deep: '#c24f80', ink: '#2c0f1d', lucky: '#f48fb1', month: 5,  item: '✉️', buddy: 'festival',  rival: 'summit' },
    seed:      { sign: [-1, -1, 1],  emoji: '🌱', main: '#a6e36e', deep: '#5c9c2a', ink: '#16260b', lucky: '#74d4a8', month: 3,  item: '📒', buddy: 'summit',    rival: 'festival' },
    pause:     { sign: [-1, -1, -1], emoji: '🌙', main: '#b9a7ff', deep: '#6f58c9', ink: '#19122e', lucky: '#a58fdc', month: 11, item: '🧣', buddy: 'bond',      rival: 'voyage' }
  };

  // 11문항. w[j] = j번 보기의 [a, b, c]. emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var P = 1, M = -1;
  var QUESTIONS = [
    { emoji: '🎆', w: [[M, P, M], [P, P, P], [M, M, P], [P, M, M]] },  // 12월 31일 밤 11시 50분, 나는 어디에? (짝)
    { emoji: '📔', w: [[P, P, M], [M, M, M], [M, P, P], [P, M, P]] },  // 새 다이어리 첫 장 (홀)
    { emoji: '🌄', w: [[M, M, P], [P, M, M], [P, P, P], [M, P, M]] },  // 새해 첫 해돋이 (짝)
    { emoji: '🎯', w: [[P, M, P], [M, P, P], [P, P, M], [M, M, M]] },  // 올해 다짐 (홀)
    { emoji: '💼', w: [[P, M, M], [M, P, M], [M, M, P], [P, P, P]] },  // 일·공부에서 새 프로젝트 (짝)
    { emoji: '🧧', w: [[M, P, P], [P, P, M], [M, M, M], [P, M, P]] },  // 생각지 못한 작은 용돈·보너스 (홀)
    { emoji: '🗓️', w: [[P, P, P], [M, M, P], [P, M, M], [M, P, M]] },  // 일정 없는 주말 (짝)
    { emoji: '🥂', w: [[M, M, M], [P, M, P], [P, P, M], [M, P, P]] },  // 신년 모임에서 처음 보는 사람 (홀)
    { emoji: '☕', w: [[M, P, M], [P, M, M], [P, P, P], [M, M, P]] },  // 바쁜 시기 뒤 지칠 때 (짝)
    { emoji: '🚪', w: [[P, M, P], [M, M, M], [M, P, P], [P, P, M]] },  // 한 해 중간에 찾아온 뜻밖의 기회 (홀)
    { emoji: '🎁', w: [[M, M, P], [P, P, P], [M, P, M], [P, M, M]] }   // 1년 뒤 마지막 날, 뿌듯할 일 (짝)
  ];
  var N = ORDER.length;
  var AXES = 3;
  var MAX = QUESTIONS.length; // 축마다 최대 절댓값(모든 점수 ±1)

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [A, B, C], n }
  function tally(answers) {
    var s = [0, 0, 0], n = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var w = QUESTIONS[qi].w[ci];
      if (!w) continue;
      s[0] += w[0]; s[1] += w[1]; s[2] += w[2]; n += 1;
    }
    return { s: s, n: n };
  }

  // [A, B, C] → 결과 id. 다 답하면 0 이 없다. 답이 모자라 0 이면 + 쪽(정해진 규칙, 결정적).
  function classify(s) {
    var sg = s.map(function (x) { return x >= 0 ? 1 : -1; });
    for (var i = 0; i < ORDER.length; i++) {
      var t = TYPES[ORDER[i]].sign;
      if (t[0] === sg[0] && t[1] === sg[1] && t[2] === sg[2]) return ORDER[i];
    }
    return ORDER[0];
  }

  // 축별 위치(0~100, 50 = 가운데). 0 쪽 = 도전/함께/계획, 100 쪽 = 안정/나/흐름 (게이지 왼쪽이 + 쪽)
  function leanings(s) {
    return s.map(function (x) {
      var p = 50 - (x / MAX) * 50;
      return Math.max(0, Math.min(100, Math.round(p)));
    });
  }

  function result(answers) {
    var r = tally(answers);
    return { id: classify(r.s), s: r.s, n: r.n, lean: leanings(r.s) };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  // 해마다 따로 세도록 poll id 에 연도를 넣는다(newyear-2027).
  var POLL = 'newyear-' + YEAR;
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
    YEAR: YEAR, ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, AXES: AXES, MAX: MAX,
    tally: tally, classify: classify, leanings: leanings, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
