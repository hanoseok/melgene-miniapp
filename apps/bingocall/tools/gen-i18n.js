#!/usr/bin/env node
/**
 * 빙고 번호 추첨기(Bingo Caller) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(#screen-setup): h1·훅 → 방식(75볼·90볼·직접 범위) → 범위 입력 → 시작 → 맨 아래 mg-ad-start
 *                                    진행 화면(#screen-play, 처음 hidden): 방식·개수·전체 화면·끝내기 → 큰 공 → 지난 5개 → 뽑기 →
 *                                      되돌리기·자동 뽑기(3/5/8초)·읽어 주기·소리 → 전체 판 → 새 게임. 광고 자리 없음(TV·프로젝터 화면).
 *                                    끝 화면(#screen-end, 처음 hidden): 요약 숫자(뽑은 번호 수·걸린 시간) → 공통 끝 화면(data-mg-end)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 bingocall-core.js, 화면 동작은 bingocall.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 진행·끝 화면에는 광고 자리를 두지 않는다(끝 화면은 공통 컴포넌트가 광고 포함).
 *   - 끝 화면은 숫자 요약만. FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bingocall-core.js'));

const SITE_ID = 'bingocall';
const SITE_ROOT = 'https://bingocall.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUMS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=swap'; // 공·판 숫자(모든 언어 같은 숫자 글꼴)
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
const MODE_ICON = { 75: 'B·I·N·G·O', 90: '1–90', custom: '1–30' };

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
  if (!/Baloo\+2/.test(F.css)) links.push(`<link rel="stylesheet" href="${NUMS}">`);
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
<meta name="theme-color" content="#0f2236">
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

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const E = T.end;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const D = CORE.DEFAULT_CUSTOM;
  // 브라우저(bingocall.js)에서 쓰는 문구
  const runtime = { lang, ui: U, errors: T.errors, end: E };
  const modeBtn = (k, i) => `<button type="button" class="bc-mode" id="mode-${k}" role="radio" aria-checked="${i === 0}" data-mode="${k}"><span class="bc-mode-icon" aria-hidden="true">${MODE_ICON[k]}</span><span class="bc-mode-name">${esc(U.modes[k].name)}</span><span class="bc-mode-desc">${esc(U.modes[k].desc)}</span></button>`;
  const secBtn = (s, i) => `<button type="button" class="bc-seg-btn" role="radio" aria-checked="${s === 5}" data-sec="${s}">${esc(G.fmt(U.sec, { s }))}</button>`;
  const stat = (id, label, cls, extra) => `<div class="bc-stat${cls ? ' ' + cls : ''}"><dt>${esc(label)}</dt><dd id="${id}">0</dd>${extra || ''}</div>`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="bc-body">
${G.topBar(lang, rel)}

<main class="bc-shell">
  <!-- 시작 화면: h1·훅 → 방식 → 범위 → 시작 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="bc-screen bc-setup">
    <h1 class="bc-h1"><span class="bc-kicker">${esc(H.h1Kicker)}</span><span class="bc-h1-main">${H.h1Html}</span></h1>
    <p class="bc-hook">${esc(H.hook)}</p>

    <form id="bc-form" class="bc-card bc-form" novalidate autocomplete="off">
      <p class="bc-label" id="mode-label">${esc(U.modeLabel)}</p>
      <div class="bc-modes" role="radiogroup" aria-labelledby="mode-label">
        ${CORE.MODES.map(modeBtn).join('\n        ')}
      </div>
      <div id="custom-box" class="bc-custom" hidden>
        <div class="bc-range">
          <label class="bc-field" for="from"><span class="bc-label bc-label-sm">${esc(U.fromLabel)}</span>
            <input id="from" class="bc-input" type="number" inputmode="numeric" step="1" min="${CORE.CUSTOM_LO}" max="${CORE.CUSTOM_HI}" value="${D.a}" enterkeyhint="go"></label>
          <span class="bc-range-arrow" aria-hidden="true">→</span>
          <label class="bc-field" for="to"><span class="bc-label bc-label-sm">${esc(U.toLabel)}</span>
            <input id="to" class="bc-input" type="number" inputmode="numeric" step="1" min="${CORE.CUSTOM_LO}" max="${CORE.CUSTOM_HI}" value="${D.b}" enterkeyhint="go"></label>
        </div>
        <p class="bc-hint" id="custom-hint">${esc(G.fmt(U.customHint, { min: CORE.CUSTOM_MIN_SIZE, max: CORE.CUSTOM_MAX_SIZE }))}</p>
      </div>
    </form>

    <p id="error" class="bc-error" role="alert" hidden></p>
    <button type="button" id="start-btn" class="bc-btn bc-btn-primary">${esc(U.start)}</button>
    <p class="bc-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 진행 화면(TV·프로젝터에 띄우는 화면): 광고 자리 없음 -->
  <section id="screen-play" class="bc-screen bc-play" hidden>
    <div class="bc-bar">
      <span id="mode-chip" class="bc-chip"></span>
      <p id="count" class="bc-count"></p>
      <button type="button" id="fs-btn" class="bc-mini bc-mini-ghost bc-fs" aria-pressed="false" aria-label="${esc(U.fullscreen)}" title="${esc(U.fullscreen)}" hidden><span aria-hidden="true">⛶</span></button>
      <button type="button" id="finish-btn" class="bc-mini">${esc(U.finish)}</button>
    </div>

    <div class="bc-stage">
      <div id="ball" class="bc-ball is-empty" aria-hidden="true">
        <span class="bc-ball-face"><span id="ball-letter" class="bc-ball-letter"></span><span id="ball-num" class="bc-ball-num">?</span></span>
      </div>
      <p id="ready" class="bc-ready">${esc(U.ready)}</p>
    </div>

    <div class="bc-prev">
      <p class="bc-prev-label" id="prev-label">${esc(U.prevLabel)}</p>
      <ol id="prev" class="bc-prev-list" aria-labelledby="prev-label"></ol>
    </div>

    <button type="button" id="draw-btn" class="bc-btn bc-btn-primary bc-draw">${esc(U.draw)}</button>
    <div id="auto-bar" class="bc-auto-bar" hidden><span id="auto-fill" class="bc-auto-fill"></span></div>

    <div class="bc-controls">
      <button type="button" id="undo-btn" class="bc-btn bc-btn-ghost" disabled>${esc(U.undo)}</button>
      <label class="bc-switch"><input type="checkbox" id="auto" role="switch"><span class="bc-switch-ui" aria-hidden="true"></span><span>${esc(U.auto)}</span></label>
    </div>
    <div class="bc-interval">
      <p class="bc-small" id="interval-label">${esc(U.intervalLabel)}</p>
      <div id="interval" class="bc-seg" role="radiogroup" aria-labelledby="interval-label">
        ${CORE.INTERVALS.map(secBtn).join('\n        ')}
      </div>
    </div>
    <div class="bc-toggles">
      <label class="bc-switch" id="voice-wrap" hidden><input type="checkbox" id="voice" role="switch"><span class="bc-switch-ui" aria-hidden="true"></span><span>${esc(U.voice)}</span></label>
      <label class="bc-switch"><input type="checkbox" id="sound" role="switch"><span class="bc-switch-ui" aria-hidden="true"></span><span>${esc(U.sound)}</span></label>
    </div>

    <h2 class="bc-h2 bc-board-title" id="board-title">${esc(U.boardTitle)}</h2>
    <div id="board" class="bc-board" role="group" aria-labelledby="board-title"></div>

    <button type="button" id="new-btn" class="bc-btn bc-btn-ghost bc-new">${esc(U.newGame)}</button>
    <p id="live" class="visually-hidden" aria-live="polite"></p>
  </section>

  <!-- 끝 화면: 요약 숫자만 → 공통 끝 화면 -->
  <section id="screen-end" class="bc-screen bc-end" hidden>
    <article class="bc-card bc-sum" aria-labelledby="end-title">
      <p class="bc-sum-kicker">${esc(E.kicker)}</p>
      <h2 class="bc-h2" id="end-title">${esc(E.title)}</h2>
      <dl class="bc-stats">
        ${stat('stat-drawn', E.drawn, 'bc-stat-big', '<p id="stat-of" class="bc-stat-of"></p>')}
        ${stat('stat-time', E.time, '')}
      </dl>
      <p id="end-none" class="bc-sum-sub" hidden>${esc(E.none)}</p>
      <button type="button" id="edit-btn" class="bc-btn bc-btn-ghost">${esc(E.edit)}</button>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bingocall-core.js', 'bingocall.js'] })}
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
<body class="bc-body">
${G.topBar(lang, rel)}
<main class="bc-shell">
  <div class="bc-doc">
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
  if (CORE.CUSTOM_MIN_SIZE !== 5 || CORE.CUSTOM_MAX_SIZE !== 150) throw new Error('bingocall-core 범위 한도가 바뀌었다 — 문구도 함께 고칠 것');
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
