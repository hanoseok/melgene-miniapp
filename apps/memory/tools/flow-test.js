#!/usr/bin/env node
/**
 * memory(카드 짝 맞추기) 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/memory) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * 모의 서버에 점수 분포를 미리 심는다(memory-easy/normal/hard: 15초·60초 구간 5명씩) → "상위 %"가 보여야 함.
 *   마지막 한 번은 빈 서버로 돌려 백분위가 숨는지 본다.
 * 언어 × 화면 폭 × 난이도마다:
 *   시작(티징만: 맨 끝 광고 1·FAQ·결과 없음, h1 검색어, 한 줄 방법) → 난이도 고르기 → 시작(track start 1회, 카드 모두 뒷면·그림 DOM 없음, 시계 0)
 *   → 판이 화면 안에 들어옴·카드 크기(360px 에서 손가락으로 누를 만큼) → 틀린 두 장(수 1, 0.7초 뒤 다시 엎임)
 *   → 탭 숨김 흉내(visibilitychange) = 일시정지 덮개·시계 멈춤 → 눌러서 이어 하기
 *   → 짝을 차례로 맞추기(pointerdown) → 끝 화면(track done 1회)
 *     · 결과 카드 → 공통 끝 화면(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *     · 큰 숫자 = 앱 시계, 수·정확도, 최고 기록 줄, 난이도 배지
 *     · 백분위 = 모의 서버 실제 값(심은 경우) / 숨김(빈 서버) · 점수 전송 1건(game 이름·bucket)
 *     · 공유 주소 = 언어 없는 주소, 공유 문구에 시간·수
 *   → 다시 하기 = 새 판(track start 2회째)
 *   · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *
 * 실행: node tools/flow-test.js                         (en,ko × 360,1440 × easy/hard + 나머지 언어 360 easy + 빈 서버 1회)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 *       포트: MEMORY_HTTP_PORT(8961) MEMORY_MOCK_PORT(8962) MEMORY_CDP_PORT(9461)
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'memory-core.js'));
const L10N = G.loadSiteLocales(SITE);
const ARG_LANGS = process.argv[2] ? process.argv[2].split(',') : null;
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = Number(process.env.MEMORY_HTTP_PORT || 8961), MOCK_PORT = Number(process.env.MEMORY_MOCK_PORT || 8962), CDP_PORT = Number(process.env.MEMORY_CDP_PORT || 9461);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TAP_GAP = 260; // 카드 사이 간격(ms) — 너무 빠르면 plausible(easy 4초) 아래로 내려가 점수를 안 보낸다

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
  Object.values(CORE.LEVELS).forEach((m) => [15, 60].forEach((sec) => { for (let k = 0; k < 5; k++) jobs.push(mockRpc('submit_score', { p_game: m.game, p_bucket: CORE.bucket(sec) })); }));
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
const HIDE = (hidden) => `(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => ${hidden} }); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => '${hidden ? 'hidden' : 'visible'}' }); document.dispatchEvent(new Event('visibilitychange')); return 1; })()`;

async function runOne(lang, width, opts, report) {
  const T = L10N[lang];
  const level = opts.level || 'easy';
  const L = CORE.LEVELS[level];
  const tag = `[${lang} ${width} ${level}${opts.seed ? '' : ' 빈 서버'}]`;
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
    visFaq: [...document.querySelectorAll('.mg-end-faq, .mg-end-share, .mm-result')].filter((a) => a.offsetParent).length,
    h1: document.querySelector('h1').textContent.trim(), lang: document.documentElement.lang, how: document.querySelector('.mm-how').innerText }))()`);
  if (st.lang !== lang) say(`<html lang> = ${st.lang}`);
  if (!st.s.start || st.s.play || st.s.end) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.visFaq) say('시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/끝 화면이 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (st.how.trim() !== T.start.how) say('시작 화면에 한 줄 방법이 안 보임');
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.mm-h1, .mm-badge, .mm-btn, .mm-hook, .mm-how, .mm-level-name, .mm-level-grid')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-${level}-1-start.png`);
  if (level !== 'easy') await tab.tap(`.mm-level[data-level="${level}"]`);
  if ((await tab.eval(`document.querySelector('.mm-level[aria-checked="true"]').getAttribute('data-level')`)) !== level) say('난이도 선택이 안 됨');
  // 2) 시작
  await tab.tap('#start-btn');
  await sleep(150);
  const c = await tab.eval(`({ s: ${SHOWN}, n: document.querySelectorAll('.mm-card').length, faces: [...document.querySelectorAll('.mm-card-front')].filter((f) => f.textContent.trim()).length, up: document.querySelectorAll('.mm-card.is-up').length, phase: MEMORY_APP.phase(), t: document.getElementById('hud-time').textContent, pairs: document.getElementById('hud-pairs').textContent })`);
  if (!c.s.play) say('시작 버튼 → 게임 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`track('start') ${await tab.eval(COUNT('start'))}회`);
  if (c.n !== L.pairs * 2 || c.faces || c.up || c.phase !== 'ready') say(`시작 판: 카드 ${c.n}, 그림 ${c.faces}, 앞면 ${c.up}, ${c.phase}`);
  if (c.pairs !== `0/${L.pairs}`) say(`HUD 짝 "${c.pairs}"`);
  await sleep(400);
  if (MEMORY_TIME_ZERO(await tab.eval(`document.getElementById('hud-time').textContent`))) say('첫 카드 전에 시계가 돌아감');
  const geo = await tab.eval(`(() => { const f = document.getElementById('field').getBoundingClientRect(); const k = document.querySelector('.mm-card').getBoundingClientRect(); return { bottom: f.bottom, h: innerHeight, cw: k.width, ch: k.height }; })()`);
  if (geo.bottom > geo.h + 1) say(`판이 화면 아래로 넘침 (${Math.round(geo.bottom)} > ${geo.h})`);
  if (geo.cw < 44 || geo.ch < 44) say(`카드가 너무 작음 ${Math.round(geo.cw)}×${Math.round(geo.ch)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.mm-hud-label, .mm-hud-val')`)).forEach((w) => say(`게임 화면 ${w}`));
  // 3) 틀린 두 장
  const st0 = await tab.eval('MEMORY_APP.state().cards.map((c) => c.sym)');
  const b = st0.findIndex((s, i) => i > 0 && s !== st0[0]);
  await tab.tap(`.mm-card[data-i="0"]`, false);
  await sleep(120);
  await tab.tap(`.mm-card[data-i="${b}"]`, false);
  await sleep(120);
  const m1 = await tab.eval(`({ up: document.querySelectorAll('.mm-card.is-up').length, moves: document.getElementById('hud-moves').textContent, phase: MEMORY_APP.phase(), face: document.querySelector('.mm-card[data-i="0"] .mm-card-front').textContent })`);
  if (m1.up !== 2 || m1.moves !== '1' || m1.phase !== 'play' || !m1.face) say(`틀린 두 장: 앞면 ${m1.up}, 수 ${m1.moves}, ${m1.phase}, 그림 "${m1.face}"`);
  await tab.shot(`${lang}-${width}-${level}-2-play.png`);
  await sleep(1200);
  const m2 = await tab.eval(`({ up: document.querySelectorAll('.mm-card.is-up').length, faces: [...document.querySelectorAll('.mm-card-front')].filter((f) => f.textContent.trim()).length })`);
  if (m2.up !== 0 || m2.faces !== 0) say(`0.7초 뒤 다시 엎이지 않음 (앞면 ${m2.up}, 그림 ${m2.faces})`);
  // 4) 일시정지
  await tab.eval(HIDE(true));
  const p1 = await tab.eval(`({ phase: MEMORY_APP.phase(), pause: !document.getElementById('pause-btn').hidden, t: MEMORY_APP.elapsed() })`);
  await sleep(500);
  const p2 = await tab.eval('MEMORY_APP.elapsed()');
  if (p1.phase !== 'paused' || !p1.pause || Math.abs(p2 - p1.t) > 1) say(`일시정지: ${p1.phase}, 덮개 ${p1.pause}, 시계 ${p1.t}→${p2}`);
  await tab.eval(HIDE(false));
  await tab.tap('#pause-btn', false);
  if ((await tab.eval('MEMORY_APP.phase()')) !== 'play') say('일시정지 → 눌러도 이어지지 않음');
  // 5) 짝 맞추기
  const t0 = Date.now();
  const done = new Set();
  for (let i = 0; i < st0.length; i++) {
    if (done.has(i)) continue;
    const j = st0.findIndex((s, k) => k !== i && s === st0[i]);
    for (const k of [i, j]) { await tab.tap(`.mm-card[data-i="${k}"]`, false); await sleep(TAP_GAP); }
    done.add(i); done.add(j);
    if (done.size === 2) {
      const h = await tab.eval(`({ pairs: document.getElementById('hud-pairs').textContent, moves: document.getElementById('hud-moves').textContent, m: document.querySelectorAll('.mm-card.is-matched').length })`);
      if (h.pairs !== `1/${L.pairs}` || h.moves !== '2' || h.m !== 2) say(`첫 짝 뒤 HUD: 짝 ${h.pairs}, 수 ${h.moves}, 짝 카드 ${h.m}`);
    }
  }
  const wall = Date.now() - t0;
  if (!(await waitFor(tab, `MEMORY_APP.phase() === 'end'`, 3000))) say('마지막 짝 뒤 끝 화면이 안 나옴');
  await sleep(700);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`track('done') ${await tab.eval(COUNT('done'))}회`);
  const r = await tab.eval(`(() => {
    const end = document.querySelector('[data-mg-end]');
    const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
    const card = document.querySelector('.mm-result');
    return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
      faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
      big: document.getElementById('res-big').textContent, moves: document.getElementById('res-moves').textContent, acc: document.getElementById('res-acc').textContent,
      best: document.getElementById('res-best').textContent, level: document.getElementById('res-level').textContent,
      rank: !document.getElementById('res-rank').hidden, top: document.getElementById('res-top').textContent,
      ms: MEMORY_APP.elapsed(), sm: MEMORY_APP.state().moves, retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent };
  })()`);
  const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
  if (r.kids.join(',') !== order.join(',')) say(`끝 화면 순서 ${r.kids.join(' → ')}`);
  if (!r.cardBeforeEnd) say('결과 카드가 공통 끝 화면보다 위에 있지 않음');
  if (r.faqItems !== T.faq.length || r.shareBtns !== 6) say(`FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
  const wantBig = await tab.eval(`(Math.floor(${r.ms} / 100) / 10).toLocaleString('${lang}', { minimumFractionDigits: 1, maximumFractionDigits: 1 })`);
  if (r.big !== wantBig) say(`큰 숫자 "${r.big}" ≠ 앱 시계 "${wantBig}"`);
  if (r.ms < 500 || r.ms > wall + 3000) say(`시간 ${r.ms}ms 가 이상함 (짝 맞추기 ${wall}ms)`);
  if (r.sm !== L.pairs + 1) say(`수 ${r.sm} ≠ ${L.pairs + 1} (틀린 1번 + 짝 ${L.pairs})`);
  const wantAcc = Math.round((L.pairs / (L.pairs + 1)) * 100);
  if (!r.acc.includes(String(wantAcc))) say(`정확도 "${r.acc}" (기대 ${wantAcc}%)`);
  if (!r.best.includes(r.big)) say(`최고 기록 줄 "${r.best}" 에 이번 기록이 없음`);
  if (!r.level.includes(T.start.levels[level]) || !r.level.includes(`${L.cols} × ${L.rows}`)) say(`난이도 배지 "${r.level}"`);
  if (r.retry !== T.result.retry) say(`다시 하기 라벨 "${r.retry}"`);
  const sec = r.ms / 1000;
  const log = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'submit_score').slice(seeded);
  const shouldSend = CORE.plausible(level, sec, r.sm);
  if (!shouldSend) say(`plausible 아래 (${sec}s) — TAP_GAP 을 늘릴 것`);
  else if (log.length !== 1 || log[0].args.p_game !== L.game || log[0].args.p_bucket !== CORE.bucket(sec)) say(`점수 전송 ${JSON.stringify(log.map((e) => e.args))} (기대 ${L.game} / ${CORE.bucket(sec)})`);
  let rankNote = '백분위 숨김';
  if (opts.seed && shouldSend) {
    const p = CORE.percentile(JSON.parse(await mockRpc('score_distribution', { p_game: L.game })), CORE.bucket(sec));
    const wantTop = T.result.top.replace('{n}', p.top);
    if (!r.rank || r.top !== wantTop) say(`백분위 "${r.top}" ≠ "${wantTop}" (보임 ${r.rank})`);
    rankNote = `"${r.top}"`;
  } else if (r.rank) say(`빈 서버인데 백분위가 보임 "${r.top}"`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.mm-eyebrow, .mm-head, .mm-best, .mm-newbest, .mm-stat dt, .mm-top, .mm-beat, .mm-others, .mg-end-retry')`)).forEach((x) => say(`끝 화면 ${x}`));
  await tab.shot(`${lang}-${width}-${level}-3-end.png`);
  const share = await tab.eval('window.getShareData()');
  const sp = new URL(share.url).pathname;
  if (/\/(ja|zh|ko|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(sp)) say(`공유 주소에 언어가 들어감 ${share.url}`);
  if (!share.text.includes(r.big) || !share.text.includes(r.moves)) say(`공유 문구 "${share.text}"`);
  // 6) 다시 하기 → 새 판
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`({ s: ${SHOWN}, phase: MEMORY_APP.phase(), m: MEMORY_APP.state().moves, up: document.querySelectorAll('.mm-card.is-up').length })`);
  if (!again.s.play || again.phase !== 'ready' || again.m !== 0 || again.up) say(`다시 하기 → 새 판이 아님 (${JSON.stringify(again)})`);
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2회여야 함)`);
  await sleep(300);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, big: r.big, moves: r.moves, acc: r.acc, order: r.kids.join('→'), rank: rankNote, sent: log.length };
}
function MEMORY_TIME_ZERO(txt) { return !/^0[.,]0$/.test(String(txt).trim()); }

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    let up = false;
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) { up = true; break; } } catch (e) { /* 기다림 */ } await sleep(150); }
    if (!up) throw new Error(`Chrome CDP :${CDP_PORT} 가 안 열림 (포트가 쓰이는 중이면 MEMORY_CDP_PORT 로 바꿔 다시)`);
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    const plan = [];
    if (ARG_LANGS) ARG_LANGS.forEach((lang) => WIDTHS.forEach((w) => ['easy', 'hard'].forEach((lv) => plan.push([lang, w, { seed: true, level: lv }]))));
    else {
      ['en', 'ko'].forEach((lang) => WIDTHS.forEach((w) => ['easy', 'hard'].forEach((lv) => plan.push([lang, w, { seed: true, level: lv }]))));
      G.LOCALES.map((l) => l.code).filter((l) => l !== 'en' && l !== 'ko').forEach((lang) => plan.push([lang, 360, { seed: true, level: lang === 'th' || lang === 'ru' ? 'hard' : lang === 'de' ? 'normal' : 'easy' }]));
    }
    plan.push([plan[plan.length - 1][0], 360, { seed: false, level: 'normal' }]); // 빈 서버: 백분위 숨김
    console.log(`\n=== memory 흐름 검사 (${plan.length}회) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, opts, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width} ${opts.level}${opts.seed ? '' : ' 빈 서버'}] 시작→틀린 두 장→일시정지→짝 ${CORE.LEVELS[opts.level].pairs}개 → ${res.big}초 · 수 ${res.moves} · 정확도 ${res.acc} · 점수 전송 ${res.sent}건 · ${res.rank} · 끝 화면 ${res.order} · 다시 하기`);
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
