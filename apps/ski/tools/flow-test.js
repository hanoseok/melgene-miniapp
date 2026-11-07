#!/usr/bin/env node
/**
 * 스키 활강 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/ski) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 게임 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음)
 *   → 시작 버튼 = 준비 상태(track('start') 아직 0, 광고 안 보임, 안내 보임, 스키어 제자리, 캔버스 = CSS 크기 × devicePixelRatio, 그림이 그려짐)
 *   → 필드 왼쪽 절반 누르고 있기(실제 마우스 이벤트)로 출발(track('start') 1) + 왼쪽으로 꺾임 → 떼면 곧게 → → 키 누르고 있기 = 오른쪽
 *   → 자동 조종(SKI_APP.autopilot)으로 150 m 이상 · HUD 거리 · 일시정지/계속(멈춤 확인)
 *   → 자동 조종 끄고 곧게 → 부딪힘 → 끝 화면(track('done') 1, 점수 = 상태 점수, 기문 수, 등급, 최고 기록 저장, 서버 백분위(모의 분포),
 *     공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함) → 다시 하기(준비, start 그대로 → 탭 → start 2 → 부딪힘 → done 2) · 콘솔 오류 0
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 부딪힌 뒤 1초 안에 끝 화면.
 *
 * 실행: node tools/flow-test.js                         (en,ko,ru × 360,375,1440)
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
const LANGS = (process.argv[2] || 'en,ko,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8941, MOCK_PORT = 8942, CDP_PORT = 9941;
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
const ST = 'window.SKI_APP.state()';
const PH = 'window.SKI_APP.phase()';

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
  for (const b of [1, 4, 9, 20, 30, 45, 80]) await mockRpc('submit_score', { p_game: 'ski', p_bucket: b });
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
  (await tab.eval(TEXT_FIT + `('.ski-h1, .ski-hook, .ski-btn, .ski-how-txt, .ski-badge, .ski-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);

  // 2) 시작 버튼 → 준비 상태 (아직 track('start') 없음)
  await tab.tap('#start-btn');
  await sleep(250);
  if ((await tab.eval(COUNT('start'))) !== 0) say(`준비 상태에서 track('start') ${await tab.eval(COUNT('start'))}회 (첫 입력에서 1회여야 함)`);
  const pl = await tab.eval(`(() => { const c = document.getElementById('ski-canvas'); const r = c.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2.5);
    const g = c.getContext('2d'); const px = g.getImageData(Math.round(c.width / 2), Math.round(c.height * 0.6), 1, 1).data; const corner = g.getImageData(4, 4, 1, 1).data;
    return { scr: ${SCREENS}, ads: ${VISIBLE_ADS}, phase: ${PH}, hint: !document.getElementById('tap-hint').hidden, hintText: document.getElementById('tap-hint').textContent,
      cw: c.width, ch: c.height, w: r.width, h: r.height, dpr, center: [...px], corner: [...corner], fieldRight: document.getElementById('field').getBoundingClientRect().right, vw: innerWidth,
      bottom: r.bottom, vh: innerHeight }; })()`);
  if (pl.scr.start || !pl.scr.play || pl.scr.end || pl.phase !== 'ready') say(`준비 화면이 다름 ${JSON.stringify(pl.scr)} ${pl.phase}`);
  if (pl.ads) say(`게임 화면에 광고가 보임 (${pl.ads})`);
  if (!pl.hint || pl.hintText !== P.hint) say('준비 안내(탭해서 출발)가 안 보임');
  if (Math.abs(pl.cw - Math.round(pl.w * pl.dpr)) > 1 || Math.abs(pl.ch - Math.round(pl.h * pl.dpr)) > 1) say(`캔버스 해상도가 dpr 에 안 맞음 ${pl.cw}×${pl.ch} vs ${pl.w}×${pl.h}×${pl.dpr}`);
  if (pl.center[3] < 250 || pl.corner[3] < 250) say(`캔버스가 비어 있음 ${pl.center} / ${pl.corner}`);
  if (pl.fieldRight > pl.vw) say('게임 필드가 화면 밖');
  if (pl.bottom > pl.vh + 1) note(`필드 아래가 화면 밖 (${Math.round(pl.bottom)} > ${pl.vh})`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  const r1 = await tab.eval(ST);
  await sleep(400);
  const r2 = await tab.eval(ST);
  if (r1.dist !== r2.dist || r2.started || r2.x !== r1.x) say(`준비 상태인데 움직임 ${JSON.stringify([r1, r2])}`);
  await tab.shot(`${lang}-${width}-2-ready.png`);

  // 3) 필드 왼쪽 절반을 누르고 있기(실제 마우스 이벤트) → 출발 + 왼쪽으로
  const fr = await tab.eval(`(() => { const b = document.getElementById('field').getBoundingClientRect(); return { lx: b.left + b.width * 0.2, rx: b.left + b.width * 0.8, y: b.top + b.height * 0.7 }; })()`);
  await tab.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: fr.lx, y: fr.y, button: 'left', clickCount: 1 });
  await sleep(350);
  let s = await tab.eval(ST);
  if (!s.started || (await tab.eval(PH)) !== 'play' && !s.over) say(`누르기로 출발하지 않음 ${JSON.stringify(s)}`);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`출발 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  if (!(s.vx < -30) || !(s.x < 180)) say(`왼쪽 절반을 눌렀는데 왼쪽으로 안 감 ${JSON.stringify(s)}`);
  if (await tab.eval(`!document.getElementById('tap-hint').hidden`)) say('출발 뒤에도 준비 안내가 보임');
  await tab.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: fr.lx, y: fr.y, button: 'left', clickCount: 1 });
  await sleep(300);
  s = await tab.eval(ST);
  if (!s.over && !(Math.abs(s.vx) < 40)) say(`손을 뗐는데 계속 꺾음 ${JSON.stringify(s)}`);
  // → 키 누르고 있기
  if (!s.over) {
    await tab.eval('document.getElementById("field").focus(); 1');
    await tab.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
    await sleep(300);
    const sk = await tab.eval(ST);
    await tab.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
    if (!sk.over && !(sk.vx > 30)) say(`→ 키로 오른쪽으로 안 감 ${JSON.stringify(sk)}`);
  }
  // 자동 조종으로 150 m 이상 (앞에서 부딪혔으면 다시 하기로 새 판)
  if ((await tab.eval(ST)).over) {
    note('키 검사 중 부딪힘 — 다시 준비해서 자동 조종');
    await waitFor(tab, `${PH} === 'end'`, 4000);
    await tab.eval(`document.querySelector('[data-mg-end] .mg-end-retry').click(); 1`);
    await sleep(200);
    await tab.eval('window.SKI_APP.begin(); 1');
    await tab.eval('window.__tracks = window.__tracks.filter((e) => e !== "start" && e !== "done"); window.__tracks.push("start"); 1');
  }
  await tab.eval('window.SKI_APP.autopilot(true); window.SKI_APP.timeScale(3); 1');
  if ((await waitFor(tab, `window.SKI_APP.state().score >= 150`, 20000)) < 0) say(`자동 조종으로 150 m 를 못 감 ${JSON.stringify(await tab.eval(ST))}`);
  await tab.eval('window.SKI_APP.timeScale(1); 1');
  s = await tab.eval(ST);
  if (s.over) say('자동 조종 중 부딪힘');
  const hud = Number((await tab.eval(`document.getElementById('hud-dist').textContent`)).replace(/[^\d]/g, ''));
  if (Math.abs(hud - s.score) > 30) say(`HUD 거리 ${hud} ≠ ${s.score}`);
  await tab.shot(`${lang}-${width}-3-ski.png`);
  // 일시정지 → 계속
  await tab.tap('#pause-btn');
  const ps = await tab.eval(`({ phase: ${PH}, ov: !document.getElementById('pause-overlay').hidden, d: window.SKI_APP.state().dist })`);
  await sleep(300);
  const ps2 = await tab.eval(`window.SKI_APP.state().dist`);
  if (ps.phase !== 'paused' || !ps.ov || ps.d !== ps2) say(`일시정지가 다름 ${JSON.stringify(ps)} ${ps2}`);
  await tab.shot(`${lang}-${width}-3b-paused.png`);
  await tab.tap('#resume-btn');
  if ((await tab.eval(PH)) !== 'play') say('계속하기가 안 됨');

  // 4) 자동 조종 끄고 곧게 → 부딪힘 → 끝 화면
  await tab.eval('window.SKI_APP.autopilot(false); window.SKI_APP.steer(0); window.SKI_APP.timeScale(5); 1');
  if ((await waitFor(tab, `${PH} === 'over' || ${PH} === 'end'`, 20000)) < 0) say('곧게 가도 부딪히지 않음');
  await tab.eval('window.SKI_APP.timeScale(1); window.__tHit = performance.now(); 1');
  if (!opts.reduced) { await sleep(150); await tab.shot(`${lang}-${width}-4-crash.png`); }
  const took = await waitFor(tab, `${PH} === 'end' && !document.getElementById('screen-end').hidden`, 5000);
  const elapsed = await tab.eval('performance.now() - window.__tHit');
  if (took < 0) { say('끝 화면이 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  if (opts.reduced ? elapsed > 1000 : elapsed > 2500) say(`부딪힘 → 끝 화면 ${Math.round(elapsed)}ms`);
  await waitFor(tab, `!document.getElementById('res-rank-body').hidden || document.getElementById('res-rank').hidden`, 4000);
  await sleep(200);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`끝 화면 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const fin = await tab.eval(ST);
  const digits = (t) => t.replace(/[^\d]/g, '');
  const res = await tab.eval(`({ score: document.getElementById('res-score').textContent, newBest: !document.getElementById('res-newbest').hidden, gates: document.getElementById('res-gates').textContent,
    time: document.getElementById('res-time').textContent, tier: document.getElementById('res-tier').textContent, best: localStorage.getItem('ski_best_v1'), rank: !document.getElementById('res-rank').hidden,
    top: document.getElementById('res-top').textContent, beat: document.getElementById('res-beat').textContent, others: document.getElementById('res-others').textContent, scr: ${SCREENS} })`);
  if (digits(res.score) !== String(fin.score) || fin.score < 150 || !res.newBest || digits(res.gates) !== String(fin.gatesPassed) || res.best !== String(fin.score) || !/\d/.test(res.time) || !fin.crash) say(`결과 카드가 다름 ${JSON.stringify(res)} ${JSON.stringify(fin)}`);
  if (!R.tiers.includes(res.tier)) say(`등급 이름이 이상함 "${res.tier}"`);
  if (!res.rank || !/\d/.test(res.top) || !res.others.includes('7')) say(`서버 백분위가 안 보임 ${JSON.stringify(res)}`);
  else note(`${res.score} m · 기문 ${res.gates} · ${res.time} · ${res.tier} · ${res.top} · ${res.beat} · ${res.others}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.retry) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.retry}"`);
  if (endInfo.ads > 1) say(`끝 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.ski-eyebrow, .ski-score-line, .ski-newbest, .ski-best, .ski-stat dt, .ski-stat dd, .ski-tier-name, .ski-tier-label, .ski-top, .ski-beat, .ski-others, .mg-end-retry')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-5-end.png`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`공유 주소가 깨끗한 주소가 아님: ${share.url}`);
  if (!digits(share.text).includes(String(fin.score)) || !share.text.includes(res.tier)) say(`공유 문구에 점수/등급이 없음: ${share.text}`);

  // 5) 다시 하기 → 준비(start 그대로) → 탭 → start 2 → 부딪힘 → done 2
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ start: ${COUNT('start')}, scr: ${SCREENS}, phase: ${PH}, score: window.SKI_APP.state().score, best: document.getElementById('hud-best').textContent, hint: !document.getElementById('tap-hint').hidden })`);
  if (again.start !== 1 || !again.scr.play || again.phase !== 'ready' || again.score !== 0 || digits(again.best) !== String(fin.score) || !again.hint) say(`다시 하기가 다름 ${JSON.stringify(again)}`);
  await tab.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: fr.rx, y: fr.y, button: 'left', clickCount: 1 });
  await tab.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: fr.rx, y: fr.y, button: 'left', clickCount: 1 });
  await sleep(100);
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 첫 탭 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  await tab.eval('window.SKI_APP.steer(0); window.SKI_APP.timeScale(5); 1');
  if ((await waitFor(tab, `${PH} === 'end'`, 20000)) < 0) say('다시 하기 판이 끝나지 않음');
  await sleep(200);
  const a2 = await tab.eval(`({ done: ${COUNT('done')}, score: document.getElementById('res-score').textContent, bestLine: document.getElementById('res-best').textContent })`);
  if (a2.done !== 2 || !a2.bestLine) say(`다시 하기 결과가 다름 ${JSON.stringify(a2)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ski-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 스키 활강 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 → 준비(캔버스·dpr·제자리) → 누르기로 출발·좌/우 조종·자동 조종 150 m·일시정지 → 부딪힘 → 끝 화면(점수·기문·등급·최고·백분위·공통 끝 화면) → 다시 하기`);
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
