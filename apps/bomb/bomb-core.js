/* apps/bomb/bomb-core.js — 폭탄 돌리기 언어 무관 로직 (UMD: 브라우저 window.BOMB_CORE + Node 검사 공용)
 *   - 이름 2~12명(줄바꿈·쉼표) 또는 이름 없이 "그냥 하기".
 *   - 심지 길이(터지는 시각)를 시작할 때 먼저 정한다: 짧게 10~25초 · 보통 20~45초 · 길게 40~80초 범위에서
 *     crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음)으로 1ms 단위 균등. 화면에는 절대 보여 주지 않는다.
 *   - 심지 시계(newFuse/fuseStart/fusePause/fuseElapsed): 멈춘 동안(숨은 탭)은 시간이 흐르지 않는다.
 *   - 째깍 소리·진동 박자(planTicks): 끝으로 갈수록 빨라지지만 시작점·곡선·최고 속도·가짜 질주 구간·박자마다 흔들림을 모두 crypto 로
 *     섞어서, 박자만 듣고 남은 시간을 정확히 알 수 없게 한다(같은 "남은 2초"에도 박자가 판마다 크게 다르다).
 *   - 넘기기: 누를 때마다 다음 사람(앉은 순서), 연타 방지 PASS_COOLDOWN_MS. 첫 사람은 crypto 로 고른다.
 *   - 벌칙 미션 카드: 언어 파일의 12장을 crypto 로 섞어 한 장씩(다 쓰기 전 반복 없음). 목록으로 보여 주지 않는다.
 *   - 공유 링크(#d=): 이름만. 결과·심지 길이는 담지 않는다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BOMB_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_PLAYERS = 2;
  var MAX_PLAYERS = 12;
  var MAX_NAME = 14;
  var HISTORY_MAX = 10;
  var PASS_COOLDOWN_MS = 600;   // 넘긴 뒤 이 시간 동안은 다시 넘길 수 없다(혼자 연타 방지)
  var MIN_TICK_MS = 90;         // 박자 사이 최소 간격
  // 심지 길이(ms, 양 끝 포함). 화면 문구(10–25 s 등)와 같아야 한다.
  var FUSES = { short: [10000, 25000], normal: [20000, 45000], long: [40000, 80000] };
  var FUSE_KEYS = ['short', 'normal', 'long'];
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('bomb-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('bomb-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('bomb-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }
  // [a, b] 사이 실수(연출용, 0.0001 단위, crypto)
  function randRange(a, b, randInt) { var ri = randInt || cryptoInt; return a + (b - a) * (ri(10001) / 10000); }

  // Fisher–Yates (뒤에서부터, j = 0..i 균등). 원본은 건드리지 않는다.
  function shuffle(arr, randInt) {
    var ri = randInt || cryptoInt;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 심지
  function fuseKey(k) { return FUSES[k] ? k : 'normal'; }
  // 터지는 시각(ms): 범위 [min, max] 안 정수 균등
  function drawFuse(mode, randInt) {
    var ri = randInt || cryptoInt;
    var r = FUSES[fuseKey(mode)];
    return r[0] + ri(r[1] - r[0] + 1);
  }
  // 심지 시계: 흐른 시간 = 쌓인 시간 + (타는 중이면 지금 − 다시 붙인 시각). 멈추면 그 자리에서 선다.
  function newFuse(total) { return { total: total, acc: 0, since: null }; }
  function fuseStart(f, now) { if (f.since == null) f.since = now; return f; }
  function fusePause(f, now) { if (f.since != null) { f.acc += Math.max(0, now - f.since); f.since = null; } return f; }
  function fuseRunning(f) { return f.since != null; }
  function fuseElapsed(f, now) { return Math.min(f.total, f.acc + (f.since != null ? Math.max(0, now - f.since) : 0)); }
  function fuseDone(f, now) { return fuseElapsed(f, now) >= f.total; }

  // ---------------------------------------------------------------- 째깍 박자
  // 박자 시각 목록(ms, 0 ≤ t < total). 박자 간격 = 기본 곡선 × 가짜 질주 × 흔들림.
  //   기본 곡선: 시작점(onset, 전체의 20~55%) 전에는 느린 간격 I0(600~780ms), 그 뒤로 (1 − q)^k (k 1.5~2.8) 로 Imin(105~150ms)까지 줄어든다.
  //   가짜 질주: 전체의 10~80% 안에 1~3번, 1.2~2.8초 동안 간격 × 0.45~0.65 (곧 터질 것처럼 들리지만 아님).
  //   흔들림: 박자마다 × 0.85~1.15.
  function planTicks(total, randInt) {
    var ri = randInt || cryptoInt;
    var I0 = randRange(600, 780, ri);
    var Imin = randRange(105, 150, ri);
    var onset = total * randRange(0.2, 0.55, ri);
    var k = randRange(1.5, 2.8, ri);
    var fakes = [];
    var nf = 1 + ri(3);
    for (var i = 0; i < nf; i++) {
      var a = total * randRange(0.1, 0.8, ri);
      fakes.push([a, a + randRange(1200, 2800, ri), randRange(0.45, 0.65, ri)]);
    }
    function base(t) {
      if (t <= onset) return I0;
      var q = Math.min(1, (t - onset) / (total - onset));
      return Imin + (I0 - Imin) * Math.pow(1 - q, k);
    }
    var ticks = [];
    var t = 0;
    while (t < total && ticks.length < 5000) {
      ticks.push(Math.floor(t));
      var iv = base(t);
      for (var j = 0; j < fakes.length; j++) if (t >= fakes[j][0] && t < fakes[j][1]) iv *= fakes[j][2];
      iv *= randRange(0.85, 1.15, ri);
      t += Math.max(MIN_TICK_MS, iv);
    }
    return ticks;
  }
  // 그 시각의 박자 간격(ms) — 힌트(불꽃 속도)용. 마지막 박자 뒤는 그 앞 간격.
  function tickGap(ticks, t) {
    if (!ticks || ticks.length < 2) return 600;
    var i = 1;
    while (i < ticks.length && ticks[i] <= t) i++;
    if (i >= ticks.length) i = ticks.length - 1;
    return ticks[i] - ticks[i - 1];
  }

  // ---------------------------------------------------------------- 넘기기
  function firstHolder(n, randInt) { return n > 0 ? (randInt || cryptoInt)(n) : -1; }
  function nextHolder(holder, n) { return n > 0 ? (holder + 1) % n : -1; }
  function canPass(lastPassAt, now) { return lastPassAt == null || now - lastPassAt >= PASS_COOLDOWN_MS; }

  // ---------------------------------------------------------------- 글자 정리 · 이름 · 검사
  function cleanText(v, max) {
    var s = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069<>{}]/g, ' ').replace(/\s+/g, ' ').trim();
    var chars = Array.from(s);
    return chars.length > max ? chars.slice(0, max).join('').trim() : s;
  }
  function textLen(s) { return Array.from(String(s)).length; }
  // 이름: 줄바꿈·쉼표로 나눈다. 같은 이름은 " 2" " 3" 을 붙여 구분.
  function parseNames(text) {
    var list = Array.isArray(text) ? text : String(text == null ? '' : text).split(/[\n\r,，、;；]+/);
    var out = [];
    var seen = {};
    var long = false;
    list.forEach(function (raw) {
      var n = cleanText(raw, MAX_NAME + 50);
      if (!n) return;
      if (textLen(n) > MAX_NAME) { long = true; n = cleanText(n, MAX_NAME); }
      var base = n;
      var k = 1;
      while (seen[n.toLowerCase()]) { k++; n = cleanText(base, MAX_NAME - String(k).length - 1) + ' ' + k; }
      seen[n.toLowerCase()] = 1;
      out.push(n);
    });
    return { names: out, long: long };
  }
  // raw = { mode:'free'|'names', names:text, fuse:'short'|'normal'|'long', hints:bool, missions:bool }
  function validate(raw) {
    raw = raw || {};
    var mode = raw.mode === 'names' ? 'names' : 'free';
    var cfg = { mode: mode, names: [], fuse: fuseKey(raw.fuse), hints: !!raw.hints, missions: !!raw.missions };
    var long = false;
    if (mode === 'names') {
      var nm = parseNames(raw.names);
      long = nm.long;
      if (nm.names.length < MIN_PLAYERS) return { ok: false, error: 'namesTooFew' };
      if (nm.names.length > MAX_PLAYERS) return { ok: false, error: 'namesTooMany', n: nm.names.length };
      cfg.names = nm.names;
    }
    return { ok: true, cfg: cfg, longName: long };
  }

  // ---------------------------------------------------------------- 벌칙 미션 덱 (한 장씩, 다 쓰기 전 반복 없음)
  function missionDeck(len, randInt) {
    var order = [];
    for (var i = 0; i < len; i++) order.push(i);
    return { len: len, order: shuffle(order, randInt), pos: 0 };
  }
  function nextMission(deck, randInt) {
    if (!deck || !deck.len) return -1;
    if (deck.pos >= deck.order.length) {
      var lastOne = deck.order[deck.order.length - 1];
      deck.order = shuffle(deck.order, randInt);
      if (deck.len > 1 && deck.order[0] === lastOne) { var t = deck.order[0]; deck.order[0] = deck.order[1]; deck.order[1] = t; }
      deck.pos = 0;
    }
    return deck.order[deck.pos++];
  }

  // ---------------------------------------------------------------- 기록
  // item = { t: 시각, who: 걸린 이름('' = 이름 없이), n: 인원(0 = 이름 없이), p: 넘긴 횟수, ms: 심지 길이, f: 'short'|'normal'|'long' }
  function pushHistory(list, item) {
    var out = [item].concat(Array.isArray(list) ? list : []);
    return out.slice(0, HISTORY_MAX);
  }
  function sanitizeHistory(list) {
    if (!Array.isArray(list)) return [];
    var isInt = function (x) { return typeof x === 'number' && x === Math.floor(x); };
    return list.filter(function (h) {
      if (!h || typeof h !== 'object' || typeof h.t !== 'number' || !isFinite(h.t) || typeof h.who !== 'string' || !FUSES[h.f]) return false;
      if (!isInt(h.n) || !(h.n === 0 || (h.n >= MIN_PLAYERS && h.n <= MAX_PLAYERS))) return false;
      if ((h.n === 0) !== (h.who === '') || textLen(h.who) > MAX_NAME + 6) return false;
      if (!isInt(h.p) || h.p < 0 || h.p > 99999) return false;
      return isInt(h.ms) && h.ms >= FUSES[h.f][0] && h.ms <= FUSES[h.f][1];
    }).map(function (h) { return { t: h.t, who: cleanText(h.who, MAX_NAME + 6), n: h.n, p: h.p, ms: h.ms, f: h.f }; }).slice(0, HISTORY_MAX);
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=…) — 이름만
  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    return Buffer.from(str, 'utf8');
  }
  function b64urlEncode(str) {
    var bytes = utf8Bytes(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    var b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  function encodeShare(o) {
    if (!o || !Array.isArray(o.names)) return null;
    var m = parseNames(o.names).names;
    if (m.length < MIN_PLAYERS || m.length > MAX_PLAYERS) return null;
    return b64urlEncode(JSON.stringify({ v: 1, m: m }));
  }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1) return null;
    if (Object.keys(o).some(function (k) { return k !== 'v' && k !== 'm'; })) return null;
    if (!Array.isArray(o.m) || o.m.length < MIN_PLAYERS || o.m.length > MAX_PLAYERS) return null;
    if (o.m.some(function (x) { return typeof x !== 'string' || textLen(x) > MAX_NAME * 2; })) return null;
    var names = parseNames(o.m).names;
    if (names.length < MIN_PLAYERS) return null;
    return { names: names };
  }

  return {
    MIN_PLAYERS: MIN_PLAYERS, MAX_PLAYERS: MAX_PLAYERS, MAX_NAME: MAX_NAME, HISTORY_MAX: HISTORY_MAX,
    PASS_COOLDOWN_MS: PASS_COOLDOWN_MS, MIN_TICK_MS: MIN_TICK_MS, FUSES: FUSES, FUSE_KEYS: FUSE_KEYS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, randRange: randRange, shuffle: shuffle,
    drawFuse: drawFuse, newFuse: newFuse, fuseStart: fuseStart, fusePause: fusePause, fuseRunning: fuseRunning, fuseElapsed: fuseElapsed, fuseDone: fuseDone,
    planTicks: planTicks, tickGap: tickGap, firstHolder: firstHolder, nextHolder: nextHolder, canPass: canPass,
    cleanText: cleanText, parseNames: parseNames, validate: validate, missionDeck: missionDeck, nextMission: nextMission,
    pushHistory: pushHistory, sanitizeHistory: sanitizeHistory, b64urlEncode: b64urlEncode, encodeShare: encodeShare, decodeShare: decodeShare
  };
});
