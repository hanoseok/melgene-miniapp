#!/usr/bin/env node
/**
 * 장단점 저울 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림: 종이 크림색 위에 살짝 기운 놋쇠 저울(초록 접시 · 테라코타 접시, 글 없음) + 오른쪽 제목. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'proscons-core.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

function scale() {
  const a = -9; // 왼쪽(장점)이 무거워 내려간 모습
  const e = CORE.beamEnds(a, 160, 48, 120);
  const pan = (x, y, fill, stroke, dots) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <path d="M0 0 L-40 62 M0 0 L40 62" stroke="#9c7425" stroke-width="2.5" fill="none"/>
      <path d="M-48 62 Q0 96 48 62 Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      ${dots.map((d, i) => `<circle cx="${-24 + i * 24}" cy="${52 - (i === 1 ? 10 : 0)}" r="${d}" fill="#fffdf8" stroke="${stroke}" stroke-width="2"/>`).join('')}
    </g>`;
  return `<svg viewBox="-12 0 344 222" width="520" height="336">
    <path d="M110 212 Q160 196 210 212 Z" fill="#9c7425"/>
    <rect x="156" y="44" width="8" height="160" rx="4" fill="#c99a3b"/>
    <g transform="rotate(${a} 160 48)"><rect x="34" y="44" width="252" height="8" rx="4" fill="#1f2a44"/></g>
    <circle cx="160" cy="48" r="9" fill="#c99a3b" stroke="#1f2a44" stroke-width="3"/>
    ${pan(e.lx, e.ly, '#2f6b4f', '#24543e', [9, 10, 9])}
    ${pan(e.rx, e.ry, '#b84a3a', '#8f3a2d', [8])}
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
  body { position: relative; font-family: ${sans}; color: #1f2a44; background: radial-gradient(120% 90% at 20% 0%, #fbf8f1 0%, #f6f1e7 55%, #ece3d2 100%); }
  .art { position: absolute; left: 50px; top: 90px; }
  .text { position: absolute; left: 620px; top: 40px; width: 540px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${sans}; font-weight: 800; font-size: 22px; line-height: 1.45; color: #fff;
    background: #1f2a44; border-radius: 999px; padding: 6px 20px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.15; color: #1f2a44; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #b5532b; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #1f2a44; font-family: ${sans}; font-weight: 800; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-size: 22px; color: #e3c27a; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">${scale()}</div>
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
      function over() { return h.scrollWidth > 540 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 462; }
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
