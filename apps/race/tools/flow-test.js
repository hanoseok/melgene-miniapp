#!/usr/bin/env node
/**
 * 동물 달리기 시합 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/race) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 경주 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음, 기본 4명)
 *   → 인원 10명 · 이름 몇 개(14자 이름 포함) · 꼴찌 모드 → 출발(track('start') 1, 광고 안 보임, 카운트다운)
 *   → 달리는 중(움직임·선두 표시) → 결과(track('done') 1, 걸린 시간 8~13초, 화면 속 도착 순서 = 정한 순서, 순위표·강조·제목,
 *     동물이 트랙 안, 공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 이름 링크(#d=) 새 탭: 이름·인원·모드 채움 + 안내, start/done 없음, #d= 지움 · 잘못된 링크 안내
 *   → 다시 하기(start 2 → done 2, 최근 기록 2줄) → 이름 바꾸기(시작 화면, 이름 그대로) → 다시 열면 설정·기록 남음 · 콘솔 오류 0
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 카운트다운 없이 1초 안에 결과.
 *
 * 실행: node tools/flow-test.js                         (en,ko,ja × 360,1440)
 *       node tools/flow-test.js en,th 360,375,1440 [캡처 폴더]
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
const HTTP_PORT = 8841, MOCK_PORT = 8842, CDP_PORT = 9841;
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
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, race: !document.getElementById('screen-race').hidden, result: !document.getElementById('result').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
// 출발 전에 심는 감시: 레인에 is-finished 가 붙는 순서를 기록
const WATCH = `(() => { window.__fin = []; const tr = document.getElementById('track');
  if (window.__mo) window.__mo.disconnect();
  window.__mo = new MutationObserver((ms) => ms.forEach((m) => { if (m.attributeName === 'class' && m.target.classList && m.target.classList.contains('is-finished') && !window.__fin.includes(m.target.getAttribute('data-lane'))) window.__fin.push(m.target.getAttribute('data-lane')); }));
  window.__mo.observe(tr, { subtree: true, attributes: true, attributeFilter: ['class'] }); return 1; })()`;
const NAMES = ['Ann', '', 'Bartholomew Jo', 'Dee', '', 'Fay', '', 'Hal', '', 'Ivy'];

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const U = T.ui, R = T.result, E = T.errors;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const note = (m) => console.log(`    · ${tag} ${m}`);
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
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length, entries: document.querySelectorAll('#entries .rc-input').length,
      ph: document.querySelector('#entries .rc-input').placeholder, count: document.getElementById('count-out').textContent }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.race || !st.adLast || st.ads !== 1 || st.faq) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  if (st.entries !== 4 || st.ph !== fmt(U.playerN, { n: 1 }) || st.count !== fmt(U.countValue, { n: 4 })) say(`기본 4명·기본 이름이 아님 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.rc-h1, .rc-hook, .rc-btn, .rc-seg-btn, .rc-label, .rc-count-out, .rc-hint, .rc-fair')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);

  // 2) 10명 · 이름 · 꼴찌 모드
  for (let i = 0; i < 6; i++) await tab.tap('#count-more');
  const c10 = await tab.eval(`({ n: document.querySelectorAll('#entries .rc-input').length, more: document.getElementById('count-more').disabled, ph: document.querySelectorAll('#entries .rc-input')[9].placeholder })`);
  if (c10.n !== 10 || !c10.more || c10.ph !== fmt(U.playerN, { n: 10 })) say(`10명 칸이 다름 ${JSON.stringify(c10)}`);
  for (let i = 0; i < NAMES.length; i++) if (NAMES[i]) await tab.type(`#entries .rc-input[data-i="${i}"]`, NAMES[i]);
  await tab.tap('#mode-lose');
  if ((await tab.eval('window.RACE_APP.mode()')) !== 'lose') say('꼴찌 모드로 바뀌지 않음');
  o = await tab.eval(OVERFLOW); if (o) say(`10명 시작 화면 가로 넘침 ${o}px`);
  const entryFit = await tab.eval(`[...document.querySelectorAll('#entries .rc-entry')].filter((e) => e.getBoundingClientRect().right > document.getElementById('rc-form').getBoundingClientRect().right + 1).length`);
  if (entryFit) say(`이름 칸 ${entryFit}개가 카드 밖으로 나감`);
  await tab.shot(`${lang}-${width}-2-ten.png`);

  // 3) 출발
  await tab.eval(`window.__t0 = performance.now(); 1`);
  await tab.eval(WATCH);
  await tab.tap('#start-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`출발 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  const sc = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, lanes: document.querySelectorAll('#track .rc-lane').length, cd: !document.getElementById('countdown').hidden, banner: document.getElementById('race-banner').textContent, phase: window.RACE_APP.phase() })`);
  if (sc.scr.setup || !sc.scr.race || sc.scr.result || sc.lanes !== 10 || sc.banner !== U.bannerLose) say(`경주 화면이 다름 ${JSON.stringify(sc)}`);
  if (sc.ads) say(`경주 화면에 광고가 보임 (${sc.ads})`);
  if (opts.reduced) { if (sc.cd) say('움직임 줄이기인데 카운트다운'); }
  else if (!sc.cd || sc.phase !== 'countdown') say(`카운트다운이 안 보임 ${JSON.stringify(sc)}`);
  const order = await tab.eval('window.RACE_APP.order()');
  const names = await tab.eval('window.RACE_APP.names()');
  const wantNames = NAMES.map((n, i) => n || fmt(U.playerN, { n: i + 1 }));
  if (names.join('|') !== wantNames.join('|')) say(`경주 이름이 다름 ${JSON.stringify(names)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`경주 화면 가로 넘침 ${o}px`);
  if (!opts.reduced) {
    await sleep(1200);
    await tab.shot(`${lang}-${width}-3-countdown.png`);
    await sleep(2600);
    const mid = await tab.eval(`({ phase: window.RACE_APP.phase(), moved: [...document.querySelectorAll('#track .rc-runner')].filter((r) => /translateX\\((?!0(\\.0)?px)/.test(r.style.transform)).length, lead: document.querySelectorAll('#track .rc-lane.is-leader').length })`);
    if (mid.phase !== 'race' || mid.moved < 8 || mid.lead !== 1) say(`달리는 중이 아님 ${JSON.stringify(mid)}`);
    await tab.shot(`${lang}-${width}-4-racing.png`);
  }

  // 4) 결과
  const took = await waitFor(tab, `window.RACE_APP.phase() === 'result' && !document.getElementById('result').hidden`, 16000);
  const elapsed = await tab.eval('performance.now() - window.__t0');
  if (took < 0) { say('결과가 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  if (opts.reduced) { if (elapsed > 1500) say(`움직임 줄이기인데 결과까지 ${Math.round(elapsed)}ms`); }
  else if (elapsed < 8000 || elapsed > 13500) say(`출발 → 결과 ${Math.round(elapsed)}ms (8~13초)`);
  else note(`출발 → 결과 ${(elapsed / 1000).toFixed(1)}초`);
  await sleep(300);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`결과 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const fin = (await tab.eval('window.__fin')).map(Number);
  if (fin.join() !== order.join()) say(`화면 속 도착 순서 ${fin} ≠ 정한 순서 ${order}`);
  const loser = names[order[9]];
  const res = await tab.eval(`({ title: document.getElementById('res-title').textContent, kicker: document.getElementById('res-kicker').textContent, sub: document.getElementById('res-sub').textContent,
    rows: [...document.querySelectorAll('#ranking .rc-rank-row')].map((li) => li.querySelector('.rc-rank-name').textContent),
    hi: [...document.querySelectorAll('#ranking .rc-rank-row.is-lose')].map((li) => li.querySelector('.rc-rank-name').textContent + '|' + (li.querySelector('.rc-rank-tag') || {}).textContent),
    win: document.querySelectorAll('#ranking .is-win').length, hist: document.querySelectorAll('#history .rc-hist-row').length, histCard: !document.getElementById('history-card').hidden,
    lastLane: !!document.querySelector('#track .rc-lane[data-lane="${order[9]}"].is-last') })`);
  if (res.title !== fmt(R.loseTitle, { name: loser }) || res.kicker !== R.loseKicker || res.sub !== fmt(R.loseSub, { name: loser })) say(`결과 제목이 다름 ${JSON.stringify(res)}`);
  if (res.rows.join('|') !== order.map((l) => names[l]).join('|')) say(`순위표가 정한 순서와 다름 ${JSON.stringify(res.rows)}`);
  if (res.hi.join() !== `${loser}|${R.tagLose}` || res.win) say(`꼴찌 강조가 다름 ${JSON.stringify(res.hi)}`);
  if (!res.lastLane) say('트랙의 꼴찌 레인 강조 없음');
  if (res.hist !== 1 || !res.histCard) say(`최근 기록 ${res.hist}줄`);
  const inTrack = await tab.eval(`(() => { const t = document.getElementById('track').getBoundingClientRect(); return [...document.querySelectorAll('#track .rc-runner')].filter((r) => { const b = r.getBoundingClientRect(); return b.right > t.right + 1 || b.left < t.left - 1; }).length; })()`);
  if (inTrack) say(`동물 ${inTrack}마리가 트랙 밖으로 나감`);
  const atLine = await tab.eval(`(() => { const t = document.getElementById('track').getBoundingClientRect(); return [...document.querySelectorAll('#track .rc-runner')].map((r) => Math.round(t.right - r.getBoundingClientRect().right)); })()`);
  if (atLine.some((d) => d < 10 || d > 22)) say(`결승선에 선 동물 위치가 고르지 않음 ${atLine}`);
  const laneCut = await tab.eval(`[...document.querySelectorAll('#track .rc-lane-name')].filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent)`);
  if (laneCut.length) note(`레인 이름 말줄임(…): ${laneCut.join(', ')}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.again}"`);
  if (endInfo.ads > 1) say(`결과 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.rc-h2, .rc-h3, .rc-btn, .rc-res-kicker, .rc-res-sub, .rc-rank-tag, .rc-hist-who, .rc-hist-meta, .rc-banner, .mg-end-retry')`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.eval(`document.getElementById('track').scrollIntoView({ block: 'start', behavior: 'instant' }); 1`);
  await tab.shot(`${lang}-${width}-5-finish.png`);
  await tab.eval(`document.getElementById('result-card').scrollIntoView({ block: 'start', behavior: 'instant' }); 1`);
  await tab.shot(`${lang}-${width}-6-result.png`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소가 아님: ${share.url}`);
  await tab.tap('#link-btn');
  await sleep(350);
  if ((await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`)) !== R.linkCopied) say('이름 링크 복사 안내 토스트가 다름');

  // 5) 이름 링크(#d=)
  const link = await tab.eval('window.RACE_APP.link()');
  const lu = new URL(link);
  if (!/^#d=[A-Za-z0-9_-]+$/.test(lu.hash) || lu.search) say(`이름 링크가 #d= 가 아님: ${link}`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(lu.pathname)) say(`이름 링크에 언어가 들어감: ${lu.pathname}`);
  const tab2 = await openTab(width, opts.reduced);
  await tab2.goto(base + '#nolang');
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto(base + lu.hash);
  await sleep(250);
  const rs = await tab2.eval(`({ scr: ${SCREENS}, note: !document.getElementById('shared-note').hidden, inputs: window.RACE_APP.inputs(), mode: window.RACE_APP.mode(), count: window.RACE_APP.count(),
    start: ${COUNT('start')}, done: ${COUNT('done')}, hash: location.hash })`);
  if (!rs.scr.setup || rs.scr.race || !rs.note || rs.inputs.join('|') !== NAMES.join('|') || rs.mode !== 'lose' || rs.count !== 10 || rs.hash) say(`이름 링크 불러오기가 다름 ${JSON.stringify(rs)}`);
  if (rs.start || rs.done) say(`이름 링크 열기가 start/done 을 기록함 (${rs.start}/${rs.done})`);
  await tab2.goto('about:blank');
  await tab2.goto(base + '#d=bm90LWEtcmFjZQ');
  await sleep(300);
  const bl = await tab2.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS}, hash: location.hash })`);
  if (bl.err !== E.badLink || !bl.scr.setup || bl.hash) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
  tab2.errors.forEach((e) => say('콘솔 오류(받는 사람): ' + e));
  await tab2.send('Page.close').catch(() => {});

  // 6) 다시 하기 → 이름 바꾸기
  await tab.tap('[data-mg-end] .mg-end-retry');
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
  if (await tab.eval(`!document.getElementById('result').hidden`)) say('다시 하기 뒤에도 지난 결과가 보임');
  if ((await waitFor(tab, `window.RACE_APP.phase() === 'result'`, 16000)) < 0) say('다시 하기 결과가 나오지 않음');
  await sleep(200);
  const again = await tab.eval(`({ done: ${COUNT('done')}, hist: document.querySelectorAll('#history .rc-hist-row').length, names: window.RACE_APP.names().join('|') })`);
  if (again.done !== 2 || again.hist !== 2 || again.names !== wantNames.join('|')) say(`다시 하기가 다름 ${JSON.stringify(again)}`);
  await tab.tap('#edit-btn');
  const ed = await tab.eval(`({ scr: ${SCREENS}, inputs: window.RACE_APP.inputs(), count: window.RACE_APP.count() })`);
  if (!ed.scr.setup || ed.scr.race || ed.inputs.join('|') !== NAMES.join('|') || ed.count !== 10) say(`이름 바꾸기 → 시작 화면이 다름 ${JSON.stringify(ed)}`);
  if ((await tab.eval(VISIBLE_ADS)) !== 1) say('시작 화면으로 돌아왔는데 광고가 1개가 아님');

  // 7) 다시 열면 설정·기록이 남음
  await tab.goto(base);
  const rl = await tab.eval(`({ inputs: window.RACE_APP.inputs(), count: window.RACE_APP.count(), mode: window.RACE_APP.mode(), hist: window.RACE_APP.history().length, start: ${COUNT('start')} })`);
  if (rl.inputs.join('|') !== NAMES.join('|') || rl.count !== 10 || rl.mode !== 'lose' || rl.hist !== 2 || rl.start) say(`다시 열었을 때 설정·기록이 다름 ${JSON.stringify(rl)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'race-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 동물 달리기 시합 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 · 10명+이름+꼴찌 모드 → 카운트다운 → 달리기 → 결과(도착 순서 = 정한 순서, 순위표·강조, 끝 화면) · 이름 링크 왕복·잘못된 링크 · 다시 하기 · 이름 바꾸기 · 다시 열기`);
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
