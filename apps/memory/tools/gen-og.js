#!/usr/bin/env node
/**
 * memory(카드 짝 맞추기) OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 4×3 카드 판(장식 — 실제 판과 무관, 대부분 뒷면). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 판: '' = 뒷면, 그림 = 앞면(짝 하나 + 한 장)
const CARDS = ['', '🎃', '', '', '', '', '👻', '', '', '', '', '🎃'];
function cards() {
  return CARDS.map((c, i) => `<i class="card${c ? ' up' : ''}${c === '🎃' ? ' match' : ''}" style="--r:${((i * 7) % 5) - 2}deg">${c}</i>`).join('');
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
    position: relative; font-family: ${sans}; color: #fff6e8;
    background:
      radial-gradient(circle at 93% 12%, rgba(255,236,170,.95) 0 46px, rgba(255,236,170,.15) 47px 100px, transparent 101px),
      radial-gradient(circle at 12% 20%, rgba(107,63,196,.5) 0 200px, transparent 201px),
      linear-gradient(180deg, #160d2c, #2c1856);
  }
  .board { position: absolute; left: 64px; top: 64px; width: 470px; height: 430px; padding: 18px; border-radius: 28px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
    background: rgba(0,0,0,.22); border: 3px solid rgba(255,246,232,.25); transform: rotate(-3deg); }
  .card { display: flex; align-items: center; justify-content: center; border-radius: 16px; font-style: normal;
    font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; font-size: 58px; line-height: 1;
    background: radial-gradient(circle, rgba(255,138,31,.95) 0 7px, transparent 8px),
      repeating-radial-gradient(circle, transparent 0 11px, rgba(255,246,232,.16) 12px 13px),
      linear-gradient(160deg, #6b3fc4, #4a2690);
    border: 3px solid rgba(255,246,232,.45); transform: rotate(var(--r)); }
  .card.up { background: #fff6e8; border-color: #ff8a1f; }
  .card.match { background: #eaf9d6; border-color: #a6e35a; box-shadow: 0 0 0 5px rgba(166,227,90,.35); }
  .text { position: absolute; left: 600px; top: 50px; width: 550px; height: 450px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #1d1238;
    background: #ff8a1f; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.14; color: #fff6e8; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #a6e35a; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff8a1f; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #1d1238; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #1d1238; opacity: .9; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">${cards()}</div>
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
      function over() { return h.scrollWidth > 550 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 452; }
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
