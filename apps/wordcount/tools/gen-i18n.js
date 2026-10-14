#!/usr/bin/env node
/**
 * 글자수 세기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 글 입력 + 실시간 숫자 → 목표 글자수 → 자세한 숫자 → 키워드 → "결과 보기") → 결과 요약 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 세는 로직은 wordcount-core.js, 화면 동작은 wordcount.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱 — 첫 화면(#screen-wc) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - "결과 보기" 뒤 나타나는 #result 안에 요약 카드 → <div data-mg-end="wordcount">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *   - 사용자가 쓴 글은 HTML·주소·공유 문구 어디에도 들어가지 않는다(이 기기 localStorage 초안만).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'wordcount-core.js'));

const SITE_ID = 'wordcount';
const SITE_ROOT = 'https://wordcount.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const MONO = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&display=swap';
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
<meta name="theme-color" content="#1f3a5f">
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

// 자세한 숫자 칸 (id = st-<key>)
const STAT_KEYS = ['chars', 'noSpaces', 'words', 'sentences', 'paragraphs', 'lines', 'reading', 'speaking'];

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
  // 브라우저(wordcount.js)에서 쓰는 문구
  const runtime = { lang, ui: U, result: T.result };
  const bar = ['chars', 'noSpaces', 'words', 'bytes'].map((k) => `<div class="wc-bar-cell"><strong id="bar-${k}" class="wc-bar-num">0</strong><span class="wc-bar-label">${esc(U.bar[k])}</span></div>`).join('\n        ');
  const presets = CORE.LIMIT_PRESETS.map((n) => `<button type="button" class="wc-chip" role="radio" data-limit="${n}" aria-checked="${n === D.limit}">${n ? esc(G.fmt(U.limitChip, { n: n.toLocaleString(lang === 'pt' ? 'pt-BR' : lang) })) : esc(U.limitOff)}</button>`).join('\n          ');
  const stats = STAT_KEYS.map((k) => `<div class="wc-stat" data-stat="${k}"><span class="wc-stat-label">${esc(U.stats[k])}</span><strong id="st-${k}" class="wc-stat-num">0</strong></div>`).join('\n        ');
  const modes = CORE.BYTE_MODES.map((m) => `<button type="button" class="wc-seg-btn" role="radio" data-bytemode="${m}" aria-checked="${m === D.byteMode}">${esc(U.byteMode[m])}</button>`).join('\n            ');
  const tool = (id, label, extra) => `<button type="button" id="${id}" class="wc-tool"${extra || ''}>${esc(label)}</button>`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="wc-body">
${G.topBar(lang, rel)}

<main class="wc-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 글 입력·실시간 숫자 → 목표 → 자세한 숫자 → 키워드 → 결과 보기 → (누른 뒤) 요약 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-wc" class="wc-screen">
    <h1 class="wc-h1"><span class="wc-kicker">${esc(H.h1Kicker)}</span><span class="wc-h1-main">${H.h1Html}</span></h1>
    <p class="wc-hook">${esc(H.hook)}</p>

    <div class="wc-card wc-editor">
      <div class="wc-bar" id="bar" aria-hidden="true">
        ${bar}
      </div>
      <label class="visually-hidden" for="text">${esc(U.editorLabel)}</label>
      <textarea id="text" class="wc-text" rows="10" placeholder="${esc(U.placeholder)}" spellcheck="true" autocomplete="off" autocapitalize="sentences"></textarea>
      <div class="wc-limitbar" id="limitbar" hidden>
        <div class="wc-progress" aria-hidden="true"><span id="limit-fill"></span></div>
        <p id="limit-text" class="wc-limit-text"></p>
      </div>
      <div class="wc-tools" role="group" aria-label="${esc(U.toolsLabel)}">
        ${tool('btn-copy', U.tools.copy)}
        ${tool('btn-tidy', U.tools.tidy)}
        ${tool('btn-join', U.tools.join)}
        ${tool('btn-clear', U.tools.clear)}
        ${tool('btn-undo', U.tools.undo, ' hidden')}
      </div>
      <p class="wc-saved" id="saved-note">${esc(U.saved)}</p>
    </div>

    <div class="wc-card wc-limit">
      <p class="wc-label" id="limit-label">${esc(U.limitLabel)}</p>
      <div class="wc-chips" role="radiogroup" aria-labelledby="limit-label">
          ${presets}
      </div>
      <div class="wc-limit-row">
        <label class="wc-custom"><span class="wc-custom-label">${esc(U.limitCustom)}</span><input id="limit-custom" class="wc-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="7" placeholder="${esc(U.limitCustomPh)}" aria-label="${esc(U.limitCustomAria)}"></label>
        <label class="wc-switch"><input type="checkbox" id="limit-spaces" role="switch"${D.limitSpaces ? ' checked' : ''}><span class="wc-switch-ui" aria-hidden="true"></span><span class="wc-switch-text">${esc(U.limitSpaces)}</span></label>
      </div>
    </div>

    <div class="wc-card wc-stats-card">
      <h2 class="wc-h2">${esc(U.statsLabel)}</h2>
      <div class="wc-stats">
        ${stats}
      </div>
      <div class="wc-bytes">
        <div class="wc-bytes-head"><span class="wc-stat-label" id="bytes-label">${esc(U.stats.bytes)}</span><strong id="st-bytes" class="wc-stat-num">0</strong></div>
        <div class="wc-seg" role="radiogroup" aria-labelledby="bytes-label">
            ${modes}
        </div>
        <p id="byte-hint" class="wc-hint">${esc(U.byteHint[D.byteMode])}</p>
      </div>
      <p class="wc-hint">${esc(U.timeNote)}</p>
    </div>

    <details class="wc-card wc-kw" id="kw">
      <summary class="wc-kw-sum">${esc(U.kwLabel)}</summary>
      <ol id="kw-list" class="wc-kw-list"></ol>
      <p id="kw-empty" class="wc-hint">${esc(U.kwEmpty)}</p>
    </details>

    <p id="error" class="wc-error" role="alert" hidden></p>
    <button type="button" id="finish-btn" class="wc-btn wc-btn-primary">${esc(U.finish)}</button>
    <p class="wc-local">${esc(U.local)}</p>
    <p id="live" class="visually-hidden" aria-live="polite"></p>

    <div id="result" class="wc-result" hidden>
      <div class="wc-card wc-result-card" id="result-card">
        <h2 class="wc-h2" id="res-title">${esc(T.result.heading)}</h2>
        <div class="wc-sum-big">
          <div><strong id="sum-chars" class="wc-sum-num">0</strong><span class="wc-sum-label">${esc(U.stats.chars)}</span></div>
          <div><strong id="sum-noSpaces" class="wc-sum-num">0</strong><span class="wc-sum-label">${esc(U.stats.noSpaces)}</span></div>
        </div>
        <dl id="sum-list" class="wc-sum-list"></dl>
        <p id="sum-limit" class="wc-sum-limit" hidden></p>
        <button type="button" id="btn-copy-sum" class="wc-btn wc-btn-ghost">${esc(T.result.copySummary)}</button>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['wordcount-core.js', 'wordcount.js'] })}
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
<body class="wc-body">
${G.topBar(lang, rel)}
<main class="wc-shell">
  <div class="wc-doc">
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
