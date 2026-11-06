#!/usr/bin/env node
/**
 * 빙고 번호 추첨기 검사.
 *   1) 로직(bingocall-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), 방식별 범위(75·90·직접), 직접 범위 검사(1~999, 5~150개),
 *      75볼 글자(B 1–15 … O 61–75), 판 모양, **반복 없음**(방식마다 끝까지 뽑으면 drawn 이 전체 번호의 순열 — 75·90·여러 직접 범위 × 여러 번),
 *      다 뽑은 뒤 -1, 되돌리기(마지막 번호가 다시 남은 번호로, 다시 뽑아도 반복 없음), 끝낸 게임은 뽑기·되돌리기 안 됨, 걸린 시간,
 *      저장 상태 검사(sanitize: 모양·범위·중복·개수 초과·버전), 공정성 카이제곱(첫 번호 고르게 — 75·직접 10개, 중간 번호도 고르게).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, 번역 여부, FAQ 3~5개(getRandomValues, "무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구(버튼·칩·스위치 — de/ru/vi 처럼 긴 언어), h1 검색어, fr 좁은 공백, 글꼴(th/vi/ru/zh), 한글은 ko 파일만, 제목 = app.config title.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개(진행 화면 광고 없음) /
 *      화면 순서(시작 → 진행 → 끝), 진행·끝 화면 처음 hidden, 끝 화면 마지막 = data-mg-end="bingocall", FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, bingocall.js 규칙.
 *
 * 실행: node tools/check-bingocall.js   (tools/check-all.js 가 apps/bingocall 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bingocall-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// ---------------------------------------------------------------- 1) 로직
const CHI_001 = { 4: 18.47, 9: 27.88, 14: 36.12, 74: 117.35 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
const passed = [];
let permutations = 0;
function drawAll(g) {
  const out = [];
  for (let k = 0; k < 1000; k++) { const x = CORE.draw(g); if (x < 0) break; out.push(x); }
  return out;
}
function checkLogic() {
  eq(CORE.MODES, ['75', '90', 'custom'], '방식 3개');
  eq(CORE.LETTERS, ['B', 'I', 'N', 'G', 'O'], '글자');
  eq([CORE.CUSTOM_LO, CORE.CUSTOM_HI, CORE.CUSTOM_MIN_SIZE, CORE.CUSTOM_MAX_SIZE], [1, 999, 5, 150], '직접 범위 한도');
  eq(CORE.INTERVALS, [3, 5, 8], '자동 뽑기 간격');
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 범위·검사
  const g75 = CORE.newGame('75'); const g90 = CORE.newGame('90');
  eq([g75.a, g75.b, CORE.total(g75)], [1, 75, 75], '75볼 범위');
  eq([g90.a, g90.b, CORE.total(g90)], [1, 90, 90], '90볼 범위');
  eq(CORE.newGame('nope').mode, '75', '모르는 방식 → 75');
  eq(CORE.newGame('custom', 1, 30).b, 30, '직접 1~30');
  eq(CORE.newGame('custom', 1, 3), null, '직접 3개 → null');
  eq(CORE.validateRange(1, 4).error, 'rangeSmall', '4개 = 너무 적음');
  eq(CORE.validateRange(1, 5).ok, true, '5개');
  eq(CORE.validateRange(1, 150).ok, true, '150개');
  eq(CORE.validateRange(1, 151).error, 'rangeBig', '151개');
  eq(CORE.validateRange(1, 151).n, 151, '151개 n');
  eq(CORE.validateRange(0, 10).error, 'rangeBad', '0 부터');
  eq(CORE.validateRange(990, 1000).error, 'rangeBad', '1000 까지');
  eq(CORE.validateRange(1.5, 10).error, 'rangeBad', '소수');
  eq(CORE.validateRange(NaN, 10).error, 'rangeBad', 'NaN');
  eq(CORE.validateRange(30, 1).error, 'rangeSmall', '거꾸로');
  eq(CORE.validateRange(850, 999).ok, true, '850~999');
  // 글자
  eq([1, 15, 16, 30, 31, 45, 46, 60, 61, 75].map((n) => CORE.letterOf('75', n)).join(''), 'BBIINNGGOO', '75볼 글자 경계');
  eq([CORE.letterOf('75', 0), CORE.letterOf('75', 76), CORE.letterOf('90', 5), CORE.letterOf('custom', 5)], ['', '', '', ''], '글자 없음');
  // 판 모양
  const r75 = CORE.boardRows(g75);
  eq([r75.length, r75.map((r) => r.letter).join(''), r75[0].cells.length, r75[4].cells[14]], [5, 'BINGO', 15, 75], '75볼 판');
  const r90 = CORE.boardRows(g90);
  eq([r90.length, r90[0].cells[0], r90[8].cells.length, r90[8].cells[9]], [9, 1, 10, 90], '90볼 판(1~10 … 81~90)');
  const rc = CORE.boardRows(CORE.newGame('custom', 5, 27));
  eq([rc.length, rc[0].cells[0], rc[2].cells.slice(-1)[0]], [3, 5, 27], '직접 판(5~27)');
  eq([].concat(...r75.map((r) => r.cells)), range(1, 75), '75볼 판 = 1~75');
  eq([].concat(...r90.map((r) => r.cells)), range(1, 90), '90볼 판 = 1~90');

  // 반복 없음: 끝까지 뽑으면 순열
  const cases = [['75'], ['90'], ['custom', 1, 30], ['custom', 1, 5], ['custom', 850, 999], ['custom', 100, 249], ['custom', 7, 19]];
  cases.forEach(([m, a, b]) => {
    for (let rep = 0; rep < 40; rep++) {
      const g = CORE.newGame(m, a, b);
      const got = drawAll(g);
      const want = range(g.a, g.b);
      if (got.length !== want.length || got.slice().sort((x, y) => x - y).join() !== want.join()) { bad(`반복 없음 ${m} ${g.a}~${g.b}: 순열이 아님 (${got.length}개)`); break; }
      if (new Set(got).size !== got.length) { bad(`반복 없음 ${m}: 같은 번호가 두 번`); break; }
      if (CORE.draw(g) !== -1 || !CORE.isComplete(g) || CORE.remaining(g).length) { bad(`다 뽑은 뒤 ${m}: -1 이 아님`); break; }
      permutations++;
    }
  });
  // 되돌리기: 마지막 번호가 다시 남은 번호로, 그 뒤 끝까지 뽑아도 순열
  {
    const g = CORE.newGame('75');
    const first = [CORE.draw(g, null, 1000), CORE.draw(g), CORE.draw(g)];
    eq(g.t0, 1000, '첫 번호 시각');
    eq(CORE.undo(g), first[2], '되돌리기 = 마지막 번호');
    eq(g.drawn, first.slice(0, 2), '되돌린 뒤 drawn');
    if (!CORE.remaining(g).includes(first[2])) bad('되돌린 번호가 남은 번호로 돌아가지 않음');
    eq(g.t0, 1000, '되돌려도 시작 시각 유지');
    const rest = drawAll(g);
    eq(g.drawn.slice().sort((x, y) => x - y), range(1, 75), '되돌린 뒤 끝까지 = 순열');
    if (rest.length !== 73) bad(`되돌린 뒤 남은 번호 ${rest.length} ≠ 73`);
    const h = CORE.newGame('90');
    eq(CORE.undo(h), -1, '빈 게임 되돌리기 = -1');
    for (let i = 0; i < 20; i++) { CORE.draw(h); CORE.draw(h); CORE.undo(h); }
    if (new Set(h.drawn).size !== h.drawn.length || h.drawn.length !== 20) bad('뽑기·되돌리기를 섞어도 반복 없음이 깨짐');
  }
  // 끝내기
  {
    const g = CORE.newGame('custom', 1, 10);
    CORE.draw(g, null, 5000); CORE.draw(g);
    eq(CORE.end(g, 65000), true, 'end 첫 번째');
    eq(CORE.end(g, 99000), false, 'end 두 번째');
    eq([CORE.draw(g), CORE.undo(g), g.drawn.length], [-1, -1, 2], '끝낸 게임은 뽑기·되돌리기 안 됨');
    eq(CORE.durationSec(g), 60, '걸린 시간 60초');
    eq(CORE.durationSec(CORE.newGame('75')), 0, '시작 전 0초');
    eq(CORE.splitDuration(3725), { h: 1, m: 2, s: 5 }, 'splitDuration');
  }
  // 저장 상태
  {
    const g = CORE.newGame('custom', 3, 40); CORE.draw(g, null, 1700000000000); CORE.draw(g);
    const back = CORE.sanitize(JSON.parse(JSON.stringify(g)));
    eq(back && back.drawn, g.drawn, 'sanitize 왕복');
    eq(back && [back.a, back.b, back.t0], [3, 40, 1700000000000], 'sanitize 범위·시각');
    eq(CORE.sanitize(null), null, 'sanitize(null)');
    eq(CORE.sanitize({ ...g, v: 2 }), null, '버전 다름');
    eq(CORE.sanitize({ ...g, mode: 'x' }), null, '방식 다름');
    eq(CORE.sanitize({ ...g, drawn: [3, 3] }), null, '중복 번호');
    eq(CORE.sanitize({ ...g, drawn: [41] }), null, '범위 밖 번호');
    eq(CORE.sanitize({ ...g, drawn: [3.5] }), null, '소수 번호');
    eq(CORE.sanitize({ ...g, drawn: 'x' }), null, 'drawn 이 배열 아님');
    eq(CORE.sanitize({ ...g, a: 1, b: 2 }), null, '범위가 너무 작음');
    eq(CORE.sanitize({ v: 1, mode: '75', drawn: range(1, 76) }), null, '개수 초과');
    eq(CORE.sanitize({ v: 1, mode: '75', a: 5, b: 9, drawn: [70] }).b, 75, '75볼은 저장된 범위를 무시');
  }
  // 공정성: 첫 번호 고르게(75볼 → 75칸, 직접 1~10, 1~5)
  [[CORE.newGame('75'), 74, 60000], [CORE.newGame('custom', 1, 10), 9, 20000], [CORE.newGame('custom', 1, 5), 4, 20000]].forEach(([tpl, df, N]) => {
    const c = new Array(CORE.total(tpl)).fill(0);
    for (let k = 0; k < N; k++) { const g = CORE.newGame(tpl.mode, tpl.a, tpl.b); c[CORE.draw(g) - g.a]++; }
    const x = chi(c);
    if (x > CHI_001[df]) bad(`공정성 첫 번호 ${tpl.mode} ${tpl.a}~${tpl.b}: 카이제곱 ${x.toFixed(2)}`); else passed.push(`첫번호${CORE.total(tpl)}:${x.toFixed(1)}`);
  });
  // 공정성: 다섯 번째 번호도 고르게(직접 1~15)
  {
    const c = new Array(15).fill(0);
    for (let k = 0; k < 30000; k++) { const g = CORE.newGame('custom', 1, 15); let x; for (let i = 0; i < 5; i++) x = CORE.draw(g); c[x - 1]++; }
    const x = chi(c); if (x > CHI_001[14]) bad(`공정성 다섯 번째 번호: 카이제곱 ${x.toFixed(2)}`); else passed.push(`5번째:${x.toFixed(1)}`);
  }
  // 연출 숫자는 남은 번호 중에서
  {
    const g = CORE.newGame('custom', 1, 6); [1, 2, 3, 4, 5].forEach(() => CORE.draw(g));
    const left = CORE.remaining(g)[0];
    for (let i = 0; i < 20; i++) if (CORE.teaseNumber(g) !== left) { bad('teaseNumber 가 남은 번호가 아님'); break; }
  }
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
    walk(T, (s, p) => { if (/^(privacy|faq)\./.test(p)) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.start', 'ui.draw', 'ui.undo', 'ui.finish', 'ui.newConfirm', 'end.title', 'errors.rangeBad'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·칩·스위치 — 표시 폭 단위, 한중일 = 2)
    const W = [['ui.start', 26], ['ui.draw', 26], ['ui.drawFirst', 26], ['ui.drawing', 26], ['ui.allDone', 28], ['ui.undo', 16], ['ui.finish', 10],
      ['ui.auto', 16], ['ui.voice', 16], ['ui.sound', 16], ['ui.intervalLabel', 8], ['ui.prevLabel', 14], ['ui.newGame', 26],
      ['ui.modeLabel', 34], ['ui.fromLabel', 16], ['ui.toLabel', 16], ['ui.boardTitle', 30], ['ui.ready', 46],
      ['end.again', 24], ['end.edit', 30], ['end.kicker', 30], ['end.title', 30], ['end.drawn', 26], ['end.time', 26]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    CORE.MODES.forEach((k) => {
      if (width(T.ui.modes[k].name) > 24) bad(`${tag} ui.modes.${k}.name 가 김`);
      if (width(T.ui.modes[k].desc) > 44) bad(`${tag} ui.modes.${k}.desc 가 김`);
    });
    // 자동 뽑기 간격 칩 3개: "8 s" 류 짧게
    CORE.INTERVALS.forEach((s) => { if (width(G.fmt(T.ui.sec, { s })) > 7) bad(`${tag} 간격 칩 "${G.fmt(T.ui.sec, { s })}" 가 김`); });
    // 진행 화면 위쪽 막대: 방식 칩(말줄임) + 개수 + 버튼 2개가 한 줄
    if (width(G.fmt(T.ui.count, { n: 150, m: 150 })) > 12) bad(`${tag} ui.count 가 김`);
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
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
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«( ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Baloo\+2|Be\+Vietnam|Kanit/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 제목 글꼴이 아님`);
    if (lang === 'th' && !/Kanit|Mitr|Prompt|Sarabun/.test(T.fonts.css)) bad(`${tag} 태국어 제목 글꼴이 아님`);
    if (lang === 'zh' && !/ZCOOL|Noto\+Sans\+SC/.test(T.fonts.css)) bad(`${tag} 간체자 제목 글꼴이 아님`);
    if (/^(en|fr|de|es|it|pt|vi)$/.test(lang) && !/Baloo\+2/.test(T.fonts.css)) bad(`${tag} 라틴 확장 글꼴(Baloo 2)이 아님`);
    if (!/7/.test(T.privacy.sections[5][1]) || T.privacy.sections.length !== 6) bad(`${tag} privacy 6절·시행일`);
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
  if (!/<link rel="canonical" href="https:\/\/bingocall\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bingocall\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/mg-ad/.test(P)) bad(`${tag} 진행 화면(TV·프로젝터)에 광고 자리`);
      if (!/<h1 class="bc-h1">/.test(S) || !S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1(검색어)이 시작 화면에 없음`);
      inOrder(S, ['class="bc-h1"', 'class="bc-hook"', 'id="mode-75"', 'id="mode-90"', 'id="mode-custom"', 'id="custom-box"', 'id="from"', 'id="to"', 'id="error"', 'id="start-btn"', 'class="bc-fair"', 'class="mg-ad mg-ad-start"'],
        `${tag} 시작 화면 순서(h1 → 훅 → 방식 → 범위 → 시작 → 광고)`);
      if (!/<div id="custom-box" class="bc-custom" hidden>/.test(S)) bad(`${tag} 직접 범위 입력은 처음에 숨김`);
      inOrder(P, ['id="mode-chip"', 'id="count"', 'id="fs-btn"', 'id="finish-btn"', 'id="ball"', 'id="ball-num"', 'id="ready"', 'id="prev"', 'id="draw-btn"', 'id="auto-bar"', 'id="undo-btn"', 'id="auto"', 'id="interval"', 'id="voice"', 'id="sound"', 'id="board"', 'id="new-btn"', 'id="live"'],
        `${tag} 진행 화면 순서(막대 → 공 → 지난 번호 → 뽑기 → 조작 → 판 → 새 게임)`);
      if (!/id="fs-btn"[^>]*hidden/.test(P) || !/id="voice-wrap" hidden/.test(P)) bad(`${tag} 전체 화면·읽어 주기는 처음에 숨김(지원할 때만 보임)`);
      if (!/id="voice" role="switch">/.test(P) || !/id="sound" role="switch">/.test(P) || !/id="auto" role="switch">/.test(P) || /\schecked[\s>]/.test(P)) bad(`${tag} 읽어 주기·소리·자동 뽑기는 처음에 꺼짐`);
      if ((P.match(/data-sec="/g) || []).length !== 3 || !/aria-checked="true" data-sec="5"/.test(P)) bad(`${tag} 간격 3·5·8초(기본 5초)`);
      if (!/<div data-mg-end="bingocall"><\/div>\s*<\/section>$/.test(E)) bad(`${tag} data-mg-end="bingocall" 는 끝 화면의 마지막 요소`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      inOrder(E, ['id="stat-drawn"', 'id="stat-of"', 'id="stat-time"', 'id="edit-btn"', 'data-mg-end="bingocall"'], `${tag} 끝 화면 순서(요약 숫자 → 바꾸기 → 공통 끝 화면)`);
      if (/<h1/.test(E) || /<h1/.test(P)) bad(`${tag} h1 은 시작 화면에만`);
      if (!/id="mode-75" role="radio" aria-checked="true"/.test(S) || (S.match(/role="radio"/g) || []).length !== 3) bad(`${tag} 방식 라디오(3개, 기본 75)`);
      if (!/id="error" class="bc-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(P)) bad(`${tag} 번호 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 시작 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('bingocall-core.js') < 0 || html.indexOf('bingocall-core.js') > html.indexOf('bingocall.js"')) bad(`${tag} bingocall-core.js 가 bingocall.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://bingocall.example.com/</loc>') || !sm.includes('<loc>https://bingocall.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  G.LOCALES.forEach(({ code: lang }) => { if (!fs.existsSync(path.join(SITE, 'tools', 'guide', `${lang}.js`))) bad(`가이드 ${lang} 없음`); });
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'bingocall.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('bingocall.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("bingocall.js: track('start') 는 첫 번호 1곳, track('done') 은 markDone 1곳");
  if (!/var first = !game\.t0;[\s\S]*?CORE\.draw\(game\)[\s\S]*?if \(first\) track\('start'\)/.test(js)) bad("bingocall.js: track('start') 는 게임의 첫 번호를 뽑을 때");
  if (!/function markDone\(\) \{\s*if \(!game \|\| game\.done \|\| !game\.t0\) return;\s*game\.done = true;\s*track\('done'\)/.test(js)) bad("bingocall.js: track('done') 은 markDone 에서 게임마다 한 번");
  if (!/function finish[\s\S]*?markDone\(\)/.test(js) || !/isComplete\(game\)\) \{ markDone\(\)/.test(js)) bad('bingocall.js: 끝내기·모두 뽑음 둘 다 markDone');
  if (/Math\.random/.test(js)) bad('bingocall.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('bingocall.js: 움직임 줄이기 처리 없음');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`bingocall.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/'bingocall_state'/.test(js)) bad('bingocall.js: 저장 키는 bingocall_state');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('bingocall.js: setShareData / setRetry 등록 없음');
  if (!/mgCleanUrl/.test(js)) bad('bingocall.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML/.test(js)) bad('bingocall.js: innerHTML 금지(textContent 만)');
  if (!/CORE\.draw\(/.test(js) || !/CORE\.undo\(/.test(js) || !/CORE\.sanitize\(/.test(js)) bad('bingocall.js: 뽑기·되돌리기·저장 읽기는 bingocall-core 로');
  if (!/ask\(U\.newConfirm\)/.test(js)) bad('bingocall.js: 새 게임은 확인을 받는다');
  if (!/speechSynthesis/.test(js) || !/voiceWrap\.hidden = !voiceObj/.test(js)) bad('bingocall.js: 읽어 주기는 그 언어 음성이 있을 때만 보임');
  const core = fs.readFileSync(path.join(SITE, 'bingocall-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('bingocall-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'bingocall' || APP.category !== 'vote' || APP.path !== 'https://bingocall.example.com/' || APP.added !== '2026-11-07' || APP.emoji !== '🎱' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 160) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 24) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
    }
  });
  if (/[^ ][:;?!](\s|$)/.test(APP.desc.fr.replace(/https?:\/\/\S+/g, ''))) bad('app.config.js fr 설명의 : 앞 좁은 공백');
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n빙고 번호 추첨기 로직(거부 샘플링·범위·글자·판·끝까지 뽑기 순열 ${permutations}번·되돌리기·끝내기·저장 검사)·공정성(${passed.join(' ')}) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 반복 없는 공정한 추첨(crypto, 끝까지 뽑으면 순열)·되돌리기·저장 복원, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·진행 화면 광고 없음·끝 화면 data-mg-end), OG 이미지 모두 OK');
