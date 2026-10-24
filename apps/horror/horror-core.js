/* apps/horror/horror-core.js
 * 공포영화 생존 테스트 — 언어와 무관한 로직: 결과 8종(id·이모지·색·영화 속 생존 시간·단짝/라이벌) + 11문항의 보기별 점수 + 채점 + 서버 비율(poll) 인코딩.
 * 축 3개(보기마다 [a, b, c], 모두 +1 또는 −1):
 *   a = 용기   (+ 직접 부딪친다 / − 조심한다)
 *   b = 판단   (+ 머리·계획 / − 직감·감정)
 *   c = 함께   (+ 무리와 함께 / − 혼자)
 * 문항이 11개(홀수)이고 모든 점수가 ±1 이라 다 답하면 세 축 합이 절대 0 이 되지 않는다 → 동점 규칙이 필요 없다.
 * 문항마다 보기 4개는 부호 묶음 {+++, +−−, −+−, −−+}(짝) 또는 {−−−, −++, +−+, ++−}(홀) — 축마다 +/− 가 반반이고 두 축끼리도 고르게 섞인다.
 * 결과 = 세 축 부호의 조합 2×2×2 = 8종 (같은 답이면 언제나 같은 결과).
 * 생존 시간(minute, 100분짜리 영화 기준)은 결과의 재미 설정값이다 — 통계가 아니다.
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].w[j] = j번 보기의 점수 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="horror-core.js"> → window.HORROR_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-horror.js (전수 4^11 = 4,194,304가지 + 무작위, 각 결과 9%~16%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.HORROR_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['leader', 'skeptic', 'comic', 'curious', 'strategist', 'researcher', 'final', 'runner'];

  // sign: 세 축 부호 [a, b, c], emoji: 공유 문구·그림, main/deep/ink: 결과 강조색·짙은 색·옅은 카드 바탕,
  // minute: 100분 영화에서 버티는 시간(재미 설정), buddy/rival: 같이 있으면 든든한/티격태격하는 결과(보여주기만, 링크 없음)
  var TYPES = {
    leader:     { sign: [1, 1, 1],    emoji: '🔦', main: '#ffb547', deep: '#b8740f', ink: '#2a1d08', minute: 79,  buddy: 'final',      rival: 'curious' },
    skeptic:    { sign: [1, 1, -1],   emoji: '🧐', main: '#7fb2ff', deep: '#3d6fc2', ink: '#0e1a2e', minute: 42,  buddy: 'researcher', rival: 'runner' },
    comic:      { sign: [1, -1, 1],   emoji: '🤪', main: '#ff7eb6', deep: '#c23d7a', ink: '#2c0f1d', minute: 66,  buddy: 'runner',     rival: 'strategist' },
    curious:    { sign: [1, -1, -1],  emoji: '🚪', main: '#ff8a5b', deep: '#c24f22', ink: '#2c140a', minute: 17,  buddy: 'comic',      rival: 'leader' },
    strategist: { sign: [-1, 1, 1],   emoji: '🗺️', main: '#5fd3c4', deep: '#1f8f81', ink: '#0a2522', minute: 96,  buddy: 'leader',     rival: 'comic' },
    researcher: { sign: [-1, 1, -1],  emoji: '📚', main: '#b79cff', deep: '#7154c9', ink: '#1a1230', minute: 87,  buddy: 'skeptic',    rival: 'curious' },
    final:      { sign: [-1, -1, 1],  emoji: '🌅', main: '#ffd76a', deep: '#c29a1c', ink: '#2b230a', minute: 100, buddy: 'strategist', rival: 'skeptic' },
    runner:     { sign: [-1, -1, -1], emoji: '🏃', main: '#8fe388', deep: '#3f9a38', ink: '#10260e', minute: 91,  buddy: 'final',      rival: 'curious' }
  };
  var MOVIE = 100; // 영화 길이(분) — 생존 시간 막대의 끝

  // 11문항. w[j] = j번 보기의 [a, b, c]. emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var P = 1, M = -1;
  var QUESTIONS = [
    { emoji: '🏚️', w: [[M, P, M], [P, P, P], [M, M, P], [P, M, M]] },  // 버려진 집에서 하룻밤 내기 (짝)
    { emoji: '📞', w: [[P, P, M], [M, M, M], [M, P, P], [P, M, P]] },  // 한밤중 숨소리만 들리는 전화 (홀)
    { emoji: '🌲', w: [[M, M, P], [P, M, M], [P, P, P], [M, P, M]] },  // 숲속 오두막 앞에서 차가 멈춤 (짝)
    { emoji: '🎵', w: [[P, M, P], [M, P, P], [P, P, M], [M, M, M]] },  // 다락방 오르골이 혼자 울림 (홀)
    { emoji: '📖', w: [[P, M, M], [M, P, M], [M, M, P], [P, P, P]] },  // 경고가 적힌 낡은 일기장 (짝)
    { emoji: '🚪', w: [[M, P, P], [P, P, M], [M, M, M], [P, M, P]] },  // 새벽 3시 노크와 익숙한 목소리 (홀)
    { emoji: '🪞', w: [[P, P, P], [M, M, P], [P, M, M], [M, P, M]] },  // 거울 속 내가 늦게 깜빡임 (짝)
    { emoji: '🕯️', w: [[M, M, M], [P, M, P], [P, P, M], [M, P, P]] },  // 폭풍우 정전 (홀)
    { emoji: '🎬', w: [[M, P, M], [P, M, M], [P, P, P], [M, M, P]] },  // "흩어져서 찾아보자" (짝)
    { emoji: '🎪', w: [[P, M, P], [M, M, M], [M, P, P], [P, P, M]] },  // 유령 놀이공원 점쟁이의 경고 (홀)
    { emoji: '🧸', w: [[M, M, P], [P, P, P], [M, P, M], [P, M, M]] }   // 밤마다 움직이는 인형 (짝)
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

  // 축별 위치(0~100, 50 = 가운데). 0 쪽 = 용감/머리/함께, 100 쪽 = 조심/직감/혼자 (게이지 왼쪽이 + 쪽)
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
  var POLL = 'horror';
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
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, AXES: AXES, MAX: MAX, MOVIE: MOVIE,
    tally: tally, classify: classify, leanings: leanings, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
