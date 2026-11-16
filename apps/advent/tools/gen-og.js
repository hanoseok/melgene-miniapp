#!/usr/bin/env node
/**
 * 어드벤트 캘린더 만들기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 CSS 로 그린 예시 캘린더(문 번호 24개 + 열린 문 하나에 쿠키, 메시지 없음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const CORE = require(path.join(SITE_DIR, 'advent-core.js'));
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const order = CORE.layout(CORE.hash('og'));
  const doors = order.map((d) => (d === 3 ? '<i class="open">🍪</i>' : `<i${d === 24 ? ' class="last"' : ''}>${d}</i>`)).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: ${sans}; color: #f6f3ea;
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #2a7048, #164a2f 55%, #0b2117);
  }
  .snow { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,255,255,.8) 0 3px, transparent 4px), radial-gradient(circle, rgba(255,255,255,.55) 0 2px, transparent 3px), radial-gradient(circle, rgba(244,201,93,.6) 0 2px, transparent 3px);
    background-size: 97px 83px, 61px 71px, 53px 101px; background-position: 10px 20px, 40px 5px, 25px 33px; opacity: .5; }
  .art { position: absolute; left: 92px; top: 46px; width: 430px; height: 500px; transform: rotate(-3deg);
    background: #fff3dc; border-radius: 22px; padding: 18px;
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.85), inset 0 0 0 8px #f4c95d;
    display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(6, 1fr); gap: 9px; }
  .art i { display: flex; align-items: center; justify-content: center; border-radius: 10px; font-style: normal;
    background: linear-gradient(180deg, #d8362f, #a8231f); color: #fff7e6; font-family: 'Nunito', ${sans}; font-weight: 900; font-size: 30px;
    box-shadow: inset 0 0 0 3px rgba(244,201,93,.85); }
  .art i.open { background: #fffaf0; font-size: 38px; box-shadow: inset 0 3px 10px rgba(0,0,0,.25), 0 0 0 3px #f4c95d, 0 0 26px 6px rgba(244,201,93,.8); }
  .art i.last { font-size: 36px; }
  .deco { position: absolute; font-size: 64px; line-height: 1; }
  .text { position: absolute; left: 590px; top: 90px; width: 560px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #f4c95d; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #f6f3ea;
    text-shadow: 0 0 30px rgba(244,201,93,.3), 0 5px 0 rgba(11,33,23,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #ffd9d4; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(11,33,23,.85); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #f4c95d; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(246,243,234,.7); }
</style>
</head>
<body>
  <div class="snow"></div>
  <div class="art">${doors}</div>
  <div class="deco" style="left:30px; top:30px; transform:rotate(-14deg)">🎄</div>
  <div class="deco" style="left:500px; top:22px; transform:rotate(12deg)">⭐</div>
  <div class="deco" style="left:505px; top:470px; transform:rotate(10deg)">🎁</div>
  <div class="text">
    <div class="eyebrow">${esc(T.og.kicker)}</div>
    <h1 id="t">${esc(T.og.title)}</h1>
    <p class="desc" id="d">${esc(T.og.desc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자(두 줄) 안에 들어갈 때까지 글자를 줄인다
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.querySelector('.text'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 72, lh = parseFloat(getComputedStyle(h).lineHeight) / 72;
      function over() { return h.scrollWidth > 560 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 402; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 30; while (box.scrollHeight > 402 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
