#!/usr/bin/env node
/**
 * 반응속도 테스트의 정적 페이지를 언어별로 생성한다.
 *   index.html / en/index.html / ja/index.html / ...
 *   privacy.html / en/privacy.html / ja/privacy.html / ...
 *   sitemap.xml (모든 언어 URL + xhtml:link hreflang)
 * 문구는 tools/i18n/<lang>.js. reaction.js 가 쓰는 문자열(ui)은 페이지에 인라인(window.PAGE_I18N)된다.
 * FAQ(T.faq, 끝 화면 전용)는 window.MG_FAQ 로 인라인되어 shared/common.js 의 공통 끝 화면이 그린다.
 * 맨 위 타이틀 바는 공통 G.topBar(포털 홈 + 언어 선택). 시작 화면은 티징만(SEO 본문·FAQ·다른 테스트·광고 없음).
 *
 * 실행: node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'reaction-core.js'));

const SITE_ROOT = 'https://reaction.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

// 언어 파일의 typography → :root CSS 변수 (style.css 의 기본값은 라틴 문자용). 언어별 CSS 선택자를 두지 않는다.
function typographyStyle(T) {
  const t = T.typography || {};
  const css = (v) => String(v).replace(/[<>{};]/g, '');
  const vars = [];
  if (t.display) vars.push(`--font-display: ${css(t.display)}, var(--font-sans)`);
  if (t.displayWeight != null) vars.push(`--display-weight: ${Number(t.displayWeight)}`);
  if (t.scale != null) vars.push(`--display-scale: ${Number(t.scale)}`);
  if (t.scaleSmall != null) vars.push(`--display-scale-sm: ${Number(t.scaleSmall)}`);
  if (t.leading != null) vars.push(`--display-leading: ${Number(t.leading)}`);
  if (t.body != null) vars.push(`--font-body: ${t.body ? css(t.body) + ', ' : ''}var(--font-sans)`);
  if (t.bodyLeading != null) vars.push(`--body-leading: ${Number(t.bodyLeading)}`);
  if (t.wordBreak) vars.push(`--word-break: ${css(t.wordBreak)}`); // ko keep-all(어절 단위), ja auto-phrase(문절 단위)
  return vars.length ? `<style>:root { ${vars.join('; ')}; }</style>` : '';
}

function renderIndex(lang) {
  const T = L10N[lang];
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const H = T.hero;
  const R = T.result;

  // SEO는 title/description/OG/구조화 데이터로만 한다 — 화면에 SEO 본문·FAQ 목록을 두지 않는다.
  // ladder/roulette/reaction = game 카테고리. 별점(aggregateRating)·FAQPage 는 앱 페이지에 넣지 않는다.
  const appLd = G.appLd(lang, {
    siteRoot: SITE_ROOT,
    rel,
    name: T.app.name,
    description: T.app.description,
    category: 'game',
    image: ogImage(lang),
  });

  const laps = Array.from({ length: CORE.ROUNDS }, (_, i) =>
    `        <li class="rx-lap" aria-label="${esc(G.fmt(T.ui.lapEmpty, { n: i + 1 }))}"><span class="rx-lap-n">${i + 1}</span><span class="rx-lap-ms">–</span></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b1c86">
<title>${esc(T.meta.title)}</title>
<meta name="description" content="${esc(T.meta.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(T.meta.ogTitle)}">
<meta property="og:description" content="${esc(T.meta.ogDescription)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${T.fontCss}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${typographyStyle(T)}

${appLd}
</head>
<body class="rx-body">

${G.topBar(lang, rel, { suggest: lang === G.DEFAULT_LOCALE })}

<div class="rx-page">
  <!-- 측정 화면: 대기(idle, 티징만) → 빨강(wait) → 초록(go) → 기록(hit) / 부정 출발(foul) / 중단(abort) -->
  <section id="arena" class="rx-arena" data-phase="idle" tabindex="-1" aria-labelledby="arena-title">
    <div class="rx-hud">
      <span id="hud-round" class="rx-hud-round"></span>
      <button type="button" id="quit-btn" class="rx-quit" data-no-tap>${esc(T.ui.quit)}</button>
    </div>

    <div class="rx-idle">
      <h1 id="arena-title">${H.h1Html}</h1>
      <p class="rx-hook">${esc(H.hook)}</p>
      <ul class="rx-rules">
        <li><span class="rx-swatch rx-swatch-stop" aria-hidden="true"></span>${esc(H.ruleWait)}</li>
        <li><span class="rx-swatch rx-swatch-go" aria-hidden="true"></span>${esc(H.ruleGo)}</li>
      </ul>
      <div class="rx-court">
        <button type="button" id="start-btn" class="rx-pad"><span>${esc(H.start)}</span></button>
      </div>
      <p class="rx-keyhint">${esc(H.hintKey)}</p>
    </div>

    <div class="rx-signal" aria-live="assertive" aria-atomic="true">
      <p id="sig-title" class="rx-sig-title"></p>
      <p id="sig-num" class="rx-sig-num" hidden><span id="sig-ms" class="rx-num"></span><span class="rx-unit">${esc(T.ui.ms)}</span><span id="sig-emoji" class="rx-sig-emoji" aria-hidden="true"></span></p>
      <p id="sig-sub" class="rx-sig-sub"></p>
      <p id="sig-act" class="rx-sig-act"></p>
      <p id="sig-key" class="rx-sig-key">${esc(T.ui.keyHint)}</p>
    </div>

    <ol id="laps" class="rx-laps" aria-label="${esc(H.lapsAria)}">
${laps}
    </ol>
  </section>

  <!-- 결과 화면: 앱 결과 다음에 공통 끝 화면(별점·하트 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱) -->
  <section id="result" class="rx-result" hidden aria-labelledby="res-label">
    <h2 id="res-label" class="rx-res-label">${esc(R.avgLabel)}</h2>
    <p class="rx-res-avg"><span id="res-avg" class="rx-num">0</span><span class="rx-unit">${esc(T.ui.ms)}</span></p>

    <div class="rx-tier">
      <span id="res-emoji" class="rx-tier-emoji" aria-hidden="true"></span>
      <div class="rx-tier-body">
        <p id="res-tier" class="rx-tier-title"></p>
        <p id="res-tier-desc" class="rx-tier-desc"></p>
      </div>
    </div>

    <div class="rx-block">
      <h3 class="rx-block-title">${esc(R.lapsTitle)}</h3>
      <ol id="res-laps" class="rx-lapbars"></ol>
      <p id="res-meta" class="rx-res-meta"></p>
    </div>

    <div id="res-rank" class="rx-block rx-rank" hidden>
      <h3 class="rx-block-title">${esc(R.rankTitle)}</h3>
      <p id="res-comparing" class="rx-comparing">${esc(R.comparing)}</p>
      <div id="res-rank-body" hidden>
        <p id="res-top" class="rx-rank-top"></p>
        <p id="res-beat" class="rx-rank-beat"></p>
        <div id="res-chart" class="rx-chart"></div>
        <p id="res-readout" class="rx-readout" aria-hidden="true"></p>
      </div>
      <p id="res-note" class="rx-rank-note"></p>
    </div>

    <div data-mg-end="reaction"></div>
  </section>

  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="privacy.html">${esc(T.privacyLink)}</a>
  </footer>
</div>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PAGE_I18N', T.ui)}
${G.scriptJson('MG_FAQ', T.faq)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}reaction-core.js"></script>
<script src="${root}reaction.js"></script>
</body>
</html>
`;
}

function renderPrivacy(lang) {
  const T = L10N[lang];
  const P = T.privacy;
  const rel = 'privacy.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const sections = P.sections.map(([h, body]) => `    <h2>${esc(h)}</h2>\n    <p>${body}</p>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b1c86">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${T.fontCss}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${typographyStyle(T)}
</head>
<body class="rx-body">
${G.topBar(lang, rel)}
<div class="rx-page">
  <main class="rx-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </main>

  <footer class="site-footer">
    <a href="./">${esc(P.back)}</a>
  </footer>
</div>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
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
