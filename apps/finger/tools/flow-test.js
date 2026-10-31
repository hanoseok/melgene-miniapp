#!/usr/bin/env node
/**
 * 손가락 룰렛 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/finger) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다. 시간을 줄이려고 페이지의 performance.now 를 WARP 배로 빠르게 돌린다.
 * 진짜 멀티터치: CDP Input.dispatchTouchEvent(touchPoints 여러 개, 터치 에뮬레이션 maxTouchPoints 10) → 브라우저가 Pointer Events(touch)를 만든다.
 * 마우스: CDP Input.dispatchMouseEvent(터치 에뮬레이션 없음, maxTouchPoints 0 → 클릭 모드).
 *
 * 폭 < 768 (터치):
 *   시작 화면(h1 검색어, 판 화면 숨김, 맨 끝 mg-ad-start 1개, 광고 1개 보임, FAQ 없음, 넘침·단어 잘림 없음, 기본 = 1명)
 *   → 판 열기(start 아직 0, 광고 안 보임) → 손가락 1개(track('start') 1, "최소 2" 안내) → 3개(기다림 시작) → 하나 떼기(기다림 다시) →
 *     11개 올리기(10개까지만, "10개까지" 안내) → 3개로 → 가만히 → 뽑기(1개 is-win, 나머지 is-out) → 결과(track('done') 1, 제목·설명,
 *     공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함) → 손가락 떼도 결과 그대로
 *   → 다시 하기(판 비움, 결과 숨김) → 설정 → 팀 3 → 판 열기 → 손가락 7개 → 팀 결과(크기 3·2·2, 팀 색 번호, 팀 줄 3개, start 2 / done 2, 최근 기록 2줄)
 *   → 다시 열면 설정(팀 3) 유지, 기록 없음(메모리만) · 콘솔 오류 0
 * 폭 ≥ 768 (마우스): 여러 명(N=2) → 클릭 3번(점 3, Go 꺼짐) → 점 하나 다시 클릭(지움) → 2번 더 클릭(4) → Go → 2명 is-win → 결과 · 콘솔 오류 0
 * + 움직임 줄이기 한 번(바로 결과).
 *
 * 실행: node tools/flow-test.js                         (en,ko,th × 360,1440)
 *       node tools/flow-test.js en,zh 360,375,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'finger-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8861, MOCK_PORT = 8862, CDP_PORT = 9861;
const WARP = 3;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  const real = performance.now.bind(performance); const t0 = real(); performance.now = () => t0 + (real() - t0) * ${WARP}; })();`;

class Tab {
  constructor(ws) {
    this.ws = ws; this.n = 0; this.wait = new Map(); this.errors = []; this.onload = null; this.active = [];
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
  async rect(sel) {
    return this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 30)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
  }
  async tap(sel) {
    const r = await this.rect(sel);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await this.click(r.x + r.w / 2, r.y + r.h / 2);
  }
  async click(x, y) {
    await sleep(30);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  // 멀티터치: 지금 화면에 닿아 있는 손가락 목록 전체를 보낸다(새 손가락 = touchStart, 뗀 손가락 = 남은 목록으로 touchEnd)
  async touches(list) {
    const prev = this.active;
    const added = list.filter((p) => !prev.some((q) => q.id === p.id));
    const removed = prev.filter((q) => !list.some((p) => p.id === q.id));
    const pts = (l) => l.map((p) => ({ x: p.x, y: p.y, id: p.id, radiusX: 8, radiusY: 8, force: 1 }));
    if (removed.length) {
      await this.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: pts(removed) });
    }
    if (added.length) {
      await this.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts(list) });
    }
    this.active = list.slice();
    await sleep(60);
  }
  async releaseAll() { if (this.active.length) await this.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }).catch(() => {}); this.active = []; await sleep(60); }
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
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 10 });
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
// 글꼴: 이 언어 글자를 그릴 글꼴이 실제로 있는지(document.fonts.check) — 제목 글꼴 또는 대체 글꼴
const GLYPHS = { th: 'สุ่มนิ้ว', vi: 'Chọn ngẫu nhiên bằng ngón tay', zh: '手指轮盘随机选人', ru: 'Выбор пальцем', ja: '指ルーレット', ko: '손가락 룰렛' };
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, play: !document.getElementById('screen-play').hidden, result: !document.getElementById('result').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const APPST = `({ phase: FINGER_APP.phase(), count: FINGER_APP.count(), mode: FINGER_APP.inputMode(), status: document.getElementById('pad-status').textContent, p: +getComputedStyle(document.getElementById('pad')).getPropertyValue('--p'), go: !document.getElementById('go-btn').disabled, clickBar: !document.getElementById('click-bar').hidden })`;

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(40); }
  return -1;
}
// 판 안의 손가락 위치(겹치지 않게 격자)
async function padSpots(tab, n) {
  const r = await tab.rect('#pad');
  const cols = 3, rows = Math.ceil(n / cols) || 1;
  return Array.from({ length: n }, (_, i) => ({ id: i + 1, x: Math.round(r.x + r.w * ((i % cols) + 0.5) / cols), y: Math.round(r.y + r.h * (Math.floor(i / cols) + 0.5) / (rows + 0.6)) }));
}

async function checkEnd(tab, T, say) {
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== T.result.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${T.result.again}"`);
  if (endInfo.ads > 1) say(`결과 화면에 광고 ${endInfo.ads}개`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소가 아님: ${share.url}`);
}

async function runTouch(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const U = T.ui, R = T.result;
  const tag = `[${lang} ${width} 터치${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length, mode: FINGER_APP.settings().mode,
      nBox: !document.getElementById('n-box').hidden, tBox: !document.getElementById('teams-box').hidden, mtp: navigator.maxTouchPoints }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.play || !st.adLast || st.ads !== 1 || st.faq) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  if (st.mode !== 'one' || st.nBox || st.tBox) say(`기본 설정(1명, N·팀 칸 숨김)이 아님 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.fg-h1, .fg-hook, .fg-btn, .fg-seg-btn, .fg-label, .fg-fair')`)).forEach((w) => say(`시작 화면 ${w}`));
  if (GLYPHS[lang]) {
    const fc = await tab.eval(`(async () => { const cs = getComputedStyle(document.querySelector('.fg-h1-main')); const fam = cs.fontFamily.split(',')[0];
      const faces = await document.fonts.load(cs.fontWeight + ' 30px ' + fam, ${JSON.stringify(GLYPHS[lang])}); return { ff: cs.fontWeight + ' ' + fam, ok: faces.length > 0 }; })()`);
    if (!fc.ok) say(`글꼴이 ${lang} 글자를 그리지 못함: ${fc.ff}`);
  }
  // 다른 모드 칸이 열리는지 · 넘침 없는지
  await tab.tap('#mode-n');
  await tab.tap('#n-more');
  const sN = await tab.eval(`({ s: FINGER_APP.settings(), v: document.getElementById('n-value').textContent, box: !document.getElementById('n-box').hidden })`);
  if (sN.s.mode !== 'n' || sN.s.n !== 3 || sN.v !== fmt(U.nValue, { n: 3 }) || !sN.box) say(`여러 명 설정이 다름 ${JSON.stringify(sN)}`);
  await tab.tap('#mode-teams');
  (await tab.eval(TEXT_FIT + `('.fg-seg-btn, .fg-label, .fg-step-value')`)).forEach((w) => say(`설정 화면 ${w}`));
  o = await tab.eval(OVERFLOW); if (o) say(`설정 화면 가로 넘침 ${o}px`);
  await tab.shot(`${lang}-${width}-1-setup.png`);
  await tab.tap('#mode-one');

  // 2) 판 열기
  await tab.tap('#start-btn');
  const sc = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, start: ${COUNT('start')}, st: ${APPST}, banner: document.getElementById('play-banner').textContent })`);
  if (sc.scr.setup || !sc.scr.play || sc.scr.result || sc.st.phase !== 'wait' || sc.banner !== U.bannerOne) say(`판 화면이 다름 ${JSON.stringify(sc)}`);
  if (sc.ads) say(`판 화면에 광고가 보임 (${sc.ads})`);
  if (sc.start) say('판만 열었는데 track(start)');
  if (sc.st.status !== U.waitTouch || sc.st.clickBar) say(`터치 기기 첫 안내가 다름 ${JSON.stringify(sc.st)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`판 화면 가로 넘침 ${o}px`);
  const spots = await padSpots(tab, 11);
  // 페이지가 스크롤되지 않아야 함
  const sy0 = await tab.eval('scrollY');

  // 3) 손가락 1개 → 3개 → 하나 떼기 → 11개(10개까지) → 3개
  await tab.touches(spots.slice(0, 1));
  let s1 = await tab.eval(APPST);
  if (s1.count !== 1 || s1.mode !== 'touch' || s1.status !== fmt(U.needMore, { c: 1, m: 2 })) say(`손가락 1개 상태가 다름 ${JSON.stringify(s1)}`);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`첫 손가락 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  await tab.touches(spots.slice(0, 3));
  await sleep(CORE.STABLE_MS / WARP * 0.5);
  s1 = await tab.eval(APPST);
  if (s1.count !== 3 || s1.phase !== 'hold' || !(s1.p > 0.2) || s1.status !== U.hold) say(`손가락 3개 기다림이 다름 ${JSON.stringify(s1)}`);
  await tab.shot(`${lang}-${width}-2-hold.png`);
  await tab.touches(spots.slice(0, 2));
  s1 = await tab.eval(APPST);
  if (s1.count !== 2 || !(s1.p < 0.15)) say(`손가락을 떼도 기다림이 처음부터가 아님 ${JSON.stringify(s1)}`);
  await tab.touches(spots.slice(0, 11));
  s1 = await tab.eval(APPST);
  if (s1.count !== CORE.MAX_TOUCHES || s1.status !== U.maxed) say(`손가락 11개인데 10개 제한이 아님 ${JSON.stringify(s1)}`);
  if ((await tab.eval('scrollY')) !== sy0) say('손가락을 올렸는데 페이지가 스크롤됨');
  await tab.touches(spots.slice(0, 3));
  const p3 = await tab.eval(`FINGER_APP.points().map((p) => p.color)`);
  if (new Set(p3).size !== 3) say(`손가락 3개 색이 서로 다르지 않음 ${p3}`);
  // 4) 가만히 → 뽑기 → 결과
  const took = await waitFor(tab, `FINGER_APP.phase() === 'result'`, CORE.STABLE_MS / WARP + 4000);
  if (took < 0) { say('결과가 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  await sleep(150);
  const res = await tab.eval(`({ pts: FINGER_APP.points(), last: FINGER_APP.last(), title: document.getElementById('res-title').textContent, sub: document.getElementById('res-sub').textContent, teams: document.getElementById('res-teams').hidden, done: ${COUNT('done')}, scr: ${SCREENS}, hist: document.querySelectorAll('#history .fg-hist-row').length })`);
  if (res.done !== 1) say(`결과 뒤 track('done') ${res.done}회`);
  const wins = res.pts.filter((p) => p.win), outs = res.pts.filter((p) => p.out);
  if (wins.length !== 1 || outs.length !== 2 || !res.last || res.last.k !== 3 || res.last.winners[0] !== wins[0].id) say(`뽑힌 손가락이 다름 ${JSON.stringify(res)}`);
  if (res.title !== R.titleOne || res.sub !== fmt(R.subOne, { k: 3 }) || !res.teams || !res.scr.result || res.hist !== 1) say(`결과 화면이 다름 ${JSON.stringify(res)}`);
  await checkEnd(tab, T, say);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.fg-h2, .fg-h3, .fg-btn, .fg-res-kicker, .fg-res-sub, .fg-hist-what, .mg-end-retry')`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.eval(`document.getElementById('pad').scrollIntoView({ block: 'start', behavior: 'instant' }); 1`);
  await tab.shot(`${lang}-${width}-3-result.png`);
  await tab.releaseAll();
  const after = await tab.eval(`({ phase: FINGER_APP.phase(), n: FINGER_APP.points().filter((p) => p.win).length })`);
  if (after.phase !== 'result' || after.n !== 1) say(`손가락을 떼자 결과가 사라짐 ${JSON.stringify(after)}`);
  note(`${tag} 1명 뽑기 ${(took / 1000).toFixed(1)}초(×${WARP}) · ${res.last.winners[0]} / 3`);
  if (opts.reduced) { tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }

  // 5) 다시 하기 → 판 비움
  await tab.tap('[data-mg-end] .mg-end-retry');
  const ag = await tab.eval(`({ st: ${APPST}, scr: ${SCREENS}, n: document.querySelectorAll('#dots .fg-dot').length })`);
  if (ag.st.phase !== 'wait' || ag.st.count || ag.n || ag.scr.result) say(`다시 하기 뒤 판이 비지 않음 ${JSON.stringify(ag)}`);
  // 6) 설정 → 팀 3 → 7명
  await tab.tap('#settings-btn');
  if (!(await tab.eval(`${SCREENS}.setup`))) say('설정 버튼이 시작 화면으로 가지 않음');
  await tab.tap('#mode-teams');
  await tab.tap('#teams-3');
  await tab.tap('#start-btn');
  if ((await tab.eval(`document.getElementById('play-banner').textContent`)) !== fmt(U.bannerTeams, { t: 3 })) say('팀 안내가 다름');
  const sp7 = await padSpots(tab, 7);
  await tab.touches(sp7);
  if ((await tab.eval(COUNT('start'))) !== 2) say(`두 번째 판 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
  if ((await waitFor(tab, `FINGER_APP.phase() === 'result'`, CORE.STABLE_MS / WARP + 4000)) < 0) say('팀 결과가 나오지 않음');
  await sleep(150);
  const tr = await tab.eval(`({ pts: FINGER_APP.points(), last: FINGER_APP.last(), lines: [...document.querySelectorAll('#res-teams .fg-team-name')].map((e) => e.textContent), title: document.getElementById('res-title').textContent, done: ${COUNT('done')}, hist: document.querySelectorAll('#history .fg-hist-row').length })`);
  const sizes = tr.last ? tr.last.sizes.slice().sort().join() : '';
  if (sizes !== '2,2,3' || tr.pts.some((p) => !p.team) || tr.pts.some((p) => p.win || p.out)) say(`팀 결과가 다름 ${JSON.stringify(tr)}`);
  if (tr.lines.length !== 3 || tr.lines[0] !== fmt(R.teamLine, { name: R.teamNames[0], c: tr.last.sizes[0] }) || tr.title !== fmt(R.titleTeams, { t: 3 })) say(`팀 줄이 다름 ${JSON.stringify(tr.lines)}`);
  if (tr.done !== 2 || tr.hist !== 2) say(`두 번째 판 done/기록 ${tr.done}/${tr.hist}`);
  for (let t = 1; t <= 3; t++) if (tr.pts.filter((p) => p.team === String(t)).length !== tr.last.sizes[t - 1]) say(`팀 ${t} 색 손가락 수가 결과와 다름`);
  o = await tab.eval(OVERFLOW); if (o) say(`팀 결과 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.fg-team-name, .fg-hist-what, .fg-res-sub')`)).forEach((w) => say(`팀 결과 ${w}`));
  await tab.eval(`document.getElementById('pad').scrollIntoView({ block: 'start', behavior: 'instant' }); 1`);
  await tab.shot(`${lang}-${width}-4-teams.png`);
  await tab.releaseAll();
  // 7) 다시 열면 설정 유지, 기록 없음
  await tab.goto(base);
  const rl = await tab.eval(`({ s: FINGER_APP.settings(), h: FINGER_APP.history().length, start: ${COUNT('start')} })`);
  if (rl.s.mode !== 'teams' || rl.s.teams !== 3 || rl.h || rl.start) say(`다시 열었을 때 설정/기록이 다름 ${JSON.stringify(rl)}`);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function runMouse(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui, R = T.result;
  const tag = `[${lang} ${width} 마우스]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, false);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  const st = await tab.eval(`({ ads: ${VISIBLE_ADS}, o: ${OVERFLOW} })`);
  if (st.ads !== 1 || st.o) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  await tab.tap('#mode-n');   // 기본 N = 2
  await tab.tap('#start-btn');
  let s = await tab.eval(APPST);
  if (s.status !== U.waitClick || !s.clickBar || s.go) say(`클릭 모드 첫 안내가 다름 ${JSON.stringify(s)}`);
  const r = await tab.rect('#pad');
  const at = (fx, fy) => [r.x + r.w * fx, r.y + r.h * fy];
  await tab.click(...at(0.2, 0.2));
  if ((await tab.eval(COUNT('start'))) !== 1) say(`첫 클릭 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  await tab.click(...at(0.8, 0.2));
  await tab.click(...at(0.5, 0.5));
  s = await tab.eval(APPST);
  if (s.count !== 3 || s.mode !== 'click' || !s.go || s.status !== U.clickHint) say(`점 3개(N=2 → 최소 3)에서 Go 가 켜지지 않음 ${JSON.stringify(s)}`);
  await tab.click(...at(0.5, 0.5));   // 다시 눌러 지움
  s = await tab.eval(APPST);
  if (s.count !== 2 || s.go || s.status !== fmt(U.needMore, { c: 2, m: 3 })) say(`점 지우기가 다름 ${JSON.stringify(s)}`);
  await tab.click(...at(0.3, 0.75));
  await tab.click(...at(0.75, 0.7));
  s = await tab.eval(APPST);
  if (s.count !== 4 || !s.go || s.status !== U.clickHint) say(`점 4개에서 Go 가 켜지지 않음 ${JSON.stringify(s)}`);
  (await tab.eval(TEXT_FIT + `('.fg-click-hint, .fg-btn, .fg-status, .fg-banner')`)).forEach((w) => say(`클릭 모드 ${w}`));
  await tab.shot(`${lang}-${width}-m1-dots.png`);
  await tab.tap('#go-btn');
  if ((await waitFor(tab, `FINGER_APP.phase() === 'result'`, CORE.GO_MS / WARP + 4000)) < 0) say('Go 뒤 결과가 나오지 않음');
  await sleep(150);
  const res = await tab.eval(`({ pts: FINGER_APP.points(), title: document.getElementById('res-title').textContent, sub: document.getElementById('res-sub').textContent, done: ${COUNT('done')} })`);
  if (res.pts.filter((p) => p.win).length !== 2 || res.pts.filter((p) => p.out).length !== 2 || res.pts.some((p) => p.kind !== 'dot')) say(`클릭 모드 결과(2명)가 다름 ${JSON.stringify(res.pts)}`);
  if (res.title !== fmt(R.titleN, { n: 2 }) || res.sub !== fmt(R.subN, { n: 2, k: 4 }) || res.done !== 1) say(`클릭 모드 결과 글이 다름 ${JSON.stringify(res)}`);
  await checkEnd(tab, T, say);
  await tab.click(...at(0.9, 0.9));
  if ((await tab.eval('FINGER_APP.count()')) !== 4) say('결과 뒤 판을 눌렀는데 점이 바뀜');
  await tab.eval(`document.getElementById('pad').scrollIntoView({ block: 'start', behavior: 'instant' }); 1`);
  await tab.shot(`${lang}-${width}-m2-result.png`);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

const note = (m) => console.log(`    · ${m}`);
async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'finger-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 손가락 룰렛 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기, 시계 ×${WARP}) — http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS.find((w) => w < 768) || 360, { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const touch = width < 768;
      const res = touch ? await runTouch(lang, width, report, opts) : await runMouse(lang, width, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] ${touch ? '멀티터치: 1개 → 3개(기다림) → 떼기(다시) → 11개(10개 제한) → 3개 → 뽑기 → 결과·끝 화면' + (opts.reduced ? '' : ' → 다시 하기 → 팀 3 × 7명 → 다시 열기') : '마우스 클릭 모드: 점 3(Go 켜짐) → 지우기(2, Go 꺼짐) → 4 → Go → 2명 → 결과·끝 화면'}`);
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
