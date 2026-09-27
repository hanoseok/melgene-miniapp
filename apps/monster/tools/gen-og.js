#!/usr/bin/env node
/**
 * 할로윈 몬스터 테스트 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png, og/<id>.png
 *   그 밖:                og/<언어 dir>/default.png, og/<언어 dir>/<id>.png
 * 기본 이미지는 결과를 인용하지 않는다(정체불명 그림 + 앱 이름 + 짧은 설명). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 *       node tools/gen-og.js all --default   (default.png 만)
 */
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));
const CORE = require(path.join(__dirname, '..', 'monster-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
const BAT = '<svg viewBox="0 0 64 32"><path d="M32 10c2-4 5-5 5-5l1 4c3-3 9-4 13-2-3 1-4 4-4 6 4-1 9 0 13 3-5 0-8 2-10 5-3-2-7-2-10 0-2-2-5-3-8-3s-6 1-8 3c-3-2-7-2-10 0-2-3-5-5-10-5 4-3 9-4 13-3 0-2-1-5-4-6 4-2 10-1 13 2l1-4s3 1 5 5z" fill="#0b0518"/></svg>';

function card({ lang, T, art, accent, eyebrow, title, desc }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
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
    position: relative; font-family: ${sans}; color: #fbf4ff;
    background: radial-gradient(ellipse 90% 90% at 30% 20%, #4a2285, #1f0f3d 55%, #140a26);
  }
  .star { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #fff3c4; opacity: .8; }
  .moon { position: absolute; right: 70px; top: 46px; width: 120px; height: 120px; border-radius: 50%;
    background: radial-gradient(circle at 38% 36%, #fffbe6, #fff3c4 55%, #f3d98a);
    box-shadow: 0 0 60px 16px rgba(255,243,196,.35); }
  .bat { position: absolute; }
  .glow { position: absolute; left: 60px; top: 95px; width: 440px; height: 440px; border-radius: 50%;
    background: radial-gradient(circle, ${accent}55 0%, transparent 66%); }
  .art { position: absolute; left: 90px; top: 125px; width: 380px; height: 380px; filter: drop-shadow(0 18px 30px rgba(0,0,0,.5)); }
  .art svg { width: 100%; height: 100%; }
  .text { position: absolute; left: 520px; top: 150px; width: 610px; height: 360px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${Number(F.displayWeight) || 400}; font-size: 30px; color: #ffb347; line-height: 1.3; margin-bottom: 8px; }
  h1 { font-family: ${display}; font-weight: ${Number(F.displayWeight) || 400}; font-size: 92px; line-height: 1.12; color: ${accent};
    text-shadow: 0 5px 0 rgba(20,10,38,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 18px; font-family: ${display}; font-weight: ${Number(F.displayWeight) || 400}; font-size: 32px; line-height: 1.4; color: #fff3c4; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(20,10,38,.7); font-family: ${display}; font-weight: ${Number(F.displayWeight) || 400}; font-size: 28px; color: #ffb347; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(251,244,255,.7); }
</style>
</head>
<body>
  <div class="star" style="left:80px;top:60px"></div><div class="star" style="left:420px;top:40px"></div>
  <div class="star" style="left:700px;top:90px"></div><div class="star" style="left:980px;top:210px"></div>
  <div class="star" style="left:560px;top:520px"></div><div class="star" style="left:30px;top:470px"></div>
  <div class="moon"></div>
  <div class="bat" style="left:880px;top:60px;width:70px">${BAT}</div>
  <div class="bat" style="left:1010px;top:190px;width:44px">${BAT}</div>
  <div class="bat" style="left:470px;top:70px;width:38px">${BAT}</div>
  <div class="glow"></div>
  <div class="art">${art}</div>
  <div class="text">
    <div class="eyebrow" id="e">${esc(eyebrow)}</div>
    <h1 id="t">${esc(title)}</h1>
    <p class="desc" id="d">${esc(desc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 두 줄 안(글상자 안)에 들어갈 때까지 글자를 줄인다
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.querySelector('.text'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 92, lh = parseFloat(getComputedStyle(h).lineHeight) / 92;
      function over() { return h.scrollWidth > 610 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 362; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 32; while (box.scrollHeight > 362 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
    });
  </script>
</body>
</html>`;
}

function main() {
  const langs = langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE);
  let n = 0;
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const outDir = path.join(SITE_DIR, 'og', dir);
    shoot(card({ lang, T, art: ART.svg('mystery'), accent: '#ff8a1f', eyebrow: T.og.defaultKicker, title: T.og.defaultTitle, desc: T.og.defaultDesc }), path.join(outDir, 'default.png'));
    n++;
    if (!process.argv.includes('--default')) {
      CORE.ORDER.forEach((id) => {
        const t = T.types[id];
        shoot(card({ lang, T, art: ART.svg(id), accent: CORE.TYPES[id].color, eyebrow: T.og.eyebrow, title: t.name, desc: t.catch }), path.join(outDir, `${id}.png`));
        n++;
      });
    }
    console.log(`[${lang}] og/${dir ? dir + '/' : ''}*.png`);
  });
  console.log(`생성 완료: OG 이미지 ${n}장`);
}

main();
