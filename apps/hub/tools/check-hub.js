#!/usr/bin/env node
/**
 * 미니앱 포털(apps/hub) 검사 — 11개 언어.
 *   1) 언어 파일 구조: en 과 같은 키·타입·배열 길이, 자리표시자({n} {q} {avg} {votes}), 금지 키(hero/about) 없음
 *   2) 브랜드: brand.word = Melgene, brand.badge = 공통 STRINGS.<lang>.brandBadge, siteName = G.brandOf(lang)
 *   3) SEO(스킬 7번): <title> = 현지 검색어 + " | " + 브랜드, 길이, 메타 설명 길이, h1 = 검색어, FAQ 4~6개
 *   4) 스포일러 금지: 큐레이션·FAQ 문구에 "A vs B" 식 질문 인용이 없는지
 *   5) hub-core: compact()(언어별 줄임 표기, 절대 부풀리지 않음) · sortApps(인기순 = 서버 score)
 *   6) 생성된 HTML: 언어 폴더·<html lang>, h1 1개, mg-ad 1개, JSON-LD = WebSite + ItemList + FAQPage,
 *      앱용 별점/공유/끝 화면 없음, 히어로·소개 섹션 없음, 브랜드 링크 = 같은 언어 포털 홈, 언어 select 11개, 글꼴 링크
 *   7) 360px 폭 글자 길이 추정(정적) — 헤드라인 줄 수, 키커·버튼·배지 한 줄
 *   8) --layout: Chrome headless 로 실제 페이지를 360·375px 에서 열어 넘침·겹침·잘림을 잰다(네트워크 필요)
 *
 * 실행: node apps/hub/tools/check-hub.js            (1~7)
 *       node apps/hub/tools/check-hub.js --layout   (+ 8)
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'hub-core.js'));

const SITE_DIR = path.join(__dirname, '..');
const LANGS = G.LOCALES.map((l) => l.code);
const L10N = G.loadSiteLocales(SITE_DIR);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(SITE_DIR, '..', '..', 'shared', 'site.config.js'), 'utf8'), sandbox);
const SITES = sandbox.window.SITE_CONFIG.SITES || [];
const SITE_IDS = new Set(SITES.map((s) => s.id));

const errors = [];
const warns = [];
let checks = 0;
function ok(cond, msg) { checks++; if (!cond) errors.push(msg); return cond; }
function warn(cond, msg) { if (!cond) warns.push(msg); }

// ---------------------------------------------------------------- 1) 구조
function shape(v, p, out) {
  if (Array.isArray(v)) {
    out[p] = `array`;
    v.forEach((x, i) => shape(x, `${p}[${Array.isArray(x) ? i : '*'}]`, out));
  } else if (v && typeof v === 'object') {
    out[p] = 'object';
    Object.keys(v).forEach((k) => shape(v[k], p ? `${p}.${k}` : k, out));
  } else out[p] = typeof v;
  return out;
}
const OPTIONAL = new Set(['typography.fonts', 'typography.sans']); // 언어마다 다를 수 있는 키
const ref = shape(L10N.en, '', {});
LANGS.forEach((lang) => {
  const T = L10N[lang];
  const sh = shape(T, '', {});
  Object.keys(ref).forEach((k) => { if (!OPTIONAL.has(k)) ok(sh[k] === ref[k], `[${lang}] 키 없음/타입 다름: ${k} (en: ${ref[k]}, ${lang}: ${sh[k]})`); });
  Object.keys(sh).forEach((k) => { if (!OPTIONAL.has(k)) ok(ref[k] !== undefined, `[${lang}] en 에 없는 키: ${k}`); });
  ['hero', 'about', 'meta.descriptionTpl'].forEach((k) => ok(!k.split('.').reduce((o, x) => (o ? o[x] : undefined), T), `[${lang}] 없어야 하는 키(스킬 7번 포털): ${k}`));
  ok(T.privacy.sections.length === L10N.en.privacy.sections.length, `[${lang}] privacy.sections 개수 ${T.privacy.sections.length}`);
  ok(T.curation.items.length >= 3 && T.curation.items.length <= 6, `[${lang}] curation.items 3~6개`);
  const ids = T.curation.items.map((i) => i.id);
  ok(new Set(ids).size === ids.length, `[${lang}] curation id 중복`);
  ids.forEach((id) => ok(SITE_IDS.has(id), `[${lang}] curation id 가 SITES 에 없음: ${id}`));
  ['all', ...CORE.CATS].forEach((c) => ok(!!T.ui.cats[c], `[${lang}] ui.cats.${c} 없음`));
  // 자리표시자
  const need = { count: ['n'], plays: ['n'], goTo: ['n'], ratingAria: ['avg', 'votes'], emptySearch: ['q'], totalHtml: ['n'] };
  Object.entries(need).forEach(([k, vars]) => vars.forEach((v) => ok(String(T.ui[k]).includes(`{${v}}`), `[${lang}] ui.${k} 에 {${v}} 없음`)));
  ok(/<strong>[^<]*\{n\}[^<]*<\/strong>/.test(T.ui.totalHtml), `[${lang}] ui.totalHtml 은 <strong>{n}…</strong> 모양이어야 한다`);
  ok(!/<(?!\/?strong>)/.test(T.ui.totalHtml), `[${lang}] ui.totalHtml 에 strong 말고 다른 태그`);
  ok(!/\{\w+\}/.test(T.ui.countOne), `[${lang}] ui.countOne 에 자리표시자가 남음`);
});

// ---------------------------------------------------------------- 2) 브랜드
const STRINGS = G.STRINGS;
LANGS.forEach((lang) => {
  const T = L10N[lang];
  ok(T.brand.word === 'Melgene', `[${lang}] brand.word ≠ Melgene`);
  ok(T.brand.badge === STRINGS[lang].brandBadge, `[${lang}] brand.badge "${T.brand.badge}" ≠ 공통 타이틀 바 배지 "${STRINGS[lang].brandBadge}"`);
  ok(T.siteName === G.brandOf(lang), `[${lang}] siteName "${T.siteName}" ≠ G.brandOf "${G.brandOf(lang)}"`);
  ok(T.privacy.title.endsWith(' | ' + G.brandOf(lang)), `[${lang}] privacy.title 은 " | 브랜드" 로 끝나야 한다`);
  ok(!/오늘의 테스트/.test(JSON.stringify(T)), `[${lang}] 금지된 브랜드 표현`);
});

// ---------------------------------------------------------------- 3) SEO
// 표시 폭 단위: 한중일 글자 = 2, 태국 결합 문자 = 0, 그 밖 = 1 (Google 스니펫 픽셀 폭 근사)
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const TH_MARK = /[ัิ-ฺ็-๎]/;
function units(str) {
  let u = 0;
  for (const ch of String(str)) u += WIDE.test(ch) ? 2 : TH_MARK.test(ch) ? 0 : 1;
  return u;
}
const norm = (s) => String(s).normalize('NFKC').toLowerCase().replace(/[\s·・,&]+/g, ' ').trim();
LANGS.forEach((lang) => {
  const T = L10N[lang];
  const M = T.meta;
  const brand = G.brandOf(lang);
  ok(M.title.endsWith(' | ' + brand), `[${lang}] <title> 은 "검색어 | ${brand}" 모양이어야 한다: ${M.title}`);
  const head = M.title.slice(0, M.title.length - (' | ' + brand).length);
  ok(units(M.title) <= 64, `[${lang}] <title> 이 길다 (${units(M.title)} 폭 > 64): ${M.title}`);
  ok(units(M.description) >= 105 && units(M.description) <= 170, `[${lang}] 메타 설명 길이 ${units(M.description)} 폭 (105~170): ${M.description}`);
  ok(units(M.ogDescription) <= 180, `[${lang}] og:description 이 길다`);
  ok(!!T.h1 && norm(head).includes(norm(T.h1)), `[${lang}] h1 "${T.h1}" 이 title 검색어 "${head}" 에 없다`);
  ok(T.faq.length >= 4 && T.faq.length <= 6, `[${lang}] FAQ 4~6개 (지금 ${T.faq.length})`);
  T.faq.forEach(([q, a], i) => {
    ok(/[?？]$/.test(q.trim()), `[${lang}] FAQ ${i + 1} 질문이 물음표로 끝나지 않음`);
    ok(units(a) <= 360, `[${lang}] FAQ ${i + 1} 답이 길다 (${units(a)} 폭)`);
  });
  const faqText = T.faq.map((x) => x.join(' ')).join(' ');
  ok(/[Mm]elgene|멜진|メルジン/.test(faqText), `[${lang}] FAQ 에 브랜드 이름이 없다`);
});

// ---------------------------------------------------------------- 4) 스포일러 금지 (가벼운 패턴 검사)
LANGS.forEach((lang) => {
  const T = L10N[lang];
  const txt = [...T.curation.items.map((i) => `${i.kicker} ${i.headline} ${i.blurb}`), ...T.faq.map((x) => x.join(' '))].join('\n');
  ok(!/\bvs\.?\b|\bVS\b|対|대\s|versus/i.test(txt), `[${lang}] "A vs B" 식 질문 인용 의심`);
  ok(!/16\s*(가지|種|种|past lives|vies|Leben|แบบ|kiếp|vidas)/i.test(txt), `[${lang}] 결과 개수·목록 언급 의심`);
});

// ---------------------------------------------------------------- 5) hub-core
const EXPECT = {
  en: { 999: '999', 1234: '1.2K', 12345: '12K', 1234567: '1.2M', 123456789: '123M' },
  ko: { 1234: '1,234', 12345: '1.2만', 123456: '12만', 123456789: '1.2억' },
  ja: { 12345: '1.2万', 123456: '12万', 123456789: '1.2億' },
  zh: { 12345: '1.2万', 12345678: '1234万', 123456789: '1.2亿' },
  fr: { 1234: '1 234', 12345: '12 k', 1234567: '1,2 M' },
  de: { 1234: '1.234', 12345: '12.345', 1234567: '1,2 Mio.' },
  th: { 1234: '1,234', 12345: '12K', 1234567: '1.2M' },
  vi: { 1234: '1.234', 12345: '12 N', 1234567: '1,2 Tr' },
  es: { 1234: '1234', 12345: '12 mil', 1234567: '1,2 M' },
  it: { 1234: '1234', 12345: '12.345', 1234567: '1,2 Mln' },
  pt: { 1234: '1.234', 12345: '12 mil', 1234567: '1,2 mi' },
};
LANGS.forEach((lang) => ok(!!EXPECT[lang], `[${lang}] compact 기대값 표 없음`));
Object.entries(EXPECT).forEach(([lang, table]) => {
  Object.entries(table).forEach(([n, want]) => {
    const got = CORE.compact(Number(n), lang);
    ok(got === want, `[${lang}] compact(${n}) = ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`);
  });
});
// 절대 부풀리지 않음 + 짧음: 표시값을 다시 숫자로 읽어 원래 값 이하인지
function parseBack(str, lang) {
  const F = CORE.FORMATS[lang];
  let s = String(str).replace(/[   ]/g, '');
  let mul = 1;
  const units = F.man ? [[1e8, F.man[1]], [1e4, F.man[0]]] : F.units;
  for (const [v, u] of units) { if (s.endsWith(u)) { mul = v; s = s.slice(0, -u.length); break; } }
  const dec = F.dec || '.';
  const group = dec === ',' ? /\./g : /,/g;
  s = s.replace(group, '');
  if (dec === ',') s = s.replace(',', '.');
  return parseFloat(s) * mul;
}
let rnd = 7;
const rand = () => ((rnd = (rnd * 1103515245 + 12345) % 2147483648) / 2147483648);
LANGS.forEach((lang) => {
  let prev = -1;
  for (let e = 0; e <= 10; e++) {
    for (let k = 0; k < 60; k++) {
      const n = Math.floor(Math.pow(10, e) * (1 + rand() * 9));
      const out = CORE.compact(n, lang);
      const back = parseBack(out, lang);
      if (!ok(back <= n + 1e-6, `[${lang}] compact(${n}) = ${out} 가 실제보다 크다`)) return;
      ok(back >= n * 0.89 || n < 10, `[${lang}] compact(${n}) = ${out} 가 너무 많이 줄었다`);
      ok([...out].length <= 8, `[${lang}] compact(${n}) = ${out} 가 너무 길다`);
    }
  }
  // 단조 증가(같은 자릿수 안에서 표시값이 줄지 않음)
  [0, 9, 99, 999, 9999, 10000, 99999, 100000, 999999, 1000000].forEach((n) => {
    const b = parseBack(CORE.compact(n, lang), lang);
    ok(b >= prev, `[${lang}] compact 가 단조 증가가 아니다 (${n})`);
    prev = b;
  });
});
// 인기순 = 서버 score → 하트 → 플레이 → 최신
(function () {
  const apps = [
    { id: 'a', order: 0, added: '2026-09-01' },
    { id: 'b', order: 1, added: '2026-09-02' },
    { id: 'c', order: 2, added: '2026-09-03' },
    { id: 'd', order: 3, added: '2026-09-04' },
  ];
  const stats = { a: { score: 10, hearts: 0, plays: 10 }, b: { score: 35, hearts: 2, plays: 5 }, c: { score: 10, hearts: 1, plays: 0 }, d: { score: 0 } };
  const got = CORE.sortApps(apps, stats, 'popular').map((x) => x.id).join('');
  ok(got === 'bcad', `sortApps popular = ${got} (기대 bcad: score → 하트 → 플레이 → 최신)`);
  ok(CORE.sortApps(apps, null, 'popular').map((x) => x.id).join('') === 'abcd', 'sortApps: 통계 모름이면 설정 순서');
  ok(CORE.sortApps(apps, stats, 'newest')[0].id === 'd', 'sortApps newest');
  const r = CORE.sortApps(apps, { a: { avg: 4.9, votes: 2 }, b: { avg: 4.1, votes: 3 }, c: { avg: 4.5, votes: 9 } }, 'rating').map((x) => x.id).join('');
  ok(r === 'cbad', `sortApps rating = ${r} (평가 3개 이상 먼저)`);
})();

// ---------------------------------------------------------------- 6) 생성된 HTML
function read(file) { const p = path.join(SITE_DIR, file); return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; }
LANGS.forEach((lang) => {
  const T = L10N[lang];
  ['index.html', 'privacy.html'].forEach((rel) => {
    const file = G.fileOf(lang, rel);
    const html = read(file);
    if (!ok(!!html, `[${lang}] ${file} 없음 (node apps/hub/tools/gen-i18n.js)`)) return;
    ok(new RegExp(`<html lang="${lang}"`).test(html), `[${lang}] ${file}: <html lang> 다름`);
    ok((html.match(/<h1[\s>]/g) || []).length === 1, `[${lang}] ${file}: <h1> 이 1개가 아니다`);
    ok(!/data-mg-(rating|social|end|heart)=/.test(html), `[${lang}] ${file}: 포털에 앱용 별점/공유/끝 화면이 있다`);
    ok(/<a class="brand" href="\.\/"/.test(html), `[${lang}] ${file}: 브랜드 링크가 같은 언어 포털 홈(./)이 아니다`);
    ok(html.includes(`<span class="brand-sub">${G.esc(T.brand.badge)}</span>`), `[${lang}] ${file}: 머리글 배지 없음`);
    ok((html.match(/<option value="[^"]*" data-hreflang=/g) || []).length === LANGS.length, `[${lang}] ${file}: 언어 select 가 ${LANGS.length}개가 아니다`);
    ok(new RegExp(`og/${G.LOCALES.find((l) => l.code === lang).dir ? G.LOCALES.find((l) => l.code === lang).dir + '/' : ''}default\\.png`).test(html), `[${lang}] ${file}: og:image 경로`);
    [].concat((T.typography && T.typography.fonts) || []).forEach((href) => ok(html.includes(G.esc(href)), `[${lang}] ${file}: 언어 글꼴 링크 없음`));
    ok(!/class="(intro|intro-h1|hero-total|about)[" ]/.test(html), `[${lang}] ${file}: 히어로·소개 섹션이 남아 있다`);
  });
  const html = read(G.fileOf(lang, 'index.html')) || '';
  ok((html.match(/class="mg-ad"/g) || []).length === 1, `[${lang}] index: mg-ad 는 정확히 1개`);
  const types = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1])['@type']);
  ok(types.join(',') === 'WebSite,ItemList,FAQPage', `[${lang}] index JSON-LD = ${types.join(',')} (기대 WebSite,ItemList,FAQPage)`);
  ok((html.match(/<details class="faq-item">/g) || []).length === T.faq.length, `[${lang}] index: 보이는 FAQ 개수 ≠ faq`);
  ok(html.indexOf('id="cur-h"') < html.indexOf('id="browse-h"') && html.indexOf('id="hub-grid"') < html.indexOf('class="mg-ad"') && html.indexOf('class="mg-ad"') < html.indexOf('id="faq-h"'),
    `[${lang}] index: 순서가 오늘의 미니앱 → 모든 미니앱 → 광고 → FAQ 가 아니다`);
  ok(html.includes(`<title>${G.esc(T.meta.title)}</title>`), `[${lang}] index: <title>`);
  ok(html.includes(`>${G.esc(T.h1)}</span></h1>`), `[${lang}] index: h1 에 검색어가 없다`);
  const priv = read(G.fileOf(lang, 'privacy.html')) || '';
  ok(!/class="mg-ad"/.test(priv), `[${lang}] privacy: 광고 자리가 있다`);
});
ok(!fs.existsSync(path.join(SITE_DIR, 'en')), '예전 en/ 폴더가 남아 있다 (en 은 이제 루트)');

// ---------------------------------------------------------------- 7) 360px 정적 길이 추정
// 대략의 글자 폭(em): 한중일 1.0, 태국 0.62(결합 문자 0), 라틴 대문자 0.66, 소문자·숫자 0.54, 공백 0.28
function em(str) {
  let w = 0;
  for (const ch of String(str)) {
    if (WIDE.test(ch)) w += 1;
    else if (TH_MARK.test(ch)) w += 0;
    else if (/[฀-๿]/.test(ch)) w += 0.62;
    else if (/\s/.test(ch)) w += 0.28;
    else if (/[A-ZÀ-ÞĐƠƯ]/.test(ch)) w += 0.66;
    else w += 0.54;
  }
  return w;
}
function linesAt(str, px, width) {
  // 단어 단위 줄바꿈 근사 (한중일·태국은 글자 단위)
  const words = /[฀-๿぀-ヿ一-鿿]/.test(str) ? [...str] : str.split(/(?<=\s)/);
  let lines = 1, cur = 0;
  words.forEach((w) => { const ww = em(w) * px; if (cur + ww > width && cur > 0) { lines++; cur = ww; } else cur += ww; });
  return lines;
}
LANGS.forEach((lang) => {
  const T = L10N[lang];
  T.curation.items.forEach((it) => {
    warn(linesAt(it.headline, 20, 250) <= 2, `[${lang}] 헤드라인이 360px 카드에서 2줄을 넘을 듯: ${it.headline}`);
    ok(em(it.kicker) * 13 <= 190, `[${lang}] 키커가 한 줄에 안 들어갈 듯: ${it.kicker}`);
    warn(linesAt(it.blurb, 13.5, 262) <= 2, `[${lang}] 소개가 2줄을 넘어 말줄임될 듯: ${it.blurb}`);
  });
  ok(em(T.ui.play) * 14 <= 104, `[${lang}] 카드 버튼 문구가 길다: ${T.ui.play}`);
  ok(em(T.brand.badge) * 12 <= 66, `[${lang}] 머리글 배지가 길다: ${T.brand.badge}`);
  Object.values(T.ui.sorts).forEach((s) => ok(em(s) * 13 <= 120, `[${lang}] 정렬 이름이 길다: ${s}`));
  ok(linesAt(`${G.brandOf(lang)} — ${T.h1}`, 13, 328) <= 3, `[${lang}] h1 이 3줄을 넘을 듯`);
  ok(em(T.ui.newBadge) * 9 <= 40, `[${lang}] NEW 배지 문구가 길다: ${T.ui.newBadge}`);
});

// ---------------------------------------------------------------- 8) 실제 레이아웃 (Chrome headless)
async function layoutPass() {
  const { spawn } = require('child_process');
  const os = require('os');
  const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
  if (!CHROME || typeof WebSocket === 'undefined') { warns.push('--layout: Chrome 또는 WebSocket(Node 22+) 없음 → 건너뜀'); return; }
  const port = 9400 + Math.floor(Math.random() * 400);
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'hubchk-'));
  const proc = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let wsUrl = null;
  for (let i = 0; i < 60 && !wsUrl; i++) {
    try { const l = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); const p = l.find((t) => t.type === 'page'); if (p) wsUrl = p.webSocketDebuggerUrl; } catch (e) { /* 시작 중 */ }
    if (!wsUrl) await sleep(200);
  }
  if (!wsUrl) { proc.kill('SIGKILL'); errors.push('--layout: Chrome 을 시작하지 못함'); return; }
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pend = new Map(); const exc = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') exc.push(d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');
  const MEASURE = `(async () => {
    await document.fonts.ready; await new Promise((r) => setTimeout(r, 150));
    const W = document.documentElement.clientWidth, bad = [];
    const r = (el) => el.getBoundingClientRect();
    if (document.documentElement.scrollWidth > W + 1) bad.push('가로 넘침 ' + document.documentElement.scrollWidth + '>' + W);
    document.querySelectorAll('body *').forEach((el) => { const b = r(el); if (b.width && b.right > W + 1 && !el.closest('.cur-track, .chips')) bad.push('화면 밖: ' + (el.className || el.tagName) + ' right=' + Math.round(b.right)); });
    const brand = document.querySelector('.hub-top .brand'), sel = document.querySelector('.hub-top select');
    if (brand && sel) { const a = r(brand), b = r(sel); if (a.right > b.left - 4) bad.push('머리글: 브랜드와 언어 선택이 겹침 ' + Math.round(a.right) + '>' + Math.round(b.left)); if (Math.abs((a.top + a.bottom) / 2 - (b.top + b.bottom) / 2) > 6) bad.push('머리글: 한 줄이 아님'); }
    const word = document.querySelector('.brand-word'); if (word && word.scrollWidth > word.clientWidth + 1) bad.push('브랜드 워드마크 잘림');
    if (sel && sel.scrollWidth > sel.clientWidth + 1 && !CSS.supports('field-sizing', 'content')) bad.push('언어 select 글자 잘림');
    document.querySelectorAll('.cur-item').forEach((it) => {
      const id = it.dataset.id, art = r(it.querySelector('.cur-art')), h = it.querySelector('.cur-headline'), hb = r(h);
      if (hb.bottom > art.bottom - 8) bad.push(id + ': 헤드라인이 카드 아트 밖으로 (' + Math.round(hb.bottom - art.bottom) + 'px)');
      if (h.scrollHeight > h.clientHeight + 2) bad.push(id + ': 헤드라인이 2줄을 넘어 잘림');
      const k = it.querySelector('.cur-kicker'); if (k.scrollWidth > k.clientWidth + 1 || r(k).height > 26) bad.push(id + ': 키커가 한 줄이 아님');
      const cta = it.querySelector('.cur-cta'); if (r(cta).height > 40) bad.push(id + ': 버튼 문구 줄바꿈');
      const bl = it.querySelector('.cur-blurb'); if (bl.scrollHeight > bl.clientHeight + 2) bad.push(id + ': 소개가 2줄을 넘어 말줄임됨');
    });
    document.querySelectorAll('.tile-name').forEach((n) => { if (n.scrollHeight > n.clientHeight + 2) bad.push('아이콘 이름 잘림: ' + n.textContent); if (n.scrollWidth > n.clientWidth + 1) bad.push('아이콘 이름 가로 넘침: ' + n.textContent); });
    document.querySelectorAll('.tile-meta-vis').forEach((n) => { if (n.scrollWidth > n.clientWidth + 1) bad.push('아이콘 숫자 넘침'); });
    const bh = document.querySelector('.browse-head'); if (bh && bh.scrollWidth > bh.clientWidth + 1) bad.push('모든 미니앱 제목 줄 넘침');
    document.querySelectorAll('.faq-item summary, .chip, .page-h1').forEach((n) => { if (n.scrollWidth > n.clientWidth + 1) bad.push('넘침: ' + n.className + ' ' + n.textContent.slice(0, 30)); });
    const h1 = document.querySelector('.page-h1'); if (h1 && r(h1).height > 13 * 1.45 * 3 + 2) bad.push('h1 이 3줄 넘음');
    const chips = document.querySelector('.chips'); const chipOverflow = chips ? chips.scrollWidth - chips.clientWidth : 0;
    return { bad, chipOverflow, headerGap: brand && sel ? Math.round(r(sel).left - r(brand).right) : null };
  })()`;
  const base = 'file://' + SITE_DIR.split(path.sep).map(encodeURIComponent).join('/').replace(/^file:\/\/%2F/, 'file:///') + '/';
  const results = [];
  for (const width of [360, 375]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: true });
    for (const lang of LANGS) {
      await send('Page.navigate', { url: base + G.fileOf(lang, 'index.html') });
      await sleep(1600);
      const res = await send('Runtime.evaluate', { expression: MEASURE, awaitPromise: true, returnByValue: true });
      const v = res.result && res.result.result && res.result.result.value;
      if (!v) { errors.push(`[${lang}@${width}] 측정 실패`); continue; }
      v.bad.forEach((b) => (/경고/.test(b) ? warns : errors).push(`[${lang}@${width}] ${b}`));
      checks++;
      results.push(`${lang}@${width}: 머리글 여유 ${v.headerGap}px, 칩 넘침 ${v.chipOverflow}px`);
    }
  }
  exc.forEach((e) => errors.push('--layout: 페이지 JS 예외 ' + e));
  ws.close(); proc.kill('SIGKILL'); await sleep(300);
  fs.rmSync(prof, { recursive: true, force: true });
  console.log('\n[레이아웃] ' + results.join(' · '));
}

(async () => {
  if (process.argv.includes('--layout')) await layoutPass();
  console.log(`\n=== 포털 검사 (apps/hub, ${LANGS.length}개 언어) ===`);
  console.log(`검사 ${checks}건, 오류 ${errors.length}건, 경고 ${warns.length}건`);
  warns.forEach((w) => console.log('  (경고) ' + w));
  if (errors.length) {
    errors.slice(0, 80).forEach((e) => console.log('  - ' + e));
    if (errors.length > 80) console.log(`  … 외 ${errors.length - 80}건`);
    console.log('\n결과: FAIL');
    process.exit(1);
  }
  console.log('\n결과: PASS');
})();
