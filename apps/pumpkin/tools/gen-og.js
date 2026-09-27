#!/usr/bin/env node
/**
 * 호박 조각(잭오랜턴 만들기) OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 pumpkin-core.js 의 render(예시 호박, 촛불 켬). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));
const CORE = require(path.join(__dirname, '..', 'pumpkin-core.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
// 예시 호박: 둥근 주황 호박, 세모 눈·코, 이빨 웃음, 덩굴 꼭지, 박쥐, 촛불 켬, 밤하늘
const SAMPLE = { s: 0, c: 0, e: 0, n: 0, m: 0, t: 1, x: 2, g: 1, k: 1, name: '' };

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
    position: relative; font-family: ${sans}; color: #fbf4ff;
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #4a2285, #1f0f3d 55%, #110722);
  }
  .glow { position: absolute; left: 20px; top: 40px; width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,160,50,.35) 0%, transparent 66%); }
  .art { position: absolute; left: 70px; top: 80px; width: 420px; height: 420px; border-radius: 48px; overflow: hidden;
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.8), 0 0 0 3px rgba(255,179,71,.35); }
  .art svg { width: 100%; height: 100%; display: block; }
  .text { position: absolute; left: 550px; top: 90px; width: 590px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #ffb347; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 80px; line-height: 1.12; color: #ffe07a;
    text-shadow: 0 0 30px rgba(255,160,50,.45), 0 5px 0 rgba(20,10,38,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #fff3c4; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(17,7,34,.75); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #ffb347; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(251,244,255,.7); }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="art">${CORE.render(SAMPLE, { prefix: 'og' })}</div>
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
      var size = 80, lh = parseFloat(getComputedStyle(h).lineHeight) / 80;
      function over() { return h.scrollWidth > 590 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 402; }
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
