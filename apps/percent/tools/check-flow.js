#!/usr/bin/env node
/**
 * 퍼센트 계산기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음 — 하네스는 apps/age/tools/check-flow.js 와 같다).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 요약·FAQ 안 보임, 탭 6개·첫 카드만 보임, 가로 넘침·버튼 문구 넘침·단어 잘림 없음
 *   - 아무것도 안 하고 요약 → needOne, track 0/0
 *   - of(한 칸만 → 대기, 15·200 → 30 + 계산식, 언어 소수점 12,5 / 12.5 + 다른 기호 자릿수, 0.1 × 0.2 부동소수, abc → badNum)
 *   - 진짜 클릭으로 탭 전환 + localStorage 탭 기억, what(Y=0 → divZero, 25%), change(+25%, −12.5% U+2212, A=0 → fromZero),
 *     adjust(칩 20% → 96·24 절약, + 방향 144, 150% 할인 → over100), reverse(+20%·−20% 원래 값, 흔한 실수 안내), points(+2 pp, 상대 +50%, 0% 시작)
 *   - 복사 버튼 → 토스트·클립보드, 첫 결과에 track start 1번, 요약 → 6개·광고 숨김·track done 1번(두 번 눌러도 1번)
 *   - 끝 화면 순서(별점 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱), FAQ 개수, 다시 하기 문구, 공유 데이터에 숫자·#·? 없음
 *   - 다시 하기 → 입력·결과 비움, 새 판 track 2/2, 새로 열면 마지막 탭 기억, 숫자는 localStorage·주소·쿠키에 없음, 콘솔 오류 0
 *   - SHOT=<폴더> 면 첫 화면·할인·요약 스크린샷
 *
 * 실행: node tools/check-flow.js                  (en,ko,th × 360,1440)
 *       node tools/check-flow.js ru,de,fr 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'percent-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOT = process.env.SHOT || '';
const HTTP_PORT = 8987, MOCK_PORT = 8988, CDP_PORT = 9487;
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
const OUT = (m) => `(() => { const p = document.getElementById('panel-${m}'); const t = (s) => (p.querySelector(s) || {}).textContent || ''; const h = (s) => { const e = p.querySelector(s); return !e || e.hidden; };
  return { shown: !p.hidden, lead: t('[data-lead]'), big: t('[data-big]'), sub: h('[data-sub]') ? '' : t('[data-sub]'), warn: h('[data-warn]') ? '' : t('[data-warn]'),
    err: h('[data-err]') ? '' : t('[data-err]'), how: h('[data-howbox]') ? '' : t('[data-how]'), copy: !p.querySelector('[data-copy]').disabled }; })()`;
const setIn = (m, a, b) => `(() => { const p = document.getElementById('panel-${m}'); const set = (k, v) => { if (v == null) return; const e = p.querySelector('[data-in="' + k + '"]'); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); };
  set('a', ${JSON.stringify(a)}); set('b', ${JSON.stringify(b)}); return 1; })()`;
const TAP_SEL = '.pc-tab-t, .pc-seg-btn, .pc-chip, .pc-copy, .pc-btn, .pc-kicker';

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  if (SHOT) fs.mkdirSync(SHOT, { recursive: true });
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'percent-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 퍼센트 계산기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const U = T.ui, M = T.modes, E = T.errors;
      const nf = new Intl.NumberFormat(lang, { maximumFractionDigits: 10 });
      const n = (x) => nf.format(x);
      const pct = (x) => T.num.pct.replace('{n}', n(x));
      const sgn = (x, tpl) => (x > 0 ? T.num.plus : x < 0 ? T.num.minus : '') + tpl.replace('{n}', n(Math.abs(x)));
      const dec = CORE.decimalSep(lang);
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        await mockRpc('__reset');
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.send('Network.enable').catch(() => {});
        await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }).catch(() => {});
        await tab.send('Network.setCookie', { name: 'mg_lang', value: lang, domain: 'localhost', path: '/' }).catch(() => {});
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        // 첫 화면
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-percent'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0] && !a[0].hidden,
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            tabs: document.querySelectorAll('.pc-tab').length, visible: [...document.querySelectorAll('.pc-panel')].filter((p) => !p.hidden).map((p) => p.dataset.mode).join(','),
            mode: window.PERCENT_APP.mode() }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.resultHidden || st.faqVisible) report(tag, '첫 화면에 요약·끝 화면(FAQ)이 보임');
        if (st.tabs !== 6 || st.visible !== 'of' || st.mode !== 'of') report(tag, `탭 ${st.tabs}개 / 보이는 카드 ${st.visible} / 모드 ${st.mode}`);
        const checkLayout = async (where) => {
          const o = await tab.eval(OVERFLOW(width)); if (o) report(tag, `${where} 가로 넘침 ${o}px`);
          (await tab.eval(LABEL_OVER + `('${TAP_SEL}')`)).forEach((w) => report(tag, `${where} 버튼 문구 넘침 "${w}"`));
          (await tab.eval(BROKEN_WORDS + `('.pc-h1, .pc-hook, .pc-tab-t, .pc-h2, .pc-desc, .pc-label, .pc-lead, .pc-sub, .pc-warn, .pc-err, .pc-seg-btn, .pc-chips-label, .pc-btn, .pc-local, .pc-hint, .pc-error, .pc-sum-t, .pc-note, .mg-end-retry')`)).forEach((w) => report(tag, `${where} 단어 잘림 "${w}"`));
        };
        await checkLayout('첫 화면');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-start.png`));

        // 0) 아무것도 안 하고 요약 → needOne, track 0/0
        await tab.tap('#finish-btn');
        let c = await tab.eval(COUNTS);
        const fe = await tab.eval(`(() => { const e = document.getElementById('finish-err'); return e.hidden ? '' : e.textContent; })()`);
        if (fe !== U.needOne || !(await tab.eval(`document.getElementById('result').hidden`))) report(tag, `빈 요약 "${fe}"`);
        if (c.s !== 0 || c.d !== 0) report(tag, `빈 요약 뒤 track ${c.s}/${c.d} (0/0)`);

        // 1) of: 15% of 200 = 30, 한 칸만 → 대기, 잘못된 입력 → badNum
        await tab.eval(setIn('of', '15', ''));
        let v = await tab.eval(OUT('of'));
        if (v.lead !== U.waiting || v.copy || v.err) report(tag, `한 칸만 입력 ${JSON.stringify(v)}`);
        c = await tab.eval(COUNTS);
        if (c.s !== 0) report(tag, '결과 없이 track start');
        await tab.eval(setIn('of', null, '200'));
        v = await tab.eval(OUT('of'));
        if (v.big !== n(30) || !v.how.includes(n(30)) || v.how !== `${n(200)} × ${n(15)} ÷ 100 = ${n(30)}` || v.lead !== M.of.lead.replace('{pa}', pct(15)).replace('{b}', n(200)) || !v.copy) report(tag, `of 결과 ${JSON.stringify(v)}`);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 0) report(tag, `첫 결과 뒤 track ${c.s}/${c.d} (1/0)`);
        await tab.eval(setIn('of', '12' + dec + '5', '1' + (dec === ',' ? '.' : ',') + '250'));     // 소수점 = 언어 기호, 자릿수 = 다른 기호
        v = await tab.eval(OUT('of'));
        if (v.big !== n(156.25)) report(tag, `of 12${dec}5% × 1250 = "${v.big}" ≠ "${n(156.25)}"`);
        await tab.eval(setIn('of', '0.1', '0.2'));
        v = await tab.eval(OUT('of'));
        if (v.big !== n(0.0002)) report(tag, `부동소수 0.1% × 0.2 = "${v.big}" ≠ "${n(0.0002)}" (어느 언어든 "." 한 번 + 세 자리 아님 = 소수점)`);
        await tab.eval(setIn('of', 'abc', '200'));
        v = await tab.eval(OUT('of'));
        if (v.err !== E.badNum || v.copy || v.how) report(tag, `잘못된 입력 ${JSON.stringify(v)}`);
        await tab.eval(setIn('of', '15', '200'));
        await checkLayout('of 결과');

        // 2) 탭 바꾸기(진짜 클릭) + what: Y = 0 → divZero, 30/120 = 25%
        await tab.tap('#tab-what');
        st.mode = await tab.eval(`window.PERCENT_APP.mode() + ':' + [...document.querySelectorAll('.pc-panel')].filter((p) => !p.hidden).map((p) => p.dataset.mode).join(',') + ':' + localStorage.getItem('mg_percent_mode')`);
        if (st.mode !== 'what:what:what') report(tag, `탭 전환 ${st.mode}`);
        await tab.eval(setIn('what', '5', '0'));
        v = await tab.eval(OUT('what'));
        if (v.err !== E.divZero) report(tag, `what Y=0 "${v.err}"`);
        await tab.eval(setIn('what', '30', '120'));
        v = await tab.eval(OUT('what'));
        if (v.big !== pct(25) || v.how !== `${n(30)} ÷ ${n(120)} × 100 = ${pct(25)}`) report(tag, `what 결과 ${JSON.stringify(v)}`);

        // 3) change: 80 → 100 = +25%, 100 → 87.5 = −12.5%
        await tab.tap('#tab-change');
        await tab.eval(setIn('change', '80', '100'));
        v = await tab.eval(OUT('change'));
        if (v.big !== sgn(25, T.num.pct) || v.sub !== M.change.up.replace('{d}', n(20))) report(tag, `change +25% ${JSON.stringify(v)}`);
        await tab.eval(setIn('change', '100', '87' + dec + '5'));
        v = await tab.eval(OUT('change'));
        if (v.big !== sgn(-12.5, T.num.pct) || v.sub !== M.change.down.replace('{d}', n(12.5)) || !v.big.startsWith('−')) report(tag, `change −12.5% ${JSON.stringify(v)}`);
        await tab.eval(setIn('change', '0', '5'));
        v = await tab.eval(OUT('change'));
        if (v.err !== E.fromZero) report(tag, `change A=0 "${v.err}"`);
        await tab.eval(setIn('change', '80', '100'));
        await checkLayout('change 결과');

        // 4) adjust: 칩 20% + 120 → 96, 24 절약; 방향 + 로 바꾸면 144
        await tab.tap('#tab-adjust');
        await tab.eval(setIn('adjust', '120', null));
        await tab.tap('#panel-adjust .pc-chip[data-chip="20"]');
        v = await tab.eval(OUT('adjust'));
        const chip = await tab.eval(`[...document.querySelectorAll('#panel-adjust .pc-chip')].map((c) => c.getAttribute('aria-pressed')).join(',') + ':' + document.querySelector('#panel-adjust [data-in="b"]').value`);
        if (v.big !== n(96) || v.sub !== M.adjust.saveDown.replace('{s}', n(24)) || chip !== 'false,true,false,false:20') report(tag, `adjust 칩 20% ${JSON.stringify(v)} ${chip}`);
        await tab.tap('#panel-adjust .pc-seg-btn[data-dir="up"]');
        v = await tab.eval(OUT('adjust'));
        if (v.big !== n(144) || v.sub !== M.adjust.saveUp.replace('{s}', n(24))) report(tag, `adjust +20% ${JSON.stringify(v)}`);
        await tab.tap('#panel-adjust .pc-seg-btn[data-dir="down"]');
        await tab.eval(setIn('adjust', null, '150'));
        v = await tab.eval(OUT('adjust'));
        if (v.err !== E.over100) report(tag, `adjust 150% 할인 "${v.err}"`);
        await tab.eval(setIn('adjust', null, '20'));
        await checkLayout('adjust 결과');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-adjust.png`));

        // 5) reverse: 20% 늘어 96 → 80 (흔한 실수 76.8), 20% 줄어 80 → 100
        await tab.tap('#tab-reverse');
        await tab.eval(setIn('reverse', '96', '20'));
        v = await tab.eval(OUT('reverse'));
        if (v.big !== n(80) || !v.warn.includes(n(76.8)) || !v.how.includes(n(1.2))) report(tag, `reverse +20% ${JSON.stringify(v)}`);
        await tab.tap('#panel-reverse .pc-seg-btn[data-dir="down"]');
        await tab.eval(setIn('reverse', '80', '20'));
        v = await tab.eval(OUT('reverse'));
        if (v.big !== n(100) || !v.warn.includes(n(96)) || !v.how.includes(n(0.8))) report(tag, `reverse −20% ${JSON.stringify(v)}`);

        // 6) points: 4% → 6% = +2 pp, 상대 +50%
        await tab.tap('#tab-points');
        await tab.eval(setIn('points', '4', '6'));
        v = await tab.eval(OUT('points'));
        if (v.big !== sgn(2, T.num.pp) || v.sub !== M.points.rel.replace('{rel}', sgn(50, T.num.pct))) report(tag, `points ${JSON.stringify(v)}`);
        await tab.eval(setIn('points', '0', '3'));
        v = await tab.eval(OUT('points'));
        if (v.sub !== M.points.relZero) report(tag, `points 0% 시작 "${v.sub}"`);
        await tab.eval(setIn('points', '4', '6'));
        await checkLayout('points 결과');

        // 복사
        await tab.tap('#panel-points .pc-copy');
        await sleep(250);
        const clip = await tab.eval(`navigator.clipboard.readText().catch(() => '')`);
        const toastTxt = await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`);
        if (toastTxt !== U.copied) report(tag, `복사 토스트 "${toastTxt}"`);
        if (clip && !clip.includes(sgn(2, T.num.pp))) report(tag, `복사 내용 "${clip}"`);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 0) report(tag, `요약 전 track ${c.s}/${c.d} (1/0)`);

        // 7) 요약 → 끝 화면
        await tab.tap('#finish-btn');
        await sleep(400);
        const sum = await tab.eval(`({ shown: !document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, n: document.querySelectorAll('#sum-list li').length,
          first: (document.querySelector('#sum-list .pc-sum-big') || {}).textContent })`);
        if (!sum.shown || !sum.ad || sum.n !== 6 || sum.first !== sgn(2, T.num.pp)) report(tag, `요약 ${JSON.stringify(sum)}`);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 1) report(tag, `요약 뒤 track ${c.s}/${c.d} (1/1)`);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        const fq = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
        if (fq.faq !== T.faq.length || fq.share !== 6) report(tag, `FAQ ${fq.faq}개 / 공유 버튼 ${fq.share}개`);
        if (fq.retry !== U.again) report(tag, `다시 하기 문구 "${fq.retry}" ≠ "${U.again}"`);
        const shareData = JSON.parse(await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`));
        if (/[#?]/.test(shareData.url) || shareData.text !== U.shareText || shareData.title !== U.shareTitle) report(tag, `공유 데이터 ${JSON.stringify(shareData)}`);
        await checkLayout('요약');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-summary.png`));
        await tab.eval(`document.getElementById('finish-btn').click(), 1`);
        await sleep(200);
        c = await tab.eval(COUNTS);
        if (c.d !== 1) report(tag, `요약 두 번 → done ${c.d} (같은 판은 1번)`);

        // 8) 다시 하기 → 새 판
        await sleep(400);
        await tab.eval(`document.querySelector('[data-mg-end] .mg-end-retry').click(), 1`);
        await sleep(400);
        const rs = await tab.eval(`({ result: document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden,
          filled: [...document.querySelectorAll('.pc-input')].filter((i) => i.value).length, copies: [...document.querySelectorAll('.pc-copy')].filter((b) => !b.disabled).length,
          res: window.PERCENT_APP.results().length, mode: window.PERCENT_APP.mode() })`);
        if (!rs.result || rs.ad || rs.filled || rs.copies || rs.res || rs.mode !== 'points') report(tag, `다시 하기 ${JSON.stringify(rs)}`);
        await tab.eval(setIn('points', '1', '2'));
        await tab.tap('#finish-btn');
        await sleep(300);
        c = await tab.eval(COUNTS);
        if (c.s !== 2 || c.d !== 2) report(tag, `두 번째 판 track ${c.s}/${c.d} (2/2)`);

        // 9) 새로 열면 마지막 탭(points) 기억, 숫자는 어디에도 안 남음
        const leak = await tab.eval(`JSON.stringify(localStorage) + location.href + document.cookie`);
        if (/76[.,]8|87[.,]5|"96"|1250/.test(leak)) report(tag, '입력 숫자가 localStorage·주소·쿠키에 남음');
        await tab.reload();
        const again = await tab.eval(`window.PERCENT_APP.mode() + ':' + document.querySelector('.pc-tab[aria-selected="true"]').dataset.mode`);
        if (again !== 'points:points') report(tag, `새로 열었을 때 탭 ${again} (points 기억)`);

        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 첫 화면 · 빈 요약 · 6가지 계산(오류 포함) · 칩·방향 · 복사 · 요약 ${sum.n}개 · 끝 화면 ${kids.join('→')} · 다시 하기 · 탭 기억`);
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
