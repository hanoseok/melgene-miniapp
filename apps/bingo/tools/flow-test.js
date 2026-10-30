#!/usr/bin/env node
/**
 * 새해 목표 빙고 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음 — 하네스는 apps/split/tools/check-flow.js 와 같다).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 시작 화면: 맨 끝 mg-ad-start 1개, 편집·완성·FAQ 안 보임, track 0, 가로 넘침·버튼 문구 넘침·단어 잘림 없음
 *   - 3×3 시작 → 편집(track start 1) · 빈 판 완성 → needAll · HTML 같은 글도 글자 그대로(escape) · 다음 칸
 *   - 아이디어 채우기 → 다 참 · 섞기(자유칸 고정) · 크기 5×5(글 유지) · 색 · 제목
 *   - 완성 → 캔버스 그림 · track done 1 · 캔버스 칸을 눌러 도장 → 대각선 1줄(자유칸 포함)·가로 1줄 더 = 2줄(언어 복수형) · 취소
 *   - 끝 화면 순서·FAQ 개수·공유 6개·다시 하기 문구 · 공유 데이터에 목표 글·#·? 없음 · 이미지 저장·링크 복사 · 저장(mg_bingo_v1)
 *   - 판 링크(#d=) 새 탭 → 받은 판 보기 전용(도장 안 찍힘·track 0) · 잘못된 링크 → 오류 안내
 *   - 다시 열기 → 이어 하기(같은 도장, track 0) · 다시 하기 → 빈 새 판 → 완성 track 1/1 · 서버(mock)로 글 안 감 · 콘솔 오류 0
 *   - SHOT=<폴더> 면 시작·편집·완성 스크린샷
 *
 * 실행: node tools/flow-test.js                  (en,ru × 360,1440)
 *       node tools/flow-test.js ja,th,de 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ru').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOT = process.env.SHOT || '';
const HTTP_PORT = 9071, MOCK_PORT = 9072, CDP_PORT = 9571;
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
const OUT = `(() => { const t = (id) => (document.getElementById(id) || {}).textContent || ''; const vis = (id) => { const e = document.getElementById(id); return !!e && !e.hidden && !!e.offsetParent; };
  return { start: vis('screen-start'), edit: vis('screen-edit'), done: vis('screen-done'), phase: window.BINGO_APP.phase(), board: window.BINGO_APP.board(), score: window.BINGO_APP.score(),
    lines: t('score-lines'), goals: t('score-goals'), filled: t('filled'), err: vis('edit-err') ? t('edit-err') : '', shared: vis('shared-note'), cont: vis('continue-btn'), linkErr: vis('link-err'),
    cells: document.querySelectorAll('#grid .bg-gcell').length, free: document.querySelectorAll('#grid .bg-gcell.free').length }; })()`;
const setVal = (sel, v) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const TAP_SEL = '.bg-seg-btn, .bg-btn, .bg-tool, .bg-mini-btn, .bg-kicker, .bg-switch-t, .bg-theme-n, .mg-end-retry';
const WORD_SEL = '.bg-h1, .bg-hook, .bg-label, .bg-h2, .bg-seg-btn, .bg-tool, .bg-mini-btn, .bg-switch, .bg-btn, .bg-local, .bg-error, .bg-filled, .bg-tap, .bg-score, .bg-shared, .mg-end-retry';
// 캔버스가 비어 있지 않은지 (가운데 칸 쪽 픽셀 몇 개가 서로 다름)
const CANVAS_INK = `(() => { const c = document.getElementById('board-canvas'); const x = c.getContext('2d'); const d = x.getImageData(0, 0, 1080, 1350).data; const seen = new Set(); for (let i = 0; i < d.length; i += 4 * 997) seen.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]); return seen.size; })()`;

async function tapCanvas(tab, i) {
  const p = await tab.eval(`(() => { document.getElementById('board-canvas').scrollIntoView({ block: 'center' }); return window.BINGO_APP.cellCenter(${i}); })()`);
  for (const type of ['mousePressed', 'mouseReleased']) await tab.send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await sleep(80);
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  if (SHOT) fs.mkdirSync(SHOT, { recursive: true });
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bingo-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  const SECRET = 'Zq9 <b>bold</b> & "x"';
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 새해 목표 빙고 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const U = T.ui;
      const plural = (n) => { const k = new Intl.PluralRules(lang).select(n); return (U.lines[k] || U.lines.other).replace('{n}', n); };
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
        const checkLayout = async (where) => {
          const o = await tab.eval(OVERFLOW(width)); if (o) report(tag, `${where} 가로 넘침 ${o}px`);
          (await tab.eval(LABEL_OVER + `('${TAP_SEL}')`)).forEach((w) => report(tag, `${where} 버튼 문구 넘침 "${w}"`));
          (await tab.eval(BROKEN_WORDS + `('${WORD_SEL}')`)).forEach((w) => report(tag, `${where} 단어 잘림 "${w}"`));
        };

        // 0) 시작 화면
        const st0 = await tab.eval(`(() => { const s = document.getElementById('screen-start'); const a = [...document.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0],
            faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent }; })()`);
        let v = await tab.eval(OUT);
        if (st0.lang !== lang) report(tag, `페이지 언어 ${st0.lang}`);
        if (!st0.adOk) report(tag, '시작 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!v.start || v.edit || v.done || st0.faqVisible || v.cont) report(tag, `처음 화면 ${JSON.stringify({ start: v.start, edit: v.edit, done: v.done, faq: st0.faqVisible, cont: v.cont })}`);
        await checkLayout('시작 화면');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-start.png`));
        let c = await tab.eval(COUNTS);
        if (c.s || c.d) report(tag, `시작 화면만 열었는데 track ${c.s}/${c.d}`);

        // 1) 3×3 고르고 시작 → 편집 화면, track start 1
        await tab.tap('#size-start [data-size="3"]');
        await tab.tap('#start-btn');
        v = await tab.eval(OUT);
        c = await tab.eval(COUNTS);
        if (!v.edit || v.start || v.cells !== 9 || v.free !== 1 || v.board.s !== 3 || !v.board.t) report(tag, `편집 시작 ${JSON.stringify({ edit: v.edit, cells: v.cells, free: v.free, b: v.board })}`);
        if (c.s !== 1 || c.d !== 0) report(tag, `편집 시작 track ${c.s}/${c.d} (1/0)`);
        if (await tab.eval(`!!document.querySelector('.mg-ad-start').offsetParent`)) report(tag, '편집 화면에 시작 광고가 보임');

        // 2) 빈 판으로 완성 → needAll
        await tab.tap('#done-btn');
        v = await tab.eval(OUT);
        if (v.err !== U.needAll || !v.edit) report(tag, `빈 판 완성 "${v.err}"`);

        // 3) 칸 글 (HTML 처럼 보이는 글도 글자 그대로)
        await tab.tap('#grid .bg-gcell[data-i="0"]');
        await tab.eval(setVal('#cell-input', SECRET));
        const esc = await tab.eval(`(() => { const b = document.querySelector('#grid [data-i="0"]'); return { text: b.textContent, el: b.querySelectorAll('b').length }; })()`);
        if (esc.text !== SECRET || esc.el) report(tag, `사용자 글이 HTML 로 들어감 ${JSON.stringify(esc)}`);
        await tab.tap('#next-btn');
        if ((await tab.eval(`document.getElementById('cell-input').value`)) !== '' || (await tab.eval(`window.BINGO_APP.board().c[0]`)) !== SECRET) report(tag, '다음 칸 이동/저장');

        // 4) 아이디어 채우기 → 다 참, 섞기, 크기 5 → 글 유지, 색
        await tab.tap('#ideas-btn');
        v = await tab.eval(OUT);
        const f3 = v.board.c.filter(Boolean).length;
        if (f3 !== 8 || v.filled !== U.filled.replace('{n}', 8).replace('{total}', 8) || !v.board.c.includes(SECRET)) report(tag, `아이디어 채우기 ${JSON.stringify(v.board.c)} "${v.filled}"`);
        await tab.tap('#shuffle-btn');
        v = await tab.eval(OUT);
        if (v.board.c.filter(Boolean).length !== 8 || v.board.c[4] !== '') report(tag, `섞기 ${JSON.stringify(v.board.c)}`);
        await tab.tap('#size-edit [data-size="5"]');
        v = await tab.eval(OUT);
        if (v.board.s !== 5 || v.cells !== 25 || v.board.c.filter(Boolean).length !== 8 || !v.board.f) report(tag, `크기 5 ${JSON.stringify(v.board)}`);
        await tab.tap('#themes .bg-theme:nth-child(4)');
        await tab.eval(setVal('#title-input', 'Flow 2027'));
        await checkLayout('편집 화면');
        await tab.tap('#ideas-btn');
        v = await tab.eval(OUT);
        if (v.board.h !== 3 || v.board.t !== 'Flow 2027' || v.board.c.filter(Boolean).length !== 24) report(tag, `색·제목·채우기 ${JSON.stringify(v.board)}`);
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-edit.png`));

        // 5) 완성 → 카드 + 끝 화면, track done 1
        await tab.tap('#done-btn');
        await sleep(500);
        v = await tab.eval(OUT);
        c = await tab.eval(COUNTS);
        if (!v.done || v.edit || v.phase !== 'done') report(tag, '완성 화면이 안 보임');
        if (c.s !== 1 || c.d !== 1) report(tag, `완성 track ${c.s}/${c.d} (1/1)`);
        if ((await tab.eval(CANVAS_INK)) < 4) report(tag, '캔버스가 비어 있음');
        if (v.lines !== plural(0) || v.goals !== U.goalsDone.replace('{n}', 0).replace('{total}', 24)) report(tag, `처음 점수 "${v.lines}" "${v.goals}"`);
        // 대각선 도장 (자유칸 12 포함) → 1줄
        for (const i of [0, 6, 18, 24]) await tapCanvas(tab, i);
        v = await tab.eval(OUT);
        if (v.score.count !== 1 || v.score.marked !== 4 || v.lines !== plural(1)) report(tag, `대각선 도장 ${JSON.stringify(v.score)} "${v.lines}"`);
        await tapCanvas(tab, 12);
        if ((await tab.eval(`window.BINGO_APP.score().marked`)) !== 4) report(tag, '자유칸이 눌림');
        for (const i of [1, 2, 3, 4]) await tapCanvas(tab, i);
        v = await tab.eval(OUT);
        if (v.score.count !== 2 || v.lines !== plural(2)) report(tag, `두 줄 ${JSON.stringify(v.score)} "${v.lines}"`);
        await tapCanvas(tab, 4);
        if ((await tab.eval(`window.BINGO_APP.score().count`)) !== 1) report(tag, '도장 취소');
        await tapCanvas(tab, 4);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        const fq = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
        if (fq.faq !== T.faq.length || fq.share !== 6 || fq.retry !== U.again) report(tag, `끝 화면 FAQ ${fq.faq} 공유 ${fq.share} 다시 "${fq.retry}"`);
        const shareData = JSON.parse(await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`));
        if (/[#?]/.test(shareData.url) || shareData.text !== U.shareText || /Zq9|Flow 2027/.test(JSON.stringify(shareData))) report(tag, `공유 데이터 ${JSON.stringify(shareData)}`);
        await tab.tap('#download-btn');
        await tab.tap('#link-btn');
        await sleep(300);
        const clip = await tab.eval(`navigator.clipboard.readText().catch(() => '')`);
        if (clip && !/#d=[A-Za-z0-9_-]+$/.test(clip)) report(tag, `링크 복사 "${clip}"`);
        await checkLayout('완성 화면');
        if (SHOT) await tab.shot(path.join(SHOT, `${lang}-${width}-done.png`));
        const saved = JSON.parse((await tab.eval(`localStorage.getItem('mg_bingo_v1')`)) || 'null');
        const boardNow = await tab.eval(`window.BINGO_APP.board()`);
        if (!saved || saved.p !== 'done' || saved.b.m !== boardNow.m || saved.b.t !== 'Flow 2027') report(tag, `저장 ${JSON.stringify(saved)}`);

        // 6) 판 링크 → 새 탭: 받은 판 보기 전용, track 없음
        const d = await tab.eval(`window.BINGO_CORE.encodeShare(window.BINGO_APP.board())`);
        const tab2 = await openTab(width);
        await tab2.send('Network.setCookie', { name: 'mg_lang', value: lang, domain: 'localhost', path: '/' }).catch(() => {});
        await tab2.goto(base + '#d=' + d);
        await sleep(300);
        let v2 = await tab2.eval(OUT);
        if (!v2.done || !v2.shared || JSON.stringify(v2.board) !== JSON.stringify(boardNow) || await tab2.eval(`!!document.getElementById('edit-btn').offsetParent`)) report(tag, `받은 판 ${JSON.stringify({ done: v2.done, shared: v2.shared })}`);
        await tapCanvas(tab2, 7);
        v2 = await tab2.eval(OUT);
        if (v2.board.m !== boardNow.m) report(tag, '받은 판에 도장이 찍힘');
        const c2 = await tab2.eval(COUNTS);
        if (c2.s || c2.d) report(tag, `받은 판 보기만 했는데 track ${c2.s}/${c2.d}`);
        // 잘못된 링크
        await tab2.goto(base + '#d=bm90IGpzb24');
        await tab2.reload();
        v2 = await tab2.eval(OUT);
        if (!v2.start || !v2.linkErr) report(tag, `잘못된 링크 ${JSON.stringify({ start: v2.start, err: v2.linkErr })}`);
        tab2.errors.forEach((e) => report(tag, '새 탭 콘솔 오류: ' + e));
        await tab2.send('Page.close').catch(() => {});

        // 7) 다시 열기 → 이어 하기 → 같은 판(track 없음)
        await tab.goto(base);
        v = await tab.eval(OUT);
        if (!v.start || !v.cont) report(tag, '다시 열면 이어 하기 버튼');
        await tab.tap('#continue-btn');
        await sleep(300);
        v = await tab.eval(OUT);
        c = await tab.eval(COUNTS);
        if (!v.done || v.board.m !== boardNow.m || v.score.count !== 2) report(tag, `이어 하기 ${JSON.stringify(v.score)}`);
        if (c.s || c.d) report(tag, `이어 하기 track ${c.s}/${c.d} (0/0)`);

        // 8) 다시 하기 → 새 판 (편집 화면, 빈 칸) → 완성 → track 1/1
        await tab.eval(`document.querySelector('[data-mg-end] .mg-end-retry').click(), 1`);
        await sleep(300);
        v = await tab.eval(OUT);
        if (!v.edit || v.board.c.some(Boolean) || v.board.m || v.board.s !== 5 || v.board.h !== 3) report(tag, `다시 하기 ${JSON.stringify(v.board)}`);
        await tab.tap('#ideas-btn');
        await tab.tap('#done-btn');
        await sleep(300);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 1) report(tag, `새 판 track ${c.s}/${c.d} (1/1)`);

        // 9) 서버(mock) 로 목표 글이 가지 않음
        const log = await mockRpc('__log').catch(() => '');
        if (/Zq9|Flow 2027/.test(log)) report(tag, '목표 글이 서버(mock)로 전송됨');

        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 시작 · 편집(빈 판·글 escape·아이디어·섞기·크기·색) · 완성(캔버스·도장·빙고 줄) · 끝 화면 ${kids.join('→')} · 링크(보기 전용·잘못된 링크) · 이어 하기 · 다시 하기`);
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
