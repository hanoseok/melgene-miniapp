/* apps/memory/memory-core.js — 카드 짝 맞추기 규칙 (언어 무관, UMD: 브라우저 window.MEMORY_CORE + Node require)
 * 판 = 같은 그림 두 장씩(pairs 쌍)을 섞어 cols × rows 칸에 놓는다. 그림(SYMBOLS 12개) 중 판에 쓸 것도 무작위로 고른다.
 * 섞기: 편향 없는 Fisher–Yates. 난수 = randInt(n)(0..n-1 정수) — 브라우저는 crypto.getRandomValues + 거부 샘플링(cryptoRandInt).
 * 한 수(move) = 카드 두 장을 뒤집는 것. 같은 그림이면 짝(matched), 다르면 잠깐 보여 준 뒤 다시 엎는다(앱이 hideMismatch 를 부름 —
 *   그 전에 다른 카드를 누르면 바로 엎고 새 카드를 뒤집는다). 모든 짝을 찾으면 done.
 * 정확도 = 짝 수 ÷ 수(move) × 100 (모두 한 번에 맞히면 100%).
 * 서버 점수 분포(supa.submitScore): 난이도마다 game 이름 하나(memory-easy / memory-normal / memory-hard),
 *   bucket = 9999 − round(초 × 10) → 클수록 빠름(0..9999, 0.1초 단위).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MEMORY_CORE = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // 할로윈 그림 12개 (ZWJ 묶음 없이 한 글자짜리만 — 기기마다 깨지지 않게)
  var SYMBOLS = ['🎃', '👻', '🦇', '🍬', '🕷️', '🧙', '💀', '🍭', '🌕', '🔮', '🧛', '🍫'];
  var LEVELS = {
    easy: { cols: 4, rows: 3, pairs: 6, game: 'memory-easy', minSec: 4 },
    normal: { cols: 4, rows: 4, pairs: 8, game: 'memory-normal', minSec: 6 },
    hard: { cols: 4, rows: 6, pairs: 12, game: 'memory-hard', minSec: 9 }
  };
  var LEVEL_ORDER = ['easy', 'normal', 'hard'];
  var MAX_BUCKET = 9999;
  var BUCKET_STEP = 0.1;   // 초

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // crypto 난수로 0..n-1 정수 (거부 샘플링 — 나머지 편향 없음)
  function cryptoRandInt(n) {
    n = Math.floor(n);
    if (!(n > 0) || n > 4294967296) throw new Error('bad range');
    var c = (typeof globalThis !== 'undefined' && globalThis.crypto) || (typeof self !== 'undefined' && self.crypto) || null;
    if (!c || !c.getRandomValues) return Math.floor(Math.random() * n);
    var lim = 4294967296 - (4294967296 % n);   // 이 값 이상은 버린다
    var a = new Uint32Array(1);
    for (;;) {
      c.getRandomValues(a);
      if (a[0] < lim) return a[0] % n;
    }
  }
  // 시드 난수(검사용): mulberry32 → randInt
  function seededRandInt(seed) {
    var a = seed >>> 0;
    return function (n) {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * n);
    };
  }
  // 편향 없는 Fisher–Yates (제자리)
  function shuffle(arr, randInt) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = randInt(i + 1);
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // 새 판. randInt 를 안 주면 crypto. status: play → done
  function newGame(level, randInt) {
    var L = LEVELS[level];
    if (!L) throw new Error('unknown level');
    var rnd = randInt || cryptoRandInt;
    var pick = shuffle(SYMBOLS.map(function (_, i) { return i; }), rnd).slice(0, L.pairs);
    var deck = [];
    pick.forEach(function (k) { deck.push(k, k); });
    shuffle(deck, rnd);
    return {
      level: level,
      cols: L.cols,
      rows: L.rows,
      pairs: L.pairs,
      cards: deck.map(function (k) { return { sym: k, up: false, matched: false }; }),
      open: [],          // 지금 앞면인(아직 짝이 안 된) 카드 번호 (0..2)
      moves: 0,
      found: 0,
      flips: 0,
      status: 'play'
    };
  }

  // 틀린 두 장을 다시 엎는다. → 엎은 카드 번호 배열
  function hideMismatch(s) {
    if (!s || s.open.length !== 2) return [];
    var a = s.open[0], b = s.open[1];
    if (s.cards[a].sym === s.cards[b].sym) return [];
    s.cards[a].up = false;
    s.cards[b].up = false;
    s.open = [];
    return [a, b];
  }

  // 카드 i 를 뒤집는다. → { ok, first, match, mismatch, hidden, done, pair }
  function flip(s, i) {
    if (!s || s.status !== 'play' || typeof i !== 'number' || Math.floor(i) !== i || i < 0 || i >= s.cards.length) return { ok: false };
    var c = s.cards[i];
    if (c.matched || c.up) return { ok: false };
    var hidden = [];
    if (s.open.length === 2) hidden = hideMismatch(s);   // 틀린 두 장이 아직 보이면 바로 엎고 이어서
    c.up = true;
    s.flips++;
    if (s.open.length === 0) {
      s.open = [i];
      return { ok: true, first: true, hidden: hidden };
    }
    var j = s.open[0];
    s.moves++;
    if (s.cards[j].sym === c.sym) {
      s.cards[j].matched = true;
      c.matched = true;
      s.open = [];
      s.found++;
      var done = s.found === s.pairs;
      if (done) s.status = 'done';
      return { ok: true, match: true, pair: [j, i], hidden: hidden, done: done };
    }
    s.open = [j, i];
    return { ok: true, mismatch: true, pair: [j, i], hidden: hidden };
  }

  function accuracy(s) { return s && s.moves ? Math.round((s.found / s.moves) * 100) : 0; }
  function progress(s) { return s ? clamp(s.found / s.pairs, 0, 1) : 0; }
  function plausible(level, sec, moves) {
    var L = LEVELS[level];
    return !!L && isFinite(sec) && sec >= L.minSec && (moves == null || (isFinite(moves) && moves >= L.pairs));
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (1to50·sweeper 와 같은 방식)
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
    SYMBOLS: SYMBOLS, LEVELS: LEVELS, LEVEL_ORDER: LEVEL_ORDER, MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP,
    cryptoRandInt: cryptoRandInt, seededRandInt: seededRandInt, shuffle: shuffle,
    newGame: newGame, flip: flip, hideMismatch: hideMismatch, accuracy: accuracy, progress: progress, plausible: plausible,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
}));
