/* apps/enneagram/enneagram-core.js
 * 에니어그램 테스트 — 언어와 무관한 로직: 결과 9종(id·번호·중심·태도·이모지·색·성장 방향) + 12문항의 보기별 값 + 채점 + 서버 비율(poll) 인코딩.
 *
 * 에니어그램 9유형은 두 가지 3분류의 교차로 정확히 3×3 = 9칸이 된다(겹치는 칸 없음):
 *   중심(center, 세 개의 지능 중심 · 트라이어드)  : gut(장·본능 8 9 1) · heart(가슴·감정 2 3 4) · head(머리·사고 5 6 7)
 *   태도(stance, 호나이 그룹 · Riso-Hudson Hornevian groups): assertive(주장형 3 7 8) · compliant(순응·의무형 1 2 6) · withdrawn(물러남형 4 5 9)
 *   → gut: 8 assertive · 1 compliant · 9 withdrawn / heart: 3 · 2 · 4 / head: 7 · 6 · 5
 * 문항 12개 = 중심 문항 6개(짝수 번째 0,2,4…) + 태도 문항 6개(홀수 번째 1,3,5…). 두 축은 서로 다른 문항에서만 점수를 받으므로
 *   무작위로 답하면 두 축이 독립 → 결과 비율 = 중심 비율 × 태도 비율.
 * 문항마다 보기 4개 = 그 축의 세 값 0·1·2 하나씩(2점) + 그중 한 값(d)의 "약한" 보기 하나(1점). 한 축의 d 는 6문항에서 값마다 두 번씩
 *   → 점수 분포가 세 값을 돌려 바꿔도(0→1→2→0) 똑같다(회전 대칭). 약한 보기를 1점으로 둔 것은 세 값 동점(아래)을 줄이려는 것.
 * 축마다 가장 많이 고른 값이 그 축의 답. 동점(결정적, 회전 대칭을 지키는 규칙):
 *   두 값 동점 → 원을 따라 "다음" 값(0·1 → 1, 1·2 → 2, 2·0 → 0)
 *   세 값 동점(2·2·2) → 그 축에서 마지막으로 고른 값
 *   → 무작위 답에서 축마다 33.1%~33.7%, 9유형 각각 약 11.0%~11.4% (node tools/check-enneagram.js 가 전수 4^12 로 매번 계산).
 * 재미·자기 성찰용이다 — 공식 RHETI 등 검증된 검사나 진단이 아니다(결과 페이지·FAQ·가이드에 밝힌다).
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="enneagram-core.js"> → window.ENNEAGRAM_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.ENNEAGRAM_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6', 'type7', 'type8', 'type9'];
  var CENTERS = ['gut', 'heart', 'head'];
  var STANCES = ['assertive', 'compliant', 'withdrawn'];

  // num: 유형 번호, center/stance: 축 값 번호, emoji: 공유 문구·그림, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕,
  // growth: 성장(통합) 방향 유형 — 에니어그램 화살표 1→7→5→8→2→4→1, 3→6→9→3. 결과 페이지에 이름만 보여 준다(링크 없음).
  var TYPES = {
    type1: { num: 1, center: 0, stance: 1, emoji: '⚖️', main: '#3b82c4', deep: '#1f4f80', ink: '#eaf3fb', growth: 'type7' },
    type2: { num: 2, center: 1, stance: 1, emoji: '🤲', main: '#e8698f', deep: '#a3365a', ink: '#fdeef3', growth: 'type4' },
    type3: { num: 3, center: 1, stance: 0, emoji: '🏆', main: '#e8a317', deep: '#8a5a00', ink: '#fdf5e2', growth: 'type6' },
    type4: { num: 4, center: 1, stance: 2, emoji: '🎨', main: '#8e6bd6', deep: '#563a9c', ink: '#f2edfc', growth: 'type1' },
    type5: { num: 5, center: 2, stance: 2, emoji: '🔭', main: '#2a9d9a', deep: '#14615f', ink: '#e6f6f5', growth: 'type8' },
    type6: { num: 6, center: 2, stance: 1, emoji: '🛡️', main: '#5a7184', deep: '#334656', ink: '#edf1f5', growth: 'type9' },
    type7: { num: 7, center: 2, stance: 0, emoji: '🎉', main: '#f26b3a', deep: '#a23d14', ink: '#feefe8', growth: 'type5' },
    type8: { num: 8, center: 0, stance: 0, emoji: '🔥', main: '#d1453b', deep: '#8c201a', ink: '#fcecea', growth: 'type2' },
    type9: { num: 9, center: 0, stance: 2, emoji: '🕊️', main: '#5fa85a', deep: '#336b2f', ink: '#ecf6eb', growth: 'type3' }
  };

  // 12문항. axis 0 = 중심(0 gut · 1 heart · 2 head), axis 1 = 태도(0 assertive · 1 compliant · 2 withdrawn).
  // c[j] = j번 보기의 값, w[j] = 그 보기의 점수(2, 약한 보기 1). 두 번 나오는 값(d)과 약한 보기 자리는 문항마다 다르다.
  // emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '🎈', c: [0, 1, 2, 0], w: [2, 2, 2, 1] }, // 아는 사람이 거의 없는 파티에 들어섰을 때         d = gut
    { axis: 1, emoji: '🧩', c: [0, 2, 1, 0], w: [2, 2, 2, 1] }, // 조별 과제·팀 프로젝트에서 나는                    d = assertive
    { axis: 0, emoji: '🧭', c: [1, 2, 1, 0], w: [2, 2, 1, 2] }, // 큰 결정을 할 때 가장 믿는 것                     d = heart
    { axis: 1, emoji: '🌠', c: [1, 0, 2, 1], w: [1, 2, 2, 2] }, // 정말 갖고 싶은 게 생기면                          d = compliant
    { axis: 0, emoji: '🌧️', c: [2, 0, 1, 2], w: [2, 2, 2, 1] }, // 기분이 가장 쉽게 흔들리는 순간                   d = head
    { axis: 1, emoji: '🔋', c: [2, 0, 2, 1], w: [2, 2, 1, 2] }, // 바쁜 한 주가 끝난 뒤 충전하는 법                  d = withdrawn
    { axis: 0, emoji: '⏳', c: [1, 0, 2, 0], w: [2, 1, 2, 2] }, // 줄이 꼼짝도 안 할 때                             d = gut
    { axis: 1, emoji: '💬', c: [1, 0, 2, 0], w: [2, 2, 2, 1] }, // 누가 내 의견에 반대할 때                          d = assertive
    { axis: 0, emoji: '💐', c: [2, 1, 0, 1], w: [2, 2, 2, 1] }, // 가장 기분 좋은 칭찬                              d = heart
    { axis: 1, emoji: '📏', c: [2, 1, 0, 1], w: [2, 1, 2, 2] }, // 납득이 안 가는 규칙                              d = compliant
    { axis: 0, emoji: '🤝', c: [0, 1, 2, 2], w: [2, 2, 2, 1] }, // 친구에게 문제가 생기면 나는                       d = head
    { axis: 1, emoji: '☀️', c: [0, 2, 1, 2], w: [2, 2, 2, 1] }  // 약속 없는 토요일                                 d = withdrawn
  ];
  var N = ORDER.length;

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { center: [3 점수], stance: [3 점수], last: [축0 마지막 값, 축1 마지막 값], n }
  function tally(answers) {
    var t = [[0, 0, 0], [0, 0, 0]], last = [null, null], n = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var q = QUESTIONS[qi];
      var v = q.c[ci];
      if (v == null) continue;
      t[q.axis][v] += q.w[ci];
      last[q.axis] = v;
      n += 1;
    }
    return { center: t[0], stance: t[1], last: last, n: n };
  }

  // 한 축의 점수 [3] + 마지막으로 고른 값 → 0·1·2 (결정적)
  function pick(s, last) {
    var mx = Math.max(s[0], s[1], s[2]);
    var tied = [];
    for (var k = 0; k < 3; k++) if (s[k] === mx) tied.push(k);
    if (tied.length === 1) return tied[0];
    if (tied.length === 2) return (tied[0] + 1) % 3 === tied[1] ? tied[1] : tied[0]; // 원을 따라 다음 값
    return last == null ? 0 : last; // 세 값 동점: 그 축에서 마지막으로 고른 값 (답이 없으면 0)
  }

  function typeOf(center, stance) {
    for (var i = 0; i < ORDER.length; i++) {
      var t = TYPES[ORDER[i]];
      if (t.center === center && t.stance === stance) return ORDER[i];
    }
    return ORDER[0];
  }

  function result(answers) {
    var r = tally(answers);
    var c = pick(r.center, r.last[0]);
    var s = pick(r.stance, r.last[1]);
    return { id: typeOf(c, s), center: c, stance: s, counts: { center: r.center, stance: r.stance }, n: r.n };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~8 → 9종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'enneagram';
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
    ORDER: ORDER, CENTERS: CENTERS, STANCES: STANCES, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N,
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
