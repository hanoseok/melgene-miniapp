#!/usr/bin/env node
/**
 * 손가락 룰렛 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 남색 밤 바탕, 왼쪽에 네온 손가락 원 여러 개(하나만 크게 빛남) + 손가락 이모지. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 결과는 넣지 않는다.
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
  body { position: relative; font-family: ${sans}; color: #fff7ec; background: #14112b;
    background-image: radial-gradient(circle at 26% 46%, rgba(255,93,143,.32), transparent 42%), radial-gradient(ellipse at 80% 0%, rgba(76,201,240,.2), transparent 55%); }
  .art { position: absolute; left: 40px; top: 30px; width: 560px; height: 500px; }
  .dot { position: absolute; border-radius: 50%; background: radial-gradient(circle, #fff 0 14%, var(--c) 16% 100%); box-shadow: 0 0 40px 10px var(--c); opacity: .45; }
  .dot.win { opacity: 1; box-shadow: 0 0 70px 26px var(--c); }
  .hand { position: absolute; font-size: 110px; line-height: 1; filter: drop-shadow(0 6px 4px rgba(0,0,0,.35)); }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #fff;
    background: #ff5d8f; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #c93a69; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fff7ec; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #4cc9f0; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0c0a1c; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff7ec; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffd23f; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <span class="dot" style="left:120px; top:120px; width:140px; height:140px; margin:-70px 0 0 -70px; --c:#4cc9f0"></span>
    <span class="dot" style="left:380px; top:90px; width:124px; height:124px; margin:-62px 0 0 -62px; --c:#ffd23f"></span>
    <span class="dot" style="left:110px; top:360px; width:128px; height:128px; margin:-64px 0 0 -64px; --c:#7bdc65"></span>
    <span class="dot" style="left:400px; top:380px; width:120px; height:120px; margin:-60px 0 0 -60px; --c:#b388ff"></span>
    <span class="dot win" style="left:260px; top:250px; width:240px; height:240px; margin:-120px 0 0 -120px; --c:#ff5d8f"></span>
    <span class="hand" style="left:300px; top:290px">👆</span>
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
