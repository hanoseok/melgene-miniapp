#!/usr/bin/env node
/**
 * QR코드 생성기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면 도구: h1·훅 → 종류·입력 → 미리보기 → 저장 버튼 → 디자인 옵션(접힘) → (저장 뒤) 결과 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 인코더는 qr-core.js, 화면 동작은 qr.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱(dice·roulette 와 같은 방식) — 첫 화면(입력 화면) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 처음 저장(PNG·SVG·이미지 복사) 뒤 나타나는 결과(#result) 안에 <div data-mg-end="qr">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'qr-core.js'));

const SITE_ID = 'qr';
const SITE_ROOT = 'https://qr.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');

// 화면 설정 (언어 무관)
const TYPE_ICONS = { link: '🔗', text: '📝', wifi: '📶', email: '✉️', phone: '📞' };
const ECC_PCT = { L: 7, M: 15, Q: 25, H: 30 };
const SIZES = [256, 512, 1024, 2048];
const DEFAULTS = { type: 'link', ecc: 'M', size: 1024, margin: 4, fg: '#111111', bg: '#ffffff' };

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
  ];
  if (F.css && F.css !== PRETENDARD) links.push(`<link rel="stylesheet" href="${esc(F.css)}">`);
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
<meta name="theme-color" content="#111111">
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

// 입력 칸 하나
function field(id, label, input) {
  return `<div class="qr-field"><label class="qr-label" for="${id}">${esc(label)}</label>${input}</div>`;
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
  const runtime = { lang, ui: U, result: T.result, fileName: T.fileName, defaults: DEFAULTS };

  const typeBtns = CORE.TYPES.map((t) => `<button type="button" class="qr-type" role="radio" data-type="${t}" aria-checked="${t === DEFAULTS.type}"><span class="qr-type-ico" aria-hidden="true">${TYPE_ICONS[t]}</span><span class="qr-type-name">${esc(U.types[t])}</span></button>`).join('\n        ');
  const eccBtns = CORE.ECC_LEVELS.map((e) => `<button type="button" class="qr-seg-btn" role="radio" data-ecc="${e}" aria-checked="${e === DEFAULTS.ecc}" aria-label="${e} ${ECC_PCT[e]}%">${e}<small>${ECC_PCT[e]}%</small></button>`).join('\n          ');
  const sizeBtns = SIZES.map((s) => `<button type="button" class="qr-seg-btn" role="radio" data-size="${s}" aria-checked="${s === DEFAULTS.size}">${s}<small>px</small></button>`).join('\n          ');
  const secOpts = CORE.WIFI_AUTH.map((a) => `<option value="${a}">${esc(U.wifi.sec[a])}</option>`).join('');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="qr-body">
${G.topBar(lang, rel)}

<main class="qr-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 종류·입력 → 미리보기 → 저장 → 옵션 → (첫 저장 뒤) 결과 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-qr" class="qr-screen">
    <h1 class="qr-h1"><span class="qr-kicker">${esc(H.h1Kicker)}</span><span class="qr-h1-main">${H.h1Html}</span></h1>
    <p class="qr-hook">${esc(H.hook)}</p>

    <div class="qr-card qr-input">
      <div class="qr-types" role="radiogroup" aria-label="${esc(U.typeLabel)}">
        ${typeBtns}
      </div>
      <div class="qr-fields" data-for="link">
        ${field('f-link', U.link.label, `<input id="f-link" class="qr-in" type="url" inputmode="url" autocomplete="url" autocapitalize="off" spellcheck="false" maxlength="2900" placeholder="${esc(U.link.placeholder)}">`)}
      </div>
      <div class="qr-fields" data-for="text" hidden>
        ${field('f-text', U.text.label, `<textarea id="f-text" class="qr-in qr-ta" rows="4" maxlength="2900" placeholder="${esc(U.text.placeholder)}"></textarea>`)}
      </div>
      <div class="qr-fields" data-for="wifi" hidden>
        ${field('f-ssid', U.wifi.ssid, `<input id="f-ssid" class="qr-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="64" placeholder="${esc(U.wifi.ssidPh)}">`)}
        ${field('f-pass', U.wifi.password, `<input id="f-pass" class="qr-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="128" placeholder="${esc(U.wifi.passwordPh)}">`)}
        <div class="qr-row">
          ${field('f-sec', U.wifi.security, `<select id="f-sec" class="qr-in qr-select">${secOpts}</select>`)}
          <label class="qr-check"><input id="f-hidden" type="checkbox"> <span>${esc(U.wifi.hidden)}</span></label>
        </div>
      </div>
      <div class="qr-fields" data-for="email" hidden>
        ${field('f-to', U.email.to, `<input id="f-to" class="qr-in" type="email" inputmode="email" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="254" placeholder="${esc(U.email.toPh)}">`)}
        ${field('f-subject', U.email.subject, `<input id="f-subject" class="qr-in" type="text" maxlength="200" placeholder="${esc(U.email.subjectPh)}">`)}
        ${field('f-body', U.email.body, `<textarea id="f-body" class="qr-in qr-ta" rows="3" maxlength="1500" placeholder="${esc(U.email.bodyPh)}"></textarea>`)}
      </div>
      <div class="qr-fields" data-for="phone" hidden>
        ${field('f-phone', U.phone.label, `<input id="f-phone" class="qr-in" type="tel" inputmode="tel" autocomplete="off" maxlength="40" placeholder="${esc(U.phone.placeholder)}">`)}
      </div>
    </div>

    <div class="qr-stage">
      <div id="preview" class="qr-preview is-empty">
        <canvas id="qr-canvas" width="560" height="560" role="img" aria-label="${esc(U.previewLabel)}"></canvas>
        <p id="qr-empty" class="qr-empty">${esc(U.emptyPreview)}</p>
      </div>
      <p id="qr-info" class="qr-info" aria-live="polite"></p>
      <p id="qr-payload" class="qr-payload" hidden></p>
      <p id="qr-error" class="qr-msg qr-error" role="alert" hidden></p>
      <p id="qr-warn" class="qr-msg qr-warn" hidden></p>
    </div>

    <div class="qr-actions">
      <button type="button" id="dl-png" class="qr-btn qr-btn-primary" disabled>${esc(U.downloadPng)}</button>
      <button type="button" id="dl-svg" class="qr-btn" disabled>${esc(U.downloadSvg)}</button>
      <button type="button" id="copy-img" class="qr-btn" disabled hidden>${esc(U.copyImage)}</button>
    </div>
    <p id="status" class="qr-status" aria-live="polite"></p>

    <details id="options" class="qr-card qr-options">
      <summary class="qr-sum">${esc(U.options)}</summary>
      <div class="qr-opt">
        <p class="qr-label">${esc(U.colors)}</p>
        <div class="qr-colors">
          <label class="qr-color"><input id="c-fg" type="color" value="${DEFAULTS.fg}"> <span>${esc(U.fg)}</span></label>
          <label class="qr-color"><input id="c-bg" type="color" value="${DEFAULTS.bg}"> <span>${esc(U.bg)}</span></label>
          <button type="button" id="c-reset" class="qr-mini">${esc(U.resetColors)}</button>
        </div>
      </div>
      <div class="qr-opt">
        <p class="qr-label" id="ecc-label">${esc(U.ecc)}</p>
        <div class="qr-seg" role="radiogroup" aria-labelledby="ecc-label">
          ${eccBtns}
        </div>
        <p class="qr-hint">${esc(U.eccHint)}</p>
      </div>
      <div class="qr-opt">
        <p class="qr-label" id="size-label">${esc(U.size)}</p>
        <div class="qr-seg" role="radiogroup" aria-labelledby="size-label">
          ${sizeBtns}
        </div>
      </div>
      <div class="qr-opt">
        <label class="qr-label" for="margin">${esc(U.margin)} <output id="margin-out" for="margin">${DEFAULTS.margin}</output></label>
        <input id="margin" class="qr-range" type="range" min="0" max="8" step="1" value="${DEFAULTS.margin}">
        <p class="qr-hint">${esc(U.marginHint)}</p>
      </div>
    </details>
    <p class="qr-local">${esc(U.localNote)}</p>

    <div id="result" class="qr-result" hidden>
      <div class="qr-card qr-done">
        <h2 class="qr-h2">${esc(T.result.doneTitle)}</h2>
        <p class="qr-done-text">${esc(T.result.doneText)}</p>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['qr-core.js', 'qr.js'] })}
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
<body class="qr-body">
${G.topBar(lang, rel)}
<main class="qr-shell">
  <div class="qr-doc">
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

if (require.main === module) main();
module.exports = { DEFAULTS, SIZES, ECC_PCT, TYPE_ICONS };
