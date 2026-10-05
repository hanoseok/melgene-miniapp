#!/usr/bin/env node
/**
 * 두더지 잡기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 흙빛 밤 + 잔디 판 3×3 구멍(두더지·황금 두더지·폭탄·망치). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 3×3 구멍: m = 두더지, g = 황금 두더지, b = 폭탄, 0 = 빈 구멍
const GRID = ['m', '0', 'b', '0', 'g', 'm', 'm', '0', '0'];
function holes() {
  const cell = 132, gap = 14, pad = 22;
  return GRID.map((k, i) => {
    const r = Math.floor(i / 3), c = i % 3;
    const x = pad + c * (cell + gap), y = pad + r * (cell + gap);
    const crit = k === 'b' ? '<b class="bomb">💣</b>' : k === '0' ? '' : `<i class="mole${k === 'g' ? ' gold' : ''}"><u></u><s></s></i>`;
    return `<span class="hole" style="left:${x}px;top:${y}px"><span class="pit"></span><span class="clip">${crit}</span></span>`;
  }).join('\n    ');
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
      radial-gradient(circle at 1110px 76px, rgba(255,226,120,.95) 0 34px, rgba(255,226,120,.16) 42px, transparent 96px),
      linear-gradient(180deg, #5a3a20 0%, #3a2414 58%, #22150c 100%);
  }
  .board { position: absolute; left: 70px; top: 50px; width: 460px; height: 460px; border-radius: 26px;
    background: linear-gradient(170deg, #5fbf4a, #3b8a38); border: 6px solid #2a5a26;
    box-shadow: 0 16px 40px rgba(0,0,0,.45), inset 0 0 40px rgba(0,0,0,.18); transform: rotate(-3deg); }
  .hole { position: absolute; width: 132px; height: 132px; }
  .pit { position: absolute; left: 8px; right: 8px; top: 62px; height: 52px; border-radius: 50%; background: radial-gradient(ellipse at 50% 30%, #3a2210, #170c05); box-shadow: 0 5px 0 rgba(0,0,0,.18); }
  .clip { position: absolute; left: 0; right: 0; top: 0; height: 88px; overflow: hidden; }
  .mole { position: absolute; left: 24px; bottom: 0; width: 84px; height: 78px; border-radius: 50% 50% 42% 42%; background: #8a5a3a; box-shadow: inset 0 -6px 0 rgba(0,0,0,.18); }
  .mole.gold { background: #ffc93c; }
  .mole u { position: absolute; left: 27px; top: 22px; width: 10px; height: 10px; border-radius: 50%; background: #1b1026; box-shadow: 20px 0 0 #1b1026; }
  .mole s { position: absolute; left: 31px; top: 38px; width: 22px; height: 15px; border-radius: 50%; background: #ff8fa8; }
  .bomb { position: absolute; left: 30px; bottom: 4px; font-size: 64px; line-height: 1; font-family: 'Apple Color Emoji', 'Noto Color Emoji', sans-serif; }
  .ham { position: absolute; left: 340px; top: 56px; font-size: 120px; line-height: 1; transform: rotate(-35deg); font-family: 'Apple Color Emoji', 'Noto Color Emoji', sans-serif; filter: drop-shadow(0 8px 6px rgba(0,0,0,.4)); }
  .text { position: absolute; left: 590px; top: 50px; width: 560px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #2a1a10;
    background: #ffd23f; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #fff6ea; text-shadow: 0 5px 0 rgba(0,0,0,.35); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #9be36a; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #6cc84a; border-top: 5px solid #2a1a10; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #2a1a10; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #1f4a1c; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">
    ${holes()}
  </div>
  <span class="ham" aria-hidden="true">🔨</span>
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
