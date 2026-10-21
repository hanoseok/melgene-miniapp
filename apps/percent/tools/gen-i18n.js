#!/usr/bin/env node
/**
 * 퍼센트 계산기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 계산 탭 6개 → 고른 계산 카드(입력하는 대로 결과·계산식·복사) → "요약 보기")
 *                                    → (요약을 누른 뒤) 요약 카드 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어 — guide.html 은 tools/gen-guides.js 가 더한다)
 * 문구는 tools/i18n/<lang>.js, 계산은 percent-core.js, 화면 동작은 percent.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱 — 첫 화면(계산기) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - "요약 보기" 뒤 나타나는 #result 맨 끝에 <div data-mg-end="percent">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'percent-core.js'));

const SITE_ID = 'percent';
const SITE_ROOT = 'https://percent.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const ICONS = { of: '🧮', what: '🎯', change: '📈', adjust: '🏷️', reverse: '⏪', points: '📊' };
// 입력 칸 예시(placeholder) — 계산 결과가 아니라 입력 모양만 보여 준다
const PLACE = { of: [15, 200], what: [30, 120], change: [80, 100], adjust: [120, 20], reverse: [96, 20], points: [3, 4.5] };
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
<meta name="theme-color" content="#f4f6fb">
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

const fill = (tpl, v) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

function tabs(T) {
  return CORE.MODES.map((m, i) => `<button type="button" role="tab" id="tab-${m}" class="pc-tab" data-mode="${m}" aria-controls="panel-${m}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><span class="pc-tab-ico" aria-hidden="true">${ICONS[m]}</span><span class="pc-tab-t">${esc(T.modes[m].tab)}</span></button>`).join('\n      ');
}

function field(lang, T, mode, key) {
  const M = T.modes[mode];
  const id = `pc-${mode}-${key}`;
  const pct = !!CORE.PCT_FIELDS[mode][key];
  const ph = new Intl.NumberFormat(lang, { useGrouping: false }).format(PLACE[mode][key === 'a' ? 0 : 1]);
  return `<div class="pc-field">
            <label class="pc-label" for="${id}">${esc(M[key])}</label>
            <div class="pc-inwrap${pct ? ' is-pct' : ''}"><input id="${id}" class="pc-input" type="text" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${esc(ph)}" data-in="${key}">${pct ? `<span class="pc-suffix" aria-hidden="true">${esc(T.ui.pctSuffix)}</span>` : ''}</div>
          </div>`;
}

function panel(lang, T, mode, i) {
  const M = T.modes[mode];
  const U = T.ui;
  const dir = CORE.DIR_MODES[mode];
  const seg = dir ? `
        <div class="pc-seg" role="group" aria-label="${esc(M.title)}">
          <button type="button" class="pc-seg-btn" data-dir="down" aria-pressed="${dir === 'down'}">${esc(M.down)}</button>
          <button type="button" class="pc-seg-btn" data-dir="up" aria-pressed="${dir === 'up'}">${esc(M.up)}</button>
        </div>` : '';
  const chips = mode === 'adjust' ? `
        <div class="pc-chips" role="group" aria-label="${esc(M.chips)}">
          <span class="pc-chips-label">${esc(M.chips)}</span>
          ${CORE.CHIPS.map((c) => `<button type="button" class="pc-chip" data-chip="${c}" aria-pressed="false">${esc(T.num.minus + fill(T.num.pct, { n: new Intl.NumberFormat(lang).format(c) }))}</button>`).join('\n          ')}
        </div>` : '';
  return `
      <div class="pc-card pc-panel" id="panel-${mode}" role="tabpanel" aria-labelledby="tab-${mode}" data-mode="${mode}"${i === 0 ? '' : ' hidden'}>
        <h2 class="pc-h2">${esc(M.title)}</h2>
        <p class="pc-desc">${esc(M.desc)}</p>${seg}
        <div class="pc-fields">
          ${field(lang, T, mode, 'a')}
          ${field(lang, T, mode, 'b')}
        </div>${chips}
        <div class="pc-out" data-out>
          <p class="pc-lead" data-lead>${esc(U.waiting)}</p>
          <p class="pc-big" data-big aria-hidden="true">—</p>
          <p class="pc-sub" data-sub hidden></p>
          <p class="pc-warn" data-warn hidden></p>
          <p class="pc-err" data-err role="alert" hidden></p>
          <div class="pc-how" data-howbox hidden><span class="pc-how-label">${esc(U.how)}</span><span class="pc-how-f" data-how></span></div>
          <button type="button" class="pc-copy" data-copy disabled>${esc(U.copy)}</button>
        </div>
      </div>`;
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
  // 브라우저(percent.js)에서 쓰는 문구
  const runtime = { lang, ui: U, num: T.num, modes: T.modes, errors: T.errors };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="pc-body">
${G.topBar(lang, rel)}

<main class="pc-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 계산 탭 → 계산 카드 → 요약 보기 → (요약 뒤) 요약 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-percent" class="pc-screen">
    <div class="pc-logo" aria-hidden="true"><span>%</span></div>
    <h1 class="pc-h1"><span class="pc-kicker">${esc(H.h1Kicker)}</span><span class="pc-h1-main">${H.h1Html}</span></h1>
    <p class="pc-hook">${esc(H.hook)}</p>

    <div class="pc-tabs" role="tablist" aria-label="${esc(U.modesLabel)}">
      ${tabs(T)}
    </div>
${CORE.MODES.map((m, i) => panel(lang, T, m, i)).join('\n')}
    <p class="pc-hint">${esc(U.decimalHint)}</p>

    <button type="button" id="finish-btn" class="pc-btn pc-btn-primary">${esc(U.finish)}</button>
    <p class="pc-local">${esc(U.localNote)}</p>
    <p id="finish-err" class="pc-error" role="alert" hidden></p>

    <div id="result" class="pc-result" hidden>
      <article id="summary-card" class="pc-summary" aria-labelledby="sum-title">
        <h2 class="pc-h2" id="sum-title">${esc(U.summaryTitle)}</h2>
        <ol id="sum-list" class="pc-sum-list"></ol>
        <p class="pc-note">${esc(U.summaryNote)}</p>
        <p class="pc-brand">${esc(T.og.brand)}</p>
      </article>
      <p id="live" class="visually-hidden" aria-live="polite"></p>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['percent-core.js', 'percent.js'] })}
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
