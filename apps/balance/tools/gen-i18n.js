#!/usr/bin/env node
/**
 * 밸런스 게임의 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 팩 고르기(티징만) → 질문 카드 → 결과 + 공통 끝 화면
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (모든 언어 URL + xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js. balance.js 가 쓰는 문자열(ui: 질문·팩·유형 등)은 페이지에 인라인(window.PAGE_I18N)된다.
 * 팩 구성·질문 id 는 balance-core.js (언어 무관).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 제목(h1, 현지 검색어) + 한 줄 훅 + 팩 고르기. SEO 글·FAQ·광고·다른 테스트 없음.
 *   - 팩 설명은 주제·분위기만(실제 질문 인용 금지). 광고는 질문 화면에 1자리 + 끝 화면(공통 컴포넌트) 1자리.
 *   - 끝 화면 = 내 결과(유형·대세 일치율·고민 시간·친구와 같은 수) + <div data-mg-end="balance">.
 *     FAQ 는 끝 화면에만(window.MG_FAQ). FAQPage JSON-LD 는 넣지 않는다. 구조화 데이터는 G.appLd.
 *
 * 실행: node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'balance-core.js'));

const SITE_ID = 'balance';
const SITE_ROOT = 'https://balance.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
// fonts.wordBreak / fonts.hyphens 로 쓸 수 있는 값 (auto-phrase 는 지원 브라우저만, 나머지는 normal 로 동작)
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

// 언어별 글꼴·줄바꿈(tools/i18n/<lang>.js 의 fonts) → 글꼴 링크 + :root 변수. CSS 에는 언어 이름이 없다.
function fontLinks(T) {
  return [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${PRETENDARD}">`,
    `<link rel="stylesheet" href="${T.fonts.css}">`,
  ].join('\n');
}

// style.css 의 기본값(라틴 문자용)을 덮어써야 하므로 style.css 뒤에 둔다
function fontVars(T) {
  const F = T.fonts;
  const vars = [
    `--font-display: ${F.display}, var(--font-sans)`,
    `--display-weight: ${Number(F.displayWeight) || 400}`,
    `--font-opt: ${F.option}, var(--font-sans)`,
    `--opt-weight: ${Number(F.optionWeight) || 400}`,
    `--opt-scale: ${Number(F.optionScale) || 1}`,
    `--hero-scale: ${Number(F.heroScale) || 1}`,
    `--wb: ${WORD_BREAKS.includes(F.wordBreak) ? F.wordBreak : 'normal'}`,
    `--hyphens: ${HYPHENS.includes(F.hyphens) ? F.hyphens : 'manual'}`,
  ];
  // Pretendard 에 없는 글자(베트남어 성조 등)를 쓰는 언어는 본문 글꼴도 바꾼다
  if (F.sans) vars.push(`--font-sans: ${F.sans}, -apple-system, BlinkMacSystemFont, sans-serif`);
  return `<style>:root { ${vars.join('; ').replace(/</g, '')}; }</style>`;
}

// <html> 태그: 넓은 글자 문자(dense)면 bal-dense, 위아래로 쌓이는 성조·모음 부호(tall)면 bal-tall
function htmlOpen(T, lang) {
  const cls = [T.fonts.dense && 'bal-dense', T.fonts.tall && 'bal-tall'].filter(Boolean).join(' ');
  return `<html lang="${lang}"${cls ? ` class="${cls}"` : ''}>`;
}

function headCommon(T, lang, rel, meta) {
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="theme-color" content="#edeff6">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(G.brandOf(lang))}">
<meta property="og:title" content="${esc(meta.ogTitle || meta.title)}">
<meta property="og:description" content="${esc(meta.ogDescription || meta.description)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">

${fontLinks(T)}
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
${fontVars(T)}`;
}

function packTile(T, pack, extraClass) {
  const P = T.ui.packs[pack.id];
  const n = CORE.PACK_SIZE;
  return `        <button type="button" class="bal-pack${extraClass ? ' ' + extraClass : ''}" data-pack="${pack.id}">
          <span class="bal-pack-emoji" aria-hidden="true">${pack.emoji}</span>
          <span class="bal-pack-name">${esc(P.name)}</span>
          <span class="bal-pack-blurb">${esc(P.blurb)}</span>
          <span class="bal-pack-count">${esc(G.fmt(T.home.count, { n }))}</span>
        </button>`;
}

function sideButton(T, opt) {
  const letter = opt === 0 ? T.ui.sideA : T.ui.sideB;
  const cls = opt === 0 ? 'a' : 'b';
  const vs = opt === 1 ? `\n        <span class="bal-vs" aria-hidden="true">${esc(T.ui.vsBadge)}</span>` : '';
  return `      <button type="button" class="bal-side bal-side--${cls}" data-opt="${opt}">
        <span class="bal-side-letter" aria-hidden="true">${esc(letter)}</span>
        <span class="bal-opt"></span>
        <span class="bal-stat" aria-hidden="true"><span class="bal-pct"></span><span class="bal-cnt"></span></span>
        <span class="bal-meter" aria-hidden="true"><span class="bal-meter-fill"></span></span>
        <span class="bal-tag bal-tag--you">${esc(T.ui.you)}</span>
        <span class="bal-tag bal-tag--friend">${esc(T.ui.friend)}</span>${vs}
      </button>`;
}

function renderIndex(lang) {
  const T = L10N[lang];
  const rel = 'index.html';
  const root = G.rootPrefix(G.fileOf(lang, rel));
  const U = T.ui;

  const random = packTile(T, { id: CORE.RANDOM_ID, emoji: '🎲' }, 'bal-pack--random');
  const tiles = CORE.PACKS.map((p) => packTile(T, p, p.id === 'extreme' ? 'bal-pack--boss' : '')).join('\n');

  return `<!DOCTYPE html>
${htmlOpen(T, lang)}
<head>
${headCommon(T, lang, rel, Object.assign({}, T.meta, { title: `${T.meta.title} | ${G.brandOf(lang)}` }))}

${G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.app.name, description: T.meta.description, category: 'test', image: ogImage(lang) })}
</head>
<body class="bal-body">

${G.topBar(lang, rel, { suggest: true })}

<div class="bal-shell">
  <main id="app">
    <!-- 팩 고르기: 티징만 (제목 + 한 줄 훅 + 팩). 팩 설명은 주제·분위기만 — 실제 질문을 인용하지 않는다 -->
    <section id="screen-home" class="bal-screen" data-screen="home">
      <div class="bal-hero">
        <h1 class="bal-hero-title"><span class="bal-hero-a">${esc(T.home.h1a)}</span> <span class="bal-hero-b" data-vs="${esc(U.vsBadge)}">${esc(T.home.h1b)}</span></h1>
      </div>
      <p class="bal-hook">${esc(T.home.hook)}</p>

      <h2 class="bal-h2">${esc(T.home.packsTitle)}</h2>
      <div class="bal-packs" id="packs">
${random}
${tiles}
      </div>
    </section>

    <!-- 질문 -->
    <section id="screen-play" class="bal-screen" data-screen="play" hidden>
      <div class="bal-bar">
        <button type="button" id="back-btn" class="bal-icon-btn" aria-label="${esc(T.play.homeAria)}" data-prev="${esc(T.play.backAria)}" data-home="${esc(T.play.homeAria)}">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <ol id="progress" class="bal-progress" aria-label="${esc(T.play.progressAria)}"></ol>
        <span id="progress-num" class="bal-progress-num" aria-live="polite"></span>
        <button type="button" id="skip-btn" class="bal-text-btn">${esc(T.play.skip)}</button>
      </div>
      <p id="friend-banner" class="bal-friend-banner" hidden></p>

      <div class="bal-q-head">
        <p id="q-pack" class="bal-q-pack"></p>
        <h2 id="q-prompt" class="bal-prompt"></h2>
      </div>

      <div id="duel" class="bal-duel" data-state="idle">
${sideButton(T, 0)}
${sideButton(T, 1)}
      </div>

      <div class="bal-after">
        <p id="note" class="bal-note" aria-live="polite"></p>
        <button type="button" id="next-btn" class="bal-next" hidden><span class="bal-next-fill" aria-hidden="true"></span><span class="bal-next-label"></span></button>
      </div>

      <!-- 진행 중 화면의 광고 한 자리: 카드와 "다음" 버튼 아래(겹치지 않음). 보일 때 채우고, 못 채우면 숨는다. localhost 에서는 아무것도 안 함 -->
      <div class="mg-ad"></div>
    </section>

    <!-- 결과: 그 사람의 결과만 (유형·숫자 요약). 푼 질문 목록은 보여 주지 않는다 -->
    <section id="screen-end" class="bal-screen" data-screen="end" hidden>
      <div class="bal-result" id="result-card">
        <p id="r-pack" class="bal-result-pack"></p>
        <h2 id="r-type" class="bal-result-type"></h2>
        <p id="r-desc" class="bal-result-desc"></p>
        <div class="bal-stats">
          <div class="bal-statbox" id="r-rate-box"><span class="bal-statbox-num" id="r-rate"></span><span class="bal-statbox-label">${esc(U.rateLabel)}</span></div>
          <div class="bal-statbox" id="r-speed-box"><span class="bal-statbox-num" id="r-speed"></span><span class="bal-statbox-label">${esc(U.speedLabel)}</span></div>
          <div class="bal-statbox" id="r-friend-box" hidden><span class="bal-statbox-num" id="r-friend"></span><span class="bal-statbox-label">${esc(U.friendLine)}</span></div>
        </div>
        <div class="bal-rate-meter" id="r-meter" aria-hidden="true"><span class="bal-rate-meter-fill"></span></div>
        <p id="r-line" class="bal-result-line"></p>
      </div>

      <!-- 공통 끝 화면: 별점·하트 → 광고 → 공유 → FAQ → 다시 하기(팩 고르기로) → 다른 미니앱 -->
      <div data-mg-end="${SITE_ID}" data-retry-label="${esc(U.retry)}"></div>
    </section>
  </main>

  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="privacy.html">${esc(T.privacyLink)}</a>
  </footer>
</div>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PAGE_I18N', U)}
${G.scriptJson('MG_FAQ', T.faq)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}balance-core.js"></script>
<script src="${root}balance.js"></script>
</body>
</html>
`;
}

function renderPrivacy(lang) {
  const T = L10N[lang];
  const P = T.privacy;
  const rel = 'privacy.html';
  const root = G.rootPrefix(G.fileOf(lang, rel));
  const sections = P.sections.map(([h, body]) => `    <h2>${esc(h)}</h2>\n    <p>${body}</p>`).join('\n\n');

  return `<!DOCTYPE html>
${htmlOpen(T, lang)}
<head>
${headCommon(T, lang, rel, { title: P.title, description: P.description })}
</head>
<body class="bal-body">
${G.topBar(lang, rel, { suggest: true })}
<div class="bal-shell">
  <main class="bal-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </main>

  <footer class="site-footer">
    <a href="./">${esc(P.back)}</a>
  </footer>
</div>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
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
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy) = HTML ${n}개`);
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
  console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 + lastmod)`);
}

main();
