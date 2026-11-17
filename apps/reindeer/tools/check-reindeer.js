#!/usr/bin/env node
/**
 * 순록 점프(Reindeer Jump) 검사.
 *   1) 로직(reindeer-core.js): 준비 상태(아무것도 안 움직임)·출발 지붕, 고정 tick(dt 를 나눠도 같음·MAX_STEP), 같은 시드 + 같은 입력 = 같은 판,
 *      점프 물리(누르는 시간에 따라 높이 — 톡/중간/길게, JUMP/TAP 표 = 실제 tick), 2단 점프 한 번, 한 프레임 톡, 착지 버퍼, 코요테 시간,
 *      틈에 빠지면 바로 끝(fall, 벽), 장애물(하트 −1·무적·감속 없음·점프로 넘음)·까마귀(머리 높이, 톡 점프로 넘음)·하트 3개 → crash,
 *      모을 것(선물 10·방울 50·닿지 않는 높이), 속도·난이도 상승,
 *      물리 계산(가장 높은 장애물·가장 넓은 장애물·틈 폭 상한) + 자동 점프 40판 × 180초 무사고 + 만들어진 위험 하나하나를 도착 속도로
 *      다시 계산(틈 폭 ≤ 점프 거리, 장애물 위 머무는 시간, 착지 → 다음 도약 간격), 가만히 있으면 곧 끝, 등급 6단계, plausible, crypto 시드.
 *      서버 인코딩: game 이름, bucket 0..MAX_BUCKET, percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 다른 앱(썰매) 문구·저작권 캐릭터 이름 없음, 글꼴(ru 키릴·vi 베트남어·th 태국어 지원),
 *      제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="reindeer" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(guide 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-reindeer.js   (cwd = apps/reindeer)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'reindeer-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const FRAME = 1000 / 60;
const PLAY_MS = 180000;                  // 자동 점프 한 판을 이만큼 돌려 본다 (끝없는 게임)
// 자동 점프로 한 판: 지나가는 위험마다 도착 속도(vArr)를 기록한다
function play(seed, ctrl, frame, maxMs) {
  const s = C.newGame(seed);
  C.start(s);
  const evs = [];
  const seen = [];
  const ids = new Set();
  let guard = 0;
  while (!s.over && s.elapsed < (maxMs || PLAY_MS) && guard++ < 400000) {
    evs.push(...C.step(s, frame || FRAME, ctrl));
    const x = C.px(s);
    s.haz.forEach((z) => {
      if (!ids.has(z)) { ids.add(z); seen.push(z); }
      if (z.vArr == null && x >= z.c - s.speed * z.a - 1) z.vArr = s.speed;
    });
  }
  return { s, evs, haz: seen };
}
// 위험 없는 긴 지붕 하나 (새 지붕 안 생김)
function quiet(seed) {
  const s = C.newGame(seed || 1);
  C.start(s);
  s.objs = []; s.haz = []; s.roofs = [{ x0: -1000, x1: 1e9, look: 0 }]; s.genX = 1e12;
  return s;
}
function put(s, kind, ahead, extra) {
  const o = Object.assign({ id: ++s.objSeq, kind, x: C.px(s) + ahead, done: false, look: 0 }, extra || {});
  s.objs.push(o);
  s.objs.sort((a, b) => a.x - b.x);
  return o;
}
function run(s, ms, ctrl) { const ev = []; for (let t = 0; t < ms - 1e-9; t += FRAME) ev.push(...C.step(s, FRAME, ctrl)); return ev; }
const hold = (on) => () => ({ hold: on });
// 평평한 지붕에서 hold 시간(초)만큼 누른 점프의 최고 높이
function jumpPeak(holdMs) {
  const s = quiet(9);
  let t = 0, peak = 0;
  C.setHold(s, true);
  for (let i = 0; i < 400; i++) {
    t += C.TICK_MS;
    C.step(s, C.TICK_MS + 1e-9, () => ({ hold: t <= holdMs }));
    peak = Math.max(peak, s.h);
    if (s.ground && i > 3) break;
  }
  return peak;
}
// 높이 top 위에 머무는 시간(초) — 길게 누른 점프(JUMP.hs, tick 마다 높이)
function timeAbove(top) { return C.JUMP.hs.filter((h) => h > top).length * C.TICK_MS / 1000; }

function checkCore() {
  // 준비 상태
  const r = C.newGame(42);
  const before = JSON.stringify([r.elapsed, r.dist, r.h, r.objs.length]);
  C.step(r, 500, hold(true));
  if (JSON.stringify([r.elapsed, r.dist, r.h, r.objs.length]) !== before) bad('준비 상태(start 전)에 무언가 움직임');
  if (r.hearts !== 3 || C.HEARTS !== 3) bad('하트는 3개');
  if (!C.supported(r, C.px(r)) || !r.ground) bad('출발할 때 순록은 지붕 위');
  if (r.roofs.length < 2 || !r.haz.length) bad('첫 화면 너머까지 코스가 준비되어 있어야 함');
  if (r.haz.some((z) => z.c - C.px(r) < 200)) bad('출발 바로 앞(200 단위)은 비어 있어야 함');
  // 고정 tick: 같은 시간을 다르게 쪼개도 같은 판
  const p1 = play(99, C.autoPlay, FRAME, 60000), p2 = play(99, C.autoPlay, 7.3, 60000), p3 = play(99, C.autoPlay, 33, 60000);
  if (C.score(p1.s) !== C.score(p2.s) || C.score(p1.s) !== C.score(p3.s) || C.items(p1.s) !== C.items(p3.s) || p1.s.jumps !== p3.s.jumps) bad(`dt 를 다르게 쪼개면 결과가 달라짐 ${C.score(p1.s)}/${C.score(p2.s)}/${C.score(p3.s)}`);
  const p4 = play(99, C.autoPlay, FRAME, 60000);
  if (C.score(p4.s) !== C.score(p1.s) || p4.s.jumps !== p1.s.jumps) bad('같은 시드 + 같은 입력인데 결과가 다름');
  const big = C.newGame(5); C.start(big); C.step(big, 5000);
  if (big.ticks > Math.ceil(C.MAX_STEP / C.TICK_MS) + 1) bad('큰 dt 는 MAX_STEP 으로 잘라야 함');
  // 점프 물리: 길게 누르면 높이, 짧게 누르면 낮게, 중간은 그 사이
  const pTap = jumpPeak(0), pMid = jumpPeak(150), pFull = jumpPeak(2000);
  if (!(pTap < pMid - 10 && pMid < pFull - 10)) bad(`누르는 시간에 따라 높이가 달라야 함 ${pTap.toFixed(0)}/${pMid.toFixed(0)}/${pFull.toFixed(0)}`);
  if (Math.abs(pFull - C.JUMP.peak) > 2 || Math.abs(pTap - C.TAP.peak) > 2) bad(`JUMP/TAP 표가 실제 tick 과 다름 ${pFull}/${C.JUMP.peak} ${pTap}/${C.TAP.peak}`);
  // 2단 점프: 공중에서 한 번만
  let s = quiet(2);
  run(s, 300);
  let ev = [];
  C.setHold(s, true); ev.push(...run(s, 120)); C.setHold(s, false); ev.push(...run(s, 60));
  const h1 = s.h;
  C.setHold(s, true); ev.push(...run(s, 60)); C.setHold(s, false); ev.push(...run(s, 40));
  if (!ev.some((e) => e.type === 'djump') || !s.dbl || s.djumps !== 1 || !(s.vh > -100) || !(s.h > h1)) bad(`공중에서 2단 점프 ${JSON.stringify(ev.map((e) => e.type))} h ${h1.toFixed(0)}→${s.h.toFixed(0)}`);
  C.setHold(s, true); ev = run(s, 40); C.setHold(s, false); run(s, 20);
  if (ev.some((e) => e.type === 'djump' || e.type === 'jump') || s.djumps !== 1) bad('2단 점프는 한 번만');
  ev = run(s, 2000);
  if (!ev.some((e) => e.type === 'land') || !s.ground || s.dbl) bad('착지하면 2단 점프가 다시 생김');
  // 누른 순간 한 프레임 안에 떼도 톡 점프 한 번
  s = quiet(3); run(s, 200);
  C.setHold(s, true); C.setHold(s, false);
  ev = run(s, 50);
  if (!ev.some((e) => e.type === 'jump') || s.ground) bad('한 프레임 안에 눌렀다 떼도 점프해야 함');
  run(s, 1500);
  // 착지 직전에 누른 것은 착지하자마자 점프(버퍼)
  s = quiet(4); run(s, 200);
  C.setHold(s, true); run(s, 30); C.setHold(s, false); run(s, 20);  // 1단
  C.setHold(s, true); run(s, 30); C.setHold(s, false);               // 2단
  let land = false;
  for (let i = 0; i < 400 && !land; i++) { const e = C.step(s, C.TICK_MS + 1e-9); if (s.h < 18 && s.vh < 0 && !s.buffer) { C.setHold(s, true); C.step(s, C.TICK_MS + 1e-9); C.setHold(s, false); } land = e.some((x) => x.type === 'land'); }
  ev = run(s, 120);
  if (!(s.jumps >= 2) || s.ground) bad(`착지 직전 누름(버퍼)은 착지하자마자 점프 jumps=${s.jumps}`);
  // 지붕 끝을 막 벗어난 직후(코요테)에도 점프
  s = quiet(5); s.roofs = [{ x0: -1000, x1: C.px(s) + 60, look: 0 }, { x0: C.px(s) + 60 + C.GAP_MIN, x1: 1e9, look: 0 }];
  for (let i = 0; i < 400 && C.supported(s, C.px(s)); i++) C.step(s, C.TICK_MS + 1e-9);
  C.step(s, C.TICK_MS * 3 + 1e-9);
  if (s.ground) bad('지붕 끝에서 떨어지기 시작해야 함');
  C.setHold(s, true); ev = run(s, 30); C.setHold(s, false);
  if (!ev.some((e) => e.type === 'jump') || s.dbl) bad('지붕 끝 직후(코요테 시간)에는 2단이 아닌 보통 점프');
  run(s, 1500);
  if (s.over) bad('코요테 점프로 작은 틈을 건너야 함');
  // 틈에 빠지면 바로 끝(fall), 하트는 그대로
  s = quiet(6); s.roofs = [{ x0: -1000, x1: C.px(s) + 40, look: 0 }, { x0: C.px(s) + 240, x1: 1e9, look: 0 }];
  ev = run(s, 3000);
  if (!s.over || s.endReason !== 'fall' || s.hearts !== 3 || !ev.some((e) => e.type === 'fall')) bad(`틈에 빠지면 끝 ${s.endReason} ${s.hearts}`);
  if (!C.plausible(s)) bad('틈에 빠져 끝난 판도 plausible');
  if (C.step(s, 1000).length || s.over !== true) bad('끝난 판은 더 움직이지 않음');
  // 낮게 떠서 틈 아래로 내려간 뒤에는 다음 지붕에 올라설 수 없다(벽)
  s = quiet(7); s.roofs = [{ x0: -1000, x1: C.px(s) + 20, look: 0 }, { x0: C.px(s) + 20 + 90, x1: 1e9, look: 0 }];
  ev = run(s, 2000);
  if (s.endReason !== 'fall') bad('틈 아래로 내려가면 다음 지붕에 오르지 못하고 끝');
  // 장애물: 하트 −1 · 무적 · 느려지지 않음
  s = quiet(8); run(s, 1000);
  const sp = s.speed;
  put(s, 'chimney', 30, { w: 30, h: 50 });
  ev = run(s, 300);
  if (!ev.some((e) => e.type === 'ouch') || s.hearts !== 2 || !(s.inv > 0) || s.speed < sp) bad(`굴뚝에 부딪힘 ${JSON.stringify(ev.map((e) => e.type))} 하트 ${s.hearts} 속도 ${Math.round(s.speed)}/${Math.round(sp)}`);
  put(s, 'pile', 25);
  ev = run(s, 300);
  if (ev.some((e) => e.type === 'ouch') || s.hearts !== 2) bad('무적 시간에는 다시 다치지 않아야 함');
  run(s, C.HIT_INV);
  put(s, 'ice', 25);
  ev = run(s, 300);
  if (!ev.some((e) => e.type === 'ouch') || s.hearts !== 1) bad('무적 시간이 지나면 다시 다침');
  run(s, C.HIT_INV + 100);
  // 점프로 넘으면 다치지 않음 (길게 누른 점프, 꼭대기가 장애물 가운데)
  const ahead = s.speed * C.JUMP.tPeak;
  put(s, 'chimney', ahead + 4, { w: 34, h: 62 });
  C.setHold(s, true); ev = run(s, 900, hold(true)); C.setHold(s, false); ev.push(...run(s, 400, hold(false)));
  if (ev.some((e) => e.type === 'ouch') || s.hearts !== 1) bad('길게 누른 점프로 가장 높은 굴뚝을 넘어야 함');
  put(s, 'crow', 30);
  ev = run(s, 400);
  if (!ev.some((e) => e.type === 'ouch') || s.hearts !== 0 || !s.over || s.endReason !== 'crash' || !ev.some((e) => e.type === 'crash')) bad('머리 높이 까마귀에 부딪히고, 세 번째면 끝(crash)');
  if (!C.plausible(s)) bad('하트를 다 잃고 끝난 판도 plausible');
  // 까마귀는 낮은 점프로도 넘고, 서 있으면 부딪힘
  s = quiet(10); run(s, 500);
  put(s, 'crow', s.speed * C.TAP.tPeak + 2);
  C.setHold(s, true); C.setHold(s, false); ev = run(s, 800);
  if (ev.some((e) => e.type === 'ouch')) bad('톡 친 점프로 까마귀를 넘을 수 있어야 함');
  // 모을 것
  s = quiet(11);
  put(s, 'present', 30, { ih: 14 }); put(s, 'present', 70, { ih: 14 });
  put(s, 'bell', s.speed * C.JUMP.tPeak + 100, { ih: C.JUMP.peak + 8 });
  ev = run(s, 400);
  C.setHold(s, true); ev.push(...run(s, 700, hold(true))); ev.push(...run(s, 600, hold(false)));
  const got = ev.filter((e) => e.type === 'item').map((e) => e.kind + e.pts).join(',');
  if (got !== 'present10,present10,bell50' || s.bonus !== 70 || s.presents !== 2 || s.bells !== 1 || C.items(s) !== 3) bad(`모을 것 ${got} 보너스 ${s.bonus}`);
  put(s, 'present', 40, { ih: C.JUMP.peak + 30 }); run(s, 400);
  if (s.presents !== 2) bad('닿지 않는 높이의 선물이 모아짐');
  // 속도
  if (!(C.targetSpeed(0) === C.SPEED_MIN && C.targetSpeed(C.RAMP_MS) === C.SPEED_MAX && C.targetSpeed(C.RAMP_MS * 3) === C.SPEED_MAX)) bad('속도는 SPEED_MIN → SPEED_MAX');
  for (let t = 0; t < C.RAMP_MS; t += 1000) if (C.targetSpeed(t + 1000) < C.targetSpeed(t)) { bad('속도는 줄지 않아야 함'); break; }
  const r0 = C.rules({ elapsed: 0 }), r1 = C.rules({ elapsed: C.RAMP_MS });
  if (!(r1.gapChance > r0.gapChance && r1.obsMax > r0.obsMax && r1.crowChance > r0.crowChance && r1.chimH > r0.chimH)) bad('시간이 갈수록 어려워져야 함');
  // 물리 계산: 가장 높은 장애물 위로 길게 누른 점프가 넘는지, 가장 넓은 틈을 넘는지 (가장 느린 속도)
  const tallest = Math.max(C.rules({ elapsed: C.RAMP_MS }).chimH, C.KIND_BY_ID.crow.h1, C.KIND_BY_ID.ice.h, C.KIND_BY_ID.pile.h);
  if (!(C.JUMP.peak > tallest + 30)) bad(`점프 높이 ${C.JUMP.peak} 가 가장 높은 장애물 ${tallest} 보다 충분히 높지 않음`);
  if (!(C.TAP.peak > C.KIND_BY_ID.crow.h1 + 10)) bad('톡 점프로도 까마귀 위를 넘어야 함');
  const widest = Math.max(34, C.KIND_BY_ID.pile.w, C.KIND_BY_ID.crow.w);
  if (!(timeAbove(tallest) * C.SPEED_MIN > widest + 2 * C.HW + 20)) bad('가장 느릴 때도 가장 넓은 장애물 위에 머물 시간이 있어야 함');
  if (!(C.GAP_FRAC * C.JUMP.air * C.SPEED_MIN + 0 < C.JUMP.air * C.SPEED_MIN + 2 * C.FOOT - 20)) bad('틈 폭 상한이 점프 거리보다 넉넉히 작아야 함');
  // 자동 점프 40판 × 180초: 언제나 넘을 수 있음(무사고) + 만들어진 위험 하나하나를 도착 속도로 계산해 확인
  let mn = 1e9, mx = 0, sum = 0, nHaz = 0, nGap = 0, nObs = 0, nCrow = 0, worstGap = 0, worstRun = 1e9, bells = 0, presents = 0;
  const tierHits = new Set();
  for (let i = 0; i < 40; i++) {
    const seed = 1000 + i * 7;
    const { s: g, haz } = play(seed, C.autoPlay);
    const sc = C.score(g);
    mn = Math.min(mn, sc); mx = Math.max(mx, sc); sum += sc; bells += g.bells; presents += g.presents;
    tierHits.add(C.tierOf(sc));
    if (g.over || g.hits) bad(`자동 점프가 실패 (시드 ${seed}, ${g.endReason || '부딪힘'} ${g.hits}번, ${Math.round(g.elapsed / 1000)}초) — 넘을 수 없는 위험`);
    if (g.speed < C.SPEED_MAX - 1) bad(`180초 뒤 최고 속도가 아님 ${g.speed}`);
    const done = haz.filter((z) => z.vArr != null).sort((a, b) => a.c - b.c);
    for (let k = 0; k < done.length; k++) {
      const z = done[k], v = z.vArr;
      nHaz++;
      if (z.kind === 'gap') {
        nGap++;
        const reach = v * C.JUMP.air + 2 * C.FOOT;
        worstGap = Math.max(worstGap, z.w / reach);
        if (z.w > reach - 12) bad(`틈 ${Math.round(z.w)} 이 속도 ${Math.round(v)} 에서 점프 거리 ${Math.round(reach)} 에 비해 너무 넓음 (시드 ${seed})`);
        if (z.w < C.GAP_MIN - 1e-6) bad('틈은 GAP_MIN 이상');
      } else {
        nObs++; if (z.kind === 'crow') nCrow++;
        const need = z.w + 2 * C.HW;
        if (z.top > C.JUMP.peak - 20) bad(`장애물 높이 ${z.top} 이 점프 높이에 너무 가까움`);
        if (timeAbove(z.top) * v < need + 10) bad(`장애물(${z.kind}) 위에 머물 시간이 모자람 v=${Math.round(v)}`);
      }
      if (k) {
        const p = done[k - 1], vv = Math.max(v, p.vArr);
        const landPrev = p.c - vv * p.a + vv * C.JUMP.air, takeNext = z.c - vv * z.a;
        worstRun = Math.min(worstRun, (takeNext - landPrev) / vv);
        if (takeNext - landPrev < vv * C.RUN_S * 0.9) bad(`위험 사이 간격이 모자람 (착지 → 다음 도약 ${Math.round(takeNext - landPrev)} 단위, 시드 ${seed})`);
      }
    }
  }
  const avg = sum / 40;
  if (!(mx < C.MAX_PLAUSIBLE * 0.5)) bad(`180초 자동 점프 최고 ${mx} — MAX_PLAUSIBLE 여유가 부족`);
  if (!(nGap > 40 * 40) || !(nCrow > 40 * 5) || !(bells > 40 * 5)) bad(`틈 ${nGap}·까마귀 ${nCrow}·방울 ${bells} — 너무 드묾`);
  // 가만히 있으면: 곧 틈에 빠지거나 세 번 부딪혀 끝
  let idleMax = 0;
  for (let i = 0; i < 10; i++) {
    const idle = play(77 + i, hold(false));
    idleMax = Math.max(idleMax, idle.s.elapsed);
    if (!idle.s.over || !(idle.s.elapsed < 40000)) bad(`가만히 있는데 끝나지 않음 (시드 ${77 + i})`);
    if (!C.plausible(idle.s)) bad(`가만히 있다 끝난 판이 plausible 아님 ${idle.s.endReason}`);
  }
  // 등급·plausible
  if (C.TIERS.length !== 6 || C.TIERS[0] !== 0 || C.TIERS.some((t, i) => i && t <= C.TIERS[i - 1])) bad('등급 6단계, 오름차순');
  if (C.tierOf(0) !== 0 || C.tierOf(C.TIERS[5]) !== 5 || C.tierOf(C.TIERS[3] - 1) !== 2) bad('tierOf');
  const fake = play(77, hold(false)).s;
  if (!C.plausible(fake)) bad('정상 판은 plausible');
  const f1 = Object.assign({}, fake, { bonus: fake.bonus + 10 });
  if (C.plausible(f1)) bad('모은 것과 보너스가 맞지 않으면 plausible 아님');
  const f2 = Object.assign({}, fake, { dist: C.SPEED_MAX * fake.elapsed / 1000 + 50 });
  if (C.plausible(f2)) bad('최고 속도로도 못 가는 거리는 plausible 아님');
  const f3 = Object.assign({}, fake, { presents: fake.presents + 500, bonus: fake.bonus + 5000 });
  if (C.plausible(f3)) bad('시간에 비해 너무 많이 모은 판은 plausible 아님');
  const f4 = Object.assign({}, fake, { endReason: 'crash', hearts: 2 });
  if (C.plausible(f4)) bad('하트가 남았는데 crash 이면 plausible 아님');
  const f5 = Object.assign({}, fake, { dist: (C.MAX_PLAUSIBLE + 10) * C.DIST_DIV, elapsed: 1e9 });
  if (C.plausible(f5)) bad('MAX_PLAUSIBLE 초과는 plausible 아님');
  if (C.plausible(C.newGame(2))) bad('끝나지 않은 판은 plausible 아님');
  // crypto 시드
  const seeds = new Set(Array.from({ length: 20 }, () => C.randomSeed()));
  if (seeds.size < 19) bad('randomSeed 가 crypto 난수가 아님');
  if (!/crypto\.getRandomValues/.test(fs.readFileSync(path.join(SITE, 'reindeer-core.js'), 'utf8'))) bad('시드는 crypto.getRandomValues');
  // 서버 인코딩
  if (C.GAME !== 'reindeer') bad('GAME 이름');
  if (C.bucket(0) !== 0 || C.bucket(9) !== 0 || C.bucket(10) !== 1 || C.bucket(1e12) !== C.MAX_BUCKET || C.bucket(-5) !== 0 || C.bucket('x') !== 0) bad('bucket');
  if (C.MAX_BUCKET * 10 < C.MAX_PLAUSIBLE || C.MAX_BUCKET > 100000) bad('MAX_BUCKET 이 MAX_PLAUSIBLE 을 담고 서버 한도(100000) 안');
  const pr = C.percentile([{ score_bucket: 10, players: 3 }, { score_bucket: 20, players: 1 }, { score_bucket: 40, players: 2 }], 20);
  if (!pr || pr.others !== 5 || pr.beatPct !== 60 || pr.top !== 40) bad(`percentile ${JSON.stringify(pr)}`);
  const pf = C.percentile([{ score_bucket: 12, players: 1 }], 12);
  if (!pf || !pf.first) bad('나 혼자면 first');
  if (C.percentile(null, 3) !== null) bad('실패(null)면 null');
  const pz = C.percentile([{ score_bucket: 5, players: 2 }], 7);
  if (!pz || pz.others !== 2 || pz.beatPct !== 100) bad('내 구간이 없으면 한 명 더해서 계산');
  console.log(`로직: 점프 높이 톡 ${pTap.toFixed(0)} · 중간 ${pMid.toFixed(0)} · 길게 ${pFull.toFixed(0)} (공중 ${C.JUMP.air.toFixed(2)}초) · 자동 점프 40판 × ${PLAY_MS / 1000}초 무사고 · 점수 최소 ${mn} · 평균 ${Math.round(avg)} · 최고 ${mx} (등급 ${[...tierHits].sort().join(',')}) · 위험 ${nHaz}개(틈 ${nGap} · 장애물 ${nObs} · 까마귀 ${nCrow}) 모두 도착 속도로 넘을 수 있음 (가장 넓은 틈 = 점프 거리의 ${Math.round(worstGap * 100)}%, 가장 짧은 달리기 ${worstRun.toFixed(2)}초) · 선물 ${presents} · 방울 ${bells} · 가만히 있으면 최대 ${Math.round(idleMax / 1000)}초에 끝`);
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
  ...['tap', 'hold', 'air'].map((k) => ({ key: `start.how.${k}`, get: (T) => T.start.how[k], px: HOW_PX, size: 14, max: 3, what: '방법 칸 세 줄까지', word: HOW_PX })),
  { key: 'play.score', get: (T) => T.play.score, px: 78, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.dist', get: (T) => T.play.dist, px: 65 - 14, size: 11, max: 1, what: 'HUD 거리 이름표', track: 0.06 },
  { key: 'play.lives', get: (T) => T.play.lives, px: 65, size: 11, max: 1, what: 'HUD 하트 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328 - 6 - 32 - 32, size: 16, max: 2, what: '준비 안내 두 줄까지(필드 안)' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  // 캔버스 글자(18~22px, 세계 360 단위 폭): 세계 300 단위 안
  ...['ouch', 'fall', 'crash'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: 300, size: 22, max: 1, what: '캔버스 글자 한 줄', factor: 1.05 })),
  { key: 'play.bell', get: (T) => T.play.bell.replace('{n}', '50'), px: 220, size: 22, max: 1, what: '캔버스 글자 한 줄(순록 위)', factor: 1.05 },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.reasonFall', get: (T) => T.result.reasonFall, px: 328 - 32, size: 15, max: 2, what: '끝난 이유 두 줄까지', factor: 1.05 },
  { key: 'result.reasonCrash', get: (T) => T.result.reasonCrash, px: 328 - 32, size: 15, max: 2, what: '끝난 이유 두 줄까지', factor: 1.05 },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄', factor: 1.02 },
  ...['distance', 'presents', 'bells'].map((k) => ({ key: `result.${k}`, get: (T) => T.result[k], px: STAT_PX, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT_PX })),
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
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n', 'tier']], ['play.bell', ['n']]];
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
    if (/썰매|そり|雪橇|luge|Schlitten|เลื่อนหิมะ|xe trượt|trineo|slitta|trenó|санк/i.test(JSON.stringify(T))) bad(`${tag} 다른 앱(썰매) 문구가 남아 있음`);
    if (/Rudolph|Rudolf|Rodolphe|Rodolfo|Рудольф|ルドルフ|鲁道夫|루돌프|รูดอล์ฟ|Santa|산타|サンタ|圣诞老人|Père Noël|Weihnachtsmann|ซานต้า|ông già Noel|Papá Noel|Babbo Natale|Papai Noel|Дед Мороз/i.test(JSON.stringify(T))) bad(`${tag} 저작권·브랜드 캐릭터 이름(루돌프·산타)이 들어 있음`);
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
  if (!/<link rel="canonical" href="https:\/\/reindeer\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/reindeer\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|rd-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="rd-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="rd-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-dist', 'hud-lives', 'pause-btn', 'field', 'rd-canvas', 'tap-hint', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="rd-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      if ((playS.match(/<span>♥<\/span>/g) || []).length !== 3) bad(`${tag} HUD 하트 3개`);
      const resAt = end.indexOf('class="rd-result"');
      const endAt = end.indexOf('<div data-mg-end="reindeer"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="reindeer" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-reason', 'res-newbest', 'res-best', 'res-dist', 'res-presents', 'res-bells', 'res-tier', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="rd-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('reindeer-core.js') > 0 && html.indexOf('reindeer-core.js') < html.indexOf('reindeer.js"'))) bad(`${tag} reindeer-core.js 가 reindeer.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://reindeer.example.com/</loc>') || !sm.includes('<loc>https://reindeer.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('reindeer.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('reindeer.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("reindeer.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('reindeer.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('reindeer.js: setShareData/setRetry 없음');
  if (!/requestAnimationFrame/.test(js) || !/devicePixelRatio/.test(js)) bad('reindeer.js: requestAnimationFrame·devicePixelRatio 사용');
  if (!/supa\.submitScore\(C\.GAME/.test(js) || !/C\.plausible\(s\)/.test(js) || !/keydown/.test(js) || !/keyup/.test(js) || !/pointerdown/.test(js) || !/pointerup/.test(js) || !/ArrowUp/.test(js) || !/e\.repeat/.test(js)) bad('reindeer.js: supa.submitScore(C.GAME, …) + C.plausible 로 실제 백분위, 키보드·포인터 입력');
  if (/[가-힣]/.test(js.replace(/\/\/.*$/gm, ''))) bad('reindeer.js 코드 안에 한글 문구 (문구는 PAGE_I18N 에서만)');
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
  if (APP.id !== 'reindeer' || APP.category !== 'game' || APP.path !== 'https://reindeer.example.com/' || APP.added !== '2026-11-18' || APP.order !== 1 || APP.emoji !== '🦌') bad('app.config.js id/category/path/added/order/emoji');
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
console.log('\n결과: 통과 — 게임 로직(준비·고정 tick·재현·가변 점프·2단 점프·버퍼·코요테·틈 낙하·하트 3개·장애물(무적)·까마귀·모을 것·속도 상승·물리 계산으로 언제나 넘을 수 있는 코스·자동 점프·등급·plausible)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
