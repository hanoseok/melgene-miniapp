/* apps/coffee/coffee-core.js
 * 나는 어떤 커피? — 언어와 무관한 로직: 결과 8종(id·이모지·색·단짝/라이벌) + 12문항의 보기별 점수(주 유형 +2, 보조 유형 +1)
 * + 채점(유형별 합 → 최고점, 동점이면 "늦은 문항에서 더 받은 쪽" → 그래도 같으면 ORDER 순) + 서버 비율(poll) 인코딩.
 * 문구(질문·보기·결과 설명·꿀팁)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].c[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 점수로 채점된다.
 * 브라우저(<script src="coffee-core.js"> → window.COFFEE_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-coffee.js (전수 4^12 = 16,777,216가지 + 무작위, 각 결과 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.COFFEE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['espresso', 'americano', 'latte', 'cappuccino', 'mocha', 'coldbrew', 'flatwhite', 'caramel'];

  // emoji: 결과 그림, color: 강조색, deep: 짙은 글자색, ink: 옅은 배경색,
  // best/rival: 찰떡 단짝·티격태격 라이벌 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    espresso: { emoji: '⚡', color: '#a8643f', deep: '#5a2f17', ink: '#f6e9df', best: 'latte', rival: 'coldbrew' },
    americano: { emoji: '💧', color: '#5c93b4', deep: '#245572', ink: '#e2eff7', best: 'flatwhite', rival: 'mocha' },
    latte: { emoji: '🥛', color: '#e3b77f', deep: '#85561f', ink: '#fcf1e1', best: 'espresso', rival: 'flatwhite' },
    cappuccino: { emoji: '☁️', color: '#dc946b', deep: '#8a431b', ink: '#fcebdf', best: 'coldbrew', rival: 'americano' },
    mocha: { emoji: '🍫', color: '#c06f80', deep: '#7b2c40', ink: '#fae6ea', best: 'americano', rival: 'espresso' },
    coldbrew: { emoji: '🧊', color: '#4fb3c4', deep: '#14697b', ink: '#def4f8', best: 'cappuccino', rival: 'caramel' },
    flatwhite: { emoji: '🤍', color: '#a6bb84', deep: '#506a2a', ink: '#eef4e2', best: 'mocha', rival: 'cappuccino' },
    caramel: { emoji: '🍮', color: '#f2a238', deep: '#96560a', ink: '#fff0d6', best: 'flatwhite', rival: 'latte' }
  };

  // 12문항. c[j] = [주 유형, 보조 유형] — j번 보기를 고르면 주 유형 +2, 보조 유형 +1.
  // 보기는 2~4개가 아니라 모두 4개. 보기 순서를 섞어 둬서 "늘 첫 번째 = 같은 유형" 같은 규칙이 없다.
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '⏰', c: [['espresso', 'americano'], ['latte', 'mocha'], ['coldbrew', 'cappuccino'], ['cappuccino', 'caramel']] }, // 한가한 토요일 아침
    { emoji: '💬', c: [['espresso', 'flatwhite'], ['americano', 'latte'], ['cappuccino', 'caramel'], ['flatwhite', 'espresso']] }, // 단톡방 저녁 메뉴
    { emoji: '🌧️', c: [['americano', 'espresso'], ['mocha', 'coldbrew'], ['coldbrew', 'americano'], ['caramel', 'cappuccino']] }, // 비 오는 날 지하철 지연
    { emoji: '📸', c: [['flatwhite', 'caramel'], ['mocha', 'coldbrew'], ['cappuccino', 'latte'], ['coldbrew', 'americano']] }, // 사진첩
    { emoji: '📅', c: [['espresso', 'coldbrew'], ['americano', 'flatwhite'], ['latte', 'flatwhite'], ['caramel', 'flatwhite']] }, // 마감 임박
    { emoji: '🫂', c: [['latte', 'mocha'], ['americano', 'latte'], ['mocha', 'latte'], ['coldbrew', 'flatwhite']] }, // 친구의 안 좋은 소식
    { emoji: '🛍️', c: [['flatwhite', 'cappuccino'], ['caramel', 'mocha'], ['espresso', 'americano'], ['cappuccino', 'espresso']] }, // 옷 쇼핑
    { emoji: '🎉', c: [['cappuccino', 'caramel'], ['coldbrew', 'mocha'], ['caramel', 'espresso'], ['latte', 'americano']] }, // 파티 입장
    { emoji: '🌙', c: [['mocha', 'latte'], ['flatwhite', 'coldbrew'], ['coldbrew', 'espresso'], ['espresso', 'americano']] }, // 혼자 있는 저녁
    { emoji: '🎁', c: [['mocha', 'caramel'], ['americano', 'espresso'], ['flatwhite', 'mocha'], ['latte', 'mocha']] }, // 선물 고르기
    { emoji: '🤝', c: [['espresso', 'cappuccino'], ['latte', 'cappuccino'], ['flatwhite', 'coldbrew'], ['caramel', 'cappuccino']] }, // 의견 충돌
    { emoji: '✨', c: [['americano', 'coldbrew'], ['caramel', 'flatwhite'], ['cappuccino', 'latte'], ['mocha', 'coldbrew']] } // 인생 모토
  ];
  var N = ORDER.length;
  var MAIN = 2, SIDE = 1;

  // 점수 벡터(8칸)와 "늦은 문항 가중" 벡터. answers[i] = i번 문항에서 고른 보기 번호(없으면 null).
  function tally(answers) {
    var s = new Array(N).fill(0), w = new Array(N).fill(0);
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var ch = QUESTIONS[qi].c[ci];
      if (!ch) continue;
      var m = ORDER.indexOf(ch[0]), d = ORDER.indexOf(ch[1]);
      s[m] += MAIN; w[m] += MAIN * (qi + 1);
      s[d] += SIDE; w[d] += SIDE * (qi + 1);
    }
    return { s: s, w: w };
  }

  // 결과: 합이 가장 큰 유형. 동점 → 늦은 문항 가중합이 큰 쪽 → ORDER 앞쪽.
  function pickIndex(s, w) {
    var best = 0;
    for (var i = 1; i < N; i++) {
      if (s[i] > s[best] || (s[i] === s[best] && w[i] > w[best])) best = i;
    }
    return best;
  }
  function result(answers) {
    var t = tally(answers);
    var k = pickIndex(t.s, t.w);
    return { id: ORDER[k], scores: t.s };
  }
  function score(answers) { return result(answers).id; }

  // 같은 결과가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~7 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'coffee';
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
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, MAIN: MAIN, SIDE: SIDE,
    tally: tally, pickIndex: pickIndex, result: result, score: score,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
