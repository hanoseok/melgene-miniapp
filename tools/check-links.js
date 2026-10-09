#!/usr/bin/env node
/**
 * 정적 사이트 링크 검사기.
 *   1) apps/<site>/ 아래 모든 HTML(tools/, .omc/ 제외)의 상대 href/src 가 실제 파일로 풀리는지
 *      (shared 심볼릭 링크를 따라가서 확인, 사이트 폴더 밖으로 나가는 링크와 '/...' 루트 절대경로는 오류 —
 *       GitHub Pages 하위 경로 배포에서 깨지기 때문)
 *   2) 모든 페이지가 모든 언어(shared/i18n.js 의 LOCALES) + x-default hreflang 을 갖는지,
 *      <html lang> 이 폴더(ko=루트, en/, ja/)와 맞는지, 자기 언어 hreflang 이 canonical 과 같은지
 *   3) hreflang / canonical / og:image / sitemap.xml 의 자리표시자 주소(https://<site>.example.com/...,
 *      https://example.com/...)가 실제 파일을 가리키는지
 *
 * 실행: node tools/check-links.js          (apps/ 검사)
 *       node tools/check-links.js dist     (deploy-prep.sh 결과물 검사 — 주소가 치환돼 있으므로 3)은 건너뜀.
 *                                           배포 단위 안에 중첩된 미니앱(dist/miniapp/<앱>/)은 각각 한 사이트로 본다.
 *                                           dist/legacy/·404.html(리다이렉트 전용)과 google*.html(Search Console 인증)은 건너뜀)
 */
const fs = require('fs');
const path = require('path');
const I18N = require(path.join(__dirname, '..', 'shared', 'i18n.js'));

const ROOT = path.resolve(__dirname, '..', process.argv[2] || 'apps');
const DIST = path.basename(ROOT) !== 'apps';
const SKIP_DIRS = new Set(['tools', '.omc', 'node_modules', 'shared', '.git']);
const LANG_CODES = I18N.LOCALES.map((l) => l.code);
const DIR_TO_LANG = {};
I18N.LOCALES.forEach((l) => { if (l.dir) DIR_TO_LANG[l.dir] = l.code; });

const errors = [];
let pages = 0;
let links = 0;
let urlChecks = 0;

function err(file, msg) {
  errors.push(`${path.relative(ROOT, file)}: ${msg}`);
}

function walkHtml(dir, out, exclude) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name) || (exclude && exclude.has(ent.name))) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, out);
    else if (ent.isFile() && ent.name.endsWith('.html') && !(DIST && (ent.name === '404.html' || /^google[0-9a-f]+\.html$/.test(ent.name)))) out.push(full); // 404·Search Console 인증 파일 제외
  }
  return out;
}

// dist 모드: 배포 단위(dist/hub, dist/miniapp) + 그 안에 중첩된 미니앱(shared/common.js 를 가진 하위 폴더)
function distSites() {
  const out = [];
  fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && d.name !== 'legacy')
    // 리다이렉트 전용 단위(Cloudflare _worker.js — PRIMARY_HOST=root 일 때 dist/miniapp)는 건너뜀
    .filter((d) => !isFile(path.join(ROOT, d.name, '_worker.js')))
    .forEach((d) => {
      const dir = path.join(ROOT, d.name);
      const nested = fs.readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory() && !SKIP_DIRS.has(e.name) && isFile(path.join(dir, e.name, 'shared', 'common.js')))
        .map((e) => e.name);
      out.push({ name: d.name, dir, exclude: new Set(nested) });
      nested.forEach((n) => out.push({ name: `${d.name}/${n}`, dir: path.join(dir, n), exclude: null }));
    });
  return out;
}

function isFile(p) {
  try { return fs.statSync(p).isFile(); } catch (e) { return false; } // statSync 는 심볼릭 링크를 따라간다
}

