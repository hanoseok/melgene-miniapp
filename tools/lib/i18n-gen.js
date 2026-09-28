/**
 * 다국어 정적 페이지 생성용 공통 헬퍼 (Node 전용, 배포되지 않음).
 * 각 사이트의 tools/gen-*.js 가 require 해서 쓴다.
 *
 * 용어
 *   rel   : 언어 루트 기준 파일 경로. 예) 'index.html', 'r/viking.html', 'privacy.html'
 *   file  : 사이트 루트 기준 실제 파일 경로. en 은 rel 그대로, 나머지는 '<dir>/' + rel
 *
 * 주소에 언어를 넣지 않는다 (사용자 지시 2026-09-28): 사람에게 보이는 주소는 언어 없는 주소(= en 파일) 하나.
 *   - 언어는 쿠키 mg_lang(우선) → localStorage(mg_lang/lang_pref) 로만 정한다. <head> 맨 앞 로더(pageLoader)가
 *     언어 없는 주소에서 고른 언어의 "숨은 변형" _l/<언어>/<rel> 을 받아 같은 주소에 그린다(주소창은 그대로).
 *   - 언어 폴더(<dir>/<rel>) 는 검색엔진 전용으로 남긴다(hreflang·사이트맵). 사람이 들어오면 로더가
 *     (고른 언어가 없을 때만 그 언어를 저장하고) 언어 없는 주소로 옮긴다.
 *   - 생성기는 두 번 돈다: 보통(폴더) + MG_I18N_MODE=variant(숨은 변형, 링크는 언어 없는 주소 기준).
 */
const fs = require('fs');
const path = require('path');
const SHARED = require(path.join(__dirname, '..', '..', 'shared', 'i18n.js'));

const { LOCALES, DEFAULT_LOCALE, X_DEFAULT, STRINGS } = SHARED;

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function localeOf(code) {
  const loc = SHARED.getLocale(code);
  if (!loc) throw new Error(`unknown locale: ${code}`);
  return loc;
}

// 생성 방식: 'folder'(검색엔진용 언어 폴더 + en = 언어 없는 주소) | 'variant'(숨은 변형 _l/<언어>/<rel>)
const MODE = process.env.MG_I18N_MODE === 'variant' ? 'variant' : 'folder';
const VARIANT_DIR = '_l';

// 검색엔진용 언어 폴더 위치 (en 은 루트)
function folderFileOf(lang, rel) {
  const { dir } = localeOf(lang);
  return dir ? `${dir}/${rel}` : rel;
}

// 언어 + rel → 이번 생성 방식에서 쓸 파일 경로
function fileOf(lang, rel) {
  if (MODE === 'variant') { localeOf(lang); return `${VARIANT_DIR}/${lang}/${rel}`; }
  return folderFileOf(lang, rel);
}

// 숨은 변형은 언어 없는 주소에 그려지므로, 링크·접두어 계산은 _l/<언어>/ 를 떼고 한다
function servedPath(file) {
  return String(file).replace(new RegExp('^' + VARIANT_DIR + '/[a-z]{2}/'), '');
}

// 파일 위치 → 사이트 루트까지의 상대 접두어 ('./', '../', '../../')
function rootPrefix(file) {
  const depth = servedPath(file).split('/').length - 1;
  return depth === 0 ? './' : '../'.repeat(depth);
}

// 공개 URL(검색엔진용 canonical·hreflang·사이트맵). index.html 은 디렉터리 주소(끝 슬래시)로 쓴다.
function publicUrl(siteRoot, lang, rel) {
  const file = folderFileOf(lang, rel);
  const clean = file === 'index.html' ? '' : file.replace(/(^|\/)index\.html$/, '$1');
  return `${siteRoot}/${clean}`;
}

// 한 파일에서 다른 파일로 가는 상대 링크 (index.html 은 디렉터리로)
function relHref(fromFile, toFile) {
  let r = path.posix.relative(path.posix.dirname(servedPath(fromFile)), servedPath(toFile));
  if (r === 'index.html') return './';
  r = r.replace(/(^|\/)index\.html$/, '$1');
  return r || './';
}

