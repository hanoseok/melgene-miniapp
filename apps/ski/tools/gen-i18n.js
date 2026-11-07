#!/usr/bin/env node
/**
 * 스키 활강(Ski Downhill) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 짧은 방법 3칸) → 게임 화면(HUD + 캔버스 + 준비 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 ski-core.js, 화면 동작은 ski.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(액션 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(거리 m·최고 기록·통과한 기문·주행 시간·등급·서버 실제 백분위) → <div data-mg-end="ski">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'ski';
const SITE_ROOT = 'https://ski.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// 숫자 글꼴(HUD·점수 — 숫자·기호만 쓰므로 언어와 무관)
const DIGITS_CSS = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap';
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
  const links = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${PRETENDARD}">`,
    `<link rel="stylesheet" href="${esc(F.css)}">`,
  ];
  if (!F.css.includes('Oswald')) links.push(`<link rel="stylesheet" href="${DIGITS_CSS}">`);
  return { links: links.join('\n'), vars: `<style>:root { ${vars.join('; ')}; }</style>` };
}

function head(lang, T, o) {
  const root = G.rootPrefix(o.file);
  const f = fontHead(T);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0d2a4a">
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

// 시작 화면 티저 그림: 밤하늘 아래 눈 덮인 산비탈 + 기문 깃발 사이로 내려오는 스키어 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 240 180" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="skisky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d2a4a"/><stop offset="1" stop-color="#2b5c8f"/></linearGradient>
<linearGradient id="skisnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dcebf8"/></linearGradient>
<clipPath id="skiclip"><rect x="0" y="0" width="240" height="180" rx="26"/></clipPath>
</defs>
<g clip-path="url(#skiclip)">
<rect x="0" y="0" width="240" height="180" fill="url(#skisky)"/>
<circle cx="40" cy="30" r="1.6" fill="#cfe8ff"/><circle cx="72" cy="18" r="1.2" fill="#cfe8ff"/><circle cx="196" cy="24" r="1.5" fill="#cfe8ff"/><circle cx="160" cy="40" r="1.1" fill="#cfe8ff"/>
<path d="M0 92 L54 40 L88 70 L130 26 L178 76 L206 54 L240 84 V180 H0 Z" fill="#a9c9e8"/>
<path d="M54 40 L68 53 L60 52 L52 58 L44 50 Z M130 26 L148 44 L138 42 L128 48 L118 38 Z M206 54 L218 66 L208 64 L200 68 Z" fill="#ffffff"/>
<path d="M0 118 Q70 84 130 104 T240 96 V180 H0 Z" fill="url(#skisnow)"/>
<path d="M58 180 C70 156 96 150 104 134 C112 120 132 118 140 108" stroke="#8fb3d6" stroke-width="2" fill="none"/>
<path d="M66 180 C78 156 104 150 112 134 C120 120 140 118 148 108" stroke="#8fb3d6" stroke-width="2" fill="none"/>
<g><path d="M178 150 V112" stroke="#1c2b40" stroke-width="3"/><path d="M178 112 L196 118 L178 124 Z" fill="#e84855"/></g>
<g><path d="M82 128 V94" stroke="#1c2b40" stroke-width="3"/><path d="M82 94 L64 100 L82 106 Z" fill="#2f7de1"/></g>
<g transform="translate(146 100) rotate(-18)">
<path d="M-16 20 L22 8 M-14 26 L24 14" stroke="#16243a" stroke-width="3.4" stroke-linecap="round"/>
<path d="M-8 2 L-20 -10 M12 0 L22 -12" stroke="#5c6b80" stroke-width="2"/>
<ellipse cx="2" cy="4" rx="11" ry="13" fill="#0d2a4a"/>
<rect x="-10" y="1" width="23" height="4" fill="#6ec6ff"/>
<circle cx="2" cy="-12" r="8" fill="#e84855"/><circle cx="2" cy="-21" r="3.2" fill="#ffffff"/>
<rect x="-5" y="-12" width="14" height="4.4" rx="2" fill="#ffcd3c"/>
</g>
<g fill="#ffffff" opacity=".9"><circle cx="24" cy="70" r="2.2"/><circle cx="104" cy="56" r="1.8"/><circle cx="214" cy="120" r="2.4"/><circle cx="30" cy="146" r="1.8"/><circle cx="190" cy="80" r="1.6"/></g>
</g>
</svg>`;
}
const HERO_SVG = heroSvg('ski-hero-art');

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
  // 브라우저(ski.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="ski-body">
${G.topBar(lang, rel)}

<main class="ski-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(액션 게임) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="ski-screen ski-start">
    <p class="ski-badge">${esc(S.badge)}</p>
    <div class="ski-hero" aria-hidden="true">
      ${HERO_SVG}
    </div>
    <h1 class="ski-h1"><span class="ski-kicker">${esc(S.h1Kicker)}</span><span class="ski-h1-main">${S.h1Html}</span></h1>
    <p class="ski-hook">${esc(S.hook)}</p>
    <ul class="ski-how">
      <li><span class="ski-how-ico" aria-hidden="true">👆</span><span class="ski-how-txt">${esc(S.how.steer)}</span></li>
      <li><span class="ski-how-ico" aria-hidden="true">🚩</span><span class="ski-how-txt">${esc(S.how.gates)}</span></li>
      <li><span class="ski-how-ico" aria-hidden="true">🌲</span><span class="ski-how-txt">${esc(S.how.avoid)}</span></li>
    </ul>
    <button id="start-btn" class="ski-btn ski-btn-primary" type="button">${esc(S.start)}</button>
    <p class="ski-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + "탭해서 출발" 준비 안내 (광고 없음) -->
  <section id="screen-play" class="ski-screen ski-play" hidden>
    <div class="ski-hud">
      <div class="ski-hud-box ski-hud-dist"><span class="ski-hud-label">${esc(P.dist)}</span><span class="ski-hud-val"><span id="hud-dist">0</span><small>${esc(R.unit)}</small></span></div>
      <div class="ski-hud-box ski-hud-best"><span class="ski-hud-label">${esc(P.best)}</span><span class="ski-hud-val"><span id="hud-best">0</span><small>${esc(R.unit)}</small></span></div>
      <button id="pause-btn" class="ski-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="ski-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="ski-canvas" class="ski-canvas"></canvas>
      <p id="tap-hint" class="ski-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="ski-overlay ski-paused" hidden>
        <p class="ski-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="ski-btn ski-btn-primary ski-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="ski-screen ski-end" hidden>
    <article class="ski-result" aria-labelledby="res-score">
      <p class="ski-eyebrow">${esc(R.over)}</p>
      <p class="ski-score-line"><span id="res-score" class="ski-score-big">0</span> <span class="ski-unit">${esc(R.unit)}</span></p>
      <p id="res-newbest" class="ski-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="ski-best"></p>
      <dl class="ski-stats">
        <div class="ski-stat"><dt>${esc(R.gates)}</dt><dd id="res-gates">0</dd></div>
        <div class="ski-stat"><dt>${esc(R.time)}</dt><dd id="res-time">0</dd></div>
      </dl>
      <p class="ski-tier"><span class="ski-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="ski-tier-name"></span></p>
      <div id="res-rank" class="ski-rank" hidden>
        <p id="res-comparing" class="ski-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="ski-top"></p>
          <p id="res-beat" class="ski-beat"></p>
          <p id="res-others" class="ski-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['ski-core.js', 'ski.js'] })}
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
<body class="ski-body">
${G.topBar(lang, rel)}
<main class="ski-shell">
  <div class="ski-doc">
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
