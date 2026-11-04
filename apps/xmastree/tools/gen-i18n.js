#!/usr/bin/env node
/**
 * 크리스마스 트리 꾸미기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 꾸미기(canvas 트리 + 장식 팔레트·되돌리기·모두 지우기·자동 꾸미기 + 트리 모양·배경·꼭대기·눈·전구 + 이름·메시지)
 *                                     → 끝 화면(트리 이미지 + 저장·계속 꾸미기 + 공통 끝 화면). 받은 링크(#d=)는 바로 끝 화면(나도 꾸미기).
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 모양·검증·공유 인코딩은 xmastree-core.js, 화면 동작·canvas 그림은 xmastree.js.
 * 공유 링크(#d=...)는 언어 없는 주소라 받는 사람은 자기 언어로 본다.
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·이모지 그림·h1(현지 검색어)·훅·시작 버튼·맨 아래 mg-ad-start 1개. 도구·SEO 글·FAQ 없음.
 *   - 꾸미기 화면에 mg-ad 1자리(완성 버튼 아래). 끝 화면 = 트리 그림(결과) → <div data-mg-end="xmastree">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'xmastree';
const SITE_ROOT = 'https://xmastree.example.com';
const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'xmastree-core.js'));
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
    `--font-script: ${clean(F.script)}, var(--font-display)`,
    `--script-weight: ${Number(F.scriptWeight) || 400}`,
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
<meta name="theme-color" content="#0b2a22">
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
// 시작 + 꾸미기 + 끝 화면 (index.html)
// ---------------------------------------------------------------
function chips(list, cls, attr, names, on) {
  return list.map((x, i) => `<button type="button" class="xt-chip ${cls}${i === on ? ' is-on' : ''}" role="radio" ${attr}="${i}" aria-checked="${i === on}"><span class="xt-chip-emoji" aria-hidden="true">${x.emoji}</span><span class="xt-chip-name">${esc(names[x.id])}</span></button>`).join('\n      ');
}
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const E = T.editor;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const d0 = CORE.defaults();
  const kinds = CORE.KINDS.map((k, i) => `<button type="button" class="xt-kind${i === 0 ? ' is-on' : ''}" role="radio" data-k="${i}" aria-checked="${i === 0}" aria-label="${esc(E.kinds[k.id])}" title="${esc(E.kinds[k.id])}"><canvas class="xt-kind-ic" width="96" height="96" aria-hidden="true"></canvas></button>`).join('\n        ');
  const erase = `<button type="button" class="xt-kind xt-erase" role="radio" data-k="-1" aria-checked="false" aria-label="${esc(E.kinds.erase)}" title="${esc(E.kinds.erase)}"><span aria-hidden="true">🧽</span></button>`;
  const flags = [['snow', CORE.FLAG.snow, '❄️'], ['lights', CORE.FLAG.lights, '💡']].map(([id, bit, em]) => `<button type="button" class="xt-flag${d0.f & bit ? ' is-on' : ''}" data-bit="${bit}" aria-pressed="${!!(d0.f & bit)}"><span aria-hidden="true">${em}</span> ${esc(E[id])}</button>`).join('\n      ');
  const F = E.fields;
  const lim = CORE.LIMITS;
  const runtime = { lang, editor: E, card: T.card, result: R, fonts: { script: T.fonts.script, scriptWeight: T.fonts.scriptWeight } };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="xt-body">
${G.topBar(lang, rel)}

<main class="xt-shell">
  <!-- 시작 화면: 티징만 (배지·그림·h1·훅·시작 버튼·맨 아래 광고 1개) — 도구·FAQ 없음 -->
  <section id="screen-start" class="xt-screen xt-start">
    <p class="xt-badge">${esc(S.badge)}</p>
    <div class="xt-hero" aria-hidden="true"><span class="xt-hero-tree">🎄</span><span class="xt-hero-star">⭐</span><span class="xt-hero-ball">🔴</span><span class="xt-hero-gift">🎁</span><span class="xt-hero-snow">❄️</span><span class="xt-hero-bell">🔔</span></div>
    <h1 class="xt-h1"><span class="xt-kicker">${esc(S.h1Kicker)}</span><span class="xt-h1-main">${S.h1Html}</span></h1>
    <p class="xt-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="xt-btn xt-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 꾸미기 (진행 중 화면의 광고 1자리: 완성 버튼 아래) -->
  <section id="screen-edit" class="xt-screen xt-edit" hidden>
    <h2 class="xt-edit-title">${esc(E.title)}</h2>
    <div class="xt-stage"><canvas id="tree-canvas" class="xt-canvas xt-tree-canvas" width="${CORE.W}" height="${CORE.H}" role="img" aria-label="${esc(E.canvasAria)}"></canvas></div>
    <p class="xt-hint">${esc(E.hint)}</p>
    <p class="xt-label" id="palette-label">${esc(E.paletteLabel)} <span id="orn-count" class="xt-orn-count" aria-live="polite"></span></p>
    <div id="palette" class="xt-palette" role="radiogroup" aria-labelledby="palette-label">
        ${kinds}
        ${erase}
    </div>
    <div class="xt-tools">
      <button id="undo-btn" class="xt-tool" type="button" disabled><span aria-hidden="true">↶</span> ${esc(E.undo)}</button>
      <button id="clear-btn" class="xt-tool" type="button"><span aria-hidden="true">🗑️</span> ${esc(E.clear)}</button>
      <button id="auto-btn" class="xt-tool" type="button"><span aria-hidden="true">✨</span> ${esc(E.auto)}</button>
    </div>
    <p id="edit-status" class="xt-status" aria-live="polite"></p>
    <p class="xt-label" id="style-label">${esc(E.styleLabel)}</p>
    <div id="styles" class="xt-chips" role="radiogroup" aria-labelledby="style-label">
      ${chips(CORE.STYLES, 'xt-style', 'data-s', E.styles, d0.s)}
    </div>
    <p class="xt-label" id="bg-label">${esc(E.bgLabel)}</p>
    <div id="bgs" class="xt-chips" role="radiogroup" aria-labelledby="bg-label">
      ${chips(CORE.BGS, 'xt-bg', 'data-b', E.bgs, d0.b)}
    </div>
    <p class="xt-label" id="topper-label">${esc(E.topperLabel)}</p>
    <div id="toppers" class="xt-chips" role="radiogroup" aria-labelledby="topper-label">
      ${chips(CORE.TOPPERS, 'xt-topper', 'data-t', E.toppers, d0.t)}
    </div>
    <p class="xt-label" id="extras-label">${esc(E.extrasLabel)}</p>
    <div id="flags" class="xt-flags" role="group" aria-labelledby="extras-label">
      ${flags}
    </div>
    <label class="xt-field" for="f-name"><span class="xt-label">${esc(F.name.label)}</span>
      <input id="f-name" class="xt-input" type="text" maxlength="${lim.n * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(F.name.placeholder)}">
    </label>
    <div class="xt-field">
      <div class="xt-msg-head"><label class="xt-label" for="f-msg">${esc(F.message.label)}</label><button id="idea-btn" class="xt-idea" type="button">${esc(E.ideas)}</button></div>
      <input id="f-msg" class="xt-input" type="text" maxlength="${lim.m * 3}" autocomplete="off" enterkeyhint="done" spellcheck="false" placeholder="${esc(F.message.placeholder)}">
      <p id="msg-count" class="xt-count" aria-live="polite">0/${lim.m}</p>
    </div>
    <button id="done-btn" class="xt-btn xt-btn-primary" type="button">${esc(E.done)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 끝 화면: 완성 트리(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="xt-screen xt-end" hidden>
    <article class="xt-card" aria-labelledby="end-title">
      <p id="end-eyebrow" class="xt-eyebrow"></p>
      <h2 id="end-title" class="xt-sr"></h2>
      <canvas id="end-canvas" class="xt-canvas xt-end-canvas" width="${CORE.W}" height="${CORE.H}" role="img"></canvas>
      <div class="xt-end-actions">
        <button id="save-btn" class="xt-btn xt-btn-primary xt-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="edit-btn" class="xt-btn xt-btn-soft xt-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
      <p id="save-status" class="xt-status" aria-live="polite"></p>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['xmastree-core.js', 'xmastree.js'] })}
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

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang) })}
<body class="xt-body">
${G.topBar(lang, rel)}
<main class="xt-shell">
  <div class="xt-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </div>

  <footer class="site-footer">
    <a href="./">${esc(P.back)}</a>
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
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy) = HTML ${n}개`);
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
  console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 포함)`);
}

main();
