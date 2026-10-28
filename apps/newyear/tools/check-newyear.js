/**
 * 새해 운세 테스트 검사 (tools/check-all.js 가 자동으로 돌린다, cwd = apps/newyear).
 *   1) 채점: 모든 답 조합(4^11 = 4,194,304가지)을 전부 채점해 8종이 모두 나오는지 + 각 결과가 10%~15%
 *      (전수·무작위 200,000회 모두), 같은 답 → 같은 결과(결정적), 문항 수 홀수(동점 없음 — 전수에서 축 합 0 인 조합 0건)·보기 4개·점수 ±1,
 *      문항마다 축별 점수 합 0(쏠림 없음), 세 축 부호 조합 8개 = 결과 8개, 극단 답의 결과, 게이지 0~100,
 *      색 hex, 행운의 색(hex)·달(1~12)·물건(이모지, 결과 이모지와 안 겹침), 단짝·라이벌(자기 자신 아님), poll 인코딩(연도별 id, r0, 보기 0~7), YEAR.
 *   2) 언어 파일 12개: en.js 와 키 구조가 완전히 같은지, 문항·보기 수, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?" 류 금지),
 *      한국어가 아닌 파일에 한글, 글꼴(ru 는 키릴 지원), 연도는 core 의 YEAR 그대로(손으로 쓴 다른 연도 없음),
 *      스포일러(메타·시작 화면·FAQ·기본 OG·로딩·app.config 제목/설명에 결과 이름·낱말·질문 인용 금지, 가이드 글에 결과 이름 금지),
 *      360px 폭 예산, 결과 문구에 숫자·% 없음(숫자는 연도·core 의 행운의 달 + 서버 실제 비율뿐), 재미용 안내.
 *   3) 생성된 HTML(언어 폴더 + 숨은 사본 _l/): title / h1 하나 / hreflang 13개 / canonical / 타이틀 바 / index 의 appLd /
 *      FAQPage JSON-LD 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·끝 화면 없음 / 질문 화면 mg-ad 1개 /
 *      index 에 결과 문구 없음 / 결과 페이지 = 자기 결과 + 행운의 색·달·물건(core 값) + 게이지 자리(숨김) + 네 영역 운세·작은 다짐 + 재미용 안내
 *      + 단짝·라이벌 이름(보여주기만: <a> 아님, 다른 결과 이름은 이 둘뿐) + data-mg-end + MG_FAQ, 다른 결과 페이지로 가는 href 0개.
 *      newyear.js 의 track('start')/track('done'), style.css 의 단짝·라이벌 카드가 누를 수 있어 보이지 않는지(pointer·hover 없음).
 *   4) sitemap.xml URL 수, OG 이미지(언어 × (default + 8종))가 1200×630 PNG 인지 + 전체 용량.
 *
 * 실행: node tools/check-newyear.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'newyear-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);
const TODO = G.todoLocales(SITE);

const TRIALS = 200000;
const LO = 0.10;
const HI = 0.15;
const problems = [];
const warns = [];
const bad = (m) => (G.isTodoMessage(m, TODO) ? warns : problems).push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 채점
function checkCore() {
  const ids = new Set(CORE.ORDER);
  if (ids.size !== 8) bad(`유형 수 ${ids.size} ≠ 8`);
  const HEX = /^#[0-9a-f]{6}$/i;
  const signs = new Set();
  CORE.ORDER.forEach((id) => {
    const t = CORE.TYPES[id];
    if (!t) return bad(`TYPES.${id} 없음`);
    ['main', 'deep', 'ink'].forEach((k) => { if (!HEX.test(t[k])) bad(`TYPES.${id}.${k} 색`); });
    if (!t.emoji) bad(`TYPES.${id}.emoji 없음`);
    if (!Array.isArray(t.sign) || t.sign.length !== 3 || t.sign.some((x) => x !== 1 && x !== -1)) bad(`TYPES.${id}.sign 은 ±1 세 개`);
    else signs.add(t.sign.join());
    if (!HEX.test(t.lucky)) bad(`TYPES.${id}.lucky(행운의 색) hex`);
    if (!Number.isInteger(t.month) || t.month < 1 || t.month > 12) bad(`TYPES.${id}.month(행운의 달) 은 1~12 정수`);
    if (!t.item || !/\p{Extended_Pictographic}/u.test(t.item)) bad(`TYPES.${id}.item(행운의 물건 이모지) 없음`);
    if (!ids.has(t.buddy) || !ids.has(t.rival) || t.buddy === id || t.rival === id || t.buddy === t.rival) bad(`TYPES.${id} 단짝/라이벌이 이상함 (${t.buddy}/${t.rival})`);
  });
  if (signs.size !== 8) bad(`세 축 부호 조합이 8개가 아님 (${signs.size})`);
  if (new Set(CORE.ORDER.map((id) => CORE.TYPES[id].main.toLowerCase())).size !== 8) bad('결과 대표색이 겹침');
  if (new Set(CORE.ORDER.map((id) => CORE.TYPES[id].emoji)).size !== 8) bad('결과 이모지가 겹침');
  if (new Set(CORE.ORDER.map((id) => CORE.TYPES[id].lucky.toLowerCase())).size !== 8) bad('행운의 색이 겹침');
  if (new Set(CORE.ORDER.map((id) => CORE.TYPES[id].item)).size !== 8) bad('행운의 물건 이모지가 겹침');
  CORE.ORDER.forEach((id) => { if (CORE.ORDER.some((o) => CORE.TYPES[o].emoji === CORE.TYPES[id].item)) bad(`TYPES.${id}.item 이 결과 이모지와 같음 (결과 페이지 검사가 헷갈림)`); });
  if (!Number.isInteger(CORE.YEAR) || CORE.YEAR < 2026 || CORE.YEAR > 2100) bad(`YEAR ${CORE.YEAR}`);
  if (CORE.POLL !== `newyear-${CORE.YEAR}`) bad(`POLL 은 연도별 newyear-${CORE.YEAR}`);
  const QS = CORE.QUESTIONS;
  if (QS.length < 10 || QS.length > 12) bad(`문항 수 ${QS.length} (10~12)`);
  if (QS.length % 2 !== 1) bad(`문항 수 ${QS.length} 는 홀수여야 함 (점수가 모두 ±1 이라 홀수면 축 합이 0 이 안 됨 = 동점 없음)`);
  if (CORE.MAX !== QS.length) bad('MAX ≠ 문항 수');
  QS.forEach((q, qi) => {
    if (!Array.isArray(q.w) || q.w.length !== 4) return bad(`Q${qi + 1} 보기 수 (4)`);
    q.w.forEach((w, j) => { if (!Array.isArray(w) || w.length !== 3 || w.some((x) => x !== 1 && x !== -1)) bad(`Q${qi + 1} 보기 ${j + 1} 점수 모양 [a,b,c] (±1)`); });
    if (new Set(q.w.map((w) => w.join())).size !== q.w.length) bad(`Q${qi + 1} 같은 점수의 보기가 둘 이상`);
    [0, 1, 2].forEach((k) => { const s = q.w.reduce((a, w) => a + w[k], 0); if (s !== 0) bad(`Q${qi + 1} 축 ${'ABC'[k]} 합 ${s} (보기끼리 +/− 반반이어야 함)`); });
    [[0, 1], [1, 2], [0, 2]].forEach(([x, y]) => { const s = q.w.reduce((a, w) => a + w[x] * w[y], 0); if (s !== 0) bad(`Q${qi + 1} 축 ${'ABC'[x]}·${'ABC'[y]} 가 함께 움직임 (곱 합 ${s})`); });
    if (!q.emoji) bad(`Q${qi + 1} emoji 없음`);
  });
  const slots = new Set(CORE.ORDER.map((id) => { const s = CORE.pollSlot(id); if (s.qid !== 'r0' || s.opt < 0 || s.opt > 9) bad(`pollSlot ${id}`); return s.opt; }));
  if (slots.size !== 8) bad('pollSlot 이 겹침');
  if (!/^[a-z0-9-]{1,32}$/.test(CORE.POLL)) bad('POLL id 모양');
  const back = CORE.pollCounts(CORE.ORDER.map((id, i) => ({ qid: 'r0', option: CORE.pollSlot(id).opt, votes: i + 1 })).concat([{ qid: 'x', option: 0, votes: 99 }]));
  if (!back || back.total !== 36 || CORE.ORDER.some((id, i) => back.counts[id] !== i + 1)) bad('pollCounts 가 pollSlot 과 맞지 않음');
  if (CORE.pollCounts(null) !== null) bad('pollCounts(null) 은 null');
  // 극단 답: 매 문항 그 결과의 부호와 가장 잘 맞는 보기(동점이면 틀리는 축을 문항마다 돌아가며) → 그 결과
  CORE.ORDER.forEach((want) => {
    const sg = CORE.TYPES[want].sign;
    const ans = QS.map((q, qi) => {
      let bi = 0, bs = -99;
      q.w.forEach((w, j) => {
        const dot = w[0] * sg[0] + w[1] * sg[1] + w[2] * sg[2];
        const miss = [0, 1, 2].find((k) => w[k] !== sg[k]);
        const sc = dot * 10 + (miss === qi % 3 ? 1 : 0);
        if (sc > bs) { bs = sc; bi = j; }
      });
      return bi;
    });
    const got = CORE.score(ans);
    if (got !== want) bad(`극단 답(${want} 쪽) → ${got}`);
  });
  const all = {};
  CORE.ORDER.forEach((id) => { all[id] = 0; });
  let combos = 0, badLean = 0, zero = 0;
  const want = QS.reduce((p, q) => p * q.w.length, 1);
  // 전수 조사: 모든 답 조합을 실제 CORE.result 로 채점 (게이지 0~100, 축 합 0 없음)
  const ans = new Array(QS.length).fill(0);
  (function rec(q) {
    if (q === QS.length) {
      const r = CORE.result(ans);
      all[r.id]++; combos++;
      if (r.s.some((x) => x === 0)) zero++;
      if ((combos & 1023) === 0 && r.lean.some((x) => !(x >= 0 && x <= 100))) badLean++;
      return;
    }
    for (let j = 0; j < QS[q].w.length; j++) { ans[q] = j; rec(q + 1); }
  })(0);
  if (combos !== want) bad(`전수 조합 수 ${combos} ≠ ${want}`);
  if (zero) bad(`축 합이 0 인 조합 ${zero}건 (동점이 생김)`);
  if (badLean) bad(`게이지 값이 0~100 밖 ${badLean}건`);
  const rnd = {}; CORE.ORDER.forEach((id) => { rnd[id] = 0; });
  let nondet = 0;
  for (let t = 0; t < TRIALS; t++) {
    const a = QS.map((q) => (Math.random() * q.w.length) | 0);
    const r = CORE.result(a);
    if (t < 5000 && CORE.result(a.slice()).id !== r.id) nondet++;
    rnd[r.id]++;
  }
  if (nondet) bad(`같은 답인데 결과가 달라짐 ${nondet}건`);
  if (!ids.has(CORE.result([0]).id)) bad('답이 모자랄 때 결과 없음');
  if (CORE.result([]).lean.join() !== '50,50,50') bad('답이 없을 때 게이지는 가운데(50)');
  const names = L10N.en.types;
  console.log(`\n=== 결과 분포: 전수 ${combos.toLocaleString()}가지 / 무작위 ${TRIALS.toLocaleString()}회 (기준 ${LO * 100}%~${HI * 100}%) ===\n`);
  CORE.ORDER.forEach((id) => {
    const pa = all[id] / combos, pr = rnd[id] / TRIALS;
    const t = CORE.TYPES[id];
    const flag = pr < LO || pr > HI || pa < LO || pa > HI ? '  <-- 범위 밖!' : '';
    console.log(`${(t.emoji + ' ' + names[id].name).padEnd(24)} 전수 ${(pa * 100).toFixed(2).padStart(6)}%  무작위 ${(pr * 100).toFixed(2).padStart(6)}%  ${'█'.repeat(Math.round(pr * 200))}${flag}`);
    if (!all[id]) bad(`${id} 는 어떤 답으로도 나오지 않음`);
    if (pa < LO || pa > HI) bad(`${id} 전수 비율 ${(pa * 100).toFixed(2)}% (범위 밖)`);
    if (pr < LO || pr > HI) bad(`${id} 무작위 비율 ${(pr * 100).toFixed(2)}% (범위 밖)`);
  });
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
  if (o && typeof o === 'object') return Object.keys(o).sort().flatMap((k) => [`${p}.${k}`, ...(o[k] && typeof o[k] === 'object' ? shape(o[k], `${p}.${k}`) : [])]);
  return [];
}
function emWidth(str) {
  let w = 0;
  for (const ch of String(str).replace(/<[^>]+>/g, '')) {
    const c = ch.codePointAt(0);
    if (/\p{Extended_Pictographic}/u.test(ch)) w += 1.2;
    else if (c === 0xfe0f || c === 0x200d) w += 0;
    else if (c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e)) w += 0;
    else if (c >= 0x0e00 && c <= 0x0e7f) w += 0.62;
    else if ((c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x3000 && c <= 0x303f)) w += 1;
    else if (ch === ' ' || ch === ' ' || ch === ' ') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.7; // Lora 700 대문자
    else if (/[а-яё]/.test(ch)) w += 0.66;
    else if (/[0-9]/.test(ch)) w += 0.6;
    else if (/[.,:;!?'’"“”«»()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.6;
  }
  return w;
}
// 연도 숫자(YEAR, th 불기 YEAR+543)는 core 에서 온 값 — 숫자 검사 전에 지운다
const YEARS = [String(CORE.YEAR), String(CORE.YEAR + 543)];
const noYear = (v) => YEARS.reduce((t, y) => t.split(y).join(''), String(v || ''));
// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 45, size: 21 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 32, size: 15 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 17 * 1.08, hard: false, what: 'h1 검색어 줄 (두 줄도 괜찮음)' },
  { key: 'start.metaTime+metaCount', get: (T) => T.start.metaTime + T.start.metaCount, px: 328 - 64, size: 15 * 1.05, hard: false, what: '시간·장면 수 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.eyebrow', get: (T) => T.result.eyebrow, px: 328 - 36, size: 16 * 1.08, hard: false, what: '결과 윗줄' },
  { key: 'result.buddyLabel', get: (T) => T.result.buddyLabel, px: (328 - 36 - 10) / 2 - 16, size: 13 * 1.08, hard: false, what: '단짝 카드 라벨 (두 줄도 괜찮음)' },
  { key: 'result.colorLabel', get: (T) => T.result.colorLabel, px: 328 - 36 - 28 - 52, size: 13 * 1.08, hard: false, what: '행운 칸 라벨 (두 줄도 괜찮음)' },
  { key: 'result.monthLabel', get: (T) => T.result.monthLabel, px: 328 - 36 - 28 - 52, size: 13 * 1.08, hard: false, what: '행운 칸 라벨 (두 줄도 괜찮음)' },
  { key: 'result.itemLabel', get: (T) => T.result.itemLabel, px: 328 - 36 - 28 - 52, size: 13 * 1.08, hard: false, what: '행운 칸 라벨 (두 줄도 괜찮음)' },
  { key: 'result.rivalLabel', get: (T) => T.result.rivalLabel, px: (328 - 36 - 10) / 2 - 16, size: 13 * 1.08, hard: false, what: '라이벌 카드 라벨 (두 줄도 괜찮음)' },
];
// Google Fonts 메타데이터(subsets 에 cyrillic)로 확인한 제목 글꼴
const CYRILLIC_LANGS = ['ru'];
const CYRILLIC_DISPLAY = ['Lora', 'Playfair Display', 'Comfortaa', 'Nunito', 'Rubik', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha', 'PT Serif', 'Lora', 'Oswald'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const SPACE_LANGS = new Set(['en', 'fr', 'de', 'vi', 'es', 'it', 'pt', 'ru']);
function hasWord(lang, text, word) {
  const t = text.toLowerCase(), w = word.toLowerCase().trim();
  if (!w) return false;
  if (!SPACE_LANGS.has(lang)) return t.includes(w);
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{M}])${esc}(?![\\p{L}\\p{M}])`, 'u').test(t);
}
const TYPE_KEYS = ['name', 'word', 'vibe', 'desc', 'color', 'item', 'tip'];
const AREAS = ['work', 'money', 'love', 'self'];
const DIGIT = /[0-9０-９%٪]|[๐-๙]/;

function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
    }
    if (!Array.isArray(T.questions) || T.questions.length !== CORE.QUESTIONS.length) bad(`${tag} 문항 수 ≠ ${CORE.QUESTIONS.length}`);
    else CORE.QUESTIONS.forEach((q, qi) => {
      const lq = T.questions[qi];
      if (!lq.q) bad(`${tag} Q${qi + 1} 질문 비어 있음`);
      if (!Array.isArray(lq.choices) || lq.choices.length !== q.w.length) bad(`${tag} Q${qi + 1} 보기 수 ≠ ${q.w.length}`);
      else if (lq.choices.some((c) => !c)) bad(`${tag} Q${qi + 1} 빈 보기`);
      else if (new Set(lq.choices).size !== lq.choices.length) bad(`${tag} Q${qi + 1} 같은 보기 문구`);
    });
    CORE.ORDER.forEach((id) => {
      const t = T.types && T.types[id];
      if (!t) return bad(`${tag} types.${id} 없음`);
      TYPE_KEYS.forEach((k) => { if (!t[k] || typeof t[k] !== 'string') bad(`${tag} types.${id}.${k} 비어 있음`); });
      if (!Array.isArray(t.keywords) || t.keywords.length !== 3 || t.keywords.some((s) => !s)) bad(`${tag} types.${id}.keywords 는 3개`);
      if (!t.fortune || AREAS.some((k) => !t.fortune[k] || typeof t.fortune[k] !== 'string')) bad(`${tag} types.${id}.fortune 은 ${AREAS.join('/')} 네 개`);
      // 가짜 통계 금지: 결과 문구에 숫자·% 를 쓰지 않는다 — 숫자는 연도·core 의 행운의 달과 서버 실제 값(result.sameShare)뿐
      const typeText = [t.name, t.vibe, t.desc, t.color, t.item, t.tip, ...(t.keywords || []), ...Object.values(t.fortune || {})].join(' ');
      if (DIGIT.test(typeText)) bad(`${tag} types.${id} 결과 문구에 숫자·% (말로만): "${(typeText.match(/.{0,12}[0-9０-９%٪๐-๙].{0,12}/) || [''])[0]}"`);
    });
    Object.keys(T.types || {}).forEach((id) => { if (!CORE.TYPES[id]) bad(`${tag} 모르는 유형 ${id}`); });
    const names = CORE.ORDER.map((id) => T.types[id].name.toLowerCase());
    if (new Set(names).size !== names.length) bad(`${tag} 유형 이름이 겹침`);
    CORE.ORDER.forEach((id, i) => CORE.ORDER.forEach((o, j) => { if (i !== j && names[i].includes(names[j])) bad(`${tag} 유형 이름 "${names[j]}" 이 "${names[i]}" 안에 들어 있음 (페이지 검사가 헷갈림)`); }));
    // 자리표시자·FAQ·글꼴
    if (!/\{name\}/.test(T.result.title)) bad(`${tag} result.title 에 {name} 없음`);
    ['{name}', '{emoji}', '{vibe}'].forEach((ph) => { if (!T.result.shareText.includes(ph)) bad(`${tag} result.shareText 에 ${ph} 없음`); });
    if (!T.result.metaDesc.includes('{name}') || !T.result.metaDesc.includes('{vibe}')) bad(`${tag} result.metaDesc 에 {name}/{vibe} 없음`);
    if (!T.result.sameShare.includes('{pct}')) bad(`${tag} result.sameShare 에 {pct} 없음`);
    if (!Array.isArray(T.months) || T.months.length !== 12 || T.months.some((m) => !m) || new Set(T.months).size !== 12) bad(`${tag} months 는 서로 다른 달 이름 12개`);
    if (!T.result.areas || AREAS.some((k) => !T.result.areas[k])) bad(`${tag} result.areas 는 ${AREAS.join('/')} 네 개`);
    // 연도는 core 의 YEAR 에서만: 손으로 쓴 다른 연도(20xx / 25xx)가 없어야 함 (privacy 시행일은 제외)
    const yearsFound = (JSON.stringify([T.meta, T.siteName, T.start, T.result, T.og, T.faq, T.loading, T.types, T.questions]).match(/\b(20[0-9]{2}|25[0-9]{2})\b/g) || []).filter((y) => !YEARS.includes(y));
    if (yearsFound.length) bad(`${tag} core 의 YEAR(${CORE.YEAR}) 가 아닌 연도가 손으로 적혀 있음: ${[...new Set(yearsFound)].join(', ')}`);
    if (!noYear(T.meta.title).trim() || !String(T.meta.title).includes(lang === 'th' ? YEARS[1] : YEARS[0])) bad(`${tag} meta.title 에 연도(${lang === 'th' ? YEARS[1] : YEARS[0]})가 없음`);
    if (!Array.isArray(T.result.axes) || T.result.axes.length !== 3 || T.result.axes.some((a) => !Array.isArray(a) || a.length !== 2 || a.some((x) => !x))) bad(`${tag} result.axes 는 [왼쪽, 오른쪽] 3쌍`);
    if (!T.result.disclaimer || /[0-9]/.test(T.result.disclaimer)) bad(`${tag} result.disclaimer(재미용) 없음/숫자`);
    ['eyebrow', 'colorLabel', 'monthLabel', 'itemLabel', 'gaugeLabel', 'fortuneLabel', 'tipLabel', 'buddyLabel', 'rivalLabel'].forEach((k) => { if (!T.result[k] || /[0-9]/.test(noYear(T.result[k]))) bad(`${tag} result.${k} 없음/숫자`); });
    if (!T.quiz.qLabel.includes('{n}')) bad(`${tag} quiz.qLabel 에 {n} 없음`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
    });
    if (!T.fonts || !T.fonts.css || !T.fonts.display) bad(`${tag} fonts.css / fonts.display 없음`);
    if (CYRILLIC_LANGS.includes(lang) && T.fonts && !CYRILLIC_DISPLAY.includes(String(T.fonts.display).split(',')[0].replace(/['"]/g, '').trim())) bad(`${tag} fonts.display "${T.fonts.display}" 는 키릴 문자를 지원하는 글꼴이 아님`);
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) bad(`${tag} meta.title 이 h1Kicker(검색어)를 담지 않음`);
    if (!APP.title[lang] || !APP.desc[lang]) bad(`${tag} app.config.js title/desc 없음`);
    // 가이드 글: 결과 이름·질문 인용 금지 (스포일러)
    const GD = require(path.join(SITE, 'tools', 'guide', `${lang}.js`));
    const gtext = JSON.stringify(GD).toLowerCase();
    CORE.ORDER.forEach((id) => { if (gtext.includes(T.types[id].name.toLowerCase())) bad(`${tag} 스포일러: 가이드에 결과 이름 "${T.types[id].name}"`); });
    T.questions.forEach((q, qi) => { if (gtext.includes(q.q.toLowerCase())) bad(`${tag} 스포일러: 가이드에 Q${qi + 1} 인용`); });
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    if (lang === 'ru' && /"[^"]*\\"[^"]*\\"/.test(JSON.stringify([T.start, T.result, T.faq, T.questions, T.types]))) warn(`${tag} 러시아어 따옴표는 «» 로`);
    if (lang === 'fr' && /[^\u00a0\u202f ][?!:;»]/.test(JSON.stringify([T.meta, T.start, T.faq, T.result, T.questions]).replace(/https?:\/\/|\\"|":|",|\{|\}/g, ''))) warn(`${tag} ? ! : ; » 앞에 좁은 줄바꿈 없는 공백이 없는 곳이 있음`);
    // 스포일러: 시작 전 문구(메타·시작 화면·FAQ·기본 OG·로딩·포털 카드)에 유형 이름·낱말·질문·보기 금지
    const pre = [JSON.stringify([T.meta, T.siteName, T.start, T.faq, T.og.brand, T.og.defaultKicker, T.og.defaultTitle, T.og.defaultDesc, T.loading]), APP.title[lang] || '', APP.desc[lang] || ''].join(' ');
    CORE.ORDER.forEach((id) => {
      const t = T.types[id];
      if (pre.toLowerCase().includes(t.name.toLowerCase())) bad(`${tag} 스포일러: 유형 이름 "${t.name}" 이 시작 전 문구에 있음`);
      String(t.word).split(',').forEach((w) => { if (hasWord(lang, pre, w)) bad(`${tag} 스포일러: 결과 낱말 "${w.trim()}" 이 시작 전 문구(메타/시작/FAQ/OG/app.config)에 있음`); });
    });
    T.questions.forEach((q, qi) => [q.q, ...q.choices].forEach((s) => {
      if (s.length > 8 && pre.toLowerCase().includes(s.toLowerCase())) bad(`${tag} 스포일러: Q${qi + 1} 문구가 시작 전 문구에 인용됨`);
    }));
    // 폭 예산
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const need = emWidth(v) * b.size;
      if (need > b.px) (b.hard ? bad : warn)(`${tag} ${b.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(b.px)}px (${b.what})`);
    });
  });
  if (TODO.length) warn(`번역 대기(// TODO-TRANSLATE): ${TODO.join(', ')} — 지금은 en 문구 사본`);
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
const variantOf = (lang, rel) => `_l/${lang}/${rel}`;
function commonHtml(tag, html) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/<link rel="canonical" href="https:\/\/newyear\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (!/<meta property="og:image" content="https:\/\/newyear\.example\.com\/og\/[^"]+\.png">/.test(html)) bad(`${tag} og:image 없음`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
}
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  return m ? m[0] : '';
}
// 파일(file) 안의 모든 href/src → 사이트 안 경로로 풀어서 다른 결과 페이지(r/<id>.html)를 가리키는지
function resultTargets(file, html) {
  const served = G.servedPath(file);
  const out = [];
  for (const m of html.matchAll(/\b(?:href|src|action)="([^"]*)"/g)) {
    let u = m[1];
    if (/^https:\/\/newyear\.example\.com\//.test(u)) u = '/' + u.replace(/^https:\/\/newyear\.example\.com\//, '');
    else if (/^[a-z]+:|^#|^\/\//i.test(u)) continue;
    const p = u.startsWith('/') ? u.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(served), u.split(/[?#]/)[0]));
    const r = p.match(/(?:^|\/)r\/([a-z]+)\.html$/);
    if (r) out.push(r[1]);
  }
  // 스크립트로 만드는 링크도 막는다: 결과 페이지 JSON 에 다른 결과 주소가 없어야 함
  for (const m of html.matchAll(/r\/([a-z]+)\.html/g)) out.push(m[1]);
  return out;
}

function checkResult(lang, rf, id, T) {
  const r = read(rf);
  const rt = `[${lang}] ${rf}`;
  commonHtml(rt, r);
  if (!r.includes(`<div data-mg-end="newyear"></div>`)) bad(`${rt} data-mg-end 없음`);
  if (!/window\.MG_FAQ = \[/.test(r)) bad(`${rt} MG_FAQ 없음`);
  if (!/window\.NEWYEAR_RESULT = /.test(r)) bad(`${rt} NEWYEAR_RESULT 없음`);
  if (/class="mg-ad"/.test(r)) bad(`${rt} 결과 페이지에 따로 둔 mg-ad (끝 화면이 이미 포함)`);
  const endAt = r.indexOf('data-mg-end="newyear"'), cardAt = r.indexOf('class="ny-card"');
  if (!(cardAt > 0 && endAt > cardAt)) bad(`${rt} 결과 카드 → 끝 화면 순서가 아님`);
  const t = T.types[id];
  const meta = CORE.TYPES[id];
  [t.name, t.desc, t.vibe, t.color, t.item, t.tip, ...t.keywords, ...Object.values(t.fortune)].forEach((s) => { if (!r.includes(G.esc(s))) bad(`${rt} 자기 결과 문구가 없음: ${s.slice(0, 20)}`); });
  const others = [...new Set(resultTargets(rf, r))].filter((x) => x !== id);
  if (others.length) bad(`${rt} 다른 결과 페이지로 가는 링크/주소(${others.join(', ')}) — 단짝/라이벌도 링크 금지`);
  if (!r.includes(`<p class="ny-disclaimer">${G.esc(T.result.disclaimer)}</p>`)) bad(`${rt} 재미용 안내가 없음`);
  // 행운의 색·달·물건 = core 값 그대로
  if (!r.includes(`<span class="ny-swatch" style="background:${meta.lucky}"></span>`)) bad(`${rt} 행운의 색 견본이 core(${meta.lucky}) 와 다름`);
  if (!r.includes(`<strong class="ny-lucky-val">${G.esc(T.months[meta.month - 1])}</strong>`)) bad(`${rt} 행운의 달이 core(${meta.month}) 와 다름`);
  if (!r.includes(`<span class="ny-lucky-icon" aria-hidden="true">${meta.item}</span>`)) bad(`${rt} 행운의 물건 이모지 없음`);
  if ((r.match(/class="ny-fortune"/g) || []).length !== 4) bad(`${rt} 네 영역 운세 카드가 4개가 아님`);
  if (!/<title>[^<]*\d{4}/.test(r)) bad(`${rt} 결과 title 에 연도 없음`);
  // 단짝·라이벌: 이름은 보이되 링크(<a>) 안이 아님. 다른 결과 이름은 이 둘뿐
  const pair = (r.match(/<div class="ny-pair">[\s\S]*?<\/div>\s*<\/article>/) || [''])[0];
  if (!pair) bad(`${rt} 단짝·라이벌 자리 없음`);
  if (/<a[\s>]|href=|onclick|role="button"|tabindex/.test(pair)) bad(`${rt} 단짝·라이벌 카드에 링크/누르기 — 보여주기만`);
  [['buddy', meta.buddy], ['rival', meta.rival]].forEach(([k, o]) => {
    if (!pair.includes(`ny-pair-${k}`) || !pair.includes(`<span class="ny-pair-name">${G.esc(T.types[o].name)}</span>`)) bad(`${rt} ${k}(${o}) 카드가 없음`);
  });
  CORE.ORDER.forEach((o) => {
    if (o === id) return;
    const ot = T.types[o];
    if (r.includes(G.esc(ot.desc).slice(0, 40)) || r.includes(G.esc(ot.vibe)) || r.includes(G.esc(ot.fortune.work).slice(0, 40)) || r.includes(G.esc(ot.tip).slice(0, 40))) bad(`${rt} 다른 결과(${o}) 설명 문구가 있음`);
    if (o !== meta.buddy && o !== meta.rival && r.includes(G.esc(ot.name))) bad(`${rt} 단짝·라이벌이 아닌 다른 결과(${o}) 이름이 있음`);
    if (o !== meta.buddy && o !== meta.rival && r.includes(`>${CORE.TYPES[o].emoji}<`)) bad(`${rt} 단짝·라이벌이 아닌 다른 결과(${o}) 이모지`);
  });
  if (!r.includes('id="share-cta"')) bad(`${rt} "테스트 해 보기" CTA 없음`);
  // 게이지: 정적 HTML 에는 숨긴 빈 자리만(숫자는 result.js 가 내 답으로 채움 — 가짜 숫자 금지)
  const lean = (r.match(/<div id="lean" class="ny-lean" hidden>[\s\S]*?<\/div>\s*<p id="same-share"/) || [''])[0];
  if (!lean) bad(`${rt} 게이지 자리(숨김)가 없음`);
  else if (/[0-9]/.test(lean.replace(/<[^>]+>/g, '')) || /style="left/.test(lean) || (lean.match(/ny-lean-row/g) || []).length !== 3) bad(`${rt} 게이지: 3줄·미리 넣은 값 없음이어야 함`);
  if (!r.includes(`href="${G.relHref(rf, rf.startsWith('_l/') ? variantOf(lang, 'index.html') : G.folderFileOf(lang, 'index.html'))}"`)) bad(`${rt} CTA 가 시작 화면으로 가지 않음`);
}

function checkHtml() {
  let pages = 0;
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    [G.folderFileOf(lang, 'index.html'), variantOf(lang, 'index.html')].forEach((f) => {
      if (!fs.existsSync(path.join(SITE, f))) return bad(`[${lang}] ${f} 없음 (node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)`);
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html);
      pages++;
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"EntertainmentApplication"/.test(html)) bad(`${tag} appLd(WebApplication, test) 없음`);
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      const start = section(html, 'screen-start');
      const quiz = section(html, 'screen-quiz');
      if (!start || !quiz) bad(`${tag} 시작/질문 화면 없음`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/data-mg-end|mg-faq|MG_FAQ|more-test/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/다른 테스트`);
      if (/window\.MG_FAQ/.test(html)) bad(`${tag} index 에 MG_FAQ (FAQ 는 결과 페이지 끝 화면에만)`);
      if ((quiz.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 질문 화면 mg-ad 는 1개`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 질문 화면의 1개뿐이어야 함`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const startText = start.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
      CORE.ORDER.forEach((id) => {
        const t = T.types[id];
        if (html.includes(G.esc(t.name)) || html.includes(JSON.stringify(t.name).slice(1, -1))) bad(`${tag} index 에 결과 이름 "${t.name}"`);
        if (html.includes(G.esc(t.vibe)) || html.includes(t.desc.slice(0, 40))) bad(`${tag} index 에 결과(${id}) 문구가 실려 있음`);
        if (html.toLowerCase().includes(CORE.TYPES[id].main.toLowerCase())) bad(`${tag} index 에 결과 색(${id}) 이 실려 있음`);
      });
      T.questions.forEach((q, qi) => { if (startText.includes(G.esc(q.q))) bad(`${tag} 시작 화면에 Q${qi + 1} 인용`); });
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (resultTargets(f, html).length !== 0 && /href="[^"]*r\/[a-z]+\.html"/.test(html)) bad(`${tag} index 에 결과 페이지 링크`);
    });
    CORE.ORDER.forEach((id) => {
      [G.folderFileOf(lang, `r/${id}.html`), variantOf(lang, `r/${id}.html`)].forEach((rf) => {
        if (!fs.existsSync(path.join(SITE, rf))) return bad(`${rf} 없음`);
        checkResult(lang, rf, id, T);
        pages++;
      });
    });
    [G.folderFileOf(lang, 'privacy.html'), variantOf(lang, 'privacy.html')].forEach((f) => {
      if (!fs.existsSync(path.join(SITE, f))) return bad(`${f} 없음`);
      commonHtml(`[${lang}] ${f}`, read(f));
      pages++;
    });
    const v = read(variantOf(lang, 'index.html'));
    if (!/<meta name="robots" content="noindex/.test(v)) bad(`[${lang}] _l 사본에 noindex 없음`);
  });
  // 시작/완료 기록: 한 판이 시작될 때 track('start'), 결과에 닿을 때 track('done')
  const appJs = read('newyear.js');
  if (!/track\('start'\)/.test(appJs) || !/track\('done'\)/.test(appJs)) bad("newyear.js: track('start') / track('done') 없음");
  // 단짝·라이벌 카드가 누를 수 있어 보이지 않게
  const css = read('style.css');
  const pairRules = css.match(/\.ny-pair[^{]*\{[^}]*\}/g) || [];
  if (pairRules.some((rule) => /cursor:\s*pointer/.test(rule)) || /\.ny-pair[^{,]*:hover/.test(css)) bad('style.css: 단짝·라이벌 카드에 pointer/hover — 누를 수 있어 보이면 안 됨');
  // sitemap
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  const want = (1 + CORE.ORDER.length) * G.LOCALES.length;
  if (urls !== want) bad(`sitemap.xml URL ${urls} ≠ ${want}`);
  if (!sm.includes('https://newyear.example.com/r/voyage.html') || !sm.includes('https://newyear.example.com/ko/')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 사본(_l) 주소');
  return pages;
}

// ---------------------------------------------------------------- 4) OG 이미지
function checkOg() {
  let n = 0, bytes = 0;
  G.LOCALES.forEach(({ dir }) => {
    ['default', ...CORE.ORDER].forEach((name) => {
      const f = path.join(SITE, 'og', dir, `${name}.png`);
      if (!fs.existsSync(f)) return bad(`OG 없음: og/${dir ? dir + '/' : ''}${name}.png (node tools/gen-og.js all)`);
      const b = fs.readFileSync(f);
      bytes += b.length;
      if (b.toString('ascii', 1, 4) !== 'PNG' || b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) bad(`OG 크기/형식: ${path.relative(SITE, f)}`);
      n++;
    });
  });
  const mb = bytes / 1048576;
  if (mb > 20) bad(`OG 이미지 전체 ${mb.toFixed(1)}MB (20MB 이하로)`);
  return { n, mb };
}

checkCore();
checkLocales();
const pages = checkHtml();
const og = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개 · OG 이미지 ${og.n}장 (${og.mb.toFixed(1)}MB) 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 8종 모두 도달·분포 10%~15%, 동점 없음(축 합 0 조합 0건), 언어 파일 구조·스포일러·FAQ·폭 예산, 생성 HTML(SEO·타이틀 바·끝 화면·광고 위치(시작 화면 맨 끝 1개 포함)·결과 페이지 링크 0·단짝/라이벌 보여주기만), OG 이미지 모두 OK');
