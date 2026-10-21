/* apps/percent/percent-core.js — 퍼센트 계산기 언어 무관 로직 (UMD: 브라우저 window.PERCENT_CORE + Node 검사 공용)
 *   계산 6가지(mode): of(Y의 X%) · what(X는 Y의 몇 %) · change(A→B 증감률) · adjust(Y를 X% 올리기/내리기, 할인가·절약액)
 *                     · reverse(X% 바뀐 뒤 값 Y → 원래 값) · points(두 비율의 %p 차이 + 상대 변화율).
 *   입력 = 문자열. parseNum(s, dec) 이 언어의 소수점(dec = '.' | ',')을 기준으로 "," 와 "." 를 둘 다 받아 준다:
 *     - 둘 다 있으면 뒤에 나온 쪽이 소수점, 앞쪽은 자릿수 구분 (1,234.5 · 1.234,5)
 *     - 한 종류만 있으면: 언어의 소수점이면 소수점 / 다른 쪽이 여러 번 또는 "정확히 세 자리" 앞이면 자릿수 구분(1,500 · 1.500) / 그 밖엔 소수점(1,5 · 2.75)
 *     - 공백·작은따옴표(스위스식 1'000)·끝의 %·앞의 + 는 무시, −(U+2212) 도 빼기 부호로.
 *   결과는 clean() 으로 부동소수 찌꺼기 제거(유효 15자리 → 소수 10자리, -0 → 0). 너무 큰 수(|x| ≥ 1e15)는 'tooBig'.
 *   오류: badNum(숫자 아님) · divZero(what 의 Y = 0) · fromZero(change 의 A = 0) · over100(내리기/할인·역산에서 100% 이상) · tooBig.
 *   빈 칸이 있으면 { empty: true } (오류 아님 — 화면은 안내 문구만).
 *   서버로 보내는 것도, 주소에 넣는 것도 없다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PERCENT_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MODES = ['of', 'what', 'change', 'adjust', 'reverse', 'points'];
  var DIR_MODES = { adjust: 'down', reverse: 'up' };   // 방향(올리기/내리기)이 있는 계산과 기본 방향
  var CHIPS = [10, 20, 30, 50];                         // adjust 빠른 할인 칩
  var MAX = 1e15;
  // 어느 칸이 퍼센트(%)인가 — 화면 입력 옆 % 표시
  var PCT_FIELDS = { of: { a: true }, what: {}, change: {}, adjust: { b: true }, reverse: { b: true }, points: { a: true, b: true } };

  function clean(x) {
    if (typeof x !== 'number' || !isFinite(x)) return NaN;
    var r = Number(Number(x.toPrecision(15)).toFixed(10));
    return r === 0 ? 0 : r;
  }

  // 언어의 소수점 기호 ('.' 또는 ',')
  function decimalSep(lang) {
    try {
      var parts = new Intl.NumberFormat(lang).formatToParts(1.5);
      for (var i = 0; i < parts.length; i++) if (parts[i].type === 'decimal') return parts[i].value === ',' ? ',' : '.';
    } catch (e) { /* noop */ }
    return '.';
  }

  // 문자열 → { value } | { empty: true } | { error: 'badNum' }
  function parseNum(input, dec) {
    var s = String(input == null ? '' : input).trim();
    s = s.replace(/[\s   '’]/g, '').replace(/[−‒–—﹣－]/g, '-').replace(/％/g, '%');
    s = s.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).replace(/[，]/g, ',').replace(/[．。]/g, '.');
    if (s.charAt(s.length - 1) === '%') s = s.slice(0, -1);
    if (s === '') return { empty: true };
    var sign = 1;
    if (s.charAt(0) === '+') s = s.slice(1);
    else if (s.charAt(0) === '-') { sign = -1; s = s.slice(1); }
    if (s === '') return { error: 'badNum' };
    if (!/^[0-9.,]+$/.test(s) || !/[0-9]/.test(s)) return { error: 'badNum' };
    var localDec = dec === ',' ? ',' : '.';
    var hasDot = s.indexOf('.') >= 0, hasComma = s.indexOf(',') >= 0;
    var decSep = '', group = '';
    if (hasDot && hasComma) {                       // 둘 다: 뒤에 나온 쪽이 소수점
      decSep = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
      group = decSep === '.' ? ',' : '.';
    } else if (hasDot || hasComma) {
      var ch = hasDot ? '.' : ',';
      var count = s.split(ch).length - 1;
      var after = s.length - s.lastIndexOf(ch) - 1;
      if (count > 1) group = ch;                    // 여러 번 = 자릿수 구분
      else if (ch === localDec) decSep = ch;        // 언어의 소수점
      else if (after === 3) group = ch;             // 다른 기호 + 정확히 세 자리 = 자릿수 구분 (1,500 / 1.500)
      else decSep = ch;                             // 그 밖 = 소수점 (1,5 / 2.75)
    }
    var parts = decSep ? s.split(decSep) : [s];
    if (parts.length > 2) return { error: 'badNum' };
    var intPart = parts[0], frac = parts.length === 2 ? parts[1] : '';
    if (/[.,]/.test(frac)) return { error: 'badNum' };
    if (group && intPart.indexOf(group) >= 0) {     // 자릿수 구분 기호는 세 자리마다만
      var g = intPart.split(group);
      if (!g[0] || g[0].length > 3 || g.slice(1).some(function (x) { return x.length !== 3; })) return { error: 'badNum' };
      intPart = g.join('');
    }
    if (/[.,]/.test(intPart)) return { error: 'badNum' };
    if (intPart === '' && frac === '') return { error: 'badNum' };
    var v = Number((intPart || '0') + (frac ? '.' + frac : ''));
    if (!isFinite(v)) return { error: 'badNum' };
    v = sign * v;
    if (Math.abs(v) >= MAX) return { error: 'tooBig' };
    return { value: v === 0 ? 0 : v };
  }

  function big(x) { return !isFinite(x) || Math.abs(x) >= MAX; }

  // mode, a, b (숫자), dir ('up' | 'down') → 결과 객체 | { error }
  function compute(mode, a, b, dir) {
    if (MODES.indexOf(mode) < 0) return { error: 'badMode' };
    if (typeof a !== 'number' || typeof b !== 'number' || !isFinite(a) || !isFinite(b)) return { error: 'badNum' };
    var r, out;
    switch (mode) {
      case 'of':        // a% of b
        r = b * a / 100;
        out = { r: clean(r) };
        break;
      case 'what':      // a 는 b 의 몇 %
        if (b === 0) return { error: 'divZero' };
        r = a / b * 100;
        out = { r: clean(r) };
        break;
      case 'change':    // a → b 증감률 (기준 = |a|)
        if (a === 0) return { error: 'fromZero' };
        r = (b - a) / Math.abs(a) * 100;
        out = { r: clean(r), d: clean(b - a) };
        break;
      case 'adjust': {  // a 를 b% 내리기(할인)/올리기
        var down = dir !== 'up';
        if (down && b > 100) return { error: 'over100' };
        var s = a * b / 100;
        r = down ? a - s : a + s;
        out = { r: clean(r), s: clean(s), dir: down ? 'down' : 'up' };
        break;
      }
      case 'reverse': { // b% 바뀐 뒤 값이 a → 원래 값
        var dn = dir === 'down';
        if (dn && b >= 100) return { error: 'over100' };
        var f = dn ? 1 - b / 100 : 1 + b / 100;
        if (f === 0) return { error: 'divZero' };
        r = a / f;
        var w = dn ? a * (1 + b / 100) : a * (1 - b / 100);   // 흔한 실수: 같은 % 를 거꾸로 적용
        out = { r: clean(r), f: clean(f), d: clean(a - r), w: clean(w), dir: dn ? 'down' : 'up' };
        break;
      }
      case 'points': {  // a% → b% 의 %p 차이와 상대 변화율
        var pp = b - a;
        out = { r: clean(pp), rel: a === 0 ? null : clean(pp / Math.abs(a) * 100) };
        break;
      }
    }
    var nums = [out.r, out.s, out.d, out.w, out.f, out.rel].filter(function (x) { return typeof x === 'number'; });
    if (nums.some(big)) return { error: 'tooBig' };
    if (nums.some(function (x) { return x !== x; })) return { error: 'badNum' };
    out.mode = mode;
    out.a = a;
    out.b = b;
    return out;
  }

  // 문자열 입력 두 칸 → compute 결과 | { empty } | { error, field }
  function run(mode, sa, sb, dir, dec) {
    var pa = parseNum(sa, dec), pb = parseNum(sb, dec);
    if (pa.error) return { error: pa.error, field: 'a' };
    if (pb.error) return { error: pb.error, field: 'b' };
    if (pa.empty || pb.empty) return { empty: true };
    var c = compute(mode, pa.value, pb.value, dir);
    if (c.error) c.field = c.error === 'divZero' || c.error === 'over100' ? 'b' : 'a';
    return c;
  }

  // 부호: 양수 '+', 음수 '−'(U+2212), 0 은 없음
  function signOf(x) { return x > 0 ? '+' : x < 0 ? '−' : ''; }

  return {
    MODES: MODES, DIR_MODES: DIR_MODES, CHIPS: CHIPS, MAX: MAX, PCT_FIELDS: PCT_FIELDS,
    clean: clean, decimalSep: decimalSep, parseNum: parseNum, compute: compute, run: run, signOf: signOf,
  };
});
