#!/usr/bin/env node
/**
 * 할로윈 몬스터 테스트 실제 흐름 검사 (Chrome headless, 의존성 없음).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다 시작 → 질문 10개(중간에 뒤로 가기 한 번) → 소환 중 → r/<id>.html 결과 → 공통 끝 화면까지 탭해서
 *   - 가로 넘침 없음, 콘솔 오류 0, 시작 화면에 광고·FAQ 없음, 질문 화면 광고 자리 1개
 *   - track('done') 이 한 번만 불림, 결과가 monster-core.js 채점과 같음
 *   - 결과 카드 → 끝 화면, 끝 화면 순서: 별점·하트 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱
 *   - 공유 주소 = 그 언어의 r/<id>.html, 같은 몬스터 비율이 서버(모의) 값으로 표시됨, 방금 푼 사람에겐 CTA 숨김
 *   - 공유 링크로 들어온 방문자(새 세션)에겐 CTA 표시, 다시 하기 = 같은 언어의 시작 화면
 *   - 제목·버튼·결과 글자가 단어 중간에서 잘리지 않음
 *
 * 실행: node tools/check-flow.js                 (en,ko × 360,375)
 *       node tools/check-flow.js en,ko,ja 360,375,1440
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'monster-core.js'));
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,375').split(',').map(Number);
const HTTP_PORT = 8861, MOCK_PORT = 8862, CDP_PORT = 9366;
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
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon/.test(m.params.entry.url || '')) this.errors.push('log: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
      if (m.method === 'Page.loadEventFired' && this.onload) { const f = this.onload; this.onload = null; f(); }
    };
    // Chrome 이 밖에서 꺼지면(병렬 작업 등) 기다리던 호출을 실패로 끝낸다 — 멈춰 있지 않게
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
}
async function openTab(width) {
  const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const tab = new Tab(ws);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 740, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  return tab;
}
// 진행 표시가 want 가 될 때까지(최대 ms) 기다렸다가 현재 값을 돌려준다
async function waitNum(tab, want, ms = 5000) {
  let v = '';
  for (const end = Date.now() + ms; Date.now() < end; await sleep(50)) {
    v = await tab.eval(`document.getElementById('progress-num').textContent.trim()`);
    if (v === want) break;
  }
  await sleep(60);
  return v;
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
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff]/.test(m[0])) continue;
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
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mon-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 몬스터 테스트 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    let seed = 1;
    for (const lang of LANGS) {
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        // 모의 서버: 같은 몬스터 비율이 보이도록 12종에 표를 심어 둔다(합계 ≥ 20)
        await mockRpc('__reset');
        for (const id of CORE.ORDER) { const s = CORE.pollSlot(id); for (let k = 0; k < 3; k++) await mockRpc('poll_vote', { p_poll: CORE.POLL, p_qid: s.qid, p_opt: s.opt }); }
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.goto(base);
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await tab.goto(base);
        // 시작 화면
        const st = await tab.eval(`(() => ({ start: !document.getElementById('screen-start').hidden, quiz: !document.getElementById('screen-quiz').hidden,
          adInStart: !!document.querySelector('#screen-start .mg-ad'), faq: !!document.querySelector('.mg-faq, [data-mg-end]'), h1: document.querySelector('h1').textContent.trim() }))()`);
        if (!st.start || st.quiz) report(tag, '시작 화면이 먼저 보이지 않음');
        if (st.adInStart || st.faq) report(tag, '시작 화면에 광고/FAQ/끝 화면');
        const o1 = await tab.eval(OVERFLOW); if (o1) report(tag, `시작 화면 가로 넘침 ${o1}px`);
        (await tab.eval(BROKEN_WORDS + `('.mon-h1, .mon-badge, .mon-btn, .mon-hook')`)).forEach((w) => report(tag, `시작 화면 단어 잘림 "${w}"`));
        // track('done') 횟수는 이동 뒤에도 보이게 sessionStorage 에 센다
        await tab.eval(`(() => { const o = window.track; window.track = function (e) { if (e === 'done') sessionStorage.setItem('t_done', String(Number(sessionStorage.getItem('t_done') || 0) + 1)); return o && o.apply(this, arguments); }; return 1; })()`);
        await tab.tap('#start-btn');
        await sleep(150);
        const answers = [];
        for (let qi = 0; qi < CORE.QUESTIONS.length; qi++) {
          const n = CORE.QUESTIONS[qi].choices.length;
          const ci = (seed * 7 + qi * 3 + lang.length) % n;
          const q = await tab.eval(`(() => ({ n: document.querySelectorAll('.mon-choice').length, num: document.getElementById('progress-num').textContent, ads: document.querySelectorAll('#screen-quiz .mg-ad').length }))()`);
          if (q.n !== n) report(tag, `Q${qi + 1} 보기 ${q.n}개 ≠ ${n}`);
          if (q.num.trim() !== `${qi + 1} / ${CORE.QUESTIONS.length}`) report(tag, `Q${qi + 1} 진행 표시 "${q.num}"`);
          if (q.ads !== 1) report(tag, `질문 화면 광고 자리 ${q.ads}개`);
          if (qi === 0 || qi === 5) {
            const o = await tab.eval(OVERFLOW); if (o) report(tag, `Q${qi + 1} 가로 넘침 ${o}px`);
            (await tab.eval(BROKEN_WORDS + `('.mon-q-text, .mon-choice')`)).forEach((w) => report(tag, `Q${qi + 1} 단어 잘림 "${w}"`));
          }
          if (qi === 3) { // 뒤로 가기 한 번: Q3 으로 돌아가서 다시 답한다
            await tab.tap('#back-btn');
            const back = await waitNum(tab, `3 / ${CORE.QUESTIONS.length}`);
            if (back !== `3 / ${CORE.QUESTIONS.length}`) report(tag, `뒤로 가기 후 "${back}"`);
            await tab.tap(`.mon-choice:nth-child(${answers[2] + 1})`);
            await waitNum(tab, `4 / ${CORE.QUESTIONS.length}`);
          }
          await tab.tap(`.mon-choice:nth-child(${ci + 1})`);
          answers.push(ci);
          // 보기를 누르면 240ms 동안 다음 탭을 무시한다(연타 방지) — 고정 대기 대신 진행 표시가 바뀔 때까지 기다린다(부하에 강하게)
          if (qi === CORE.QUESTIONS.length - 1) await sleep(500);
          else await waitNum(tab, `${qi + 2} / ${CORE.QUESTIONS.length}`);
        }
        seed++;
        const expected = CORE.score(answers);
        const loading = await tab.eval(`!document.getElementById('screen-loading').hidden`);
        if (!loading) report(tag, '소환 중 화면이 안 보임');
        const l = tab.loaded();
        await Promise.race([l, sleep(6000)]);
        await tab.settle();
        await sleep(900); // 끝 화면·모의 서버 응답
        const r = await tab.eval(`(() => {
          const end = document.querySelector('[data-mg-end]');
          const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
          const card = document.querySelector('.mon-card');
          return { path: location.pathname, kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
            faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
            cta: !document.getElementById('share-cta').hidden, same: document.getElementById('same-share').hidden ? '' : document.getElementById('same-share').textContent,
            shareUrl: (window.MON_RESULT || {}).share && window.MON_RESULT.share.url, done: sessionStorage.getItem('t_done'), voted: localStorage.getItem('mon_voted_v1') };
        })()`);
        const wantPath = '/' + G.fileOf(lang, `r/${expected}.html`);
        if (r.path !== wantPath) report(tag, `결과 페이지 ${r.path} ≠ ${wantPath} (채점 불일치)`);
        if (r.done !== '1') report(tag, `track('done') ${r.done}회 (1회여야 함)`);
        const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
        if (r.kids.join(',') !== order.join(',')) report(tag, `끝 화면 순서 ${r.kids.join(' → ')}`);
        if (!r.cardBeforeEnd) report(tag, '결과 카드가 끝 화면보다 위에 있지 않음');
        if (r.faqItems < 3 || r.shareBtns !== 6) report(tag, `FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
        if (r.cta) report(tag, '방금 푼 사람에게 "해 보기" CTA 가 보임');
        if (!r.same || !/\d/.test(r.same)) report(tag, '같은 몬스터 비율(모의 서버 값)이 안 보임');
        if (r.voted !== '1') report(tag, '결과 표가 서버(모의)에 기록되지 않음');
        if (r.shareUrl !== G.publicUrl('https://monster.example.com', lang, `r/${expected}.html`)) report(tag, `공유 주소 ${r.shareUrl}`);
        const o2 = await tab.eval(OVERFLOW); if (o2) report(tag, `결과 페이지 가로 넘침 ${o2}px`);
        (await tab.eval(BROKEN_WORDS + `('.mon-result-name, .mon-catch, .mon-eyebrow, .mon-pair-name, .mon-pair-label, .mon-chips li, .mg-end-retry, .mg-end-h, .mg-faq summary')`)).forEach((w) => report(tag, `결과 페이지 단어 잘림 "${w}"`));
        // 다시 하기 → 같은 언어 시작 화면
        const l2 = tab.loaded();
        await tab.tap('[data-mg-end] .mg-end-retry');
        await Promise.race([l2, sleep(6000)]);
        await tab.settle();
        const back = await tab.eval(`location.pathname + '|' + !document.getElementById('screen-start').hidden`);
        const wantStart = '/' + G.fileOf(lang, 'index.html').replace(/index\.html$/, '');
        if (back !== `${wantStart}|true`) report(tag, `다시 하기 → ${back}`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        // 공유 링크로 들어온 방문자: 새 세션(탭)에서 결과 페이지 직접 열기 → CTA 보임
        const v = await openTab(width);
        await v.goto(base + `r/${expected}.html`);
        await v.eval(`sessionStorage.clear(); 1`);
        await v.goto(base + `r/${expected}.html`);
        const vis = await v.eval(`!document.getElementById('share-cta').hidden`);
        if (!vis) report(tag, '공유 링크 방문자에게 CTA 가 안 보임');
        const o3 = await v.eval(OVERFLOW); if (o3) report(tag, `방문자 결과 페이지 가로 넘침 ${o3}px`);
        v.errors.forEach((e) => report(tag, '콘솔 오류(방문자): ' + e));
        await v.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} → ${expected} · 끝 화면 ${r.kids.join('→')} · "${r.same}"`);
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
