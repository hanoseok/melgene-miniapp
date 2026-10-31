#!/usr/bin/env node
/**
 * 크리스마스 카드 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 편집기(테마·인사말·장식·받는 사람·보내는 사람·메시지 + canvas 미리보기)
 *                                     → 끝 화면(카드 이미지 + 저장·텍스트 복사 + 공통 끝 화면). 받은 링크(#d=)는 봉투 열기 화면 → 끝 화면.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 테마·검증·공유 인코딩은 xmascard-core.js, 화면 동작·canvas 그림은 xmascard.js.
 * 공유 링크(#d=...)는 언어 없는 주소라 받는 사람은 자기 언어로 본다(인사말도 받는 사람 언어로 그려진다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·트리 그림·h1(현지 검색어)·훅·시작 버튼·맨 아래 mg-ad-start 1개. 입력 칸·SEO 글·FAQ 없음.
 *   - 편집기 화면에 mg-ad 1자리(편집기 아래). 끝 화면 = 카드(결과) → <div data-mg-end="xmascard">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'xmascard';
const SITE_ROOT = 'https://xmascard.example.com';
const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'xmascard-core.js'));
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
// 시작 + 편집기 + 봉투 + 끝 화면 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const E = T.editor;
  const R = T.result;
  const O = T.open;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const g0 = CORE.greetingIndex(E.defaultGreeting);
  const themes = CORE.THEMES.map((th, i) => `<button type="button" class="xc-chip xc-theme${i === 0 ? ' is-on' : ''}" role="radio" data-t="${i}" aria-checked="${i === 0}"><span class="xc-chip-emoji" aria-hidden="true">${th.emoji}</span><span class="xc-chip-name">${esc(E.themes[th.id])}</span></button>`).join('\n      ');
  const greetings = CORE.GREETINGS.map((id, i) => `<button type="button" class="xc-greet${i === g0 ? ' is-on' : ''}" role="radio" data-g="${i}" aria-checked="${i === g0}">${esc(T.card.greetings[id])}</button>`).join('\n      ');
  const d0 = CORE.defaults(E.defaultGreeting).o;
  const decos = CORE.DECOS.map((d) => `<button type="button" class="xc-deco${d0 & d.bit ? ' is-on' : ''}" data-bit="${d.bit}" aria-pressed="${!!(d0 & d.bit)}"><span aria-hidden="true">${d.emoji}</span> ${esc(E.decos[d.id])}</button>`).join('\n      ');
  const F = E.fields;
  const lim = CORE.LIMITS;
  // 브라우저(xmascard.js)에서 쓰는 문구
  const runtime = { lang, editor: E, card: T.card, open: O, result: R, fonts: { script: T.fonts.script, scriptWeight: T.fonts.scriptWeight } };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="xc-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="xc-shell">
  <!-- 시작 화면: 티징만 (배지·그림·h1·훅·시작 버튼·맨 아래 광고 1개) — 입력 칸·FAQ 없음 -->
  <section id="screen-start" class="xc-screen xc-start">
    <p class="xc-badge">${esc(S.badge)}</p>
    <div class="xc-hero" aria-hidden="true"><span class="xc-hero-tree">🎄</span><span class="xc-hero-star">⭐</span><span class="xc-hero-gift">🎁</span><span class="xc-hero-snow">❄️</span><span class="xc-hero-card">💌</span></div>
    <h1 class="xc-h1"><span class="xc-kicker">${esc(S.h1Kicker)}</span><span class="xc-h1-main">${S.h1Html}</span></h1>
    <p class="xc-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="xc-btn xc-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 편집기 (진행 중 화면의 광고 1자리: 편집기 아래) -->
  <section id="screen-edit" class="xc-screen xc-edit" hidden>
    <h2 class="xc-edit-title">${esc(E.title)}</h2>
    <div id="themes" class="xc-chips" role="radiogroup" aria-label="${esc(E.themesAria)}">
      ${themes}
    </div>
    <div class="xc-preview"><canvas id="preview-canvas" class="xc-canvas" width="${CORE.W}" height="${CORE.H}" role="img" aria-label="${esc(E.previewAria)}"></canvas></div>
    <p class="xc-label" id="greet-label">${esc(E.greetingsLabel)}</p>
    <div id="greetings" class="xc-greets" role="radiogroup" aria-labelledby="greet-label">
      ${greetings}
    </div>
    <p class="xc-label" id="deco-label">${esc(E.decoLabel)}</p>
    <div id="decos" class="xc-decos" role="group" aria-labelledby="deco-label">
      ${decos}
    </div>
    <div class="xc-row">
      <label class="xc-field" for="f-to"><span class="xc-label">${esc(F.to.label)}</span>
        <input id="f-to" class="xc-input" type="text" maxlength="${lim.to * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(F.to.placeholder)}">
      </label>
      <label class="xc-field" for="f-from"><span class="xc-label">${esc(F.from.label)}</span>
        <input id="f-from" class="xc-input" type="text" maxlength="${lim.fr * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(F.from.placeholder)}">
      </label>
    </div>
    <div class="xc-field">
      <div class="xc-msg-head"><label class="xc-label" for="f-msg">${esc(F.message.label)}</label><button id="idea-btn" class="xc-idea" type="button">${esc(E.ideas)}</button></div>
      <textarea id="f-msg" class="xc-input xc-textarea" rows="3" maxlength="${lim.m * 3}" autocomplete="off" spellcheck="false" placeholder="${esc(F.message.placeholder)}"></textarea>
      <p id="msg-count" class="xc-count" aria-live="polite">0/${lim.m}</p>
    </div>
    <button id="done-btn" class="xc-btn xc-btn-primary" type="button">${esc(E.done)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 받은 링크: 봉투 열기 (start/done 안 셈) -->
  <section id="screen-open" class="xc-screen xc-open" hidden>
    <p class="xc-open-eyebrow">${esc(O.eyebrow)}</p>
    <p id="open-from" class="xc-open-from"></p>
    <button id="open-btn" class="xc-env" type="button" aria-label="${esc(O.open)}">
      <span class="xc-env-back" aria-hidden="true"></span>
      <span class="xc-env-letter" aria-hidden="true">🎄</span>
      <span class="xc-env-front" aria-hidden="true"></span>
      <span class="xc-env-flap" aria-hidden="true"></span>
      <span class="xc-env-seal" aria-hidden="true">❤️</span>
    </button>
    <button id="open-cta" class="xc-btn xc-btn-primary" type="button">${esc(O.open)}</button>
  </section>

  <!-- 끝 화면: 완성 카드(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="xc-screen xc-end" hidden>
    <article class="xc-card" aria-labelledby="end-title">
      <p id="end-eyebrow" class="xc-eyebrow"></p>
      <h2 id="end-title" class="xc-sr"></h2>
      <canvas id="end-canvas" class="xc-canvas xc-end-canvas" width="${CORE.W}" height="${CORE.H}" role="img"></canvas>
      <div class="xc-end-actions">
        <button id="save-btn" class="xc-btn xc-btn-primary xc-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="copy-btn" class="xc-btn xc-btn-soft xc-btn-sm" type="button"><span aria-hidden="true">📋</span> ${esc(R.copyText)}</button>
        <button id="edit-btn" class="xc-btn xc-btn-soft xc-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
      <p id="save-status" class="xc-save-status" aria-live="polite"></p>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['xmascard-core.js', 'xmascard.js'] })}
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
<body class="xc-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="xc-shell">
  <div class="xc-doc">
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
