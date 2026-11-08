/* apps/raffle/raffle-core.js — 경품 추첨기(Raffle Draw) 언어 무관 로직 (UMD: 브라우저 window.RAFFLE_CORE + Node 검사 공용)
 *   - 참가자: 'names'(이름 붙여 넣기, 한 줄에 하나, "이름*3" = 응모권 3장) 또는 'numbers'(번호표 1~N).
 *   - 경품: [{ n: 이름, c: 개수 }] (위가 큰 상). 추첨 순서 'up' = 작은 상부터(대상은 마지막), 'down' = 큰 상부터.
 *   - unique(기본 true): 한 사람은 한 번만 당첨. false 면 다른 상에는 또 당첨될 수 있다(같은 상 안에서는 한 번).
 *   - 뽑기: 누를 때마다 지금 상의 "뽑을 수 있는 사람" 중 한 명을 crypto.getRandomValues + 거부 샘플링으로 고른다
 *     (응모권 수만큼 가중치). 미리 섞어 두지 않으므로 저장소를 봐도 다음 당첨자를 알 수 없다.
 *   - 되돌리기 = 마지막 뽑기 한 번(남은 인원 한꺼번에 뽑기면 그 묶음 전체)을 취소.
 *   - 공유(#r=): 결과 목록만(상 이름 + 당첨자) UTF-8 base64url. 서버에 저장하지 않는다.
 *   - 일반 의사 난수는 쓰지 않는다(연출용 이름도 crypto).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RAFFLE_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var V = 1;
  var MODES = ['names', 'numbers'];
  var ORDERS = ['up', 'down'];
  var MAX_ENTRIES = 1000;     // 이름 줄 수 한도
  var MAX_LEN = 40;           // 이름 글자 수
  var MAX_TICKETS = 50;       // 한 사람 응모권 수 한도(이름*50)
  var MIN_ENTRIES = 2;
  var NUM_MIN = 2;            // 번호표 1~N: N 은 2~9999
  var NUM_MAX = 9999;
  var MAX_PRIZES = 12;
  var MAX_PRIZE_COUNT = 200;  // 한 상의 개수
  var MAX_SLOTS = 500;        // 모든 상 개수 합
  var PRIZE_LEN = 30;
  var SHARE_MAX = 12000;
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max (거부 샘플링: limit 이상은 버리고 다시)
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('raffle-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('raffle-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('raffle-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }

  function cut(s, n) { var a = Array.from(String(s)); return a.length > n ? a.slice(0, n).join('') : String(s); }
  function clean(s) { return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function keyOf(s) { var k = clean(s).toLowerCase(); try { k = k.normalize('NFC'); } catch (e) { /* noop */ } return k; }
  function isInt(x) { return typeof x === 'number' && isFinite(x) && Math.floor(x) === x; }

  // ---------------------------------------------------------------- 이름 붙여 넣기
  // 한 줄(또는 쉼표·、·，·;)에 하나. "이름*3" / "이름 × 3" = 응모권 3장(1~50).
  var TICKET_RE = /^(.*?)\s*[*＊×]\s*(\d{1,4})$/;
  function parseEntries(text) {
    var parts = String(text || '').split(/[\r\n,，、;；]+/);
    var entries = [];
    var dropped = 0;
    var seen = {};
    var order = [];
    parts.forEach(function (raw) {
      var s = clean(raw);
      if (!s) return;
      var w = 1;
      var m = TICKET_RE.exec(s);
      if (m && clean(m[1])) { s = clean(m[1]); w = Math.max(1, Math.min(MAX_TICKETS, parseInt(m[2], 10) || 1)); }
      s = cut(s, MAX_LEN).trim();
      if (!s) return;
      if (entries.length >= MAX_ENTRIES) { dropped++; return; }
      entries.push({ n: s, w: w });
      var k = keyOf(s);
      if (!seen[k]) { seen[k] = { name: s, count: 0 }; order.push(k); }
      seen[k].count++;
    });
    var dups = order.filter(function (k) { return seen[k].count > 1; }).map(function (k) { return seen[k]; });
    var tickets = entries.reduce(function (a, e) { return a + e.w; }, 0);
    return { entries: entries, dups: dups, dropped: dropped, tickets: tickets, weighted: entries.some(function (e) { return e.w > 1; }) };
  }

  // ---------------------------------------------------------------- 경품
  function cleanPrizes(list, autoName) {
    if (!Array.isArray(list)) return [];
    return list.slice(0, MAX_PRIZES).map(function (p, i) {
      var n = cut(clean(p && p.n), PRIZE_LEN).trim();
      if (!n) n = typeof autoName === 'function' ? autoName(i + 1) : 'Prize ' + (i + 1);
      var c = Math.round(Number(p && p.c));
      if (!isFinite(c) || c < 1) c = 1;
      if (c > MAX_PRIZE_COUNT) c = MAX_PRIZE_COUNT;
      return { n: n, c: c };
    });
  }
  function slotCount(prizes) { return prizes.reduce(function (a, p) { return a + p.c; }, 0); }

  // 설정 검사 → { ok, error, need, have, n } (error: noEntries · numRange · noPrizes · tooManySlots · tooFew · prizeTooBig)
  function validate(cfg) {
    cfg = cfg || {};
    var mode = MODES.indexOf(cfg.mode) >= 0 ? cfg.mode : 'names';
    var have;
    if (mode === 'numbers') {
      var N = Number(cfg.N);
      if (!isInt(N) || N < NUM_MIN || N > NUM_MAX) return { ok: false, error: 'numRange' };
      have = N;
    } else {
      have = (cfg.entries || []).length;
      if (have < MIN_ENTRIES) return { ok: false, error: 'noEntries', have: have };
    }
    var prizes = cfg.prizes || [];
    if (!prizes.length) return { ok: false, error: 'noPrizes' };
    var slots = slotCount(prizes);
    if (slots > MAX_SLOTS) return { ok: false, error: 'tooManySlots', need: slots };
    if (cfg.unique !== false && slots > have) return { ok: false, error: 'tooFew', need: slots, have: have };
    if (cfg.unique === false) {
      var big = prizes.filter(function (p) { return p.c > have; })[0];
      if (big) return { ok: false, error: 'prizeTooBig', need: big.c, have: have, n: big.n };
    }
    return { ok: true, have: have, need: slots };
  }

  // cfg = { mode, entries?, N?, prizes, order, unique } → 새 추첨(검사 실패면 null)
  function newRaffle(cfg) {
    if (!validate(cfg).ok) return null;
    var r = {
      v: V,
      mode: cfg.mode === 'numbers' ? 'numbers' : 'names',
      prizes: cfg.prizes.map(function (p) { return { n: p.n, c: p.c }; }),
      order: ORDERS.indexOf(cfg.order) >= 0 ? cfg.order : 'up',
      unique: cfg.unique !== false,
      wins: [],     // [{ p: 상 번호, e: 사람(이름 = entries 번호, 번호표 = 번호), b: 묶음 번호 }]
      t0: 0,
      done: false,
      ended: false
    };
    if (r.mode === 'numbers') r.N = Number(cfg.N);
    else r.entries = cfg.entries.map(function (e) { return { n: e.n, w: e.w }; });
    return r;
  }

  // 뽑는 순서대로 상 번호(개수만큼 반복). up = 아래(작은 상)부터, down = 위(큰 상)부터
  function slots(r) {
    var out = [];
    var idx = r.prizes.map(function (p, i) { return i; });
    if (r.order === 'up') idx.reverse();
    idx.forEach(function (i) { for (var k = 0; k < r.prizes[i].c; k++) out.push(i); });
    return out;
  }
  function total(r) { return slotCount(r.prizes); }
  function isComplete(r) { return r.wins.length >= total(r); }
  function currentPrize(r) { var s = slots(r); return r.wins.length < s.length ? s[r.wins.length] : -1; }
  function wonIn(r, p) { return r.wins.filter(function (w) { return w.p === p; }).length; }
  function leftIn(r, p) { return p < 0 ? 0 : r.prizes[p].c - wonIn(r, p); }
  function entryCount(r) { return r.mode === 'numbers' ? r.N : r.entries.length; }
  function weightOf(r, e) { return r.mode === 'numbers' ? 1 : r.entries[e].w; }
  function allIds(r) {
    var out = [];
    if (r.mode === 'numbers') for (var i = 1; i <= r.N; i++) out.push(i);
    else for (var j = 0; j < r.entries.length; j++) out.push(j);
    return out;
  }
  // 지금 상에서 뽑을 수 있는 사람(unique 면 아직 당첨 안 된 사람, 아니면 이 상에 아직 안 뽑힌 사람)
  function eligible(r, p) {
    if (p === undefined) p = currentPrize(r);
    if (p < 0) return [];
    var taken = {};
    r.wins.forEach(function (w) { if (r.unique || w.p === p) taken[w.e] = 1; });
    return allIds(r).filter(function (e) { return !taken[e]; });
  }
  function pickFrom(r, ids, nextU32) {
    var tot = 0;
    ids.forEach(function (e) { tot += weightOf(r, e); });
    if (!tot) return -1;
    var x = uniformInt(tot, nextU32 || cryptoU32);
    for (var i = 0; i < ids.length; i++) { x -= weightOf(r, ids[i]); if (x < 0) return ids[i]; }
    return ids[ids.length - 1];
  }
  function nextBatch(r) { return r.wins.length ? r.wins[r.wins.length - 1].b + 1 : 1; }
  // 한 명 뽑기 → { p, e, b } (끝났거나 끝낸 추첨이면 null)
  function draw(r, nextU32, now, batch) {
    if (!r || r.ended || isComplete(r)) return null;
    var p = currentPrize(r);
    var e = pickFrom(r, eligible(r, p), nextU32);
    if (e === -1 || e === undefined) return null;
    var w = { p: p, e: e, b: batch || nextBatch(r) };
    r.wins.push(w);
    if (!r.t0) r.t0 = now || Date.now();
    return w;
  }
  // 지금 상의 남은 개수를 한꺼번에(같은 묶음) → [win…]
  function drawRest(r, nextU32, now) {
    var p = currentPrize(r);
    if (p < 0 || r.ended) return [];
    var b = nextBatch(r);
    var out = [];
    while (!isComplete(r) && currentPrize(r) === p) {
      var w = draw(r, nextU32, now, b);
      if (!w) break;
      out.push(w);
    }
    return out;
  }
  // 마지막 뽑기(묶음) 취소 → 취소한 [win…]
  function undo(r) {
    if (!r || r.ended || !r.wins.length) return [];
    var b = r.wins[r.wins.length - 1].b;
    var out = [];
    while (r.wins.length && r.wins[r.wins.length - 1].b === b) out.unshift(r.wins.pop());
    if (!r.wins.length) r.t0 = 0;
    return out;
  }
  function end(r, now) {
    if (!r || r.ended) return false;
    r.ended = true;
    r.t1 = now || Date.now();
    return true;
  }
  // 연출용: 지금 뽑을 수 있는 사람 중 아무나(crypto, 가중치 없음)
  function teaseId(r, nextU32) {
    var ids = eligible(r);
    if (!ids.length) ids = allIds(r);
    return ids.length ? ids[uniformInt(ids.length, nextU32 || cryptoU32)] : -1;
  }
  // 사람 이름표(번호표는 숫자 그대로 — 화면에서 언어별로 꾸민다)
  function labelOf(r, e) { return r.mode === 'numbers' ? e : r.entries[e].n; }
  // 결과: 상 목록 순서(위 = 큰 상)대로, 상 안에서는 뽑힌 순서 → [{ p, n, c, winners: [label…] }]
  function grouped(r) {
    return r.prizes.map(function (pr, i) {
      return { p: i, n: pr.n, c: pr.c, winners: r.wins.filter(function (w) { return w.p === i; }).map(function (w) { return labelOf(r, w.e); }) };
    });
  }

  // ---------------------------------------------------------------- 저장 상태 검사 (localStorage raffle_state)
  function sanitize(o) {
    try {
      if (!o || typeof o !== 'object' || o.v !== V || MODES.indexOf(o.mode) < 0 || ORDERS.indexOf(o.order) < 0) return null;
      var r = { v: V, mode: o.mode, order: o.order, unique: o.unique !== false, wins: [], t0: 0, done: o.done === true, ended: o.ended === true };
      if (!Array.isArray(o.prizes) || !o.prizes.length || o.prizes.length > MAX_PRIZES) return null;
      for (var i = 0; i < o.prizes.length; i++) {
        var p = o.prizes[i];
        if (!p || typeof p.n !== 'string' || !clean(p.n) || Array.from(p.n).length > PRIZE_LEN || !isInt(p.c) || p.c < 1 || p.c > MAX_PRIZE_COUNT) return null;
      }
      r.prizes = o.prizes.map(function (p) { return { n: p.n, c: p.c }; });
      if (o.mode === 'numbers') {
        if (!isInt(o.N) || o.N < NUM_MIN || o.N > NUM_MAX) return null;
        r.N = o.N;
      } else {
        if (!Array.isArray(o.entries) || o.entries.length < MIN_ENTRIES || o.entries.length > MAX_ENTRIES) return null;
        for (var j = 0; j < o.entries.length; j++) {
          var e = o.entries[j];
          if (!e || typeof e.n !== 'string' || !clean(e.n) || Array.from(e.n).length > MAX_LEN || !isInt(e.w) || e.w < 1 || e.w > MAX_TICKETS) return null;
        }
        r.entries = o.entries.map(function (e) { return { n: e.n, w: e.w }; });
      }
      if (!validate(r).ok) return null;
      if (!Array.isArray(o.wins) || o.wins.length > total(r)) return null;
      // 처음부터 다시 쌓아 보며 확인(상 순서·자격·묶음 번호)
      for (var k = 0; k < o.wins.length; k++) {
        var w = o.wins[k];
        if (!w || !isInt(w.p) || !isInt(w.e) || !isInt(w.b) || w.b < 1) return null;
        if (w.p !== currentPrize(r)) return null;
        if (eligible(r, w.p).indexOf(w.e) < 0) return null;
        if (r.wins.length && w.b < r.wins[r.wins.length - 1].b) return null;
        r.wins.push({ p: w.p, e: w.e, b: w.b });
      }
      if (r.wins.length) r.t0 = isInt(o.t0) && o.t0 > 0 ? o.t0 : Date.now();
      if (isInt(o.t1)) r.t1 = o.t1;
      return r;
    } catch (err) { return null; }
  }

  // ---------------------------------------------------------------- 공유 링크 (#r=…) — 결과 목록만, UTF-8 안전 base64url
  function b64urlEncode(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  // 결과 → { m: 'a'(이름) | 'n'(번호표), p: [[상 이름, [당첨자…]], …] } (당첨자가 있는 상만). 너무 길면 null
  function encodeResult(r) {
    if (!r || !r.wins.length) return null;
    var groups = grouped(r).filter(function (g) { return g.winners.length; }).map(function (g) { return [g.n, g.winners]; });
    var code = b64urlEncode(JSON.stringify({ v: V, m: r.mode === 'numbers' ? 'n' : 'a', p: groups }));
    return code.length > SHARE_MAX ? null : code;
  }
  // → { mode, groups: [{ n, winners }] } 또는 null
  function decodeResult(str) {
    if (!str || typeof str !== 'string' || str.length > SHARE_MAX || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var o = JSON.parse(b64urlDecode(str));
      if (!o || o.v !== V || (o.m !== 'a' && o.m !== 'n') || !Array.isArray(o.p) || !o.p.length || o.p.length > MAX_PRIZES) return null;
      var count = 0;
      var groups = [];
      for (var i = 0; i < o.p.length; i++) {
        var g = o.p[i];
        if (!Array.isArray(g) || g.length !== 2 || typeof g[0] !== 'string' || !clean(g[0]) || Array.from(g[0]).length > PRIZE_LEN) return null;
        if (!Array.isArray(g[1]) || !g[1].length || g[1].length > MAX_PRIZE_COUNT) return null;
        for (var j = 0; j < g[1].length; j++) {
          var x = g[1][j];
          if (o.m === 'n' ? !(isInt(x) && x >= 1 && x <= NUM_MAX) : !(typeof x === 'string' && clean(x) && Array.from(x).length <= MAX_LEN)) return null;
        }
        count += g[1].length;
        groups.push({ n: clean(g[0]), winners: g[1].map(function (x) { return o.m === 'n' ? x : clean(x); }) });
      }
      if (count > MAX_SLOTS) return null;
      return { mode: o.m === 'n' ? 'numbers' : 'names', groups: groups };
    } catch (e) { return null; }
  }

  return {
    V: V, MODES: MODES, ORDERS: ORDERS,
    MAX_ENTRIES: MAX_ENTRIES, MAX_LEN: MAX_LEN, MAX_TICKETS: MAX_TICKETS, MIN_ENTRIES: MIN_ENTRIES,
    NUM_MIN: NUM_MIN, NUM_MAX: NUM_MAX, MAX_PRIZES: MAX_PRIZES, MAX_PRIZE_COUNT: MAX_PRIZE_COUNT, MAX_SLOTS: MAX_SLOTS, PRIZE_LEN: PRIZE_LEN,
    uniformInt: uniformInt, cryptoU32: cryptoU32,
    parseEntries: parseEntries, cleanPrizes: cleanPrizes, slotCount: slotCount, validate: validate, newRaffle: newRaffle,
    slots: slots, total: total, isComplete: isComplete, currentPrize: currentPrize, wonIn: wonIn, leftIn: leftIn,
    entryCount: entryCount, eligible: eligible, draw: draw, drawRest: drawRest, undo: undo, end: end,
    teaseId: teaseId, labelOf: labelOf, grouped: grouped, sanitize: sanitize,
    b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode, encodeResult: encodeResult, decodeResult: decodeResult
  };
});
