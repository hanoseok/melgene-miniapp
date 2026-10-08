#!/usr/bin/env node
/**
 * 앱마다 긴 글 가이드(guide.html)를 언어별로 만든다 — AdSense "가치가 낮은 콘텐츠" 대응(사용자 승인 2026-10-09).
 * 앱 시작 화면은 그대로(티징만) 두고, 앱이 무엇인지·어떻게 하는지·팁을 담은 글은 별도 페이지에만 둔다.
 *
 *   입력: apps/<id>/tools/guide/<lang>.js  (12개 언어, 모양은 .claude/skills/melgene-miniapp/references/new-app.md "가이드")
 *         { metaTitle, description, h1, updated: 'YYYY-MM-DD', intro, sections: [{ h, p: [...], list?: [...] }], cta }
 *         글은 모두 일반 텍스트(HTML 없음) — 여기서 escape 한다.
 *   출력: apps/<id>/guide.html (en) + <dir>/guide.html (보통) / _l/<lang>/guide.html (MG_I18N_MODE=variant)
 *         보통 모드에서만: sitemap.xml 에 guide.html 12개 언어 URL 추가.
 *         그리고 이번 모드의 앱 HTML 중 푸터에 privacy.html 링크가 있는 파일마다
 *           ① 푸터: privacy 링크 바로 뒤에 ` · <a href="<같은 접두어>guide.html">가이드</a>`
 *           ② <head>: <meta name="mg-guide" content="<같은 접두어>guide.html"> → 끝 화면 FAQ 블록 맨 아래 "📖 가이드 & 팁" (common.js)
 *         둘 다 이미 있으면 건너뛴다(여러 번 돌려도 같다).
 *   가이드 파일이 없거나 12개가 다 없거나 읽다 실패하면 그 앱은 건너뛴다(경고만, 지난 guide.html 은 지운다).
 *
 * tools/gen-all.js 가 앱 생성기(보통 + variant) 바로 뒤에 앱마다 두 번 돌린다(포털보다 먼저).
 * 실행: node tools/gen-guides.js [앱 id …]            (보통 모드, id 없으면 모든 앱)
 *       MG_I18N_MODE=variant node tools/gen-guides.js [앱 id …]
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, 'lib', 'i18n-gen.js'));

const ROOT = path.join(__dirname, '..');
const APPS = path.join(ROOT, 'apps');
const REL = 'guide.html';
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const LANGS = G.LOCALES.map((l) => l.code);
const DATE_LOCALE = { zh: 'zh-CN', pt: 'pt-BR' };
const { esc } = G;

function warn(msg) { console.log(`  (건너뜀) ${msg}`); }

// apps/<id>/tools/guide/<lang>.js 12개를 읽는다. 하나라도 없거나 깨지면 null (+ 이유)
function loadGuides(appDir) {
  const dir = path.join(appDir, 'tools', 'guide');
  if (!fs.existsSync(dir)) return { guides: null, why: null };
  const missing = LANGS.filter((c) => !fs.existsSync(path.join(dir, `${c}.js`)));
  if (missing.length) return { guides: null, why: `가이드 언어 파일 없음: ${missing.join(', ')}` };
  const guides = {};
  for (const c of LANGS) {
    const p = path.join(dir, `${c}.js`);
    try {
      delete require.cache[require.resolve(p)];
      guides[c] = require(p);
    } catch (e) {
      return { guides: null, why: `${path.relative(ROOT, p)} 읽기 실패: ${e.message}` };
    }
    const g = guides[c];
    const bad = ['metaTitle', 'description', 'h1', 'updated', 'intro', 'cta'].filter((k) => typeof g[k] !== 'string' || !g[k].trim());
    if (!Array.isArray(g.sections) || !g.sections.length) bad.push('sections');
    else g.sections.forEach((s, i) => { if (!s || typeof s.h !== 'string' || !Array.isArray(s.p)) bad.push(`sections[${i}]`); });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(g.updated || ''))) bad.push('updated(YYYY-MM-DD)');
    if (bad.length) return { guides: null, why: `[${c}] 가이드 모양이 이상함: ${bad.join(', ')}` };
  }
  return { guides, why: null };
}

function pick(v, lang) {
  if (v == null || typeof v === 'string') return v || '';
  return v[lang] != null ? v[lang] : v[G.DEFAULT_LOCALE] || '';
}

function fmtDate(iso, lang) {
  try {
    return new Intl.DateTimeFormat(DATE_LOCALE[lang] || lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso + 'T00:00:00Z'));
  } catch (e) {
    return iso;
  }
}

function ogImageOf(appDir, siteRoot, lang) {
  const { dir } = G.LOCALES.find((l) => l.code === lang);
  const rel = `og/${dir ? dir + '/' : ''}default.png`;
  if (fs.existsSync(path.join(appDir, rel))) return `${siteRoot}/${rel}`;
  if (fs.existsSync(path.join(appDir, 'og', 'default.png'))) return `${siteRoot}/og/default.png`;
  return '';
}

function privacyLabel(appDir, lang) {
  try { return require(path.join(appDir, 'tools', 'i18n', `${lang}.js`)).privacyLink || ''; } catch (e) { return ''; }
}

function renderGuide(app, appDir, lang, g) {
  const siteRoot = `https://${app.id}.example.com`;
  const file = G.fileOf(lang, REL);
  const root = G.rootPrefix(file);
  const url = G.publicUrl(siteRoot, lang, REL);
  const appUrl = G.publicUrl(siteRoot, lang, 'index.html');
  const appHref = G.relHref(file, G.fileOf(lang, 'index.html'));
  const privacyHref = G.relHref(file, G.fileOf(lang, 'privacy.html'));
  const hasPrivacy = fs.existsSync(path.join(appDir, G.folderFileOf(lang, 'privacy.html')));
  const loc = G.LOCALES.find((l) => l.code === lang);
  const home = 'https://example.com/' + (G.MODE === 'folder' && loc.dir ? loc.dir + '/' : '');
  const homeLd = 'https://example.com/' + (loc.dir ? loc.dir + '/' : '');
  const brand = G.brandOf(lang);
  const title = pick(app.title, lang);
  const S = G.STRINGS[lang] || G.STRINGS.en;
  const og = ogImageOf(appDir, siteRoot, lang);
  const favicon = fs.existsSync(path.join(appDir, 'favicon.svg')) ? `<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">` : '';
  const updated = G.fmt(S.guideUpdated || 'Updated {date}', { date: fmtDate(g.updated, lang) });

  const org = { '@type': 'Organization', name: brand, url: homeLd };
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': url + '#article',
        headline: g.h1,
        description: g.description,
        inLanguage: lang,
        datePublished: g.updated,
        dateModified: g.updated,
        author: org,
        publisher: org,
        mainEntityOfPage: url,
        url,
        about: { '@type': 'WebApplication', name: title, url: appUrl },
        ...(og ? { image: og } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: brand, item: homeLd },
          { '@type': 'ListItem', position: 2, name: title, item: appUrl },
          { '@type': 'ListItem', position: 3, name: g.h1, item: url },
        ],
      },
    ],
  };
  const ldJson = JSON.stringify(ld).replace(/</g, '\\u003c');

  const sections = g.sections.map((s, i) => {
    const ps = s.p.map((t) => `      <p>${esc(t)}</p>`).join('\n');
    const list = Array.isArray(s.list) && s.list.length
      ? `\n      <ul>\n${s.list.map((t) => `        <li>${esc(t)}</li>`).join('\n')}\n      </ul>`
      : '';
    const ad = i === 1 ? '\n    <div class="mg-ad"></div>' : '';
    return `    <section>\n      <h2>${esc(s.h)}</h2>\n${ps}${list}\n    </section>${ad}`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(g.metaTitle)}</title>
<meta name="description" content="${esc(g.description)}">
<link rel="canonical" href="${url}">
${G.hreflangTags(siteRoot, REL)}

<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(brand)}">
<meta property="og:title" content="${esc(g.metaTitle)}">
<meta property="og:description" content="${esc(g.description)}">
${og ? `<meta property="og:image" content="${og}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n` : ''}<meta property="og:url" content="${url}">
${G.ogLocaleTags(lang)}
<meta name="twitter:card" content="summary_large_image">
<meta property="article:modified_time" content="${g.updated}">
<meta name="mg-no-play" content="1">

<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#f6f7fb" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1320" media="(prefers-color-scheme: dark)">
${favicon}
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${root}shared/base.css">
<link rel="stylesheet" href="${root}shared/article.css">
<script type="application/ld+json">${ldJson}</script>
</head>
<body class="mg-art-body">
${G.topBar(lang, REL, { title })}
<main class="mg-art-shell">
  <nav class="mg-art-crumbs" aria-label="Breadcrumb"><a href="${home}">${esc(brand)}</a><span aria-hidden="true">›</span><a href="${appHref}">${esc(title)}</a></nav>
  <article class="mg-art">
    <p class="mg-art-kicker"><span aria-hidden="true">${esc(app.emoji || '')}</span>${esc(title)}</p>
    <h1>${esc(g.h1)}</h1>
    <p class="mg-art-meta"><time datetime="${g.updated}">${esc(updated)}</time></p>
    <p class="mg-art-intro">${esc(g.intro)}</p>
${sections}
    <p class="mg-art-cta-wrap"><a class="mg-art-cta" href="${appHref}"><span aria-hidden="true">${esc(app.emoji || '▶')}</span>${esc(g.cta)}</a></p>
  </article>

  <footer class="site-footer">
    © <span id="year"></span> ${esc(brand)} · <a href="${appHref}">${esc(title)}</a>${hasPrivacy ? ` · <a href="${privacyHref}">${esc(privacyLabel(appDir, lang) || 'Privacy')}</a>` : ''}
  </footer>
</main>
<script src="${root}shared/site.config.js"></script>
<script src="${root}shared/i18n.js"></script>
<script src="${root}shared/common.js"></script>
<script src="${root}shared/supa.js"></script>
</body>
</html>
`;
}

// 이번 모드의 앱 HTML 파일들 (보통 = _l 밖, variant = _l 안). tools/og/shared 는 건너뛴다.
function htmlFiles(appDir) {
  const out = [];
  const skip = new Set(['tools', 'shared', 'og', 'node_modules', '.omc']);
  (function walk(dir, rel) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(ent.name) || ent.isSymbolicLink()) continue;
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      if (ent.isDirectory()) {
        if (!rel && ent.name === G.VARIANT_DIR && G.MODE !== 'variant') continue;
        walk(path.join(dir, ent.name), r);
      } else if (ent.name.endsWith('.html') && ent.name !== REL) {
        const inVariant = r.startsWith(G.VARIANT_DIR + '/');
        if (inVariant === (G.MODE === 'variant')) out.push(path.join(dir, ent.name));
      }
    }
  })(appDir, '');
  return out;
}

// 푸터의 privacy 링크 뒤에 가이드 링크 + <head> 에 mg-guide 메타. 바뀐 파일 수를 돌려준다.
const PRIVACY_A = /<a href="((?:\.\.\/)*)privacy\.html">[^<]*<\/a>/;
function injectLinks(appDir) {
  let n = 0;
  htmlFiles(appDir).forEach((f) => {
    let html = fs.readFileSync(f, 'utf8');
    const fm = /<footer\b[^>]*>[\s\S]*?<\/footer>/.exec(html);
    if (!fm) return;
    const am = PRIVACY_A.exec(fm[0]);
    if (!am) return;
    const prefix = am[1];
    const lang = ((/<html[^>]*\slang="([^"]+)"/.exec(html) || [])[1] || G.DEFAULT_LOCALE).split('-')[0];
    const label = (G.STRINGS[lang] || G.STRINGS.en).guideLink || 'Guide';
    const href = `${prefix}${REL}`;
    let footer = fm[0];
    if (!footer.includes(`href="${href}"`)) {
      footer = footer.replace(am[0], `${am[0]} · <a href="${href}">${esc(label)}</a>`);
    }
    let out = html.slice(0, fm.index) + footer + html.slice(fm.index + fm[0].length);
    if (!/<meta name="mg-guide"/.test(out)) out = out.replace('</head>', `<meta name="mg-guide" content="${href}">\n</head>`);
    if (out !== html) { fs.writeFileSync(f, out, 'utf8'); n++; }
  });
  return n;
}

// sitemap.xml 에 guide.html(12개 언어) 블록을 덧붙인다 — 기존 URL 은 그대로 둔다.
function addToSitemap(appDir, siteRoot, lastmod) {
  const p = path.join(appDir, 'sitemap.xml');
  if (!fs.existsSync(p)) return false;
  const xml = fs.readFileSync(p, 'utf8');
  if (xml.includes(`<loc>${siteRoot}/${REL}</loc>`)) return false;
  const blocks = G.sitemapXml(siteRoot, [REL], lastmod).split('\n').filter((l, i, a) => i > 1 && i < a.length - 2).join('\n');
  fs.writeFileSync(p, xml.replace(/\n?<\/urlset>\s*$/, `\n${blocks}\n</urlset>\n`), 'utf8');
  return true;
}

// 가이드가 없어진 앱: 지난 guide.html(보통 모드 파일) 정리
function removeStale(appDir) {
  if (G.MODE === 'variant') return;
  LANGS.forEach((c) => {
    const f = path.join(appDir, G.folderFileOf(c, REL));
    if (fs.existsSync(f)) fs.rmSync(f);
  });
}

function main() {
  const ids = process.argv.slice(2).length
    ? process.argv.slice(2)
    : fs.readdirSync(APPS).filter((d) => d !== 'hub' && fs.existsSync(path.join(APPS, d, 'app.config.js'))).sort();
  let made = 0;
  ids.forEach((id) => {
    const appDir = path.join(APPS, id);
    const cfgPath = path.join(appDir, 'app.config.js');
    if (id === 'hub' || !fs.existsSync(cfgPath)) return;
    const { guides, why } = loadGuides(appDir);
    if (!guides) {
      if (why) warn(`apps/${id}: ${why}`);
      removeStale(appDir);
      return;
    }
    delete require.cache[require.resolve(cfgPath)];
    const app = require(cfgPath);
    const siteRoot = `https://${id}.example.com`;
    LANGS.forEach((c) => G.writeOut(appDir, G.fileOf(c, REL), renderGuide(app, appDir, c, guides[c])));
    const injected = injectLinks(appDir);
    const sm = G.MODE === 'variant' ? false : addToSitemap(appDir, siteRoot, guides.en.updated);
    made++;
    console.log(`가이드: apps/${id} — guide.html × ${LANGS.length}${G.MODE === 'variant' ? ' (숨은 변형 _l/)' : ''}, 푸터 링크 ${injected}개 파일${sm ? ', sitemap +guide.html' : ''}`);
  });
  if (!made && process.argv.slice(2).length === 0) console.log('가이드: 만들 앱이 없다 (apps/<id>/tools/guide/<lang>.js 없음)');
}

main();
