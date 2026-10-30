/* apps/job/job-core.js
 * 직업 적성 테스트 — 언어와 무관한 로직: 결과 8종(id·이모지·색·단짝/라이벌) + 11문항의 보기별 점수 + 채점 + 서버 비율(poll) 인코딩.
 * 축 3개(보기마다 [a, b, c], 모두 +1 또는 −1):
 *   a = 사람   (+ 사람과 함께·사람을 돕는 일 / − 사물·데이터·아이디어를 다루는 일)
 *   b = 상상   (+ 새로 만들고 떠올리기 / − 체계·정확함·순서)
 *   c = 앞장   (+ 앞에 나서서 움직이기 / − 한 가지에 깊이 몰두하기)
 * 문항이 11개(홀수)이고 모든 점수가 ±1 이라 다 답하면 세 축 합이 절대 0 이 되지 않는다 → 동점 규칙이 필요 없다.
 * 문항마다 보기 4개는 부호 묶음 {+++, +−−, −+−, −−+}(짝) 또는 {−−−, −++, +−+, ++−}(홀) — 축마다 +/− 가 반반이고 두 축끼리도 고르게 섞인다.
 * 결과 = 세 축 부호의 조합 2×2×2 = 8종 (같은 답이면 언제나 같은 결과).
 * 재미용 테스트다 — 전문 진로 검사가 아니다(결과 페이지·FAQ·가이드에 밝힌다).
 * 문구(질문·보기·결과 설명·추천 직업)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].w[j] = j번 보기의 점수 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="job-core.js"> → window.JOB_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-job.js (전수 4^11 = 4,194,304가지 + 무작위, 각 결과 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.JOB_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['showrunner', 'storyteller', 'captain', 'caretaker', 'creator', 'inventor', 'builder', 'analyst'];

  // sign: 세 축 부호 [a, b, c], emoji: 공유 문구·그림, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕,
  // buddy/rival: 잘 맞는 동료/정반대 스타일(보여주기만, 링크 없음). buddy = 앞장 축만 다른 짝, rival = 세 축 모두 반대.
  var TYPES = {
    showrunner:  { sign: [1, 1, 1],    emoji: '🎤', main: '#ff6b4a', deep: '#c2401f', ink: '#fff0eb', buddy: 'storyteller', rival: 'analyst' },
    storyteller: { sign: [1, 1, -1],   emoji: '📖', main: '#a67bdc', deep: '#6b3fa8', ink: '#f5eefc', buddy: 'showrunner',  rival: 'builder' },
    captain:     { sign: [1, -1, 1],   emoji: '🧭', main: '#2f6fe4', deep: '#1c4cae', ink: '#eaf1ff', buddy: 'caretaker',   rival: 'inventor' },
    caretaker:   { sign: [1, -1, -1],  emoji: '🤝', main: '#ef6f9c', deep: '#b33b67', ink: '#fdeef4', buddy: 'captain',     rival: 'creator' },
    creator:     { sign: [-1, 1, 1],   emoji: '🎨', main: '#f2a316', deep: '#9a6200', ink: '#fff5e2', buddy: 'inventor',    rival: 'caretaker' },
    inventor:    { sign: [-1, 1, -1],  emoji: '💡', main: '#13b3a2', deep: '#0a7569', ink: '#e5f8f5', buddy: 'creator',     rival: 'captain' },
    builder:     { sign: [-1, -1, 1],  emoji: '🛠️', main: '#2ea35f', deep: '#17703d', ink: '#e9f6ee', buddy: 'analyst',     rival: 'storyteller' },
    analyst:     { sign: [-1, -1, -1], emoji: '📊', main: '#6b7a99', deep: '#3d4864', ink: '#eef1f6', buddy: 'builder',     rival: 'showrunner' }
  };

  // 11문항. w[j] = j번 보기의 [a, b, c]. emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var P = 1, M = -1;
  var QUESTIONS = [
    { emoji: '👥', w: [[M, P, M], [P, P, P], [M, M, P], [P, M, M]] },  // 팀 프로젝트에서 저절로 맡는 역할 (짝)
    { emoji: '☀️', w: [[P, P, M], [M, M, M], [P, M, P], [M, P, P]] },  // 갑자기 생긴 자유로운 하루 (홀)
    { emoji: '📦', w: [[M, M, P], [P, M, M], [P, P, P], [M, P, M]] },  // 새 기기를 샀을 때 (짝)
    { emoji: '💬', w: [[M, M, M], [P, M, P], [M, P, P], [P, P, M]] },  // 가장 기분 좋은 칭찬 (홀)
    { emoji: '🏢', w: [[P, M, M], [M, M, P], [P, P, P], [M, P, M]] },  // 꿈의 일터 (짝)
    { emoji: '🚨', w: [[P, M, P], [P, P, M], [M, M, M], [M, P, P]] },  // 문제가 생겼을 때 첫 반응 (홀)
    { emoji: '📱', w: [[P, P, P], [M, M, P], [M, P, M], [P, M, M]] },  // 추천 영상에 자꾸 뜨는 것 (짝)
    { emoji: '🧳', w: [[M, P, P], [M, M, M], [P, P, M], [P, M, P]] },  // 여행 스타일 (홀)
    { emoji: '⏰', w: [[M, M, P], [P, P, P], [P, M, M], [M, P, M]] },  // 마감 하루 전 (짝)
    { emoji: '🎪', w: [[P, P, M], [P, M, P], [M, P, P], [M, M, M]] },  // 동아리·모임에서 맡고 싶은 자리 (홀)
    { emoji: '🌟', w: [[P, M, M], [M, P, M], [P, P, P], [M, M, P]] }   // 10년 뒤 듣고 싶은 말 (짝)
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

  // 축별 위치(0~100, 50 = 가운데). 0 쪽 = 사람/상상/앞장, 100 쪽 = 사물·데이터/체계/몰두 (게이지 왼쪽이 + 쪽)
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
  var POLL = 'job';
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
