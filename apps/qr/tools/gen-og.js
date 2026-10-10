#!/usr/bin/env node
/**
 * QR코드 생성기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 qr-core.js 로 만든 진짜 QR코드(앱 주소 https://melgene.com/qr/ — 찍으면 앱이 열림) + 제목. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));
const Q = require(path.join(__dirname, '..', 'qr-core.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
const APP_URL = 'https://melgene.com/qr/';

function qrSvg() {
  const svg = Q.toSvg(Q.encode(APP_URL, { ecc: 'M' }), { fg: '#121212', bg: '#ffffff', margin: 2, px: 360 });
  return svg.replace(/^<\?xml[^>]*>\s*/, '');
}

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const fontLink = F.css && F.css !== PRETENDARD ? `<link rel="stylesheet" href="${esc(F.css)}">` : '';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
${fontLink}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #121212; background: #f3f1ea;
    background-image: linear-gradient(rgba(18,18,18,.06) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(18,18,18,.06) 1.5px, transparent 1.5px); background-size: 30px 30px; }
  .qr { position: absolute; left: 70px; top: 70px; width: 420px; height: 420px; padding: 24px; background: #fff; border: 7px solid #121212; border-radius: 28px;
    box-shadow: 14px 14px 0 #2f55ff; }
  .qr svg { display: block; width: 100%; height: 100%; }
  .tag { position: absolute; left: 44px; top: 452px; transform: rotate(-6deg); background: #d6ff3d; border: 5px solid #121212; border-radius: 14px;
    padding: 6px 16px; font-family: ${display}; font-weight: ${w}; font-size: 26px; }
  .text { position: absolute; left: 560px; top: 50px; width: 590px; height: 450px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.35; color: #d6ff3d;
    background: #121212; border-radius: 10px; padding: 6px 18px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 66px; line-height: 1.14; color: #121212; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #1d3ad6; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.38; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 74px; padding: 0 56px; display: flex; align-items: center;
    background: #121212; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #d6ff3d; }
</style>
</head>
<body>
  <div class="qr" aria-hidden="true">${qrSvg()}</div>
  <div class="tag">PNG · SVG</div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(T.og.kicker)}</div>
    <h1 id="t">${esc(T.og.title)}</h1>
    <p class="desc" id="d">${esc(T.og.desc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자 안에 들어갈 때까지 글자를 줄인다 (제목 3줄까지)
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 66, lh = parseFloat(getComputedStyle(h).lineHeight) / 66;
      function over() { return h.scrollWidth > 590 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 452; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 452 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
