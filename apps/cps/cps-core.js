/* apps/cps/cps-core.js — 클릭 속도 테스트(CPS 테스트) 로직 (언어 무관, UMD: 브라우저 window.CPS_CORE + Node 검사 공용)
 *
 * 한 판(round) = 모드 시간(1·5·10초, 기본 5초) 동안 클릭 영역을 최대한 많이 누르기.
 *   시계는 영역을 처음 누른 순간(그 클릭도 1회) 시작한다. 시작 + 모드 시간 이후의 클릭은 세지 않는다.
 *   결과 CPS = 클릭 수 ÷ 모드 초 (소수 한 자리, 반올림). 키보드는 세지 않는다(화면 코드에서 pointerdown 만 받는다).
 * 등급 tierOf(cps): BOUNDS(4·6·8·10·13 CPS) → 0..5 (문구는 언어 파일 result.tiers, 끝 화면에는 내 등급만).
 * 서버 점수 분포(supa.submitScore): 게임 이름 = gameKey(모드) — 모드마다 따로 비교. bucket = CPS×10(0..250), 높을수록 좋음.
 *   MAX_CPS(25) 를 넘는 결과는 사람이 낼 수 없는 값(매크로·오작동)이라 보내지 않는다(isValid).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CPS_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var GAME = 'cps';
  var MODES = [1, 5, 10];
  var DEFAULT_MODE = 5;
  var MAX_CPS = 25;
  var BOUNDS = [4, 6, 8, 10, 13];
  var TIERS = [0, 1, 2, 3, 4, 5];
  var MAX_BUCKET = MAX_CPS * 10;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function validMode(m) {
    m = Number(m);
    return MODES.indexOf(m) >= 0 ? m : DEFAULT_MODE;
  }
  function gameKey(mode) { return GAME + '-' + validMode(mode); }
  function durationMs(mode) { return validMode(mode) * 1000; }

  // CPS = 클릭 ÷ 초, 소수 한 자리 반올림 (부동소수 오차를 피하려고 정수 연산)
  function cpsOf(clicks, sec) {
    var c = Math.max(0, Math.floor(Number(clicks) || 0));
    var s = Number(sec);
    if (!isFinite(s) || s <= 0) return 0;
    return Math.round((c * 10) / s) / 10;
  }

  function tierOf(cps) {
    var v = Number(cps);
    if (!isFinite(v) || v < 0) return 0;
    var t = 0;
    for (var i = 0; i < BOUNDS.length; i++) if (v >= BOUNDS[i]) t = i + 1;
    return t;
  }
  function isValid(cps) {
    var v = Number(cps);
    return isFinite(v) && v > 0 && v <= MAX_CPS;
  }

  // ---------------------------------------------------------------- 한 판
  function newRound(mode) {
    var m = validMode(mode);
    return { mode: m, dur: m * 1000, startAt: null, clicks: 0, over: false };
  }
  function started(r) { return !!(r && r.startAt != null); }
  /* 남은 시간(ms) — 시작 전이면 전체 시간 */
  function remaining(r, t) {
    if (!r) return 0;
    if (r.startAt == null) return r.dur;
    return clamp(r.dur - (Number(t) - r.startAt), 0, r.dur);
  }
  function elapsed(r, t) {
    if (!r || r.startAt == null) return 0;
    return clamp(Number(t) - r.startAt, 0, r.dur);
  }
  /* 클릭 하나: t = 클릭 시각(ms, 같은 기준). 셌으면 'start'(첫 클릭) | 'tap', 세지 않았으면 null.
   * 시간이 다 된 뒤(t ≥ 시작 + 모드 시간)의 클릭은 세지 않고 판을 끝낸다. */
  function tap(r, t) {
    if (!r || r.over) return null;
    t = Number(t);
    if (!isFinite(t)) return null;
    if (r.startAt == null) { r.startAt = t; r.clicks = 1; return 'start'; }
    if (t < r.startAt) t = r.startAt; // 이벤트 시각이 조금 앞서 오는 경우
    if (t - r.startAt >= r.dur) { r.over = true; return null; }
    r.clicks++;
    return 'tap';
  }
  /* 시간이 다 됐으면 판을 끝낸다. 끝났으면 true. */
  function tick(r, t) {
    if (!r || r.over) return !!(r && r.over);
    if (r.startAt == null) return false;
    if (Number(t) - r.startAt >= r.dur) r.over = true;
    return r.over;
  }
  /* 판 요약: clicks, sec, cps, tier, valid(서버에 보낼 수 있나). 시작도 안 했으면 null. */
  function summary(r) {
    if (!r || r.startAt == null) return null;
    var cps = cpsOf(r.clicks, r.mode);
    return { mode: r.mode, clicks: r.clicks, sec: r.mode, cps: cps, tier: tierOf(cps), valid: isValid(cps) };
  }
  // 지금까지의 속도(진행 중 표시용): 클릭 ÷ 지난 초 (처음 0.25초는 너무 튀므로 0.25초로 본다)
  function liveCps(r, t) {
    if (!r || r.startAt == null) return 0;
    var e = Math.max(elapsed(r, t), 250) / 1000;
    return Math.round((r.clicks / e) * 10) / 10;
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (높을수록 좋음)
  function bucket(cps) {
    var n = Math.round(Number(cps) * 10);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
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
  /* 분포에서 내 위치 (높을수록 좋음, 내 기록은 이미 분포에 들어 있다고 본다 — 없으면 한 명 더함). 같은 구간은 절반.
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
    GAME: GAME, MODES: MODES, DEFAULT_MODE: DEFAULT_MODE, MAX_CPS: MAX_CPS, BOUNDS: BOUNDS, TIERS: TIERS, MAX_BUCKET: MAX_BUCKET,
    clamp: clamp, validMode: validMode, gameKey: gameKey, durationMs: durationMs, cpsOf: cpsOf, tierOf: tierOf, isValid: isValid,
    newRound: newRound, started: started, remaining: remaining, elapsed: elapsed, tap: tap, tick: tick, summary: summary, liveCps: liveCps,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
