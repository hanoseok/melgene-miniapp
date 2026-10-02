#!/usr/bin/env node
/**
 * 수박 게임 – 할로윈 머지(Suika Game – Halloween Merge) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 아주 짧은 방법) → 게임 화면(HUD + 단계 사슬 + 병 캔버스) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙·물리·점수는 merge-core.js, 화면 동작은 merge.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄. SEO 글·FAQ·광고 없음.
 *   - 게임 화면에는 광고를 두지 않는다(조준·터치 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(점수·최고 기록·가장 큰 조각·합친 횟수·서버 실제 백분위) → <div data-mg-end="merge">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'merge';
const SITE_ROOT = 'https://merge.example.com';
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
<meta name="theme-color" content="#1a0f2e">
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

// 시작 화면 티저 그림: 유리병 안에 조각 몇 개 + 위에서 떨어지는 사탕 (SVG + 이모지, 장식)
const JAR_SVG = `<svg class="sk-hero-jar" viewBox="0 0 160 130" aria-hidden="true" focusable="false">
        <path d="M18 14 V112 Q18 124 30 124 H130 Q142 124 142 112 V14" fill="rgba(255,246,234,0.08)" stroke="#fff6ea" stroke-opacity="0.75" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M24 40 H136" stroke="#ff4d5e" stroke-opacity="0.7" stroke-width="2.5" stroke-dasharray="7 6"/>
        <circle cx="104" cy="94" r="25" fill="#ff8a1f" stroke="#1b1026" stroke-width="3.5"/>
        <path d="M92 70 Q90 92 92 118 M116 70 Q118 92 116 118" fill="none" stroke="#a84a00" stroke-opacity="0.55" stroke-width="2.5"/>
        <path d="M102 69 Q103 62 109 60" fill="none" stroke="#4f7a2a" stroke-width="4" stroke-linecap="round"/>
        <circle cx="56" cy="104" r="16" fill="#ff6b6b" stroke="#1b1026" stroke-width="3.5"/>
        <circle cx="32" cy="110" r="10" fill="#ff8cc0" stroke="#1b1026" stroke-width="3"/>
        <circle cx="70" cy="80" r="12" fill="#c9a2ff" stroke="#1b1026" stroke-width="3"/>
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
  // 브라우저(merge.js)에서 쓰는 문구
  const runtime = { play: P, result: R, tiers: T.tiers };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="sk-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="sk-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법 — FAQ·광고·SEO 글 없음 -->
  <section id="screen-start" class="sk-screen sk-start">
    <p class="sk-badge">${esc(S.badge)}</p>
    <div class="sk-hero" aria-hidden="true">
      <span class="sk-hero-moon"></span>
      <span class="sk-hero-drop">🍬</span>
      ${JAR_SVG}
    </div>
    <h1 class="sk-h1"><span class="sk-kicker">${esc(S.h1Kicker)}</span><span class="sk-h1-main">${S.h1Html}</span></h1>
    <p class="sk-hook">${esc(S.hook)}</p>
    <ul class="sk-how">
      <li><span class="sk-how-ico" aria-hidden="true">👆</span><span class="sk-how-txt">${esc(S.how.aim)}</span></li>
      <li><span class="sk-how-ico" aria-hidden="true">✨</span><span class="sk-how-txt">${esc(S.how.match)}</span></li>
      <li><span class="sk-how-ico" aria-hidden="true">🚫</span><span class="sk-how-txt">${esc(S.how.line)}</span></li>
    </ul>
    <button id="start-btn" class="sk-btn sk-btn-primary" type="button">${esc(S.start)}</button>
    <p class="sk-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 단계 사슬 + 병 캔버스 (광고 없음) -->
  <section id="screen-play" class="sk-screen sk-play" hidden>
    <div class="sk-hud">
      <div class="sk-hud-box sk-hud-score"><span class="sk-hud-label">${esc(P.score)}</span><span id="hud-score" class="sk-hud-val">0</span></div>
      <div class="sk-hud-box sk-hud-best"><span class="sk-hud-label">${esc(P.best)}</span><span id="hud-best" class="sk-hud-val">0</span></div>
      <div class="sk-hud-box sk-hud-next"><span class="sk-hud-label">${esc(P.next)}</span><canvas id="hud-next" class="sk-next" role="img" aria-label=""></canvas></div>
      <button id="pause-btn" class="sk-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <canvas id="sk-chain" class="sk-chain" role="img" aria-label="${esc(P.chainAria)}"></canvas>
    <div id="field" class="sk-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="sk-canvas" class="sk-canvas"></canvas>
      <div id="full-overlay" class="sk-overlay sk-full" hidden><p class="sk-full-title">${esc(P.full)}</p></div>
      <div id="pause-overlay" class="sk-overlay sk-paused" hidden>
        <p class="sk-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="sk-btn sk-btn-primary sk-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="sk-screen sk-end" hidden>
    <article class="sk-result" aria-labelledby="res-score">
      <p id="res-reason" class="sk-eyebrow"></p>
      <p class="sk-score-line"><span id="res-score" class="sk-score-big">0</span> <span class="sk-points">${esc(R.points)}</span></p>
      <p id="res-newbest" class="sk-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="sk-best"></p>
      <dl class="sk-stats">
        <div class="sk-stat"><dt>${esc(R.biggest)}</dt><dd><canvas id="res-biggest-ico" class="sk-stat-ico" aria-hidden="true"></canvas><span id="res-biggest" class="sk-stat-name"></span></dd></div>
        <div class="sk-stat"><dt>${esc(R.merges)}</dt><dd id="res-merges" class="sk-stat-num">0</dd></div>
      </dl>
      <div id="res-rank" class="sk-rank" hidden>
        <p id="res-comparing" class="sk-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="sk-top"></p>
          <p id="res-beat" class="sk-beat"></p>
          <p id="res-others" class="sk-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['merge-core.js', 'merge.js'] })}
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
<body class="sk-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="sk-shell">
  <div class="sk-doc">
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
