#!/usr/bin/env node
/**
 * MBTI 테스트 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png, og/<id>.png
 *   그 밖:                og/<언어 dir>/default.png, og/<언어 dir>/<id>.png      → 12개 언어 × 17장 = 204장
 * 기본 이미지는 결과를 인용하지 않는다(물음표 타일 네 장 + 앱 이름 + 짧은 설명). 결과 이미지는 그 유형 코드 + 별명 + 한 줄 소개.
 * 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 용량: 찍은 PNG 를 ImageMagick(있으면)으로 256색 팔레트 PNG 로 줄인다. 없으면 원본 그대로.
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어 — og-shot 규칙)
 *       node tools/gen-og.js ko ja    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 *       node tools/gen-og.js all --default   (default.png 만)
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));
const CORE = require(path.join(__dirname, '..', 'mbti-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const NUNITO = 'https://fonts.googleapis.com/css2?family=Nunito:wght@900&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
const MAGICK = ['/opt/homebrew/bin/magick', '/usr/local/bin/magick', '/usr/bin/magick', '/usr/bin/convert'].find((p) => fs.existsSync(p));

function card({ lang, T, id, eyebrow, title, name, desc }) {
  const F = T.fonts;
  const c = ART.colors(id);
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const tiles = c.code.split('').map((ch, i) => `<span class="tile t${i + 1}">${ch}</span>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${NUNITO}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: ${sans}; color: #2b2140;
    background:
      radial-gradient(ellipse 70% 90% at 22% 45%, ${c.ink}, transparent 70%),
      linear-gradient(90deg, rgba(110, 96, 190, .09) 2px, transparent 2px) 0 0 / 42px 42px,
      linear-gradient(180deg, rgba(110, 96, 190, .09) 2px, transparent 2px) 0 0 / 42px 42px,
      #f7f4ff;
  }
  .art { position: absolute; left: 100px; top: 70px; width: 410px; height: 410px; display: grid; place-items: center; }
  .tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 360px; height: 360px; }
  .tile { display: grid; place-items: center; border-radius: 36px; background: linear-gradient(160deg, #fff, ${c.ink});
    border: 6px solid ${c.deep}; box-shadow: 0 12px 0 ${c.deep}; color: ${c.deep};
    font: 900 112px/1 'Nunito', sans-serif; }
  .t1 { transform: rotate(-5deg); background: linear-gradient(160deg, #fff, ${c.color}55); }
  .t2 { transform: rotate(4deg); } .t3 { transform: rotate(3deg); }
  .t4 { transform: rotate(-4deg); background: linear-gradient(160deg, #fff, ${c.color}55); }
  .emo { position: absolute; left: 50%; top: 50%; width: 120px; height: 120px; margin: -60px 0 0 -60px; display: grid; place-items: center;
    border-radius: 50%; background: #fff; border: 6px solid ${c.deep}; box-shadow: 0 8px 0 ${c.deep};
    font-size: 66px; line-height: 1; font-family: 'Apple Color Emoji', 'Noto Color Emoji', sans-serif; }
  .text { position: absolute; left: 570px; top: 40px; width: 580px; height: 480px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 34px; color: ${id === 'mystery' ? '#c23a52' : c.deep}; line-height: 1.3; margin-bottom: 8px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 84px; line-height: 1.12; color: #2b2140; }
  h1.code { font: 900 132px/1 'Nunito', sans-serif; letter-spacing: .06em; color: ${c.deep}; }
  .name { margin-top: 10px; font-family: ${display}; font-weight: ${w}; font-size: 46px; line-height: 1.2; color: #2b2140; }
  h1, .desc, .name { text-wrap: balance; }
  h1, .desc, .eyebrow, .name { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 16px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.45; color: rgba(43, 33, 64, .72); }
  html:lang(th) h1, html:lang(vi) h1, html:lang(th) .name { line-height: 1.4; }
  html:lang(th) .desc { line-height: 1.6; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 76px; padding: 0 56px; display: flex; align-items: center;
    background: linear-gradient(100deg, #ff7a8a, #b36cf0 55%, #7b6cf6); color: #fff;
    font-family: ${display}; font-weight: ${w}; font-size: 30px; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(255, 255, 255, .9); }
</style>
</head>
<body>
  <div class="art"><span class="tiles">${tiles}</span><span class="emo">${c.emoji}</span></div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(eyebrow)}</div>
    <h1 id="t" class="${name ? 'code' : ''}">${esc(title)}</h1>
    ${name ? `<div class="name" id="n">${esc(name)}</div>` : ''}
    <p class="desc" id="d">${esc(desc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 글이 상자 안에 들어갈 때까지 줄인다
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), n = document.getElementById('n'), d = document.getElementById('d');
      if (!n) {
        var size = 84, lh = parseFloat(getComputedStyle(h).lineHeight) / 84;
        while ((h.scrollWidth > 580 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 482) && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      } else {
        var ns = 46; while ((n.offsetHeight > ns * 1.45 * 2 + 2 || box.scrollHeight > 482) && ns > 28) { ns -= 2; n.style.fontSize = ns + 'px'; }
      }
      var ds = 30; while (box.scrollHeight > 482 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
    });
  </script>
</body>
</html>`;
}

function shrink(file) {
  if (!MAGICK) return;
  const tmp = file + '.tmp.png';
  try {
    execFileSync(MAGICK, [file, '-strip', '-dither', 'FloydSteinberg', '-colors', '128', `PNG8:${tmp}`], { stdio: 'ignore' });
    if (fs.existsSync(tmp) && fs.statSync(tmp).size < fs.statSync(file).size) fs.renameSync(tmp, file);
  } finally {
    if (fs.existsSync(tmp)) fs.rmSync(tmp);
  }
}

function main() {
  const langs = langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE);
  let n = 0;
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const outDir = path.join(SITE_DIR, 'og', dir);
    const jobs = [['default', { id: 'mystery', eyebrow: T.og.defaultKicker, title: T.og.defaultTitle, desc: T.og.defaultDesc }]];
    if (!process.argv.includes('--default')) {
      CORE.ORDER.forEach((id) => jobs.push([id, { id, eyebrow: T.og.eyebrow, title: CORE.TYPES[id].code, name: T.types[id].name, desc: T.types[id].vibe }]));
    }
    jobs.forEach(([name, o]) => {
      const out = path.join(outDir, `${name}.png`);
      shoot(card({ lang, T, ...o }), out);
      shrink(out);
      n++;
    });
    console.log(`[${lang}] og/${dir ? dir + '/' : ''}*.png`);
  });
  console.log(`생성 완료: OG 이미지 ${n}장${MAGICK ? ' (128색 PNG 로 줄임)' : ''}`);
}

main();
