#!/usr/bin/env node
/**
 * 두더지 잡기 검사.
 *   1) 로직(mole-core.js): 새 판(빈 구멍 9개·0점·0.6초 전엔 아무것도 안 나옴), 시간 진행(tick) 사건(spawn/leave/end), 처음 두 번은 두더지,
 *      동시에 떠 있는 수 ≤ maxActive, 떠 있는 시간(until) 지나면 사라짐, 30초에 end 한 번, 같은 시드 + 같은 입력 = 같은 판,
 *      점수 규칙(두더지 +10 · 황금 +30 · 폭탄 −20 이고 0 아래로 안 내려감 · 빈 구멍/이미 잡은 칸/끝난 판은 변화 없음),
 *      난이도 곡선(간격·떠 있는 시간 감소, 동시 수·폭탄 비율 증가), 폭탄·황금 비율, 봇 판(완벽·사람 같은 봇·폭탄까지 다 누르는 봇) 실력이 점수에 반영,
 *      등급(tierOf 문턱 6개 오름차순). 서버 인코딩: game 이름 = 앱 id, bucket 0..1999 정수, percentile(높을수록 좋음)·잘못된 행 무시·실패 null·혼자면 first.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자, 등급 이름 6개,
 *      FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순/랭킹 류 금지), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원),
 *      제목(= app.config 제목으로 시작)·설명 길이, h1 모양, fr 좁은 공백, ru «ты», 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음·구멍 9개 / 끝 화면: 결과 카드 → data-mg-end="mole" 순서·등급 목록 없음(스포일러) / FAQ 는 MG_FAQ 로만 / 스크립트 순서 /
 *      숨은 변형 noindex / 공통 컴포넌트 클래스(mg-end 등)와 겹치는 클래스 없음 / 앱 JS: track start·done 한 곳씩, 언어별 주소 없음, 한글 문구 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-mole.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'mole-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const STEP = 16;
// 봇 한 판. perfect: 나오자마자 두더지·황금만 누름 / human: 반응 250~550ms + 한 번 누르면 260ms 쉼 / tapall: 폭탄까지 다 누름
function playBot(seed, kind) {
  const s = C.newGame(seed);
  const r = mulberry(seed * 7 + 1);
  const seen = {};
  let busy = 0;
  const log = [];
  while (!s.over) {
    const ev = C.tick(s, STEP);
    log.push(ev.length);
    ev.forEach((e) => { if (e.type === 'spawn') seen[e.id] = { kind: e.kind, at: s.t + (kind === 'perfect' ? 0 : 250 + r() * 300) }; });
    if (s.t >= busy) {
      let pick = -1;
      for (let i = 0; i < C.HOLES; i++) {
        const c = s.holes[i];
        if (!c || !seen[c.id] || seen[c.id].at > s.t) continue;
        if (c.kind === 'bomb' && kind !== 'tapall') continue;
        if (pick < 0 || c.born < s.holes[pick].born) pick = i;
      }
      if (pick >= 0) { C.whack(s, pick); busy = s.t + (kind === 'perfect' ? 0 : 260); }
    }
  }
  s.log = log;
  return s;
}

function checkCore() {
  if (C.HOLES !== 9 || C.DURATION !== 30000) bad('9개 구멍·30초여야 함');
  if (C.POINTS.mole !== 10 || C.POINTS.gold !== 30 || C.POINTS.bomb !== -20) bad('점수표 이상');

  // 새 판
  const g = C.newGame(5);
  if (g.holes.length !== 9 || g.holes.some(Boolean) || g.score !== 0 || g.over || g.t !== 0) bad('새 판 상태 이상');
  if (C.tick(g, 500).length !== 0) bad('0.6초 전에 무언가 나옴');

  // 시간 진행 사건: 처음 두 번은 두더지, 동시 수 상한, 떠 있는 시간, end 한 번
  let spawns = 0, ends = 0, maxSeen = 0;
  const kinds = { mole: 0, gold: 0, bomb: 0 };
  const early = [];
  for (let seed = 1; seed <= 300; seed++) {
    const s = C.newGame(seed);
    const born = {};
    let n = 0;
    while (!s.over) {
      const before = s.t;
      const ev = C.tick(s, STEP);
      if (s.t - before > STEP + 1e-6) bad('tick 이 요청보다 오래 진행함');
      ev.forEach((e) => {
        if (e.type === 'spawn') {
          spawns++; kinds[e.kind]++; n++;
          if (n <= 2) early.push(e.kind);
          if (!(e.hole >= 0 && e.hole < 9) || !['mole', 'gold', 'bomb'].includes(e.kind)) bad(`spawn 이상 ${JSON.stringify(e)}`);
          born[e.id] = e;
        } else if (e.type === 'leave') {
          const b = born[e.id];
          if (!b) bad('leave 인데 spawn 이 없었음');
          else if (s.t + 1e-6 < b.until && s.t < C.DURATION) bad(`떠 있는 시간(${b.until}) 전에 사라짐 ${s.t}`);
        } else if (e.type === 'end') ends++;
      });
      const act = s.holes.filter(Boolean).length;
      maxSeen = Math.max(maxSeen, act);
      if (act > C.maxActive(s.t) + 0 && act > 1) bad(`동시에 ${act}개 > 허용 ${C.maxActive(s.t)} (t=${s.t})`);
      s.holes.forEach((c) => { if (c && c.until < s.t - 1e-6) bad('시간이 지난 것이 구멍에 남아 있음'); });
    }
    if (s.t !== C.DURATION) bad(`끝났는데 t=${s.t}`);
    if (s.holes.some(Boolean)) bad('끝났는데 구멍에 남아 있음');
    if (C.tick(s, 1000).length !== 0) bad('끝난 판은 사건이 없어야 함');
  }
  if (ends !== 300) bad(`end 사건 ${ends}번 ≠ 300 (판마다 한 번)`);
  if (early.some((k) => k !== 'mole')) bad('처음 두 번은 두더지여야 함');
  if (maxSeen < 3) bad(`동시에 3개까지 나와야 함 (최대 ${maxSeen})`);
  const per = spawns / 300;
  if (per < 40 || per > 70) bad(`한 판 평균 ${per.toFixed(1)}마리 (40~70)`);
  const bombR = kinds.bomb / spawns, goldR = kinds.gold / spawns;
  if (bombR < 0.1 || bombR > 0.3) bad(`폭탄 비율 ${bombR.toFixed(3)} (0.1~0.3)`);
  if (goldR < 0.04 || goldR > 0.12) bad(`황금 비율 ${goldR.toFixed(3)} (0.04~0.12)`);

  // 점수 규칙
  const w = C.newGame(9);
  w.holes[0] = { id: 1, kind: 'mole', born: 0, until: 999 };
  w.holes[1] = { id: 2, kind: 'gold', born: 0, until: 999 };
  w.holes[2] = { id: 3, kind: 'bomb', born: 0, until: 999 };
  w.holes[3] = { id: 4, kind: 'mole', born: 0, until: 999 };
  let r1 = C.whack(w, 0);
  if (r1.kind !== 'mole' || r1.points !== 10 || w.score !== 10 || w.holes[0]) bad(`두더지 ${JSON.stringify(r1)}`);
  r1 = C.whack(w, 0);
  if (r1.kind !== 'miss' || r1.points !== 0 || w.score !== 10) bad('이미 잡은 칸은 miss');
  r1 = C.whack(w, 1);
  if (r1.kind !== 'gold' || r1.points !== 30 || w.score !== 40 || w.golds !== 1 || w.hits !== 2) bad(`황금 ${JSON.stringify(r1)}`);
  r1 = C.whack(w, 2);
  if (r1.kind !== 'bomb' || r1.points !== -20 || w.score !== 20 || w.bombs !== 1 || w.hits !== 2) bad(`폭탄 ${JSON.stringify(r1)}`);
  w.holes[2] = { id: 5, kind: 'bomb', born: 0, until: 999 };
  w.score = 5;
  r1 = C.whack(w, 2);
  if (w.score !== 0 || r1.points !== -5) bad(`점수는 0 아래로 안 내려감 ${w.score}/${r1.points}`);
  const m0 = w.score;
  r1 = C.whack(w, 7);
  if (r1.kind !== 'miss' || w.score !== m0 || w.misses < 2) bad('빈 구멍 miss 는 감점 없음');
  if (C.whack(w, -1).kind !== 'miss' || C.whack(w, 99).kind !== 'miss') bad('범위 밖 구멍은 miss');
  w.over = true;
  const keep = w.score;
  w.holes[3] = { id: 4, kind: 'mole', born: 0, until: 999 };
  if (C.whack(w, 3).kind !== 'miss' || w.score !== keep) bad('끝난 판은 점수가 안 변함');

  // 난이도 곡선
  for (let t = 0; t < C.DURATION; t += 500) {
    if (C.intervalAt(t + 500) > C.intervalAt(t) || C.upAt(t + 500) > C.upAt(t) || C.maxActive(t + 500) < C.maxActive(t) || C.bombChance(t + 500) < C.bombChance(t)) bad(`난이도가 거꾸로 감 t=${t}`);
  }
  if (C.upAt(C.DURATION) < 500 || C.intervalAt(C.DURATION) < 300) bad('끝 무렵에도 사람이 누를 수 있어야 함 (떠 있는 시간 ≥ 500ms, 간격 ≥ 300ms)');
  if (C.maxActive(0) !== 1 || C.maxActive(C.DURATION - 1) !== 3) bad('동시 수 1 → 3');

  // 재현
  const a = playBot(777, 'human'), b = playBot(777, 'human');
  if (JSON.stringify([a.score, a.hits, a.bombs, a.spawned, a.log]) !== JSON.stringify([b.score, b.hits, b.bombs, b.spawned, b.log])) bad('같은 시드 + 같은 입력인데 결과가 다름');
  const c2 = playBot(778, 'human');
  if (c2.spawned === a.spawned && c2.score === a.score && JSON.stringify(c2.log) === JSON.stringify(a.log)) bad('시드가 달라도 판이 같음');

  // 봇: 실력이 점수에 반영된다
  const avgOf = (kind) => { let tot = 0, mx = 0, mn = 1e9; for (let i = 0; i < 30; i++) { const s = playBot(1000 + i, kind); tot += s.score; mx = Math.max(mx, s.score); mn = Math.min(mn, s.score); } return { avg: Math.round(tot / 30), max: mx, min: mn }; };
  const perfect = avgOf('perfect'), human = avgOf('human'), tapall = avgOf('tapall');
  if (!(perfect.avg >= human.avg)) bad(`완벽 봇(${perfect.avg}) ≥ 사람 봇(${human.avg})`);
  if (!(human.avg > tapall.avg + 40)) bad(`폭탄을 피하는 쪽(${human.avg})이 다 누르는 쪽(${tapall.avg})보다 확실히 높아야 함`);
  if (perfect.max > 1000 || perfect.avg < 250) bad(`완벽 봇 점수 범위 이상 ${JSON.stringify(perfect)}`);

  // 등급
  if (C.TIERS.length !== 6 || C.TIER_EMOJI.length !== 6 || C.TIERS[0] !== 0) bad('등급은 6개, 첫 문턱 0');
  C.TIERS.forEach((t, i) => { if (i && t <= C.TIERS[i - 1]) bad('등급 문턱은 오름차순'); if (C.tierOf(t) !== i) bad(`tierOf(${t}) ≠ ${i}`); if (i && C.tierOf(t - 1) !== i - 1) bad(`tierOf(${t - 1}) ≠ ${i - 1}`); });
  if (C.tierOf(0) !== 0 || C.tierOf(100000) !== 5) bad('tierOf 양끝');
  if (C.tierOf(perfect.avg) < 4) bad(`완벽 봇은 위쪽 등급이어야 함 (${perfect.avg} → ${C.tierOf(perfect.avg)})`);
  if (!(C.tierOf(tapall.avg) < C.tierOf(perfect.avg))) bad(`폭탄까지 다 누르는 봇은 완벽 봇보다 낮은 등급이어야 함 (${tapall.avg} → ${C.tierOf(tapall.avg)})`);

  // 서버 인코딩 · 백분위
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME) || C.GAME !== APP.id) bad(`GAME 이름 ${C.GAME}`);
  [[0, 0], [4, 0], [5, 1], [10, 1], [420, 42], [19990, 1999], [1e9, 1999], [-50, 0], [NaN, 0], ['x', 0]].forEach(([sc, want]) => {
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

  const n = (t) => `${t.avg}점(${t.min}~${t.max})`;
  console.log(`\n=== 로직: 봇 판 — 완벽 ${n(perfect)} · 사람 같은 봇 ${n(human)} · 폭탄까지 다 누름 ${n(tapall)} · 한 판 평균 ${per.toFixed(1)}마리(폭탄 ${(bombR * 100).toFixed(0)}% · 황금 ${(goldR * 100).toFixed(0)}%) ===`);
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
const HUD = (328 - 16) / 3 - 20;       // HUD 칸 (3칸) 안쪽 폭
const TIER_PX = 328 - 32 - 24 - 50;    // 등급 줄: 카드 안쪽 폭 − 이모지(40px) − 간격
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지' },
  { key: 'start.how.tap', get: (T) => T.start.how.tap, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.avoid', get: (T) => T.start.how.avoid, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.goal', get: (T) => T.start.how.goal, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'play.score', get: (T) => T.play.score, px: HUD, size: 12, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.time', get: (T) => T.play.time, px: HUD, size: 12, max: 1, what: 'HUD 시간 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: HUD, size: 12, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.timeUp', get: (T) => T.play.timeUp, px: 328 - 24 - 32 - 42, size: 30, max: 2, what: '시간 종료 글자 두 줄까지' },
  { key: 'result.timeUp', get: (T) => T.result.timeUp, px: 328 - 32 - 32, size: 16, max: 1, what: '끝 이유 배지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,240'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.hits', get: (T) => T.result.hits, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.bombs', get: (T) => T.result.bombs, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: TIER_PX, size: 26, max: 2, what: '등급 이름 두 줄까지', word: TIER_PX })),
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
    if (lang === 'th' && !['Mitr', 'Kanit', 'Mali', 'Prompt'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    if (lang === 'ru' && /(^|[^а-яё])(вы|вас|вам|ваш)([^а-яё]|$)/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || (h1.match(/<em>[^<]+<\/em>/g) || []).length !== 1 || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em>…</em> 강조 1개만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : ['ru', 'vi'].includes(lang) ? 31 : 34;
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
  if (!/<link rel="canonical" href="https:\/\/mole\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/mole\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      ['hud-score', 'hud-time', 'hud-best', 'hud-bar', 'board', 'over-overlay'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if ((playS.match(/class="tf-hole"/g) || []).length !== 9) bad(`${tag} 구멍은 9개`);
      if (!/<div id="over-overlay"[^>]*hidden/.test(playS)) bad(`${tag} 시간 종료 오버레이는 처음에 hidden`);
      const resAt = end.indexOf('class="tf-result"');
      const endAt = end.indexOf('<div data-mg-end="mole"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="mole" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-tier-emoji', 'res-tier', 'res-score', 'res-newbest', 'res-best', 'res-hits', 'res-bombs', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (T.result.tiers.some((x) => html.replace(/<script>window\.PAGE_I18N[\s\S]*?<\/script>/, '').includes(G.esc(x)))) bad(`${tag} 등급 이름이 HTML 에 그대로 들어 있음 (등급 목록 스포일러 — PAGE_I18N 로만)`);
      if (!/<div id="res-rank" class="tf-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('mole-core.js') > 0 && html.indexOf('mole-core.js') < html.indexOf('mole.js"'))) bad(`${tag} mole-core.js 가 mole.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://mole.example.com/</loc>') || !sm.includes('<loc>https://mole.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('mole.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('mole.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("mole.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('mole.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('mole.js: setShareData/setRetry 없음');
  if (!/pointerdown/.test(js) || !/keydown/.test(js)) bad('mole.js: 누르기(pointerdown)·키보드 입력 없음');
  if (!/localStorage/.test(js)) bad('mole.js: 최고 기록(localStorage) 없음');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('mole.js 코드에 한글 문구');
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
  if (APP.id !== 'mole' || APP.category !== 'game' || APP.path !== 'https://mole.example.com/' || APP.added !== '2026-10-06' || APP.order !== 1 || APP.emoji !== '🔨') bad('app.config.js id/category/path/added/order/emoji');
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
console.log('\n결과: 통과 — 게임 로직(시간 진행·점수 규칙·난이도·재현·실력·등급)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
