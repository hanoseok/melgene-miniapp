/* apps/dday/dday-core.js — 디데이 계산기 언어 무관 로직 (UMD: 브라우저 window.DDAY_CORE + Node 검사 공용)
 *   날짜 = 그 사람의 달력 날짜 { y, m, d } (시간대 없음). 날짜끼리의 차이는 "UTC 정오" 일 번호로 센다 —
 *   dayNumber(y,m,d) = Date.UTC(y, m-1, d, 12) / 86400000 → 서머타임(23·25시간 하루)·시간대와 상관없이 언제나 정수.
 *   "오늘" 과 남은 시·분·초만 기기 시간(로컬)을 쓴다: 목표 순간 = new Date(y, m-1, d, hh, mm) (로컬, 서머타임은 브라우저가 처리).
 *
 *   모드 3개
 *     countdown (k:'c') 목표 날짜까지: 남은 달력 일수 → D-n / D-DAY / D+n, 그리고 실시간 남은(지난) 일·시·분·초.
 *     since     (k:'s') 시작일부터: 지난 일수. day1 = 시작일을 1일로 센다(한국 100일 셈법) → 오늘이 "n일째".
 *                     다가오는 기념일: 100·200·300·500·1000…일, 해마다 돌아오는 주년(2/29 시작은 평년에 2/28).
 *     math      (k:'m') 날짜 ± N일 → 결과 날짜와 요일.
 *   공유 링크: #d=<UTF-8 base64url(JSON {v,k,t,d,h?,e,c,o?,n?})> — 받은 쪽은 꼼꼼히 검사하고, 자기 시간대에서 다시 센다.
 *   저장 목록: 이 기기 localStorage 에 최대 10개(화면 JS 가 읽고 쓰고, 여기서는 모양 검사만).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DDAY_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DAY_MS = 86400000;
  var MODES = ['countdown', 'since', 'math'];
  var KEYS = { countdown: 'c', since: 's', math: 'm' };
  var MIN_YEAR = 1900;
  var MAX_YEAR = 2199;
  var MAX_N = 99999;           // 날짜 계산 ± 최대 일수(약 273년)
  var MAX_TITLE = 40;
  var SAVED_MAX = 10;
  var EMOJIS = ['📅', '🎉', '🎂', '💖', '💍', '👶', '🎓', '✈️', '🏖️', '🎃', '🎄', '⭐'];
  // 카드 색: a → b 그라데이션, fg 글자, accent 강조(도형·D 숫자 띠)
  var THEMES = [
    { id: 'tomato', a: '#ff6a4d', b: '#ffb36b', fg: '#2a1308', accent: '#fff4e6' },
    { id: 'mint', a: '#2fc7a3', b: '#a8f0cf', fg: '#08261f', accent: '#f0fff8' },
    { id: 'grape', a: '#6c4dff', b: '#c39bff', fg: '#ffffff', accent: '#ffe86b' },
    { id: 'ocean', a: '#1f6fd6', b: '#6fd0ff', fg: '#ffffff', accent: '#fff36b' },
    { id: 'ink', a: '#141a2e', b: '#3a4566', fg: '#ffffff', accent: '#ff6a4d' },
  ];
  var DAY_MILESTONES = [100, 200, 300, 500, 1000, 1500, 2000, 3000, 5000, 10000];
  var PRESETS = [
    { id: 'halloween', m: 10, d: 31 },
    { id: 'christmas', m: 12, d: 25 },
    { id: 'newyear', m: 1, d: 1 },
    { id: 'valentine', m: 2, d: 14 },
  ];

  // ---------------------------------------------------------------- 달력 날짜
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function daysInMonth(y, m) { return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; }
  function validYmd(o, loose) {
    if (!o || !Number.isInteger(o.y) || !Number.isInteger(o.m) || !Number.isInteger(o.d)) return false;
    var lo = loose ? 1 : MIN_YEAR, hi = loose ? 9999 : MAX_YEAR;
    if (o.y < lo || o.y > hi || o.m < 1 || o.m > 12) return false;
    return o.d >= 1 && o.d <= daysInMonth(o.y, o.m);
  }
  function pad(n, w) { var s = String(Math.abs(n)); while (s.length < (w || 2)) s = '0' + s; return s; }
  // 'YYYY-MM-DD' → { y, m, d } (없는 날짜·범위 밖이면 null)
  function parseYmd(s) {
    var mt = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s == null ? '' : s));
    if (!mt) return null;
    var o = { y: +mt[1], m: +mt[2], d: +mt[3] };
    return validYmd(o) ? o : null;
  }
  function fmtYmd(o) { return pad(o.y, 4) + '-' + pad(o.m) + '-' + pad(o.d); }
  // UTC 정오의 일 번호 — 정수. 시간대·서머타임과 무관.
  function dayNumber(o) { return Math.floor(Date.UTC(o.y, o.m - 1, o.d, 12) / DAY_MS); }
  function fromDayNumber(n) {
    var dt = new Date(n * DAY_MS + DAY_MS / 2);
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }
  function addDays(o, n) { return fromDayNumber(dayNumber(o) + n); }
  function diffDays(a, b) { return dayNumber(b) - dayNumber(a); }      // b - a (일)
  function weekday(o) { return (dayNumber(o) % 7 + 7 + 4) % 7; }       // 0=일 … 6=토 (일 번호 0 = 1970-01-01 목요일)
  function cmp(a, b) { return dayNumber(a) - dayNumber(b); }
  // 기기 시간 기준 오늘(로컬 달력 날짜)
  function today(now) {
    var t = now instanceof Date ? now : new Date(now == null ? Date.now() : now);
    return { y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate() };
  }
  // 브라우저 Date(로컬 정오) — Intl.DateTimeFormat 로 요일·날짜를 쓸 때. 정오라 서머타임 경계에서도 날짜가 밀리지 않는다.
  function toLocalDate(o) { var dt = new Date(2000, 0, 1, 12); dt.setFullYear(o.y, o.m - 1, o.d); return dt; }
  // 연·월 더하기 — 그 달에 없는 날은 말일로(1/31 + 1달 = 2/28 또는 2/29, 2/29 + 1년 = 평년 2/28)
  function addMonths(o, k) {
    var t = (o.y * 12 + (o.m - 1)) + k;
    var y = Math.floor(t / 12), m = t - y * 12 + 1;
    return { y: y, m: m, d: Math.min(o.d, daysInMonth(y, m)) };
  }
  // a → b 의 년·개월·일 (a <= b). 기념일 셈과 같은 "말일 맞춤".
  function calendarDiff(a, b) {
    if (cmp(a, b) > 0) return null;
    var total = (b.y - a.y) * 12 + (b.m - a.m);
    while (total > 0 && cmp(addMonths(a, total), b) > 0) total--;
    var anchor = addMonths(a, total);
    return { y: Math.floor(total / 12), m: total % 12, d: diffDays(anchor, b) };
  }

  // ---------------------------------------------------------------- 시각
  function parseHm(s) {
    var mt = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(s == null ? '' : s));
    return mt ? { h: +mt[1], min: +mt[2] } : null;
  }
  // 목표 순간(ms, 로컬). 시각이 없으면 그날 0시.
  function targetMs(o, hm) {
    var t = new Date(2000, 0, 1, 0, 0, 0, 0);
    t.setFullYear(o.y, o.m - 1, o.d);
    t.setHours(hm ? hm.h : 0, hm ? hm.min : 0, 0, 0);
    return t.getTime();
  }
  // ms → { days, h, m, s } (절댓값, 내림)
  function breakdown(ms) {
    var a = Math.floor(Math.abs(ms) / 1000);
    return { days: Math.floor(a / 86400), h: Math.floor(a % 86400 / 3600), m: Math.floor(a % 3600 / 60), s: a % 60 };
  }

  // ---------------------------------------------------------------- 디데이
  // diff = 목표 - 오늘 (달력 일). D-n(앞으로) · D-DAY(0) · D+n(지남)
  function ddayLabel(diff) { return diff > 0 ? 'D-' + diff : diff === 0 ? 'D-DAY' : 'D+' + (-diff); }
  function ddayState(diff) { return diff > 0 ? 'future' : diff === 0 ? 'today' : 'past'; }

  // 시작일부터 지난 일수. day1 이면 시작일 = 1일째(시작일 당일 1, 다음 날 2 …). 시작일이 미래면 음수/0 이하.
  function sinceCount(start, now, day1) {
    var diff = diffDays(start, now);
    return day1 ? diff + 1 : diff;
  }
  // n일째(day1) / n일 뒤(plain) 가 되는 날
  function dayOf(start, n, day1) { return addDays(start, day1 ? n - 1 : n); }
  // 다가오는 기념일 — 오늘(포함) 이후, 날짜 순, 최대 limit 개. { kind:'days'|'years', n, date, diff }
  function milestones(start, now, day1, limit) {
    var out = [];
    DAY_MILESTONES.forEach(function (n) {
      var date = dayOf(start, n, day1);
      if (validYmd(date, true)) out.push({ kind: 'days', n: n, date: date, diff: diffDays(now, date) });
    });
    for (var k = 1; k <= 100; k++) {
      var date = addMonths(start, 12 * k);
      out.push({ kind: 'years', n: k, date: date, diff: diffDays(now, date) });
    }
    return out.filter(function (x) { return x.diff >= 0; })
      .sort(function (a, b) { return a.diff - b.diff || (a.kind === 'years' ? 1 : -1); })
      .slice(0, limit || 6);
  }

  // 빠른 선택: 오늘(포함) 이후 가장 가까운 그날. 날짜 순.
  function presets(now) {
    return PRESETS.map(function (p) {
      var y = now.y;
      var date = { y: y, m: p.m, d: p.d };
      if (cmp(date, now) < 0) date = { y: y + 1, m: p.m, d: p.d };
      return { id: p.id, date: date, diff: diffDays(now, date) };
    }).sort(function (a, b) { return a.diff - b.diff; });
  }

  // ---------------------------------------------------------------- 계산 묶음 (화면 JS 가 그대로 그린다)
  // rec = { k: 'countdown'|'since'|'math', t: 제목, d: {y,m,d}, h: {h,min}|null, e: 이모지 번호, c: 색 번호, o: day1(bool), n: 일수(정수) }
  function compute(rec, nowMs) {
    var nowD = new Date(nowMs);
    var tdy = today(nowD);
    if (rec.k === 'countdown') {
      var diff = diffDays(tdy, rec.d);
      var ms = targetMs(rec.d, rec.h) - nowMs;
      return { k: rec.k, diff: diff, label: ddayLabel(diff), state: ddayState(diff), ms: ms, live: breakdown(ms), weekday: weekday(rec.d) };
    }
    if (rec.k === 'since') {
      var n = sinceCount(rec.d, tdy, rec.o);
      var future = diffDays(tdy, rec.d) > 0;
      return {
        k: rec.k, count: n, state: future ? 'future' : 'running', until: future ? diffDays(tdy, rec.d) : 0,
        label: future ? ddayLabel(diffDays(tdy, rec.d)) : String(n),
        ymd: future ? null : calendarDiff(rec.d, tdy), weeks: future ? null : { w: Math.floor(diffDays(rec.d, tdy) / 7), d: diffDays(rec.d, tdy) % 7 },
        milestones: milestones(rec.d, tdy, rec.o, 6), weekday: weekday(rec.d),
      };
    }
    var res = addDays(rec.d, rec.n);
    return { k: 'math', result: res, weekday: weekday(res), diffToday: diffDays(tdy, res), label: fmtYmd(res) };
  }

  // ---------------------------------------------------------------- 입력 다듬기
  function cleanTitle(s) {
    var t = String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f-\u009f<>\u2028\u2029]/g, ' ').replace(/\s+/g, ' ').trim();
    return Array.from(t).slice(0, MAX_TITLE).join('').trim();
  }
  function cleanN(v) {
    var s = String(v == null ? '' : v).trim();
    if (!/^[+-]?\d{1,6}$/.test(s)) return null;
    var n = parseInt(s, 10);
    return Math.abs(n) <= MAX_N ? n : null;
  }
  function isMode(k) { return MODES.indexOf(k) >= 0; }
  function validRec(r) {
    if (!r || !isMode(r.k) || typeof r.t !== 'string' || cleanTitle(r.t) !== r.t || !validYmd(r.d)) return false;
    if (!Number.isInteger(r.e) || r.e < 0 || r.e >= EMOJIS.length || !Number.isInteger(r.c) || r.c < 0 || r.c >= THEMES.length) return false;
    if (r.k === 'countdown') { if (r.h != null && !(Number.isInteger(r.h.h) && r.h.h >= 0 && r.h.h < 24 && Number.isInteger(r.h.min) && r.h.min >= 0 && r.h.min < 60)) return false; }
    else if (r.h != null) return false;
    if (r.k === 'since') { if (typeof r.o !== 'boolean') return false; } else if (r.o != null) return false;
    if (r.k === 'math') { if (!Number.isInteger(r.n) || Math.abs(r.n) > MAX_N) return false; } else if (r.n != null) return false;
    return true;
  }
  function sameRec(a, b) {
    return a.k === b.k && a.t === b.t && fmtYmd(a.d) === fmtYmd(b.d) && fmtHm(a.h) === fmtHm(b.h) && !!a.o === !!b.o && (a.n || 0) === (b.n || 0) && a.e === b.e && a.c === b.c;
  }
  function fmtHm(h) { return h ? pad(h.h) + ':' + pad(h.min) : ''; }

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
  function toWire(r) {
    var o = { v: 1, k: KEYS[r.k], t: r.t, d: fmtYmd(r.d), e: r.e, c: r.c };
    if (r.k === 'countdown' && r.h) o.h = fmtHm(r.h);
    if (r.k === 'since') o.o = r.o ? 1 : 0;
    if (r.k === 'math') o.n = r.n;
    return o;
  }
  function fromWire(o) {
    if (!o || typeof o !== 'object' || Array.isArray(o) || o.v !== 1) return null;
    var allowed = { v: 1, k: 1, t: 1, d: 1, h: 1, e: 1, c: 1, o: 1, n: 1 };
    for (var key in o) if (Object.prototype.hasOwnProperty.call(o, key) && !allowed[key]) return null;
    var k = null;
    MODES.forEach(function (m) { if (KEYS[m] === o.k) k = m; });
    if (!k || typeof o.d !== 'string') return null;
    var r = { k: k, t: o.t, d: parseYmd(o.d), e: o.e, c: o.c };
    if (o.h != null) { if (typeof o.h !== 'string') return null; r.h = parseHm(o.h); if (!r.h) return null; }
    if (o.o != null) { if (o.o !== 0 && o.o !== 1) return null; r.o = o.o === 1; }
    if (k === 'since' && r.o == null) return null;
    if (o.n != null) r.n = o.n;
    if (k === 'math' && r.n == null) return null;
    return validRec(r) ? r : null;
  }
  function encodeShare(r) { return validRec(r) ? b64urlEncode(JSON.stringify(toWire(r))) : null; }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 1000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    return fromWire(o);
  }

  // ---------------------------------------------------------------- 저장 목록 (localStorage 모양 — 공유 링크와 같은 모양 + id)
  function toSaved(r, id) { var o = toWire(r); o.id = id; return o; }
  function fromSaved(o) {
    if (!o || typeof o !== 'object' || !Number.isFinite(o.id)) return null;
    var c = {};
    for (var key in o) if (key !== 'id' && Object.prototype.hasOwnProperty.call(o, key)) c[key] = o[key];
    var r = fromWire(c);
    if (r) r.id = o.id;
    return r;
  }
  // 맨 앞에 넣는다. 같은 것이 있으면 맨 앞으로 옮기고, 10개를 넘으면 가장 오래된 것을 뺀다.
  function pushSaved(list, r, id) {
    var cur = Array.isArray(list) ? list.slice() : [];
    var dupe = -1;
    cur.forEach(function (x, i) { if (dupe < 0 && sameRec(x, r)) dupe = i; });
    var item = Object.assign({}, r, { id: id });
    if (dupe >= 0) cur.splice(dupe, 1);
    var full = dupe < 0 && cur.length >= SAVED_MAX;
    return { list: [item].concat(cur).slice(0, SAVED_MAX), dupe: dupe >= 0, dropped: full };
  }
  function cleanSaved(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(fromSaved).filter(Boolean).slice(0, SAVED_MAX);
  }
  function serializeSaved(list) { return list.map(function (r) { return toSaved(r, r.id); }); }

  return {
    DAY_MS: DAY_MS, MODES: MODES, MIN_YEAR: MIN_YEAR, MAX_YEAR: MAX_YEAR, MAX_N: MAX_N, MAX_TITLE: MAX_TITLE, SAVED_MAX: SAVED_MAX,
    EMOJIS: EMOJIS, THEMES: THEMES, DAY_MILESTONES: DAY_MILESTONES, PRESETS: PRESETS,
    isLeap: isLeap, daysInMonth: daysInMonth, validYmd: validYmd, parseYmd: parseYmd, fmtYmd: fmtYmd, parseHm: parseHm, fmtHm: fmtHm,
    dayNumber: dayNumber, fromDayNumber: fromDayNumber, addDays: addDays, diffDays: diffDays, weekday: weekday, cmp: cmp,
    today: today, toLocalDate: toLocalDate, addMonths: addMonths, calendarDiff: calendarDiff, targetMs: targetMs, breakdown: breakdown,
    ddayLabel: ddayLabel, ddayState: ddayState, sinceCount: sinceCount, dayOf: dayOf, milestones: milestones, presets: presets, compute: compute,
    cleanTitle: cleanTitle, cleanN: cleanN, isMode: isMode, validRec: validRec, sameRec: sameRec,
    encodeShare: encodeShare, decodeShare: decodeShare, b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode,
    pushSaved: pushSaved, cleanSaved: cleanSaved, serializeSaved: serializeSaved,
  };
});
