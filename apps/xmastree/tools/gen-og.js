#!/usr/bin/env node
/**
 * 크리스마스 트리 꾸미기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 CSS·이모지로 그린 예시 트리(장식·전구·별, 이름·메시지 없음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #12483a, #0b2a22 55%, #04140f);
  }
  .snow { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 3px, transparent 4px), radial-gradient(circle, rgba(255,255,255,.45) 0 2px, transparent 3px);
    background-size: 90px 90px, 57px 57px; background-position: 10px 20px, 33px 5px; opacity: .55; }
  .glow { position: absolute; left: 20px; top: 40px; width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,211,110,.35) 0%, transparent 66%); }
  .art { position: absolute; left: 70px; top: 30px; width: 440px; height: 560px; }
  .tier { position: absolute; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-style: solid; border-color: transparent transparent #1f8a4c transparent; filter: drop-shadow(0 8px 0 rgba(4,20,15,.35)); }
  .t1 { top: 70px; border-width: 0 95px 130px 95px; }
  .t2 { top: 150px; border-width: 0 150px 160px 150px; border-bottom-color: #1a7a42; }
  .t3 { top: 250px; border-width: 0 200px 190px 200px; border-bottom-color: #146b39; }
  .trunk { position: absolute; left: 50%; top: 432px; width: 64px; height: 70px; margin-left: -32px; background: #7a4a24; border-radius: 6px; }
  .o { position: absolute; font-size: 40px; line-height: 1; }
  .b { position: absolute; width: 36px; height: 36px; border-radius: 50%; box-shadow: inset -6px -6px 0 rgba(0,0,0,.18), 0 0 0 2px rgba(255,255,255,.25); }
  .l { position: absolute; width: 14px; height: 18px; border-radius: 50%; background: currentColor; box-shadow: 0 0 16px 4px currentColor; }
  .top { position: absolute; left: 50%; top: 4px; margin-left: -50px; font-size: 100px; line-height: 1; filter: drop-shadow(0 0 26px rgba(255,215,106,.85)); }
  .deco { position: absolute; font-size: 64px; line-height: 1; }
  .text { position: absolute; left: 560px; top: 90px; width: 580px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #ffd36e; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 78px; line-height: 1.12; color: #f4fbf7;
    text-shadow: 0 0 30px rgba(255,211,110,.35), 0 5px 0 rgba(4,20,15,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #cfe9dc; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(4,20,15,.78); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #ffd36e; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(244,251,247,.7); }
</style>
</head>
<body>
  <div class="snow"></div>
  <div class="glow"></div>
  <div class="deco" style="left:30px; top:60px; transform:rotate(-14deg)">❄️</div>
  <div class="deco" style="left:490px; top:60px; transform:rotate(12deg)">✨</div>
  <div class="art">
    <div class="tier t3"></div><div class="tier t2"></div><div class="tier t1"></div><div class="trunk"></div>
    <i class="l" style="left:180px; top:175px; color:#ffd25a"></i><i class="l" style="left:250px; top:182px; color:#ff4d5e"></i>
    <i class="l" style="left:140px; top:285px; color:#5ab4ff"></i><i class="l" style="left:215px; top:298px; color:#ffd25a"></i><i class="l" style="left:290px; top:288px; color:#ff8ad8"></i>
    <i class="l" style="left:90px; top:400px; color:#4dd18a"></i><i class="l" style="left:170px; top:415px; color:#ff4d5e"></i><i class="l" style="left:255px; top:418px; color:#5ab4ff"></i><i class="l" style="left:335px; top:402px; color:#ffd25a"></i>
    <i class="b" style="left:200px; top:120px; background:#e23d4f"></i><i class="b" style="left:150px; top:225px; background:#f3c14b"></i><i class="b" style="left:265px; top:240px; background:#3d8bff"></i>
    <i class="b" style="left:110px; top:340px; background:#9a5cf0"></i><i class="b" style="left:300px; top:350px; background:#e23d4f"></i><i class="b" style="left:205px; top:360px; background:#d6e0ea"></i>
    <span class="o" style="left:238px; top:190px">🔔</span><span class="o" style="left:150px; top:375px">🎀</span><span class="o" style="left:250px; top:300px">⭐</span>
    <span class="o" style="left:60px; top:470px; font-size:64px">🎁</span><span class="o" style="left:320px; top:478px; font-size:56px">🎁</span>
    <div class="top">⭐</div>
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
