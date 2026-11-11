#!/usr/bin/env node
/**
 * 눈꽃 만들기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 SVG 로 그린 예시 눈꽃(한 가지를 60도씩 돌리고 뒤집은 것) + 글자. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

// 한 가지(위쪽 방향)를 60도씩 돌리고 뒤집어 만든 예시 눈꽃
const ARM = '<path d="M0 0 V-190"/><path d="M0 -80 L-52 -132 M0 -80 L52 -132 M0 -132 L-30 -166 M0 -132 L30 -166 M0 -40 L-34 -70 M0 -40 L34 -70"/><path d="M-16 -192 L0 -214 L16 -192"/>';
function flakeSvg() {
  const parts = [];
  for (let k = 0; k < 6; k++) {
    parts.push(`<g transform="rotate(${k * 60})">${ARM}</g>`);
    parts.push(`<g transform="rotate(${k * 60}) scale(-1 1)">${ARM}</g>`);
  }
  return `<svg class="art" viewBox="-230 -230 460 460" width="460" height="460" aria-hidden="true">
    <g stroke="#9fe3ff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none">${parts.join('')}</g>
    <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" fill="none" stroke="#eaf8ff" stroke-width="7"/>
    <circle r="12" fill="#eaf8ff"/>
  </svg>`;
}

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: ${sans}; color: #eaf8ff;
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #1b4a7a, #0b2545 55%, #071a33);
  }
  .snow { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 3px, transparent 4px), radial-gradient(circle, rgba(255,255,255,.45) 0 2px, transparent 3px);
    background-size: 90px 90px, 57px 57px; background-position: 10px 20px, 33px 5px; opacity: .5; }
  .art { position: absolute; left: 40px; top: 70px; width: 480px; height: 480px; filter: drop-shadow(0 0 18px rgba(159,227,255,.6)); }
  .text { position: absolute; left: 560px; top: 90px; width: 580px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #9fe3ff; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 78px; line-height: 1.12; color: #eaf8ff;
    text-shadow: 0 0 30px rgba(159,227,255,.4), 0 5px 0 rgba(7,26,51,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #cfeeff; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(7,26,51,.8); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #9fe3ff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(234,248,255,.7); }
</style>
</head>
<body>
  <div class="snow"></div>
  ${flakeSvg().replace('class="art" ', 'class="art" style="left:40px;top:60px" ')}
  <div class="text">
    <div class="eyebrow">${esc(T.og.defaultKicker)}</div>
    <h1 id="t">${esc(T.og.defaultTitle)}</h1>
    <p class="desc" id="d">${esc(T.og.defaultDesc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자(두 줄) 안에 들어갈 때까지 글자를 줄인다
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.querySelector('.text'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 78, lh = parseFloat(getComputedStyle(h).lineHeight) / 78;
      function over() { return h.scrollWidth > 580 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 402; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 30; while (box.scrollHeight > 402 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
    });
  </script>
</body>
</html>`;
}

function main() {
  const langs = langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE);
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    shoot(card({ lang, T }), path.join(SITE_DIR, 'og', dir, 'default.png'));
    console.log(`[${lang}] og/${dir ? dir + '/' : ''}default.png`);
  });
  console.log(`생성 완료: OG 이미지 ${langs.length}장`);
}

main();
