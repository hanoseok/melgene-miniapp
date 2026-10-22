#!/usr/bin/env node
/**
 * 탑 쌓기(Stack Tower) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 아주 짧은 방법) → 게임 화면(HUD + 캔버스 + 탭 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 stack-core.js, 화면 동작은 stack.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(액션 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(쌓은 블록 수·최고 기록·퍼펙트 수·최고 연속 퍼펙트·서버 실제 백분위) → <div data-mg-end="stack">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'stack';
const SITE_ROOT = 'https://stack.example.com';
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
<meta name="theme-color" content="#120c2e">
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

// 시작 화면 티저 그림: 파스텔 블록이 쌓인 아이소메트릭 탑 + 위에서 미끄러지는 블록 (SVG, 장식)
function isoBox(cx, ty, a, b, t, hue) {
  const P = (pts) => pts.map(([x, y]) => `${x},${y}`).join(' ');
  return [
    `<polygon points="${P([[cx - a, ty + b], [cx, ty + 2 * b], [cx, ty + 2 * b + t], [cx - a, ty + b + t]])}" fill="hsl(${hue}, 52%, 60%)"/>`,
    `<polygon points="${P([[cx, ty + 2 * b], [cx + a, ty + b], [cx + a, ty + b + t], [cx, ty + 2 * b + t]])}" fill="hsl(${hue}, 48%, 48%)"/>`,
    `<polygon points="${P([[cx, ty], [cx + a, ty + b], [cx, ty + 2 * b], [cx - a, ty + b]])}" fill="hsl(${hue}, 64%, 72%)" stroke="rgba(255,255,255,.45)" stroke-width="1"/>`,
  ].join('');
}
function towerSvg(cls) {
  const parts = [isoBox(100, 112, 56, 28, 44, 262)];
  [1, 2, 3].forEach((i) => parts.push(isoBox(100, 112 - i * 16, 56, 28, 16, 262 + i * 14)));
  parts.push(isoBox(72, 112 - 4 * 16 - 14, 56, 28, 16, 262 + 4 * 14));
  return `<svg class="${cls}" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${parts.join('')}</svg>`;
}
const TOWER_SVG = towerSvg('st-hero-tower');

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
  // 브라우저(stack.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="st-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="st-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(액션 게임) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="st-screen st-start">
    <p class="st-badge">${esc(S.badge)}</p>
    <div class="st-hero" aria-hidden="true">
      ${TOWER_SVG}
    </div>
    <h1 class="st-h1"><span class="st-kicker">${esc(S.h1Kicker)}</span><span class="st-h1-main">${S.h1Html}</span></h1>
    <p class="st-hook">${esc(S.hook)}</p>
    <ul class="st-how">
      <li><span class="st-how-ico" aria-hidden="true">👆</span><span class="st-how-txt">${esc(S.how.tap)}</span></li>
      <li><span class="st-how-ico" aria-hidden="true">✂️</span><span class="st-how-txt">${esc(S.how.cut)}</span></li>
      <li><span class="st-how-ico" aria-hidden="true">✨</span><span class="st-how-txt">${esc(S.how.perfect)}</span></li>
    </ul>
    <button id="start-btn" class="st-btn st-btn-primary" type="button">${esc(S.start)}</button>
    <p class="st-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + 탭 안내 (광고 없음) -->
  <section id="screen-play" class="st-screen st-play" hidden>
    <div class="st-hud">
      <div class="st-hud-box st-hud-score"><span class="st-hud-label">${esc(P.score)}</span><span id="hud-score" class="st-hud-val">0</span></div>
      <div class="st-hud-box st-hud-best"><span class="st-hud-label">${esc(P.best)}</span><span id="hud-best" class="st-hud-val">0</span></div>
      <button id="pause-btn" class="st-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="st-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="st-canvas" class="st-canvas"></canvas>
      <p id="tap-hint" class="st-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="st-overlay st-paused" hidden>
        <p class="st-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="st-btn st-btn-primary st-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="st-screen st-end" hidden>
    <article class="st-result" aria-labelledby="res-score">
      <p class="st-eyebrow">${esc(R.over)}</p>
      <p class="st-score-line"><span id="res-score" class="st-score-big">0</span> <span class="st-points">${esc(R.blocks)}</span></p>
      <p id="res-newbest" class="st-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="st-best"></p>
      <dl class="st-stats">
        <div class="st-stat"><dt>${esc(R.perfects)}</dt><dd id="res-perfects">0</dd></div>
        <div class="st-stat"><dt>${esc(R.bestCombo)}</dt><dd id="res-combo">0</dd></div>
      </dl>
      <div id="res-rank" class="st-rank" hidden>
        <p id="res-comparing" class="st-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="st-top"></p>
          <p id="res-beat" class="st-beat"></p>
          <p id="res-others" class="st-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['stack-core.js', 'stack.js'] })}
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
<body class="st-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="st-shell">
  <div class="st-doc">
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
