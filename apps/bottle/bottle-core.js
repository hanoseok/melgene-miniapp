/* apps/bottle/bottle-core.js — 병 돌리기 언어 무관 로직 (UMD: 브라우저 window.BOTTLE_CORE + Node 검사 공용)
 *   - 모드: free(이름 없이 아무 각도) · names(이름 2~12명을 원 둘레에 같은 간격으로 앉힘, 병은 그중 한 명을 가리킴).
 *   - 결과를 먼저 정한다: crypto.getRandomValues 거부 샘플링(모듈로 치우침 없음)으로 자리(또는 각도)를 고르고,
 *     그 다음 그 자리를 가리키도록 회전량을 계산해 애니메이션만 한다(손가락으로 튕겨도 결과는 crypto 가 정한 값).
 *   - 각도: 0° = 12시 방향(위), 시계 방향으로 증가. 자리 i 의 중심 = i × 360/n, 자리 i 의 칸 = [중심 − 칸/2, 중심 + 칸/2).
 *   - 겹치지 않기(skip): 한 바퀴(라운드) 동안 이미 뽑힌 사람은 빼고 남은 사람 중에서 고르게. 모두 뽑히면 다음 라운드.
 *   - 미션 카드(선택): 기본 목록 또는 직접 쓴 목록을 crypto 로 섞어 한 장씩(다 쓰면 다시 섞음).
 *   - 공유 링크(#d=): 이름 목록과 겹치지 않기 설정만(UTF-8 base64url JSON {v:1,m:[이름],s:0|1}). 결과는 담지 않는다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BOTTLE_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_SEATS = 2;
  var MAX_SEATS = 12;
  var MAX_NAME = 16;
  var MAX_PROMPTS = 30;
  var MAX_PROMPT = 80;
  var HISTORY_MAX = 10;
  var OFFSET_SPREAD = 0.38;      // 자리 칸 안에서 흔들 수 있는 폭(칸 절반의 비율 아님: 칸 전체 × 0.38 → 중심 ± 38%)
  var MIN_MS = 3000;
  var MAX_MS = 6000;
  var MIN_TURNS = 4;
  var MAX_TURNS = 7;
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('bottle-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('bottle-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('bottle-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // Fisher–Yates (뒤에서부터, j = 0..i 균등). randInt 주입 가능(검사용). 원본은 건드리지 않는다.
  function shuffle(arr, randInt) {
    var ri = randInt || cryptoInt;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 글자 정리
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
  // 미션 목록: 한 줄에 하나, 80자, 30개까지, 같은 줄은 하나로.
  function parsePrompts(text) {
    var out = [];
    var seen = {};
    String(text == null ? '' : text).split(/[\n\r]+/).forEach(function (raw) {
      var p = cleanText(raw, MAX_PROMPT);
      if (!p || seen[p.toLowerCase()] || out.length >= MAX_PROMPTS) return;
      seen[p.toLowerCase()] = 1;
      out.push(p);
    });
    return out;
  }

  // raw = { mode:'free'|'names', names:text, skip:bool, prompts:bool, promptSrc:'builtin'|'custom', custom:text }
  function validate(raw) {
    raw = raw || {};
    var mode = raw.mode === 'names' ? 'names' : 'free';
    var cfg = { mode: mode, names: [], skip: raw.skip !== false, prompts: !!raw.prompts, promptSrc: raw.promptSrc === 'custom' ? 'custom' : 'builtin', custom: [] };
    var long = false;
    if (mode === 'names') {
      var nm = parseNames(raw.names);
      long = nm.long;
      if (nm.names.length < MIN_SEATS) return { ok: false, error: 'namesTooFew', field: 'names' };
      if (nm.names.length > MAX_SEATS) return { ok: false, error: 'namesTooMany', field: 'names', n: nm.names.length };
      cfg.names = nm.names;
    }
    if (cfg.prompts && cfg.promptSrc === 'custom') {
      cfg.custom = parsePrompts(raw.custom);
      if (!cfg.custom.length) return { ok: false, error: 'promptsEmpty', field: 'custom' };
    }
    return { ok: true, cfg: cfg, longName: long };
  }

  // ---------------------------------------------------------------- 각도 ↔ 자리
  function norm(deg) { var d = deg % 360; return d < 0 ? d + 360 : d; }
  function sector(n) { return 360 / n; }
  function seatAngle(i, n) { return i * sector(n); }
  // 회전 각도(병 목이 가리키는 방향) → 자리 번호. 칸 경계는 [중심 − 칸/2, 중심 + 칸/2).
  function angleToSeat(deg, n) {
    var s = sector(n);
    return Math.floor(norm(norm(deg) + s / 2) / s) % n;
  }
  // 자리 i 를 가리키는 각도(0~360). frac ∈ [-1, 1] = 칸 중심에서 흔드는 정도(칸 × OFFSET_SPREAD 안).
  function targetAngle(i, n, frac) {
    var f = Math.max(-1, Math.min(1, Number(frac) || 0));
    return norm(seatAngle(i, n) + f * OFFSET_SPREAD * sector(n));
  }
  function randomFrac(randInt) { var ri = randInt || cryptoInt; return (ri(2001) - 1000) / 1000; }
  // 이름 없이: 0.0° ~ 359.9° 균등
  function randomAngle(randInt) { var ri = randInt || cryptoInt; return ri(3600) / 10; }

  // 현재 회전(누적 각도)에서 dir(+1 시계 / −1 반시계) 방향으로 turns 바퀴 돌고 target(0~360)에서 멈추는 최종 누적 각도.
  function planRotation(current, target, turns, dir) {
    var cur = Number(current) || 0;
    var d = dir < 0 ? -1 : 1;
    var t = norm(target);
    var base = cur + d * turns * 360;
    var delta = d > 0 ? norm(t - norm(base)) : -norm(norm(base) - t);
    return base + delta;
  }
  // 한 번 돌리기 계획(연출 값도 crypto): { turns, ms }
  function spinPlan(randInt) {
    var ri = randInt || cryptoInt;
    return { turns: MIN_TURNS + ri(MAX_TURNS - MIN_TURNS + 1), ms: MIN_MS + ri(MAX_MS - MIN_MS + 1) };
  }
  // 감속(ease-out quart). 0→0, 1→1, 단조 증가.
  function ease(t) { t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 4); }

  // ---------------------------------------------------------------- 자리 고르기 (겹치지 않기 라운드)
  function newRound(n) {
    var left = [];
    for (var i = 0; i < n; i++) left.push(i);
    return { n: n, left: left, round: 1, picked: [] };
  }
  // skip=true: 이번 라운드에서 아직 안 뽑힌 사람 중 균등. 남은 사람이 없으면(지난 판에 모두 뽑힘) 새 라운드를 열고 고른다.
  // skip=false: 매번 n 명 중 균등.
  function chooseSeat(st, skip, randInt) {
    var ri = randInt || cryptoInt;
    if (!skip) return ri(st.n);
    if (!st.left.length) { st.left = newRound(st.n).left; st.round++; st.picked = []; }
    var k = ri(st.left.length);
    var seat = st.left.splice(k, 1)[0];
    st.picked.push(seat);
    return seat;
  }

  // ---------------------------------------------------------------- 미션 카드 덱
  function promptDeck(len, randInt) {
    var idx = [];
    for (var i = 0; i < len; i++) idx.push(i);
    return { len: len, order: shuffle(idx, randInt), pos: 0 };
  }
  // 다음 카드 번호. 다 쓰면 다시 섞는다(바로 앞 카드가 또 처음에 오지 않게 한 번 바꿔 둠).
  function nextPrompt(deck, randInt) {
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
  function pushHistory(list, item) {
    var out = [item].concat(Array.isArray(list) ? list : []);
    return out.slice(0, HISTORY_MAX);
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=…) — 이름 목록만
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
    if (!o || !Array.isArray(o.names) || o.names.length < MIN_SEATS || o.names.length > MAX_SEATS) return null;
    return b64urlEncode(JSON.stringify({ v: 1, m: o.names.slice(), s: o.skip === false ? 0 : 1 }));
  }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1) return null;
    if (!Array.isArray(o.m) || o.m.length < MIN_SEATS || o.m.length > MAX_SEATS) return null;
    if (o.m.some(function (x) { return typeof x !== 'string' || textLen(x) > MAX_NAME * 2; })) return null;
    if (o.s !== 0 && o.s !== 1) return null;
    var nm = parseNames(o.m).names;
    if (nm.length !== o.m.length) return null;
    return { names: nm, skip: o.s === 1 };
  }

  return {
    MIN_SEATS: MIN_SEATS, MAX_SEATS: MAX_SEATS, MAX_NAME: MAX_NAME, MAX_PROMPTS: MAX_PROMPTS, MAX_PROMPT: MAX_PROMPT,
    HISTORY_MAX: HISTORY_MAX, OFFSET_SPREAD: OFFSET_SPREAD, MIN_MS: MIN_MS, MAX_MS: MAX_MS, MIN_TURNS: MIN_TURNS, MAX_TURNS: MAX_TURNS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, shuffle: shuffle,
    cleanText: cleanText, parseNames: parseNames, parsePrompts: parsePrompts, validate: validate,
    norm: norm, sector: sector, seatAngle: seatAngle, angleToSeat: angleToSeat, targetAngle: targetAngle,
    randomFrac: randomFrac, randomAngle: randomAngle, planRotation: planRotation, spinPlan: spinPlan, ease: ease,
    newRound: newRound, chooseSeat: chooseSeat, promptDeck: promptDeck, nextPrompt: nextPrompt, pushHistory: pushHistory,
    b64urlEncode: b64urlEncode, encodeShare: encodeShare, decodeShare: decodeShare
  };
});
