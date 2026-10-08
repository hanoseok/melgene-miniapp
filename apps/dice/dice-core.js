/* apps/dice/dice-core.js — 주사위 굴리기 언어 무관 로직 (UMD: 브라우저 window.DICE_CORE + Node 검사 공용)
 *   - 주사위 1~6개, 종류 d4·d6·d8·d10·d12·d20 (값은 1~면 수).
 *   - 뽑기: crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음) → 모든 면이 같은 확률. 굴리는 연출은 결과를 먼저 뽑은 뒤 보여 주기만 한다.
 *   - 기록: 이번 세션(페이지를 연 동안) 최근 10번만 메모리에 둔다(저장하지 않음).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DICE_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TYPES = [4, 6, 8, 10, 12, 20];
  var DEFAULT_SIDES = 6;
  var MIN_DICE = 1;
  var MAX_DICE = 6;
  var HISTORY_MAX = 10;
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 정수로 0 ≤ r < max 를 만든다.
  // 2^32 를 max 로 나눈 나머지 구간(limit 이상)은 버리고 다시 뽑는다(거부 샘플링) → 모듈로 치우침 없음.
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1)) return 0;
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('dice-core: random source keeps returning rejected values');
  }

  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('dice-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  // 0 <= r < max (crypto)
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  function clampCount(n) { n = Math.floor(Number(n)); return n >= MIN_DICE && n <= MAX_DICE ? n : MIN_DICE; }
  function clampSides(s) { s = Math.floor(Number(s)); return TYPES.indexOf(s) >= 0 ? s : DEFAULT_SIDES; }

  // count 개의 1~sides 값. randInt(max) 를 주입하면 그것으로(검사용), 없으면 crypto.
  function roll(count, sides, randInt) {
    var ri = randInt || cryptoInt;
    var n = clampCount(count);
    var s = clampSides(sides);
    var out = [];
    for (var i = 0; i < n; i++) out.push(ri(s) + 1);
    return out;
  }
  function sum(list) { return list.reduce(function (a, b) { return a + b; }, 0); }
  // 2d6 · d20 같은 표기 (주사위 1개면 개수 생략, letter 는 언어별: d / W)
  function notation(count, sides, letter) {
    var n = clampCount(count);
    return (n > 1 ? n : '') + (letter || 'd') + clampSides(sides);
  }

  // 기록: 최신이 맨 앞, 최대 10개
  function pushHistory(list, entry) {
    var next = [entry].concat(list || []);
    return next.slice(0, HISTORY_MAX);
  }

  // n 개의 s 면 주사위 합의 정확한 확률 분포 { 합: 확률 } (가이드·검사용)
  function sumDistribution(n, s) {
    var dist = [1];
    for (var k = 0; k < n; k++) {
      var next = [];
      for (var i = 0; i < dist.length; i++) {
        for (var f = 1; f <= s; f++) next[i + f] = (next[i + f] || 0) + dist[i] / s;
      }
      dist = next;
    }
    var out = {};
    for (var t = 0; t < dist.length; t++) if (dist[t]) out[t] = dist[t];
    return out;
  }

  // 6면 주사위 정육면체에서 각 눈이 앞으로 오게 하는 회전(도). 면 배치: 앞 1 · 위 2 · 오른쪽 3 · 왼쪽 4 · 아래 5 · 뒤 6 (마주 보는 면 합 7)
  var CUBE_FACE = { 1: [0, 0], 2: [-90, 0], 3: [0, -90], 4: [0, 90], 5: [90, 0], 6: [0, 180] };
  function cubeRotation(value) { var r = CUBE_FACE[value]; return r ? { x: r[0], y: r[1] } : { x: 0, y: 0 }; }

  return {
    TYPES: TYPES, DEFAULT_SIDES: DEFAULT_SIDES, MIN_DICE: MIN_DICE, MAX_DICE: MAX_DICE, HISTORY_MAX: HISTORY_MAX,
    uniformInt: uniformInt, cryptoInt: cryptoInt, clampCount: clampCount, clampSides: clampSides,
    roll: roll, sum: sum, notation: notation, pushHistory: pushHistory, sumDistribution: sumDistribution, cubeRotation: cubeRotation,
  };
});
