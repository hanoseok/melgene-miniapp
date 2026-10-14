#!/usr/bin/env node
/**
 * 글자수 세기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 크림색 원고지 위 줄 노트 카드(남색 숫자 막대 = 언어별 라벨, 글 줄은 회색 막대로만, 목표 진행 막대 + 빨간 교정펜).
 * 통계처럼 보이는 가짜 숫자는 넣지 않는다. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const B = T.ui.bar;
  const lines = [92, 100, 84, 96, 70, 0, 88, 60].map((p) => (p ? `<span style="width:${p}%"></span>` : '<i></i>')).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #1f3a5f; background: #fbf6ea;
    background-image: linear-gradient(rgba(226,106,74,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(226,106,74,.16) 1px, transparent 1px);
    background-size: 30px 30px; }
  .note { position: absolute; left: 56px; top: 56px; width: 500px; height: 440px; border-radius: 30px; background: #fffdf6; overflow: hidden;
    box-shadow: 0 30px 60px -24px rgba(31,58,95,.55), 0 0 0 2px rgba(31,58,95,.12); transform: rotate(-2deg); }
  .bar { display: grid; grid-template-columns: repeat(4, 1fr); background: #1f3a5f; }
  .cell { padding: 16px 6px 14px; text-align: center; border-left: 1px solid rgba(255,255,255,.14); }
  .cell:first-child { border-left: 0; }
  .cell b { display: block; height: 22px; width: 56%; margin: 0 auto 10px; border-radius: 6px; background: #ffe45c; }
  .cell em { font-style: normal; font-family: ${display}; font-weight: ${w}; font-size: 19px; line-height: 1.25; color: rgba(255,255,255,.88); white-space: nowrap; }
  .lines { padding: 26px 30px 0; display: flex; flex-direction: column; gap: 19px; }
  .lines span { display: block; height: 14px; border-radius: 7px; background: rgba(31,58,95,.2); }
  .lines i { display: block; height: 14px; }
  .prog { position: absolute; left: 30px; right: 30px; bottom: 30px; height: 18px; border-radius: 9px; background: #e8eef6; overflow: hidden; }
  .prog span { display: block; width: 72%; height: 100%; border-radius: 9px; background: #2f9e6b; }
  .pen { position: absolute; left: 470px; top: 380px; width: 150px; height: 150px; transform: rotate(35deg); }
  .text { position: absolute; left: 640px; top: 46px; width: 520px; height: 450px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.4; color: #fff;
    background: #d9483b; border-radius: 999px; padding: 6px 22px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #1f3a5f; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #b33a2f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #1f3a5f; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffe45c; }
</style>
</head>
<body>
  <div class="note" aria-hidden="true">
    <div class="bar">
      <div class="cell"><b></b><em>${esc(B.chars)}</em></div>
      <div class="cell"><b></b><em>${esc(B.noSpaces)}</em></div>
      <div class="cell"><b></b><em>${esc(B.words)}</em></div>
      <div class="cell"><b></b><em>${esc(B.bytes)}</em></div>
    </div>
    <div class="lines">${lines}</div>
    <div class="prog"><span></span></div>
  </div>
  <svg class="pen" viewBox="0 0 150 150" aria-hidden="true">
    <rect x="58" y="0" width="34" height="104" rx="6" fill="#d9483b"/>
    <rect x="58" y="16" width="34" height="10" fill="#b33a2f"/>
    <path d="M58 104 L75 140 L92 104 Z" fill="#f4d9b8"/>
    <path d="M69 128 L75 140 L81 128 Z" fill="#1f3a5f"/>
  </svg>
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
      function over() { return h.scrollWidth > 520 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 452; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 452 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
      var eb = document.querySelector('.eyebrow'), es = 24; while (eb.scrollWidth > 520 && es > 14) { es -= 2; eb.style.fontSize = es + 'px'; }
      document.querySelectorAll('.cell em').forEach(function (e) { var s = 19; while (e.scrollWidth > e.parentNode.clientWidth - 8 && s > 11) { s -= 1; e.style.fontSize = s + 'px'; } });
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
