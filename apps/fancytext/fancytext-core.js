/* apps/fancytext/fancytext-core.js — 멋진 글꼴 변환기 언어 무관 로직 (UMD: 브라우저 window.FANCYTEXT_CORE + Node 검사 공용)
 *   - FONTS: 라틴 글자(A-Z a-z 0-9, 악센트 글자는 기본 글자 + 결합 부호)를 유니코드 글꼴 모양으로 바꾼다. 다른 문자(한글·가나·한자·태국·키릴 …)는 그대로 둔다.
 *   - DECOS: 어떤 글에도 되는 꾸밈 — 취소선·밑줄·물결(결합 부호), 띄어쓰기, ★글★ 같은 장식 감싸기.
 *   - convert(id, text) → 변환 결과, list(text) → [{ id, group, out }] (글꼴은 바뀌는 글자가 있을 때만).
 *   모두 이 브라우저 안에서만 계산한다(서버로 보내지 않음).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FANCYTEXT_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_INPUT = 120;
  var UP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOW = 'abcdefghijklmnopqrstuvwxyz';

  function cp(n) { return String.fromCodePoint(n); }
  function isUp(c) { return c >= 'A' && c <= 'Z'; }
  function isLow(c) { return c >= 'a' && c <= 'z'; }
  function isDigit(c) { return c >= '0' && c <= '9'; }

  // 수학 알파벳처럼 "시작 코드포인트 + 순서" 로 이어진 글꼴 (예외는 따로 지정)
  function mathFont(upStart, lowStart, digitStart, except) {
    return function (c) {
      if (except && except[c]) return except[c];
      if (isUp(c)) return cp(upStart + c.charCodeAt(0) - 65);
      if (isLow(c)) return cp(lowStart + c.charCodeAt(0) - 97);
      if (digitStart && isDigit(c)) return cp(digitStart + c.charCodeAt(0) - 48);
      return c;
    };
  }
  function tableFont(from, to, upperToo) {
    var m = {};
    var f = Array.from(from);
    var t = Array.from(to);
    f.forEach(function (ch, i) { m[ch] = t[i]; });
    return function (c) {
      if (m[c]) return m[c];
      if (upperToo && isUp(c)) return upperToo(c);
      return c;
    };
  }

  var scriptEx = { B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ', e: 'ℯ', g: 'ℊ', o: 'ℴ' };
  var frakEx = { C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ' };
  var dsEx = { C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ' };

  function circled(c) {
    if (isUp(c)) return cp(0x24b6 + c.charCodeAt(0) - 65);
    if (isLow(c)) return cp(0x24d0 + c.charCodeAt(0) - 97);
    if (c === '0') return '⓪';
    if (isDigit(c)) return cp(0x2460 + c.charCodeAt(0) - 49);
    return c;
  }
  // 대문자만 있는 상자·검은 원 글꼴: 소문자는 대문자로
  function upperBlock(start) {
    return function (c) {
      if (isUp(c)) return cp(start + c.charCodeAt(0) - 65);
      if (isLow(c)) return cp(start + c.charCodeAt(0) - 97);
      return c;
    };
  }
  var smallCapsFn = tableFont(LOW, 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ');
  var flipFn = tableFont(
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?!\'"()[]{}<>&_',
    'ɐqɔpǝɟƃɥᴉɾʞꞁɯuodbɹsʇnʌʍxʎz∀ᗺƆᗡƎℲ⅁HIſꓘ˥WNOԀΌᴚS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86˙\'¿¡,„)(][}{><⅋‾'
  );
  function wide(c) {
    if (c === ' ') return '　';
    var n = c.charCodeAt(0);
    return n > 32 && n < 127 ? cp(n + 0xfee0) : c;
  }

  var MAP = {
    bold: mathFont(0x1d400, 0x1d41a, 0x1d7ce),
    italic: mathFont(0x1d434, 0x1d44e, 0, { h: 'ℎ' }),
    boldItalic: mathFont(0x1d468, 0x1d482, 0x1d7ce),
    script: mathFont(0x1d49c, 0x1d4b6, 0, scriptEx),
    boldScript: mathFont(0x1d4d0, 0x1d4ea, 0x1d7ce),
    fraktur: mathFont(0x1d504, 0x1d51e, 0, frakEx),
    doubleStruck: mathFont(0x1d538, 0x1d552, 0x1d7d8, dsEx),
    mono: mathFont(0x1d670, 0x1d68a, 0x1d7f6),
    circled: circled,
    circledBlack: upperBlock(0x1f150),
    squared: upperBlock(0x1f130),
    squaredBlack: upperBlock(0x1f170),
    smallCaps: smallCapsFn,
    wide: wide
  };

  // 화면에 보이는 순서 (id). 글꼴 15개, 어떤 글에도 되는 꾸밈 10개
  var FONTS = ['bold', 'italic', 'boldItalic', 'script', 'boldScript', 'fraktur', 'doubleStruck', 'mono', 'circled', 'circledBlack', 'squared', 'squaredBlack', 'smallCaps', 'upsideDown', 'wide'];
  var DECOS = ['strike', 'underline', 'wavy', 'spaced', 'stars', 'ornate', 'flower', 'heart', 'bracket', 'sparkle'];
  var COMBINE = { strike: '̶', underline: '̲', wavy: '̴' };
  var WRAP = { stars: ['★', '★'], ornate: ['꧁', '꧂'], flower: ['✿', '✿'], heart: ['♡', '♡'], bracket: ['『', '』'], sparkle: ['･ﾟ✧', '✧ﾟ･'] };

  function clean(text) {
    return Array.from(String(text == null ? '' : text).replace(/\r\n?/g, '\n')).slice(0, MAX_INPUT).join('');
  }

  // 글자 하나(결합 부호 포함 묶음)를 글꼴로 바꾼다. é → 기본 글자 e 를 바꾸고 악센트는 뒤에 붙인다.
  function mapChar(ch, fn) {
    if (ch.length === 1 && /[A-Za-z0-9]/.test(ch)) return fn(ch);
    var d = ch.normalize('NFD');
    if (d !== ch && /^[A-Za-z]/.test(d)) return fn(d[0]) + d.slice(1);
    return fn(ch);
  }
  function mapText(text, fn) {
    return Array.from(text).map(function (ch) { return mapChar(ch, fn); }).join('');
  }

  function upsideDown(text) {
    return text.split('\n').map(function (line) {
      // 글자 + 뒤따르는 결합 부호를 한 덩어리로 묶어 뒤집는다
      var parts = [];
      Array.from(mapText(line, flipFn)).forEach(function (ch) {
        if (/[̀-ͯ]/.test(ch) && parts.length) parts[parts.length - 1] += ch;
        else parts.push(ch);
      });
      return parts.reverse().join('');
    }).reverse().join('\n');
  }
  function combine(text, mark) {
    return Array.from(text).map(function (ch) { return ch === '\n' ? ch : ch + mark; }).join('');
  }
  function spaced(text) {
    return text.split('\n').map(function (line) { return Array.from(line).join(' '); }).join('\n');
  }
  function wrap(text, w) {
    return text.split('\n').map(function (line) { return line ? w[0] + line + w[1] : line; }).join('\n');
  }

  function convert(id, text) {
    var t = clean(text);
    if (MAP[id]) return mapText(t, MAP[id]);
    if (id === 'upsideDown') return upsideDown(t);
    if (COMBINE[id]) return combine(t, COMBINE[id]);
    if (id === 'spaced') return spaced(t);
    if (WRAP[id]) return wrap(t, WRAP[id]);
    return t;
  }

  // 변환할 라틴 글자·숫자(악센트 글자 포함)가 하나라도 있는지
  function hasLatin(text) {
    return Array.from(clean(text)).some(function (ch) { return /[A-Za-z0-9]/.test(ch) || (/^[A-Za-z]/.test(ch.normalize('NFD')) && ch.normalize('NFD') !== ch); });
  }

  // 화면에 보일 목록. 글꼴은 글을 실제로 바꿀 때만, 꾸밈은 글이 있으면 항상.
  function list(text) {
    var t = clean(text);
    if (!t.trim()) return [];
    var out = [];
    var latin = hasLatin(t);
    FONTS.forEach(function (id) { var o = latin ? convert(id, t) : t; if (o !== t) out.push({ id: id, group: 'font', out: o }); });
    DECOS.forEach(function (id) { out.push({ id: id, group: 'deco', out: convert(id, t) }); });
    return out;
  }

  return { MAX_INPUT: MAX_INPUT, FONTS: FONTS, DECOS: DECOS, clean: clean, convert: convert, hasLatin: hasLatin, list: list };
});
