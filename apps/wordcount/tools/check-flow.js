#!/usr/bin/env node
/**
 * 글자수 세기 실제 흐름 검사 (Chrome headless, 의존성 없음).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 요약·FAQ 안 보임, 가로 넘침·단어 잘림 없음
 *   - 글 입력(CDP insertText) → 막대·자세한 숫자 = WORDCOUNT_CORE.analyze 값, track start 1번(더 써도 1번)
 *   - 목표 500 → 막대 보임 / 직접 10 → 넘침(over) / 바이트 나이스 → 막대 바이트 = 나이스 값
 *   - 새로고침 → 초안·설정(나이스·목표 10) 그대로
 *   - 공백 정리 → 되돌리기 → 원래 글
 *   - 결과 보기 → 요약·끝 화면(별점 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱), mg-ad-start 숨김, track done 1번(다시 눌러도 1번)
 *   - 주소·공유 버튼 링크·쿠키에 글이 없음
 *   - 다시 하기 → 글·초안 지움, 요약 숨김, 광고 다시 보임, 입력 칸 초점 → 다시 쓰고 결과 보기 → start 2 / done 2
 *   - 콘솔 오류 0
 *
 * 실행: node tools/check-flow.js                  (en,ko × 360,1440)
 *       node tools/check-flow.js en,ja,ru,th 375
 */
