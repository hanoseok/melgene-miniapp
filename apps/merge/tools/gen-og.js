#!/usr/bin/env node
/**
 * 수박 게임 할로윈 머지 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 보랏빛 밤 + 유리병 안에 쌓인 조각들(잭오랜턴·호박·유령…) + 점선. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const EMOJI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";

// 병 안 조각: [x, y, r, 종류 또는 [색, 이모지]]
const PIECES = [
  [330, 440, 92, 'jack'],
  [148, 470, 62, ['#e4e9ff', '👻']],
  [232, 330, 52, ['#7a64c8', '🦇']],
  [104, 352, 44, ['#ff6b6b', '🍎']],
  [370, 290, 40, ['#d79a5c', '🌰']],
  [300, 250, 30, ['#c9a2ff', '🍭']],
  [168, 262, 26, ['#ff8cc0', '🍬']],
];
function piece([x, y, r, kind]) {
  if (kind === 'jack') {
    const s = r / 50;
    return `<svg class="pc" style="left:${x - r * 1.2}px;top:${y - r * 1.25}px;width:${r * 2.4}px;height:${r * 2.4}px" viewBox="-60 -62 120 120">
      <circle r="50" fill="#ff9a1f" stroke="#1b1026" stroke-width="${3 / s + 1}"/>
      <path d="M-27 -46 Q-36 0 -27 46 M27 -46 Q36 0 27 46 M0 -50 V50" fill="none" stroke="#a84a00" stroke-opacity=".5" stroke-width="3"/>
      <path d="M-4 -48 Q-2 -58 8 -60 L9 -52 Q4 -50 5 -46 Z" fill="#4f7a2a" stroke="#1b1026" stroke-width="2"/>
      <g fill="#fff3a0" stroke="#5a1e00" stroke-width="1.5" style="filter:drop-shadow(0 0 6px #ffe066)">
        <path d="M-26 -5 L-16 -21 L-6 -5 Z M26 -5 L16 -21 L6 -5 Z M-4 1 H4 L0 8 Z"/>
        <path d="M-30 12 Q0 41 30 12 L21 15 L17 22 L11 16 L4 24 L-3 16 L-10 23 L-16 15 L-22 20 Z"/>
      </g>
    </svg>`;
  }
  const [color, emoji] = kind;
  return `<span class="pc disc" style="left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 2}px;background:radial-gradient(circle at 32% 28%, rgba(255,255,255,.6), ${color} 38%);font-size:${Math.round(r * 1.18)}px">${emoji}</span>`;
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
    position: relative; font-family: ${sans}; color: #fff6ea;
    background:
      radial-gradient(circle at 1110px 76px, rgba(255,244,199,.95) 0 34px, rgba(255,244,199,.14) 42px, transparent 96px),
      radial-gradient(2px 2px at 140px 60px, #fff 50%, transparent 51%), radial-gradient(2px 2px at 520px 34px, #fff 50%, transparent 51%),
      radial-gradient(2px 2px at 760px 120px, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 980px 250px, #fff 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 640px 300px, #fff 50%, transparent 51%),
      linear-gradient(180deg, #3a2266 0%, #1a0f2e 58%, #0f0820 100%);
  }
  .jar { position: absolute; left: 60px; top: 70px; width: 460px; height: 480px;
    border: 8px solid rgba(255,246,234,.75); border-top: none; border-radius: 0 0 46px 46px;
    background: linear-gradient(90deg, rgba(255,255,255,.1) 0 4%, transparent 9%, transparent 91%, rgba(255,255,255,.07) 96%), rgba(255,246,234,.05); }
  .line { position: absolute; left: 70px; width: 440px; top: 168px; border-top: 4px dashed rgba(255,77,94,.75); }
  .pc { position: absolute; }
  .disc { display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 4px solid #1b1026;
    font-family: ${EMOJI}; line-height: 1; }
  .drop { position: absolute; left: 266px; top: 82px; width: 44px; height: 44px; border-radius: 50%; border: 4px solid #1b1026;
    background: #ffe08a; display:flex; align-items:center; justify-content:center; font-size: 26px; font-family: ${EMOJI}; }
  .text { position: absolute; left: 580px; top: 60px; width: 570px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #1b1026;
    background: #b8ff5c; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #fff6ea; text-shadow: 0 5px 0 rgba(0,0,0,.35); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffb366; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff8a1f; border-top: 5px solid #1b1026; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #1b1026; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #3a2266; }
</style>
</head>
<body>
  <div class="jar" aria-hidden="true"></div>
  <div class="line" aria-hidden="true"></div>
  <span class="drop" aria-hidden="true">🍬</span>
  <div style="position:absolute;left:60px;top:70px;width:460px;height:480px" aria-hidden="true">
    ${PIECES.map((p) => piece([p[0] - 60, p[1] - 70, p[2], p[3]])).join('\n    ')}
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
      function over() { return h.scrollWidth > 570 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 432; }
      while (over() && size > 36) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 432 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
