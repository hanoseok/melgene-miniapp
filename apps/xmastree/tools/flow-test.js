#!/usr/bin/env node
/**
 * 크리스마스 트리 꾸미기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server :9193 (apps/xmastree) + tools/mock-supa.js :9194
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref 로 지역 이동 막음, 다운로드는 막아 둠)
 * 언어 × 화면 폭마다:
 *   시작(티징만) → 꾸미기(들어가기만 하면 start 안 셈 → 첫 장식에 track('start'), 탭해서 달기·별·끌어서 옮기기·되돌리기·지우개·자동 꾸미기·
 *   모두 지우기·되돌리기·모양/배경/꼭대기/눈, 전구 반짝임 프레임, 문구 추천·이름·메시지, localStorage) → 완성 → 끝 화면(공통 순서)
 *   → 이미지 저장(1080×1350 PNG) → 공유 링크(#d=) → 계속 꾸미기·다시 완성(done 한 번) → 받은 사람(바로 트리, start/done 안 셈, 나도 꾸미기)
 *   → 잘못된 링크는 시작 화면 → 움직임 줄이기면 이모지·전구·눈 멈춤. 가로 넘침 없음 · 콘솔 오류 0 · 화면 캡처(세 번째 인자 폴더)
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
const CORE = require(path.join(SITE, 'xmastree-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 9193, MOCK_PORT = 9194, CDP_PORT = 9593;
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
  // 트리 canvas 의 그림 좌표(1080×1350) → 화면 좌표
  async canvasPt(sel, x, y) {
    return this.eval(`(() => { const c = document.querySelector(${JSON.stringify(sel)}); const b = c.getBoundingClientRect(); return { x: b.left + ${x} * b.width / 1080, y: b.top + ${y} * b.height / 1350 }; })()`);
  }
  async mouse(type, p) { await this.send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }); }
  async tapAt(sel, x, y) { await this.eval(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({ block: 'center' }); 1`); await sleep(40); const p = await this.canvasPt(sel, x, y); await this.mouse('mousePressed', p); await this.mouse('mouseReleased', p); await sleep(60); }
  async dragAt(sel, x0, y0, x1, y1) {
    await this.eval(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({ block: 'center' }); 1`); await sleep(40);
    const a = await this.canvasPt(sel, x0, y0); const b = await this.canvasPt(sel, x1, y1);
    await this.mouse('mousePressed', a);
    for (let i = 1; i <= 6; i++) await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: a.x + (b.x - a.x) * i / 6, y: a.y + (b.y - a.y) * i / 6, button: 'left', buttons: 1 });
    await this.mouse('mouseReleased', b); await sleep(60);
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

const SET_VALUE = (id, v) => `(() => { const e = document.getElementById(${JSON.stringify(id)}); e.focus(); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const SAMPLE = {
  en: { n: '<b>Sam</b> 🎄', m: 'Merry Christmas from our house to yours!' },
  ko: { n: '<b>지민</b> 🎄', m: '메리 크리스마스! 따뜻한 연말 보내세요' },
  th: { n: 'มายด์ 🎄', m: 'สุขสันต์วันคริสต์มาสนะ ขอให้มีความสุขมากๆ' },
  ru: { n: '<b>Маша</b> 🎄', m: 'С Новым годом! Пусть сбудется всё задуманное' },
};
const sample = (lang) => SAMPLE[lang] || { n: 'Léa 🎄', m: L10N[lang].editor.presets[0] };
const APP = (expr) => `window.XTREE_APP.${expr}`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'xt-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 크리스마스 트리 꾸미기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    for (const lang of LANGS) {
      const T = L10N[lang];
      const S = sample(lang);
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
        const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0] && !!a[0].offsetParent); })(), extra: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end], #screen-start .xt-kind, #screen-start input, #screen-start canvas'),
          visAds: [...document.querySelectorAll('.mg-ad:not(.mg-ad-start)')].filter((a) => a.offsetParent).length, visFaq: [...document.querySelectorAll('.mg-faq')].filter((a) => a.offsetParent).length, h1: document.querySelector('h1').textContent.trim() }))()`);
        if (!st.s.start || st.s.edit || st.s.end) report(tag, '시작 화면이 먼저 보이지 않음');
        if (st.ad || st.extra || st.visAds || st.visFaq) report(tag, '시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/도구가 보임');
        if (!st.h1.includes(T.start.h1Kicker)) report(tag, `h1 에 검색어 없음: ${st.h1}`);
        let o = await tab.eval(OVERFLOW); if (o) report(tag, `시작 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.xt-h1, .xt-badge, .xt-btn, .xt-hook')`)).forEach((w) => report(tag, `시작 화면 ${w}`));
        if ((await tab.eval(`getComputedStyle(document.querySelector('.xt-hero-tree')).animationName`)) !== 'xt-bob') report(tag, '시작 화면 이모지 움직임 없음');
        await tab.shot(`${lang}-${width}-1-start.png`);
        // 2) 꾸미기 화면 — 들어가기만 해서는 start 안 셈
        await tab.tap('#start-btn');
        if (!(await tab.eval(SHOWN)).edit) report(tag, '시작 버튼 → 꾸미기 화면이 안 보임');
        if ((await tab.eval(COUNT('start'))) !== 0) report(tag, '꾸미기 전에 track(start)');
        const init = await tab.eval(APP('tree()'));
        if (init.p.length || init.s || init.b || init.t !== 1 || init.f !== 3) report(tag, `처음 트리 ${JSON.stringify(init)}`);
        // 장식 달기 (빨간 공) → start 1회
        await tab.tapAt('#tree-canvas', 540, 600);
        let tr = await tab.eval(APP('tree()'));
        if (tr.p.length !== 1 || tr.p[0].k !== 0 || Math.abs(tr.p[0].x - 540) > 8 || Math.abs(tr.p[0].y - 600) > 8) report(tag, `탭해서 장식 달기 실패 ${JSON.stringify(tr.p)}`);
        if ((await tab.eval(COUNT('start'))) !== 1) report(tag, `첫 장식에 track('start') ${await tab.eval(COUNT('start'))}회`);
        // 별 고르고 달기
        await tab.tap('.xt-kind[data-k="5"]');
        await tab.tapAt('#tree-canvas', 420, 820);
        tr = await tab.eval(APP('tree()'));
        if (tr.p.length !== 2 || tr.p[1].k !== 5) report(tag, `별 달기 실패 ${JSON.stringify(tr.p)}`);
        // 끌어서 옮기기 → 되돌리기
        await tab.dragAt('#tree-canvas', 540, 600, 640, 700);
        tr = await tab.eval(APP('tree()'));
        const moved = tr.p.find((q) => q.k === 0);
        if (!moved || Math.abs(moved.x - 640) > 10 || Math.abs(moved.y - 700) > 10 || tr.p.length !== 2) report(tag, `끌어서 옮기기 실패 ${JSON.stringify(tr.p)}`);
        await tab.tap('#undo-btn');
        tr = await tab.eval(APP('tree()'));
        if (!tr.p.some((q) => q.k === 0 && q.x === 540 && q.y === 600)) report(tag, `되돌리기 실패 ${JSON.stringify(tr.p)}`);
        // 지우개
        await tab.tap('.xt-kind[data-k="-1"]');
        await tab.tapAt('#tree-canvas', 420, 820);
        tr = await tab.eval(APP('tree()'));
        if (tr.p.length !== 1 || tr.p.some((q) => q.k === 5)) report(tag, `지우개 실패 ${JSON.stringify(tr.p)}`);
        // 자동 꾸미기 · 모두 지우기 · 되돌리기
        await tab.tap('#auto-btn');
        const nAuto = (await tab.eval(APP('tree().p.length')));
        if (nAuto < 12) report(tag, `자동 꾸미기 ${nAuto}개`);
        await tab.tap('#clear-btn');
        if ((await tab.eval(APP('tree().p.length'))) !== 0) report(tag, '모두 지우기 실패');
        await tab.tap('#undo-btn');
        if ((await tab.eval(APP('tree().p.length'))) !== nAuto) report(tag, '모두 지우기 되돌리기 실패');
        const countTxt = await tab.eval(`document.getElementById('orn-count').textContent`);
        if (countTxt !== T.editor.count.replace('{n}', nAuto).replace('{max}', CORE.LIMITS.orn)) report(tag, `장식 개수 표시 "${countTxt}"`);
        // 모양·배경·꼭대기·눈·전구
        await tab.tap('.xt-style[data-s="2"]');
        await tab.tap('.xt-bg[data-b="1"]');
        await tab.tap('.xt-topper[data-t="2"]');
        await tab.tap('.xt-flag[data-bit="1"]');
        tr = await tab.eval(APP('tree()'));
        if (tr.s !== 2 || tr.b !== 1 || tr.t !== 2 || tr.f !== 2 || tr.p.length !== nAuto) report(tag, `모양/배경/꼭대기/눈 바꾸기 ${JSON.stringify({ s: tr.s, b: tr.b, t: tr.t, f: tr.f, n: tr.p.length })}`);
        // 전구 반짝임 = 그림이 계속 다시 그려짐
        const f0 = await tab.eval(APP('frames()'));
        await sleep(600);
        const f1 = await tab.eval(APP('frames()'));
        if (!(f1 - f0 >= 5)) report(tag, `전구 반짝임 움직임 없음 (프레임 ${f1 - f0})`);
        // 이름·메시지·추천 문구
        await tab.tap('#idea-btn');
        if ((await tab.eval(`document.getElementById('f-msg').value`)) !== T.editor.presets[0]) report(tag, '문구 추천이 첫 예시가 아님');
        await tab.eval(SET_VALUE('f-name', S.n));
        await tab.eval(SET_VALUE('f-msg', S.m));
        await tab.eval(`document.getElementById('f-name').blur(); document.getElementById('f-msg').blur(); 1`);
        await sleep(200);
        const want = { n: CORE.cleanText(S.n, CORE.LIMITS.n), m: CORE.cleanText(S.m, CORE.LIMITS.m) };
        tr = await tab.eval(APP('tree()'));
        if (tr.n !== want.n || tr.m !== want.m) report(tag, `입력이 상태에 안 들어감 ${tr.n} / ${tr.m}`);
        const draft = await tab.eval(`JSON.parse(localStorage.getItem('xmastree_draft') || 'null')`);
        if (!draft || draft.m !== want.m || draft.p.length !== nAuto) report(tag, '꾸미던 트리가 localStorage 에 없음');
        (await tab.eval(TEXT_FIT + `('.xt-btn, .xt-chip, .xt-flag, .xt-tool, .xt-idea, .xt-edit-title, .xt-label')`)).forEach((w) => report(tag, `꾸미기 ${w}`));
        o = await tab.eval(OVERFLOW); if (o) report(tag, `꾸미기 화면 가로 넘침 ${o}px`);
        if ((await tab.eval(`document.querySelectorAll('#screen-edit .mg-ad').length`)) !== 1) report(tag, '꾸미기 광고 자리가 1개가 아님');
        await tab.shot(`${lang}-${width}-2-edit.png`);
        // 3) 완성 → 끝 화면
        await tab.tap('#done-btn');
        await sleep(600);
        if (!(await tab.eval(SHOWN)).end) report(tag, '완성 → 끝 화면이 안 보임');
        if ((await tab.eval(COUNT('start'))) !== 1 || (await tab.eval(COUNT('done'))) !== 1) report(tag, `track start ${await tab.eval(COUNT('start'))} / done ${await tab.eval(COUNT('done'))}`);
        const r = await tab.eval(`(() => {
          const end = document.querySelector('[data-mg-end]');
          const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
          const card = document.querySelector('.xt-card');
          return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
            faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
            eyebrow: document.getElementById('end-eyebrow').textContent, retry: document.querySelector('.mg-end-retry').textContent, editHidden: document.getElementById('edit-btn').hidden, shown: window.XTREE_APP.shown() };
        })()`);
        if (r.kids.join(',') !== 'rating,ad,share,faq,retry,more') report(tag, `끝 화면 순서 ${r.kids.join(' → ')}`);
        if (!r.cardBeforeEnd) report(tag, '결과 트리가 끝 화면보다 위에 있지 않음');
        if (r.faqItems !== T.faq.length || r.shareBtns !== 6) report(tag, `FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
        if (r.eyebrow !== T.result.eyebrowMine || r.editHidden || r.retry !== T.result.retry) report(tag, '끝 화면(만든 사람) 표시가 이상함');
        if (!CORE.same(r.shown, tr)) report(tag, '끝 화면 트리가 꾸민 트리와 다름');
        o = await tab.eval(OVERFLOW); if (o) report(tag, `끝 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.xt-btn, .xt-eyebrow, .mg-end-retry')`)).forEach((w) => report(tag, `끝 화면 ${w}`));
        await tab.shot(`${lang}-${width}-3-end.png`);
        // 4) 이미지 저장
        await tab.eval(`(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true }); } catch (e) {} return 1; })()`);
        await tab.tap('#save-btn');
        let img = null;
        for (let i = 0; i < 60 && !img; i++) { await sleep(100); img = await tab.eval(APP('lastImage')); }
        if (!img || img.w !== 1080 || img.h !== 1350 || !(img.size > 30000) || img.type !== 'image/png') report(tag, `이미지 저장 실패 ${JSON.stringify(img)}`);
        await sleep(150);
        if ((await tab.eval(`document.getElementById('save-status').textContent`)) !== T.result.saved) report(tag, '저장 상태 문구');
        // 5) 공유 링크
        const share = await tab.eval(`window.getShareData()`);
        const hash = (share.url.match(/#d=([A-Za-z0-9_-]+)$/) || [])[1];
        const dec = hash && CORE.decode(hash);
        if (!dec || !CORE.same(dec, r.shown)) report(tag, `공유 링크가 보이는 트리와 다름: ${share.url}`);
        if (/\/(ko|th|ru|ja)\/|_l\//.test(share.url)) report(tag, `공유 링크에 언어 경로: ${share.url}`);
        if (!share.text.includes(want.n)) report(tag, `공유 문구에 이름 없음: ${share.text}`);
        const log = await mockRpc('__log').catch(() => '');
        if (log && log.includes(want.m.slice(0, 10))) report(tag, '메시지 내용이 서버(모의)로 전송됨');
        // 계속 꾸미기 → 다시 완성해도 done 은 한 번
        await tab.tap('#edit-btn');
        if (!(await tab.eval(SHOWN)).edit || (await tab.eval(APP('tree().p.length'))) !== nAuto) report(tag, '계속 꾸미기 실패');
        await tab.tap('#done-btn');
        if ((await tab.eval(COUNT('done'))) !== 1) report(tag, '다시 완성했더니 track(done) 이 또 셈');
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        // 6) 받은 사람
        const v = await openTab(width);
        await v.goto(base + '#nolang');
        await v.eval(`localStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await v.goto(`${base}#d=${hash}`);
        await v.eval(SPY);
        await sleep(400);
        const fv = await v.eval(`(() => ({ s: ${SHOWN}, shown: window.XTREE_APP.shown(), eyebrow: document.getElementById('end-eyebrow').textContent, editHidden: document.getElementById('edit-btn').hidden, retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent }))()`);
        if (!fv.s.end) report(tag, '공유 링크: 트리가 바로 보이지 않음');
        if (!CORE.same(fv.shown, r.shown)) report(tag, '공유 링크: 다른 트리가 보임');
        if (fv.eyebrow !== T.result.eyebrowFriend.replace('{name}', want.n) || !fv.editHidden || fv.retry !== T.result.retryFriend) report(tag, `공유 링크: 받은 사람 표시 이상 (${fv.eyebrow} / ${fv.retry})`);
        const g0 = await v.eval(APP('frames()')); await sleep(500);
        if (!((await v.eval(APP('frames()'))) - g0 >= 5)) report(tag, '공유 링크: 전구 반짝임 없음');
        o = await v.eval(OVERFLOW); if (o) report(tag, `공유 링크 가로 넘침 ${o}px`);
        await v.shot(`${lang}-${width}-4-friend.png`);
        await v.tap('[data-mg-end] .mg-end-retry');
        await sleep(200);
        const fr = await v.eval(`(() => ({ s: ${SHOWN}, hash: location.hash, start: ${COUNT('start')}, done: ${COUNT('done')}, d: window.XTREE_APP.tree() }))()`);
        if (!fr.s.edit || fr.hash) report(tag, `나도 꾸미기: 꾸미기 화면 ${fr.s.edit} / 해시 ${fr.hash}`);
        if (fr.start !== 0 || fr.done !== 0) report(tag, `받은 사람 track start ${fr.start} / done ${fr.done}`);
        if (fr.d.p.length || fr.d.m) report(tag, '나도 꾸미기: 새 트리가 아님');
        // 잘못된 링크 · 움직임 줄이기
        await v.goto('about:blank');
        await v.goto(`${base}#d=broken!!`);
        if (!(await v.eval(SHOWN)).start) report(tag, '잘못된 링크인데 시작 화면이 아님');
        await v.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await v.goto('about:blank');
        await v.goto(`${base}#d=${hash}`);
        await sleep(400);
        if ((await v.eval(`getComputedStyle(document.querySelector('.xt-hero-tree')).animationName`)) !== 'none') report(tag, 'prefers-reduced-motion 인데 시작 화면 이모지 움직임');
        const h0 = await v.eval(APP('frames()')); await sleep(500);
        if ((await v.eval(APP('frames()'))) - h0 > 1) report(tag, 'prefers-reduced-motion 인데 전구·눈이 움직임');
        v.errors.forEach((e) => report(tag, '콘솔 오류(받은 사람): ' + e));
        await v.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 시작→꾸미기(탭·별·끌기·되돌리기·지우개·자동 ${nAuto}개·모두 지우기·모양/배경/꼭대기/눈·반짝임·이름·메시지)→끝 화면 ${r.kids.join('→')} · 이미지 ${img ? Math.round(img.size / 1024) + 'KB' : '-'} · 공유 링크 ${hash ? hash.length : 0}자 → 받은 사람(start/done 안 셈) · 움직임 줄이기`);
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
