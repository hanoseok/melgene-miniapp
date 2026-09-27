#!/usr/bin/env node
/**
 * 나의 전생 테스트의 정적 페이지를 언어별로 모두 생성한다 (shared/i18n.js 의 LOCALES 12개).
 *   - 시작/퀴즈:    index.html (en, 사이트 루트), ko/index.html, ja/index.html, zh/…, fr/…, de/…, th/…, vi/…, es/…, it/…, pt/…, ru/…
 *   - 결과 16종:    r/<type>.html,  <dir>/r/<type>.html
 *   - 개인정보:     privacy.html,   <dir>/privacy.html
 *   - sitemap.xml  (모든 언어 URL + xhtml:link hreflang 대체 링크)
 * 문구는 tools/i18n/<lang>.js, 채점/메타(이모지·색·인연)는 data.js 에서 읽는다.
 * 규칙(.claude/skills/melgene-miniapp): 맨 위 공통 타이틀 바, 시작 화면은 티징만, 광고는 퀴즈 화면에 1개 +
 * 결과 페이지의 공통 끝 화면(data-mg-end: 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱). FAQPage JSON-LD 는 넣지 않는다.
 *
 * 실행: node tools/gen-results.js
 */
const path = require('path');
const DATA = require(path.join(__dirname, '..', 'data.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'past-life';
const SITE_ROOT = 'https://past-life.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

// 기본 본문 글꼴(라틴·한글). 언어 파일 typography.fontCss 로 바꿀 수 있다(zh 는 시스템 글꼴만: 중국 본토에서 CDN 차단 대비).
const FONT_CSS = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';

function fontCssList(T) {
  const ty = T.typography || {};
  return Array.isArray(ty.fontCss) ? ty.fontCss : [FONT_CSS];
}

// <head> 글꼴: 스타일시트 + (구글 글꼴이면 preconnect) + 언어 파일 font 스택.
// shared/base.css 의 :lang(th|vi|zh) 스택보다 뒤에 오도록 같은 선택자로 인라인에 둔다.
function fontHead(lang, T) {
  const list = fontCssList(T);
  const out = [];
  if (list.some((u) => /fonts\.googleapis\.com/.test(u))) {
    out.push('<link rel="preconnect" href="https://fonts.googleapis.com">');
    out.push('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
  }
  list.forEach((u) => out.push(`<link rel="stylesheet" href="${esc(u)}">`));
  const font = (T.typography || {}).font;
  if (font) out.push(`<style>:lang(${lang}) { font-family: ${String(font).replace(/[<>{};]/g, '')}; }</style>`);
  return out.join('\n');
}

function ogImage(lang, name) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}${name}.png`;
}

// <title> = 현지 검색어로 시작하는 문구 + ' | ' + 브랜드 (skill 7번)
function pageTitle(lang, text) {
  return `${text} | ${G.brandOf(lang)}`;
}

function footer(T, lang, file) {
  const privacyHref = G.relHref(file, G.fileOf(lang, 'privacy.html'));
  return `  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="${privacyHref}">${esc(T.privacyLink)}</a>
  </footer>`;
}

function head(lang, T, o) {
  const root = G.rootPrefix(o.file);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0a0b1e">
<title>${esc(pageTitle(lang, o.title))}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${o.url}">
${G.hreflangTags(SITE_ROOT, o.rel)}
${o.og ? `
<meta property="og:type" content="${o.og.type}">
<meta property="og:site_name" content="${esc(T.siteName)}">
<meta property="og:title" content="${esc(o.og.title)}">
<meta property="og:description" content="${esc(o.og.desc)}">
<meta property="og:image" content="${o.og.image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${o.url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">
` : ''}
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
${fontHead(lang, T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${o.extraHead || ''}
</head>`;
}

// ---------------------------------------------------------------
// 시작(티징) + 퀴즈 + 로딩 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(quiz.js)에서 쓰는 문구만 인라인으로 싣는다. 가중치는 data.js 에서.
  const runtime = { questions: T.questions };

  return `${head(lang, T, {
    file, rel, url,
    title: T.meta.title,
    desc: T.meta.description,
    og: { type: 'website', title: T.meta.ogTitle, desc: T.meta.ogDescription, image: ogImage(lang, 'default') },
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="pl-body">
<div class="starfield" aria-hidden="true"></div>
${G.topBar(lang, rel, { suggest: true })}

<main class="pl-shell">
  <!-- 시작 화면: 티징만 (훅·짧은 소개·시작 버튼) -->
  <section id="screen-landing" class="pl-landing">
    <div class="pl-landing-badge">${esc(T.landing.badge)}</div>
    <div class="pl-landing-emoji" aria-hidden="true">🔮</div>
    <h1><span class="pl-h1-kicker">${esc(T.landing.h1Kicker)}</span><span class="pl-h1-main">${T.landing.h1Html}</span></h1>
    <p class="pl-hook">${T.landing.hookHtml}</p>
    <div class="pl-landing-meta">
      <span>${esc(T.landing.metaTime)}</span>
      <span>${esc(T.landing.metaResults)}</span>
    </div>
    <button id="start-btn" class="pl-btn pl-btn-primary" type="button">${esc(T.landing.start)}</button>
  </section>

  <!-- 퀴즈 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="pl-quiz-wrap">
    <div class="pl-progress-row">
      <button id="back-btn" class="pl-back-btn" type="button" aria-label="${esc(T.landing.backAria)}">←</button>
      <div class="pl-progress-track"><div id="progress-fill" class="pl-progress-fill" style="width:0%"></div></div>
      <div id="progress-num" class="pl-progress-num">1 / ${DATA.questions.length}</div>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 로딩 -->
  <section id="screen-loading" class="pl-loading" role="status">
    <div class="pl-loading-orb" aria-hidden="true"></div>
    <p>${esc(T.landing.loading)}</p>
  </section>

${footer(T, lang, file)}
</main>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}data.js"></script>
${G.scriptJson('PAGE_I18N', runtime)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}quiz.js"></script>
</body>
</html>
`;
}

