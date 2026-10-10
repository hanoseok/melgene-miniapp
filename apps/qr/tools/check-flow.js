#!/usr/bin/env node
/**
 * QR코드 생성기 실제 흐름 검사 (Chrome headless, 의존성 없음).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, FAQ·끝 화면 안 보임, 빈 미리보기, 저장 버튼 꺼짐, 가로 넘침·단어 잘림 없음, 종류 버튼 한 줄
 *   - 링크 입력 → https:// 자동, 미리보기 canvas 의 칸이 QR_CORE 행렬과 같음, track('start') 1번
 *   - 와이파이 → WIFI:T:WPA;S:…;P:…;; (특수문자 escape), 낮은 대비 경고, 너무 긴 내용 → 안내 + 버튼 꺼짐
 *   - PNG 저장 → 1024×1024 PNG 의 칸을 하나하나 읽어 행렬과 비교, track('done') 1번, 결과·끝 화면 나타남(순서 별점·하트 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱),
 *     mg-ad-start 숨김, 같은 코드 SVG 저장은 done 을 더 세지 않음, 코드를 바꾸면 새 판(start·done 다시)
 *   - 공유 링크에 사용자 내용 없음, 다시 하기 → 입력 비우고 결과 숨김
 *   - 콘솔 오류 0
 *   JSQR=<jsQR.js 경로> 를 주면 저장된 PNG 를 jsQR 로도 읽어 본다(선택, 저장소에는 jsQR 이 없음).
 *
 * 실행: node tools/check-flow.js                  (en,ko × 360,1440)
 *       node tools/check-flow.js en,ja,ru 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'qr-core.js'));
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const HTTP_PORT = 8881, MOCK_PORT = 8882, CDP_PORT = 9381;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const JSQR = process.env.JSQR ? require(path.resolve(process.env.JSQR)) : null;
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
    const r = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text);
    return r.result.value;
  }
  loaded() { return new Promise((r) => { this.onload = r; }); }
  async settle() { await this.eval('document.fonts.ready.then(() => 1)'); await sleep(250); }
  async goto(url) { const l = this.loaded(); await this.send('Page.navigate', { url }); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async tap(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
  }
  async type(sel, text) {
    await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.focus(); e.value = ''; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
    await this.send('Input.insertText', { text });
  }
  async setValue(sel, value) {
    await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(value)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
  }
}
async function openTab(width) {
  const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const tab = new Tab(ws);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 740, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await tab.send('Browser.setDownloadBehavior', { behavior: 'deny' }).catch(() => {});
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
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
const SPY = `(() => { const o = window.track; window.track = function (e) { if (e === 'start' || e === 'done') sessionStorage.setItem('t_' + e, String(Number(sessionStorage.getItem('t_' + e) || 0) + 1)); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNTS = `({ s: Number(sessionStorage.getItem('t_start') || 0), d: Number(sessionStorage.getItem('t_done') || 0) })`;
// 미리보기 canvas 의 각 칸 가운데 색을 읽어 행렬과 비교 (다른 칸 수)
const CANVAS_DIFF = `(() => {
  const c = document.getElementById('qr-canvas'); const x = c.getContext('2d'); const st = window.QR_APP.state(); const m = window.QR_APP.matrix();
  const n = st.modules + st.margin * 2; const px = c.width; const d = x.getImageData(0, 0, px, px).data; let diff = 0;
  for (let yy = 0; yy < st.modules; yy++) for (let xx = 0; xx < st.modules; xx++) {
    const cx = Math.floor((xx + st.margin + 0.5) * px / n), cy = Math.floor((yy + st.margin + 0.5) * px / n); const i = (cy * px + cx) * 4;
    const dark = d[i] + d[i + 1] + d[i + 2] < 382; if (dark !== !!m[yy][xx]) diff++;
  }
  return diff;
})()`;
// 저장 버튼과 똑같이 PNG 를 만들어(QR_APP 의 상태로) 칸 비교 + RGBA(jsQR 용)
const PNG_CHECK = `(async () => {
  const st = window.QR_APP.state(); const m = window.QR_APP.matrix();
  const cv = document.createElement('canvas'); const ctx = cv.getContext('2d'); const n = st.modules + st.margin * 2; const px = st.size;
  const e = window.QR_CORE.cellEdges(n, px); cv.width = px; cv.height = px; ctx.fillStyle = st.bg; ctx.fillRect(0, 0, px, px); ctx.fillStyle = st.fg;
  for (let y = 0; y < st.modules; y++) for (let x = 0; x < st.modules; x++) if (m[y][x]) ctx.fillRect(e[x + st.margin], e[y + st.margin], e[x + 1 + st.margin] - e[x + st.margin], e[y + 1 + st.margin] - e[y + st.margin]);
  const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
  const bmp = await createImageBitmap(blob); const c2 = document.createElement('canvas'); c2.width = bmp.width; c2.height = bmp.height; const x2 = c2.getContext('2d'); x2.drawImage(bmp, 0, 0);
  const d = x2.getImageData(0, 0, bmp.width, bmp.height).data; let diff = 0;
  for (let yy = 0; yy < st.modules; yy++) for (let xx = 0; xx < st.modules; xx++) {
    const cx = Math.floor((xx + st.margin + 0.5) * px / n), cy = Math.floor((yy + st.margin + 0.5) * px / n); const i = (cy * px + cx) * 4;
    if ((d[i] + d[i + 1] + d[i + 2] < 382) !== !!m[yy][xx]) diff++;
  }
  // jsQR 용: 4배 줄인 RGBA
  const s = 4, w = Math.floor(px / s); const c3 = document.createElement('canvas'); c3.width = w; c3.height = w; const x3 = c3.getContext('2d'); x3.imageSmoothingEnabled = false; x3.drawImage(bmp, 0, 0, w, w);
  const small = x3.getImageData(0, 0, w, w).data; let bin = ''; for (let i = 0; i < small.length; i++) bin += String.fromCharCode(small[i]);
  return { w: bmp.width, h: bmp.height, size: blob.size, diff, rgba: btoa(bin), sw: w };
})()`;
const END_KIDS = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'qr-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0, jsqrOk = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== QR코드 생성기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
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
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-qr'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0],
            endHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-faq, .mg-end-faq') && !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            empty: !document.getElementById('qr-empty').hidden, disabled: document.getElementById('dl-png').disabled && document.getElementById('dl-svg').disabled,
            typeRows: new Set([...document.querySelectorAll('.qr-type')].map((b) => Math.round(b.getBoundingClientRect().top))).size,
            tallBtns: [...document.querySelectorAll('.qr-actions .qr-btn')].filter((b) => b.offsetParent && b.getBoundingClientRect().height > 58).map((b) => b.textContent) }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.endHidden || st.faqVisible) report(tag, '첫 화면에 결과·끝 화면(FAQ)이 보임');
        if (!st.empty || !st.disabled) report(tag, '처음에 빈 미리보기·꺼진 저장 버튼이 아님');
        if (st.typeRows !== 1) report(tag, `종류 버튼이 ${st.typeRows}줄`);
        if (st.tallBtns.length) report(tag, `저장 버튼 문구가 두 줄: ${st.tallBtns.join(', ')}`);
        const o1 = await tab.eval(OVERFLOW); if (o1) report(tag, `첫 화면 가로 넘침 ${o1}px`);
        (await tab.eval(BROKEN_WORDS + `('.qr-h1, .qr-hook, .qr-type-name, .qr-label, .qr-btn, .qr-sum, .qr-local, .qr-empty')`)).forEach((w) => report(tag, `첫 화면 단어 잘림 "${w}"`));
        await tab.eval(SPY);
        // 링크
        await tab.type('#f-link', 'example.com/menu?table=7');
        await sleep(450);
        let s1 = await tab.eval('window.QR_APP.state()');
        if (s1.payload !== 'https://example.com/menu?table=7') report(tag, `링크 내용 ${s1.payload}`);
        const want = CORE.encode(s1.payload, { ecc: 'M' });
        if (s1.version !== want.version || JSON.stringify(await tab.eval('window.QR_APP.matrix()')) !== JSON.stringify(want.modules.map((r) => r.map((v) => (v ? 1 : 0))))) report(tag, '미리보기 행렬이 QR_CORE.encode 와 다름');
        const cd = await tab.eval(CANVAS_DIFF); if (cd) report(tag, `미리보기 canvas 칸 ${cd}개가 행렬과 다름`);
        let c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 0) report(tag, `코드를 만들었는데 track start ${c.s} / done ${c.d}`);
        const ui1 = await tab.eval(`({ info: document.getElementById('qr-info').textContent, payload: document.getElementById('qr-payload').textContent, png: document.getElementById('dl-png').disabled })`);
        if (!ui1.info.includes(String(want.version)) || !ui1.payload.includes('https://example.com/menu') || ui1.png) report(tag, `정보·내용 줄·버튼이 이상함 ${JSON.stringify(ui1)}`);
        // 와이파이 (특수문자)
        await tab.tap('.qr-type[data-type="wifi"]');
        await tab.type('#f-ssid', 'Cafe;Guest');
        await tab.type('#f-pass', 'p:a,s"s\\1');
        await sleep(450);
        s1 = await tab.eval('window.QR_APP.state()');
        if (s1.payload !== 'WIFI:T:WPA;S:Cafe\\;Guest;P:p\\:a\\,s\\"s\\\\1;;') report(tag, `와이파이 내용 ${s1.payload}`);
        c = await tab.eval(COUNTS); if (c.s !== 1) report(tag, `저장 전 내용 변경인데 start 가 ${c.s}번`);
        // 낮은 대비 경고
        await tab.eval(`(() => { const f = document.getElementById('c-fg'); f.value = '#bbbbbb'; f.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
        await sleep(100);
        const w1 = await tab.eval(`!document.getElementById('qr-warn').hidden && document.getElementById('qr-warn').textContent`);
        if (!w1) report(tag, '낮은 대비 경고가 안 보임');
        await tab.eval(`document.getElementById('options').open = true; 1`);
        await tab.tap('#c-reset');
        await sleep(100);
        if (await tab.eval(`!document.getElementById('qr-warn').hidden`)) report(tag, '색 되돌린 뒤에도 경고');
        const o2 = await tab.eval(OVERFLOW); if (o2) report(tag, `옵션 펼친 화면 가로 넘침 ${o2}px`);
        (await tab.eval(BROKEN_WORDS + `('.qr-label, .qr-hint, .qr-color, .qr-mini, .qr-seg-btn, .qr-check')`)).forEach((w) => report(tag, `옵션 단어 잘림 "${w}"`));
        // 너무 긴 내용
        await tab.tap('.qr-type[data-type="text"]');
        await tab.setValue('#f-text', '가'.repeat(2900));
        await sleep(450);
        const tl = await tab.eval(`({ err: !document.getElementById('qr-error').hidden && document.getElementById('qr-error').textContent, png: document.getElementById('dl-png').disabled, empty: !document.getElementById('qr-empty').hidden })`);
        if (!tl.err || !tl.png || !tl.empty) report(tag, `너무 긴 내용 처리 ${JSON.stringify(tl)}`);
        await tab.setValue('#f-text', 'Hello QR 안녕 🙂');
        await sleep(450);
        // PNG 저장
        await tab.tap('#dl-png');
        let img = null;
        for (let k = 0; k < 40 && !img; k++) { await sleep(150); img = await tab.eval('window.QR_APP.lastImage'); }
        if (!img || img.type !== 'image/png' || img.w !== 1024 || img.size < 2000) report(tag, `PNG 저장 실패 ${JSON.stringify(img)}`);
        await sleep(900); // 끝 화면·모의 서버
        const pc = await tab.eval(PNG_CHECK);
        if (pc.w !== 1024 || pc.h !== 1024 || pc.diff) report(tag, `PNG ${pc.w}×${pc.h}, 칸 ${pc.diff}개가 행렬과 다름`);
        if (JSQR) {
          const rgba = new Uint8ClampedArray(Buffer.from(pc.rgba, 'base64'));
          const r = JSQR(rgba, pc.sw, pc.sw);
          const cur = await tab.eval('window.QR_APP.state().payload');
          if (!r || r.data !== cur) report(tag, `jsQR 로 PNG 읽기 실패: ${r ? r.data : null}`); else jsqrOk++;
        }
        c = await tab.eval(COUNTS);
        if (c.d !== 1) report(tag, `PNG 저장 뒤 track done ${c.d}번 (1번)`);
        const r1 = await tab.eval(`({ result: !document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
          hrefs: [...document.querySelectorAll('.mg-end-share a')].map((a) => a.href).join(' '), status: document.getElementById('status').textContent })`);
        if (!r1.result || !r1.ad) report(tag, '저장 뒤 결과가 안 보이거나 mg-ad-start 가 그대로');
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        if (r1.faq < 3 || r1.share !== 6) report(tag, `FAQ ${r1.faq}개 / 공유 버튼 ${r1.share}개`);
        if (/Hello|example\.com|WIFI|%EC%95%88/i.test(decodeURIComponent(r1.hrefs))) report(tag, '공유 링크에 사용자 내용이 들어감');
        if (!r1.status) report(tag, '저장 상태 문구 없음');
        // 같은 코드 SVG → done 그대로
        await tab.tap('#dl-svg');
        await sleep(300);
        const svg = await tab.eval('window.QR_APP.lastSvg');
        if (!svg || svg.type !== 'image/svg+xml' || svg.size < 500) report(tag, `SVG 저장 실패 ${JSON.stringify(svg)}`);
        c = await tab.eval(COUNTS); if (c.d !== 1 || c.s !== 1) report(tag, `같은 코드 SVG 저장 뒤 start ${c.s} / done ${c.d} (1/1)`);
        // 코드 바꾸면 새 판
        await tab.setValue('#f-text', 'Second code');
        await sleep(450);
        c = await tab.eval(COUNTS); if (c.s !== 2) report(tag, `저장 뒤 새 코드인데 start ${c.s}번 (2)`);
        await tab.tap('#dl-svg');
        await sleep(300);
        c = await tab.eval(COUNTS); if (c.d !== 2) report(tag, `새 코드 저장 뒤 done ${c.d}번 (2)`);
        const o3 = await tab.eval(OVERFLOW); if (o3) report(tag, `결과 화면 가로 넘침 ${o3}px`);
        (await tab.eval(BROKEN_WORDS + `('.qr-h2, .qr-done-text, .qr-status, .mg-end-retry, .mg-end-h, .mg-faq summary')`)).forEach((w) => report(tag, `결과 화면 단어 잘림 "${w}"`));
        // 다시 하기
        await tab.tap('[data-mg-end] .mg-end-retry');
        await sleep(300);
        const back = await tab.eval(`({ hidden: document.getElementById('result').hidden, ad: !document.querySelector('.mg-ad-start').hidden, text: document.getElementById('f-text').value, empty: !document.getElementById('qr-empty').hidden })`);
        if (!back.hidden || !back.ad || back.text || !back.empty) report(tag, `다시 하기 상태 ${JSON.stringify(back)}`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} v${want.version} 링크 · 와이파이 escape · 대비 경고 · 길이 초과 · PNG ${img ? img.size : 0}B(1024², 칸 일치) · SVG · 끝 화면 ${kids.join('→')}`);
      }
    }
  } finally {
    chrome.kill(); mock.kill(); server.close();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(`\n흐름 ${runs}회, 문제 ${problems}건${JSQR ? `, jsQR PNG 읽기 ${jsqrOk}/${runs}` : ''}`);
  if (problems) { console.log('결과: FAIL'); process.exit(1); }
  console.log('결과: PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
