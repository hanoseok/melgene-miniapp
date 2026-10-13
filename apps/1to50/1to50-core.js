/* apps/1to50/1to50-core.js — 1to50 규칙 (언어 무관, UMD: 브라우저 window.ONE50_CORE + Node require)
 * 5×5 판(칸 번호 0..24)에 1..25 를 섞어 놓는다. 다음 숫자(next)를 누르면:
 *   - classic(1→50): 1..25 를 누르면 그 칸에 26..50 중 하나(미리 섞은 줄에서 차례로)가 나온다. 26..50 을 누르면 칸이 빈다.
 *   - quick(1→25):   누른 칸이 바로 빈다.
 * 다른 숫자를 누르면 실수(mistakes + 1) — 시간 벌점 PENALTY_MS(0.5초)를 더한다. 빈 칸을 누르면 아무 일도 없다(벌점 없음).
 * 같은 시드 = 같은 판(mulberry32). 브라우저는 crypto 난수 시드를 쓴다.
 * 서버 점수 분포(supa.submitScore): 모드마다 game 이름 하나(1to50-50 / 1to50-25), bucket = 1999 − round(초 × 10) → 클수록 빠름(0..1999, 0.1초 단위).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ONE50_CORE = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SIZE = 5;
  var CELLS = SIZE * SIZE;
  var MODES = {
    classic: { max: 50, game: '1to50-50', minSec: 6 },
    quick: { max: 25, game: '1to50-25', minSec: 3 }
  };
  var MODE_ORDER = ['classic', 'quick'];
  var PENALTY_MS = 500;
  var MAX_BUCKET = 1999;
  var BUCKET_STEP = 0.1;   // 초

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
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function range(a, b) { var out = []; for (var i = a; i <= b; i++) out.push(i); return out; }

  // 새 판. status: play → done
  function newGame(mode, seed) {
    var m = MODES[mode];
    if (!m) throw new Error('unknown mode');
    var rnd = mulberry32(seed == null ? Math.floor(Math.random() * 4294967296) : seed);
    return {
      mode: mode,
      max: m.max,
      cells: shuffle(range(1, CELLS), rnd),
      queue: m.max > CELLS ? shuffle(range(CELLS + 1, m.max), rnd) : [],
      next: 1,
      mistakes: 0,
      taps: 0,
      status: 'play'
    };
  }

  // 칸 i 를 눌렀다. → { ok, correct, wrong, blank, value, replaced, done }
  function tap(s, i) {
    if (!s || s.status !== 'play' || typeof i !== 'number' || i < 0 || i >= CELLS || Math.floor(i) !== i) return { ok: false };
    var v = s.cells[i];
    if (!v) return { ok: false, blank: true };
    s.taps++;
    if (v !== s.next) {
      s.mistakes++;
      return { ok: true, wrong: true, value: v };
    }
    var nv = 0;
    if (v <= CELLS && s.queue.length) nv = s.queue.shift();
    s.cells[i] = nv;
    s.next++;
    var done = s.next > s.max;
    if (done) s.status = 'done';
    return { ok: true, correct: true, value: v, replaced: nv, done: done };
  }

  function indexOf(s, n) { return s.cells.indexOf(n); }
  function progress(s) { return clamp((s.next - 1) / s.max, 0, 1); }
  function penaltyMs(s) { return s.mistakes * PENALTY_MS; }
  function plausible(mode, sec) { var m = MODES[mode]; return !!m && isFinite(sec) && sec >= m.minSec; }

  // ---------------------------------------------------------------- 서버 점수 분포 (sweeper·brick 과 같은 방식)
  function bucket(seconds) {
    var n = Math.round(Number(seconds) * Math.round(1 / BUCKET_STEP));
    return isFinite(n) ? MAX_BUCKET - clamp(n, 0, MAX_BUCKET) : 0;
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
  // 내 구간이 분포에서 어디쯤인지 (bucket 이 클수록 빠름). → { total, others, first, top, beatPct, … } / 실패 null
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
    SIZE: SIZE, CELLS: CELLS, MODES: MODES, MODE_ORDER: MODE_ORDER, PENALTY_MS: PENALTY_MS,
    MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP,
    mulberry32: mulberry32, newGame: newGame, tap: tap, indexOf: indexOf, progress: progress, penaltyMs: penaltyMs, plausible: plausible,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
}));
