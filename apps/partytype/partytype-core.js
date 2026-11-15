/* apps/partytype/partytype-core.js
 * 파티 유형 테스트 — 언어와 무관한 로직: 결과 8종(id·축 값·이모지·색·단짝/정반대) + 12문항의 보기별 값 + 채점 + 파티 에너지 게이지(0~100) + 서버 비율(poll) 인코딩.
 *
 * 전제(정직하게): 재미로 보는 테스트다. 모임·파티의 흔한 장면(도착·음악·게임·간식·단체 사진·2차·다음 날 단톡방 등)에서 어떻게 노는지 세 가지 습관을 가볍게 본다.
 * 임상·심리 검사가 아니고 아무것도 진단하지 않는다(결과 페이지·FAQ·가이드에 밝힌다).
 *
 * 8종 = 세 가지 두 갈래 축의 조합(2×2×2 = 8칸, 겹치는 칸 없음):
 *   축 0 energy : 0 cozy(잔잔하게 즐김)        · 1 buzz(신나게, 북적이게)       — 파티 에너지
 *   축 1 focus  : 0 people(사람·대화에 집중)   · 1 scene(음악·음식·사진·놀이 같은 판) — 관심이 가는 곳
 *   축 2 style  : 0 flow(그때그때 흐름대로)    · 1 plan(미리 계획·챙김)           — 노는 방식
 * 결과 이름은 언어별(tools/i18n/<lang>.js types.<id>.name). 어느 유형도 나쁘지 않다 — 모두 파티에 꼭 필요한 역할로 쓴다.
 * 문항 12개 = 축마다 4문항(qi % 3 = 축). 문항마다 보기 4개 = 축의 두 값 각각 "강한" 보기(2점) + "약한" 보기(1점) → 0↔1 을 바꿔도 대칭.
 * 축마다 점수가 큰 값. 동점이면 그 축에서 마지막으로 고른 값(대칭을 지키는 결정적 규칙).
 *   → 무작위 답에서 축마다 정확히 50%, 8종 각각 정확히 12.5% (node tools/check-partytype.js 가 전수 4^12 로 매번 계산).
 * 파티 에너지 게이지(energyPct): 그 사람의 energy 문항 4개 답에서 계산한 "신나는 쪽" 비율 — 강한 buzz 3, 약한 buzz 2, 약한 cozy 1, 강한 cozy 0 을 더해 12 로 나눔.
 *   서버 통계가 아니라 본인 답으로 만든 값이다(가짜 숫자 아님). 결과 주소 #e=<0~100>.
 *   구간: ≤33 잔잔 · 34~66 균형 · ≥67 신남 — energy 축 결과와 어긋나지 않는다(잔잔 결과가 신남 구간에 오지 않음, 반대도; check 가 전수로 확인).
 * 단짝(best) = energy 축만 반대(잔잔한 쪽과 신나는 쪽이 서로 채워 줌), 정반대(rival) = 세 축 모두 반대. 결과 페이지에 이름·그림만(링크 없음).
 * 문구는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] = j번 보기의 값 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="partytype-core.js"> → window.PARTY_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.PARTY_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['confidant', 'earlybird', 'snack', 'memory', 'spark', 'host', 'dj', 'captain'];
  var AXES = ['energy', 'focus', 'style'];

  // v: [energy, focus, style], emoji: 배지·공유 문구, main/deep/ink: 강조색·짙은 글자색·옅은 카드 바탕, best/rival: 결과의 일부(보여주기만)
  var TYPES = {
    confidant: { v: [0, 0, 0], emoji: '🕯️', main: '#c0748f', deep: '#7a2f4b', ink: '#fbeef3', best: 'spark', rival: 'captain' },
    earlybird: { v: [0, 0, 1], emoji: '🐤', main: '#e09a2a', deep: '#7e4e05', ink: '#fdf3df', best: 'host', rival: 'dj' },
    snack: { v: [0, 1, 0], emoji: '🧁', main: '#e0688a', deep: '#8a1f40', ink: '#fdebf0', best: 'dj', rival: 'host' },
    memory: { v: [0, 1, 1], emoji: '📸', main: '#4d8fc0', deep: '#174f78', ink: '#e7f1fa', best: 'captain', rival: 'spark' },
    spark: { v: [1, 0, 0], emoji: '🎈', main: '#e2483b', deep: '#8c1d14', ink: '#fdeae7', best: 'confidant', rival: 'memory' },
    host: { v: [1, 0, 1], emoji: '🫶', main: '#3aa57b', deep: '#145e41', ink: '#e4f5ed', best: 'earlybird', rival: 'snack' },
    dj: { v: [1, 1, 0], emoji: '🎧', main: '#8b5cd6', deep: '#45218a', ink: '#f1ebfc', best: 'snack', rival: 'earlybird' },
    captain: { v: [1, 1, 1], emoji: '📋', main: '#2f6fd6', deep: '#16357e', ink: '#e7eefc', best: 'memory', rival: 'confidant' }
  };

  // 12문항. axis = qi % 3. c[j] = j번 보기의 값, w[j] = 점수(강한 보기 2 · 약한 보기 1). 값마다 강한 것 하나·약한 것 하나.
  // emoji 는 질문 카드 장식(결과 이모지와 겹치지 않는 것만).
  var QUESTIONS = [
    { axis: 0, emoji: '🚪', c: [0, 1, 1, 0], w: [2, 1, 2, 1] }, // 파티 장소에 도착
    { axis: 1, emoji: '🔈', c: [1, 0, 0, 1], w: [2, 2, 1, 1] }, // 분위기가 아직 썰렁할 때
    { axis: 2, emoji: '✉️', c: [0, 1, 0, 1], w: [1, 2, 2, 1] }, // 토요일 모임 초대가 옴
    { axis: 0, emoji: '🎤', c: [1, 0, 0, 1], w: [1, 2, 1, 2] }, // 노래·춤 타임 시작
    { axis: 1, emoji: '🥨', c: [0, 1, 1, 0], w: [1, 2, 1, 2] }, // 간식 테이블 앞
    { axis: 2, emoji: '🎲', c: [1, 1, 0, 0], w: [2, 1, 1, 2] }, // "게임 하자!"
    { axis: 0, emoji: '🌙', c: [0, 0, 1, 1], w: [1, 2, 2, 1] }, // 자정, "2차 가자!"
    { axis: 1, emoji: '🤳', c: [0, 1, 0, 1], w: [2, 1, 1, 2] }, // 단체 사진 타임
    { axis: 2, emoji: '🕚', c: [1, 0, 1, 0], w: [1, 1, 2, 2] }, // 슬슬 늦어질 때(언제 갈까)
    { axis: 0, emoji: '💬', c: [1, 0, 1, 0], w: [2, 1, 1, 2] }, // 다음 날 아침 단톡방
    { axis: 1, emoji: '👋', c: [1, 1, 0, 0], w: [1, 2, 2, 1] }, // 처음 보는 친구의 친구
    { axis: 2, emoji: '🍕', c: [0, 1, 1, 0], w: [2, 2, 1, 1] }  // 배달 음식이 한 시간 늦음
  ];
  var N = ORDER.length;
  // 게이지 점수: [세기][값] → 신나는 쪽 점수(0~3)
  var EP = { 2: [0, 3], 1: [1, 2] };

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [축][값] 점수, last: [축별 마지막 값], n, E: 게이지 점수 합, En: energy 답 수 }
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

  // 파티 에너지 = 신나는 쪽 비율(0~100 정수). energy 답이 없으면 50.
  function energyPct(answers) { return pctOf(tally(answers)); }

  function result(answers) {
    var r = tally(answers);
    var v = [0, 1, 2].map(function (a) { return pick(r.s[a], r.last[a]); });
    return { id: typeOf(v), v: v, scores: r.s, n: r.n, energy: pctOf(r) };
  }
  function score(answers) { return result(answers).id; }

  // 공유 링크의 게이지 값: #e=<0~100>. 이상한 값이면 null.
  function parseScore(hash) {
    var m = /(?:^#|[#&])e=(\d{1,3})(?:&|$)/.exec(String(hash || ''));
    if (!m) return null;
    var n = Number(m[1]);
    return n >= 0 && n <= 100 ? n : null;
  }

  // 게이지 구간: 0 잔잔(≤33) · 1 균형(34~66) · 2 신남(≥67)
  function band(n) { return n >= 67 ? 2 : n <= 33 ? 0 : 1; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'partytype';
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
    tally: tally, pick: pick, typeOf: typeOf, result: result, score: score, energyPct: energyPct, parseScore: parseScore, band: band,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
