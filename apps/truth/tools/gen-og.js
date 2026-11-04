#!/usr/bin/env node
/**
 * 진실 게임 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 남보라 파티 밤 위 겹친 카드 두 장(청록·산호, 뒷면은 ? 무늬) + 주사위. 카드 앞면에는 언어별 진실/도전 라벨만 — 실제 카드 문구는 넣지 않는다(스포일러 금지).
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
  body { position: relative; font-family: ${sans}; color: #fff8ee; background: #1f1638;
    background-image: radial-gradient(circle at 8% 20%, rgba(255,201,74,.6) 0 5px, transparent 6px), radial-gradient(circle at 92% 14%, rgba(23,166,160,.7) 0 5px, transparent 6px),
      radial-gradient(circle at 46% 86%, rgba(255,107,87,.6) 0 5px, transparent 6px), radial-gradient(circle at 60% 10%, rgba(143,107,255,.7) 0 5px, transparent 6px),
      radial-gradient(ellipse at 28% 45%, rgba(143,107,255,.4), transparent 60%); }
  .stage { position: absolute; left: 40px; top: 30px; width: 560px; height: 520px; }
  .c { position: absolute; width: 250px; height: 350px; border-radius: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px;
    box-shadow: 0 30px 50px -16px rgba(0,0,0,.8); }
  .c1, .c2 { justify-content: flex-start; padding-top: 34px; }
  .c1 { left: 40px; top: 90px; transform: rotate(-12deg); background: #fff8ee; border-top: 18px solid #17a6a0; }
  .c2 { left: 250px; top: 60px; transform: rotate(9deg); background: #fff8ee; border-top: 18px solid #ff6b57; }
  .c3 { left: 160px; top: 175px; height: 330px; transform: rotate(-2deg); background: repeating-linear-gradient(45deg, #2a1f4a 0 18px, #150f27 18px 36px); border: 5px solid #ffc94a; }
  .tag { font-family: ${display}; font-weight: ${w}; font-size: 34px; color: #fff; border-radius: 999px; padding: 4px 24px; white-space: nowrap; max-width: 230px; overflow: hidden; }
  .c1 .tag { background: #17a6a0; } .c2 .tag { background: #ff6b57; }
  .lines { width: 160px; display: grid; gap: 14px; } .lines i { display: block; height: 14px; border-radius: 7px; background: rgba(34,26,51,.14); } .lines i:last-child { width: 60%; }
  .q { font-family: Arial, sans-serif; font-weight: 900; font-size: 150px; line-height: 1; color: #ffc94a; text-shadow: 0 8px 0 rgba(0,0,0,.35); }
  .dice { position: absolute; left: 400px; top: 360px; font-size: 110px; transform: rotate(14deg); filter: drop-shadow(0 12px 10px rgba(0,0,0,.5)); }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #fff;
    background: #ffc94a; color: #221a33; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #d99a12; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fff8ee; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffc94a; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #150f27; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff6e6; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffc94a; }
</style>
</head>
<body>
  <div class="stage" aria-hidden="true">
    <div class="c c1"><span class="tag">${esc(T.ui.truth)}</span><div class="lines"><i></i><i></i><i></i></div></div>
    <div class="c c2"><span class="tag">${esc(T.ui.dare)}</span><div class="lines"><i></i><i></i><i></i></div></div>
    <div class="c c3"><span class="q">?</span></div>
    <div class="dice">🎲</div>
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
