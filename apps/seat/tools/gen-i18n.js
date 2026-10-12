#!/usr/bin/env node
/**
 * 자리 바꾸기(랜덤 자리 배치) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 이름 → 교실 줄·칸·자리 지도 → 규칙(접힘) → 섞기) → 섞은 뒤 자리표 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 섞기는 seat-core.js, 화면 동작은 seat.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱(randnum·roulette 처럼) — 첫 화면(입력·섞기 버튼) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 섞은 뒤 나타나는 결과(#result) 안에 자리표 카드 → <div data-mg-end="seat">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'seat-core.js'));

const SITE_ID = 'seat';
const SITE_ROOT = 'https://seat.example.com';
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
<meta name="theme-color" content="#24493a">
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

function stepper(id, label, value, min, max, U) {
  return `<div class="st-side">
          <span class="st-label" id="${id}-label">${esc(label)}</span>
          <div class="st-stepper" role="group" aria-labelledby="${id}-label">
            <button type="button" class="st-step" id="${id}-dec" aria-label="${esc(U.dec)}">−</button>
            <output class="st-step-num" id="${id}" aria-live="polite" data-min="${min}" data-max="${max}">${value}</output>
            <button type="button" class="st-step" id="${id}-inc" aria-label="${esc(U.inc)}">+</button>
          </div>
        </div>`;
}

// ---------------------------------------------------------------
// 한 화면 도구 (index.html)
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
  const D = CORE.DEFAULTS;
  // 브라우저(seat.js)에서 쓰는 문구
  const runtime = { lang, ui: U, errors: T.errors, result: R, sample: T.sample };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="st-body">
${G.topBar(lang, rel)}

<main class="st-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 이름 → 교실 → 규칙(접힘) → 섞기 → (섞은 뒤) 자리표 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-seat" class="st-screen">
    <h1 class="st-h1"><span class="st-kicker">${esc(H.h1Kicker)}</span><span class="st-h1-main">${H.h1Html}</span></h1>
    <p class="st-hook">${esc(H.hook)}</p>

    <form id="st-form" class="st-form" novalidate autocomplete="off">
      <div class="st-card st-names">
        <div class="st-row-head">
          <label class="st-label" for="names">${esc(U.namesLabel)}</label>
          <span class="st-head-btns">
            <button type="button" id="sample-btn" class="st-mini">${esc(U.sample)}</button>
            <button type="button" id="clear-btn" class="st-mini">${esc(U.clear)}</button>
          </span>
        </div>
        <textarea id="names" class="st-textarea" rows="6" spellcheck="false" placeholder="${esc(U.namesPh)}" aria-describedby="names-hint"></textarea>
        <p class="st-hint" id="names-hint">${esc(U.namesHint)}</p>
        <p class="st-counts"><span id="names-count" class="st-count-pill"></span><span id="seats-count" class="st-count-pill"></span></p>
        <p id="names-warn" class="st-warn" hidden></p>
      </div>

      <div class="st-card st-layout">
        <p class="st-label st-card-title">${esc(U.layoutLabel)}</p>
        <div class="st-sides">
        ${stepper('rows', U.rowsLabel, D.rows, CORE.MIN_SIDE, CORE.MAX_ROWS, U)}
        ${stepper('cols', U.colsLabel, D.cols, CORE.MIN_SIDE, CORE.MAX_COLS, U)}
        </div>
        <p class="st-label" id="tap-label">${esc(U.tapLabel)}</p>
        <div class="st-seg" role="radiogroup" aria-labelledby="tap-label">
          <button type="button" class="st-seg-btn" id="mode-block" role="radio" aria-checked="true">${esc(U.modeBlock)}</button>
          <button type="button" class="st-seg-btn" id="mode-pin" role="radio" aria-checked="false">${esc(U.modePin)}</button>
        </div>
        <label class="st-pin-pick" id="pin-pick" for="pin-name" hidden><span class="st-label">${esc(U.pinPick)}</span>
          <select id="pin-name" class="st-select"><option value="">${esc(U.pickName)}</option></select></label>
        <div class="st-map-wrap">
          <div class="st-desk st-desk-map" aria-hidden="true">${esc(U.desk)}</div>
          <div id="map" class="st-map" role="group" aria-label="${esc(U.layoutLabel)}"></div>
        </div>
        <p class="st-hint">${esc(U.mapHint)}</p>
      </div>

      <button type="button" id="more-btn" class="st-more-btn" aria-expanded="false" aria-controls="more">${esc(U.more)}</button>
      <div id="more" class="st-card st-more" hidden>
        <div class="st-rule">
          <p class="st-label">${esc(U.apartLabel)}</p>
          <p class="st-hint">${esc(U.apartHint)}</p>
          <div class="st-rule-row">
            <select id="apart-a" class="st-select" aria-label="${esc(U.apartLabel)} 1"><option value="">${esc(U.pickName)}</option></select>
            <select id="apart-b" class="st-select" aria-label="${esc(U.apartLabel)} 2"><option value="">${esc(U.pickName)}</option></select>
            <button type="button" id="apart-add" class="st-mini st-add">${esc(U.apartAdd)}</button>
          </div>
          <ul id="apart-list" class="st-chips" aria-label="${esc(U.apartLabel)}"></ul>
        </div>
        <div class="st-rule">
          <p class="st-label">${esc(U.frontLabel)}</p>
          <p class="st-hint">${esc(U.frontHint)}</p>
          <div class="st-rule-row st-rule-row-2">
            <select id="front-name" class="st-select" aria-label="${esc(U.frontLabel)}"><option value="">${esc(U.pickName)}</option></select>
            <button type="button" id="front-add" class="st-mini st-add">${esc(U.frontAdd)}</button>
          </div>
          <ul id="front-list" class="st-chips" aria-label="${esc(U.frontLabel)}"></ul>
        </div>
        <div class="st-rule">
          <p class="st-label">${esc(U.pinnedLabel)}</p>
          <p class="st-hint">${esc(U.pinnedHint)}</p>
          <ul id="pin-list" class="st-chips" aria-label="${esc(U.pinnedLabel)}"></ul>
        </div>
      </div>
    </form>

    <p id="error" class="st-error" role="alert" hidden></p>
    <button type="button" id="shuffle-btn" class="st-btn st-btn-primary">${esc(U.shuffle)}</button>
    <p class="st-fair">${esc(U.fair)}</p>

    <div id="result" class="st-result" hidden>
      <div class="st-card st-result-card" id="result-card">
        <p id="shared-badge" class="st-badge" hidden>${esc(R.sharedBadge)}</p>
        <h2 class="st-h2" id="res-title">${esc(R.heading)}</h2>
        <p id="shared-note" class="st-shared-note" hidden></p>
        <div class="st-res-bar">
          <div class="st-seg st-seg-sm" role="radiogroup" aria-label="${esc(R.viewLabel)}">
            <button type="button" class="st-seg-btn" id="view-student" role="radio" aria-checked="true">${esc(R.viewStudent)}</button>
            <button type="button" class="st-seg-btn" id="view-teacher" role="radio" aria-checked="false">${esc(R.viewTeacher)}</button>
          </div>
          <button type="button" id="skip-btn" class="st-mini" hidden>${esc(R.skip)}</button>
        </div>
        <div id="board" class="st-board"></div>
        <p id="live" class="visually-hidden" aria-live="polite"></p>
        <div class="st-actions" id="actions">
          <button type="button" id="copy-btn" class="st-btn st-btn-ghost">${esc(R.copy)}</button>
          <button type="button" id="png-btn" class="st-btn st-btn-ghost">${esc(R.png)}</button>
          <button type="button" id="link-btn" class="st-btn st-btn-ghost">${esc(R.copyLink)}</button>
        </div>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['seat-core.js', 'seat.js'] })}
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
<body class="st-body">
${G.topBar(lang, rel)}
<main class="st-shell">
  <div class="st-doc">
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
