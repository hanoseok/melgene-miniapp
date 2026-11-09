#!/usr/bin/env node
/**
 * 얼음 낚시(Ice Fishing) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 짧은 방법 3칸) → 게임 화면(HUD + 캔버스 + 준비 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 icefish-core.js, 화면 동작은 icefish.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(누르고 있는 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(점수·최고 기록·잡은 물고기·끊어진 줄·최고 수확·등급·서버 실제 백분위) → <div data-mg-end="icefish">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'icefish';
const SITE_ROOT = 'https://icefish.example.com';
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
<meta name="theme-color" content="#0b3a5c">
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

// 시작 화면 티저 그림: 옆에서 본 얼음 호수 — 얼음판 위 낚시꾼, 구멍으로 내려간 낚싯줄, 물속 물고기들 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 240 180" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="icesky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6f7"/><stop offset="1" stop-color="#f2f8fd"/></linearGradient>
<linearGradient id="icewater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f86b8"/><stop offset="1" stop-color="#0b2a48"/></linearGradient>
<clipPath id="iceclip"><rect x="0" y="0" width="240" height="180" rx="26"/></clipPath>
</defs>
<g clip-path="url(#iceclip)">
<rect x="0" y="0" width="240" height="180" fill="url(#icesky)"/>
<path d="M0 50 L18 30 L30 44 L44 24 L60 46 L76 32 L92 50 Z" fill="#9cc0dc"/>
<path d="M150 50 L170 34 L184 46 L204 26 L222 44 L240 36 V50 Z" fill="#9cc0dc"/>
<rect x="0" y="66" width="240" height="114" fill="url(#icewater)"/>
<path d="M0 50 H118 V66 H0 Z M142 50 H240 V66 H142 Z" fill="#eaf5fd"/>
<path d="M0 50 H118 M142 50 H240" stroke="#ffffff" stroke-width="3"/>
<path d="M0 66 H118 M142 66 H240" stroke="#a7d3ef" stroke-width="2"/>
<g transform="translate(92 34)">
<rect x="-10" y="10" width="20" height="5" rx="2" fill="#7a5638"/>
<ellipse cx="0" cy="2" rx="9" ry="10" fill="#e8574c"/>
<circle cx="0" cy="-11" r="6.5" fill="#ffd9b8"/>
<path d="M-7 -12 Q0 -22 7 -12 Z" fill="#2f5d8a"/><circle cx="0" cy="-20" r="2.6" fill="#ffffff"/>
<path d="M5 0 L44 -18" stroke="#3a2a1e" stroke-width="2" stroke-linecap="round"/>
</g>
<path d="M136 16 V120" stroke="#e9f4fb" stroke-width="1.2"/>
<path d="M136 120 q4 6 -1 8" stroke="#d8dee6" stroke-width="1.6" fill="none"/>
<circle cx="136" cy="78" r="3" fill="#e8574c"/><circle cx="136" cy="78" r="1.2" fill="#ffffff"/>
<g transform="translate(176 126)"><ellipse cx="0" cy="0" rx="16" ry="7" fill="#f4b63f"/><path d="M14 0 L24 -7 L24 7 Z" fill="#e39a1f"/><circle cx="-9" cy="-1.5" r="1.6" fill="#0b2a48"/></g>
<g transform="translate(70 104)"><ellipse cx="0" cy="0" rx="13" ry="5.5" fill="#7fc6a4"/><path d="M-11 0 L-20 -6 L-20 6 Z" fill="#5aa984"/><circle cx="8" cy="-1" r="1.4" fill="#0b2a48"/></g>
<g transform="translate(108 150)"><ellipse cx="0" cy="0" rx="20" ry="7" fill="#9aa9b8"/><path d="M18 0 L29 -8 L29 8 Z" fill="#7c8b9b"/><circle cx="-12" cy="-1.5" r="1.6" fill="#0b2a48"/></g>
<g fill="#bfe3f7" opacity=".7"><circle cx="138" cy="100" r="2"/><circle cx="142" cy="90" r="1.4"/><circle cx="60" cy="140" r="1.6"/><circle cx="200" cy="96" r="1.4"/></g>
<path d="M0 172 Q40 164 80 170 T160 168 T240 170 V180 H0 Z" fill="#06203a"/>
<g fill="#ffffff"><circle cx="30" cy="16" r="1.6"/><circle cx="210" cy="14" r="1.4"/><circle cx="120" cy="8" r="1.2"/></g>
</g>
</svg>`;
}
const HERO_SVG = heroSvg('ice-hero-art');

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
  // 브라우저(icefish.js)에서 쓰는 문구
  const runtime = { play: P, result: R, fish: T.fish };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="ice-body">
${G.topBar(lang, rel)}

<main class="ice-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(조작이 두 가지) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="ice-screen ice-start">
    <p class="ice-badge">${esc(S.badge)}</p>
    <div class="ice-hero" aria-hidden="true">
      ${HERO_SVG}
    </div>
    <h1 class="ice-h1"><span class="ice-kicker">${esc(S.h1Kicker)}</span><span class="ice-h1-main">${S.h1Html}</span></h1>
    <p class="ice-hook">${esc(S.hook)}</p>
    <ul class="ice-how">
      <li><span class="ice-how-ico" aria-hidden="true">👇</span><span class="ice-how-txt">${esc(S.how.lower)}</span></li>
      <li><span class="ice-how-ico" aria-hidden="true">🐟</span><span class="ice-how-txt">${esc(S.how.reel)}</span></li>
      <li><span class="ice-how-ico" aria-hidden="true">🟥</span><span class="ice-how-txt">${esc(S.how.red)}</span></li>
    </ul>
    <button id="start-btn" class="ice-btn ice-btn-primary" type="button">${esc(S.start)}</button>
    <p class="ice-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + 준비 안내 (광고 없음) -->
  <section id="screen-play" class="ice-screen ice-play" hidden>
    <div class="ice-hud">
      <div class="ice-hud-box ice-hud-score"><span class="ice-hud-label">${esc(P.score)}</span><span class="ice-hud-val"><span id="hud-score">0</span></span></div>
      <div class="ice-hud-box ice-hud-time"><span class="ice-hud-label">${esc(P.time)}</span><span class="ice-hud-val"><span id="hud-time">60</span><small>${esc(P.secUnit)}</small></span></div>
      <button id="pause-btn" class="ice-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="ice-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="ice-canvas" class="ice-canvas"></canvas>
      <p id="tap-hint" class="ice-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="ice-overlay ice-paused" hidden>
        <p class="ice-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="ice-btn ice-btn-primary ice-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="ice-screen ice-end" hidden>
    <article class="ice-result" aria-labelledby="res-score">
      <p class="ice-eyebrow">${esc(R.over)}</p>
      <p class="ice-score-line"><span id="res-score" class="ice-score-big">0</span> <span class="ice-unit">${esc(R.unit)}</span></p>
      <p id="res-newbest" class="ice-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="ice-best"></p>
      <dl class="ice-stats">
        <div class="ice-stat"><dt>${esc(R.caught)}</dt><dd id="res-caught">0</dd></div>
        <div class="ice-stat"><dt>${esc(R.snapped)}</dt><dd id="res-snapped">0</dd></div>
      </dl>
      <p id="res-bestcatch" class="ice-bestcatch"></p>
      <p class="ice-tier"><span class="ice-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="ice-tier-name"></span></p>
      <div id="res-rank" class="ice-rank" hidden>
        <p id="res-comparing" class="ice-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="ice-top"></p>
          <p id="res-beat" class="ice-beat"></p>
          <p id="res-others" class="ice-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['icefish-core.js', 'icefish.js'] })}
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
<body class="ice-body">
${G.topBar(lang, rel)}
<main class="ice-shell">
  <div class="ice-doc">
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
