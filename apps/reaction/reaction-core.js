/* apps/reaction/reaction-core.js — 반응속도 테스트의 언어 무관 로직 (UMD: 브라우저 window.REACTION_CORE, Node require)
 * 화면/DOM 은 reaction.js 가 맡고, 여기에는 검증 스크립트(tools/check-reaction.js)가 그대로 돌릴 수 있는
 * 순수 함수만 둔다: 대기 시간 난수, 등급(티어), 10ms 구간, 분포에서 상위 %, 차트용 구간 묶기.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.REACTION_CORE = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var ROUNDS = 5; // 유효 라운드 수 (평균에 들어가는 횟수)
  var MIN_DELAY = 1500; // 빨강 → 초록까지 최소 대기 (ms)
  var MAX_DELAY = 4500; // 최대 대기 (ms)
  var ANTICIPATION_MS = 100; // 초록 뒤 이보다 빠른 탭은 "보고 반응"이 불가능 → 예측 탭(부정 출발)
  var MISS_MS = 2000; // 초록 뒤 이보다 늦은 탭은 반응이 아니라 딴짓 → 그 라운드 다시 (평균·분포 보호)
  var BUCKET_MS = 10; // 분포 구간 폭. 25 = 245~254.9ms
  var MAX_BUCKET = 1000; // 10초 이상은 한 칸으로 (DB 는 0~100000 허용)

  // 평균(ms, 반올림한 정수) 기준 등급. max 이하이면 그 등급. 터치 지연(+30~80ms)을 감안한 값이다:
  // 마우스 기준 사람 평균은 ~270ms, 폰은 300ms대가 흔하다.
  var TIERS = [
    { id: 'eagle', emoji: '🦅', max: 220 },
    { id: 'cheetah', emoji: '🐆', max: 260 },
    { id: 'cat', emoji: '🐈', max: 300 },
    { id: 'rabbit', emoji: '🐇', max: 350 },
    { id: 'puppy', emoji: '🐕', max: 449 },
    { id: 'turtle', emoji: '🐢', max: Infinity }
  ];

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // [0, 1) 균등 난수. 가능하면 crypto.getRandomValues (패턴을 외워서 맞히지 못하게).
  function cryptoRandom() {
    var c = typeof crypto !== 'undefined' && crypto && crypto.getRandomValues ? crypto : null;
    if (c) {
      var a = new Uint32Array(1);
      c.getRandomValues(a);
      return a[0] / 4294967296;
    }
    return Math.random();
  }

  // 빨강에서 초록으로 바뀌기까지의 대기 시간(ms, 정수). r 을 넘기면 그 값으로(테스트용).
  function randomDelay(r) {
    var u = typeof r === 'number' ? clamp(r, 0, 0.9999999999) : cryptoRandom();
    return MIN_DELAY + Math.floor(u * (MAX_DELAY - MIN_DELAY + 1));
  }

  function tierIndex(avgMs) {
    var ms = Math.round(Number(avgMs));
    if (!isFinite(ms)) return TIERS.length - 1;
    for (var i = 0; i < TIERS.length; i++) if (ms <= TIERS[i].max) return i;
    return TIERS.length - 1;
  }

  // 평균 ms → 10ms 구간 번호 (Math.round(avg/10)). 잘못된 값이면 null.
  function toBucket(avgMs) {
    var v = Number(avgMs);
    if (avgMs === null || avgMs === '' || !isFinite(v) || v < 0) return null;
    return clamp(Math.round(v / BUCKET_MS), 0, MAX_BUCKET);
  }

  // 라운드 기록 배열 → { avg, best, worst, n }. avg 는 반올림 전 값.
  function summarize(times) {
    var list = (times || []).map(Number).filter(function (x) { return isFinite(x) && x >= 0; });
    if (!list.length) return null;
    var sum = 0, best = Infinity, worst = -Infinity;
    list.forEach(function (x) { sum += x; if (x < best) best = x; if (x > worst) worst = x; });
    return { avg: sum / list.length, best: best, worst: worst, n: list.length };
  }

  // Supabase 응답 [{ score_bucket, players }] → [{ bucket, players }] (정렬, 같은 구간 합치기, 잘못된 행 버리기)
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

  /* 분포에서 내 위치. rows 는 내 기록을 더한 뒤의 전체 분포(submit_score 응답)라고 본다
   * (내 구간이 없으면 한 명 더해서 계산). 같은 구간(동점)은 절반만 이긴 것으로 친다.
   *   beat   : 다른 참가자 중 나보다 느린 사람의 비율 (0~1)
   *   top    : "상위 N%" 의 N — ceil((1 - beat) × 100), 1~100
   *   beatPct: "N%보다 빨라요" 의 N — floor(beat × 100), 0~100
   * 비교할 다른 사람이 없으면 { first: true }. rows 가 배열이 아니면(실패) null.
   */
  function percentile(rows, bucket) {
    var hist = normalizeHist(rows);
    if (!hist || bucket == null || !isFinite(Number(bucket))) return null;
    bucket = Math.round(Number(bucket));
    var faster = 0, same = 0, slower = 0;
    hist.forEach(function (h) {
      if (h.bucket < bucket) faster += h.players;
      else if (h.bucket > bucket) slower += h.players;
      else same += h.players;
    });
    if (same === 0) same = 1; // 응답에 내 기록이 빠져 있으면 나를 더한다
    var total = faster + same + slower;
    var others = total - 1;
    var base = { total: total, others: others, faster: faster, same: same, slower: slower };
    if (others <= 0) { base.first = true; return base; }
    var beat = (slower + (same - 1) / 2) / others;
    // 부동소수 오차(0.88 → 12.000000000000002) 때문에 ceil 이 한 칸 올라가지 않게 먼저 반올림
    var topRaw = Math.round((1 - beat) * 1e6) / 1e4;
    base.first = false;
    base.beat = beat;
    base.top = clamp(Math.ceil(topRaw), 1, 100);
    base.beatPct = clamp(Math.floor(Math.round(beat * 1e6) / 1e4), 0, 100);
    return base;
  }

  /* 차트용 구간: lo~hi (구간 번호, 둘 다 포함) 만 그리고 바깥은 양 끝 칸으로 모은다.
   * → [{ bucket, players, edge: 'lo'|'hi'|null }] (길이 hi - lo + 1)
   */
  function chartBins(rows, lo, hi) {
    var hist = normalizeHist(rows) || [];
    var bins = [];
    for (var b = lo; b <= hi; b++) bins.push({ bucket: b, players: 0, edge: b === lo ? 'lo' : b === hi ? 'hi' : null });
    hist.forEach(function (h) {
      var i = clamp(h.bucket, lo, hi) - lo;
      bins[i].players += h.players;
    });
    return bins;
  }

  return {
    ROUNDS: ROUNDS,
    MIN_DELAY: MIN_DELAY,
    MAX_DELAY: MAX_DELAY,
    ANTICIPATION_MS: ANTICIPATION_MS,
    MISS_MS: MISS_MS,
    BUCKET_MS: BUCKET_MS,
    MAX_BUCKET: MAX_BUCKET,
    TIERS: TIERS,
    clamp: clamp,
    cryptoRandom: cryptoRandom,
    randomDelay: randomDelay,
    tierIndex: tierIndex,
    toBucket: toBucket,
    summarize: summarize,
    normalizeHist: normalizeHist,
    percentile: percentile,
    chartBins: chartBins
  };
});
