/* apps/proscons/proscons-core.js — 장단점 저울 언어 무관 로직 (UMD: 브라우저 window.PROSCONS_CORE + Node 검사 공용)
 *   - 모드 's'(할까 말까): 목록 p(장점)·c(단점). 왼쪽 접시 = p 합, 오른쪽 접시 = c 합.
 *   - 모드 'ab'(A냐 B냐): 목록 ap·ac·bp·bc. 왼쪽(A) 접시 = A 장점 + B 단점, 오른쪽(B) 접시 = B 장점 + A 단점.
 *     (A 의 단점은 B 쪽으로 무게를 싣는다 → 차이는 (A 장점 − A 단점) − (B 장점 − B 단점) 과 같다)
 *   - 항목 = [무게 1..3, 글(60자 이하, 앞뒤 공백·제어 문자 정리)]. 목록 하나에 12개까지.
 *   - 판정: verdict → { kind: 'empty'|'tie'|'left'|'right', margin, pct, left, right, total }.
 *   - 기울기: tiltAngle(left, right) → 도(+ = 오른쪽이 무거워 내려감), ±MAX_ANGLE 로 자름. easeStep 으로 부드럽게 따라감.
 *   - 공유 링크: #d=<UTF-8 base64url(JSON)>  {v:1,m:'s'|'ab',q,a,b,l:{p:[[w,"글"],…],…}}
 *     인코딩 결과가 SHARE_MAX 자를 넘으면 null. 받을 때 길이·모양·무게·글자를 다시 확인하고 틀리면 null.
 *   - 동전 던지기(동점일 때): crypto.getRandomValues 거부 샘플링으로 0/1.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PROSCONS_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_ITEMS = 12;       // 목록 하나(한쪽)의 항목 수
  var MAX_TEXT = 60;        // 항목 글 길이(글자)
  var MAX_Q = 80;           // 고민(질문) 길이
  var MAX_NAME = 24;        // 선택지 A/B 이름 길이
  var W_MIN = 1;
  var W_MAX = 3;
  var W_DEFAULT = 2;
  var MAX_ANGLE = 18;       // 저울 최대 기울기(도)
  var SOFT_TOTAL = 6;       // 무게 합이 작을 때 너무 확 기울지 않게 하는 분모 하한
  var SHARE_MAX = 8000;     // 인코딩된 #d= 값 최대 길이
  var DECODE_MAX = 12000;   // 받을 때 이보다 길면 읽지 않는다
  var VERSION = 1;
  var U32 = 4294967296;
  var LISTS = { s: ['p', 'c'], ab: ['ap', 'ac', 'bp', 'bc'] };
  // 접시: 왼쪽/오른쪽에 무게를 싣는 목록
  var PANS = { s: { left: ['p'], right: ['c'] }, ab: { left: ['ap', 'bc'], right: ['bp', 'ac'] } };
  var ALL_LISTS = ['p', 'c', 'ap', 'ac', 'bp', 'bc'];

  function cleanMode(m) { return m === 'ab' ? 'ab' : 's'; }
  function listKeys(mode) { return LISTS[cleanMode(mode)].slice(); }

  function stripControl(s) {
    return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029<>{}`]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function clip(s, max) {
    var a = Array.from(s);
    return a.length > max ? a.slice(0, max).join('').trim() : s;
  }
  // 글 정리: 제어 문자·꺾쇠·중괄호·백틱 → 공백, 공백 하나로, 앞뒤 자르기, max 글자까지
  function cleanText(s, max) { return clip(stripControl(s), max || MAX_TEXT); }

  function cleanWeight(w) {
    var n = Math.round(Number(w));
    if (!isFinite(n)) return W_DEFAULT;
    return Math.min(W_MAX, Math.max(W_MIN, n));
  }

  function emptyLists() {
    var o = {};
    ALL_LISTS.forEach(function (k) { o[k] = []; });
    return o;
  }

  // 항목 정리: [w, t] 또는 {w, t} → [w, t] (글이 비면 null)
  function cleanItem(it) {
    var w, t;
    if (Array.isArray(it)) { w = it[0]; t = it[1]; }
    else if (it && typeof it === 'object') { w = it.w; t = it.t; }
    else return null;
    t = cleanText(t, MAX_TEXT);
    return t ? [cleanWeight(w), t] : null;
  }
  function cleanList(arr) {
    var out = [];
    if (!Array.isArray(arr)) return out;
    for (var i = 0; i < arr.length && out.length < MAX_ITEMS; i++) {
      var it = cleanItem(arr[i]);
      if (it) out.push(it);
    }
    return out;
  }

  // 저장된 초안(localStorage)·화면 상태 정리. 없거나 틀리면 빈 상태.
  function cleanState(o) {
    var st = { m: 's', q: '', a: '', b: '', l: emptyLists() };
    if (!o || typeof o !== 'object' || Array.isArray(o)) return st;
    st.m = cleanMode(o.m);
    st.q = cleanText(o.q, MAX_Q);
    st.a = cleanText(o.a, MAX_NAME);
    st.b = cleanText(o.b, MAX_NAME);
    var l = o.l && typeof o.l === 'object' ? o.l : {};
    ALL_LISTS.forEach(function (k) { st.l[k] = cleanList(l[k]); });
    return st;
  }

  // 항목 추가: 성공하면 true. 글이 비었거나 목록이 가득 차면 false (오류 키를 돌려준다)
  function addItem(st, key, text, w) {
    if (ALL_LISTS.indexOf(key) < 0) return 'badList';
    var t = cleanText(text, MAX_TEXT);
    if (!t) return 'empty';
    if (st.l[key].length >= MAX_ITEMS) return 'full';
    st.l[key].push([cleanWeight(w == null ? W_DEFAULT : w), t]);
    return null;
  }

  function sumList(list) {
    var s = 0;
    for (var i = 0; i < list.length; i++) s += cleanWeight(list[i][0]);
    return s;
  }
  function countItems(st) {
    return listKeys(st.m).reduce(function (n, k) { return n + st.l[k].length; }, 0);
  }

  // 접시 무게 { left, right, total, diff(= left − right) }
  function score(st) {
    var p = PANS[cleanMode(st.m)];
    var left = 0, right = 0;
    p.left.forEach(function (k) { left += sumList(st.l[k] || []); });
    p.right.forEach(function (k) { right += sumList(st.l[k] || []); });
    return { left: left, right: right, total: left + right, diff: left - right };
  }

  // 판정. pct = 이긴 쪽 무게가 전체에서 차지하는 비율(반올림 %). 동점이면 50.
  function verdict(st) {
    var s = score(st);
    if (s.total === 0) return { kind: 'empty', margin: 0, pct: 0, left: 0, right: 0, total: 0 };
    if (s.diff === 0) return { kind: 'tie', margin: 0, pct: 50, left: s.left, right: s.right, total: s.total };
    var win = s.diff > 0 ? s.left : s.right;
    return {
      kind: s.diff > 0 ? 'left' : 'right',
      margin: Math.abs(s.diff),
      pct: Math.round((win / s.total) * 100),
      left: s.left, right: s.right, total: s.total
    };
  }

  // 기울기(도): + 이면 오른쪽 접시가 내려감. 무게 합이 작으면 SOFT_TOTAL 로 나눠 덜 기운다.
  function tiltAngle(left, right, maxAngle) {
    var max = maxAngle == null ? MAX_ANGLE : maxAngle;
    var l = Math.max(0, Number(left) || 0), r = Math.max(0, Number(right) || 0);
    var a = max * (r - l) / Math.max(l + r, SOFT_TOTAL);
    a = Math.min(max, Math.max(-max, a));
    return Math.round(a * 100) / 100;
  }

  // 부드럽게 따라가기(지수 감쇠): dt(ms) 지난 뒤 cur 가 target 쪽으로 움직인 값. 0.05도 안이면 target.
  function easeStep(cur, target, dt, tau) {
    var t = tau || 180;
    var next = target + (cur - target) * Math.exp(-Math.max(0, dt) / t);
    return Math.abs(next - target) < 0.05 ? target : next;
  }

  // 저울대 양 끝(접시를 매다는 점). 회전 중심 (cx, cy), 팔 길이 half, 각도 deg.
  function beamEnds(deg, cx, cy, half) {
    var r = deg * Math.PI / 180;
    var dx = Math.cos(r) * half, dy = Math.sin(r) * half;
    return { lx: cx - dx, ly: cy - dy, rx: cx + dx, ry: cy + dy };
  }

  // 무거운 이유: 그 접시에 실린 항목을 무게 순(같으면 넣은 순)으로 n 개. 항목 = { key, w, t }
  function topReasons(st, side, n) {
    var keys = PANS[cleanMode(st.m)][side === 'right' ? 'right' : 'left'];
    var all = [];
    var seq = 0;
    keys.forEach(function (k) {
      (st.l[k] || []).forEach(function (it) { all.push({ key: k, w: cleanWeight(it[0]), t: it[1], i: seq++ }); });
    });
    all.sort(function (x, y) { return y.w - x.w || x.i - y.i; });
    return all.slice(0, n == null ? 3 : n).map(function (x) { return { key: x.key, w: x.w, t: x.t }; });
  }

  // ---- 난수 (동전 던지기) ----
  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('proscons-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('proscons-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('proscons-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  // 0 = 왼쪽, 1 = 오른쪽
  function coinFlip(nextU32) { return uniformInt(2, nextU32 || cryptoU32); }

  // ---- 공유 링크 (#d=) ----
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

  // 지금 모드의 목록만 담는다. 너무 길면 null.
  function encodeShare(st) {
    var s = cleanState(st);
    var o = { v: VERSION, m: s.m };
    if (s.q) o.q = s.q;
    if (s.m === 'ab') { if (s.a) o.a = s.a; if (s.b) o.b = s.b; }
    o.l = {};
    listKeys(s.m).forEach(function (k) { if (s.l[k].length) o.l[k] = s.l[k]; });
    var enc = b64urlEncode(JSON.stringify(o));
    return enc.length > SHARE_MAX ? null : enc;
  }

  // 받은 값 검사·정리. 틀리면 null. 항목이 하나도 없으면 null.
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > DECODE_MAX) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== VERSION) return null;
    if (o.m !== 's' && o.m !== 'ab') return null;
    if (o.q != null && typeof o.q !== 'string') return null;
    if (o.a != null && typeof o.a !== 'string') return null;
    if (o.b != null && typeof o.b !== 'string') return null;
    var l = o.l;
    if (!l || typeof l !== 'object' || Array.isArray(l)) return null;
    var keys = listKeys(o.m);
    var st = { m: o.m, q: cleanText(o.q || '', MAX_Q), a: o.m === 'ab' ? cleanText(o.a || '', MAX_NAME) : '', b: o.m === 'ab' ? cleanText(o.b || '', MAX_NAME) : '', l: emptyLists() };
    var lk = Object.keys(l);
    for (var x = 0; x < lk.length; x++) if (keys.indexOf(lk[x]) < 0) return null;
    var total = 0;
    for (var i = 0; i < keys.length; i++) {
      var arr = l[keys[i]];
      if (arr === undefined) continue;
      if (!Array.isArray(arr) || arr.length > MAX_ITEMS) return null;
      for (var j = 0; j < arr.length; j++) {
        var it = arr[j];
        if (!Array.isArray(it) || it.length !== 2) return null;
        if (!Number.isInteger(it[0]) || it[0] < W_MIN || it[0] > W_MAX) return null;
        if (typeof it[1] !== 'string') return null;
        var t = cleanText(it[1], MAX_TEXT);
        if (!t) return null;
        st.l[keys[i]].push([it[0], t]);
        total++;
      }
    }
    return total ? st : null;
  }

  return {
    MAX_ITEMS: MAX_ITEMS,
    MAX_TEXT: MAX_TEXT,
    MAX_Q: MAX_Q,
    MAX_NAME: MAX_NAME,
    W_MIN: W_MIN,
    W_MAX: W_MAX,
    W_DEFAULT: W_DEFAULT,
    MAX_ANGLE: MAX_ANGLE,
    SHARE_MAX: SHARE_MAX,
    PANS: PANS,
    cleanMode: cleanMode,
    listKeys: listKeys,
    stripControl: stripControl,
    cleanText: cleanText,
    cleanWeight: cleanWeight,
    cleanState: cleanState,
    addItem: addItem,
    sumList: sumList,
    countItems: countItems,
    score: score,
    verdict: verdict,
    tiltAngle: tiltAngle,
    easeStep: easeStep,
    beamEnds: beamEnds,
    topReasons: topReasons,
    uniformInt: uniformInt,
    coinFlip: coinFlip,
    b64urlEncode: b64urlEncode,
    b64urlDecode: b64urlDecode,
    encodeShare: encodeShare,
    decodeShare: decodeShare
  };
});
