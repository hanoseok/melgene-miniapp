/* apps/aim/aim-core.js — 에임 연습(Aim Trainer) 로직 (언어 무관, UMD: 브라우저 window.AIM_CORE + Node 검사 공용)
 *
 * 모드 두 개:
 *   classic — 과녁 30개를 하나씩 맞힌다. 점수 = 과녁 하나당 평균 시간(ms, 낮을수록 좋음).
 *   timed   — 30초 동안 최대한 많이 맞힌다. 과녁은 시간이 지나면 조금씩 작아지다가(MIN_SCALE) 수명이 끝나면 사라지고(놓침),
 *             수명은 판이 진행될수록 짧아진다(LIFE_START → LIFE_END). 점수 = 맞힌 수(높을수록 좋음).
 * 한 판은 플레이 영역 가운데의 시작 과녁을 맞힌 순간 시작한다(시작 과녁은 점수에 넣지 않는다).
 * 위치: 과녁 중심을 0..1 정규화 좌표로 고른다(rand 함수는 화면 코드가 crypto 로 넘긴다). 바로 전 과녁과 MIN_GAP 이상 떨어지게.
 * 빗나감(miss) = 진행 중 과녁 밖을 누른 것. 정확도 = 맞힘 ÷ (맞힘 + 빗나감).
 * 등급 tierOf(mode, score, acc): 6단계(문구는 언어 파일 result.tiers, 끝 화면에는 내 등급만). 정확도가 ACC_PENALTY 미만이면 한 단계 내림.
 * 서버 점수 분포(supa.submitScore): 게임 이름 = gameKey(모드). bucket = classic 평균 ms ÷ 10(0..500, 낮을수록 좋음) / timed 맞힌 수(0..MAX_TIMED_HITS).
 *   사람이 낼 수 없는 값(평균 MIN_AVG_MS 미만, timed MAX_TIMED_HITS 초과)이나 classic 미완료는 보내지 않는다(valid=false).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AIM_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var GAME = 'aim';
  var MODES = ['classic', 'timed'];
  var DEFAULT_MODE = 'classic';
  var CLASSIC_TARGETS = 30;
  var TIMED_MS = 30000;
  var LIFE_START = 1700;   // timed: 처음 과녁 수명(ms)
  var LIFE_END = 950;      // timed: 마지막 과녁 수명(ms)
  var MIN_SCALE = 0.4;     // timed: 수명이 끝날 때 크기 비율
  var MIN_GAP = 0.3;       // 바로 전 과녁과의 최소 거리(정규화 좌표)
  var MIN_AVG_MS = 150;    // 이보다 빠른 평균은 사람이 낼 수 없음
  var MAX_AVG_MS = 5000;   // classic bucket 상한(이보다 느려도 유효, 구간만 끝으로)
  var MAX_TIMED_HITS = 100;
  var ACC_PENALTY = 70;    // 정확도(%)가 이보다 낮으면 등급 한 단계 내림
  var BOUNDS = {
    classic: [900, 700, 580, 480, 400], // 평균 ms 가 이 값보다 "작으면" 한 단계씩 올라감
    timed: [20, 30, 40, 50, 60]         // 맞힌 수가 이 값 "이상"이면 한 단계씩 올라감
  };
  var TIERS = [0, 1, 2, 3, 4, 5];
  var MAX_BUCKET = { classic: MAX_AVG_MS / 10, timed: MAX_TIMED_HITS };

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function validMode(m) { return MODES.indexOf(m) >= 0 ? m : DEFAULT_MODE; }
  function gameKey(mode) { return GAME + '-' + validMode(mode); }
  function lowerBetter(mode) { return validMode(mode) === 'classic'; }
  function safeRand(rand) {
    var v = Number(typeof rand === 'function' ? rand() : Math.random());
    return isFinite(v) ? clamp(v, 0, 0.999999) : 0.5;
  }

  // ---------------------------------------------------------------- 위치
  /* 다음 과녁 중심(정규화 0..1). prev 와 MIN_GAP 이상 떨어진 자리를 12번까지 찾고, 못 찾으면 가장 먼 후보. */
  function pickPos(prev, rand) {
    var best = null, bestD = -1;
    for (var i = 0; i < 12; i++) {
      var p = { x: safeRand(rand), y: safeRand(rand) };
      if (!prev) return p;
      var d = Math.sqrt((p.x - prev.x) * (p.x - prev.x) + (p.y - prev.y) * (p.y - prev.y));
      if (d >= MIN_GAP) return p;
      if (d > bestD) { bestD = d; best = p; }
    }
    return best;
  }

  // ---------------------------------------------------------------- 한 판
  function newRun(mode) {
    var m = validMode(mode);
    return { mode: m, startAt: null, endAt: null, hits: 0, misses: 0, escaped: 0, times: [], target: null, seq: 0, over: false };
  }
  function started(r) { return !!(r && r.startAt != null); }
  function elapsed(r, t) {
    if (!r || r.startAt == null) return 0;
    var e = Number(t) - r.startAt;
    return r.mode === 'timed' ? clamp(e, 0, TIMED_MS) : Math.max(0, e);
  }
  function remaining(r, t) {
    if (!r || r.mode !== 'timed') return 0;
    if (r.startAt == null) return TIMED_MS;
    return clamp(TIMED_MS - (Number(t) - r.startAt), 0, TIMED_MS);
  }
  /* timed: 지금 나오는 과녁의 수명 — 진행할수록 짧아진다 */
  function lifeAt(r, t) {
    if (!r || r.mode !== 'timed') return null;
    var k = clamp(elapsed(r, t) / TIMED_MS, 0, 1);
    return Math.round(LIFE_START + (LIFE_END - LIFE_START) * k);
  }
  function spawn(r, t, rand) {
    var prev = r.target ? { x: r.target.x, y: r.target.y } : null;
    var p = pickPos(prev, rand);
    r.seq++;
    r.target = { id: r.seq, x: p.x, y: p.y, at: Number(t), life: lifeAt(r, t) };
    return r.target;
  }
  /* 시작 과녁을 맞혀 판을 시작한다. 시작했으면 첫 과녁, 이미 시작했거나 끝났으면 null. */
  function start(r, t, rand) {
    t = Number(t);
    if (!r || r.over || r.startAt != null || !isFinite(t)) return null;
    r.startAt = t;
    return spawn(r, t, rand);
  }
  /* 과녁 크기 비율(1 = 처음 크기). classic 은 늘 1. */
  function scaleAt(r, t) {
    if (!r || !r.target || r.mode !== 'timed') return 1;
    var k = clamp((Number(t) - r.target.at) / r.target.life, 0, 1);
    return 1 - (1 - MIN_SCALE) * k;
  }
  /* 과녁을 맞혔다. 'hit' | 'done'(classic 30개 끝) | null(셀 수 없음). */
  function hit(r, t, rand) {
    t = Number(t);
    if (!r || r.over || r.startAt == null || !r.target || !isFinite(t)) return null;
    if (r.mode === 'timed' && t - r.startAt >= TIMED_MS) { finishRun(r, r.startAt + TIMED_MS); return null; }
    var dt = Math.max(0, Math.round(t - r.target.at));
    r.times.push(dt);
    r.hits++;
    if (r.mode === 'classic' && r.hits >= CLASSIC_TARGETS) { finishRun(r, t); return 'done'; }
    spawn(r, t, rand);
    return 'hit';
  }
  /* 과녁 밖을 눌렀다(진행 중에만 센다). */
  function miss(r, t) {
    if (!r || r.over || r.startAt == null) return false;
    if (r.mode === 'timed' && Number(t) - r.startAt >= TIMED_MS) { finishRun(r, r.startAt + TIMED_MS); return false; }
    r.misses++;
    return true;
  }
  function finishRun(r, t) { r.over = true; r.endAt = Number(t); r.target = null; }
  /* 시간 흐름: timed 는 30초가 지나면 끝, 과녁 수명이 다하면 놓침 + 새 과녁. 'over' | 'escape' | null */
  function tick(r, t, rand) {
    if (!r || r.over || r.startAt == null) return r && r.over ? 'over' : null;
    if (r.mode !== 'timed') return null;
    t = Number(t);
    if (t - r.startAt >= TIMED_MS) { finishRun(r, r.startAt + TIMED_MS); return 'over'; }
    if (r.target && t - r.target.at >= r.target.life) {
      r.escaped++;
      spawn(r, r.target.at + r.target.life, rand);
      return 'escape';
    }
    return null;
  }

  // ---------------------------------------------------------------- 요약 · 등급
  function accuracy(hits, misses) {
    var n = (Number(hits) || 0) + (Number(misses) || 0);
    return n > 0 ? Math.round(((Number(hits) || 0) / n) * 100) : 0;
  }
  function avgMs(times) {
    if (!Array.isArray(times) || !times.length) return 0;
    var s = 0;
    for (var i = 0; i < times.length; i++) s += Number(times[i]) || 0;
    return Math.round(s / times.length);
  }
  function tierOf(mode, score, acc) {
    var m = validMode(mode);
    var v = Number(score);
    if (!isFinite(v) || v <= 0) return 0;
    var b = BOUNDS[m], t = 0;
    for (var i = 0; i < b.length; i++) {
      if (m === 'classic' ? v < b[i] : v >= b[i]) t = i + 1;
    }
    if (acc != null && Number(acc) < ACC_PENALTY && t > 0) t--;
    return t;
  }
  function isValid(mode, s) {
    if (!s) return false;
    if (s.avg < MIN_AVG_MS) return false;
    if (validMode(mode) === 'classic') return s.hits === CLASSIC_TARGETS;
    return s.hits > 0 && s.hits <= MAX_TIMED_HITS;
  }
  /* 판 요약. 시작도 안 했으면 null. score = classic 평균 ms / timed 맞힌 수 */
  function summary(r) {
    if (!r || r.startAt == null) return null;
    var avg = avgMs(r.times);
    var acc = accuracy(r.hits, r.misses);
    var total = r.mode === 'classic' ? Math.max(0, Math.round((r.endAt != null ? r.endAt : r.startAt) - r.startAt)) : TIMED_MS;
    var s = { mode: r.mode, hits: r.hits, misses: r.misses, escaped: r.escaped, acc: acc, avg: avg, total: total, done: !!r.over };
    s.score = r.mode === 'classic' ? avg : r.hits;
    s.valid = !!r.over && isValid(r.mode, s);
    s.tier = r.mode === 'classic' && r.hits < CLASSIC_TARGETS ? 0 : tierOf(r.mode, s.score, acc);
    return s;
  }

  // ---------------------------------------------------------------- 서버 점수 분포
  function bucket(mode, score) {
    var m = validMode(mode);
    var v = Number(score);
    if (!isFinite(v) || v < 0) return 0;
    var b = m === 'classic' ? Math.round(v / 10) : Math.round(v);
    return clamp(b, 0, MAX_BUCKET[m]);
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
  /* 분포에서 내 위치. mode 로 방향을 정한다(classic 낮을수록, timed 높을수록 좋음). 같은 구간은 절반.
   * 내 기록은 이미 분포에 들어 있다고 본다(없으면 한 명 더함). 다른 사람이 없으면 { first: true }. 실패(null)면 null. */
  function percentile(rows, myBucket, mode) {
    var hist = normalizeHist(rows);
    if (!hist || myBucket == null || !isFinite(Number(myBucket))) return null;
    myBucket = Math.round(Number(myBucket));
    var low = lowerBetter(mode);
    var worse = 0, same = 0, better = 0;
    hist.forEach(function (h) {
      if (h.bucket === myBucket) same += h.players;
      else if ((h.bucket > myBucket) === low) worse += h.players;
      else better += h.players;
    });
    if (same === 0) same = 1;
    var total = worse + same + better;
    var others = total - 1;
    var base = { total: total, others: others, worse: worse, same: same, better: better };
    if (others <= 0) { base.first = true; return base; }
    var beat = (worse + (same - 1) / 2) / others;
    var topRaw = Math.round((1 - beat) * 1e6) / 1e4;
    base.first = false;
    base.beat = beat;
    base.top = clamp(Math.ceil(topRaw), 1, 100);
    base.beatPct = clamp(Math.floor(Math.round(beat * 1e6) / 1e4), 0, 100);
    return base;
  }

  return {
    GAME: GAME, MODES: MODES, DEFAULT_MODE: DEFAULT_MODE, CLASSIC_TARGETS: CLASSIC_TARGETS, TIMED_MS: TIMED_MS,
    LIFE_START: LIFE_START, LIFE_END: LIFE_END, MIN_SCALE: MIN_SCALE, MIN_GAP: MIN_GAP, MIN_AVG_MS: MIN_AVG_MS, MAX_AVG_MS: MAX_AVG_MS,
    MAX_TIMED_HITS: MAX_TIMED_HITS, ACC_PENALTY: ACC_PENALTY, BOUNDS: BOUNDS, TIERS: TIERS, MAX_BUCKET: MAX_BUCKET,
    clamp: clamp, validMode: validMode, gameKey: gameKey, lowerBetter: lowerBetter, pickPos: pickPos,
    newRun: newRun, started: started, elapsed: elapsed, remaining: remaining, lifeAt: lifeAt, spawn: spawn, start: start,
    scaleAt: scaleAt, hit: hit, miss: miss, tick: tick, accuracy: accuracy, avgMs: avgMs, tierOf: tierOf, isValid: isValid,
    summary: summary, bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
