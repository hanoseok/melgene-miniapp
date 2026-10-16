#!/usr/bin/env node
/**
 * 디데이 계산기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 모드 탭 → 입력 카드 → 계산하기 → 저장 목록) → 계산한 뒤 달력 카드 + 기념일 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod — guide.html 은 tools/gen-guides.js 가 더한다)
 * 문구는 tools/i18n/<lang>.js, 날짜 계산은 dday-core.js, 화면 동작은 dday.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱 — 첫 화면(입력) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - 계산한 뒤 나타나는 결과(#result) 안에 카드 → 버튼 → 기념일 → <div data-mg-end="dday">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'dday-core.js'));

const SITE_ID = 'dday';
const SITE_ROOT = 'https://dday.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const QUICK_N = [7, 30, 100, 365, 1000];
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
<meta name="theme-color" content="#fbf5ea">
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
  // 브라우저(dday.js)에서 쓰는 문구
  const runtime = { lang, ui: U, result: T.result, errors: T.errors, defaults: T.defaults, brand: `${T.og.brand} · ${G.brandOf(lang)}` };
  const tabs = CORE.MODES.map((m, i) => `<button type="button" class="dd-tab" role="radio" data-mode="${m}" aria-checked="${i === 0}"${i ? ' tabindex="-1"' : ''}><span class="dd-tab-ico" aria-hidden="true">${esc(U.modeIcons[m])}</span><span class="dd-tab-txt">${esc(U.modes[m])}</span></button>`).join('\n      ');
  const presets = CORE.PRESETS.map((p) => `<button type="button" class="dd-preset" data-preset="${p.id}"><span class="dd-preset-name">${esc(U.presets[p.id])}</span><span class="dd-preset-d" aria-hidden="true"></span></button>`).join('\n          ');
  const emojis = CORE.EMOJIS.map((e, i) => `<button type="button" class="dd-emoji" role="radio" data-emoji="${i}" aria-checked="${i === 0}"${i ? ' tabindex="-1"' : ''} aria-label="${esc(e)}">${esc(e)}</button>`).join('');
  const themes = CORE.THEMES.map((t, i) => `<button type="button" class="dd-swatch" role="radio" data-theme="${i}" aria-checked="${i === 0}"${i ? ' tabindex="-1"' : ''} aria-label="${esc(U.themes[t.id])}" style="--sw-a:${t.a};--sw-b:${t.b}"></button>`).join('');
  const quick = QUICK_N.map((n) => `<button type="button" class="dd-qn" data-n="${n}">${n}</button>`).join('');
  const min = `${CORE.MIN_YEAR}-01-01`;
  const max = `${CORE.MAX_YEAR}-12-31`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="dd-body">
${G.topBar(lang, rel)}

<main class="dd-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 모드 → 입력 → 계산하기 → (있으면) 저장 목록 → (계산한 뒤) 카드 + 기념일 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-dd" class="dd-screen">
    <div class="dd-mini" aria-hidden="true"><span class="dd-mini-ring"></span><span class="dd-mini-num">D</span></div>
    <h1 class="dd-h1"><span class="dd-kicker">${esc(H.h1Kicker)}</span><span class="dd-h1-main">${H.h1Html}</span></h1>
    <p class="dd-hook">${esc(H.hook)}</p>

    <div class="dd-tabs" role="radiogroup" aria-label="${esc(U.modeLabel)}">
      ${tabs}
    </div>
    <p id="mode-hint" class="dd-hint dd-mode-hint" aria-live="polite">${esc(U.modeHints.countdown)}</p>

    <form id="dd-form" class="dd-card dd-form" novalidate autocomplete="off">
      <div class="dd-field">
        <label class="dd-label" for="title">${esc(U.titleLabel)}</label>
        <input id="title" class="dd-input" type="text" maxlength="${CORE.MAX_TITLE}" placeholder="${esc(U.titlePh.countdown)}" enterkeyhint="done">
      </div>
      <div class="dd-field">
        <label class="dd-label" for="date" id="date-label">${esc(U.dateLabel.countdown)}</label>
        <div class="dd-row">
          <input id="date" class="dd-input dd-date" type="date" min="${min}" max="${max}" required>
          <button type="button" id="today-btn" class="dd-mini-btn">${esc(U.todayBtn)}</button>
        </div>
      </div>
      <div class="dd-field" data-for="countdown">
        <p class="dd-label" id="presets-label">${esc(U.presetsLabel)}</p>
        <div class="dd-presets" role="group" aria-labelledby="presets-label">
          ${presets}
        </div>
      </div>
      <div class="dd-field" data-for="countdown">
        <label class="dd-label" for="time">${esc(U.timeLabel)}</label>
        <input id="time" class="dd-input dd-time" type="time">
        <p class="dd-hint">${esc(U.timeHint)}</p>
      </div>
      <div class="dd-field" data-for="since" hidden>
        <label class="dd-switch"><input id="day1" type="checkbox"><span class="dd-switch-ui" aria-hidden="true"></span><span class="dd-switch-text">${esc(U.day1Label)}</span></label>
        <p class="dd-hint">${esc(U.day1Hint)}</p>
      </div>
      <div class="dd-field" data-for="math" hidden>
        <p class="dd-label" id="dir-label">${esc(U.directionLabel)}</p>
        <div class="dd-seg" role="radiogroup" aria-labelledby="dir-label">
          <button type="button" class="dd-seg-btn" role="radio" data-sign="1" aria-checked="true">${esc(U.after)}</button><button type="button" class="dd-seg-btn" role="radio" data-sign="-1" aria-checked="false" tabindex="-1">${esc(U.before)}</button>
        </div>
        <label class="dd-label dd-label-gap" for="ndays">${esc(U.daysLabel)}</label>
        <div class="dd-row">
          <input id="ndays" class="dd-input dd-ndays" type="text" inputmode="numeric" maxlength="5" value="100" pattern="[0-9]*">
          <span class="dd-unit">${esc(U.daysUnit)}</span>
        </div>
        <div class="dd-qns">${quick}</div>
      </div>
      <div class="dd-field dd-style">
        <p class="dd-label" id="emoji-label">${esc(U.emojiLabel)}</p>
        <div class="dd-emojis" role="radiogroup" aria-labelledby="emoji-label">${emojis}</div>
        <p class="dd-label dd-label-gap" id="theme-label">${esc(U.themeLabel)}</p>
        <div class="dd-swatches" role="radiogroup" aria-labelledby="theme-label">${themes}</div>
      </div>
    </form>

    <button type="button" id="calc-btn" class="dd-btn dd-btn-primary">${esc(U.compute)}</button>
    <p class="dd-local">${esc(U.localNote)}</p>
    <p id="error" class="dd-error" role="alert" hidden></p>

    <div id="saved-card" class="dd-card dd-saved" hidden>
      <div class="dd-saved-head">
        <h2 class="dd-h2" id="saved-title">${esc(U.savedTitle)}</h2>
        <span id="saved-count" class="dd-saved-count"></span>
      </div>
      <p class="dd-hint">${esc(U.savedNote)}</p>
      <ul id="saved-list" class="dd-saved-list" aria-labelledby="saved-title"></ul>
    </div>

    <div id="result" class="dd-result" hidden>
      <article id="result-card" class="dd-cal" aria-labelledby="r-title">
        <div class="dd-cal-top" aria-hidden="true"><span></span><span></span></div>
        <p id="shared-badge" class="dd-badge" hidden>${esc(T.result.sharedBadge)}</p>
        <div class="dd-cal-head"><span id="r-emoji" class="dd-cal-emoji" aria-hidden="true"></span><h2 id="r-title" class="dd-cal-title"></h2></div>
        <p id="r-big" class="dd-big"></p>
        <p id="r-sub" class="dd-sub"></p>
        <p id="r-date" class="dd-rdate"></p>
        <div id="r-live" class="dd-live" hidden>
          <p id="live-label" class="dd-live-label"></p>
          <div class="dd-live-grid">
            <span class="dd-live-cell"><b id="lv-d">0</b><small>${esc(T.result.units.d)}</small></span>
            <span class="dd-live-cell"><b id="lv-h">00</b><small>${esc(T.result.units.h)}</small></span>
            <span class="dd-live-cell"><b id="lv-m">00</b><small>${esc(T.result.units.m)}</small></span>
            <span class="dd-live-cell"><b id="lv-s">00</b><small>${esc(T.result.units.s)}</small></span>
          </div>
        </div>
        <p id="r-extra" class="dd-extra" hidden></p>
        <p class="dd-cal-brand">${esc(T.og.brand)}</p>
      </article>
      <p id="shared-note" class="dd-shared-note" hidden>${esc(T.result.sharedNote)}</p>
      <div class="dd-actions">
        <button type="button" id="png-btn" class="dd-btn dd-btn-ghost">${esc(T.result.savePng)}</button>
        <button type="button" id="link-btn" class="dd-btn dd-btn-ghost">${esc(T.result.copyLink)}</button>
        <button type="button" id="save-btn" class="dd-btn dd-btn-ghost dd-btn-wide">${esc(T.result.saveList)}</button>
      </div>
      <div id="ms-card" class="dd-card dd-ms" hidden>
        <h2 class="dd-h2" id="ms-title">${esc(T.result.milestonesTitle)}</h2>
        <ol id="ms-list" class="dd-ms-list" aria-labelledby="ms-title"></ol>
      </div>
      <p id="live" class="visually-hidden" aria-live="polite"></p>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['dday-core.js', 'dday.js'] })}
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
<body class="dd-body">
${G.topBar(lang, rel)}
<main class="dd-shell">
  <div class="dd-doc">
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
