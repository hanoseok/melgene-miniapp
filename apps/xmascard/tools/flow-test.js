#!/usr/bin/env node
/**
 * 크리스마스 카드 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server :9191 (apps/xmascard) + tools/mock-supa.js :9192
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref 로 지역 이동 막음, 다운로드는 막아 둠)
 * 언어 × 화면 폭마다:
 *   시작(티징만: 광고 맨 끝 1개·FAQ·입력 칸 없음) → 편집기(테마 6개 모두 눌러 미리보기 바뀜, 인사말·장식 바꿈, 받는 사람·보내는 사람·메시지 입력,
 *   문구 추천, 글자 수, canvas 에 글이 그려짐, 쓰던 카드 localStorage) → 완성
 *   → 끝 화면(결과 카드 → 공통 끝 화면: 별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   → 이미지 저장(1080×1350 PNG) → 텍스트 복사(인사말·이름·메시지 + 링크) → 공유 링크(#d=)를 새 탭으로 열면
 *   봉투 화면 → 열기 → 같은 카드 + "나도 만들기"(start/done 안 셈) → 편집기
 *   · 움직임 줄이기면 시작 화면 이모지·봉투가 멈추고 봉투는 바로 열린다
 *   · track('start')·track('done') 한 번씩 · 가로 넘침 없음 · 콘솔 오류 0 · 화면 캡처(세 번째 인자 폴더)
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
const CORE = require(path.join(SITE, 'xmascard-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 9191, MOCK_PORT = 9192, CDP_PORT = 9591;
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
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, edit: !document.getElementById('screen-edit').hidden, open: !document.getElementById('screen-open').hidden, end: !document.getElementById('screen-end').hidden }))()`;
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

// canvas 글 영역(y 560~1180)에 배경과 다른 픽셀이 얼마나 있는지 (글이 그려졌는지) — 테마 무관
const CANVAS_TEXT = (sel) => `(() => { const c = document.querySelector(${JSON.stringify(sel)}); if (!c) return -1; const x = c.getContext('2d'); const d = x.getImageData(140, 560, 800, 620).data; const r0 = d[0], g0 = d[1], b0 = d[2]; let n = 0; for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - r0) + Math.abs(d[i + 1] - g0) + Math.abs(d[i + 2] - b0) > 160) n++; return n; })()`;
const CANVAS_SUM = (sel) => `(() => { const c = document.querySelector(${JSON.stringify(sel)}); const x = c.getContext('2d'); const d = x.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) | 0; return h; })()`;
const SET_VALUE = (id, v) => `(() => { const e = document.getElementById(${JSON.stringify(id)}); e.focus(); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const SAMPLE = {
  en: { to: '<b>Grandma</b> Rose', fr: 'Sam 🎄', m: 'Wishing you a cozy Christmas full of laughter, cocoa and the people you love most. See you soon!' },
  ko: { to: '<b>할머니</b>', fr: '지민 🎄', m: '올 한 해 정말 고마웠어요. 따뜻하고 행복한 크리스마스 보내시고 내년에도 건강하세요!' },
  ja: { to: 'おばあちゃん', fr: 'ゆい 🎄', m: '今年もたくさんありがとう。あったかくて楽しいクリスマスを過ごしてね！また遊びに行くね。' },
  zh: { to: '妈妈', fr: '小雨 🎄', m: '谢谢你这一年的陪伴，祝你圣诞快乐，天天开心，新的一年万事如意！' },
  th: { to: '<b>คุณแม่</b>', fr: 'มายด์ 🎄', m: 'ขอบคุณที่อยู่ข้างกันมาตลอดปี ขอให้คริสต์มาสนี้อบอุ่นและมีแต่รอยยิ้มนะ' },
  ru: { to: '<b>Бабушка</b>', fr: 'Маша 🎄', m: 'Пусть Новый год принесёт тебе тепло, здоровье и много поводов для улыбки. Скорее бы увидеться!' },
  vi: { to: 'Mẹ yêu', fr: 'Minh Anh 🎄', m: 'Chúc mẹ Giáng sinh thật ấm áp, luôn khỏe mạnh và vui vẻ bên cả nhà nhé!' },
};
const sample = (lang) => SAMPLE[lang] || { to: 'Rosa', fr: 'Léa 🎄', m: L10N[lang].editor.presets[0] };

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'xc-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => { problems++; console.log(`  ✗ ${tag} ${msg}`); };
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
        console.log(`\n=== 크리스마스 카드 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
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
        const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0] && !!a[0].offsetParent); })(), extra: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end], #screen-start .xc-theme, #screen-start input, #screen-start textarea, #screen-start canvas'),
          visAds: [...document.querySelectorAll('.mg-ad:not(.mg-ad-start)')].filter((a) => a.offsetParent).length, visFaq: [...document.querySelectorAll('.mg-faq')].filter((a) => a.offsetParent).length, h1: document.querySelector('h1').textContent.trim() }))()`);
        if (!st.s.start || st.s.edit || st.s.end || st.s.open) report(tag, '시작 화면이 먼저 보이지 않음');
        if (st.ad || st.extra || st.visAds || st.visFaq) report(tag, '시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/입력 칸/테마가 보임');
        if (!st.h1.includes(T.start.h1Kicker)) report(tag, `h1 에 검색어 없음: ${st.h1}`);
        let o = await tab.eval(OVERFLOW); if (o) report(tag, `시작 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.xc-h1, .xc-badge, .xc-btn, .xc-hook')`)).forEach((w) => report(tag, `시작 화면 ${w}`));
        const anim = await tab.eval(`getComputedStyle(document.querySelector('.xc-hero-tree')).animationName`);
        if (anim !== 'xc-bob') report(tag, `시작 화면 이모지 움직임 없음 (${anim})`);
        await tab.shot(`${lang}-${width}-1-start.png`);
        // 2) 편집기
        await tab.tap('#start-btn');
        let s = await tab.eval(SHOWN);
        if (!s.edit) report(tag, '시작 버튼 → 편집기가 안 보임');
        if ((await tab.eval(COUNT('start'))) !== 1) report(tag, `track('start') ${await tab.eval(COUNT('start'))}회`);
        const init = await tab.eval(`window.XMAS_APP.card()`);
        if (init.g !== CORE.greetingIndex(T.editor.defaultGreeting) || init.t !== 0 || init.to || init.fr || init.m) report(tag, `편집기 처음 값 ${JSON.stringify(init)}`);
        await sleep(200);
        const sums = new Set();
        for (let ti = 0; ti < CORE.THEMES.length; ti++) {
          await tab.tap(`.xc-theme[data-t="${ti}"]`);
          await sleep(120);
          const got = await tab.eval(`window.XMAS_APP.card().t`);
          if (got !== ti) report(tag, `테마 ${ti} 를 눌렀는데 ${got}`);
          if ((await tab.eval(`document.querySelectorAll('.xc-theme[aria-checked="true"]').length`)) !== 1) report(tag, `테마 ${ti} aria-checked 이상`);
          sums.add(await tab.eval(CANVAS_SUM('#preview-canvas')));
        }
        if (sums.size !== CORE.THEMES.length) report(tag, `테마마다 미리보기 그림이 달라야 함 (${sums.size}/${CORE.THEMES.length})`);
        await tab.tap('.xc-theme[data-t="1"]');
        // 인사말·장식
        const g0 = await tab.eval(CANVAS_SUM('#preview-canvas'));
        await tab.tap('.xc-greet[data-g="3"]');
        await sleep(120);
        if ((await tab.eval(`window.XMAS_APP.card().g`)) !== 3 || (await tab.eval(CANVAS_SUM('#preview-canvas'))) === g0) report(tag, '인사말을 바꿔도 상태/그림이 안 바뀜');
        await tab.tap('.xc-greet[data-g="0"]');
        await tab.tap('.xc-deco[data-bit="2"]');
        await sleep(120);
        const oNow = await tab.eval(`window.XMAS_APP.card().o`);
        if (oNow !== 7 || (await tab.eval(`document.querySelector('.xc-deco[data-bit="2"]').getAttribute('aria-pressed')`)) !== 'true') report(tag, `장식(전구) 켜기 실패 o=${oNow}`);
        // 문구 추천
        await tab.tap('#idea-btn');
        await sleep(100);
        const idea = await tab.eval(`document.getElementById('f-msg').value`);
        if (idea !== T.editor.presets[0]) report(tag, `문구 추천이 첫 예시가 아님: ${idea}`);
        // 입력: 꺾쇠·긴 글은 정리된다
        await tab.eval(SET_VALUE('f-to', S.to));
        await tab.eval(SET_VALUE('f-from', S.fr));
        await tab.eval(SET_VALUE('f-msg', S.m));
        await tab.eval(`document.getElementById('f-to').blur(); document.getElementById('f-msg').blur(); 1`);
        await sleep(250);
        const want = { to: CORE.cleanText(S.to, CORE.LIMITS.to), fr: CORE.cleanText(S.fr, CORE.LIMITS.fr), m: CORE.cleanText(S.m, CORE.LIMITS.m) };
        const cur = await tab.eval(`window.XMAS_APP.card()`);
        if (cur.to !== want.to || cur.fr !== want.fr || cur.m !== want.m) report(tag, `입력이 상태에 안 들어감 ${JSON.stringify(cur)}`);
        if ((await tab.eval(`document.getElementById('f-to').value`)) !== want.to) report(tag, '받는 사람 칸이 blur 때 정리되지 않음');
        const cnt = await tab.eval(`document.getElementById('msg-count').textContent`);
        if (cnt !== `${Array.from(want.m).length}/${CORE.LIMITS.m}`) report(tag, `글자 수 표시 "${cnt}"`);
        const draft = await tab.eval(`JSON.parse(localStorage.getItem('xmascard_draft') || 'null')`);
        if (!draft || draft.m !== want.m) report(tag, '쓰던 카드가 localStorage 에 없음');
        const px = await tab.eval(CANVAS_TEXT('#preview-canvas'));
        if (!(px > 3000)) report(tag, `미리보기 canvas 에 글이 그려지지 않음 (픽셀 ${px})`);
        (await tab.eval(TEXT_FIT + `('.xc-btn, .xc-chip, .xc-deco, .xc-idea, .xc-edit-title, .xc-label')`)).forEach((w) => report(tag, `편집기 ${w}`));
        o = await tab.eval(OVERFLOW); if (o) report(tag, `편집기 가로 넘침 ${o}px`);
        const prevW = await tab.eval(`document.getElementById('preview-canvas').getBoundingClientRect().width`);
        if (!(prevW > 150 && prevW <= 280)) report(tag, `미리보기 폭 ${prevW}`);
        if ((await tab.eval(`document.querySelectorAll('#screen-edit .mg-ad').length`)) !== 1) report(tag, '편집기 광고 자리가 1개가 아님');
        await tab.shot(`${lang}-${width}-2-edit.png`);
        // 3) 완성 → 끝 화면
        await tab.tap('#done-btn');
        await sleep(700);
        s = await tab.eval(SHOWN);
        if (!s.end || s.edit) report(tag, '완성 → 끝 화면이 안 보임');
        if ((await tab.eval(COUNT('done'))) !== 1) report(tag, `track('done') ${await tab.eval(COUNT('done'))}회`);
        const r = await tab.eval(`(() => {
          const end = document.querySelector('[data-mg-end]');
          const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
          const card = document.querySelector('.xc-card');
          return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
            faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
            title: document.getElementById('end-title').textContent, eyebrow: document.getElementById('end-eyebrow').textContent, label: document.getElementById('end-canvas').getAttribute('aria-label'),
            retry: document.querySelector('.mg-end-retry').textContent, editHidden: document.getElementById('edit-btn').hidden, shown: window.XMAS_APP.shown() };
        })()`);
        const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
        if (r.kids.join(',') !== order.join(',')) report(tag, `끝 화면 순서 ${r.kids.join(' → ')}`);
        if (!r.cardBeforeEnd) report(tag, '결과 카드가 끝 화면보다 위에 있지 않음');
        if (r.faqItems !== T.faq.length || r.shareBtns !== 6) report(tag, `FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
        const greet = T.card.greetings.merry;
        if (r.title !== greet) report(tag, `끝 화면 제목 "${r.title}" ≠ "${greet}"`);
        if (r.eyebrow !== T.result.eyebrowMine || r.editHidden) report(tag, '끝 화면(만든 사람) 표시가 이상함');
        if (!r.label || !r.label.includes(greet)) report(tag, `끝 canvas aria-label "${r.label}"`);
        if (r.retry !== T.result.retry) report(tag, `다시 하기 라벨 "${r.retry}"`);
        if (!CORE.same(r.shown, { t: 1, g: 0, o: 7, ...want })) report(tag, `끝 화면 카드 ${JSON.stringify(r.shown)}`);
        const endPx = await tab.eval(CANVAS_TEXT('#end-canvas'));
        if (!(endPx > 3000)) report(tag, `끝 화면 canvas 에 글이 그려지지 않음 (${endPx})`);
        o = await tab.eval(OVERFLOW); if (o) report(tag, `끝 화면 가로 넘침 ${o}px`);
        (await tab.eval(TEXT_FIT + `('.xc-btn, .xc-eyebrow, .mg-end-retry, .mg-end-h')`)).forEach((w) => report(tag, `끝 화면 ${w}`));
        await tab.shot(`${lang}-${width}-3-end.png`);
        // 4) 이미지 저장 (공유 시트 대신 내려받기 경로 — 다운로드는 CDP 로 막아 둠)
        await tab.eval(`(() => { try { Object.defineProperty(navigator, 'canShare', { value: undefined, configurable: true }); } catch (e) {} return 1; })()`);
        await tab.tap('#save-btn');
        let img = null;
        for (let i = 0; i < 60 && !img; i++) { await sleep(100); img = await tab.eval(`window.XMAS_APP.lastImage`); }
        await sleep(150);
        const saveStatus = await tab.eval(`document.getElementById('save-status').textContent`);
        if (!img || img.w !== 1080 || img.h !== 1350 || !(img.size > 30000) || img.type !== 'image/png') report(tag, `이미지 저장 실패 ${JSON.stringify(img)}`);
        if (saveStatus !== T.result.saved) report(tag, `저장 상태 "${saveStatus}"`);
        // 5) 텍스트 복사
        await tab.eval(`(() => { window.__clip = null; try { Object.defineProperty(navigator, 'clipboard', { value: { writeText: (t) => { window.__clip = t; return Promise.resolve(); } }, configurable: true }); } catch (e) {} return 1; })()`);
        await tab.tap('#copy-btn');
        await sleep(200);
        const clip = await tab.eval(`window.__clip`);
        const wantLines = [greet, T.card.to.replace('{name}', want.to), want.m, T.card.from.replace('{name}', want.fr)];
        if (!clip || !wantLines.every((l) => clip.includes(l))) report(tag, `복사한 텍스트에 인사말·이름·메시지가 없음: ${JSON.stringify(clip)}`);
        if (clip && !/#d=[A-Za-z0-9_-]+$/.test(clip)) report(tag, '복사한 텍스트 끝에 공유 링크가 없음');
        if ((await tab.eval(`document.getElementById('save-status').textContent`)) !== T.result.copied) report(tag, '복사 상태 문구');
        // 6) 공유 링크
        const share = await tab.eval(`window.getShareData()`);
        const hash = (share.url.match(/#d=([A-Za-z0-9_-]+)$/) || [])[1];
        const dec = hash && CORE.decode(hash);
        if (!dec || !CORE.same(dec, r.shown)) report(tag, `공유 링크가 보이는 카드와 다름: ${share.url}`);
        if (/\/(ko|th|ru|ja)\/|_l\//.test(share.url)) report(tag, `공유 링크에 언어 경로: ${share.url}`);
        if (!share.text.includes(want.fr)) report(tag, `공유 문구에 보내는 사람 없음: ${share.text}`);
        // 서버로 메시지가 가지 않는다 (모의 서버 요청 기록에 메시지 없음)
        const log = await mockRpc('__log').catch(() => '');
        if (log && log.includes(want.m.slice(0, 12))) report(tag, '메시지 내용이 서버(모의)로 전송됨');
        tab.errors.forEach((e) => report(tag, '콘솔 오류: ' + e));
        await tab.send('Page.close').catch(() => {});
        // 7) 받은 사람이 링크를 연다 (새 탭)
        const v = await openTab(width);
        await v.goto(base + '#nolang');
        await v.eval(`localStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); 1`);
        await v.goto(`${base}#d=${hash}`);
        await v.eval(SPY);
        await sleep(300);
        const op = await v.eval(`(() => ({ s: ${SHOWN}, from: document.getElementById('open-from').textContent, ads: [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent).length }))()`);
        if (!op.s.open || op.s.end || op.s.start) report(tag, '공유 링크: 봉투 화면이 먼저 보이지 않음');
        if (op.from !== T.open.fromName.replace('{name}', want.fr)) report(tag, `봉투 보낸 사람 "${op.from}"`);
        if (op.ads) report(tag, `봉투 화면에 광고 ${op.ads}개`);
        o = await v.eval(OVERFLOW); if (o) report(tag, `봉투 화면 가로 넘침 ${o}px`);
        (await v.eval(TEXT_FIT + `('.xc-btn, .xc-open-eyebrow, .xc-open-from')`)).forEach((w) => report(tag, `봉투 화면 ${w}`));
        await v.shot(`${lang}-${width}-4-envelope.png`);
        await v.tap('#open-cta');
        await sleep(200);
        if (!(await v.eval(`document.getElementById('screen-open').classList.contains('is-opening')`))) report(tag, '봉투 여는 움직임이 시작되지 않음');
        await sleep(1200);
        const f = await v.eval(`(() => ({ s: ${SHOWN}, shown: window.XMAS_APP.shown(), eyebrow: document.getElementById('end-eyebrow').textContent, editHidden: document.getElementById('edit-btn').hidden,
          retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent }))()`);
        if (!f.s.end || f.s.open) report(tag, '공유 링크: 봉투를 연 뒤 카드가 안 보임');
        if (!CORE.same(f.shown, r.shown)) report(tag, '공유 링크: 다른 카드가 보임');
        if (f.eyebrow !== T.result.eyebrowFriend.replace('{name}', want.fr) || !f.editHidden || f.retry !== T.result.retryFriend) report(tag, `공유 링크: 받은 사람 표시 이상 (${f.eyebrow} / ${f.retry})`);
        const fpx = await v.eval(CANVAS_TEXT('#end-canvas'));
        if (!(fpx > 3000)) report(tag, `공유 링크: canvas 에 글이 그려지지 않음 (${fpx})`);
        const h1 = await v.eval(CANVAS_SUM('#end-canvas'));
        await sleep(300);
        const h2 = await v.eval(CANVAS_SUM('#end-canvas'));
        if (h1 !== h2) report(tag, '공유 링크: 그림이 안정되지 않음');
        if ((await v.eval(COUNT('start'))) !== 0 || (await v.eval(COUNT('done'))) !== 0) report(tag, `공유 링크로 열었는데 track start ${await v.eval(COUNT('start'))} / done ${await v.eval(COUNT('done'))}`);
        o = await v.eval(OVERFLOW); if (o) report(tag, `공유 링크 끝 화면 가로 넘침 ${o}px`);
        await v.shot(`${lang}-${width}-5-friend.png`);
        await v.tap('[data-mg-end] .mg-end-retry');
        await sleep(200);
        const fr = await v.eval(`(() => ({ s: ${SHOWN}, hash: location.hash, start: ${COUNT('start')}, done: ${COUNT('done')}, d: window.XMAS_APP.card() }))()`);
        if (!fr.s.edit || fr.hash) report(tag, `공유 링크 → 나도 만들기: 편집기 ${fr.s.edit} / 해시 ${fr.hash}`);
        if (fr.start !== 1 || fr.done !== 0) report(tag, `받은 사람 track start ${fr.start} / done ${fr.done}`);
        if (fr.d.m !== '' || fr.d.t !== 0) report(tag, `나도 만들기: 새 카드가 아님 ${JSON.stringify(fr.d)}`);
        // 잘못된 링크는 시작 화면, 움직임 줄이기면 멈춤 + 봉투 바로 열림
        await v.goto('about:blank');
        await v.goto(`${base}#d=broken!!`);
        if (!(await v.eval(SHOWN)).start) report(tag, '잘못된 링크인데 시작 화면이 아님');
        await v.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await sleep(80);
        const still = await v.eval(`getComputedStyle(document.querySelector('.xc-hero-tree')).animationName`);
        if (still !== 'none') report(tag, `prefers-reduced-motion 인데 움직임 (${still})`);
        await v.goto('about:blank');
        await v.goto(`${base}#d=${hash}`);
        await v.tap('#open-btn');
        await sleep(150);
        if (!(await v.eval(SHOWN)).end) report(tag, 'prefers-reduced-motion 인데 봉투가 바로 열리지 않음');
        v.errors.forEach((e) => report(tag, '콘솔 오류(받은 사람): ' + e));
        await v.send('Page.close').catch(() => {});
        runs++;
        console.log(`  ${problems === before ? '✓' : '✗'} ${tag} 시작→편집(테마 ${CORE.THEMES.length}·인사말·장식·추천 문구·입력·canvas)→완성→끝 화면 ${r.kids.join('→')} · 이미지 ${img ? Math.round(img.size / 1024) + 'KB' : '-'} · 텍스트 복사 · 공유 링크 ${hash ? hash.length : 0}자 → 봉투 → 같은 카드(start/done 안 셈) · 움직임 줄이기`);
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
