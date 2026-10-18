#!/usr/bin/env node
/**
 * 병 돌리기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 자두색 파티 밤 위 둥근 나무 테이블 + 기울어진 초록 유리병 + 둘레의 이름 칩(언어 무관 이모지 얼굴). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 미션 카드 문구는 넣지 않는다(스포일러 금지).
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
const FACES = ['😄', '🤠', '😎', '🎃', '🦊', '🤖', '👻', '🐱'];

function card({ lang, T }) {
  const F = T.fonts;
  const sans = `${F.sans ? F.sans + ', ' : ''}${CJK[lang] || ''}'Pretendard', sans-serif`;
  const display = `${F.display}, ${sans}`;
  const w = Number(F.displayWeight) || 400;
  const seats = FACES.map((f, i) => {
    const a = (i * 360) / FACES.length * Math.PI / 180;
    const x = 290 + 222 * Math.sin(a);
    const y = 290 - 222 * Math.cos(a);
    return `<div class="seat${i === 1 ? ' on' : ''}" style="left:${x.toFixed(1)}px;top:${y.toFixed(1)}px">${f}</div>`;
  }).join('');
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #fff6e6; background: #2b1a3d;
    background-image: radial-gradient(circle at 8% 20%, rgba(242,107,29,.5) 0 4px, transparent 5px), radial-gradient(circle at 92% 14%, rgba(242,182,50,.5) 0 4px, transparent 5px),
      radial-gradient(circle at 70% 80%, rgba(123,63,176,.7) 0 4px, transparent 5px), radial-gradient(ellipse at 30% 40%, rgba(123,63,176,.45), transparent 60%); }
  .stage { position: absolute; left: 20px; top: 0; width: 580px; height: 580px; }
  .table { position: absolute; left: 70px; top: 70px; width: 440px; height: 440px; border-radius: 50%;
    background: repeating-radial-gradient(circle at 46% 44%, rgba(255,255,255,.05) 0 7px, rgba(0,0,0,.05) 7px 15px), radial-gradient(circle at 40% 35%, #c58a55, #a86b3c 55%, #7a4a2a);
    box-shadow: 0 0 0 10px #7a4a2a, 0 0 0 14px rgba(0,0,0,.25), 0 30px 50px -16px rgba(0,0,0,.8), inset 0 0 50px rgba(0,0,0,.35); }
  .bottle { position: absolute; left: 290px; top: 290px; width: 110px; height: 286px; transform: translate(-50%, -50%) rotate(45deg); filter: drop-shadow(0 10px 8px rgba(0,0,0,.4)); }
  .seat { position: absolute; width: 74px; height: 74px; margin: -37px 0 0 -37px; border-radius: 50%; background: #fff6e6; box-shadow: 0 5px 0 rgba(0,0,0,.3);
    display: flex; align-items: center; justify-content: center; font-size: 40px; }
  .seat.on { background: #f26b1d; box-shadow: 0 0 0 6px #f2b632, 0 8px 16px rgba(0,0,0,.45); transform: scale(1.12); }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #fff;
    background: #f26b1d; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #d4540c; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fff6e6; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #f2b632; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #1c1029; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff6e6; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #f2b632; }
</style>
</head>
<body>
  <div class="stage" aria-hidden="true">
    <div class="table"></div>
    ${seats}
    <svg class="bottle" viewBox="0 0 100 260">
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#1d6b3c"/><stop offset=".35" stop-color="#3fbf73"/><stop offset=".6" stop-color="#2a9256"/><stop offset="1" stop-color="#16502d"/></linearGradient></defs>
      <path d="M40 8h20v18c0 16 26 34 26 64v148a14 14 0 0 1-14 14H28a14 14 0 0 1-14-14V90c0-30 26-48 26-64z" fill="url(#g)" stroke="#0f3a21" stroke-width="4" stroke-linejoin="round"/>
      <rect x="37" y="2" width="26" height="16" rx="4" fill="#f2a33a" stroke="#0f3a21" stroke-width="4"/>
      <rect x="22" y="132" width="56" height="62" rx="8" fill="#fff3d6" stroke="#0f3a21" stroke-width="3"/>
      <circle cx="50" cy="163" r="14" fill="#f26b1d"/>
      <path d="M28 96c-4 14-5 30-5 48" stroke="#c8f5d8" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>
    </svg>
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
      function over() { return h.scrollWidth > 520 || h.offsetHeight > size * lh * 3 + 2 || box.scrollHeight > 462; }
      while (over() && size > 34) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 28; while (box.scrollHeight > 462 && ds > 18) { ds -= 2; d.style.fontSize = ds + 'px'; }
      var eb = box.querySelector('.eyebrow'), es = 24; while (eb.scrollWidth > 520 && es > 16) { es -= 2; eb.style.fontSize = es + 'px'; }
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
