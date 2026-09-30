#!/usr/bin/env node
/**
 * 나만의 유령 만들기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 편집기(몸·색·눈·입·볼·모자·들고 있는 것·배경·이름) → 끝 화면(완성 유령 + 이미지 저장 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 부품·그림·공유 인코딩은 ghost-core.js, 화면 동작은 ghost.js.
 * 공유 링크(#d=...)는 언어 없는 주소라 받는 사람은 자기 언어로 본다.
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·물음표 실루엣 유령·h1(현지 검색어)·훅·시작 버튼. 부품 목록·SEO 글·FAQ·광고 없음.
 *   - 편집기 화면에 mg-ad 1자리(편집기 아래). 끝 화면 = 완성 유령(결과) → <div data-mg-end="ghost">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'ghost-core.js'));

const SITE_ID = 'ghost';
const SITE_ROOT = 'https://ghost.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

// 언어별 글꼴(tools/i18n/<lang>.js 의 fonts) → 글꼴 링크 + :root 변수 (style.css 뒤에 둔다)
function fontHead(T) {
  const F = T.fonts;
  const vars = [
    `--font-display: ${clean(F.display)}, var(--font-sans)`,
    `--display-weight: ${Number(F.displayWeight) || 400}`,
    `--wb: ${WORD_BREAKS.includes(F.wordBreak) ? F.wordBreak : 'normal'}`,
    `--hyphens: ${HYPHENS.includes(F.hyphens) ? F.hyphens : 'manual'}`,
  ];
  if (F.sans) vars.push(`--font-sans: ${clean(F.sans)}, -apple-system, BlinkMacSystemFont, sans-serif`);
  return {
    links: [
      '<link rel="preconnect" href="https://fonts.googleapis.com">',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      `<link rel="stylesheet" href="${PRETENDARD}">`,
      `<link rel="stylesheet" href="${esc(F.css)}">`,
    ].join('\n'),
    vars: `<style>:root { ${vars.join('; ')}; }</style>`,
  };
}

function head(lang, T, o) {
  const root = G.rootPrefix(o.file);
  const f = fontHead(T);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#1a1440">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${o.url}">
${G.hreflangTags(SITE_ROOT, o.rel)}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(G.brandOf(lang))}">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.ogDesc || o.desc)}">
<meta property="og:image" content="${o.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${o.url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
${f.links}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${f.vars}
${o.extraHead || ''}
</head>`;
}

function footer(T, lang, file) {
  const privacyHref = G.relHref(file, G.fileOf(lang, 'privacy.html'));
  return `  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="${privacyHref}">${esc(T.privacyLink)}</a>
  </footer>`;
}

function scripts(root, extra) {
  return `<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${extra.inline || ''}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
${(extra.src || []).map((s) => `<script src="${root}${s}"></script>`).join('\n')}`;
}

// ---------------------------------------------------------------
// 시작 + 편집기 + 끝 화면 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const E = T.editor;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const teaser = CORE.render(CORE.defaults(), { prefix: 'hero', blank: true, simple: true, attrs: ' aria-hidden="true" focusable="false"' });
  const tabs = CORE.PARTS.map((p, i) => `<button type="button" class="gh-tab${i === 0 ? ' is-on' : ''}" role="tab" id="tab-${p.id}" data-part="${p.id}" aria-selected="${i === 0}" aria-controls="options">${esc(E.tabs[p.id])}</button>`).join('\n      ');
  // 브라우저(ghost.js)에서 쓰는 문구
  const runtime = { editor: E, result: R, meta: { title: T.meta.title } };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="gh-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="gh-shell">
  <!-- 시작 화면: 티징만 (배지·물음표 실루엣 유령·h1·훅·시작 버튼) — 부품 목록·FAQ·광고 없음 -->
  <section id="screen-start" class="gh-screen gh-start">
    <p class="gh-badge">${esc(S.badge)}</p>
    <div class="gh-hero-art">${teaser}</div>
    <h1 class="gh-h1"><span class="gh-kicker">${esc(S.h1Kicker)}</span><span class="gh-h1-main">${S.h1Html}</span></h1>
    <p class="gh-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="gh-btn gh-btn-primary" type="button">${esc(S.start)}</button>
  </section>

  <!-- 편집기 (진행 중 화면의 광고 1자리: 편집기 아래) -->
  <section id="screen-edit" class="gh-screen gh-edit" hidden>
    <h2 class="gh-edit-title">${esc(E.title)}</h2>
    <button id="preview" class="gh-preview" type="button" aria-label="${esc(E.previewAria)}"><span id="preview-art" class="gh-preview-art"></span></button>
    <p class="gh-hint">${esc(E.hint)}</p>
    <div id="tabs" class="gh-tabs" role="tablist" aria-label="${esc(E.tabsAria)}">
      ${tabs}
    </div>
    <div id="options" class="gh-options" role="tabpanel" aria-labelledby="tab-body"></div>
    <label class="gh-name" for="name-input"><span class="gh-name-label">${esc(E.nameLabel)}</span>
      <input id="name-input" class="gh-name-input" type="text" maxlength="${CORE.MAX_NAME * 3}" autocomplete="off" enterkeyhint="done" spellcheck="false" placeholder="${esc(E.namePlaceholder)}">
    </label>
    <div class="gh-actions">
      <button id="random-btn" class="gh-btn gh-btn-soft" type="button"><span aria-hidden="true">🎲</span> ${esc(E.random)}</button>
      <button id="done-btn" class="gh-btn gh-btn-primary" type="button">${esc(E.done)}</button>
    </div>
    <div class="mg-ad"></div>
  </section>

  <!-- 끝 화면: 완성 유령(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="gh-screen gh-end" hidden>
    <article class="gh-card" aria-labelledby="end-name">
      <p id="end-eyebrow" class="gh-eyebrow"></p>
      <div id="end-art" class="gh-end-art" role="img"></div>
      <h2 id="end-name" class="gh-end-name"></h2>
      <div class="gh-end-actions">
        <button id="save-btn" class="gh-btn gh-btn-primary gh-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="edit-btn" class="gh-btn gh-btn-soft gh-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
      <p id="save-status" class="gh-save-status" aria-live="polite"></p>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['ghost-core.js', 'ghost.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 개인정보처리방침 (privacy.html)
// ---------------------------------------------------------------
function renderPrivacy(lang) {
  const T = L10N[lang];
  const P = T.privacy;
  const rel = 'privacy.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const sections = P.sections.map(([h, body]) => `    <h2>${esc(h)}</h2>\n    <p>${body}</p>`).join('\n\n');

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang) })}
<body class="gh-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="gh-shell">
  <div class="gh-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </div>

  <footer class="site-footer">
    <a href="./">${esc(P.back)}</a>
  </footer>
</main>
${scripts(root, {})}
</body>
</html>
`;
}

function main() {
  let n = 0;
  G.LOCALES.forEach(({ code }) => {
    G.writeOut(SITE_DIR, G.fileOf(code, 'index.html'), renderIndex(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'privacy.html'), renderPrivacy(code));
    n += 2;
  });
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy) = HTML ${n}개`);
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
  console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 포함)`);
}

main();
