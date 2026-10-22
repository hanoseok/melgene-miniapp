/* apps/color/color-core.js
 * 퍼스널 컬러 테스트 — 언어와 무관한 로직: 결과 8종(id·이모지·대표색·추천/피할 색 hex) + 12문항의 보기별 점수 + 채점 + 서버 비율(poll) 인코딩.
 * 축 3개(보기마다 [t, v, c]):
 *   t = 온도  (+ 웜 / − 쿨)        — 손목 혈관, 금·은, 흰색·아이보리, 입술색 같은 단서
 *   v = 명도  (+ 라이트 / − 딥)     — 머리·눈 색의 깊이, 햇볕 반응, 잘 받는 옅은/짙은 색
 *   c = 채도  (+ 브라이트 / − 뮤트) — 선명한 색 vs 차분한 색, 머리·피부 대비
 * 채점(같은 답이면 언제나 같은 결과):
 *   1) 온도: T > 0 → 웜, T < 0 → 쿨, T = 0 → 온도 단서가 가장 강한 1번(혈관)·4번(흰색/아이보리) 답으로, 그래도 0 이면 C 의 부호(선명 → 쿨)
 *   2) 명도·채도 중 절댓값이 큰 쪽이 하위 유형을 정한다(같으면 TIE 규칙).
 *      웜: V+ 봄 라이트 · C+ 봄 브라이트 · C− 가을 뮤트 · V− 가을 딥
 *      쿨: V+ 여름 라이트 · C− 여름 뮤트 · C+ 겨울 브라이트 · V− 겨울 딥
 * 재미용 셀프 체크 — 전문 드레이핑 진단이 아니다(결과·FAQ·가이드에 안내).
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].w[j] = j번 보기의 점수 — 각 언어 파일 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="color-core.js"> → window.COLOR_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-color.js (전수 조합 + 무작위, 각 결과 5%~25%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.COLOR_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['springlight', 'springbright', 'summerlight', 'summermute', 'autumnmute', 'autumndeep', 'winterbright', 'winterdeep'];

  // emoji: 공유 문구·그림, main/deep/ink: 결과 페이지 강조색·짙은 글자색·옅은 카드 바탕,
  // best: 잘 받는 색 8개, avoid: 피하면 좋은 색 4개 (화면에 칩으로 그대로 그린다)
  var TYPES = {
    springlight: {
      emoji: '🌷', main: '#f7a58c', deep: '#a8553c', ink: '#fff4ec',
      best: ['#ffd8c2', '#ffb59a', '#f9e79f', '#c9e7a7', '#a8e0d6', '#9fd3f2', '#f4c7d8', '#e8d3b0'],
      avoid: ['#1b1b1b', '#5b2a3c', '#4a5a3a', '#6e6e7a']
    },
    springbright: {
      emoji: '🌻', main: '#ff7a3d', deep: '#b0420f', ink: '#fff2e8',
      best: ['#ff6f61', '#ff9f1c', '#ffd23f', '#7ed957', '#00c2a8', '#2bb7f0', '#ff5d8f', '#f6efe0'],
      avoid: ['#8c8a9a', '#b8a6b3', '#5c5148', '#2e3440']
    },
    summerlight: {
      emoji: '🫧', main: '#9fb8f0', deep: '#41598f', ink: '#f2f5ff',
      best: ['#cfe3ff', '#a9c8f5', '#c8b6f0', '#f5c6dc', '#f2a7c0', '#b8e3dc', '#e6e8f0', '#9fb1c9'],
      avoid: ['#ff7f11', '#c96a1b', '#6b4423', '#1a1a1a']
    },
    summermute: {
      emoji: '🌫️', main: '#a58fb3', deep: '#5d4a6b', ink: '#f6f2f8',
      best: ['#c4a5b8', '#b08ba3', '#9aa8c2', '#8fa8a0', '#a7b5c8', '#d5c4cf', '#7b8aa3', '#c9c3d6'],
      avoid: ['#ff5e00', '#ffd400', '#00b140', '#000000']
    },
    autumnmute: {
      emoji: '🍂', main: '#b88a5a', deep: '#6e4a26', ink: '#faf3ea',
      best: ['#c9a27e', '#b98b6a', '#9c8a55', '#8a9a6b', '#c17f5e', '#a3735c', '#d6c3a5', '#7c8b7e'],
      avoid: ['#ff2fa1', '#00a3ff', '#ffffff', '#1a1aff']
    },
    autumndeep: {
      emoji: '🌰', main: '#a5482a', deep: '#5e2512', ink: '#fbf0ea',
      best: ['#8b3a1f', '#b5651d', '#c9932e', '#5a6b2f', '#2f5d50', '#7a2e2e', '#4b3621', '#e3c590'],
      avoid: ['#f9c6dd', '#b9d7ff', '#d5c9f2', '#c0c0c8']
    },
    winterbright: {
      emoji: '💎', main: '#e3007a', deep: '#8a0049', ink: '#fff0f7',
      best: ['#e3007a', '#0047ff', '#00a86b', '#7b2ff7', '#ff1f3d', '#00c7e6', '#ffffff', '#111111'],
      avoid: ['#d6b48c', '#c9a27e', '#e8c07d', '#a89f91']
    },
    winterdeep: {
      emoji: '🖤', main: '#5b2a86', deep: '#2c1048', ink: '#f5f0fa',
      best: ['#1c1c2e', '#3b1f5c', '#6a0d2b', '#0f4c5c', '#14532d', '#1e3a8a', '#9b1b5a', '#e8e8f0'],
      avoid: ['#ffd9b3', '#f2c49b', '#e6d690', '#c8b79a']
    }
  };

  // 12문항. w[j] = j번 보기의 [t, v, c]. emoji 는 질문 카드 장식(결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '🫲', w: [[-2, 0, 0], [2, 0, 0], [0, 0, 0]] },                         // 손목 안쪽 혈관 색
    { emoji: '💍', w: [[2, 0, 0], [-2, 0, 0], [0, 0, -1], [0, 0, 1]] },             // 금·은 액세서리
    { emoji: '☀️', w: [[-1, 1, 0], [0, 1, 0], [1, -1, 0], [0, -1, 0]] },            // 햇볕에 피부가
    { emoji: '🤍', w: [[-2, 0, 1], [2, 0, -1], [0, 0, 0]] },                         // 새하얀 vs 아이보리
    { emoji: '🧥', w: [[-1, -1, 1], [1, -1, -1], [-1, 1, -1], [1, 1, 1]] },         // 얼굴 가까이 어두운 기본색
    { emoji: '💇', w: [[-1, -2, 1], [1, -1, 0], [-1, 1, -1], [1, 2, 0]] },           // 타고난 머리색
    { emoji: '👁️', w: [[0, -1, 1], [1, 0, 0], [0, 0, -2], [-1, 1, 1]] },            // 눈동자
    { emoji: '🎨', w: [[0, 0, 2], [0, 0, -2], [0, 2, 0], [0, -2, 0]] },             // 칭찬 듣는 옷 색
    { emoji: '🌓', w: [[0, 0, 2], [0, 0, 0], [0, 1, -1], [0, -1, -1]] },           // 머리·피부 대비
    { emoji: '💋', w: [[-2, 0, 0], [2, 0, 0], [0, 1, -1], [0, -1, 1]] },            // 화장 안 한 입술·볼
    { emoji: '🌸', w: [[1, 1, 1], [-1, 1, 0], [1, -1, -1], [-1, -1, 0]] },          // 잘 받는 블러셔
    { emoji: '🪞', w: [[1, 1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, 1]] }          // 거울 속 가장 나다운 분위기
  ];
  var N = ORDER.length;

  // 축별 최대 절댓값(게이지 정규화용)
  var MAX = [0, 1, 2].map(function (k) {
    return QUESTIONS.reduce(function (s, q) {
      return s + Math.max.apply(null, q.w.map(function (x) { return Math.abs(x[k]); }));
    }, 0);
  });

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { s: [T, V, C], n }
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

  // 온도가 0일 때만 쓰는 보조 단서: 1번(혈관)·4번(흰색/아이보리)의 온도 합
  function tieTemp(answers) {
    var t = 0;
    [0, 3].forEach(function (qi) {
      var ci = answers[qi];
      var w = ci == null ? null : QUESTIONS[qi].w[ci];
      if (w) t += w[0];
    });
    return t;
  }

  // [T, V, C] (+ 동점 보조값) → 결과 id
  function classify(s, tie) {
    var T = s[0], V = s[1], C = s[2];
    var warm;
    if (T !== 0) warm = T > 0;
    else if (tie) warm = tie > 0;
    else warm = C <= 0; // 단서가 모두 비기면 선명한 쪽 → 쿨, 차분한 쪽 → 웜
    var useV;
    if (Math.abs(V) !== Math.abs(C)) useV = Math.abs(V) > Math.abs(C);
    else if (V === 0) useV = false; // 둘 다 0
    else useV = (V > 0) === (C > 0) ? !warm : warm; // 같은 부호: 웜은 채도, 쿨은 명도 / 반대 부호: 웜은 명도, 쿨은 채도
    if (warm) {
      if (useV) return V > 0 ? 'springlight' : 'autumndeep';
      return C > 0 ? 'springbright' : 'autumnmute';
    }
    if (useV) return V > 0 ? 'summerlight' : 'winterdeep';
    return C > 0 ? 'winterbright' : 'summermute';
  }

  // 축별 위치(0~100, 50 = 가운데). 0 쪽 = 웜/라이트/브라이트, 100 쪽 = 쿨/딥/뮤트 (게이지 왼쪽이 + 쪽)
  function leanings(s) {
    return s.map(function (x, k) {
      var p = 50 - (x / MAX[k]) * 50;
      return Math.max(0, Math.min(100, Math.round(p)));
    });
  }

  function result(answers) {
    var r = tally(answers);
    return { id: classify(r.s, tieTemp(answers)), s: r.s, n: r.n, lean: leanings(r.s) };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'color';
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
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, N: N, MAX: MAX,
    tally: tally, tieTemp: tieTemp, classify: classify, leanings: leanings, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
