#!/usr/bin/env node
/**
 * 경품 추첨기(Raffle Draw) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 준비 화면(#screen-setup): h1·훅 → 참가자(이름 붙여 넣기 · 번호표 1~N) → 경품(이름·개수) → 추첨 순서 →
 *                                      한 번만 당첨 → 시작 → 맨 아래 mg-ad-start
 *                                    추첨 화면(#screen-draw, 처음 hidden): 진행·발표 모드·결과 → 무대(지금 상·셔플 공개) → 뽑기·건너뛰기 →
 *                                      남은 인원 한꺼번에 · 되돌리기 → 지금까지 당첨자 → 새 추첨. 광고 자리 없음(발표·TV 화면).
 *                                    결과 화면(#screen-end, 처음 hidden): 상별 당첨자 → 텍스트 복사 · 새로 만들기 → 공통 끝 화면(data-mg-end)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 raffle-core.js, 화면 동작은 raffle.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 준비 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 추첨·결과 화면에는 광고 자리를 두지 않는다(결과는 공통 컴포넌트가 광고 포함).
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'raffle-core.js'));

const SITE_ID = 'raffle';
const SITE_ROOT = 'https://raffle.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
const MODE_ICON = { names: '👥', numbers: '🎟️' };

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
<meta name="theme-color" content="#3b0d1e">
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

// 경품 줄(처음 모양 — raffle.js 가 저장된 초안으로 다시 그린다)
function prizeRows(U) {
  return U.defaultPrizes.map((p, i) => `<li class="rf-prize"><span class="rf-prize-rank" aria-hidden="true">${i + 1}</span><input class="rf-prize-name" type="text" value="${esc(p.n)}" maxlength="${CORE.PRIZE_LEN}" aria-label="${esc(U.prizeName)} ${i + 1}"><div class="rf-step"><button type="button" class="rf-step-btn" aria-label="${esc(U.minus)}"${p.c <= 1 ? ' disabled' : ''}>−</button><span class="rf-prize-count" aria-label="${esc(U.prizeCount)}">${p.c}</span><button type="button" class="rf-step-btn" aria-label="${esc(U.plus)}">+</button></div><button type="button" class="rf-prize-rm" aria-label="${esc(U.remove)}">×</button></li>`).join('\n          ');
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
  const runtime = { lang, ui: U, errors: T.errors, end: E };
  const modeBtn = (k, i) => `<button type="button" class="rf-mode" id="pm-${k}" role="radio" aria-checked="${i === 0}" data-mode="${k}"><span class="rf-mode-icon" aria-hidden="true">${MODE_ICON[k]}</span><span class="rf-mode-name">${esc(U.modes[k].name)}</span><span class="rf-mode-desc">${esc(U.modes[k].desc)}</span></button>`;
  const orderBtn = (k, i) => `<button type="button" class="rf-seg-btn rf-order" id="order-${k}" role="radio" aria-checked="${i === 0}" data-order="${k}">${esc(k === 'up' ? U.orderUp : U.orderDown)}</button>`;
  const slots = U.defaultPrizes.reduce((a, p) => a + p.c, 0);

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="rf-body">
${G.topBar(lang, rel)}

<main class="rf-shell">
  <!-- 준비 화면: h1·훅 → 참가자 → 경품 → 순서·옵션 → 시작 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="rf-screen rf-setup">
    <h1 class="rf-h1"><span class="rf-kicker">${esc(H.h1Kicker)}</span><span class="rf-h1-main">${H.h1Html}</span></h1>
    <p class="rf-hook">${esc(H.hook)}</p>

    <div class="rf-card rf-form">
      <p class="rf-label" id="who-label">${esc(U.whoLabel)}</p>
      <div class="rf-modes" role="radiogroup" aria-labelledby="who-label">
        ${CORE.MODES.map(modeBtn).join('\n        ')}
      </div>
      <div id="names-box" class="rf-names">
        <label class="rf-label rf-label-sm" for="names">${esc(U.namesLabel)}</label>
        <textarea id="names" class="rf-textarea" rows="7" spellcheck="false" autocomplete="off" placeholder="${esc(U.namesPlaceholder)}"></textarea>
        <div class="rf-names-bar">
          <p id="names-stat" class="rf-stat" aria-live="polite"></p>
          <button type="button" id="sample-btn" class="rf-link-btn">${esc(U.sample)}</button>
          <button type="button" id="clear-btn" class="rf-link-btn">${esc(U.clear)}</button>
        </div>
        <p class="rf-hint">${esc(U.namesHint)}</p>
        <p id="dup-warn" class="rf-warn" role="status" hidden></p>
      </div>
      <div id="numbers-box" class="rf-numbers" hidden>
        <label class="rf-num-field" for="num-n"><span class="rf-label rf-label-sm">${esc(U.numLabel)}</span>
          <input id="num-n" class="rf-input" type="number" inputmode="numeric" step="1" min="${CORE.NUM_MIN}" max="${CORE.NUM_MAX}" value="100" enterkeyhint="go"></label>
        <p class="rf-hint">${esc(G.fmt(U.numHint, { min: CORE.NUM_MIN, max: CORE.NUM_MAX }))}</p>
      </div>
    </div>

    <div class="rf-card rf-form">
      <p class="rf-label" id="prizes-label">${esc(U.prizesLabel)}</p>
      <ol id="prize-list" class="rf-prize-list" aria-labelledby="prizes-label">
          ${prizeRows(U)}
      </ol>
      <button type="button" id="add-prize" class="rf-add">${esc(U.addPrize)}</button>
      <p class="rf-label rf-label-sm" id="order-label">${esc(U.orderLabel)}</p>
      <div class="rf-seg" role="radiogroup" aria-labelledby="order-label">
        ${CORE.ORDERS.map(orderBtn).join('\n        ')}
      </div>
      <label class="rf-switch"><input type="checkbox" id="unique" role="switch" checked><span class="rf-switch-ui" aria-hidden="true"></span><span>${esc(U.uniqueLabel)}</span></label>
      <p id="slots-info" class="rf-slots">${esc(G.fmt(U.slotsInfo, { n: slots }))}</p>
    </div>

    <p id="error" class="rf-error" role="alert" hidden></p>
    <button type="button" id="start-btn" class="rf-btn rf-btn-primary">${esc(U.start)}</button>
    <p class="rf-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 추첨 화면(발표·TV 화면): 광고 자리 없음 -->
  <section id="screen-draw" class="rf-screen rf-draw" hidden>
    <div class="rf-bar">
      <p id="prog" class="rf-prog"></p>
      <button type="button" id="present-btn" class="rf-mini rf-mini-ghost" aria-pressed="false" aria-label="${esc(U.present)}" title="${esc(U.present)}"><span aria-hidden="true">⛶</span></button>
      <button type="button" id="finish-btn" class="rf-mini">${esc(U.results)}</button>
    </div>

    <div id="stage" class="rf-stage">
      <p id="prize-now" class="rf-prize-now"></p>
      <p id="prize-sub" class="rf-prize-sub"></p>
      <div id="slot" class="rf-slot is-empty" aria-hidden="true">
        <span id="slot-name" class="rf-slot-name">?</span>
        <ul id="slot-multi" class="rf-slot-multi" hidden></ul>
      </div>
      <p id="ready" class="rf-ready">${esc(U.ready)}</p>
      <div id="confetti" class="rf-confetti" aria-hidden="true"></div>
    </div>

    <button type="button" id="draw-btn" class="rf-btn rf-btn-primary rf-draw-btn">${esc(U.drawFirst)}</button>
    <button type="button" id="skip-btn" class="rf-btn rf-btn-ghost rf-skip" hidden>${esc(U.skip)}</button>
    <div class="rf-controls">
      <button type="button" id="rest-btn" class="rf-btn rf-btn-ghost" hidden></button>
      <button type="button" id="undo-btn" class="rf-btn rf-btn-ghost" disabled>${esc(U.undo)}</button>
    </div>
    <p id="left-info" class="rf-left"></p>

    <div id="board-wrap" class="rf-board-wrap" hidden>
      <h2 class="rf-h2 rf-board-title" id="board-title">${esc(U.winnersTitle)}</h2>
      <div id="board" class="rf-board" role="group" aria-labelledby="board-title"></div>
    </div>

    <button type="button" id="new-btn" class="rf-btn rf-btn-ghost rf-new">${esc(U.newRaffle)}</button>
    <p id="live" class="visually-hidden" aria-live="polite"></p>
  </section>

  <!-- 결과 화면: 상별 당첨자 → 복사·새로 만들기 → 공통 끝 화면 -->
  <section id="screen-end" class="rf-screen rf-end" hidden>
    <article class="rf-card rf-sum" aria-labelledby="end-title">
      <p id="end-kicker" class="rf-sum-kicker">${esc(E.kicker)}</p>
      <h2 class="rf-h2" id="end-title">${esc(E.title)}</h2>
      <div id="results" class="rf-results"></div>
      <p id="end-none" class="rf-sum-sub" hidden>${esc(E.none)}</p>
      <button type="button" id="copy-btn" class="rf-btn rf-btn-primary rf-copy">${esc(E.copy)}</button>
      <button type="button" id="own-btn" class="rf-btn rf-btn-ghost" hidden>${esc(E.own)}</button>
      <button type="button" id="edit-btn" class="rf-btn rf-btn-ghost">${esc(E.edit)}</button>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['raffle-core.js', 'raffle.js'] })}
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
<body class="rf-body">
${G.topBar(lang, rel)}
<main class="rf-shell">
  <div class="rf-doc">
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
