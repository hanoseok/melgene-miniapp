#!/usr/bin/env node
/**
 * 10초 맞추기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/timer) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 10초 기본·블라인드 꺼짐, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음)
 *   → 게임 화면 준비(광고 없음, 00:00.00, 시도 3칸, 안내 문구, 버튼이 화면 안, track('start') 아직 0)
 *   → 실제 클릭/터치로 시작(track('start') 1, 시계가 돎) → 시계(게임 화면 아무 데나) 눌러 멈춤(빠름 표시·시도 칸)
 *   → 멈춘 직후 연타 무시 → Space 로 다음 시도·시작 → 탭 숨김 = 시도 무효(안내, 시도 수 그대로)
 *   → 딱 맞춤(10.004초: 00:10.00·축하 꽃가루, 움직임 줄이기면 없음) → 늦음 → 결과 보기
 *   → 끝 화면(track('done') 1, 오차·멈춘 시간·등급·딱 맞춤 배지·평균·시도 3개·내 최고 저장, 서버 백분위(모의 분포), 공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 다시 하기(새 판 준비, 첫 시도에서 start 2 → 끝 → done 2, 최고 기록 유지) · 콘솔 오류 0
 *   + 블라인드 모드 한 번(3초 뒤 ??:??.??, 결과에 블라인드 표시, 비교할 기록 없으면 백분위 숨김) + 움직임 줄이기 한 번.
 *
 * 실행: node tools/flow-test.js                          (en,ko,th × 360,375,1440)
 *       node tools/flow-test.js en,ru 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'timer-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8941, MOCK_PORT = 8942, CDP_PORT = 9941;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } }); })();`;

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
  async center(sel, noScroll) {
    const r = await this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      ${noScroll ? '' : "e.scrollIntoView({ block: 'center', behavior: 'instant' });"} let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 30)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    return r;
  }
  async click(x, y) {
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async touch(x, y) {
    await this.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }] });
    await sleep(30);
    await this.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(80);
  }
  async tap(sel) { const r = await this.center(sel); await sleep(40); await this.click(r.x, r.y); }
  async key(key, code, vk, text) {
    for (const type of ['keyDown', 'keyUp']) await this.send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: vk, text: type === 'keyDown' ? text : undefined });
    await sleep(40);
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
  const height = width >= 768 ? 900 : width <= 360 ? 740 : 812;
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await tab.send('Browser.grantPermissions', { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'], origin: `http://localhost:${HTTP_PORT}` }).catch(() => {});
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
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
const SCREENS = `({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const ST = 'window.TIMER_APP.state()';
const PHASE = 'window.TIMER_APP.phase()';
const fill = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
const nf = (lang, v, d) => new Intl.NumberFormat(lang, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v);

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const P = T.play, R = T.result;
  const touch = width < 768;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}${opts.blind ? ' 블라인드' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const note = (m) => console.log(`    · ${tag} ${m}`);
  const sec = (v, d) => fill(P.sec, { n: nf(lang, v, d) });
  const tgt = sec(10, 2);
  await mockRpc('__reset');
  for (const b of [4, 18, 35, 60, 120, 240, 900]) await mockRpc('submit_score', { p_game: 'timer-10', p_bucket: b });
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  const press = async (sel) => { const r = await tab.center(sel, true); if (touch) await tab.touch(r.x, r.y); else await tab.click(r.x, r.y); };
  const space = () => tab.key(' ', 'Space', 32, ' ');

  // 1) 시작 화면
  const st0 = await tab.eval(`(() => { const sec = document.getElementById('screen-start');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length,
      target: (document.querySelector('input[name=target]:checked') || {}).value, blind: document.getElementById('blind-toggle').checked }; })()`);
  if (!st0.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st0.h1}`);
  if (!st0.scr.start || st0.scr.play || st0.scr.end || !st0.adLast || st0.ads !== 1 || st0.faq || st0.target !== '10' || st0.blind) say(`시작 화면이 다름 ${JSON.stringify(st0)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.tm-h1, .tm-hook, .tm-btn, .tm-how, .tm-badge, .tm-facts, .tm-opt-label, .tm-seg-btn span, .tm-switch-text')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);
  if (opts.blind) await tab.tap('.tm-switch');

  // 2) 게임 화면(준비)
  await tab.tap('#start-btn');
  await sleep(200);
  const pl = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, st: ${ST}, clock: document.getElementById('clock').textContent, main: document.getElementById('main-btn').textContent,
    hint: document.getElementById('play-hint').textContent, tries: document.querySelectorAll('.tm-try').length, blindChip: !document.getElementById('play-blind').hidden,
    attempt: document.getElementById('attempt-label').textContent, change: !document.getElementById('change-btn').hidden, target: document.getElementById('play-target').textContent })`);
  if (pl.scr.start || !pl.scr.play || pl.scr.end || pl.st.phase !== 'ready') say(`게임 화면이 다름 ${JSON.stringify(pl)}`);
  if (pl.ads) say(`게임 화면에 광고가 보임 (${pl.ads})`);
  if (pl.clock !== '00:00.00' || pl.main !== P.go || pl.tries !== 3 || pl.blindChip !== !!opts.blind || !pl.change) say(`준비 상태가 다름 ${JSON.stringify(pl)}`);
  if (pl.hint !== fill(P.readyHint, { t: tgt }) || pl.attempt !== fill(P.attempt, { n: 1, total: 3 }) || pl.target !== fill(P.target, { t: tgt })) say(`준비 문구가 다름 ${JSON.stringify(pl)}`);
  if ((await tab.eval(COUNT('start'))) !== 0) say('시도를 시작하기 전에 track(start)');
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  const lay = await tab.eval(`(() => { const a = document.getElementById('main-btn').getBoundingClientRect(); const c = document.getElementById('clock'); return { btnBottom: a.bottom, vh: innerHeight, clockOver: c.scrollWidth > c.clientWidth + 1 }; })()`);
  if (lay.btnBottom > lay.vh || lay.clockOver) say(`게임 화면에서 버튼이 화면 밖이거나 시계가 넘침 ${JSON.stringify(lay)}`);
  (await tab.eval(TEXT_FIT + `('.tm-mode, .tm-attempt, .tm-btn, .tm-hint, .tm-link')`)).forEach((w) => say(`게임 화면 ${w}`));
  await tab.shot(`${lang}-${width}-2-ready.png`);

  // 3) 실제 누르기로 시작 → 시계가 돈다
  await press('#main-btn');
  await sleep(350);
  const run1 = await tab.eval(`({ st: ${ST}, clock: document.getElementById('clock').textContent, main: document.getElementById('main-btn').textContent, hint: document.getElementById('play-hint').textContent })`);
  if (run1.st.phase !== 'run' || run1.clock === '00:00.00' || run1.main !== P.stop || run1.hint !== P.runHint) say(`시작이 안 됨 ${JSON.stringify(run1)}`);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`첫 시도 시작 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  if (opts.blind) {
    await waitFor(tab, `(${ST}).elapsed > 3150`, 5000);
    await sleep(120);
    const hid = await tab.eval(`({ clock: document.getElementById('clock').textContent, cls: document.getElementById('clock').classList.contains('is-hidden') })`);
    if (hid.clock !== P.hidden || !hid.cls) say(`블라인드: 3초 뒤 숫자가 가려지지 않음 ${JSON.stringify(hid)}`);
    await tab.shot(`${lang}-${width}-3-blind.png`);
  }
  // 4) 게임 화면 아무 데나(시계) 눌러 멈춤
  await press('#clock');
  await sleep(80);
  const s1 = await tab.eval(`({ st: ${ST}, clock: document.getElementById('clock').textContent, verdict: document.getElementById('verdict').textContent, main: document.getElementById('main-btn').textContent, try1: document.querySelector('.tm-try .tm-try-v').textContent })`);
  const a1 = s1.st.attempts[0];
  if (s1.st.phase !== 'stopped' || !a1 || a1.ms < 200 || a1.ms > (opts.blind ? 6000 : 3000) || s1.main !== P.next) say(`아무 데나 눌러 멈추기가 안 됨 ${JSON.stringify(s1)}`);
  else {
    const expV = fill(P.early, { n: sec(Math.abs(a1.err) / 1000, 3) });
    if (s1.verdict !== expV || s1.clock !== C.formatClock(a1.ms) || s1.try1 !== C.formatShort(a1.ms)) say(`멈춘 뒤 표시가 다름 ${JSON.stringify(s1)} 기대 "${expV}"`);
    else note(`1번째 ${s1.clock} → ${s1.verdict}`);
  }
  // 5) 멈춘 직후 연타는 무시 → 잠시 뒤 Space 로 다음 시도 → Space 로 시작 → 탭 숨김 = 무효
  await press('#main-btn');
  if ((await tab.eval(PHASE)) !== 'stopped') say('멈춘 직후 연타로 다음 시도가 바로 넘어감');
  await sleep(500);
  await space();
  const r2 = await tab.eval(`({ st: ${ST}, attempt: document.getElementById('attempt-label').textContent })`);
  if (r2.st.phase !== 'ready' || r2.attempt !== fill(P.attempt, { n: 2, total: 3 })) say(`Space 로 다음 시도가 안 됨 ${JSON.stringify(r2)}`);
  await space();
  await sleep(150);
  if ((await tab.eval(PHASE)) !== 'run') say('Space 로 시작이 안 됨');
  await tab.eval(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); 1`);
  const c1 = await tab.eval(`({ st: ${ST}, hint: document.getElementById('play-hint').textContent, clock: document.getElementById('clock').textContent })`);
  await tab.eval(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); 1`);
  if (c1.st.phase !== 'ready' || c1.st.attempts.length !== 1 || c1.hint !== P.cancelled || c1.clock !== '00:00.00') say(`탭 숨김에 시도가 무효 처리되지 않음 ${JSON.stringify(c1)}`);
  // 6) 딱 맞춤(검사용 simulate)
  const pf = await tab.eval(`(() => { const a = window.TIMER_APP.simulate(10004); return { a, clock: document.getElementById('clock').textContent, verdict: document.getElementById('verdict').textContent, conf: document.getElementById('confetti').children.length, cls: document.getElementById('clock').classList.contains('perfect') }; })()`);
  if (!pf.a || !pf.a.perfect || pf.clock !== '00:10.00' || pf.verdict !== fill(P.perfect, { t: tgt }) || !pf.cls) say(`딱 맞춤 표시가 다름 ${JSON.stringify(pf)}`);
  if (opts.reduced ? pf.conf !== 0 : pf.conf < 10) say(`딱 맞춤 축하(꽃가루) ${pf.conf}개 (움직임 줄이기면 0)`);
  await tab.shot(`${lang}-${width}-4-perfect.png`);
  // 7) 3번째 (늦음) → 결과 보기
  const a3 = await tab.eval(`(() => { window.TIMER_APP.unlock(); const a = window.TIMER_APP.simulate(10256); return { a, verdict: document.getElementById('verdict').textContent, main: document.getElementById('main-btn').textContent, over: ${ST}.over }; })()`);
  if (!a3.a || a3.a.err !== 256 || a3.verdict !== fill(P.late, { n: sec(0.256, 3) }) || a3.main !== P.finish || !a3.over) say(`3번째 시도가 다름 ${JSON.stringify(a3)}`);
  (await tab.eval(TEXT_FIT + `('.tm-verdict, .tm-btn, .tm-try')`)).forEach((w) => say(`게임 화면 ${w}`));
  await sleep(500);
  await press('#main-btn');
  if ((await waitFor(tab, `${PHASE} === 'end' && !document.getElementById('screen-end').hidden`, 3000)) < 0) { say('끝 화면이 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  await waitFor(tab, `!document.getElementById('res-rank-body').hidden || document.getElementById('res-rank').hidden`, 4000);
  await sleep(200);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`끝 화면 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const res = await tab.eval(`({ mode: document.getElementById('res-mode').textContent, perfect: !document.getElementById('res-perfect').hidden && document.getElementById('res-perfect').textContent,
    err: document.getElementById('res-err').textContent, time: document.getElementById('res-time').textContent, tier: document.getElementById('res-tier').textContent,
    newBest: !document.getElementById('res-newbest').hidden, pb: !document.getElementById('res-pb').hidden && document.getElementById('res-pb').textContent, avg: document.getElementById('res-avg').textContent,
    rows: document.querySelectorAll('#res-list .tm-res-row').length, bestRow: [...document.querySelectorAll('#res-list .tm-res-row')].findIndex((r) => r.classList.contains('best')),
    rank: !document.getElementById('res-rank').hidden, top: document.getElementById('res-top').textContent, beat: document.getElementById('res-beat').textContent, others: document.getElementById('res-others').textContent,
    stored: localStorage.getItem('timer_best_v1') })`);
  const key = opts.blind ? 'timer-10-b' : 'timer-10';
  const avgMs = Math.round((Math.abs(a1 ? a1.err : 0) + 4 + 256) / 3);
  const exp = { mode: fill(R.mode, { t: tgt }) + (opts.blind ? ' · ' + P.blindTag : ''), perfect: fill(R.perfect, { t: tgt }), err: '+' + sec(0.004, 3), time: fill(R.stoppedAt, { time: '00:10.00' }), tier: R.tiers[5], avg: sec(avgMs / 1000, 3) };
  Object.keys(exp).forEach((k) => { if (res[k] !== exp[k]) say(`결과 ${k} "${res[k]}" ≠ "${exp[k]}"`); });
  if (res.rows !== 3 || res.bestRow !== 1 || res.newBest || res.pb !== fill(R.pb, { n: sec(0.004, 3) }) || JSON.parse(res.stored || '{}')[key] !== 4) say(`결과 목록/최고 기록이 다름 ${JSON.stringify(res)}`);
  if (opts.blind) { if (res.rank) say(`블라인드 첫 기록인데 백분위가 보임 (비교할 기록 없음이면 숨김) ${JSON.stringify(res)}`); }
  else if (!res.rank || !/\d/.test(res.top) || !res.others.includes('7')) say(`서버 백분위가 안 보임 ${JSON.stringify(res)}`);
  else note(`${res.err} · ${res.tier} · 평균 ${res.avg} · ${res.top} · ${res.beat} · ${res.others}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.retry) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.retry}"`);
  if (endInfo.ads > 1) say(`끝 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.tm-eyebrow, .tm-res-mode, .tm-perfect, .tm-res-label, .tm-res-err, .tm-res-time, .tm-tier-label, .tm-tier-name, .tm-pb, .tm-stat, .tm-list-label, .tm-res-row, .tm-top, .tm-beat, .tm-others, .mg-end-retry')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-5-end.png`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`공유 주소가 깨끗한 주소가 아님: ${share.url}`);
  if (!share.text.includes(R.tiers[5]) || !share.text.includes(sec(0.004, 3))) say(`공유 문구에 오차/등급이 없음: ${share.text}`);

  // 8) 다시 하기 → 새 판(준비) → 첫 시도에서만 start 2 → 끝 → done 2
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ start: ${COUNT('start')}, scr: ${SCREENS}, st: ${ST}, clock: document.getElementById('clock').textContent, conf: document.getElementById('confetti').children.length })`);
  if (again.start !== 1 || !again.scr.play || again.st.phase !== 'ready' || again.st.attempts.length || again.clock !== '00:00.00' || again.conf) say(`다시 하기가 다름 ${JSON.stringify(again)}`);
  await tab.eval('window.TIMER_APP.simulate(9500); window.TIMER_APP.simulate(10600); window.TIMER_APP.simulate(9990); window.TIMER_APP.unlock(); 1');
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 첫 시도 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  await space();
  if ((await waitFor(tab, `${PHASE} === 'end'`, 3000)) < 0) say('다시 하기 판이 끝나지 않음');
  await sleep(200);
  const a2 = await tab.eval(`({ done: ${COUNT('done')}, err: document.getElementById('res-err').textContent, perfect: !document.getElementById('res-perfect').hidden, pb: document.getElementById('res-pb').textContent, newBest: !document.getElementById('res-newbest').hidden })`);
  if (a2.done !== 2 || a2.err !== '−' + sec(0.01, 3) || a2.perfect || a2.newBest || a2.pb !== fill(R.pb, { n: sec(0.004, 3) })) say(`다시 하기 결과가 다름 ${JSON.stringify(a2)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}
async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'timer-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 10초 맞추기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { blind: true }]);
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}${opts.blind ? ' 블라인드' : ''}] 시작 화면 → 준비 → ${width < 768 ? '터치' : '마우스'}로 시작 → 아무 데나 눌러 멈춤 → 연타 무시 → Space 다음·시작 → 탭 숨김 무효 → 딱 맞춤 → 늦음 → 끝 화면(오차·등급·평균·백분위·공통 끝 화면) → 다시 하기`);
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
