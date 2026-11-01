/* apps/timer/timer-core.js — 10초 맞추기(타이머 정확히 멈추기) 로직 (언어 무관, UMD: 브라우저 window.TIMER_CORE + Node 검사 공용)
 *
 * 한 판(round) = 시도 ATTEMPTS(3)번. 시도마다 시작을 누르고, 목표 시간(5·10·30초)에 딱 맞춰 멈춘다.
 *   err = 멈춘 시간 − 목표(ms, 부호 있음). 화면 시계는 스톱워치처럼 1/100초 아래를 버린다(floor).
 *   "딱 맞춤"(perfect) = 화면에 목표 그대로(예: 00:10.00)가 보인 경우 = 0 ≤ err < 10ms.
 *   블라인드 모드: BLIND_AFTER_MS(3초)가 지나면 숫자를 가린다(화면 처리, 로직은 같음).
 * 결과 = 가장 작은 |err|(best)와 평균 |err|. 등급 tierOf(|err|): BOUNDS(500·250·100·40·15ms) → 0..5 (문구는 언어 파일 result.tiers).
 * 서버 점수 분포(supa.submitScore): 게임 이름 = gameKey(목표, 블라인드) — 모드마다 따로 비교. bucket = best |err| ms(0..1999), 낮을수록 좋음.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.TIMER_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var GAME = 'timer';
  var TARGETS = [5, 10, 30];
  var DEFAULT_TARGET = 10;
  var ATTEMPTS = 3;
  var BLIND_AFTER_MS = 3000;
  var MAX_RUN_MS = 59 * 60000 + 59990; // 59:59.99 에서 시계가 멈춘다
  var BOUNDS = [500, 250, 100, 40, 15];
  var TIERS = [0, 1, 2, 3, 4, 5];
  var MAX_BUCKET = 1999;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function validTarget(t) {
    t = Number(t);
    return TARGETS.indexOf(t) >= 0 ? t : DEFAULT_TARGET;
  }
  function gameKey(target, blind) {
    return GAME + '-' + validTarget(target) + (blind ? '-b' : '');
  }

  // 시계 표시: mm:ss.cc (1/100초 아래 버림). 음수·이상한 값은 0.
  function clockParts(ms) {
    var v = Math.floor(Number(ms));
    if (!isFinite(v) || v < 0) v = 0;
    if (v > MAX_RUN_MS) v = MAX_RUN_MS;
    var cs = Math.floor(v / 10);
    var m = Math.floor(cs / 6000);
    var s = Math.floor((cs % 6000) / 100);
    var c = cs % 100;
    return { m: m, s: s, c: c };
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function formatClock(ms) {
    var p = clockParts(ms);
    return pad2(p.m) + ':' + pad2(p.s) + '.' + pad2(p.c);
  }
  // 짧은 표시(결과 목록용): 초.cc (1분 넘으면 m:ss.cc)
  function formatShort(ms) {
    var p = clockParts(ms);
    return (p.m ? p.m + ':' + pad2(p.s) : String(p.s)) + '.' + pad2(p.c);
  }

  function errOf(ms, target) { return Math.round(Number(ms) - validTarget(target) * 1000); }
  function isPerfect(ms, target) {
    var e = Number(ms) - validTarget(target) * 1000;
    return e >= 0 && e < 10;
  }

  function tierOf(absErr) {
    var a = Math.abs(Number(absErr));
    if (!isFinite(a)) return 0;
    var t = 0;
    for (var i = 0; i < BOUNDS.length; i++) if (a < BOUNDS[i]) t = i + 1;
    return t;
  }

  // ---------------------------------------------------------------- 한 판
  function newRound(target, blind) {
    return { target: validTarget(target), blind: !!blind, attempts: [], over: false };
  }
  /* 시도 하나 기록: ms = 멈춘 시간. { ms, err, abs, perfect, index } 를 돌려준다. 끝난 판·이상한 값이면 null. */
  function record(r, ms) {
    if (!r || r.over) return null;
    var v = Math.round(Number(ms));
    if (!isFinite(v) || v < 0) return null;
    v = Math.min(v, MAX_RUN_MS);
    var e = errOf(v, r.target);
    var a = { index: r.attempts.length, ms: v, err: e, abs: Math.abs(e), perfect: isPerfect(v, r.target) };
    r.attempts.push(a);
    if (r.attempts.length >= ATTEMPTS) r.over = true;
    return a;
  }
  /* 판 요약: best(가장 작은 |err| 시도), avg(평균 |err| ms, 정수), tier, perfect(딱 맞춘 시도가 있나). 시도가 없으면 null. */
  function summary(r) {
    if (!r || !r.attempts.length) return null;
    var best = r.attempts[0], sum = 0, perfect = false;
    r.attempts.forEach(function (a) {
      if (a.abs < best.abs) best = a;
      sum += a.abs;
      if (a.perfect) perfect = true;
    });
    return { best: best, avg: Math.round(sum / r.attempts.length), tier: tierOf(best.abs), perfect: perfect, count: r.attempts.length };
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (낮을수록 좋음)
  function bucket(absErr) {
    var n = Math.round(Math.abs(Number(absErr)));
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : MAX_BUCKET;
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
  /* 분포에서 내 위치 (rows = 내 기록을 넣은 뒤의 전체 분포). 오차가 작을수록 좋다 — 나보다 큰 구간을 이긴 것으로, 같은 구간은 절반.
   * 다른 사람이 없으면 { first: true }(화면에는 숨김). rows 가 배열이 아니면(실패) null. */
  function percentile(rows, myBucket) {
    var hist = normalizeHist(rows);
    if (!hist || myBucket == null || !isFinite(Number(myBucket))) return null;
    myBucket = Math.round(Number(myBucket));
    var better = 0, same = 0, worse = 0;
    hist.forEach(function (h) {
      if (h.bucket < myBucket) better += h.players;
      else if (h.bucket > myBucket) worse += h.players;
      else same += h.players;
    });
    if (same === 0) same = 1;
    var total = better + same + worse;
    var others = total - 1;
    var base = { total: total, others: others, better: better, same: same, worse: worse };
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
    GAME: GAME, TARGETS: TARGETS, DEFAULT_TARGET: DEFAULT_TARGET, ATTEMPTS: ATTEMPTS, BLIND_AFTER_MS: BLIND_AFTER_MS,
    MAX_RUN_MS: MAX_RUN_MS, BOUNDS: BOUNDS, TIERS: TIERS, MAX_BUCKET: MAX_BUCKET,
    clamp: clamp, validTarget: validTarget, gameKey: gameKey, clockParts: clockParts, formatClock: formatClock, formatShort: formatShort,
    errOf: errOf, isPerfect: isPerfect, tierOf: tierOf, newRound: newRound, record: record, summary: summary,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
