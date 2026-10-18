#!/usr/bin/env node
/**
 * 만 나이 계산기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 생일 케이크 + 결과 카드 모양(숫자는 예시가 아니라 "?" — 진짜 숫자만 보여 준다는 규칙) + 크림색 스프링클 바탕.
 * 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=swap';
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
<link rel="stylesheet" href="${NUM_FONT}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #3b2230; background: #fff4ec;
    background-image: radial-gradient(circle at 14px 16px, rgba(255,79,129,.28) 4px, transparent 5px), radial-gradient(circle at 48px 50px, rgba(47,191,155,.28) 4px, transparent 5px), radial-gradient(circle at 56px 12px, rgba(255,207,74,.45) 4px, transparent 5px);
    background-size: 68px 68px; }
  .art { position: absolute; left: 70px; top: 60px; width: 430px; height: 440px; }
  .card { position: absolute; left: 0; top: 0; width: 420px; height: 300px; border-radius: 40px; border: 5px solid #3b2230; box-shadow: 10px 10px 0 #3b2230;
    background: linear-gradient(160deg, #ffd6e2 0%, #fff1c9 55%, #d4f6ea 100%); transform: rotate(-4deg); text-align: center; padding-top: 34px; }
  .pill { display: inline-block; padding: 4px 18px; border-radius: 999px; background: #3b2230; color: #fff; font: 700 22px/1.4 ${sans}; }
  .big { margin-top: 6px; font: 800 150px/1 'Baloo 2', sans-serif; color: #e0386b; }
  .cake { position: absolute; left: 230px; top: 250px; width: 200px; height: 190px; transform: rotate(5deg); }
  .flame { position: absolute; left: 88px; top: 0; width: 24px; height: 38px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: #ffcf4a; border: 4px solid #3b2230; }
  .candle { position: absolute; left: 92px; top: 36px; width: 16px; height: 46px; background: #ff4f81; border: 4px solid #3b2230; border-radius: 4px; }
  .base { position: absolute; left: 0; right: 0; bottom: 0; height: 110px; border-radius: 26px 26px 20px 20px; border: 5px solid #3b2230; box-shadow: 8px 8px 0 #3b2230;
    background: linear-gradient(#fffdfb 0 36px, #ff4f81 36px 50px, #ffe8d9 50px); }
  .text { position: absolute; left: 560px; top: 60px; width: 590px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 25px; line-height: 1.35; color: #3b2230; background: #fff;
    border: 3px solid #3b2230; border-radius: 999px; padding: 5px 20px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 66px; line-height: 1.14; color: #3b2230; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #e0386b; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #3b2230; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffcf4a; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <div class="card"><span class="pill">${esc(T.result.ageLabel)}</span><div class="big">?</div></div>
    <div class="cake"><span class="flame"></span><span class="candle"></span><span class="base"></span></div>
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
      var size = 66, lh = parseFloat(getComputedStyle(h).lineHeight) / 66;
      function over() { return h.scrollWidth > 590 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
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
