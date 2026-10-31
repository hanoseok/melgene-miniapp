/* apps/finger/finger-core.js — 손가락 룰렛 언어 무관 로직 (UMD: 브라우저 window.FINGER_CORE + Node 검사 공용)
 *   - 모드: one(1명 뽑기) · n(여러 명 뽑기, N = 1~9) · teams(팀 나누기, 2~4팀, 인원 차이 최대 1).
 *   - 손가락(또는 클릭 점)은 최대 10개. 모드마다 최소 인원: one 2 · n N+1 · teams 팀 수.
 *   - 손가락 수가 바뀌면(올리기·떼기) 기다림 시계를 다시 잰다. STABLE_MS 동안 그대로면 그 순간에 뽑는다(클릭 모드는 Go 뒤 GO_MS).
 *   - 뽑기: crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음) + 부분 Fisher–Yates — 그 순간 화면에 있는 점들 사이에서 균등.
 *     색은 들어온 순서로 정해지고 결과와 무관하다.
 *   - 팀: 전체를 crypto 로 섞은 뒤 시작 팀(crypto)부터 돌아가며 나눈다 → 팀 인원 차이 ≤ 1, 누가 어느 팀이든 균등.
 *   - 기록은 메모리에만(최근 10판, 저장하지 않음).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FINGER_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_TOUCHES = 10;
  var MAX_N = 9;
  var MIN_TEAMS = 2;
  var MAX_TEAMS = 4;
  var STABLE_MS = 2500;   // 손가락이 그대로인 채 이만큼 지나면 뽑는다
  var GO_MS = 1500;       // 클릭 모드: Go 를 누른 뒤 두근두근 시간
  var HISTORY_MAX = 10;
  var MODES = ['one', 'n', 'teams'];
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('finger-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('finger-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('finger-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // Fisher–Yates (뒤에서부터, j = 0..i 균등). 원본은 건드리지 않는다.
  function shuffle(arr, randInt) {
    var ri = randInt || cryptoInt;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 설정
  function clampInt(v, lo, hi, dflt) {
    var n = Math.floor(Number(v));
    if (!isFinite(n)) return dflt;
    return Math.max(lo, Math.min(hi, n));
  }
  // raw = { mode, n, teams } → 늘 쓸 수 있는 설정
  function normalize(raw) {
    raw = raw || {};
    return {
      mode: MODES.indexOf(raw.mode) >= 0 ? raw.mode : 'one',
      n: clampInt(raw.n, 1, MAX_N, 2),
      teams: clampInt(raw.teams, MIN_TEAMS, MAX_TEAMS, 2)
    };
  }
  // 뽑기를 시작할 수 있는 최소 손가락 수
  function minTouches(cfg) {
    cfg = normalize(cfg);
    if (cfg.mode === 'n') return Math.min(MAX_TOUCHES, cfg.n + 1);
    if (cfg.mode === 'teams') return cfg.teams;
    return 2;
  }
  function canDecide(cfg, count) { return count >= minTouches(cfg) && count <= MAX_TOUCHES; }

  // ---------------------------------------------------------------- 기다림 시계
  // 손가락 수가 바뀐 시각(changedAt)부터 STABLE_MS 가 지나면 준비 완료. progress = 0..1
  function holdProgress(changedAt, now, ms) {
    var total = ms || STABLE_MS;
    if (changedAt == null) return 0;
    return Math.max(0, Math.min(1, (now - changedAt) / total));
  }
  function holdDone(changedAt, now, ms) { return changedAt != null && now - changedAt >= (ms || STABLE_MS); }

  // ---------------------------------------------------------------- 뽑기
  // ids 중 k 개를 균등하게(순서 없는 부분집합이 모두 같은 확률). 부분 Fisher–Yates.
  function pickWinners(ids, k, randInt) {
    var ri = randInt || cryptoInt;
    var a = ids.slice();
    k = Math.max(0, Math.min(a.length, Math.floor(k)));
    for (var i = 0; i < k; i++) {
      var j = i + ri(a.length - i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a.slice(0, k);
  }
  // 팀 나누기: 섞은 뒤 시작 팀부터 돌아가며 → 팀 크기 차이 ≤ 1. 반환 { [id]: 팀 번호 0..T-1 }
  function splitTeams(ids, teams, randInt) {
    var ri = randInt || cryptoInt;
    var T = clampInt(teams, MIN_TEAMS, MAX_TEAMS, 2);
    var order = shuffle(ids, ri);
    var start = ri(T);
    var out = {};
    order.forEach(function (id, i) { out[id] = (start + i) % T; });
    return out;
  }
  function teamSizes(assign, teams) {
    var s = [];
    for (var i = 0; i < teams; i++) s.push(0);
    Object.keys(assign).forEach(function (id) { s[assign[id]]++; });
    return s;
  }
  // 한 판 결정: { mode, k(손가락 수), winners:[id] } 또는 { mode:'teams', k, teams, assign, sizes }
  function decide(cfg, ids, randInt) {
    cfg = normalize(cfg);
    if (!canDecide(cfg, ids.length)) return null;
    if (cfg.mode === 'teams') {
      var assign = splitTeams(ids, cfg.teams, randInt);
      return { mode: 'teams', k: ids.length, teams: cfg.teams, assign: assign, sizes: teamSizes(assign, cfg.teams) };
    }
    var n = cfg.mode === 'n' ? cfg.n : 1;
    return { mode: cfg.mode, k: ids.length, n: n, winners: pickWinners(ids, n, randInt) };
  }

  // ---------------------------------------------------------------- 기록 (메모리에만)
  // item = { t, mode, k, n?, teams?, sizes? }
  function pushHistory(list, item) {
    return [item].concat(Array.isArray(list) ? list : []).slice(0, HISTORY_MAX);
  }

  return {
    MAX_TOUCHES: MAX_TOUCHES, MAX_N: MAX_N, MIN_TEAMS: MIN_TEAMS, MAX_TEAMS: MAX_TEAMS, STABLE_MS: STABLE_MS, GO_MS: GO_MS,
    HISTORY_MAX: HISTORY_MAX, MODES: MODES,
    uniformInt: uniformInt, cryptoInt: cryptoInt, shuffle: shuffle,
    normalize: normalize, minTouches: minTouches, canDecide: canDecide, holdProgress: holdProgress, holdDone: holdDone,
    pickWinners: pickWinners, splitTeams: splitTeams, teamSizes: teamSizes, decide: decide, pushHistory: pushHistory
  };
});
