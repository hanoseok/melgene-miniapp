/* apps/food-cup/food-cup-core.js — 음식 월드컵(이상형 월드컵 방식) 언어 무관 로직 (UMD: 브라우저 window.FOODCUP_CORE + Node 검사 공용)
 *   - 음식 16개: id·이모지·접시 색은 여기, 이름은 tools/i18n/<lang>.js 의 foods[id] (모든 언어 같은 id → 서버 합계는 언어 무관)
 *   - 대진: 시드 셔플(mulberry32) → 16강(8경기) → 8강(4) → 4강(2) → 결승(1) = 15번 고르기
 *   - 서버 투표(poll 'food-cup', qid ^[a-z0-9_-]{1,32}$, opt 0..9, qid 500개 이하):
 *       경기 qid = m<lo>-<hi> (두 음식 번호를 작은 것부터), opt 0 = lo 승, 1 = hi 승 → 120개
 *       우승 qid = c0 (번호 0~9, opt = 번호) / c1 (번호 10~15, opt = 번호-10) → 2개
 *   - 숫자는 서버 합계가 충분할 때만: 경기 합계 ≥ 10, 우승 합계 ≥ 20 (아니면 숨긴다)
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FOODCUP_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var POLL = 'food-cup';
  // 순서(번호)는 서버 qid 에 쓰이므로 바꾸지 않는다. 뒤에 붙이는 것도 16강이 깨지므로 금지.
  var FOODS = [
    { id: 'pizza', emoji: '🍕', plate: '#ffd36b' },
    { id: 'burger', emoji: '🍔', plate: '#ffb27a' },
    { id: 'sushi', emoji: '🍣', plate: '#a8dcd1' },
    { id: 'noodles', emoji: '🍜', plate: '#ffe3a3' },
    { id: 'chicken', emoji: '🍗', plate: '#ffc58f' },
    { id: 'tacos', emoji: '🌮', plate: '#c9e58f' },
    { id: 'pasta', emoji: '🍝', plate: '#ffb3a7' },
    { id: 'curry', emoji: '🍛', plate: '#ffd98a' },
    { id: 'dumplings', emoji: '🥟', plate: '#e6dcc8' },
    { id: 'steak', emoji: '🥩', plate: '#f7b8b8' },
    { id: 'hotpot', emoji: '🍲', plate: '#ffa98f' },
    { id: 'hotdog', emoji: '🌭', plate: '#ffcf6e' },
    { id: 'friedrice', emoji: '🍚', plate: '#fff0b8' },
    { id: 'sandwich', emoji: '🥪', plate: '#d6ecb0' },
    { id: 'stew', emoji: '🥘', plate: '#ffbe85' },
    { id: 'shrimp', emoji: '🍤', plate: '#b9dcf2' },
  ];
  var N = FOODS.length; // 16
  var ROUNDS = ['r16', 'qf', 'sf', 'f']; // 16강 · 8강 · 4강 · 결승
  var TOTAL_MATCHES = N - 1; // 15
  var MIN_PAIR_VOTES = 10;
  var MIN_CHAMP_VOTES = 20;
  var QID_RE = /^[a-z0-9_-]{1,32}$/;

  // ---------------------------------------------------------------- 시드 난수
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function freshSeed() {
    try {
      var c = (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto : null;
      if (c) { var u = new Uint32Array(1); c.getRandomValues(u); return u[0] >>> 0; }
    } catch (e) { /* noop */ }
    return Math.floor(Math.random() * 4294967296) >>> 0;
  }
  // 0..n-1 을 시드로 섞는다 (Fisher–Yates)
  function shuffle(n, seed) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push(i);
    var rnd = mulberry32(seed);
    for (var j = n - 1; j > 0; j--) {
      var k = Math.floor(rnd() * (j + 1));
      var t = arr[j]; arr[j] = arr[k]; arr[k] = t;
    }
    return arr;
  }

  // ---------------------------------------------------------------- 대진 (불변 상태)
  // 상태: { seed, rounds: [[16개], [8개], ...], cur: [이번 라운드 승자들], champion: 번호|null }
  function newGame(seed) {
    var s = (seed == null ? freshSeed() : Number(seed)) >>> 0;
    return { seed: s, rounds: [shuffle(N, s)], cur: [], champion: null };
  }
  function copy(g) {
    return { seed: g.seed, rounds: g.rounds.map(function (r) { return r.slice(); }), cur: g.cur.slice(), champion: g.champion };
  }
  function isDone(g) { return g.champion !== null && g.champion !== undefined; }
  // 지금까지 고른 수 (0..15)
  function picks(g) {
    if (isDone(g)) return TOTAL_MATCHES;
    var n = 0;
    for (var r = 1; r < g.rounds.length; r++) n += g.rounds[r].length;
    return n + g.cur.length;
  }
  // 지금 경기 → { a, b, round: 'r16'|'qf'|'sf'|'f', roundIndex, match (1부터), matches (이 라운드 경기 수), overall (1부터) } | null
  function current(g) {
    if (isDone(g)) return null;
    var ri = g.rounds.length - 1;
    var field = g.rounds[ri];
    var m = g.cur.length;
    return { a: field[2 * m], b: field[2 * m + 1], round: ROUNDS[ri], roundIndex: ri, match: m + 1, matches: field.length / 2, overall: picks(g) + 1 };
  }
  // side: 0 = 왼쪽(a), 1 = 오른쪽(b) 또는 번호 그대로
  function pick(g, side, byIndex) {
    var c = current(g);
    if (!c) return g;
    var winner = byIndex ? side : (side === 1 ? c.b : c.a);
    if (winner !== c.a && winner !== c.b) throw new Error('winner must be one of the pair');
    var n = copy(g);
    n.cur.push(winner);
    var field = n.rounds[n.rounds.length - 1];
    if (n.cur.length * 2 === field.length) {
      if (n.cur.length === 1) n.champion = n.cur[0];
      else { n.rounds.push(n.cur); n.cur = []; }
    }
    return n;
  }
  // 4강에 오른 네 음식(= 내 최종 4)
  function finalFour(g) { return g.rounds[2] ? g.rounds[2].slice() : []; }
  function finalists(g) { return g.rounds[3] ? g.rounds[3].slice() : []; }

  // ---------------------------------------------------------------- 서버 인코딩
  function pairQid(a, b) { var lo = Math.min(a, b), hi = Math.max(a, b); return 'm' + lo + '-' + hi; }
  function pairOpt(a, b, winner) { return winner === Math.min(a, b) ? 0 : 1; }
  function champQid(i) { return i < 10 ? 'c0' : 'c1'; }
  function champOpt(i) { return i < 10 ? i : i - 10; }
  function allQids() {
    var q = [];
    for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) q.push(pairQid(a, b));
    q.push('c0', 'c1');
    return q;
  }
  function validVote(qid, opt) { return QID_RE.test(qid) && opt === (opt | 0) && opt >= 0 && opt <= 9; }

  // poll_results 행 [{ qid, option, votes }] → { qid: [opt0, opt1, …] }
  function resultsMap(rows) {
    var map = {};
    if (!Array.isArray(rows)) return map;
    rows.forEach(function (r) {
      if (!r || typeof r.qid !== 'string') return;
      var o = Number(r.option), v = Number(r.votes);
      if (!(o >= 0 && o <= 9) || !(v >= 0) || !isFinite(v)) return;
      var arr = map[r.qid] = map[r.qid] || [];
      while (arr.length <= o) arr.push(0);
      arr[o] = Math.floor(v);
    });
    return map;
  }
  function addVote(map, qid, opt) {
    var arr = map[qid] = map[qid] || [];
    while (arr.length <= opt) arr.push(0);
    arr[opt] += 1;
    return map;
  }
  function sum(arr) { return (arr || []).reduce(function (s, v) { return s + (v || 0); }, 0); }
  // 이 경기에서 winner 를 고른 비율. 합계 < 10 이면 null. { pct, total }
  function pairStat(map, a, b, winner) {
    var arr = map && map[pairQid(a, b)];
    var total = sum(arr);
    if (!(total >= MIN_PAIR_VOTES)) return null;
    var n = arr[pairOpt(a, b, winner)] || 0;
    return { pct: Math.round((n / total) * 100), total: total };
  }
  // 이 음식을 우승시킨 비율 (모든 우승 표 기준). 합계 < 20 이면 null.
  function champStat(map, i) {
    var c0 = (map && map.c0) || [], c1 = (map && map.c1) || [];
    var total = sum(c0) + sum(c1);
    if (!(total >= MIN_CHAMP_VOTES)) return null;
    var n = (i < 10 ? c0[i] : c1[i - 10]) || 0;
    return { pct: Math.round((n / total) * 100), total: total };
  }

  return {
    POLL: POLL, FOODS: FOODS, N: N, ROUNDS: ROUNDS, TOTAL_MATCHES: TOTAL_MATCHES,
    MIN_PAIR_VOTES: MIN_PAIR_VOTES, MIN_CHAMP_VOTES: MIN_CHAMP_VOTES, QID_RE: QID_RE,
    mulberry32: mulberry32, freshSeed: freshSeed, shuffle: shuffle,
    newGame: newGame, copy: copy, isDone: isDone, picks: picks, current: current, pick: pick,
    finalFour: finalFour, finalists: finalists,
    pairQid: pairQid, pairOpt: pairOpt, champQid: champQid, champOpt: champOpt, allQids: allQids, validVote: validVote,
    resultsMap: resultsMap, addVote: addVote, pairStat: pairStat, champStat: champStat,
  };
});
