/* apps/penalty/penalty-core.js — 벌칙 카드 뒤집기 언어 무관 로직 (UMD: 브라우저 window.PENALTY_CORE + Node 검사 공용)
 *   - 인원 2~12명. 카드는 인원 수만큼, 그중 벌칙 K장(기본 자동: 인원/3 반올림, 최소 1), 나머지는 꽝.
 *   - 배정: crypto.getRandomValues 거부 샘플링 → Fisher–Yates. 벌칙 문구는 목록을 섞어 순서 없이 뽑는다
 *     (목록이 K보다 짧으면 섞은 목록을 되풀이). 섞는 순간 모든 카드가 정해진다. 뒤집는 것은 보여 주기만 한다.
 *   - 뒤집는 순서 k(1, 2, …)번째 사람 = 이름 k번째(없으면 "k번"). 어느 카드를 누르든 결과는 같은 확률.
 *   - 공유 링크: #d=<UTF-8 base64url(JSON {v:1,n,m?,r})>. r = 뒤집은 순서대로 벌칙 문구(문자열) 또는 0(꽝).
 *     받은 사람은 다시 섞지 않고 같은 결과를 본다. 틀리면 null.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PENALTY_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_PLAYERS = 2;
  var MAX_PLAYERS = 12;
  var MAX_ITEMS = 30;
  var MAX_ITEM_LEN = 60;
  var MAX_NAME = 20;
  var U32 = 4294967296;
  var DEFAULTS = { players: 6, penalties: null, names: '', items: null };
  var STORE_VERSION = 1;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 값으로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시 뽑는다 → 치우침 없음).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('penalty-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('penalty-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('penalty-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // Fisher–Yates. randInt(max) 주입 가능(검사용). 원본 배열은 건드리지 않는다.
  function shuffle(arr, randInt) {
    var ri = randInt || cryptoInt;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // 기본 벌칙 장수: 인원 ÷ 3 (반올림), 최소 1, 인원을 넘지 않음.
  function autoPenalties(players) {
    var n = Math.floor(Number(players)) || 0;
    return Math.min(Math.max(1, Math.round(n / 3)), Math.max(1, n));
  }

  function stripControl(s) {
    return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>{};]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // 줄바꿈으로 나뉜 벌칙 문구 → 정리된 배열(빈 줄 제외, 각 문구 60자 이내로 자름)
  function cleanItems(text) {
    var list = Array.isArray(text) ? text : String(text == null ? '' : text).split(/\r?\n/);
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var s = stripControl(list[i]);
      if (!s) continue;
      out.push(s.length > MAX_ITEM_LEN ? s.slice(0, MAX_ITEM_LEN) : s);
    }
    return out;
  }

  // 줄바꿈으로 나뉜 참가자 이름 → 정리된 배열(빈 줄 제외, 20자 이내)
  function cleanNames(text) {
    var list = Array.isArray(text) ? text : String(text == null ? '' : text).split(/\r?\n/);
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var s = stripControl(list[i]);
      if (!s) continue;
      out.push(s.length > MAX_NAME ? s.slice(0, MAX_NAME) : s);
    }
    return out;
  }

  // 설정 검사 → 오류 키 배열(빈 배열이면 통과). 키는 PAGE_I18N.errors 와 맞춘다.
  function validate(o) {
    var errs = [];
    var n = Math.floor(Number(o.players));
    if (!(n >= MIN_PLAYERS && n <= MAX_PLAYERS)) errs.push('playersRange');
    var items = cleanItems(o.items);
    if (items.length === 0) errs.push('itemsEmpty');
    if (items.length > MAX_ITEMS) errs.push('itemsTooMany');
    var k = Math.floor(Number(o.penalties));
    if (!(k >= 1 && k <= (n >= MIN_PLAYERS ? n : 1))) errs.push('penaltiesRange');
    var names = cleanNames(o.names);
    if (names.length > (n || 0)) errs.push('namesTooMany');
    return errs;
  }

  // 배정: 카드 n장 중 벌칙 k장을 무작위 위치에 두고, 벌칙 문구를 섞어 차례로 넣는다.
  // 반환: deck — 길이 n, 각 칸은 벌칙 문구(string) 또는 null(꽝).
  function deal(n, k, items, randInt) {
    var pool = [];
    for (var i = 0; i < n; i++) pool.push(i < k ? 1 : 0);
    var positions = shuffle(pool, randInt);
    var texts = shuffle(items, randInt);
    var deck = [];
    var t = 0;
    for (var p = 0; p < n; p++) {
      if (positions[p]) {
        deck.push(texts[t % texts.length]);
        t++;
      } else {
        deck.push(null);
      }
    }
    return deck;
  }

  // 새 판. opts: { players, penalties, items(문자열 또는 배열), names(문자열 또는 배열, 선택), randInt(검사용) }
  function newSession(opts) {
    var n = Math.floor(Number(opts.players));
    var k = opts.penalties == null ? autoPenalties(n) : Math.floor(Number(opts.penalties));
    var errs = validate({ players: n, penalties: k, items: opts.items, names: opts.names || '' });
    if (errs.length) throw new Error('penalty-core: ' + errs.join(','));
    var items = cleanItems(opts.items);
    var names = cleanNames(opts.names || '');
    return {
      n: n,
      k: k,
      names: names.length ? names : null,
      deck: deal(n, k, items, opts.randInt),
      flipped: [],
      items: items
    };
  }

  function sessionNames(s) {
    var out = [];
    for (var i = 0; i < s.n; i++) out.push(s.names && s.names[i] ? s.names[i] : null);
    return out;
  }

  // 한 장 뒤집기. pos = 덱에서 위치(0 ≤ pos < n). 이미 뒤집힌 카드는 다시 뒤집지 않는다(되돌리기 없음).
  // 반환: { k(뒤집은 순서 1부터), name(이름 또는 null), text(벌칙 문구 또는 null) }
  function flip(s, pos) {
    if (!(pos >= 0 && pos < s.n) || s.flipped.indexOf(pos) >= 0) return null;
    s.flipped.push(pos);
    return { k: s.flipped.length, name: s.names && s.names[s.flipped.length - 1] || null, text: s.deck[pos] };
  }

  function flipAll(s) {
    var out = [];
    for (var p = 0; p < s.n; p++) {
      var r = flip(s, p);
      if (r) out.push(r);
    }
    return out;
  }

  // 결과: 뒤집은 순서대로 [{k, name, text}]
  function results(s) {
    return s.flipped.map(function (pos, i) {
      return { k: i + 1, name: s.names && s.names[i] || null, text: s.deck[pos] };
    });
  }

  function penaltyCount(s) {
    return s.deck.filter(function (x) { return !!x; }).length;
  }

  function isDone(s) { return s.flipped.length >= s.n; }

  // ---- 공유 링크 (#d=) ----
  function b64urlEncode(str) {
    var bin = unescape(encodeURIComponent(str));
    var b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    return decodeURIComponent(escape(bin));
  }

  // rec = { n, names(선택, 배열), results(results() 의 text 배열 — 뒤집은 순서) }
  function encodeShare(rec) {
    var o = { v: STORE_VERSION, n: rec.n, r: rec.r.map(function (t) { return t ? t : 0; }) };
    if (rec.names && rec.names.length) o.m = rec.names;
    return b64urlEncode(JSON.stringify(o));
  }

  // 받은 링크 검사·정리. 틀리면 null.
  function decodeShare(str) {
    if (!str) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || o.v !== STORE_VERSION) return null;
    var n = o.n;
    if (!(Number.isInteger(n) && n >= MIN_PLAYERS && n <= MAX_PLAYERS)) return null;
    if (!Array.isArray(o.r) || o.r.length !== n) return null;
    var r = [];
    var pen = 0;
    for (var i = 0; i < n; i++) {
      var x = o.r[i];
      if (x === 0) { r.push(null); continue; }
      if (typeof x !== 'string') return null;
      var t = stripControl(x);
      if (!t) return null;
      r.push(t.length > MAX_ITEM_LEN ? t.slice(0, MAX_ITEM_LEN) : t);
      pen++;
    }
    if (pen < 1) return null;
    var names = null;
    if (o.m !== undefined) {
      if (!Array.isArray(o.m) || o.m.length > n) return null;
      names = o.m.map(function (s) {
        var t = typeof s === 'string' ? stripControl(s).slice(0, MAX_NAME) : '';
        return t || null;
      });
      if (names.every(function (s) { return !s; })) names = null;
    }
    return { n: n, names: names, r: r, k: pen };
  }

  // 저장된 설정(localStorage) 정리. 없거나 틀리면 기본값.
  function cleanState(o) {
    var base = { players: DEFAULTS.players, penalties: null, names: '', items: null };
    if (!o || typeof o !== 'object') return base;
    var n = Math.floor(Number(o.players));
    if (n >= MIN_PLAYERS && n <= MAX_PLAYERS) base.players = n;
    if (o.penalties != null) {
      var k = Math.floor(Number(o.penalties));
      if (k >= 1 && k <= base.players) base.penalties = k;
    }
    if (typeof o.names === 'string') base.names = o.names.split(/\r?\n/).slice(0, MAX_PLAYERS).join('\n').slice(0, 400);
    if (Array.isArray(o.items)) {
      var items = cleanItems(o.items).slice(0, MAX_ITEMS);
      if (items.length) base.items = items;
    }
    return base;
  }

  return {
    MIN_PLAYERS: MIN_PLAYERS,
    MAX_PLAYERS: MAX_PLAYERS,
    MAX_ITEMS: MAX_ITEMS,
    MAX_ITEM_LEN: MAX_ITEM_LEN,
    MAX_NAME: MAX_NAME,
    DEFAULTS: DEFAULTS,
    uniformInt: uniformInt,
    cryptoInt: cryptoInt,
    shuffle: shuffle,
    autoPenalties: autoPenalties,
    cleanItems: cleanItems,
    cleanNames: cleanNames,
    validate: validate,
    deal: deal,
    newSession: newSession,
    sessionNames: sessionNames,
    flip: flip,
    flipAll: flipAll,
    results: results,
    penaltyCount: penaltyCount,
    isDone: isDone,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    b64urlEncode: b64urlEncode,
    b64urlDecode: b64urlDecode,
    cleanState: cleanState
  };
});
