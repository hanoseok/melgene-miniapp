/* apps/mbti/mbti-core.js
 * MBTI 테스트(비공식, 16가지 성격 유형 재미 테스트) — 언어와 무관한 로직:
 *   유형 16종(id·이모지·그룹 색·찰떡/상극) + 20문항(축 4개 × 5문항, 5단계 동의 척도) + 채점 + 축별 비율 + 서버 비율(poll) 인코딩.
 * 문구(질문·결과 설명)는 tools/i18n/<lang>.js 에만 있다. QUESTIONS[i] 순서가 각 언어 파일의 questions[i] 와 1:1로 대응한다.
 * 브라우저(<script src="mbti-core.js"> → window.MBTI_CORE)와 Node(tools/*.js 에서 require) 공용(UMD).
 *
 * 채점: 답 v = 0(전혀 아니다)~4(매우 그렇다) → d = v - 2 (-2~+2). 문항의 key 가 +1 이면 축의 앞 글자(E·S·T·J) 쪽, -1 이면 뒤 글자(I·N·F·P) 쪽.
 *   축 합 s = Σ d·key (-10~+10). s > 0 → 앞 글자, s < 0 → 뒤 글자, s = 0 → 그 축에서 "가장 먼저 0이 아닌 답"의 방향(대칭이라 치우치지 않음),
 *   그 축 답이 모두 0이면 뒤 글자. 앞 글자 비율 = 50 + 5·s (%). 같은 답이면 언제나 같은 결과.
 *   각 축은 앞 글자 쪽 문항과 뒤 글자 쪽 문항을 섞어 둬서(3:2 / 2:3) "다 그렇다"만 눌러도 한쪽으로 몰리지 않는다.
 * 분포 검증: node tools/check-mbti.js (축마다 5^5 전수 → 16종 정확한 확률 + 무작위, 각 결과 1/16 근처).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.MBTI_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 서버 비율(poll) 번호도 이 순서 — 바꾸지 않는다.
  var ORDER = ['intj', 'intp', 'entj', 'entp', 'infj', 'infp', 'enfj', 'enfp',
    'istj', 'isfj', 'estj', 'esfj', 'istp', 'isfp', 'estp', 'esfp'];

  // 축: 앞 글자(key +1) / 뒤 글자(key -1)
  var AXES = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];

  // 그룹 색 (NT·NF·SJ·SP) — color: 강조색, deep: 짙은 글자색, ink: 옅은 배경색
  var GROUPS = {
    nt: { color: '#7b6cf6', deep: '#3d2fa8', ink: '#efedff' },
    nf: { color: '#2fb886', deep: '#0f6a4a', ink: '#e1f6ee' },
    sj: { color: '#3f8fe0', deep: '#1b538f', ink: '#e4effc' },
    sp: { color: '#f0a033', deep: '#8f550a', ink: '#fff1dc' }
  };
  function groupOf(id) {
    var c = id.toUpperCase();
    if (c[1] === 'N') return c[2] === 'T' ? 'nt' : 'nf';
    return c[3] === 'J' ? 'sj' : 'sp';
  }

  var EMOJI = {
    intj: '♟️', intp: '🧪', entj: '🧭', entp: '⚡', infj: '🔮', infp: '🌙', enfj: '📣', enfp: '🌈',
    istj: '📋', isfj: '🫖', estj: '🗂️', esfj: '🎉', istp: '🔧', isfp: '🎨', estp: '🏄', esfp: '🎤'
  };

  function flip(ch) {
    for (var i = 0; i < AXES.length; i++) {
      if (AXES[i][0] === ch) return AXES[i][1];
      if (AXES[i][1] === ch) return AXES[i][0];
    }
    return ch;
  }
  // 찰떡궁합 = E/I·J/P 를 뒤집은 유형(흔히 말하는 "황금 궁합"), 상극 = 네 글자를 모두 뒤집은 유형.
  // 결과의 일부 — 보여주기만, 링크 금지.
  function bestOf(id) { var c = id.toUpperCase(); return (flip(c[0]) + c[1] + c[2] + flip(c[3])).toLowerCase(); }
  function clashOf(id) { return id.toUpperCase().split('').map(flip).join('').toLowerCase(); }

  var TYPES = {};
  ORDER.forEach(function (id) {
    var g = GROUPS[groupOf(id)];
    TYPES[id] = { code: id.toUpperCase(), emoji: EMOJI[id], group: groupOf(id), color: g.color, deep: g.deep, ink: g.ink, best: bestOf(id), clash: clashOf(id) };
  });

  // 20문항: axis = AXES 번호, key = +1(동의하면 앞 글자) / -1(동의하면 뒤 글자). 축이 번갈아 나온다.
  // emoji 는 질문 카드 장식(언어 무관, 결과를 암시하지 않는 것만).
  var QUESTIONS = [
    { axis: 0, key: 1, emoji: '🔋' },  // 약속 많은 주말 뒤 충전
    { axis: 1, key: -1, emoji: '💭' }, // "만약에" 상상
    { axis: 2, key: 1, emoji: '🛠️' },  // 친구 고민 → 해결책부터
    { axis: 3, key: -1, emoji: '🧳' }, // 여행 짐은 전날 밤
    { axis: 0, key: -1, emoji: '💬' }, // 단톡방은 읽기만 먼저
    { axis: 1, key: 1, emoji: '🍳' },  // 레시피 정량대로
    { axis: 2, key: -1, emoji: '🍽️' }, // 모두가 편한 식당
    { axis: 3, key: 1, emoji: '🗓️' },  // 주말 계획이 있어야 편함
    { axis: 0, key: 1, emoji: '👋' },  // 새 모임에서 먼저 말 걸기
    { axis: 1, key: -1, emoji: '🎬' }, // 영화의 숨은 의미
    { axis: 2, key: 1, emoji: '⚖️' },  // 정확함 > 분위기
    { axis: 3, key: -1, emoji: '🔀' }, // 선택지를 열어 두기
    { axis: 0, key: -1, emoji: '🛋️' }, // 금요일 밤은 집에서
    { axis: 1, key: 1, emoji: '👀' },  // 직접 보고 해 본 것을 믿음
    { axis: 2, key: -1, emoji: '🫶' }, // 결정할 때 사람 먼저
    { axis: 3, key: 1, emoji: '✅' },  // 할 일 목록 지우는 맛
    { axis: 0, key: 1, emoji: '🗣️' },  // 말하면서 생각 정리
    { axis: 1, key: -1, emoji: '💡' }, // 새 아이디어에 먼저 설렘
    { axis: 2, key: 1, emoji: '📝' },  // 솔직한 피드백
    { axis: 3, key: -1, emoji: '🎢' }  // 갑작스러운 계획 변경이 오히려 신남
  ];
  var SCALE = 5; // 답 0~4
  var PER_AXIS = 5;

  // answers[i] = 0~4 (없으면 중립 2로 본다)
  function axisSums(answers) {
    var s = [0, 0, 0, 0], first = [0, 0, 0, 0];
    for (var qi = 0; qi < QUESTIONS.length; qi++) {
      var v = answers[qi];
      if (v == null || !(v >= 0 && v < SCALE)) continue;
      var q = QUESTIONS[qi];
      var c = (v - 2) * q.key;
      s[q.axis] += c;
      if (!first[q.axis] && c !== 0) first[q.axis] = c > 0 ? 1 : -1;
    }
    return { s: s, first: first };
  }

  // 결과: { id, code, pct: [E%, S%, T%, J%] } — pct 는 앞 글자 쪽 비율(0~100, 정수)
  function result(answers) {
    var t = axisSums(answers || []);
    var code = '', pct = [];
    for (var a = 0; a < AXES.length; a++) {
      var s = t.s[a];
      var dir = s > 0 ? 1 : s < 0 ? -1 : (t.first[a] || -1);
      code += dir > 0 ? AXES[a][0] : AXES[a][1];
      pct.push(Math.round(50 + (s * 50) / (2 * PER_AXIS)));
    }
    return { id: code.toLowerCase(), code: code, pct: pct };
  }
  function score(answers) { return result(answers).id; }

  // 결과 페이지로 넘기는 축 비율(#d=): "E%.S%.T%.J%" 를 base64url 로. 받는 쪽은 유형 글자와 맞는지 확인한다.
  function b64url(str) {
    var b = typeof btoa === 'function' ? btoa(str) : Buffer.from(str, 'binary').toString('base64');
    return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64url(str) {
    var s = String(str).replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return typeof atob === 'function' ? atob(s) : Buffer.from(s, 'base64').toString('binary');
  }
  function encodePct(pct) { return b64url(pct.join('.')); }
  // 잘못됐거나 유형과 안 맞으면 null
  function decodePct(str, id) {
    var raw;
    try { raw = unb64url(str); } catch (e) { return null; }
    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(raw)) return null;
    var p = raw.split('.').map(Number);
    var code = String(id || '').toUpperCase();
    if (code.length !== 4) return null;
    for (var a = 0; a < 4; a++) {
      if (p[a] < 0 || p[a] > 100 || p[a] % 5 !== 0) return null;
      if (p[a] > 50 && code[a] !== AXES[a][0]) return null;
      if (p[a] < 50 && code[a] !== AXES[a][1]) return null;
    }
    return p;
  }

  // 같은 유형이 나온 사람 비율(서버 실제 값): poll_vote 보기 번호는 0~9 까지라 16종을 질문 id 두 개(r0: 0~7, r1: 8~15)에 나눠 담는다.
  var POLL = 'mbti';
  function pollSlot(id) {
    var i = ORDER.indexOf(id);
    return { qid: i < 8 ? 'r0' : 'r1', opt: i % 8 };
  }
  // poll_results 행([{ qid, option, votes }]) → { total, counts: { 유형: 명 } } 또는 null
  function pollCounts(rows) {
    if (!Array.isArray(rows)) return null;
    var counts = {}, total = 0;
    rows.forEach(function (r) {
      var o = Number(r.option), v = Number(r.votes) || 0;
      var base = r.qid === 'r0' ? 0 : r.qid === 'r1' ? 8 : -1;
      if (base < 0 || !(o >= 0 && o < 8)) return;
      var id = ORDER[base + o];
      counts[id] = (counts[id] || 0) + v;
      total += v;
    });
    return { total: total, counts: counts };
  }

  return {
    ORDER: ORDER, AXES: AXES, GROUPS: GROUPS, TYPES: TYPES, QUESTIONS: QUESTIONS, SCALE: SCALE, PER_AXIS: PER_AXIS,
    axisSums: axisSums, result: result, score: score, bestOf: bestOf, clashOf: clashOf,
    encodePct: encodePct, decodePct: decodePct,
    POLL: POLL, pollSlot: pollSlot, pollCounts: pollCounts
  };
});
