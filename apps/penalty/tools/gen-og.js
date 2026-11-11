#!/usr/bin/env node
/**
 * 벌칙 카드 뒤집기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림: 밤 펠트 바탕 위에 금색 뒷면 카드 여러 장 + 뒤집힌 벌칙 카드 한 장(주황빨강, 언어별 예시 문구). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  const backs = [
    [56, 70, -8], [190, 40, 4], [330, 74, -4], [44, 300, 5], [186, 292, -6],
  ].map(([x, y, r]) => `<div class="back" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"><span>?</span></div>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #f7f1e1; background: radial-gradient(120% 80% at 30% 0%, #1f4a40 0%, #0f2a25 75%); }
  .pile { position: absolute; left: 0; top: 0; width: 640px; height: 630px; }
  .back { position: absolute; width: 150px; height: 210px; border-radius: 14px; border: 4px solid #e7b75b;
    background: repeating-linear-gradient(45deg, rgba(231,183,91,.16) 0 8px, transparent 8px 16px), radial-gradient(circle at 50% 42%, #2c5c51 0%, #1b433c 70%);
    box-shadow: 0 10px 22px -10px rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; }
  .back span { font-family: ${display}; font-weight: ${w}; font-size: 56px; color: #e7b75b; }
  .open { position: absolute; left: 236px; top: 170px; width: 230px; height: 290px; border-radius: 16px; transform: rotate(-5deg);
    background: linear-gradient(160deg, #e0492f, #b93621); border: 4px solid #ffd9a8; box-shadow: 0 0 0 6px #163a33, 0 26px 36px -14px rgba(0,0,0,.7);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 18px; text-align: center; }
  .open small { font-family: ${sans}; font-weight: 800; font-size: 22px; color: #fff; opacity: .92; }
  .open b { font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.2; color: #fff; word-break: keep-all; }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 22px; line-height: 1.45; color: #1d2a1f;
    background: #e7b75b; border-radius: 999px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-2deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 60px; line-height: 1.18; color: #f7f1e1; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #e7b75b; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0a1f1b; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #e7b75b; }
</style>
</head>
<body>
  <div class="pile" aria-hidden="true">${backs}
    <div class="open"><small>${esc(T.draw.penaltyTag)}</small><b>${esc(T.og.sample)}</b></div>
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
      var size = 60, lh = parseFloat(getComputedStyle(h).lineHeight) / 60;
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
