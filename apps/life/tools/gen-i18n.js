#!/usr/bin/env node
/**
 * 내 인생 애니메이션의 정적 페이지를 언어별로 생성한다 (shared/i18n.js LOCALES 12개 언어, 영어가 사이트 루트).
 *   index.html(en) / ja/ / zh/ / ko/ / fr/ / de/ / th/ / vi/ / es/ / it/ / pt/ / ru/  (+ privacy.html 각각)
 *   en/index.html, en/privacy.html — 예전 영어 주소(/en/)로 공유된 링크를 루트로 넘기는 리다이렉트(?s=·#d= 유지, noindex)
 *   sitemap.xml (모든 언어 URL + xhtml:link hreflang)
 * 문구는 tools/i18n/<lang>.js. life.js / life-core.js 가 쓰는 문자열(ui)은 페이지에 인라인(window.PAGE_I18N)된다.
 * 장면 칩은 life-core.js 의 MOMENTS(언어별 노출 여부 포함)로 만든다 — 크롤러도 칩 문구를 읽을 수 있게 정적 HTML.
 * 화면 규칙(.claude/skills/melgene-miniapp): 맨 위 공통 타이틀 바(G.topBar), 시작 화면은 티징 + 입력만,
 * 끝 화면 = 그림으로 그린 제목·영상 저장(앱 결과) + <div data-mg-end="life">(별점·하트·광고·공유·FAQ·다시 하기·다른 앱).
 * FAQ 는 끝 화면에만(window.MG_FAQ), FAQPage JSON-LD 는 넣지 않는다.
 * 공유 링크(?s= / #d=)는 현재 페이지 주소를 기준으로 만들어지므로 보낸 사람의 언어 페이지로 열린다.
 *
 * 실행: node tools/gen-i18n.js
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'life-core.js'));

const SITE_ROOT = 'https://life.example.com';
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const DEFAULT_BIRTH = 1996;

// 24x24 선 아이콘 (stroke = currentColor). 장면 id → path 들
const ICONS = {
  birth: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/><path d="M17 3.5v3M15.5 5h3"/>',
  steps: '<path d="M8.2 4.2c1.6 0 2.3 1.9 2.1 3.9-.2 2-1 3.3-2.3 3.3S5.8 10.1 5.8 8.2s.8-4 2.4-4z"/><path d="M15.6 9.7c1.5 0 2.2 1.7 2 3.6-.2 1.9-1 3.2-2.2 3.2s-2.1-1.3-2.1-3.1.8-3.7 2.3-3.7z"/><path d="M6.9 14.3h2.3M14.3 19.8h2.3"/>',
  kinder: '<path d="M3.5 11 12 4.5l8.5 6.5"/><path d="M5.8 9.6V19.5h12.4V9.6"/><circle cx="12" cy="13.4" r="1.9"/><path d="M10.5 19.5v-2.6h3v2.6"/>',
  school: '<path d="M2.8 20.2h18.4"/><path d="M5 20V11.2l7-4 7 4V20"/><path d="M12 7.2V3l3.2 1.1L12 5.3"/><path d="M10 20v-4.2h4V20M7.5 13h1.6M14.9 13h1.6"/>',
  friend: '<circle cx="8" cy="7.6" r="2.4"/><circle cx="16" cy="7.6" r="2.4"/><path d="M3.8 19.2c.3-3.2 1.9-5 4.2-5 1.4 0 2.4.6 3.1 1.6M20.2 19.2c-.3-3.2-1.9-5-4.2-5-1.4 0-2.4.6-3.1 1.6"/><path d="M10.4 17.4h3.2"/>',
  dacha: '<path d="M2.2 20h19.6"/><path d="M2.8 11.6 7.8 7l5 4.6"/><path d="M4.2 10.4V20h7.2v-9.6"/><path d="M6.6 13.2h2.4v2.4H6.6z"/><circle cx="17.6" cy="8.6" r="3.6"/><path d="M17.6 12.2V20"/>',
  teen: '<path d="M4.4 15.2v-3a7.6 7.6 0 0 1 15.2 0v3"/><rect x="3" y="14" width="3.6" height="6" rx="1.4"/><rect x="17.4" y="14" width="3.6" height="6" rx="1.4"/>',
  love: '<path d="M12 20s-7.2-4.4-7.2-10.1A4 4 0 0 1 12 7.4a4 4 0 0 1 7.2 2.5C19.2 15.6 12 20 12 20z"/>',
  exam: '<path d="M6 3.2h8.6l3.4 3.4v14.2H6z"/><path d="M9 10.2h6M9 13.4h6M9 16.6h3.8"/><path d="M14.4 3.4v3.4h3.4"/>',
  military: '<rect x="3" y="6" width="18" height="12.4" rx="1.6"/><path d="M3.6 7.2 12 13.2l8.4-6"/>',
  gapyear: '<circle cx="12" cy="12" r="8.2"/><path d="M3.9 12h16.2M12 3.8c2.6 2.4 2.6 13.9 0 16.4M12 3.8c-2.6 2.4-2.6 13.9 0 16.4"/>',
  college: '<path d="M2.2 9.2 12 5l9.8 4.2L12 13.4z"/><path d="M6.2 11.2v4.3c3.2 2 8.4 2 11.6 0v-4.3"/><path d="M21 9.6v5.2"/>',
  parttime: '<path d="M4.8 9.2h11v5.2a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M15.8 11h1.6a2.4 2.4 0 0 1 0 4.8h-1.6"/><path d="M8.6 3.2c-1 1 .9 2 0 3.2M12.2 3.2c-1 1 .9 2 0 3.2"/>',
  travel: '<path d="M21 3.2 3.2 10.4l6.9 2.6 2.6 6.9z"/><path d="M10.1 13 21 3.2"/>',
  job: '<rect x="3" y="7.4" width="18" height="12" rx="2"/><path d="M9 7.4V5.2h6v2.2M3 12.4h18"/>',
  ownplace: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18.2 12v3.2M15.4 12v2.2"/>',
  move: '<path d="M3.2 8.2 12 4.2l8.8 4v8.9L12 21.1l-8.8-4z"/><path d="M3.2 8.2 12 12.2l8.8-4M12 12.2v8.9"/>',
  pet: '<circle cx="6.8" cy="10.2" r="1.7"/><circle cx="10.4" cy="6.6" r="1.7"/><circle cx="14.6" cy="6.6" r="1.7"/><circle cx="18.2" cy="10.2" r="1.7"/><path d="M12.5 12.2c2.4 0 4.9 3.4 4.9 5.4 0 1.5-1.3 2.4-2.9 2.4-1 0-1.3-.5-2-.5s-1 .5-2 .5c-1.6 0-2.9-.9-2.9-2.4 0-2 2.5-5.4 4.9-5.4z"/>',
  wedding: '<circle cx="9" cy="14.2" r="5"/><circle cx="15" cy="14.2" r="5"/><path d="M10.2 5.2 12 3.4l1.8 1.8L12 7z"/>',
  baby: '<circle cx="12" cy="9.2" r="5"/><path d="M10.2 9.4h.01M13.8 9.4h.01M10.6 11.8c.9.7 1.9.7 2.8 0"/><path d="M6.8 20c1.4-2 3-2.6 5.2-2.6s3.8.6 5.2 2.6"/>',
  newjob: '<path d="M12 21V3.6"/><path d="M12 5h6.2l2 2-2 2H12M12 11H5.8l-2 2 2 2H12"/>',
  startup: '<path d="M4.2 10.4V20h15.6v-9.6"/><path d="M3.2 10.2 5.2 4.2h13.6l2 6c0 1.4-1.2 2-2.2 2s-2-.6-2.4-2c-.4 1.4-1.4 2-2.2 2s-1.8-.6-2.2-2c-.4 1.4-1.4 2-2.2 2s-1.8-.6-2.2-2c-.4 1.4-1.4 2-2.2 2s-2-.6-2-2z"/><path d="M10 20v-5h4v5"/>',
  challenge: '<path d="M2.8 20.2 9 9.6l4 6 2-3 6.2 7.6z"/><path d="M9 9.6V3.6l4.2 1.5L9 6.6"/>',
  today: '<path d="M2.8 17.8h18.4"/><path d="M7 17.8a5 5 0 0 1 10 0"/><path d="M12 6.2v3M5.6 9.6l2 2M18.4 9.6l-2 2M5.4 20.8h13.2"/>',
  custom: '<path d="M12 3.2l2 6 6.2 2-6.2 2-2 6.2-2-6.2-6.2-2 6.2-2z"/>',
  play: '<path d="M7.5 4.8v14.4L19 12z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  replay: '<path d="M4.6 12a7.4 7.4 0 1 0 2.2-5.3"/><path d="M4.4 3.8v4.4h4.4"/>',
};

function sprite() {
  const syms = Object.entries(ICONS)
    .map(([id, p]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${p}</symbol>`)
    .join('');
  return `<svg class="lf-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="0" height="0">${syms}</svg>`;
}
const icon = (id, cls = 'lf-ico') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${id}"></use></svg>`;

function ogImage(lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  return `${SITE_ROOT}/og/${dir ? dir + '/' : ''}default.png`;
}

function renderIndex(lang) {
  const T = L10N[lang];
  const rel = 'index.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const F = T.form;
  const U = T.ui;

  const groups = CORE.STAGES.map((stage) => {
    const chips = CORE.momentsFor(lang)
      .filter((m) => m.stage === stage)
      .map((m) => `          <button type="button" class="lf-chip" data-id="${m.id}" aria-pressed="false">${icon(m.id)}<span>${esc(U.moments[m.id].label)}</span></button>`);
    if (stage === 'today') {
      chips.push(`          <span class="lf-chip is-locked" aria-disabled="true">${icon('today')}<span>${esc(U.todayLabel)}</span><small>${esc(F.todayNote)}</small></span>`);
    }
    return `        <div class="lf-group">
          <h3 class="lf-group-title">${esc(F.groups[stage])}</h3>
          <div class="lf-chips">
${chips.join('\n')}
          </div>
        </div>`;
  }).join('\n');

  const months = [`<option value="0">${esc(F.monthNone)}</option>`]
    .concat(Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${esc(G.fmt(F.monthTpl, { n: i + 1, name: (U.months || [])[i] || i + 1 }))}</option>`))
    .join('');

  const pens = CORE.PENS.map((id, i) => `          <button type="button" class="lf-pen" role="radio" data-pen="${id}" aria-checked="${i === 0}"${i === 0 ? '' : ' tabindex="-1"'}>
            <canvas class="lf-pen-doodle" aria-hidden="true"></canvas>
            <span class="lf-pen-name">${esc(F.pens[id][0])}</span>
            <span class="lf-pen-note">${esc(F.pens[id][1])}</span>
          </button>`).join('\n');

  const maxBirth = CORE.maxBirth(new Date().getFullYear());
  const faq = T.faq.map(([q, a]) => ({ q, a }));

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(T.meta.title)}</title>
<meta name="description" content="${esc(T.meta.description)}">
<meta name="theme-color" content="#efece4">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}

<meta property="og:type" content="website">
<meta property="og:title" content="${esc(T.meta.ogTitle)}">
<meta property="og:description" content="${esc(T.meta.ogDescription)}">
<meta property="og:image" content="${ogImage(lang)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${T.fontCss}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">

${G.appLd(lang, { siteRoot: SITE_ROOT, rel, name: T.app.name, description: T.app.description, category: 'create', image: ogImage(lang) })}
</head>
<body class="lf-body" data-screen="home">
${sprite()}
${G.topBar(lang, rel, { suggest: true })}
<div class="lf-shell">
  <main>
  <!-- 시작 화면: 티징(훅·짧은 소개·시작 버튼·견본 만화) + 입력 -->
  <div id="screen-home" class="lf-screen active">
    <section class="lf-hero">
      <div class="lf-hero-copy">
        <h1><span class="lf-eyebrow">${icon('custom', 'lf-brand-mark')}<span>${esc(T.hero.brand)}</span></span><span class="lf-h1">${esc(T.hero.h1)}</span></h1>
        <p class="lf-hero-sub">${esc(T.hero.sub)}</p>
        <div class="lf-hero-cta">
          <a href="#make" class="lf-btn lf-btn-ink" id="hero-cta">${esc(T.hero.cta)}</a>
          <span class="lf-hand-note">${esc(T.hero.note)}</span>
        </div>
        <p class="lf-hand-note" id="share-count" hidden></p>
      </div>
      <figure class="lf-sheet lf-hero-sheet">
        <canvas id="hero-canvas" role="img" aria-label="${esc(T.hero.canvasLabel)}"></canvas>
      </figure>
    </section>

    <form id="make" class="lf-make" novalidate>
      <section class="lf-step" aria-labelledby="step1">
        <h2 id="step1" class="lf-step-title"><span class="lf-num" aria-hidden="true">1</span><span>${esc(F.step1)}</span></h2>
        <div class="lf-birth">
          <label class="lf-label" for="birth-year">${esc(F.birthLabel)}</label>
          <div class="lf-year-row">
            <button type="button" class="lf-round" id="birth-minus" aria-label="${esc(F.minusAria)}">−</button>
            <input id="birth-year" class="lf-year" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" value="${DEFAULT_BIRTH}" aria-describedby="birth-error" data-min="${CORE.MIN_BIRTH}" data-max="${maxBirth}">
            <button type="button" class="lf-round" id="birth-plus" aria-label="${esc(F.plusAria)}">+</button>
          </div>
          <p class="lf-error" id="birth-error" role="alert" hidden></p>
        </div>
        <div class="lf-row2">
          <label class="lf-field">
            <span class="lf-label">${esc(F.monthLabel)} <em>${esc(F.optional)}</em></span>
            <select id="birth-month" class="lf-input">${months}</select>
          </label>
          <label class="lf-field">
            <span class="lf-label">${esc(F.nameLabel)} <em>${esc(F.optional)}</em></span>
            <input id="name" class="lf-input" type="text" maxlength="${CORE.NAME_MAX}" placeholder="${esc(F.namePh)}" autocomplete="nickname">
          </label>
        </div>
      </section>

      <section class="lf-step" aria-labelledby="step2">
        <h2 id="step2" class="lf-step-title"><span class="lf-num" aria-hidden="true">2</span><span>${esc(F.step2)}</span></h2>
        <p class="lf-hint">${esc(F.step2Hint)}</p>
        <p class="lf-count" id="count" aria-live="polite"></p>
${groups}
        <label class="lf-field lf-custom">
          <span class="lf-label">${icon('custom', 'lf-ico lf-ico-sm')} ${esc(F.customLabel)} <em>${esc(F.optional)}</em></span>
          <input id="custom-text" class="lf-input" type="text" maxlength="${CORE.CUSTOM_MAX}" placeholder="${esc(F.customPh)}">
        </label>

        <div class="lf-timeline">
          <div class="lf-timeline-head">
            <h3 class="lf-group-title">${esc(F.timelineTitle)}</h3>
            <span class="lf-hand-note">${esc(F.timelineHint)}</span>
          </div>
          <ol id="timeline-list" class="lf-tl"></ol>
        </div>
      </section>

      <section class="lf-step" aria-labelledby="step3">
        <h2 id="step3" class="lf-step-title"><span class="lf-num" aria-hidden="true">3</span><span>${esc(F.step3)}</span></h2>
        <div class="lf-pens" role="radiogroup" aria-labelledby="step3">
${pens}
        </div>
      </section>

      <div class="lf-playbar">
        <button type="submit" class="lf-btn lf-btn-ink lf-play-btn" id="play-btn">${icon('play', 'lf-ico lf-ico-fill')}<span>${esc(F.play)}</span></button>
        <span class="lf-playbar-meta" id="play-meta"></span>
      </div>
    </form>
  </div>

  <!-- 재생 + 끝 화면 -->
  <div id="screen-film" class="lf-screen" hidden>
    <div class="lf-film-top">
      <button type="button" class="lf-btn lf-btn-line lf-btn-sm" id="back-btn" data-make="${esc(T.film.makeMine)}"><span>${esc(T.film.back)}</span></button>
      <p class="lf-shared" id="shared-banner" hidden></p>
    </div>
    <div class="lf-stage" id="stage">
      <canvas id="film-canvas" role="img" aria-label="${esc(T.film.stageLabel)}"></canvas>
      <p class="lf-stage-wait" id="stage-wait">${esc(U.preparing)}</p>
    </div>
    <p class="visually-hidden" id="caption-live" aria-live="polite"></p>
    <div class="lf-controls" id="controls" role="group" aria-label="${esc(T.film.controlsLabel)}">
      <button type="button" class="lf-icon-btn" id="pp-btn" aria-label="${esc(U.pause)}">${icon('pause', 'lf-ico lf-ico-pause')}${icon('play', 'lf-ico lf-ico-fill lf-ico-play')}</button>
      <button type="button" class="lf-icon-btn" id="replay-btn" aria-label="${esc(U.replay)}">${icon('replay')}</button>
      <span class="lf-time" id="time"><span id="time-now">0:00</span> / <span id="time-total">0:00</span></span>
      <button type="button" class="lf-toggle" id="speed-btn" aria-pressed="false"><span>${esc(U.slow)}</span></button>
      <div class="lf-rec-bar" id="rec-bar" hidden><span class="lf-rec-dot" aria-hidden="true"></span><span id="rec-text"></span><span class="lf-rec-track"><span id="rec-fill"></span></span></div>
    </div>

    <div class="lf-end-wrap" id="end-wrap" hidden>
      <section class="lf-end" id="end-card" aria-labelledby="end-title">
        <h2 id="end-title"></h2>
        <p class="lf-end-close" id="end-close"></p>
        <div class="lf-end-actions">
          <button type="button" class="lf-btn lf-btn-ink" id="recipient-cta" hidden><span>${esc(T.end.recipientCta)}</span></button>
          <button type="button" class="lf-btn lf-btn-ink" id="save-btn"><span>${esc(T.end.save)}</span></button>
        </div>
        <p class="lf-end-note" id="save-note">${esc(T.end.saveNote)}</p>
        <div class="lf-rec-panel" id="rec-panel" hidden>
          <p class="lf-rec-status" id="rec-status" role="status"></p>
          <p class="lf-rec-info" id="rec-info"></p>
          <div class="lf-rec-actions">
            <a class="lf-btn lf-btn-ink" id="rec-download" href="#" hidden><span>${esc(U.recDownload)}</span></a>
            <button type="button" class="lf-btn lf-btn-line" id="rec-share" hidden><span>${esc(U.recShare)}</span></button>
            <button type="button" class="lf-btn lf-btn-line" id="rec-cancel" hidden><span>${esc(U.recCancel)}</span></button>
          </div>
        </div>
      </section>
      <div data-mg-end="life"></div>
    </div>
  </div>
  </main>

  <footer class="site-footer">
    © <span id="year"></span> ${esc(T.siteName)} · <a href="privacy.html">${esc(T.privacyLink)}</a>
  </footer>
</div>

<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
${G.scriptJson('PAGE_I18N', U)}
${G.scriptJson('MG_FAQ', faq)}
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
<script src="${root}life-core.js"></script>
<script src="${root}life-engine.js"></script>
<script src="${root}life.js"></script>
</body>
</html>
`;
}

function renderPrivacy(lang) {
  const T = L10N[lang];
  const P = T.privacy;
  const rel = 'privacy.html';
  const file = G.fileOf(lang, rel);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(SITE_ROOT, lang, rel);
  const sections = P.sections.map(([h, body]) => `    <h2>${esc(h)}</h2>\n    <p>${body}</p>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(P.title)}</title>
<meta name="description" content="${esc(P.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${T.fontCss}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}style.css">
</head>
<body class="lf-body">
${G.topBar(lang, rel, { suggest: true })}
<div class="lf-shell">
  <main class="lf-doc">
    <p class="lf-eyebrow"><a href="./">${esc(T.hero.brand)}</a></p>
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

// 예전 영어 주소(/en/...)는 루트로 넘긴다: 공유된 ?s= / #d= 링크가 그대로 열리도록 쿼리·해시를 붙여서 이동.
// 검색엔진에는 noindex + canonical(루트) + hreflang 세트로 새 주소를 알려 준다.
function renderLegacy(rel) {
  const T = L10N.en;
  const file = `en/${rel}`;
  const to = G.relHref(file, G.fileOf('en', rel));
  const url = G.publicUrl(SITE_ROOT, 'en', rel);
  const title = rel === 'privacy.html' ? T.privacy.title : T.meta.title;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${url}">
${G.hreflangTags(SITE_ROOT, rel)}
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash);</script>
</head>
<body>
<p><a href="${to}">${esc(T.siteName)}</a></p>
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
  if (G.fileOf('en', 'index.html') !== 'en/index.html') {
    ['index.html', 'privacy.html'].forEach((rel) => G.writeOut(SITE_DIR, `en/${rel}`, renderLegacy(rel)));
    console.log('생성 완료: en/index.html, en/privacy.html (예전 /en/ 주소 → 루트 리다이렉트)');
  }
  G.writeOut(SITE_DIR, 'sitemap.xml', G.sitemapXml(SITE_ROOT, ['index.html', 'privacy.html']));
  console.log(`생성 완료: sitemap.xml (URL ${G.LOCALES.length * 2}개, hreflang 대체 링크 포함)`);
}

main();
