#!/usr/bin/env node
/**
 * 경품 추첨기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/raffle) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음). window.confirm 은 늘 확인(true).
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다.
 *
 * 언어 × 폭마다 (움직임 줄이기 — 바로 공개):
 *   준비 화면(h1 검색어, 다른 화면 숨김, 맨 끝 mg-ad-start 1개, 광고 1개 보임, FAQ 없음, 넘침·단어 잘림 없음, 기본 = 이름·경품 3개(1·2·5))
 *   → 빈 명단으로 시작(오류, start 0) → 예시 이름 + 중복 한 줄(중복 경고) → 시작(추첨 화면, 광고 0, 0/8, start 0)
 *   → 한 명(start 1, 3등부터) → 남은 4명 한꺼번에(3등 5명, 서로 다름) → 되돌리기(묶음 4명 취소 → 1명) → 새로 고침(그대로, start 그대로)
 *   → 끝까지(8명 모두 다름, done 1, 버튼 = 결과 보기) → 결과(상 3개 1·2·5명, 끝 화면 순서·FAQ·공유 6·공유 주소 #r=, 텍스트 복사 내용)
 *   → 공유 링크 열기(공유받은 결과, 같은 당첨자, 다시 하기 라벨 = 나도 만들기, done 그대로) → 원래 탭 다시 하기(새 추첨 0명, 뽑으면 start +1)
 *   → 발표 모드(타이틀 바 숨김) → 새 추첨(확인 → 준비 화면, 저장된 추첨 없음) · 콘솔 오류 0
 * + 번호표 모드 한 번: 1~30, 중복 당첨 허용, 경품 1·2·5 → 끝까지 → 같은 상 안에서는 서로 다름.
 * + 움직임 그대로 한 번: 뽑기 누르면 셔플 중 버튼 꺼짐·건너뛰기 보임 → 건너뛰기 누르면 바로 공개.
 * + 좁은 화면(360px) 긴 언어(de·ru·vi·th): 준비·추첨·결과 화면 가로 넘침·버튼 글자 넘침 없음.
 *
 * 실행: node tools/flow-test.js                          (en,ko × 375 + 번호표 + 움직임 + de,ru,vi,th × 360)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
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
const WIDTHS = (process.argv[3] || '375').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const NARROW = ['de', 'ru', 'vi', 'th'];
const HTTP_PORT = Number(process.env.RF_HTTP_PORT || 9591), MOCK_PORT = Number(process.env.RF_MOCK_PORT || 9592), CDP_PORT = Number(process.env.RF_CDP_PORT || 9991);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  window.confirm = () => true; })();`;

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
  async reload() { const l = this.loaded(); await this.send('Page.reload', {}); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async rect(sel) {
    return this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 20)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
  }
  async tap(sel) {
    const r = await this.rect(sel);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await this.click(r.x + r.w / 2, r.y + r.h / 2);
  }
  async click(x, y) {
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    await sleep(30);
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
const SETUP_FIT = `'.rf-h1, .rf-hook, .rf-btn, .rf-mode-name, .rf-mode-desc, .rf-label, .rf-hint, .rf-fair, .rf-seg-btn, .rf-switch, .rf-add, .rf-link-btn, .rf-stat, .rf-slots'`;
const DRAW_FIT = `'.rf-bar .rf-mini, .rf-prog, .rf-btn, .rf-prize-now, .rf-prize-sub, .rf-ready, .rf-left, .rf-board-title, .rf-group-name'`;
const END_FIT = `'.rf-sum-kicker, .rf-h2, .rf-btn, .rf-res-name'`;
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, draw: !document.getElementById('screen-draw').hidden, end: !document.getElementById('screen-end').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
const STATE = `JSON.parse(localStorage.getItem('raffle_state') || 'null')`;
const DRAW = `({ r: RAFFLE_APP.raffle(), prog: document.getElementById('prog').textContent, now: document.getElementById('prize-now').textContent, sub: document.getElementById('prize-sub').textContent,
  slot: document.getElementById('slot-name').hidden ? [...document.querySelectorAll('#slot-multi li')].map((l) => l.textContent) : [document.getElementById('slot-name').textContent],
  btn: document.getElementById('draw-btn').textContent, btnDis: document.getElementById('draw-btn').disabled, rest: document.getElementById('rest-btn').hidden ? '' : document.getElementById('rest-btn').textContent,
  undoDis: document.getElementById('undo-btn').disabled, ready: !document.getElementById('ready').hidden, board: document.querySelectorAll('#board .rf-winner').length, groups: document.querySelectorAll('#board .rf-group').length, left: document.getElementById('left-info').textContent })`;

async function checkEnd(tab, T, say, retryLabel) {
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== retryLabel) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${retryLabel}"`);
  const share = await tab.eval('window.getShareData()');
  if (!/#r=[A-Za-z0-9_-]+$/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소 + #r= 가 아님: ${share.url}`);
  return share;
}
const setVal = (sel, v) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const baseOf = (lang) => `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
async function prepare(tab, base, lang) {
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
}
async function tapN(tab, sel, n) { for (let i = 0; i < n; i++) await tab.tap(sel); }
const uniq = (a) => new Set(a.map((x) => JSON.stringify(x))).size === a.length;

async function runFull(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui, E = T.end;
  const tag = `[${lang} ${width}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = baseOf(lang);
  const tab = await openTab(width, true);
  await prepare(tab, base, lang);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 준비 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length,
      mode: document.querySelector('.rf-mode[aria-checked="true"]').dataset.mode, nums: !document.getElementById('numbers-box').hidden,
      prizes: [...document.querySelectorAll('.rf-prize')].map((r) => r.querySelector('.rf-prize-name').value + '×' + r.querySelector('.rf-prize-count').textContent),
      order: document.querySelector('.rf-order[aria-checked="true"]').dataset.order, unique: document.getElementById('unique').checked }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  const wantPrizes = U.defaultPrizes.map((p) => p.n + '×' + p.c).join('|');
  if (!st.scr.setup || st.scr.draw || st.scr.end || !st.adLast || st.ads !== 1 || st.faq || st.mode !== 'names' || st.nums || st.prizes.join('|') !== wantPrizes || st.order !== 'up' || !st.unique) say(`준비 화면이 다름 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`준비 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${SETUP_FIT})`)).forEach((w) => say(`준비 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);
  // 빈 명단 → 오류
  await tab.tap('#start-btn');
  const e1 = await tab.eval(`({ err: document.getElementById('error').hidden ? '' : document.getElementById('error').textContent, scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (e1.err !== fmt(T.errors.noEntries, { min: 2 }) || !e1.scr.setup || e1.start) say(`빈 명단인데 ${JSON.stringify(e1)}`);
  // 예시 이름 + 중복 한 줄
  await tab.tap('#sample-btn');
  const names = U.sampleNames.concat([U.sampleNames[0] + '*3']);
  await tab.eval(setVal('#names', names.join('\n')));
  const s0 = await tab.eval(`({ stat: document.getElementById('names-stat').textContent, dup: document.getElementById('dup-warn').hidden ? '' : document.getElementById('dup-warn').textContent, err: !document.getElementById('error').hidden })`);
  if (s0.stat !== fmt(U.statTickets, { n: 13, t: 15 }) || !s0.dup.includes(U.sampleNames[0]) || s0.err) say(`명단 입력 뒤 ${JSON.stringify(s0)}`);
  await tab.shot(`${lang}-${width}-1b-names.png`);
  // 2) 시작
  await tab.tap('#start-btn');
  let d = await tab.eval(DRAW);
  const s1 = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, start: ${COUNT('start')} })`);
  if (!s1.scr.draw || s1.ads !== 0 || s1.start !== 0) say(`시작 뒤 ${JSON.stringify(s1)}`);
  const last = U.defaultPrizes[2];
  if (d.prog !== fmt(U.progress, { n: 0, m: 8 }) || d.now !== last.n || d.sub !== fmt(U.prizeOf, { k: 1, c: 5 }) || d.btn !== U.drawFirst || !d.undoDis || !d.ready || d.slot[0] !== '?' || d.rest !== fmt(U.rest, { k: 5 }) || d.board) say(`추첨 화면 처음 모양 ${JSON.stringify({ ...d, r: undefined })}`);
  o = await tab.eval(OVERFLOW); if (o) say(`추첨 화면 가로 넘침 ${o}px`);
  // 3) 한 명
  await tab.tap('#draw-btn');
  d = await tab.eval(DRAW);
  const w1 = d.r.wins;
  if (w1.length !== 1 || w1[0].p !== 2 || d.slot.length !== 1 || d.slot[0] !== d.r.entries[w1[0].e].n || d.board !== 1 || d.ready || d.undoDis || d.btn !== U.draw || d.sub !== fmt(U.prizeOf, { k: 1, c: 5 }) || d.now !== last.n || d.rest !== fmt(U.rest, { k: 4 })) say(`한 명 뒤 ${JSON.stringify({ ...d, r: w1 })}`);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`start ${await tab.eval(COUNT('start'))} ≠ 1`);
  (await tab.eval(TEXT_FIT + `(${DRAW_FIT})`)).forEach((w) => say(`추첨 화면 ${w}`));
  await tab.shot(`${lang}-${width}-2-draw.png`);
  // 4) 남은 4명 한꺼번에
  await tab.tap('#rest-btn');
  d = await tab.eval(DRAW);
  if (d.r.wins.length !== 5 || !d.r.wins.every((w) => w.p === 2) || !uniq(d.r.wins.map((w) => w.e)) || d.slot.length !== 4 || d.board !== 5 || d.now !== last.n || d.sub !== fmt(U.prizeOf, { k: 5, c: 5 }) || !d.left.startsWith(fmt(U.nextUp, { prize: U.defaultPrizes[1].n }))) say(`한꺼번에 뒤 ${JSON.stringify({ wins: d.r.wins, slot: d.slot, now: d.now })}`);
  await tab.shot(`${lang}-${width}-3-rest.png`);
  // 5) 되돌리기 → 묶음 4명 취소
  await tab.tap('#undo-btn');
  d = await tab.eval(DRAW);
  if (d.r.wins.length !== 1 || JSON.stringify(d.r.wins) !== JSON.stringify(w1) || d.slot[0] !== d.r.entries[w1[0].e].n || d.board !== 1) say(`되돌리기 뒤 ${JSON.stringify({ wins: d.r.wins, slot: d.slot })}`);
  if ((await tab.eval(`(${STATE}).raffle.wins.length`)) !== 1) say('저장된 추첨이 1명이 아님');
  // 6) 새로 고침
  await tab.reload();
  d = await tab.eval(DRAW);
  const rs = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (!rs.scr.draw || rs.start || JSON.stringify(d.r.wins) !== JSON.stringify(w1)) say(`새로 고침 뒤 ${JSON.stringify({ rs, wins: d.r.wins })}`);
  // 7) 끝까지
  await tapN(tab, '#draw-btn', 7);
  d = await tab.eval(DRAW);
  const allE = d.r.wins.map((w) => w.e);
  const dn = await tab.eval(`({ done: ${COUNT('done')}, start: ${COUNT('start')}, scr: ${SCREENS} })`);
  if (d.r.wins.length !== 8 || !uniq(allE) || d.r.wins.map((w) => w.p).join('') !== '22222110') say(`끝까지 뽑은 뒤 당첨 ${JSON.stringify(d.r.wins)}`);
  if (dn.done !== 1 || dn.start !== 0 || !dn.scr.draw || d.btn !== U.allDone || d.rest !== '' || d.sub !== U.allDrawn || d.now !== U.defaultPrizes[0].n) say(`모두 뽑은 뒤 ${JSON.stringify({ dn, btn: d.btn, sub: d.sub, now: d.now, rest: d.rest })}`);
  // 8) 결과
  await tab.tap('#draw-btn');
  const en = await tab.eval(`({ scr: ${SCREENS}, kicker: document.getElementById('end-kicker').textContent, groups: [...document.querySelectorAll('#results .rf-res')].map((g) => [g.querySelector('.rf-res-name').textContent, g.querySelectorAll('.rf-res-item').length]),
    own: !document.getElementById('own-btn').hidden, copy: !document.getElementById('copy-btn').hidden, done: ${COUNT('done')}, saved: (${STATE}).raffle, hash: location.hash })`);
  const wantG = U.defaultPrizes.map((p) => [p.n, p.c]);
  if (!en.scr.end || en.kicker !== E.kicker || JSON.stringify(en.groups) !== JSON.stringify(wantG) || en.own || !en.copy || en.done !== 1 || en.saved || !/^#r=/.test(en.hash)) say(`결과 화면이 다름 ${JSON.stringify(en)}`);
  const share = await checkEnd(tab, T, say, E.again);
  const txt = await tab.eval('RAFFLE_APP.text()');
  if (!txt.startsWith(E.textTitle) || !U.defaultPrizes.every((p) => txt.includes(p.n)) || !txt.includes(share.url)) say(`복사 텍스트가 이상함: ${txt.slice(0, 80)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${END_FIT})`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.shot(`${lang}-${width}-4-end.png`);
  const resultNames = await tab.eval(`[...document.querySelectorAll('#results .rf-res-item')].map((l) => l.textContent)`);
  // 9) 공유 링크 열기(다른 탭)
  const tab2 = await openTab(width, true);
  await tab2.goto(base + '#nolang');
  await tab2.eval(`localStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto('about:blank');
  await tab2.goto(base + new URL(share.url).hash);
  const sh = await tab2.eval(`({ scr: ${SCREENS}, kicker: document.getElementById('end-kicker').textContent, names: [...document.querySelectorAll('#results .rf-res-item')].map((l) => l.textContent), own: !document.getElementById('own-btn').hidden, edit: !document.getElementById('edit-btn').hidden, done: ${COUNT('done')}, start: ${COUNT('start')} })`);
  if (!sh.scr.end || sh.kicker !== E.sharedKicker || JSON.stringify(sh.names) !== JSON.stringify(resultNames) || !sh.own || sh.edit || sh.done || sh.start) say(`공유 링크 화면이 다름 ${JSON.stringify(sh)}`);
  await checkEnd(tab2, T, say, E.own);
  await tab2.tap('.mg-end-retry');
  const sh2 = await tab2.eval(`({ scr: ${SCREENS}, hash: location.hash })`);
  if (!sh2.scr.setup || sh2.hash) say(`공유 화면 '나도 만들기' 뒤 ${JSON.stringify(sh2)}`);
  tab2.errors.forEach((e) => say(`콘솔 오류(공유 탭): ${e}`));
  await tab2.send('Page.close').catch(() => {});
  // 10) 다시 하기 → 같은 명단으로 새 추첨
  await tab.tap('.mg-end-retry');
  d = await tab.eval(DRAW);
  if (!(await tab.eval(SCREENS)).draw || d.r.wins.length || d.r.entries.length !== 13 || d.board || (await tab.eval('location.hash'))) say(`다시 하기 뒤 ${JSON.stringify({ n: d.r.wins.length, e: d.r.entries.length })}`);
  await tab.tap('#draw-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`다시 하기 뒤 첫 뽑기에 start 가 늘지 않음 (새로 고침 뒤부터 셈)`);
  // 11) 발표 모드
  await tab.tap('#present-btn');
  const pm = await tab.eval(`({ on: document.body.classList.contains('rf-present'), top: getComputedStyle(document.querySelector('.mg-top')).display, board: getComputedStyle(document.getElementById('board-wrap')).display })`);
  if (!pm.on || pm.top !== 'none' || pm.board !== 'none') say(`발표 모드 ${JSON.stringify(pm)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`발표 모드 가로 넘침 ${o}px`);
  await tab.shot(`${lang}-${width}-5-present.png`);
  await tab.tap('#present-btn');
  // 12) 새 추첨 → 준비 화면
  await tab.tap('#new-btn');
  const ng = await tab.eval(`({ scr: ${SCREENS}, saved: (${STATE}).raffle, ads: ${VISIBLE_ADS}, names: document.getElementById('names').value.split('\\n').length, present: document.body.classList.contains('rf-present') })`);
  if (!ng.scr.setup || ng.saved || ng.ads !== 1 || ng.names !== 13 || ng.present) say(`새 추첨 뒤 ${JSON.stringify(ng)}`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

// 번호표 모드: 1~30, 중복 당첨 허용, 큰 상부터
async function runNumbers(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui;
  const tag = `[${lang} ${width} 번호표]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const tab = await openTab(width, true);
  await prepare(tab, baseOf(lang), lang);
  await tab.tap('#pm-numbers');
  await tab.eval(setVal('#num-n', '1'));
  await tab.tap('#start-btn');
  const e1 = await tab.eval(`document.getElementById('error').hidden ? '' : document.getElementById('error').textContent`);
  if (e1 !== fmt(T.errors.numRange, { min: 2, max: 9999 })) say(`번호 1 인데 오류 "${e1}"`);
  await tab.eval(setVal('#num-n', '6'));
  await tab.tap('#start-btn');
  const e2 = await tab.eval(`document.getElementById('error').hidden ? '' : document.getElementById('error').textContent`);
  if (e2 !== fmt(T.errors.tooFew, { need: 8, have: 6 })) say(`번호 6·당첨 8 인데 오류 "${e2}"`);
  await tab.eval(setVal('#num-n', '30'));
  await tab.tap('#unique');
  await tab.tap('#order-down');
  await tab.tap('#start-btn');
  let d = await tab.eval(DRAW);
  if (!(await tab.eval(SCREENS)).draw || d.r.mode !== 'numbers' || d.r.N !== 30 || d.r.unique || d.now !== U.defaultPrizes[0].n) say(`번호표 시작 뒤 ${JSON.stringify({ mode: d.r.mode, N: d.r.N, u: d.r.unique, now: d.now })}`);
  await tab.tap('#draw-btn');
  d = await tab.eval(DRAW);
  if (d.slot[0] !== fmt(U.numFmt, { n: d.r.wins[0].e })) say(`번호표 표시 "${d.slot[0]}"`);
  await tab.tap('#rest-btn');
  await tapN(tab, '#draw-btn', 1);
  await tab.tap('#rest-btn');
  d = await tab.eval(DRAW);
  const byP = [0, 1, 2].map((p) => d.r.wins.filter((w) => w.p === p).map((w) => w.e));
  if (d.r.wins.length !== 8 || byP.map((x) => x.length).join() !== '1,2,5' || !byP.every((x) => uniq(x)) || d.r.wins.some((w) => w.e < 1 || w.e > 30)) say(`번호표 끝까지 ${JSON.stringify(byP)}`);
  await tab.tap('#draw-btn');
  const res = await tab.eval(`[...document.querySelectorAll('#results .rf-res-item')].map((l) => l.textContent)`);
  if (res.length !== 8 || !res.every((x) => /\d/.test(x))) say(`번호표 결과 ${JSON.stringify(res)}`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

// 움직임 그대로: 셔플 중 버튼 꺼짐·건너뛰기 → 바로 공개
async function runMotion(lang, width, report) {
  const T = L10N[lang];
  const tag = `[${lang} ${width} 움직임]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const tab = await openTab(width, false);
  await prepare(tab, baseOf(lang), lang);
  await tab.tap('#sample-btn');
  await tab.tap('#start-btn');
  await tab.tap('#draw-btn');
  const r = await tab.eval(`({ rolling: RAFFLE_APP.rolling(), dis: document.getElementById('draw-btn').disabled, txt: document.getElementById('draw-btn').textContent, skip: !document.getElementById('skip-btn').hidden, cls: document.getElementById('slot').className, board: document.querySelectorAll('#board .rf-winner').length })`);
  if (!r.rolling || !r.dis || r.txt !== T.ui.drawing || !r.skip || !/is-rolling/.test(r.cls) || r.board) say(`셔플 중 모양이 다름 ${JSON.stringify(r)}`);
  await sleep(300);
  await tab.tap('#skip-btn');
  const a = await tab.eval(`({ rolling: RAFFLE_APP.rolling(), r: RAFFLE_APP.raffle(), name: document.getElementById('slot-name').textContent, skip: !document.getElementById('skip-btn').hidden, board: document.querySelectorAll('#board .rf-winner').length, dis: document.getElementById('draw-btn').disabled })`);
  if (a.rolling || a.dis || a.skip || a.r.wins.length !== 1 || a.name !== a.r.entries[a.r.wins[0].e].n || a.board !== 1) say(`건너뛰기 뒤 모양이 다름 ${JSON.stringify({ ...a, r: a.r.wins })}`);
  // 셔플이 저절로 끝나는지
  await tab.tap('#draw-btn');
  await sleep(2300);
  const b = await tab.eval(`({ rolling: RAFFLE_APP.rolling(), n: RAFFLE_APP.raffle().wins.length, board: document.querySelectorAll('#board .rf-winner').length })`);
  if (b.rolling || b.n !== 2 || b.board !== 2) say(`셔플이 끝나지 않음 ${JSON.stringify(b)}`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

// 좁은 화면 긴 언어
async function runNarrow(lang, report) {
  const T = L10N[lang];
  const tag = `[${lang} 360]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const tab = await openTab(360, true);
  await prepare(tab, baseOf(lang), lang);
  let o = await tab.eval(OVERFLOW); if (o) say(`준비 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${SETUP_FIT})`)).forEach((w) => say(`준비 화면 ${w}`));
  await tab.tap('#pm-numbers');
  (await tab.eval(TEXT_FIT + `('.rf-label, .rf-hint, .rf-input')`)).forEach((w) => say(`번호표 ${w}`));
  o = await tab.eval(OVERFLOW); if (o) say(`번호표 가로 넘침 ${o}px`);
  await tab.tap('#pm-names');
  await tab.tap('#sample-btn');
  await tab.eval(setVal('#names', T.ui.sampleNames.concat([T.ui.sampleNames[1]]).join('\n')));
  o = await tab.eval(OVERFLOW); if (o) say(`중복 경고 가로 넘침 ${o}px`);
  await tab.tap('#start-btn');
  await tab.tap('#draw-btn');
  o = await tab.eval(OVERFLOW); if (o) say(`추첨 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${DRAW_FIT})`)).forEach((w) => say(`추첨 화면 ${w}`));
  const bar = await tab.eval(`(() => { const b = document.querySelector('.rf-bar'); return b.scrollWidth > b.clientWidth + 1; })()`);
  if (bar) say('추첨 화면 위 막대가 넘침');
  await tab.shot(`${lang}-360-draw.png`);
  await tab.tap('#finish-btn');
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `(${END_FIT})`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.shot(`${lang}-360-end.png`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'raffle-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 경품 추첨기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 번호표 + 움직임 + ${NARROW.join(', ')} × 360px) — http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    for (const lang of LANGS) {
      for (const w of WIDTHS) {
        const res = await runFull(lang, w, report);
        problems += res.problems; runs++;
        console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${w}] 준비(광고 1·빈 명단 오류·중복 경고) → 한 명 → 한꺼번에 → 되돌리기 → 새로 고침 → 끝까지(done 1) → 결과(#r=·복사) → 공유 링크 → 다시 하기 → 발표 모드 → 새 추첨`);
      }
    }
    const nm = await runNumbers(LANGS[0], WIDTHS[0], report);
    problems += nm.problems; runs++;
    console.log(`  ${nm.problems ? '✗' : '✓'} [${LANGS[0]} 번호표] 범위 오류 → 인원 부족 오류 → 1~30·중복 당첨 허용·큰 상부터 → 끝까지(상 안에서는 다름) → 결과`);
    const m = await runMotion(LANGS[0], WIDTHS[0], report);
    problems += m.problems; runs++;
    console.log(`  ${m.problems ? '✗' : '✓'} [${LANGS[0]} 움직임] 셔플 중 버튼 꺼짐·건너뛰기 → 바로 공개 → 저절로 끝남`);
    for (const lang of NARROW) {
      const res = await runNarrow(lang, report);
      problems += res.problems; runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} 360] 준비·번호표·추첨·결과 화면 넘침 없음`);
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