// <head> 맨 앞 언어 로더 (모든 페이지). 쿠키 mg_lang 우선 → localStorage. 봇·#nolang 은 건드리지 않는다.
const BOT_UA_SRC = '(^|[^a-z])bot([^a-z]|$)|[a-z]bot\\/|crawl|spider|slurp|googlebot|google-inspectiontool|mediapartners|adsbot|bingbot|bingpreview|yandex|baiduspider|duckduckbot|sogou|exabot|facebookexternalhit|facebot|meta-externalagent|twitterbot|linkedinbot|pinterest|slackbot|discordbot|telegrambot|whatsapp|skypeuripreview|embedly|quora link preview|applebot|petalbot|semrush|ahrefs|mj12bot|dotbot|headlesschrome|lighthouse|pagespeed|gtmetrix|prerender|phantomjs|puppeteer|playwright';
function pageLoader(rel) {
  const codes = JSON.stringify(LOCALES.map((l) => l.code));
  const variant = MODE === 'variant';
  // 한 줄로 압축한 ES5 (생성 HTML 에 그대로 들어간다)
  return `<script>(function(w,d){var C=${codes},DEF=${JSON.stringify(DEFAULT_LOCALE)},VAR=${variant},REL=${JSON.stringify(rel)},DIR=${JSON.stringify(VARIANT_DIR)},L=(d.documentElement.getAttribute('lang')||DEF).toLowerCase().split('-')[0],loc=w.location;` +
    `function ok(c){return C.indexOf(c)>=0}` +
    `function ck(){try{var m=d.cookie.match(/(?:^|;\\s*)mg_lang=([^;]*)/);return m?decodeURIComponent(m[1]):null}catch(e){return null}}` +
    `function ls(){try{return localStorage.getItem('mg_lang')||localStorage.getItem('lang_pref')}catch(e){return null}}` +
    `function save(c){if(!ok(c))return;try{localStorage.setItem('mg_lang',c);localStorage.setItem('lang_pref',c)}catch(e){}try{d.cookie='mg_lang='+c+'; Path=/; Max-Age=31536000; SameSite=Lax'+(loc.protocol==='https:'?'; Secure':'')+(/(^|\\.)melgene\\.com$/.test(loc.hostname)?'; Domain=.melgene.com':'')}catch(e){}}` +
    `function get(){var c=ck(),s=ls(),p=ok(c)?c:(ok(s)?s:null);if(p&&(c!==p||s!==p))save(p);return p}` +
    `var tail=REL.replace(/(^|\\/)index\\.html$/,'$1'),pn=loc.pathname,head=pn;` +
    `if(pn.slice(-REL.length)===REL)head=pn.slice(0,pn.length-REL.length);else if(tail&&pn.slice(-tail.length)===tail)head=pn.slice(0,pn.length-tail.length);` +
    `var m=head.match(new RegExp('/(?:'+DIR+'/)?('+C.join('|')+')/$')),kind='clean',base=head;` +
    `if(m&&head.indexOf('/'+DIR+'/')>=0){kind='direct';base=head.slice(0,head.length-m[0].length+1)}else if(m&&!VAR&&m[1]===L&&L!==DEF){kind='folder';base=head.slice(0,head.length-m[0].length+1)}` +
    `function clean(nolang){var q='';try{var u=new URLSearchParams(loc.search);u.delete('lang');q=u.toString();q=q?'?'+q:''}catch(e){q=loc.search}return loc.protocol+'//'+loc.host+base+tail+q+(nolang?'#nolang':loc.hash)}` +
    `function toClean(href){try{var u=new URL(href,loc.href);u.pathname=u.pathname.replace(new RegExp('/(?:'+DIR+'/)?(?:'+C.join('|')+')/'),'/');u.searchParams.delete('lang');return u.href}catch(e){return href}}` +
    `var q=null;try{q=new URLSearchParams(loc.search).get('lang')}catch(e){}` +
    `if(ok(q)){save(q);try{history.replaceState(history.state,'',clean())}catch(e){}}` +
    `var P=get();w.MG_LANG={codes:C,page:L,variant:VAR,kind:kind,get:get,save:save,clean:clean,toClean:toClean};` +
    `if(/^#nolang\\b/.test(loc.hash)||navigator.webdriver||new RegExp(${JSON.stringify(BOT_UA_SRC)},'i').test(navigator.userAgent||''))return;` +
    `function stop(){try{d.write('<plaintext style="display:none">')}catch(e){}}` +
    `if(kind!=='clean'){if(!P)save(L);loc.replace(clean());stop();return}` +
    `if(!VAR&&P&&P!==L&&w.fetch){stop();fetch(base+DIR+'/'+P+'/'+REL,{credentials:'same-origin'}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(h){d.open();d.write(h);d.close()})['catch'](function(){loc.replace(clean(true))})}` +
    `})(window,document);</script>`;
}

