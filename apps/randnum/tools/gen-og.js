#!/usr/bin/env node
/**
 * 랜덤 숫자 뽑기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 연보라 모눈 위 진남보라 플립 보드(라임 숫자 타일 3개 + 범위 칩). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const MONO = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const tile = (d, cls) => `<div class="tile ${cls || ''}"><span>${d}</span></div>`;
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
  body { position: relative; font-family: ${sans}; color: #14112b; background: #f3f1ff;
    background-image: linear-gradient(rgba(76,58,200,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(76,58,200,.08) 1px, transparent 1px); background-size: 36px 36px; }
  .board { position: absolute; left: 56px; top: 70px; width: 500px; height: 400px; border-radius: 36px; background: #17132f;
    box-shadow: 0 30px 60px -20px rgba(76,58,200,.55); padding: 34px 30px; }
  .chips { display: flex; gap: 10px; }
  .chip { padding: 6px 16px; border-radius: 12px; background: #241e4a; color: rgba(255,255,255,.85); font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 24px; }
  .row { display: flex; gap: 16px; margin-top: 34px; }
  .tile { position: relative; flex: 1; height: 190px; border-radius: 24px; display: flex; align-items: center; justify-content: center; overflow: hidden;
    background: linear-gradient(180deg, #2c2559 0 49.5%, #221c48 50.5% 100%); box-shadow: inset 0 0 0 2px rgba(255,255,255,.06), 0 8px 0 rgba(0,0,0,.45); }
  .tile::after { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 3px; background: rgba(0,0,0,.6); }
  .tile span { position: relative; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 104px; color: #c6ff3d; letter-spacing: -4px; }
  .tile.v span { color: #fff; }
  .tile.v { background: linear-gradient(180deg, #7c5cff 0 49.5%, #6a48f5 50.5% 100%); }
  .btn { margin-top: 30px; height: 60px; border-radius: 18px; background: linear-gradient(135deg, #6a48f5, #4b2fd1); box-shadow: 0 6px 0 #000;
    display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 28px; color: #fff; letter-spacing: 6px; }
  .text { position: absolute; left: 610px; top: 50px; width: 550px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.4; color: #c6ff3d;
    background: #14112b; border-radius: 999px; padding: 6px 22px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #14112b; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #4b2fd1; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #14112b; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #c6ff3d; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">
    <div class="chips"><span class="chip">1–100</span><span class="chip">×3</span></div>
    <div class="row">${tile('07')}${tile('42', 'v')}${tile('19')}</div>
    <div class="btn">? ? ?</div>
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
      function over() { return h.scrollWidth > 550 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
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
