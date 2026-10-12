#!/usr/bin/env node
/**
 * 비밀번호 생성기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 종류·길이·글자 옵션 / 패스프레이즈 옵션 → 만들기) → 만든 뒤 결과(비밀번호·강도·깨는 시간) + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 생성·엔트로피는 password-core.js, 화면 동작은 password.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱(randnum·qr 처럼) — 첫 화면(옵션·만들기 버튼) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 만든 뒤 나타나는 결과(#result) 안에 결과 카드 → <div data-mg-end="password">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *   - 만든 비밀번호는 HTML·주소·공유 문구 어디에도 들어가지 않는다(화면에서 textContent 로만).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'password-core.js'));

const SITE_ID = 'password';
const SITE_ROOT = 'https://password.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const MONO = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;800&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
// 글자 종류 스위치 옆 견본 (언어 무관)
const SAMPLE = { upper: 'ABC', lower: 'abc', digits: '123', symbols: '#$&' };

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
<meta name="theme-color" content="#0d1f1a">
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

function sw(id, label, checked, extra) {
  return `<label class="pw-switch"><input type="checkbox" id="${id}" role="switch"${checked ? ' checked' : ''}><span class="pw-switch-ui" aria-hidden="true"></span><span class="pw-switch-text">${label}${extra || ''}</span></label>`;
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
  const D = CORE.DEFAULTS;
  // 브라우저(password.js)에서 쓰는 문구
  const runtime = { lang, ui: U, result: T.result };
  const types = CORE.CLASS_ORDER.map((k) => sw(`t-${k}`, esc(U[k]), D[k], `<span class="pw-sample" aria-hidden="true">${esc(SAMPLE[k])}</span>`)).join('\n          ');
  const seps = CORE.SEP_ORDER.map((k) => `<button type="button" class="pw-chip" role="radio" data-sep="${k}" aria-checked="${k === D.sep}" aria-label="${esc(U.sep[k])}"><span class="pw-sep-glyph" aria-hidden="true">${k === 'space' ? '␣' : esc(CORE.SEPARATORS[k])}</span><span class="pw-sep-name">${esc(U.sep[k])}</span></button>`).join('\n          ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="pw-body">
${G.topBar(lang, rel)}

<main class="pw-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 종류·옵션 → 만들기 → (만든 뒤) 결과 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-pw" class="pw-screen">
    <h1 class="pw-h1"><span class="pw-kicker">${esc(H.h1Kicker)}</span><span class="pw-h1-main">${H.h1Html}</span></h1>
    <p class="pw-hook">${esc(H.hook)}</p>

    <form id="pw-form" class="pw-card pw-settings" novalidate autocomplete="off">
      <p class="pw-label" id="mode-label">${esc(U.modeLabel)}</p>
      <div class="pw-seg" role="radiogroup" aria-labelledby="mode-label">
        <button type="button" class="pw-seg-btn" role="radio" data-mode="password" aria-checked="${D.mode === 'password'}">${esc(U.modePassword)}</button>
        <button type="button" class="pw-seg-btn" role="radio" data-mode="passphrase" aria-checked="${D.mode === 'passphrase'}">${esc(U.modePassphrase)}</button>
      </div>

      <div id="opt-password" class="pw-opts">
        <div class="pw-slider-row">
          <label class="pw-label" for="length">${esc(U.lengthLabel)}</label>
          <output id="length-out" class="pw-out" for="length">${D.length}</output>
        </div>
        <input id="length" class="pw-range" type="range" min="${CORE.LEN_MIN}" max="${CORE.LEN_MAX}" step="1" value="${D.length}">
        <p class="pw-label" id="types-label">${esc(U.typesLabel)}</p>
        <div class="pw-switches" role="group" aria-labelledby="types-label">
          ${types}
        </div>
        ${sw('similar', esc(U.similar), D.similar)}
        <p class="pw-hint" id="similar-hint">${esc(U.similarHint)}</p>
      </div>

      <div id="opt-passphrase" class="pw-opts" hidden>
        <div class="pw-slider-row">
          <label class="pw-label" for="words">${esc(U.wordsLabel)}</label>
          <output id="words-out" class="pw-out" for="words">${D.words}</output>
        </div>
        <input id="words" class="pw-range" type="range" min="${CORE.WORDS_MIN}" max="${CORE.WORDS_MAX}" step="1" value="${D.words}">
        <p class="pw-label" id="sep-label">${esc(U.sepLabel)}</p>
        <div class="pw-chips" role="radiogroup" aria-labelledby="sep-label">
          ${seps}
        </div>
        <div class="pw-switches">
          ${sw('capitalize', esc(U.capitalize), D.capitalize)}
          ${sw('number', esc(U.addNumber), D.number)}
        </div>
        <p class="pw-hint">${esc(U.wordsHint)}</p>
      </div>

      <p class="pw-label" id="count-label">${esc(U.countLabel)}</p>
      <div class="pw-seg pw-seg-count" role="radiogroup" aria-labelledby="count-label">
        <button type="button" class="pw-seg-btn" role="radio" data-count="1" aria-checked="${D.count === 1}">${esc(U.countOne)}</button>
        <button type="button" class="pw-seg-btn" role="radio" data-count="5" aria-checked="${D.count === 5}">${esc(U.countFive)}</button>
      </div>
    </form>

    <p id="error" class="pw-error" role="alert" hidden></p>
    <button type="button" id="gen-btn" class="pw-btn pw-btn-primary">${esc(U.generate)}</button>
    <p class="pw-local">${esc(U.local)}</p>

    <div id="result" class="pw-result" hidden>
      <div class="pw-card pw-result-card" id="result-card">
        <h2 class="pw-h2" id="res-title">${esc(T.result.heading)}</h2>
        <ol id="pw-list" class="pw-list" aria-labelledby="res-title"></ol>
        <div class="pw-meter" id="meter">
          <div class="pw-meter-head">
            <span class="pw-meter-label">${esc(T.result.strengthLabel)}</span>
            <strong id="meter-word" class="pw-meter-word"></strong>
          </div>
          <div class="pw-bars" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
          <p id="meter-bits" class="pw-bits"></p>
          <p id="meter-crack" class="pw-crack"></p>
          <p class="pw-crack-note">${esc(T.result.crackNote)}</p>
          <p id="meter-tip" class="pw-tip"></p>
        </div>
        <p id="live" class="visually-hidden" aria-live="polite"></p>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['password-core.js', 'password.js'] })}
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
<body class="pw-body">
${G.topBar(lang, rel)}
<main class="pw-shell">
  <div class="pw-doc">
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
