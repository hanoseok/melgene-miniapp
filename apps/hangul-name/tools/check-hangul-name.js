#!/usr/bin/env node
/**
 * 내 이름 한글로(hangul-name) 검사.
 *   1) 로직(hangul-name-core.js): 사전·규칙·키릴·가나·한글 이름 ~50개의 기대 표기, 음절 로마자, 사전 값이 모두 완성형 한글인지·키가 정리된 소문자인지,
 *      빈/잘못된 입력 → 친절한 실패(예외 없음), 40자 제한, 무작위 입력 2만 개(예외 없음 · 결과는 한글 음절과 공백만 · 늘 같은 결과), 공유 링크 encode/decode.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(금지 질문 없음, 문신 → 원어민 확인, 서버 전송 없음 안내),
 *      제목·설명 길이, 360px 버튼·칩 문구 길이, fr 좁은 공백, ru 키릴 글꼴, ko 외 언어에 한글 문구 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나(검색어) / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(create) / FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(이름 입력·시작 버튼, FAQ·카드 없음, 맨 끝 mg-ad-start 정확히 1개) /
 *      결과 화면(처음엔 hidden): 카드 → 스타일 4개 → 저장·복사 → 음절 풀이 → 안내 → data-mg-end="hangul-name" 순서, 페이지에 그 밖의 mg-ad 없음,
 *      FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 링크.
 *
 * 실행: node tools/check-hangul-name.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'hangul-name-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
// 보이는 글자 수 (태국어 윗·아랫 기호는 세지 않는다)
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const ONLY_HANGUL = /^[가-힣]+( [가-힣]+)*$/;

// ---------------------------------------------------------------- 1) 로직
const EXPECT = [
  // 사전 (표준 외래어 표기)
  ['Michael Smith', '마이클 스미스'], ['John', '존'], ['Emma', '엠마'], ['Sophia', '소피아'], ['Liam', '리엄'], ['Olivia', '올리비아'],
  ['Garcia', '가르시아'], ['Nguyễn', '응우옌'], ['Kim', '김'], ['Tanaka', '다나카'], ['Maria', '마리아'], ['Mohammed', '무함마드'],
  ['Peter', '피터'], ['Müller', '뮐러'], ['José', '호세'], ['Chloé Dubois', '클로이 뒤부아'], ['Mary-Kate', '메리 케이트'],
  // 규칙 (사전에 없는 이름)
  ['Clara', '클라라'], ['Carla', '카를라'], ['Quinn', '퀸'], ['Alexa', '알렉사'], ['Brad', '브래드'], ['Frank', '프랭크'], ['Ingrid', '잉그리드'],
  ['Angela', '안젤라'], ['Bingo', '빙고'], ['Leila', '레일라'], ['Mila', '밀라'], ['Yasmin', '야스민'], ['Maya', '마야'], ['Leonardo', '레오나르도'],
  ['Wendy', '웬디'], ['Ruth', '루스'], ['Dean', '딘'], ['Allison', '알리슨'], ['Igor', '이고르'], ['Arya', '아리아'], ['Bruno', '브루노'],
  ['Rafael', '라파엘'], ['Valentino', '발렌티노'], ['Brooklyn', '브루클린'], ['Elsa', '엘사'], ['Finn', '핀'],
  // 키릴 → 라틴 → 한글
  ['Иван Петров', '이반 페트로프'], ['Сергей', '세르게이'], ['Наталья', '나탈리야'], ['Михаил', '미하일'], ['Пётр', '표트르'], ['Николай', '니콜라이'],
  // 가나
  ['たなか はなこ', '다나카 하나코'], ['ゆうき', '유키'], ['とうきょう', '도쿄'], ['サクラ', '사쿠라'], ['かっぱ', '갓파'],
  // 한글은 그대로
  ['마이클', '마이클'], ['  김   민준  ', '김 민준'],
];
function checkLogic() {
  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
  let rules = 0;
  EXPECT.forEach(([inp, want]) => {
    const r = CORE.convert(inp);
    if (!r.ok) return bad(`convert(${inp}) 실패: ${r.reason}`);
    eq(r.hangul, want, `convert(${inp})`);
    if (!ONLY_HANGUL.test(r.hangul)) bad(`convert(${inp}) 결과에 한글 음절 아닌 글자: ${r.hangul}`);
    if (r.words.some((w) => w.source === 'rule')) rules++;
    r.words.forEach((w) => {
      if (w.blocks.map((b) => b.h).join('') !== w.hangul) bad(`${inp}: blocks 가 hangul 과 다름`);
      if (w.blocks.some((b) => !/^[a-z]+$/.test(b.r))) bad(`${inp}: 로마자가 비었거나 이상함 ${w.blocks.map((b) => b.r).join('-')}`);
    });
  });
  if (rules < 20) bad(`규칙 변환 기대값이 ${rules}개뿐 (20개 이상)`);
  eq(CORE.convert('Michael').roman, 'ma-i-keul', '로마자 Michael');
  eq(CORE.convert('Olivia').roman, 'ol-li-bi-a', '로마자 ㄹㄹ = l-l');
  eq(CORE.convert('Smith').roman, 'seu-mi-seu', '로마자 Smith');
  eq(CORE.convert('Kim Park').roman, 'gim bak', '로마자 받침');
  eq(CORE.convert('Иван').words[0].latin, 'Ivan', '키릴 → 라틴 표시');
  eq(CORE.cyrToLatin('Елена'), 'yelena', 'cyrToLatin е 첫머리 ye');
  // 사전
  const keys = Object.keys(CORE.DICT);
  if (keys.length < 200) bad(`사전 ${keys.length}개 (200개 이상)`);
  keys.forEach((k) => {
    if (!/^[가-힣]+$/.test(CORE.DICT[k])) bad(`사전 ${k} 값이 완성형 한글이 아님: ${CORE.DICT[k]}`);
    if (CORE.latinKey(k) !== k) bad(`사전 키 ${k} 가 정리된 소문자가 아님`);
  });
  // 실패 · 제한
  eq(CORE.convert('').reason, 'empty', '빈 입력');
  eq(CORE.convert('   ').reason, 'empty', '공백만');
  eq(CORE.convert(null).reason, 'empty', 'null');
  eq(CORE.convert(undefined).reason, 'empty', 'undefined');
  eq(CORE.convert(12345).reason, 'invalid', '숫자');
  eq(CORE.convert('李小龍').reason, 'invalid', '한자');
  eq(CORE.convert('😀🎉').reason, 'invalid', '이모지');
  eq(CORE.convert({}).ok, false, '객체');
  eq(Array.from(CORE.clean('a'.repeat(100))).length, CORE.MAX_INPUT, '40자 제한');
  eq(CORE.MAX_INPUT, 40, 'MAX_INPUT');
  // 무작위 입력: 예외 없음 · 한글 음절과 공백만 · 같은 입력 = 같은 결과
  const pool = Array.from("abcdefghijklmnopqrstuvwxyzAEIOUQXZéüñßøçłабвгдеёжзийклмнопрстуфхцчшщъыьэюяіїєあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんがざだばぱっゃゅょぁぃぅぇぉアイウカキクサシスタチツナハマヤラワンーァィ가나다라마李 -'.,·・/0123456789\n\t​😀");
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  for (let t = 0; t < 20000; t++) {
    let s = '';
    const L = Math.floor(rnd() * 60);
    for (let i = 0; i < L; i++) s += pool[Math.floor(rnd() * pool.length)];
    let r;
    try { r = CORE.convert(s); } catch (e) { bad(`convert 예외: ${JSON.stringify(s)} ${e.message}`); continue; }
    if (r.ok && !ONLY_HANGUL.test(r.hangul)) { bad(`무작위 입력 결과에 다른 글자: ${JSON.stringify(s)} → ${r.hangul}`); break; }
    if (!r.ok && !['empty', 'invalid'].includes(r.reason)) bad(`실패 이유가 이상함: ${r.reason}`);
    if (JSON.stringify(CORE.convert(s)) !== JSON.stringify(r)) { bad(`결과가 매번 다름: ${JSON.stringify(s)}`); break; }
  }
  // 공유 링크
  const enc = CORE.encode('Michael Smith', 'bold');
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encode 가 base64url 이 아님');
  eq(CORE.decode(enc), { name: 'Michael Smith', style: 'bold' }, 'decode(encode)');
  eq(CORE.decode(CORE.encode('나탈리야 Иван', 'nope')), { name: '나탈리야 Иван', style: 'brush' }, '모르는 스타일 → 기본');
  eq(CORE.decode('!!!'), null, 'decode 잘못된 글자');
  eq(CORE.decode('e30'), null, 'decode 빈 객체');
  eq(CORE.decode(CORE.encode('李', 'cute')), null, '변환 안 되는 이름은 공유 링크 무효');
  eq(CORE.encode('', 'cute'), '', '빈 이름 encode');
  eq(CORE.STYLES.length, 4, '카드 스타일 4개');
  CORE.STYLES.forEach((s) => { if (!CORE.CARD_FONTS[s]) bad(`카드 글꼴 없음: ${s}`); });
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
    if (!/\{hangul\}/.test(T.result.shareText) || !/\{hangul\}/.test(T.result.copyText) || !/\{roman\}/.test(T.result.copyText)) bad(`${tag} shareText/copyText 자리표시자`);
    if (lang !== 'en') {
      ['meta.title', 'start.hook', 'start.start', 'result.save', 'result.note', 'errors.invalid'].forEach((p) => {
        const get = (o) => p.split('.').reduce((a, k) => a[k], o);
        if (get(T) === get(EN)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`);
      });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px: 버튼·칩·제목 문구 길이 (칩 4칸, 저장/복사 2칸)
    if (len(T.start.start) > 26) bad(`${tag} start.start 가 김`);
    ['save', 'copy'].forEach((k) => { if (len(T.result[k]) > 20) bad(`${tag} result.${k} 가 김 (2칸 버튼)`); });
    if (len(T.result.again) > 26) bad(`${tag} result.again 가 김`);
    CORE.STYLES.forEach((k) => { if (!T.styles[k] || len(T.styles[k]) > 10) bad(`${tag} styles.${k} 가 없거나 김 (칩 4칸)`); });
    if (new Set(CORE.STYLES.map((k) => T.styles[k])).size !== 4) bad(`${tag} styles 이름 중복`);
    ['eyebrow', 'eyebrowFriend', 'cardTag', 'styleTitle', 'breakdownTitle'].forEach((k) => { if (!T.result[k] || len(T.result[k]) > 44) bad(`${tag} result.${k} 가 없거나 김`); });
    if (len(T.start.badge) > 40 || len(T.start.inputLabel) > 24 || len(T.start.placeholder) > 30) bad(`${tag} 시작 화면 문구가 김(배지/라벨/예시)`);
    if (!T.errors.empty || !T.errors.invalid) bad(`${tag} errors 문구 없음`);
    // 시작 문구
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker)) bad(`${tag} h1 검색어(start.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!/native|원어민|한국어를 잘|ネイティブ|母语|natif|coréanophone|Muttersprache|เจ้าของภาษา|ภาษาแม่|bản ngữ|nativa|madrelingua|nativo|носител/i.test(JSON.stringify(T.faq))) bad(`${tag} FAQ 에 문신·선물 전 원어민 확인 안내 없음`);
    if (!/server|서버|サーバー|服务器|serveur|Server|เซิร์ฟเวอร์|máy chủ|servidor|server|сервер/i.test(JSON.stringify(T.faq))) bad(`${tag} FAQ 에 이름을 서버로 보내지 않는다는 안내 없음`);
    if (!/server|서버|サーバー|服务器|serveur|Server|เซิร์ฟเวอร์|máy chủ|servidor|сервер/i.test(T.privacy.sections[0][1])) bad(`${tag} 개인정보처리방침 1절에 서버 전송 없음 안내 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 48 : 78)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 140 : 240)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «( ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Nunito|Be\+Vietnam|Plus\+Jakarta/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
  });
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
  if (!/<link rel="canonical" href="https:\/\/hangul-name\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/hangul-name\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const result = section(html, 'screen-result');
      if (!start || !result) { bad(`${tag} 시작/결과 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-result"[^>]*hidden/.test(html)) bad(`${tag} 결과 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      // 시작 화면: 티징 + 이름 입력 + 버튼 + 맨 끝 mg-ad-start 1개
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 밖 mg-ad 금지 (결과 화면 광고는 공통 끝 화면이 그림 — 한 화면에 광고 1개)`);
      if (/data-mg-end|mg-faq|<details|<canvas|id="breakdown"|style-chips/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/카드/결과 UI`);
      if (!/<h1 class="hn-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!new RegExp(`<input id="name-input"[^>]*maxlength="${CORE.MAX_INPUT}"`).test(start)) bad(`${tag} 이름 입력 maxlength ${CORE.MAX_INPUT}`);
      if (!/<label class="hn-label" for="name-input">/.test(start)) bad(`${tag} 이름 입력 label 없음`);
      if (!/<button id="start-btn"[^>]*type="submit"/.test(start) || start.indexOf('id="name-input"') > start.indexOf('id="start-btn"')) bad(`${tag} 시작 버튼(submit)이 입력 뒤에 없음`);
      // 결과 화면 순서
      const at = (k) => result.indexOf(k);
      const order = ['id="card-canvas"', 'id="style-chips"', 'id="save-btn"', 'id="copy-btn"', 'id="breakdown"', 'class="hn-note"', '<div data-mg-end="hangul-name"></div>'].map(at);
      if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 결과 화면 순서가 카드 → 스타일 → 저장 → 복사 → 음절 풀이 → 안내 → 끝 화면 이 아님`);
      if ((result.match(/class="hn-chip /g) || []).length !== CORE.STYLES.length) bad(`${tag} 스타일 칩 ${CORE.STYLES.length}개가 아님`);
      CORE.STYLES.forEach((s) => { if (!result.includes(`data-style="${s}"`)) bad(`${tag} 스타일 칩 ${s} 없음`); });
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (html.indexOf('hangul-name-core.js') < 0 || html.indexOf('hangul-name-core.js') > html.indexOf('hangul-name.js"')) bad(`${tag} hangul-name-core.js 가 hangul-name.js 보다 먼저여야 함`);
      if (/fonts\.googleapis\.com\/css2\?family=Black\+Han\+Sans/.test(html)) bad(`${tag} 카드 글꼴을 <head> 에서 막아 불러옴 (JS 가 나중에 붙인다)`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL(guide 제외) ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://hangul-name.example.com/</loc>') || !sm.includes('<loc>https://hangul-name.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지: hangul-name.js 에 사람 문구가 없는지 (주석 제외)
  const js = fs.readFileSync(path.join(SITE, 'hangul-name.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('hangul-name.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("hangul-name.js: track('start')·track('done') 는 각각 한 군데");
  if (/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js)) bad('hangul-name.js 가 네트워크로 무언가 보냄 (이름은 서버로 보내지 않는다)');
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
  if (APP.id !== 'hangul-name' || APP.category !== 'create' || APP.path !== 'https://hangul-name.example.com/' || APP.added !== '2026-10-09' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
  if (APP.emoji !== '🔤') bad('app.config.js emoji');
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
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n변환 로직(기대 표기 ${EXPECT.length}개 · 사전 ${Object.keys(CORE.DICT).length}개 · 무작위 2만 개) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 변환 로직(사전·규칙·키릴·가나·한글, 예외 없음, 한글 음절만), 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개)·결과 → 끝 화면 순서), OG 이미지 모두 OK');
