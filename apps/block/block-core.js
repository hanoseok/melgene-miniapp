/* apps/block/block-core.js — 블록 퍼즐(8×8) 로직 (언어 무관, UMD: 브라우저 window.BLOCK_CORE + Node 검사 공용)
 *
 * 판: 8×8, board[r * 8 + c] = 0(빈칸) 또는 색 번호 1..COLORS.
 * 조각(PIECES): { id, fam, cells: [[r, c] …](왼쪽 위 0,0 기준 정규화), h, w, n(칸 수), color }.
 *   가족(FAMILIES)마다 회전한 모양을 모두 만들고(중복 제거), 가족 가중치를 회전 수로 나눠 나눈다.
 *   점 1칸 · 직선 2~5칸(가로·세로) · 2×2 · 3×3 · 2×3 직사각형 · 작은 ㄱ(3칸) · L·J(4칸) · 큰 ㄱ(5칸) · T · S · Z.
 * 한 손 = 조각 3개(hand[0..2], 놓은 자리는 null). 3개를 모두 놓으면 새로 3개를 준다.
 *   나눠 줄 때 3개 중 하나도 들어갈 자리가 없으면 REROLLS 번까지 다시 뽑는다(공정하지만 늘 쉬운 건 아님). 빈 판에서는 언제나 들어간다.
 * 놓기 place(s, slot, r, c): (r, c) = 조각 왼쪽 위 칸. 놓은 뒤 가득 찬 가로줄과 세로줄을 **동시에** 지운다(가로·세로가 겹친 칸도 한 번만).
 * 점수 = 놓은 칸 수 + 줄 보너스. 줄 보너스 = lineBonus(지운 줄 수 k) × 콤보.
 *   lineBonus(k) = 10 × k(k+1)/2  → 1줄 10, 2줄 30, 3줄 60, 4줄 100 …
 *   콤보: 줄을 지운 놓기마다 +1(곱하기 = 그 값). 줄을 못 지운 놓기가 COMBO_GRACE(3) 번 이어지면 0 으로.
 * 끝: 남은 조각 중 어느 것도 판에 들어갈 자리가 없을 때(over = true). 점수는 언제나 정수.
 * 같은 시드 + 같은 놓기 = 같은 판(mulberry32).
 * bot(s): 욕심쟁이 자동 플레이(검사·흐름 검사용) — 지우는 줄·남은 조각이 들어갈지·외톨이 빈칸을 따진다.
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 20) (0..1999).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BLOCK_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var N = 8;
  var COMBO_GRACE = 3;
  var REROLLS = 3;
  var GAME = 'block';
  var BUCKET_STEP = 20;
  var MAX_BUCKET = 1999;
  var COLORS = 7;

  // 가족: 기본 모양 · 가중치 · 색
  var FAMILIES = [
    { fam: 'dot', w: 3, color: 7, cells: [[0, 0]] },
    { fam: 'i2', w: 6, color: 5, cells: [[0, 0], [0, 1]] },
    { fam: 'i3', w: 7, color: 5, cells: [[0, 0], [0, 1], [0, 2]] },
    { fam: 'i4', w: 6, color: 4, cells: [[0, 0], [0, 1], [0, 2], [0, 3]] },
    { fam: 'i5', w: 4, color: 4, cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
    { fam: 'o2', w: 7, color: 2, cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    { fam: 'o3', w: 3, color: 1, cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
    { fam: 'r23', w: 3, color: 1, cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]] },
    { fam: 'v3', w: 7, color: 3, cells: [[0, 0], [1, 0], [1, 1]] },
    { fam: 'l4', w: 6, color: 6, cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
    { fam: 'j4', w: 6, color: 6, cells: [[0, 1], [1, 1], [2, 1], [2, 0]] },
    { fam: 'v5', w: 4, color: 3, cells: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]] },
    { fam: 't4', w: 6, color: 2, cells: [[0, 0], [0, 1], [0, 2], [1, 1]] },
    { fam: 's4', w: 4, color: 7, cells: [[0, 1], [0, 2], [1, 0], [1, 1]] },
    { fam: 'z4', w: 4, color: 7, cells: [[0, 0], [0, 1], [1, 1], [1, 2]] }
  ];

  function normalize(cells) {
    var minR = Infinity, minC = Infinity;
    cells.forEach(function (p) { if (p[0] < minR) minR = p[0]; if (p[1] < minC) minC = p[1]; });
    return cells.map(function (p) { return [p[0] - minR, p[1] - minC]; })
      .sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
  }
  function keyOf(cells) { return cells.map(function (p) { return p[0] + '.' + p[1]; }).join('|'); }
  function rotate(cells) { return normalize(cells.map(function (p) { return [p[1], -p[0]]; })); }

  var PIECES = [];
  FAMILIES.forEach(function (F) {
    var seen = {}, list = [], cur = normalize(F.cells);
    for (var i = 0; i < 4; i++) {
      var k = keyOf(cur);
      if (!seen[k]) { seen[k] = 1; list.push(cur); }
      cur = rotate(cur);
    }
    list.forEach(function (cells, i) {
      var h = 0, w = 0;
      cells.forEach(function (p) { h = Math.max(h, p[0] + 1); w = Math.max(w, p[1] + 1); });
      PIECES.push({ id: F.fam + '-' + i, fam: F.fam, cells: cells, h: h, w: w, n: cells.length, color: F.color, weight: F.w / list.length });
    });
  });
  var TOTAL_W = PIECES.reduce(function (a, p) { return a + p.weight; }, 0);
  var BY_ID = {};
  PIECES.forEach(function (p, i) { p.index = i; BY_ID[p.id] = p; });

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
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function emptyBoard() { var b = []; for (var i = 0; i < N * N; i++) b.push(0); return b; }

  function canPlace(board, piece, r, c) {
    if (!piece || r < 0 || c < 0 || r + piece.h > N || c + piece.w > N) return false;
    for (var i = 0; i < piece.cells.length; i++) {
      if (board[(r + piece.cells[i][0]) * N + c + piece.cells[i][1]]) return false;
    }
    return true;
  }
  function positions(board, piece) {
    var out = [];
    if (!piece) return out;
    for (var r = 0; r + piece.h <= N; r++) for (var c = 0; c + piece.w <= N; c++) if (canPlace(board, piece, r, c)) out.push([r, c]);
    return out;
  }
  function fits(board, piece) {
    if (!piece) return false;
    for (var r = 0; r + piece.h <= N; r++) for (var c = 0; c + piece.w <= N; c++) if (canPlace(board, piece, r, c)) return true;
    return false;
  }
  function anyFits(board, hand) {
    for (var i = 0; i < hand.length; i++) if (hand[i] && fits(board, hand[i])) return true;
    return false;
  }

  // 놓은 뒤 가득 찬 줄 찾기(지우지는 않음)
  function fullLines(board) {
    var rows = [], cols = [], r, c, full;
    for (r = 0; r < N; r++) { full = true; for (c = 0; c < N; c++) if (!board[r * N + c]) { full = false; break; } if (full) rows.push(r); }
    for (c = 0; c < N; c++) { full = true; for (r = 0; r < N; r++) if (!board[r * N + c]) { full = false; break; } if (full) cols.push(c); }
    return { rows: rows, cols: cols };
  }
  // 가로·세로 줄을 동시에 지운다. 돌려주는 값 = 지운 칸 인덱스(중복 없음)
  function clearLines(board, lines) {
    var gone = {}, list = [];
    lines.rows.forEach(function (r) { for (var c = 0; c < N; c++) gone[r * N + c] = 1; });
    lines.cols.forEach(function (c) { for (var r = 0; r < N; r++) gone[r * N + c] = 1; });
    Object.keys(gone).forEach(function (k) { list.push(Number(k)); board[Number(k)] = 0; });
    return list.sort(function (a, b) { return a - b; });
  }
  function lineBonus(k) { return k > 0 ? 10 * k * (k + 1) / 2 : 0; }

  function pick(s) {
    var x = s.rnd() * TOTAL_W;
    for (var i = 0; i < PIECES.length; i++) { x -= PIECES[i].weight; if (x < 0) return PIECES[i]; }
    return PIECES[PIECES.length - 1];
  }
  function deal(s) {
    var hand;
    for (var t = 0; t <= REROLLS; t++) {
      hand = [pick(s), pick(s), pick(s)];
      if (anyFits(s.board, hand)) break;
    }
    s.hand = hand;
    s.deals++;
    return hand;
  }

  function newGame(seed) {
    if (seed == null) seed = (Math.random() * 4294967296) >>> 0;
    var s = {
      seed: seed >>> 0, rnd: mulberry32(seed), board: emptyBoard(), hand: [null, null, null],
      score: 0, lines: 0, clears: 0, combo: 0, bestCombo: 0, miss: 0, placed: 0, deals: 0, over: false
    };
    deal(s);
    s.over = !anyFits(s.board, s.hand);
    return s;
  }

  /* 놓기. 안 되면 null. 되면 { slot, piece, r, c, cells: [칸 인덱스], rows, cols, cleared: [칸 인덱스], k, combo, mult, gained, bonus, dealt, over } */
  function place(s, slot, r, c) {
    if (s.over) return null;
    var piece = s.hand[slot];
    if (!piece || !canPlace(s.board, piece, r, c)) return null;
    var cells = piece.cells.map(function (p) { var i = (r + p[0]) * N + c + p[1]; s.board[i] = piece.color; return i; });
    s.hand[slot] = null;
    s.placed++;
    var lines = fullLines(s.board);
    var k = lines.rows.length + lines.cols.length;
    var cleared = k ? clearLines(s.board, lines) : [];
    var bonus = 0, mult = 0;
    if (k) {
      s.combo++;
      s.miss = 0;
      mult = s.combo;
      bonus = lineBonus(k) * mult;
      s.lines += k;
      s.clears++;
      if (s.combo > s.bestCombo) s.bestCombo = s.combo;
    } else {
      s.miss++;
      if (s.miss >= COMBO_GRACE) s.combo = 0;
    }
    var gained = piece.n + bonus;
    s.score += gained;
    var dealt = false;
    if (!s.hand[0] && !s.hand[1] && !s.hand[2]) { deal(s); dealt = true; }
    s.over = !anyFits(s.board, s.hand);
    return { slot: slot, piece: piece, r: r, c: c, cells: cells, rows: lines.rows, cols: lines.cols, cleared: cleared, k: k,
      combo: s.combo, mult: mult, bonus: bonus, gained: gained, dealt: dealt, over: s.over };
  }

  // 미리보기: 놓으면 지워질 줄 (판은 바꾸지 않음)
  function previewLines(board, piece, r, c) {
    if (!canPlace(board, piece, r, c)) return null;
    var b = board.slice();
    piece.cells.forEach(function (p) { b[(r + p[0]) * N + c + p[1]] = piece.color; });
    return fullLines(b);
  }

  // ---------------------------------------------------------------- 욕심쟁이 자동 플레이
  function isolated(board) {
    var n = 0;
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (board[r * N + c]) continue;
      var open = 0;
      if (r > 0 && !board[(r - 1) * N + c]) open++;
      if (r < N - 1 && !board[(r + 1) * N + c]) open++;
      if (c > 0 && !board[r * N + c - 1]) open++;
      if (c < N - 1 && !board[r * N + c + 1]) open++;
      if (open === 0) n++;
    }
    return n;
  }
  function filled(board) { var n = 0; for (var i = 0; i < board.length; i++) if (board[i]) n++; return n; }
  // 3×3 이 들어갈 자리 수(큰 조각 대비)
  function bigRoom(board) { var p = BY_ID['o3-0'], n = 0; for (var r = 0; r <= N - 3; r++) for (var c = 0; c <= N - 3; c++) if (canPlace(board, p, r, c)) n++; return n; }

  function evaluate(s, slot, r, c) {
    var piece = s.hand[slot];
    var b = s.board.slice();
    piece.cells.forEach(function (p) { b[(r + p[0]) * N + c + p[1]] = piece.color; });
    var lines = fullLines(b);
    var k = lines.rows.length + lines.cols.length;
    if (k) clearLines(b, lines);
    var rest = s.hand.filter(function (h, i) { return h && i !== slot; });
    var stuck = 0;
    rest.forEach(function (h) { if (!fits(b, h)) stuck++; });
    return k * 120 + piece.n * 2 - isolated(b) * 25 - filled(b) * 1.5 + Math.min(bigRoom(b), 6) * 6 - stuck * 600;
  }
  function bot(s) {
    var best = null;
    for (var slot = 0; slot < 3; slot++) {
      var piece = s.hand[slot];
      if (!piece) continue;
      var ps = positions(s.board, piece);
      for (var i = 0; i < ps.length; i++) {
        var v = evaluate(s, slot, ps[i][0], ps[i][1]);
        if (!best || v > best.v) best = { slot: slot, r: ps[i][0], c: ps[i][1], v: v };
      }
    }
    return best;
  }

  // ---------------------------------------------------------------- 서버 점수 분포
  function bucket(score) {
    var n = Math.round(Number(score) / BUCKET_STEP);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }
  function normalizeHist(rows) {
    if (!Array.isArray(rows)) return null;
    var map = {};
    rows.forEach(function (r) {
      if (!r) return;
      var b = Number(r.score_bucket != null ? r.score_bucket : r.bucket);
      var n = Number(r.players);
      if (!isFinite(b) || !isFinite(n) || n <= 0 || b < 0) return;
      b = Math.round(b);
      map[b] = (map[b] || 0) + Math.round(n);
    });
    return Object.keys(map).map(Number).sort(function (a, b) { return a - b; })
      .map(function (b) { return { bucket: b, players: map[b] }; });
  }
  /* 분포에서 내 위치 (rows = 내 점수를 넣은 뒤의 전체 분포). 같은 구간은 절반만 이긴 것으로.
   * 다른 사람이 없으면 { first: true }(화면에는 숨김). rows 가 배열이 아니면(실패) null. */
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
    N: N, COMBO_GRACE: COMBO_GRACE, REROLLS: REROLLS, GAME: GAME, BUCKET_STEP: BUCKET_STEP, MAX_BUCKET: MAX_BUCKET, COLORS: COLORS,
    FAMILIES: FAMILIES, PIECES: PIECES, BY_ID: BY_ID,
    mulberry32: mulberry32, emptyBoard: emptyBoard, canPlace: canPlace, positions: positions, fits: fits, anyFits: anyFits,
    fullLines: fullLines, clearLines: clearLines, lineBonus: lineBonus, deal: deal, newGame: newGame, place: place,
    previewLines: previewLines, bot: bot, isolated: isolated,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
