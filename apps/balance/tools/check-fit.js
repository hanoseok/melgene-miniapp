#!/usr/bin/env node
/**
 * 밸런스 게임 실제 배치 검사 (Chrome headless, 브라우저에서 직접 잰다).
 *   11개 언어 × 5팩 × 12문제를 작은 휴대폰(기본 360×640)에서 실제로 탭해 풀면서
 *   - 대기 상태: 선택지가 자기 칸 안에 있고 VS 스티커에 가리지 않는지
 *   - 결과 상태: 한쪽이 1표뿐인 극단 비율(좁아진 칸)에서도 선택지·퍼센트·인원이 칸 안에 들어가고 VS·막대에 가리지 않는지
 *     (A 몰림 / B 몰림 두 번 돌려 양쪽을 모두 좁은 칸으로 만든다)
 *   - 가로 넘침(문서 폭 > 화면 폭)이 없는지, 콘솔 오류가 없는지
 *   - 시작 화면·끝 화면의 제목·팩 이름·결과 카드 글자가 단어 중간에서 잘리지 않는지(하이픈 줄바꿈은 허용)
 * 필요한 것: Chrome. 사이트는 이 스크립트가 직접 띄운다(정적 서버 + tools/mock-supa.js, 운영 DB 안 씀).
 *
 * 실행: node tools/check-fit.js            (11개 언어, 360×640)
 *       node tools/check-fit.js de,th 375 667
 */
const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'balance-core.js'));
const LANGS = (process.argv[2] || G.LOCALES.map((l) => l.code).join(',')).split(',');
const VW = Number(process.argv[3] || 360);
const VH = Number(process.argv[4] || 640);
const HTTP_PORT = 8845, MOCK_PORT = 8846, CDP_PORT = 9356;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------- 정적 서버 (shared 심볼릭 링크 포함)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
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

// ---------------------------------------------------------------- CDP
class Tab {
  constructor(ws) {
    this.ws = ws; this.n = 0; this.wait = new Map(); this.errors = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.wait.has(m.id)) { const w = this.wait.get(m.id); this.wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
      if (m.method === 'Runtime.exceptionThrown') this.errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') this.errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Page.loadEventFired' && this.onload) { const f = this.onload; this.onload = null; f(); }
    };
  }
  send(method, params = {}) { const id = ++this.n; return new Promise((res, rej) => { this.wait.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception ? r.exceptionDetails.exception.description : r.exceptionDetails.text);
    return r.result.value;
  }
  async goto(url) {
    const loaded = new Promise((r) => { this.onload = r; });
    await this.send('Page.navigate', { url });
    await Promise.race([loaded, sleep(10000)]);
    await this.eval('document.fonts.ready.then(() => 1)');
    await sleep(250);
  }
  async tap(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('없는 요소: ' + sel);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
  }
}
async function openTab() {
  const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const tab = new Tab(ws);
  await tab.send('Page.enable');
  await tab.send('Runtime.enable');
  await tab.send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: 2, mobile: true });
  await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  // 움직임을 줄여(전환 0.001ms) 기다림 없이 최종 배치를 잰다 — 배치 자체는 모션과 같다
  await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  return tab;
}

const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) });

// 페이지 안에서: 질문 카드 배치 재기 (VS 스티커 반지름 31px, 아래 막대 18px)
const MEASURE = `(() => {
  const d = document.getElementById('duel');
  // VS 스티커는 원(반지름 31px + 테두리 4px). 회전된 상자가 아니라 원으로 겹침을 본다
  const vb = d.querySelector('.bal-vs').getBoundingClientRect();
  const cx = vb.left + vb.width / 2, cy = vb.top + vb.height / 2, R = 35;
  const out = [];
  d.querySelectorAll('.bal-side').forEach((s, k) => {
    const r = s.getBoundingClientRect(), o = s.querySelector('.bal-opt').getBoundingClientRect();
    const stEl = s.querySelector('.bal-stat'), st = stEl.offsetParent ? stEl.getBoundingClientRect() : null;
    const top = o.top, bottom = st ? st.bottom : o.bottom;
    const hitsVs = (b) => { if (!b) return false; const x = Math.max(b.left, Math.min(cx, b.right)), y = Math.max(b.top, Math.min(cy, b.bottom)); return (x - cx) ** 2 + (y - cy) ** 2 < R * R; };
    const problems = [];
    if (top < r.top + 2 || bottom > r.bottom - (st ? 16 : 2)) problems.push('칸 밖');
    if (o.left < r.left - 0.5 || o.right > r.right + 0.5) problems.push('가로 넘침');
    if (hitsVs(o) || hitsVs(st)) problems.push('VS 에 가림');
    if (problems.length) out.push((k ? 'B' : 'A') + ' ' + problems.join('+') + ' [' + s.querySelector('.bal-opt').textContent + (st ? ' ' + s.querySelector('.bal-pct').textContent : '') + ']');
  });
  if (document.documentElement.scrollWidth > innerWidth) out.push('문서 가로 넘침 ' + document.documentElement.scrollWidth);
  return out;
})()`;

