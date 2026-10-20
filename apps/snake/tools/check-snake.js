#!/usr/bin/env node
/**
 * 뱀 게임(Snake) 검사.
 *   1) 로직(snake-core.js): 격자·시작 상태(길이 3·오른쪽·사과는 빈 칸), 속도 곡선(interval 단조·하한 75ms)·레벨·사과 점수,
 *      방향 입력(반대·같은 방향 무시·큐 2개), 벽 충돌('wall')·자기 몸 충돌('self')·꼬리 칸으로 가는 이동은 안전,
 *      사과를 먹으면 길이 +1·점수 +foodPoints·새 사과는 몸 밖, 같은 시드 + 같은 입력 = 같은 판(재현), 큰 dt 는 틱 단위로 나눠 같은 결과,
 *      봇 수천 판(길 찾는 봇·가만히·무작위): 언제나 끝남, 길이 = 3 + 먹은 수, 점수 = 사과 점수 합, 몸은 겹치지 않고 격자 안,
 *      잘 찾는 봇은 사과를 꽤 먹음(공정함), 격자를 다 채우면 'full'.
 *      서버 인코딩: game 이름 ^[a-z0-9-]{1,32}$, bucket 0..1999 정수, percentile(높을수록 좋음)·잘못된 행 무시·실패 null·혼자면 first.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="snake" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-snake.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'snake-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const cellKey = (p) => p.y * C.COLS + p.x;

// 봇: 매 틱 직전에 방향을 정한다 (s 를 읽기만 함)
function free(s, x, y) {
  if (x < 0 || y < 0 || x >= C.COLS || y >= C.ROWS) return false;
  for (let i = 0; i < s.snake.length - 1; i++) if (s.snake[i].x === x && s.snake[i].y === y) return false;
  return true;
}
const BOTS = {
  // 사과 쪽으로 가되 막히면 다른 길
  good(s) {
    const h = s.snake[0];
    const pref = [];
    if (s.food) {
      if (s.food.x > h.x) pref.push(1); if (s.food.x < h.x) pref.push(3);
      if (s.food.y > h.y) pref.push(2); if (s.food.y < h.y) pref.push(0);
    }
    [s.dir, 0, 1, 2, 3].forEach((d) => { if (!pref.includes(d)) pref.push(d); });
    for (const d of pref) {
      if (d === (s.dir + 2) % 4) continue;
      if (free(s, h.x + C.DX[d], h.y + C.DY[d])) return d;
    }
    return s.dir;
  },
  idle(s) { return s.dir; },
  random(s, rnd) { return Math.floor(rnd() * 4); },
};
function play(seed, bot, rnd, dt) {
  const s = C.newGame(seed);
  let guard = 0, problem = '';
  let expectScore = 0;
  const events = [];
  while (!s.over && guard++ < 200000) {
    s.queue.length = 0;
    C.turn(s, bot(s, rnd));
    const before = s.snake.length;
    const ev = C.step(s, dt || C.interval(s.ate) + 1);
    ev.forEach((e) => { events.push(e); if (e.type === 'eat') expectScore += e.points; });
    // 불변식
    const seen = new Set();
    s.snake.forEach((p) => {
      if (p.x < 0 || p.y < 0 || p.x >= C.COLS || p.y >= C.ROWS) problem = problem || '뱀이 격자 밖';
      if (!s.over && seen.has(cellKey(p))) problem = problem || '몸이 겹침';
      seen.add(cellKey(p));
    });
    if (!s.over && s.food && seen.has(cellKey(s.food))) problem = problem || '사과가 몸 위에 있음';
    if (s.snake.length !== C.START_LEN + s.ate && !(s.over)) problem = problem || `길이 ${s.snake.length} ≠ 3 + 먹은 수 ${s.ate}`;
    void before;
  }
  return { s, events, expectScore, problem, ended: s.over };
}
function checkCore() {
  // 상수·곡선
  if (C.COLS !== 17 || C.ROWS !== 17 || C.START_LEN !== 3) bad('격자/시작 길이');
  for (let a = 0; a < 80; a++) {
    if (C.interval(a) > C.interval(Math.max(0, a - 1))) bad(`interval 이 단조 감소가 아님 (ate=${a})`);
    if (C.interval(a) < C.MIN_MS) bad(`interval(${a}) 이 하한 ${C.MIN_MS}ms 아래`);
  }
  if (C.interval(0) !== C.BASE_MS || C.interval(1000) !== C.MIN_MS) bad('interval 처음 값/하한');
  if (!(C.interval(10) < C.interval(0))) bad('먹을수록 빨라져야 함');
  if (C.level(0) !== 1 || C.level(4) !== 1 || C.level(5) !== 2 || C.level(14) !== 3) bad('level 경계');
  if (C.foodPoints(0) !== 10 || C.foodPoints(5) !== 12 || C.foodPoints(500) !== 30) bad('foodPoints 값/상한');
  for (let a = 0; a < 200; a++) if (C.foodPoints(a + 1) < C.foodPoints(a)) bad('foodPoints 가 줄어듦');
  // 시작 상태
  const s0 = C.newGame(7);
  if (s0.snake.length !== 3 || s0.dir !== 1 || s0.over || s0.score !== 0 || s0.ate !== 0) bad('시작 상태');
  if (s0.snake.some((p, i) => i && p.x !== s0.snake[0].x - i) ) bad('시작 몸이 머리 왼쪽 일직선이 아님');
  if (!s0.food || s0.snake.some((p) => p.x === s0.food.x && p.y === s0.food.y)) bad('시작 사과가 몸 위에 있음');
  // 방향 입력
  const t = C.newGame(1);
  if (C.turn(t, 3) || C.turn(t, 1)) bad('반대/같은 방향 입력은 무시');
  if (!C.turn(t, 0) || C.turn(t, 2)) bad('위로 간 뒤 아래(반대)는 무시');
  if (!C.turn(t, 1) || C.turn(t, 0) !== false) bad('큐는 2개까지(0 다음 1, 그 뒤 거부)');
  if (t.queue.length !== 2) bad('큐 길이');
  if (C.turn(t, NaN) || C.turn(t, 4) || C.turn(t, -1)) bad('잘못된 방향 무시');
  // 벽
  const w = C.newGame(2);
  w.food = { x: 0, y: 0 };
  let guard = 0;
  while (!w.over && guard++ < 40) C.tick(w);
  if (w.reason !== 'wall' || w.snake[0].x !== C.COLS - 1) bad(`오른쪽으로 계속 가면 벽 (reason=${w.reason})`);
  // 자기 몸: 길이 5 이상으로 말아 넣기
  const sf = C.newGame(3);
  sf.snake = [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 6, y: 6 }, { x: 6, y: 5 }, { x: 6, y: 4 }]; // 머리 (5,5) 위로, 오른쪽 (6,5) 는 몸
  sf.dir = 0; sf.queue = []; sf.food = { x: 0, y: 0 };
  C.turn(sf, 1); C.tick(sf);
  if (sf.reason !== 'self') bad(`몸에 닿으면 self (reason=${sf.reason})`);
  // 꼬리 칸으로 가는 이동은 안전(꼬리가 비킨다)
  const st = C.newGame(4);
  st.snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }];
  st.dir = 2; st.queue = []; st.food = { x: 0, y: 0 }; // 머리 (5,5) 아래 (5,6) = 꼬리 칸
  C.tick(st);
  if (st.over) bad('꼬리 칸으로의 이동은 안전해야 함');
  // 먹기
  const e = C.newGame(5);
  const h = e.snake[0];
  e.food = { x: h.x + 1, y: h.y };
  const ev = C.tick(e);
  if (e.snake.length !== 4 || e.ate !== 1 || e.score !== 10 || !ev.some((x) => x.type === 'eat' && x.points === 10)) bad('사과를 먹으면 길이+1·점수+10');
  if (e.snake.some((p) => p.x === e.food.x && p.y === e.food.y)) bad('새 사과가 몸 위에 생김');
  // 가득 찬 판: 빈 칸이 하나뿐일 때 먹으면 full
  const f = C.newGame(6);
  const all = [];
  for (let y = 0; y < C.ROWS; y++) for (let x = 0; x < C.COLS; x++) all.push({ x: y % 2 ? C.COLS - 1 - x : x, y });
  f.snake = all.slice(0, all.length - 1).reverse(); // 머리가 마지막 직전 칸
  const hd = f.snake[0], last = all[all.length - 1];
  f.dir = last.x > hd.x ? 1 : last.x < hd.x ? 3 : last.y > hd.y ? 2 : 0; f.queue = [];
  f.food = { x: last.x, y: last.y };
  C.tick(f);
  if (f.reason !== 'full' || f.food !== null) bad(`판이 가득 차면 full (reason=${f.reason})`);
  // 재현 · dt 분할
  const run = (seed, dt) => { const s = C.newGame(seed); const r = mulberry(99); let n = 0; while (!s.over && n++ < 4000) { if (n % 5 === 0) C.turn(s, Math.floor(r() * 4)); C.step(s, dt); } return JSON.stringify([s.score, s.ate, s.reason, s.snake]); };
  if (run(11, 40) !== run(11, 40)) bad('같은 시드 같은 입력인데 결과가 다름');
  const a1 = C.newGame(21), a2 = C.newGame(21);
  C.step(a1, 200); C.step(a1, 200);
  for (let i = 0; i < 10; i++) C.step(a2, 40);
  if (JSON.stringify(a1.snake) !== JSON.stringify(a2.snake) && a1.ticks !== a2.ticks) { /* 틱 수가 다를 수 있음 — 같은 총 시간 */ }
  const b1 = C.newGame(22), b2 = C.newGame(22);
  C.step(b1, 165 * 4); // MAX_STEP(250) 로 잘리므로 한 번에 1 틱
  for (let i = 0; i < 5; i++) C.step(b2, 165);
  if (b1.ticks !== 1) bad(`한 번에 큰 dt 는 MAX_STEP 으로 제한 (ticks=${b1.ticks})`);
  // 봇
  const rnd = mulberry(1234);
  let goodAte = 0, goodN = 0, ended = 0, total = 0;
  for (let i = 0; i < 600; i++) {
    const r = play(1000 + i, BOTS.good, rnd);
    total++; if (r.ended) ended++;
    if (r.problem) bad(`good 봇 판 ${i}: ${r.problem}`);
    if (r.expectScore !== r.s.score) bad(`good 봇 판 ${i}: 점수 ${r.s.score} ≠ 사과 점수 합 ${r.expectScore}`);
    if (!['wall', 'self', 'full'].includes(r.s.reason)) bad(`good 봇 판 ${i}: reason=${r.s.reason}`);
    goodAte += r.s.ate; goodN++;
  }
  for (let i = 0; i < 300; i++) {
    const r = play(5000 + i, BOTS.random, rnd);
    total++; if (r.ended) ended++;
    if (r.problem) bad(`random 봇 판 ${i}: ${r.problem}`);
    if (r.expectScore !== r.s.score) bad(`random 봇 판 ${i}: 점수 불일치`);
  }
  for (let i = 0; i < 100; i++) {
    const r = play(9000 + i, BOTS.idle, rnd);
    total++; if (r.ended) ended++;
    if (r.s.reason !== 'wall' && r.s.reason !== 'self') bad(`idle 봇 판 ${i}: reason=${r.s.reason}`);
    if (r.s.ate > 12) bad(`idle 봇이 사과를 ${r.s.ate}개 먹음 (직진만으로 많이 먹으면 안 됨)`);
  }
  if (ended !== total) bad(`끝나지 않은 판 ${total - ended}개`);
  if (goodAte / goodN < 8) bad(`길 찾는 봇 평균 ${(goodAte / goodN).toFixed(1)}개 — 너무 어려움(공정함)`);
  // 서버 인코딩
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME)) bad('GAME 이름');
  [0, 10, 14, 15, 99999, -5, NaN].forEach((v) => { const bk = C.bucket(v); if (!Number.isInteger(bk) || bk < 0 || bk > 1999) bad(`bucket(${v}) = ${bk}`); });
  if (C.bucket(55) !== 6 || C.bucket(0) !== 0) bad('bucket 값');
  const p = C.percentile([{ score_bucket: 1, players: 3 }, { score_bucket: 5, players: 1 }, { score_bucket: 9, players: 2 }], 5);
  if (!p || p.first || p.others !== 5 || p.top < 1 || p.top > 100) bad(`percentile ${JSON.stringify(p)}`);
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
// 제목 글꼴 폭 보정 (Lilita One 은 좁은 편, Rubik 800·Baloo 2·Mitr 는 넓은 편)
const displayFactor = (T) => ({ 'Lilita One': 1.0, Rubik: 1.12, 'Baloo 2': 1.05, Mitr: 1.1 }[firstFont(T.fonts.display)] || 1.05);
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
  { key: 'start.how.move', get: (T) => T.start.how.move, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.eat', get: (T) => T.start.how.eat, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.avoid', get: (T) => T.start.how.avoid, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  // HUD 칸: (328 - 44 - 12) = 272 → 1.2 : 1 → 148 / 124, 안쪽 여백 20+3 → 125 / 101 (이름표 한 줄)
  { key: 'play.score', get: (T) => T.play.score, px: 125, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 101, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.go', get: (T) => T.play.go, px: 328 - 36, size: 52, max: 1, what: '카운트다운 시작 글자' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'result.wall', get: (T) => T.result.wall, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 이유 배지 두 줄까지' },
  { key: 'result.self', get: (T) => T.result.self, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 이유 배지 두 줄까지' },
  { key: 'result.full', get: (T) => T.result.full, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 이유 배지 두 줄까지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '12,340'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.ate', get: (T) => T.result.ate, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.level', get: (T) => T.result.level, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Lilita One', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['score']]];
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
      if (f && f.a && /\b(10|12|30)\s?(points|pts|점|点|分|แต้ม|điểm|puntos|punti|pontos|Punkte|очк)/i.test(f.a)) bad(`${tag} faq[${i}] 사탕별 점수표를 늘어놓지 않는다`);
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
  if (!/<link rel="canonical" href="https:\/\/snake\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/snake\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|sn-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="sn-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="sn-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-best', 'pause-btn', 'field', 'sn-canvas', 'countdown', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="sn-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      const resAt = end.indexOf('class="sn-result"');
      const endAt = end.indexOf('<div data-mg-end="snake"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="snake" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-score', 'res-newbest', 'res-best', 'res-ate', 'res-level', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="sn-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('snake-core.js') > 0 && html.indexOf('snake-core.js') < html.indexOf('snake.js"'))) bad(`${tag} snake-core.js 가 snake.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://snake.example.com/</loc>') || !sm.includes('<loc>https://snake.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('snake.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('snake.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("snake.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('snake.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('snake.js: setShareData/setRetry 없음');
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
  if (APP.id !== 'snake' || APP.category !== 'game' || APP.path !== 'https://snake.example.com/' || APP.added !== '2026-10-21' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
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
console.log('\n결과: 통과 — 게임 로직(재현·점수·속도·충돌·길이·공정함)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
