#!/usr/bin/env node
/**
 * 비밀 투표 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/ballot) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음). window.confirm 은 늘 확인(true).
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다.
 *
 * 언어 × 폭마다:
 *   시작 화면(h1 검색어, 다른 화면 숨김, 맨 끝 mg-ad-start 1개, 광고 1개 보임, FAQ 없음, 넘침·단어 잘림 없음, 기본 = 시상식 템플릿 3문항 사람 뽑기)
 *   → 이름 없이 시작(오류, start 0) → 이름 4명(인원 자동 4) → 질문 추가·삭제 → 인원 +/− → 시작(start 1, 광고 안 보임, 표 수 안 보임)
 *   → 4명이 차례로 가림 → 투표용지(3문항, 다 고르기 전 버튼 꺼짐) → 저장됨(투표용지 DOM 지워짐, 저장에 표 없음, 합계 = 투표 수)
 *     (2명 뒤 새로고침 → 이어 하기 → 3번째부터) → 모두 끝 → 발표(두구두구 → 카드) 질문 1 동점 → 동점 깨기(추첨 표시, 동점 후보 중 하나)
 *     → 질문 2·3 1등 → 최종 결과(done 1, 표 수 = 계획, 끝 화면 순서·FAQ·공유 6·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 결과 링크(#d=) 열기(공유 결과 화면만, start/done 0, 표 수 같음, 끝 화면 없음) → 깨진 링크(안내) → 나도 만들기(시작 화면, 주소에 # 없음) · 콘솔 오류 0
 * + 움직임 줄이기 한 번: 음식 템플릿 · 3명 중 2명 투표 → 지금 마감 → 발표 바로(두구두구 없음) → 전체 결과(n = 2).
 *
 * 실행: node tools/flow-test.js                         (en,ko,ru × 360,1440)
 *       node tools/flow-test.js en,zh 360,375,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ru').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8871, MOCK_PORT = 8872, CDP_PORT = 9871;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  window.confirm = () => true; })();`;

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
  async rect(sel) {
    return this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 30)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`);
  }
  async tap(sel) {
    const r = await this.rect(sel);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await this.click(r.x + r.w / 2, r.y + r.h / 2);
  }
  async click(x, y) {
    await sleep(30);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async shot(file) {
    if (!SHOTS) return;
    const r = await this.send('Page.captureScreenshot', { format: 'png' });
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
  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: TRACK_SPY });
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
// 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만 — CJK·태국어는 어디서나 줄바꿈 가능)
const TEXT_FIT = `((sel) => {
  const bad = [];
  document.querySelectorAll(sel).forEach((el) => {
    if (!el.getClientRects().length || el.closest('[hidden]')) return;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).textOverflow !== 'ellipsis') bad.push('넘침: ' + (el.textContent || '').trim().slice(0, 30));
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) {
      const re = /[^\\s\\u00a0\\u202f\\-–—]+/g; let m;
      while ((m = re.exec(node.data))) {
        if (/[\\u0E00-\\u0E7F\\u3000-\\u9fff\\uac00-\\ud7af]/.test(m[0]) || m[0].length > 14) continue;
        const rg = document.createRange(); rg.setStart(node, m.index); rg.setEnd(node, m.index + m[0].length);
        const lines = new Set([...rg.getClientRects()].map((q) => Math.round(q.top)));
        if (lines.size > 1 && getComputedStyle(el).hyphens !== 'auto') bad.push('단어 잘림: ' + m[0]);
      }
    }
  });
  return bad;
})`;
// 글꼴: 이 언어 글자를 그릴 글꼴이 실제로 있는지(document.fonts.check) — 제목 글꼴 또는 대체 글꼴
const GLYPHS = { th: 'โหวตลับ', vi: 'Bỏ phiếu kín', zh: '匿名投票', ru: 'Тайное голосование', ja: '匿名投票', ko: '비밀 투표' };
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, vote: !document.getElementById('screen-vote').hidden, result: !document.getElementById('screen-result').hidden, shared: !document.getElementById('screen-shared').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(40); }
  return -1;
}
async function checkEnd(tab, T, say) {
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== T.result.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${T.result.again}"`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소가 아님: ${share.url}`);
}
// textarea·input 에 값 넣고 input 이벤트
const setVal = (sel, v) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); e.value = ${JSON.stringify(v)}; e.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`;
const RUNSTORE = `JSON.parse(localStorage.getItem('mg_ballot_run_v1') || 'null')`;

async function prepare(tab, base, lang) {
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
}
// 투표 한 장: 가림 → 준비 → 고르기 → 투표
async function voteOnce(tab, picks, say, label) {
  await tab.tap('#ready-btn');
  const b = await tab.eval(`({ qs: document.querySelectorAll('#ballot-qs .bl-bq').length, cast: document.getElementById('cast-btn').disabled, need: !document.getElementById('cast-need').hidden, host: !document.getElementById('host-tools').hidden })`);
  if (b.qs !== picks.length || !b.cast || !b.need || b.host) say(`${label} 투표용지가 다름 ${JSON.stringify(b)}`);
  for (let q = 0; q < picks.length; q++) {
    await tab.tap(`#ballot-qs .bl-bq:nth-child(${q + 1}) .bl-opt:nth-child(${picks[q] + 1})`);
    const dis = await tab.eval(`document.getElementById('cast-btn').disabled`);
    if (dis !== (q < picks.length - 1)) say(`${label} 질문 ${q + 1} 뒤 투표 버튼 disabled=${dis}`);
  }
  await tab.tap('#cast-btn');
  const after = await tab.eval(`({ inputs: document.querySelectorAll('#stage-ballot input').length, ballot: !document.getElementById('stage-ballot').hidden, run: ${RUNSTORE}, bars: document.querySelectorAll('#screen-vote .bl-bar').length, res: BALLOT_APP.results() })`);
  if (after.inputs || after.ballot || after.bars || after.res) say(`${label} 투표 뒤 투표용지/표 수가 남음 ${JSON.stringify({ i: after.inputs, b: after.ballot, bars: after.bars })}`);
  if (!after.run || /picks/.test(JSON.stringify(after.run)) || after.run.counts.some((c) => c.reduce((a, x) => a + x, 0) !== after.run.cast)) say(`${label} 저장된 진행이 이상함 ${JSON.stringify(after.run)}`);
}

async function runFull(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui, R = T.result;
  const tag = `[${lang} ${width}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, false);
  await prepare(tab, base, lang);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length,
      preset: document.querySelector('.bl-preset[aria-checked="true"]').dataset.preset, qs: document.querySelectorAll('#questions .bl-q').length,
      people: [...document.querySelectorAll('.bl-q-people')].map((c) => c.checked), resume: !document.getElementById('resume-box').hidden }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.vote || st.scr.result || st.scr.shared || !st.adLast || st.ads !== 1 || st.faq || st.resume) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  if (st.preset !== 'awards' || st.qs !== 3 || st.people.join() !== 'true,true,true') say(`기본 템플릿(시상식 3문항 사람 뽑기)이 아님 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.bl-h1, .bl-hook, .bl-btn, .bl-chip, .bl-label, .bl-hint, .bl-toggle, .bl-fair, .bl-step-value')`)).forEach((w) => say(`시작 화면 ${w}`));
  if (GLYPHS[lang]) {
    const fc = await tab.eval(`(async () => { const cs = getComputedStyle(document.querySelector('.bl-h1-main')); const fam = cs.fontFamily.split(',')[0];
      const faces = await document.fonts.load(cs.fontWeight + ' 30px ' + fam, ${JSON.stringify(GLYPHS[lang])}); return { ff: cs.fontWeight + ' ' + fam, ok: faces.length > 0 }; })()`);
    if (!fc.ok) say(`글꼴이 ${lang} 글자를 그리지 못함: ${fc.ff}`);
  }
  // 이름 없이 시작 → 오류
  await tab.tap('#start-btn');
  const e1 = await tab.eval(`({ err: document.getElementById('form-error').hidden ? '' : document.getElementById('form-error').textContent, scr: ${SCREENS}, start: ${COUNT('start')} })`);
  if (e1.err !== U.errPeople || !e1.scr.setup || e1.start) say(`이름 없이 시작했는데 ${JSON.stringify(e1)}`);
  // 이름 4명 → 인원 자동 4
  const names = U.peoplePh.split('\n');
  await tab.eval(setVal('#people', names.join('\n') + '\n' + names[0].toUpperCase()));
  const v4 = await tab.eval(`document.getElementById('voters-value').textContent`);
  if (v4 !== fmt(U.votersValue, { n: 4 })) say(`인원 자동 맞춤이 아님: ${v4}`);
  // 질문 추가 → 4개, 삭제 → 3개
  await tab.tap('#add-q');
  const q4 = await tab.eval(`({ n: document.querySelectorAll('#questions .bl-q').length, preset: !!document.querySelector('.bl-preset[aria-checked="true"]'), focus: document.activeElement.classList.contains('bl-q-title') })`);
  if (q4.n !== 4 || q4.preset || !q4.focus) say(`질문 추가가 다름 ${JSON.stringify(q4)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`질문 추가 뒤 가로 넘침 ${o}px`);
  await tab.tap('#questions .bl-q:nth-child(4) .bl-q-remove');
  if ((await tab.eval(`document.querySelectorAll('#questions .bl-q').length`)) !== 3) say('질문 삭제가 안 됨');
  await tab.tap('#voters-more'); await tab.tap('#voters-less');
  await tab.shot(`${lang}-${width}-1-setup.png`);

  // 2) 투표 시작
  await tab.tap('#start-btn');
  const sv = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')}, ads: ${VISIBLE_ADS}, prog: document.getElementById('progress-text').textContent, cover: !document.getElementById('stage-cover').hidden,
    title: document.getElementById('cover-title').textContent, finish: document.getElementById('finish-btn').disabled, bars: document.querySelectorAll('.bl-bar').length, res: BALLOT_APP.results(), p: BALLOT_APP.progress() })`);
  if (!sv.scr.vote || sv.scr.setup || sv.start !== 1 || sv.ads || !sv.cover || sv.bars || sv.res) say(`투표 시작 화면이 다름 ${JSON.stringify(sv)}`);
  if (sv.prog !== fmt(U.progress, { i: 1, n: 4 }) || sv.title !== fmt(U.coverTitle, { i: 1 }) || !sv.finish || sv.p.voters !== 4 || sv.p.questions !== 3) say(`진행 표시가 다름 ${JSON.stringify(sv)}`);
  (await tab.eval(TEXT_FIT + `('.bl-h2, .bl-btn, .bl-progress-text, .bl-stage-hint, .bl-mini')`)).forEach((w) => say(`가림 화면 ${w}`));
  // 계획: 질문 1 = 동점(0·1), 질문 2 = 2번, 질문 3 = 3번
  const plan = [[0, 2, 3], [1, 2, 3], [0, 2, 1], [1, 0, 0]];
  const expect = [[2, 2, 0, 0], [1, 0, 3, 0], [1, 1, 0, 2]];
  for (let v = 0; v < 2; v++) {
    await voteOnce(tab, plan[v], say, `투표 ${v + 1}`);
    if (v === 0) {
      (await tab.eval(TEXT_FIT + `('.bl-h2, .bl-btn, .bl-stage-hint')`)).forEach((w) => say(`저장됨 화면 ${w}`));
      await tab.shot(`${lang}-${width}-2-saved.png`);
    }
    if (!(await tab.eval(`!document.getElementById('stage-saved').hidden`))) say(`투표 ${v + 1} 뒤 저장됨 화면이 아님`);
    await tab.tap('#next-btn');
  }
  // 투표용지 캡처(3번째 사람이 고르는 중)
  // 새로고침 → 이어 하기
  await tab.goto(base);
  const rs = await tab.eval(`({ box: !document.getElementById('resume-box').hidden, text: document.getElementById('resume-text').textContent, scr: ${SCREENS} })`);
  if (!rs.box || rs.text !== fmt(U.resumeText, { c: 2, n: 4 }) || !rs.scr.setup) say(`이어 하기 안내가 다름 ${JSON.stringify(rs)}`);
  await tab.tap('#resume-btn');
  const rs2 = await tab.eval(`({ scr: ${SCREENS}, title: document.getElementById('cover-title').textContent, start: ${COUNT('start')}, finish: document.getElementById('finish-btn').disabled })`);
  if (!rs2.scr.vote || rs2.title !== fmt(U.coverTitle, { i: 3 }) || rs2.start || rs2.finish) say(`이어 하기 뒤 화면이 다름 ${JSON.stringify(rs2)}`);
  await tab.tap('#ready-btn');
  await tab.tap('#ballot-qs .bl-bq:nth-child(1) .bl-opt:nth-child(1)');
  o = await tab.eval(OVERFLOW); if (o) say(`투표용지 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.bl-bq-title, .bl-opt-name, .bl-btn, .bl-ballot-hint')`)).forEach((w) => say(`투표용지 ${w}`));
  await tab.shot(`${lang}-${width}-3-ballot.png`);
  // 투표용지를 그대로 두고 처음부터 다시 고르기 위해 가림 화면으로(새로 그림)
  await tab.eval(`document.getElementById('stage-ballot').hidden = true; document.getElementById('stage-cover').hidden = false; 1`);
  for (let v = 2; v < 4; v++) {
    await voteOnce(tab, plan[v], say, `투표 ${v + 1}`);
    if (v === 2) await tab.tap('#next-btn');
  }
  const ai = await tab.eval(`({ allin: !document.getElementById('stage-allin').hidden, title: document.getElementById('allin-title').textContent, finish: !document.getElementById('finish-btn').hidden })`);
  if (!ai.allin || ai.title !== fmt(U.allInTitle, { n: 4 }) || ai.finish) say(`모두 끝 화면이 다름 ${JSON.stringify(ai)}`);

  // 3) 발표
  await tab.tap('#reveal-btn');
  const r0 = await tab.eval(`({ scr: ${SCREENS}, step: document.getElementById('reveal-step').textContent, drum: !!document.querySelector('.bl-drum'), next: document.getElementById('reveal-next').disabled, done: ${COUNT('done')} })`);
  if (!r0.scr.result || r0.step !== fmt(R.catOf, { i: 1, n: 3 }) || !r0.drum || !r0.next || r0.done) say(`발표 시작이 다름(두구두구) ${JSON.stringify(r0)}`);
  if ((await waitFor(tab, `!!document.querySelector('#reveal-card .bl-cat')`, 4000)) < 0) say('발표 카드가 나오지 않음');
  await sleep(1000);
  const r1 = await tab.eval(`({ tie: (document.querySelector('#reveal-card .bl-tie') || {}).textContent, btn: !!document.querySelector('#reveal-card .bl-tie-btn'), bars: [...document.querySelectorAll('#reveal-card .bl-bar-count')].map((e) => e.textContent), w: document.querySelector('#reveal-card .bl-bar-fill').style.width })`);
  if (r1.tie !== R.tie || !r1.btn || r1.bars[0] !== fmt(R.bar, { c: 2, p: 50 }) || r1.w !== '100%') say(`질문 1 동점 카드가 다름 ${JSON.stringify(r1)}`);
  o = await tab.eval(OVERFLOW); if (o) say(`발표 화면 가로 넘침 ${o}px`);
  await tab.tap('#reveal-card .bl-tie-btn');
  if ((await waitFor(tab, `!!document.querySelector('#reveal-card .bl-drawn')`, 3000)) < 0) say('동점 깨기 결과가 나오지 않음');
  const tb = await tab.eval(`({ drawn: document.querySelector('#reveal-card .bl-drawn').textContent, win: document.querySelector('#reveal-card .bl-winner').textContent })`);
  const okTb = [names[0], names[1]].some((n) => tb.drawn === fmt(R.tieBroken, { name: n }) && tb.win === fmt(R.winner, { name: n }));
  if (!okTb) say(`동점 깨기 결과가 동점 후보가 아님 ${JSON.stringify(tb)}`);
  (await tab.eval(TEXT_FIT + `('.bl-cat-title, .bl-winner, .bl-tie-names, .bl-drawn, .bl-bar-name, .bl-btn, .bl-step')`)).forEach((w) => say(`발표 카드 ${w}`));
  await tab.shot(`${lang}-${width}-4-reveal.png`);
  for (let q = 1; q < 3; q++) {
    await tab.tap('#reveal-next');
    if ((await waitFor(tab, `!!document.querySelector('#reveal-card .bl-cat') && !document.getElementById('reveal-next').disabled`, 4000)) < 0) say(`질문 ${q + 1} 카드가 나오지 않음`);
    const w = await tab.eval(`document.querySelector('#reveal-card .bl-winner').textContent`);
    const exp = fmt(R.winner, { name: names[q === 1 ? 2 : 3] });
    if (w !== exp) say(`질문 ${q + 1} 1등 "${w}" ≠ "${exp}"`);
  }
  if ((await tab.eval(`document.getElementById('reveal-next').textContent`)) !== R.finish) say('마지막 질문의 버튼이 "전체 결과" 가 아님');
  await tab.tap('#reveal-next');

  // 4) 최종 결과
  const sm = await tab.eval(`({ sum: !document.getElementById('summary').hidden, cards: document.querySelectorAll('#sum-cards .bl-cat').length, sub: document.getElementById('sum-sub').textContent, done: ${COUNT('done')}, res: BALLOT_APP.results() })`);
  if (!sm.sum || sm.cards !== 3 || sm.sub !== fmt(R.summarySub, { c: 4 }) || sm.done !== 1) say(`최종 결과가 다름 ${JSON.stringify(sm)}`);
  if (!sm.res || JSON.stringify(sm.res.q.map((q) => q.c)) !== JSON.stringify(expect) || sm.res.n !== 4 || ![0, 1].includes(sm.res.q[0].b)) say(`표 수가 계획과 다름 ${JSON.stringify(sm.res && sm.res.q.map((q) => [q.c, q.b]))}`);
  await checkEnd(tab, T, say);
  o = await tab.eval(OVERFLOW); if (o) say(`최종 결과 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('#summary .bl-cat-title, #summary .bl-winner, #summary .bl-bar-name, #summary .bl-btn, .bl-h2')`)).forEach((w) => say(`최종 결과 ${w}`));
  await tab.shot(`${lang}-${width}-5-summary.png`);
  const errs1 = tab.errors.slice();

  // 5) 결과 링크
  const code = await tab.eval(`BALLOT_CORE.encodeResult(BALLOT_APP.results())`);
  const tab2 = await openTab(width, false);
  await prepare(tab2, base, lang);
  await tab2.goto('about:blank');
  await tab2.goto(base + '#d=' + code);
  const sh = await tab2.eval(`({ scr: ${SCREENS}, cards: document.querySelectorAll('#shared-cards .bl-cat').length, sub: document.getElementById('shared-sub').textContent, bad: !document.getElementById('shared-bad').hidden,
    tieBtn: document.querySelectorAll('#shared-cards .bl-tie-btn').length, drawn: document.querySelectorAll('#shared-cards .bl-drawn').length, end: [...document.querySelectorAll('[data-mg-end]')].filter((e) => e.getClientRects().length).length,
    counts: [...document.querySelectorAll('#shared-cards .bl-cat')].map((c) => [...c.querySelectorAll('.bl-bar-count')].map((e) => e.textContent)), start: ${COUNT('start')}, done: ${COUNT('done')}, ads: ${VISIBLE_ADS} })`);
  if (!sh.scr.shared || sh.scr.setup || sh.cards !== 3 || sh.sub !== fmt(R.sharedSub, { c: 4 }) || sh.bad || sh.tieBtn || sh.drawn !== 1 || sh.end || sh.start || sh.done || sh.ads) say(`공유 결과 화면이 다름 ${JSON.stringify(sh)}`);
  if (sh.counts[1][0] !== fmt(R.bar, { c: 3, p: 75 })) say(`공유 결과 표 수가 다름 ${JSON.stringify(sh.counts)}`);
  o = await tab2.eval(OVERFLOW); if (o) say(`공유 결과 가로 넘침 ${o}px`);
  await tab2.shot(`${lang}-${width}-6-shared.png`);
  await tab2.goto('about:blank');
  await tab2.goto(base + '#d=abc');
  const shb = await tab2.eval(`({ bad: !document.getElementById('shared-bad').hidden, cards: document.querySelectorAll('#shared-cards .bl-cat').length, scr: ${SCREENS} })`);
  if (!shb.bad || shb.cards || !shb.scr.shared) say(`깨진 링크 안내가 다름 ${JSON.stringify(shb)}`);
  await tab2.tap('#make-own');
  const mo = await tab2.eval(`({ scr: ${SCREENS}, hash: location.hash, start: ${COUNT('start')} })`);
  if (!mo.scr.setup || mo.hash || mo.start) say(`나도 만들기 뒤 화면이 다름 ${JSON.stringify(mo)}`);
  errs1.concat(tab2.errors).forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {}); await tab2.send('Page.close').catch(() => {});
  return { problems };
}

// 움직임 줄이기: 음식 템플릿 · 인원 최소 2 → 3 · 3명 중 2명 → 지금 마감 → 바로 발표
async function runReduced(lang, width, report) {
  const T = L10N[lang];
  const U = T.ui, R = T.result;
  const tag = `[${lang} ${width} 움직임 줄이기]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, true);
  await prepare(tab, base, lang);
  await tab.tap('#preset-food');
  const f = await tab.eval(`({ qs: document.querySelectorAll('#questions .bl-q').length, people: document.querySelector('.bl-q-people').checked, opts: document.querySelector('.bl-q-opts').value })`);
  if (f.qs !== 1 || f.people || f.opts !== U.presets[1].questions[0].o.join('\n')) say(`음식 템플릿이 다름 ${JSON.stringify(f)}`);
  for (let i = 0; i < 6; i++) await tab.tap('#voters-less');
  await tab.tap('#voters-more');
  if ((await tab.eval(`document.getElementById('voters-value').textContent`)) !== fmt(U.votersValue, { n: 3 })) say('인원 3 이 아님');
  await tab.tap('#start-btn');
  await voteOnce(tab, [4], say, '투표 1'); await tab.tap('#next-btn');
  await voteOnce(tab, [4], say, '투표 2'); await tab.tap('#next-btn');
  await tab.tap('#finish-btn');
  const r = await tab.eval(`({ scr: ${SCREENS}, drum: !!document.querySelector('.bl-drum'), card: !!document.querySelector('#reveal-card .bl-cat'), next: document.getElementById('reveal-next').textContent, w: document.querySelector('#reveal-card .bl-winner').textContent, fill: document.querySelector('#reveal-card .bl-bar-fill').style.width })`);
  if (!r.scr.result || r.drum || !r.card || r.next !== R.finish || r.w !== fmt(R.winner, { name: U.presets[1].questions[0].o[4] }) || r.fill !== '100%') say(`움직임 줄이기 발표가 다름 ${JSON.stringify(r)}`);
  await tab.tap('#reveal-next');
  const s = await tab.eval(`({ sub: document.getElementById('sum-sub').textContent, done: ${COUNT('done')}, start: ${COUNT('start')} })`);
  if (s.sub !== fmt(R.summarySub, { c: 2 }) || s.done !== 1 || s.start !== 1) say(`마감 뒤 결과가 다름 ${JSON.stringify(s)}`);
  await checkEnd(tab, T, say);
  // 다시 하기 = 같은 질문으로 새 투표(start 2)
  await tab.tap('.mg-end-retry');
  const rt = await tab.eval(`({ scr: ${SCREENS}, start: ${COUNT('start')}, p: BALLOT_APP.progress() })`);
  if (!rt.scr.vote || rt.start !== 2 || rt.p.cast !== 0 || rt.p.voters !== 3) say(`다시 하기가 다름 ${JSON.stringify(rt)}`);
  tab.errors.forEach((e) => say(`콘솔 오류: ${e}`));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'ballot-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 비밀 투표 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    for (const lang of LANGS) {
      for (const w of WIDTHS) {
        const res = await runFull(lang, w, report);
        problems += res.problems; runs++;
        console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${w}] 시작(오류·이름·질문 추가/삭제·인원) → 4명 투표(2명 뒤 새로고침·이어 하기) → 두구두구 발표 · 동점 깨기 → 최종 결과·끝 화면 → 결과 링크 · 깨진 링크 · 나도 만들기`);
      }
    }
    const res = await runReduced(LANGS[0], WIDTHS.find((w) => w < 768) || 360, report);
    problems += res.problems; runs++;
    console.log(`  ${res.problems ? '✗' : '✓'} [${LANGS[0]} 움직임 줄이기] 음식 템플릿 · 인원 최소 2 → 3 · 3명 중 2명 → 지금 마감 → 바로 발표 → 결과 → 다시 하기`);
  } finally {
    chrome.kill(); mock.kill(); server.kill();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* noop */ }
  }
  console.log(`\n흐름 ${runs}회, 문제 ${problems}건`);
  if (problems) { console.log('결과: FAIL'); process.exit(1); }
  console.log('결과: PASS');
}

main().catch((e) => { console.error(e); process.exit(1); });
