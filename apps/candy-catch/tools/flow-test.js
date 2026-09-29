#!/usr/bin/env node
/**
 * 할로윈 사탕 받기 게임 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/candy-catch) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * 모의 서버에 점수 분포를 미리 심는다(다른 사람 40명) → 끝 화면 상위 %가 Node 의 CANDY_CORE.percentile 과 같은지 본다.
 *   한 번은 빈 서버(나 혼자 → 비교할 기록 없음)로 돌려 상위 % 칸이 숨는지, 한 번은 prefers-reduced-motion 으로 돌린다.
 * 언어 × 화면 폭마다:
 *   시작(티징: 광고·FAQ 없음) → 시작 → 카운트다운 → 게임(HUD·캔버스, 광고 없음)
 *   · 끌기(터치/마우스)로 바구니가 따라옴 · → 키로 오른쪽 · 탭 숨김(visibilitychange) → 일시정지(시간 멈춤) → 계속하기
 *   · 페이지 안 봇(마우스 pointermove)으로 사탕을 받으며 빨리 감기(timeScale) → 끝 화면
 *   → 점수 카드(점수·최고 기록·받은 사탕·최대 콤보·상위 %) → 공통 끝 화면(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   · submit_score 한 번(bucket 일치) · track('start')·track('done') 한 번씩 · 다시 하기 = 새 판 + start/done 한 번 더, 최고 기록 유지
 *   · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
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
const C = require(path.join(SITE, 'candy-catch-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = Number(process.env.CC_HTTP_PORT || 8891), MOCK_PORT = Number(process.env.CC_MOCK_PORT || 8892), CDP_PORT = Number(process.env.CC_CDP_PORT || 9396);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const num = (lang, n) => new Intl.NumberFormat(lang).format(n);

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
  async box(sel) {
    return this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, l: b.left, t: b.top, w: b.width, h: b.height }; })()`);
  }
  async tap(sel) {
    const r = await this.box(sel);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await sleep(40);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(40);
  }
  async key(k, code, vk, holdMs) {
    await this.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
    await sleep(holdMs);
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
  }
  async shot(file) {
    if (!SHOTS) return;
    const r = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    fs.mkdirSync(SHOTS, { recursive: true });
    fs.writeFileSync(path.join(SHOTS, file), Buffer.from(r.data, 'base64'));
  }
}
async function openTab(width, reduced) {
  const t = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const tab = new Tab(ws);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await tab.send('Emulation.setFocusEmulationEnabled', { enabled: true }).catch(() => {});
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());
const SEED_BUCKETS = Array.from({ length: 40 }, (_, i) => (i * 37) % 420); // 다른 사람 40명: 0~4190점
async function seedScores() {
  await mockRpc('__reset');
  await Promise.all(SEED_BUCKETS.map((b) => mockRpc('submit_score', { p_game: C.GAME, p_bucket: b })));
}
const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const SPY = `(() => { window.__tracks = []; const o = window.track; window.track = function (e) { window.__tracks.push(e); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden }))()`;
const APP = (fn) => `window.CANDY_APP.${fn}`;
// 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만 — CJK·태국어는 어디서나 줄바꿈 가능)
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
// 페이지 안 봇: 가장 아래의 사탕을 쫓고 가까운 방해물은 피한다 — 마우스 pointermove 를 필드에 보낸다(실제 입력 경로)
const BOT_ON = `(() => {
  const field = document.getElementById('field'), cv = document.getElementById('cc-canvas'), C = window.CANDY_CORE;
  window.__bot = true;
  (function tick() {
    if (!window.__bot) return;
    const s = window.CANDY_APP.state(); const items = window.CANDY_APP.items();
    if (s && !s.over) {
      const kind = (t) => C.BY_ID[t].kind;
      const c = items.filter((i) => kind(i.type) === 'candy' && i.y < C.RIM_Y).sort((a, b) => b.y - a.y)[0];
      let target = c ? c.x : s.x;
      const d = items.find((i) => kind(i.type) === 'hazard' && i.y < C.RIM_Y && i.y > C.RIM_Y - 140 && Math.abs(i.x - target) < 64);
      if (d) target = d.x < C.W / 2 ? d.x + 130 : d.x - 130;
      const r = cv.getBoundingClientRect();
      field.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: r.left + target / C.W * r.width, clientY: r.top + r.height * 0.8 }));
    }
    requestAnimationFrame(tick);
  })();
  return 1;
})()`;
const BOT_OFF = `(() => { window.__bot = false; return 1; })()`;

async function waitFor(tab, expr, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await tab.eval(expr)) return true; await sleep(80); }
  return false;
}

async function runOne(lang, width, mode, report) {
  const T = L10N[lang];
  const R = T.result;
  const withScores = mode !== 'empty';
  const reduced = mode === 'reduced';
  const tag = `[${lang} ${width}${mode === 'empty' ? ' 빈 서버' : reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  if (withScores) await seedScores(); else await mockRpc('__reset');
  const seededN = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').length;
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  await tab.eval(SPY);
  // 1) 시작 화면
  const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: !!document.querySelector('#screen-start .mg-ad'), faq: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end]'),
    visAds: [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent).length, visFaq: [...document.querySelectorAll('.mg-faq')].filter((a) => a.offsetParent).length,
    h1: document.querySelector('h1').textContent.trim(), how: document.querySelectorAll('#screen-start .cc-how li').length, btnBottom: document.getElementById('start-btn').getBoundingClientRect().bottom }))()`);
  if (!st.s.start || st.s.play || st.s.end) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.faq || st.visAds || st.visFaq) say('시작 화면에 광고/FAQ가 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (st.how !== 3) say(`짧은 방법 ${st.how}칸`);
  if (width < 768 && st.btnBottom > 760 + 120) say(`시작 버튼이 첫 화면에서 너무 아래 (${Math.round(st.btnBottom)}px)`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.cc-h1, .cc-badge, .cc-btn, .cc-hook, .cc-how-txt, .cc-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}${mode === 'normal' ? '' : '-' + mode}-1-start.png`);
  // 2) 시작 → 카운트다운 → 게임
  await tab.tap('#start-btn');
  if (!(await tab.eval(SHOWN)).play) say('시작 버튼 → 게임 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`track('start') ${await tab.eval(COUNT('start'))}회`);
  if ((await tab.eval(APP('phase()'))) !== 'count') say(`시작 직후 phase ${await tab.eval(APP('phase()'))} (count)`);
  if (!(await tab.eval(`!document.getElementById('countdown').hidden && /^[123]$/.test(document.getElementById('countdown-num').textContent)`))) say('카운트다운 숫자가 안 보임');
  if ((await tab.eval(`document.querySelectorAll('#screen-play .mg-ad').length + [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent).length`)) !== 0) say('게임 중 광고 자리가 있음');
  const geo = await tab.eval(`(() => { const f = document.getElementById('field').getBoundingClientRect(), c = document.getElementById('cc-canvas'); return { l: f.left, r: f.right, t: f.top, b: f.bottom, w: f.width, h: f.height, cw: c.width, ch: c.height, vh: innerHeight, vw: innerWidth }; })()`);
  if (Math.abs(geo.h / geo.w - 1.5) > 0.02) say(`필드 비율 ${(geo.h / geo.w).toFixed(2)} (1.5)`);
  if (geo.b > geo.vh + 1) say(`필드가 화면 아래로 넘침 (bottom ${Math.round(geo.b)} > ${geo.vh})`);
  if (width < 768 && geo.w < width - 60) say(`모바일 필드가 좁음 ${Math.round(geo.w)}px`);
  if (geo.cw < geo.w * 1.9) say(`캔버스 해상도가 낮음 (${geo.cw} / ${Math.round(geo.w)}px, dpr 2)`);
  if (!(await waitFor(tab, `${APP('phase()')} === 'play'`, 4500))) say('카운트다운 뒤 게임이 시작되지 않음');
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.cc-hud-label, .cc-hud-val')`)).forEach((w) => say(`HUD ${w}`));
  // 끌기: 필드 왼쪽 20% 지점 → 바구니가 따라감
  const tx = geo.l + geo.w * 0.2, ty = geo.t + geo.h * 0.8;
  if (width < 768) {
    await tab.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: geo.l + geo.w * 0.6, y: ty }] });
    for (let k = 1; k <= 5; k++) { await tab.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: geo.l + geo.w * (0.6 - 0.08 * k), y: ty }] }); await sleep(30); }
    await sleep(350);
    await tab.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: tx, y: ty });
    await sleep(350);
  }
  let x = (await tab.eval(APP('state()'))).x;
  const wantX = Math.max(C.BASKET_W / 2, 0.2 * C.W);
  if (Math.abs(x - wantX) > 6) say(`끌기/마우스로 바구니가 따라오지 않음 x=${x.toFixed(1)} (기대 ${wantX})`);
  if (width < 768 && (await tab.eval('document.documentElement.scrollTop || document.body.scrollTop'))) say('터치 끌기가 페이지를 스크롤함');
  // 방향키 → 오른쪽
  await tab.eval(`document.getElementById('field').focus(); 1`);
  await tab.key('ArrowRight', 'ArrowRight', 39, 300);
  const x2 = (await tab.eval(APP('state()'))).x;
  if (!(x2 > x + 60)) say(`→ 키로 바구니가 오른쪽으로 가지 않음 (${x.toFixed(0)} → ${x2.toFixed(0)})`);
  await tab.shot(`${lang}-${width}${mode === 'normal' ? '' : '-' + mode}-2-play.png`);
  // 탭 숨김 → 일시정지
  await tab.eval(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); 1`);
  const tPause = (await tab.eval(APP('state()'))).t;
  await sleep(500);
  const ps = await tab.eval(`(() => ({ phase: ${APP('phase()')}, t: ${APP('state()')}.t, box: !document.getElementById('pause-overlay').hidden }))()`);
  if (ps.phase !== 'paused' || !ps.box) say('탭을 숨겼는데 일시정지가 안 됨');
  if (ps.t !== tPause) say(`일시정지 중 시간이 흐름 (${tPause} → ${ps.t})`);
  (await tab.eval(TEXT_FIT + `('.cc-paused-title, #resume-btn')`)).forEach((w) => say(`일시정지 ${w}`));
  await tab.eval(`delete document.hidden; 1`);
  await tab.tap('#resume-btn');
  await sleep(300);
  const rs = await tab.eval(`(() => ({ phase: ${APP('phase()')}, t: ${APP('state()')}.t }))()`);
  if (rs.phase !== 'play' || !(rs.t > ps.t)) say(`계속하기 뒤 게임이 다시 가지 않음 (${rs.phase})`);
  // 봇 + 빨리 감기 → 끝 화면
  await tab.eval(BOT_ON);
  await tab.eval(APP('timeScale(6)'));
  let comboSeen = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 20000) {
    const ph = await tab.eval(APP('phase()'));
    if (ph === 'end') break;
    if (!comboSeen && (await tab.eval(`document.getElementById('combo').classList.contains('is-on')`))) {
      comboSeen = true;
      (await tab.eval(TEXT_FIT + `('.cc-combo')`)).forEach((w) => say(`콤보 ${w}`));
    }
    await sleep(120);
  }
  await tab.eval(BOT_OFF);
  const fin = await tab.eval(APP('state()'));
  if (!fin.over) { say('20초 안에 끝나지 않음'); await tab.send('Page.close').catch(() => {}); return { problems }; }
  if (!(await waitFor(tab, `!document.getElementById('screen-end').hidden`, 2000))) say('끝 화면이 안 보임');
  if (fin.caught < 10 || fin.score <= 0) say(`봇이 사탕을 거의 못 받음 (받음 ${fin.caught}, ${fin.score}점) — 입력 경로 확인`);
  if (!comboSeen && fin.maxCombo >= 5) say('콤보 ×2 알약이 한 번도 보이지 않음');
  if ((await tab.eval(COUNT('done'))) !== 1) say(`track('done') ${await tab.eval(COUNT('done'))}회`);
  await sleep(withScores ? 600 : 900);
  const r = await tab.eval(`(() => {
    const end = document.querySelector('[data-mg-end]');
    const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
    const card = document.querySelector('.cc-result');
    const t = (id) => document.getElementById(id).textContent;
    const vis = (id) => !document.getElementById(id).hidden;
    return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
      faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
      reason: t('res-reason'), score: t('res-score'), newBest: vis('res-newbest'), best: t('res-best'), bestVis: vis('res-best'), caught: t('res-caught'), streak: t('res-streak'),
      rank: vis('res-rank'), rankBody: vis('res-rank-body'), top: t('res-top'), beat: t('res-beat'), others: t('res-others'),
      retry: document.querySelector('.mg-end-retry').textContent, stored: localStorage.getItem('cc_best_v1') };
  })()`);
  const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
  if (r.kids.join(',') !== order.join(',')) say(`끝 화면 순서 ${r.kids.join(' → ')}`);
  if (!r.cardBeforeEnd) say('점수 카드가 공통 끝 화면보다 위에 있지 않음');
  if (r.faqItems !== T.faq.length || r.shareBtns !== 6) say(`FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
  if (r.reason !== (fin.reason === 'lives' ? R.outOfLives : R.timeUp)) say(`끝 이유 "${r.reason}" (${fin.reason})`);
  if (r.score !== num(lang, fin.score) || r.caught !== num(lang, fin.caught) || r.streak !== num(lang, fin.maxCombo)) say(`점수 카드 ${r.score}/${r.caught}/${r.streak} ≠ ${fin.score}/${fin.caught}/${fin.maxCombo}`);
  if (fin.score > 0 && (!r.newBest || r.bestVis || r.stored !== String(fin.score))) say(`첫 판 최고 기록 표시/저장 이상 (newBest ${r.newBest}, 저장 ${r.stored})`);
  if (r.retry !== R.retry) say(`다시 하기 라벨 "${r.retry}"`);
  // 서버: submit_score 한 번, bucket 일치, 상위 % = Node 계산
  const log = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').slice(seededN);
  if (log.length !== 1 || log[0].args.p_game !== C.GAME || log[0].args.p_bucket !== C.bucket(fin.score)) say(`submit_score ${JSON.stringify(log.map((e) => e.args))} (한 번, bucket ${C.bucket(fin.score)})`);
  if (withScores) {
    const dist = JSON.parse(await mockRpc('score_distribution', { p_game: C.GAME }));
    const p = C.percentile(dist, C.bucket(fin.score));
    const wantTop = G.fmt(R.top, { n: p.top });
    const wantBeat = p.beatPct >= 100 ? R.beatAll : G.fmt(R.beat, { pct: p.beatPct });
    const wantOthers = G.fmt(R.others, { n: num(lang, p.others) });
    if (!r.rank || !r.rankBody || r.top !== wantTop || r.beat !== wantBeat || r.others !== wantOthers) say(`상위 % "${r.top} / ${r.beat} / ${r.others}" ≠ "${wantTop} / ${wantBeat} / ${wantOthers}"`);
  } else if (r.rank || r.rankBody) say('비교할 기록이 없는데 상위 % 칸이 보임');
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.cc-eyebrow, .cc-score-line, .cc-newbest, .cc-best, .cc-stat dt, .cc-stat dd, .cc-top, .cc-beat, .cc-others, .mg-end-retry, .mg-end-h')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}${mode === 'normal' ? '' : '-' + mode}-3-end.png`);
  // 공유
  const share = await tab.eval(`window.getShareData()`);
  const wantText = G.fmt(R.shareText, { score: num(lang, fin.score) });
  if (share.text !== wantText) say(`공유 문구 "${share.text}" ≠ "${wantText}"`);
  if (/[?&#]lang=|\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(share.url.replace(/^https?:\/\/[^/]+/, '')) && lang !== 'en') say(`공유 주소에 언어가 들어감: ${share.url}`);
  // 3) 다시 하기 → 새 판(가만히 두고 빨리 감기)
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(150);
  const again = await tab.eval(`(() => ({ s: ${SHOWN}, phase: ${APP('phase()')}, seed: ${APP('state()')}.seed, score: ${APP('state()')}.score, start: ${COUNT('start')} }))()`);
  if (!again.s.play || again.phase !== 'count' || again.score !== 0) say('다시 하기 → 새 판 카운트다운이 아님');
  if (again.seed === fin.seed) say('다시 하기인데 같은 시드');
  if (again.start !== 2) say(`다시 하기 뒤 track('start') ${again.start}회 (2)`);
  await tab.eval(APP('timeScale(20)'));
  if (!(await waitFor(tab, `!document.getElementById('screen-end').hidden`, 12000))) say('두 번째 판이 끝 화면에 닿지 않음');
  await sleep(300);
  const fin2 = await tab.eval(APP('state()'));
  const r2 = await tab.eval(`(() => ({ done: ${COUNT('done')}, stored: localStorage.getItem('cc_best_v1'), best: document.getElementById('res-best').textContent, bestVis: !document.getElementById('res-best').hidden, newBest: !document.getElementById('res-newbest').hidden }))()`);
  if (r2.done !== 2) say(`두 번째 판 뒤 track('done') ${r2.done}회 (2)`);
  const bestNow = Math.max(fin.score, fin2.score);
  if (r2.stored !== String(bestNow)) say(`최고 기록 저장 ${r2.stored} ≠ ${bestNow}`);
  if (fin2.score <= fin.score && (!r2.bestVis || r2.newBest || r2.best !== G.fmt(R.best, { n: num(lang, bestNow) }))) say(`두 번째 판 최고 기록 줄 "${r2.best}"`);
  const log2 = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').slice(seededN);
  if (log2.length !== 2) say(`두 판에 submit_score ${log2.length}회 (2)`);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, score: fin.score, caught: fin.caught, combo: fin.maxCombo, reason: fin.reason, top: r.rankBody ? r.top : '(숨김)', order: r.kids.join('→') };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cc-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 사탕 받기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, 'normal'])));
    plan.push([LANGS[0], WIDTHS[0], 'empty']);   // 빈 서버: 상위 % 숨김
    plan.push([LANGS[0], WIDTHS[1] || WIDTHS[0], 'reduced']); // 움직임 줄이기
    for (const [lang, width, mode] of plan) {
      const res = await runOne(lang, width, mode, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${mode === 'normal' ? '' : ' ' + mode}] 시작→카운트다운→끌기·→키·일시정지→봇 ${res.score}점(사탕 ${res.caught}, 콤보 ${res.combo}, ${res.reason}) · 상위 ${res.top} · 끝 화면 ${res.order} · 다시 하기`);
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
