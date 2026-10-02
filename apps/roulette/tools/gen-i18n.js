#!/usr/bin/env node
/**
 * 돌림판의 정적 페이지를 언어별로 생성한다.
 *   index.html / ja/index.html / zh/index.html / ko/index.html / fr,de,th,vi,es/index.html (en 은 사이트 루트)
 *   privacy.html 도 각 언어 폴더에 동일하게
 *   sitemap.xml (모든 언어 URL + xhtml:link hreflang)
 * 문구는 tools/i18n/<lang>.js. roulette.js 가 쓰는 문자열(ui)은 페이지에 인라인(window.PAGE_I18N)된다.
 * 공유 링크(#d=...)는 현재 페이지 주소 기준이라 보낸 사람의 언어 페이지로 열린다.
 *
 * 화면 규칙(melgene-miniapp 스킬):
 *  - 맨 위 타이틀 바는 공통 G.topBar (포털 홈 + 언어 선택), 사이트 자체 헤더는 두지 않는다.
 *  - 시작 화면(이 페이지)은 티징만: 타이틀 바 + 훅(간판·태그라인) + 휠 + 항목 편집기(=시작 입력) + 돌리기 버튼.
 *    SEO 본문·다른 미니앱 목록·FAQ·광고 자리를 시작 화면에 두지 않는다 (SEO는 title/meta/OG/JSON-LD 로만).
 *  - FAQ(공정성 포함)는 MG_FAQ 로 넣어 공통 끝 화면(data-mg-end, 첫 스핀 이후 history 안에 등장)에서만 접이식으로 보여준다.
 *  - 구조화 데이터는 공통 G.appLd (WebApplication + BreadcrumbList) — FAQPage/aggregateRating 없음.
 *
 * 실행: node tools/gen-i18n.js
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ROOT = 'https://roulette.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const DRAW = require(path.join(SITE_DIR, 'roulette-draw.js'));
const CORE = require(path.join(SITE_DIR, 'roulette-core.js'));
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// 프리셋 id 는 언어 무관 — 기본 언어 파일의 ui.presets 순서를 따른다 (모든 언어가 같은 키, check-roulette.js 가 검사)
const PRESET_KEYS = Object.keys(L10N[G.DEFAULT_LOCALE].ui.presets);

// 간판·허브 글자 폭 추정(em) → CSS 가 한 줄에 맞는 크기를 고른다 (언어별 CSS 없음)
const { emWidth } = require('./text-em.js');
function displayStyle(T) {
  // 스타일시트 뒤에 두어 :root 기본값을 덮는다
  return `<style>:root{--font-display:${T.displayFont || 'inherit'}, var(--font-sans);}</style>`;
}

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

function fontLinks(T) {
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${PRETENDARD}">`,
    `<link rel="stylesheet" href="${T.fontCss}">`,
  ].join('\n');
}

function renderIndex(lang) {
  const T = L10N[lang];
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const W = T.wheel;
  const E = T.editor;

  const presets = PRESET_KEYS
    .map((k) => {
      const m = /^(\S+)\s+(.+)$/u.exec(E.presets[k]); // 앞의 이모지는 장식 → 글자와 간격을 따로 준다
      const inner = m ? `<span class="rlt-chip-icon" aria-hidden="true">${esc(m[1])}</span>${esc(m[2])}` : esc(E.presets[k]);
      return `          <button type="button" class="rlt-chip" data-preset="${k}">${inner}</button>`;
    })
    .join('\n');
  const themes = CORE.THEME_IDS
    .map((id) => `          <button type="button" class="rlt-theme" data-theme="${id}" aria-pressed="false"><span class="rlt-theme-swatch" style="background:${DRAW.themePreview(id)}"></span><span class="rlt-theme-name">${esc(T.ui.themes[id])}</span></button>`)
    .join('\n');

  // roulette.js 에 inline 되는 문자열 + 공통 끝 화면의 "다시 하기" 버튼 라벨(다시 돌리기 스타일)
  const pageI18n = Object.assign({}, T.ui, { retryLabel: T.result.again });

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FFE9F0">
<title>${esc(T.meta.title)}</title>
<meta name="description" content="${esc(T.meta.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(T.meta.ogTitle)}">
<meta property="og:description" content="${esc(T.meta.ogDescription)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">

${fontLinks(T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${displayStyle(T)}

${G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.app.name, description: T.app.description, category: 'vote', image: ogImage(lang) })}
</head>
<body class="rlt-body">

${G.topBar(lang, rel, { suggest: lang === G.DEFAULT_LOCALE })}
<div class="rlt-shell">
  <main class="rlt-main">
    <section class="rlt-play" aria-labelledby="rlt-title">
      <header class="rlt-head">
        <h1 id="rlt-title" class="rlt-sign" style="--em:${emWidth(T.hero.h1)}">${esc(T.hero.h1)}</h1>
        <p class="rlt-tagline">${esc(T.hero.tagline)}</p>
      </header>

      <div class="rlt-stage" id="stage">
        <canvas id="rim" class="rlt-rim" aria-hidden="true"></canvas>
        <div class="rlt-disc" id="disc">
          <canvas id="wheel" class="rlt-wheel" role="img" aria-label="${esc(T.app.name)}"></canvas>
          <div class="rlt-gloss" aria-hidden="true"></div>
        </div>
        <div class="rlt-pointer" id="pointer" aria-hidden="true">${DRAW.pointerSvg('rp')}</div>
        <button type="button" class="rlt-hub" id="spin-btn" aria-label="${esc(W.spinAria)}" style="--em:${emWidth(W.spin)}"><span>${esc(W.spin)}</span></button>
      </div>

      <div class="rlt-tools">
        <button type="button" id="sound-btn" class="rlt-pill" aria-pressed="false"><span class="rlt-pill-icon" aria-hidden="true">🔈</span><span id="sound-label">${esc(T.ui.soundOff)}</span></button>
      </div>
      <p class="rlt-fair">${esc(W.fair)}</p>
      <p id="live" class="visually-hidden" aria-live="polite"></p>

      <section id="history" class="rlt-history" aria-labelledby="history-title" hidden>
        <div class="rlt-history-head">
          <h2 id="history-title">${esc(T.history.title)}</h2>
          <button type="button" id="history-clear" class="rlt-text-btn">${esc(T.history.clear)}</button>
        </div>
        <ol id="history-list" class="rlt-history-list" reversed></ol>
        <div data-mg-end="roulette"></div>
      </section>
    </section>

    <section class="rlt-editor" aria-labelledby="editor-title">
      <fieldset id="editor" class="rlt-card">
        <legend class="visually-hidden">${esc(E.title)}</legend>
        <div class="rlt-card-head">
          <h2 id="editor-title">${esc(E.title)}</h2>
          <span id="item-count" class="rlt-count"></span>
        </div>
        <div class="rlt-presets" role="group" aria-label="${esc(E.presetsLabel)}">
${presets}
        </div>
        <ol id="item-list" class="rlt-items"></ol>
        <div class="rlt-list-actions">
          <button type="button" id="add-btn" class="rlt-soft-btn"><span aria-hidden="true">＋</span> ${esc(E.add)}</button>
          <button type="button" id="shuffle-btn" class="rlt-soft-btn"><span aria-hidden="true">🔀</span> ${esc(E.shuffle)}</button>
        </div>
        <button type="button" id="restore-btn" class="rlt-text-btn rlt-restore" hidden></button>

        <div class="rlt-option">
          <label class="rlt-switch">
            <input type="checkbox" id="weighted-toggle" aria-describedby="weighted-hint">
            <span class="rlt-switch-track" aria-hidden="true"></span>
            <span class="rlt-switch-text">${esc(E.weighted)}</span>
          </label>
          <p class="rlt-hint" id="weighted-hint">${esc(E.weightedHint)}</p>
        </div>

        <div class="rlt-option">
          <p class="rlt-option-label" id="theme-label">${esc(E.themeLabel)}</p>
          <div class="rlt-themes" role="group" aria-labelledby="theme-label">
${themes}
          </div>
        </div>
      </fieldset>
    </section>
    <!-- 첫 화면 맨 아래 광고(규칙 2026-10-02). 첫 스핀 뒤 기록(끝 화면, 광고 포함)이 보이면 style.css 가 숨긴다 -->
    <div class="mg-ad mg-ad-start"></div>
  </main>

  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="privacy.html">${esc(T.privacyLink)}</a>
  </footer>
</div>

<div id="result" class="rlt-modal" role="dialog" aria-modal="true" aria-labelledby="result-kicker" aria-describedby="result-label" hidden>
  <div class="rlt-modal-backdrop" data-close></div>
  <div class="rlt-modal-card" id="result-card">
    <p class="rlt-modal-kicker" id="result-kicker">${esc(T.result.kicker)}</p>
    <p class="rlt-modal-label" id="result-label"></p>
    <div class="rlt-modal-actions">
      <button type="button" id="again-btn" class="rlt-btn">${esc(T.result.again)}</button>
      <button type="button" id="remove-btn" class="rlt-soft-btn">${esc(T.result.removeAgain)}</button>
      <button type="button" id="close-btn" class="rlt-text-btn" data-close>${esc(T.result.close)}</button>
    </div>
  </div>
</div>
<canvas id="confetti" class="rlt-confetti" aria-hidden="true"></canvas>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PAGE_I18N', pageI18n)}
${G.scriptJson('MG_FAQ', T.faq)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}roulette-core.js"></script>
<script src="${root}roulette-draw.js"></script>
<script src="${root}roulette.js"></script>
</body>
</html>
`;
}

function renderPrivacy(lang) {
  const T = L10N[lang];
  const P = T.privacy;
  const rel = 'privacy.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const sections = P.sections.map(([h, body]) => `    <h2>${esc(h)}</h2>\n    <p>${body}</p>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#FFE9F0">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
${fontLinks(T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${displayStyle(T)}
</head>
<body class="rlt-body">
${G.topBar(lang, rel)}
<div class="rlt-shell">
  <article class="rlt-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </article>

  <footer class="site-footer">
    <a href="./index.html">${esc(P.back)}</a>
  </footer>
</div>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
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
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy) = HTML ${n}개`);
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
  console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 포함)`);
  if (!fs.existsSync(path.join(SITE_DIR, 'og', 'default.png'))) {
    console.log('참고: og/default.png 가 없다 — node tools/gen-og.js 로 만든다.');
  }
}

main();
