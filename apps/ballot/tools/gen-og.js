#!/usr/bin/env node
/**
 * 비밀 투표 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 남색 밤 바탕, 왼쪽에 금색 투표함 + 들어가는 크림색 투표용지(체크 표시) + 물음표 쪽지. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 결과·표 수는 넣지 않는다.
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
  body { position: relative; font-family: ${sans}; color: #fbf6ea; background: #132238;
    background-image: radial-gradient(circle at 26% 46%, rgba(255,201,74,.30), transparent 42%), radial-gradient(ellipse at 80% 0%, rgba(124,198,255,.18), transparent 55%); }
  .art { position: absolute; left: 40px; top: 30px; width: 560px; height: 500px; }
  .box { position: absolute; left: 70px; top: 250px; width: 420px; height: 230px; border-radius: 26px; background: #ffc94a; box-shadow: 0 14px 0 #c9922a, 0 30px 60px rgba(0,0,0,.45); }
  .slot { position: absolute; left: 90px; top: 34px; width: 240px; height: 26px; border-radius: 14px; background: #132238; }
  .label { position: absolute; left: 0; right: 0; bottom: 34px; text-align: center; font-size: 90px; line-height: 1; }
  .paper { position: absolute; left: 190px; top: 70px; width: 170px; height: 210px; border-radius: 12px; background: #fbf6ea; transform: rotate(9deg); box-shadow: 0 10px 24px rgba(0,0,0,.35); }
  .paper i { position: absolute; left: 26px; right: 26px; height: 12px; border-radius: 6px; background: #e2d8c2; }
  .tick { position: absolute; left: 44px; top: 88px; width: 90px; height: 50px; border-left: 16px solid #ff6b4a; border-bottom: 16px solid #ff6b4a; transform: rotate(-45deg); border-radius: 4px; }
  .note { position: absolute; font-size: 70px; line-height: 1; filter: drop-shadow(0 6px 4px rgba(0,0,0,.35)); }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #132238;
    background: #ffc94a; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #c9922a; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fbf6ea; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #7cc6ff; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0b1626; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fbf6ea; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffc94a; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <div class="paper"><i style="top:30px"></i><i style="top:56px; right:60px"></i><span class="tick"></span></div>
    <div class="box"><span class="slot"></span><span class="label">🗳️</span></div>
    <span class="note" style="left:20px; top:90px; transform:rotate(-14deg)">🤫</span>
    <span class="note" style="left:440px; top:60px; transform:rotate(12deg)">❓</span>
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
