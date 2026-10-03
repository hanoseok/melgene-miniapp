#!/usr/bin/env node
/**
 * 2048 게임 검사.
 *   1) 로직(game2048-core.js): 새 판 타일 2개(2/4), 밀기 규칙(한 줄 합치기 [2,2,2,2]→[4,4], [4,4,8]→[8,8], [2,2,4]→[4,4] 한 번만),
 *      안 움직이면 null·상태 그대로, 움직이면 새 타일 1개, 점수 = 합친 값 합, 같은 시드 + 같은 입력 = 같은 판,
 *      2048 만들면 justWon 한 번, 꽉 차고 같은 이웃 없으면 over, 애니메이션 정보(slides·merged·removed·spawn)가 판과 맞음,
 *      봇 판(무작위·모서리 전략): 언제나 끝남, 타일 수·합 불변식, 모서리 전략이 무작위보다 점수가 높음(실력이 통함).
 *      서버 인코딩: game 이름 = 앱 id, bucket 0..1999 정수, percentile(높을수록 좋음)·잘못된 행 무시·실패 null·혼자면 first.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자,
 *      FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순/랭킹 류 금지), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원),
 *      제목(= app.config 제목·h1 검색어 "2048" 포함)·설명 길이, h1 모양, fr 좁은 공백, ru «ты», 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="game2048" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 /
 *      숨은 변형 noindex / 공통 컴포넌트 클래스(mg-end 등)와 겹치는 클래스 없음 / 앱 JS: track start·done 한 곳씩, 언어별 주소 없음, 한글 문구 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-game2048.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'game2048-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const values = (s) => s.grid.map((t) => (t ? t.v : 0));
// 판을 직접 만든다 (rows: 4×4 숫자, 0 = 빈 칸)
function board(rows, seed = 1) {
  const s = C.newGame(seed);
  s.nextId = 1;
  s.grid = rows.flat().map((v) => (v ? { id: s.nextId++, v } : null));
  s.maxTile = Math.max(...rows.flat());
  s.score = 0; s.moves = 0; s.won = s.maxTile >= C.GOAL; s.over = false;
  return s;
}
const sum = (s) => values(s).reduce((a, b) => a + b, 0);
const count = (s) => values(s).filter(Boolean).length;

function playBot(seed, kind, rnd) {
  const s = C.newGame(seed);
  let n = 0;
  while (!s.over && n < 20000) {
    const order = kind === 'corner' ? ['down', 'left', 'right', 'up'] : C.DIRS.slice().sort(() => rnd() - 0.5);
    const before = sum(s), cnt = count(s), score = s.score;
    let res = null;
    for (const d of order) { res = C.move(s, d); if (res) break; }
    if (!res) { bad(`봇: over 가 아닌데 어느 쪽으로도 안 움직임 (seed ${seed})`); break; }
    const spawnV = res.spawn ? res.spawn.v : 0;
    if (sum(s) !== before + spawnV) bad(`타일 합 불변식 깨짐 (seed ${seed}, ${n}수)`);
    if (count(s) !== cnt - res.merged.length + (res.spawn ? 1 : 0)) bad(`타일 수 불변식 깨짐 (seed ${seed})`);
    if (s.score !== score + res.merged.reduce((a, m) => a + m.v, 0) || res.gained !== s.score - score) bad(`점수 = 합친 값 합이 아님 (seed ${seed})`);
    if (res.removed.length !== res.merged.length * 2) bad('removed = merged × 2 아님');
    const ids = new Set(C.tiles(s).map((t) => t.id));
    res.merged.forEach((m) => { if (!ids.has(m.id)) bad('merged 타일이 판에 없음'); });
    res.removed.forEach((id) => { if (ids.has(id)) bad('removed 타일이 판에 남음'); });
    if (res.spawn && !ids.has(res.spawn.id)) bad('spawn 타일이 판에 없음');
    // slides 의 도착 칸 = 판의 실제 칸(살아남은 타일)
    const where = Object.fromEntries(C.tiles(s).map((t) => [t.id, t.r * 4 + t.c]));
    res.slides.forEach((sl) => { if (ids.has(sl.id) && where[sl.id] !== sl.r * 4 + sl.c) bad('slide 도착 칸이 판과 다름'); });
    n++;
    if (problems.length > 20) break;
  }
  if (!s.over) bad(`봇 판이 끝나지 않음 (seed ${seed})`);
  if (C.canMove(s)) bad('over 인데 canMove');
  return s;
}

function checkCore() {
  if (C.SIZE !== 4 || C.GOAL !== 2048) bad('SIZE 4 · GOAL 2048');
  // 새 판
  for (let seed = 1; seed <= 50; seed++) {
    const s = C.newGame(seed);
    const v = values(s).filter(Boolean);
    if (v.length !== 2 || v.some((x) => x !== 2 && x !== 4)) bad(`새 판 타일 ${v}`);
  }
  // 한 줄 합치기 규칙 (left)
  const cases = [
    [[2, 2, 2, 2], [4, 4, 0, 0], 8],
    [[4, 4, 8, 0], [8, 8, 0, 0], 8],
    [[2, 2, 4, 0], [4, 4, 0, 0], 4],
    [[0, 2, 0, 2], [4, 0, 0, 0], 4],
    [[2, 4, 2, 4], null, 0],
    [[8, 0, 0, 8], [16, 0, 0, 0], 16],
    [[1024, 1024, 0, 0], [2048, 0, 0, 0], 2048],
  ];
  cases.forEach(([row, want, gain]) => {
    const rows = [row, [16, 32, 16, 32], [32, 16, 32, 16], [16, 32, 16, 32]];
    const s = board(rows);
    const before = JSON.stringify(values(s));
    const res = C.move(s, 'left');
    if (!want) {
      if (res !== null || JSON.stringify(values(s)) !== before) bad(`[${row}] left: 안 움직이면 null·그대로`);
      return;
    }
    if (!res) return bad(`[${row}] left: 움직여야 함`);
    const got = values(s).slice(0, 4);
    // 새 타일이 첫 줄 빈 칸에 생겼을 수 있으니 그 칸만 빼고 비교
    const sp = res.spawn && res.spawn.r === 0 ? res.spawn.c : -1;
    const ok = want.every((v, i) => (i === sp ? v === 0 : got[i] === v));
    if (!ok) bad(`[${row}] left → [${got}] ≠ [${want}]`);
    if (res.gained !== gain || s.score !== gain) bad(`[${row}] 점수 ${res.gained} ≠ ${gain}`);
    if (!res.spawn) bad(`[${row}] 움직였는데 새 타일 없음`);
    if (row[0] === 1024 && !res.justWon) bad('2048 만들면 justWon');
  });
  // 방향 4개 (같은 판을 각 방향으로)
  const dirCase = [[2, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 0]];
  const wantFirst = { left: [0, 4], right: [3, 4], up: [0, 4], down: [12, 4] };
  Object.entries(wantFirst).forEach(([dir, [cell, v]]) => {
    const s = board(dirCase);
    const res = C.move(s, dir);
    if (!res || values(s)[cell] !== v) bad(`${dir}: 칸 ${cell} 에 ${v} 가 있어야 함 (${values(s)})`);
  });
  // justWon 은 한 번만
  const w = board([[1024, 1024, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);
  w.won = false;
  const r1 = C.move(w, 'left');
  if (!r1 || !r1.justWon || !w.won) bad('2048 → justWon');
  w.grid[15] = { id: 999, v: 1024 }; w.grid[14] = { id: 998, v: 1024 };
  const r2 = C.move(w, 'right');
  if (r2 && r2.justWon) bad('justWon 이 두 번 나옴');
  // over
  const o = board([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 0]]);
  const ro = C.move(o, 'right');
  if (!ro) bad('over 판 마지막 한 수가 안 움직임');
  else if (C.canMove(o) !== !o.over) bad('over 와 canMove 가 어긋남');
  const full = board([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]);
  if (C.canMove(full)) bad('꽉 차고 같은 이웃 없음 → canMove false');
  if (!C.canMove(board([[2, 2, 4, 8], [4, 8, 16, 32], [8, 16, 32, 64], [16, 32, 64, 128]]))) bad('같은 이웃이 있으면 canMove');
  if (C.move(board([[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]]), 'sideways') !== null) bad('모르는 방향은 null');

  // 재현
  const runA = playBot(777, 'random', mulberry(3));
  const runB = playBot(777, 'random', mulberry(3));
  if (JSON.stringify(runA) !== JSON.stringify(runB)) bad('같은 시드 + 같은 입력인데 결과가 다름');
  // 새 타일 2:4 비율
  let twos = 0, fours = 0;
  for (let seed = 1; seed <= 400; seed++) values(C.newGame(seed)).forEach((v) => { if (v === 2) twos++; else if (v === 4) fours++; });
  const ratio = fours / (twos + fours);
  if (ratio < 0.05 || ratio > 0.16) bad(`새 타일 4 비율 ${ratio.toFixed(3)} (약 0.1)`);

  // 봇 판
  const stats = { random: { games: 0, score: 0, max: 0, tile: 0 }, corner: { games: 0, score: 0, max: 0, tile: 0 } };
  for (let i = 0; i < 30; i++) {
    ['random', 'corner'].forEach((kind) => {
      const s = playBot(1000 + i, kind, mulberry(50 + i));
      const t = stats[kind];
      t.games++; t.score += s.score; t.max = Math.max(t.max, s.score); t.tile = Math.max(t.tile, s.maxTile);
    });
  }
  const avg = (t) => Math.round(t.score / t.games);
  if (!(avg(stats.corner) > avg(stats.random) * 1.3)) bad(`모서리 전략(${avg(stats.corner)})이 무작위(${avg(stats.random)})보다 충분히 높지 않음 — 실력이 안 통함`);

  // 서버 인코딩 · 백분위
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME) || C.GAME !== APP.id) bad(`GAME 이름 ${C.GAME}`);
  [[0, 0], [9, 0], [10, 1], [20, 1], [12340, 617], [39980, 1999], [1e9, 1999], [-50, 0], [NaN, 0], ['x', 0]].forEach(([sc, want]) => {
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

  const n = (t) => `${avg(t)}점(최고 ${t.max}, 최대 타일 ${t.tile})`;
  console.log(`\n=== 로직: 봇 ${stats.random.games + stats.corner.games}판 — 모서리 전략 ${n(stats.corner)} · 무작위 ${n(stats.random)} ===`);
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
// 360px 폭(본문 칸 328px) 예산. HUD 칸 = (328 − 8) / 2 = 160, 안쪽 여백 23 → 137
const STAT = (328 - 32 - 8) / 2 - 15;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지' },
  { key: 'start.how.swipe', get: (T) => T.start.how.swipe, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.match', get: (T) => T.start.how.match, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.goal', get: (T) => T.start.how.goal, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'play.score', get: (T) => T.play.score, px: 137, size: 12, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 137, size: 12, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.won', get: (T) => T.play.won, px: 328 - 6 - 32 - 42, size: 30, max: 2, what: '2048 달성 글자 두 줄까지' },
  { key: 'play.over', get: (T) => T.play.over, px: 328 - 6 - 32 - 42, size: 30, max: 2, what: '끝 글자 두 줄까지' },
  { key: 'play.keepGoing', get: (T) => T.play.keepGoing, px: 240 - 46, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'play.finish', get: (T) => T.play.finish, px: 240 - 46, size: 18, max: 1, what: '끝내기 버튼' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 1, what: '끝 이유 배지' },
  { key: 'result.won', get: (T) => T.result.won, px: 328 - 32 - 32, size: 16, max: 1, what: '끝 이유 배지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '12,340'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.biggest', get: (T) => T.result.biggest, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.moves', get: (T) => T.result.moves, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 32 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 32 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 32 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 32 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
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
    if (lang === 'ru' && /(^|[^а-яё])(вы|вас|вам|ваш)([^а-яё]|$)/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>2048<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em>2048</em> 강조만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : ['ru', 'vi'].includes(lang) ? 31 : 34;
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const n = lines(T, lang, txt, h1Size, 328);
      if (n > 1) (isWideLang(lang) ? warn : bad)(`${tag} h1 한 줄 "${txt}" 이 360px 에서 ${n}줄`);
    });
    // 제목·설명 (seo.md) — 검색어 "2048" 은 모든 언어에
    const tl = visLen(T.meta.title);
    const wide = isWideLang(lang) && lang !== 'ko';
    if (wide ? tl > 34 : tl > 56) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 34' : '라틴·키릴·한글 56'}자 이하)`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    const low = (x) => String(x || '').toLowerCase();
    if (!low(T.meta.title).startsWith(low(APP.title[lang]))) bad(`${tag} meta.title 이 app.config 제목 "${APP.title[lang]}" 으로 시작하지 않음`);
    if (low(T.start.h1Kicker) !== low(APP.title[lang])) bad(`${tag} h1Kicker 는 app.config 제목 그대로`);
    if (!low(T.siteName).includes(low(APP.title[lang]))) bad(`${tag} siteName 에 app.config 제목이 없음`);
    [T.meta.title, T.meta.description, T.meta.ogTitle, APP.title[lang], APP.desc[lang]].forEach((v) => { if (!String(v).includes('2048')) bad(`${tag} 검색어 2048 이 없음: ${v}`); });
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
  if (!/<link rel="canonical" href="https:\/\/game2048\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/game2048\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      ['hud-score', 'hud-best', 'board', 'tiles', 'won-overlay', 'keep-btn', 'finish-btn', 'over-overlay'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if ((playS.match(/class="tf-cell"/g) || []).length !== 16) bad(`${tag} 판 칸은 16개`);
      if (!/<div id="won-overlay"[^>]*hidden/.test(playS) || !/<div id="over-overlay"[^>]*hidden/.test(playS)) bad(`${tag} 오버레이는 처음에 hidden`);
      const resAt = end.indexOf('class="tf-result"');
      const endAt = end.indexOf('<div data-mg-end="game2048"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="game2048" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-score', 'res-newbest', 'res-best', 'res-biggest', 'res-moves', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="tf-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('game2048-core.js') > 0 && html.indexOf('game2048-core.js') < html.indexOf('game2048.js"'))) bad(`${tag} game2048-core.js 가 game2048.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://game2048.example.com/</loc>') || !sm.includes('<loc>https://game2048.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('game2048.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('game2048.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("game2048.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('game2048.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('game2048.js: setShareData/setRetry 없음');
  if (!/ArrowLeft/.test(js) || !/pointerdown/.test(js) || !/pointerup/.test(js)) bad('game2048.js: 방향키·스와이프 입력 없음');
  if (!/localStorage/.test(js)) bad('game2048.js: 최고 기록(localStorage) 없음');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('game2048.js 코드에 한글 문구');
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
  if (APP.id !== 'game2048' || APP.category !== 'game' || APP.path !== 'https://game2048.example.com/' || APP.added !== '2026-10-04' || APP.order !== 1 || APP.emoji !== '🔢') bad('app.config.js id/category/path/added/order/emoji');
  if (path.basename(SITE) !== APP.id || !/^[a-z0-9-]{1,32}$/.test(APP.id)) bad('app.config.js id ≠ 폴더 이름');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
  });
  if (!fs.lstatSync(path.join(SITE, 'shared')).isSymbolicLink() || fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 는 ../../shared 심볼릭 링크');
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
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
console.log('\n결과: 통과 — 게임 로직(밀기·합치기·점수·2048·끝 조건·재현·실력)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
