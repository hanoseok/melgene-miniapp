#!/usr/bin/env node
/**
 * 오늘 뭐 먹지 메뉴 뽑기 검사.
 *   1) 로직(lunch-core.js): 메뉴 문자열 읽기(잘못된 모양 거부), 후보(끼니·기분 태그 "하나라도"·제외), 끼니 × 기분 모든 조합에서 후보 ≥ 1,
 *      기본 끼니(시각), 릴 띠(길이·마지막 칸·이웃 중복 없음), 공정성(crypto 뽑기: 후보가 모두 고르게), cryptoInt 범위·고르게.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 메뉴 30개 이상(끼니마다 충분 · 중복 없음 · 이름 22자 이하 ·
 *      모든 끼니 × 기분에 1개 이상 · 한국어 파일 밖에 한글 없음), count 복수형, FAQ 3~5개(공정성 언급, "무료인가요?" 류 금지), 제목·설명 길이, fr 좁은 공백, ru 키릴 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나(검색어) / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(vote) / FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(FAQ·고르기 UI 없음, 맨 끝 mg-ad-start 1개) / 그 밖 mg-ad 페이지 전체 1개 = 고르기 화면 뽑기 버튼 아래 /
 *      결과: 뽑힌 메뉴 하나(#res-name) → data-mg-end="lunch" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서, 후보 목록을 HTML 에 펼치지 않음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-lunch.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'lunch-core.js'));
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
  eq(CORE.parseMenu('Ramen|🍜|ldn|hs'), { name: 'Ramen', emoji: '🍜', meals: 'ldn', tags: 'hs' }, 'parseMenu 정상');
  eq(CORE.parseMenu(' 김밥 | 🍙 | bl | lo '), { name: '김밥', emoji: '🍙', meals: 'bl', tags: 'lo' }, 'parseMenu 공백');
  ['', 'a|b|c', 'a||l|h', '|x|l|h', 'a|x|z|h', 'a|x|l|q', 'a|x|l|h|extra'].forEach((s) => { if (CORE.parseMenu(s)) bad(`parseMenu 가 잘못된 모양을 받음: "${s}"`); });
  eq(CORE.parseMenus(['a|x|l|h', 'broken', 'b|y|d|']).length, 2, 'parseMenus 가 깨진 줄 건너뜀');
  eq(CORE.defaultMeal(7) + CORE.defaultMeal(12) + CORE.defaultMeal(18) + CORE.defaultMeal(23) + CORE.defaultMeal(3), 'bldnn', '기본 끼니');

  const M = CORE.parseMenus(['a|x|b|h', 'b|x|l|hs', 'c|x|ld|l', 'd|x|dn|o', 'e|x|l|']);
  eq(CORE.pool(M, 'l', [], null), [1, 2, 4], '점심 후보');
  eq(CORE.pool(M, 'l', ['s'], null), [1], '점심 + 매운');
  eq(CORE.pool(M, 'l', ['s', 'l'], null), [1, 2], '태그 여러 개 = 하나라도');
  eq(CORE.pool(M, 'l', [], { 1: true }), [2, 4], '제외');
  eq(CORE.pool(M, 'n', ['o'], null), [3], '야식 + 혼밥');
  eq(CORE.pool(M, 'b', ['s'], null), [], '후보 없음');
  eq(CORE.pickOne([], seeded(1)), -1, '빈 후보 pickOne');

  // 릴 띠
  const ri = seeded(7);
  for (let t = 0; t < 300; t++) {
    const list = Array.from({ length: 1 + (t % 8) }, (_, i) => i);
    const final = list[ri(list.length)];
    const s = CORE.strip(list, final, 24, ri);
    if (s.length !== 24 || s[23] !== final) { bad('릴 띠 길이/마지막 칸'); break; }
    if (list.length > 1 && s.some((v, i) => i && v === s[i - 1])) { bad(`릴 띠에 이웃 중복 (후보 ${list.length}개)`); break; }
    if (s.some((v) => list.indexOf(v) < 0)) { bad('릴 띠에 후보 밖 메뉴'); break; }
  }

  // 공정성: 후보 5개를 50000번 뽑아 각각 ±5% 안
  const list = [3, 5, 8, 9, 12];
  const cnt = {};
  const N = 50000;
  for (let i = 0; i < N; i++) { const v = CORE.pickOne(list); cnt[v] = (cnt[v] || 0) + 1; }
  list.forEach((v) => { const p = (cnt[v] || 0) / N; if (Math.abs(p - 0.2) > 0.012) bad(`공정성: 후보 ${v} 비율 ${p.toFixed(4)} (0.2)`); });
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
    delete sh.count; delete sh.menus; const enS = { ...enShape }; delete enS.count; delete enS.menus;
    keysDiff(enS, sh, '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => { if (p.startsWith('count.') || p.startsWith('privacy.') || p.startsWith('faq.') || p.startsWith('menus.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    // 후보 개수 복수형
    if (!T.count || !T.count.other) bad(`${tag} count.other 없음`);
    else {
      Object.entries(T.count).forEach(([c, s]) => { if (!/\{n\}/.test(s)) bad(`${tag} count.${c} 에 {n} 없음`); });
      if (lang === 'ru') {
        ['one', 'few', 'many'].forEach((c) => { if (!T.count[c]) bad(`${tag} count.${c} 없음`); });
        const pr = new Intl.PluralRules('ru');
        const want = { 1: 'блюдо', 2: 'блюда', 5: 'блюд', 21: 'блюдо', 22: 'блюда', 11: 'блюд' };
        Object.entries(want).forEach(([n, w]) => { const s = G.fmt(T.count[pr.select(Number(n))] || T.count.other, { n }); if (!s.endsWith(` ${w}`)) bad(`${tag} 복수형 ${n}: "${s}"`); });
      }
    }
    // 메뉴
    const raw = T.menus;
    if (!Array.isArray(raw)) { bad(`${tag} menus 배열 아님`); return; }
    const menus = CORE.parseMenus(raw);
    if (menus.length !== raw.length) bad(`${tag} menus 중 모양이 틀린 줄 ${raw.length - menus.length}개 ('이름|이모지|끼니|기분')`);
    if (menus.length < 30) bad(`${tag} 메뉴 ${menus.length}개 (30개 이상)`);
    const names = menus.map((m) => m.name);
    if (new Set(names).size !== names.length) bad(`${tag} 메뉴 이름 중복`);
    menus.forEach((m) => {
      if (len(m.name) > CORE.MAX_NAME) bad(`${tag} 메뉴 이름이 김 (${len(m.name)}자): ${m.name}`);
      if (/[|<>{}]/.test(m.name)) bad(`${tag} 메뉴 이름에 구분 문자: ${m.name}`);
      if (new Set(m.meals).size !== m.meals.length || new Set(m.tags).size !== m.tags.length) bad(`${tag} ${m.name}: 끼니·기분 글자 중복`);
    });
    const minMeal = { b: 8, l: 15, d: 15, n: 8 };
    CORE.MEALS.forEach((meal) => {
      const n = menus.filter((m) => m.meals.includes(meal)).length;
      if (n < minMeal[meal]) bad(`${tag} 끼니 ${meal} 메뉴 ${n}개 (${minMeal[meal]}개 이상)`);
      CORE.TAGS.forEach((t) => { if (!CORE.pool(menus, meal, [t], null).length) bad(`${tag} 끼니 ${meal} × 기분 ${t} 에 맞는 메뉴 없음`); });
    });
    // 같은 이모지만 복붙한 목록이 아닌지(언어마다 다른 음식): en 과 이름이 같은 메뉴가 절반 넘으면 경고
    if (lang !== 'en') {
      const en = new Set(CORE.parseMenus(EN.menus).map((m) => m.name));
      const same = names.filter((n) => en.has(n)).length;
      if (same > names.length / 2) bad(`${tag} 메뉴가 en 사본에 가깝다 (${same}/${names.length}) — 그 나라 음식으로`);
    }
    seenMenus[lang] = menus.length;
    // 시작 문구
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker.split(' · ')[0])) bad(`${tag} h1 검색어(start.h1Kicker)가 제목과 다름`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
    // pick.meals / tags
    CORE.MEALS.forEach((k) => { if (!T.pick.meals[k] || len(T.pick.meals[k]) > 16) bad(`${tag} pick.meals.${k} 가 없거나 김`); });
    CORE.TAGS.forEach((k) => { if (!T.pick.tags[k] || len(T.pick.tags[k]) > 16) bad(`${tag} pick.tags.${k} 가 없거나 김`); });
    ['again', 'exclude', 'change'].forEach((k) => { if (len(T.result[k]) > 22) bad(`${tag} result.${k} 가 김`); });
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
  if (!/<link rel="canonical" href="https:\/\/lunch\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/lunch\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const pick = section(html, 'screen-pick');
      const result = section(html, 'screen-result');
      if (!start || !pick || !result) { bad(`${tag} 시작/고르기/결과 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-pick"[^>]*hidden/.test(html) || !/<section id="screen-result"[^>]*hidden/.test(html)) bad(`${tag} 고르기·결과 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/data-mg-end|mg-faq|<details|data-meal|data-tag|id="reel"|lc-res/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/고르기 UI/결과`);
      if (!/<h1 class="lc-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      // 후보 메뉴 목록을 보이는 HTML 에 펼치지 않는다(메뉴 이름은 PAGE_I18N 안에만)
      const shown = CORE.parseMenus(T.menus).filter((m) => m.name.length > 2 && bodyNoJson.includes(G.esc(m.name)));
      if (shown.length) bad(`${tag} 보이는 HTML 에 메뉴 이름이 있음: ${shown.slice(0, 3).map((m) => m.name).join(', ')}`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 고르기 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if ((pick.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 고르기 화면 mg-ad 는 1개`);
      if (pick.indexOf('class="mg-ad"') < pick.indexOf('id="spin-btn"')) bad(`${tag} 고르기 화면 광고는 뽑기 버튼 아래`);
      CORE.MEALS.forEach((m) => { if (!pick.includes(`data-meal="${m}"`)) bad(`${tag} 끼니 버튼 ${m} 없음`); });
      CORE.TAGS.forEach((t) => { if (!pick.includes(`data-tag="${t}"`)) bad(`${tag} 기분 버튼 ${t} 없음`); });
      ['cand-count', 'ex-line', 'ex-reset', 'reel', 'reel-strip', 'spin-btn', 'pick-note'].forEach((id) => { if (!pick.includes(`id="${id}"`)) bad(`${tag} 고르기 화면에 #${id} 없음`); });
      const nameAt = result.indexOf('id="res-name"');
      const endAt = result.indexOf('<div data-mg-end="lunch"></div>');
      if (!(nameAt > 0 && endAt > nameAt)) bad(`${tag} 결과: 뽑힌 메뉴 → data-mg-end="lunch" 순서가 아님`);
      if ((result.match(/id="res-name"/g) || []).length !== 1) bad(`${tag} 결과 메뉴 이름은 하나`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-emoji', 'res-meal', 'again-btn', 'exclude-btn', 'change-btn'].forEach((id) => { if (!result.includes(`id="${id}"`)) bad(`${tag} 결과 화면에 #${id} 없음`); });
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('lunch-core.js') < 0 || html.indexOf('lunch-core.js') > html.indexOf('lunch.js"')) bad(`${tag} lunch-core.js 가 lunch.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://lunch.example.com/</loc>') || !sm.includes('<loc>https://lunch.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지: lunch.js 에 한글·일본어 등 사람 문구가 없는지 (주석 제외)
  const js = fs.readFileSync(path.join(SITE, 'lunch.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('lunch.js 에 언어 문구가 있음 (tools/i18n 으로)');
  // 시작·끝 기록
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("lunch.js: track('start')·track('done') 는 각각 한 군데");
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
  if (APP.id !== 'lunch' || APP.category !== 'vote' || APP.path !== 'https://lunch.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
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
console.log(`\n후보·릴 띠·공정성(crypto 50000회) · 언어 파일 ${G.LOCALES.length}개(메뉴 ${Object.values(menuCounts).join('/')}개) · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 메뉴 읽기·후보(끼니·기분·제외)·릴 띠·공정성(crypto), 언어 파일 12개(키·자리표시자·복수형·메뉴 30개 이상·끼니×기분 빈틈 없음·FAQ·제목), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), OG 이미지 모두 OK');
