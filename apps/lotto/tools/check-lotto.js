#!/usr/bin/env node
/**
 * 로또 번호 생성기 검사.
 *   1) 로직(lotto-core.js): 프리셋 설정, 공정성(crypto 거부 샘플링 통계), 고정·제외 번호 규칙, 정렬·중복 없음, 입력 파싱, 색 구간, 복사 문장.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, 무료·인기순 질문 금지,
 *      "당첨 확률 올려 줘요" 류 주장 없음), 오락용 안내, 제목·설명 길이, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(맨 끝 mg-ad-start 1개, 번호 없음) / 도구 화면 mg-ad 1개 뽑기 버튼 아래 /
 *      결과 → data-mg-end="lotto" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-lotto.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'lotto-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

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



const problems = [];
const bad = (m) => problems.push(m);
// 보이는 글자 수 (태국어 윗·아랫 기호는 세지 않는다)
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
  const strictAsc = (a) => a.every((v, i) => !i || a[i - 1] < v);
  // 프리셋·직접 정하기
  eq(CORE.configFor('kr'), { preset: 'kr', pick: 6, max: 45, xPick: 0, xMax: 0 }, 'kr 설정');
  eq(CORE.configFor('euro'), { preset: 'euro', pick: 5, max: 50, xPick: 2, xMax: 12 }, 'euro 설정');
  eq(CORE.configFor('us'), { preset: 'us', pick: 5, max: 69, xPick: 1, xMax: 26 }, 'us 설정');
  eq(CORE.configFor('custom', { pick: 3, max: 20 }), { preset: 'custom', pick: 3, max: 20, xPick: 0, xMax: 0 }, 'custom 설정');
  const bigC = CORE.configFor('custom', { pick: 99, max: 5 });
  if (!(bigC.pick < bigC.max && bigC.pick >= 1 && bigC.max >= 2)) bad(`custom 범위 보정 실패 ${JSON.stringify(bigC)}`);
  const hugeC = CORE.configFor('custom', { pick: 4, max: 5000 });
  if (hugeC.max > 100) bad('custom max 상한(100) 없음');
  eq(CORE.configFor('custom', { pick: 'x', max: 'y' }).pick >= 1, true, 'custom 숫자 아님');
  eq([CORE.clampGames(0), CORE.clampGames(3), CORE.clampGames(9), CORE.clampGames('5'), CORE.clampGames(NaN)], [1, 3, 1, 5, 1], 'clampGames');
  // 입력 파싱
  eq(CORE.parseNumbers('7, 21  7;3', 45), { list: [3, 7, 21], bad: 0 }, 'parseNumbers 정렬·중복 제거');
  eq(CORE.parseNumbers('0 46 abc 5', 45), { list: [5], bad: 3 }, 'parseNumbers 범위 밖·문자');
  eq(CORE.parseNumbers('', 45), { list: [], bad: 0 }, 'parseNumbers 빈 입력');
  eq(CORE.parseNumbers('-3 4.5', 45).bad >= 1, true, 'parseNumbers 음수·소수');
  // 검사
  eq(CORE.validate(CORE.configFor('kr'), [7], [7]).code, 'overlap', 'validate overlap');
  eq(CORE.validate(CORE.configFor('kr'), [1, 2, 3, 4, 5, 6, 7], []).code, 'tooManyFixed', 'validate 고정이 너무 많음');
  eq(CORE.validate(CORE.configFor('kr'), [], range(1, 41)).code, 'notEnough', 'validate 제외가 너무 많음');
  eq(CORE.validate(CORE.configFor('kr'), [], range(1, 39)).ok, true, 'validate 딱 6개 남음');
  // 주입한 난수: 항상 0 → 가장 앞 번호
  const g0 = CORE.drawGame(CORE.configFor('kr'), [], [], () => 0);
  eq(g0.main, [1, 2, 3, 4, 5, 6], '난수 0 이면 1~6');
  // 구조: 정렬·중복 없음·범위·개수, 고정 포함·제외 없음 (2000판씩)
  [['kr', [], []], ['euro', [], []], ['us', [], []], ['kr', [7, 21], [4, 13]], ['us', [1, 2, 3, 4, 5], []], ['kr', [], range(1, 39)], ['custom', [3], [1, 2]]].forEach(([p, fx, ex]) => {
    const cfg = CORE.configFor(p, { pick: 4, max: 12 });
    for (let i = 0; i < 2000; i++) {
      const g = CORE.drawGame(cfg, fx, ex);
      if (g.main.length !== cfg.pick || !strictAsc(g.main) || g.main.some((n) => n < 1 || n > cfg.max || !Number.isInteger(n))) { bad(`${p}: 본 번호 구조 이상 ${JSON.stringify(g)}`); break; }
      if (fx.some((n) => g.main.indexOf(n) < 0)) { bad(`${p}: 고정 번호가 빠짐 ${JSON.stringify(g)}`); break; }
      if (ex.some((n) => g.main.indexOf(n) >= 0)) { bad(`${p}: 제외 번호가 나옴 ${JSON.stringify(g)}`); break; }
      if (g.extra.length !== cfg.xPick || !strictAsc(g.extra) || g.extra.some((n) => n < 1 || n > cfg.xMax)) { bad(`${p}: 보너스 번호 구조 이상 ${JSON.stringify(g)}`); break; }
      if (eqSet(g.order, g.main) === false) { bad(`${p}: order 와 main 집합이 다름`); break; }
    }
  });
  eq(CORE.drawGames(CORE.configFor('kr'), 9, [], []).length, 1, 'drawGames 개수 범위 밖 = 1');
  eq(CORE.drawGames(CORE.configFor('kr'), 5, [], []).length, 5, 'drawGames 5');
  // 공정성: kr 6/45 — 각 번호가 뽑힐 확률 6/45, 60000판 ±1.2%p
  const N = 60000; const hit = new Array(46).fill(0);
  for (let i = 0; i < N; i++) CORE.drawGame(CORE.configFor('kr'), [], []).main.forEach((n) => hit[n]++);
  for (let n = 1; n <= 45; n++) if (Math.abs(hit[n] / N - 6 / 45) > 0.012) bad(`공정성: 번호 ${n} 비율 ${(hit[n] / N).toFixed(4)} (0.1333)`);
  // 공정성: 제외·고정이 있어도 남은 번호는 고르게 (kr, 고정 7, 제외 1~5 → 나머지 5개를 39개 중에서)
  const h2 = new Array(46).fill(0); const M = 50000;
  for (let i = 0; i < M; i++) CORE.drawGame(CORE.configFor('kr'), [7], [1, 2, 3, 4, 5]).main.forEach((n) => h2[n]++);
  for (let n = 6; n <= 45; n++) if (n !== 7 && Math.abs(h2[n] / M - 5 / 39) > 0.012) bad(`공정성(고정·제외): 번호 ${n} 비율 ${(h2[n] / M).toFixed(4)} (0.1282)`);
  // cryptoInt 범위·치우침
  for (const max of [1, 2, 3, 45, 69, 100]) {
    for (let i = 0; i < 2000; i++) { const v = CORE.cryptoInt(max); if (!(v >= 0 && v < max && Number.isInteger(v))) { bad(`cryptoInt(${max}) 범위 밖 ${v}`); break; } }
  }
  const c3 = [0, 0, 0];
  for (let i = 0; i < 30000; i++) c3[CORE.cryptoInt(3)]++;
  c3.forEach((c, i) => { if (Math.abs(c / 30000 - 1 / 3) > 0.015) bad(`cryptoInt(3) 치우침 ${i}: ${c}`); });
  // 색 구간 (한국 로또)
  eq([1, 10, 11, 20, 21, 30, 31, 40, 41, 45, 46, 51].map(CORE.colorIndex), [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 0], '색 구간');
  eq(CORE.pad(3) + CORE.pad(12), '0312', 'pad');
  eq(CORE.gamesText([{ main: [3, 11, 24, 27, 38, 41], extra: [] }, { main: [1, 2, 3, 4, 5], extra: [7, 12] }]), 'A  03 11 24 27 38 41\nB  01 02 03 04 05 + 07 12', '복사 문장');
}
function range(a, b) { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; }
function eqSet(a, b) { return a.length === b.length && a.slice().sort((x, y) => x - y).every((v, i) => v === b[i]); }

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
    if (lang !== 'en') {
      ['meta.title', 'start.hook', 'result.again', 'tool.fixedLabel', 'tool.draw'].forEach((p) => {
        const get = (o) => p.split('.').reduce((a, k) => a[k], o);
        if (get(T) === get(EN)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`);
      });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 문구 길이 (360px 버튼·칩)
    ['draw', 'drawing'].forEach((k) => { if (len(T.tool[k]) > 26) bad(`${tag} tool.${k} 가 김`); });
    ['kr', 'euro', 'us', 'custom'].forEach((k) => { if (len(T.tool.presets[k]) > 24) bad(`${tag} tool.presets.${k} 가 김 (칩 2열)`); if (!T.tool.presetInfo[k]) bad(`${tag} presetInfo.${k} 없음`); });
    ['copy', 'again', 'change'].forEach((k) => { if (len(T.result[k]) > 26) bad(`${tag} result.${k} 가 김`); });
    if (!T.result.extraNames.euro || !T.result.extraNames.us) bad(`${tag} extraNames 없음`);
    // 오락용 안내 (도구 화면·결과 화면·FAQ) — 당첨 확률 주장 금지
    if (!T.tool.note || !T.result.disclaimer) bad(`${tag} 오락용 안내(tool.note / result.disclaimer) 없음`);
    if (!T.faq.some((f) => /^\s*\S/.test(f.a) && /(crypto\.getRandomValues)/.test(f.a))) bad(`${tag} FAQ 에 공정성(crypto.getRandomValues) 설명 없음`);
    // 시작 문구
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker.split(' · ')[0])) bad(`${tag} h1 검색어(start.h1Kicker)가 제목과 다름`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (/\d+(\.\d+)?\s?%|1\s?(in|:|\/)\s?\d{3,}|[0-9]{1,3}(,[0-9]{3}){2,}/.test(JSON.stringify([T.meta, T.start, T.tool, T.result, T.faq]).replace(/\d+\/\d+/g, ''))) bad(`${tag} 당첨 확률·퍼센트 같은 수치가 있음 (확률 주장 금지)`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 44 : 78)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 140 : 240)) bad(`${tag} meta.description 길이 ${dl}`);
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
  if (!/<link rel="canonical" href="https:\/\/lotto\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/lotto\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|<input|id="draw-btn"|lt-game|lt-ball">\d/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/도구 UI/결과`);
      if (/<span class="lt-ball[^>]*>\d/.test(start)) bad(`${tag} 시작 화면 공에 번호가 있음 (티징만)`);
      if (!/<h1 class="lt-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 도구 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if (tool.indexOf('class="mg-ad"') < tool.indexOf('id="draw-btn"')) bad(`${tag} 도구 화면 광고는 뽑기 버튼 아래`);
      ['preset-info', 'custom-box', 'custom-pick', 'custom-max', 'fixed-in', 'exclude-in', 'tool-error', 'machine', 'draw-btn'].forEach((id) => { if (!tool.includes(`id="${id}"`)) bad(`${tag} 도구 화면에 #${id} 없음`); });
      ['kr', 'euro', 'us', 'custom'].forEach((p) => { if (!tool.includes(`data-preset="${p}"`)) bad(`${tag} 프리셋 버튼 ${p} 없음`); });
      [1, 2, 3, 4, 5].forEach((n) => { if (!tool.includes(`data-games="${n}"`)) bad(`${tag} 게임 수 버튼 ${n} 없음`); });
      if (!/role="radiogroup"/.test(tool) || !/role="radio"[^>]*aria-checked="true"/.test(tool)) bad(`${tag} 라디오 접근성(role=radiogroup/radio) 없음`);
      if (!tool.includes(G.esc(T.tool.note))) bad(`${tag} 도구 화면에 오락용 안내(tool.note) 없음`);
      if (!/id="custom-box"[^>]*hidden/.test(tool)) bad(`${tag} 직접 정하기 칸은 처음에 hidden`);
      const gamesAt = result.indexOf('id="res-games"');
      const endAt = result.indexOf('<div data-mg-end="lotto"></div>');
      if (!(gamesAt > 0 && endAt > gamesAt)) bad(`${tag} 결과: 결과 → data-mg-end="lotto" 순서가 아님`);
      if (!result.includes(G.esc(T.result.disclaimer))) bad(`${tag} 결과 화면에 오락용 안내(result.disclaimer) 없음`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-title', 'res-games', 'copy-btn', 'again-btn', 'change-btn'].forEach((id) => { if (!result.includes(`id="${id}"`)) bad(`${tag} 결과 화면에 #${id} 없음`); });
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('lotto-core.js') < 0 || html.indexOf('lotto-core.js') > html.indexOf('lotto.js"')) bad(`${tag} lotto-core.js 가 lotto.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://lotto.example.com/</loc>') || !sm.includes('<loc>https://lotto.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지
  const js = fs.readFileSync(path.join(SITE, 'lotto.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('lotto.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("lotto.js: track('start') 와 track('done') 은 각 1곳");
  if (/Math\.random/.test(js)) bad('lotto.js 가 Math.random 을 씀 (crypto 만)');
  const core = fs.readFileSync(path.join(SITE, 'lotto-core.js'), 'utf8');
  if (!/getRandomValues/.test(core)) bad('lotto-core.js 에 crypto.getRandomValues 없음');
  if (/Math\.random\(\)/.test(core.replace(/\/\*[\s\S]*?\*\//g, '').replace(/if \(!c\) return Math\.floor\(Math\.random\(\) \* max\);/, ''))) bad('lotto-core.js 가 crypto 없는 환경 대비 외에 Math.random 을 씀');
  // 스포일러·확률 주장: 생성 HTML 에 확률 표기 없음
  const idx = read('index.html');
  if (/jackpot|1 in \d|당첨 확률 [0-9]/i.test(idx.replace(/<script[\s\S]*?<\/script>/g, ''))) bad('index.html 에 당첨 확률·잭팟 문구');
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
  if (APP.id !== 'lotto' || APP.category !== 'vote' || APP.path !== 'https://lotto.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
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
console.log(`\n로또 로직·공정성(crypto) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 로또 로직·공정성(crypto)·고정/제외 규칙, 언어 파일 12개(키·자리표시자·FAQ·오락용 안내·제목·번역), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), OG 이미지 모두 OK');
