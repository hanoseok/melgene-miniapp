#!/usr/bin/env node
/**
 * MBTI 테스트 검사 (tools/check-all.js 가 자동으로 돌린다, cwd = apps/mbti).
 *   1) 채점: 축마다 5^5 = 3,125가지 답을 전부 채점해 앞/뒤 글자 확률을 정확히 구하고(축은 서로 독립) → 16종 정확한 확률이
 *      각 5.5%~7.0%(1/16 = 6.25% 근처), 무작위 200,000회도 같은 범위, 16종 모두 실제 답으로 나오는지, 같은 답 → 같은 결과,
 *      20문항 = 축 4개 × 5문항, 축마다 앞/뒤 글자 문항이 섞였는지(3:2 / 2:3), 축 비율(#d=) 인코딩 왕복·유형과 안 맞으면 거절,
 *      찰떡궁합/상극 id, 색, poll 인코딩(r0·r1, 보기 0~7).
 *   2) 언어 파일 12개: en.js 와 키 구조가 완전히 같은지(배열 길이 포함), 문항 20개·척도 5개·축 4개, 자리표시자,
 *      FAQ 3~5개(일반 텍스트, "무료인가요?" 류 금지, 비공식 안내 포함), 비공식 안내 한 줄(result.disclaimer, Myers-Briggs),
 *      한국어가 아닌 파일에 한글, 글꼴(키릴 문자 지원), ru 는 «ты»(테스트 문구에 вы/вас/ваш 없음),
 *      스포일러(메타·시작 화면·FAQ·기본 OG·app.config·가이드에 유형 코드·별명·질문 인용 금지), 360px 폭 예산.
 *      // TODO-TRANSLATE 가 남은 파일은 (참고)로만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 사본 _l/): title / h1 하나 / hreflang 13개 / canonical / 타이틀 바 / index 의 appLd /
 *      FAQPage JSON-LD 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·끝 화면 없음 / 질문 화면 mg-ad 1개(그 밖 페이지 전체 0개) /
 *      index 에 유형 코드·결과 문구 없음 / 결과 페이지 = 자기 결과 + 축 막대(처음엔 숨김) + 장점·약점·일·연애 + 찰떡궁합·상극(div, 링크 아님)
 *      + 비공식 안내 + data-mg-end + MG_FAQ, 다른 결과 페이지로 가는 href 0개(모든 href 를 실제 경로로 풀어서 확인), 따로 둔 mg-ad 없음.
 *      style.css 에서 찰떡궁합·상극 카드에 cursor:pointer·hover 가 없는지. mbti.js 의 track('start')/track('done').
 *   4) sitemap.xml URL 수, OG 이미지(언어 × (default + 16종))가 1200×630 PNG 인지 + 전체 용량.
 *
 * 실행: node tools/check-mbti.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'mbti-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);
const TODO = G.todoLocales(SITE);

const TRIALS = 200000;
const LO = 0.055;
const HI = 0.07;
const problems = [];
const warns = [];
const bad = (m) => (G.isTodoMessage(m, TODO) ? warns : problems).push(m);
const warn = (m) => warns.push(m);
const CODE_RE = /(?<![A-Za-z])[EI][SN][TF][JP](?![A-Za-z])/;

// ---------------------------------------------------------------- 1) 채점
function checkCore() {
  const ids = new Set(CORE.ORDER);
  if (ids.size !== 16) bad(`유형 수 ${ids.size} ≠ 16`);
  CORE.ORDER.forEach((id) => {
    const t = CORE.TYPES[id];
    if (!t) return bad(`TYPES.${id} 없음`);
    if (t.code !== id.toUpperCase() || !CODE_RE.test(t.code)) bad(`TYPES.${id}.code ${t.code}`);
    ['best', 'clash'].forEach((k) => { if (!ids.has(t[k]) || t[k] === id) bad(`TYPES.${id}.${k} = ${t[k]} (잘못된 id)`); });
    if (t.best === t.clash) bad(`TYPES.${id} 찰떡궁합과 상극이 같음`);
    if (CORE.TYPES[t.best] && CORE.TYPES[t.best].best !== id) bad(`TYPES.${id} 찰떡궁합이 서로 맞지 않음`);
    ['color', 'deep', 'ink'].forEach((k) => { if (!/^#[0-9a-f]{6}$/i.test(t[k])) bad(`TYPES.${id}.${k} 색`); });
    if (!t.emoji) bad(`TYPES.${id}.emoji 없음`);
  });
  if (CORE.QUESTIONS.length !== 20) bad(`문항 수 ${CORE.QUESTIONS.length} (20)`);
  const per = [0, 0, 0, 0], pos = [0, 0, 0, 0];
  CORE.QUESTIONS.forEach((q, qi) => {
    if (!(q.axis >= 0 && q.axis < 4) || (q.key !== 1 && q.key !== -1)) return bad(`Q${qi + 1} axis/key`);
    per[q.axis]++; if (q.key > 0) pos[q.axis]++;
    if (!q.emoji) bad(`Q${qi + 1} emoji 없음`);
    if (qi > 0 && CORE.QUESTIONS[qi - 1].axis === q.axis) bad(`Q${qi} 과 Q${qi + 1} 이 같은 축 (번갈아 나와야 함)`);
  });
  per.forEach((n, a) => {
    if (n !== 5) bad(`축 ${CORE.AXES[a].join('/')} 문항 ${n}개 (5)`);
    if (pos[a] < 2 || pos[a] > 3) bad(`축 ${CORE.AXES[a].join('/')} 앞 글자 쪽 문항 ${pos[a]}개 (2~3, 섞여 있어야 함)`);
  });
  // poll 슬롯: 16종이 (r0|r1, 0~7) 서로 다른 칸
  const slots = new Set(CORE.ORDER.map((id) => { const s = CORE.pollSlot(id); if (!/^r[01]$/.test(s.qid) || s.opt < 0 || s.opt > 7) bad(`pollSlot ${id}`); return s.qid + ':' + s.opt; }));
  if (slots.size !== 16) bad('pollSlot 이 겹침');
  if (!/^[a-z0-9-]{1,32}$/.test(CORE.POLL)) bad('POLL id 모양');
  const back = CORE.pollCounts(CORE.ORDER.map((id, i) => { const s = CORE.pollSlot(id); return { qid: s.qid, option: s.opt, votes: i + 1 }; }).concat([{ qid: 'x', option: 0, votes: 99 }]));
  if (!back || back.total !== 136 || CORE.ORDER.some((id, i) => back.counts[id] !== i + 1)) bad('pollCounts 가 pollSlot 과 맞지 않음');
  if (CORE.pollCounts(null) !== null) bad('pollCounts(null) 은 null');

  // 정확한 분포: 축마다 그 축 5문항의 5^5 답을 전부 채점 (다른 축 답은 결과에 영향 없음 → 축끼리 독립)
  const pFirst = CORE.AXES.map((pair, a) => {
    const qs = CORE.QUESTIONS.map((q, i) => (q.axis === a ? i : -1)).filter((i) => i >= 0);
    let first = 0, total = 0;
    const ans = new Array(CORE.QUESTIONS.length).fill(null);
    (function rec(k) {
      if (k === qs.length) {
        total++;
        if (CORE.result(ans).code[a] === pair[0]) first++;
        return;
      }
      for (let v = 0; v < CORE.SCALE; v++) { ans[qs[k]] = v; rec(k + 1); }
      ans[qs[k]] = null;
    })(0);
    return first / total;
  });
  const exact = {};
  CORE.ORDER.forEach((id) => {
    const c = id.toUpperCase();
    exact[id] = CORE.AXES.reduce((p, pair, a) => p * (c[a] === pair[0] ? pFirst[a] : 1 - pFirst[a]), 1);
  });
  // 무작위 + 결정성 + 축 비율 왕복
  const rnd = {}; CORE.ORDER.forEach((id) => { rnd[id] = 0; });
  let nondet = 0, badPct = 0;
  for (let t = 0; t < TRIALS; t++) {
    const ans = CORE.QUESTIONS.map(() => (Math.random() * CORE.SCALE) | 0);
    const r = CORE.result(ans);
    if (t < 5000) {
      if (CORE.result(ans.slice()).id !== r.id) nondet++;
      const enc = CORE.encodePct(r.pct);
      const dec = CORE.decodePct(enc, r.id);
      if (!dec || dec.join() !== r.pct.join()) badPct++;
      if (!/^[A-Za-z0-9_-]+$/.test(enc)) badPct++;
    }
    rnd[r.id]++;
  }
  if (nondet) bad(`같은 답인데 결과가 달라짐 ${nondet}건`);
  if (badPct) bad(`축 비율(#d=) 인코딩 왕복 실패 ${badPct}건`);
  // 유형과 안 맞는 비율은 거절
  if (CORE.decodePct(CORE.encodePct([80, 50, 50, 50]), 'intj') !== null) bad('decodePct: E 80% 인데 INTJ 를 받아들임');
  if (CORE.decodePct('!!', 'intj') !== null || CORE.decodePct(CORE.encodePct([101, 0, 0, 0]), 'esfp') !== null) bad('decodePct: 잘못된 값을 받아들임');
  // 16종 모두 실제 답으로: 그 유형 쪽으로 "매우 그렇다/아니다"
  CORE.ORDER.forEach((id) => {
    const c = id.toUpperCase();
    const ans = CORE.QUESTIONS.map((q) => { const wantFirst = c[q.axis] === CORE.AXES[q.axis][0]; return (wantFirst ? q.key > 0 : q.key < 0) ? 4 : 0; });
    const r = CORE.result(ans);
    if (r.id !== id) bad(`${id} 를 겨냥한 답이 ${r.id} 가 됨`);
    if (r.pct.some((p, a) => p !== (c[a] === CORE.AXES[a][0] ? 100 : 0))) bad(`${id} 겨냥 답의 비율 ${r.pct}`);
  });
  // 답이 모자라도(나머지 null) 결과가 나오는지
  if (!ids.has(CORE.result([4]).id)) bad('답이 모자랄 때 결과 없음');
  const names = L10N.en.types;
  console.log(`\n=== 결과 분포: 정확한 값(축마다 5^5 전수) / 무작위 ${TRIALS.toLocaleString()}회 (기준 ${(LO * 100).toFixed(1)}%~${(HI * 100).toFixed(1)}%) ===`);
  console.log(`축별 앞 글자 확률: ${CORE.AXES.map((p, a) => `${p[0]} ${(pFirst[a] * 100).toFixed(3)}%`).join(' · ')}\n`);
  CORE.ORDER.forEach((id) => {
    const pa = exact[id], pr = rnd[id] / TRIALS;
    const t = CORE.TYPES[id];
    const flag = pr < LO || pr > HI || pa < LO || pa > HI ? '  <-- 범위 밖!' : '';
    console.log(`${(t.code + ' ' + t.emoji + ' ' + names[id].name).padEnd(32)} 정확 ${(pa * 100).toFixed(3).padStart(6)}%  무작위 ${(pr * 100).toFixed(2).padStart(6)}%  ${'█'.repeat(Math.round(pr * 400))}${flag}`);
    if (!rnd[id]) bad(`${id} 가 무작위로 한 번도 나오지 않음`);
    if (pa < LO || pa > HI) bad(`${id} 정확한 비율 ${(pa * 100).toFixed(3)}% (범위 밖)`);
    if (pr < LO || pr > HI) bad(`${id} 무작위 비율 ${(pr * 100).toFixed(2)}% (범위 밖)`);
  });
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
  if (o && typeof o === 'object') return Object.keys(o).sort().flatMap((k) => [`${p}.${k}`, ...(o[k] && typeof o[k] === 'object' ? shape(o[k], `${p}.${k}`) : [])]);
  return [];
}
// 글자 폭(em) 근사 — Nunito 900 기준(가장 넓은 제목 글꼴)
function emWidth(str) {
  let w = 0;
  for (const ch of String(str).replace(/<[^>]+>/g, '')) {
    const c = ch.codePointAt(0);
    if (/\p{Extended_Pictographic}/u.test(ch)) w += 1.2;
    else if (c === 0xfe0f || c === 0x200d) w += 0;
    else if (c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e)) w += 0;
    else if (c >= 0x0e00 && c <= 0x0e7f) w += 0.62;
    else if ((c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x3000 && c <= 0x303f)) w += 1;
    else if (ch === ' ' || ch === '\u00a0' || ch === '\u202f') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.72;
    else if (/[а-яё]/.test(ch)) w += 0.64;
    else if (/[0-9]/.test(ch)) w += 0.62;
    else if (/[.,:;!?'’"“”«»()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.6;
  }
  return w;
}
// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 40, size: 20 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 32, size: 15 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 17 * 1.08, hard: false, what: 'h1 검색어 줄 (두 줄도 괜찮음)' },
  { key: 'start.metaTime+metaCount', get: (T) => T.start.metaTime + T.start.metaCount, px: 328 - 64, size: 15 * 1.05, hard: false, what: '시간·문항 수 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.bestLabel', get: (T) => T.result.bestLabel, px: (328 - 10) / 2 - 20, size: 14 * 1.08, hard: true, what: '찰떡궁합 라벨 한 줄' },
  { key: 'result.clashLabel', get: (T) => T.result.clashLabel, px: (328 - 10) / 2 - 20, size: 14 * 1.08, hard: true, what: '상극 라벨 한 줄' },
  { key: 'result.eyebrow', get: (T) => T.result.eyebrow, px: 328 - 36, size: 16 * 1.08, hard: false, what: '결과 윗줄' },
  // 척도 보기: 카드 안쪽(328 - 32) - 버튼 안쪽(28 + 테두리 4) - 점·간격(36)
  ...[0, 1, 2, 3, 4].map((i) => ({ key: `quiz.scale[${i}]`, get: (T) => T.quiz.scale[i], px: 328 - 32 - 32 - 36, size: 16 * 1.05, hard: true, what: '척도 보기 한 줄' })),
  // 축 막대 윗줄: 카드 안쪽 292px 를 두 극이 나눠 씀 (글자 + 글자 이름)
  ...[0, 1, 2, 3].map((i) => ({ key: `axes[${i}]`, get: (T) => `${CORE.AXES[i][0]} ${T.axes[i].a}  ${T.axes[i].b} ${CORE.AXES[i][1]}`, px: 292 - 8, size: 13.5 * 1.05, hard: false, what: '축 막대 윗줄' })),
];
const CYRILLIC_LANGS = ['ru'];
const CYRILLIC_DISPLAY = ['Comfortaa', 'Nunito', 'Rubik', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const SPACE_LANGS = new Set(['en', 'fr', 'de', 'vi', 'es', 'it', 'pt', 'ru']);
function hasWord(lang, text, word) {
  const t = text.toLowerCase(), w = word.toLowerCase().trim();
  if (!w) return false;
  if (!SPACE_LANGS.has(lang)) return t.includes(w);
  const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{M}])${esc}(?![\\p{L}\\p{M}])`, 'u').test(t);
}
function guideOf(lang) {
  const f = path.join(SITE, 'tools', 'guide', `${lang}.js`);
  return fs.existsSync(f) ? require(f) : null;
}

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
    else T.questions.forEach((q, qi) => { if (!q || !q.q) bad(`${tag} Q${qi + 1} 비어 있음`); });
    if (!Array.isArray(T.quiz.scale) || T.quiz.scale.length !== CORE.SCALE || T.quiz.scale.some((s) => !s)) bad(`${tag} quiz.scale 은 ${CORE.SCALE}개`);
    if (!Array.isArray(T.axes) || T.axes.length !== 4 || T.axes.some((x) => !x || !x.a || !x.b)) bad(`${tag} axes 는 {a, b} 4개`);
    CORE.ORDER.forEach((id) => {
      const t = T.types && T.types[id];
      if (!t) return bad(`${tag} types.${id} 없음`);
      ['name', 'word', 'vibe', 'desc', 'work', 'love'].forEach((k) => { if (!t[k]) bad(`${tag} types.${id}.${k} 비어 있음`); });
      ['strengths', 'blind'].forEach((k) => { if (!Array.isArray(t[k]) || t[k].length !== 3 || t[k].some((s) => !s)) bad(`${tag} types.${id}.${k} 는 3개`); });
      if (CODE_RE.test([t.name, t.vibe, t.desc, t.work, t.love, ...t.strengths, ...t.blind].join(' '))) bad(`${tag} types.${id} 설명에 유형 코드가 들어 있음(다른 유형 스포일러)`);
    });
    Object.keys(T.types || {}).forEach((id) => { if (!CORE.TYPES[id]) bad(`${tag} 모르는 유형 ${id}`); });
    const names = CORE.ORDER.map((id) => T.types[id].name.toLowerCase());
    if (new Set(names).size !== names.length) bad(`${tag} 유형 별명이 겹침`);
    // 자리표시자·FAQ·글꼴·비공식 안내
    ['{code}', '{name}'].forEach((ph) => { if (!T.result.title.includes(ph)) bad(`${tag} result.title 에 ${ph} 없음`); });
    ['{code}', '{name}', '{emoji}'].forEach((ph) => { if (!T.result.shareText.includes(ph)) bad(`${tag} result.shareText 에 ${ph} 없음`); });
    ['{code}', '{name}', '{vibe}'].forEach((ph) => { if (!T.result.metaDesc.includes(ph)) bad(`${tag} result.metaDesc 에 ${ph} 없음`); });
    if (!T.result.sameShare.includes('{pct}')) bad(`${tag} result.sameShare 에 {pct} 없음`);
    if (!T.quiz.qLabel.includes('{n}')) bad(`${tag} quiz.qLabel 에 {n} 없음`);
    if (!/Myers-Briggs/.test(T.result.disclaimer) || !/MBTI/.test(T.result.disclaimer)) bad(`${tag} result.disclaimer 에 비공식 안내(MBTI·The Myers-Briggs Company) 없음`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else {
      T.faq.forEach((f, i) => {
        if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
        else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      });
      if (!T.faq.some((f) => /Myers-Briggs/.test(f.a))) bad(`${tag} faq 에 비공식 안내(Myers-Briggs) 답이 없음`);
    }
    if (!T.fonts || !T.fonts.css || !T.fonts.display) bad(`${tag} fonts.css / fonts.display 없음`);
    if (CYRILLIC_LANGS.includes(lang) && T.fonts && !CYRILLIC_DISPLAY.includes(String(T.fonts.display).split(',')[0].replace(/['"]/g, '').trim())) bad(`${tag} fonts.display "${T.fonts.display}" 는 키릴 문자를 지원하는 글꼴이 아님`);
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) bad(`${tag} meta.title 이 h1Kicker(검색어)를 담지 않음`);
    if (!/MBTI/.test(T.meta.title)) bad(`${tag} meta.title 에 검색어 MBTI 없음`);
    if (!APP.title[lang] || !APP.desc[lang]) bad(`${tag} app.config.js title/desc 없음`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    if (lang === 'ru') {
      const txt = JSON.stringify([T.meta, T.start, T.quiz, T.loading, T.result, T.og, T.faq, T.questions, T.types]);
      const m = txt.match(/(?<![\p{L}])(вы|вас|вам|ваш[а-я]*|Вы|Вас|Вам|Ваш[а-я]*)(?![\p{L}])/u);
      if (m) bad(`${tag} 테스트 문구는 «ты» — "${m[0]}" 이 있음`);
    }
    if (lang === 'fr' && /[^\u00a0\u202f][?!:;»]/.test(JSON.stringify([T.meta, T.start, T.faq, T.result, T.questions]).replace(/https?:\/\/|\\"|":|",|\{|\}/g, ''))) warn(`${tag} ? ! : ; » 앞에 좁은 줄바꿈 없는 공백이 없는 곳이 있음`);
    // 스포일러: 시작 전 문구(메타·시작 화면·FAQ·기본 OG·포털 카드·가이드)에 유형 코드·별명·낱말·질문 금지
    const g = guideOf(lang);
    const pre = [JSON.stringify([T.meta, T.siteName, T.start, T.faq, T.og.brand, T.og.defaultKicker, T.og.defaultTitle, T.og.defaultDesc, T.loading]), APP.title[lang] || '', APP.desc[lang] || ''].join(' ');
    const pres = [['시작 전 문구(메타/시작/FAQ/OG/app.config)', pre]];
    if (g) pres.push(['가이드(tools/guide)', JSON.stringify(g)]);
    else bad(`${tag} tools/guide/${lang}.js 없음`);
    pres.forEach(([where, text]) => {
      const cm = text.match(CODE_RE);
      if (cm) bad(`${tag} 스포일러: ${where}에 유형 코드 "${cm[0]}"`);
      CORE.ORDER.forEach((id) => {
        const t = T.types[id];
        if (text.toLowerCase().includes(t.name.toLowerCase())) bad(`${tag} 스포일러: 유형 별명 "${t.name}" 이 ${where}에 있음`);
        String(t.word).split(',').forEach((w) => { if (hasWord(lang, text, w)) bad(`${tag} 스포일러: 결과 낱말 "${w.trim()}" 이 ${where}에 있음`); });
      });
      T.questions.forEach((q, qi) => { if (q.q.length > 8 && text.toLowerCase().includes(q.q.toLowerCase())) bad(`${tag} 스포일러: Q${qi + 1} 문구가 ${where}에 인용됨`); });
    });
    if (g && !/Myers-Briggs/.test(JSON.stringify(g))) bad(`${tag} 가이드에 비공식 안내(Myers-Briggs) 없음`);
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
  if (!/<link rel="canonical" href="https:\/\/mbti\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (!/<meta property="og:image" content="https:\/\/mbti\.example\.com\/og\/[^"]+\.png">/.test(html)) bad(`${tag} og:image 없음`);
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
    if (/^https:\/\/mbti\.example\.com\//.test(u)) u = '/' + u.replace(/^https:\/\/mbti\.example\.com\//, '');
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
  if (!r.includes(`<div data-mg-end="mbti"></div>`)) bad(`${rt} data-mg-end 없음`);
  if (!/window\.MG_FAQ = \[/.test(r)) bad(`${rt} MG_FAQ 없음`);
  if (!/window\.MBTI_RESULT = /.test(r)) bad(`${rt} MBTI_RESULT 없음`);
  if (/class="mg-ad"/.test(r)) bad(`${rt} 결과 페이지에 따로 둔 mg-ad (끝 화면이 이미 포함)`);
  const endAt = r.indexOf('data-mg-end="mbti"'), cardAt = r.indexOf('class="mb-card"'), discAt = r.indexOf('class="mb-disclaimer"');
  if (!(cardAt > 0 && discAt > cardAt && endAt > discAt)) bad(`${rt} 결과 카드 → 비공식 안내 → 끝 화면 순서가 아님`);
  if (!r.includes(G.esc(T.result.disclaimer))) bad(`${rt} 비공식 안내 문구 없음`);
  if (!/<div id="axis-bars" class="mb-bars" hidden>/.test(r) || (r.match(/data-axis="\d"/g) || []).length !== 4) bad(`${rt} 축 막대(처음엔 숨김, 4줄) 없음`);
  const meta = CORE.TYPES[id];
  if (!r.includes(`<span class="mb-result-code">${meta.code}</span>`)) bad(`${rt} 유형 코드가 h1 에 없음`);
  const t = T.types[id];
  [t.name, t.desc, t.vibe, t.work, t.love, ...t.strengths, ...t.blind].forEach((s) => { if (!r.includes(G.esc(s))) bad(`${rt} 자기 결과 문구가 없음: ${s.slice(0, 20)}`); });
  const others = [...new Set(resultTargets(rf, r))].filter((x) => x !== id);
  if (others.length) bad(`${rt} 다른 결과 페이지로 가는 링크/주소(${others.join(', ')}) — 찰떡궁합·상극도 링크 금지`);
  const pair = (r.match(/<div class="mb-pair">[\s\S]*?<p class="mb-disclaimer"/) || [''])[0];
  if (!pair.includes('<div class="mb-pair-card mb-pair-best"') || !pair.includes('<div class="mb-pair-card mb-pair-clash"')) bad(`${rt} 찰떡궁합·상극 카드(링크 아닌 div)가 없음`);
  if (/<a[\s>]|<button|onclick|tabindex|role="(?:button|link)"/.test(pair)) bad(`${rt} 찰떡궁합·상극 카드에 누를 수 있는 요소`);
  if (!pair.includes(G.esc(T.types[meta.best].name)) || !pair.includes(G.esc(T.types[meta.clash].name))) bad(`${rt} 찰떡궁합·상극 이름이 맞지 않음`);
  if (!pair.includes(`>${CORE.TYPES[meta.best].code}<`) || !pair.includes(`>${CORE.TYPES[meta.clash].code}<`)) bad(`${rt} 찰떡궁합·상극 코드가 맞지 않음`);
  CORE.ORDER.forEach((o) => {
    if (o === id) return;
    const ot = T.types[o];
    if (r.includes(G.esc(ot.desc).slice(0, 40)) || r.includes(G.esc(ot.vibe)) || r.includes(G.esc(ot.work).slice(0, 40))) bad(`${rt} 다른 결과(${o}) 설명 문구가 있음`);
    if (o !== meta.best && o !== meta.clash) {
      if (r.includes(`>${G.esc(ot.name)}<`)) bad(`${rt} 찰떡궁합·상극이 아닌 결과(${o}) 별명이 있음`);
      if (new RegExp(`(?<![A-Za-z])${CORE.TYPES[o].code}(?![A-Za-z])`).test(r)) bad(`${rt} 찰떡궁합·상극이 아닌 결과 코드(${CORE.TYPES[o].code})가 있음`);
    }
  });
  if (!r.includes('id="share-cta"')) bad(`${rt} "테스트 해 보기" CTA 없음`);
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
      const body = html.slice(html.indexOf('<body'));
      const cm = body.match(CODE_RE);
      if (cm) bad(`${tag} index 에 유형 코드 "${cm[0]}" (스포일러)`);
      const startText = start.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
      CORE.ORDER.forEach((id) => {
        const t = T.types[id];
        if (html.includes(G.esc(t.name)) || html.includes(JSON.stringify(t.name).slice(1, -1))) bad(`${tag} index 에 결과 별명 "${t.name}"`);
        if (html.includes(G.esc(t.vibe)) || html.includes(t.desc.slice(0, 40))) bad(`${tag} index 에 결과(${id}) 문구가 실려 있음`);
      });
      Object.values(CORE.GROUPS).forEach((g) => { if (html.toLowerCase().includes(g.color.toLowerCase())) bad(`${tag} index 에 결과 그룹 색(${g.color}) 이 실려 있음`); });
      T.questions.forEach((q, qi) => { if (startText.includes(G.esc(q.q))) bad(`${tag} 시작 화면에 Q${qi + 1} 인용`); });
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (/href="[^"]*r\/[a-z]+\.html"/.test(html)) bad(`${tag} index 에 결과 페이지 링크`);
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
  const appJs = read('mbti.js');
  if (!/track\('start'\)/.test(appJs) || !/track\('done'\)/.test(appJs)) bad("mbti.js: track('start') / track('done') 없음");
  const resJs = read('result.js');
  if (!/setShareData/.test(resJs) || !/setRetry/.test(resJs)) bad('result.js: setShareData / setRetry 없음');
  // 찰떡궁합·상극 카드가 누를 수 있어 보이지 않게
  const css = read('style.css');
  const pairCss = css.split('\n').filter((l) => /mb-pair/.test(l)).join('\n');
  if (/cursor:\s*pointer|:hover/.test(pairCss)) bad('style.css: 찰떡궁합·상극 카드에 pointer/hover 모양이 있음');
  // sitemap
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  const want = (1 + CORE.ORDER.length) * G.LOCALES.length;
  if (urls !== want) bad(`sitemap.xml URL ${urls} ≠ ${want}`);
  if (!sm.includes('https://mbti.example.com/r/intj.html') || !sm.includes('https://mbti.example.com/ko/')) bad('sitemap.xml 주소가 이상함');
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
  if (mb > 30) bad(`OG 이미지 전체 ${mb.toFixed(1)}MB (30MB 이하로)`);
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
console.log('\n결과: 통과 — 16종 모두 도달·분포 5.5%~7%, 축 비율 인코딩, 언어 파일 구조·스포일러·FAQ·비공식 안내·폭 예산, 생성 HTML(SEO·타이틀 바·끝 화면·광고 위치(시작 화면 맨 끝 1개 포함)·결과 페이지 링크 0), OG 이미지 모두 OK');
