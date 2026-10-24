#!/usr/bin/env node
/**
 * 할로윈 박쥐 날기(Flappy Bat) 검사.
 *   1) 로직(bat-core.js): 상수(너그러운 충돌 반지름·가장 좁은 틈도 지나갈 수 있는 높이·완만한 난이도), speedOf/gapOf 곡선, circleRect,
 *      준비 상태(움직이지 않음)·날갯짓·중력·땅에 닿으면 끝·천장은 막힘만·끝난 뒤 땅까지 낙하, 고정 tick(dt 를 나눠도 같음·MAX_STEP),
 *      충돌(틈 가운데 안전·위/아래 기둥·틈 끝 HIT_R 경계)·기둥을 지나면 정확히 1점(두 번 안 셈), 같은 시드 + 같은 입력 = 같은 판,
 *      틈은 언제나 지나갈 수 있음(자동 비행 150판 × 300개 + 최악의 틈 이동 패턴), 매 프레임 불변식(천장·땅·최대 낙하·틈 범위·MAX_SHIFT·SPACING·겹침 = 끝),
 *      공정함(사람 같은 봇 평균·정확할수록 멀리·무작위는 거의 0). 서버 인코딩: game 이름, bucket 0..1999, percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="bat" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-bat.js   (cwd = apps/bat)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'bat-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
function gauss(rnd) { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

// 한 판: 첫 날갯짓 후 16ms 프레임으로 진행, ctrl(s) → true 면 그 tick 에 날갯짓. 불변식을 매 프레임 확인한다.
function play(seed, ctrl, maxScore, opt = {}) {
  const s = C.newGame(seed);
  if (opt.rnd) s.rnd = opt.rnd;
  C.flap(s);
  let problem = '', frames = 0, lastScore = 0;
  const seen = new Set();
  while (!s.over && s.score < maxScore && frames++ < 400000) {
    const evs = C.step(s, 16, ctrl);
    evs.forEach((e) => { if (e.type === 'score') { if (e.score !== lastScore + 1) problem = problem || '점수가 1씩 오르지 않음'; lastScore = e.score; } });
    if (s.y < C.HIT_R - 1e-9) problem = problem || '박쥐가 천장 위로 나감';
    if (!s.over && s.y + C.HIT_R > C.GROUND + 1e-9) problem = problem || '땅 밑으로 들어갔는데 끝나지 않음';
    if (s.vy > C.MAX_FALL + 1e-9) problem = problem || '최대 낙하 속도 초과';
    for (let i = 0; i < s.pillars.length; i++) {
      const p = s.pillars[i];
      if (!seen.has(p.n)) {
        seen.add(p.n);
        const r = C.gapRange(p.gap);
        if (p.gap !== C.gapOf(p.n) || p.gap < C.GAP_MIN) problem = problem || `틈 높이 이상 ${JSON.stringify(p)}`;
        if (p.gapY < r[0] - 1e-6 || p.gapY > r[1] + 1e-6) problem = problem || `틈이 화면 밖 ${JSON.stringify(p)}`;
        const prev = s.pillars.find((q) => q.n === p.n - 1);
        if (prev && Math.abs(p.gapY - prev.gapY) > C.MAX_SHIFT + 1e-6) problem = problem || `틈 이동 ${Math.abs(p.gapY - prev.gapY).toFixed(1)} > MAX_SHIFT`;
        if (prev && !near(p.x - prev.x, C.SPACING, 1e-6)) problem = problem || '기둥 간격이 SPACING 이 아님';
      }
    }
    if (!s.over && s.pillars.some((p) => C.hitsPillar(p, s.y))) problem = problem || '기둥과 겹쳤는데 끝나지 않음';
  }
  if (s.score !== lastScore) problem = problem || '점수 사건 수 ≠ 점수';
  return { s, problem };
}

function checkCore() {
  // 상수
  if (!(C.HIT_R < C.BAT_R)) bad('충돌 반지름은 그림보다 작아야 함(너그러운 판정)');
  if (!(C.GAP_MIN > 2 * C.HIT_R + C.FLAP_V * C.FLAP_V / (2 * C.GRAVITY))) bad('가장 좁은 틈도 한 번 날갯짓 높이 + 박쥐 크기보다 넓어야 함');
  if (!(C.SPACING > C.PW + 2 * C.HIT_R)) bad('기둥 사이에 숨 쉴 공간');
  if (!(Math.abs(C.TICK_MS - 1000 / 120) < 1e-9)) bad('고정 시간 간격 = 1/120초');
  for (let n = 1; n < 300; n++) {
    if (C.speedOf(n) < C.speedOf(n - 1)) bad(`speedOf 가 단조 증가가 아님 (n=${n})`);
    if (C.gapOf(n) > C.gapOf(n - 1)) bad(`gapOf 가 단조 감소가 아님 (n=${n})`);
  }
  if (C.speedOf(0) !== C.SPEED0 || C.speedOf(100000) !== C.MAX_SPEED || C.gapOf(0) !== C.GAP0 || C.gapOf(100000) !== C.GAP_MIN) bad('speedOf/gapOf 처음 값·한계');
  if (!(C.MAX_SPEED / C.SPEED0 < 1.6) || !(C.GAP_MIN / C.GAP0 > 0.7)) bad('난이도는 완만하게 (속도 1.6배 미만, 틈 70% 이상)');
  // circleRect
  if (!C.circleRect(0, 0, 10, 5, -5, 20, 5) || C.circleRect(0, 0, 10, 10.5, -5, 20, 5) || !C.circleRect(0, 0, 10, 7, 7, 20, 20) || C.circleRect(0, 0, 10, 7.2, 7.2, 20, 20)) bad('circleRect (변·모서리)');
  // 시작 상태 · 준비
  const s0 = C.newGame(7);
  if (s0.started || s0.over || s0.score !== 0 || s0.pillars.length || s0.flaps !== 0) bad('시작 상태');
  const y0 = s0.y;
  C.step(s0, 2000);
  if (s0.y !== y0 || s0.pillars.length || s0.score !== 0 || s0.over) bad('준비 상태에서는 박쥐·기둥이 움직이지 않아야 함');
  // 날갯짓 → 위로, 중력 → 아래로, 그대로 두면 땅에 닿아 끝
  C.flap(s0);
  if (!s0.started || s0.vy !== C.FLAP_V || s0.flaps !== 1) bad('flap: 시작 + 위로 속도');
  C.step(s0, C.TICK_MS * 6 + 0.01);
  if (!(s0.y < y0)) bad('날갯짓 직후 올라가야 함');
  let guard = 0;
  while (!s0.over && guard++ < 1000) C.step(s0, 16);
  if (!s0.over || s0.hit !== 'ground' || s0.score !== 0) bad(`그대로 두면 땅에 닿아 끝 (${s0.hit})`);
  if (C.flap(s0) !== false) bad('끝난 뒤 flap 은 false');
  while (!s0.grounded && guard++ < 2000) C.step(s0, 16);
  if (!s0.grounded) bad('끝난 뒤 박쥐는 땅까지 떨어짐(그림용)');
  // 천장: 막히기만 하고 죽지 않음
  const ce = C.newGame(8);
  C.flap(ce);
  for (let i = 0; i < 40; i++) { C.step(ce, 16); C.flap(ce); }
  if (ce.over || ce.y < C.HIT_R - 1e-9) bad(`천장에서 죽거나 위로 빠져나감 (over=${ce.over}, y=${ce.y})`);
  // 고정 시간 간격: dt 를 나눠도 같은 결과, 큰 dt 는 MAX_STEP
  const a = C.newGame(9), b = C.newGame(9);
  C.flap(a); C.flap(b);
  C.step(a, 96); for (let i = 0; i < 12; i++) C.step(b, 8);
  if (!near(a.y, b.y, 1e-9) || a.ticks !== b.ticks) bad('dt 를 나눠도 같은 위치(고정 tick)');
  const c1 = C.newGame(10), c2 = C.newGame(10);
  C.flap(c1); C.flap(c2);
  C.step(c1, 5000); C.step(c2, C.MAX_STEP);
  if (!near(c1.y, c2.y, 1e-9)) bad('한 번에 큰 dt 는 MAX_STEP 으로 제한');
  // 점수·충돌을 손으로 만든 기둥으로
  const h = C.newGame(11);
  C.flap(h);
  h.pillars = [{ n: 0, x: C.BAT_X + C.HIT_R + 0.5, gapY: h.y, gap: 160, kind: 0, scored: false }];
  h.nextN = 1; h.lastGapY = h.y;
  if (C.hitsPillar(h.pillars[0], h.y)) bad('틈 가운데에서는 부딪히지 않음');
  if (!C.hitsPillar({ x: C.BAT_X - 10, gapY: h.y + 100, gap: 140 }, h.y)) bad('위 기둥에 닿으면 부딪힘');
  if (!C.hitsPillar({ x: C.BAT_X - 10, gapY: h.y - 100, gap: 140 }, h.y)) bad('아래 기둥에 닿으면 부딪힘');
  if (C.hitsPillar({ x: C.BAT_X - 10, gapY: h.y - 70 + C.HIT_R + 0.6, gap: 140 }, h.y)) bad('틈 끝에서 HIT_R 만큼 떨어지면 안 부딪힘(너그러운 판정)');
  if (!C.hitsPillar({ x: C.BAT_X - 10, gapY: h.y - 70 + C.HIT_R - 0.6, gap: 140 }, h.y)) bad('틈 끝에서 HIT_R 보다 가까우면 부딪힘');
  // 기둥을 다 지나면 정확히 1점
  const sc = C.newGame(12);
  C.flap(sc);
  sc.pillars = [{ n: 0, x: C.BAT_X - C.HIT_R - C.PW + 0.4, gapY: sc.y, gap: 170, kind: 0, scored: false }];
  sc.nextN = 1; sc.lastGapY = sc.y;
  const evs = C.step(sc, C.TICK_MS + 0.01, () => true);
  if (sc.score !== 1 || !evs.some((e) => e.type === 'score') || !sc.pillars[0].scored) bad(`기둥을 지나면 1점 ${JSON.stringify(evs)}`);
  C.step(sc, C.TICK_MS * 3, () => true);
  if (sc.score !== 1) bad('같은 기둥으로 두 번 점수');
  // 재현: 같은 시드 + 같은 tick 에 같은 날갯짓 = 같은 판
  const rec = (seed) => { const r = mulberry(5); const res = play(seed, (s) => C.autoFlap(s) && r() < 0.9, 60); return JSON.stringify([res.s.score, res.s.y, res.s.ticks, res.s.pillars.map((p) => [p.n, p.gapY, p.kind])]); };
  if (rec(31) !== rec(31)) bad('같은 시드 같은 입력인데 결과가 다름');
  if (JSON.stringify(play(31, C.autoFlap, 5).s.pillars.map((p) => p.gapY)) === JSON.stringify(play(32, C.autoFlap, 5).s.pillars.map((p) => p.gapY))) bad('시드가 다르면 틈 위치도 달라야 함');
  // 틈은 언제나 지나갈 수 있다: 자동 비행이 여러 시드 + 최악의 틈 이동(위아래 끝까지 번갈아)에서 300개를 통과
  let autoFail = 0;
  for (let i = 0; i < 150; i++) {
    const r = play(500 + i, (s) => C.autoFlap(s), 300);
    if (r.problem) bad(`자동 비행 판 ${i}: ${r.problem}`);
    if (r.s.score < 300) autoFail++;
  }
  if (autoFail) bad(`자동 비행이 300개를 못 지난 판 ${autoFail}개 — 지나갈 수 없는 틈`);
  [[0, 0, 1, 1], [1, 1, 0, 0], [0, 1], [0.5, 0, 1], [1, 0, 0]].forEach((pat) => {
    let k = 0;
    const r = play(1, (s) => C.autoFlap(s), 300, { rnd: () => pat[(k++) % pat.length] });
    if (r.problem || r.s.score < 300) bad(`최악의 틈 이동 ${JSON.stringify(pat)}: ${r.s.score}개 ${r.problem}`);
  });
  // 공정함: 사람 같은 봇(목표 흔들림 + 반응 늦음)·대충·무작위
  const human = (sig) => { const r = mulberry(sig * 97); let lag = 0; return (s) => {
    if (lag > 0) { lag--; return false; }
    const p = C.nextPillar(s);
    const tgt = p ? p.gapY + p.gap * 0.2 + gauss(r) * sig : C.GROUND * 0.5;
    if (s.y > tgt && s.vy > -90) { lag = Math.floor(r() * 6); return true; }
    return false;
  }; };
  const avg = (arr) => arr.reduce((x, y) => x + y, 0) / arr.length;
  const stats = {};
  [['steady', 10, 200], ['human', 18, 300], ['sloppy', 28, 300]].forEach(([k, sig, cnt]) => {
    const ctrl = human(sig);
    stats[k] = [];
    for (let i = 0; i < cnt; i++) {
      const r = play(1000 + i * 7 + sig, ctrl, 2000);
      if (r.problem) bad(`${k} 봇 판 ${i}: ${r.problem}`);
      if (!r.s.over && r.s.score < 2000) bad(`${k} 봇 판 ${i}: 끝나지 않음`);
      stats[k].push(r.s.score);
    }
  });
  const rr = mulberry(3);
  stats.random = [];
  for (let i = 0; i < 300; i++) { const r = play(5000 + i, () => rr() < 0.07, 2000); if (r.problem) bad(`무작위 봇 판 ${i}: ${r.problem}`); stats.random.push(r.s.score); }
  if (avg(stats.human) < 8) bad(`사람 같은 봇 평균 ${avg(stats.human).toFixed(1)}개 — 너무 어려움(공정함)`);
  if (!(avg(stats.steady) > avg(stats.human) && avg(stats.human) > avg(stats.sloppy) && avg(stats.sloppy) > avg(stats.random))) bad(`정확할수록 멀리 가야 함 ${['steady', 'human', 'sloppy', 'random'].map((k) => avg(stats[k]).toFixed(1))}`);
  if (avg(stats.random) > 1.5) bad(`아무 때나 누르는 봇이 평균 ${avg(stats.random).toFixed(1)}개 — 너무 쉬움`);
  console.log(`  봇 평균 통과 수: 침착(σ10) ${avg(stats.steady).toFixed(1)} · 사람 같은(σ18) ${avg(stats.human).toFixed(1)} · 대충(σ28) ${avg(stats.sloppy).toFixed(1)} · 무작위 ${avg(stats.random).toFixed(1)} · 자동 비행 300개 통과`);
  // 서버 인코딩
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME) || C.GAME !== 'bat') bad('GAME 이름');
  [0, 10, 14, 15, 99999, -5, NaN].forEach((v) => { const bk = C.bucket(v); if (!Number.isInteger(bk) || bk < 0 || bk > 1999) bad(`bucket(${v}) = ${bk}`); });
  if (C.bucket(55) !== 55 || C.bucket(0) !== 0 || C.bucket(5000) !== 1999) bad('bucket 값 (= 점수, 상한 1999)');
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
  { key: 'start.how.pass', get: (T) => T.start.how.pass, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.avoid', get: (T) => T.start.how.avoid, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  // HUD 칸: (328 - 44 - 12) = 272 → 1.2 : 1 → 148 / 124, 안쪽 여백 20+3 → 125 / 101 (이름표 한 줄)
  { key: 'play.score', get: (T) => T.play.score, px: 125, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 101, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328 - 6 - 32 - 32, size: 16, max: 1, what: '탭 안내 한 줄(필드 안)' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.points', get: (T) => '888 ' + T.result.points, px: 328 - 32, size: 20, max: 1, what: '점수 줄(68px 숫자 옆)', factor: 1.1 },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.flaps', get: (T) => T.result.flaps, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.time', get: (T) => T.result.time, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.timeValue', get: (T) => T.result.timeValue.replace('{s}', '188.8'), px: (328 - 36 - 8) / 2 - 15, size: 26, max: 1, what: '비행 시간 값 한 줄' },
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
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n']], ['result.timeValue', ['s']]];
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
  if (!/<link rel="canonical" href="https:\/\/bat\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bat\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|bat-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="bat-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="bat-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-best', 'pause-btn', 'field', 'bat-canvas', 'tap-hint', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="bat-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      const resAt = end.indexOf('class="bat-result"');
      const endAt = end.indexOf('<div data-mg-end="bat"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="bat" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-newbest', 'res-best', 'res-flaps', 'res-time', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="bat-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('bat-core.js') > 0 && html.indexOf('bat-core.js') < html.indexOf('bat.js"'))) bad(`${tag} bat-core.js 가 bat.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://bat.example.com/</loc>') || !sm.includes('<loc>https://bat.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('bat.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('bat.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("bat.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('bat.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('bat.js: setShareData/setRetry 없음');
  if (!/requestAnimationFrame/.test(js) || !/devicePixelRatio/.test(js)) bad('bat.js: requestAnimationFrame·devicePixelRatio 사용');
  if (!/supa\.submitScore\(C\.GAME/.test(js)) bad('bat.js: supa.submitScore(C.GAME, …) 로 실제 백분위');
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
  if (APP.id !== 'bat' || APP.category !== 'game' || APP.path !== 'https://bat.example.com/' || APP.added !== '2026-10-25' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
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
console.log('\n결과: 통과 — 게임 로직(날갯짓·중력·충돌·점수·고정 tick·재현·틈 통과 가능·공정함)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
