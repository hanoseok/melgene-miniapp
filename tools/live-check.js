#!/usr/bin/env node
/**
 * 배포된 페이지 라이브 점검 (headless Chrome, 의존성 없음).
 * 실행: node tools/live-check.js <URL> [URL ...]
 * 확인: title/lang/h1, hreflang (언어 수 + x-default = 12개), JSON-LD 파싱, AdSense 스크립트 200 + loaded, 가로 넘침, 콘솔 오류.
 * 운영 데이터를 건드리지 않도록 Supabase REST 호출과 실제 광고 요청은 막고 "시도했는지"만 본다.
 * 환경 변수 https_proxy/no_proxy 가 있으면 그대로 Chrome 에 넘긴다.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const HREFLANG_N = require('../shared/i18n.js').LOCALES.length + 1; // 언어 수 + x-default

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9361;
const PROFILE = '/tmp/cdp-profile-live';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForPort() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (r.ok) return;
    } catch (e) {}
    await sleep(200);
  }
  throw new Error('chrome devtools port never came up');
}

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.listeners = {}; ws.onmessage = (e) => this.onMsg(e); }
  onMsg(e) {
    const msg = JSON.parse(e.data);
    if (msg.id && this.pending.has(msg.id)) {
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error))); else resolve(msg.result);
    } else if (msg.method) {
      (this.listeners[msg.method] || []).forEach(fn => fn(msg.params));
    }
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, fn) { (this.listeners[method] = this.listeners[method] || []).push(fn); }
  once(method, fn) {
    const wrap = (p) => { this.listeners[method] = this.listeners[method].filter(f => f !== wrap); fn(p); };
    this.on(method, wrap);
  }
}
async function newTab() { const r = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' }); return r.json(); }
async function connect(u) { const ws = new WebSocket(u); await new Promise((a, b) => { ws.onopen = a; ws.onerror = b; }); return new CDP(ws); }

// 운영 데이터를 건드리지 않도록 Supabase 호출과 실제 광고 요청은 막고, "시도했는지"만 본다.
const BLOCK = ['*supabase.co/rest/*', '*googleads.g.doubleclick.net*', '*pagead2.googlesyndication.com/pagead/ads*', '*tpc.googlesyndication.com*', '*fundingchoicesmessages.google.com*'];
const URLS = process.argv.slice(2);

(async () => {
  fs.rmSync(PROFILE, { recursive: true, force: true });
  const proc = spawn(CHROME, [...(process.env.https_proxy ? [`--proxy-server=${process.env.https_proxy}`, `--proxy-bypass-list=${(process.env.no_proxy || '').split(',').join(';')}`] : []), `--remote-debugging-port=${PORT}`, '--headless=new', '--disable-gpu', `--user-data-dir=${PROFILE}`, '--no-first-run', '--no-default-browser-check'], { stdio: 'ignore', detached: true });
  proc.unref();
  await waitForPort();
  let bad = 0;
  for (const url of URLS) {
    const t = await newTab();
    const cdp = await connect(t.webSocketDebuggerUrl);
    const reqs = [], errs = [];
    cdp.on('Network.requestWillBeSent', (p) => reqs.push({ id: p.requestId, url: p.request.url }));
    const resp = {};
    cdp.on('Network.responseReceived', (p) => { resp[p.requestId] = p.response.status; });
    const failed = {};
    cdp.on('Network.loadingFailed', (p) => { failed[p.requestId] = p.blockedReason || p.errorText; });
    cdp.on('Runtime.exceptionThrown', (p) => errs.push('exception: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text).split('\n')[0]));
    cdp.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error') errs.push('console: ' + p.args.map((a) => a.value || a.description).join(' ')); });
    await cdp.send('Network.enable');
    await cdp.send('Network.setBlockedURLs', { urls: BLOCK });
    await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Page.navigate', { url });
    await sleep(5000);
    await cdp.send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight)' });
    await sleep(2500);
    const r = await cdp.send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return (j['@graph'] || [j]).map(x => x['@type']).join('+'); } catch (e) { return 'INVALID'; } });
      return { title: document.title, lang: document.documentElement.lang, h1: (document.querySelector('h1')||{}).textContent?.replace(/\\s+/g,' ').trim(),
        hreflang: document.querySelectorAll('link[rel=alternate][hreflang]').length, canonical: (document.querySelector('link[rel=canonical]')||{}).href,
        adsbygoogleLoaded: !!(window.adsbygoogle && window.adsbygoogle.loaded), adMeta: !!document.querySelector('meta[name=google-adsense-account]'),
        ld, overflowX: document.documentElement.scrollWidth - innerWidth };
    })()` });
    const v = r.result.value;
    const adsJs = reqs.find((q) => q.url.includes('adsbygoogle.js?client=ca-pub-6807370217216401'));
    const rpc = reqs.filter((q) => q.url.includes('supabase.co/rest/v1/rpc/')).map((q) => q.url.split('/rpc/')[1]);
    const adReq = reqs.filter((q) => /pagead\/ads|doubleclick/.test(q.url)).length;
    const ok = v.adsbygoogleLoaded && adsJs && resp[adsJs.id] === 200 && v.hreflang === HREFLANG_N && !v.ld.includes('INVALID') && v.overflowX <= 0 && errs.length === 0;
    if (!ok) bad++;
    console.log(`${ok ? 'OK  ' : 'BAD '} ${url}\n     title="${v.title}" lang=${v.lang} h1="${(v.h1||'').slice(0,60)}"\n     hreflang=${v.hreflang} ld=[${v.ld}] adsbygoogle.js=${adsJs ? resp[adsJs.id] : 'none'} loaded=${v.adsbygoogleLoaded} adRequestsAttempted=${adReq} supabaseRpc=[${[...new Set(rpc)]}] overflowX=${v.overflowX}${errs.length ? '\n     errors: ' + errs.slice(0, 3).join(' | ') : ''}`);
    await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`);
  }
  try { process.kill(-proc.pid); } catch (e) { try { process.kill(proc.pid); } catch (e2) {} }
  console.log(bad ? `FAIL ${bad}` : 'ALL OK');
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
