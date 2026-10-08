#!/usr/bin/env node
/**
 * 내 이름 한글로 실제 흐름 검사 (Chrome headless, 의존성 없음).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 시작 화면: 맨 끝 mg-ad-start 1개, FAQ·끝 화면 없음, 가로 넘침 없음, 단어 중간 잘림 없음
 *   - 빈 이름으로 시작 → 안내 문구(결과로 안 넘어감)
 *   - "Michael Smith" 입력 → 결과: 마이클 스미스, 음절 블록 6개(ma·i·keul·seu·mi·seu), 카드 canvas 에 그림이 있음
 *   - track('start')·track('done') 각 1번, 끝 화면 순서 별점·하트 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱
 *   - 스타일 칩 4개 바꾸기, 글자 복사(공유 링크 #d= 포함), 이미지 저장(PNG blob), 공유 주소 = 언어 없는 주소 + #d=
 *   - 결과 화면 가로 넘침·단어 잘림 없음, 다시 하기 → 이름 입력 화면
 *   - 공유 링크(#d=)로 새 탭 방문 → 같은 카드(친구 문구), start/done 안 셈
 *   - 콘솔 오류 0
 *
 * 실행: node tools/check-flow.js                  (en,ko,ru × 360,1440)
 *       node tools/check-flow.js en,ja 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'hangul-name-core.js'));
const LANGS = (process.argv[2] || 'en,ko,ru').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const HTTP_PORT = 8871, MOCK_PORT = 8872, CDP_PORT = 9371;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const NAME = 'Michael Smith';
const WANT = CORE.convert(NAME);

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
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon|googlesyndication|doubleclick|google-analytics|googletagmanager/.test(m.params.entry.url || '')) this.errors.push('log: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
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
    await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.focus(); e.value = ''; return 1; })()`);
    await this.send('Input.insertText', { text });
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
      const re = /[^\\s\\u00a0\\u202f\\-–—]+/g; let m;
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
// track 호출 횟수를 sessionStorage 에 센다
const SPY = `(() => { const o = window.track; window.track = function (e) { if (e === 'start' || e === 'done') sessionStorage.setItem('t_' + e, String(Number(sessionStorage.getItem('t_' + e) || 0) + 1)); return o && o.apply(this, arguments); }; return 1; })()`;
// 카드 canvas 에 바탕색과 다른 픽셀(글자)이 충분히 있는지
const CANVAS_INK = `(() => { const c = document.getElementById('card-canvas'); const x = c.getContext('2d'); const d = x.getImageData(140, 260, 800, 460).data; const r0 = d[0], g0 = d[1], b0 = d[2]; let n = 0; for (let i = 0; i < d.length; i += 16) { if (Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0) > 120) n++; } return n; })()`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'hn-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 내 이름 한글로 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        await mockRpc('__reset');
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        // 시작 화면
        const st = await tab.eval(`(() => ({ start: !document.getElementById('screen-start').hidden, result: !document.getElementById('screen-result').hidden, lang: document.documentElement.lang,
          adBad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0]); })(),
          faq: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end]'), input: !!document.getElementById('name-input').offsetParent }))()`);
        if (!st.start || st.result || !st.input) report(tag, '시작 화면(이름 입력)이 먼저 보이지 않음');
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (st.adBad || st.faq) report(tag, '시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/끝 화면이 있음');
        const o1 = await tab.eval(OVERFLOW); if (o1) report(tag, `시작 화면 가로 넘침 ${o1}px`);
        (await tab.eval(BROKEN_WORDS + `('.hn-h1, .hn-badge, .hn-btn, .hn-hook, .hn-label, .hn-facts')`)).forEach((w) => report(tag, `시작 화면 단어 잘림 "${w}"`));
        await tab.eval(SPY);
        // 빈 이름 → 안내
        await tab.tap('#start-btn');
        await sleep(150);
        const empty = await tab.eval(`({ err: !document.getElementById('name-error').hidden && document.getElementById('name-error').textContent.length > 0, result: !document.getElementById('screen-result').hidden, s: sessionStorage.getItem('t_start') })`);
        if (!empty.err || empty.result || empty.s) report(tag, '빈 이름인데 안내가 없거나 결과로 넘어감');
        // 이름 입력 → 결과
        await tab.type('#name-input', NAME);
        await tab.tap('#start-btn');
        await sleep(400);
        await tab.settle();
        await sleep(900); // 카드 글꼴·끝 화면·모의 서버
        const r = await tab.eval(`(() => {
          const end = document.querySelector('[data-mg-end]');
          const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
          const s = window.HANGUL_NAME_APP.state();
          return { result: !document.getElementById('screen-result').hidden, start: !document.getElementById('screen-start').hidden, kids, s,
            blocks: [...document.querySelectorAll('.hn-blocks li')].map((li) => li.querySelector('.hn-bh').textContent + ':' + li.querySelector('.hn-br').textContent),
            faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
            share: window.HANGUL_NAME_APP.shareUrl(), started: sessionStorage.getItem('t_start'), done: sessionStorage.getItem('t_done'),
            label: document.getElementById('card-canvas').getAttribute('aria-label') };
        })()`);
        if (!r.result || r.start) report(tag, '결과 화면이 안 보임');
        if (r.s.hangul !== WANT.hangul) report(tag, `결과 ${r.s.hangul} ≠ ${WANT.hangul}`);
        const wantBlocks = WANT.words.flatMap((w) => w.blocks.map((b) => `${b.h}:${b.r}`));
        if (r.blocks.join(',') !== wantBlocks.join(',')) report(tag, `음절 풀이 ${r.blocks.join(',')} ≠ ${wantBlocks.join(',')}`);
        if (r.started !== '1' || r.done !== '1') report(tag, `track start ${r.started}회 / done ${r.done}회 (각 1회)`);
        const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
        if (r.kids.join(',') !== order.join(',')) report(tag, `끝 화면 순서 ${r.kids.join(' → ')}`);
        if (r.faqItems < 3 || r.shareBtns !== 6) report(tag, `FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
        const hash = (r.share.split('#d=')[1] || '');
        const dec = CORE.decode(hash);
        if (!dec || dec.name !== NAME) report(tag, `공유 주소의 #d= 가 이름을 담지 않음: ${r.share}`);
        if (!/^http:\/\/localhost:\d+\/(index\.html)?#d=/.test(r.share)) report(tag, `공유 주소가 언어 없는 주소가 아님: ${r.share}`);
        if (!r.label || !r.label.includes(WANT.hangul)) report(tag, '카드 canvas aria-label 없음');
        const ink = await tab.eval(CANVAS_INK);
        if (ink < 300) report(tag, `카드에 이름 글자가 그려지지 않은 것 같음 (잉크 ${ink})`);
        const o2 = await tab.eval(OVERFLOW); if (o2) report(tag, `결과 화면 가로 넘침 ${o2}px`);
        (await tab.eval(BROKEN_WORDS + `('.hn-eyebrow, .hn-btn, .hn-chip-name, .hn-h3, .hn-note, .hn-word-src, .mg-end-retry, .mg-end-h, .mg-faq summary')`)).forEach((w) => report(tag, `결과 화면 단어 잘림 "${w}"`));
        // 칩이 한 줄 4칸에 들어가는지 (360px)
        const chipRows = await tab.eval(`new Set([...document.querySelectorAll('.hn-chip')].map((c) => Math.round(c.getBoundingClientRect().top))).size`);
        if (chipRows !== 1) report(tag, `스타일 칩이 ${chipRows}줄`);
        // 스타일 바꾸기
        for (const s of CORE.STYLES.slice().reverse()) {
          await tab.tap(`.hn-chip[data-style="${s}"]`);
          await sleep(120);
          const cur = await tab.eval(`window.HANGUL_NAME_APP.state().style + '|' + document.querySelector('.hn-chip[data-style="${s}"]').getAttribute('aria-checked')`);
          if (cur !== `${s}|true`) report(tag, `스타일 ${s} 로 안 바뀜 (${cur})`);
        }
        await sleep(600);
        const ink2 = await tab.eval(CANVAS_INK);
        if (ink2 < 300) report(tag, `스타일 바꾼 뒤 카드가 비어 보임 (잉크 ${ink2})`);
        // 복사 · 저장
        await tab.send('Browser.grantPermissions', { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'], origin: `http://localhost:${HTTP_PORT}` }).catch(() => {});
        await tab.tap('#copy-btn');
        await sleep(300);
        const copied = await tab.eval(`window.HANGUL_NAME_APP.lastCopy`);
        if (!copied || !copied.includes(WANT.hangul) || !copied.includes('#d=')) report(tag, `글자 복사 내용이 이상함: ${copied}`);
        await tab.tap('#save-btn');
        let img = null;
        for (let k = 0; k < 40 && !img; k++) { await sleep(150); img = await tab.eval(`window.HANGUL_NAME_APP.lastImage`); }
        if (!img || img.type !== 'image/png' || img.size < 5000 || img.w !== 1080) report(tag, `이미지 저장(PNG) 실패: ${JSON.stringify(img)}`);
        const stMsg = await tab.eval(`document.getElementById('status').className + '|' + document.getElementById('status').textContent`);
        if (/is-bad/.test(stMsg)) report(tag, `저장 상태 문구가 실패: ${stMsg}`);
        // 다시 하기 → 이름 입력
        await tab.tap('[data-mg-end] .mg-end-retry');
        await sleep(200);
        const back = await tab.eval(`!document.getElementById('screen-start').hidden && document.getElementById('screen-result').hidden && document.getElementById('name-input').value`);
        if (back !== NAME) report(tag, `다시 하기 → 이름 입력 화면이 아님 (${back})`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        // 공유 링크 방문 (새 탭): 같은 카드, 친구 문구, start/done 안 셈
        const v = await openTab(width);
        const link = base + '#d=' + CORE.encode(NAME, 'cute');
        await v.goto(base);
        await v.eval(`sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); 1`);
        await v.goto('about:blank');
        await v.goto(link);
        await v.eval(SPY);
        await sleep(800);
        const vis = await v.eval(`(() => ({ result: !document.getElementById('screen-result').hidden, s: window.HANGUL_NAME_APP.state(), eyebrow: document.getElementById('result-eyebrow').textContent, t: sessionStorage.getItem('t_start') || sessionStorage.getItem('t_done') }))()`);
        if (!vis.result || vis.s.hangul !== WANT.hangul || vis.s.style !== 'cute' || !vis.s.friend) report(tag, `공유 링크 방문: 같은 카드가 아님 ${JSON.stringify(vis.s)}`);
        if (vis.t) report(tag, '공유 링크 방문을 start/done 으로 셈');
        const o3 = await v.eval(OVERFLOW); if (o3) report(tag, `공유 링크 방문 화면 가로 넘침 ${o3}px`);
        v.errors.forEach((e) => report(tag, '콘솔 오류(공유 링크): ' + e));
        await v.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} ${NAME} → ${r.s.hangul} (${r.blocks.length}음절) · 끝 화면 ${r.kids.join('→')} · PNG ${img ? img.size : 0}B`);
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
