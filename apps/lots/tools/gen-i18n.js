#!/usr/bin/env node
/**
 * 제비뽑기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(설정) → 뽑기 화면(접힌 쪽지 격자) → 끝 화면(누가 뭘 뽑았나 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 lots-core.js, 화면 동작은 lots.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면(#screen-setup) = h1·훅 + 시작에 필요한 입력(쪽지 수·내용·이름·옵션) + 최근 설정 + 시작 버튼, 마지막 요소 mg-ad-start 1개.
 *   - 뽑기 화면(#screen-draw)에는 광고를 두지 않는다(휴대폰을 돌려 가며 누르는 화면).
 *   - 끝 화면(#screen-end) = 결과 카드 → <div data-mg-end="lots">. FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'lots-core.js'));

const SITE_ID = 'lots';
const SITE_ROOT = 'https://lots.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const MONO = 'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&display=swap';
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
      `<link rel="stylesheet" href="${MONO}">`,
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
<meta name="theme-color" content="#e6d3ad">
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

function stepper(id, label, value, min, max, U, labelId) {
  return `<div class="lt-row">
          <label class="lt-label" for="${id}"${labelId ? ` id="${labelId}"` : ''}>${esc(label)}</label>
          <div class="lt-stepper">
            <button type="button" id="${id}-dec" class="lt-step" aria-label="${esc(U.countDec)}">−</button>
            <input id="${id}" class="lt-input lt-input-num" type="number" step="1" inputmode="numeric" value="${value}" min="${min}" max="${max}" enterkeyhint="done">
            <button type="button" id="${id}-inc" class="lt-step" aria-label="${esc(U.countInc)}">+</button>
          </div>
        </div>`;
}

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const D = T.draw;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const DF = CORE.DEFAULTS;
  // 브라우저(lots.js)에서 쓰는 문구
  const runtime = { lang, ui: U, errors: T.errors, draw: D, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="lt-body">
${G.topBar(lang, rel)}

<main class="lt-shell">
  <!-- 시작 화면: h1·훅 → 쪽지 수 → 이름(선택, 접힘) → 쪽지 내용(간단/직접) → 옵션 → 시작 → 최근 설정 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="lt-screen lt-setup">
    <h1 class="lt-h1"><span class="lt-kicker">${esc(H.h1Kicker)}</span><span class="lt-h1-main">${H.h1Html}</span></h1>
    <p class="lt-hook">${esc(H.hook)}</p>

    <form id="lt-form" class="lt-form" novalidate autocomplete="off">
      <div class="lt-card lt-ticket">
        ${stepper('count', U.countLabel, DF.count, CORE.MIN_SLIPS, CORE.MAX_SLIPS, U)}
        <p id="count-note" class="lt-hint lt-count-note" hidden></p>
        <button type="button" id="names-btn" class="lt-more-btn" aria-expanded="false" aria-controls="names-box">${esc(U.namesBtn)}</button>
        <div id="names-box" class="lt-names" hidden>
          <label class="lt-label" for="names">${esc(U.namesLabel)}</label>
          <textarea id="names" class="lt-textarea" rows="4" spellcheck="false" placeholder="${esc(U.namesPh)}" aria-describedby="names-hint"></textarea>
          <p class="lt-hint" id="names-hint">${esc(U.namesHint)}</p>
        </div>
      </div>

      <div class="lt-card lt-ticket">
        <p class="lt-label" id="mode-label">${esc(U.modeLabel)}</p>
        <div class="lt-seg" role="radiogroup" aria-labelledby="mode-label">
          <button type="button" class="lt-seg-btn" id="mode-simple" role="radio" aria-checked="true">${esc(U.modeSimple)}</button>
          <button type="button" class="lt-seg-btn" id="mode-custom" role="radio" aria-checked="false">${esc(U.modeCustom)}</button>
        </div>
        <div id="simple-box" class="lt-simple">
          ${stepper('winners', U.winnersLabel, DF.winners, 1, CORE.MAX_SLIPS, U)}
          <p id="simple-preview" class="lt-preview" aria-live="polite"></p>
        </div>
        <div id="custom-box" class="lt-custom" hidden>
          <p class="lt-hint">${esc(U.kindsHint)}</p>
          <ul id="kinds" class="lt-kinds"></ul>
          <div class="lt-kind-btns">
            <button type="button" id="kind-add" class="lt-mini">${esc(U.kindAdd)}</button>
            <button type="button" id="fill-blank" class="lt-mini">${esc(U.fillBlank)}</button>
          </div>
          <p id="total" class="lt-total" aria-live="polite"></p>
        </div>
      </div>

      <div class="lt-card lt-ticket lt-opts">
        <label class="lt-switch"><input type="checkbox" id="hide" role="switch"${DF.hide ? ' checked' : ''}><span class="lt-switch-ui" aria-hidden="true"></span><span class="lt-switch-text">${esc(U.hideLabel)}<small>${esc(U.hideHint)}</small></span></label>
        <label class="lt-switch"><input type="checkbox" id="fx" role="switch"${DF.fx ? ' checked' : ''}><span class="lt-switch-ui" aria-hidden="true"></span><span class="lt-switch-text">${esc(U.fxLabel)}</span></label>
      </div>
    </form>

    <p id="error" class="lt-error" role="alert" hidden></p>
    <button type="button" id="start-btn" class="lt-btn lt-btn-primary">${esc(U.start)}</button>
    <p class="lt-fair">${esc(U.fair)}</p>

    <div id="recent" class="lt-card lt-recent" hidden>
      <div class="lt-recent-head">
        <h2 class="lt-h2" id="recent-title">${esc(U.recentTitle)}</h2>
        <button type="button" id="recent-clear" class="lt-mini">${esc(U.recentClear)}</button>
      </div>
      <ul id="recent-list" class="lt-recent-list" aria-labelledby="recent-title"></ul>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 뽑기 화면: 진행 → 차례 → 접힌 쪽지 격자 → 그만 뽑기 (광고 없음). 펼친 쪽지·폰 넘기기는 앱 폭 안의 덮개 -->
  <section id="screen-draw" class="lt-screen lt-draw" hidden>
    <div class="lt-progress">
      <p id="progress" class="lt-progress-text"></p>
      <div class="lt-bar" aria-hidden="true"><i id="bar-fill" class="lt-bar-fill"></i></div>
    </div>
    <p id="turn" class="lt-turn"></p>
    <p class="lt-pick-hint">${esc(D.pick)}</p>
    <div id="grid" class="lt-grid" role="group" aria-label="${esc(D.gridAria)}"></div>
    <button type="button" id="finish-btn" class="lt-mini lt-finish">${esc(D.finish)}</button>
    <p id="live" class="visually-hidden" aria-live="polite"></p>

    <div id="reveal" class="lt-cover lt-reveal" hidden role="dialog" aria-modal="true" aria-labelledby="reveal-who">
      <div class="lt-cover-inner">
        <p id="reveal-who" class="lt-reveal-who"></p>
        <div id="paper" class="lt-paper">
          <div class="lt-paper-in">
            <span id="paper-no" class="lt-paper-no"></span>
            <span id="paper-label" class="lt-paper-label"></span>
            <span id="paper-tag" class="lt-paper-tag"></span>
          </div>
          <div class="lt-flap" aria-hidden="true"><span id="flap-no" class="lt-flap-no"></span></div>
        </div>
        <button type="button" id="next-btn" class="lt-btn lt-btn-primary">${esc(D.next)}</button>
      </div>
      <div id="confetti" class="lt-confetti" aria-hidden="true"></div>
    </div>

    <div id="pass" class="lt-cover lt-pass" hidden role="dialog" aria-modal="true" aria-labelledby="pass-title">
      <div class="lt-cover-inner">
        <p class="lt-pass-emoji" aria-hidden="true">📱👉</p>
        <p id="pass-title" class="lt-pass-title"></p>
        <p class="lt-hint lt-pass-hint">${esc(D.passHint)}</p>
        <button type="button" id="ready-btn" class="lt-btn lt-btn-primary">${esc(D.ready)}</button>
      </div>
    </div>
  </section>

  <!-- 끝 화면: 결과 카드(누가 뭘 뽑았나) → 공통 끝 화면 -->
  <section id="screen-end" class="lt-screen lt-end" hidden>
    <article class="lt-card lt-result" id="result-card" aria-labelledby="res-title">
      <p id="shared-badge" class="lt-badge" hidden>${esc(R.sharedBadge)}</p>
      <h2 class="lt-h2 lt-res-title" id="res-title">${esc(R.heading)}</h2>
      <p id="shared-note" class="lt-shared-note" hidden></p>
      <ul id="res-tags" class="lt-tags"></ul>
      <ol id="summary" class="lt-summary"></ol>
      <p id="leftover" class="lt-leftover" hidden></p>
      <h3 class="lt-h3">${esc(R.byPrize)}</h3>
      <ul id="tally" class="lt-tally"></ul>
      <div class="lt-actions">
        <button type="button" id="copy-btn" class="lt-btn lt-btn-ghost">${esc(R.copy)}</button>
        <button type="button" id="link-btn" class="lt-btn lt-btn-ghost">${esc(R.copyLink)}</button>
        <button type="button" id="edit-btn" class="lt-btn lt-btn-ghost">${esc(R.edit)}</button>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['lots-core.js', 'lots.js'] })}
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
<body class="lt-body">
${G.topBar(lang, rel)}
<main class="lt-shell">
  <div class="lt-doc">
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
