#!/usr/bin/env node
/**
 * 음식 월드컵 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 물음표 접시 두 개 + VS + 트로피(음식 목록은 보여 주지 않는다 — 스포일러 금지).
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
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: ${sans}; color: #2b1810; background-color: #fff5e1;
    background-image:
      linear-gradient(45deg, rgba(232,65,44,.09) 25%, transparent 25%, transparent 75%, rgba(232,65,44,.09) 75%),
      linear-gradient(45deg, rgba(232,65,44,.09) 25%, transparent 25%, transparent 75%, rgba(232,65,44,.09) 75%);
    background-size: 60px 60px; background-position: 0 0, 30px 30px;
  }
  .art { position: absolute; left: 50px; top: 90px; width: 470px; height: 400px; }
  .plate { position: absolute; top: 120px; width: 210px; height: 210px; border-radius: 50%; display: grid; place-items: center;
    background: radial-gradient(circle, #fff 52%, #ffe9c2 53%, #ffe9c2 60%, #fff 61%); border: 6px solid #2b1810; box-shadow: 10px 10px 0 #2b1810;
    font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: 96px; color: #e8412c; }
  .plate.l { left: 10px; transform: rotate(-7deg); }
  .plate.r { left: 250px; transform: rotate(7deg); }
  .vs { position: absolute; left: 186px; top: 178px; width: 100px; height: 100px; border-radius: 50%; display: grid; place-items: center; z-index: 2;
    background: #ffc226; color: #c92f1d; border: 6px solid #2b1810; box-shadow: 6px 6px 0 #2b1810; transform: rotate(-8deg);
    font-family: 'Unbounded', sans-serif; font-weight: 800; font-size: 32px; }
  .cup { position: absolute; left: 190px; top: 0; font-size: 96px; line-height: 1; filter: drop-shadow(4px 4px 0 rgba(43,24,16,.35)); }
  .text { position: absolute; left: 560px; top: 70px; width: 590px; height: 420px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #ffc226;
    background: #2b1810; border-radius: 999px; padding: 6px 22px; margin-bottom: 20px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.16; color: #2b1810; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #c92f1d; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #e8412c; border-top: 5px solid #2b1810; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffe9c2; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <div class="cup">🏆</div>
    <div class="plate l">?</div>
    <div class="vs">VS</div>
    <div class="plate r">?</div>
  </div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(T.og.defaultKicker)}</div>
    <h1 id="t">${esc(T.og.defaultTitle)}</h1>
    <p class="desc" id="d">${esc(T.og.defaultDesc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자 안에 들어갈 때까지 글자를 줄인다 (제목 3줄까지)
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 68, lh = parseFloat(getComputedStyle(h).lineHeight) / 68;
      function over() { return h.scrollWidth > 590 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 422; }
      while (over() && size > 36) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 422 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
