#!/usr/bin/env node
/**
 * 에임 연습(Aim Trainer) 검사.
 *   1) 로직(aim-core.js): 모드 classic·timed(이상한 값 → classic), 게임 이름(aim-classic·aim-timed, 서버 규칙), 위치(0..1, 바로 전과 거리),
 *      시작 과녁으로 시작·classic 30개에서 끝·timed 30초에서 끝·수명이 다하면 놓침(escape)·크기 줄어듦·수명이 점점 짧아짐,
 *      빗나감은 진행 중에만, 정확도·평균 ms, tierOf 경계(classic 900·700·580·480·400ms / timed 20·30·40·50·60개)·정확도 70% 미만 한 단계 내림,
 *      사람이 낼 수 없는 값(평균 150ms 미만·timed 100개 초과)·classic 미완료는 보내지 않음, bucket(classic ms÷10 0..500 / timed 0..100), percentile 방향.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지,
 *      입력 기기 질문·150ms 설명 포함), 등급 이름 6개, 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어), 제목(= app.config 제목·h1 검색어 포함)·설명 길이,
 *      h1 모양, fr 좁은 공백, ru «ты», 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·결과 없음 / 모드 라디오 2개(classic 기본) /
 *      게임 화면에 mg-ad 없음·플레이 영역 / 끝 화면: 결과 카드 → data-mg-end="aim" 순서 / 백분위 칸 처음 숨김 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(가이드 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크,
 *      aim.js 규칙(track·visibilitychange·reduced-motion·pointerdown 만·crypto 난수·잠금·문구 없음), style.css(touch-action:none·user-select).
 *
 * 실행: node tools/check-aim.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'aim-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// 같은 순서의 난수열(검사용)
function seq(vals) { let i = 0; return () => vals[i++ % vals.length]; }

// ---------------------------------------------------------------- 1) 로직
function checkCore() {
  if (C.MODES.join(',') !== 'classic,timed' || C.DEFAULT_MODE !== 'classic' || C.CLASSIC_TARGETS !== 30 || C.TIMED_MS !== 30000) bad('모드 classic(30개)·timed(30초), 기본 classic');
  if (C.validMode('timed') !== 'timed' || C.validMode('x') !== 'classic' || C.validMode(null) !== 'classic') bad('validMode');
  const keys = new Set(C.MODES.map((m) => C.gameKey(m)));
  keys.forEach((k) => { if (!/^[a-z0-9-]{1,32}$/.test(k)) bad(`게임 이름 ${k} 가 서버 규칙(^[a-z0-9-]{1,32}$)에 안 맞음`); });
  if (keys.size !== 2 || C.gameKey('classic') !== 'aim-classic' || C.gameKey('timed') !== 'aim-timed' || C.gameKey('zz') !== 'aim-classic') bad(`모드별 게임 이름 ${[...keys].join(' ')}`);
  if (!C.lowerBetter('classic') || C.lowerBetter('timed')) bad('classic 은 낮을수록, timed 는 높을수록 좋음');
  // 위치
  const p0 = C.pickPos(null, () => 0.25);
  if (p0.x !== 0.25 || p0.y !== 0.25) bad('pickPos: 첫 위치는 난수 그대로');
  const p1 = C.pickPos({ x: 0.5, y: 0.5 }, seq([0.5, 0.52, 0.9, 0.1]));
  if (Math.hypot(p1.x - 0.5, p1.y - 0.5) < C.MIN_GAP) bad(`pickPos: 바로 전 과녁과 ${C.MIN_GAP} 이상 떨어져야 함 ${JSON.stringify(p1)}`);
  for (let i = 0; i < 200; i++) { const p = C.pickPos({ x: Math.random(), y: Math.random() }); if (!(p.x >= 0 && p.x < 1 && p.y >= 0 && p.y < 1)) { bad('pickPos 범위 0..1'); break; } }
  if (C.pickPos(null, () => NaN).x !== 0.5) bad('pickPos: 이상한 난수는 0.5');
  // classic 한 판
  const r = C.newRun('classic');
  if (r.mode !== 'classic' || r.startAt != null || r.hits || r.over || C.summary(r) !== null) bad('newRun classic');
  if (C.miss(r, 10) !== false || r.misses !== 0) bad('시작 전 빗나감은 세지 않음');
  if (C.hit(r, 10) !== null) bad('시작 전 hit 은 null');
  const t0 = C.start(r, 1000, Math.random);
  if (!t0 || r.startAt !== 1000 || t0.at !== 1000 || t0.life !== null) bad('start: 첫 과녁 + 시작 시각');
  if (C.start(r, 1100) !== null) bad('이미 시작한 판은 다시 start 안 됨');
  if (C.scaleAt(r, 999999) !== 1) bad('classic 과녁은 줄지 않음');
  if (C.tick(r, 1e9) !== null || r.over) bad('classic 은 시간으로 끝나지 않음');
  let t = 1000;
  for (let i = 0; i < 29; i++) { t += 500; if (C.hit(r, t, Math.random) !== 'hit') { bad(`classic hit ${i + 1}`); break; } }
  if (!C.miss(r, t + 1) || r.misses !== 1) bad('진행 중 빗나감은 셈');
  t += 500;
  if (C.hit(r, t) !== 'done' || !r.over || r.hits !== 30 || r.target !== null) bad('classic 30개째에서 끝');
  if (C.hit(r, t + 1) !== null || C.miss(r, t + 1) !== false) bad('끝난 판은 세지 않음');
  const s = C.summary(r);
  if (!s || s.avg !== 500 || s.hits !== 30 || s.misses !== 1 || s.acc !== 97 || s.total !== 15000 || s.score !== 500 || !s.valid || s.tier !== 3) bad(`classic summary ${JSON.stringify(s)}`);
  // 너무 빠른 classic = 무효
  const rf = C.newRun('classic'); C.start(rf, 0); let tf = 0;
  for (let i = 0; i < 30; i++) { tf += 100; C.hit(rf, tf); }
  if (C.summary(rf).valid || C.summary(rf).avg !== 100) bad('평균 150ms 미만은 valid=false');
  // timed 한 판
  const q = C.newRun('timed');
  if (C.remaining(q, 5) !== 30000 || C.lifeAt(q, 0) !== C.LIFE_START) bad('timed 시작 전 남은 시간·수명');
  C.start(q, 0, Math.random);
  if (q.target.life !== C.LIFE_START) bad('timed 첫 과녁 수명 = LIFE_START');
  if (Math.abs(C.scaleAt(q, q.target.life / 2) - (1 - (1 - C.MIN_SCALE) / 2)) > 1e-9 || C.scaleAt(q, 1e9) !== C.MIN_SCALE) bad('timed 과녁은 수명 동안 MIN_SCALE 까지 줄어듦');
  if (C.tick(q, C.LIFE_START - 1) !== null) bad('수명 전에는 놓치지 않음');
  if (C.tick(q, C.LIFE_START) !== 'escape' || q.escaped !== 1 || q.target.at !== C.LIFE_START) bad('수명이 다하면 escape + 새 과녁');
  if (C.hit(q, 2000) !== 'hit' || q.hits !== 1 || q.times[0] !== 2000 - C.LIFE_START) bad('timed hit = 과녁이 나온 뒤 걸린 시간');
  if (!(C.lifeAt(q, 29000) < C.lifeAt(q, 1000)) || C.lifeAt(q, 30000) !== C.LIFE_END) bad('timed 수명은 점점 짧아짐 → LIFE_END');
  if (C.remaining(q, 10000) !== 20000) bad('remaining');
  if (C.tick(q, 30000) !== 'over' || !q.over || q.endAt !== 30000) bad('timed 30초에 끝');
  if (C.hit(q, 30001) !== null) bad('끝난 뒤 hit 없음');
  const q2 = C.newRun('timed'); C.start(q2, 0);
  if (C.hit(q2, 30000) !== null || !q2.over || q2.hits !== 0) bad('30초가 지난 뒤 hit 은 세지 않고 끝');
  const qs = C.summary(q);
  if (!qs || qs.score !== 1 || qs.escaped !== 1 || qs.total !== 30000 || !qs.valid) bad(`timed summary ${JSON.stringify(qs)}`);
  if (C.summary(q2).valid) bad('timed 0개는 보내지 않음');
  // 정확도·평균
  if (C.accuracy(0, 0) !== 0 || C.accuracy(3, 1) !== 75 || C.accuracy(2, 1) !== 67) bad('accuracy');
  if (C.avgMs([]) !== 0 || C.avgMs([100, 201]) !== 151) bad('avgMs');
  // 등급
  [[1200, 0], [900, 0], [899, 1], [700, 1], [699, 2], [580, 2], [579, 3], [480, 3], [479, 4], [400, 4], [399, 5], [200, 5], [0, 0], [NaN, 0]].forEach(([v, x]) => {
    if (C.tierOf('classic', v) !== x) bad(`tierOf(classic, ${v}) = ${C.tierOf('classic', v)} ≠ ${x}`);
  });
  [[0, 0], [19, 0], [20, 1], [29, 1], [30, 2], [40, 3], [50, 4], [59, 4], [60, 5], [99, 5]].forEach(([v, x]) => {
    if (C.tierOf('timed', v) !== x) bad(`tierOf(timed, ${v}) = ${C.tierOf('timed', v)} ≠ ${x}`);
  });
  if (C.tierOf('classic', 300, 69) !== 4 || C.tierOf('classic', 300, 70) !== 5 || C.tierOf('timed', 10, 10) !== 0) bad('정확도 70% 미만이면 한 단계 내림(0 아래로는 안 감)');
  if (C.TIERS.length !== 6 || C.BOUNDS.classic.length !== 5 || C.BOUNDS.timed.length !== 5) bad('등급 6개');
  // isValid
  if (!C.isValid('timed', { hits: 100, avg: 200 }) || C.isValid('timed', { hits: 101, avg: 200 }) || C.isValid('timed', { hits: 50, avg: 149 })) bad('timed 상한 100개·평균 150ms');
  if (C.isValid('classic', { hits: 29, avg: 500 }) || !C.isValid('classic', { hits: 30, avg: 150 })) bad('classic 은 30개 완료 + 평균 150ms 이상');
  // 서버 인코딩
  if (C.bucket('classic', 512) !== 51 || C.bucket('classic', 99999) !== 500 || C.bucket('classic', -1) !== 0 || C.bucket('timed', 42) !== 42 || C.bucket('timed', 500) !== 100 || C.bucket('timed', 'x') !== 0) bad('bucket');
  if (C.MAX_BUCKET.classic > 1999 || C.MAX_BUCKET.timed > 1999) bad('bucket 은 서버 한도 2000 구간 안');
  const fast = C.percentile([{ score_bucket: 60, players: 9 }], 40, 'classic'), slow = C.percentile([{ score_bucket: 40, players: 9 }], 60, 'classic');
  if (!(fast.top < slow.top) || fast.beatPct !== 100 || slow.beatPct !== 0) bad('classic: ms 가 낮을수록 더 상위여야 함');
  const many = C.percentile([{ score_bucket: 20, players: 9 }], 50, 'timed'), few = C.percentile([{ score_bucket: 50, players: 9 }], 20, 'timed');
  if (!(many.top < few.top) || many.beatPct !== 100 || few.beatPct !== 0) bad('timed: 맞힌 수가 많을수록 더 상위여야 함');
  const pc = C.percentile([{ score_bucket: 50, players: 2 }, { score_bucket: 51, players: 1 }, { score_bucket: 70, players: 3 }], 51, 'classic');
  if (!pc || pc.first || pc.others !== 5 || pc.worse !== 3 || pc.better !== 2) bad(`percentile ${JSON.stringify(pc)}`);
  if (!C.percentile([{ score_bucket: 5, players: 1 }], 5, 'timed').first) bad('혼자면 first');
  if (C.percentile(null, 5, 'timed') !== null) bad('실패(null)면 null');
  if (C.percentile([{ score_bucket: 'x', players: 'y' }, null, { score_bucket: 3, players: 4 }], 9, 'timed').others !== 4) bad('잘못된 행 무시');
  console.log(`  로직: 모드 ${C.MODES.join('·')} · 게임 이름 ${[...keys].join(' ')} · 등급 classic ${C.BOUNDS.classic.join('·')}ms / timed ${C.BOUNDS.timed.join('·')}개 · 하한 ${C.MIN_AVG_MS}ms · timed 상한 ${C.MAX_TIMED_HITS}개`);
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
// 360px 폭(본문 칸 328px) 예산 — 플레이 영역 안 글 328 - 6 - 24 = 298px, HUD 칸 (328 - 12) / 3 - 11 ≈ 94px,
// 결과 카드 안쪽 296px, 결과 칸(3칸) (296 - 12) / 3 - 11 ≈ 83px, 모드 버튼(2칸) (328 - 24 - 8) / 2 - 16 ≈ 132px
const AREA = 298;
const HUD = 94;
const CARD = 296;
const STAT = 83;
const SEG = 132;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.how', get: (T) => T.start.how, px: 328 - 27, size: 14, max: 2, what: '한 줄 방법 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지' },
  { key: 'start.modeLabel', get: (T) => T.start.modeLabel, px: 328 - 27, size: 14, max: 1, what: '모드 이름표 한 줄' },
  ...C.MODES.map((m) => ({ key: `start.modes.${m}.name`, get: (T) => T.start.modes[m].name, px: SEG, size: 17, max: 1, what: '모드 버튼 이름 한 줄' })),
  ...C.MODES.map((m) => ({ key: `start.modes.${m}.sub`, get: (T) => T.start.modes[m].sub, px: SEG, size: 13, max: 1, what: '모드 버튼 설명 한 줄' })),
  ...C.MODES.map((m) => ({ key: `modes.${m}`, get: (T) => T.modes[m], px: 328, size: 16, max: 1, what: '모드 한 줄' })),
  ...['time', 'hits', 'acc'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: HUD, size: 12, max: 1, what: 'HUD 이름표 한 줄', factor: 1.05 })),
  { key: 'play.ready', get: (T) => T.play.ready, px: AREA, size: 22, max: 2, what: '시작 안내 두 줄까지' },
  { key: 'play.readySub', get: (T) => T.play.readySub, px: AREA, size: 15, max: 2, what: '시작 보조 안내 두 줄까지' },
  { key: 'play.done', get: (T) => T.play.done, px: AREA, size: 34, max: 1, what: '끝 안내 한 줄' },
  { key: 'play.timeUp', get: (T) => T.play.timeUp, px: AREA, size: 34, max: 2, what: '시간 끝 안내 두 줄까지' },
  { key: 'play.cancelled', get: (T) => T.play.cancelled, px: 328 - 28, size: 14, max: 3, what: '무효 안내 세 줄까지' },
  { key: 'play.change', get: (T) => T.play.change, px: 328 - 28, size: 14, max: 1, what: '모드 바꾸기 한 줄' },
  { key: 'result.over', get: (T) => T.result.over, px: CARD - 28, size: 16, max: 1, what: '결과 배지 한 줄' },
  { key: 'result.scoreClassic', get: (T) => T.result.scoreClassic, px: CARD, size: 14, max: 2, what: '점수 이름 두 줄까지', factor: 1.05 },
  { key: 'result.scoreTimed', get: (T) => T.result.scoreTimed, px: CARD, size: 14, max: 1, what: '점수 이름 한 줄', factor: 1.05 },
  { key: 'result.unitMs+score', get: (T) => `8888 ${T.result.unitMs}`, px: CARD, size: 30, max: 1, what: '큰 숫자 + 단위 한 줄' },
  ...['acc', 'avg', 'misses', 'total', 'escaped'].map((k) => ({ key: `result.${k}`, get: (T) => T.result[k], px: STAT, size: 12, max: 2, what: '결과 칸 이름 두 줄까지', factor: 1.05 })),
  { key: 'result.msValue', get: (T) => T.result.msValue.replace('{n}', '1,234'), px: STAT, size: 20, max: 1, what: '결과 칸 값 한 줄', factor: 0.95 },
  { key: 'result.secValue', get: (T) => T.result.secValue.replace('{n}', '28.4'), px: STAT, size: 20, max: 1, what: '결과 칸 값 한 줄', factor: 0.95 },
  { key: 'result.tierLabel', get: (T) => T.result.tierLabel, px: CARD, size: 13, max: 1, what: '등급 이름표 한 줄', factor: 1.05 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: CARD - 36, size: 22, max: 2, what: '등급 이름 두 줄까지' })),
  { key: 'result.newBest', get: (T) => T.result.newBest, px: CARD - 24, size: 16, max: 1, what: '최고 기록 배지 한 줄' },
  { key: 'result.pbClassic', get: (T) => T.result.pbClassic.replace('{n}', '1,234'), px: CARD, size: 15, max: 2, what: '내 최고 기록 두 줄까지' },
  { key: 'result.pbTimed', get: (T) => T.result.pbTimed.replace('{n}', '100'), px: CARD, size: 15, max: 2, what: '내 최고 기록 두 줄까지' },
  { key: 'result.invalid', get: (T) => T.result.invalid, px: CARD - 28, size: 14, max: 4, what: '무효 안내 네 줄까지', factor: 1.05 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: CARD - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: CARD - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: CARD - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: CARD - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
const PLACEHOLDERS = [['result.msValue', ['n']], ['result.secValue', ['n']], ['result.pbClassic', ['n']], ['result.pbTimed', ['n']], ['result.top', ['n']],
  ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareClassic', ['avg', 'acc', 'tier']], ['result.shareTimed', ['hits', 'acc', 'tier']]];
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|상위|popular|ranking|rating|heart|top ?%|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const DEVICE_Q = /mouse|마우스|マウス|鼠标|souris|Maus|เมาส์|chuột|ratón|мыш/i;
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
    if (!Array.isArray(T.result.tiers) || T.result.tiers.length !== C.TIERS.length || new Set(T.result.tiers).size !== C.TIERS.length) bad(`${tag} result.tiers 는 서로 다른 ${C.TIERS.length}개`);
    if (!/30/.test(T.start.modes.classic.sub) || !/30/.test(T.start.modes.timed.sub) || !/30/.test(T.modes.classic) || !/30/.test(T.modes.timed)) bad(`${tag} 모드 설명에 30(과녁 수·초)이 없음`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else {
      T.faq.forEach((f, i) => {
        if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
        else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
        else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
      });
      if (!T.faq.some((f) => DEVICE_Q.test(f.q))) bad(`${tag} faq 에 마우스·터치(입력 기기) 질문이 없음`);
      if (!T.faq.some((f) => /150/.test(f.a))) bad(`${tag} faq 에 150ms 하한 설명이 없음`);
      if (!T.faq.some((f) => /70/.test(f.a))) bad(`${tag} faq 에 정확도 70% 설명이 없음`);
    }
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
    const h1Size = isWideLang(lang) && lang !== 'th' ? 30 : ['ru', 'vi'].includes(lang) ? 29 : 32;
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
    if (!low(T.meta.title).startsWith(low(APP.title[lang]))) bad(`${tag} meta.title 이 app.config 제목 "${APP.title[lang]}" 으로 시작하지 않음 (현지 검색어 먼저)`);
    if (!low(T.meta.title).includes(low(T.start.h1Kicker))) bad(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 담지 않음`);
    if (!low(T.start.h1Kicker).startsWith(low(APP.title[lang]))) bad(`${tag} h1Kicker 가 app.config 제목으로 시작하지 않음`);
    if (!low(T.meta.description).startsWith(low(APP.title[lang]))) warn(`${tag} meta.description 이 검색어로 시작하지 않음`);
    if (!low(T.meta.ogTitle).startsWith(low(APP.title[lang]))) warn(`${tag} meta.ogTitle 이 검색어로 시작하지 않음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr') {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.meta, T.modes]).replace(/https?:[^"]+/g, '');
      const hit = s.match(/.{0,12}[^   "?][?!:;](?=\s|$|')/);
      if (hit) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    if (lang === 'ru' && /\bВы\b|\bвы\b|\bВаш|\bваш/.test(JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.modes]))) bad(`${tag} 게임 문구는 «ты» (вы/ваш 금지)`);
    if (lang === 'ru' && /«[^»]*«/.test(JSON.stringify(T))) bad(`${tag} 따옴표 «» 가 겹침`);
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = b.factor || displayFactor(T);
      const n = lines(T, lang, v, b.size, b.px, f);
      if (n > b.max) bad(`${tag} ${b.key} "${v}" 가 360px 에서 ${n}줄 (${b.what})`);
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
  if (!/<link rel="canonical" href="https:\/\/aim\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/aim\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (생성기 실행 필요)`); return; }
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
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (빠르게 누르는 게임은 진행 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음`);
      if (/data-mg-end|mg-faq|<details|am-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="am-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="am-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const radios = start.match(/<input type="radio" name="mode" value="(\w+)"( checked)?>/g) || [];
      if (radios.length !== 2 || !/value="classic" checked/.test(start) || !/value="timed">/.test(start)) bad(`${tag} 모드 라디오 2개(classic 기본)`);
      if (!start.includes(`<p class="am-how">${G.esc(T.start.how)}</p>`)) bad(`${tag} 한 줄 방법 없음`);
      if (T.result.tiers.some((t) => start.includes(G.esc(t)))) bad(`${tag} 시작 화면에 등급 이름 (스포일러)`);
      if (start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length > 640) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['play-mode', 'hud-time', 'hud-hits', 'hud-acc', 'hud-bar', 'area', 'marks', 'target', 'area-main', 'area-sub', 'play-note', 'change-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/id="area"[^>]*aria-label="/.test(playS) || !/id="area-sub"[^>]*aria-live="polite"/.test(playS)) bad(`${tag} 플레이 영역 aria-label / 안내 aria-live`);
      const resAt = end.indexOf('class="am-result"');
      const endAt = end.indexOf('<div data-mg-end="aim"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="aim" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-mode', 'res-score-label', 'res-score', 'res-unit', 'res-acc', 'res-avg', 'res-misses', 'res-total', 'res-escaped', 'res-tier', 'res-newbest', 'res-pb', 'res-invalid', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="am-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (!/id="res-invalid"[^>]*hidden/.test(end)) bad(`${tag} 무효 안내는 처음에 숨김`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (T.result.tiers.some((t) => end.includes(G.esc(t)))) bad(`${tag} 끝 화면 HTML 에 등급 이름 목록 (내 등급만 JS 로)`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('aim-core.js') > 0 && html.indexOf('aim-core.js') < html.indexOf('aim.js"'))) bad(`${tag} aim-core.js 가 aim.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (가이드 제외)`);
  if (!sm.includes('<loc>https://aim.example.com/</loc>') || !sm.includes('<loc>https://aim.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  const js = read('aim.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('aim.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("aim.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('aim.js: 탭 전환(무효)·움직임 줄이기 처리 없음');
  if (!/performance\.now/.test(js) || !/requestAnimationFrame/.test(js)) bad('aim.js: performance.now + requestAnimationFrame');
  if (!/getRandomValues/.test(js)) bad('aim.js: 위치는 crypto.getRandomValues');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('aim.js: setShareData/setRetry 없음');
  if (!/addEventListener\('pointerdown'/.test(js)) bad('aim.js: 플레이 영역 pointerdown');
  if (/addEventListener\('(click|mousedown|mouseup|keydown|keyup|keypress)'[^)]*\)/.test(js.replace(/els\.(startBtn|change)\.addEventListener\('click'/g, ''))) bad('aim.js: 플레이 영역은 pointerdown 만 (click/mouse/key 로 세면 두 번 셈)');
  if (!/LOCK_MS = 6\d\d/.test(js)) bad('aim.js: 끝난 뒤 약 0.6초 입력 잠금(LOCK_MS)');
  if (!/contextmenu/.test(js) || !/dblclick/.test(js)) bad('aim.js: 길게 눌러 메뉴·더블 탭 확대 막기');
  if (!/localStorage/.test(js)) bad('aim.js: 설정·최고 기록 localStorage');
  if (!/supa\.submitScore\(C\.gameKey\(/.test(js)) bad('aim.js: supa.submitScore(C.gameKey(…), …) 로 모드별 실제 백분위');
  if (!/s\.valid/.test(js)) bad('aim.js: 유효하지 않은 기록(valid=false)은 보내지 않음');
  if (/[가-힣]/.test(js.replace(/\/\/.*$/gm, ''))) bad('aim.js 코드에 한글 문구 (문구는 언어 파일에만)');
  const css = read('style.css');
  if (!/\.am-area \{[^}]*touch-action: none/.test(css) || !/\.am-area \{[^}]*user-select: none/.test(css) || !/-webkit-touch-callout: none/.test(css)) bad('style.css: 플레이 영역 touch-action:none · user-select:none · touch-callout:none');
  if (!/prefers-reduced-motion/.test(css)) bad('style.css: 움직임 줄이기');
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
  if (APP.id !== 'aim' || APP.category !== 'game' || APP.path !== 'https://aim.example.com/' || APP.added !== '2026-11-06' || APP.order !== 1 || APP.emoji !== '🎯') bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
    if (APP.title[code] && L10N[code] && L10N[code].siteName !== APP.title[code]) bad(`app.config.js ${code} 제목 ≠ siteName`);
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
console.log('\n결과: 통과 — 로직(모드·게임 이름·위치·시작/끝·놓침·크기 줄어듦·등급 경계·정확도 감점·150ms/100개 상한)·서버 점수 분포(bucket·방향별 백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), 입력 규칙(pointerdown 만·crypto·잠금·확대 막기), OG 이미지 모두 OK');
