#!/usr/bin/env node
/**
 * 벽돌깨기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 네온 오락실 판(빛나는 벽돌 줄·공·패들). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 판: 6칸 × 5줄 벽돌 (0 = 깨진 자리)
const ROWS = ['111111', '110111', '111101', '101111', '111011'];
const COLORS = ['#ff3ea5', '#ff8a3d', '#ffd319', '#8bff5a', '#2de2e6'];
function bricks() {
  const bw = 62, bh = 24, gap = 8, pad = 24;
  return ROWS.map((row, r) => row.split('').map((ch, c) => (ch === '1'
    ? `<i class="bk" style="left:${pad + c * (bw + gap)}px;top:${pad + 10 + r * (bh + gap)}px;background:${COLORS[r]};box-shadow:0 0 14px ${COLORS[r]}"></i>` : '')).join('')).join('\n    ');
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
    position: relative; font-family: ${sans}; color: #f4f0ff;
    background:
      linear-gradient(rgba(155,92,255,.08) 1px, transparent 1px) 0 0 / 100% 30px,
      linear-gradient(90deg, rgba(155,92,255,.08) 1px, transparent 1px) 0 0 / 30px 100%,
      radial-gradient(ellipse 120% 80% at 30% 0%, #1d1150, #120a33 55%, #07061a 100%);
  }
  .board { position: absolute; left: 70px; top: 44px; width: 470px; height: 468px; border-radius: 22px;
    background: linear-gradient(180deg, #120a33, #07061a); border: 4px solid #2de2e6;
    box-shadow: 0 0 0 3px rgba(155,92,255,.6), 0 0 40px rgba(45,226,230,.45), 0 18px 40px rgba(0,0,0,.5); transform: rotate(-2deg); overflow: hidden; }
  .bk { position: absolute; width: 62px; height: 24px; border-radius: 5px; }
  .bk::after { content: ''; position: absolute; left: 5px; right: 5px; top: 3px; height: 5px; border-radius: 3px; background: rgba(255,255,255,.4); }
  .ball { position: absolute; left: 262px; top: 300px; width: 22px; height: 22px; border-radius: 50%; background: #fff; box-shadow: 0 0 16px #fff, 0 0 30px #2de2e6; }
  .trail { position: absolute; left: 196px; top: 330px; width: 74px; height: 8px; border-radius: 4px; transform: rotate(-38deg); transform-origin: right center;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.55)); }
  .paddle { position: absolute; left: 150px; top: 418px; width: 140px; height: 20px; border-radius: 10px;
    background: linear-gradient(180deg, #fff, #2de2e6 40%, #139ea1); box-shadow: 0 0 22px #2de2e6; }
  .text { position: absolute; left: 600px; top: 50px; width: 550px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #0b0820;
    background: #ffd319; border-radius: 10px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); box-shadow: 0 0 20px rgba(255,211,25,.55); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.14; color: #fff;
    text-shadow: 0 0 18px rgba(255,62,165,.9), 0 0 4px rgba(255,62,165,.9), 0 5px 0 rgba(0,0,0,.45); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #2de2e6; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff3ea5; border-top: 4px solid #fff; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff; opacity: .92; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">
    ${bricks()}
    <span class="trail"></span>
    <span class="ball"></span>
    <span class="paddle"></span>
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
      function over() { return h.scrollWidth > 550 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
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
