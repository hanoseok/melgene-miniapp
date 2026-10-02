#!/usr/bin/env node
/**
 * 오늘 뭐 먹지 메뉴 뽑기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 끼니·기분 고르기 + 슬롯 릴(광고 1자리) → 뽑힌 메뉴 하나 → 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구와 언어별 메뉴 목록은 tools/i18n/<lang>.js, 후보·뽑기는 lunch-core.js, 화면 동작은 lunch.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·슬롯머신 티저 그림·h1(현지 검색어)·훅·짧은 사실 한 줄·시작 버튼·맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 고르기 화면(진행 중 화면)에 mg-ad 1자리(뽑기 버튼 아래). 결과(뽑힌 메뉴 하나) 바로 아래 <div data-mg-end="lunch">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'lunch';
const SITE_ROOT = 'https://lunch.example.com';
const CORE = require(path.join(__dirname, '..', 'lunch-core.js'));
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
<meta name="theme-color" content="#3a2316">
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

// 시작 화면 티저 그림: 슬롯머신 창 세 개 + 불빛 + 레버 (메뉴 이름 없음)
function heroArt() {
  const wins = ['🍜', '🍣', '🌮'].map((e) => `<span class="lc-hero-win">${e}</span>`).join('');
  return `<div class="lc-hero" aria-hidden="true"><div class="lc-hero-wins">${wins}</div><div class="lc-hero-lights"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="lc-hero-lever"></span></div>`;
}

// ---------------------------------------------------------------
// 시작 + 입력 + 결과 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const P = T.pick;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(lunch.js)에서 쓰는 문구
  const runtime = { lang, pick: P, result: R, count: T.count, menus: T.menus };
  const mealBtns = CORE.MEALS.map((m) => `<button type="button" id="meal-${m}" class="lc-seg-btn" role="radio" data-meal="${m}">${esc(P.meals[m])}</button>`).join('\n        ');
  const tagBtns = CORE.TAGS.map((t) => `<button type="button" id="tag-${t}" class="lc-chip" data-tag="${t}" aria-pressed="false">${esc(P.tags[t])}</button>`).join('\n        ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="lc-body">
${G.topBar(lang, rel)}

<main class="lc-shell">
  <!-- 시작 화면: 티징만 (배지·슬롯머신 그림·h1·훅·사실 한 줄·시작 버튼) + 맨 아래 광고 1개 — FAQ 없음 -->
  <section id="screen-start" class="lc-screen lc-start">
    <p class="lc-badge">${esc(S.badge)}</p>
    ${heroArt()}
    <h1 class="lc-h1"><span class="lc-kicker">${esc(S.h1Kicker)}</span><span class="lc-h1-main">${S.h1Html}</span></h1>
    <p class="lc-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="lc-btn lc-btn-primary" type="button">${esc(S.start)}</button>
    <p class="lc-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 고르기 화면 (진행 중 화면의 광고 1자리: 뽑기 버튼 아래) -->
  <section id="screen-pick" class="lc-screen lc-pick" hidden>
    <h2 class="lc-h2">${esc(P.title)}</h2>
    <div class="lc-card">
      <p class="lc-label" id="meal-label">${esc(P.mealLabel)}</p>
      <div class="lc-seg" role="radiogroup" aria-labelledby="meal-label">
        ${mealBtns}
      </div>
      <p class="lc-label" id="mood-label">${esc(P.moodLabel)}</p>
      <p class="lc-hint">${esc(P.moodHint)}</p>
      <div class="lc-chips" role="group" aria-labelledby="mood-label">
        ${tagBtns}
      </div>
      <div class="lc-meta">
        <span id="cand-count" class="lc-count" aria-live="polite"></span>
        <span id="ex-line" class="lc-ex-line" hidden><span id="ex-count"></span><button type="button" id="ex-reset" class="lc-mini">${esc(P.reset)}</button></span>
      </div>
      <p id="pick-note" class="lc-note" hidden></p>
    </div>
    <div class="lc-machine">
      <div id="reel" class="lc-reel" aria-hidden="true"><div id="reel-strip" class="lc-strip"></div></div>
    </div>
    <button type="button" id="spin-btn" class="lc-btn lc-btn-primary">${esc(P.spin)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 결과: 뽑힌 메뉴 하나 → 공통 끝 화면 -->
  <section id="screen-result" class="lc-screen lc-result" hidden>
    <h2 class="lc-h2">${esc(R.title)}</h2>
    <div class="lc-res" aria-live="polite">
      <span id="res-emoji" class="lc-res-emoji" aria-hidden="true"></span>
      <p id="res-name" class="lc-res-name"></p>
      <span id="res-meal" class="lc-res-meal"></span>
    </div>
    <div class="lc-actions">
      <button type="button" id="again-btn" class="lc-mini lc-mini-accent">🎰 ${esc(R.again)}</button>
      <button type="button" id="exclude-btn" class="lc-mini">🚫 ${esc(R.exclude)}</button>
      <button type="button" id="change-btn" class="lc-mini">🎛️ ${esc(R.change)}</button>
    </div>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['lunch-core.js', 'lunch.js'] })}
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
<body class="lc-body">
${G.topBar(lang, rel)}
<main class="lc-shell">
  <div class="lc-doc">
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
