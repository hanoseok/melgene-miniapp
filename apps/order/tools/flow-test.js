#!/usr/bin/env node
/**
 * 순서 정하기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/order) + tools/mock-supa.js (운영 DB 안 씀).
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다.
 * 언어 × 화면 폭마다:
 *   첫 화면(h1, 공개·끝 숨김, 맨 끝 mg-ad-start, 넘침 없음) → 이름 2명 미만 오류 → 이름 5명 + 게임 프리셋 + 마지막부터
 *   → 섞기(track start 1, 공개 화면 광고 없음) → 카드 2장(마지막 자리부터) → 자동 공개 → 전체 순서(track done 1)
 *   → 끝 화면(5명, 같은 순서, 프리셋 제목, retry·FAQ·공유 버튼) → 링크(#r=) 열기(공유 배지, 기록 없음, 같은 순서)
 *   → 다시 섞기/나도 하기 → 입력 화면에 같은 이름 → 번호 모드 7개 → 한 번에 보기 → 끝 화면 7개
 *   → 새로 고침하면 마지막 입력 복원(localStorage) → 깨진 링크 안내 → 콘솔 오류 0.
 *
 * 실행: node tools/flow-test.js                    (en,ko,th × 360,375)
 *       node tools/flow-test.js en,ja 360 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,375').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8811, MOCK_PORT = 8812, CDP_PORT = 9811;
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
function check(cond, msg) {
  console.log((cond ? '  ok   ' : '  FAIL ') + msg);
  if (!cond) failures++;
}

async function waitHttp(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r) return true; } catch (e) { /* 아직 */ }
    await sleep(250);
  }
  return false;
}

