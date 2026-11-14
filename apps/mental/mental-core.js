/* apps/mental/mental-core.js
 * 멘탈 강도 테스트 — 언어와 무관한 로직: 결과 8종(id·축 값·이모지·색·단짝/라이벌) + 12문항의 보기별 값 + 채점 + 멘탈 게이지(0~100) + 서버 비율(poll) 인코딩.
 *
 * 전제(정직하게): 재미로 보는 테스트다. 일상의 작은 위기(늦잠·잔소리·계획 취소 등)에서 어떻게 반응하는지 세 가지 습관을 가볍게 본다.
 * 임상·심리 검사가 아니고 아무것도 진단하지 않는다(결과 페이지·FAQ·가이드에 밝힌다).
 *
 * 8종 = 세 가지 두 갈래 축의 조합(2×2×2 = 8칸, 겹치는 칸 없음). 각 축의 0 = 말랑한 쪽, 1 = 단단한 쪽:
 *   축 0 bounce : 0 slow(천천히 회복)        · 1 quick(금방 털고 일어남)   — 회복력
 *   축 1 calm   : 0 stormy(마음이 크게 출렁) · 1 steady(흔들려도 침착)     — 평정심
 *   축 2 self   : 0 absorb(말을 마음에 담음) · 1 trust(내 판단을 믿음)      — 자기 확신
 * 결과 이름은 "재료" 비유(tools/i18n/<lang>.js types.<id>.name). 어느 재료도 나쁘지 않다 — 말랑한 재료도 장점이 있게 쓴다.
 * 문항 12개 = 축마다 4문항(qi % 3 = 축). 문항마다 보기 4개 = 축의 두 값 각각 "강한" 보기(2점) + "약한" 보기(1점) → 0↔1 을 바꿔도 대칭.
 * 축마다 점수가 큰 값. 동점이면 그 축에서 마지막으로 고른 값(대칭을 지키는 결정적 규칙).
 *   → 무작위 답에서 축마다 정확히 50%, 8종 각각 정확히 12.5% (node tools/check-mental.js 가 전수 4^12 로 매번 계산).
 * 멘탈 게이지(strengthPct): 그 사람의 12개 답에서 계산한 "단단한 쪽" 비율 — 강한 단단 3:0, 약한 단단 2:1, 약한 말랑 1:2, 강한 말랑 0:3 을 모두 더한 T/(T+S).
 *   서버 통계가 아니라 본인 답으로 만든 값이다(가짜 숫자 아님). 결과 주소 #s=<0~100>.
 * 단짝(best) = bounce 축만 반대(회복 속도가 서로 채워 줌), 라이벌(rival) = 세 축 모두 반대. 결과 페이지에 이름·그림만(링크 없음).
 * 문구는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="mental-core.js"> → window.MENTAL_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.MENTAL_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['silk', 'ember', 'pearl', 'oak', 'jelly', 'wave', 'bamboo', 'diamond'];
  var AXES = ['bounce', 'calm', 'self'];

  // v: [bounce, calm, self], emoji: 배지·공유 문구, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕, best/rival: 결과의 일부(보여주기만)
  var TYPES = {
    silk: { v: [0, 0, 0], emoji: '🧵', main: '#d9679a', deep: '#86244f', ink: '#fdebf3', best: 'jelly', rival: 'diamond' },
    ember: { v: [0, 0, 1], emoji: '🔥', main: '#e2622f', deep: '#8a2e0c', ink: '#fdece4', best: 'wave', rival: 'bamboo' },
    pearl: { v: [0, 1, 0], emoji: '🦪', main: '#9a86c9', deep: '#4a3a7e', ink: '#f2eefb', best: 'bamboo', rival: 'wave' },
    oak: { v: [0, 1, 1], emoji: '🌳', main: '#5f9440', deep: '#2f5418', ink: '#edf6e6', best: 'diamond', rival: 'jelly' },
    jelly: { v: [1, 0, 0], emoji: '🍮', main: '#e8a51c', deep: '#7d5306', ink: '#fdf3dc', best: 'silk', rival: 'oak' },
    wave: { v: [1, 0, 1], emoji: '🌊', main: '#2a8fc4', deep: '#0f4d72', ink: '#e4f2fa', best: 'ember', rival: 'pearl' },
    bamboo: { v: [1, 1, 0], emoji: '🎋', main: '#3aa58a', deep: '#14634f', ink: '#e3f6f0', best: 'pearl', rival: 'ember' },
    diamond: { v: [1, 1, 1], emoji: '💎', main: '#4a6fd8', deep: '#1f357e', ink: '#e8eefc', best: 'oak', rival: 'silk' }
  };

  // 12문항. axis = qi % 3. c[j] = j번 보기의 값(0 말랑한 쪽 / 1 단단한 쪽), w[j] = 점수(강한 보기 2 · 약한 보기 1). 값마다 강한 것 하나·약한 것 하나.
  // emoji 는 질문 카드 장식(결과 이모지와 겹치지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '🌧️', c: [0, 1, 1, 0], w: [2, 1, 2, 1] }, // 정말 엉망이었던 하루, 다음 날 아침
    { axis: 1, emoji: '⏰', c: [1, 0, 0, 1], w: [2, 2, 1, 1] }, // 알람이 안 울렸다, 나가기 20분 전
    { axis: 2, emoji: '💇', c: [0, 1, 0, 1], w: [1, 2, 2, 1] }, // 새 머리에 친구가 "음… 특이하네"
    { axis: 0, emoji: '📆', c: [1, 0, 0, 1], w: [1, 2, 1, 2] }, // 손꼽아 기다린 약속이 취소됨
    { axis: 1, emoji: '💻', c: [0, 1, 1, 0], w: [1, 2, 1, 2] }, // 발표 직전 노트북이 꺼짐
    { axis: 2, emoji: '📝', c: [1, 1, 0, 0], w: [2, 1, 1, 2] }, // 상사·선생님의 빨간 펜 피드백
    { axis: 0, emoji: '🍳', c: [0, 0, 1, 1], w: [1, 2, 2, 1] }, // 공들인 일이 보기 좋게 실패
    { axis: 1, emoji: '🚇', c: [0, 1, 0, 1], w: [2, 1, 1, 2] }, // 중요한 약속 가는 길, 전철이 멈춤
    { axis: 2, emoji: '💬', c: [1, 0, 1, 0], w: [1, 1, 2, 2] }, // 단톡방에 낸 의견에 아무도 답이 없음
    { axis: 0, emoji: '🎮', c: [1, 0, 1, 0], w: [2, 1, 1, 2] }, // 친구들과 내기·게임에서 크게 짐
    { axis: 1, emoji: '📚', c: [1, 1, 0, 0], w: [1, 2, 2, 1] }, // 마감 세 개가 같은 날 몰림
    { axis: 2, emoji: '🧭', c: [0, 1, 1, 0], w: [2, 2, 1, 1] }  // 큰 결정 앞, 다들 한마디씩
  ];
  var N = ORDER.length;
  // 멘탈 게이지: [강도][값] → [말랑, 단단] 점수
  var TS = { 2: [[3, 0], [0, 3]], 1: [[2, 1], [1, 2]] };

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [축][값] 점수, last: [축별 마지막 값], n, S, T }
  function tally(answers) {
    var s = [[0, 0], [0, 0], [0, 0]], last = [null, null, null], n = 0, S = 0, T = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var q = QUESTIONS[qi];
      var v = q.c[ci];
      if (v == null) continue;
      s[q.axis][v] += q.w[ci];
      last[q.axis] = v;
      S += TS[q.w[ci]][v][0];
      T += TS[q.w[ci]][v][1];
      n += 1;
    }
    return { s: s, last: last, n: n, S: S, T: T };
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
    return r.S + r.T ? Math.round((r.T / (r.S + r.T)) * 100) : 50;
  }

  // 멘탈 게이지 = 단단한 쪽 비율(0~100 정수). 답이 없으면 50.
  function strengthPct(answers) { return pctOf(tally(answers)); }

  function result(answers) {
    var r = tally(answers);
    var v = [0, 1, 2].map(function (a) { return pick(r.s[a], r.last[a]); });
    return { id: typeOf(v), v: v, scores: r.s, n: r.n, strength: pctOf(r) };
  }
  function score(answers) { return result(answers).id; }

  // 공유 링크의 게이지 값: #s=<0~100>. 이상한 값이면 null.
  function parseScore(hash) {
    var m = /(?:^#|[#&])s=(\d{1,3})(?:&|$)/.exec(String(hash || ''));
    if (!m) return null;
    var n = Number(m[1]);
    return n >= 0 && n <= 100 ? n : null;
  }

  // 게이지 구간: 0 말랑(≤42) · 1 균형(43~57) · 2 단단(≥58) — 무작위 답에서 약 26% / 48% / 26%
  function band(n) { return n >= 58 ? 2 : n <= 42 ? 0 : 1; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'mental';
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
    ORDER: ORDER, AXES: AXES, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, TS: TS,
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score, strengthPct: strengthPct, parseScore: parseScore, band: band,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
