#!/usr/bin/env node
/**
 * 멘탈 강도 테스트의 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html          — 시작(티징만) → 12문항 → 분석 중 → r/<id>.html 로 이동
 *   r/<id>.html, <dir>/r/<id>.html         — 결과 8종: 그 결과 하나(그림·이름·한 줄·키워드 3) + 멘탈 게이지 0~100(본인 답, result.js) + 같은 결과 비율(서버 실제 값)
 *                                            + 설명 + 강점 4 + 팁 2 + 충전법 + 단짝·라이벌(그림·이름만 보여주기, 링크 없음)
 *                                            + 재미용 안내 + 공통 끝 화면. 다른 결과로 가는 링크 없음.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index + 결과 8종 × 12개 언어, xhtml:link hreflang + lastmod) — 보통 모드에서만
 * 문구는 tools/i18n/<lang>.js, 채점·색은 mental-core.js, 그림은 tools/art.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp): 시작 화면 = 티징 + 맨 아래 mg-ad-start 1개, 질문 화면 mg-ad 1자리,
 * 결과 페이지 = 그 결과 + <div data-mg-end="mental">, FAQ 는 끝 화면에만(MG_FAQ), FAQPage JSON-LD 없음, 스포일러·가짜 숫자 금지.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'mental-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_ID = 'mental';
const SITE_ROOT = 'https://mental.example.com';
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
<meta name="theme-color" content="#f7f5fb">
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

// 배경: 떠다니는 장식(결과를 암시하지 않는 것만, prefers-reduced-motion 이면 멈춤)
function doodles() {
  return '<div class="mt-sky" aria-hidden="true"><span class="mt-float mt-float-1">🫧</span><span class="mt-float mt-float-2">✨</span><span class="mt-float mt-float-3">🛡️</span><span class="mt-float mt-float-4">⚙️</span></div>';
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
// 시작 + 질문 12개 + 분석 중 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(mental.js)에서 쓰는 문구: 상황·보기 + 진행 표시. 결과 문구는 싣지 않는다(결과는 r/<id>.html).
  const runtime = { questions: T.questions, qLabel: T.quiz.qLabel };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang, 'default'),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="mt-body">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}

<main class="mt-shell">
  <!-- 시작 화면: 티징만 (배지·물음표 콩 그림·h1·훅·시간/문항 수·시작 버튼) — 질문·결과를 인용하지 않는다 -->
  <section id="screen-start" class="mt-screen mt-start">
    <p class="mt-badge">${esc(S.badge)}</p>
    ${ART.hero('mystery', 'mt-hero-start')}
    <h1 class="mt-h1"><span class="mt-kicker">${esc(S.h1Kicker)}</span><span class="mt-h1-main">${S.h1Html}</span></h1>
    <p class="mt-hook">${esc(S.hook)}</p>
    <p class="mt-meta"><span>${esc(S.metaTime)}</span><span>${esc(S.metaCount)}</span></p>
    <button id="start-btn" class="mt-btn mt-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 질문 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="mt-screen mt-quiz" hidden>
    <div class="mt-progress-row">
      <button id="back-btn" class="mt-back" type="button" aria-label="${esc(T.quiz.backAria)}">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="mt-progress" role="progressbar" aria-label="${esc(T.quiz.progressAria)}" aria-valuemin="0" aria-valuemax="${CORE.QUESTIONS.length}" aria-valuenow="0"><div id="progress-fill" class="mt-progress-fill"></div></div>
      <span id="progress-num" class="mt-progress-num">1 / ${CORE.QUESTIONS.length}</span>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 분석 중 -->
  <section id="screen-loading" class="mt-screen mt-loading" role="status" hidden>
    ${ART.hero('mystery', 'mt-hero-loading')}
    <p class="mt-loading-text">${esc(T.loading.text)}</p>
    <p class="mt-loading-sub">${esc(T.loading.sub)}</p>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: G.scriptJson('PAGE_I18N', runtime), src: ['mental-core.js', 'mental.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 결과 (r/<id>.html) — 그 결과 하나 + 찰떡궁합·라이벌(그림·이름만, 링크 없음) → 공통 끝 화면
// ---------------------------------------------------------------
function colorVars(id) {
  const c = CORE.TYPES[id];
  return `--c-main:${c.main};--c-deep:${c.deep};--c-ink:${c.ink}`;
}

// 찰떡궁합·라이벌: 그림·이름만 보여 준다. <a> 가 아니고 누를 수 있어 보이는 모양도 없다(다른 결과 스포일러 금지).
function pairCard(T, kind, id) {
  const label = kind === 'best' ? T.result.bestLabel : T.result.rivalLabel;
  const meta = CORE.TYPES[id];
  return `
      <div class="mt-pair-card mt-pair-${kind}" style="--accent:${meta.main}">
        <span class="mt-pair-label">${esc(label)}</span>
        <span class="mt-pair-art">${ART.mini(id)}</span>
        <span class="mt-pair-name">${esc(T.types[id].name)}</span>
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
  const vars = { name: type.name, emoji: meta.emoji, vibe: type.vibe };
  const title = G.fmt(R.title, vars);
  const desc = G.fmt(R.metaDesc, vars);
  const start = G.relHref(file, G.fileOf(lang, 'index.html'));
  // result.js 에 넘길 값: 공유(이 결과 페이지), 다시 하기 = 시작 화면
  const page = {
    id,
    share: { title, text: G.fmt(R.shareText, vars), url },
    retry: { label: R.retry, action: start },
    sameShare: R.sameShare,
    scoreFmt: R.scoreFmt, bandLow: R.bandLow, bandMid: R.bandMid, bandHigh: R.bandHigh,
  };

  return `${head(lang, T, {
    file, rel, url,
    title: `${title} | ${G.brandOf(lang)}`,
    desc, ogType: 'article', ogTitle: title, ogDesc: type.vibe, ogImage: ogImage(lang, id),
  })}
<body class="mt-body mt-result-page" style="${colorVars(id)}">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}

<main class="mt-shell">
  <a id="share-cta" class="mt-cta" href="${start}" hidden>
    <span class="mt-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="mt-cta-arrow" aria-hidden="true">→</span>
  </a>

  <article class="mt-card" aria-labelledby="result-name">
    <div class="mt-card-art">${ART.hero(id, 'mt-hero-result')}</div>
    <p class="mt-eyebrow">${esc(R.eyebrow)}</p>
    <h1 id="result-name" class="mt-result-title"><span class="mt-result-name">${esc(type.name)}</span></h1>
    <p class="mt-vibe">${esc(type.vibe)}</p>
    <ul class="mt-keys">
      ${type.keywords.map((k) => `<li>${esc(k)}</li>`).join('\n      ')}
    </ul>
    <p id="same-share" class="mt-same" hidden></p>

    <!-- 멘탈 게이지: 본인 답(#s= 또는 방금 푼 세션)으로 result.js 가 채운다. 값이 없으면 숨긴 채(지어낸 값 없음) -->
    <div id="g-bar" class="mt-gauge" role="meter" aria-label="${esc(R.gaugeTitle)}" aria-valuemin="0" aria-valuemax="100" hidden>
      <p class="mt-gauge-title">${esc(R.gaugeTitle)}</p>
      <p class="mt-gauge-score"><span id="g-num" class="mt-gauge-num"></span><span class="mt-gauge-max">/ 100</span></p>
      <div class="mt-gauge-track"><div id="g-fill" class="mt-gauge-fill"></div></div>
      <div class="mt-gauge-labels"><span class="mt-gauge-lo">${esc(R.gaugeLow)}</span><span class="mt-gauge-hi">${esc(R.gaugeHigh)}</span></div>
      <p id="g-lean" class="mt-gauge-lean"></p>
      <p class="mt-gauge-note">${esc(R.gaugeNote)}</p>
    </div>

    <p class="mt-desc">${esc(type.desc)}</p>

    <h2 class="mt-sub"><span aria-hidden="true">✨</span> ${esc(R.traitsLabel)}</h2>
    <ul class="mt-traits">
      ${type.traits.map((j) => `<li>${esc(j)}</li>`).join('\n      ')}
    </ul>

    <h2 class="mt-sub"><span aria-hidden="true">💡</span> ${esc(R.tipsLabel)}</h2>
    <ul class="mt-tips">
      ${type.tips.map((j) => `<li>${esc(j)}</li>`).join('\n      ')}
    </ul>

    <div class="mt-note">
      <h2 class="mt-sub"><span aria-hidden="true">🌟</span> ${esc(R.perfectLabel)}</h2>
      <p class="mt-perfect">${esc(type.perfect)}</p>
    </div>

    <div class="mt-pair">${pairCard(T, 'best', meta.best)}${pairCard(T, 'rival', meta.rival)}
    </div>
  </article>

  <p class="mt-disclaimer">${esc(R.disclaimer)}</p>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('MENTAL_RESULT', page)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['mental-core.js', 'result.js'] })}
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
<body class="mt-body">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}
<main class="mt-shell">
  <div class="mt-doc">
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