async function main() {
  const http = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1', '--directory', SITE], { stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(SITE, '..', '..', 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'order-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--no-sandbox', 'about:blank'], { stdio: 'ignore' });
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
    const overflow = () => evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth + 1');
    const hidden = (id) => evaluate(`document.getElementById(${JSON.stringify(id)}).hidden`);

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
        await evaluate('localStorage.clear(); true');
        await send('Page.navigate', { url });
        await waitFor('document.readyState === "complete" && !!document.getElementById("shuffle-btn")', 'input screen');
        await sleep(400);

        // 첫 화면(입력)
        const s0 = await evaluate(`({ h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang,
          ad: document.querySelectorAll('.mg-ad-start').length,
          adLast: document.getElementById('screen-input').lastElementChild.classList.contains('mg-ad-start') })`);
        check(s0.h1 === 1 && s0.lang === lang, `${tag} 첫 화면 h1 1개, lang=${s0.lang}`);
        check(s0.ad === 1 && s0.adLast, `${tag} 첫 화면 맨 끝 mg-ad-start`);
        check((await hidden('screen-reveal')) && (await hidden('screen-end')), `${tag} 공개·끝 화면 숨김`);
        check(!(await overflow()), `${tag} 첫 화면 가로 넘침 없음`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-input.png`));

        // 이름 1명 → 오류, 섞이지 않음
        await evaluate(`(() => { const t = document.getElementById('names'); t.value = 'Solo'; t.dispatchEvent(new Event('input')); return true; })()`);
        await click('#shuffle-btn');
        check(!(await hidden('error')) && (await hidden('screen-reveal')), `${tag} 이름 1명이면 오류 안내, 공개 화면 안 열림`);
        check((await evaluate('window.__tracks.length')) === 0, `${tag} 오류일 때 start 기록 없음`);

        // 이름 5명 + 게임 프리셋 + 마지막부터 → 섞기
        const names = ['Ava', '민준', 'ソラ', 'Zoë <b>', 'Олег'];
        await evaluate(`(() => { const t = document.getElementById('names'); t.value = ${JSON.stringify(names.join('\n'))}; t.dispatchEvent(new Event('input')); return true; })()`);
        check((await evaluate('document.getElementById("names-count").textContent')).indexOf('5') >= 0, `${tag} 이름 수 표시`);
        await click('.or-chip[data-preset="2"]');
        await click('#from-last');
        await click('#shuffle-btn');
        await waitFor('!document.getElementById("screen-reveal").hidden', 'reveal');
        check((await evaluate('window.__tracks.filter(e => e === "start").length')) === 1, `${tag} 섞기 누를 때 start 1번`);
        check((await evaluate('document.querySelectorAll("#screen-reveal .mg-ad").length + (document.getElementById("screen-input").hidden ? 0 : 1)')) === 0, `${tag} 공개 화면에 광고 없음(입력 화면 숨김)`);
        const order = await evaluate('window.ORDER_APP.order()');
        check(Array.isArray(order) && order.length === 5 && order.slice().sort().join() === names.map((n) => n.replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim()).sort().join(), `${tag} 섞은 순서는 입력 이름의 순열`);
        const heading = await evaluate('document.getElementById("rv-heading").textContent');
        check(heading.length > 0, `${tag} 공개 화면 제목 = 게임 프리셋: ${heading}`);

        // 마지막 자리부터 2장
        await click('#next-btn');
        const c1 = await evaluate('({ num: document.getElementById("stage-num").textContent, name: document.getElementById("stage-name").textContent })');
        check(c1.num === '5' && c1.name === order[4], `${tag} 마지막부터: 첫 카드는 5번 (${c1.name})`);
        await click('#stage');
        const c2 = await evaluate('document.getElementById("stage-num").textContent');
        check(c2 === '4', `${tag} 카드 탭으로 다음 = 4번`);
        check((await evaluate('document.querySelectorAll("#so-far li").length')) === 2, `${tag} 지금까지 공개 2개`);
        check(!(await overflow()), `${tag} 공개 화면 가로 넘침 없음`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-reveal.png`));
        check((await evaluate('window.__tracks.filter(e => e === "done").length')) === 0, `${tag} 공개 중에는 done 없음`);

        // 자동 공개 → 다 열리면 멈춤
        await click('#auto-btn');
        await waitFor('window.ORDER_APP.shown() === 5', 'auto reveal', 12000);
        check((await evaluate('document.getElementById("auto-btn").getAttribute("aria-pressed")')) === 'false', `${tag} 자동 공개가 끝나면 멈춤`);
        check((await evaluate('document.getElementById("stage-num").textContent')) === '1', `${tag} 마지막 카드는 1번`);
        await click('#next-btn'); // 전체 순서 보기
        await waitFor('!document.getElementById("screen-end").hidden', 'end');
        check((await evaluate('window.__tracks.filter(e => e === "done").length')) === 1, `${tag} 전체 목록에서 done 1번`);
        const e1 = await evaluate(`({ items: Array.from(document.querySelectorAll('#list .or-name')).map(x => x.textContent),
          nums: Array.from(document.querySelectorAll('#list .or-num')).map(x => x.textContent).join(','),
          title: document.getElementById('res-title').textContent,
          badge: !document.getElementById('shared-badge').hidden,
          retry: (document.querySelector('.mg-end-retry') || {}).textContent || '',
          faq: !!document.querySelector('.mg-end-faq'),
          share: document.querySelectorAll('.mg-end .mg-share-btn').length,
          bold: document.querySelectorAll('#list b').length })`);
        check(JSON.stringify(e1.items) === JSON.stringify(order), `${tag} 끝 화면 순서 = 섞은 순서`);
        check(e1.nums === '1,2,3,4,5', `${tag} 번호 1~5`);
        check(e1.title === heading, `${tag} 끝 화면 제목 = 프리셋 제목`);
        check(!e1.badge, `${tag} 내 결과에는 공유 배지 없음`);
        check(e1.retry.length > 0 && e1.faq && e1.share >= 4, `${tag} 공통 끝 화면(다시 하기 "${e1.retry}"·FAQ·공유 ${e1.share})`);
        check(e1.bold === 0, `${tag} 이름의 꺾쇠가 HTML 로 해석되지 않음`);
        check(!(await overflow()), `${tag} 끝 화면 가로 넘침 없음`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-end.png`));
        const text = await evaluate('window.ORDER_APP.text()');
        check(text.split('\n')[1] === `1. ${order[0]}` && /#r=/.test(text), `${tag} 텍스트 복사 내용(1. 이름 … + 링크)`);

        // 공유 링크 → 같은 순서, 기록 없음
        const link = await evaluate('window.ORDER_APP.link()');
        check(/#r=[A-Za-z0-9_-]+$/.test(link) && !/\/(ko|th|ja)\//.test(link.replace(BASE, '')), `${tag} 공유 링크 형식(#r=, 언어 경로 없음)`);
        await evaluate('window.__tracks = []; true');
        await send('Page.navigate', { url: link });
        await waitFor('!document.getElementById("screen-end").hidden && document.querySelectorAll("#list li").length === 5', 'shared end');
        const sh = await evaluate(`({ badge: !document.getElementById('shared-badge').hidden,
          items: Array.from(document.querySelectorAll('#list .or-name')).map(x => x.textContent),
          title: document.getElementById('res-title').textContent, preset2: window.PAGE_I18N.presets[2].heading, tracks: window.__tracks.length,
          edit: document.getElementById('edit-btn').hidden,
          retry: (document.querySelector('.mg-end-retry') || {}).textContent || '' })`);
        check(sh.badge && JSON.stringify(sh.items) === JSON.stringify(order), `${tag} 공유 링크: 배지 + 같은 순서`);
        check(sh.title === sh.preset2, `${tag} 공유 링크: 같은 프리셋(받는 사람 언어) 제목 ${sh.title}`);
        check(sh.tracks === 0, `${tag} 공유로 본 결과는 기록하지 않음`);
        check(sh.edit && sh.retry !== e1.retry, `${tag} 공유 결과 다시 하기 = "${sh.retry}"`);
        await click('.mg-end-retry');
        await waitFor('!document.getElementById("screen-input").hidden', 'adopt shared');
        check((await evaluate('location.hash')) === '', `${tag} 나도 하기 → 주소의 #r= 지움`);
        check((await evaluate('window.ORDER_APP.form().names.split("\\n").length')) === 5, `${tag} 나도 하기 → 같은 이름 5명이 입력 화면에`);

        // 번호 모드 7 → 한 번에 보기
        await click('#mode-numbers');
        check((await hidden('names-box')) && !(await hidden('numbers-box')), `${tag} 번호 모드 전환`);
        await click('#count-dec');
        check((await evaluate('document.getElementById("count").value')) === '7', `${tag} 번호 8 → 7`);
        await click('#shuffle-btn');
        await waitFor('!document.getElementById("screen-reveal").hidden', 'reveal numbers');
        await click('#all-btn');
        await waitFor('!document.getElementById("screen-end").hidden', 'end numbers');
        const nums = await evaluate('window.ORDER_APP.order()');
        check(nums.slice().sort((a, b) => a - b).join() === '1,2,3,4,5,6,7', `${tag} 번호 1~7 의 순열`);
        check((await evaluate('document.querySelectorAll("#list li").length')) === 7, `${tag} 한 번에 보기 → 끝 화면 7개`);
        check((await evaluate('window.__tracks.filter(e => e === "start").length')) === 1 && (await evaluate('window.__tracks.filter(e => e === "done").length')) === 1, `${tag} 새 판 start/done 1번씩`);
        // 다시 섞기(내 결과) → 바로 새 공개
        await click('.mg-end-retry');
        await waitFor('!document.getElementById("screen-reveal").hidden', 'reshuffle');
        check((await evaluate('window.__tracks.filter(e => e === "start").length')) === 2, `${tag} 다시 섞기 → start 다시 1번`);

        // 새로 고침 → 마지막 입력 복원
        await send('Page.navigate', { url });
        await waitFor('!document.getElementById("screen-input").hidden', 'reload');
        const st = await evaluate('window.ORDER_APP.form()');
        check(st.mode === 'numbers' && st.n === 7 && st.preset === 2 && st.from === 'last', `${tag} 새로 고침 후 입력 복원(localStorage)`);

        // 깨진 링크
        await send('Page.navigate', { url: `${BASE}/index.html?x=${Date.now()}#r=zzz` });
        await waitFor('!document.getElementById("screen-input").hidden && !document.getElementById("error").hidden', 'bad link');
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
  const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

main().catch((e) => {
  console.error('흐름 검사 오류:', e.message);
  process.exit(1);
});
