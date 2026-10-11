#!/usr/bin/env node
/**
 * 스도쿠 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징 + 아주 짧은 방법 + 난이도 + 이어 하기/오늘의 퍼즐) → 게임 화면(HUD + 판 + 도구 + 숫자 패드) → 끝 화면(결과 카드 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 규칙·생성기는 sudoku-core.js, 화면 동작은 sudoku.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·티저 그림·h1(현지 검색어)·훅·짧은 방법 3칸·난이도 4개·이어 하기·새 퍼즐·오늘의 퍼즐·사실 한 줄·맨 아래 광고(mg-ad-start) 1개.
 *   - 게임 화면에는 광고를 두지 않는다(칸·숫자를 계속 누르는 게임). 광고는 시작 화면 맨 아래와 끝 화면(공통 컴포넌트).
 *   - 끝 화면 = 결과(난이도·시간·실수·힌트·최고 기록·서버 실제 백분위) → <div data-mg-end="sudoku">. FAQ 는 끝 화면에만(MG_FAQ). 퍼즐·정답은 HTML 어디에도 없다(시작할 때 브라우저에서 만든다).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(game).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'sudoku';
const SITE_ROOT = 'https://sudoku.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const C = require(path.join(SITE_DIR, 'sudoku-core.js'));

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
<meta name="theme-color" content="#f7f1e3">
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

// 시작 화면 티저 그림: 3×3 상자 하나 — 숫자 몇 개 + 메모 칸 하나 + 깜빡이는 커서 (장식, 실제 퍼즐과 무관)
const HERO_MAP = ['5', '', '8', '', '3', 'n', '1', '', '7'];
const HERO = `<div class="sd-hero" aria-hidden="true">${HERO_MAP.map((ch, i) => {
  if (ch === 'n') return '<i class="sd-hc sd-hc-n"><b>2</b><b>4</b><b>9</b></i>';
  if (!ch) return `<i class="sd-hc${i === 3 ? ' sd-hc-sel' : ''}"></i>`;
  return `<i class="sd-hc${i % 2 ? ' sd-hc-u' : ''}">${ch}</i>`;
}).join('')}</div>`;

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
  // 브라우저(sudoku.js)에서 쓰는 문구
  const runtime = { start: { diffs: S.diffs, resumeInfo: S.resumeInfo }, play: P, result: R };
  const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
  <!-- 시작 화면: 티징 + 아주 짧은 방법 + 난이도 + 맨 아래 광고 1개 — FAQ·SEO 글 없음 -->
  <section id="screen-start" class="sd-screen sd-start">
    <p class="sd-badge">${esc(S.badge)}</p>
    ${HERO}
    <h1 class="sd-h1"><span class="sd-kicker">${esc(S.h1Kicker)}</span><span class="sd-h1-main">${S.h1Html}</span></h1>
    <p class="sd-hook">${esc(S.hook)}</p>
    <ul class="sd-how">
      <li><span class="sd-how-ico" aria-hidden="true">👆</span><span class="sd-how-txt">${esc(S.how.pick)}</span></li>
      <li><span class="sd-how-ico" aria-hidden="true">🔢</span><span class="sd-how-txt">${esc(S.how.pad)}</span></li>
      <li><span class="sd-how-ico" aria-hidden="true">✏️</span><span class="sd-how-txt">${esc(S.how.notes)}</span></li>
    </ul>
    <div id="diffs" class="sd-diffs" role="radiogroup" aria-label="${esc(S.diffLabel)}">
${C.DIFF_ORDER.map((k, n) => `      <button type="button" class="sd-diff" role="radio" aria-checked="${k === 'easy' ? 'true' : 'false'}" tabindex="${k === 'easy' ? 0 : -1}" data-diff="${k}"><span class="sd-diff-dots" aria-hidden="true">${'●'.repeat(n + 1)}${'○'.repeat(3 - n)}</span><span class="sd-diff-name">${esc(S.diffs[k])}</span></button>`).join('\n')}
    </div>
    <button id="resume-btn" class="sd-btn sd-btn-resume" type="button" hidden><span class="sd-btn-main">${esc(S.resume)}</span><span id="resume-info" class="sd-btn-sub"></span></button>
    <button id="start-btn" class="sd-btn sd-btn-primary" type="button">${esc(S.start)}</button>
    <button id="daily-btn" class="sd-btn sd-btn-ghost" type="button"><span aria-hidden="true">📅</span> ${esc(S.daily)}</button>
    <p class="sd-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: HUD + 판 + 도구 + 숫자 패드 (광고 없음) -->
  <section id="screen-play" class="sd-screen sd-play" hidden>
    <div class="sd-hud">
      <div class="sd-hud-box"><span class="sd-hud-label">${esc(P.level)}</span><span id="hud-level" class="sd-hud-val sd-hud-level"></span></div>
      <div class="sd-hud-box"><span class="sd-hud-label">${esc(P.mistakes)}</span><span id="hud-mistakes" class="sd-hud-val" aria-live="off">0</span></div>
      <div class="sd-hud-box"><span class="sd-hud-label">${esc(P.time)}</span><span id="hud-time" class="sd-hud-val" aria-live="off">0:00</span></div>
    </div>
    <div id="field" class="sd-field">
      <div id="board" class="sd-board" role="group" aria-label="${esc(P.boardAria)}"></div>
      <button id="pause-btn" class="sd-pause" type="button" hidden>${esc(P.paused)}</button>
    </div>
    <div class="sd-tools">
      <button id="undo-btn" class="sd-tool" type="button"><span class="sd-tool-ico" aria-hidden="true">↶</span><span class="sd-tool-txt">${esc(P.undo)}</span></button>
      <button id="erase-btn" class="sd-tool" type="button"><span class="sd-tool-ico" aria-hidden="true">⌫</span><span class="sd-tool-txt">${esc(P.erase)}</span></button>
      <button id="notes-btn" class="sd-tool" type="button" aria-pressed="false"><span class="sd-tool-ico" aria-hidden="true">✎</span><span class="sd-tool-txt">${esc(P.notes)}</span></button>
      <button id="hint-btn" class="sd-tool" type="button"><span class="sd-tool-ico" aria-hidden="true">✦</span><span class="sd-tool-txt">${esc(P.hint)}</span><span id="hint-left" class="sd-tool-badge">3</span></button>
      <button id="check-btn" class="sd-tool" type="button" aria-pressed="false"><span class="sd-tool-ico" aria-hidden="true">✓</span><span class="sd-tool-txt">${esc(P.check)}</span></button>
    </div>
    <div id="pad" class="sd-pad" role="group" aria-label="${esc(P.padAria)}">
${DIGITS.map((d) => `      <button type="button" class="sd-key" data-n="${d}"><span class="sd-key-n">${d}</span><span class="sd-key-left">9</span></button>`).join('\n')}
    </div>
  </section>

  <!-- 끝 화면: 결과 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="sd-screen sd-end" hidden>
    <article class="sd-result" aria-labelledby="res-big">
      <p id="res-reason" class="sd-eyebrow"></p>
      <p class="sd-tier-line"><span class="sd-tier-emoji" aria-hidden="true">🏆</span><span class="sd-tier">${esc(R.solved)}</span></p>
      <p class="sd-score-line"><span id="res-big" class="sd-score-big">0:00</span></p>
      <p id="res-newbest" class="sd-newbest" hidden>${esc(R.newBest)}</p>
      <p id="res-best" class="sd-best"></p>
      <dl class="sd-stats">
        <div class="sd-stat"><dt>${esc(R.mistakesLabel)}</dt><dd id="res-mistakes" class="sd-stat-num"></dd></div>
        <div class="sd-stat"><dt>${esc(R.hintsLabel)}</dt><dd id="res-hints" class="sd-stat-num"></dd></div>
      </dl>
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

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['sudoku-core.js', 'sudoku.js'] })}
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

main();
