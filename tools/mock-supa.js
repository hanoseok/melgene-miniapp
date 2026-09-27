#!/usr/bin/env node
/**
 * 로컬 테스트용 가짜 Supabase (PostgREST RPC만 흉내). 운영 DB를 건드리지 않고 사이트 기능을 확인한다.
 * 실행: node tools/mock-supa.js [포트=8799]
 * 브라우저(localhost 페이지)에서: localStorage.mg_supa_url = 'http://localhost:8799'
 * 호출 기록 확인: POST /rest/v1/rpc/__log (나라별 합계: __geo), 초기화: POST /rest/v1/rpc/__reset
 * 방문자 나라(client_country): 요청의 cf-ipcountry 헤더 → 없으면 __country { p_cc: 'KR' | null } 로 정한 값 → 없으면 null
 * 함수 정의는 supabase/migrations/*.sql 과 같은 입출력 모양을 따른다.
 */
const http = require('http');
const port = Number(process.argv[2] || 8799);

let db;
function reset() {
  db = { shares: {}, stats: {}, geo: {}, ratings: {}, polls: {}, scores: {}, hearts: {}, heartRecent: {}, log: [], seq: 0, country: null };
}
reset();

const fns = {
  create_share: (b) => { const id = 'M' + String(++db.seq).padStart(7, '0'); db.shares[id] = { site: b.p_site, lang: b.p_lang, payload: b.p_payload, views: 0 }; return id; },
  get_share: (b) => { const r = db.shares[b.p_id]; return r ? (r.views++, [r]) : []; },
  share_count: (b) => Object.values(db.shares).filter((r) => r.site === b.p_site).length,
  // 운영(20260927040000_play_geo.sql)과 같은 모양: pv·in_search_*·in_social_*·start·done 은 나라별(daily_geo)에도 +1 (cf-ipcountry, 없으면 XX)
  bump_stat: (b, req) => {
    const k = `${b.p_site}|${b.p_lang}|${b.p_kind}`; db.stats[k] = (db.stats[k] || 0) + 1;
    const kind = String(b.p_kind || '');
    const g = kind === 'pv' || kind === 'start' || kind === 'done' ? kind : kind.startsWith('in_search_') ? 'search' : kind.startsWith('in_social_') ? 'social' : null;
    if (g) {
      let cc = String(req.headers['cf-ipcountry'] || '').toUpperCase();
      if (!/^[A-Z0-9]{2}$/.test(cc)) cc = 'XX';
      const gk = `${b.p_site}|${cc}|${g}`; db.geo[gk] = (db.geo[gk] || 0) + 1;
    }
    return null;
  },
  rate_app: (b) => {
    if (!(b.p_stars >= 1 && b.p_stars <= 5)) throw new Error('invalid rating');
    (db.ratings[b.p_site] = db.ratings[b.p_site] || {})[b.p_voter] = b.p_stars;
    const v = Object.values(db.ratings[b.p_site]);
    return [{ site_id: b.p_site, avg_stars: Math.round((v.reduce((a, c) => a + c, 0) / v.length) * 10) / 10, votes: v.length }];
  },
  // 운영(20260927010000_counts_score.sql)과 같은 모양: plays = play_app 합계, score = 하트×10 + 별점 합 + 플레이
  // (예전 시드 호환: stats 의 "<site>|<lang>|done" 합계도 플레이로 더한다)
  app_summary: () => {
    db.plays = db.plays || {};
    const sites = new Set();
    Object.keys(db.stats).forEach((k) => { const [s, , kind] = k.split('|'); if (kind === 'done') sites.add(s); });
    [db.ratings, db.hearts, db.plays].forEach((m) => Object.keys(m).forEach((s) => sites.add(s)));
    return [...sites].map((s) => {
      const legacy = Object.entries(db.stats).filter(([k]) => k.startsWith(s + '|') && k.endsWith('|done')).reduce((a, [, n]) => a + n, 0);
      const plays = (db.plays[s] || 0) + legacy;
      const v = Object.values(db.ratings[s] || {});
      const starSum = v.reduce((a, c) => a + c, 0);
      const hearts = db.hearts[s] || 0;
      return { site_id: s, plays, avg_stars: v.length ? Math.round((starSum / v.length) * 10) / 10 : null, votes: v.length, hearts, score: hearts * 10 + starSum + plays };
    });
  },
  play_app: (b, req) => {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const k = `play|${b.p_site}|${ip}`; const now = Date.now(); let counted = false;
    db.plays = db.plays || {};
    if (!db.heartRecent[k] || now - db.heartRecent[k] > 30000) { db.heartRecent[k] = now; db.plays[b.p_site] = (db.plays[b.p_site] || 0) + 1; counted = true; }
    return [{ plays: db.plays[b.p_site] || 0, counted }];
  },
  // 같은 앱·같은 IP(여기서는 X-Forwarded-For 헤더 또는 소켓 주소) 30초 쿨다운
  heart_app: (b, req) => {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
    const k = `${b.p_site}|${ip}`;
    const now = Date.now();
    let counted = false;
    if (!db.heartRecent[k] || now - db.heartRecent[k] > 30000) { db.heartRecent[k] = now; db.hearts[b.p_site] = (db.hearts[b.p_site] || 0) + 1; counted = true; }
    return [{ hearts: db.hearts[b.p_site] || 0, counted }];
  },
  poll_vote: (b) => {
    const q = ((db.polls[b.p_poll] = db.polls[b.p_poll] || {})[b.p_qid] = db.polls[b.p_poll][b.p_qid] || {});
    q[b.p_opt] = (q[b.p_opt] || 0) + 1;
    return Object.keys(q).sort().map((o) => ({ option: Number(o), votes: q[o] }));
  },
  poll_results: (b) => Object.entries(db.polls[b.p_poll] || {}).flatMap(([qid, q]) => Object.keys(q).sort().map((o) => ({ qid, option: Number(o), votes: q[o] }))),
  submit_score: (b) => {
    const g = (db.scores[b.p_game] = db.scores[b.p_game] || {});
    g[b.p_bucket] = (g[b.p_bucket] || 0) + 1;
    return Object.keys(g).map(Number).sort((a, c) => a - c).map((k) => ({ score_bucket: k, players: g[k] }));
  },
  score_distribution: (b) => { const g = db.scores[b.p_game] || {}; return Object.keys(g).map(Number).sort((a, c) => a - c).map((k) => ({ score_bucket: k, players: g[k] })); },
  // 운영(20260927050000_client_country.sql)과 같은 모양: 2글자 나라 코드 또는 null (XX·T1·이상한 값은 null)
  client_country: (b, req) => {
    const cc = String(req.headers['cf-ipcountry'] || db.country || '').toUpperCase();
    return /^[A-Z]{2}$/.test(cc) && cc !== 'XX' && cc !== 'T1' ? cc : undefined; // undefined → 200 + JSON null (PostgREST 스칼라 null 과 같음)
  },
  __country: (b) => { db.country = b.p_cc || null; return 'ok'; },
  __log: () => db.log,
  __geo: () => db.geo,
  __reset: () => { reset(); return 'ok'; },
  // 테스트 데이터 심기: { p_seed: { plays: {"life": 1234}, hearts: {"life": 5}, ratings: {"life": {"u1":5,...}}, stats: {...} } }
  __seed: (b) => { const sd = b.p_seed || {}; Object.assign(db.stats, sd.stats || {}); Object.assign(db.ratings, sd.ratings || {}); Object.assign(db.hearts, sd.hearts || {}); db.plays = Object.assign(db.plays || {}, sd.plays || {}); return 'ok'; },
};

http.createServer((req, res) => {
  const h = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'apikey, authorization, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
  if (req.method === 'OPTIONS') { res.writeHead(204, h); return res.end(); }
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const name = req.url.split('?')[0].split('/').pop();
    let b = {};
    try { b = body ? JSON.parse(body) : {}; } catch (e) { /* noop */ }
    if (!name.startsWith('__')) db.log.push({ fn: name, args: b, apikey: req.headers.apikey || null });
    const fn = fns[name];
    if (!fn) { res.writeHead(404, h); return res.end(JSON.stringify({ message: 'no such function' })); }
    try {
      const out = fn(b, req);
      if (out === null) { res.writeHead(204, h); return res.end(); }
      if (out === undefined) { res.writeHead(200, h); return res.end('null'); }
      res.writeHead(200, h); res.end(JSON.stringify(out));
    } catch (e) {
      res.writeHead(400, h); res.end(JSON.stringify({ message: e.message }));
    }
  });
}).listen(port, () => console.log(`mock supabase on http://localhost:${port}`));
