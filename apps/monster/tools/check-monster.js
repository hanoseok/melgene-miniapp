#!/usr/bin/env node
/**
 * 할로윈 몬스터 테스트 검사.
 *   1) 채점: 모든 답 조합(4^8×3^2 = 589,824가지)을 전부 채점해 12종이 모두 나오는지 + 무작위 200,000회 시뮬레이션에서
 *      각 유형이 3%~15% 안인지. 같은 답은 언제나 같은 결과인지(결정적), 가중치·단짝·라이벌 id 가 맞는지.
 *   2) 언어 파일 12개(shared/i18n.js LOCALES): en.js 와 키 구조가 완전히 같은지(배열 길이 포함), 문항·보기 수가 monster-core.js 와 같은지,
 *      자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?" 류 금지), 한국어가 아닌 파일에 한글이 남았는지,
 *      스포일러(메타·OG 기본·시작 화면·FAQ 에 몬스터 이름/질문 인용 금지), 360px 폭 예산.
 *      // TODO-TRANSLATE 표시가 남은 파일은 (참고)로 알려 준다(실패 아님).
 *   3) 생성된 HTML: title / h1 하나 / hreflang 12개 / canonical / 타이틀 바 / index 의 appLd(WebApplication) /
 *      결과 페이지의 data-mg-end + MG_FAQ / FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·질문·결과 없음 / 질문 화면 mg-ad 1개 /
 *      index 에 결과 문구가 실려 있지 않은지 / 결과 페이지가 자기 결과 + 단짝·라이벌(보여주기만, 링크 없음)만 담는지.
 *   4) sitemap.xml URL 수, OG 이미지(언어 × (default + 12종)) 가 1200×630 PNG 인지.
 *
 * 실행: node tools/check-monster.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'monster-core.js'));
const L10N = G.loadSiteLocales(SITE);

const TRIALS = 200000;
const LO = 0.03;
const HI = 0.15;
const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 채점
function checkCore() {
  const ids = new Set(CORE.ORDER);
  if (ids.size !== 12) bad(`유형 수 ${ids.size} ≠ 12`);
  CORE.ORDER.forEach((id) => {
    const t = CORE.TYPES[id];
    if (!t) return bad(`TYPES.${id} 없음`);
    ['best', 'rival'].forEach((k) => { if (!ids.has(t[k]) || t[k] === id) bad(`TYPES.${id}.${k} = ${t[k]} (잘못된 id)`); });
    if (!/^#[0-9a-f]{6}$/i.test(t.color)) bad(`TYPES.${id}.color`);
    if (!t.emoji) bad(`TYPES.${id}.emoji 없음`);
  });
  if (CORE.QUESTIONS.length < 8 || CORE.QUESTIONS.length > 12) bad(`문항 수 ${CORE.QUESTIONS.length} (8~12)`);
  CORE.QUESTIONS.forEach((q, qi) => {
    if (q.choices.length < 3 || q.choices.length > 4) bad(`Q${qi + 1} 보기 수 ${q.choices.length} (3~4)`);
    q.choices.forEach((w, ci) => Object.keys(w).forEach((id) => { if (!ids.has(id)) bad(`Q${qi + 1}-${ci + 1} 모르는 유형 ${id}`); }));
  });
  // poll 슬롯: 12종이 서로 다른 (qid, opt) 에 들어가고 opt 는 0~9
  const slots = new Set(CORE.ORDER.map((id) => { const s = CORE.pollSlot(id); if (s.opt < 0 || s.opt > 9) bad(`pollSlot ${id} opt ${s.opt}`); return s.qid + ':' + s.opt; }));
  if (slots.size !== 12) bad('pollSlot 이 겹침');
  const back = CORE.pollCounts(CORE.ORDER.map((id, i) => ({ qid: CORE.pollSlot(id).qid, option: CORE.pollSlot(id).opt, votes: i + 1 })));
  if (!back || back.total !== 78 || CORE.ORDER.some((id, i) => back.counts[id] !== i + 1)) bad('pollCounts 가 pollSlot 과 맞지 않음');

  // 전수 조사
  const sizes = CORE.QUESTIONS.map((q) => q.choices.length);
  const all = {}; CORE.ORDER.forEach((id) => { all[id] = 0; });
  let combos = 0;
  const a = new Array(sizes.length).fill(0);
  for (;;) {
    all[CORE.score(a)]++; combos++;
    let i = a.length - 1;
    while (i >= 0 && ++a[i] === sizes[i]) { a[i] = 0; i--; }
    if (i < 0) break;
  }
  // 무작위
  const rnd = {}; CORE.ORDER.forEach((id) => { rnd[id] = 0; });
  let nondet = 0;
  for (let t = 0; t < TRIALS; t++) {
    const ans = sizes.map((n) => (Math.random() * n) | 0);
    const r = CORE.score(ans);
    if (t < 2000 && CORE.score(ans.slice()) !== r) nondet++;
    rnd[r]++;
  }
  if (nondet) bad(`같은 답인데 결과가 달라짐 ${nondet}건`);
  const names = L10N.en.types;
  console.log(`\n=== 몬스터 분포: 전수 ${combos.toLocaleString()}가지 / 무작위 ${TRIALS.toLocaleString()}회 (기준 ${LO * 100}%~${HI * 100}%) ===\n`);
  CORE.ORDER.forEach((id) => {
    const pa = all[id] / combos, pr = rnd[id] / TRIALS;
    const flag = pr < LO || pr > HI || !all[id] ? '  <-- 범위 밖!' : '';
    console.log(`${(CORE.TYPES[id].emoji + ' ' + names[id].name).padEnd(26)} 전수 ${(pa * 100).toFixed(2).padStart(6)}%  무작위 ${(pr * 100).toFixed(2).padStart(6)}%  ${'█'.repeat(Math.round(pr * 200))}${flag}`);
    if (!all[id]) bad(`${id} 는 어떤 답으로도 나오지 않음`);
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
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.66;
    else if (/[а-яё]/.test(ch)) w += 0.6; // 키릴 소문자는 라틴보다 조금 넓다(ж ш щ ы ю м)
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[.,:;!?'’"“”«»()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.55;
  }
  return w;
}
// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 40, size: 20 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 28, size: 14 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 15 * 1.12, hard: true, what: 'h1 검색어 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.bestLabel', get: (T) => T.result.bestLabel, px: (328 - 10) / 2 - 16, size: 13 * 1.08, hard: false, what: '단짝 라벨 한 줄' },
  { key: 'result.rivalLabel', get: (T) => T.result.rivalLabel, px: (328 - 10) / 2 - 16, size: 13 * 1.08, hard: false, what: '라이벌 라벨 한 줄' },
];
// Google Fonts 메타데이터(subsets 에 cyrillic)로 확인한 둥근 제목 글꼴
const CYRILLIC_LANGS = ['ru'];
const CYRILLIC_DISPLAY = ['Nunito', 'Rubik', 'Comfortaa', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|бесплатн/i;

function checkLocales() {
  const base = new Set(shape(L10N.en));
  const todo = [];
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) todo.push(lang);
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
    }
    // 문항·유형
    if (!Array.isArray(T.questions) || T.questions.length !== CORE.QUESTIONS.length) bad(`${tag} 문항 수 ≠ ${CORE.QUESTIONS.length}`);
    else CORE.QUESTIONS.forEach((q, qi) => {
      const lq = T.questions[qi];
      if (!lq.q) bad(`${tag} Q${qi + 1} 질문 비어 있음`);
      if (!Array.isArray(lq.choices) || lq.choices.length !== q.choices.length) bad(`${tag} Q${qi + 1} 보기 수 ≠ ${q.choices.length}`);
      else if (lq.choices.some((c) => !c)) bad(`${tag} Q${qi + 1} 빈 보기`);
    });
    CORE.ORDER.forEach((id) => {
      const t = T.types && T.types[id];
      if (!t) return bad(`${tag} types.${id} 없음`);
      ['name', 'catch', 'desc', 'party'].forEach((k) => { if (!t[k]) bad(`${tag} types.${id}.${k} 비어 있음`); });
      if (!Array.isArray(t.strengths) || t.strengths.length !== 3 || t.strengths.some((s) => !s)) bad(`${tag} types.${id}.strengths 는 3개`);
    });
    Object.keys(T.types || {}).forEach((id) => { if (!CORE.TYPES[id]) bad(`${tag} 모르는 유형 ${id}`); });
    // 자리표시자·FAQ·글꼴
    if (!/\{name\}/.test(T.result.title)) bad(`${tag} result.title 에 {name} 없음`);
    ['{name}', '{emoji}', '{catch}'].forEach((ph) => { if (!T.result.shareText.includes(ph)) bad(`${tag} result.shareText 에 ${ph} 없음`); });
    if (!T.result.sameShare.includes('{pct}')) bad(`${tag} result.sameShare 에 {pct} 없음`);
    if (!T.quiz.qLabel.includes('{n}')) bad(`${tag} quiz.qLabel 에 {n} 없음`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
    });
    if (!T.fonts || !T.fonts.css || !T.fonts.display) bad(`${tag} fonts.css / fonts.display 없음`);
    // 키릴 문자 언어: 제목 글꼴(첫 번째)이 Google Fonts 에서 cyrillic 부분 집합이 있는 글꼴이어야 한다(Baloo 2 에는 없음 → 두부 글자)
    if (CYRILLIC_LANGS.includes(lang) && T.fonts && !CYRILLIC_DISPLAY.includes(String(T.fonts.display).split(',')[0].replace(/['"]/g, '').trim())) bad(`${tag} fonts.display "${T.fonts.display}" 는 키릴 문자를 지원하는 글꼴이 아님 (${CYRILLIC_DISPLAY.join(', ')})`);
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.includes(T.start.h1Kicker) && !T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) warn(`${tag} meta.title 이 h1Kicker(검색어)를 담지 않음`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    // 스포일러: 시작 전 문구에 몬스터 이름·질문·보기 금지
    const pre = JSON.stringify([T.meta, T.siteName, T.start, T.faq, T.og.brand, T.og.defaultKicker, T.og.defaultTitle, T.og.defaultDesc]).toLowerCase();
    CORE.ORDER.forEach((id) => {
      const name = T.types[id].name.toLowerCase();
      if (pre.includes(name)) bad(`${tag} 스포일러: 몬스터 이름 "${T.types[id].name}" 이 메타/시작 화면/FAQ/기본 OG 에 있음`);
    });
    T.questions.forEach((q, qi) => [q.q, ...q.choices].forEach((s) => {
      if (s.length > 8 && pre.includes(s.toLowerCase())) bad(`${tag} 스포일러: Q${qi + 1} 문구가 시작 전 문구에 인용됨`);
    }));
    // 폭 예산
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const need = emWidth(v) * b.size;
      if (need > b.px) (b.hard ? bad : warn)(`${tag} ${b.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(b.px)}px (${b.what})`);
    });
  });
  if (todo.length) warn(`번역 대기(// TODO-TRANSLATE): ${todo.join(', ')} — 지금은 en 문구 사본`);
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function commonHtml(tag, html) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/<link rel="canonical" href="https:\/\/monster\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (!/<meta property="og:image" content="https:\/\/monster\.example\.com\/og\/[^"]+\.png">/.test(html)) bad(`${tag} og:image 없음`);
}
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  return m ? m[0] : '';
}

function checkHtml() {
  let pages = 0;
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    // index
    const f = G.fileOf(lang, 'index.html');
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
    if (/data-mg-end|mg-faq|more-test/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/다른 테스트`);
    if ((quiz.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 질문 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 질문 화면의 1개뿐이어야 함`);
    if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
    const startText = start.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ');
    CORE.ORDER.forEach((id) => {
      if (startText.toLowerCase().includes(T.types[id].name.toLowerCase())) bad(`${tag} 시작 화면에 결과 이름 "${T.types[id].name}"`);
      // index 에는 결과 문구(설명·한 줄 소개)를 싣지 않는다
      if (html.includes(G.esc(T.types[id].catch)) || html.includes(JSON.stringify(T.types[id].catch).slice(1, -1)) || html.includes(T.types[id].desc.slice(0, 40))) bad(`${tag} index 에 결과(${id}) 문구가 실려 있음`);
    });
    T.questions.forEach((q, qi) => { if (startText.includes(G.esc(q.q))) bad(`${tag} 시작 화면에 Q${qi + 1} 인용`); });
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    // 결과 페이지
    CORE.ORDER.forEach((id) => {
      const rf = G.fileOf(lang, `r/${id}.html`);
      const r = read(rf);
      const rt = `[${lang}] ${rf}`;
      commonHtml(rt, r);
      pages++;
      if (!r.includes(`<div data-mg-end="monster"></div>`)) bad(`${rt} data-mg-end 없음`);
      if (!/window\.MG_FAQ = \[/.test(r)) bad(`${rt} MG_FAQ 없음`);
      if (!/window\.MON_RESULT = /.test(r)) bad(`${rt} MON_RESULT 없음`);
      if (/class="mg-ad"/.test(r)) bad(`${rt} 결과 페이지에 따로 둔 mg-ad (끝 화면이 이미 포함)`);
      const endAt = r.indexOf('data-mg-end="monster"'), cardAt = r.indexOf('class="mon-card"');
      if (!(cardAt > 0 && endAt > cardAt)) bad(`${rt} 결과 카드 → 끝 화면 순서가 아님`);
      if (!r.includes(G.esc(T.types[id].name)) || !r.includes(G.esc(T.types[id].desc))) bad(`${rt} 자기 결과가 없음`);
      const allowed = new Set([id, CORE.TYPES[id].best, CORE.TYPES[id].rival]);
      // 단짝·라이벌은 보여주기만 한다 — 다른 결과 페이지로 가는 링크는 하나도 없어야 한다(스포일러 금지)
      const links = [...r.matchAll(/href="(?:\.\/)?([a-z]+)\.html"/g)].map((m) => m[1]).filter((l) => CORE.TYPES[l] && l !== id); // 자기 자신(언어 링크)은 괜찮다
      if (links.length) bad(`${rt} 다른 결과 페이지로 가는 링크(${links.join(', ')}) — 단짝·라이벌도 링크 금지`);
      if (!r.includes(`<div class="mon-pair-card mon-pair-best"`) || !r.includes(`<div class="mon-pair-card mon-pair-rival"`)) bad(`${rt} 단짝·라이벌 카드(링크 아닌 div)가 없음`);
      CORE.ORDER.forEach((o) => { if (!allowed.has(o) && (r.includes(G.esc(T.types[o].catch)) || r.includes(T.types[o].desc.slice(0, 40)))) bad(`${rt} 다른 결과(${o}) 문구가 있음`); });
      if (!r.includes(`id="share-cta"`) || !r.includes(`href="${G.relHref(rf, G.fileOf(lang, 'index.html'))}"`)) bad(`${rt} "테스트 해 보기" CTA 없음`);
    });
    // 개인정보
    commonHtml(`[${lang}] privacy`, read(G.fileOf(lang, 'privacy.html')));
    pages++;
  });
  // sitemap
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  const want = (1 + CORE.ORDER.length) * G.LOCALES.length;
  if (urls !== want) bad(`sitemap.xml URL ${urls} ≠ ${want}`);
  if (!sm.includes('https://monster.example.com/r/vampire.html') || !sm.includes('https://monster.example.com/ko/')) bad('sitemap.xml 주소가 이상함');
  return pages;
}

// ---------------------------------------------------------------- 4) OG 이미지
function checkOg() {
  let n = 0;
  G.LOCALES.forEach(({ code, dir }) => {
    ['default', ...CORE.ORDER].forEach((name) => {
      const f = path.join(SITE, 'og', dir, `${name}.png`);
      if (!fs.existsSync(f)) return bad(`OG 없음: og/${dir ? dir + '/' : ''}${name}.png (node tools/gen-og.js all)`);
      const b = fs.readFileSync(f);
      if (b.toString('ascii', 1, 4) !== 'PNG' || b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) bad(`OG 크기/형식: ${path.relative(SITE, f)}`);
      n++;
    });
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
console.log('\n결과: 통과 — 12종 모두 도달·분포 3%~15%, 언어 파일 구조·스포일러·FAQ·폭 예산, 생성 HTML(SEO·타이틀 바·끝 화면·광고 위치(시작 화면 맨 끝 1개 포함)), OG 이미지 모두 OK');
