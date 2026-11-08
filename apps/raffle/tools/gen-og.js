#!/usr/bin/env node
/**
 * 경품 추첨기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 짙은 와인색 무대 위 리본 두른 선물 상자 세 개(가운데 큰 상자 + 금빛 별) + 이름표 카드 + 색종이. 오른쪽에 언어별 문구.
 * 이름표에는 실제 당첨자·결과가 없다(빈 "?" 칸 — 스포일러 없음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
// 상자: [왼쪽, 위, 폭, 높이, 상자 색, 리본 색, 기울기]
const BOXES = [[40, 300, 170, 150, '#6fd3a6', '#ffffff', -8], [180, 170, 270, 250, '#ffcf4d', '#e8384f', 0], [420, 290, 160, 150, '#ff9ec7', '#ffcf4d', 9]];
const BITS = [[90, 80, '#ffcf4d', 20], [560, 110, '#6fd3a6', -30], [320, 70, '#ff9ec7', 45], [520, 520, '#ffcf4d', 10], [70, 520, '#ffffff', -15], [600, 230, '#e8384f', 30], [250, 520, '#6fd3a6', 60]];

function box([x, y, w, h, c, r, rot]) {
  const lid = Math.round(h * 0.26);
  return `<div class="box" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:rotate(${rot}deg)">
      <div class="body" style="top:${lid - 6}px;background:${c}"></div>
      <div class="lid" style="height:${lid}px;background:${c}"></div>
      <div class="rib-v" style="background:${r};width:${Math.round(w * 0.16)}px"></div>
      <div class="rib-h" style="background:${r};top:${lid - 6}px;height:${Math.round(h * 0.12)}px"></div>
      <div class="bow" style="border-color:${r};width:${Math.round(w * 0.5)}px;height:${Math.round(w * 0.22)}px;top:${-Math.round(w * 0.2)}px"></div>
    </div>`;
}

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const bits = BITS.map(([x, y, c, r]) => `<i class="bit" style="left:${x}px;top:${y}px;background:${c};transform:rotate(${r}deg)"></i>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #fff7ea; background: #3b0d1e;
    background-image: radial-gradient(ellipse at 28% 40%, rgba(232,56,79,.45), transparent 62%), radial-gradient(ellipse at 90% 0%, rgba(255,207,77,.18), transparent 50%); }
  .stage { position: absolute; left: 20px; top: 0; width: 620px; height: 560px; }
  .box { position: absolute; }
  .box .body { position: absolute; left: 6%; right: 6%; bottom: 0; border-radius: 10px; box-shadow: inset -16px -14px 0 rgba(0,0,0,.12), 0 24px 40px -16px rgba(0,0,0,.85); }
  .box .lid { position: absolute; left: 0; right: 0; top: 0; border-radius: 10px; box-shadow: inset 0 -8px 0 rgba(0,0,0,.1); }
  .box .rib-v { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); }
  .box .rib-h { position: absolute; left: 6%; right: 6%; opacity: .9; }
  .box .bow { position: absolute; left: 50%; transform: translateX(-50%); border: 12px solid; border-radius: 50% 50% 8px 8px; border-bottom: 0; }
  .tag { position: absolute; left: 230px; top: 64px; width: 170px; height: 76px; border-radius: 14px; background: #fff7ea; color: #3b0d1e; display: grid; place-items: center;
    font-family: ${display}; font-weight: ${w}; font-size: 46px; box-shadow: 0 10px 0 #f6e8d2, 0 22px 30px -14px rgba(0,0,0,.8); transform: rotate(-6deg); }
  .star { position: absolute; left: 400px; top: 40px; font-size: 58px; }
  .bit { position: absolute; width: 16px; height: 26px; border-radius: 3px; }
  .text { position: absolute; left: 650px; top: 40px; width: 510px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5;
    background: #ffcf4d; color: #2a1418; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #d99a12; white-space: nowrap; max-width: 510px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 62px; line-height: 1.16; color: #fff7ea; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffcf4d; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #26070f; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff7ea; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffcf4d; }
</style>
</head>
<body>
  <div class="stage" aria-hidden="true">
    ${bits}
    ${BOXES.map(box).join('\n    ')}
    <div class="tag">?</div>
    <div class="star">⭐</div>
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
      var size = 62, lh = parseFloat(getComputedStyle(h).lineHeight) / 62;
      function over() { return h.scrollWidth > 510 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 462; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 462 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
      var eb = box.querySelector('.eyebrow'), es = 24; while (eb.scrollWidth > 510 && es > 14) { es -= 2; eb.style.fontSize = es + 'px'; }
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
