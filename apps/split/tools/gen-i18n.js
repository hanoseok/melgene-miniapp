#!/usr/bin/env node
/**
 * 더치페이 계산기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 입력 카드(똑같이 나누기 / 항목별로 나누기 · 통화 · 정리 단위 · 끝돈)
 *                                    → 결과 카드(입력하는 대로) → 누가 먼저 냈어요(송금 목록) → 결과 복사·링크 → 정산 완료)
 *                                    → (정산 완료 뒤) 요약 카드 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어 — guide.html 은 tools/gen-guides.js 가 더한다)
 * 문구는 tools/i18n/<lang>.js, 계산은 split-core.js, 화면 동작은 split.js(사람·메뉴·낸 사람 목록은 JS 가 그린다).
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱 — 첫 화면(계산기) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - "정산 완료" 뒤 나타나는 #result 맨 끝에 <div data-mg-end="split">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'split-core.js'));

const SITE_ID = 'split';
const SITE_ROOT = 'https://split.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap';
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
      `<link rel="stylesheet" href="${NUM_FONT}">`,
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
<meta name="theme-color" content="#fbf6ec">
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
// 한 화면 도구 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const cur = CORE.currencyOf(T.cur.def);
  // 브라우저(split.js)에서 쓰는 문구
  const runtime = { lang, ui: U, errors: T.errors, cur: T.cur, tip: T.tip };
  const opts = CORE.CODES.map((c) => `<option value="${c}"${c === cur ? ' selected' : ''}>${c}</option>`).join('');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="sp-body">
${G.topBar(lang, rel)}

<main class="sp-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 입력 카드(방법·통화 → 똑같이/항목별 → 정리 단위·끝돈) → 결과 카드(+ 먼저 낸 사람 정산)
       → 결과 복사·링크 → 정산 완료 → (완료 뒤) 요약 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-split" class="sp-screen">
    <div class="sp-logo" aria-hidden="true"><span>💸</span></div>
    <h1 class="sp-h1"><span class="sp-kicker">${esc(H.h1Kicker)}</span><span class="sp-h1-main">${H.h1Html}</span></h1>
    <p class="sp-hook">${esc(H.hook)}</p>
    <p id="shared-note" class="sp-shared" hidden>${esc(U.sharedNote)}</p>

    <div class="sp-card sp-inputs">
      <div class="sp-top">
        <div class="sp-seg sp-mode" role="group" aria-label="${esc(U.modeLabel)}">
          <button type="button" class="sp-seg-btn" data-mode="a" aria-pressed="true">${esc(U.modeEven)}</button>
          <button type="button" class="sp-seg-btn" data-mode="b" aria-pressed="false">${esc(U.modeItems)}</button>
        </div>
        <label class="sp-cur"><span class="visually-hidden">${esc(U.currency)}</span><select id="currency" aria-label="${esc(U.currency)}">${opts}</select></label>
      </div>

      <div id="box-a" class="sp-box" data-box="a">
        <div class="sp-field"><label class="sp-label" for="in-total">${esc(U.total)}</label>
          <div class="sp-inwrap"><input id="in-total" class="sp-input sp-input-big" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" enterkeyhint="done"><span class="sp-suffix" data-sym aria-hidden="true"></span></div>
        </div>
        <div class="sp-field"><span class="sp-label" id="lbl-people">${esc(U.people)}</span>
          <div class="sp-stepper" role="group" aria-labelledby="lbl-people">
            <button type="button" class="sp-step" id="people-minus" aria-label="${esc(U.minus)}">−</button>
            <input id="in-people" class="sp-input sp-input-n" type="text" inputmode="numeric" autocomplete="off" aria-labelledby="lbl-people" value="2">
            <button type="button" class="sp-step" id="people-plus" aria-label="${esc(U.plus)}">+</button>
          </div>
        </div>
        <button type="button" id="tip-more-a" class="sp-more" aria-expanded="false" aria-controls="tip-a">${esc(U.tipMore)}</button>
        <div id="tip-a" class="sp-extra" hidden>
          <span class="sp-label" id="lbl-tip-a">${esc(U.tipLabel)}</span>
          <div class="sp-chips" data-tip-chips="a" role="group" aria-labelledby="lbl-tip-a"></div>
        </div>
      </div>

      <div id="box-b" class="sp-box" data-box="b" hidden>
        <p class="sp-label sp-sub">${esc(U.peopleTitle)}</p>
        <div id="people-list" class="sp-people"></div>
        <button type="button" id="add-person" class="sp-add">${esc(U.addPerson)}</button>
        <p class="sp-label sp-sub">${esc(U.itemsTitle)}</p>
        <div id="item-list" class="sp-items"></div>
        <button type="button" id="add-item" class="sp-add">${esc(U.addItem)}</button>
        <button type="button" id="tip-more-b" class="sp-more" aria-expanded="false" aria-controls="tip-b">${esc(U.extrasMore)}</button>
        <div id="tip-b" class="sp-extra" hidden>
          <div class="sp-field sp-field-pct"><label class="sp-label" for="in-tax">${esc(U.taxLabel)}</label>
            <div class="sp-inwrap"><input id="in-tax" class="sp-input" type="text" inputmode="decimal" autocomplete="off" spellcheck="false"><span class="sp-suffix" aria-hidden="true">%</span></div>
          </div>
          <span class="sp-label" id="lbl-tip-b">${esc(U.tipLabel)}</span>
          <div class="sp-chips" data-tip-chips="b" role="group" aria-labelledby="lbl-tip-b"></div>
        </div>
      </div>

      <div class="sp-round">
        <span class="sp-label" id="lbl-unit">${esc(U.roundLabel)}</span>
        <div class="sp-chips" id="unit-chips" role="group" aria-labelledby="lbl-unit"></div>
        <span class="sp-label" id="lbl-rem">${esc(U.remainderLabel)}</span>
        <div class="sp-seg sp-rem" role="group" aria-labelledby="lbl-rem">
          <button type="button" class="sp-seg-btn" data-rem="h" aria-pressed="true">${esc(U.remHost)}</button>
          <button type="button" class="sp-seg-btn" data-rem="e" aria-pressed="false">${esc(U.remEven)}</button>
        </div>
        <p class="sp-note" id="rem-host-note" hidden>${esc(U.remHostItems)}</p>
      </div>
    </div>

    <div class="sp-card sp-out" id="out">
      <p class="sp-lead" id="out-lead">${esc(U.waiting)}</p>
      <div id="out-body" hidden>
        <p class="sp-grand-t">${esc(U.grand)}</p>
        <p class="sp-grand" id="out-grand"></p>
        <p class="sp-break" id="out-break"></p>
        <ul class="sp-shares" id="out-shares"></ul>
        <p class="sp-ok" id="out-sum"></p>
      </div>
      <p class="sp-err" id="out-err" role="alert" hidden></p>
    </div>

    <div class="sp-card sp-pay">
      <label class="sp-switch"><input type="checkbox" id="pay-toggle" role="switch"><span class="sp-switch-ui" aria-hidden="true"></span><span class="sp-switch-t">${esc(U.payToggle)}</span></label>
      <div id="pay-box" hidden>
        <div id="payer-list" class="sp-payers"></div>
        <button type="button" id="add-payer" class="sp-add">${esc(U.addPayer)}</button>
        <p class="sp-note">${esc(U.payFullHint)}</p>
        <p class="sp-label sp-sub">${esc(U.transfersTitle)}</p>
        <ul class="sp-transfers" id="transfers"></ul>
        <p class="sp-ok" id="pay-sum"></p>
      </div>
    </div>

    <div class="sp-actions">
      <button type="button" id="copy-btn" class="sp-btn sp-btn-ghost">${esc(U.copy)}</button>
      <button type="button" id="link-btn" class="sp-btn sp-btn-ghost">${esc(U.link)}</button>
    </div>
    <p class="sp-hint">${esc(U.decimalHint)}</p>

    <button type="button" id="finish-btn" class="sp-btn sp-btn-primary">${esc(U.finish)}</button>
    <p class="sp-local">${esc(U.localNote)}</p>
    <p id="finish-err" class="sp-error" role="alert" hidden></p>

    <div id="result" class="sp-result" hidden>
      <article id="summary-card" class="sp-summary" aria-labelledby="sum-title">
        <h2 class="sp-h2" id="sum-title">${esc(U.summaryTitle)}</h2>
        <p class="sp-grand" id="sum-grand"></p>
        <p class="sp-break" id="sum-break"></p>
        <ul class="sp-shares" id="sum-shares"></ul>
        <div id="sum-pay" hidden>
          <p class="sp-label sp-sub">${esc(U.transfersTitle)}</p>
          <ul class="sp-transfers" id="sum-transfers"></ul>
        </div>
        <p class="sp-note">${esc(U.summaryNote)}</p>
        <button type="button" id="sum-copy" class="sp-btn sp-btn-ghost">${esc(U.copy)}</button>
        <p class="sp-brand">${esc(T.og.brand)}</p>
      </article>
      <p id="live" class="visually-hidden" aria-live="polite"></p>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['split-core.js', 'split.js'] })}
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
<body class="sp-body">
${G.topBar(lang, rel)}
<main class="sp-shell">
  <div class="sp-doc">
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