// 결과 이름의 괄호 부분 "(사실은 우체부)" 은 한 덩어리로 줄바꿈되게 감싼다
function nameHtml(name) {
  return esc(name).replace(/([(（][^()（）]+[)）])/g, '<span class="pl-keep">$1</span>');
}

// ---------------------------------------------------------------
// 결과 페이지 (r/<type>.html) — 그 결과 하나 + 인연/악연 한 쌍(보여주기만, 링크 없음 — 다른 결과 스포일러 금지) → 공통 끝 화면
// ---------------------------------------------------------------
function matchCard(T, kind, typeId) {
  const meta = DATA.types[typeId];
  const label = kind === 'good' ? T.result.good : T.result.bad;
  return `
      <div class="pl-match-card">
        <span class="pl-match-label ${kind}">${esc(label)}</span>
        <span class="pl-match-emoji" aria-hidden="true">${meta.emoji}</span>
        <span class="pl-match-name">${nameHtml(T.types[typeId].name)}</span>
      </div>`;
}

function renderResult(lang, id) {
  const T = L10N[lang];
  const R = T.result;
  const meta = DATA.types[id];
  const type = T.types[id];
  const rel = `r/${id}.html`;
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const title = G.fmt(R.title, { name: type.name });
  const desc = type.tagline;
  // 공통 끝 화면에 넘길 앱별 값: 공유 문구·주소(canonical), 다시 하기 = 같은 언어의 시작 화면
  const page = {
    share: { title, text: G.fmt(R.shareText, { name: type.name, emoji: meta.emoji, tagline: type.tagline }), url },
    retry: { label: R.retry, action: G.relHref(file, G.fileOf(lang, 'index.html')) },
    start: G.relHref(file, G.fileOf(lang, 'index.html')),
  };

  return `${head(lang, T, {
    file, rel, url, title, desc,
    og: { type: 'article', title, desc, image: ogImage(lang, id) },
    extraHead: `<style>.pl-scroll-card{--accent:${meta.color};}</style>`,
  })}
<body class="pl-body pl-result-page">
<div class="starfield" aria-hidden="true"></div>
${G.topBar(lang, rel, { suggest: true })}

<main class="pl-shell">
  <a id="share-cta" class="pl-share-cta" href="${page.start}">
    <span class="pl-share-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="pl-arrow" aria-hidden="true">→</span>
  </a>

  <section class="pl-result-hero" aria-labelledby="result-name">
    <div class="pl-scroll-card">
      <div class="pl-scroll-band" aria-hidden="true"></div>
      <span class="pl-result-emoji" aria-hidden="true">${meta.emoji}</span>
      <h1 id="result-name" class="pl-result-title"><span class="pl-result-eyebrow">${esc(R.eyebrow)}</span><span class="pl-result-name">${nameHtml(type.name)}</span></h1>
      <p class="pl-result-tagline">${esc(type.tagline)}</p>

      <p class="pl-result-story">${esc(type.story)}</p>

      <ul class="pl-result-traits">
        ${type.traits.map((t) => `<li>${esc(t)}</li>`).join('\n        ')}
      </ul>

      <p class="pl-result-advice"><b>${esc(R.adviceLabel)}</b> ${esc(type.advice)}</p>
    </div>

    <div class="pl-match-grid">${matchCard(T, 'good', meta.best)}${matchCard(T, 'bad', meta.worst)}</div>
  </section>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PL_RESULT', page)}
${G.scriptJson('MG_FAQ', T.faq)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}result.js"></script>
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

  return `${head(lang, T, { file, rel, url, title: `${P.h1} · ${T.siteName}`, desc: P.description })}
<body class="pl-body">
<div class="starfield" aria-hidden="true"></div>
${G.topBar(lang, rel, { suggest: true })}
<main class="pl-shell">
  <div class="pl-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </div>

  <footer class="site-footer">
    <a href="./">${esc(P.back)}</a>
  </footer>
</main>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
</body>
</html>
`;
}

function main() {
  let count = 0;
  G.LOCALES.forEach(({ code }) => {
    const T = L10N[code];
    DATA.order.forEach((id) => {
      if (!T.types[id]) throw new Error(`[${code}] types.${id} 누락`);
      G.writeOut(SITE_DIR, G.fileOf(code, `r/${id}.html`), renderResult(code, id));
      count++;
    });
    G.writeOut(SITE_DIR, G.fileOf(code, 'index.html'), renderIndex(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'privacy.html'), renderPrivacy(code));
    count += 2;
  });
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy + 결과 ${DATA.order.length}개) = HTML ${count}개`);

  const rels = ['index.html', ...DATA.order.map((id) => `r/${id}.html`)];
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, rels));
  console.log(`생성 완료: sitemap.xml (URL ${rels.length * G.LOCALES.length}개, hreflang 대체 링크 포함)`);
}

main();
