#!/usr/bin/env node
/**
 * 눈싸움(Snowball Fight) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 짧은 방법 3칸) → 게임 화면(HUD + 캔버스 + 숙이기 버튼 + 준비 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 snowball-core.js, 화면 동작은 snowball.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(빠르게 누르는 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(점수·최고 기록·맞힌 수·명중률·최고 콤보·등급·서버 실제 백분위) → <div data-mg-end="snowball">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'snowball';
const SITE_ROOT = 'https://snowball.example.com';
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
<meta name="theme-color" content="#1d4e89">
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

// 시작 화면 티저 그림: 눈 덮인 마당 — 눈 요새 뒤에서 고개를 내민 아이, 날아가는 눈덩이, 앞쪽 내 눈벽 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 240 180" aria-hidden="true" focusable="false">
<defs>
<linearGradient id="sbsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3ef"/><stop offset="1" stop-color="#e3f1fc"/></linearGradient>
<clipPath id="sbclip"><rect x="0" y="0" width="240" height="180" rx="26"/></clipPath>
</defs>
<g clip-path="url(#sbclip)">
<rect x="0" y="0" width="240" height="180" fill="url(#sbsky)"/>
<path d="M0 62 Q50 40 110 56 T240 50 V80 H0 Z" fill="#cfe3f3"/>
<g fill="#3f7a64"><path d="M22 66 L32 40 L42 66 Z"/><path d="M196 62 L207 34 L218 62 Z"/><path d="M212 64 L220 46 L228 64 Z"/></g>
<rect x="0" y="70" width="240" height="110" fill="#f5fafe"/>
<g transform="translate(120 70)">
<rect x="-12" y="8" width="24" height="26" rx="8" fill="#e8574c"/>
<circle cx="0" cy="0" r="12" fill="#ffd9b8"/>
<path d="M-12 -1 Q-12 -15 0 -15 Q12 -15 12 -1 Z" fill="#2f6fbf"/><rect x="-13" y="-3" width="26" height="5" rx="2" fill="#ffffff"/><circle cx="0" cy="-17" r="4" fill="#ffffff"/>
<circle cx="-4" cy="3" r="1.6" fill="#1d2a3a"/><circle cx="4" cy="3" r="1.6" fill="#1d2a3a"/><path d="M-4 8 Q0 11 4 8" stroke="#1d2a3a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<path d="M10 14 L22 -6" stroke="#e8574c" stroke-width="7" stroke-linecap="round"/><circle cx="23" cy="-9" r="6.5" fill="#ffffff" stroke="#b9d3e8" stroke-width="1.2"/>
</g>
<path d="M62 112 Q64 92 90 90 L150 90 Q176 92 178 112 Z" fill="#ffffff" stroke="#b9d3e8" stroke-width="2"/>
<path d="M80 100 H160 M100 90 V100 M140 90 V100 M88 100 V112 M120 100 V112 M152 100 V112" stroke="#d6e6f3" stroke-width="1.6"/>
<circle cx="62" cy="52" r="5" fill="#ffffff" stroke="#b9d3e8" stroke-width="1.2"/>
<path d="M68 58 q14 14 30 40" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 4" fill="none" opacity=".8"/>
<circle cx="182" cy="128" r="9" fill="#ffffff" stroke="#b9d3e8" stroke-width="1.4"/>
<path d="M0 150 Q60 140 120 146 T240 144 V180 H0 Z" fill="#ffffff"/>
<path d="M0 150 Q60 140 120 146 T240 144" stroke="#b9d3e8" stroke-width="2" fill="none"/>
<path d="M30 160 H90 M150 158 H214 M60 150 V160 M180 146 V158" stroke="#dbe9f5" stroke-width="1.6"/>
<g fill="#ffffff"><circle cx="30" cy="20" r="2"/><circle cx="84" cy="12" r="1.6"/><circle cx="150" cy="22" r="2"/><circle cx="210" cy="14" r="1.6"/><circle cx="112" cy="34" r="1.4"/><circle cx="226" cy="90" r="1.6"/><circle cx="18" cy="104" r="1.6"/></g>
</g>
</svg>`;
}
const HERO_SVG = heroSvg('sb-hero-art');

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
  // 브라우저(snowball.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="sb-body">
${G.topBar(lang, rel)}

<main class="sb-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(던지기·숙이기·친구 피하기) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="sb-screen sb-start">
    <p class="sb-badge">${esc(S.badge)}</p>
    <div class="sb-hero" aria-hidden="true">
      ${HERO_SVG}
    </div>
    <h1 class="sb-h1"><span class="sb-kicker">${esc(S.h1Kicker)}</span><span class="sb-h1-main">${S.h1Html}</span></h1>
    <p class="sb-hook">${esc(S.hook)}</p>
    <ul class="sb-how">
      <li><span class="sb-how-ico" aria-hidden="true">👆</span><span class="sb-how-txt">${esc(S.how.throw)}</span></li>
      <li><span class="sb-how-ico" aria-hidden="true">🛡️</span><span class="sb-how-txt">${esc(S.how.duck)}</span></li>
      <li><span class="sb-how-ico" aria-hidden="true">🐶</span><span class="sb-how-txt">${esc(S.how.avoid)}</span></li>
    </ul>
    <button id="start-btn" class="sb-btn sb-btn-primary" type="button">${esc(S.start)}</button>
    <p class="sb-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + 숙이기 버튼 + 준비 안내 (광고 없음) -->
  <section id="screen-play" class="sb-screen sb-play" hidden>
    <div class="sb-hud">
      <div class="sb-hud-box sb-hud-score"><span class="sb-hud-label">${esc(P.score)}</span><span class="sb-hud-val"><span id="hud-score">0</span></span></div>
      <div class="sb-hud-box sb-hud-time"><span class="sb-hud-label">${esc(P.time)}</span><span class="sb-hud-val"><span id="hud-time">60</span><small>${esc(P.secUnit)}</small></span></div>
      <div class="sb-hud-box sb-hud-lives"><span class="sb-hud-label">${esc(P.lives)}</span><span id="hud-lives" class="sb-hud-val sb-hearts" aria-live="polite"><span>♥</span><span>♥</span><span>♥</span></span></div>
      <button id="pause-btn" class="sb-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="sb-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="sb-canvas" class="sb-canvas"></canvas>
      <p id="tap-hint" class="sb-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="sb-overlay sb-paused" hidden>
        <p class="sb-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="sb-btn sb-btn-primary sb-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
    <button id="duck-btn" class="sb-duck" type="button" aria-label="${esc(P.duckAria)}"><span class="sb-duck-ico" aria-hidden="true">🛡️</span><span class="sb-duck-txt">${esc(P.duck)}</span></button>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="sb-screen sb-end" hidden>
    <article class="sb-result" aria-labelledby="res-score">
      <p class="sb-eyebrow">${esc(R.over)}</p>
      <p id="res-reason" class="sb-reason"></p>
      <p class="sb-score-line"><span id="res-score" class="sb-score-big">0</span> <span class="sb-unit">${esc(R.unit)}</span></p>
      <p id="res-newbest" class="sb-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="sb-best"></p>
      <dl class="sb-stats">
        <div class="sb-stat"><dt>${esc(R.hits)}</dt><dd id="res-hits">0</dd></div>
        <div class="sb-stat"><dt>${esc(R.accuracy)}</dt><dd id="res-acc">0</dd></div>
        <div class="sb-stat"><dt>${esc(R.bestCombo)}</dt><dd id="res-combo">0</dd></div>
      </dl>
      <p class="sb-tier"><span class="sb-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="sb-tier-name"></span></p>
      <div id="res-rank" class="sb-rank" hidden>
        <p id="res-comparing" class="sb-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="sb-top"></p>
          <p id="res-beat" class="sb-beat"></p>
          <p id="res-others" class="sb-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['snowball-core.js', 'snowball.js'] })}
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
<body class="sb-body">
${G.topBar(lang, rel)}
<main class="sb-shell">
  <div class="sb-doc">
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
