/* apps/teto/teto-core.js
 * 테토·에겐 테스트 — 언어와 무관한 로직: 결과 8종(id·이모지·색·찰떡 케미/티격태격 라이벌) + 12문항의 보기별 테토 점수 + 채점 + 서버 비율(poll) 인코딩.
 * 보기마다 테토 점수 v ∈ {0,1,2,3} (3 = 아주 테토: 직진·행동·주도, 2 = 살짝 테토, 1 = 살짝 에겐, 0 = 아주 에겐: 공감·섬세·다정).
 * 한 문항의 보기 4개는 0·1·2·3 을 하나씩 갖고, 위치는 문항마다 섞여 있다.
 * 두 축:
 *   T = 테토 점수 합(0~36) → 테토 % = T / (3 × 답한 문항 수), 에겐 % = 100 − 테토 % (사용자 자신의 답으로 계산한 진짜 숫자)
 *   K = "확실한" 보기(0 또는 3)를 고른 횟수(0~12) → 같은 쪽이라도 강하게/부드럽게
 * 결과(x = T − 18, 가운데에서 얼마나 기울었나):
 *   |x| ≥ A (A = K ≥ 5 이면 3, 아니면 4)  → 테토/에겐 쪽: K ≥ 7 이면 불꽃 테토/감성 만렙 에겐, 아니면 든든 테토/포근 에겐
 *   |x| < C (C = K ≥ 8 이면 1, 아니면 2)  → 가운데: K ≥ 6 이면 반전 매력형(양쪽 끝을 오감), 아니면 황금 밸런스(잔잔)
 *   그 사이                               → 겉테속에(테토 쪽) / 겉에속테(에겐 쪽)
 *   확실한 보기를 많이 고를수록 가운데에서 더 멀리 간 것으로 본다(경계가 K 에 따라 한 칸 움직임). 같은 답이면 언제나 같은 결과.
 * 문구(질문·보기·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].v[j] 순서가 각 언어 파일의 questions[i].choices[j] 와 1:1.
 * 브라우저(<script src="teto-core.js"> → window.TETO_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-teto.js (전수 4^12 = 16,777,216가지 + 무작위, 각 결과 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.TETO_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다. (테토 쪽 → 가운데 → 에겐 쪽)
  var ORDER = ['boldteto', 'softteto', 'tetoegen', 'switch', 'balance', 'egenteto', 'softegen', 'boldegen'];

  // emoji: 결과 그림 가운데, color: 강조색, deep: 짙은 테두리·글자색, ink: 아주 옅은 카드 바탕색,
  // best/rival: 찰떡 케미·티격태격 라이벌 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    boldteto: { emoji: '🔥', color: '#ff5a36', deep: '#b8320f', ink: '#fff1ec', best: 'softegen', rival: 'boldegen' },
    softteto: { emoji: '🛡️', color: '#f08a24', deep: '#a8560a', ink: '#fff5e8', best: 'boldegen', rival: 'switch' },
    tetoegen: { emoji: '🥥', color: '#c9733c', deep: '#7f4119', ink: '#fbf1e9', best: 'egenteto', rival: 'boldteto' },
    switch: { emoji: '🎭', color: '#8a5cf6', deep: '#5631b8', ink: '#f3eeff', best: 'balance', rival: 'softteto' },
    balance: { emoji: '⚖️', color: '#2bb38a', deep: '#167357', ink: '#eaf8f2', best: 'switch', rival: 'boldteto' },
    egenteto: { emoji: '🍑', color: '#f2709c', deep: '#b03463', ink: '#fff0f5', best: 'tetoegen', rival: 'softegen' },
    softegen: { emoji: '🌷', color: '#e38bd0', deep: '#9a3f88', ink: '#fdf0fa', best: 'boldteto', rival: 'egenteto' },
    boldegen: { emoji: '💞', color: '#d9467a', deep: '#952251', ink: '#fdedf3', best: 'softteto', rival: 'boldteto' }
  };

  // 12문항. v[j] = j번 보기의 테토 점수(0~3). emoji 는 상황 카드 장식(결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '📵', v: [0, 3, 1, 2] }, // 약속 30분 전 취소
    { emoji: '🍜', v: [3, 1, 0, 2] }, // 주문이 잘못 나옴
    { emoji: '🗓️', v: [1, 3, 2, 0] }, // 아무 약속 없는 주말
    { emoji: '💬', v: [1, 3, 0, 2] }, // 친구의 고민 상담
    { emoji: '🧳', v: [2, 0, 3, 1] }, // 단체 여행 계획
    { emoji: '📱', v: [3, 0, 2, 1] }, // 메시지 스타일
    { emoji: '🚶', v: [0, 2, 3, 1] }, // 새치기
    { emoji: '🎁', v: [1, 0, 2, 3] }, // 친구 생일 선물
    { emoji: '📉', v: [3, 1, 2, 0] }, // 큰 실수를 했을 때
    { emoji: '🎤', v: [0, 2, 3, 1] }, // 노래방·모임
    { emoji: '🍿', v: [2, 1, 0, 3] }, // 오늘 볼 영화
    { emoji: '✨', v: [1, 3, 0, 2] } // 나를 닮은 한마디
  ];
  var N = ORDER.length;
  var MAX = 3;

  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null) → { t: 테토 합, k: 확실한 보기 수, n: 답한 문항 수 }
  function tally(answers) {
    var t = 0, k = 0, n = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var v = QUESTIONS[qi].v[ci];
      if (v == null) continue;
      t += v; n += 1;
      if (v === 0 || v === MAX) k += 1;
    }
    return { t: t, k: k, n: n };
  }

  // (t, k, n) → 결과 id. 가운데 = 답한 문항 수 × 1.5 (12문항이면 18).
  function classify(t, k, n) {
    var x = t - (n * MAX) / 2;
    var ax = Math.abs(x);
    var A = k >= 5 ? 3 : 4;
    var C = k >= 8 ? 1 : 2;
    if (ax >= A) {
      if (x > 0) return k >= 7 ? 'boldteto' : 'softteto';
      return k >= 7 ? 'boldegen' : 'softegen';
    }
    if (ax < C) return k >= 6 ? 'switch' : 'balance';
    return x > 0 ? 'tetoegen' : 'egenteto';
  }

  // 테토 % (0~100 정수, 반올림). 에겐 % = 100 − 테토 %.
  function tetoPct(t, n) {
    if (!n) return 50;
    return Math.round((t / (n * MAX)) * 100);
  }

  function result(answers) {
    var s = tally(answers);
    var pct = tetoPct(s.t, s.n);
    return { id: classify(s.t, s.k, s.n), teto: pct, egen: 100 - pct, t: s.t, k: s.k };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'teto';
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
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, MAX: MAX, N: N,
    tally: tally, classify: classify, tetoPct: tetoPct, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
