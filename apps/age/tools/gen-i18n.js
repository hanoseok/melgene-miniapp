#!/usr/bin/env node
/**
 * 만 나이 계산기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 생년월일 선택 → 기준일 → 계산하기) → 계산한 뒤 나이 카드 + (ko 만) 한국 나이 비교 +
 *                                    다음 생일 + 살아온 날 + 요일·별자리·띠 + 기념일 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어 — guide.html 은 tools/gen-guides.js 가 더한다)
 * 문구는 tools/i18n/<lang>.js, 날짜 계산은 age-core.js, 화면 동작은 age.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱 — 첫 화면(입력) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 계산한 뒤 나타나는 결과(#result) 맨 끝에 <div data-mg-end="age">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *   - 한국 나이(연 나이·세는 나이) 비교 카드는 korea.show 가 true 인 언어(ko)에서만 HTML 에 넣는다.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'age-core.js'));

const SITE_ID = 'age';
const SITE_ROOT = 'https://age.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const ORDERS = ['ymd', 'mdy', 'dmy'];
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
<meta name="theme-color" content="#fff4ec">
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

// 생년월일 선택 상자 3개 — 언어별 순서(ymd · mdy · dmy). 보기는 age.js 가 채운다(올해 기준 연도, Intl 달 이름, 그달 날수).
function dateSelects(T) {
  const U = T.ui;
  const order = ORDERS.includes(T.dateOrder) ? T.dateOrder : 'ymd';
  const box = {
    y: `<div class="ag-sel ag-sel-y"><label class="visually-hidden" for="by">${esc(U.year)}</label><select id="by" class="ag-select" required><option value="">${esc(U.year)}</option></select></div>`,
    m: `<div class="ag-sel ag-sel-m"><label class="visually-hidden" for="bm">${esc(U.month)}</label><select id="bm" class="ag-select" required><option value="">${esc(U.month)}</option></select></div>`,
    d: `<div class="ag-sel ag-sel-d"><label class="visually-hidden" for="bd">${esc(U.day)}</label><select id="bd" class="ag-select" required><option value="">${esc(U.day)}</option></select></div>`,
  };
  return `<div class="ag-sels ag-order-${order}" role="group" aria-labelledby="birth-label">${order.split('').map((k) => box[k]).join('')}</div>`;
}

function koreaCard(T) {
  const K = T.korea;
  if (!K.show) return '';
  return `
      <div class="ag-card ag-kr" id="kr-card" aria-labelledby="kr-title">
        <h2 class="ag-h2" id="kr-title">${esc(K.title)}</h2>
        <dl class="ag-kr-list">
          <div class="ag-kr-row is-man"><dt>${esc(K.man)}<small>${esc(K.manHint)}</small></dt><dd id="kr-man"></dd></div>
          <div class="ag-kr-row"><dt>${esc(K.yeon)}<small>${esc(K.yeonHint)}</small></dt><dd id="kr-yeon"></dd></div>
          <div class="ag-kr-row"><dt>${esc(K.counting)}<small>${esc(K.countingHint)}</small></dt><dd id="kr-count"></dd></div>
        </dl>
        <p class="ag-note">${esc(K.note)}</p>
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
  // 브라우저(age.js)에서 쓰는 문구
  const runtime = { lang, ui: U, result: R, errors: T.errors, korea: T.korea };
  const totals = ['days', 'weeks', 'months', 'hours'].map((k) => `<div class="ag-stat"><dt>${esc(R.totals[k])}</dt><dd id="t-${k}"></dd></div>`).join('\n          ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="ag-body">
${G.topBar(lang, rel)}

<main class="ag-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 생년월일 → 기준일 → 계산하기 → (계산한 뒤) 결과 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-age" class="ag-screen">
    <div class="ag-cake" aria-hidden="true"><span class="ag-cake-flame"></span><span class="ag-cake-top"></span><span class="ag-cake-base"></span></div>
    <h1 class="ag-h1"><span class="ag-kicker">${esc(H.h1Kicker)}</span><span class="ag-h1-main">${H.h1Html}</span></h1>
    <p class="ag-hook">${esc(H.hook)}</p>

    <form id="ag-form" class="ag-card ag-form" novalidate autocomplete="off">
      <div class="ag-field">
        <p class="ag-label" id="birth-label">${esc(U.birthLabel)}</p>
        ${dateSelects(T)}
      </div>
      <div class="ag-field">
        <label class="ag-label" for="asof">${esc(U.asOfLabel)}</label>
        <div class="ag-row">
          <input id="asof" class="ag-input ag-date" type="date" min="${CORE.AS_OF_MIN}-01-01" max="${CORE.MAX_YEAR}-12-31">
          <button type="button" id="today-btn" class="ag-mini-btn">${esc(U.todayBtn)}</button>
        </div>
        <p class="ag-hint">${esc(U.asOfHint)}</p>
      </div>
    </form>

    <button type="button" id="calc-btn" class="ag-btn ag-btn-primary">${esc(U.compute)}</button>
    <p class="ag-local">${esc(U.localNote)}</p>
    <p id="error" class="ag-error" role="alert" hidden></p>

    <div id="result" class="ag-result" hidden>
      <article id="result-card" class="ag-hero-card" aria-labelledby="r-label">
        <p class="ag-asof" id="r-asof"></p>
        <p class="ag-r-label" id="r-label">${esc(R.ageLabel)}</p>
        <p class="ag-big" id="r-big"></p>
        <p class="ag-ymd" id="r-ymd"></p>
        <p class="ag-born" id="r-born"></p>
        <p class="ag-brand">${esc(T.og.brand)}</p>
      </article>
${koreaCard(T)}
      <div class="ag-card ag-next" id="next-card" aria-labelledby="next-title">
        <h2 class="ag-h2" id="next-title">${esc(R.nextTitle)}</h2>
        <p class="ag-next-d" id="n-d"></p>
        <p class="ag-next-sub" id="n-sub"></p>
        <p class="ag-next-date" id="n-date"></p>
        <p class="ag-note" id="n-leap" hidden>${esc(R.leapNote)}</p>
      </div>

      <div class="ag-card" id="totals-card" aria-labelledby="totals-title">
        <h2 class="ag-h2" id="totals-title">${esc(R.totalsTitle)}</h2>
        <dl class="ag-stats">
          ${totals}
        </dl>
        <p class="ag-note">${esc(R.hoursNote)}</p>
      </div>

      <div class="ag-card" id="signs-card" aria-labelledby="signs-title">
        <h2 class="ag-h2" id="signs-title">${esc(R.signsTitle)}</h2>
        <dl class="ag-signs">
          <div class="ag-sign"><dt>${esc(R.weekdayLabel)}</dt><dd><span class="ag-sign-ico" aria-hidden="true">📅</span><span id="s-weekday"></span></dd></div>
          <div class="ag-sign"><dt>${esc(R.zodiacLabel)}</dt><dd><span class="ag-sign-ico" id="s-zodiac-ico" aria-hidden="true"></span><span id="s-zodiac"></span></dd></div>
          <div class="ag-sign"><dt>${esc(R.animalLabel)}</dt><dd><span class="ag-sign-ico" id="s-animal-ico" aria-hidden="true"></span><span id="s-animal"></span></dd></div>
        </dl>
      </div>

      <div class="ag-card" id="ms-card" aria-labelledby="ms-title">
        <h2 class="ag-h2" id="ms-title">${esc(R.milestonesTitle)}</h2>
        <ol id="ms-list" class="ag-ms-list" aria-labelledby="ms-title"></ol>
      </div>
      <p id="live" class="visually-hidden" aria-live="polite"></p>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['age-core.js', 'age.js'] })}
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
<body class="ag-body">
${G.topBar(lang, rel)}
<main class="ag-shell">
  <div class="ag-doc">
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
