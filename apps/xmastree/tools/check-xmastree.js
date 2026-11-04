#!/usr/bin/env node
/**
 * 크리스마스 트리 꾸미기 검사.
 *   1) 로직(xmastree-core.js): 트리 모양 4·배경 4·꼭대기 4·장식 13, 전구가 트리 안, 자동 꾸미기(트리 안·겹침 없음·최대 개수),
 *      정리(cleanText), 장식 압축(packOrn ↔ unpackOrn), #d= 인코딩 ↔ 디코딩 왕복(여러 문자·이모지·최대 장식 60개), 잘못된 링크는 null,
 *      최대 길이 링크 크기, hit(맨 위 장식), wrap.
 *   2) 언어 파일 12개: en.js 와 키 구조, // TODO-TRANSLATE 없음, 영어 그대로 없음, 자리표시자, 메시지 예시 3~6개(50자 이하), FAQ 3~5개
 *      (일반 텍스트, "무료인가요?" 류 금지), 한글은 ko 만, 글꼴(ru 키릴·vi 베트남어), 제목·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML: title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·도구·FAQ·끝 화면 없음 / 꾸미기 화면 mg-ad 1개(그 밖 0개) /
 *      끝 화면: 결과 트리 → data-mg-end="xmastree" 순서, MG_FAQ·PAGE_I18N, 스크립트 순서. 움직임은 prefers-reduced-motion 에서 멈춤.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG.
 *
 * 실행: node tools/check-xmastree.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'xmastree-core.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NAMES = ['', 'Sam', '할머니', 'おばあちゃん', 'คุณแม่', 'Бабушка', 'Léa « Lou »', '🎄🎁 Ho ho', 'Günter ß', 'Minh Anh', '小雨', 'a'.repeat(60), '  spaced   out  '];
const MSGS = ['', 'Merry Christmas from our house to yours!', '메리 크리스마스! 따뜻한 연말 보내세요', 'สุขสันต์วันคริสต์มาส', 'С Новым годом! 🎄', '🎄'.repeat(200), 'x'.repeat(300)];
function checkCore() {
  const HEX = /^#[0-9a-f]{6}$/i;
  if (CORE.STYLES.length !== 4 || CORE.BGS.length !== 4 || CORE.TOPPERS.length !== 4) bad('트리 모양·배경·꼭대기는 4개씩');
  if (CORE.KINDS.length !== 13) bad(`장식 ${CORE.KINDS.length}종 (13종)`);
  [CORE.STYLES, CORE.BGS, CORE.TOPPERS, CORE.KINDS].forEach((list) => { if (new Set(list.map((x) => x.id)).size !== list.length) bad('id 중복'); });
  CORE.STYLES.forEach((st) => {
    if (!st.emoji || st.leaf.length !== 3 || !st.leaf.every((c) => HEX.test(c)) || !HEX.test(st.edge) || !HEX.test(st.trunk)) bad(`트리 ${st.id}: 색 형식`);
    const L = CORE.lights(CORE.STYLES.indexOf(st));
    if (L.bulbs.length < 15) bad(`트리 ${st.id}: 전구 ${L.bulbs.length}개`);
    L.bulbs.forEach((b) => { if (!CORE.inTree(CORE.STYLES.indexOf(st), b.x, b.y - 12)) bad(`트리 ${st.id}: 트리 밖 전구 ${Math.round(b.x)},${Math.round(b.y)}`); });
  });
  CORE.KINDS.forEach((k) => { if (!(k.r >= 30 && k.r <= 70) || !(k.ball || k.shape || k.emoji)) bad(`장식 ${k.id}: 크기·모양`); if (k.ball && !HEX.test(k.ball)) bad(`장식 ${k.id}: 색`); });
  if (CORE.W !== 1080 || CORE.H !== 1350) bad(`그림 크기 ${CORE.W}×${CORE.H} (1080×1350)`);
  const dd = CORE.defaults();
  if (!CORE.normalize(dd) || dd.p.length || dd.t !== 1 || dd.f !== CORE.ALL_FLAGS) bad('defaults() 이상');
  if (!CORE.hasFlag({ f: 1 }, 'snow') || CORE.hasFlag({ f: 1 }, 'lights') || !CORE.hasFlag({ f: 2 }, 'lights')) bad('hasFlag');
  // 자동 꾸미기
  for (let s = 0; s < CORE.STYLES.length; s++) {
    for (let seed = 1; seed < 30; seed++) {
      const list = CORE.autoDecorate(s, seed, []);
      if (list.length < 12 || list.length > CORE.LIMITS.orn) bad(`autoDecorate(${s},${seed}) ${list.length}개`);
      list.forEach((o) => { if (o.k !== 8 && !CORE.inTree(s, o.x, o.y)) bad(`autoDecorate 트리 밖 장식 ${JSON.stringify(o)}`); });
      for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) { if (Math.hypot(list[i].x - list[j].x, list[i].y - list[j].y) < 70) { bad(`autoDecorate 겹침 s${s} seed${seed}`); i = j = 1e9; } }
      if (!CORE.normalize({ ...dd, p: list })) bad('autoDecorate 결과가 유효하지 않음');
    }
    let grow = [];
    for (let i = 0; i < 6; i++) grow = CORE.autoDecorate(s, 100 + i, grow);
    if (grow.length > CORE.LIMITS.orn) bad(`autoDecorate 반복 ${grow.length}개 > ${CORE.LIMITS.orn}`);
  }
  if (JSON.stringify(CORE.autoDecorate(0, 5, [])) !== JSON.stringify(CORE.autoDecorate(0, 5, []))) bad('autoDecorate 는 같은 seed = 같은 결과');
  // hit: 맨 위(마지막) 장식
  const pl = [{ k: 0, x: 500, y: 500 }, { k: 1, x: 520, y: 500 }];
  if (CORE.hit(pl, 510, 500) !== 1 || CORE.hit(pl, 900, 900) !== -1 || CORE.hit(pl, 460, 500) !== 0) bad('hit');
  // 글 정리
  const ct = CORE.cleanText;
  if (ct('<b>Hi</b>', 30) !== 'Hi' || ct('a<b', 30) !== 'ab') bad('cleanText 태그·꺾쇠 제거');
  if (ct('  a\u0000​ b\n c  ', 30) !== 'a b c') bad(`cleanText 제어 문자·공백: "${ct('  a\u0000​ b\n c  ', 30)}"`);
  if (Array.from(ct('🎄'.repeat(200), CORE.LIMITS.m)).length !== CORE.LIMITS.m) bad('cleanText 는 코드 포인트로 자른다');
  if (ct(null, 5) !== '' || ct(42, 5) !== '42') bad('cleanText(null/숫자)');
  // 장식 압축
  const pk = [{ k: 0, x: 0, y: 0 }, { k: 12, x: 1080, y: 1350 }, { k: 5, x: 538, y: 702 }];
  const pkn = CORE.normalize({ ...dd, p: pk }).p;
  if (JSON.stringify(CORE.unpackOrn(CORE.packOrn(pkn))) !== JSON.stringify(pkn)) bad('packOrn ↔ unpackOrn 왕복');
  if (CORE.clampPos(-50, 9999).x !== 24 || CORE.clampPos(-50, 9999).y !== 1326 || CORE.clampPos(101, 101).x % 2) bad('clampPos');
  ['a', 'n0000', 'a00', 'aZZ00', 'a0000b', 'azz00', 'a00zz'].forEach((s) => { if (CORE.unpackOrn(s) !== null) bad(`unpackOrn("${s}") 는 null`); });
  // 무작위 트리 왕복
  let rt = 0;
  let maxLen = 0;
  for (let i = 0; i < 2000; i++) {
    const p = [];
    for (let j = 0; j < (i * 7) % (CORE.LIMITS.orn + 1); j++) p.push({ k: (i + j) % CORE.KINDS.length, x: (i * 37 + j * 91) % 1081, y: (i * 53 + j * 71) % 1351 });
    const d = { s: i % 4, b: (i >> 2) % 4, t: (i >> 4) % 4, f: i % 4, p, n: NAMES[i % NAMES.length], m: MSGS[i % MSGS.length] };
    const enc = CORE.encode(d);
    if (!enc || !/^[A-Za-z0-9_-]+$/.test(enc)) { bad(`encode 실패/형식 이상: ${JSON.stringify(d).slice(0, 80)}`); continue; }
    maxLen = Math.max(maxLen, enc.length);
    if (!CORE.same(CORE.decode(enc), CORE.normalize(d))) { bad(`왕복 불일치: ${JSON.stringify(d).slice(0, 120)}`); continue; }
    rt++;
  }
  const worst = { s: 3, b: 3, t: 3, f: 3, p: Array.from({ length: CORE.LIMITS.orn }, (_, i) => ({ k: i % 13, x: 1080, y: 1350 })), n: '🎄'.repeat(CORE.LIMITS.n), m: '🎄'.repeat(CORE.LIMITS.m) };
  const wEnc = CORE.encode(worst);
  if (!wEnc || wEnc.length > CORE.MAX_HASH) bad(`최대 길이 링크 ${wEnc && wEnc.length}자 > ${CORE.MAX_HASH}`);
  else if (!CORE.same(CORE.decode(wEnc), worst)) bad('최대 길이 링크 왕복 불일치');
  if (CORE.encode({ ...worst, p: worst.p.concat([{ k: 0, x: 1, y: 1 }]) }) !== null) bad('장식 61개는 encode 거부');
  // 잘못된 링크
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const ok = { v: 1, s: 0, b: 0, t: 0, f: 0 };
  const badInputs = {
    empty: '', garbage: '!!!', spaces: 'ab cd', longStr: 'A'.repeat(CORE.MAX_HASH + 5), notJson: b64('hello'), wrongV: b64({ ...ok, v: 2 }), noV: b64({ s: 0, b: 0, t: 0, f: 0 }),
    styleRange: b64({ ...ok, s: 4 }), styleNeg: b64({ ...ok, s: -1 }), styleFrac: b64({ ...ok, s: 0.5 }), styleStr: b64({ ...ok, s: '0' }), noStyle: b64({ v: 1, b: 0, t: 0, f: 0 }),
    bgRange: b64({ ...ok, b: 4 }), topRange: b64({ ...ok, t: 9 }), flagRange: b64({ ...ok, f: 4 }), noFlag: b64({ v: 1, s: 0, b: 0, t: 0 }),
    ornNum: b64({ ...ok, p: 5 }), ornArr: b64({ ...ok, p: [1] }), ornBadKind: b64({ ...ok, p: 'z0000' }), ornShort: b64({ ...ok, p: 'a000' }), ornRange: b64({ ...ok, p: 'a0000azz00' }),
    ornTooMany: b64({ ...ok, p: 'a0a0a'.repeat(61) }), nameObj: b64({ ...ok, n: { x: 1 } }), msgNum: b64({ ...ok, m: 5 }),
    badUtf8: Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''), arr: b64([1, 2, 3]), nul: b64('null'),
  };
  Object.entries(badInputs).forEach(([k, v]) => { if (CORE.decode(v) !== null) bad(`decode(${k}) 는 null 이어야 함`); });
  if (CORE.decode(null) !== null || CORE.decode(42) !== null) bad('decode(비문자열) 은 null');
  const withText = CORE.decode(b64({ ...ok, n: '<script>x</script>' + 'z'.repeat(60), m: '<b>' + 'm'.repeat(500) }));
  if (!withText || /[<>]/.test(withText.n + withText.m) || Array.from(withText.n).length > CORE.LIMITS.n || Array.from(withText.m).length > CORE.LIMITS.m) bad('decode 가 글을 정리·자르지 않음');
  // 줄바꿈
  const meas = (s) => Array.from(s).length * 10;
  let wraps = 0;
  [['hello big world of snow and twinkling lights', 'en'], ['메리 크리스마스 따뜻한 연말 보내세요', 'ko'], ['メリークリスマス！よいお年を', 'ja'], ['С Новым годом! 🎄', 'ru'], ['a'.repeat(50), 'en'], ['', 'en']].forEach(([txt, lang]) => [60, 120, 250].forEach((w) => {
    const lines = CORE.wrap(meas, txt, w, lang);
    lines.forEach((ln) => { if (!ln || ln !== ln.trim()) bad(`wrap 빈/공백 줄: "${ln}"`); if (meas(ln) > w && CORE.graphemes(ln).length > 1) bad(`wrap 폭 초과 "${ln}"`); });
    if (lines.join('').replace(/\s/g, '') !== txt.replace(/\s/g, '')) bad(`wrap 글자 손실: "${txt}"`);
    wraps++;
  }));
  console.log(`\n=== 로직: 트리 ${CORE.STYLES.length} · 배경 ${CORE.BGS.length} · 꼭대기 ${CORE.TOPPERS.length} · 장식 ${CORE.KINDS.length}종 · 자동 꾸미기 ${CORE.STYLES.length * 29}회 · #d= 왕복 ${rt.toLocaleString()}개 (최대 ${maxLen}자, 최악 ${wEnc && wEnc.length}자) · 잘못된 링크 ${Object.keys(badInputs).length}종 거부 · wrap ${wraps}건 ===`);
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
  { key: 'result.save', get: (T) => T.result.save, px: 296 - 24 - 28, size: 16 * 1.08, hard: true, what: '이미지 저장 버튼 한 줄' },
  { key: 'result.edit', get: (T) => T.result.edit, px: 296 - 24 - 28, size: 16 * 1.08, hard: true, what: '계속 꾸미기 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.retryFriend', get: (T) => T.result.retryFriend, px: 328 - 24, size: 16 * 1.08, hard: true, what: '나도 꾸미기 버튼 한 줄' },
  { key: 'editor.title', get: (T) => T.editor.title, px: 328, size: 22 * 1.08, hard: false, what: '꾸미기 제목 한 줄' },
  { key: 'editor.undo', get: (T) => '↶ ' + T.editor.undo, px: (328 - 16) / 3 - 16, size: 13 * 1.08, hard: false, what: '되돌리기 버튼(넘치면 두 줄)' },
  { key: 'editor.clear', get: (T) => '🗑 ' + T.editor.clear, px: ((328 - 16) / 3 - 16) * 2, size: 13 * 1.08, hard: true, what: '모두 지우기 버튼 두 줄 안' },
  { key: 'editor.auto', get: (T) => '✨ ' + T.editor.auto, px: ((328 - 16) / 3 - 16) * 2, size: 13 * 1.08, hard: true, what: '자동 꾸미기 버튼 두 줄 안' },
  { key: 'flags', get: (T) => T.editor.snow + T.editor.lights + '❄💡', px: 328 - 2 * 24 - 8 - 8, size: 13.5 * 1.08, hard: false, what: '눈·전구 버튼 한 줄' },
  { key: 'message+ideas', get: (T) => T.editor.fields.message.label + 'MM' + T.editor.ideas, px: 328 - 28, size: 15 * 1.08, hard: true, what: '메시지 라벨 + 문구 추천 버튼 한 줄' },
  { key: 'paletteLabel+count', get: (T) => T.editor.paletteLabel + ' ' + T.editor.count.replace('{n}', '60').replace('{max}', '60'), px: 328 - 4, size: 14 * 1.08, hard: false, what: '장식 라벨 + 개수 한 줄' },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_DISPLAY = ['Nunito', 'Rubik', 'Comfortaa', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha', 'Pacifico'];
const VIET_DISPLAY = ['Nunito', 'Baloo 2', 'Be Vietnam Pro', 'Plus Jakarta Sans', 'Comfortaa', 'Pangolin', 'Unbounded', 'Montserrat Alternates', 'Pacifico'];
// 인사말 글꼴(script): 라틴 확장·키릴·베트남어를 다 지원하는 Pacifico, 한중일·태국어는 그 문자를 가진 글꼴
const SCRIPT_OK = { ko: ['Gaegu', 'Jua'], ja: ['Yusei Magic', 'Mochiy Pop One'], zh: ['ZCOOL KuaiLe'], th: ['Mali'] };
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
      if (missing.length && !missing.every((k) => /^\.editor\.presets\[\d+\]$/.test(k))) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}`);
      if (extra.length && !extra.every((k) => /^\.editor\.presets\[\d+\]$/.test(k))) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}`);
      const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
      const en = Object.fromEntries(flat(L10N.en));
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.') || k === 'result.fileName' || k === 'editor.counter') return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = [];
    (function walk(o, p) { Object.entries(o).forEach(([k, v]) => { if (v && typeof v === 'object') walk(v, `${p}${k}.`); else if (typeof v === 'string' && !v.trim() && !/^fonts\.sans$/.test(`${p}${k}`)) empties.push(`${p}${k}`); }); })(T, '');
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    // 이름 목록
    [['styles', CORE.STYLES], ['bgs', CORE.BGS], ['toppers', CORE.TOPPERS]].forEach(([key, list]) => {
      list.forEach((x) => { if (!T.editor[key][x.id]) bad(`${tag} editor.${key}.${x.id} 없음`); });
      Object.keys(T.editor[key]).forEach((id) => { if (!list.some((x) => x.id === id)) bad(`${tag} 모르는 editor.${key}.${id}`); });
      Object.entries(T.editor[key]).forEach(([id, v]) => { if (emWidth(v) * 13.5 * 1.08 + 24 > 160) warn(`${tag} ${key}.${id} "${v}" 가 김`); });
    });
    CORE.KINDS.forEach((k) => { if (!T.editor.kinds[k.id]) bad(`${tag} editor.kinds.${k.id} 없음`); });
    if (!T.editor.kinds.erase) bad(`${tag} editor.kinds.erase 없음`);
    if (new Set(Object.values(T.editor.kinds)).size !== CORE.KINDS.length + 1) bad(`${tag} 장식 이름이 서로 겹침`);
    // 자리표시자
    [['card.by', T.card.by], ['result.eyebrowFriend', T.result.eyebrowFriend], ['result.shareText', T.result.shareText]].forEach(([k, v]) => { if ((v.match(/\{name\}/g) || []).length !== 1) bad(`${tag} ${k} 에 {name} 이 하나 있어야 함`); });
    [['result.eyebrowFriendNoName', T.result.eyebrowFriendNoName], ['result.shareTextNoName', T.result.shareTextNoName]].forEach(([k, v]) => { if (/\{name\}/.test(v)) bad(`${tag} ${k} 에 {name} 이 있으면 안 됨`); });
    if (!T.result.imageAlt.includes('{n}')) bad(`${tag} result.imageAlt 에 {n} 없음`);
    [['editor.counter', T.editor.counter], ['editor.count', T.editor.count]].forEach(([k, v]) => { if (!v.includes('{n}') || !v.includes('{max}')) bad(`${tag} ${k} 에 {n}/{max} 없음`); });
    if (/\{/.test(T.editor.full)) bad(`${tag} editor.full 에 자리표시자 금지`);
    if (!/^[a-z0-9-]+$/i.test(T.result.fileName)) bad(`${tag} result.fileName "${T.result.fileName}" (영문·숫자·- 만)`);
    ['name', 'message'].forEach((k) => { if (!T.editor.fields[k].placeholder || !T.editor.fields[k].label) bad(`${tag} editor.fields.${k} 라벨/예시 없음`); });
    // 메시지 예시
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
    // 글꼴 (xmascard 와 같은 조합)
    const F = T.fonts || {};
    if (!F.css || !F.display || !F.script || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display / script 이상`);
    const first = String(F.display || '').split(',')[0].replace(/['"]/g, '').trim();
    const script = String(F.script || '').split(',')[0].replace(/['"]/g, '').trim();
    if (lang === 'ru' && (!CYRILLIC_DISPLAY.includes(first) || !CYRILLIC_DISPLAY.includes(script))) bad(`${tag} 글꼴 "${first}"/"${script}" 키릴 문자 지원 확인`);
    if (lang === 'vi' && (!VIET_DISPLAY.includes(first) || !VIET_DISPLAY.includes(script))) bad(`${tag} 글꼴 "${first}"/"${script}" 베트남어 성조 지원 확인`);
    if (SCRIPT_OK[lang] ? !SCRIPT_OK[lang].includes(script) : script !== 'Pacifico') bad(`${tag} 메시지 글꼴 ${script} 가 이 언어 글자를 지원하는지 확인 필요`);
    [first, script].forEach((fam) => { if (F.css && !F.css.includes('family=' + fam.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${fam} 가 없음`); });
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) warn(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 그대로 담지 않음`);
    // 제목·설명 길이
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
  if (!/<link rel="canonical" href="https:\/\/xmastree\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/xmastree\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
    if (!start || !edit || !end) { bad(`${tag} 시작/꾸미기/끝 화면 중 없는 것이 있음`); return; }
    if (!/<section id="screen-edit"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 꾸미기·끝 화면은 처음에 hidden`);
    if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
    if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
    if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
    if (/data-mg-end|mg-faq|more-test|xt-kind|xt-chip|<input|<canvas|<details|<textarea/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력 칸/도구/트리 그림`);
    if (!/<h1 class="xt-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
    if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
    const startText = start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (T.faq.some((q) => startText.includes(G.esc(q.q)))) bad(`${tag} 시작 화면에 FAQ 문구`);
    if ((edit.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 꾸미기 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(mg-ad-start 제외)는 꾸미기 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
    if (edit.indexOf('class="mg-ad"') < edit.indexOf('id="done-btn"')) bad(`${tag} 꾸미기 광고는 완성 버튼 아래`);
    if ((edit.match(/class="xt-kind[ "]/g) || []).length !== CORE.KINDS.length + 1) bad(`${tag} 장식 버튼 ${CORE.KINDS.length}개 + 지우개가 아님`);
    if ((edit.match(/class="xt-kind is-on"/g) || []).length !== 1) bad(`${tag} 처음 고른 장식은 1개`);
    [['xt-style', CORE.STYLES], ['xt-bg', CORE.BGS], ['xt-topper', CORE.TOPPERS]].forEach(([cls, list]) => { if ((edit.match(new RegExp(`class="xt-chip ${cls}[ "]`, 'g')) || []).length !== list.length) bad(`${tag} ${cls} 버튼 ${list.length}개가 아님`); });
    if ((edit.match(/class="xt-flag[ "]/g) || []).length !== 2) bad(`${tag} 눈·전구 버튼 2개가 아님`);
    ['tree-canvas', 'palette', 'orn-count', 'undo-btn', 'clear-btn', 'auto-btn', 'styles', 'bgs', 'toppers', 'flags', 'f-name', 'f-msg', 'msg-count', 'idea-btn', 'done-btn'].forEach((id) => { if (!edit.includes(`id="${id}"`)) bad(`${tag} 꾸미기 화면에 #${id} 없음`); });
    [['f-name', CORE.LIMITS.n], ['f-msg', CORE.LIMITS.m]].forEach(([id, n]) => { if (!new RegExp(`id="${id}"[^>]*maxlength="${n * 3}"`).test(edit)) bad(`${tag} #${id} maxlength ${n * 3}`); });
    if (!new RegExp(`id="tree-canvas"[^>]*width="${CORE.W}" height="${CORE.H}"`).test(edit)) bad(`${tag} 트리 canvas ${CORE.W}×${CORE.H}`);
    const cardAt = end.indexOf('class="xt-card"');
    const endAt = end.indexOf('<div data-mg-end="xmastree"></div>');
    if (!(cardAt > 0 && endAt > cardAt)) bad(`${tag} 끝 화면: 결과 트리 → data-mg-end="xmastree" 순서가 아님`);
    if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
    if (/mg-share|mg-faq|class="mg-ad/.test(end)) bad(`${tag} 끝 화면에 앱이 직접 만든 공유/FAQ/광고`);
    ['save-btn', 'edit-btn', 'end-canvas', 'end-title'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
    if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    if (!(html.indexOf('xmastree-core.js') > 0 && html.indexOf('xmastree-core.js') < html.indexOf('xmastree.js"'))) bad(`${tag} xmastree-core.js 가 xmastree.js 보다 먼저여야 함`);
    const pf = G.fileOf(lang, 'privacy.html');
    commonHtml(`[${lang}] ${pf}`, read(pf), lang);
    pages++;
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://xmastree.example.com/</loc>') || !sm.includes('<loc>https://xmastree.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  // 움직임: 시작 화면 이모지는 CSS, 전구·눈은 JS — 둘 다 prefers-reduced-motion 이면 멈춤
  const css = read('style.css');
  if (!/@keyframes xt-bob/.test(css) || !/prefers-reduced-motion: reduce\)[\s\S]*\.xt-hero span[^}]*animation: none/.test(css)) bad('style.css: xt-bob 애니메이션 / prefers-reduced-motion 멈춤 규칙 없음');
  if (!/touch-action: none/.test(css)) bad('style.css: 트리 canvas 에 touch-action: none 없음 (끌기)');
  const js = read('xmastree.js');
  if (!/REDUCED\.matches/.test(js) || !/prefers-reduced-motion/.test(js)) bad('xmastree.js: 전구·눈 움직임이 prefers-reduced-motion 을 보지 않음');
  if (!/track\('start'\)/.test(js) || !/track\('done'\)/.test(js)) bad("xmastree.js: track('start') / track('done') 없음");
  ['xmastree.js', 'xmastree-core.js'].forEach((f) => { if (/supabase\.co|sb_publishable|service_role/i.test(read(f))) bad(`${f} 에 Supabase 값`); });
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
console.log('\n결과: 통과 — 트리·장식·자동 꾸미기·정리·#d= 왕복·wrap, 언어 파일 12개(키·번역·FAQ·글꼴·제목 길이·폭 예산), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치·끝 화면), 움직임 줄이기, OG 이미지 모두 OK');
