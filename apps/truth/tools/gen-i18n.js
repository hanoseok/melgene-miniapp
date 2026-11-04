#!/usr/bin/env node
/**
 * 진실 게임(Truth or Dare) 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(#screen-setup): h1·훅 → 누가 하나(이름 넣기 / 이름 없이) → 이름 → 팩 → 시작 → 맨 아래 mg-ad-start
 *                                    진행 화면(#screen-play, 처음 hidden): 차례·끝내기 → 이번 차례 → 진실/도전/랜덤 → 카드 한 장 → 다른 카드·완료
 *                                    끝 화면(#screen-end, 처음 hidden): 요약 숫자(차례·진실·도전·바꾼 카드) → 공통 끝 화면(data-mg-end)
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 truth-core.js, 화면 동작은 truth.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 진행 화면·끝 화면에는 광고 자리를 두지 않는다(끝 화면은 공통 컴포넌트가 광고 포함).
 *   - 카드(packs)는 PAGE_I18N 안에만(진행 중 한 장씩). 보이는 HTML·메타·OG·가이드에 목록으로 쓰지 않는다(스포일러 금지).
 *   - 끝 화면은 숫자 요약만. FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'truth-core.js'));

const SITE_ID = 'truth';
const SITE_ROOT = 'https://truth.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
const PACK_EMOJI = { friends: '🍿', family: '🧸', work: '🎉', couples: '💛' };

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
<meta name="theme-color" content="#1f1638">
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

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const E = T.end;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(truth.js)에서 쓰는 문구. packs 는 여기에만 있고 진행 중 한 장씩만 보인다.
  const runtime = { lang, ui: U, errors: T.errors, end: E, packs: T.packs };
  const packBtn = (k, i) => `<button type="button" class="td-pack" id="pack-${k}" role="radio" aria-checked="${i === 0}" data-pack="${k}"><span class="td-pack-emoji" aria-hidden="true">${PACK_EMOJI[k]}</span><span class="td-pack-name">${esc(U.packs[k].name)}</span><span class="td-pack-desc">${esc(U.packs[k].desc)}</span></button>`;
  const stat = (id, label, cls) => `<div class="td-stat${cls ? ' ' + cls : ''}"><dt>${esc(label)}</dt><dd id="${id}">0</dd></div>`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="td-body">
${G.topBar(lang, rel)}

<main class="td-shell">
  <!-- 시작 화면: h1·훅 → 누가 하나 → 이름 → 팩 → 시작 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="td-screen td-setup">
    <h1 class="td-h1"><span class="td-kicker">${esc(H.h1Kicker)}</span><span class="td-h1-main">${H.h1Html}</span></h1>
    <p class="td-hook">${esc(H.hook)}</p>

    <form id="td-form" class="td-card td-form" novalidate autocomplete="off">
      <p class="td-label" id="mode-label">${esc(U.playersLabel)}</p>
      <div class="td-seg" role="radiogroup" aria-labelledby="mode-label">
        <button type="button" class="td-seg-btn" id="mode-names" role="radio" aria-checked="true">${esc(U.modeNames)}</button>
        <button type="button" class="td-seg-btn" id="mode-free" role="radio" aria-checked="false">${esc(U.modeFree)}</button>
      </div>
      <div id="names-box" class="td-names">
        <label class="td-label td-label-sm" for="names">${esc(U.namesLabel)}</label>
        <textarea id="names" class="td-textarea" rows="5" maxlength="800" placeholder="${esc(U.namesPh)}" spellcheck="false" aria-describedby="names-hint"></textarea>
        <p class="td-hint" id="names-hint"><span>${esc(U.namesHint)}</span> <output id="names-count" class="td-count"></output></p>
      </div>
      <p id="free-box" class="td-hint td-free" hidden>${esc(U.freeHint)}</p>
      <p class="td-label" id="pack-label">${esc(U.packLabel)}</p>
      <div class="td-packs" role="radiogroup" aria-labelledby="pack-label">
        ${CORE.PACKS.map(packBtn).join('\n        ')}
      </div>
    </form>

    <p id="error" class="td-error" role="alert" hidden></p>
    <button type="button" id="start-btn" class="td-btn td-btn-primary">${esc(U.start)}</button>
    <p class="td-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 진행 화면: 차례·끝내기 → 이번 차례 → 진실/도전/랜덤 → 카드 한 장 → 다른 카드·완료. 광고 자리 없음 -->
  <section id="screen-play" class="td-screen td-play" hidden>
    <div class="td-bar">
      <p id="round" class="td-round"></p>
      <span id="pack-chip" class="td-chip"></span>
      <button type="button" id="finish-btn" class="td-mini">${esc(U.finish)}</button>
    </div>
    <div class="td-turn">
      <p id="turn-kicker" class="td-turn-kicker">${esc(U.turnKicker)}</p>
      <p id="turn-name" class="td-turn-name"></p>
      <p id="turn-sub" class="td-turn-sub" hidden>${esc(U.turnFreeSub)}</p>
    </div>

    <div id="choose" class="td-choose">
      <p class="td-choose-label" id="choose-label">${esc(U.choose)}</p>
      <div class="td-choices" role="group" aria-labelledby="choose-label">
        <button type="button" id="pick-truth" class="td-pick td-pick-truth" data-pick="truth">${esc(U.truth)}</button>
        <button type="button" id="pick-dare" class="td-pick td-pick-dare" data-pick="dare">${esc(U.dare)}</button>
        <button type="button" id="pick-random" class="td-pick td-pick-random" data-pick="random">🎲 ${esc(U.random)}</button>
      </div>
    </div>

    <div class="td-card-wrap">
      <div id="flip" class="td-flip" role="region" aria-label="${esc(U.cardAria)}">
        <div class="td-face td-front" aria-hidden="true"><span class="td-front-mark">?</span></div>
        <div class="td-face td-back">
          <p id="card-type" class="td-card-type"></p>
          <p id="card-text" class="td-card-text"></p>
          <p id="random-note" class="td-random-note" hidden></p>
        </div>
      </div>
    </div>

    <div id="card-actions" class="td-card-actions" hidden>
      <button type="button" id="skip-btn" class="td-btn td-btn-ghost">${esc(U.skip)}</button>
      <button type="button" id="next-btn" class="td-btn td-btn-primary">${esc(U.next)}</button>
    </div>
    <p class="td-pass">${esc(U.passNote)}</p>
    <p id="live" class="visually-hidden" aria-live="polite"></p>
  </section>

  <!-- 끝 화면: 요약 숫자만 → 공통 끝 화면 -->
  <section id="screen-end" class="td-screen td-end" hidden>
    <article class="td-card td-sum" aria-labelledby="end-title">
      <p class="td-sum-kicker">${esc(E.kicker)}</p>
      <h2 class="td-h2" id="end-title">${esc(E.title)}</h2>
      <p id="end-sub" class="td-sum-sub">${esc(E.sub)}</p>
      <dl class="td-stats">
        ${stat('stat-rounds', E.rounds, 'td-stat-big')}
        ${stat('stat-truths', E.truths, 'td-stat-truth')}
        ${stat('stat-dares', E.dares, 'td-stat-dare')}
        ${stat('stat-skips', E.skips, '')}
      </dl>
      <p id="end-none" class="td-sum-sub" hidden>${esc(E.none)}</p>
      <button type="button" id="edit-btn" class="td-btn td-btn-ghost">${esc(E.edit)}</button>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['truth-core.js', 'truth.js'] })}
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
<body class="td-body">
${G.topBar(lang, rel)}
<main class="td-shell">
  <div class="td-doc">
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
  if (CORE.MAX_PLAYERS !== 20 || CORE.MIN_PLAYERS !== 2) throw new Error('truth-core 인원 한도가 바뀌었다 — 문구(2~20명)도 함께 고칠 것');
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
