#!/usr/bin/env node
/**
 * 할로윈 몬스터 테스트의 정적 페이지를 언어별로 생성한다 (11개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html          — 시작(티징만) → 질문 10개 → 소환 중 → r/<id>.html 로 이동
 *   r/<id>.html, <dir>/r/<id>.html         — 결과 12종 (그 결과 하나 + 단짝·라이벌 한 쌍) + 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index + 결과 12종 × 11개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 채점·색·단짝/라이벌은 monster-core.js, 그림은 tools/art.js.
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·그림(정체불명)·h1(현지 검색어)·훅·시작 버튼. SEO 글·FAQ·광고 없음.
 *   - 질문 화면에 mg-ad 1자리. 결과 페이지 = 그 결과 + <div data-mg-end="monster">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 index 의 G.appLd(test).
 *   - 스포일러 금지: index 에는 결과 문구를 싣지 않는다(질문 문구만 PAGE_I18N 으로).
 *
 * 실행: node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'monster-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_ID = 'monster';
const SITE_ROOT = 'https://monster.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');

function ogImage(lang, name) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}${name}.png`;
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
<meta name="theme-color" content="#1a0d33">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${o.url}">
${G.hreflangTags(SITE_ROOT, o.rel)}

<meta property="og:type" content="${o.ogType || 'website'}">
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

// 배경: 달·별·박쥐 (CSS 애니메이션, prefers-reduced-motion 이면 멈춤)
const BAT = '<svg viewBox="0 0 64 32" aria-hidden="true"><path d="M32 10c2-4 5-5 5-5l1 4c3-3 9-4 13-2-3 1-4 4-4 6 4-1 9 0 13 3-5 0-8 2-10 5-3-2-7-2-10 0-2-2-5-3-8-3s-6 1-8 3c-3-2-7-2-10 0-2-3-5-5-10-5 4-3 9-4 13-3 0-2-1-5-4-6 4-2 10-1 13 2l1-4s3 1 5 5z" fill="currentColor"/></svg>';
function sky() {
  const bats = [1, 2, 3, 4].map((i) => `<span class="mon-bat mon-bat-${i}">${BAT}</span>`).join('');
  return `<div class="mon-sky" aria-hidden="true"><div class="mon-stars"></div><div class="mon-moon"></div>${bats}</div>`;
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
// 시작 + 질문 + 소환 중 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(monster.js)에서 쓰는 문구: 질문·보기 + 진행 표시. 결과 문구는 싣지 않는다(결과는 r/<id>.html).
  const runtime = { questions: T.questions, qLabel: T.quiz.qLabel };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang, 'default'),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="mon-body">
${sky()}
${G.topBar(lang, rel, { suggest: true })}

<main class="mon-shell">
  <!-- 시작 화면: 티징만 (배지·정체불명 그림·h1·훅·시작 버튼) — 질문·결과를 인용하지 않는다 -->
  <section id="screen-start" class="mon-screen mon-start">
    <p class="mon-badge">${esc(S.badge)}</p>
    <div class="mon-hero-art">${ART.svg('mystery')}</div>
    <h1 class="mon-h1"><span class="mon-kicker">${esc(S.h1Kicker)}</span><span class="mon-h1-main">${S.h1Html}</span></h1>
    <p class="mon-hook">${esc(S.hook)}</p>
    <p class="mon-meta"><span>${esc(S.metaTime)}</span><span>${esc(S.metaCount)}</span></p>
    <button id="start-btn" class="mon-btn mon-btn-primary" type="button">${esc(S.start)}</button>
  </section>

  <!-- 질문 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="mon-screen mon-quiz" hidden>
    <div class="mon-progress-row">
      <button id="back-btn" class="mon-back" type="button" aria-label="${esc(T.quiz.backAria)}">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="mon-progress" role="progressbar" aria-label="${esc(T.quiz.progressAria)}" aria-valuemin="0" aria-valuemax="${CORE.QUESTIONS.length}" aria-valuenow="0"><div id="progress-fill" class="mon-progress-fill"></div></div>
      <span id="progress-num" class="mon-progress-num">1 / ${CORE.QUESTIONS.length}</span>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 소환 중 -->
  <section id="screen-loading" class="mon-screen mon-loading" role="status" hidden>
    <div class="mon-cauldron" aria-hidden="true">
      <span class="mon-bubble mon-bubble-1"></span><span class="mon-bubble mon-bubble-2"></span><span class="mon-bubble mon-bubble-3"></span>
      <svg viewBox="0 0 160 120"><ellipse cx="80" cy="34" rx="62" ry="14" fill="#9be15d"/><path d="M22 36 C18 96 44 112 80 112 C116 112 142 96 138 36Z" fill="#2a1540" stroke="#140a24" stroke-width="5"/><ellipse cx="80" cy="34" rx="64" ry="14" fill="none" stroke="#140a24" stroke-width="6"/><path d="M40 112 L32 120 M120 112 L128 120" stroke="#140a24" stroke-width="7" stroke-linecap="round"/></svg>
    </div>
    <p class="mon-loading-text">${esc(T.loading.text)}</p>
    <p class="mon-loading-sub">${esc(T.loading.sub)}</p>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: G.scriptJson('PAGE_I18N', runtime), src: ['monster-core.js', 'monster.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 결과 (r/<id>.html) — 그 결과 하나 + 단짝·라이벌 한 쌍(보여주기만, 링크 없음 — 다른 결과 스포일러 금지) → 공통 끝 화면
// ---------------------------------------------------------------
function pairCard(T, kind, id) {
  const label = kind === 'best' ? T.result.bestLabel : T.result.rivalLabel;
  const meta = CORE.TYPES[id];
  return `
      <div class="mon-pair-card mon-pair-${kind}" style="--accent:${meta.color}">
        <span class="mon-pair-label">${esc(label)}</span>
        <span class="mon-pair-art">${ART.svg(id)}</span>
        <span class="mon-pair-name">${esc(T.types[id].name)}</span>
      </div>`;
}

function renderResult(lang, id) {
  const T = L10N[lang];
  const R = T.result;
  const meta = CORE.TYPES[id];
  const type = T.types[id];
  const rel = `r/${id}.html`;
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const title = G.fmt(R.title, { name: type.name });
  const desc = `${type.catch} ${type.party}`;
  const start = G.relHref(file, G.fileOf(lang, 'index.html'));
  // 공통 끝 화면에 넘길 앱별 값: 공유 = 이 결과 페이지(현재 언어), 다시 하기 = 같은 언어의 시작 화면
  const page = {
    id,
    share: { title, text: G.fmt(R.shareText, { name: type.name, emoji: meta.emoji, catch: type.catch }), url },
    retry: { label: R.retry, action: start },
    sameShare: R.sameShare,
  };

  return `${head(lang, T, {
    file, rel, url,
    title: `${title} | ${G.brandOf(lang)}`,
    desc, ogType: 'article', ogTitle: title, ogDesc: type.catch, ogImage: ogImage(lang, id),
  })}
<body class="mon-body mon-result-page" style="--accent:${meta.color}">
${sky()}
${G.topBar(lang, rel, { suggest: true })}

<main class="mon-shell">
  <a id="share-cta" class="mon-cta" href="${start}" hidden>
    <span class="mon-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="mon-cta-arrow" aria-hidden="true">→</span>
  </a>

  <article class="mon-card" aria-labelledby="result-name">
    <div class="mon-card-art">${ART.svg(id)}</div>
    <h1 id="result-name" class="mon-result-title"><span class="mon-eyebrow">${esc(R.eyebrow)}</span><span class="mon-result-name">${esc(type.name)}</span></h1>
    <p class="mon-catch">${esc(type.catch)}</p>
    <p id="same-share" class="mon-same" hidden></p>
    <p class="mon-desc">${esc(type.desc)}</p>
    <h2 class="mon-sub">${esc(R.strengthsLabel)}</h2>
    <ul class="mon-chips">
      ${type.strengths.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    <div class="mon-party">
      <h2 class="mon-sub">${esc(R.partyLabel)}</h2>
      <p>${esc(type.party)}</p>
    </div>
  </article>

  <div class="mon-pair">${pairCard(T, 'best', meta.best)}${pairCard(T, 'rival', meta.rival)}
  </div>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('MON_RESULT', page)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['monster-core.js', 'result.js'] })}
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

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang, 'default') })}
<body class="mon-body">
${sky()}
${G.topBar(lang, rel, { suggest: true })}
<main class="mon-shell">
  <div class="mon-doc">
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
    const T = L10N[code];
    CORE.ORDER.forEach((id) => {
      if (!T.types[id]) throw new Error(`[${code}] types.${id} 누락`);
      G.writeOut(SITE_DIR, G.fileOf(code, `r/${id}.html`), renderResult(code, id));
      n++;
    });
    G.writeOut(SITE_DIR, G.fileOf(code, 'index.html'), renderIndex(code));
    G.writeOut(SITE_DIR, G.fileOf(code, 'privacy.html'), renderPrivacy(code));
    n += 2;
  });
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy + 결과 ${CORE.ORDER.length}개) = HTML ${n}개`);
  const rels = ['index.html', ...CORE.ORDER.map((id) => `r/${id}.html`)];
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, rels));
  console.log(`생성 완료: sitemap.xml (URL ${rels.length * G.LOCALES.length}개, hreflang 대체 링크 포함)`);
}

main();
