#!/usr/bin/env node
/**
 * 멋진 글꼴 변환기 검사.
 *   1) 로직(fancytext-core.js): 알려진 변환 결과(굵게·필기체 예외 글자·이중선·원문자·상자·작은 대문자·넓게), 악센트 글자, 거꾸로(덩어리 뒤집기), 결합 부호 꾸미기, 장식 감싸기,
 *      글꼴 15개·꾸밈 10개, 비라틴 글(한글·가나·키릴)은 글꼴 목록 없이 꾸밈만, 빈 글 → 빈 목록, 길이 제한, 줄바꿈 유지.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 스타일 이름 25개(중복 없음), FAQ 3~5개(Unicode 설명, "무료인가요?" 류 금지),
 *      제목·설명 길이, fr 좁은 공백, ru 키릴 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나(검색어) / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(create) / FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(FAQ·입력 UI 없음, 맨 끝 mg-ad-start 1개) / 그 밖 mg-ad 페이지 전체 1개 = 스타일 목록 아래 /
 *      입력 화면: 글 입력(#text-input) → 목록 → 광고 → data-mg-end="fancytext" 순서(처음엔 hidden), FAQ 는 MG_FAQ 로만, 스크립트 순서, 스타일 결과를 HTML 에 펼치지 않음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-fancytext.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'fancytext-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
// 보이는 글자 수 (태국어 윗·아랫 기호는 세지 않는다)
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
  const cv = CORE.convert;
  eq(cv('bold', 'Hi 09'), '𝐇𝐢 𝟎𝟗', 'bold');
  eq(cv('italic', 'Ah'), '𝐴ℎ', 'italic h 예외');
  eq(cv('script', 'Beg'), 'ℬℯℊ', 'script 예외 글자');
  eq(cv('boldScript', 'Ab'), '𝓐𝓫', 'boldScript');
  eq(cv('fraktur', 'CHRZa'), 'ℭℌℜℨ𝔞', 'fraktur 예외 글자');
  eq(cv('doubleStruck', 'CHNPQRZ9'), 'ℂℍℕℙℚℝℤ𝟡', 'doubleStruck 예외 글자·숫자');
  eq(cv('mono', 'a1'), '𝚊𝟷', 'mono');
  eq(cv('circled', 'aZ019'), 'ⓐⓏ⓪①⑨', 'circled');
  eq(cv('circledBlack', 'aB1'), '🅐🅑1', 'circledBlack(소문자는 대문자로)');
  eq(cv('squared', 'aB'), '🄰🄱', 'squared');
  eq(cv('squaredBlack', 'ab'), '🅰🅱', 'squaredBlack');
  eq(cv('smallCaps', 'Hello'), 'Hᴇʟʟᴏ', 'smallCaps');
  eq(cv('wide', 'A b!'), 'Ａ　ｂ！', 'wide');
  eq(cv('upsideDown', 'ab'), 'qɐ', 'upsideDown 뒤집기');
  eq(cv('upsideDown', 'a\nb'), 'q\nɐ', 'upsideDown 줄 순서');
  eq(cv('upsideDown', 'éa'), 'ɐǝ́', 'upsideDown 악센트가 글자와 함께 움직임');
  eq(cv('bold', 'é'), '𝐞́', 'bold 악센트(기본 글자 + 결합 부호)');
  eq(cv('bold', '안녕 Привет 日本'), '안녕 Привет 日本', '비라틴은 그대로');
  eq(cv('strike', 'ab'), 'a̶b̶', 'strike');
  eq(cv('underline', 'ab'), 'a̲b̲', 'underline');
  eq(cv('wavy', 'ab'), 'a̴b̴', 'wavy');
  eq(cv('spaced', 'ab cd'), 'a b   c d', 'spaced');
  eq(cv('stars', '안녕'), '★안녕★', 'stars');
  eq(cv('ornate', 'a'), '꧁a꧂', 'ornate');
  eq(cv('flower', 'a'), '✿a✿', 'flower');
  eq(cv('stars', 'a\nb'), '★a★\n★b★', '장식은 줄마다');
  eq(CORE.FONTS.length, 15, '글꼴 15개');
  eq(CORE.DECOS.length, 10, '꾸밈 10개');
  eq(new Set(CORE.FONTS.concat(CORE.DECOS)).size, 25, '스타일 id 중복 없음');
  eq(CORE.list('').length + CORE.list('   ').length, 0, '빈 글은 빈 목록');
  eq(CORE.list('Hello').length, 25, '라틴 글은 25개');
  eq(CORE.list('123').map((x) => x.id).includes('italic'), false, '숫자만이면 안 바뀌는 글꼴(italic)은 목록에서 빠짐');
  ['안녕하세요', 'こんにちは', 'Привет', 'สวัสดี'].forEach((t) => {
    const l = CORE.list(t);
    if (l.some((x) => x.group === 'font')) bad(`비라틴 글(${t})에 글꼴이 나옴`);
    if (l.filter((x) => x.group === 'deco').length !== 10) bad(`비라틴 글(${t})은 꾸밈 10개`);
    if (CORE.hasLatin(t)) bad(`hasLatin(${t}) 가 true`);
  });
  eq(CORE.hasLatin('é'), true, 'hasLatin 악센트');
  eq(CORE.hasLatin('한 a'), true, 'hasLatin 섞인 글');
  CORE.list('Hello 안녕 é 123').forEach((x) => { if (!x.out || x.out === 'Hello 안녕 é 123') bad(`${x.id} 결과가 원문과 같거나 비었음`); });
  eq(Array.from(CORE.clean('가'.repeat(300))).length, CORE.MAX_INPUT, '길이 제한');
  eq(CORE.clean(null), '', 'clean null');
  eq(CORE.clean('a\r\nb'), 'a\nb', '줄바꿈 정리');
  // 원문의 보이는 글자 수는 보존: 글꼴 변환은 코드포인트 수가 같아야 한다(라틴 글자 + 숫자)
  CORE.FONTS.filter((id) => id !== 'upsideDown').forEach((id) => { if (Array.from(cv(id, 'Hello World 123')).length !== 15) bad(`${id}: 글자 수가 달라짐`); });
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
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  if (langFiles.length !== G.LOCALES.length) bad(`언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  const seenMenus = {};
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    if (/TODO-TRANSLATE/.test(first)) bad(`${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    const sh = shape(T);
    delete sh.words; const enS = { ...enShape }; delete enS.words;
    keysDiff(enS, sh, '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.') || p.startsWith('words.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    // 스타일 이름: 글꼴 15 + 꾸밈 10, 모두 있고 중복 없음
    const ids = CORE.FONTS.concat(CORE.DECOS);
    const nm = T.names || {};
    if (JSON.stringify(Object.keys(nm).sort()) !== JSON.stringify(ids.slice().sort())) bad(`${tag} names 키가 스타일 id 25개와 다름`);
    const labels = ids.map((id) => nm[id]);
    if (labels.some((x) => !x || len(x) > 22)) bad(`${tag} names 에 비었거나 긴 이름: ${labels.filter((x) => !x || len(x) > 22).join(', ')}`);
    if (new Set(labels).size !== labels.length) bad(`${tag} names 중복`);
    if (lang !== 'en' && labels.filter((x) => EN.names && Object.values(EN.names).includes(x)).length > 8) bad(`${tag} names 가 en 사본에 가깝다 — 그 나라 말로`);
    if (!T.make.sample || !CORE.hasLatin(T.make.sample)) bad(`${tag} make.sample 이 없거나 라틴 글자가 없음(예시 글에도 글꼴이 보여야 함)`);
    seenMenus[lang] = ids.length;
    // 시작 문구
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker.split(' · ')[0])) bad(`${tag} h1 검색어(start.h1Kicker)가 제목과 다름`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
    ['title', 'inputLabel', 'clear', 'fontsHeading', 'decoHeading', 'tapHint', 'needText'].forEach((k) => { if (!T.make[k] || len(T.make[k]) > 40) bad(`${tag} make.${k} 가 없거나 김`); });
    if (len(T.make.latinNote) > 160) bad(`${tag} make.latinNote 가 김`);
    ['again', 'copied'].forEach((k) => { if (len(T.result[k]) > 22) bad(`${tag} result.${k} 가 김`); });
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /Unicode|유니코드|ユニコード|Юникод|ยูนิโค้ด/i.test(f.a))) bad(`${tag} FAQ 에 Unicode 기호 설명(네모로 보이는 이유) 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
  });
  return seenMenus;
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
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
  if (!/<link rel="canonical" href="https:\/\/fancytext\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/fancytext\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const start = section(html, 'screen-start');
      const make = section(html, 'screen-make');
      if (!start || !make) { bad(`${tag} 시작/입력 화면 중 없는 것이 있음`); return; }
      if (/id="screen-result"/.test(html)) bad(`${tag} 결과 화면(screen-result)은 없다 — 입력 화면에서 바로 복사`);
      if (!/<section id="screen-make"[^>]*hidden/.test(html)) bad(`${tag} 입력 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/data-mg-end|mg-faq|<details|id="text-input"|font-list|deco-list/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력 UI/목록`);
      if (!/<h1 class="ft-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      // 스타일 결과(변환된 글)를 HTML 에 미리 펼치지 않는다 — 목록은 브라우저가 그린다
      if (/class="ft-row"|data-style=/.test(html)) bad(`${tag} 스타일 목록이 HTML 에 미리 들어 있음 (브라우저가 그림)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 입력 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if ((make.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 입력 화면 mg-ad 는 1개`);
      const at = (k) => make.indexOf(k);
      const order = ['id="text-input"', 'id="font-list"', 'id="deco-list"', 'class="mg-ad"', 'id="end-wrap"', '<div data-mg-end="fancytext"></div>'].map(at);
      if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 입력 화면 순서가 입력 → 글꼴 목록 → 꾸밈 목록 → 광고 → 끝 화면(end-wrap) 이 아님`);
      if (!/<div id="end-wrap"[^>]*hidden/.test(make)) bad(`${tag} 끝 화면(end-wrap)은 처음에 hidden (첫 복사 뒤에 나옴)`);
      if (!new RegExp(`id="text-input"[^>]*maxlength="${CORE.MAX_INPUT}"`).test(make)) bad(`${tag} 글 입력 maxlength ${CORE.MAX_INPUT}`);
      ['clear-btn', 'char-count', 'latin-note', 'fonts-head', 'deco-head'].forEach((id) => { if (!make.includes(`id="${id}"`)) bad(`${tag} 입력 화면에 #${id} 없음`); });
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('fancytext-core.js') < 0 || html.indexOf('fancytext-core.js') > html.indexOf('fancytext.js"')) bad(`${tag} fancytext-core.js 가 fancytext.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://fancytext.example.com/</loc>') || !sm.includes('<loc>https://fancytext.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지: fancytext.js 에 한글·일본어 등 사람 문구가 없는지 (주석 제외)
  const js = fs.readFileSync(path.join(SITE, 'fancytext.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('fancytext.js 에 언어 문구가 있음 (tools/i18n 으로)');
  // 시작·끝 기록
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("fancytext.js: track('start')·track('done') 는 각각 한 군데");
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
  if (APP.id !== 'fancytext' || APP.category !== 'create' || APP.path !== 'https://fancytext.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (len(APP.title[code]) > 22) bad(`app.config.js ${code} 포털 이름이 김 (${len(APP.title[code])}자)`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
const menuCounts = checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n변환 로직 · 언어 파일 ${G.LOCALES.length}개(스타일 이름 ${Object.values(menuCounts)[0]}개씩) · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 변환 로직(글꼴 15·꾸밈 10·비라틴 처리), 언어 파일 12개(키·자리표시자·스타일 이름 25개·FAQ·제목), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), OG 이미지 모두 OK');
