#!/usr/bin/env node
/**
 * BMI 계산기 검사 (Node, 브라우저 없음 — 실제 화면 흐름은 tools/check-flow.js).
 *   1) 로직(bmi-core.js): 입력 해석(parseNum — "," "." 소수점, 전각 숫자, 공백, 잘못된 입력), BMI 공식(cm·kg),
 *      미국식 단위 환산(ft·in → cm, lb → kg, 703 공식과 비교, cm → ft·in 되돌림), 소수 1자리 반올림 뒤 단계 결정,
 *      경계값 18.5 · 23 · 24 · 25 · 28 · 30 · 35 · 40 (who · asia · kr · jp · cn), 정상 체중 범위·남은 몸무게(올림),
 *      run() 의 빈 칸·started·오류(badNum · heightRange · weightRange · inchRange · ageRange)·미성년/65세 표시, 언어별 아시아 기준.
 *   2) 언어 파일 12개: en.js 와 키 구조 동일, TODO-TRANSLATE 없음, 자리표시자, 단계 이름 수 = 그 언어 기준의 단계 수,
 *      FAQ 3~5개("무료인가요?" 류 금지), 제목·설명 길이, 360px 폭 문구, h1 검색어 = app.config title,
 *      한국어 파일 밖에 한글 없음, fr 좁은 공백, ru 키릴 글꼴, vi 성조 글꼴, th 태국어 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title = "검색어 | 브랜드" / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(create) / FAQPage 없음 / 첫 화면(#screen-bmi) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 단위 → 입력 → 결과 → 알아 둘 점 → 요약 보기 → 결과(#result, 처음 hidden) → data-mg-end="bmi" 순서,
 *      입력 칸 inputmode=decimal 5개 + numeric 1개, 아시아 기준 기본값(ko·ja·zh·th·vi 켜짐), FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), app.config.js, favicon, shared 링크, bmi.js 규칙(track·서버 전송 없음·저장은 단위만·공유 깨끗한 주소).
 *
 * 실행: node tools/check-bmi.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bmi-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));

const L10N = G.loadSiteLocales(SITE);
const problems = [];
let passes = 0;
const bad = (m) => problems.push(m);
const ok = (cond, m) => { if (cond) passes++; else bad(m); };
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, `${m}: ${a} ≉ ${b} (±${tol})`);
const get = (o, pth) => pth.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  // 입력 해석 [입력, 기대값 | 'empty' | 'badNum']
  const P = [
    ['170', 170], [' 65 ', 65], ['70.5', 70.5], ['70,5', 70.5], ['0,5', 0.5], ['.5', 0.5], [',5', 0.5], ['5.', 5], ['１７０', 170], ['６５，５', 65.5], ['１７０．２', 170.2],
    ['1 70', 170], ['', 'empty'], ['   ', 'empty'], ['abc', 'badNum'], ['1e3', 'badNum'], ['-65', 'badNum'], ['+65', 'badNum'], ['65kg', 'badNum'], ['1,234.5', 'badNum'],
    ['70,5,1', 'badNum'], ['1..2', 'badNum'], [',', 'badNum'], ['.', 'badNum'], ['Infinity', 'badNum'], ['5 ft', 'badNum'],
  ];
  P.forEach(([s, want]) => {
    const r = CORE.parseNum(s);
    const got = r.empty ? 'empty' : r.error ? r.error : r.value;
    ok(got === want, `parseNum(${JSON.stringify(s)}) = ${got} ≠ ${want}`);
  });
  // 공식 (cm·kg)
  near(CORE.bmi(170, 65), 22.491, 0.001, 'BMI 170cm 65kg');
  eq(CORE.round1(CORE.bmi(170, 65)), 22.5, '170cm 65kg → 22.5');
  eq(CORE.round1(CORE.bmi(160, 50)), 19.5, '160cm 50kg → 19.5');
  eq(CORE.round1(CORE.bmi(180, 100)), 30.9, '180cm 100kg → 30.9');
  eq(CORE.round1(CORE.bmi(165, 65)), 23.9, '165cm 65kg → 23.9 (가이드 예시)');
  eq(CORE.round1(CORE.bmi(175, 65)), 21.2, '175cm 65kg → 21.2 (가이드 예시)');
  // 미국식 단위 환산
  near(CORE.ftInToCm(5, 7), 170.18, 1e-9, "5'7\" = 170.18cm");
  near(CORE.ftInToCm(6, 0), 182.88, 1e-9, "6'0\" = 182.88cm");
  near(CORE.ftInToCm(0, 70), 177.8, 1e-9, '0 ft 70 in = 177.8cm');
  near(CORE.lbToKg(145), 65.77089365, 1e-6, '145 lb = 65.771kg');
  near(CORE.kgToLb(100), 220.46226218, 1e-6, '100kg = 220.462 lb');
  near(CORE.lbToKg(CORE.kgToLb(73.4)), 73.4, 1e-9, 'kg → lb → kg 되돌림');
  eq(CORE.cmToFtIn(170), { ft: 5, inch: 6.9 }, '170cm → 5 ft 6.9 in');
  eq(CORE.cmToFtIn(182.88), { ft: 6, inch: 0 }, '182.88cm → 6 ft 0 in');
  eq(CORE.cmToFtIn(152.3), { ft: 5, inch: 0 }, '152.3cm → 5 ft 0 in (11.96 in 올림 → 다음 피트)');
  // 703 공식과 같은 값 (무작위 300번)
  let seed = 11;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  let same = 0;
  for (let i = 0; i < 300; i++) {
    const ft = 4 + Math.floor(rnd() * 3), inch = Math.round(rnd() * 115) / 10, lb = 90 + Math.round(rnd() * 2400) / 10;
    const core = CORE.bmi(CORE.ftInToCm(ft, inch), CORE.lbToKg(lb));
    const f703 = 703.0696 * lb / Math.pow(ft * 12 + inch, 2);
    if (Math.abs(core - f703) < 1e-3) same++; else bad(`703 공식과 다름: ${ft}'${inch}" ${lb}lb → ${core} vs ${f703}`);
  }
  ok(same === 300, '미국식 단위 = 703 공식 300번');
  const imp = CORE.run({ unit: 'imperial', ft: '5', inch: '7', lb: '145', scale: 'who' });
  eq([imp.ok, imp.bmi, imp.cat, imp.unit], [true, 22.7, 1, 'imperial'], "run 5'7\" 145 lb → 22.7 정상");
  const imp2 = CORE.run({ unit: 'imperial', ft: '', inch: '67', lb: '145,0', scale: 'who' });
  eq(imp2.bmi, 22.7, 'run 0 ft 67 in (피트 빈칸) + 쉼표 lb');
  // 경계값 — 단계 인덱스
  const C = (b, s) => CORE.category(b, s);
  const B = [
    [18.4, 'who', 0], [18.5, 'who', 1], [24.9, 'who', 1], [25, 'who', 2], [29.9, 'who', 2], [30, 'who', 3], [34.9, 'who', 3], [35, 'who', 4], [39.9, 'who', 4], [40, 'who', 5], [60, 'who', 5],
    [18.4, 'asia', 0], [18.5, 'asia', 1], [22.9, 'asia', 1], [23, 'asia', 2], [24.9, 'asia', 2], [25, 'asia', 3], [29.9, 'asia', 3], [30, 'asia', 4], [45, 'asia', 4],
    [22.9, 'kr', 1], [23, 'kr', 2], [25, 'kr', 3], [30, 'kr', 4], [34.9, 'kr', 4], [35, 'kr', 5],
    [24.9, 'jp', 1], [25, 'jp', 2], [30, 'jp', 3], [35, 'jp', 4], [40, 'jp', 5],
    [18.4, 'cn', 0], [23.9, 'cn', 1], [24, 'cn', 2], [27.9, 'cn', 2], [28, 'cn', 3], [40, 'cn', 3],
    [10, 'who', 0], [25, 'nope', 2],
  ];
  B.forEach(([b, s, want]) => eq(C(b, s), want, `category(${b}, ${s})`));
  // 반올림 뒤 단계: 24.96 → 25.0 → 과체중 / 24.94 → 24.9 → 정상 / 18.46 → 18.5 / 22.95 → 23.0 (asia)
  const R = (kg, scale) => CORE.run({ unit: 'metric', cm: '200', kg: String(kg), scale });
  eq([R(99.84, 'who').bmi, R(99.84, 'who').cat], [25, 2], '24.96 → 25.0 과체중 (화면 숫자 = 단계)');
  eq([R(99.76, 'who').bmi, R(99.76, 'who').cat], [24.9, 1], '24.94 → 24.9 정상');
  eq([R(73.84, 'who').bmi, R(73.84, 'who').cat], [18.5, 1], '18.46 → 18.5 정상');
  eq([R(73.76, 'who').bmi, R(73.76, 'who').cat], [18.4, 0], '18.44 → 18.4 저체중');
  eq([R(91.8, 'asia').bmi, R(91.8, 'asia').cat], [23, 2], '22.95 → 23.0 아시아 과체중');
  eq([R(92, 'kr').bmi, R(92, 'kr').cat], [23, 2], '23 → 비만 전단계(kr)');
  eq([R(120, 'who').bmi, R(120, 'who').cat], [30, 3], '30 → 비만 1(who)');
  eq([R(112, 'cn').bmi, R(112, 'cn').cat], [28, 3], '28 → 肥胖(cn)');
  // 정상 체중 범위·남은 몸무게
  eq(CORE.healthyBmi('who'), [18.5, 24.9], '정상 BMI who');
  eq(CORE.healthyBmi('asia'), [18.5, 22.9], '정상 BMI asia');
  eq(CORE.healthyBmi('kr'), [18.5, 22.9], '정상 BMI kr');
  eq(CORE.healthyBmi('jp'), [18.5, 24.9], '정상 BMI jp');
  eq(CORE.healthyBmi('cn'), [18.5, 23.9], '정상 BMI cn');
  const h = CORE.run({ unit: 'metric', cm: '170', kg: '80', scale: 'who' });
  eq([CORE.weightIn(h.minKg, 'metric'), CORE.weightIn(h.maxKg, 'metric'), h.dir, CORE.diffIn(h.diffKg, 'metric')], [53.5, 72, 'lose', 8.1], '170cm 80kg: 정상 53.5~72.0, 8.04 → 8.1kg 줄이기(올림)');
  const g = CORE.run({ unit: 'metric', cm: '170', kg: '50', scale: 'who' });
  eq([g.cat, g.dir, CORE.diffIn(g.diffKg, 'metric')], [0, 'gain', 3.5], '170cm 50kg: 저체중, 3.5kg 늘리기');
  const n = CORE.run({ unit: 'metric', cm: '170', kg: '65', scale: 'who' });
  eq([n.cat, n.dir, n.diffKg], [1, 'in', 0], '170cm 65kg: 정상 범위 안');
  eq(CORE.weightIn(h.maxKg, 'imperial'), 158.6, '정상 상한 72.0kg = 158.6 lb');
  ok(CORE.diffIn(0.001, 'metric') === 0.1 && CORE.diffIn(0, 'metric') === 0, 'diffIn: 0 보다 크면 최소 0.1');
  // 경계 바로 바깥이면 남은 몸무게가 언제나 0 보다 크다 (화면 25.0 인데 "0kg" 이 나오지 않게)
  let edge = 0;
  for (let cm = 150; cm <= 200; cm += 0.5) {
    ['who', 'asia', 'cn'].forEach((s) => {
      const top = CORE.healthyBmi(s)[1];
      const kg = (top + 0.06) * (cm / 100) * (cm / 100);
      const r = CORE.run({ unit: 'metric', cm: String(cm), kg: kg.toFixed(3), scale: s });
      if (r.cat > 1 && r.diffKg > 0 && CORE.diffIn(r.diffKg, 'metric') >= 0.1) edge++; else bad(`경계 밖 남은 몸무게: ${cm}cm ${kg} ${s} → cat ${r.cat} diff ${r.diffKg}`);
    });
  }
  ok(edge === 101 * 3, '경계 밖 남은 몸무게 > 0 (303번)');
  // run(): 빈 칸·started·오류·나이
  eq(CORE.run({ unit: 'metric', cm: '', kg: '', scale: 'who' }), { empty: true, started: false }, 'run: 모두 빈 칸');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '', scale: 'who' }), { empty: true, started: true }, 'run: 키만 → started');
  eq(CORE.run({ unit: 'metric', cm: 'x', kg: '65', scale: 'who' }), { error: 'badNum', field: 'cm' }, 'run: 키 오류');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '6O', scale: 'who' }), { error: 'badNum', field: 'kg' }, 'run: 몸무게 오류');
  eq(CORE.run({ unit: 'metric', cm: '17', kg: '65', scale: 'who' }).error, 'heightRange', 'run: 17cm → heightRange');
  eq(CORE.run({ unit: 'metric', cm: '300', kg: '65', scale: 'who' }).error, 'heightRange', 'run: 300cm → heightRange');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '5', scale: 'who' }).error, 'weightRange', 'run: 5kg → weightRange');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '700', scale: 'who' }).field, 'kg', 'run: 700kg → kg 칸');
  eq(CORE.run({ unit: 'imperial', ft: '5', inch: '12', lb: '150', scale: 'who' }), { error: 'inchRange', field: 'inch' }, "run: 5'12\" → inchRange");
  eq(CORE.run({ unit: 'imperial', ft: '5', inch: '', lb: '', scale: 'who' }), { empty: true, started: true }, 'run: 피트만');
  eq(CORE.run({ unit: 'imperial', ft: '1', inch: '0', lb: '150', scale: 'who' }).error, 'heightRange', "run: 1'0\" → heightRange");
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '65', age: '1', scale: 'who' }), { error: 'ageRange', field: 'age' }, 'run: 1세 → ageRange');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '65', age: '30,5', scale: 'who' }).error, 'ageRange', 'run: 30.5세 → ageRange');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '65', age: 'x', scale: 'who' }).field, 'age', 'run: 나이 badNum');
  const a17 = CORE.run({ unit: 'metric', cm: '170', kg: '65', age: '17', scale: 'who' });
  const a65 = CORE.run({ unit: 'metric', cm: '170', kg: '65', age: '65', scale: 'who' });
  const a30 = CORE.run({ unit: 'metric', cm: '170', kg: '65', age: '', scale: 'who' });
  eq([a17.minor, a17.senior, a65.minor, a65.senior, a30.minor, a30.senior, a30.age], [true, false, false, true, false, false, null], 'run: 미성년·65세 표시');
  eq(CORE.run({ unit: 'metric', cm: '170', kg: '65', scale: 'zzz' }).scale, 'who', 'run: 모르는 기준 → who');
  // 색 막대 위치
  eq([CORE.barPos(10), CORE.barPos(14), CORE.barPos(28), CORE.barPos(42), CORE.barPos(60)], [0, 0, 0.5, 1, 1], 'barPos 0~1');
  // 언어별 아시아 기준
  const ALT = { ko: 'kr', ja: 'jp', zh: 'cn', th: 'asia', vi: 'asia', en: 'asia', fr: 'asia', de: 'asia', es: 'asia', it: 'asia', pt: 'asia', ru: 'asia' };
  Object.entries(ALT).forEach(([l, s]) => eq(CORE.altScale(l), s, `altScale(${l})`));
  eq(G.LOCALES.map((l) => l.code).filter((l) => CORE.asiaDefault(l)).sort(), ['ja', 'ko', 'th', 'vi', 'zh'], '아시아 기준 기본 켜짐 = ko·ja·zh·th·vi');
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(v) {
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shape(v[k]), o), {});
  return typeof v;
}
function keysDiff(a, b, pth, out) {
  if (typeof a !== typeof b || (typeof a === 'string' && a !== b)) { out.push(`${pth || '(루트)'} 모양 다름`); return; }
  if (typeof a !== 'object') return;
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    if (!(k in b)) out.push(`${pth}${k} 없음`);
    else if (!(k in a)) out.push(`${pth}${k} 이 더 있음`);
    else keysDiff(a[k], b[k], `${pth}${k}.`, out);
  });
}
const tokens = (s) => [...new Set(String(s).match(/\{\w+\}/g) || [])].sort().join(',');
function walk(obj, fn, pth = '') {
  if (typeof obj === 'string') return fn(obj, pth);
  if (Array.isArray(obj)) return obj.forEach((v, i) => walk(v, fn, `${pth}[${i}]`));
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, pth ? `${pth}.${k}` : k));
}
const MUST = {
  'num.kg': ['n'], 'num.lb': ['n'], 'num.range': ['min', 'max'],
  'ui.toLose': ['w'], 'ui.toGain': ['w'], 'ui.live': ['bmi', 'cat'],
};
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  ok(langFiles.length === G.LOCALES.length, `언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    ok(!/TODO-TRANSLATE/.test(first), `${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shape(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    if (!diff.length) passes++;
    // 자리표시자: en 에 없는 것을 쓰면 안 되고, 꼭 필요한 것은 있어야 한다
    const enTok = {};
    walk(EN, (s, pth) => { enTok[pth] = tokens(s); });
    walk(T, (s, pth) => {
      if (/^(privacy|faq)/.test(pth) || enTok[pth] == null) return;
      const allowed = enTok[pth].split(',').filter(Boolean);
      tokens(s).split(',').filter(Boolean).forEach((t) => ok(allowed.includes(t), `${tag} ${pth} 에 모르는 자리표시자 ${t}`));
    });
    Object.entries(MUST).forEach(([pth, need]) => {
      const v = get(T, pth);
      need.forEach((k) => ok(typeof v === 'string' && v.includes(`{${k}}`), `${tag} ${pth} 에 {${k}} 없음: ${v}`));
    });
    // 단계 이름 수 = 기준 단계 수
    ok(Array.isArray(T.scales.who.labels) && T.scales.who.labels.length === CORE.SCALES.who.length + 1, `${tag} scales.who.labels 는 ${CORE.SCALES.who.length + 1}개`);
    const alt = CORE.altScale(lang);
    ok(Array.isArray(T.scales.alt.labels) && T.scales.alt.labels.length === CORE.SCALES[alt].length + 1, `${tag} scales.alt.labels 는 ${alt} 기준 ${CORE.SCALES[alt].length + 1}개 (지금 ${T.scales.alt.labels.length})`);
    [...T.scales.who.labels, ...T.scales.alt.labels].forEach((s) => ok(typeof s === 'string' && s.trim() && width(s) <= 26, `${tag} 단계 이름이 비었거나 김: ${s}`));
    ok(T.ui.disclaimer.length === 3 && T.ui.disclaimer.every((s) => s.length > 10), `${tag} ui.disclaimer 3줄`);
    ok(/18/.test(T.ui.disclaimer.join(' ')) && /18/.test(T.ui.under18), `${tag} 성인(18세 이상) 안내`);
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.finish', 'ui.waiting', 'ui.again', 'ui.under18', 'ui.rangeTitle', 'errors.heightRange', 'scales.alt.note'].forEach((pth) => ok(get(T, pth) !== get(EN, pth), `${tag} ${pth} 가 en 과 같음(번역 안 됨)`));
      ok(T.faq[0].q !== EN.faq[0].q && T.ui.disclaimer[0] !== EN.ui.disclaimer[0], `${tag} faq·disclaimer 가 en 과 같음`);
    }
    Object.entries(T.errors).forEach(([k, v]) => ok(typeof v === 'string' && v.length > 5, `${tag} errors.${k} 비었음`));
    // 360px 폭 문구 (단위 반반 · 성별 3칸 · 입력 라벨 · 버튼)
    [['ui.metric', 18], ['ui.imperial', 18], ['ui.sexNone', 14], ['ui.female', 14], ['ui.male', 14], ['ui.finish', 28], ['ui.again', 30], ['ui.asiaToggle', 24],
      ['ui.more', 40], ['ui.less', 40], ['ui.height', 16], ['ui.weight', 16], ['ui.age', 16], ['ui.years', 5], ['ui.cm', 4], ['ui.kg', 4], ['ui.ft', 4], ['ui.inch', 4], ['ui.lb', 4],
      ['hero.h1Kicker', 30], ['scales.alt.name', 22], ['scales.who.name', 22]].forEach(([pth, max]) => { const v = get(T, pth); ok(typeof v === 'string' && v.trim() && width(v) <= max, `${tag} ${pth} 가 김 (폭 ${width(v)} > ${max}): ${v}`); });
    ok(/<em>/.test(T.hero.h1Html) && !/<(?!\/?(br|em)>)/.test(T.hero.h1Html), `${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      ok(f.q && f.a && !/<|>/.test(f.q + f.a), `${tag} faq[${i}] 비었거나 HTML`);
      ok(!/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q), `${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (lang !== 'ko') walk(T, (s, pth) => ok(!/[가-힯]/.test(s), `${tag} ${pth} 에 한글`));
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    ok(T.meta.title.toLowerCase().startsWith(APP.title[lang].toLowerCase()), `${tag} meta.title 이 현지 검색어(app.config title "${APP.title[lang]}")로 시작하지 않음`);
    ok(T.siteName === APP.title[lang], `${tag} siteName 이 app.config title 과 다름`);
    ok(T.hero.h1Kicker === APP.title[lang], `${tag} h1 검색어가 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    ok(len(title) <= (cjk ? 40 : 78), `${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    ok(dl >= (cjk ? 50 : 100) && dl <= (cjk ? 130 : 230), `${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, pth) => { const t = s.replace(/https?:\/\/\S+/g, '').replace(/\{\w+\}/g, 'x'); if (/[^\s«(  ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t)) bad(`${tag} ${pth} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 50)}`); });
    if (lang === 'ru') ok(/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css), `${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi') ok(/Be\+Vietnam|Plus\+Jakarta|Baloo/.test(T.fonts.css), `${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
    if (lang === 'th') ok(/Mitr|Prompt|Kanit|Noto\+Sans\+Thai/.test(T.fonts.css), `${tag} 태국어 글꼴이 아님`);
  });
  // 현지 검색어 (작업 지시)
  const SEO = { en: 'BMI Calculator', ko: 'BMI 계산기', ja: 'BMI計算', zh: 'BMI计算器', fr: 'Calcul IMC', de: 'BMI Rechner', th: 'คำนวณ BMI', vi: 'Tính BMI', es: 'Calcular IMC', it: 'Calcolo BMI', pt: 'Calcular IMC', ru: 'Калькулятор ИМТ' };
  Object.entries(SEO).forEach(([l, s]) => ok(L10N[l].meta.title.startsWith(s) && APP.title[l] === s, `[${l}] 제목 검색어 "${s}"`));
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-bmi"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  ok(title && title.trim(), `${tag} <title> 없음`);
  ok(html.includes(`<html lang="${lang}">`), `${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  ok(h1s === 1, `${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  ok(hl === G.LOCALES.length + 1, `${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  ok(/hreflang="x-default"/.test(html), `${tag} x-default 없음`);
  ok(/<link rel="canonical" href="https:\/\/bmi\.example\.com\//.test(html), `${tag} canonical 없음`);
  ok(/<header class="mg-top">/.test(html), `${tag} 공통 타이틀 바(G.topBar) 없음`);
  ok(!/FAQPage/.test(html), `${tag} FAQPage JSON-LD 금지`);
  ok(!/aggregateRating/.test(html), `${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bmi\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  ok(og, `${tag} og:image 없음`);
  if (og) ok(fs.existsSync(path.join(SITE, og)) && fs.readFileSync(path.join(SITE, og)).readUInt32BE(16) === 1200, `${tag} og:image 파일 없음/크기 다름 ${og} (node tools/gen-og.js all)`);
  ok(/og:locale/.test(html), `${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 공통 스크립트 순서가 다름`);
  ok(!/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html), `${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  ok(!/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, '')), `${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant) ok(/noindex/.test(html), `${tag} 숨은 변형(_l)은 noindex`);
  else ok(!/noindex/.test(html), `${tag} 언어 폴더 페이지에 noindex`);
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
      ok(html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`), `${tag} title 이 "검색어 | 브랜드" 가 아님`);
      ok(/"@type":"WebApplication"/.test(html) && /"applicationCategory":"MultimediaApplication"/.test(html), `${tag} appLd(WebApplication, create) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-bmi) 없음`); return; }
      ok(!/<section id="screen-bmi"[^>]*hidden/.test(html), `${tag} 첫 화면이 hidden`);
      ok((html.match(/<section[\s>]/g) || []).length === 1, `${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      ok((S.match(/class="mg-ad\b/g) || []).length === 1 && /<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S), `${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      ok((html.match(/class="mg-ad\b/g) || []).length === 1, `${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      ok(S.includes(`<span class="bm-kicker">${G.esc(T.hero.h1Kicker)}</span>`), `${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const order = ['class="bm-h1"', 'data-unit="metric"', 'data-unit="imperial"', 'id="in-cm"', 'id="in-kg"', 'id="in-ft"', 'id="in-inch"', 'id="in-lb"', 'id="more-btn"', 'id="in-age"', 'id="asia-toggle"',
        'id="out"', 'id="bar"', 'id="range"', 'class="bm-disc"', 'id="finish-btn"', 'id="finish-err"', 'id="result"', 'id="summary-card"', '<div data-mg-end="bmi"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 첫 화면 순서(h1 → 단위 → 입력 → 결과 → 알아 둘 점 → 요약 보기 → 요약 → 끝 화면 → 광고)가 아님`);
      ok((S.match(/inputmode="decimal"/g) || []).length === 5 && (S.match(/inputmode="numeric"/g) || []).length === 1 && !/type="number"/.test(S), `${tag} 입력 칸 = type=text inputmode=decimal 5개 + numeric 1개 ("," 입력 허용)`);
      ok(!/<input[^>]*\svalue=/.test(S), `${tag} 입력 칸에 미리 채운 값`);
      ok(/data-unit="metric" aria-pressed="true"/.test(S) && /data-unit-box="imperial" hidden/.test(S), `${tag} 처음엔 cm·kg (저장된 단위는 JS 가 적용)`);
      ok(/id="more-box" class="bm-more-box" hidden/.test(S) && /aria-expanded="false"/.test(S), `${tag} 나이·성별은 처음에 접힘(선택)`);
      ok(/id="asia-toggle" role="switch" checked/.test(S) === CORE.asiaDefault(lang), `${tag} 아시아 기준 기본값 ${CORE.asiaDefault(lang) ? '켜짐' : '꺼짐'}`);
      ok(/<div id="result" class="bm-result" hidden>/.test(S), `${tag} 요약·끝 화면(#result)은 처음에 hidden`);
      ok((html.match(/data-mg-end=/g) || []).length === 1, `${tag} data-mg-end 는 1개`);
      ok(/id="live" class="visually-hidden" aria-live="polite"/.test(S), `${tag} 결과 읽어 주기(aria-live) 없음`);
      ok(/class="bm-err" id="out-err" role="alert" hidden/.test(S) && /id="finish-err" class="bm-error" role="alert" hidden/.test(S), `${tag} 오류 안내(role=alert) 없음`);
      ok(T.ui.disclaimer.every((d) => S.includes(G.esc(d))), `${tag} 알아 둘 점(의학적 조언 아님·근육·임신·성인) 3줄`);
      ok(!/mg-faq|<details/.test(S), `${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      ok(!T.faq.some((q) => bodyNoJson.includes(G.esc(q.q))), `${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ok(/window\.MG_FAQ = \[/.test(html), `${tag} MG_FAQ 없음`);
      ok(/window\.PAGE_I18N = /.test(html), `${tag} PAGE_I18N 없음`);
      ok(html.indexOf('bmi-core.js') > 0 && html.indexOf('bmi-core.js') < html.indexOf('bmi.js"'), `${tag} bmi-core.js 가 bmi.js 보다 먼저여야 함`);
      ok(/family=Space\+Grotesk/.test(html), `${tag} 숫자 글꼴(Space Grotesk) 없음`);
      ok(/guide\.html/.test(html) && /<meta name="mg-guide"/.test(html), `${tag} 가이드 링크(gen-guides) 없음`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  ok(pages === G.LOCALES.length * 4, `생성 페이지 ${pages}개 ≠ ${G.LOCALES.length * 4}`);
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  ok(urls === G.LOCALES.length, `sitemap.xml URL ${urls}개 ≠ ${G.LOCALES.length} (guide 제외)`);
  ok((sm.match(/<loc>[^<]*guide\.html/g) || []).length === G.LOCALES.length, 'sitemap.xml 에 guide.html 12개');
  ok(/<lastmod>/.test(sm) && /xhtml:link/.test(sm), 'sitemap lastmod·xhtml:link');
  return pages;
}

// ---------------------------------------------------------------- 4) 그 밖
function checkMisc() {
  ok(APP.id === 'bmi' && APP.category === 'create' && APP.added === '2026-10-24' && APP.order === 1 && APP.emoji === '⚖️' && APP.path === 'https://bmi.example.com/', 'app.config.js 기본값');
  G.LOCALES.forEach(({ code }) => { ok(APP.title[code] && APP.desc[code], `app.config ${code} 제목·설명`); ok(width(APP.title[code]) <= 20, `app.config title ${code} 가 김(포털 아이콘): ${APP.title[code]}`); });
  ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg');
  let link = '';
  try { link = fs.readlinkSync(path.join(SITE, 'shared')); } catch (e) { /* noop */ }
  ok(link === '../../shared', 'shared → ../../shared 심볼릭 링크');
  const src = read('bmi.js');
  const js = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');   // 주석 빼고
  ok((js.match(/track\('start'\)/g) || []).length === 1 && (js.match(/track\('done'\)/g) || []).length === 1, 'bmi.js: track start/done 각 1곳');
  ok(/setRetry\(/.test(js) && /setShareData\(/.test(js), 'bmi.js: setRetry·setShareData');
  const storeCalls = js.match(/localStorage\.(get|set|remove)Item\([^)]*\)/g) || [];
  ok(storeCalls.length === 2 && storeCalls.every((s) => /UNIT_KEY/.test(s)) && /UNIT_KEY = 'mg_bmi_unit'/.test(js), 'bmi.js: localStorage 는 마지막 단위(mg_bmi_unit)만');
  ok(!/sessionStorage|indexedDB|document\.cookie/.test(js), 'bmi.js: 다른 저장소 없음');
  ok((js.match(/try \{ return window\.localStorage/g) || []).length === 1 && (js.match(/try \{ window\.localStorage/g) || []).length === 1, 'bmi.js: localStorage 를 try/catch 로 감쌈');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js), 'bmi.js: 서버 전송 없음');
  ok(!/location\.hash\s*=|history\.(push|replace)State|#d=/.test(js), 'bmi.js: 주소에 숫자를 넣지 않음');
  ok(/mgCleanUrl/.test(js), 'bmi.js: 공유 주소 = mgCleanUrl');
  ok(/shareText/.test(js) && !/shareText[^;]*res\./.test(js), 'bmi.js: 공유 문구는 고정(숫자 없음)');
  ok(!/[가-힯]/.test(js), 'bmi.js: 코드에 화면 문구(한글) 없음');
  const core = read('bmi-core.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok(!/fetch\(|XMLHttpRequest|localStorage|document\./.test(core), 'bmi-core.js: 화면·저장·전송 없음(순수 로직)');
}

checkLogic();
checkLocales();
const pages = checkHtml();
checkMisc();

if (problems.length) {
  console.log(`\n✗ check-bmi: 문제 ${problems.length}건 (통과 ${passes})`);
  problems.forEach((m) => console.log('  - ' + m));
  process.exit(1);
}
console.log(`PASS check-bmi: 로직·언어 12개·HTML ${pages}쪽·사이트맵 — 검사 ${passes}건 통과`);
