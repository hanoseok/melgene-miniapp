/* apps/coinflip/coinflip-core.js — 동전 던지기 & 주사위 언어 무관 로직 (UMD: 브라우저 window.COINFLIP_CORE + Node 검사 공용)
 *   - 동전: 앞/뒤 두 선택지 중 하나(0 | 1). 주사위: 6면 1~3개.
 *   - 뽑기: crypto.getRandomValues 거부 샘플링 → 모든 면이 같은 확률. 던지는 연출(회전·굴림)은 결과를 먼저 뽑은 뒤 보여 주기만 한다.
 *   - 누적: 이번 세션(페이지를 연 동안) 던진 횟수만 센다 (서버 숫자 없음).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.COINFLIP_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_DICE = 3;
  var SIDES = 6;
  var MAX_LABEL = 12;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // 0 <= r < max 인 정수. 2^32 를 max 로 나눈 나머지 구간은 버리고 다시 뽑는다(거부 샘플링).
  function cryptoInt(max) {
    if (!(max >= 1)) return 0;
    var c = cryptoObj();
    if (!c) return Math.floor(Math.random() * max);
    var buf = new Uint32Array(1);
    var limit = Math.floor(4294967296 / max) * max;
    for (;;) {
      c.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % max;
    }
  }

  // 동전: 0(첫째 선택지) 또는 1(둘째 선택지)
  function flip(randInt) { return (randInt || cryptoInt)(2); }
  // 주사위: count 개의 1~6 (count 는 1~3 으로 맞춘다)
  function clampDice(n) { n = Math.floor(Number(n)); return n >= 1 && n <= MAX_DICE ? n : 1; }
  function roll(count, randInt) {
    var ri = randInt || cryptoInt;
    var out = [];
    for (var i = 0; i < clampDice(count); i++) out.push(ri(SIDES) + 1);
    return out;
  }
  function sum(list) { return list.reduce(function (a, b) { return a + b; }, 0); }

  // 선택지 이름: 앞뒤 공백 정리, 줄바꿈·꺾쇠·구분 문자 제거, 최대 글자 수, 비면 기본값
  function cleanLabel(s, fallback) {
    var t = String(s == null ? '' : s).replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim();
    t = Array.from(t).slice(0, MAX_LABEL).join('').trim();
    return t || fallback;
  }

  // 누적: { coin: [a, b], dice: n }
  function newTally() { return { coin: [0, 0], dice: 0 }; }
  function addCoin(t, side) { t.coin[side === 1 ? 1 : 0]++; return t; }
  function addDice(t) { t.dice++; return t; }
  function coinTotal(t) { return t.coin[0] + t.coin[1]; }

  return {
    MAX_DICE: MAX_DICE, SIDES: SIDES, MAX_LABEL: MAX_LABEL,
    cryptoInt: cryptoInt, flip: flip, roll: roll, sum: sum, clampDice: clampDice, cleanLabel: cleanLabel,
    newTally: newTally, addCoin: addCoin, addDice: addDice, coinTotal: coinTotal,
  };
});
