#!/usr/bin/env node
/**
 * 결과별 + 기본 OG 이미지(1200x630 PNG)를 언어별로 Chrome headless 로 생성한다.
 *   en(기본, 사이트 루트): og/<id>.png, og/default.png
 *   그 밖:                og/<언어 dir>/<id>.png, og/<언어 dir>/default.png  (ko, ja, zh, fr, de, th, vi, es, it, pt)
 * 글꼴은 언어 파일 typography(fontCss/font)를 그대로 쓴다(웹폰트는 네트워크 필요). 기본 이미지는 결과를 인용하지 않는다.
 *
 * 실행: node tools/gen-og.js          (기본 언어 en 을 뺀 모든 언어)
 *       node tools/gen-og.js ja th    (지정 언어만)
 *       node tools/gen-og.js all      (en 포함 전부)
 *       node tools/gen-og.js all --default   (기본 이미지 default.png 만)
 */
const path = require('path');
const DATA = require(path.join(__dirname, '..', 'data.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const { esc } = G;

const PRETENDARD = 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
const JA_FONTS = "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', ";
const ZH_FONTS = "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', ";

// 페이지와 같은 글꼴: typography.font 가 있으면 그것, 없으면 (ja/zh 스택 +) Pretendard
function fontsFor(lang, T) {
  const ty = T.typography || {};
  const css = Array.isArray(ty.fontCss) ? ty.fontCss : [PRETENDARD];
  const stack = ty.font
    ? ty.font
    : (lang === 'ja' ? JA_FONTS : lang === 'zh' ? ZH_FONTS : '') + "'Pretendard', -apple-system, sans-serif";
  return { css, stack };
}

function card({ lang, T, emoji, eyebrow, title, desc, brand, accent }) {
  const { css, stack: font } = fontsFor(lang, T);
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
${css.map((u) => `<link rel="stylesheet" href="${esc(u)}">`).join('\n')}
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    font-family: ${font};
    background: radial-gradient(ellipse 120% 90% at 50% -10%, #1b1f4d, #0a0b1e 62%);
    position: relative;
  }
  .band { position: absolute; top: 0; left: 0; right: 0; height: 14px;
    background: linear-gradient(90deg, ${accent}, #f3d98a, ${accent}); }
  .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #f4f0e4; opacity: .7; }
  .card {
    position: absolute; left: 100px; top: 112px; width: 1000px; height: 406px;
    border-radius: 36px;
    background: radial-gradient(140% 100% at 50% 0%, rgba(255,255,255,.35), transparent 55%),
      linear-gradient(180deg, #f4ecd4, #e9dcb4);
    box-shadow: 0 30px 80px -20px rgba(0,0,0,.6);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 28px 60px; text-align: center; color: #3a2f1d;
  }
  .emoji { font-size: 120px; line-height: 1; margin-bottom: 26px; }
  .eyebrow { font-size: 21px; font-weight: 700; letter-spacing: .12em; color: ${accent}; margin-bottom: 12px; }
  h1 { font-size: 54px; font-weight: 800; line-height: 1.3; white-space: nowrap; letter-spacing: -0.01em; }
  .desc { margin-top: 22px; font-size: 25px; line-height: 1.5; color: rgba(58,47,29,.7); max-width: 880px; text-wrap: balance; }
  html:lang(th) .eyebrow { letter-spacing: 0; }
  .brand { position: absolute; right: 40px; bottom: 30px; font-size: 20px; font-weight: 700; color: rgba(244,240,228,.72); }
</style>
</head>
<body>
  <div class="band"></div>
  <div class="star" style="left:95px;top:92px"></div>
  <div class="star" style="left:660px;top:62px"></div>
  <div class="star" style="left:1040px;top:80px"></div>
  <div class="star" style="left:143px;top:578px"></div>
  <div class="star" style="left:520px;top:600px"></div>
  <div class="card">
    <div class="emoji">${emoji}</div>
    <div class="eyebrow">${esc(eyebrow)}</div>
    <h1 id="t">${esc(title)}</h1>
    <p class="desc">${esc(desc)}</p>
  </div>
  <div class="brand">${esc(brand)}</div>
  <script>
    // 긴 이름(영어/일본어)은 한 줄에 들어갈 때까지 글자 크기를 줄인다
    (function () {
      var h = document.getElementById('t'), size = 54, max = 880;
      while (h.scrollWidth > max && size > 30) { size -= 2; h.style.fontSize = size + 'px'; }
      // 30px 로도 안 들어가면 두 줄로 (잘리지 않게)
      if (h.scrollWidth > max) { h.style.whiteSpace = 'normal'; h.style.maxWidth = max + 'px'; h.style.fontSize = '42px'; }
    })();
  </script>
</body>
</html>`;
}

function main() {
  const langs = langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE);
  let n = 0;
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const outDir = path.join(SITE_DIR, 'og', dir);

    // 기본 이미지: 앱 이름(검색어) · 시작 화면의 질문 · 훅 — 결과는 인용하지 않는다
    const plain = (html) => String(html).replace(/<br\s*\/?>/gi, /^(zh|ja)$/.test(lang) ? '' : ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    shoot(
      card({ lang, T, emoji: '🔮', eyebrow: T.og.defaultTitle, title: plain(T.landing.h1Html), desc: plain(T.landing.hookHtml), brand: T.og.brand, accent: '#a8812f' }),
      path.join(outDir, 'default.png')
    );
    n++;
    if (process.argv.includes('--default')) { console.log(`[${lang}] og/${dir ? dir + '/' : ''}default.png`); return; }
    DATA.order.forEach((id) => {
      const meta = DATA.types[id];
      const t = T.types[id];
      shoot(
        card({ lang, T, emoji: meta.emoji, eyebrow: T.og.eyebrow, title: t.name, desc: t.tagline, brand: T.og.brand, accent: meta.color }),
        path.join(outDir, `${id}.png`)
      );
      n++;
    });
    console.log(`[${lang}] og/${dir ? dir + '/' : ''}*.png ${DATA.order.length + 1}장`);
  });
  console.log(`생성 완료: OG 이미지 ${n}장`);
}

main();
