/* apps/balance/balance-core.js — 밸런스 게임의 언어 무관 로직 (UMD: 브라우저 window.BALANCE_CORE, Node require)
 *
 * - 팩 구성과 질문 id(daily-01 …). 질문 문구는 tools/i18n/<lang>.js 의 ui.questions[qid] 에 있고,
 *   모든 언어가 같은 id·같은 선택지 순서(0=A, 1=B)를 쓰므로 투표(poll 'balance')가 언어와 상관없이 합산된다.
 * - 랜덤 12: 시드 기반(mulberry32) 셔플이라 같은 시드면 같은 질문 세트 → 공유 링크로 친구가 같은 문제를 푼다.
 * - 공유 해시(#p=love&v=01-1…) 인코딩/디코딩, 투표 응답 → [A표, B표], 대세 일치율·유형 계산.
 *   (끝 화면은 그 사람의 결과 숫자만 보여 준다 — 푼 질문을 다시 모아 보여 주지 않는다. .claude/skills/melgene-miniapp)
 * 숫자는 오직 서버가 돌려준 실제 합계로만 계산한다. 합계가 없으면 null 이고, 화면은 숫자를 숨긴다.
 * 검증: node tools/check-balance.js
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BALANCE_CORE = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var POLL = 'balance';
  var PACK_SIZE = 12;
  var RANDOM_ID = 'random';
  var MIN_FOR_TYPE = 3; // 집계가 있는(반반이 아닌) 질문이 이만큼은 있어야 대세 유형을 정한다
  var MAX_SEED = 2147483647;

  function pad2(n) { return n < 10 ? '0' + n : String(n); }
  function range(prefix, n) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push(prefix + '-' + pad2(i));
    return out;
  }

  // 팩 순서 = 화면 순서. emoji 는 언어 무관, 이름/설명은 i18n 의 ui.packs[id].
  var PACKS = [
    { id: 'daily', emoji: '☀️', qids: range('daily', PACK_SIZE) },
    { id: 'love', emoji: '💘', qids: range('love', PACK_SIZE) },
    { id: 'work', emoji: '💼', qids: range('work', PACK_SIZE) },
    { id: 'food', emoji: '🍜', qids: range('food', PACK_SIZE) },
    { id: 'extreme', emoji: '🌋', qids: range('extreme', PACK_SIZE) }
  ];
  var RANDOM_PACK = { id: RANDOM_ID, emoji: '🎲', qids: null };
  var ALL_QIDS = PACKS.reduce(function (a, p) { return a.concat(p.qids); }, []);
  var QID_RE = /^[a-z0-9_-]{1,32}$/; // supabase poll_vote 의 검사식과 같다

  function packById(id) {
    if (id === RANDOM_ID) return RANDOM_PACK;
    for (var i = 0; i < PACKS.length; i++) if (PACKS[i].id === id) return PACKS[i];
    return null;
  }
  function packOfQid(qid) {
    for (var i = 0; i < PACKS.length; i++) if (PACKS[i].qids.indexOf(qid) >= 0) return PACKS[i];
    return null;
  }

  // ---------------------------------------------------------------- 시드 난수 / 랜덤 12
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomSet(seed) {
    var rand = mulberry32(seed);
    var arr = ALL_QIDS.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr.slice(0, PACK_SIZE);
  }

  // 이미 투표한 질문이 가장 적게 섞이는 시드를 고른다 (시드는 그대로 공유되므로 친구도 같은 세트).
  function freshSeed(voted, rand, tries) {
    rand = rand || Math.random;
    tries = tries || 40;
    var best = null, bestFresh = -1;
    for (var i = 0; i < tries; i++) {
      var seed = 1 + Math.floor(rand() * (MAX_SEED - 1));
      var fresh = randomSet(seed).filter(function (q) { return !voted || voted[q] == null; }).length;
      if (fresh > bestFresh) { best = seed; bestFresh = fresh; }
      if (fresh === PACK_SIZE) break;
    }
    return best;
  }

  function questionsFor(packId, seed) {
    if (packId === RANDOM_ID) return isSeed(seed) ? randomSet(seed) : null;
    var p = packById(packId);
    return p ? p.qids.slice() : null;
  }

  function isSeed(s) { return typeof s === 'number' && s % 1 === 0 && s >= 1 && s <= MAX_SEED; }

  // ---------------------------------------------------------------- 공유 해시
  // p=<팩>, s=<시드: 랜덤만>, v=<선택: 0=A 1=B -=건너뜀, 질문 순서대로>
  function encodeShare(o) {
    var parts = ['p=' + o.pack];
    if (o.pack === RANDOM_ID) parts.push('s=' + o.seed);
    if (o.picks && o.picks.length) {
      parts.push('v=' + o.picks.map(function (p) { return p === 0 ? '0' : p === 1 ? '1' : '-'; }).join(''));
    }
    return parts.join('&');
  }

  function decodeShare(hash) {
    var s = String(hash || '').replace(/^#/, '');
    if (!s) return null;
    var map = {};
    s.split('&').forEach(function (kv) {
      var i = kv.indexOf('=');
      if (i > 0) map[kv.slice(0, i)] = kv.slice(i + 1);
    });
    var pack = map.p;
    if (!packById(pack)) return null;
    var seed = null;
    if (pack === RANDOM_ID) {
      if (!/^\d{1,10}$/.test(map.s || '')) return null;
      seed = Number(map.s);
      if (!isSeed(seed)) return null;
    }
    var picks = null;
    if (map.v != null) {
      if (!new RegExp('^[01-]{' + PACK_SIZE + '}$').test(map.v)) return null;
      picks = map.v.split('').map(function (c) { return c === '0' ? 0 : c === '1' ? 1 : null; });
    }
    return { pack: pack, seed: seed, picks: picks };
  }

  // ---------------------------------------------------------------- 투표 응답 → 숫자
  // supa.vote → [{option, votes}] (PostgREST 는 bigint 를 숫자로 주지만 문자열이어도 받아 준다).
  // A/B 합계가 1 이상일 때만 [A, B] 를 돌려준다. 이상한 응답은 null (= 숫자를 보여 주지 않는다).
  function countsFromRows(rows) {
    if (!Array.isArray(rows)) return null;
    var c = [0, 0], seen = false;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r || typeof r !== 'object') return null;
      var opt = Number(r.option), n = Number(r.votes);
      if (!(opt === 0 || opt === 1)) continue;
      if (!isFinite(n) || n < 0 || n % 1 !== 0) return null;
      c[opt] += n;
      seen = true;
    }
    return seen && c[0] + c[1] > 0 ? c : null;
  }

  // supa.pollResults → { qid: [A, B] }
  function resultsMap(rows) {
    var out = {};
    if (!Array.isArray(rows)) return out;
    var grouped = {};
    rows.forEach(function (r) {
      if (!r || !QID_RE.test(String(r.qid || ''))) return;
      (grouped[r.qid] = grouped[r.qid] || []).push(r);
    });
    Object.keys(grouped).forEach(function (q) {
      var c = countsFromRows(grouped[q]);
      if (c) out[q] = c;
    });
    return out;
  }

  // [A%, B%] — 반올림해도 합이 항상 100
  function percents(counts) {
    var total = counts[0] + counts[1];
    if (!total) return null;
    var a = Math.round((counts[0] * 100) / total);
    return [a, 100 - a];
  }

  // 0/1 = 더 많이 고른 쪽, -1 = 동률
  function majorityOf(counts) {
    if (!counts) return -1;
    return counts[0] === counts[1] ? -1 : counts[0] > counts[1] ? 0 : 1;
  }

  // ---------------------------------------------------------------- 결과 요약
  var MAJOR_TYPES = [
    { id: 'poll', min: 80 },
    { id: 'mainstream', min: 55 },
    { id: 'indie', min: 30 },
    { id: 'contrarian', min: 0 }
  ];
  var SPEED_TYPES = [
    { id: 'instinct', maxMs: 2500 },
    { id: 'steady', maxMs: 5000 },
    { id: 'ponder', maxMs: Infinity }
  ];
  var TYPE_IDS = MAJOR_TYPES.map(function (t) { return t.id; })
    .concat(SPEED_TYPES.map(function (t) { return t.id; }), ['skipper']);

  function majorType(rate) {
    for (var i = 0; i < MAJOR_TYPES.length; i++) if (rate >= MAJOR_TYPES[i].min) return MAJOR_TYPES[i].id;
    return 'contrarian';
  }
  function speedType(avgMs) {
    for (var i = 0; i < SPEED_TYPES.length; i++) if (avgMs < SPEED_TYPES[i].maxMs) return SPEED_TYPES[i].id;
    return 'ponder';
  }

  // 대세 판정은 "나를 뺀 다른 사람들" 기준: counts 에 내 표(self)가 들어 있으면 그 쪽에서 1을 뺀다.
  // (첫 투표자가 자기 표 덕분에 다수파가 되는 일을 막는다.) 다른 사람이 0명이면 null.
  function othersOf(counts, self) {
    if (!counts) return null;
    var o = [counts[0] - (self === 0 ? 1 : 0), counts[1] - (self === 1 ? 1 : 0)];
    if (o[0] < 0) o[0] = 0;
    if (o[1] < 0) o[1] = 0;
    return o[0] + o[1] > 0 ? o : null;
  }

  /* entries: [{ qid, pick: 0|1|null, counts: [A,B]|null, self: counts 에 포함된 내 표(0|1|null), ms: 고민 시간 }]
   * → answered, skipped, withData(집계 있음), considered(다른 사람 표가 있고 반반 아님), matches, rate(0~100|null),
   *   type, typeBasis('majority'|'speed'|'none'), avgMs */
  function summarize(entries) {
    var answered = 0, skipped = 0, withData = 0, considered = 0, matches = 0, msSum = 0, msN = 0;
    (entries || []).forEach(function (e) {
      if (e.pick !== 0 && e.pick !== 1) { skipped++; return; }
      answered++;
      if (typeof e.ms === 'number' && e.ms > 0 && isFinite(e.ms)) { msSum += Math.min(e.ms, 60000); msN++; }
      if (!e.counts) return;
      withData++;
      var maj = majorityOf(othersOf(e.counts, e.self));
      if (maj < 0) return;
      considered++;
      if (maj === e.pick) matches++;
    });
    var rate = considered ? Math.round((matches * 100) / considered) : null;
    var avgMs = msN ? Math.round(msSum / msN) : null;
    var type, basis;
    if (!answered) { type = 'skipper'; basis = 'none'; }
    else if (considered >= MIN_FOR_TYPE) { type = majorType(rate); basis = 'majority'; }
    else { type = speedType(avgMs == null ? 3000 : avgMs); basis = 'speed'; }
    return {
      answered: answered, skipped: skipped, withData: withData, considered: considered,
      matches: matches, rate: rate, type: type, typeBasis: basis, avgMs: avgMs
    };
  }

  // 친구 링크(v=)와 내 선택 비교: 둘 다 고른 질문 중 같은 선택 수
  function compareFriend(mine, friend) {
    if (!friend) return null;
    var both = 0, same = 0;
    for (var i = 0; i < mine.length; i++) {
      var a = mine[i], b = friend[i];
      if ((a === 0 || a === 1) && (b === 0 || b === 1)) { both++; if (a === b) same++; }
    }
    return { both: both, same: same };
  }

  return {
    POLL: POLL,
    PACK_SIZE: PACK_SIZE,
    RANDOM_ID: RANDOM_ID,
    MIN_FOR_TYPE: MIN_FOR_TYPE,
    PACKS: PACKS,
    ALL_QIDS: ALL_QIDS,
    QID_RE: QID_RE,
    TYPE_IDS: TYPE_IDS,
    MAJOR_TYPES: MAJOR_TYPES,
    SPEED_TYPES: SPEED_TYPES,
    packById: packById,
    packOfQid: packOfQid,
    mulberry32: mulberry32,
    randomSet: randomSet,
    freshSeed: freshSeed,
    questionsFor: questionsFor,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    countsFromRows: countsFromRows,
    resultsMap: resultsMap,
    percents: percents,
    majorityOf: majorityOf,
    othersOf: othersOf,
    summarize: summarize,
    compareFriend: compareFriend
  };
});
