#!/usr/bin/env node
/**
 * baseball(숫자 야구) OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 물음표 칸 + 추리 기록 줄 두 개(장식 — 실제 정답과 무관). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  const P = T.play;
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
      radial-gradient(circle at 93% 12%, rgba(255,246,232,.95) 0 46px, rgba(255,246,232,.15) 47px 100px, transparent 101px),
      radial-gradient(circle at 12% 20%, rgba(111,220,140,.22) 0 200px, transparent 201px),
      linear-gradient(180deg, #0a1f15, #17402c);
  }
  .panel { position: absolute; left: 64px; top: 60px; width: 470px; height: 440px; padding: 26px 24px; border-radius: 28px;
    background: rgba(0,0,0,.25); border: 3px solid rgba(255,246,232,.25); transform: rotate(-3deg); }
  .slots { display: flex; gap: 14px; justify-content: center; }
  .slot { width: 96px; height: 118px; border-radius: 18px; display: flex; align-items: center; justify-content: center;
    background: #143826; border: 4px solid rgba(255,246,232,.5); font-family: 'Fredoka', ${sans}; font-weight: 700; font-size: 70px; color: #ffd23f; }
  .slot.ball { background: #fff6e8; border-color: #e8433f; font-size: 64px; }
  .row { display: flex; align-items: center; gap: 14px; margin-top: 22px; padding: 12px 16px; border-radius: 16px; background: rgba(255,255,255,.09); border: 2px solid rgba(255,246,232,.22); }
  .row b { font-family: 'Fredoka', ${sans}; font-weight: 700; font-size: 40px; letter-spacing: .12em; color: #fff6e8; }
  .chip { margin-left: auto; display: flex; gap: 8px; }
  .chip i { font-style: normal; font-family: ${display}; font-weight: ${w}; font-size: 22px; line-height: 1.35; padding: 3px 14px; border-radius: 999px; }
  .s { background: #ffd23f; color: #3a2c00; } .b { background: #6fdc8c; color: #0b3319; } .o { background: #e8433f; color: #fff; }
  .text { position: absolute; left: 600px; top: 50px; width: 550px; height: 450px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #fff;
    background: #e8433f; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.14; color: #fff6e8; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffd23f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #e8433f; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff; opacity: .92; }
</style>
</head>
<body>
  <div class="panel" aria-hidden="true">
    <div class="slots"><div class="slot">?</div><div class="slot ball">⚾</div><div class="slot">?</div></div>
    <div class="row"><b>1 4 7</b><span class="chip"><i class="b">${esc(P.ball)} 1</i></span></div>
    <div class="row"><b>2 0 5</b><span class="chip"><i class="s">${esc(P.strike)} 1</i><i class="b">${esc(P.ball)} 1</i></span></div>
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
