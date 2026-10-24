#!/usr/bin/env node
/**
 * 할로윈 박쥐 날기(Flappy Bat) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 아주 짧은 방법) → 게임 화면(HUD + 캔버스 + 준비 안내) → 끝 화면(점수 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 게임 규칙·점수는 bat-core.js, 화면 동작은 bat.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개. SEO 글·FAQ 없음.
 *   - 게임 화면에는 광고를 두지 않는다(액션 게임 — 실수로 누르기 쉬움). 광고는 끝 화면(공통 컴포넌트)에만.
 *   - 끝 화면 = 결과(지난 틈 수·최고 기록·날갯짓 수·비행 시간·서버 실제 백분위) → <div data-mg-end="bat">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'bat';
const SITE_ROOT = 'https://bat.example.com';
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
<meta name="theme-color" content="#120a2c">
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

// 시작 화면 티저 그림: 보름달 앞을 나는 박쥐 + 묘비·유령 나무 기둥 (SVG, 장식)
function batPath(cx, cy, s) {
  // 날개를 펼친 박쥐 실루엣 (가운데 cx,cy, 크기 s)
  const k = (x, y) => `${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`;
  return `M${k(0, -6)} Q${k(-14, -18)} ${k(-34, -10)} Q${k(-30, -2)} ${k(-26, 4)} Q${k(-20, 0)} ${k(-16, 7)} Q${k(-10, 2)} ${k(-5, 7)} L${k(0, 10)} L${k(5, 7)} Q${k(10, 2)} ${k(16, 7)} Q${k(20, 0)} ${k(26, 4)} Q${k(30, -2)} ${k(34, -10)} Q${k(14, -18)} ${k(0, -6)} Z`;
}
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 220 180" aria-hidden="true" focusable="false">
<defs><radialGradient id="bm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#ffd977"/></radialGradient></defs>
<circle cx="132" cy="70" r="52" fill="url(#bm)"/>
<circle cx="116" cy="56" r="9" fill="rgba(214,170,90,.35)"/><circle cx="150" cy="86" r="7" fill="rgba(214,170,90,.35)"/>
<rect x="18" y="0" width="34" height="62" rx="4" fill="#6b4c64"/><path d="M14 58 L22 70 L34 62 L46 70 L56 58 Z" fill="#6b4c64"/>
<rect x="18" y="122" width="34" height="58" fill="#6b4c64"/><path d="M14 126 L24 114 L35 122 L46 114 L56 126 Z" fill="#6b4c64"/>
<path d="M172 180 V128 a20 20 0 0 1 40 0 V180 Z" fill="#9b9bb8" stroke="#2c2448" stroke-width="2.5"/>
<rect x="189" y="122" width="6" height="26" fill="rgba(40,32,66,.55)"/><rect x="182" y="129" width="20" height="6" fill="rgba(40,32,66,.55)"/>
<path d="${batPath(96, 96, 1.55)}" fill="#3a1f52" stroke="#1a0b28" stroke-width="2"/>
<ellipse cx="96" cy="98" rx="13" ry="12" fill="#5b3380" stroke="#1a0b28" stroke-width="2"/>
<path d="M88 89 L90 78 L94 87 Z M104 89 L102 78 L98 87 Z" fill="#5b3380"/>
<circle cx="91" cy="96" r="3.6" fill="#fff8e8"/><circle cx="101" cy="96" r="3.6" fill="#fff8e8"/>
<circle cx="92" cy="96.6" r="1.6" fill="#1a0b28"/><circle cx="102" cy="96.6" r="1.6" fill="#1a0b28"/>
<path d="M93 103 l1.3 3.4 1.3-3.4 Z M98 103 l1.3 3.4 1.3-3.4 Z" fill="#fff8e8"/>
</svg>`;
}
const HERO_SVG = heroSvg('bat-hero-art');

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
  // 브라우저(bat.js)에서 쓰는 문구
  const runtime = { play: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="bat-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="bat-shell">
  <!-- 시작 화면: 티징 + 아주 짧은 방법(액션 게임) + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="bat-screen bat-start">
    <p class="bat-badge">${esc(S.badge)}</p>
    <div class="bat-hero" aria-hidden="true">
      ${HERO_SVG}
    </div>
    <h1 class="bat-h1"><span class="bat-kicker">${esc(S.h1Kicker)}</span><span class="bat-h1-main">${S.h1Html}</span></h1>
    <p class="bat-hook">${esc(S.hook)}</p>
    <ul class="bat-how">
      <li><span class="bat-how-ico" aria-hidden="true">👆</span><span class="bat-how-txt">${esc(S.how.tap)}</span></li>
      <li><span class="bat-how-ico" aria-hidden="true">🦇</span><span class="bat-how-txt">${esc(S.how.pass)}</span></li>
      <li><span class="bat-how-ico" aria-hidden="true">🪦</span><span class="bat-how-txt">${esc(S.how.avoid)}</span></li>
    </ul>
    <button id="start-btn" class="bat-btn bat-btn-primary" type="button">${esc(S.start)}</button>
    <p class="bat-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 캔버스 + "탭해서 날기" 준비 안내 (광고 없음) -->
  <section id="screen-play" class="bat-screen bat-play" hidden>
    <div class="bat-hud">
      <div class="bat-hud-box bat-hud-score"><span class="bat-hud-label">${esc(P.score)}</span><span id="hud-score" class="bat-hud-val">0</span></div>
      <div class="bat-hud-box bat-hud-best"><span class="bat-hud-label">${esc(P.best)}</span><span id="hud-best" class="bat-hud-val">0</span></div>
      <button id="pause-btn" class="bat-pause" type="button" aria-label="${esc(P.pause)}" title="${esc(P.pause)}"><span aria-hidden="true"></span></button>
    </div>
    <div id="field" class="bat-field" tabindex="0" role="application" aria-label="${esc(P.fieldAria)}">
      <canvas id="bat-canvas" class="bat-canvas"></canvas>
      <p id="tap-hint" class="bat-hint" hidden>${esc(P.hint)}</p>
      <div id="pause-overlay" class="bat-overlay bat-paused" hidden>
        <p class="bat-paused-title">${esc(P.paused)}</p>
        <button id="resume-btn" class="bat-btn bat-btn-primary bat-btn-sm" type="button">${esc(P.resume)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 점수 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="bat-screen bat-end" hidden>
    <article class="bat-result" aria-labelledby="res-score">
      <p class="bat-eyebrow">${esc(R.over)}</p>
      <p class="bat-score-line"><span id="res-score" class="bat-score-big">0</span> <span class="bat-points">${esc(R.points)}</span></p>
      <p id="res-newbest" class="bat-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="bat-best"></p>
      <dl class="bat-stats">
        <div class="bat-stat"><dt>${esc(R.flaps)}</dt><dd id="res-flaps">0</dd></div>
        <div class="bat-stat"><dt>${esc(R.time)}</dt><dd id="res-time">0</dd></div>
      </dl>
      <div id="res-rank" class="bat-rank" hidden>
        <p id="res-comparing" class="bat-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="bat-top"></p>
          <p id="res-beat" class="bat-beat"></p>
          <p id="res-others" class="bat-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bat-core.js', 'bat.js'] })}
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
<body class="bat-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="bat-shell">
  <div class="bat-doc">
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
