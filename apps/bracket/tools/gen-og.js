#!/usr/bin/env node
/**
 * 토너먼트 대진표 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 남색 바탕 + 금빛 반짝임, 왼쪽에 대진표 선(8강→결승)과 금색 트로피. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 항목 이름은 넣지 않는다(빈 칸 막대만).
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
  body { position: relative; font-family: ${sans}; color: #fffaf0; background: #14213d;
    background-image: radial-gradient(circle at 26% 50%, rgba(252,191,73,.28), transparent 42%), radial-gradient(ellipse at 85% 0%, rgba(42,157,143,.30), transparent 55%); }
  .snow { position: absolute; border-radius: 50%; background: #fcbf49; opacity: .6; }
  .art { position: absolute; left: 40px; top: 30px; width: 560px; height: 500px; }
  .art svg { position: absolute; left: 0; top: 10px; width: 560px; height: 480px; }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5;
    background: #fcbf49; color: #14213d; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #f7a823; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fff8e7; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #fcbf49; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0d1730; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff8e7; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fcbf49; }
</style>
</head>
<body>
  ${[[60, 70, 7], [210, 520, 5], [520, 90, 6], [600, 470, 4], [1120, 120, 6], [980, 520, 5], [420, 560, 4], [30, 330, 5], [1150, 400, 4]].map(([x, y, r]) => `<span class="snow" style="left:${x}px; top:${y}px; width:${r * 2}px; height:${r * 2}px"></span>`).join('')}
  <div class="art" aria-hidden="true">
    <svg viewBox="0 0 560 480"><path d="M170 57H195V109H170M195 83.0H220" fill="none" stroke="#fff8e7" stroke-opacity=".5" stroke-width="4"/><path d="M170 161H195V213H170M195 187.0H220" fill="none" stroke="#fff8e7" stroke-opacity=".5" stroke-width="4"/><path d="M170 265H195V317H170M195 291.0H220" fill="none" stroke="#fff8e7" stroke-opacity=".5" stroke-width="4"/><path d="M170 369H195V421H170M195 395.0H220" fill="none" stroke="#fff8e7" stroke-opacity=".5" stroke-width="4"/><path d="M350 83H372V187H350M372 135.0H390" fill="none" stroke="#fff8e7" stroke-opacity=".5" stroke-width="4"/><path d="M350 291H372V395H350M372 343.0H390" fill="none" stroke="#fff8e7" stroke-opacity=".5" stroke-width="4"/><rect x="20" y="40" width="150" height="34" rx="8" fill="#2a9d8f"/><rect x="20" y="92" width="150" height="34" rx="8" fill="#e76f51"/><rect x="20" y="144" width="150" height="34" rx="8" fill="#2a9d8f"/><rect x="20" y="196" width="150" height="34" rx="8" fill="#e76f51"/><rect x="20" y="248" width="150" height="34" rx="8" fill="#2a9d8f"/><rect x="20" y="300" width="150" height="34" rx="8" fill="#e76f51"/><rect x="20" y="352" width="150" height="34" rx="8" fill="#2a9d8f"/><rect x="20" y="404" width="150" height="34" rx="8" fill="#e76f51"/><rect x="220" y="66" width="130" height="34" rx="8" fill="#fff8e7" opacity=".9"/><rect x="220" y="170" width="130" height="34" rx="8" fill="#fff8e7" opacity=".9"/><rect x="220" y="274" width="130" height="34" rx="8" fill="#fff8e7" opacity=".9"/><rect x="220" y="378" width="130" height="34" rx="8" fill="#fff8e7" opacity=".9"/><g transform="translate(380 140) scale(1.7)"><path d="M30 18h40v20c0 13-9 22-20 22s-20-9-20-22z" fill="#fcbf49"/><path d="M30 25H17c0 12 6 19 15 20M70 25h13c0 12-6 19-15 20" fill="none" stroke="#fcbf49" stroke-width="6" stroke-linecap="round"/><rect x="45" y="58" width="10" height="14" fill="#f7a823"/><rect x="31" y="72" width="38" height="11" rx="3" fill="#fcbf49"/></g></svg>
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
