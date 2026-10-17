#!/usr/bin/env node
/**
 * 소비 성향 테스트 검사 (tools/check-all.js 가 자동으로 돌린다, cwd = apps/spend).
 *   1) 채점: 모든 답 조합(4^12 = 16,777,216가지)을 전부 채점해 8종이 모두 나오는지 + 각 결과가 10%~17%
 *      (전수·무작위 200,000회 모두), 같은 답 → 같은 결과(결정적), 문항 12개·보기 4개(네 축이 하나씩),
 *      축마다 각 보기 위치에 3번씩(위치 편향 없음), 축 % 합 = 100, 색·이모지, poll 인코딩(r0, 보기 0~7).
 *   2) 언어 파일 12개: en.js 와 키 구조가 완전히 같은지, 문항·보기 수, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?" 류 금지),
 *      한국어가 아닌 파일에 한글, 글꼴, 스포일러(메타·시작 화면·FAQ·기본 OG·app.config 제목/설명에 결과 이름·낱말·질문 인용 금지),
 *      360px 폭 예산, 결과 문구에 숫자·% 없음(숫자는 내 답으로 계산한 비율과 서버 실제 비율뿐), 재미용·재무 조언 아님 안내.
 *   3) 생성된 HTML(언어 폴더 + 숨은 사본 _l/): title / h1 하나 / hreflang 13개 / canonical / 타이틀 바 / index 의 appLd /
 *      FAQPage JSON-LD 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·끝 화면 없음 / 질문 화면 mg-ad 1개 /
 *      index 에 결과 문구 없음 / 결과 페이지 = 자기 결과 + 비율 막대 자리(숨김, 숫자 없음)·강점·조심할 점·팁·재미용 안내
 *      + data-mg-end + MG_FAQ, 다른 결과 페이지로 가는 href·이름 0개. spend.js 의 track('start')/track('done').
 *   4) sitemap.xml URL 수, OG 이미지(언어 × (default + 8종))가 1200×630 PNG 인지 + 전체 용량.
 *
 * 실행: node tools/check-spend.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'spend-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);
const TODO = G.todoLocales(SITE);

const TRIALS = 200000;
const LO = 0.10;
const HI = 0.17;
const problems = [];
const warns = [];
const bad = (m) => (G.isTodoMessage(m, TODO) ? warns : problems).push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 채점
function checkCore() {
  const ids = new Set(CORE.ORDER);
  if (ids.size !== 8) bad(`유형 수 ${ids.size} ≠ 8`);
  CORE.ORDER.forEach((id) => {
    const t = CORE.TYPES[id];
    if (!t) return bad(`TYPES.${id} 없음`);
    ['color', 'deep', 'ink'].forEach((k) => { if (!/^#[0-9a-f]{6}$/i.test(t[k])) bad(`TYPES.${id}.${k} 색`); });
    if (!t.emoji) bad(`TYPES.${id}.emoji 없음`);
  });
  const colorSet = new Set(CORE.ORDER.map((id) => CORE.TYPES[id].color.toLowerCase()));
  if (colorSet.size !== 8) bad('결과 색이 겹침');
  if (CORE.QUESTIONS.length !== 12) bad(`문항 수 ${CORE.QUESTIONS.length} (12)`);
  const pos = [0, 1, 2, 3].map(() => [0, 0, 0, 0]); // pos[축][위치]
  CORE.QUESTIONS.forEach((q, qi) => {
    if (!Array.isArray(q.v) || q.v.length !== 4) return bad(`Q${qi + 1} 보기 수 (4)`);
    if (q.v.slice().sort().join() !== '0,1,2,3') bad(`Q${qi + 1} 네 축이 하나씩이어야 함: ${q.v}`);
    q.v.forEach((a, j) => { pos[a][j]++; });
    if (!q.emoji) bad(`Q${qi + 1} emoji 없음`);
  });
  pos.forEach((row, a) => row.forEach((n, j) => { if (n !== 3) bad(`축 ${a} 가 보기 ${j + 1}번 위치에 ${n}번 (정확히 3번이어야 위치 편향이 없음)`); }));
  const slots = new Set(CORE.ORDER.map((id) => { const s = CORE.pollSlot(id); if (s.qid !== 'r0' || s.opt < 0 || s.opt > 9) bad(`pollSlot ${id}`); return s.opt; }));
  if (slots.size !== 8) bad('pollSlot 이 겹침');
  if (!/^[a-z0-9-]{1,32}$/.test(CORE.POLL)) bad('POLL id 모양');
  const back = CORE.pollCounts(CORE.ORDER.map((id, i) => ({ qid: 'r0', option: CORE.pollSlot(id).opt, votes: i + 1 })).concat([{ qid: 'x', option: 0, votes: 99 }]));
  if (!back || back.total !== 36 || CORE.ORDER.some((id, i) => back.counts[id] !== i + 1)) bad('pollCounts 가 pollSlot 과 맞지 않음');
  if (CORE.pollCounts(null) !== null) bad('pollCounts(null) 은 null');
  // 극단 답: 전부 한 축 → 그 축의 단일 유형, 비율 100/0/0/0
  const SINGLE = ['saver', 'value', 'flex', 'impulse'];
  for (let a = 0; a < 4; a++) {
    const r = CORE.result(CORE.QUESTIONS.map((q) => q.v.indexOf(a)));
    if (r.id !== SINGLE[a]) bad(`전부 축 ${a} → ${r.id} (${SINGLE[a]} 여야 함)`);
    if (r.pct[a] !== 100 || r.pct.reduce((x, y) => x + y, 0) !== 100) bad(`전부 축 ${a} 비율 ${r.pct}`);
  }
  const V = CORE.QUESTIONS.map((q) => q.v);
  const QN = V.length;
  const all = {};
  CORE.ORDER.forEach((id) => { all[id] = 0; });
  let combos = 0;
  // 전수 조사: 4^12 가지를 실제 보기 → 축 배열로 재귀 (축별 횟수 c 를 모아서 CORE.classify)
  const c = [0, 0, 0, 0];
  (function rec(q) {
    if (q === QN) { all[CORE.classify(c)]++; combos++; return; }
    const vs = V[q];
    for (let j = 0; j < 4; j++) { c[vs[j]]++; rec(q + 1); c[vs[j]]--; }
  })(0);
  if (combos !== 16777216) bad(`전수 조합 수 ${combos}`);
  // 무작위 + 결정성 + 전수 코드(classify)와 CORE.result 일치 + 비율 합 100
  const rnd = {}; CORE.ORDER.forEach((id) => { rnd[id] = 0; });
  let nondet = 0, mismatch = 0, badPct = 0;
  for (let t = 0; t < TRIALS; t++) {
    const ans = CORE.QUESTIONS.map(() => (Math.random() * 4) | 0);
    const r = CORE.result(ans);
    if (t < 5000) {
      const r2 = CORE.result(ans.slice()); if (r2.id !== r.id || r2.pct.join() !== r.pct.join()) nondet++;
      const cc = [0, 0, 0, 0]; ans.forEach((ci, qi) => { cc[V[qi][ci]]++; });
      if (CORE.classify(cc) !== r.id || cc.join() !== r.c.join()) mismatch++;
      if (r.pct.reduce((x, y) => x + y, 0) !== 100 || r.pct.some((x, i) => Math.abs(x - (cc[i] * 100) / QN) >= 1)) badPct++;
      // 보기 순서를 섞어 답해도(같은 축 횟수) 같은 결과 — 순서 무관
      const perm = ans.map((ci, qi) => ({ qi, a: V[qi][ci] })).sort(() => Math.random() - 0.5);
      const cc2 = [0, 0, 0, 0]; perm.forEach((p) => { cc2[p.a]++; });
      if (CORE.classify(cc2) !== r.id) mismatch++;
    }
    rnd[r.id]++;
  }
  if (nondet) bad(`같은 답인데 결과가 달라짐 ${nondet}건`);
  if (mismatch) bad(`전수 계산과 CORE.result 가 다름 ${mismatch}건`);
  if (badPct) bad(`축 비율이 이상함 ${badPct}건 (합 100·실제 비율과 1%p 이내)`);
  const partial = CORE.result([0]);
  if (!ids.has(partial.id) || partial.pct.reduce((x, y) => x + y, 0) !== 100) bad('답이 모자랄 때 결과 없음');
  if (CORE.result([]).pct.join() !== '0,0,0,0') bad('답이 없을 때 비율은 모두 0');
  const names = L10N.en.types;
  console.log(`\n=== 결과 분포: 전수 ${combos.toLocaleString()}가지 / 무작위 ${TRIALS.toLocaleString()}회 (기준 ${LO * 100}%~${HI * 100}%) ===\n`);
  CORE.ORDER.forEach((id) => {
    const pa = all[id] / combos, pr = rnd[id] / TRIALS;
    const t = CORE.TYPES[id];
    const flag = pr < LO || pr > HI || pa < LO || pa > HI ? '  <-- 범위 밖!' : '';
    console.log(`${(t.emoji + ' ' + names[id].name).padEnd(28)} 전수 ${(pa * 100).toFixed(2).padStart(6)}%  무작위 ${(pr * 100).toFixed(2).padStart(6)}%  ${'█'.repeat(Math.round(pr * 200))}${flag}`);
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
    else if (ch === ' ' || ch === ' ' || ch === ' ') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.7; // Nunito 900 대문자
    else if (/[а-яё]/.test(ch)) w += 0.64;
    else if (/[0-9]/.test(ch)) w += 0.6;
    else if (/[.,:;!?'’"“”«»()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.6;
  }
  return w;
}
// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 45, size: 21 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 32, size: 15 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 17 * 1.08, hard: false, what: 'h1 검색어 줄 (두 줄도 괜찮음)' },
  { key: 'start.metaTime+metaCount', get: (T) => T.start.metaTime + T.start.metaCount, px: 328 - 64, size: 15 * 1.05, hard: false, what: '시간·문항 수 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.eyebrow', get: (T) => T.result.eyebrow, px: 328 - 36, size: 17 * 1.08, hard: false, what: '결과 윗줄' },
];
// Google Fonts 메타데이터(subsets 에 cyrillic)로 확인한 제목 글꼴
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
      if (!Array.isArray(lq.choices) || lq.choices.length !== 4) bad(`${tag} Q${qi + 1} 보기 수 ≠ ${4}`);
      else if (lq.choices.some((c) => !c)) bad(`${tag} Q${qi + 1} 빈 보기`);
    });
    CORE.ORDER.forEach((id) => {
      const t = T.types && T.types[id];
      if (!t) return bad(`${tag} types.${id} 없음`);
      ['name', 'word', 'vibe', 'desc', 'weakness', 'tip'].forEach((k) => { if (!t[k] || typeof t[k] !== 'string') bad(`${tag} types.${id}.${k} 비어 있음`); });
      if (!Array.isArray(t.strengths) || t.strengths.length !== 3 || t.strengths.some((s) => !s)) bad(`${tag} types.${id}.strengths 는 3개`);
      // 가짜 통계 금지: 결과 문구에 숫자·% 를 쓰지 않는다 — 숫자는 내 답으로 계산한 게이지 %와 서버 실제 값(result.sameShare)뿐
      const typeText = [t.name, t.vibe, t.desc, t.weakness, t.tip, ...(t.strengths || [])].join(' ');
      if (/[0-9０-９%٪]|[๐-๙]/.test(typeText)) bad(`${tag} types.${id} 결과 문구에 숫자·% (가짜 통계 금지 — 말로만): "${(typeText.match(/.{0,12}[0-9０-９%٪๐-๙].{0,12}/) || [''])[0]}"`);
    });
    Object.keys(T.types || {}).forEach((id) => { if (!CORE.TYPES[id]) bad(`${tag} 모르는 유형 ${id}`); });
    const names = CORE.ORDER.map((id) => T.types[id].name.toLowerCase());
    if (new Set(names).size !== names.length) bad(`${tag} 유형 이름이 겹침`);
    // 자리표시자·FAQ·글꼴
    if (!/\{name\}/.test(T.result.title)) bad(`${tag} result.title 에 {name} 없음`);
    ['{name}', '{emoji}', '{vibe}'].forEach((ph) => { if (!T.result.shareText.includes(ph)) bad(`${tag} result.shareText 에 ${ph} 없음`); });
    if (!T.result.metaDesc.includes('{name}') || !T.result.metaDesc.includes('{vibe}')) bad(`${tag} result.metaDesc 에 {name}/{vibe} 없음`);
    if (!T.result.sameShare.includes('{pct}')) bad(`${tag} result.sameShare 에 {pct} 없음`);
    ['{name}', '{emoji}', '{s}', '{v}', '{f}', '{i}'].forEach((ph) => { if (!T.result.shareTextPct.includes(ph)) bad(`${tag} result.shareTextPct 에 ${ph} 없음`); });
    if (!Array.isArray(T.result.axes) || T.result.axes.length !== 4 || T.result.axes.some((a) => !a)) bad(`${tag} result.axes 는 4개`);
    if (!T.result.disclaimer || /[0-9]/.test(T.result.disclaimer)) bad(`${tag} result.disclaimer(재미용·재무 조언 아님) 없음`);
    if (/[0-9]/.test(T.result.gaugeLabel)) bad(`${tag} result.gaugeLabel 에 숫자`);
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
    if (T.meta.title !== T.meta.title.trim() || !APP.title[lang]) bad(`${tag} app.config.js title 없음`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    if (lang === 'fr' && /[^  ][?!:;»]/.test(JSON.stringify([T.meta, T.start, T.faq, T.result, T.questions]).replace(/https?:\/\/|\\"|":|",|\{|\}/g, ''))) warn(`${tag} ? ! : ; » 앞에 좁은 줄바꿈 없는 공백이 없는 곳이 있음`);
    // 스포일러: 시작 전 문구(메타·시작 화면·FAQ·기본 OG·포털 카드)에 유형 이름·낱말·질문·보기 금지
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
  if (!/<link rel="canonical" href="https:\/\/spend\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (!/<meta property="og:image" content="https:\/\/spend\.example\.com\/og\/[^"]+\.png">/.test(html)) bad(`${tag} og:image 없음`);
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
    if (/^https:\/\/spend\.example\.com\//.test(u)) u = '/' + u.replace(/^https:\/\/spend\.example\.com\//, '');
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
  if (!r.includes(`<div data-mg-end="spend"></div>`)) bad(`${rt} data-mg-end 없음`);
  if (!/window\.MG_FAQ = \[/.test(r)) bad(`${rt} MG_FAQ 없음`);
  if (!/window\.SPEND_RESULT = /.test(r)) bad(`${rt} SPEND_RESULT 없음`);
  if (/class="mg-ad"/.test(r)) bad(`${rt} 결과 페이지에 따로 둔 mg-ad (끝 화면이 이미 포함)`);
  const endAt = r.indexOf('data-mg-end="spend"'), cardAt = r.indexOf('class="sp-card"');
  if (!(cardAt > 0 && endAt > cardAt)) bad(`${rt} 결과 카드 → 끝 화면 순서가 아님`);
  const t = T.types[id];
  [t.name, t.desc, t.vibe, t.weakness, t.tip, ...t.strengths].forEach((s) => { if (!r.includes(G.esc(s))) bad(`${rt} 자기 결과 문구가 없음: ${s.slice(0, 20)}`); });
  const meta = CORE.TYPES[id];
  const others = [...new Set(resultTargets(rf, r))].filter((x) => x !== id);
  if (others.length) bad(`${rt} 다른 결과 페이지로 가는 링크/주소(${others.join(', ')}) — 찰떡 케미/라이벌도 링크 금지`);
  if (!r.includes(`<p class="sp-disclaimer">${G.esc(T.result.disclaimer)}</p>`)) bad(`${rt} 재미용 안내(재무 조언 아님)가 없음`);
  CORE.ORDER.forEach((o) => {
    if (o === id) return;
    const ot = T.types[o];
    if (r.includes(G.esc(ot.desc).slice(0, 40)) || r.includes(G.esc(ot.vibe)) || r.includes(G.esc(ot.tip).slice(0, 40))) bad(`${rt} 다른 결과(${o}) 설명 문구가 있음`);
    if (r.includes(G.esc(ot.name))) bad(`${rt} 다른 결과(${o}) 이름이 있음`);
  });
  if (!r.includes('id="share-cta"')) bad(`${rt} "테스트 해 보기" CTA 없음`);
  // 게이지: 정적 HTML 에는 숨긴 빈 자리만(숫자는 result.js 가 내 답으로 채움 — 가짜 숫자 금지)
  const mix = (r.match(/<div id="mix" class="sp-mix" hidden>[\s\S]*?<\/div>\s*<p id="same-share"/) || [''])[0];
  if (!mix) bad(`${rt} 비율 막대 자리(숨김)가 없음`);
  else if (/[0-9]/.test(mix.replace(/<[^>]+>/g, '')) || /style="width/.test(mix) || (mix.match(/sp-mix-row/g) || []).length !== 4) bad(`${rt} 비율 막대: 4줄·미리 넣은 숫자 없음이어야 함`);
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
        if (html.toLowerCase().includes(CORE.TYPES[id].color.toLowerCase())) bad(`${tag} index 에 결과 색(${id}) 이 실려 있음`);
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
  const appJs = read('spend.js');
  if (!/track\('start'\)/.test(appJs) || !/track\('done'\)/.test(appJs)) bad("spend.js: track('start') / track('done') 없음");
  // 찰떡 케미/라이벌 카드가 누를 수 있어 보이지 않게
  const css = read('style.css');
  // sitemap
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  const want = (1 + CORE.ORDER.length) * G.LOCALES.length;
  if (urls !== want) bad(`sitemap.xml URL ${urls} ≠ ${want}`);
  if (!sm.includes('https://spend.example.com/r/saver.html') || !sm.includes('https://spend.example.com/ko/')) bad('sitemap.xml 주소가 이상함');
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
console.log('\n결과: 통과 — 8종 모두 도달·분포 10%~17%, 언어 파일 구조·스포일러·FAQ·폭 예산, 생성 HTML(SEO·타이틀 바·끝 화면·광고 위치(시작 화면 맨 끝 1개 포함)·결과 페이지 링크 0), OG 이미지 모두 OK');
