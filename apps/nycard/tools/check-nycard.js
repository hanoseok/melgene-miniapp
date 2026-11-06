#!/usr/bin/env node
/**
 * 2027 연하장 검사.
 *   1) 로직(nycard-core.js): 디자인 6개(4~6)·id 중복·색·장식 위치 범위, 인사말 4개·꾸미기 비트(띠·2027·반짝이), 정리(cleanText: <>·제어 문자·길이),
 *      #d= 인코딩 ↔ 디코딩 왕복(한글·일본어·태국어·키릴·이모지·최대 길이), 잘못된 링크는 null(범위 밖 테마·인사말·장식 포함),
 *      최대 길이 링크 크기, wrap(줄바꿈: 단어·글자 단위·이모지 보존·모든 줄이 폭 안), 점 위치 고정(seeded).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 메시지 예시 3~6개(120자 이하, 언어마다 다름),
 *      FAQ 3~5개(일반 텍스트, "무료인가요?" 류 금지), 띠 문구·zodiacOn(한중일·베트남어는 켬), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어), 제목·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML: title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·입력 칸·FAQ·끝 화면 없음 / 편집기 화면 mg-ad 1개(그 밖 페이지 전체 0개) /
 *      봉투 화면 광고 없음 / 끝 화면: 결과 카드 → data-mg-end="nycard" 순서, MG_FAQ·PAGE_I18N, 스크립트 순서. 움직임은 prefers-reduced-motion 에서 멈춤.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG.
 *
 * 실행: node tools/check-nycard.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'nycard-core.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NAMES = ['', 'Sam', '할머니', 'おばあちゃん', 'คุณแม่', 'Бабушка', 'Léa « Lou »', '🐐🎍 Hi', 'Günter ß', 'Minh Anh', '小雨', 'a'.repeat(60), '  spaced   out  '];
const MSGS = ['', 'Happy New Year to you and yours, see you in 2027!', '새해 복 많이 받고 올해도 자주 보자!', '旧年中は大変お世話になりました。', 'ขอบคุณที่อยู่ข้างกันมาตลอดปี', 'С Новым годом! 🎄', '🎄'.repeat(200), 'x'.repeat(300)];
function checkCore() {
  const T = CORE.THEMES;
  if (T.length < 4 || T.length > 6) bad(`테마 ${T.length}개 (4~6개)`);
  if (new Set(T.map((x) => x.id)).size !== T.length) bad('테마 id 중복');
  const HEX = /^#[0-9a-f]{6}$/i;
  T.forEach((th) => {
    if (!th.emoji || !th.mark || th.bg.length !== 3 || !th.bg.every((c) => HEX.test(c)) || ![th.accent, th.text, th.sub, th.dot].every((c) => HEX.test(c))) bad(`테마 ${th.id}: 이모지·구분 글자·색 형식`);
    if (!['clouds', 'washi', 'meadow', 'line', 'hills', 'bursts'].includes(th.scene)) bad(`테마 ${th.id}: scene ${th.scene}`);
    if (th.deco.length < 6) bad(`테마 ${th.id}: 장식 ${th.deco.length}개 (6개 이상)`);
    th.deco.forEach((d) => {
      if (typeof d[0] !== 'string' || !(d[1] >= 0 && d[1] <= 1 && d[2] >= 0 && d[2] <= 1) || !(d[3] >= 30 && d[3] <= 140)) bad(`테마 ${th.id}: 장식 값 ${JSON.stringify(d)}`);
      if (d[1] > 0.16 && d[1] < 0.84 && d[2] > 0.3 && d[2] < 0.86) bad(`테마 ${th.id}: 글 자리(가운데)를 가리는 장식 ${JSON.stringify(d)}`);
    });
  });
  if (CORE.GREETINGS.length !== 4 || CORE.GREETINGS.join() !== 'happy,formal,luck,year') bad(`인사말 ${CORE.GREETINGS}`);
  if (CORE.DECOS.reduce((a, d) => a | d.bit, 0) !== CORE.ALL_DECO) bad('장식 비트 합 ≠ ALL_DECO');
  if (CORE.W !== 1080 || CORE.H !== 1350) bad(`그림 크기 ${CORE.W}×${CORE.H} (1080×1350)`);
  const dd = CORE.defaults();
  if (!CORE.normalize(dd) || dd.g !== 0) bad('defaults() 가 유효하지 않음');
  if (CORE.defaults('luck').g !== 2 || CORE.defaults('zzz').g !== 0) bad('defaults(인사말 id)');
  if (CORE.defaults('happy', true).o !== 7 || CORE.defaults('happy', false).o !== 6) bad('defaults(zodiacOn) 꾸미기 비트');
  if (CORE.YEAR !== 2027) bad(`YEAR ${CORE.YEAR}`);
  if (CORE.DECOS.map((d) => d.id).join() !== 'zodiac,year,sparkle') bad(`꾸미기 ${CORE.DECOS.map((d) => d.id)}`);
  if (!CORE.hasDeco({ o: 5 }, 'zodiac') || CORE.hasDeco({ o: 5 }, 'year') || !CORE.hasDeco({ o: 5 }, 'sparkle')) bad('hasDeco');
  const s1 = JSON.stringify(CORE.snowflakes(3, 40));
  if (s1 !== JSON.stringify(CORE.snowflakes(3, 40)) || s1 === JSON.stringify(CORE.snowflakes(4, 40))) bad('snowflakes 는 같은 seed = 같은 자리, 다른 seed = 다른 자리');
  if (CORE.snowflakes(1, 200).some((f) => f.x < 0 || f.x > CORE.W || f.y < 0 || f.y > CORE.H)) bad('snowflakes 범위');

  // 글 정리
  const ct = CORE.cleanText;
  if (ct('<b>Hi</b>', 30) !== 'Hi' || ct('a<b', 30) !== 'ab') bad(`cleanText 태그·꺾쇠 제거: "${ct('<b>Hi</b>', 30)}"`);
  if (ct('  a\u0000​ b\n c  ', 30) !== 'a b c') bad(`cleanText 제어 문자·공백: "${ct('  a\u0000​ b\n c  ', 30)}"`);
  if (Array.from(ct('🎄'.repeat(200), CORE.LIMITS.m)).length !== CORE.LIMITS.m) bad('cleanText 는 코드 포인트로 자른다');
  if (ct(null, 5) !== '' || ct(undefined, 5) !== '') bad('cleanText(null) = ""');
  if (ct(42, 5) !== '42') bad('cleanText(숫자)');
  if (ct('👨‍👩‍👧', 20) !== '👨‍👩‍👧') bad('cleanText 가 이모지 조합(ZWJ)을 깨뜨림');

  // 무작위 카드 왕복
  let rt = 0;
  let maxLen = 0;
  for (let i = 0; i < 3000; i++) {
    const d = { t: i % T.length, g: i % 4, o: i % 8, to: NAMES[i % NAMES.length], fr: NAMES[(i + 3) % NAMES.length], m: MSGS[i % MSGS.length] };
    const enc = CORE.encode(d);
    if (!enc || !/^[A-Za-z0-9_-]+$/.test(enc)) { bad(`encode 실패/형식 이상: ${JSON.stringify(d)}`); continue; }
    maxLen = Math.max(maxLen, enc.length);
    const back = CORE.decode(enc);
    const want = CORE.normalize(d);
    if (!CORE.same(back, want)) { bad(`왕복 불일치: ${JSON.stringify(d)} → ${JSON.stringify(back)}`); continue; }
    rt++;
  }
  const worst = { t: 5, g: 3, o: 7, to: '🎄'.repeat(CORE.LIMITS.to), fr: '🎄'.repeat(CORE.LIMITS.fr), m: '🎄'.repeat(CORE.LIMITS.m) };
  const wEnc = CORE.encode(worst);
  if (!wEnc || wEnc.length > CORE.MAX_HASH) bad(`최대 길이 링크 ${wEnc && wEnc.length}자 > ${CORE.MAX_HASH}`);
  else if (!CORE.same(CORE.decode(wEnc), CORE.normalize(worst))) bad('최대 길이 링크 왕복 불일치');
  const empty = { t: 2, g: 1, o: 0, to: '', fr: '', m: '' };
  if (!CORE.same(CORE.decode(CORE.encode(empty)), empty)) bad('빈 카드 왕복');
  // 잘못된 링크
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const ok = { v: 1, t: 0, g: 0, o: 0 };
  const badInputs = {
    empty: '', garbage: '!!!', spaces: 'ab cd', longStr: 'A'.repeat(CORE.MAX_HASH + 5), notJson: b64('hello'), wrongV: b64({ ...ok, v: 2 }), noV: b64({ t: 0, g: 0, o: 0 }),
    themeRange: b64({ ...ok, t: 9 }), themeNeg: b64({ ...ok, t: -1 }), themeFrac: b64({ ...ok, t: 0.5 }), themeStr: b64({ ...ok, t: '0' }), noTheme: b64({ v: 1, g: 0, o: 0 }),
    greetRange: b64({ ...ok, g: 4 }), greetStr: b64({ ...ok, g: '1' }), noGreet: b64({ v: 1, t: 0, o: 0 }), decoRange: b64({ ...ok, o: 8 }), decoNeg: b64({ ...ok, o: -1 }), noDeco: b64({ v: 1, t: 0, g: 0 }),
    toObj: b64({ ...ok, to: { x: 1 } }), toNum: b64({ ...ok, to: 5 }), frArr: b64({ ...ok, fr: ['x'] }), msgBool: b64({ ...ok, m: true }),
    badUtf8: Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''), arr: b64([1, 2, 3]), nul: b64('null'),
  };
  Object.entries(badInputs).forEach(([k, v]) => { if (CORE.decode(v) !== null) bad(`decode(${k}) 는 null 이어야 함`); });
  if (CORE.decode(null) !== null || CORE.decode(42) !== null) bad('decode(비문자열) 은 null');
  const withText = CORE.decode(b64({ ...ok, to: '<script>x</script>' + 'z'.repeat(60), fr: '<b>' + 'y'.repeat(80), m: 'm'.repeat(500) }));
  if (!withText || /[<>]/.test(withText.to + withText.fr) || Array.from(withText.to).length > CORE.LIMITS.to || Array.from(withText.fr).length > CORE.LIMITS.fr || Array.from(withText.m).length > CORE.LIMITS.m) bad('decode 가 글을 정리·자르지 않음');

  // 줄바꿈: 모든 줄이 폭 안, 글자 손실 없음, 빈 줄 없음
  const meas = (s) => Array.from(s).length * 10;
  const samples = [['hello big world of snow and twinkling lights', 'en'], ['올 한 해 정말 고마웠어 따뜻하고 행복한 크리스마스 보내', 'ko'], ['今年もたくさんありがとう。あったかくて楽しいクリスマスを過ごしてね！', 'ja'], ['谢谢你这一年的陪伴，祝你圣诞快乐，天天开心！', 'zh'], ['ขอบคุณที่อยู่ข้างกันมาตลอดปี ขอให้คริสต์มาสนี้อบอุ่น', 'th'], ['С Новым годом! Пусть мандарины будут сладкими 🎄👻', 'ru'], ['a'.repeat(50), 'en'], ['   leading and trailing   ', 'en'], ['🎄'.repeat(20), 'en'], ['', 'en']];
  let wraps = 0;
  samples.forEach(([txt, lang]) => [60, 120, 250].forEach((w) => {
    const lines = CORE.wrap(meas, txt, w, lang);
    lines.forEach((ln) => { if (!ln || ln !== ln.trim()) bad(`wrap 빈/공백 줄: "${ln}"`); if (meas(ln) > w && CORE.graphemes(ln).length > 1) bad(`wrap 폭 초과 "${ln}" ${meas(ln)} > ${w}`); });
    if (lines.join('').replace(/\s/g, '') !== txt.replace(/\s/g, '')) bad(`wrap 글자 손실: "${txt}" → ${JSON.stringify(lines)}`);
    wraps++;
  }));
  if (CORE.wrap(meas, 'hello big world', 100, 'en').join('|') !== 'hello big|world') bad(`wrap 공백 우선: ${CORE.wrap(meas, 'hello big world', 100, 'en')}`);
  if (CORE.wrap(meas, '👨‍👩‍👧 family', 40, 'en').some((l) => /^‍|‍$/.test(l))) bad('wrap 이 이모지 조합을 끊음');
  console.log(`\n=== 로직: 테마 ${T.length}개 · 인사말 ${CORE.GREETINGS.length}개 · #d= 왕복 ${rt.toLocaleString()}개 (최대 ${maxLen}자, 최악 ${wEnc && wEnc.length}자) · 잘못된 링크 ${Object.keys(badInputs).length}종 거부 · wrap ${wraps}건 ===`);
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
// 보이는 글자 수 (태국어 결합 부호 제외)
const visLen = (s) => Array.from(String(s)).filter((ch) => !THAI_MARK(ch.codePointAt(0))).length;
const isWideLang = (lang) => ['ja', 'zh', 'ko', 'th'].includes(lang);
const longestWord = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s\u00a0]+|-/).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');

// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%). hard = 실패, 아니면 (참고)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 19 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 28, size: 14 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 15 * 1.12, hard: true, what: 'h1 검색어 줄' },
  { key: 'editor.done', get: (T) => T.editor.done, px: 328 - 36, size: 19 * 1.08, hard: true, what: '완성 버튼 한 줄' },
  { key: 'open.open', get: (T) => T.open.open, px: 328 - 36, size: 19 * 1.08, hard: true, what: '카드 열기 버튼 한 줄' },
  { key: 'result.save', get: (T) => T.result.save, px: 296 - 24 - 28, size: 16 * 1.08, hard: true, what: '이미지 저장 버튼 한 줄' },
  { key: 'result.copyText', get: (T) => T.result.copyText, px: 296 - 24 - 28, size: 16 * 1.08, hard: true, what: '텍스트 복사 버튼 한 줄' },
  { key: 'result.edit', get: (T) => T.result.edit, px: 296 - 24 - 28, size: 16 * 1.08, hard: true, what: '고치기 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.retryFriend', get: (T) => T.result.retryFriend, px: 328 - 24, size: 16 * 1.08, hard: true, what: '나도 만들기 버튼 한 줄' },
  { key: 'editor.title', get: (T) => T.editor.title, px: 328, size: 22 * 1.08, hard: false, what: '편집기 제목 한 줄' },
  { key: 'editor.fields.to.label', get: (T) => T.editor.fields.to.label, px: 155, size: 15 * 1.08, hard: true, what: '받는 사람 라벨 한 줄(반 칸)' },
  { key: 'editor.fields.from.label', get: (T) => T.editor.fields.from.label, px: 155, size: 15 * 1.08, hard: true, what: '보내는 사람 라벨 한 줄(반 칸)' },
  { key: 'message+ideas', get: (T) => T.editor.fields.message.label + 'MM' + T.editor.ideas, px: 328 - 28, size: 15 * 1.08, hard: true, what: '메시지 라벨 + 문구 추천 버튼 한 줄' },
  { key: 'decos', get: (T) => Object.values(T.editor.decos).join('') + '🐐🗓✨', px: 328 - 3 * 24 - 16 - 12, size: 13.5 * 1.08, hard: false, what: '장식 버튼 세 개 한 줄(넘치면 줄바꿈)' },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_DISPLAY = ['Nunito', 'Rubik', 'Comfortaa', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha', 'Pacifico'];
const VIET_DISPLAY = ['Nunito', 'Baloo 2', 'Be Vietnam Pro', 'Plus Jakarta Sans', 'Comfortaa', 'Pangolin', 'Unbounded', 'Montserrat Alternates', 'Pacifico'];
// 인사말 글꼴(script): 라틴 확장·키릴·베트남어를 다 지원하는 Pacifico, 한중일·태국어는 그 문자를 가진 붓글씨·손글씨 글꼴
const SCRIPT_OK = { ko: ['Nanum Brush Script', 'Gaegu'], ja: ['Yuji Syuku', 'Yusei Magic'], zh: ['Ma Shan Zheng', 'ZCOOL KuaiLe'], th: ['Mali'] };
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|ranking|рейтинг/i;

function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length && !extra.every((k) => /^\.editor\.presets\[\d+\]$/.test(k))) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
      const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
      const en = Object.fromEntries(flat(L10N.en));
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.') || k === 'result.fileName' || k === 'editor.defaultGreeting' || k === 'editor.counter') return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = [];
    (function walk(o, p) { Object.entries(o).forEach(([k, v]) => { if (v && typeof v === 'object') walk(v, `${p}${k}.`); else if (typeof v === 'string' && !v.trim() && !/^fonts\.sans$/.test(`${p}${k}`)) empties.push(`${p}${k}`); }); })(T, '');
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    // 테마·인사말·장식 이름
    CORE.THEMES.forEach((th) => { if (!T.editor.themes[th.id]) bad(`${tag} editor.themes.${th.id} 없음`); });
    Object.keys(T.editor.themes).forEach((id) => { if (!CORE.THEMES.some((th) => th.id === id)) bad(`${tag} 모르는 테마 ${id}`); });
    CORE.GREETINGS.forEach((id) => { if (!T.card.greetings[id]) bad(`${tag} card.greetings.${id} 없음`); });
    if (new Set(Object.values(T.card.greetings)).size !== CORE.GREETINGS.length) bad(`${tag} 인사말이 서로 겹침`);
    CORE.DECOS.forEach((d) => { if (!T.editor.decos[d.id]) bad(`${tag} editor.decos.${d.id} 없음`); });
    if (!CORE.GREETINGS.includes(T.editor.defaultGreeting)) bad(`${tag} editor.defaultGreeting "${T.editor.defaultGreeting}"`);
    if (typeof T.editor.zodiacOn !== 'boolean') bad(`${tag} editor.zodiacOn 은 true/false`);
    if (['ja', 'zh', 'ko', 'vi'].includes(lang) && T.editor.zodiacOn !== true) bad(`${tag} 띠 문화권 언어는 양띠 배지를 처음부터 켬(editor.zodiacOn true)`);
    if (typeof T.card.zodiac !== 'string' || !T.card.zodiac.includes(String(CORE.YEAR))) bad(`${tag} card.zodiac 에 ${CORE.YEAR} 가 있어야 함`);
    else if (emWidth(T.card.zodiac) * 32 > 860 * 1.15) warn(`${tag} card.zodiac "${T.card.zodiac}" 가 카드에서 줄어들 만큼 김`);
    // 자리표시자
    [['card.to', T.card.to], ['card.from', T.card.from], ['open.fromName', T.open.fromName], ['result.eyebrowFriend', T.result.eyebrowFriend], ['result.shareText', T.result.shareText]].forEach(([k, v]) => { if ((v.match(/\{name\}/g) || []).length !== 1) bad(`${tag} ${k} 에 {name} 이 하나 있어야 함`); });
    [['open.fromNone', T.open.fromNone], ['result.eyebrowFriendNoName', T.result.eyebrowFriendNoName], ['result.shareTextNoName', T.result.shareTextNoName]].forEach(([k, v]) => { if (/\{name\}/.test(v)) bad(`${tag} ${k} 에 {name} 이 있으면 안 됨`); });
    if (!T.result.imageAlt.includes('{greeting}')) bad(`${tag} result.imageAlt 에 {greeting} 없음`);
    if (!T.editor.counter.includes('{n}') || !T.editor.counter.includes('{max}')) bad(`${tag} editor.counter 에 {n}/{max} 없음`);
    if (!/^[a-z0-9-]+$/i.test(T.result.fileName)) bad(`${tag} result.fileName "${T.result.fileName}" (영문·숫자·- 만)`);
    ['to', 'from', 'message'].forEach((k) => { if (!T.editor.fields[k].placeholder || !T.editor.fields[k].label) bad(`${tag} editor.fields.${k} 라벨/예시 없음`); });
    // 메시지 예시: 3~6개, 120자 이하, 서로 다름, 그 언어로 직접 쓴 것(영어 예시와 같은 문장 금지)
    const P = T.editor.presets;
    if (!Array.isArray(P) || P.length < 3 || P.length > 6) bad(`${tag} editor.presets 는 3~6개`);
    else {
      P.forEach((m, i) => {
        if (CORE.cleanText(m, 999) !== m) bad(`${tag} presets[${i}] 앞뒤 공백·꺾쇠·줄바꿈`);
        if (Array.from(m).length > CORE.LIMITS.m) bad(`${tag} presets[${i}] ${Array.from(m).length}자 > ${CORE.LIMITS.m}`);
        if (lang !== 'en' && L10N.en.editor.presets.includes(m)) bad(`${tag} presets[${i}] 가 영어 그대로`);
      });
      if (new Set(P).size !== P.length) bad(`${tag} presets 중복`);
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
    if (!F.css || !F.display || !F.script || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display / script 이상`);
    const first = String(F.display || '').split(',')[0].replace(/['"]/g, '').trim();
    const script = String(F.script || '').split(',')[0].replace(/['"]/g, '').trim();
    if (lang === 'ru' && (!CYRILLIC_DISPLAY.includes(first) || !CYRILLIC_DISPLAY.includes(script))) bad(`${tag} 글꼴 "${first}"/"${script}" 키릴 문자 지원 확인`);
    if (lang === 'vi' && (!VIET_DISPLAY.includes(first) || !VIET_DISPLAY.includes(script))) bad(`${tag} 글꼴 "${first}"/"${script}" 베트남어 성조 지원 확인`);
    if (SCRIPT_OK[lang] ? !SCRIPT_OK[lang].includes(script) : script !== 'Pacifico') bad(`${tag} 인사말 글꼴 ${script} 가 이 언어 글자를 지원하는지 확인 필요`);
    if (!isWideLang(lang) && first !== 'Nunito') warn(`${tag} 제목 글꼴 ${first} (라틴 확장·베트남어·키릴 모두 되는 Nunito 권장)`);
    [first, script].forEach((fam) => { if (F.css && !F.css.includes('family=' + fam.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${fam} 가 없음`); });
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) warn(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 그대로 담지 않음`);
    // 제목·설명 길이 (seo.md: 라틴 60자 안팎·CJK/태국 32자 안팎, 설명 110~155자·CJK 60~90자)
    const full = `${T.meta.title} | ${G.brandOf(lang)}`;
    const wide = isWideLang(lang) && lang !== 'ko';
    const tl = visLen(T.meta.title);
    if (wide ? tl > 32 : tl > 52) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 32' : '라틴·키릴·한글 52'}자 이하, 브랜드 포함 "${full}")`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
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
    // h1 큰 줄: 단어 하나가 360px(34px 글자)·375px(40px 글자, 343px 폭) 안에
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const unit = isWideLang(lang) ? txt : longestWord(txt);
      const w34 = emWidth(unit) * 34 * 1.05;
      const w40 = emWidth(unit) * 40 * 1.05;
      if (w34 > 328 || w40 > 343) (isWideLang(lang) ? warn : bad)(`${tag} h1 "${unit}" ≈ ${Math.round(w40)}px @40px (한 줄 343px)`);
    });
    Object.entries(T.editor.themes).forEach(([id, v]) => { if (emWidth(v) * 13.5 * 1.08 + 24 > 150) warn(`${tag} 테마 ${id} "${v}" 가 김`); });
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
  if (!/<link rel="canonical" href="https:\/\/nycard\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/nycard\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  // 스크립트 순서: site.config → i18n → common → supa
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
    const end = section(html, 'screen-end');
    if (!start || !edit || !end) { bad(`${tag} 시작/편집기/끝 화면 중 없는 것이 있음`); return; }
    if (!/<section id="screen-edit"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 편집기·끝 화면은 처음에 hidden`);
    if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
    if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
    if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
    if (/data-mg-end|mg-faq|more-test|ny-theme|ny-greet|<input|<canvas|<details|<textarea/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력 칸/테마 목록/카드 그림`);
    if (!/<h1 class="ny-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
    if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
    const startText = start.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (T.faq.some((q) => startText.includes(G.esc(q.q)))) bad(`${tag} 시작 화면에 FAQ 문구`);
    if ((edit.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 편집기 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 편집기의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
    if (edit.indexOf('class="mg-ad"') < edit.indexOf('id="done-btn"')) bad(`${tag} 편집기 광고는 편집기 아래`);
    if ((edit.match(/class="ny-chip ny-theme[ "]/g) || []).length !== CORE.THEMES.length) bad(`${tag} 편집기 테마 버튼 ${CORE.THEMES.length}개가 아님`);
    if ((edit.match(/class="ny-greet[ "]/g) || []).length !== CORE.GREETINGS.length) bad(`${tag} 인사말 버튼 ${CORE.GREETINGS.length}개가 아님`);
    if ((edit.match(/class="ny-greet is-on"/g) || []).length !== 1 || !edit.includes(`data-g="${CORE.greetingIndex(T.editor.defaultGreeting)}" aria-checked="true"`)) bad(`${tag} 처음 고른 인사말이 defaultGreeting 이 아님`);
    if ((edit.match(/class="ny-deco[ "]/g) || []).length !== CORE.DECOS.length) bad(`${tag} 장식 버튼 ${CORE.DECOS.length}개가 아님`);
    ['themes', 'greetings', 'decos', 'preview-canvas', 'f-to', 'f-from', 'f-msg', 'msg-count', 'idea-btn', 'done-btn'].forEach((id) => { if (!edit.includes(`id="${id}"`)) bad(`${tag} 편집기에 #${id} 없음`); });
    [['f-to', CORE.LIMITS.to], ['f-from', CORE.LIMITS.fr], ['f-msg', CORE.LIMITS.m]].forEach(([id, n]) => { if (!new RegExp(`id="${id}"[^>]*maxlength="${n * 3}"`).test(edit)) bad(`${tag} #${id} maxlength ${n * 3}`); });
    if (!new RegExp(`width="${CORE.W}" height="${CORE.H}"`).test(edit)) bad(`${tag} 미리보기 canvas ${CORE.W}×${CORE.H}`);
    const open = section(html, 'screen-open');
    if (!open || !/<section id="screen-open"[^>]*hidden/.test(html)) bad(`${tag} 봉투 화면(screen-open)이 없거나 처음에 hidden 아님`);
    else if (/mg-ad|data-mg-end|<input|<textarea/.test(open) || !open.includes('id="open-btn"') || !open.includes('id="open-cta"')) bad(`${tag} 봉투 화면: 열기 버튼만 (광고·입력·끝 화면 없음)`);
    const cardAt = end.indexOf('class="ny-card"');
    const endAt = end.indexOf('<div data-mg-end="nycard"></div>');
    if (!(cardAt > 0 && endAt > cardAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="nycard" 순서가 아님`);
    if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
    ['save-btn', 'copy-btn', 'edit-btn', 'end-canvas', 'end-title'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
    if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    if (!(html.indexOf('nycard-core.js') > 0 && html.indexOf('nycard-core.js') < html.indexOf('nycard.js"'))) bad(`${tag} nycard-core.js 가 nycard.js 보다 먼저여야 함`);
    // 개인정보
    const pf = G.fileOf(lang, 'privacy.html');
    commonHtml(`[${lang}] ${pf}`, read(pf), lang);
    pages++;
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://nycard.example.com/</loc>') || !sm.includes('<loc>https://nycard.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  // 시작 화면 이모지·봉투 움직임: 움직임 줄이기 설정이면 멈춤
  const css = read('style.css');
  if (!/@keyframes ny-bob/.test(css) || !/prefers-reduced-motion: reduce\)[\s\S]*\.ny-hero span[^}]*animation: none/.test(css)) bad('style.css: ny-bob 애니메이션 / prefers-reduced-motion 멈춤 규칙 없음');
  if (!/prefers-reduced-motion: reduce\)[\s\S]*\.ny-open \.ny-env[^}]*animation: none[\s\S]*\.ny-env span[^}]*transition: none/.test(css)) bad('style.css: 봉투 움직임 prefers-reduced-motion 멈춤 규칙 없음');
  if (!/REDUCED\.matches/.test(read('nycard.js'))) bad('nycard.js: 봉투 열기가 prefers-reduced-motion 을 보지 않음');
  // 앱 파일에 Supabase 값·가짜 숫자 흔적 없음
  ['nycard.js', 'nycard-core.js'].forEach((f) => { if (/supabase\.co|sb_publishable|service_role/i.test(read(f))) bad(`${f} 에 Supabase 값`); });
  return pages;
}

// ---------------------------------------------------------------- 4) OG 이미지
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
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개 · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 테마·인사말·장식·정리·#d= 왕복·wrap, 언어 파일 12개(키·번역·FAQ·글꼴·제목 길이·폭 예산), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), 움직임 줄이기, OG 이미지 모두 OK');
