#!/usr/bin/env node
/**
 * 나만의 유령 만들기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server :8741 (apps/ghost) + tools/mock-supa.js :8742
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref 로 지역 이동 막음, 다운로드는 막아 둠)
 * 언어 × 화면 폭마다:
 *   시작(티징만: 광고·FAQ·부품 없음) → 편집기(탭 8개 모두 눌러 부품 고르기, 유령 눌러 바꾸기, 둥실둥실, 랜덤, 이름 입력) → 완성
 *   → 끝 화면(결과 카드 → 공통 끝 화면: 별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   → 이미지 저장(1080×1300 PNG, 예외 없음) → 공유 링크(#d=)를 새 탭으로 열면 같은 유령 + "나도 만들기" → 편집기
 *   · prefers-reduced-motion: reduce 이면 둥실둥실이 멈춘다
 *   · track('start')·track('done') 한 번씩 · 가로 넘침 없음 · 콘솔 오류 0 · 화면 캡처(스크래치 폴더)
 *
 * 실행: node tools/flow-test.js                       (en,ko,th,ru × 360,375,1440)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'ghost-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8741, MOCK_PORT = 8742, CDP_PORT = 9441;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Tab {
  constructor(ws) {
    this.ws = ws; this.n = 0; this.wait = new Map(); this.errors = []; this.onload = null;
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.wait.has(m.id)) { const w = this.wait.get(m.id); this.wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
      if (m.method === 'Runtime.exceptionThrown') this.errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') this.errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon|pagead|googlesyndication|fonts\.g/.test(m.params.entry.url || '')) this.errors.push('log: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
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
    await sleep(40);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async shot(file) {
    if (!SHOTS) return;
    const r = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.mkdirSync(SHOTS, { recursive: true });
    fs.writeFileSync(path.join(SHOTS, file), Buffer.from(r.data, 'base64'));
  }
}
async function openTab(width) {
  const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const tab = new Tab(ws);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Page.setDownloadBehavior', { behavior: 'deny' }).catch(() => {});
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());
const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
// track 호출을 센다 (페이지 안에서 window.__tracks)
const SPY = `(() => { window.__tracks = []; const o = window.track; window.track = function (e) { window.__tracks.push(e); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, edit: !document.getElementById('screen-edit').hidden, end: !document.getElementById('screen-end').hidden }))()`;
// 버튼·라벨 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만)
const TEXT_FIT = `((sel) => {
  const bad = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.offsetParent) return;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto') bad.push('넘침: ' + el.textContent.trim().slice(0, 30));
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const re = /[^\\s\\u00a0\\u202f\\-–—]+/g; let m;
      while ((m = re.exec(node.data))) {
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff\\uac00-\\ud7af]/.test(m[0])) continue;
        const rg = document.createRange(); rg.setStart(node, m.index); rg.setEnd(node, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map((q) => Math.round(q.top)));
        if (lines.size > 1 && getComputedStyle(el).hyphens !== 'auto') bad.push('단어 잘림: ' + m[0]);
      }
    }
  });
  return bad;
})`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 나만의 유령 만들기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      for (const width of WIDTHS) {
        const tag = `[${lang} ${width}]`;
        const before = problems;
        const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
        const tab = await openTab(width);
        await tab.goto(base + '#nolang');
        await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
        await tab.goto(base);
        if ((await tab.eval('location.pathname')) !== new URL(base).pathname) report(tag, `지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
        await tab.eval(SPY);
        // 1) 시작 화면
        const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0] && !!a[0].offsetParent); })(), faq: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end], #screen-start .gh-opt, #screen-start .gh-face'),
          visAds: [...document.querySelectorAll('.mg-ad:not(.mg-ad-start)')].filter((a) => a.offsetParent).length, visFaq: [...document.querySelectorAll('.mg-faq')].filter((a) => a.offsetParent).length, h1: document.querySelector('h1').textContent.trim() }))()`);
        if (!st.s.start || st.s.edit || st.s.end) report(tag, '시작 화면이 먼저 보이지 않음');
        if (st.ad || st.faq || st.visAds || st.visFaq) report(tag, '시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/부품이 보임');
        if (!st.h1.includes(T.start.h1Kicker)) report(tag, `h1 에 검색어 없음: ${st.h1}`);
        let o = await tab.eval(OVERFLOW); if (o) report(tag, `시작 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.gh-h1, .gh-badge, .gh-btn, .gh-hook')`)).forEach((w) => report(tag, `시작 화면 ${w}`));
        await tab.shot(`${lang}-${width}-1-start.png`);
        // 2) 편집기
        await tab.tap('#start-btn');
        let s = await tab.eval(SHOWN);
        if (!s.edit) report(tag, '시작 버튼 → 편집기가 안 보임');
        if ((await tab.eval(COUNT('start'))) !== 1) report(tag, `track('start') ${await tab.eval(COUNT('start'))}회`);
        const anim = await tab.eval(`getComputedStyle(document.querySelector('#preview-art .gh-float')).animationName`);
        if (anim !== 'gh-float') report(tag, `편집기 유령 둥실둥실 애니메이션 없음 (${anim})`);
        const tabs = await tab.eval(`[...document.querySelectorAll('.gh-tab')].map((t) => t.getAttribute('data-part'))`);
        if (tabs.join(',') !== CORE.PARTS.map((p) => p.id).join(',')) report(tag, `탭 ${tabs.join(',')}`);
        for (const [pi, p] of CORE.PARTS.entries()) {
          await tab.tap(`#tab-${p.id}`);
          const n = await tab.eval(`document.querySelectorAll('#options .gh-opt').length`);
          if (n !== CORE.COUNTS[p.key]) report(tag, `${p.id} 탭 보기 ${n}개 ≠ ${CORE.COUNTS[p.key]}`);
          const pick = (pi + 2) % CORE.COUNTS[p.key];
          const prev = await tab.eval(`document.getElementById('preview-art').innerHTML.length + ':' + window.GHOST_APP.design().${p.key}`);
          await tab.tap(`#options .gh-opt[data-i="${pick}"]`);
          const got = await tab.eval(`window.GHOST_APP.design().${p.key}`);
          if (got !== pick) report(tag, `${p.id} 보기 ${pick} 를 눌렀는데 ${got}`);
          if ((await tab.eval(`document.querySelector('#options .gh-opt[data-i="${pick}"]').getAttribute('aria-pressed')`)) !== 'true') report(tag, `${p.id} 고른 보기 aria-pressed 아님`);
          if (pi === 2) { o = await tab.eval(OVERFLOW); if (o) report(tag, `편집기 가로 넘침 ${o}px`); }
          void prev;
        }
        // 유령을 누르면 지금 탭(배경)의 다음 보기로
        const last = CORE.PARTS[CORE.PARTS.length - 1];
        const x0 = await tab.eval(`window.GHOST_APP.design().${last.key}`);
        await tab.tap('#preview');
        const x1 = await tab.eval(`window.GHOST_APP.design().${last.key}`);
        if (x1 !== (x0 + 1) % CORE.COUNTS[last.key]) report(tag, `유령 누르기: ${last.id} ${x0} → ${x1}`);
        if ((await tab.eval(`document.querySelector('#options .gh-opt[data-i="${x1}"]').getAttribute('aria-pressed')`)) !== 'true') report(tag, '유령 누르기 후 보기 aria-pressed 가 따라오지 않음');
        const beforeRandom = JSON.stringify(await tab.eval(`window.GHOST_APP.design()`));
        let changed = false;
        for (let r = 0; r < 3 && !changed; r++) { await tab.tap('#random-btn'); changed = JSON.stringify(await tab.eval(`window.GHOST_APP.design()`)) !== beforeRandom; }
        if (!changed) report(tag, '랜덤이 디자인을 바꾸지 않음');
        // 이름: 꺾쇠·긴 이름은 정리된다
        const rawName = lang === 'ko' ? '<b>둥실이</b> 꼬마 유령 👻' : lang === 'th' ? '<b>น้องบู๋</b> 👻' : lang === 'ru' ? '<b>Бубу</b> Привидение 👻' : '<b>Little</b> Boo 👻';
        await tab.eval(`document.getElementById('name-input').focus(); 1`);
        await tab.send('Input.insertText', { text: rawName });
        await tab.eval(`document.getElementById('name-input').blur(); 1`);
        const wantName = CORE.cleanName(rawName).slice(0, 40);
        (await tab.eval(TEXT_FIT + `('.gh-btn, .gh-tab, .gh-edit-title, .gh-name-label')`)).forEach((w) => report(tag, `편집기 ${w}`));
        o = await tab.eval(OVERFLOW); if (o) report(tag, `편집기 가로 넘침 ${o}px`);
        const edAds = await tab.eval(`document.querySelectorAll('#screen-edit .mg-ad').length`);
        if (edAds !== 1) report(tag, `편집기 광고 자리 ${edAds}개`);
        await tab.shot(`${lang}-${width}-2-edit.png`);
        // 3) 완성 → 끝 화면
        await tab.tap('#done-btn');
        await sleep(700); // 끝 화면·모의 서버 응답
        s = await tab.eval(SHOWN);
        if (!s.end || s.edit) report(tag, '완성 → 끝 화면이 안 보임');
        if ((await tab.eval(COUNT('done'))) !== 1) report(tag, `track('done') ${await tab.eval(COUNT('done'))}회`);
        const r = await tab.eval(`(() => {
          const end = document.querySelector('[data-mg-end]');
          const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
          const card = document.querySelector('.gh-card');
          return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
            faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
            name: document.getElementById('end-name').textContent, eyebrow: document.getElementById('end-eyebrow').textContent, art: !!document.querySelector('#end-art svg'),
            retry: document.querySelector('.mg-end-retry').textContent, editHidden: document.getElementById('edit-btn').hidden, shown: window.GHOST_APP.shown() };
        })()`);
        const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
        if (r.kids.join(',') !== order.join(',')) report(tag, `끝 화면 순서 ${r.kids.join(' → ')}`);
        if (!r.cardBeforeEnd) report(tag, '결과 카드가 끝 화면보다 위에 있지 않음');
        if (r.faqItems !== T.faq.length || r.shareBtns !== 6) report(tag, `FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
        if (r.name !== wantName || /[<>]/.test(r.name)) report(tag, `끝 화면 이름 "${r.name}" ≠ "${wantName}"`);
        if (r.eyebrow !== T.result.eyebrowMine || !r.art || r.editHidden) report(tag, '끝 화면(만든 사람) 표시가 이상함');
        if (r.retry !== T.result.retry) report(tag, `다시 하기 라벨 "${r.retry}"`);
        o = await tab.eval(OVERFLOW); if (o) report(tag, `끝 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.gh-btn, .gh-eyebrow, .gh-end-name, .mg-end-retry, .mg-end-h')`)).forEach((w) => report(tag, `끝 화면 ${w}`));
        await tab.shot(`${lang}-${width}-3-end.png`);
        // 4) 이미지 저장 (공유 시트 대신 내려받기 경로 — 다운로드는 CDP 로 막아 둠)
        await tab.eval(`(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true }); } catch (e) {} return 1; })()`);
        await tab.tap('#save-btn');
        let img = null;
        for (let i = 0; i < 60 && !img; i++) { await sleep(100); img = await tab.eval(`window.GHOST_APP.lastImage`); }
        await sleep(150);
        const saveStatus = await tab.eval(`document.getElementById('save-status').textContent`);
        if (!img || img.w !== 1080 || img.h !== 1300 || !(img.size > 20000) || img.type !== 'image/png') report(tag, `이미지 저장 실패 ${JSON.stringify(img)}`);
        if (saveStatus !== T.result.saved) report(tag, `저장 상태 "${saveStatus}"`);
        // 5) 공유 링크
        const share = await tab.eval(`window.getShareData()`);
        const hash = (share.url.match(/#d=([A-Za-z0-9_-]+)$/) || [])[1];
        const dec = hash && CORE.decode(hash);
        if (!dec || !CORE.same(dec, r.shown)) report(tag, `공유 링크가 보이는 유령과 다름: ${share.url}`);
        if (/\/(ko|th|ru|ja)\/|_l\//.test(share.url)) report(tag, `공유 링크에 언어 경로: ${share.url}`);
        if (!share.text.includes(wantName)) report(tag, `공유 문구에 이름 없음: ${share.text}`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        // 6) 친구가 링크를 연다 (새 탭)
        const v = await openTab(width);
        await v.goto(base + '#nolang');
        await v.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await v.goto(`${base}#d=${hash}`);
        await v.eval(SPY);
        await sleep(400);
        const f = await v.eval(`(() => ({ s: ${SHOWN}, shown: window.GHOST_APP.shown(), eyebrow: document.getElementById('end-eyebrow').textContent, editHidden: document.getElementById('edit-btn').hidden,
          retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent, name: document.getElementById('end-name').textContent,
          art: ['<path', '<ellipse', '<circle', '<g'].map((t) => document.getElementById('end-art').innerHTML.split(t).length - 1).join(',') }))()`);
        if (!f.s.end || f.s.start || f.s.edit) report(tag, '공유 링크: 끝 화면이 바로 보이지 않음');
        if (!CORE.same(f.shown, r.shown) || f.name !== wantName) report(tag, '공유 링크: 다른 유령이 보임');
        if (f.eyebrow !== T.result.eyebrowFriend || !f.editHidden || f.retry !== T.result.retryFriend) report(tag, `공유 링크: 받은 사람 표시 이상 (${f.eyebrow} / ${f.retry})`);
        const expectArt = CORE.render(r.shown, { prefix: 'end', attrs: ' aria-hidden="true" focusable="false"' });
        const expectCounts = ['<path', '<ellipse', '<circle', '<g'].map((t) => expectArt.split(t).length - 1).join(',');
        if (f.art !== expectCounts) report(tag, `공유 링크: 그림 요소 수가 같은 디자인과 다름 (${f.art} ≠ ${expectCounts})`);
        o = await v.eval(OVERFLOW); if (o) report(tag, `공유 링크 끝 화면 가로 넘침 ${o}px`);
        await v.shot(`${lang}-${width}-4-friend.png`);
        // 움직임 줄이기: 둥실둥실이 멈춘다
        await v.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await sleep(80);
        const still = await v.eval(`getComputedStyle(document.querySelector('#end-art .gh-float')).animationName`);
        if (still !== 'none') report(tag, `prefers-reduced-motion 인데 움직임 (${still})`);
        await v.send('Emulation.setEmulatedMedia', { features: [] });
        await v.tap('[data-mg-end] .mg-end-retry');
        await sleep(200);
        const fr = await v.eval(`(() => ({ s: ${SHOWN}, hash: location.hash, start: ${COUNT('start')}, done: ${COUNT('done')} }))()`);
        if (!fr.s.edit || fr.hash) report(tag, `공유 링크 → 나도 만들기: 편집기 ${fr.s.edit} / 해시 ${fr.hash}`);
        if (fr.start !== 1 || fr.done !== 0) report(tag, `받은 사람 track start ${fr.start} / done ${fr.done}`);
        // 잘못된 링크는 시작 화면
        await v.goto('about:blank');
        await v.goto(`${base}#d=broken!!`);
        const bs = await v.eval(SHOWN);
        if (!bs.start) report(tag, '잘못된 링크인데 시작 화면이 아님');
        v.errors.forEach((e) => report(tag, '콘솔 오류(받은 사람): ' + e));
        await v.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 시작→편집(탭 8·유령 탭·둥실둥실·랜덤·이름)→완성→끝 화면 ${r.kids.join('→')} · 이미지 ${img ? Math.round(img.size / 1024) + 'KB' : '-'} · 공유 링크 ${hash ? hash.length : 0}자 → 같은 유령 · 움직임 줄이기 멈춤`);
      }
    }
  } finally {
    chrome.kill(); mock.kill(); server.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(`\n흐름 ${runs}회, 문제 ${problems}건`);
  if (problems) { console.log('결과: FAIL'); process.exit(1); }
  console.log('결과: PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
