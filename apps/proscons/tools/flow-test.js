#!/usr/bin/env node
/**
 * 장단점 저울 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/proscons) + tools/mock-supa.js (운영 DB 안 씀).
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다.
 * 언어 × 화면 폭마다:
 *   시작 화면(h1, 저울판·끝 숨김, 맨 끝 mg-ad-start, 넘침 없음) → 고민 입력 → 저울판(광고 없음)
 *   → 무게 없이 판정 누르면 안내 → 칩으로 항목 시작 → 장점 2·단점 1 추가(track start 1) → 무게 바꾸기 → 저울 기울기(움직임 줄이기 = 바로)
 *   → 판정(track done 1, 점수 차이·%·무거운 이유·공통 끝 화면) → 공유 링크(#d=) 열기(읽기 전용, 기록 없음, 같은 판정)
 *   → 사본 고치기 → 편집 가능 · 주소 #d= 지움 → A/B 모드 → 동점 → 동전 던지기 → PNG 카드 그리기
 *   → 새로 고침하면 초안 복원(localStorage) → 깨진 링크 안내 → 꺾쇠가 HTML 로 해석되지 않음 → 콘솔 오류 0.
 *
 * 실행: node tools/flow-test.js                    (en,ko,th,ru × 360,375)
 *       node tools/flow-test.js en,ja 360 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8831, MOCK_PORT = 8832, CDP_PORT = 9831;
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
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'proscons-flow-'));
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
    const type = (sel, text) => evaluate(`(() => { const t = document.querySelector(${JSON.stringify(sel)}); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
    const addPoint = async (key, text) => {
      await type(`.pc-add-input[data-key="${key}"]`, text);
      await evaluate(`document.querySelector('.pc-add[data-key="${key}"]').requestSubmit(); true`);
    };
    const tracks = (e) => evaluate(`window.__tracks.filter(x => x === ${JSON.stringify(e)}).length`);

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
        await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        const url = lang === 'en' ? `${BASE}/index.html` : `${BASE}/${lang}/index.html`;
        await send('Page.navigate', { url: `${BASE}/index.html?reset=${Date.now()}` });
        await waitFor('document.readyState === "complete"', 'load');
        await evaluate('localStorage.clear(); true');
        await send('Page.navigate', { url });
        await waitFor('document.readyState === "complete" && !!document.getElementById("go-btn")', 'start screen');
        await sleep(400);

        // 시작 화면
        const s0 = await evaluate(`({ h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang,
          ad: document.querySelectorAll('.mg-ad-start').length,
          adLast: document.getElementById('screen-start').lastElementChild.classList.contains('mg-ad-start') })`);
        check(s0.h1 === 1 && s0.lang === lang, `${tag} 시작 화면 h1 1개, lang=${s0.lang}`);
        check(s0.ad === 1 && s0.adLast, `${tag} 시작 화면 맨 끝 mg-ad-start`);
        check((await hidden('screen-board')) && (await hidden('screen-end')), `${tag} 저울판·끝 화면 숨김`);
        check(!(await overflow()), `${tag} 시작 화면 가로 넘침 없음`);
        await click('#mode-ab');
        check(!(await hidden('ab-names')) && !(await overflow()), `${tag} A/B 모드: 이름 칸 보임, 넘침 없음`);
        await click('#mode-s');
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-start.png`));

        await type('#q', 'Move <b>abroad</b>?');
        await click('#go-btn');
        await waitFor('!document.getElementById("screen-board").hidden', 'board');
        check((await evaluate('document.querySelectorAll("#screen-board .mg-ad").length')) === 0, `${tag} 저울판에 광고 없음`);
        check((await evaluate('document.getElementById("bd-title").textContent')).indexOf('abroad') > 0 && (await evaluate('document.querySelectorAll("#bd-title b").length')) === 0, `${tag} 고민 글은 textContent(꺾쇠 정리)`);
        await click('#weigh-btn');
        check(!(await hidden('bd-error')) && (await hidden('screen-end')), `${tag} 항목 없이 판정 → 안내`);
        check((await tracks('start')) === 0, `${tag} 항목 없으면 start 기록 없음`);

        // 칩 → 장점 입력칸에 주제 넣기
        await evaluate('document.querySelector(\'.pc-add-input[data-key="p"]\').focus(); true');
        await click('.pc-chip[data-chip="0"]');
        const chipVal = await evaluate('document.querySelector(\'.pc-add-input[data-key="p"]\').value');
        check(chipVal.length > 0 && chipVal.indexOf(await evaluate('PAGE_I18N.board.chips[0]')) === 0, `${tag} 칩을 누르면 입력칸에 주제가 들어감 "${chipVal}"`);
        await evaluate(`(() => { const t = document.querySelector('.pc-add-input[data-key="p"]'); t.value = t.value + 'cheaper rent'; return true; })()`);
        await evaluate('document.querySelector(\'.pc-add[data-key="p"]\').requestSubmit(); true');
        check((await tracks('start')) === 1, `${tag} 첫 항목에서 start 1번`);
        await addPoint('p', 'New friends');
        await addPoint('c', 'Far from family');
        check((await tracks('start')) === 1, `${tag} 항목을 더 넣어도 start 는 1번`);
        // 무게: 장점 2개 기본 2 → 단점 하나 3 으로
        await click('.pc-dot[data-key="c"][data-idx="0"][data-w="3"]');
        const sc = await evaluate('({ st: window.PROSCONS_APP.state(), a: window.PROSCONS_APP.angle(), t: window.PROSCONS_APP.target(), l: document.querySelector("#sc-pan-l .pc-pan-num").textContent, r: document.querySelector("#sc-pan-r .pc-pan-num").textContent })');
        check(sc.st.l.c[0][0] === 3 && sc.l === '4' && sc.r === '3', `${tag} 무게 바꾸면 접시 숫자 4 : 3`);
        check(sc.t < 0 && sc.a === sc.t, `${tag} 저울이 장점 쪽(왼쪽)으로 기욺, 움직임 줄이기 = 바로 (${sc.a})`);
        check(!(await overflow()), `${tag} 저울판 가로 넘침 없음`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-board.png`));

        await click('#weigh-btn');
        await waitFor('!document.getElementById("screen-end").hidden', 'end');
        check((await tracks('done')) === 1, `${tag} 판정에서 done 1번`);
        const e1 = await evaluate(`({ v: document.getElementById('res-verdict').textContent,
          cls: document.getElementById('res-verdict').className,
          topL: document.querySelectorAll('#top-l .pc-top-item').length, topR: document.querySelectorAll('#top-r .pc-top-item').length,
          badge: !document.getElementById('shared-badge').hidden, tie: !document.getElementById('tie-box').hidden,
          retry: (document.querySelector('.mg-end-retry') || {}).textContent || '',
          faq: !!document.querySelector('.mg-end-faq'), share: document.querySelectorAll('.mg-end .mg-share-btn').length })`);
        check(/1/.test(e1.v) && /57/.test(e1.v) && /is-left/.test(e1.cls), `${tag} 판정: 장점 1점 차이 57% "${e1.v}"`);
        check(e1.topL === 2 && e1.topR === 1, `${tag} 무거운 이유 2 / 1`);
        check(!e1.badge && !e1.tie, `${tag} 내 결과: 공유 배지·동점 상자 없음`);
        check(e1.retry.length > 0 && e1.faq && e1.share >= 4, `${tag} 공통 끝 화면(다시 하기 "${e1.retry}"·FAQ·공유 ${e1.share})`);
        check(!(await overflow()), `${tag} 끝 화면 가로 넘침 없음`);
        check((await evaluate('window.PROSCONS_APP.card()')) > 1000, `${tag} PNG 카드 그리기`);
        if (SHOTS) await shot(send, path.join(SHOTS, `${lang}-${width}-end.png`));

        // 공유 링크 → 읽기 전용, 기록 없음
        const link = await evaluate('window.PROSCONS_APP.link()');
        check(/#d=[A-Za-z0-9_-]+$/.test(link) && !/\/(ko|th|ja|ru)\//.test(link.replace(BASE, '')), `${tag} 공유 링크 형식(#d=, 언어 경로 없음)`);
        await evaluate('window.__tracks = []; true');
        await send('Page.navigate', { url: link });
        await waitFor('!document.getElementById("screen-board").hidden && window.PROSCONS_APP.shared()', 'shared board');
        const sh = await evaluate(`({ badge: !document.getElementById('ro-badge').hidden, inputs: document.querySelectorAll('.pc-add-input').length,
          xs: document.querySelectorAll('.pc-x').length, ideas: document.getElementById('ideas').hidden,
          copy: !document.getElementById('copy-edit-btn').hidden, items: document.querySelectorAll('.pc-item').length })`);
        check(sh.badge && sh.inputs === 0 && sh.xs === 0 && sh.ideas && sh.copy && sh.items === 3, `${tag} 공유 저울: 읽기 전용(입력·삭제 없음) + 사본 고치기`);
        await click('#weigh-btn');
        await waitFor('!document.getElementById("screen-end").hidden', 'shared end');
        // 공유 링크는 언어 없는 주소(= 봇 UA 에서는 en) — 숫자로 비교
        check(/57/.test(await evaluate('document.getElementById("res-verdict").textContent')) && /is-left/.test(await evaluate('document.getElementById("res-verdict").className')) && !(await hidden('shared-badge')), `${tag} 공유 저울 판정이 같음(57%, 장점) + 배지`);
        check((await evaluate('window.__tracks.length')) === 0, `${tag} 공유 저울을 보기만 하면 기록 없음`);
        await click('#edit-btn');
        await waitFor('!document.getElementById("screen-board").hidden && !window.PROSCONS_APP.shared()', 'edit copy');
        check((await evaluate('location.hash')) === '' && (await evaluate('document.querySelectorAll(".pc-add-input").length')) === 2, `${tag} 사본 고치기 → 편집 가능, #d= 지움`);

        // A/B 모드 → 동점 → 동전
        await click('#back-btn');
        await waitFor('!document.getElementById("screen-start").hidden', 'back to start');
        await click('#fresh-btn');
        await click('#mode-ab');
        await type('#name-a', 'Tokyo');
        await type('#name-b', 'Seoul');
        await type('#q', '');
        await click('#go-btn');
        await waitFor('!document.getElementById("screen-board").hidden', 'ab board');
        check((await evaluate('document.querySelectorAll(".pc-add-input").length')) === 4, `${tag} A/B 모드: 목록 4개`);
        await addPoint('ap', 'Food');
        await addPoint('bp', 'Friends');
        check((await evaluate('document.getElementById("bd-title").textContent')).indexOf('Tokyo') >= 0, `${tag} A/B 기본 제목에 선택지 이름`);
        check(!(await overflow()), `${tag} A/B 저울판 넘침 없음`);
        await click('#weigh-btn');
        await waitFor('!document.getElementById("screen-end").hidden', 'tie end');
        check(!(await hidden('tie-box')), `${tag} 동점이면 동전 상자`);
        await click('#flip-btn');
        await waitFor('!document.getElementById("coin").hidden && /Tokyo|Seoul/.test(document.getElementById("coin").textContent)', 'coin');
        check(true, `${tag} 동전 결과: ${await evaluate('document.getElementById("coin").textContent')}`);
        await click('#edit-btn');
        await addPoint('ac', 'Pricey');
        await click('#weigh-btn');
        await waitFor('!document.getElementById("screen-end").hidden', 'ab end');
        const v2 = await evaluate('document.getElementById("res-verdict").textContent');
        check(/Seoul/.test(v2) && /is-right/.test(await evaluate('document.getElementById("res-verdict").className')), `${tag} A의 단점은 B 쪽 무게: "${v2}"`);
        check((await evaluate('document.querySelectorAll("#top-r .pc-tag").length')) === 2, `${tag} A/B 이유에 선택지 표시`);

        // 새로 고침 → 초안 복원
        await send('Page.navigate', { url });
        await waitFor('!document.getElementById("screen-start").hidden', 'reload');
        const st = await evaluate('window.PROSCONS_APP.state()');
        check(st.m === 'ab' && st.a === 'Tokyo' && st.l.ac.length === 1 && !(await hidden('draft-row')), `${tag} 새로 고침 후 초안 복원(localStorage)`);

        // 깨진 링크
        await send('Page.navigate', { url: `${BASE}/index.html?x=${Date.now()}#d=zzz` });
        await waitFor('!document.getElementById("screen-start").hidden && !document.getElementById("error").hidden', 'bad link');
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
