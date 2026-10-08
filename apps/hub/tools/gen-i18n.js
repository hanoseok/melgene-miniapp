#!/usr/bin/env node
/**
 * 미니앱 포털(apps/hub)의 정적 페이지를 언어별로 생성한다. 브랜드 이름은 공통 G.brandOf(lang) 과 언어 파일의 brand(워드마크 배지)에만 있다.
 *   <언어 폴더>/index.html, privacy.html, about.html, contact.html, terms.html, guides.html (shared/i18n.js 의 LOCALES 마다, 기본 언어는 루트)
 *   — about/contact/terms/guides = AdSense 신뢰 페이지(사용자 승인 2026-10-09). guides.html = 가이드(guide.html)가 있는 앱 목록.
 *   sitemap.xml (모든 언어 URL + xhtml:link hreflang)
 *
 * 페이지 순서(스킬 7번 포털 예외): 머리글(브랜드 + 언어 select) → 작은 <h1>(브랜드 + 현지 검색어)
 *   → 오늘의 미니앱 캐러셀(최신 10개 중 무작위 6개, curation.items 문구, 누적 참여 한 줄) → 모든 미니앱 아이콘 격자 → 광고(mg-ad 1개)
 *   (카테고리 칩·검색·정렬) → 자주 묻는 질문(보이는 FAQ + FAQPage JSON-LD) → 푸터. 히어로 문구·소개 섹션은 없다.
 * 캐러셀과 격자는 **정적으로 미리 그린다**(검색엔진·JS 없는 환경용). 브라우저에서는 script.js 가 참여 수·별점·하트
 * (supa.summary, 실제 데이터가 있을 때만), 캐러셀 점/화살표, 카테고리/검색/정렬을 붙인다.
 * 글꼴: 언어 파일의 typography { fonts(추가 Google Fonts CSS), sans(--font-sans), display(--font-display) }.
 * 색·줄임 표기·NEW 판정은 hub-core.js 를 양쪽이 같이 쓴다. 언어 목록은 shared/i18n.js 의 LOCALES 만 따른다.
 * 문구는 tools/i18n/<lang>.js. 포털 주소는 https://example.com, 앱 주소는 https://<id>.example.com
 * 자리표시자이고 deploy-prep.sh 가 dist/ 에서 실제 주소(miniapp.<도메인>)로 바꾼다.
 *
 * 실행: node tools/gen-i18n.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const I18N = require(path.join(__dirname, '..', '..', '..', 'shared', 'i18n.js'));
const CORE = require(path.join(__dirname, '..', 'hub-core.js'));

const SITE_ROOT = 'https://example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
// 다른 언어의 브랜드 이름 (JSON-LD alternateName). 공통 G.brandOf 에서 모은다.
const ALT_NAMES = [...new Set(G.LOCALES.map((l) => G.brandOf(l.code)))];

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const DISPLAY_FONT = 'https://fonts.googleapis.com/css2?family=Gabarito:wght@600;700;800&display=swap';
const CATS = CORE.CATS; // game → test → create

// shared/site.config.js 는 window.SITE_CONFIG 를 세팅하는 브라우저 스크립트라 샌드박스에서 실행해 읽는다
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(SITE_DIR, '..', '..', 'shared', 'site.config.js'), 'utf8'), sandbox);
const SITES = sandbox.window.SITE_CONFIG.SITES || [];

function pick(v, lang) {
  if (v == null || typeof v === 'string') return v || '';
  return v[lang] != null ? v[lang] : v[G.DEFAULT_LOCALE] || '';
}
// common.js 의 localizeSite 와 같은 규칙 + 포털이 쓰는 category/added/순서
function appsFor(lang) {
  return SITES.map((s, i) => ({
    id: s.id,
    emoji: s.emoji,
    category: CORE.catOf(s.category),
    added: s.added || '',
    order: i,
    title: pick(s.title, lang),
    desc: pick(s.desc, lang),
    href: (s.paths && s.paths[lang]) || I18N.localePath(s.path, lang),
  }));
}

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

function jsonLd(obj) {
  return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2).replace(/</g, '\\u003c')}\n</script>`;
}

// 언어별 글꼴: 언어 파일 typography → <link>(있으면) + --font-sans / --font-display.
// html:lang(xx) 로 써서 base.css 의 html:lang(ja) 보다 뒤·같은 세기로 이긴다.
function typographyHead(lang, T) {
  const ty = T.typography || {};
  const out = [];
  [].concat(ty.fonts || []).forEach((href) => out.push(`<link rel="stylesheet" href="${esc(href)}">`));
  const vars = [];
  if (ty.sans) vars.push(`--font-sans: ${ty.sans};`);
  if (ty.display) vars.push(`--font-display: ${ty.display};`);
  if (vars.length) out.push(`<style>html:lang(${lang}) { ${vars.join(' ')} }</style>`);
  return out.join('\n');
}

// 로고: 공통 타이틀 바(G.topBar)의 표시와 같은 코발트 그라데이션 + 오른쪽 아래 빨간 점, 포털은 앱 칸 세 개를 더 그린다.
// favicon.svg 와 같은 모양. id 는 페이지에 로고가 하나뿐이라 고정.
const MARK = `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <defs><linearGradient id="mg-mark-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3355ff"/><stop offset="1" stop-color="#6a7dff"/></linearGradient></defs>
      <rect width="32" height="32" rx="9" fill="url(#mg-mark-g)"/>
      <rect x="7" y="7" width="8" height="8" rx="2.6" fill="#fff"/>
      <rect x="17" y="7" width="8" height="8" rx="2.6" fill="#fff" opacity=".55"/>
      <rect x="7" y="17" width="8" height="8" rx="2.6" fill="#fff" opacity=".55"/>
      <circle cx="21" cy="21" r="4.4" fill="#ff3b5c"/>
    </svg>`;

// 워드마크: 언어 파일의 brand { word, badge } (없으면 siteName 만)
function brandHtml(T) {
  const B = T.brand || {};
  return esc(B.word || T.siteName) + (B.badge ? `<span class="brand-sub">${esc(B.badge)}</span>` : '');
}

function header(lang, rel, T, opts = {}) {
  return `<header class="hub-top">
    <a class="brand" href="${G.relHref(G.fileOf(lang, rel), G.fileOf(lang, 'index.html'))}" aria-label="${esc(T.homeAria)}">
      ${MARK}
      <span class="brand-word">${brandHtml(T)}</span>
    </a>
    ${G.langSwitcher(lang, rel, opts)}
  </header>`;
}

// 아이콘(정적). script.js 의 iconWrap() 과 같은 구조 — 한쪽을 바꾸면 다른 쪽도 바꾼다.
function iconHtml(app, T, today) {
  const badge = CORE.isNew(app.added, today) ? `<span class="app-badge">${esc(T.ui.newBadge)}</span>` : '';
  return `<span class="app-icon-wrap"><span class="app-icon" aria-hidden="true"><span class="app-emoji">${app.emoji}</span></span>${badge}</span>`;
}

// 홈 화면 아이콘 한 칸. script.js 의 tileEl() 과 같은 구조.
function tileHtml(app, T, today) {
  return `      <li class="tile" data-id="${esc(app.id)}" data-cat="${app.category}">
        <a class="tile-link" href="${esc(app.href)}" title="${esc(app.desc)}" style="${CORE.hueStyle(app.id)}">
          ${iconHtml(app, T, today)}
          <span class="tile-name">${esc(app.title)}</span>
          <span class="tile-meta" aria-hidden="true"><span class="sk sk-tiny"></span></span>
        </a>
      </li>`;
}

// 최신순(added 늦은 앱 먼저, 같은 날은 SITES 순서) — "모든 미니앱" 격자 기본 정렬·hub-core sortApps('newest') 와 같다
function newestFirst(apps) {
  return apps.map((a, i) => [a, i]).sort((x, y) => y[0].added.localeCompare(x[0].added) || x[1] - y[1]).map((x) => x[0]);
}

// 오늘의 미니앱: 최신 CUR_POOL(10)개를 모두 그리고, CUR_SHOW(6)번째 뒤는 hidden (JS 없으면 최신 6개).
// 브라우저에서는 script.js 가 10개 중 무작위 6개를 골라 순서를 섞는다(사용자 지시 2026-10-04).
// 문구는 tools/i18n/<lang>.js 의 curation.items 에서 id 로 찾는다 — 최신 10개 중 문구가 없으면 생성 실패.
const CUR_POOL = 10;
const CUR_SHOW = 6;
function curationHtml(lang, T, apps, today) {
  const C = T.curation;
  if (!C || !Array.isArray(C.items)) return '';
  const copy = new Map(C.items.map((it) => [it.id, it]));
  const pool = newestFirst(apps).slice(0, CUR_POOL);
  const missing = pool.filter((a) => !copy.has(a.id)).map((a) => a.id);
  if (missing.length) {
    throw new Error(`[${lang}] curation.items 에 최신 ${CUR_POOL}개 앱 문구가 없음 → ${missing.join(', ')} (apps/hub/tools/i18n/${lang}.js 에 { id, kicker, headline, blurb } 추가)`);
  }
  const items = pool.map((a) => copy.get(a.id));
  if (!items.length) return '';

  const cards = items.map((it, i) => {
    const a = pool[i];
    return `      <li class="cur-item" data-id="${esc(a.id)}"${i >= CUR_SHOW ? ' hidden' : ''}>
        <a class="cur-card" href="${esc(a.href)}" style="${CORE.hueStyle(a.id)}">
          <span class="cur-art">
            <span class="cur-top">${iconHtml(a, T, today)}<span class="cur-kicker">${esc(it.kicker)}</span></span>
            <h3 class="cur-headline">${esc(it.headline)}</h3>
            <span class="cur-giant" aria-hidden="true">${a.emoji}</span>
          </span>
          <span class="cur-body">
            <span class="cur-blurb">${esc(it.blurb)}</span>
            <span class="cur-foot">
              <span class="cur-app"><span class="cur-name">${esc(a.title)}</span><span class="cur-stats" aria-hidden="true"><span class="sk sk-num"></span></span></span>
              <span class="cur-cta" aria-hidden="true">${esc(T.ui.play)}</span>
            </span>
          </span>
        </a>
      </li>`;
  }).join('\n');
  const dots = items
    .slice(0, CUR_SHOW)
    .map((it, i) => `<button type="button" class="cur-dot" data-i="${i}" aria-label="${esc(G.fmt(T.ui.goTo, { n: i + 1 }))}"${i === 0 ? ' aria-current="true"' : ''}></button>`)
    .join('');
  const chev = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  return `  <section class="cur" aria-labelledby="cur-h">
    <div class="cur-head">
      <h2 id="cur-h">${esc(C.h2)}</h2>
      <div class="cur-arrows">
        <button type="button" class="cur-arrow" data-dir="-1" aria-controls="cur-track" aria-label="${esc(T.ui.prev)}" disabled>${chev('M14.5 6 8.5 12l6 6')}</button>
        <button type="button" class="cur-arrow" data-dir="1" aria-controls="cur-track" aria-label="${esc(T.ui.next)}">${chev('M9.5 6l6 6-6 6')}</button>
      </div>
    </div>
    <p class="hub-total" id="hub-total" hidden></p>
    <ul class="cur-track" id="cur-track">
${cards}
    </ul>
    <div class="cur-dots">${dots}</div>
  </section>`;
}

// 푸터(포털 모든 페이지): © 브랜드 · 소개 · 가이드 · 이용약관 · 개인정보 · 문의 (AdSense 신뢰 페이지, 사용자 승인 2026-10-09)
const FOOTER_PAGES = [['about.html', 'about'], ['guides.html', 'guides'], ['terms.html', 'terms'], ['privacy.html', 'privacy'], ['contact.html', 'contact']];
function footerHtml(lang, rel, T) {
  const from = G.fileOf(lang, rel);
  const links = FOOTER_PAGES.map(([r, k]) => {
    const cur = r === rel ? ' aria-current="page"' : '';
    return `    <a href="${G.relHref(from, G.fileOf(lang, r))}"${cur}>${esc(T.footerNav[k])}</a>`;
  }).join('\n');
  return `  <footer class="hub-footer">
    <span>© <span id="year">${new Date().getFullYear()}</span> ${esc(G.brandOf(lang))}</span>
${links}
  </footer>`;
}

const CONTACT_EMAIL = 'contact@melgene.com';

// 글 섹션: [{ h, p: [...], list?: [...] }] — 모두 일반 텍스트(escape)
function sectionsHtml(sections) {
  return sections.map((s) => {
    const ps = [].concat(s.p || []).map((t) => `    <p>${esc(t)}</p>`).join('\n');
    const list = s.list && s.list.length ? `\n    <ul>\n${s.list.map((t) => `      <li>${esc(t)}</li>`).join('\n')}\n    </ul>` : '';
    return `    <h2>${esc(s.h)}</h2>\n${ps}${list}`;
  }).join('\n\n');
}

// 신뢰 페이지 공통 틀(소개·문의·이용약관·가이드 모음). privacy.html 과 같은 머리(hreflang·canonical·og·로더).
function docPage(lang, rel, P, body, ld) {
  const T = L10N[lang];
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const brand = G.brandOf(lang);
  const graph = Object.assign({ '@context': 'https://schema.org', url, name: P.h1, description: P.description, inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: brand, url: G.publicUrl(SITE_ROOT, lang, 'index.html') } }, ld || {});
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(brand)}">
<meta property="og:title" content="${esc(P.title)}">
<meta property="og:description" content="${esc(P.description)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${DISPLAY_FONT}">
${typographyHead(lang, T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${jsonLd(graph)}
</head>
<body class="hub">
<div class="hub-wrap">
  ${header(lang, rel, T)}
  <article class="doc">
    <h1>${esc(P.h1)}</h1>
${body}
  </article>

${footerHtml(lang, rel, T)}
</div>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
</body>
</html>
`;
}

function renderAbout(lang) {
  const P = L10N[lang].aboutPage;
  const body = `    <p class="doc-lead">${esc(P.lead)}</p>\n\n${sectionsHtml(P.sections)}`;
  return docPage(lang, 'about.html', P, body, { '@type': 'AboutPage' });
}

function renderContact(lang) {
  const P = L10N[lang].contactPage;
  const body = `    <p class="doc-lead">${esc(P.lead)}</p>
    <div class="doc-mail">
      <p class="doc-mail-h">${esc(P.emailH)}</p>
      <p><a class="doc-mail-a" href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
      <p class="doc-mail-note">${esc(P.emailNote)}</p>
    </div>

${sectionsHtml(P.sections)}`;
  return docPage(lang, 'contact.html', P, body, {
    '@type': 'ContactPage',
    mainEntity: { '@type': 'Organization', name: G.brandOf(lang), email: CONTACT_EMAIL, contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: CONTACT_EMAIL } },
  });
}

function renderTerms(lang) {
  const P = L10N[lang].termsPage;
  const body = `    <p class="doc-meta">${esc(P.updated)}</p>\n    <p class="doc-lead">${esc(P.lead)}</p>\n\n${sectionsHtml(P.sections)}`;
  return docPage(lang, 'terms.html', P, body, { '@type': 'WebPage' });
}

// 가이드가 있는 앱: apps/<id>/tools/guide/<lang>.js 12개 + 생성된 apps/<id>/guide.html (tools/gen-guides.js 가 앱 다음·포털 전에 만든다)
function hasGuide(id) {
  const dir = path.join(SITE_DIR, '..', id);
  return G.LOCALES.every((l) => fs.existsSync(path.join(dir, 'tools', 'guide', `${l.code}.js`))) && fs.existsSync(path.join(dir, 'guide.html'));
}

function renderGuides(lang) {
  const P = L10N[lang].guidesPage;
  const apps = newestFirst(appsFor(lang)).filter((a) => hasGuide(a.id));
  // 앱 주소(자리표시자 https://<id>.example.com/[<언어>/])에 guide.html — deploy-prep 이 미니앱 도메인으로 바꾸므로 melgene.com·miniapp 어디서든 같다
  const guideHref = (a) => (/\/$/.test(a.href) ? a.href : a.href.replace(/[^/]*$/, '')) + 'guide.html';
  const items = apps.map((a) => `      <li class="guide-item" style="${CORE.hueStyle(a.id)}">
        <a class="guide-link" href="${esc(guideHref(a))}">
          <span class="guide-emoji" aria-hidden="true">${a.emoji}</span>
          <span class="guide-text"><span class="guide-name">${esc(a.title)}</span><span class="guide-desc">${esc(a.desc)}</span><span class="guide-read">${esc(P.read)} →</span></span>
        </a>
        <a class="guide-play" href="${esc(a.href)}">${esc(P.play)}</a>
      </li>`).join('\n');
  const list = apps.length ? `    <ul class="guide-list">\n${items}\n    </ul>` : `    <p class="doc-empty">${esc(P.empty)}</p>`;
  const body = `    <p class="doc-lead">${esc(P.lead)}</p>\n${list}`;
  return docPage(lang, 'guides.html', P, body, {
    '@type': 'CollectionPage',
    mainEntity: { '@type': 'ItemList', numberOfItems: apps.length, itemListElement: apps.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: guideHref(a), name: a.title })) },
  });
}

function renderIndex(lang) {
  const T = L10N[lang];
  const B = T.browse;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const apps = appsFor(lang);
  const today = new Date();
  const brand = G.brandOf(lang);

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand,
    alternateName: ALT_NAMES.filter((n) => n !== brand),
    url,
    inLanguage: lang,
    description: T.meta.description,
  };
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: B.h2,
    inLanguage: lang,
    numberOfItems: apps.length,
    itemListElement: apps.map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: a.href,
      name: a.title,
      description: a.desc,
    })),
  };
  // 포털의 FAQ 는 화면에 보이므로(맨 아래) FAQPage 를 넣는다 (스킬 7번 포털 예외). 앱 페이지에는 넣지 않는다.
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: lang,
    mainEntity: T.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };

  const counts = { all: apps.length };
  CATS.forEach((c) => { counts[c] = apps.filter((a) => a.category === c).length; });
  const chips = ['all', ...CATS]
    .filter((c) => counts[c] > 0)
    .map((c) => `        <button type="button" class="chip" data-cat="${c}" aria-pressed="${c === 'all'}">${esc(T.ui.cats[c])}</button>`)
    .join('\n');
  // 기본 정렬 = 최신순 (사용자 지시 2026-10-02) — 처음 그리는 아이콘 순서도 최신순
  const sortOpts = ['newest', 'popular', 'rating']
    .map((s) => `<option value="${s}"${s === 'newest' ? ' selected' : ''}>${esc(T.ui.sorts[s])}</option>`)
    .join('');
  const tiles = newestFirst(apps).map((a) => tileHtml(a, T, today)).join('\n');
  const faq = T.faq.map(([q, a]) => `      <details class="faq-item"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n');

  const countText = apps.length === 1 ? T.ui.countOne : G.fmt(T.ui.count, { n: apps.length });

  return `<!DOCTYPE html>
<html lang="${lang}" class="no-js">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<script>document.documentElement.className = document.documentElement.className.replace('no-js', 'js');</script>
<title>${esc(T.meta.title)}</title>
<meta name="description" content="${esc(T.meta.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(brand)}">
<meta property="og:title" content="${esc(T.meta.ogTitle)}">
<meta property="og:description" content="${esc(T.meta.ogDescription)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f3f5fa" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1320" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${DISPLAY_FONT}">
${typographyHead(lang, T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">

${jsonLd(website)}
${jsonLd(itemList)}
${jsonLd(faqLd)}
</head>
<body class="hub">
<div class="hub-wrap">
  ${header(lang, rel, T, { suggest: lang === G.DEFAULT_LOCALE })}

  <h1 class="page-h1"><span class="page-h1-brand">${esc(brand)}</span><span class="page-h1-sep" aria-hidden="true"> · </span><span class="page-h1-tag">${esc(T.h1)}</span></h1>

${curationHtml(lang, T, apps, today)}

  <section class="browse" aria-labelledby="browse-h">
    <div class="browse-head">
      <h2 id="browse-h">${esc(B.h2)}<span class="browse-count" id="hub-count" aria-live="polite">${esc(countText)}</span></h2>
      <label class="sort">
        <span class="visually-hidden">${esc(B.sortLabel)}</span>
        <select id="hub-sort" class="sort-select">${sortOpts}</select>
      </label>
    </div>
    <div class="tools">
      <div class="search">
        <svg class="search-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5 20 20" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        <label class="visually-hidden" for="hub-q">${esc(B.searchLabel)}</label>
        <input id="hub-q" class="search-input" type="search" placeholder="${esc(B.searchPlaceholder)}" autocomplete="off" enterkeyhint="search" spellcheck="false">
      </div>
      <div class="chips" role="group" aria-label="${esc(B.catLabel)}">
${chips}
      </div>
    </div>
    <div class="shelf">
      <ul class="grid is-loading" id="hub-grid">
${tiles}
      </ul>
      <div class="apps-empty" id="hub-empty" hidden>
        <p id="hub-empty-text"></p>
        <button type="button" class="btn-ghost" id="hub-reset">${esc(T.ui.reset)}</button>
      </div>
    </div>
  </section>

  <div class="mg-ad"></div>

  <section class="faq" aria-labelledby="faq-h">
    <h2 id="faq-h">${esc(T.faqTitle)}</h2>
    <div class="faq-list">
${faq}
    </div>
  </section>

${footerHtml(lang, rel, T)}
</div>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PAGE_I18N', T.ui)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}hub-core.js"></script>
<script src="${root}script.js"></script>
</body>
</html>
`;
}

function renderPrivacy(lang) {
  const T = L10N[lang];
  const P = T.privacy;
  const rel = 'privacy.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const sections = P.sections.map(([h, body]) => `    <h2>${esc(h)}</h2>\n    <p>${body}</p>`).join('\n\n');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(G.brandOf(lang))}">
<meta property="og:title" content="${esc(P.title)}">
<meta property="og:description" content="${esc(P.description)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${DISPLAY_FONT}">
${typographyHead(lang, T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
</head>
<body class="hub">
<div class="hub-wrap">
  ${header(lang, rel, T)}
  <article class="doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </article>

${footerHtml(lang, rel, T)}
</div>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
</body>
</html>
`;
}

const PAGES = ['index.html', 'privacy.html', 'about.html', 'contact.html', 'terms.html', 'guides.html'];
function main() {
  let n = 0;
  G.LOCALES.forEach(({ code }) => {
    G.writeOut(SITE_DIR, G.fileOf(code, 'index.html'), renderIndex(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'privacy.html'), renderPrivacy(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'about.html'), renderAbout(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'contact.html'), renderContact(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'terms.html'), renderTerms(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'guides.html'), renderGuides(code));
    n += 6;
  });
  const guided = SITES.filter((s) => hasGuide(s.id)).length;
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy + about + contact + terms + guides) = HTML ${n}개, 앱 카드 ${SITES.length}개, 가이드 ${guided}개`);
  if (G.MODE !== 'variant') {
    G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, PAGES));
    console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length * PAGES.length}개, hreflang 대체 링크 포함)`);
  }
}

main();
