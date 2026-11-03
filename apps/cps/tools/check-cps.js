#!/usr/bin/env node
/**
 * 클릭 속도 테스트(CPS Test) 검사.
 *   1) 로직(cps-core.js): 모드 1·5·10초(이상한 값 → 5), 게임 이름(모드별 cps-<초>, 서버 규칙), CPS = 클릭 ÷ 초(소수 한 자리),
 *      첫 클릭에 시작(그 클릭도 1회)·시간이 다 된 뒤 클릭은 세지 않음·tick 으로 끝, summary(clicks·cps·tier·valid),
 *      tierOf 경계(4·6·8·10·13 CPS), 25 CPS 초과는 보내지 않음(isValid), bucket(CPS×10, 0..250), percentile(높을수록 좋음).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지,
 *      키보드·여러 손가락 질문 포함), 등급 이름 6개, 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이,
 *      h1 모양, fr 좁은 공백, ru «ты», 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·결과 없음 / 모드 라디오 3개(5 기본) /
 *      게임 화면에 mg-ad 없음·클릭 영역 / 끝 화면: 결과 카드 → data-mg-end="cps" 순서 / 백분위 칸 처음 숨김 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수(가이드 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크,
 *      cps.js 규칙(track·visibilitychange·reduced-motion·pointerdown 만·키보드 미집계·잠금·문구 없음), style.css(touch-action:none·user-select).
 *
 * 실행: node tools/check-cps.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'cps-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function checkCore() {
  if (C.MODES.join(',') !== '1,5,10' || C.DEFAULT_MODE !== 5 || C.MAX_CPS !== 25) bad('모드 1·5·10초, 기본 5, 상한 25 CPS');
  if (C.validMode(1) !== 1 || C.validMode('10') !== 10 || C.validMode(7) !== 5 || C.validMode('x') !== 5 || C.validMode(null) !== 5) bad('validMode');
  const keys = new Set();
  C.MODES.forEach((m) => {
    const k = C.gameKey(m);
    if (!/^[a-z0-9-]{1,32}$/.test(k)) bad(`게임 이름 ${k} 가 서버 규칙(^[a-z0-9-]{1,32}$)에 안 맞음`);
    keys.add(k);
  });
  if (keys.size !== 3 || C.gameKey(5) !== 'cps-5' || C.gameKey(99) !== 'cps-5') bad(`모드별 게임 이름 ${[...keys].join(' ')}`);
  // CPS
  [[37, 5, 7.4], [0, 5, 0], [9, 1, 9], [123, 10, 12.3], [33, 5, 6.6], [1, 5, 0.2], [7, 0, 0], [-3, 5, 0], [101, 10, 10.1], [61, 10, 6.1]].forEach(([c, s, v]) => {
    if (C.cpsOf(c, s) !== v) bad(`cpsOf(${c}, ${s}) = ${C.cpsOf(c, s)} ≠ ${v}`);
  });
  // 등급
  [[0, 0], [3.9, 0], [4, 1], [5.9, 1], [6, 2], [7.9, 2], [8, 3], [9.9, 3], [10, 4], [12.9, 4], [13, 5], [24, 5], [NaN, 0], [-1, 0]].forEach(([v, t]) => {
    if (C.tierOf(v) !== t) bad(`tierOf(${v}) = ${C.tierOf(v)} ≠ ${t}`);
  });
  if (C.TIERS.length !== 6 || C.BOUNDS.length !== 5) bad('등급 6개');
  if (!C.isValid(25) || C.isValid(25.1) || C.isValid(0) || C.isValid(NaN)) bad('isValid: 0 < cps ≤ 25');
  // 한 판 (5초)
  const r = C.newRound(5);
  if (r.mode !== 5 || r.dur !== 5000 || r.startAt != null || r.clicks || r.over) bad('newRound');
  if (C.summary(r) !== null || C.remaining(r, 123) !== 5000 || C.tick(r, 99999) !== false) bad('시작 전: summary null · 남은 시간 전체 · tick 은 끝내지 않음');
  if (C.tap(r, 1000) !== 'start' || r.clicks !== 1 || r.startAt !== 1000) bad('첫 클릭 = 시작 + 1회');
  if (C.tap(r, 1500) !== 'tap' || C.tap(r, 5999) !== 'tap' || r.clicks !== 3) bad('시간 안 클릭');
  if (C.tap(r, 990) !== 'tap' || r.clicks !== 4) bad('이벤트 시각이 조금 앞서도 셈');
  if (C.remaining(r, 3500) !== 2500 || C.elapsed(r, 3500) !== 2500 || C.remaining(r, 9e9) !== 0) bad('remaining/elapsed');
  if (C.tick(r, 5999) !== false || r.over) bad('tick: 아직 시간 남음');
  if (C.tap(r, 6000) !== null || !r.over || r.clicks !== 4) bad('시간이 다 된 뒤(= 시작 + 5000ms) 클릭은 세지 않고 끝');
  if (C.tap(r, 6001) !== null || r.clicks !== 4) bad('끝난 판은 세지 않음');
  const s = C.summary(r);
  if (!s || s.clicks !== 4 || s.cps !== 0.8 || s.tier !== 0 || !s.valid || s.sec !== 5) bad(`summary ${JSON.stringify(s)}`);
  const r2 = C.newRound(1);
  C.tap(r2, 0); for (let i = 1; i < 30; i++) C.tap(r2, i * 30);
  if (C.tick(r2, 999) || !C.tick(r2, 1000) || !r2.over) bad('tick 으로 끝');
  const s2 = C.summary(r2);
  if (s2.clicks !== 30 || s2.cps !== 30 || s2.valid || s2.tier !== 5) bad(`25 CPS 초과는 valid=false ${JSON.stringify(s2)}`);
  if (C.tap(C.newRound(5), NaN) !== null) bad('이상한 시각은 null');
  if (C.liveCps(C.newRound(5), 0) !== 0) bad('liveCps 시작 전 0');
  // 서버 인코딩 (높을수록 좋음)
  if (C.bucket(7.4) !== 74 || C.bucket(0) !== 0 || C.bucket(-3) !== 0 || C.bucket(99) !== C.MAX_BUCKET || C.bucket('x') !== 0) bad('bucket = CPS×10 (0..250)');
  if (C.MAX_BUCKET !== 250 || C.MAX_BUCKET > 1999) bad('bucket 은 서버 한도 2000 구간 안 (250)');
  const rows = [{ score_bucket: 50, players: 2 }, { score_bucket: 74, players: 1 }, { score_bucket: 120, players: 3 }];
  const pc = C.percentile(rows, 74);
  if (!pc || pc.first || pc.others !== 5 || pc.lower !== 2 || pc.higher !== 3 || pc.top < 1 || pc.top > 100) bad(`percentile ${JSON.stringify(pc)}`);
  if (!C.percentile([{ score_bucket: 5, players: 1 }], 5).first) bad('혼자면 first');
  if (C.percentile(null, 5) !== null) bad('실패(null)면 null');
  if (C.percentile([{ score_bucket: 'x', players: 'y' }, null, { score_bucket: 3, players: 4 }], 9).others !== 4) bad('잘못된 행 무시');
  const good = C.percentile([{ score_bucket: 50, players: 9 }], 120), poor = C.percentile([{ score_bucket: 120, players: 9 }], 50);
  if (!(good.top < poor.top) || good.beatPct !== 100 || poor.beatPct !== 0) bad('CPS 가 높을수록 더 상위여야 함');
  console.log(`  로직: 모드 ${C.MODES.join('·')}초 · 게임 이름 ${[...keys].join(' ')} · 등급 경계 ${C.BOUNDS.join('·')} CPS · 상한 ${C.MAX_CPS} CPS`);
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
const words = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s\u00a0\u202f]+|-/).filter(Boolean);
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
// 360px 폭(본문 칸 328px) 예산 — 클릭 영역 안쪽 328 - 6 - 28 = 294px, HUD 칸 (328 - 12) / 3 - 11 ≈ 94px, 결과 카드 안쪽 296px
const ZONE = 294;
const HUD = 94;
const CARD = 296;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.how', get: (T) => T.start.how, px: 328 - 27, size: 14, max: 2, what: '한 줄 방법 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지' },
  { key: 'start.modeLabel', get: (T) => T.start.modeLabel, px: 328 - 27, size: 14, max: 1, what: '모드 이름표 한 줄' },
  { key: 'start.modeValue', get: (T) => T.start.modeValue.replace('{n}', '10'), px: 84, size: 17, max: 1, what: '모드 버튼 한 줄' },
  { key: 'play.mode', get: (T) => T.play.mode.replace('{n}', '10'), px: 328, size: 16, max: 1, what: '모드 한 줄' },
  ...['time', 'clicks', 'cps'].map((k) => ({ key: `play.${k}`, get: (T) => T.play[k], px: HUD, size: 12, max: 1, what: 'HUD 이름표 한 줄', factor: 1.05 })),
  { key: 'play.ready', get: (T) => T.play.ready, px: ZONE, size: 26, max: 2, what: '시작 안내 두 줄까지' },
  { key: 'play.readySub', get: (T) => T.play.readySub, px: ZONE, size: 15, max: 2, what: '시작 보조 안내 두 줄까지' },
  { key: 'play.go', get: (T) => T.play.go, px: ZONE, size: 15, max: 1, what: '진행 중 안내 한 줄' },
  { key: 'play.over', get: (T) => T.play.over, px: ZONE, size: 32, max: 2, what: '끝 안내 두 줄까지' },
  { key: 'play.cancelled', get: (T) => T.play.cancelled, px: 328 - 28, size: 14, max: 3, what: '무효 안내 세 줄까지' },
  { key: 'play.change', get: (T) => T.play.change, px: 328 - 28, size: 14, max: 1, what: '모드 바꾸기 한 줄' },
  { key: 'result.over', get: (T) => T.result.over, px: CARD - 28, size: 16, max: 1, what: '결과 배지 한 줄' },
  { key: 'result.mode', get: (T) => T.result.mode.replace('{n}', '10'), px: CARD, size: 15, max: 1, what: '모드 한 줄' },
  { key: 'result.clicks', get: (T) => T.result.clicks, px: (CARD - 8) / 2 - 24, size: 13, max: 1, what: '클릭 수 이름 한 줄', factor: 1.05 },
  { key: 'result.time', get: (T) => T.result.time, px: (CARD - 8) / 2 - 24, size: 13, max: 1, what: '시간 이름 한 줄', factor: 1.05 },
  { key: 'result.tierLabel', get: (T) => T.result.tierLabel, px: CARD, size: 13, max: 1, what: '등급 이름표 한 줄', factor: 1.05 },
  ...[0, 1, 2, 3, 4, 5].map((i) => ({ key: `result.tiers[${i}]`, get: (T) => T.result.tiers[i], px: CARD - 36, size: 22, max: 2, what: '등급 이름 두 줄까지' })),
  { key: 'result.newBest', get: (T) => T.result.newBest, px: CARD - 24, size: 16, max: 1, what: '최고 기록 배지 한 줄' },
  { key: 'result.pb', get: (T) => T.result.pb.replace('{n}', '12.3'), px: CARD, size: 15, max: 2, what: '내 최고 기록 두 줄까지' },
  { key: 'result.tooFast', get: (T) => T.result.tooFast, px: CARD - 28, size: 14, max: 4, what: '너무 빠름 안내 네 줄까지', factor: 1.05 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: CARD - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: CARD - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: CARD - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: CARD - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
const PLACEHOLDERS = [['start.modeValue', ['n']], ['play.mode', ['n']], ['play.sec', ['n']], ['result.mode', ['n']], ['result.pb', ['n']], ['result.top', ['n']],
  ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['cps', 'clicks', 'sec', 'tier']]];
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|상위|popular|ranking|rating|heart|top ?%|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const KEY_Q = /keyboard|키보드|キーボード|键盘|clavier|Tastatur|คีย์บอร์ด|bàn phím|teclado|tastiera|клавиатур/i;
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
    if (!/25/.test(T.result.tooFast)) bad(`${tag} result.tooFast 에 상한 25 가 없음`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else {
      T.faq.forEach((f, i) => {
        if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
        else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
        else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
      });
      if (!T.faq.some((f) => KEY_Q.test(f.q))) bad(`${tag} faq 에 키보드·여러 손가락 질문이 없음`);
      if (!T.faq.some((f) => /25/.test(f.a))) bad(`${tag} faq 에 25 CPS 상한 설명이 없음`);
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
    if (!/cps/i.test(T.meta.title + T.meta.description)) bad(`${tag} meta 에 "CPS" 검색어가 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr') {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.meta]).replace(/https?:[^"]+/g, '');
      const hit = s.match(/.{0,12}[^ \u00a0\u202f"?][?!:;](?=\s|$|')/);
      if (hit) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    if (lang === 'ru' && /\bВы\b|\bвы\b|\bВаш|\bваш/.test(JSON.stringify([T.start, T.play, T.result, T.og, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы/ваш 금지)`);
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
  if (!/<link rel="canonical" href="https:\/\/cps\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/cps\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (연타 게임은 진행 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음`);
      if (/data-mg-end|mg-faq|<details|cp-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="cp-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="cp-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const radios = start.match(/<input type="radio" name="mode" value="(\d+)"( checked)?>/g) || [];
      if (radios.length !== 3 || !/value="5" checked/.test(start)) bad(`${tag} 모드 라디오 3개(5초 기본)`);
      if (!start.includes(`<p class="cp-how">${G.esc(T.start.how)}</p>`)) bad(`${tag} 한 줄 방법 없음`);
      if (T.result.tiers.some((t) => start.includes(G.esc(t)))) bad(`${tag} 시작 화면에 등급 이름 (스포일러)`);
      if (start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length > 620) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['play-mode', 'hud-time', 'hud-clicks', 'hud-cps', 'hud-bar', 'zone', 'ripples', 'zone-main', 'zone-sub', 'play-note', 'change-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/id="zone"[^>]*aria-label="/.test(playS) || !/id="zone-sub"[^>]*aria-live="polite"/.test(playS)) bad(`${tag} 클릭 영역 aria-label / 안내 aria-live`);
      const resAt = end.indexOf('class="cp-result"');
      const endAt = end.indexOf('<div data-mg-end="cps"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="cps" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-mode', 'res-cps', 'res-clicks', 'res-time', 'res-tier', 'res-newbest', 'res-pb', 'res-toofast', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="cp-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (!/id="res-toofast"[^>]*hidden/.test(end)) bad(`${tag} 25 CPS 초과 안내는 처음에 숨김`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (T.result.tiers.some((t) => end.includes(G.esc(t)))) bad(`${tag} 끝 화면 HTML 에 등급 이름 목록 (내 등급만 JS 로)`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('cps-core.js') > 0 && html.indexOf('cps-core.js') < html.indexOf('cps.js"'))) bad(`${tag} cps-core.js 가 cps.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (가이드 제외)`);
  if (!sm.includes('<loc>https://cps.example.com/</loc>') || !sm.includes('<loc>https://cps.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  const js = read('cps.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('cps.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("cps.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('cps.js: 탭 전환(무효)·움직임 줄이기 처리 없음');
  if (!/performance\.now/.test(js) || !/requestAnimationFrame/.test(js)) bad('cps.js: performance.now + requestAnimationFrame');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('cps.js: setShareData/setRetry 없음');
  if (!/addEventListener\('pointerdown'/.test(js)) bad('cps.js: 클릭 영역 pointerdown');
  if (/addEventListener\('(click|mousedown|mouseup|keydown|keyup|keypress)'[^)]*\)/.test(js.replace(/els\.(startBtn|change)\.addEventListener\('click'/g, ''))) bad('cps.js: 클릭 영역은 pointerdown 만 (click/mouse/key 로 세면 두 번 세거나 키보드 연타가 들어감)');
  if (!/LOCK_MS = 6\d\d/.test(js)) bad('cps.js: 끝난 뒤 약 0.6초 입력 잠금(LOCK_MS)');
  if (!/contextmenu/.test(js) || !/dblclick/.test(js)) bad('cps.js: 길게 눌러 메뉴·더블 탭 확대 막기');
  if (!/localStorage/.test(js)) bad('cps.js: 설정·최고 기록 localStorage');
  if (!/supa\.submitScore\(C\.gameKey\(/.test(js)) bad('cps.js: supa.submitScore(C.gameKey(…), …) 로 모드별 실제 백분위');
  if (!/s\.valid/.test(js)) bad('cps.js: 25 CPS 초과(valid=false)는 보내지 않음');
  if (/[가-힣]/.test(js.replace(/\/\/.*$/gm, ''))) bad('cps.js 코드에 한글 문구 (문구는 언어 파일에만)');
  const css = read('style.css');
  if (!/\.cp-zone \{[^}]*touch-action: none/.test(css) || !/\.cp-zone \{[^}]*user-select: none/.test(css) || !/-webkit-touch-callout: none/.test(css)) bad('style.css: 클릭 영역 touch-action:none · user-select:none · touch-callout:none');
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
  if (APP.id !== 'cps' || APP.category !== 'game' || APP.path !== 'https://cps.example.com/' || APP.added !== '2026-11-04' || APP.order !== 1 || APP.emoji !== '🖱️') bad('app.config.js id/emoji/category/path/added/order');
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
console.log('\n결과: 통과 — 로직(모드·게임 이름·CPS·첫 클릭 시작·시간 끝 클릭 무시·등급 경계·25 CPS 상한)·서버 점수 분포(bucket·높을수록 상위 백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), 입력 규칙(pointerdown 만·잠금·확대 막기), OG 이미지 모두 OK');
