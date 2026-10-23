#!/usr/bin/env node
/**
 * 폭탄 돌리기 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/bomb) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * track() 은 페이지가 뜨기 전에 심은 감시 함수로 센다(localhost 는 통계를 보내지 않으므로).
 * 시간을 줄이려고 페이지의 performance.now 를 WARP 배로 빠르게 돌린다(심지 시계·연타 방지가 이 시계를 쓴다).
 * 언어 × 화면 폭마다:
 *   시작 화면(h1 검색어, 게임 화면 숨김, 맨 끝 mg-ad-start 1개, FAQ 없음, 넘침 없음, 기본 = 그냥 하기·보통)
 *   → 이름 넣기(4명, 14자 이름 포함) · 짧은 심지 · 힌트·벌칙 켬 → 불붙이기(track('start') 1, 광고 안 보임, 들고 있는 사람 표시)
 *   → 넘기기(다음 사람 안내·횟수, 연타 무시) → 탭 숨김(visibilitychange) = 멈춤(심지 시간이 흐르지 않음) → 돌아와도 멈춤 → 계속하기 → 다시 탐
 *   → 힌트 불꽃이 빨라짐 → 펑 → 결과(track('done') 1, 걸린 사람 = 터질 때 들고 있던 사람, 심지 길이 범위 안, 미션 한 장만,
 *     공통 끝 화면 순서·FAQ·공유 6개·다시 하기 라벨, 공유 주소 깨끗함)
 *   → 이름 링크(#d=) 새 탭: 이름 채움 + 안내, start/done 없음, #d= 지움 · 잘못된 링크 안내
 *   → 다시 하기(start 2 → done 2, 최근 기록 2줄, 다른 미션) → 참가자 바꾸기(시작 화면) → 다시 열면 설정·기록 남음 · 콘솔 오류 0
 *   + 움직임 줄이기 + 그냥 하기 한 번: 짧은 번쩍임(is-reduced), 이름 없는 결과, 링크 버튼 숨김.
 *
 * 실행: node tools/flow-test.js                         (en,ko,ja × 360,1440)
 *       node tools/flow-test.js en,th 360,375,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bomb-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ja').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8851, MOCK_PORT = 8852, CDP_PORT = 9851;
const WARP = 3;
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

const TRACK_SPY = `(() => { window.__tracks = []; let fn = null;
  Object.defineProperty(window, 'track', { configurable: true, set(v) { fn = v; }, get() { return function (e) { window.__tracks.push(e); return fn && fn.apply(this, arguments); }; } });
  const real = performance.now.bind(performance); const t0 = real(); performance.now = () => t0 + (real() - t0) * ${WARP};
  let hidden = false; Object.defineProperty(Document.prototype, 'hidden', { configurable: true, get() { return hidden; } });
  Object.defineProperty(Document.prototype, 'visibilityState', { configurable: true, get() { return hidden ? 'hidden' : 'visible'; } });
  window.__setHidden = (h) => { hidden = h; document.dispatchEvent(new Event('visibilitychange')); return 1; }; })();`;

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
    const r = await this.eval(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || !e.getClientRects().length) return null;
      e.scrollIntoView({ block: 'center', behavior: 'instant' }); let prev = null;
      for (let i = 0; i < 40; i++) { await new Promise((r) => setTimeout(r, 30)); const b = e.getBoundingClientRect(); const k = Math.round(b.top) + ',' + Math.round(b.left); if (k === prev) break; prev = k; }
      const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; })()`);
    if (!r) throw new Error('보이는 요소 없음: ' + sel);
    await sleep(40);
    for (const type of ['mousePressed', 'mouseReleased']) await this.send('Input.dispatchMouseEvent', { type, x: r.x, y: r.y, button: 'left', clickCount: 1 });
    await sleep(60);
  }
  async type(sel, text) {
    await this.eval(`(() => { const t = document.querySelector(${JSON.stringify(sel)}); t.value = ${JSON.stringify(text)}; t.dispatchEvent(new Event('input', { bubbles: true })); return 1; })()`);
    await sleep(80);
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
  if (width < 768) await tab.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  if (reduced) await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await tab.send('Browser.grantPermissions', { permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'], origin: `http://localhost:${HTTP_PORT}` }).catch(() => {});
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
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== 'auto' && getComputedStyle(el).textOverflow !== 'ellipsis') bad.push('넘침: ' + (el.textContent || el.placeholder || '').trim().slice(0, 30));
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
const END_ORDER = `(() => { const end = document.querySelector('[data-mg-end]'); return end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : []; })()`;
const ORDER = 'rating,ad,share,faq,retry,more';
const SCREENS = `({ setup: !document.getElementById('screen-setup').hidden, play: !document.getElementById('screen-play').hidden, result: !document.getElementById('result').hidden })`;
const VISIBLE_ADS = `[...document.querySelectorAll('.mg-ad')].filter((a) => !a.closest('[hidden]') && getComputedStyle(a).display !== 'none').length`;
// 펑 순간에 들고 있던 사람을 잡아 둔다(결과 이름과 비교)
const WATCH = `(() => { window.__atBoom = null; window.__boomShown = false; const b = document.getElementById('boom');
  if (window.__mo) window.__mo.disconnect();
  window.__mo = new MutationObserver(() => { if (!b.hidden && window.__atBoom == null) { window.__atBoom = window.BOMB_APP.holder(); window.__boomShown = true; window.__boomReduced = b.classList.contains('is-reduced'); } });
  window.__mo.observe(b, { attributes: true, attributeFilter: ['hidden'] }); return 1; })()`;
const NAMES = ['Ann', 'Bartholomew Jo', 'Dee', 'Fay'];

async function waitFor(tab, expr, maxMs) {
  const t0 = Date.now();
  while (Date.now() - t0 < maxMs) { if (await tab.eval(expr)) return Date.now() - t0; await sleep(50); }
  return -1;
}

async function runOne(lang, width, report, opts = {}) {
  const T = L10N[lang];
  const U = T.ui, R = T.result, E = T.errors;
  const tag = `[${lang} ${width}${opts.reduced ? ' 움직임 줄이기 · 그냥 하기' : ''}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  const note = (m) => console.log(`    · ${tag} ${m}`);
  await mockRpc('__reset');
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width, opts.reduced);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);

  // 1) 시작 화면
  const st = await tab.eval(`(() => { const sec = document.getElementById('screen-setup');
    return { h1: document.querySelector('h1').textContent, scr: ${SCREENS}, adLast: sec.lastElementChild.classList.contains('mg-ad-start'), ads: ${VISIBLE_ADS},
      faq: [...document.querySelectorAll('.mg-faq, .mg-end-faq')].filter((a) => a.getClientRects().length).length, mode: window.BOMB_APP.mode(), fuse: window.BOMB_APP.fuseMode(),
      namesBox: !document.getElementById('names-box').hidden, missionText: document.getElementById('mission-text').textContent }; })()`);
  if (!st.h1.includes(T.hero.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  if (!st.scr.setup || st.scr.play || !st.adLast || st.ads !== 1 || st.faq) say(`시작 화면이 다름 ${JSON.stringify(st)}`);
  if (st.mode !== 'free' || st.fuse !== 'normal' || st.namesBox || st.missionText) say(`기본 설정(그냥 하기·보통·이름 칸 숨김·미션 비어 있음)이 아님 ${JSON.stringify(st)}`);
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.bm-h1, .bm-hook, .bm-btn, .bm-seg-btn, .bm-label, .bm-hint, .bm-switch-label, .bm-fair')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-setup.png`);

  const named = !opts.reduced;
  if (named) {
    // 2) 이름 · 짧은 심지 · 힌트·벌칙
    await tab.tap('#mode-names');
    await tab.type('#names', NAMES.join('\n'));
    await tab.tap('#fuse-short');
    await tab.tap('#hints + .bm-switch-ui');
    await tab.tap('#missions + .bm-switch-ui');
    const s2 = await tab.eval(`({ mode: window.BOMB_APP.mode(), fuse: window.BOMB_APP.fuseMode(), hints: document.getElementById('hints').checked, missions: document.getElementById('missions').checked, count: document.getElementById('names-count').textContent })`);
    if (s2.mode !== 'names' || s2.fuse !== 'short' || !s2.hints || !s2.missions || s2.count !== fmt(U.namesCount, { n: 4 })) say(`설정이 바뀌지 않음 ${JSON.stringify(s2)}`);
    o = await tab.eval(OVERFLOW); if (o) say(`설정 화면 가로 넘침 ${o}px`);
    (await tab.eval(TEXT_FIT + `('.bm-seg-btn, .bm-fuse-range, .bm-switch-label, .bm-hint, .bm-count')`)).forEach((w) => say(`설정 화면 ${w}`));
    await tab.shot(`${lang}-${width}-2-setup-names.png`);
  } else {
    await tab.tap('#fuse-short');
  }

  // 3) 불붙이기
  await tab.eval(WATCH);
  await tab.tap('#start-btn');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`불붙이기 뒤 track('start') ${await tab.eval(COUNT('start'))}회`);
  const sc = await tab.eval(`({ scr: ${SCREENS}, ads: ${VISIBLE_ADS}, banner: document.getElementById('play-banner').textContent, holder: document.getElementById('holder').textContent, phase: window.BOMB_APP.phase(), h: window.BOMB_APP.holder(), total: window.BOMB_APP.total(), names: window.BOMB_APP.names() })`);
  if (sc.scr.setup || !sc.scr.play || sc.scr.result || sc.phase !== 'play' || sc.banner !== U.bannerShort) say(`게임 화면이 다름 ${JSON.stringify(sc)}`);
  if (sc.ads) say(`게임 화면에 광고가 보임 (${sc.ads})`);
  if (sc.total !== null) say('게임 중에 심지 길이가 밖으로 보임(BOMB_APP.total)');
  if (named) {
    if (sc.names.join('|') !== NAMES.join('|') || !(sc.h >= 0 && sc.h < 4) || sc.holder !== '💣 ' + fmt(U.holding, { name: NAMES[sc.h] })) say(`들고 있는 사람 표시가 다름 ${JSON.stringify(sc)}`);
  } else if (sc.holder !== U.holdingFree || sc.h !== -1) say(`그냥 하기 안내가 다름 ${JSON.stringify(sc)}`);
  const html = await tab.eval('document.getElementById("screen-play").innerText');
  if (/\d+(\.\d)?\s*(s|초|秒|с|giây|วินาที)\b/.test(html.replace(fmt(U.bannerShort, {}), ''))) say('게임 화면에 초 단위 시간이 보임');
  o = await tab.eval(OVERFLOW); if (o) say(`게임 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.bm-banner, .bm-holder, .bm-pass, .bm-pass-count, .bm-tip, .bm-mini')`)).forEach((w) => say(`게임 화면 ${w}`));
  await tab.shot(`${lang}-${width}-3-play.png`);

  // 4) 넘기기 · 연타 방지
  await tab.tap('#bomb-btn');
  await tab.tap('#bomb-btn');
  const p1 = await tab.eval(`({ p: window.BOMB_APP.passes(), h: window.BOMB_APP.holder(), msg: document.getElementById('pass-msg').textContent, cnt: document.getElementById('pass-count').textContent })`);
  if (p1.p !== 1) say(`넘기기 연타가 막히지 않음(넘긴 횟수 ${p1.p}, 1 이어야 함)`);
  if (named) {
    const want = (sc.h + 1) % 4;
    if (p1.h !== want || p1.msg !== fmt(U.passTo, { name: NAMES[want] })) say(`넘기기 안내가 다름 ${JSON.stringify(p1)}`);
  } else if (p1.msg !== U.passFree) say(`넘기기 안내가 다름 ${JSON.stringify(p1)}`);
  if (p1.cnt !== fmt(U.passCount, { p: 1 })) say(`넘긴 횟수 표시 ${p1.cnt}`);
  await sleep(CORE.PASS_COOLDOWN_MS / WARP + 120);
  await tab.tap('#bomb-btn');
  if ((await tab.eval('window.BOMB_APP.passes()')) !== 2) say('연타 방지 시간이 지난 뒤에도 넘겨지지 않음');
  await tab.shot(`${lang}-${width}-4-pass.png`);

  // 5) 탭 숨김 = 멈춤
  if (named) {
    await tab.eval('window.__setHidden(true)');
    const e1 = await tab.eval('window.BOMB_APP.elapsed()');
    await sleep(900);
    const pz = await tab.eval(`({ phase: window.BOMB_APP.phase(), e: window.BOMB_APP.elapsed(), paused: !document.getElementById('paused').hidden, dis: document.getElementById('bomb-btn').disabled })`);
    if (pz.phase !== 'paused' || Math.abs(pz.e - e1) > 1 || !pz.paused || !pz.dis) say(`탭이 숨었는데 심지가 멈추지 않음 ${JSON.stringify({ e1, ...pz })}`);
    await tab.eval('window.__setHidden(false)');
    await sleep(400);
    const pz2 = await tab.eval(`({ phase: window.BOMB_APP.phase(), e: window.BOMB_APP.elapsed() })`);
    if (pz2.phase !== 'paused' || Math.abs(pz2.e - e1) > 1) say(`돌아오자마자 저절로 다시 탐 ${JSON.stringify(pz2)}`);
    await tab.shot(`${lang}-${width}-5-paused.png`);
    await tab.tap('#resume-btn');
    await sleep(300);
    const pz3 = await tab.eval(`({ phase: window.BOMB_APP.phase(), e: window.BOMB_APP.elapsed(), paused: !document.getElementById('paused').hidden })`);
    if (pz3.phase !== 'play' || !(pz3.e > e1) || pz3.paused) say(`계속하기 뒤 다시 타지 않음 ${JSON.stringify(pz3)}`);
  }

  // 6) 펑 → 결과
  if (named) {
    const sparkMid = await tab.eval(`getComputedStyle(document.getElementById('screen-play')).getPropertyValue('--spark-ms')`);
    if (!/ms$/.test(sparkMid)) say(`힌트 불꽃 속도 변수 없음 (${sparkMid})`);
  }
  const took = await waitFor(tab, `window.BOMB_APP.phase() === 'result' && !document.getElementById('result').hidden`, (CORE.FUSES.short[1] / WARP) + 6000);
  if (took < 0) { say('펑/결과가 나오지 않음'); tab.errors.forEach((e) => say('콘솔 오류: ' + e)); await tab.send('Page.close').catch(() => {}); return { problems }; }
  await sleep(200);
  if ((await tab.eval(COUNT('done'))) !== 1) say(`펑 뒤 track('done') ${await tab.eval(COUNT('done'))}회`);
  const total = await tab.eval('window.BOMB_APP.total()');
  if (!(total >= CORE.FUSES.short[0] && total <= CORE.FUSES.short[1])) say(`심지 길이가 짧게(10~25초) 범위 밖: ${total}`);
  const bm = await tab.eval('({ shown: window.__boomShown, reduced: window.__boomReduced, at: window.__atBoom })');
  if (!bm.shown) say('펑 화면이 보이지 않음');
  if (!!bm.reduced !== !!opts.reduced) say(`움직임 줄이기 펑(is-reduced) ${bm.reduced}`);
  const res = await tab.eval(`({ title: document.getElementById('res-title').textContent, sub: document.getElementById('res-sub').textContent, stats: document.getElementById('res-stats').textContent,
    mission: document.getElementById('mission-card').hidden ? '' : document.getElementById('mission-text').textContent, missionNodes: document.querySelectorAll('#mission-card p').length,
    link: !document.getElementById('link-btn').hidden, hist: document.querySelectorAll('#history .bm-hist-row').length, histCard: !document.getElementById('history-card').hidden, boomHidden: document.getElementById('boom').hidden, stage: !document.getElementById('stage').hidden })`);
  const loser = named ? NAMES[bm.at] : null;
  if (named) {
    if (res.title !== fmt(R.loserTitle, { name: loser }) || res.sub !== fmt(R.loserSub, { name: loser })) say(`걸린 사람이 펑 때 들고 있던 사람(${loser})과 다름 ${JSON.stringify(res)}`);
    if (!T.missions.includes(res.mission) || res.missionNodes !== 1) say(`벌칙 미션이 한 장이 아님 ${JSON.stringify(res)}`);
    if (!res.link) say('이름 모드인데 이름 링크 버튼이 없음');
  } else {
    if (res.title !== R.freeTitle || res.sub !== R.freeSub || res.mission || res.link) say(`그냥 하기 결과가 다름 ${JSON.stringify(res)}`);
  }
  const statsRe = new RegExp('^' + R.stats.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace('{s}', '[0-9]+[.,][0-9]').replace('{p}', '2') + '$');
  if (!statsRe.test(res.stats)) say(`결과 통계(심지 n초 · 넘긴 횟수 2)가 다름: ${res.stats}`);
  if (res.hist !== 1 || !res.histCard || !res.boomHidden || res.stage) say(`결과 화면 상태가 다름 ${JSON.stringify(res)}`);
  // 페이지 HTML 전체에서 미션은 지금 보이는 한 장뿐
  const shownMissions = await tab.eval(`(() => { const txt = document.body.innerText; return ${JSON.stringify(T.missions)}.filter((m) => txt.includes(m)).length; })()`);
  if (shownMissions !== (named ? 1 : 0)) say(`보이는 미션 ${shownMissions}장 (한 장만이어야 함)`);
  if ((await tab.eval(END_ORDER)).join(',') !== ORDER) say(`끝 화면 순서 ${(await tab.eval(END_ORDER)).join(' → ')}`);
  const endInfo = await tab.eval(`({ faq: document.querySelectorAll('.mg-end-faq .mg-faq').length, share: document.querySelectorAll('.mg-end-share .mg-share-btn').length, retry: document.querySelector('.mg-end-retry').textContent, ads: ${VISIBLE_ADS} })`);
  if (endInfo.faq !== T.faq.length || endInfo.share !== 6) say(`FAQ ${endInfo.faq}개 / 공유 버튼 ${endInfo.share}개`);
  if (endInfo.retry !== R.again) say(`다시 하기 라벨 "${endInfo.retry}" ≠ "${R.again}"`);
  if (endInfo.ads > 1) say(`결과 화면에 광고 ${endInfo.ads}개`);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.bm-h2, .bm-h3, .bm-btn, .bm-res-kicker, .bm-res-sub, .bm-res-stats, .bm-mission-text, .bm-hist-who, .bm-hist-meta, .mg-end-retry')`)).forEach((w) => say(`결과 화면 ${w}`));
  await tab.eval(`document.getElementById('result-card').scrollIntoView({ block: 'start', behavior: 'instant' }); 1`);
  await tab.shot(`${lang}-${width}-6-result.png`);
  note(`심지 ${(total / 1000).toFixed(1)}초 · 실제 ${(took / 1000).toFixed(1)}초(×${WARP})${named ? ` · 걸린 사람 ${loser}` : ''}`);
  const share = await tab.eval('window.getShareData()');
  if (/#/.test(share.url) || /\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(new URL(share.url).pathname)) say(`끝 화면 공유 주소가 깨끗한 주소가 아님: ${share.url}`);

  if (named) {
    await tab.tap('#link-btn');
    await sleep(350);
    if ((await tab.eval(`(document.getElementById('_toast') || {}).textContent || ''`)) !== R.linkCopied) say('이름 링크 복사 안내 토스트가 다름');
    // 7) 이름 링크(#d=)
    const link = await tab.eval('window.BOMB_APP.link()');
    const lu = new URL(link);
    if (!/^#d=[A-Za-z0-9_-]+$/.test(lu.hash) || lu.search) say(`이름 링크가 #d= 가 아님: ${link}`);
    if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(lu.pathname)) say(`이름 링크에 언어가 들어감: ${lu.pathname}`);
    const tab2 = await openTab(width, false);
    await tab2.goto(base + '#nolang');
    await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
    await tab2.goto(base + lu.hash);
    await sleep(250);
    const rs = await tab2.eval(`({ scr: ${SCREENS}, note: !document.getElementById('shared-note').hidden, names: document.getElementById('names').value, mode: window.BOMB_APP.mode(), start: ${COUNT('start')}, done: ${COUNT('done')}, hash: location.hash })`);
    if (!rs.scr.setup || rs.scr.play || !rs.note || rs.names !== NAMES.join('\n') || rs.mode !== 'names' || rs.hash) say(`이름 링크 불러오기가 다름 ${JSON.stringify(rs)}`);
    if (rs.start || rs.done) say(`이름 링크 열기가 start/done 을 기록함 (${rs.start}/${rs.done})`);
    await tab2.goto('about:blank');
    await tab2.goto(base + '#d=bm90LWEtYm9tYg');
    await sleep(300);
    const bl = await tab2.eval(`({ err: document.getElementById('error').textContent, scr: ${SCREENS}, hash: location.hash })`);
    if (bl.err !== E.badLink || !bl.scr.setup || bl.hash) say(`잘못된 링크 처리 ${JSON.stringify(bl)}`);
    tab2.errors.forEach((e) => say('콘솔 오류(받는 사람): ' + e));
    await tab2.send('Page.close').catch(() => {});

    // 8) 다시 하기 → 참가자 바꾸기
    const firstMission = res.mission;
    await tab.eval(WATCH);
    await tab.tap('[data-mg-end] .mg-end-retry');
    if ((await tab.eval(COUNT('start'))) !== 2) say(`다시 하기 뒤 track('start') ${await tab.eval(COUNT('start'))}회 (2)`);
    if (await tab.eval(`!document.getElementById('result').hidden`)) say('다시 하기 뒤에도 지난 결과가 보임');
    if ((await waitFor(tab, `window.BOMB_APP.phase() === 'result'`, (CORE.FUSES.short[1] / WARP) + 6000)) < 0) say('다시 하기 결과가 나오지 않음');
    await sleep(200);
    const again = await tab.eval(`({ done: ${COUNT('done')}, hist: document.querySelectorAll('#history .bm-hist-row').length, mission: document.getElementById('mission-text').textContent })`);
    if (again.done !== 2 || again.hist !== 2) say(`다시 하기가 다름 ${JSON.stringify(again)}`);
    if (again.mission === firstMission) say('다시 하기에서 같은 벌칙 미션이 연속으로 나옴');
    await tab.tap('#edit-btn');
    const ed = await tab.eval(`({ scr: ${SCREENS}, names: document.getElementById('names').value })`);
    if (!ed.scr.setup || ed.scr.play || ed.names !== NAMES.join('\n')) say(`참가자 바꾸기 → 시작 화면이 다름 ${JSON.stringify(ed)}`);
    if ((await tab.eval(VISIBLE_ADS)) !== 1) say('시작 화면으로 돌아왔는데 광고가 1개가 아님');

    // 9) 다시 열면 설정·기록이 남음
    await tab.goto(base);
    const rl = await tab.eval(`({ mode: window.BOMB_APP.mode(), fuse: window.BOMB_APP.fuseMode(), names: document.getElementById('names').value, hints: document.getElementById('hints').checked, missions: document.getElementById('missions').checked, hist: window.BOMB_APP.history().length, start: ${COUNT('start')} })`);
    if (rl.mode !== 'names' || rl.fuse !== 'short' || rl.names !== NAMES.join('\n') || !rl.hints || !rl.missions || rl.hist !== 2 || rl.start) say(`다시 열었을 때 설정·기록이 다름 ${JSON.stringify(rl)}`);
  }

  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'bomb-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', '--autoplay-policy=no-user-gesture-required', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 폭탄 돌리기 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px + 움직임 줄이기, 시계 ×${WARP}) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, {}])));
    plan.push([LANGS[0], WIDTHS[0], { reduced: true }]);
    for (const [lang, width, opts] of plan) {
      const res = await runOne(lang, width, report, opts);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${opts.reduced ? ' 움직임 줄이기 · 그냥 하기' : ''}] 시작 화면 · ${opts.reduced ? '그냥 하기' : '이름 4명+짧은 심지+힌트·벌칙'} → 불붙이기 → 넘기기(연타 방지)${opts.reduced ? '' : ' → 탭 숨김 멈춤·계속하기'} → 펑 → 결과(걸린 사람 = 들고 있던 사람, 미션 한 장, 끝 화면)${opts.reduced ? '' : ' · 이름 링크 왕복·잘못된 링크 · 다시 하기 · 참가자 바꾸기 · 다시 열기'}`);
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
