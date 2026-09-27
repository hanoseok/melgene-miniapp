#!/usr/bin/env node
/**
 * 밸런스 게임 기본 OG 이미지(1200x630)를 언어별로 Chrome headless 로 만든다.
 * 템플릿: tools/og-card.html (A|B 스플릿 + VS), 문구: tools/i18n/<lang>.js 의 og (실제 질문은 넣지 않는다).
 *   en(루트): og/default.png, 그 밖: og/<dir>/default.png
 * 기본 실행은 기본 언어(en)를 건드리지 않는다(tools/lib/og-shot.js 규칙). 전부 다시: node tools/gen-og.js all
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8');

function main() {
  langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE).forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const F = T.fonts; // 글꼴은 언어 파일에서 (tools/i18n/<lang>.js)
    const vars = {
      lang, fontCss: F.css, displayFont: `${F.display}, sans-serif`,
      displayWeight: Number(F.displayWeight) || 400, lineHeight: F.tall ? 1.3 : 1.12,
      sansFont: F.sans ? `${F.sans}, 'Pretendard', sans-serif` : "'Pretendard', 'Hiragino Sans', 'Noto Sans SC', 'Noto Sans Thai', sans-serif",
      title: G.esc(T.og.title), tag: G.esc(T.og.tag), a: G.esc(T.og.a), b: G.esc(T.og.b),
      sideA: G.esc(T.ui.sideA), sideB: G.esc(T.ui.sideB), vs: G.esc(T.ui.vsBadge), unknown: G.esc(T.og.unknown),
    };
    const html = TEMPLATE.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const out = path.join(SITE_DIR, 'og', dir, 'default.png');
    shoot(html, out);
    console.log(`[${lang}] ${path.relative(SITE_DIR, out)}`);
  });
}

main();
