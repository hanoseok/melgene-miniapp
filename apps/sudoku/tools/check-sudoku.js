#!/usr/bin/env node
/**
 * 스도쿠 검사.
 *   1) 로직(sudoku-core.js): 칸·묶음 표(81칸·27묶음·이웃 20), 풀이기(알려진 퍼즐 풀기·빈 판은 해 2개 이상·충돌 판은 0),
 *      생성기 — 난이도마다 50판: 정답이 규칙에 맞고 단서가 정답과 같고 해가 딱 하나(countSolutions = 1)·단서 수 범위·채점 단계 상한(쉬움 = 싱글만),
 *      어려움/전문가는 대부분 2·3단계 이상, 생성 시간(평균·최대), 같은 시드 = 같은 퍼즐(오늘의 퍼즐 = UTC 날짜 + 난이도), 다른 날·난이도 = 다른 퍼즐,
 *      채점기(완성판 1, 빈 판 4), 힌트 칸 고르기(고른 칸 → 틀린 칸 → 싱글), 충돌·숫자 개수·문자열 변환, 서버 인코딩(bucket·백분위).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개, 글꼴, 제목·설명 길이, 360px 폭 예산 등.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd / FAQPage 없음 / Supabase 값 없음 /
 *      시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음·난이도 4개·이어 하기(처음엔 숨김)·오늘의 퍼즐 / 게임 화면에 mg-ad 없음·숫자 패드 9개·도구 5개 /
 *      끝 화면: 결과 카드 → data-mg-end="sudoku" 순서 / 퍼즐·정답이 HTML 에 없음 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 /
 *      앱 JS: track start·done 한 곳씩, 일시정지(visibilitychange), 자동 저장(localStorage), 힌트 없는 판만 점수 전송, 언어별 주소 없음, 한글 문구 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크, tools/hub-curation.json(12개 언어·2줄 길이).
 *
 * 실행: node tools/check-sudoku.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'sudoku-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const PUZ = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
const SOL = '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
const arr = (s) => s.split('').map(Number);
function validSolution(sol) {
  if (!Array.isArray(sol) || sol.length !== 81 || sol.some((v) => !(v >= 1 && v <= 9))) return false;
  return C.UNITS.every((u) => new Set(u.map((i) => sol[i])).size === 9);
}
const RANGE = { easy: [34, 42], medium: [28, 36], hard: [22, 34], expert: [17, 32] };

function checkCore() {
  if (C.UNITS.length !== 27 || C.UNITS.some((u) => u.length !== 9)) bad('묶음은 27개 × 9칸');
  if (C.PEERS.length !== 81 || C.PEERS.some((p) => p.length !== 20)) bad('칸마다 이웃 20칸');
  // 풀이기
  const s = C.solve(arr(PUZ));
  if (!s || s.join('') !== SOL) bad('알려진 퍼즐을 풀지 못함');
  if (C.countSolutions(arr(PUZ), 2) !== 1) bad('알려진 퍼즐의 해는 1개');
  if (C.countSolutions(new Array(81).fill(0), 2) !== 2) bad('빈 판의 해는 limit(2) 까지 셈');
  const clash = arr(PUZ); clash[2] = 5;
  if (C.countSolutions(clash, 2) !== 0) bad('규칙 충돌 판은 해 0');
  if (C.grade(arr(SOL)) !== 1) bad('완성판 채점 = 1');
  if (C.grade(new Array(81).fill(0)) !== 4) bad('빈 판은 기법으로 못 풂(4)');
  if (C.grade(arr(PUZ)) > 2) bad('쉬운 고전 퍼즐이 3단계 이상으로 채점됨');
  // 생성기: 난이도마다 50판
  const stats = {};
  C.DIFF_ORDER.forEach((d) => {
    const spec = C.DIFFS[d];
    if (!spec || !/^sudoku-[a-z]$/.test(spec.game)) bad(`난이도 ${d} game 이름`);
    let tot = 0, max = 0, lvMin = 9, lvHi = 0, cMin = 81, cMax = 0;
    for (let n = 1; n <= 50; n++) {
      const seed = n * 104729 + d.length;
      const t0 = process.hrtime.bigint();
      const p = C.generate(d, seed);
      const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      tot += ms; max = Math.max(max, ms);
      const tag = `[${d} #${n}]`;
      if (p.diff !== d || p.seed !== seed >>> 0) bad(`${tag} diff/seed 가 다름`);
      if (!validSolution(p.solution)) { bad(`${tag} 정답이 규칙에 맞지 않음`); continue; }
      if (p.puzzle.some((v, i) => v && v !== p.solution[i])) bad(`${tag} 단서가 정답과 다름`);
      const clues = p.puzzle.filter(Boolean).length;
      if (clues !== p.clues) bad(`${tag} clues 카운터 ${p.clues} ≠ ${clues}`);
      if (C.countSolutions(p.puzzle, 2) !== 1) bad(`${tag} 해가 하나가 아님`);
      const solved = C.solve(p.puzzle);
      if (!solved || solved.join('') !== p.solution.join('')) bad(`${tag} 풀이기 답 ≠ 정답`);
      for (let i = 0; i < 81; i++) if (p.puzzle[i] !== p.puzzle[80 - i] && (!p.puzzle[i] || !p.puzzle[80 - i])) { bad(`${tag} 180° 대칭이 아님`); break; }
      const lv = C.grade(p.puzzle, 3);
      if (lv !== p.level) bad(`${tag} level ${p.level} ≠ grade ${lv}`);
      if (spec.maxLevel < 4 && lv > spec.maxLevel) bad(`${tag} 채점 ${lv}단계 > 상한 ${spec.maxLevel}`);
      if (clues < RANGE[d][0] || clues > RANGE[d][1]) bad(`${tag} 단서 ${clues}개 (범위 ${RANGE[d].join('~')})`);
      lvMin = Math.min(lvMin, lv); lvHi += lv >= spec.minLevel ? 1 : 0;
      cMin = Math.min(cMin, clues); cMax = Math.max(cMax, clues);
    }
    stats[d] = { avg: tot / 50, max, lvHi, cMin, cMax };
    if (d === 'easy' && lvMin !== 1) bad('쉬움에 싱글만으로 안 풀리는 판');
    if (d === 'hard' && lvHi < 30) bad(`어려움 50판 중 2단계 이상 ${lvHi}판뿐`);
    if (d === 'expert' && lvHi < 35) bad(`전문가 50판 중 3단계 이상 ${lvHi}판뿐`);
    if (max > 150) bad(`${d} 생성 최대 ${max.toFixed(1)}ms (Node 150ms 이하 — 모바일 300ms 예산)`);
    else if (tot / 50 > 40) warn(`${d} 생성 평균 ${(tot / 50).toFixed(1)}ms`);
  });
  if (stats.easy.cMin <= stats.expert.cMin) bad('쉬움의 단서가 전문가보다 많아야 함');
  // 결정성 · 오늘의 퍼즐
  const a = C.generate('hard', 42), b = C.generate('hard', 42), c = C.generate('hard', 43);
  if (C.toStr(a.puzzle) !== C.toStr(b.puzzle)) bad('같은 시드인데 다른 퍼즐');
  if (C.toStr(a.puzzle) === C.toStr(c.puzzle)) bad('다른 시드인데 같은 퍼즐');
  const day = '2026-10-12';
  if (C.dailySeed(day, 'easy') !== C.dailySeed(day, 'easy')) bad('오늘의 시드가 매번 다름');
  if (C.dailySeed(day, 'easy') === C.dailySeed('2026-10-13', 'easy') || C.dailySeed(day, 'easy') === C.dailySeed(day, 'medium')) bad('날짜·난이도가 다르면 시드도 달라야 함');
  if (C.toStr(C.generate('medium', C.dailySeed(day, 'medium')).puzzle) !== C.toStr(C.generate('medium', C.dailySeed(day, 'medium')).puzzle)) bad('오늘의 퍼즐이 같은 날 다르게 나옴');
  if (C.utcDate(new Date(Date.UTC(2026, 9, 12, 23, 59))) !== '2026-10-12') bad('utcDate 는 UTC 날짜');
  // 힌트 칸 고르기
  const v = arr(PUZ), sol = arr(SOL);
  const empty = v.indexOf(0);
  if (C.hintCell(v, sol, arr(PUZ), empty) !== empty) bad('hintCell: 고른 빈칸 우선');
  const w = v.slice(); const wi = v.indexOf(0, 10); w[wi] = sol[wi] % 9 + 1;
  if (C.hintCell(w, sol, arr(PUZ), 0) !== wi) bad('hintCell: 고른 칸이 주어진 칸이면 틀린 칸');
  const hi = C.hintCell(v, sol, arr(PUZ), -1);
  if (hi < 0 || v[hi] || C.candidates(v, hi) === 0) bad('hintCell: 빈칸을 골라야 함');
  if (C.hintCell(sol.slice(), sol, arr(PUZ), -1) !== -1) bad('hintCell: 다 푼 판은 -1');
  // 충돌·개수·문자열
  const cf = arr(PUZ); cf[2] = 5;
  if (C.conflicts(cf).sort().join() !== [0, 2].join()) bad('conflicts: 같은 줄 같은 숫자');
  if (C.conflicts(arr(SOL)).length) bad('conflicts: 완성판은 충돌 0');
  if (C.digitCounts(arr(SOL)).slice(1).some((n) => n !== 9)) bad('digitCounts');
  if (C.toStr(C.fromStr(PUZ)) !== PUZ || C.fromStr('12') !== null || C.fromStr(null) !== null) bad('toStr/fromStr');
  if (!C.isSolved(arr(SOL), arr(SOL)) || C.isSolved(arr(PUZ), arr(SOL))) bad('isSolved');
  // 서버 인코딩: bucket 0..1999 정수, 빠를수록 큼
  if (C.bucket(0) !== C.MAX_BUCKET || C.bucket(60) <= C.bucket(600) || C.bucket(1e9) !== 0) bad('bucket: 빠를수록 큼·0..1999');
  [0, 4.9, 5, 333.3, 9995, 1e6, NaN, -3].forEach((t) => { const x = C.bucket(t); if (!Number.isInteger(x) || x < 0 || x > C.MAX_BUCKET) bad(`bucket(${t}) = ${x} 범위 밖`); });
  if (C.bucket(4.9) !== C.bucket(0) || C.bucket(5) !== C.MAX_BUCKET - 1) bad('bucket: 5초 단위');
  const rows = [{ score_bucket: 1990, players: 5 }, { score_bucket: 1950, players: 20 }, { score_bucket: 1900, players: 10 }];
  const p = C.percentile(rows, 1950);
  if (!p || p.total !== 35 || p.first || p.top < 1 || p.top > 100) bad('percentile 계산');
  if (!C.percentile([{ score_bucket: 1950, players: 1 }], 1950).first) bad('percentile: 혼자면 first');
  if (C.percentile(null, 5) !== null || C.percentile('x', 5) !== null) bad('percentile: 잘못된 입력은 null');
  console.log('  생성(Node, 50판씩): ' + C.DIFF_ORDER.map((d) => `${d} 평균 ${stats[d].avg.toFixed(1)}ms·최대 ${stats[d].max.toFixed(1)}ms·단서 ${stats[d].cMin}~${stats[d].cMax}`).join(' / '));
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
// 제목 글꼴 폭 보정 (headless Chrome 360px 실측으로 맞춤: fr·es h1·ru 도구 이름이 실제로는 한 줄에 들어감)
const displayFactor = (T) => ({ Fraunces: 1.0, Lora: 1.0, 'Gowun Batang': 0.95, 'Shippori Mincho': 1.0, 'Noto Serif SC': 1.0, Trirong: 1.05 }[firstFont(T.fonts.display)] || 1.1);
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
const HOW = (328 - 16) / 3 - 12 - 3;           // 방법 칸 글자 폭
const DIFF = (328 - 8) / 2 - 16 - 4;            // 난이도 칸 글자 폭 (2칸)
const HUD = (328 - 12) / 3.4 - 12 - 3;          // HUD 좁은 칸 (1.4 : 1 : 1)
const TOOL = (328 - 8) / 5 - 2;                 // 도구 버튼 글자 폭 (5칸, 한 줄)
const STAT = (328 - 32 - 8) / 2 - 12 - 3;       // 결과 통계 칸
const TIER_PX = 328 - 32 - 4 - 48;              // 결과 머리 줄: 카드 안쪽 − 이모지·간격
const SANS = 1.0;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 40, size: 19, max: 1, what: '새 퍼즐 버튼 한 줄' },
  { key: 'start.resume', get: (T) => T.start.resume, px: 328 - 40, size: 19, max: 1, what: '이어 하기 버튼 한 줄' },
  { key: 'start.daily', get: (T) => T.start.daily, px: 328 - 40 - 26, size: 16, max: 1, what: '오늘의 퍼즐 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄', factor: SANS },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄', track: 0.02 },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지', factor: SANS },
  { key: 'start.diffLabel', get: (T) => T.start.diffLabel, px: 328, size: 13, max: 1, what: '난이도 안내 한 줄', factor: SANS },
  ...['pick', 'pad', 'notes'].map((k) => ({ key: `start.how.${k}`, get: (T) => T.start.how[k], px: HOW, size: 12.5, max: 3, what: '방법 칸 세 줄까지', word: HOW, factor: SANS })),
  ...C.DIFF_ORDER.map((k) => ({ key: `start.diffs.${k}`, get: (T) => T.start.diffs[k], px: DIFF, size: 15, max: 1, what: '난이도 이름 한 줄', word: DIFF })),
  ...['level', 'mistakes', 'time'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: HUD, size: 11, max: 1, what: 'HUD 이름표 한 줄', factor: SANS })),
  ...['undo', 'erase', 'notes', 'hint', 'check'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: TOOL, size: 11, max: 1, what: '도구 버튼 이름 한 줄(줄바꿈 없음)', word: TOOL, factor: 1.0 })),
  { key: 'play.paused', get: (T) => T.play.paused, px: 300, size: 20, max: 3, what: '일시정지 안내 세 줄까지' },
  { key: 'result.solved', get: (T) => T.result.solved, px: TIER_PX, size: 24, max: 2, what: '결과 머리 두 줄까지', word: TIER_PX },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 24, size: 15, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{t}', '12:34'), px: 328 - 32, size: 15, max: 1, what: '최고 기록 한 줄', factor: SANS },
  { key: 'result.mistakesLabel', get: (T) => T.result.mistakesLabel, px: STAT, size: 12.5, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT, factor: SANS },
  { key: 'result.hintsLabel', get: (T) => T.result.hintsLabel, px: STAT, size: 12.5, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT, factor: SANS },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 32 - 24, size: 28, max: 1, what: '상위 % 한 줄', factor: SANS },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 32 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 32 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 32 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Lora'];
const VIET_FONTS = ['Lora', 'Be Vietnam Pro'];
const LATIN_EXT_FONTS = ['Fraunces'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [
  ['start.resumeInfo', ['diff', 'time']],
  ['play.aEmpty', ['r', 'c']], ['play.aGiven', ['r', 'c', 'n']], ['play.aValue', ['r', 'c', 'n']], ['play.aNotes', ['r', 'c', 'list']], ['play.aKey', ['n', 'left']],
  ['result.best', ['t']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']],
  ['result.shareText', ['diff', 'time']], ['result.shareDaily', ['diff', 'time']],
];
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
        if (v.length > 12 && v === en[k] && /[a-z]{3}/i.test(v.replace(/\{\w+\}/g, ''))) bad(`${tag} ${k} 가 영어 그대로`);
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
    // 난이도 이름
    if (!T.start.diffs || C.DIFF_ORDER.some((k) => !T.start.diffs[k]) || new Set(Object.values(T.start.diffs)).size !== 4) bad(`${tag} start.diffs 는 서로 다른 이름 4개`);
    // 도구 이름은 서로 달라야 한다
    if (new Set(['undo', 'erase', 'notes', 'hint', 'check'].map((k) => T.play[k])).size !== 5) bad(`${tag} 도구 버튼 이름 5개가 서로 달라야 함`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
    });
    // FAQ 의 도구 이름은 실제 버튼 이름과 같아야 한다(헷갈리지 않게)
    const faqText = T.faq.map((f) => f.q + ' ' + f.a).join(' ');
    ['notes', 'hint', 'check'].forEach((k) => { if (!faqText.includes(T.play[k])) bad(`${tag} FAQ 에 버튼 이름 "${T.play[k]}" 이 그대로 없음`); });
    if (!faqText.includes(T.start.resume)) bad(`${tag} FAQ 에 "${T.start.resume}" 버튼 이름이 없음`);
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
    if (lang === 'th' && !['Trirong', 'Mitr', 'Kanit', 'Chakra Petch'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    if (lang === 'ru' && /(^|[^а-яё])(вы|вас|вам|ваш)([^а-яё]|$)/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || (h1.match(/<em>[^<]+<\/em>/g) || []).length !== 1 || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em>…</em> 강조 1개만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 30 : 31;
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
    if (!low(T.meta.ogTitle).includes(low(APP.title[lang]))) warn(`${tag} ogTitle 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    if (!low(T.meta.description).includes(low(APP.title[lang]))) bad(`${tag} meta.description 에 검색어 "${APP.title[lang]}" 이 없음`);
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
  if (!/<link rel="canonical" href="https:\/\/sudoku\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/sudoku\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|sd-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="sd-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="sd-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      ['start-btn', 'daily-btn', 'resume-btn', 'resume-info'].forEach((id) => { if (!start.includes(`id="${id}"`)) bad(`${tag} 시작 화면에 #${id} 없음`); });
      if (!/<button id="resume-btn"[^>]*hidden/.test(start)) bad(`${tag} 이어 하기 버튼은 처음에 hidden (저장본이 있을 때만 JS 가 보임)`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 560) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if ((start.match(/role="radio"/g) || []).length !== 4 || !/id="diffs"[^>]*role="radiogroup"/.test(start)) bad(`${tag} 시작 화면 난이도 라디오 4개`);
      C.DIFF_ORDER.forEach((k) => { if (!start.includes(`data-diff="${k}"`)) bad(`${tag} 난이도 ${k} 버튼 없음`); });
      ['hud-level', 'hud-mistakes', 'hud-time', 'field', 'board', 'pause-btn', 'pad', 'undo-btn', 'erase-btn', 'notes-btn', 'hint-btn', 'hint-left', 'check-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if ((playS.match(/class="sd-key"/g) || []).length !== 9) bad(`${tag} 숫자 패드는 9개`);
      for (let d = 1; d <= 9; d++) if (!playS.includes(`data-n="${d}"`)) bad(`${tag} 숫자 패드 ${d} 없음`);
      if ((playS.match(/class="sd-tool"/g) || []).length !== 5) bad(`${tag} 도구 버튼 5개`);
      if (!/<button id="notes-btn"[^>]*aria-pressed="false"/.test(playS) || !/<button id="check-btn"[^>]*aria-pressed="false"/.test(playS)) bad(`${tag} 메모·오답 표시 버튼 aria-pressed`);
      if (!/<div id="board" class="sd-board" role="group"/.test(playS)) bad(`${tag} 판은 <div id="board" class="sd-board" role="group">`);
      if (/class="sd-cell/.test(html) || /\b[0-9]{81}\b/.test(html)) bad(`${tag} 판·퍼즐·정답이 HTML 에 미리 들어 있음 (시작할 때 JS 로 만든다)`);
      if (!/<button id="pause-btn"[^>]*hidden/.test(playS)) bad(`${tag} 일시정지 덮개는 처음에 hidden`);
      const resAt = end.indexOf('class="sd-result"');
      const endAt = end.indexOf('<div data-mg-end="sudoku"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="sudoku" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-big', 'res-newbest', 'res-best', 'res-mistakes', 'res-hints', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="sd-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('sudoku-core.js') > 0 && html.indexOf('sudoku-core.js') < html.indexOf('sudoku.js"'))) bad(`${tag} sudoku-core.js 가 sudoku.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://sudoku.example.com/</loc>') || !sm.includes('<loc>https://sudoku.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS
  const js = read('sudoku.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('sudoku.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("sudoku.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('sudoku.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('sudoku.js: setShareData/setRetry 없음');
  if (!/keydown/.test(js) || !/ArrowLeft/.test(js) || !/Backspace/.test(js)) bad('sudoku.js: 키보드 입력 없음');
  if (!/visibilitychange/.test(js) || !/document\.hidden/.test(js)) bad('sudoku.js: 탭을 숨기면 일시정지(visibilitychange) 없음');
  if (!/localStorage/.test(js) || !/sudoku_save_v1/.test(js) || !/pagehide/.test(js)) bad('sudoku.js: 진행 중 판 자동 저장(localStorage·pagehide) 없음');
  if (!/C\.generate\(/.test(js) || !/C\.dailySeed\(/.test(js)) bad('sudoku.js: 생성기·오늘의 퍼즐 시드 없음');
  if (!/supa\.submitScore\(C\.DIFFS\[game\.diff\]\.game/.test(js)) bad('sudoku.js: supa.submitScore(난이도 game 이름, …) 없음');
  if (!/game\.hints > 0/.test(js)) bad('sudoku.js: 힌트를 쓴 판은 점수 전송 안 함');
  if (!/HINTS = 3/.test(js)) bad('sudoku.js: 힌트는 판마다 3번');
  if (/supabase|\.supabase\.co/i.test(js)) bad('sudoku.js 에 Supabase 주소');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('sudoku.js 코드에 한글 문구');
  const css = read('style.css');
  if (!/\.sd-board\s*\{[^}]*touch-action:\s*manipulation/.test(css)) bad('style.css: 판 touch-action: manipulation (더블탭 확대 막기)');
  if (!/user-select:\s*none/.test(css)) bad('style.css: 칸 user-select: none');
  if (!/prefers-reduced-motion/.test(css)) bad('style.css: prefers-reduced-motion 없음');
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
  if (APP.id !== 'sudoku' || APP.category !== 'game' || APP.path !== 'https://sudoku.example.com/' || APP.added !== '2026-10-12' || APP.order !== 1 || APP.emoji !== '🔢') bad('app.config.js id/category/path/added/order/emoji');
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
    if (/[ᄀ-ᇿ⺀-鿿가-힯＀-￯　-〿]/.test(ch)) w += 1;
    else if (THAI_MARK(ch.codePointAt(0))) w += 0;
    else if (/[฀-๿]/.test(ch)) w += 0.62;
    else if (/\s/.test(ch)) w += 0.28;
    else if (/[A-ZÀ-ÞĐƠƯА-ЯЁ]/.test(ch)) w += 0.66;
    else w += 0.54;
  }
  return w;
}
function hubLines(str, px, width) {
  const ws = /[฀-๿぀-ヿ一-鿿]/.test(str) ? [...str] : str.split(/(?<=\s)/);
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
console.log('\n결과: 통과 — 게임 로직(풀이기·생성기 해 하나·난이도 채점·결정성·오늘의 퍼즐·힌트·충돌)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·난이도·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
