#!/usr/bin/env node
/**
 * 비밀번호 생성기 검사.
 *   1) 로직(password-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), 옵션 정리(normalize — 길이 4~64·단어 3~8·구분자·개수 1/5),
 *      헷갈리는 글자 빼기, 글자 종류 0개 = needType, 비밀번호(길이·허용 글자만·고른 종류마다 1개 이상), 엔트로피(log2Valid 를 작은 경우 전수 세기와 비교),
 *      공정성 카이제곱(같은 종류 안 글자 고르게 · 종류 배치 패턴이 "묶음마다 1개 이상인 문자열 전체에서 고르게"와 같은지 · 패스프레이즈 단어 16구간),
 *      패스프레이즈(단어 목록 2048개·중복 없음·a-z 3~8자, 형식·대문자·숫자 1개, 엔트로피), 강도 등급·깨는 시간(초당 1e10, 평균 2^(bits-1)).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, "무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-pw) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 종류 → 길이·글자 → 패스프레이즈 옵션 → 개수 → 만들기 → 결과(#result, 처음 hidden) 안 결과 카드 → data-mg-end="password" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) password.js 규칙(문구 없음·track 1곳씩·Math.random 없음·저장소/주소/공유에 비밀번호를 넣지 않음), sitemap.xml, OG 이미지, app.config.js, favicon, shared 링크.
 *
 * 실행: node tools/check-password.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'password-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const near = (a, b, eps, m) => { if (!(Math.abs(a - b) <= eps)) bad(`${m}: ${a} ≉ ${b}`); };

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 13: 34.53, 15: 37.70, 25: 52.62 };
function chi(counts, expected) {
  const N = counts.reduce((a, b) => a + b, 0);
  return counts.reduce((a, x, i) => { const e = expected ? expected[i] * N : N / counts.length; return a + (x - e) * (x - e) / e; }, 0);
}
function checkLogic() {
  eq([CORE.LEN_MIN, CORE.LEN_MAX, CORE.LEN_DEFAULT, CORE.WORDS_MIN, CORE.WORDS_MAX, CORE.WORDS_DEFAULT], [4, 64, 16, 3, 8, 5], '한도');
  eq(CORE.COUNTS, [1, 5], '개수'); eq(CORE.GUESSES_PER_SEC, 1e10, '초당 시도'); eq(CORE.SIMILAR, '0O1lI', '헷갈리는 글자');
  eq(CORE.SEP_ORDER, ['dash', 'dot', 'underscore', 'space'], '구분자 순서');
  eq(Object.keys(CORE.CLASSES).map((k) => CORE.CLASSES[k].length), [26, 26, 10, 25], '글자 묶음 크기');
  const allChars = Object.values(CORE.CLASSES).join('');
  if (new Set(allChars).size !== allChars.length) bad('글자 묶음끼리 겹치는 글자가 있음');
  if (/["'`\\<> |]/.test(CORE.CLASSES.symbols)) bad('기호에 따옴표·역슬래시·<>·공백·| 가 있으면 안 됨(입력 칸·셸에서 문제)');

  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(87, seq([4294967295, 4294967294, 86])), 86, 'uniformInt(87): limit 이상 버림');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 옵션 정리
  const n = CORE.normalize;
  eq(n({}), CORE.DEFAULTS, 'normalize 기본값');
  eq([n({ length: 2 }).length, n({ length: 99 }).length, n({ length: '20' }).length, n({ length: 'x' }).length], [4, 64, 20, 16], 'length 잘라 내기');
  eq([n({ words: 1 }).words, n({ words: 12 }).words, n({ words: '6' }).words], [3, 8, 6], 'words 잘라 내기');
  eq([n({ sep: 'bogus' }).sep, n({ sep: 'space' }).sep, n({ count: 3 }).count, n({ count: '5' }).count, n({ mode: 'x' }).mode], ['dash', 'space', 1, 5, 'password'], 'sep/count/mode');
  eq(CORE.classesFor(n({ similar: true })).map((c) => c.chars.length), [24, 25, 8, 25], '헷갈리는 글자 빼기 후 묶음 크기');
  eq(CORE.validate({ upper: false, lower: false, digits: false, symbols: false }).error, 'needType', '글자 종류 0개');
  eq(CORE.validate({ mode: 'passphrase', upper: false, lower: false, digits: false, symbols: false }).ok, true, '패스프레이즈는 글자 종류와 무관');

  // 비밀번호
  const cases = [{}, { length: 4 }, { length: 64 }, { length: 4, similar: true }, { upper: false, symbols: false, length: 6 }, { lower: false, digits: false, symbols: false, length: 5 }, { digits: false, length: 30, similar: true }];
  cases.forEach((c) => {
    const p = n(c);
    const cls = CORE.classesFor(p);
    const allowed = cls.map((x) => x.chars).join('');
    for (let t = 0; t < 300; t++) {
      const pw = CORE.generatePassword(p);
      const tag = `generatePassword ${JSON.stringify(c)}`;
      if (pw.length !== p.length) { bad(`${tag}: 길이 ${pw.length}`); break; }
      if ([...pw].some((ch) => allowed.indexOf(ch) < 0)) { bad(`${tag}: 허용되지 않은 글자 ${pw}`); break; }
      if (cls.some((x) => ![...pw].some((ch) => x.chars.indexOf(ch) >= 0))) { bad(`${tag}: 빠진 종류 ${pw}`); break; }
      if (p.similar && /[0O1lI]/.test(pw)) { bad(`${tag}: 헷갈리는 글자 ${pw}`); break; }
    }
  });
  // 주입 난수: 모든 r=0 → 고른 종류가 다 들어가지 못하면 다시 뽑음 → 결정적으로 같은 결과면 무한루프 → 오류
  threw = false;
  try { CORE.generatePassword({ length: 4 }, () => 0); } catch (e) { threw = true; }
  if (!threw) bad('generatePassword: 늘 같은 글자만 나오면(종류 부족) 오류로 멈춰야 함');
  eq(CORE.generatePassword({ length: 4, upper: true, lower: false, digits: false, symbols: false }, () => 0), 'AAAA', 'generatePassword 주입 난수');

  // 엔트로피: 작은 경우 전수 세기
  function brute(sizes, L) {
    const N = sizes.reduce((a, b) => a + b, 0);
    let cnt = 0;
    const total = Math.pow(N, L);
    for (let x = 0; x < total; x++) {
      let v = x; const seen = new Array(sizes.length).fill(false);
      for (let i = 0; i < L; i++) { let d = v % N; v = Math.floor(v / N); let k = 0; while (d >= sizes[k]) { d -= sizes[k]; k++; } seen[k] = true; }
      if (seen.every(Boolean)) cnt++;
    }
    return cnt;
  }
  [[[2, 3], 3], [[1, 2, 3], 4], [[3, 1, 2, 2], 5], [[4], 3], [[2, 5], 1]].forEach(([s, L]) => {
    const b = brute(s, L);
    near(CORE.log2Valid(s, L), b ? Math.log2(b) : 0, 1e-9, `log2Valid(${s}, ${L}) vs 전수 ${b}`);
  });
  near(CORE.passwordEntropy({ upper: true, lower: false, digits: false, symbols: false, length: 10 }), 10 * Math.log2(26), 1e-9, '한 종류 엔트로피 = L·log2(26)');
  const e16 = CORE.passwordEntropy({});
  if (!(e16 < 16 * Math.log2(87) && e16 > 16 * Math.log2(87) - 1)) bad(`기본 16자 엔트로피 ${e16} 가 16·log2(87) 바로 아래가 아님`);
  near(CORE.passwordEntropy({ length: 4, similar: true }), Math.log2([82, -58, -57, -74, -57, 33, 50, 33, 49, 32, 49, -25, -8, -25, -24].reduce((t, v) => t + Math.sign(v) * Math.pow(Math.abs(v), 4), 0)), 1e-9, '4자 헷갈림 빼기 엔트로피(포함·배제 손계산)');
  eq(CORE.passwordEntropy({ upper: false, lower: false, digits: false, symbols: false }), 0, '종류 0개 엔트로피 0');

  // 공정성 (a) 같은 종류 안: 대문자만 길이 64 → 26글자 고르게
  let c = new Array(26).fill(0);
  for (let i = 0; i < 400; i++) for (const ch of CORE.generatePassword({ upper: true, lower: false, digits: false, symbols: false, length: 64 })) c[ch.charCodeAt(0) - 65]++;
  let x2 = chi(c); if (x2 > CHI_001[25]) bad(`공정성 대문자 26글자: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[25]}`);
  // (b) 종류 배치 패턴: 대문자+숫자, 길이 4 → 숫자 자리 패턴 14가지가 26^U·10^D 비율이어야 함(묶음마다 1개 이상인 문자열 전체에서 고르게)
  const pats = []; for (let m = 1; m < 15; m++) pats.push(m);
  const w = pats.map((m) => { const d = [0, 1, 2, 3].filter((i) => m & (1 << i)).length; return Math.pow(10, d) * Math.pow(26, 4 - d); });
  const W = w.reduce((a, b) => a + b, 0);
  const pc = new Array(14).fill(0);
  for (let i = 0; i < 60000; i++) {
    const pw = CORE.generatePassword({ upper: true, lower: false, digits: true, symbols: false, length: 4 });
    let m = 0; for (let j = 0; j < 4; j++) if (/\d/.test(pw[j])) m |= (1 << j);
    pc[m - 1]++;
  }
  x2 = chi(pc, w.map((v) => v / W)); if (x2 > CHI_001[13]) bad(`공정성 종류 배치 패턴(거부 샘플링): 카이제곱 ${x2.toFixed(2)} > ${CHI_001[13]}`);

  // 패스프레이즈
  const WL = CORE.WORDS;
  if (WL.length !== 2048) bad(`단어 목록 ${WL.length}개 (2048개여야 함)`);
  if (new Set(WL).size !== WL.length) bad('단어 목록에 중복');
  const badW = WL.filter((x) => !/^[a-z]{3,8}$/.test(x)); if (badW.length) bad(`단어 형식(a-z 3~8자) 아님: ${badW.slice(0, 5)}`);
  near(CORE.passphraseEntropy({ mode: 'passphrase' }), 5 * 11 + Math.log2(50), 1e-9, '패스프레이즈 기본 엔트로피');
  near(CORE.passphraseEntropy({ mode: 'passphrase', words: 8, number: false }), 88, 1e-9, '패스프레이즈 8단어 숫자 없음');
  const idx = new Map(WL.map((x, i) => [x, i]));
  const buckets = new Array(16).fill(0);
  [['dash', '-'], ['dot', '.'], ['underscore', '_'], ['space', ' ']].forEach(([sep, ch]) => {
    [[3, true, true], [5, false, false], [8, true, false], [4, false, true]].forEach(([words, capitalize, number]) => {
      const o = { mode: 'passphrase', sep, words, capitalize, number };
      for (let t = 0; t < 200; t++) {
        const s = CORE.generate(o);
        const tag = `패스프레이즈 ${JSON.stringify(o)} → ${s}`;
        const parts = s.split(ch);
        if (parts.length !== words) { bad(`${tag}: 단어 ${parts.length}개`); break; }
        const digits = (s.match(/\d/g) || []).length;
        if (digits !== (number ? 1 : 0)) { bad(`${tag}: 숫자 ${digits}개`); break; }
        if (parts.some((p) => !(capitalize ? /^[A-Z][a-z]+\d?$/ : /^[a-z]+\d?$/).test(p))) { bad(`${tag}: 단어 모양`); break; }
        parts.forEach((p) => { const k = idx.get(p.replace(/\d/g, '').toLowerCase()); if (k == null) bad(`${tag}: 목록에 없는 단어 ${p}`); else buckets[k >> 7]++; });
      }
    });
  });
  x2 = chi(buckets); if (x2 > CHI_001[15]) bad(`공정성 단어 16구간: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[15]}`);
  eq(CORE.generatePassphrase({ mode: 'passphrase', words: 3, number: true, capitalize: false }, (m) => m - 1), 'zoom-zoom-zoom9', '패스프레이즈 주입 난수(숫자는 마지막 단어 뒤)');

  // 여러 개
  eq(CORE.generateMany({ count: 5 }).length, 5, 'generateMany 5'); eq(CORE.generateMany({}).length, 1, 'generateMany 1');
  if (new Set(CORE.generateMany({ count: 5 })).size !== 5) bad('generateMany: 16자 5개가 겹침(난수 이상)');

  // 강도·깨는 시간
  eq([0, 44.9, 45, 59.9, 60, 79.9, 80, 300].map(CORE.strength), ['weak', 'weak', 'fair', 'fair', 'strong', 'strong', 'veryStrong', 'veryStrong'], 'strength 경계');
  const ct = (b) => { const r = CORE.crackTime(b); return [r.unit, r.value]; };
  eq(ct(0), ['instant', 0], 'crackTime 0비트'); eq(ct(30), ['instant', 0], 'crackTime 30비트(0.05초)');
  eq(ct(40), ['second', 55], 'crackTime 40비트 = 2^39/1e10 ≈ 55초'); eq(ct(45), ['minute', 29], 'crackTime 45비트 ≈ 29분');
  eq(ct(50), ['hour', 16], 'crackTime 50비트 ≈ 15.6시간'); eq(ct(55), ['day', 21], 'crackTime 55비트 ≈ 20.8일');
  eq(ct(60), ['year', 2], 'crackTime 60비트 ≈ 1.83년'); eq(ct(80), ['year', 1900000], 'crackTime 80비트 ≈ 1.9e6년');
  eq(CORE.crackTime(94).unit, 'forever', 'crackTime 94비트 > 우주 나이(1.38e10년 ≈ 92.8비트)'); eq(CORE.crackTime(92).unit, 'year', 'crackTime 92비트 < 우주 나이');
  near(CORE.crackTime(70).seconds, Math.pow(2, 69) / 1e10, 1, 'crackTime 초 = 2^(bits-1)/1e10');
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(v) {
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shape(v[k]), o), {});
  return typeof v;
}
function keysDiff(a, b, p, out) {
  if (typeof a !== typeof b || (typeof a === 'string' && a !== b)) { out.push(`${p || '(루트)'} 모양 다름`); return; }
  if (typeof a !== 'object') return;
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    if (!(k in b)) out.push(`${p}${k} 없음`);
    else if (!(k in a)) out.push(`${p}${k} 이 더 있음`);
    else keysDiff(a[k], b[k], `${p}${k}.`, out);
  });
}
function tokens(s) { return (String(s).match(/\{\w+\}/g) || []).sort().join(','); }
function walk(obj, fn, p = '') {
  if (typeof obj === 'string') return fn(obj, p);
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, p ? `${p}.${k}` : k));
}
const get = (o, p) => p.split('.').reduce((a, k) => a[k], o);
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  if (langFiles.length !== G.LOCALES.length) bad(`언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    if (/TODO-TRANSLATE/.test(first)) bad(`${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shape(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.lengthLabel', 'ui.generate', 'ui.similar', 'result.again', 'result.crackForever', 'result.tips.weak', 'ui.local'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·칩)
    const W = [['ui.generate', 24], ['ui.generating', 22], ['result.again', 24], ['result.copy', 11], ['ui.modePassword', 14], ['ui.modePassphrase', 16],
      ['ui.countOne', 16], ['ui.countFive', 16], ['ui.upper', 15], ['ui.lower', 15], ['ui.digits', 15], ['ui.symbols', 15], ['ui.similar', 30], ['ui.capitalize', 22], ['ui.addNumber', 22],
      ['ui.lengthLabel', 20], ['ui.wordsLabel', 20], ['ui.sepLabel', 30], ['ui.modeLabel', 30], ['ui.countLabel', 30], ['ui.typesLabel', 30],
      ['ui.sep.dash', 12], ['ui.sep.dot', 12], ['ui.sep.underscore', 14], ['ui.sep.space', 12], ['result.strengthLabel', 14],
      ['result.strength.weak', 16], ['result.strength.fair', 16], ['result.strength.strong', 16], ['result.strength.veryStrong', 16]];
    W.forEach(([p, max]) => { const v = get(T, p); if (width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    if (!T.meta.title.startsWith(APP.title[lang].split(' ')[0])) bad(`${tag} meta.title 이 현지 검색어로 시작하지 않음: ${T.meta.title}`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 crypto.getRandomValues(서버로 보내지 않음) 설명 없음`);
    if (!/getRandomValues/.test(T.ui.local)) bad(`${tag} ui.local 에 crypto.getRandomValues 안내 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 공유 문구에 비밀번호 자리표시자 없음
    if (/\{/.test(T.result.shareText + T.result.shareTitle)) bad(`${tag} 공유 문구에 자리표시자(비밀번호가 들어갈 수 있음)`);
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 170 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if ((lang === 'ru' || lang === 'vi') && !/Montserrat|Unbounded|Rubik|Nunito/.test(T.fonts.css)) bad(`${tag} 키릴/베트남 문자를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-pw"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/password\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/password\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  modes.forEach(([mode, fileOf]) => {
    G.LOCALES.forEach(({ code: lang }) => {
      const T = L10N[lang];
      const f = fileOf(lang, 'index.html');
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"MultimediaApplication"/.test(html)) bad(`${tag} appLd(WebApplication, create) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-pw) 없음`); return; }
      if (/<section id="screen-pw"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="pw-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="pw-h1"', 'data-mode="password"', 'data-mode="passphrase"', 'id="opt-password"', 'id="length"', 'id="t-upper"', 'id="t-lower"', 'id="t-digits"', 'id="t-symbols"', 'id="similar"',
        'id="opt-passphrase"', 'id="words"', 'data-sep="dash"', 'data-sep="space"', 'id="capitalize"', 'id="number"', 'data-count="1"', 'data-count="5"',
        'id="error"', 'id="gen-btn"', 'id="result"', 'id="result-card"', 'id="pw-list"', 'id="meter"', 'id="meter-bits"', 'id="meter-crack"', '<div data-mg-end="password"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((v, i) => i && v < seq[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 종류 → 비밀번호 옵션 → 패스프레이즈 옵션 → 개수 → 만들기 → 결과 카드 → 끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="pw-result" hidden>/.test(S)) bad(`${tag} 결과·끝 화면(#result)은 처음에 hidden`);
      if (!/<div id="opt-passphrase" class="pw-opts" hidden>/.test(S) || /<div id="opt-password" class="pw-opts" hidden/.test(S)) bad(`${tag} 처음에는 비밀번호 옵션만 보임`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/id="length"[^>]*min="4" max="64"[^>]*value="16"/.test(S) || !/id="words"[^>]*min="3" max="8"[^>]*value="5"/.test(S)) bad(`${tag} 길이 4~64(16), 단어 3~8(5) 슬라이더`);
      if ((S.match(/role="switch"/g) || []).length !== 7) bad(`${tag} 스위치 7개(종류 4·헷갈림·대문자·숫자) 접근성`);
      if ((S.match(/aria-checked="true"/g) || []).length !== 3 || !/data-mode="password" aria-checked="true"/.test(S) || !/data-count="1" aria-checked="true"/.test(S) || !/data-sep="dash" aria-checked="true"/.test(S)) bad(`${tag} 기본 선택(비밀번호 · 1개 · 하이픈)`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (!/id="error" class="pw-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      if (/<code class="pw-pass"|<li class="pw-row"/.test(S)) bad(`${tag} 생성된 HTML 에 비밀번호 자리가 미리 있음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('password-core.js') < 0 || html.indexOf('password-core.js') > html.indexOf('password.js"')) bad(`${tag} password-core.js 가 password.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://password.example.com/</loc>') || !sm.includes('<loc>https://password.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'password.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('password.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("password.js: track('start') 는 만들기 1곳, track('done') 은 결과 1곳");
  if (/Math\.random/.test(js)) bad('password.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('password.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if (/localStorage|sessionStorage|indexedDB|document\.cookie/.test(js)) bad('password.js 가 저장소를 씀 — 비밀번호는 저장하지 않는다');
  if (/location\.(hash|search)\s*=|history\.(push|replace)State|location\.assign|location\.replace/.test(js)) bad('password.js 가 주소를 바꿈 — 비밀번호를 주소에 넣지 않는다');
  if (/fetch\(|XMLHttpRequest|sendBeacon|window\.supa\b/.test(js)) bad('password.js 가 네트워크 요청을 함 — 아무것도 보내지 않는다');
  if (/innerHTML\s*=(?!\s*'')/.test(js)) bad('password.js: innerHTML 은 비우기만 (비밀번호는 textContent)');
  const share = (js.match(/setShareData\(function \(\) \{[\s\S]*?\}\);/) || [''])[0];
  if (!share || /last|list|pw\b|\.p\b/.test(share)) bad('password.js: 공유 데이터에 비밀번호/결과가 들어갈 수 있음 (앱 주소 + 일반 문구만)');
  if (!/setRetry/.test(js)) bad('password.js: setRetry 등록 없음');
  if (!/mgCleanUrl/.test(js)) bad('password.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  const core = fs.readFileSync(path.join(SITE, 'password-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('password-core.js 는 crypto.getRandomValues 만 써야 함');
  return pages;
}

// ---------------------------------------------------------------- 4) OG · 등록
function checkOg() {
  let n = 0;
  G.LOCALES.forEach(({ dir }) => {
    const f = path.join(SITE, 'og', dir, 'default.png');
    if (!fs.existsSync(f)) return bad(`OG 없음: og/${dir ? dir + '/' : ''}default.png (node tools/gen-og.js all)`);
    const b = fs.readFileSync(f);
    if (b.toString('ascii', 1, 4) !== 'PNG' || b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) bad(`OG 크기/형식: ${path.relative(SITE, f)}`);
    n++;
  });
  return n;
}
function checkApp() {
  if (APP.id !== 'password' || APP.category !== 'create' || APP.path !== 'https://password.example.com/' || APP.added !== '2026-10-13' || APP.emoji !== '🔑' || APP.order !== 1) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 150) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (len(APP.title[code]) > 26) bad(`app.config.js ${code} 포털 이름이 김 (${len(APP.title[code])}자)`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n비밀번호 로직·엔트로피(전수 세기 비교)·공정성(카이제곱 3종)·패스프레이즈·깨는 시간 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 생성 로직(crypto 거부 샘플링, 종류마다 1개 이상 = 문자열 거부 샘플링)·정확한 엔트로피·깨는 시간, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 끝 화면), 비밀번호 비저장·비공유 규칙, OG 이미지 모두 OK');
