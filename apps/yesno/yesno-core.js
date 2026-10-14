/* apps/yesno/yesno-core.js — 예스 노 결정기 언어 무관 로직 (UMD: 브라우저 window.YESNO_CORE + Node 검사 공용)
 *   - 모드: classic(예/아니오 1:1) · maybe(예/아니오/글쎄 1:1:1) · oracle(구슬 답 12개 중 하나, 4개씩 긍정/중립/부정) · best3 · best5(한쪽이 과반을 이길 때까지 던짐).
 *   - 뽑기: crypto.getRandomValues 거부 샘플링 → 모든 칸이 같은 확률. 화면 연출은 결과를 먼저 정한 뒤 보여 주기만 한다.
 *   - 기록 rec = { m: 모드, a: 답 번호, f: [best-of 각 판 0=예 1=아니오], q: 질문(선택), t: 시각(ms) }
 *     classic a 0=예 1=아니오 · maybe a 0=예 1=아니오 2=글쎄 · oracle a 0~11 (0~3 긍정 · 4~7 중립 · 8~11 부정) · best3/best5 a = 이긴 쪽(0|1).
 *   - 공유 링크: #d=<UTF-8 base64url(JSON {v,m,a,f,q,t})> — "이 답 공유하기"를 누를 때만 질문이 들어간다. 받은 쪽은 꼼꼼히 검사하고 다시 뽑지 않는다.
 *   - 세션 누적(예·아니오·글쎄)과 최근 10개 기록(localStorage 는 화면 JS 가, 여기서는 모양 검사만).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.YESNO_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MODES = ['classic', 'maybe', 'oracle', 'best3', 'best5'];
  var ORACLE_N = 12;          // 구슬 답 개수 (언어 파일 oracle 배열 길이와 같아야 함)
  var MAX_Q = 100;            // 질문 최대 글자 수
  var HISTORY_MAX = 10;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // 0 <= r < max 인 정수. 2^32 를 max 로 나눈 나머지 구간은 버리고 다시 뽑는다(거부 샘플링, 모듈로 치우침 없음).
  function cryptoInt(max) {
    if (!(max >= 1)) return 0;
    var c = cryptoObj();
    if (!c) throw new Error('crypto.getRandomValues unavailable');
    var buf = new Uint32Array(1);
    var limit = Math.floor(4294967296 / max) * max;
    for (;;) {
      c.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % max;
    }
  }

  function isMode(m) { return MODES.indexOf(m) >= 0; }
  function bestN(m) { return m === 'best3' ? 3 : m === 'best5' ? 5 : 0; }
  function need(n) { return Math.floor(n / 2) + 1; }
  function answerCount(m) { return m === 'classic' ? 2 : m === 'maybe' ? 3 : m === 'oracle' ? ORACLE_N : 2; }

  // 한 번 묻기 → rec (q·t 는 화면 JS 가 붙인다). randInt 를 주입하면 검사에서 결과를 정할 수 있다.
  function ask(mode, randInt) {
    var ri = randInt || cryptoInt;
    var m = isMode(mode) ? mode : 'classic';
    var n = bestN(m);
    if (!n) return { m: m, a: ri(answerCount(m)) };
    var f = [];
    var w = [0, 0];
    var k = need(n);
    while (w[0] < k && w[1] < k) {
      var s = ri(2);
      f.push(s);
      w[s]++;
    }
    return { m: m, a: w[0] >= k ? 0 : 1, f: f };
  }

  // 구슬 답 톤: positive | neutral | negative
  function tone(a) { return a < 4 ? 'positive' : a < 8 ? 'neutral' : 'negative'; }
  // 결과 분류(누적용): yes | no | maybe
  function outcome(rec) {
    if (!rec) return 'maybe';
    if (rec.m === 'oracle') { var t = tone(rec.a); return t === 'positive' ? 'yes' : t === 'negative' ? 'no' : 'maybe'; }
    return rec.a === 0 ? 'yes' : rec.a === 1 ? 'no' : 'maybe';
  }
  function score(rec) {
    var w = [0, 0];
    (rec && rec.f || []).forEach(function (s) { w[s]++; });
    return w;
  }

  // best-of 기록이 규칙대로인지: 각 판 0/1, 과반에 닿는 순간 끝, 이긴 쪽 = a
  function validFlips(m, a, f) {
    var n = bestN(m);
    if (!n || !Array.isArray(f) || f.length < need(n) || f.length > n) return false;
    var w = [0, 0];
    var k = need(n);
    for (var i = 0; i < f.length; i++) {
      if (f[i] !== 0 && f[i] !== 1) return false;
      if (w[0] >= k || w[1] >= k) return false;   // 이미 끝났는데 더 던짐
      w[f[i]]++;
    }
    if (w[0] < k && w[1] < k) return false;        // 아직 안 끝남
    return (w[0] >= k ? 0 : 1) === a;
  }
  function validRec(o) {
    if (!o || !isMode(o.m) || !Number.isInteger(o.a)) return false;
    if (bestN(o.m)) return validFlips(o.m, o.a, o.f);
    if (o.f != null) return false;
    return o.a >= 0 && o.a < answerCount(o.m);
  }

  // 질문 다듬기: 제어 문자·꺾쇠 제거, 공백 정리, 최대 100자
  function cleanQuestion(s) {
    var t = String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim();
    return Array.from(t).slice(0, MAX_Q).join('').trim();
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=…)
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
  function encodeShare(rec) {
    if (!validRec(rec)) return null;
    var o = { v: 1, m: rec.m, a: rec.a, t: Math.floor((rec.t || 0) / 1000) };
    if (rec.f) o.f = rec.f.slice();
    var q = cleanQuestion(rec.q);
    if (q) o.q = q;
    return b64urlEncode(JSON.stringify(o));
  }
  // 받은 문자열을 꼼꼼히 검사(모드·답 범위·best-of 규칙·질문 길이와 모양·시각). 하나라도 틀리면 null.
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 2000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || typeof o !== 'object' || o.v !== 1) return null;
    if (!Number.isInteger(o.t) || o.t < 0 || o.t > 99999999999) return null;
    if (o.q != null && (typeof o.q !== 'string' || !o.q || cleanQuestion(o.q) !== o.q)) return null;
    var rec = { m: o.m, a: o.a };
    if (o.f != null) rec.f = o.f;
    if (!validRec(rec)) return null;
    return { m: rec.m, a: rec.a, f: rec.f ? rec.f.slice() : undefined, q: o.q || '', t: o.t * 1000 };
  }

  // ---------------------------------------------------------------- 누적 · 기록
  function newTally() { return { yes: 0, no: 0, maybe: 0 }; }
  function addTally(t, rec) { t[outcome(rec)]++; return t; }
  function tallyTotal(t) { return t.yes + t.no + t.maybe; }

  function pushHistory(list, entry) {
    return [entry].concat(Array.isArray(list) ? list : []).slice(0, HISTORY_MAX);
  }
  // localStorage 에서 읽은 값 정리(모양이 틀린 항목은 버림)
  function cleanHistory(list) {
    if (!Array.isArray(list)) return [];
    return list.filter(function (h) {
      return h && validRec(h) && Number.isFinite(h.t) && (h.q == null || (typeof h.q === 'string' && cleanQuestion(h.q) === h.q));
    }).slice(0, HISTORY_MAX);
  }

  return {
    MODES: MODES, ORACLE_N: ORACLE_N, MAX_Q: MAX_Q, HISTORY_MAX: HISTORY_MAX,
    cryptoInt: cryptoInt, isMode: isMode, bestN: bestN, need: need, answerCount: answerCount,
    ask: ask, tone: tone, outcome: outcome, score: score, validFlips: validFlips, validRec: validRec,
    cleanQuestion: cleanQuestion,
    encodeShare: encodeShare, decodeShare: decodeShare, b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode,
    newTally: newTally, addTally: addTally, tallyTotal: tallyTotal, pushHistory: pushHistory, cleanHistory: cleanHistory,
  };
});
