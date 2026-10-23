#!/usr/bin/env node
/**
 * BMI 계산기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 한 화면(h1·훅 → 단위 → 키·몸무게 → (선택) 나이·성별 → 아시아 기준 토글
 *                                    → 결과 카드(입력하는 대로 BMI·단계·색 막대·정상 체중 범위) → 알아 둘 점 → "요약 보기")
 *                                    → (요약을 누른 뒤) 요약 카드 + 공통 끝 화면 → 맨 아래 mg-ad-start
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어 — guide.html 은 tools/gen-guides.js 가 더한다)
 * 문구는 tools/i18n/<lang>.js, 계산은 bmi-core.js, 화면 동작은 bmi.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 따로 시작 화면이 없는 도구 앱 — 첫 화면(계산기) 컨테이너의 마지막 요소로 mg-ad-start 1개.
 *   - "요약 보기" 뒤 나타나는 #result 맨 끝에 <div data-mg-end="bmi">. 그때 mg-ad-start 는 숨긴다(한 화면 광고 1개).
 *   - FAQ 는 끝 화면에만(MG_FAQ). FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bmi-core.js'));

const SITE_ID = 'bmi';
const SITE_ROOT = 'https://bmi.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&display=swap';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
// 입력 칸 예시(placeholder) — 입력 모양만 보여 준다
const PLACE = { cm: 170, kg: 65, ft: 5, inch: 7, lb: 145, age: 30 };
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
<meta name="theme-color" content="#f3f7f4">
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

const ph = (lang, v) => new Intl.NumberFormat(lang, { useGrouping: false }).format(v);

// 입력 칸 하나 (label 이 있으면 그 칸의 이름, suffix = 단위)
function input(lang, key, suffix, labelledBy) {
  const aria = labelledBy ? ` aria-labelledby="${labelledBy}"` : '';
  return `<div class="bm-inwrap"><input id="in-${key}" class="bm-input" type="text" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="next" placeholder="${esc(ph(lang, PLACE[key]))}" data-in="${key}"${aria}><span class="bm-suffix" id="sfx-${key}" aria-hidden="${labelledBy ? 'false' : 'true'}">${esc(suffix)}</span></div>`;
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
  const asiaOn = CORE.asiaDefault(lang);
  // 브라우저(bmi.js)에서 쓰는 문구
  const runtime = { lang, ui: U, num: T.num, scales: T.scales, errors: T.errors, alt: CORE.altScale(lang), asiaOn };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="bm-body">
${G.topBar(lang, rel)}

<main class="bm-shell">
  <!-- 첫 화면(시작 화면이 따로 없는 도구 앱): h1·훅 → 입력 카드 → 결과 카드 → 알아 둘 점 → 요약 보기 → (요약 뒤) 요약 + 공통 끝 화면 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-bmi" class="bm-screen">
    <div class="bm-logo" aria-hidden="true"><span>⚖️</span></div>
    <h1 class="bm-h1"><span class="bm-kicker">${esc(H.h1Kicker)}</span><span class="bm-h1-main">${H.h1Html}</span></h1>
    <p class="bm-hook">${esc(H.hook)}</p>

    <div class="bm-card bm-inputs">
      <div class="bm-seg" role="group" aria-label="${esc(U.unitsLabel)}">
        <button type="button" class="bm-seg-btn" data-unit="metric" aria-pressed="true">${esc(U.metric)}</button>
        <button type="button" class="bm-seg-btn" data-unit="imperial" aria-pressed="false">${esc(U.imperial)}</button>
      </div>
      <div class="bm-fields" data-unit-box="metric">
        <div class="bm-field"><label class="bm-label" for="in-cm">${esc(U.height)}</label>${input(lang, 'cm', U.cm)}</div>
        <div class="bm-field"><label class="bm-label" for="in-kg">${esc(U.weight)}</label>${input(lang, 'kg', U.kg)}</div>
      </div>
      <div class="bm-fields is-imp" data-unit-box="imperial" hidden>
        <div class="bm-field bm-field-h"><span class="bm-label" id="lbl-h">${esc(U.height)}</span>
          <div class="bm-pair">${input(lang, 'ft', U.ft, 'lbl-h sfx-ft')}${input(lang, 'inch', U.inch, 'lbl-h sfx-inch')}</div>
        </div>
        <div class="bm-field"><label class="bm-label" for="in-lb">${esc(U.weight)}</label>${input(lang, 'lb', U.lb)}</div>
      </div>
      <button type="button" id="more-btn" class="bm-more" aria-expanded="false" aria-controls="more-box">${esc(U.more)}</button>
      <div id="more-box" class="bm-more-box" hidden>
        <div class="bm-field bm-field-age"><label class="bm-label" for="in-age">${esc(U.age)}</label>
          <div class="bm-inwrap"><input id="in-age" class="bm-input" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" enterkeyhint="done" placeholder="${esc(ph(lang, PLACE.age))}" data-in="age"><span class="bm-suffix" aria-hidden="true">${esc(U.years)}</span></div>
        </div>
        <div class="bm-field"><span class="bm-label" id="lbl-sex">${esc(U.sex)}</span>
          <div class="bm-seg bm-seg-sex" role="group" aria-labelledby="lbl-sex">
            <button type="button" class="bm-seg-btn" data-sex="" aria-pressed="true">${esc(U.sexNone)}</button>
            <button type="button" class="bm-seg-btn" data-sex="f" aria-pressed="false">${esc(U.female)}</button>
            <button type="button" class="bm-seg-btn" data-sex="m" aria-pressed="false">${esc(U.male)}</button>
          </div>
        </div>
      </div>
      <label class="bm-switch"><input type="checkbox" id="asia-toggle" role="switch"${asiaOn ? ' checked' : ''}><span class="bm-switch-ui" aria-hidden="true"></span><span class="bm-switch-t">${esc(U.asiaToggle)}</span><span class="bm-switch-src">${esc(T.scales.alt.name)}</span></label>
    </div>

    <div class="bm-card bm-out" id="out">
      <p class="bm-lead" id="out-lead">${esc(U.waiting)}</p>
      <p class="bm-big" id="out-big" aria-hidden="true">—</p>
      <p class="bm-cat" id="out-cat" hidden></p>
      <div class="bm-bar-wrap">
        <div class="bm-bar" id="bar" role="img" aria-label="${esc(U.scaleLabel)}"></div>
        <span class="bm-marker" id="marker" hidden></span>
        <div class="bm-ticks" id="ticks" aria-hidden="true"></div>
      </div>
      <p class="bm-scale-note" id="scale-note"></p>
      <div class="bm-range" id="range" hidden>
        <span class="bm-range-t">${esc(U.rangeTitle)}</span>
        <b class="bm-range-v" id="range-v"></b>
        <span class="bm-range-d" id="range-d"></span>
      </div>
      <p class="bm-err" id="out-err" role="alert" hidden></p>
      <p class="bm-note bm-note-warn" id="note-minor" hidden>${esc(U.under18)}</p>
      <p class="bm-note" id="note-senior" hidden>${esc(U.senior)}</p>
      <p class="bm-note" id="note-sex" hidden>${esc(U.sexNote)}</p>
    </div>

    <div class="bm-disc">
      <p class="bm-disc-t">${esc(U.disclaimerTitle)}</p>
      <ul>
        ${U.disclaimer.map((d) => `<li>${esc(d)}</li>`).join('\n        ')}
      </ul>
    </div>
    <p class="bm-hint">${esc(U.decimalHint)}</p>

    <button type="button" id="finish-btn" class="bm-btn bm-btn-primary">${esc(U.finish)}</button>
    <p class="bm-local">${esc(U.localNote)}</p>
    <p id="finish-err" class="bm-error" role="alert" hidden></p>

    <div id="result" class="bm-result" hidden>
      <article id="summary-card" class="bm-summary" aria-labelledby="sum-title">
        <h2 class="bm-h2" id="sum-title">${esc(U.summaryTitle)}</h2>
        <p class="bm-sum-big" id="sum-big"></p>
        <p class="bm-sum-cat" id="sum-cat"></p>
        <dl class="bm-sum-list">
          <dt>${esc(U.sumScale)}</dt><dd id="sum-scale"></dd>
          <dt>${esc(U.sumRange)}</dt><dd id="sum-range"></dd>
        </dl>
        <p class="bm-sum-diff" id="sum-diff"></p>
        <p class="bm-note">${esc(U.summaryNote)}</p>
        <p class="bm-brand">${esc(T.og.brand)}</p>
      </article>
      <p id="live" class="visually-hidden" aria-live="polite"></p>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
    <div class="mg-ad mg-ad-start"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bmi-core.js', 'bmi.js'] })}
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
<body class="bm-body">
${G.topBar(lang, rel)}
<main class="bm-shell">
  <div class="bm-doc">
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
