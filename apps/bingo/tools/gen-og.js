#!/usr/bin/env node
/**
 * 새해 목표 빙고 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png · 그 밖: og/<언어 dir>/default.png
 * 그림은 빈 5×5 빙고판(칸 글 없음 — 예시 목표를 보여 주지 않는다) + 도장 몇 개 + 대각선 빙고 줄 + 기울어진 🎯 타일.
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
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
const STAMPED = [0, 6, 12, 18, 24, 3, 9, 20];

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const cells = Array.from({ length: 25 }, (_, i) => `<i class="${i === 12 ? 'free' : STAMPED.includes(i) ? 'on' : ''}${(Math.floor(i / 5) + i % 5) % 2 ? ' alt' : ''}">${i === 12 ? '★' : ''}</i>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #2a1d3a;
    background: radial-gradient(circle at 8% 0%, #ffd9c2 0, transparent 520px), radial-gradient(circle at 100% 40%, #ffe9a8 0, transparent 460px), #fff4e6; }
  .board { position: absolute; left: 80px; top: 70px; width: 430px; height: 430px; padding: 16px; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); gap: 8px;
    background: #fff; border: 5px solid #2a1d3a; border-radius: 28px; box-shadow: 0 10px 0 #2a1d3a; transform: rotate(-4deg); }
  .board i { position: relative; border-radius: 10px; background: #fff8ef; display: flex; align-items: center; justify-content: center; font-style: normal; color: #fff; font-size: 34px; }
  .board i.alt { background: #ffeede; }
  .board i.free { background: #ff6b3d; }
  .board i.on::after { content: ''; position: absolute; inset: 9px; border-radius: 50%; border: 6px solid #ff6b3d; background: rgba(255,107,61,.2); }
  .line { position: absolute; left: 50%; top: 50%; width: 470px; height: 14px; margin: -7px 0 0 -235px; border-radius: 7px; background: rgba(255,107,61,.6); transform: rotate(45deg); }
  .tile { position: absolute; left: 420px; top: 380px; width: 140px; height: 140px; border-radius: 28px; border: 5px solid #2a1d3a; box-shadow: 0 8px 0 #2a1d3a;
    background: #ffe9a8; transform: rotate(8deg); display: flex; align-items: center; justify-content: center; font-size: 76px; line-height: 1; }
  .text { position: absolute; left: 600px; top: 60px; width: 550px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 25px; line-height: 1.35; background: #fff;
    border: 3px solid #2a1d3a; border-radius: 999px; padding: 5px 20px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.14; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-weight: 700; font-size: 28px; line-height: 1.4; color: #d9481d; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #2a1d3a; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffd9c2; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">${cells}<span class="line"></span></div>
  <div class="tile">🎯</div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(T.og.kicker)}</div>
    <h1 id="t">${esc(T.og.title)}</h1>
    <p class="desc" id="d">${esc(T.og.desc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 64, lh = parseFloat(getComputedStyle(h).lineHeight) / 64;
      function over() { return h.scrollWidth > 550 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
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
