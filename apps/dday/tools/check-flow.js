#!/usr/bin/env node
/**
 * 디데이 계산기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 결과·FAQ 안 보임, 가로 넘침·버튼 문구 넘침·단어 잘림 없음
 *   - 디데이: 오늘+10 → D-10, 실시간 초가 흐름, 끝 화면 순서(별점 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱), mg-ad-start 숨김
 *   - 빠른 선택(할로윈) → core 와 같은 D-n / 며칠째: 오늘-99 + 1일로 세기 → 100 이 보이고 기념일 목록 / 날짜 계산 +100 → core 와 같은 날짜
 *   - track start/done: 계산할 때마다 1번씩, 공유 카드를 열 때는 0번
 *   - 저장 → 새로고침 → 저장 목록 1개 → 눌러서 열기 / 지우기
 *   - 공유 링크(#d=) → 공유 배지, 다시 하기 문구 = "나도 만들기" → 누르면 주소의 #d= 지움·첫 화면 / 깨진 링크 → 오류 안내
 *   - 공통 공유 데이터에 제목·#d= 없음, 이미지 저장 버튼이 오류 없이 동작, 콘솔 오류 0
 *   - SHOT=<폴더> 면 첫 화면·결과 화면 스크린샷
 *
 * 실행: node tools/check-flow.js                  (en,ko,ja × 360,1440)
 *       node tools/check-flow.js ru,th,de 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'dday-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ja').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOT = process.env.SHOT || '';
const HTTP_PORT = 8941, MOCK_PORT = 8942, CDP_PORT = 9441;
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

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
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
const CARD = `(() => ({ shown: !document.getElementById('result').hidden, big: document.getElementById('r-big').textContent, sub: document.getElementById('r-sub').textContent,
  title: document.getElementById('r-title').textContent, ad: document.querySelector('.mg-ad-start').hidden, badge: !document.getElementById('shared-badge').hidden,
  ms: document.querySelectorAll('#ms-list li').length, msShown: !document.getElementById('ms-card').hidden, live: !document.getElementById('r-live').hidden, s: document.getElementById('lv-s').textContent,
  err: document.getElementById('error').hidden ? '' : document.getElementById('error').textContent }))()`;
const setVal = (id, v) => `(() => { const e = document.getElementById('${id}'); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const localToday = () => CORE.today(new Date());
const TAP_SEL = '.dd-tab, .dd-preset, .dd-seg-btn, .dd-btn, .dd-mini-btn, .dd-qn, .dd-switch-text, .dd-kicker, .dd-badge';

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  if (SHOT) fs.mkdirSync(SHOT, { recursive: true });
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dd-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 디데이 계산기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        await mockRpc('__reset');
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.send('Network.enable').catch(() => {});
        await tab.send('Network.setCookie', { name: 'mg_lang', value: lang, domain: 'localhost', path: '/' }).catch(() => {});
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        // 첫 화면
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-dd'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0] && !a[0].hidden,
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            saved: !document.getElementById('saved-card').hidden }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.resultHidden || st.faqVisible) report(tag, '첫 화면에 결과·끝 화면(FAQ)이 보임');
        if (st.saved) report(tag, '처음부터 저장 목록이 보임');
        const checkLayout = async (where) => {
          const o = await tab.eval(OVERFLOW); if (o) report(tag, `${where} 가로 넘침 ${o}px`);
          (await tab.eval(LABEL_OVER + `('${TAP_SEL}')`)).forEach((w) => report(tag, `${where} 버튼 문구 넘침 "${w}"`));
          (await tab.eval(BROKEN_WORDS + `('.dd-h1, .dd-hook, .dd-label, .dd-hint, .dd-tab, .dd-preset-name, .dd-btn, .dd-switch-text, .dd-seg-btn, .dd-sub, .dd-rdate, .dd-extra, .dd-ms-name, .dd-live-cell small, .mg-end-retry')`)).forEach((w) => report(tag, `${where} 단어 잘림 "${w}"`));
        };
        for (const m of CORE.MODES) { await tab.tap(`[data-mode="${m}"]`); await checkLayout(`첫 화면(${m})`); }
        await tab.tap('[data-mode="countdown"]');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-start.png`));

        // 1) 디데이: 오늘 + 10
        const tdy = localToday();
        await tab.eval(setVal('title', 'Trip ✈️ <b>'));
        await tab.eval(setVal('date', CORE.fmtYmd(CORE.addDays(tdy, 10))));
        await tab.tap('#calc-btn');
        await sleep(400);
        let c = await tab.eval(CARD);
        if (!c.shown || c.big !== 'D-10' || !c.ad || !c.live) report(tag, `디데이 카드 ${JSON.stringify(c)}`);
        if (c.title !== 'Trip ✈️ b' && c.title !== 'Trip ✈️ <b>'.replace(/[<>]/g, ' ').replace(/\s+/g, ' ').trim()) report(tag, `제목 다듬기 "${c.title}"`);
        let n = await tab.eval(COUNTS);
        if (n.s !== 1 || n.d !== 1) report(tag, `계산 1번 뒤 track ${n.s}/${n.d} (1/1)`);
        await sleep(1300);
        const s2 = (await tab.eval(CARD)).s;
        if (s2 === c.s) report(tag, `실시간 초가 흐르지 않음 (${c.s} → ${s2})`);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        const fq = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
        if (fq.faq !== T.faq.length || fq.share !== 6) report(tag, `FAQ ${fq.faq}개 / 공유 버튼 ${fq.share}개`);
        if (fq.retry !== T.result.again) report(tag, `다시 하기 문구 "${fq.retry}" ≠ "${T.result.again}"`);
        await checkLayout('결과(디데이)');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-countdown.png`));
        const shareData = await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`);
        if (/Trip|#d=/.test(shareData)) report(tag, `공통 공유 데이터에 제목·#d= 가 있음 ${shareData}`);
        // 이미지 저장 (다운로드는 막아 둠 — 오류 없이 끝나는지만)
        await tab.tap('#png-btn');
        await sleep(600);

        // 2) 빠른 선택: 할로윈
        await tab.tap('[data-preset="halloween"]');
        await sleep(300);
        c = await tab.eval(CARD);
        const hw = CORE.presets(localToday()).find((p) => p.id === 'halloween');
        const wantHw = hw.diff === 0 ? T.result.dday : CORE.ddayLabel(hw.diff);
        if (c.big !== wantHw) report(tag, `할로윈 ${c.big} ≠ ${wantHw}`);
        n = await tab.eval(COUNTS);
        if (n.s !== 2 || n.d !== 2) report(tag, `빠른 선택 뒤 track ${n.s}/${n.d} (2/2)`);

        // 3) 며칠째: 오늘 - 99, 1일로 세기 → 100
        await tab.tap('[data-mode="since"]');
        await tab.eval(setVal('date', CORE.fmtYmd(CORE.addDays(tdy, -99))));
        await tab.eval(`(() => { const d = document.getElementById('day1'); d.checked = true; return 1; })()`);
        await tab.tap('#calc-btn');
        await sleep(300);
        c = await tab.eval(CARD);
        const hundred = new Intl.NumberFormat(lang).format(100);
        if (!c.big.includes(hundred) || !c.msShown || c.ms < 3 || c.live) report(tag, `며칠째 카드 ${JSON.stringify(c)}`);
        const msToday = await tab.eval(`document.querySelectorAll('#ms-list li.is-today').length`);
        if (msToday !== 1) report(tag, `오늘이 100일째인데 기념일 목록에 "오늘" 이 ${msToday}개`);
        await tab.eval(`(() => { document.getElementById('day1').checked = false; return 1; })()`);
        await tab.tap('#calc-btn');
        await sleep(200);
        c = await tab.eval(CARD);
        if (!c.big.includes(new Intl.NumberFormat(lang).format(99))) report(tag, `1일로 세기 끔 → 99 가 아님: ${c.big}`);
        await checkLayout('결과(며칠째)');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-since.png`));

        // 4) 날짜 계산: 2024-02-29 + 365
        await tab.tap('[data-mode="math"]');
        await tab.eval(setVal('date', '2024-02-29'));
        await tab.eval(setVal('ndays', '365'));
        await tab.tap('[data-sign="1"]');
        await tab.tap('#calc-btn');
        await sleep(200);
        c = await tab.eval(CARD);
        const wantMath = new Intl.DateTimeFormat(lang, { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(Date.UTC(2025, 1, 28, 12)));
        if (c.big !== wantMath) report(tag, `날짜 계산 ${c.big} ≠ ${wantMath}`);
        await tab.eval(setVal('ndays', 'abc'));
        await tab.tap('#calc-btn');
        c = await tab.eval(CARD);
        if (c.big !== wantMath) report(tag, '숫자가 아닌 날수로 결과가 바뀜');
        n = await tab.eval(COUNTS);
        if (n.s !== 5 || n.d !== 5) report(tag, `계산 5번 뒤 track ${n.s}/${n.d} (5/5)`);
        await checkLayout('결과(날짜 계산)');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-math.png`));

        // 5) 저장 → 새로고침 → 목록
        await tab.tap('#save-btn');
        await tab.tap('#save-btn');
        let sv = await tab.eval(`window.DDAY_APP.saved().length`);
        if (sv !== 1) report(tag, `같은 카드를 두 번 저장 → ${sv}개 (1개)`);
        await tab.reload();
        const list = await tab.eval(`({ shown: !document.getElementById('saved-card').hidden, n: document.querySelectorAll('#saved-list li').length, txt: (document.querySelector('.dd-saved-d') || {}).textContent })`);
        if (!list.shown || list.n !== 1 || list.txt !== wantMath) report(tag, `새로고침 뒤 저장 목록 ${JSON.stringify(list)}`);
        await tab.tap('.dd-saved-open');
        await sleep(200);
        c = await tab.eval(CARD);
        n = await tab.eval(COUNTS);
        if (c.big !== wantMath || n.s !== 1 || n.d !== 1) report(tag, `저장 목록 열기 ${c.big} track ${n.s}/${n.d}`);
        await tab.tap('.dd-saved-del');
        sv = await tab.eval(`({ n: window.DDAY_APP.saved().length, ls: localStorage.getItem('mg_dday_saved'), shown: !document.getElementById('saved-card').hidden })`);
        if (sv.n !== 0 || sv.ls != null || sv.shown) report(tag, `저장 목록 지우기 ${JSON.stringify(sv)}`);

        // 6) 공유 링크
        const rec = { k: 'since', t: '우리 💖 Us', d: CORE.addDays(tdy, -9), o: true, e: 3, c: 2 };
        const code = CORE.encodeShare(rec);
        await tab.goto('about:blank');
        await tab.goto(base + '#d=' + code);
        c = await tab.eval(CARD);
        n = await tab.eval(COUNTS);
        if (!c.shown || !c.badge || c.title !== rec.t || !c.big.includes(new Intl.NumberFormat(lang).format(10))) report(tag, `공유 카드 ${JSON.stringify(c)}`);
        if (n.s !== 0 || n.d !== 0) report(tag, `공유 카드를 열었는데 track ${n.s}/${n.d} (0/0)`);
        const rt = await tab.eval(`(document.querySelector('.mg-end-retry') || {}).textContent`);
        if (rt !== T.result.makeOwn) report(tag, `공유 카드 다시 하기 문구 "${rt}" ≠ "${T.result.makeOwn}"`);
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-shared.png`));
        await tab.tap('[data-mg-end] .mg-end-retry');
        await sleep(400);
        const own = await tab.eval(`({ hash: location.hash, result: document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, shared: window.DDAY_APP.shared(), mode: window.DDAY_APP.mode() })`);
        if (own.hash || !own.result || own.ad || own.shared || own.mode !== 'countdown') report(tag, `나도 만들기 ${JSON.stringify(own)}`);
        await tab.goto('about:blank');
        await tab.goto(base + '#d=' + code.slice(0, -6) + 'AAAAAA');
        c = await tab.eval(CARD);
        if (c.shown || !c.err) report(tag, `깨진 링크인데 ${JSON.stringify(c)}`);

        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 첫 화면 · 디데이 D-10 실시간 · 할로윈 ${wantHw} · 100일째 · 2024-02-29+365 · 저장/새로고침/열기/지우기 · 공유 카드 · 깨진 링크 · 끝 화면 ${kids.join('→')}`);
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
