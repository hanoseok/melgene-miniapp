/* apps/sweeper/sweeper-core.js — 지뢰찾기 규칙 (언어 무관, UMD: 브라우저 window.SWEEPER_CORE + Node require)
 * 칸 번호 = y * w + x. 지뢰는 첫 칸을 연 뒤에 깐다(첫 칸과 둘레 8칸에는 지뢰 없음 — 첫 클릭은 언제나 안전한 빈 칸).
 * 같은 시드 + 같은 첫 칸 = 같은 지뢰 배치(mulberry32).
 * 서버 점수 분포(supa.submitScore): 이긴 판만, 난이도마다 게임 이름 하나(sweeper-b/-i/-e), bucket = 2000 − 1 − round(초 × 2) → 클수록 빠름(0..1999).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SWEEPER_CORE = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DIFFS = {
    beginner: { w: 9, h: 9, mines: 10, game: 'sweeper-b' },
    intermediate: { w: 12, h: 12, mines: 24, game: 'sweeper-i' },
    expert: { w: 14, h: 14, mines: 40, game: 'sweeper-e' }
  };
  var DIFF_ORDER = ['beginner', 'intermediate', 'expert'];
  var MAX_BUCKET = 1999;
  var BUCKET_STEP = 0.5;   // 초

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

  // 새 판. status: ready(첫 칸 열기 전) → play → won | lost
  function newGame(diff, seed) {
    var d = typeof diff === 'string' ? DIFFS[diff] : diff;
    if (!d) throw new Error('unknown difficulty');
    var n = d.w * d.h;
    var s = {
      w: d.w, h: d.h, mineCount: d.mines, n: n,
      mine: new Uint8Array(n), adj: new Uint8Array(n), open: new Uint8Array(n), flag: new Uint8Array(n),
      status: 'ready', opened: 0, flags: 0, exploded: -1,
      seed: seed == null ? (Math.random() * 4294967296) >>> 0 : seed >>> 0
    };
    return s;
  }

  function neighbors(s, i) {
    var x = i % s.w, y = (i - x) / s.w, out = [];
    for (var dy = -1; dy <= 1; dy++) {
      for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < s.w && ny < s.h) out.push(ny * s.w + nx);
      }
    }
    return out;
  }

  // 첫 칸(둘레 포함 3×3)을 뺀 자리에 지뢰를 깐다
  function placeMines(s, first) {
    var rng = mulberry32(s.seed);
    var banned = {};
    banned[first] = true;
    neighbors(s, first).forEach(function (j) { banned[j] = true; });
    var cand = [];
    for (var i = 0; i < s.n; i++) if (!banned[i]) cand.push(i);
    // 후보가 모자라면(작은 판) 둘레 제한을 풀고 첫 칸만 뺀다
    if (cand.length < s.mineCount) {
      cand = [];
      for (var k = 0; k < s.n; k++) if (k !== first) cand.push(k);
    }
    for (var m = cand.length - 1; m > 0; m--) {
      var r = Math.floor(rng() * (m + 1));
      var t = cand[m]; cand[m] = cand[r]; cand[r] = t;
    }
    for (var c = 0; c < s.mineCount; c++) s.mine[cand[c]] = 1;
    for (var q = 0; q < s.n; q++) {
      if (s.mine[q]) continue;
      var cnt = 0;
      neighbors(s, q).forEach(function (j) { cnt += s.mine[j]; });
      s.adj[q] = cnt;
    }
  }

  function inRange(s, i) { return typeof i === 'number' && i >= 0 && i < s.n && Math.floor(i) === i; }

  // 빈 칸(숫자 0)이면 이어진 칸을 한꺼번에 연다 (반복문 — 큰 판에서도 재귀 한도 없음). 새로 열린 칸 목록을 돌려준다.
  function floodOpen(s, start) {
    var opened = [];
    var stack = [start];
    while (stack.length) {
      var i = stack.pop();
      if (s.open[i] || s.flag[i] || s.mine[i]) continue;
      s.open[i] = 1;
      s.opened++;
      opened.push(i);
      if (s.adj[i] === 0) {
        var nb = neighbors(s, i);
        for (var k = 0; k < nb.length; k++) if (!s.open[nb[k]] && !s.flag[nb[k]]) stack.push(nb[k]);
      }
    }
    return opened;
  }

  function finishIfWon(s) {
    if (s.status === 'play' && s.opened === s.n - s.mineCount) {
      s.status = 'won';
      for (var i = 0; i < s.n; i++) if (s.mine[i] && !s.flag[i]) { s.flag[i] = 1; s.flags++; }
    }
  }

  function lose(s, i) {
    s.status = 'lost';
    s.exploded = i;
  }

  // 칸 열기. 반환 { ok, started, opened:[칸…], boom, status }. 깃발·이미 열린 칸·끝난 판은 ok:false.
  function reveal(s, i) {
    var res = { ok: false, started: false, opened: [], boom: false, status: s.status };
    if (!inRange(s, i) || s.status === 'won' || s.status === 'lost' || s.open[i] || s.flag[i]) return res;
    if (s.status === 'ready') {
      placeMines(s, i);
      s.status = 'play';
      res.started = true;
    }
    res.ok = true;
    if (s.mine[i]) {
      lose(s, i);
      res.boom = true;
    } else {
      res.opened = floodOpen(s, i);
      finishIfWon(s);
    }
    res.status = s.status;
    return res;
  }

  // 깃발 켜기/끄기. 열린 칸·끝난 판·첫 칸 열기 전에는 안 된다(전에는 열 곳을 고르는 단계).
  function toggleFlag(s, i) {
    if (!inRange(s, i) || s.status !== 'play' || s.open[i]) return false;
    if (s.flag[i]) { s.flag[i] = 0; s.flags--; } else { s.flag[i] = 1; s.flags++; }
    return true;
  }

  // 숫자 칸 코드(chord): 둘레 깃발 수 = 숫자이면 깃발 아닌 둘레 칸을 모두 연다 (깃발이 틀렸으면 터진다)
  function chord(s, i) {
    var res = { ok: false, opened: [], boom: false, status: s.status };
    if (!inRange(s, i) || s.status !== 'play' || !s.open[i] || s.adj[i] === 0) return res;
    var nb = neighbors(s, i);
    var f = 0;
    nb.forEach(function (j) { f += s.flag[j]; });
    if (f !== s.adj[i]) return res;
    res.ok = true;
    for (var k = 0; k < nb.length; k++) {
      var j = nb[k];
      if (s.open[j] || s.flag[j]) continue;
      if (s.mine[j]) { lose(s, j); res.boom = true; break; }
      res.opened = res.opened.concat(floodOpen(s, j));
    }
    if (!res.boom) finishIfWon(s);
    res.status = s.status;
    return res;
  }

  function minesLeft(s) { return s.mineCount - s.flags; }
  function progress(s) { return s.n === s.mineCount ? 0 : s.opened / (s.n - s.mineCount); }
  // 틀리게 꽂은 깃발 칸 (졌을 때 ✗ 표시)
  function wrongFlags(s) {
    var out = [];
    for (var i = 0; i < s.n; i++) if (s.flag[i] && !s.mine[i]) out.push(i);
    return out;
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (brick 과 같은 방식)
  function bucket(seconds) {
    var n = Math.round(Number(seconds) / BUCKET_STEP);
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
    DIFFS: DIFFS, DIFF_ORDER: DIFF_ORDER, MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP,
    mulberry32: mulberry32, newGame: newGame, neighbors: neighbors, reveal: reveal, toggleFlag: toggleFlag, chord: chord,
    minesLeft: minesLeft, progress: progress, wrongFlags: wrongFlags,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
}));
