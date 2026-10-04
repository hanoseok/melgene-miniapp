#!/usr/bin/env node
/**
 * 닉네임 생성기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 이름표 스티커. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  body { position: relative; font-family: ${sans}; color: #2b1b4d; background: #f3ecff;
    background-image: repeating-linear-gradient(90deg, rgba(43,27,77,.05) 0 2px, transparent 2px 96px); }
  .art { position: absolute; left: 70px; top: 110px; width: 430px; height: 340px; }
  .tag { position: absolute; left: 20px; top: 20px; width: 380px; padding: 0 0 34px; background: #fff; border: 7px solid #2b1b4d; border-radius: 40px; box-shadow: 12px 12px 0 #2b1b4d; transform: rotate(-4deg); overflow: hidden; }
  .tag-top { height: 74px; background: #7c4dff; border-bottom: 7px solid #2b1b4d; display: flex; align-items: center; justify-content: center; }
  .hole { width: 110px; height: 26px; border-radius: 999px; background: #f3ecff; border: 6px solid #2b1b4d; }
  .tag-body { display: grid; gap: 18px; padding: 30px 40px 0; }
  .l1 { width: 62%; height: 26px; margin: 0 auto; border-radius: 999px; background: #ff5fa2; }
  .l2 { height: 78px; border-radius: 22px; background: #c6f432; border: 6px solid #2b1b4d; display: grid; place-items: center; font-size: 44px; line-height: 1; }
  .l3 { width: 44%; height: 26px; margin: 0 auto; border-radius: 999px; background: #e4d6ff; }
  .text { position: absolute; left: 580px; top: 60px; width: 580px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #c6f432;
    background: #2b1b4d; border-radius: 999px; padding: 6px 22px; margin-bottom: 20px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.16; color: #2b1b4d; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #5a2fd6; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #7c4dff; border-top: 5px solid #2b1b4d; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #efe6ff; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true"><div class="tag"><div class="tag-top"><span class="hole"></span></div><div class="tag-body"><span class="l1"></span><span class="l2">✨</span><span class="l3"></span></div></div></div>
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
