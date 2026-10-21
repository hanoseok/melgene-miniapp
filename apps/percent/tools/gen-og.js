#!/usr/bin/env node
/**
 * 퍼센트 계산기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 계산기 결과 카드 모양(숫자는 예시가 아니라 "?%" — 진짜 숫자만 보여 준다는 규칙) + 기울어진 % 타일 + 모눈종이 바탕.
 * 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

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
<link rel="stylesheet" href="${NUM_FONT}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #1b2440; background: #f4f6fb;
    background-image: linear-gradient(rgba(27,36,64,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(27,36,64,.07) 2px, transparent 2px);
    background-size: 44px 44px; }
  .art { position: absolute; left: 70px; top: 60px; width: 440px; height: 440px; }
  .card { position: absolute; left: 0; top: 10px; width: 400px; height: 300px; border-radius: 36px; border: 5px solid #1b2440; box-shadow: 10px 10px 0 #1b2440;
    background: #fffbe8; transform: rotate(-4deg); text-align: center; padding-top: 34px; }
  .pill { display: inline-block; padding: 4px 18px; border-radius: 999px; background: #1b2440; color: #fff; font: 700 22px/1.4 ${sans}; }
  .big { margin-top: 8px; font: 700 150px/1 'Space Grotesk', sans-serif; color: #e2441f; letter-spacing: -4px; }
  .tile { position: absolute; left: 270px; top: 250px; width: 170px; height: 170px; border-radius: 40px; border: 5px solid #1b2440; box-shadow: 8px 8px 0 #1b2440;
    background: #ffe066; transform: rotate(8deg); display: flex; align-items: center; justify-content: center; font: 700 110px/1 'Space Grotesk', sans-serif; color: #1b2440; }
  .text { position: absolute; left: 560px; top: 60px; width: 590px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 25px; line-height: 1.35; color: #1b2440; background: #fff;
    border: 3px solid #1b2440; border-radius: 999px; padding: 5px 20px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 66px; line-height: 1.14; color: #1b2440; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #e2441f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #1b2440; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffe066; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <div class="card"><span class="pill">${esc(T.ui.summaryTitle)}</span><div class="big">?%</div></div>
    <div class="tile">%</div>
  </div>
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
      function over() { return h.scrollWidth > 590 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
      while (over() && size > 36) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 442 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
