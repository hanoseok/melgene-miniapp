#!/usr/bin/env node
/**
 * 퍼스널 컬러 테스트의 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html          — 시작(티징만) → 거울 앞 자가진단 12문항 → 팔레트 섞는 중 → r/<id>.html 로 이동
 *   r/<id>.html, <dir>/r/<id>.html         — 결과 8종: 그 결과 하나 + 내 답이 기운 쪽(방금 푼 사람만, result.js) + 베스트 컬러 칩 8개
 *                                            + 피하면 좋은 색 4개 + 메이크업·헤어·주얼리 팁 + 재미용 안내(전문 드레이핑 진단 아님) + 공통 끝 화면.
 *                                            다른 결과로 가는 링크·이름 없음.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index + 결과 8종 × 12개 언어, xhtml:link hreflang + lastmod) — 보통 모드에서만
 * 문구는 tools/i18n/<lang>.js, 채점·색은 color-core.js, 그림은 tools/art.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp): 시작 화면 = 티징 + 맨 아래 mg-ad-start 1개, 질문 화면 mg-ad 1자리,
 * 결과 페이지 = 그 결과 + <div data-mg-end="color">, FAQ 는 끝 화면에만(MG_FAQ), FAQPage JSON-LD 없음, 스포일러·가짜 숫자 금지.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'color-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_ID = 'color';
const SITE_ROOT = 'https://color.example.com';
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
<meta name="theme-color" content="#fbf5f7">
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

// 배경: 창가 자연광처럼 따뜻한 빛과 시원한 빛 두 덩어리가 천천히 숨 쉬고, 작은 색 점 몇 개 (CSS 애니메이션, prefers-reduced-motion 이면 멈춤)
function doodles() {
  return '<div class="pc-sky" aria-hidden="true"><span class="pc-blob pc-blob-w"></span><span class="pc-blob pc-blob-c"></span><span class="pc-dot pc-dot-1"></span><span class="pc-dot pc-dot-2"></span><span class="pc-dot pc-dot-3"></span></div>';
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
// 시작 + 질문 12개 + 팔레트 섞는 중 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(color.js)에서 쓰는 문구: 상황·보기 + 진행 표시. 결과 문구는 싣지 않는다(결과는 r/<id>.html).
  const runtime = { questions: T.questions, qLabel: T.quiz.qLabel };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang, 'default'),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="pc-body">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}

<main class="pc-shell">
  <!-- 시작 화면: 티징만 (배지·물음표 컬러 부채·h1·훅·시간/문항 수·시작 버튼) — 질문·결과를 인용하지 않는다 -->
  <section id="screen-start" class="pc-screen pc-start">
    <p class="pc-badge">${esc(S.badge)}</p>
    ${ART.hero('mystery', 'pc-hero-start')}
    <h1 class="pc-h1"><span class="pc-kicker">${esc(S.h1Kicker)}</span><span class="pc-h1-main">${S.h1Html}</span></h1>
    <p class="pc-hook">${esc(S.hook)}</p>
    <p class="pc-meta"><span>${esc(S.metaTime)}</span><span>${esc(S.metaCount)}</span></p>
    <button id="start-btn" class="pc-btn pc-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 질문 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="pc-screen pc-quiz" hidden>
    <div class="pc-progress-row">
      <button id="back-btn" class="pc-back" type="button" aria-label="${esc(T.quiz.backAria)}">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="pc-progress" role="progressbar" aria-label="${esc(T.quiz.progressAria)}" aria-valuemin="0" aria-valuemax="${CORE.QUESTIONS.length}" aria-valuenow="0"><div id="progress-fill" class="pc-progress-fill"></div></div>
      <span id="progress-num" class="pc-progress-num">1 / ${CORE.QUESTIONS.length}</span>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 팔레트 섞는 중 -->
  <section id="screen-loading" class="pc-screen pc-loading" role="status" hidden>
    ${ART.hero('mystery', 'pc-hero-loading')}
    <p class="pc-loading-text">${esc(T.loading.text)}</p>
    <p class="pc-loading-sub">${esc(T.loading.sub)}</p>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: G.scriptJson('PAGE_I18N', runtime), src: ['color-core.js', 'color.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 결과 (r/<id>.html) — 그 결과 하나 + 내 답이 기운 쪽(숨김) + 베스트/피할 색 칩 + 팁 → 공통 끝 화면 (다른 결과 링크·이름 없음)
// ---------------------------------------------------------------
function colorVars(id) {
  const c = CORE.TYPES[id];
  return `--c-main:${c.main};--c-deep:${c.deep};--c-ink:${c.ink}`;
}

function swatches(list, cls) {
  return list.map((hex) => `<li class="pc-sw ${cls}"><span class="pc-chip" style="background:${hex}"></span><span class="pc-hex">${hex.toUpperCase()}</span></li>`).join('\n      ');
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
  const desc = G.fmt(R.metaDesc, { name: type.name, vibe: type.vibe });
  const start = G.relHref(file, G.fileOf(lang, 'index.html'));
  // result.js 에 넘길 값: 공유(이 결과 페이지), 다시 하기 = 시작 화면
  const page = {
    id,
    share: { title, text: G.fmt(R.shareText, { name: type.name, emoji: meta.emoji, vibe: type.vibe }), url },
    retry: { label: R.retry, action: start },
    sameShare: R.sameShare,
  };

  return `${head(lang, T, {
    file, rel, url,
    title: `${title} | ${G.brandOf(lang)}`,
    desc, ogType: 'article', ogTitle: title, ogDesc: type.vibe, ogImage: ogImage(lang, id),
  })}
<body class="pc-body pc-result-page" style="${colorVars(id)}">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}

<main class="pc-shell">
  <a id="share-cta" class="pc-cta" href="${start}" hidden>
    <span class="pc-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="pc-cta-arrow" aria-hidden="true">→</span>
  </a>

  <article class="pc-card" aria-labelledby="result-name">
    <div class="pc-card-art">${ART.hero(id, 'pc-hero-result')}</div>
    <p class="pc-eyebrow">${esc(R.eyebrow)}</p>
    <h1 id="result-name" class="pc-result-title"><span class="pc-result-name">${esc(type.name)}</span></h1>
    <p class="pc-vibe">${esc(type.vibe)}</p>
    <ul class="pc-keys">
      ${type.keywords.map((k) => `<li>${esc(k)}</li>`).join('\n      ')}
    </ul>
    <div id="lean" class="pc-lean" hidden>
      <span class="pc-lean-label">${esc(R.gaugeLabel)}</span>
      ${R.axes.map(([l, r]) => `<div class="pc-lean-row"><span class="pc-lean-end">${esc(l)}</span><span class="pc-lean-track"><span class="pc-lean-dot"></span></span><span class="pc-lean-end pc-lean-end-r">${esc(r)}</span></div>`).join('\n      ')}
    </div>
    <p id="same-share" class="pc-same" hidden></p>
    <p class="pc-desc">${esc(type.desc)}</p>

    <h2 class="pc-sub"><span aria-hidden="true">✨</span> ${esc(R.paletteLabel)}</h2>
    <ul class="pc-swatches">
      ${swatches(meta.best, 'pc-sw-best')}
    </ul>
    <h2 class="pc-sub"><span aria-hidden="true">🙅</span> ${esc(R.avoidLabel)}</h2>
    <ul class="pc-swatches pc-swatches-avoid">
      ${swatches(meta.avoid, 'pc-sw-avoid')}
    </ul>
    <p class="pc-avoid-note">${esc(R.avoidNote)}</p>

    <div class="pc-notes">
      <div class="pc-note">
        <h2 class="pc-sub"><span aria-hidden="true">💄</span> ${esc(R.makeupLabel)}</h2>
        <p>${esc(type.makeup)}</p>
      </div>
      <div class="pc-note">
        <h2 class="pc-sub"><span aria-hidden="true">💇</span> ${esc(R.hairLabel)}</h2>
        <p>${esc(type.hair)}</p>
      </div>
      <div class="pc-note">
        <h2 class="pc-sub"><span aria-hidden="true">💍</span> ${esc(R.jewelryLabel)}</h2>
        <p>${esc(type.jewelry)}</p>
      </div>
    </div>
  </article>

  <p class="pc-disclaimer">${esc(R.disclaimer)}</p>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('COLOR_RESULT', page)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['color-core.js', 'result.js'] })}
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

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang, 'default') })}
<body class="pc-body">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}
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
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy + 결과 ${CORE.ORDER.length}개) = HTML ${n}개${G.MODE === 'variant' ? ' (숨은 변형 _l/)' : ''}`);
  if (G.MODE !== 'variant') {
    const rels = ['index.html', ...CORE.ORDER.map((id) => `r/${id}.html`)];
    G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, rels));
    console.log(`생성 완료: sitemap.xml (URL ${rels.length * G.LOCALES.length}개, hreflang 대체 링크 포함)`);
  }
}

main();
