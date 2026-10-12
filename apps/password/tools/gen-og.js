#!/usr/bin/env node
/**
 * 비밀번호 생성기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 민트 점무늬 위 금고 철판 카드(가려진 비밀번호 줄 + 강도 막대 + 열쇠). 실제 비밀번호처럼 보이는 문자열은 넣지 않는다(●).
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
const MONO = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@800&display=swap';
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const R = T.result;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<link rel="stylesheet" href="${MONO}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #0d1f1a; background: #edf6f1;
    background-image: radial-gradient(rgba(13,31,26,.1) 2px, transparent 2.2px); background-size: 30px 30px; }
  .vault { position: absolute; left: 56px; top: 66px; width: 500px; height: 410px; border-radius: 36px; padding: 40px 34px;
    background: linear-gradient(160deg, #1b3a30, #11261f); box-shadow: 0 30px 60px -20px rgba(11,138,95,.55); }
  .vault::before, .vault::after { content: ''; position: absolute; top: 20px; width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.18); }
  .vault::before { left: 20px; } .vault::after { right: 20px; }
  .key { position: absolute; right: 30px; bottom: 26px; width: 120px; height: 60px; }
  .row { display: flex; align-items: center; gap: 14px; height: 84px; padding: 0 18px; border-radius: 20px; background: rgba(0,0,0,.32); }
  .dots { flex: 1; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 40px; letter-spacing: 6px; color: #ffc83d; white-space: nowrap; overflow: hidden; }
  .copy { padding: 10px 18px; border-radius: 14px; background: #ffc83d; color: #0d1f1a; font-weight: 800; font-size: 24px; font-family: ${display}; }
  .row.small { height: 62px; margin-top: 14px; }
  .row.small .dots { font-size: 28px; color: rgba(255,200,61,.7); }
  .bars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 34px; }
  .bars span { height: 16px; border-radius: 999px; background: #3ee6a0; }
  .word { margin-top: 18px; font-family: ${display}; font-weight: ${w}; font-size: 34px; color: #3ee6a0; line-height: 1.3; }
  .text { position: absolute; left: 610px; top: 50px; width: 550px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.4; color: #ffc83d;
    background: #0d1f1a; border-radius: 999px; padding: 6px 22px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #0d1f1a; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #076b49; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #0d1f1a; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffc83d; }
</style>
</head>
<body>
  <div class="vault" aria-hidden="true">
    <div class="row"><span class="dots">●●●●●●●●●●</span><span class="copy">${esc(R.copy)}</span></div>
    <div class="row small"><span class="dots">●●●●●●●●●●●●●●●</span></div>
    <div class="bars"><span></span><span></span><span></span><span></span></div>
    <p class="word">${esc(R.strength.veryStrong)}</p>
    <svg class="key" viewBox="0 0 120 60"><circle cx="30" cy="30" r="20" fill="none" stroke="#ffc83d" stroke-width="10"/><path d="M50 30h62M96 30v18M110 30v12" stroke="#ffc83d" stroke-width="10" stroke-linecap="round"/></svg>
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
      function over() { return h.scrollWidth > 550 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 442 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
      var eb = document.querySelector('.eyebrow'), es = 24; while (eb.scrollWidth > 550 && es > 16) { es -= 2; eb.style.fontSize = es + 'px'; }
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
