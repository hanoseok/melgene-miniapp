#!/usr/bin/env node
/**
 * 눈사람 만들기 검사.
 *   1) 로직(snowman-core.js): 선택지 개수(몸 4·눈 4·입 4·코 4·모자 6·목도리 6·무늬 3·팔 4·꾸미기 4·배경 3)·단계 9개, 눈덩이 배치(그림 안·위로 쌓임),
 *      무작위(유효·seed 같으면 같음·이름 유지), 글 정리, #d= 인코딩 ↔ 디코딩 왕복(모든 조합·여러 문자·이모지), 잘못된 링크는 null, 최대 길이 링크, fit.
 *   2) 언어 파일 12개: en.js 와 키 구조, // TODO-TRANSLATE 없음, 영어 그대로 없음, 자리표시자, 이름 예시 5개(20자 이하), FAQ 3~5개
 *      (일반 텍스트, "무료인가요?" 류 금지), 한글은 ko 만, 글꼴(ru 키릴·vi 베트남어), 제목·설명 길이·현지 검색어, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML: title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·도구·FAQ·끝 화면 없음 / 만들기 화면 mg-ad 1개(그 밖 0개) / 단계 9개·선택지 버튼 수 /
 *      끝 화면: 결과 → data-mg-end="snowman" 순서, MG_FAQ·PAGE_I18N, 스크립트 순서. 움직임은 prefers-reduced-motion 에서 멈춤.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG.
 *
 * 실행: node tools/check-snowman.js   (실제 흐름은 tools/flow-test.js — check-all 에는 안 들어감)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'snowman-core.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NAMES = ['', 'Snowball', '눈동이', 'ゆきまる', 'น้องหิมะ', 'Снежок', 'Léa « Lou »', '⛄❄️ Ho', 'Günter ß', 'Minh Anh', '小雪', 'a'.repeat(60), '  spaced   out  '];
const COUNTS = { b: 4, e: 4, m: 4, n: 4, h: 6, s: 6, p: 3, a: 4, g: 3 };
function checkCore() {
  Object.entries(COUNTS).forEach(([k, n]) => { if (CORE.FIELDS[k].length !== n) bad(`선택지 ${k} ${CORE.FIELDS[k].length}개 (${n}개)`); });
  if (CORE.EXTRAS.length !== 4 || CORE.ALL_X !== 15) bad('꾸미기 4개(비트 1·2·4·8)');
  if (CORE.STEPS.length !== 9) bad('단계 9개');
  const grouped = CORE.STEPS.flatMap((s) => s.groups).sort().join('');
  if (grouped !== [...CORE.KEYS, 't'].sort().join('')) bad(`단계가 모든 필드를 한 번씩 다루지 않음: ${grouped}`);
  Object.values(CORE.FIELDS).concat([CORE.EXTRAS]).forEach((list) => { if (new Set(list.map((x) => x.id)).size !== list.length) bad('id 중복'); });
  if (CORE.HATS[CORE.HATS.length - 1].id !== 'none' || CORE.SCARVES[CORE.SCARVES.length - 1].id !== 'none' || CORE.ARMS[CORE.ARMS.length - 1].id !== 'none') bad('"없음" 선택지는 맨 뒤');
  CORE.SCARVES.forEach((s) => { if (s.id !== 'none' && !/^#[0-9a-f]{6}$/i.test(s.c)) bad(`목도리 ${s.id} 색`); });
  if (CORE.W !== 1080 || CORE.H !== 1350) bad(`그림 크기 ${CORE.W}×${CORE.H} (1080×1350)`);
  // 눈덩이 배치
  CORE.BODIES.forEach((b, i) => {
    const L = CORE.layout(i);
    if (L.balls.length !== b.r.length || ![2, 3].includes(L.balls.length)) bad(`몸 ${b.id}: 눈덩이 ${L.balls.length}개`);
    L.balls.forEach((x, j) => { if (j && !(x.y < L.balls[j - 1].y && x.r < L.balls[j - 1].r)) bad(`몸 ${b.id}: 위 공이 더 위·더 작아야 함`); });
    if (L.balls[0].y + L.balls[0].r > CORE.GROUND + 30) bad(`몸 ${b.id}: 땅 아래로 내려감`);
    if (L.top - L.head.r * 1.2 < 40) bad(`몸 ${b.id}: 머리 위 모자 자리 부족 (top ${Math.round(L.top)})`);
  });
  const dd = CORE.defaults();
  if (!CORE.normalize(dd) || dd.t !== '') bad('defaults() 이상');
  if (!CORE.hasExtra({ x: 2 }, 'buttons') || CORE.hasExtra({ x: 2 }, 'bird') || !CORE.hasExtra({ x: 12 }, 'flakes')) bad('hasExtra');
  // 무작위
  const seen = new Set();
  for (let seed = 1; seed < 400; seed++) {
    const r = CORE.randomize(seed, { t: 'Bob' });
    if (!CORE.normalize(r) || r.t !== 'Bob') { bad(`randomize(${seed}) 결과가 유효하지 않거나 이름이 바뀜`); break; }
    seen.add(CORE.encode(r));
  }
  if (seen.size < 300) bad(`randomize 다양성 ${seen.size}/399`);
  if (CORE.encode(CORE.randomize(5)) !== CORE.encode(CORE.randomize(5))) bad('randomize 는 같은 seed = 같은 결과');
  // 글 정리
  const ct = CORE.cleanText;
  if (ct('<b>Hi</b>', 30) !== 'Hi' || ct('a<b', 30) !== 'ab') bad('cleanText 태그·꺾쇠 제거');
  if (ct('  a\u0000​ b\n c  ', 30) !== 'a b c') bad('cleanText 제어 문자·공백');
  if (Array.from(ct('⛄'.repeat(200), CORE.LIMITS.t)).length !== CORE.LIMITS.t) bad('cleanText 는 코드 포인트로 자른다');
  if (ct(null, 5) !== '' || ct(42, 5) !== '42') bad('cleanText(null/숫자)');
  // 모든 조합 왕복 (이름 섞어서)
  let rt = 0;
  let maxLen = 0;
  const F = CORE.FIELDS;
  for (let b = 0; b < F.b.length; b++) for (let e = 0; e < F.e.length; e++) for (let h = 0; h < F.h.length; h++) for (let s = 0; s < F.s.length; s++) for (let g = 0; g < F.g.length; g++) {
    const i = rt;
    const d = { b, e, m: i % F.m.length, n: (i >> 1) % F.n.length, h, s, p: i % F.p.length, a: (i >> 2) % F.a.length, x: i % 16, g, t: NAMES[i % NAMES.length] };
    const enc = CORE.encode(d);
    if (!enc || !/^[A-Za-z0-9_-]+$/.test(enc)) { bad(`encode 실패: ${JSON.stringify(d)}`); continue; }
    maxLen = Math.max(maxLen, enc.length);
    if (!CORE.same(CORE.decode(enc), CORE.normalize(d))) { bad(`왕복 불일치: ${JSON.stringify(d)}`); continue; }
    rt++;
  }
  const worst = { b: 3, e: 3, m: 3, n: 3, h: 5, s: 5, p: 2, a: 3, x: 15, g: 2, t: '⛄'.repeat(CORE.LIMITS.t) };
  const wEnc = CORE.encode(worst);
  if (!wEnc || wEnc.length > CORE.MAX_HASH) bad(`최대 길이 링크 ${wEnc && wEnc.length}자 > ${CORE.MAX_HASH}`);
  else if (!CORE.same(CORE.decode(wEnc), worst)) bad('최대 길이 링크 왕복 불일치');
  // 잘못된 링크
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const ok = { v: 1, b: 0, e: 0, m: 0, n: 0, h: 0, s: 0, p: 0, a: 0, x: 0, g: 0 };
  if (!CORE.decode(b64(ok))) bad('정상 링크를 거부함');
  const badInputs = {
    empty: '', garbage: '!!!', spaces: 'ab cd', longStr: 'A'.repeat(CORE.MAX_HASH + 5), notJson: b64('hello'), wrongV: b64({ ...ok, v: 2 }), noV: b64({ ...ok, v: undefined }),
    bodyRange: b64({ ...ok, b: 4 }), bodyNeg: b64({ ...ok, b: -1 }), bodyFrac: b64({ ...ok, b: 0.5 }), bodyStr: b64({ ...ok, b: '0' }), noBody: b64({ ...ok, b: undefined }),
    hatRange: b64({ ...ok, h: 6 }), scarfRange: b64({ ...ok, s: 6 }), patRange: b64({ ...ok, p: 3 }), armRange: b64({ ...ok, a: 4 }), sceneRange: b64({ ...ok, g: 3 }),
    extraRange: b64({ ...ok, x: 16 }), noExtra: b64({ ...ok, x: undefined }), nameObj: b64({ ...ok, t: { x: 1 } }), nameNum: b64({ ...ok, t: 5 }),
    badUtf8: Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''), arr: b64([1, 2, 3]), nul: b64('null'),
  };
  Object.entries(badInputs).forEach(([k, v]) => { if (CORE.decode(v) !== null) bad(`decode(${k}) 는 null 이어야 함`); });
  if (CORE.decode(null) !== null || CORE.decode(42) !== null) bad('decode(비문자열) 은 null');
  const withText = CORE.decode(b64({ ...ok, t: '<script>x</script>' + 'z'.repeat(60) }));
  if (!withText || /[<>]/.test(withText.t) || Array.from(withText.t).length > CORE.LIMITS.t) bad('decode 가 이름을 정리·자르지 않음');
  // fit
  const meas = (s) => Array.from(s).length * 10;
  if (CORE.fit(meas, 'hello', 100) !== 'hello' || CORE.fit(meas, 'a'.repeat(30), 100) !== 'a'.repeat(9) + '…') bad('fit');
  console.log(`\n=== 로직: 선택지 ${Object.values(COUNTS).join('·')} · 꾸미기 4 · 단계 ${CORE.STEPS.length} · 무작위 399회(서로 다른 ${seen.size}) · #d= 왕복 ${rt.toLocaleString()}개 (최대 ${maxLen}자, 최악 ${wEnc && wEnc.length}자) · 잘못된 링크 ${Object.keys(badInputs).length}종 거부 ===`);
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
  { key: 'result.save', get: (T) => '📥 ' + T.result.save, px: 296 - 24, size: 16 * 1.08, hard: true, what: '이미지 저장 버튼 한 줄' },
  { key: 'result.edit', get: (T) => '✏️ ' + T.result.edit, px: 296 - 24, size: 16 * 1.08, hard: true, what: '계속 만들기 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.retryFriend', get: (T) => T.result.retryFriend, px: 328 - 24, size: 16 * 1.08, hard: true, what: '나도 만들기 버튼 한 줄' },
  { key: 'result.reveal', get: (T) => T.result.reveal, px: 288 - 36, size: 16 * 1.08, hard: true, what: '눈 털기 버튼 한 줄' },
  { key: 'editor.title', get: (T) => T.editor.title, px: 328, size: 22 * 1.08, hard: false, what: '만들기 제목 한 줄' },
  { key: 'editor.back', get: (T) => T.editor.back, px: (328 - 16) / 3.3 - 14, size: 13 * 1.08, hard: false, what: '이전 버튼 한 줄' },
  { key: 'editor.next', get: (T) => T.editor.next, px: (328 - 16) / 3.3 - 14, size: 13 * 1.08, hard: false, what: '다음 버튼 한 줄' },
  { key: 'editor.random', get: (T) => '🎲 ' + T.editor.random, px: ((328 - 16) / 3.3 * 1.3 - 14) * 2, size: 13 * 1.08, hard: true, what: '무작위 버튼 두 줄 안' },
  { key: 'name+ideas', get: (T) => T.editor.labels.name + 'MM' + T.editor.ideas, px: 328 - 20, size: 15 * 1.08, hard: false, what: '이름 라벨 + 추천 버튼 한 줄' },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_DISPLAY = ['Nunito', 'Rubik', 'Comfortaa', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha', 'Pacifico'];
const VIET_DISPLAY = ['Nunito', 'Baloo 2', 'Be Vietnam Pro', 'Plus Jakarta Sans', 'Comfortaa', 'Pangolin', 'Unbounded', 'Montserrat Alternates', 'Pacifico'];
// 인사말 글꼴(script): 라틴 확장·키릴·베트남어를 다 지원하는 Pacifico, 한중일·태국어는 그 문자를 가진 글꼴
const SCRIPT_OK = { ko: ['Gaegu', 'Jua'], ja: ['Yusei Magic', 'Mochiy Pop One'], zh: ['ZCOOL KuaiLe'], th: ['Mali'] };
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|ranking|рейтинг/i;

const SEARCH = { en: 'build a snowman online', ja: '雪だるま作り', zh: '堆雪人', ko: '눈사람 만들기', fr: 'bonhomme de neige', de: 'schneemann bauen', th: 'ปั้นตุ๊กตาหิมะ', vi: 'người tuyết', es: 'muñeco de nieve', it: 'pupazzo di neve', pt: 'boneco de neve', ru: 'слепить снеговика' };
const OPTION_GROUPS = { bodies: CORE.BODIES, eyes: CORE.EYES, mouths: CORE.MOUTHS, noses: CORE.NOSES, hats: CORE.HATS, scarves: CORE.SCARVES, patterns: CORE.PATTERNS, arms: CORE.ARMS, extras: CORE.EXTRAS, scenes: CORE.SCENES, steps: CORE.STEPS };
function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음`);
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}`);
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
    // 선택지 이름
    Object.entries(OPTION_GROUPS).forEach(([key, list]) => {
      const names = T.editor[key] || {};
      list.forEach((x) => { if (!names[x.id]) bad(`${tag} editor.${key}.${x.id} 없음`); });
      Object.keys(names).forEach((id) => { if (!list.some((x) => x.id === id)) bad(`${tag} 모르는 editor.${key}.${id}`); });
      if (new Set(Object.values(names)).size !== Object.keys(names).length) bad(`${tag} editor.${key} 이름이 서로 겹침`);
      if (key !== 'steps') Object.entries(names).forEach(([id, v]) => {
        // 선택지 칩: 84px 칸(360px 에서 약 72px) 안 두 줄
        if (longestWord(v) && emWidth(isWideLang(lang) ? v : longestWord(v)) * 13 * 1.08 > (isWideLang(lang) ? 86 * 2 : 86)) warn(`${tag} ${key}.${id} "${v}" 가 칩에 비해 김`);
      });
    });
    ['body', 'eyes', 'mouth', 'nose', 'hat', 'scarf', 'pattern', 'arms', 'extras', 'scene', 'name'].forEach((k) => { if (!T.editor.labels[k]) bad(`${tag} editor.labels.${k} 없음`); });
    // 자리표시자
    [['card.named', T.card.named], ['result.eyebrowFriend', T.result.eyebrowFriend], ['result.shareText', T.result.shareText]].forEach(([k, v]) => { if ((v.match(/\{name\}/g) || []).length !== 1) bad(`${tag} ${k} 에 {name} 이 하나 있어야 함`); });
    [['result.eyebrowFriendNoName', T.result.eyebrowFriendNoName], ['result.shareTextNoName', T.result.shareTextNoName], ['result.imageAlt', T.result.imageAlt]].forEach(([k, v]) => { if (/\{/.test(v)) bad(`${tag} ${k} 에 자리표시자 금지`); });
    [['editor.counter', T.editor.counter], ['editor.stepOf', T.editor.stepOf]].forEach(([k, v]) => { if (!v.includes('{n}') || !v.includes('{max}')) bad(`${tag} ${k} 에 {n}/{max} 없음`); });
    if (lang === 'ko' && /을\(를\)|이\(가\)|은\(는\)/.test(src)) bad(`${tag} 조사 "을(를)" 같은 표기 금지 — 이름 뒤 조사가 필요 없게 문장을 바꾼다`);
    if (!/^[a-z0-9-]+$/i.test(T.result.fileName)) bad(`${tag} result.fileName "${T.result.fileName}" (영문·숫자·- 만)`);
    // 이름 예시
    const P = T.editor.namePresets;
    if (!Array.isArray(P) || P.length !== 5) bad(`${tag} editor.namePresets 는 5개`);
    else {
      P.forEach((m, i) => {
        if (CORE.cleanText(m, 999) !== m) bad(`${tag} namePresets[${i}] 앞뒤 공백·꺾쇠`);
        if (Array.from(m).length > CORE.LIMITS.t) bad(`${tag} namePresets[${i}] ${Array.from(m).length}자 > ${CORE.LIMITS.t}`);
        if (/olaf|frosty|올라프|オラフ|雪宝|Олаф/i.test(m)) bad(`${tag} namePresets[${i}] 저작권 캐릭터 이름 금지`);
      });
      if (new Set(P).size !== P.length) bad(`${tag} namePresets 중복`);
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
    if (SCRIPT_OK[lang] ? !SCRIPT_OK[lang].includes(script) : script !== 'Pacifico') bad(`${tag} 이름 글꼴 ${script} 가 이 언어 글자를 지원하는지 확인 필요`);
    [first, script].forEach((fam) => { if (F.css && !F.css.includes('family=' + fam.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${fam} 가 없음`); });
    // h1 · 검색어
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    const term = SEARCH[lang];
    [['meta.title', T.meta.title], ['start.h1Kicker', T.start.h1Kicker], ['og.defaultKicker', T.og.defaultKicker]].forEach(([k, v]) => { if (!v.toLowerCase().includes(term)) bad(`${tag} ${k} "${v}" 에 현지 검색어 "${term}" 없음`); });
    // 제목·설명 길이
    const full = `${T.meta.title} | ${G.brandOf(lang)}`;
    const wide = isWideLang(lang) && lang !== 'ko';
    const tl = visLen(T.meta.title);
    if (wide ? tl > 32 : tl > 52) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 32' : '라틴·키릴·한글 52'}자 이하, "${full}")`);
    if (tl < 3) bad(`${tag} meta.title 이 너무 짧음`);
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
  if (!/<link rel="canonical" href="https:\/\/snowman\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/snowman\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
    if (!/"@type":"WebApplication"/.test(html)) bad(`${tag} appLd(WebApplication) 없음`);
    const start = section(html, 'screen-start');
    const edit = section(html, 'screen-edit');
    const end = section(html, 'screen-end');
    if (!start || !edit || !end) { bad(`${tag} 시작/만들기/끝 화면 중 없는 것이 있음`); return; }
    if (!/<section id="screen-edit"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 만들기·끝 화면은 처음에 hidden`);
    if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
    if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함`);
    if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
    if (/data-mg-end|mg-faq|more-test|sm-opt|sm-step|<input|<canvas|<details|<textarea/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력 칸/도구/그림`);
    if (!/<h1 class="sm-h1">/.test(start) || !/id="start-btn"/.test(start)) bad(`${tag} 시작 화면 h1/시작 버튼 없음`);
    const startText = start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (T.faq.some((q) => startText.includes(G.esc(q.q)))) bad(`${tag} 시작 화면에 FAQ 문구`);
    if ((edit.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 만들기 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(mg-ad-start 제외)는 만들기 화면의 1개뿐`);
    if (edit.indexOf('class="mg-ad"') < edit.indexOf('id="done-btn"')) bad(`${tag} 만들기 광고는 완성 버튼 아래`);
    if ((edit.match(/class="sm-step"/g) || []).length !== CORE.STEPS.length) bad(`${tag} 단계 버튼 ${CORE.STEPS.length}개가 아님`);
    if ((edit.match(/class="sm-panel"/g) || []).length !== CORE.STEPS.length) bad(`${tag} 단계 화면 ${CORE.STEPS.length}개가 아님`);
    if ((edit.match(/class="sm-panel"[^>]*hidden/g) || []).length !== CORE.STEPS.length - 1) bad(`${tag} 처음엔 첫 단계만 보여야 함`);
    Object.entries(CORE.FIELDS).forEach(([k, list]) => {
      const n = (edit.match(new RegExp(`data-f="${k}"`, 'g')) || []).length;
      if (n !== list.length) bad(`${tag} 선택지 ${k} 버튼 ${n}개 ≠ ${list.length}`);
      const on = (edit.match(new RegExp(`data-f="${k}" data-v="(\\d+)" aria-checked="true"`, 'g')) || []);
      if (on.length !== 1 || !on[0].includes(`data-v="${CORE.defaults()[k]}"`)) bad(`${tag} 선택지 ${k} 처음 선택이 defaults 와 다름`);
    });
    if ((edit.match(/class="sm-opt sm-extra"/g) || []).length !== CORE.EXTRAS.length) bad(`${tag} 꾸미기 버튼 ${CORE.EXTRAS.length}개가 아님`);
    ['snow-canvas', 'steps', 'step-of', 'back-btn', 'random-btn', 'next-btn', 'f-name', 'name-count', 'idea-btn', 'done-btn'].forEach((id) => { if (!edit.includes(`id="${id}"`)) bad(`${tag} 만들기 화면에 #${id} 없음`); });
    if (!new RegExp(`id="f-name"[^>]*maxlength="${CORE.LIMITS.t * 3}"`).test(edit)) bad(`${tag} #f-name maxlength ${CORE.LIMITS.t * 3}`);
    if (!new RegExp(`id="snow-canvas"[^>]*width="${CORE.W}" height="${CORE.H}"`).test(edit)) bad(`${tag} 미리보기 canvas ${CORE.W}×${CORE.H}`);
    const cardAt = end.indexOf('class="sm-card"');
    const endAt = end.indexOf('<div data-mg-end="snowman"></div>');
    if (!(cardAt > 0 && endAt > cardAt)) bad(`${tag} 끝 화면: 결과 → data-mg-end="snowman" 순서가 아님`);
    if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
    if (/mg-share|mg-faq|class="mg-ad/.test(end)) bad(`${tag} 끝 화면에 앱이 직접 만든 공유/FAQ/광고`);
    ['save-btn', 'edit-btn', 'end-canvas', 'end-title', 'reveal', 'reveal-btn'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
    if (!/<div id="reveal" class="sm-reveal" hidden>/.test(end)) bad(`${tag} 눈 털기 덮개는 처음에 hidden`);
    if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    if (!(html.indexOf('snowman-core.js') > 0 && html.indexOf('snowman-core.js') < html.indexOf('snowman.js"'))) bad(`${tag} snowman-core.js 가 snowman.js 보다 먼저여야 함`);
    const pf = G.fileOf(lang, 'privacy.html');
    commonHtml(`[${lang}] ${pf}`, read(pf), lang);
    pages++;
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://snowman.example.com/</loc>') || !sm.includes('<loc>https://snowman.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  const css = read('style.css');
  if (!/@keyframes sm-bob/.test(css) || !/prefers-reduced-motion: reduce\)[\s\S]*\.sm-hero span[^}]*animation: none/.test(css)) bad('style.css: sm-bob 애니메이션 / prefers-reduced-motion 멈춤 규칙 없음');
  const js = read('snowman.js');
  if (!/REDUCED\.matches/.test(js) || !/prefers-reduced-motion/.test(js)) bad('snowman.js: 내리는 눈이 prefers-reduced-motion 을 보지 않음');
  if (!/track\('start'\)/.test(js) || !/track\('done'\)/.test(js)) bad("snowman.js: track('start') / track('done') 없음");
  if (/\.src\s*=|new Image\(|url\(/.test(js)) bad('snowman.js: 외부 이미지 금지 (모두 코드로 그린다)');
  if (/olaf|frosty/i.test(js + read('snowman-core.js'))) bad('저작권 캐릭터 이름');
  ['snowman.js', 'snowman-core.js'].forEach((f) => { if (/supabase\.co|sb_publishable|service_role/i.test(read(f))) bad(`${f} 에 Supabase 값`); });
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
console.log('\n결과: 통과 — 선택지·눈덩이 배치·무작위·정리·#d= 왕복, 언어 파일 12개(키·번역·검색어·FAQ·글꼴·제목 길이·폭 예산), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치·단계·끝 화면), 움직임 줄이기, OG 이미지 모두 OK');
