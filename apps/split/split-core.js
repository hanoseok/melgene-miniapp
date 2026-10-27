/* apps/split/split-core.js — 더치페이 계산기 언어 무관 로직 (UMD: 브라우저 window.SPLIT_CORE + Node 검사 공용)
 *   돈은 언제나 정수 최소 단위(minor: 원·엔·센트)로 계산한다. 부동소수점 금액 없음.
 *   allocate(weights, total, unit, mode, host) — 큰 나머지 방식(largest remainder, BigInt)으로 total 을 weights 비율로 나눈다.
 *     unit = 반올림 단위(minor). 각자 unit 의 배수를 받고, unit 보다 작은 끝돈(rem)은 한 사람이 낸다.
 *     mode 'host' = 단위로 내림한 나머지(단위 몫 + 끝돈)를 총무(host)가 모두 낸다 / 'even' = 단위 몫은 나머지가 큰 사람부터 1단위씩, 끝돈은 가장 많이 내는 사람.
 *     → 합계가 언제나 total 과 정확히 같다.
 *   똑같이 나누기(calcEven): 총액 + 팁(%) → n명.  항목별로 나누기(calcItems): 항목마다 함께 먹은 사람끼리 나눈 소계 → 세금·팁을 소계 비율로 → 반올림 단위.
 *   정산(settle): 각자 낸 돈 − 낼 돈 = 잔액 → 같은 금액끼리 먼저 짝 → 가장 큰 빚 ↔ 가장 큰 받을 돈(greedy) — 송금 횟수 ≤ 사람 수 − 1.
 *   입력 해석(parseAmount): "," "." 둘 다 소수점 또는 천 단위 구분(뒤 3자리 = 구분, 1~2자리 = 소수점), 공백·전각 숫자·통화 기호 허용.
 *   공유(#d=)·저장(localStorage)은 같은 모양(toWire/fromWire)을 UTF-8 base64url JSON 으로. 서버로 보내는 것은 없다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SPLIT_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // 통화: dec = 소수 자릿수, units = 반올림 단위(최소 단위 기준), def = 기본 단위
  var CURRENCIES = {
    KRW: { dec: 0, units: [1, 10, 100, 1000], def: 100 },
    JPY: { dec: 0, units: [1, 10, 100], def: 1 },
    CNY: { dec: 2, units: [1, 10, 100], def: 1 },
    USD: { dec: 2, units: [1, 100, 500], def: 1 },
    EUR: { dec: 2, units: [1, 10, 100, 500], def: 1 },
    GBP: { dec: 2, units: [1, 100, 500], def: 1 },
    BRL: { dec: 2, units: [1, 10, 100, 500], def: 1 },
    THB: { dec: 0, units: [1, 5, 10], def: 1 },
    VND: { dec: 0, units: [1, 1000, 10000], def: 1000 },
    RUB: { dec: 2, units: [1, 100, 1000, 10000], def: 100 },
  };
  var CODES = Object.keys(CURRENCIES);
  var LANG_CURRENCY = { ko: 'KRW', ja: 'JPY', zh: 'CNY', en: 'USD', fr: 'EUR', de: 'EUR', it: 'EUR', es: 'EUR', pt: 'BRL', th: 'THB', vi: 'VND', ru: 'RUB' };
  var LIMIT = { people: [2, 30], itemPeople: [2, 20], items: 40, payers: 20, name: 20, itemName: 30, pct: 100 };
  var MAX_MINOR = 1e13; // 금액 하나의 상한 (최소 단위)

  function currencyOf(code) { return CURRENCIES[code] ? code : 'USD'; }
  function langCurrency(lang) { return LANG_CURRENCY[lang] || 'USD'; }
  function scale(code) { return Math.pow(10, CURRENCIES[currencyOf(code)].dec); }
  function validUnit(code, u) { return CURRENCIES[currencyOf(code)].units.indexOf(u) >= 0; }

  // ---------------------------------------------------------------- 입력 해석
  function normDigits(s) {
    return String(s == null ? '' : s)
      .replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); })
      .replace(/[，、]/g, ',').replace(/[．。]/g, '.')
      .replace(/[\s   '’]/g, '');
  }
  // 문자열 → { value: 최소 단위 정수 } | { empty: true } | { error: 'badNum' | 'tooBig' }
  function parseAmount(str, code) {
    var dec = CURRENCIES[currencyOf(code)].dec;
    var s = normDigits(str).replace(/^(R\$|[₩¥$€£₫฿₽円元원]|руб\.?|đ)+|(R\$|[₩¥$€£₫฿₽円元원]|руб\.?|đ)+$/gi, '');
    if (!s) return { empty: true };
    if (!/^[0-9.,]+$/.test(s) || !/[0-9]/.test(s)) return { error: 'badNum' };
    var intPart = s, frac = '';
    var hasDot = s.indexOf('.') >= 0, hasComma = s.indexOf(',') >= 0;
    var groupOk = function (str, g) { return new RegExp('^\\d{1,3}(\\' + g + '\\d{3})+$').test(str); };
    if (hasDot && hasComma) {
      // 1,234.56 · 1.234,56 — 마지막 기호 = 소수점, 다른 기호 = 천 단위 구분
      var dsep = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
      var gsep = dsep === '.' ? ',' : '.';
      var at = s.lastIndexOf(dsep);
      intPart = s.slice(0, at); frac = s.slice(at + 1);
      if (intPart.indexOf(dsep) >= 0 || !groupOk(intPart, gsep) || !/^\d{0,2}$/.test(frac)) return { error: 'badNum' };
      intPart = intPart.split(gsep).join('');
    } else if (hasDot || hasComma) {
      var sep = hasDot ? '.' : ',';
      var parts = s.split(sep);
      if (parts.length > 2) {
        if (!groupOk(s, sep)) return { error: 'badNum' };
        intPart = parts.join('');
      } else if (parts[1].length === 3 && parts[0].length >= 1 && parts[0].length <= 3 && parts[0] !== '0') {
        intPart = parts.join(''); // 12,000 → 천 단위 구분 (돈은 소수 2자리까지)
      } else if (parts[1].length <= 2) {
        intPart = parts[0] || '0'; frac = parts[1];
      } else return { error: 'badNum' };
    }
    if (!/^\d+$/.test(intPart)) return { error: 'badNum' };
    var v = Number(intPart) * Math.pow(10, dec);
    if (frac) {
      var f = (frac + '00').slice(0, 2);
      var cents = Number(f);
      if (dec === 2) v += cents;
      else if (cents >= 50 && frac.length) v += 1; // 원·엔 등에 소수점을 쓰면 반올림
    }
    if (!isFinite(v) || v > MAX_MINOR) return { error: 'tooBig' };
    return { value: Math.round(v) };
  }
  // 퍼센트 (0~100, 소수 2자리까지) → { value: 숫자 } | empty | error
  function parsePct(str) {
    var s = normDigits(str).replace(/%$/, '');
    if (!s) return { empty: true };
    if (!/^\d{1,3}([.,]\d{1,2})?$/.test(s)) return { error: 'badPct' };
    var v = Number(s.replace(',', '.'));
    if (!(v >= 0 && v <= LIMIT.pct)) return { error: 'badPct' };
    return { value: v };
  }
  // 퍼센트 금액 = round(base × pct / 100), 반올림 0.5 올림 (정수 연산)
  function pctOf(base, pct) {
    if (!pct) return 0;
    var p = Math.round(pct * 100); // 1/100 % 단위
    var b = BigInt(base) * BigInt(p);
    var q = b / 10000n, r = b % 10000n;
    if (r * 2n >= 10000n) q += 1n;
    return Number(q);
  }

  // ---------------------------------------------------------------- 나누기 (큰 나머지 방식)
  function allocate(weights, total, unit, mode, host, tieOffset) {
    var n = weights.length;
    unit = Math.max(1, Math.floor(unit || 1));
    host = host == null ? 0 : host;
    var W = 0n, w = weights.map(function (x) { var b = BigInt(Math.max(0, Math.floor(x || 0))); W += b; return b; });
    if (W === 0n) { w = weights.map(function () { return 1n; }); W = BigInt(n); }
    var T = BigInt(total), U = BigInt(unit);
    var Tu = T / U, rem = T - Tu * U;
    var base = [], fr = [], used = 0n;
    for (var i = 0; i < n; i++) {
      var x = w[i] * Tu;
      base.push(x / W);
      fr.push(x % W);
      used += x / W;
    }
    var left = Tu - used;
    var out = base.map(function (b) { return b * U; });
    if (mode === 'host') {
      out[host] += left * U + rem;
    } else {
      var off = tieOffset || 0;
      var order = [];
      for (var j = 0; j < n; j++) order.push(j);
      order.sort(function (a, b) {
        if (fr[a] !== fr[b]) return fr[b] > fr[a] ? 1 : -1;
        return ((a - off + n) % n) - ((b - off + n) % n);
      });
      for (var k = 0; k < Number(left); k++) out[order[k]] += U;
      if (rem > 0n) {
        var big = 0;
        for (var m = 1; m < n; m++) if (out[m] > out[big]) big = m;
        out[big] += rem;
      }
    }
    return out.map(Number);
  }

  // 똑같이 나누기: { total, people, tip, unit, mode } → { ok, sub, tip, grand, shares[], groups[] }
  function calcEven(o) {
    var n = o.people;
    if (!(n >= LIMIT.people[0] && n <= LIMIT.people[1])) return { error: 'peopleRange' };
    if (!(o.total > 0)) return { empty: true };
    var tip = pctOf(o.total, o.tip || 0);
    var grand = o.total + tip;
    var w = [];
    for (var i = 0; i < n; i++) w.push(1);
    var shares = allocate(w, grand, o.unit, o.mode, 0);
    return { ok: true, sub: o.total, tip: tip, tax: 0, grand: grand, shares: shares, groups: groups(shares, o.mode) };
  }
  // 같은 금액끼리 묶기 (총무 모드에서 총무는 따로)
  function groups(shares, mode) {
    var out = [];
    shares.forEach(function (a, i) {
      var isHost = mode === 'host' && i === 0;
      var g = null;
      out.forEach(function (x) { if (!g && !x.host && !isHost && x.amount === a) g = x; });
      if (g) g.count++; else out.push({ amount: a, count: 1, host: isHost });
    });
    return out.sort(function (a, b) { return (a.host ? 1 : 0) - (b.host ? 1 : 0) || b.count - a.count || b.amount - a.amount; });
  }

  // 항목별로 나누기: { people: n, items: [{price, who:[idx]}], tax, tip, unit, mode, host } → { ok, sub, tax, tip, grand, subs[], shares[], extras[] }
  function calcItems(o) {
    var n = o.people;
    if (!(n >= LIMIT.itemPeople[0] && n <= LIMIT.itemPeople[1])) return { error: 'peopleRange' };
    var subs = [], i;
    for (i = 0; i < n; i++) subs.push(0);
    var sub = 0, any = false;
    for (i = 0; i < o.items.length; i++) {
      var it = o.items[i];
      if (!(it.price > 0)) continue;
      var who = (it.who || []).filter(function (x) { return x >= 0 && x < n; });
      if (!who.length) return { error: 'noSharer', item: i };
      any = true;
      var part = allocate(who.map(function () { return 1; }), it.price, 1, 'even', 0, i);
      who.forEach(function (p, k) { subs[p] += part[k]; });
      sub += it.price;
    }
    if (!any) return { empty: true };
    var tax = pctOf(sub, o.tax || 0), tip = pctOf(sub, o.tip || 0);
    var grand = sub + tax + tip;
    var host = o.host >= 0 && o.host < n ? o.host : 0;
    var shares = allocate(subs, grand, o.unit, o.mode, host);
    return { ok: true, sub: sub, tax: tax, tip: tip, grand: grand, subs: subs, shares: shares, extras: shares.map(function (s, k) { return s - subs[k]; }) };
  }

  // ---------------------------------------------------------------- 정산 (누가 먼저 냈나 → 최소 송금)
  // owes[i] = 낼 돈, paid[i] = 이미 낸 돈 → { ok, transfers: [{from, to, amount}] } | { error: 'paidMismatch', diff }
  function settle(owes, paid) {
    var so = 0, sp = 0, n = owes.length, i;
    for (i = 0; i < n; i++) { so += owes[i]; sp += paid[i] || 0; }
    if (so !== sp) return { error: 'paidMismatch', diff: sp - so };
    var bal = [];
    for (i = 0; i < n; i++) bal.push((paid[i] || 0) - owes[i]);
    var tr = [];
    // 1) 같은 금액끼리 먼저 (한 번에 끝나는 짝)
    for (i = 0; i < n; i++) {
      if (bal[i] >= 0) continue;
      for (var j = 0; j < n; j++) {
        if (bal[j] > 0 && bal[j] === -bal[i]) { tr.push({ from: i, to: j, amount: bal[j] }); bal[j] = 0; bal[i] = 0; break; }
      }
    }
    // 2) 가장 큰 빚 → 가장 큰 받을 돈
    for (var guard = 0; guard < 4 * n; guard++) {
      var d = -1, c = -1;
      for (i = 0; i < n; i++) {
        if (bal[i] < 0 && (d < 0 || bal[i] < bal[d])) d = i;
        if (bal[i] > 0 && (c < 0 || bal[i] > bal[c])) c = i;
      }
      if (d < 0 || c < 0) break;
      var a = Math.min(-bal[d], bal[c]);
      tr.push({ from: d, to: c, amount: a });
      bal[d] += a; bal[c] -= a;
    }
    return { ok: true, transfers: tr };
  }

  // ---------------------------------------------------------------- 공유·저장 모양
  function cleanName(s, max) {
    return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  }
  function isInt(x, lo, hi) { return typeof x === 'number' && Math.floor(x) === x && x >= lo && x <= hi; }
  function isPct(x) { return typeof x === 'number' && isFinite(x) && x >= 0 && x <= LIMIT.pct && Math.round(x * 100) === x * 100; }
  // 상태 s = { m:'a'|'b', c, u, r:'h'|'e', a:{t,n,p}, b:{p:[names], i:[[name, price|null, who[]]], x, q, h}, s:[[who, amount|null]]|null }
  function validState(s) {
    if (!s || typeof s !== 'object') return false;
    if (s.m !== 'a' && s.m !== 'b') return false;
    if (!CURRENCIES[s.c] || !validUnit(s.c, s.u)) return false;
    if (s.r !== 'h' && s.r !== 'e') return false;
    var a = s.a, b = s.b;
    if (!a || !(a.t === null || isInt(a.t, 0, MAX_MINOR)) || !isInt(a.n, LIMIT.people[0], LIMIT.people[1]) || !isPct(a.p)) return false;
    if (!b || !Array.isArray(b.p) || b.p.length < LIMIT.itemPeople[0] || b.p.length > LIMIT.itemPeople[1]) return false;
    if (!b.p.every(function (x) { return typeof x === 'string' && x.length <= LIMIT.name; })) return false;
    if (!Array.isArray(b.i) || b.i.length > LIMIT.items) return false;
    var np = b.p.length;
    if (!b.i.every(function (it) {
      return Array.isArray(it) && it.length === 3 && typeof it[0] === 'string' && it[0].length <= LIMIT.itemName &&
        (it[1] === null || isInt(it[1], 0, MAX_MINOR)) && Array.isArray(it[2]) && it[2].every(function (x) { return isInt(x, 0, np - 1); });
    })) return false;
    if (!isPct(b.x) || !isPct(b.q) || !isInt(b.h, 0, np - 1)) return false;
    if (s.s !== null) {
      var max = s.m === 'a' ? a.n : np;
      if (!Array.isArray(s.s) || s.s.length > LIMIT.payers) return false;
      if (!s.s.every(function (p) { return Array.isArray(p) && p.length === 2 && isInt(p[0], 0, max - 1) && (p[1] === null || isInt(p[1], 0, MAX_MINOR)); })) return false;
    }
    return true;
  }
  function toWire(s) { return validState(s) ? { v: 1, m: s.m, c: s.c, u: s.u, r: s.r, a: s.a, b: s.b, s: s.s } : null; }
  function fromWire(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1) return null;
    var allowed = { v: 1, m: 1, c: 1, u: 1, r: 1, a: 1, b: 1, s: 1 };
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && !allowed[k]) return null;
    var s = { m: o.m, c: o.c, u: o.u, r: o.r, a: o.a, b: o.b, s: o.s === undefined ? null : o.s };
    if (s.b && Array.isArray(s.b.p)) s.b.p = s.b.p.map(function (x) { return typeof x === 'string' ? cleanName(x, LIMIT.name) : x; });
    if (s.b && Array.isArray(s.b.i)) s.b.i.forEach(function (it) { if (Array.isArray(it) && typeof it[0] === 'string') it[0] = cleanName(it[0], LIMIT.itemName); });
    return validState(s) ? s : null;
  }
  function utf8Bytes(str) { return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(str) : Buffer.from(str, 'utf8'); }
  function b64urlEncode(str) {
    var bytes = utf8Bytes(str), bin = '';
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
  function encodeShare(s) { var w = toWire(s); return w ? b64urlEncode(JSON.stringify(w)) : null; }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 8000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    return fromWire(o);
  }
  function defaultState(lang) {
    var c = langCurrency(lang);
    return { m: 'a', c: c, u: CURRENCIES[c].def, r: 'h', a: { t: null, n: 2, p: 0 }, b: { p: ['', ''], i: [['', null, [0, 1]]], x: 0, q: 0, h: 0 }, s: null };
  }

  return {
    CURRENCIES: CURRENCIES, CODES: CODES, LANG_CURRENCY: LANG_CURRENCY, LIMIT: LIMIT, MAX_MINOR: MAX_MINOR,
    currencyOf: currencyOf, langCurrency: langCurrency, scale: scale, validUnit: validUnit,
    parseAmount: parseAmount, parsePct: parsePct, pctOf: pctOf, allocate: allocate, calcEven: calcEven, calcItems: calcItems, groups: groups,
    settle: settle, cleanName: cleanName, validState: validState, toWire: toWire, fromWire: fromWire,
    b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode, encodeShare: encodeShare, decodeShare: decodeShare, defaultState: defaultState,
  };
});
