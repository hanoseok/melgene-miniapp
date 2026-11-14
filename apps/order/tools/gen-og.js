#!/usr/bin/env node
/**
 * 순서 정하기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림: 크림색 종이 위에 번호표 카드 1·2·3·4(이름 칸은 빈 막대) + 오른쪽 제목. 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  const rows = [[1, 300, -3, true], [2, 250, 2], [3, 280, -1], [4, 220, 3]]
    .map(([n, bar, r, first], i) => `<div class="row${first ? ' first' : ''}" style="top:${70 + i * 120}px;transform:rotate(${r}deg)"><b>${n}</b><i style="width:${bar}px"></i></div>`).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #2a2440; background: radial-gradient(120% 90% at 20% 0%, #fffaf2 0%, #fff6e8 55%, #fdebd0 100%); }
  .row { position: absolute; left: 60px; width: 500px; height: 96px; border-radius: 22px; background: #2f3a8f; box-shadow: 0 16px 26px -16px rgba(34,43,110,.8);
    display: flex; align-items: center; gap: 26px; padding: 0 26px; }
  .row::before, .row::after { content: ''; position: absolute; top: 34px; width: 28px; height: 28px; border-radius: 50%; background: #fff6e8; }
  .row::before { left: -14px; } .row::after { right: -14px; }
  .row.first { background: linear-gradient(160deg, #ff6b4a, #d9502f); }
  .row b { font-family: ${display}; font-weight: ${w}; font-size: 60px; line-height: 1; color: #fff; width: 60px; text-align: center; }
  .row i { display: block; height: 24px; border-radius: 12px; background: rgba(255,255,255,.35); }
  .text { position: absolute; left: 630px; top: 40px; width: 530px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${sans}; font-weight: 800; font-size: 22px; line-height: 1.45; color: #fff;
    background: #2f3a8f; border-radius: 999px; padding: 6px 20px; margin-bottom: 22px; transform: rotate(-2deg); }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 62px; line-height: 1.18; color: #2a2440; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #d9502f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #2a2440; font-family: ${sans}; font-weight: 800; font-size: 26px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-size: 22px; color: #ffb3a1; }
</style>
</head>
<body>
  <div aria-hidden="true">${rows}</div>
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
      var size = 62, lh = parseFloat(getComputedStyle(h).lineHeight) / 62;
      function over() { return h.scrollWidth > 530 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 462; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 462 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
