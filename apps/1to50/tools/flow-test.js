#!/usr/bin/env node
/**
 * 1to50 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/1to50) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * 모의 서버에 점수 분포를 미리 심는다(1to50-50 / 1to50-25: 20초·40초 구간 5명씩) → "상위 %"가 보여야 함.
 *   한 번은 빈 서버(빠른 모드)로 돌려 백분위가 숨는지 본다.
 * 언어 × 화면 폭마다:
 *   시작(티징만: 맨 끝 광고 1·FAQ·결과 없음, h1 검색어) → 시작(track start 1회) → 3-2-1(판 가림, 숫자 없음) → GO
 *   → 틀린 숫자 1번(실수 1·+0.5 표시) → 1..N 차례로 터치(pointerdown) → 끝 화면(track done 1회)
 *     · 결과 카드 → 공통 끝 화면(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *     · 큰 숫자 = 앱 시계(벌점 포함), 틀린 터치 1, 벌점 안내 보임, 최고 기록 줄
 *     · 백분위 = 모의 서버 실제 값(심은 경우) / 숨김(빈 서버) · 점수 전송 1건(game 이름·bucket)
 *     · 공유 주소 = 언어 없는 주소, 공유 문구에 시간
 *   → 다시 하기 = 새 판(track start 2회째)
 *   · 게임 화면에서 판이 화면 안에 들어옴 · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *
 * 실행: node tools/flow-test.js                       (en,ko × 360,1440 + 빈 서버 1회)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 *       포트: ONE50_HTTP_PORT(8951) ONE50_MOCK_PORT(8952) ONE50_CDP_PORT(9451)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, '1to50-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = Number(process.env.ONE50_HTTP_PORT || 8951), MOCK_PORT = Number(process.env.ONE50_MOCK_PORT || 8952), CDP_PORT = Number(process.env.ONE50_CDP_PORT || 9451);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TAP_GAP = 110; // 터치 사이 간격(ms) — 너무 빠르면 plausible(classic 6초) 아래로 내려가 점수를 안 보낸다

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
  async pos(sel, scroll) {
    return this.eval(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.offsetParent) return null; ${scroll ? "e.scrollIntoView({ block: 'center' });" : ''} const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
  }
  async click(r) { for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 }); }
  async tap(sel, scroll = true) {
    const r = await this.pos(sel, scroll);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await sleep(40);
    await this.click(r);
    await sleep(40);
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
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());
async function seedScores() {
  await mockRpc('__reset');
  const jobs = [];
  Object.values(CORE.MODES).forEach((m) => [20, 40].forEach((sec) => { for (let k = 0; k < 5; k++) jobs.push(mockRpc('submit_score', { p_game: m.game, p_bucket: CORE.bucket(sec) })); }));
  await Promise.all(jobs);
}
const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const SPY = `(() => { window.__tracks = []; const o = window.track; window.track = function (e) { window.__tracks.push(e); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden }))()`;
// 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만 — CJK·태국어·한글은 검사 제외)
const TEXT_FIT = `((sel) => {
  const bad = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.offsetParent) return;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).textOverflow !== 'ellipsis') bad.push('넘침: ' + el.textContent.trim().slice(0, 30));
    if (getComputedStyle(el).textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth + 1) bad.push('말줄임: ' + el.textContent.trim().slice(0, 30));
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

async function waitFor(tab, expr, ms) {
  for (let t = 0; t < ms; t += 50) { if (await tab.eval(expr)) return true; await sleep(50); }
  return false;
}

async function runOne(lang, width, opts, report) {
  const T = L10N[lang];
  const mode = opts.mode || 'classic';
  const max = CORE.MODES[mode].max;
  const tag = `[${lang} ${width} ${mode}${opts.seed ? '' : ' 빈 서버'}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  if (opts.seed) await seedScores(); else await mockRpc('__reset');
  const seeded = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').length;
  const base = `http://localhost:${HTTP_PORT}/` + G.folderFileOf(lang, 'index.html').replace(/index\.html$/, '');
  const tab = await openTab(width);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  await tab.eval(SPY);
  // 1) 시작 화면
  const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0]); })(),
    visFaq: [...document.querySelectorAll('.mg-end-faq, .mg-end-share, .ot-result')].filter((a) => a.offsetParent).length,
    h1: document.querySelector('h1').textContent.trim(), lang: document.documentElement.lang, how: document.querySelector('.ot-how').innerText }))()`);
  if (st.lang !== lang) say(`<html lang> = ${st.lang}`);
  if (!st.s.start || st.s.play || st.s.end) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.visFaq) say('시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/끝 화면이 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.how.includes(T.start.how.penalty)) say('시작 화면에 벌점 안내가 안 보임');
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.ot-h1, .ot-badge, .ot-btn, .ot-hook, .ot-how-txt, .ot-mode-name, .ot-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-${mode}-1-start.png`);
  if (mode !== 'classic') await tab.tap(`.ot-mode[data-mode="${mode}"]`);
  if ((await tab.eval(`document.querySelector('.ot-mode[aria-checked="true"]').getAttribute('data-mode')`)) !== mode) say('모드 선택이 안 됨');
  // 2) 시작 → 3-2-1
  await tab.tap('#start-btn');
  await sleep(150);
  const c = await tab.eval(`({ s: ${SHOWN}, count: !document.getElementById('count').hidden, txt: document.getElementById('count').textContent, nums: [...document.querySelectorAll('.ot-cell')].filter((b) => b.textContent.trim()).length, cells: document.querySelectorAll('.ot-cell').length, phase: ONE50_APP.phase() })`);
  if (!c.s.play) say('시작 버튼 → 게임 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`track('start') ${await tab.eval(COUNT('start'))}회`);
  if (!c.count || c.txt !== '3' || c.phase !== 'count') say(`카운트다운 3 이 안 보임 (${c.txt}, ${c.phase})`);
  if (c.cells !== 25 || c.nums !== 0) say(`카운트다운 중 판: 칸 ${c.cells}, 보이는 숫자 ${c.nums} (가려져야 함)`);
  const hud = await tab.eval(`(() => { const f = document.getElementById('field').getBoundingClientRect(); return { bottom: f.bottom, h: innerHeight, w: f.width }; })()`);
  if (hud.bottom > hud.h + 1) say(`판이 화면 아래로 넘침 (${Math.round(hud.bottom)} > ${hud.h})`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.ot-hud-label, .ot-hud-val')`)).forEach((w) => say(`게임 화면 ${w}`));
  if (!(await waitFor(tab, `ONE50_APP.phase() === 'play'`, 4000))) say('3-2-1 뒤 게임이 시작되지 않음');
  const go = await tab.eval(`({ txt: document.getElementById('count').textContent, nums: [...document.querySelectorAll('.ot-cell')].filter((b) => b.textContent.trim()).length })`);
  if (go.txt !== T.play.go || go.nums !== 25) say(`GO 뒤 숫자 25개가 보여야 함 (${go.txt}, ${go.nums})`);
  await tab.shot(`${lang}-${width}-${mode}-2-play.png`);
  // 3) 틀린 숫자 1번
  await tab.tap('.ot-cell[data-n="2"]', false);
  const w = await tab.eval(`({ m: ONE50_APP.state().mistakes, pen: document.getElementById('hud-pen').textContent, next: document.getElementById('hud-next').textContent })`);
  if (w.m !== 1 || !/0[.,]5/.test(w.pen) || w.next !== '1') say(`틀린 터치: 실수 ${w.m}, 표시 "${w.pen}", 다음 ${w.next}`);
  // 4) 1..N 차례로
  const t0 = Date.now();
  for (let n = 1; n <= max; n++) {
    const r = await tab.pos(`.ot-cell[data-n="${n}"]`);
    if (!r) { say(`숫자 ${n} 칸이 판에 없음`); break; }
    await tab.click(r);
    await sleep(TAP_GAP);
    if (n === 1 || n === 30) {
      const h = await tab.eval(`({ next: document.getElementById('hud-next').textContent, prog: document.getElementById('hud-prog').textContent })`);
      if (h.next !== String(n + 1) || h.prog !== `${n}/${max}`) say(`${n} 뒤 HUD: 다음 ${h.next}, 진행 ${h.prog}`);
    }
  }
  const wall = Date.now() - t0;
  if (!(await waitFor(tab, `ONE50_APP.phase() === 'end'`, 3000))) say('마지막 숫자 뒤 끝 화면이 안 나옴');
  await sleep(600); // 점수 전송 + 분포
  if ((await tab.eval(COUNT('done'))) !== 1) say(`track('done') ${await tab.eval(COUNT('done'))}회`);
  const r = await tab.eval(`(() => {
    const end = document.querySelector('[data-mg-end]');
    const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
    const card = document.querySelector('.ot-result');
    return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
      faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
      big: document.getElementById('res-big').textContent, miss: document.getElementById('res-miss').textContent, pen: document.getElementById('res-pen').hidden ? null : document.getElementById('res-pen').textContent,
      best: document.getElementById('res-best').textContent, mode: document.getElementById('res-mode').textContent,
      rank: !document.getElementById('res-rank').hidden, top: document.getElementById('res-top').textContent, beat: document.getElementById('res-beat').textContent,
      ms: ONE50_APP.elapsed(), retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent };
  })()`);
  const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
  if (r.kids.join(',') !== order.join(',')) say(`끝 화면 순서 ${r.kids.join(' → ')}`);
  if (!r.cardBeforeEnd) say('결과 카드가 공통 끝 화면보다 위에 있지 않음');
  if (r.faqItems !== T.faq.length || r.shareBtns !== 6) say(`FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
  const wantBig = await tab.eval(`(Math.floor(${r.ms} / 10) / 100).toLocaleString('${lang}', { minimumFractionDigits: 2, maximumFractionDigits: 2 })`);
  if (r.big !== wantBig) say(`큰 숫자 "${r.big}" ≠ 앱 시계 "${wantBig}"`);
  if (r.ms < 500 || r.ms > wall + 2000) say(`시간 ${r.ms}ms 가 이상함 (터치에 걸린 시간 ${wall}ms)`);
  if (r.miss !== '1' || !r.pen || !/0[.,]5/.test(r.pen)) say(`틀린 터치 ${r.miss} / 벌점 안내 "${r.pen}"`);
  if (!r.best.includes(r.big)) say(`최고 기록 줄 "${r.best}" 에 이번 기록이 없음`);
  if (!r.mode.includes(T.start.modes[mode]) || !r.mode.includes(String(max))) say(`모드 배지 "${r.mode}"`);
  if (r.retry !== T.result.retry) say(`다시 하기 라벨 "${r.retry}"`);
  const sec = r.ms / 1000;
  const log = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').slice(seeded);
  const shouldSend = CORE.plausible(mode, sec);
  if (shouldSend) {
    if (log.length !== 1 || log[0].args.p_game !== CORE.MODES[mode].game || log[0].args.p_bucket !== CORE.bucket(sec)) say(`점수 전송 ${JSON.stringify(log.map((e) => e.args))} (기대 ${CORE.MODES[mode].game} / ${CORE.bucket(sec)})`);
  } else if (log.length) say('plausible 아래인데 점수를 보냄');
  let rankNote = '백분위 숨김';
  if (opts.seed && shouldSend) {
    const p = CORE.percentile(JSON.parse(await mockRpc('score_distribution', { p_game: CORE.MODES[mode].game })), CORE.bucket(sec));
    const wantTop = T.result.top.replace('{n}', p.top);
    if (!r.rank || r.top !== wantTop) say(`백분위 "${r.top}" ≠ "${wantTop}" (보임 ${r.rank})`);
    rankNote = `"${r.top}"`;
  } else if (r.rank) say(`빈 서버/전송 없음인데 백분위가 보임 "${r.top}"`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.ot-eyebrow, .ot-head, .ot-best, .ot-newbest, .ot-stat dt, .ot-pen-note, .ot-top, .ot-beat, .ot-others, .mg-end-retry')`)).forEach((x) => say(`끝 화면 ${x}`));
  await tab.shot(`${lang}-${width}-${mode}-3-end.png`);
  const share = await tab.eval('window.getShareData()');
  const sp = new URL(share.url).pathname;
  if (/\/(ja|zh|ko|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(sp)) say(`공유 주소에 언어가 들어감 ${share.url}`);
  if (!share.text.includes(r.big) || !share.text.includes(String(max))) say(`공유 문구 "${share.text}"`);
  // 5) 다시 하기 → 새 판
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ s: ${SHOWN}, phase: ONE50_APP.phase(), m: ONE50_APP.state().mistakes })`);
  if (!again.s.play || again.phase !== 'count' || again.m !== 0) say(`다시 하기 → 새 판이 아님 (${JSON.stringify(again)})`);
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2회여야 함)`);
  await sleep(300);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, big: r.big, order: r.kids.join('→'), rank: rankNote, sent: log.length };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'one50-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    let up = false;
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) { up = true; break; } } catch (e) { /* 기다림 */ } await sleep(150); }
    if (!up) throw new Error(`Chrome CDP :${CDP_PORT} 가 안 열림 (포트가 쓰이는 중이면 ONE50_CDP_PORT 로 바꿔 다시)`);
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 1to50 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, { seed: true, mode: 'classic' }])));
    plan.push([LANGS[LANGS.length - 1], WIDTHS[0], { seed: false, mode: 'quick' }]); // 빈 서버 + 빠른 모드: 백분위 숨김
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, opts, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width} ${opts.mode}${opts.seed ? '' : ' 빈 서버'}] 시작→3-2-1→틀린 터치 1→1..${CORE.MODES[opts.mode].max} → ${res.big}초 · 점수 전송 ${res.sent}건 · ${res.rank} · 끝 화면 ${res.order} · 다시 하기`);
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
