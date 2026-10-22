#!/usr/bin/env node
/**
 * 탑 쌓기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/stack) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 게임 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음)
 *   → 시작(track('start') 1, 광고 안 보임, 탭 안내, 캔버스 = CSS 크기 × devicePixelRatio, 그림이 그려짐, 블록이 움직임)
 *   → 필드 탭(실제 마우스 이벤트)으로 25 어긋나게 → 폭 75 · 퍼펙트 4번(넓어짐) · 스페이스 키로 한 번 · 일시정지/계속
 *   → 빗나감 → 끝 화면(track('done') 1, 점수 = 층수, 최고 기록 저장, 서버 백분위(모의 분포), 공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 다시 하기(start 2 → 바로 빗나감 → done 2) · 콘솔 오류 0
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 빗나간 뒤 1초 안에 끝 화면.
 *
 * 실행: node tools/flow-test.js                         (en,ko × 360,375,1440)
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
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8851, MOCK_PORT = 8852, CDP_PORT = 9851;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

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
const SCREENS = `({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const ST = 'window.STACK_APP.state()';

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const P = T.play, R = T.result;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const note = (m) => console.log(`    · ${tag} ${m}`);
  await mockRpc('__reset');
  // 다른 사람 기록 몇 개(모의 서버) — 백분위가 보이는지
  for (const b of [1, 2, 3, 3, 5, 8, 13]) await mockRpc('submit_score', { p_game: 'stack', p_bucket: b });
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-start');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length }; })()`);
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.start || st.scr.play || st.scr.end || !st.adLast || st.ads !== 1 || st.faq) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.st-h1, .st-hook, .st-btn, .st-how-txt, .st-badge, .st-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);

  // 2) 시작
  await tab.tap('#start-btn');
  await sleep(250);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`시작 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  const pl = await tab.eval(`(() => { const c = document.getElementById('st-canvas'); const r = c.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2.5);
    const g = c.getContext('2d'); const px = g.getImageData(Math.round(c.width / 2), Math.round(c.height * 0.46), 1, 1).data; const corner = g.getImageData(4, 4, 1, 1).data;
    return { scr: ${SCREENS}, ads: ${VISIBLE_ADS}, phase: window.STACK_APP.phase(), hint: !document.getElementById('tap-hint').hidden, hintText: document.getElementById('tap-hint').textContent,
      cw: c.width, ch: c.height, w: r.width, h: r.height, dpr, center: [...px], corner: [...corner], fieldRight: document.getElementById('field').getBoundingClientRect().right, vw: innerWidth,
      bottom: r.bottom, vh: innerHeight }; })()`);
  if (pl.scr.start || !pl.scr.play || pl.scr.end || pl.phase !== 'play') say(`게임 화면이 다름 ${JSON.stringify(pl.scr)} ${pl.phase}`);
  if (pl.ads) say(`게임 화면에 광고가 보임 (${pl.ads})`);
  if (!pl.hint || pl.hintText !== P.hint) say('탭 안내가 안 보임');
  if (Math.abs(pl.cw - Math.round(pl.w * pl.dpr)) > 1 || Math.abs(pl.ch - Math.round(pl.h * pl.dpr)) > 1) say(`캔버스 해상도가 dpr 에 안 맞음 ${pl.cw}×${pl.ch} vs ${pl.w}×${pl.h}×${pl.dpr}`);
  if (pl.center[3] < 250 || pl.corner[3] < 250) say(`캔버스가 비어 있음 ${pl.center} / ${pl.corner}`);
  if (pl.fieldRight > pl.vw) say('게임 필드가 화면 밖');
  if (pl.bottom > pl.vh + 1) note(`필드 아래가 화면 밖 (${Math.round(pl.bottom)} > ${pl.vh})`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  const off1 = (await tab.eval(ST)).moving.offset;
  await sleep(300);
  const off2 = (await tab.eval(ST)).moving.offset;
  if (off1 === off2) say('블록이 움직이지 않음 (requestAnimationFrame)');
  await tab.shot(`${lang}-${width}-2-play.png`);

  // 3) 필드 탭(실제 마우스 이벤트): 25 어긋나게 → 폭 75. 조준 직후 곧바로 누른다(그 사이 거의 안 움직이게 시간 0.02배)
  const fr = await tab.eval(`(() => { const b = document.getElementById('field').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * 0.7 }; })()`);
  const dropAt = async (offset) => {
    await tab.eval(`window.STACK_APP.aim(${offset}); 1`);
    for (const type of ['mousePressed', 'mouseReleased']) await tab.send('Input.dispatchMouseEvent', { type, x: fr.x, y: fr.y, button: 'left', clickCount: 1 });
    await sleep(40);
  };
  await tab.eval('window.STACK_APP.timeScale(0.02); 1');
  await dropAt(25);
  let s = await tab.eval(ST);
  const sz = (b) => (b.level % 2 === 1 ? b.w : b.d);
  if (s.score !== 1 || Math.abs(sz(s.top) - 75) > 1.5 || s.combo !== 0) say(`25 어긋남 → 폭 75 아님 ${JSON.stringify(s)}`);
  if (await tab.eval(`!document.getElementById('tap-hint').hidden`)) say('첫 탭 뒤에도 탭 안내가 보임');
  if ((await tab.eval(`document.getElementById('hud-score').textContent`)) !== '1') say('HUD 층수가 1 이 아님');
  // 퍼펙트 4번: 1층(x 축)이 75 로 잘렸으니, 연속 3번째부터 넓어지는데 2·4층(z 축)은 이미 100 이라 그대로, 5층(x 축, 연속 4번째)에서 x 폭이 넓어진다
  for (let i = 0; i < 4; i++) await dropAt(0);
  s = await tab.eval(ST);
  if (s.score !== 5 || s.combo !== 4 || s.perfects !== 4) say(`퍼펙트 4번이 아님 ${JSON.stringify(s)}`);
  const widths = [s.top.w, s.top.d].sort((a, b) => a - b);
  if (!(widths[0] > 75.5)) say(`연속 퍼펙트에 넓어지지 않음 ${JSON.stringify(s.top)}`);
  // 스페이스 키
  await tab.eval('window.STACK_APP.aim(0); document.getElementById("field").focus(); 1');
  for (const type of ['keyDown', 'keyUp']) await tab.send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32, text: type === 'keyDown' ? ' ' : undefined });
  await sleep(80);
  s = await tab.eval(ST);
  if (s.score !== 6) say(`스페이스로 떨어뜨리기 안 됨 (score=${s.score})`);
  await tab.eval('window.STACK_APP.timeScale(1); 1');
  await sleep(500);
  await tab.shot(`${lang}-${width}-3-stack.png`);
  // 일시정지 → 계속
  await tab.tap('#pause-btn');
  const ps = await tab.eval(`({ phase: window.STACK_APP.phase(), ov: !document.getElementById('pause-overlay').hidden, off: window.STACK_APP.state().moving.offset })`);
  await sleep(250);
  const ps2 = await tab.eval(`window.STACK_APP.state().moving.offset`);
  if (ps.phase !== 'paused' || !ps.ov || ps.off !== ps2) say(`일시정지가 다름 ${JSON.stringify(ps)} ${ps2}`);
  await tab.tap('#resume-btn');
  if ((await tab.eval('window.STACK_APP.phase()')) !== 'play') say('계속하기가 안 됨');

  // 4) 빗나감 → 끝 화면
  await tab.eval('window.STACK_APP.timeScale(0.02); 1');
  await dropAt(115);
  await tab.eval('window.STACK_APP.timeScale(1); 1');
  await tab.eval('window.__tMiss = performance.now(); 1');
  if ((await tab.eval('window.STACK_APP.phase()')) !== 'over') say(`빗나갔는데 phase=${await tab.eval('window.STACK_APP.phase()')}`);
  if (!opts.reduced) { await sleep(500); await tab.shot(`${lang}-${width}-4-miss.png`); }
  const took = await waitFor(tab, `window.STACK_APP.phase() === 'end' && !document.getElementById('screen-end').hidden`, 4000);
  const elapsed = await tab.eval('performance.now() - window.__tMiss');
  if (took < 0) { say('끝 화면이 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  if (opts.reduced ? elapsed > 1000 : elapsed > 2500) say(`빗나감 → 끝 화면 ${Math.round(elapsed)}ms`);
  await waitFor(tab, `!document.getElementById('res-rank-body').hidden || document.getElementById('res-rank').hidden`, 4000);
  await sleep(200);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`끝 화면 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const res = await tab.eval(`({ score: document.getElementById('res-score').textContent, newBest: !document.getElementById('res-newbest').hidden, perf: document.getElementById('res-perfects').textContent,
    combo: document.getElementById('res-combo').textContent, best: localStorage.getItem('st_best_v1'), rank: !document.getElementById('res-rank').hidden, top: document.getElementById('res-top').textContent,
    beat: document.getElementById('res-beat').textContent, others: document.getElementById('res-others').textContent, scr: ${SCREENS} })`);
  if (res.score !== '6' || !res.newBest || res.perf !== '5' || res.combo !== '5' || res.best !== '6') say(`결과 카드가 다름 ${JSON.stringify(res)}`);
  if (!res.rank || !/\d/.test(res.top) || !res.others.includes('7')) say(`서버 백분위가 안 보임 ${JSON.stringify(res)}`);
  else note(`${res.top} · ${res.beat} · ${res.others}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.retry) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.retry}"`);
  if (endInfo.ads > 1) say(`끝 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.st-eyebrow, .st-score-line, .st-newbest, .st-best, .st-stat dt, .st-top, .st-beat, .st-others, .mg-end-retry')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-5-end.png`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`공유 주소가 깨끗한 주소가 아님: ${share.url}`);
  if (!share.text.includes('6')) say(`공유 문구에 점수가 없음: ${share.text}`);

  // 5) 다시 하기 → 바로 빗나감
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ start: ${COUNT('start')}, scr: ${SCREENS}, score: window.STACK_APP.state().score, best: document.getElementById('hud-best').textContent })`);
  if (again.start !== 2 || !again.scr.play || again.score !== 0 || again.best !== '6') say(`다시 하기가 다름 ${JSON.stringify(again)}`);
  await tab.eval('window.STACK_APP.timeScale(0.02); 1');
  await dropAt(-115);
  await tab.eval('window.STACK_APP.timeScale(1); 1');
  if ((await waitFor(tab, `window.STACK_APP.phase() === 'end'`, 4000)) < 0) say('다시 하기 판이 끝나지 않음');
  await sleep(200);
  const a2 = await tab.eval(`({ done: ${COUNT('done')}, score: document.getElementById('res-score').textContent, newBest: !document.getElementById('res-newbest').hidden, bestLine: document.getElementById('res-best').textContent })`);
  if (a2.done !== 2 || a2.score !== '0' || a2.newBest || !a2.bestLine.includes('6')) say(`다시 하기 결과가 다름 ${JSON.stringify(a2)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'stack-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 탑 쌓기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 → 시작(캔버스·dpr·움직임) → 탭 잘림·퍼펙트 4번(넓어짐)·스페이스·일시정지 → 빗나감 → 끝 화면(점수·최고·백분위·공통 끝 화면) → 다시 하기`);
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
