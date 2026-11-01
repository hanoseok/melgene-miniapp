#!/usr/bin/env node
/**
 * 10초 맞추기(10 Second Challenge) 검사.
 *   1) 로직(timer-core.js): 목표 5·10·30초(이상한 값 → 10), 게임 이름(모드별 timer-<초>[-b], 서버 규칙), 시계 표시 mm:ss.cc(1/100초 버림·59:59.99 상한),
 *      err = 멈춘 시간 − 목표, perfect = 화면이 목표 그대로(0 ≤ err < 10ms), 한 판 3번(그 뒤 null), summary(가장 작은 |err|·평균·등급·perfect),
 *      tierOf 경계(500·250·100·40·15ms), bucket(0..1999), percentile(낮을수록 좋음: 오차가 작으면 더 상위).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지,
 *      블라인드 모드 질문 포함), 등급 이름 6개, 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이,
 *      h1 모양, fr 좁은 공백, ru «ты», 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·결과 없음 / 목표 라디오 3개(10 기본)·블라인드 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="timer" 순서 / 백분위 칸 처음 숨김 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(가이드 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크, timer.js 규칙(track·visibilitychange·reduced-motion·문구 없음).
 *
 * 실행: node tools/check-timer.js   (cwd = apps/timer)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'timer-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function checkCore() {
  if (C.TARGETS.join(',') !== '5,10,30' || C.DEFAULT_TARGET !== 10 || C.ATTEMPTS !== 3 || C.BLIND_AFTER_MS !== 3000) bad('목표 5·10·30초, 기본 10, 3번, 블라인드 3초');
  if (C.validTarget(5) !== 5 || C.validTarget('30') !== 30 || C.validTarget(7) !== 10 || C.validTarget('x') !== 10 || C.validTarget(null) !== 10) bad('validTarget');
  const keys = new Set();
  C.TARGETS.forEach((t) => [false, true].forEach((b) => {
    const k = C.gameKey(t, b);
    if (!/^[a-z0-9-]{1,32}$/.test(k)) bad(`게임 이름 ${k} 가 서버 규칙(^[a-z0-9-]{1,32}$)에 안 맞음`);
    keys.add(k);
  }));
  if (keys.size !== 6 || C.gameKey(10, false) !== 'timer-10' || C.gameKey(10, true) !== 'timer-10-b') bad(`모드별 게임 이름 ${[...keys].join(' ')}`);
  // 시계
  const clocks = [[0, '00:00.00'], [9, '00:00.00'], [10, '00:00.01'], [9999, '00:09.99'], [10000, '00:10.00'], [10009, '00:10.00'], [10010, '00:10.01'],
    [61234, '01:01.23'], [-50, '00:00.00'], [NaN, '00:00.00'], [1e12, '59:59.99']];
  clocks.forEach(([ms, s]) => { if (C.formatClock(ms) !== s) bad(`formatClock(${ms}) = ${C.formatClock(ms)} ≠ ${s}`); });
  [[10000, '10.00'], [9876, '9.87'], [30120, '30.12'], [65432, '1:05.43']].forEach(([ms, s]) => { if (C.formatShort(ms) !== s) bad(`formatShort(${ms}) = ${C.formatShort(ms)} ≠ ${s}`); });
  // 오차 · perfect
  if (C.errOf(10023, 10) !== 23 || C.errOf(9897, 10) !== -103 || C.errOf(5000, 5) !== 0 || C.errOf(29500, 30) !== -500) bad('errOf');
  if (!C.isPerfect(10000, 10) || !C.isPerfect(10009, 10) || C.isPerfect(10010, 10) || C.isPerfect(9999, 10) || !C.isPerfect(30005, 30) || C.isPerfect(10000, 5)) bad('isPerfect = 화면에 목표 그대로(0 ≤ err < 10ms)');
  // 화면 표시와 perfect 가 언제나 같은지 (0..40초 전부, 1ms 간격)
  let mism = 0;
  for (let ms = 0; ms <= 40000; ms++) {
    C.TARGETS.forEach((t) => {
      const shown = C.formatClock(ms) === C.formatClock(t * 1000);
      if (shown !== C.isPerfect(ms, t)) mism++;
    });
  }
  if (mism) bad(`perfect 와 화면 표시가 다른 경우 ${mism}개`);
  // 등급
  const tiers = [[0, 5], [14, 5], [15, 4], [39, 4], [40, 3], [99, 3], [100, 2], [249, 2], [250, 1], [499, 1], [500, 0], [5000, 0], [-12, 5], [NaN, 0]];
  tiers.forEach(([e, t]) => { if (C.tierOf(e) !== t) bad(`tierOf(${e}) = ${C.tierOf(e)} ≠ ${t}`); });
  if (C.TIERS.length !== 6) bad('등급 6개');
  // 한 판
  const r = C.newRound(10, true);
  if (r.target !== 10 || !r.blind || r.attempts.length || r.over) bad('newRound');
  const a1 = C.record(r, 10234.4), a2 = C.record(r, 9991), a3 = C.record(r, 10004);
  if (!a1 || a1.ms !== 10234 || a1.err !== 234 || a1.abs !== 234 || a1.perfect || a1.index !== 0) bad(`record 1 ${JSON.stringify(a1)}`);
  if (!a2 || a2.err !== -9 || a2.perfect) bad(`record 2 ${JSON.stringify(a2)}`);
  if (!a3 || a3.err !== 4 || !a3.perfect || !r.over) bad(`record 3 ${JSON.stringify(a3)} over=${r.over}`);
  if (C.record(r, 10000) !== null || r.attempts.length !== 3) bad('3번 뒤에는 기록하지 않음');
  const s = C.summary(r);
  if (!s || s.best !== a3 || s.avg !== Math.round((234 + 9 + 4) / 3) || s.tier !== 5 || !s.perfect || s.count !== 3) bad(`summary ${JSON.stringify(s)}`);
  if (C.summary(C.newRound(5)) !== null) bad('빈 판 summary = null');
  if (C.record(C.newRound(5), -1) !== null || C.record(C.newRound(5), 'x') !== null) bad('이상한 시간은 null');
  const r2 = C.newRound(5, false); C.record(r2, 5600); C.record(r2, 4300); C.record(r2, 5300);
  const s2 = C.summary(r2);
  if (s2.best.err !== 300 || s2.tier !== 1 || s2.perfect) bad(`summary(같은 |err| 는 먼저 것) ${JSON.stringify(s2)}`);
  // 서버 인코딩 (낮을수록 좋음)
  if (C.bucket(0) !== 0 || C.bucket(-23) !== 23 || C.bucket(23.4) !== 23 || C.bucket(1e9) !== C.MAX_BUCKET || C.bucket('x') !== C.MAX_BUCKET) bad('bucket');
  if (C.MAX_BUCKET > 1999) bad('bucket 은 서버 한도 2000 구간 안');
  const rows = [{ score_bucket: 5, players: 2 }, { score_bucket: 40, players: 1 }, { score_bucket: 300, players: 3 }];
  const pc = C.percentile(rows, 40);
  if (!pc || pc.first || pc.others !== 5 || pc.better !== 2 || pc.worse !== 3 || pc.top < 1 || pc.top > 100) bad(`percentile ${JSON.stringify(pc)}`);
  if (!C.percentile([{ score_bucket: 5, players: 1 }], 5).first) bad('혼자면 first');
  if (C.percentile(null, 5) !== null) bad('실패(null)면 null');
  if (C.percentile([{ score_bucket: 'x', players: 'y' }, null, { score_bucket: 3, players: 4 }], 9).others !== 4) bad('잘못된 행 무시');
  const good = C.percentile([{ score_bucket: 500, players: 9 }], 2), poor = C.percentile([{ score_bucket: 2, players: 9 }], 500);
  if (!(good.top < poor.top) || good.beatPct !== 100 || poor.beatPct !== 0) bad('오차가 작을수록 더 상위여야 함');
  console.log(`  로직: 목표 ${C.TARGETS.join('·')}초 · 게임 이름 ${[...keys].join(' ')} · 시계/perfect 일치 ${(40001 * 3).toLocaleString()}건 · 등급 경계 ${C.BOUNDS.join('·')}ms`);
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
// 360px 폭(본문 칸 328px) 예산 — 게임 판 안쪽(tm-area) 296px
const AREA = 296;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.how', get: (T) => T.start.how, px: 328 - 27, size: 14, max: 2, what: '한 줄 방법 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지' },
  { key: 'start.targetLabel', get: (T) => T.start.targetLabel, px: 328 - 27, size: 14, max: 1, what: '목표 이름표 한 줄' },
  { key: 'start.targetValue', get: (T) => T.start.targetValue.replace('{n}', '30'), px: 84, size: 17, max: 1, what: '목표 버튼 한 줄' },
  { key: 'start.blindLabel', get: (T) => T.start.blindLabel, px: 328 - 27 - 60, size: 16, max: 1, what: '블라인드 이름 한 줄' },
  { key: 'start.blindDesc', get: (T) => T.start.blindDesc, px: 328 - 27 - 60, size: 13, max: 2, what: '블라인드 설명 두 줄까지', factor: 1.05 },
  { key: 'play.target', get: (T) => T.play.target.replace('{t}', T.play.sec.replace('{n}', '30.00')) + '  ' + T.play.blindTag, px: 328, size: 16, max: 1, what: '목표 + 블라인드 칩 한 줄' },
  { key: 'play.attempt', get: (T) => T.play.attempt.replace('{n}', '3').replace('{total}', '3'), px: AREA, size: 15, max: 1, what: '몇 번째 시도 한 줄' },
  ...['go', 'stop', 'next', 'finish'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: AREA - 42, size: 20, max: 1, what: '큰 버튼 한 줄' })),
  { key: 'play.readyHint', get: (T) => T.play.readyHint.replace('{t}', T.play.sec.replace('{n}', '30.00')), px: AREA, size: 14, max: 2, what: '준비 안내 두 줄까지' },
  { key: 'play.runHint', get: (T) => T.play.runHint, px: AREA, size: 14, max: 2, what: '멈춤 안내 두 줄까지' },
  { key: 'play.early', get: (T) => T.play.early.replace('{n}', T.play.sec.replace('{n}', '1.234')), px: AREA, size: 19, max: 2, what: '빠름 두 줄까지' },
  { key: 'play.late', get: (T) => T.play.late.replace('{n}', T.play.sec.replace('{n}', '1.234')), px: AREA, size: 19, max: 2, what: '늦음 두 줄까지' },
  { key: 'play.perfect', get: (T) => T.play.perfect.replace('{t}', T.play.sec.replace('{n}', '10.00')), px: AREA, size: 19, max: 2, what: '딱 맞춤 두 줄까지' },
  { key: 'play.cancelled', get: (T) => T.play.cancelled, px: AREA, size: 14, max: 3, what: '무효 안내 세 줄까지' },
  { key: 'play.change', get: (T) => T.play.change, px: 328 - 28, size: 14, max: 1, what: '모드 바꾸기 한 줄' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 28, size: 16, max: 1, what: '결과 배지 한 줄' },
  { key: 'result.mode', get: (T) => T.result.mode.replace('{t}', T.play.sec.replace('{n}', '30.00')) + ' · ' + T.play.blindTag, px: AREA, size: 15, max: 1, what: '모드 한 줄' },
  { key: 'result.perfect', get: (T) => T.result.perfect.replace('{t}', T.play.sec.replace('{n}', '10.00')), px: AREA - 28, size: 18, max: 2, what: '딱 맞춤 배지 두 줄까지' },
  { key: 'result.bestLabel', get: (T) => T.result.bestLabel, px: AREA, size: 14, max: 2, what: '오차 이름표 두 줄까지' },
  { key: 'result.stoppedAt', get: (T) => T.result.stoppedAt.replace('{time}', '00:10.00'), px: AREA, size: 15, max: 1, what: '멈춘 시간 한 줄' },
  { key: 'result.tierLabel', get: (T) => T.result.tierLabel, px: AREA, size: 13, max: 1, what: '등급 이름표 한 줄', factor: 1.05 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: AREA, size: 24, max: 2, what: '등급 이름 두 줄까지' })),
  { key: 'result.newBest', get: (T) => T.result.newBest, px: AREA - 24, size: 16, max: 1, what: '최고 기록 배지 한 줄' },
  { key: 'result.pb', get: (T) => T.result.pb.replace('{n}', T.play.sec.replace('{n}', '0.123')), px: AREA, size: 15, max: 2, what: '내 최고 기록 두 줄까지' },
  { key: 'result.avg', get: (T) => T.result.avg, px: AREA - 24 - 104, size: 14, max: 2, what: '평균 이름 두 줄까지' },
  { key: 'result.listLabel', get: (T) => T.result.listLabel, px: AREA, size: 14, max: 1, what: '시도 목록 이름 한 줄' },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: AREA - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: AREA - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: AREA - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: AREA - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
const PLACEHOLDERS = [['start.targetValue', ['n']], ['play.target', ['t']], ['play.attempt', ['n', 'total']], ['play.readyHint', ['t']], ['play.early', ['n']], ['play.late', ['n']],
  ['play.perfect', ['t']], ['play.sec', ['n']], ['result.mode', ['t']], ['result.perfect', ['t']], ['result.stoppedAt', ['time']], ['result.pb', ['n']], ['result.top', ['n']],
  ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n', 't', 'tier']]];
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|상위|popular|ranking|rating|heart|top ?%|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const BLIND_Q = /blind|블라인드|ブラインド|盲测|aveugle|ปิดตา|che số|a ciegas|alla cieca|às cegas|слеп/i;
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
    if (!/^\?\?:\?\?\.\?\?$/.test(T.play.hidden)) bad(`${tag} play.hidden 은 시계 모양 "??:??.??"`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else {
      T.faq.forEach((f, i) => {
        if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
        else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
        else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
      });
      if (!T.faq.some((f) => BLIND_Q.test(f.q))) bad(`${tag} faq 에 블라인드 모드 질문이 없음`);
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
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.meta]).replace(/https?:[^"]+/g, '');
      const hit = s.match(/.{0,12}[^  "?][?!:;](?=\s|$|')/);
      if (hit && !/\?\?:\?\?/.test(hit[0])) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    if (lang === 'ru' && /\bВы\b|\bвы\b|\bВаш|\bваш/.test(JSON.stringify([T.start, T.play, T.result, T.og, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы/ваш 금지)`);
    if (lang === 'ru' && /«[^»]*«/.test(JSON.stringify(T))) bad(`${tag} 따옴표 «» 가 겹침`);
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = (b.factor || displayFactor(T)) * (1 + (b.track || 0));
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
  if (!/<link rel="canonical" href="https:\/\/timer\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/timer\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (아무 데나 눌러 멈추는 게임은 진행 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음`);
      if (/data-mg-end|mg-faq|<details|tm-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="tm-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="tm-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start) || !/id="blind-toggle"/.test(start)) bad(`${tag} 시작 버튼·블라인드 토글 없음`);
      const radios = start.match(/<input type="radio" name="target" value="(\d+)"( checked)?>/g) || [];
      if (radios.length !== 3 || !/value="10" checked/.test(start)) bad(`${tag} 목표 라디오 3개(10초 기본)`);
      if (!start.includes(`<p class="tm-how">${G.esc(T.start.how)}</p>`)) bad(`${tag} 한 줄 방법 없음`);
      if (T.result.tiers.some((t) => start.includes(G.esc(t)))) bad(`${tag} 시작 화면에 등급 이름 (스포일러)`);
      if (start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length > 620) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['play-target', 'play-blind', 'tries', 'play-area', 'attempt-label', 'clock', 'verdict', 'main-btn', 'play-hint', 'change-btn', 'confetti'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if ((playS.match(/class="tm-try"/g) || []).length !== C.ATTEMPTS) bad(`${tag} 시도 칸 ${C.ATTEMPTS}개`);
      if (!/id="clock"[^>]*role="timer"/.test(playS) || !/id="play-hint"[^>]*aria-live="polite"/.test(playS)) bad(`${tag} 시계 role=timer / 안내 aria-live`);
      const resAt = end.indexOf('class="tm-result"');
      const endAt = end.indexOf('<div data-mg-end="timer"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="timer" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-mode', 'res-perfect', 'res-err', 'res-time', 'res-tier', 'res-newbest', 'res-pb', 'res-avg', 'res-list', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="tm-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('timer-core.js') > 0 && html.indexOf('timer-core.js') < html.indexOf('timer.js"'))) bad(`${tag} timer-core.js 가 timer.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (가이드 제외)`);
  if (!sm.includes('<loc>https://timer.example.com/</loc>') || !sm.includes('<loc>https://timer.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  const js = read('timer.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('timer.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("timer.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('timer.js: 탭 전환(시도 무효)·움직임 줄이기 처리 없음');
  if (!/performance\.now/.test(js) || !/requestAnimationFrame/.test(js)) bad('timer.js: performance.now + requestAnimationFrame');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('timer.js: setShareData/setRetry 없음');
  if (!/pointerdown/.test(js) || !/'Enter'/.test(js) || !/' '/.test(js)) bad('timer.js: 아무 데나 누르기(pointerdown)·Space/Enter');
  if (!/localStorage/.test(js)) bad('timer.js: 설정·최고 기록 localStorage');
  if (!/supa\.submitScore\(C\.gameKey\(/.test(js)) bad('timer.js: supa.submitScore(C.gameKey(…), …) 로 모드별 실제 백분위');
  if (/[가-힣]/.test(js.replace(/\/\/.*$/gm, ''))) bad('timer.js 코드에 한글 문구 (문구는 언어 파일에만)');
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
  if (APP.id !== 'timer' || APP.category !== 'game' || APP.path !== 'https://timer.example.com/' || APP.added !== '2026-11-02' || APP.order !== 1 || APP.emoji !== '⏱️') bad('app.config.js id/emoji/category/path/added/order');
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
console.log('\n결과: 통과 — 로직(목표·모드별 게임 이름·시계 mm:ss.cc·오차·perfect=화면 표시·3번·요약·등급 경계)·서버 점수 분포(bucket·낮을수록 상위 백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
