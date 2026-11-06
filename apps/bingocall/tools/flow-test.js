#!/usr/bin/env node
/**
 * 빙고 번호 추첨기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/bingocall) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음). window.confirm 은 늘 확인(true).
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다.
 *
 * 언어 × 폭마다 (움직임 줄이기 — 번호가 바로 나와 빠름):
 *   시작 화면(h1 검색어, 다른 화면 숨김, 맨 끝 mg-ad-start 1개, 광고 1개 보임, FAQ 없음, 넘침·단어 잘림 없음, 기본 = 75볼)
 *   → 직접 범위 1~3(오류, start 0) → 75볼 시작(진행 화면, 광고 0개, 판 75칸, 0/75, start 0)
 *   → 10개 뽑기(start 1, 서로 다름, 판 10칸 켜짐, 지난 번호 5개, 공 = 마지막 번호) → 새로 고침(진행 화면 그대로, 같은 10개)
 *   → 나머지 65개(1~75 순열, done 1, 버튼 = 모두 완료) → 되돌리기(74개, done 그대로 1) → 끝내기(끝 화면: 74 / 전체 75, 끝 화면 순서·FAQ·공유 6·다시 하기 라벨·공유 주소 깨끗함)
 *   → 다시 하기(새 게임 0개, 뽑으면 start +1) → 새 게임(확인 → 시작 화면, 저장된 게임 없음) · 콘솔 오류 0
 * + 움직임 그대로 한 번: 90볼 → 뽑기 누르면 굴러가는 동안 버튼 꺼짐 → 멈추면 번호·판 1칸.
 * + 좁은 화면(360px) 긴 언어(de·ru·vi): 시작·진행 화면 가로 넘침·버튼/칩/스위치 글자 넘침 없음.
 *
 * 실행: node tools/flow-test.js                          (en,ko × 375 + 움직임 + de,ru,vi × 360)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '375').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const NARROW = ['de', 'ru', 'vi'];
const HTTP_PORT = Number(process.env.BC_HTTP_PORT || 9481), MOCK_PORT = Number(process.env.BC_MOCK_PORT || 9482), CDP_PORT = Number(process.env.BC_CDP_PORT || 9981);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  window.confirm = () => true; })();`;

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
  async reload() { const l = this.loaded(); await this.send('Page.reload', {}); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async rect(sel) {
    return this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 20)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
  }
  async tap(sel) {
    const r = await this.rect(sel);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await this.click(r.x + r.w / 2, r.y + r.h / 2);
  }
  async click(x, y) {
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    await sleep(30);
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
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
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
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).textOverflow !== 'ellipsis') bad.push('넘침: ' + (el.textContent || '').trim().slice(0, 30));
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
const SETUP_FIT = `'.bc-h1, .bc-hook, .bc-btn, .bc-mode-name, .bc-mode-desc, .bc-mode-icon, .bc-label, .bc-hint, .bc-fair'`;
const PLAY_FIT = `'.bc-bar .bc-mini, .bc-count, .bc-btn, .bc-switch, .bc-seg-btn, .bc-small, .bc-prev-label, .bc-prev-ball, .bc-ready, .bc-board-title'`;
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const STATE = `JSON.parse(localStorage.getItem('bingocall_state') || 'null')`;
const PLAY = `({ g: BINGOCALL_APP.game(), on: document.querySelectorAll('#board .bc-cell.is-on').length, cells: document.querySelectorAll('#board .bc-cell').length,
  last: document.querySelectorAll('#board .bc-cell.is-last').length, prev: [...document.querySelectorAll('#prev li')].map((l) => l.textContent), num: document.getElementById('ball-num').textContent,
  letter: document.getElementById('ball-letter').textContent, count: document.getElementById('count').textContent, draw: document.getElementById('draw-btn').textContent,
  drawDis: document.getElementById('draw-btn').disabled, undoDis: document.getElementById('undo-btn').disabled, ready: !document.getElementById('ready').hidden })`;

async function checkEnd(tab, T, say) {
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== T.end.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${T.end.again}"`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소가 아님: ${share.url}`);
}
const setVal = (sel, v) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const baseOf = (lang) => `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
async function prepare(tab, base, lang) {
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
}
async function drawN(tab, n) { for (let i = 0; i < n; i++) await tab.tap('#draw-btn'); }

async function runFull(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui, E = T.end;
  const tag = `[${lang} ${width}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = baseOf(lang);
  const tab = await openTab(width, true);
  await prepare(tab, base, lang);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length,
      mode: document.querySelector('.bc-mode[aria-checked="true"]').dataset.mode, custom: !document.getElementById('custom-box').hidden }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.play || st.scr.end || !st.adLast || st.ads !== 1 || st.faq || st.mode !== '75' || st.custom) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${SETUP_FIT})`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);
  // 직접 범위 1~3 → 오류
  await tab.tap('#mode-custom');
  await tab.eval(setVal('#from', '1')); await tab.eval(setVal('#to', '3'));
  await tab.tap('#start-btn');
  const e1 = await tab.eval(`({ err: document.getElementById('error').hidden ? '' : document.getElementById('error').textContent, scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (e1.err !== fmt(T.errors.rangeSmall, { min: 5, n: 3 }) || !e1.scr.setup || e1.start) say(`직접 범위 1~3 인데 ${JSON.stringify(e1)}`);
  // 75볼 시작
  await tab.tap('#mode-75');
  await tab.tap('#start-btn');
  let p = await tab.eval(PLAY);
  const s1 = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, start: ${COUNT('start')}, top: document.querySelectorAll('#board .bc-row-letter').length })`);
  if (!s1.scr.play || s1.ads !== 0 || s1.start !== 0) say(`75볼 시작 뒤 ${JSON.stringify(s1)}`);
  if (p.cells !== 75 || s1.top !== 5 || p.on || p.count !== fmt(U.count, { n: 0, m: 75 }) || p.draw !== U.drawFirst || !p.undoDis || !p.ready || p.num !== '?') say(`진행 화면 처음 모양 ${JSON.stringify({ ...p, g: undefined })}`);
  o = await tab.eval(OVERFLOW); if (o) say(`진행 화면 가로 넘침 ${o}px`);
  // 2) 10개
  await drawN(tab, 10);
  p = await tab.eval(PLAY);
  const d10 = p.g.drawn;
  const last = d10[9];
  const L = last <= 15 ? 'B' : last <= 30 ? 'I' : last <= 45 ? 'N' : last <= 60 ? 'G' : 'O';
  if (d10.length !== 10 || new Set(d10).size !== 10 || p.on !== 10 || p.last !== 1 || p.prev.length !== 5 || p.num !== String(last) || p.letter !== L || p.ready || p.undoDis || p.draw !== U.draw) say(`10개 뒤 ${JSON.stringify({ ...p, g: d10 })}`);
  if (p.prev[0] !== `${d10[8] <= 15 ? 'B' : d10[8] <= 30 ? 'I' : d10[8] <= 45 ? 'N' : d10[8] <= 60 ? 'G' : 'O'} ${d10[8]}`) say(`지난 번호 첫째가 바로 앞 번호가 아님 ${p.prev[0]}`);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`start ${await tab.eval(COUNT('start'))} ≠ 1`);
  if ((await tab.eval(`(${STATE}).game.drawn.length`)) !== 10) say('저장된 게임이 10개가 아님');
  (await tab.eval(TEXT_FIT + `(${PLAY_FIT})`)).forEach((w) => say(`진행 화면 ${w}`));
  o = await tab.eval(OVERFLOW); if (o) say(`진행 화면(10개) 가로 넘침 ${o}px`);
  await tab.shot(`${lang}-${width}-2-play.png`);
  // 3) 새로 고침 → 그대로
  await tab.reload();
  p = await tab.eval(PLAY);
  const rs = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (!rs.scr.play || rs.start || JSON.stringify(p.g.drawn) !== JSON.stringify(d10) || p.on !== 10 || p.num !== String(last)) say(`새로 고침 뒤 ${JSON.stringify({ rs, drawn: p.g.drawn, on: p.on })}`);
  // 4) 나머지 65개
  await drawN(tab, 65);
  p = await tab.eval(PLAY);
  const all = p.g.drawn;
  const perm = all.length === 75 && all.slice().sort((a, b) => a - b).join() === Array.from({ length: 75 }, (_, i) => i + 1).join();
  if (!perm) say(`75개를 다 뽑았는데 1~75 순열이 아님 (${all.length}개, 서로 다른 ${new Set(all).size}개)`);
  if (JSON.stringify(all.slice(0, 10)) !== JSON.stringify(d10)) say('새로 고침 전 10개가 바뀜');
  const dn = await tab.eval(`({ done: ${COUNT('done')}, start: ${COUNT('start')}, auto: document.getElementById('auto').disabled, scr: ${SCREENS} })`);
  if (dn.done !== 1 || dn.start !== 0 || !dn.auto || !dn.scr.play || p.draw !== U.allDone || p.on !== 75) say(`모두 뽑은 뒤 ${JSON.stringify({ dn, draw: p.draw, on: p.on })}`);
  // 5) 되돌리기
  await tab.tap('#undo-btn');
  p = await tab.eval(PLAY);
  if (p.g.drawn.length !== 74 || p.on !== 74 || p.draw !== U.draw || p.num !== String(all[73])) say(`되돌리기 뒤 ${JSON.stringify({ n: p.g.drawn.length, on: p.on, draw: p.draw, num: p.num })}`);
  // 6) 끝내기
  await tab.tap('#finish-btn');
  const en = await tab.eval(`({ scr: ${SCREENS}, drawn: document.getElementById('stat-drawn').textContent, of: document.getElementById('stat-of').textContent,
    time: document.getElementById('stat-time').textContent, none: !document.getElementById('end-none').hidden, done: ${COUNT('done')}, saved: (${STATE}).game })`);
  if (!en.scr.end || en.drawn !== '74' || en.of !== fmt(E.of, { m: 75 }) || !en.time || en.none || en.done !== 1 || en.saved) say(`끝 화면이 다름 ${JSON.stringify(en)}`);
  await checkEnd(tab, T, say);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  await tab.shot(`${lang}-${width}-3-end.png`);
  // 7) 다시 하기 → 새 게임(같은 방식)
  await tab.tap('.mg-end-retry');
  p = await tab.eval(PLAY);
  if (!(await tab.eval(SCREENS)).play || p.g.drawn.length || p.g.mode !== '75' || p.on) say(`다시 하기 뒤 ${JSON.stringify({ n: p.g.drawn.length, mode: p.g.mode, on: p.on })}`);
  await tab.tap('#draw-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`다시 하기 뒤 첫 번호에 start 가 늘지 않음`);
  // 8) 새 게임 → 시작 화면
  await tab.tap('#new-btn');
  const ng = await tab.eval(`({ scr: ${SCREENS}, saved: (${STATE}).game, ads: ${VISIBLE_ADS} })`);
  if (!ng.scr.setup || ng.saved || ng.ads !== 1) say(`새 게임 뒤 ${JSON.stringify(ng)}`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

// 움직임 그대로: 90볼, 굴러가는 동안 버튼 꺼짐 → 멈추면 번호
async function runMotion(lang, width, report) {
  const T = L10N[lang];
  const tag = `[${lang} ${width} 움직임]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const tab = await openTab(width, false);
  await prepare(tab, baseOf(lang), lang);
  await tab.tap('#mode-90');
  await tab.tap('#start-btn');
  await tab.tap('#draw-btn');
  const r = await tab.eval(`({ rolling: BINGOCALL_APP.rolling(), dis: document.getElementById('draw-btn').disabled, txt: document.getElementById('draw-btn').textContent, cls: document.getElementById('ball').className })`);
  if (!r.rolling || !r.dis || r.txt !== T.ui.drawing || !/is-rolling/.test(r.cls)) say(`굴러가는 중 모양이 다름 ${JSON.stringify(r)}`);
  await sleep(1400);
  const a = await tab.eval(`({ rolling: BINGOCALL_APP.rolling(), g: BINGOCALL_APP.game(), num: document.getElementById('ball-num').textContent, letter: document.getElementById('ball-letter').hidden, on: document.querySelectorAll('#board .bc-cell.is-on').length, cells: document.querySelectorAll('#board .bc-cell').length, dis: document.getElementById('draw-btn').disabled })`);
  if (a.rolling || a.dis || a.g.drawn.length !== 1 || a.num !== String(a.g.drawn[0]) || !a.letter || a.on !== 1 || a.cells !== 90) say(`멈춘 뒤 모양이 다름 ${JSON.stringify(a)}`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

// 좁은 화면 긴 언어: 시작·진행 화면 넘침
async function runNarrow(lang, report) {
  const tag = `[${lang} 360]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const tab = await openTab(360, true);
  await prepare(tab, baseOf(lang), lang);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${SETUP_FIT})`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.tap('#mode-custom');
  (await tab.eval(TEXT_FIT + `('.bc-label, .bc-hint, .bc-input')`)).forEach((w) => say(`직접 범위 ${w}`));
  await tab.tap('#mode-75');
  await tab.tap('#start-btn');
  await drawN(tab, 6);
  await tab.eval(`(() => { const v = document.getElementById('voice-wrap'); v.hidden = false; return 1; })()`); // 음성이 있는 기기처럼 스위치 3개 모두 보이게
  o = await tab.eval(OVERFLOW); if (o) say(`진행 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${PLAY_FIT})`)).forEach((w) => say(`진행 화면 ${w}`));
  const bar = await tab.eval(`(() => { const b = document.querySelector('.bc-bar'); return b.scrollWidth > b.clientWidth + 1; })()`);
  if (bar) say('진행 화면 위 막대가 넘침');
  await tab.shot(`${lang}-360-play.png`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bingocall-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 빙고 번호 추첨기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 + ${NARROW.join(', ')} × 360px) — http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    for (const lang of LANGS) {
      for (const w of WIDTHS) {
        const res = await runFull(lang, w, report);
        problems += res.problems; runs++;
        console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${w}] 시작(광고 1·범위 오류) → 75볼 → 10개 → 새로 고침 → 75개 모두(순열·done 1) → 되돌리기 → 끝내기(74/75·끝 화면) → 다시 하기 → 새 게임`);
      }
    }
    const m = await runMotion(LANGS[0], WIDTHS[0], report);
    problems += m.problems; runs++;
    console.log(`  ${m.problems ? '✗' : '✓'} [${LANGS[0]} 움직임] 90볼 → 굴러가는 동안 버튼 꺼짐 → 멈추면 번호·판`);
    for (const lang of NARROW) {
      const res = await runNarrow(lang, report);
      problems += res.problems; runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} 360] 시작·직접 범위·진행 화면 넘침 없음`);
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
