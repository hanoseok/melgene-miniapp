#!/usr/bin/env node
/**
 * 에임 연습(Aim Trainer) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 모드 Classic·Timed 고르기 + 한 줄 방법) → 게임 화면(HUD + 플레이 영역) → 끝 화면(결과 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙은 aim-core.js, 화면 동작은 aim.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·모드 고르기·한 줄 방법·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개.
 *   - 게임 화면에는 광고를 두지 않는다(빠르게 누르는 게임 — 실수로 누르기 쉬움).
 *   - 끝 화면 = 결과(점수·정확도·평균 시간·등급·내 최고·서버 실제 백분위) → <div data-mg-end="aim">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(__dirname, '..', 'aim-core.js'));

const SITE_ID = 'aim';
const SITE_ROOT = 'https://aim.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// 숫자 글꼴(숫자·기호만 쓰므로 언어와 무관)
const DIGITS_CSS = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');

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
<meta name="theme-color" content="#0b1a2e">
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

// 시작 화면 티저 그림: 과녁 + 조준선 + 맞힌 자국 (SVG, 장식) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 220 220" aria-hidden="true" focusable="false">
<circle cx="110" cy="110" r="100" fill="#10294a"/>
<circle cx="110" cy="110" r="78" fill="#ff5a4e" stroke="#0b1a2e" stroke-width="5"/>
<circle cx="110" cy="110" r="58" fill="#fff6e8"/>
<circle cx="110" cy="110" r="38" fill="#ff5a4e"/>
<circle cx="110" cy="110" r="18" fill="#fff6e8"/>
<circle cx="110" cy="110" r="7" fill="#0b1a2e"/>
<path d="M110 4 V44 M110 176 V216 M4 110 H44 M176 110 H216" stroke="#5ef2c2" stroke-width="7" stroke-linecap="round"/>
<circle cx="110" cy="110" r="96" fill="none" stroke="#5ef2c2" stroke-width="4" stroke-dasharray="14 12" opacity=".7"/>
<path d="M150 64 l10 -10 M154 74 l14 -2 M144 58 l2 -14" stroke="#ffd447" stroke-width="5" stroke-linecap="round"/>
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
  const runtime = { modes: T.modes, play: P, result: R };
  const modes = C.MODES.map((m) => `        <label class="am-seg-btn"><input type="radio" name="mode" value="${m}"${m === C.DEFAULT_MODE ? ' checked' : ''}><span><b>${esc(S.modes[m].name)}</b><small>${esc(S.modes[m].sub)}</small></span></label>`).join('\n');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="am-body">
${G.topBar(lang, rel)}

<main class="am-shell">
  <!-- 시작 화면: 티징 + 모드 고르기 + 한 줄 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="am-screen am-start">
    <p class="am-badge">${esc(S.badge)}</p>
    <div class="am-hero" aria-hidden="true">
      ${heroSvg('am-hero-art')}
    </div>
    <h1 class="am-h1"><span class="am-kicker">${esc(S.h1Kicker)}</span><span class="am-h1-main">${S.h1Html}</span></h1>
    <p class="am-hook">${esc(S.hook)}</p>
    <div class="am-opts">
      <p id="mode-label" class="am-opt-label">${esc(S.modeLabel)}</p>
      <div class="am-seg" role="radiogroup" aria-labelledby="mode-label">
${modes}
      </div>
    </div>
    <p class="am-how">${esc(S.how)}</p>
    <button id="start-btn" class="am-btn am-btn-primary" type="button">${esc(S.start)}</button>
    <p class="am-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD(시간·맞힘·정확도) + 플레이 영역 (광고 없음). 가운데 시작 과녁을 맞히면 시작 -->
  <section id="screen-play" class="am-screen am-play" hidden>
    <p class="am-mode"><span id="play-mode"></span></p>
    <div class="am-hud">
      <div class="am-hud-box"><span class="am-hud-k">${esc(P.time)}</span><span id="hud-time" class="am-hud-v">0.0</span></div>
      <div class="am-hud-box"><span class="am-hud-k">${esc(P.hits)}</span><span id="hud-hits" class="am-hud-v">0</span></div>
      <div class="am-hud-box"><span class="am-hud-k">${esc(P.acc)}</span><span id="hud-acc" class="am-hud-v">–</span></div>
    </div>
    <div class="am-bar" aria-hidden="true"><span id="hud-bar"></span></div>
    <div id="area" class="am-area is-ready" role="application" aria-label="${esc(P.areaAria)}" aria-describedby="area-sub">
      <div id="marks" class="am-marks" aria-hidden="true"></div>
      <div id="target" class="am-target is-start" aria-hidden="true"><i></i></div>
      <p id="area-main" class="am-area-main">${esc(P.ready)}</p>
      <p id="area-sub" class="am-area-sub" aria-live="polite">${esc(P.readySub)}</p>
    </div>
    <p id="play-note" class="am-note" aria-live="polite" hidden></p>
    <button id="change-btn" class="am-link" type="button">${esc(P.change)}</button>
  </section>

  <!-- 끝 화면: 결과 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="am-screen am-end" hidden>
    <article class="am-result" aria-labelledby="res-score">
      <p class="am-eyebrow">${esc(R.over)}</p>
      <p id="res-mode" class="am-res-mode"></p>
      <p id="res-score-label" class="am-res-label"></p>
      <p class="am-res-big"><span id="res-score" class="am-score-big">0</span><span id="res-unit" class="am-score-unit"></span></p>
      <div class="am-stats">
        <div class="am-stat"><span class="am-stat-k">${esc(R.acc)}</span><span id="res-acc" class="am-stat-v">0</span></div>
        <div id="cell-avg" class="am-stat"><span class="am-stat-k">${esc(R.avg)}</span><span id="res-avg" class="am-stat-v">0</span></div>
        <div id="cell-misses" class="am-stat"><span class="am-stat-k">${esc(R.misses)}</span><span id="res-misses" class="am-stat-v">0</span></div>
        <div id="cell-total" class="am-stat"><span class="am-stat-k">${esc(R.total)}</span><span id="res-total" class="am-stat-v">0</span></div>
        <div id="cell-escaped" class="am-stat"><span class="am-stat-k">${esc(R.escaped)}</span><span id="res-escaped" class="am-stat-v">0</span></div>
      </div>
      <p class="am-tier"><span class="am-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="am-tier-name"></span></p>
      <p id="res-newbest" class="am-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-pb" class="am-pb"></p>
      <p id="res-invalid" class="am-invalid" hidden>${esc(R.invalid)}</p>
      <div id="res-rank" class="am-rank" hidden>
        <p id="res-comparing" class="am-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="am-top"></p>
          <p id="res-beat" class="am-beat"></p>
          <p id="res-others" class="am-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['aim-core.js', 'aim.js'] })}
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
<body class="am-body">
${G.topBar(lang, rel)}
<main class="am-shell">
  <div class="am-doc">
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
