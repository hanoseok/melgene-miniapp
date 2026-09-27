/**
 * OG 이미지(1200x630 PNG)를 Chrome headless 스크린샷으로 만든다 (Node 전용, 배포되지 않음).
 * 웹폰트(Pretendard/Jua/M PLUS Rounded 1c)를 CDN에서 불러오므로 네트워크가 필요하다.
 *
 *   const { shoot } = require('../../../tools/lib/og-shot');
 *   shoot('<html>...</html>', '/abs/out.png');
 *
 * Chrome 경로는 CHROME_BIN 환경변수로 바꿀 수 있다.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME =
  process.env.CHROME_BIN ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(
    (p) => fs.existsSync(p)
  );

const W = 1200;
const H = 630;

function shoot(html, outPng) {
  if (!CHROME) throw new Error('Chrome을 찾을 수 없다. CHROME_BIN 환경변수로 경로를 지정하세요.');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));
  const htmlPath = path.join(tmpDir, 'card.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.mkdirSync(path.dirname(outPng), { recursive: true });
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${W},${H}`,
      '--virtual-time-budget=8000',
      `--screenshot=${outPng}`,
      `file://${htmlPath}`,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] }
  );
  fs.rmSync(tmpDir, { recursive: true, force: true });
  if (!fs.existsSync(outPng)) throw new Error(`스크린샷 실패: ${outPng}`);
  return outPng;
}

// argv 로 받은 언어 목록 (없으면 기본 언어를 뺀 전부 — 기존 ko 이미지는 건드리지 않는다)
function langsFromArgv(LOCALES, DEFAULT_LOCALE) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  if (args.includes('all')) return LOCALES.map((l) => l.code);
  if (args.length) return args;
  return LOCALES.map((l) => l.code).filter((c) => c !== DEFAULT_LOCALE);
}

module.exports = { shoot, langsFromArgv, W, H };
