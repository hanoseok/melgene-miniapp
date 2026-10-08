#!/usr/bin/env node
/**
 * 밸런스 게임 검증.
 *   1) 언어 파일(12개): 모든 언어가 같은 qid(= balance-core.js 의 팩 구성) · 같은 a/b · 같은 q 유무를 갖는지,
 *      팩/유형/ui 키가 빠짐없이 있는지, {치환자}가 기본 언어(en)와 같은지, 복수형이 그 언어의 Intl.PluralRules 범주를 다 채우는지,
 *      글꼴·줄바꿈 설정, 360px 카드에 들어가는지(글자 폭 모델), 제목·설명 길이(SEO), FAQ 3~5개, 스포일러(질문·유형 인용) 없음
 *   2) 공유: 해시 인코딩 왕복, 잘못된 해시 거절, 공유 문구 길이
 *   3) 숫자: 투표 응답 파싱, 퍼센트 합 100, 대세 판정(내 표 제외·동률 제외·집계 없음 제외),
 *      대세 일치율 반올림, 유형 경계값, 친구 비교
 *   4) 랜덤 12: 12개·중복 없음·시드 재현성·이미 푼 질문 피하기
 *   5) 생성된 HTML: 타이틀 바, h1 하나, 스크립트 순서, 공통 끝 화면(data-mg-end) 하나 + MG_FAQ, 앱 자체 공유·별점·다른 테스트·FAQ 섹션 없음,
 *      FAQPage JSON-LD 없음, WebApplication+BreadcrumbList(G.appLd), 광고 자리는 질문 화면에 하나, 정적 마크업에 질문·가짜 퍼센트 없음
 *   실제 브라우저 배치(넘침·단어 잘림)는 tools/check-fit.js (Chrome) 가 따로 잰다.
 *
 * 실행: node tools/check-balance.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const CORE = require(path.join(SITE, 'balance-core.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(SITE);
const LANGS = Object.keys(L10N);
const BASE = G.DEFAULT_LOCALE;

let failures = 0;
let passes = 0;
const section = (t) => console.log(`\n— ${t}`);
function ok(cond, msg) {
  if (cond) { passes++; return true; }
  failures++;
  console.log('  ✗ ' + msg);
  return false;
}
const len = (s) => [...String(s)].length;
const placeholders = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(',');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const THAI_MARK = /[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/;
// 보이는 글자 수 (태국어 위·아래 부호는 자리를 차지하지 않는다)
const vlen = (s) => [...String(s)].filter((c) => !THAI_MARK.test(c)).length;
const WIDE = /[\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/;
const isWide = (s) => WIDE.test(s);

// ---------------------------------------------------------------- 글자 폭 모델 (em). 브라우저 없이 360px 카드에 들어가는지 보수적으로 잰다.
function charEm(c) {
  if (THAI_MARK.test(c)) return 0;
  if (/[\u0E00-\u0E7F]/.test(c)) return 0.62;
  if (WIDE.test(c)) return 1.0;
  if (c === ' ' || c === '\u00a0' || c === '\u202f') return 0.27;
  // 키릴 문자: 라틴보다 넓다 (Ж Ш Щ Ю Ы М Ф / ж ш щ ю ы м ф 는 m·w 급, 나머지 소문자도 라틴보다 조금 넓게)
  if (/[ЖШЩЮЫМФ]/.test(c)) return 0.95;
  if (/[жшщюымф]/.test(c)) return 0.86;
  if (/[A-ZÀ-ÞĀ-ſА-ЯЁ]/.test(c) && c === c.toUpperCase() && c !== c.toLowerCase()) return 0.72;
  if (/[а-яё]/.test(c)) return 0.6;
  if (/[0-9]/.test(c)) return 0.62;
  if (/[.,:;'’!?¿¡()\-–—«»„“”"/]/.test(c)) return 0.34;
  if (/[mwMWœæ]/.test(c)) return 0.86;
  if (/[ilj]/.test(c)) return 0.3;
  return 0.58;
}
const textEm = (s) => [...String(s)].reduce((a, c) => a + charEm(c), 0) * 1.04;
// 줄 수: 띄어쓰기 언어는 단어(하이픈 뒤도 끊김) 단위, 한중일·태국어는 글자 단위로 채운다
function linesFor(text, boxEm, charBreak) {
  const tokens = charBreak ? [...String(text)] : String(text).split(/(?<=[\s\-])/);
  let lines = 1, cur = 0;
  tokens.forEach((t) => {
    const w = textEm(t);
    const wTrim = textEm(t.replace(/\s+$/, ''));
    if (cur > 0 && cur + wTrim > boxEm) { lines++; cur = 0; }
    cur += cur === 0 ? w : w;
  });
  return lines;
}
const longestWordEm = (text) => Math.max(0, ...String(text).split(/[\s\u00a0\u202f]+|(?<=-)/).map(textEm));

// 360×640(작은 휴대폰) 기준 카드 치수. style.css 의 값과 같게 유지한다.
const VW = 360, VH = 640;
const OPT_BOX = VW - 32 - 44; // 셸 좌우 16px + 카드 좌우 22px
const SIDE_H = Math.max(340, Math.min(540, VH - 290)) / 2 - 52; // 한쪽 카드 높이 - 위아래 여백
function optFontPx(F, long) {
  const scale = Number(F.optionScale) || 1;
  const vw = VW / 100;
  const clamp = (a, v, b) => Math.max(a, Math.min(b, v));
  if (F.dense) return (long ? clamp(23, 6.8 * vw, 29) : clamp(26, 8 * vw, 34)) * scale;
  return (long ? clamp(19, 5.2 * vw, 24) : clamp(21, 5.8 * vw, 27)) * scale;
}
// ------------------------------------------------------------------ 1) 언어 파일
section(`언어 파일 (${LANGS.length}개: ${LANGS.join(', ')})`);
ok(eq(LANGS.slice().sort(), G.LOCALES.map((l) => l.code).sort()), `언어 파일이 shared/i18n.js 의 LOCALES 와 다름: ${LANGS}`);
const baseT = L10N[BASE];
const baseUi = baseT.ui;
const TOP_KEYS = ['siteName', 'meta', 'fonts', 'app', 'home', 'play', 'faq', 'privacyLink', 'ui', 'og', 'privacy'];
const fitRows = [];
LANGS.forEach((lang) => {
  const T = L10N[lang];
  const U = T.ui;
  const F = T.fonts || {};
  const wide = !!F.dense;
  ok(eq(Object.keys(T).sort(), TOP_KEYS.slice().sort()), `[${lang}] 최상위 키 ${Object.keys(T)} ≠ ${TOP_KEYS} (FAQ 는 faq 로만, SEO 본문·예시 목록 키는 없어야 함)`);
  ok(F.css && /^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css) && /Dela\+Gothic\+One/.test(F.css), `[${lang}] fonts.css 는 Google Fonts css2 이고 숫자·VS 용 Dela Gothic One 을 포함해야 함`);
  ok(F.display && F.option && typeof F.dense === 'boolean' && typeof F.tall === 'boolean'
    && ['keep-all', 'normal', 'auto-phrase'].includes(F.wordBreak) && ['manual', 'auto'].includes(F.hyphens)
    && [400, 500, 600, 700, 800, 900].includes(F.displayWeight) && [400, 500, 600, 700, 800, 900].includes(F.optionWeight),
    `[${lang}] fonts{display, displayWeight, option, optionWeight, dense, tall, wordBreak, hyphens} 가 없거나 이상함`);
  // 불러오는 글꼴 굵기에 display/option 굵기가 들어 있는지 (없으면 브라우저가 가짜 굵게를 만든다)
  [[F.display, F.displayWeight], [F.option, F.optionWeight]].forEach(([fam, w]) => {
    const first = String(fam).split(',')[0].replace(/'/g, '').trim();
    if (first === 'Pretendard') return; // jsDelivr 정적 CSS 에 모든 굵기
    const m = new RegExp('family=' + first.replace(/ /g, '\\+') + '(?::wght@([\\d;]+))?').exec(F.css);
    if (!ok(m, `[${lang}] fonts.css 에 ${first} 가 없음`)) return;
    const weights = m[1] ? m[1].split(';').map(Number) : [400];
    ok(weights.includes(w), `[${lang}] ${first} ${w} 굵기를 불러오지 않음 (css: ${m[1] || '400'})`);
  });

  // 질문
  const qids = Object.keys(U.questions).sort();
  ok(eq(qids, CORE.ALL_QIDS.slice().sort()), `[${lang}] ui.questions 키가 팩 구성(${CORE.ALL_QIDS.length}개)과 다름`);
  let worst = { lines: 0 };
  CORE.ALL_QIDS.forEach((qid) => {
    const q = U.questions[qid];
    if (!ok(q, `[${lang}] ${qid} 없음`)) return;
    ok(CORE.QID_RE.test(qid), `${qid} 가 서버 검사식 ^[a-z0-9_-]{1,32}$ 에 안 맞음`);
    ok(q.a && q.b && q.a !== q.b, `[${lang}] ${qid} a/b 비었거나 같음`);
    ok(!!q.q === !!baseUi.questions[qid].q, `[${lang}] ${qid} q(질문 문장) 유무가 ${BASE} 와 다름`);
    ok(eq(Object.keys(q).sort(), Object.keys(baseUi.questions[qid]).sort()), `[${lang}] ${qid} 키 구성이 ${BASE} 와 다름`);
    // 360px 카드: 대기 상태 글자 크기로 줄 수, 한 단어가 한 줄보다 길지 않은지
    const long = [...q.a].length + [...q.b].length > (wide ? 30 : 70);
    const fs = optFontPx(F, long);
    const boxEm = Math.min(OPT_BOX / fs, 15);
    const lh = F.tall ? 1.38 : 1.2;
    const maxLines = Math.floor(SIDE_H / (fs * lh));
    [q.a, q.b].forEach((t) => {
      const lines = linesFor(t, boxEm, wide || /[฀-๿]/.test(t));
      if (lines > worst.lines) worst = { lines, t, maxLines };
      ok(lines <= Math.min(3, maxLines), `[${lang}] ${qid} 선택지가 360px 카드에서 ${lines}줄 (최대 ${Math.min(3, maxLines)}): "${t}"`);
      // 띄어쓰기로 단어를 나누는 언어만 (태국어는 사전으로 줄을 나누므로 글자 단위로 본다)
      if (!wide && !/[\u0E00-\u0E7F]/.test(t)) ok(longestWordEm(t) <= boxEm, `[${lang}] ${qid} 한 단어가 카드 폭보다 김: "${t}"`);
      ok(vlen(t) <= (wide ? 20 : 64), `[${lang}] ${qid} 선택지가 너무 김 (${vlen(t)}자): "${t}"`);
    });
    if (q.q) ok(vlen(q.q) <= (wide ? 26 : 72), `[${lang}] ${qid} 질문 문장이 너무 김 (${vlen(q.q)}자)`);
  });
  fitRows.push(`${lang}: 가장 긴 선택지 ${worst.lines}줄/최대 ${worst.maxLines} — "${worst.t}"`);

  // 팩·유형·ui 키
  [CORE.RANDOM_ID, ...CORE.PACKS.map((p) => p.id)].forEach((id) => {
    const p = U.packs[id];
    ok(p && p.name && p.blurb, `[${lang}] ui.packs.${id} name/blurb 없음`);
  });
  ok(eq(Object.keys(U.packs).sort(), Object.keys(baseUi.packs).sort()), `[${lang}] ui.packs 키가 ${BASE} 와 다름`);
  CORE.TYPE_IDS.forEach((id) => ok(U.types[id] && U.types[id].name && U.types[id].desc, `[${lang}] ui.types.${id} 없음`));
  ok(eq(Object.keys(U.types).sort(), CORE.TYPE_IDS.slice().sort()), `[${lang}] ui.types 에 모르는 유형이 있음`);
  ok(eq(Object.keys(U).sort(), Object.keys(baseUi).sort()), `[${lang}] ui 키 구성이 ${BASE} 와 다름`);
  Object.keys(baseUi).forEach((k) => {
    if (typeof baseUi[k] !== 'string') return;
    ok(typeof U[k] === 'string' && U[k].length > 0, `[${lang}] ui.${k} 없음`);
    ok(placeholders(U[k]) === placeholders(baseUi[k]), `[${lang}] ui.${k} 치환자 ${placeholders(U[k])} ≠ ${placeholders(baseUi[k])}`);
  });
  ok(/%/.test(U.pct) && placeholders(U.pct) === '{n}', `[${lang}] ui.pct 는 {n} 과 % 를 가져야 함`);
  // 복수형: 그 언어의 Intl.PluralRules 범주를 모두 채운다 (other 필수, 모든 형태에 {n})
  const cats = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
  ok(U.people && U.people.other && Object.values(U.people).every((v) => placeholders(v) === '{n}'), `[${lang}] ui.people 은 { other: '…{n}…' } 형태`);
  Object.keys(U.people || {}).forEach((cat) => ok(cats.includes(cat), `[${lang}] ui.people.${cat} 는 ${lang} 의 복수형 범주(${cats})가 아님`));
  cats.forEach((cat) => ok(cat === 'other' || U.people[cat] || cats.length === 1, `[${lang}] 복수형 범주 ${cat} 가 ui.people 에 없음 (필요: ${cats})`));
  [1, 2, 5, 21, 1000000].forEach((n) => {
    const cat = new Intl.PluralRules(lang).select(n);
    ok((U.people[cat] || U.people.other).includes('{n}'), `[${lang}] ${n} (${cat}) 형태 없음`);
  });

  // SEO: 제목(브랜드 포함)·설명 길이, h1 과 제목에 대표 검색어(app.name)
  const title = `${T.meta.title} | ${G.brandOf(lang)}`;
  // 한중일은 약 32자, 라틴·태국어(보이는 글자 기준)는 약 60자
  ok(vlen(title) <= (wide ? 36 : 62), `[${lang}] <title> 이 너무 김 (${vlen(title)}자): ${title}`);
  const dl = vlen(T.meta.description);
  ok(wide ? dl >= 45 && dl <= 100 : dl >= 100 && dl <= 170, `[${lang}] 메타 설명 길이 ${dl}자 (권장 ${wide ? '45~100' : '100~170'})`);
  ok(T.meta.title.includes(T.app.name) || T.meta.title.includes(T.app.name.replace(/[?？ \s]+$/, '')), `[${lang}] meta.title 에 대표 검색어 "${T.app.name}" 없음`);
  // h1 은 줄바꿈 조절용 줄바꿈 없는 공백(NBSP·NNBSP)을 쓸 수 있다 — 검색어 비교는 보통 공백으로
  ok((T.home.h1a + ' ' + T.home.h1b).replace(/[  ]/g, ' ').includes(T.app.name.replace(/[?？ \s]+$/, '')), `[${lang}] h1 에 대표 검색어 "${T.app.name}" 없음`);
  ok(T.meta.ogTitle && T.meta.ogDescription, `[${lang}] og 제목/설명 없음`);
  ok(placeholders(T.home.count) === '{n}', `[${lang}] home.count 에 {n} 없음`);

  // FAQ (끝 화면 전용): 3~5개, { q, a }
  ok(Array.isArray(T.faq) && T.faq.length >= 3 && T.faq.length <= 5 && T.faq.every((f) => f && f.q && f.a && Object.keys(f).length === 2), `[${lang}] faq 는 { q, a } 3~5개`);
  ok(T.faq.length === baseT.faq.length, `[${lang}] FAQ 개수가 ${BASE} 와 다름`);
  ok(T.privacy.sections.length === baseT.privacy.sections.length, `[${lang}] privacy.sections 개수가 ${BASE} 와 다름`);

  // 스포일러: 시작 전 문구(메타·훅·팩 설명·OG·FAQ)에 실제 선택지·질문 문장·결과 유형 이름이 없어야 한다
  const before = [T.meta.title, T.meta.description, T.meta.ogTitle, T.meta.ogDescription, T.home.h1a, T.home.h1b, T.home.hook,
    ...Object.values(U.packs).map((p) => p.blurb), T.og.title, T.og.tag, T.og.a, T.og.b, ...T.faq.map((f) => f.q + ' ' + f.a)].join('\n');
  const quotes = [];
  Object.values(U.questions).forEach((q) => [q.a, q.b, q.q].filter(Boolean).forEach((t) => quotes.push(t)));
  Object.values(U.types).forEach((t) => quotes.push(t.name));
  quotes.filter((t) => vlen(t) >= (wide ? 3 : 6)).forEach((t) => ok(!before.includes(t), `[${lang}] 스포일러: 시작 전 문구에 질문/유형 "${t}" 이 있음`));
  ok(!/\bvs\b|\bVS\b/.test(Object.values(U.packs).map((p) => p.blurb).join(' ')), `[${lang}] 팩 설명에 "A vs B" 식 예시가 있음 (주제·분위기만)`);
  ok(!/\d/.test(T.og.unknown) && !/\d\s*[%％]/.test(T.og.a + T.og.b + T.og.tag), `[${lang}] OG 카드에 숫자 퍼센트가 있음 (가짜 퍼센트 금지)`);

  // 공유 문구: 가장 긴 팩 이름·유형 이름으로 채워도 적당한 길이
  const longestPack = Object.values(U.packs).map((p) => p.name).sort((a, b) => len(b) - len(a))[0];
  const longestType = Object.values(U.types).map((t) => t.name).sort((a, b) => len(b) - len(a))[0];
  const sRate = G.fmt(U.shareRate, { pack: longestPack, rate: 100, type: longestType });
  const sPlain = G.fmt(U.sharePlain, { pack: longestPack, type: longestType });
  ok(!/\{\w+\}/.test(sRate + sPlain), `[${lang}] 공유 문구에 채워지지 않은 치환자`);
  ok(vlen(sRate) <= (wide ? 140 : 220) && vlen(sPlain) <= (wide ? 140 : 220), `[${lang}] 공유 문구가 너무 김 (${vlen(sRate)}/${vlen(sPlain)})`);
  // 결과 카드 숫자 칸 이름: 두 칸이 한 줄(칸 안쪽 약 116px, 12px 글자)에 들어가는 단어
  [U.rateLabel, U.speedLabel, U.friendLine].forEach((t) => ok(wide || /[\u0E00-\u0E7F]/.test(t) || longestWordEm(t) * 12 <= 116, `[${lang}] 숫자 칸 이름의 한 단어가 너무 김: "${t}"`));
  console.log(`  [${lang}] 질문 ${qids.length} · 팩 ${Object.keys(U.packs).length} · 유형 ${Object.keys(U.types).length} · FAQ ${T.faq.length} · 복수형 ${cats.join('/')} · 제목 ${vlen(title)}자 · 설명 ${dl}자`);
});
console.log('  360px 카드 줄 수 (글자 폭 모델):');
fitRows.forEach((r) => console.log('    ' + r));

// ------------------------------------------------------------------ 2) 공유 해시
section('공유 링크');
CORE.PACKS.forEach((p) => {
  const picks = p.qids.map((_, i) => (i % 3 === 2 ? null : i % 2));
  const h = CORE.encodeShare({ pack: p.id, picks });
  const back = CORE.decodeShare('#' + h);
  ok(back && back.pack === p.id && eq(back.picks, picks) && back.seed === null, `${p.id} 왕복 실패: ${h}`);
});
for (let t = 0; t < 200; t++) {
  const seed = 1 + Math.floor(Math.random() * 2147483646);
  const picks = Array.from({ length: CORE.PACK_SIZE }, () => [0, 1, null][Math.floor(Math.random() * 3)]);
  const back = CORE.decodeShare(CORE.encodeShare({ pack: CORE.RANDOM_ID, seed, picks }));
  ok(back && back.seed === seed && eq(back.picks, picks) && eq(CORE.questionsFor(back.pack, back.seed), CORE.randomSet(seed)),
    `random 왕복 실패 seed=${seed}`);
}
ok(eq(CORE.decodeShare('#p=daily'), { pack: 'daily', seed: null, picks: null }), '#p=daily (선택 없음) 을 받아야 함');
[
  '', '#', '#p=nope', '#p=daily&v=0101', '#p=daily&v=0101010101012', '#p=daily&v=01010101010x',
  '#p=random', '#p=random&s=0', '#p=random&s=2147483648', '#p=random&s=12a', '#p=random&s=-5', '#v=010101010101',
].forEach((bad) => ok(CORE.decodeShare(bad) === null, `잘못된 해시를 받아들임: "${bad}"`));
console.log('  팩 5개 왕복 · 랜덤 200회 왕복 · 잘못된 해시 12종 거절');

// ------------------------------------------------------------------ 3) 숫자
section('투표 응답 / 퍼센트');
ok(eq(CORE.countsFromRows([{ option: 0, votes: 3 }, { option: 1, votes: 1 }]), [3, 1]), 'countsFromRows 기본');
ok(eq(CORE.countsFromRows([{ option: 1, votes: '5' }]), [0, 5]), 'bigint 문자열 / 한쪽만 있는 응답');
ok(eq(CORE.countsFromRows([{ option: 0, votes: 2 }, { option: 7, votes: 9 }]), [2, 0]), 'A/B 가 아닌 선택지는 무시');
[null, undefined, {}, 'x', [], [{ option: 0, votes: 0 }], [{ option: 2, votes: 4 }], [null], [{ option: 0, votes: -1 }], [{ option: 0, votes: 1.5 }], [{ option: 0, votes: 'abc' }]]
  .forEach((bad) => ok(CORE.countsFromRows(bad) === null, `이상한 응답을 숫자로 바꿈: ${JSON.stringify(bad)}`));
ok(eq(CORE.resultsMap([{ qid: 'daily-01', option: 0, votes: 4 }, { qid: 'daily-01', option: 1, votes: 6 }, { qid: 'BAD ID', option: 0, votes: 1 }, { qid: 'love-02', option: 1, votes: 2 }]),
  { 'daily-01': [4, 6], 'love-02': [0, 2] }), 'resultsMap');
ok(eq(CORE.resultsMap(null), {}), 'resultsMap(null) → {}');
ok(eq(CORE.percents([1, 0]), [100, 0]) && eq(CORE.percents([1, 2]), [33, 67]) && eq(CORE.percents([2, 1]), [67, 33]) && eq(CORE.percents([1, 1]), [50, 50]), 'percents 기본');
let sumOk = true;
for (let t = 0; t < 5000; t++) {
  const c = [Math.floor(Math.random() * 5000), 1 + Math.floor(Math.random() * 5000)];
  const p = CORE.percents(c);
  if (p[0] + p[1] !== 100 || p[0] < 0 || p[1] < 0) { sumOk = false; break; }
}
ok(sumOk, '퍼센트 합이 100 이 아닌 경우가 있음');
ok(CORE.majorityOf([3, 1]) === 0 && CORE.majorityOf([1, 3]) === 1 && CORE.majorityOf([2, 2]) === -1 && CORE.majorityOf(null) === -1, 'majorityOf');
ok(eq(CORE.othersOf([1, 0], 0), null), '첫 투표자(나만 있음)는 대세 판정에서 빠져야 함');
ok(eq(CORE.othersOf([5, 3], 1), [5, 2]) && eq(CORE.othersOf([5, 3], null), [5, 3]), 'othersOf');
console.log('  응답 파싱 · 퍼센트 합 5000회 · 다수 판정');

section('대세 일치율 / 유형');
const E = (qid, pick, counts, self, ms) => ({ qid, pick, counts, self: self === undefined ? pick : self, ms: ms || 2000 });
{
  // 5문제 모두 집계 있음. 내 표를 빼고 보면 4문제 다수 쪽, 1문제 소수 → 80% → 인간 여론조사
  const s = CORE.summarize([
    E('daily-01', 0, [10, 3]), E('daily-02', 1, [2, 9]), E('daily-03', 0, [7, 7]), // 내 표 빼면 6:7 → B 다수 → 소수
    E('daily-04', 1, [1, 5]), E('daily-05', 0, [4, 1]),
  ]);
  ok(s.considered === 5 && s.matches === 4 && s.rate === 80 && s.type === 'poll' && s.typeBasis === 'majority', `기본 계산 ${JSON.stringify(s)}`);
}
{
  // 동률(내 표 뺀 뒤 반반)·집계 없음·건너뜀은 분모에서 빠진다
  const s = CORE.summarize([
    E('a-1', 0, [3, 2]),        // 나 빼면 2:2 → 제외
    E('a-2', 1, null),          // 집계 없음 → 제외
    E('a-3', null, [5, 1], null), // 건너뜀
    E('a-4', 0, [9, 2]), E('a-5', 1, [1, 8]), E('a-6', 0, [1, 6]),
  ]);
  ok(s.answered === 5 && s.skipped === 1 && s.withData === 4 && s.considered === 3 && s.matches === 2 && s.rate === 67, `제외 규칙 ${JSON.stringify(s)}`);
  ok(s.type === 'mainstream', `67% → mainstream (${s.type})`);
}
{
  // 첫 투표자: 내 표뿐이면 대세 판정 불가 → 판정 부족 → 고민 시간 유형
  const s = CORE.summarize([E('b-1', 0, [1, 0], 0, 1200), E('b-2', 1, [0, 1], 1, 1800), E('b-3', 0, [1, 0], 0, 1500)]);
  ok(s.considered === 0 && s.rate === null && s.typeBasis === 'speed' && s.type === 'instinct' && s.avgMs === 1500, `첫 투표자 ${JSON.stringify(s)}`);
}
{
  // 예전에 다른 쪽으로 투표해 둔 질문(already): self 는 예전 표
  const s = CORE.summarize([E('c-1', 0, [4, 5], 1), E('c-2', 0, [6, 1], 0), E('c-3', 1, [2, 3], 1)]);
  // c-1: 나 빼면 4:4 → 제외, c-2: 5:1 → A 다수, 일치 / c-3: 2:2 → 제외 → considered 1 → speed
  ok(s.considered === 1 && s.matches === 1 && s.typeBasis === 'speed', `예전 표 보정 ${JSON.stringify(s)}`);
}
{
  const s = CORE.summarize([E('d-1', null, null, null), E('d-2', null, null, null)]);
  ok(s.type === 'skipper' && s.typeBasis === 'none' && s.rate === null && s.avgMs === null, '전부 건너뛰면 skipper');
  ok(CORE.summarize([E('d-3', 1, null, null, 4000)]).type === 'steady' && CORE.summarize([E('d-4', 1, null, null, 9000)]).type === 'ponder', '고민 시간 유형');
  ok(CORE.summarize([E('d-5', 1, null, null, 999999)]).avgMs === 60000, '고민 시간은 문제당 60초로 자른다');
}
// 유형 경계: n문제 중 k문제 일치 → rate
function rateCase(k, n) {
  const entries = [];
  for (let i = 0; i < n; i++) entries.push(E('r-' + i, 0, i < k ? [10, 2] : [2, 10]));
  return CORE.summarize(entries);
}
[[80, 'poll'], [79, 'mainstream'], [55, 'mainstream'], [54, 'indie'], [30, 'indie'], [29, 'contrarian'], [0, 'contrarian'], [100, 'poll']].forEach(([k, type]) => {
  const s = rateCase(k, 100);
  ok(s.rate === k && s.type === type, `경계 ${k}% → ${type} (받은 값 ${s.rate}%, ${s.type})`);
});
ok(rateCase(2, 3).rate === 67 && rateCase(1, 3).rate === 33 && rateCase(1, 6).rate === 17, '반올림 (2/3=67, 1/3=33, 1/6=17)');
ok(rateCase(2, 2).typeBasis === 'speed' && rateCase(3, 3).typeBasis === 'majority', `판정 최소 ${CORE.MIN_FOR_TYPE}문제`);
ok(eq(CORE.compareFriend([0, 1, null, 1, 0], [0, 0, 1, 1, null]), { both: 3, same: 2 }) && CORE.compareFriend([0], null) === null, 'compareFriend');
console.log('  기본·제외 규칙·첫 투표자·예전 표·유형 경계 8종·반올림·친구 비교');

// ------------------------------------------------------------------ 4) 랜덤 12
section('랜덤 12');
let randOk = true;
for (let t = 0; t < 500; t++) {
  const seed = 1 + Math.floor(Math.random() * 2147483646);
  const a = CORE.randomSet(seed);
  if (a.length !== CORE.PACK_SIZE || new Set(a).size !== a.length || a.some((q) => !CORE.ALL_QIDS.includes(q)) || !eq(a, CORE.randomSet(seed))) { randOk = false; break; }
}
ok(randOk, '랜덤 12 가 12개·중복 없음·유효 qid·재현성을 어김');
ok(!eq(CORE.randomSet(1), CORE.randomSet(2)), '다른 시드면 다른 세트여야 함');
{
  const voted = {};
  CORE.ALL_QIDS.slice(0, 48).forEach((q) => { voted[q] = 0; }); // 60개 중 48개 이미 투표
  const seed = CORE.freshSeed(voted, CORE.mulberry32(7), 40);
  const fresh = CORE.randomSet(seed).filter((q) => voted[q] == null).length;
  const firstTry = 1 + Math.floor(CORE.mulberry32(7)() * (2147483647 - 1));
  const freshFirst = CORE.randomSet(firstTry).filter((q) => voted[q] == null).length;
  ok(fresh >= freshFirst, `freshSeed 가 첫 시도보다 나쁨 (${fresh} < ${freshFirst})`);
  ok(fresh >= 4, `freshSeed 가 새 질문을 충분히 고르지 못함 (${fresh}/12, 무작위 기대값 2.4)`);
  const all = {}; CORE.ALL_QIDS.forEach((q) => { all[q] = 1; });
  ok(typeof CORE.freshSeed(all) === 'number', '전부 투표했어도 시드를 돌려줘야 함');
  console.log(`  500회 · 이미 48문제 투표한 사람 → 새 질문 ${fresh}/12 (첫 시도 ${freshFirst}/12)`);
}

// ------------------------------------------------------------------ 5) 생성된 HTML
section('생성된 HTML');
const appJs = fs.readFileSync(path.join(SITE, 'balance.js'), 'utf8');
const usedUi = [...new Set([...appJs.matchAll(/\bUI\.(\w+)/g)].map((m) => m[1]))];
const stripScripts = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
LANGS.forEach((lang) => {
  const T = L10N[lang];
  usedUi.forEach((k) => ok(T.ui[k] != null, `[${lang}] balance.js 가 쓰는 ui.${k} 가 없음`));
  const file = path.join(SITE, G.fileOf(lang, 'index.html'));
  if (!ok(fs.existsSync(file), `${file} 없음 — node tools/gen-i18n.js 먼저`)) return;
  const html = fs.readFileSync(file, 'utf8');
  const body = html.slice(html.indexOf('<body'));
  const visible = stripScripts(body);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'window.PAGE_I18N', 'window.MG_FAQ', 'shared/common.js', 'shared/supa.js', 'balance-core.js', 'balance.js'];
  const idx = order.map((x) => html.indexOf(x, html.indexOf('</footer>')));
  ok(idx.every((v) => v > 0) && idx.every((v, i) => i === 0 || v > idx[i - 1]), `[${lang}] 스크립트 순서가 ${order.join(' → ')} 가 아님`);
  ok(/<body[^>]*>\s*<header class="mg-top">/.test(html), `[${lang}] 맨 위 공통 타이틀 바(G.topBar)가 body 첫 요소가 아님`);
  ok((body.match(/<h1\b/g) || []).length === 1 && /<h1[^>]*>[\s\S]*?<\/h1>/.exec(body)[0].includes(G.esc(T.home.h1a)), `[${lang}] 보이는 h1 은 정확히 하나(검색어 포함)`);
  ok(html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`), `[${lang}] <title> = 검색어 제목 | 브랜드`);
  // 끝 화면: 공통 컴포넌트 하나, 앱 자체 별점·공유·다시 하기·다른 테스트·FAQ 섹션 없음
  const end = body.slice(body.indexOf('id="screen-end"'), body.indexOf('</main>'));
  ok((body.match(/data-mg-end="balance"/g) || []).length === 1 && end.includes('data-mg-end="balance"'), `[${lang}] 끝 화면에 <div data-mg-end="balance"> 가 정확히 하나`);
  ok(/data-mg-end="balance" data-retry-label="[^"]+"/.test(end), `[${lang}] data-mg-end 에 다시 하기 문구(data-retry-label)`);
  ok(!/data-mg-(rating|social|heart)=|share-btn|other-btn|replay-btn|id="more-tests"|more-tests-section|class="bal-seo"|<details/.test(body), `[${lang}] 앱 자체 별점·공유·다시 하기·다른 테스트·SEO 글·FAQ 섹션이 남아 있음`);
  ok(!/r-split|r-picks|bal-split|bal-pick/.test(body), `[${lang}] 끝 화면에 질문 목록(내 선택 모아보기·팽팽한 질문)이 남아 있음 — 스포일러`);
  const faqJson = (/window\.MG_FAQ = (\[[\s\S]*?\]);<\/script>/.exec(html) || [])[1];
  ok(faqJson && eq(JSON.parse(faqJson), T.faq), `[${lang}] window.MG_FAQ 가 언어 파일 faq 와 다름`);
  // 구조화 데이터: WebApplication + BreadcrumbList (G.appLd), FAQPage 없음
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const graph = lds.flatMap((o) => o['@graph'] || [o]);
  ok(graph.some((o) => o['@type'] === 'WebApplication' && o.name === T.app.name && o.inLanguage === lang) && graph.some((o) => o['@type'] === 'BreadcrumbList'), `[${lang}] JSON-LD(WebApplication + BreadcrumbList) 없음`);
  ok(!html.includes('FAQPage') && !html.includes('aggregateRating'), `[${lang}] FAQPage / aggregateRating JSON-LD 가 있음`);
  // 광고: 시작 화면(팩 고르기) 맨 아래 하나(mg-ad-start, 규칙 2026-10-02) + 질문 화면 하나 (끝 화면은 공통 컴포넌트가 포함)
  const play = body.slice(body.indexOf('id="screen-play"'), body.indexOf('id="screen-end"'));
  ok((html.match(/class="mg-ad"/g) || []).length === 1 && play.includes('class="mg-ad"'), `[${lang}] <div class="mg-ad"> 는 질문 화면에 정확히 하나`);
  const home = body.slice(body.indexOf('id="screen-home"'), body.indexOf('id="screen-play"'));
  ok((html.match(/class="mg-ad mg-ad-start"/g) || []).length === 1 && (home.match(/mg-ad/g) || []).length === 2 && /<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>/.test(home), `[${lang}] 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나`);
  ok(!/ad-slot|ad-placeholder|adsbygoogle/.test(html), `[${lang}] 예전 광고 자리/자리표시자가 있음`);
  ok(/<style>:root \{[^<]*--display-weight[^<]*\}<\/style>/.test(html) && html.indexOf('<style>:root {') > html.indexOf('style.css"'), `[${lang}] 언어별 글꼴 변수(<style>:root)가 없거나 style.css 보다 앞에 있음`);
  const cls = (/<html lang="[^"]+"(?: class="([^"]*)")?>/.exec(html) || [])[1] || '';
  ok(cls.includes('bal-dense') === !!T.fonts.dense && cls.includes('bal-tall') === !!T.fonts.tall, `[${lang}] <html class> 가 fonts.dense/tall 과 다름`);
  // 스포일러·가짜 숫자: 보이는 정적 마크업(스크립트 제외)에 실제 선택지·질문 문장이 없고, 숫자 퍼센트도 없다
  const quoted = Object.values(T.ui.questions).flatMap((q) => [q.a, q.b, q.q].filter(Boolean)).filter((t) => vlen(t) >= 4);
  ok(!quoted.some((t) => visible.includes(G.esc(t))), `[${lang}] 정적 HTML 에 질문/선택지가 보임 (스포일러)`);
  const app = visible.slice(visible.indexOf('<main id="app">'), visible.indexOf('</main>'));
  ok(!/\d\s*[%％]/.test(app), `[${lang}] 게임 화면 정적 마크업에 숫자% 가 있음 (가짜 퍼센트 금지)`);
  const priv = fs.readFileSync(path.join(SITE, G.fileOf(lang, 'privacy.html')), 'utf8');
  ok(/<body[^>]*>\s*<header class="mg-top">/.test(priv) && priv.includes(`<html lang="${lang}"`), `[${lang}] privacy.html 타이틀 바/언어`);
});
{
  const og = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8');
  ok(!/\d\s*[%％]/.test(og.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script>[\s\S]*?<\/script>/, '')), 'OG 카드에 가짜 퍼센트가 있음');
  // 화면 문구는 언어 파일에만: 앱 JS·CSS 에 언어 코드나 한글/가나 문구가 박혀 있지 않은지
  const css = fs.readFileSync(path.join(SITE, 'style.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  ok(!/:lang\(/.test(css), 'style.css 에 :lang() 규칙이 있음 — 언어별 값은 tools/i18n/<lang>.js 의 fonts 로');
  ok(!/@media[^{]*min-width/.test(css), 'style.css 에 화면을 넓히는 min-width 분기점이 있음 — 데스크톱도 모바일 한 줄(--app-width)');
  const jsCode = appJs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok(!/[가-힯぀-ヿ一-鿿฀-๿]/.test(jsCode), 'balance.js 에 한글/가나/한자/태국어 문구가 있음 — 문구는 ui.* 로');
  const langRe = new RegExp(`['"](${G.LOCALES.map((l) => l.code).join('|')})['"]`);
  ok(!langRe.test(jsCode) && !langRe.test(fs.readFileSync(path.join(SITE, 'balance-core.js'), 'utf8')), 'JS 에 언어 코드가 박혀 있음');
  ok(!/renderMoreTests|window\.share\(|shareTwitterUrl|shareFacebookUrl/.test(jsCode), 'balance.js 에 앱 자체 공유/다른 테스트 코드가 남아 있음 (공통 끝 화면 사용)');
  ok(/setShareData/.test(jsCode) && /setRetry/.test(jsCode), 'balance.js 가 setShareData / setRetry 를 등록하지 않음');
  const sm = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
  ok((sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length === G.LOCALES.length && /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sm), 'sitemap.xml 에 12개 언어 URL + lastmod');
}
console.log(`  ${LANGS.length}개 언어 index·privacy · balance.js 가 쓰는 ui 키 ${usedUi.length}개`);

console.log(`\n통과 ${passes}건, 실패 ${failures}건`);
if (failures) { console.log('결과: FAIL'); process.exit(1); }
console.log('결과: PASS — 언어 파일·공유 링크·선택률/대세 계산·랜덤 12·생성 HTML 모두 통과');
