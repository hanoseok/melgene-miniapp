/* apps/game2048/game2048-core.js — 2048 규칙 (언어 무관, UMD: 브라우저 window.G2048_CORE + Node 검사 공용)
 *
 * 판: 4×4 칸(grid[r*4+c] = null | { id, v }). 밀기(left/right/up/down)마다 모든 타일이 그쪽 끝으로 미끄러지고,
 *   같은 숫자 두 개가 만나면 한 번만 합쳐진다(합쳐진 타일은 그 밀기에서 다시 합쳐지지 않음). 합친 값만큼 점수.
 *   무언가 움직였을 때만 빈 칸 하나에 새 타일(90% 2 · 10% 4)이 나온다.
 * 목표: 2048 타일(GOAL)을 만들면 won(한 번만 justWon). 계속할 수 있다. 빈 칸도 없고 이웃끼리 같은 숫자도 없으면 끝(over).
 * 시드 난수(mulberry32, 상태는 s.rng) — 같은 시드 + 같은 입력 = 같은 판(재현).
 * move() 결과는 화면 애니메이션용: slides(원래 타일 → 도착 칸), merged(새로 생긴 합친 타일), removed(사라지는 원래 타일 id), spawn.
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 20) (0..1999 — 서버 한도 2000 구간 안, 약 40,000점까지).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.G2048_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SIZE = 4;
  var GOAL = 2048;
  var GAME = 'game2048';     // 서버 점수 분포 이름
  var MAX_BUCKET = 1999;
  var BUCKET_STEP = 20;
  var FOUR_CHANCE = 0.1;
  var DIRS = ['left', 'right', 'up', 'down'];

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // mulberry32 (상태는 s.rng 에)
  function rnd(s) {
    var a = (s.rng = (s.rng + 0x6D2B79F5) >>> 0);
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function newGame(seed) {
    if (seed == null || !isFinite(Number(seed))) seed = Math.floor(Math.random() * 4294967296);
    var s = {
      seed: seed >>> 0, rng: seed >>> 0,
      grid: [], nextId: 1,
      score: 0, moves: 0, maxTile: 0,
      won: false, over: false
    };
    for (var i = 0; i < SIZE * SIZE; i++) s.grid.push(null);
    spawn(s);
    spawn(s);
    return s;
  }

  // 빈 칸 하나에 새 타일. → { id, v, r, c } / 빈 칸 없음 null
  function spawn(s) {
    var empty = [];
    for (var i = 0; i < s.grid.length; i++) if (!s.grid[i]) empty.push(i);
    if (!empty.length) return null;
    var at = empty[Math.floor(rnd(s) * empty.length)];
    var v = rnd(s) < FOUR_CHANCE ? 4 : 2;
    var t = { id: s.nextId++, v: v };
    s.grid[at] = t;
    if (v > s.maxTile) s.maxTile = v;
    return { id: t.id, v: v, r: Math.floor(at / SIZE), c: at % SIZE };
  }

  // 한 줄의 칸 번호(밀리는 쪽 끝부터)
  function lineCells(dir, k) {
    var out = [];
    for (var j = 0; j < SIZE; j++) {
      if (dir === 'left') out.push(k * SIZE + j);
      else if (dir === 'right') out.push(k * SIZE + (SIZE - 1 - j));
      else if (dir === 'up') out.push(j * SIZE + k);
      else out.push((SIZE - 1 - j) * SIZE + k);
    }
    return out;
  }

  // 밀기. 아무것도 안 움직이면 null (상태 그대로). 움직이면 상태를 바꾸고
  //   → { dir, gained, slides: [{id, r, c}], merged: [{id, v, r, c, from: [id, id]}], removed: [id], spawn, justWon, over }
  function move(s, dir) {
    if (!s || s.over || DIRS.indexOf(dir) < 0) return null;
    var next = [];
    for (var i = 0; i < s.grid.length; i++) next.push(null);
    var slides = [], merged = [], removed = [];
    var gained = 0, changed = false;
    for (var k = 0; k < SIZE; k++) {
      var cells = lineCells(dir, k);
      var pos = 0;
      var last = null; // 이 줄에서 마지막으로 놓인 타일 { t, at, fresh }
      for (var j = 0; j < SIZE; j++) {
        var from = cells[j];
        var t = s.grid[from];
        if (!t) continue;
        if (last && !last.merged && last.t.v === t.v) {
          var at = last.at;
          var v = t.v * 2;
          var nt = { id: s.nextId++, v: v };
          slides.push({ id: t.id, r: Math.floor(at / SIZE), c: at % SIZE });
          removed.push(last.t.id, t.id);
          merged.push({ id: nt.id, v: v, r: Math.floor(at / SIZE), c: at % SIZE, from: [last.t.id, t.id] });
          next[at] = nt;
          last.merged = true;
          last.t = nt;
          gained += v;
          changed = true;
          if (v > s.maxTile) s.maxTile = v;
        } else {
          var to = cells[pos++];
          next[to] = t;
          if (to !== from) changed = true;
          slides.push({ id: t.id, r: Math.floor(to / SIZE), c: to % SIZE });
          last = { t: t, at: to, merged: false };
        }
      }
    }
    if (!changed) return null;
    s.grid = next;
    s.score += gained;
    s.moves++;
    var sp = spawn(s);
    var justWon = false;
    if (!s.won && s.maxTile >= GOAL) { s.won = true; justWon = true; }
    s.over = !canMove(s);
    return { dir: dir, gained: gained, slides: slides, merged: merged, removed: removed, spawn: sp, justWon: justWon, over: s.over };
  }

  function canMove(s) {
    for (var r = 0; r < SIZE; r++) {
      for (var c = 0; c < SIZE; c++) {
        var t = s.grid[r * SIZE + c];
        if (!t) return true;
        if (c + 1 < SIZE) { var a = s.grid[r * SIZE + c + 1]; if (!a || a.v === t.v) return true; }
        if (r + 1 < SIZE) { var b = s.grid[(r + 1) * SIZE + c]; if (!b || b.v === t.v) return true; }
      }
    }
    return false;
  }

  // 화면용: 지금 판의 타일 목록
  function tiles(s) {
    var out = [];
    for (var i = 0; i < s.grid.length; i++) {
      var t = s.grid[i];
      if (t) out.push({ id: t.id, v: t.v, r: Math.floor(i / SIZE), c: i % SIZE });
    }
    return out;
  }

  // ---------------------------------------------------------------- 서버 점수 분포
  function bucket(score) {
    var n = Math.round(Number(score) / BUCKET_STEP);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }
  // Supabase 응답 [{ score_bucket, players }] → [{ bucket, players }] (정렬, 같은 구간 합치기, 잘못된 행 버리기)
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
  // 내 구간(myBucket)이 분포에서 어디쯤인지 (높을수록 좋음). 내 기록은 이미 분포에 들어 있다고 본다(없으면 한 명 더함).
  //   → { total, others, lower, same, higher, first, beat(0..1), top(1..100), beatPct(0..100) } / 실패 null
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
    SIZE: SIZE, GOAL: GOAL, GAME: GAME, MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP, DIRS: DIRS,
    newGame: newGame, spawn: spawn, move: move, canMove: canMove, tiles: tiles,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