// <link rel="alternate" hreflang> 전체 세트 (+ x-default). 맨 앞에 언어 로더, 숨은 변형은 noindex.
function hreflangTags(siteRoot, rel) {
  const lines = [pageLoader(rel)];
  if (MODE === 'variant') lines.push('<meta name="robots" content="noindex">');
  LOCALES.forEach((l) => lines.push(
    `<link rel="alternate" hreflang="${l.code}" href="${publicUrl(siteRoot, l.code, rel)}">`
  ));
  lines.push(`<link rel="alternate" hreflang="x-default" href="${publicUrl(siteRoot, X_DEFAULT, rel)}">`);
  return lines.join('\n');
}

function ogLocaleTags(lang) {
  const lines = [`<meta property="og:locale" content="${localeOf(lang).ogLocale}">`];
  LOCALES.filter((l) => l.code !== lang).forEach((l) => {
    lines.push(`<meta property="og:locale:alternate" content="${l.ogLocale}">`);
  });
  return lines.join('\n');
}

// 언어 전환 셀렉트박스. 크롤러용 대체 링크는 <head> 의 hreflang 이 담당한다.
// JS 가 꺼진 경우를 위해 <noscript> 안에 링크 목록도 둔다.
// (예전 opts.suggest 추천 배너는 없어졌다 — 방문자 지역 자동 이동은 common.js 가 hreflang 으로 한다)
function langSwitcher(lang, rel) {
  const from = fileOf(lang, rel);
  const label = (STRINGS[lang] || STRINGS[DEFAULT_LOCALE]).langNav;
  // 값은 언어 코드: 고르면 common.js 가 쿠키 mg_lang + localStorage 에 저장하고 같은(언어 없는) 주소를 다시 불러온다
  const options = LOCALES.map((l) => {
    const sel = l.code === lang ? ' selected' : '';
    return `<option value="${l.code}" data-hreflang="${l.code}" lang="${l.code}"${sel}>${esc(l.label)}</option>`;
  }).join('');
  const links = LOCALES.map((l) => {
    const href = relHref(from, fileOf(l.code, rel));
    return `<a href="${href}" hreflang="${l.code}" lang="${l.code}">${esc(l.label)}</a>`;
  }).join(' ');
  return `<div class="lang-switch">` +
    `<label class="lang-select"><span class="lang-globe" aria-hidden="true">🌐</span>` +
    `<select aria-label="${esc(label)}">${options}</select></label>` +
    `<noscript><nav class="lang-links" aria-label="${esc(label)}">${links}</nav></noscript></div>`;
}

// 모든 미니앱 맨 위 타이틀 바: 왼쪽 "Melgene + 배지" = 포털 홈(같은 언어), 오른쪽 = 언어 선택.
// 포털 주소는 https://example.com/ 자리표시자(배포 때 실제 포털 주소로 바뀐다)에 언어 폴더를 붙인다.
// opts.title: 앱 이름을 브랜드 옆에 작게(선택). (opts.suggest 는 예전 추천 배너용 — 지금은 무시한다)
function topBar(lang, rel, opts = {}) {
  const S = STRINGS[lang] || STRINGS[DEFAULT_LOCALE];
  const loc = localeOf(lang);
  // 사람에게는 언어 없는 포털 주소, 검색엔진용 언어 폴더 페이지는 같은 언어 포털 폴더
  const home = 'https://example.com/' + (MODE === 'folder' && loc && loc.dir ? loc.dir + '/' : '');
  const title = opts.title ? `<span class="mg-top-app">${esc(opts.title)}</span>` : '';
  return `<header class="mg-top">` +
    `<a class="mg-home" href="${home}" aria-label="${esc(S.homeAria || 'Home')}">` +
    `<span class="mg-home-mark" aria-hidden="true"></span><span class="mg-home-word">Melgene</span>` +
    `<span class="mg-home-badge">${esc(S.brandBadge || 'Apps')}</span></a>` +
    title +
    langSwitcher(lang, rel) +
    `</header>`;
}

// 언어별 브랜드 이름 (스킬 4번)
const BRAND = { en: 'Melgene Apps', ko: '멜진 미니앱', ja: 'メルジン ミニアプリ', zh: 'Melgene 小应用', it: 'Melgene Apps', pt: 'Melgene Apps' };
function brandOf(lang) {
  return BRAND[lang] || BRAND.en;
}

