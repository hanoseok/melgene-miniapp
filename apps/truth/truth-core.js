/* apps/truth/truth-core.js — 진실 게임(Truth or Dare) 언어 무관 로직 (UMD: 브라우저 window.TRUTH_CORE + Node 검사 공용)
 *   - 모드: names(이름 2~20명) · free(이름 없이 휴대폰을 옆 사람에게 넘기며 진행).
 *   - 팩: friends · family · work(송년회·회식용 안전 팩) · couples(가벼운 커플 팩). 모두 깨끗한 내용만(언어 파일 packs).
 *   - 순서: 한 바퀴(cycle)마다 crypto 로 섞은 순서. 모두 한 번씩 하기 전에는 다시 나오지 않고,
 *     새 바퀴의 첫 사람이 바로 앞 사람과 같으면 그 사람을 나머지 중 무작위 자리와 바꾼다(연속 차례 없음).
 *   - 카드: 팩·종류(진실/도전)마다 섞은 덱에서 한 장씩. 세션 안에서는 덱을 다 쓰기 전까지 반복 없음,
 *     다 쓰면 다시 섞되 바로 앞 카드가 맨 앞에 오지 않게.
 *   - 랜덤 = crypto 로 진실/도전 반반.
 *   - 난수는 모두 crypto.getRandomValues + 거부 샘플링(모듈로 치우침 없음). 일반 의사 난수는 쓰지 않는다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TRUTH_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_PLAYERS = 2;
  var MAX_PLAYERS = 20;
  var MAX_NAME = 16;
  var MIN_CARDS = 40;              // 팩·종류마다 최소 카드 수(검사용)
  var PACKS = ['friends', 'family', 'work', 'couples'];
  var TYPES = ['truth', 'dare'];
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('truth-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('truth-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('truth-core: crypto.getRandomValues is not available');
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
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

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

  // raw = { mode:'names'|'free', names:text, pack }
  function validate(raw) {
    raw = raw || {};
    var mode = raw.mode === 'free' ? 'free' : 'names';
    var pack = PACKS.indexOf(raw.pack) >= 0 ? raw.pack : PACKS[0];
    var cfg = { mode: mode, names: [], pack: pack };
    var long = false;
    if (mode === 'names') {
      var nm = parseNames(raw.names);
      long = nm.long;
      if (nm.names.length < MIN_PLAYERS) return { ok: false, error: 'namesTooFew', field: 'names', n: nm.names.length };
      if (nm.names.length > MAX_PLAYERS) return { ok: false, error: 'namesTooMany', field: 'names', n: nm.names.length };
      cfg.names = nm.names;
    }
    return { ok: true, cfg: cfg, longName: long };
  }

  // ---------------------------------------------------------------- 차례 (섞은 바퀴, 모두 한 번씩)
  function newTurns(n, randInt) {
    return { n: n, order: shuffle(range(n), randInt), pos: 0, cycle: 1, last: -1 };
  }
  // 다음 사람 번호. 바퀴가 끝나면 다시 섞고, 새 바퀴 첫 사람이 바로 앞 사람이면 나머지 중 무작위 자리와 바꾼다.
  function nextPlayer(st, randInt) {
    var ri = randInt || cryptoInt;
    if (!st || !(st.n >= 1)) return -1;
    if (st.pos >= st.order.length) {
      st.order = shuffle(range(st.n), ri);
      st.pos = 0;
      st.cycle++;
      if (st.n > 1 && st.order[0] === st.last) {
        var j = 1 + ri(st.n - 1);
        var t = st.order[0]; st.order[0] = st.order[j]; st.order[j] = t;
      }
    }
    var p = st.order[st.pos++];
    st.last = p;
    return p;
  }

  // ---------------------------------------------------------------- 카드 덱
  function newDeck(len, randInt) { return { len: len, order: shuffle(range(len), randInt), pos: 0, laps: 1 }; }
  // 다음 카드 번호. 다 쓰면 다시 섞는다(바로 앞 카드가 또 처음에 오지 않게 바꿔 둠).
  function nextCard(deck, randInt) {
    if (!deck || !deck.len) return -1;
    if (deck.pos >= deck.order.length) {
      var lastOne = deck.order[deck.order.length - 1];
      deck.order = shuffle(deck.order, randInt);
      if (deck.len > 1 && deck.order[0] === lastOne) { var t = deck.order[0]; deck.order[0] = deck.order[1]; deck.order[1] = t; }
      deck.pos = 0;
      deck.laps++;
    }
    return deck.order[deck.pos++];
  }
  // 팩 하나의 덱 묶음: { truth: deck, dare: deck }
  function newDecks(pack, randInt) {
    var out = {};
    TYPES.forEach(function (t) { out[t] = newDeck(pack && Array.isArray(pack[t]) ? pack[t].length : 0, randInt); });
    return out;
  }

  // ---------------------------------------------------------------- 진실/도전 고르기
  // choice = 'truth' | 'dare' | 'random' → 'truth' | 'dare' (랜덤은 crypto 반반)
  function pickType(choice, randInt) {
    if (choice === 'truth' || choice === 'dare') return choice;
    var ri = randInt || cryptoInt;
    return TYPES[ri(2)];
  }

  // ---------------------------------------------------------------- 요약 숫자
  function newStats() { return { rounds: 0, truths: 0, dares: 0, skips: 0, randoms: 0 }; }
  // 한 차례가 끝났을 때(카드를 보고 다음으로 넘어갈 때) 한 번
  function recordTurn(st, type, wasRandom) {
    st.rounds++;
    if (type === 'truth') st.truths++;
    else if (type === 'dare') st.dares++;
    if (wasRandom) st.randoms++;
    return st;
  }
  function recordSkip(st) { st.skips++; return st; }

  return {
    MIN_PLAYERS: MIN_PLAYERS, MAX_PLAYERS: MAX_PLAYERS, MAX_NAME: MAX_NAME, MIN_CARDS: MIN_CARDS, PACKS: PACKS, TYPES: TYPES,
    uniformInt: uniformInt, cryptoInt: cryptoInt, shuffle: shuffle,
    cleanText: cleanText, parseNames: parseNames, validate: validate,
    newTurns: newTurns, nextPlayer: nextPlayer, newDeck: newDeck, nextCard: nextCard, newDecks: newDecks,
    pickType: pickType, newStats: newStats, recordTurn: recordTurn, recordSkip: recordSkip
  };
});