// 로컬 경로 → 존재하는 파일 경로 (디렉터리면 index.html)
function resolveLocal(p) {
  try {
    if (fs.statSync(p).isDirectory()) return path.join(p, 'index.html');
  } catch (e) { /* 없음 */ }
  return p;
}

// 자리표시자 URL → 사이트 폴더 안의 파일 (자리표시자가 아니면 null)
function placeholderToFile(siteName, siteDir, url) {
  const base = siteName === 'hub' ? 'https://example.com' : `https://${siteName}.example.com`;
  if (!url.startsWith(base + '/')) return null;
  let rest = url.slice(base.length + 1).split('#')[0].split('?')[0];
  if (rest === '' || rest.endsWith('/')) rest += 'index.html';
  return path.join(siteDir, rest);
}

function checkPlaceholder(siteName, siteDir, file, what, url) {
  const target = placeholderToFile(siteName, siteDir, url);
  if (target === null) {
    if (/example\.com/.test(url)) err(file, `${what} 가 다른 사이트 자리표시자를 가리킴: ${url}`);
    return;
  }
  urlChecks++;
  if (!isFile(target)) err(file, `${what} 대상 파일 없음: ${url}`);
}

function attr(tag, name) {
  const m = new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i').exec(tag);
  return m ? (m[2] != null ? m[2] : m[3]) : null;
}

function checkPage(siteName, siteDir, file, placeholders) {
  pages++;
  const html = fs.readFileSync(file, 'utf8');
  const relToSite = path.relative(siteDir, file).split(path.sep);
  // 숨은 변형 _l/<언어>/<rel>: 언어 없는 주소(<rel>)에 그려지므로 링크는 그 위치 기준, 언어는 폴더 이름
  const isVariant = relToSite[0] === '_l' && relToSite.length > 2 && LANG_CODES.includes(relToSite[1]);
  const servedFile = isVariant ? path.join(siteDir, ...relToSite.slice(2)) : file;
  const expectedLang = isVariant ? relToSite[1] : ((relToSite.length > 1 && DIR_TO_LANG[relToSite[0]]) || I18N.DEFAULT_LOCALE);
  if (isVariant && !isFile(servedFile)) err(file, `숨은 변형에 맞는 언어 없는 페이지가 없다: ${path.relative(siteDir, servedFile)}`);
  if (isVariant && !/<meta name="robots" content="noindex">/.test(fs.readFileSync(file, 'utf8'))) err(file, '숨은 변형에 noindex 가 없다');

  const htmlLang = (/<html[^>]*\slang="([^"]+)"/i.exec(html) || [])[1];
  if (htmlLang !== expectedLang) err(file, `<html lang="${htmlLang}"> ≠ 폴더 기준 "${expectedLang}"`);

  // 1) 상대 href/src
  const re = /<[a-z][^>]*?\s(?:href|src)\s*=\s*(?:"[^"]*"|'[^']*')[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    ['href', 'src'].forEach((name) => {
      const v = attr(tag, name);
      if (v == null) return;
      const val = v.trim();
      if (!val || val.startsWith('#')) return;
      if (/^[a-z][a-z0-9+.-]*:/i.test(val) || val.startsWith('//')) return; // http:, data:, mailto: 등
      links++;
      if (val.startsWith('/')) { err(file, `루트 절대경로는 하위 경로 배포에서 깨짐: ${val}`); return; }
      const clean = decodeURIComponent(val.split('#')[0].split('?')[0]);
      const abs = path.resolve(path.dirname(servedFile), clean);
      const inside = path.relative(siteDir, abs);
      if (inside.startsWith('..') || path.isAbsolute(inside)) { err(file, `사이트 폴더 밖을 가리킴: ${val}`); return; }
      const target = clean.endsWith('/') || clean === '' ? path.join(abs, 'index.html') : resolveLocal(abs);
      if (!isFile(target)) err(file, `깨진 링크: ${name}="${val}"`);
    });
  }

  // 2) hreflang 세트
  const alts = {};
  const linkRe = /<link\b[^>]*>/gi;
  let canonical = null;
  while ((m = linkRe.exec(html))) {
    const tag = m[0];
    const rel = (attr(tag, 'rel') || '').toLowerCase();
    if (rel === 'alternate' && attr(tag, 'hreflang')) alts[attr(tag, 'hreflang')] = attr(tag, 'href');
    if (rel === 'canonical') canonical = attr(tag, 'href');
  }
  [...LANG_CODES, 'x-default'].forEach((code) => {
    if (!alts[code]) err(file, `hreflang="${code}" 없음`);
  });
  if (!canonical) err(file, 'canonical 없음');
  else if (alts[expectedLang] && alts[expectedLang] !== canonical) {
    err(file, `자기 언어 hreflang(${alts[expectedLang]}) ≠ canonical(${canonical})`);
  }

  // 3) 자리표시자 주소가 실제 파일을 가리키는지
  if (placeholders) {
    Object.entries(alts).forEach(([code, url]) => checkPlaceholder(siteName, siteDir, file, `hreflang=${code}`, url));
    if (canonical) checkPlaceholder(siteName, siteDir, file, 'canonical', canonical);
    const og = (/<meta\s+property="og:image"\s+content="([^"]+)"/i.exec(html) || [])[1];
    if (og) checkPlaceholder(siteName, siteDir, file, 'og:image', og);
  }
}

