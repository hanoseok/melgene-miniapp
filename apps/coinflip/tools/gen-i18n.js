#!/usr/bin/env node
/**
 * 동전 던지기 & 주사위 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 동전/주사위 도구(광고 1자리) → 결과 하나 + 이번 세션 누적 → 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 던지기·뽑기는 coinflip-core.js, 화면 동작은 coinflip.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·동전과 주사위 티저 그림·h1(현지 검색어)·훅·짧은 사실 한 줄·시작 버튼·맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 도구 화면(진행 중 화면)에 mg-ad 1자리(던지기 버튼 아래). 결과(하나) 바로 아래 <div data-mg-end="coinflip">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'coinflip';
const SITE_ROOT = 'https://coinflip.example.com';
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
<meta name="theme-color" content="#1b2a49">
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

// 시작 화면 티저 그림: 금빛 동전 + 주사위 (결과 없음)
function dieHtml(v) {
  return `<span class="cf-die" data-v="${v}">${'<i></i>'.repeat(9)}</span>`;
}
function heroArt() {
  return `<div class="cf-hero" aria-hidden="true"><span class="cf-hero-coin">🪙</span><span class="cf-hero-die">${dieHtml(5)}</span></div>`;
}

// ---------------------------------------------------------------
// 시작 + 도구 + 결과 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const P = T.tool;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(coinflip.js)에서 쓰는 문구
  const runtime = { lang, tool: P, result: R, count: T.count, countDice: T.countDice };
  const diceBtns = [1, 2, 3].map((n) => `<button type="button" class="cf-seg-btn" role="radio" data-dice="${n}" aria-checked="${n === 1}">${n}</button>`).join('\n          ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="cf-body">
${G.topBar(lang, rel)}

<main class="cf-shell">
  <!-- 시작 화면: 티징만 (배지·동전/주사위 그림·h1·훅·사실 한 줄·시작 버튼) + 맨 아래 광고 1개 — FAQ 없음 -->
  <section id="screen-start" class="cf-screen cf-start">
    <p class="cf-badge">${esc(S.badge)}</p>
    ${heroArt()}
    <h1 class="cf-h1"><span class="cf-kicker">${esc(S.h1Kicker)}</span><span class="cf-h1-main">${S.h1Html}</span></h1>
    <p class="cf-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="cf-btn cf-btn-primary" type="button">${esc(S.start)}</button>
    <p class="cf-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 도구 화면 (진행 중 화면의 광고 1자리: 던지기 버튼 아래) -->
  <section id="screen-tool" class="cf-screen cf-tool" hidden>
    <h2 class="cf-h2">${esc(P.title)}</h2>
    <div class="cf-tabs" role="tablist" aria-label="${esc(P.title)}">
      <button type="button" id="tab-coin" class="cf-tab" role="tab" aria-selected="true" aria-controls="panel-coin">🪙 ${esc(P.tabCoin)}</button>
      <button type="button" id="tab-dice" class="cf-tab" role="tab" aria-selected="false" aria-controls="panel-dice" tabindex="-1">🎲 ${esc(P.tabDice)}</button>
    </div>

    <div id="panel-coin" role="tabpanel" aria-labelledby="tab-coin">
      <div class="cf-card">
        <p class="cf-label" id="names-label">${esc(P.namesLabel)}</p>
        <p class="cf-hint">${esc(P.namesHint)}</p>
        <div class="cf-names" role="group" aria-labelledby="names-label">
          <input id="name-a" class="cf-input" type="text" maxlength="12" value="${esc(P.sideA)}" aria-label="${esc(P.fieldA)}" autocomplete="off" enterkeyhint="done">
          <input id="name-b" class="cf-input" type="text" maxlength="12" value="${esc(P.sideB)}" aria-label="${esc(P.fieldB)}" autocomplete="off" enterkeyhint="done">
        </div>
        <div id="coin-stage" class="cf-stage" aria-hidden="true">
          <div class="cf-toss"><div id="coin" class="cf-coin"><span id="coin-a" class="cf-face cf-face-a"></span><span id="coin-b" class="cf-face cf-face-b"></span></div></div>
          <span class="cf-shadow"></span>
        </div>
      </div>
      <button type="button" id="throw-btn" class="cf-btn cf-btn-primary">${esc(P.throwCoin)}</button>
    </div>

    <div id="panel-dice" role="tabpanel" aria-labelledby="tab-dice" hidden>
      <div class="cf-card">
        <p class="cf-label" id="dice-label">${esc(P.diceLabel)}</p>
        <div class="cf-seg" role="radiogroup" aria-labelledby="dice-label">
          ${diceBtns}
        </div>
        <div id="dice-stage" class="cf-dice-stage" aria-hidden="true"></div>
      </div>
      <button type="button" id="roll-btn" class="cf-btn cf-btn-primary">${esc(P.rollDice)}</button>
    </div>
    <div class="mg-ad"></div>
  </section>

  <!-- 결과: 하나 + 이번 세션 누적 → 공통 끝 화면 -->
  <section id="screen-result" class="cf-screen cf-result" hidden>
    <h2 class="cf-h2" id="res-title">${esc(R.titleCoin)}</h2>
    <div class="cf-res" aria-live="polite">
      <div id="res-coin" class="cf-res-coin"><span class="cf-res-disc" aria-hidden="true">🪙</span><p id="res-name" class="cf-res-name"></p></div>
      <div id="res-dice" class="cf-res-dice" hidden></div>
      <span id="res-sum" class="cf-res-sum" hidden></span>
    </div>
    <div class="cf-tally">
      <p class="cf-tally-title">${esc(R.tallyTitle)}</p>
      <p id="tally-count" class="cf-tally-count"></p>
      <p id="tally-sides" class="cf-tally-sides"></p>
    </div>
    <div class="cf-actions">
      <button type="button" id="again-btn" class="cf-mini cf-mini-accent">${esc(R.againCoin)}</button>
      <button type="button" id="change-btn" class="cf-mini">↩ ${esc(R.change)}</button>
    </div>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['coinflip-core.js', 'coinflip.js'] })}
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
<body class="cf-body">
${G.topBar(lang, rel)}
<main class="cf-shell">
  <div class="cf-doc">
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
