#!/usr/bin/env node
/**
 * 마니또 뽑기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 겨울 밤 초록 바탕 + 금빛 눈송이, 왼쪽에 큰 빨간 선물 상자(금색 리본, 뚜껑이 살짝 들림)와 물음표 쪽지. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 이름·배정(누가 누구)은 넣지 않는다.
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
  body { position: relative; font-family: ${sans}; color: #fffaf0; background: #123b2c;
    background-image: radial-gradient(circle at 26% 50%, rgba(244,197,66,.30), transparent 42%), radial-gradient(ellipse at 85% 0%, rgba(200,32,47,.30), transparent 55%); }
  .snow { position: absolute; border-radius: 50%; background: #fff; opacity: .7; }
  .art { position: absolute; left: 40px; top: 30px; width: 560px; height: 500px; }
  .art svg { position: absolute; left: 70px; top: 40px; width: 420px; height: 420px; filter: drop-shadow(0 30px 30px rgba(0,0,0,.45)); }
  .note { position: absolute; left: 330px; top: 30px; width: 120px; height: 92px; border-radius: 12px; background: #fffaf0; transform: rotate(12deg);
    display: flex; align-items: center; justify-content: center; font: 800 64px/1 'Baloo 2', sans-serif; color: #c8202f; box-shadow: 0 10px 18px rgba(0,0,0,.35); }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #fff;
    background: #c8202f; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #8f1420; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fffaf0; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #f4c542; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0b2a1f; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fffaf0; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #f4c542; }
</style>
</head>
<body>
  ${[[60, 70, 7], [210, 520, 5], [520, 90, 6], [600, 470, 4], [1120, 120, 6], [980, 520, 5], [420, 560, 4], [30, 330, 5], [1150, 400, 4]].map(([x, y, r]) => `<span class="snow" style="left:${x}px; top:${y}px; width:${r * 2}px; height:${r * 2}px"></span>`).join('')}
  <div class="art" aria-hidden="true">
    <svg viewBox="0 0 200 200">
      <rect x="34" y="92" width="132" height="92" rx="10" fill="#c8202f"/>
      <rect x="34" y="92" width="132" height="16" fill="#9e1622" opacity=".55"/>
      <rect x="90" y="92" width="20" height="92" fill="#f4c542"/>
      <g transform="translate(0 -14) rotate(-8 100 82)">
        <rect x="24" y="66" width="152" height="32" rx="8" fill="#e0303f"/>
        <rect x="90" y="66" width="20" height="32" fill="#ffd866"/>
        <path d="M100 66 C78 34 50 40 56 58 C60 70 84 68 100 66 Z" fill="#f4c542"/>
        <path d="M100 66 C122 34 150 40 144 58 C140 70 116 68 100 66 Z" fill="#f4c542"/>
        <circle cx="100" cy="64" r="9" fill="#e0b02c"/>
      </g>
    </svg>
    <div class="note">?</div>
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
      var eb = box.querySelector('.eyebrow'), es = 24; while (eb.scrollWidth > 520 && es > 16) { es -= 2; eb.style.fontSize = es + 'px'; }
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
