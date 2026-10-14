#!/usr/bin/env node
/**
 * 예스 노 결정기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 첫 화면과 같은 검은 구슬(파란 창에 "?") — 답은 넣지 않는다. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  body { position: relative; font-family: ${sans}; color: #f4f0ff; background: #1a1238;
    background-image: radial-gradient(2px 2px at 40px 60px, rgba(255,255,255,.6), transparent 60%), radial-gradient(1.5px 1.5px at 140px 150px, rgba(255,255,255,.5), transparent 60%),
      radial-gradient(2px 2px at 220px 40px, rgba(255,255,255,.5), transparent 60%), radial-gradient(ellipse at 25% 40%, #3b2a86 0%, transparent 55%);
    background-size: 260px 260px, 260px 260px, 260px 260px, 100% 100%; }
  .orb { position: absolute; left: 90px; top: 95px; width: 400px; height: 400px; border-radius: 50%; display: grid; place-items: center;
    background: radial-gradient(circle at 33% 26%, #6b6b8c 0, #1b1828 34%, #050409 72%, #000 100%);
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.8), 0 0 0 6px rgba(255,207,90,.35), 0 0 120px -10px rgba(124,92,255,.7); }
  .orb::before { content: ''; position: absolute; left: 20%; top: 12%; width: 26%; height: 16%; border-radius: 50%; background: rgba(255,255,255,.28); filter: blur(6px); transform: rotate(-25deg); }
  .win { width: 200px; height: 200px; border-radius: 50%; display: grid; place-items: center; background: radial-gradient(circle at 50% 40%, #3a63ff, #2346d8 55%, #101c66 100%);
    box-shadow: inset 0 0 26px rgba(0,0,0,.7), 0 0 0 8px #0b0a12; font: 800 120px/1 'Fredoka', sans-serif; color: #fff; text-shadow: 0 0 20px rgba(160,200,255,.9); }
  .text { position: absolute; left: 580px; top: 60px; width: 580px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #1a1238;
    background: #ffcf5a; border-radius: 999px; padding: 6px 22px; margin-bottom: 20px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.16; color: #fff; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffcf5a; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #ffcf5a; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #1a1238; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #3b2a86; }
</style>
</head>
<body>
  <div class="orb" aria-hidden="true"><div class="win">?</div></div>
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
