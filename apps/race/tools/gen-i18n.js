#!/usr/bin/env node
/**
 * 동물 달리기 시합 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(#screen-setup): h1·훅 → 모드(1등 승리 / 꼴찌 당첨) → 인원 2~10 → 레인별 이름 → 출발 → 맨 아래 mg-ad-start
 *                                    경주 화면(#screen-race, 처음 hidden): 모드 안내 → 트랙(레인·카운트다운) → (끝나면) 결과 + 최근 기록 + 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 race-core.js, 화면 동작은 race.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 경주 화면에는 광고 자리를 두지 않는다(끝 화면 공통 컴포넌트만).
 *   - 결과(#result) 안에 결과 카드 → 최근 기록 → <div data-mg-end="race">.
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'race-core.js'));

const SITE_ID = 'race';
const SITE_ROOT = 'https://race.example.com';
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
<meta name="theme-color" content="#1f6b45">
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
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(race.js)에서 쓰는 문구
  const runtime = { lang, ui: U, errors: T.errors, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="rc-body">
${G.topBar(lang, rel)}

<main class="rc-shell">
  <!-- 시작 화면: h1·훅 → 모드 → 인원 → 레인별 이름 → 출발 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="rc-screen rc-setup">
    <h1 class="rc-h1"><span class="rc-kicker">${esc(H.h1Kicker)}</span><span class="rc-h1-main">${H.h1Html}</span></h1>
    <p class="rc-hook">${esc(H.hook)}</p>

    <form id="rc-form" class="rc-card rc-form" novalidate autocomplete="off">
      <p class="rc-label" id="mode-label">${esc(U.modeLabel)}</p>
      <div class="rc-seg" role="radiogroup" aria-labelledby="mode-label">
        <button type="button" class="rc-seg-btn" id="mode-win" role="radio" aria-checked="true">${esc(U.modeWin)}</button>
        <button type="button" class="rc-seg-btn" id="mode-lose" role="radio" aria-checked="false">${esc(U.modeLose)}</button>
      </div>
      <div class="rc-count">
        <p class="rc-label" id="count-label">${esc(U.countLabel)}</p>
        <div class="rc-stepper" role="group" aria-labelledby="count-label">
          <button type="button" class="rc-step" id="count-less" aria-label="${esc(U.less)}">−</button>
          <output id="count-out" class="rc-count-out" aria-live="polite">${esc(G.fmt(U.countValue, { n: CORE.DEFAULT_RUNNERS }))}</output>
          <button type="button" class="rc-step" id="count-more" aria-label="${esc(U.more)}">+</button>
        </div>
      </div>
      <p class="rc-label" id="names-label">${esc(U.namesLabel)}</p>
      <ol id="entries" class="rc-entries" aria-labelledby="names-label"></ol>
      <p class="rc-hint">${esc(U.namesHint)}</p>
    </form>

    <p id="error" class="rc-error" role="alert" hidden></p>
    <p id="shared-note" class="rc-note" hidden>${esc(R.sharedNote)}</p>
    <button type="button" id="start-btn" class="rc-btn rc-btn-primary">${esc(U.start)}</button>
    <p class="rc-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 경주 화면: 모드 안내 → 트랙(카운트다운) → (끝나면) 결과 카드 → 최근 기록 → 공통 끝 화면. 광고 자리 없음(끝 화면 공통 컴포넌트만) -->
  <section id="screen-race" class="rc-screen rc-race" hidden>
    <p id="race-banner" class="rc-banner"></p>
    <div class="rc-track-wrap">
      <ol id="track" class="rc-track" aria-label="${esc(U.trackAria)}"></ol>
      <div id="countdown" class="rc-countdown" aria-hidden="true" hidden><span id="countdown-num" class="rc-countdown-num"></span></div>
    </div>
    <p id="live" class="visually-hidden" aria-live="polite"></p>

    <div id="result" class="rc-result" hidden>
      <article class="rc-card rc-res-card" id="result-card" aria-labelledby="res-title">
        <p class="rc-res-kicker" id="res-kicker"></p>
        <h2 class="rc-h2 rc-res-title" id="res-title"></h2>
        <p id="res-sub" class="rc-res-sub"></p>
        <h3 class="rc-h3" id="ranking-title">${esc(R.rankingTitle)}</h3>
        <ol id="ranking" class="rc-ranking" aria-labelledby="ranking-title"></ol>
        <div class="rc-actions">
          <button type="button" id="edit-btn" class="rc-btn rc-btn-ghost">${esc(R.edit)}</button>
          <button type="button" id="link-btn" class="rc-btn rc-btn-ghost">${esc(R.shareNames)}</button>
        </div>
      </article>
      <div id="history-card" class="rc-card rc-history" hidden>
        <div class="rc-history-head">
          <h3 class="rc-h3" id="history-title">${esc(R.history)}</h3>
          <button type="button" id="history-clear" class="rc-mini">${esc(R.historyClear)}</button>
        </div>
        <ol id="history" class="rc-history-list" aria-labelledby="history-title"></ol>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['race-core.js', 'race.js'] })}
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
<body class="rc-body">
${G.topBar(lang, rel)}
<main class="rc-shell">
  <div class="rc-doc">
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
  if (CORE.MAX_RUNNERS !== 10 || CORE.MIN_RUNNERS !== 2) throw new Error('race-core 인원 한도가 바뀌었다 — 문구(2~10명)도 함께 고칠 것');
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
