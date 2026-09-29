#!/usr/bin/env node
/**
 * 할로윈 사탕 받기 게임 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 밤하늘 + 떨어지는 사탕 + 호박 바구니. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const EMOJI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const drops = [
    ['🍬', 60, 40, -14, 64], ['🍭', 250, 10, 12, 70], ['🍫', 380, 120, -8, 58], ['🍬', 170, 170, 20, 52],
    ['⭐', 330, 250, 0, 46], ['🍭', 70, 250, -20, 50], ['🕷️', 440, 20, 0, 50],
  ].map(([e, x, y, r, s]) => `<span class="drop" style="left:${x}px;top:${y}px;font-size:${s}px;transform:rotate(${r}deg)">${e}</span>`).join('\n    ');
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
    position: relative; font-family: ${sans}; color: #fff6ea;
    background:
      radial-gradient(circle at 1120px 70px, rgba(255,244,199,.95) 0 34px, rgba(255,244,199,.14) 42px, transparent 96px),
      radial-gradient(2px 2px at 140px 70px, #fff 50%, transparent 51%), radial-gradient(2px 2px at 520px 40px, #fff 50%, transparent 51%),
      radial-gradient(2px 2px at 760px 110px, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 980px 260px, #fff 50%, transparent 51%),
      radial-gradient(1.5px 1.5px at 620px 300px, #fff 50%, transparent 51%), radial-gradient(2px 2px at 330px 360px, #fff 50%, transparent 51%),
      linear-gradient(180deg, #25306e 0%, #131a45 55%, #0a0d24 100%);
  }
  .art { position: absolute; left: 40px; top: 40px; width: 520px; height: 490px; }
  .drop { position: absolute; line-height: 1; font-family: ${EMOJI}; filter: drop-shadow(0 6px 10px rgba(0,0,0,.35)); }
  .bucket { position: absolute; left: 150px; top: 282px; width: 240px; filter: drop-shadow(0 10px 30px rgba(255,138,31,.45)); }
  .text { position: absolute; left: 580px; top: 60px; width: 570px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #1b1026;
    background: #ff8a1f; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #fff6ea; text-shadow: 0 5px 0 rgba(0,0,0,.35); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #b8ff5c; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #b8ff5c; border-top: 5px solid #1b1026; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #1b1026; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #25306e; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    ${drops}
    <svg class="bucket" viewBox="0 0 120 100">
      <path d="M22 30 C22 6 98 6 98 30" fill="none" stroke="#1b1026" stroke-width="6" stroke-linecap="round"/>
      <path d="M14 34 H106 L96 88 C95 94 90 97 84 97 H36 C30 97 25 94 24 88 Z" fill="#ff8a1f" stroke="#1b1026" stroke-width="5" stroke-linejoin="round"/>
      <path d="M36 50 L46 62 H26 Z M84 50 L94 62 H74 Z" fill="#1b1026"/>
      <path d="M34 72 Q60 92 86 72 L80 70 L74 78 L67 71 L60 79 L53 71 L46 78 L40 70 Z" fill="#1b1026"/>
    </svg>
  </div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(T.og.defaultKicker)}</div>
    <h1 id="t">${esc(T.og.defaultTitle)}</h1>
    <p class="desc" id="d">${esc(T.og.defaultDesc).replace(/(\d+) (?=\S)/g, "$1\u00a0")}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자 안에 들어갈 때까지 글자를 줄인다 (제목 3줄까지)
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 72, lh = parseFloat(getComputedStyle(h).lineHeight) / 72;
      function over() { return h.scrollWidth > 570 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 432; }
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