// 단어 중간 줄바꿈(하이픈 없이 한 단어가 두 줄에 걸침) 찾기
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
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff\\uac00-\\ud7af]/.test(m[0])) continue; // 띄어쓰기 없는 문자는 글자 단위 줄바꿈이 정상
        const rg = document.createRange(); rg.setStart(node, m.index); rg.setEnd(node, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map((q) => Math.round(q.top)));
        if (lines.size > 1 && !hy) bad.push(m[0]);
      }
    }
  });
  return bad;
})`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(require('os').tmpdir(), 'bal-fit-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, checked = 0;
  const report = (lang, msg) => { problems++; console.log(`  ✗ [${lang}] ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 밸런스 게임 실제 배치 검사 ${VW}×${VH} (${LANGS.join(', ')}) ===`);
    for (const lang of LANGS) {
      const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
      let langProblems = 0, langChecked = 0;
      for (const heavy of [0, 1]) {
        // 모든 질문: 몰린 쪽 30표, 반대쪽 1표 → 반대쪽 칸이 가장 좁아진다
        await mockRpc('__reset');
        for (const qid of CORE.ALL_QIDS) {
          for (let k = 0; k < 30; k++) await mockRpc('poll_vote', { p_poll: 'balance', p_qid: qid, p_opt: heavy });
        }
        const tab = await openTab();
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        if (heavy === 0) {
          const bw = await tab.eval(BROKEN_WORDS + `('.bal-hero-title span, .bal-pack-name, .bal-pack-blurb, .bal-h2, .bal-hook')`);
          bw.forEach((w) => { langProblems++; report(lang, `시작 화면 단어 잘림: "${w}"`); });
        }
        for (const pack of CORE.PACKS) {
          await tab.tap(`[data-pack="${pack.id}"]`);
          await sleep(120);
          for (let i = 0; i < CORE.PACK_SIZE; i++) {
            await tab.eval('window.scrollTo(0, 0); 1');
            const qid = pack.qids[i];
            if (heavy === 0) {
              (await tab.eval(MEASURE)).forEach((m) => { langProblems++; report(lang, `${qid} 대기: ${m}`); });
              const bw = await tab.eval(BROKEN_WORDS + `('#duel .bal-opt, #q-prompt')`);
              bw.forEach((w) => { langProblems++; report(lang, `${qid} 대기 단어 잘림: "${w}"`); });
            }
            await tab.tap(`#duel .bal-side--${heavy ? 'b' : 'a'}`); // 몰린 쪽을 고른다(내 표 포함 31:1)
            let st = '';
            for (let w = 0; w < 50; w++) { st = await tab.eval(`document.getElementById('duel').getAttribute('data-state')`); if (st === 'result' || st === 'nodata') break; await sleep(60); }
            if (st !== 'result') { langProblems++; report(lang, `${qid} 결과가 안 뜸 (${st})`); }
            await sleep(80);
            await tab.eval('window.scrollTo(0, 0); 1');
            (await tab.eval(MEASURE)).forEach((m) => { langProblems++; report(lang, `${qid} 결과(${heavy ? 'B' : 'A'} 몰림): ${m}`); });
            langChecked++;
            await tab.eval(`document.getElementById('next-btn').click(); 1`);
            await sleep(60);
          }
          // 끝 화면
          const s = await tab.eval(`document.body.getAttribute('data-screen')`);
          if (s !== 'end') { langProblems++; report(lang, `${pack.id} 끝 화면으로 안 넘어감 (${s})`); }
          if (heavy === 0) {
            const bw = await tab.eval(BROKEN_WORDS + `('.bal-result-type, .bal-result-desc, .bal-statbox-label, .bal-result-line, .mg-end-retry, .mg-end-h, .mg-faq summary')`);
            bw.forEach((w) => { langProblems++; report(lang, `${pack.id} 끝 화면 단어 잘림: "${w}"`); });
            const over = await tab.eval('document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0');
            if (over) { langProblems++; report(lang, `${pack.id} 끝 화면 가로 넘침 ${over}`); }
          }
          await tab.tap('[data-mg-end] .mg-end-retry'); // 다시 하기 = 팩 고르기로
          await sleep(250);
        }
        tab.errors.forEach((e) => { langProblems++; report(lang, '콘솔 오류: ' + e); });
        await tab.send('Page.close').catch(() => {});
      }
      checked += langChecked;
      console.log(`  [${lang}] 결과 ${langChecked}건 (질문 60 × A/B 몰림) · 문제 ${langProblems}건`);
    }
  } finally {
    chrome.kill(); mock.kill(); server.close();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(`\n결과 화면 ${checked}건 검사, 문제 ${problems}건`);
  if (problems) { console.log('결과: FAIL'); process.exit(1); }
  console.log('결과: PASS — 모든 언어·모든 질문이 작은 화면의 대기·극단 결과 상태에서 칸 안에 들어간다');
}

main().catch((e) => { console.error(e); process.exit(1); });
