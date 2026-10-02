#!/usr/bin/env node
/**
 * 오라 컬러 테스트의 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html          — 시작(티징만) → 질문 12개 → 오라 읽는 중 → r/<id>.html 로 이동
 *   r/<id>.html, <dir>/r/<id>.html         — 결과 8종 (그 결과 하나 + 찰떡·상극 오라 한 쌍, 보여주기만) + 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index + 결과 8종 × 12개 언어, xhtml:link hreflang + lastmod) — 보통 모드에서만
 * 문구는 tools/i18n/<lang>.js, 채점·색·찰떡/상극은 aura-core.js, 그림은 tools/art.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·정체불명(진주빛) 오라·h1(현지 검색어)·훅·시간/문항 수·시작 버튼. SEO 글·FAQ·광고 없음.
 *   - 질문 화면에 mg-ad 1자리. 결과 페이지 = 그 결과 + <div data-mg-end="aura">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 index 의 G.appLd(test).
 *   - 스포일러 금지: index 에는 결과 문구를 싣지 않는다(질문 문구만 PAGE_I18N 으로). 결과 페이지는 다른 결과로 가는 링크 0개.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'aura-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_ID = 'aura';
const SITE_ROOT = 'https://aura.example.com';
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
<meta name="theme-color" content="#120c2a">
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

// 배경: 떠다니는 빛 알갱이 (CSS 애니메이션, prefers-reduced-motion 이면 멈춤)
function sky() {
  return '<div class="au-sky" aria-hidden="true"><span class="au-mote au-mote-1"></span><span class="au-mote au-mote-2"></span><span class="au-mote au-mote-3"></span><span class="au-mote au-mote-4"></span><span class="au-mote au-mote-5"></span></div>';
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
// 시작 + 질문 + 오라 읽는 중 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(aura.js)에서 쓰는 문구: 질문·보기 + 진행 표시. 결과 문구는 싣지 않는다(결과는 r/<id>.html).
  const runtime = { questions: T.questions, qLabel: T.quiz.qLabel };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang, 'default'),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="au-body">
${sky()}
${G.topBar(lang, rel, { suggest: true })}

<main class="au-shell">
  <!-- 시작 화면: 티징만 (배지·정체불명 오라·h1·훅·시간/문항 수·시작 버튼) — 질문·결과를 인용하지 않는다 -->
  <section id="screen-start" class="au-screen au-start">
    <p class="au-badge">${esc(S.badge)}</p>
    <div class="au-hero-art au-mystery">${ART.svg('mystery', { uid: 'hero' })}</div>
    <h1 class="au-h1"><span class="au-kicker">${esc(S.h1Kicker)}</span><span class="au-h1-main">${S.h1Html}</span></h1>
    <p class="au-hook">${esc(S.hook)}</p>
    <p class="au-meta"><span>${esc(S.metaTime)}</span><span>${esc(S.metaCount)}</span></p>
    <button id="start-btn" class="au-btn au-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 질문 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="au-screen au-quiz" hidden>
    <div class="au-progress-row">
      <button id="back-btn" class="au-back" type="button" aria-label="${esc(T.quiz.backAria)}">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="au-progress" role="progressbar" aria-label="${esc(T.quiz.progressAria)}" aria-valuemin="0" aria-valuemax="${CORE.QUESTIONS.length}" aria-valuenow="0"><div id="progress-fill" class="au-progress-fill"></div></div>
      <span id="progress-num" class="au-progress-num">1 / ${CORE.QUESTIONS.length}</span>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 오라 읽는 중 -->
  <section id="screen-loading" class="au-screen au-loading" role="status" hidden>
    <div class="au-reading au-mystery" aria-hidden="true">${ART.svg('mystery', { uid: 'load' })}</div>
    <p class="au-loading-text">${esc(T.loading.text)}</p>
    <p class="au-loading-sub">${esc(T.loading.sub)}</p>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: G.scriptJson('PAGE_I18N', runtime), src: ['aura-core.js', 'aura.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 결과 (r/<id>.html) — 그 결과 하나 + 찰떡·상극 오라(보여주기만, 링크 없음 — 다른 결과 스포일러 금지) → 공통 끝 화면
// ---------------------------------------------------------------
function colorVars(id) {
  const c = CORE.TYPES[id];
  return `--a-core:${c.core};--a-mid:${c.mid};--a-edge:${c.edge};--a-ink:${c.ink}`;
}

function pairCard(T, kind, id) {
  const label = kind === 'best' ? T.result.bestLabel : T.result.clashLabel;
  return `
      <div class="au-pair-card au-pair-${kind}" style="${colorVars(id)}">
        <span class="au-pair-label">${esc(label)}</span>
        <span class="au-pair-art">${ART.orb(id, kind)}</span>
        <span class="au-pair-name">${esc(T.types[id].name)}</span>
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
  const desc = `${type.vibe} ${type.others}`;
  const start = G.relHref(file, G.fileOf(lang, 'index.html'));
  // 공통 끝 화면에 넘길 앱별 값: 공유 = 이 결과 페이지(언어 없는 주소는 common.js 의 mgCleanUrl 이 만든다), 다시 하기 = 시작 화면
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
<body class="au-body au-result-page" style="${colorVars(id)}">
${sky()}
${G.topBar(lang, rel, { suggest: true })}

<main class="au-shell">
  <a id="share-cta" class="au-cta" href="${start}" hidden>
    <span class="au-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="au-cta-arrow" aria-hidden="true">→</span>
  </a>

  <article class="au-card" aria-labelledby="result-name">
    <div class="au-card-art">${ART.svg(id, { uid: 'main' })}</div>
    <h1 id="result-name" class="au-result-title"><span class="au-eyebrow">${esc(R.eyebrow)}</span><span class="au-result-name">${esc(type.name)}</span></h1>
    <p class="au-vibe">${esc(type.vibe)}</p>
    <p id="same-share" class="au-same" hidden></p>
    <p class="au-desc">${esc(type.desc)}</p>
    <h2 class="au-sub">${esc(R.strengthsLabel)}</h2>
    <ul class="au-chips">
      ${type.strengths.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
    <div class="au-others">
      <h2 class="au-sub">${esc(R.othersLabel)}</h2>
      <p>${esc(type.others)}</p>
    </div>
  </article>

  <div class="au-pair">${pairCard(T, 'best', meta.best)}${pairCard(T, 'clash', meta.clash)}
  </div>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('AURA_RESULT', page)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['aura-core.js', 'result.js'] })}
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
<body class="au-body">
${sky()}
${G.topBar(lang, rel, { suggest: true })}
<main class="au-shell">
  <div class="au-doc">
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
