#!/usr/bin/env node
/**
 * 어드벤트 캘린더 만들기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 편집기(디자인 4·받는 사람·보내는 사람·24칸 메시지(🎲·빈 칸 채우기))
 *                                     → 끝 화면(링크·복사·이미지 저장·미리보기 + 공통 끝 화면). 미리보기(만든 사람만)는 따로 한 화면.
 *                                     받은 링크(#d=)는 끝 화면 자리에 캘린더(날짜가 된 문만 열림) → 공통 끝 화면.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 디자인·날짜·검증·공유 인코딩은 advent-core.js, 화면 동작·canvas 그림은 advent.js.
 * 공유 링크(#d=...)는 언어 없는 주소라 받는 사람은 자기 언어로 본다(날짜 모양도 받는 사람 언어).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·그림·h1(현지 검색어)·훅·시작 버튼·맨 아래 mg-ad-start 1개. 입력 칸·SEO 글·FAQ 없음.
 *   - 편집기 화면에 mg-ad 1자리(편집기 아래). 끝 화면 = 결과(링크 또는 받은 캘린더) → <div data-mg-end="advent">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'advent';
const SITE_ROOT = 'https://advent.example.com';
const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'advent-core.js'));
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));

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
<meta name="theme-color" content="#123a26">
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
// 시작 + 편집기 + 미리보기 + 끝 화면(링크 / 받은 캘린더) (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const E = T.editor;
  const C = T.calendar;
  const P = T.preview;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const themes = CORE.THEMES.map((th, i) => `<button type="button" class="ad-chip ad-theme${i === 0 ? ' is-on' : ''}" role="radio" data-t="${i}" aria-checked="${i === 0}"><span class="ad-chip-emoji" aria-hidden="true">${th.emoji}</span><span class="ad-chip-name">${esc(E.themes[th.id])}</span></button>`).join('\n      ');
  const days = [];
  for (let d = 1; d <= CORE.DAYS; d++) {
    days.push(`<div class="ad-day"><label class="ad-day-num" for="m-${d}" aria-label="${esc(fill(E.dayAria, { day: d }))}">${d}</label><input id="m-${d}" class="ad-input ad-day-input" type="text" data-day="${d}" maxlength="${CORE.LIMITS.m * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(E.placeholder)}"><button type="button" class="ad-dice" data-day="${d}" aria-label="${esc(fill(E.diceAria, { day: d }))}">🎲</button></div>`);
  }
  // 브라우저(advent.js)에서 쓰는 문구 (ideas 는 🎲 를 누를 때만 하나씩 쓴다 — 화면에 목록으로 보이지 않음)
  const runtime = { lang, editor: { counter: E.counter, needOne: E.needOne }, ideas: T.ideas, calendar: C, preview: P, result: R };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="ad-body">
${G.topBar(lang, rel, { suggest: true })}

<main class="ad-shell">
  <!-- 시작 화면: 티징만 (배지·그림·h1·훅·시작 버튼·맨 아래 광고 1개) — 입력 칸·FAQ 없음 -->
  <section id="screen-start" class="ad-screen ad-start">
    <p class="ad-badge">${esc(S.badge)}</p>
    <div class="ad-hero" aria-hidden="true"><span class="ad-hero-grid"><i>7</i><i>18</i><i>3</i><i class="is-open">🍪</i><i>12</i><i>24</i><i>9</i><i>1</i><i>15</i></span><span class="ad-hero-tree">🎄</span><span class="ad-hero-star">⭐</span><span class="ad-hero-gift">🎁</span><span class="ad-hero-snow">❄️</span></div>
    <h1 class="ad-h1"><span class="ad-kicker">${esc(S.h1Kicker)}</span><span class="ad-h1-main">${S.h1Html}</span></h1>
    <p class="ad-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="ad-btn ad-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 편집기 (진행 중 화면의 광고 1자리: 편집기 아래) -->
  <section id="screen-edit" class="ad-screen ad-edit" hidden>
    <h2 class="ad-edit-title">${esc(E.title)}</h2>
    <div id="themes" class="ad-chips" role="radiogroup" aria-label="${esc(E.themesAria)}">
      ${themes}
    </div>
    <div class="ad-row">
      <label class="ad-field" for="f-to"><span class="ad-label">${esc(E.fields.to.label)}</span>
        <input id="f-to" class="ad-input" type="text" maxlength="${CORE.LIMITS.to * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(E.fields.to.placeholder)}">
      </label>
      <label class="ad-field" for="f-from"><span class="ad-label">${esc(E.fields.from.label)}</span>
        <input id="f-from" class="ad-input" type="text" maxlength="${CORE.LIMITS.fr * 3}" autocomplete="off" enterkeyhint="next" spellcheck="false" placeholder="${esc(E.fields.from.placeholder)}">
      </label>
    </div>
    <p class="ad-label ad-days-label" id="days-label">${esc(E.daysLabel)}</p>
    <p class="ad-days-hint">${esc(E.daysHint)}</p>
    <div class="ad-days-bar"><p id="day-count" class="ad-count" aria-live="polite"></p><button id="fill-btn" class="ad-mini" type="button">${esc(E.fillAll)}</button></div>
    <div id="days" class="ad-days" role="group" aria-labelledby="days-label">
      ${days.join('\n      ')}
    </div>
    <p id="edit-status" class="ad-status" aria-live="polite"></p>
    <div class="ad-actions">
      <button id="preview-btn" class="ad-btn ad-btn-soft" type="button">${esc(E.preview)}</button>
      <button id="create-btn" class="ad-btn ad-btn-primary" type="button">${esc(E.create)}</button>
    </div>
    <div class="mg-ad"></div>
  </section>

  <!-- 미리보기: 만든 사람만 (편집기·끝 화면에서만 들어옴, 링크로는 열 수 없음) — 모든 문이 열림 -->
  <section id="screen-preview" class="ad-screen ad-preview" hidden>
    <p class="ad-preview-badge">${esc(P.badge)}</p>
    <p class="ad-preview-note">${esc(P.note)}</p>
    <div id="preview-wrap" class="ad-cal"><div id="preview-grid" class="ad-grid"></div></div>
    <button id="preview-back" class="ad-btn ad-btn-soft" type="button">${esc(P.back)}</button>
  </section>

  <!-- 끝 화면: 결과(만든 사람 = 링크 · 받은 사람 = 캘린더) → 공통 끝 화면 -->
  <section id="screen-end" class="ad-screen ad-end" hidden>
    <article id="end-mine" class="ad-card" aria-labelledby="end-eyebrow">
      <h2 id="end-eyebrow" class="ad-eyebrow">${esc(R.eyebrowMine)}</h2>
      <label class="ad-label" for="link-box">${esc(R.linkLabel)}</label>
      <div class="ad-link"><input id="link-box" class="ad-input ad-link-input" type="text" readonly><button id="copy-btn" class="ad-btn ad-btn-primary ad-btn-sm" type="button">${esc(R.copy)}</button></div>
      <p id="end-status" class="ad-status" aria-live="polite"></p>
      <p class="ad-note">${esc(R.note)}</p>
      <div class="ad-end-actions">
        <button id="save-btn" class="ad-btn ad-btn-soft ad-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="end-preview-btn" class="ad-btn ad-btn-soft ad-btn-sm" type="button"><span aria-hidden="true">👀</span> ${esc(R.preview)}</button>
        <button id="edit-btn" class="ad-btn ad-btn-soft ad-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
    </article>
    <article id="end-friend" class="ad-cal ad-friend" aria-labelledby="cal-for" hidden>
      <p class="ad-cal-heading">${esc(C.heading)}</p>
      <h2 id="cal-for" class="ad-cal-for"></h2>
      <p id="cal-from" class="ad-cal-from"></p>
      <p id="cal-status" class="ad-cal-status" aria-live="polite"></p>
      <div id="cal-grid" class="ad-grid"></div>
      <p class="ad-cal-hint">${esc(C.hint)}</p>
      <button id="make-own" class="ad-btn ad-btn-primary" type="button">${esc(C.makeOwn)}</button>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

  <!-- 문 안의 메시지 (textContent 로만 채운다) -->
  <div id="door-modal" class="ad-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
    <div class="ad-modal-card">
      <p id="modal-emoji" class="ad-modal-emoji" aria-hidden="true"></p>
      <p id="modal-title" class="ad-modal-title"></p>
      <p id="modal-msg" class="ad-modal-msg"></p>
      <button id="modal-close" class="ad-btn ad-btn-primary ad-btn-sm" type="button">${esc(C.close)}</button>
    </div>
  </div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['advent-core.js', 'advent.js'] })}
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
<body class="ad-body">
${G.topBar(lang, rel, { suggest: true })}
<main class="ad-shell">
  <div class="ad-doc">
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
