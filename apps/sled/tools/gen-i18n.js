#!/usr/bin/env node
/**
 * 썰매 레이스(Sled Race) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 짧은 방법 3칸) → 게임 화면(HUD + 캔버스 + 준비 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 sled-core.js, 화면 동작은 sled.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(손을 계속 대고 조종하는 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(점수·최고 기록·거리·모은 것·점프·등급·서버 실제 백분위) → <div data-mg-end="sled">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'sled';
const SITE_ROOT = 'https://sled.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// 숫자 글꼴(HUD·점수 — 숫자·기호만 쓰므로 언어와 무관)
const DIGITS_CSS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap';
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
  if (!F.css.includes('Fredoka')) links.push(`<link rel="stylesheet" href="${DIGITS_CSS}">`);
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
<meta name="theme-color" content="#1f3f74">
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

// 시작 화면 티저 그림: 눈 언덕을 내려가는 빨간 썰매(위에서 본 모습), 소나무·바위·깃발·선물·점프대·썰매 자국 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 240 180" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="sdsnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e4f0fb"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
<clipPath id="sdclip"><rect x="0" y="0" width="240" height="180" rx="26"/></clipPath>
</defs>
<g clip-path="url(#sdclip)">
<rect x="0" y="0" width="240" height="180" fill="url(#sdsnow)"/>
<path d="M0 30 Q60 50 120 40 T240 52" stroke="#d3e5f4" stroke-width="2" fill="none"/>
<path d="M0 120 Q70 104 130 124 T240 116" stroke="#d3e5f4" stroke-width="2" fill="none"/>
<path d="M112 -4 C110 30 132 40 128 74" stroke="#c4d9ec" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M124 -4 C122 30 144 40 140 74" stroke="#c4d9ec" stroke-width="3" fill="none" stroke-linecap="round"/>
<g transform="translate(36 52)"><ellipse cx="0" cy="22" rx="20" ry="6" fill="#cfe0ef"/><path d="M0 -22 L18 10 H-18 Z" fill="#2f7a5c"/><path d="M0 -8 L22 22 H-22 Z" fill="#245f48"/><path d="M0 -22 L7 -10 H-7 Z" fill="#ffffff"/><rect x="-3" y="20" width="6" height="6" fill="#7a5638"/></g>
<g transform="translate(206 118)"><ellipse cx="0" cy="24" rx="20" ry="6" fill="#cfe0ef"/><path d="M0 -20 L18 12 H-18 Z" fill="#2f7a5c"/><path d="M0 -6 L22 24 H-22 Z" fill="#245f48"/><path d="M0 -20 L7 -8 H-7 Z" fill="#ffffff"/></g>
<g transform="translate(186 40)"><ellipse cx="0" cy="8" rx="17" ry="5" fill="#cfe0ef"/><path d="M-16 6 Q-14 -10 0 -12 Q15 -10 16 6 Z" fill="#8c9aab"/><path d="M-10 -6 Q0 -14 10 -6 Q0 -9 -10 -6 Z" fill="#ffffff"/></g>
<g transform="translate(74 140)"><path d="M-30 10 L30 10 L22 -8 L-22 -8 Z" fill="#7cb6e6"/><path d="M-22 -8 L22 -8 L18 -14 L-18 -14 Z" fill="#ffffff"/><path d="M-8 2 L0 -5 L8 2 M-8 8 L0 1 L8 8" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>
<g transform="translate(168 84)"><rect x="-1.5" y="-18" width="3" height="22" fill="#6b4a34"/><path d="M1.5 -18 L16 -13 L1.5 -8 Z" fill="#e8574c"/></g>
<g transform="translate(150 154)"><rect x="-10" y="-10" width="20" height="18" rx="3" fill="#3aa36b"/><rect x="-2" y="-10" width="4" height="18" fill="#f4b63f"/><rect x="-10" y="-3" width="20" height="4" fill="#f4b63f"/><path d="M0 -10 q-8 -8 -10 -2 q4 3 10 2 q8 -8 10 -2 q-4 3 -10 2" fill="#f4b63f"/></g>
<g transform="translate(126 96) rotate(-10)">
<rect x="-17" y="-30" width="34" height="58" rx="10" fill="#e8574c"/>
<rect x="-13" y="-26" width="26" height="50" rx="7" fill="#c8402f"/>
<path d="M-17 -18 Q0 -34 17 -18" stroke="#8a2d22" stroke-width="3" fill="none"/>
<rect x="-14" y="-10" width="28" height="24" rx="10" fill="#2f6fbf"/>
<rect x="-12" y="-14" width="24" height="7" rx="3" fill="#ffffff"/>
<rect x="6" y="-12" width="6" height="16" rx="2" fill="#ffffff"/>
<circle cx="0" cy="-20" r="10" fill="#f4b63f"/>
<circle cx="0" cy="-26" r="4" fill="#ffffff"/>
<circle cx="-15" cy="-2" r="5" fill="#2f6fbf"/><circle cx="15" cy="-2" r="5" fill="#2f6fbf"/>
</g>
<g fill="#ffffff" opacity=".95"><circle cx="20" cy="18" r="2"/><circle cx="80" cy="12" r="1.6"/><circle cx="160" cy="16" r="2"/><circle cx="222" cy="20" r="1.6"/><circle cx="98" cy="70" r="1.4"/><circle cx="226" cy="84" r="1.6"/><circle cx="16" cy="104" r="1.6"/><circle cx="204" cy="166" r="1.8"/></g>
</g>
</svg>`;
}
const HERO_SVG = heroSvg('sd-hero-art');

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
  // 브라우저(sled.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="sd-body">
${G.topBar(lang, rel)}

<main class="sd-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(조종·모으기·점프) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="sd-screen sd-start">
    <p class="sd-badge">${esc(S.badge)}</p>
    <div class="sd-hero" aria-hidden="true">
      ${HERO_SVG}
    </div>
    <h1 class="sd-h1"><span class="sd-kicker">${esc(S.h1Kicker)}</span><span class="sd-h1-main">${S.h1Html}</span></h1>
    <p class="sd-hook">${esc(S.hook)}</p>
    <ul class="sd-how">
      <li><span class="sd-how-ico" aria-hidden="true">↔️</span><span class="sd-how-txt">${esc(S.how.steer)}</span></li>
      <li><span class="sd-how-ico" aria-hidden="true">🎁</span><span class="sd-how-txt">${esc(S.how.grab)}</span></li>
      <li><span class="sd-how-ico" aria-hidden="true">🌲</span><span class="sd-how-txt">${esc(S.how.dodge)}</span></li>
    </ul>
    <button id="start-btn" class="sd-btn sd-btn-primary" type="button">${esc(S.start)}</button>
    <p class="sd-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + 준비 안내 (광고 없음) -->
  <section id="screen-play" class="sd-screen sd-play" hidden>
    <div class="sd-hud">
      <div class="sd-hud-box sd-hud-score"><span class="sd-hud-label">${esc(P.score)}</span><span class="sd-hud-val"><span id="hud-score">0</span></span></div>
      <div class="sd-hud-box sd-hud-dist"><span class="sd-hud-label">${esc(P.dist)}</span><span class="sd-hud-val"><span id="hud-dist">0</span><small>${esc(P.mUnit)}</small></span></div>
      <div class="sd-hud-box sd-hud-lives"><span class="sd-hud-label">${esc(P.lives)}</span><span id="hud-lives" class="sd-hud-val sd-hearts" aria-live="polite"><span>♥</span><span>♥</span><span>♥</span></span></div>
      <button id="pause-btn" class="sd-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div class="sd-timebar" aria-hidden="true"><span id="hud-timebar"></span></div>
    <div id="field" class="sd-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="sd-canvas" class="sd-canvas"></canvas>
      <p id="tap-hint" class="sd-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="sd-overlay sd-paused" hidden>
        <p class="sd-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="sd-btn sd-btn-primary sd-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="sd-screen sd-end" hidden>
    <article class="sd-result" aria-labelledby="res-score">
      <p class="sd-eyebrow">${esc(R.over)}</p>
      <p id="res-reason" class="sd-reason"></p>
      <p class="sd-score-line"><span id="res-score" class="sd-score-big">0</span> <span class="sd-unit">${esc(R.unit)}</span></p>
      <p id="res-newbest" class="sd-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="sd-best"></p>
      <dl class="sd-stats">
        <div class="sd-stat"><dt>${esc(R.distance)}</dt><dd><span id="res-dist">0</span><small>${esc(P.mUnit)}</small></dd></div>
        <div class="sd-stat"><dt>${esc(R.items)}</dt><dd id="res-items">0</dd></div>
        <div class="sd-stat"><dt>${esc(R.jumps)}</dt><dd id="res-jumps">0</dd></div>
      </dl>
      <p class="sd-tier"><span class="sd-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="sd-tier-name"></span></p>
      <div id="res-rank" class="sd-rank" hidden>
        <p id="res-comparing" class="sd-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="sd-top"></p>
          <p id="res-beat" class="sd-beat"></p>
          <p id="res-others" class="sd-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['sled-core.js', 'sled.js'] })}
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
<body class="sd-body">
${G.topBar(lang, rel)}
<main class="sd-shell">
  <div class="sd-doc">
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
