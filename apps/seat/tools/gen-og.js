#!/usr/bin/env node
/**
 * 자리 바꾸기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 크림색 공책 종이 위 칠판 초록 교실(나무 교탁 + 자리 카드 4×3, 몇 장은 아직 뒷면, 한 자리는 빈자리).
 * 이름 대신 뒤집힌 카드·의자 모양만 그린다(실제 이름·결과를 보여 주지 않음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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

// 자리 카드 모양: f = 앞면(흰 카드 + 의자 아이콘), b = 아직 뒷면, e = 빈자리(점선), p = 고정(머스터드)
const LAYOUT = ['f', 'b', 'p', 'f', 'b', 'f', 'e', 'f', 'f', 'b', 'f', 'b'];

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const seats = LAYOUT.map((k) => `<div class="seat ${k}">${k === 'f' || k === 'p' ? '<span class="chair"></span>' : ''}</div>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #1d2b24; background: #f7f2e6;
    background-image: linear-gradient(rgba(36,73,58,.08) 1px, transparent 1px); background-size: 100% 34px; }
  .room { position: absolute; left: 56px; top: 64px; width: 500px; height: 420px; border-radius: 34px; background: #24493a;
    box-shadow: 0 30px 60px -24px rgba(36,73,58,.7); padding: 28px 30px; }
  .desk { margin: 0 auto 26px; width: 230px; height: 46px; border-radius: 12px; background: linear-gradient(180deg, #b5763c, #8f5726); box-shadow: 0 5px 0 rgba(0,0,0,.3); }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .seat { height: 92px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
  .seat.f { background: #fbfaf5; border: 3px solid #fff; }
  .seat.p { background: #f2c14e; border: 3px solid #f2c14e; }
  .seat.b { background: #2f5c4a; border: 3px solid rgba(255,255,255,.35);
    background-image: radial-gradient(circle at 50% 50%, rgba(255,255,255,.28) 0 14%, transparent 15%); }
  .seat.e { border: 3px dashed rgba(255,255,255,.35); }
  .chair { position: relative; width: 34px; height: 40px; }
  .chair::before { content: ''; position: absolute; left: 4px; right: 4px; top: 0; height: 20px; border-radius: 6px 6px 2px 2px; background: #24493a; }
  .chair::after { content: ''; position: absolute; left: 0; right: 0; top: 22px; height: 8px; border-radius: 3px; background: #24493a;
    box-shadow: 4px 10px 0 -2px #24493a, -4px 10px 0 -2px #24493a; }
  .text { position: absolute; left: 610px; top: 50px; width: 550px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.4; color: #f2c14e;
    background: #24493a; border-radius: 999px; padding: 6px 22px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 66px; line-height: 1.12; color: #1d2b24; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #2f5c4a; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 74px; padding: 0 56px; display: flex; align-items: center;
    background: #24493a; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #f2c14e; }
</style>
</head>
<body>
  <div class="room" aria-hidden="true">
    <div class="desk"></div>
    <div class="grid">${seats}</div>
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
      function over() { return h.scrollWidth > 550 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
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
