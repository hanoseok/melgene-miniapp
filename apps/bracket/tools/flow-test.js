#!/usr/bin/env node
/**
 * 토너먼트 대진표 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/bracket) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다.
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 대진 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음) → 1개만 넣고 만들기(오류, start 0)
 *   → 7줄(중복 1개 포함 → 6개)·제목·랜덤·한 판씩 → 만들기(start 1, 광고 안 보임, 맞대결 보임, 라운드 3개, bye 2)
 *   → 맞대결 카드로 끝까지(5경기, 진행 문구) → 우승(done 1, 끝 화면 순서, 우승자 ∈ 항목, 넘침 없음)
 *   → 되돌리기(우승 숨김) → 다시 고르기(done 그대로 1) → PNG(캔버스 크기) · 글로 복사(클립보드) · 링크
 *   → 링크 새 탭(같은 우승자, start/done 0) · 잘못된 링크 안내 → 새로고침 이어짐(start/done 0)
 *   → 다시 하기(같은 항목 새로 섞기, start 1) → 새 대진표(시작 화면 + 이어 하기)
 *   → 대진표만 모드 5개: 맞대결 숨김, bye 3·고를 수 있는 경기 2개(1라운드 1 + 2라운드 1), 대진표에서 눌러 끝까지(4경기, done 1 — 새로고침 뒤 첫 우승) · 콘솔 오류 0
 *
 * 실행: node tools/flow-test.js                 (en,ja × 360,1440)
 *       node tools/flow-test.js en,th 360,375,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bracket-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ja').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8871, MOCK_PORT = 8872, CDP_PORT = 9871;
const WARP = 1;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  const real = performance.now.bind(performance); const t0 = real(); performance.now = () => t0 + (real() - t0) * ${WARP};
  let hidden = false; Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get() { return hidden; } });
  Object.defineProperty(Document.prototype, 'visibilityState', { configurable: true, get() { return hidden ? 'hidden' : 'visible'; } });
  window.__setHidden = (h) => { hidden = h; document.dispatchEvent(new Event('visibilitychange')); return 1; }; })();`;

class Tab {
  constructor(ws) {
    this.ws = ws; this.n = 0; this.wait = new Map(); this.errors = []; this.onload = null;
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.wait.has(m.id)) { const w = this.wait.get(m.id); this.wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
      if (m.method === 'Runtime.exceptionThrown') this.errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') this.errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon|pagead|googlesyndication|fonts\.g/.test(m.params.entry.url || '')) this.errors.push('log: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
      if (m.method === 'Page.loadEventFired' && this.onload) { const f = this.onload; this.onload = null; f(); }
    };
    ws.onclose = () => { this.wait.forEach((w) => w.rej(new Error('Chrome(CDP) 연결이 끊김'))); this.wait.clear(); };
  }
  send(method, params = {}) { const id = ++this.n; return new Promise((res, rej) => { this.wait.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text);
    return r.result.value;
  }
  loaded() { return new Promise((r) => { this.onload = r; }); }
  async settle() { await this.eval('document.fonts.ready.then(() => 1)'); await sleep(250); }
  async goto(url) { const l = this.loaded(); await this.send('Page.navigate', { url }); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async tap(sel) {
    const r = await this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 30)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await sleep(40);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async type(sel, text) {
    await this.eval(`(() => { const t = document.querySelector(${JSON.stringify(sel)}); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
    await sleep(80);
  }
  async shot(file) {
    if (!SHOTS) return;
    const r = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.mkdirSync(SHOTS, { recursive: true });
    fs.writeFileSync(path.join(SHOTS, file), Buffer.from(r.data, 'base64'));
  }
}
async function openTab(width, reduced) {
  const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const tab = new Tab(ws);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: TRACK_SPY });
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await tab.send('Browser.grantPermissions', { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'], origin: `http://localhost:${HTTP_PORT}` }).catch(() => {});
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
// 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만 — CJK·태국어는 어디서나 줄바꿈 가능)
const TEXT_FIT = `((sel) => {
  const bad = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.getClientRects().length || el.closest('[hidden]')) return;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).textOverflow !== 'ellipsis') bad.push('넘침: ' + (el.textContent || el.placeholder || '').trim().slice(0, 30));
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const re = /[^\\s\\u00a0\\u202f\\-–—]+/g; let m;
      while ((m = re.exec(node.data))) {
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff\\uac00-\\ud7af]/.test(m[0]) || m[0].length > 14) continue;
        const rg = document.createRange(); rg.setStart(node, m.index); rg.setEnd(node, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map((q) => Math.round(q.top)));
        if (lines.size > 1 && getComputedStyle(el).hyphens !== 'auto') bad.push('단어 잘림: ' + m[0]);
      }
    }
  });
  return bad;
})`;
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, play: !document.getElementById('screen-play').hidden, duel: !document.getElementById('duel').hidden, done: !document.getElementById('done').hidden, resume: !document.getElementById('resume').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const ITEMS = ['Pizza', 'Tacos', 'pizza', 'Sushi', 'Ramen', 'Curry udon with extra tempura', 'Pho'];
const CLEAN = ['Pizza', 'Tacos', 'Sushi', 'Ramen', 'Curry udon with extra temp', 'Pho'].map((x) => x.slice(0, 24).trim());

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui, E = T.errors;
  const tag = `[${lang} ${width}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  const overflow = async (where) => { const o = await tab.eval(OVERFLOW); if (o) say(`${where} 가로 넘침 ${o}px`); };

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.play || st.scr.resume || !st.adLast || st.ads !== 1 || st.faq) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  await overflow('시작 화면');
  (await tab.eval(TEXT_FIT + `('.bk-h1, .bk-hook, .bk-btn, .bk-label, .bk-hint, .bk-radio, .bk-fair')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);

  // 2) 1개만 → 오류
  await tab.type('#items', 'Solo');
  await tab.tap('#create-btn');
  const e1 = await tab.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (e1.err !== E.tooFew || !e1.scr.setup || e1.start) say(`1개 오류가 다름 ${JSON.stringify(e1)}`);

  // 3) 7줄(중복 1) → 6개, 제목, 랜덤 + 한 판씩
  await tab.type('#items', ITEMS.join('\n'));
  await tab.type('#title', 'Team Cup');
  const cnt = await tab.eval(`({ c: document.getElementById('items-count').textContent, d: document.getElementById('items-dupes').hidden ? '' : document.getElementById('items-dupes').textContent })`);
  if (cnt.c !== fmt(U.count, { n: 6 }) || cnt.d !== fmt(U.dupes, { d: 1 })) say(`항목 수 표시가 다름 ${JSON.stringify(cnt)}`);
  await tab.tap('#create-btn');
  const pl = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')}, ads: ${VISIBLE_ADS}, title: document.getElementById('ev-title').textContent,
    rounds: [...document.querySelectorAll('#board .bk-round-h')].map((h) => h.textContent), byes: document.querySelectorAll('#board .bk-slot.is-bye').length,
    a: document.getElementById('side-a-name').textContent, b: document.getElementById('side-b-name').textContent, prog: document.getElementById('duel-progress').textContent,
    names: window.BRACKET_APP.state().n })`);
  const want = [U.rQuarter, U.rSemi, U.rFinal];
  if (!pl.scr.play || pl.scr.setup || !pl.scr.duel || pl.scr.done || pl.start !== 1 || pl.ads !== 0 || pl.title !== 'Team Cup') say(`만든 뒤 화면이 다름 ${JSON.stringify(pl)}`);
  if (pl.rounds.join('|') !== want.join('|') || pl.byes !== 2 || pl.prog !== fmt(U.matchOf, { k: 1, n: 5 })) say(`대진표가 다름 ${JSON.stringify(pl)}`);
  if (pl.names.slice().sort().join('|') !== CLEAN.slice().sort().join('|')) say(`항목이 다름 ${JSON.stringify(pl.names)}`);
  if (!pl.a || !pl.b || pl.a === pl.b) say(`맞대결 이름 ${pl.a} / ${pl.b}`);
  await overflow('대진 화면');
  (await tab.eval(TEXT_FIT + `('.bk-side-name, .bk-btn, .bk-duel-round, .bk-duel-progress, .bk-round-h')`)).forEach((w) => say(`대진 화면 ${w}`));
  await tab.shot(`${lang}-${width}-2-duel.png`);

  // 4) 맞대결로 끝까지
  let picks = 0;
  while (picks < 10 && await tab.eval(`!document.getElementById('duel').hidden`)) {
    await tab.tap(picks % 2 ? '#side-b' : '#side-a');
    await sleep(320);
    picks++;
  }
  const dn = await tab.eval(`({ scr: ${SCREENS}, done: ${COUNT('done')}, end: ${END_ORDER}, champ: document.getElementById('champ-name').textContent, boardChamp: document.querySelector('.bk-board-champ-n').textContent })`);
  if (picks !== 5 || !dn.scr.done || dn.scr.duel || dn.done !== 1 || dn.end.join() !== ORDER || !CLEAN.includes(dn.champ) || dn.boardChamp !== dn.champ) say(`우승이 다름 (경기 ${picks}) ${JSON.stringify(dn)}`);
  await overflow('우승 화면');
  await tab.shot(`${lang}-${width}-3-done.png`);

  // 5) 되돌리기 → 다시 고르기 (done 은 한 번만)
  await tab.tap('#undo-btn');
  const un = await tab.eval(`({ scr: ${SCREENS} })`);
  if (un.scr.done || !un.scr.duel) say(`되돌리기 뒤가 다름 ${JSON.stringify(un)}`);
  await tab.tap('#side-a'); await sleep(320);
  const dn2 = await tab.eval(`({ scr: ${SCREENS}, done: ${COUNT('done')}, champ: document.getElementById('champ-name').textContent })`);
  if (!dn2.scr.done || dn2.done !== 1) say(`다시 고른 뒤 done 이 다름 ${JSON.stringify(dn2)}`);
  const champ = dn2.champ;

  // 6) PNG · 글로 복사 · 링크
  const png = await tab.eval(`window.BRACKET_APP.png()`);
  if (!png || png.w < 600 || png.h < 300 || png.data < 5000) say(`PNG 가 이상함 ${JSON.stringify(png)}`);
  await tab.tap('#png-btn'); await sleep(300);
  await tab.tap('#text-btn'); await sleep(150);
  const clip = await tab.eval(`navigator.clipboard.readText().catch(() => '')`);
  const txt = await tab.eval(`window.BRACKET_APP.text()`);
  if (!txt.includes('Team Cup') || !txt.includes(U.champion + ': ' + champ) || !txt.includes(U.rFinal)) say(`글로 복사 내용이 다름: ${txt.slice(0, 80)}`);
  if (clip && clip !== txt) say('클립보드가 글과 다름');
  const url = await tab.eval(`window.BRACKET_APP.link()`);
  if (!/#d=[A-Za-z0-9_-]+$/.test(url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru|_l)\//.test(new URL(url).pathname)) say(`링크가 다름 ${url.slice(0, 80)}`);

  // 7) 링크 새 탭
  const tab2 = await openTab(width);
  await tab2.goto(`http://localhost:${HTTP_PORT}/#nolang`);
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto(base + new URL(url).hash);
  const l1 = await tab2.eval(`({ scr: ${SCREENS}, champ: document.getElementById('champ-name').textContent, start: ${COUNT('start')}, done: ${COUNT('done')}, hash: location.hash })`);
  if (!l1.scr.play || !l1.scr.done || l1.champ !== champ || l1.start || l1.done || l1.hash) say(`링크로 연 화면이 다름 ${JSON.stringify(l1)}`);
  await tab2.tap('#undo-btn').catch(() => {});
  await tab2.goto(base + '#d=abc$$');
  const bl = await tab2.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS} })`);
  if (bl.err !== E.badLink || !bl.scr.setup) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
  tab2.errors.forEach((e) => say('콘솔 오류(링크): ' + e));
  await tab2.send('Page.close').catch(() => {});

  // 8) 새로고침 이어짐
  await tab.goto(base);
  const rl = await tab.eval(`({ scr: ${SCREENS}, champ: document.getElementById('champ-name').textContent, start: ${COUNT('start')}, done: ${COUNT('done')} })`);
  if (!rl.scr.play || !rl.scr.done || rl.champ !== champ || rl.start || rl.done) say(`새로고침 뒤 이어지지 않음 ${JSON.stringify(rl)}`);

  // 9) 다시 하기 = 같은 항목 새로 섞기
  await tab.tap('[data-mg-end] .mg-end-retry');
  const rt = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')}, names: window.BRACKET_APP.state().n, w: window.BRACKET_APP.state().w })`);
  if (!rt.scr.duel || rt.scr.done || rt.start !== 1 || rt.names.slice().sort().join() !== CLEAN.slice().sort().join() || /[01]/.test(rt.w)) say(`다시 하기가 다름 ${JSON.stringify(rt)}`);

  // 10) 새 대진표 → 시작 화면 + 이어 하기
  await tab.tap('#new-btn');
  const nb = await tab.eval(`({ scr: ${SCREENS}, items: document.getElementById('items').value, ads: ${VISIBLE_ADS} })`);
  if (!nb.scr.setup || nb.scr.play || !nb.scr.resume || nb.items !== ITEMS.join('\n') || nb.ads !== 1) say(`새 대진표 화면이 다름 ${JSON.stringify(nb)}`);

  // 11) 대진표만 모드, 5개 → 대진표에서 눌러 끝까지
  await tab.type('#items', 'Ann\nBo\nCy\nDee\nEve');
  await tab.tap('#mode-d');
  await tab.tap('#create-btn');
  const d0 = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')}, btns: document.querySelectorAll('#board .bk-slot-btn').length, byes: document.querySelectorAll('#board .bk-slot.is-bye').length })`);
  if (!d0.scr.play || d0.scr.duel || d0.start !== 2 || d0.btns !== 4 || d0.byes !== 3) say(`대진표만 모드가 다름 ${JSON.stringify(d0)}`);
  await tab.shot(`${lang}-${width}-4-draw.png`);
  let taps = 0;
  while (taps < 8 && !(await tab.eval(`!document.getElementById('done').hidden`))) {
    await tab.tap('#board .bk-match:not(:has(.is-win)) .bk-slot-btn');
    taps++;
  }
  const d1 = await tab.eval(`({ scr: ${SCREENS}, done: ${COUNT('done')}, champ: document.getElementById('champ-name').textContent })`);
  if (taps !== 4 || !d1.scr.done || d1.done !== 1 || !['Ann', 'Bo', 'Cy', 'Dee', 'Eve'].includes(d1.champ)) say(`대진표만 모드 우승이 다름 (누름 ${taps}) ${JSON.stringify(d1)}`);
  await overflow('대진표만 우승');

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bracket-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 토너먼트 대진표 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}] 시작 화면 · 1개 오류 · 6개(중복 제거) 한 판씩 → 우승·끝 화면 · 되돌리기 · PNG·글·링크 · 링크 새 탭·잘못된 링크 · 새로고침 · 다시 하기 · 새 대진표 · 대진표만 모드`);
    }
  } finally {
    chrome.kill(); mock.kill(); server.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(`\n흐름 ${runs}회, 문제 ${problems}건`);
  if (problems) { console.log('결과: FAIL'); process.exit(1); }
  console.log('결과: PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