function checkSitemap(siteName, siteDir, placeholders) {
  const p = path.join(siteDir, 'sitemap.xml');
  if (!isFile(p)) { err(p, 'sitemap.xml 없음'); return; }
  const xml = fs.readFileSync(p, 'utf8');
  const blocks = xml.split('<url>').slice(1);
  if (!blocks.length) err(p, '<url> 항목 없음');
  blocks.forEach((b) => {
    const loc = (/<loc>([^<]+)<\/loc>/.exec(b) || [])[1];
    const alts = [...b.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)];
    const codes = new Set(alts.map((a) => a[1]));
    [...LANG_CODES, 'x-default'].forEach((c) => { if (!codes.has(c)) err(p, `${loc}: xhtml:link hreflang="${c}" 없음`); });
    if (placeholders) {
      checkPlaceholder(siteName, siteDir, p, 'sitemap loc', loc);
      alts.forEach((a) => checkPlaceholder(siteName, siteDir, p, `sitemap hreflang=${a[1]}`, a[2]));
    }
  });
}

function main() {
  if (!fs.existsSync(ROOT)) { console.error(`없는 폴더: ${ROOT}`); process.exit(2); }
  const placeholders = !DIST;
  const sites = DIST
    ? distSites()
    : fs.readdirSync(ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
        .map((d) => ({ name: d.name, dir: path.join(ROOT, d.name), exclude: null }));
  sites.forEach(({ name, dir: siteDir, exclude }) => {
    if (!isFile(path.join(siteDir, 'shared', 'common.js'))) err(siteDir, 'shared/common.js 없음 (shared 심볼릭 링크 확인)');
    walkHtml(siteDir, [], exclude).forEach((f) => checkPage(name, siteDir, f, placeholders));
    checkSitemap(name, siteDir, placeholders);
  });

  console.log(`\n=== 링크 검사 (${path.relative(process.cwd(), ROOT) || ROOT}) ===`);
  console.log(`사이트 ${sites.length}개, HTML ${pages}개, 상대 링크 ${links}개, 자리표시자 URL ${urlChecks}개 확인`);
  console.log(`hreflang 필수: ${[...LANG_CODES, 'x-default'].join(', ')}`);
  if (errors.length) {
    console.log(`\n오류 ${errors.length}건:`);
    errors.slice(0, 80).forEach((e) => console.log('  - ' + e));
    if (errors.length > 80) console.log(`  … 외 ${errors.length - 80}건`);
    console.log('\n결과: FAIL');
    process.exit(1);
  }
  console.log('\n결과: PASS — 모든 상대 링크가 존재하고 모든 페이지에 hreflang 세트가 있습니다.');
}

main();
