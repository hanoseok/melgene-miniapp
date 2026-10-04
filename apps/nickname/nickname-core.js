/* apps/nickname/nickname-core.js — 닉네임 생성기 언어 무관 로직 (UMD: 브라우저 window.NICKNAME_CORE + Node 검사 공용)
 *   - 단어는 언어 파일(tools/i18n/<lang>.js 의 words)에 분위기별 { adj: [...], noun: [...] } 로 들어 있다 (언어마다 그 나라 말).
 *       형용사: '남성형/여성형/중성형' 처럼 / 로 성별 형태를 둘 수 있다 (한 가지면 모두 같은 형태).
 *       명사:   '단어|m' 처럼 | 뒤에 성별 글자(m·f·n)를 둘 수 있다 (없으면 m).
 *   - 조합: 형용사 + 명사. 이름·글자를 넣으면 이름 + 명사 · 명사 + 이름 · 형용사명사 + 구분 + 이름 중 하나로 섞는다. 숫자 붙이기를 켜면 두 자리 숫자.
 *   - 뽑기: crypto.getRandomValues 거부 샘플링 → 모든 단어·조합이 같은 확률.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NICKNAME_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MOODS = ['cute', 'cool', 'funny', 'dreamy', 'mystic'];
  var MAX_INPUT = 12;
  var MAX_WORD = 16;
  var GENDERS = { m: 0, f: 1, n: 2 };

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

  function parseAdj(s) {
    var forms = String(s || '').split('/').map(function (x) { return x.trim(); });
    if (!forms.length || forms.some(function (x) { return !x; }) || forms.length > 3) return null;
    return forms;
  }
  function parseNoun(s) {
    var p = String(s || '').split('|');
    if (p.length > 2) return null;
    var w = p[0].trim();
    var g = (p[1] || 'm').trim();
    if (!w || !(g in GENDERS)) return null;
    return { w: w, g: g };
  }
  function adjForm(forms, g) {
    var i = GENDERS[g] || 0;
    return forms[i] != null ? forms[i] : forms[0];
  }
  // 입력한 이름·글자 정리: 제어문자·꺾쇠·구분 문자 제거, 공백 제거, 12글자까지
  function cleanName(s) {
    var t = String(s || '').replace(/[\u0000-\u001f\u007f<>{}|\\\/&"']/g, '').replace(/\s+/g, '');
    return Array.from(t).slice(0, MAX_INPUT).join('');
  }
  function capFirst(s) {
    var a = Array.from(s);
    return a.length ? a[0].toUpperCase() + a.slice(1).join('') : '';
  }
  // 라틴·키릴 글자 언어: 단어마다 첫 글자를 대문자로 붙여 쓴다(SleepyOtter). 그 밖은 그대로 붙인다.
  function joinParts(parts, camel) {
    return parts.map(function (p) {
      return camel ? p.split(/\s+/).map(capFirst).join('') : p.replace(/\s+/g, '');
    }).join('');
  }

  function wordsOf(words, mood) {
    var m = (words && words[mood]) || {};
    var adj = (m.adj || []).map(parseAdj).filter(Boolean);
    var noun = (m.noun || []).map(parseNoun).filter(Boolean);
    return { adj: adj, noun: noun };
  }
  // 분위기 하나에서 만들 수 있는 기본 조합 수 (형용사 × 명사)
  function combos(words, mood) {
    var w = wordsOf(words, mood);
    return w.adj.length * w.noun.length;
  }

  // opts: { mood, name, numbers, style: { camel, order: 'adj-noun'|'noun-adj', nameSep } }
  function make(words, opts, randInt) {
    var ri = randInt || cryptoInt;
    var st = opts.style || {};
    var camel = !!st.camel;
    var w = wordsOf(words, opts.mood);
    if (!w.adj.length || !w.noun.length) return null;
    var noun = w.noun[ri(w.noun.length)];
    var adj = adjForm(w.adj[ri(w.adj.length)], noun.g);
    var name = cleanName(opts.name);
    var base = st.order === 'noun-adj' ? [noun.w, adj] : [adj, noun.w];
    var text;
    var kind = 'plain';
    if (name) {
      var pat = ri(3);
      var nm = camel ? capFirst(name) : name;
      if (pat === 0) { text = nm + joinParts([noun.w], camel); kind = 'name-noun'; }
      else if (pat === 1) { text = joinParts([noun.w], camel) + nm; kind = 'noun-name'; }
      else { text = joinParts(base, camel) + (st.nameSep || '') + nm; kind = 'full-name'; }
    } else {
      text = joinParts(base, camel);
    }
    if (opts.numbers) text += String(10 + ri(90));
    return { text: text, kind: kind };
  }
  // 직전 결과와 같지 않게 다시 뽑는다
  function generate(words, opts, randInt, avoid) {
    var r = make(words, opts, randInt);
    for (var i = 0; r && avoid && r.text === avoid && i < 12; i++) r = make(words, opts, randInt);
    return r;
  }

  return {
    MOODS: MOODS,
    MAX_INPUT: MAX_INPUT,
    MAX_WORD: MAX_WORD,
    cryptoInt: cryptoInt,
    parseAdj: parseAdj,
    parseNoun: parseNoun,
    adjForm: adjForm,
    cleanName: cleanName,
    joinParts: joinParts,
    wordsOf: wordsOf,
    combos: combos,
    make: make,
    generate: generate,
  };
});
