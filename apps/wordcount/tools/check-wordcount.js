#!/usr/bin/env node
/**
 * 글자수 세기 검사.
 *   1) 로직(wordcount-core.js) — Intl.Segmenter 있는 경우 + 없는 경우(대체 로직) 둘 다:
 *      글자(grapheme: 이모지 ZWJ·국기·결합 문자·태국어 = 1), 공백 포함·제외, 줄바꿈 \r\n = 1, 단어(영어 하이픈·아포스트로피, 한국어 어절 "AI는"·"2026년",
 *      일본어·중국어·태국어 사전 분절), 문장(약어 Mr. Dr.), 문단·줄, 바이트 3방식(UTF-8 · 나이스 = 줄바꿈 2 · 완성형 2바이트), 읽기/말하기 시간,
 *      키워드(흔한 단어 제외·2번 이상·비율), 목표 글자수 상태, 설정 정리(normalizePrefs), 공백 정리·줄 잇기(한중일은 띄어쓰기 없이).
 *   2) 언어 파일 12개: en.js 와 키 구조 같음, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(금지 질문 없음), 제목에 현지 검색어·h1 검색어,
 *      제목·설명 길이, 360px 폭 문구, fr 좁은 공백, ru·vi 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 첫 화면(#screen-wc) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 / 순서
 *      h1 → 막대 → 입력 칸 → 도구 → 목표 → 자세한 숫자 → 바이트 → 키워드 → 결과 보기 → 결과(#result, 처음 hidden) 안 요약 → data-mg-end="wordcount" → 광고.
 *   4) wordcount.js 규칙(문구 없음·track('done') 1곳·주소를 바꾸지 않음·네트워크 없음·저장소는 try/catch·공유에 글 없음), sitemap(가이드 제외 12개),
 *      OG 이미지, app.config.js, favicon, shared 링크.
 *
 * 실행: node tools/check-wordcount.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'wordcount-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  eq(CORE.BYTE_MODES, ['utf8', 'neis', 'legacy'], '바이트 방식');
  eq(CORE.LIMIT_PRESETS, [0, 500, 1000, 1500], '목표 프리셋');
  eq(CORE.RATES, { read: { words: 238, hangul: 500, cjk: 500 }, speak: { words: 150, hangul: 300, cjk: 300 } }, '읽기/말하기 속도');
  if (typeof Intl.Segmenter !== 'function') bad('이 Node 에 Intl.Segmenter 가 없음 — 검사를 Node 16+ 로');

  const A = (t, o) => CORE.analyze(t, Object.assign({ lang: 'en' }, o || {}));
  ['seg', 'fallback'].forEach((mode) => {
    const o = mode === 'fallback' ? { noSegmenter: true } : {};
    const tag = `[${mode}]`;
    // 글자(grapheme)
    eq(A('', o).chars, 0, `${tag} 빈 글`);
    eq(A('👨‍👩‍👧', o).chars, 1, `${tag} 가족 이모지(ZWJ) = 1`);
    eq(A('🇰🇷🇯🇵', o).chars, 2, `${tag} 국기 2개 = 2`);
    eq(A('👍🏽', o).chars, 1, `${tag} 피부색 이모지 = 1`);
    eq(A('❤️', o).chars, 1, `${tag} 변형 선택자 이모지 = 1`);
    eq(A('é', o).chars, 1, `${tag} e + 결합 악센트 = 1`);
    eq(A('ที่', o).chars, 1, `${tag} 태국어 ที่ = 1`);
    eq(A('สวัสดี', o).chars, 4, `${tag} สวัสดี = 4 (ส วั ส ดี)`);
    eq(A('한글 테스트', o).chars, 6, `${tag} 한글 공백 포함 6`);
    eq(A('한글 테스트', o).noSpaces, 5, `${tag} 한글 공백 제외 5`);
    eq(A('a\r\nb', o).chars, 3, `${tag} \\r\\n = 1글자`);
    eq(A('a\tb　c d\ne', o).noSpaces, 5, `${tag} 탭·전각 공백·NBSP·줄바꿈 빼기`);
    eq(A('Hello, world! 🌍', o).chars, 15, `${tag} 영어+이모지 15`);
    eq(A('Hello, world! 🌍', o).noSpaces, 13, `${tag} 영어+이모지 공백 제외 13`);
    // 단어
    eq(A('Hello world', o).words, 2, `${tag} 영어 2단어`);
    eq(A('well-known e-mail don\'t', o).words, 3, `${tag} 하이픈·아포스트로피 단어 = 1`);
    eq(A('  spaced   out  \n\n words ', o).words, 3, `${tag} 공백 여러 개`);
    eq(A('AI는 2026년 10월에 시작했다.', Object.assign({ lang: 'ko' }, o)).words, 4, `${tag} 한국어 어절 4`);
    eq(A('🙂 👍', o).words, 0, `${tag} 이모지만 = 0단어`);
    eq(A('...', o).words, 0, `${tag} 문장부호만 = 0단어`);
    // 문단·줄
    const para = 'First line.\nSecond line.\n\n\nNew paragraph.\n  \nThird.';
    eq([A(para, o).paragraphs, A(para, o).lines], [3, 4], `${tag} 문단 3 · 줄 4`);
    eq([A('   \n\n ', o).paragraphs, A('   \n\n ', o).lines, A('   \n\n ', o).words], [0, 0, 0], `${tag} 공백뿐 = 0`);
    // 문장
    eq(A('Hello world. How are you? Fine!', o).sentences, 3, `${tag} 영어 문장 3`);
    eq(A('안녕하세요. 반갑습니다!', o).sentences, 2, `${tag} 한국어 문장 2`);
    eq(A('今日は晴れ。明日は雨。', o).sentences, 2, `${tag} 일본어 문장 2`);
    eq(A('No punctuation here', o).sentences, 1, `${tag} 마침표 없는 1문장`);
  });
  // Segmenter 만: 사전 분절·약어
  eq(A('今日は晴れです').words, 4, '일본어 단어 今日|は|晴れ|です');
  eq(A('今天天气很好').words, 3, '중국어 단어 今天|天气|很好');
  eq(A('สวัสดีครับ').words, 2, '태국어 단어 สวัสดี|ครับ');
  eq(A('Dr. Smith went home. He slept.').sentences, 2, '약어 Dr. 뒤에서 문장을 자르지 않음');
  eq(A('今日は晴れです', { noSegmenter: true }).words, 7, '대체 로직: 한자·가나는 글자마다 1단어');

  // 바이트
  const B = (t, m) => CORE.bytes(t, m);
  eq([B('abc', 'utf8'), B('abc', 'neis'), B('abc', 'legacy')], [3, 3, 3], 'ASCII 바이트');
  eq([B('가', 'utf8'), B('가', 'neis'), B('가', 'legacy')], [3, 3, 2], '한글 1자: UTF-8 3 · 나이스 3 · 완성형 2');
  eq([B('é', 'utf8'), B('ж', 'utf8'), B('😀', 'utf8'), B('😀', 'legacy')], [2, 2, 4, 2], 'é·ж 2, 이모지 4(UTF-8)/2(완성형)');
  eq([B('a\nb', 'utf8'), B('a\nb', 'neis'), B('a\nb', 'legacy')], [3, 4, 4], '줄바꿈: UTF-8 1 · 나이스 2 · 완성형 2');
  eq([B('a\r\nb', 'utf8'), B('a\r\nb', 'neis')], [3, 4], '\\r\\n 은 줄바꿈 하나로 맞춘 뒤 셈');
  eq(B('안녕하세요 Hello\n반가워요', 'neis'), 15 + 1 + 5 + 2 + 12, '나이스: 한글 3·영문/공백 1·엔터 2');
  eq(B('안녕하세요 Hello\n반가워요', 'legacy'), 10 + 1 + 5 + 2 + 8, '완성형: 한글 2·영문/공백 1·엔터 2');
  const sample = 'Mix 한글 漢字 カナ ไทย 🙂\nend';
  eq(B(sample, 'utf8'), Buffer.byteLength(sample, 'utf8'), 'UTF-8 = Buffer.byteLength');
  eq(A(sample).bytes, { utf8: B(sample, 'utf8'), neis: B(sample, 'neis'), legacy: B(sample, 'legacy') }, 'analyze 바이트 3방식');

  // 시간
  const words238 = Array(238).fill('word').join(' ');
  eq([A(words238).readingSec, A(words238).speakingSec], [60, 95], '238단어: 읽기 60초 · 말하기 95초');
  const hangul300 = Array(60).fill('가나다라마').join(' ');   // 한글 300자
  eq([A(hangul300).readingSec, A(hangul300).speakingSec], [36, 60], '한글 300자: 읽기 36초 · 말하기 60초');
  eq([A('').readingSec, A('hi').readingSec], [0, 1], '빈 글 0초 · 짧은 글 최소 1초');
  eq([CORE.splitTime(0), CORE.splitTime(59), CORE.splitTime(125)], [{ m: 0, s: 0 }, { m: 0, s: 59 }, { m: 2, s: 5 }], 'splitTime');

  // 키워드
  const kw = CORE.keywords('The cat sat. The cat ran. A dog and the cat saw a dog. Dog!', { lang: 'en' });
  eq(kw.map((k) => [k.word, k.count]), [['cat', 3], ['dog', 3]], '키워드: 흔한 단어(the, a, and) 빼고 2번 이상, 같은 수면 먼저 나온 순');
  eq(kw[0].pct, Math.round((3 / 15) * 1000) / 10, '키워드 비율 = 횟수 / 전체 단어');
  eq(CORE.keywords('one two three').length, 0, '키워드: 2번 이상만');
  eq(CORE.keywords('자소서 자소서 그리고 그리고 글자수', { lang: 'ko' }).map((k) => k.word), ['자소서'], '키워드 한국어(그리고 제외)');
  eq(CORE.keywords('a b c d e f g h i j k l m n o p q r s t u v w x y z a b', { top: 5 }).length, 0, '키워드: 한 글자 라틴 제외');
  eq(CORE.keywords('w1 w1 w2 w2 w3 w3 w4 w4 w5 w5 w6 w6', { top: 5 }).length, 5, '키워드 최대 5개');

  // 목표 글자수
  eq(CORE.limitStatus(10, 0), { on: false, pct: 0, left: 0, over: 0 }, '목표 끔');
  eq(CORE.limitStatus(250, 500), { on: true, pct: 50, left: 250, over: 0 }, '목표 50%');
  eq(CORE.limitStatus(520, 500), { on: true, pct: 100, left: 0, over: 20 }, '목표 초과 20');
  eq([CORE.cleanLimit('1,500'), CORE.cleanLimit('-3'), CORE.cleanLimit('abc'), CORE.cleanLimit('99999999')], [1500, 3, 0, CORE.LIMIT_MAX], 'cleanLimit');
  eq(CORE.normalizePrefs({}), { byteMode: 'utf8', limit: 0, limitSpaces: true }, 'normalizePrefs 기본');
  eq(CORE.normalizePrefs({ byteMode: 'bogus', limit: '700', limitSpaces: false }), { byteMode: 'utf8', limit: 700, limitSpaces: false }, 'normalizePrefs 정리');
  eq(CORE.normalizePrefs(null), CORE.normalizePrefs({}), 'normalizePrefs(null)');

  // 고치기 도구
  eq(CORE.tidySpaces('  a   b \n\n\n\n c\t\td  '), 'a b\n\nc d', '공백 정리');
  eq(CORE.tidySpaces('줄 끝 공백   \n다음 줄'), '줄 끝 공백\n다음 줄', '줄 끝 공백 정리');
  eq(CORE.joinLines('line one\nline two\n\nthree'), 'line one line two three', '줄 잇기(영어는 공백 하나)');
  eq(CORE.joinLines('今日は\n晴れです。\n明日'), '今日は晴れです。明日', '줄 잇기(한중일은 띄어쓰기 없이)');
  eq(CORE.joinLines('한국어 문장\n다음 문장'), '한국어 문장 다음 문장', '줄 잇기(한국어는 공백)');
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
      ['meta.title', 'hero.hook', 'ui.placeholder', 'ui.finish', 'ui.saved', 'ui.tools.tidy', 'result.again', 'result.heading', 'ui.byteHint.legacy', 'ui.local'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·칩)
    const W = [['ui.finish', 26], ['result.again', 26], ['result.copySummary', 24], ['ui.limitOff', 10], ['ui.limitCustom', 14], ['ui.limitSpaces', 22],
      ['ui.tools.copy', 22], ['ui.tools.tidy', 22], ['ui.tools.join', 22], ['ui.tools.clear', 22], ['ui.tools.undo', 22],
      ['ui.bar.chars', 14], ['ui.bar.noSpaces', 14], ['ui.bar.words', 14], ['ui.bar.bytes', 14],
      ['ui.byteMode.utf8', 16], ['ui.byteMode.neis', 16], ['ui.byteMode.legacy', 16], ['ui.limitLabel', 30], ['ui.statsLabel', 30], ['ui.kwLabel', 30]];
    W.forEach(([p, max]) => { const v = get(T, p); if (width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    Object.keys(EN.ui.stats).forEach((k) => { const v = T.ui.stats[k]; if (width(v) > 30) bad(`${tag} ui.stats.${k} 가 김 (폭 ${width(v)} > 30): ${v}`); });
    CORE.LIMIT_PRESETS.filter(Boolean).forEach((n) => { const v = G.fmt(T.ui.limitChip, { n: n.toLocaleString(lang) }); if (width(v) > 10) bad(`${tag} 목표 칩 "${v}" 가 김`); });
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    if (!T.meta.title.startsWith(APP.title[lang])) bad(`${tag} meta.title 이 현지 검색어(app.config title "${APP.title[lang]}")로 시작하지 않음: ${T.meta.title}`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 공유 문구에 글 자리표시자 없음
    if (/\{/.test(T.result.shareText + T.result.shareTitle)) bad(`${tag} 공유 문구에 자리표시자(사용자 글이 들어갈 수 있음)`);
    // 제목·설명 길이
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 170 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if ((lang === 'ru' || lang === 'vi') && !/Montserrat|Unbounded|Rubik|Nunito/.test(T.fonts.css)) bad(`${tag} 키릴/베트남 문자를 지원하는 글꼴이 아님`);
    // 바이트 안내·시간 문구
    CORE.BYTE_MODES.forEach((m) => { if (!T.ui.byteMode[m] || !T.ui.byteHint[m]) bad(`${tag} 바이트 방식 ${m} 문구 없음`); });
    if (!/\{s\}/.test(T.ui.time.sec) || !/\{m\}/.test(T.ui.time.min) || !/\{m\}[\s\S]*\{s\}/.test(T.ui.time.minSec)) bad(`${tag} 시간 문구 {m}/{s}`);
  });
  // 한국어: 나이스·자소서 규칙 문구
  const KO = L10N.ko.ui;
  if (!/나이스|NEIS/.test(KO.byteMode.neis) || !/엔터[^.]*2바이트/.test(KO.byteHint.neis) || !/한글[^.]*3바이트/.test(KO.byteHint.neis)) bad('[ko] 나이스 바이트 안내(한글 3·엔터 2)');
  if (!/2바이트/.test(KO.byteMode.legacy) || !/자소서/.test(KO.byteHint.legacy) || !/한글[^.]*2바이트/.test(KO.byteHint.legacy)) bad('[ko] 완성형 2바이트(자소서) 안내');
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-wc"[\s\S]*?<\/section>/);
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
  if (!/<link rel="canonical" href="https:\/\/wordcount\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/wordcount\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
  const foot = (html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/) || [''])[0];
  if (/privacy\.html"/.test(foot) && !/guide\.html"/.test(foot)) bad(`${tag} 푸터에 가이드 링크 없음 (node tools/gen-guides.js wordcount)`);
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
      if (!S) { bad(`${tag} 첫 화면(#screen-wc) 없음`); return; }
      if (/<section id="screen-wc"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="wc-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="wc-h1"', 'class="wc-hook"', 'id="bar-chars"', 'id="bar-noSpaces"', 'id="bar-words"', 'id="bar-bytes"', '<textarea id="text"', 'id="limitbar"',
        'id="btn-copy"', 'id="btn-tidy"', 'id="btn-join"', 'id="btn-clear"', 'id="btn-undo"', 'id="saved-note"',
        'data-limit="0"', 'data-limit="500"', 'data-limit="1000"', 'data-limit="1500"', 'id="limit-custom"', 'id="limit-spaces"',
        'id="st-chars"', 'id="st-noSpaces"', 'id="st-words"', 'id="st-sentences"', 'id="st-paragraphs"', 'id="st-lines"', 'id="st-reading"', 'id="st-speaking"',
        'id="st-bytes"', 'data-bytemode="utf8"', 'data-bytemode="neis"', 'data-bytemode="legacy"', 'id="kw"', 'id="error"', 'id="finish-btn"',
        'id="result"', 'id="result-card"', 'id="sum-chars"', 'id="sum-list"', 'id="btn-copy-sum"', '<div data-mg-end="wordcount"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((v, i) => i && v < seq[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 막대 → 입력 → 도구 → 목표 → 자세한 숫자 → 바이트 → 키워드 → 결과 보기 → 요약 → 끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="wc-result" hidden>/.test(S)) bad(`${tag} 요약·끝 화면(#result)은 처음에 hidden`);
      if (!/id="btn-undo" class="wc-tool" hidden/.test(S) || !/id="limitbar" hidden/.test(S)) bad(`${tag} 되돌리기·목표 막대는 처음에 숨김`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/data-limit="0" aria-checked="true"/.test(S) || !/data-bytemode="utf8" aria-checked="true"/.test(S) || (S.match(/aria-checked="true"/g) || []).length !== 2) bad(`${tag} 기본 선택(목표 끔 · UTF-8)`);
      if (!/id="limit-spaces" role="switch" checked/.test(S)) bad(`${tag} 공백 포함 스위치 기본 켬`);
      if (!/<label class="visually-hidden" for="text">/.test(S)) bad(`${tag} 입력 칸 label 없음`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (!/id="error" class="wc-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (/mg-faq/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      if (!S.includes(G.esc(T.ui.saved))) bad(`${tag} "이 기기에만 저장" 안내 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('wordcount-core.js') < 0 || html.indexOf('wordcount-core.js') > html.indexOf('wordcount.js"')) bad(`${tag} wordcount-core.js 가 wordcount.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      const ph = read(pf);
      commonHtml(`[${lang}] ${pf}`, ph, lang, mode === 'variant');
      if (!/localStorage|local storage|로컬 저장소|ローカルストレージ|本地存储|stockage local|lokalen Speicher|almacenamiento local|memoria locale|armazenamento local|локальном хранилище|bộ nhớ cục bộ|พื้นที่จัดเก็บภายใน/.test(ph)) bad(`[${lang}] ${pf} 개인정보처리방침에 이 기기 저장(localStorage) 안내 없음`);
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://wordcount.example.com/</loc>') || !sm.includes('<loc>https://wordcount.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const raw = fs.readFileSync(path.join(SITE, 'wordcount.js'), 'utf8');
  const js = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('wordcount.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('done'\)/g) || []).length !== 1) bad("wordcount.js: track('done') 은 결과 보기 1곳");
  if (!(js.match(/track\('start'\)/g) || []).length) bad("wordcount.js: track('start') 없음");
  if (!/if \(!started && els\.text\.value\.trim\(\)\) \{ started = true; doneSent = false; track\('start'\); \}/.test(js)) bad("wordcount.js: 처음 글을 쓸 때 track('start') 한 번(started 플래그)");
  if (!/if \(!doneSent\) \{ doneSent = true; track\('done'\); \}/.test(js)) bad("wordcount.js: track('done') 은 판마다 한 번(doneSent 플래그)");
  if (/location\.(hash|search)\s*=|history\.(push|replace)State|location\.assign|location\.replace|location\.href\s*=/.test(js)) bad('wordcount.js 가 주소를 바꿈 — 글을 주소에 넣지 않는다');
  if (/fetch\(|XMLHttpRequest|sendBeacon|window\.supa\b/.test(js)) bad('wordcount.js 가 네트워크 요청을 함 — 글은 보내지 않는다');
  if (/document\.cookie|sessionStorage|indexedDB/.test(js)) bad('wordcount.js: 저장은 localStorage 초안·설정만');
  js.split('\n').forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line)) bad(`wordcount.js ${i + 1}행: localStorage 접근은 try/catch 안에서`); });
  if (/innerHTML/.test(js)) bad('wordcount.js: innerHTML 금지 (글·단어는 textContent)');
  const share = (js.match(/setShareData\(function \(\) \{[\s\S]*?\}\);/) || [''])[0];
  if (!share || /els\.|\.value|stats|draft/.test(share)) bad('wordcount.js: 공유 데이터에 사용자 글/숫자가 들어갈 수 있음 (앱 주소 + 일반 문구만)');
  if (!/mgCleanUrl/.test(share)) bad('wordcount.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (!/setRetry\(\{ label: R\.again, action: function \(\) \{ clearAll\(true\); \} \}\)/.test(js)) bad('wordcount.js: setRetry = 지우고 입력 칸에 초점');
  if (!/els\.adStart\.hidden = true/.test(js) || !/els\.adStart\.hidden = false/.test(js)) bad('wordcount.js: 요약이 보이면 mg-ad-start 숨김, 지우면 다시 보임');
  const core = fs.readFileSync(path.join(SITE, 'wordcount-core.js'), 'utf8');
  if (/localStorage|document\.|window\.(?!WORDCOUNT)/.test(core.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''))) bad('wordcount-core.js 는 화면·저장소와 무관해야 함');
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
  if (APP.id !== 'wordcount' || APP.category !== 'create' || APP.path !== 'https://wordcount.example.com/' || APP.added !== '2026-10-15' || APP.emoji !== '📝' || APP.order !== 1) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 150) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (len(APP.title[code]) > 26) bad(`app.config.js ${code} 포털 이름이 김 (${len(APP.title[code])}자)`);
    }
  });
  if (APP.title.ko !== '글자수 세기') bad('app.config.js ko 제목은 "글자수 세기"');
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n글자수 세기 로직(Segmenter + 대체 로직: 이모지·한중일·태국어·바이트 3방식·시간·키워드·목표·고치기) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 세는 로직(grapheme·단어·문장·바이트 UTF-8/나이스/완성형·시간·키워드), 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·요약 안 끝 화면·FAQPage 없음), 글 비공유·주소 미사용 규칙, OG 이미지 모두 OK');
