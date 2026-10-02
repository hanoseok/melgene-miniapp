#!/usr/bin/env node
/**
 * 랜덤 팀 나누기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 이름 입력(광고 1자리) → 섞기 애니메이션 + 결과(팀 카드) → 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 팀 동물 id·이모지·색·섞기·공유 인코딩은 team-core.js, 화면 동작은 team.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·팀 카드 티저 그림·h1(현지 검색어)·훅·짧은 사실 한 줄·시작 버튼. SEO 글·FAQ·광고 없음.
 *   - 이름 입력 화면(진행 중 화면)에 mg-ad 1자리(섞기 버튼 아래). 결과(팀 카드) 바로 아래 <div data-mg-end="team">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'team-core.js'));

const SITE_ID = 'team';
const SITE_ROOT = 'https://team.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
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
<meta name="theme-color" content="#1d2a5b">
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

// 시작 화면 티저 그림: 빈 카드가 든 색깔 팀 상자 세 개 + 주사위 (이름 없음)
function heroArt() {
  const boxes = [0, 2, 12].map((i, k) => {
    const t = CORE.TEAMS[i];
    return `<span class="tm-hero-box is-${k}" style="--team:${t.color}"><span class="tm-hero-emoji">${t.emoji}</span><i></i><i></i><i></i></span>`;
  }).join('');
  return `<div class="tm-hero" aria-hidden="true">${boxes}<span class="tm-hero-dice">🎲</span></div>`;
}

// ---------------------------------------------------------------
// 시작 + 입력 + 결과 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const I = T.input;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(team.js)에서 쓰는 문구
  const runtime = { lang, input: I, result: R, people: T.people, teams: T.teams, sample: T.sample };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="tm-body">
${G.topBar(lang, rel)}

<main class="tm-shell">
  <!-- 시작 화면: 티징만 (배지·팀 상자 그림·h1·훅·사실 한 줄·시작 버튼) — FAQ·광고 없음 -->
  <section id="screen-start" class="tm-screen tm-start">
    <p class="tm-badge">${esc(S.badge)}</p>
    ${heroArt()}
    <h1 class="tm-h1"><span class="tm-kicker">${esc(S.h1Kicker)}</span><span class="tm-h1-main">${S.h1Html}</span></h1>
    <p class="tm-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="tm-btn tm-btn-primary" type="button">${esc(S.start)}</button>
    <p class="tm-facts">${esc(S.facts)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 이름 입력 화면 (진행 중 화면의 광고 1자리: 섞기 버튼 아래) -->
  <section id="screen-input" class="tm-screen tm-input" hidden>
    <h2 class="tm-h2">${esc(I.title)}</h2>
    <div class="tm-card">
      <label class="tm-label" for="names">${esc(I.namesLabel)}</label>
      <p class="tm-hint">${esc(I.namesHint)}</p>
      <textarea id="names" class="tm-names" rows="8" spellcheck="false" autocomplete="off" placeholder="${esc(I.placeholder)}"></textarea>
      <div class="tm-names-bar">
        <span id="people-count" class="tm-count" aria-live="polite"></span>
        <span class="tm-names-tools">
          <button type="button" id="sample-btn" class="tm-mini">${esc(I.sample)}</button>
          <button type="button" id="clear-btn" class="tm-mini">${esc(I.clear)}</button>
        </span>
      </div>
      <p id="names-warn" class="tm-warn" hidden></p>

      <p class="tm-label" id="mode-label">${esc(I.modeLabel)}</p>
      <div class="tm-seg" role="radiogroup" aria-labelledby="mode-label">
        <button type="button" id="mode-teams" class="tm-seg-btn" role="radio" data-mode="teams">${esc(I.modeTeams)}</button>
        <button type="button" id="mode-size" class="tm-seg-btn" role="radio" data-mode="size">${esc(I.modeSize)}</button>
      </div>
      <div class="tm-stepper">
        <button type="button" id="step-minus" class="tm-step" aria-label="${esc(I.minus)}">−</button>
        <output id="step-num" class="tm-step-num">2</output>
        <button type="button" id="step-plus" class="tm-step" aria-label="${esc(I.plus)}">+</button>
      </div>
      <p id="preview" class="tm-preview" aria-live="polite"></p>

      <label class="tm-check">
        <input type="checkbox" id="leaders">
        <span class="tm-check-box" aria-hidden="true"></span>
        <span class="tm-check-text">${esc(I.leaders)}</span>
      </label>
      <p id="leaders-note" class="tm-hint tm-leaders-note"></p>
    </div>
    <button type="button" id="shuffle-btn" class="tm-btn tm-btn-primary">${esc(I.shuffle)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 결과: 섞기 애니메이션 → 팀 카드 → 공통 끝 화면 -->
  <section id="screen-result" class="tm-screen tm-result" hidden>
    <p id="shared-note" class="tm-shared-note" hidden>${esc(R.sharedNote)}</p>
    <h2 id="result-title" class="tm-h2">${esc(R.title)}</h2>
    <div id="deck" class="tm-deck" aria-hidden="true"><span class="tm-deck-dice">🎲</span><span id="deck-label" class="tm-deck-label">${esc(R.shuffling)}</span></div>
    <div id="teams" class="tm-teams" aria-live="polite"></div>
    <div id="result-actions" class="tm-actions">
      <button type="button" id="rename-btn" class="tm-mini">🔤 ${esc(R.rename)}</button>
      <button type="button" id="again-btn" class="tm-mini tm-mini-accent">🎲 ${esc(R.again)}</button>
      <button type="button" id="edit-btn" class="tm-mini">✏️ ${esc(R.edit)}</button>
    </div>
    <button type="button" id="make-own-btn" class="tm-btn tm-btn-primary" hidden>${esc(R.makeOwn)}</button>
    <button type="button" id="copy-btn" class="tm-btn tm-btn-secondary">📋 ${esc(R.copy)}</button>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['team-core.js', 'team.js'] })}
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
<body class="tm-body">
${G.topBar(lang, rel)}
<main class="tm-shell">
  <div class="tm-doc">
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