const fs = require('fs');
const os = require('os');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'wordcount-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const HTTP_PORT = 8921, MOCK_PORT = 8922, CDP_PORT = 9421;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SAMPLE = {
  en: 'The quick brown fox jumps over the lazy dog. Well-known e-mail rules apply!\n\nA second paragraph with an emoji 👨‍👩‍👧 and café.',
  ko: '저는 사용자 경험을 중요하게 생각합니다. AI는 2026년에 더 발전할 것입니다!\n\n두 번째 문단입니다 👨‍👩‍👧 그리고 끝.',
  ja: '今日は晴れです。明日は雨が降るでしょう。\n\n二つ目の段落です 👨‍👩‍👧',
  th: 'สวัสดีครับ วันนี้อากาศดีมาก\n\nย่อหน้าที่สอง 👨‍👩‍👧',
};
const sampleOf = (lang) => SAMPLE[lang] || SAMPLE.en;

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
  async settle() { await this.eval('document.fonts.ready.then(() => 1)'); await sleep(250); }
  async goto(url) { const l = this.loaded(); await this.send('Page.navigate', { url }); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async reload() { const l = this.loaded(); await this.send('Page.reload', {}); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async tap(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async type(sel, text) {
    await this.tap(sel);
    await this.send('Input.insertText', { text });
    await sleep(120);
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
  await tab.send('Browser.grantPermissions', { origin: `http://localhost:${HTTP_PORT}`, permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] }).catch(() => {});
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
const SPY = `(() => { const o = window.track; window.track = function (e) { if (e === 'start' || e === 'done') window.__t[e]++; return o && o.apply(this, arguments); }; window.__t = { start: 0, done: 0 }; return 1; })()`;
const COUNTS = `({ s: window.__t.start, d: window.__t.done })`;
const END_KIDS = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const LEAK_SOURCES = `(() => {
  const out = [location.href, document.cookie];
  document.querySelectorAll('a[href]').forEach((a) => out.push(a.href));
  return out.join('\\n');
})()`;
const BAR = `(() => { const d = (id) => Number(document.getElementById(id).textContent.replace(/[^0-9]/g, '')); return { chars: d('bar-chars'), noSpaces: d('bar-noSpaces'), words: d('bar-words'), bytes: d('bar-bytes'),
  sentences: d('st-sentences'), paragraphs: d('st-paragraphs'), lines: d('st-lines') }; })()`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'wc-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 글자수 세기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const text = sampleOf(lang);
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
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-wc'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0] && !a[0].hidden,
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            value: document.getElementById('text').value }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.resultHidden || st.faqVisible) report(tag, '첫 화면에 요약·끝 화면(FAQ)이 보임');
        if (st.value) report(tag, '처음부터 입력 칸에 글이 있음');
        const o1 = await tab.eval(OVERFLOW); if (o1) report(tag, `첫 화면 가로 넘침 ${o1}px`);
        (await tab.eval(BROKEN_WORDS + `('.wc-h1, .wc-hook, .wc-bar-label, .wc-tool, .wc-saved, .wc-label, .wc-chip, .wc-custom, .wc-switch-text, .wc-stat-label, .wc-seg-btn, .wc-hint, .wc-kw-sum, .wc-btn, .wc-local')`)).forEach((w) => report(tag, `첫 화면 단어 잘림 "${w}"`));
        await tab.eval(SPY);

        // 1) 글 입력 → 숫자
        await tab.type('#text', text);
        const want = CORE.analyze(text, { lang });
        let bar = await tab.eval(BAR);
        const exp = { chars: want.chars, noSpaces: want.noSpaces, words: want.words, bytes: want.bytes.utf8, sentences: want.sentences, paragraphs: want.paragraphs, lines: want.lines };
        if (JSON.stringify(bar) !== JSON.stringify(exp)) report(tag, `숫자 ${JSON.stringify(bar)} ≠ ${JSON.stringify(exp)}`);
        await tab.type('#text', ' 더');
        let c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 0) report(tag, `글을 쓰는 동안 track start ${c.s} / done ${c.d} (1/0)`);
        // 2) 목표·바이트
        await tab.tap('[data-limit="500"]');
        const lb = await tab.eval(`({ shown: !document.getElementById('limitbar').hidden, state: document.getElementById('limitbar').getAttribute('data-state'), text: document.getElementById('limit-text').textContent })`);
        if (!lb.shown || lb.state !== 'ok') report(tag, `목표 500 막대 ${JSON.stringify(lb)}`);
        await tab.type('#limit-custom', '10');
        const lb2 = await tab.eval(`({ state: document.getElementById('limitbar').getAttribute('data-state'), checked: document.querySelectorAll('[data-limit][aria-checked="true"]').length })`);
        if (lb2.state !== 'over' || lb2.checked !== 0) report(tag, `직접 10 → 넘침 ${JSON.stringify(lb2)}`);
        await tab.tap('[data-bytemode="neis"]');
        const full = await tab.eval(`document.getElementById('text').value`);
        bar = await tab.eval(BAR);
        if (bar.bytes !== CORE.bytes(full, 'neis')) report(tag, `나이스 바이트 ${bar.bytes} ≠ ${CORE.bytes(full, 'neis')}`);
        await sleep(600);   // 초안 저장(400ms) 기다림
        // 3) 새로고침 → 초안·설정
        await tab.reload();
        await tab.eval(SPY);
        const rs = await tab.eval(`({ value: document.getElementById('text').value, neis: document.querySelector('[data-bytemode="neis"]').getAttribute('aria-checked'), custom: document.getElementById('limit-custom').value, state: document.getElementById('limitbar').getAttribute('data-state') })`);
        if (rs.value !== full || rs.neis !== 'true' || rs.custom !== '10' || rs.state !== 'over') report(tag, `새로고침 뒤 초안·설정 ${JSON.stringify({ same: rs.value === full, neis: rs.neis, custom: rs.custom, state: rs.state })}`);
        // 4) 공백 정리 → 되돌리기
        await tab.eval(`(() => { const t = document.getElementById('text'); t.value = t.value + '   \\n\\n\\n\\n  tail  '; t.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
        const messy = await tab.eval(`document.getElementById('text').value`);
        await tab.tap('#btn-tidy');
        const tidy = await tab.eval(`({ v: document.getElementById('text').value, undo: !document.getElementById('btn-undo').hidden })`);
        if (tidy.v !== CORE.tidySpaces(messy) || !tidy.undo) report(tag, '공백 정리 결과/되돌리기 버튼');
        await tab.tap('#btn-undo');
        if ((await tab.eval(`document.getElementById('text').value`)) !== messy) report(tag, '되돌리기가 원래 글로 돌리지 않음');
        // 5) 결과 보기
        await tab.tap('#finish-btn');
        await sleep(700);
        c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 1) report(tag, `결과 보기 뒤 track start ${c.s} / done ${c.d} (1/1, 불러온 초안)`);
        const r1 = await tab.eval(`({ result: !document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, sum: document.getElementById('sum-chars').textContent.replace(/[^0-9]/g, ''), rows: document.querySelectorAll('#sum-list dt').length, limit: !document.getElementById('sum-limit').hidden, faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length })`);
        if (!r1.result || !r1.ad) report(tag, '결과 보기 뒤 요약이 안 보이거나 mg-ad-start 가 그대로');
        if (Number(r1.sum) !== CORE.analyze(messy).chars || r1.rows !== 7 || !r1.limit) report(tag, `요약 ${JSON.stringify(r1)}`);
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        if (r1.faq !== T.faq.length || r1.share !== 6) report(tag, `FAQ ${r1.faq}개 / 공유 버튼 ${r1.share}개`);
        await tab.tap('#finish-btn');
        c = await tab.eval(COUNTS);
        if (c.d !== 1) report(tag, `결과 보기를 또 눌러도 done 은 1번 (${c.d})`);
        const leak = await tab.eval(LEAK_SOURCES);
        const probe = messy.split('\n')[0].slice(0, 12);
        if (leak.includes(probe) || leak.includes(encodeURIComponent(probe))) report(tag, '주소·쿠키·링크 어딘가에 글이 있음');
        if (/[#?]/.test(await tab.eval('location.hash + location.search'))) report(tag, '주소에 # 또는 ? 가 생김');
        const share = await tab.eval(`window.getShareData().then((d) => JSON.stringify(d))`);
        if (share.includes(probe)) report(tag, '공유 데이터에 글이 있음');
        const o2 = await tab.eval(OVERFLOW); if (o2) report(tag, `결과 화면 가로 넘침 ${o2}px`);
        (await tab.eval(BROKEN_WORDS + `('.wc-h2, .wc-sum-label, .wc-sum-list dt, .wc-sum-limit, .mg-end-retry, .mg-end-h, .mg-faq summary')`)).forEach((w) => report(tag, `결과 화면 단어 잘림 "${w}"`));
        // 6) 다시 하기
        await tab.tap('[data-mg-end] .mg-end-retry');
        await sleep(600);
        const rt = await tab.eval(`({ v: document.getElementById('text').value, result: document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, focus: document.activeElement && document.activeElement.id, draft: localStorage.getItem('mg_wordcount_draft'), chars: document.getElementById('bar-chars').textContent })`);
        if (rt.v !== '' || !rt.result || rt.ad || rt.focus !== 'text' || rt.draft != null || rt.chars !== '0') report(tag, `다시 하기 ${JSON.stringify(rt)}`);
        await tab.send('Input.insertText', { text: 'Again!' });
        await sleep(150);
        await tab.tap('#finish-btn');
        await sleep(300);
        c = await tab.eval(COUNTS);
        if (c.s !== 2 || c.d !== 2) report(tag, `다시 하기 뒤 track start ${c.s} / done ${c.d} (2/2)`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 글자 ${want.chars} · 단어 ${want.words} · 목표·넘침 · 나이스 바이트 · 새로고침 초안 · 정리/되돌리기 · 결과 보기 · 끝 화면 ${kids.join('→')} · 다시 하기`);
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
