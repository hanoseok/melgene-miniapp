#!/usr/bin/env node
/**
 * 토너먼트 대진표(Tournament Bracket Maker) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html — 시작 화면(#screen-setup): h1·훅 → (진행 중 대진표가 있으면) 이어 하기 → 제목 → 항목 2~64개 → 시드(무작위/입력 순)
 *                                  → 방식(한 판씩 고르기/대진표만) → 만들기 → 공정성 한 줄 → 맨 아래 mg-ad-start
 *                                  대진 화면(#screen-play, 처음 hidden): 제목 띠 → 맞대결 카드(#duel) → 대진표(#board) → 도구(되돌리기·PNG·글 복사·링크·새 대진표)
 *                                  → 우승(#done: 우승 카드 + 요약 → <div data-mg-end="bracket">)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어)
 * 문구는 tools/i18n/<lang>.js, 로직은 bracket-core.js, 화면 동작은 bracket.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 대진 화면에는 광고 자리를 두지 않는다(끝 화면 공통 컴포넌트만).
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *   - 사용자 항목은 HTML 에 없다(브라우저에서 textContent 로만 그린다). 예시 이름은 placeholder 에만.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bracket-core.js'));

const SITE_ID = 'bracket';
const SITE_ROOT = 'https://bracket.example.com';
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
<meta name="theme-color" content="#14213d">
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

const TROPHY_SVG = `<svg class="bk-trophy" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <path d="M30 18h40v20c0 13-9 22-20 22s-20-9-20-22z" fill="#fcbf49"/>
          <path d="M30 25H17c0 12 6 19 15 20M70 25h13c0 12-6 19-15 20" fill="none" stroke="#fcbf49" stroke-width="6" stroke-linecap="round"/>
          <rect x="45" y="58" width="10" height="14" fill="#f7a823"/>
          <rect x="31" y="72" width="38" height="11" rx="3" fill="#fcbf49"/>
          <path d="M40 26l3 6 6 1-5 4 1 6-5-3-5 3 1-6-5-4 6-1z" fill="#fff6d8" opacity=".85"/>
        </svg>`;

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = { lang, ui: U, errors: T.errors, result: R };
  const opt = `<span class="bk-opt">${esc(U.optional)}</span>`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="bk-body">
${G.topBar(lang, rel)}

<main class="bk-shell">
  <!-- 시작 화면: h1·훅 → 이어 하기(있을 때) → 제목 → 항목 → 시드 → 방식 → 만들기 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="bk-screen bk-setup">
    <h1 class="bk-h1"><span class="bk-kicker">${esc(H.h1Kicker)}</span><span class="bk-h1-main">${H.h1Html}</span></h1>
    <p class="bk-hook">${esc(H.hook)}</p>

    <div id="resume" class="bk-resume" hidden>
      <p id="resume-text" class="bk-resume-text"></p>
      <button type="button" id="resume-btn" class="bk-mini bk-mini-strong">${esc(U.resumeBtn)}</button>
    </div>

    <form id="bk-form" class="bk-card bk-form" novalidate autocomplete="off">
      <label class="bk-label" for="title">${esc(U.titleLabel)} ${opt}</label>
      <input id="title" class="bk-input" type="text" maxlength="${CORE.MAX_TITLE}" placeholder="${esc(U.titlePh)}" spellcheck="false">
      <label class="bk-label" for="items">${esc(U.itemsLabel)}</label>
      <textarea id="items" class="bk-textarea" rows="8" maxlength="4000" placeholder="${esc(U.itemsPh)}" spellcheck="false"></textarea>
      <p class="bk-hint"><span>${esc(U.itemsHint)}</span> <output id="items-count" class="bk-count"></output></p>
      <p id="items-dupes" class="bk-hint bk-dupes" hidden></p>
      <fieldset class="bk-choice">
        <legend class="bk-label">${esc(U.seedLabel)}</legend>
        <label class="bk-radio"><input type="radio" name="seed" id="seed-r" value="r" checked><span>${esc(U.seedRandom)}</span></label>
        <label class="bk-radio"><input type="radio" name="seed" id="seed-o" value="o"><span>${esc(U.seedOrder)}</span></label>
      </fieldset>
      <fieldset class="bk-choice">
        <legend class="bk-label">${esc(U.modeLabel)}</legend>
        <label class="bk-radio bk-radio-tall"><input type="radio" name="mode" id="mode-p" value="p" checked><span><b>${esc(U.modePick)}</b><small>${esc(U.modePickHint)}</small></span></label>
        <label class="bk-radio bk-radio-tall"><input type="radio" name="mode" id="mode-d" value="d"><span><b>${esc(U.modeDraw)}</b><small>${esc(U.modeDrawHint)}</small></span></label>
      </fieldset>
    </form>

    <p id="error" class="bk-error" role="alert" hidden></p>
    <button type="button" id="create-btn" class="bk-btn bk-btn-primary">${esc(U.create)}</button>
    <p class="bk-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 대진 화면: 제목 → 맞대결 → 대진표 → 도구 → 우승(+ 공통 끝 화면). 광고 자리 없음 -->
  <section id="screen-play" class="bk-screen bk-play" hidden>
    <div class="bk-event">
      <h2 class="bk-h2 bk-ev-title" id="ev-title"></h2>
      <p id="ev-meta" class="bk-ev-meta"></p>
    </div>

    <div id="duel" class="bk-duel" hidden>
      <p id="duel-round" class="bk-duel-round"></p>
      <p id="duel-progress" class="bk-duel-progress" aria-live="polite"></p>
      <div class="bk-duel-cards">
        <button type="button" id="side-a" class="bk-side bk-side-a"><span class="bk-side-name" id="side-a-name"></span></button>
        <span class="bk-vs" aria-hidden="true">${esc(U.vs)}</span>
        <button type="button" id="side-b" class="bk-side bk-side-b"><span class="bk-side-name" id="side-b-name"></span></button>
      </div>
      <p class="bk-duel-hint">${esc(U.tapWinner)}</p>
    </div>

    <div id="board-wrap" class="bk-card bk-board-wrap">
      <h3 class="bk-h3">${esc(U.bracketTitle)}</h3>
      <p id="board-hint" class="bk-hint">${esc(U.drawHint)}</p>
      <div id="board" class="bk-board"></div>
    </div>

    <div id="tools" class="bk-tools">
      <button type="button" id="undo-btn" class="bk-btn bk-btn-ghost">${esc(U.undo)}</button>
      <button type="button" id="png-btn" class="bk-btn bk-btn-ghost">${esc(U.png)}</button>
      <button type="button" id="text-btn" class="bk-btn bk-btn-ghost">${esc(U.copyText)}</button>
      <button type="button" id="link-btn" class="bk-btn bk-btn-ghost">${esc(U.shareLink)}</button>
      <button type="button" id="new-btn" class="bk-btn bk-btn-ghost">${esc(U.newBracket)}</button>
    </div>
    <p id="live" class="visually-hidden" aria-live="assertive"></p>

    <div id="done" class="bk-done" hidden>
      <article class="bk-card bk-done-card" aria-labelledby="champ-name">
        ${TROPHY_SVG}
        <p class="bk-done-kicker">${esc(R.kicker)}</p>
        <h2 class="bk-h2 bk-champ" id="champ-name"></h2>
        <p id="champ-summary" class="bk-done-meta"></p>
      </article>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bracket-core.js', 'bracket.js'] })}
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
<body class="bk-body">
${G.topBar(lang, rel)}
<main class="bk-shell">
  <div class="bk-doc">
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
  if (CORE.MAX_ITEMS !== 64 || CORE.MIN_ITEMS !== 2) throw new Error('bracket-core 항목 한도가 바뀌었다 — 문구(2~64개)도 함께 고칠 것');
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
