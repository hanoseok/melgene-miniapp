#!/usr/bin/env node
/**
 * 음식 월드컵 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/food-cup) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * 모의 서버에 표를 미리 심는다: 모든 대결 12표(합계 ≥ 10 → % 보임), 우승 표 25표(≥ 20 → % 보임).
 *   한 언어는 표 없이(빈 서버) 한 번 더 돌려 %가 숨고 "처음으로 끝까지" 문구가 나오는지 본다.
 * 언어 × 화면 폭마다:
 *   시작(티징만: 광고·FAQ·음식 없음) → 시작 → 15번 고르기(라운드 표시·진행 막대·카드 두 장·"N% 같은 선택")
 *   → 끝 화면(우승 카드 → 공통 끝 화면: 별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   · 서버로 간 투표 15+1건이 qid/opt 한도 안 · track('start')·track('done') 한 번씩 · 다시 하기 = 새 대진 + start/done 한 번 더
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
const CORE = require(path.join(SITE, 'food-cup-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,th,ru').split(',');
const WIDTHS = (process.argv[3] || '360,375,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = 8881, MOCK_PORT = 8882, CDP_PORT = 9386;
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
async function seedVotes() {
  await mockRpc('__reset');
  const jobs = [];
  for (let a = 0; a < 16; a++) for (let b = a + 1; b < 16; b++) {
    const q = CORE.pairQid(a, b);
    for (let k = 0; k < 12; k++) jobs.push(['poll_vote', { p_poll: CORE.POLL, p_qid: q, p_opt: k < 8 ? 0 : 1 }]); // 작은 번호 8 : 큰 번호 4
  }
  for (let k = 0; k < 25; k++) { const i = k % 16; jobs.push(['poll_vote', { p_poll: CORE.POLL, p_qid: CORE.champQid(i), p_opt: CORE.champOpt(i) }]); }
  for (let i = 0; i < jobs.length; i += 60) await Promise.all(jobs.slice(i, i + 60).map(([n, b]) => mockRpc(n, b)));
}
const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const SPY = `(() => { window.__tracks = []; const o = window.track; window.track = function (e) { window.__tracks.push(e); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, play: !document.getElementById('screen-play').hidden, end: !document.getElementById('screen-end').hidden }))()`;
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

async function runOne(lang, width, withVotes, report) {
  const T = L10N[lang];
  const tag = `[${lang} ${width}${withVotes ? '' : ' 빈 서버'}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  if (withVotes) await seedVotes(); else await mockRpc('__reset');
  const seeded = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'poll_vote').length; // 심은 표는 빼고 센다
  const base = `http://localhost:${HTTP_PORT}/${G.fileOf(lang, 'index.html').replace(/index\.html$/, '')}`;
  const tab = await openTab(width);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  await tab.eval(SPY);
  await sleep(300); // 합계 받기
  // 1) 시작 화면
  const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: !!document.querySelector('#screen-start .mg-ad'), faq: !!document.querySelector('#screen-start .mg-faq, #screen-start [data-mg-end], #screen-start .fc-card'),
    visAds: [...document.querySelectorAll('.mg-ad')].filter((a) => a.offsetParent).length, visFaq: [...document.querySelectorAll('.mg-faq')].filter((a) => a.offsetParent).length,
    h1: document.querySelector('h1').textContent.trim(), text: document.getElementById('screen-start').innerText }))()`);
  if (!st.s.start || st.s.play || st.s.end) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.faq || st.visAds || st.visFaq) say('시작 화면에 광고/FAQ/카드가 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  CORE.FOODS.forEach((f) => { if (st.text.includes(f.emoji) || (T.foods[f.id].length > 2 && st.text.includes(T.foods[f.id]))) say(`시작 화면에 음식 ${f.id}`); });
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.fc-h1, .fc-badge, .fc-btn, .fc-hook, .fc-facts')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);
  // 2) 경기 15번
  await tab.tap('#start-btn');
  if (!(await tab.eval(SHOWN)).play) say('시작 버튼 → 경기 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`track('start') ${await tab.eval(COUNT('start'))}회`);
  if ((await tab.eval(`document.querySelectorAll('#screen-play .mg-ad').length`)) !== 1) say('경기 화면 광고 자리 1개가 아님');
  const seenRounds = [];
  let statShown = 0;
  const seed = (await tab.eval('window.FOODCUP_APP.game().seed')) >>> 0;
  let shadow = CORE.newGame(seed); // 같은 시드로 Node 에서 따라가며 화면과 비교
  for (let k = 0; k < 15; k++) {
    await sleep(60);
    const m = await tab.eval(`(() => ({ round: document.getElementById('round-label').textContent, r: document.getElementById('round-label').getAttribute('data-round'),
      a: document.getElementById('card-a').getAttribute('data-food'), b: document.getElementById('card-b').getAttribute('data-food'),
      an: document.querySelector('#card-a .fc-name').textContent, bn: document.querySelector('#card-b .fc-name').textContent,
      bar: document.getElementById('progress').getAttribute('aria-valuenow'), dis: document.getElementById('card-a').disabled }))()`);
    const c = CORE.current(shadow);
    if (m.a !== CORE.FOODS[c.a].id || m.b !== CORE.FOODS[c.b].id) { say(`경기 ${k + 1}: 화면(${m.a} vs ${m.b}) ≠ 대진(${CORE.FOODS[c.a].id} vs ${CORE.FOODS[c.b].id})`); break; }
    if (m.an !== T.foods[m.a] || m.bn !== T.foods[m.b]) say(`경기 ${k + 1}: 음식 이름이 언어 파일과 다름`);
    const wantRound = c.matches > 1 ? G.fmt(T.play.roundFmt, { round: T.play.rounds[c.round], n: c.match, total: c.matches }) : T.play.rounds[c.round];
    if (m.round !== wantRound || m.r !== c.round) say(`경기 ${k + 1}: 라운드 표시 "${m.round}" ≠ "${wantRound}"`);
    if (Number(m.bar) !== k) say(`경기 ${k + 1}: 진행 ${m.bar} ≠ ${k}`);
    if (m.dis) say(`경기 ${k + 1}: 카드가 눌리지 않는 상태`);
    if (!seenRounds.includes(c.round)) {
      seenRounds.push(c.round);
      o = await tab.eval(OVERFLOW); if (o) say(`경기 화면(${c.round}) 가로 넘침 ${o}px`);
      (await tab.eval(TEXT_FIT + `('.fc-round, .fc-hint, .fc-name, .fc-vs')`)).forEach((w) => say(`경기 화면 ${w}`));
      if (c.round === 'r16') await tab.shot(`${lang}-${width}-2-play.png`);
    }
    // 모든 음식 이름이 이 폭의 카드에 들어가는지 (한 번만, 16개 전부 넣어 본다)
    if (k === 0) {
      const fit = await tab.eval(`(async () => {
        const names = ${JSON.stringify(Object.values(T.foods))}; const el = document.querySelector('#card-a .fc-name'); const keep = el.textContent; const out = [];
        for (const n of names) { el.textContent = n; const lines = Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)); if (el.scrollWidth > el.clientWidth + 1) out.push('넘침 ' + n); if (lines > 2) out.push(lines + '줄 ' + n); }
        const r = ${TEXT_FIT}; for (const n of names) { el.textContent = n; r('#card-a .fc-name').forEach((w) => out.push(w)); }
        el.textContent = keep; return out; })()`);
      fit.forEach((w) => say(`카드 이름 ${w}`));
    }
    const side = (k * 7 + seed) % 2;
    const winner = side ? c.b : c.a;
    const expectStat = withVotes; // 모든 대결 12표 → 보여야 함
    await tab.tap(side ? '#card-b' : '#card-a');
    // 고른 뒤: 두 번 눌러도 한 번만
    await tab.eval(`document.getElementById('${side ? 'card-a' : 'card-b'}').click(); 1`);
    shadow = CORE.pick(shadow, winner, true);
    await sleep(320);
    const stat = await tab.eval(`document.getElementById('pick-stat').textContent`);
    if (expectStat) {
      const want = G.fmt(T.play.same, { pct: winner === Math.min(c.a, c.b) ? 67 : 33 });
      if (stat !== want) say(`경기 ${k + 1}: 선택률 "${stat}" ≠ "${want}"`); else statShown++;
    } else if (stat) say(`경기 ${k + 1}: 표가 없는데 선택률 "${stat}"`);
    // 다음 경기(또는 끝 화면)까지 기다림
    for (let i = 0; i < 40; i++) {
      await sleep(80);
      const n = await tab.eval(`(() => { const g = window.FOODCUP_APP.game(); return !document.getElementById('screen-end').hidden || document.getElementById('progress').getAttribute('aria-valuenow') === '${k + 1}'; })()`);
      if (n) break;
    }
  }
  if (seenRounds.join() !== 'r16,qf,sf,f') say(`라운드 순서 ${seenRounds.join('→')}`);
  // 3) 끝 화면
  await sleep(500);
  const s = await tab.eval(SHOWN);
  if (!s.end || s.play) say('15번 고른 뒤 끝 화면이 안 보임');
  if ((await tab.eval(COUNT('done'))) !== 1) say(`track('done') ${await tab.eval(COUNT('done'))}회`);
  const game = await tab.eval('window.FOODCUP_APP.game()');
  if (!game || game.champion !== shadow.champion || JSON.stringify(game.rounds) !== JSON.stringify(shadow.rounds)) say('끝 상태가 같은 시드·같은 선택의 대진과 다름');
  const r = await tab.eval(`(() => {
    const end = document.querySelector('[data-mg-end]');
    const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
    const card = document.querySelector('.fc-champ');
    const cs = document.getElementById('champ-stat');
    return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
      faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
      name: document.getElementById('champ-name').textContent, emoji: document.getElementById('champ-emoji').textContent,
      stat: cs.hidden ? null : cs.textContent, chips: [...document.querySelectorAll('#four .fc-chip-name')].map((e) => e.textContent),
      retry: document.querySelector('.mg-end-retry').textContent };
  })()`);
  const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
  if (r.kids.join(',') !== order.join(',')) say(`끝 화면 순서 ${r.kids.join(' → ')}`);
  if (!r.cardBeforeEnd) say('우승 카드가 공통 끝 화면보다 위에 있지 않음');
  if (r.faqItems !== T.faq.length || r.shareBtns !== 6) say(`FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
  const champ = shadow.champion;
  if (r.name !== T.foods[CORE.FOODS[champ].id] || r.emoji !== CORE.FOODS[champ].emoji) say(`우승 표시 "${r.emoji} ${r.name}"`);
  if (withVotes) {
    // 심은 우승 표 25표: 번호 0~8 은 2표, 9~15 는 1표 → 8% / 4%
    const pct = Math.round(((champ < 9 ? 2 : 1) / 25) * 100);
    const want = G.fmt(T.result.champPct, { pct, food: T.foods[CORE.FOODS[champ].id] });
    if (r.stat !== want) say(`우승 선택률 "${r.stat}" ≠ "${want}"`);
  } else if (r.stat !== T.result.champFirst) say(`빈 서버인데 우승 문구 "${r.stat}"`);
  const four = [...new Set(shadow.rounds[2])];
  if (r.chips.length !== 4 || r.chips[0] !== r.name || !four.every((i) => r.chips.includes(T.foods[CORE.FOODS[i].id]))) say(`나의 4강 ${r.chips.join(', ')}`);
  if (r.retry !== T.result.retry) say(`다시 하기 라벨 "${r.retry}"`);
  o = await tab.eval(OVERFLOW); if (o) say(`끝 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.fc-eyebrow, .fc-champ-name, .fc-champ-stat, .fc-four-title, .fc-chip-name, .mg-end-retry, .mg-end-h')`)).forEach((w) => say(`끝 화면 ${w}`));
  await tab.shot(`${lang}-${width}-3-end.png`);
  // 공유
  const share = await tab.eval(`window.getShareData()`);
  const wantText = G.fmt(T.result.shareText, { emoji: CORE.FOODS[champ].emoji, food: T.foods[CORE.FOODS[champ].id] });
  if (share.text !== wantText) say(`공유 문구 "${share.text}"`);
  if (/[?&#]lang=|\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(share.url.replace(/^https?:\/\/[^/]+/, '')) && lang !== 'en') {
    // 언어 폴더 주소로 연 로컬 검사(봇 UA)에서는 mgCleanUrl 이 폴더를 떼어 낸다 — 남아 있으면 문제
    say(`공유 주소에 언어가 들어감: ${share.url}`);
  }
  // 서버로 간 투표
  const log = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'poll_vote').slice(seeded);
  const bad = log.filter((e) => e.args.p_poll !== CORE.POLL || !CORE.validVote(e.args.p_qid, e.args.p_opt));
  if (bad.length) say(`서버 한도 밖 투표 ${JSON.stringify(bad[0].args)}`);
  const pairVotes = log.filter((e) => /^m/.test(e.args.p_qid));
  const champVotes = log.filter((e) => /^c[01]$/.test(e.args.p_qid));
  if (pairVotes.length !== 15 || champVotes.length !== 1) say(`투표 수: 대결 ${pairVotes.length}(15) / 우승 ${champVotes.length}(1)`);
  if (champVotes[0] && (champVotes[0].args.p_qid !== CORE.champQid(champ) || champVotes[0].args.p_opt !== CORE.champOpt(champ))) say('우승 투표 인코딩이 다름');
  // 4) 다시 하기 → 새 대진, 같은 대결은 다시 세지 않음
  await tab.tap('[data-mg-end] .mg-end-retry');
  await sleep(200);
  const again = await tab.eval(`(() => ({ s: ${SHOWN}, seed: window.FOODCUP_APP.game().seed, start: ${COUNT('start')}, picks: window.FOODCUP_APP.game().cur.length }))()`);
  if (!again.s.play || again.picks !== 0) say('다시 하기 → 새 경기 화면이 아님');
  if ((again.seed >>> 0) === seed) say('다시 하기인데 시드가 같음');
  if (again.start !== 2) say(`다시 하기 뒤 track('start') ${again.start}회 (2)`);
  for (let k = 0; k < 15; k++) {
    await tab.eval(`document.getElementById('card-a').click(); 1`);
    for (let i = 0; i < 40; i++) { await sleep(70); if (await tab.eval(`!document.getElementById('screen-end').hidden || document.getElementById('progress').getAttribute('aria-valuenow') === '${k + 1}'`)) break; }
  }
  await sleep(300);
  if (!(await tab.eval(SHOWN)).end) say('두 번째 판이 끝 화면에 닿지 않음');
  if ((await tab.eval(COUNT('done'))) !== 2) say(`두 번째 판 뒤 track('done') ${await tab.eval(COUNT('done'))}회 (2)`);
  const log2 = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'poll_vote').slice(seeded);
  const firstQids = new Set(pairVotes.map((e) => e.args.p_qid));
  const dup = log2.slice(log.length).filter((e) => firstQids.has(e.args.p_qid) || /^c[01]$/.test(e.args.p_qid));
  if (dup.length) say(`같은 브라우저가 같은 대결/우승을 다시 셈: ${dup.map((e) => e.args.p_qid).join(',')}`);
  tab.errors.forEach((e) => say('콘솔 오류: ' + e));
  await tab.send('Page.close').catch(() => {});
  return { problems, statShown, champ: T.foods[CORE.FOODS[champ].id], order: r.kids.join('→'), stat: r.stat };
}

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'fc-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 음식 월드컵 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, true])));
    plan.push([LANGS[0], WIDTHS[0], false]); // 빈 서버: % 숨김 + "처음으로 끝까지"
    for (const [lang, width, withVotes] of plan) {
      const res = await runOne(lang, width, withVotes, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${withVotes ? '' : ' 빈 서버'}] 시작→15번 고르기(% ${res.statShown}/15)→우승 ${res.champ} · "${res.stat}" · 끝 화면 ${res.order} · 다시 하기(새 대진, 중복 투표 없음)`);
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
