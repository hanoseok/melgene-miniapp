#!/usr/bin/env node
/**
 * 할로윈 파티 초대장 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server :8771 (apps/invite) + tools/mock-supa.js :8772
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref 로 지역 이동 막음, 다운로드는 막아 둠)
 * 언어 × 화면 폭마다:
 *   시작(티징만: 광고 맨 끝 1개·FAQ·입력 칸 없음) → 편집기(테마 5개 모두 눌러 미리보기 바뀜, 이름·날짜·시간·장소·한마디 입력, canvas 에 글이 그려짐) → 완성
 *   → 끝 화면(결과 카드 → 공통 끝 화면: 별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   → 이미지 저장(1080×1500 PNG, 예외 없음) → 텍스트 복사(그 언어 날짜·시간 서식 + 장소 + 링크) → 공유 링크(#d=)를 새 탭으로 열면 같은 초대장 + "나도 만들기"(start/done 안 셈) → 편집기
 *   · 시작 화면 이모지 움직임은 prefers-reduced-motion: reduce 이면 멈춘다
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
const CORE = require(path.join(SITE, 'invite-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8771, MOCK_PORT = 8772, CDP_PORT = 9471;
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

// 화면 맨 위 canvas 에 밝은 글자 픽셀이 있는지 (글이 그려졌는지) — 글 영역 y 520~1300
const CANVAS_TEXT = (sel) => `(() => { const c = document.querySelector(${JSON.stringify(sel)}); if (!c) return -1; const x = c.getContext('2d'); const d = x.getImageData(150, 520, 780, 780).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 180) n++; return n; })()`;
const CANVAS_SUM = (sel) => `(() => { const c = document.querySelector(${JSON.stringify(sel)}); const x = c.getContext('2d'); const d = x.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) | 0; return h; })()`;
const fmtDate = (lang, d) => { const p = d.split('-'); return new Intl.DateTimeFormat((lang === 'pt' ? 'pt-BR' : lang) + '-u-ca-gregory', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(+p[0], +p[1] - 1, +p[2], 12)); };
const fmtTime = (lang, h) => { const p = h.split(':'); return new Intl.DateTimeFormat((lang === 'pt' ? 'pt-BR' : lang) + '-u-ca-gregory', { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, +p[0], +p[1])); };
const SET_VALUE = (id, v) => `(() => { const e = document.getElementById(${JSON.stringify(id)}); e.focus(); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); return 1; })()`;

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'iv-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 할로윈 파티 초대장 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
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
        const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0] && !!a[0].offsetParent); })(), extra: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end], #screen-start .iv-theme, #screen-start input, #screen-start canvas'),
          visAds: [...document.querySelectorAll('.mg-ad:not(.mg-ad-start)')].filter((a) => a.offsetParent).length, visFaq: [...document.querySelectorAll('.mg-faq')].filter((a) => a.offsetParent).length, h1: document.querySelector('h1').textContent.trim() }))()`);
        if (!st.s.start || st.s.edit || st.s.end) report(tag, '시작 화면이 먼저 보이지 않음');
        if (st.ad || st.extra || st.visAds || st.visFaq) report(tag, '시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/입력 칸/테마가 보임');
        if (!st.h1.includes(T.start.h1Kicker)) report(tag, `h1 에 검색어 없음: ${st.h1}`);
        let o = await tab.eval(OVERFLOW); if (o) report(tag, `시작 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.iv-h1, .iv-badge, .iv-btn, .iv-hook')`)).forEach((w) => report(tag, `시작 화면 ${w}`));
        const anim = await tab.eval(`getComputedStyle(document.querySelector('.iv-hero-env')).animationName`);
        if (anim !== 'iv-bob') report(tag, `시작 화면 이모지 움직임 없음 (${anim})`);
        await tab.shot(`${lang}-${width}-1-start.png`);
        // 2) 편집기
        await tab.tap('#start-btn');
        let s = await tab.eval(SHOWN);
        if (!s.edit) report(tag, '시작 버튼 → 편집기가 안 보임');
        if ((await tab.eval(COUNT('start'))) !== 1) report(tag, `track('start') ${await tab.eval(COUNT('start'))}회`);
        const init = await tab.eval(`(() => ({ d: document.getElementById('f-date').value, h: document.getElementById('f-time').value, t: document.getElementById('f-title').value }))()`);
        if (!/^\d{4}-10-31$/.test(init.d) || init.h !== '19:00' || init.t !== '') report(tag, `편집기 처음 값 ${JSON.stringify(init)}`);
        await sleep(200);
        const themeBtns = await tab.eval(`[...document.querySelectorAll('.iv-theme')].length`);
        if (themeBtns !== CORE.THEMES.length) report(tag, `테마 버튼 ${themeBtns}개`);
        const sums = new Set();
        for (let ti = 0; ti < CORE.THEMES.length; ti++) {
          await tab.tap(`.iv-theme[data-t="${ti}"]`);
          await sleep(120);
          const got = await tab.eval(`window.INVITE_APP.invite().t`);
          if (got !== ti) report(tag, `테마 ${ti} 를 눌렀는데 ${got}`);
          if ((await tab.eval(`document.querySelector('.iv-theme[data-t="${ti}"]').getAttribute('aria-checked')`)) !== 'true' || (await tab.eval(`document.querySelectorAll('.iv-theme[aria-checked="true"]').length`)) !== 1) report(tag, `테마 ${ti} aria-checked 이상`);
          sums.add(await tab.eval(CANVAS_SUM('#preview-canvas')));
        }
        if (sums.size !== CORE.THEMES.length) report(tag, `테마마다 미리보기 그림이 달라야 함 (${sums.size}/${CORE.THEMES.length})`);
        // 입력: 꺾쇠·긴 글은 정리된다
        const title = lang === 'ko' ? '<b>유령의 집</b> 파티 🎃' : lang === 'th' ? '<b>ปาร์ตี้บ้านผีสิง</b> 🎃' : lang === 'ru' ? '<b>Вечеринка</b> в доме призраков 🎃' : '<b>Haunted</b> House Party 🎃';
        const place = lang === 'ko' ? '우리 집 3층 거실' : lang === 'th' ? 'บ้านฉัน ชั้น 3' : lang === 'ru' ? 'У меня дома, 3 этаж' : 'My place, 3rd floor';
        const note = lang === 'ko' ? '코스튬 필수!' : lang === 'th' ? 'แต่งคอสตูมมาด้วยนะ!' : lang === 'ru' ? 'Приходи в костюме!' : 'Costumes encouraged!';
        await tab.eval(SET_VALUE('f-title', title));
        await tab.eval(SET_VALUE('f-date', '2026-10-31'));
        await tab.eval(SET_VALUE('f-time', '19:30'));
        await tab.eval(SET_VALUE('f-place', place));
        await tab.eval(SET_VALUE('f-note', note));
        await tab.eval(`document.getElementById('f-note').blur(); document.getElementById('f-title').blur(); 1`);
        await sleep(250);
        const wantTitle = CORE.cleanText(title, CORE.LIMITS.n);
        const cur = await tab.eval(`window.INVITE_APP.invite()`);
        if (cur.n !== wantTitle || cur.d !== '2026-10-31' || cur.h !== '19:30' || cur.p !== place || cur.m !== note) report(tag, `입력이 상태에 안 들어감 ${JSON.stringify(cur)}`);
        if ((await tab.eval(`document.getElementById('f-title').value`)) !== wantTitle) report(tag, '제목 칸이 blur 때 정리되지 않음');
        const px = await tab.eval(CANVAS_TEXT('#preview-canvas'));
        if (!(px > 3000)) report(tag, `미리보기 canvas 에 글이 그려지지 않음 (밝은 픽셀 ${px})`);
        (await tab.eval(TEXT_FIT + `('.iv-btn, .iv-theme, .iv-edit-title, .iv-label')`)).forEach((w) => report(tag, `편집기 ${w}`));
        o = await tab.eval(OVERFLOW); if (o) report(tag, `편집기 가로 넘침 ${o}px`);
        const prevW = await tab.eval(`document.getElementById('preview-canvas').getBoundingClientRect().width`);
        if (!(prevW > 150 && prevW <= 280)) report(tag, `미리보기 폭 ${prevW}`);
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
          const card = document.querySelector('.iv-card');
          return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
            faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
            title: document.getElementById('end-title').textContent, eyebrow: document.getElementById('end-eyebrow').textContent, label: document.getElementById('end-canvas').getAttribute('aria-label'),
            retry: document.querySelector('.mg-end-retry').textContent, editHidden: document.getElementById('edit-btn').hidden, shown: window.INVITE_APP.shown() };
        })()`);
        const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
        if (r.kids.join(',') !== order.join(',')) report(tag, `끝 화면 순서 ${r.kids.join(' → ')}`);
        if (!r.cardBeforeEnd) report(tag, '결과 카드가 끝 화면보다 위에 있지 않음');
        if (r.faqItems !== T.faq.length || r.shareBtns !== 6) report(tag, `FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
        if (r.title !== wantTitle || /[<>]/.test(r.title)) report(tag, `끝 화면 제목 "${r.title}" ≠ "${wantTitle}"`);
        if (r.eyebrow !== T.result.eyebrowMine || r.editHidden) report(tag, '끝 화면(만든 사람) 표시가 이상함');
        if (!r.label || !r.label.includes(wantTitle)) report(tag, `끝 canvas aria-label "${r.label}"`);
        if (r.retry !== T.result.retry) report(tag, `다시 하기 라벨 "${r.retry}"`);
        const endPx = await tab.eval(CANVAS_TEXT('#end-canvas'));
        if (!(endPx > 3000)) report(tag, `끝 화면 canvas 에 글이 그려지지 않음 (${endPx})`);
        o = await tab.eval(OVERFLOW); if (o) report(tag, `끝 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.iv-btn, .iv-eyebrow, .mg-end-retry, .mg-end-h')`)).forEach((w) => report(tag, `끝 화면 ${w}`));
        await tab.shot(`${lang}-${width}-3-end.png`);
        // 4) 이미지 저장 (공유 시트 대신 내려받기 경로 — 다운로드는 CDP 로 막아 둠)
        await tab.eval(`(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true }); } catch (e) {} return 1; })()`);
        await tab.tap('#save-btn');
        let img = null;
        for (let i = 0; i < 60 && !img; i++) { await sleep(100); img = await tab.eval(`window.INVITE_APP.lastImage`); }
        await sleep(150);
        const saveStatus = await tab.eval(`document.getElementById('save-status').textContent`);
        if (!img || img.w !== 1080 || img.h !== 1500 || !(img.size > 30000) || img.type !== 'image/png') report(tag, `이미지 저장 실패 ${JSON.stringify(img)}`);
        if (saveStatus !== T.result.saved) report(tag, `저장 상태 "${saveStatus}"`);
        // 5) 텍스트 복사 (클립보드는 가짜로 바꿔 내용을 읽는다)
        await tab.eval(`(() => { window.__clip = null; try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__clip = t; return Promise.resolve(); } }, configurable: true }); } catch (e) {} return 1; })()`);
        await tab.tap('#copy-btn');
        await sleep(200);
        const clip = await tab.eval(`window.__clip`);
        const copyStatus = await tab.eval(`document.getElementById('save-status').textContent`);
        const wantLines = [wantTitle, `📅 ${fmtDate(lang, '2026-10-31')}`, `🕖 ${fmtTime(lang, '19:30')}`, `📍 ${place}`, note];
        if (!clip || !wantLines.every((l) => clip.includes(l))) report(tag, `복사한 텍스트에 제목·날짜·시간·장소·한마디가 없음: ${JSON.stringify(clip)}`);
        if (clip && !/#d=[A-Za-z0-9_-]+$/.test(clip)) report(tag, '복사한 텍스트 끝에 공유 링크가 없음');
        if (copyStatus !== T.result.copied) report(tag, `복사 상태 "${copyStatus}"`);
        // 6) 공유 링크
        const share = await tab.eval(`window.getShareData()`);
        const hash = (share.url.match(/#d=([A-Za-z0-9_-]+)$/) || [])[1];
        const dec = hash && CORE.decode(hash);
        if (!dec || !CORE.same(dec, r.shown)) report(tag, `공유 링크가 보이는 초대장과 다름: ${share.url}`);
        if (/\/(ko|th|ru|ja)\/|_l\//.test(share.url)) report(tag, `공유 링크에 언어 경로: ${share.url}`);
        if (!share.text.includes(wantTitle)) report(tag, `공유 문구에 제목 없음: ${share.text}`);
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        // 7) 친구가 링크를 연다 (새 탭)
        const v = await openTab(width);
        await v.goto(base + '#nolang');
        await v.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await v.goto(`${base}#d=${hash}`);
        await v.eval(SPY);
        await sleep(500);
        const f = await v.eval(`(() => ({ s: ${SHOWN}, shown: window.INVITE_APP.shown(), eyebrow: document.getElementById('end-eyebrow').textContent, editHidden: document.getElementById('edit-btn').hidden,
          retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent, title: document.getElementById('end-title').textContent }))()`);
        if (!f.s.end || f.s.start || f.s.edit) report(tag, '공유 링크: 끝 화면이 바로 보이지 않음');
        if (!CORE.same(f.shown, r.shown) || f.title !== wantTitle) report(tag, '공유 링크: 다른 초대장이 보임');
        if (f.eyebrow !== T.result.eyebrowFriend || !f.editHidden || f.retry !== T.result.retryFriend) report(tag, `공유 링크: 받은 사람 표시 이상 (${f.eyebrow} / ${f.retry})`);
        const fpx = await v.eval(CANVAS_TEXT('#end-canvas'));
        if (!(fpx > 3000)) report(tag, `공유 링크: canvas 에 글이 그려지지 않음 (${fpx})`);
        // 같은 초대장이면 같은 그림 (보낸 사람 끝 화면 canvas 와 비교하려면 같은 탭이 필요 → 받은 쪽에서 그림 해시가 항상 같은지만 확인)
        const h1 = await v.eval(CANVAS_SUM('#end-canvas'));
        await v.eval(`document.fonts.ready.then(() => 1)`);
        await sleep(200);
        const h2 = await v.eval(CANVAS_SUM('#end-canvas'));
        if (h1 !== h2) report(tag, '공유 링크: 글꼴 로딩 뒤 그림이 바뀜(안정되지 않음)');
        if ((await v.eval(COUNT('start'))) !== 0 || (await v.eval(COUNT('done'))) !== 0) report(tag, `공유 링크로 열었는데 track start ${await v.eval(COUNT('start'))} / done ${await v.eval(COUNT('done'))}`);
        o = await v.eval(OVERFLOW); if (o) report(tag, `공유 링크 끝 화면 가로 넘침 ${o}px`);
        await v.shot(`${lang}-${width}-4-friend.png`);
        // 움직임 줄이기: 시작 화면 이모지 움직임 멈춤 (시작 화면은 "나도 만들기" 뒤에 안 보이므로 새로 연 시작 화면에서 확인)
        await v.tap('[data-mg-end] .mg-end-retry');
        await sleep(200);
        const fr = await v.eval(`(() => ({ s: ${SHOWN}, hash: location.hash, start: ${COUNT('start')}, done: ${COUNT('done')}, d: window.INVITE_APP.invite() }))()`);
        if (!fr.s.edit || fr.hash) report(tag, `공유 링크 → 나도 만들기: 편집기 ${fr.s.edit} / 해시 ${fr.hash}`);
        if (fr.start !== 1 || fr.done !== 0) report(tag, `받은 사람 track start ${fr.start} / done ${fr.done}`);
        if (fr.d.n !== '' || fr.d.t !== 0) report(tag, `나도 만들기: 새 초대장이 아님 ${JSON.stringify(fr.d)}`);
        // 잘못된 링크는 시작 화면 + 움직임 줄이기
        await v.goto('about:blank');
        await v.goto(`${base}#d=broken!!`);
        const bs = await v.eval(SHOWN);
        if (!bs.start) report(tag, '잘못된 링크인데 시작 화면이 아님');
        await v.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await sleep(80);
        const still = await v.eval(`getComputedStyle(document.querySelector('.iv-hero-env')).animationName`);
        if (still !== 'none') report(tag, `prefers-reduced-motion 인데 움직임 (${still})`);
        v.errors.forEach((e) => report(tag, '콘솔 오류(받은 사람): ' + e));
        await v.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 시작→편집(테마 ${CORE.THEMES.length}·입력·canvas)→완성→끝 화면 ${r.kids.join('→')} · 이미지 ${img ? Math.round(img.size / 1024) + 'KB' : '-'} · 텍스트 복사 · 공유 링크 ${hash ? hash.length : 0}자 → 같은 초대장(start/done 안 셈) · 움직임 줄이기 멈춤`);
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
