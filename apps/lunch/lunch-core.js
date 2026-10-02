/* apps/lunch/lunch-core.js — 오늘 뭐 먹지 메뉴 뽑기 언어 무관 로직 (UMD: 브라우저 window.LUNCH_CORE + Node 검사 공용)
 *   - 메뉴는 언어 파일(tools/i18n/<lang>.js 의 menus)에 '이름|이모지|끼니|기분' 문자열로 들어 있다 (언어마다 그 나라 음식).
 *       끼니 글자: b 아침 · l 점심 · d 저녁 · n 야식      기분 글자: h 든든 · l 가벼운 · s 매운 · o 혼밥(혼자 먹기 좋은)
 *   - 후보 = 고른 끼니에 맞고, 기분 태그를 하나라도 켰다면 그중 하나 이상에 맞고, 제외하지 않은 메뉴.
 *   - 뽑기: crypto.getRandomValues 거부 샘플링 → 후보가 모두 같은 확률. 릴 그림(돌아가는 칸)은 연출일 뿐, 결과는 먼저 정해진다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LUNCH_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MEALS = ['b', 'l', 'd', 'n'];
  var TAGS = ['h', 'l', 's', 'o'];
  var MAX_NAME = 22;

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // 0 <= r < max 인 정수. 2^32 를 max 로 나눈 나머지 구간은 버리고 다시 뽑는다(거부 샘플링).
  function cryptoInt(max) {
    if (!(max >= 1)) return 0;
    var c = cryptoObj();
    if (!c) return Math.floor(Math.random() * max);
    var buf = new Uint32Array(1);
    var limit = Math.floor(4294967296 / max) * max;
    for (;;) {
      c.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % max;
    }
  }

  // '이름|이모지|끼니|기분' → { name, emoji, meals, tags } (모양이 틀리면 null)
  function parseMenu(s) {
    var p = String(s || '').split('|');
    if (p.length !== 4) return null;
    var name = p[0].trim();
    var emoji = p[1].trim();
    var meals = p[2].trim();
    var tags = p[3].trim();
    if (!name || !emoji || !meals) return null;
    for (var i = 0; i < meals.length; i++) if (MEALS.indexOf(meals[i]) < 0) return null;
    for (var j = 0; j < tags.length; j++) if (TAGS.indexOf(tags[j]) < 0) return null;
    return { name: name, emoji: emoji, meals: meals, tags: tags };
  }
  function parseMenus(list) {
    var out = [];
    (list || []).forEach(function (s) { var m = parseMenu(s); if (m) out.push(m); });
    return out;
  }

  // 후보 번호들. tags: 켠 기분 글자 배열, excluded: { 번호: true }
  function pool(menus, meal, tags, excluded) {
    var out = [];
    menus.forEach(function (m, i) {
      if (m.meals.indexOf(meal) < 0) return;
      if (excluded && excluded[i]) return;
      if (tags && tags.length && !tags.some(function (t) { return m.tags.indexOf(t) >= 0; })) return;
      out.push(i);
    });
    return out;
  }
  function pickOne(list, randInt) {
    return list.length ? list[(randInt || cryptoInt)(list.length)] : -1;
  }
  // 릴 띠: 길이 n, 마지막 칸 = final, 이웃 칸이 같은 메뉴가 되지 않게(뒤에서부터 채운다)
  function strip(list, final, n, randInt) {
    var ri = randInt || cryptoInt;
    var out = new Array(n);
    out[n - 1] = final;
    for (var i = n - 2; i >= 0; i--) {
      var v = list[ri(list.length)];
      if (list.length > 1) {
        var guard = 0;
        while (v === out[i + 1] && guard++ < 50) v = list[ri(list.length)];
        if (v === out[i + 1]) v = list[(list.indexOf(v) + 1) % list.length];
      }
      out[i] = v;
    }
    return out;
  }
  // 현지 시각 → 기본 끼니 (5~9시 아침, 10~14 점심, 15~20 저녁, 그 밖 야식)
  function defaultMeal(hour) {
    if (hour >= 5 && hour < 10) return 'b';
    if (hour >= 10 && hour < 15) return 'l';
    if (hour >= 15 && hour < 21) return 'd';
    return 'n';
  }

  return {
    MEALS: MEALS,
    TAGS: TAGS,
    MAX_NAME: MAX_NAME,
    cryptoInt: cryptoInt,
    parseMenu: parseMenu,
    parseMenus: parseMenus,
    pool: pool,
    pickOne: pickOne,
    strip: strip,
    defaultMeal: defaultMeal,
  };
});
