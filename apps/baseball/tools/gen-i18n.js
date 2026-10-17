#!/usr/bin/env node
/**
 * baseball(숫자 야구 · Bulls and Cows) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 자릿수 + 타이머 선택) → 게임 화면(HUD + 입력칸 + 숫자 패드 + 추리 기록) → 끝 화면(결과 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙은 baseball-core.js, 화면 동작(입력·기록·시계)은 baseball.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·자릿수 고르기·타이머 선택·시작 버튼·한 줄 방법·맨 아래 광고(mg-ad-start) 1개.
 *   - 게임 화면에는 광고를 두지 않는다(숫자 패드를 빠르게 누르는 화면). 광고는 시작 화면 맨 아래와 끝 화면(공통 컴포넌트).
 *   - 끝 화면 = 결과(시도 횟수·정답·최고 기록·서버 실제 백분위) → <div data-mg-end="baseball">. FAQ 는 끝 화면에만(MG_FAQ). 비밀 숫자는 시작할 때 JS 가 만든다(HTML 에 없음).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'baseball';
const SITE_ROOT = 'https://baseball.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const CORE = require(path.join(SITE_DIR, 'baseball-core.js'));

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
<meta name="theme-color" content="#0f2a1d">
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

// 시작 화면 티저 그림: 물음표 칸 세 개, 가운데는 공 (장식 — 실제 정답과 무관)
const HERO = `<div class="bb-hero" aria-hidden="true"><i class="bb-ht">?</i><i class="bb-ht bb-ht-ball"><b>⚾</b></i><i class="bb-ht">?</i></div>`;

const PAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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
  // 브라우저(baseball.js)에서 쓰는 문구
  const runtime = { start: { levels: S.levels }, play: P, result: R };
  const LV = CORE.LEVELS;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'game', image: ogImage(lang) }),
  })}
<body class="bb-body">
${G.topBar(lang, rel)}

<main class="bb-shell">
  <!-- 시작 화면: 티징 + 자릿수 + 타이머 선택 + 한 줄 방법 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="bb-screen bb-start">
    <p class="bb-badge">${esc(S.badge)}</p>
    ${HERO}
    <h1 class="bb-h1"><span class="bb-kicker">${esc(S.h1Kicker)}</span><span class="bb-h1-main">${S.h1Html}</span></h1>
    <p class="bb-hook">${esc(S.hook)}</p>
    <div id="levels" class="bb-levels" role="radiogroup" aria-label="${esc(S.levelLabel)}">
${CORE.LEVEL_ORDER.map((k) => `      <button type="button" class="bb-level" role="radio" aria-checked="${k === 'd3' ? 'true' : 'false'}" data-level="${k}"><span class="bb-level-name">${esc(S.levels[k])}</span><span class="bb-level-sub">${esc(S.levelSub[k])}</span></button>`).join('\n')}
    </div>
    <label class="bb-timer-opt"><input id="timer-opt" type="checkbox"><span>${esc(S.timer)}</span></label>
    <button id="start-btn" class="bb-btn bb-btn-primary" type="button">${esc(S.start)}</button>
    <p class="bb-how">${esc(S.how)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 입력칸 + 숫자 패드 + 추리 기록 (광고 없음) -->
  <section id="screen-play" class="bb-screen bb-play" hidden>
    <div class="bb-hud">
      <div class="bb-hud-box"><span class="bb-hud-label">${esc(P.tries)}</span><span id="hud-tries" class="bb-hud-val" aria-live="off">0</span></div>
      <div id="hud-time-box" class="bb-hud-box bb-hud-time" hidden><span class="bb-hud-label">${esc(P.time)}</span><span id="hud-time" class="bb-hud-val" aria-live="off">0.0</span></div>
    </div>
    <div id="slots" class="bb-slots" role="group" aria-label="${esc(P.enter)}"></div>
    <p id="msg" class="bb-msg" role="status" aria-live="polite"></p>
    <div id="pad" class="bb-pad">
${PAD.map((d) => `      <button type="button" class="bb-key" data-d="${d}">${d}</button>`).join('\n')}
      <button id="del-btn" type="button" class="bb-key bb-key-del" aria-label="${esc(P.del)}">⌫<span class="bb-key-text">${esc(P.del)}</span></button>
      <button id="enter-btn" type="button" class="bb-key bb-key-enter">${esc(P.enter)}</button>
    </div>
    <p class="bb-legend">${esc(P.legend)}</p>
    <div class="bb-history">
      <h2 class="bb-h2">${esc(P.historyTitle)}</h2>
      <p id="history-empty" class="bb-empty">${esc(P.historyEmpty)}</p>
      <ol id="history" class="bb-list" reversed></ol>
    </div>
    <button id="giveup-btn" class="bb-giveup" type="button">${esc(P.giveUp)}</button>
  </section>

  <!-- 끝 화면: 결과 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="bb-screen bb-end" hidden>
    <article class="bb-result" aria-labelledby="res-head">
      <p id="res-level" class="bb-eyebrow"></p>
      <p class="bb-head-line"><span class="bb-head-emoji" aria-hidden="true">⚾</span><span id="res-head" class="bb-head">${esc(R.done)}</span></p>
      <p id="res-secret-label" class="bb-cap">${esc(R.secretLabel)}</p>
      <div id="res-secret" class="bb-secret" aria-live="off"></div>
      <p class="bb-cap">${esc(R.triesCaption)}</p>
      <p class="bb-score-line"><span id="res-big" class="bb-score-big">0</span></p>
      <p id="res-newbest" class="bb-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="bb-best"></p>
      <dl class="bb-stats">
        <div id="res-time-box" class="bb-stat" hidden><dt>${esc(R.timeLabel)}</dt><dd id="res-time" class="bb-stat-num"></dd></div>
      </dl>
      <div id="res-rank" class="bb-rank" hidden>
        <p id="res-comparing" class="bb-comparing">${esc(R.comparing)}</p>
        <div id="res-rank-body" hidden>
          <p id="res-top" class="bb-top"></p>
          <p id="res-beat" class="bb-beat"></p>
          <p id="res-others" class="bb-others"></p>
        </div>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['baseball-core.js', 'baseball.js'] })}
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
<body class="bb-body">
${G.topBar(lang, rel)}
<main class="bb-shell">
  <div class="bb-doc">
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
