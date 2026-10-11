#!/usr/bin/env node
/**
 * 스도쿠 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 신문 퍼즐 지면 같은 9×9 판(굵은 상자 선·주어진 숫자·연필 메모·고른 칸). 실제 퍼즐이 아닌 장식이다.
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
const CJK = { ja: "'Hiragino Sans', 'Noto Sans JP', ", zh: "'PingFang SC', 'Noto Sans SC', ", th: "'Noto Sans Thai', " };

// 판 장식: 9줄 × 9칸 — . 빈칸, 숫자 = 주어진 숫자, u+숫자 = 사용자가 넣은 숫자(파랑), n = 연필 메모, s = 고른 칸
const MAP = [
  '5 3 . . 7 . . . .',
  '6 . . 1 9 5 . . .',
  '. 9 8 . . . . 6 .',
  '8 . . . 6 . . . 3',
  '4 . . 8 s 3 . . 1',
  '7 . . . 2 . . . 6',
  '. 6 . . . . 2 8 .',
  '. . . 4 1 9 . . 5',
  '. . . . 8 n u4 7 9',
];
function cells() {
  const sz = 48;
  return MAP.map((row, r) => row.split(' ').map((ch, c) => {
    const cls = ['cell'];
    if (c === 2 || c === 5) cls.push('bR');
    if (r === 2 || r === 5) cls.push('bB');
    let label = '';
    if (/^[1-9]$/.test(ch)) label = ch;
    else if (/^u[1-9]$/.test(ch)) { label = ch.slice(1); cls.push('u'); }
    else if (ch === 'n') { label = '<span class="nt"><i></i><i>2</i><i></i><i></i><i></i><i>6</i><i></i><i></i><i></i></span>'; }
    else if (ch === 's') cls.push('sel');
    return `<i class="${cls.join(' ')}" style="left:${c * sz}px;top:${r * sz}px">${label}</i>`;
  }).join('')).join('\n    ');
}

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
    position: relative; font-family: ${sans}; color: #1d2a44;
    background:
      repeating-linear-gradient(90deg, transparent 0 39px, rgba(29,42,68,.045) 39px 40px),
      repeating-linear-gradient(0deg, transparent 0 39px, rgba(29,42,68,.045) 39px 40px),
      radial-gradient(ellipse 90% 80% at 30% 20%, #fffdf6, #f7f1e3 70%);
  }
  .board { position: absolute; left: 70px; top: 52px; width: 438px; height: 438px; border: 5px solid #1d2a44; border-radius: 8px;
    background: #fffaf0; box-shadow: 12px 12px 0 rgba(29,42,68,.14); transform: rotate(-2deg); overflow: hidden; }
  .cell { position: absolute; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-style: normal;
    font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 28px; line-height: 1; color: #1d2a44;
    border-right: 1px solid rgba(29,42,68,.18); border-bottom: 1px solid rgba(29,42,68,.18); }
  .cell.bR { border-right: 3px solid #1d2a44; } .cell.bB { border-bottom: 3px solid #1d2a44; }
  .cell.u { color: #2c5bd6; font-weight: 700; }
  .cell.sel { background: #ffd98a; }
  .nt { display: grid; grid-template-columns: repeat(3, 1fr); width: 100%; height: 100%; padding: 2px; }
  .nt i { display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 12px; font-weight: 700; color: #5f6f8c; }
  .text { position: absolute; left: 590px; top: 50px; width: 560px; height: 440px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 26px; line-height: 1.35; color: #fff;
    background: #1d2a44; border-radius: 10px; padding: 6px 20px; margin-bottom: 22px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 68px; line-height: 1.14; color: #1d2a44; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' || lang === 'ja' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #e4572e; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 72px; padding: 0 56px; display: flex; align-items: center;
    background: #e4572e; border-top: 4px solid #1d2a44; font-family: ${display}; font-weight: ${w}; font-size: 28px; color: #fff; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #fff; opacity: .95; }
</style>
</head>
<body>
  <div class="board" aria-hidden="true">
    ${cells()}
  </div>
  <div class="text" id="box">
    <div class="eyebrow">${esc(T.og.defaultKicker)}</div>
    <h1 id="t">${esc(T.og.defaultTitle)}</h1>
    <p class="desc" id="d">${esc(T.og.defaultDesc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자 안에 들어갈 때까지 글자를 줄인다 (제목 3줄까지)
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.getElementById('box'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 68, lh = parseFloat(getComputedStyle(h).lineHeight) / 68;
      function over() { return h.scrollWidth > 560 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 442; }
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
