#!/usr/bin/env node
/**
 * 2048 게임 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 보랏빛 밤 + 4×4 판(뼈색·호박·보라 타일, 2048 잭오랜턴 타일). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 판 (0 = 빈 칸)
const BOARD = [
  [2, 4, 8, 2],
  [16, 32, 64, 4],
  [512, 256, 128, 8],
  [2048, 1024, 32, 2],
];
const COLORS = {
  2: ['#f6ead8', '#3b2468'], 4: ['#f1d9b5', '#3b2468'], 8: ['#ffb366', '#2a1600'], 16: ['#ff9a3c', '#2a1600'],
  32: ['#ff7a2a', '#fff6ea'], 64: ['#f2571c', '#fff6ea'], 128: ['#c9a2ff', '#1b1026'], 256: ['#a77bff', '#1b1026'],
  512: ['#8a5cf0', '#fff6ea'], 1024: ['#b8ff5c', '#1b1026'], 2048: ['#ff8a1f', '#1b1026'],
};
function tiles() {
  const cs = 100, gap = 12;
  return BOARD.flatMap((row, r) => row.map((v, c) => {
    if (!v) return '';
    const [bg, fg] = COLORS[v];
    const fs = v >= 1000 ? 34 : v >= 100 ? 42 : 52;
    const glow = v === 2048 ? 'box-shadow:0 0 26px rgba(255,200,60,.85);' : '';
    return `<span class="t" style="left:${gap + c * (cs + gap)}px;top:${gap + r * (cs + gap)}px;background:${bg};color:${fg};font-size:${fs}px;${glow}">${v}</span>`;
  })).join('\n    ');
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: ${sans}; color: #fff6ea;
    background:
      radial-gradient(circle at 1110px 76px, rgba(255,244,199,.95) 0 34px, rgba(255,244,199,.14) 42px, transparent 96px),
      radial-gradient(2px 2px at 140px 30px, #fff 50%, transparent 51%), radial-gradient(2px 2px at 620px 34px, #fff 50%, transparent 51%),
      radial-gradient(2px 2px at 760px 120px, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 980px 250px, #fff 50%, transparent 51%),
      linear-gradient(180deg, #3b2468 0%, #1c1230 58%, #110a1f 100%);
  }
  .board { position: absolute; left: 70px; top: 50px; width: 460px; height: 460px; border-radius: 26px;
    background: linear-gradient(170deg, #3b2468, #241642); border: 5px solid rgba(255,138,31,.6);
    box-shadow: 0 16px 40px rgba(0,0,0,.45); transform: rotate(-3deg); }
  .t { position: absolute; width: 100px; height: 100px; border-radius: 14px; display: grid; place-items: center;
    font-family: 'Lilita One', sans-serif; line-height: 1; box-shadow: inset 0 -6px 0 rgba(0,0,0,.16); }
  .text { position: absolute; left: 590px; top: 50px; width: 560px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #1b1026;
    background: #b8ff5c; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #fff6ea; text-shadow: 0 5px 0 rgba(0,0,0,.35); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffb366; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff8a1f; border-top: 5px solid #1b1026; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #1b1026; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #3b2468; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">
    ${tiles()}
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
      var size = 72, lh = parseFloat(getComputedStyle(h).lineHeight) / 72;
      function over() { return h.scrollWidth > 560 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
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
