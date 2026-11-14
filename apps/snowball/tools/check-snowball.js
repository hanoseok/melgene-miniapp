#!/usr/bin/env node
/**
 * 눈싸움(Snowball Fight) 검사.
 *   1) 로직(snowball-core.js): 준비 상태(아무것도 안 움직임·시간 안 흐름)·start, 고정 tick(dt 를 나눠도 같음·MAX_STEP),
 *      같은 시드 + 같은 입력 = 같은 판, 60초가 지나면 끝(time), 하트 3개를 다 잃으면 끝(out), 종류(점수·친구 감점·황금 드묾),
 *      던지기(누른 상대 겨냥·비행 시간 뒤 판정·내려간 상대는 빗나감·숙이면 못 던짐·쿨다운·동시에 MAX_BALLS),
 *      콤보(연속 명중 배수·빗나감/친구/맞음이면 0), 상대 던지기(팔 들기 경고 → 공 → 숙이면 막음, 아니면 하트 −1, 팔 드는 중 맞히면 안 던짐),
 *      난이도 상승, 자동 플레이 40판 점수 범위, 등급 6단계, plausible, crypto 시드. 서버 인코딩: game 이름, bucket 0..MAX_BUCKET, percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어·th 태국어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="snowball" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(guide 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-snowball.js   (cwd = apps/snowball)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'snowball-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const FRAME = 1000 / 60;
function play(seed, ctrl, frame) {
  const s = C.newGame(seed);
  C.start(s);
  const evs = [];
  let guard = 0;
  while (!s.over && guard++ < 100000) evs.push(...C.step(s, frame || FRAME, ctrl));
  return { s, evs };
}
// 빈 판 하나 (상대 없음, 새 상대 안 나옴)
function quiet(seed) {
  const s = C.newGame(seed || 1);
  C.start(s);
  s.spawnCd = 1e9;
  return s;
}
function put(s, slot, kind, extra) {
  const p = Object.assign({ id: ++s.popSeq, slot, kind, phase: 'up', rise: 1, t: 0, upMs: 5000, throwAt: -1, wind: 0, windMs: 500, thrown: false, look: 0 }, extra || {});
  s.pops.push(p);
  return p;
}
function run(s, ms, ctrl) { const ev = []; for (let t = 0; t < ms; t += FRAME) ev.push(...C.step(s, FRAME, ctrl)); return ev; }

function checkCore() {
  // 준비 상태
  const r = C.newGame(42);
  const before = JSON.stringify([r.timeLeft, r.pops.length, r.spawnCd]);
  C.step(r, 500, () => ({ duck: true }));
  if (JSON.stringify([r.timeLeft, r.pops.length, r.spawnCd]) !== before) bad('준비 상태(start 전)에 무언가 움직임');
  if (C.throwAt(r, 180, 300)) bad('준비 상태에서 던질 수 있음');
  if (r.timeLeft !== C.ROUND_MS || C.ROUND_MS !== 60000) bad('한 판은 60초');
  if (r.hearts !== 3 || C.HEARTS !== 3) bad('하트는 3개');
  // 자리
  if (C.SLOTS.length !== 5 || C.SLOTS.some((sl) => !(sl.y > C.HORIZON && sl.y + 40 < C.WALL_Y && sl.x > 30 && sl.x < C.W - 30))) bad('요새 자리 5곳이 마당 안에 있어야 함');
  // 고정 tick: 같은 시간을 다르게 쪼개도 같은 판
  const p1 = play(99, C.autoPlay, FRAME), p2 = play(99, C.autoPlay, 7.3), p3 = play(99, C.autoPlay, 33);
  if (p1.s.score !== p2.s.score || p1.s.score !== p3.s.score || p1.s.hits !== p3.s.hits) bad(`dt 를 다르게 쪼개면 결과가 달라짐 ${p1.s.score}/${p2.s.score}/${p3.s.score}`);
  const p4 = play(99, C.autoPlay, FRAME);
  if (p4.s.score !== p1.s.score || p4.s.blocked !== p1.s.blocked) bad('같은 시드 + 같은 입력인데 결과가 다름');
  const big = C.newGame(5); C.start(big); C.step(big, 5000);
  if (big.ticks > Math.ceil(C.MAX_STEP / C.TICK_MS) + 1) bad('큰 dt 는 MAX_STEP 으로 잘라야 함');
  // 60초 → 끝
  if (!p1.s.over || p1.s.endReason !== 'time' || Math.abs(p1.s.elapsed - C.ROUND_MS) > C.TICK_MS + 1e-6) bad(`60초 뒤 끝나지 않음 ${p1.s.elapsed} ${p1.s.endReason}`);
  if (p1.evs.filter((e) => e.type === 'time').length !== 1) bad('time 사건은 한 번');
  if (C.step(p1.s, 1000, C.autoPlay).length || p1.s.timeLeft !== 0) bad('끝난 판은 더 움직이지 않음');
  // 아무것도 안 하면: 0점, 결국 하트를 다 잃고 끝(out)
  const idle = play(77, () => ({ duck: false }));
  if (idle.s.score !== 0 || idle.s.endReason !== 'out' || idle.s.hearts !== 0 || idle.s.taken !== 3) bad(`아무것도 안 하면 0점·세 번 맞고 끝 ${idle.s.score} ${idle.s.endReason}`);
  if (idle.evs.filter((e) => e.type === 'out').length !== 1) bad('out 사건은 한 번');
  if (!C.plausible(idle.s)) bad('하트를 다 잃고 끝난 판도 plausible');
  // 계속 숙이고만 있으면: 맞지 않음(하트 그대로), 던지기 0
  const hide = play(78, () => ({ duck: true, throwAt: { x: 180, y: 300 } }));
  if (hide.s.hearts !== 3 || hide.s.throws !== 0 || hide.s.endReason !== 'time' || !(hide.s.blocked > 3)) bad(`숙이고만 있으면 다 막고 못 던짐 (하트 ${hide.s.hearts}, 던지기 ${hide.s.throws}, 막음 ${hide.s.blocked})`);
  // 종류
  const ids = C.KINDS.map((k) => k.id).join(',');
  if (ids !== 'kid,snowman,golden,dog,flag') bad(`상대 종류 ${ids}`);
  const K = C.KIND_BY_ID;
  if (!(K.kid.pts > 0 && K.snowman.pts > K.kid.pts && K.golden.pts > K.snowman.pts)) bad('점수: 아이 < 눈사람 < 황금 눈사람');
  if (!(K.dog.friend && K.flag.friend && K.dog.pts < 0 && K.flag.pts < 0 && !K.dog.throws && !K.flag.throws && !K.golden.throws)) bad('친구(개·흰 깃발)는 감점·안 던짐, 황금은 안 던짐');
  const rnd = C.mulberry32(1); const cnt = {};
  for (let i = 0; i < 20000; i++) { const k = C.pickKind(rnd()).id; cnt[k] = (cnt[k] || 0) + 1; }
  if (!(cnt.golden > 300 && cnt.golden < 1400)) bad(`황금 눈사람은 가끔(2~7%) ${cnt.golden}/20000`);
  if (!((cnt.dog + cnt.flag) > 1600 && (cnt.dog + cnt.flag) < 4000)) bad(`친구는 8~20% ${cnt.dog + cnt.flag}/20000`);
  // 던지기: 누른 상대를 겨냥, 비행 시간 뒤 명중
  let s = quiet(3);
  const kid = put(s, 3, 'kid');
  const c3 = C.hitCenter(C.SLOTS[3]);
  const b = C.throwAt(s, c3.x + 10, c3.y + 6);
  if (!b || b.popId !== kid.id || b.x !== c3.x || b.dur !== C.FLIGHT_NEAR) bad('누른 자리의 상대를 겨냥해야 함');
  if (C.throwAt(s, c3.x, c3.y)) bad('쿨다운 중엔 못 던짐');
  let ev = run(s, C.FLIGHT_NEAR - 30);
  if (ev.some((e) => e.type === 'hit')) bad('공이 도착하기 전에 명중');
  ev = run(s, 60);
  const hit = ev.find((e) => e.type === 'hit');
  if (!hit || hit.pts !== K.kid.pts || s.score !== K.kid.pts || s.hits !== 1 || s.combo !== 1 || kid.phase !== 'hit') bad(`아이 명중 ${JSON.stringify(ev)}`);
  run(s, C.HIT_MS + 50);
  if (s.pops.length) bad('맞은 상대는 쓰러진 뒤 사라짐');
  // 뒷줄은 더 오래 날아감
  s = quiet(4); put(s, 0, 'kid');
  const c0 = C.hitCenter(C.SLOTS[0]);
  const bf = C.throwAt(s, c0.x, c0.y);
  if (!bf || bf.dur !== C.FLIGHT_FAR || !(C.FLIGHT_FAR > C.FLIGHT_NEAR)) bad('뒷줄은 비행 시간이 더 김');
  // 공이 도착하기 전에 내려가면 빗나감
  s = quiet(5);
  const q = put(s, 2, 'kid', { upMs: 60 });
  const c2 = C.hitCenter(C.SLOTS[2]);
  C.throwAt(s, c2.x, c2.y);
  ev = run(s, C.FLIGHT_NEAR + 300);
  if (!ev.some((e) => e.type === 'miss') || s.hits !== 0 || s.misses !== 1 || q.phase === 'hit') bad(`내려간 상대는 빗나감 ${JSON.stringify(ev.map((e) => e.type))}`);
  // 빈 곳에 던지면 빗나감(던지기 수에 들어감)
  s = quiet(6);
  const empty = C.throwAt(s, 180, 200);
  ev = run(s, C.FLIGHT_FAR + 30);
  if (!empty || empty.popId !== 0 || !ev.some((e) => e.type === 'miss') || s.throws !== 1) bad('빈 곳에 던지면 빗나감');
  // 숙이면 못 던짐 · 동시에 MAX_BALLS
  s = quiet(7); C.setDuck(s, true);
  if (C.throwAt(s, 180, 300)) bad('숙인 동안 던질 수 있음');
  C.setDuck(s, false);
  let n = 0;
  for (let i = 0; i < 10; i++) { if (C.throwAt(s, 180, 200)) n++; s.throwCd = 0; }
  if (n !== C.MAX_BALLS) bad(`동시에 날아가는 공은 ${C.MAX_BALLS}개까지 (${n})`);
  // 콤보: 연속 명중 배수, 빗나가면 0
  s = quiet(8);
  const gains = [];
  for (let i = 0; i < 4; i++) {
    put(s, 3, 'kid');
    C.throwAt(s, c3.x, c3.y);
    gains.push(...run(s, C.FLIGHT_NEAR + C.HIT_MS + 40).filter((e) => e.type === 'hit').map((e) => e.pts));
  }
  const want = [0, 1, 2, 3].map((i) => Math.round(K.kid.pts * (1 + C.COMBO_STEP * i)));
  if (JSON.stringify(gains) !== JSON.stringify(want) || s.bestCombo !== 4) bad(`콤보 점수 ${JSON.stringify(gains)} ≠ ${JSON.stringify(want)}`);
  C.throwAt(s, 180, 200); run(s, C.FLIGHT_FAR + 30);
  if (s.combo !== 0 || s.bestCombo !== 4) bad('빗나가면 콤보 0 (최고 콤보는 그대로)');
  // 친구: 감점·콤보 0·점수는 0 밑으로 안 내려감
  s = quiet(9);
  put(s, 3, 'kid'); C.throwAt(s, c3.x, c3.y); run(s, C.FLIGHT_NEAR + C.HIT_MS + 40);
  put(s, 3, 'dog'); C.throwAt(s, c3.x, c3.y); ev = run(s, C.FLIGHT_NEAR + C.HIT_MS + 40);
  if (!ev.some((e) => e.type === 'oops') || s.score !== 0 || s.combo !== 0 || s.friendHits !== 1 || s.hits !== 1) bad(`친구를 맞히면 감점(0 밑 X)·콤보 0 (점수 ${s.score})`);
  // 황금
  s = quiet(10); put(s, 4, 'golden');
  const c4 = C.hitCenter(C.SLOTS[4]); C.throwAt(s, c4.x, c4.y); run(s, C.FLIGHT_NEAR + 40);
  if (s.score !== K.golden.pts || s.goldens !== 1) bad('황금 눈사람 점수');
  // 상대 던지기: 팔 들기 → 공 → 숙이면 막음 / 아니면 하트 −1
  s = quiet(11);
  put(s, 2, 'kid', { throwAt: 50, windMs: 400 });
  ev = run(s, 200);
  if (!ev.some((e) => e.type === 'wind')) bad('던지기 전에 팔을 듦(wind 경고)');
  ev = run(s, 400);
  if (!ev.some((e) => e.type === 'throw') || s.incoming.length !== 1) bad('팔을 든 뒤 공을 던짐');
  ev = run(s, 1200);
  if (!ev.some((e) => e.type === 'ouch') || s.hearts !== 2 || s.taken !== 1) bad('안 숙이면 하트 −1');
  s = quiet(12);
  put(s, 2, 'kid', { throwAt: 50, windMs: 400 });
  run(s, 700);
  C.setDuck(s, true);
  ev = run(s, 1200);
  if (!ev.some((e) => e.type === 'block') || s.hearts !== 3 || s.blocked !== 1) bad('숙이면 막음');
  // 팔 드는 중에 맞히면 안 던짐
  s = quiet(13);
  const w = put(s, 3, 'kid', { throwAt: 30, windMs: 600 });
  run(s, 60);
  if (!(w.wind > 0)) bad('팔 들기 시작 안 함');
  C.throwAt(s, c3.x, c3.y);
  ev = run(s, 1500);
  if (ev.some((e) => e.type === 'throw') || s.incoming.length || !ev.some((e) => e.type === 'hit' && e.stopped)) bad('팔 드는 중 맞히면 던지지 못해야 함');
  // 내가 맞으면 콤보 0
  s = quiet(14);
  put(s, 3, 'kid'); C.throwAt(s, c3.x, c3.y); run(s, C.FLIGHT_NEAR + C.HIT_MS + 40);
  put(s, 2, 'kid', { throwAt: 10, windMs: 100 }); run(s, 1500);
  if (s.combo !== 0 || s.hearts !== 2) bad('맞으면 콤보 0');
  // 난이도 상승
  const e0 = { elapsed: 0 }, e1 = { elapsed: C.RAMP_MS };
  const r0 = C.rules(e0), r1 = C.rules(e1);
  if (!(r1.gap < r0.gap && r1.maxUp > r0.maxUp && r1.upMs < r0.upMs && r1.throwChance > r0.throwChance && r1.incomingMs < r0.incomingMs && r1.windMs < r0.windMs)) bad('시간이 갈수록 어려워져야 함');
  if (!(r1.upMs > C.FLIGHT_FAR + 400)) bad('가장 어려울 때도 상대가 공 비행 시간보다 충분히 오래 보여야 함');
  // 자동 플레이 40판
  let mn = 1e9, mx = 0, sum = 0, blocked = 0, outs = 0;
  const tierHits = new Set();
  for (let i = 0; i < 40; i++) {
    const { s: g } = play(1000 + i * 7, C.autoPlay);
    mn = Math.min(mn, g.score); mx = Math.max(mx, g.score); sum += g.score; blocked += g.blocked;
    if (g.endReason !== 'time') outs++;
    tierHits.add(C.tierOf(g.score));
    if (!C.plausible(g)) bad(`자동 플레이 판이 plausible 아님 (점수 ${g.score})`);
    if (g.friendHits) bad('자동 플레이가 친구를 맞힘');
  }
  const avg = sum / 40;
  if (!(avg > C.TIERS[4])) bad(`자동 플레이(빠른 반응) 평균 ${Math.round(avg)} 점이 높은 등급에 못 미침`);
  if (mx > C.MAX_PLAUSIBLE * 0.7) bad(`자동 플레이 최고 ${mx} 점 — MAX_PLAUSIBLE 여유가 부족`);
  if (!(blocked > 40)) bad(`자동 플레이 40판에서 상대 공을 막은 수가 너무 적음 (${blocked}) — 상대가 거의 안 던짐`);
  // 숙이지 않는 자동 플레이는 대부분 하트를 다 잃음 (숙이기가 의미 있음)
  let noDuckOut = 0;
  for (let i = 0; i < 10; i++) { const { s: g } = play(i, (st) => Object.assign(C.autoPlay(st), { duck: false })); if (g.endReason === 'out') noDuckOut++; }
  if (noDuckOut < 6) bad(`숙이지 않아도 버팀 (${noDuckOut}/10 판만 아웃)`);
  // 등급·plausible
  if (C.TIERS.length !== 6 || C.TIERS[0] !== 0 || C.TIERS.some((t, i) => i && t <= C.TIERS[i - 1])) bad('등급 6단계, 오름차순');
  if (C.tierOf(0) !== 0 || C.tierOf(C.TIERS[5]) !== 5 || C.tierOf(C.TIERS[3] - 1) !== 2) bad('tierOf');
  const fake = Object.assign(C.newGame(1), { over: true, endReason: 'time', elapsed: C.ROUND_MS, score: C.MAX_PLAUSIBLE + 5, throws: 10 });
  if (C.plausible(fake)) bad('너무 높은 점수는 plausible 아님');
  fake.score = 100; fake.elapsed = 3000;
  if (C.plausible(fake)) bad('60초를 다 채우지 않은 판(time)은 plausible 아님');
  fake.elapsed = C.ROUND_MS; fake.hits = 20; fake.throws = 5;
  if (C.plausible(fake)) bad('맞힌 수가 던진 수보다 많으면 plausible 아님');
  fake.hits = 5; fake.throws = 10;
  if (!C.plausible(fake)) bad('정상 판은 plausible');
  Object.assign(fake, { endReason: 'out', hearts: 1, taken: 2 });
  if (C.plausible(fake)) bad('하트가 남았는데 out 이면 plausible 아님');
  if (C.plausible(C.newGame(2))) bad('끝나지 않은 판은 plausible 아님');
  // crypto 시드
  const seeds = new Set(Array.from({ length: 20 }, () => C.randomSeed()));
  if (seeds.size < 19) bad('randomSeed 가 crypto 난수가 아님');
  if (!/crypto\.getRandomValues/.test(fs.readFileSync(path.join(SITE, 'snowball-core.js'), 'utf8'))) bad('시드는 crypto.getRandomValues');
  // 서버 인코딩
  if (C.GAME !== 'snowball') bad('GAME 이름');
  if (C.bucket(0) !== 0 || C.bucket(9) !== 0 || C.bucket(10) !== 1 || C.bucket(1e9) !== C.MAX_BUCKET || C.bucket(-5) !== 0 || C.bucket('x') !== 0) bad('bucket');
  if (C.MAX_BUCKET * 10 < C.MAX_PLAUSIBLE) bad('MAX_BUCKET 이 MAX_PLAUSIBLE 을 담지 못함');
  const pr = C.percentile([{ score_bucket: 10, players: 3 }, { score_bucket: 20, players: 1 }, { score_bucket: 40, players: 2 }], 20);
  if (!pr || pr.others !== 5 || pr.beatPct !== 60 || pr.top !== 40) bad(`percentile ${JSON.stringify(pr)}`);
  const pf = C.percentile([{ score_bucket: 12, players: 1 }], 12);
  if (!pf || !pf.first) bad('나 혼자면 first');
  if (C.percentile(null, 3) !== null) bad('실패(null)면 null');
  const pz = C.percentile([{ score_bucket: 5, players: 2 }], 7);
  if (!pz || pz.others !== 2 || pz.beatPct !== 100) bad('내 구간이 없으면 한 명 더해서 계산');
  console.log(`로직: 자동 플레이 40판 최소 ${mn} · 평균 ${Math.round(avg)} · 최고 ${mx} 점 (등급 ${[...tierHits].sort().join(',')}) · 막음 ${blocked}회 · 아웃 ${outs}판 · 숙이지 않으면 아웃 ${noDuckOut}/10 · 황금 ${cnt.golden}/20000`);
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
  if (o && typeof o === 'object') return Object.keys(o).sort().flatMap((k) => [`${p}.${k}`, ...(o[k] && typeof o[k] === 'object' ? shape(o[k], `${p}.${k}`) : [])]);
  return [];
}
const THAI_MARK = (c) => c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e);
const WIDE = (c) => (c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x3000 && c <= 0x303f);
function emWidth(str) {
  let w = 0;
  for (const ch of String(str).replace(/<[^>]+>/g, '')) {
    const c = ch.codePointAt(0);
    if (/\p{Extended_Pictographic}/u.test(ch)) w += 1.2;
    else if (c === 0xfe0f || c === 0x200d) w += 0;
    else if (THAI_MARK(c)) w += 0;
    else if (c >= 0x0e00 && c <= 0x0e7f) w += 0.62;
    else if (WIDE(c)) w += 1;
    else if (ch === ' ' || ch === ' ' || ch === ' ') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.68;
    else if (/[а-яё]/.test(ch)) w += 0.6;
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[.,:;!?'’"“”«»„()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.56;
  }
  return w;
}
const visLen = (s) => Array.from(String(s)).filter((ch) => !THAI_MARK(ch.codePointAt(0))).length;
const isWideLang = (lang) => ['ja', 'zh', 'ko', 'th'].includes(lang);
const words = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s  ]+|-/).filter(Boolean);
const longestWord = (s) => words(s).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');
const firstFont = (s) => String(s || '').split(',')[0].replace(/['"]/g, '').trim();
// 제목 글꼴 폭 보정 (Fredoka·Rubik 은 조금 넓은 편)
const displayFactor = (T) => ({ Fredoka: 1.1, Rubik: 1.12, 'Baloo 2': 1.05, Mitr: 1.1, Jua: 1.02, 'RocknRoll One': 1.05, 'ZCOOL KuaiLe': 1.02 }[firstFont(T.fonts.display)] || 1.05);
// 줄 수 계산 (라틴·키릴: 단어 단위, CJK·태국어: 글자 단위)
function lines(T, lang, text, size, px, factor) {
  const f = factor == null ? displayFactor(T) : factor;
  if (isWideLang(lang)) return Math.ceil((emWidth(text) * size * f) / px);
  let n = 1, cur = 0;
  const space = 0.28 * size * f;
  words(text).forEach((w) => {
    const ww = emWidth(w) * size * f;
    if (cur && cur + space + ww > px) { n++; cur = ww; } else cur += (cur ? space : 0) + ww;
  });
  return n;
}
// 360px 폭(본문 칸 328px) 예산
const HOW_PX = (328 - 16) / 3 - 15;   // 방법 칸 안쪽 폭
const STAT_PX = (328 - 36 - 16) / 3 - 11;
// HUD: 328 − 44(일시정지) − 18(간격) = 266 → 1.15 : 1 : 1 → 97 / 84 / 84, 안쪽 여백 16+3 → 78 / 65 / 65
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄', factor: 1.02 },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지', factor: 1.02 },
  ...['throw', 'duck', 'avoid'].map((k) => ({ key: `start.how.${k}`, get: (T) => T.start.how[k], px: HOW_PX, size: 14, max: 3, what: '방법 칸 세 줄까지', word: HOW_PX })),
  { key: 'play.score', get: (T) => T.play.score, px: 78, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.time', get: (T) => T.play.time, px: 65, size: 11, max: 1, what: 'HUD 시간 이름표', track: 0.06 },
  { key: 'play.lives', get: (T) => T.play.lives, px: 65, size: 11, max: 1, what: 'HUD 하트 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328 - 6 - 32 - 32, size: 16, max: 2, what: '준비 안내 두 줄까지(필드 안)' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'play.duck', get: (T) => T.play.duck, px: 328 - 32 - 40, size: 20, max: 1, what: '숙이기 버튼 한 줄' },
  // 캔버스 글자(18~22px, 세계 360 단위 폭): 세계 300 단위 안
  ...['miss', 'block', 'ouch', 'timeUp', 'out'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: 300, size: 22, max: 1, what: '캔버스 글자 한 줄', factor: 1.05 })),
  { key: 'play.golden', get: (T) => T.play.golden.replace('{n}', '100'), px: 300, size: 22, max: 1, what: '캔버스 글자 한 줄', factor: 1.05 },
  { key: 'play.oops', get: (T) => T.play.oops.replace('{n}', '25'), px: 300, size: 22, max: 1, what: '캔버스 글자 한 줄', factor: 1.05 },
  { key: 'play.combo', get: (T) => T.play.combo.replace('{n}', '88'), px: 160, size: 17, max: 1, what: '캔버스 콤보 배지', factor: 1.05 },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.reasonTime', get: (T) => T.result.reasonTime, px: 328 - 32, size: 15, max: 2, what: '끝난 이유 두 줄까지', factor: 1.05 },
  { key: 'result.reasonOut', get: (T) => T.result.reasonOut, px: 328 - 32, size: 15, max: 2, what: '끝난 이유 두 줄까지', factor: 1.05 },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄', factor: 1.02 },
  ...['hits', 'accuracy', 'bestCombo'].map((k) => ({ key: `result.${k}`, get: (T) => T.result[k], px: STAT_PX, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT_PX })),
  { key: 'result.tierLabel', get: (T) => T.result.tierLabel, px: 328 - 36, size: 13, max: 1, what: '등급 이름표 한 줄', factor: 1.02 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: 328 - 36, size: 24, max: 1, what: '등급 이름 한 줄' })),
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Oswald'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n', 'tier']], ['play.combo', ['n']], ['play.golden', ['n']], ['play.oops', ['n']]];
const get = (o, k) => k.split('.').reduce((x, p) => (x ? x[p] : undefined), o);

function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
      const en = Object.fromEntries(flat(L10N.en));
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.')) return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = flat(T).filter(([k, v]) => typeof v === 'string' && !v.trim() && k !== 'fonts.sans').map(([k]) => k);
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    // 자리표시자
    PLACEHOLDERS.forEach(([k, keys]) => {
      const v = String(get(T, k) || '');
      keys.forEach((p) => { if (!v.includes(`{${p}}`)) bad(`${tag} ${k} 에 {${p}} 없음`); });
      (v.match(/\{(\w+)\}/g) || []).forEach((mm) => { if (!keys.includes(mm.slice(1, -1))) bad(`${tag} ${k} 모르는 자리표시자 ${mm}`); });
    });
    flat(T).forEach(([k, v]) => {
      if (typeof v !== 'string' || PLACEHOLDERS.some(([pk]) => pk === k) || k.startsWith('fonts.')) return;
      if (/\{\w+\}/.test(v)) bad(`${tag} ${k} 에 쓰지 않는 자리표시자`);
    });
    if (/\d/.test(T.result.beatAll) || /\d/.test(T.result.comparing)) bad(`${tag} beatAll/comparing 에 숫자 금지 (가짜 숫자처럼 보임)`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
    });
    // 글꼴
    const F = T.fonts || {};
    if (!F.css || !F.display || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display 이상`);
    const disp = firstFont(F.display);
    if (F.css && !F.css.includes(disp.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${disp} 가 없음`);
    if (F.sans && F.css && !F.css.includes(firstFont(F.sans).replace(/ /g, '+'))) bad(`${tag} fonts.css 에 본문 글꼴 ${firstFont(F.sans)} 가 없음`);
    if (lang === 'ru' && !CYRILLIC_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 는 키릴 문자를 지원하지 않음`);
    if (lang === 'vi') {
      if (!VIET_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 는 베트남어 성조를 지원하지 않음`);
      if (!F.sans || !VIET_FONTS.includes(firstFont(F.sans))) bad(`${tag} 본문 글꼴은 베트남어 지원 글꼴(Be Vietnam Pro 등)`);
    }
    if (['en', 'fr', 'de', 'es', 'it', 'pt'].includes(lang) && !LATIN_EXT_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 라틴 확장 확인 필요`);
    if (lang === 'th' && !['Kanit', 'Mitr', 'Prompt'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : ['ru', 'vi'].includes(lang) ? 32 : 36;
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const n = lines(T, lang, txt, h1Size, 328);
      if (n > 1) (isWideLang(lang) ? warn : bad)(`${tag} h1 한 줄 "${txt}" 이 360px 에서 ${n}줄`);
    });
    // 제목·설명 (seo.md)
    const tl = visLen(T.meta.title);
    const wide = isWideLang(lang) && lang !== 'ko';
    if (wide ? tl > 34 : tl > 56) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 34' : '라틴·키릴·한글 56'}자 이하)`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    const low = (x) => String(x || '').toLowerCase();
    if (!low(T.meta.title).includes(low(APP.title[lang]))) bad(`${tag} meta.title 에 app.config 제목 "${APP.title[lang]}" 이 없음`);
    if (!low(T.meta.title).includes(low(T.start.h1Kicker))) bad(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 담지 않음`);
    if (!T.result.tiers || T.result.tiers.length !== 6 || new Set(T.result.tiers).size !== 6) bad(`${tag} result.tiers 는 서로 다른 6개`);
    if (!low(T.meta.description).includes(low(APP.title[lang]).split(/[\s-]/)[0])) warn(`${tag} meta.description 에 검색어가 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (/fish|낚시|釣|钓|pêche|Angel|ตกปลา|câu cá|pesca|рыбал/i.test(JSON.stringify(T))) bad(`${tag} 다른 앱(낚시) 문구가 남아 있음`);
    if (lang === 'fr') {
      const strs = flat({ start: T.start, play: T.play, result: T.result, og: T.og, faq: T.faq, meta: T.meta }).map(([, v]) => String(v));
      strs.forEach((v) => {
        const hit = v.match(/.{0,12}[^  ][?!:;](?=\s|$|')/);
        if (hit) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
      });
    }
    // 폭 예산 (360px)
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = (b.factor || displayFactor(T)) * (1 + (b.track || 0));
      const n = lines(T, lang, v, b.size, b.px, f);
      if (n > b.max) bad(`${tag} ${b.key} "${v}" 가 360px 에서 ${n}줄 (${b.what})`);
      if (b.word && !isWideLang(lang)) {
        const lw = longestWord(v);
        const ww = emWidth(lw) * b.size * f;
        if (ww > b.word) bad(`${tag} ${b.key} 단어 "${lw}" ≈ ${Math.round(ww)}px > ${Math.round(b.word)}px (단어 잘림)`);
      }
    });
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const mm = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  return mm ? mm[0] : '';
}
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/snowball\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/snowball\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  modes.forEach(([mode, fileOf]) => {
    G.LOCALES.forEach(({ code: lang }) => {
      const T = L10N[lang];
      const f = fileOf(lang, 'index.html');
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-all.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"GameApplication"/.test(html)) bad(`${tag} appLd(WebApplication, GameApplication) 없음`);
      const start = section(html, 'screen-start');
      const playS = section(html, 'screen-play');
      const end = section(html, 'screen-end');
      if (!start || !playS || !end) { bad(`${tag} 시작/게임/끝 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-play"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 게임·끝 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (액션 게임은 진행 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음 (끝 화면 광고는 공통 컴포넌트가 넣는다)`);
      if (/data-mg-end|mg-faq|<details|sb-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="sb-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="sb-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-time', 'hud-lives', 'pause-btn', 'field', 'sb-canvas', 'tap-hint', 'pause-overlay', 'resume-btn', 'duck-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="sb-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      if ((playS.match(/<span>♥<\/span>/g) || []).length !== 3) bad(`${tag} HUD 하트 3개`);
      const resAt = end.indexOf('class="sb-result"');
      const endAt = end.indexOf('<div data-mg-end="snowball"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="snowball" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-reason', 'res-newbest', 'res-best', 'res-hits', 'res-acc', 'res-combo', 'res-tier', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="sb-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('snowball-core.js') > 0 && html.indexOf('snowball-core.js') < html.indexOf('snowball.js"'))) bad(`${tag} snowball-core.js 가 snowball.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://snowball.example.com/</loc>') || !sm.includes('<loc>https://snowball.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('snowball.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('snowball.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("snowball.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('snowball.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('snowball.js: setShareData/setRetry 없음');
  if (!/requestAnimationFrame/.test(js) || !/devicePixelRatio/.test(js)) bad('snowball.js: requestAnimationFrame·devicePixelRatio 사용');
  if (!/supa\.submitScore\(C\.GAME/.test(js) || !/C\.plausible\(s\)/.test(js) || !/keydown/.test(js) || !/pointerdown/.test(js) || !/ArrowDown/.test(js)) bad('snowball.js: supa.submitScore(C.GAME, …) + C.plausible 로 실제 백분위, 키보드·포인터 입력');
  if (/[가-힣]/.test(js.replace(/\/\/.*$/gm, ''))) bad('snowball.js 코드 안에 한글 문구 (문구는 PAGE_I18N 에서만)');
  return pages;
}

// ---------------------------------------------------------------- 4) OG · 등록
function checkOg() {
  let n = 0;
  G.LOCALES.forEach(({ dir }) => {
    const f = path.join(SITE, 'og', dir, 'default.png');
    if (!fs.existsSync(f)) return bad(`OG 없음: og/${dir ? dir + '/' : ''}default.png (node tools/gen-og.js all)`);
    const b = fs.readFileSync(f);
    if (b.toString('ascii', 1, 4) !== 'PNG' || b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) bad(`OG 크기/형식: ${path.relative(SITE, f)}`);
    n++;
  });
  return n;
}
function checkApp() {
  if (APP.id !== 'snowball' || APP.category !== 'game' || APP.path !== 'https://snowball.example.com/' || APP.added !== '2026-11-14' || APP.order !== 1 || APP.emoji !== '☃️') bad('app.config.js id/category/path/added/order/emoji');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
    else if (isWideLang(code) && code !== 'th' ? visLen(APP.title[code]) > 8 : visLen(APP.title[code]) > 18) bad(`app.config.js ${code} 제목이 김 (포털 아이콘)`);
  });
  if (!fs.lstatSync(path.join(SITE, 'shared')).isSymbolicLink() || fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 는 ../../shared 심볼릭 링크');
}

checkCore();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 게임 로직(준비·고정 tick·재현·60초·하트 3개·종류·던지기(겨냥·비행·빗나감·숙이면 못 던짐)·콤보·친구 감점·상대 던지기(경고·막기·맞기·팔 들 때 맞히면 취소)·난이도·자동 플레이·등급·plausible)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
