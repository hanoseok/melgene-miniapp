#!/usr/bin/env node
/**
 * 2048 게임(할로윈판) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 아주 짧은 방법) → 게임 화면(HUD + 4×4 판) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙·점수는 game2048-core.js, 화면 동작은 game2048.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄·맨 아래 광고(mg-ad-start) 1개.
 *   - 게임 화면에는 광고를 두지 않는다(스와이프 게임 — 실수로 누르기 쉬움). 광고는 시작 화면 맨 아래와 끝 화면(공통 컴포넌트).
 *   - 끝 화면 = 결과(점수·최고 기록·가장 큰 타일·이동 횟수·서버 실제 백분위) → <div data-mg-end="game2048">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'game2048';
const SITE_ROOT = 'https://game2048.example.com';
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
<meta name="theme-color" content="#1c1230">
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

// 시작 화면 티저 그림: 작은 판 위에서 2 + 2 가 미끄러져 4 가 되는 장면 (장식, 숫자만)
const HERO = `<div class="tf-hero" aria-hidden="true">
      <span class="tf-hero-moon"></span>
      <div class="tf-hero-board">
        <span class="tf-hero-tile tf-v2 tf-hero-a">2</span>
        <span class="tf-hero-tile tf-v2 tf-hero-b">2</span>
        <span class="tf-hero-tile tf-v4 tf-hero-c">4</span>
        <span class="tf-hero-tile tf-v8 tf-hero-d">8</span>
      </div>
    </div>`;

// ---------------------------------------------------------------
// 시작 + 게임 + 끝 화면 (index.html)
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
  // 브라우저(game2048.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="tf-body">
${G.topBar(lang, rel)}

<main class="tf-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="tf-screen tf-start">
    <p class="tf-badge">${esc(S.badge)}</p>
    ${HERO}
    <h1 class="tf-h1"><span class="tf-kicker">${esc(S.h1Kicker)}</span><span class="tf-h1-main">${S.h1Html}</span></h1>
    <p class="tf-hook">${esc(S.hook)}</p>
    <ul class="tf-how">
      <li><span class="tf-how-ico" aria-hidden="true">👆</span><span class="tf-how-txt">${esc(S.how.swipe)}</span></li>
      <li><span class="tf-how-ico" aria-hidden="true">✨</span><span class="tf-how-txt">${esc(S.how.match)}</span></li>
      <li><span class="tf-how-ico" aria-hidden="true">🎃</span><span class="tf-how-txt">${esc(S.how.goal)}</span></li>
    </ul>
    <button id="start-btn" class="tf-btn tf-btn-primary" type="button">${esc(S.start)}</button>
    <p class="tf-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 4×4 판 (광고 없음) -->
  <section id="screen-play" class="tf-screen tf-play" hidden>
    <div class="tf-hud">
      <div class="tf-hud-box tf-hud-score"><span class="tf-hud-label">${esc(P.score)}</span><span id="hud-score" class="tf-hud-val">0</span><span id="hud-gain" class="tf-gain" aria-hidden="true"></span></div>
      <div class="tf-hud-box tf-hud-best"><span class="tf-hud-label">${esc(P.best)}</span><span id="hud-best" class="tf-hud-val">0</span></div>
    </div>
    <div id="board" class="tf-board" tabindex="0" role="application" aria-label="${esc(P.boardAria)}">
      <div class="tf-cells" aria-hidden="true">${'<span class="tf-cell"></span>'.repeat(16)}</div>
      <div id="tiles" class="tf-tiles" aria-live="off"></div>
      <div id="won-overlay" class="tf-overlay tf-won" hidden>
        <p class="tf-overlay-title">${esc(P.won)}</p>
        <button id="keep-btn" class="tf-btn tf-btn-primary tf-btn-sm" type="button">${esc(P.keepGoing)}</button>
        <button id="finish-btn" class="tf-btn tf-btn-ghost tf-btn-sm" type="button">${esc(P.finish)}</button>
      </div>
      <div id="over-overlay" class="tf-overlay tf-over" hidden><p class="tf-overlay-title">${esc(P.over)}</p></div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="tf-screen tf-end" hidden>
    <article class="tf-result" aria-labelledby="res-score">
      <p id="res-reason" class="tf-eyebrow"></p>
      <p class="tf-score-line"><span id="res-score" class="tf-score-big">0</span> <span class="tf-points">${esc(R.points)}</span></p>
      <p id="res-newbest" class="tf-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="tf-best"></p>
      <dl class="tf-stats">
        <div class="tf-stat"><dt>${esc(R.biggest)}</dt><dd><span id="res-biggest" class="tf-stat-tile"></span></dd></div>
        <div class="tf-stat"><dt>${esc(R.moves)}</dt><dd id="res-moves" class="tf-stat-num">0</dd></div>
      </dl>
      <div id="res-rank" class="tf-rank" hidden>
        <p id="res-comparing" class="tf-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="tf-top"></p>
          <p id="res-beat" class="tf-beat"></p>
          <p id="res-others" class="tf-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['game2048-core.js', 'game2048.js'] })}
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
<body class="tf-body">
${G.topBar(lang, rel)}
<main class="tf-shell">
  <div class="tf-doc">
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
