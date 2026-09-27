#!/usr/bin/env node
/**
 * 내 인생 애니메이션 기본 OG 이미지(1200x630)를 언어별로 Chrome headless 로 만든다.
 * 템플릿: tools/og-card.html — 실제 렌더러(life-core.js + life-engine.js)를 인라인해서 펜 만화 한 페이지를 그린다.
 * 문구: tools/i18n/<lang>.js 의 og / ui. 글꼴은 Google Fonts 에서 받으므로 네트워크가 필요하다.
 *   en(루트): og/default.png, 나머지: og/<언어>/default.png (ja, zh, ko, fr, de, th, vi, es, it, pt, ru)
 *   (og/en/default.png 는 예전 /en/ 페이지가 공유될 때 쓰던 캐시용으로 남아 있다)
 *
 * 실행: node tools/gen-og.js          (새 사이트라 기본값이 전체 언어)
 *       node tools/gen-og.js ja       (지정 언어만)
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8');
const CORE_JS = fs.readFileSync(path.join(SITE_DIR, 'life-core.js'), 'utf8');
const ENGINE_JS = fs.readFileSync(path.join(SITE_DIR, 'life-engine.js'), 'utf8');

const LATIN = { display: "'Newsreader', Georgia, serif", weight: 500, hand: "'Caveat', cursive", body: "'Pretendard', sans-serif", brand: 32, tag: 36 };
const STYLE = {
  en: LATIN, fr: LATIN, de: LATIN, es: LATIN, it: LATIN, pt: LATIN,
  vi: { display: "'Newsreader', Georgia, serif", weight: 500, hand: "'Patrick Hand', cursive", body: "'Pretendard', sans-serif", brand: 30, tag: 33 },
  ko: { display: "'Gowun Batang', serif", weight: 700, hand: "'Nanum Pen Script', cursive", body: "'Pretendard', sans-serif", brand: 34, tag: 40 },
  ja: { display: "'Shippori Mincho', serif", weight: 700, hand: "'Klee One', cursive", body: "'Hiragino Sans', 'Noto Sans JP', sans-serif", brand: 26, tag: 29 },
  zh: { display: "'ZCOOL XiaoWei', 'Songti SC', serif", weight: 400, hand: "'Ma Shan Zheng', 'Kaiti SC', cursive", body: "'PingFang SC', 'Noto Sans SC', sans-serif", brand: 30, tag: 34 },
  th: { display: "'Trirong', serif", weight: 600, hand: "'Mali', cursive", body: "'Sukhumvit Set', 'Thonburi', 'Noto Sans Thai', sans-serif", brand: 28, tag: 31 },
  // ru: Newsreader 에 키릴 문자가 없어 제목은 Source Serif 4(키릴 포함), 손글씨는 Caveat(키릴 포함) 그대로
  ru: { display: "'Source Serif 4', 'PT Serif', serif", weight: 500, hand: "'Caveat', cursive", body: "'Pretendard', -apple-system, 'Helvetica Neue', Arial, sans-serif", brand: 32, tag: 35 },
};

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-') && a !== 'all');
  const langs = args.length ? args : G.LOCALES.map((l) => l.code);
  langs.forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const st = STYLE[lang] || STYLE.en;
    const vars = {
      lang,
      fontCss: T.fontCss,
      displayFont: st.display,
      titleWeight: String(st.weight),
      handFont: st.hand,
      bodyFont: st.body,
      brandSize: String(st.brand),
      tagSize: String(st.tag),
      brand: G.esc(T.hero.brand),
      title: G.esc(T.og.title),
      tag: G.esc(T.og.tag),
      chip: G.esc(T.og.chip),
      uiJson: JSON.stringify(T.ui).replace(/</g, '\\u003c'),
      core: CORE_JS,
      engine: ENGINE_JS,
    };
    const html = TEMPLATE.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const out = path.join(SITE_DIR, 'og', dir, 'default.png');
    shoot(html, out);
    console.log(`[${lang}] ${path.relative(SITE_DIR, out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
  });
}

main();
