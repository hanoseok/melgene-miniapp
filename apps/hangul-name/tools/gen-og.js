#!/usr/bin/env node
/**
 * 내 이름 한글로 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 자모 타일(ㅎ+ㅏ+ㄴ=한) + 붓글씨 카드. 글꼴은 언어 파일 fonts + 카드 글꼴(네트워크 필요).
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
const CORE = require(path.join(__dirname, '..', 'hangul-name-core.js'));
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
<link rel="stylesheet" href="${esc(CORE.CARD_FONTS_CSS)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #1d1a17; background: #f6efe0;
    background-image: linear-gradient(90deg, rgba(29,26,23,.05) 2px, transparent 2px), linear-gradient(rgba(29,26,23,.05) 2px, transparent 2px); background-size: 56px 56px; }
  .band { position: absolute; left: 0; right: 0; top: 0; height: 18px; display: flex; }
  .band i { flex: 1; } .band i:nth-child(1) { background: #c8102e; } .band i:nth-child(2) { background: #1f4e9c; } .band i:nth-child(3) { background: #1b8a5a; } .band i:nth-child(4) { background: #f2b705; }
  .art { position: absolute; left: 60px; top: 92px; width: 470px; height: 400px; }
  .tiles { display: flex; align-items: center; gap: 10px; }
  .tile { width: 92px; height: 92px; display: flex; align-items: center; justify-content: center; border: 6px solid #1d1a17; border-radius: 22px; box-shadow: 7px 7px 0 #1d1a17;
    font-family: 'Black Han Sans', sans-serif; font-size: 56px; line-height: 1; color: #1d1a17; }
  .t1 { background: #ffd9de; } .t2 { background: #d7e4fb; } .t3 { background: #d6f0e2; }
  .op { font-family: ${display}; font-weight: 900; font-size: 34px; color: rgba(29,26,23,.55); }
  .cardr { position: absolute; left: 40px; top: 150px; width: 390px; height: 240px; display: flex; align-items: center; justify-content: center; background: #fffaf0;
    border: 7px solid #1d1a17; border-radius: 30px; box-shadow: 12px 12px 0 #1d1a17; transform: rotate(-3deg);
    font-family: 'Nanum Brush Script', 'Black Han Sans', sans-serif; font-size: 190px; line-height: 1; color: #1d1a17; }
  .seal { position: absolute; right: 18px; top: 16px; width: 64px; height: 64px; border-radius: 10px; background: #c8102e; color: #fff6ea;
    font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 42px; display: flex; align-items: center; justify-content: center; transform: rotate(4deg); }
  .text { position: absolute; left: 580px; top: 60px; width: 580px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #f2b705;
    background: #1d1a17; border-radius: 999px; padding: 6px 22px; margin-bottom: 20px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.16; color: #1d1a17; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #c8102e; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #1f4e9c; border-top: 5px solid #1d1a17; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #f6efe0; }
</style>
</head>
<body>
  <div class="band"><i></i><i></i><i></i><i></i></div>
  <div class="art" aria-hidden="true">
    <div class="tiles"><span class="tile t1">ㅎ</span><span class="op">+</span><span class="tile t2">ㅏ</span><span class="op">+</span><span class="tile t3">ㄴ</span></div>
    <div class="cardr">한글<span class="seal">글</span></div>
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
      function over() { return h.scrollWidth > 580 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 432; }
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
