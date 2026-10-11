#!/usr/bin/env node
/**
 * MBTI 테스트(비공식 16가지 성격 유형 재미 테스트)의 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html          — 시작(티징만) → 20문항(5단계) → 분석 중 → r/<id>.html#d=<축 비율> 로 이동
 *   r/<id>.html, <dir>/r/<id>.html         — 유형 16종 (그 결과 하나 + 축 비율 막대 + 장점·약점·일·연애 + 찰떡궁합·상극(보여주기만)
 *                                            + 비공식 안내 한 줄) + 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index + 결과 16종 × 12개 언어, xhtml:link hreflang + lastmod) — 보통 모드에서만
 * 문구는 tools/i18n/<lang>.js, 채점·색·궁합은 mbti-core.js, 그림은 tools/art.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·물음표 타일 그림·h1(현지 검색어)·훅·시간/문항 수·시작 버튼, 맨 아래 mg-ad-start 1개.
 *   - 질문 화면에 mg-ad 1자리. 결과 페이지 = 그 결과 + <div data-mg-end="mbti">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 index 의 G.appLd(test).
 *   - 스포일러 금지: index 에는 결과 문구·유형 코드를 싣지 않는다(질문 문구만 PAGE_I18N 으로). 결과 페이지는 다른 결과로 가는 링크 0개.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'mbti-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_ID = 'mbti';
const SITE_ROOT = 'https://mbti.example.com';
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
<meta name="theme-color" content="#f7f4ff">
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

// 배경: 떠다니는 글자 조각 (CSS 애니메이션, prefers-reduced-motion 이면 멈춤) — 특정 유형을 이루지 않는 기호만
function floaters() {
  return '<div class="mb-floaters" aria-hidden="true"><span class="mb-fl mb-fl-1">◆</span><span class="mb-fl mb-fl-2">●</span><span class="mb-fl mb-fl-3">▲</span><span class="mb-fl mb-fl-4">■</span></div>';
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
// 시작 + 질문 + 분석 중 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(mbti.js)에서 쓰는 문구: 질문 + 척도 + 진행 표시. 결과 문구는 싣지 않는다(결과는 r/<id>.html).
  const runtime = { questions: T.questions.map((q) => q.q), scale: T.quiz.scale, qLabel: T.quiz.qLabel };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang, 'default'),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="mb-body">
${floaters()}
${G.topBar(lang, rel, { suggest: true })}

<main class="mb-shell">
  <!-- 시작 화면: 티징만 (배지·물음표 타일·h1·훅·시간/문항 수·시작 버튼) — 질문·결과를 인용하지 않는다 -->
  <section id="screen-start" class="mb-screen mb-start">
    <p class="mb-badge">${esc(S.badge)}</p>
    ${ART.hero('mystery', 'mb-hero-start')}
    <h1 class="mb-h1"><span class="mb-kicker">${esc(S.h1Kicker)}</span><span class="mb-h1-main">${S.h1Html}</span></h1>
    <p class="mb-hook">${esc(S.hook)}</p>
    <p class="mb-meta"><span>${esc(S.metaTime)}</span><span>${esc(S.metaCount)}</span></p>
    <button id="start-btn" class="mb-btn mb-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 질문 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="mb-screen mb-quiz" hidden>
    <div class="mb-progress-row">
      <button id="back-btn" class="mb-back" type="button" aria-label="${esc(T.quiz.backAria)}">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="mb-progress" role="progressbar" aria-label="${esc(T.quiz.progressAria)}" aria-valuemin="0" aria-valuemax="${CORE.QUESTIONS.length}" aria-valuenow="0"><div id="progress-fill" class="mb-progress-fill"></div></div>
      <span id="progress-num" class="mb-progress-num">1 / ${CORE.QUESTIONS.length}</span>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 분석 중 -->
  <section id="screen-loading" class="mb-screen mb-loading" role="status" hidden>
    ${ART.hero('mystery', 'mb-hero-loading')}
    <p class="mb-loading-text">${esc(T.loading.text)}</p>
    <p class="mb-loading-sub">${esc(T.loading.sub)}</p>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: G.scriptJson('PAGE_I18N', runtime), src: ['mbti-core.js', 'mbti.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 결과 (r/<id>.html) — 그 결과 하나 + 찰떡궁합·상극(보여주기만, 링크 없음 — 다른 결과 스포일러 금지) → 공통 끝 화면
// ---------------------------------------------------------------
function colorVars(id) {
  const c = CORE.TYPES[id];
  return `--c-main:${c.color};--c-deep:${c.deep};--c-ink:${c.ink}`;
}

function pairCard(T, kind, id) {
  const label = kind === 'best' ? T.result.bestLabel : T.result.clashLabel;
  return `
      <div class="mb-pair-card mb-pair-${kind}" style="${colorVars(id)}">
        <span class="mb-pair-label">${esc(label)}</span>
        <span class="mb-pair-art">${ART.mini(id)}</span>
        <span class="mb-pair-code">${esc(CORE.TYPES[id].code)}</span>
        <span class="mb-pair-name">${esc(T.types[id].name)}</span>
      </div>`;
}

// 축 비율 막대 4줄 — 값은 result.js 가 #d= 에서 읽어 채운다(실제 답에서 계산한 값만, 없으면 통째로 숨김)
function axisBars(T, id) {
  const code = CORE.TYPES[id].code;
  return CORE.AXES.map(([a, b], i) => {
    const win = code[i] === a ? 'a' : 'b';
    return `
      <div class="mb-axis mb-axis-${i + 1} mb-win-${win}">
        <div class="mb-axis-top">
          <span class="mb-pole mb-pole-a"><b>${a}</b> ${esc(T.axes[i].a)}</span>
          <span class="mb-pole mb-pole-b">${esc(T.axes[i].b)} <b>${b}</b></span>
        </div>
        <div class="mb-track"><span class="mb-fill" data-axis="${i}"></span></div>
        <div class="mb-axis-pct"><span data-pct-a="${i}"></span><span data-pct-b="${i}"></span></div>
      </div>`;
  }).join('');
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
  const vars = { code: meta.code, name: type.name, emoji: meta.emoji, vibe: type.vibe };
  const title = G.fmt(R.title, vars);
  const desc = G.fmt(R.metaDesc, vars);
  const start = G.relHref(file, G.fileOf(lang, 'index.html'));
  // result.js 에 넘길 값: 공유(이 결과 페이지 + 축 비율 #d=), 다시 하기 = 시작 화면
  const page = {
    id,
    share: { title, text: G.fmt(R.shareText, vars), url },
    retry: { label: R.retry, action: start },
    sameShare: R.sameShare,
  };

  return `${head(lang, T, {
    file, rel, url,
    title: `${title} | ${G.brandOf(lang)}`,
    desc, ogType: 'article', ogTitle: title, ogDesc: type.vibe, ogImage: ogImage(lang, id),
  })}
<body class="mb-body mb-result-page" style="${colorVars(id)}">
${floaters()}
${G.topBar(lang, rel, { suggest: true })}

<main class="mb-shell">
  <a id="share-cta" class="mb-cta" href="${start}" hidden>
    <span class="mb-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="mb-cta-arrow" aria-hidden="true">→</span>
  </a>

  <article class="mb-card" aria-labelledby="result-name">
    <div class="mb-card-art">${ART.hero(id, 'mb-hero-result')}</div>
    <p class="mb-eyebrow">${esc(R.eyebrow)}</p>
    <h1 id="result-name" class="mb-result-title"><span class="mb-result-code">${esc(meta.code)}</span><span class="mb-result-name">${esc(type.name)}</span></h1>
    <p class="mb-vibe">${esc(type.vibe)}</p>
    <p id="same-share" class="mb-same" hidden></p>

    <div id="axis-bars" class="mb-bars" hidden>
      <h2 class="mb-sub">${esc(R.barsLabel)}</h2>${axisBars(T, id)}
    </div>

    <p class="mb-desc">${esc(type.desc)}</p>
    <div class="mb-two">
      <div class="mb-list mb-list-good">
        <h2 class="mb-sub">${esc(R.strengthsLabel)}</h2>
        <ul class="mb-chips">
          ${type.strengths.map((s) => `<li>${esc(s)}</li>`).join('\n          ')}
        </ul>
      </div>
      <div class="mb-list mb-list-blind">
        <h2 class="mb-sub">${esc(R.blindLabel)}</h2>
        <ul class="mb-chips mb-chips-blind">
          ${type.blind.map((s) => `<li>${esc(s)}</li>`).join('\n          ')}
        </ul>
      </div>
    </div>
    <div class="mb-style">
      <h2 class="mb-sub">💼 ${esc(R.workLabel)}</h2>
      <p>${esc(type.work)}</p>
      <h2 class="mb-sub">💞 ${esc(R.loveLabel)}</h2>
      <p>${esc(type.love)}</p>
    </div>
  </article>

  <div class="mb-pair">${pairCard(T, 'best', meta.best)}${pairCard(T, 'clash', meta.clash)}
  </div>

  <p class="mb-disclaimer">${esc(R.disclaimer)}</p>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('MBTI_RESULT', page)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['mbti-core.js', 'result.js'] })}
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
<body class="mb-body">
${floaters()}
${G.topBar(lang, rel, { suggest: true })}
<main class="mb-shell">
  <div class="mb-doc">
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
