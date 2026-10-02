#!/usr/bin/env node
/**
 * 음식 월드컵(음식 토너먼트) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 경기 화면(두 카드 + VS, 라운드·진행 막대, 광고 1자리) → 끝 화면(우승 음식 + 나의 4강 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 음식 id·이모지·대진·서버 인코딩은 food-cup-core.js, 화면 동작은 food-cup.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·물음표 접시 티저·h1(현지 검색어)·훅·짧은 사실 한 줄·시작 버튼. 음식 목록·SEO 글·FAQ·광고 없음.
 *   - 경기 화면에 mg-ad 1자리(카드 아래). 끝 화면 = 결과(우승 카드 + 나의 4강) → <div data-mg-end="food-cup">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'food-cup-core.js'));

const SITE_ID = 'food-cup';
const SITE_ROOT = 'https://food-cup.example.com';
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
    `--font-name: ${clean(F.name || F.display)}, var(--font-display)`,
    `--name-weight: ${Number(F.nameWeight) || 400}`,
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
<meta name="theme-color" content="#e8412c">
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

function card(id, side) {
  return `<button type="button" class="fc-card" id="${id}" data-side="${side}">
        <span class="fc-plate"><span class="fc-emoji" aria-hidden="true"></span></span>
        <span class="fc-name"></span>
      </button>`;
}

// ---------------------------------------------------------------
// 시작 + 경기 + 끝 화면 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const P = T.play;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(food-cup.js)에서 쓰는 문구
  const runtime = { play: P, result: R, foods: T.foods };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="fc-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="fc-shell">
  <!-- 시작 화면: 티징만 (배지·물음표 접시·h1·훅·사실 한 줄·시작 버튼) — 음식 목록·FAQ·광고 없음 -->
  <section id="screen-start" class="fc-screen fc-start">
    <p class="fc-badge">${esc(S.badge)}</p>
    <div class="fc-hero" aria-hidden="true">
      <span class="fc-hero-plate is-l">?</span>
      <span class="fc-vs fc-hero-vs">${esc(P.vs)}</span>
      <span class="fc-hero-plate is-r">?</span>
      <span class="fc-hero-cup">🏆</span>
    </div>
    <h1 class="fc-h1"><span class="fc-kicker">${esc(S.h1Kicker)}</span><span class="fc-h1-main">${S.h1Html}</span></h1>
    <p class="fc-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="fc-btn fc-btn-primary" type="button">${esc(S.start)}</button>
    <p class="fc-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 경기 화면 (진행 중 화면의 광고 1자리: 카드 아래) -->
  <section id="screen-play" class="fc-screen fc-play" hidden>
    <div class="fc-board">
      <p id="round-label" class="fc-round"></p>
      <div id="progress" class="fc-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${CORE.TOTAL_MATCHES}" aria-valuenow="0"><span id="progress-bar" class="fc-progress-bar"></span></div>
    </div>
    <p class="fc-hint">${esc(P.hint)}</p>
    <div id="arena" class="fc-arena">
      ${card('card-a', 0)}
      <span class="fc-vs fc-arena-vs" aria-hidden="true">${esc(P.vs)}</span>
      ${card('card-b', 1)}
    </div>
    <p id="pick-stat" class="fc-stat" aria-live="polite"></p>
    <div class="mg-ad"></div>
  </section>

  <!-- 끝 화면: 우승 음식 + 나의 4강(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="fc-screen fc-end" hidden>
    <article class="fc-champ" aria-labelledby="champ-name">
      <p class="fc-eyebrow"><span aria-hidden="true">🏆</span> ${esc(R.eyebrow)}</p>
      <div class="fc-champ-plate"><span id="champ-emoji" class="fc-champ-emoji" aria-hidden="true"></span></div>
      <h2 id="champ-name" class="fc-champ-name"></h2>
      <p id="champ-stat" class="fc-champ-stat" hidden></p>
      <h3 class="fc-four-title">${esc(R.fourTitle)}</h3>
      <ul id="four" class="fc-four"></ul>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['food-cup-core.js', 'food-cup.js'] })}
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
<body class="fc-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="fc-shell">
  <div class="fc-doc">
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
