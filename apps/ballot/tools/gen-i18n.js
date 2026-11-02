#!/usr/bin/env node
/**
 * 비밀 투표 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작 화면(#screen-setup): h1·훅 → 이어 하기 안내(처음 hidden) → 템플릿 → 이름 목록 → 질문 카드(JS 가 그림) → 질문 추가 →
 *                                    투표 인원 → 오류 → 투표 시작 → 공정성 한 줄 → 맨 아래 mg-ad-start
 *                                    투표 화면(#screen-vote, 처음 hidden): 진행 줄 → 가림 화면 / 투표용지 / 저장됨 / 모두 끝 → 진행자 도구(지금 끝내기·취소)
 *                                    결과 화면(#screen-result, 처음 hidden): 한 질문씩 발표(#reveal) → 최종 결과(#summary: 카드 · 복사 · 링크 · 고치기 · 공통 끝 화면)
 *                                    공유 결과 화면(#screen-shared, 처음 hidden): #d= 링크로 연 사람에게 최종 결과만 + 나도 투표 만들기
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 로직은 ballot-core.js, 화면 동작은 ballot.js.
 * 링크는 G.fileOf / G.relHref 로만 만든다(MG_I18N_MODE=variant 로 한 번 더 돌면 _l/<lang>/… 이 나온다).
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 시작 화면 컨테이너(#screen-setup)의 마지막 요소로 mg-ad-start 1개. 투표·결과 화면에는 광고 자리를 두지 않는다(끝 화면 공통 컴포넌트만).
 *   - 최종 결과(#summary) 안 마지막이 <div data-mg-end="ballot">. 투표 중에는 표 수를 어디에도 보여주지 않는다.
 *   - FAQ 는 MG_FAQ 로만. FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(vote).
 *
 * 실행: node tools/gen-i18n.js   (그리고 MG_I18N_MODE=variant node tools/gen-i18n.js — tools/gen-all.js 가 둘 다 돌린다)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'ballot-core.js'));

const SITE_ID = 'ballot';
const SITE_ROOT = 'https://ballot.example.com';
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
<meta name="theme-color" content="#132238">
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
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const runtime = { lang, ui: U, result: R };
  const presets = U.presets.map((p, i) => `<button type="button" class="bl-chip bl-preset" id="preset-${esc(p.id)}" role="radio" aria-checked="${i === 0}" data-preset="${esc(p.id)}">${esc(p.label)}</button>`);

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'vote', image: ogImage(lang) }),
  })}
<body class="bl-body">
${G.topBar(lang, rel)}

<main class="bl-shell">
  <!-- 시작 화면: h1·훅 → 이어 하기(hidden) → 템플릿 → 이름 목록 → 질문 → 투표 인원 → 시작 → 공정성 → 맨 아래 mg-ad-start 1개 -->
  <section id="screen-setup" class="bl-screen bl-setup">
    <h1 class="bl-h1"><span class="bl-kicker">${esc(H.h1Kicker)}</span><span class="bl-h1-main">${H.h1Html}</span></h1>
    <p class="bl-hook">${esc(H.hook)}</p>

    <div id="resume-box" class="bl-card bl-resume" hidden>
      <p id="resume-text" class="bl-resume-text"></p>
      <div class="bl-row2">
        <button type="button" id="resume-btn" class="bl-btn bl-btn-go">${esc(U.resume)}</button>
        <button type="button" id="discard-btn" class="bl-btn bl-btn-ghost">${esc(U.discard)}</button>
      </div>
    </div>

    <form id="bl-form" class="bl-card bl-form" novalidate autocomplete="off">
      <p class="bl-label" id="preset-label">${esc(U.presetLabel)}</p>
      <div class="bl-chips" role="radiogroup" aria-labelledby="preset-label">
        ${presets.join('\n        ')}
      </div>

      <label class="bl-label" for="people">${esc(U.peopleLabel)}</label>
      <p class="bl-hint" id="people-hint">${esc(U.peopleHint)}</p>
      <textarea id="people" class="bl-input bl-area" rows="4" aria-describedby="people-hint" placeholder="${esc(U.peoplePh)}" spellcheck="false"></textarea>

      <div id="questions" class="bl-questions"></div>
      <button type="button" id="add-q" class="bl-btn bl-btn-ghost">${esc(U.addQ)}</button>

      <p class="bl-label" id="voters-label">${esc(U.votersLabel)}</p>
      <div class="bl-stepper" role="group" aria-labelledby="voters-label">
        <button type="button" id="voters-less" class="bl-step-btn" aria-label="${esc(U.votersLess)}">−</button>
        <output id="voters-value" class="bl-step-value" aria-live="polite"></output>
        <button type="button" id="voters-more" class="bl-step-btn" aria-label="${esc(U.votersMore)}">+</button>
      </div>
      <p id="form-error" class="bl-error" role="alert" hidden></p>
    </form>

    <button type="button" id="start-btn" class="bl-btn bl-btn-primary">${esc(U.start)}</button>
    <p class="bl-fair">${esc(U.fair)}</p>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 투표 화면: 진행 줄 → 가림 / 투표용지 / 저장됨 / 모두 끝 → 진행자 도구. 표 수는 보이지 않는다. 광고 자리 없음 -->
  <section id="screen-vote" class="bl-screen bl-vote" hidden>
    <div class="bl-progress">
      <p id="progress-text" class="bl-progress-text"></p>
      <div class="bl-progress-bar" aria-hidden="true"><span id="progress-fill"></span></div>
    </div>

    <div id="stage-cover" class="bl-card bl-stage bl-cover" hidden>
      <p class="bl-big-emoji" aria-hidden="true">🙈</p>
      <h2 class="bl-h2" id="cover-title"></h2>
      <p class="bl-stage-hint">${esc(U.coverHint)}</p>
      <button type="button" id="ready-btn" class="bl-btn bl-btn-primary">${esc(U.ready)}</button>
    </div>

    <form id="stage-ballot" class="bl-stage bl-ballot" hidden novalidate>
      <p class="bl-ballot-hint">${esc(U.ballotHint)}</p>
      <div id="ballot-qs" class="bl-ballot-qs"></div>
      <button type="submit" id="cast-btn" class="bl-btn bl-btn-primary" disabled>${esc(U.cast)}</button>
      <p id="cast-need" class="bl-cast-need">${esc(U.castNeed)}</p>
    </form>

    <div id="stage-saved" class="bl-card bl-stage bl-saved" hidden>
      <p class="bl-big-emoji" aria-hidden="true">✅</p>
      <h2 class="bl-h2">${esc(U.savedTitle)}</h2>
      <p class="bl-stage-hint">${esc(U.savedHint)}</p>
      <button type="button" id="next-btn" class="bl-btn bl-btn-primary">${esc(U.next)}</button>
    </div>

    <div id="stage-allin" class="bl-card bl-stage bl-allin" hidden>
      <p class="bl-big-emoji" aria-hidden="true">🗳️</p>
      <h2 class="bl-h2" id="allin-title"></h2>
      <p class="bl-stage-hint">${esc(U.allInHint)}</p>
      <button type="button" id="reveal-btn" class="bl-btn bl-btn-primary">${esc(U.reveal)}</button>
    </div>

    <div id="host-tools" class="bl-host">
      <button type="button" id="finish-btn" class="bl-mini">${esc(U.finishEarly)}</button>
      <button type="button" id="cancel-btn" class="bl-mini">${esc(U.cancelVote)}</button>
    </div>
    <p id="live" class="visually-hidden" aria-live="assertive"></p>
  </section>

  <!-- 결과 화면: 한 질문씩 발표 → 최종 결과(카드 · 복사 · 링크 · 고치기 · 공통 끝 화면) -->
  <section id="screen-result" class="bl-screen bl-result" hidden>
    <div id="reveal" class="bl-reveal" hidden>
      <p id="reveal-step" class="bl-step"></p>
      <div id="reveal-card"></div>
      <div class="bl-row2">
        <button type="button" id="reveal-next" class="bl-btn bl-btn-primary">${esc(R.next)}</button>
      </div>
      <button type="button" id="reveal-all" class="bl-mini bl-skip">${esc(R.finish)}</button>
    </div>

    <div id="summary" class="bl-summary" hidden>
      <div class="bl-sum-head">
        <h2 class="bl-h2" id="sum-title">${esc(R.summaryTitle)}</h2>
        <p id="sum-sub" class="bl-sum-sub"></p>
      </div>
      <div id="sum-cards" class="bl-cards"></div>
      <div class="bl-card bl-actions">
        <button type="button" id="copy-text" class="bl-btn bl-btn-ghost">${esc(R.copyText)}</button>
        <button type="button" id="copy-link" class="bl-btn bl-btn-ghost">${esc(R.copyLink)}</button>
        <button type="button" id="share-link" class="bl-btn bl-btn-ghost" hidden>${esc(R.shareLink)}</button>
        <button type="button" id="edit-btn" class="bl-btn bl-btn-ghost">${esc(R.edit)}</button>
      </div>
      <div data-mg-end="${SITE_ID}"></div>
    </div>
  </section>

  <!-- 공유 결과 화면(#d= 링크): 최종 표 수만 + 나도 만들기. start/done 을 세지 않는다 -->
  <section id="screen-shared" class="bl-screen bl-shared" hidden>
    <p class="bl-res-kicker">${esc(R.sharedKicker)}</p>
    <h2 class="bl-h2" id="shared-title">${esc(R.sharedTitle)}</h2>
    <p id="shared-sub" class="bl-sum-sub"></p>
    <div id="shared-cards" class="bl-cards"></div>
    <p id="shared-bad" class="bl-error" hidden>${esc(R.sharedBad)}</p>
    <button type="button" id="make-own" class="bl-btn bl-btn-primary">${esc(R.makeOwn)}</button>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['ballot-core.js', 'ballot.js'] })}
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
<body class="bl-body">
${G.topBar(lang, rel)}
<main class="bl-shell">
  <div class="bl-doc">
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
  if (CORE.MAX_Q !== 5 || CORE.MAX_OPT !== 12 || CORE.MAX_VOTERS !== 40) throw new Error('ballot-core 한도가 바뀌었다 — 문구(질문 5개·선택지 12개·40명)도 함께 고칠 것');
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
