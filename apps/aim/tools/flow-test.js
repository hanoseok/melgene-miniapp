#!/usr/bin/env node
/**
 * 에임 연습 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림 — Timed 한 판 30초).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/aim) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * 모의 서버에 점수 분포를 미리 심는다(aim-classic 40·60 구간, aim-timed 30·50개 — 5명씩) → "상위 %"가 보여야 함.
 *   마지막 한 번은 빈 서버(Timed)로 돌려 백분위가 숨는지 본다.
 * 언어 × 화면 폭마다:
 *   시작(티징만: 맨 끝 광고 1·FAQ·결과 없음, h1 검색어, 가로 넘침·글자 넘침 없음) → 모드 고르기 → 시작 버튼(아직 track start 없음)
 *   → 영역 밖 누름(시작 전이라 안 셈) → 가운데 시작 과녁(track start 1회) → 빗나감 1 → 과녁을 차례로 맞힘(폭 < 768 은 터치, 그 밖은 마우스)
 *   → 끝 화면(track done 1회): 결과 카드 → 공통 끝 화면(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *     · 맞힘·빗나감·정확도·평균 ms 가 앱 상태와 같음, 점수 전송 1건(game 이름·bucket), 백분위 = 모의 서버 실제 값 / 숨김(빈 서버)
 *     · 공유 주소 = 언어 없는 주소
 *   → 다시 하기 = 새 판(준비 상태, track start 는 시작 과녁을 맞혀야 2회째)
 *   · 플레이 영역이 화면 안에 들어옴 · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *
 * 실행: node tools/flow-test.js                       (en,ko × 360,1440 classic + timed 1회 + 빈 서버 timed 1회)
 *       node tools/flow-test.js en,ru,th 360 [캡처 폴더]
 *       AIM_FLOW_TIMED=0 이면 timed 를 건너뜀. 포트: AIM_HTTP_PORT(8961) AIM_MOCK_PORT(8962) AIM_CDP_PORT(9461)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'aim-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const RUN_TIMED = process.env.AIM_FLOW_TIMED !== '0';
const HTTP_PORT = Number(process.env.AIM_HTTP_PORT || 8961), MOCK_PORT = Number(process.env.AIM_MOCK_PORT || 8962), CDP_PORT = Number(process.env.AIM_CDP_PORT || 9461);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Tab {
  constructor(ws, touch) {
    this.ws = ws; this.touch = touch; this.n = 0; this.wait = new Map(); this.errors = []; this.onload = null;
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.wait.has(m.id)) { const w = this.wait.get(m.id); this.wait.delete(m.id); m.error ? w.rej(new Error(m.error.message)) : w.res(m.result); return; }
      if (m.method === 'Runtime.exceptionThrown') this.errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
      if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') this.errors.push(m.params.args.map((a) => a.value || a.description).join(' '));
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/favicon|pagead|googlesyndication|fonts\.g|jsdelivr/.test(m.params.entry.url || '')) this.errors.push('log: ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
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
  async press(r) {
    if (this.touch) {
      await this.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x, y: r.y }] });
      await this.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    }
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
  const tab = new Tab(ws, width < 768);
  await tab.send('Page.enable'); await tab.send('Runtime.enable'); await tab.send('Log.enable');
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());
async function seedScores() {
  await mockRpc('__reset');
  const jobs = [];
  [['classic', [40, 60]], ['timed', [30, 50]]].forEach(([m, bs]) => bs.forEach((b) => { for (let k = 0; k < 5; k++) jobs.push(mockRpc('submit_score', { p_game: CORE.gameKey(m), p_bucket: b })); }));
  await Promise.all(jobs);
}
const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const SPY = `(() => { window.__tracks = []; const o = window.track; window.track = function (e) { window.__tracks.push(e); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden }))()`;
// 지금 과녁의 화면 좌표 (영역 + 앱 상태의 영역 안 좌표)
const TARGET = `(() => { const s = AIM_APP.state(); const a = document.getElementById('area').getBoundingClientRect(); return s.target ? { x: a.left + s.target.x, y: a.top + s.target.y, r: s.target.r } : null; })()`;
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
    visFaq: [...document.querySelectorAll('.mg-end-faq, .mg-end-share, .am-result')].filter((a) => a.offsetParent).length,
    h1: document.querySelector('h1').textContent.trim(), lang: document.documentElement.lang }))()`);
  if (st.lang !== lang) say(`<html lang> = ${st.lang}`);
  if (!st.s.start || st.s.play || st.s.end) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.visFaq) say('시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/끝 화면이 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.am-h1, .am-badge, .am-btn, .am-hook, .am-how, .am-seg-btn b, .am-seg-btn small, .am-opt-label, .am-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  const seg = await tab.eval(`[...document.querySelectorAll('.am-seg-btn span')].map((s) => s.scrollWidth > s.clientWidth + 1)`);
  if (seg.some(Boolean)) say('모드 버튼 글자가 넘침');
  await tab.shot(`${lang}-${width}-${mode}-1-start.png`);
  if (mode !== 'classic') await tab.tap(`input[name="mode"][value="${mode}"]`);
  if ((await tab.eval(`document.querySelector('input[name="mode"]:checked').value`)) !== mode) say('모드 선택이 안 됨');
  // 2) 시작 버튼 → 준비(시작 과녁)
  await tab.tap('#start-btn');
  await sleep(200);
  const c = await tab.eval(`({ s: ${SHOWN}, phase: AIM_APP.phase(), mode: document.getElementById('play-mode').textContent })`);
  if (!c.s.play || c.phase !== 'ready') say(`시작 버튼 → 게임 화면 준비 상태가 아님 (${c.phase})`);
  if (c.mode !== T.modes[mode]) say(`모드 줄 "${c.mode}"`);
  if ((await tab.eval(COUNT('start'))) !== 0) say('시작 과녁을 맞히기 전에 track(start)');
  const box = await tab.eval(`(() => { const f = document.getElementById('area').getBoundingClientRect(); return { top: f.top, left: f.left, bottom: f.bottom, right: f.right, h: innerHeight }; })()`);
  if (box.bottom > box.h + 1) say(`플레이 영역이 화면 아래로 넘침 (${Math.round(box.bottom)} > ${box.h})`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.am-hud-k, .am-hud-v, .am-mode, .am-area-main, .am-area-sub, .am-link')`)).forEach((w) => say(`게임 화면 ${w}`));
  await tab.shot(`${lang}-${width}-${mode}-2-ready.png`);
  // 시작 전 영역 구석 누름 → 세지 않음
  await tab.press({ x: box.left + 10, y: box.bottom - 10 });
  await sleep(60);
  if ((await tab.eval('AIM_APP.phase()')) !== 'ready' || (await tab.eval('AIM_APP.state().misses')) !== 0) say('시작 전 빗나감이 세어짐');
  // 3) 시작 과녁
  let tg = await tab.eval(TARGET);
  await tab.press(tg);
  await sleep(80);
  if ((await tab.eval('AIM_APP.phase()')) !== 'run') say('시작 과녁을 맞혀도 시작되지 않음');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`track('start') ${await tab.eval(COUNT('start'))}회`);
  // 빗나감 1 (과녁에서 먼 쪽 구석)
  tg = await tab.eval(TARGET);
  const far = { x: tg.x < (box.left + box.right) / 2 ? box.right - 8 : box.left + 8, y: tg.y < (box.top + box.bottom) / 2 ? box.bottom - 8 : box.top + 8 };
  await tab.press(far);
  await sleep(60);
  if ((await tab.eval('AIM_APP.state().misses')) !== 1) say('빗나감이 세어지지 않음');
  await tab.shot(`${lang}-${width}-${mode}-3-run.png`);
  // 4) 과녁 맞히기
  const t0 = Date.now();
  let escapedWait = false;
  if (mode === 'classic') {
    for (let i = 0; i < CORE.CLASSIC_TARGETS; i++) {
      tg = await tab.eval(TARGET);
      if (!tg) { say(`과녁 ${i + 1} 이 없음`); break; }
      await sleep(220);
      await tab.press(tg);
      if (i === 0) {
        const h = await tab.eval(`document.getElementById('hud-hits').textContent`);
        if (!/^1\/30$/.test(h.replace(/\s/g, ''))) say(`첫 맞힘 뒤 HUD 맞힘 "${h}"`);
      }
    }
  } else {
    while (Date.now() - t0 < CORE.TIMED_MS + 1500) {
      if ((await tab.eval('AIM_APP.phase()')) !== 'run') break;
      if (!escapedWait && Date.now() - t0 > 8000) { escapedWait = true; await sleep(CORE.LIFE_START + 200); continue; } // 한 번 놓쳐 보기
      tg = await tab.eval(TARGET);
      if (!tg) { await sleep(50); continue; }
      await sleep(380);
      await tab.press(tg);
    }
  }
  if (!(await waitFor(tab, `AIM_APP.phase() === 'end'`, 3000))) say('판이 끝나도 끝 화면이 안 나옴');
  await sleep(700); // 점수 전송 + 분포
  if ((await tab.eval(COUNT('done'))) !== 1) say(`track('done') ${await tab.eval(COUNT('done'))}회`);
  const app = await tab.eval('AIM_APP.state()');
  const r = await tab.eval(`(() => {
    const end = document.querySelector('[data-mg-end]');
    const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
    const card = document.querySelector('.am-result');
    const vis = (id) => !document.getElementById(id).hidden;
    return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
      faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
      score: document.getElementById('res-score').textContent, unit: document.getElementById('res-unit').textContent, label: document.getElementById('res-score-label').textContent,
      acc: document.getElementById('res-acc').textContent, misses: document.getElementById('res-misses').textContent, escaped: document.getElementById('res-escaped').textContent,
      cells: { avg: vis('cell-avg'), misses: vis('cell-misses'), total: vis('cell-total'), escaped: vis('cell-escaped') },
      tier: document.getElementById('res-tier').textContent, invalid: vis('res-invalid'), mode: document.getElementById('res-mode').textContent,
      rank: vis('res-rank'), top: document.getElementById('res-top').textContent,
      retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent };
  })()`);
  const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
  if (r.kids.join(',') !== order.join(',')) say(`끝 화면 순서 ${r.kids.join(' → ')}`);
  if (!r.cardBeforeEnd) say('결과 카드가 공통 끝 화면보다 위에 있지 않음');
  if (r.faqItems !== T.faq.length || r.shareBtns !== 6) say(`FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
  if (r.mode !== T.modes[mode]) say(`결과 모드 "${r.mode}"`);
  if (!T.result.tiers.includes(r.tier)) say(`등급 "${r.tier}"`);
  if (r.retry !== T.result.retry) say(`다시 하기 라벨 "${r.retry}"`);
  const classic = mode === 'classic';
  if (classic) {
    if (app.hits !== 30 || app.misses !== 1) say(`classic 맞힘 ${app.hits} / 빗나감 ${app.misses}`);
    if (r.misses !== '1' || !r.cells.misses || !r.cells.total || r.cells.avg || r.cells.escaped) say(`classic 결과 칸 (빗나감 ${r.misses}, 칸 ${JSON.stringify(r.cells)})`);
    if (r.label !== T.result.scoreClassic || r.unit !== T.result.unitMs) say(`classic 점수 이름/단위 "${r.label}" "${r.unit}"`);
  } else {
    if (!(app.hits > 20) || app.escaped < 1 || app.misses !== 1) say(`timed 맞힘 ${app.hits} / 놓침 ${app.escaped} / 빗나감 ${app.misses}`);
    if (!r.cells.avg || !r.cells.escaped || r.cells.misses || r.cells.total) say(`timed 결과 칸 ${JSON.stringify(r.cells)}`);
    if (r.label !== T.result.scoreTimed || r.unit !== T.result.unitHits) say(`timed 점수 이름/단위 "${r.label}" "${r.unit}"`);
  }
  const wantAcc = CORE.accuracy(app.hits, app.misses);
  if (!r.acc.startsWith(String(wantAcc))) say(`정확도 "${r.acc}" ≠ ${wantAcc}%`);
  if (r.invalid) say('정상 판인데 무효 안내가 보임');
  const log = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').slice(seeded);
  const scoreNum = Number(r.score.replace(/[^\d]/g, ''));
  const wantBucket = CORE.bucket(mode, scoreNum);
  if (log.length !== 1 || log[0].args.p_game !== CORE.gameKey(mode) || log[0].args.p_bucket !== wantBucket) say(`점수 전송 ${JSON.stringify(log.map((e) => e.args))} (기대 ${CORE.gameKey(mode)} / ${wantBucket})`);
  if (classic && (scoreNum < 150 || scoreNum > Date.now() - t0)) say(`평균 ${scoreNum}ms 가 이상함`);
  let rankNote = '백분위 숨김';
  if (opts.seed) {
    const p = CORE.percentile(JSON.parse(await mockRpc('score_distribution', { p_game: CORE.gameKey(mode) })), wantBucket, mode);
    const wantTop = T.result.top.replace('{n}', p.top);
    if (!r.rank || r.top !== wantTop) say(`백분위 "${r.top}" ≠ "${wantTop}" (보임 ${r.rank})`);
    rankNote = `"${r.top}"`;
  } else if (r.rank) say(`빈 서버인데 백분위가 보임 "${r.top}"`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.am-eyebrow, .am-res-mode, .am-res-label, .am-res-big, .am-stat-k, .am-stat-v, .am-tier-label, .am-tier-name, .am-pb, .am-newbest, .am-top, .am-beat, .am-others, .mg-end-retry')`)).forEach((x) => say(`끝 화면 ${x}`));
  await tab.shot(`${lang}-${width}-${mode}-4-end.png`);
  const share = await tab.eval('window.getShareData()');
  const sp = new URL(share.url).pathname;
  if (/\/(ja|zh|ko|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(sp)) say(`공유 주소에 언어가 들어감 ${share.url}`);
  if (!share.text.includes(String(wantAcc))) say(`공유 문구 "${share.text}"`);
  // 5) 다시 하기 → 새 판(준비)
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ s: ${SHOWN}, phase: AIM_APP.phase(), h: AIM_APP.state().hits })`);
  if (!again.s.play || again.phase !== 'ready' || again.h !== 0) say(`다시 하기 → 새 판 준비가 아님 (${JSON.stringify(again)})`);
  tg = await tab.eval(TARGET);
  await tab.press(tg);
  await sleep(80);
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2회여야 함)`);
  // 탭 숨김 → 무효 (visibilitychange 흉내)
  await tab.eval(`Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); 1`);
  await sleep(80);
  const inv = await tab.eval(`({ phase: AIM_APP.phase(), note: !document.getElementById('play-note').hidden })`);
  if (inv.phase !== 'ready' || !inv.note) say(`진행 중 탭 숨김 → 무효 안내 후 준비가 아님 (${JSON.stringify(inv)})`);
  await sleep(200);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, score: `${r.score} ${r.unit}`, acc: r.acc, order: r.kids.join('→'), rank: rankNote, sent: log.length, hits: app.hits, escaped: app.escaped };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'aim-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    let up = false;
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) { up = true; break; } } catch (e) { /* 기다림 */ } await sleep(150); }
    if (!up) throw new Error(`Chrome CDP :${CDP_PORT} 가 안 열림 (포트가 쓰이는 중이면 AIM_CDP_PORT 로 바꿔 다시)`);
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 에임 연습 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, { seed: true, mode: 'classic' }])));
    if (RUN_TIMED) {
      plan.push([LANGS[0], WIDTHS[0], { seed: true, mode: 'timed' }]);
      plan.push([LANGS[LANGS.length - 1], WIDTHS[WIDTHS.length - 1], { seed: false, mode: 'timed' }]); // 빈 서버: 백분위 숨김
    }
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, opts, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width} ${opts.mode}${opts.seed ? '' : ' 빈 서버'}] 시작 과녁→빗나감 1→맞힘 ${res.hits}${opts.mode === 'timed' ? ` (놓침 ${res.escaped})` : ''} → ${res.score} · 정확도 ${res.acc} · 점수 전송 ${res.sent}건 · ${res.rank} · 끝 화면 ${res.order} · 다시 하기 · 탭 숨김 무효`);
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
