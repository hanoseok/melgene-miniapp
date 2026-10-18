#!/usr/bin/env node
/**
 * 만 나이 계산기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음 — 하네스는 apps/dday/tools/check-flow.js 와 같다).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 결과·FAQ 안 보임, 선택 상자(연 131개·월 12·일 31) 채워짐, 가로 넘침·버튼 문구 넘침·단어 잘림 없음
 *   - 빈 채로 계산 → noDate 오류, track start 1 / done 0
 *   - 1990-05-15 기준일 2026-10-19 → core 와 같은 만 나이·년개월일·다음 생일·살아온 날·요일·별자리·띠·기념일 4개, 한국 나이 카드 = ko 만
 *   - 2000-02-29 (오늘 기준) → 윤일 안내 보임 / 미래 생일 → future 오류 / 고쳐서 다시 → track 3/3
 *   - 끝 화면 순서(별점 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱), FAQ 개수, 다시 하기 문구, 공유 데이터에 생년월일 없음·# 없음
 *   - 다시 하기 → 결과 숨김·광고 다시·입력 비움, localStorage·주소에 생년월일 없음, 콘솔 오류 0
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
const CORE = require(path.join(SITE, 'age-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ja').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOT = process.env.SHOT || '';
const HTTP_PORT = 8951, MOCK_PORT = 8952, CDP_PORT = 9451;
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
const TXT = (id) => `(document.getElementById('${id}') || {}).textContent`;
const VIEW = `(() => { const t = (id) => (document.getElementById(id) || {}).textContent || ''; const hid = (id) => { const e = document.getElementById(id); return !e || e.hidden; };
  return { shown: !hid('result'), big: t('r-big'), ymd: t('r-ymd'), born: t('r-born'), nd: t('n-d'), nsub: t('n-sub'), leap: !hid('n-leap'), days: t('t-days'), weeks: t('t-weeks'), months: t('t-months'), hours: t('t-hours'),
    wd: t('s-weekday'), zodiac: t('s-zodiac'), animal: t('s-animal'), ms: document.querySelectorAll('#ms-list li').length, passed: document.querySelectorAll('#ms-list li.is-passed').length,
    kr: !!document.getElementById('kr-card'), krMan: t('kr-man'), krYeon: t('kr-yeon'), krCount: t('kr-count'),
    ad: document.querySelector('.mg-ad-start').hidden, err: hid('error') ? '' : t('error') }; })()`;
const pickDate = (y, m, d) => `(() => { const set = (id, v) => { const e = document.getElementById(id); e.value = String(v); e.dispatchEvent(new Event('change', { bubbles: true })); };
  set('by', ${JSON.stringify(y)}); set('bm', ${JSON.stringify(m)}); set('bd', ${JSON.stringify(d)}); return [document.getElementById('by').value, document.getElementById('bm').value, document.getElementById('bd').value].join('-'); })()`;
const setAsOf = (v) => `(() => { const e = document.getElementById('asof'); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('change', { bubbles: true })); return e.value; })()`;
const TAP_SEL = '.ag-btn, .ag-mini-btn, .ag-kicker, .ag-asof, .ag-ms-d';

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  if (SHOT) fs.mkdirSync(SHOT, { recursive: true });
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'age-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 만 나이 계산기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const R = T.result;
      const nf = new Intl.NumberFormat(lang);
      const pr = new Intl.PluralRules(lang);
      const pl = (o, n) => (o[pr.select(n)] || o.other).replace('{n}', nf.format(n));
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        await mockRpc('__reset');
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.send('Network.enable').catch(() => {});
        // 부드러운 스크롤이 도는 동안 누르면 엉뚱한 곳을 누를 수 있다 → 움직임 줄이기
        await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }).catch(() => {});
        await tab.send('Network.setCookie', { name: 'mg_lang', value: lang, domain: 'localhost', path: '/' }).catch(() => {});
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        // 첫 화면
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-age'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0] && !a[0].hidden,
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            y: document.getElementById('by').options.length, m: document.getElementById('bm').options.length, d: document.getElementById('bd').options.length,
            mName: document.getElementById('bm').options[5].textContent, yTop: document.getElementById('by').options[1].value }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.resultHidden || st.faqVisible) report(tag, '첫 화면에 결과·끝 화면(FAQ)이 보임');
        if (st.y !== CORE.MAX_AGE + 2 || st.m !== 13 || st.d !== 32 || Number(st.yTop) !== new Date().getFullYear()) report(tag, `선택 상자 보기 수 연 ${st.y} 월 ${st.m} 일 ${st.d} 맨 위 ${st.yTop}`);
        const checkLayout = async (where) => {
          const o = await tab.eval(OVERFLOW(width)); if (o) report(tag, `${where} 가로 넘침 ${o}px`);
          (await tab.eval(LABEL_OVER + `('${TAP_SEL}')`)).forEach((w) => report(tag, `${where} 버튼 문구 넘침 "${w}"`));
          (await tab.eval(BROKEN_WORDS + `('.ag-h1, .ag-hook, .ag-label, .ag-hint, .ag-btn, .ag-local, .ag-error, .ag-ymd, .ag-born, .ag-next-sub, .ag-note, .ag-stat dt, .ag-sign dt, .ag-sign dd, .ag-ms-name, .ag-h2, .mg-end-retry')`)).forEach((w) => report(tag, `${where} 단어 잘림 "${w}"`));
        };
        await checkLayout('첫 화면');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-start.png`));

        // 0) 빈 채로 계산 → noDate
        await tab.tap('#calc-btn');
        let v = await tab.eval(VIEW);
        let n = await tab.eval(COUNTS);
        if (v.shown || v.err !== T.errors.noDate) report(tag, `빈 입력 ${JSON.stringify({ shown: v.shown, err: v.err })}`);
        if (n.s !== 1 || n.d !== 0) report(tag, `빈 입력 뒤 track ${n.s}/${n.d} (1/0)`);
        await checkLayout('오류');

        // 1) 1990-05-15, 기준일 2026-10-19
        if (await tab.eval(pickDate(1990, 5, 15)) !== '1990-5-15') report(tag, '선택 상자 값 넣기 실패');
        await tab.eval(setAsOf('2026-10-19'));
        await tab.tap('#calc-btn');
        await sleep(400);
        v = await tab.eval(VIEW);
        n = await tab.eval(COUNTS);
        const c = CORE.compute(CORE.parseYmd('1990-05-15'), CORE.parseYmd('2026-10-19'));
        const wantBig = (R.big[pr.select(c.age.y)] || R.big.other).replace('{n}', nf.format(c.age.y));
        const wantYmd = [pl(R.y, c.age.y), pl(R.m, c.age.m), pl(R.d, c.age.d)].join(R.sep);
        if (!v.shown || v.big !== wantBig || v.ymd !== wantYmd || !v.ad) report(tag, `나이 카드 big "${v.big}" ≠ "${wantBig}" / ymd "${v.ymd}" ≠ "${wantYmd}" / ad ${v.ad}`);
        if (v.nd !== 'D-' + nf.format(c.next.diff) || !v.nsub.includes(nf.format(c.next.turning))) report(tag, `다음 생일 ${v.nd} / ${v.nsub}`);
        if (v.days !== nf.format(c.totals.days) || v.hours !== nf.format(c.totals.hours) || v.months !== nf.format(c.totals.months) || v.weeks !== nf.format(c.totals.weeks)) report(tag, `살아온 날 ${v.days}/${v.weeks}/${v.months}/${v.hours}`);
        const wantWd = new Intl.DateTimeFormat(lang, { timeZone: 'UTC', weekday: 'long' }).format(new Date(Date.UTC(1990, 4, 15, 12)));
        if (v.wd !== wantWd || v.zodiac !== R.zodiac.taurus || v.animal !== R.animals.horse) report(tag, `요일·별자리·띠 ${v.wd}/${v.zodiac}/${v.animal}`);
        if (v.ms !== 4 || v.passed !== 1) report(tag, `기념일 ${v.ms}개 (지난 것 ${v.passed})`);
        if (v.leap) report(tag, '2/29 생이 아닌데 윤일 안내가 보임');
        if (v.kr !== (lang === 'ko')) report(tag, `한국 나이 카드 ${v.kr}`);
        if (lang === 'ko' && (v.krMan !== '36세' || v.krYeon !== '36세' || v.krCount !== '37세')) report(tag, `한국 나이 ${v.krMan}/${v.krYeon}/${v.krCount}`);
        if (n.s !== 1 || n.d !== 1) report(tag, `첫 결과 뒤 track ${n.s}/${n.d} (1/1 — 빈 입력과 같은 판)`);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        const fq = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
        if (fq.faq !== T.faq.length || fq.share !== 6) report(tag, `FAQ ${fq.faq}개 / 공유 버튼 ${fq.share}개`);
        if (fq.retry !== R.again) report(tag, `다시 하기 문구 "${fq.retry}" ≠ "${R.again}"`);
        const shareData = await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`);
        if (/1990|05-15|#|\?/.test(JSON.parse(shareData).url) || /1990/.test(shareData) || !shareData.includes(nf.format(c.totals.days))) report(tag, `공유 데이터 ${shareData}`);
        await checkLayout('결과');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-result.png`));

        // 2) 2000-02-29, 기준일 비움 → 윤일 안내
        await tab.eval(setAsOf(''));
        await tab.eval(pickDate(2000, 2, 29));
        await tab.tap('#calc-btn');
        await sleep(200);
        v = await tab.eval(VIEW);
        n = await tab.eval(COUNTS);
        if (!v.leap || !v.shown) report(tag, '2/29 생인데 윤일 안내가 안 보임');
        if (n.s !== 2 || n.d !== 2) report(tag, `두 번째 결과 뒤 track ${n.s}/${n.d} (2/2)`);
        // 평년으로 바꾸면 일 상자가 28일까지
        await tab.eval(pickDate(2001, 2, ''));
        const dmax = await tab.eval(`document.getElementById('bd').options.length - 1`);
        if (dmax !== 28) report(tag, `2001년 2월 일 상자 ${dmax}개 (28)`);

        // 3) 미래 생일 → future, 고쳐서 다시
        await tab.eval(setAsOf('2000-01-01'));
        await tab.eval(pickDate(2001, 3, 3));
        await tab.tap('#calc-btn');
        v = await tab.eval(VIEW);
        if (v.err !== T.errors.future) report(tag, `미래 생일 오류 "${v.err}"`);
        await tab.eval(setAsOf(''));
        await tab.tap('#calc-btn');
        await sleep(200);
        v = await tab.eval(VIEW);
        n = await tab.eval(COUNTS);
        if (v.err || !v.shown || n.s !== 3 || n.d !== 3) report(tag, `고쳐서 다시 계산 err "${v.err}" track ${n.s}/${n.d} (3/3)`);

        // 4) 다시 하기
        // 끝 화면 아래쪽(광고·다른 미니앱)이 늦게 자리를 바꿀 수 있어 좌표 대신 요소를 직접 누른다
        await sleep(600);
        await tab.eval(`document.querySelector('[data-mg-end] .mg-end-retry').click(), 1`);
        await sleep(400);
        const rs = await tab.eval(`({ result: document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, y: document.getElementById('by').value, m: document.getElementById('bm').value, d: document.getElementById('bd').value, a: document.getElementById('asof').value })`);
        if (!rs.result || rs.ad || rs.y || rs.m || rs.d || rs.a) report(tag, `다시 하기 ${JSON.stringify(rs)}`);
        const leak = await tab.eval(`JSON.stringify(localStorage) + location.href + document.cookie`);
        if (/1990|2000-02-29|2001-03-03/.test(leak)) report(tag, '생년월일이 localStorage·주소·쿠키에 남음');

        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 첫 화면 · 빈 입력 오류 · ${wantBig} (${wantYmd}) · 2/29 안내 · 미래 생일 오류 · 다시 하기 · 끝 화면 ${kids.join('→')}`);
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
