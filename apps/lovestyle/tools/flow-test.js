#!/usr/bin/env node
/**
 * 연애 유형 테스트 실제 흐름 검사 (Chrome headless + CDP, 의존성 없음). check-all 에는 들어가지 않는다(느림).
 * 사이트는 이 스크립트가 직접 띄운다: python3 -m http.server (apps/lovestyle) + tools/mock-supa.js
 *   (운영 DB 안 씀 — localStorage.mg_supa_url 로 모의 서버, lang_pref·mg_lang 로 지역 이동 막음)
 * 모의 서버에 결과 표를 미리 심는다(poll lovestyle / r0: 보기 i 에 i+1 표, 합계 36 ≥ 20 → "N% 같은 유형"이 보임).
 *   한 번은 표 없이(빈 서버) 돌려 비율이 숨는지 본다.
 * 언어 × 화면 폭마다:
 *   시작(티징만: 광고·FAQ·결과 없음, h1 검색어) → 시작(track start 1회, 질문 화면 광고 1자리)
 *   → 10문항(3번에서 뒤로 가기 한 번, 문구·진행 표시가 언어 파일과 같은지) → 마음 읽는 중(track done 1회)
 *   → r/<id>.html (lovestyle-core 채점과 같은 결과) → 결과 카드 → 공통 끝 화면(별점 → 광고 → 공유 6 → FAQ → 다시 하기 → 다른 미니앱)
 *   · 같은 유형 비율 = 모의 서버 실제 값, 투표 1건(r0, 그 유형 번호) · 방금 푼 사람에겐 CTA 숨김
 *   · 찰떡궁합·앙숙 = 링크 아님(누를 수 있는 모양 없음), 페이지 안 다른 결과 페이지 링크 0개
 *   · 공유 주소 = 언어 없는 r/<id>.html · 다시 하기 = 시작 화면
 *   · 공유 링크로 들어온 새 방문자: CTA 보임, 투표 안 함
 *   · 가로 넘침 없음 · 글자 넘침·단어 잘림 없음 · 콘솔 오류 0 · 화면 캡처(선택: 세 번째 인자 폴더)
 *
 * 실행: node tools/flow-test.js                       (en,ko,ru × 360,1440)
 *       node tools/flow-test.js en,ja 360,1440 [캡처 폴더]
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'lovestyle-core.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = (process.argv[2] || 'en,ko,ru').split(',');
const WIDTHS = (process.argv[3] || '360,1440').split(',').map(Number);
const SHOTS = process.argv[4] || '';
const HTTP_PORT = Number(process.env.LOVESTYLE_HTTP_PORT || 8911), MOCK_PORT = Number(process.env.LOVESTYLE_MOCK_PORT || 8912), CDP_PORT = Number(process.env.LOVESTYLE_CDP_PORT || 9411);
const CHROME = process.env.CHROME_BIN || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const SEED = CORE.ORDER.map((id, i) => i + 1); // 보기 i 에 i+1 표

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
  CORE.ORDER.forEach((id, i) => { for (let k = 0; k < SEED[i]; k++) jobs.push(mockRpc('poll_vote', { p_poll: CORE.POLL, p_qid: 'r0', p_opt: i })); });
  await Promise.all(jobs);
}
const OVERFLOW = `(document.documentElement.scrollWidth > innerWidth ? document.documentElement.scrollWidth : 0)`;
const SPY = `(() => { window.__tracks = []; const o = window.track; window.track = function (e) { window.__tracks.push(e); return o && o.apply(this, arguments); }; return 1; })()`;
const COUNT = (ev) => `(window.__tracks || []).filter((e) => e === '${ev}').length`;
const SHOWN = `(() => ({ start: !document.getElementById('screen-start').hidden, quiz: !document.getElementById('screen-quiz').hidden, loading: !document.getElementById('screen-loading').hidden }))()`;
// 글자가 넘치거나 단어 중간에서 잘리는지 (라틴·키릴만 — CJK·태국어·한글은 검사 제외)
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
// 이 페이지의 a[href] 중 다른 결과 페이지(r/<id>.html)로 가는 것
const OTHER_LINKS = (id) => `[...document.querySelectorAll('a[href]')].map((a) => new URL(a.getAttribute('href'), location.href).pathname).filter((p) => /\\/r\\/[a-z]+\\.html$/.test(p) && !p.endsWith('/r/${id}.html'))`;

async function runOne(lang, width, withVotes, report) {
  const T = L10N[lang];
  const tag = `[${lang} ${width}${withVotes ? '' : ' 빈 서버'}]`;
  let problems = 0;
  const say = (m) => { problems++; report(tag, m); };
  if (withVotes) await seedVotes(); else await mockRpc('__reset');
  const seeded = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'poll_vote').length;
  const root = `http://localhost:${HTTP_PORT}/`;
  const base = root + G.folderFileOf(lang, 'index.html').replace(/index\.html$/, '');
  const tab = await openTab(width);
  await tab.goto(base + '#nolang');
  await tab.eval(`localStorage.clear(); sessionStorage.clear(); localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); 1`);
  await tab.goto(base);
  if ((await tab.eval('location.pathname')) !== new URL(base).pathname) say(`지역/언어 이동이 일어남 → ${await tab.eval('location.pathname')}`);
  await tab.eval(SPY);
  // 1) 시작 화면
  const st = await tab.eval(`(() => ({ s: ${SHOWN}, ad: (() => { const a = document.querySelectorAll('#screen-start .mg-ad'); return !(a.length === 1 && a[0].classList.contains('mg-ad-start') && document.getElementById('screen-start').lastElementChild === a[0] && !!a[0].offsetParent); })(), visAds: [...document.querySelectorAll('.mg-ad:not(.mg-ad-start)')].filter((a) => a.offsetParent).length,
    visFaq: [...document.querySelectorAll('.mg-faq, [data-mg-end]')].filter((a) => a.offsetParent).length,
    h1: document.querySelector('h1').textContent.trim(), text: document.getElementById('screen-start').innerText, lang: document.documentElement.lang }))()`);
  if (st.lang !== lang) say(`<html lang> = ${st.lang}`);
  if (!st.s.start || st.s.quiz || st.s.loading) say('시작 화면이 먼저 보이지 않음');
  if (st.ad || st.visAds || st.visFaq) say('시작 화면 광고가 맨 끝 mg-ad-start 1개가 아니거나 FAQ/끝 화면이 보임');
  if (!st.h1.includes(T.start.h1Kicker)) say(`h1 에 검색어 없음: ${st.h1}`);
  CORE.ORDER.forEach((id) => { if (st.text.includes(T.types[id].name)) say(`시작 화면에 결과 ${id}`); });
  let o = await tab.eval(OVERFLOW); if (o) say(`시작 화면 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.ls-h1, .ls-badge, .ls-btn, .ls-hook, .ls-meta span')`)).forEach((w) => say(`시작 화면 ${w}`));
  await tab.shot(`${lang}-${width}-1-start.png`);
  // 2) 질문 10개 (3번에서 뒤로 가기 한 번)
  await tab.tap('#start-btn');
  await sleep(120);
  if (!(await tab.eval(SHOWN)).quiz) say('시작 버튼 → 질문 화면이 안 보임');
  if ((await tab.eval(COUNT('start'))) !== 1) say(`track('start') ${await tab.eval(COUNT('start'))}회`);
  if ((await tab.eval(`document.querySelectorAll('#screen-quiz .mg-ad').length`)) !== 1) say('질문 화면 광고 자리 1개가 아님');
  const answers = CORE.QUESTIONS.map((q, qi) => (qi * 3 + width + lang.charCodeAt(0)) % q.choices.length);
  let wentBack = false;
  for (let qi = 0; qi < CORE.QUESTIONS.length; qi++) {
    const m = await tab.eval(`(() => ({ q: document.querySelector('.ls-q-text').textContent, n: document.getElementById('progress-num').textContent,
      choices: [...document.querySelectorAll('.ls-choice')].map((b) => b.textContent) }))()`);
    if (m.q !== T.questions[qi].q) say(`Q${qi + 1} 질문 문구가 언어 파일과 다름`);
    if (m.n !== `${qi + 1} / ${CORE.QUESTIONS.length}`) say(`Q${qi + 1} 진행 표시 "${m.n}"`);
    if (JSON.stringify(m.choices) !== JSON.stringify(T.questions[qi].choices)) say(`Q${qi + 1} 보기 문구가 다름`);
    if (qi === 0 || qi === CORE.QUESTIONS.length - 1) {
      o = await tab.eval(OVERFLOW); if (o) say(`질문 화면 가로 넘침 ${o}px`);
      (await tab.eval(TEXT_FIT + `('.ls-q-text, .ls-choice, .ls-progress-num, .ls-q-num')`)).forEach((w) => say(`질문 화면 ${w}`));
    }
    if (qi === 0) await tab.shot(`${lang}-${width}-2-quiz.png`);
    if (qi === 2 && !wentBack) {
      // 한 번 다른 보기를 고르고 뒤로 가서 되돌아오기: 뒤로 가면 Q2 가 보이고 고른 보기가 표시돼 있어야 함
      await tab.tap('#back-btn');
      await sleep(80);
      const back = await tab.eval(`({ q: document.querySelector('.ls-q-text').textContent, picked: [...document.querySelectorAll('.ls-choice')].findIndex((b) => b.classList.contains('is-picked')) })`);
      if (back.q !== T.questions[1].q || back.picked !== answers[1]) say(`뒤로 가기 → Q2 가 아님 / 고른 보기 ${back.picked}`);
      wentBack = true;
      qi = 1; // Q2 를 다시 답했으니 다음 반복은 Q3
      await tab.tap(`.ls-choice:nth-child(${answers[1] + 1})`);
      await sleep(REDUCED_WAIT);
      continue;
    }
    await tab.tap(`.ls-choice:nth-child(${answers[qi] + 1})`);
    await sleep(REDUCED_WAIT);
  }
  const want = CORE.score(answers);
  await sleep(200);
  const s = await tab.eval(SHOWN);
  if (!s.loading) say('마지막 답 뒤 "마음 읽는 중" 화면이 안 보임');
  if ((await tab.eval(COUNT('done'))) !== 1) say(`track('done') ${await tab.eval(COUNT('done'))}회`);
  (await tab.eval(TEXT_FIT + `('.ls-loading-text, .ls-loading-sub')`)).forEach((w) => say(`마음 읽는 중 화면 ${w}`));
  // 3) 결과 페이지로 이동
  let path1 = '';
  for (let i = 0; i < 60; i++) { await sleep(100); try { path1 = await tab.eval('location.pathname'); } catch (e) { /* 이동 중 */ } if (/\/r\/[a-z]+\.html$/.test(path1)) break; }
  await sleep(300);
  await tab.settle();
  await sleep(500); // 투표 + 합계
  const got = (path1.match(/\/r\/([a-z]+)\.html$/) || [])[1];
  if (got !== want) say(`결과 ${got} ≠ 채점 ${want}`);
  const id = got || want;
  const tt = T.types[id];
  const r = await tab.eval(`(() => {
    const end = document.querySelector('[data-mg-end]');
    const kids = end ? [...end.children].map((c) => c.matches('[data-mg-rating]') ? 'rating' : c.classList.contains('mg-ad') ? 'ad' : c.classList.contains('mg-end-share') ? 'share' : c.classList.contains('mg-end-faq') ? 'faq' : c.classList.contains('mg-end-retry') ? 'retry' : c.classList.contains('mg-end-more') ? 'more' : c.className) : [];
    const card = document.querySelector('.ls-card');
    const same = document.getElementById('same-share');
    const pairs = [...document.querySelectorAll('.ls-pair-card')];
    return { kids, cardBeforeEnd: !!(card && end && (card.compareDocumentPosition(end) & Node.DOCUMENT_POSITION_FOLLOWING)),
      faqItems: document.querySelectorAll('.mg-end-faq .mg-faq').length, shareBtns: document.querySelectorAll('.mg-end-share .mg-share-btn').length,
      name: document.getElementById('result-name').textContent, same: same.hidden ? null : same.textContent,
      cta: !document.getElementById('share-cta').hidden,
      pairTags: pairs.map((p) => p.tagName + (p.querySelector('a,button') ? '+a' : '')), pairCursor: pairs.map((p) => getComputedStyle(p).cursor),
      pairNames: pairs.map((p) => p.querySelector('.ls-pair-name').textContent),
      retry: document.querySelector('.mg-end-retry') && document.querySelector('.mg-end-retry').textContent,
      others: ${OTHER_LINKS(id)}, lang: document.documentElement.lang };
  })()`);
  const order = ['rating', 'ad', 'share', 'faq', 'retry', 'more'];
  if (r.lang !== lang) say(`결과 페이지 <html lang> = ${r.lang}`);
  if (r.kids.join(',') !== order.join(',')) say(`끝 화면 순서 ${r.kids.join(' → ')}`);
  if (!r.cardBeforeEnd) say('결과 카드가 공통 끝 화면보다 위에 있지 않음');
  if (r.faqItems !== T.faq.length || r.shareBtns !== 6) say(`FAQ ${r.faqItems}개 / 공유 버튼 ${r.shareBtns}개`);
  if (!r.name.includes(tt.name) || !r.name.includes(T.result.eyebrow)) say(`결과 제목 "${r.name}"`);
  if (r.cta) say('방금 푼 사람에게 "해 보기" CTA 가 보임');
  if (r.pairTags.join() !== 'DIV,DIV' || r.pairCursor.some((c) => c === 'pointer')) say(`찰떡궁합·앙숙 카드가 누를 수 있어 보임 ${r.pairTags} ${r.pairCursor}`);
  if (r.pairNames.join('|') !== [T.types[CORE.TYPES[id].best].name, T.types[CORE.TYPES[id].rival].name].join('|')) say(`찰떡궁합·앙숙 이름 ${r.pairNames}`);
  if (r.others.length) say(`다른 결과 페이지 링크 ${r.others.join(', ')}`);
  if (r.retry !== T.result.retry) say(`다시 하기 라벨 "${r.retry}"`);
  let votedPct = null;
  if (withVotes) {
    const i = CORE.ORDER.indexOf(id);
    const pct = ((SEED[i] + 1) / (SEED.reduce((a, b) => a + b, 0) + 1)) * 100;
    const txt = await tab.eval(`(${pct}).toLocaleString('${lang}', { maximumFractionDigits: ${pct < 10 ? 1 : 0} })`);
    votedPct = txt;
    const wantSame = T.result.sameShare.replace('{pct}', txt);
    if (r.same !== wantSame) say(`같은 유형 비율 "${r.same}" ≠ "${wantSame}"`);
  } else if (r.same) say(`빈 서버인데 비율이 보임 "${r.same}"`);
  o = await tab.eval(OVERFLOW); if (o) say(`결과 페이지 가로 넘침 ${o}px`);
  (await tab.eval(TEXT_FIT + `('.ls-eyebrow, .ls-result-name, .ls-vibe, .ls-same, .ls-sub, .ls-chips li, .ls-pair-label, .ls-pair-name, .mg-end-retry, .mg-end-h')`)).forEach((w) => say(`결과 페이지 ${w}`));
  await tab.shot(`${lang}-${width}-3-result.png`);
  // 공유 주소: 언어 없는 r/<id>.html
  const share = await tab.eval('window.getShareData()');
  const sharePath = new URL(share.url).pathname;
  if (!sharePath.endsWith(`/r/${id}.html`) || /\/(ja|zh|ko|fr|de|th|vi|es|it|pt|ru)\/|_l\//.test(sharePath)) say(`공유 주소 ${share.url}`);
  if (!share.text.includes(tt.name) || !share.text.includes(tt.vibe)) say(`공유 문구 "${share.text}"`);
  // 서버로 간 투표: 1건, r0 / 그 유형 번호
  const log = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'poll_vote').slice(seeded);
  if (log.length !== 1 || log[0].args.p_poll !== CORE.POLL || log[0].args.p_qid !== 'r0' || log[0].args.p_opt !== CORE.pollSlot(id).opt) say(`투표 ${JSON.stringify(log.map((e) => e.args))}`);
  // 4) 다시 하기 → 시작 화면
  await tab.tap('[data-mg-end] .mg-end-retry');
  for (let i = 0; i < 40; i++) { await sleep(100); try { if (/\/(index\.html)?$/.test(await tab.eval('location.pathname')) && await tab.eval(`!!document.getElementById('start-btn')`)) break; } catch (e) { /* 이동 중 */ } }
  await tab.settle();
  if (!(await tab.eval(`!!document.getElementById('screen-start') && !document.getElementById('screen-start').hidden`))) say('다시 하기 → 시작 화면이 아님');
  const errors1 = tab.errors.slice();
  await tab.send('Page.close').catch(() => {});
  // 5) 공유 링크로 들어온 새 방문자(새 탭 = 새 sessionStorage): CTA 보임, 투표 안 함
  const tab2 = await openTab(width);
  await tab2.goto(root + G.folderFileOf(lang, `r/${id}.html`) + '#nolang');
  await tab2.eval(`localStorage.setItem('mg_supa_url', 'http://localhost:${MOCK_PORT}'); localStorage.setItem('lang_pref', '${lang}'); localStorage.setItem('mg_lang', '${lang}'); sessionStorage.clear(); 1`);
  await tab2.goto(root + G.folderFileOf(lang, `r/${id}.html`));
  await sleep(400);
  const v = await tab2.eval(`({ cta: !document.getElementById('share-cta').hidden, href: document.getElementById('share-cta').getAttribute('href') })`);
  if (!v.cta) say('공유로 들어온 방문자에게 CTA 가 안 보임');
  const log2 = JSON.parse(await mockRpc('__log')).filter((e) => e.fn === 'poll_vote').slice(seeded);
  if (log2.length !== 1) say(`공유 방문자가 투표함 (${log2.length}건)`);
  if (width === WIDTHS[0]) await tab2.shot(`${lang}-${width}-4-shared.png`);
  errors1.concat(tab2.errors).forEach((e) => say('콘솔 오류: ' + e));
  await tab2.send('Page.close').catch(() => {});
  return { problems, id, name: tt.name, order: r.kids.join('→'), same: r.same, votedPct };
}
const REDUCED_WAIT = 330; // 보기를 누른 뒤 다음 문항까지(lovestyle.js 240ms)

