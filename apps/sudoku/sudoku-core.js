/* apps/sudoku/sudoku-core.js — 스도쿠 규칙·생성기·풀이기·난이도 채점 (언어 무관, UMD: 브라우저 window.SUDOKU_CORE + Node require)
 * 칸 번호 = r * 9 + c (0..80), 값 0 = 빈 칸. 숫자 후보는 비트마스크(1 << (d - 1)).
 * 생성: 시드 난수(mulberry32)로 완성판을 무작위로 채운 뒤, 180° 대칭 쌍으로 단서를 지운다.
 *   지울 때마다 풀이 개수를 2개까지 세어(countSolutions) 해가 하나뿐인지 확인하고, 사람 기법 채점기(grade)로 난이도 상한을 지킨다.
 *   쉬움 = 싱글만(naked/hidden single), 보통 = + 잠긴 후보·쌍, 어려움 = + 삼중·X-Wing(2단계 이상 필요), 전문가 = 단서 최소(3단계 이상을 고른다).
 *   같은 시드 = 같은 퍼즐(오늘의 퍼즐은 UTC 날짜 + 난이도로 시드를 만든다 → 모두 같은 퍼즐).
 * 서버 점수 분포(supa.submitScore): 난이도마다 게임 이름 하나(sudoku-e/-m/-h/-x), bucket = 1999 − floor(초 / 5) → 클수록 빠름(0..1999).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SUDOKU_CORE = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // target = 지우기를 멈추는 단서 수, maxLevel = 허용하는 기법 단계, minLevel = 필요한 기법 단계(못 맞추면 시도 중 가장 어려운 것)
  var DIFFS = {
    easy: { target: 38, maxLevel: 1, minLevel: 1, tries: 1, game: 'sudoku-e' },
    medium: { target: 31, maxLevel: 2, minLevel: 1, tries: 1, game: 'sudoku-m' },
    hard: { target: 26, maxLevel: 3, minLevel: 2, tries: 12, game: 'sudoku-h' },
    expert: { target: 17, maxLevel: 4, minLevel: 3, tries: 10, game: 'sudoku-x' }
  };
  var DIFF_ORDER = ['easy', 'medium', 'hard', 'expert'];
  var MAX_BUCKET = 1999;
  var BUCKET_STEP = 5;     // 초
  var ALL = 0x1ff;

  // ---------------------------------------------------------------- 칸·묶음 표
  var ROW = [], COL = [], BOX = [], UNITS = [], PEERS = [];
  (function () {
    var i, u, r, c;
    for (i = 0; i < 81; i++) { ROW[i] = Math.floor(i / 9); COL[i] = i % 9; BOX[i] = Math.floor(ROW[i] / 3) * 3 + Math.floor(COL[i] / 3); }
    for (u = 0; u < 9; u++) {
      var row = [], col = [], box = [];
      for (var k = 0; k < 9; k++) {
        row.push(u * 9 + k);
        col.push(k * 9 + u);
        r = Math.floor(u / 3) * 3 + Math.floor(k / 3); c = (u % 3) * 3 + (k % 3);
        box.push(r * 9 + c);
      }
      UNITS[u] = row; UNITS[9 + u] = col; UNITS[18 + u] = box;
    }
    for (i = 0; i < 81; i++) {
      var set = {};
      [UNITS[ROW[i]], UNITS[9 + COL[i]], UNITS[18 + BOX[i]]].forEach(function (unit) { unit.forEach(function (j) { if (j !== i) set[j] = 1; }); });
      PEERS[i] = Object.keys(set).map(Number);
    }
  }());
  var POP = new Uint8Array(512), LOW = new Int8Array(512);
  (function () { for (var m = 1; m < 512; m++) { POP[m] = POP[m >> 1] + (m & 1); LOW[m] = 0; for (var d = 0; d < 9; d++) if (m & (1 << d)) { LOW[m] = d + 1; break; } } }());

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
  // 문자열 → 32비트 시드 (FNV-1a)
  function hashSeed(str) {
    var h = 0x811c9dc5;
    str = String(str);
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h >>> 0;
  }

  // ---------------------------------------------------------------- 풀이기 (비트마스크 + 후보가 가장 적은 칸부터)
  // 해 개수를 limit 까지 센다. randomRnd 가 있으면 숫자를 무작위 순서로 넣고 첫 해를 out 에 남긴다.
  function search(grid, limit, rnd, out) {
    var g = grid.slice();
    var rows = new Int32Array(9), cols = new Int32Array(9), boxes = new Int32Array(9);
    for (var i = 0; i < 81; i++) {
      var v = g[i];
      if (!v) continue;
      var b = 1 << (v - 1);
      if ((rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]) & b) return 0;
      rows[ROW[i]] |= b; cols[COL[i]] |= b; boxes[BOX[i]] |= b;
    }
    var count = 0;
    function rec() {
      var best = -1, bestMask = 0, bestN = 10;
      for (var i = 0; i < 81; i++) {
        if (g[i]) continue;
        var m = ALL & ~(rows[ROW[i]] | cols[COL[i]] | boxes[BOX[i]]);
        var n = POP[m];
        if (n === 0) return false;
        if (n < bestN) { best = i; bestMask = m; bestN = n; if (n === 1) break; }
      }
      if (best < 0) {
        count++;
        if (out && count === 1) for (var k = 0; k < 81; k++) out[k] = g[k];
        return count >= limit;
      }
      var digits = [];
      for (var d = 1; d <= 9; d++) if (bestMask & (1 << (d - 1))) digits.push(d);
      if (rnd) shuffle(digits, rnd);
      var r = ROW[best], c = COL[best], x = BOX[best];
      for (var q = 0; q < digits.length; q++) {
        var bit = 1 << (digits[q] - 1);
        g[best] = digits[q]; rows[r] |= bit; cols[c] |= bit; boxes[x] |= bit;
        if (rec()) return true;
        g[best] = 0; rows[r] &= ~bit; cols[c] &= ~bit; boxes[x] &= ~bit;
      }
      return false;
    }
    rec();
    return count;
  }
  function countSolutions(grid, limit) { return search(grid, limit || 2, null, null); }
  function solve(grid) { var out = new Array(81); return search(grid, 1, null, out) ? out : null; }
  function randomSolution(rnd) { var out = new Array(81); var empty = []; for (var i = 0; i < 81; i++) empty.push(0); search(empty, 1, rnd, out); return out; }

  // ---------------------------------------------------------------- 사람 기법 채점기
  // 1 = naked/hidden single, 2 = 잠긴 후보(pointing·claiming)·naked/hidden pair, 3 = naked triple·X-Wing, 4 = 그것으로 안 풀림
  function grade(puzzle, maxLevel) {
    maxLevel = maxLevel || 3;
    var v = puzzle.slice(), cand = new Int32Array(81), level = 1, left = 0;
    var i, u, d, k;
    for (i = 0; i < 81; i++) {
      if (v[i]) continue;
      left++;
      var m = ALL;
      for (k = 0; k < 20; k++) { var p = v[PEERS[i][k]]; if (p) m &= ~(1 << (p - 1)); }
      cand[i] = m;
    }
    function place(i, d) {
      v[i] = d; cand[i] = 0; left--;
      var b = ~(1 << (d - 1));
      for (var k = 0; k < 20; k++) cand[PEERS[i][k]] &= b;
    }
    function singles() {
      var did = false;
      for (var i = 0; i < 81; i++) if (!v[i] && POP[cand[i]] === 1) { place(i, LOW[cand[i]]); did = true; }
      for (var u = 0; u < 27; u++) {
        var unit = UNITS[u];
        for (var d = 0; d < 9; d++) {
          var bit = 1 << d, at = -1, n = 0;
          for (var k = 0; k < 9; k++) { var j = unit[k]; if (v[j] === d + 1) { n = 2; break; } if (!v[j] && (cand[j] & bit)) { n++; at = j; } }
          if (n === 1) { place(at, d + 1); did = true; }
        }
      }
      return did;
    }
    function cells(unit, bit) { var r = []; for (var k = 0; k < 9; k++) { var j = unit[k]; if (!v[j] && (cand[j] & bit)) r.push(j); } return r; }
    function elim(j, mask) { if (!v[j] && (cand[j] & mask)) { cand[j] &= ~mask; return true; } return false; }
    function level2() {
      var did = false, u, d, k;
      // 잠긴 후보: 상자 안 후보가 한 줄에만 → 그 줄의 상자 밖에서 지움 / 줄 안 후보가 한 상자에만 → 상자의 줄 밖에서 지움
      for (u = 0; u < 27; u++) {
        for (d = 0; d < 9; d++) {
          var bit = 1 << d, cs = cells(UNITS[u], bit);
          if (cs.length < 2 || cs.length > 3) continue;
          var targets = [];
          if (u >= 18) {
            if (cs.every(function (j) { return ROW[j] === ROW[cs[0]]; })) targets = UNITS[ROW[cs[0]]];
            else if (cs.every(function (j) { return COL[j] === COL[cs[0]]; })) targets = UNITS[9 + COL[cs[0]]];
          } else if (cs.every(function (j) { return BOX[j] === BOX[cs[0]]; })) targets = UNITS[18 + BOX[cs[0]]];
          for (k = 0; k < targets.length; k++) if (cs.indexOf(targets[k]) < 0 && elim(targets[k], bit)) did = true;
        }
      }
      if (did) return true;
      // naked pair
      for (u = 0; u < 27; u++) {
        var unit = UNITS[u];
        for (var a = 0; a < 9; a++) {
          var ja = unit[a];
          if (v[ja] || POP[cand[ja]] !== 2) continue;
          for (var b2 = a + 1; b2 < 9; b2++) {
            var jb = unit[b2];
            if (v[jb] || cand[jb] !== cand[ja]) continue;
            for (k = 0; k < 9; k++) if (k !== a && k !== b2 && elim(unit[k], cand[ja])) did = true;
          }
        }
      }
      if (did) return true;
      // hidden pair
      for (u = 0; u < 27; u++) {
        var un = UNITS[u], pos = [];
        for (d = 0; d < 9; d++) pos[d] = cells(un, 1 << d);
        for (var d1 = 0; d1 < 9; d1++) {
          if (pos[d1].length !== 2) continue;
          for (var d2 = d1 + 1; d2 < 9; d2++) {
            if (pos[d2].length !== 2 || pos[d2][0] !== pos[d1][0] || pos[d2][1] !== pos[d1][1]) continue;
            var keep = (1 << d1) | (1 << d2);
            pos[d1].forEach(function (j) { if (cand[j] & ~keep) { cand[j] &= keep; did = true; } });
          }
        }
      }
      return did;
    }
    function level3() {
      var did = false, u, k;
      // naked triple
      for (u = 0; u < 27; u++) {
        var unit = UNITS[u], open = [];
        for (k = 0; k < 9; k++) { var j = unit[k]; if (!v[j] && POP[cand[j]] <= 3) open.push(j); }
        for (var a = 0; a < open.length; a++) for (var b = a + 1; b < open.length; b++) for (var c = b + 1; c < open.length; c++) {
          var m = cand[open[a]] | cand[open[b]] | cand[open[c]];
          if (POP[m] !== 3) continue;
          for (k = 0; k < 9; k++) { var t = unit[k]; if (t !== open[a] && t !== open[b] && t !== open[c] && elim(t, m)) did = true; }
        }
      }
      if (did) return true;
      // X-Wing (줄 기준·열 기준)
      for (var d = 0; d < 9; d++) {
        var bit = 1 << d;
        for (var mode = 0; mode < 2; mode++) {
          var base = mode === 0 ? 0 : 9, other = mode === 0 ? 9 : 0, pairs = [];
          for (u = 0; u < 9; u++) {
            var cs = cells(UNITS[base + u], bit);
            if (cs.length === 2) pairs.push({ u: u, a: mode === 0 ? COL[cs[0]] : ROW[cs[0]], b: mode === 0 ? COL[cs[1]] : ROW[cs[1]] });
          }
          for (var p = 0; p < pairs.length; p++) for (var q = p + 1; q < pairs.length; q++) {
            if (pairs[p].a !== pairs[q].a || pairs[p].b !== pairs[q].b) continue;
            [pairs[p].a, pairs[p].b].forEach(function (line) {
              UNITS[other + line].forEach(function (j) {
                var at = mode === 0 ? ROW[j] : COL[j];
                if (at !== pairs[p].u && at !== pairs[q].u && elim(j, bit)) did = true;
              });
            });
          }
        }
      }
      return did;
    }
    for (var guard = 0; guard < 400 && left > 0; guard++) {
      if (singles()) continue;
      if (maxLevel >= 2 && level2()) { level = Math.max(level, 2); continue; }
      if (maxLevel >= 3 && level3()) { level = Math.max(level, 3); continue; }
      break;
    }
    void u; void d; void k;
    return left === 0 ? level : 4;
  }

  // ---------------------------------------------------------------- 생성기
  function makePuzzle(spec, rnd) {
    var sol = randomSolution(rnd);
    var puz = sol.slice(), clues = 81;
    var order = [];
    for (var i = 0; i <= 40; i++) order.push(i);   // 40 = 가운데 칸(혼자 대칭)
    shuffle(order, rnd);
    for (var o = 0; o < order.length && clues > spec.target; o++) {
      var a = order[o], b = 80 - a;
      var va = puz[a], vb = puz[b];
      puz[a] = 0; puz[b] = 0;
      var removed = a === b ? 1 : 2;
      var ok = countSolutions(puz, 2) === 1;
      if (ok && spec.maxLevel < 4) ok = grade(puz, spec.maxLevel) <= spec.maxLevel;
      if (ok) clues -= removed;
      else { puz[a] = va; puz[b] = vb; }
    }
    return { puzzle: puz, solution: sol, clues: clues };
  }
  // 난이도 + 시드 → { diff, seed, puzzle[81], solution[81], clues, level }
  function generate(diff, seed) {
    var spec = DIFFS[diff] || DIFFS.easy;
    if (seed == null) seed = Math.floor(Math.random() * 4294967296);
    seed = seed >>> 0;
    var rnd = mulberry32(seed);
    var best = null;
    for (var t = 0; t < spec.tries; t++) {
      var p = makePuzzle(spec, rnd);
      p.level = grade(p.puzzle, 3);
      if (!best || p.level > best.level || (p.level === best.level && p.clues < best.clues)) best = p;
      if (best.level >= spec.minLevel) break;
    }
    best.diff = DIFFS[diff] ? diff : 'easy';
    best.seed = seed;
    return best;
  }
  // 오늘의 퍼즐 시드: UTC 날짜(YYYY-MM-DD) + 난이도 → 모두 같은 퍼즐
  function utcDate(d) { d = d || new Date(); return d.toISOString().slice(0, 10); }
  function dailySeed(dateStr, diff) { return hashSeed('melgene-sudoku|' + dateStr + '|' + diff); }

  // ---------------------------------------------------------------- 판 상태 도우미
  function candidates(values, i) {
    if (values[i]) return 0;
    var m = ALL;
    for (var k = 0; k < 20; k++) { var p = values[PEERS[i][k]]; if (p) m &= ~(1 << (p - 1)); }
    return m;
  }
  // 같은 줄·열·상자에 같은 숫자가 둘 이상인 칸들 (규칙 충돌 — 정답과 비교하지 않는다)
  function conflicts(values) {
    var bad = [];
    for (var i = 0; i < 81; i++) {
      if (!values[i]) continue;
      for (var k = 0; k < 20; k++) if (values[PEERS[i][k]] === values[i]) { bad.push(i); break; }
    }
    return bad;
  }
  function isSolved(values, solution) { for (var i = 0; i < 81; i++) if (values[i] !== solution[i]) return false; return true; }
  function digitCounts(values) { var c = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; for (var i = 0; i < 81; i++) if (values[i]) c[values[i]]++; return c; }
  // 힌트로 채울 칸: 고른 칸(비었거나 틀림) → 틀린 칸 → 후보가 하나뿐인 칸 → 숨은 싱글 → 후보가 가장 적은 빈 칸
  function hintCell(values, solution, given, selected) {
    var i;
    if (selected != null && selected >= 0 && !given[selected] && values[selected] !== solution[selected]) return selected;
    for (i = 0; i < 81; i++) if (values[i] && values[i] !== solution[i]) return i;
    var clean = values.map(function (x, j) { return x === solution[j] ? x : 0; });
    var best = -1, bestN = 10;
    for (i = 0; i < 81; i++) {
      if (clean[i]) continue;
      var n = POP[candidates(clean, i)];
      if (n === 1) return i;
      if (n < bestN) { bestN = n; best = i; }
    }
    for (var u = 0; u < 27; u++) {
      for (var d = 0; d < 9; d++) {
        var at = -1, cnt = 0;
        for (var k = 0; k < 9; k++) { var j = UNITS[u][k]; if (clean[j] === d + 1) { cnt = 2; break; } if (!clean[j] && (candidates(clean, j) & (1 << d))) { cnt++; at = j; } }
        if (cnt === 1) return at;
      }
    }
    return best;
  }

  function toStr(arr) { return arr.map(function (x) { return x ? String(x) : '0'; }).join(''); }
  function fromStr(s) {
    if (typeof s !== 'string' || !/^[0-9]{81}$/.test(s)) return null;
    return s.split('').map(Number);
  }

  // ---------------------------------------------------------------- 서버 점수 분포
  function bucket(sec) {
    var s = Number(sec);
    if (!isFinite(s) || s < 0) s = 0;
    return clamp(MAX_BUCKET - Math.floor(s / BUCKET_STEP), 0, MAX_BUCKET);
  }
  function normalizeHist(rows) {
    if (!Array.isArray(rows)) return null;
    var map = {};
    rows.forEach(function (r) {
      if (!r || typeof r !== 'object') return;
      var b = Number(r.score_bucket != null ? r.score_bucket : r.bucket);
      var p = Number(r.players);
      if (!isFinite(b) || !isFinite(p) || p <= 0 || b < 0 || Math.floor(b) !== b) return;
      map[b] = (map[b] || 0) + Math.floor(p);
    });
    return Object.keys(map).map(Number).sort(function (a, b) { return a - b; })
      .map(function (b) { return { bucket: b, players: map[b] }; });
  }
  // 내 구간이 분포에서 어디쯤인지 (bucket 이 클수록 빠름). → { total, others, first, top, beatPct } / 실패 null
  function percentile(rows, myBucket) {
    var hist = normalizeHist(rows);
    if (!hist || myBucket == null || !isFinite(Number(myBucket))) return null;
    myBucket = Math.round(Number(myBucket));
    var lower = 0, same = 0, higher = 0;
    hist.forEach(function (h) {
      if (h.bucket < myBucket) lower += h.players;
      else if (h.bucket > myBucket) higher += h.players;
      else same += h.players;
    });
    if (same === 0) same = 1;
    var total = lower + same + higher;
    var others = total - 1;
    var base = { total: total, others: others, lower: lower, same: same, higher: higher };
    if (others <= 0) { base.first = true; return base; }
    var beat = (lower + (same - 1) / 2) / others;
    var topRaw = Math.round((1 - beat) * 1e6) / 1e4;
    base.first = false;
    base.beat = beat;
    base.top = clamp(Math.ceil(topRaw), 1, 100);
    base.beatPct = clamp(Math.floor(Math.round(beat * 1e6) / 1e4), 0, 100);
    return base;
  }

  return {
    DIFFS: DIFFS, DIFF_ORDER: DIFF_ORDER, MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP,
    ROW: ROW, COL: COL, BOX: BOX, UNITS: UNITS, PEERS: PEERS,
    mulberry32: mulberry32, hashSeed: hashSeed, countSolutions: countSolutions, solve: solve, randomSolution: randomSolution,
    grade: grade, generate: generate, utcDate: utcDate, dailySeed: dailySeed,
    candidates: candidates, conflicts: conflicts, isSolved: isSolved, digitCounts: digitCounts, hintCell: hintCell,
    toStr: toStr, fromStr: fromStr,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
}));
