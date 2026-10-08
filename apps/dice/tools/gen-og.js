#!/usr/bin/env node
/**
 * 주사위 굴리기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 펠트 위 흰 6면 주사위 두 개 + d20 다각형(결과 없음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  const face = (on) => on.map((x) => `<i class="${x ? '' : 'o'}"></i>`).join('');
  const five = face([1, 0, 1, 0, 1, 0, 1, 0, 1]);
  const three = face([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #2a1f14; background: #fbf3e4;
    background-image: radial-gradient(rgba(42,31,20,.07) 2px, transparent 2px); background-size: 30px 30px; }
  .felt { position: absolute; left: 50px; top: 60px; width: 480px; height: 420px; border-radius: 40px; border: 7px solid #2a1f14;
    background: radial-gradient(ellipse at 50% 35%, #2a8a5c, #1d6a45 55%, #14532d); box-shadow: 12px 12px 0 #2a1f14, inset 0 0 40px rgba(0,0,0,.35); }
  .die { position: absolute; width: 150px; height: 150px; padding: 20px; display: grid; grid-template: repeat(3, 1fr) / repeat(3, 1fr);
    background: #fffdf7; border: 7px solid #2a1f14; border-radius: 30px; box-shadow: 8px 10px 0 rgba(0,0,0,.35); }
  .die i { width: 28px; height: 28px; margin: auto; border-radius: 50%; background: #2a1f14; }
  .die i.o { opacity: 0; }
  .d1 { left: 70px; top: 70px; transform: rotate(-12deg); }
  .d2 { left: 250px; top: 120px; transform: rotate(10deg); }
  .d20 { position: absolute; left: 120px; top: 225px; width: 170px; height: 170px; transform: rotate(-6deg); }
  .d20 text { font-family: ${display}; font-weight: 900; font-size: 40px; fill: #fff; }
  .text { position: absolute; left: 580px; top: 50px; width: 580px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #f2b632;
    background: #2a1f14; border-radius: 999px; padding: 6px 22px; margin-bottom: 20px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.16; color: #2a1f14; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #a52a1f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #c8372a; border-top: 5px solid #2a1f14; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff3e6; }
</style>
</head>
<body>
  <div class="felt" aria-hidden="true">
    <div class="die d1">${five}</div>
    <div class="die d2">${three}</div>
    <svg class="d20" viewBox="0 0 100 100"><polygon points="50,3 93,27 93,73 50,97 7,73 7,27" fill="#d63a6a" stroke="#2a1f14" stroke-width="4.5" stroke-linejoin="round"/><path d="M50,24 79,72 21,72 50,24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2"/><text x="50" y="60" text-anchor="middle" dominant-baseline="middle">20</text></svg>
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
      var size = 68, lh = parseFloat(getComputedStyle(h).lineHeight) / 68;
      function over() { return h.scrollWidth > 580 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
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
