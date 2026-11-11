#!/usr/bin/env node
/**
 * 벌칙 카드 뒤집기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/penalty) + tools/mock-supa.js (운영 DB 안 씀).
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않는다).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1, 설정 숨김, 맨 끝 mg-ad-start, 벌칙 문구 안 보임) → 시작 → 설정(인원 4, 벌칙 자동 1 → 2)
 *   → 카드 섞기(track start 1) → 카드 한 장 뒤집기(결과 한 줄) → 나머지 뒤집기 → 결과 보기(track done 1)
 *   → 끝 화면(요약·목록, 공통 끝 화면 retry 버튼, FAQ) → 결과 링크 복사(#d=) → 링크 열기(공유 배지, 기록 없음, 같은 결과)
 *   → 360px 가로 넘침 없음, 콘솔 오류 0.
 *
 * 실행: node tools/flow-test.js                    (en,ko × 360,1440)
 *       node tools/flow-test.js en,ja 360 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8791, MOCK_PORT = 8792, CDP_PORT = 9791;
const BASE = `http://127.0.0.1:${HTTP_PORT}`;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const INIT = `(() => {
  try { localStorage.setItem('mg_supa_url', 'http://127.0.0.1:${MOCK_PORT}'); } catch (e) {}
  window.__tracks = [];
  let fn = null;
  Object.defineProperty(window, 'track', { configurable: true,
    set(v) { fn = v; },
    get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
})();`;

let failures = 0;
const results = [];
function check(cond, msg) {
  const line = (cond ? '  ok   ' : '  FAIL ') + msg;
  results.push(line);
  console.log(line);
  if (!cond) failures++;
}

function startProc(cmd, args) {
  const p = spawn(cmd, args, { stdio: 'ignore' });
  return p;
}

async function waitHttp(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r) return true; } catch (e) { /* 아직 */ }
    await sleep(250);
  }
  return false;
}

