#!/usr/bin/env node
/**
 * BMI 계산기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 결과 카드 모양(숫자는 예시가 아니라 "?" — 진짜 숫자만 보여 준다는 규칙) + 단계 색 막대(경계는 그 언어의 기본 기준) + 기울어진 저울 타일.
 * 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(__dirname, '..', 'bmi-core.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUM_FONT = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
const COLORS = ['#4a9fe0', '#33b072', '#f2c230', '#f39237', '#e9643f', '#cf3f45'];

function bar(lang) {
  const cuts = CORE.SCALES[CORE.asiaDefault(lang) ? CORE.altScale(lang) : 'who'];
  const edges = [CORE.BAR[0], ...cuts, CORE.BAR[1]];
  const span = CORE.BAR[1] - CORE.BAR[0];
  return edges.slice(0, -1).map((e, i) => `<span style="width:${((edges[i + 1] - e) / span) * 100}%;background:${COLORS[Math.min(i, 5)]}"></span>`).join('');
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
<link rel="stylesheet" href="${NUM_FONT}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #173a2e;
    background: radial-gradient(circle at 8% 0%, #d7eedf 0, transparent 520px), radial-gradient(circle at 100% 40%, #fdecc8 0, transparent 460px), #f3f7f4; }
  .art { position: absolute; left: 70px; top: 60px; width: 450px; height: 440px; }
  .card { position: absolute; left: 0; top: 20px; width: 420px; height: 320px; border-radius: 36px; border: 5px solid #173a2e; box-shadow: 0 10px 0 #173a2e;
    background: #fff; transform: rotate(-4deg); text-align: center; padding-top: 30px; }
  .pill { display: inline-block; padding: 4px 18px; border-radius: 999px; background: #173a2e; color: #fff; font: 700 22px/1.4 ${sans}; }
  .big { margin-top: 6px; font: 700 130px/1 'Space Grotesk', sans-serif; color: #173a2e; letter-spacing: -3px; }
  .bar { display: flex; margin: 18px 36px 0; height: 26px; border-radius: 999px; overflow: hidden; border: 4px solid #173a2e; }
  .bar span { display: block; height: 100%; }
  .tile { position: absolute; left: 300px; top: 270px; width: 160px; height: 160px; border-radius: 50%; border: 5px solid #173a2e; box-shadow: 0 8px 0 #173a2e;
    background: #c9efd9; transform: rotate(8deg); display: flex; align-items: center; justify-content: center; font-size: 84px; line-height: 1; }
  .text { position: absolute; left: 570px; top: 60px; width: 580px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 25px; line-height: 1.35; color: #173a2e; background: #fff;
    border: 3px solid #173a2e; border-radius: 999px; padding: 5px 20px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 66px; line-height: 1.14; color: #173a2e; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #157a52; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #173a2e; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #c9efd9; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <div class="card"><span class="pill">${esc(T.ui.yourBmi)}</span><div class="big">?</div><div class="bar">${bar(lang)}</div></div>
    <div class="tile">⚖️</div>
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
      var size = 66, lh = parseFloat(getComputedStyle(h).lineHeight) / 66;
      function over() { return h.scrollWidth > 580 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
      while (over() && size > 36) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 442 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
