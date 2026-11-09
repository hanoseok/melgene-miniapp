/* apps/introvert/introvert-core.js
 * 내향형 외향형 테스트 — 언어와 무관한 로직: 결과 8종(id·축 값·이모지·색·단짝/라이벌) + 12문항의 보기별 값 + 채점 + 내향/외향 비율 + 서버 비율(poll) 인코딩.
 *
 * 전제(정직하게): 내향·외향은 한쪽만 있는 두 상자가 아니라 사회적 에너지의 스펙트럼이다. 대부분은 그 사이 어딘가(양향형)에 있다.
 * 이 테스트는 일상 상황에서의 사회적 에너지 습관 세 가지를 재미로 본다(임상 검사·진단 아님 — 결과 페이지·FAQ·가이드에 밝힌다).
 *
 * 8종 = 세 가지 두 갈래 축의 조합(2×2×2 = 8칸, 겹치는 칸 없음). 각 축의 0 = 내향 쪽, 1 = 외향 쪽:
 *   축 0 recharge: 0 solo(혼자 충전)     · 1 people(사람들과 충전)
 *   축 1 circle  : 0 close(가까운 몇 명) · 1 wide(넓은 무리)
 *   축 2 voice   : 0 inward(생각 후 말) · 1 outward(말하며 생각)
 * 문항 12개 = 축마다 4문항(qi % 3 = 축). 문항마다 보기 4개 = 축의 두 값 각각 "강한" 보기(2점) + "약한" 보기(1점) → 0↔1 을 바꿔도 대칭.
 * 축마다 점수가 큰 값. 동점이면 그 축에서 마지막으로 고른 값(대칭을 지키는 결정적 규칙).
 *   → 무작위 답에서 축마다 정확히 50%, 8종 각각 정확히 12.5% (node tools/check-introvert.js 가 전수 4^12 로 매번 계산).
 * 내향/외향 막대(introPct): 그 사람의 12개 답에서 계산한 "내향 쪽" 비율 — 강한 내향 3:0, 약한 내향 2:1, 약한 외향 1:2, 강한 외향 0:3 을 모두 더한 I/(I+E).
 *   서버 통계가 아니라 본인 답으로 만든 값이다(가짜 숫자 아님). 결과 주소 #i=<0~100>.
 * 단짝(best) = recharge 축만 반대(충전 방식이 서로 채워 줌), 라이벌(rival) = 세 축 모두 반대. 결과 페이지에 이름·그림만(링크 없음).
 * 문구는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="introvert-core.js"> → window.INTROVERT_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.INTROVERT_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['recharger', 'teapot', 'observer', 'chameleon', 'host', 'cheer', 'connector', 'butterfly'];
  var AXES = ['recharge', 'circle', 'voice'];

  // v: [recharge, circle, voice], emoji: 배지·공유 문구, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕, best/rival: 결과의 일부(보여주기만)
  var TYPES = {
    recharger: { v: [0, 0, 0], emoji: '🔋', main: '#5b6fd6', deep: '#2b3a8a', ink: '#eceffd', best: 'host', rival: 'butterfly' },
    teapot: { v: [0, 0, 1], emoji: '🫖', main: '#2f9a7a', deep: '#14604a', ink: '#e3f6ef', best: 'cheer', rival: 'connector' },
    observer: { v: [0, 1, 0], emoji: '🔭', main: '#3a86c8', deep: '#1a4f80', ink: '#e6f1fb', best: 'connector', rival: 'cheer' },
    chameleon: { v: [0, 1, 1], emoji: '🦎', main: '#5aa33a', deep: '#2f6418', ink: '#ecf7e4', best: 'butterfly', rival: 'host' },
    host: { v: [1, 0, 0], emoji: '🍲', main: '#d0842a', deep: '#7a4810', ink: '#fdf1e2', best: 'recharger', rival: 'chameleon' },
    cheer: { v: [1, 0, 1], emoji: '📣', main: '#e0553f', deep: '#8a2618', ink: '#fdeae6', best: 'teapot', rival: 'observer' },
    connector: { v: [1, 1, 0], emoji: '🌉', main: '#9a5ad0', deep: '#552a84', ink: '#f3eafb', best: 'observer', rival: 'teapot' },
    butterfly: { v: [1, 1, 1], emoji: '🦋', main: '#e0468a', deep: '#8a1a4e', ink: '#fde8f1', best: 'chameleon', rival: 'recharger' }
  };

  // 12문항. axis = qi % 3. c[j] = j번 보기의 값(0 내향 쪽 / 1 외향 쪽), w[j] = 점수(강한 보기 2 · 약한 보기 1). 값마다 강한 것 하나·약한 것 하나.
  // emoji 는 질문 카드 장식(결과 이모지와 겹치지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '🌆', c: [0, 1, 1, 0], w: [2, 1, 2, 1] }, // 긴 한 주가 끝난 금요일 밤
    { axis: 1, emoji: '🎂', c: [1, 0, 0, 1], w: [2, 2, 1, 1] }, // 내 생일을 보내는 법
    { axis: 2, emoji: '💬', c: [0, 1, 0, 1], w: [1, 2, 2, 1] }, // 회의·수업에서 아이디어를 물을 때
    { axis: 0, emoji: '🎉', c: [1, 0, 0, 1], w: [1, 2, 1, 2] }, // 큰 모임 다음 날
    { axis: 1, emoji: '🥂', c: [0, 1, 1, 0], w: [1, 2, 1, 2] }, // 주인만 아는 파티
    { axis: 2, emoji: '🛗', c: [1, 1, 0, 0], w: [2, 1, 1, 2] }, // 엘리베이터에서 이웃과 단둘이
    { axis: 0, emoji: '🏠', c: [0, 0, 1, 1], w: [1, 2, 2, 1] }, // 집에서 혼자 보내는 하루
    { axis: 1, emoji: '📱', c: [0, 1, 0, 1], w: [2, 1, 1, 2] }, // 나의 단톡방
    { axis: 2, emoji: '🧩', c: [1, 0, 1, 0], w: [1, 1, 2, 2] }, // 고민을 푸는 법
    { axis: 0, emoji: '📞', c: [1, 0, 1, 0], w: [2, 1, 1, 2] }, // 친구의 갑작스러운 오늘 밤 약속
    { axis: 1, emoji: '🏸', c: [1, 1, 0, 0], w: [1, 2, 2, 1] }, // 새 모임·동아리 첫 주
    { axis: 2, emoji: '✉️', c: [0, 1, 1, 0], w: [2, 2, 1, 1] }  // 전화 vs 메시지
  ];
  var N = ORDER.length;
  // 내향/외향 막대: [강도][값] → [내향, 외향] 점수
  var IE = { 2: [[3, 0], [0, 3]], 1: [[2, 1], [1, 2]] };

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [축][값] 점수, last: [축별 마지막 값], n, I, E }
  function tally(answers) {
    var s = [[0, 0], [0, 0], [0, 0]], last = [null, null, null], n = 0, I = 0, E = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var q = QUESTIONS[qi];
      var v = q.c[ci];
      if (v == null) continue;
      s[q.axis][v] += q.w[ci];
      last[q.axis] = v;
      I += IE[q.w[ci]][v][0];
      E += IE[q.w[ci]][v][1];
      n += 1;
    }
    return { s: s, last: last, n: n, I: I, E: E };
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

  // 내향 쪽 비율(0~100 정수). 답이 없으면 50.
  function introPct(answers) {
    var r = tally(answers);
    if (!(r.I + r.E)) return 50;
    return Math.round((r.I / (r.I + r.E)) * 100);
  }

  function result(answers) {
    var r = tally(answers);
    var v = [0, 1, 2].map(function (a) { return pick(r.s[a], r.last[a]); });
    var intro = r.I + r.E ? Math.round((r.I / (r.I + r.E)) * 100) : 50;
    return { id: typeOf(v), v: v, scores: r.s, n: r.n, intro: intro };
  }
  function score(answers) { return result(answers).id; }

  // 공유 링크의 내향 값: #i=<0~100>. 이상한 값이면 null.
  function parseIntro(hash) {
    var m = /(?:^#|[#&])i=(\d{1,3})(?:&|$)/.exec(String(hash || ''));
    if (!m) return null;
    var n = Number(m[1]);
    return n >= 0 && n <= 100 ? n : null;
  }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'introvert';
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
    ORDER: ORDER, AXES: AXES, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, IE: IE,
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score, introPct: introPct, parseIntro: parseIntro,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
