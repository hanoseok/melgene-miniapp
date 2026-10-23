#!/usr/bin/env node
/**
 * BMI 계산기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음 — 하네스는 apps/percent/tools/check-flow.js 와 같다).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 요약·FAQ 안 보임, cm·kg 기본, 아시아 기준 기본값(ko·ja·zh·th·vi 켜짐), 나이·성별 접힘,
 *     색 막대 칸 수 = 기준 단계 수, 가로 넘침·버튼 문구 넘침·단어 잘림·단위 글자 넘침 없음
 *   - 아무것도 안 하고 요약 → needOne, track 0/0 · 키만 → 대기 + track start 1번(첫 유효 입력)
 *   - WHO 170cm 65kg → 22.5 정상 · 정상 범위 53.5~72.0kg / 172cm 74,5kg(쉼표) → 25.2 과체중 · 줄일 몸무게 / 74.5(점) 같음
 *   - 아시아 기준 진짜 클릭 → 그 언어 기준(kr·jp·cn·asia)의 단계 이름 · 막대 칸 수
 *   - 오류 badNum(aria-invalid)·heightRange·weightRange·inchRange·ageRange
 *   - 단위 바꾸기(진짜 클릭) → 들어 있던 값을 ft·in·lb 로 옮김 · 같은 BMI · localStorage 단위 기억, 5'7" 145lb → 22.7 · lb 범위
 *   - 나이·성별 열기 → 15세 미성년 안내 · 70세 안내 · 성별 안내
 *   - 요약 → 광고 숨김 · track done 1번(두 번 눌러도 1번) · 끝 화면 순서(별점 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱) · FAQ 개수 ·
 *     공유 데이터에 숫자·#·? 없음 · 요약이 열린 채 값을 바꾸면 요약도 바뀜
 *   - 다시 하기 → 입력 비움(단위 그대로) · 새 판 track 2/2 · 숫자는 저장소·주소·쿠키에 없음 · 새로 열면 단위 기억 · 콘솔 오류 0
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
const CORE = require(path.join(SITE, 'bmi-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOT = process.env.SHOT || '';
const HTTP_PORT = 9011, MOCK_PORT = 9012, CDP_PORT = 9511;
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
  return { lead: t('out-lead'), big: t('out-big'), cat: vis('out-cat') ? t('out-cat') : '', range: vis('range') ? t('range-v') : '', diff: vis('range') ? t('range-d') : '',
    err: vis('out-err') ? t('out-err') : '', marker: vis('marker'), minor: vis('note-minor'), senior: vis('note-senior'), sex: vis('note-sex'),
    ticks: document.querySelectorAll('#ticks .bm-tick').length, segs: document.querySelectorAll('#bar .bm-seg-c').length, scale: window.BMI_APP.scale(), unit: window.BMI_APP.unit() }; })()`;
const setIn = (vals) => `(() => { const v = ${JSON.stringify(vals)}; Object.keys(v).forEach((k) => { const e = document.getElementById('in-' + k); e.value = v[k]; e.dispatchEvent(new Event('input', { bubbles: true })); }); return 1; })()`;
const TAP_SEL = '.bm-seg-btn, .bm-btn, .bm-more, .bm-kicker, .bm-switch-t, .bm-cat';

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  if (SHOT) fs.mkdirSync(SHOT, { recursive: true });
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bmi-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== BMI 계산기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const U = T.ui, E = T.errors, N = T.num;
      const nf1 = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const n1 = (x) => nf1.format(x);
      const dec = new Intl.NumberFormat(lang).formatToParts(1.5).find((p) => p.type === 'decimal').value === ',' ? ',' : '.';
      const wkg = (x) => N.kg.replace('{n}', n1(x));
      const wlb = (x) => N.lb.replace('{n}', n1(x));
      const altOn = CORE.asiaDefault(lang), ALT = CORE.altScale(lang);
      const labelsOf = (scale) => (scale === 'who' ? T.scales.who : T.scales.alt).labels;
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
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-bmi'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0] && !a[0].hidden,
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            unit: window.BMI_APP.unit(), asia: document.getElementById('asia-toggle').checked, more: document.getElementById('more-box').hidden,
            metricShown: !document.querySelector('[data-unit-box="metric"]').hidden, impHidden: document.querySelector('[data-unit-box="imperial"]').hidden }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.resultHidden || st.faqVisible) report(tag, '첫 화면에 요약·끝 화면(FAQ)이 보임');
        if (st.unit !== 'metric' || !st.metricShown || !st.impHidden) report(tag, `처음 단위 ${st.unit}`);
        if (st.asia !== altOn) report(tag, `아시아 기준 기본값 ${st.asia} ≠ ${altOn}`);
        if (!st.more) report(tag, '나이·성별 칸이 처음부터 열림');
        let v = await tab.eval(OUT);
        if (v.scale !== (altOn ? ALT : 'who') || v.segs !== CORE.SCALES[v.scale].length + 1 || v.ticks !== CORE.SCALES[v.scale].length) report(tag, `색 막대 ${JSON.stringify(v)}`);
        if (v.lead !== U.waiting || v.marker || v.cat) report(tag, `빈 결과 ${JSON.stringify(v)}`);
        const checkLayout = async (where) => {
          const o = await tab.eval(OVERFLOW(width)); if (o) report(tag, `${where} 가로 넘침 ${o}px`);
          (await tab.eval(LABEL_OVER + `('${TAP_SEL}')`)).forEach((w) => report(tag, `${where} 버튼 문구 넘침 "${w}"`));
          (await tab.eval(BROKEN_WORDS + `('.bm-h1, .bm-hook, .bm-label, .bm-lead, .bm-cat, .bm-seg-btn, .bm-more, .bm-switch, .bm-scale-note, .bm-range, .bm-err, .bm-note, .bm-disc, .bm-btn, .bm-local, .bm-hint, .bm-error, .bm-summary, .mg-end-retry')`)).forEach((w) => report(tag, `${where} 단어 잘림 "${w}"`));
          const sfx = await tab.eval(`[...document.querySelectorAll('.bm-inwrap')].filter((w) => w.offsetParent).filter((w) => { const s = w.querySelector('.bm-suffix').getBoundingClientRect(), b = w.getBoundingClientRect(); return s.left < b.left || s.right > b.right; }).length`);
          if (sfx) report(tag, `${where} 단위 글자가 입력 칸 밖으로 나감 ${sfx}개`);
        };
        await checkLayout('첫 화면');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-start.png`));

        // 0) 아무것도 안 하고 요약 → needOne, track 0/0
        await tab.tap('#finish-btn');
        let c = await tab.eval(COUNTS);
        const fe = await tab.eval(`(() => { const e = document.getElementById('finish-err'); return e.hidden ? '' : e.textContent; })()`);
        if (fe !== U.needOne || !(await tab.eval(`document.getElementById('result').hidden`))) report(tag, `빈 요약 "${fe}"`);
        if (c.s !== 0 || c.d !== 0) report(tag, `빈 요약 뒤 track ${c.s}/${c.d} (0/0)`);

        // 1) 키만 → 대기 + track start 1번 (처음으로 숫자가 제대로 들어온 순간)
        await tab.eval(setIn({ cm: '170' }));
        v = await tab.eval(OUT);
        c = await tab.eval(COUNTS);
        if (v.lead !== U.waiting || v.cat) report(tag, `키만 입력 ${JSON.stringify(v)}`);
        if (c.s !== 1 || c.d !== 0) report(tag, `첫 입력 뒤 track ${c.s}/${c.d} (1/0)`);
        // 2) WHO 로 맞춘 뒤 170cm 65kg → 22.5 정상, 정상 범위 53.5 ~ 72.0
        if (altOn) await tab.tap('.bm-switch-t');
        v = await tab.eval(OUT);
        if (v.scale !== 'who' || v.segs !== 6) report(tag, `아시아 기준 끄기 → ${v.scale} / 막대 ${v.segs}칸`);
        await tab.eval(setIn({ kg: '65' }));
        v = await tab.eval(OUT);
        const range = (a, b, f) => N.range.replace('{min}', f(a)).replace('{max}', f(b));
        if (v.big !== n1(22.5) || v.cat !== T.scales.who.labels[1] || v.range !== range(53.5, 72, wkg) || v.diff !== U.inRange || !v.marker || v.lead !== U.yourBmi) report(tag, `170·65 ${JSON.stringify(v)}`);
        // 3) 쉼표 소수점 172cm 74,5kg → 25.2 과체중(WHO), 줄일 몸무게
        await tab.eval(setIn({ cm: '172', kg: '74,5' }));
        v = await tab.eval(OUT);
        const lose = CORE.diffIn(74.5 - 24.9 * 1.72 * 1.72, 'metric');
        if (v.big !== n1(25.2) || v.cat !== T.scales.who.labels[2] || v.diff !== U.toLose.replace('{w}', wkg(lose))) report(tag, `쉼표 74,5 ${JSON.stringify(v)} (줄일 ${lose})`);
        await tab.eval(setIn({ kg: '74.5' }));
        v = await tab.eval(OUT);
        if (v.big !== n1(25.2)) report(tag, `점 74.5 = "${v.big}"`);
        // 4) 아시아 기준 켜기(진짜 클릭) → 그 언어 기준 단계
        await tab.tap('.bm-switch-t');
        v = await tab.eval(OUT);
        const altCat = CORE.category(25.2, ALT);
        if (v.scale !== ALT || v.cat !== labelsOf(ALT)[altCat] || v.segs !== CORE.SCALES[ALT].length + 1) report(tag, `아시아 기준 ${JSON.stringify(v)} (기대 ${labelsOf(ALT)[altCat]})`);
        await checkLayout('결과');
        // 5) 오류: 글자 → badNum, 17cm → heightRange, 5kg → weightRange
        await tab.eval(setIn({ cm: 'abc' }));
        v = await tab.eval(OUT);
        const inv = await tab.eval(`document.getElementById('in-cm').getAttribute('aria-invalid')`);
        if (v.err !== E.badNum || v.cat || inv !== 'true') report(tag, `badNum ${JSON.stringify(v)} ${inv}`);
        await tab.eval(setIn({ cm: '17' }));
        v = await tab.eval(OUT);
        if (v.err !== E.heightRange) report(tag, `17cm "${v.err}"`);
        await tab.eval(setIn({ cm: '172', kg: '5' }));
        v = await tab.eval(OUT);
        if (v.err !== E.weightRange) report(tag, `5kg "${v.err}"`);
        await tab.eval(setIn({ kg: '74' + dec + '5' }));
        // 6) 단위 바꾸기(진짜 클릭) → 값이 ft·in·lb 로 옮겨지고 BMI 같음, 단위 기억
        await tab.tap('[data-unit="imperial"]');
        const imp = await tab.eval(`({ ft: document.getElementById('in-ft').value, inch: document.getElementById('in-inch').value, lb: document.getElementById('in-lb').value, store: localStorage.getItem('mg_bmi_unit') })`);
        v = await tab.eval(OUT);
        const fi = CORE.cmToFtIn(172);
        const fmtIn = (x) => new Intl.NumberFormat(lang, { maximumFractionDigits: 1, useGrouping: false }).format(x);
        if (imp.ft !== String(fi.ft) || imp.inch !== fmtIn(fi.inch) || imp.lb !== fmtIn(CORE.round1(CORE.kgToLb(74.5))) || imp.store !== 'imperial') report(tag, `단위 바꾸기 ${JSON.stringify(imp)}`);
        if (v.unit !== 'imperial' || Math.abs(Number(v.big.replace(',', '.')) - 25.2) > 0.051) report(tag, `ft·lb BMI ${v.big}`);
        // 5 ft 7 in 145 lb → 22.7 (정상 범위 lb)
        await tab.eval(setIn({ ft: '5', inch: '7', lb: '145' }));
        v = await tab.eval(OUT);
        const r = CORE.run({ unit: 'imperial', ft: '5', inch: '7', lb: '145', scale: v.scale });
        if (v.big !== n1(22.7) || v.range !== range(CORE.weightIn(r.minKg, 'imperial'), CORE.weightIn(r.maxKg, 'imperial'), wlb) || v.cat !== labelsOf(v.scale)[r.cat]) report(tag, `5'7" 145lb ${JSON.stringify(v)}`);
        await tab.eval(setIn({ inch: '12' }));
        v = await tab.eval(OUT);
        if (v.err !== E.inchRange) report(tag, `12 in "${v.err}"`);
        await tab.eval(setIn({ inch: '7' }));
        await checkLayout('ft·lb');
        // 7) 나이·성별 (선택)
        await tab.tap('#more-btn');
        const mo = await tab.eval(`({ open: !document.getElementById('more-box').hidden, exp: document.getElementById('more-btn').getAttribute('aria-expanded'), label: document.getElementById('more-btn').textContent })`);
        if (!mo.open || mo.exp !== 'true' || mo.label !== U.less) report(tag, `나이·성별 열기 ${JSON.stringify(mo)}`);
        await tab.eval(setIn({ age: '15' }));
        v = await tab.eval(OUT);
        if (!v.minor || v.senior) report(tag, `15세 안내 ${JSON.stringify(v)}`);
        await tab.eval(setIn({ age: '70' }));
        v = await tab.eval(OUT);
        if (v.minor || !v.senior) report(tag, `70세 안내 ${JSON.stringify(v)}`);
        await tab.eval(setIn({ age: '1' }));
        v = await tab.eval(OUT);
        if (v.err !== E.ageRange) report(tag, `1세 "${v.err}"`);
        await tab.eval(setIn({ age: '' }));
        await tab.tap('[data-sex="f"]');
        v = await tab.eval(OUT);
        if (!v.sex || v.minor || v.senior || !v.cat) report(tag, `성별 안내 ${JSON.stringify(v)}`);
        await checkLayout('나이·성별');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-result.png`));
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 0) report(tag, `요약 전 track ${c.s}/${c.d} (1/0)`);

        // 8) 요약 → 끝 화면
        await tab.tap('#finish-btn');
        await sleep(400);
        const sum = await tab.eval(`({ shown: !document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, big: document.getElementById('sum-big').textContent,
          cat: document.getElementById('sum-cat').textContent, scale: document.getElementById('sum-scale').textContent, range: document.getElementById('sum-range').textContent })`);
        const scaleTxt = v.scale === 'who' ? T.scales.who : T.scales.alt;
        if (!sum.shown || !sum.ad || !sum.big.includes(n1(22.7)) || sum.cat !== v.cat || sum.scale !== scaleTxt.name || sum.range !== v.range) report(tag, `요약 ${JSON.stringify(sum)}`);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 1) report(tag, `요약 뒤 track ${c.s}/${c.d} (1/1)`);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        const fq = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
        if (fq.faq !== T.faq.length || fq.share !== 6) report(tag, `FAQ ${fq.faq}개 / 공유 버튼 ${fq.share}개`);
        if (fq.retry !== U.again) report(tag, `다시 하기 문구 "${fq.retry}" ≠ "${U.again}"`);
        const shareData = JSON.parse(await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`));
        if (/[#?]/.test(shareData.url) || shareData.text !== U.shareText || shareData.title !== U.shareTitle || /\d{2}[.,]\d/.test(shareData.text + shareData.url)) report(tag, `공유 데이터 ${JSON.stringify(shareData)}`);
        // 요약이 열린 채로 값을 바꾸면 요약도 따라간다
        await tab.eval(setIn({ lb: '200' }));
        const sum2 = await tab.eval(`document.getElementById('sum-big').textContent`);
        if (!sum2.includes(n1(CORE.round1(CORE.bmi(CORE.ftInToCm(5, 7), CORE.lbToKg(200)))))) report(tag, `요약 갱신 "${sum2}"`);
        await checkLayout('요약');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-summary.png`));
        await tab.eval(`document.getElementById('finish-btn').click(), 1`);
        await sleep(200);
        c = await tab.eval(COUNTS);
        if (c.d !== 1) report(tag, `요약 두 번 → done ${c.d} (같은 판은 1번)`);

        // 9) 다시 하기 → 새 판 (단위는 그대로)
        await sleep(400);
        await tab.eval(`document.querySelector('[data-mg-end] .mg-end-retry').click(), 1`);
        await sleep(400);
        const rs = await tab.eval(`({ result: document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden,
          filled: [...document.querySelectorAll('.bm-input')].filter((i) => i.value).length, res: window.BMI_APP.result(), unit: window.BMI_APP.unit(),
          sex: document.querySelector('[data-sex=""]').getAttribute('aria-pressed') })`);
        if (!rs.result || rs.ad || rs.filled || rs.res || rs.unit !== 'imperial' || rs.sex !== 'true') report(tag, `다시 하기 ${JSON.stringify(rs)}`);
        await tab.eval(setIn({ ft: '6', inch: '0', lb: '180' }));
        await tab.tap('#finish-btn');
        await sleep(300);
        c = await tab.eval(COUNTS);
        if (c.s !== 2 || c.d !== 2) report(tag, `두 번째 판 track ${c.s}/${c.d} (2/2)`);

        // 10) 새로 열면 단위(imperial) 기억, 키·몸무게는 어디에도 안 남음
        const leak = await tab.eval(`JSON.stringify(localStorage) + JSON.stringify(sessionStorage) + location.href + document.cookie`);
        if (/74[.,]5|"145"|"180"|"172"|"200"/.test(leak)) report(tag, '입력 숫자가 저장소·주소·쿠키에 남음');
        await tab.reload();
        const again = await tab.eval(`window.BMI_APP.unit() + ':' + document.querySelector('[data-unit="imperial"]').getAttribute('aria-pressed') + ':' + document.querySelector('[data-unit-box="metric"]').hidden`);
        if (again !== 'imperial:true:true') report(tag, `새로 열었을 때 단위 ${again} (imperial 기억)`);

        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 첫 화면 · 빈 요약 · 키만 · 170/65 · 쉼표 · 아시아 기준(${ALT}) · 오류 · 단위 변환 · ft/lb · 나이·성별 · 요약 · 끝 화면 ${kids.join('→')} · 다시 하기 · 단위 기억`);
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
