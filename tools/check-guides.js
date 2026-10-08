#!/usr/bin/env node
/**
 * 긴 글 가이드(guide.html)와 포털 신뢰 페이지 검사 — AdSense "가치가 낮은 콘텐츠" 대응(사용자 승인 2026-10-09).
 * tools/check-all.js 가 앱 검사 뒤에 돌린다. 먼저 node tools/gen-all.js.
 *
 *   1) 가이드 글(apps/<id>/tools/guide/<lang>.js): 모든 앱에 있어야 하고, 12개 언어 · en 과 같은 키 · 같은 섹션 수(섹션별 키·list 유무 같음),
 *      섹션 4~6개, en 본문 450단어 이상, 다른 언어는 en 글자 수의 50% 이상(언어별 글자 밀도 보정: 한중일·태국·베트남),
 *      metaTitle 표시 폭 ≤ 70, description 표시 폭 70~330(한중일 글자 = 2), updated = YYYY-MM-DD, 글에 HTML 태그 없음.
 *   2) 생성된 guide.html(언어 폴더 + _l 숨은 변형): hreflang 12 + x-default, canonical, Article JSON-LD(headline·inLanguage·
 *      datePublished·author·publisher) + BreadcrumbList, h1 1개, mg-ad 정확히 1개, 앱으로 가는 CTA 링크, 변형은 noindex.
 *   3) 앱 sitemap.xml 에 guide.html 12개 언어, 푸터에 privacy 링크가 있는 앱 HTML 마다 가이드 링크 + <meta name="mg-guide">.
 *   4) 포털: about/contact/terms/guides 가 12개 언어(+ _l)로 있고, 푸터 링크 5개, guides.html 목록 = 가이드가 있는 앱, 사이트맵에 포함.
 *
 * 실행: node tools/check-guides.js            (모든 앱)
 *       node tools/check-guides.js mole brick (지정한 앱만 — 포털 검사는 hub 를 넣었거나 앱을 지정하지 않았을 때)
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, 'lib', 'i18n-gen.js'));

const ROOT = path.join(__dirname, '..');
const APPS = path.join(ROOT, 'apps');
const LANGS = G.LOCALES.map((l) => l.code);
const only = process.argv.slice(2);
const errors = [];
const warns = [];
let checks = 0;
function ok(cond, msg) { checks++; if (!cond) errors.push(msg); return !!cond; }
function warn(cond, msg) { if (!cond) warns.push(msg); }
function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch (e) { return null; } }

// 표시 폭: 한중일 = 2, 태국 결합 문자 = 0, 그 밖 = 1 (check-hub 와 같은 근사)
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const TH_MARK = /[ัิ-ฺ็-๎]/;
function units(s) { let u = 0; for (const ch of String(s)) u += WIDE.test(ch) ? 2 : TH_MARK.test(ch) ? 0 : 1; return u; }
// 언어별 글자 밀도(en 대비 같은 내용의 글자 수 비율, 실제 가이드에서 잰 값) — "en 의 50% 이상"을 이 비율로 보정한다
const DENSITY = { ja: 0.48, zh: 0.35, ko: 0.42, th: 0.88, vi: 0.86 };
const bodyText = (g) => [g.h1, g.intro, ...(g.sections || []).flatMap((s) => [s.h, ...(s.p || []), ...(s.list || [])])].join(' ');
const chars = (s) => s.replace(/\s/g, '').length;

const appIds = fs.readdirSync(APPS)
  .filter((d) => d !== 'hub' && fs.existsSync(path.join(APPS, d, 'app.config.js')))
  .filter((d) => !only.length || only.includes(d))
  .sort();

// ---------------------------------------------------------------- 1) 가이드 글
const complete = new Set();
appIds.forEach((id) => {
  const dir = path.join(APPS, id, 'tools', 'guide');
  const files = LANGS.filter((c) => fs.existsSync(path.join(dir, `${c}.js`)));
  if (!ok(files.length === LANGS.length, `[${id}] 가이드 언어 파일 ${files.length}/12 (apps/${id}/tools/guide/<lang>.js${files.length ? ` — 없음: ${LANGS.filter((c) => !files.includes(c)).join(', ')}` : ''})`)) return;
  const g = {};
  for (const c of LANGS) {
    try { g[c] = require(path.join(dir, `${c}.js`)); } catch (e) { ok(false, `[${id}] guide/${c}.js 읽기 실패: ${e.message}`); return; }
  }
  const en = g.en;
  const keys = (o) => Object.keys(o || {}).sort().join(',');
  ok(keys(en) === 'cta,description,h1,intro,metaTitle,sections,updated', `[${id}] guide/en.js 키 = ${keys(en)} (기대 metaTitle, description, h1, updated, intro, sections, cta)`);
  ok(Array.isArray(en.sections) && en.sections.length >= 4 && en.sections.length <= 6, `[${id}] en 섹션 ${en.sections && en.sections.length}개 (4~6개)`);
  const enWords = bodyText(en).split(/\s+/).filter(Boolean).length;
  ok(enWords >= 450, `[${id}] en 본문 ${enWords}단어 (450단어 이상)`);
  const enChars = chars(bodyText(en));
  LANGS.forEach((c) => {
    const T = g[c];
    ok(keys(T) === keys(en), `[${id}] [${c}] 키가 en 과 다르다: ${keys(T)}`);
    if (!Array.isArray(T.sections)) return;
    ok(T.sections.length === en.sections.length, `[${id}] [${c}] 섹션 ${T.sections.length}개 ≠ en ${en.sections.length}개`);
    T.sections.forEach((s, i) => {
      const e = en.sections[i] || {};
      ok(keys(s) === keys(e), `[${id}] [${c}] sections[${i}] 키 ${keys(s)} ≠ en ${keys(e)}`);
      ok(typeof s.h === 'string' && s.h.trim() && Array.isArray(s.p) && s.p.length > 0 && s.p.every((x) => typeof x === 'string' && x.trim()), `[${id}] [${c}] sections[${i}] h/p 가 비었다`);
      if (s.list) ok(Array.isArray(s.list) && s.list.length > 0 && s.list.every((x) => typeof x === 'string' && x.trim()), `[${id}] [${c}] sections[${i}].list 가 비었다`);
    });
    ['metaTitle', 'description', 'h1', 'intro', 'cta'].forEach((k) => ok(typeof T[k] === 'string' && T[k].trim(), `[${id}] [${c}] ${k} 없음`));
    ok(/^\d{4}-\d{2}-\d{2}$/.test(String(T.updated)) && !isNaN(Date.parse(T.updated)), `[${id}] [${c}] updated "${T.updated}" (YYYY-MM-DD)`);
    ok(!/<\/?[a-z][^>]*>/i.test(JSON.stringify(T)), `[${id}] [${c}] 가이드 글에 HTML 태그 (일반 텍스트만)`);
    const tu = units(T.metaTitle || '');
    ok(tu > 0 && tu <= 70, `[${id}] [${c}] metaTitle 표시 폭 ${tu} (≤ 70): ${T.metaTitle}`);
    warn(tu <= 62, `[${id}] [${c}] metaTitle 이 조금 길다 (폭 ${tu}): ${T.metaTitle}`);
    const du = units(T.description || '');
    ok(du >= 70 && du <= 330, `[${id}] [${c}] description 표시 폭 ${du} (70~330)`);
    if (c !== 'en') {
      const ratio = chars(bodyText(T)) / enChars / (DENSITY[c] || 1);
      ok(ratio >= 0.5, `[${id}] [${c}] 본문이 en 의 ${(ratio * 100).toFixed(0)}% (글자 밀도 보정 후, 50% 이상)`);
    }
  });
  complete.add(id);
});

// ---------------------------------------------------------------- 2) 생성된 guide.html · 3) 사이트맵 · 푸터 링크
function htmlFiles(dir, rel, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['tools', 'shared', 'og', 'node_modules', '.omc'].includes(ent.name) || ent.isSymbolicLink()) continue;
    const r = rel ? `${rel}/${ent.name}` : ent.name;
    if (ent.isDirectory()) htmlFiles(path.join(dir, ent.name), r, out);
    else if (ent.name.endsWith('.html')) out.push(r);
  }
  return out;
}

complete.forEach((id) => {
  const appDir = path.join(APPS, id);
  ['folder', 'variant'].forEach((mode) => {
    LANGS.forEach((c) => {
      const file = mode === 'variant' ? `${G.VARIANT_DIR}/${c}/guide.html` : G.folderFileOf(c, 'guide.html');
      const html = read(path.join(appDir, file));
      if (!ok(!!html, `[${id}] ${file} 없음 (node tools/gen-all.js)`)) return;
      ok(new RegExp(`<html lang="${c}"`).test(html), `[${id}] ${file}: <html lang> ≠ ${c}`);
      [...LANGS, 'x-default'].forEach((h) => ok(html.includes(`hreflang="${h}" href="`), `[${id}] ${file}: hreflang="${h}" 없음`));
      ok(html.includes(`<link rel="canonical" href="${G.publicUrl(`https://${id}.example.com`, c, 'guide.html')}">`), `[${id}] ${file}: canonical`);
      ok((html.match(/<h1[\s>]/g) || []).length === 1, `[${id}] ${file}: <h1> 이 1개가 아니다`);
      ok((html.match(/class="mg-ad"/g) || []).length === 1, `[${id}] ${file}: mg-ad 는 정확히 1개`);
      ok(/<a class="mg-art-cta" href="(\.\/|\.\.\/)"/.test(html), `[${id}] ${file}: 앱으로 가는 CTA 링크 없음`);
      ok(/<meta name="mg-no-play"/.test(html), `[${id}] ${file}: mg-no-play 메타 없음 (가이드 조회가 플레이로 세어짐)`);
      if (mode === 'variant') ok(html.includes('<meta name="robots" content="noindex">'), `[${id}] ${file}: 숨은 변형에 noindex 없음`);
      const ld = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);
      let graph = [];
      try { graph = ld ? JSON.parse(ld[1])['@graph'] || [] : []; } catch (e) { ok(false, `[${id}] ${file}: JSON-LD 파싱 실패`); }
      const art = graph.find((x) => x['@type'] === 'Article');
      if (ok(!!art, `[${id}] ${file}: Article JSON-LD 없음`)) {
        ['headline', 'description', 'inLanguage', 'datePublished', 'dateModified', 'author', 'publisher'].forEach((k) => ok(!!art[k], `[${id}] ${file}: Article.${k} 없음`));
        ok(art.inLanguage === c, `[${id}] ${file}: Article.inLanguage ${art.inLanguage} ≠ ${c}`);
      }
      ok(graph.some((x) => x['@type'] === 'BreadcrumbList'), `[${id}] ${file}: BreadcrumbList JSON-LD 없음`);
    });
  });

  const sm = read(path.join(appDir, 'sitemap.xml')) || '';
  ok((sm.match(/<loc>[^<]*\/guide\.html<\/loc>/g) || []).length === LANGS.length, `[${id}] sitemap.xml 에 guide.html 12개 언어가 없다`);

  // 푸터에 privacy 링크가 있는 앱 HTML 마다 가이드 링크 + mg-guide 메타
  let pages = 0;
  htmlFiles(appDir, '', []).filter((r) => !/(^|\/)guide\.html$/.test(r)).forEach((r) => {
    const html = read(path.join(appDir, r));
    const footer = (/<footer\b[^>]*>[\s\S]*?<\/footer>/.exec(html) || [])[0];
    const pm = footer && /<a href="((?:\.\.\/)*)privacy\.html">/.exec(footer);
    if (!pm) return;
    pages++;
    ok(footer.includes(`<a href="${pm[1]}guide.html">`), `[${id}] ${r}: 푸터에 가이드 링크 없음`);
    ok(html.includes(`<meta name="mg-guide" content="${pm[1]}guide.html">`), `[${id}] ${r}: <meta name="mg-guide"> 없음`);
  });
  ok(pages >= LANGS.length * 2, `[${id}] 푸터에 privacy 링크가 있는 페이지가 ${pages}개뿐 (언어 폴더 + _l 의 index 최소 24개)`);
});

// ---------------------------------------------------------------- 4) 포털 신뢰 페이지
if (!only.length || only.includes('hub')) {
  const HUB = path.join(APPS, 'hub');
  const PAGES = ['about.html', 'contact.html', 'terms.html', 'guides.html'];
  const FOOT = ['about.html', 'guides.html', 'terms.html', 'privacy.html', 'contact.html'];
  const allGuided = fs.readdirSync(APPS).filter((d) => d !== 'hub' && fs.existsSync(path.join(APPS, d, 'guide.html'))
    && LANGS.every((c) => fs.existsSync(path.join(APPS, d, 'tools', 'guide', `${c}.js`))));
  ['folder', 'variant'].forEach((mode) => {
    LANGS.forEach((c) => {
      ['index.html', 'privacy.html', ...PAGES].forEach((rel) => {
        const file = mode === 'variant' ? `${G.VARIANT_DIR}/${c}/${rel}` : G.folderFileOf(c, rel);
        const html = read(path.join(HUB, file));
        if (!ok(!!html, `[hub] ${file} 없음 (node apps/hub/tools/gen-i18n.js)`)) return;
        const footer = (/<footer class="hub-footer">([\s\S]*?)<\/footer>/.exec(html) || [])[1] || '';
        FOOT.forEach((f) => ok(footer.includes(`href="${f}"`), `[hub] ${file}: 푸터에 ${f} 링크 없음`));
        if (!PAGES.includes(rel)) return;
        [...LANGS, 'x-default'].forEach((h) => ok(html.includes(`hreflang="${h}" href="`), `[hub] ${file}: hreflang="${h}" 없음`));
        ok(/<link rel="canonical" href="[^"]+">/.test(html), `[hub] ${file}: canonical 없음`);
        ok((html.match(/<h1[\s>]/g) || []).length === 1, `[hub] ${file}: <h1> 이 1개가 아니다`);
        ok(!/class="mg-ad"/.test(html), `[hub] ${file}: 신뢰 페이지에 광고 자리`);
        if (rel === 'contact.html') ok(html.includes('href="mailto:contact@melgene.com"'), `[hub] ${file}: mailto 링크 없음`);
        if (rel === 'guides.html') {
          const n = (html.match(/class="guide-item"/g) || []).length;
          ok(n === allGuided.length, `[hub] ${file}: 가이드 목록 ${n}개 ≠ 가이드가 있는 앱 ${allGuided.length}개`);
          allGuided.forEach((id) => ok(new RegExp(`href="https://${id}\\.example\\.com/(${c}/)?guide\\.html"`).test(html), `[hub] ${file}: ${id} 가이드 링크 없음`));
        }
      });
    });
  });
  const hsm = read(path.join(HUB, 'sitemap.xml')) || '';
  PAGES.forEach((rel) => ok(hsm.includes(`<loc>https://example.com/${rel}</loc>`), `[hub] sitemap.xml 에 ${rel} 없음`));
  // 소개 글은 실제 내용이 있어야 한다 (en 400단어 이상)
  const A = require(path.join(HUB, 'tools', 'i18n', 'en.js')).aboutPage || {};
  const aw = [A.lead, ...(A.sections || []).flatMap((s) => [s.h, ...(s.p || []), ...(s.list || [])])].join(' ').split(/\s+/).filter(Boolean).length;
  ok(aw >= 400, `[hub] about en ${aw}단어 (400단어 이상)`);
}

console.log(`\n=== 가이드·신뢰 페이지 검사 (앱 ${appIds.length}개, 가이드 ${complete.size}개) ===`);
console.log(`검사 ${checks}건, 오류 ${errors.length}건, 경고 ${warns.length}건`);
if (warns.length) { console.log('\n경고(참고):'); warns.slice(0, 30).forEach((w) => console.log('  - ' + w)); if (warns.length > 30) console.log(`  … 외 ${warns.length - 30}건`); }
if (errors.length) {
  console.log('\n오류:');
  errors.slice(0, 80).forEach((e) => console.log('  - ' + e));
  if (errors.length > 80) console.log(`  … 외 ${errors.length - 80}건`);
  console.log('\n결과: FAIL');
  process.exit(1);
}
console.log('\n결과: PASS');
