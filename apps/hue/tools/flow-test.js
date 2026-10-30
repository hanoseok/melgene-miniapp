#!/usr/bin/env node
/**
 * 다른 색 찾기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/hue) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 게임 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음)
 *   → 시작(track('start') 1, 광고 안 보임, 2×2 판, 판·안내가 스크롤 없이 화면 안)
 *   → 실제 클릭/터치로 다른 칸 누르기(레벨 +1, 3×3) → 틀린 칸 누르기(3초 감점·흔들림·점수 그대로)
 *   → 키보드(판 포커스, 화살표로 다른 칸까지 → Enter) → 탭 숨김(visibilitychange)에 시계 멈춤/이어 감
 *   → 18단계 더(8×8 판, 칸 크기·판이 화면 안) → 시간 끝(정답 칸 표시·알림) → 끝 화면(track('done') 1, 점수·등급·틀린 횟수·판,
 *     최고 기록 저장, 서버 백분위(모의 분포), 공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 다시 하기(start 2 → 새 판 0단계 → 끝 → done 2) · 콘솔 오류 0
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 시간 끝 뒤 1초 안에 끝 화면.
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
const C = require(path.join(SITE, 'hue-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8921, MOCK_PORT = 8922, CDP_PORT = 9921;
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
const ST = 'window.HUE_APP.state()';
const TILE_AT = (i) => `(() => { const t = document.querySelectorAll('#board .hue-tile')[${i}]; if (!t) return null; const b = t.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, w: b.width, bg: getComputedStyle(t).backgroundColor }; })()`;
// 판 크기·위치(스크롤 없이 화면 안인지)
const LAYOUT = `(() => { const b = document.getElementById('board').getBoundingClientRect(); const h = document.getElementById('play-hint').getBoundingClientRect(); const t = document.querySelector('#board .hue-tile').getBoundingClientRect();
  return { bw: b.width, bh: b.height, top: b.top, bottom: b.bottom, right: b.right, hintBottom: h.bottom, tile: t.width, vw: innerWidth, vh: innerHeight, sy: scrollY,
    tiles: document.querySelectorAll('#board .hue-tile').length }; })()`;

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const P = T.play, R = T.result;
  const touch = width < 768;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const note = (m) => console.log(`    · ${tag} ${m}`);
  await mockRpc('__reset');
  for (const b of [3, 8, 12, 12, 17, 22, 30]) await mockRpc('submit_score', { p_game: 'hue', p_bucket: b });
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 시작 화면
  const st0 = await tab.eval(`(() => { const sec = document.getElementById('screen-start');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length }; })()`);
  if (!st0.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st0.h1}`);
  if (!st0.scr.start || st0.scr.play || st0.scr.end || !st0.adLast || st0.ads !== 1 || st0.faq) say(`시작 화면이 다름 ${JSON.stringify(st0)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.hue-h1, .hue-hook, .hue-btn, .hue-how, .hue-badge, .hue-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);

  // 2) 시작
  await tab.tap('#start-btn');
  await sleep(250);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`시작 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  const pl = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, phase: window.HUE_APP.phase(), hint: document.getElementById('play-hint').textContent, level: document.getElementById('hud-level').textContent, time: document.getElementById('hud-time').textContent, st: ${ST} })`);
  if (pl.scr.start || !pl.scr.play || pl.scr.end || pl.phase !== 'play') say(`게임 화면이 다름 ${JSON.stringify(pl.scr)} ${pl.phase}`);
  if (pl.ads) say(`게임 화면에 광고가 보임 (${pl.ads})`);
  if (pl.hint !== P.hint) say(`안내 문구가 다름 "${pl.hint}"`);
  if (pl.st.size !== 2 || pl.st.count !== 4 || pl.st.score !== 0 || pl.level.replace(/\D/g, '') !== '0' || !/^(60|59)$/.test(pl.time.replace(/\D/g, ''))) say(`첫 판이 다름 ${JSON.stringify({ st: pl.st, level: pl.level, time: pl.time })}`);
  let lay = await tab.eval(LAYOUT);
  if (lay.tiles !== 4 || Math.abs(lay.bw - lay.bh) > 1.5 || lay.right > lay.vw || lay.bw < 260 || lay.bottom > lay.vh || lay.hintBottom > lay.vh + 1 || lay.top < 0) say(`판이 화면 안에 다 보이지 않음 ${JSON.stringify(lay)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.hue-hud-label, .hue-hud-val, .hue-hint')`)).forEach((w) => say(`게임 화면 ${w}`));
  // 다른 칸 색이 정말 다르게 그려졌는지
  const odd0 = await tab.eval('window.HUE_APP.oddIndex()');
  const bgs = await tab.eval(`[...document.querySelectorAll('#board .hue-tile')].map((t) => getComputedStyle(t).backgroundColor)`);
  if (bgs.filter((c) => c !== bgs[odd0]).length !== bgs.length - 1 || new Set(bgs).size !== 2) say(`그려진 판의 다른 칸이 하나가 아님 ${JSON.stringify(bgs)} odd=${odd0}`);
  await tab.shot(`${lang}-${width}-2-play.png`);

  // 3) 실제 클릭/터치로 다른 칸
  let at = await tab.eval(TILE_AT(odd0));
  if (touch) await tab.touch(at.x, at.y); else await tab.click(at.x, at.y);
  await sleep(80);
  let s1 = await tab.eval(ST);
  if (s1.score !== 1 || s1.size !== 3 || s1.count !== 9) say(`다른 칸 누르기가 안 됨 ${JSON.stringify(s1)}`);
  if ((await tab.eval(`document.getElementById('hud-level').textContent`)).replace(/\D/g, '') !== '1') say('HUD 레벨이 1 이 아님');

  // 4) 틀린 칸 (3초 감점)
  const odd1 = await tab.eval('window.HUE_APP.oddIndex()');
  const wrongIdx = odd1 === 4 ? 0 : 4;
  at = await tab.eval(TILE_AT(wrongIdx));
  const leftBefore = (await tab.eval(ST)).left;
  if (touch) await tab.touch(at.x, at.y); else await tab.click(at.x, at.y);
  await sleep(40);
  const s2 = await tab.eval(`({ st: ${ST}, shake: document.getElementById('board').classList.contains('shake') || ${opts.reduced ? 'true' : 'false'}, pop: document.querySelector('.hue-pop.minus') && document.querySelector('.hue-pop.minus').textContent })`);
  if (s2.st.score !== 1 || s2.st.misses !== 1 || leftBefore - s2.st.left < 3000 || leftBefore - s2.st.left > 3800 || !s2.shake || s2.pop !== P.penalty.replace('{n}', '3')) say(`틀린 칸 처리가 다름 ${JSON.stringify({ s2, leftBefore })}`);
  await tab.shot(`${lang}-${width}-3-miss.png`);

  // 5) 키보드: 판 포커스 → 화살표로 다른 칸까지 → Enter
  await tab.eval(`document.getElementById('board').focus(); 1`);
  await tab.key('ArrowRight', 'ArrowRight', 39); // 커서 0 에서 시작
  await tab.key('ArrowLeft', 'ArrowLeft', 37);
  const n1 = (await tab.eval(ST)).size;
  const odd2 = await tab.eval('window.HUE_APP.oddIndex()');
  for (let i = 0; i < Math.floor(odd2 / n1); i++) await tab.key('ArrowDown', 'ArrowDown', 40);
  for (let i = 0; i < odd2 % n1; i++) await tab.key('ArrowRight', 'ArrowRight', 39);
  const k1 = await tab.eval(`({ cur: ${ST}.cursor, curCls: document.querySelectorAll('#board .hue-tile.cur').length, focus: document.activeElement && document.activeElement.id })`);
  if (k1.cur !== odd2 || k1.curCls !== 1 || k1.focus !== 'board') say(`키보드 커서가 다름 ${JSON.stringify(k1)} 목표 ${odd2}`);
  await tab.key('Enter', 'Enter', 13, '\r');
  const s3 = await tab.eval(ST);
  if (s3.score !== 2) say(`키보드로 고르기가 안 됨 ${JSON.stringify(s3)}`);

  // 6) 탭 숨김 → 시계 멈춤 → 돌아오면 이어 감
  await tab.eval(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); 1`);
  const h1 = (await tab.eval(ST));
  await sleep(700);
  const h2 = (await tab.eval(ST));
  if (!h1.paused || Math.abs(h1.left - h2.left) > 30) say(`숨김 중 시계가 멈추지 않음 ${JSON.stringify({ a: h1.left, b: h2.left, paused: h1.paused })}`);
  await tab.eval(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); 1`);
  await sleep(400);
  const h3 = (await tab.eval(ST));
  if (h3.paused || !(h3.left < h2.left - 150)) say(`돌아온 뒤 시계가 이어 가지 않음 ${JSON.stringify({ b: h2.left, c: h3.left, paused: h3.paused })}`);

  // 7) 18단계 더 → 8×8
  await tab.eval('window.HUE_APP.solve(18)');
  await sleep(100);
  const big = await tab.eval(ST);
  lay = await tab.eval(LAYOUT);
  if (big.score !== 20 || big.size !== 8 || lay.tiles !== 64) say(`20단계 판이 다름 ${JSON.stringify({ score: big.score, size: big.size, tiles: lay.tiles })}`);
  if (lay.tile < 26 || lay.bottom > lay.vh || lay.right > lay.vw) say(`8×8 판 칸이 너무 작거나 화면 밖 ${JSON.stringify(lay)}`);
  if (big.base === big.oddColor) say('8×8 판에서 두 색이 같음');
  note(`8×8 칸 ${Math.round(lay.tile)}px · 판 ${Math.round(lay.bw)}px · 색 ${big.base}/${big.oddColor} (차이 ${big.delta.toFixed(3)})`);
  await tab.shot(`${lang}-${width}-4-8x8.png`);

  // 8) 시간 끝 → 끝 화면
  const fin = await tab.eval(`(() => { const odd = window.HUE_APP.oddIndex(); window.HUE_APP.expire(); window.__tOver = performance.now();
    return { odd, phase: window.HUE_APP.phase(), over: !document.getElementById('over-overlay').hidden, text: document.querySelector('.hue-over-title').textContent,
      reveal: [...document.querySelectorAll('#board .hue-tile')].findIndex((t) => t.classList.contains('reveal')), time: document.getElementById('hud-time').textContent, st: window.HUE_APP.state() }; })()`);
  if (fin.phase !== 'over' || !fin.over || fin.text !== P.timeUp || fin.reveal !== fin.odd || fin.time.replace(/\D/g, '') !== '0') say(`시간 끝 화면이 다름 ${JSON.stringify(fin)}`);
  if (!opts.reduced) await tab.shot(`${lang}-${width}-5-timeup.png`);
  const took = await waitFor(tab, `window.HUE_APP.phase() === 'end' && !document.getElementById('screen-end').hidden`, 5000);
  const elapsed = await tab.eval('performance.now() - window.__tOver');
  if (took < 0) { say('끝 화면이 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  if (opts.reduced ? elapsed > 1000 : elapsed > 2500) say(`시간 끝 → 끝 화면 ${Math.round(elapsed)}ms`);
  await waitFor(tab, `!document.getElementById('res-rank-body').hidden || document.getElementById('res-rank').hidden`, 4000);
  await sleep(200);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`끝 화면 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const res = await tab.eval(`({ score: document.getElementById('res-score').textContent, tier: document.getElementById('res-tier').textContent, newBest: !document.getElementById('res-newbest').hidden,
    misses: document.getElementById('res-misses').textContent, grid: document.getElementById('res-grid').textContent, best: localStorage.getItem('hue_best_v1'),
    rank: !document.getElementById('res-rank').hidden, top: document.getElementById('res-top').textContent, beat: document.getElementById('res-beat').textContent, others: document.getElementById('res-others').textContent })`);
  const digits = (x) => String(x).replace(/\D/g, '');
  const expTier = R.tiers[C.tierOf(20)];
  if (digits(res.score) !== '20' || res.tier !== expTier || !res.newBest || digits(res.misses) !== '1' || res.grid !== R.gridValue.replace(/\{n\}/g, '8') || res.best !== '20') say(`결과 카드가 다름 ${JSON.stringify(res)} (등급 기대 ${expTier})`);
  if (!res.rank || !/\d/.test(res.top) || !res.others.includes('7')) say(`서버 백분위가 안 보임 ${JSON.stringify(res)}`);
  else note(`점수 ${res.score} · ${res.tier} · 틀림 ${res.misses} · ${res.grid} · ${res.top} · ${res.beat} · ${res.others}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.retry) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.retry}"`);
  if (endInfo.ads > 1) say(`끝 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.hue-eyebrow, .hue-score-line, .hue-tier-label, .hue-tier-name, .hue-newbest, .hue-best, .hue-stat dt, .hue-stat dd, .hue-top, .hue-beat, .hue-others, .mg-end-retry')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-6-end.png`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`공유 주소가 깨끗한 주소가 아님: ${share.url}`);
  if (!digits(share.text).includes('20') || !share.text.includes(expTier)) say(`공유 문구에 점수/등급이 없음: ${share.text}`);

  // 9) 다시 하기 → 새 판 → 끝
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ start: ${COUNT('start')}, scr: ${SCREENS}, phase: window.HUE_APP.phase(), st: ${ST}, best: document.getElementById('hud-best').textContent, over: !document.getElementById('over-overlay').hidden, done: document.getElementById('board').classList.contains('done') })`);
  if (again.start !== 2 || !again.scr.play || again.phase !== 'play' || again.st.score !== 0 || again.st.misses !== 0 || again.st.size !== 2 || digits(again.best) !== '20' || again.over || again.done || again.st.left < 59000) say(`다시 하기가 다름 ${JSON.stringify(again)}`);
  await tab.eval('window.HUE_APP.solve(3); window.HUE_APP.expire()');
  if ((await waitFor(tab, `window.HUE_APP.phase() === 'end'`, 6000)) < 0) say('다시 하기 판이 끝나지 않음');
  await sleep(200);
  const a2 = await tab.eval(`({ done: ${COUNT('done')}, score: document.getElementById('res-score').textContent, newBest: !document.getElementById('res-newbest').hidden, best: document.getElementById('res-best').textContent })`);
  if (a2.done !== 2 || digits(a2.score) !== '3' || a2.newBest || !digits(a2.best).includes('20')) say(`다시 하기 결과가 다름 ${JSON.stringify(a2)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hue-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 다른 색 찾기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 → 2×2 판 → ${width < 768 ? '터치' : '마우스'}로 다른 칸 → 틀린 칸 3초 감점 → 키보드 고르기 → 탭 숨김 시계 멈춤 → 8×8 → 시간 끝 → 끝 화면(점수·등급·최고·백분위·공통 끝 화면) → 다시 하기`);
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
