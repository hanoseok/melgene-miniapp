#!/usr/bin/env node
/**
 * 2027 연하장 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 만든다 (tools/lib/og-shot.js).
 *   en(기본, 사이트 루트): og/default.png
 *   그 밖:                og/<언어 dir>/default.png
 * 그림은 CSS·이모지로 그린 예시 카드(홍색 금박 + 2027 + 양 + 인사말, 이름·메시지 없음). 글꼴은 언어 파일 fonts 그대로(네트워크 필요).
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
  const script = `${F.script}, ${display}`;
  const sw = Number(F.scriptWeight) || 400;
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
    position: relative; font-family: ${sans}; color: #f4fbf7;
    background: radial-gradient(ellipse 90% 90% at 25% 30%, #8e1024, #5a0816 55%, #2a0309);
  }
  .snow { position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(255,211,110,.7) 0 3px, transparent 4px), radial-gradient(circle, rgba(255,255,255,.4) 0 2px, transparent 3px);
    background-size: 90px 90px, 57px 57px; background-position: 10px 20px, 33px 5px; opacity: .55; }
  .glow { position: absolute; left: 20px; top: 40px; width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, rgba(255,211,110,.35) 0%, transparent 66%); }
  .art { position: absolute; left: 92px; top: 46px; width: 400px; height: 500px; border-radius: 36px; overflow: hidden; transform: rotate(-4deg);
    background: linear-gradient(180deg, #c8102e, #a30d25 55%, #6e0717);
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.8), 0 0 0 4px rgba(255,215,106,.6), inset 0 0 0 14px rgba(110,7,23,.85), inset 0 0 0 16px rgba(255,215,106,.4);
    display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 4px; padding: 40px 30px; }
  .lights { position: absolute; left: 24px; right: 24px; top: 22px; display: flex; justify-content: space-between; font-size: 22px; }
  .lights i { width: 16px; height: 22px; border-radius: 50%; display: block; box-shadow: 0 0 14px currentColor; background: currentColor; }
  .art .yr { font-family: 'Nunito', ${display}; font-weight: 900; font-size: 92px; line-height: 1; color: #ffd36a; letter-spacing: 4px; text-shadow: 0 0 22px rgba(255,211,106,.6); }
  .art .big { font-size: 130px; line-height: 1.1; filter: drop-shadow(0 0 24px rgba(255,215,106,.55)); }
  .art .gr { font-family: ${script}; font-weight: ${sw}; font-size: 48px; line-height: 1.35; color: #ffd76a; text-shadow: 0 0 18px rgba(255,215,106,.55); overflow-wrap: anywhere; }
  .art .row { font-size: 38px; letter-spacing: 8px; margin-top: 8px; }
  .deco { position: absolute; font-size: 64px; line-height: 1; }
  .text { position: absolute; left: 560px; top: 90px; width: 580px; height: 400px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: ${display}; font-weight: ${w}; font-size: 32px; color: #ffd36e; line-height: 1.3; margin-bottom: 10px; }
  h1 { font-family: ${display}; font-weight: ${w}; font-size: 78px; line-height: 1.12; color: #f4fbf7;
    text-shadow: 0 0 30px rgba(255,211,110,.35), 0 5px 0 rgba(42,3,9,.7); }
  h1, .desc, .eyebrow { word-break: ${F.wordBreak === 'keep-all' ? 'keep-all' : 'normal'}; line-break: strict; }
  .desc { margin-top: 20px; font-family: ${display}; font-weight: ${w}; font-size: 30px; line-height: 1.4; color: #ffe2b8; }
  html:lang(th) h1, html:lang(vi) h1 { line-height: 1.35; }
  .brand { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; padding: 0 56px; display: flex; align-items: center;
    background: rgba(42,3,9,.8); font-family: ${display}; font-weight: ${w}; font-size: 26px; color: #ffd36e; }
  .brand b { margin-left: auto; font-weight: 700; font-family: ${sans}; font-size: 22px; color: rgba(244,251,247,.7); }
</style>
</head>
<body>
  <div class="snow"></div>
  <div class="glow"></div>
  <div class="deco" style="left:30px; top:60px; transform:rotate(-14deg)">🎍</div>
  <div class="deco" style="left:470px; top:40px; transform:rotate(12deg)">🎆</div>
  <div class="deco" style="left:480px; top:470px; transform:rotate(10deg)">🧧</div>
  <div class="art"><div class="big">🐐</div><div class="yr">2027</div><div class="gr">${esc(T.og.cardGreeting)}</div><div class="row">🏮🧧🏮</div></div>
  <div class="text">
    <div class="eyebrow">${esc(T.og.defaultKicker)}</div>
    <h1 id="t">${esc(T.og.defaultTitle)}</h1>
    <p class="desc" id="d">${esc(T.og.defaultDesc)}</p>
  </div>
  <div class="brand">${esc(T.og.brand)}<b>${esc(G.brandOf(lang))}</b></div>
  <script>
    // 웹폰트가 불러와진 뒤, 제목이 글상자(두 줄) 안에 들어갈 때까지 글자를 줄인다
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () {
      var box = document.querySelector('.text'), h = document.getElementById('t'), d = document.getElementById('d');
      var size = 78, lh = parseFloat(getComputedStyle(h).lineHeight) / 78;
      function over() { return h.scrollWidth > 580 || h.offsetHeight > size * lh * 2 + 2 || box.scrollHeight > 402; }
      while (over() && size > 40) { size -= 4; h.style.fontSize = size + 'px'; }
      var ds = 30; while (box.scrollHeight > 402 && ds > 20) { ds -= 2; d.style.fontSize = ds + 'px'; }
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
