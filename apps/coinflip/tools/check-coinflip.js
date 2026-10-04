#!/usr/bin/env node
/**
 * 동전 던지기 & 주사위 검사.
 *   1) 로직(coinflip-core.js): 동전 두 면이 고르게(crypto 50000회), 주사위 1~6 고르게·개수 1~3, cryptoInt 범위·거부 샘플링, 이름 다듬기, 누적.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 기본 면 이름 12자 이하, count·countDice 복수형(ru 포함),
 *      FAQ 3~5개(공정성 getRandomValues 언급, "무료인가요?" 류 금지), 제목·설명 길이, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(FAQ·도구 UI 없음, 맨 끝 mg-ad-start 1개) / 그 밖 mg-ad 페이지 전체 1개 = 도구 화면 던지기 버튼 아래 /
 *      결과 → data-mg-end="coinflip" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-coinflip.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'coinflip-core.js'));
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
  // 동전: 0/1, 주입한 난수에 따라 결정
  eq(CORE.flip(() => 0), 0, 'flip 0');
  eq(CORE.flip(() => 1), 1, 'flip 1');
  let coinMax = 0;
  CORE.flip((m) => { coinMax = m; return 0; });
  eq(coinMax, 2, 'flip 은 2면 중 하나');
  // 주사위: 개수 1~3 으로 맞춤, 값 1~6
  eq(CORE.clampDice(0), 1, 'clampDice 0'); eq(CORE.clampDice(2), 2, 'clampDice 2'); eq(CORE.clampDice(9), 1, 'clampDice 9'); eq(CORE.clampDice('3'), 3, 'clampDice "3"'); eq(CORE.clampDice(NaN), 1, 'clampDice NaN');
  eq(CORE.roll(2, () => 0), [1, 1], 'roll 최소'); eq(CORE.roll(3, () => 5), [6, 6, 6], 'roll 최대'); eq(CORE.roll(7, () => 2).length, 1, 'roll 개수 범위 밖 = 1개');
  eq(CORE.sum([1, 2, 6]), 9, 'sum');
  // 이름 다듬기
  eq(CORE.cleanLabel('  Pizza  ', 'A'), 'Pizza', 'cleanLabel 공백'); eq(CORE.cleanLabel('', 'A'), 'A', 'cleanLabel 빈 값'); eq(CORE.cleanLabel('   ', 'A'), 'A', 'cleanLabel 공백만');
  if (/[<>]/.test(CORE.cleanLabel('<b>x</b>', 'A'))) bad('cleanLabel 꺾쇠가 남음');
  eq(Array.from(CORE.cleanLabel('가나다라마바사아자차카타파하', 'A')).length, 12, 'cleanLabel 12자 제한');
  eq(CORE.cleanLabel('a\nb', 'A'), 'a b', 'cleanLabel 줄바꿈');
  // 누적
  const t = CORE.newTally(); CORE.addCoin(t, 0); CORE.addCoin(t, 1); CORE.addCoin(t, 1); CORE.addDice(t);
  eq(t, { coin: [1, 2], dice: 1 }, '누적'); eq(CORE.coinTotal(t), 3, 'coinTotal');

  // 공정성: 동전 100000번, 주사위 6면 60000번, 각 ±1.5%p 안
  const N = 100000; let heads = 0;
  for (let i = 0; i < N; i++) heads += CORE.flip() === 0 ? 1 : 0;
  if (Math.abs(heads / N - 0.5) > 0.01) bad(`공정성: 동전 앞면 비율 ${(heads / N).toFixed(4)} (0.5)`);
  const face = [0, 0, 0, 0, 0, 0]; const M = 60000;
  for (let i = 0; i < M; i++) CORE.roll(1).forEach((v) => face[v - 1]++);
  face.forEach((c, i) => { if (Math.abs(c / M - 1 / 6) > 0.012) bad(`공정성: 주사위 ${i + 1} 비율 ${(c / M).toFixed(4)} (0.1667)`); });
  for (const max of [1, 2, 3, 6, 7, 100]) {
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
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    if (/TODO-TRANSLATE/.test(first)) bad(`${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    const sh = shape(T);
    delete sh.count; delete sh.countDice; const enS = { ...enShape }; delete enS.count; delete enS.countDice;
    keysDiff(enS, sh, '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => { if (p.startsWith('count') || p.startsWith('privacy.') || p.startsWith('faq.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    // en 사본이 아닌지(번역 확인): 제목·시작 문구·FAQ 첫 질문이 en 과 같으면 안 됨
    if (lang !== 'en') {
      ['meta.title', 'start.hook', 'result.againCoin', 'tool.namesLabel'].forEach((p) => {
        const get = (o) => p.split('.').reduce((a, k) => a[k], o);
        if (get(T) === get(EN)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`);
      });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 복수형
    ['count', 'countDice'].forEach((key) => {
      const C = T[key];
      if (!C || !C.other) { bad(`${tag} ${key}.other 없음`); return; }
      Object.entries(C).forEach(([c, s]) => { if (!/\{n\}/.test(s)) bad(`${tag} ${key}.${c} 에 {n} 없음`); });
      if (lang === 'ru') {
        ['one', 'few', 'many'].forEach((c) => { if (!C[c]) bad(`${tag} ${key}.${c} 없음`); });
        const pr = new Intl.PluralRules('ru');
        const want = { 1: 'бросок', 2: 'броска', 5: 'бросков', 21: 'бросок', 22: 'броска', 11: 'бросков' };
        Object.entries(want).forEach(([n, w]) => { const s = G.fmt(C[pr.select(Number(n))] || C.other, { n }); if (!s.endsWith(` ${w}`)) bad(`${tag} ${key} 복수형 ${n}: "${s}"`); });
      }
    });
    // 기본 면 이름
    ['sideA', 'sideB'].forEach((k) => {
      const v = T.tool[k];
      if (!v || len(v) > CORE.MAX_LABEL || CORE.cleanLabel(v, '') !== v) bad(`${tag} tool.${k} 가 없거나 ${CORE.MAX_LABEL}자 초과/공백 문제: ${v}`);
    });
    if (T.tool.sideA === T.tool.sideB) bad(`${tag} 두 면 기본 이름이 같음`);
    ['throwCoin', 'rollDice', 'tabCoin', 'tabDice'].forEach((k) => { if (len(T.tool[k]) > 24) bad(`${tag} tool.${k} 가 김 (360px 버튼)`); });
    ['againCoin', 'againDice', 'change'].forEach((k) => { if (len(T.result[k]) > 26) bad(`${tag} result.${k} 가 김`); });
    // 시작 문구
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker.split(' · ')[0])) bad(`${tag} h1 검색어(start.h1Kicker)가 제목과 다름`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
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
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
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
  if (!/<link rel="canonical" href="https:\/\/coinflip\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/coinflip\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"UtilitiesApplication"/.test(html)) bad(`${tag} appLd(WebApplication, vote) 없음`);
      const start = section(html, 'screen-start');
      const tool = section(html, 'screen-tool');
      const result = section(html, 'screen-result');
      if (!start || !tool || !result) { bad(`${tag} 시작/도구/결과 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-tool"[^>]*hidden/.test(html) || !/<section id="screen-result"[^>]*hidden/.test(html)) bad(`${tag} 도구·결과 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/data-mg-end|mg-faq|<details|<input|id="coin"|id="throw-btn"|id="roll-btn|cf-res/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/도구 UI/결과`);
      if (!/<h1 class="cf-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 도구 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if ((tool.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 도구 화면 mg-ad 는 1개`);
      if (tool.indexOf('class="mg-ad"') < tool.indexOf('id="roll-btn"') || tool.indexOf('class="mg-ad"') < tool.indexOf('id="throw-btn"')) bad(`${tag} 도구 화면 광고는 던지기 버튼 아래`);
      ['tab-coin', 'tab-dice', 'panel-coin', 'panel-dice', 'name-a', 'name-b', 'coin', 'coin-a', 'coin-b', 'throw-btn', 'dice-stage', 'roll-btn'].forEach((id) => { if (!tool.includes(`id="${id}"`)) bad(`${tag} 도구 화면에 #${id} 없음`); });
      [1, 2, 3].forEach((n) => { if (!tool.includes(`data-dice="${n}"`)) bad(`${tag} 주사위 개수 버튼 ${n} 없음`); });
      if (!/id="name-a"[^>]*maxlength="12"[^>]*value="[^"]+"/.test(tool) || !tool.includes(`value="${G.esc(T.tool.sideA)}"`) || !tool.includes(`value="${G.esc(T.tool.sideB)}"`)) bad(`${tag} 이름 입력칸에 기본 면 이름·maxlength 12 가 없음`);
      if (!/role="tablist"/.test(tool) || !/role="tab"[^>]*aria-selected="true"/.test(tool)) bad(`${tag} 탭 접근성(role=tablist/tab) 없음`);
      const nameAt = result.indexOf('id="res-name"');
      const endAt = result.indexOf('<div data-mg-end="coinflip"></div>');
      if (!(nameAt > 0 && endAt > nameAt)) bad(`${tag} 결과: 결과 → data-mg-end="coinflip" 순서가 아님`);
      if ((result.match(/id="res-name"/g) || []).length !== 1) bad(`${tag} 결과 이름은 하나`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-title', 'res-coin', 'res-dice', 'res-sum', 'tally-count', 'tally-sides', 'again-btn', 'change-btn'].forEach((id) => { if (!result.includes(`id="${id}"`)) bad(`${tag} 결과 화면에 #${id} 없음`); });
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('coinflip-core.js') < 0 || html.indexOf('coinflip-core.js') > html.indexOf('coinflip.js"')) bad(`${tag} coinflip-core.js 가 coinflip.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://coinflip.example.com/</loc>') || !sm.includes('<loc>https://coinflip.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지: coinflip.js 에 한글·일본어 등 사람 문구가 없는지 (주석 제외)
  const js = fs.readFileSync(path.join(SITE, 'coinflip.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('coinflip.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 2 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("coinflip.js: track('start') 는 동전·주사위 각 1곳(2), track('done') 은 결과 1곳");
  if (/Math\.random/.test(js)) bad('coinflip.js 가 Math.random 을 씀 (crypto 만)');
  const core = fs.readFileSync(path.join(SITE, 'coinflip-core.js'), 'utf8');
  if (!/getRandomValues/.test(core)) bad('coinflip-core.js 에 crypto.getRandomValues 없음');
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
  if (APP.id !== 'coinflip' || APP.category !== 'vote' || APP.path !== 'https://coinflip.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
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
console.log(`\n동전·주사위 로직·공정성(crypto 10만 회) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 동전·주사위 로직·공정성(crypto), 언어 파일 12개(키·자리표시자·복수형·기본 면 이름·FAQ·제목·번역), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), OG 이미지 모두 OK');
