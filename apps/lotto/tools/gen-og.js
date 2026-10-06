#!/usr/bin/env node
/**
 * 로또 번호 생성기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 색색의 공. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  body { position: relative; font-family: ${sans}; color: #1b2a49; background: #fff6e3;
    background-image: repeating-linear-gradient(90deg, rgba(27,42,73,.06) 0 2px, transparent 2px 96px); }
  .art { position: absolute; left: 50px; top: 90px; width: 480px; height: 380px; }
  .ball { position: absolute; width: 130px; height: 130px; border-radius: 50%; display: grid; place-items: center; border: 7px solid #1b2a49; box-shadow: 9px 9px 0 #1b2a49; font-size: 54px; font-weight: 900; line-height: 1; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,.4);
    background: radial-gradient(circle at 34% 28%, rgba(255,255,255,.85) 0 9%, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 55%, var(--c), color-mix(in srgb, var(--c) 72%, #000)); }
  .text { position: absolute; left: 580px; top: 60px; width: 580px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #f5b82e;
    background: #1b2a49; border-radius: 999px; padding: 6px 22px; margin-bottom: 20px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.16; color: #1b2a49; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #c2281f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #e8453c; border-top: 5px solid #1b2a49; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff3e6; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <div class="ball" style="--c:#f2b705;left:10px;top:20px;color:#3a2a00;text-shadow:none">7</div>
    <div class="ball" style="--c:#3fa7e0;left:170px;top:0;">14</div>
    <div class="ball" style="--c:#ec5a54;left:325px;top:40px;">23</div>
    <div class="ball" style="--c:#8f9aa6;left:80px;top:190px;">38</div>
    <div class="ball" style="--c:#59b53a;left:250px;top:210px;">42</div>
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
