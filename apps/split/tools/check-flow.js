#!/usr/bin/env node
/**
 * 더치페이 계산기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음 — 하네스는 apps/bmi/tools/check-flow.js 와 같다).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 요약·FAQ 안 보임, 똑같이 나누기·언어 기본 통화, 가로 넘침·버튼 문구 넘침·단어 잘림 없음
 *   - 빈 정산 완료 → needOne, track 0/0
 *   - 똑같이: 총액 + 인원 3명 → 1인당(총무 부담 / 골고루), 합계 = 총액, track start 1번 · 오류 badNum
 *   - 먼저 낸 사람: 켜기 → 1명 전액 → 송금 2건 · 금액이 모자라면 paidUnder
 *   - 항목별: 사람 3명(이름) · 메뉴 2개 · 칩 빼기 · 세금·팁 % → 사람별 합계 = 총액
 *   - 결과 복사 글(이름·금액·송금) · 링크로 공유 #d= → 새 탭에서 같은 상태 · 저장(mg_split_v1) 후 새로 열면 그대로
 *   - 정산 완료 → 광고 숨김 · track done 1번 · 끝 화면 순서 · FAQ 개수 · 공유 데이터에 이름·금액·#·? 없음
 *   - 다시 하기 → 입력 비움 · 새 판 track 2/2 · 서버(mock) 로 이름·금액이 가지 않음 · 콘솔 오류 0
 *   - SHOT=<폴더> 면 첫 화면·결과·요약 스크린샷
 *
 * 실행: node tools/check-flow.js                  (en,ko,th × 360,1440)
 *       node tools/check-flow.js ru,de,ja 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'split-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOT = process.env.SHOT || '';
const HTTP_PORT = 9031, MOCK_PORT = 9032, CDP_PORT = 9531;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml' };
function serve() {
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(SITE, p);
    if (!file.startsWith(SITE)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404); return res.end('not found'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(buf);
    });
  }).listen(HTTP_PORT);
}

class Tab {
  constructor(ws) {
    this.ws = ws; this.n = 0; this.wait = new Map(); this.errors = []; this.onload = null;
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.wait.has(m.id)) { const w = this.wait.get(m.id); this.wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
      if (m.method === 'Runtime.exceptionThrown') this.errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') this.errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon|googlesyndication|doubleclick|google-analytics|googletagmanager|fonts\.g/.test(m.params.entry.url || '')) this.errors.push('log: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
      if (m.method === 'Page.loadEventFired' && this.onload) { const f = this.onload; this.onload = null; f(); }
    };
    ws.onclose = () => { this.wait.forEach((w) => w.rej(new Error('Chrome(CDP) 연결이 끊김'))); this.wait.clear(); };
  }
  send(method, params = {}) { const id = ++this.n; return new Promise((res, rej) => { this.wait.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text);
    return r.result.value;
  }
  loaded() { return new Promise((r) => { this.onload = r; }); }
  async settle() { await this.eval('document.fonts.ready.then(() => 1)'); await sleep(300); }
  async goto(url) { const l = this.loaded(); await this.send('Page.navigate', { url }); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async reload() { const l = this.loaded(); await this.send('Page.reload', {}); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async tap(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(80);
  }
  async shot(file) {
    const m = await this.send('Page.getLayoutMetrics');
    const h = Math.ceil(m.cssContentSize ? m.cssContentSize.height : m.contentSize.height);
    const r = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: m.cssLayoutViewport.clientWidth, height: Math.min(h, 6000), scale: 1 } });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  }
}
// track 을 가로채는 스크립트(페이지가 시작되기 전에): common.js 가 window.track 을 정해도 감싼다
const SPY_EARLY = `(() => { window.__t = { start: 0, done: 0 }; let inner; Object.defineProperty(window, 'track', { configurable: true,
  get() { return function (e) { if (e === 'start' || e === 'done') window.__t[e]++; return inner && inner.apply(this, arguments); }; }, set(v) { inner = v; } }); })();`;
async function connect() {
  // Chrome 이 막 떴을 때는 첫 연결이 실패할 수 있어 몇 번 다시 시도한다
  for (let i = 0; ; i++) {
    try {
      const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
      const ws = new WebSocket(t.webSocketDebuggerUrl);
      await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('CDP WebSocket 연결 실패')); });
      return ws;
    } catch (e) { if (i >= 8) throw e; await sleep(500); }
  }
}
async function openTab(width) {
  const ws = await connect();
  const tab = new Tab(ws);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: SPY_EARLY });
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 740, deviceScaleFactor: SHOT ? 1 : 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await tab.send('Browser.grantPermissions', { origin: `http://localhost:${HTTP_PORT}`, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] }).catch(() => {});
  await tab.send('Browser.setDownloadBehavior', { behavior: 'deny' }).catch(() => {});
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

// 모바일 에뮬레이션에서는 넘치는 요소가 레이아웃 뷰포트(innerWidth)까지 넓히므로 에뮬레이션한 폭과 비교한다
const OVERFLOW = (w) => `(Math.max(document.documentElement.scrollWidth, innerWidth) > ${w} + 1 ? Math.max(document.documentElement.scrollWidth, innerWidth) : 0)`;
// 버튼·칩 안의 글자가 넘치는지 (360px 문구 길이)
const LABEL_OVER = `((sel) => { const bad = []; document.querySelectorAll(sel).forEach((el) => { if (!el.offsetParent) return;
  if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2) bad.push((el.textContent || '').trim().slice(0, 30)); }); return bad; })`;
const BROKEN_WORDS = `((sel) => {
  const bad = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.offsetParent) return;
    const hy = getComputedStyle(el).hyphens === 'auto';
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const re = /[^\\s\\u00a0\\u202f\\-–—\\/·]+/g; let m;
      while ((m = re.exec(node.data))) {
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff\\uac00-\\ud7a3]/.test(m[0])) continue;
        const rg = document.createRange(); rg.setStart(node, m.index); rg.setEnd(node, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map((q) => Math.round(q.top)));
        if (lines.size > 1 && !hy) bad.push(m[0]);
      }
    }
  });
  return bad;
})`;
const COUNTS = `({ s: window.__t.start, d: window.__t.done })`;
const END_KIDS = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const OUT = `(() => { const t = (id) => (document.getElementById(id) || {}).textContent || ''; const vis = (id) => { const e = document.getElementById(id); return !!e && !e.hidden; };
  return { lead: vis('out-lead') ? t('out-lead') : '', grand: vis('out-body') ? t('out-grand') : '', shares: [...document.querySelectorAll('#out-shares li')].map((l) => l.textContent),
    sum: t('out-sum'), err: vis('out-err') ? t('out-err') : '', tr: [...document.querySelectorAll('#transfers li')].map((l) => l.textContent), pay: vis('pay-sum') ? t('pay-sum') : '',
    calc: window.SPLIT_APP.calc(), st: window.SPLIT_APP.state() }; })()`;
const setVal = (sel, v) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const TAP_SEL = '.sp-seg-btn, .sp-btn, .sp-more, .sp-add, .sp-kicker, .sp-switch-t, .sp-chip';
const WORD_SEL = '.sp-h1, .sp-hook, .sp-label, .sp-lead, .sp-seg-btn, .sp-more, .sp-add, .sp-switch, .sp-note, .sp-ok, .sp-err, .sp-btn, .sp-local, .sp-hint, .sp-error, .sp-summary, .mg-end-retry';

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  if (SHOT) fs.mkdirSync(SHOT, { recursive: true });
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'split-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 더치페이 계산기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const U = T.ui, E = T.errors;
      const cur = T.cur.def;
      const sc = CORE.scale(cur);
      const dec = CORE.CURRENCIES[cur].dec;
      const decSep = new Intl.NumberFormat(lang).formatToParts(1.5).find((p) => p.type === 'decimal').value;
      const amt = (major) => { const s = dec ? major.toFixed(2) : String(major); return decSep === ',' ? s.replace('.', ',') : s; };
      const unitDef = CORE.CURRENCIES[cur].def;
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        await mockRpc('__reset');
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }).catch(() => {});
        await tab.send('Network.setCookie', { name: 'mg_lang', value: lang, domain: 'localhost', path: '/' }).catch(() => {});
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        const st0 = await tab.eval(`(() => { const s = document.getElementById('screen-split'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0] && !a[0].hidden,
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            mode: window.SPLIT_APP.state().m, cur: document.getElementById('currency').value, unit: window.SPLIT_APP.state().u, boxB: document.getElementById('box-b').hidden }; })()`);
        if (st0.lang !== lang) report(tag, `페이지 언어 ${st0.lang}`);
        if (!st0.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st0.resultHidden || st0.faqVisible) report(tag, '첫 화면에 요약·끝 화면(FAQ)이 보임');
        if (st0.mode !== 'a' || st0.cur !== cur || st0.unit !== unitDef || !st0.boxB) report(tag, `처음 상태 ${JSON.stringify(st0)}`);
        const checkLayout = async (where) => {
          const o = await tab.eval(OVERFLOW(width)); if (o) report(tag, `${where} 가로 넘침 ${o}px`);
          (await tab.eval(LABEL_OVER + `('${TAP_SEL}')`)).forEach((w) => report(tag, `${where} 버튼 문구 넘침 "${w}"`));
          (await tab.eval(BROKEN_WORDS + `('${WORD_SEL}')`)).forEach((w) => report(tag, `${where} 단어 잘림 "${w}"`));
          const sfx = await tab.eval(`[...document.querySelectorAll('.sp-inwrap')].filter((w) => w.offsetParent).filter((w) => { const s = w.querySelector('.sp-suffix').getBoundingClientRect(), i = w.querySelector('input').getBoundingClientRect(); return s.left < i.left || s.right > i.right; }).length`);
          if (sfx) report(tag, `${where} 통화 기호가 입력 칸 밖으로 나감 ${sfx}개`);
        };
        await checkLayout('첫 화면');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-start.png`));

        // 0) 빈 정산 완료 → needOne, track 0/0
        await tab.tap('#finish-btn');
        let c = await tab.eval(COUNTS);
        const fe = await tab.eval(`(() => { const e = document.getElementById('finish-err'); return e.hidden ? '' : e.textContent; })()`);
        if (fe !== U.needOne || c.s || c.d || !(await tab.eval(`document.getElementById('result').hidden`))) report(tag, `빈 정산 완료 "${fe}" track ${c.s}/${c.d}`);

        // 1) 똑같이 나누기: 100 × 3명 (총무 부담 → 골고루)
        const totalMajor = dec ? 100 : cur === 'VND' ? 1000000 : cur === 'KRW' ? 100000 : 10000;
        await tab.tap('#people-plus');
        await tab.eval(setVal('#in-total', amt(totalMajor)));
        let v = await tab.eval(OUT);
        const T1 = totalMajor * sc;
        const want1 = CORE.calcEven({ total: T1, people: 3, tip: 0, unit: unitDef, mode: 'host' });
        if (!v.calc || v.calc.grand !== T1 || JSON.stringify(v.calc.shares) !== JSON.stringify(want1.shares) || v.shares.length !== want1.groups.length || !v.sum) report(tag, `똑같이 총무 ${JSON.stringify(v.calc)} / ${JSON.stringify(v.shares)}`);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 0) report(tag, `첫 계산 track ${c.s}/${c.d} (1/0)`);
        await tab.tap('[data-rem="e"]');
        v = await tab.eval(OUT);
        const want1e = CORE.calcEven({ total: T1, people: 3, tip: 0, unit: unitDef, mode: 'even' });
        if (!v.calc || JSON.stringify(v.calc.shares) !== JSON.stringify(want1e.shares)) report(tag, `똑같이 골고루 ${JSON.stringify(v.calc && v.calc.shares)}`);
        await tab.tap('[data-rem="h"]');
        // 오류
        await tab.eval(setVal('#in-total', '12a'));
        v = await tab.eval(OUT);
        if (v.err !== E.badNum || v.calc) report(tag, `badNum "${v.err}"`);
        await tab.eval(setVal('#in-total', amt(totalMajor)));
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-even.png`));

        // 2) 먼저 낸 사람: 한 명이 전액 → 송금 2건, 모자라면 paidUnder
        await tab.tap('.sp-switch-t');
        v = await tab.eval(OUT);
        if (v.tr.length !== 2 || v.pay !== U.paidOk) report(tag, `정산(전액) ${JSON.stringify(v.tr)} "${v.pay}"`);
        await tab.eval(setVal('#payer-list .sp-payer input', amt(totalMajor / 2)));
        v = await tab.eval(OUT);
        if (v.tr.length || !v.pay || v.pay === U.paidOk) report(tag, `정산(모자람) ${JSON.stringify(v.tr)} "${v.pay}"`);
        await tab.eval(setVal('#payer-list .sp-payer input', ''));
        await checkLayout('정산');

        // 3) 결과 복사 글
        const txt = await tab.eval(`window.SPLIT_APP.copyText()`);
        if (!txt.startsWith(U.copyHead) || !txt.includes(U.copyTransfers) || /#d=/.test(txt)) report(tag, `복사 글 ${JSON.stringify(txt)}`);

        // 4) 항목별로 나누기
        await tab.tap('[data-mode="b"]');
        await tab.tap('#add-person');
        await tab.eval(`(() => { const ins = document.querySelectorAll('#people-list input'); ['Ann', 'Bo', 'Cy'].forEach((n, i) => { ins[i].value = n; ins[i].dispatchEvent(new Event('input', { bubbles: true })); }); return 1; })()`);
        await tab.eval(setVal('#item-list .sp-item:nth-child(1) .sp-price input', amt(dec ? 30 : totalMajor * 0.3)));
        await tab.tap('#add-item');
        await tab.eval(setVal('#item-list .sp-item:nth-child(2) .sp-price input', amt(dec ? 10.01 : totalMajor * 0.1 + 1)));
        await tab.tap('#item-list .sp-item:nth-child(2) .sp-who .sp-chip:nth-child(3)');   // Cy 빼기
        if (await tab.eval(`!!document.getElementById('tip-more-b').offsetParent`)) await tab.tap('#tip-more-b');
        await tab.eval(setVal('#in-tax', '10'));
        v = await tab.eval(OUT);
        const p1 = (dec ? 30 : totalMajor * 0.3) * sc, p2 = Math.round((dec ? 10.01 : totalMajor * 0.1 + 1) * sc);
        const want2 = CORE.calcItems({ people: 3, items: [{ price: p1, who: [0, 1, 2] }, { price: p2, who: [0, 1] }], tax: 10, tip: 0, unit: unitDef, mode: 'host', host: 0 });
        if (!v.calc || JSON.stringify(v.calc.shares) !== JSON.stringify(want2.shares) || v.calc.shares.reduce((a, b) => a + b, 0) !== want2.grand || v.shares.length !== 3 || !/^Ann/.test(v.shares[0])) report(tag, `항목별 ${JSON.stringify(v.calc)} / ${JSON.stringify(v.shares)}`);
        if (v.tr.length !== 2 || !v.tr.every((x) => x.includes('Ann'))) report(tag, `항목별 송금 ${JSON.stringify(v.tr)}`);
        await checkLayout('항목별');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-items.png`));

        // 5) 링크로 공유 → 새 탭에서 같은 상태 / 저장 후 새로 열면 그대로
        const stNow = v.st;
        const link = await tab.eval(`(() => { const d = window.SPLIT_CORE.encodeShare(window.SPLIT_APP.state()); return d; })()`);
        if (!link) report(tag, '공유 링크 만들기 실패');
        await tab.tap('#link-btn');
        await sleep(400);
        const clip = await tab.eval(`navigator.clipboard.readText().catch(() => '')`);
        if (clip && !/#d=[A-Za-z0-9_-]+$/.test(clip)) report(tag, `링크 복사 "${clip}"`);
        const tab2 = await openTab(width);
        await tab2.send('Network.setCookie', { name: 'mg_lang', value: lang, domain: 'localhost', path: '/' }).catch(() => {});
        await tab2.goto(base + '#d=' + link);
        const st2 = await tab2.eval(`({ st: window.SPLIT_APP.state(), shared: !document.getElementById('shared-note').hidden, names: [...document.querySelectorAll('#people-list input')].map((i) => i.value), calc: window.SPLIT_APP.calc() })`);
        if (JSON.stringify(st2.st) !== JSON.stringify(stNow) || !st2.shared || st2.names.join() !== 'Ann,Bo,Cy' || !st2.calc || st2.calc.grand !== want2.grand) report(tag, `공유 링크로 열기 ${JSON.stringify(st2)}`);
        const c2 = await tab2.eval(COUNTS);
        if (c2.s) report(tag, '공유 링크로 열기만 했는데 track start');
        await tab2.send('Page.close').catch(() => {});
        await sleep(500);
        const stored = await tab.eval(`localStorage.getItem('mg_split_v1')`);
        if (!stored || !/Ann/.test(stored)) report(tag, '마지막 입력이 저장되지 않음(mg_split_v1)');

        // 6) 정산 완료 → 요약 + 끝 화면
        await tab.tap('#finish-btn');
        await sleep(400);
        const sum = await tab.eval(`({ shown: !document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, grand: document.getElementById('sum-grand').textContent,
          shares: document.querySelectorAll('#sum-shares li').length, tr: document.querySelectorAll('#sum-transfers li').length, pay: !document.getElementById('sum-pay').hidden })`);
        if (!sum.shown || !sum.ad || !sum.grand || sum.shares !== 3 || !sum.pay || sum.tr !== 2) report(tag, `요약 ${JSON.stringify(sum)}`);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 1) report(tag, `정산 완료 뒤 track ${c.s}/${c.d} (1/1)`);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        const fq = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
        if (fq.faq !== T.faq.length || fq.share !== 6) report(tag, `FAQ ${fq.faq}개 / 공유 버튼 ${fq.share}개`);
        if (fq.retry !== U.again) report(tag, `다시 하기 문구 "${fq.retry}" ≠ "${U.again}"`);
        const shareData = JSON.parse(await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`));
        if (/[#?]/.test(shareData.url) || shareData.text !== U.shareText || shareData.title !== U.shareTitle || /Ann|Bo\b/.test(shareData.text + shareData.url)) report(tag, `공유 데이터 ${JSON.stringify(shareData)}`);
        await checkLayout('요약');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-summary.png`));
        await tab.eval(`document.getElementById('finish-btn').click(), 1`);
        await sleep(200);
        c = await tab.eval(COUNTS);
        if (c.d !== 1) report(tag, `정산 완료 두 번 → done ${c.d} (같은 판은 1번)`);

        // 7) 다시 하기 → 새 판
        await tab.eval(`document.querySelector('[data-mg-end] .mg-end-retry').click(), 1`);
        await sleep(400);
        const rs = await tab.eval(`({ result: document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, calc: window.SPLIT_APP.calc(),
          names: [...document.querySelectorAll('#people-list input')].filter((i) => i.value).length, mode: window.SPLIT_APP.state().m, pay: window.SPLIT_APP.state().s, hash: location.hash })`);
        if (!rs.result || rs.ad || rs.calc || rs.names || rs.mode !== 'b' || rs.pay !== null || rs.hash) report(tag, `다시 하기 ${JSON.stringify(rs)}`);
        await tab.tap('[data-mode="a"]');
        await tab.eval(setVal('#in-total', amt(totalMajor)));
        await tab.tap('#finish-btn');
        await sleep(300);
        c = await tab.eval(COUNTS);
        if (c.s !== 2 || c.d !== 2) report(tag, `두 번째 판 track ${c.s}/${c.d} (2/2)`);

        // 8) 서버(mock) 로 이름·금액이 가지 않음
        const log = await mockRpc('__log').catch(() => '');
        if (/Ann|"Bo"|Cy/.test(log)) report(tag, '이름이 서버(mock)로 전송됨');

        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 첫 화면 · 빈 완료 · 똑같이(총무/골고루) · 오류 · 정산(전액/모자람) · 복사 글 · 항목별(칩·세금) · 링크 공유 · 저장 · 요약 · 끝 화면 ${kids.join('→')} · 다시 하기`);
      }
    }
  } finally {
    chrome.kill(); mock.kill(); server.close();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(`\n흐름 ${runs}회, 문제 ${problems}건`);
  if (problems) { console.log('결과: FAIL'); process.exit(1); }
  console.log('결과: PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
