#!/usr/bin/env node
/**
 * 10초 맞추기(10 Second Challenge) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 목표·블라인드 고르기 + 한 줄 방법) → 게임 화면(시계 + STOP) → 끝 화면(결과 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙은 timer-core.js, 화면 동작은 timer.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·목표/블라인드 고르기·한 줄 방법·시작 버튼·사실 한 줄 + 맨 아래 mg-ad-start 1개.
 *   - 게임 화면에는 광고를 두지 않는다(아무 데나 눌러 멈추는 게임 — 실수로 누르기 쉬움).
 *   - 끝 화면 = 결과(가장 정확한 시도·등급·평균·시도 3개·서버 실제 백분위) → <div data-mg-end="timer">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(__dirname, '..', 'timer-core.js'));

const SITE_ID = 'timer';
const SITE_ROOT = 'https://timer.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// 시계 숫자 글꼴(숫자·기호만 쓰므로 언어와 무관)
const DIGITS_CSS = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap';
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
<meta name="theme-color" content="#0e1320">
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

// 시작 화면 티저 그림: 스톱워치 + 10.00 (SVG, 장식 — 숫자만) — tools/gen-og.js 도 같은 그림을 쓴다
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 220 236" aria-hidden="true" focusable="false">
<rect x="92" y="4" width="36" height="20" rx="6" fill="#ff5d6c"/>
<rect x="102" y="20" width="16" height="16" rx="3" fill="#c9d3ea"/>
<rect x="164" y="40" width="24" height="14" rx="5" fill="#c9d3ea" transform="rotate(40 176 47)"/>
<circle cx="110" cy="132" r="98" fill="#1b2335" stroke="#c9d3ea" stroke-width="10"/>
<circle cx="110" cy="132" r="80" fill="none" stroke="#2c3854" stroke-width="6" stroke-dasharray="3 9.57"/>
<path d="M110 52 A80 80 0 0 1 190 132" fill="none" stroke="#38f2a6" stroke-width="8" stroke-linecap="round"/>
<rect x="38" y="104" width="144" height="56" rx="14" fill="#0b0f1a" stroke="#38f2a6" stroke-width="3"/>
<text x="110" y="146" text-anchor="middle" font-family="'Share Tech Mono', ui-monospace, monospace" font-size="44" fill="#38f2a6">10.00</text>
<circle cx="110" cy="190" r="7" fill="#ff5d6c"/>
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
  const targets = C.TARGETS.map((n) => `        <label class="tm-seg-btn"><input type="radio" name="target" value="${n}"${n === C.DEFAULT_TARGET ? ' checked' : ''}><span>${esc(fill(S.targetValue, { n }))}</span></label>`).join('\n');
  const tries = Array.from({ length: C.ATTEMPTS }, (_, i) => `      <li class="tm-try" data-i="${i}"><span class="tm-try-n">${i + 1}</span><span class="tm-try-v">–</span></li>`).join('\n');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="tm-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="tm-shell">
  <!-- 시작 화면: 티징 + 목표·블라인드 고르기 + 한 줄 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="tm-screen tm-start">
    <p class="tm-badge">${esc(S.badge)}</p>
    <div class="tm-hero" aria-hidden="true">
      ${heroSvg('tm-hero-art')}
    </div>
    <h1 class="tm-h1"><span class="tm-kicker">${esc(S.h1Kicker)}</span><span class="tm-h1-main">${S.h1Html}</span></h1>
    <p class="tm-hook">${esc(S.hook)}</p>
    <div class="tm-opts">
      <p id="target-label" class="tm-opt-label">${esc(S.targetLabel)}</p>
      <div class="tm-seg" role="radiogroup" aria-labelledby="target-label">
${targets}
      </div>
      <label class="tm-switch"><input type="checkbox" id="blind-toggle"><span class="tm-switch-ui" aria-hidden="true"></span><span class="tm-switch-text"><b>${esc(S.blindLabel)}</b><small>${esc(S.blindDesc)}</small></span></label>
    </div>
    <p class="tm-how">${esc(S.how)}</p>
    <button id="start-btn" class="tm-btn tm-btn-primary" type="button">${esc(S.start)}</button>
    <p class="tm-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: 시도 3칸 + 시계 + STOP (광고 없음). 달리는 동안 화면 아무 데나 눌러도 멈춘다 -->
  <section id="screen-play" class="tm-screen tm-play" hidden>
    <div class="tm-play-top">
      <p class="tm-mode"><span id="play-target"></span><span id="play-blind" class="tm-chip" hidden>${esc(P.blindTag)}</span></p>
      <ol id="tries" class="tm-tries">
${tries}
      </ol>
    </div>
    <div id="play-area" class="tm-area">
      <p id="attempt-label" class="tm-attempt"></p>
      <div class="tm-clock-wrap">
        <p id="clock" class="tm-clock" role="timer" aria-label="${esc(P.clockAria)}">00:00.00</p>
      </div>
      <p id="verdict" class="tm-verdict" aria-live="polite"></p>
      <button id="main-btn" class="tm-btn tm-btn-go" type="button">${esc(P.go)}</button>
      <p id="play-hint" class="tm-hint" aria-live="polite"></p>
    </div>
    <button id="change-btn" class="tm-link" type="button">${esc(P.change)}</button>
    <div id="confetti" class="tm-confetti" aria-hidden="true"></div>
  </section>

  <!-- 끝 화면: 결과 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="tm-screen tm-end" hidden>
    <article class="tm-result" aria-labelledby="res-err">
      <p class="tm-eyebrow">${esc(R.over)}</p>
      <p id="res-mode" class="tm-res-mode"></p>
      <p id="res-perfect" class="tm-perfect" hidden></p>
      <p class="tm-res-label">${esc(R.bestLabel)}</p>
      <p class="tm-res-err"><span id="res-err" class="tm-err-big">0</span></p>
      <p id="res-time" class="tm-res-time"></p>
      <p class="tm-tier"><span class="tm-tier-label">${esc(R.tierLabel)}</span><span id="res-tier" class="tm-tier-name"></span></p>
      <p id="res-newbest" class="tm-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-pb" class="tm-pb"></p>
      <div class="tm-stats">
        <div class="tm-stat"><span class="tm-stat-k">${esc(R.avg)}</span><span id="res-avg" class="tm-stat-v">0</span></div>
      </div>
      <p class="tm-list-label">${esc(R.listLabel)}</p>
      <ol id="res-list" class="tm-res-list"></ol>
      <div id="res-rank" class="tm-rank" hidden>
        <p id="res-comparing" class="tm-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="tm-top"></p>
          <p id="res-beat" class="tm-beat"></p>
          <p id="res-others" class="tm-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['timer-core.js', 'timer.js'] })}
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
<body class="tm-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="tm-shell">
  <div class="tm-doc">
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
