/* apps/age/age-core.js — 만 나이 계산기 언어 무관 로직 (UMD: 브라우저 window.AGE_CORE + Node 검사 공용)
 *   날짜 = 달력 날짜 { y, m, d } (시간대 없음). 날짜끼리의 차이는 "UTC 정오" 일 번호로 센다 —
 *   dayNumber = Date.UTC(y, m-1, d, 12) / 86400000 → 서머타임(23·25시간 하루)·시간대와 상관없이 언제나 정수 (dday-core 와 같은 방식).
 *   "오늘" 만 기기 시간(로컬 달력 날짜)을 쓴다.
 *
 *   만 나이(국제 나이): 생일이 지날 때마다 한 살. 년·개월·일은 "말일 맞춤" — 1/31 생 → 2/28(평년) 에 한 달,
 *   2/29 생 → 평년에는 2/28 을 생일로 친다(BIRTHDAY_RULE = 'feb28'). 화면에서 이 규칙을 밝힌다.
 *   다음 생일 D-n, 살아온 날·주·개월·시간, 태어난 요일, 서양 별자리(양력 날짜), 띠(양력 출생 연도 기준 — 음력 설 경계는 가이드에서만 안내),
 *   기념일: 1만·2만·3만 일(태어난 날 + n일), 다음 10단위 생일.
 *   한국어 화면만: 연 나이(올해 − 출생 연도), 세는 나이(연 나이 + 1).
 *   검사: 미래 생일 → 'future', 130살 넘음 → 'tooOld', 기준일 범위 밖 → 'badAsOf'.
 *   서버로 보내는 것도, 주소에 넣는 것도 없다(공통 끝 화면 공유 = 깨끗한 주소 + 살아온 날수 문구).
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AGE_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DAY_MS = 86400000;
  var MIN_YEAR = 1850;        // 생년월일로 받는 가장 이른 해 (기준일 − 130년보다 넉넉히)
  var MAX_YEAR = 2199;
  var AS_OF_MIN = 1900;       // "기준일" 입력 범위
  var MAX_AGE = 130;
  var BIRTHDAY_RULE = 'feb28';
  var DAY_MILESTONES = [10000, 20000, 30000];
  var ZODIAC = [              // [id, 시작 월, 시작 일] — 그 날짜부터 다음 별자리 시작 전날까지
    ['capricorn', 1, 1], ['aquarius', 1, 20], ['pisces', 2, 19], ['aries', 3, 21], ['taurus', 4, 20], ['gemini', 5, 21],
    ['cancer', 6, 21], ['leo', 7, 23], ['virgo', 8, 23], ['libra', 9, 23], ['scorpio', 10, 23], ['sagittarius', 11, 22], ['capricorn', 12, 22],
  ];
  var ZODIAC_IDS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  var ZODIAC_EMOJI = { aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓' };
  var ANIMALS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
  var ANIMAL_EMOJI = { rat: '🐭', ox: '🐮', tiger: '🐯', rabbit: '🐰', dragon: '🐲', snake: '🐍', horse: '🐴', goat: '🐐', monkey: '🐵', rooster: '🐔', dog: '🐶', pig: '🐷' };

  // ---------------------------------------------------------------- 달력 날짜
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function daysInMonth(y, m) { return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]; }
  function validYmd(o, lo, hi) {
    if (!o || !Number.isInteger(o.y) || !Number.isInteger(o.m) || !Number.isInteger(o.d)) return false;
    if (o.y < (lo || MIN_YEAR) || o.y > (hi || MAX_YEAR) || o.m < 1 || o.m > 12) return false;
    return o.d >= 1 && o.d <= daysInMonth(o.y, o.m);
  }
  function pad(n, w) { var s = String(Math.abs(n)); while (s.length < (w || 2)) s = '0' + s; return s; }
  function ymd(y, m, d) { return { y: y, m: m, d: d }; }
  // 'YYYY-MM-DD' → { y, m, d } (없는 날짜·범위 밖이면 null)
  function parseYmd(s, lo, hi) {
    var mt = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s == null ? '' : s));
    if (!mt) return null;
    var o = ymd(+mt[1], +mt[2], +mt[3]);
    return validYmd(o, lo, hi) ? o : null;
  }
  // 선택 상자 값(문자열/숫자) → { y, m, d } | { error }
  function fromParts(y, m, d) {
    if (y === '' || m === '' || d === '' || y == null || m == null || d == null) return { error: 'noDate' };
    var o = ymd(Number(y), Number(m), Number(d));
    if (!Number.isInteger(o.y) || !Number.isInteger(o.m) || !Number.isInteger(o.d)) return { error: 'noDate' };
    if (o.m >= 1 && o.m <= 12 && o.y >= MIN_YEAR && o.y <= MAX_YEAR && o.d > daysInMonth(o.y, o.m) && o.d <= 31) return { error: 'badDate' };
    return validYmd(o) ? { date: o } : { error: 'noDate' };
  }
  function fmtYmd(o) { return pad(o.y, 4) + '-' + pad(o.m) + '-' + pad(o.d); }
  function dayNumber(o) { return Math.floor(Date.UTC(o.y, o.m - 1, o.d, 12) / DAY_MS); }
  function fromDayNumber(n) {
    var dt = new Date(n * DAY_MS + DAY_MS / 2);
    return ymd(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
  }
  function addDays(o, n) { return fromDayNumber(dayNumber(o) + n); }
  function diffDays(a, b) { return dayNumber(b) - dayNumber(a); }      // b - a (일)
  function weekday(o) { return (dayNumber(o) % 7 + 7 + 4) % 7; }       // 0=일 … 6=토
  function cmp(a, b) { return dayNumber(a) - dayNumber(b); }
  function today(now) {
    var t = now instanceof Date ? now : new Date(now == null ? Date.now() : now);
    return ymd(t.getFullYear(), t.getMonth() + 1, t.getDate());
  }
  // 연·월 더하기 — 그 달에 없는 날은 말일로(1/31 + 1달 = 2/28·2/29, 2/29 + 1년 = 평년 2/28)
  function addMonths(o, k) {
    var t = (o.y * 12 + (o.m - 1)) + k;
    var y = Math.floor(t / 12), m = t - y * 12 + 1;
    return ymd(y, m, Math.min(o.d, daysInMonth(y, m)));
  }

  // ---------------------------------------------------------------- 나이
  // a → b 의 년·개월·일 (a <= b). 말일 맞춤.
  function calendarDiff(a, b) {
    if (cmp(a, b) > 0) return null;
    var total = (b.y - a.y) * 12 + (b.m - a.m);
    while (total > 0 && cmp(addMonths(a, total), b) > 0) total--;
    var anchor = addMonths(a, total);
    return { y: Math.floor(total / 12), m: total % 12, d: diffDays(anchor, b), months: total };
  }
  // 그해의 생일 (2/29 생은 평년에 2/28)
  function birthdayIn(birth, year) { return ymd(year, birth.m, Math.min(birth.d, daysInMonth(year, birth.m))); }
  function isLeapBirth(birth) { return birth.m === 2 && birth.d === 29; }
  // 기준일(포함) 이후 첫 생일. { date, diff, turning, today }
  function nextBirthday(birth, asOf) {
    var y = asOf.y;
    var b = birthdayIn(birth, y);
    if (cmp(b, asOf) < 0) { y += 1; b = birthdayIn(birth, y); }
    var diff = diffDays(asOf, b);
    return { date: b, diff: diff, turning: y - birth.y, today: diff === 0 };
  }
  function westernZodiac(m, d) {
    var id = 'capricorn';
    for (var i = 0; i < ZODIAC.length; i++) if (m > ZODIAC[i][1] || (m === ZODIAC[i][1] && d >= ZODIAC[i][2])) id = ZODIAC[i][0];
    return id;
  }
  // 양력 출생 연도 기준 띠 (2020 = 쥐). 음력 설 전 1~2월생은 전통 방식으로는 앞 띠일 수 있다(가이드에서 안내).
  function chineseZodiac(year) { return ANIMALS[((year - 4) % 12 + 12) % 12]; }
  function koreanAges(birth, asOf) { var yeon = asOf.y - birth.y; return { yeon: yeon, counting: yeon + 1 }; }
  // 기념일: 1만·2만·3만 일(태어난 날 + n일), 다음 10단위 생일(오늘이 그 생일이면 오늘). 날짜 순, 지난 것은 passed.
  function milestones(birth, asOf, years) {
    var out = DAY_MILESTONES.map(function (n) {
      var date = addDays(birth, n);
      return { kind: 'days', n: n, date: date, diff: diffDays(asOf, date) };
    });
    var target = Math.ceil(years / 10) * 10;
    if (target === 0) target = 10;
    var dt = birthdayIn(birth, birth.y + target);
    if (cmp(dt, asOf) < 0) { target += 10; dt = birthdayIn(birth, birth.y + target); }
    out.push({ kind: 'round', n: target, date: dt, diff: diffDays(asOf, dt) });
    out.forEach(function (x) { x.passed = x.diff < 0; });
    return out.sort(function (a, b) { return a.diff - b.diff; });
  }

  // ---------------------------------------------------------------- 계산 묶음 (화면 JS 가 그대로 그린다)
  // birth, asOf = { y, m, d }. 실패하면 { error: 'future'|'tooOld'|'badAsOf'|'noDate' }.
  function compute(birth, asOf) {
    if (!validYmd(birth)) return { error: 'noDate' };
    if (!validYmd(asOf, AS_OF_MIN, MAX_YEAR)) return { error: 'badAsOf' };
    if (cmp(birth, asOf) > 0) return { error: 'future' };
    var age = calendarDiff(birth, asOf);
    if (age.y > MAX_AGE || (age.y === MAX_AGE && (age.m > 0 || age.d > 0))) return { error: 'tooOld' };
    var days = diffDays(birth, asOf);
    return {
      birth: birth, asOf: asOf,
      age: { y: age.y, m: age.m, d: age.d },
      next: nextBirthday(birth, asOf),
      leapBirth: isLeapBirth(birth),
      totals: { days: days, weeks: Math.floor(days / 7), weekRest: days % 7, months: age.months, hours: days * 24 },
      weekday: weekday(birth),
      zodiac: westernZodiac(birth.m, birth.d),
      animal: chineseZodiac(birth.y),
      korean: koreanAges(birth, asOf),
      milestones: milestones(birth, asOf, age.y),
    };
  }

  return {
    DAY_MS: DAY_MS, MIN_YEAR: MIN_YEAR, MAX_YEAR: MAX_YEAR, AS_OF_MIN: AS_OF_MIN, MAX_AGE: MAX_AGE, BIRTHDAY_RULE: BIRTHDAY_RULE,
    DAY_MILESTONES: DAY_MILESTONES, ZODIAC_IDS: ZODIAC_IDS, ZODIAC_EMOJI: ZODIAC_EMOJI, ANIMALS: ANIMALS, ANIMAL_EMOJI: ANIMAL_EMOJI,
    isLeap: isLeap, daysInMonth: daysInMonth, validYmd: validYmd, parseYmd: parseYmd, fromParts: fromParts, fmtYmd: fmtYmd,
    dayNumber: dayNumber, fromDayNumber: fromDayNumber, addDays: addDays, diffDays: diffDays, weekday: weekday, cmp: cmp, today: today,
    addMonths: addMonths, calendarDiff: calendarDiff, birthdayIn: birthdayIn, isLeapBirth: isLeapBirth, nextBirthday: nextBirthday,
    westernZodiac: westernZodiac, chineseZodiac: chineseZodiac, koreanAges: koreanAges, milestones: milestones, compute: compute,
  };
});
