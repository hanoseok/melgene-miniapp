/* apps/mole/mole-core.js — 두더지 잡기 규칙 (언어 무관, UMD: 브라우저 window.MOLE_CORE + Node 검사 공용)
 *
 * 판: 구멍 3×3(holes[i] = null | { id, kind, born, until }). 30초(DURATION ms) 한 판.
 *   두더지(mole)가 구멍에서 올라와 until 까지 떠 있다 사라진다. 눌러 잡으면 +10, 황금 두더지(gold) +30, 폭탄(bomb) 을 누르면 −20(점수는 0 아래로 안 내려감).
 *   빈 구멍·이미 사라진 칸을 눌러도 감점 없음(miss). 폭탄은 그냥 두면 사라진다.
 *   시간이 갈수록(p = t / DURATION) 새로 나오는 간격이 줄고, 떠 있는 시간이 짧아지고, 동시에 나오는 수(1 → 2 → 3)와 폭탄 비율이 늘어난다.
 * 시간 진행: tick(s, dt) 로 dt ms 만큼 진행하며 spawn/leave/end 사건 목록을 돌려준다(화면은 이 사건으로 그린다). 누르기: whack(s, hole).
 * 시드 난수(mulberry32, 상태는 s.rng) — 같은 시드 + 같은 tick/whack 순서 = 같은 판(재현).
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 10) (0..1999 — 서버 한도 2000 구간 안).
 * 등급: tierOf(score) → 0..5 (TIERS 문턱, 이름은 언어 파일 result.tiers, 이모지는 TIER_EMOJI).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MOLE_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var HOLES = 9;
  var DURATION = 30000;
  var GAME = 'mole';          // 서버 점수 분포 이름
  var MAX_BUCKET = 1999;
  var BUCKET_STEP = 10;
  var POINTS = { mole: 10, gold: 30, bomb: -20 };
  var TIERS = [0, 60, 130, 210, 300, 400];            // 등급 문턱(점수 이상)
  var TIER_EMOJI = ['😴', '🌱', '🔨', '🎯', '⚡', '👑'];

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
      t: 0, nextSpawn: 600, nextId: 1, spawned: 0, last: -1,
      holes: [], score: 0, hits: 0, golds: 0, bombs: 0, misses: 0,
      over: false
    };
    for (var i = 0; i < HOLES; i++) s.holes.push(null);
    return s;
  }

  // 난이도 곡선 (p = 0..1)
  function prog(t) { return clamp(t / DURATION, 0, 1); }
  function intervalAt(t) { return 800 - 420 * prog(t); }
  function upAt(t) { return 1200 - 600 * prog(t); }
  function maxActive(t) { return t < 5000 ? 1 : t < 17000 ? 2 : 3; }
  function bombChance(t) { return 0.12 + 0.16 * prog(t); }
  var GOLD_CHANCE = 0.08;

  function active(s) {
    var n = 0;
    for (var i = 0; i < HOLES; i++) if (s.holes[i]) n++;
    return n;
  }

  function spawn(s, events) {
    var at = s.nextSpawn;
    if (active(s) >= maxActive(at)) { s.nextSpawn = at + 120; return; }   // 자리가 없으면 잠깐 뒤 다시
    var free = [];
    for (var i = 0; i < HOLES; i++) if (!s.holes[i] && i !== s.last) free.push(i);
    if (!free.length) { s.nextSpawn = at + 120; return; }
    var hole = free[Math.floor(rnd(s) * free.length)];
    var r = rnd(s);
    var kind = 'mole';
    if (s.spawned >= 2) {
      if (r < bombChance(at)) kind = 'bomb';
      else if (r < bombChance(at) + GOLD_CHANCE) kind = 'gold';
    }
    var up = upAt(at) * (kind === 'gold' ? 0.8 : kind === 'bomb' ? 1.15 : 1);
    var c = { id: s.nextId++, kind: kind, born: at, until: at + up };
    s.holes[hole] = c;
    s.last = hole;
    s.spawned++;
    events.push({ type: 'spawn', hole: hole, kind: kind, id: c.id, until: c.until });
    s.nextSpawn = at + intervalAt(at) * (0.8 + 0.4 * rnd(s));
  }

  function expire(s, at, events) {
    for (var i = 0; i < HOLES; i++) {
      var c = s.holes[i];
      if (c && c.until <= at) { s.holes[i] = null; events.push({ type: 'leave', hole: i, kind: c.kind, id: c.id }); }
    }
  }

  // dt ms 진행 → 사건 [{type:'spawn'|'leave'|'end', …}]
  function tick(s, dt) {
    var events = [];
    if (s.over) return events;
    var end = Math.min(DURATION, s.t + Math.max(0, dt));
    while (s.nextSpawn <= end && s.nextSpawn < DURATION) {
      var at = s.nextSpawn;
      expire(s, at, events);
      s.t = at;
      spawn(s, events);
    }
    expire(s, end, events);
    s.t = end;
    if (end >= DURATION) {
      for (var i = 0; i < HOLES; i++) {
        var c = s.holes[i];
        if (c) { s.holes[i] = null; events.push({ type: 'leave', hole: i, kind: c.kind, id: c.id }); }
      }
      s.over = true;
      events.push({ type: 'end' });
    }
    return events;
  }

  // 구멍 하나 누르기 → { kind: 'mole'|'gold'|'bomb'|'miss', points(실제 변한 점수), hole }
  function whack(s, hole) {
    if (s.over || hole < 0 || hole >= HOLES || !s.holes[hole]) {
      if (!s.over) s.misses++;
      return { kind: 'miss', points: 0, hole: hole };
    }
    var c = s.holes[hole];
    s.holes[hole] = null;
    var pts = POINTS[c.kind];
    var before = s.score;
    s.score = Math.max(0, s.score + pts);
    if (c.kind === 'bomb') s.bombs++;
    else { s.hits++; if (c.kind === 'gold') s.golds++; }
    return { kind: c.kind, points: s.score - before, hole: hole, id: c.id };
  }

  function tierOf(score) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (score >= TIERS[i]) t = i;
    return t;
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
    HOLES: HOLES, DURATION: DURATION, GAME: GAME, MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP,
    POINTS: POINTS, TIERS: TIERS, TIER_EMOJI: TIER_EMOJI,
    newGame: newGame, tick: tick, whack: whack, tierOf: tierOf, maxActive: maxActive, intervalAt: intervalAt, upAt: upAt, bombChance: bombChance,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
