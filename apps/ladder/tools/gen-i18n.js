#!/usr/bin/env node
/**
 * 사다리타기의 정적 페이지를 언어별로 생성한다.
 *   index.html (영어는 루트) / ko,ja,zh,fr,de,th,vi,es 하위 폴더의 index.html
 *   privacy.html 도 각 언어 경로에
 *   sitemap.xml (모든 언어 URL + xhtml:link hreflang)
 * 문구는 tools/i18n/<lang>.js. ladder.js 가 쓰는 문자열(ui)은 페이지에 인라인(window.PAGE_I18N)된다.
 * FAQ(T.faq)는 공통 끝 화면(data-mg-end)이 그리도록 window.MG_FAQ 로 인라인한다 — 화면에는 별도 섹션을 두지 않는다.
 * 공유 링크(#d=...)는 현재 페이지 주소를 기준으로 만들어지므로 보낸 사람의 언어 페이지로 열린다.
 *
 * 실행: node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ROOT = 'https://ladder.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

function renderIndex(lang) {
  const T = L10N[lang];
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const S = T.setup;
  const P = T.play;

  const presets = ['lunch', 'coffee', 'clean', 'order']
    .map((k) => `        <button type="button" class="ldr-preset-btn" data-preset="${k}">${esc(S.presets[k])}</button>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(T.meta.title)}</title>
<meta name="description" content="${esc(T.meta.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(T.meta.ogTitle)}">
<meta property="og:description" content="${esc(T.meta.ogDescription)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">

<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${T.fontCss}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">

${G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.app.name, description: T.app.description, category: 'vote', image: ogImage(lang) })}
</head>
<body class="ldr-body">

<div class="ldr-shell">
  ${G.topBar(lang, rel, { suggest: lang === G.DEFAULT_LOCALE })}

  <!-- 시작 화면: 티징(훅 한 줄 + 시작에 필요한 입력 + 시작 버튼)만 -->
  <section id="screen-setup" class="ldr-setup">
    <div class="ldr-badge">${esc(S.badge)}</div>
    <h1>${S.h1Html}</h1>
    <p class="ldr-hook">${esc(S.hook)}</p>

    <div class="ldr-card">
      <div class="ldr-field-label">${esc(S.countLabel)}</div>
      <div class="ldr-stepper">
        <button type="button" id="count-minus" class="ldr-step-btn" aria-label="${esc(S.minusAria)}">−</button>
        <div class="ldr-step-num" id="count-num">4</div>
        <button type="button" id="count-plus" class="ldr-step-btn" aria-label="${esc(S.plusAria)}">+</button>
      </div>

      <div class="ldr-field-label">${esc(S.presetLabel)}</div>
      <div class="ldr-presets" id="preset-row">
${presets}
      </div>

      <div class="ldr-field-label">${esc(S.namesLabel)}</div>
      <div id="names-list" class="ldr-edit-list"></div>

      <div class="ldr-field-label-row">
        <div class="ldr-field-label">${esc(S.resultsLabel)}</div>
        <button type="button" id="shuffle-results-btn" class="ldr-mini-btn">${esc(S.shuffle)}</button>
      </div>
      <div id="results-list" class="ldr-edit-list"></div>

      <button type="button" id="build-btn" class="ldr-btn ldr-btn-primary">${esc(S.build)}</button>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 플레이 화면 -->
  <section id="screen-play" class="ldr-play">
    <div class="ldr-play-toolbar">
      <button type="button" id="edit-btn" class="ldr-mini-btn">${esc(P.edit)}</button>
      <button type="button" id="rebuild-btn" class="ldr-mini-btn ldr-mini-btn-accent">${esc(P.rebuild)}</button>
    </div>

    <div class="ldr-board" id="ladder-board">
      <div class="ldr-row ldr-players" id="players-row"></div>
      <div class="ldr-canvas-wrap" id="canvas-wrap">
        <canvas id="ladder-canvas"></canvas>
      </div>
      <div class="ldr-row ldr-results" id="results-row"></div>
    </div>
    <p class="ldr-hint">${esc(P.hint)}</p>

    <button type="button" id="reveal-all-btn" class="ldr-btn ldr-btn-secondary">${esc(P.revealAll)}</button>

    <!-- 결과(앱 결과) 바로 아래에 공통 끝 화면: 별점·하트 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱 -->
    <div id="results-section" class="ldr-results-section">
      <div class="ldr-section-title">${esc(P.finalTitle)}</div>
      <table class="ldr-results-table" id="results-table"></table>
      <div data-mg-end="ladder"></div>
    </div>

  </section>

  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="privacy.html">${esc(T.privacyLink)}</a>
  </footer>
</div>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PAGE_I18N', T.ui)}
${G.scriptJson('MG_FAQ', T.faq)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}ladder-core.js"></script>
<script src="${root}ladder.js"></script>
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
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${T.fontCss}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
<style>
  .doc { padding: 36px 0 40px; line-height: 1.8; font-size: 14.5px; color: var(--ink-dim); }
  .doc h1 { font-family: var(--font-display); font-size: 24px; color: var(--ink); margin-bottom: 24px; }
  .doc h2 { font-size: 16px; font-weight: 800; color: var(--ink); margin: 28px 0 10px; }
  .doc a { color: var(--violet); text-decoration: underline; }
</style>
</head>
<body class="ldr-body">
<div class="ldr-shell">
  ${G.topBar(lang, rel)}
  <div class="doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </div>

  <footer class="site-footer">
    <a href="./index.html">${esc(P.back)}</a>
  </footer>
</div>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
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
