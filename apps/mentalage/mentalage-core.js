/* apps/mentalage/mentalage-core.js
 * 정신연령 테스트 — 언어와 무관한 로직: 나이대 8종(id·이모지·색·나이 범위·단짝/라이벌) + 12문항의 "마음 나이 점수"
 * + 채점(점수 합 → 나이대 + 그 안의 숫자 나이) + 서버 비율(poll) 인코딩.
 * 문구(질문·보기·결과 설명·꿀팁)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i].points[j] 순서가
 * 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다 → 모든 언어가 같은 점수로 채점된다.
 * 브라우저(<script src="mentalage-core.js"> → window.MENTALAGE_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 * 분포 검증: node tools/check-mentalage.js (전수 4^9·3^2·2 = 4,718,592가지 + 무작위, 각 나이대 10%~15%).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.MENTALAGE_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 어린 나이대 → 많은 나이대 순. 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['kid', 'teen', 'fresh', 'hustle', 'steady', 'seasoned', 'mellow', 'sage'];

  // emoji: 결과 그림, color: 강조색, deep: 짙은 글자색, ink: 옅은 배경색, min/max: 숫자 나이 범위,
  // best/rival: 단짝·라이벌 (결과의 일부 — 보여주기만, 링크 금지)
  var TYPES = {
    kid: { emoji: '🍭', color: '#ff8fbf', deep: '#b0306e', ink: '#ffe9f3', min: 7, max: 12, best: 'sage', rival: 'hustle' },
    teen: { emoji: '🎧', color: '#a98bff', deep: '#5a3cc0', ink: '#efe9ff', min: 13, max: 17, best: 'fresh', rival: 'steady' },
    fresh: { emoji: '🛹', color: '#4fcfa8', deep: '#11785c', ink: '#e1f8f0', min: 18, max: 23, best: 'teen', rival: 'mellow' },
    hustle: { emoji: '☕', color: '#5aaeff', deep: '#1d5fa8', ink: '#e4f1ff', min: 24, max: 29, best: 'steady', rival: 'kid' },
    steady: { emoji: '🪴', color: '#86c26a', deep: '#3d7426', ink: '#ecf7e4', min: 30, max: 39, best: 'hustle', rival: 'teen' },
    seasoned: { emoji: '🧭', color: '#ffa86b', deep: '#a8501a', ink: '#fff0e4', min: 40, max: 49, best: 'mellow', rival: 'fresh' },
    mellow: { emoji: '🍵', color: '#e2bd3c', deep: '#86680a', ink: '#fdf6dc', min: 50, max: 64, best: 'seasoned', rival: 'fresh' },
    sage: { emoji: '🦉', color: '#9b8bc4', deep: '#54447e', ink: '#f0ecf8', min: 65, max: 82, best: 'kid', rival: 'hustle' }
  };

  // 12문항. points[j] = j번 보기의 "마음 나이 점수"(0 = 아주 어린 마음 … 6 = 아주 노련한 마음).
  // 보기 수는 2~4개. 보기 순서와 점수를 섞어 둬서 "늘 첫 번째 = 어른스러운 답" 같은 규칙이 없다.
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { emoji: '⏰', points: [6, 4, 2, 0] }, // 알람 없는 주말 아침
    { emoji: '🎂', points: [0, 1, 3, 6] }, // 내 생일을 보내는 법
    { emoji: '🔋', points: [2, 6, 0] }, // 밖에서 휴대폰 배터리 15%
    { emoji: '🛒', points: [0, 2, 6, 4] }, // 마트에 들어가면 제일 먼저
    { emoji: '🎵', points: [0, 3, 6, 4] }, // 모두가 말하는 새 노래
    { emoji: '🌧️', points: [0, 2, 4, 6] }, // 비 오는 휴일
    { emoji: '💸', points: [0, 1, 4, 6] }, // 갑자기 생긴 보너스
    { emoji: '🌙', points: [0, 2, 6] }, // 금요일 밤
    { emoji: '🤧', points: [0, 2, 6, 5] }, // 감기 기운이 있을 때
    { emoji: '💬', points: [0, 2, 3, 6] }, // 단체 대화방
    { emoji: '🛋️', points: [0, 1, 4, 6] }, // 내 방 분위기
    { emoji: '🔮', points: [0, 6] } // 딱 하나만 고른다면
  ];

  // 점수 합 → 나이대 경계. CUTS[k] = k번 나이대의 가장 큰 합 (마지막은 최대 합).
  // 전수 분포(모든 답 조합)에서 각 나이대가 고르게(약 1/8) 나오도록 정했다 — check 스크립트가 다시 계산·검사한다.
  var CUTS = [24, 28, 31, 34, 37, 40, 44, 72];
  var MAX_SUM = QUESTIONS.reduce(function (s, q) { return s + Math.max.apply(null, q.points); }, 0);

  // 점수 합 s 와 "늦게 고른 답일수록 무거운" 가중합 w = Σ 점수×(문항 번호+1). 답이 없는 문항은 0점.
  // answers[i] = i번 문항에서 고른 보기 번호(없으면 null).
  function keys(answers) {
    var s = 0, w = 0;
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var ci = answers[qi];
      if (ci == null) continue;
      var p = QUESTIONS[qi].points[ci];
      if (typeof p !== 'number') continue;
      s += p;
      w += p * (qi + 1);
    }
    return { s: s, w: w };
  }
  function sum(answers) { return keys(answers).s; }

  function bracketOf(s) {
    for (var k = 0; k < CUTS.length; k++) if (s <= CUTS[k]) return k;
    return CUTS.length - 1;
  }

  // 숫자 나이표 (처음 한 번만 만든다): 모든 답 조합의 (s, w) 분포를 세고, 나이대 안에서 (s, w) 순으로 줄 세운
  // 자리(분위)를 그 나이대의 나이 범위에 옮긴다 → 같은 답이면 늘 같은 나이, 나이대 안의 나이가 고르게 나온다.
  var W_STEP = 1000;
  var AGE_TABLE = null;
  function ageTable() {
    if (AGE_TABLE) return AGE_TABLE;
    var dist = { 0: 1 };
    QUESTIONS.forEach(function (q, qi) {
      var next = {};
      Object.keys(dist).forEach(function (key) {
        var n = dist[key], k = Number(key);
        q.points.forEach(function (p) {
          var nk = k + p * W_STEP + p * (qi + 1);
          next[nk] = (next[nk] || 0) + n;
        });
      });
      dist = next;
    });
    var sorted = Object.keys(dist).map(Number).sort(function (a, b) { return a - b; });
    var total = {};
    sorted.forEach(function (key) { var b = bracketOf(Math.floor(key / W_STEP)); total[b] = (total[b] || 0) + dist[key]; });
    var before = {}, table = {};
    sorted.forEach(function (key) {
      var b = bracketOf(Math.floor(key / W_STEP));
      var t = TYPES[ORDER[b]];
      var span = t.max - t.min + 1;
      var done = before[b] || 0;
      var pos = (done + dist[key] / 2) / total[b];
      table[key] = Math.min(t.max, t.min + Math.floor(pos * span));
      before[b] = done + dist[key];
    });
    AGE_TABLE = table;
    return table;
  }

  // 결과: { id, age, sum }. id = 점수 합의 나이대, age = 그 나이대 안의 숫자 나이(결정적).
  function result(answers) {
    var k = keys(answers);
    var id = ORDER[bracketOf(k.s)];
    var age = ageTable()[k.s * W_STEP + k.w];
    if (age == null) age = TYPES[id].min;
    return { id: id, age: age, sum: k.s };
  }

  function score(answers) { return result(answers).id; }

  // 공유 링크 #a=<나이> 를 그 결과 범위 안의 숫자로만 받아들인다 (아니면 null)
  function validAge(id, v) {
    var t = TYPES[id];
    var n = Number(v);
    if (!t || !/^\d{1,3}$/.test(String(v)) || n < t.min || n > t.max) return null;
    return n;
  }

  // 같은 나이대가 나온 사람 비율(서버 실제 값): poll_vote 보기 번호 0~9 → 8종을 질문 id 'r0' 하나에 담는다.
  var POLL = 'mentalage';
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
    ORDER: ORDER, TYPES: TYPES, QUESTIONS: QUESTIONS, CUTS: CUTS, MAX_SUM: MAX_SUM,
    sum: sum, result: result, score: score, validAge: validAge,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
