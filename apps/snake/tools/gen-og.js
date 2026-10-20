#!/usr/bin/env node
/**
 * 뱀 게임 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 시작 화면 티저와 같은 숲 초록 바탕 + 구불구불한 뱀 + 사과. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
const EMOJI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif";

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
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; font-family: ${sans}; color: #fff6ea;
    background:
      radial-gradient(circle at 1100px 90px, rgba(156,255,79,.16) 0 120px, transparent 260px),
      linear-gradient(180deg, #14472b 0%, #0a2417 58%, #04100a 100%);
  }
  .art { position: absolute; left: 30px; top: 60px; width: 540px; height: 470px; }
  .art svg { position: absolute; left: 0; top: 70px; width: 540px; filter: drop-shadow(0 12px 30px rgba(156,255,79,.35)); }
  .apple { position: absolute; right: 8px; top: 205px; font-size: 96px; line-height: 1; font-family: ${EMOJI}; filter: drop-shadow(0 8px 14px rgba(0,0,0,.4)); }
  .text { position: absolute; left: 580px; top: 60px; width: 570px; height: 430px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #04140d;
    background: #ffc233; border-radius: 12px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-1.5deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 72px; line-height: 1.12; color: #fff6ea; text-shadow: 0 5px 0 rgba(0,0,0,.35); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #9cff4f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #9cff4f; border-top: 5px solid #04140d; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #04140d; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #14472b; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <svg viewBox="0 0 220 120">
      <path d="M18 92 C40 92 40 56 66 56 C92 56 92 92 118 92 C144 92 144 56 170 56" fill="none" stroke="#04140d" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 92 C40 92 40 56 66 56 C92 56 92 92 118 92 C144 92 144 56 170 56" fill="none" stroke="#9cff4f" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 92 C40 92 40 56 66 56 C92 56 92 92 118 92 C144 92 144 56 170 56" fill="none" stroke="#5fd32a" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 22" stroke-dashoffset="-2"/>
      <circle cx="172" cy="49" r="5.5" fill="#fff" stroke="#04140d" stroke-width="2"/><circle cx="173.5" cy="49" r="2.6" fill="#04140d"/>
      <circle cx="172" cy="64" r="5.5" fill="#fff" stroke="#04140d" stroke-width="2"/><circle cx="173.5" cy="64" r="2.6" fill="#04140d"/>
      <path d="M184 56 L202 56 M196 56 L203 51 M196 56 L203 61" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" fill="none"/>
    </svg>
    <span class="apple">🍎</span>
  </div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(T.og.defaultKicker)}</div>
    <h1 id="t">${esc(T.og.defaultTitle)}</h1>
    <p class="desc" id="d">${esc(T.og.defaultDesc).replace(/(\d+) (?=\S)/g, "$1\u00a0")}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자 안에 들어갈 때까지 글자를 줄인다 (제목 3줄까지)
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 72, lh = parseFloat(getComputedStyle(h).lineHeight) / 72;
      function over() { return h.scrollWidth > 570 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 432; }
      while (over() && size > 36) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 432 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
