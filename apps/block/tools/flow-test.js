#!/usr/bin/env node
/**
 * 블록 퍼즐 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/block) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 게임 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음)
 *   → 시작(track('start') 1, 광고 안 보임, 판 64칸·조각 3칸, 판이 화면 폭 안)
 *   → 끌어 놓기(360 = 실제 터치 이벤트 — 조각이 손가락 위로 뜸, 1440 = 마우스): 끄는 중 고스트·미리보기 칸 수, 놓으면 그 자리에 놓임
 *   → 끌다가 창이 포커스를 잃으면(blur) 조각은 제자리
 *   → 탭으로 고르고 판 칸 탭으로 놓기 → 키보드(3 고르기·화살표·Enter) → 세 개 다 놓으면 새로 세 개
 *   → 자동 플레이(BLOCK_APP.autoplay)로 줄 지우기 확인 → 끝까지 → 끝 알림 → 끝 화면(track('done') 1, 점수 = 상태 점수, 지운 줄·최고 콤보,
 *     최고 기록 저장, 서버 백분위(모의 분포), 공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 다시 하기(start 2 → 새 판 → 끝 → done 2) · 콘솔 오류 0
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 끝난 뒤 1초 안에 끝 화면.
 *
 * 실행: node tools/flow-test.js                         (en,ko,ja × 360,1440)
 *       node tools/flow-test.js en,th 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ja').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8911, MOCK_PORT = 8912, CDP_PORT = 9911;
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
  async center(sel) {
    const r = await this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 30)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    return r;
  }
  async click(x, y) {
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    await sleep(60);
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
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
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
const ST = 'window.BLOCK_APP.state()';
// slot 조각을 놓을 수 있는 자리 하나(가운데에 가까운 것) + 그 자리에 고스트가 오도록 하는 포인터 좌표(터치 = 손가락 위로 띄움, 마우스 = 가운데)
const TARGET = (slot, touch) => `(() => {
  const C = window.BLOCK_CORE, st = window.BLOCK_APP.state(); const p = C.BY_ID[st.hand[${slot}]]; if (!p) return null;
  const ps = C.positions(st.board, p); if (!ps.length) return null;
  ps.sort((a, b) => (Math.abs(a[0] - 3) + Math.abs(a[1] - 3)) - (Math.abs(b[0] - 3) + Math.abs(b[1] - 3)));
  const [r, c] = ps[0];
  const cells = document.querySelectorAll('#board .blk-cell'); const a = cells[0].getBoundingClientRect(), b = cells[1].getBoundingClientRect(), z = cells[8].getBoundingClientRect();
  const pitch = b.left - a.left, pitchY = z.top - a.top, size = a.width;
  const pw = (p.w - 1) * pitch + size, ph = (p.h - 1) * pitchY + size;
  const gx = a.left + c * pitch, gy = a.top + r * pitchY;
  const x = gx + pw / 2, y = ${touch ? 'gy + ph + Math.max(28, size * 1.1)' : 'gy + ph / 2'};
  const s = document.querySelectorAll('.blk-slot')[${slot}].getBoundingClientRect();
  return { r, c, id: p.id, n: p.n, h: p.h, w: p.w, x, y, sx: s.left + s.width / 2, sy: s.top + s.height / 2, vw: innerWidth, vh: innerHeight };
})()`;

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

// 끌기: 누르기 → 몇 걸음에 걸쳐 옮기기 → (mid 콜백) → 떼기
async function dragTo(tab, from, to, touch, mid) {
  const steps = 8;
  if (touch) {
    const tp = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
    await tab.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(from.x, from.y) });
    for (let i = 1; i <= steps; i++) { await tab.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(from.x + (to.x - from.x) * i / steps, from.y + (to.y - from.y) * i / steps) }); await sleep(16); }
    if (mid) await mid();
    await tab.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x, y: from.y });
    await tab.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: from.x, y: from.y, button: 'left', buttons: 1, clickCount: 1 });
    for (let i = 1; i <= steps; i++) { await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: from.x + (to.x - from.x) * i / steps, y: from.y + (to.y - from.y) * i / steps, button: 'left', buttons: 1 }); await sleep(16); }
    if (mid) await mid();
    await tab.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: to.x, y: to.y, button: 'left', buttons: 0, clickCount: 1 });
  }
  await sleep(120);
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
  for (const b of [5, 12, 20, 20, 35, 60, 90]) await mockRpc('submit_score', { p_game: 'block', p_bucket: b });
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
  (await tab.eval(TEXT_FIT + `('.blk-h1, .blk-hook, .blk-btn, .blk-how-txt, .blk-badge, .blk-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);

  // 2) 시작
  await tab.tap('#start-btn');
  await sleep(250);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`시작 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  const pl = await tab.eval(`(() => { const b = document.getElementById('board').getBoundingClientRect(); const tray = document.getElementById('tray').getBoundingClientRect();
    return { scr: ${SCREENS}, ads: ${VISIBLE_ADS}, phase: window.BLOCK_APP.phase(), cells: document.querySelectorAll('#board .blk-cell').length, minis: document.querySelectorAll('.blk-slot .blk-mini').length,
      hint: document.getElementById('play-hint').textContent, bw: b.width, bh: b.height, right: b.right, vw: innerWidth, vh: innerHeight, trayBottom: tray.bottom }; })()`);
  if (pl.scr.start || !pl.scr.play || pl.scr.end || pl.phase !== 'play') say(`게임 화면이 다름 ${JSON.stringify(pl.scr)} ${pl.phase}`);
  if (pl.ads) say(`게임 화면에 광고가 보임 (${pl.ads})`);
  if (pl.cells !== 64 || pl.minis !== 3) say(`판 칸 ${pl.cells} / 조각 ${pl.minis}`);
  if (pl.hint !== P.hint) say(`안내 문구가 다름 "${pl.hint}"`);
  if (Math.abs(pl.bw - pl.bh) > 1.5 || pl.right > pl.vw || pl.bw < 280) say(`판 크기가 이상함 ${pl.bw}×${pl.bh}`);
  if (pl.trayBottom > pl.vh + 1) note(`조각 칸 아래가 화면 밖 (${Math.round(pl.trayBottom)} > ${pl.vh})`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.blk-hud-label, .blk-hud-val, .blk-hint')`)).forEach((w) => say(`게임 화면 ${w}`));
  await tab.shot(`${lang}-${width}-2-play.png`);

  // 3) 끌어 놓기 (360 = 터치, 1440 = 마우스)
  let t = await tab.eval(TARGET(0, touch));
  if (!t) say('조각 0 을 놓을 자리가 없음');
  else {
    let midInfo = null;
    await dragTo(tab, { x: t.sx, y: t.sy }, { x: t.x, y: t.y }, touch, async () => {
      midInfo = await tab.eval(`({ ghost: !!document.querySelector('.blk-ghost'), ok: !!document.querySelector('.blk-ghost.ok'), pv: document.querySelectorAll('#board .blk-cell.pv:not(.bad)').length,
        dragging: document.querySelectorAll('.blk-slot.dragging').length, gb: (() => { const g = document.querySelector('.blk-ghost'); if (!g) return null; const r = g.getBoundingClientRect(); return { bottom: r.bottom, top: r.top }; })() })`);
      await tab.shot(`${lang}-${width}-3-drag.png`);
    });
    if (!midInfo || !midInfo.ghost || !midInfo.ok || midInfo.pv !== t.n || midInfo.dragging !== 1) say(`끄는 중 고스트/미리보기가 다름 ${JSON.stringify(midInfo)} (칸 ${t.n})`);
    if (touch && midInfo && midInfo.gb && !(midInfo.gb.bottom < t.y - 10)) say(`터치로 끌 때 조각이 손가락 위에 뜨지 않음 ${JSON.stringify(midInfo.gb)} 손가락 y=${t.y}`);
    const s1 = await tab.eval(ST);
    const ghostLeft = await tab.eval(`!!document.querySelector('.blk-ghost')`);
    if (s1.placed !== 1 || s1.hand[0] !== null || s1.score < t.n || ghostLeft) say(`끌어 놓기가 안 됨 ${JSON.stringify({ placed: s1.placed, hand: s1.hand, score: s1.score, ghostLeft })}`);
    else if (!s1.lines) {
      const C = require(path.join(SITE, 'block-core.js'));
      const p = C.BY_ID[t.id];
      if (!p.cells.every(([dr, dc]) => s1.board[(t.r + dr) * 8 + t.c + dc])) say(`끌어 놓은 자리가 다름 (${t.r},${t.c})`);
    }
  }
  // 끌다가 창이 포커스를 잃으면 제자리
  t = await tab.eval(TARGET(1, touch));
  if (t) {
    const before = (await tab.eval(ST)).placed;
    await dragTo(tab, { x: t.sx, y: t.sy }, { x: t.x, y: t.y }, touch, async () => { await tab.eval(`window.dispatchEvent(new Event('blur')); 1`); });
    const after = await tab.eval(`({ placed: window.BLOCK_APP.state().placed, ghost: !!document.querySelector('.blk-ghost'), hand1: window.BLOCK_APP.state().hand[1] })`);
    if (after.placed !== before || after.ghost || !after.hand1) say(`끄는 중 blur 뒤에도 놓였거나 고스트가 남음 ${JSON.stringify(after)}`);
  }

  // 4) 탭으로 고르고 판 칸 탭으로 놓기 (조각 1)
  await tab.tap('.blk-slot[data-slot="1"]');
  const selInfo = await tab.eval(`({ sel: window.BLOCK_APP.state().sel, hint: document.getElementById('play-hint').textContent, cls: document.querySelector('.blk-slot[data-slot="1"]').className })`);
  if (selInfo.sel !== 1 || selInfo.hint !== P.hintSelected || !/\bsel\b/.test(selInfo.cls)) say(`탭으로 고르기가 다름 ${JSON.stringify(selInfo)}`);
  t = await tab.eval(TARGET(1, false));
  if (t) {
    const cellIdx = (t.r + Math.floor((t.h - 1) / 2)) * 8 + (t.c + Math.floor((t.w - 1) / 2));
    const before = await tab.eval(ST);
    await tab.tap(`#board .blk-cell:nth-child(${cellIdx + 1})`);
    const s2 = await tab.eval(ST);
    if (s2.placed !== before.placed + 1 || s2.hand[1] !== null || s2.sel !== -1) say(`탭으로 놓기가 안 됨 ${JSON.stringify({ placed: s2.placed, hand: s2.hand, sel: s2.sel })}`);
  }

  // 5) 키보드: 3 → (판 포커스) → → ← Enter
  const handBefore = await tab.eval(ST);
  await tab.key('3', 'Digit3', 51, '3');
  const k1 = await tab.eval(`({ sel: window.BLOCK_APP.state().sel, focus: document.activeElement && document.activeElement.id, kbd: document.getElementById('board').classList.contains('kbd'), pv: document.querySelectorAll('#board .blk-cell.pv').length })`);
  if (k1.sel !== 2 || k1.focus !== 'board' || !k1.kbd || !k1.pv) say(`키보드 고르기가 다름 ${JSON.stringify(k1)}`);
  await tab.key('ArrowRight', 'ArrowRight', 39);
  await tab.key('ArrowLeft', 'ArrowLeft', 37);
  await tab.key('Enter', 'Enter', 13, '\r');
  const k2 = await tab.eval(ST);
  if (k2.placed !== handBefore.placed + 1) say(`키보드로 놓기가 안 됨 ${JSON.stringify({ placed: k2.placed, before: handBefore.placed, hand: k2.hand, hint: k2.hint })}`);
  else if (handBefore.hand.filter(Boolean).length === 1 && k2.hand.some((h) => !h) && !k2.over) say(`세 개를 다 놓았는데 새로 나눠 주지 않음 ${JSON.stringify(k2.hand)}`);
  await tab.key('Escape', 'Escape', 27);
  await tab.shot(`${lang}-${width}-4-keys.png`);

  // 6) 자동 플레이로 줄 지우기 → 끝까지 → 끝 화면
  let sawClear = false;
  for (let i = 0; i < 400 && (await tab.eval(`window.BLOCK_APP.phase()`)) === 'play'; i++) {
    await tab.eval('window.BLOCK_APP.autoplay(1)');
    if (!sawClear && (await tab.eval(ST)).lines > 0) {
      sawClear = true;
      const hud = await tab.eval(`({ score: document.getElementById('hud-score').textContent, combo: document.getElementById('hud-combo').textContent, st: window.BLOCK_APP.state() })`);
      if (hud.score.replace(/\D/g, '') !== String(hud.st.score) || (hud.st.combo > 0 && !hud.combo.includes(String(hud.st.combo)))) say(`HUD 가 상태와 다름 ${JSON.stringify({ score: hud.score, combo: hud.combo, s: hud.st.score, c: hud.st.combo })}`);
    }
  }
  const ph = await tab.eval(`window.BLOCK_APP.phase()`);
  if (ph === 'over') {
    const ov = await tab.eval(`({ over: !document.getElementById('over-overlay').hidden, text: document.querySelector('.blk-over-title').textContent })`);
    if (!ov.over || ov.text !== P.noRoom) say(`끝 알림이 다름 ${JSON.stringify(ov)}`);
    if (!opts.reduced) await tab.shot(`${lang}-${width}-5-over.png`);
  }
  await tab.eval('window.__tOver = performance.now(); 1');
  const took = await waitFor(tab, `window.BLOCK_APP.phase() === 'end' && !document.getElementById('screen-end').hidden`, 5000);
  const elapsed = await tab.eval('performance.now() - window.__tOver');
  if (took < 0) { say('끝 화면이 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  if (opts.reduced ? elapsed > 1000 : elapsed > 2500) say(`끝 → 끝 화면 ${Math.round(elapsed)}ms`);
  await waitFor(tab, `!document.getElementById('res-rank-body').hidden || document.getElementById('res-rank').hidden`, 4000);
  await sleep(200);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`끝 화면 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const fin = await tab.eval(ST);
  const res = await tab.eval(`({ score: document.getElementById('res-score').textContent, newBest: !document.getElementById('res-newbest').hidden, lines: document.getElementById('res-lines').textContent,
    combo: document.getElementById('res-combo').textContent, best: localStorage.getItem('block_best_v1'), rank: !document.getElementById('res-rank').hidden, top: document.getElementById('res-top').textContent,
    beat: document.getElementById('res-beat').textContent, others: document.getElementById('res-others').textContent })`);
  const digits = (x) => String(x).replace(/\D/g, '');
  if (digits(res.score) !== String(fin.score) || !fin.over || !res.newBest || digits(res.lines) !== String(fin.lines) || res.best !== String(fin.score) || (fin.bestCombo && !res.combo.includes(String(fin.bestCombo)))) say(`결과 카드가 다름 ${JSON.stringify(res)} ${JSON.stringify({ score: fin.score, lines: fin.lines, bestCombo: fin.bestCombo })}`);
  if (!res.rank || !/\d/.test(res.top) || !res.others.includes('7')) say(`서버 백분위가 안 보임 ${JSON.stringify(res)}`);
  else note(`점수 ${res.score} · 줄 ${res.lines} · 콤보 ${res.combo} · ${res.top} · ${res.beat} · ${res.others}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.retry) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.retry}"`);
  if (endInfo.ads > 1) say(`끝 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.blk-eyebrow, .blk-score-line, .blk-newbest, .blk-best, .blk-stat dt, .blk-stat dd, .blk-top, .blk-beat, .blk-others, .mg-end-retry')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-6-end.png`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`공유 주소가 깨끗한 주소가 아님: ${share.url}`);
  if (!digits(share.text).includes(String(fin.score))) say(`공유 문구에 점수가 없음: ${share.text}`);

  // 7) 다시 하기 → 새 판 → 끝
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ start: ${COUNT('start')}, scr: ${SCREENS}, phase: window.BLOCK_APP.phase(), score: window.BLOCK_APP.state().score, placed: window.BLOCK_APP.state().placed, best: document.getElementById('hud-best').textContent, over: !document.getElementById('over-overlay').hidden })`);
  if (again.start !== 2 || !again.scr.play || again.phase !== 'play' || again.score !== 0 || again.placed !== 0 || digits(again.best) !== String(fin.score) || again.over) say(`다시 하기가 다름 ${JSON.stringify(again)}`);
  // 첫 판이 운 나쁘게 줄 하나 못 지우고 끝났을 수 있으니, 줄 지우기 확인은 두 판을 합쳐서 본다
  for (let i = 0; i < 400 && (await tab.eval(`window.BLOCK_APP.phase()`)) === 'play'; i++) { await tab.eval('window.BLOCK_APP.autoplay(1)'); if ((await tab.eval(ST)).lines > 0) sawClear = true; }
  if (!sawClear) say('자동 플레이 두 판 동안 줄이 한 번도 지워지지 않음');
  if ((await waitFor(tab, `window.BLOCK_APP.phase() === 'end'`, 6000)) < 0) say('다시 하기 판이 끝나지 않음');
  await sleep(200);
  const a2 = await tab.eval(`({ done: ${COUNT('done')}, score: window.BLOCK_APP.state().score })`);
  if (a2.done !== 2) say(`다시 하기 결과가 다름 ${JSON.stringify(a2)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'block-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 블록 퍼즐 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 → 판·조각 → ${width < 768 ? '터치' : '마우스'} 끌어 놓기·blur 취소 → 탭 놓기 → 키보드 놓기 → 줄 지우기·끝 → 끝 화면(점수·최고·백분위·공통 끝 화면) → 다시 하기`);
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
