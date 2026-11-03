#!/usr/bin/env node
/**
 * 클릭 속도 테스트(CPS Test) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 모드 1·5·10초 고르기 + 한 줄 방법) → 게임 화면(HUD + 큰 클릭 영역) → 끝 화면(결과 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙은 cps-core.js, 화면 동작은 cps.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·모드 고르기·한 줄 방법·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개.
 *   - 게임 화면에는 광고를 두지 않는다(연타 게임 — 실수로 누르기 쉬움).
 *   - 끝 화면 = 결과(CPS·클릭 수·등급·내 최고·서버 실제 백분위) → <div data-mg-end="cps">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(__dirname, '..', 'cps-core.js'));

const SITE_ID = 'cps';
const SITE_ROOT = 'https://cps.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// 숫자 글꼴(숫자·기호만 쓰므로 언어와 무관)
const DIGITS_CSS = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

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
      `<link rel="stylesheet" href="${DIGITS_CSS}">`,
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
<meta name="theme-color" content="#150d2b">
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

// 시작 화면 티저 그림: 마우스 커서 + 클릭 물결 + CPS (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 220 220" aria-hidden="true" focusable="false">
<circle cx="96" cy="92" r="84" fill="#241449"/>
<circle cx="96" cy="92" r="70" fill="none" stroke="#ff4f9a" stroke-width="5" opacity=".45"/>
<circle cx="96" cy="92" r="48" fill="none" stroke="#ff4f9a" stroke-width="6" opacity=".75"/>
<circle cx="96" cy="92" r="26" fill="none" stroke="#ffd23f" stroke-width="7"/>
<path d="M60 40 L48 26 M132 40 L144 26 M40 92 L22 92 M152 92 L170 92 M60 144 L48 158" stroke="#3de0ff" stroke-width="7" stroke-linecap="round"/>
<path d="M96 92 L96 196 L120 172 L138 212 L158 203 L140 164 L174 164 Z" fill="#ffffff" stroke="#150d2b" stroke-width="8" stroke-linejoin="round"/>
<rect x="150" y="16" width="62" height="34" rx="11" fill="#ffd23f" stroke="#150d2b" stroke-width="4"/>
<text x="181" y="41" text-anchor="middle" font-family="'Chakra Petch', ui-monospace, monospace" font-weight="700" font-size="22" fill="#150d2b">CPS</text>
</svg>`;
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
  const runtime = { play: P, result: R };
  const modes = C.MODES.map((n) => `        <label class="cp-seg-btn"><input type="radio" name="mode" value="${n}"${n === C.DEFAULT_MODE ? ' checked' : ''}><span>${esc(fill(S.modeValue, { n }))}</span></label>`).join('\n');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="cp-body">
${G.topBar(lang, rel)}

<main class="cp-shell">
  <!-- 시작 화면: 티징 + 모드 고르기 + 한 줄 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="cp-screen cp-start">
    <p class="cp-badge">${esc(S.badge)}</p>
    <div class="cp-hero" aria-hidden="true">
      ${heroSvg('cp-hero-art')}
    </div>
    <h1 class="cp-h1"><span class="cp-kicker">${esc(S.h1Kicker)}</span><span class="cp-h1-main">${S.h1Html}</span></h1>
    <p class="cp-hook">${esc(S.hook)}</p>
    <div class="cp-opts">
      <p id="mode-label" class="cp-opt-label">${esc(S.modeLabel)}</p>
      <div class="cp-seg" role="radiogroup" aria-labelledby="mode-label">
${modes}
      </div>
    </div>
    <p class="cp-how">${esc(S.how)}</p>
    <button id="start-btn" class="cp-btn cp-btn-primary" type="button">${esc(S.start)}</button>
    <p class="cp-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD(남은 시간·클릭·CPS) + 큰 클릭 영역 (광고 없음). 첫 클릭에 시계가 시작된다 -->
  <section id="screen-play" class="cp-screen cp-play" hidden>
    <p class="cp-mode"><span id="play-mode"></span></p>
    <div class="cp-hud">
      <div class="cp-hud-box"><span class="cp-hud-k">${esc(P.time)}</span><span id="hud-time" class="cp-hud-v">0.0</span></div>
      <div class="cp-hud-box"><span class="cp-hud-k">${esc(P.clicks)}</span><span id="hud-clicks" class="cp-hud-v">0</span></div>
      <div class="cp-hud-box"><span class="cp-hud-k">${esc(P.cps)}</span><span id="hud-cps" class="cp-hud-v">0.0</span></div>
    </div>
    <div class="cp-bar" aria-hidden="true"><span id="hud-bar"></span></div>
    <div id="zone" class="cp-zone is-ready" role="application" aria-label="${esc(P.zoneAria)}" aria-describedby="zone-sub">
      <div id="ripples" class="cp-ripples" aria-hidden="true"></div>
      <p id="zone-main" class="cp-zone-main">${esc(P.ready)}</p>
      <p id="zone-sub" class="cp-zone-sub" aria-live="polite">${esc(P.readySub)}</p>
    </div>
    <p id="play-note" class="cp-note" aria-live="polite" hidden></p>
    <button id="change-btn" class="cp-link" type="button">${esc(P.change)}</button>
  </section>

  <!-- 끝 화면: 결과 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="cp-screen cp-end" hidden>
    <article class="cp-result" aria-labelledby="res-cps">
      <p class="cp-eyebrow">${esc(R.over)}</p>
      <p id="res-mode" class="cp-res-mode"></p>
      <p class="cp-res-big"><span id="res-cps" class="cp-cps-big">0.0</span><span class="cp-cps-unit">${esc(R.unit)}</span></p>
      <div class="cp-stats">
        <div class="cp-stat"><span class="cp-stat-k">${esc(R.clicks)}</span><span id="res-clicks" class="cp-stat-v">0</span></div>
        <div class="cp-stat"><span class="cp-stat-k">${esc(R.time)}</span><span id="res-time" class="cp-stat-v">0</span></div>
      </div>
      <p class="cp-tier"><span class="cp-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="cp-tier-name"></span></p>
      <p id="res-newbest" class="cp-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-pb" class="cp-pb"></p>
      <p id="res-toofast" class="cp-toofast" hidden>${esc(R.tooFast)}</p>
      <div id="res-rank" class="cp-rank" hidden>
        <p id="res-comparing" class="cp-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="cp-top"></p>
          <p id="res-beat" class="cp-beat"></p>
          <p id="res-others" class="cp-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['cps-core.js', 'cps.js'] })}
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
<body class="cp-body">
${G.topBar(lang, rel)}
<main class="cp-shell">
  <div class="cp-doc">
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
