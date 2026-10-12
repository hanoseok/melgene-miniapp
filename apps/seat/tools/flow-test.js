#!/usr/bin/env node
/**
 * 자리 바꾸기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/seat) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   첫 화면(h1 검색어, 결과 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음) → 예시 이름 20명 → 자리 하나 빈자리 · 이름 하나 고정 · 떨어뜨릴 짝 · 앞자리
 *   → 섞기(track('start') 1, 공개 중 잠금·건너뛰기 보임, 끝나면 track('done') 1)
 *   → 자리표: 모든 이름 한 번씩, 고정·빈자리·앞자리·떨어뜨리기 규칙, 이름이 칸에 들어감, 공통 끝 화면 순서(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   → 선생님 쪽 보기(교탁 아래·180°) · 텍스트 복사(토스트) · PNG 만들기
 *   → 공유 링크(#d=, 언어 없는 주소): 새 탭에서 열면 같은 자리표 + "공유된" 배지 + 기록 없음 + "나도 자리 바꾸기" → 입력으로(주소의 #d= 지움)
 *   → 잘못된 링크 안내 · 끝 화면 다시 하기 = 다시 섞기(start/done 한 번 더) · 다시 열면 마지막 입력 그대로(localStorage)
 *   → 불가능한 규칙(2×2 + 떨어뜨리기) 안내, start 기록 없음 · 숫자 하나(28) = 번호 28명 · 가로 넘침 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 연출 없이 바로 결과.
 *
 * 실행: node tools/flow-test.js                       (en,ko,th,ru × 360,375,1440)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'seat-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8771, MOCK_PORT = 8772, CDP_PORT = 9771;
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
  async tap(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await sleep(40);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async select(sel, value) {
    await this.eval(`(() => { const s = document.querySelector(${JSON.stringify(sel)}); s.value = ${JSON.stringify(value)}; s.dispatchEvent(new Event('change', { bubbles: true })); return s.value; })()`);
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
// 화면의 자리표: { teacher, deskFirst, seats: { 자리번호: { name, aisle, empty, on, clip } } }
const DOM_BOARD = `(() => { const b = document.getElementById('board'); const out = {};
  b.querySelectorAll('.st-seat').forEach((c) => { const n = c.querySelector('.st-name'); out[c.getAttribute('data-s')] = { name: n ? n.textContent : null, aisle: c.classList.contains('is-aisle'), empty: c.classList.contains('is-empty'), on: c.classList.contains('is-on'), clip: !!(n && n.classList.contains('is-clip')) }; });
  return { teacher: b.classList.contains('is-teacher'), deskFirst: b.firstElementChild.classList.contains('st-desk'), order: [...b.querySelectorAll('.st-seat')].map((c) => Number(c.getAttribute('data-s'))), seats: out }; })()`;
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';

async function waitIdle(tab, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (!(await tab.eval('window.SEAT_APP.busy()'))) return Date.now() - t0; await sleep(50); }
  return -1;
}
async function setNames(tab, text) {
  await tab.eval(`(() => { const t = document.getElementById('names'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
  await sleep(450); // 이름 읽기(180ms)·저장(250ms) 디바운스
}

function checkBoard(say, dom, names, rules, where) {
  const seated = Object.entries(dom.seats).filter(([, v]) => !v.aisle && !v.empty);
  const got = seated.map(([, v]) => v.name).sort();
  if (got.join('|') !== [...names].sort().join('|')) say(`${where}: 이름이 모두 한 번씩이 아님 (${got.length}/${names.length})`);
  if (Object.values(dom.seats).some((v) => !v.aisle && !v.on)) say(`${where}: 공개되지 않은 자리가 남음`);
  const at = {};
  seated.forEach(([s, v]) => { at[v.name] = Number(s); });
  (rules.blocked || []).forEach((s) => { if (!dom.seats[s] || !dom.seats[s].aisle) say(`${where}: 빈자리 ${s} 가 통로로 안 보임`); });
  (rules.pins || []).forEach(([n, s]) => { if (at[n] !== s) say(`${where}: ${n} 고정 자리 ${s} ≠ ${at[n]}`); });
  (rules.front || []).forEach((n) => { if (!(CORE.rowOf(at[n], rules.cols) < CORE.FRONT_ROWS)) say(`${where}: ${n} 이 앞 두 줄이 아님`); });
  (rules.apart || []).forEach(([a, b]) => { if (CORE.adjacent(at[a], at[b], rules.cols)) say(`${where}: ${a}·${b} 가 붙어 앉음`); });
  const clips = Object.values(dom.seats).filter((v) => v.clip).length;
  if (clips) say(`${where}: 칸에 안 들어가 말줄임된 이름 ${clips}개`);
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const U = T.ui;
  const R = T.result;
  const E = T.errors;
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

  // 1) 첫 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-seat'); const ads = [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent || a.classList.contains('mg-ad-start'));
    return { h1: document.querySelector('h1').textContent, result: !document.getElementById('result').hidden, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ads.length,
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.offsetParent).length, more: !document.getElementById('more').hidden }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (st.result || !st.adLast || st.ads !== 1 || st.faq || st.more) say(`첫 화면이 다름 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`첫 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.st-h1, .st-hook, .st-btn, .st-seg-btn, .st-mini, .st-label, .st-count-pill, .st-more-btn, .st-desk, .st-hint')`)).forEach((w) => say(`첫 화면 ${w}`));
  if (!(await tab.eval(`document.getElementById('mg-ad-start') === null && !!document.querySelector('.mg-ad-start')`))) say('mg-ad-start 없음');

  // 2) 이름 · 교실 · 규칙
  await tab.tap('#sample-btn');
  await sleep(100);
  const names = T.sample.slice();
  const s1 = await tab.eval(`window.SEAT_APP.state()`);
  if (s1.names.join('|') !== names.join('|')) say('예시 이름 버튼이 언어 파일 sample 을 넣지 않음');
  if ((await tab.eval(`document.getElementById('names-count').textContent`)) !== G.fmt(U.namesCount, { n: 20 })) say('이름 수 표시가 다름');
  const cols = CORE.DEFAULTS.cols;
  await tab.tap('#map .st-mseat[data-s="8"]');            // 빈자리
  await tab.tap('#mode-pin');
  if (await tab.eval(`document.getElementById('pin-pick').hidden`)) say('이름 고정 방식인데 이름 고르기가 안 보임');
  await tab.tap('#map .st-mseat[data-s="3"]');            // 이름을 안 골랐으면 안내
  await sleep(150);
  if ((await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`)) !== U.pinFirst) say('이름 없이 고정하려 할 때 안내(토스트)가 다름');
  await tab.select('#pin-name', names[0]);
  await tab.tap('#map .st-mseat[data-s="14"]');           // 고정 (둘째 줄 밖, 셋째 줄)
  await tab.tap('#more-btn');
  await tab.select('#apart-a', names[1]); await tab.select('#apart-b', names[2]); await tab.tap('#apart-add');
  await tab.select('#apart-a', names[3]); await tab.select('#apart-b', names[3]); await tab.tap('#apart-add');
  await sleep(150);
  if ((await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`)) !== E.samePair) say('같은 이름 두 개를 짝으로 넣을 때 안내(토스트)가 다름');
  await tab.select('#front-name', names[4]); await tab.tap('#front-add');
  await tab.select('#front-name', names[5]); await tab.tap('#front-add');
  const s2 = await tab.eval(`window.SEAT_APP.state()`);
  const rules = { cols, blocked: [8], pins: [[names[0], 14]], apart: [[names[1], names[2]]], front: [names[4], names[5]] };
  if (JSON.stringify([s2.blocked, s2.pins, s2.apart, s2.front]) !== JSON.stringify([[8], { [names[0]]: 14 }, [[names[1], names[2]]], [names[4], names[5]]])) say(`규칙 상태가 다름 ${JSON.stringify(s2)}`);
  if ((await tab.eval(`document.querySelectorAll('#pin-list .st-chip').length`)) !== 1 || (await tab.eval(`document.querySelectorAll('#apart-list .st-chip').length`)) !== 1 || (await tab.eval(`document.querySelectorAll('#front-list .st-chip').length`)) !== 2) say('규칙 목록 칩 수가 다름');
  if ((await tab.eval(`document.querySelector('#map .st-mseat[data-s="14"]').textContent`)) !== names[0]) say('지도의 고정 자리에 이름이 없음');
  if ((await tab.eval(`document.getElementById('seats-count').textContent`)) !== G.fmt(U.seatsCount, { n: 29 })) say('앉을 자리 수 표시가 다름');
  o = await tab.eval(OVERFLOW); if (o) say(`입력 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.st-chip-text, .st-select, .st-seg-btn, .st-mini, .st-label, .st-hint, .st-more-btn')`)).forEach((w) => say(`입력 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-input.png`);

  // 3) 섞기 → 공개 → 자리표
  const t0 = Date.now();
  await tab.tap('#shuffle-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`섞기 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  if (await tab.eval(`document.getElementById('result').hidden`)) say('섞기 → 결과가 안 보임');
  if (!(await tab.eval(`document.querySelector('.mg-ad-start').hidden`))) say('결과가 보이는데 mg-ad-start 가 그대로');
  if (!opts.reduced) {
    const mid = await tab.eval(`({ busy: window.SEAT_APP.busy(), skip: !document.getElementById('skip-btn').hidden, dis: document.getElementById('shuffle-btn').disabled, done: ${COUNT('done')} })`);
    if (!mid.busy || !mid.skip || !mid.dis) say(`공개 중 잠금/건너뛰기 표시가 없음 ${JSON.stringify(mid)}`);
    if (mid.done) say('공개가 끝나기 전에 track(done)');
    await sleep(500);
    await tab.shot(`${lang}-${width}-2-reveal.png`);
  }
  const idle = await waitIdle(tab, 6000);
  info.anim = Date.now() - t0;
  if (idle < 0) say('공개가 끝나지 않음');
  else if (!opts.reduced && (info.anim < 1500 || info.anim > 4500)) say(`공개 연출 ${info.anim}ms (약 3초)`);
  else if (opts.reduced && info.anim > 800) say(`움직임 줄이기인데 ${info.anim}ms`);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`결과 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  if (!(await tab.eval(`document.getElementById('skip-btn').hidden`))) say('공개 뒤에도 건너뛰기가 보임');
  await sleep(150);
  const dom1 = await tab.eval(DOM_BOARD);
  checkBoard(say, dom1, names, rules, '자리표');
  if (dom1.teacher || !dom1.deskFirst || dom1.order[0] !== 0) say('학생 쪽 보기(교탁 위, 0번 자리부터)가 아님');
  const last = await tab.eval('window.SEAT_APP.last()');
  if (!last || last.names.join('|') !== names.join('|') || last.seats.length !== 30) say('내부 결과가 이상함');
  else last.seats.forEach((k, s) => { if (k >= 0 && dom1.seats[s].name !== names[k]) say(`화면 자리 ${s} 이름이 내부 결과와 다름`); });
  const order = await tab.eval(END_ORDER);
  if (order.join(',') !== ORDER) say(`끝 화면 순서 ${order.join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.again}"`);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.st-h2, .st-seg-btn, .st-btn, .st-desk, .mg-end-retry')`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.shot(`${lang}-${width}-3-result.png`);

  // 4) 선생님 쪽 · 텍스트 · PNG
  await tab.tap('#view-teacher');
  const dom2 = await tab.eval(DOM_BOARD);
  if (!dom2.teacher || dom2.deskFirst || dom2.order[0] !== 29) say('선생님 쪽 보기(교탁 아래, 180°)가 아님');
  checkBoard(say, dom2, names, rules, '선생님 쪽');
  const txt = await tab.eval('window.SEAT_APP.text()');
  if (!txt.trim().endsWith(`[ ${U.desk} ]`) || !txt.startsWith(R.textTitle) || names.some((n) => !txt.includes(n))) say('텍스트 표(선생님 쪽)가 이상함');
  await tab.tap('#copy-btn');
  await sleep(350);
  if ((await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`)) !== R.copied) say('복사 안내 토스트가 다름');
  const png = await tab.eval('window.SEAT_APP.pngSize()');
  if (!(png > 5000)) say(`PNG 크기 ${png}`);
  await tab.tap('#view-student');

  // 5) 공유 링크
  const share = await tab.eval('window.getShareData()');
  if (share.text !== G.fmt(R.shareText, { n: 20 })) say(`공유 문구 "${share.text}"`);
  const su = new URL(share.url);
  if (!/^#d=[A-Za-z0-9_-]+$/.test(su.hash) || su.search) say(`공유 주소가 #d= 가 아님: ${share.url}`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(su.pathname)) say(`공유 주소에 언어가 들어감: ${su.pathname}`);
  const tab2 = await openTab(width, opts.reduced);
  await tab2.goto(base + '#nolang');
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto(base + su.hash);
  await sleep(250);
  const rs = await tab2.eval(`({ shared: window.SEAT_APP.shared(), badge: !document.getElementById('shared-badge').hidden, note: !document.getElementById('shared-note').hidden, result: !document.getElementById('result').hidden,
    start: ${COUNT('start')}, done: ${COUNT('done')}, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
  if (!rs.result || !rs.shared || !rs.badge || !rs.note) say(`공유 링크 결과 표시가 다름 ${JSON.stringify(rs)}`);
  if (rs.start || rs.done) say(`공유 링크 열기가 start/done 을 기록함 (${rs.start}/${rs.done})`);
  if (rs.retry !== R.makeOwn) say(`공유 결과의 다시 하기 라벨 "${rs.retry}" ≠ "${R.makeOwn}"`);
  const recv = await tab2.eval(DOM_BOARD);
  if (JSON.stringify(recv.seats) !== JSON.stringify(dom1.seats)) say('받은 사람의 자리표가 보낸 사람과 다름');
  if ((await tab2.eval(END_ORDER)).join(',') !== ORDER) say('공유 결과 끝 화면 순서가 다름');
  o = await tab2.eval(OVERFLOW); if (o) say(`공유 결과 가로 넘침 ${o}px`);
  await tab2.shot(`${lang}-${width}-4-shared.png`);
  await tab2.tap('[data-mg-end] .mg-end-retry');
  const mo = await tab2.eval(`({ result: !document.getElementById('result').hidden, hash: location.hash, shared: window.SEAT_APP.shared(), names: window.SEAT_APP.state().names.length })`);
  if (mo.result || mo.hash || mo.shared || mo.names !== 20) say(`"나도 자리 바꾸기" → 입력이 아님 ${JSON.stringify(mo)}`);
  await tab2.goto('about:blank');
  await tab2.goto(base + '#d=bm90LWEtY2hhcnQ');
  await sleep(300);
  const bl = await tab2.eval(`({ err: document.getElementById('error').textContent, result: !document.getElementById('result').hidden, hash: location.hash })`);
  if (bl.err !== E.badLink || bl.result || bl.hash) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
  tab2.errors.forEach((e) => say('콘솔 오류(받는 사람): ' + e));
  await tab2.send('Page.close').catch(() => {});

  // 6) 끝 화면 다시 하기 = 다시 섞기
  await tab.tap('[data-mg-end] .mg-end-retry');
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
  if ((await waitIdle(tab, 6000)) < 0) say('다시 섞기 공개가 끝나지 않음');
  if ((await tab.eval(COUNT('done'))) !== 2) say(`다시 섞기 뒤 track('done') ${await tab.eval(COUNT('done'))}회 (2)`);
  checkBoard(say, await tab.eval(DOM_BOARD), names, rules, '다시 섞은 자리표');
  // 건너뛰기
  if (!opts.reduced) {
    await tab.tap('#shuffle-btn');
    await sleep(200);
    await tab.tap('#skip-btn');
    await sleep(100);
    const sk = await tab.eval(`({ busy: window.SEAT_APP.busy(), done: ${COUNT('done')}, start: ${COUNT('start')} })`);
    if (sk.busy || sk.done !== 3 || sk.start !== 3) say(`건너뛰기 뒤 상태 ${JSON.stringify(sk)}`);
    checkBoard(say, await tab.eval(DOM_BOARD), names, rules, '건너뛴 자리표');
  }

  // 7) 다시 열면 마지막 입력 그대로
  await tab.goto(base);
  const kept = await tab.eval(`window.SEAT_APP.state()`);
  if (kept.names.join('|') !== names.join('|') || JSON.stringify([kept.blocked, kept.pins, kept.apart, kept.front]) !== JSON.stringify([s2.blocked, s2.pins, s2.apart, s2.front])) say(`마지막 입력이 기억되지 않음 ${JSON.stringify(kept)}`);
  if (await tab.eval(`document.getElementById('more').hidden`)) say('규칙이 있는데 규칙 칸이 접혀 있음');

  // 8) 불가능한 규칙 · 번호
  await setNames(tab, 'A\nB\nC\nD');
  for (let i = 0; i < 3; i++) await tab.tap('#rows-dec');
  for (let i = 0; i < 4; i++) await tab.tap('#cols-dec');
  const s3 = await tab.eval(`window.SEAT_APP.state()`);
  if (s3.rows !== 2 || s3.cols !== 2 || s3.blocked.length || Object.keys(s3.pins).length || s3.apart.length || s3.front.length) say(`교실 줄이기·이름 바꾸기 뒤 규칙 정리 ${JSON.stringify(s3)}`);
  await tab.select('#apart-a', 'A'); await tab.select('#apart-b', 'B'); await tab.tap('#apart-add');
  const startsBefore = await tab.eval(COUNT('start'));
  await tab.tap('#shuffle-btn');
  if ((await tab.eval(`document.getElementById('error').textContent`)) !== E.impossible) say('불가능한 규칙 안내가 다름');
  if ((await tab.eval(COUNT('start'))) !== startsBefore) say('불가능한데 track(start)');
  await setNames(tab, 'A\nB\nC\nD\nE');
  await tab.tap('#shuffle-btn');
  if ((await tab.eval(`document.getElementById('error').textContent`)) !== G.fmt(E.notEnoughSeats, { n: 5, s: 4 })) say('자리 부족 안내가 다름');
  await setNames(tab, '28');
  for (let i = 0; i < 3; i++) await tab.tap('#rows-inc');
  for (let i = 0; i < 4; i++) await tab.tap('#cols-inc');
  if ((await tab.eval(`document.getElementById('names-count').textContent`)) !== G.fmt(U.namesCount, { n: 28 })) say('숫자 하나(28) → 번호 28명이 아님');
  await tab.tap('#shuffle-btn');
  await waitIdle(tab, 6000);
  const dom3 = await tab.eval(DOM_BOARD);
  checkBoard(say, dom3, CORE.numberNames(28), { cols: 6 }, '번호 28명');
  o = await tab.eval(OVERFLOW); if (o) say(`번호 자리표 가로 넘침 ${o}px`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, anim: info.anim };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'seat-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 자리 바꾸기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[Math.min(1, WIDTHS.length - 1)], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 이름 20·빈자리·고정·떨어뜨리기·앞자리 → 섞기 ${res.anim}ms → 규칙 확인 · 선생님 쪽·텍스트·PNG · 공유 링크 왕복·나도 하기·잘못된 링크 · 다시 섞기·건너뛰기 · 기억 · 불가능·자리 부족·번호 28`);
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
