#!/usr/bin/env node
/**
 * 동물 달리기 시합 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 잔디 위 흙색 트랙(레인 5개, 동물 이모지가 서로 다른 위치에서 달림) + 체크무늬 결승선. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 결과·순위는 넣지 않는다.
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
const RUNNERS = [['🐇', 0.78], ['🐢', 0.52], ['🐎', 0.88], ['🐕', 0.34], ['🦒', 0.64]];

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const lanes = RUNNERS.map(([a, p], i) => `<div class="lane${i === 2 ? ' lead' : ''}"><span class="no">${i + 1}</span><span class="run" style="left:${(70 + p * 380).toFixed(0)}px">${i === 2 ? '<i>💨</i>' : ''}<b>${a}</b></span></div>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #fffaf0; background: #1f6b45;
    background-image: repeating-linear-gradient(90deg, rgba(255,255,255,.045) 0 60px, transparent 60px 120px), radial-gradient(ellipse at 30% 0%, rgba(255,201,60,.25), transparent 60%); }
  .track { position: absolute; left: 48px; top: 62px; width: 560px; height: 440px; border-radius: 26px; overflow: hidden;
    background: repeating-linear-gradient(90deg, rgba(0,0,0,.05) 0 4px, transparent 4px 12px), linear-gradient(#c8703c, #b25f2f);
    box-shadow: 0 0 0 8px #f7f1e2, 0 0 0 13px rgba(0,0,0,.2), 0 30px 50px -16px rgba(0,0,0,.7); padding: 8px 0; }
  .track::after { content: ''; position: absolute; top: 0; bottom: 0; right: 0; width: 26px; background: repeating-conic-gradient(#fff 0 25%, #23201a 0 50%) 0 0 / 13px 13px; }
  .lane { position: relative; height: 84.8px; border-bottom: 3px dashed rgba(255,250,240,.6); }
  .lane:last-child { border-bottom: 0; }
  .lane.lead { background: rgba(255,255,255,.14); }
  .no { position: absolute; left: 0; top: 0; bottom: 0; width: 56px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.16); border-right: 5px solid #fffaf0;
    font-family: ${display}; font-weight: ${w}; font-size: 30px; color: #fffaf0; }
  .run { position: absolute; top: 50%; transform: translateY(-50%); font-size: 58px; line-height: 1; display: flex; align-items: center; }
  .run b { display: inline-block; transform: scaleX(-1); font-weight: 400; filter: drop-shadow(0 4px 2px rgba(0,0,0,.3)); }
  .run i { font-style: normal; font-size: 32px; margin-right: -6px; }
  .text { position: absolute; left: 650px; top: 40px; width: 510px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #fff;
    background: #e2483d; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #b8332a; white-space: nowrap; max-width: 510px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fffaf0; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffc93c; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #164f33; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fffaf0; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffc93c; }
</style>
</head>
<body>
  <div class="track" aria-hidden="true">${lanes}</div>
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
      function over() { return h.scrollWidth > 510 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 462; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 462 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
      var eb = box.querySelector('.eyebrow'), es = 24; while (eb.scrollWidth > 510 && es > 16) { es -= 2; eb.style.fontSize = es + 'px'; }
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
