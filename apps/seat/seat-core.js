/* apps/seat/seat-core.js — 자리 바꾸기(랜덤 자리 배치) 언어 무관 로직 (UMD: 브라우저 window.SEAT_CORE + Node 검사 공용)
 *   - 이름 읽기: 줄바꿈·쉼표(, ， 、 ; ； 탭)로 나눔, 앞뒤 공백 제거, 최대 100명 · 이름 20자, 같은 이름은 뒤에 " 2" " 3".
 *     입력이 숫자 하나뿐이면(예: 28) 이름 대신 번호 1..N.
 *   - 교실: 줄(rows) 1~10 × 칸(cols) 1~10. 자리 번호 i = r * cols + c, r = 0 이 교탁 바로 앞 줄, c = 0 은 학생 쪽에서 본 왼쪽.
 *     막은 자리(통로·빈자리)에는 아무도 앉지 않는다. 앞자리 = 앞 FRONT_ROWS(2)줄.
 *   - 규칙: 고정 자리(이름 → 자리), 앞자리(이름들), 떨어뜨리기(이름 두 개 — 상하좌우·대각선으로 붙어 앉지 않음).
 *   - 섞기: crypto.getRandomValues 거부 샘플링(치우침 없는 정수) → Fisher–Yates.
 *     1) 고정 자리 먼저, 2) 앞자리 이름은 앞자리 빈 곳 중 균등하게, 3) 나머지는 남은 자리 중 균등하게 → 떨어뜨리기 규칙을 어기면 버리고 다시(최대 REJECT_TRIES 번,
 *        이 단계에서 나온 배치는 규칙을 지키는 모든 배치 가운데 균등). 4) 그래도 안 되면 무작위 순서 백트래킹(MAX_NODES 까지). 못 찾으면 impossible.
 *   - 공유 링크 #d= : { v, r, c, b: 막은 자리, n: 이름 | k: 번호 개수, s: 자리별 이름 번호(-1 = 빈자리), t: 섞은 시각(초), l?: 제목 } JSON → UTF-8 base64url.
 *   - 텍스트 표(toText)와 화면 순서(displayOrder: 학생 쪽 = 교탁 위, 선생님 쪽 = 180° 돌림).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SEAT_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_NAMES = 100;
  var MAX_LEN = 20;
  var MIN_SIDE = 1;
  var MAX_ROWS = 10;
  var MAX_COLS = 10;
  var FRONT_ROWS = 2;
  var MAX_PAIRS = 30;
  var REJECT_TRIES = 600;
  var MAX_NODES = 200000;
  var DEFAULTS = { rows: 5, cols: 6 };
  var U32 = 4294967296;
  var SPLIT_RE = /[\n\r\t,，、;；]+/;

  // ---------------------------------------------------------------- 난수
  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // nextU32() 가 주는 0 ≤ x < 2^32 로 0 ≤ r < max 를 만든다(거부 샘플링: limit 이상은 버리고 다시).
  function uniformInt(max, nextU32) {
    max = Math.floor(max);
    if (!(max >= 1) || max > U32) throw new Error('seat-core: bad range ' + max);
    var limit = Math.floor(U32 / max) * max;
    for (var guard = 0; guard < 1000; guard++) {
      var x = nextU32();
      if (x < limit) return x % max;
    }
    throw new Error('seat-core: random source keeps returning rejected values');
  }
  var buf = null;
  function cryptoU32() {
    var c = cryptoObj();
    if (!c) throw new Error('seat-core: crypto.getRandomValues is not available');
    if (!buf) buf = new Uint32Array(1);
    c.getRandomValues(buf);
    return buf[0];
  }
  function cryptoInt(max) { return uniformInt(max, cryptoU32); }
  // Fisher–Yates (새 배열). ri(max) → 0..max-1
  function shuffle(arr, ri) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = (ri || cryptoInt)(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------------------------------------------------------- 이름
  function cut(s, max) { var a = Array.from(s); return a.length > max ? a.slice(0, max).join('') : s; }
  function cleanName(s) {
    return cut(String(s).replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim(), MAX_LEN).trim();
  }
  // → { names:[], numbered:bool, dropped:n }
  function parseNames(text) {
    var s = String(text == null ? '' : text).trim();
    var m = /^#?\s*(\d{1,4})$/.exec(s);
    if (m) {
      var N = Number(m[1]);
      if (N >= 1) return { names: numberNames(Math.min(N, MAX_NAMES)), numbered: true, dropped: Math.max(0, N - MAX_NAMES) };
    }
    var out = [];
    var seen = {};
    var dropped = 0;
    s.split(SPLIT_RE).forEach(function (raw) {
      var name = cleanName(raw);
      if (!name) return;
      if (out.length >= MAX_NAMES) { dropped++; return; }
      var key = name.toLowerCase();
      if (seen[key]) {
        var k = 2;
        while (seen[(cut(name, MAX_LEN - 3) + ' ' + k).toLowerCase()]) k++;
        name = cut(name, MAX_LEN - 3) + ' ' + k;
        key = name.toLowerCase();
      }
      seen[key] = 1;
      out.push(name);
    });
    return { names: out, numbered: false, dropped: dropped };
  }
  function numberNames(n) { var a = []; for (var i = 1; i <= n; i++) a.push(String(i)); return a; }

  // ---------------------------------------------------------------- 교실
  function clampSide(v, max) {
    v = Math.floor(Number(v));
    if (!isFinite(v)) return MIN_SIDE;
    return Math.min(max, Math.max(MIN_SIDE, v));
  }
  function rowOf(i, cols) { return Math.floor(i / cols); }
  function colOf(i, cols) { return i % cols; }
  function isFront(i, cols) { return rowOf(i, cols) < FRONT_ROWS; }
  // 상하좌우·대각선으로 붙어 있나
  function adjacent(i, j, cols) {
    if (i === j) return false;
    return Math.abs(rowOf(i, cols) - rowOf(j, cols)) <= 1 && Math.abs(colOf(i, cols) - colOf(j, cols)) <= 1;
  }
  // 막은 자리 목록 정리(범위 안·중복 없음·오름차순)
  function cleanBlocked(list, total) {
    var seen = {};
    var out = [];
    (Array.isArray(list) ? list : []).forEach(function (v) {
      if (Number.isInteger(v) && v >= 0 && v < total && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    return out.sort(function (a, b) { return a - b; });
  }
  // 줄·칸을 바꿀 때 (줄, 칸) 위치를 그대로 옮긴다. 범위 밖은 null
  function remapSeat(i, oldCols, newRows, newCols) {
    var r = rowOf(i, oldCols);
    var c = colOf(i, oldCols);
    if (r >= newRows || c >= newCols) return null;
    return r * newCols + c;
  }
  function openSeats(rows, cols, blocked) {
    var b = {};
    blocked.forEach(function (v) { b[v] = 1; });
    var out = [];
    for (var i = 0; i < rows * cols; i++) if (!b[i]) out.push(i);
    return out;
  }

  // ---------------------------------------------------------------- 검사
  // plan = { names:[], rows, cols, blocked:[seat], fixed:[[nameIdx, seat]], front:[nameIdx], apart:[[nameIdx, nameIdx]] }
  // → { ok:true, p } | { ok:false, error, vars }
  function validate(plan) {
    plan = plan || {};
    var names = Array.isArray(plan.names) ? plan.names : [];
    var n = names.length;
    var rows = clampSide(plan.rows, MAX_ROWS);
    var cols = clampSide(plan.cols, MAX_COLS);
    var total = rows * cols;
    var blocked = cleanBlocked(plan.blocked, total);
    var bset = {};
    blocked.forEach(function (v) { bset[v] = 1; });
    var open = total - blocked.length;
    if (!n) return { ok: false, error: 'noNames' };
    if (n > MAX_NAMES) return { ok: false, error: 'tooMany', vars: { max: MAX_NAMES } };
    if (n > open) return { ok: false, error: 'notEnoughSeats', vars: { n: n, s: open } };
    var okIdx = function (k) { return Number.isInteger(k) && k >= 0 && k < n; };

    var fixed = [];
    var seatOf = {};
    var seatTaken = {};
    var list = Array.isArray(plan.fixed) ? plan.fixed : [];
    for (var f = 0; f < list.length; f++) {
      var pair = list[f];
      if (!Array.isArray(pair) || !okIdx(pair[0]) || !Number.isInteger(pair[1]) || pair[1] < 0 || pair[1] >= total) continue;
      if (bset[pair[1]]) return { ok: false, error: 'pinBlocked', vars: { name: names[pair[0]] } };
      if (seatOf[pair[0]] != null) return { ok: false, error: 'pinTwice', vars: { name: names[pair[0]] } };
      if (seatTaken[pair[1]] != null) return { ok: false, error: 'pinSame', vars: { a: names[seatTaken[pair[1]]], b: names[pair[0]] } };
      seatOf[pair[0]] = pair[1];
      seatTaken[pair[1]] = pair[0];
      fixed.push([pair[0], pair[1]]);
    }

    var front = [];
    var fseen = {};
    (Array.isArray(plan.front) ? plan.front : []).forEach(function (k) { if (okIdx(k) && !fseen[k]) { fseen[k] = 1; front.push(k); } });
    for (var q = 0; q < front.length; q++) {
      var k = front[q];
      if (seatOf[k] != null && !isFront(seatOf[k], cols)) return { ok: false, error: 'pinNotFront', vars: { name: names[k] } };
    }
    var frontFree = 0;
    for (var s = 0; s < total; s++) if (!bset[s] && seatTaken[s] == null && isFront(s, cols)) frontFree++;
    var frontLoose = front.filter(function (k) { return seatOf[k] == null; }).length;
    if (frontLoose > frontFree) return { ok: false, error: 'frontFull', vars: { n: frontLoose, s: frontFree } };

    var apart = [];
    var aseen = {};
    var al = Array.isArray(plan.apart) ? plan.apart : [];
    for (var a = 0; a < al.length && apart.length < MAX_PAIRS; a++) {
      var pr = al[a];
      if (!Array.isArray(pr) || !okIdx(pr[0]) || !okIdx(pr[1]) || pr[0] === pr[1]) continue;
      var x = Math.min(pr[0], pr[1]);
      var y = Math.max(pr[0], pr[1]);
      if (aseen[x + ':' + y]) continue;
      aseen[x + ':' + y] = 1;
      if (seatOf[x] != null && seatOf[y] != null && adjacent(seatOf[x], seatOf[y], cols)) return { ok: false, error: 'apartPinned', vars: { a: names[x], b: names[y] } };
      apart.push([x, y]);
    }
    return { ok: true, p: { names: names.slice(), rows: rows, cols: cols, blocked: blocked, fixed: fixed, front: front, apart: apart } };
  }

  // ---------------------------------------------------------------- 섞기
  // p = validate().p → { ok:true, seats:[nameIdx | -1] (길이 rows*cols), method:'uniform'|'search', tries } | { ok:false, error:'impossible' }
  function arrange(p, ri) {
    ri = ri || cryptoInt;
    var n = p.names.length;
    var cols = p.cols;
    var total = p.rows * p.cols;
    var bset = {};
    p.blocked.forEach(function (v) { bset[v] = 1; });
    var seatOf = new Array(n).fill(-1);
    var taken = {};
    p.fixed.forEach(function (f) { seatOf[f[0]] = f[1]; taken[f[1]] = 1; });
    var isFrontName = {};
    p.front.forEach(function (k) { isFrontName[k] = 1; });
    var free = [];
    var frontFree = [];
    for (var s = 0; s < total; s++) {
      if (bset[s] || taken[s]) continue;
      free.push(s);
      if (isFront(s, cols)) frontFree.push(s);
    }
    var loose = [];
    for (var k = 0; k < n; k++) if (seatOf[k] < 0) loose.push(k);
    var frontNames = loose.filter(function (q) { return isFrontName[q]; });
    var otherNames = loose.filter(function (q) { return !isFrontName[q]; });
    var partners = {};
    p.apart.forEach(function (pr) {
      (partners[pr[0]] = partners[pr[0]] || []).push(pr[1]);
      (partners[pr[1]] = partners[pr[1]] || []).push(pr[0]);
    });
    function apartOk(at) {
      for (var i = 0; i < p.apart.length; i++) {
        var pr = p.apart[i];
        if (adjacent(at[pr[0]], at[pr[1]], cols)) return false;
      }
      return true;
    }
    function toSeats(at) {
      var seats = new Array(total).fill(-1);
      for (var i = 0; i < n; i++) seats[at[i]] = i;
      return seats;
    }

    // 1) 균등 배치 + 거절 (떨어뜨리기 규칙이 없으면 한 번에 끝)
    var tries = p.apart.length ? REJECT_TRIES : 1;
    for (var t = 1; t <= tries; t++) {
      var at = seatOf.slice();
      var fs = shuffle(frontFree, ri);
      var used = {};
      frontNames.forEach(function (q, i) { at[q] = fs[i]; used[fs[i]] = 1; });
      var rest = shuffle(free.filter(function (v) { return !used[v]; }), ri);
      otherNames.forEach(function (q, i) { at[q] = rest[i]; });
      if (apartOk(at)) return { ok: true, seats: toSeats(at), method: 'uniform', tries: t };
    }

    // 2) 무작위 순서 백트래킹: 규칙이 걸린 이름(앞자리 → 떨어뜨리기)만 찾고, 나머지는 남은 자리에 무작위로
    var vars = frontNames.concat(otherNames.filter(function (q) { return partners[q]; }));
    vars = shuffle(vars, ri).sort(function (x, y) {
      var fx = isFrontName[x] ? 0 : 1;
      var fy = isFrontName[y] ? 0 : 1;
      if (fx !== fy) return fx - fy;
      return (partners[y] || []).length - (partners[x] || []).length;
    });
    var cur = seatOf.slice();
    var occ = {};
    p.fixed.forEach(function (f) { occ[f[1]] = 1; });
    var nodes = 0;
    var gaveUp = false;
    function fits(q, seat) {
      var ps = partners[q] || [];
      for (var i = 0; i < ps.length; i++) if (cur[ps[i]] >= 0 && adjacent(cur[ps[i]], seat, cols)) return false;
      return true;
    }
    function search(d) {
      if (d === vars.length) return true;
      if (++nodes > MAX_NODES) { gaveUp = true; return false; }
      var q = vars[d];
      var dom = shuffle(isFrontName[q] ? frontFree : free, ri);
      for (var i = 0; i < dom.length; i++) {
        var seat = dom[i];
        if (occ[seat] || !fits(q, seat)) continue;
        cur[q] = seat; occ[seat] = 1;
        if (search(d + 1)) return true;
        cur[q] = -1; occ[seat] = 0;
        if (gaveUp) return false;
      }
      return false;
    }
    if (!search(0)) return { ok: false, error: 'impossible', gaveUp: gaveUp };
    var left = shuffle(free.filter(function (v) { return !occ[v]; }), ri);
    var li = 0;
    for (var z = 0; z < n; z++) if (cur[z] < 0) cur[z] = left[li++];
    return { ok: true, seats: toSeats(cur), method: 'search', tries: tries };
  }

  // 결과가 규칙을 모두 지키나 (검사·디코드용)
  function satisfies(p, seats) {
    var total = p.rows * p.cols;
    if (!Array.isArray(seats) || seats.length !== total) return false;
    var at = new Array(p.names.length).fill(-1);
    var bset = {};
    p.blocked.forEach(function (v) { bset[v] = 1; });
    for (var s = 0; s < total; s++) {
      var k = seats[s];
      if (k === -1) continue;
      if (!Number.isInteger(k) || k < 0 || k >= p.names.length || at[k] >= 0 || bset[s]) return false;
      at[k] = s;
    }
    if (at.some(function (v) { return v < 0; })) return false;
    if (p.fixed.some(function (f) { return at[f[0]] !== f[1]; })) return false;
    if (p.front.some(function (k) { return !isFront(at[k], p.cols); })) return false;
    if (p.apart.some(function (pr) { return adjacent(at[pr[0]], at[pr[1]], p.cols); })) return false;
    return true;
  }

  // ---------------------------------------------------------------- 화면 순서 · 텍스트 표
  // 화면(위→아래, 왼→오) 순서의 자리 번호. student: 교탁이 위(앞줄이 위), teacher: 교탁이 아래(180° 돌림)
  function displayOrder(rows, cols, view) {
    var a = [];
    for (var i = 0; i < rows * cols; i++) a.push(i);
    return view === 'teacher' ? a.reverse() : a;
  }
  function textWidth(s) {
    var w = 0;
    Array.from(String(s)).forEach(function (ch) { w += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(ch) ? 2 : /[ัิ-ฺ็-๎]/.test(ch) ? 0 : 1; });
    return w;
  }
  function pad(s, w) { var d = w - textWidth(s); return d > 0 ? s + new Array(d + 1).join(' ') : s; }
  // res = { rows, cols, names, seats }, L = { title, desk, empty, aisle }
  function toText(res, L, view) {
    L = L || {};
    var cells = res.seats.map(function (k, s) {
      if (k >= 0) return res.names[k];
      return res.blocked && res.blocked.indexOf(s) >= 0 ? (L.aisle || '-') : (L.empty || '');
    });
    var w = Math.max(2, Math.max.apply(null, cells.map(textWidth)));
    var order = displayOrder(res.rows, res.cols, view);
    var lines = [];
    for (var r = 0; r < res.rows; r++) {
      var row = order.slice(r * res.cols, (r + 1) * res.cols).map(function (s) { return pad(cells[s], w); });
      lines.push(('| ' + row.join(' | ') + ' |').replace(/\s+$/, ''));
    }
    var lineW = textWidth(lines[0] || '');
    var deskTxt = '[ ' + (L.desk || 'Desk') + ' ]';
    var lead = Math.max(0, Math.floor((lineW - textWidth(deskTxt)) / 2));
    var desk = new Array(lead + 1).join(' ') + deskTxt;
    var out = [];
    if (L.title) out.push(L.title, '');
    if (view === 'teacher') out = out.concat(lines, '', desk);
    else out = out.concat(desk, '', lines);
    return out.join('\n');
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
  function isNumbered(names) {
    return names.length > 0 && names.every(function (v, i) { return v === String(i + 1); });
  }
  // rec = { rows, cols, blocked, names, seats, t }
  function encodeShare(rec) {
    if (!rec || !Array.isArray(rec.seats) || !Array.isArray(rec.names)) return null;
    var o = { v: 1, r: rec.rows, c: rec.cols, s: rec.seats, t: Math.floor((rec.t || 0) / 1000) };
    if (rec.blocked && rec.blocked.length) o.b = rec.blocked;
    if (isNumbered(rec.names)) o.k = rec.names.length;
    else o.n = rec.names;
    return b64urlEncode(JSON.stringify(o));
  }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 20000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    var o;
    try { o = JSON.parse(b64urlDecode(str)); } catch (e) { return null; }
    if (!o || o.v !== 1 || !Array.isArray(o.s)) return null;
    if (!Number.isInteger(o.r) || o.r < MIN_SIDE || o.r > MAX_ROWS || !Number.isInteger(o.c) || o.c < MIN_SIDE || o.c > MAX_COLS) return null;
    if (!Number.isInteger(o.t) || o.t < 0 || o.t > 99999999999) return null;
    var names;
    if (o.n != null) {
      if (!Array.isArray(o.n) || o.k != null) return null;
      names = o.n;
      if (!names.every(function (v) { return typeof v === 'string' && v === cleanName(v) && v.length > 0; })) return null;
      var lower = names.map(function (v) { return v.toLowerCase(); });
      if (new Set(lower).size !== lower.length) return null;
    } else {
      if (!Number.isInteger(o.k)) return null;
      names = numberNames(o.k);
    }
    if (names.length < 1 || names.length > MAX_NAMES) return null;
    var total = o.r * o.c;
    if (o.b != null && !Array.isArray(o.b)) return null;
    var blocked = o.b || [];
    if (cleanBlocked(blocked, total).length !== blocked.length) return null;
    var chk = validate({ names: names, rows: o.r, cols: o.c, blocked: blocked });
    if (!chk.ok) return null;
    if (!satisfies(chk.p, o.s)) return null;
    return { rows: o.r, cols: o.c, blocked: chk.p.blocked, names: names, seats: o.s.slice(), t: o.t * 1000 };
  }

  return {
    MAX_NAMES: MAX_NAMES, MAX_LEN: MAX_LEN, MIN_SIDE: MIN_SIDE, MAX_ROWS: MAX_ROWS, MAX_COLS: MAX_COLS, FRONT_ROWS: FRONT_ROWS, MAX_PAIRS: MAX_PAIRS,
    REJECT_TRIES: REJECT_TRIES, MAX_NODES: MAX_NODES, DEFAULTS: DEFAULTS,
    uniformInt: uniformInt, cryptoInt: cryptoInt, shuffle: shuffle,
    parseNames: parseNames, cleanName: cleanName, numberNames: numberNames,
    clampSide: clampSide, rowOf: rowOf, colOf: colOf, isFront: isFront, adjacent: adjacent, cleanBlocked: cleanBlocked, remapSeat: remapSeat, openSeats: openSeats,
    validate: validate, arrange: arrange, satisfies: satisfies,
    displayOrder: displayOrder, textWidth: textWidth, toText: toText,
    encodeShare: encodeShare, decodeShare: decodeShare, b64urlEncode: b64urlEncode, b64urlDecode: b64urlDecode, isNumbered: isNumbered,
  };
});
