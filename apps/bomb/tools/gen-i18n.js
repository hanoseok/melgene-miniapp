#!/usr/bin/env node
/**
 * 폭탄 돌리기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(#screen-setup): h1·훅 → 누가 하나(그냥 하기 / 이름 넣기) → 이름 → 심지 길이 → 힌트·벌칙 카드 → 불붙이기 → 맨 아래 mg-ad-start
 *                                    게임 화면(#screen-play, 처음 hidden): 안내·소리·그만 → 들고 있는 사람 → 폭탄 버튼 → 넘기기 안내 → 멈춤 → 펑 → (끝나면) 결과 + 최근 기록 + 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 bomb-core.js, 화면 동작은 bomb.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 게임 화면에는 광고 자리를 두지 않는다(끝 화면 공통 컴포넌트만).
 *   - 결과(#result) 안에 결과 카드 → 최근 기록 → <div data-mg-end="bomb">.
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *   - 벌칙 미션 카드는 PAGE_I18N 안에만(터진 뒤 bomb.js 가 한 장씩). 보이는 HTML·메타·OG 에 목록으로 쓰지 않는다.
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bomb-core.js'));

const SITE_ID = 'bomb';
const SITE_ROOT = 'https://bomb.example.com';
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
<meta name="theme-color" content="#221b33">
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

// 폭탄 그림(SVG) — 몸통·광택·뚜껑·심지. 불꽃(.bm-spark)은 심지 끝에 따로 둔다.
const BOMB_SVG = `<svg class="bm-bomb-svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="bm-body" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#5a5670"/><stop offset=".55" stop-color="#26232f"/><stop offset="1" stop-color="#0f0d14"/></radialGradient>
          </defs>
          <path class="bm-fuse" d="M128 46 C140 26 158 22 170 30" fill="none" stroke="#c9a46a" stroke-width="7" stroke-linecap="round"/>
          <rect x="106" y="40" width="34" height="24" rx="6" transform="rotate(32 123 52)" fill="#3b3848"/>
          <circle cx="94" cy="118" r="66" fill="url(#bm-body)"/>
          <ellipse cx="70" cy="90" rx="18" ry="11" transform="rotate(-35 70 90)" fill="#fff" opacity=".28"/>
        </svg>`;

// ---------------------------------------------------------------
// 앱 (index.html)
// ---------------------------------------------------------------
function renderIndex(lang) {
  const T = L10N[lang];
  const H = T.hero;
  const U = T.ui;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  // 브라우저(bomb.js)에서 쓰는 문구. missions 는 여기에만 있고 터진 뒤 한 장씩만 보인다.
  const runtime = { lang, ui: U, errors: T.errors, result: R, missions: T.missions };
  const range = (k) => G.fmt(U.fuseRange, { a: CORE.FUSES[k][0] / 1000, b: CORE.FUSES[k][1] / 1000 });
  const fuseBtn = (k, label) => `<button type="button" class="bm-seg-btn bm-fuse-btn" id="fuse-${k}" role="radio" aria-checked="${k === 'normal'}" data-fuse="${k}"><span class="bm-fuse-name">${esc(label)}</span><span class="bm-fuse-range">${esc(range(k))}</span></button>`;

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="bm-body">
${G.topBar(lang, rel)}

<main class="bm-shell">
  <!-- 시작 화면: h1·훅 → 누가 하나 → 이름 → 심지 길이 → 힌트·벌칙 → 불붙이기 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="bm-screen bm-setup">
    <h1 class="bm-h1"><span class="bm-kicker">${esc(H.h1Kicker)}</span><span class="bm-h1-main">${H.h1Html}</span></h1>
    <p class="bm-hook">${esc(H.hook)}</p>

    <form id="bm-form" class="bm-card bm-form" novalidate autocomplete="off">
      <p class="bm-label" id="mode-label">${esc(U.modeLabel)}</p>
      <div class="bm-seg" role="radiogroup" aria-labelledby="mode-label">
        <button type="button" class="bm-seg-btn" id="mode-free" role="radio" aria-checked="true">${esc(U.modeFree)}</button>
        <button type="button" class="bm-seg-btn" id="mode-names" role="radio" aria-checked="false">${esc(U.modeNames)}</button>
      </div>
      <div id="names-box" class="bm-names" hidden>
        <label class="bm-label" for="names">${esc(U.namesLabel)}</label>
        <textarea id="names" class="bm-textarea" rows="5" maxlength="400" placeholder="${esc(U.namesPh)}" spellcheck="false"></textarea>
        <p class="bm-hint"><span>${esc(U.namesHint)}</span> <output id="names-count" class="bm-count"></output></p>
      </div>
      <p class="bm-label" id="fuse-label">${esc(U.fuseLabel)}</p>
      <div class="bm-seg bm-seg-3" role="radiogroup" aria-labelledby="fuse-label">
        ${fuseBtn('short', U.fuseShort)}
        ${fuseBtn('normal', U.fuseNormal)}
        ${fuseBtn('long', U.fuseLong)}
      </div>
      <label class="bm-switch">
        <input type="checkbox" id="hints" role="switch">
        <span class="bm-switch-ui" aria-hidden="true"></span>
        <span class="bm-switch-text"><span class="bm-switch-label">${esc(U.hintsLabel)}</span><span class="bm-hint">${esc(U.hintsHint)}</span></span>
      </label>
      <label class="bm-switch">
        <input type="checkbox" id="missions" role="switch">
        <span class="bm-switch-ui" aria-hidden="true"></span>
        <span class="bm-switch-text"><span class="bm-switch-label">${esc(U.missionsLabel)}</span><span class="bm-hint">${esc(U.missionsHint)}</span></span>
      </label>
    </form>

    <p id="error" class="bm-error" role="alert" hidden></p>
    <p id="shared-note" class="bm-note" hidden>${esc(R.sharedNote)}</p>
    <button type="button" id="start-btn" class="bm-btn bm-btn-primary">${esc(U.start)}</button>
    <p class="bm-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 게임 화면: 안내·소리·그만 → 들고 있는 사람 → 폭탄 → 넘기기 안내 → 멈춤·펑 → (끝나면) 결과 카드 → 최근 기록 → 공통 끝 화면. 광고 자리 없음 -->
  <section id="screen-play" class="bm-screen bm-play" hidden>
    <div class="bm-bar">
      <p id="play-banner" class="bm-banner"></p>
      <button type="button" id="mute-btn" class="bm-icon-btn" aria-pressed="false" aria-label="${esc(U.soundOff)}">🔊</button>
      <button type="button" id="stop-btn" class="bm-mini">${esc(U.stop)}</button>
    </div>
    <div id="stage" class="bm-stage">
      <p id="holder" class="bm-holder"></p>
      <button type="button" id="bomb-btn" class="bm-bomb" aria-label="${esc(U.bombAria)}" aria-describedby="pass-msg">
        ${BOMB_SVG}
        <span class="bm-spark" aria-hidden="true"></span>
      </button>
      <p id="pass-msg" class="bm-pass" aria-live="polite"></p>
      <p id="pass-count" class="bm-pass-count"></p>
      <p class="bm-tip">${esc(U.playTip)}</p>
      <div id="paused" class="bm-paused" hidden>
        <p class="bm-paused-title">⏸ ${esc(U.pausedTitle)}</p>
        <p class="bm-paused-text">${esc(U.pausedText)}</p>
        <button type="button" id="resume-btn" class="bm-btn bm-btn-primary">${esc(U.resume)}</button>
      </div>
    </div>
    <div id="boom" class="bm-boom" aria-hidden="true" hidden><span class="bm-boom-burst"></span><span class="bm-boom-text">💥 ${esc(U.boom)}</span></div>
    <p id="live" class="visually-hidden" aria-live="assertive"></p>

    <div id="result" class="bm-result" hidden>
      <article class="bm-card bm-res-card" id="result-card" aria-labelledby="res-title">
        <p class="bm-res-kicker" id="res-kicker">${esc(R.kicker)}</p>
        <h2 class="bm-h2 bm-res-title" id="res-title"></h2>
        <p id="res-sub" class="bm-res-sub"></p>
        <p id="res-stats" class="bm-res-stats"></p>
        <div id="mission-card" class="bm-mission" hidden>
          <h3 class="bm-h3">${esc(R.missionTitle)}</h3>
          <p id="mission-text" class="bm-mission-text"></p>
        </div>
        <div class="bm-actions">
          <button type="button" id="edit-btn" class="bm-btn bm-btn-ghost">${esc(R.edit)}</button>
          <button type="button" id="link-btn" class="bm-btn bm-btn-ghost" hidden>${esc(R.shareNames)}</button>
        </div>
      </article>
      <div id="history-card" class="bm-card bm-history" hidden>
        <div class="bm-history-head">
          <h3 class="bm-h3" id="history-title">${esc(R.history)}</h3>
          <button type="button" id="history-clear" class="bm-mini">${esc(R.historyClear)}</button>
        </div>
        <ol id="history" class="bm-history-list" aria-labelledby="history-title"></ol>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['bomb-core.js', 'bomb.js'] })}
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
<body class="bm-body">
${G.topBar(lang, rel)}
<main class="bm-shell">
  <div class="bm-doc">
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
  if (CORE.MAX_PLAYERS !== 12 || CORE.MIN_PLAYERS !== 2) throw new Error('bomb-core 인원 한도가 바뀌었다 — 문구(2~12명)도 함께 고칠 것');
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
