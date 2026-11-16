#!/usr/bin/env node
/**
 * 장단점 저울 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(고민·모드, 맨 끝 mg-ad-start) → 저울판(실시간 저울 + 목록, 광고 없음) → 끝(판정 + 공통 끝 화면)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 proscons-core.js, 화면 동작은 proscons.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면(#screen-start) = h1·훅 + 시작에 필요한 입력(고민·모드·선택지 이름) + 시작 버튼 + 맨 끝 mg-ad-start 1개.
 *   - 저울판(#screen-board) = 광고 없음.
 *   - 끝 화면(#screen-end) = 판정 카드 → <div data-mg-end="proscons">. FAQ 는 MG_FAQ 로만.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'proscons-core.js'));

const SITE_ID = 'proscons';
const SITE_ROOT = 'https://proscons.example.com';
const SITE_DIR = path.join(__dirname, '..');
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
<meta name="theme-color" content="#f6f1e7">
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

// 저울 SVG (저울대·접시 위치는 proscons.js 가 기울기에 맞춰 바꾼다)
function scaleSvg(B) {
  const pan = (id) => `<g id="${id}" class="pc-pan" transform="translate(${id.endsWith('l') ? 40 : 280} 48)">
        <path class="pc-string" d="M0 0 L-40 62 M0 0 L40 62"/>
        <path class="pc-dish" d="M-48 62 Q0 96 48 62 Z"/>
        <text class="pc-pan-num" x="0" y="80" text-anchor="middle">0</text>
        <text class="pc-pan-name" x="0" y="112" text-anchor="middle"></text>
      </g>`;
  return `<figure class="pc-scale" id="scale">
    <svg viewBox="-12 0 344 222" role="img" aria-labelledby="scale-desc" focusable="false">
      <title id="scale-desc">${esc(G.fmt(B.scaleLabel, { left: 0, right: 0 }))}</title>
      <path class="pc-base" d="M110 212 Q160 196 210 212 Z"/>
      <rect class="pc-post" x="156" y="44" width="8" height="160" rx="4"/>
      <g id="sc-beam" transform="rotate(0 160 48)">
        <rect class="pc-beam" x="34" y="44" width="252" height="8" rx="4"/>
      </g>
      <circle class="pc-pivot" cx="160" cy="48" r="9"/>
      ${pan('sc-pan-l')}
      ${pan('sc-pan-r')}
    </svg>
  </figure>`;
}

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const S = T.start;
  const B = T.board;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = {
    lang,
    pts: T.pts,
    start: S,
    board: B,
    result: R,
    errors: T.errors,
    limits: { items: CORE.MAX_ITEMS, text: CORE.MAX_TEXT, q: CORE.MAX_Q, name: CORE.MAX_NAME },
  };
  const chips = B.chips.map((c, i) => `<button type="button" class="pc-chip" data-chip="${i}">${esc(c)}</button>`).join('\n        ');

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="pc-body">
${G.topBar(lang, rel)}

<main class="pc-shell">
  <!-- 시작 화면: h1·훅 → 고민(선택) → 모드 → (A/B 이름) → 시작 → 맨 끝 mg-ad-start 1개 -->
  <section id="screen-start" class="pc-screen pc-start">
    <h1 class="pc-h1"><span class="pc-kicker">${esc(H.h1Kicker)}</span><span class="pc-h1-main">${H.h1Html}</span></h1>
    <p class="pc-hook">${esc(H.hook)}</p>

    <form id="pc-form" class="pc-form" novalidate autocomplete="off">
      <div class="pc-card">
        <label class="pc-label" for="q">${esc(S.questionLabel)}</label>
        <input id="q" class="pc-input" type="text" maxlength="${CORE.MAX_Q}" placeholder="${esc(S.questionPh)}" enterkeyhint="done">
      </div>
      <div class="pc-card">
        <p class="pc-label" id="mode-label">${esc(S.modeLabel)}</p>
        <div class="pc-seg" role="group" aria-labelledby="mode-label">
          <button type="button" class="pc-seg-btn" id="mode-s" data-mode="s" aria-pressed="true">${esc(S.modeSingle)}</button>
          <button type="button" class="pc-seg-btn" id="mode-ab" data-mode="ab" aria-pressed="false">${esc(S.modeAb)}</button>
        </div>
        <p class="pc-hint" id="mode-hint-s">${esc(S.modeSingleHint)}</p>
        <p class="pc-hint" id="mode-hint-ab" hidden>${esc(S.modeAbHint)}</p>
        <div id="ab-names" class="pc-ab-names" hidden>
          <div class="pc-field">
            <label class="pc-label pc-label-sm" for="name-a">${esc(S.aLabel)}</label>
            <input id="name-a" class="pc-input" type="text" maxlength="${CORE.MAX_NAME}" placeholder="${esc(S.aPh)}" enterkeyhint="next">
          </div>
          <div class="pc-field">
            <label class="pc-label pc-label-sm" for="name-b">${esc(S.bLabel)}</label>
            <input id="name-b" class="pc-input" type="text" maxlength="${CORE.MAX_NAME}" placeholder="${esc(S.bPh)}" enterkeyhint="done">
          </div>
        </div>
      </div>
    </form>

    <div id="draft-row" class="pc-draft" hidden>
      <p id="draft-note" class="pc-draft-note"></p>
      <button type="button" id="fresh-btn" class="pc-mini">${esc(S.fresh)}</button>
    </div>
    <p id="error" class="pc-error" role="alert" hidden></p>
    <button type="button" id="go-btn" class="pc-btn pc-btn-primary">${esc(S.go)}</button>
    <p class="pc-fine">${esc(S.local)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 저울판: 실시간 저울 + 목록 (광고 없음) -->
  <section id="screen-board" class="pc-screen pc-board" hidden>
    <p id="ro-badge" class="pc-badge" hidden>${esc(B.readonlyBadge)}</p>
    <h2 class="pc-h2" id="bd-title"></h2>
    <p id="ro-note" class="pc-shared-note" hidden>${esc(B.readonlyNote)}</p>
    ${scaleSvg(B)}
    <p class="visually-hidden" id="scale-live" aria-live="polite"></p>
    <div id="ideas" class="pc-ideas">
      <p class="pc-hint pc-ideas-label">${esc(B.ideas)}</p>
      <div class="pc-chips">
        ${chips}
      </div>
    </div>
    <div id="lists" class="pc-lists"></div>
    <p id="bd-error" class="pc-error" role="alert" hidden></p>
    <button type="button" id="weigh-btn" class="pc-btn pc-btn-primary">${esc(B.weigh)}</button>
    <button type="button" id="copy-edit-btn" class="pc-btn pc-btn-ghost" hidden>${esc(B.editCopy)}</button>
    <button type="button" id="back-btn" class="pc-link-btn">${esc(B.back)}</button>
  </section>

  <!-- 끝 화면: 판정 카드 → 공통 끝 화면 -->
  <section id="screen-end" class="pc-screen pc-end" hidden>
    <article class="pc-card pc-result" aria-labelledby="res-verdict">
      <p id="shared-badge" class="pc-badge" hidden>${esc(R.sharedBadge)}</p>
      <p id="res-q" class="pc-res-q"></p>
      <h2 class="pc-verdict" id="res-verdict"></h2>
      <div class="pc-split" aria-hidden="true"><i id="res-bar-l" class="pc-split-l"></i><i id="res-bar-r" class="pc-split-r"></i></div>
      <div class="pc-split-legend" aria-hidden="true"><span id="res-leg-l"></span><span id="res-leg-r"></span></div>
      <div id="tie-box" class="pc-tie" hidden>
        <p class="pc-tie-hint">${esc(R.tieHint)}</p>
        <button type="button" id="flip-btn" class="pc-btn pc-btn-ghost">${esc(R.flip)}</button>
        <p id="coin" class="pc-coin" aria-live="polite" hidden></p>
      </div>
      <div class="pc-tops">
        <div class="pc-top pc-top-l"><h3 class="pc-h3" id="top-l-head"></h3><ol id="top-l" class="pc-top-list"></ol></div>
        <div class="pc-top pc-top-r"><h3 class="pc-h3" id="top-r-head"></h3><ol id="top-r" class="pc-top-list"></ol></div>
      </div>
      <p class="pc-note">${esc(R.note)}</p>
      <div class="pc-actions">
        <button type="button" id="link-btn" class="pc-btn pc-btn-ghost">${esc(R.copyLink)}</button>
        <button type="button" id="png-btn" class="pc-btn pc-btn-ghost">${esc(R.save)}</button>
        <button type="button" id="edit-btn" class="pc-btn pc-btn-ghost">${esc(R.edit)}</button>
      </div>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['proscons-core.js', 'proscons.js'] })}
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
<body class="pc-body">
${G.topBar(lang, rel)}
<main class="pc-shell">
  <div class="pc-doc">
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
