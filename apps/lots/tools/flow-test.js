#!/usr/bin/env node
/**
 * 제비뽑기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/lots) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 뽑기·끝 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음)
 *   → 직접 쓰기(예시 쪽지 + 꽝 자동) → 이름 5명(쪽지 수 = 5, 합계 불일치 안내·start 없음) → 나머지는 꽝으로
 *   → 쪽지 접기(track('start') 1) → 차례마다: 이름 차례 → 쪽지 누름 → 펼침(결과 = 섞은 판) → 다음 사람 → 폰 넘기기 덮개(다음 이름) → 준비
 *     (가리기 켬: 뽑힌 쪽지에 글자 없음)
 *   → 끝 화면(track('done') 1, 누가 뭘 뽑았나 = 내부 결과, 공통 끝 화면 순서, FAQ, 다시 하기 라벨) · 글로 복사(토스트)
 *   → 공유 링크(#d=, 언어 없는 주소): 새 탭에서 같은 결과 + 공유 배지 + 기록 없음 + "나도 만들기" → 설정 화면(#d= 지움) · 잘못된 링크 안내
 *   → 끝 화면 공통 공유 = 깨끗한 주소 · 다시 뽑기(start 2) → 한 장 뽑고 그만 뽑기(두 번 눌러야, done 2, 남은 쪽지 안내)
 *   → 다시 열면 최근 설정 → 누르면 그대로 채움 · 간단 모드 + 가리기 끔(덮개 없이 바로 다음 차례, 뽑힌 쪽지에 글자) · 콘솔 오류 0
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 펼침 연출 없이 바로.
 *
 * 실행: node tools/flow-test.js                         (en,ko,th × 360,1440)
 *       node tools/flow-test.js en,ja 360,375,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8791, MOCK_PORT = 8792, CDP_PORT = 9791;
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
    // 부드러운 스크롤이 끝나 위치가 멈출 때까지 기다린 뒤 누른다
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
    await sleep(250);
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
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto') bad.push('넘침: ' + (el.textContent || el.placeholder || '').trim().slice(0, 30));
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
const SUMMARY = `[...document.querySelectorAll('#summary .lt-sum-row')].map((li) => li.querySelector('.lt-sum-who').textContent + '=' + li.querySelector('.lt-sum-label').textContent.replace(/^🎉 /, ''))`;
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, draw: !document.getElementById('screen-draw').hidden, end: !document.getElementById('screen-end').hidden })`;
const NAMES = ['Ann', 'Bo', 'Cy', 'Dee', 'Ed'];

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(40); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const U = T.ui, D = T.draw, R = T.result, E = T.errors;
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

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup'); const ads = [...document.querySelectorAll('.mg-ad')].filter((a) => a.getClientRects().length || a.classList.contains('mg-ad-start'));
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ads.length,
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length, recent: !document.getElementById('recent').hidden }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.draw || st.scr.end || !st.adLast || st.ads !== 1 || st.faq || st.recent) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  if ((await tab.eval(`document.getElementById('simple-preview').textContent`)) !== fmt(U.simplePreview, { w: 1, b: 5, win: U.winLabel, blank: U.blankLabel })) say('간단 모드 미리보기 문구가 다름');
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lt-h1, .lt-hook, .lt-btn, .lt-seg-btn, .lt-mini, .lt-label, .lt-more-btn, .lt-preview, .lt-switch-text, .lt-fair')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);

  // 2) 직접 쓰기 + 이름
  await tab.tap('#mode-custom');
  const k1 = await tab.eval('window.LOTS_APP.state()');
  const exSum = U.customExample.reduce((a, k) => a + k.n, 0);
  if (k1.mode !== 'custom' || k1.kinds.length !== U.customExample.length + 1 || k1.kinds[k1.kinds.length - 1].l !== U.blankLabel || k1.kinds[k1.kinds.length - 1].n !== 6 - exSum) say(`직접 쓰기 예시 + 꽝 자동 채움이 다름 ${JSON.stringify(k1.kinds)}`);
  if ((await tab.eval(`document.querySelectorAll('#kinds .lt-kind').length`)) !== k1.kinds.length) say('직접 쓰기 줄 수가 다름');
  await tab.tap('#names-btn');
  await tab.type('#names', NAMES.join('\n'));
  const k2 = await tab.eval(`({ s: window.LOTS_APP.state(), dis: document.getElementById('count').disabled, note: document.getElementById('count-note').textContent, total: document.getElementById('total').textContent })`);
  if (k2.s.count !== 5 || !k2.dis || k2.note !== fmt(U.countNote, { n: 5 })) say(`이름 5명 → 쪽지 5장 고정이 아님 ${JSON.stringify(k2)}`);
  await tab.tap('#start-btn');
  const err1 = await tab.eval(`document.getElementById('error').textContent`);
  if (err1 !== fmt(E.totalMismatch, { sum: 6, n: 5 })) say(`합계 불일치 안내가 다름: ${err1}`);
  if (await tab.eval(COUNT('start'))) say('합계가 안 맞는데 track(start)');
  await tab.tap('#fill-blank');
  const k3 = await tab.eval('window.LOTS_APP.state()');
  if (k3.kinds.reduce((a, k) => a + Number(k.n), 0) !== 5) say(`나머지는 꽝으로 → 합계 5 아님 ${JSON.stringify(k3.kinds)}`);
  if (!(await tab.eval(`document.getElementById('error').hidden`))) say('오류 안내가 남아 있음');
  o = await tab.eval(OVERFLOW); if (o) say(`직접 쓰기 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lt-mini, .lt-total, .lt-hint')`)).forEach((w) => say(`직접 쓰기 ${w}`));
  const kindsW = await tab.eval(`[...document.querySelectorAll('#kinds .lt-kind')].map((r) => r.getBoundingClientRect().right - r.parentNode.getBoundingClientRect().right).filter((d) => d > 1).length`);
  if (kindsW) say(`직접 쓰기 줄 ${kindsW}개가 카드 밖으로 나감`);
  const clipped = await tab.eval(`[...document.querySelectorAll('#kinds .lt-kind-label')].filter((i) => i.scrollWidth > i.clientWidth + 1).map((i) => i.value)`);
  if (clipped.length) say(`직접 쓰기 라벨이 칸에 안 들어감: ${clipped.join(', ')}`);
  await tab.shot(`${lang}-${width}-2-custom.png`);

  // 3) 쪽지 접기 → 차례대로 뽑기
  await tab.tap('#start-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`쪽지 접기 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  const sc = await tab.eval(SCREENS);
  if (sc.setup || !sc.draw || sc.end) say(`뽑기 화면이 아님 ${JSON.stringify(sc)}`);
  const deck = await tab.eval('window.LOTS_APP.deck()');
  if (!deck || deck.length !== 5) say('판의 쪽지 수가 5가 아님');
  if ((await tab.eval(`document.querySelectorAll('#grid .lt-slip').length`)) !== 5) say('격자 쪽지 수가 5가 아님');
  if ((await tab.eval(`document.querySelectorAll('.mg-ad').length && [...document.querySelectorAll('.mg-ad')].filter((a) => a.getClientRects().length).length`)) > 0) say('뽑기 화면에 광고가 보임');
  const kinds = k3.kinds;
  const order = [4, 0, 2, 1, 3];
  for (let turn = 0; turn < 5; turn++) {
    const turnText = await tab.eval(`document.getElementById('turn').textContent`);
    if (turnText !== fmt(D.turnName, { name: NAMES[turn] })) say(`${turn + 1}번째 차례 표시 "${turnText}"`);
    if ((await tab.eval(`document.getElementById('progress').textContent`)) !== fmt(D.progress, { k: turn, n: 5 })) say(`${turn + 1}번째 진행 표시가 다름`);
    if (turn === 0) {
      o = await tab.eval(OVERFLOW); if (o) say(`뽑기 화면 가로 넘침 ${o}px`);
      (await tab.eval(TEXT_FIT + `('.lt-turn, .lt-pick-hint, .lt-progress-text, .lt-slip-no, .lt-mini')`)).forEach((w) => say(`뽑기 화면 ${w}`));
      await tab.shot(`${lang}-${width}-3-grid.png`);
    }
    const pos = order[turn];
    await tab.tap(`#grid .lt-slip[data-i="${pos}"]`);
    if ((await tab.eval(`window.LOTS_APP.phase()`)) !== 'reveal') say(`${turn + 1}번째: 쪽지를 눌러도 펼쳐지지 않음`);
    const ready = await waitFor(tab, `!document.getElementById('next-btn').disabled`, 2500);
    if (ready < 0) say(`${turn + 1}번째: 다음 버튼이 켜지지 않음`);
    else if (opts.reduced && ready > 200) say(`움직임 줄이기인데 펼침 ${ready}ms`);
    else if (!opts.reduced && ready < 500) say(`펼침 연출이 너무 짧음 ${ready}ms`);
    const rv = await tab.eval(`({ who: document.getElementById('reveal-who').textContent, label: document.getElementById('paper-label').textContent, open: document.getElementById('paper').classList.contains('is-open'), next: document.getElementById('next-btn').textContent })`);
    const want = kinds[deck[pos]].l;
    if (rv.who !== fmt(D.gotName, { name: NAMES[turn] }) || rv.label !== want || !rv.open) say(`${turn + 1}번째 펼친 쪽지가 다름 ${JSON.stringify(rv)} (판: ${want})`);
    if (rv.next !== (turn === 4 ? D.seeResults : D.next)) say(`${turn + 1}번째 다음 버튼 라벨 "${rv.next}"`);
    if (turn === 0) {
      o = await tab.eval(OVERFLOW); if (o) say(`펼친 쪽지 가로 넘침 ${o}px`);
      const paperFit = await tab.eval(`(() => { const p = document.getElementById('paper').getBoundingClientRect(); const c = document.querySelector('#reveal .lt-cover-inner').getBoundingClientRect(); const l = document.getElementById('paper-label'); return p.right <= c.right + 1 && p.left >= c.left - 1 && l.scrollWidth <= l.clientWidth + 1; })()`);
      if (!paperFit) say('펼친 쪽지가 덮개 밖으로 나가거나 글자가 넘침');
      await tab.shot(`${lang}-${width}-4-reveal.png`);
    }
    await tab.tap('#next-btn');
    if (turn < 4) {
      const ps = await tab.eval(`({ phase: window.LOTS_APP.phase(), pass: !document.getElementById('pass').hidden, title: document.getElementById('pass-title').textContent, label: document.querySelector('#grid .lt-slip[data-i="${pos}"] .lt-slip-label').textContent })`);
      if (ps.phase !== 'pass' || !ps.pass || ps.title !== fmt(D.passName, { name: NAMES[turn + 1] })) say(`${turn + 1}번째 뒤 폰 넘기기 덮개가 다름 ${JSON.stringify(ps)}`);
      if (ps.label) say('가리기 켬인데 뽑힌 쪽지에 글자가 보임');
      if (turn === 0) await tab.shot(`${lang}-${width}-5-pass.png`);
      await tab.tap('#ready-btn');
    }
  }

  // 4) 끝 화면
  await sleep(150);
  const se = await tab.eval(SCREENS);
  if (!se.end || se.draw || se.setup) say(`끝 화면이 아님 ${JSON.stringify(se)}`);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`결과 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const sum1 = await tab.eval(SUMMARY);
  const wantSum = order.map((pos, turn) => NAMES[turn] + '=' + kinds[deck[pos]].l);
  if (sum1.join('|') !== wantSum.join('|')) say(`결과 목록이 판과 다름 ${JSON.stringify(sum1)} ≠ ${JSON.stringify(wantSum)}`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, tally: document.querySelectorAll('#tally .lt-tally-row').length, left: !document.getElementById('leftover').hidden })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.again}"`);
  if (endInfo.tally !== kinds.length || endInfo.left) say(`쪽지별 정리 ${endInfo.tally}줄 / 남은 쪽지 안내 ${endInfo.left}`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.lt-h2, .lt-h3, .lt-btn, .lt-sum-who, .lt-sum-label, .lt-tally-label, .lt-tags li, .mg-end-retry')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-6-end.png`);
  await tab.tap('#copy-btn');
  await sleep(350);
  if ((await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`)) !== R.copied) say('글로 복사 안내 토스트가 다름');
  const txt = await tab.eval('window.LOTS_APP.text()');
  if (!txt.startsWith(R.textTitle) || NAMES.some((n) => !txt.includes(n))) say('복사 글이 이상함');
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소가 아님: ${share.url}`);

  // 5) 결과 링크
  const link = await tab.eval('window.LOTS_APP.link()');
  const lu = new URL(link);
  if (!/^#d=[A-Za-z0-9_-]+$/.test(lu.hash) || lu.search) say(`결과 링크가 #d= 가 아님: ${link}`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(lu.pathname)) say(`결과 링크에 언어가 들어감: ${lu.pathname}`);
  const tab2 = await openTab(width, opts.reduced);
  await tab2.goto(base + '#nolang');
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto(base + lu.hash);
  await sleep(250);
  const rs = await tab2.eval(`({ shared: window.LOTS_APP.shared(), scr: ${SCREENS}, badge: !document.getElementById('shared-badge').hidden, note: !document.getElementById('shared-note').hidden,
    start: ${COUNT('start')}, done: ${COUNT('done')}, retry: (document.querySelector('.mg-end-retry') || {}).textContent, sum: ${SUMMARY} })`);
  if (!rs.scr.end || !rs.shared || !rs.badge || !rs.note) say(`공유 링크 결과 표시가 다름 ${JSON.stringify(rs)}`);
  if (rs.start || rs.done) say(`공유 링크 열기가 start/done 을 기록함 (${rs.start}/${rs.done})`);
  if (rs.retry !== R.makeOwn) say(`공유 결과의 다시 하기 라벨 "${rs.retry}" ≠ "${R.makeOwn}"`);
  if (rs.sum.join('|') !== sum1.join('|')) say('받은 사람의 결과가 보낸 사람과 다름');
  if ((await tab2.eval(END_ORDER)).join(',') !== ORDER) say('공유 결과 끝 화면 순서가 다름');
  o = await tab2.eval(OVERFLOW); if (o) say(`공유 결과 가로 넘침 ${o}px`);
  await tab2.tap('[data-mg-end] .mg-end-retry');
  const mo = await tab2.eval(`({ scr: ${SCREENS}, hash: location.hash, shared: window.LOTS_APP.shared(), st: window.LOTS_APP.state(), start: ${COUNT('start')} })`);
  if (!mo.scr.setup || mo.hash || mo.shared || mo.st.mode !== 'custom' || mo.st.count !== 5 || mo.st.names.join('|') !== NAMES.join('|') || mo.start) say(`"나도 만들기" → 설정 화면이 아님 ${JSON.stringify(mo)}`);
  await tab2.goto('about:blank');
  await tab2.goto(base + '#d=bm90LWEtZHJhdw');
  await sleep(300);
  const bl = await tab2.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS}, hash: location.hash })`);
  if (bl.err !== E.badLink || !bl.scr.setup || bl.hash) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
  tab2.errors.forEach((e) => say('콘솔 오류(받는 사람): ' + e));
  await tab2.send('Page.close').catch(() => {});

  // 6) 다시 뽑기 → 한 장 뽑고 그만 뽑기
  await tab.tap('[data-mg-end] .mg-end-retry');
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 뽑기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
  if (!(await tab.eval(`document.getElementById('finish-btn').disabled`))) say('아무도 안 뽑았는데 그만 뽑기가 켜져 있음');
  await tab.tap('#grid .lt-slip[data-i="1"]');
  await waitFor(tab, `!document.getElementById('next-btn').disabled`, 2500);
  await tab.tap('#next-btn');
  await tab.tap('#ready-btn');
  await tab.tap('#finish-btn');
  const fa = await tab.eval(`({ phase: window.LOTS_APP.phase(), label: document.getElementById('finish-btn').textContent })`);
  if (fa.phase !== 'pick' || fa.label !== D.finishConfirm) say(`그만 뽑기 첫 번째 누름 = 확인 요청이 아님 ${JSON.stringify(fa)}`);
  await tab.tap('#finish-btn');
  await sleep(150);
  const fe = await tab.eval(`({ scr: ${SCREENS}, done: ${COUNT('done')}, left: document.getElementById('leftover').textContent, rows: document.querySelectorAll('#summary .lt-sum-row').length })`);
  if (!fe.scr.end || fe.done !== 2 || fe.left !== fmt(R.leftover, { n: 4 }) || fe.rows !== 1) say(`그만 뽑기 결과가 다름 ${JSON.stringify(fe)}`);

  // 7) 다시 열면 최근 설정 · 간단 모드 + 가리기 끔
  await tab.goto(base);
  const rc = await tab.eval(`({ shown: !document.getElementById('recent').hidden, n: document.querySelectorAll('#recent-list .lt-recent-item').length })`);
  if (!rc.shown || rc.n !== 1) say(`최근 설정이 다름 ${JSON.stringify(rc)}`);
  (await tab.eval(TEXT_FIT + `('.lt-recent-item, .lt-h2')`)).forEach((w) => say(`최근 설정 ${w}`));
  await tab.tap('#recent-list .lt-recent-item');
  const rf = await tab.eval('window.LOTS_APP.state()');
  if (rf.mode !== 'custom' || rf.count !== 5 || rf.names.join('|') !== NAMES.join('|')) say(`최근 설정을 눌러도 그대로 채워지지 않음 ${JSON.stringify(rf)}`);
  await tab.type('#names', '');
  await sleep(200);
  await tab.tap('#mode-simple');
  await tab.eval(`document.getElementById('count').value = 3; document.getElementById('count').dispatchEvent(new Event('input', { bubbles: true })); 1`);
  await tab.tap('#hide + .lt-switch-ui');
  if (await tab.eval(`document.getElementById('hide').checked`)) say('가리기 스위치가 꺼지지 않음');
  await tab.tap('#start-btn');
  if ((await tab.eval(`document.getElementById('turn').textContent`)) !== fmt(D.turnNum, { k: 1 })) say('이름 없을 때 차례 표시가 다름');
  await tab.tap('#grid .lt-slip[data-i="0"]');
  await waitFor(tab, `!document.getElementById('next-btn').disabled`, 2500);
  await tab.tap('#next-btn');
  const nh = await tab.eval(`({ phase: window.LOTS_APP.phase(), pass: !document.getElementById('pass').hidden, label: document.querySelector('#grid .lt-slip[data-i="0"] .lt-slip-label').textContent, turn: document.getElementById('turn').textContent })`);
  const simpleKinds = [U.winLabel, U.blankLabel];
  if (nh.phase !== 'pick' || nh.pass || !simpleKinds.includes(nh.label) || nh.turn !== fmt(D.turnNum, { k: 2 })) say(`가리기 끔인데 덮개가 나오거나 쪽지 글자가 안 보임 ${JSON.stringify(nh)}`);
  if ((await tab.eval(COUNT('start'))) !== 1) say(`간단 모드 시작 track('start') ${await tab.eval(COUNT('start'))}회 (새로 연 페이지에서 1)`);
  o = await tab.eval(OVERFLOW); if (o) say(`간단 모드 뽑기 화면 가로 넘침 ${o}px`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lots-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 제비뽑기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작 화면 · 직접 쓰기+이름 5명(합계 안내·꽝 채우기) → 5차례(펼침·폰 넘기기) → 끝 화면·복사 · 결과 링크 왕복·나도 만들기·잘못된 링크 · 다시 뽑기·그만 뽑기 · 최근 설정 · 간단 모드+가리기 끔`);
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
