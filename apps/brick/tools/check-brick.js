#!/usr/bin/env node
/**
 * 벽돌깨기 검사.
 *   1) 로직(brick-core.js): 새 판(벽돌 수 = 1단계 무늬·0점·목숨 3·공은 패들 위), 서브(패들 따라감·자동 발사·launch 한 번),
 *      벽·천장 반사, 벽돌을 맞히면 없어지고 줄 점수(두 번 벽돌은 첫 타 +5 후 둘째 타에 없어짐), 빠른 공도 벽돌을 뚫지 않음,
 *      벽돌을 다 깨면 다음 단계(보너스·새 무늬·더 빠른 공·다시 서브), 목숨(공을 다 놓치면 −1, 0이면 over 한 번), 아이템(wide·multi·받기),
 *      봇 40판 매 step 마다 공이 판 밖으로 나가지 않음·벽돌 안에 들어가지 않음·세로 속도 하한, 같은 시드 + 같은 입력 = 같은 판,
 *      실력(완벽 > 느린 > 무작위)이 점수·단계에 반영, 등급(tierOf 문턱 6개). 서버 인코딩: game 이름 = 앱 id, bucket 0..1999 정수, percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자, 등급 이름 6개,
 *      FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순/랭킹 류 금지), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어·th 태국어 지원),
 *      제목(= app.config 제목으로 시작)·설명 길이, h1 모양, fr 좁은 공백, ru «ты», 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음·캔버스(touch-action none) / 끝 화면: 결과 카드 → data-mg-end="brick" 순서·등급 목록 없음(스포일러) / FAQ 는 MG_FAQ 로만 /
 *      스크립트 순서 / 숨은 변형 noindex / 공통 컴포넌트 클래스와 겹치는 클래스 없음 / 앱 JS: track start·done 한 곳씩, DPR, 언어별 주소 없음, 한글 문구 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크, tools/hub-curation.json(12개 언어·2줄 길이).
 *
 * 실행: node tools/check-brick.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'brick-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const STEP = 16;
const EPS = 1e-6;
// 공이 판 밖으로 나가지 않았는지·벽돌 안에 들어가 있지 않은지 (한 step 뒤마다)
function fieldOk(s, tag) {
  const r = C.BALL_R;
  for (const b of s.balls) {
    if (!(b.x >= r - EPS && b.x <= C.W - r + EPS)) { bad(`${tag} 공이 옆벽 밖 x=${b.x}`); return false; }
    if (!(b.y >= r - EPS)) { bad(`${tag} 공이 천장 밖 y=${b.y}`); return false; }
    if (b.y - r > C.H + EPS) { bad(`${tag} 바닥 아래로 빠진 공이 남아 있음 y=${b.y}`); return false; }
    if (!isFinite(b.vx) || !isFinite(b.vy)) { bad(`${tag} 공 속도 NaN`); return false; }
    if (!b.stuck) {
      const sp = Math.hypot(b.vx, b.vy);
      if (Math.abs(b.vy) < sp * 0.3) { bad(`${tag} 세로 속도가 너무 작음 (갇힐 수 있음) vx=${b.vx} vy=${b.vy}`); return false; }
    }
    for (const br of s.bricks) {
      if (b.x > br.x + 0.5 && b.x < br.x + br.w - 0.5 && b.y > br.y + 0.5 && b.y < br.y + br.h - 0.5) { bad(`${tag} 공 중심이 벽돌 안 (뚫고 지나감) ${JSON.stringify([b.x, b.y, br.x, br.y])}`); return false; }
    }
  }
  return true;
}
// 봇 한 판. perfect: 공 바로 밑으로 패들을 옮김(맞히는 자리는 무작위) / slow: 패들 속도 제한·반응 늦음 / random: 아무렇게나
function playBot(seed, kind, limitMs, check) {
  const s = C.newGame(seed);
  const r = mulberry(seed * 7 + 1);
  let off = 0;
  const log = [];
  let checked = true;
  while (!s.over && s.t < limitMs) {
    const ev = C.step(s, STEP);
    log.push(ev.length);
    if (ev.some((e) => e.type === 'paddle' || e.type === 'launch')) off = (r() - 0.5) * C.PADDLE_W * 0.75;
    if (kind === 'random') C.setPaddle(s, s.paddle.x + (r() - 0.5) * 60);
    else {
      let tgt = null;
      s.balls.forEach((b) => { if (!b.stuck && b.vy > 0 && (!tgt || b.y > tgt.y)) tgt = b; });
      if (tgt) {
        const want = tgt.x + off;
        const mv = (kind === 'perfect' ? 1e9 : 260) * STEP / 1000;
        if (kind === 'perfect' || tgt.y > C.H * 0.45) C.setPaddle(s, s.paddle.x + Math.max(-mv, Math.min(mv, want - s.paddle.x)));
      }
    }
    if (s.serving && r() < 0.05) C.launch(s);
    if (check && checked) checked = fieldOk(s, `[봇 ${kind} ${seed}]`);
  }
  s.log = log;
  return s;
}
function oneBrick(row, hp) {
  const s = C.newGame(3);
  const br = C.buildBricks(1).find((b) => b.row === row && b.col === 3);
  br.hp = hp; br.max = hp;
  s.bricks = [br, ...C.buildBricks(1).filter((b) => b.row === 0 && b.col === 7)]; // 두 번째 벽돌은 단계가 끝나지 않게
  s.serving = false;
  s.balls = [{ x: br.x + br.w / 2, y: br.y + br.h + 40, vx: 0.0001, vy: -300, stuck: false }];
  return { s, br };
}

function checkCore() {
  if (C.W !== 360 || C.H !== 520 || C.LIVES !== 3 || C.COLS !== 8) bad('판 360×520 · 목숨 3 · 8칸');
  // 새 판
  const g = C.newGame(5);
  const n1 = C.LEVELS[0].join('').replace(/[^12]/g, '').length;
  if (g.bricks.length !== n1 || g.score !== 0 || g.lives !== 3 || g.stage !== 1 || !g.serving || g.over) bad('새 판 상태 이상');
  if (g.balls.length !== 1 || !g.balls[0].stuck || Math.abs(g.balls[0].x - C.W / 2) > EPS) bad('새 판: 공 하나가 패들 위에 붙어 있어야 함');
  g.bricks.forEach((b) => { if (b.x < 0 || b.x + b.w > C.W || b.y < 0 || b.y + b.h > C.PADDLE_Y - 60) bad(`벽돌이 판 밖/패들 근처 ${JSON.stringify(b)}`); });
  C.LEVELS.forEach((rows, i) => { if (rows.length > 8 || rows.some((r) => r.length !== C.COLS || /[^.12]/.test(r))) bad(`LEVELS[${i}] 모양 이상`); });
  // 서브: 공이 패들을 따라가고, 자동 발사 전에는 움직이지 않음
  C.setPaddle(g, 50);
  if (Math.abs(g.balls[0].x - g.paddle.x) > EPS || g.paddle.x < C.PADDLE_W / 2 - EPS) bad('서브 중 공이 패들을 따라가야 함 / 패들은 벽 안');
  C.setPaddle(g, -999);
  if (Math.abs(g.paddle.x - C.PADDLE_W / 2) > EPS) bad('패들 왼쪽 끝 자르기');
  C.setPaddle(g, 9999);
  if (Math.abs(g.paddle.x - (C.W - C.PADDLE_W / 2)) > EPS) bad('패들 오른쪽 끝 자르기');
  if (C.step(g, 1000).length !== 0 || !g.serving || g.balls[0].vy !== 0) bad('서브 중에는 공이 그대로');
  const ev0 = C.step(g, C.SERVE_AUTO);
  if (!ev0.some((e) => e.type === 'launch') || g.serving || !(g.balls[0].vy < 0)) bad('SERVE_AUTO 뒤 자동 발사 (위로)');
  const g2 = C.newGame(6);
  const lv = C.launch(g2);
  if (!lv.some((e) => e.type === 'launch') || g2.serving || !(g2.balls[0].vy < 0) || C.launch(g2).length) bad('launch: 한 번만, 위로');

  // 벽 반사
  const w = C.newGame(7);
  w.serving = false;
  w.bricks = [];
  w.bricks.push(C.buildBricks(1)[0]); // 단계가 끝나지 않게 하나 남김
  w.balls = [{ x: C.BALL_R + 1, y: 300, vx: -400, vy: -300, stuck: false }];
  C.step(w, 30);
  if (!(w.balls[0].vx > 0) || w.balls[0].x < C.BALL_R - EPS) bad('왼쪽 벽 반사');
  w.balls = [{ x: C.W - C.BALL_R - 1, y: 300, vx: 400, vy: -300, stuck: false }];
  C.step(w, 30);
  if (!(w.balls[0].vx < 0) || w.balls[0].x > C.W - C.BALL_R + EPS) bad('오른쪽 벽 반사');
  w.balls = [{ x: 200, y: C.BALL_R + 1, vx: 100, vy: -400, stuck: false }];
  C.step(w, 30);
  if (!(w.balls[0].vy > 0) || w.balls[0].y < C.BALL_R - EPS) bad('천장 반사');

  // 벽돌 맞히면 사라지고 점수
  let { s, br } = oneBrick(2, 1);
  let evs = [];
  for (let i = 0; i < 40 && !evs.some((e) => e.type === 'brick'); i++) evs = C.step(s, STEP);
  const hitE = evs.find((e) => e.type === 'brick');
  if (!hitE || !hitE.broken || s.bricks.includes(br) || s.score !== C.ROW_POINTS[2] || s.broken !== 1) bad(`벽돌을 맞히면 없어지고 ${C.ROW_POINTS[2]}점 (${JSON.stringify(hitE)} score=${s.score})`);
  if (!(s.balls[0].vy > 0)) bad('벽돌 아래를 맞힌 공은 아래로 튕김');
  // 두 번 벽돌
  ({ s, br } = oneBrick(0, 2));
  evs = [];
  for (let i = 0; i < 40 && !evs.some((e) => e.type === 'brick'); i++) evs = C.step(s, STEP);
  if (!s.bricks.includes(br) || br.hp !== 1 || s.score !== C.TOUGH_HIT) bad('두 번 벽돌: 첫 타는 남고 +TOUGH_HIT');
  s.balls = [{ x: br.x + br.w / 2, y: br.y + br.h + 40, vx: 0.0001, vy: -300, stuck: false }];
  evs = [];
  for (let i = 0; i < 40 && !evs.some((e) => e.type === 'brick'); i++) evs = C.step(s, STEP);
  if (s.bricks.includes(br) || s.score !== C.TOUGH_HIT + C.ROW_POINTS[0]) bad('두 번 벽돌: 둘째 타에 없어짐');
  // 빠른 공도 벽돌을 뚫지 않음 (한 프레임 50ms, 최고 속도)
  for (let k = 0; k < 20; k++) {
    const t = C.newGame(100 + k);
    t.serving = false;
    const sp = C.speedCap(30);
    const a = (k / 20 - 0.5) * 1.6;
    t.balls = [{ x: 40 + k * 14, y: 400, vx: sp * Math.sin(a), vy: -sp * Math.cos(a), stuck: false }];
    for (let i = 0; i < 60; i++) { C.step(t, 50); if (!fieldOk(t, `[빠른 공 ${k}]`)) break; }
  }

  // 단계 넘어가기
  ({ s, br } = oneBrick(4, 1));
  s.bricks = [br];
  const before = s.score;
  evs = [];
  for (let i = 0; i < 40 && !evs.some((e) => e.type === 'stage'); i++) evs = C.step(s, STEP);
  const st = evs.find((e) => e.type === 'stage');
  const n2 = C.LEVELS[1].join('').replace(/[^12]/g, '').length;
  if (!st || s.stage !== 2 || s.bricks.length !== n2 || !s.serving || s.score !== before + C.ROW_POINTS[4] + C.STAGE_BONUS) bad(`벽돌을 다 깨면 2단계 (보너스 ${C.STAGE_BONUS}) ${JSON.stringify(st)} stage=${s.stage}`);
  if (Math.abs(s.speed - C.speedFor(2)) > EPS || !(C.speedFor(2) > C.speedFor(1))) bad('다음 단계는 더 빠름');
  for (let k = 1; k < 30; k++) if (C.speedFor(k + 1) < C.speedFor(k) || C.speedCap(k) < C.speedFor(k)) bad(`속도 곡선 이상 ${k}`);
  if (C.speedCap(99) > 800) bad('최고 속도 상한');
  if (C.buildBricks(C.LEVELS.length + 1).length !== n1) bad('무늬는 LEVELS 를 돌아가며');

  // 목숨
  const l = C.newGame(11);
  C.launch(l);
  let overs = 0, loses = 0;
  for (let k = 0; k < 3; k++) {
    if (l.serving) C.launch(l);
    l.balls = [{ x: 100, y: C.H - 2, vx: 50, vy: 400, stuck: false }];
    const e = C.step(l, 50);
    loses += e.filter((x) => x.type === 'lose').length;
    overs += e.filter((x) => x.type === 'over').length;
    if (k < 2 && (l.lives !== 2 - k || !l.serving || l.balls.length !== 1)) bad(`공을 놓치면 목숨 −1, 다시 서브 (k=${k})`);
  }
  if (loses !== 3 || overs !== 1 || !l.over || l.lives !== 0) bad(`목숨 3개를 다 잃으면 끝 (lose ${loses}, over ${overs})`);
  if (C.step(l, 1000).length !== 0) bad('끝난 판은 사건 없음');
  // 공이 여럿이면 하나 빠져도 목숨 그대로
  const mb = C.newGame(12);
  C.launch(mb);
  mb.balls.push({ x: 100, y: C.H - 2, vx: 0, vy: 400, stuck: false });
  mb.balls[0].y = 300;
  C.step(mb, 50);
  if (mb.lives !== 3 || mb.balls.length !== 1) bad('공이 남아 있으면 목숨은 그대로');

  // 아이템
  const pw = C.newGame(13);
  C.launch(pw);
  C.applyDrop(pw, 'wide');
  if (C.paddleW(pw) !== C.PADDLE_WIDE) bad('wide: 패들이 넓어짐');
  C.applyDrop(pw, 'multi');
  if (pw.balls.length !== 3) bad(`multi: 공 1 → 3 (${pw.balls.length})`);
  C.applyDrop(pw, 'multi');
  if (pw.balls.length !== C.MAX_BALLS) bad(`multi: 공은 최대 ${C.MAX_BALLS}`);
  pw.balls.forEach((b) => { if (!(b.vy < 0)) bad('multi: 새 공은 위로'); });
  pw.bricks = [C.buildBricks(1)[0]];
  pw.balls = [{ x: 180, y: 300, vx: 100, vy: -300, stuck: false }];
  for (let i = 0; i < C.WIDE_MS / 100 + 2; i++) { C.step(pw, 100); if (pw.serving) C.launch(pw); }
  if (C.paddleW(pw) !== C.PADDLE_W) bad('wide 는 WIDE_MS 뒤 원래대로');
  const dp = C.newGame(14);
  C.launch(dp);
  dp.drops = [{ kind: 'multi', x: dp.paddle.x, y: C.PADDLE_Y - 20 }];
  let caught = [];
  for (let i = 0; i < 30 && !caught.length; i++) caught = C.step(dp, STEP).filter((e) => e.type === 'catch');
  if (!caught.length || dp.drops.length) bad('패들로 캡슐을 받으면 적용');

  // 무작위 판: 공은 판 밖으로 나가지 않는다 (봇 여러 판, 매 step 검사)
  let drops = 0, stages = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const r1 = playBot(seed, seed % 3 === 0 ? 'random' : seed % 3 === 1 ? 'perfect' : 'slow', 4 * 60 * 1000, true);
    stages += r1.stage - 1;
    drops += r1.broken;
  }
  if (!stages) bad('봇 판에서 단계가 한 번도 안 넘어감');

  // 재현
  const a = playBot(777, 'slow', 3 * 60 * 1000), b = playBot(777, 'slow', 3 * 60 * 1000);
  if (JSON.stringify([a.score, a.stage, a.lives, a.broken, a.log]) !== JSON.stringify([b.score, b.stage, b.lives, b.broken, b.log])) bad('같은 시드 + 같은 입력인데 결과가 다름');
  const c2 = playBot(778, 'slow', 3 * 60 * 1000);
  if (c2.score === a.score && JSON.stringify(c2.log) === JSON.stringify(a.log)) bad('시드가 달라도 판이 같음');

  // 실력이 점수·단계에 반영된다
  const avgOf = (kind, ms) => { let tot = 0, st2 = 0, mx = 0; for (let i = 0; i < 8; i++) { const r2 = playBot(1000 + i, kind, ms); tot += r2.score; st2 += r2.stage; mx = Math.max(mx, r2.stage); } return { avg: Math.round(tot / 8), stage: +(st2 / 8).toFixed(1), maxStage: mx }; };
  const perfect = avgOf('perfect', 8 * 60 * 1000), slow = avgOf('slow', 8 * 60 * 1000), random = avgOf('random', 8 * 60 * 1000);
  if (!(perfect.stage >= 4)) bad(`완벽 봇은 8분 안에 4단계 이상 (${perfect.stage})`);
  if (!(perfect.avg > slow.avg && slow.avg > random.avg)) bad(`실력 순서 완벽(${perfect.avg}) > 느린(${slow.avg}) > 무작위(${random.avg})`);

  // 등급
  if (C.TIERS.length !== 6 || C.TIER_EMOJI.length !== 6 || C.TIERS[0] !== 0) bad('등급은 6개, 첫 문턱 0');
  C.TIERS.forEach((t, i) => { if (i && t <= C.TIERS[i - 1]) bad('등급 문턱은 오름차순'); if (C.tierOf(t) !== i) bad(`tierOf(${t}) ≠ ${i}`); if (i && C.tierOf(t - 1) !== i - 1) bad(`tierOf(${t - 1}) ≠ ${i - 1}`); });
  if (C.tierOf(0) !== 0 || C.tierOf(1e7) !== 5) bad('tierOf 양끝');
  if (C.tierOf(random.avg) > 1) bad(`무작위 봇은 아래쪽 등급 (${random.avg} → ${C.tierOf(random.avg)})`);
  if (C.tierOf(perfect.avg) < 4) bad(`완벽 봇은 위쪽 등급 (${perfect.avg} → ${C.tierOf(perfect.avg)})`);

  // 서버 인코딩 · 백분위
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME) || C.GAME !== APP.id) bad(`GAME 이름 ${C.GAME}`);
  [[0, 0], [9, 0], [10, 1], [20, 1], [420, 21], [39980, 1999], [1e9, 1999], [-50, 0], [NaN, 0], ['x', 0]].forEach(([sc, want]) => {
    const got = C.bucket(sc);
    if (got !== want || !Number.isInteger(got)) bad(`bucket(${sc}) = ${got} ≠ ${want}`);
  });
  if (C.MAX_BUCKET + 1 > 2000) bad('bucket 가짓수가 서버 한도(2000)를 넘음');
  const rows = [{ score_bucket: 10, players: 5 }, { score_bucket: 20, players: 1 }, { score_bucket: 30, players: 4 }];
  const p = C.percentile(rows, 20);
  if (!p || p.first || p.others !== 9 || p.lower !== 5 || p.higher !== 4 || p.beatPct !== 55 || p.top !== 45) bad(`percentile 기본 ${JSON.stringify(p)}`);
  const p2 = C.percentile([{ score_bucket: 5, players: 3 }], 50);
  if (!p2 || p2.others !== 3 || p2.beatPct !== 100 || p2.top !== 1) bad(`percentile 내 구간 없음(한 명 더함) / 1등 ${JSON.stringify(p2)}`);
  const p3 = C.percentile([{ score_bucket: 50, players: 1 }], 50);
  if (!p3 || !p3.first) bad('혼자면 first');
  if (C.percentile(null, 1) !== null || C.percentile({}, 1) !== null || C.percentile(rows, null) !== null) bad('실패 응답이면 null');
  const junk = C.normalizeHist([null, { score_bucket: 'x', players: 3 }, { score_bucket: 3, players: -1 }, { bucket: 7, players: 2 }, { score_bucket: 7, players: 1 }]);
  if (JSON.stringify(junk) !== '[{"bucket":7,"players":3}]') bad(`normalizeHist 가 잘못된 행을 거르지 않음 ${JSON.stringify(junk)}`);

  const f = (t) => `${t.avg}점·평균 ${t.stage}단계(최고 ${t.maxStage})`;
  console.log(`\n=== 로직: 봇 8분 — 완벽 ${f(perfect)} · 느린 봇 ${f(slow)} · 무작위 ${f(random)} · 판 밖 검사 40판(단계 ${stages}번 넘어감, 벽돌 ${drops}개) ===`);
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
// 제목 글꼴 폭 보정 (Audiowide 는 아주 넓은 편, Russo One 도 넓은 편)
const displayFactor = (T) => ({ Audiowide: 1.3, 'Russo One': 1.15, 'Chakra Petch': 1.0, 'Do Hyeon': 0.9, DotGothic16: 1.0, 'ZCOOL QingKe HuangYou': 0.95 }[firstFont(T.fonts.display)] || 1.1);
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
// 360px 폭(본문 칸 328px) 예산. 통계 칸 = (328 − 32 − 8) / 2, 안쪽 여백 15
const STAT = (328 - 32 - 8) / 2 - 15;
const HUD = (328 - 16) / 3 - 20;       // HUD 칸 (3칸) 안쪽 폭
const TIER_PX = 328 - 32 - 24 - 50;    // 등급 줄: 카드 안쪽 폭 − 이모지(40px) − 간격
const MSG_PX = 328 - 4 - 32 - 32;      // 판 위 메시지: 판 폭 − 테두리 − 바깥 여백 − 안쪽 여백
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 40, size: 19, max: 1, what: '시작 버튼 한 줄', track: 0.02 },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄', track: 0.02 },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지', factor: 1.05 },
  { key: 'start.how.move', get: (T) => T.start.how.move, px: 104 - 15, size: 12.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.smash', get: (T) => T.start.how.smash, px: 104 - 15, size: 12.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.catch', get: (T) => T.start.how.catch, px: 104 - 15, size: 12.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'play.score', get: (T) => T.play.score, px: HUD, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.stage', get: (T) => T.play.stage, px: HUD, size: 11, max: 1, what: 'HUD 단계 이름표', track: 0.06 },
  { key: 'play.lives', get: (T) => T.play.lives, px: HUD, size: 11, max: 1, what: 'HUD 목숨 이름표', track: 0.06 },
  { key: 'play.launch', get: (T) => T.play.launch, px: MSG_PX, size: 20, max: 2, what: '발사 안내 두 줄까지' },
  { key: 'play.stageClear', get: (T) => T.play.stageClear.replace('{n}', '12'), px: MSG_PX, size: 28, max: 1, what: '단계 표시 한 줄' },
  { key: 'play.lifeLost', get: (T) => T.play.lifeLost, px: MSG_PX, size: 28, max: 2, what: '공 놓침 두 줄까지' },
  { key: 'play.gameOver', get: (T) => T.play.gameOver, px: MSG_PX, size: 28, max: 2, what: '게임 오버 두 줄까지' },
  { key: 'play.wide', get: (T) => T.play.wide, px: MSG_PX, size: 20, max: 1, what: '아이템 안내 한 줄' },
  { key: 'play.multi', get: (T) => T.play.multi, px: MSG_PX, size: 20, max: 1, what: '아이템 안내 한 줄' },
  { key: 'result.gameOver', get: (T) => T.result.gameOver, px: 328 - 32 - 28, size: 15, max: 1, what: '끝 이유 배지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 24, size: 15, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '12,340'), px: 328 - 32, size: 15, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.stage', get: (T) => T.result.stage, px: STAT, size: 12.5, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.bricks', get: (T) => T.result.bricks, px: STAT, size: 12.5, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: TIER_PX, size: 23, max: 2, what: '등급 이름 두 줄까지', word: TIER_PX })),
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 32 - 24, size: 28, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 32 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 32 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 32 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Russo One', 'Rubik'];
const VIET_FONTS = ['Chakra Petch', 'Be Vietnam Pro'];
const LATIN_EXT_FONTS = ['Audiowide'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['play.stageClear', ['n']], ['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['score']]];
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
    // 등급 이름
    if (!Array.isArray(T.result.tiers) || T.result.tiers.length !== 6 || T.result.tiers.some((x) => !x || typeof x !== 'string')) bad(`${tag} result.tiers 는 문자열 6개`);
    else if (new Set(T.result.tiers).size !== 6) bad(`${tag} result.tiers 에 같은 이름이 있음`);
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
    if (lang === 'th' && !['Chakra Petch', 'Mitr', 'Kanit'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    if (lang === 'ru' && /(^|[^а-яё])(вы|вас|вам|ваш)([^а-яё]|$)/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || (h1.match(/<em>[^<]+<\/em>/g) || []).length !== 1 || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em>…</em> 강조 1개만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : 30;
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const n = lines(T, lang, txt, h1Size, 328);
      if (n > 1) (isWideLang(lang) ? warn : bad)(`${tag} h1 한 줄 "${txt}" 이 360px 에서 ${n}줄`);
    });
    // 제목·설명 (seo.md) — 검색어 = app.config 제목(현지 이름)
    const tl = visLen(T.meta.title);
    const wide = isWideLang(lang) && lang !== 'ko';
    if (wide ? tl > 34 : tl > 56) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 34' : '라틴·키릴·한글 56'}자 이하)`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    const low = (x) => String(x || '').toLowerCase();
    if (!low(T.meta.title).startsWith(low(APP.title[lang]))) bad(`${tag} meta.title 이 app.config 제목 "${APP.title[lang]}" 으로 시작하지 않음`);
    if (low(T.start.h1Kicker) !== low(APP.title[lang])) bad(`${tag} h1Kicker 는 app.config 제목 그대로`);
    if (!low(T.siteName).includes(low(APP.title[lang]))) bad(`${tag} siteName 에 app.config 제목이 없음`);
    [T.meta.ogTitle, APP.desc[lang]].forEach((v) => { if (!String(v).trim()) bad(`${tag} 빈 문구`); });
    if (!low(T.meta.ogTitle).includes(low(APP.title[lang]))) warn(`${tag} ogTitle 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    if (!low(T.meta.description).includes(low(APP.title[lang]))) warn(`${tag} meta.description 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 180];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr') {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.meta]);
      const hit = s.match(/.{0,12}[^  "][?!:;](?=\s|"|$|')/);
      if (hit && !/https?:/.test(hit[0])) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    // 폭 예산 (360px)
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = (b.factor || displayFactor(T)) * (1 + (b.track || 0));
      const n = lines(T, lang, v, b.size, b.px, f);
      if (n > b.max) (b.soft ? warn : bad)(`${tag} ${b.key} "${v}" 가 360px 에서 ${n}줄 (${b.what})`);
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
// 공통 컴포넌트(shared/base.css·common.js)가 쓰는 mg- 클래스 — 앱이 같은 이름을 쓰면 모양이 섞인다
const SHARED_CLASSES = new Set((fs.readFileSync(path.join(SITE, 'shared', 'base.css'), 'utf8') + fs.readFileSync(path.join(SITE, 'shared', 'common.js'), 'utf8')).match(/\.mg-[a-z0-9-]+/g).map((s) => s.slice(1)).filter((c) => c !== 'mg-ad' && c !== 'mg-ad-start'));
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/brick\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/brick\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0];
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test(main.replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  (main.match(/class="([^"]+)"/g) || []).forEach((m) => m.slice(7, -1).split(/\s+/).forEach((c) => { if (SHARED_CLASSES.has(c)) bad(`${tag} 공통 컴포넌트 클래스 "${c}" 를 앱이 씀`); }));
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
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)`); return; }
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
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (게임 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음 (끝 화면 광고는 공통 컴포넌트가 넣는다)`);
      if (/data-mg-end|mg-faq|<details|tf-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="tf-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="tf-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-stage', 'hud-lives', 'field', 'board', 'field-msg', 'field-msg-text'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="board" class="tf-canvas"/.test(playS)) bad(`${tag} 판은 <canvas id="board">`);
      if (!/<div id="field-msg"[^>]*hidden/.test(playS)) bad(`${tag} 판 위 메시지는 처음에 hidden`);
      const resAt = end.indexOf('class="tf-result"');
      const endAt = end.indexOf('<div data-mg-end="brick"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="brick" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-tier-emoji', 'res-tier', 'res-score', 'res-newbest', 'res-best', 'res-stage', 'res-bricks', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (T.result.tiers.some((x) => html.replace(/<script>window\.PAGE_I18N[\s\S]*?<\/script>/, '').includes(G.esc(x)))) bad(`${tag} 등급 이름이 HTML 에 그대로 들어 있음 (등급 목록 스포일러 — PAGE_I18N 로만)`);
      if (!/<div id="res-rank" class="tf-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('brick-core.js') > 0 && html.indexOf('brick-core.js') < html.indexOf('brick.js"'))) bad(`${tag} brick-core.js 가 brick.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://brick.example.com/</loc>') || !sm.includes('<loc>https://brick.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('brick.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('brick.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("brick.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('brick.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('brick.js: setShareData/setRetry 없음');
  if (!/pointerdown/.test(js) || !/pointermove/.test(js) || !/keydown/.test(js) || !/ArrowLeft/.test(js)) bad('brick.js: 끌기(pointer)·키보드(← →) 입력 없음');
  if (!/devicePixelRatio/.test(js)) bad('brick.js: 캔버스 DPR 처리 없음');
  if (!/localStorage/.test(js)) bad('brick.js: 최고 기록(localStorage) 없음');
  if (!/supa\.submitScore\(C\.GAME/.test(js)) bad('brick.js: supa.submitScore(C.GAME, …) 없음');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('brick.js 코드에 한글 문구');
  const css = read('style.css');
  if (!/\.tf-canvas\s*\{[^}]*touch-action:\s*none/.test(css)) bad('style.css: 캔버스 touch-action: none (끄는 동안 페이지 스크롤 막기)');
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
  if (APP.id !== 'brick' || APP.category !== 'game' || APP.path !== 'https://brick.example.com/' || APP.added !== '2026-10-08' || APP.order !== 1 || APP.emoji !== '🧱') bad('app.config.js id/category/path/added/order/emoji');
  if (path.basename(SITE) !== APP.id || !/^[a-z0-9-]{1,32}$/.test(APP.id)) bad('app.config.js id ≠ 폴더 이름');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
  });
  if (!fs.lstatSync(path.join(SITE, 'shared')).isSymbolicLink() || fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 는 ../../shared 심볼릭 링크');
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
}

// 포털 큐레이션 문구(머지용): apps/hub/tools/i18n/<lang>.js curation.items 와 같은 모양·같은 2줄 추정 (check-hub.js 의 em/linesAt)
function hubEm(str) {
  let w = 0;
  for (const ch of String(str)) {
    if (/[\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af\uff00-\uffef\u3000-\u303f]/.test(ch)) w += 1;
    else if (THAI_MARK(ch.codePointAt(0))) w += 0;
    else if (/[\u0e00-\u0e7f]/.test(ch)) w += 0.62;
    else if (/\s/.test(ch)) w += 0.28;
    else if (/[A-ZÀ-ÞĐƠƯА-ЯЁ]/.test(ch)) w += 0.66;
    else w += 0.54;
  }
  return w;
}
function hubLines(str, px, width) {
  const ws = /[\u0e00-\u0e7f\u3040-\u30ff\u4e00-\u9fff]/.test(str) ? [...str] : str.split(/(?<=\s)/);
  let n = 1, cur = 0;
  ws.forEach((w) => { const ww = hubEm(w) * px; if (cur + ww > width && cur > 0) { n++; cur = ww; } else cur += ww; });
  return n;
}
function checkCuration() {
  const f = path.join(SITE, 'tools', 'hub-curation.json');
  if (!fs.existsSync(f)) return bad('tools/hub-curation.json 없음 (포털 큐레이션 문구)');
  let J;
  try { J = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return bad(`hub-curation.json 파싱 실패 ${e.message}`); }
  G.LOCALES.forEach(({ code: lang }) => {
    const it = J[lang];
    if (!it || !it.kicker || !it.headline || !it.blurb || Object.keys(it).length !== 3) return bad(`[${lang}] hub-curation: kicker/headline/blurb 셋만`);
    if (hubEm(it.kicker) * 13 > 190) bad(`[${lang}] hub-curation 키커가 한 줄에 안 들어감: ${it.kicker}`);
    if (hubLines(it.headline, 20, 250) > 2) bad(`[${lang}] hub-curation 헤드라인 2줄 초과: ${it.headline}`);
    if (hubLines(it.blurb, 13.5, 262) > 2) bad(`[${lang}] hub-curation 소개 2줄 초과: ${it.blurb}`);
    if (lang !== 'ko' && /[가-힯]/.test(JSON.stringify(it))) bad(`[${lang}] hub-curation 에 한글`);
  });
  if (Object.keys(J).length !== G.LOCALES.length) bad('hub-curation.json 언어 수 ≠ 12');
}

checkCore();
checkCuration();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 게임 로직(물리·판 밖 없음·벽돌 제거·단계·목숨·아이템·재현·실력·등급)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·캔버스·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
