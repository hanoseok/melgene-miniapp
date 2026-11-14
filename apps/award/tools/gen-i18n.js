#!/usr/bin/env node
/**
 * 상장 만들기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 편집기(디자인 4·상 이름(예시 칩)·받는 사람·수상 이유(🎲)·날짜·주는 사람·도장 3 + canvas 미리보기)
 *                                     → 끝 화면(상장 이미지 + PNG 저장 + 공통 끝 화면). 받은 링크(#d=)는 상장 수여식(두루마리 펼치기) → 끝 화면.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 디자인·검증·공유 인코딩은 award-core.js, 화면 동작·canvas 그림은 award.js.
 * 공유 링크(#d=...)는 언어 없는 주소라 받는 사람은 자기 언어로 본다(상장 머리글·날짜 모양도 받는 사람 언어).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·그림·h1(현지 검색어)·훅·시작 버튼·맨 아래 mg-ad-start 1개. 입력 칸·SEO 글·FAQ 없음.
 *   - 편집기 화면에 mg-ad 1자리(편집기 아래). 끝 화면 = 상장(결과) → <div data-mg-end="award">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'award';
const SITE_ROOT = 'https://award.example.com';
const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'award-core.js'));
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
    `--font-serif: ${clean(F.serif)}, var(--font-display)`,
    `--serif-weight: ${Number(F.serifWeight) || 700}`,
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
<meta name="theme-color" content="#1f2a44">
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
// 시작 + 편집기 + 수여식 + 끝 화면 (index.html)
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
  const d0 = CORE.defaults();
  const themes = CORE.THEMES.map((th, i) => `<button type="button" class="aw-chip aw-theme${i === d0.t ? ' is-on' : ''}" role="radio" data-t="${i}" aria-checked="${i === d0.t}"><span class="aw-chip-emoji" aria-hidden="true">${th.emoji}</span><span class="aw-chip-name">${esc(E.themes[th.id])}</span></button>`).join('\n      ');
  const SEAL_EMOJI = { none: '🚫', red: '🔴', gold: '🏅' };
  const seals = CORE.SEALS.map((id, i) => `<button type="button" class="aw-seal${i === d0.s ? ' is-on' : ''}" role="radio" data-s="${i}" aria-checked="${i === d0.s}"><span aria-hidden="true">${SEAL_EMOJI[id]}</span> ${esc(E.seals[id])}</button>`).join('\n      ');
  const examples = E.titleExamples.map((v) => `<button type="button" class="aw-ex">${esc(v)}</button>`).join('\n        ');
  const F = E.fields;
  const lim = CORE.LIMITS;
  // 브라우저(award.js)에서 쓰는 문구
  const runtime = { lang, editor: { counter: E.counter, reasons: E.reasons }, card: T.card, open: O, result: R, fonts: { serif: T.fonts.serif, serifWeight: T.fonts.serifWeight } };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="aw-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="aw-shell">
  <!-- 시작 화면: 티징만 (배지·그림·h1·훅·시작 버튼·맨 아래 광고 1개) — 입력 칸·FAQ 없음 -->
  <section id="screen-start" class="aw-screen aw-start">
    <p class="aw-badge">${esc(S.badge)}</p>
    <div class="aw-hero" aria-hidden="true"><span class="aw-hero-paper"><span class="aw-hero-line"></span><span class="aw-hero-line aw-short"></span><span class="aw-hero-line"></span></span><span class="aw-hero-main">🏆</span><span class="aw-hero-star">✨</span><span class="aw-hero-medal">🏅</span><span class="aw-hero-pop">🎉</span><span class="aw-hero-clap">👏</span></div>
    <h1 class="aw-h1"><span class="aw-kicker">${esc(S.h1Kicker)}</span><span class="aw-h1-main">${S.h1Html}</span></h1>
    <p class="aw-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="aw-btn aw-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 편집기 (진행 중 화면의 광고 1자리: 편집기 아래) -->
  <section id="screen-edit" class="aw-screen aw-edit" hidden>
    <h2 class="aw-edit-title">${esc(E.title)}</h2>
    <div id="themes" class="aw-chips" role="radiogroup" aria-label="${esc(E.themesAria)}">
      ${themes}
    </div>
    <div class="aw-preview"><canvas id="preview-canvas" class="aw-canvas" width="${CORE.W}" height="${CORE.H}" role="img" aria-label="${esc(E.previewAria)}"></canvas></div>
    <div class="aw-field">
      <label class="aw-label" for="f-title">${esc(F.title.label)}</label>
      <input id="f-title" class="aw-input" type="text" maxlength="${lim.ti * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(F.title.placeholder)}">
      <div id="examples" class="aw-exs" role="group" aria-label="${esc(E.examplesAria)}">
        ${examples}
      </div>
    </div>
    <label class="aw-field" for="f-to"><span class="aw-label">${esc(F.to.label)}</span>
      <input id="f-to" class="aw-input" type="text" maxlength="${lim.to * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(F.to.placeholder)}">
    </label>
    <div class="aw-field">
      <div class="aw-msg-head"><label class="aw-label" for="f-msg">${esc(F.reason.label)}</label><button id="dice-btn" class="aw-dice" type="button">${esc(E.dice)}</button></div>
      <textarea id="f-msg" class="aw-input aw-textarea" rows="3" maxlength="${lim.m * 3}" autocomplete="off" spellcheck="false" placeholder="${esc(F.reason.placeholder)}"></textarea>
      <p id="msg-count" class="aw-count" aria-live="polite">0/${lim.m}</p>
    </div>
    <div class="aw-row">
      <label class="aw-field" for="f-date"><span class="aw-label">${esc(F.date.label)}</span>
        <input id="f-date" class="aw-input aw-date" type="date" min="2000-01-01" max="2099-12-31">
      </label>
      <label class="aw-field" for="f-issuer"><span class="aw-label">${esc(F.issuer.label)}</span>
        <input id="f-issuer" class="aw-input" type="text" maxlength="${lim.is * 3}" autocomplete="off" enterkeyhint="done" spellcheck="false" placeholder="${esc(F.issuer.placeholder)}">
      </label>
    </div>
    <p class="aw-label" id="seal-label">${esc(E.sealLabel)}</p>
    <div id="seals" class="aw-seals" role="radiogroup" aria-labelledby="seal-label">
      ${seals}
    </div>
    <button id="done-btn" class="aw-btn aw-btn-primary" type="button">${esc(E.done)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 받은 링크: 상장 수여식 (두루마리를 눌러 펼친다, start/done 안 셈) -->
  <section id="screen-open" class="aw-screen aw-open" hidden>
    <p class="aw-open-eyebrow">${esc(O.eyebrow)}</p>
    <p id="open-for" class="aw-open-for"></p>
    <button id="open-btn" class="aw-scroll" type="button" aria-label="${esc(O.open)}">
      <span class="aw-scroll-rod aw-rod-top" aria-hidden="true"></span>
      <span class="aw-scroll-paper" aria-hidden="true"><span class="aw-scroll-title">🏆</span><span class="aw-scroll-line"></span><span class="aw-scroll-line aw-short"></span><span class="aw-scroll-line"></span></span>
      <span class="aw-scroll-rod aw-rod-bottom" aria-hidden="true"></span>
      <span class="aw-scroll-ribbon" aria-hidden="true"></span>
    </button>
    <p class="aw-open-hint">${esc(O.hint)}</p>
    <button id="open-cta" class="aw-btn aw-btn-primary" type="button">${esc(O.open)}</button>
  </section>

  <!-- 끝 화면: 완성 상장(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="aw-screen aw-end" hidden>
    <article class="aw-card" aria-labelledby="end-title">
      <p id="end-eyebrow" class="aw-eyebrow"></p>
      <h2 id="end-title" class="aw-sr"></h2>
      <canvas id="end-canvas" class="aw-canvas aw-end-canvas" width="${CORE.W}" height="${CORE.H}" role="img"></canvas>
      <div class="aw-end-actions">
        <button id="save-btn" class="aw-btn aw-btn-primary aw-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="edit-btn" class="aw-btn aw-btn-soft aw-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
      <p id="save-status" class="aw-save-status" aria-live="polite"></p>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['award-core.js', 'award.js'] })}
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
<body class="aw-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="aw-shell">
  <div class="aw-doc">
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
