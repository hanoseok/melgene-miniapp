#!/usr/bin/env node
/**
 * 포털 기본 OG 이미지(1200x630)를 언어별로 Chrome headless 로 만든다. 브랜드는 언어 파일의 brand.
 *   og/default.png (en, 루트), og/<언어 폴더>/default.png (ja, zh, ko, fr, de, th, vi, es, it, pt)
 * 왼쪽: 로고 + 제목, 오른쪽: 홈 화면처럼 비스듬히 놓인 앱 아이콘 모음(SITES 의 이모지·제목).
 * 아이콘 색은 페이지와 같은 hub-core.js 의 hueStyle(id) 로 정해진다.
 *
 * 실행: node tools/gen-og.js         (기본값: 전체 언어)
 *       node tools/gen-og.js en      (지정 언어만)
 */
const path = require('path');
const vm = require('vm');
const fs = require('fs');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));
const CORE = require(path.join(__dirname, '..', 'hub-core.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(SITE_DIR, '..', '..', 'shared', 'site.config.js'), 'utf8'), sandbox);
const SITES = sandbox.window.SITE_CONFIG.SITES || [];

// 글꼴은 페이지와 같은 언어 파일 typography 를 쓴다: sans(--font-sans), display(제목), fonts(추가 Google Fonts).
const DEFAULT_SANS = "'Pretendard', -apple-system, sans-serif";
const JA_SANS = "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', 'Pretendard', sans-serif"; // base.css html:lang(ja)

function card(lang, T) {
  const ty = T.typography || {};
  const sans = ty.sans || (lang === 'ja' ? JA_SANS : DEFAULT_SANS);
  const head = (ty.display || "'Gabarito', var(--font-sans)").replace('var(--font-sans)', sans);
  // 태국어는 음수 자간이 결합 문자를 뭉개고 성조 기호가 높아 줄 간격을 넓힌다. 베트남어도 위 성조 기호 때문에 조금 넓힌다.
  const h1Track = lang === 'th' ? '0' : '-0.04em';
  const h1Lead = lang === 'th' ? 1.34 : lang === 'vi' ? 1.2 : 1.12;
  const extraFonts = [].concat(ty.fonts || []).map((href) => `<link rel="stylesheet" href="${esc(href).replace('display=swap', 'display=block')}">`).join('');
  const pick = (v) => (typeof v === 'string' ? v : v[lang] || v[G.DEFAULT_LOCALE]);
  const today = new Date();
  const tiles = SITES.slice(0, 6)
    .map((s) => {
      const badge = CORE.isNew(s.added, today) ? `<span class="badge">${esc(T.ui.newBadge)}</span>` : '';
      return `<div class="tile"><div class="icon" style="${CORE.hueStyle(s.id)}"><span class="e">${s.emoji}</span>${badge}</div><div class="name">${esc(pick(s.title))}</div></div>`;
    })
    .join('');
  const h = CORE.hues((SITES[0] || { id: 'x' }).id);
  const h2 = CORE.hues((SITES[1] || { id: 'y' }).id);
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="UTF-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gabarito:wght@700;800&display=block">${extraFonts}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { font-family: ${sans}; background: #f3f5fa; color: #151b2e; position: relative; }
  .tint1 { position: absolute; right: -160px; top: -200px; width: 760px; height: 760px; border-radius: 50%;
    background: radial-gradient(circle, oklch(0.9 0.08 ${h.h} / 0.9), oklch(0.9 0.08 ${h.h} / 0) 68%); }
  .tint2 { position: absolute; right: 260px; bottom: -330px; width: 640px; height: 640px; border-radius: 50%;
    background: radial-gradient(circle, oklch(0.9 0.08 ${h2.h} / 0.7), oklch(0.9 0.08 ${h2.h} / 0) 68%); }
  .brand { position: absolute; left: 76px; top: 70px; display: flex; align-items: center; gap: 14px; }
  .brand svg { width: 58px; height: 58px; }
  .brand b { font-family: 'Gabarito', sans-serif; font-weight: 800; font-size: 50px; letter-spacing: -0.035em; line-height: 1; padding-bottom: 4px; }
  .brand .sub { display: inline-flex; align-items: center; height: 40px; padding: 0 13px; border-radius: 12px; background: #3355ff; color: #fff;
    font-family: ${sans}; font-weight: 800; font-size: 23px; letter-spacing: 0.01em; line-height: 1; }
  .copy { position: absolute; left: 80px; top: 212px; width: 520px; }
  h1 { font-family: ${head}; font-size: 74px; line-height: ${h1Lead}; font-weight: 800; letter-spacing: ${h1Track}; }
  .tag { margin-top: 22px; font-size: 30px; font-weight: 600; color: #5e6780; letter-spacing: -0.02em; }
  .shelf { position: absolute; left: 664px; top: 112px; width: 500px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 26px 18px; transform: rotate(-7deg); transform-origin: 50% 50%; }
  .tile { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .icon { position: relative; width: 142px; height: 142px; border-radius: 27%; display: grid; place-items: center;
    background: linear-gradient(150deg, oklch(0.91 0.11 calc(var(--h) + 18)), oklch(0.7 0.17 var(--h2)));
    box-shadow: inset 0 2px 0 rgba(255,255,255,.6), inset 0 -5px 12px rgba(0,0,0,.08), 0 22px 34px -18px oklch(0.4 0.16 var(--h2) / .75); }
  .icon::before { content: ''; position: absolute; inset: 0; border-radius: inherit;
    background: radial-gradient(120% 75% at 28% 0%, rgba(255,255,255,.6), rgba(255,255,255,0) 58%); }
  .e { position: relative; font-size: 80px; line-height: 1; filter: drop-shadow(0 6px 8px rgba(21,27,46,.2)); }
  .badge { position: absolute; top: -10px; right: -12px; padding: 6px 10px 7px; border-radius: 999px; background: #ff3b5c; color: #fff;
    font-family: 'Gabarito', sans-serif; font-weight: 800; font-size: 18px; line-height: 1; letter-spacing: .03em; box-shadow: 0 0 0 4px #f3f5fa; }
  .name { max-width: 100%; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #151b2e; }
</style></head><body>
  <div class="tint1"></div><div class="tint2"></div>
  <div class="brand">
    <svg viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3355ff"/><stop offset="1" stop-color="#6a7dff"/></linearGradient></defs><rect width="32" height="32" rx="9" fill="url(#g)"/><rect x="7" y="7" width="8" height="8" rx="2.6" fill="#fff"/><rect x="17" y="7" width="8" height="8" rx="2.6" fill="#fff" opacity=".55"/><rect x="7" y="17" width="8" height="8" rx="2.6" fill="#fff" opacity=".55"/><circle cx="21" cy="21" r="4.4" fill="#ff3b5c"/></svg>
    <b>${esc((T.brand && T.brand.word) || T.siteName)}</b>${T.brand && T.brand.badge ? `<span class="sub">${esc(T.brand.badge)}</span>` : ''}
  </div>
  <div class="copy">
    <h1 id="t">${T.og.h1Html}</h1>
    <p class="tag" id="og-tag">${esc(T.og.tag)}</p>
  </div>
  <div class="shelf">${tiles}</div>
  <script>
    (function () {
      var h = document.getElementById('t'), s = 74;
      h.style.whiteSpace = 'nowrap';
      while (h.scrollWidth > 520 && s > 44) { s -= 2; h.style.fontSize = s + 'px'; }
      var g = document.getElementById('og-tag'), t = 30;
      while (g.scrollHeight > 44 && t > 20) { t -= 1; g.style.fontSize = t + 'px'; }
    })();
  </script>
</body></html>`;
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-') && a !== 'all');
  const langs = args.length ? args : G.LOCALES.map((l) => l.code);
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const out = path.join(SITE_DIR, 'og', dir, 'default.png');
    shoot(card(lang, T), out);
    console.log(`[${lang}] ${path.relative(SITE_DIR, out)}`);
  });
}

main();