// 앱 페이지 구조화 데이터: WebApplication + BreadcrumbList (포털 홈 → 앱).
// opts: { siteRoot, rel='index.html', name, description, category: 'game'|'test'|'create'|'vote', image }
// 별점(aggregateRating)은 넣지 않는다 — 숫자는 서버의 실제 값만, 정적 HTML에 굳히지 않는다.
function appLd(lang, opts) {
  const rel = opts.rel || 'index.html';
  const url = publicUrl(opts.siteRoot, lang, rel);
  const loc = localeOf(lang);
  const home = 'https://example.com/' + (loc.dir ? loc.dir + '/' : '');
  const appCat = { game: 'GameApplication', test: 'EntertainmentApplication', create: 'MultimediaApplication', vote: 'UtilitiesApplication' }[opts.category] || 'WebApplication';
  const graph = [
    {
      '@type': 'WebApplication',
      '@id': url + '#app',
      name: opts.name,
      description: opts.description,
      url,
      inLanguage: lang,
      applicationCategory: appCat,
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: brandOf(lang), url: home },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: brandOf(lang), item: home },
        { '@type': 'ListItem', position: 2, name: opts.name, item: url },
      ],
    },
  ];
  if (opts.image) graph[0].image = opts.image;
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${json}</script>`;
}

// 브라우저에서 쓸 문자열을 인라인 <script> 로 (</script> 탈출 방지)
function scriptJson(varName, obj) {
  const json = JSON.stringify(obj).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return `<script>window.${varName} = ${json};</script>`;
}

// "{name}" 형태 치환
function fmt(tpl, vars) {
  return String(tpl).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
}

// 사이트맵: 각 rel 마다 모든 언어 URL + xhtml:link 대체 링크
function sitemapXml(siteRoot, rels, lastmod) {
  const today = lastmod || new Date().toISOString().slice(0, 10);
  const blocks = [];
  rels.forEach((rel) => {
    const alts = LOCALES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${publicUrl(siteRoot, l.code, rel)}"/>`
    );
    alts.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${publicUrl(siteRoot, X_DEFAULT, rel)}"/>`);
    LOCALES.forEach((l) => {
      blocks.push(
        `  <url>\n    <loc>${publicUrl(siteRoot, l.code, rel)}</loc>\n    <lastmod>${today}</lastmod>\n${alts.join('\n')}\n  </url>`
      );
    });
  });
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    blocks.join('\n') +
    '\n</urlset>\n'
  );
}

function writeOut(siteDir, file, content) {
  const full = path.join(siteDir, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  return full;
}

// apps/<site>/tools/i18n/<lang>.js 를 LOCALES 순서대로 읽는다. 파일이 없으면 에러.
function loadSiteLocales(siteDir) {
  const out = {};
  LOCALES.forEach((l) => {
    const p = path.join(siteDir, 'tools', 'i18n', `${l.code}.js`);
    if (!fs.existsSync(p)) throw new Error(`missing locale file: ${p}`);
    out[l.code] = require(p);
  });
  return out;
}

// 번역 대기 언어: 첫 줄이 "// TODO-TRANSLATE" 인 apps/<site>/tools/i18n/<lang>.js (en 사본).
// 검사 스크립트는 이 언어들의 문구 문제를 실패가 아닌 (참고)로만 알린다 — 번역이 들어오면(첫 줄 삭제) 다시 엄격해진다.
function todoLocales(siteDir) {
  return LOCALES.map((l) => l.code).filter((code) => {
    const p = path.join(siteDir, 'tools', 'i18n', `${code}.js`);
    return fs.existsSync(p) && /^\/\/\s*TODO-TRANSLATE/.test(fs.readFileSync(p, 'utf8'));
  });
}
// 메시지가 번역 대기 언어 것인지: "[it]", "[pt 360]", "seo: [it]" 처럼 대괄호 안 언어 코드로 판단
function isTodoMessage(msg, todo) {
  return todo.some((code) => new RegExp(`\\[${code}(\\]|[\\s:/·])`).test(String(msg)));
}

module.exports = {
  MODE,
  VARIANT_DIR,
  folderFileOf,
  servedPath,
  pageLoader,
  LOCALES,
  DEFAULT_LOCALE,
  X_DEFAULT,
  STRINGS,
  esc,
  fileOf,
  rootPrefix,
  publicUrl,
  relHref,
  hreflangTags,
  ogLocaleTags,
  langSwitcher,
  topBar,
  brandOf,
  appLd,
  scriptJson,
  fmt,
  sitemapXml,
  writeOut,
  loadSiteLocales,
  todoLocales,
  isTodoMessage,
};
