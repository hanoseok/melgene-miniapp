#!/usr/bin/env node
/**
 * 병 돌리기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면: h1·훅 → 옵션(모드·이름·겹치지 않기·미션 카드) → 테이블 위 병 → 돌리기
 *                                    → (돌린 뒤) 결과 카드 + 최근 기록 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 bottle-core.js, 화면 동작은 bottle.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱(yesno·roulette 류) — 첫 화면(#screen-bottle) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 돌린 뒤 나타나는 결과(#result) 안에 결과 카드 → 최근 기록 → <div data-mg-end="bottle">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - 기본 미션 카드(prompts)는 PAGE_I18N 안에만(돌린 뒤 한 장씩). 보이는 HTML·메타·가이드에 목록으로 쓰지 않는다(스포일러 금지).
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bottle-core.js'));

const SITE_ID = 'bottle';
const SITE_ROOT = 'https://bottle.example.com';
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
<meta name="theme-color" content="#2b1a3d">
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

// 테이블 위 병(SVG). 목이 위(0°)를 향한다. 회전은 bottle.js 가 --rot 로.
function bottleSvg() {
  return `<svg class="bt-bottle-svg" viewBox="0 0 100 260" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="bt-glass" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stop-color="#1d6b3c"/><stop offset=".35" stop-color="#3fbf73"/><stop offset=".6" stop-color="#2a9256"/><stop offset="1" stop-color="#16502d"/>
              </linearGradient>
            </defs>
            <ellipse cx="54" cy="252" rx="34" ry="6" fill="rgba(0,0,0,.28)"/>
            <path d="M40 8h20v18c0 16 26 34 26 64v148a14 14 0 0 1-14 14H28a14 14 0 0 1-14-14V90c0-30 26-48 26-64z" fill="url(#bt-glass)" stroke="#0f3a21" stroke-width="4" stroke-linejoin="round"/>
            <rect x="37" y="2" width="26" height="16" rx="4" fill="#f2a33a" stroke="#0f3a21" stroke-width="4"/>
            <rect x="22" y="132" width="56" height="62" rx="8" fill="#fff3d6" stroke="#0f3a21" stroke-width="3"/>
            <circle cx="50" cy="163" r="14" fill="#f26b1d"/>
            <path d="M44 158l6-8 6 8-6 14z" fill="#fff3d6"/>
            <path d="M28 96c-4 14-5 30-5 48" stroke="#c8f5d8" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>
          </svg>`;
}

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
  // 브라우저(bottle.js)에서 쓰는 문구 (prompts 는 돌린 뒤 한 장씩만 보인다)
  const runtime = { lang, ui: U, errors: T.errors, result: R, prompts: T.prompts };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="bt-body">
${G.topBar(lang, rel)}

<main class="bt-shell">
  <!-- 한 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 옵션 → 테이블 위 병 → 돌리기 → (돌린 뒤) 결과 + 최근 기록 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-bottle" class="bt-screen">
    <h1 class="bt-h1"><span class="bt-kicker">${esc(H.h1Kicker)}</span><span class="bt-h1-main">${H.h1Html}</span></h1>
    <p class="bt-hook">${esc(H.hook)}</p>

    <form id="bt-form" class="bt-card bt-opts" novalidate autocomplete="off">
      <p class="bt-label" id="mode-label">${esc(U.modeLabel)}</p>
      <div class="bt-seg" role="radiogroup" aria-labelledby="mode-label">
        <button type="button" class="bt-seg-btn" id="mode-free" role="radio" aria-checked="true">${esc(U.modeFree)}</button>
        <button type="button" class="bt-seg-btn" id="mode-names" role="radio" aria-checked="false">${esc(U.modeNames)}</button>
      </div>
      <div id="names-box" class="bt-names" hidden>
        <label class="bt-label" for="names">${esc(U.namesLabel)}</label>
        <textarea id="names" class="bt-textarea" rows="4" spellcheck="false" placeholder="${esc(U.namesPh)}" aria-describedby="names-hint"></textarea>
        <p class="bt-hint" id="names-hint">${esc(U.namesHint)} <span id="names-count" class="bt-count"></span></p>
        <label class="bt-switch"><input type="checkbox" id="skip" role="switch" checked><span class="bt-switch-ui" aria-hidden="true"></span><span class="bt-switch-text">${esc(U.skipLabel)}<small>${esc(U.skipHint)}</small></span></label>
      </div>
      <label class="bt-switch bt-switch-prompts"><input type="checkbox" id="prompts" role="switch"><span class="bt-switch-ui" aria-hidden="true"></span><span class="bt-switch-text">${esc(U.promptsLabel)}<small>${esc(U.promptsHint)}</small></span></label>
      <div id="prompts-box" class="bt-prompts" hidden>
        <div class="bt-seg bt-seg-sm" role="radiogroup" aria-label="${esc(U.promptsLabel)}">
          <button type="button" class="bt-seg-btn" id="src-builtin" role="radio" aria-checked="true">${esc(U.srcBuiltin)}</button>
          <button type="button" class="bt-seg-btn" id="src-custom" role="radio" aria-checked="false">${esc(U.srcCustom)}</button>
        </div>
        <div id="custom-box" class="bt-custom" hidden>
          <label class="bt-label" for="custom">${esc(U.customLabel)}</label>
          <textarea id="custom" class="bt-textarea" rows="4" spellcheck="false" placeholder="${esc(U.customPh)}" aria-describedby="custom-hint"></textarea>
          <p class="bt-hint" id="custom-hint">${esc(U.customHint)}</p>
        </div>
      </div>
    </form>

    <p id="error" class="bt-error" role="alert" hidden></p>
    <p id="shared-note" class="bt-note" hidden>${esc(R.sharedNote)}</p>

    <div class="bt-stage-wrap">
      <div id="stage" class="bt-stage">
        <div class="bt-table" aria-hidden="true"></div>
        <ol id="seats" class="bt-seats" aria-label="${esc(U.namesLabel)}"></ol>
        <div id="bottle" class="bt-bottle" role="button" tabindex="0" aria-label="${esc(U.stageAria)}">
          ${bottleSvg()}
        </div>
      </div>
      <p class="bt-tap-hint">${esc(U.tapHint)}</p>
    </div>

    <button type="button" id="spin-btn" class="bt-btn bt-btn-primary">${esc(U.spin)}</button>
    <p class="bt-fair">${esc(U.fair)}</p>
    <p id="live" class="visually-hidden" aria-live="polite"></p>

    <!-- 돌린 뒤: 결과 카드 → 최근 기록 → 공통 끝 화면 -->
    <div id="result" class="bt-result" hidden>
      <article class="bt-card bt-res-card" id="result-card" aria-labelledby="res-title">
        <p class="bt-res-kicker" id="res-kicker">${esc(R.pointsAt)}</p>
        <h2 class="bt-h2 bt-res-title" id="res-title"></h2>
        <p id="res-sub" class="bt-res-sub"></p>
        <p id="res-round" class="bt-res-round" hidden></p>
        <div id="prompt-card" class="bt-prompt" hidden>
          <p class="bt-prompt-title">${esc(R.promptTitle)}</p>
          <p id="prompt-text" class="bt-prompt-text"></p>
        </div>
        <div class="bt-actions">
          <button type="button" id="reset-btn" class="bt-btn bt-btn-ghost" hidden>${esc(R.reset)}</button>
          <button type="button" id="link-btn" class="bt-btn bt-btn-ghost" hidden>${esc(R.shareNames)}</button>
        </div>
      </article>
      <div id="history-card" class="bt-card bt-history" hidden>
        <h3 class="bt-h3" id="history-title">${esc(R.history)}</h3>
        <ol id="history" class="bt-history-list" aria-labelledby="history-title"></ol>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bottle-core.js', 'bottle.js'] })}
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
<body class="bt-body">
${G.topBar(lang, rel)}
<main class="bt-shell">
  <div class="bt-doc">
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
  if (CORE.MAX_SEATS !== 12) throw new Error('bottle-core MAX_SEATS 가 바뀌었다 — 문구(2~12명)도 함께 고칠 것');
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