async function main() {
  if (!CHROME) { console.log('Chrome 을 찾을 수 없다 (CHROME_BIN)'); process.exit(2); }
  const server = spawn('python3', ['-m', 'http.server', String(HTTP_PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
  const mock = spawn(process.execPath, [path.join(REPO, 'tools', 'mock-supa.js'), String(MOCK_PORT)], { stdio: 'ignore' });
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'lovestyle-flow-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP_PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', '--disable-gpu', 'about:blank'], { stdio: 'ignore' });
  let problems = 0, runs = 0;
  const report = (tag, msg) => console.log(`  ✗ ${tag} ${msg}`);
  try {
    let up = false;
    for (let i = 0; i < 80; i++) { try { if ((await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).ok) { up = true; break; } } catch (e) { /* 기다림 */ } await sleep(150); }
    if (!up) throw new Error(`Chrome CDP :${CDP_PORT} 가 안 열림 (포트가 쓰이는 중이면 LOVESTYLE_CDP_PORT 로 바꿔 다시)`);
    for (let i = 0; i < 40; i++) { try { await mockRpc('__reset'); break; } catch (e) { await sleep(100); } }
    for (let i = 0; i < 40; i++) { try { if ((await fetch(`http://127.0.0.1:${HTTP_PORT}/index.html`)).ok) break; } catch (e) { /* 기다림 */ } await sleep(150); }
    console.log(`\n=== 연애 유형 테스트 흐름 검사 (${LANGS.join(', ')} × ${WIDTHS.join(', ')}px) — python3 http.server :${HTTP_PORT} + mock-supa :${MOCK_PORT} ===`);
    const plan = [];
    LANGS.forEach((lang) => WIDTHS.forEach((w) => plan.push([lang, w, true])));
    plan.push([LANGS[0], WIDTHS[0], false]); // 빈 서버: 비율 숨김
    for (const [lang, width, withVotes] of plan) {
      const res = await runOne(lang, width, withVotes, report);
      problems += res.problems;
      runs++;
      console.log(`  ${res.problems ? '✗' : '✓'} [${lang} ${width}${withVotes ? '' : ' 빈 서버'}] 시작→10문항(뒤로 1번)→r/${res.id}.html ${res.name} · ${res.same ? `"${res.same}"` : '비율 숨김'} · 끝 화면 ${res.order} · 다시 하기 · 공유 방문자 CTA`);
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
