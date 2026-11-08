#!/usr/bin/env node
/**
 * 눈사람 만들기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 CSS 도형으로 그린 예시 눈사람(모자·목도리·당근 코, 이름 없음) + 내리는 눈. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
    position: relative; font-family: ${sans}; color: #f4fbf7;
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #1d3a72, #0e1f44 55%, #070f26);
  }
  .snow { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 3px, transparent 4px), radial-gradient(circle, rgba(255,255,255,.45) 0 2px, transparent 3px);
    background-size: 90px 90px, 57px 57px; background-position: 10px 20px, 33px 5px; opacity: .55; }
  .glow { position: absolute; left: 20px; top: 40px; width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(159,208,255,.4) 0%, transparent 66%); }
  .art { position: absolute; left: 70px; top: 110px; width: 440px; height: 460px; }
  .ground { position: absolute; left: -80px; top: 480px; width: 760px; height: 260px; border-radius: 50% 50% 0 0 / 30% 30% 0 0; background: linear-gradient(#f4f8ff, #c9d9f0); }
  .ball { position: absolute; left: 50%; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff, #eef3fa 60%, #c3d1e8); box-shadow: 0 6px 0 rgba(7,15,38,.25); }
  .b1 { width: 250px; height: 250px; margin-left: -125px; top: 270px; }
  .b2 { width: 200px; height: 200px; margin-left: -100px; top: 110px; }
  .b3 { width: 160px; height: 160px; margin-left: -80px; top: -20px; }
  .hat { position: absolute; left: 50%; top: -100px; width: 100px; height: 96px; margin-left: -50px; background: #1e1e26; border-radius: 6px; }
  .hat::after { content: ''; position: absolute; left: -36px; bottom: -8px; width: 172px; height: 20px; border-radius: 50%; background: #1e1e26; }
  .band { position: absolute; left: 50%; top: -30px; width: 100px; height: 18px; margin-left: -50px; background: #e23d4f; }
  .eye { position: absolute; top: 30px; width: 18px; height: 18px; border-radius: 50%; background: #1d1d24; }
  .nose { position: absolute; left: 220px; top: 58px; width: 0; height: 0; border-style: solid; border-width: 10px 0 10px 70px; border-color: transparent transparent transparent #f08a24; }
  .smile { position: absolute; left: 190px; top: 70px; width: 60px; height: 34px; border-bottom: 6px solid #3a2a2a; border-radius: 0 0 40px 40px; }
  .scarf { position: absolute; left: 50%; top: 118px; width: 190px; height: 38px; margin-left: -95px; border-radius: 20px; background: repeating-linear-gradient(90deg, #e23d4f 0 22px, #fff 22px 32px); }
  .tail { position: absolute; left: 245px; top: 130px; width: 34px; height: 120px; border-radius: 6px; background: repeating-linear-gradient(180deg, #e23d4f 0 22px, #fff 22px 32px); transform: rotate(-6deg); }
  .btn { position: absolute; left: 50%; width: 18px; height: 18px; margin-left: -9px; border-radius: 50%; background: #1d1d24; }
  .arm { position: absolute; top: 200px; width: 150px; height: 10px; background: #6b4423; border-radius: 5px; }
  .deco { position: absolute; font-size: 54px; line-height: 1; color: #fff; text-shadow: 0 0 18px rgba(159,208,255,.9); }
  .text { position: absolute; left: 560px; top: 90px; width: 580px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #9fd0ff; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 78px; line-height: 1.12; color: #f4fbf7;
    text-shadow: 0 0 30px rgba(159,208,255,.4), 0 5px 0 rgba(7,15,38,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #dcefff; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(7,15,38,.8); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #9fd0ff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(244,251,247,.7); }
</style>
</head>
<body>
  <div class="snow"></div>
  <div class="glow"></div>
  <div class="ground"></div>
  <div class="deco" style="left:40px; top:60px">❄</div>
  <div class="deco" style="left:470px; top:110px; font-size:40px">❄</div>
  <div class="deco" style="left:90px; top:330px; font-size:34px">❄</div>
  <div class="art">
    <div class="arm" style="left:-10px; transform:rotate(-22deg)"></div><div class="arm" style="left:300px; transform:rotate(22deg)"></div>
    <div class="ball b1"></div><div class="ball b2"></div><div class="ball b3"></div>
    <div class="btn" style="top:178px"></div><div class="btn" style="top:218px"></div><div class="btn" style="top:258px"></div><div class="btn" style="top:330px"></div>
    <div class="eye" style="left:190px"></div><div class="eye" style="left:232px"></div>
    <div class="smile"></div><div class="nose"></div>
    <div class="scarf"></div><div class="tail"></div>
    <div class="hat"></div><div class="band"></div>
  </div>
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
      var size = 78, lh = parseFloat(getComputedStyle(h).lineHeight) / 78;
      function over() { return h.scrollWidth > 580 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 402; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 30; while (box.scrollHeight > 402 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
