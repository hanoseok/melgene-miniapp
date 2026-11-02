/* apps/ballot/ballot-core.js — 비밀 투표 언어 무관 로직 (UMD: 브라우저 window.BALLOT_CORE + Node 검사 공용)
 *   - 설정: 질문 1~5개, 질문마다 선택지 2~12개(직접 입력 또는 공용 이름 목록), 투표하는 사람 2~40명.
 *     이름·선택지는 앞뒤 공백 정리, 대소문자 무시 중복 제거, 40자까지. 제목은 60자까지.
 *   - 진행(session): 질문별 표 수(counts)와 지금까지 투표한 사람 수(cast)만 둔다. 누가 무엇을 골랐는지는 어디에도 남기지 않는다.
 *     castBallot 은 질문마다 하나씩 고른 표(picks)를 받아 표 수만 더한다.
 *   - 집계(tally): 많은 순(같으면 입력 순) 정렬, 1등 묶음(leaders), 동점 여부.
 *   - 동점 깨기: 1등 묶음 안에서 crypto.getRandomValues 거부 샘플링으로 균등하게 하나(breakTie).
 *   - 결과 링크 #d=: { v:1, n, q:[{ t, o, c, b }] } JSON → UTF-8 → base64url. 표 수 합계가 질문마다 n 과 같아야 받아 준다(sanitizeResult).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BALLOT_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MIN_Q = 1;
  var MAX_Q = 5;
  var MIN_OPT = 2;
  var MAX_OPT = 12;
  var MIN_VOTERS = 2;
  var MAX_VOTERS = 40;
  var MAX_NAME = 40;
  var MAX_TITLE = 60;
  var U32 = 4294967296;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }

  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('ballot-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('ballot-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('ballot-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }

  // ---------------------------------------------------------------- 입력 정리
  function clip(s, max) {
    var a = Array.from(String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim());
    return a.slice(0, max).join('').trim();
  }
  // 줄바꿈·쉼표(、，)로 나눈 목록 → 공백 정리 · 빈 칸 버림 · 대소문자 무시 중복 제거 · 40자
  function cleanList(input) {
    var parts = Array.isArray(input) ? input : String(input == null ? '' : input).split(/[\n,，、]+/);
    var seen = {};
    var out = [];
    parts.forEach(function (p) {
      var v = clip(p, MAX_NAME);
      if (!v) return;
      var key = v.normalize ? v.normalize('NFC').toLowerCase() : v.toLowerCase();
      if (seen[key]) return;
      seen[key] = true;
      out.push(v);
    });
    return out;
  }
  function clampInt(v, lo, hi, dflt) {
    var n = parseInt(v, 10);
    if (!isFinite(n)) return dflt;
    return Math.max(lo, Math.min(hi, n));
  }

  // 화면 설정(초안) 정리: { people: '...'|[], voters, questions: [{ t, people: bool, o: '...'|[] }] }
  function normalizeDraft(d) {
    d = d && typeof d === 'object' ? d : {};
    var qs = Array.isArray(d.questions) ? d.questions.slice(0, MAX_Q) : [];
    if (!qs.length) qs = [{ t: '', people: false, o: [] }];
    return {
      people: cleanList(d.people),
      voters: clampInt(d.voters, MIN_VOTERS, MAX_VOTERS, 6),
      questions: qs.map(function (q) {
        q = q && typeof q === 'object' ? q : {};
        return { t: clip(q.t, MAX_TITLE), people: !!q.people, o: cleanList(q.o) };
      }),
    };
  }

  // 초안 → 검사. 문제가 있으면 { ok:false, errors:[{ code, q }] }, 없으면 { ok:true, qs:[{ t, o }] } (빈 제목은 null — 화면이 "질문 i" 로 채움)
  function validate(draft) {
    var d = normalizeDraft(draft);
    var errors = [];
    var needPeople = d.questions.some(function (q) { return q.people; });
    if (needPeople && d.people.length < MIN_OPT) errors.push({ code: 'people', q: 0 });
    if (needPeople && d.people.length > MAX_OPT) errors.push({ code: 'peopleMany', q: 0 });
    var qs = d.questions.map(function (q, i) {
      var opts = q.people ? d.people : q.o;
      if (!q.people && opts.length < MIN_OPT) errors.push({ code: 'few', q: i + 1 });
      if (!q.people && opts.length > MAX_OPT) errors.push({ code: 'many', q: i + 1 });
      return { t: q.t || null, o: opts.slice(0, MAX_OPT) };
    });
    if (errors.length) return { ok: false, errors: errors };
    return { ok: true, qs: qs, voters: d.voters };
  }

  // ---------------------------------------------------------------- 진행
  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }
  // qs: [{ t, o }] (t 는 채워진 제목)
  function createSession(qs, voters) {
    if (!Array.isArray(qs) || qs.length < MIN_Q || qs.length > MAX_Q) throw new Error('ballot-core: bad questions');
    return {
      qs: qs.map(function (q) {
        if (!q || !Array.isArray(q.o) || q.o.length < MIN_OPT || q.o.length > MAX_OPT) throw new Error('ballot-core: bad options');
        return { t: clip(q.t, MAX_TITLE), o: q.o.map(function (x) { return clip(x, MAX_NAME); }) };
      }),
      voters: clampInt(voters, MIN_VOTERS, MAX_VOTERS, MIN_VOTERS),
      cast: 0,
      counts: qs.map(function (q) { return zeros(q.o.length); }),
      tb: qs.map(function () { return -1; }),
    };
  }
  function validPicks(s, picks) {
    return Array.isArray(picks) && picks.length === s.qs.length && picks.every(function (p, i) {
      return typeof p === 'number' && Math.floor(p) === p && p >= 0 && p < s.qs[i].o.length;
    });
  }
  // 표 한 장 넣기: 표 수만 더한다(picks 자체는 돌려주지도 남기지도 않는다). 잘못된 표·다 찬 투표는 false.
  function castBallot(s, picks) {
    if (!s || s.cast >= s.voters || !validPicks(s, picks)) return false;
    for (var i = 0; i < picks.length; i++) s.counts[i][picks[i]] += 1;
    s.cast += 1;
    return true;
  }
  function isComplete(s) { return !!s && s.cast >= s.voters; }

  // 집계: order = 많은 순(같으면 입력 순), leaders = 1등 묶음(표가 하나도 없으면 빈 배열), tie = 1등이 둘 이상
  function tally(counts) {
    var c = Array.isArray(counts) ? counts : [];
    var total = c.reduce(function (a, x) { return a + x; }, 0);
    var order = c.map(function (_, i) { return i; }).sort(function (a, b) { return c[b] - c[a] || a - b; });
    var max = c.length ? c[order[0]] : 0;
    var leaders = max > 0 ? order.filter(function (i) { return c[i] === max; }) : [];
    return { total: total, order: order, max: max, leaders: leaders, tie: leaders.length > 1 };
  }
  // 동점 깨기: leaders 중 하나를 균등하게(crypto 거부 샘플링). randInt 는 검사용.
  function breakTie(leaders, randInt) {
    if (!Array.isArray(leaders) || leaders.length < 2) throw new Error('ballot-core: no tie to break');
    var ri = randInt || cryptoInt;
    return leaders[ri(leaders.length)];
  }
  // 질문 i 의 동점을 깨서 s.tb[i] 에 둔다(이미 깼거나 동점이 아니면 그대로). 뽑힌 선택지 번호를 돌려준다.
  function resolveTie(s, i, randInt) {
    var t = tally(s.counts[i]);
    if (!t.tie) return t.leaders.length ? t.leaders[0] : -1;
    if (s.tb[i] >= 0 && t.leaders.indexOf(s.tb[i]) >= 0) return s.tb[i];
    s.tb[i] = breakTie(t.leaders, randInt);
    return s.tb[i];
  }
  // 질문 i 의 1등(동점이면 깬 결과, 아직 안 깼으면 -1)
  function winnerOf(counts, tb) {
    var t = tally(counts);
    if (!t.leaders.length) return -1;
    if (!t.tie) return t.leaders[0];
    return tb >= 0 && t.leaders.indexOf(tb) >= 0 ? tb : -1;
  }
  function percent(c, total) { return total > 0 ? Math.round((c * 100) / total) : 0; }

  // 저장된 진행 상태 검사(새로고침 이어 하기). 맞지 않으면 null.
  function sanitizeSession(o) {
    try {
      if (!o || typeof o !== 'object' || !Array.isArray(o.qs) || o.qs.length < MIN_Q || o.qs.length > MAX_Q) return null;
      var voters = clampInt(o.voters, MIN_VOTERS, MAX_VOTERS, -1);
      var cast = parseInt(o.cast, 10);
      if (voters !== o.voters || !(cast >= 0 && cast <= voters)) return null;
      var s = createSession(o.qs.map(function (q) { return { t: q && q.t, o: q && q.o }; }), voters);
      if (!Array.isArray(o.counts) || o.counts.length !== s.qs.length) return null;
      for (var i = 0; i < s.qs.length; i++) {
        var c = o.counts[i];
        if (!Array.isArray(c) || c.length !== s.qs[i].o.length) return null;
        if (!c.every(function (x) { return typeof x === 'number' && Math.floor(x) === x && x >= 0 && x <= MAX_VOTERS; })) return null;
        if (c.reduce(function (a, x) { return a + x; }, 0) !== cast) return null;
        if (s.qs[i].t !== o.qs[i].t || s.qs[i].o.join('\n') !== o.qs[i].o.join('\n')) return null;
        s.counts[i] = c.slice();
        var tb = Array.isArray(o.tb) ? o.tb[i] : -1;
        s.tb[i] = typeof tb === 'number' && tally(c).tie && tally(c).leaders.indexOf(tb) >= 0 ? tb : -1;
      }
      s.cast = cast;
      return s;
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------- 결과 링크 (#d=)
  function b64urlFromBytes(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function bytesFromB64url(s) {
    var t = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (t.length % 4) t += '=';
    var bin = atob(t);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // 결과만(표 수 · 동점 깨기). 진행 중인 것도 넣지 않는다 — 끝난 투표만.
  function resultOf(s) {
    return { v: 1, n: s.cast, q: s.qs.map(function (q, i) { return { t: q.t, o: q.o.slice(), c: s.counts[i].slice(), b: s.tb[i] }; }) };
  }
  function encodeResult(r) {
    return b64urlFromBytes(new TextEncoder().encode(JSON.stringify(r)));
  }
  function sanitizeResult(o) {
    if (!o || typeof o !== 'object' || o.v !== 1 || !Array.isArray(o.q) || o.q.length < MIN_Q || o.q.length > MAX_Q) return null;
    var n = o.n;
    if (typeof n !== 'number' || Math.floor(n) !== n || n < 1 || n > MAX_VOTERS) return null;
    var q = [];
    for (var i = 0; i < o.q.length; i++) {
      var x = o.q[i];
      if (!x || typeof x.t !== 'string' || !Array.isArray(x.o) || !Array.isArray(x.c)) return null;
      if (x.o.length < MIN_OPT || x.o.length > MAX_OPT || x.c.length !== x.o.length) return null;
      var t = clip(x.t, MAX_TITLE);
      var opts = x.o.map(function (v) { return typeof v === 'string' ? clip(v, MAX_NAME) : ''; });
      if (!t || opts.some(function (v) { return !v; })) return null;
      if (!x.c.every(function (v) { return typeof v === 'number' && Math.floor(v) === v && v >= 0 && v <= MAX_VOTERS; })) return null;
      if (x.c.reduce(function (a, v) { return a + v; }, 0) !== n) return null;
      var tl = tally(x.c);
      var b = typeof x.b === 'number' && tl.tie && tl.leaders.indexOf(x.b) >= 0 ? x.b : -1;
      q.push({ t: t, o: opts, c: x.c.slice(), b: b });
    }
    return { v: 1, n: n, q: q };
  }
  function decodeResult(str) {
    try {
      if (!str || String(str).length > 12000 || /[^A-Za-z0-9_-]/.test(String(str))) return null;
      var json = new TextDecoder('utf-8', { fatal: true }).decode(bytesFromB64url(str));
      return sanitizeResult(JSON.parse(json));
    } catch (e) { return null; }
  }

  return {
    MIN_Q: MIN_Q, MAX_Q: MAX_Q, MIN_OPT: MIN_OPT, MAX_OPT: MAX_OPT, MIN_VOTERS: MIN_VOTERS, MAX_VOTERS: MAX_VOTERS, MAX_NAME: MAX_NAME, MAX_TITLE: MAX_TITLE,
    uniformInt: uniformInt, cryptoInt: cryptoInt,
    cleanList: cleanList, normalizeDraft: normalizeDraft, validate: validate,
    createSession: createSession, castBallot: castBallot, isComplete: isComplete, validPicks: validPicks,
    tally: tally, breakTie: breakTie, resolveTie: resolveTie, winnerOf: winnerOf, percent: percent,
    sanitizeSession: sanitizeSession, resultOf: resultOf, encodeResult: encodeResult, decodeResult: decodeResult, sanitizeResult: sanitizeResult,
  };
});
