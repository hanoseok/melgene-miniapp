#!/usr/bin/env node
/**
 * 마니또 뽑기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/santa) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 확인 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음) → 불가능 조건(3명 + 제외 쌍) 안내(start 없음)
 *   → 5명(16자 이름 포함)·모임·예산·날짜·제외 쌍·2명끼리 막기 → 뽑기(track('start') 1, 광고 안 보임, 이름 버튼 5개, 배정 칸 비어 있음)
 *   → 한 사람씩 이름 → "정말 ○○님인가요?"(취소 확인) → 상자 열기 → 가리기(✓) → 배정 = 순열·자기 자신 없음·제외 쌍·2-cycle 없음
 *   → 완료(track('done') 1, 공통 끝 화면 순서) · "다 확인했어요"를 또 눌러도 done 1 → 전체 결과(경고 취소·확인, 확인한 배정과 같음)
 *   → 개인 링크(5줄, 받는 사람 이름이 주소에 안 보임) 새 탭: 그 사람 상자만, 열면 같은 받는 사람·done 1·start 0 · 잘못된 링크 안내
 *   → 새로고침해도 이번 뽑기 이어짐(start/done 다시 안 셈) → 다시 하기 = 같은 명단 새로 뽑기(start 1) → 명단 고치기(확인 창 → 시작 화면, 뽑기 지움) · 콘솔 오류 0
 *   + 움직임 줄이기 한 번.
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
const CORE = require(path.join(SITE, 'santa-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ja').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8861, MOCK_PORT = 8862, CDP_PORT = 9861;
const WARP = 1;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  const real = performance.now.bind(performance); const t0 = real(); performance.now = () => t0 + (real() - t0) * ${WARP};
  let hidden = false; Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get() { return hidden; } });
  Object.defineProperty(Document.prototype, 'visibilityState', { configurable: true, get() { return hidden ? 'hidden' : 'visible'; } });
  window.__setHidden = (h) => { hidden = h; document.dispatchEvent(new Event('visibilitychange')); return 1; }; })();`;

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
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, play: !document.getElementById('screen-play').hidden, pass: !document.getElementById('pass').hidden, secret: !document.getElementById('secret').hidden, org: !document.getElementById('org').hidden, done: !document.getElementById('done').hidden, ask: !document.getElementById('ask').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const NAMES = ['Ann', 'Bartholomew Jone', 'Dee', 'Fay', 'Gus'];

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const U = T.ui, E = T.errors;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.play || !st.adLast || st.ads !== 1 || st.faq) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.sn-h1, .sn-hook, .sn-btn, .sn-label, .sn-hint, .sn-switch-label, .sn-fair, .sn-mini')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);

  // 2) 불가능한 조건 → 안내
  await tab.type('#names', 'A\nB\nC');
  await sleep(350);
  await tab.eval(`(() => { document.getElementById('excl-a').value = 'A'; document.getElementById('excl-b').value = 'B'; return 1; })()`);
  await tab.tap('#excl-add');
  await tab.tap('#draw-btn');
  const imp = await tab.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (imp.err !== E.impossible || !imp.scr.setup || imp.scr.play || imp.start) say(`불가능 조건 안내가 다름 ${JSON.stringify(imp)}`);

  // 3) 이름 5명 · 모임 · 예산 · 날짜 · 제외 쌍(Ann ↔ Dee) · 2명끼리 막기
  await tab.type('#names', NAMES.join('\n'));
  await tab.type('#event', 'Team 2026');
  await tab.type('#budget', '$20');
  await tab.eval(`(() => { const d = document.getElementById('date'); d.value = '2026-12-23'; d.dispatchEvent(new Event('change')); return 1; })()`);
  await sleep(350);
  await tab.eval(`(() => { document.getElementById('excl-a').value = 'Ann'; document.getElementById('excl-b').value = 'Dee'; return 1; })()`);
  await tab.tap('#excl-add');
  await tab.tap('#no-pairs');
  const ex = await tab.eval(`[...document.querySelectorAll('#excl-list .sn-excl-names')].map((e) => e.textContent)`);
  if (ex.length !== 1 || !/Ann/.test(ex[0]) || !/Dee/.test(ex[0])) say(`제외 쌍 목록이 다름 ${JSON.stringify(ex)} (이름이 바뀌어 A-B 는 빠지고 Ann-Dee 만)`);
  o = await tab.eval(OVERFLOW); if (o) say(`설정 화면 가로 넘침 ${o}px`);
  await tab.shot(`${lang}-${width}-2-filled.png`);

  // 4) 뽑기
  await tab.tap('#draw-btn');
  const pl = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')}, ads: ${VISIBLE_ADS}, who: [...document.querySelectorAll('#who-list .sn-who-btn')].map((b) => b.textContent), prog: document.getElementById('progress').textContent,
    title: document.getElementById('ev-title').textContent, meta: document.getElementById('ev-meta').textContent, secretName: document.getElementById('secret-name').textContent, all: document.getElementById('all-list').children.length })`);
  if (!pl.scr.play || pl.scr.setup || !pl.scr.pass || pl.scr.secret || pl.scr.done || pl.start !== 1 || pl.ads !== 0) say(`뽑은 뒤 화면이 다름 ${JSON.stringify(pl)}`);
  if (pl.who.join('|') !== NAMES.join('|') || pl.prog !== fmt(U.progress, { k: 0, n: 5 }) || pl.title !== 'Team 2026' || !pl.meta.includes('$20') || pl.secretName || pl.all) say(`확인 화면 내용이 다름 ${JSON.stringify(pl)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`확인 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.sn-who-btn, .sn-btn, .sn-pass-title, .sn-pass-hint, .sn-progress')`)).forEach((w) => say(`확인 화면 ${w}`));
  await tab.shot(`${lang}-${width}-3-pass.png`);

  // 5) 한 사람씩: 이름 → 확인 창 → 상자 → 가리기
  const map = {};
  for (let i = 0; i < NAMES.length; i++) {
    await tab.tap(`#who-list .sn-who-btn:nth-child(${i + 1})`);
    const a = await tab.eval(`({ scr: ${SCREENS}, q: document.getElementById('ask-text').textContent })`);
    if (!a.scr.ask || a.q !== fmt(U.confirmQ, { name: NAMES[i] })) say(`확인 창이 다름 ${JSON.stringify(a)}`);
    if (i === 0) { await tab.tap('#ask-no'); if (await tab.eval(`!document.getElementById('ask').hidden || !document.getElementById('secret').hidden`)) say('취소해도 상자가 열림'); await tab.tap('#who-list .sn-who-btn:nth-child(1)'); }
    if (i === 0) await tab.shot(`${lang}-${width}-4-ask.png`);
    await tab.tap('#ask-yes');
    const s1 = await tab.eval(`({ scr: ${SCREENS}, for: document.getElementById('secret-for').textContent, name: document.getElementById('secret-name').textContent })`);
    if (!s1.scr.secret || s1.scr.pass || s1.scr.org || s1.scr.ask || s1.name || s1.for !== fmt(U.secretFor, { name: NAMES[i] })) say(`상자 화면이 다름 ${JSON.stringify(s1)}`);
    await tab.tap('#gift-btn');
    if ((await waitFor(tab, `!document.getElementById('secret-body').hidden`, 3000)) < 0) { say('상자가 열리지 않음'); break; }
    const r = await tab.eval(`document.getElementById('secret-name').textContent`);
    map[NAMES[i]] = r;
    if (i === 0) { await tab.shot(`${lang}-${width}-5-secret.png`); o = await tab.eval(OVERFLOW); if (o) say(`상자 화면 가로 넘침 ${o}px`); }
    await tab.tap('#hide-btn');
    const h = await tab.eval(`({ scr: ${SCREENS}, seen: document.querySelector('#who-list .sn-who-btn:nth-child(${i + 1})').classList.contains('is-seen'), name: document.getElementById('secret-name').textContent })`);
    if (!h.seen || h.name || h.scr.secret || !h.scr.pass) say(`가리기 뒤 상태가 다름 ${JSON.stringify(h)}`);
  }
  const got = NAMES.map((n) => map[n]);
  if (new Set(got).size !== 5 || got.some((r, i) => r === NAMES[i] || !NAMES.includes(r))) say(`배정이 순열이 아님/자기 자신 ${JSON.stringify(map)}`);
  if (map.Ann === 'Dee' || map.Dee === 'Ann') say(`제외 쌍 위반 ${JSON.stringify(map)}`);
  if (NAMES.some((n) => map[map[n]] === n)) say(`2명끼리 서로 뽑기 막기 위반 ${JSON.stringify(map)}`);
  const dn = await tab.eval(`({ scr: ${SCREENS}, done: ${COUNT('done')}, end: ${END_ORDER}, title: document.getElementById('done-title').textContent })`);
  if (!dn.scr.done || dn.done !== 1 || dn.end.join() !== ORDER || dn.title !== T.result.doneTitle) say(`모두 확인 뒤 완료가 다름 ${JSON.stringify(dn)}`);
  await tab.shot(`${lang}-${width}-6-done.png`);
  // 다 확인했어요 다시 눌러도 done 은 한 번
  await tab.tap('#done-btn');
  if ((await tab.eval(COUNT('done'))) !== 1) say('done 이 두 번 세어짐');

  // 6) 전체 결과: 경고 뒤에만
  await tab.tap('#all-btn');
  if (!(await tab.eval(`!document.getElementById('ask').hidden && document.getElementById('ask-text').textContent === ${JSON.stringify(U.allQ)}`))) say('전체 결과 경고 창이 안 뜸');
  await tab.tap('#ask-no');
  if (await tab.eval(`document.getElementById('all-list').children.length || !document.getElementById('all').hidden`)) say('취소했는데 전체 결과가 보임');
  await tab.tap('#all-btn');
  await tab.tap('#ask-yes');
  const all = await tab.eval(`[...document.querySelectorAll('#all-list .sn-all-row')].map((r) => [r.querySelector('.sn-all-g').textContent, r.querySelector('.sn-all-r').textContent])`);
  if (all.length !== 5 || all.some(([g, r]) => map[g] !== r)) say(`전체 결과가 확인한 배정과 다름 ${JSON.stringify(all)}`);
  await tab.tap('#all-hide');

  // 7) 개인 링크
  await tab.tap('#links-btn');
  const lk = await tab.eval(`({ rows: document.querySelectorAll('#links-list .sn-link-row').length, url: window.SANTA_APP.linkFor(1), html: document.getElementById('links-list').textContent })`);
  if (lk.rows !== 5 || !/#d=[A-Za-z0-9_-]+$/.test(lk.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru|_l)\//.test(new URL(lk.url).pathname)) say(`개인 링크가 다름 ${JSON.stringify(lk)}`);
  if (lk.url.includes(encodeURIComponent(map[NAMES[1]])) || lk.url.includes(map[NAMES[1]])) say('개인 링크에 받는 사람 이름이 그대로 보임');
  await tab.tap('#links-list .sn-link-row:nth-child(2) button');
  const clip = await tab.eval(`navigator.clipboard.readText().catch(() => '')`);
  if (clip) {
    const m = clip.match(/#d=([A-Za-z0-9_-]+)/);
    const d = m && CORE.decodeLink(m[1]);
    if (!d || d.g !== NAMES[1] || d.r !== map[NAMES[1]] || !clip.includes(NAMES[1])) say(`복사한 글의 링크가 다름: ${clip.slice(0, 80)}`);
  }
  const tab2 = await openTab(width, opts.reduced);
  const local = lk.url.replace(/^https?:\/\/[^/]+/, `http://localhost:${HTTP_PORT}`).replace(/\/(?=#)/, '/');
  await tab2.goto(`http://localhost:${HTTP_PORT}/#nolang`);
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto(base + new URL(local).hash);
  const l1 = await tab2.eval(`({ scr: ${SCREENS}, for: document.getElementById('secret-for').textContent, hide: !document.getElementById('hide-btn').hidden, start: ${COUNT('start')} })`);
  if (!l1.scr.secret || l1.scr.pass || l1.scr.org || l1.scr.setup || l1.for !== fmt(U.linkFor, { name: NAMES[1] }) || l1.start) say(`링크로 연 화면이 다름 ${JSON.stringify(l1)}`);
  await tab2.tap('#gift-btn');
  if ((await waitFor(tab2, `!document.getElementById('secret-body').hidden`, 3000)) < 0) say('링크 상자가 열리지 않음');
  const l2 = await tab2.eval(`({ name: document.getElementById('secret-name').textContent, scr: ${SCREENS}, done: ${COUNT('done')}, start: ${COUNT('start')}, end: ${END_ORDER}, title: document.getElementById('done-title').textContent })`);
  if (l2.name !== map[NAMES[1]] || !l2.scr.done || l2.done !== 1 || l2.start || l2.end.join() !== ORDER || l2.title !== T.result.linkDoneTitle) say(`링크로 연 결과가 다름 ${JSON.stringify(l2)} (기대 ${map[NAMES[1]]})`);
  await tab2.shot(`${lang}-${width}-7-link.png`);
  await tab2.goto(base + '#d=abc$$');
  const bl = await tab2.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS} })`);
  if (bl.err !== E.badLink || !bl.scr.setup) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
  tab2.errors.forEach((e) => say('콘솔 오류(링크): ' + e));
  await tab2.send('Page.close').catch(() => {});

  // 8) 새로고침해도 이번 뽑기가 이어짐(done 다시 안 셈) → 다시 하기 = 새로 뽑기
  await tab.goto(base);
  const rl = await tab.eval(`({ scr: ${SCREENS}, seen: document.querySelectorAll('#who-list .is-seen').length, start: ${COUNT('start')}, done: ${COUNT('done')} })`);
  if (!rl.scr.pass || rl.seen !== 5 || !rl.scr.done || rl.start || rl.done) say(`다시 열었을 때 이번 뽑기가 이어지지 않음 ${JSON.stringify(rl)}`);
  await tab.tap('[data-mg-end] .mg-end-retry');
  const rt = await tab.eval(`({ scr: ${SCREENS}, seen: document.querySelectorAll('#who-list .is-seen').length, start: ${COUNT('start')} })`);
  if (!rt.scr.pass || rt.seen || rt.scr.done || rt.start !== 1) say(`다시 하기(같은 명단 새로 뽑기)가 다름 ${JSON.stringify(rt)}`);

  // 9) 명단 고치기 → 확인 창 → 시작 화면, 이번 뽑기 지움
  await tab.tap('#edit-btn');
  await tab.tap('#ask-yes');
  const ed = await tab.eval(`({ scr: ${SCREENS}, names: document.getElementById('names').value, draw: localStorage.getItem('mg_santa_draw_v1'), ads: ${VISIBLE_ADS} })`);
  if (!ed.scr.setup || ed.scr.play || ed.names !== NAMES.join('\n') || ed.draw || ed.ads !== 1) say(`명단 고치기가 다름 ${JSON.stringify(ed)}`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'santa-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 마니또 뽑기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 · 불가능 안내 · 5명+제외 쌍+2명끼리 막기 → 뽑기 → 5명 확인(확인 창·상자·가리기) → 완료·끝 화면 · 전체 결과(경고 뒤) · 개인 링크 왕복·잘못된 링크 · 새로고침 이어짐 · 다시 하기 · 명단 고치기`);
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
