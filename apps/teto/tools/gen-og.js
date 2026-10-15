#!/usr/bin/env node
/**
 * 테토·에겐 테스트 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png, og/<id>.png
 *   그 밖:                og/<언어 dir>/default.png, og/<언어 dir>/<id>.png      → 12개 언어 × 9장 = 108장
 * 기본 이미지는 결과를 인용하지 않는다(물음표 달린 에너지 구슬 + 앱 이름 + 짧은 설명). 결과 이미지는 그 유형 이름 + 한 줄 소개(숫자 없음).
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
const CORE = require(path.join(__dirname, '..', 'teto-core.js'));
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
    position: relative; font-family: ${sans}; color: #2b1d22;
    background:
      radial-gradient(circle at 12% 18%, #ff7a4566, transparent 42%),
      radial-gradient(circle at 92% 88%, #f78fc466, transparent 45%),
      radial-gradient(ellipse 60% 70% at 25% 45%, ${c.color}2e, transparent 70%),
      linear-gradient(180deg, #fff6ee, #fff0f4);
  }
  .art { position: absolute; left: 90px; top: 62px; width: 420px; height: 420px; display: grid; place-items: center;
    --h-main: ${c.color}; --h-ink: ${c.ink}; --h-teto: ${ART.HALF.teto}; --h-egen: ${ART.HALF.egen}; }
  .art svg { position: absolute; inset: 0; width: 100%; height: 100%; filter: drop-shadow(0 18px 30px ${c.color}55); }
  .emo { position: relative; font-size: 168px; line-height: 1; font-family: 'Apple Color Emoji', 'Noto Color Emoji', sans-serif; }
  .q { position: absolute; right: 14px; top: 14px; width: 104px; height: 104px; border-radius: 50%; background: #fff; color: #c94f8f;
    border: 6px solid #f78fc4; font: 900 64px/92px 'Nunito', sans-serif; text-align: center; box-shadow: 0 8px 20px rgba(201, 79, 143, .3); }
  .text { position: absolute; left: 560px; top: 60px; width: 590px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: ${c.deep}; line-height: 1.3; margin-bottom: 12px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 80px; line-height: 1.15; color: #2b1d22; }
  h1, .desc { text-wrap: balance; }
  h1, .desc, .eyebrow { word-break: ${['keep-all', 'auto-phrase'].includes(F.wordBreak) ? F.wordBreak : 'normal'}; line-break: strict; }
  .desc { margin-top: 18px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.45; color: rgba(43, 29, 34, .74); }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  html:lang(th) .desc { line-height: 1.6; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 78px; padding: 0 56px; display: flex; align-items: center;
    background: linear-gradient(90deg, #ff7a45, #f78fc4);
    font-family: ${display}; font-weight: ${w}; font-size: 30px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 800; font-family: ${sans}; font-size: 22px; color: rgba(255, 255, 255, .92); }
</style>
</head>
<body>
  <div class="art">${ART.orbSvg('og')}<span class="emo">${c.emoji}</span>${id === 'mystery' ? '<span class="q">?</span>' : ''}</div>
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
      var size = 80, lh = parseFloat(getComputedStyle(h).lineHeight) / 80;
      function over() { return h.scrollWidth > 590 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 442; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 30; while (box.scrollHeight > 442 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
