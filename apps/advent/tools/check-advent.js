#!/usr/bin/env node
/**
 * 어드벤트 캘린더 만들기 검사.
 *   1) 로직(advent-core.js): 디자인 4개·색 형식, 칸 24개·선물 이모지 24개, 날짜(doorUnlocked·daysUntil·season — 11월 잠김·12월 N일·25일 이후·1월·2월),
 *      정리(cleanText), #d= 인코딩 ↔ 디코딩 왕복(한글·일본어·태국어·키릴·이모지·최대 길이), 잘못된 링크는 null(범위 밖 디자인, 문자열 아닌 글,
 *      25칸 이상, 너무 긴 글, 깨진 UTF-8 …), 디코딩한 글에 꺾쇠 없음·길이 제한, 문 배치(layout)가 1~24 순열이고 같은 캘린더면 같음,
 *      storeKey·parseOpened, plural(Intl.PluralRules).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자, 복수형(1~400 모든 수에 맞는 꼴),
 *      ideas 25~35개(80자 이하, 서로 다름, 언어마다 직접 씀), FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어), 제목·설명 길이, h1 모양, 360px 폭 예산, fr 좁은 공백.
 *   3) 생성된 HTML: title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·입력 칸·FAQ·끝 화면 없음(티징만) / 편집기 화면 mg-ad 1개(그 밖 0개) /
 *      미리보기 화면 광고·입력 없음 / 끝 화면: 결과(링크·받은 캘린더) → data-mg-end="advent" 순서, 24칸 입력·🎲, MG_FAQ·PAGE_I18N, 스크립트 순서,
 *      랜덤 메시지(ideas)는 보이는 HTML 어디에도 목록으로 나오지 않음(PAGE_I18N 스크립트 안에만).
 *   4) advent.js 안전: innerHTML·insertAdjacentHTML·document.write·eval 없음(사용자 글은 textContent·value 로만), 서버로 글을 보내지 않음(fetch·supa 없음),
 *      움직임은 prefers-reduced-motion 에서 멈춤, track('start')·track('done'), setShareData·setRetry.
 *   5) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG.
 *
 * 실행: node tools/check-advent.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'advent-core.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NAMES = ['', 'Sam', '김민지', 'さくら', 'น้องมายด์', 'Маша', 'Léa « Lou »', '🎄🎁 Hi', 'Günter ß', 'Minh Anh', '小雨', 'a'.repeat(40), '  spaced   out  '];
const MSGS = ['', 'Good morning!', '오늘도 너라서 참 좋은 하루야.', 'あなたがいてくれてよかった。', 'ดีใจที่มีเธอ', 'Ты — моё любимое уведомление.', '🎄'.repeat(100), 'x'.repeat(200), 'a "quote" \\ back'];
function checkCore() {
  const T = CORE.THEMES;
  if (T.length !== 4) bad(`테마 ${T.length}개 (4개)`);
  if (T.map((x) => x.id).join() !== 'classic,snow,gold,candy') bad(`테마 id ${T.map((x) => x.id)}`);
  const HEX = /^#[0-9a-f]{6}$/i;
  T.forEach((th) => {
    if (!th.emoji || th.bg.length !== 2 || th.door.length !== 2 || ![...th.bg, ...th.door, th.frame, th.num, th.inside, th.accent, ...th.deco].every((c) => HEX.test(c))) bad(`테마 ${th.id}: 이모지·색 형식`);
  });
  if (CORE.DAYS !== 24) bad('칸 수 24 아님');
  if (CORE.TREATS.length !== 24 || new Set(CORE.TREATS).size !== 24) bad('선물 이모지 24개(서로 다름)');
  if (CORE.LIMITS.m !== 80) bad('메시지 한도 80자');

  // 날짜 (지역 시간)
  const D = (y, m, d, h = 12) => new Date(y, m - 1, d, h, 0, 0);
  const cases = [
    [D(2026, 11, 17), 1, false], [D(2026, 11, 30, 23), 1, false], [D(2026, 12, 1, 0), 1, true], [D(2026, 12, 1), 2, false],
    [D(2026, 12, 5), 5, true], [D(2026, 12, 5), 6, false], [D(2026, 12, 24), 24, true], [D(2026, 12, 25), 24, true],
    [D(2026, 12, 31), 13, true], [D(2027, 1, 1), 24, true], [D(2027, 1, 31, 23), 24, true], [D(2027, 2, 1, 0), 1, false],
    [D(2027, 6, 15), 1, false], [D(2026, 12, 10), 0, false], [D(2026, 12, 10), 25, false], [D(2026, 12, 10), 1.5, false],
  ];
  cases.forEach(([now, day, want]) => { if (CORE.doorUnlocked(day, now) !== want) bad(`doorUnlocked(${day}, ${now.toDateString()}) ≠ ${want}`); });
  const until = [[D(2026, 11, 17), 1, 14], [D(2026, 11, 30, 23), 1, 1], [D(2026, 12, 2), 5, 3], [D(2026, 12, 5), 5, 0], [D(2027, 2, 1), 1, 303], [D(2026, 12, 26), 24, 0], [D(2026, 3, 29), 24, 270]];
  until.forEach(([now, day, want]) => { const v = CORE.daysUntil(day, now); if (v !== want) bad(`daysUntil(${day}, ${now.toDateString()}) = ${v} ≠ ${want}`); });
  if (CORE.season(D(2027, 1, 10)).year !== 2026 || CORE.season(D(2027, 1, 10)).phase !== 'after') bad('season(1월) = 지난해 시즌 after');
  if (CORE.season(D(2026, 12, 7)).phase !== 'during' || CORE.season(D(2026, 12, 7)).day !== 7) bad('season(12월 7일)');
  if (CORE.season(D(2026, 11, 7)).phase !== 'before') bad('season(11월)');
  if (CORE.openCount(D(2026, 12, 7)) !== 7 || CORE.openCount(D(2026, 11, 7)) !== 0 || CORE.openCount(D(2026, 12, 28)) !== 24) bad('openCount');
  G.LOCALES.forEach(({ code }) => { const f = CORE.decDate(24, code); if (!f || !/24/.test(f)) bad(`decDate(${code}) "${f}"`); });

  // 글 정리
  const ct = CORE.cleanText;
  if (ct('<b>Hi</b>', 30) !== 'Hi' || ct('a<b', 30) !== 'ab') bad('cleanText 태그·꺾쇠 제거');
  if (ct('<img src=x onerror=alert(1)>Bob', 30) !== 'Bob') bad('cleanText 가 태그를 지우지 않음');
  if (ct('  a b\n c  ', 30) !== 'a b c') bad('cleanText 공백');
  if (Array.from(ct('🎄'.repeat(300), 80)).length !== 80) bad('cleanText 는 코드 포인트로 자른다');
  if (ct(null, 5) !== '' || ct(42, 5) !== '42') bad('cleanText(null/숫자)');

  // 무작위 캘린더 왕복
  let rt = 0;
  let maxLen = 0;
  for (let i = 0; i < 2000; i++) {
    const m = [];
    const len = i % 25;
    for (let k = 0; k < len; k++) m.push(MSGS[(i + k) % MSGS.length]);
    const d = { t: i % T.length, to: NAMES[i % NAMES.length], fr: NAMES[(i + 3) % NAMES.length], m };
    const enc = CORE.encode(d);
    if (!enc || !/^[A-Za-z0-9_-]+$/.test(enc)) { bad(`encode 실패/형식 이상: ${JSON.stringify(d).slice(0, 80)}`); continue; }
    maxLen = Math.max(maxLen, enc.length);
    const back = CORE.decode(enc);
    if (!CORE.same(back, CORE.normalize(d))) { bad(`왕복 불일치: ${JSON.stringify(d).slice(0, 80)}`); continue; }
    rt++;
  }
  const worst = { t: 3, to: '🎄'.repeat(20), fr: '🎄'.repeat(20), m: Array(24).fill('🎄'.repeat(80)) };
  const wEnc = CORE.encode(worst);
  if (!wEnc || wEnc.length > CORE.MAX_HASH) bad(`최대 길이 링크 ${wEnc && wEnc.length}자 > ${CORE.MAX_HASH}`);
  else if (!CORE.same(CORE.decode(wEnc), CORE.normalize(worst))) bad('최대 길이 링크 왕복 불일치');
  const empty = CORE.defaults();
  if (!CORE.same(CORE.decode(CORE.encode(empty)), empty)) bad('빈 캘린더 왕복');
  if (CORE.encode({ ...empty, t: 9 }) !== null) bad('encode(잘못된 캘린더) 은 null');
  const short = CORE.encode({ t: 0, to: '', fr: '', m: ['Hi'] });
  if (short.length > 40) bad(`짧은 캘린더 링크가 김 (${short.length}자) — 끝의 빈 칸을 잘라야 함`);
  // 잘못된 링크
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const ok = { v: 1, t: 0, m: ['a'] };
  const badInputs = {
    empty: '', garbage: '!!!', spaces: 'ab cd', plus: 'ab+cd', longStr: 'A'.repeat(CORE.MAX_HASH + 5), notJson: b64('hello'), wrongV: b64({ ...ok, v: 2 }), noV: b64({ t: 0, m: [] }),
    themeRange: b64({ ...ok, t: 4 }), themeNeg: b64({ ...ok, t: -1 }), themeFrac: b64({ ...ok, t: 0.5 }), themeStr: b64({ ...ok, t: '0' }), noTheme: b64({ v: 1, m: [] }),
    noM: b64({ v: 1, t: 0 }), mObj: b64({ ...ok, m: { 0: 'a' } }), mStr: b64({ ...ok, m: 'abc' }), m25: b64({ ...ok, m: Array(25).fill('a') }), mNum: b64({ ...ok, m: [1] }), mNull: b64({ ...ok, m: [null] }),
    mHuge: b64({ ...ok, m: ['x'.repeat(401)] }), toNum: b64({ ...ok, to: 5 }), frArr: b64({ ...ok, fr: ['x'] }), toHuge: b64({ ...ok, to: 'y'.repeat(401) }),
    badUtf8: Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''), arr: b64([1, 2, 3]), nul: b64('null'),
  };
  Object.entries(badInputs).forEach(([k, v]) => { if (CORE.decode(v) !== null) bad(`decode(${k}) 는 null 이어야 함`); });
  if (CORE.decode(null) !== null || CORE.decode(42) !== null || CORE.decode({}) !== null) bad('decode(비문자열) 은 null');
  const xss = CORE.decode(b64({ v: 1, t: 1, to: '<img src=x onerror=alert(1)>Top' + 'z'.repeat(60), fr: '<script>x</script>', m: ['"><svg onload=alert(1)>' + 'm'.repeat(300), '<b>hi</b>'] }));
  if (!xss) bad('decode 가 꺾쇠 든 글을 정리하지 않고 버림');
  else {
    if (/[<>]/.test(xss.to + xss.fr + xss.m.join(''))) bad('decode 한 글에 꺾쇠가 남음');
    if (Array.from(xss.to).length > CORE.LIMITS.to || xss.m.some((s) => Array.from(s).length > CORE.LIMITS.m)) bad('decode 가 글 길이를 자르지 않음');
    if (xss.m.length !== 24 || Object.keys(xss).sort().join() !== 'fr,m,t,to') bad(`decode 결과 모양 ${Object.keys(xss)}`);
  }
  const extra = CORE.decode(b64({ ...ok, evil: 'x' }));
  if (!extra || 'evil' in extra) bad('decode 가 모르는 키를 그대로 넘김');

  // 문 배치
  const x1 = { t: 0, to: 'Sam', fr: 'Alex', m: [] };
  const l1 = CORE.layout(CORE.seedOf(x1));
  if (l1.length !== 24 || [...l1].sort((a, b) => a - b).join() !== Array.from({ length: 24 }, (_, i) => i + 1).join()) bad('layout 이 1~24 순열이 아님');
  if (CORE.layout(CORE.seedOf({ ...x1 })).join() !== l1.join()) bad('layout 이 같은 캘린더에서 다름');
  if (l1.join() === Array.from({ length: 24 }, (_, i) => i + 1).join()) bad('layout 이 섞이지 않음');
  if (CORE.layout(0).length !== 24) bad('layout(0)');
  if (CORE.storeKey('abc') === CORE.storeKey('abd') || !/^advent_open_[0-9a-z]+$/.test(CORE.storeKey('abc'))) bad('storeKey');
  if (CORE.parseOpened('[1,2,2,25,"3",0,24]').join() !== '1,2,24' || CORE.parseOpened('nope').length || CORE.parseOpened('{"a":1}').length) bad('parseOpened');
  if (CORE.plural({ one: 'a', few: 'b', many: 'c', other: 'd' }, 22, 'ru') !== 'b' || CORE.plural({ one: 'a', other: 'd' }, 1, 'en') !== 'a' || CORE.plural({ other: 'd' }, 1, 'ko') !== 'd') bad('plural');
  console.log(`\n=== 로직: 테마 ${T.length}개 · 날짜 ${cases.length + until.length}건 · #d= 왕복 ${rt.toLocaleString()}개 (최대 ${maxLen}자, 최악 ${wEnc && wEnc.length}자 / 한도 ${CORE.MAX_HASH}) · 잘못된 링크 ${Object.keys(badInputs).length}종 거부 ===`);
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
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
    else if (c === 0x20 || c === 0xa0 || c === 0x202f) w += 0.28;
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
const longestWord = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s ]+|-/).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');

// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%). hard = 실패, 아니면 (참고)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 19 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 28, size: 14 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 15 * 1.12, hard: true, what: 'h1 검색어 줄' },
  { key: 'editor.create', get: (T) => T.editor.create, px: 328 - 36, size: 19 * 1.08, hard: true, what: '링크 만들기 버튼 한 줄' },
  { key: 'editor.preview', get: (T) => T.editor.preview, px: 328 - 36, size: 19 * 1.08, hard: true, what: '미리보기 버튼 한 줄' },
  { key: 'editor.fillAll', get: (T) => T.editor.fillAll, px: 328 - 28, size: 13.5 * 1.08, hard: true, what: '빈 칸 채우기 버튼 한 줄' },
  { key: 'count+fill', get: (T) => T.editor.counter.replace('{n}', '24') + 'MM' + T.editor.fillAll, px: 328 - 28, size: 14 * 1.08, hard: false, what: '채움 수 + 빈 칸 채우기 한 줄(넘치면 줄바꿈)' },
  { key: 'fields.to', get: (T) => T.editor.fields.to.label, px: 155, size: 15 * 1.08, hard: true, what: '받는 사람 라벨(반 칸)' },
  { key: 'fields.from', get: (T) => T.editor.fields.from.label, px: 155, size: 15 * 1.08, hard: true, what: '보내는 사람 라벨(반 칸)' },
  { key: 'calendar.makeOwn', get: (T) => T.calendar.makeOwn, px: 328 - 28 - 36, size: 19 * 1.08, hard: true, what: '나도 만들기 버튼 한 줄' },
  { key: 'preview.badge', get: (T) => T.preview.badge, px: 328 - 28, size: 15 * 1.08, hard: true, what: '미리보기 배지 한 줄' },
  { key: 'preview.back', get: (T) => T.preview.back, px: 328 - 36, size: 19 * 1.08, hard: true, what: '돌아가기 버튼 한 줄' },
  { key: 'result.copy', get: (T) => T.result.copy, px: 130, size: 16 * 1.08, hard: true, what: '복사 버튼(링크 칸 옆)' },
  { key: 'result.save', get: (T) => '📥 ' + T.result.save, px: 328 - 32 - 24, size: 16 * 1.08, hard: true, what: '이미지 저장 버튼 한 줄' },
  { key: 'result.preview', get: (T) => '👀 ' + T.result.preview, px: 328 - 32 - 24, size: 16 * 1.08, hard: true, what: '미리보기 버튼 한 줄' },
  { key: 'result.edit', get: (T) => '✏️ ' + T.result.edit, px: 328 - 32 - 24, size: 16 * 1.08, hard: true, what: '고치기 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.retryFriend', get: (T) => T.result.retryFriend, px: 328 - 24, size: 16 * 1.08, hard: true, what: '나도 만들기 버튼 한 줄' },
  { key: 'editor.title', get: (T) => T.editor.title, px: 328, size: 22 * 1.08, hard: false, what: '편집기 제목 한 줄' },
];
const CYRILLIC_DISPLAY = ['Nunito'];
const VIET_DISPLAY = ['Nunito'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;

function checkLocales() {
  const base = new Set(shape(L10N.en));
  const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
  const en = Object.fromEntries(flat(L10N.en));
  const PLURALS = ['calendar.before', 'calendar.locked'];
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    // 복수형 객체는 언어마다 범주가 달라 키 비교에서 뺀다
    const isPluralKey = (k) => PLURALS.some((p) => k.startsWith(`.${p}.`));
    const s = new Set(shape(T).filter((k) => !isPluralKey(k)));
    const b = new Set([...base].filter((k) => !isPluralKey(k)));
    const missing = [...b].filter((k) => !s.has(k));
    const extra = [...s].filter((k) => !b.has(k));
    if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
    if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
    const strings = flat(T).filter(([, v]) => typeof v === 'string');
    if (lang !== 'en') {
      strings.forEach(([k, v]) => {
        if (k.startsWith('fonts.') || k === 'result.fileName') return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = strings.filter(([k, v]) => !v.trim() && k !== 'fonts.sans').map(([k]) => k);
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    CORE.THEMES.forEach((th) => { if (!T.editor.themes[th.id]) bad(`${tag} editor.themes.${th.id} 없음`); });
    if (Object.keys(T.editor.themes).length !== CORE.THEMES.length) bad(`${tag} editor.themes 개수`);
    // 자리표시자
    const one = (k, v, ph) => { if ((String(v).match(new RegExp(`\\{${ph}\\}`, 'g')) || []).length !== 1) bad(`${tag} ${k} 에 {${ph}} 가 하나 있어야 함`); };
    one('calendar.forName', T.calendar.forName, 'name');
    one('calendar.fromName', T.calendar.fromName, 'name');
    one('calendar.during', T.calendar.during, 'date');
    one('calendar.dayTitle', T.calendar.dayTitle, 'date');
    one('calendar.doorAria', T.calendar.doorAria, 'day');
    one('editor.dayAria', T.editor.dayAria, 'day');
    one('editor.diceAria', T.editor.diceAria, 'day');
    one('editor.counter', T.editor.counter, 'n');
    [['calendar.forNone', T.calendar.forNone], ['calendar.after', T.calendar.after], ['calendar.treat', T.calendar.treat], ['calendar.heading', T.calendar.heading], ['result.shareText', T.result.shareText], ['result.shareTextFriend', T.result.shareTextFriend]].forEach(([k, v]) => { if (/\{\w+\}/.test(v)) bad(`${tag} ${k} 에 자리표시자가 있으면 안 됨`); });
    if (!/^[a-z0-9-]+$/i.test(T.result.fileName)) bad(`${tag} result.fileName "${T.result.fileName}" (영문·숫자·- 만)`);
    // 복수형: 1~400 모든 수에 맞는 꼴이 있고 {n}·{date} 를 담는다
    const pr = new Intl.PluralRules(lang);
    [['calendar.before', T.calendar.before, ['n', 'date']], ['calendar.locked', T.calendar.locked, ['n', 'date', 'day']]].forEach(([k, forms, phs]) => {
      if (!forms || typeof forms !== 'object' || !forms.other) { bad(`${tag} ${k}.other 없음`); return; }
      Object.keys(forms).forEach((cat) => { if (!pr.resolvedOptions().pluralCategories.includes(cat)) bad(`${tag} ${k}.${cat} 는 이 언어에 없는 복수 범주`); });
      for (let n = 1; n <= 400; n++) {
        const cat = pr.select(n);
        if (!forms[cat]) { bad(`${tag} ${k} 에 n=${n} 의 꼴(${cat})이 없음`); break; }
      }
      Object.entries(forms).forEach(([cat, v]) => phs.forEach((ph) => { if ((v.match(new RegExp(`\\{${ph}\\}`, 'g')) || []).length !== 1) bad(`${tag} ${k}.${cat} 에 {${ph}} 하나`); }));
    });
    // 랜덤 메시지
    const P = T.ideas;
    if (!Array.isArray(P) || P.length < 25 || P.length > 35) bad(`${tag} ideas 는 25~35개 (${P && P.length})`);
    else {
      P.forEach((m, i) => {
        if (CORE.cleanText(m, 999) !== m) bad(`${tag} ideas[${i}] 앞뒤 공백·꺾쇠·줄바꿈`);
        if (Array.from(m).length > CORE.LIMITS.m) bad(`${tag} ideas[${i}] ${Array.from(m).length}자 > ${CORE.LIMITS.m}`);
        if (/\{\w+\}/.test(m)) bad(`${tag} ideas[${i}] 에 자리표시자`);
        if (lang !== 'en' && L10N.en.ideas.includes(m)) bad(`${tag} ideas[${i}] 가 영어 그대로`);
      });
      if (new Set(P).size !== P.length) bad(`${tag} ideas 중복`);
    }
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·하트·별점 류 질문 금지: ${f.q}`);
    });
    // 글꼴
    const F = T.fonts || {};
    if (!F.css || !F.display || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display 이상`);
    const first = String(F.display || '').split(',')[0].replace(/['"]/g, '').trim();
    if (lang === 'ru' && !CYRILLIC_DISPLAY.includes(first)) bad(`${tag} 제목 글꼴 "${first}" 키릴 문자 지원 확인`);
    if (lang === 'vi' && !VIET_DISPLAY.includes(first)) bad(`${tag} 제목 글꼴 "${first}" 베트남어 성조 지원 확인`);
    if (F.css && !F.css.includes('family=' + first.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${first} 가 없음`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase().split(' ')[0])) warn(`${tag} meta.title 이 h1Kicker 검색어를 담지 않음`);
    // 제목·설명 길이
    const wide = isWideLang(lang) && lang !== 'ko';
    const tl = visLen(T.meta.title);
    if (wide ? tl > 32 : tl > 52) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 32' : '라틴·키릴·한글 52'}자 이하)`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 160] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    // fr: ? ! : ; 앞은 좁은 줄바꿈 없는 공백(U+202F)
    if (lang === 'fr') {
      strings.forEach(([k, v]) => {
        if (k.startsWith('fonts.') || k.startsWith('privacy.')) return;
        if (/ [?!:;]/.test(v)) bad(`${tag} ${k} 에 ? ! : ; 앞 일반 공백 (U+202F 로)`);
      });
    }
    // 폭 예산
    BUDGET.forEach((bb) => {
      const v = bb.get(T) || '';
      const need = emWidth(v) * bb.size;
      if (need > bb.px) (bb.hard ? bad : warn)(`${tag} ${bb.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(bb.px)}px (${bb.what})`);
    });
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const unit = isWideLang(lang) ? txt : longestWord(txt);
      const w38 = emWidth(unit) * 38 * 1.05;
      if (w38 > 343) (isWideLang(lang) ? warn : bad)(`${tag} h1 "${unit}" ≈ ${Math.round(w38)}px @38px (한 줄 343px)`);
    });
    Object.entries(T.editor.themes).forEach(([id, v]) => { if (emWidth(v) * 13.5 * 1.08 + 20 > 120) warn(`${tag} 테마 ${id} "${v}" 가 김 (칩이 가로로 넘쳐 스크롤됨)`); });
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  return m ? m[0] : '';
}
function commonHtml(tag, html, lang) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/advent\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/advent\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|service_role/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
}
function checkHtml() {
  let pages = 0;
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const f = G.fileOf(lang, 'index.html');
    const html = read(f);
    const tag = `[${lang}] ${f}`;
    commonHtml(tag, html, lang);
    pages++;
    if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
    if (!/"@type":"WebApplication"/.test(html)) bad(`${tag} appLd(WebApplication) 없음`);
    const start = section(html, 'screen-start');
    const edit = section(html, 'screen-edit');
    const prev = section(html, 'screen-preview');
    const end = section(html, 'screen-end');
    if (!start || !edit || !prev || !end) { bad(`${tag} 시작/편집기/미리보기/끝 화면 중 없는 것이 있음`); return; }
    ['screen-edit', 'screen-preview', 'screen-end'].forEach((id) => { if (!new RegExp(`<section id="${id}"[^>]*hidden`).test(html)) bad(`${tag} ${id} 는 처음에 hidden`); });
    if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
    // 시작 화면: 티징만 + 맨 끝 광고 1개
    if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
    if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
    if (/data-mg-end|mg-faq|more-test|ad-theme|ad-dice|<input|<canvas|<details|<textarea|<select/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력 칸/디자인 목록`);
    if (!/<h1 class="ad-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
    if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
    // 스포일러 금지: 랜덤 메시지(ideas)·FAQ 는 보이는 HTML 에 없다 (PAGE_I18N·MG_FAQ 스크립트 안에만)
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, '');
    [...T.ideas, ...T.faq.map((q) => q.q)].forEach((v) => { if (visible.includes(G.esc(v))) bad(`${tag} 보이는 HTML 에 랜덤 메시지/FAQ 문구 "${v}"`); });
    if ((edit.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 편집기 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 편집기의 1개뿐`);
    if (edit.indexOf('class="mg-ad"') < edit.indexOf('id="create-btn"')) bad(`${tag} 편집기 광고는 편집기 아래`);
    if ((edit.match(/class="ad-chip ad-theme[ "]/g) || []).length !== CORE.THEMES.length) bad(`${tag} 편집기 디자인 버튼 ${CORE.THEMES.length}개가 아님`);
    if ((edit.match(/class="ad-input ad-day-input"/g) || []).length !== CORE.DAYS) bad(`${tag} 메시지 칸 ${CORE.DAYS}개가 아님`);
    if ((edit.match(/class="ad-dice"/g) || []).length !== CORE.DAYS) bad(`${tag} 🎲 버튼 ${CORE.DAYS}개가 아님`);
    for (let d = 1; d <= CORE.DAYS; d++) if (!new RegExp(`id="m-${d}"[^>]*maxlength="${CORE.LIMITS.m * 3}"`).test(edit)) { bad(`${tag} #m-${d} maxlength`); break; }
    [['f-to', CORE.LIMITS.to], ['f-from', CORE.LIMITS.fr]].forEach(([id, n]) => { if (!new RegExp(`id="${id}"[^>]*maxlength="${n * 3}"`).test(edit)) bad(`${tag} #${id} maxlength ${n * 3}`); });
    ['themes', 'f-to', 'f-from', 'days', 'day-count', 'fill-btn', 'preview-btn', 'create-btn', 'edit-status'].forEach((id) => { if (!edit.includes(`id="${id}"`)) bad(`${tag} 편집기에 #${id} 없음`); });
    if (/mg-ad|data-mg-end|<input|<textarea/.test(prev) || !prev.includes('id="preview-grid"') || !prev.includes('id="preview-back"')) bad(`${tag} 미리보기 화면: 격자·돌아가기만 (광고·입력·끝 화면 없음)`);
    const mineAt = end.indexOf('id="end-mine"');
    const friendAt = end.indexOf('id="end-friend"');
    const endAt = end.indexOf('<div data-mg-end="advent"></div>');
    if (!(mineAt > 0 && friendAt > mineAt && endAt > friendAt)) bad(`${tag} 끝 화면: 결과(링크·받은 캘린더) → data-mg-end="advent" 순서가 아님`);
    if (!/id="end-friend"[^>]*hidden/.test(end)) bad(`${tag} 받은 캘린더는 처음에 hidden`);
    if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
    ['link-box', 'copy-btn', 'save-btn', 'end-preview-btn', 'edit-btn', 'cal-grid', 'cal-status', 'cal-for', 'make-own'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
    if (!/id="door-modal"[^>]*hidden/.test(html) || !/role="dialog"/.test(html)) bad(`${tag} 메시지 창(door-modal, dialog, hidden) 없음`);
    if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    if (!(html.indexOf('advent-core.js') > 0 && html.indexOf('advent-core.js') < html.indexOf('advent.js"'))) bad(`${tag} advent-core.js 가 advent.js 보다 먼저여야 함`);
    const pf = G.fileOf(lang, 'privacy.html');
    commonHtml(`[${lang}] ${pf}`, read(pf), lang);
    pages++;
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://advent.example.com/</loc>') || !sm.includes('<loc>https://advent.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  return pages;
}

// ---------------------------------------------------------------- 4) 앱 JS 안전·움직임
function checkJs() {
  const js = read('advent.js');
  const code = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  if (/\.innerHTML|outerHTML|insertAdjacentHTML|document\.write|\beval\(|new Function/.test(code)) bad('advent.js: innerHTML·insertAdjacentHTML·document.write·eval 금지 (사용자 글은 textContent 로만)');
  if (/\bfetch\(|XMLHttpRequest|sendBeacon|window\.supa\b|supa\./.test(code)) bad('advent.js: 사용자 글을 서버로 보내는 코드(fetch·supa) 금지');
  if (!/modalMsg\.textContent = /.test(code) || !/calFor\.textContent = /.test(code)) bad('advent.js: 메시지·받은 이름은 textContent 로 넣어야 함');
  if (!/CORE\.decode\(enc\)/.test(code)) bad('advent.js: #d= 는 CORE.decode 로만 읽어야 함');
  if (!/track\('start'\)/.test(code) || !/track\('done'\)/.test(code)) bad("advent.js: track('start')·track('done') 없음");
  if (!/setShareData/.test(code) || !/setRetry/.test(code)) bad('advent.js: setShareData·setRetry 없음');
  if (!/CORE\.doorUnlocked\(day, now\(\)\)/.test(code)) bad('advent.js: 문 열림은 CORE.doorUnlocked 로 판정해야 함');
  if (/drawImage[\s\S]*x\.m\[/.test(code.slice(code.indexOf('function drawImage'), code.indexOf('function makePng')))) bad('advent.js: 저장 이미지에 메시지를 그리면 안 됨');
  if (/supabase\.co|sb_publishable|service_role/i.test(js + read('advent-core.js'))) bad('앱 JS 에 Supabase 값');
  if (!/REDUCED\.matches/.test(code)) bad('advent.js: 문 열기·흔들기가 prefers-reduced-motion 을 보지 않음');
  const css = read('style.css');
  const rm = (css.match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/) || [''])[0];
  ['.ad-hero span', '.ad-door-front', '.ad-door.is-shake', '.ad-modal-card'].forEach((sel) => { if (!rm.includes(sel)) bad(`style.css: prefers-reduced-motion 에서 ${sel} 움직임을 멈추지 않음`); });
  if (!/--app-width/.test(css)) bad('style.css: --app-width(480px) 한 줄 레이아웃이 아님');
}

// ---------------------------------------------------------------- 5) OG 이미지
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

checkCore();
checkLocales();
const pages = checkHtml();
checkJs();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개 · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 디자인·날짜(문 열림)·정리·#d= 왕복/거부·문 배치·복수형, 언어 파일 12개(키·번역·랜덤 메시지·FAQ·글꼴·제목 길이·폭 예산), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치·끝 화면·스포일러 없음), JS 안전(innerHTML·서버 전송 없음), 움직임 줄이기, OG 이미지 모두 OK');
