#!/usr/bin/env node
/**
 * 빙고 번호 추첨기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 짙은 남색 무대 위 빙고 공 다섯 개(B 파랑 · I 빨강 · N 흰색 · G 초록 · O 노랑, 가운데 큰 공) + 금빛 색종이. 오른쪽에 언어별 문구.
 * 글꼴은 언어 파일 fonts 그대로(네트워크 필요), 숫자는 Baloo 2.
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
const NUMS = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@800&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
// 공: [글자, 숫자, 색, 왼쪽, 위, 크기, 기울기]
const BALLS = [['B', 7, '#2f7de1', 30, 300, 170, -12], ['I', 22, '#e5484d', 120, 70, 150, 8], ['N', 38, '#e9edf2', 160, 190, 300, 0], ['G', 53, '#23a55a', 420, 60, 150, -6], ['O', 71, '#f5a700', 400, 330, 175, 10]];

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const balls = BALLS.map(([L, n, c, x, y, s, r]) => `<div class="ball" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:radial-gradient(circle at 32% 26%, rgba(255,255,255,.55), transparent 32%), ${c};transform:rotate(${r}deg)"><span class="face" style="font-size:${Math.round(s * 0.3)}px"><i style="font-size:${Math.round(s * 0.13)}px">${L}</i>${n}</span></div>`).join('\n    ');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<link rel="stylesheet" href="${NUMS}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #fff8ec; background: #0f2236;
    background-image: radial-gradient(circle at 8% 14%, rgba(255,201,74,.6) 0 5px, transparent 6px), radial-gradient(circle at 92% 12%, rgba(47,125,225,.8) 0 5px, transparent 6px),
      radial-gradient(circle at 48% 90%, rgba(229,72,77,.6) 0 5px, transparent 6px), radial-gradient(circle at 58% 8%, rgba(35,165,90,.7) 0 5px, transparent 6px),
      radial-gradient(ellipse at 28% 45%, rgba(47,125,225,.35), transparent 60%); }
  .stage { position: absolute; left: 20px; top: 0; width: 600px; height: 560px; }
  .ball { position: absolute; border-radius: 50%; display: grid; place-items: center; box-shadow: inset -14px -18px 30px rgba(0,0,0,.28), 0 24px 40px -16px rgba(0,0,0,.85); }
  .face { width: 64%; height: 64%; border-radius: 50%; background: #fff; color: #1b2433; display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: 'Baloo 2', sans-serif; font-weight: 800; line-height: 1; box-shadow: inset 0 3px 8px rgba(0,0,0,.15); }
  .face i { font-style: normal; color: rgba(27,36,51,.7); margin-bottom: 2px; }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5;
    background: #ffc94a; color: #1b2433; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #d99a12; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fff8ec; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffc94a; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0a1726; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff8ec; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffc94a; }
</style>
</head>
<body>
  <div class="stage" aria-hidden="true">
    ${balls}
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
