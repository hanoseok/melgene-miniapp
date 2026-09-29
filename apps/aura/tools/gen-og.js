#!/usr/bin/env node
/**
 * 오라 컬러 테스트 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png, og/<id>.png
 *   그 밖:                og/<언어 dir>/default.png, og/<언어 dir>/<id>.png      → 12개 언어 × 9장 = 108장
 * 기본 이미지는 결과를 인용하지 않는다(진주빛 정체불명 오라 + 앱 이름 + 짧은 설명). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 용량: 찍은 PNG 를 ImageMagick(있으면)으로 256색 팔레트 PNG 로 줄인다(한 장 ~100KB 안팎). 없으면 원본 그대로.
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
const CORE = require(path.join(__dirname, '..', 'aura-core.js'));
const ART = require(path.join(__dirname, 'art.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;
const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };
const MAGICK = ['/opt/homebrew/bin/magick', '/usr/local/bin/magick', '/usr/bin/magick', '/usr/bin/convert'].find((p) => fs.existsSync(p));

function card({ lang, T, id, eyebrow, title, desc }) {
  const F = T.fonts;
  const c = ART.colors(id);
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
  body {
    position: relative; font-family: ${sans}; color: #f6f3ff;
    background:
      radial-gradient(ellipse 60% 90% at 24% 50%, ${c.edge}66, transparent 70%),
      radial-gradient(ellipse 100% 100% at 70% 0%, #2a2166, #140f33 55%, #0b0820);
  }
  .star { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #efeaff; opacity: .75; }
  .art { position: absolute; left: 40px; top: 40px; width: 480px; height: 480px; }
  .art svg { width: 100%; height: 100%; overflow: visible; }
  .text { position: absolute; left: 540px; top: 60px; width: 610px; height: 450px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #c9c0ff; line-height: 1.3; margin-bottom: 12px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 88px; line-height: 1.15; color: ${c.ink};
    text-shadow: 0 0 40px ${c.mid}aa; }
  h1, .desc { text-wrap: balance; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 32px; line-height: 1.45; color: #efeaff; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  html:lang(th) .desc { line-height: 1.6; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 76px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(11, 8, 32, .72); font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #efeaff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(246,243,255,.7); }
</style>
</head>
<body>
  <div class="star" style="left:80px;top:60px"></div><div class="star" style="left:520px;top:40px"></div>
  <div class="star" style="left:760px;top:36px"></div><div class="star" style="left:1120px;top:120px"></div>
  <div class="star" style="left:600px;top:520px"></div><div class="star" style="left:40px;top:500px"></div>
  <div class="star" style="left:1060px;top:500px"></div>
  <div class="art">${ART.svg(id, { uid: 'og' })}</div>
  <div class="text">
    <div class="eyebrow">${esc(eyebrow)}</div>
    <h1 id="t">${esc(title)}</h1>
    <p class="desc" id="d">${esc(desc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 두 줄 안에 들어갈 때까지 글자를 줄인다
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.querySelector('.text'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 88, lh = parseFloat(getComputedStyle(h).lineHeight) / 88;
      function over() { return h.scrollWidth > 610 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 452; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 32; while (box.scrollHeight > 452 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
    });
  </script>
</body>
</html>`;
}

function shrink(file) {
  if (!MAGICK) return;
  const tmp = file + '.tmp.png';
  try {
    execFileSync(MAGICK, [file, '-strip', '-dither', 'FloydSteinberg', '-colors', '256', `PNG8:${tmp}`], { stdio: 'ignore' });
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
      CORE.ORDER.forEach((id) => jobs.push([id, { id, eyebrow: T.og.eyebrow, title: T.types[id].name, desc: T.types[id].vibe }]));
    }
    jobs.forEach(([name, o]) => {
      const out = path.join(outDir, `${name}.png`);
      shoot(card({ lang, T, ...o }), out);
      shrink(out);
      n++;
    });
    console.log(`[${lang}] og/${dir ? dir + '/' : ''}*.png`);
  });
  console.log(`생성 완료: OG 이미지 ${n}장${MAGICK ? ' (256색 PNG 로 줄임)' : ''}`);
}

main();
