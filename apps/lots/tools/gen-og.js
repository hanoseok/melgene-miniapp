#!/usr/bin/env node
/**
 * 제비뽑기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 크래프트지 위에 접힌 종이 쪽지 여러 장(빨간 번호) + 펼친 쪽지 한 장(언어별 "당첨" 글자). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const MONO = 'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@700&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const slips = [
    [70, 70, -7, '04'], [250, 52, 5, '11'], [430, 84, -3, '07'],
    [62, 270, 4, '15'], [432, 282, 8, '02'],
  ].map(([x, y, r, n]) => `<div class="slip" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"><span>No.${n}</span></div>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<link rel="stylesheet" href="${MONO}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #2b2118; background: #e6d3ad;
    background-image: repeating-linear-gradient(17deg, rgba(120,84,34,.08) 0 1px, transparent 1px 9px), repeating-linear-gradient(-71deg, rgba(255,255,255,.14) 0 1px, transparent 1px 13px); }
  .pile { position: absolute; left: 0; top: 0; width: 620px; height: 560px; }
  .slip { position: absolute; width: 150px; height: 124px; border-radius: 4px; overflow: hidden;
    background: linear-gradient(160deg, #fffaf0 0 48%, #efe4cc 49% 51%, #fffaf0 52% 100%);
    box-shadow: 0 4px 0 rgba(74,46,12,.25), 0 14px 22px -10px rgba(74,46,12,.6); display: flex; align-items: center; justify-content: center; }
  .slip::before { content: ''; position: absolute; top: 0; right: 0; width: 40px; height: 38px; background: linear-gradient(225deg, #d9c194 0 50%, #e9dcbf 50% 100%); }
  .slip span { font-family: 'Courier Prime', monospace; font-weight: 700; font-size: 28px; color: #d63a25; }
  .open { position: absolute; left: 200px; top: 220px; width: 250px; height: 200px; border-radius: 4px; transform: rotate(-4deg);
    background: #fff8e3; box-shadow: 0 0 0 6px #f2b632, 0 24px 34px -12px rgba(0,0,0,.55);
    background-image: linear-gradient(transparent 49.4%, rgba(43,33,24,.1) 49.5% 50.5%, transparent 50.6%);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 14px; text-align: center; }
  .open small { font-family: 'Courier Prime', monospace; font-weight: 700; font-size: 22px; color: #d63a25; }
  .open b { font-family: ${display}; font-weight: ${w}; font-size: 46px; line-height: 1.15; color: #b02c1a; }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.45; color: #fff;
    background: #d63a25; border-radius: 6px; padding: 6px 20px; margin-bottom: 22px; box-shadow: 3px 3px 0 #2b2118; transform: rotate(-2deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #2b2118; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #1f7a6d; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #2b2118; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #f2b632; }
</style>
</head>
<body>
  <div class="pile" aria-hidden="true">${slips}
    <div class="open"><small>No.09</small><b>🎉 ${esc(T.ui.winLabel)}</b></div>
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
      var size = 64, lh = parseFloat(getComputedStyle(h).lineHeight) / 64;
      function over() { return h.scrollWidth > 520 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 462; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 462 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
