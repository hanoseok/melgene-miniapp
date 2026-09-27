#!/usr/bin/env node
/**
 * 사다리타기 기본 OG 이미지(1200x630)를 언어별로 Chrome headless 로 만든다.
 * 템플릿: tools/og-card.html, 문구: tools/i18n/<lang>.js 의 og.
 *   ko: og/default.png (기존 이미지, 기본 실행에서는 다시 만들지 않는다)
 *   en: og/en/default.png, ja: og/ja/default.png
 *
 * 실행: node tools/gen-og.js | node tools/gen-og.js ja | node tools/gen-og.js all
 */
const fs = require('fs');
const path = require('path');
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const { shoot, langsFromArgv } = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'og-shot.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const TEMPLATE = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8');

const FONTS = {
  ja: {
    css: 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@700;800&display=swap',
    display: "'M PLUS Rounded 1c', sans-serif",
    body: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
  },
  zh: {
    css: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap',
    display: "'ZCOOL KuaiLe', sans-serif",
    body: "'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', sans-serif",
  },
  th: {
    css: 'https://fonts.googleapis.com/css2?family=Mali:wght@700;800&display=swap',
    display: "'Mali', sans-serif",
    body: "'Sukhumvit Set', 'Noto Sans Thai', sans-serif",
  },
  vi: {
    css: 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap',
    display: "'Baloo 2', sans-serif",
    body: "'Pretendard', 'Noto Sans', sans-serif",
  },
  fr: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700;800&display=swap',
    display: "'Fredoka', sans-serif",
    body: "'Pretendard', -apple-system, sans-serif",
  },
  de: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700;800&display=swap',
    display: "'Fredoka', sans-serif",
    body: "'Pretendard', -apple-system, sans-serif",
  },
  es: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700;800&display=swap',
    display: "'Fredoka', sans-serif",
    body: "'Pretendard', -apple-system, sans-serif",
  },
  it: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700;800&display=swap',
    display: "'Fredoka', sans-serif",
    body: "'Pretendard', -apple-system, sans-serif",
  },
  pt: {
    css: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@700;800&display=swap',
    display: "'Fredoka', sans-serif",
    body: "'Pretendard', -apple-system, sans-serif",
  },
  ru: {
    css: 'https://fonts.googleapis.com/css2?family=Balsamiq+Sans:wght@700&display=swap', // Jua·Fredoka 에 키릴 문자 없음
    display: "'Balsamiq Sans', sans-serif",
    body: "'Pretendard', -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, 'Noto Sans', sans-serif",
  },
  default: {
    css: 'https://fonts.googleapis.com/css2?family=Jua&display=swap',
    display: "'Jua', sans-serif",
    body: "'Pretendard', -apple-system, sans-serif",
  },
};

function main() {
  langsFromArgv(G.LOCALES, G.DEFAULT_LOCALE).forEach((lang) => {
    const T = L10N[lang];
    if (!T) throw new Error(`unknown lang ${lang}`);
    const f = FONTS[lang] || FONTS.default;
    const vars = {
      lang, fontCss: f.css, displayFont: f.display, bodyFont: f.body,
      badge: G.esc(T.og.badge), title: G.esc(T.og.title), tag: G.esc(T.og.tag),
    };
    const html = TEMPLATE.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    const { dir } = G.LOCALES.find((l) => l.code === lang);
    const out = path.join(SITE_DIR, 'og', dir, 'default.png');
    shoot(html, out);
    console.log(`[${lang}] ${path.relative(SITE_DIR, out)}`);
  });
}

main();
