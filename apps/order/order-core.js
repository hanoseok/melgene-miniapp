/* apps/order/order-core.js — 순서 정하기 언어 무관 로직 (UMD: 브라우저 window.ORDER_CORE + Node 검사 공용)
 *   - 대상: 이름 목록(한 줄에 하나, 2~40개) 또는 번호 1..N(2~40).
 *   - 섞기: "섞기"를 누르는 순간 crypto.getRandomValues 거부 샘플링 + Fisher–Yates 로 1번째→N번째 전체 순서를 한 번에 정한다.
 *     공개(한 장씩·자동·한꺼번에)는 이미 정해진 순서를 보여 주기만 한다.
 *   - 공유 링크: #r=<UTF-8 base64url(JSON)>
 *       이름: {v:1,p:<프리셋 0..3>,o:["이름",…]}   (o = 1번째부터 순서대로)
 *       번호: {v:1,p:<프리셋>,n:[3,1,2,…]}          (1..N 의 순열)
 *     인코딩 결과가 SHARE_MAX 자를 넘으면 null(화면은 깨끗한 주소만 쓴다). 받을 때는 길이·모양·순열·글자를 다시 확인하고 틀리면 null.
 *   - 저장 값(localStorage) 정리: cleanState.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ORDER_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_ITEMS = 2;
  var MAX_ITEMS = 40;
  var MAX_NAME = 30;
  var PRESETS = 4;          // 0 일반 · 1 발표 · 2 게임 · 3 청소 (문구는 언어 파일 presets[])
  var SHARE_MAX = 6000;     // 인코딩된 #r= 값 최대 길이
  var DECODE_MAX = 8000;    // 받을 때 이보다 길면 읽지 않는다
  var VERSION = 1;
  var U32 = 4294967296;
  var DEFAULTS = { mode: 'names', names: '', n: 8, preset: 0, from: 'first' };

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 로 0 ≤ r < max (거부 샘플링: limit 이상은 버리고 다시 뽑아 치우침을 없앤다)
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('order-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('order-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('order-core: crypto.getRandomValues is not available');
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

  function stripControl(s) {
    return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029<>{}`]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function clip(s) {
    var a = Array.from(s);
    return a.length > MAX_NAME ? a.slice(0, MAX_NAME).join('').trim() : s;
  }

  // 한 줄에 하나(쉼표·탭으로 나눠 붙여 넣어도 됨) → 정리된 이름 배열(빈 칸 제외, 30자 이내). 개수는 자르지 않는다(검사에서 알림).
  function cleanNames(text) {
    var list = Array.isArray(text) ? text : String(text == null ? '' : text).split(/\r?\n|\t|[,，、]/);
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var s = stripControl(list[i]);
      if (s) out.push(clip(s));
    }
    return out;
  }

  function numberList(n) {
    var out = [];
    for (var i = 1; i <= n; i++) out.push(i);
    return out;
  }

  function cleanPreset(p) {
    var x = Math.floor(Number(p));
    return x >= 0 && x < PRESETS ? x : 0;
  }

  // 설정 검사 → 오류 키(없으면 null). 키는 PAGE_I18N.errors 와 맞춘다.
  function validate(o) {
    if (o.mode === 'numbers') {
      var n = Math.floor(Number(o.n));
      return n >= MIN_ITEMS && n <= MAX_ITEMS ? null : 'numbersRange';
    }
    var names = cleanNames(o.names);
    if (names.length < MIN_ITEMS) return 'namesFew';
    if (names.length > MAX_ITEMS) return 'namesMany';
    return null;
  }

  // 한 판: { mode, items(1번째부터 순서), preset, from }. 섞기는 여기서 한 번만.
  function makeOrder(o, randInt) {
    var err = validate(o);
    if (err) throw new Error('order-core: ' + err);
    var base = o.mode === 'numbers' ? numberList(Math.floor(Number(o.n))) : cleanNames(o.names);
    return {
      mode: o.mode === 'numbers' ? 'numbers' : 'names',
      items: shuffle(base, randInt),
      preset: cleanPreset(o.preset),
      from: o.from === 'last' ? 'last' : 'first'
    };
  }

  // 공개 순서: 자리 번호(0부터) 목록. from=first → 0,1,…  last → N-1,…,0
  function revealSequence(n, from) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(from === 'last' ? n - 1 - i : i);
    return out;
  }

  // ---- 공유 링크 (#r=) ----
  function b64urlEncode(str) {
    var bin = unescape(encodeURIComponent(str));
    var b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var str = String(s);
    if (!/^[A-Za-z0-9_-]*$/.test(str)) throw new Error('bad base64url');
    var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
    return decodeURIComponent(escape(bin));
  }

  // rec = { mode, items, preset } → 문자열 또는 null(너무 길면)
  function encodeShare(rec) {
    var o = { v: VERSION, p: cleanPreset(rec.preset) };
    if (rec.mode === 'numbers') o.n = rec.items.map(Number);
    else o.o = rec.items.map(String);
    var enc = b64urlEncode(JSON.stringify(o));
    return enc.length > SHARE_MAX ? null : enc;
  }

  // 받은 값 검사·정리. 틀리면 null. 반환 { mode, items, preset }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > DECODE_MAX) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== VERSION) return null;
    var preset = cleanPreset(o.p);
    if (Array.isArray(o.n) && o.o === undefined) {
      var n = o.n.length;
      if (n < MIN_ITEMS || n > MAX_ITEMS) return null;
      var seen = {};
      for (var i = 0; i < n; i++) {
        var x = o.n[i];
        if (!Number.isInteger(x) || x < 1 || x > n || seen[x]) return null;
        seen[x] = true;
      }
      return { mode: 'numbers', items: o.n.slice(), preset: preset };
    }
    if (Array.isArray(o.o) && o.n === undefined) {
      if (o.o.length < MIN_ITEMS || o.o.length > MAX_ITEMS) return null;
      var items = [];
      for (var j = 0; j < o.o.length; j++) {
        if (typeof o.o[j] !== 'string') return null;
        var s = clip(stripControl(o.o[j]));
        if (!s) return null;
        items.push(s);
      }
      return { mode: 'names', items: items, preset: preset };
    }
    return null;
  }

  // 저장된 입력(localStorage) 정리. 없거나 틀리면 기본값.
  function cleanState(o) {
    var base = { mode: DEFAULTS.mode, names: DEFAULTS.names, n: DEFAULTS.n, preset: DEFAULTS.preset, from: DEFAULTS.from };
    if (!o || typeof o !== 'object') return base;
    if (o.mode === 'numbers' || o.mode === 'names') base.mode = o.mode;
    if (typeof o.names === 'string') base.names = o.names.split(/\r?\n/).slice(0, MAX_ITEMS + 20).join('\n').slice(0, 2400);
    var n = Math.floor(Number(o.n));
    if (n >= MIN_ITEMS && n <= MAX_ITEMS) base.n = n;
    base.preset = cleanPreset(o.preset);
    if (o.from === 'last') base.from = 'last';
    return base;
  }

  return {
    MIN_ITEMS: MIN_ITEMS,
    MAX_ITEMS: MAX_ITEMS,
    MAX_NAME: MAX_NAME,
    PRESETS: PRESETS,
    SHARE_MAX: SHARE_MAX,
    DEFAULTS: DEFAULTS,
    uniformInt: uniformInt,
    cryptoInt: cryptoInt,
    shuffle: shuffle,
    stripControl: stripControl,
    cleanNames: cleanNames,
    numberList: numberList,
    validate: validate,
    makeOrder: makeOrder,
    revealSequence: revealSequence,
    b64urlEncode: b64urlEncode,
    b64urlDecode: b64urlDecode,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    cleanState: cleanState
  };
});
