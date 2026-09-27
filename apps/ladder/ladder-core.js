/* apps/ladder/ladder-core.js — 사다리타기 핵심 알고리즘 (시드 난수, 가로줄 생성, 매핑 계산).
 * 브라우저(<script src="ladder-core.js">)와 Node(tools/check-ladder.js에서 require) 양쪽에서
 * 동일한 코드로 검증할 수 있도록 UMD 스타일로 export 한다. (data.js와 동일한 패턴)
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = core;
  } else {
    root.LADDER_CORE = core;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var MIN_N = 2;
  var MAX_N = 10;

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // 시드 기반 난수 (mulberry32) — 같은 시드는 항상 같은 결과를 낸다.
  function mulberry32(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomSeed() {
    return Math.floor(Math.random() * 0xffffffff);
  }

  function rowsForN(n) {
    return clamp(n * 3, 12, 22);
  }

  // 규칙: 같은 줄(row)에서 이웃한 두 칸(gap)에 동시에 가로줄이 생기지 않는다.
  // → 각 행에서 놓인 가로줄들은 서로 칸을 공유하지 않으므로 경로가 겹치거나 끊기지 않고,
  //   전체 사다리는 항상 유효한 순열(permutation)을 만든다.
  function generateRungs(n, rows, rand, prob) {
    prob = prob == null ? 0.34 : prob;
    var rungs = [];
    for (var r = 0; r < rows; r++) {
      var row = new Array(n - 1).fill(false);
      var skipNext = false;
      for (var g = 0; g < n - 1; g++) {
        if (skipNext) { skipNext = false; continue; }
        if (rand() < prob) {
          row[g] = true;
          skipNext = true;
        }
      }
      rungs.push(row);
    }
    return rungs;
  }

  function computeMapping(n, rows, rungs) {
    var mapping = new Array(n);
    for (var start = 0; start < n; start++) {
      var cur = start;
      for (var r = 0; r < rows; r++) {
        var row = rungs[r];
        if (cur > 0 && row[cur - 1]) cur -= 1;
        else if (cur < n - 1 && row[cur]) cur += 1;
      }
      mapping[start] = cur;
    }
    return mapping;
  }

  return {
    MIN_N: MIN_N,
    MAX_N: MAX_N,
    clamp: clamp,
    mulberry32: mulberry32,
    randomSeed: randomSeed,
    rowsForN: rowsForN,
    generateRungs: generateRungs,
    computeMapping: computeMapping,
  };
});