async function main() {
  const http = startProc('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1', '--directory', SITE]);
  const mock = startProc(process.execPath, [path.join(SITE, '..', '..', 'tools', 'mock-supa.js'), String(MOCK_PORT)]);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'penalty-flow-'));
  const chrome = startProc(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--no-sandbox', 'about:blank']);
  try {
    if (!(await waitHttp(`${BASE}/index.html`))) throw new Error('http.server 가 뜨지 않았다');
    if (!(await waitHttp(`http://127.0.0.1:${CDP_PORT}/json/version`))) throw new Error('Chrome CDP 가 뜨지 않았다');
    const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

    let seq = 0;
    const pending = new Map();
    const errors = [];
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
      if (m.method === 'Runtime.exceptionThrown') errors.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console: ' + m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/ERR_|Failed to load resource/.test(m.params.entry.text)) errors.push('log: ' + m.params.entry.text);
    };
    const send = (method, params = {}) => new Promise((res, rej) => {
      const id = ++seq;
      pending.set(id, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result)));
      ws.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    };
    const waitFor = async (expr, what, timeout = 10000) => {
      const t0 = Date.now();
      while (Date.now() - t0 < timeout) {
        try { if (await evaluate(expr)) return true; } catch (e) { /* 아직 */ }
        await sleep(120);
      }
      throw new Error('기다림 실패: ' + what);
    };
    const click = (sel) => evaluate(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) throw new Error('없음: ${sel}'); e.click(); return true; })()`);

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Log.enable');
    await send('Page.addScriptToEvaluateOnNewDocument', { source: INIT });

    for (const width of WIDTHS) {
      for (const lang of LANGS) {
        const tag = `[${lang} ${width}px]`;
        console.log(`\n${tag}`);
        errors.length = 0;
        await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 1, mobile: width < 768 });
        const url = lang === 'en' ? `${BASE}/index.html` : `${BASE}/${lang}/index.html`;
        await send('Page.navigate', { url: `${BASE}/index.html?reset=${Date.now()}` });
        await waitFor('document.readyState === "complete"', 'load');
        await evaluate('localStorage.clear(); true'); // 언어마다 처음 방문처럼
        await send('Page.navigate', { url });
        await waitFor('document.readyState === "complete" && !!document.getElementById("go-setup")', 'start screen');
        await sleep(300);

        // 시작 화면
        const startInfo = await evaluate(`(() => ({
          h1: document.querySelectorAll('h1').length,
          setupHidden: document.getElementById('screen-setup').hidden,
          adStart: document.querySelectorAll('.mg-ad-start').length,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        }))()`);
        check(startInfo.h1 === 1, `${tag} 시작 화면 h1 1개`);
        check(startInfo.setupHidden === true, `${tag} 시작 화면에서 설정은 숨김`);
        check(startInfo.adStart === 1, `${tag} 시작 화면 광고 자리 1개`);
        check(!startInfo.overflow, `${tag} 시작 화면 가로 넘침 없음`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-start.png`));

        // 설정 → 인원 4, 벌칙 자동(1) → 한 장 더 → 2
        await click('#go-setup');
        await waitFor('!document.getElementById("screen-setup").hidden', 'setup');
        await click('#players-dec');
        await click('#players-dec');
        const autoPen = await evaluate('document.getElementById("penalties").value');
        check(autoPen === '1', `${tag} 4명이면 벌칙 자동 1장 (실제 ${autoPen})`);
        await click('#penalties-inc');
        check((await evaluate('document.getElementById("penalties").value')) === '2', `${tag} 벌칙 한 장 늘리면 2장`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-setup.png`));

        // 섞기 → 시작 기록 1
        await click('#shuffle-btn');
        await waitFor('!document.getElementById("screen-flip").hidden', 'flip');
        check((await evaluate('window.__tracks.filter(e => e === "start").length')) === 1, `${tag} 시작 기록 1번`);
        check((await evaluate('document.querySelectorAll(".pn-card-btn").length')) === 4, `${tag} 카드 4장 격자`);
        check((await evaluate('document.getElementById("see-results").hidden')) === true, `${tag} 아직 결과 보기 숨김`);

        // 한 장 뒤집기 → 결과 한 줄 채워짐, 다시 섞기 막힘
        await click('.pn-card-btn[data-pos="2"]');
        const oneFlip = await evaluate('({ open: document.querySelectorAll(".pn-card-btn.is-open").length, reveal: document.getElementById("reveal").textContent, reshuffleDisabled: document.getElementById("reshuffle").disabled })');
        check(oneFlip.open === 1, `${tag} 한 장만 뒤집힘`);
        check(oneFlip.reveal.length > 0, `${tag} 결과 한 줄 표시: ${oneFlip.reveal}`);
        check(oneFlip.reshuffleDisabled === true, `${tag} 한 장 뒤집은 뒤 다시 섞기 막힘`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-flip.png`));
        await click('.pn-card-btn[data-pos="2"]'); // 이미 뒤집은 카드는 무시
        check((await evaluate('document.querySelectorAll(".pn-card-btn.is-open").length')) === 1, `${tag} 같은 카드 다시 눌러도 변화 없음`);

        // 나머지 한꺼번에 뒤집기
        await click('#flip-all');
        await waitFor('!document.getElementById("see-results").hidden', 'see results');
        check((await evaluate('document.querySelectorAll(".pn-card-btn.is-open").length')) === 4, `${tag} 한꺼번에 뒤집기 후 4장 모두`);
        check((await evaluate('window.__tracks.filter(e => e === "done").length')) === 0, `${tag} 결과 보기 전에는 완료 기록 없음`);

        // 결과 보기 → 끝 화면, 완료 기록 1
        await click('#see-results');
        await waitFor('!document.getElementById("screen-end").hidden', 'end');
        check((await evaluate('window.__tracks.filter(e => e === "done").length')) === 1, `${tag} 완료 기록 1번`);
        const endInfo = await evaluate(`(() => ({
          penalties: document.querySelectorAll('.pn-item').length,
          summary: document.getElementById('summary').textContent,
          endSlot: document.querySelectorAll('[data-mg-end="penalty"]').length,
          retry: !!document.querySelector('.mg-end-retry'),
          faq: !!document.querySelector('.mg-end-faq'),
          shareBtns: document.querySelectorAll('.mg-end .mg-share-btn').length,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        }))()`);
        check(!(await evaluate('!document.getElementById("shared-badge").hidden')), `${tag} 내 결과에는 공유 배지가 안 보임`);
        check(endInfo.penalties === 2, `${tag} 끝 화면 벌칙 목록 2명 (실제 ${endInfo.penalties})`);
        check(endInfo.summary.length > 0, `${tag} 요약 한 줄: ${endInfo.summary}`);
        check(endInfo.retry, `${tag} 공통 끝 화면 다시 하기 버튼`);
        check(endInfo.faq, `${tag} 공통 끝 화면 FAQ`);
        check(endInfo.shareBtns >= 4, `${tag} 공유 버튼 ${endInfo.shareBtns}개`);
        check(!endInfo.overflow, `${tag} 끝 화면 가로 넘침 없음`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-end.png`));

        // 결과 링크 → 새로 열기 = 공유 결과 (기록 없음, 같은 벌칙 목록)
        const link = await evaluate('window.PENALTY_APP.link()');
        check(/#d=[A-Za-z0-9_-]+$/.test(link), `${tag} 결과 링크 형식`);
        const before = await evaluate('JSON.stringify(window.PENALTY_APP.last().results.map(x => x.text))');
        await evaluate('window.__tracks = []; true');
        await send('Page.navigate', { url: link });
        await waitFor('!document.getElementById("screen-end").hidden && !!document.querySelector(".pn-item")', 'shared end');
        const shared = await evaluate(`({
          badge: !document.getElementById('shared-badge').hidden,
          texts: JSON.stringify(window.PENALTY_APP.last().results.map(x => x.text)),
          tracks: window.__tracks.length
        })`);
        check(shared.badge, `${tag} 공유 배지 보임`);
        check(shared.texts === before, `${tag} 공유 링크가 같은 결과를 보여 줌`);
        check(shared.tracks === 0, `${tag} 공유로 본 결과는 기록하지 않음`);
        await click('.mg-end-retry');
        await waitFor('!document.getElementById("screen-setup").hidden', 'back to setup');
        check((await evaluate('location.hash')) === '', `${tag} 나도 해 보기 → 설정 화면, 주소의 결과 조각 지움`);

        // 잘못된 링크
        await send('Page.navigate', { url: `${BASE}/index.html#d=zzz` });
        await waitFor('!document.getElementById("screen-setup").hidden && !document.getElementById("error").hidden', 'bad link');
        check((await evaluate('document.getElementById("error").textContent')).length > 0, `${tag} 깨진 링크는 안내 문구`);

        check(errors.length === 0, `${tag} 콘솔 오류 0 ${errors.length ? '(' + errors.slice(0, 3).join(' | ') + ')' : ''}`);
      }
    }
    ws.close();
  } finally {
    chrome.kill();
    http.kill();
    mock.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(failures ? `\n흐름 검사 실패 ${failures}건` : '\n흐름 검사 모두 통과');
  process.exit(failures ? 1 : 0);
}

async function shot(send, file) {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

main().catch((e) => {
  console.error('흐름 검사 오류:', e.message);
  process.exit(1);
});
