#!/usr/bin/env node
/**
 * 랜덤 숫자 뽑기 검사.
 *   1) 로직(randnum-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지, 2e9+1 범위), 입력 검사(정수·음수·±1e9·min>max·개수 1~1000·
 *      중복 불가인데 개수 > 남은 숫자·뺄 숫자 파싱/범위/개수 제한), nthAllowed, 결과 범위·중복 없음·뺄 숫자 없음·정렬,
 *      공정성 카이제곱(1~10 중복 허용, 중복 불가 3/10 의 각 자리, 음수 범위 + 뺄 숫자, 10억 범위 10구간, p≈0.001 기준),
 *      #d= 인코딩/디코딩(왕복, UTF-8 이름, 변조·범위 밖·중복·뺄 숫자·개수 불일치 거절), 기록 10개.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, "무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-rn) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 범위 → 개수 → 옵션 → 뽑기 → 결과(#result, 처음 hidden) 안 결과 카드 → 기록 → data-mg-end="randnum" 순서, 프리셋 4개, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, randnum.js 규칙.
 *
 * 실행: node tools/check-randnum.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'randnum-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 9: 27.88, 10: 29.59, 7: 24.32 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
function checkLogic() {
  eq([CORE.LIMIT, CORE.MAX_COUNT, CORE.MAX_EXCLUDE, CORE.HISTORY_MAX], [1e9, 1000, 1000, 10], '한도');
  eq(CORE.PRESETS.map((p) => p.id), ['1-6', '1-10', '1-45', '1-100'], '프리셋');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  const big = 2000000001;
  eq(CORE.uniformInt(big, seq([4000000002, 4294967295, 2000000001])), 0, 'uniformInt(2e9+1): limit(4000000002) 이상 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 입력 검사
  const v = (o) => CORE.validate(Object.assign({ min: 1, max: 10, count: 1, dup: false, sort: false, exclude: '' }, o));
  const err = (o) => v(o).error || 'ok';
  eq(err({}), 'ok', 'validate 기본');
  eq(err({ min: '' }), 'minInvalid', 'min 빈 값'); eq(err({ max: 'abc' }), 'maxInvalid', 'max 글자'); eq(err({ min: '1.5' }), 'minInvalid', 'min 소수');
  eq(err({ min: '1e3' }), 'minInvalid', 'min 1e3'); eq(err({ min: ' -5 ', max: '5' }), 'ok', '음수·공백');
  eq(err({ min: '−5', max: '5' }), 'ok', '유니코드 마이너스');
  eq(err({ min: -1e9, max: 1e9 }), 'ok', '±1e9'); eq(err({ min: -1000000001 }), 'outOfLimit', '-1e9-1'); eq(err({ max: 1000000001 }), 'outOfLimit', '1e9+1');
  eq(err({ min: 5, max: 4 }), 'minGtMax', 'min > max'); eq(err({ min: 7, max: 7 }), 'ok', 'min = max');
  eq(err({ count: 0 }), 'countInvalid', 'count 0'); eq(err({ count: '' }), 'countInvalid', 'count 빈 값'); eq(err({ count: 1001, max: 5000 }), 'countTooBig', 'count 1001');
  eq(err({ count: 1000, max: 1000 }), 'ok', 'count 1000 = 범위'); eq(err({ count: 11 }), 'notEnough', '중복 불가 count > 범위');
  eq(v({ count: 11 }).available, 10, 'notEnough available'); eq(err({ count: 11, dup: true }), 'ok', '중복 허용이면 count > 범위 OK');
  eq(err({ count: 9, exclude: '1, 2' }), 'notEnough', '뺄 숫자 고려한 notEnough'); eq(err({ count: 8, exclude: '1, 2' }), 'ok', '뺄 숫자 고려 OK');
  eq(err({ exclude: '1-10' }), 'allExcluded', '모두 뺌'); eq(err({ exclude: '1-10', dup: true }), 'allExcluded', '모두 뺌(중복 허용)');
  eq(err({ exclude: 'abc' }), 'excludeBad', '뺄 숫자 글자'); eq(v({ exclude: '3, x, 5' }).bad, ['x'], 'excludeBad 목록');
  eq(err({ exclude: '1-2000' }), 'excludeTooMany', '뺄 숫자 너무 많음');
  eq(v({ exclude: '20, 3;5 ,  7-9 0 -4 99' }).p.x, [3, 5, 7, 8, 9], '뺄 숫자 = 범위 안만, 정렬·중복 제거');
  eq(CORE.parseExclude('-5--3, 8~6, 2..2, 4–5').values, [-5, -4, -3, 2, 4, 5, 6, 7, 8], 'parseExclude 범위 표기');
  eq(v({ label: '  <b>Raffle</b>\u0007 ' + 'x'.repeat(80) }).p.l.length, CORE.MAX_LABEL, 'label 길이 제한');
  if (/[<>]/.test(v({ label: '<script>' }).p.l)) bad('label 에 < > 가 남음');
  // nthAllowed
  eq([0, 1, 2, 3, 4].map((k) => CORE.nthAllowed(1, [2, 3, 6], k)), [1, 4, 5, 7, 8], 'nthAllowed');
  // draw: 주입 난수
  const p = (o) => v(o).p;
  eq(CORE.draw(p({ count: 3 }), () => 0), [1, 2, 3], 'draw 중복 불가 최소 난수');
  eq(CORE.draw(p({ count: 3, dup: true }), () => 0), [1, 1, 1], 'draw 중복 허용 최소 난수');
  eq(CORE.draw(p({ count: 10, sort: true }), (m) => m - 1).slice().sort((a, b) => a - b), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'draw 전체 = 순열');
  eq(CORE.draw(p({ count: 4, sort: true }), (m) => m - 1), [1, 2, 3, 10], 'draw 정렬(뽑힌 순서 10,1,2,3)');
  // draw: crypto, 여러 경우
  const cases = [
    { min: 1, max: 10, count: 10 }, { min: -50, max: 50, count: 101 }, { min: 1, max: 45, count: 6, exclude: '4, 13, 20-25' },
    { min: -1e9, max: 1e9, count: 1000 }, { min: 0, max: 1, count: 1000, dup: true }, { min: 5, max: 5, count: 3, dup: true },
    { min: 1, max: 1000, count: 1000, sort: true }, { min: 1, max: 100, count: 50, exclude: '1-40' },
  ];
  cases.forEach((c) => {
    const chk = v(c);
    if (!chk.ok) { bad(`case ${JSON.stringify(c)} 검사 실패 ${chk.error}`); return; }
    const ex = new Set(chk.p.x);
    for (let t = 0; t < 30; t++) {
      const r = CORE.draw(chk.p);
      const tag = `draw ${JSON.stringify(c)}`;
      if (r.length !== chk.p.n) { bad(`${tag}: 개수 ${r.length}`); break; }
      if (r.some((x) => !Number.isInteger(x) || x < chk.p.a || x > chk.p.b)) { bad(`${tag}: 범위 밖`); break; }
      if (r.some((x) => ex.has(x))) { bad(`${tag}: 뺄 숫자가 나옴`); break; }
      if (!chk.p.u && new Set(r).size !== r.length) { bad(`${tag}: 중복`); break; }
      if (chk.p.s && r.some((x, i) => i && x < r[i - 1])) { bad(`${tag}: 정렬 안 됨`); break; }
    }
  });

  // 공정성
  // (a) 1~10 중복 허용, 100,000번
  let c = new Array(10).fill(0);
  const pa = p({ count: 1000, dup: true });
  for (let i = 0; i < 100; i++) CORE.draw(pa).forEach((x) => c[x - 1]++);
  let x2 = chi(c); if (x2 > CHI_001[9]) bad(`공정성 1~10 중복 허용: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[9]}`);
  // (b) 중복 불가 3/10: 각 자리(첫째·셋째)와 전체가 고르게
  const first = new Array(10).fill(0); const third = new Array(10).fill(0); const all = new Array(10).fill(0);
  const pb = p({ count: 3 });
  for (let i = 0; i < 40000; i++) { const r = CORE.draw(pb); first[r[0] - 1]++; third[r[2] - 1]++; r.forEach((y) => all[y - 1]++); }
  [['첫째 자리', first], ['셋째 자리', third], ['전체', all]].forEach(([n, arr]) => { const s = chi(arr); if (s > CHI_001[9]) bad(`공정성 중복 불가 3/10 ${n}: 카이제곱 ${s.toFixed(2)}`); });
  // (c) 음수 범위 + 뺄 숫자: -5~5 에서 -1,0,3 제외 → 8개 값 고르게
  const pc = v({ min: -5, max: 5, count: 1000, dup: true, exclude: '-1, 0, 3' }).p;
  const map = {}; for (let i = 0; i < 80; i++) CORE.draw(pc).forEach((y) => { map[y] = (map[y] || 0) + 1; });
  const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
  eq(keys, [-5, -4, -3, -2, 1, 2, 4, 5], '음수+뺄 숫자 나오는 값');
  x2 = chi(keys.map((k) => map[k])); if (x2 > CHI_001[7]) bad(`공정성 음수+뺄 숫자: 카이제곱 ${x2.toFixed(2)}`);
  // (d) 10억 범위(1~1e9) 10구간, 중복 불가 1000개 × 50
  c = new Array(10).fill(0);
  const pd = v({ min: 1, max: 1e9, count: 1000 }).p;
  for (let i = 0; i < 50; i++) CORE.draw(pd).forEach((y) => c[Math.min(9, Math.floor((y - 1) / 1e8))]++);
  x2 = chi(c); if (x2 > CHI_001[9]) bad(`공정성 10억 범위 10구간: 카이제곱 ${x2.toFixed(2)}`);
  // (e) -1e9~1e9 짝/홀 반반
  let odd = 0; const pe = v({ min: -1e9, max: 1e9, count: 1000, dup: true }).p;
  for (let i = 0; i < 40; i++) CORE.draw(pe).forEach((y) => { if (Math.abs(y) % 2 === 1) odd++; });
  if (Math.abs(odd / 40000 - 0.5) > 0.015) bad(`공정성 ±1e9 홀수 비율 ${(odd / 40000).toFixed(4)}`);

  // #d= 인코딩/디코딩
  const rec = { p: v({ min: -20, max: 45, count: 6, sort: true, exclude: '4, 13', label: '10월 이벤트 🎁 «Tirage»' }).p, r: [-7, 1, 2, 30, 31, 44], t: 1791676800123 };
  const enc = CORE.encodeShare(rec);
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeShare: base64url 아님');
  const dec = CORE.decodeShare(enc);
  if (!dec) bad('decodeShare: 왕복 실패');
  else {
    eq(dec.r, rec.r, '왕복 결과'); eq(dec.p.l, rec.p.l, '왕복 이름(UTF-8)'); eq(dec.p.x, [4, 13], '왕복 뺄 숫자');
    eq([dec.p.a, dec.p.b, dec.p.n, dec.p.u, dec.p.s], [-20, 45, 6, false, true], '왕복 설정'); eq(dec.t, 1791676800000, '왕복 시각(초 단위)');
  }
  const mk = (o) => CORE.b64urlEncode(JSON.stringify(Object.assign({ v: 1, a: 1, b: 10, n: 3, u: 0, s: 0, r: [1, 2, 3], t: 1791676800 }, o)));
  eq(!!CORE.decodeShare(mk({})), true, 'decode 기본');
  [['범위 밖 결과', { r: [1, 2, 11] }], ['중복(중복 불가)', { r: [1, 2, 2] }], ['개수 불일치', { r: [1, 2] }], ['뺄 숫자가 결과에', { x: [2], r: [1, 2, 3] }],
    ['정렬 위반', { s: 1, r: [3, 2, 1] }], ['min > max', { a: 9, b: 1 }], ['소수', { r: [1, 2, 2.5] }], ['버전', { v: 2 }], ['시각', { t: -1 }],
    ['개수 > 범위', { b: 2, n: 3, r: [1, 2, 1] }], ['범위 한도', { a: -2e9 }], ['라벨 형식', { l: 5 }], ['뺄 숫자 범위 밖', { x: [50], r: [1, 2, 3] }]].forEach(([n, o]) => {
    if (CORE.decodeShare(mk(o))) bad(`decodeShare: ${n} 를 거절해야 함`);
  });
  eq(!!CORE.decodeShare(mk({ u: 1, r: [2, 2, 2] })), true, 'decode 중복 허용 결과');
  ['', 'abc$', '!!!', 'e30', null, 123, 'x'.repeat(70000)].forEach((s) => { if (CORE.decodeShare(s)) bad(`decodeShare 쓰레기 값 허용: ${String(s).slice(0, 10)}`); });
  // 큰 결과(1000개)도 왕복
  const bigRec = { p: v({ min: -1e9, max: 1e9, count: 1000 }).p, t: Date.now() };
  bigRec.r = CORE.draw(bigRec.p);
  const bigEnc = CORE.encodeShare(bigRec);
  if (!CORE.decodeShare(bigEnc)) bad(`decodeShare: 1000개 결과 왕복 실패 (길이 ${bigEnc.length})`);

  // 기록
  let h = [];
  for (let i = 1; i <= 12; i++) h = CORE.pushHistory(h, { p: { a: 1, b: 10, n: 1 }, r: [i], t: i });
  eq(h.length, 10, '기록 10개'); eq(h[0].r[0], 12, '기록 최신이 맨 앞');
  eq(CORE.cleanHistory([null, { p: { a: 1, b: 2 }, r: [1], t: 5 }, { p: {}, r: [] }, 'x', { p: { a: 1, b: 2 }, r: ['1'], t: 1 }]).length, 1, 'cleanHistory');
  eq(CORE.cleanHistory('nope'), [], 'cleanHistory 배열 아님');
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(v) {
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shape(v[k]), o), {});
  return typeof v;
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
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, p ? `${p}.${k}` : k));
}
const get = (o, p) => p.split('.').reduce((a, k) => a[k], o);
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
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.countLabel', 'ui.draw', 'result.again', 'history.title', 'errors.notEnough'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·칩)
    const W = [['ui.draw', 24], ['ui.drawing', 20], ['result.again', 22], ['result.drawOwn', 26], ['result.copy', 20], ['result.copyLink', 20], ['ui.dupLabel', 16], ['ui.sortLabel', 16],
      ['ui.minLabel', 12], ['ui.maxLabel', 12], ['ui.countLabel', 22], ['ui.presetsLabel', 30], ['history.title', 24], ['history.clear', 12], ['result.sharedBadge', 28], ['ui.more', 26]];
    W.forEach(([p, max]) => { const v = get(T, p); if (width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
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
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-rn"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
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
  if (!/<link rel="canonical" href="https:\/\/randnum\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/randnum\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
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
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-rn) 없음`); return; }
      if (/<section id="screen-rn"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="rn-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="rn-h1"', 'data-preset="1-6"', 'id="min"', 'id="max"', 'id="count"', 'id="dup"', 'id="sort"', 'id="more-btn"', 'id="exclude"', 'id="label"',
        'id="error"', 'id="draw-btn"', 'id="result"', 'id="result-card"', 'id="reels"', 'id="copy-btn"', 'id="link-btn"', 'id="history-card"', '<div data-mg-end="randnum"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((v, i) => i && v < seq[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 프리셋 → 범위 → 개수 → 옵션 → 뽑기 → 결과 카드 → 기록 → 끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="rn-result" hidden>/.test(S)) bad(`${tag} 결과·끝 화면(#result)은 처음에 hidden`);
      if (!/<div id="more" class="rn-more" hidden>/.test(S)) bad(`${tag} 옵션 더 보기(#more)는 처음에 접힘`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      CORE.PRESETS.forEach((pr) => { if (!S.includes(`data-preset="${pr.id}"`)) bad(`${tag} 프리셋 ${pr.id} 없음`); });
      if ((S.match(/aria-pressed="true"/g) || []).length !== 1 || !/data-preset="1-100" aria-pressed="true"/.test(S)) bad(`${tag} 기본 프리셋 표시는 1–100 하나`);
      if (!/id="min"[^>]*value="1"/.test(S) || !/id="max"[^>]*value="100"/.test(S) || !/id="count"[^>]*value="1"/.test(S)) bad(`${tag} 기본값 1~100, 1개`);
      if (/id="(min|max)"[^>]*inputmode=/.test(S)) bad(`${tag} min/max 에 inputmode 를 두면 iOS 에서 마이너스를 못 씀`);
      if ((S.match(/role="switch"/g) || []).length !== 2) bad(`${tag} 스위치(중복·정렬) 접근성`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (!/id="error" class="rn-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="shared-badge" class="rn-badge" hidden/.test(S)) bad(`${tag} 공유 결과 배지는 처음에 hidden`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('randnum-core.js') < 0 || html.indexOf('randnum-core.js') > html.indexOf('randnum.js"')) bad(`${tag} randnum-core.js 가 randnum.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://randnum.example.com/</loc>') || !sm.includes('<loc>https://randnum.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'randnum.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('randnum.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("randnum.js: track('start') 는 뽑기 1곳, track('done') 은 결과 1곳");
  if (/Math\.random/.test(js)) bad('randnum.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('randnum.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  const ls = js.match(/localStorage\.[a-zA-Z]+\(/g) || [];
  if (!ls.length) bad('randnum.js: 최근 기록을 localStorage 에 저장해야 함');
  // localStorage 호출은 모두 try 블록 안
  js.split('\n').forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(js.split('\n')[i - 1] || '') && !/try\s*\{/.test(js.split('\n')[i - 2] || '')) bad(`randnum.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('randnum.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('randnum.js: #d= 공유 결과 보기 없음');
  if (!/mgCleanUrl/.test(js)) bad('randnum.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  const core = fs.readFileSync(path.join(SITE, 'randnum-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('randnum-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'randnum' || APP.category !== 'vote' || APP.path !== 'https://randnum.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added) || APP.emoji !== '🔢') bad('app.config.js id/emoji/category/path/added');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 150) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (len(APP.title[code]) > 24) bad(`app.config.js ${code} 포털 이름이 김 (${len(APP.title[code])}자)`);
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
console.log(`\n랜덤 숫자 로직·검사·공정성(카이제곱 5종)·#d= 왕복 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 뽑기 로직·입력 검사·공정성(crypto 거부 샘플링, 희소 Fisher–Yates)·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 끝 화면), OG 이미지 모두 OK');
