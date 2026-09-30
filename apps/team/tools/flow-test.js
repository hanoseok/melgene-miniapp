#!/usr/bin/env node
/**
 * 랜덤 팀 나누기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/team) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 언어 × 화면 폭마다:
 *   시작(티징만: 광고·FAQ·입력 없음) → 시작 → 입력(광고 1자리, 예시 이름, 주장 * 3명, 팀 수 3, 주장 나누기 켬)
 *   → 섞기(track('start') 1, 애니메이션 약 1.5초 동안 버튼 잠금, 끝나면 track('done') 1)
 *   → 결과: 팀 3개 × 4명, 모든 이름 한 번씩, 주장은 팀마다 1명, 팀 이름·인원 표시, 공통 끝 화면 순서(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   → 텍스트 복사(토스트) · 팀 이름 다시 뽑기(팀 그대로, 기록 없음) · 다시 섞기(start/done 한 번 더)
 *   → 공유 링크(#d=, 언어 없는 주소): 새 탭에서 열면 같은 팀이 그대로 + "공유받은 팀" + 기록 없음 + "나도 만들기" → 입력 화면(주소의 #d= 지움)
 *   → 잘못된 링크는 시작 화면 + 안내 · 다시 열면 마지막 이름 목록·방식이 그대로(localStorage)
 *   → 팀당 인원 모드 + 60명(넘치는 이름 버림 안내) · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *   + 움직임 줄이기(prefers-reduced-motion) 한 번: 애니메이션 없이 바로 결과.
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
const CORE = require(path.join(SITE, 'team-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8751, MOCK_PORT = 8752, CDP_PORT = 9751;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 페이지 스크립트보다 먼저: window.track 에 무엇이 들어오든 부를 때마다 __tracks 에 남긴다
const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } }); })();`;

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
    await this.eval('window.scrollTo(0, 0); 1');
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
  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: TRACK_SPY });
  await tab.send('Emulation.setDeviceMetricsOverride', { width, height: width >= 768 ? 900 : 760, deviceScaleFactor: 2, mobile: width < 768 });
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  return tab;
}
const mockRpc = (n, b) => fetch(`http://localhost:${MOCK_PORT}/rest/v1/rpc/${n}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b || {}) }).then((r) => r.text());

const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, input: !document.getElementById('screen-input').hidden, result: !document.getElementById('screen-result').hidden }))()`;
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
// 화면에 그려진 팀: [{ id, name, count, members: [{ name, lead }] }]
const DOM_TEAMS = `[...document.querySelectorAll('#teams .tm-team')].map((b) => ({ id: b.getAttribute('data-team'), name: b.querySelector('.tm-team-name').textContent,
  count: Number(b.querySelector('.tm-team-count').textContent), members: [...b.querySelectorAll('.tm-chip')].map((c) => ({ name: c.querySelector('.tm-chip-name').textContent, lead: c.classList.contains('is-lead') })) }))`;
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';

async function waitIdle(tab, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (!(await tab.eval('window.TEAM_APP.busy()'))) return Date.now() - t0; await sleep(50); }
  return -1;
}
async function setNames(tab, text) {
  await tab.eval(`(() => { const t = document.getElementById('names'); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
  await sleep(320); // 저장(250ms 디바운스)
}

function checkTeams(say, T, dom, names, leaders, k, where) {
  if (dom.length !== k) { say(`${where}: 팀 ${dom.length}개 ≠ ${k}`); return; }
  const all = dom.flatMap((t) => t.members.map((m) => m.name));
  if (all.length !== names.length || [...all].sort().join('|') !== [...names].sort().join('|')) say(`${where}: 이름이 모두 한 번씩이 아님`);
  const sizes = dom.map((t) => t.members.length);
  if (Math.max(...sizes) - Math.min(...sizes) > 1) say(`${where}: 인원 차이 > 1 (${sizes})`);
  dom.forEach((t) => {
    if (t.count !== t.members.length) say(`${where}: ${t.name} 인원 표시 ${t.count} ≠ ${t.members.length}`);
    if (T.teams[t.id] !== t.name) say(`${where}: 팀 이름 "${t.name}" ≠ 언어 파일 "${T.teams[t.id]}"`);
  });
  if (new Set(dom.map((t) => t.id)).size !== k) say(`${where}: 팀 이름 중복`);
  if (leaders) {
    const per = dom.map((t) => t.members.filter((m) => m.lead).length);
    const L = per.reduce((a, b) => a + b, 0);
    if (L !== leaders || Math.max(...per) > Math.ceil(L / k)) say(`${where}: 주장 나눔 ${per}`);
  } else if (dom.some((t) => t.members.some((m) => m.lead))) say(`${where}: 주장 모드가 아닌데 ★`);
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const I = T.input;
  const R = T.result;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  const info = { anim: 0 };

  // 1) 시작 화면 (티징만)
  const st = await tab.eval(`(() => ({ s: ${SHOWN}, visAds: [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent).length,
    visFaq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.offsetParent).length, h1: document.querySelector('h1').textContent.trim(),
    input: !!document.querySelector('#screen-start textarea') }))()`);
  if (!st.s.start || st.s.input || st.s.result) say('시작 화면이 먼저 보이지 않음');
  if (st.visAds || st.visFaq || st.input) say('시작 화면에 광고/FAQ/입력이 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.tm-h1, .tm-badge, .tm-btn, .tm-hook, .tm-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);

  // 2) 입력 화면
  await tab.tap('#start-btn');
  if (!(await tab.eval(SHOWN)).input) say('시작 버튼 → 입력 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 0) say('입력 화면만 열었는데 track(start)');
  const ads = await tab.eval(`[...document.querySelectorAll('.mg-ad')].filter((a) => a.closest('#screen-input')).length`);
  if (ads !== 1) say(`입력 화면 광고 자리 ${ads}개 (1)`);
  if (!(await tab.eval(`document.getElementById('shuffle-btn').disabled`))) say('이름이 없는데 섞기 버튼이 눌림');
  await tab.tap('#sample-btn');
  const sv = await tab.eval(`document.getElementById('names').value`);
  if (sv !== T.sample.join('\n')) say('예시 이름 버튼이 언어 파일 sample 을 넣지 않음');
  const pr = new Intl.PluralRules(lang);
  const ppl = (n) => G.fmt(T.people[pr.select(n)] || T.people.other, { n });
  if ((await tab.eval(`document.getElementById('people-count').textContent`)) !== ppl(12)) say(`사람 수 표시 "${await tab.eval(`document.getElementById('people-count').textContent`)}" ≠ "${ppl(12)}"`);
  // 주장 3명 표시 + 쉼표 섞어 쓰기
  const names = T.sample.slice(0, 12);
  const text = names.map((n, i) => (i < 3 ? '*' : '') + n).slice(0, 9).join('\n') + '\n' + names.slice(9).join(', ');
  await setNames(tab, text);
  await tab.tap('#step-plus'); // 2 → 3팀
  const pv = await tab.eval(`document.getElementById('preview').textContent`);
  if (pv !== G.fmt(I.previewEq, { k: 3, size: 4 })) say(`미리보기 "${pv}" ≠ "${G.fmt(I.previewEq, { k: 3, size: 4 })}"`);
  await tab.tap('.tm-check');
  if (!(await tab.eval(`document.getElementById('leaders').checked`))) say('주장 나누기 체크가 안 됨');
  if ((await tab.eval(`document.getElementById('leaders-note').textContent`)) !== G.fmt(I.leadersCount, { n: 3 })) say('주장 수 안내가 다름');
  o = await tab.eval(OVERFLOW); if (o) say(`입력 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.tm-h2, .tm-label, .tm-hint, .tm-seg-btn, .tm-preview, .tm-check-text, .tm-mini, .tm-count, .tm-btn, .tm-step-num')`)).forEach((w) => say(`입력 화면 ${w}`));
  const segH = await tab.eval(`[...document.querySelectorAll('.tm-seg-btn')].map((b) => Math.round(b.getBoundingClientRect().height))`);
  if (segH[0] !== segH[1]) say(`방식 버튼 높이가 다름 ${segH}`);
  await tab.shot(`${lang}-${width}-2-input.png`);

  // 3) 섞기 → 결과
  const t0 = Date.now();
  await tab.tap('#shuffle-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`섞기 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  if (!(await tab.eval(SHOWN)).result) say('섞기 → 결과 화면이 안 보임');
  if (!opts.reduced) {
    const mid = await tab.eval(`({ busy: window.TEAM_APP.busy(), deck: !document.getElementById('deck').hidden, again: document.getElementById('again-btn').disabled, done: ${COUNT('done')} })`);
    if (!mid.busy || !mid.deck || !mid.again) say('애니메이션 중 표시/잠금이 없음');
    if (mid.done) say('애니메이션이 끝나기 전에 track(done)');
    await sleep(300);
    await tab.shot(`${lang}-${width}-3-shuffling.png`);
  }
  const idle = await waitIdle(tab, 4000);
  info.anim = Date.now() - t0;
  if (idle < 0) say('애니메이션이 끝나지 않음');
  else if (!opts.reduced && (info.anim < 900 || info.anim > 2600)) say(`섞기 애니메이션 ${info.anim}ms (약 1.5초)`);
  else if (opts.reduced && info.anim > 600) say(`움직임 줄이기인데 ${info.anim}ms`);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`결과 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  if (!(await tab.eval(`document.getElementById('deck').hidden`))) say('애니메이션 뒤에도 주사위 덱이 보임');
  await sleep(150);
  const dom1 = await tab.eval(DOM_TEAMS);
  checkTeams(say, T, dom1, names, 3, 3, '결과');
  const res1 = await tab.eval('window.TEAM_APP.result()');
  if (!res1 || !CORE.validResult(res1) || res1.teams.map((t) => t.map((i) => res1.people[i].name).join('|')).join('/') !== dom1.map((t) => t.members.map((m) => m.name).join('|')).join('/')) say('화면 팀과 내부 결과가 다름');
  if ((await tab.eval(`document.getElementById('result-title').textContent`)) !== R.title) say('결과 제목이 다름');
  if (!(await tab.eval(`document.getElementById('shared-note').hidden`))) say('내가 만든 결과인데 "공유받은" 안내');
  const order = await tab.eval(END_ORDER);
  if (order.join(',') !== ORDER) say(`끝 화면 순서 ${order.join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent,
    teamsBeforeEnd: !!(document.getElementById('teams').compareDocumentPosition(document.querySelector('[data-mg-end]')) & Node.DOCUMENT_POSITION_FOLLOWING) })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.again}"`);
  if (!endInfo.teamsBeforeEnd) say('팀 카드가 공통 끝 화면보다 위에 있지 않음');
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.tm-h2, .tm-team-name, .tm-chip-name, .tm-team-count, .tm-mini, .tm-btn, .mg-end-retry, .mg-end-h')`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.shot(`${lang}-${width}-4-result.png`);
  // 팀 이름 20개가 모두 이 폭의 팀 상자 머리에 들어가는지 (첫 상자에 하나씩 넣어 본다)
  const fitAll = await tab.eval(`(() => { const el = document.querySelector('#teams .tm-team-name'); const keep = el.textContent; const out = [];
    for (const n of ${JSON.stringify(Object.values(T.teams))}) { el.textContent = n; ${TEXT_FIT}('#teams .tm-team:first-child .tm-team-head').forEach((w) => out.push(n + ' ' + w)); }
    el.textContent = keep; return out; })()`);
  fitAll.forEach((w) => say(`팀 이름 폭 ${w}`));

  // 4) 텍스트 복사
  const txt = await tab.eval('window.TEAM_APP.text()');
  dom1.forEach((t) => { if (!txt.includes(t.name) || t.members.some((m) => !txt.includes(m.name))) say(`복사 텍스트에 ${t.name} 팀 내용이 없음`); });
  if (!/#d=[A-Za-z0-9_-]+$/.test(txt.trim())) say('복사 텍스트 끝에 공유 링크가 없음');
  await tab.tap('#copy-btn');
  await sleep(350);
  const toastTxt = await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`);
  if (toastTxt !== R.copied) say(`복사 안내 "${toastTxt}" ≠ "${R.copied}"`);

  // 5) 팀 이름만 다시 뽑기
  await tab.tap('#rename-btn');
  await sleep(450);
  const dom2 = await tab.eval(DOM_TEAMS);
  if (dom2.map((t) => t.members.map((m) => m.name).join('|')).join('/') !== dom1.map((t) => t.members.map((m) => m.name).join('|')).join('/')) say('팀 이름 바꾸기인데 팀 구성이 바뀜');
  if (dom2.map((t) => t.id).join() === dom1.map((t) => t.id).join()) say('팀 이름 바꾸기인데 이름이 그대로');
  checkTeams(say, T, dom2, names, 3, 3, '이름 바꾼 뒤');
  if ((await tab.eval(COUNT('start'))) !== 1 || (await tab.eval(COUNT('done'))) !== 1) say('팀 이름 바꾸기가 start/done 을 기록함');

  // 6) 공유 링크
  const share = await tab.eval('window.getShareData()');
  if (share.text !== G.fmt(R.shareText, { k: 3 })) say(`공유 문구 "${share.text}"`);
  const su = new URL(share.url);
  if (!/^#d=[A-Za-z0-9_-]+$/.test(su.hash)) say(`공유 주소에 #d= 없음: ${share.url}`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\/|[?&]lang=/.test(su.pathname + su.search)) say(`공유 주소에 언어가 들어감: ${su.pathname}`);
  const sharedDom = dom2;
  // 받는 사람: 새 탭 (같은 언어 설정의 다른 사람), 언어 폴더 주소 + 같은 #d=
  const tab2 = await openTab(width, opts.reduced);
  await tab2.goto(base + '#nolang');
  // 같은 브라우저 프로필이라 localStorage 를 지우면 보낸 사람 목록도 지워진다 → 언어·모의 서버만 맞춘다
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab2.goto(base + su.hash);
  await sleep(200);
  const rs = await tab2.eval(`({ s: ${SHOWN}, shared: window.TEAM_APP.shared(), note: !document.getElementById('shared-note').hidden, title: document.getElementById('result-title').textContent,
    actions: !document.getElementById('result-actions').hidden, own: !document.getElementById('make-own-btn').hidden, start: ${COUNT('start')}, done: ${COUNT('done')}, retry: (document.querySelector('.mg-end-retry') || {}).textContent })`);
  if (!rs.s.result || !rs.shared) say('공유 링크를 열었는데 결과가 안 보임');
  if (!rs.note || rs.title !== R.sharedTitle || rs.actions || !rs.own) say('공유 결과 화면 표시(안내·제목·버튼)가 다름');
  if (rs.start || rs.done) say(`공유 링크 열기가 start/done 을 기록함 (${rs.start}/${rs.done})`);
  if (rs.retry !== R.makeOwn) say(`공유 결과의 다시 하기 라벨 "${rs.retry}" ≠ "${R.makeOwn}"`);
  const recv = await tab2.eval(DOM_TEAMS);
  if (JSON.stringify(recv) !== JSON.stringify(sharedDom)) say('받은 사람의 팀이 보낸 사람과 다름');
  if ((await tab2.eval(END_ORDER)).join(',') !== ORDER) say('공유 결과 끝 화면 순서가 다름');
  o = await tab2.eval(OVERFLOW); if (o) say(`공유 결과 가로 넘침 ${o}px`);
  await tab2.shot(`${lang}-${width}-5-shared.png`);
  await tab2.tap('#make-own-btn');
  const mo = await tab2.eval(`({ s: ${SHOWN}, hash: location.hash, shared: window.TEAM_APP.shared() })`);
  if (!mo.s.input || mo.hash || mo.shared) say(`"나도 만들기" → 입력 화면이 아님 (${JSON.stringify(mo)})`);
  // 잘못된 링크 (새로 열기: 같은 문서의 해시만 바꾸면 페이지를 다시 읽지 않는다)
  await tab2.goto('about:blank');
  await tab2.goto(base + '#d=bm90LWEtdGVhbQ');
  await sleep(600);
  const bl = await tab2.eval(`({ s: ${SHOWN}, toast: (document.getElementById('_toast') || {}).textContent || '', hash: location.hash })`);
  if (!bl.s.start || bl.toast !== R.badShare || bl.hash) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
  tab2.errors.forEach((e) => say('콘솔 오류(받는 사람): ' + e));
  await tab2.send('Page.close').catch(() => {});

  // 7) 다시 섞기 (새 판)
  await tab.tap('#again-btn');
  if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 섞기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
  if ((await waitIdle(tab, 4000)) < 0) say('다시 섞기 애니메이션이 끝나지 않음');
  if ((await tab.eval(COUNT('done'))) !== 2) say(`다시 섞기 뒤 track('done') ${await tab.eval(COUNT('done'))}회 (2)`);
  checkTeams(say, T, await tab.eval(DOM_TEAMS), names, 3, 3, '다시 섞은 결과');
  // 공통 끝 화면의 다시 하기 = 다시 섞기
  await tab.tap('[data-mg-end] .mg-end-retry');
  if ((await tab.eval(COUNT('start'))) !== 3) say('끝 화면 다시 하기가 다시 섞지 않음');
  await waitIdle(tab, 4000);

  // 8) 다시 열면 마지막 목록·방식 그대로
  await tab.goto(base);
  await tab.tap('#start-btn');
  const kept = await tab.eval(`({ v: document.getElementById('names').value, lead: document.getElementById('leaders').checked, num: document.getElementById('step-num').textContent, mode: document.getElementById('mode-teams').getAttribute('aria-checked') })`);
  if (kept.v !== text || !kept.lead || kept.num !== '3' || kept.mode !== 'true') say(`마지막 입력이 기억되지 않음 ${JSON.stringify(kept)}`);

  // 9) 팀당 인원 모드 + 60명 넘게
  const big = Array.from({ length: 64 }, (_, i) => `${T.sample[i % T.sample.length]}${Math.floor(i / T.sample.length) + 1}`);
  await setNames(tab, big.join('\n'));
  const warn = await tab.eval(`({ hidden: document.getElementById('names-warn').hidden, t: document.getElementById('names-warn').textContent, c: document.getElementById('people-count').textContent })`);
  if (warn.hidden || warn.t !== G.fmt(I.tooMany, { max: 60 }) || warn.c !== ppl(60)) say(`60명 넘김 안내 ${JSON.stringify(warn)}`);
  await tab.tap('#mode-size');
  if ((await tab.eval(`document.getElementById('mode-size').getAttribute('aria-checked')`)) !== 'true') say('팀당 인원 모드로 안 바뀜');
  // 3팀 → 20명씩 → 두 번 줄여 18명 → ceil(60/18) = 4팀 (15명씩)
  const sz0 = Number(await tab.eval(`document.getElementById('step-num').textContent`));
  if (sz0 !== 20) say(`팀 수 3 → 팀당 인원 ${sz0} (20)`);
  await tab.tap('#step-minus'); await tab.tap('#step-minus');
  const pv2 = await tab.eval(`document.getElementById('preview').textContent`);
  if (pv2 !== G.fmt(I.previewEq, { k: 4, size: 15 })) say(`팀당 인원 18 미리보기 "${pv2}"`);
  await tab.tap('.tm-check'); // 주장 나누기 끔
  await tab.tap('#shuffle-btn');
  await waitIdle(tab, 4000);
  await sleep(150);
  checkTeams(say, T, await tab.eval(DOM_TEAMS), big.slice(0, 60), 0, 4, '60명 · 팀당 인원');
  o = await tab.eval(OVERFLOW); if (o) say(`60명 결과 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.tm-team-name, .tm-chip-name')`)).forEach((w) => say(`60명 결과 ${w}`));
  if (width === WIDTHS[0]) await tab.shot(`${lang}-${width}-6-sixty.png`);

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, anim: info.anim, teams: dom1.map((t) => `${t.name}(${t.members.length})`).join(' · ') };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'team-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 랜덤 팀 나누기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[Math.min(1, WIDTHS.length - 1)], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기' : ''}] 시작→입력(주장 3·3팀)→섞기 ${res.anim}ms→${res.teams} · 복사·이름 바꾸기·공유 링크 왕복·나도 만들기·잘못된 링크·다시 섞기·기억·60명(팀당 인원)`);
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
