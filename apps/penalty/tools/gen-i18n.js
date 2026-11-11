#!/usr/bin/env node
/**
 * 벌칙 카드 뒤집기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 시작 버튼 + 맨 끝 mg-ad-start) → 설정 → 뒤집기 격자 → 끝(결과 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 penalty-core.js, 화면 동작은 penalty.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면(#screen-start) = h1·훅 + 시작 버튼 + 맨 끝 mg-ad-start 1개 (SEO 글·목록·FAQ 없음).
 *   - 설정 화면(#screen-setup) = 인원·벌칙 장수·벌칙 문구·이름 + 카드 섞기 버튼. 광고 없음.
 *   - 뒤집기 화면(#screen-flip) = 격자 + 결과 한 줄 + 버튼. 광고 없음.
 *   - 끝 화면(#screen-end) = 결과 카드 → <div data-mg-end="penalty">. FAQ 는 MG_FAQ 로만.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'penalty-core.js'));

const SITE_ID = 'penalty';
const SITE_ROOT = 'https://penalty.example.com';
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
<meta name="theme-color" content="#1d2a3a">
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

function stepper(id, label, value, min, max, U) {
  return `<div class="pn-row">
          <label class="pn-label" for="${id}">${esc(label)}</label>
          <div class="pn-stepper">
            <button type="button" id="${id}-dec" class="pn-step" aria-label="${esc(U.dec)}">−</button>
            <input id="${id}" class="pn-input" type="number" step="1" inputmode="numeric" value="${value}" min="${min}" max="${max}" enterkeyhint="done">
            <button type="button" id="${id}-inc" class="pn-step" aria-label="${esc(U.inc)}">+</button>
          </div>
        </div>`;
}

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const D = T.draw;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = {
    lang,
    ui: U,
    errors: T.errors,
    draw: D,
    result: R,
    defaults: T.defaults,
    limits: { minPlayers: CORE.MIN_PLAYERS, maxPlayers: CORE.MAX_PLAYERS, maxItems: CORE.MAX_ITEMS, maxItemLen: CORE.MAX_ITEM_LEN },
  };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="pn-body">
${G.topBar(lang, rel)}

<main class="pn-shell">
  <!-- 시작 화면: h1·훅 → 시작 버튼 → 맨 끝 mg-ad-start 1개 (티징만) -->
  <section id="screen-start" class="pn-screen pn-start">
    <h1 class="pn-h1"><span class="pn-kicker">${esc(H.h1Kicker)}</span><span class="pn-h1-main">${H.h1Html}</span></h1>
    <p class="pn-hook">${esc(H.hook)}</p>
    <button type="button" id="go-setup" class="pn-btn pn-btn-primary">${esc(U.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 설정 화면: 인원 · 벌칙 장수 · 벌칙 문구 · 이름 → 카드 섞기 -->
  <section id="screen-setup" class="pn-screen pn-setup" hidden>
    <h2 class="pn-h2">${esc(U.setupTitle)}</h2>
    <form id="pn-form" class="pn-form" novalidate autocomplete="off">
      <div class="pn-card">
        ${stepper('players', U.playersLabel, CORE.DEFAULTS.players, CORE.MIN_PLAYERS, CORE.MAX_PLAYERS, { dec: U.playersDec, inc: U.playersInc })}
        ${stepper('penalties', U.penaltyLabel, CORE.autoPenalties(CORE.DEFAULTS.players), 1, CORE.MAX_PLAYERS, { dec: U.penaltyDec, inc: U.penaltyInc })}
        <p class="pn-hint" id="penalty-hint">${esc(U.penaltyHint)}</p>
      </div>

      <div class="pn-card">
        <label class="pn-label" for="items">${esc(U.itemsLabel)}</label>
        <textarea id="items" class="pn-textarea" rows="7" spellcheck="false" placeholder="${esc(U.itemsPh)}" aria-describedby="items-hint"></textarea>
        <div class="pn-items-foot">
          <p class="pn-hint" id="items-hint">${esc(U.itemsHint)}</p>
          <button type="button" id="reset-items" class="pn-mini">${esc(U.resetItems)}</button>
        </div>
        <p class="pn-hint pn-items-count" id="items-count" aria-live="polite"></p>
      </div>

      <div class="pn-card">
        <button type="button" id="names-btn" class="pn-more" aria-expanded="false" aria-controls="names-box">${esc(U.namesBtn)}</button>
        <div id="names-box" class="pn-names" hidden>
          <label class="pn-label" for="names">${esc(U.namesLabel)}</label>
          <textarea id="names" class="pn-textarea" rows="4" spellcheck="false" placeholder="${esc(U.namesPh)}" aria-describedby="names-hint"></textarea>
          <p class="pn-hint" id="names-hint">${esc(U.namesHint)}</p>
        </div>
      </div>
    </form>

    <p id="error" class="pn-error" role="alert" hidden></p>
    <button type="button" id="shuffle-btn" class="pn-btn pn-btn-primary">${esc(U.start)}</button>
    <p class="pn-fair">${esc(U.fair)}</p>
  </section>

  <!-- 뒤집기 화면: 진행 → 격자 → 결과 한 줄 → 버튼 (광고 없음) -->
  <section id="screen-flip" class="pn-screen pn-flip" hidden>
    <div class="pn-progress">
      <p id="progress" class="pn-progress-text"></p>
      <p id="left" class="pn-left"></p>
      <div class="pn-bar" aria-hidden="true"><i id="bar-fill" class="pn-bar-fill"></i></div>
    </div>
    <p id="turn" class="pn-turn"></p>
    <p class="pn-pick-hint">${esc(D.pick)}</p>
    <div id="grid" class="pn-grid" role="group" aria-label="${esc(D.gridAria)}"></div>
    <p id="reveal" class="pn-reveal" aria-live="polite">${esc(D.revealNone)}</p>
    <div class="pn-actions">
      <button type="button" id="flip-all" class="pn-btn pn-btn-ghost">${esc(D.flipAll)}</button>
      <button type="button" id="reshuffle" class="pn-btn pn-btn-ghost">${esc(D.reshuffle)}</button>
    </div>
    <button type="button" id="see-results" class="pn-btn pn-btn-primary" hidden>${esc(D.seeResults)}</button>
    <p class="visually-hidden" id="live" aria-live="polite"></p>
  </section>

  <!-- 끝 화면: 결과 카드(누가 벌칙인지) → 공통 끝 화면 -->
  <section id="screen-end" class="pn-screen pn-end" hidden>
    <article class="pn-card pn-result" aria-labelledby="res-title">
      <p id="shared-badge" class="pn-badge" hidden>${esc(R.sharedBadge)}</p>
      <h2 class="pn-h2" id="res-title">${esc(R.heading)}</h2>
      <p id="shared-note" class="pn-shared-note" hidden>${esc(R.sharedNote)}</p>
      <p id="summary" class="pn-summary"></p>
      <h3 class="pn-h3">${esc(R.listHead)}</h3>
      <ol id="list" class="pn-list"></ol>
      <p id="safe-list" class="pn-safe-list" hidden></p>
      <div class="pn-actions">
        <button type="button" id="copy-btn" class="pn-btn pn-btn-ghost">${esc(R.copy)}</button>
        <button type="button" id="link-btn" class="pn-btn pn-btn-ghost">${esc(R.copyLink)}</button>
        <button type="button" id="edit-btn" class="pn-btn pn-btn-ghost">${esc(R.edit)}</button>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['penalty-core.js', 'penalty.js'] })}
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
<body class="pn-body">
${G.topBar(lang, rel)}
<main class="pn-shell">
  <div class="pn-doc">
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
