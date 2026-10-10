#!/usr/bin/env node
/**
 * 랜덤 숫자 뽑기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 범위·개수·옵션 → 뽑기) → 뽑은 뒤 결과 + 최근 10번 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 뽑기는 randnum-core.js, 화면 동작은 randnum.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱(dice·roulette 처럼) — 첫 화면(입력·뽑기 버튼) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 뽑은 뒤 나타나는 결과(#result) 안에 결과 카드 → 최근 기록 → <div data-mg-end="randnum">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'randnum-core.js'));

const SITE_ID = 'randnum';
const SITE_ROOT = 'https://randnum.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const MONO = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&display=swap';
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
      `<link rel="stylesheet" href="${MONO}">`,
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
<meta name="theme-color" content="#14112b">
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
// 한 화면 도구 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const D = CORE.DEFAULTS;
  // 브라우저(randnum.js)에서 쓰는 문구
  const runtime = { lang, ui: U, errors: T.errors, result: T.result, history: T.history };
  const presetBtns = CORE.PRESETS.map((p) => `<button type="button" class="rn-chip" data-preset="${p.id}" aria-pressed="${p.a === D.a && p.b === D.b}">${p.a}–${p.b}</button>`).join('\n        ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="rn-body">
${G.topBar(lang, rel)}

<main class="rn-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 범위·개수·옵션 → 뽑기 → (뽑은 뒤) 결과 + 최근 기록 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-rn" class="rn-screen">
    <h1 class="rn-h1"><span class="rn-kicker">${esc(H.h1Kicker)}</span><span class="rn-h1-main">${H.h1Html}</span></h1>
    <p class="rn-hook">${esc(H.hook)}</p>

    <form id="rn-form" class="rn-card rn-settings" novalidate autocomplete="off">
      <p class="rn-label" id="preset-label">${esc(U.presetsLabel)}</p>
      <div class="rn-presets" role="group" aria-labelledby="preset-label">
        ${presetBtns}
      </div>

      <div class="rn-range">
        <label class="rn-field" for="min"><span class="rn-label">${esc(U.minLabel)}</span>
          <input id="min" class="rn-input" type="number" step="1" value="${D.a}" min="${-CORE.LIMIT}" max="${CORE.LIMIT}" enterkeyhint="go"></label>
        <span class="rn-range-arrow" aria-hidden="true">→</span>
        <label class="rn-field" for="max"><span class="rn-label">${esc(U.maxLabel)}</span>
          <input id="max" class="rn-input" type="number" step="1" value="${D.b}" min="${-CORE.LIMIT}" max="${CORE.LIMIT}" enterkeyhint="go"></label>
      </div>

      <div class="rn-count">
        <label class="rn-label" for="count">${esc(U.countLabel)}</label>
        <div class="rn-stepper">
          <button type="button" id="count-dec" class="rn-step" aria-label="${esc(U.countDec)}">−</button>
          <input id="count" class="rn-input rn-input-count" type="number" step="1" inputmode="numeric" value="${D.n}" min="1" max="${CORE.MAX_COUNT}" enterkeyhint="go">
          <button type="button" id="count-inc" class="rn-step" aria-label="${esc(U.countInc)}">+</button>
        </div>
      </div>

      <div class="rn-toggles">
        <label class="rn-switch"><input type="checkbox" id="dup" role="switch"${D.u ? ' checked' : ''}><span class="rn-switch-ui" aria-hidden="true"></span><span>${esc(U.dupLabel)}</span></label>
        <label class="rn-switch"><input type="checkbox" id="sort" role="switch"${D.s ? ' checked' : ''}><span class="rn-switch-ui" aria-hidden="true"></span><span>${esc(U.sortLabel)}</span></label>
      </div>

      <button type="button" id="more-btn" class="rn-more-btn" aria-expanded="false" aria-controls="more">${esc(U.more)}</button>
      <div id="more" class="rn-more" hidden>
        <label class="rn-field" for="exclude"><span class="rn-label">${esc(U.excludeLabel)}</span>
          <input id="exclude" class="rn-input rn-input-text" type="text" inputmode="text" placeholder="${esc(U.excludePh)}" maxlength="2000" aria-describedby="exclude-hint"></label>
        <p class="rn-hint" id="exclude-hint">${esc(U.excludeHint)}</p>
        <label class="rn-field" for="label"><span class="rn-label">${esc(U.titleLabel)}</span>
          <input id="label" class="rn-input rn-input-text" type="text" placeholder="${esc(U.titlePh)}" maxlength="${CORE.MAX_LABEL}"></label>
      </div>
    </form>

    <p id="error" class="rn-error" role="alert" hidden></p>
    <button type="button" id="draw-btn" class="rn-btn rn-btn-primary">${esc(U.draw)}</button>
    <p class="rn-fair">${esc(U.fair)}</p>

    <div id="result" class="rn-result" hidden>
      <div class="rn-card rn-result-card" id="result-card">
        <p id="shared-badge" class="rn-badge" hidden>${esc(T.result.sharedBadge)}</p>
        <h2 class="rn-h2" id="res-title">${esc(T.result.heading)}</h2>
        <p id="res-label" class="rn-res-label" hidden></p>
        <ul id="res-tags" class="rn-tags"></ul>
        <div id="reels" class="rn-reels" aria-hidden="true"></div>
        <p id="live" class="visually-hidden" aria-live="polite"></p>
        <p id="shared-note" class="rn-shared-note" hidden></p>
        <div class="rn-actions">
          <button type="button" id="copy-btn" class="rn-btn rn-btn-ghost">${esc(T.result.copy)}</button>
          <button type="button" id="link-btn" class="rn-btn rn-btn-ghost">${esc(T.result.copyLink)}</button>
        </div>
      </div>
      <div class="rn-card rn-history-card" id="history-card" hidden>
        <div class="rn-history-head">
          <h2 class="rn-h2" id="history-title">${esc(T.history.title)}</h2>
          <button type="button" id="history-clear" class="rn-mini">${esc(T.history.clear)}</button>
        </div>
        <p class="rn-history-note">${esc(T.history.note)}</p>
        <ol id="history-list" class="rn-history-list" aria-labelledby="history-title"></ol>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['randnum-core.js', 'randnum.js'] })}
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
  const homeHref = G.relHref(file, G.fileOf(lang, 'index.html'));

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang) })}
<body class="rn-body">
${G.topBar(lang, rel)}
<main class="rn-shell">
  <div class="rn-doc">
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
