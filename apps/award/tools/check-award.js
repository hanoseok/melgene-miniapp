#!/usr/bin/env node
/**
 * 상장 만들기 검사.
 *   1) 로직(award-core.js): 디자인 4개·id·색 형식, 도장 3개(none·red·gold), 그림 1240×1754(A4 비율), 날짜(검증·today·formatDate 12개 언어),
 *      정리(cleanText: <>·태그·제어 문자·길이), #d= 인코딩 ↔ 디코딩 왕복(한글·일본어·태국어·키릴·이모지·최대 길이),
 *      잘못된 링크는 null(범위 밖 디자인·도장·날짜, 문자열 아닌 글, 너무 긴 글, 깨진 UTF-8 …), 디코딩한 글에 꺾쇠 없음·길이 제한,
 *      wrap(줄바꿈), sealChar(도장 글자).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자({name}·{title}·{n}/{max}),
 *      상 이름 예시 3~5개(24자 이하)·랜덤 수상 이유 10~14개(140자 이하, 서로 다름, 언어마다 직접 씀), FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(상장 글꼴이 그 언어 글자를 지원 — ru 키릴·vi 베트남어·한중일·태국어), 제목·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML: title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·입력 칸·FAQ·끝 화면·상장 그림 없음(스포일러·티징만) / 편집기 화면 mg-ad 1개(그 밖 페이지 전체 0개) /
 *      수여식 화면 광고·입력 없음 / 끝 화면: 결과 상장 → data-mg-end="award" 순서, MG_FAQ·PAGE_I18N, 스크립트 순서.
 *   4) award.js 안전: innerHTML·insertAdjacentHTML·document.write·eval 을 쓰지 않음(사용자 글은 textContent·canvas 로만), 서버로 글을 보내지 않음(fetch·supa 호출 없음),
 *      움직임은 prefers-reduced-motion 에서 멈춤.
 *   5) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG.
 *
 * 실행: node tools/check-award.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'award-core.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NAMES = ['', 'Jamie', '김민지', 'さくら', 'น้องมายด์', 'Маша', 'Léa « Lou »', '🏆🎉 Hi', 'Günter ß', 'Minh Anh', '小雨', 'a'.repeat(60), '  spaced   out  '];
const TEXTS = ['', 'For keeping the group chat alive all year', '위 사람은 한 해 동안 웃음을 공급하였기에 이 상을 드립니다.', 'あなたは一年間がんばりました。', 'เนื่องจากใจดีที่สุดในทีม', 'За доброту! 🏆', '🏆'.repeat(300), 'x'.repeat(400)];
const DATES = ['2026-11-15', '2026-12-31', '2000-01-01', '2099-12-31', '2028-02-29'];
function checkCore() {
  const T = CORE.THEMES;
  if (T.length !== 4) bad(`테마 ${T.length}개 (4개)`);
  if (T.map((x) => x.id).join() !== 'gold,pastel,minimal,ribbon') bad(`테마 id ${T.map((x) => x.id)}`);
  const HEX = /^#[0-9a-f]{6}$/i;
  T.forEach((th) => {
    if (!th.emoji || th.bg.length !== 2 || !th.bg.every((c) => HEX.test(c)) || ![th.paper, th.frame, th.frame2, th.accent, th.ink, th.sub].every((c) => HEX.test(c))) bad(`테마 ${th.id}: 이모지·색 형식`);
    if (th.style !== th.id) bad(`테마 ${th.id}: style ${th.style}`);
  });
  if (CORE.SEALS.join() !== 'none,red,gold') bad(`도장 ${CORE.SEALS}`);
  if (CORE.W !== 1240 || CORE.H !== 1754) bad(`그림 크기 ${CORE.W}×${CORE.H} (1240×1754)`);
  if (Math.abs(CORE.H / CORE.W - Math.SQRT2) > 0.002) bad('그림 비율이 A4(1:√2)가 아님');
  const dd = CORE.defaults(new Date(2026, 10, 15, 23, 30));
  if (!CORE.normalize(dd) || dd.d !== '2026-11-15' || dd.t !== 0 || dd.s !== 1) bad(`defaults() ${JSON.stringify(dd)}`);
  if (CORE.today(new Date(2027, 0, 5)) !== '2027-01-05') bad('today() 형식');
  // 날짜
  ['2026-02-30', '2026-13-01', '1999-12-31', '2100-01-01', '2026-1-5', '20261115', '', null, 20261115, '2027-02-29'].forEach((d) => { if (CORE.validDate(d)) bad(`validDate(${JSON.stringify(d)}) 는 false`); });
  DATES.forEach((d) => { if (!CORE.validDate(d)) bad(`validDate(${d}) 는 true`); });
  G.LOCALES.forEach(({ code }) => {
    const f = CORE.formatDate('2026-12-24', code);
    if (!f || f === '2026-12-24' || !/24/.test(f)) bad(`formatDate(${code}) "${f}"`);
  });
  if (CORE.formatDate('2026-02-30', 'en') !== '') bad('formatDate(잘못된 날짜) = ""');

  // 글 정리
  const ct = CORE.cleanText;
  if (ct('<b>Hi</b>', 30) !== 'Hi' || ct('a<b', 30) !== 'ab') bad(`cleanText 태그·꺾쇠 제거: "${ct('<b>Hi</b>', 30)}"`);
  if (ct('<img src=x onerror=alert(1)>Bob', 30) !== 'Bob') bad(`cleanText 이 태그를 지우지 않음: "${ct('<img src=x onerror=alert(1)>Bob', 30)}"`);
  if (ct('  a\u0000​ b\n c  ', 30) !== 'a b c') bad(`cleanText 제어 문자·공백: "${ct('  a\u0000​ b\n c  ', 30)}"`);
  if (ct('a‮b⁦c', 30) !== 'a b c') bad('cleanText 가 방향 제어 문자를 남김');
  if (Array.from(ct('🏆'.repeat(300), CORE.LIMITS.m)).length !== CORE.LIMITS.m) bad('cleanText 는 코드 포인트로 자른다');
  if (ct(null, 5) !== '' || ct(undefined, 5) !== '' || ct(42, 5) !== '42') bad('cleanText(null/숫자)');
  if (ct('👨‍👩‍👧', 20) !== '👨‍👩‍👧') bad('cleanText 가 이모지 조합(ZWJ)을 깨뜨림');

  // 무작위 상장 왕복
  let rt = 0;
  let maxLen = 0;
  for (let i = 0; i < 3000; i++) {
    const d = { t: i % T.length, s: i % 3, d: DATES[i % DATES.length], ti: NAMES[(i + 1) % NAMES.length], to: NAMES[i % NAMES.length], m: TEXTS[i % TEXTS.length], is: NAMES[(i + 5) % NAMES.length] };
    const enc = CORE.encode(d);
    if (!enc || !/^[A-Za-z0-9_-]+$/.test(enc)) { bad(`encode 실패/형식 이상: ${JSON.stringify(d)}`); continue; }
    maxLen = Math.max(maxLen, enc.length);
    const back = CORE.decode(enc);
    if (!CORE.same(back, CORE.normalize(d))) { bad(`왕복 불일치: ${JSON.stringify(d)} → ${JSON.stringify(back)}`); continue; }
    rt++;
  }
  const L = CORE.LIMITS;
  const worst = { t: 3, s: 2, d: '2099-12-31', ti: '🏆'.repeat(L.ti), to: '🏆'.repeat(L.to), m: '🏆'.repeat(L.m), is: '🏆'.repeat(L.is) };
  const wEnc = CORE.encode(worst);
  if (!wEnc || wEnc.length > CORE.MAX_HASH) bad(`최대 길이 링크 ${wEnc && wEnc.length}자 > ${CORE.MAX_HASH}`);
  else if (!CORE.same(CORE.decode(wEnc), CORE.normalize(worst))) bad('최대 길이 링크 왕복 불일치');
  const empty = { t: 2, s: 0, d: '2026-11-15', ti: '', to: '', m: '', is: '' };
  if (!CORE.same(CORE.decode(CORE.encode(empty)), empty)) bad('빈 상장 왕복');
  if (CORE.encode({ ...empty, t: 9 }) !== null) bad('encode(잘못된 상장) 은 null');
  // 잘못된 링크
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const ok = { v: 1, t: 0, s: 0, d: '2026-11-15' };
  const badInputs = {
    empty: '', garbage: '!!!', spaces: 'ab cd', plus: 'ab+cd', longStr: 'A'.repeat(CORE.MAX_HASH + 5), notJson: b64('hello'), wrongV: b64({ ...ok, v: 2 }), noV: b64({ t: 0, s: 0, d: '2026-11-15' }),
    themeRange: b64({ ...ok, t: 4 }), themeNeg: b64({ ...ok, t: -1 }), themeFrac: b64({ ...ok, t: 0.5 }), themeStr: b64({ ...ok, t: '0' }), noTheme: b64({ v: 1, s: 0, d: '2026-11-15' }),
    sealRange: b64({ ...ok, s: 3 }), sealStr: b64({ ...ok, s: '1' }), noSeal: b64({ v: 1, t: 0, d: '2026-11-15' }),
    dateBad: b64({ ...ok, d: '2026-02-30' }), dateFmt: b64({ ...ok, d: '15/11/2026' }), dateNum: b64({ ...ok, d: 20261115 }), noDate: b64({ v: 1, t: 0, s: 0 }), dateScript: b64({ ...ok, d: '<script>' }),
    tiObj: b64({ ...ok, ti: { x: 1 } }), toNum: b64({ ...ok, to: 5 }), isArr: b64({ ...ok, is: ['x'] }), msgBool: b64({ ...ok, m: true }), msgHuge: b64({ ...ok, m: 'x'.repeat(401) }),
    badUtf8: Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''), arr: b64([1, 2, 3]), nul: b64('null'), proto: b64('{"__proto__":{"t":0},"v":1}'),
  };
  Object.entries(badInputs).forEach(([k, v]) => { if (CORE.decode(v) !== null) bad(`decode(${k}) 는 null 이어야 함`); });
  if (CORE.decode(null) !== null || CORE.decode(42) !== null || CORE.decode({}) !== null) bad('decode(비문자열) 은 null');
  const xss = CORE.decode(b64({ ...ok, ti: '<img src=x onerror=alert(1)>Top', to: '<script>x</script>' + 'z'.repeat(60), m: '"><svg onload=alert(1)>' + 'm'.repeat(300), is: '<b>' + 'y'.repeat(80) }));
  if (!xss) bad('decode 가 꺾쇠 든 글을 정리하지 않고 버림');
  else {
    if (/[<>]/.test(xss.ti + xss.to + xss.m + xss.is)) bad('decode 한 글에 꺾쇠가 남음');
    if (Object.keys(L).some((k) => Array.from(xss[k]).length > L[k])) bad('decode 가 글 길이를 자르지 않음');
    if (Object.keys(xss).sort().join() !== [...CORE.KEYS].sort().join()) bad(`decode 결과 키 ${Object.keys(xss)}`);
  }
  const extra = CORE.decode(b64({ ...ok, evil: 'x', ti: 'A' }));
  if (!extra || 'evil' in extra) bad('decode 가 모르는 키를 그대로 넘김');

  // 줄바꿈
  const meas = (s) => Array.from(s).length * 10;
  const samples = [['for keeping the group chat alive all year long', 'en'], ['위 사람은 한 해 동안 단톡방에 웃음을 공급하였기에 이 상을 드립니다', 'ko'], ['あなたは一年間、グループLINEを笑いで盛り上げ続けました。', 'ja'], ['在过去的一年里，你让群聊从未冷场，特发此奖。', 'zh'], ['เนื่องจากทำให้กลุ่มไลน์ไม่เคยเงียบเหงา ด้วยมีมคุณภาพสูง', 'th'], ['За целый год мемов высшего качества в общем чате 🏆', 'ru'], ['a'.repeat(50), 'en'], ['🏆'.repeat(20), 'en'], ['', 'en']];
  let wraps = 0;
  samples.forEach(([txt, lang]) => [60, 120, 250].forEach((w) => {
    const lines = CORE.wrap(meas, txt, w, lang);
    lines.forEach((ln) => { if (!ln || ln !== ln.trim()) bad(`wrap 빈/공백 줄: "${ln}"`); if (meas(ln) > w && CORE.graphemes(ln).length > 1) bad(`wrap 폭 초과 "${ln}"`); });
    if (lines.join('').replace(/\s/g, '') !== txt.replace(/\s/g, '')) bad(`wrap 글자 손실: "${txt}"`);
    wraps++;
  }));
  // 도장 글자
  const sc = CORE.sealChar;
  if (sc('3팀 일동', '상') !== '팀' || sc('anna', '★') !== 'A' || sc('', '賞') !== '賞' || sc('🎉', '奖') !== '奖' || sc('2027', '★') !== '2' || sc('<b>x', '★') !== 'X' || sc('Маша') !== 'М') bad('sealChar');
  console.log(`\n=== 로직: 테마 ${T.length}개 · 도장 ${CORE.SEALS.length}개 · #d= 왕복 ${rt.toLocaleString()}개 (최대 ${maxLen}자, 최악 ${wEnc && wEnc.length}자 / 한도 ${CORE.MAX_HASH}) · 잘못된 링크 ${Object.keys(badInputs).length}종 거부 · wrap ${wraps}건 ===`);
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
const longestWord = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s ]+|-/).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');

// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%). hard = 실패, 아니면 (참고)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 19 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 28, size: 14 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 15 * 1.12, hard: true, what: 'h1 검색어 줄' },
  { key: 'editor.done', get: (T) => T.editor.done, px: 328 - 36, size: 19 * 1.08, hard: true, what: '완성 버튼 한 줄' },
  { key: 'open.open', get: (T) => T.open.open, px: 328 - 36, size: 19 * 1.08, hard: true, what: '상장 펼치기 버튼 한 줄' },
  { key: 'result.save', get: (T) => '📥 ' + T.result.save, px: 296 - 24, size: 16 * 1.08, hard: true, what: '이미지 저장 버튼 한 줄' },
  { key: 'result.edit', get: (T) => '✏️ ' + T.result.edit, px: 296 - 24, size: 16 * 1.08, hard: true, what: '고치기 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.retryFriend', get: (T) => T.result.retryFriend, px: 328 - 24, size: 16 * 1.08, hard: true, what: '나도 만들기 버튼 한 줄' },
  { key: 'editor.title', get: (T) => T.editor.title, px: 328, size: 22 * 1.08, hard: false, what: '편집기 제목 한 줄' },
  { key: 'editor.fields.date.label', get: (T) => T.editor.fields.date.label, px: 155, size: 15 * 1.08, hard: true, what: '날짜 라벨 한 줄(반 칸)' },
  { key: 'editor.fields.issuer.label', get: (T) => T.editor.fields.issuer.label, px: 155, size: 15 * 1.08, hard: true, what: '주는 사람 라벨 한 줄(반 칸)' },
  { key: 'reason+dice', get: (T) => T.editor.fields.reason.label + 'MM' + T.editor.dice, px: 328 - 28, size: 15 * 1.08, hard: true, what: '수상 이유 라벨 + 🎲 버튼 한 줄' },
  { key: 'seals', get: (T) => Object.values(T.editor.seals).join('') + '🚫🔴🏅', px: 328 - 3 * 24 - 16 - 12, size: 13.5 * 1.08, hard: false, what: '도장 버튼 세 개 한 줄(넘치면 줄바꿈)' },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_DISPLAY = ['Nunito', 'Rubik', 'Comfortaa', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha'];
const VIET_DISPLAY = ['Nunito', 'Baloo 2', 'Be Vietnam Pro', 'Plus Jakarta Sans', 'Comfortaa', 'Pangolin', 'Unbounded', 'Montserrat Alternates'];
// 상장 글꼴(serif): 라틴 확장·키릴·베트남어 = Playfair Display, 한중일·태국어는 그 문자를 가진 명조/세리프 글꼴
const SERIF_OK = { ko: ['Nanum Myeongjo'], ja: ['Shippori Mincho'], zh: ['Noto Serif SC'], th: ['Trirong'] };
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;

function checkLocales() {
  const base = new Set(shape(L10N.en));
  const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
  const en = Object.fromEntries(flat(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    const s = new Set(shape(T));
    const missing = [...base].filter((k) => !s.has(k));
    const extra = [...s].filter((k) => !base.has(k));
    if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
    if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
    if (lang !== 'en') {
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.') || k === 'result.fileName' || k === 'editor.counter' || k === 'card.name' || k === 'card.sealFallback') return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = flat(T).filter(([k, v]) => typeof v === 'string' && !v.trim() && k !== 'fonts.sans').map(([k]) => k);
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    // 디자인·도장 이름
    CORE.THEMES.forEach((th) => { if (!T.editor.themes[th.id]) bad(`${tag} editor.themes.${th.id} 없음`); });
    if (Object.keys(T.editor.themes).length !== CORE.THEMES.length) bad(`${tag} editor.themes 개수`);
    CORE.SEALS.forEach((id) => { if (!T.editor.seals[id]) bad(`${tag} editor.seals.${id} 없음`); });
    ['title', 'to', 'reason', 'issuer'].forEach((k) => { if (!T.editor.fields[k].placeholder || !T.editor.fields[k].label) bad(`${tag} editor.fields.${k} 라벨/예시 없음`); });
    if (!T.editor.fields.date.label) bad(`${tag} editor.fields.date.label 없음`);
    // 자리표시자
    [['card.name', T.card.name], ['open.forName', T.open.forName], ['result.eyebrowFriend', T.result.eyebrowFriend], ['result.shareText', T.result.shareText]].forEach(([k, v]) => { if ((v.match(/\{name\}/g) || []).length !== 1) bad(`${tag} ${k} 에 {name} 이 하나 있어야 함`); });
    [['open.forNone', T.open.forNone], ['result.eyebrowFriendNoName', T.result.eyebrowFriendNoName], ['result.shareTextNoName', T.result.shareTextNoName], ['card.heading', T.card.heading], ['card.presented', T.card.presented], ['card.closing', T.card.closing]].forEach(([k, v]) => { if (/\{\w+\}/.test(v)) bad(`${tag} ${k} 에 자리표시자가 있으면 안 됨`); });
    if (!T.result.imageAlt.includes('{title}')) bad(`${tag} result.imageAlt 에 {title} 없음`);
    if (!T.editor.counter.includes('{n}') || !T.editor.counter.includes('{max}')) bad(`${tag} editor.counter 에 {n}/{max} 없음`);
    if (!/^[a-z0-9-]+$/i.test(T.result.fileName)) bad(`${tag} result.fileName "${T.result.fileName}" (영문·숫자·- 만)`);
    if (Array.from(T.card.sealFallback).length !== 1) bad(`${tag} card.sealFallback 은 한 글자`);
    if (emWidth(T.card.heading) * 124 > 820 * 1.6) warn(`${tag} card.heading "${T.card.heading}" 가 상장에서 많이 줄어듦`);
    if (Array.from(T.card.defaultTitle).length > CORE.LIMITS.ti) bad(`${tag} card.defaultTitle 이 ${CORE.LIMITS.ti}자 넘음`);
    // 상 이름 예시
    const X = T.editor.titleExamples;
    if (!Array.isArray(X) || X.length < 3 || X.length > 5) bad(`${tag} editor.titleExamples 는 3~5개`);
    else {
      X.forEach((v, i) => { if (CORE.cleanText(v, CORE.LIMITS.ti) !== v) bad(`${tag} titleExamples[${i}] "${v}" 가 ${CORE.LIMITS.ti}자 넘거나 정리 대상`); });
      if (new Set(X).size !== X.length) bad(`${tag} titleExamples 중복`);
      if (lang !== 'en' && X.some((v) => L10N.en.editor.titleExamples.includes(v))) bad(`${tag} titleExamples 가 영어 그대로`);
      if (emWidth(X.join('')) * 13.5 * 1.08 + X.length * 30 > 328 * 3) warn(`${tag} 상 이름 예시 칩이 3줄을 넘을 수 있음`);
    }
    // 랜덤 수상 이유
    const P = T.editor.reasons;
    if (!Array.isArray(P) || P.length < 10 || P.length > 14) bad(`${tag} editor.reasons 는 10~14개 (${P && P.length})`);
    else {
      P.forEach((m, i) => {
        if (CORE.cleanText(m, 999) !== m) bad(`${tag} reasons[${i}] 앞뒤 공백·꺾쇠·줄바꿈`);
        if (Array.from(m).length > CORE.LIMITS.m) bad(`${tag} reasons[${i}] ${Array.from(m).length}자 > ${CORE.LIMITS.m}`);
        if (/\{\w+\}/.test(m)) bad(`${tag} reasons[${i}] 에 자리표시자`);
        if (lang !== 'en' && L10N.en.editor.reasons.includes(m)) bad(`${tag} reasons[${i}] 가 영어 그대로`);
      });
      if (new Set(P).size !== P.length) bad(`${tag} reasons 중복`);
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
    if (!F.css || !F.display || !F.serif || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display / serif 이상`);
    const first = String(F.display || '').split(',')[0].replace(/['"]/g, '').trim();
    const serif = String(F.serif || '').split(',')[0].replace(/['"]/g, '').trim();
    if (lang === 'ru' && !CYRILLIC_DISPLAY.includes(first)) bad(`${tag} 제목 글꼴 "${first}" 키릴 문자 지원 확인`);
    if (lang === 'vi' && !VIET_DISPLAY.includes(first)) bad(`${tag} 제목 글꼴 "${first}" 베트남어 성조 지원 확인`);
    if (SERIF_OK[lang] ? !SERIF_OK[lang].includes(serif) : serif !== 'Playfair Display') bad(`${tag} 상장 글꼴 ${serif} 가 이 언어 글자를 지원하는지 확인 필요`);
    [first, serif].forEach((fam) => { if (F.css && !F.css.includes('family=' + fam.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${fam} 가 없음`); });
    if (!F.css.includes(`${serif.replace(/ /g, '+')}:wght@`) || !new RegExp(`${serif.replace(/ /g, '\\+')}:wght@[\\d;]*${Number(F.serifWeight)}`).test(F.css)) bad(`${tag} fonts.css 에 상장 글꼴 굵기 ${F.serifWeight} 가 없음`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) warn(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 그대로 담지 않음`);
    // 제목·설명 길이
    const wide = isWideLang(lang) && lang !== 'ko';
    const tl = visLen(T.meta.title);
    if (wide ? tl > 32 : tl > 52) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 32' : '라틴·키릴·한글 52'}자 이하)`);
    if (tl < 6) bad(`${tag} meta.title 이 너무 짧음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 160] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    // 폭 예산
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const need = emWidth(v) * b.size;
      if (need > b.px) (b.hard ? bad : warn)(`${tag} ${b.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(b.px)}px (${b.what})`);
    });
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const unit = isWideLang(lang) ? txt : longestWord(txt);
      const w34 = emWidth(unit) * 34 * 1.05;
      const w40 = emWidth(unit) * 40 * 1.05;
      if (w34 > 328 || w40 > 343) (isWideLang(lang) ? warn : bad)(`${tag} h1 "${unit}" ≈ ${Math.round(w40)}px @40px (한 줄 343px)`);
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
  if (!/<link rel="canonical" href="https:\/\/award\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/award\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
    if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"MultimediaApplication"/.test(html)) bad(`${tag} appLd(WebApplication, create) 없음`);
    const start = section(html, 'screen-start');
    const edit = section(html, 'screen-edit');
    const open = section(html, 'screen-open');
    const end = section(html, 'screen-end');
    if (!start || !edit || !open || !end) { bad(`${tag} 시작/편집기/수여식/끝 화면 중 없는 것이 있음`); return; }
    ['screen-edit', 'screen-open', 'screen-end'].forEach((id) => { if (!new RegExp(`<section id="${id}"[^>]*hidden`).test(html)) bad(`${tag} ${id} 는 처음에 hidden`); });
    if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
    // 시작 화면: 티징만 + 맨 끝 광고 1개
    if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
    if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
    if (/data-mg-end|mg-faq|more-test|aw-theme|aw-seal|aw-ex\b|<input|<canvas|<details|<textarea|<select/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력 칸/디자인 목록/상장 그림`);
    if (!/<h1 class="aw-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
    if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
    const startText = start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    // 스포일러 금지: 시작 화면에 FAQ·랜덤 이유·상 이름 예시를 인용하지 않는다
    [...T.faq.map((q) => q.q), ...T.editor.reasons, ...T.editor.titleExamples].forEach((v) => { if (startText.includes(G.esc(v))) bad(`${tag} 시작 화면에 편집기/FAQ 문구 "${v}"`); });
    if ((edit.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 편집기 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 편집기의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
    if (edit.indexOf('class="mg-ad"') < edit.indexOf('id="done-btn"')) bad(`${tag} 편집기 광고는 편집기 아래`);
    if ((edit.match(/class="aw-chip aw-theme[ "]/g) || []).length !== CORE.THEMES.length) bad(`${tag} 편집기 디자인 버튼 ${CORE.THEMES.length}개가 아님`);
    if ((edit.match(/class="aw-seal[ "]/g) || []).length !== CORE.SEALS.length) bad(`${tag} 도장 버튼 ${CORE.SEALS.length}개가 아님`);
    if ((edit.match(/class="aw-ex"/g) || []).length !== T.editor.titleExamples.length) bad(`${tag} 상 이름 예시 칩 수`);
    ['themes', 'seals', 'examples', 'preview-canvas', 'f-title', 'f-to', 'f-msg', 'f-date', 'f-issuer', 'msg-count', 'dice-btn', 'done-btn'].forEach((id) => { if (!edit.includes(`id="${id}"`)) bad(`${tag} 편집기에 #${id} 없음`); });
    [['f-title', CORE.LIMITS.ti], ['f-to', CORE.LIMITS.to], ['f-msg', CORE.LIMITS.m], ['f-issuer', CORE.LIMITS.is]].forEach(([id, n]) => { if (!new RegExp(`id="${id}"[^>]*maxlength="${n * 3}"`).test(edit)) bad(`${tag} #${id} maxlength ${n * 3}`); });
    if (!/id="f-date"[^>]*type="date"/.test(edit)) bad(`${tag} 날짜 칸은 type="date"`);
    if (!new RegExp(`width="${CORE.W}" height="${CORE.H}"`).test(edit)) bad(`${tag} 미리보기 canvas ${CORE.W}×${CORE.H}`);
    if (/mg-ad|data-mg-end|<input|<textarea/.test(open) || !open.includes('id="open-btn"') || !open.includes('id="open-cta"')) bad(`${tag} 수여식 화면: 펼치기 버튼만 (광고·입력·끝 화면 없음)`);
    const cardAt = end.indexOf('class="aw-card"');
    const endAt = end.indexOf('<div data-mg-end="award"></div>');
    if (!(cardAt > 0 && endAt > cardAt)) bad(`${tag} 끝 화면: 결과 상장 → data-mg-end="award" 순서가 아님`);
    if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
    ['save-btn', 'edit-btn', 'end-canvas', 'end-title', 'end-eyebrow'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
    if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    if (!(html.indexOf('award-core.js') > 0 && html.indexOf('award-core.js') < html.indexOf('award.js"'))) bad(`${tag} award-core.js 가 award.js 보다 먼저여야 함`);
    const pf = G.fileOf(lang, 'privacy.html');
    commonHtml(`[${lang}] ${pf}`, read(pf), lang);
    pages++;
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://award.example.com/</loc>') || !sm.includes('<loc>https://award.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  return pages;
}

// ---------------------------------------------------------------- 4) 앱 JS 안전·움직임
function checkJs() {
  const js = read('award.js');
  const code = js.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  if (/\.innerHTML|outerHTML|insertAdjacentHTML|document\.write|\beval\(|new Function/.test(code)) bad('award.js: innerHTML·insertAdjacentHTML·document.write·eval 금지 (사용자 글은 textContent·canvas 로만)');
  if (/\bfetch\(|XMLHttpRequest|sendBeacon|window\.supa\b|supa\./.test(code)) bad('award.js: 사용자 글을 서버로 보내는 코드(fetch·supa) 금지');
  if (!/textContent = .*fmt\(O\.forName/.test(code) || !/eyebrow\.textContent =/.test(code)) bad('award.js: 받은 이름은 textContent 로 넣어야 함');
  if (!/CORE\.decode\(h\.slice\(3\)\)/.test(code)) bad('award.js: #d= 는 CORE.decode 로만 읽어야 함');
  if (!/track\('start'\)/.test(code) || !/track\('done'\)/.test(code)) bad("award.js: track('start')·track('done') 없음");
  if (!/setShareData/.test(code) || !/setRetry/.test(code)) bad('award.js: setShareData·setRetry 없음');
  if (/supabase\.co|sb_publishable|service_role/i.test(js + read('award-core.js'))) bad('앱 JS 에 Supabase 값');
  if (!/REDUCED\.matches/.test(code)) bad('award.js: 수여식이 prefers-reduced-motion 을 보지 않음');
  const css = read('style.css');
  if (!/@keyframes aw-bob/.test(css) || !/prefers-reduced-motion: reduce\)[\s\S]*\.aw-hero span[^}]*animation: none/.test(css)) bad('style.css: aw-bob 애니메이션 / prefers-reduced-motion 멈춤 규칙 없음');
  if (!/prefers-reduced-motion: reduce\)[\s\S]*\.aw-open \.aw-scroll[^}]*animation: none[\s\S]*\.aw-scroll span[^}]*transition: none/.test(css)) bad('style.css: 두루마리 움직임 prefers-reduced-motion 멈춤 규칙 없음');
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
console.log('\n결과: 통과 — 디자인·도장·날짜·정리·#d= 왕복/거부·wrap·도장 글자, 언어 파일 12개(키·번역·예시·랜덤 이유·FAQ·글꼴·제목 길이·폭 예산), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치·끝 화면), JS 안전(innerHTML·서버 전송 없음), 움직임 줄이기, OG 이미지 모두 OK');
