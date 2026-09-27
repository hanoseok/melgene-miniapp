#!/usr/bin/env node
/**
 * 돌림판 OG 이미지(1200x630)를 언어별로 Chrome headless 로 만든다.
 * 템플릿: tools/og-card.html — 실제 렌더러(roulette-core.js + roulette-draw.js)를 인라인해서 그 언어의 점심 메뉴 휠을 그린다.
 * 문구·글꼴: tools/i18n/<lang>.js 의 og, fontCss, displayFont, wheel.spin, ui.presets. 웹폰트를 받으므로 네트워크가 필요하다.
 *   출력: og/<언어 dir>/default.png (기본 언어는 og/default.png)
 *
 * 실행: node tools/gen-og.js          (새 사이트라 기본값이 전체 언어)
 *       node tools/gen-og.js ja en    (지정 언어만)
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));
const { emWidth } = require('./text-em.js');

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8');
const CORE_JS = fs.readFileSync(path.join(SITE_DIR, 'roulette-core.js'), 'utf8');
const DRAW_JS = fs.readFileSync(path.join(SITE_DIR, 'roulette-draw.js'), 'utf8');
const DRAW = require(path.join(SITE_DIR, 'roulette-draw.js'));
const OG_PRESET = 'lunch';

// 스크립트 안에 넣는 JS 는 </script> 만 막으면 된다 (템플릿 치환 기호 {{ }} 는 소스에 없다)
const inlineJs = (src) => src.replace(/<\/script/gi, '<\\/script');

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-') && a !== 'all');
  const langs = args.length ? args : G.LOCALES.map((l) => l.code);
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const body = T.bodyFont || "'Pretendard', -apple-system, 'Hiragino Sans', 'Noto Sans JP', sans-serif";
    const titleEm = emWidth(T.og.title);
    const vars = {
      lang,
      fontCss: T.fontCss,
      displayFont: T.displayFont || 'sans-serif',
      bodyFont: body,
      titleSize: String(Math.round(Math.min(132, 480 / titleEm))),
      tagSize: String([...T.og.tag].length > 22 ? 30 : 34),
      hubSize: String(Math.round(Math.min(28, (520 * 0.19) / emWidth(T.wheel.spin)))),
      badge: G.esc(T.og.badge),
      title: G.esc(T.og.title),
      tag: G.esc(T.og.tag),
      spin: G.esc(T.wheel.spin),
      pointer: DRAW.pointerSvg('og'),
      itemsJson: JSON.stringify(T.ui.presets[OG_PRESET]).replace(/</g, '\\u003c'),
      core: inlineJs(CORE_JS),
      draw: inlineJs(DRAW_JS),
    };
    const html = TEMPLATE.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const out = path.join(SITE_DIR, 'og', dir, 'default.png');
    shoot(html, out);
    console.log(`[${lang}] ${path.relative(SITE_DIR, out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
  });
}

main();
