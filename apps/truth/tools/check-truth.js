#!/usr/bin/env node
/**
 * 진실 게임 검사.
 *   1) 로직(truth-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), Fisher–Yates(주입 난수), 입력 검사(모드·이름 2~20·
 *      이름 정리/중복·팩), 차례(한 바퀴에 모두 한 번씩, 바퀴 경계에서 같은 사람 연속 없음, 2~20명), 공정성 카이제곱
 *      (바퀴 첫 사람 고르게 · 새 바퀴 첫 사람은 직전 사람을 뺀 나머지에서 고르게 · 랜덤 진실/도전 반반),
 *      카드 덱(다 쓰기 전 반복 없음, 다시 섞을 때 바로 반복 없음, 빈 덱), 요약 숫자(recordTurn/recordSkip).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, 팩 4개 × 진실·도전 각 40장 이상(중복·HTML·길이),
 *      금지어(키스·술·성적·위험 — 모든 언어), 번역 여부, FAQ 3~5개(getRandomValues, "무료인가요?" 류 금지, 카드 인용 금지),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴(th/vi/ru/zh), 한글은 ko 파일만, 제목 = app.config title.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 순서(시작 → 진행 → 끝), 진행·끝 화면 처음 hidden, 끝 화면 마지막 = data-mg-end="truth", FAQ 는 MG_FAQ 로만,
 *      카드 문구는 PAGE_I18N 밖(보이는 HTML·메타)에 없음(스포일러), 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), 가이드 글에 카드 인용 없음, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, truth.js 규칙.
 *
 * 실행: node tools/check-truth.js   (tools/check-all.js 가 apps/truth 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'truth-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
// 카드에 들어가면 안 되는 말(키스·술·성적·위험) — 모든 언어. privacy·faq(“술 없음” 안내)는 빼고 본다.
const BANNED = /kiss|bisou|embrass|küss|beij|bacio|bacia|besa|beso|поцел|키스|뽀뽀|キス|亲吻|接吻|亲一|จูบ|\bhôn\b|alcohol|alcool|alkohol|алкогол|술을|술 마|음주|酒|เหล้า|\bbia\b|rượu|beer|bière|bier|cerveja|cerveza|birra|пиво|ビール|啤酒|맥주|wine|\bvin\b|wein|vinho|vino|вино|ワイン|葡萄酒|와인|vodka|водк|soju|소주|\bshots?\b|sex|секс|섹스|セックス|性爱|naked|nackt|\bnue?\b|desnud|pelad|голы|알몸|裸|เปลือย|khỏa thân|\bstrip|\blick|léch|lecc|lamer|лизн|핥|舐|舔|เลีย|liếm|drunk|ivre|betrunken|bêbad|borrach|ubriac|пьян|취하|酔|喝醉|เมา|\bsay\b rượu|cigar|zigarett|cigarro|sigaret|сигар|담배|タバコ|香烟|บุหรี่|thuốc lá|\bbra\b|underwear|unterwäsche|sous-vêtement|culotte|calcinha|ropa interior|mutande|трусы|нижнее бель|속옷|下着|内衣|ชุดชั้นใน|đồ lót/i;

// ---------------------------------------------------------------- 1) 로직
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32, 8: 26.12, 9: 27.88, 10: 29.59, 11: 31.26, 19: 43.82 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
const passed = [];
function checkLogic() {
  eq([CORE.MIN_PLAYERS, CORE.MAX_PLAYERS, CORE.MAX_NAME, CORE.MIN_CARDS], [2, 20, 16, 40], '한도');
  eq(CORE.PACKS, ['friends', 'family', 'work', 'couples'], '팩 4개');
  eq(CORE.TYPES, ['truth', 'dare'], '종류');
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');
  eq(CORE.shuffle([1, 2, 3, 4], (m) => m - 1), [1, 2, 3, 4], 'shuffle j=i 면 그대로');
  eq(CORE.shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1], 'shuffle j=0');

  // 입력 검사
  const v = (o) => CORE.validate(o);
  eq(v({}).error, 'namesTooFew', 'validate 기본 = 이름 넣기(이름 없음 → 오류)');
  eq(v({ mode: 'free' }).ok, true, '이름 없이');
  eq(v({ mode: 'free' }).cfg.pack, 'friends', '기본 팩 friends');
  eq(v({ mode: 'free', pack: 'work' }).cfg.pack, 'work', '팩 work');
  eq(v({ mode: 'free', pack: 'nope' }).cfg.pack, 'friends', '모르는 팩 → friends');
  eq(v({ mode: 'names', names: 'Solo' }).error, 'namesTooFew', '이름 1명');
  eq(v({ mode: 'names', names: Array.from({ length: 21 }, (_, i) => 'P' + i).join('\n') }).error, 'namesTooMany', '이름 21명');
  eq(v({ mode: 'names', names: Array.from({ length: 21 }, (_, i) => 'P' + i).join('\n') }).n, 21, '이름 21명 n');
  eq(v({ mode: 'names', names: Array.from({ length: 20 }, (_, i) => 'P' + i).join('\n') }).ok, true, '이름 20명');
  eq(v({ mode: 'names', names: 'Mina\nJoon\nMina\n \n' }).cfg.names, ['Mina', 'Joon', 'Mina 2'], '이름 중복 → " 2"');
  eq(v({ mode: 'names', names: 'A, B; C、D' }).cfg.names.length, 4, '이름 구분자');
  eq(v({ mode: 'names', names: '<b>Al</b>\nBo\u0007b' }).cfg.names, ['b Al /b', 'Bo b'], '이름 꺾쇠·제어 문자 정리');
  eq(v({ mode: 'names', names: 'x'.repeat(40) + '\nB' }).cfg.names[0].length, CORE.MAX_NAME, '이름 16자 제한');
  eq(v({ mode: 'free', names: 'Solo' }).ok, true, '이름 없이는 이름 검사 안 함');

  // 차례: 한 바퀴에 모두 한 번씩, 바퀴 경계 연속 없음 (2~20명, 바퀴 50번)
  for (let n = 2; n <= 20; n++) {
    const st = CORE.newTurns(n);
    let prev = -1;
    for (let c = 1; c <= 50; c++) {
      const got = [];
      for (let k = 0; k < n; k++) {
        const p = CORE.nextPlayer(st);
        if (p === prev) { bad(`차례 n=${n}: 같은 사람(${p})이 연속`); c = 99; break; }
        prev = p;
        got.push(p);
      }
      if (c > 50) break;
      if (got.slice().sort((a, b) => a - b).join() !== Array.from({ length: n }, (_, i) => i).join()) { bad(`차례 n=${n} 바퀴 ${c}: 모두 한 번씩이 아님 ${got.join(',')}`); break; }
      if (st.cycle !== c) { bad(`차례 n=${n}: cycle ${st.cycle} ≠ ${c}`); break; }
    }
  }
  eq(CORE.nextPlayer(null), -1, 'nextPlayer(null)');
  eq((() => { const s = CORE.newTurns(1); return [CORE.nextPlayer(s), CORE.nextPlayer(s)]; })(), [0, 0], '1명이면 계속 0');
  // 공정성: 첫 바퀴 첫 사람 고르게(n=5, 20)
  [5, 20].forEach((n) => {
    const c = new Array(n).fill(0);
    for (let k = 0; k < 2000 * n; k++) c[CORE.nextPlayer(CORE.newTurns(n))]++;
    const x = chi(c);
    if (x > CHI_001[n - 1]) bad(`공정성 첫 사람 n=${n}: 카이제곱 ${x.toFixed(2)}`); else passed.push(`첫사람${n}:${x.toFixed(1)}`);
  });
  // 공정성: 새 바퀴 첫 사람 = 직전 사람을 뺀 나머지에서 고르게 (n=5)
  {
    const n = 5;
    const c = new Array(n).fill(0);
    let wrong = 0;
    for (let k = 0; k < 20000; k++) {
      const st = CORE.newTurns(n);
      for (let i = 0; i < n; i++) CORE.nextPlayer(st);
      const last = st.last;
      const p = CORE.nextPlayer(st);
      if (p === last) wrong++;
      c[(p - last + n) % n]++;
    }
    if (wrong) bad(`새 바퀴 첫 사람이 직전 사람 ${wrong}번`);
    const x = chi(c.slice(1));
    if (x > CHI_001[3]) bad(`공정성 새 바퀴 첫 사람: 카이제곱 ${x.toFixed(2)}`); else passed.push(`새바퀴:${x.toFixed(1)}`);
  }
  // 바퀴 안 위치별로도 고르게(n=4, 2번째 바퀴의 마지막 사람)
  {
    const c = new Array(4).fill(0);
    for (let k = 0; k < 20000; k++) { const st = CORE.newTurns(4); let p; for (let i = 0; i < 8; i++) p = CORE.nextPlayer(st); c[p]++; }
    const x = chi(c); if (x > CHI_001[3]) bad(`공정성 2번째 바퀴 마지막: 카이제곱 ${x.toFixed(2)}`);
  }
  // 랜덤 = 반반
  eq([CORE.pickType('truth'), CORE.pickType('dare')], ['truth', 'dare'], 'pickType 고정');
  const tc = [0, 0];
  for (let k = 0; k < 20000; k++) tc[CORE.pickType('random') === 'truth' ? 0 : 1]++;
  const xr = chi(tc); if (xr > CHI_001[1]) bad(`랜덤 진실/도전 반반 아님: 카이제곱 ${xr.toFixed(2)}`); else passed.push(`랜덤:${xr.toFixed(1)}`);
  // 카드 덱
  const d = CORE.newDeck(42);
  const first = Array.from({ length: 42 }, () => CORE.nextCard(d));
  eq(first.slice().sort((a, b) => a - b), Array.from({ length: 42 }, (_, i) => i), '덱: 한 바퀴에 42장 모두 한 번씩');
  let rep = false;
  let last = first[41];
  for (let k = 0; k < 4200; k++) { const nx = CORE.nextCard(d); if (nx === last) rep = true; last = nx; }
  if (rep) bad('덱: 같은 카드가 연속으로 나옴');
  if (d.laps < 100) bad(`덱: 다시 섞은 횟수 ${d.laps}`);
  eq(CORE.nextCard(CORE.newDeck(0)), -1, '빈 덱');
  eq(CORE.nextCard(null), -1, '덱 없음');
  const ds = CORE.newDecks({ truth: [1, 2, 3], dare: [1] });
  eq([ds.truth.len, ds.dare.len], [3, 1], 'newDecks');
  // 첫 카드 고르게(덱 10장)
  const fc = new Array(10).fill(0);
  for (let k = 0; k < 20000; k++) fc[CORE.nextCard(CORE.newDeck(10))]++;
  const xf = chi(fc); if (xf > CHI_001[9]) bad(`덱 첫 카드 치우침: 카이제곱 ${xf.toFixed(2)}`);
  // 요약 숫자
  const s = CORE.newStats();
  CORE.recordTurn(s, 'truth', false); CORE.recordTurn(s, 'dare', true); CORE.recordTurn(s, 'dare', false); CORE.recordSkip(s);
  eq(s, { rounds: 3, truths: 1, dares: 2, skips: 1, randoms: 1 }, '요약 숫자');
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(val) {
  if (Array.isArray(val)) return 'array';
  if (val && typeof val === 'object') return Object.keys(val).sort().reduce((o, k) => (o[k] = shape(val[k]), o), {});
  return typeof val;
}
function keysDiff(a, b, p, out) {
  if (typeof a !== typeof b || (typeof a === 'string' && a !== b)) { out.push(`${p || '(루트)'} 모양 다름`); return; }
  if (typeof a !== 'object') return;
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    if (!(k in b)) out.push(`${p}${k} 없음`);
    else if (!(k in a)) out.push(`${p}${k} 이 더 있음`);
    else keysDiff(a[k], b[k], `${p}${k}.`, out);
  });
}
function tokens(s) { return (String(s).match(/\{\w+\}/g) || []).sort().join(','); }
function walk(obj, fn, p = '') {
  if (typeof obj === 'string') return fn(obj, p);
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, val]) => walk(val, fn, p ? `${p}.${k}` : k));
}
const get = (o, p) => p.split('.').reduce((a, k) => a && a[k], o);
const allCards = (T) => CORE.PACKS.flatMap((k) => CORE.TYPES.flatMap((t) => (T.packs[k] && T.packs[k][t]) || []));
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  if (langFiles.length !== G.LOCALES.length) bad(`언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    if (/TODO-TRANSLATE/.test(first)) bad(`${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shape(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => { if (/^(privacy|faq|packs)\./.test(p)) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.start', 'ui.truth', 'ui.dare', 'ui.next', 'end.again', 'errors.namesTooFew'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구
    const W = [['ui.start', 26], ['ui.modeNames', 18], ['ui.modeFree', 18], ['ui.truth', 12], ['ui.dare', 12], ['ui.random', 12], ['ui.skip', 18], ['ui.next', 28], ['ui.nextFree', 28],
      ['ui.finish', 12], ['ui.round', 14], ['ui.turnKicker', 24], ['ui.turnFree', 24], ['ui.choose', 28], ['ui.playersLabel', 34], ['ui.packLabel', 34],
      ['end.again', 24], ['end.edit', 34], ['end.rounds', 20], ['end.truths', 20], ['end.dares', 20], ['end.skips', 20], ['end.kicker', 30], ['end.title', 34]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    CORE.PACKS.forEach((k) => {
      if (width(T.ui.packs[k].name) > 16) bad(`${tag} ui.packs.${k}.name 가 김`);
      if (width(T.ui.packs[k].desc) > 34) bad(`${tag} ui.packs.${k}.desc 가 김`);
    });
    // 카드: 팩 4개 × 진실·도전 각 40장 이상, 중복·HTML 없음, 140자 이하, 금지어 없음
    CORE.PACKS.forEach((k) => CORE.TYPES.forEach((t) => {
      const arr = get(T, `packs.${k}.${t}`);
      if (!Array.isArray(arr) || arr.length < CORE.MIN_CARDS) { bad(`${tag} packs.${k}.${t} ${arr && arr.length}장 (${CORE.MIN_CARDS}장 이상)`); return; }
      if (new Set(arr.map((x) => x.toLowerCase())).size !== arr.length) bad(`${tag} packs.${k}.${t} 중복`);
      arr.forEach((x, i) => { if (typeof x !== 'string' || !x.trim() || /[<>{}]/.test(x) || len(x) > 140) bad(`${tag} packs.${k}.${t}[${i}] 비었거나 HTML/길이: ${x}`); });
      if (lang !== 'en' && arr[0] === EN.packs[k][t][0]) bad(`${tag} packs.${k}.${t} 가 en 과 같음`);
    }));
    walk(T, (s, p) => { if (!/^(privacy|faq)\./.test(p) && BANNED.test(s)) bad(`${tag} ${p} 금지어(키스·술·성적·위험): ${s}`); });
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    const cards = allCards(T);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
      if (cards.some((x) => f.a.includes(x))) bad(`${tag} faq[${i}] 에 카드 인용 (스포일러)`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 공정성(crypto.getRandomValues) 설명 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«( ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Baloo\+2|Be\+Vietnam|Kanit/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 제목 글꼴이 아님`);
    if (lang === 'th' && !/Kanit|Mitr|Prompt|Sarabun/.test(T.fonts.css)) bad(`${tag} 태국어 제목 글꼴이 아님`);
    if (lang === 'zh' && !/ZCOOL|Noto\+Sans\+SC/.test(T.fonts.css)) bad(`${tag} 간체자 제목 글꼴이 아님`);
    if (/^(en|fr|de|es|it|pt|vi)$/.test(lang) && !/Baloo\+2/.test(T.fonts.css)) bad(`${tag} 라틴 확장 글꼴(Baloo 2)이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`));
  return m ? m[0] : '';
}
function inOrder(S, list, msg) {
  const at = list.map((s) => S.indexOf(s));
  if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${msg} (없거나 순서 다름: ${list.filter((s, i) => at[i] < 0 || (i && at[i] < at[i - 1])).join(' | ')})`);
}
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/truth\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/truth\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((x, i) => i && x < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  modes.forEach(([mode, fileOf]) => {
    G.LOCALES.forEach(({ code: lang }) => {
      const T = L10N[lang];
      const f = fileOf(lang, 'index.html');
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"UtilitiesApplication"/.test(html)) bad(`${tag} appLd(WebApplication, vote) 없음`);
      const S = section(html, 'screen-setup');
      const P = section(html, 'screen-play');
      const E = section(html, 'screen-end');
      if (!S || !P || !E) { bad(`${tag} 화면(#screen-setup / #screen-play / #screen-end) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 3) bad(`${tag} section 은 3개(시작·진행·끝)`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (!/<section id="screen-play"[^>]*hidden>/.test(html) || !/<section id="screen-end"[^>]*hidden>/.test(html)) bad(`${tag} 진행·끝 화면은 처음에 hidden`);
      if (!(html.indexOf('id="screen-setup"') < html.indexOf('id="screen-play"') && html.indexOf('id="screen-play"') < html.indexOf('id="screen-end"'))) bad(`${tag} 화면 순서(시작 → 진행 → 끝)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="td-h1">/.test(S) || !S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1(검색어)이 시작 화면에 없음`);
      inOrder(S, ['class="td-h1"', 'class="td-hook"', 'id="mode-names"', 'id="mode-free"', 'id="names-box"', 'id="names"', 'id="free-box"', 'id="pack-friends"', 'id="pack-family"', 'id="pack-work"', 'id="pack-couples"', 'id="error"', 'id="start-btn"', 'class="td-fair"', 'class="mg-ad mg-ad-start"'],
        `${tag} 시작 화면 순서(h1 → 훅 → 이름 → 팩 → 시작 → 광고)`);
      inOrder(P, ['id="round"', 'id="finish-btn"', 'id="turn-name"', 'id="choose"', 'id="pick-truth"', 'id="pick-dare"', 'id="pick-random"', 'id="flip"', 'id="card-text"', 'id="card-actions"', 'id="skip-btn"', 'id="next-btn"', 'class="td-pass"'],
        `${tag} 진행 화면 순서(차례 → 고르기 → 카드 → 다른 카드·완료 → 넘어가기 안내)`);
      if (!/<div id="card-actions" class="td-card-actions" hidden>/.test(P)) bad(`${tag} 카드 버튼은 처음에 숨김`);
      if (!/<div data-mg-end="truth"><\/div>\s*<\/section>$/.test(E)) bad(`${tag} data-mg-end="truth" 는 끝 화면의 마지막 요소`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      inOrder(E, ['id="stat-rounds"', 'id="stat-truths"', 'id="stat-dares"', 'id="stat-skips"', 'id="edit-btn"', 'data-mg-end="truth"'], `${tag} 끝 화면 순서(요약 숫자 → 바꾸기 → 공통 끝 화면)`);
      if (/<h1/.test(E) || /<h1/.test(P)) bad(`${tag} h1 은 시작 화면에만`);
      if (!/id="pack-friends" role="radio" aria-checked="true"/.test(S) || (S.match(/role="radio"/g) || []).length !== 6) bad(`${tag} 팩·모드 라디오(6개, 기본 friends) 접근성`);
      if (!/id="mode-names" role="radio" aria-checked="true"/.test(S)) bad(`${tag} 기본 모드 = 이름 넣기`);
      if (!/id="error" class="td-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(P)) bad(`${tag} 카드 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 시작 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      const leak = allCards(T).find((c) => bodyNoJson.includes(G.esc(c)) || bodyNoJson.includes(c));
      if (leak) bad(`${tag} 카드 문구가 PAGE_I18N 밖(보이는 HTML·메타)에 있음 (스포일러): ${leak}`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('truth-core.js') < 0 || html.indexOf('truth-core.js') > html.indexOf('truth.js"')) bad(`${tag} truth-core.js 가 truth.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://truth.example.com/</loc>') || !sm.includes('<loc>https://truth.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 가이드 글에 카드 인용 없음(스포일러), OG 문구에도 없음
  G.LOCALES.forEach(({ code: lang }) => {
    const gp = path.join(SITE, 'tools', 'guide', `${lang}.js`);
    if (!fs.existsSync(gp)) { bad(`가이드 ${lang} 없음`); return; }
    const gtxt = JSON.stringify(require(gp));
    const cards = allCards(L10N[lang]);
    if (cards.some((p) => gtxt.includes(p))) bad(`[${lang}] 가이드 글에 카드 문구가 있음 (스포일러)`);
    const ogtxt = JSON.stringify(L10N[lang].og) + JSON.stringify(L10N[lang].meta) + JSON.stringify(L10N[lang].hero);
    if (cards.some((p) => ogtxt.includes(p))) bad(`[${lang}] OG·메타·히어로에 카드 문구 (스포일러)`);
  });
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'truth.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('truth.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("truth.js: track('start') 는 게임 시작 1곳, track('done') 은 끝 화면 1곳");
  if (!/function begin[\s\S]*?track\('start'\)[\s\S]*?nextTurn\(\)/.test(js)) bad("truth.js: track('start') 는 begin() 안, 첫 차례 직전");
  if (!/function finish[\s\S]*?show\('end'\);\s*track\('done'\)/.test(js)) bad("truth.js: track('done') 은 끝 화면을 보일 때");
  if (/Math\.random/.test(js)) bad('truth.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('truth.js: 움직임 줄이기 처리 없음');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`truth.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('truth.js: setShareData / setRetry 등록 없음');
  if (!/mgCleanUrl/.test(js)) bad('truth.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML/.test(js)) bad('truth.js: innerHTML 금지(textContent 만)');
  if (!/nextPlayer/.test(js) || !/nextCard/.test(js) || !/pickType/.test(js)) bad('truth.js: 차례·카드·랜덤은 truth-core 로');
  const core = fs.readFileSync(path.join(SITE, 'truth-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('truth-core.js 는 crypto.getRandomValues 만 써야 함');
  return pages;
}

// ---------------------------------------------------------------- 4) OG · 등록
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
function checkApp() {
  if (APP.id !== 'truth' || APP.category !== 'vote' || APP.path !== 'https://truth.example.com/' || APP.added !== '2026-11-05' || APP.emoji !== '🎲' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 160) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 24) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
      if (allCards(L10N[code]).some((c) => APP.desc[code].includes(c))) bad(`app.config.js ${code} 설명에 카드 문구`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
const cardCount = G.LOCALES.reduce((a, { code }) => a + allCards(L10N[code]).length, 0);
console.log(`\n진실 게임 로직(거부 샘플링·차례 바퀴 2~20명·연속 없음·덱·요약)·공정성(${passed.join(' ')}) · 언어 파일 ${G.LOCALES.length}개(카드 ${cardCount}장) · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 공평한 차례(crypto 섞은 바퀴)·랜덤 반반·세션 안 카드 반복 없음, 언어 파일 12개(키·자리표시자·팩 4×(진실·도전 40장+)·금지어·FAQ·제목·360px 문구), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·끝 화면 data-mg-end·스포일러 없음), OG 이미지 모두 OK');
