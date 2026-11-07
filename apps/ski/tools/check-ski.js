#!/usr/bin/env node
/**
 * 스키 활강(Ski Downhill) 검사.
 *   1) 로직(ski-core.js): 상수(너그러운 충돌 반지름·lane 폭·기문 폭), speedAt/rowGapAt/shiftAt 곡선, 준비 상태(움직이지 않음)·start,
 *      부드러운 옆 속도(steer → vx 수렴·MAX_VX 한도·양 끝 막힘), 고정 tick(dt 를 나눠도 같음·MAX_STEP), 같은 시드 + 같은 입력 = 같은 판,
 *      코스 불변식(lane 이동 한도·lane 주변 비움·장애물 범위·기문 = lane 가운데·장애물 없는 기문 줄), 충돌(정면 = 끝, 이후 미끄러져 멈춤),
 *      기문(가운데 통과 = 콤보·보너스, 바깥 = 콤보 0·끝나지 않음), 점수 = m + 보너스, 언제나 지나갈 수 있음(자동 조종 40판 × 2,000 m),
 *      가만히 있으면 금방 끝남, 등급 6단계, crypto 시드. 서버 인코딩: game 이름, bucket 0..1999, percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어·th 태국어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="ski" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(guide 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-ski.js   (cwd = apps/ski)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'ski-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const near = (a, b, e) => Math.abs(a - b) <= (e == null ? 1e-6 : e);
function run(seed, steerFn, maxMs, frame) {
  const s = C.newGame(seed);
  C.start(s);
  let t = 0;
  const f = frame || 1000 / 60;
  while (!s.over && t < maxMs) { C.step(s, f, steerFn); t += f; }
  return s;
}
function checkCore() {
  // 상수
  if (!(C.HIT_R < Math.min(C.RADIUS.tree, C.RADIUS.rock, C.RADIUS.snowman))) bad('스키어 충돌 반지름은 장애물보다 작게(너그러운 판정)');
  if (!(C.LANE_HALF > 3 * C.HIT_R)) bad('lane 에서 비워 두는 폭이 너무 좁음');
  if (!(C.GATE_HALF_MIN - C.FLAG_R > 3 * C.HIT_R)) bad('가장 좁은 기문도 스키어보다 넉넉해야 함');
  if (!(C.LANE_MIN >= C.GATE_HALF0 + C.EDGE)) bad('lane 이 양 끝에 너무 가까움(기문 깃발이 밖으로 나감)');
  if (C.KINDS.join() !== 'tree,rock,snowman') bad('장애물 종류는 tree·rock·snowman');
  // 곡선
  if (C.speedAt(0) !== C.SPEED0 || C.speedAt(1e9) !== C.MAX_SPEED || !(C.speedAt(5000) > C.speedAt(1000))) bad('speedAt 곡선');
  if (C.rowGapAt(0) !== C.GAP0 || C.rowGapAt(1e9) !== C.GAP_MIN) bad('rowGapAt 곡선');
  [0, 3000, 10000, 30000, 1e6].forEach((y) => {
    const t = C.rowGapAt(y) / C.speedAt(y);                         // 다음 줄까지 걸리는 시간
    const reach = C.MAX_VX * t;                                      // 그동안 옆으로 갈 수 있는 거리(최고 속도)
    if (!(C.shiftAt(y) <= reach * 0.6)) bad(`lane 이동 한도가 따라갈 수 있는 거리보다 큼 (y=${y})`);
  });
  if (!(C.densityAt(0) < C.densityAt(20000) && C.densityAt(1e9) <= 4)) bad('densityAt 곡선');
  // 준비 상태
  const s0 = C.newGame(42);
  if (s0.started || s0.over || s0.dist !== 0 || !s0.objs.length) bad('새 판: 준비 상태·코스 미리 만들기');
  C.setSteer(s0, 1);
  C.step(s0, 500);
  if (s0.dist !== 0 || s0.x !== C.W / 2 || s0.runTicks !== 0) bad('준비 상태(start 전)에는 움직이지 않아야 함');
  if (!C.start(s0) || C.start(s0)) bad('start 는 한 번만');
  // 부드러운 옆 속도
  const s1 = C.newGame(7); C.start(s1); C.setSteer(s1, 1);
  C.step(s1, 1000 / 120);
  if (!(s1.vx > 0 && s1.vx < C.MAX_VX * 0.2)) bad(`첫 tick 옆 속도는 조금만 (${s1.vx})`);
  for (let i = 0; i < 6; i++) C.step(s1, 100);
  if (!(s1.vx > C.MAX_VX * 0.95 && s1.vx <= C.MAX_VX + 1e-9)) bad(`옆 속도가 MAX_VX 로 수렴하지 않음 (${s1.vx})`);
  C.setSteer(s1, 0); for (let i = 0; i < 8; i++) C.step(s1, 100);
  if (!(Math.abs(s1.vx) < 2)) bad('손을 떼면 옆 속도가 줄어야 함');
  if (C.setSteer(s1, 5) !== 1 || C.setSteer(s1, -9) !== -1 || C.setSteer(s1, 'x') !== 0) bad('setSteer 는 -1·0·1');
  // 양 끝 막힘 (넘어지지 않음)
  const s2 = C.newGame(3); C.start(s2);
  s2.objs = []; s2.gates = []; s2.nextRowY = 1e12;
  C.setSteer(s2, -1); C.step(s2, 100); C.step(s2, 100); for (let i = 0; i < 30; i++) C.step(s2, 100);
  if (s2.x !== C.EDGE || s2.over) bad(`왼쪽 끝에서 막혀야 함 (x=${s2.x}, over=${s2.over})`);
  C.setSteer(s2, 1); for (let i = 0; i < 30; i++) C.step(s2, 100);
  if (s2.x !== C.W - C.EDGE || s2.over) bad('오른쪽 끝에서 막혀야 함');
  // 꺾으면 조금 느려짐
  const a = C.newGame(9); C.start(a); a.objs = []; a.gates = []; a.nextRowY = 1e12;
  const b = C.newGame(9); C.start(b); b.objs = []; b.gates = []; b.nextRowY = 1e12;
  C.setSteer(b, 1); b.x = 40;
  for (let i = 0; i < 5; i++) { C.step(a, 100); C.step(b, 100); }
  if (!(b.dist < a.dist && b.dist > a.dist * (1 - C.TURN_DRAG - 0.01))) bad('꺾을 때 앞 속도가 조금(TURN_DRAG 이하) 줄어야 함');
  // 고정 tick: dt 를 나눠도 같음, MAX_STEP
  const p = C.newGame(11); C.start(p); C.setSteer(p, 1);
  const q = C.newGame(11); C.start(q); C.setSteer(q, 1);
  C.step(p, 50);
  for (let i = 0; i < 10; i++) C.step(q, 5);
  if (!near(p.x, q.x) || !near(p.dist, q.dist)) bad('dt 를 나눠 돌려도 같은 결과여야 함');
  const r = C.newGame(11); C.start(r);
  C.step(r, 100000);
  if (r.runTicks !== Math.floor(C.MAX_STEP / C.TICK_MS + 1e-9)) bad(`큰 dt 는 MAX_STEP 으로 잘라야 함 (${r.runTicks})`);
  // 같은 시드 + 같은 입력 = 같은 판
  const r1 = run(1234, C.autoSteer, 30000), r2 = run(1234, C.autoSteer, 30000);
  if (r1.dist !== r2.dist || r1.x !== r2.x || C.score(r1) !== C.score(r2)) bad('같은 시드 + 같은 입력 = 같은 판');
  if (C.newGame(1).objs.map((o) => o.x).join() === C.newGame(2).objs.map((o) => o.x).join()) bad('시드가 다르면 코스도 달라야 함');
  // crypto 시드
  const seeds = new Set();
  for (let i = 0; i < 20; i++) seeds.add(C.newGame().seed);
  if (seeds.size < 19) bad('시드가 무작위가 아님');
  if (!/crypto\.getRandomValues|getRandomValues/.test(fs.readFileSync(path.join(SITE, 'ski-core.js'), 'utf8'))) bad('코스 시드는 crypto.getRandomValues');
  // 코스 불변식 (40 시드 × 약 40,000 단위 = 4 km): 한 번에 만들어 두고 검사한다(tick 을 돌리지 않으면 지운 것 없이 남음)
  let maxRowObjs = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const s = C.newGame(seed * 7919);
    s.dist = 40000;
    C.spawnAhead(s);
    const rows = s.rows, gates = s.gates, objs = s.objs;
    for (let i = 1; i < rows.length; i++) {
      const lim = C.shiftAt(rows[i].y);
      if (Math.abs(rows[i].lane - rows[i - 1].lane) > lim + 0.01) { bad(`[seed ${seed}] lane 이 한 줄에 너무 많이 움직임`); break; }
      if (rows[i].lane < C.LANE_MIN - 1e-6 || rows[i].lane > C.W - C.LANE_MIN + 1e-6) { bad(`[seed ${seed}] lane 범위 밖`); break; }
      if (!near(rows[i].y - rows[i - 1].y, C.rowGapAt(rows[i - 1].y))) { bad(`[seed ${seed}] 줄 간격이 rowGapAt 과 다름`); break; }
    }
    const byRow = new Map(rows.map((rw) => [rw.y, rw]));
    const rowOf = (y) => rows.reduce((best, rw) => (Math.abs(rw.y - y) < Math.abs(best.y - y) ? rw : best), rows[0]);
    const count = new Map();
    objs.forEach((o) => {
      const rw = rowOf(o.y);
      count.set(rw.y, (count.get(rw.y) || 0) + 1);
      if (Math.abs(o.x - rw.lane) < C.LANE_HALF + o.r - 1e-6) bad(`[seed ${seed}] 장애물이 안전한 길(lane)을 막음 x=${o.x} lane=${rw.lane}`);
      if (Math.abs(o.y - rw.y) > C.JITTER + 1e-6) bad(`[seed ${seed}] 장애물 세로 흔들림이 큼`);
      if (o.x < 18 - 1e-6 || o.x > C.W - 18 + 1e-6) bad(`[seed ${seed}] 장애물이 슬로프 밖`);
      if (!C.KINDS.includes(o.kind) || o.r !== C.RADIUS[o.kind]) bad(`[seed ${seed}] 장애물 종류/반지름`);
    });
    count.forEach((n) => { if (n > maxRowObjs) maxRowObjs = n; });
    gates.forEach((g) => {
      const rw = byRow.get(g.y);
      if (!rw || rw.lane !== g.cx) bad(`[seed ${seed}] 기문 가운데가 그 줄의 lane 이 아님`);
      if (count.get(g.y)) bad(`[seed ${seed}] 기문 줄에 장애물`);
      if (g.half < C.GATE_HALF_MIN - 1e-6 || g.half > C.GATE_HALF0 + 1e-6) bad(`[seed ${seed}] 기문 폭 범위 밖`);
    });
    if (gates.length < 40) bad(`[seed ${seed}] 기문이 너무 적음 (${gates.length})`);
  }
  if (maxRowObjs > 4) bad(`한 줄 장애물 ${maxRowObjs}개 (4개 이하)`);
  // 충돌: 장애물 정면 → 끝, 이후 미끄러져 멈춤
  const c1 = C.newGame(5); C.start(c1);
  c1.objs = [{ x: c1.x, y: 60, kind: 'rock', r: C.RADIUS.rock, v: 0 }]; c1.gates = []; c1.nextRowY = 1e12;
  const evs = [];
  for (let i = 0; i < 100 && !c1.over; i++) evs.push(...C.step(c1, 20));
  if (!c1.over || c1.crash !== 'rock' || !evs.some((e) => e.type === 'crash' && e.kind === 'rock')) bad('장애물에 부딪히면 끝(crash 사건)');
  const runD = c1.runDist;
  if (!(runD > 60 - C.RADIUS.rock - C.HIT_R - 8 && runD < 60)) bad(`부딪힌 자리가 이상함 (${runD})`);
  for (let i = 0; i < 60; i++) C.step(c1, 50);
  if (c1.runDist !== runD || c1.speed !== 0 || !(c1.dist > runD)) bad('부딪힌 뒤: 점수 거리 고정, 미끄러진 뒤 멈춤');
  // 옆으로 비켜 가면 안 부딪힘
  const c2 = C.newGame(5); C.start(c2);
  c2.objs = [{ x: c2.x + C.RADIUS.tree + C.HIT_R + 1, y: 60, kind: 'tree', r: C.RADIUS.tree, v: 0 }]; c2.gates = []; c2.nextRowY = 1e12;
  for (let i = 0; i < 50; i++) C.step(c2, 20);
  if (c2.over) bad('충돌 반지름 바깥은 안 부딪혀야 함');
  // 기문: 가운데 통과 = 콤보·보너스, 바깥 = 콤보 0
  const g1 = C.newGame(8); C.start(g1);
  g1.objs = []; g1.nextRowY = 1e12;
  g1.gates = [1, 2, 3, 4, 5, 6, 7].map((k) => ({ n: k, y: k * 100, cx: g1.x, half: 40, color: k % 2, done: false, ok: false }));
  g1.gates[3].cx = g1.x + 120;                                           // 4번째는 놓침
  const gev = [];
  for (let i = 0; i < 400; i++) gev.push(...C.step(g1, 10));
  const oks = gev.filter((e) => e.type === 'gate');
  if (oks.length !== 7 || oks[3].ok || !oks[0].ok || oks[2].combo !== 3 || oks[4].combo !== 1 || g1.combo !== 3 || g1.maxCombo !== 3) bad(`기문 콤보 ${JSON.stringify(oks.map((e) => [e.ok, e.combo]))}`);
  const expBonus = C.GATE_BONUS * (1 + 2 + 3 + 1 + 2 + 3);
  if (g1.bonus !== expBonus || g1.gatesPassed !== 6 || g1.gatesMissed !== 1 || g1.over) bad(`기문 보너스 ${g1.bonus} ≠ ${expBonus}`);
  if (C.score(g1) !== Math.floor(g1.runDist / C.PX_PER_M) + g1.bonus || C.meters(g1) !== Math.floor(g1.runDist / C.PX_PER_M)) bad('점수 = m + 보너스');
  // 콤보 한도
  const g2 = C.newGame(8); C.start(g2); g2.objs = []; g2.nextRowY = 1e12;
  g2.gates = Array.from({ length: 9 }, (_, k) => ({ n: k, y: (k + 1) * 80, cx: g2.x, half: 40, color: 0, done: false, ok: false }));
  for (let i = 0; i < 500; i++) C.step(g2, 10);
  const exp2 = C.GATE_BONUS * (1 + 2 + 3 + 4 + 5 + 5 + 5 + 5 + 5);
  if (g2.bonus !== exp2) bad(`콤보 보너스 한도(COMBO_MAX) ${g2.bonus} ≠ ${exp2}`);
  // 언제나 지나갈 수 있음: 자동 조종 40판 × 2,000 m 이상, 모두 살아남아야
  let fails = 0, minM = Infinity;
  for (let seed = 1; seed <= 40; seed++) {
    const s = run(seed * 104729, C.autoSteer, 90000);
    if (s.over || C.meters(s) < 2000) fails++;
    minM = Math.min(minM, C.meters(s));
  }
  if (fails) bad(`자동 조종이 ${fails}/40 판에서 2,000 m 전에 넘어짐 (코스가 막힘, 최소 ${minM} m)`);
  // 큰 프레임(30fps)에서도
  const s30 = run(77, C.autoSteer, 60000, 1000 / 30);
  if (s30.over) bad('30fps 프레임에서도 자동 조종이 살아남아야 함');
  // 가만히 있으면 금방 끝남 (게임이 됨)
  let idle = 0;
  for (let seed = 1; seed <= 30; seed++) idle += C.meters(run(seed, null, 120000));
  if (!(idle / 30 < 800)) bad(`가만히 있어도 너무 멀리 감 (평균 ${Math.round(idle / 30)} m)`);
  // 무작위로 꺾기도 대체로 금방 끝남
  let rnd = 0;
  for (let seed = 1; seed <= 20; seed++) { const rr = C.mulberry32(seed); let cur = 0, k = 0; rnd += C.meters(run(seed, () => { if (k++ % 30 === 0) cur = Math.floor(rr() * 3) - 1; return cur; }, 120000)); }
  if (!(rnd / 20 < 1500)) bad(`무작위 조종이 너무 멀리 감 (평균 ${Math.round(rnd / 20)} m)`);
  // 등급
  if (C.TIERS.length !== 6 || C.tierOf(0) !== 0 || C.tierOf(C.TIERS[1] - 1) !== 0 || C.tierOf(C.TIERS[1]) !== 1 || C.tierOf(1e9) !== 5) bad('등급 6단계 tierOf');
  // 서버 인코딩
  if (C.GAME !== 'ski') bad('game 이름은 ski');
  if (C.bucket(0) !== 0 || C.bucket(4) !== 0 || C.bucket(5) !== 1 || C.bucket(1234) !== 246 || C.bucket(1e9) !== C.MAX_BUCKET || C.bucket(-5) !== 0 || C.bucket('x') !== 0) bad('bucket');
  if (C.MAX_BUCKET !== 1999) bad('MAX_BUCKET 1999 (서버 2000 구간)');
  const pc = C.percentile([{ score_bucket: 10, players: 3 }, { score_bucket: 20, players: 1 }, { score_bucket: 30, players: 1 }], 20);
  if (!pc || pc.first || pc.others !== 4 || pc.beatPct !== 75 || pc.top !== 25) bad(`percentile ${JSON.stringify(pc)}`);
  const pf = C.percentile([{ score_bucket: 20, players: 1 }], 20);
  if (!pf || !pf.first) bad('혼자면 first');
  if (C.percentile(null, 3) !== null) bad('실패(null)면 null');
  const pz = C.percentile([{ score_bucket: 5, players: 2 }], 7);
  if (!pz || pz.others !== 2 || pz.beatPct !== 100) bad('내 구간이 없으면 한 명 더해서 계산');
  console.log(`로직: 자동 조종 40판 최소 ${minM} m · 가만히 평균 ${Math.round(idle / 30)} m · 무작위 평균 ${Math.round(rnd / 20)} m · 한 줄 장애물 최대 ${maxRowObjs}개`);
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
// 제목 글꼴 폭 보정 (Oswald 는 좁은 글꼴, Kanit 은 조금 넓은 편)
const displayFactor = (T) => ({ Oswald: 0.78, Kanit: 1.08, 'Black Han Sans': 1.02, 'M PLUS 1p': 1.02, 'Noto Sans SC': 1.02 }[firstFont(T.fonts.display)] || 1.05);
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
const STAT_PX = (328 - 36 - 8) / 2 - 15;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지', factor: 1.02 },
  { key: 'start.how.steer', get: (T) => T.start.how.steer, px: HOW_PX, size: 14, max: 2, what: '방법 칸 두 줄까지', word: HOW_PX },
  { key: 'start.how.gates', get: (T) => T.start.how.gates, px: HOW_PX, size: 14, max: 2, what: '방법 칸 두 줄까지', word: HOW_PX },
  { key: 'start.how.avoid', get: (T) => T.start.how.avoid, px: HOW_PX, size: 14, max: 2, what: '방법 칸 두 줄까지', word: HOW_PX },
  // HUD 칸: (328 - 44 - 12) = 272 → 1.2 : 1 → 148 / 124, 안쪽 여백 20+3 → 125 / 101 (이름표 한 줄)
  { key: 'play.dist', get: (T) => T.play.dist, px: 125, size: 11, max: 1, what: 'HUD 거리 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 101, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328 - 6 - 32 - 32, size: 16, max: 1, what: '탭 안내 한 줄(필드 안)' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄', factor: 1.02 },
  { key: 'result.gates', get: (T) => T.result.gates, px: STAT_PX, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT_PX },
  { key: 'result.time', get: (T) => T.result.time, px: STAT_PX, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT_PX },
  { key: 'result.timeValue', get: (T) => T.result.timeValue.replace('{s}', '188.8'), px: STAT_PX, size: 26, max: 1, what: '주행 시간 값 한 줄', factor: 0.9 },
  { key: 'result.tierLabel', get: (T) => T.result.tierLabel, px: 328 - 36, size: 13, max: 1, what: '등급 이름표 한 줄', factor: 1.02 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: 328 - 36, size: 24, max: 1, what: '등급 이름 한 줄' })),
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Oswald', 'Rubik', 'Nunito'];
const VIET_FONTS = ['Oswald', 'Be Vietnam Pro', 'Nunito'];
const LATIN_EXT_FONTS = ['Oswald', 'Rubik', 'Nunito'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n', 'tier']], ['result.timeValue', ['s']], ['play.gateOk', ['n', 'c']]];
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
    if (!T.result.tiers || T.result.tiers.length !== 6) bad(`${tag} result.tiers 는 6개`);
    if (!low(T.meta.description).includes(low(APP.title[lang]).split(/[\s-]/)[0])) warn(`${tag} meta.description 에 검색어가 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr' && /[^  ][?!:;](?=\s|$|')/.test(JSON.stringify([T.start, T.play, T.result, T.og, T.faq]).replace(/https?:[^"]+/g, '').replace(/\\u[0-9a-f]{4}/g, ''))) {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq]);
      const hit = s.match(/.{0,12} [?!:;]/);
      if (hit) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
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
  if (!/<link rel="canonical" href="https:\/\/ski\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/ski\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|ski-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="ski-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="ski-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-dist', 'hud-best', 'pause-btn', 'field', 'ski-canvas', 'tap-hint', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="ski-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      const resAt = end.indexOf('class="ski-result"');
      const endAt = end.indexOf('<div data-mg-end="ski"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="ski" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-newbest', 'res-best', 'res-gates', 'res-time', 'res-tier', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="ski-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('ski-core.js') > 0 && html.indexOf('ski-core.js') < html.indexOf('ski.js"'))) bad(`${tag} ski-core.js 가 ski.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://ski.example.com/</loc>') || !sm.includes('<loc>https://ski.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('ski.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('ski.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("ski.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('ski.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('ski.js: setShareData/setRetry 없음');
  if (!/requestAnimationFrame/.test(js) || !/devicePixelRatio/.test(js)) bad('ski.js: requestAnimationFrame·devicePixelRatio 사용');
  if (!/supa\.submitScore\(C\.GAME/.test(js) || !/keydown/.test(js) || !/pointerdown/.test(js) || !/ArrowLeft/.test(js) || !/ArrowRight/.test(js)) bad('ski.js: supa.submitScore(C.GAME, …) 로 실제 백분위');
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
  if (APP.id !== 'ski' || APP.category !== 'game' || APP.path !== 'https://ski.example.com/' || APP.added !== '2026-11-08' || APP.order !== 1 || APP.emoji !== '⛷️') bad('app.config.js id/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
    else if (isWideLang(code) && code !== 'th' ? visLen(APP.title[code]) > 8 : visLen(APP.title[code]) > 16) bad(`app.config.js ${code} 제목이 김 (포털 아이콘)`);
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
console.log('\n결과: 통과 — 게임 로직(부드러운 조종·양 끝·고정 tick·재현·코스 불변식·언제나 지나갈 수 있음·충돌·기문 콤보·점수·등급)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
