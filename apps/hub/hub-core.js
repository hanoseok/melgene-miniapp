/* apps/hub/hub-core.js — 포털 공통 로직 (UMD: 브라우저 window.HUB_CORE + Node require).
 * 생성기(tools/gen-i18n.js, tools/gen-og.js)와 브라우저(script.js)가 같은 함수를 써서
 * 정적으로 미리 그린 카드와 JS가 다시 그린 카드가 똑같이 보이게 한다.
 *   hueOf(id)            앱 아이콘 색상(0~359, OKLCH 색상각). id 로만 정해진다.
 *   hueStyle(id)         카드에 넣을 인라인 스타일 '--h:..;--h2:..' (style.css 가 그라데이션을 만든다)
 *   compact(n, lang)     참여 수·하트 줄임 표기 (ko 1.2만 / ja 1.2万 / zh 1.2万·1234万 / en·th 12K / fr 12 k /
 *                        de 12.345·1,2 Mio. / vi 12 N·1,2 Tr / es 12 mil / it 12.345·1,2 Mln / pt 12 mil·1,2 mi /
 *                        ru 12 тыс.·1,2 млн).
 *                        절대 올려서 표시하지 않는다(내림).
 *   isNew(added, today)  추가된 지 14일 안이면 true (미래 날짜도 true)
 *   sortApps(apps, stats, mode)   popular | rating | newest
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HUB_CORE = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // FNV-1a 32bit. 소금값은 지금 앱 6개의 색이 겹치지 않게 고른 고정값(바꾸면 모든 아이콘 색이 바뀐다).
  var SALT = 'mg3468:';
  function hash(str) {
    var x = 0x811c9dc5;
    for (var i = 0; i < str.length; i++) {
      x ^= str.charCodeAt(i);
      x = Math.imul(x, 0x01000193) >>> 0;
    }
    return x >>> 0;
  }
  function hueOf(id) { return hash(SALT + String(id)) % 360; }
  // 아이콘 그라데이션의 두 색상각: 밝은 쪽 h+18(CSS), 짙은 쪽 h2.
  // 짙은 쪽이 노랑~연두(85~135°)에 떨어지면 올리브색으로 탁해지므로 초록 쪽으로 돌린다.
  function hues(id) {
    var h = hueOf(id);
    var h2 = (h - 18 + 360) % 360;
    if (h2 >= 85 && h2 <= 135) h2 = (h + 26) % 360;
    return { h: h, h2: h2 };
  }
  function hueStyle(id) { var v = hues(id); return '--h:' + v.h + ';--h2:' + v.h2; }

  function trim1(x) {
    // 소수 첫째 자리까지 내림 (12,999 → 1.2만, 1.3만 아님)
    var s = (Math.floor(x * 10) / 10).toFixed(1);
    return s.replace(/\.0$/, '');
  }
  function base(lang) { return String(lang || 'ko').toLowerCase().split('-')[0]; }
  function num(n, lang) {
    try { return Number(n).toLocaleString(base(lang)); } catch (e) { return String(n); }
  }
  // 언어별 줄임 단위. Intl compact 에 기대지 않고 표로 고정한다(브라우저·Node 가 똑같이, 항상 내림).
  //   man   : 만/万 단위 언어 (1.2만 · 12만 · 1.2억). group=false 면 1234万 처럼 쉼표 없이 (중국어 관습)
  //   units : [기준값, 단위] 큰 것부터. 값이 10 미만이면 소수 한 자리(내림), 10 이상이면 정수(내림).
  //   min   : 이보다 작으면 줄이지 않고 그 언어의 숫자 표기 그대로 (de 는 100만 미만을 줄이지 않는 게 표준)
  //   dec/sp: 소수점 기호, 숫자와 단위 사이 (프랑스어·베트남어·스페인어·독일어·이탈리아어·포르투갈어·러시아어는 줄바꿈 없는 공백)
  var NB = ' ';
  var FORMATS = {
    ko: { man: ['만', '억'], group: true },
    ja: { man: ['万', '億'], group: true },
    zh: { man: ['万', '亿'], group: false },
    en: { units: [[1e9, 'B'], [1e6, 'M'], [1e3, 'K']], min: 1e3, dec: '.', sp: '' },
    th: { units: [[1e9, 'B'], [1e6, 'M'], [1e3, 'K']], min: 1e4, dec: '.', sp: '' },
    fr: { units: [[1e9, 'Md'], [1e6, 'M'], [1e3, 'k']], min: 1e4, dec: ',', sp: NB },
    de: { units: [[1e9, 'Mrd.'], [1e6, 'Mio.']], min: 1e6, dec: ',', sp: NB },
    vi: { units: [[1e9, 'T'], [1e6, 'Tr'], [1e3, 'N']], min: 1e4, dec: ',', sp: NB },
    es: { units: [[1e6, 'M'], [1e3, 'mil']], min: 1e4, dec: ',', sp: NB },
    it: { units: [[1e9, 'Mld'], [1e6, 'Mln']], min: 1e6, dec: ',', sp: NB }, // CLDR: 천 단위는 줄이지 않음 (12.345 · 1,2 Mln)
    pt: { units: [[1e9, 'bi'], [1e6, 'mi'], [1e3, 'mil']], min: 1e4, dec: ',', sp: NB }, // pt-BR: 12 mil · 1,2 mi
    ru: { units: [[1e9, 'млрд'], [1e6, 'млн'], [1e3, 'тыс.']], min: 1e4, dec: ',', sp: NB } // CLDR ru: 12 тыс. · 1,2 млн · 1,2 млрд (1 234 은 그대로)
  };
  // 단위로 나눈 값(v >= 1)을 내림: 10 미만은 소수 한 자리, 그 이상은 정수 (12,999 → 12K, 1,299 → 1.2K)
  function floorShort(v, dec, L) {
    if (v < 10) return trim1(v).replace('.', dec);
    return num(Math.floor(v), L);
  }
  function compact(n, lang) {
    n = Math.max(0, Math.floor(Number(n) || 0));
    var L = base(lang);
    var F = FORMATS[L] || FORMATS.en;
    if (F.man) {
      var M = F.man;
      if (n >= 1e8) return trim1(n / 1e8) + M[1];
      if (n >= 1e5) { var w = Math.floor(n / 1e4); return (F.group ? num(w, L) : String(w)) + M[0]; }
      if (n >= 1e4) return trim1(n / 1e4) + M[0];
      return num(n, L);
    }
    if (n < F.min) return num(n, L);
    for (var i = 0; i < F.units.length; i++) {
      var u = F.units[i];
      if (n >= u[0]) return floorShort(n / u[0], F.dec, L) + F.sp + u[1];
    }
    return num(n, L);
  }

  // 'YYYY-MM-DD' → 그 날 자정(현지 시각) ms. 잘못된 값이면 NaN.
  function dayMs(ymd) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ymd || ''));
    if (!m) return NaN;
    return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
  }
  function isNew(added, today, days) {
    var a = dayMs(added);
    if (isNaN(a)) return false;
    var t = today instanceof Date ? today : new Date();
    var t0 = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
    return (t0 - a) / 86400000 < (days || 14);
  }

  // stats: { <id>: { plays, avg, votes, hearts } } 또는 null(모름). 모르면 설정 순서를 그대로 쓴다.
  function statOf(stats, id) {
    var s = stats && stats[id];
    return {
      plays: s ? Number(s.plays) || 0 : 0,
      avg: s && s.avg != null ? Number(s.avg) : null,
      votes: s ? Number(s.votes) || 0 : 0,
      hearts: s ? Number(s.hearts) || 0 : 0,
      score: s ? Number(s.score) || 0 : 0
    };
  }
  var MIN_VOTES = 3;
  // 카테고리 순서 (탭·소개 글 순서). SITE_CONFIG.SITES[].category 가 이 중 하나가 아니면 첫 번째로 본다.
  var CATS = ['game', 'test', 'create', 'vote'];
  function catOf(c) { return CATS.indexOf(c) >= 0 ? c : CATS[0]; }
  function sortApps(apps, stats, mode) {
    var list = apps.slice();
    var byOrder = function (a, b) { return a.order - b.order; };
    var byAdded = function (a, b) { return (dayMs(b.added) || 0) - (dayMs(a.added) || 0); };
    if (mode === 'newest') {
      return list.sort(function (a, b) { return byAdded(a, b) || byOrder(a, b); });
    }
    if (!stats) return list.sort(byOrder);
    if (mode === 'rating') {
      return list.sort(function (a, b) {
        var sa = statOf(stats, a.id), sb = statOf(stats, b.id);
        var ra = sa.votes >= MIN_VOTES && sa.avg != null, rb = sb.votes >= MIN_VOTES && sb.avg != null;
        if (ra !== rb) return ra ? -1 : 1; // 평가 3개 이상인 앱이 먼저
        if (ra && sb.avg !== sa.avg) return sb.avg - sa.avg;
        return (sb.votes - sa.votes) || (sb.plays - sa.plays) || byOrder(a, b);
      });
    }
    // popular = 인기도 점수(하트×10 + 별점 합 + 플레이, 서버 계산) → 하트 → 플레이 → 최신
    return list.sort(function (a, b) {
      var sa = statOf(stats, a.id), sb = statOf(stats, b.id);
      return (sb.score - sa.score) || (sb.hearts - sa.hearts) || (sb.plays - sa.plays) || byAdded(a, b) || byOrder(a, b);
    });
  }

  // 검색어 정규화 (전각→반각, 대소문자, 공백 무시)
  function norm(s) {
    s = String(s || '');
    try { s = s.normalize('NFKC'); } catch (e) { /* 구형 브라우저 */ }
    return s.toLowerCase().replace(/\s+/g, '');
  }
  function matches(app, q) {
    var n = norm(q);
    if (!n) return true;
    return norm(app.title).indexOf(n) >= 0 || norm(app.desc).indexOf(n) >= 0;
  }

  return {
    hueOf: hueOf,
    hues: hues,
    hueStyle: hueStyle,
    compact: compact,
    FORMATS: FORMATS,
    num: num,
    isNew: isNew,
    statOf: statOf,
    sortApps: sortApps,
    matches: matches,
    MIN_VOTES: MIN_VOTES,
    CATS: CATS,
    catOf: catOf
  };
});
