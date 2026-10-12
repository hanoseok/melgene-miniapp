#!/usr/bin/env node
/**
 * 비밀번호 생성기 실제 흐름 검사 (Chrome headless, 의존성 없음).
 * 사이트는 이 스크립트가 직접 띄운다: 정적 서버 + tools/mock-supa.js (운영 DB 안 씀, localStorage.mg_supa_url).
 * 언어 × 화면 폭마다:
 *   - 첫 화면: 맨 끝 mg-ad-start 1개, 결과·FAQ 안 보임, 패스프레이즈 옵션 숨김, 가로 넘침·단어 잘림 없음
 *   - 만들기(기본 16자) → 결과 1줄, 16자·종류마다 1개 이상, 강도 = 아주 강함·비트 수 = PASSWORD_CORE 계산, track start 1 / done 1,
 *     결과·끝 화면 나타남(순서 별점·하트 → 광고 → 공유 → FAQ → 다시 하기 → 다른 미니앱), mg-ad-start 숨김
 *   - 복사 → 클립보드 = 화면의 비밀번호
 *   - 주소·localStorage·sessionStorage·쿠키·공유 버튼 링크에 비밀번호가 없음
 *   - 짧게(6자, 소문자만) → 약함 + 1초 미만 / 글자 종류 모두 끔 → 오류, track 그대로
 *   - 패스프레이즈 × 5개 → 5줄, 단어 5개·숫자 1개 모양, track 2/2 → 다시 하기 → 3/3
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
const CORE = require(path.join(SITE, 'password-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const HTTP_PORT = 8891, MOCK_PORT = 8892, CDP_PORT = 9391;
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
  async settle() { await this.eval('document.fonts.ready.then(() => 1)'); await sleep(250); }
  async goto(url) { const l = this.loaded(); await this.send('Page.navigate', { url }); await Promise.race([l, sleep(10000)]); await this.settle(); }
  async tap(sel) {
    const r = await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
  }
  async setRange(sel, value) {
    await this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(String(value))}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
  }
  async setCheck(sel, on) {
    const cur = await this.eval(`document.querySelector(${JSON.stringify(sel)}).checked`);
    if (cur !== on) await this.tap(`label:has(> ${sel})`);
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
// 비밀번호가 새어 나갈 수 있는 곳을 모두 모은다
const LEAK_SOURCES = `(() => {
  const out = [location.href, document.cookie];
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out.push(k, localStorage.getItem(k)); } } catch (e) { /* noop */ }
  try { for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); out.push(k, sessionStorage.getItem(k)); } } catch (e) { /* noop */ }
  document.querySelectorAll('a[href]').forEach((a) => out.push(a.href));
  return out.join('\\n');
})()`;
const waitIdle = async (tab) => { for (let k = 0; k < 40; k++) { await sleep(100); if (!(await tab.eval('window.PASSWORD_APP.busy()'))) return; } };

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = serve();
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    console.log(`\n=== 비밀번호 생성기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) ===`);
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
        const st = await tab.eval(`(() => { const s = document.getElementById('screen-pw'); const a = [...s.querySelectorAll('.mg-ad')].filter((el) => !el.closest('[data-mg-end]'));
          return { lang: document.documentElement.lang, adOk: a.length === 1 && a[0].classList.contains('mg-ad-start') && s.lastElementChild === a[0],
            resultHidden: document.getElementById('result').hidden, faqVisible: !!document.querySelector('.mg-end-faq') && !!document.querySelector('.mg-end-faq').offsetParent,
            phraseHidden: document.getElementById('opt-passphrase').hidden,
            tallSeg: [...document.querySelectorAll('.pw-seg-btn')].filter((b) => b.offsetParent && b.getBoundingClientRect().height > 60).map((b) => b.textContent) }; })()`);
        if (st.lang !== lang) report(tag, `페이지 언어 ${st.lang}`);
        if (!st.adOk) report(tag, '첫 화면 광고가 맨 끝 mg-ad-start 1개가 아님');
        if (!st.resultHidden || st.faqVisible) report(tag, '첫 화면에 결과·끝 화면(FAQ)이 보임');
        if (!st.phraseHidden) report(tag, '처음부터 패스프레이즈 옵션이 보임');
        if (st.tallSeg.length) report(tag, `종류·개수 버튼이 세 줄 이상: ${st.tallSeg.join(', ')}`);
        const o1 = await tab.eval(OVERFLOW); if (o1) report(tag, `첫 화면 가로 넘침 ${o1}px`);
        (await tab.eval(BROKEN_WORDS + `('.pw-h1, .pw-hook, .pw-label, .pw-seg-btn, .pw-switch-text, .pw-hint, .pw-btn, .pw-local')`)).forEach((w) => report(tag, `첫 화면 단어 잘림 "${w}"`));
        await tab.eval(SPY);

        // 1) 기본 만들기
        await tab.tap('#gen-btn');
        await waitIdle(tab);
        await sleep(700); // 끝 화면·모의 서버
        let last = await tab.eval('window.PASSWORD_APP.last()');
        const pw = last && last.list[0];
        if (!pw || pw.length !== 16) report(tag, `기본 비밀번호 길이 ${pw && pw.length}`);
        else {
          const cls = CORE.classesFor(CORE.normalize({}));
          if (cls.some((c) => ![...pw].some((ch) => c.chars.includes(ch)))) report(tag, `빠진 글자 종류: ${pw}`);
        }
        const shown = await tab.eval(`[...document.querySelectorAll('#pw-list .pw-pass')].map((c) => c.textContent)`);
        if (JSON.stringify(shown) !== JSON.stringify(last.list)) report(tag, '화면의 비밀번호가 만든 값과 다름');
        const bitsWant = Math.floor(CORE.passwordEntropy({}));
        const m1 = await tab.eval(`({ level: document.getElementById('meter').getAttribute('data-level'), word: document.getElementById('meter-word').textContent, bits: document.getElementById('meter-bits').textContent, crack: document.getElementById('meter-crack').textContent, tip: document.getElementById('meter-tip').textContent })`);
        if (m1.level !== 'veryStrong' || m1.word !== T.result.strength.veryStrong) report(tag, `기본 강도 ${m1.level} ${m1.word}`);
        if (!m1.bits.replace(/[^\d]/g, '').includes(String(bitsWant))) report(tag, `비트 수 ${m1.bits} (기대 ${bitsWant})`);
        if (!m1.crack.includes(T.result.crackForever) || !m1.tip) report(tag, `해킹 시간 문구 ${m1.crack}`);
        let c = await tab.eval(COUNTS);
        if (c.s !== 1 || c.d !== 1) report(tag, `만들기 1번인데 track start ${c.s} / done ${c.d}`);
        const r1 = await tab.eval(`({ result: !document.getElementById('result').hidden, ad: document.querySelector('.mg-ad-start').hidden, faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length })`);
        if (!r1.result || !r1.ad) report(tag, '만든 뒤 결과가 안 보이거나 mg-ad-start 가 그대로');
        const kids = await tab.eval(END_KIDS);
        if (kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${kids.join(' → ')}`);
        if (r1.faq !== T.faq.length || r1.share !== 6) report(tag, `FAQ ${r1.faq}개 / 공유 버튼 ${r1.share}개`);
        // 복사
        await tab.tap('#pw-list .pw-copy');
        await sleep(300);
        const clip = await tab.eval(`navigator.clipboard.readText().catch((e) => 'ERR ' + e.message)`);
        if (clip !== pw) report(tag, `클립보드 ${String(clip).slice(0, 40)} ≠ 비밀번호`);
        // 새는 곳
        const leak1 = await tab.eval(LEAK_SOURCES);
        if (pw && (leak1.includes(pw) || leak1.includes(encodeURIComponent(pw)))) report(tag, '주소·저장소·쿠키·링크 어딘가에 비밀번호가 있음');
        if (/[#?]/.test(await tab.eval('location.hash + location.search'))) report(tag, '주소에 # 또는 ? 가 생김');
        const o2 = await tab.eval(OVERFLOW); if (o2) report(tag, `결과 화면 가로 넘침 ${o2}px`);
        (await tab.eval(BROKEN_WORDS + `('.pw-h2, .pw-meter-word, .pw-bits, .pw-crack, .pw-crack-note, .pw-tip, .pw-copy, .mg-end-retry, .mg-end-h, .mg-faq summary')`)).forEach((w) => report(tag, `결과 화면 단어 잘림 "${w}"`));

        // 2) 짧은 비밀번호 → 약함
        await tab.setRange('#length', 6);
        for (const k of ['#t-upper', '#t-digits', '#t-symbols']) await tab.setCheck(k, false);
        await tab.tap('#gen-btn');
        await waitIdle(tab);
        last = await tab.eval('window.PASSWORD_APP.last()');
        const m2 = await tab.eval(`({ level: document.getElementById('meter').getAttribute('data-level'), crack: document.getElementById('meter-crack').textContent, out: document.getElementById('length-out').textContent })`);
        if (!/^[a-z]{6}$/.test(last.list[0])) report(tag, `6자 소문자 ${last.list[0]}`);
        if (m2.level !== 'weak' || !m2.crack.includes(T.result.crackInstant) || m2.out !== '6') report(tag, `6자 소문자 강도 ${JSON.stringify(m2)}`);
        // 3) 종류 0개 → 오류
        await tab.setCheck('#t-lower', false);
        await tab.tap('#gen-btn');
        await sleep(200);
        const err = await tab.eval(`!document.getElementById('error').hidden && document.getElementById('error').textContent`);
        if (err !== T.ui.needType) report(tag, `종류 0개 오류 문구 ${err}`);
        c = await tab.eval(COUNTS); if (c.s !== 2 || c.d !== 2) report(tag, `오류인데 track 이 셈 start ${c.s} / done ${c.d}`);
        await tab.setCheck('#t-lower', true);
        // 4) 패스프레이즈 × 5
        await tab.tap('[data-mode="passphrase"]');
        await tab.tap('[data-count="5"]');
        await tab.tap('[data-sep="dot"]');
        const o3 = await tab.eval(OVERFLOW); if (o3) report(tag, `패스프레이즈 옵션 가로 넘침 ${o3}px`);
        (await tab.eval(BROKEN_WORDS + `('.pw-sep-name, .pw-switch-text, .pw-hint, .pw-label')`)).forEach((w) => report(tag, `패스프레이즈 옵션 단어 잘림 "${w}"`));
        await tab.tap('#gen-btn');
        await waitIdle(tab);
        last = await tab.eval('window.PASSWORD_APP.last()');
        const rows = await tab.eval(`document.querySelectorAll('#pw-list .pw-row').length`);
        if (rows !== 5 || last.list.length !== 5) report(tag, `패스프레이즈 5개인데 ${rows}줄`);
        last.list.forEach((s) => { if (!/^([A-Z][a-z]+\d?)(\.[A-Z][a-z]+\d?){4}$/.test(s) || (s.match(/\d/g) || []).length !== 1) report(tag, `패스프레이즈 모양 ${s}`); });
        const title = await tab.eval(`document.getElementById('res-title').textContent`);
        if (title !== T.result.headingPhrases) report(tag, `제목 ${title}`);
        c = await tab.eval(COUNTS); if (c.s !== 3 || c.d !== 3) report(tag, `패스프레이즈 뒤 track start ${c.s} / done ${c.d} (3/3)`);
        const leak2 = await tab.eval(LEAK_SOURCES);
        if (last.list.some((s) => leak2.includes(s) || leak2.includes(encodeURIComponent(s)))) report(tag, '패스프레이즈가 주소·저장소·링크에 있음');
        // 5) 다시 하기
        await tab.tap('[data-mg-end] .mg-end-retry');
        await waitIdle(tab);
        const again = await tab.eval('window.PASSWORD_APP.last()');
        c = await tab.eval(COUNTS); if (c.s !== 4 || c.d !== 4) report(tag, `다시 하기 뒤 track start ${c.s} / done ${c.d} (4/4)`);
        if (!again || again.list.length !== 5 || again.list.join() === last.list.join()) report(tag, '다시 하기가 새 결과를 만들지 않음');
        const o4 = await tab.eval(OVERFLOW); if (o4) report(tag, `패스프레이즈 결과 가로 넘침 ${o4}px`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 16자 ${bitsWant}비트(${m1.word}) · 복사 · 6자 약함 · 종류 0개 오류 · 패스프레이즈 5개 · 다시 하기 · 끝 화면 ${kids.join('→')}`);
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
