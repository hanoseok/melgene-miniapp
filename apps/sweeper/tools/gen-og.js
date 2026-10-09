#!/usr/bin/env node
/**
 * 지뢰찾기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 레이더 판(칸 격자·숫자·깃발·지뢰). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 판: 7칸 × 6줄 — . 닫힌 칸, o 빈 칸, 1~3 숫자, F 깃발, M 지뢰
const MAP = ['..1oo1.', '.F2o12.', '12ooo1.', 'o1112F.', 'o1.M.1.', 'o1..21.'];
function cells() {
  const sz = 52, gap = 6, pad = 24, top0 = 52;
  return MAP.map((row, r) => row.split('').map((ch, c) => {
    const left = pad + c * (sz + gap), top = top0 + r * (sz + gap);
    const open = ch !== '.' && ch !== 'F';
    const label = /[123]/.test(ch) ? ch : ch === 'F' ? '🚩' : ch === 'M' ? '💣' : '';
    return `<i class="cell${open ? ' open' : ''}${/[123]/.test(ch) ? ' n' + ch : ''}" style="left:${left}px;top:${top}px">${label}</i>`;
  }).join('')).join('\n    ');
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
      linear-gradient(rgba(111,168,220,.08) 1px, transparent 1px) 0 0 / 100% 30px,
      linear-gradient(90deg, rgba(111,168,220,.08) 1px, transparent 1px) 0 0 / 30px 100%,
      radial-gradient(ellipse 120% 80% at 30% 0%, #123a4a, #0a2230 55%, #05131a 100%);
  }
  .board { position: absolute; left: 60px; top: 50px; width: 456px; height: 440px; border-radius: 22px;
    background: linear-gradient(180deg, #0a2230, #05131a); border: 4px solid #3de0c0;
    box-shadow: 0 0 0 3px rgba(111,168,220,.6), 0 0 40px rgba(61,224,192,.45), 0 18px 40px rgba(0,0,0,.5); transform: rotate(-2deg); overflow: hidden; }
  .cell { position: absolute; width: 52px; height: 52px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 30px; line-height: 1;
    background: linear-gradient(160deg, #3f6b7e, #234a5b); box-shadow: inset 0 2px 0 rgba(255,255,255,.3), inset 0 -3px 0 rgba(0,0,0,.35); }
  .cell.open { background: rgba(4,20,27,.9); box-shadow: inset 0 0 0 1px rgba(111,168,220,.25); }
  .n1 { color: #6cb4ff; } .n2 { color: #6fe07a; } .n3 { color: #ff7d7d; }
  .text { position: absolute; left: 600px; top: 50px; width: 550px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #04141b;
    background: #ffd84a; border-radius: 10px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); box-shadow: 0 0 20px rgba(255,216,74,.55); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.14; color: #fff;
    text-shadow: 0 0 18px rgba(255,122,60,.9), 0 0 4px rgba(255,122,60,.9), 0 5px 0 rgba(0,0,0,.45); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #3de0c0; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff7a3c; border-top: 4px solid #fff; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff; opacity: .92; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">
    ${cells()}
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
