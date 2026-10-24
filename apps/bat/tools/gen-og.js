#!/usr/bin/env node
/**
 * 할로윈 박쥐 날기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 달밤 보라 하늘 + 보름달 앞을 나는 박쥐 + 묘비·유령 나무. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 시작 화면 티저(tools/gen-i18n.js 의 heroSvg)와 같은 그림
function batPath(cx, cy, s) {
  // 날개를 펼친 박쥐 실루엣 (가운데 cx,cy, 크기 s)
  const k = (x, y) => `${(cx + x * s).toFixed(1)},${(cy + y * s).toFixed(1)}`;
  return `M${k(0, -6)} Q${k(-14, -18)} ${k(-34, -10)} Q${k(-30, -2)} ${k(-26, 4)} Q${k(-20, 0)} ${k(-16, 7)} Q${k(-10, 2)} ${k(-5, 7)} L${k(0, 10)} L${k(5, 7)} Q${k(10, 2)} ${k(16, 7)} Q${k(20, 0)} ${k(26, 4)} Q${k(30, -2)} ${k(34, -10)} Q${k(14, -18)} ${k(0, -6)} Z`;
}
function heroSvg(cls) {
  return `<svg class="${cls}" viewBox="0 0 220 180" aria-hidden="true" focusable="false">
<defs><radialGradient id="bm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff3c4"/><stop offset="1" stop-color="#ffd977"/></radialGradient></defs>
<circle cx="132" cy="70" r="52" fill="url(#bm)"/>
<circle cx="116" cy="56" r="9" fill="rgba(214,170,90,.35)"/><circle cx="150" cy="86" r="7" fill="rgba(214,170,90,.35)"/>
<rect x="18" y="0" width="34" height="62" rx="4" fill="#6b4c64"/><path d="M14 58 L22 70 L34 62 L46 70 L56 58 Z" fill="#6b4c64"/>
<rect x="18" y="122" width="34" height="58" fill="#6b4c64"/><path d="M14 126 L24 114 L35 122 L46 114 L56 126 Z" fill="#6b4c64"/>
<path d="M172 180 V128 a20 20 0 0 1 40 0 V180 Z" fill="#9b9bb8" stroke="#2c2448" stroke-width="2.5"/>
<rect x="189" y="122" width="6" height="26" fill="rgba(40,32,66,.55)"/><rect x="182" y="129" width="20" height="6" fill="rgba(40,32,66,.55)"/>
<path d="${batPath(96, 96, 1.55)}" fill="#3a1f52" stroke="#1a0b28" stroke-width="2"/>
<ellipse cx="96" cy="98" rx="13" ry="12" fill="#5b3380" stroke="#1a0b28" stroke-width="2"/>
<path d="M88 89 L90 78 L94 87 Z M104 89 L102 78 L98 87 Z" fill="#5b3380"/>
<circle cx="91" cy="96" r="3.6" fill="#fff8e8"/><circle cx="101" cy="96" r="3.6" fill="#fff8e8"/>
<circle cx="92" cy="96.6" r="1.6" fill="#1a0b28"/><circle cx="102" cy="96.6" r="1.6" fill="#1a0b28"/>
<path d="M93 103 l1.3 3.4 1.3-3.4 Z M98 103 l1.3 3.4 1.3-3.4 Z" fill="#fff8e8"/>
</svg>`;
}

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
    position: relative; font-family: ${sans}; color: #fff8f0;
    background:
      radial-gradient(circle at 1100px 90px, rgba(255,154,60,.14) 0 120px, transparent 260px),
      linear-gradient(180deg, #4a2a6e 0%, #24144d 58%, #120a2c 100%);
  }
  .art { position: absolute; left: 30px; top: 60px; width: 540px; height: 470px; }
  .art svg { position: absolute; left: 20px; top: 40px; width: 520px; height: 425px; filter: drop-shadow(0 12px 30px rgba(255,217,119,.3)); }
  .spark { position: absolute; left: 170px; top: 392px; font-size: 64px; line-height: 1; font-family: ${EMOJI}; }
  .text { position: absolute; left: 580px; top: 60px; width: 570px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #1a0b28;
    background: #ffe08a; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #fff8f0; text-shadow: 0 5px 0 rgba(0,0,0,.35); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffb066; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #ff9a3c; border-top: 5px solid #1a0b28; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #1a0b28; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #24144d; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    ${heroSvg('')}
    <span class="spark">🎃</span>
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
