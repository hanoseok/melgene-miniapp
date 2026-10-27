#!/usr/bin/env node
/**
 * 마니또 뽑기(Secret Santa) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(#screen-setup): h1·훅 → 모임 이름 → 이름 3~30명 → 예산·교환일 → 제외 쌍 → 2명끼리 막기 → 뽑기 → 맨 아래 mg-ad-start
 *                                    확인 화면(#screen-play, 처음 hidden): 모임 띠 → 휴대폰 돌리기(이름 버튼) → 선물 상자(내 마니또) → 진행자 도구(개인 링크·전체 결과·다 확인·새로 뽑기)
 *                                    → (끝나면) 완료 카드 + 공통 끝 화면. 개인 링크(#d=)로 열면 그 사람의 선물 상자만.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 santa-core.js, 화면 동작은 santa.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 확인 화면에는 광고 자리를 두지 않는다(끝 화면 공통 컴포넌트만).
 *   - 확인 화면 마지막: 완료(#done) 안에 완료 카드 → <div data-mg-end="santa">.
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *   - 누가 누구를 뽑았는지(배정)는 HTML 에 절대 없다 — 브라우저에서 뽑고, 이름 목록·결과 목록은 빈 칸으로만 생성한다.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'santa-core.js'));

const SITE_ID = 'santa';
const SITE_ROOT = 'https://santa.example.com';
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
<meta name="theme-color" content="#7a1622">
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

// 선물 상자(SVG) — 상자·리본·뚜껑(.sn-lid, 열 때 들림)·나비 리본
const GIFT_SVG = `<svg class="sn-gift-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <rect x="34" y="92" width="132" height="92" rx="10" fill="#c8202f"/>
          <rect x="34" y="92" width="132" height="16" fill="#9e1622" opacity=".55"/>
          <rect x="90" y="92" width="20" height="92" fill="#f4c542"/>
          <g class="sn-lid">
            <rect x="24" y="66" width="152" height="32" rx="8" fill="#e0303f"/>
            <rect x="90" y="66" width="20" height="32" fill="#ffd866"/>
            <path d="M100 66 C78 34 50 40 56 58 C60 70 84 68 100 66 Z" fill="#f4c542"/>
            <path d="M100 66 C122 34 150 40 144 58 C140 70 116 68 100 66 Z" fill="#f4c542"/>
            <circle cx="100" cy="64" r="9" fill="#e0b02c"/>
          </g>
          <circle cx="56" cy="128" r="4" fill="#fff" opacity=".5"/><circle cx="142" cy="150" r="3" fill="#fff" opacity=".45"/><circle cx="66" cy="162" r="2.5" fill="#fff" opacity=".4"/>
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
  // 브라우저(santa.js)에서 쓰는 문구. 배정·이름은 여기 없다(브라우저에서 뽑는다).
  const runtime = { lang, ui: U, errors: T.errors, result: R };
  const opt = `<span class="sn-opt">${esc(U.optional)}</span>`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="sn-body">
${G.topBar(lang, rel)}

<main class="sn-shell">
  <!-- 시작 화면: h1·훅 → 모임 이름 → 이름 → 예산·교환일 → 제외 쌍 → 2명끼리 막기 → 뽑기 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="sn-screen sn-setup">
    <h1 class="sn-h1"><span class="sn-kicker">${esc(H.h1Kicker)}</span><span class="sn-h1-main">${H.h1Html}</span></h1>
    <p class="sn-hook">${esc(H.hook)}</p>

    <form id="sn-form" class="sn-card sn-form" novalidate autocomplete="off">
      <label class="sn-label" for="event">${esc(U.eventLabel)} ${opt}</label>
      <input id="event" class="sn-input" type="text" maxlength="${CORE.MAX_EVENT}" placeholder="${esc(U.eventPh)}" spellcheck="false">
      <label class="sn-label" for="names">${esc(U.namesLabel)}</label>
      <textarea id="names" class="sn-textarea" rows="6" maxlength="900" placeholder="${esc(U.namesPh)}" spellcheck="false"></textarea>
      <p class="sn-hint"><span>${esc(U.namesHint)}</span> <output id="names-count" class="sn-count"></output></p>
      <div class="sn-two">
        <div class="sn-field">
          <label class="sn-label" for="budget">${esc(U.budgetLabel)} ${opt}</label>
          <input id="budget" class="sn-input" type="text" maxlength="${CORE.MAX_BUDGET}" placeholder="${esc(U.budgetPh)}" spellcheck="false">
        </div>
        <div class="sn-field">
          <label class="sn-label" for="date">${esc(U.dateLabel)} ${opt}</label>
          <input id="date" class="sn-input" type="date">
        </div>
      </div>
      <div class="sn-excl" role="group" aria-labelledby="excl-label">
        <p class="sn-label" id="excl-label">${esc(U.exclLabel)} ${opt}</p>
        <p class="sn-hint">${esc(U.exclHint)}</p>
        <div class="sn-excl-row">
          <select id="excl-a" class="sn-select" aria-label="${esc(U.exclA)}"></select>
          <span class="sn-excl-x" aria-hidden="true">↔</span>
          <select id="excl-b" class="sn-select" aria-label="${esc(U.exclB)}"></select>
          <button type="button" id="excl-add" class="sn-mini sn-mini-strong">${esc(U.exclAdd)}</button>
        </div>
        <ul id="excl-list" class="sn-excl-list" aria-labelledby="excl-label"></ul>
      </div>
      <label class="sn-switch">
        <input type="checkbox" id="no-pairs" role="switch">
        <span class="sn-switch-ui" aria-hidden="true"></span>
        <span class="sn-switch-text"><span class="sn-switch-label">${esc(U.noPairsLabel)}</span><span class="sn-hint">${esc(U.noPairsHint)}</span></span>
      </label>
    </form>

    <p id="error" class="sn-error" role="alert" hidden></p>
    <button type="button" id="draw-btn" class="sn-btn sn-btn-primary">${esc(U.draw)}</button>
    <p class="sn-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 확인 화면: 모임 띠 → 휴대폰 돌리기(이름 버튼) → 선물 상자 → 진행자 도구 → (끝나면) 완료 카드 → 공통 끝 화면. 광고 자리 없음 -->
  <section id="screen-play" class="sn-screen sn-play" hidden>
    <div class="sn-event">
      <h2 class="sn-h2 sn-ev-title" id="ev-title"></h2>
      <p id="ev-meta" class="sn-ev-meta"></p>
    </div>

    <div id="pass" class="sn-pass">
      <p class="sn-pass-title">${esc(U.passTitle)}</p>
      <p class="sn-pass-hint">${esc(U.passHint)}</p>
      <p id="progress" class="sn-progress" aria-live="polite"></p>
      <div id="who-list" class="sn-who" role="list"></div>
    </div>

    <div id="secret" class="sn-card sn-secret" hidden>
      <p id="secret-for" class="sn-secret-for"></p>
      <button type="button" id="gift-btn" class="sn-gift" aria-label="${esc(U.openAria)}" aria-describedby="open-hint">
        ${GIFT_SVG}
      </button>
      <p id="open-hint" class="sn-open-hint">${esc(U.openHint)}</p>
      <div id="secret-body" class="sn-secret-body" hidden>
        <p class="sn-secret-kicker">${esc(U.yourTarget)}</p>
        <p id="secret-name" class="sn-secret-name"></p>
        <p id="secret-meta" class="sn-secret-meta"></p>
        <p id="secret-note" class="sn-secret-note">${esc(U.secretNote)}</p>
        <button type="button" id="hide-btn" class="sn-btn sn-btn-primary">${esc(U.hide)}</button>
      </div>
    </div>

    <div id="org" class="sn-card sn-org">
      <h3 class="sn-h3">${esc(U.orgTitle)}</h3>
      <div class="sn-org-btns">
        <button type="button" id="links-btn" class="sn-btn sn-btn-ghost">${esc(U.linksBtn)}</button>
        <button type="button" id="done-btn" class="sn-btn sn-btn-ghost">${esc(U.doneBtn)}</button>
        <button type="button" id="all-btn" class="sn-btn sn-btn-ghost">${esc(U.allBtn)}</button>
        <button type="button" id="redraw-btn" class="sn-btn sn-btn-ghost">${esc(U.redraw)}</button>
        <button type="button" id="edit-btn" class="sn-btn sn-btn-ghost">${esc(U.edit)}</button>
      </div>
      <div id="links" class="sn-links" hidden>
        <p class="sn-hint">${esc(U.linksHint)}</p>
        <ol id="links-list" class="sn-links-list"></ol>
      </div>
      <div id="all" class="sn-all" hidden>
        <h3 class="sn-h3">${esc(U.allTitle)}</h3>
        <ol id="all-list" class="sn-all-list"></ol>
        <button type="button" id="all-hide" class="sn-mini">${esc(U.allHide)}</button>
      </div>
    </div>

    <div id="ask" class="sn-ask" role="dialog" aria-modal="true" aria-labelledby="ask-text" hidden>
      <div class="sn-ask-box">
        <p id="ask-text" class="sn-ask-text"></p>
        <p id="ask-sub" class="sn-ask-sub"></p>
        <button type="button" id="ask-yes" class="sn-btn sn-btn-primary"></button>
        <button type="button" id="ask-no" class="sn-btn sn-btn-ghost"></button>
      </div>
    </div>
    <p id="live" class="visually-hidden" aria-live="assertive"></p>

    <div id="done" class="sn-done" hidden>
      <article class="sn-card sn-done-card" aria-labelledby="done-title">
        <p class="sn-done-kicker">${esc(R.kicker)}</p>
        <h2 class="sn-h2 sn-done-title" id="done-title"></h2>
        <p id="done-text" class="sn-done-text"></p>
        <p id="done-meta" class="sn-done-meta"></p>
      </article>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['santa-core.js', 'santa.js'] })}
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
<body class="sn-body">
${G.topBar(lang, rel)}
<main class="sn-shell">
  <div class="sn-doc">
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
  if (CORE.MAX_PEOPLE !== 30 || CORE.MIN_PEOPLE !== 3) throw new Error('santa-core 인원 한도가 바뀌었다 — 문구(3~30명)도 함께 고칠 것');
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
