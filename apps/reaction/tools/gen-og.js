#!/usr/bin/env node
/**
 * 반응속도 테스트 기본 OG 이미지(1200x630)를 언어별로 Chrome headless 로 만든다.
 * 템플릿: tools/og-card.html, 문구: tools/i18n/<lang>.js 의 og.
 *   ko: og/default.png, en: og/en/default.png, ja: og/ja/default.png
 *
 * 실행: node tools/gen-og.js all   (처음 만들 때)
 *       node tools/gen-og.js       (ko 를 뺀 나머지 — gen-all.js --og 기본 동작과 같다)
 *       node tools/gen-og.js ja
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8');

// 글꼴은 언어 파일의 fontCss + typography 를 그대로 쓴다 (언어 목록을 코드에 두지 않는다)
function fontsFor(T) {
  const t = T.typography || {};
  return {
    css: T.fontCss,
    display: `${t.display || "'Archivo'"}, sans-serif`,
    weight: t.displayWeight != null ? t.displayWeight : 900,
    // 폭 축이 있는 Archivo 만 콘덴스드로 (다른 글꼴에는 효과가 없다)
    stretch: /Archivo/.test(t.display || 'Archivo') ? '72%' : '100%',
    body: [t.body, "'Archivo'", "'Pretendard'", '-apple-system', "'Hiragino Sans'", "'Noto Sans JP'", 'sans-serif'].filter(Boolean).join(', '),
  };
}

function main() {
  langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE).forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const f = fontsFor(T);
    const vars = {
      lang, fontCss: f.css, displayFont: f.display, displayWeight: f.weight, displayStretch: f.stretch, bodyFont: f.body,
      badge: G.esc(T.og.badge), title: G.esc(T.og.title), tag: G.esc(T.og.tag), wait: G.esc(T.og.wait), go: G.esc(T.og.go),
    };
    const html = TEMPLATE.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const out = path.join(SITE_DIR, 'og', dir, 'default.png');
    shoot(html, out);
    console.log(`[${lang}] ${path.relative(SITE_DIR, out)}`);
  });
}

main();
