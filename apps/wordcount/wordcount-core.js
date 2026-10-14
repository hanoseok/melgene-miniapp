/* apps/wordcount/wordcount-core.js — 글자수 세기 로직 (언어 무관, UMD: 브라우저 window.WORDCOUNT_CORE + Node require)
 *
 * 세는 법(가이드·FAQ 와 같은 정의):
 *   - 줄바꿈은 먼저 \n 하나로 맞춘다(\r\n, \r → \n). 글자수(공백 포함)에서 줄바꿈 1개 = 1글자.
 *   - 글자 = 사람이 보는 한 글자(grapheme). Intl.Segmenter('grapheme') 가 있으면 그것으로, 없으면 결합 문자·ZWJ·이모지 변형·국기 쌍을 붙여 근사.
 *     👨‍👩‍👧 = 1, é(e + ◌́) = 1, 🇰🇷 = 1, ที่ = 1.
 *   - 공백 제외 = 모든 공백 문자(스페이스·탭·줄바꿈·NBSP·전각 공백 등 \s)를 뺀 글자.
 *   - 단어 = Intl.Segmenter('word') 의 isWordLike 조각. 한중일·태국어는 사전 기반으로 나뉜다(今日|は|晴れ|です).
 *     띄어 쓰지 않고 붙은 조각은 (한자·가나·태국·라오·크메르·미얀마 문자가 아니면) 한 단어로 합친다: AI는 · 2026년 · e-mail(하이픈 하나 사이) = 1.
 *     Segmenter 가 없으면 공백으로 나누고, 한자·가나는 글자마다 1단어로 센다.
 *   - 문장 = Intl.Segmenter('sentence') 조각 중 글자·숫자가 있는 것(Mr. Dr. 같은 영어 약어 뒤는 이어 붙임). 없으면 . ! ? 。 ！ ？ … 와 줄바꿈으로 나눔.
 *   - 문단 = 빈 줄로 나뉜 덩어리 수, 줄 = 비어 있지 않은 줄 수.
 *   - 바이트: utf8 = UTF-8(줄바꿈 1) · neis = UTF-8 + 줄바꿈 2(CR+LF, 나이스 학생부 방식: 한글 3·영문 1·엔터 2) ·
 *             legacy = 완성형 2바이트(EUC-KR·Shift_JIS·GBK 근사: ASCII 1, 그 밖 코드 포인트 2, 줄바꿈 2).
 *   - 읽는 시간: 단어 238개/분 + 한글 음절 500자/분 + 한자·가나 500자/분. 말하는 시간: 단어 150개/분 + 한글 300자/분 + 한자·가나 300자/분.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WORDCOUNT_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var BYTE_MODES = ['utf8', 'neis', 'legacy'];
  var LIMIT_PRESETS = [0, 500, 1000, 1500];   // 0 = 끔
  var LIMIT_MAX = 1000000;
  var RATES = {
    read: { words: 238, hangul: 500, cjk: 500 },
    speak: { words: 150, hangul: 300, cjk: 300 }
  };
  var DEFAULTS = { byteMode: 'utf8', limit: 0, limitSpaces: true };

  var RE_HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/g;
  var RE_CJK = /[⺀-⿟぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ]|[\ud840-\ud87f][\udc00-\udfff]/g;
  var RE_DICT = /[⺀-⿟぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ฀-໿က-႟ក-៿]|[\ud840-\ud87f][\udc00-\udfff]/;
  var RE_SPACE = /\s/;
  var HYPHENS = { '-': 1, '‐': 1, '‑': 1 };
  var ABBR = /(^|\s)(mr|mrs|ms|dr|prof|st|jr|sr|vs|etc|e\.g|i\.e|no|fig|approx)\.\s*$/i;

  // 흔한 단어(키워드 상위 목록에서 뺀다) — 여러 언어를 한꺼번에(어느 언어 화면이든 같은 결과)
  var STOP = {};
  ('the a an and or but of to in on at by for with from as is are was were be been being it its this that these those i you he she we they me my your our their his her ' +
   'not no so if then than there here do does did have has had will would can could should may might just also very about into over more most such what which who whom ' +
   'le la les un une des de du et ou en au aux ce ces cet cette est sont il elle ils elles on nous vous je tu que qui dans par pour sur pas plus se sa son ses leur ne ' +
   'der die das ein eine einen einem einer und oder zu im in am an auf mit von für ist sind war nicht es sie er wir ich du den dem des sich auch als wie bei aus nach ' +
   'el los las una unos unas y o en con por para es son era no se lo le les su sus al del que como más pero ' +
   'il lo gli i una uno e di da con per tra fra che è sono non si mi ti ci al dei della delle nel ' +
   'o os as um uma uns umas e ou em no na nos nas com por para é são não se que do da dos das ao ' +
   'и в во не на я он она оно они мы вы ты что как с со к а но по из у за от до это то же бы ли ' +
   'の に は を た が で て と し も な か だ です ます この その こと する いる ある ' +
   '的 了 是 在 和 有 也 就 不 都 一 这 那 上 着 个 到 与 及 ' +
   '그리고 그 이 저 및 등 수 것 더 또 또는 있다 있습니다 합니다 하는 한 할 그런 이런')
    .split(' ').forEach(function (w) { if (w) STOP[w] = 1; });

  // ---------------------------------------------------------------- 공통
  function hasSeg(opts) {
    return !(opts && opts.noSegmenter) && typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';
  }
  var segCache = {};
  function segmenter(lang, granularity) {
    var k = (lang || 'en') + '|' + granularity;
    if (!segCache[k]) {
      try { segCache[k] = new Intl.Segmenter(lang || 'en', { granularity: granularity }); }
      catch (e) { segCache[k] = new Intl.Segmenter('en', { granularity: granularity }); }
    }
    return segCache[k];
  }
  function normalize(text) {
    return String(text == null ? '' : text).replace(/\r\n?/g, '\n');
  }
  function count(re, s) { var m = s.match(re); return m ? m.length : 0; }

  // ---------------------------------------------------------------- 글자 (grapheme)
  var RE_EXTEND = /[̀-ͯ҃-҉֑-ֽؐ-ًؚ-ٟऀ-ःऺ-ॏัิ-ฺ็-๎ັິ-ຼ່-ໍ᪰-᫿᷀-᷿⃐-⃿〪-゙゚〯︀-️︠-︯‌]/;
  function graphemesFallback(s) {
    var cps = Array.from(s);
    var out = [];
    for (var i = 0; i < cps.length; i++) {
      var c = cps[i];
      var cp = c.codePointAt(0);
      var prev = out.length ? out[out.length - 1] : null;
      var prevLast = prev ? Array.from(prev).pop() : '';
      var prevCp = prevLast ? prevLast.codePointAt(0) : 0;
      var join = false;
      if (prev != null) {
        if (RE_EXTEND.test(c)) join = true;                                   // 결합 문자·변형 선택자
        else if (cp >= 0x1f3fb && cp <= 0x1f3ff) join = true;                 // 피부색
        else if (cp >= 0xe0020 && cp <= 0xe007f) join = true;                 // 태그(깃발)
        else if (prevCp === 0x200d) join = true;                              // ZWJ 다음
        else if (cp === 0x200d) join = true;                                  // ZWJ
        else if (c === '\n' && prevLast === '\r') join = true;
        else if (cp >= 0x1f1e6 && cp <= 0x1f1ff && prevCp >= 0x1f1e6 && prevCp <= 0x1f1ff && Array.from(prev).length % 2 === 1) join = true; // 국기 쌍
      }
      if (join) out[out.length - 1] = prev + c; else out.push(c);
    }
    return out;
  }
  function graphemes(text, opts) {
    var s = String(text == null ? '' : text);
    if (!s) return [];
    if (hasSeg(opts)) {
      var out = [];
      var it = segmenter('en', 'grapheme').segment(s)[Symbol.iterator]();
      for (var r = it.next(); !r.done; r = it.next()) out.push(r.value.segment);
      return out;
    }
    return graphemesFallback(s);
  }

  // ---------------------------------------------------------------- 단어
  // 단어 조각 목록(합친 뒤). 키워드·읽는 시간도 이것을 쓴다.
  function wordList(text, opts) {
    var s = normalize(text);
    if (!s.trim()) return [];
    var lang = opts && opts.lang;
    if (!hasSeg(opts)) {
      var out = [];
      s.split(/\s+/).forEach(function (tok) {
        if (!tok) return;
        // 한자·가나는 글자마다 1단어, 나머지 덩어리는 1단어 (글자·숫자가 있을 때만)
        var rest = tok.replace(RE_CJK, function (ch) { out.push(ch); return ' '; });
        rest.split(' ').forEach(function (p) { if (/[0-9A-Za-zÀ-ɏͰ-ϿЀ-ӿ֐-ۿ฀-๿ᄀ-ᇿ㄰-㆏가-힯]/.test(p)) out.push(p.replace(/^[^\wÀ-￿]+|[^\wÀ-￿]+$/g, '')); });
      });
      return out;
    }
    var segs = [];
    var it = segmenter(lang, 'word').segment(s)[Symbol.iterator]();
    for (var r = it.next(); !r.done; r = it.next()) segs.push(r.value);
    var words = [];
    var lastEnd = -1;        // 앞 단어가 끝난 위치
    var lastDict = true;     // 앞 단어가 사전 기반 문자(한자·가나·태국어…)인지
    var pendingHyphen = false;
    for (var i = 0; i < segs.length; i++) {
      var g = segs[i];
      if (g.isWordLike) {
        var dict = RE_DICT.test(g.segment);
        var touching = (g.index === lastEnd) || (pendingHyphen && words.length);
        if (words.length && touching && !dict && !lastDict) {
          words[words.length - 1] += (pendingHyphen ? '-' : '') + g.segment;
        } else {
          words.push(g.segment);
        }
        lastDict = dict;
        lastEnd = g.index + g.segment.length;
        pendingHyphen = false;
      } else {
        // 단어 사이 하이픈 하나(well-known, e-mail) 는 이어 붙임
        pendingHyphen = !!(HYPHENS[g.segment] && g.index === lastEnd && segs[i + 1] && segs[i + 1].isWordLike && segs[i + 1].index === g.index + g.segment.length);
        if (!pendingHyphen) lastEnd = -1;
      }
    }
    return words;
  }

  // ---------------------------------------------------------------- 문장
  function sentenceCount(text, opts) {
    var s = normalize(text);
    if (!s.trim()) return 0;
    var parts = [];
    if (hasSeg(opts)) {
      var it = segmenter(opts && opts.lang, 'sentence').segment(s)[Symbol.iterator]();
      for (var r = it.next(); !r.done; r = it.next()) parts.push(r.value.segment);
      // 영어 약어(Mr. Dr. e.g.) 뒤에서 잘린 문장은 다음 조각과 합친다
      var merged = [];
      parts.forEach(function (p) {
        if (merged.length && ABBR.test(merged[merged.length - 1]) && !/\n\s*$/.test(merged[merged.length - 1])) merged[merged.length - 1] += p;
        else merged.push(p);
      });
      parts = merged;
    } else {
      parts = s.split(/[.!?。！？…]+|\n+/);
    }
    return parts.filter(function (p) { return /[0-9A-Za-zÀ-￿]/.test(p) && /[^\s.!?。！？…"'”’)\]]/.test(p); }).length;
  }

  // ---------------------------------------------------------------- 바이트
  function utf8Bytes(s) {
    var n = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c < 0x80) n += 1;
      else if (c < 0x800) n += 2;
      else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length && (s.charCodeAt(i + 1) & 0xfc00) === 0xdc00) { n += 4; i++; }
      else n += 3;   // BMP (짝 없는 서로게이트는 U+FFFD = 3바이트)
    }
    return n;
  }
  function bytes(text, mode) {
    var s = normalize(text);
    var nl = count(/\n/g, s);
    if (mode === 'neis') return utf8Bytes(s) + nl;          // 줄바꿈 = CR+LF 2바이트
    if (mode === 'legacy') {
      var n = 0;
      Array.from(s).forEach(function (ch) { n += ch === '\n' ? 2 : (ch.codePointAt(0) < 0x80 ? 1 : 2); });
      return n;
    }
    return utf8Bytes(s);
  }

  // ---------------------------------------------------------------- 시간
  function timeUnits(words) {
    var u = { words: 0, hangul: 0, cjk: 0 };
    words.forEach(function (w) {
      var h = count(RE_HANGUL, w), c = count(RE_CJK, w);
      if (h || c) { u.hangul += h; u.cjk += c; } else u.words += 1;
    });
    return u;
  }
  function seconds(units, kind) {
    var r = RATES[kind];
    var min = units.words / r.words + units.hangul / r.hangul + units.cjk / r.cjk;
    return min > 0 ? Math.max(1, Math.round(min * 60)) : 0;
  }
  // 초 → { m, s } (분 단위 표시용)
  function splitTime(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    return { m: Math.floor(sec / 60), s: sec % 60 };
  }

  // ---------------------------------------------------------------- 한꺼번에
  function analyze(text, opts) {
    opts = opts || {};
    var s = normalize(text);
    var gs = graphemes(s, opts);
    var noSpaces = 0;
    gs.forEach(function (g) { if (!RE_SPACE.test(g)) noSpaces++; });
    var words = wordList(s, opts);
    var units = timeUnits(words);
    var lines = s.split('\n');
    return {
      chars: gs.length,
      noSpaces: noSpaces,
      words: words.length,
      sentences: sentenceCount(s, opts),
      paragraphs: s.split(/\n[ \t 　]*\n/).filter(function (p) { return p.trim(); }).length,
      lines: s.trim() ? lines.filter(function (l) { return l.trim(); }).length : 0,
      bytes: { utf8: bytes(s, 'utf8'), neis: bytes(s, 'neis'), legacy: bytes(s, 'legacy') },
      readingSec: seconds(units, 'read'),
      speakingSec: seconds(units, 'speak'),
      units: units
    };
  }

  // ---------------------------------------------------------------- 키워드 밀도
  function keywords(text, opts) {
    opts = opts || {};
    var top = opts.top || 5;
    var words = wordList(text, opts);
    var total = words.length;
    var map = {};
    var order = [];
    words.forEach(function (w) {
      var k = w.toLocaleLowerCase(opts.lang || undefined);
      if (STOP[k] || /^[\d.,:\-]+$/.test(k)) return;
      if (!RE_DICT.test(k) && !/[㄰-㆏가-힯]/.test(k) && Array.from(k).length < 2) return;   // 한 글자 라틴 등은 뺌
      if (!map[k]) { map[k] = 0; order.push(k); }
      map[k]++;
    });
    return order
      .map(function (k, i) { return { word: k, count: map[k], i: i }; })
      .filter(function (x) { return x.count >= 2; })
      .sort(function (a, b) { return b.count - a.count || a.i - b.i; })
      .slice(0, top)
      .map(function (x) { return { word: x.word, count: x.count, pct: total ? Math.round((x.count / total) * 1000) / 10 : 0 }; });
  }

  // ---------------------------------------------------------------- 목표 글자수
  function limitStatus(n, max) {
    max = Number(max) || 0;
    if (!max) return { on: false, pct: 0, left: 0, over: 0 };
    return { on: true, pct: Math.min(100, Math.round((n / max) * 1000) / 10), left: Math.max(0, max - n), over: Math.max(0, n - max) };
  }
  function cleanLimit(v) {
    var n = Math.floor(Number(String(v == null ? '' : v).replace(/[^\d]/g, '')));
    if (!isFinite(n) || n <= 0) return 0;
    return Math.min(LIMIT_MAX, n);
  }
  function normalizePrefs(p) {
    p = p || {};
    return {
      byteMode: BYTE_MODES.indexOf(p.byteMode) >= 0 ? p.byteMode : DEFAULTS.byteMode,
      limit: cleanLimit(p.limit),
      limitSpaces: p.limitSpaces == null ? DEFAULTS.limitSpaces : !!p.limitSpaces
    };
  }

  // ---------------------------------------------------------------- 고치기 도구
  // 공백 정리: 줄 앞뒤 공백 지움, 이어진 공백·탭은 하나로, 빈 줄 여러 개는 하나로, 전체 앞뒤 공백 지움
  function tidySpaces(text) {
    return normalize(text)
      .replace(/[ \t ]+/g, ' ')
      .replace(/^[ \t 　]+|[ \t 　]+$/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  // 줄바꿈 없애기: 줄을 한 단락으로 잇는다. 양쪽이 한자·가나·전각 문장부호면 띄어쓰기 없이, 아니면 공백 하나로.
  var RE_NOSPACE_JOIN = /[　-〿぀-ヿ㐀-䶿一-鿿豈-﫿＀-￯]/;
  function joinLines(text) {
    var s = normalize(text).replace(/[ \t ]*\n[\s]*/g, '\n').trim();
    return s.replace(/\n+/g, function (m, i) {
      var a = s.charAt(i - 1), b = s.charAt(i + m.length);
      return RE_NOSPACE_JOIN.test(a) && RE_NOSPACE_JOIN.test(b) ? '' : ' ';
    });
  }

  return {
    BYTE_MODES: BYTE_MODES,
    LIMIT_PRESETS: LIMIT_PRESETS,
    LIMIT_MAX: LIMIT_MAX,
    RATES: RATES,
    DEFAULTS: DEFAULTS,
    normalize: normalize,
    graphemes: graphemes,
    wordList: wordList,
    sentenceCount: sentenceCount,
    bytes: bytes,
    seconds: seconds,
    splitTime: splitTime,
    timeUnits: timeUnits,
    analyze: analyze,
    keywords: keywords,
    limitStatus: limitStatus,
    cleanLimit: cleanLimit,
    normalizePrefs: normalizePrefs,
    tidySpaces: tidySpaces,
    joinLines: joinLines
  };
});
