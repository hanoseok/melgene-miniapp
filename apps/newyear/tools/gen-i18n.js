#!/usr/bin/env node
/**
 * 새해 운세 테스트의 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html          — 시작(티징만) → 11문항 → 해돋이 기다리는 중 → r/<id>.html 로 이동
 *   r/<id>.html, <dir>/r/<id>.html         — 결과 8종: 그 결과 하나(올해의 키워드) + 행운의 색·달·물건(core 재미 설정값) + 내 답이 기운 쪽(방금 푼 사람만, result.js)
 *                                            + 네 영역 운세·작은 다짐 + 잘 맞는/정반대 키워드(보여주기만, 링크 없음) + 재미용 안내 + 공통 끝 화면.
 *                                            다른 결과로 가는 링크 없음.
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index + 결과 8종 × 12개 언어, xhtml:link hreflang + lastmod) — 보통 모드에서만
 * 문구는 tools/i18n/<lang>.js, 채점·색·연도는 newyear-core.js, 그림은 tools/art.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp): 시작 화면 = 티징 + 맨 아래 mg-ad-start 1개, 질문 화면 mg-ad 1자리,
 * 결과 페이지 = 그 결과 + <div data-mg-end="newyear">, FAQ 는 끝 화면에만(MG_FAQ), FAQPage JSON-LD 없음, 스포일러·가짜 숫자 금지.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'newyear-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_ID = 'newyear';
const SITE_ROOT = 'https://newyear.example.com';
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
<meta name="theme-color" content="#1a1f4a">
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

// 배경: 새벽 노을 빛 + 천천히 떠오르는 불꽃·별 (CSS 애니메이션, prefers-reduced-motion 이면 멈춤)
function doodles() {
  return '<div class="ny-sky" aria-hidden="true"><span class="ny-glow"></span><span class="ny-fw ny-fw-1"></span><span class="ny-fw ny-fw-2"></span><span class="ny-fw ny-fw-3"></span><span class="ny-twinkle ny-twinkle-1"></span><span class="ny-twinkle ny-twinkle-2"></span><span class="ny-twinkle ny-twinkle-3"></span></div>';
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
// 시작 + 질문 11개 + 해돋이 기다리는 중 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(newyear.js)에서 쓰는 문구: 상황·보기 + 진행 표시. 결과 문구는 싣지 않는다(결과는 r/<id>.html).
  const runtime = { questions: T.questions, qLabel: T.quiz.qLabel };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang, 'default'),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'test', image: ogImage(lang, 'default') }),
  })}
<body class="ny-body">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}

<main class="ny-shell">
  <!-- 시작 화면: 티징만 (배지·물음표 해돋이·h1·훅·시간/문항 수·시작 버튼) — 질문·결과를 인용하지 않는다 -->
  <section id="screen-start" class="ny-screen ny-start">
    <p class="ny-badge">${esc(S.badge)}</p>
    ${ART.hero('mystery', 'ny-hero-start')}
    <h1 class="ny-h1"><span class="ny-kicker">${esc(S.h1Kicker)}</span><span class="ny-h1-main">${S.h1Html}</span></h1>
    <p class="ny-hook">${esc(S.hook)}</p>
    <p class="ny-meta"><span>${esc(S.metaTime)}</span><span>${esc(S.metaCount)}</span></p>
    <button id="start-btn" class="ny-btn ny-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 질문 (진행 중 화면의 광고 1자리) -->
  <section id="screen-quiz" class="ny-screen ny-quiz" hidden>
    <div class="ny-progress-row">
      <button id="back-btn" class="ny-back" type="button" aria-label="${esc(T.quiz.backAria)}">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="ny-progress" role="progressbar" aria-label="${esc(T.quiz.progressAria)}" aria-valuemin="0" aria-valuemax="${CORE.QUESTIONS.length}" aria-valuenow="0"><div id="progress-fill" class="ny-progress-fill"></div></div>
      <span id="progress-num" class="ny-progress-num">1 / ${CORE.QUESTIONS.length}</span>
    </div>
    <div id="question-host" aria-live="polite"></div>
    <div class="mg-ad"></div>
  </section>

  <!-- 해돋이 기다리는 중 -->
  <section id="screen-loading" class="ny-screen ny-loading" role="status" hidden>
    ${ART.hero('mystery', 'ny-hero-loading')}
    <p class="ny-loading-text">${esc(T.loading.text)}</p>
    <p class="ny-loading-sub">${esc(T.loading.sub)}</p>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: G.scriptJson('PAGE_I18N', runtime), src: ['newyear-core.js', 'newyear.js'] })}
</body>
</html>
`;
}

// ---------------------------------------------------------------
// 결과 (r/<id>.html) — 그 결과 하나 + 생존 시간 + 게이지(숨김) + 강점·장면·팁 + 단짝/라이벌(링크 없음) → 공통 끝 화면
// ---------------------------------------------------------------
function colorVars(id) {
  const c = CORE.TYPES[id];
  return `--c-main:${c.main};--c-deep:${c.deep};--c-ink:${c.ink}`;
}

// 잘 맞는/정반대 키워드: 이름·이모지만 보여 준다. <a> 가 아니고 누를 수 있어 보이는 모양도 없다(다른 결과 스포일러 금지).
function pairCard(T, kind, id) {
  const label = kind === 'buddy' ? T.result.buddyLabel : T.result.rivalLabel;
  const meta = CORE.TYPES[id];
  return `
      <div class="ny-pair-card ny-pair-${kind}" style="--accent:${meta.main}">
        <span class="ny-pair-label">${esc(label)}</span>
        <span class="ny-pair-emo" aria-hidden="true">${meta.emoji}</span>
        <span class="ny-pair-name">${esc(T.types[id].name)}</span>
      </div>`;
}

const AREAS = [['work', '💼'], ['money', '🪙'], ['love', '💞'], ['self', '🌿']];

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
<body class="ny-body ny-result-page" style="${colorVars(id)}">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}

<main class="ny-shell">
  <a id="share-cta" class="ny-cta" href="${start}" hidden>
    <span class="ny-cta-text"><strong>${esc(R.ctaStrong)}</strong><span>${esc(R.ctaSub)}</span></span>
    <span class="ny-cta-arrow" aria-hidden="true">→</span>
  </a>

  <article class="ny-card" aria-labelledby="result-name">
    <div class="ny-card-art">${ART.hero(id, 'ny-hero-result')}</div>
    <p class="ny-eyebrow">${esc(R.eyebrow)}</p>
    <h1 id="result-name" class="ny-result-title"><span class="ny-result-name">${esc(type.name)}</span></h1>
    <p class="ny-vibe">${esc(type.vibe)}</p>
    <ul class="ny-keys">
      ${type.keywords.map((k) => `<li>${esc(k)}</li>`).join('\n      ')}
    </ul>

    <div class="ny-lucky">
      <div class="ny-lucky-cell"><span class="ny-lucky-label">${esc(R.colorLabel)}</span><span class="ny-swatch" style="background:${meta.lucky}"></span><strong class="ny-lucky-val">${esc(type.color)}</strong></div>
      <div class="ny-lucky-cell"><span class="ny-lucky-label">${esc(R.monthLabel)}</span><span class="ny-lucky-icon" aria-hidden="true">📅</span><strong class="ny-lucky-val">${esc(T.months[meta.month - 1])}</strong></div>
      <div class="ny-lucky-cell"><span class="ny-lucky-label">${esc(R.itemLabel)}</span><span class="ny-lucky-icon" aria-hidden="true">${meta.item}</span><strong class="ny-lucky-val">${esc(type.item)}</strong></div>
    </div>

    <div id="lean" class="ny-lean" hidden>
      <span class="ny-lean-label">${esc(R.gaugeLabel)}</span>
      ${R.axes.map(([l, r]) => `<div class="ny-lean-row"><span class="ny-lean-end">${esc(l)}</span><span class="ny-lean-track"><span class="ny-lean-dot"></span></span><span class="ny-lean-end ny-lean-end-r">${esc(r)}</span></div>`).join('\n      ')}
    </div>
    <p id="same-share" class="ny-same" hidden></p>
    <p class="ny-desc">${esc(type.desc)}</p>

    <h2 class="ny-sub"><span aria-hidden="true">🔮</span> ${esc(R.fortuneLabel)}</h2>
    <div class="ny-fortunes">
      ${AREAS.map(([k, e]) => `<div class="ny-fortune"><h3 class="ny-fortune-h"><span aria-hidden="true">${e}</span> ${esc(R.areas[k])}</h3><p>${esc(type.fortune[k])}</p></div>`).join('\n      ')}
    </div>

    <div class="ny-note">
      <h2 class="ny-sub"><span aria-hidden="true">✍️</span> ${esc(R.tipLabel)}</h2>
      <p>${esc(type.tip)}</p>
    </div>

    <div class="ny-pair">${pairCard(T, 'buddy', meta.buddy)}${pairCard(T, 'rival', meta.rival)}
    </div>
  </article>

  <p class="ny-disclaimer">${esc(R.disclaimer)}</p>

  <div data-mg-end="${SITE_ID}"></div>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('NEWYEAR_RESULT', page)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['newyear-core.js', 'result.js'] })}
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
<body class="ny-body">
${doodles()}
${G.topBar(lang, rel, { suggest: true })}
<main class="ny-shell">
  <div class="ny-doc">
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
