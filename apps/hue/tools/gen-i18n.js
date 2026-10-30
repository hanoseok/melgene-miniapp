#!/usr/bin/env node
/**
 * 다른 색 찾기(Find the Different Color) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 한 줄 방법) → 게임 화면(HUD + 시간 막대 + n×n 색 판) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·색은 hue-core.js, 화면 동작은 hue.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·한 줄 방법·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(빨리 누르는 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(깬 레벨·색감 등급·최고 기록·틀린 횟수·가장 큰 판·서버 실제 백분위) → <div data-mg-end="hue">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'hue';
const SITE_ROOT = 'https://hue.example.com';
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
<meta name="theme-color" content="#1c1d22">
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

// 시작 화면 티저 그림: 4×4 색 판, 한 칸만 조금 밝음 + 돋보기 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  const n = 4, cell = 44, gap = 6, pad = 12;
  const size = pad * 2 + cell * n + gap * (n - 1);
  const odd = 9;
  let out = `<rect x="0" y="0" width="${size}" height="${size}" rx="22" fill="#2a2c33"/>`;
  for (let i = 0; i < n * n; i++) {
    const x = pad + (i % n) * (cell + gap), y = pad + Math.floor(i / n) * (cell + gap);
    out += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="10" fill="${i === odd ? '#ff8fb0' : '#f2729a'}"/>`;
  }
  // 돋보기(다른 칸 위)
  const ox = pad + (odd % n) * (cell + gap) + cell / 2, oy = pad + Math.floor(odd / n) * (cell + gap) + cell / 2;
  out += `<circle cx="${ox}" cy="${oy}" r="33" fill="none" stroke="#fff" stroke-width="7"/>`;
  out += `<line x1="${ox + 24}" y1="${oy + 24}" x2="${ox + 52}" y2="${oy + 52}" stroke="#fff" stroke-width="11" stroke-linecap="round"/>`;
  out += `<line x1="${ox + 24}" y1="${oy + 24}" x2="${ox + 52}" y2="${oy + 52}" stroke="#ffd84f" stroke-width="5" stroke-linecap="round"/>`;
  return `<svg class="${cls}" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">${out}</svg>`;
}

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
  // 브라우저(hue.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="hue-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="hue-shell">
  <!-- 시작 화면: 티징 + 한 줄 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="hue-screen hue-start">
    <p class="hue-badge">${esc(S.badge)}</p>
    <div class="hue-hero" aria-hidden="true">
      ${heroSvg('hue-hero-art')}
    </div>
    <h1 class="hue-h1"><span class="hue-kicker">${esc(S.h1Kicker)}</span><span class="hue-h1-main">${S.h1Html}</span></h1>
    <p class="hue-hook">${esc(S.hook)}</p>
    <p class="hue-how">${esc(S.how)}</p>
    <button id="start-btn" class="hue-btn hue-btn-primary" type="button">${esc(S.start)}</button>
    <p class="hue-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 시간 막대 + 색 판 (광고 없음) -->
  <section id="screen-play" class="hue-screen hue-play" hidden>
    <div class="hue-hud">
      <div class="hue-hud-box hue-hud-level"><span class="hue-hud-label">${esc(P.level)}</span><span id="hud-level" class="hue-hud-val">0</span></div>
      <div class="hue-hud-box hue-hud-time"><span class="hue-hud-label">${esc(P.time)}</span><span id="hud-time" class="hue-hud-val">60</span></div>
      <div class="hue-hud-box hue-hud-best"><span class="hue-hud-label">${esc(P.best)}</span><span id="hud-best" class="hue-hud-val">0</span></div>
    </div>
    <div class="hue-timebar" aria-hidden="true"><span id="time-fill" class="hue-timefill"></span></div>
    <div class="hue-board-wrap">
      <div id="board" class="hue-board" tabindex="0" role="application" aria-label="${esc(P.boardAria)}" aria-describedby="play-hint"></div>
      <div id="pops" class="hue-pops" aria-hidden="true"></div>
      <div id="over-overlay" class="hue-overlay" hidden><p class="hue-over-title">${esc(P.timeUp)}</p></div>
    </div>
    <p id="play-hint" class="hue-hint" aria-live="polite">${esc(P.hint)}</p>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="hue-screen hue-end" hidden>
    <article class="hue-result" aria-labelledby="res-score">
      <p class="hue-eyebrow">${esc(R.over)}</p>
      <p class="hue-score-line"><span id="res-score" class="hue-score-big">0</span> <span class="hue-unit">${esc(R.unit)}</span></p>
      <p class="hue-tier"><span class="hue-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="hue-tier-name"></span></p>
      <p id="res-newbest" class="hue-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="hue-best"></p>
      <dl class="hue-stats">
        <div class="hue-stat"><dt>${esc(R.misses)}</dt><dd id="res-misses">0</dd></div>
        <div class="hue-stat"><dt>${esc(R.grid)}</dt><dd id="res-grid">2×2</dd></div>
      </dl>
      <div id="res-rank" class="hue-rank" hidden>
        <p id="res-comparing" class="hue-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="hue-top"></p>
          <p id="res-beat" class="hue-beat"></p>
          <p id="res-others" class="hue-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['hue-core.js', 'hue.js'] })}
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
<body class="hue-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="hue-shell">
  <div class="hue-doc">
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

if (require.main === module) main();
module.exports = { heroSvg };
