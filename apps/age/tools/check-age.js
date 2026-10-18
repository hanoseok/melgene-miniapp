#!/usr/bin/env node
/**
 * 만 나이 계산기 검사 (Node, 브라우저 없음 — 실제 화면 흐름은 tools/check-flow.js).
 *   1) 로직(age-core.js): 윤년·월 말일, 날짜 파싱·선택 상자 값(없는 날짜 거절), UTC 정오 일 번호(연속성·요일),
 *      만 나이 년·개월·일(말일 맞춤: 1/31 → 2/28, 2/29 생 → 평년 2/28), 생일 전날·당일, 다음 생일(2/29 규칙·연말 넘김·당일),
 *      살아온 날·주·개월·시간, 별자리 경계 24개, 띠, 한국 나이(연·세는), 기념일(1만·2만·3만 일, 다음 10단위 생일, 날짜 순·지난 것 표시),
 *      오류(미래 생일·130살 초과·기준일 범위), 서머타임 시간대 5곳(TZ 바꿔 가며: 뉴욕·베를린·로드하우·상파울루·서울)에서 today·날수 정수.
 *   2) 언어 파일 12개: en.js 와 키 구조 동일(복수형 객체는 범주만 다름), TODO-TRANSLATE 없음, 자리표시자, 복수형 범주(Intl.PluralRules) 모두,
 *      별자리 12·띠 12 이름, dateOrder, FAQ 3~5개("무료인가요?" 류 금지), 제목·설명 길이, 360px 폭 문구, h1 검색어 = app.config title,
 *      korea 블록은 ko 만 show(다른 언어는 빈 문자열), 한국어 파일 밖에 한글 없음, fr 좁은 공백, ru 키릴 글꼴, vi 성조 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title = "검색어 | 브랜드" / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(create) / FAQPage 없음 / 첫 화면(#screen-age) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 생년월일 → 기준일 → 계산하기 → 결과(#result, 처음 hidden) 안 카드들 → data-mg-end="age" 순서, 한국 나이 카드 = ko 만,
 *      FAQ 는 MG_FAQ 로만, 스크립트 순서, 선택 상자 순서 = dateOrder.
 *   4) sitemap.xml URL 수(guide.html 제외), app.config.js, favicon, shared 링크, age.js 규칙(track·서버 전송/저장 없음·공유 깨끗한 주소).
 *
 * 실행: node tools/check-age.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'age-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));

// ---------------------------------------------------------------- 시간대 하위 검사 (자식 프로세스: TZ 를 처음부터 바꿔서)
if (process.argv[2] === '--tz') {
  const out = [];
  const bad = (m) => out.push(`[TZ=${process.env.TZ}] ${m}`);
  const p = CORE.parseYmd;
  // [서머타임 시작 전날, 시작일, 다음 날, 끝나는 전날, 끝나는 날, 다음 날] — 2026년 각 시간대 전환일
  const days = {
    'America/New_York': ['2026-03-07', '2026-03-08', '2026-03-09', '2026-10-31', '2026-11-01', '2026-11-02'],
    'Europe/Berlin': ['2026-03-28', '2026-03-29', '2026-03-30', '2026-10-24', '2026-10-25', '2026-10-26'],
    'Australia/Lord_Howe': ['2026-04-04', '2026-04-05', '2026-04-06', '2026-10-03', '2026-10-04', '2026-10-05'],
    'America/Sao_Paulo': ['2026-03-07', '2026-03-08', '2026-03-09', '2026-11-01', '2026-11-02', '2026-11-03'],
    'Asia/Seoul': ['2026-03-07', '2026-03-08', '2026-03-09', '2026-10-31', '2026-11-01', '2026-11-02'],
  }[process.env.TZ].map(p);
  const [a, b, c, d, e, f] = days;
  [[a, b, 1], [a, c, 2], [d, e, 1], [d, f, 2]].forEach(([x, y, n]) => {
    const v = CORE.diffDays(x, y);
    if (!Number.isInteger(v) || v !== n) bad(`diffDays ${CORE.fmtYmd(x)}→${CORE.fmtYmd(y)} = ${v} ≠ ${n}`);
  });
  // 전환일 하루 중 어느 시각이든 today = 그 날짜 (로컬 달력)
  [0, 1, 2, 3, 12, 23].forEach((h) => {
    [b, e].forEach((o) => {
      const t = CORE.today(new Date(o.y, o.m - 1, o.d, h, 30));
      if (CORE.fmtYmd(t) !== CORE.fmtYmd(o)) bad(`today(${CORE.fmtYmd(o)} ${h}:30) = ${CORE.fmtYmd(t)}`);
    });
  });
  // 전환일에 태어난 사람: 다음 날 = 생후 1일, 1년 뒤 같은 날 = 만 1세 0개월 0일 (서머타임 무관)
  [b, e].forEach((birth) => {
    const r1 = CORE.compute(birth, CORE.addDays(birth, 1));
    if (r1.totals.days !== 1 || r1.age.d !== 1) bad(`전환일 출생 다음 날 ${JSON.stringify(r1.age)} / ${r1.totals.days}`);
    const r2 = CORE.compute(birth, { y: birth.y + 1, m: birth.m, d: birth.d });
    if (r2.age.y !== 1 || r2.age.m !== 0 || r2.age.d !== 0 || !r2.next.today) bad(`전환일 출생 1년 뒤 ${JSON.stringify(r2.age)}`);
    if (r2.totals.hours !== r2.totals.days * 24) bad('시간 = 날수 × 24 아님');
  });
  // 로컬 자정끼리 나누면 서머타임 날 소수, core 는 정수
  const naive = (new Date(c.y, c.m - 1, c.d) - new Date(a.y, a.m - 1, a.d)) / 864e5;
  if (CORE.diffDays(a, c) !== Math.round(naive)) bad(`UTC 정오 셈 ${CORE.diffDays(a, c)} ≠ 반올림한 로컬 셈 ${naive}`);
  console.log(JSON.stringify(out));
  process.exit(0);
}

const L10N = G.loadSiteLocales(SITE);
const problems = [];
let passes = 0;
const bad = (m) => problems.push(m);
const ok = (cond, m) => { if (cond) passes++; else bad(m); };
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
const get = (o, pth) => pth.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const p = CORE.parseYmd;
const ymd = CORE.fmtYmd;
const age = (b, t) => { const r = CORE.compute(p(b), p(t)); return r.error ? r.error : [r.age.y, r.age.m, r.age.d]; };

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  eq([1900, 2000, 2023, 2024, 2100, 2400].map(CORE.isLeap), [false, true, false, true, false, true], 'isLeap');
  eq([[2024, 2], [2023, 2], [1900, 2], [2026, 4], [2026, 12]].map(([y, m]) => CORE.daysInMonth(y, m)), [29, 28, 28, 30, 31], 'daysInMonth');
  ['2023-02-29', '2026-13-01', '2026-00-10', '2026-04-31', '1849-12-31', '2200-01-01', '2026-1-1', '', null, ' 2026-10-19'].forEach((s) => ok(!p(s), `parseYmd 가 받아들임: ${s}`));
  ['2024-02-29', '1850-01-01', '2199-12-31', '2026-10-19'].forEach((s) => ok(p(s) && ymd(p(s)) === s, `parseYmd 왕복 실패: ${s}`));
  ok(!CORE.parseYmd('1899-12-31', CORE.AS_OF_MIN, CORE.MAX_YEAR), '기준일 1899 거절');
  // 선택 상자 값
  eq(CORE.fromParts('2000', '2', '29'), { date: { y: 2000, m: 2, d: 29 } }, 'fromParts 2000-02-29');
  eq(CORE.fromParts('2001', '2', '29'), { error: 'badDate' }, 'fromParts 평년 2/29 = badDate');
  eq(CORE.fromParts('2026', '4', '31'), { error: 'badDate' }, 'fromParts 4/31 = badDate');
  eq(CORE.fromParts('', '4', '3'), { error: 'noDate' }, 'fromParts 연도 없음');
  eq(CORE.fromParts('2026', '', '3'), { error: 'noDate' }, 'fromParts 월 없음');
  eq(CORE.fromParts('2026', '4', ''), { error: 'noDate' }, 'fromParts 일 없음');
  eq(CORE.fromParts('abc', '4', '3'), { error: 'noDate' }, 'fromParts 숫자 아님');
  eq(CORE.fromParts('2026', '13', '3'), { error: 'noDate' }, 'fromParts 13월');
  // 일 번호: 연속·요일
  let prev = CORE.dayNumber({ y: 1849, m: 12, d: 31 });
  outer: for (let y = 1850; y <= 2199; y++) {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= CORE.daysInMonth(y, m); d++) {
        const n = CORE.dayNumber({ y, m, d });
        if (n !== prev + 1) { bad(`dayNumber 불연속 ${y}-${m}-${d}`); break outer; }
        prev = n;
        if (d === 1) { const back = CORE.fromDayNumber(n); if (back.y !== y || back.m !== m || back.d !== d) { bad(`fromDayNumber 왕복 ${y}-${m}`); break outer; } }
      }
    }
  }
  passes++;
  eq(['1900-01-01', '1970-01-01', '2000-01-01', '2024-02-29', '2026-10-19', '1990-05-15'].map((s) => CORE.weekday(p(s))), [1, 4, 6, 4, 1, 2], 'weekday (0=일)');
  let wdOk = true;
  for (let i = 0; i < 500; i++) { const o = CORE.addDays(p('1900-01-01'), i * 211); if (CORE.weekday(o) !== new Date(Date.UTC(o.y, o.m - 1, o.d)).getUTCDay()) { wdOk = false; break; } }
  ok(wdOk, 'weekday ≠ Date.getUTCDay');

  // 만 나이 년·개월·일
  eq(age('1990-05-15', '2026-10-19'), [36, 5, 4], '1990-05-15 → 2026-10-19');
  eq(age('1990-05-15', '2026-05-14'), [35, 11, 29], '생일 전날');
  eq(age('1990-05-15', '2026-05-15'), [36, 0, 0], '생일 당일');
  eq(age('2026-10-19', '2026-10-19'), [0, 0, 0], '오늘 태어남');
  eq(age('2026-01-31', '2026-02-28'), [0, 1, 0], '1/31 → 2/28 (평년) = 1개월');
  eq(age('2024-01-31', '2024-02-29'), [0, 1, 0], '1/31 → 2/29 (윤년) = 1개월');
  eq(age('2024-01-31', '2024-02-28'), [0, 0, 28], '1/31 → 2/28 (윤년) = 28일');
  eq(age('2026-01-31', '2026-03-01'), [0, 1, 1], '1/31 → 3/1');
  eq(age('2026-01-31', '2026-03-31'), [0, 2, 0], '1/31 → 3/31 = 2개월');
  eq(age('2026-03-31', '2026-04-30'), [0, 1, 0], '3/31 → 4/30 = 1개월');
  eq(age('2000-02-29', '2025-02-28'), [25, 0, 0], '2/29 생 → 평년 2/28 = 생일');
  eq(age('2000-02-29', '2025-02-27'), [24, 11, 29], '2/29 생 → 평년 2/27');
  eq(age('2000-02-29', '2025-03-01'), [25, 0, 1], '2/29 생 → 평년 3/1');
  eq(age('2000-02-29', '2028-02-28'), [27, 11, 30], '2/29 생 → 윤년 2/28 = 아직 전날');
  eq(age('2000-02-29', '2028-02-29'), [28, 0, 0], '2/29 생 → 윤년 2/29');
  eq(age('1900-03-01', '2026-02-28'), [125, 11, 27], '125살 OK');
  // 오류
  eq(age('2026-10-20', '2026-10-19'), 'future', '미래 생일');
  eq(age('2030-01-01', '2026-10-19'), 'future', '미래 생일 (해)');
  eq(age('1896-10-19', '2026-10-19'), [130, 0, 0], '정확히 130살 OK');
  eq(age('1896-10-18', '2026-10-19'), 'tooOld', '130살 + 1일 = tooOld');
  eq(age('1850-01-01', '2026-10-19'), 'tooOld', '176살 = tooOld');
  eq(CORE.compute(p('1990-01-01'), { y: 1899, m: 12, d: 31 }).error, 'badAsOf', '기준일 1899 = badAsOf');
  eq(CORE.compute(null, p('2026-10-19')).error, 'noDate', '생일 없음 = noDate');

  // 다음 생일
  const nb = (b, t) => { const r = CORE.nextBirthday(p(b), p(t)); return `${ymd(r.date)}:${r.diff}:${r.turning}:${r.today}`; };
  eq(nb('1990-05-15', '2026-10-19'), '2027-05-15:208:37:false', '다음 생일 해 넘김');
  eq(nb('1990-05-15', '2026-05-15'), '2026-05-15:0:36:true', '다음 생일 = 오늘');
  eq(nb('1990-12-31', '2026-12-30'), '2026-12-31:1:36:false', '다음 생일 내일');
  eq(nb('2000-02-29', '2025-03-01'), '2026-02-28:364:26:false', '2/29 생 다음 생일 = 평년 2/28');
  eq(nb('2000-02-29', '2027-03-01'), '2028-02-29:365:28:false', '2/29 생 다음 생일 = 윤년 2/29');
  eq(nb('2000-02-29', '2025-02-28'), '2025-02-28:0:25:true', '2/29 생 평년 2/28 = 오늘 생일');
  eq(nb('2000-01-31', '2026-02-01'), '2027-01-31:364:27:false', '1/31 생 다음 생일');

  // 살아온 날
  const r = CORE.compute(p('1990-05-15'), p('2026-10-19'));
  eq(r.totals, { days: 13306, weeks: 1900, weekRest: 6, months: 437, hours: 319344 }, '살아온 날·주·개월·시간');
  eq(CORE.compute(p('2024-02-29'), p('2025-02-28')).totals.days, 365, '2024-02-29 → 2025-02-28 = 365일');
  eq(CORE.compute(p('2024-01-01'), p('2025-01-01')).totals.days, 366, '윤년 한 해 = 366일');
  eq(r.weekday, 2, '1990-05-15 = 화요일');

  // 별자리 경계 (시작일·전날)
  const Z = [['01-19', 'capricorn'], ['01-20', 'aquarius'], ['02-18', 'aquarius'], ['02-19', 'pisces'], ['03-20', 'pisces'], ['03-21', 'aries'],
    ['04-19', 'aries'], ['04-20', 'taurus'], ['05-20', 'taurus'], ['05-21', 'gemini'], ['06-20', 'gemini'], ['06-21', 'cancer'],
    ['07-22', 'cancer'], ['07-23', 'leo'], ['08-22', 'leo'], ['08-23', 'virgo'], ['09-22', 'virgo'], ['09-23', 'libra'],
    ['10-22', 'libra'], ['10-23', 'scorpio'], ['11-21', 'scorpio'], ['11-22', 'sagittarius'], ['12-21', 'sagittarius'], ['12-22', 'capricorn'], ['12-31', 'capricorn'], ['01-01', 'capricorn']];
  Z.forEach(([md, id]) => { const [m, d] = md.split('-').map(Number); eq(CORE.westernZodiac(m, d), id, `별자리 ${md}`); });
  ok(new Set(CORE.ZODIAC_IDS).size === 12 && CORE.ZODIAC_IDS.every((z) => CORE.ZODIAC_EMOJI[z]), '별자리 12개 + 이모지');
  eq([1900, 1984, 1990, 2000, 2008, 2020, 2024, 2026, 2031].map(CORE.chineseZodiac), ['rat', 'rat', 'horse', 'dragon', 'rat', 'rat', 'dragon', 'horse', 'pig'], '띠(양력 연도)');
  ok(CORE.ANIMALS.length === 12 && CORE.ANIMALS.every((a) => CORE.ANIMAL_EMOJI[a]), '띠 12개 + 이모지');

  // 한국 나이
  eq(CORE.koreanAges(p('1990-12-31'), p('2026-01-01')), { yeon: 36, counting: 37 }, '연 나이·세는 나이 (12/31 생, 1/1 기준)');
  eq(CORE.compute(p('1990-12-31'), p('2026-01-01')).age.y, 35, '만 나이는 35');
  eq(CORE.koreanAges(p('2026-10-19'), p('2026-10-19')), { yeon: 0, counting: 1 }, '갓난아기 세는 나이 1살');

  // 기념일
  const ms = (b, t) => CORE.compute(p(b), p(t)).milestones.map((x) => `${x.kind}${x.n}:${ymd(x.date)}:${x.passed ? 'P' : x.diff}`);
  eq(ms('1990-05-15', '2026-10-19'), ['days10000:2017-09-30:P', 'round40:2030-05-15:1304', 'days20000:2045-02-15:6694', 'days30000:2072-07-03:16694'], '기념일 1990-05-15');
  eq(ms('2016-10-19', '2026-10-19')[0], 'round10:2026-10-19:0', '10번째 생일 당일 = 오늘 기념일');
  eq(ms('2016-10-19', '2026-10-20').find((x) => x.startsWith('round')), 'round20:2036-10-19:3652', '10번째 생일 다음 날 → 20');
  eq(ms('2026-10-19', '2026-10-19').find((x) => x.startsWith('round')), 'round10:2036-10-19:3653', '갓난아기 → 10번째 생일');
  eq(ymd(CORE.addDays(p('2000-01-01'), 10000)), '2027-05-19', '2000-01-01 + 1만 일');
  const all = CORE.compute(p('1950-06-01'), p('2026-10-19')).milestones;
  ok(all.every((x, i) => !i || x.diff >= all[i - 1].diff), '기념일 날짜 순');
  ok(all.filter((x) => x.passed).every((x) => x.diff < 0), '지난 기념일 표시');
  ok(all.length === 4, '기념일 4개');
  eq(CORE.compute(p('2000-02-29'), p('2026-10-19')).leapBirth, true, 'leapBirth 2/29');
  eq(CORE.compute(p('2000-02-28'), p('2026-10-19')).leapBirth, false, 'leapBirth 2/28 아님');
  eq(CORE.BIRTHDAY_RULE, 'feb28', '2/29 규칙 = 2/28');
}

function checkTimezones() {
  ['America/New_York', 'Europe/Berlin', 'Australia/Lord_Howe', 'America/Sao_Paulo', 'Asia/Seoul'].forEach((tz) => {
    const r = spawnSync(process.execPath, [__filename, '--tz'], { env: { ...process.env, TZ: tz }, encoding: 'utf8' });
    if (r.status !== 0) { bad(`TZ=${tz} 하위 검사 실패: ${r.stderr.slice(0, 300)}`); return; }
    try { const list = JSON.parse(r.stdout.trim().split('\n').pop()); list.forEach(bad); if (!list.length) passes++; } catch (e) { bad(`TZ=${tz} 결과 읽기 실패`); }
  });
}

// ---------------------------------------------------------------- 2) 언어 파일
const PLURAL_KEYS = ['zero', 'one', 'two', 'few', 'many', 'other'];
const isPlural = (o) => o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).length && Object.keys(o).every((k) => PLURAL_KEYS.includes(k));
function shapeNoPlural(v) {
  if (isPlural(v)) return 'plural';
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shapeNoPlural(v[k]), o), {});
  return typeof v;
}
function keysDiff(a, b, pth, out) {
  if (typeof a !== typeof b || (typeof a === 'string' && a !== b)) { out.push(`${pth || '(루트)'} 모양 다름`); return; }
  if (typeof a !== 'object') return;
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    if (!(k in b)) out.push(`${pth}${k} 없음`);
    else if (!(k in a)) out.push(`${pth}${k} 이 더 있음`);
    else keysDiff(a[k], b[k], `${pth}${k}.`, out);
  });
}
function tokens(s) { return [...new Set(String(s).match(/\{\w+\}/g) || [])].sort().join(','); }
function walk(obj, fn, pth = '') {
  if (typeof obj === 'string') return fn(obj, pth);
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, pth ? `${pth}.${k}` : k));
}
function pluralPaths(obj, pth = '', out = []) {
  if (isPlural(obj)) { out.push(pth); return out; }
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) Object.entries(obj).forEach(([k, v]) => pluralPaths(v, pth ? `${pth}.${k}` : k, out));
  return out;
}
function checkLocales() {
  const EN = L10N.en;
  const enShape = shapeNoPlural(EN);
  const enPlural = pluralPaths(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  ok(langFiles.length === G.LOCALES.length, `언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    ok(!/TODO-TRANSLATE/.test(first), `${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shapeNoPlural(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    if (!diff.length) passes++;
    const cats = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
    enPlural.forEach((pp) => {
      const o = get(T, pp);
      if (!isPlural(o)) { bad(`${tag} ${pp} 는 복수형 객체여야 함`); return; }
      cats.forEach((c) => ok(!!o[c], `${tag} ${pp}.${c} 없음 (Intl.PluralRules 범주 ${cats.join('/')})`));
      Object.keys(o).forEach((c) => { ok(cats.includes(c), `${tag} ${pp}.${c} 는 이 언어에 없는 범주`); ok(tokens(o[c]) === tokens(get(EN, pp).other), `${tag} ${pp}.${c} 자리표시자 ${tokens(o[c])}`); });
    });
    const enTok = {};
    walk(EN, (s, pth) => { enTok[pth] = tokens(s); });
    walk(T, (s, pth) => {
      if (/^(privacy|faq|korea)\./.test(pth) || enPlural.some((pp) => pth.startsWith(pp + '.'))) return;
      if (enTok[pth] != null && enTok[pth] !== tokens(s)) bad(`${tag} ${pth} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[pth]}`);
    });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.compute', 'ui.birthLabel', 'ui.asOfLabel', 'result.again', 'result.nextTitle', 'errors.future'].forEach((pth) => ok(get(T, pth) !== get(EN, pth), `${tag} ${pth} 가 en 과 같음(번역 안 됨)`));
      ok(T.faq[0].q !== EN.faq[0].q, `${tag} faq 가 en 과 같음`);
    }
    ok(['ymd', 'mdy', 'dmy'].includes(T.dateOrder), `${tag} dateOrder`);
    ok((lang === 'ko' || lang === 'ja' || lang === 'zh') === (T.dateOrder === 'ymd'), `${tag} dateOrder: 한중일 = ymd`);
    CORE.ZODIAC_IDS.forEach((z) => ok(!!T.result.zodiac[z], `${tag} result.zodiac.${z} 없음`));
    CORE.ANIMALS.forEach((a) => ok(!!T.result.animals[a], `${tag} result.animals.${a} 없음`));
    ['days', 'weeks', 'months', 'hours'].forEach((k) => ok(!!T.result.totals[k], `${tag} result.totals.${k} 없음`));
    Object.entries(T.errors).forEach(([k, v]) => ok(typeof v === 'string' && v.length > 5, `${tag} errors.${k} 비었음`));
    // 한국 나이 카드: ko 만
    const K = T.korea;
    if (lang === 'ko') {
      ok(K.show === true, `${tag} korea.show 는 true`);
      Object.entries(K).forEach(([k, v]) => { if (k !== 'show') ok(typeof v === 'string' && v.trim(), `${tag} korea.${k} 비었음`); });
      ok(/2023/.test(K.note) && /6월 28일/.test(K.note) && /만 나이/.test(K.note), `${tag} korea.note 에 2023-06-28 만 나이 통일 안내`);
      ok(K.unit.includes('{n}'), `${tag} korea.unit 에 {n}`);
    } else {
      ok(K.show === false, `${tag} korea.show 는 false (한국 나이는 ko 만)`);
      Object.entries(K).forEach(([k, v]) => { if (k !== 'show') ok(v === '', `${tag} korea.${k} 는 빈 문자열`); });
    }
    // 360px 폭 문구 (버튼 1칸·작은 버튼·선택 상자 3칸·통계 2칸·요일/별자리/띠 3칸)
    const W = [['ui.compute', 26], ['ui.todayBtn', 12], ['ui.year', 9], ['ui.month', 9], ['ui.day', 9], ['result.again', 30], ['hero.h1Kicker', 30],
      ['result.totals.days', 16], ['result.totals.weeks', 16], ['result.totals.months', 16], ['result.totals.hours', 16],
      ['result.weekdayLabel', 14], ['result.zodiacLabel', 14], ['result.animalLabel', 18], ['result.msToday', 14], ['result.msPassed', 14],
      ['result.birthdayToday', 30], ['ui.asOfLabel', 40], ['result.nextTitle', 30]];
    W.forEach(([pth, max]) => { const v = get(T, pth); ok(typeof v === 'string' && width(v) <= max, `${tag} ${pth} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    CORE.ZODIAC_IDS.forEach((z) => ok(width(T.result.zodiac[z]) <= 14, `${tag} 별자리 ${z} 가 김: ${T.result.zodiac[z]}`));
    CORE.ANIMALS.forEach((a) => ok(width(T.result.animals[a]) <= 14, `${tag} 띠 ${a} 가 김: ${T.result.animals[a]}`));
    ok(/<em>/.test(T.hero.h1Html) && !/<(?!\/?(br|em)>)/.test(T.hero.h1Html), `${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      ok(f.q && f.a && !/<|>/.test(f.q + f.a), `${tag} faq[${i}] 비었거나 HTML`);
      ok(!/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q), `${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (lang !== 'ko') walk(T, (s, pth) => ok(!/[가-힯]/.test(s), `${tag} ${pth} 에 한글`));
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    ok(T.meta.title.toLowerCase().startsWith(APP.title[lang].toLowerCase()), `${tag} meta.title 이 현지 검색어(app.config title "${APP.title[lang]}")로 시작하지 않음`);
    ok(T.siteName === APP.title[lang], `${tag} siteName 이 app.config title 과 다름`);
    ok(T.hero.h1Kicker === APP.title[lang], `${tag} h1 검색어가 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    ok(len(title) <= (cjk ? 40 : 72), `${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    ok(dl >= (cjk ? 50 : 100) && dl <= (cjk ? 130 : 220), `${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, pth) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!pth.startsWith('privacy.') && (/[^\s «(  ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${pth} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru') ok(/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css), `${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi') ok(/Be\+Vietnam|Plus\+Jakarta|Baloo/.test(T.fonts.css), `${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
    if (lang === 'th') ok(/Mitr|Prompt|Kanit|Noto\+Sans\+Thai/.test(T.fonts.css), `${tag} 태국어 글꼴이 아님`);
  });
  // seo 검색어
  ok(/^(Age Calculator)/.test(L10N.en.meta.title) && /^만 나이 계산기/.test(L10N.ko.meta.title) && /^年齢計算/.test(L10N.ja.meta.title) && /周岁/.test(L10N.zh.meta.title + L10N.zh.meta.description), '현지 검색어(en/ko/ja/zh) 제목');
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-age"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  ok(title && title.trim(), `${tag} <title> 없음`);
  ok(html.includes(`<html lang="${lang}">`), `${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  ok(h1s === 1, `${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  ok(hl === G.LOCALES.length + 1, `${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  ok(/hreflang="x-default"/.test(html), `${tag} x-default 없음`);
  ok(/<link rel="canonical" href="https:\/\/age\.example\.com\//.test(html), `${tag} canonical 없음`);
  ok(/<header class="mg-top">/.test(html), `${tag} 공통 타이틀 바(G.topBar) 없음`);
  ok(!/FAQPage/.test(html), `${tag} FAQPage JSON-LD 금지`);
  ok(!/aggregateRating/.test(html), `${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/age\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  ok(og, `${tag} og:image 없음`);
  if (og) ok(fs.existsSync(path.join(SITE, og)) && fs.readFileSync(path.join(SITE, og)).readUInt32BE(16) === 1200, `${tag} og:image 파일 없음/크기 다름 ${og} (node tools/gen-og.js all)`);
  ok(/og:locale/.test(html), `${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 공통 스크립트 순서가 다름`);
  ok(!/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html), `${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  ok(!/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, '')), `${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant) ok(/noindex/.test(html), `${tag} 숨은 변형(_l)은 noindex`);
  else ok(!/noindex/.test(html), `${tag} 언어 폴더 페이지에 noindex`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  modes.forEach(([mode, fileOf]) => {
    G.LOCALES.forEach(({ code: lang }) => {
      const T = L10N[lang];
      const f = fileOf(lang, 'index.html');
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      ok(html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`), `${tag} title 이 "검색어 | 브랜드" 가 아님`);
      ok(/"@type":"WebApplication"/.test(html) && /"applicationCategory":"MultimediaApplication"/.test(html), `${tag} appLd(WebApplication, create) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-age) 없음`); return; }
      ok(!/<section id="screen-age"[^>]*hidden/.test(html), `${tag} 첫 화면이 hidden`);
      ok((html.match(/<section[\s>]/g) || []).length === 1, `${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      ok((S.match(/class="mg-ad\b/g) || []).length === 1 && /<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S), `${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      ok((html.match(/class="mg-ad\b/g) || []).length === 1, `${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      ok(S.includes(`<span class="ag-kicker">${G.esc(T.hero.h1Kicker)}</span>`), `${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const order = ['class="ag-h1"', 'id="birth-label"', 'id="asof"', 'id="calc-btn"', 'id="error"', 'id="result"', 'id="result-card"', 'id="r-big"',
        ...(T.korea.show ? ['id="kr-card"'] : []), 'id="next-card"', 'id="totals-card"', 'id="signs-card"', 'id="ms-card"', '<div data-mg-end="age"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 첫 화면 순서(h1 → 생년월일 → 기준일 → 계산하기 → 결과 카드들 → 끝 화면 → 광고)가 아님`);
      ok((html.match(/id="kr-card"/g) || []).length === (lang === 'ko' ? 1 : 0), `${tag} 한국 나이 카드는 ko 에만`);
      if (lang !== 'ko') ok(!/연 나이|세는 나이|counting age|数え年|虚岁|tuổi mụ/i.test(S), `${tag} 첫 화면에 한국식 나이 문구`);
      ok(/<div id="result" class="ag-result" hidden>/.test(S), `${tag} 결과·끝 화면(#result)은 처음에 hidden`);
      ok((html.match(/data-mg-end=/g) || []).length === 1, `${tag} data-mg-end 는 1개`);
      const sel = ['by', 'bm', 'bd'].map((id) => S.indexOf(`id="${id}"`));
      const want = { ymd: [0, 1, 2], mdy: [2, 0, 1], dmy: [2, 1, 0] }[T.dateOrder];   // 각 상자(y,m,d)의 자리
      const rank = sel.map((v) => [...sel].sort((x, y) => x - y).indexOf(v));
      ok(sel.every((i) => i > 0) && JSON.stringify(rank) === JSON.stringify(want), `${tag} 선택 상자 순서가 dateOrder(${T.dateOrder}) 와 다름`);
      ok(/id="asof" class="ag-input ag-date" type="date" min="1900-01-01" max="2199-12-31"/.test(S), `${tag} 기준일 입력 범위`);
      ok(!/id="asof"[^>]*\bvalue=/.test(S), `${tag} 기준일에 미리 채운 값`);
      ok(/id="live" class="visually-hidden" aria-live="polite"/.test(S), `${tag} 결과 읽어 주기(aria-live) 없음`);
      ok(/id="error" class="ag-error" role="alert" hidden/.test(S), `${tag} 오류 안내(role=alert) 없음`);
      ok(!/mg-faq|<details/.test(S), `${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      ok(!T.faq.some((q) => bodyNoJson.includes(G.esc(q.q))), `${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ok(/window\.MG_FAQ = \[/.test(html), `${tag} MG_FAQ 없음`);
      ok(/window\.PAGE_I18N = /.test(html), `${tag} PAGE_I18N 없음`);
      ok(html.indexOf('age-core.js') > 0 && html.indexOf('age-core.js') < html.indexOf('age.js"'), `${tag} age-core.js 가 age.js 보다 먼저여야 함`);
      ok(/family=Baloo\+2/.test(html), `${tag} 숫자 글꼴(Baloo 2) 없음`);
      ok(/guide\.html/.test(html) && /<meta name="mg-guide"/.test(html), `${tag} 가이드 링크(gen-guides) 없음`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  ok(pages === G.LOCALES.length * 4, `생성 페이지 ${pages}개 ≠ ${G.LOCALES.length * 4}`);
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  ok(urls === G.LOCALES.length, `sitemap.xml URL ${urls}개 ≠ ${G.LOCALES.length} (guide 제외)`);
  ok((sm.match(/<loc>[^<]*guide\.html/g) || []).length === G.LOCALES.length, 'sitemap.xml 에 guide.html 12개');
  ok(/<lastmod>/.test(sm) && /xhtml:link/.test(sm), 'sitemap lastmod·xhtml:link');
  return pages;
}

// ---------------------------------------------------------------- 4) 그 밖
function checkMisc() {
  ok(APP.id === 'age' && APP.category === 'create' && APP.added === '2026-10-19' && APP.order === 1 && APP.emoji === '🎂' && APP.path === 'https://age.example.com/', 'app.config.js 기본값');
  G.LOCALES.forEach(({ code }) => { ok(APP.title[code] && APP.desc[code], `app.config ${code} 제목·설명`); ok(width(APP.title[code]) <= 24, `app.config title ${code} 가 김(포털 아이콘): ${APP.title[code]}`); });
  ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg');
  let link = '';
  try { link = fs.readlinkSync(path.join(SITE, 'shared')); } catch (e) { /* noop */ }
  ok(link === '../../shared', 'shared → ../../shared 심볼릭 링크');
  const js = read('age.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');   // 주석 빼고
  ok((js.match(/track\('start'\)/g) || []).length === 1 && (js.match(/track\('done'\)/g) || []).length === 1, 'age.js: track start/done 각 1곳');
  ok(/setRetry\(/.test(js) && /setShareData\(/.test(js), 'age.js: setRetry·setShareData');
  ok(!/localStorage|sessionStorage|indexedDB|document\.cookie/.test(js), 'age.js: 생년월일을 저장하지 않음(storage 없음)');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js), 'age.js: 서버 전송 없음');
  ok(!/location\.hash\s*=|history\.(push|replace)State|#d=/.test(js), 'age.js: 주소에 생년월일을 넣지 않음');
  ok(/mgCleanUrl/.test(js), 'age.js: 공유 주소 = mgCleanUrl');
  const core = read('age-core.js');
  ok(/Date\.UTC\(o\.y, o\.m - 1, o\.d, 12\)/.test(core), 'age-core.js: UTC 정오 일 번호');
}

checkLogic();
checkTimezones();
checkLocales();
const pages = checkHtml();
checkMisc();

if (problems.length) {
  console.log(`\n✗ check-age: 문제 ${problems.length}건 (통과 ${passes})`);
  problems.forEach((m) => console.log('  - ' + m));
  process.exit(1);
}
console.log(`PASS check-age: 로직·서머타임 5곳·언어 12개·HTML ${pages}쪽·사이트맵 — 검사 ${passes}건 통과`);
