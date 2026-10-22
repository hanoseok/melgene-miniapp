#!/usr/bin/env node
/**
 * 탑 쌓기(Stack Tower) 검사.
 *   1) 로직(stack-core.js): 상수·속도 곡선(단조 증가·상한)·축 번갈아, overlap1(퍼펙트 허용 오차·잘림 조각 위치/길이·빗나감),
 *      시작 상태(받침 1개·움직이는 블록 크기 = 맨 위·offset ±SPAN), step(왕복·범위 안·큰 dt 는 MAX_STEP 으로 제한),
 *      drop: 퍼펙트(크기 유지·제자리 스냅·combo·GROW_AFTER 부터 넓어짐·BASE 상한) / 부분 겹침(남은 폭 + 잘린 폭 = 원래 폭, 잘린 조각 위치) / 빗나감(over, 점수 그대로),
 *      같은 시드 + 같은 입력 = 같은 판, 봇 수천 판(완벽·사람 같은 오차·무작위 타이밍): 언제나 끝남(완벽 봇 제외), 점수 = 쌓은 블록 수,
 *      블록 크기 0 < w,d ≤ BASE, 새 블록은 (넓어질 때 빼고) 아래 블록 범위 안, 사람 같은 봇 평균 점수(공정함).
 *      서버 인코딩: game 이름 ^[a-z0-9-]{1,32}$, bucket 0..1999 정수, percentile(높을수록 좋음)·잘못된 행 무시·실패 null·혼자면 first.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="stack" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-stack.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'stack-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
const sk = (axis) => (axis === 'x' ? 'w' : 'd');
function gauss(rnd) { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// 봇: 프레임(16ms)마다 진행하다가 "떨어뜨릴 offset" 근처를 지날 때 drop. aimFn(s, rnd) → 목표 offset(오차 포함)
function play(seed, aimFn, rnd, maxDrops) {
  const s = C.newGame(seed);
  let problem = '', frames = 0, placed = 0;
  const limit = maxDrops || 5000;
  let aim = aimFn(s, rnd);
  while (!s.over && placed < limit && frames++ < 2000000) {
    const before = s.moving.offset;
    C.step(s, 16);
    const after = s.moving.offset;
    const lo = Math.min(before, after), hi = Math.max(before, after);
    if (aim >= lo && aim <= hi) {
      // 목표 지점에 정확히 놓고 떨어뜨린다(프레임 사이 위치 보간)
      const top = s.blocks[s.blocks.length - 1];
      s.moving.offset = aim; s.moving[s.moving.axis] = top[s.moving.axis] + aim;
      const prev = top;
      const ev = C.drop(s);
      if (!ev) { problem = problem || 'drop 이 null'; break; }
      if (ev.type === 'place') {
        placed++;
        const b = ev.block, ax = s.blocks[s.blocks.length - 1] === b ? (b.level % 2 === 1 ? 'x' : 'z') : '';
        if (!(b.w > 0 && b.d > 0 && b.w <= C.BASE + 1e-9 && b.d <= C.BASE + 1e-9)) problem = problem || `블록 크기 이상 ${JSON.stringify(b)}`;
        if (!ev.grow) {
          if (b[ax] < prev[ax] - 1e-6 || b[ax] + b[sk(ax)] > prev[ax] + prev[sk(ax)] + 1e-6) problem = problem || `새 블록이 아래 블록 밖 ${JSON.stringify([prev, b])}`;
        }
        const other = ax === 'x' ? 'z' : 'x';
        if (!near(b[other], prev[other], 1e-3) || !near(b[sk(other)], prev[sk(other)], 1e-3)) problem = problem || '움직이지 않는 축이 바뀜';
        if (ev.cut && !near(ev.cut[sk(ax)] + b[sk(ax)], prev[sk(ax)], 1e-3)) problem = problem || '남은 폭 + 잘린 폭 ≠ 원래 폭';
        if (s.score !== s.blocks.length - 1) problem = problem || '점수 ≠ 쌓은 블록 수';
      }
      if (!s.over) aim = aimFn(s, rnd);
    }
    if (s.moving && (s.moving.offset < -C.SPAN - 1e-9 || s.moving.offset > C.SPAN + 1e-9)) problem = problem || 'offset 이 범위 밖';
  }
  return { s, problem, placed };
}
const AIMS = {
  perfect: () => 0,
  human: (s, rnd) => gauss(rnd) * 7,                  // 사람 같은 오차(표준편차 7단위)
  sloppy: (s, rnd) => gauss(rnd) * 16,
  random: (s, rnd) => (rnd() * 2 - 1) * C.SPAN,       // 아무 때나
};

function checkCore() {
  // 상수·곡선
  if (C.BASE !== 100 || !(C.PERFECT_TOL > 0 && C.PERFECT_TOL <= 5) || !(C.GROW_AFTER >= 2) || !(C.GROW > 0)) bad('상수(BASE·PERFECT_TOL·GROW_AFTER·GROW)');
  if (!(C.SPAN > C.BASE)) bad('SPAN 은 BASE 보다 커야(완전히 빗나갈 수 있어야) 함');
  for (let n = 1; n < 200; n++) if (C.speed(n) < C.speed(n - 1)) bad(`speed 가 단조 증가가 아님 (n=${n})`);
  if (C.speed(0) !== C.BASE_SPEED || C.speed(10000) !== C.MAX_SPEED || !(C.speed(10) > C.speed(0))) bad('speed 처음 값/상한/증가');
  if (C.axisOf(1) === C.axisOf(2) || C.axisOf(1) !== C.axisOf(3)) bad('축이 층마다 번갈아야 함');
  // overlap1
  let r = C.overlap1(0, 2, 100);
  if (!r.perfect || r.keep.pos !== 0 || r.keep.len !== 100 || r.cut) bad(`퍼펙트 허용 오차 안 ${JSON.stringify(r)}`);
  r = C.overlap1(0, -C.PERFECT_TOL, 100);
  if (!r.perfect) bad('허용 오차 경계(-TOL)는 퍼펙트');
  r = C.overlap1(0, 20, 100);
  if (r.perfect || r.keep.pos !== 20 || r.keep.len !== 80 || r.cut.pos !== 100 || r.cut.len !== 20) bad(`오른쪽으로 20 어긋남 ${JSON.stringify(r)}`);
  r = C.overlap1(10, -15, 60);
  if (r.perfect || r.keep.pos !== 10 || r.keep.len !== 35 || r.cut.pos !== -15 || r.cut.len !== 25) bad(`왼쪽으로 25 어긋남 ${JSON.stringify(r)}`);
  r = C.overlap1(0, 100, 100);
  if (r.keep || !r.cut || r.cut.len !== 100) bad(`완전히 빗나감 ${JSON.stringify(r)}`);
  r = C.overlap1(0, -130, 100);
  if (r.keep) bad('왼쪽으로 완전히 빗나감');
  // 시작 상태
  const s0 = C.newGame(7);
  if (s0.blocks.length !== 1 || s0.blocks[0].w !== C.BASE || s0.blocks[0].d !== C.BASE || s0.score !== 0 || s0.over) bad('시작 상태');
  if (!s0.moving || s0.moving.level !== 1 || s0.moving.w !== C.BASE || Math.abs(s0.moving.offset) !== C.SPAN || s0.moving.dir !== -Math.sign(s0.moving.offset)) bad(`시작 움직이는 블록 ${JSON.stringify(s0.moving)}`);
  // step: 범위 안 왕복, 큰 dt 제한
  const w = C.newGame(8);
  const sign0 = w.moving.dir;
  let flipped = false;
  for (let i = 0; i < 400; i++) {
    const d0 = w.moving.dir;
    C.step(w, 16);
    if (w.moving.dir !== d0) flipped = true;
    if (Math.abs(w.moving.offset) > C.SPAN + 1e-9) { bad('offset 이 SPAN 밖'); break; }
    if (!near(w.moving[w.moving.axis], w.blocks[0][w.moving.axis] + w.moving.offset)) { bad('moving 좌표 ≠ 맨 위 + offset'); break; }
  }
  if (!flipped) bad(`끝에 닿으면 방향이 바뀌어야 함 (처음 dir=${sign0})`);
  const b1 = C.newGame(9), b2 = C.newGame(9);
  C.step(b1, 5000);
  C.step(b2, C.MAX_STEP);
  if (!near(b1.moving.offset, b2.moving.offset)) bad('한 번에 큰 dt 는 MAX_STEP 으로 제한');
  const t1 = C.newGame(10), t2 = C.newGame(10);
  C.step(t1, 80); for (let i = 0; i < 5; i++) C.step(t2, 16);
  if (!near(t1.moving.offset, t2.moving.offset, 1e-6)) bad('dt 를 나눠도 같은 위치');
  // drop: 퍼펙트 → combo → 넓어짐
  const aimAt = (s, o) => { const top = s.blocks[s.blocks.length - 1]; s.moving.offset = o; s.moving[s.moving.axis] = top[s.moving.axis] + o; };
  const p = C.newGame(11);
  aimAt(p, 30); let ev = C.drop(p);   // 1층: 30 어긋남 → 폭 70
  if (ev.type !== 'place' || ev.perfect || !ev.cut || !near(ev.block[sk(C.axisOf(1))], 70)) bad(`30 어긋남 → 폭 70 ${JSON.stringify(ev)}`);
  if (p.combo !== 0 || p.score !== 1) bad('부분 겹침 뒤 combo 0 · 점수 1');
  aimAt(p, 30); ev = C.drop(p);       // 2층(다른 축): 폭 70
  const sizes = () => { const t = p.blocks[p.blocks.length - 1]; return [t.w, t.d]; };
  const before = sizes();
  aimAt(p, 1); ev = C.drop(p);
  if (!ev.perfect || ev.grow || p.combo !== 1 || JSON.stringify(sizes()) !== JSON.stringify(before)) bad(`퍼펙트 1번: 크기 유지 ${JSON.stringify([ev, sizes(), before])}`);
  const top0 = p.blocks[p.blocks.length - 2], top1 = p.blocks[p.blocks.length - 1];
  if (!near(top1.x, top0.x) || !near(top1.z, top0.z)) bad('퍼펙트는 아래 블록 자리에 딱 맞춤(스냅)');
  aimAt(p, -2); ev = C.drop(p);
  if (!ev.perfect || ev.grow || p.combo !== 2) bad('퍼펙트 2번: 아직 안 넓어짐');
  const ax3 = p.moving.axis, w3 = p.blocks[p.blocks.length - 1][sk(ax3)], pos3 = p.blocks[p.blocks.length - 1][ax3];
  aimAt(p, 0); ev = C.drop(p);
  if (!ev.perfect || !ev.grow || p.combo !== C.GROW_AFTER) bad(`퍼펙트 ${C.GROW_AFTER}번째부터 넓어짐 ${JSON.stringify(ev)}`);
  else if (!near(ev.block[sk(ax3)], w3 + C.GROW) || !near(ev.block[ax3], pos3 - C.GROW / 2)) bad('넓어질 때 가운데 기준 GROW 만큼');
  if (p.bestCombo !== C.GROW_AFTER || p.perfects !== C.GROW_AFTER) bad('bestCombo / perfects 세기');
  // 퍼펙트만 계속하면 BASE 까지 넓어지고 넘지 않는다
  for (let i = 0; i < 80; i++) { aimAt(p, 0); C.drop(p); }
  const tp = p.blocks[p.blocks.length - 1];
  if (!near(tp.w, C.BASE) || !near(tp.d, C.BASE)) bad(`퍼펙트를 이어 가면 BASE 까지 회복 (${tp.w}×${tp.d})`);
  if (p.blocks.some((b) => b.w > C.BASE + 1e-9 || b.d > C.BASE + 1e-9)) bad('BASE 보다 넓어짐');
  // 퍼펙트가 끊기면 combo 0
  aimAt(p, 10); C.drop(p);
  if (p.combo !== 0 || p.bestCombo < 80) bad('퍼펙트가 끊기면 combo 0, bestCombo 유지');
  // 빗나감
  const m = C.newGame(12);
  aimAt(m, 5); C.drop(m);
  const sc = m.score;
  aimAt(m, -C.SPAN); ev = C.drop(m);
  if (!ev || ev.type !== 'miss' || !m.over || m.score !== sc || m.moving) bad(`완전히 빗나가면 끝 ${JSON.stringify(ev)}`);
  if (C.drop(m) !== null) bad('끝난 뒤 drop 은 null');
  C.step(m, 100);
  // 재현
  const run = (seed) => { const r2 = mulberry(5); return JSON.stringify(play(seed, AIMS.human, r2, 300).s.blocks); };
  if (run(31) !== run(31)) bad('같은 시드 같은 입력인데 결과가 다름');
  if (C.newGame(31).hue0 !== C.newGame(31).hue0) bad('시드가 같으면 첫 색도 같음');
  // 봇
  const rnd = mulberry(2026);
  const pf = play(77, AIMS.perfect, rnd, 400);
  if (pf.problem || pf.s.over || pf.placed !== 400 || pf.s.bestCombo !== 400) bad(`완벽 봇은 끝나지 않고 400층 (${pf.placed}, ${pf.problem})`);
  let humanSum = 0, n = 0;
  const stats = { human: [], sloppy: [], random: [] };
  [['human', 600], ['sloppy', 300], ['random', 300]].forEach(([k, cnt]) => {
    for (let i = 0; i < cnt; i++) {
      const res = play(1000 + i * 7 + k.length, AIMS[k], rnd);
      if (res.problem) bad(`${k} 봇 판 ${i}: ${res.problem}`);
      if (!res.s.over) bad(`${k} 봇 판 ${i}: 끝나지 않음 (${res.placed}층)`);
      stats[k].push(res.s.score);
      if (k === 'human') { humanSum += res.s.score; n++; }
    }
  });
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  if (avg(stats.human) < 12) bad(`사람 같은 봇 평균 ${avg(stats.human).toFixed(1)}층 — 너무 어려움(공정함)`);
  if (!(avg(stats.human) > avg(stats.sloppy) && avg(stats.sloppy) > avg(stats.random))) bad(`정확할수록 높이 쌓아야 함 ${['human', 'sloppy', 'random'].map((k) => avg(stats[k]).toFixed(1))}`);
  if (avg(stats.random) > 6) bad(`아무 때나 누르는 봇이 평균 ${avg(stats.random).toFixed(1)}층 — 너무 쉬움`);
  void humanSum; void n;
  console.log(`  봇 평균 층수: 사람 같은(σ7) ${avg(stats.human).toFixed(1)} · 대충(σ16) ${avg(stats.sloppy).toFixed(1)} · 무작위 ${avg(stats.random).toFixed(1)} · 완벽 400층 유지`);
  // 서버 인코딩
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME) || C.GAME !== 'stack') bad('GAME 이름');
  [0, 10, 14, 15, 99999, -5, NaN].forEach((v) => { const bk = C.bucket(v); if (!Number.isInteger(bk) || bk < 0 || bk > 1999) bad(`bucket(${v}) = ${bk}`); });
  if (C.bucket(55) !== 55 || C.bucket(0) !== 0 || C.bucket(5000) !== 1999) bad('bucket 값 (= 층수, 상한 1999)');
  const pc = C.percentile([{ score_bucket: 1, players: 3 }, { score_bucket: 5, players: 1 }, { score_bucket: 9, players: 2 }], 5);
  if (!pc || pc.first || pc.others !== 5 || pc.top < 1 || pc.top > 100) bad(`percentile ${JSON.stringify(pc)}`);
  if (!C.percentile([{ score_bucket: 5, players: 1 }], 5).first) bad('혼자면 first');
  if (C.percentile(null, 5) !== null) bad('실패(null)면 null');
  if (C.percentile([{ score_bucket: 'x', players: 'y' }, null, { score_bucket: 3, players: 4 }], 9).others !== 4) bad('잘못된 행 무시');
  const hi = C.percentile([{ score_bucket: 2, players: 9 }], 50), lo = C.percentile([{ score_bucket: 50, players: 9 }], 2);
  if (!(hi.top < lo.top)) bad('높은 점수가 더 상위여야 함');
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
// 제목 글꼴 폭 보정 (Fredoka 600 은 조금 넓은 편, Rubik 700·Baloo 2·Mitr 도 넓은 편)
const displayFactor = (T) => ({ Fredoka: 1.1, Rubik: 1.12, 'Baloo 2': 1.05, Mitr: 1.1 }[firstFont(T.fonts.display)] || 1.05);
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
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 1, what: '사실 한 줄' },
  { key: 'start.how.tap', get: (T) => T.start.how.tap, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.cut', get: (T) => T.start.how.cut, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.perfect', get: (T) => T.start.how.perfect, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  // HUD 칸: (328 - 44 - 12) = 272 → 1.2 : 1 → 148 / 124, 안쪽 여백 20+3 → 125 / 101 (이름표 한 줄)
  { key: 'play.score', get: (T) => T.play.score, px: 125, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 101, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328 - 6 - 32 - 32, size: 16, max: 1, what: '탭 안내 한 줄(필드 안)' },
  { key: 'play.perfect', get: (T) => T.play.perfect, px: 328 - 6 - 24, size: 29, max: 1, what: '퍼펙트 글자(캔버스) 한 줄' },
  { key: 'play.combo', get: (T) => T.play.combo.replace('{n}', '12'), px: 328 - 6 - 24, size: 17, max: 1, what: '연속 글자(캔버스) 한 줄' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.blocks', get: (T) => '888 ' + T.result.blocks, px: 328 - 32, size: 20, max: 1, what: '점수 줄(68px 숫자 옆)', factor: 1.1 },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.perfects', get: (T) => T.result.perfects, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.bestCombo', get: (T) => T.result.bestCombo, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n']], ['play.combo', ['n']]];
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
    if (lang === 'th' && !['Mitr', 'Kanit', 'Mali', 'Prompt'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : ['ru', 'vi'].includes(lang) ? 31 : 34;
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
    if (!low(T.start.h1Kicker).includes(low(APP.title[lang]))) bad(`${tag} h1Kicker 에 app.config 제목이 없음`);
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
  if (!/<link rel="canonical" href="https:\/\/stack\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/stack\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|st-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="st-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="st-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-best', 'pause-btn', 'field', 'st-canvas', 'tap-hint', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="st-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      const resAt = end.indexOf('class="st-result"');
      const endAt = end.indexOf('<div data-mg-end="stack"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="stack" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-newbest', 'res-best', 'res-perfects', 'res-combo', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="st-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('stack-core.js') > 0 && html.indexOf('stack-core.js') < html.indexOf('stack.js"'))) bad(`${tag} stack-core.js 가 stack.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://stack.example.com/</loc>') || !sm.includes('<loc>https://stack.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('stack.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('stack.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("stack.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('stack.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('stack.js: setShareData/setRetry 없음');
  if (!/requestAnimationFrame/.test(js) || !/devicePixelRatio/.test(js)) bad('stack.js: requestAnimationFrame·devicePixelRatio 사용');
  if (!/supa\.submitScore\(C\.GAME/.test(js)) bad('stack.js: supa.submitScore(C.GAME, …) 로 실제 백분위');
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
  if (APP.id !== 'stack' || APP.category !== 'game' || APP.path !== 'https://stack.example.com/' || APP.added !== '2026-10-23' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
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
console.log('\n결과: 통과 — 게임 로직(겹침·잘림·퍼펙트·넓어짐·속도·재현·공정함)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
