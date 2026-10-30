#!/usr/bin/env node
/**
 * 새해 목표 빙고 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html — 시작 화면(티징·판 크기·시작 버튼 → 맨 아래 mg-ad-start)
 *                                  → 편집 화면(제목·크기·자유칸·색·칸 글·아이디어 채우기·섞기 → 완성)
 *                                  → 완성 화면(캔버스 카드·도장·빙고 줄·이미지 저장·판 링크 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어 — guide.html 은 tools/gen-guides.js 가 더한다)
 * 문구는 tools/i18n/<lang>.js, 로직은 bingo-core.js, 화면 동작은 bingo.js(칸·색 견본·캔버스는 JS 가 그린다).
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 = 티징 + 판 크기 + 시작 버튼, 마지막 요소 mg-ad-start 1개.
 *   - 완성 화면 결과 바로 아래 <div data-mg-end="bingo">. FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bingo-core.js'));

const SITE_ID = 'bingo';
const SITE_ROOT = 'https://bingo.example.com';
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
<meta name="theme-color" content="#fff4e6">
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

function sizeSeg(id, U, labelId) {
  return `<div class="bg-seg" id="${id}" role="group" aria-labelledby="${labelId}">
${CORE.SIZES.map((s) => `          <button type="button" class="bg-seg-btn" data-size="${s}" aria-pressed="${s === 5 ? 'true' : 'false'}">${s}×${s}</button>`).join('\n')}
        </div>`;
}

function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = { lang, ui: U, errors: T.errors, themes: T.themes, ideas: T.ideas, brand: T.og.brand };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="bg-body">
${G.topBar(lang, rel)}

<main class="bg-shell">
  <!-- 시작 화면: 티징(h1·훅) → 판 크기 → 시작 / 이어 하기 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-start" class="bg-screen">
    <div class="bg-logo" aria-hidden="true"><span>🎯</span></div>
    <h1 class="bg-h1"><span class="bg-kicker">${esc(H.h1Kicker)}</span><span class="bg-h1-main">${H.h1Html}</span></h1>
    <p class="bg-hook">${esc(H.hook)}</p>
    <div class="bg-mini" aria-hidden="true"><i></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i><i></i><i class="on"></i><i></i></div>
    <p id="link-err" class="bg-error" role="alert" hidden>${esc(T.errors.badLink)}</p>
    <div class="bg-start-box">
      <span class="bg-label" id="lbl-size-start">${esc(U.sizeLabel)}</span>
      ${sizeSeg('size-start', U, 'lbl-size-start')}
      <button type="button" id="start-btn" class="bg-btn bg-btn-primary">${esc(U.startBtn)}</button>
      <button type="button" id="continue-btn" class="bg-btn bg-btn-ghost" hidden>${esc(U.continueBtn)}</button>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 편집 화면 -->
  <section id="screen-edit" class="bg-screen" hidden>
    <h2 class="bg-h2">${esc(U.editH)}</h2>
    <div class="bg-card bg-settings">
      <div class="bg-field"><label class="bg-label" for="title-input">${esc(U.titleLabel)}</label>
        <input id="title-input" class="bg-input" type="text" maxlength="${CORE.LIMIT.title}" autocomplete="off" enterkeyhint="done">
      </div>
      <div class="bg-row">
        <div class="bg-field"><span class="bg-label" id="lbl-size-edit">${esc(U.sizeLabel)}</span>
          ${sizeSeg('size-edit', U, 'lbl-size-edit')}
        </div>
        <label class="bg-switch" id="free-wrap"><input type="checkbox" id="free-toggle" role="switch"><span class="bg-switch-ui" aria-hidden="true"></span><span class="bg-switch-t">${esc(U.freeLabel)}</span></label>
      </div>
      <span class="bg-label" id="lbl-theme">${esc(U.themeLabel)}</span>
      <div class="bg-themes" id="themes" role="group" aria-labelledby="lbl-theme"></div>
    </div>

    <div class="bg-card bg-editor">
      <div id="grid" class="bg-grid" role="group" aria-label="${esc(U.editH)}"></div>
      <div class="bg-cellbox">
        <label class="bg-label" id="cell-label" for="cell-input"></label>
        <div class="bg-cellrow">
          <input id="cell-input" class="bg-input" type="text" maxlength="${CORE.LIMIT.cell}" autocomplete="off" placeholder="${esc(U.cellPh)}" enterkeyhint="next">
          <button type="button" id="next-btn" class="bg-mini-btn">${esc(U.next)}</button>
        </div>
      </div>
      <p class="bg-filled" id="filled"></p>
      <div class="bg-tools">
        <button type="button" id="ideas-btn" class="bg-tool">${esc(U.ideas)}</button>
        <button type="button" id="shuffle-btn" class="bg-tool">${esc(U.shuffle)}</button>
        <button type="button" id="clear-btn" class="bg-tool">${esc(U.clear)}</button>
      </div>
    </div>
    <button type="button" id="done-btn" class="bg-btn bg-btn-primary">${esc(U.done)}</button>
    <p id="edit-err" class="bg-error" role="alert" hidden></p>
    <p class="bg-local">${esc(U.localNote)}</p>
  </section>

  <!-- 완성 화면: 카드(도장·빙고 줄) → 저장·링크·고치기 → 공통 끝 화면 -->
  <section id="screen-done" class="bg-screen" hidden>
    <p id="shared-note" class="bg-shared" hidden>${esc(U.sharedNote)}</p>
    <h2 class="bg-h2" id="done-h">${esc(U.doneH)}</h2>
    <div class="bg-cardwrap"><canvas id="board-canvas" class="bg-canvas" width="1080" height="1350" role="img" tabindex="0"></canvas></div>
    <p class="bg-tap" id="tap-hint">${esc(U.tapHint)}</p>
    <div class="bg-score" id="score"><p class="bg-score-n" id="score-lines"></p><p class="bg-score-g" id="score-goals"></p></div>
    <div class="bg-actions">
      <button type="button" id="download-btn" class="bg-btn bg-btn-primary">${esc(U.download)}</button>
      <button type="button" id="link-btn" class="bg-btn bg-btn-ghost">${esc(U.link)}</button>
      <button type="button" id="edit-btn" class="bg-btn bg-btn-ghost">${esc(U.edit)}</button>
    </div>
    <p id="live" class="visually-hidden" aria-live="polite"></p>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bingo-core.js', 'bingo.js'] })}
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
  const homeHref = G.relHref(file, G.fileOf(lang, 'index.html'));

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang) })}
<body class="bg-body">
${G.topBar(lang, rel)}
<main class="bg-shell">
  <div class="bg-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </div>

  <footer class="site-footer">
    <a href="${homeHref}">${esc(P.back)}</a>
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
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy) = HTML ${n}개${G.MODE === 'variant' ? ' (숨은 변형 _l/)' : ''}`);
  if (G.MODE !== 'variant') {
    G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
    console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 포함)`);
  }
}

main();
