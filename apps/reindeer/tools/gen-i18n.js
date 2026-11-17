#!/usr/bin/env node
/**
 * 순록 점프(Reindeer Jump) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 짧은 방법 3칸) → 게임 화면(HUD + 캔버스 + 준비 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 reindeer-core.js, 화면 동작은 reindeer.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(계속 화면을 누르는 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(점수·최고 기록·거리·선물·방울·등급·서버 실제 백분위) → <div data-mg-end="reindeer">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'reindeer';
const SITE_ROOT = 'https://reindeer.example.com';
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
<meta name="theme-color" content="#16244a">
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

// 시작 화면 티저 그림: 별빛 밤하늘·달·눈 덮인 지붕·연기 나는 굴뚝 위로 뛰어오른 순록, 선물·황금 방울·까마귀 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 240 180" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="rdsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1b3d"/><stop offset="1" stop-color="#2c3f7a"/></linearGradient>
<clipPath id="rdclip"><rect x="0" y="0" width="240" height="180" rx="26"/></clipPath>
</defs>
<g clip-path="url(#rdclip)">
<rect x="0" y="0" width="240" height="180" fill="url(#rdsky)"/>
<circle cx="196" cy="34" r="17" fill="#fff4cf"/><circle cx="190" cy="30" r="3" fill="#efe1b0"/><circle cx="200" cy="40" r="2.2" fill="#efe1b0"/>
<g fill="#ffffff"><circle cx="24" cy="22" r="1.4"/><circle cx="58" cy="40" r="1"/><circle cx="96" cy="16" r="1.5"/><circle cx="140" cy="30" r="1.1"/><circle cx="160" cy="64" r="1"/><circle cx="226" cy="74" r="1.3"/><circle cx="14" cy="66" r="1"/><circle cx="120" cy="58" r="1"/></g>
<path d="M0 118 L18 104 L36 118 L36 112 L60 112 L60 104 L86 104 L86 118 Z" fill="#1d2b55"/>
<path d="M150 116 L172 98 L194 116 L240 116 L240 102 L214 102 L214 116 Z" fill="#1d2b55"/>
<rect x="0" y="134" width="106" height="60" fill="#5b3f6e"/><rect x="0" y="128" width="106" height="9" rx="4" fill="#ffffff"/>
<rect x="134" y="134" width="106" height="60" fill="#3f5487"/><rect x="134" y="128" width="106" height="9" rx="4" fill="#ffffff"/>
<g fill="#ffd36e"><rect x="14" y="148" width="10" height="12" rx="2"/><rect x="40" y="148" width="10" height="12" rx="2"/><rect x="66" y="148" width="10" height="12" rx="2"/><rect x="152" y="148" width="10" height="12" rx="2"/><rect x="204" y="148" width="10" height="12" rx="2"/></g>
<g transform="translate(64 128)"><rect x="-10" y="-30" width="20" height="30" fill="#b6533f"/><rect x="-13" y="-34" width="26" height="7" rx="3" fill="#ffffff"/><path d="M-6 -22 H6 M-10 -12 H10" stroke="#8d3b2c" stroke-width="2"/></g>
<g fill="#cfd7ec" opacity=".75"><circle cx="66" cy="84" r="6"/><circle cx="72" cy="74" r="7.5"/><circle cx="80" cy="62" r="9"/></g>
<g transform="translate(182 120)"><rect x="-11" y="-9" width="22" height="17" rx="3" fill="#e5484d"/><rect x="-2" y="-9" width="4" height="17" fill="#ffd36e"/><rect x="-11" y="-3" width="22" height="4" fill="#ffd36e"/><path d="M0 -9 q-8 -8 -10 -2 q4 3 10 2 q8 -8 10 -2 q-4 3 -10 2" fill="#ffd36e"/></g>
<g transform="translate(150 50)"><path d="M-8 6 Q-8 -8 0 -9 Q8 -8 8 6 Z" fill="#f2b632"/><rect x="-10" y="5" width="20" height="3" rx="1.5" fill="#d2921c"/><circle cx="0" cy="9" r="2.6" fill="#d2921c"/><circle cx="0" cy="-10" r="2" fill="none" stroke="#d2921c" stroke-width="1.6"/></g>
<g transform="translate(212 92)"><path d="M-9 0 Q-2 -9 2 -1 Q6 -10 12 -2 Q5 2 2 3 Q-3 3 -9 0 Z" fill="#141a2b"/><circle cx="-6" cy="-1" r="3.6" fill="#141a2b"/><path d="M-9 -1 L-13 0 L-9 1 Z" fill="#f2b632"/><circle cx="-6.5" cy="-2" r=".9" fill="#ffffff"/></g>
<g transform="translate(118 84) rotate(-12)">
<path d="M-24 6 L-38 18 M-18 8 L-28 24 M14 8 L24 22 M20 6 L34 14" stroke="#7a5233" stroke-width="5" stroke-linecap="round"/>
<path d="M-38 18 l-3 2 M-28 24 l-2 3 M24 22 l3 2 M34 14 l3 1" stroke="#3a2a1e" stroke-width="5" stroke-linecap="round"/>
<ellipse cx="0" cy="0" rx="28" ry="15" fill="#9a6a43"/>
<ellipse cx="2" cy="6" rx="20" ry="7" fill="#d9b48a"/>
<path d="M-27 -3 q-8 -2 -9 4 q6 1 9 -1" fill="#f3e6d2"/>
<path d="M18 -6 Q28 -14 30 -26 L40 -24 Q38 -8 26 2 Z" fill="#9a6a43"/>
<ellipse cx="40" cy="-28" rx="12" ry="8" fill="#9a6a43" transform="rotate(14 40 -28)"/>
<ellipse cx="50" cy="-25" rx="4" ry="3.4" fill="#3a2a1e"/>
<circle cx="40" cy="-31" r="1.8" fill="#1b1b1b"/>
<path d="M33 -34 q-6 -6 -10 -4 q4 4 10 6" fill="#8a5c39"/>
<path d="M36 -36 L32 -52 M33 -46 L26 -50 M32 -52 L34 -58 M32 -52 L27 -57 M42 -36 L46 -52 M45 -46 L52 -50 M46 -52 L44 -58 M46 -52 L51 -57" stroke="#e9d6b0" stroke-width="3" stroke-linecap="round"/>
<path d="M18 -4 Q24 2 31 -6" stroke="#2f9e6b" stroke-width="5" fill="none" stroke-linecap="round"/>
<circle cx="25" cy="2" r="3.4" fill="#f2b632"/>
</g>
<g fill="#ffffff" opacity=".9"><circle cx="34" cy="96" r="1.6"/><circle cx="104" cy="122" r="1.3"/><circle cx="168" cy="86" r="1.5"/><circle cx="228" cy="128" r="1.4"/><circle cx="120" cy="150" r="1.6"/></g>
</g>
</svg>`;
}
const HERO_SVG = heroSvg('rd-hero-art');

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
  // 브라우저(reindeer.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="rd-body">
${G.topBar(lang, rel)}

<main class="rd-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(톡 점프·꾹 높이·2단 점프) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="rd-screen rd-start">
    <p class="rd-badge">${esc(S.badge)}</p>
    <div class="rd-hero" aria-hidden="true">
      ${HERO_SVG}
    </div>
    <h1 class="rd-h1"><span class="rd-kicker">${esc(S.h1Kicker)}</span><span class="rd-h1-main">${S.h1Html}</span></h1>
    <p class="rd-hook">${esc(S.hook)}</p>
    <ul class="rd-how">
      <li><span class="rd-how-ico" aria-hidden="true">👆</span><span class="rd-how-txt">${esc(S.how.tap)}</span></li>
      <li><span class="rd-how-ico" aria-hidden="true">⏫</span><span class="rd-how-txt">${esc(S.how.hold)}</span></li>
      <li><span class="rd-how-ico" aria-hidden="true">✨</span><span class="rd-how-txt">${esc(S.how.air)}</span></li>
    </ul>
    <button id="start-btn" class="rd-btn rd-btn-primary" type="button">${esc(S.start)}</button>
    <p class="rd-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + 준비 안내 (광고 없음) -->
  <section id="screen-play" class="rd-screen rd-play" hidden>
    <div class="rd-hud">
      <div class="rd-hud-box rd-hud-score"><span class="rd-hud-label">${esc(P.score)}</span><span class="rd-hud-val"><span id="hud-score">0</span></span></div>
      <div class="rd-hud-box rd-hud-dist"><span class="rd-hud-label">${esc(P.dist)}</span><span class="rd-hud-val"><span id="hud-dist">0</span><small>${esc(P.mUnit)}</small></span></div>
      <div class="rd-hud-box rd-hud-lives"><span class="rd-hud-label">${esc(P.lives)}</span><span id="hud-lives" class="rd-hud-val rd-hearts" aria-live="polite"><span>♥</span><span>♥</span><span>♥</span></span></div>
      <button id="pause-btn" class="rd-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="rd-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="rd-canvas" class="rd-canvas"></canvas>
      <p id="tap-hint" class="rd-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="rd-overlay rd-paused" hidden>
        <p class="rd-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="rd-btn rd-btn-primary rd-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="rd-screen rd-end" hidden>
    <article class="rd-result" aria-labelledby="res-score">
      <p class="rd-eyebrow">${esc(R.over)}</p>
      <p id="res-reason" class="rd-reason"></p>
      <p class="rd-score-line"><span id="res-score" class="rd-score-big">0</span> <span class="rd-unit">${esc(R.unit)}</span></p>
      <p id="res-newbest" class="rd-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="rd-best"></p>
      <dl class="rd-stats">
        <div class="rd-stat"><dt>${esc(R.distance)}</dt><dd><span id="res-dist">0</span><small>${esc(P.mUnit)}</small></dd></div>
        <div class="rd-stat"><dt>${esc(R.presents)}</dt><dd id="res-presents">0</dd></div>
        <div class="rd-stat"><dt>${esc(R.bells)}</dt><dd id="res-bells">0</dd></div>
      </dl>
      <p class="rd-tier"><span class="rd-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="rd-tier-name"></span></p>
      <div id="res-rank" class="rd-rank" hidden>
        <p id="res-comparing" class="rd-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="rd-top"></p>
          <p id="res-beat" class="rd-beat"></p>
          <p id="res-others" class="rd-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['reindeer-core.js', 'reindeer.js'] })}
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
<body class="rd-body">
${G.topBar(lang, rel)}
<main class="rd-shell">
  <div class="rd-doc">
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
