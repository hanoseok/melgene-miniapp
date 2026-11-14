#!/usr/bin/env node
/**
 * 상장 만들기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 CSS 로 그린 예시 상장(금테 + 머리글 + 예시 상 이름 + 빈 이름 줄 + 빨간 도장, 사람 이름·이유 없음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  const serif = `${F.serif}, ${display}`;
  const sw = Number(F.serifWeight) || 700;
  const seal = T.card.sealFallback === '★' ? '★' : T.card.sealFallback;
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
    position: relative; font-family: ${sans}; color: #f7f3ea;
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #263872, #172144 55%, #0c1226);
  }
  .spot { position: absolute; left: -40px; top: -80px; width: 640px; height: 760px;
    background: radial-gradient(ellipse at 50% 40%, rgba(255,211,110,.28), transparent 65%); }
  .confetti { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,211,110,.75) 0 3px, transparent 4px), radial-gradient(circle, rgba(255,140,160,.6) 0 3px, transparent 4px), radial-gradient(circle, rgba(140,200,255,.55) 0 2px, transparent 3px);
    background-size: 97px 83px, 71px 101px, 53px 61px; background-position: 10px 20px, 40px 5px, 25px 33px; opacity: .55; }
  .art { position: absolute; left: 118px; top: 30px; width: 400px; height: 566px; transform: rotate(-4deg);
    background: #fffaf0; border-radius: 6px;
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.85), inset 0 0 0 12px #b8892b, inset 0 0 0 20px #fffaf0, inset 0 0 0 23px #e2c06a;
    display: flex; flex-direction: column; align-items: center; text-align: center; padding: 64px 40px 40px; color: #2b2116; }
  .art .hd { font-family: ${serif}; font-weight: 900; font-size: 46px; line-height: 1.15; letter-spacing: 2px; }
  .art .dv { width: 220px; height: 3px; background: #b8892b; margin: 22px 0 20px; position: relative; }
  .art .dv::after { content: '✦'; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -54%); color: #b8892b; background: #fffaf0; padding: 0 8px; font-size: 22px; }
  .art .ti { font-family: ${serif}; font-weight: ${sw}; font-size: 36px; line-height: 1.25; color: #8a5a12; overflow-wrap: anywhere; }
  .art .nm { width: 240px; height: 3px; background: #e2c06a; margin: 70px 0 26px; }
  .art .ln { width: 280px; height: 10px; border-radius: 5px; background: rgba(107,90,67,.22); margin: 8px 0; }
  .art .ln.s { width: 200px; }
  .seal { position: absolute; right: 54px; bottom: 54px; width: 104px; height: 104px; border-radius: 50%; border: 8px solid #d22f27; color: #d22f27;
    display: flex; align-items: center; justify-content: center; font-family: ${serif}; font-weight: 900; font-size: 50px; transform: rotate(-10deg); opacity: .9;
    box-shadow: inset 0 0 0 6px #fffaf0, inset 0 0 0 8px #d22f27; }
  .deco { position: absolute; font-size: 64px; line-height: 1; }
  .text { position: absolute; left: 590px; top: 90px; width: 560px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #ffd36e; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 74px; line-height: 1.12; color: #f7f3ea;
    text-shadow: 0 0 30px rgba(255,211,110,.35), 0 5px 0 rgba(12,18,38,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #ffe2b8; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(12,18,38,.82); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #ffd36e; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(247,243,234,.7); }
</style>
</head>
<body>
  <div class="spot"></div>
  <div class="confetti"></div>
  <div class="deco" style="left:40px; top:44px; transform:rotate(-14deg)">🏆</div>
  <div class="deco" style="left:500px; top:30px; transform:rotate(12deg)">🎉</div>
  <div class="deco" style="left:510px; top:470px; transform:rotate(10deg)">🏅</div>
  <div class="art"><div class="hd">${esc(T.card.heading)}</div><div class="dv"></div><div class="ti">${esc(T.og.sampleTitle)}</div><div class="nm"></div><div class="ln"></div><div class="ln s"></div><div class="ln"></div><div class="seal">${esc(seal)}</div></div>
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
      var size = 74, lh = parseFloat(getComputedStyle(h).lineHeight) / 74;
      function over() { return h.scrollWidth > 560 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 402; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 30; while (box.scrollHeight > 402 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
      var hd = document.querySelector('.art .hd'), hs = 46; while (hd.scrollWidth > 320 && hs > 26) { hs -= 2; hd.style.fontSize = hs + 'px'; }
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
