#!/usr/bin/env node
/**
 * 눈꽃 만들기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 만들기(canvas 한 장 + 슬라이더 3개 + 도구 버튼) → 끝 화면(눈꽃 그림 + 저장·계속 만들기 + 공통 끝 화면).
 *                                     받은 링크(#d=)는 끝 화면으로 바로 열린다(나도 만들기).
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 선택지·무작위·공유 인코딩은 snowflake-core.js, 화면 동작·canvas 그림은 snowflake.js.
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·그림·h1(현지 검색어)·훅·시작 버튼·맨 아래 mg-ad-start 1개.
 *   - 만들기 화면에 mg-ad 1자리(맨 아래). 끝 화면 = 눈꽃 그림 → <div data-mg-end="snowflake">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'snowflake';
const SITE_ROOT = 'https://snowflake.example.com';
const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'snowflake-core.js'));
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

function fontHead(T) {
  const F = T.fonts;
  const vars = [
    `--font-display: ${clean(F.display)}, var(--font-sans)`,
    `--display-weight: ${Number(F.displayWeight) || 400}`,
    `--font-script: ${clean(F.script)}, var(--font-display)`,
    `--script-weight: ${Number(F.scriptWeight) || 400}`,
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
<meta name="theme-color" content="#0b2545">
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
// 시작 + 만들기 + 끝 화면 (index.html)
// ---------------------------------------------------------------
function sliders(E) {
  const L = E.labels;
  const lv = E.levels;
  return `<div class="sf-sliders">
      <label class="sf-slider" for="in-n">
        <span class="sf-slider-head"><span>${esc(L.arms)}</span><output id="out-n" for="in-n">4</output></span>
        <input id="in-n" type="range" min="${CORE.RANGE.n[0]}" max="${CORE.RANGE.n[1]}" step="1" value="${CORE.DEFAULTS.n}">
      </label>
      <label class="sf-slider" for="in-c">
        <span class="sf-slider-head"><span>${esc(L.complexity)}</span><output id="out-c" for="in-c">${esc(lv.complexity[CORE.DEFAULTS.c - 1])}</output></span>
        <input id="in-c" type="range" min="${CORE.RANGE.c[0]}" max="${CORE.RANGE.c[1]}" step="1" value="${CORE.DEFAULTS.c}">
      </label>
      <label class="sf-slider" for="in-z">
        <span class="sf-slider-head"><span>${esc(L.size)}</span><output id="out-z" for="in-z">${esc(lv.size[CORE.DEFAULTS.z])}</output></span>
        <input id="in-z" type="range" min="${CORE.RANGE.z[0]}" max="${CORE.RANGE.z[1]}" step="1" value="${CORE.DEFAULTS.z}">
      </label>
    </div>`;
}

function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const E = T.editor;
  const R = T.result;
  const B = E.buttons;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = { lang, siteName: T.siteName, editor: E, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="sf-body">
${G.topBar(lang, rel)}

<main class="sf-shell">
  <!-- 시작 화면: 티징만 (배지·그림·h1·훅·시작 버튼·맨 아래 광고 1개) — 도구·FAQ 없음 -->
  <section id="screen-start" class="sf-screen sf-start">
    <p class="sf-badge">${esc(S.badge)}</p>
    <div class="sf-hero" aria-hidden="true"><span class="sf-hero-main">❄️</span><span class="sf-hero-a">✦</span><span class="sf-hero-b">❄</span><span class="sf-hero-c">✧</span></div>
    <h1 class="sf-h1"><span class="sf-kicker">${esc(S.h1Kicker)}</span><span class="sf-h1-main">${S.h1Html}</span></h1>
    <p class="sf-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="sf-btn sf-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 만들기 (진행 중 화면의 광고 1자리: 맨 아래) -->
  <section id="screen-edit" class="sf-screen sf-edit" hidden>
    <h2 class="sf-edit-title">${esc(E.title)}</h2>
    <div class="sf-stage"><canvas id="flake-canvas" class="sf-canvas" width="${CORE.SIZE}" height="${CORE.SIZE}" role="img" aria-label="${esc(E.canvasAria)}"></canvas></div>
    ${sliders(E)}
    <div class="sf-tools">
      <button id="new-btn" class="sf-tool" type="button">${esc(B.newFlake)}</button>
      <button id="shape-btn" class="sf-tool" type="button"><span class="sf-tool-label">${esc(B.shape)}</span> <span id="shape-name" class="sf-tool-value"></span></button>
      <button id="color-btn" class="sf-tool" type="button"><span class="sf-tool-label">${esc(B.color)}</span> <span id="color-name" class="sf-tool-value"></span></button>
      <button id="save-btn" class="sf-tool" type="button">${esc(B.save)}</button>
      <button id="share-btn" class="sf-tool" type="button">${esc(B.share)}</button>
    </div>
    <p id="edit-status" class="sf-status" aria-live="polite"></p>
    <button id="done-btn" class="sf-btn sf-btn-primary" type="button">${esc(B.done)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 끝 화면: 눈꽃(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="sf-screen sf-end" hidden>
    <article class="sf-card" aria-labelledby="end-title">
      <p id="end-eyebrow" class="sf-eyebrow"></p>
      <h2 id="end-title" class="sf-sr"></h2>
      <div class="sf-end-stage">
        <canvas id="end-canvas" class="sf-canvas sf-end-canvas" width="${CORE.SIZE}" height="${CORE.SIZE}" role="img" aria-label="${esc(R.eyebrowMine)}"></canvas>
      </div>
      <div class="sf-end-actions">
        <button id="end-save" class="sf-btn sf-btn-primary sf-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="end-edit" class="sf-btn sf-btn-soft sf-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
      <p id="end-status" class="sf-status" aria-live="polite"></p>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['snowflake-core.js', 'snowflake.js'] })}
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
<body class="sf-body">
${G.topBar(lang, rel)}
<main class="sf-shell">
  <div class="sf-doc">
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
  if (G.MODE !== 'variant') {
    G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
    console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 포함)`);
  }
}

main();
