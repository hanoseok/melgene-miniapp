#!/usr/bin/env node
/**
 * 오늘 뭐 먹지 메뉴 뽑기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/lunch) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작(티징만: 맨 끝 mg-ad-start 1개, FAQ·고르기 UI 없음) → 시작 → 고르기(광고 1자리, 끼니 4·기분 4, 후보 개수가 core 와 같음, 점심 + 기분 태그 "하나라도")
 *   → 뽑기(track('start') 1, 릴이 돌고 버튼 잠금, 끝나면 결과 화면 + track('done') 1)
 *   → 결과: 뽑힌 메뉴 하나(언어 파일 메뉴·고른 조건 안, 이모지·끼니 표시), 공통 끝 화면 순서(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   → 이거 제외(토스트, 새 판 start/done, 제외한 메뉴는 다시 안 나옴) · 다시 뽑기 · 끝 화면 다시 하기 · 조건 바꾸기(제외 개수 표시 → 다시 넣기)
 *   → 후보를 모두 제외하면 고르기 화면 + 안내 + 뽑기 잠김 → 다시 넣기로 풀림
 *   → 다시 열면 마지막 끼니·기분이 그대로(localStorage) · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음(메뉴 이름 전부 릴 칸·결과 이름에) · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 릴 애니메이션 없이 바로 결과.
 *
 * 실행: node tools/flow-test.js                       (en,ko,ru × 360,1440)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'lunch-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ru').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8761, MOCK_PORT = 8762, CDP_PORT = 9761;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 페이지 스크립트보다 먼저: window.track 에 무엇이 들어오든 부를 때마다 __tracks 에 남긴다
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
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await sleep(40);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async shot(file) {
    if (!SHOTS) return;
    await this.eval('window.scrollTo(0, 0); 1');
    const r = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
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
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, pick: !document.getElementById('screen-pick').hidden, result: !document.getElementById('screen-result').hidden }))()`;
// 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만 — CJK·태국어는 어디서나 줄바꿈 가능)
const TEXT_FIT = `((sel) => {
  const bad = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.offsetParent) return;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto') bad.push('넘침: ' + el.textContent.trim().slice(0, 30));
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const re = /[^\\s\\u00a0\\u202f\\-–—]+/g; let m;
      while ((m = re.exec(node.data))) {
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff\\uac00-\\ud7af]/.test(m[0])) continue;
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

async function waitIdle(tab, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (!(await tab.eval('window.LUNCH_APP.busy()'))) return Date.now() - t0; await sleep(50); }
  return -1;
}
const MENU_OF = (T) => CORE.parseMenus(T.menus);

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const P = T.pick;
  const R = T.result;
  const MENUS = MENU_OF(T);
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  const info = { anim: 0 };
  const pr = new Intl.PluralRules(lang);
  const cnt = (n) => G.fmt(T.count[pr.select(n)] || T.count.other, { n });
  const names = (o) => o;
  void names;
  const poolNames = async () => (await tab.eval('window.LUNCH_APP.pool()')).map((i) => MENUS[i].name);
  const resName = () => tab.eval(`document.getElementById('res-name').textContent`);

  // 1) 시작 화면 (티징만)
  const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0] && !!a[0].offsetParent); })(), visAds: [...document.querySelectorAll('.mg-ad:not(.mg-ad-start)')].filter((a) => a.offsetParent).length,
    visFaq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.offsetParent).length, h1: document.querySelector('h1').textContent.trim(),
    ui: !!document.querySelector('#screen-start [data-meal], #screen-start [data-tag], #screen-start #reel') }))()`);
  if (!st.s.start || st.s.pick || st.s.result) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.visAds || st.visFaq || st.ui) say('시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/고르기 UI 가 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lc-h1, .lc-badge, .lc-btn, .lc-hook, .lc-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);

  // 2) 고르기 화면
  await tab.tap('#start-btn');
  if (!(await tab.eval(SHOWN)).pick) say('시작 버튼 → 고르기 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 0) say('고르기 화면만 열었는데 track(start)');
  const ads = await tab.eval(`[...document.querySelectorAll('.mg-ad')].filter((a) => a.closest('#screen-pick')).length`);
  if (ads !== 1) say(`고르기 화면 광고 자리 ${ads}개 (1)`);
  const ui = await tab.eval(`({ meals: document.querySelectorAll('[data-meal]').length, tags: document.querySelectorAll('[data-tag]').length })`);
  if (ui.meals !== 4 || ui.tags !== 4) say(`끼니 ${ui.meals} / 기분 ${ui.tags} 버튼 (4/4)`);
  await tab.tap('#meal-l');
  if ((await tab.eval(`document.getElementById('meal-l').getAttribute('aria-checked')`)) !== 'true' || (await tab.eval(`document.querySelectorAll('[data-meal][aria-checked="true"]').length`)) !== 1) say('점심 선택이 안 됨');
  const lunchAll = CORE.pool(MENUS, 'l', [], null).length;
  if ((await tab.eval(`document.getElementById('cand-count').textContent`)) !== cnt(lunchAll)) say(`후보 개수 "${await tab.eval(`document.getElementById('cand-count').textContent`)}" ≠ "${cnt(lunchAll)}"`);
  await tab.tap('#tag-s');
  if ((await tab.eval(`document.getElementById('tag-s').getAttribute('aria-pressed')`)) !== 'true') say('매운 태그가 안 켜짐');
  const spicy = CORE.pool(MENUS, 'l', ['s'], null).length;
  if ((await tab.eval(`document.getElementById('cand-count').textContent`)) !== cnt(spicy)) say('매운 태그 후보 개수가 core 와 다름');
  await tab.tap('#tag-l');
  const both = CORE.pool(MENUS, 'l', ['s', 'l'], null).length;
  if ((await tab.eval(`document.getElementById('cand-count').textContent`)) !== cnt(both) || both <= spicy) say('태그 둘 = 하나라도 맞는 후보가 아님');
  o = await tab.eval(OVERFLOW); if (o) say(`고르기 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lc-h2, .lc-label, .lc-hint, .lc-seg-btn, .lc-chip, .lc-count, .lc-btn, .lc-mini')`)).forEach((w) => say(`고르기 화면 ${w}`));
  const segH = await tab.eval(`[...document.querySelectorAll('.lc-seg-btn')].map((b) => Math.round(b.getBoundingClientRect().height))`);
  if (new Set(segH).size > 2) say(`끼니 버튼 높이가 제각각 ${segH}`);
  // 메뉴 이름 전부가 릴 칸에 들어가는가 (첫 칸에 하나씩 넣어 본다)
  const fitReel = await tab.eval(`(() => { const nm = document.querySelector('#reel-strip .lc-cell-name'); const cell = nm.closest('.lc-cell'); const keep = nm.textContent; const out = [];
    for (const n of ${JSON.stringify(MENUS.map((m) => m.name))}) { nm.textContent = n; if (cell.scrollHeight > cell.clientHeight + 1) out.push(n + ' 칸 높이 넘침'); ${TEXT_FIT}('#reel-strip .lc-cell-name').forEach((w) => out.push(n + ' ' + w)); }
    nm.textContent = keep; return out; })()`);
  fitReel.forEach((w) => say(`릴 칸 ${w}`));
  await tab.shot(`${lang}-${width}-2-pick.png`);

  // 3) 뽑기 → 결과
  const t0 = Date.now();
  await tab.tap('#spin-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`뽑기 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  if (!opts.reduced) {
    const mid = await tab.eval(`({ busy: window.LUNCH_APP.busy(), spinDis: document.getElementById('spin-btn').disabled, cells: document.querySelectorAll('#reel-strip .lc-cell').length, spinning: document.getElementById('reel').classList.contains('is-spinning'), s: ${SHOWN}, done: ${COUNT('done')} })`);
    if (!mid.busy || !mid.spinDis || !mid.spinning || mid.cells < 10) say(`릴이 도는 동안 표시/잠금이 없음 ${JSON.stringify(mid)}`);
    if (!mid.s.pick || mid.s.result) say('릴이 도는 동안 고르기 화면이 아님');
    if (mid.done) say('릴이 멈추기 전에 track(done)');
    await sleep(500);
    await tab.shot(`${lang}-${width}-3-spinning.png`);
  }
  const idle = await waitIdle(tab, 6000);
  info.anim = Date.now() - t0;
  if (idle < 0) say('릴이 멈추지 않음');
  else if (!opts.reduced && (info.anim < 1500 || info.anim > 4200)) say(`릴 시간 ${info.anim}ms (약 2~3초)`);
  else if (opts.reduced && info.anim > 800) say(`움직임 줄이기인데 ${info.anim}ms`);
  if (!(await tab.eval(SHOWN)).result) say('릴이 멈춘 뒤 결과 화면이 안 보임');
  if ((await tab.eval(COUNT('done'))) !== 1) say(`결과 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  await sleep(150);
  const r1 = await tab.eval('window.LUNCH_APP.result()');
  const m1 = MENUS[r1];
  if (!m1) say('결과 번호가 메뉴 목록에 없음');
  else {
    if ((await resName()) !== m1.name) say(`결과 이름 "${await resName()}" ≠ "${m1.name}"`);
    if ((await tab.eval(`document.getElementById('res-emoji').textContent`)) !== m1.emoji) say('결과 이모지가 다름');
    if (!m1.meals.includes('l') || !(m1.tags.includes('s') || m1.tags.includes('l'))) say(`결과 "${m1.name}" 가 고른 조건(점심 + 매운/가벼운) 밖`);
  }
  if ((await tab.eval(`document.getElementById('res-meal').textContent`)) !== P.meals.l) say('결과의 끼니 표시가 다름');
  if ((await tab.eval(`document.querySelectorAll('#screen-result .lc-res-name').length`)) !== 1) say('결과 화면에 메뉴 이름이 하나가 아님');
  const order = await tab.eval(END_ORDER);
  if (order.join(',') !== ORDER) say(`끝 화면 순서 ${order.join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent,
    before: !!(document.getElementById('res-name').compareDocumentPosition(document.querySelector('[data-mg-end]')) & Node.DOCUMENT_POSITION_FOLLOWING),
    pickAds: [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent).length })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.again}"`);
  if (!endInfo.before) say('뽑힌 메뉴가 공통 끝 화면보다 위에 있지 않음');
  const share = await tab.eval('window.getShareData()');
  if (m1 && share.text !== G.fmt(R.shareText, { name: m1.name })) say(`공유 문구 "${share.text}"`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\/|[?&]lang=/.test(new URL(share.url).pathname + new URL(share.url).search)) say(`공유 주소에 언어가 들어감: ${share.url}`);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lc-h2, .lc-res-name, .lc-res-meal, .lc-mini, .lc-btn, .mg-end-retry, .mg-end-h')`)).forEach((w) => say(`결과 화면 ${w}`));
  // 메뉴 이름 전부가 결과 큰 글씨에 들어가는지
  const fitRes = await tab.eval(`(() => { const el = document.getElementById('res-name'); const keep = el.textContent; const out = [];
    for (const n of ${JSON.stringify(MENUS.map((m) => m.name))}) { el.textContent = n; ${TEXT_FIT}('#res-name').forEach((w) => out.push(n + ' ' + w)); }
    el.textContent = keep; return out; })()`);
  fitRes.forEach((w) => say(`결과 이름 ${w}`));
  await tab.shot(`${lang}-${width}-4-result.png`);

  // 4) 이거 제외 → 새 판, 제외한 메뉴는 다시 안 나옴
  await tab.tap('#exclude-btn');
  await sleep(120);
  const toastTxt = await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`);
  if (m1 && toastTxt !== G.fmt(R.excluded, { name: m1.name })) say(`제외 안내 "${toastTxt}" ≠ "${G.fmt(R.excluded, { name: m1.name })}"`);
  if ((await tab.eval(COUNT('start'))) !== 2) say(`이거 제외 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
  if ((await waitIdle(tab, 6000)) < 0) say('제외 뒤 릴이 멈추지 않음');
  if ((await tab.eval(COUNT('done'))) !== 2) say(`제외 뒤 track('done') ${await tab.eval(COUNT('done'))}회 (2)`);
  const ex1 = await tab.eval('window.LUNCH_APP.excluded()');
  if (ex1.join() !== String(r1)) say(`제외 목록 ${ex1}`);
  const r2 = await tab.eval('window.LUNCH_APP.result()');
  if (r2 === r1) say('제외한 메뉴가 다시 나옴');

  // 5) 다시 뽑기 · 끝 화면 다시 하기
  await tab.tap('#again-btn');
  if ((await tab.eval(COUNT('start'))) !== 3) say(`다시 뽑기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (3)`);
  if ((await waitIdle(tab, 6000)) < 0) say('다시 뽑기 릴이 멈추지 않음');
  if ((await tab.eval(COUNT('done'))) !== 3) say(`다시 뽑기 뒤 track('done') ${await tab.eval(COUNT('done'))}회 (3)`);
  if ((await tab.eval('window.LUNCH_APP.result()')) === r1) say('다시 뽑기에서 제외한 메뉴가 나옴');
  await tab.tap('[data-mg-end] .mg-end-retry');
  if ((await tab.eval(COUNT('start'))) !== 4) say('끝 화면 다시 하기가 다시 뽑지 않음');
  await waitIdle(tab, 6000);

  // 6) 조건 바꾸기 → 제외 개수 표시 → 다시 넣기
  await tab.tap('#change-btn');
  const ch = await tab.eval(`({ s: ${SHOWN}, cells: document.querySelectorAll('#reel-strip .lc-cell').length, ex: !document.getElementById('ex-line').hidden, exTxt: document.getElementById('ex-count').textContent })`);
  if (!ch.s.pick || ch.cells !== 1) say(`조건 바꾸기 → 고르기 화면 + 처음 릴이 아님 ${JSON.stringify(ch)}`);
  if (!ch.ex || ch.exTxt !== G.fmt(P.skipped, { n: 1 })) say(`제외 표시 "${ch.exTxt}" ≠ "${G.fmt(P.skipped, { n: 1 })}"`);
  const pc = await tab.eval(`document.getElementById('cand-count').textContent`);
  if (pc !== cnt(both - 1)) say(`제외 뒤 후보 개수 "${pc}" ≠ "${cnt(both - 1)}"`);
  await tab.tap('#ex-reset');
  if (!(await tab.eval(`document.getElementById('ex-line').hidden`)) || (await tab.eval('window.LUNCH_APP.excluded().length')) !== 0) say('다시 넣기가 제외를 비우지 않음');

  // 7) 후보를 모두 제외 → 안내 + 뽑기 잠김
  await tab.tap('#meal-n');
  for (const id of ['tag-l']) await tab.tap('#' + id); // 가벼운 끄기(지금 s, l 둘 다 켜짐)
  const nSpicy = CORE.pool(MENUS, 'n', ['s'], null).length;
  let guard = 0;
  while (guard++ < nSpicy + 2) {
    const sh = await tab.eval(SHOWN);
    if (sh.result) { await tab.tap('#exclude-btn'); await waitIdle(tab, 6000); continue; }
    if (sh.pick && !(await tab.eval(`document.getElementById('spin-btn').disabled`))) { await tab.tap('#spin-btn'); await waitIdle(tab, 6000); continue; }
    break;
  }
  const emp = await tab.eval(`({ s: ${SHOWN}, dis: document.getElementById('spin-btn').disabled, note: document.getElementById('pick-note').textContent, noteHidden: document.getElementById('pick-note').hidden })`);
  if (!emp.s.pick || !emp.dis || emp.noteHidden || emp.note !== P.noneLeft) say(`후보를 모두 제외한 뒤 상태 ${JSON.stringify(emp)}`);
  await tab.tap('#ex-reset');
  if ((await tab.eval(`document.getElementById('spin-btn').disabled`)) || !(await tab.eval(`document.getElementById('pick-note').hidden`))) say('다시 넣기 뒤에도 뽑기가 잠겨 있음');
  o = await tab.eval(OVERFLOW); if (o) say(`고르기 화면(안내) 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lc-note, .lc-ex-line, .lc-count')`)).forEach((w) => say(`고르기 화면 ${w}`));

  // 8) 다시 열면 마지막 끼니·기분 그대로 (n + 매운)
  await tab.goto(base);
  await tab.tap('#start-btn');
  const kept = await tab.eval(`({ meal: document.querySelector('[data-meal][aria-checked="true"]').getAttribute('data-meal'), tags: [...document.querySelectorAll('[data-tag][aria-pressed="true"]')].map((b) => b.getAttribute('data-tag')) })`);
  if (kept.meal !== 'n' || kept.tags.join() !== 's') say(`마지막 선택이 기억되지 않음 ${JSON.stringify(kept)}`);
  const shown = await poolNames();
  if (shown.length !== nSpicy) say(`기억한 조건의 후보 ${shown.length} ≠ ${nSpicy}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, anim: info.anim, last: m1 ? m1.name : '' };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lunch-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 오늘 뭐 먹지 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작→고르기(점심·태그)→뽑기 ${res.anim}ms→${res.last} · 제외·다시 뽑기·조건 바꾸기·전부 제외·기억`);
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
