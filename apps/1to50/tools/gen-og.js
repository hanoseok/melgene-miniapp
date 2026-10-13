#!/usr/bin/env node
/**
 * 1to50 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 5×5 숫자판(장식 — 실제 판과 무관). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 판: 0 = 빈 칸, 26 이상 = 짙은 파랑
const NUMS = [0, 31, 7, 0, 12, 4, 0, 27, 9, 0, 0, 15, 0, 33, 6, 22, 0, 11, 0, 29, 8, 18, 0, 13, 0];
function cells() {
  return NUMS.map((n) => `<i class="cell${n === 0 ? ' off' : n > 25 ? ' hi' : ''}${n === 6 ? ' next' : ''}">${n || ''}</i>`).join('');
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
    position: relative; font-family: ${sans}; color: #16224a;
    background:
      radial-gradient(circle at 8% 10%, rgba(255,207,63,.35) 0 120px, transparent 121px),
      radial-gradient(circle at 96% 30%, rgba(255,107,87,.18) 0 90px, transparent 91px),
      linear-gradient(180deg, #f7faff, #dbe8ff);
  }
  .board { position: absolute; left: 70px; top: 52px; width: 440px; height: 440px; padding: 16px; border-radius: 30px;
    display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;
    background: #fff; border: 4px solid rgba(60,109,240,.35); box-shadow: 0 22px 44px rgba(60,109,240,.25); transform: rotate(-3deg); }
  .cell { display: flex; align-items: center; justify-content: center; border-radius: 16px;
    font-family: 'Fredoka', sans-serif; font-weight: 600; font-size: 40px; line-height: 1; font-style: normal;
    background: #d7e6ff; color: #16224a; box-shadow: inset 0 -5px 0 rgba(35,71,184,.16); }
  .cell.hi { background: #3c6df0; color: #fff; box-shadow: inset 0 -5px 0 rgba(0,0,0,.18); }
  .cell.off { background: #f2f5fb; box-shadow: none; }
  .cell.next { background: #ffcf3f; transform: scale(1.12); box-shadow: 0 6px 16px rgba(255,180,0,.5); }
  .text { position: absolute; left: 590px; top: 50px; width: 560px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #fff;
    background: #3c6df0; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.14; color: #16224a; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #d9442f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff6b57; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff; opacity: .95; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">${cells()}</div>
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
      function over() { return h.scrollWidth > 560 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
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
