#!/usr/bin/env node
/**
 * memory(카드 짝 맞추기) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 난이도 + 한 줄 방법) → 게임 화면(HUD + 카드 판) → 끝 화면(결과 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙은 memory-core.js, 화면 동작(카드·입력·시간)은 memory.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 카드 그림·h1(현지 검색어)·훅·난이도 고르기·시작 버튼·한 줄 방법·맨 아래 광고(mg-ad-start) 1개.
 *   - 게임 화면에는 광고를 두지 않는다(카드를 빨리 누르는 게임 — 실수로 누르기 쉬움). 광고는 시작 화면 맨 아래와 끝 화면(공통 컴포넌트).
 *   - 끝 화면 = 결과(난이도·시간·횟수·정확도·최고 기록·서버 실제 백분위) → <div data-mg-end="memory">. FAQ 는 끝 화면에만(MG_FAQ). 카드 배치는 시작할 때 JS 가 만든다.
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'memory';
const SITE_ROOT = 'https://memory.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const CORE = require(path.join(SITE_DIR, 'memory-core.js'));

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
<meta name="theme-color" content="#1d1238">
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

// 시작 화면 티저 그림: 엎어 둔 카드 다섯 장, 가운데 한 장만 호박 (장식 — 실제 판과 무관)
const HERO = `<div class="mm-hero" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => (i === 2
  ? '<i class="mm-hc mm-hc-up"><b>🎃</b></i>'
  : `<i class="mm-hc mm-hc-${i}"></i>`)).join('')}</div>`;

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
  // 브라우저(memory.js)에서 쓰는 문구
  const runtime = { start: { levels: S.levels }, play: P, result: R };
  const LV = CORE.LEVELS;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="mm-body">
${G.topBar(lang, rel)}

<main class="mm-shell">
  <!-- 시작 화면: 티징 + 난이도 + 한 줄 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="mm-screen mm-start">
    <p class="mm-badge">${esc(S.badge)}</p>
    ${HERO}
    <h1 class="mm-h1"><span class="mm-kicker">${esc(S.h1Kicker)}</span><span class="mm-h1-main">${S.h1Html}</span></h1>
    <p class="mm-hook">${esc(S.hook)}</p>
    <div id="levels" class="mm-levels" role="radiogroup" aria-label="${esc(S.levelLabel)}">
${CORE.LEVEL_ORDER.map((k) => `      <button type="button" class="mm-level" role="radio" aria-checked="${k === 'easy' ? 'true' : 'false'}" data-level="${k}"><span class="mm-level-name">${esc(S.levels[k])}</span><span class="mm-level-grid">${LV[k].cols} × ${LV[k].rows}</span></button>`).join('\n')}
    </div>
    <button id="start-btn" class="mm-btn mm-btn-primary" type="button">${esc(S.start)}</button>
    <p class="mm-how">${esc(S.how)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 카드 판 (광고 없음) -->
  <section id="screen-play" class="mm-screen mm-play" hidden>
    <div class="mm-hud">
      <div class="mm-hud-box mm-hud-time"><span class="mm-hud-label">${esc(P.time)}</span><span id="hud-time" class="mm-hud-val" aria-live="off">0.0</span></div>
      <div class="mm-hud-box mm-hud-moves"><span class="mm-hud-label">${esc(P.moves)}</span><span id="hud-moves" class="mm-hud-val" aria-live="off">0</span></div>
      <div class="mm-hud-box mm-hud-pairs"><span class="mm-hud-label">${esc(P.pairs)}</span><span id="hud-pairs" class="mm-hud-val" aria-live="polite">0/0</span></div>
    </div>
    <div class="mm-bar" aria-hidden="true"><i id="bar-fill" class="mm-bar-fill"></i></div>
    <div id="field" class="mm-field">
      <div id="board" class="mm-board" role="group" aria-label="${esc(P.boardAria)}"></div>
      <button id="pause-btn" class="mm-pause" type="button" hidden>${esc(P.paused)}</button>
    </div>
  </section>

  <!-- 끝 화면: 결과 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="mm-screen mm-end" hidden>
    <article class="mm-result" aria-labelledby="res-big">
      <p id="res-level" class="mm-eyebrow"></p>
      <p class="mm-head-line"><span class="mm-head-emoji" aria-hidden="true">🎃</span><span id="res-head" class="mm-head">${esc(R.done)}</span></p>
      <p class="mm-score-line"><span id="res-big" class="mm-score-big">0</span> <span class="mm-points">${esc(R.sec)}</span></p>
      <p id="res-newbest" class="mm-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="mm-best"></p>
      <dl class="mm-stats">
        <div class="mm-stat"><dt>${esc(R.movesLabel)}</dt><dd id="res-moves" class="mm-stat-num"></dd></div>
        <div class="mm-stat"><dt>${esc(R.accLabel)}</dt><dd id="res-acc" class="mm-stat-num"></dd></div>
      </dl>
      <div id="res-rank" class="mm-rank" hidden>
        <p id="res-comparing" class="mm-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="mm-top"></p>
          <p id="res-beat" class="mm-beat"></p>
          <p id="res-others" class="mm-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['memory-core.js', 'memory.js'] })}
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
<body class="mm-body">
${G.topBar(lang, rel)}
<main class="mm-shell">
  <div class="mm-doc">
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
