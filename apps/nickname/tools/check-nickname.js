#!/usr/bin/env node
/**
 * 닉네임 생성기 검사.
 *   1) 로직(nickname-core.js): 단어 읽기(잘못된 모양 거부), 이름 정리, 조합(형용사+명사 · 이름 섞기 · 숫자 · 성별 일치), 직전 결과와 다르게, 공정성(crypto 뽑기: 단어가 모두 고르게), cryptoInt 범위·고르게.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 분위기 5개 × 형용사·명사 12개 이상(중복 없음 · 형용사/명사 겹침 없음 · 단어 길이 · 언어 밖 문자),
 *      조합 수(분위기당 100 이상, 전체 500 이상), FAQ 3~5개(공정성 언급, "무료인가요?" 류 금지), 제목·설명 길이, fr 좁은 공백, ru 키릴 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나(검색어) / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(create) / FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(FAQ·고르기 UI 없음, 맨 끝 mg-ad-start 1개) / 그 밖 mg-ad 페이지 전체 1개 = 고르기 화면 만들기 버튼 아래 /
 *      결과: 닉네임 하나(#nick-text) → data-mg-end="nickname" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서, 단어 목록을 HTML 에 펼치지 않음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-nickname.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'nickname-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
// 보이는 글자 수 (태국어 윗·아랫 기호는 세지 않는다)
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seeded = (seed) => { const r = mulberry32(seed); return (max) => Math.floor(r() * max); };

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
  eq(CORE.parseAdj('mignon/mignonne'), ['mignon', 'mignonne'], 'parseAdj 두 형태');
  eq(CORE.parseAdj(' soft '), ['soft'], 'parseAdj 공백');
  ['', 'a//b', 'a/b/c/d', '/'].forEach((x) => { if (CORE.parseAdj(x)) bad(`parseAdj 가 잘못된 모양을 받음: "${x}"`); });
  eq(CORE.parseNoun('chat|m'), { w: 'chat', g: 'm' }, 'parseNoun');
  eq(CORE.parseNoun('fox'), { w: 'fox', g: 'm' }, 'parseNoun 성별 없음');
  ['', '|m', 'a|x', 'a|m|n'].forEach((x) => { if (CORE.parseNoun(x)) bad(`parseNoun 이 잘못된 모양을 받음: "${x}"`); });
  eq(CORE.adjForm(['a', 'b', 'c'], 'f') + CORE.adjForm(['a', 'b', 'c'], 'n') + CORE.adjForm(['a', 'b'], 'n') + CORE.adjForm(['a'], 'f'), 'bcaa', 'adjForm');
  eq(CORE.cleanName('  <b>Mia</b> & "Jo" \\ | { } '), 'bMiabJo', 'cleanName 특수문자·공백');
  eq(Array.from(CORE.cleanName('가나다라마바사아자차카타파하')).length, 12, 'cleanName 12글자');
  eq(CORE.cleanName(null), '', 'cleanName null');
  eq(CORE.joinParts(['sleepy', 'ice cube'], true), 'SleepyIceCube', 'joinParts camel');
  eq(CORE.joinParts(['졸린', '고 양이'], false), '졸린고양이', 'joinParts 붙이기');

  const W = { cute: { adj: ['mignon/mignonne', 'doux/douce'], noun: ['chat|m', 'lune|f'] }, cool: { adj: ['x'], noun: ['y'] } };
  eq(CORE.combos(W, 'cute'), 4, 'combos');
  eq(CORE.combos(W, 'dreamy'), 0, 'combos 없는 분위기');
  eq(CORE.make(W, { mood: 'dreamy' }), null, '없는 분위기는 null');
  const st = { camel: true, order: 'noun-adj', nameSep: '_' };
  const seen = new Set();
  for (let i = 0; i < 400; i++) {
    const r = CORE.make(W, { mood: 'cute', style: st });
    seen.add(r.text);
    if (!['ChatMignon', 'ChatDoux', 'LuneMignonne', 'LuneDouce'].includes(r.text)) { bad(`성별 일치/순서 틀림: ${r.text}`); break; }
  }
  eq(seen.size, 4, '4가지 조합이 모두 나옴');
  const kinds = {};
  for (let i = 0; i < 600; i++) {
    const r = CORE.make(W, { mood: 'cute', name: 'Mia', style: st });
    kinds[r.kind] = (kinds[r.kind] || 0) + 1;
    if (!/Mia/.test(r.text)) { bad(`이름이 섞이지 않음: ${r.text}`); break; }
  }
  eq(Object.keys(kinds).sort(), ['full-name', 'name-noun', 'noun-name'], '이름 섞기 3가지 모양');
  Object.values(kinds).forEach((c) => { if (Math.abs(c / 600 - 1 / 3) > 0.08) bad(`이름 섞기 모양이 치우침: ${JSON.stringify(kinds)}`); });
  for (let i = 0; i < 200; i++) { const r = CORE.make(W, { mood: 'cute', numbers: true, style: st }); if (!/\d{2}$/.test(r.text)) { bad(`숫자 붙이기: ${r.text}`); break; } }
  const r0 = CORE.make({ cute: { adj: ['a'], noun: ['b'] } }, { mood: 'cute', name: 'zed', style: { camel: false, order: 'adj-noun', nameSep: '-' } }, ((q) => () => q.shift())([0, 0, 2]));
  eq(r0, { text: 'ab-zed', kind: 'full-name' }, '이름 섞기 full-name 모양(rand 고정)');
  // 직전 결과와 다르게
  for (let i = 0; i < 300; i++) {
    const a = CORE.generate(W, { mood: 'cute', style: st }, null, 'ChatMignon');
    if (a.text === 'ChatMignon') { bad('generate 가 직전 결과를 또 줌'); break; }
  }
  // 공정성: 명사 5개를 50000번 뽑아 각각 ±1.2%p 안
  const W5 = { cute: { adj: ['a'], noun: ['n1', 'n2', 'n3', 'n4', 'n5'] } };
  const cnt = {};
  const N = 50000;
  for (let i = 0; i < N; i++) { const t = CORE.make(W5, { mood: 'cute', style: { camel: false } }).text; cnt[t] = (cnt[t] || 0) + 1; }
  ['an1', 'an2', 'an3', 'an4', 'an5'].forEach((t) => { const p = (cnt[t] || 0) / N; if (Math.abs(p - 0.2) > 0.012) bad(`공정성: ${t} 비율 ${p.toFixed(4)} (0.2)`); });
  for (const max of [1, 2, 3, 7, 100]) {
    for (let i = 0; i < 2000; i++) { const v = CORE.cryptoInt(max); if (!(v >= 0 && v < max && Number.isInteger(v))) { bad(`cryptoInt(${max}) 범위 밖 ${v}`); break; } }
  }
  const c3 = [0, 0, 0];
  for (let i = 0; i < 30000; i++) c3[CORE.cryptoInt(3)]++;
  c3.forEach((c, i) => { if (Math.abs(c / 30000 - 1 / 3) > 0.015) bad(`cryptoInt(3) 치우침 ${i}: ${c}`); });
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
    // 단어 목록
    const W = T.words;
    if (!W || typeof W !== 'object') { bad(`${tag} words 없음`); return; }
    if (JSON.stringify(Object.keys(W).sort()) !== JSON.stringify(CORE.MOODS.slice().sort())) bad(`${tag} words 분위기 키가 ${CORE.MOODS.join('·')} 와 다름`);
    const st = T.style || {};
    if (typeof st.camel !== 'boolean' || !['adj-noun', 'noun-adj'].includes(st.order) || typeof st.nameSep !== 'string') bad(`${tag} style { camel, order, nameSep } 모양`);
    let total = 0;
    CORE.MOODS.forEach((mood) => {
      const m = W[mood] || {};
      const rawA = m.adj || [];
      const rawN = m.noun || [];
      const adjs = rawA.map(CORE.parseAdj).filter(Boolean);
      const nouns = rawN.map(CORE.parseNoun).filter(Boolean);
      if (adjs.length !== rawA.length) bad(`${tag} ${mood}.adj 중 모양이 틀린 항목 ${rawA.length - adjs.length}개`);
      if (nouns.length !== rawN.length) bad(`${tag} ${mood}.noun 중 모양이 틀린 항목 ${rawN.length - nouns.length}개`);
      if (adjs.length < 12) bad(`${tag} ${mood} 형용사 ${adjs.length}개 (12개 이상)`);
      if (nouns.length < 12) bad(`${tag} ${mood} 명사 ${nouns.length}개 (12개 이상)`);
      const aKeys = adjs.map((f) => f.join('/'));
      const nKeys = nouns.map((x) => x.w);
      if (new Set(aKeys).size !== aKeys.length) bad(`${tag} ${mood} 형용사 중복`);
      if (new Set(nKeys).size !== nKeys.length) bad(`${tag} ${mood} 명사 중복`);
      const lowerN = new Set(nKeys.map((x) => x.toLowerCase()));
      adjs.forEach((f) => { if (f.some((x) => lowerN.has(x.toLowerCase()))) bad(`${tag} ${mood} 형용사 "${f.join('/')}" 가 같은 분위기 명사와 겹침`); });
      adjs.forEach((f) => f.forEach((x) => { if (len(x) > CORE.MAX_WORD) bad(`${tag} ${mood} 형용사가 김 (${len(x)}자): ${x}`); if (/[|<>{}\\\/]/.test(x)) bad(`${tag} ${mood} 형용사에 구분 문자: ${x}`); }));
      nouns.forEach((x) => { if (len(x.w) > CORE.MAX_WORD) bad(`${tag} ${mood} 명사가 김 (${len(x.w)}자): ${x.w}`); if (/[|<>{}\\\/]/.test(x.w)) bad(`${tag} ${mood} 명사에 구분 문자: ${x.w}`); });
      if (adjs.length && adjs.some((f) => f.length > 3)) bad(`${tag} ${mood} 형용사 형태가 3개 넘음`);
      const needGender = adjs.some((f) => f.length > 1);
      if (needGender && !rawN.every((x) => /\|[mfn]$/.test(x))) bad(`${tag} ${mood}: 성별 형태가 있는 언어는 모든 명사에 |m|f|n 필요`);
      const c = adjs.length * nouns.length;
      if (c < 144) bad(`${tag} ${mood} 조합 ${c}개 (144 이상)`);
      total += c;
      // 만든 닉네임 길이: 이름 12자까지 넣어도 닉네임이 40자 안
      for (let i = 0; i < 300; i++) {
        const r = CORE.make(W, { mood, name: '가나다라마바사아자차카타', numbers: true, style: st });
        if (!r || len(r.text) > 48) { bad(`${tag} ${mood} 닉네임이 김: ${r && r.text}`); break; }
        if (/\s/.test(r.text)) { bad(`${tag} ${mood} 닉네임에 공백: ${r.text}`); break; }
      }
    });
    if (total < 700) bad(`${tag} 전체 조합 ${total}개 (700 이상)`);
    // 한 언어 안에서 명사·형용사가 다른 언어(en) 사본이 아닌지: en 단어가 절반 넘게 같으면 경고
    if (lang !== 'en') {
      const enAll = new Set([].concat(...CORE.MOODS.map((m) => (EN.words[m].noun || []).concat(EN.words[m].adj || []))).map((x) => x.split('|')[0].toLowerCase()));
      const mine = [].concat(...CORE.MOODS.map((m) => (W[m].noun || []).map((x) => x.split('|')[0]))).map((x) => x.toLowerCase());
      const same = mine.filter((x) => enAll.has(x)).length;
      if (same > mine.length / 3) bad(`${tag} 명사가 en 사본에 가깝다 (${same}/${mine.length}) — 그 나라 말로`);
    }
    seenMenus[lang] = total;
    // 시작 문구
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker.split(' · ')[0])) bad(`${tag} h1 검색어(start.h1Kicker)가 제목과 다름`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
    // make.moods
    CORE.MOODS.forEach((k) => { if (!T.make.moods[k] || len(T.make.moods[k]) > 16) bad(`${tag} make.moods.${k} 가 없거나 김`); });
    ['make', 'numbers', 'nameLabel'].forEach((k) => { if (len(T.make[k]) > 48) bad(`${tag} make.${k} 가 김`); });
    ['again', 'change', 'copy'].forEach((k) => { if (len(T.result[k]) > 22) bad(`${tag} result.${k} 가 김`); });
    if (!/\{nick\}/.test(T.result.shareText)) bad(`${tag} result.shareText 에 {nick} 없음`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 공정성(crypto.getRandomValues) 설명 없음`);
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
  if (!/<link rel="canonical" href="https:\/\/nickname\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/nickname\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const result = section(html, 'screen-result');
      if (!start || !make || !result) { bad(`${tag} 시작/고르기/결과 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-make"[^>]*hidden/.test(html) || !/<section id="screen-result"[^>]*hidden/.test(html)) bad(`${tag} 고르기·결과 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/data-mg-end|mg-faq|<details|data-mood|id="name-input"|nk-nick\b/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/고르기 UI/결과`);
      if (!/<h1 class="nk-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      // 단어 목록을 보이는 HTML 에 펼치지 않는다(단어는 PAGE_I18N 안에만) — <head>·스크립트를 뺀 보이는 글자에서 찾는다
      const visibleText = (html.match(/<body[\s\S]*<\/body>/) || [''])[0].replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ');
      const shown = [].concat(...CORE.MOODS.map((m) => (T.words[m].noun || []).map((x) => x.split('|')[0]))).filter((w) => Array.from(w).length > 3 && visibleText.includes(w));
      if (shown.length) bad(`${tag} 보이는 HTML 에 단어가 있음: ${shown.slice(0, 3).join(', ')}`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 고르기 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if ((make.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 고르기 화면 mg-ad 는 1개`);
      if (make.indexOf('class="mg-ad"') < make.indexOf('id="make-btn"')) bad(`${tag} 고르기 화면 광고는 만들기 버튼 아래`);
      CORE.MOODS.forEach((m) => { if (!make.includes(`data-mood="${m}"`)) bad(`${tag} 분위기 버튼 ${m} 없음`); });
      ['name-input', 'num-toggle', 'pool-count', 'make-btn'].forEach((id) => { if (!make.includes(`id="${id}"`)) bad(`${tag} 고르기 화면에 #${id} 없음`); });
      if (!/id="name-input"[^>]*maxlength="12"/.test(make)) bad(`${tag} 이름 입력은 maxlength 12`);
      const nickAt = result.indexOf('id="nick-text"');
      const endAt = result.indexOf('<div data-mg-end="nickname"></div>');
      if (!(nickAt > 0 && endAt > nickAt)) bad(`${tag} 결과: 닉네임 → data-mg-end="nickname" 순서가 아님`);
      if ((result.match(/id="nick-text"/g) || []).length !== 1) bad(`${tag} 결과 닉네임은 하나`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['nick-mood', 'copy-btn', 'again-btn', 'change-btn'].forEach((id) => { if (!result.includes(`id="${id}"`)) bad(`${tag} 결과 화면에 #${id} 없음`); });
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('nickname-core.js') < 0 || html.indexOf('nickname-core.js') > html.indexOf('nickname.js"')) bad(`${tag} nickname-core.js 가 nickname.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://nickname.example.com/</loc>') || !sm.includes('<loc>https://nickname.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지: nickname.js 에 한글·일본어 등 사람 문구가 없는지 (주석 제외)
  const js = fs.readFileSync(path.join(SITE, 'nickname.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('nickname.js 에 언어 문구가 있음 (tools/i18n 으로)');
  // 시작·끝 기록
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("nickname.js: track('start')·track('done') 는 각각 한 군데");
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
  if (APP.id !== 'nickname' || APP.category !== 'create' || APP.path !== 'https://nickname.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
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
console.log(`\n조합·이름 섞기·공정성(crypto 50000회) · 언어 파일 ${G.LOCALES.length}개(전체 조합 ${Object.values(menuCounts).join('/')}가지) · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 단어 읽기·조합(성별 일치·이름 섞기·숫자)·공정성(crypto), 언어 파일 12개(키·자리표시자·분위기 5개×형용사·명사 12개 이상·FAQ·제목), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), OG 이미지 모두 OK');
