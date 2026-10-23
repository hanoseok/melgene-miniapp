#!/usr/bin/env node
/**
 * 폭탄 돌리기 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 보랏빛 밤 바탕 + 주황 불빛, 왼쪽에 큰 검은 폭탄(심지 끝 노란 불꽃), 둘레에 손 이모지(넘기는 손). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
 * 실제 결과·벌칙 미션·심지 시간은 넣지 않는다.
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
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="${PRETENDARD}">
<link rel="stylesheet" href="${esc(F.css)}">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; font-family: ${sans}; color: #fff7ec; background: #221b33;
    background-image: radial-gradient(circle at 26% 46%, rgba(255,159,28,.38), transparent 42%), radial-gradient(ellipse at 80% 0%, rgba(255,77,61,.22), transparent 55%); }
  .art { position: absolute; left: 40px; top: 30px; width: 560px; height: 500px; }
  .art svg { position: absolute; left: 60px; top: 40px; width: 420px; height: 420px; filter: drop-shadow(0 30px 30px rgba(0,0,0,.55)); }
  .spark { position: absolute; left: 400px; top: 70px; width: 90px; height: 90px; border-radius: 50%;
    background: radial-gradient(circle, #fff 0 16%, #ffd23f 32%, #ff9f1c 55%, rgba(255,77,61,0) 72%); }
  .ray { position: absolute; left: 445px; top: 115px; width: 6px; height: 64px; margin: -32px 0 0 -3px; border-radius: 3px; background: #ffd23f; transform-origin: 50% 50%; }
  .hand { position: absolute; font-size: 74px; line-height: 1; filter: drop-shadow(0 6px 4px rgba(0,0,0,.35)); }
  .text { position: absolute; left: 640px; top: 40px; width: 520px; height: 460px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { align-self: flex-start; font-family: ${display}; font-weight: ${w}; font-size: 24px; line-height: 1.5; color: #fff;
    background: #ff4d3d; border-radius: 999px; padding: 4px 22px; margin-bottom: 22px; box-shadow: 0 4px 0 #c9322a; white-space: nowrap; max-width: 520px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 64px; line-height: 1.16; color: #fff7ec; }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 22px; font-family: ${sans}; font-weight: 700; font-size: 28px; line-height: 1.4; color: #ffd23f; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.4; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 70px; padding: 0 56px; display: flex; align-items: center;
    background: #17121f; font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #fff7ec; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: #ffd23f; }
</style>
</head>
<body>
  <div class="art" aria-hidden="true">
    <svg viewBox="0 0 200 200">
      <defs><radialGradient id="b" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#5a5670"/><stop offset=".55" stop-color="#26232f"/><stop offset="1" stop-color="#0f0d14"/></radialGradient></defs>
      <path d="M128 46 C140 26 158 22 170 30" fill="none" stroke="#c9a46a" stroke-width="7" stroke-linecap="round"/>
      <rect x="106" y="40" width="34" height="24" rx="6" transform="rotate(32 123 52)" fill="#3b3848"/>
      <circle cx="94" cy="118" r="66" fill="url(#b)"/>
      <ellipse cx="70" cy="90" rx="18" ry="11" transform="rotate(-35 70 90)" fill="#fff" opacity=".28"/>
    </svg>
    <div class="spark"></div>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((d) => `<div class="ray" style="transform: rotate(${d}deg) translateY(-58px) scaleY(.6)"></div>`).join('')}
    <span class="hand" style="left:-6px; top:300px; transform: rotate(-20deg)">🫴</span>
    <span class="hand" style="left:450px; top:360px; transform: scaleX(-1) rotate(-20deg)">🫴</span>
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
