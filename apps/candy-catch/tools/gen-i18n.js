#!/usr/bin/env node
/**
 * 할로윈 사탕 받기 게임(Halloween Candy Catch) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 아주 짧은 방법) → 게임 화면(HUD + 캔버스) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 candy-catch-core.js, 화면 동작은 candy-catch.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄. SEO 글·FAQ·광고 없음.
 *   - 게임 화면에는 광고를 두지 않는다(액션 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(점수·최고 기록·받은 사탕·최대 콤보·서버 실제 백분위) → <div data-mg-end="candy-catch">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'candy-catch';
const SITE_ROOT = 'https://candy-catch.example.com';
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
<meta name="theme-color" content="#120a2a">
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

// 시작 화면 티저 그림: 떨어지는 사탕 몇 개 + 호박 바구니 (SVG, 장식)
const BUCKET_SVG = `<svg class="cc-hero-bucket" viewBox="0 0 120 100" aria-hidden="true" focusable="false">
        <path d="M22 30 C22 6 98 6 98 30" fill="none" stroke="#1b1026" stroke-width="6" stroke-linecap="round"/>
        <path d="M14 34 H106 L96 88 C95 94 90 97 84 97 H36 C30 97 25 94 24 88 Z" fill="#ff8a1f" stroke="#1b1026" stroke-width="5" stroke-linejoin="round"/>
        <path d="M14 34 H106" stroke="#1b1026" stroke-width="5"/>
        <path d="M36 50 L46 62 H26 Z M84 50 L94 62 H74 Z" fill="#1b1026"/>
        <path d="M34 72 Q60 92 86 72 L80 70 L74 78 L67 71 L60 79 L53 71 L46 78 L40 70 Z" fill="#1b1026"/>
      </svg>`;

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
  // 브라우저(candy-catch.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="cc-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="cc-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(액션 게임) — FAQ·광고·SEO 글 없음 -->
  <section id="screen-start" class="cc-screen cc-start">
    <p class="cc-badge">${esc(S.badge)}</p>
    <div class="cc-hero" aria-hidden="true">
      <span class="cc-hero-moon"></span>
      <span class="cc-hero-drop is-1">🍬</span>
      <span class="cc-hero-drop is-2">🍭</span>
      <span class="cc-hero-drop is-3">🍫</span>
      ${BUCKET_SVG}
    </div>
    <h1 class="cc-h1"><span class="cc-kicker">${esc(S.h1Kicker)}</span><span class="cc-h1-main">${S.h1Html}</span></h1>
    <p class="cc-hook">${esc(S.hook)}</p>
    <ul class="cc-how">
      <li><span class="cc-how-ico" aria-hidden="true">👆</span><span class="cc-how-txt">${esc(S.how.move)}</span></li>
      <li><span class="cc-how-ico" aria-hidden="true">🍬</span><span class="cc-how-txt">${esc(S.how.catch)}</span></li>
      <li><span class="cc-how-ico" aria-hidden="true">🕷️</span><span class="cc-how-txt">${esc(S.how.avoid)}</span></li>
    </ul>
    <button id="start-btn" class="cc-btn cc-btn-primary" type="button">${esc(S.start)}</button>
    <p class="cc-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 (광고 없음) -->
  <section id="screen-play" class="cc-screen cc-play" hidden>
    <div class="cc-hud">
      <div class="cc-hud-box cc-hud-score"><span class="cc-hud-label">${esc(P.score)}</span><span id="hud-score" class="cc-hud-val">0</span></div>
      <div class="cc-hud-box cc-hud-time"><span class="cc-hud-label">${esc(P.time)}</span><span id="hud-time" class="cc-hud-val">0</span><span class="cc-timebar"><span id="hud-timebar" class="cc-timebar-fill"></span></span></div>
      <div class="cc-hud-box cc-hud-lives"><span class="cc-hud-label">${esc(P.lives)}</span><span id="hud-lives" class="cc-hud-hearts" role="img" aria-label=""></span></div>
      <button id="pause-btn" class="cc-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="cc-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="cc-canvas" class="cc-canvas"></canvas>
      <p id="combo" class="cc-combo" aria-live="polite"></p>
      <div id="countdown" class="cc-overlay cc-count" hidden><span id="countdown-num" class="cc-count-num"></span></div>
      <div id="pause-overlay" class="cc-overlay cc-paused" hidden>
        <p class="cc-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="cc-btn cc-btn-primary cc-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="cc-screen cc-end" hidden>
    <article class="cc-result" aria-labelledby="res-score">
      <p id="res-reason" class="cc-eyebrow"></p>
      <p class="cc-score-line"><span id="res-score" class="cc-score-big">0</span> <span class="cc-points">${esc(R.points)}</span></p>
      <p id="res-newbest" class="cc-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="cc-best"></p>
      <dl class="cc-stats">
        <div class="cc-stat"><dt>${esc(R.caught)}</dt><dd id="res-caught">0</dd></div>
        <div class="cc-stat"><dt>${esc(R.streak)}</dt><dd id="res-streak">0</dd></div>
      </dl>
      <div id="res-rank" class="cc-rank" hidden>
        <p id="res-comparing" class="cc-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="cc-top"></p>
          <p id="res-beat" class="cc-beat"></p>
          <p id="res-others" class="cc-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['candy-catch-core.js', 'candy-catch.js'] })}
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
<body class="cc-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="cc-shell">
  <div class="cc-doc">
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
