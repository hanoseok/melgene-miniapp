#!/usr/bin/env node
/**
 * 순서 정하기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 입력(첫 화면, 맨 끝 mg-ad-start) → 공개(번호 카드 한 장씩, 광고 없음) → 끝(전체 순서 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 order-core.js, 화면 동작은 order.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 입력 화면(#screen-input) = h1·훅 + 시작에 필요한 입력(프리셋·이름/번호·공개 방향) + 섞기 버튼 + 맨 끝 mg-ad-start 1개.
 *   - 공개 화면(#screen-reveal) = 광고 없음.
 *   - 끝 화면(#screen-end) = 순서 목록 → <div data-mg-end="order">. FAQ 는 MG_FAQ 로만.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'order-core.js'));

const SITE_ID = 'order';
const SITE_ROOT = 'https://order.example.com';
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
<meta name="theme-color" content="#fff6e8">
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
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const V = T.reveal;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = {
    lang,
    ui: U,
    presets: T.presets,
    errors: T.errors,
    reveal: V,
    result: R,
    limits: { min: CORE.MIN_ITEMS, max: CORE.MAX_ITEMS },
  };
  const chips = T.presets.map((p, i) => `<button type="button" class="or-chip" data-preset="${i}" aria-pressed="${i === 0 ? 'true' : 'false'}">${esc(p.label)}</button>`).join('\n          ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="or-body">
${G.topBar(lang, rel)}

<main class="or-shell">
  <!-- 입력 화면(첫 화면): h1·훅 → 프리셋 → 이름/번호 → 공개 방향 → 섞기 → 맨 끝 mg-ad-start 1개 -->
  <section id="screen-input" class="or-screen or-input">
    <h1 class="or-h1"><span class="or-kicker">${esc(H.h1Kicker)}</span><span class="or-h1-main">${H.h1Html}</span></h1>
    <p class="or-hook">${esc(H.hook)}</p>

    <form id="or-form" class="or-form" novalidate autocomplete="off">
      <div class="or-card">
        <p class="or-label" id="preset-label">${esc(U.presetLabel)}</p>
        <div class="or-chips" role="group" aria-labelledby="preset-label">
          ${chips}
        </div>
      </div>

      <div class="or-card">
        <div class="or-seg" role="group" aria-label="${esc(U.modeLabel)}">
          <button type="button" class="or-seg-btn" id="mode-names" data-mode="names" aria-pressed="true">${esc(U.modeNames)}</button>
          <button type="button" class="or-seg-btn" id="mode-numbers" data-mode="numbers" aria-pressed="false">${esc(U.modeNumbers)}</button>
        </div>
        <div id="names-box" class="or-names">
          <label class="or-label" for="names">${esc(U.namesLabel)}</label>
          <textarea id="names" class="or-textarea" rows="7" spellcheck="false" placeholder="${esc(U.namesPh)}" aria-describedby="names-hint"></textarea>
          <div class="or-foot">
            <p class="or-hint" id="names-hint">${esc(U.namesHint)}</p>
            <button type="button" id="clear-names" class="or-mini">${esc(U.clear)}</button>
          </div>
          <p class="or-hint or-count" id="names-count" aria-live="polite"></p>
        </div>
        <div id="numbers-box" class="or-numbers" hidden>
          <div class="or-row">
            <label class="or-label" for="count">${esc(U.numbersLabel)}</label>
            <div class="or-stepper">
              <button type="button" id="count-dec" class="or-step" aria-label="${esc(U.numbersDec)}">−</button>
              <input id="count" class="or-input-num" type="number" step="1" inputmode="numeric" value="${CORE.DEFAULTS.n}" min="${CORE.MIN_ITEMS}" max="${CORE.MAX_ITEMS}" enterkeyhint="done">
              <button type="button" id="count-inc" class="or-step" aria-label="${esc(U.numbersInc)}">+</button>
            </div>
          </div>
          <p class="or-hint">${esc(U.numbersHint)}</p>
        </div>
      </div>

      <div class="or-card">
        <p class="or-label" id="from-label">${esc(U.fromLabel)}</p>
        <div class="or-seg" role="group" aria-labelledby="from-label">
          <button type="button" class="or-seg-btn" id="from-first" data-from="first" aria-pressed="true">${esc(U.fromFirst)}</button>
          <button type="button" class="or-seg-btn" id="from-last" data-from="last" aria-pressed="false">${esc(U.fromLast)}</button>
        </div>
      </div>
    </form>

    <p id="error" class="or-error" role="alert" hidden></p>
    <button type="button" id="shuffle-btn" class="or-btn or-btn-primary">${esc(U.shuffle)}</button>
    <p class="or-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 공개 화면: 번호 카드 한 장씩 (광고 없음) -->
  <section id="screen-reveal" class="or-screen or-reveal" hidden>
    <h2 class="or-h2" id="rv-heading"></h2>
    <div class="or-progress">
      <p id="rv-progress" class="or-progress-text"></p>
      <div class="or-bar" aria-hidden="true"><i id="rv-bar" class="or-bar-fill"></i></div>
    </div>
    <button type="button" id="stage" class="or-stage" aria-describedby="rv-hint">
      <span class="or-stage-card" id="stage-card">
        <span class="or-stage-num" id="stage-num">?</span>
        <span class="or-stage-name" id="stage-name"></span>
      </span>
    </button>
    <p class="or-hint or-center" id="rv-hint">${esc(V.tapHint)}</p>
    <p class="visually-hidden" id="rv-live" aria-live="polite"></p>
    <button type="button" id="next-btn" class="or-btn or-btn-primary">${esc(V.first)}</button>
    <div class="or-actions or-actions-2">
      <button type="button" id="auto-btn" class="or-btn or-btn-ghost" aria-pressed="false">${esc(V.auto)}</button>
      <button type="button" id="all-btn" class="or-btn or-btn-ghost">${esc(V.showAll)}</button>
    </div>
    <h3 class="or-h3" id="so-far-head" hidden>${esc(V.soFar)}</h3>
    <ol id="so-far" class="or-list or-list-small"></ol>
  </section>

  <!-- 끝 화면: 1번째 → N번째 전체 순서 → 공통 끝 화면 -->
  <section id="screen-end" class="or-screen or-end" hidden>
    <article class="or-card or-result" aria-labelledby="res-title">
      <p id="shared-badge" class="or-badge" hidden>${esc(R.sharedBadge)}</p>
      <h2 class="or-h2" id="res-title"></h2>
      <p id="shared-note" class="or-shared-note" hidden>${esc(R.sharedNote)}</p>
      <p id="summary" class="or-summary"></p>
      <ol id="list" class="or-list"></ol>
      <div class="or-actions">
        <button type="button" id="copy-btn" class="or-btn or-btn-ghost">${esc(R.copy)}</button>
        <button type="button" id="link-btn" class="or-btn or-btn-ghost">${esc(R.copyLink)}</button>
        <button type="button" id="edit-btn" class="or-btn or-btn-ghost">${esc(R.edit)}</button>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['order-core.js', 'order.js'] })}
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
<body class="or-body">
${G.topBar(lang, rel)}
<main class="or-shell">
  <div class="or-doc">
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
