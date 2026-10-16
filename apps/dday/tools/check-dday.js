#!/usr/bin/env node
/**
 * 디데이 계산기 검사 (Node, 브라우저 없음 — 실제 화면 흐름은 tools/check-flow.js).
 *   1) 로직(dday-core.js): 윤년·월 말일, 날짜 파싱(없는 날짜 거절), UTC 정오 일 번호(연속성·요일), 더하기/빼기(2024-02-29 ±365/366, 세기 윤년),
 *      서머타임 시간대 여러 곳(TZ 바꿔 가며: 뉴욕·베를린·로드하우(30분)·상파울루·서울)에서 날짜 차이가 정수·D-n 정확, 남은 시간 = 실제 시간(23·25시간 하루),
 *      D-DAY 정확히 0(그날 0시·23:59), 며칠째(1일로 세기 켬/끔, 시작일 당일·미래), 기념일(100일 = 시작+99 / +100, 2/29 주년 → 평년 2/28, 오늘 포함·날짜 순),
 *      년·개월·일 차이(말일 맞춤), 빠른 선택(오늘 포함 가장 가까운 그날, 연말 넘김), 제목 다듬기, 날수 입력, #d= 왕복·변조 거절, 저장 목록(중복·10개·모양 검사).
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, 복수형 범주(Intl.PluralRules) 모두, FAQ 3~5개("무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구(버튼·탭·칩·단위), h1 검색어 = app.config title, fr 좁은 공백, ru 키릴 글꼴, vi 성조 글꼴, 한국어 파일 밖에 한글 없음, defaults.day1.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-dd) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 탭 → 입력 → 계산하기 → 저장 목록 → 결과(#result, 처음 hidden) 안 카드 → 버튼 → 기념일 → data-mg-end="dday" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지 1200×630 PNG, app.config.js, favicon, shared 링크, dday.js 규칙(track·localStorage try·서버 전송 없음·공통 공유 깨끗한 주소).
 *
 * 실행: node tools/check-dday.js
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'dday-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));

// ---------------------------------------------------------------- 시간대 하위 검사 (자식 프로세스: TZ 를 처음부터 바꿔서)
if (process.argv[2] === '--tz') {
  const out = [];
  const bad = (m) => out.push(`[TZ=${process.env.TZ}] ${m}`);
  const p = CORE.parseYmd;
  const tzCases = {
    // [서머타임 시작 전날 정오, 시작일, 다음 날] — 각 시간대의 2026년 봄 전환일
    'America/New_York': ['2026-03-07', '2026-03-08', '2026-03-09', '2026-10-31', '2026-11-01', '2026-11-02'],
    'Europe/Berlin': ['2026-03-28', '2026-03-29', '2026-03-30', '2026-10-24', '2026-10-25', '2026-10-26'],
    'Australia/Lord_Howe': ['2026-04-04', '2026-04-05', '2026-04-06', '2026-10-03', '2026-10-04', '2026-10-05'],
    'America/Sao_Paulo': ['2026-03-07', '2026-03-08', '2026-03-09', '2026-11-01', '2026-11-02', '2026-11-03'],
    'Asia/Seoul': ['2026-03-07', '2026-03-08', '2026-03-09', '2026-10-31', '2026-11-01', '2026-11-02'],
  }[process.env.TZ];
  const [a, b, c, d, e, f] = tzCases.map(p);
  // 날짜 차이는 정수, 시간대·서머타임과 무관
  [[a, b, 1], [a, c, 2], [d, f, 2], [a, f, CORE.diffDays(a, f)]].forEach(([x, y, n]) => {
    const v = CORE.diffDays(x, y);
    if (!Number.isInteger(v) || v !== n) bad(`diffDays ${CORE.fmtYmd(x)}→${CORE.fmtYmd(y)} = ${v} ≠ ${n}`);
  });
  // 로컬 자정 차이를 그냥 나누면 서머타임 날 소수가 되지만, core 는 정수
  const naive = (new Date(c.y, c.m - 1, c.d) - new Date(a.y, a.m - 1, a.d)) / 864e5;
  if (CORE.diffDays(a, c) !== Math.round(naive)) bad(`UTC 정오 셈 ${CORE.diffDays(a, c)} ≠ 반올림한 로컬 셈 ${naive}`);
  // 오늘 = 전환 전날 12:00 → 이틀 뒤 0시: D-2, 남은 실제 시간 = 36h ± 서머타임 차이
  const now = new Date(a.y, a.m - 1, a.d, 12, 0, 0).getTime();
  const r = CORE.compute({ k: 'countdown', t: '', d: c, h: null, e: 0, c: 0 }, now);
  const realMs = new Date(c.y, c.m - 1, c.d, 0, 0, 0).getTime() - now;
  if (r.label !== 'D-2' || r.diff !== 2) bad(`서머타임 앞 D-2 아님: ${r.label}`);
  if (r.ms !== realMs) bad(`남은 ms ${r.ms} ≠ 실제 ${realMs}`);
  const bd = CORE.breakdown(r.ms);
  if (bd.days * 86400000 + bd.h * 3600000 + bd.m * 60000 + bd.s * 1000 !== Math.floor(realMs / 1000) * 1000) bad(`breakdown 합 ${JSON.stringify(bd)}`);
  // 그날 0시 직후·23:59 = D-DAY, 그 전날 23:59 = D-1
  const at = (o, h, m) => new Date(o.y, o.m - 1, o.d, h, m, 0).getTime();
  [[at(b, 0, 0), 'D-DAY'], [at(b, 23, 59), 'D-DAY'], [at(a, 23, 59), 'D-1'], [at(c, 0, 1), 'D+1']].forEach(([t, want]) => {
    const x = CORE.compute({ k: 'countdown', t: '', d: b, h: null, e: 0, c: 0 }, t);
    if (x.label !== want) bad(`${new Date(t).toString().slice(0, 24)} 에 ${x.label} ≠ ${want}`);
    if (want === 'D-DAY' && x.diff !== 0) bad('D-DAY 인데 diff ≠ 0');
  });
  // 며칠째: 전환일을 지나도 하루씩
  const s1 = CORE.compute({ k: 'since', t: '', d: a, o: true, e: 0, c: 0 }, at(c, 9, 0));
  const s0 = CORE.compute({ k: 'since', t: '', d: a, o: false, e: 0, c: 0 }, at(c, 9, 0));
  if (s1.count !== 3 || s0.count !== 2) bad(`며칠째 서머타임 넘어 ${s1.count}/${s0.count} ≠ 3/2`);
  // 오늘 = 로컬 달력 날짜
  const t0 = CORE.today(new Date(b.y, b.m - 1, b.d, 23, 30));
  if (CORE.fmtYmd(t0) !== CORE.fmtYmd(b)) bad(`today ${CORE.fmtYmd(t0)}`);
  // 시각 지정: 그날 09:30 까지
  const h = CORE.compute({ k: 'countdown', t: '', d: c, h: { h: 9, min: 30 }, e: 0, c: 0 }, now);
  if (h.ms !== new Date(c.y, c.m - 1, c.d, 9, 30).getTime() - now) bad('시각 지정 남은 ms');
  console.log(JSON.stringify(out));
  process.exit(0);
}

const L10N = G.loadSiteLocales(SITE);
const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const p = CORE.parseYmd;
const ymd = CORE.fmtYmd;

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  // 윤년·말일
  eq([1900, 2000, 2023, 2024, 2100, 2400].map(CORE.isLeap), [false, true, false, true, false, true], 'isLeap');
  eq([[2024, 2], [2023, 2], [1900, 2], [2026, 4], [2026, 12]].map(([y, m]) => CORE.daysInMonth(y, m)), [29, 28, 28, 30, 31], 'daysInMonth');
  // 파싱
  ['2023-02-29', '2026-13-01', '2026-00-10', '2026-04-31', '1899-12-31', '2200-01-01', '2026-1-1', '', null, '2026-10-17T00:00', ' 2026-10-17'].forEach((s) => { if (p(s)) bad(`parseYmd 가 받아들임: ${s}`); });
  ['2024-02-29', '1900-01-01', '2199-12-31', '2026-10-17'].forEach((s) => { if (!p(s) || ymd(p(s)) !== s) bad(`parseYmd 왕복 실패: ${s}`); });
  eq(CORE.parseHm('09:05'), { h: 9, min: 5 }, 'parseHm');
  ['24:00', '9:05', '12:60', ''].forEach((s) => { if (CORE.parseHm(s)) bad(`parseHm 가 받아들임 ${s}`); });
  // 일 번호: 연속·왕복·요일
  let prev = CORE.dayNumber({ y: 1899, m: 12, d: 31 });
  for (let y = 1900; y <= 2199; y += 1) {
    for (let m = 1; m <= 12; m++) {
      for (let d = 1; d <= CORE.daysInMonth(y, m); d++) {
        const n = CORE.dayNumber({ y, m, d });
        if (n !== prev + 1) { bad(`dayNumber 불연속 ${y}-${m}-${d}`); return; }
        prev = n;
        if (d === 1 || d === 28) { const back = CORE.fromDayNumber(n); if (back.y !== y || back.m !== m || back.d !== d) { bad(`fromDayNumber 왕복 ${y}-${m}-${d}`); return; } }
      }
    }
  }
  eq(['1900-01-01', '1970-01-01', '2000-01-01', '2024-02-29', '2026-10-17', '2026-12-25', '2199-12-31'].map((s) => CORE.weekday(p(s))), [1, 4, 6, 4, 6, 5, 2], 'weekday (0=일)');
  for (let i = 0; i < 400; i++) { const o = CORE.addDays(p('2026-01-01'), i * 37 - 5000); if (CORE.weekday(o) !== new Date(Date.UTC(o.y, o.m - 1, o.d)).getUTCDay()) { bad(`weekday ≠ Date ${ymd(o)}`); break; } }
  // 더하기/빼기
  eq([
    ymd(CORE.addDays(p('2024-02-29'), 365)), ymd(CORE.addDays(p('2024-02-29'), 366)), ymd(CORE.addDays(p('2024-02-29'), -365)),
    ymd(CORE.addDays(p('2024-03-01'), -1)), ymd(CORE.addDays(p('2023-03-01'), -1)), ymd(CORE.addDays(p('1900-02-28'), 1)), ymd(CORE.addDays(p('2000-02-28'), 1)),
    ymd(CORE.addDays(p('2026-12-31'), 1)), ymd(CORE.addDays(p('2026-10-17'), 0)), ymd(CORE.addDays(p('2026-10-17'), 99999)),
  ], ['2025-02-28', '2025-03-01', '2023-03-01', '2024-02-29', '2023-02-28', '1900-03-01', '2000-02-29', '2027-01-01', '2026-10-17', '2300-08-01'], 'addDays');
  eq([CORE.diffDays(p('2024-01-01'), p('2025-01-01')), CORE.diffDays(p('2025-01-01'), p('2026-01-01')), CORE.diffDays(p('2026-10-17'), p('2026-10-10')), CORE.diffDays(p('1900-01-01'), p('2199-12-31'))],
    [366, 365, -7, 109572], 'diffDays');
  // 디데이 표기
  eq([5, 1, 0, -1, -30].map(CORE.ddayLabel), ['D-5', 'D-1', 'D-DAY', 'D+1', 'D+30'], 'ddayLabel');
  eq([5, 0, -2].map(CORE.ddayState), ['future', 'today', 'past'], 'ddayState');
  eq(CORE.breakdown(93784000), { days: 1, h: 2, m: 3, s: 4 }, 'breakdown');
  eq(CORE.breakdown(-61000), { days: 0, h: 0, m: 1, s: 1 }, 'breakdown 음수 = 절댓값');
  // 며칠째 (한국 100일: 시작일 = 1일)
  const st = p('2026-01-01');
  eq([CORE.sinceCount(st, st, true), CORE.sinceCount(st, st, false), CORE.sinceCount(st, p('2026-04-10'), true), CORE.sinceCount(st, p('2026-04-10'), false)], [1, 0, 100, 99], 'sinceCount');
  eq([ymd(CORE.dayOf(st, 100, true)), ymd(CORE.dayOf(st, 100, false)), ymd(CORE.dayOf(st, 1000, true)), ymd(CORE.dayOf(p('2024-02-29'), 365, false))], ['2026-04-10', '2026-04-11', '2028-09-26', '2025-02-28'], 'dayOf');
  // compute: since (오늘·미래)
  const at = (s, h) => { const o = p(s); return new Date(o.y, o.m - 1, o.d, h || 12).getTime(); };
  let s = CORE.compute({ k: 'since', t: '', d: st, o: true, e: 0, c: 0 }, at('2026-04-10', 23));
  if (s.count !== 100 || s.state !== 'running' || s.milestones[0].n !== 100 || s.milestones[0].diff !== 0 || s.milestones[0].kind !== 'days') bad(`100일째 ${JSON.stringify(s).slice(0, 200)}`);
  eq(s.ymd, { y: 0, m: 3, d: 9 }, '100일째 년·개월·일');
  eq(s.weeks, { w: 14, d: 1 }, '100일째 주');
  s = CORE.compute({ k: 'since', t: '', d: p('2026-12-24'), o: true, e: 0, c: 0 }, at('2026-12-20'));
  if (s.state !== 'future' || s.until !== 4 || s.label !== 'D-4' || s.ymd !== null) bad(`미래 시작일 ${JSON.stringify(s).slice(0, 160)}`);
  // 기념일: 2/29 시작 → 평년 2/28, 윤년 2/29, 날짜 순, 오늘 포함, 최대 6개
  const ms = CORE.milestones(p('2024-02-29'), p('2024-03-01'), false, 20);
  const years = ms.filter((x) => x.kind === 'years').map((x) => ymd(x.date));
  eq(years.slice(0, 4), ['2025-02-28', '2026-02-28', '2027-02-28', '2028-02-29'], '2/29 주년');
  if (ms.some((x, i) => i && x.diff < ms[i - 1].diff)) bad('기념일이 날짜 순이 아님');
  if (ms.some((x) => x.diff < 0)) bad('지난 기념일이 들어감');
  eq(CORE.milestones(st, p('2026-04-10'), true).length, 6, '기념일 기본 6개');
  eq(CORE.milestones(st, p('2026-04-11'), true)[0].n, 200, '100일 다음 날에는 200일부터');
  // 년·개월·일 차이
  eq([['2026-01-31', '2026-02-28'], ['2024-02-29', '2025-02-28'], ['2026-01-15', '2026-03-14'], ['2020-05-05', '2026-10-17'], ['2026-10-17', '2026-10-17']].map(([a, b]) => CORE.calendarDiff(p(a), p(b))),
    [{ y: 0, m: 1, d: 0 }, { y: 1, m: 0, d: 0 }, { y: 0, m: 1, d: 27 }, { y: 6, m: 5, d: 12 }, { y: 0, m: 0, d: 0 }], 'calendarDiff');
  if (CORE.calendarDiff(p('2026-10-18'), p('2026-10-17')) !== null) bad('calendarDiff 거꾸로 = null');
  // 빠른 선택: 오늘 포함 가장 가까운 그날
  const pr = (s) => CORE.presets(p(s)).map((x) => `${x.id}:${ymd(x.date)}:${x.diff}`);
  eq(pr('2026-10-17'), ['halloween:2026-10-31:14', 'christmas:2026-12-25:69', 'newyear:2027-01-01:76', 'valentine:2027-02-14:120'], '빠른 선택 10/17');
  eq(pr('2026-10-31')[0], 'halloween:2026-10-31:0', '할로윈 당일 = D-DAY');
  eq(pr('2026-12-26'), ['newyear:2027-01-01:6', 'valentine:2027-02-14:50', 'halloween:2027-10-31:309', 'christmas:2027-12-25:364'], '빠른 선택 연말 넘김');
  eq(pr('2028-01-01')[0], 'newyear:2028-01-01:0', '새해 당일');
  // math
  const m = CORE.compute({ k: 'math', t: '', d: p('2024-02-29'), n: -366, e: 0, c: 0 }, at('2026-10-17'));
  if (ymd(m.result) !== '2023-02-28' || m.weekday !== 2) bad(`날짜 계산 2024-02-29 −366 = ${ymd(m.result)} (${m.weekday})`);
  // 입력 다듬기
  eq(CORE.cleanTitle('  우리  <b>사귄</b>\n날 💖 '), '우리 b 사귄 /b 날 💖', 'cleanTitle');
  eq(Array.from(CORE.cleanTitle('가'.repeat(60))).length, CORE.MAX_TITLE, 'cleanTitle 40자');
  eq(CORE.cleanTitle(null), '', 'cleanTitle null');
  eq(['100', '+7', '-30', '0', '99999', '100000', '1.5', 'abc', '', ' 12 '].map(CORE.cleanN), [100, 7, -30, 0, 99999, null, null, null, null, 12], 'cleanN');

  // #d= 왕복
  const recs = [
    { k: 'countdown', t: 'Summer trip ✈️', d: p('2027-07-01'), h: null, e: 7, c: 3 },
    { k: 'countdown', t: '', d: p('2026-12-24'), h: { h: 18, min: 30 }, e: 10, c: 0 },
    { k: 'since', t: '우리 사귄 날 💖', d: p('2026-01-01'), o: true, e: 3, c: 2 },
    { k: 'since', t: 'Наш день «1»', d: p('1999-12-31'), o: false, e: 5, c: 4 },
    { k: 'math', t: 'x'.repeat(40), d: p('2024-02-29'), n: -99999, e: 0, c: 1 },
  ];
  recs.forEach((r, i) => {
    const code = CORE.encodeShare(r);
    if (!code || !/^[A-Za-z0-9_-]+$/.test(code)) { bad(`encodeShare[${i}] 실패`); return; }
    const d = CORE.decodeShare(code);
    if (!d || !CORE.sameRec(d, r)) bad(`#d= 왕복 ${i}: ${JSON.stringify(d)}`);
  });
  if (CORE.encodeShare({ k: 'since', t: '', d: p('2026-01-01'), e: 0, c: 0 }) !== null) bad('encodeShare: since 인데 o 없음을 받아들임');
  // 변조 거절
  const raw = (o) => CORE.b64urlEncode(JSON.stringify(o));
  const base = { v: 1, k: 'c', t: 'Hi', d: '2026-12-25', e: 0, c: 0 };
  const rejects = [
    ['v 2', { ...base, v: 2 }], ['모드 x', { ...base, k: 'x' }], ['모드 이름', { ...base, k: 'countdown' }], ['없는 날짜', { ...base, d: '2026-02-30' }], ['범위 밖', { ...base, d: '2200-01-01' }],
    ['날짜 숫자', { ...base, d: 20261225 }], ['시각 25시', { ...base, h: '25:00' }], ['시각 숫자', { ...base, h: 900 }], ['since 에 시각', { ...base, k: 's', o: 1, h: '10:00' }],
    ['since o 없음', { ...base, k: 's' }], ['o 2', { ...base, k: 's', o: 2 }], ['o true', { ...base, k: 's', o: true }], ['countdown 에 o', { ...base, o: 1 }],
    ['math n 없음', { ...base, k: 'm' }], ['n 소수', { ...base, k: 'm', n: 1.5 }], ['n 너무 큼', { ...base, k: 'm', n: 100000 }], ['n 문자열', { ...base, k: 'm', n: '5' }], ['countdown 에 n', { ...base, n: 5 }],
    ['이모지 범위', { ...base, e: CORE.EMOJIS.length }], ['색 음수', { ...base, c: -1 }], ['색 소수', { ...base, c: 0.5 }], ['제목 꺾쇠', { ...base, t: '<script>' }],
    ['제목 41자', { ...base, t: 'x'.repeat(41) }], ['제목 앞 공백', { ...base, t: ' Hi' }], ['제목 숫자', { ...base, t: 5 }], ['제목 없음', { ...base, t: undefined }], ['모르는 키', { ...base, z: 1 }], ['배열', [1, 2]],
  ];
  rejects.forEach(([name, o]) => { if (CORE.decodeShare(raw(o))) bad(`decodeShare 가 변조를 받아들임: ${name}`); });
  if (!CORE.decodeShare(raw(base))) bad('decodeShare 기본 레코드 거절');
  ['', '!!!', 'a b', 'x'.repeat(1200), CORE.b64urlEncode('not json'), 'AAAA'].forEach((x) => { if (CORE.decodeShare(x)) bad(`decodeShare 쓰레기 입력 받아들임: ${x.slice(0, 20)}`); });
  if (CORE.decodeShare(Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''))) bad('잘못된 UTF-8 받아들임');

  // 저장 목록
  let list = [];
  for (let i = 0; i < 12; i++) list = CORE.pushSaved(list, { k: 'math', t: 'n' + i, d: p('2026-01-01'), n: i, e: 0, c: 0 }, 1000 + i).list;
  eq(list.length, CORE.SAVED_MAX, '저장 최대 10개');
  eq([list[0].t, list[9].t], ['n11', 'n2'], '저장 최신이 맨 앞, 오래된 것부터 빠짐');
  const full = CORE.pushSaved(list, recs[0], 5000);
  if (!full.dropped || full.dupe) bad('10개일 때 새로 저장 → dropped');
  const dupe = CORE.pushSaved(full.list, recs[0], 6000);
  if (!dupe.dupe || dupe.list.length !== 10 || dupe.list[0].id !== 6000 || dupe.list.filter((x) => x.t === recs[0].t).length !== 1) bad('같은 것 저장 → 맨 앞으로, 하나만');
  const ser = CORE.serializeSaved(dupe.list);
  const back = CORE.cleanSaved(JSON.parse(JSON.stringify(ser)));
  if (back.length !== 10 || !CORE.sameRec(back[0], recs[0]) || back[0].id !== 6000) bad('저장 목록 직렬화 왕복');
  eq(CORE.cleanSaved([{ ...ser[0] }, { ...ser[1], id: 'x' }, { ...ser[2], d: '2026-02-31' }, null, 'x', { ...ser[3], k: 'q' }]).length, 1, 'cleanSaved 모양 틀린 항목 버림');
  eq(CORE.cleanSaved('nope'), [], 'cleanSaved 배열 아님');
  eq(CORE.EMOJIS.length, 12, '이모지 12개');
  eq(CORE.THEMES.map((t) => t.id), ['tomato', 'mint', 'grape', 'ocean', 'ink'], '테마');
}

function checkTimezones() {
  ['America/New_York', 'Europe/Berlin', 'Australia/Lord_Howe', 'America/Sao_Paulo', 'Asia/Seoul'].forEach((tz) => {
    const r = spawnSync(process.execPath, [__filename, '--tz'], { env: { ...process.env, TZ: tz }, encoding: 'utf8' });
    if (r.status !== 0) { bad(`TZ=${tz} 하위 검사 실패: ${r.stderr.slice(0, 300)}`); return; }
    try { JSON.parse(r.stdout.trim().split('\n').pop()).forEach(bad); } catch (e) { bad(`TZ=${tz} 결과 읽기 실패`); }
  });
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(v) {
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shape(v[k]), o), {});
  return typeof v;
}
// 복수형 객체(one/few/many/other 만 있는 객체)는 언어마다 범주가 달라 모양 비교에서 뺀다
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
  if (langFiles.length !== G.LOCALES.length) bad(`언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    if (/TODO-TRANSLATE/.test(first)) bad(`${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shapeNoPlural(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    // 복수형: 그 언어의 범주가 모두 있고, 자리표시자가 en 과 같은지
    const cats = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
    enPlural.forEach((pp) => {
      const o = get(T, pp);
      if (!isPlural(o)) { bad(`${tag} ${pp} 는 복수형 객체여야 함`); return; }
      cats.forEach((c) => { if (!o[c]) bad(`${tag} ${pp}.${c} 없음 (Intl.PluralRules 범주 ${cats.join('/')})`); });
      Object.keys(o).forEach((c) => { if (!cats.includes(c)) bad(`${tag} ${pp}.${c} 는 이 언어에 없는 범주`); if (tokens(o[c]) !== tokens(EN[pp.split('.')[0]][pp.split('.')[1]].other)) bad(`${tag} ${pp}.${c} 자리표시자 ${tokens(o[c])}`); });
    });
    const enTok = {};
    walk(EN, (s, pth) => { enTok[pth] = tokens(s); });
    walk(T, (s, pth) => { if (pth.startsWith('privacy.') || pth.startsWith('faq.') || enPlural.some((pp) => pth.startsWith(pp + '.'))) return; if (enTok[pth] != null && enTok[pth] !== tokens(s)) bad(`${tag} ${pth} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[pth]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.compute', 'ui.modeLabel', 'ui.day1Label', 'result.again', 'result.makeOwn', 'ui.savedTitle'].forEach((pth) => { if (get(T, pth) === get(EN, pth)) bad(`${tag} ${pth} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    if (typeof T.defaults.day1 !== 'boolean') bad(`${tag} defaults.day1 은 true/false`);
    if ((lang === 'ko') !== T.defaults.day1) bad(`${tag} defaults.day1: 한국어만 켬(100일 셈법)`);
    CORE.MODES.forEach((m) => ['modes', 'modeHints', 'modeIcons', 'titlePh', 'dateLabel'].forEach((k) => { if (!T.ui[k][m]) bad(`${tag} ui.${k}.${m} 없음`); }));
    CORE.MODES.forEach((m) => { if (!T.result.untitled[m]) bad(`${tag} result.untitled.${m} 없음`); });
    CORE.PRESETS.forEach((pr) => { if (!T.ui.presets[pr.id]) bad(`${tag} ui.presets.${pr.id} 없음`); });
    CORE.THEMES.forEach((th) => { if (!T.ui.themes[th.id]) bad(`${tag} ui.themes.${th.id} 없음`); });
    // 360px 폭 문구 (탭 3칸·빠른 선택 2칸·버튼 2칸·단위 4칸)
    const W = [['ui.compute', 24], ['ui.todayBtn', 8], ['ui.after', 18], ['ui.before', 18], ['ui.daysUnit', 6], ['result.savePng', 20], ['result.copyLink', 20], ['result.saveList', 34],
      ['result.again', 24], ['result.makeOwn', 24], ['result.sharedBadge', 30], ['result.dday', 10], ['result.milestoneToday', 12], ['hero.h1Kicker', 30],
      ['result.units.d', 8], ['result.units.h', 8], ['result.units.m', 8], ['result.units.s', 8], ['ui.titleLabel', 36], ['ui.day1Label', 44],
      ...CORE.MODES.map((m) => [`ui.modes.${m}`, 16]), ...CORE.PRESETS.map((pr) => [`ui.presets.${pr.id}`, 24])];
    W.forEach(([pth, max]) => { const v = get(T, pth); if (typeof v !== 'string' || width(v) > max) bad(`${tag} ${pth} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    if (len(T.ui.titlePh.since) > 36) bad(`${tag} ui.titlePh 가 김`);
    // 제목·h1
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (lang !== 'ko') walk(T, (s, pth) => { if (/[가-힯]/.test(s)) bad(`${tag} ${pth} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    if (T.hero.h1Kicker !== APP.title[lang]) bad(`${tag} h1 검색어가 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 72)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, pth) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!pth.startsWith('privacy.') && (/[^\s «( ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${pth} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Be\+Vietnam|Plus\+Jakarta|Unbounded|Baloo/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-dd"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
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
  if (!/<link rel="canonical" href="https:\/\/dday\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/dday\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"MultimediaApplication"/.test(html)) bad(`${tag} appLd(WebApplication, create) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-dd) 없음`); return; }
      if (/<section id="screen-dd"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!S.includes(`<span class="dd-kicker">${G.esc(T.hero.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const order = ['class="dd-h1"', 'data-mode="countdown"', 'data-mode="math"', 'id="title"', 'id="date"', 'data-preset=', 'id="time"', 'id="day1"', 'id="ndays"', 'data-emoji="0"', 'data-theme="0"',
        'id="calc-btn"', 'id="saved-card"', 'id="result"', 'id="result-card"', 'id="r-big"', 'id="r-live"', 'id="png-btn"', 'id="link-btn"', 'id="save-btn"', 'id="ms-card"', '<div data-mg-end="dday"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 탭 → 입력 → 계산하기 → 저장 목록 → 카드 → 버튼 → 기념일 → 끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="dd-result" hidden>/.test(S)) bad(`${tag} 결과·끝 화면(#result)은 처음에 hidden`);
      if (!/<div id="saved-card" class="dd-card dd-saved" hidden>/.test(S)) bad(`${tag} 저장 목록은 처음에 hidden`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if ((S.match(/data-mode="/g) || []).length !== 3 || (S.match(/data-preset="/g) || []).length !== CORE.PRESETS.length) bad(`${tag} 탭 3개 / 빠른 선택 ${CORE.PRESETS.length}개`);
      if ((S.match(/data-emoji="/g) || []).length !== CORE.EMOJIS.length || (S.match(/data-theme="/g) || []).length !== CORE.THEMES.length) bad(`${tag} 이모지 ${CORE.EMOJIS.length}개 / 색 ${CORE.THEMES.length}개`);
      if ((S.match(/role="radiogroup"/g) || []).length !== 4) bad(`${tag} radiogroup 4개(탭·방향·이모지·색)`);
      if (!new RegExp(`id="title"[^>]*maxlength="${CORE.MAX_TITLE}"`).test(S)) bad(`${tag} 제목 maxlength ${CORE.MAX_TITLE}`);
      if (!/id="date"[^>]*type="date" min="1900-01-01" max="2199-12-31"/.test(S)) bad(`${tag} 날짜 입력 범위`);
      if (/id="(title|date)"[^>]*\bvalue=/.test(S)) bad(`${tag} 제목·날짜에 미리 채운 값`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (!/id="error" class="dd-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('dday-core.js') < 0 || html.indexOf('dday-core.js') > html.indexOf('dday.js"')) bad(`${tag} dday-core.js 가 dday.js 보다 먼저여야 함`);
      if (!/family=Unbounded/.test(html)) bad(`${tag} 숫자 글꼴(Unbounded) 없음`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://dday.example.com/</loc>') || !sm.includes('<loc>https://dday.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'dday.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('dday.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("dday.js: track('start')·track('done') 은 calculate() 한 곳씩");
  const calc = (js.match(/function calculate\(\) \{[\s\S]*?\n {2}\}/) || [''])[0];
  if (!/track\('start'\)[\s\S]*show\(r\.rec\)[\s\S]*track\('done'\)/.test(calc)) bad("dday.js: calculate() 안에서 start → show → done 순서");
  const ls = (js.match(/function loadShared\(\) \{[\s\S]*?\n {2}\}/) || [''])[0];
  if (!ls || /track\(|calculate\(/.test(ls)) bad('dday.js: 공유 카드 열기(loadShared)는 track 하지 않음');
  if (!(js.match(/localStorage\.[a-zA-Z]+\(/g) || []).length) bad('dday.js: 저장 목록을 localStorage 에 저장해야 함');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && ![line, lines[i - 1] || '', lines[i - 2] || ''].some((l) => /try\s*\{/.test(l))) bad(`dday.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('dday.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('dday.js: #d= 공유 카드 보기 없음');
  if (!/mgCleanUrl/.test(js)) bad('dday.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  const sd = (js.match(/setShareData\(function \(\) \{[\s\S]*?\n {4}\}\);/) || [''])[0];
  if (!sd || /encodeShare|cardUrl|#d=|titleOf|\.t\b/.test(sd)) bad('dday.js: 공통 공유(setShareData)는 깨끗한 주소·제목 없음이어야 함');
  if (/supa\.|\.rpc\(|fetch\(|XMLHttpRequest|sendBeacon/.test(js)) bad('dday.js: 제목·날짜를 서버로 보내면 안 됨');
  if (/track\('[a-z]+',\s*\{[^}]+\}/.test(js)) bad('dday.js: track 에 값을 넣으면 안 됨');
  if (!/Intl\.DateTimeFormat/.test(js) || !/Intl\.PluralRules/.test(js)) bad('dday.js: 날짜는 Intl.DateTimeFormat, 복수형은 Intl.PluralRules');
  if (!/toBlob|toDataURL/.test(js)) bad('dday.js: 카드 이미지 저장(canvas) 없음');
  const core = fs.readFileSync(path.join(SITE, 'dday-core.js'), 'utf8');
  if (!/Date\.UTC\(o\.y, o\.m - 1, o\.d, 12\)/.test(core)) bad('dday-core.js: 날짜 차이는 UTC 정오 셈');
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
  if (APP.id !== 'dday' || APP.category !== 'create' || APP.path !== 'https://dday.example.com/' || APP.added !== '2026-10-17' || APP.emoji !== '📅' || APP.order !== 1) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 150) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 20) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkTimezones();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n디데이 로직(윤년·UTC 정오 셈·서머타임 5개 시간대·D-DAY·1일로 세기·기념일·빠른 선택·#d= 왕복/변조·저장 목록) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((m) => console.error('  ✗ ' + m));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 날짜 로직(윤년·서머타임·D-DAY·100일 셈법·기념일), 공유 링크(왕복·변조 거절), 저장 목록, 언어 파일 12개(키·복수형·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 끝 화면·FAQPage 없음), OG 이미지 모두 OK');
