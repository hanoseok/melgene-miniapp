#!/usr/bin/env node
/**
 * 눈사람 만들기 정적 페이지를 언어별로 생성한다 (12개 언어: shared/i18n.js 의 LOCALES, en 이 루트).
 *   index.html, <dir>/index.html   — 시작(티징만) → 만들기(canvas 미리보기 + 단계 9개: 몸·얼굴·코·모자·목도리·팔·꾸미기·배경·이름,
 *                                     무작위·이전·다음) → 끝 화면(눈사람 그림 + 저장·계속 만들기 + 공통 끝 화면).
 *                                     받은 링크(#d=)는 끝 화면에서 눈을 털어 내는 공개(나도 만들기).
 *   privacy.html, <dir>/privacy.html
 *   sitemap.xml (index × 12개 언어, xhtml:link hreflang + lastmod)
 * 문구는 tools/i18n/<lang>.js, 선택지·검증·공유 인코딩은 snowman-core.js, 화면 동작·canvas 그림은 snowman.js.
 *
 * 화면 규칙(.claude/skills/melgene-miniapp):
 *   - 맨 위 공통 타이틀 바(G.topBar). 시작 화면 = 배지·이모지 그림·h1(현지 검색어)·훅·시작 버튼·맨 아래 mg-ad-start 1개.
 *   - 만들기 화면에 mg-ad 1자리(맨 아래). 끝 화면 = 눈사람 그림(결과) → <div data-mg-end="snowman">. FAQ 는 끝 화면에만(MG_FAQ).
 *   - FAQPage JSON-LD 없음. 구조화 데이터는 G.appLd(create).
 *
 * 실행: node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_ID = 'snowman';
const SITE_ROOT = 'https://snowman.example.com';
const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'snowman-core.js'));
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const WORD_BREAKS = ['normal', 'keep-all', 'auto-phrase'];
const HYPHENS = ['manual', 'auto'];
const clean = (v) => String(v || '').replace(/[<>{};]/g, '');
const STEP_EMOJI = { body: '⚪', face: '🙂', nose: '🥕', hat: '🎩', scarf: '🧣', arms: '🙌', extras: '✨', scene: '🌙', name: '🏷️' };
// 필드 → [언어 파일 editor 의 이름 묶음, 라벨 키]
const GROUP = { b: ['bodies', 'body'], e: ['eyes', 'eyes'], m: ['mouths', 'mouth'], n: ['noses', 'nose'], h: ['hats', 'hat'], s: ['scarves', 'scarf'], p: ['patterns', 'pattern'], a: ['arms', 'arms'], g: ['scenes', 'scene'] };

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

function fontHead(T) {
  const F = T.fonts;
  const vars = [
    `--font-display: ${clean(F.display)}, var(--font-sans)`,
    `--display-weight: ${Number(F.displayWeight) || 400}`,
    `--font-script: ${clean(F.script)}, var(--font-display)`,
    `--script-weight: ${Number(F.scriptWeight) || 400}`,
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
<meta name="theme-color" content="#0e1f44">
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
// 시작 + 만들기 + 끝 화면 (index.html)
// ---------------------------------------------------------------
function opt(field, v, name, on) {
  return `<button type="button" class="sm-opt" role="radio" data-f="${field}" data-v="${v}" aria-checked="${on}"${on ? '' : ' tabindex="-1"'}><canvas class="sm-ic" width="96" height="96" aria-hidden="true"></canvas><span class="sm-opt-name">${esc(name)}</span></button>`;
}
function group(E, field, d0) {
  const [names, label] = GROUP[field];
  const id = `grp-${field}`;
  const list = CORE.FIELDS[field].map((x, i) => opt(field, i, E[names][x.id], i === d0[field])).join('\n        ');
  return `<p class="sm-label" id="${id}-label">${esc(E.labels[label])}</p>
      <div class="sm-opts" role="radiogroup" aria-labelledby="${id}-label" data-group="${field}">
        ${list}
      </div>`;
}
function extrasGroup(E, d0) {
  const list = CORE.EXTRAS.map((x) => `<button type="button" class="sm-opt sm-extra" data-bit="${x.bit}" aria-pressed="${!!(d0.x & x.bit)}"><canvas class="sm-ic" width="96" height="96" aria-hidden="true"></canvas><span class="sm-opt-name">${esc(E.extras[x.id])}</span></button>`).join('\n        ');
  return `<p class="sm-label" id="grp-x-label">${esc(E.labels.extras)}</p>
      <div class="sm-opts" role="group" aria-labelledby="grp-x-label" data-group="x">
        ${list}
      </div>`;
}
function renderIndex(lang) {
  const T = L10N[lang];
  const S = T.start;
  const E = T.editor;
  const R = T.result;
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const d0 = CORE.defaults();
  const lim = CORE.LIMITS;
  const tabs = CORE.STEPS.map((st, i) => `<button type="button" class="sm-step" role="tab" id="tab-${st.id}" data-step="${i}" aria-controls="panel-${st.id}" aria-selected="${i === 0}"${i ? ' tabindex="-1"' : ''}><span aria-hidden="true">${STEP_EMOJI[st.id]}</span> ${esc(E.steps[st.id])}</button>`).join('\n      ');
  const panels = CORE.STEPS.map((st, i) => {
    let inner;
    if (st.id === 'name') {
      inner = `<div class="sm-name-head"><label class="sm-label" for="f-name">${esc(E.labels.name)}</label><button id="idea-btn" class="sm-idea" type="button">${esc(E.ideas)}</button></div>
      <input id="f-name" class="sm-input" type="text" maxlength="${lim.t * 3}" autocomplete="off" enterkeyhint="done" spellcheck="false" placeholder="${esc(E.namePlaceholder)}">
      <p id="name-count" class="sm-count" aria-live="polite">0/${lim.t}</p>`;
    } else {
      inner = st.groups.map((f) => (f === 'x' ? extrasGroup(E, d0) : group(E, f, d0))).join('\n      ');
    }
    return `<div class="sm-panel" role="tabpanel" id="panel-${st.id}" aria-labelledby="tab-${st.id}" data-step="${i}"${i ? ' hidden' : ''}>
      ${inner}
    </div>`;
  }).join('\n    ');
  const runtime = { lang, editor: { stepOf: E.stepOf, counter: E.counter, namePresets: E.namePresets }, card: T.card, result: R, fonts: { script: T.fonts.script, scriptWeight: T.fonts.scriptWeight } };

  return `${head(lang, T, {
    file, rel, url,
    title: `${T.meta.title} | ${G.brandOf(lang)}`,
    desc: T.meta.description,
    ogTitle: T.meta.ogTitle, ogDesc: T.meta.ogDescription, ogImage: ogImage(lang),
    extraHead: G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.siteName, description: T.meta.description, category: 'create', image: ogImage(lang) }),
  })}
<body class="sm-body">
${G.topBar(lang, rel)}

<main class="sm-shell">
  <!-- 시작 화면: 티징만 (배지·그림·h1·훅·시작 버튼·맨 아래 광고 1개) — 도구·FAQ 없음 -->
  <section id="screen-start" class="sm-screen sm-start">
    <p class="sm-badge">${esc(S.badge)}</p>
    <div class="sm-hero" aria-hidden="true"><span class="sm-hero-man">⛄</span><span class="sm-hero-hat">🎩</span><span class="sm-hero-scarf">🧣</span><span class="sm-hero-carrot">🥕</span><span class="sm-hero-f1">❄️</span><span class="sm-hero-f2">❄️</span></div>
    <h1 class="sm-h1"><span class="sm-kicker">${esc(S.h1Kicker)}</span><span class="sm-h1-main">${S.h1Html}</span></h1>
    <p class="sm-hook">${esc(S.hook)}</p>
    <button id="start-btn" class="sm-btn sm-btn-primary" type="button">${esc(S.start)}</button>
    <div class="mg-ad mg-ad-start"></div>
  </section>

  <!-- 만들기 (진행 중 화면의 광고 1자리: 맨 아래) -->
  <section id="screen-edit" class="sm-screen sm-edit" hidden>
    <h2 class="sm-edit-title">${esc(E.title)}</h2>
    <div class="sm-stage"><canvas id="snow-canvas" class="sm-canvas" width="${CORE.W}" height="${CORE.H}" role="img" aria-label="${esc(E.canvasAria)}"></canvas></div>
    <div id="steps" class="sm-steps" role="tablist" aria-label="${esc(E.title)}">
      ${tabs}
    </div>
    <p id="step-of" class="sm-step-of" aria-live="polite"></p>
    ${panels}
    <div class="sm-nav">
      <button id="back-btn" class="sm-tool" type="button">${esc(E.back)}</button>
      <button id="random-btn" class="sm-tool" type="button"><span aria-hidden="true">🎲</span> ${esc(E.random)}</button>
      <button id="next-btn" class="sm-tool sm-tool-next" type="button">${esc(E.next)}</button>
    </div>
    <button id="done-btn" class="sm-btn sm-btn-primary" type="button">${esc(E.done)}</button>
    <div class="mg-ad"></div>
  </section>

  <!-- 끝 화면: 눈사람(결과) → 공통 끝 화면 -->
  <section id="screen-end" class="sm-screen sm-end" hidden>
    <article class="sm-card" aria-labelledby="end-title">
      <p id="end-eyebrow" class="sm-eyebrow"></p>
      <h2 id="end-title" class="sm-sr"></h2>
      <div class="sm-end-stage">
        <canvas id="end-canvas" class="sm-canvas sm-end-canvas" width="${CORE.W}" height="${CORE.H}" role="img"></canvas>
        <div id="reveal" class="sm-reveal" hidden>
          <p class="sm-reveal-hint">${esc(R.revealHint)}</p>
          <button id="reveal-btn" class="sm-btn sm-btn-primary sm-btn-sm" type="button">${esc(R.reveal)}</button>
        </div>
      </div>
      <div class="sm-end-actions">
        <button id="save-btn" class="sm-btn sm-btn-primary sm-btn-sm" type="button"><span aria-hidden="true">📥</span> ${esc(R.save)}</button>
        <button id="edit-btn" class="sm-btn sm-btn-soft sm-btn-sm" type="button"><span aria-hidden="true">✏️</span> ${esc(R.edit)}</button>
      </div>
      <p id="save-status" class="sm-status" aria-live="polite"></p>
    </article>
    <div data-mg-end="${SITE_ID}"></div>
  </section>

${footer(T, lang, file)}
</main>

${scripts(root, { inline: `${G.scriptJson('PAGE_I18N', runtime)}\n${G.scriptJson('MG_FAQ', T.faq)}`, src: ['snowman-core.js', 'snowman.js'] })}
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

  return `${head(lang, T, { file, rel, url, title: P.title, desc: P.description, ogImage: ogImage(lang) })}
<body class="sm-body">
${G.topBar(lang, rel)}
<main class="sm-shell">
  <div class="sm-doc">
    <h1>${esc(P.h1)}</h1>
    <p>${P.introHtml}</p>

${sections}
  </div>

  <footer class="site-footer">
    <a href="./">${esc(P.back)}</a>
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
  console.log(`생성 완료: 언어 ${G.LOCALES.length}개 × (index + privacy) = HTML ${n}개`);
  if (G.MODE !== 'variant') {
    G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html']));
    console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length}개, hreflang 대체 링크 포함)`);
  }
}

main();
