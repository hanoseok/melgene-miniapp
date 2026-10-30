#!/usr/bin/env node
/**
 * 다른 색 찾기(Find the Different Color) 검사.
 *   1) 로직(hue-core.js): 판 크기(2×2 부터 커지기만 하고 최대 8×8), 색 차이(처음 크고 레벨마다 줄어들기만, 바닥 MIN_DELTA),
 *      레벨 2,000개 × 여러 시드: 다른 칸은 정확히 하나(odd 범위 안, 나머지 칸 색은 모두 base), base ≠ oddColor(8비트 hex 에서도 다름),
 *      #rrggbb 모양, 너무 어둡거나 하얀 색 없음(OKLab L 범위), sRGB 안(gamut), OKLab 밝기 차이 = delta, 같은 chroma·hue,
 *      pick: 맞으면 점수 +1·다음 레벨, 틀리면 3초 감점·점수 그대로, 판 밖 번호·끝난 판은 null, timeLeft(60초 − 지난 시간 − 감점),
 *      같은 시드 = 같은 레벨들, tierOf 경계, 서버 인코딩(game 이름, bucket 0..1999, percentile).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지,
 *      "재미로·의학 검사 아님" 질문 포함), 등급 이름 6개, 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원),
 *      제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="hue" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(가이드 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-hue.js   (cwd = apps/hue)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'hue-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
// sRGB hex → OKLab L (검사용 독립 구현)
function hexToOklabL(hex) {
  const v = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const [r, g, b] = v;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
}

function checkCore() {
  // 판 크기
  if (C.sizeOf(0) !== 2) bad('첫 레벨은 2×2');
  let prevSize = 0, prevDelta = Infinity;
  const seenSizes = new Set();
  for (let l = 0; l <= 200; l++) {
    const n = C.sizeOf(l), d = C.deltaOf(l);
    seenSizes.add(n);
    if (n < prevSize) bad(`레벨 ${l}: 판이 작아짐 ${prevSize} → ${n}`);
    if (n > C.MAX_SIZE || n < 2 || !Number.isInteger(n)) bad(`레벨 ${l}: 판 크기 ${n}`);
    if (d > prevDelta + 1e-12) bad(`레벨 ${l}: 색 차이가 커짐 ${prevDelta} → ${d}`);
    if (d < C.MIN_DELTA - 1e-12) bad(`레벨 ${l}: 색 차이가 바닥 아래 ${d}`);
    prevSize = n; prevDelta = d;
  }
  if (C.MAX_SIZE !== 8 || C.sizeOf(200) !== 8 || C.sizeOf(1e6) !== 8) bad('최대 8×8');
  [2, 3, 4, 5, 6, 7, 8].forEach((n) => { if (!seenSizes.has(n)) bad(`판 크기 ${n}×${n} 이 나오지 않음`); });
  if (!(C.deltaOf(0) > C.deltaOf(5) && C.deltaOf(5) > C.deltaOf(10) && C.deltaOf(10) > C.deltaOf(15))) bad('색 차이는 레벨마다 줄어야 함');
  if (C.deltaOf(0) < 0.1) bad('첫 레벨 색 차이는 한눈에 보일 만큼 커야 함');
  if (C.deltaOf(200) !== C.MIN_DELTA) bad('오래 가면 바닥(MIN_DELTA)에 머문다');
  if (C.MIN_DELTA < 0.012) bad(`MIN_DELTA ${C.MIN_DELTA} 가 너무 작음 (눈으로 구별하기 어려움)`);
  if (C.sizeOf(-3) !== 2 || C.deltaOf('x') !== C.START_DELTA) bad('이상한 레벨 값 처리');

  // 레벨 생성
  let rounds = 0, flips = 0;
  const lMin = { v: 1 }, lMax = { v: 0 };
  for (let seed = 1; seed <= 60; seed++) {
    const rnd = C.mulberry32(seed * 31 + 7);
    for (let l = 0; l < 40; l++) {
      const r = C.makeRound(l, rnd);
      rounds++;
      const tag = `seed ${seed} 레벨 ${l}`;
      if (r.size !== C.sizeOf(l) || r.count !== r.size * r.size) { bad(`${tag}: size/count`); continue; }
      if (!Number.isInteger(r.odd) || r.odd < 0 || r.odd >= r.count) bad(`${tag}: 다른 칸 번호 ${r.odd}`);
      if (!/^#[0-9a-f]{6}$/.test(r.base) || !/^#[0-9a-f]{6}$/.test(r.oddColor)) bad(`${tag}: 색 모양 ${r.base} ${r.oddColor}`);
      if (r.base === r.oddColor) bad(`${tag}: 8비트 색이 같음 ${r.base} (차이 ${r.delta.toFixed(3)})`);
      // 칸 색 배열을 만들어 다른 칸이 정확히 하나인지
      const colors = Array.from({ length: r.count }, (_, i) => (i === r.odd ? r.oddColor : r.base));
      const diff = colors.filter((c) => c !== r.base).length;
      if (diff !== 1) bad(`${tag}: 다른 칸 ${diff}개`);
      if (!C.inGamut(C.oklchToRgb(r.baseL, r.chroma, r.hue)) || !C.inGamut(C.oklchToRgb(r.oddL, r.chroma, r.hue))) bad(`${tag}: sRGB 밖`);
      if (Math.abs(Math.abs(r.oddL - r.baseL) - r.delta) > 1e-9) bad(`${tag}: 밝기 차이 ≠ delta`);
      const L1 = hexToOklabL(r.base), L2 = hexToOklabL(r.oddColor);
      if (Math.abs(L1 - r.baseL) > 0.01 || Math.abs(L2 - r.oddL) > 0.01) bad(`${tag}: hex 의 실제 밝기가 다름 ${L1.toFixed(3)}/${r.baseL.toFixed(3)}`);
      if (Math.abs(Math.abs(L2 - L1) - r.delta) > 0.006) bad(`${tag}: hex 밝기 차이 ${Math.abs(L2 - L1).toFixed(4)} ≠ ${r.delta.toFixed(4)}`);
      lMin.v = Math.min(lMin.v, L1, L2); lMax.v = Math.max(lMax.v, L1, L2);
      if (r.oddL < r.baseL) flips++;
    }
  }
  if (lMin.v < 0.4 || lMax.v > 0.88) bad(`너무 어둡거나 밝은 색 (OKLab L ${lMin.v.toFixed(2)}..${lMax.v.toFixed(2)})`);
  if (flips < rounds * 0.25 || flips > rounds * 0.75) bad(`다른 칸이 밝은 쪽/어두운 쪽 한쪽으로 쏠림 (${flips}/${rounds})`);
  // 다른 칸 위치가 고루 퍼짐(2×2 레벨 0 만 모아서)
  const pos = [0, 0, 0, 0];
  for (let seed = 1; seed <= 2000; seed++) pos[C.newGame(seed).round.odd]++;
  if (pos.some((x) => x < 350)) bad(`2×2 다른 칸 위치가 고르지 않음 ${pos.join('/')}`);

  // pick · 시간
  let g = C.newGame(42);
  const first = g.round;
  const wrong = first.odd === 0 ? 1 : 0;
  let res = C.pick(g, wrong);
  if (!res || res.ok || res.penalty !== C.PENALTY_MS || g.score !== 0 || g.misses !== 1 || g.round !== first) bad('틀린 칸: 3초 감점, 점수·레벨 그대로');
  if (C.timeLeft(g, 10000) !== C.TIME_MS - 10000 - C.PENALTY_MS) bad('timeLeft = 60초 − 지난 시간 − 감점');
  if (C.timeLeft(g, 1e9) !== 0 || C.timeLeft(null, 0) !== C.TIME_MS) bad('timeLeft 바닥 0');
  res = C.pick(g, first.odd);
  if (!res || !res.ok || g.score !== 1 || g.level !== 1 || g.round.size !== C.sizeOf(1)) bad('맞은 칸: 점수 +1, 다음 레벨');
  if (C.pick(g, -1) !== null || C.pick(g, 999) !== null || C.pick(g, 'x') !== null) bad('판 밖 번호는 null');
  for (let i = 0; i < 30; i++) C.pick(g, g.round.odd);
  if (g.score !== 31 || g.round.size !== 8) bad(`31단계 뒤 점수/판 ${g.score} ${g.round.size}`);
  g.over = true;
  if (C.pick(g, g.round.odd) !== null) bad('끝난 판은 null');
  if (C.TIME_MS !== 60000 || C.PENALTY_MS !== 3000) bad('60초 / 3초 감점');
  // 재현
  const replay = (seed) => { const x = C.newGame(seed); const out = []; for (let i = 0; i < 25; i++) { out.push(x.round.odd + x.round.base + x.round.oddColor); C.pick(x, x.round.odd); } return out.join(','); };
  if (replay(7) !== replay(7)) bad('같은 시드 = 같은 레벨');
  if (replay(7) === replay(8)) bad('다른 시드인데 같은 레벨');

  // 등급
  if (C.tierOf(0) !== 0 || C.tierOf(4) !== 0 || C.tierOf(5) !== 1 || C.tierOf(25) !== 4 || C.tierOf(26) !== 5 || C.tierOf(999) !== 5) bad('tierOf 경계');
  if (C.TIERS.length !== 6) bad('등급 6개');

  // 서버 인코딩
  if (C.GAME !== 'hue' || !/^[a-z0-9-]{1,32}$/.test(C.GAME)) bad('GAME 이름');
  if (C.bucket(0) !== 0 || C.bucket(-5) !== 0 || C.bucket(1e9) !== C.MAX_BUCKET || C.bucket('x') !== 0 || C.bucket(23) !== 23 || !Number.isInteger(C.bucket(12.4))) bad('bucket');
  if (C.MAX_BUCKET > 1999) bad('bucket 은 서버 한도 2000 구간 안');
  const pc = C.percentile([{ score_bucket: 1, players: 2 }, { score_bucket: 5, players: 1 }, { score_bucket: 9, players: 3 }], 5);
  if (!pc || pc.first || pc.others !== 5 || pc.top < 1 || pc.top > 100) bad(`percentile ${JSON.stringify(pc)}`);
  if (!C.percentile([{ score_bucket: 5, players: 1 }], 5).first) bad('혼자면 first');
  if (C.percentile(null, 5) !== null) bad('실패(null)면 null');
  if (C.percentile([{ score_bucket: 'x', players: 'y' }, null, { score_bucket: 3, players: 4 }], 9).others !== 4) bad('잘못된 행 무시');
  const hi = C.percentile([{ score_bucket: 2, players: 9 }], 50), lo = C.percentile([{ score_bucket: 50, players: 9 }], 2);
  if (!(hi.top < lo.top)) bad('높은 점수가 더 상위여야 함');
  console.log(`  로직: 레벨 ${rounds}개(60시드 × 40레벨) 색·다른 칸 1개 확인 · 판 ${[...seenSizes].sort().join('/')} · 색 차이 ${C.deltaOf(0)}→${C.MIN_DELTA} · OKLab L ${lMin.v.toFixed(2)}..${lMax.v.toFixed(2)}`);
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
    else if (ch === ' ' || ch === '\u00a0' || ch === '\u202f') w += 0.28;
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
const words = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s  ]+|-/).filter(Boolean);
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
  { key: 'start.how', get: (T) => T.start.how, px: 328 - 27, size: 14, max: 2, what: '한 줄 방법 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 1, what: '사실 한 줄' },
  // HUD 칸: (328 - 12) / 3 = 105, 안쪽 여백 20+3 → 82 (이름표 한 줄)
  { key: 'play.level', get: (T) => T.play.level, px: 82, size: 11, max: 1, what: 'HUD 레벨 이름표', track: 0.06 },
  { key: 'play.time', get: (T) => T.play.time, px: 82, size: 11, max: 1, what: 'HUD 시간 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 82, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328, size: 14, max: 2, what: '안내 두 줄까지' },
  { key: 'play.timeUp', get: (T) => T.play.timeUp, px: 328 - 32 - 36, size: 26, max: 2, what: '시간 끝 알림 두 줄까지' },
  { key: 'play.penalty', get: (T) => T.play.penalty.replace('{n}', '3'), px: 150, size: 24, max: 1, what: '감점 떠오름 한 줄' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.unit', get: (T) => T.result.unit, px: 120, size: 20, max: 1, what: '점수 옆 단위(64px 숫자 옆)' },
  { key: 'result.tierLabel', get: (T) => T.result.tierLabel, px: 328 - 36, size: 13, max: 1, what: '등급 이름표 한 줄', factor: 1.05 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: 328 - 36, size: 24, max: 2, what: '등급 이름 두 줄까지' })),
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.misses', get: (T) => T.result.misses, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.grid', get: (T) => T.result.grid, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n', 'tier']], ['result.gridValue', ['n']], ['play.penalty', ['n']]];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|상위|popular|ranking|rating|heart|top ?%|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const MEDICAL_Q = /blind|색약|색맹|色覚|色盲|daltonism|Farbenblind|ตาบอดสี|mù màu|daltonismo|дальтонизм/i;
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
    if (!Array.isArray(T.result.tiers) || T.result.tiers.length !== C.TIERS.length || new Set(T.result.tiers).size !== C.TIERS.length) bad(`${tag} result.tiers 는 서로 다른 ${C.TIERS.length}개`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else {
      T.faq.forEach((f, i) => {
        if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
        else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
        else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
      });
      if (!T.faq.some((f) => MEDICAL_Q.test(f.q))) bad(`${tag} faq 에 "색맹 검사인가요? → 재미로, 의학 검사 아님" 질문이 없음`);
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
    if (!low(T.meta.title).includes(low(APP.title[lang]))) bad(`${tag} meta.title 에 app.config 제목 "${APP.title[lang]}" 이 없음`);
    if (!low(T.meta.title).includes(low(T.start.h1Kicker))) bad(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 담지 않음`);
    if (!low(T.start.h1Kicker).includes(low(APP.title[lang]))) bad(`${tag} h1Kicker 에 app.config 제목이 없음`);
    if (!low(T.meta.description).includes(low(APP.title[lang]))) warn(`${tag} meta.description 에 검색어가 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr') {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq]).replace(/https?:[^"]+/g, '');
      const hit = s.match(/.{0,12}[^\u00a0\u202f"][?!:;](?=\s|$|')/);
      if (hit) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    if (lang === 'ru' && /\bВы\b|\bвы\b|\bВаш|\bваш/.test(JSON.stringify([T.start, T.play, T.result, T.og, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы/ваш 금지)`);
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
  if (!/<link rel="canonical" href="https:\/\/hue\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/hue\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (빨리 누르는 게임은 진행 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음 (끝 화면 광고는 공통 컴포넌트가 넣는다)`);
      if (/data-mg-end|mg-faq|<details|hue-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="hue-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="hue-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if (!start.includes(`<p class="hue-how">${G.esc(T.start.how)}</p>`)) bad(`${tag} 한 줄 방법 없음`);
      if (T.result.tiers.some((t) => start.includes(G.esc(t)))) bad(`${tag} 시작 화면에 등급 이름 (스포일러)`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-level', 'hud-time', 'hud-best', 'time-fill', 'board', 'pops', 'over-overlay', 'play-hint'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/id="play-hint"[^>]*aria-live="polite"/.test(playS)) bad(`${tag} 안내는 aria-live`);
      if (!/id="board"[^>]*tabindex="0"/.test(playS)) bad(`${tag} 판은 키보드 포커스(tabindex=0)`);
      const resAt = end.indexOf('class="hue-result"');
      const endAt = end.indexOf('<div data-mg-end="hue"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="hue" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-tier', 'res-newbest', 'res-best', 'res-misses', 'res-grid', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="hue-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('hue-core.js') > 0 && html.indexOf('hue-core.js') < html.indexOf('hue.js"'))) bad(`${tag} hue-core.js 가 hue.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (가이드 제외)`);
  if (!sm.includes('<loc>https://hue.example.com/</loc>') || !sm.includes('<loc>https://hue.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('hue.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('hue.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("hue.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('hue.js: 탭 전환(시계 멈춤)·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('hue.js: setShareData/setRetry 없음');
  if (!/ArrowUp/.test(js) || !/'Enter'/.test(js)) bad('hue.js: 키보드(화살표 + Enter) 고르기');
  if (!/localStorage/.test(js)) bad('hue.js: 최고 기록 localStorage');
  if (!/supa\.submitScore\(C\.GAME/.test(js)) bad('hue.js: supa.submitScore(C.GAME, …) 로 실제 백분위');
  if (/[가-힣]/.test(js.replace(/\/\/.*$/gm, ''))) bad('hue.js 코드에 한글 문구 (문구는 언어 파일에만)');
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
  if (APP.id !== 'hue' || APP.category !== 'game' || APP.path !== 'https://hue.example.com/' || APP.added !== '2026-10-31' || APP.order !== 1 || APP.emoji !== '🎨') bad('app.config.js id/emoji/category/path/added/order');
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
console.log('\n결과: 통과 — 게임 로직(판 2×2→8×8·색 차이 줄어듦·다른 칸 정확히 1개·sRGB·밝기 범위·감점·시간·재현·등급)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
