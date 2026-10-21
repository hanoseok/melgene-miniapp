#!/usr/bin/env node
/**
 * 퍼센트 계산기 검사 (Node, 브라우저 없음 — 실제 화면 흐름은 tools/check-flow.js).
 *   1) 로직(percent-core.js): 언어별 소수점(decimalSep), 입력 해석(parseNum — "," "." 둘 다, 자릿수 구분, 공백·%·부호·전각 숫자, 잘못된 입력),
 *      부동소수 정리(clean: 0.1+0.2, 1/3, -0), 6가지 계산(of·what·change·adjust·reverse·points)의 값과 오류(divZero·fromZero·over100·tooBig),
 *      run() 의 빈 칸·오류 칸 표시, 역산 = 원래 값으로 되돌림(무작위 300번).
 *   2) 언어 파일 12개: en.js 와 키 구조 동일, TODO-TRANSLATE 없음, 자리표시자 같음(언어마다 쓰는 것만 — 빠진 핵심 자리표시자 없음),
 *      FAQ 3~5개("무료인가요?" 류 금지), 제목·설명 길이, 360px 폭 문구(탭·버튼·칩), h1 검색어 = app.config title, num 형식,
 *      한국어 파일 밖에 한글 없음, fr 좁은 공백, ru 키릴 글꼴, vi 성조 글꼴, th 태국어 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title = "검색어 | 브랜드" / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(create) / FAQPage 없음 / 첫 화면(#screen-percent) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 탭 6개 → 카드 6개(첫 카드만 보임) → 요약 보기 → 결과(#result, 처음 hidden) → data-mg-end="percent" 순서,
 *      입력 칸 inputmode=decimal 12개, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), app.config.js, favicon, shared 링크, percent.js 규칙(track·서버 전송 없음·저장은 탭만·공유 깨끗한 주소).
 *
 * 실행: node tools/check-percent.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'percent-core.js'));
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
const get = (o, pth) => pth.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

// ---------------------------------------------------------------- 1) 로직
function checkLogic() {
  // 소수점
  const DEC = { en: '.', ja: '.', zh: '.', ko: '.', th: '.', fr: ',', de: ',', vi: ',', es: ',', it: ',', pt: ',', ru: ',' };
  Object.entries(DEC).forEach(([l, d]) => eq(CORE.decimalSep(l), d, `decimalSep(${l})`));
  // 입력 해석 [입력, 언어 소수점, 기대값 | 'empty' | 'badNum' | 'tooBig']
  const P = [
    ['15', '.', 15], ['  15 ', '.', 15], ['15%', '.', 15], ['15 %', ',', 15], ['12.5', '.', 12.5], ['12,5', '.', 12.5], ['12,5', ',', 12.5], ['12.5', ',', 12.5],
    ['1,250', '.', 1250], ['1.250', ',', 1250], ['1.250', '.', 1.25], ['1,250', ',', 1.25], ['1,234.56', '.', 1234.56], ['1.234,56', '.', 1234.56], ['1.234,56', ',', 1234.56],
    ['1,234,567', '.', 1234567], ['1.234.567', ',', 1234567], ['1 234 567,8', ',', 1234567.8], ['1 234,5', ',', 1234.5], ['1 234,5', ',', 1234.5], ["1'000", '.', 1000],
    ['-12.5', '.', -12.5], ['−12,5', ',', -12.5], ['+3', '.', 3], ['.5', '.', 0.5], [',5', ',', 0.5], ['5.', '.', 5], ['0', '.', 0], ['-0', '.', 0],
    ['１２．５', '.', 12.5], ['50％', '.', 50],
    ['', '.', 'empty'], ['   ', '.', 'empty'], ['%', '.', 'empty'], ['abc', '.', 'badNum'], ['1e5', '.', 'badNum'], ['12a', '.', 'badNum'], ['-', '.', 'badNum'], ['1,2.3', '.', 'badNum'],
    ['12,34,5', '.', 'badNum'], ['1..2', '.', 'badNum'], ['1,2,3.4', '.', 'badNum'], ['--5', '.', 'badNum'], ['Infinity', '.', 'badNum'], ['1000000000000000', '.', 'tooBig'],
  ];
  P.forEach(([s, d, want]) => {
    const r = CORE.parseNum(s, d);
    const got = r.empty ? 'empty' : r.error ? r.error : r.value;
    ok(Object.is(got, want) || got === want, `parseNum(${JSON.stringify(s)}, '${d}') = ${got} ≠ ${want}`);
  });
  ok(!Object.is(CORE.parseNum('-0', '.').value, -0), 'parseNum(-0) 은 0');
  // clean
  eq(CORE.clean(0.1 + 0.2), 0.3, 'clean(0.1+0.2)');
  eq(CORE.clean(1 / 3 * 100), 33.3333333333, 'clean(100/3) 소수 10자리');
  eq(CORE.clean(2.675 * 100), 267.5, 'clean(267.49999…)');
  eq(CORE.clean(1.005 * 1000), 1005, 'clean(1004.999…)');
  ok(Object.is(CORE.clean(-0), 0) && Object.is(CORE.clean(-1e-12), 0), 'clean(-0) = 0');
  ok(Number.isNaN(CORE.clean(Infinity)), 'clean(Infinity) = NaN');
  // 6가지 계산
  const c = (m, a, b, d) => { const r = CORE.compute(m, a, b, d); return r.error || r; };
  eq(c('of', 15, 200).r, 30, '200 의 15%');
  eq(c('of', 0.1, 0.2).r, 0.0002, '0.2 의 0.1%');
  eq(c('of', 33, 1).r, 0.33, '1 의 33%');
  eq(c('of', 150, 80).r, 120, '80 의 150%');
  eq(c('of', -10, 50).r, -5, '50 의 −10%');
  eq(c('what', 30, 120).r, 25, '30 은 120 의 25%');
  eq(c('what', 1, 3).r, 33.3333333333, '1/3 = 33.3333333333%');
  eq(c('what', 2, 3).r, 66.6666666667, '2/3 = 66.6666666667%');
  eq(c('what', 0, 5).r, 0, '0 은 5 의 0%');
  eq(c('what', 5, 0), 'divZero', 'what: Y = 0 → divZero');
  eq([c('change', 80, 100).r, c('change', 80, 100).d], [25, 20], '80 → 100 = +25%');
  eq([c('change', 100, 87.5).r, c('change', 100, 87.5).d], [-12.5, -12.5], '100 → 87.5 = −12.5%');
  eq(c('change', 100, 80).r, -20, '100 → 80 = −20%');
  eq(c('change', 50, 50).r, 0, '같은 값 = 0%');
  eq(c('change', -50, -25).r, 50, '−50 → −25 = +50% (기준 |A|)');
  eq(c('change', 0, 5), 'fromZero', 'change: A = 0 → fromZero');
  eq([c('adjust', 120, 20, 'down').r, c('adjust', 120, 20, 'down').s, c('adjust', 120, 20, 'down').dir], [96, 24, 'down'], '120 − 20% = 96 (24 절약)');
  eq([c('adjust', 59.9, 30, 'down').r, c('adjust', 59.9, 30, 'down').s], [41.93, 17.97], '59.9 − 30% = 41.93');
  eq([c('adjust', 100, 10, 'up').r, c('adjust', 100, 10, 'up').s], [110, 10], '100 + 10% = 110');
  eq(c('adjust', 100, 100, 'down').r, 0, '100 − 100% = 0');
  eq(c('adjust', 100, 101, 'down'), 'over100', 'adjust: 101% 할인 → over100');
  eq(c('adjust', 100, 250, 'up').r, 350, '100 + 250% = 350 (인상은 100% 넘어도 됨)');
  eq(CORE.compute('adjust', 100, 20).dir, 'down', 'adjust 기본 방향 = down');
  const rv = c('reverse', 96, 20, 'up');
  eq([rv.r, rv.f, rv.d, rv.w], [80, 1.2, 16, 76.8], '20% 늘어 96 → 원래 80 (흔한 실수 76.8)');
  const rd = c('reverse', 80, 20, 'down');
  eq([rd.r, rd.f, rd.d, rd.w], [100, 0.8, -20, 96], '20% 줄어 80 → 원래 100 (흔한 실수 96)');
  eq(c('reverse', 110, 10, 'up').r, 110 / 1.1 === 100 ? 100 : CORE.clean(110 / 1.1), '부가세 10% 포함 110 → 100');
  eq(c('reverse', 110, 10, 'up').r, 100, '110 ÷ 1.1 = 100 (부동소수 정리)');
  eq(c('reverse', 5, 100, 'down'), 'over100', 'reverse: 100% 감소 → over100');
  eq(c('reverse', 5, 120, 'down'), 'over100', 'reverse: 120% 감소 → over100');
  eq(c('reverse', 5, 0, 'up').r, 5, 'reverse: 0% → 그대로');
  eq([c('points', 3.5, 5.25).r, c('points', 3.5, 5.25).rel], [1.75, 50], '3.5% → 5.25% = +1.75%p (상대 +50%)');
  eq([c('points', 4, 6).r, c('points', 4, 6).rel], [2, 50], '4% → 6% = +2%p (+50%)');
  eq([c('points', 6, 4).r, c('points', 6, 4).rel], [-2, -33.3333333333], '6% → 4% = −2%p');
  eq(c('points', 0, 3).rel, null, '0% → 3%: 상대 변화율 없음');
  eq(c('of', 1e14, 1e14), 'tooBig', '너무 큰 결과 → tooBig');
  eq(c('zzz', 1, 2), 'badMode', '모르는 계산');
  eq(CORE.compute('of', NaN, 2).error, 'badNum', 'NaN 입력');
  // run
  eq(CORE.run('of', '', '200', null, '.'), { empty: true }, 'run: 빈 칸 → empty');
  eq(CORE.run('of', 'x', '200', null, '.'), { error: 'badNum', field: 'a' }, 'run: 첫 칸 오류');
  eq(CORE.run('of', '15', '2,00,0', null, '.'), { error: 'badNum', field: 'b' }, 'run: 둘째 칸 오류');
  eq(CORE.run('what', '5', '0', null, '.').field, 'b', 'run: divZero 는 둘째 칸');
  eq(CORE.run('change', '0', '5', null, '.').field, 'a', 'run: fromZero 는 첫 칸');
  eq(CORE.run('of', '15', '1.250,5', null, ',').r, 187.575, 'run: de 형식 1.250,5');
  eq(CORE.run('adjust', '1,299', '15', 'down', '.').r, 1104.15, 'run: 1,299 − 15%');
  // 역산 = 되돌림 (무작위)
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  let roundTrip = 0;
  for (let i = 0; i < 300; i++) {
    const base = Math.round(rnd() * 1e6) / 100, pct = Math.round(rnd() * 9900) / 100, dir = rnd() < 0.5 ? 'up' : 'down';
    const after = CORE.compute('adjust', base, pct, dir).r;
    const back = CORE.compute('reverse', after, pct, dir).r;
    if (Math.abs(back - base) <= Math.max(1e-6, Math.abs(base) * 1e-9)) roundTrip++;
    else bad(`역산 되돌림 실패: ${base} ${dir} ${pct}% → ${after} → ${back}`);
  }
  ok(roundTrip === 300, '역산 되돌림 300번');
  eq(CORE.MODES, ['of', 'what', 'change', 'adjust', 'reverse', 'points'], 'MODES 순서');
  eq(CORE.CHIPS, [10, 20, 30, 50], '할인 칩');
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
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, pth ? `${pth}.${k}` : k));
}
// 문구마다 꼭 있어야 하는 자리표시자 (없으면 결과가 빠진다)
const MUST = {
  'modes.of.lead': ['b'], 'modes.of.how': ['r'], 'modes.of.copy': ['r'],
  'modes.what.lead': ['a', 'b'], 'modes.what.how': ['pr'], 'modes.what.copy': ['pr'],
  'modes.change.lead': ['a', 'b'], 'modes.change.up': ['d'], 'modes.change.down': ['d'], 'modes.change.how': ['base', 'sr'], 'modes.change.copy': ['sr'],
  'modes.adjust.leadDown': ['a', 'pb'], 'modes.adjust.leadUp': ['a', 'pb'], 'modes.adjust.saveDown': ['s'], 'modes.adjust.saveUp': ['s'],
  'modes.adjust.howDown': ['r', 's'], 'modes.adjust.howUp': ['r', 's'], 'modes.adjust.copyDown': ['r'], 'modes.adjust.copyUp': ['r'],
  'modes.reverse.leadDown': ['pb'], 'modes.reverse.leadUp': ['pb'], 'modes.reverse.howDown': ['f', 'r'], 'modes.reverse.howUp': ['f', 'r'],
  'modes.reverse.diff': ['d'], 'modes.reverse.wrongDown': ['w'], 'modes.reverse.wrongUp': ['w'], 'modes.reverse.copy': ['r'],
  'modes.points.lead': ['pa', 'pb'], 'modes.points.rel': ['rel'], 'modes.points.how': ['spp'], 'modes.points.copy': ['spp'],
  'num.pct': ['n'], 'num.pp': ['n'], 'ui.live': ['text'],
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
      if (/^(privacy|faq)\./.test(pth) || enTok[pth] == null) return;
      const allowed = enTok[pth].split(',').filter(Boolean);
      tokens(s).split(',').filter(Boolean).forEach((t) => ok(allowed.includes(t) || /^\{(a|b|pa|pb)\}$/.test(t), `${tag} ${pth} 에 모르는 자리표시자 ${t}`));
    });
    Object.entries(MUST).forEach(([pth, need]) => {
      const v = get(T, pth);
      need.forEach((k) => ok(typeof v === 'string' && v.includes(`{${k}}`), `${tag} ${pth} 에 {${k}} 없음: ${v}`));
    });
    ok(T.num.plus === '+' && T.num.minus === '−', `${tag} num.plus/minus 는 + / −(U+2212)`);
    ok(T.ui.pctSuffix === '%', `${tag} ui.pctSuffix = %`);
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.finish', 'ui.copy', 'ui.waiting', 'ui.again', 'modes.of.title', 'modes.points.title', 'errors.divZero'].forEach((pth) => ok(get(T, pth) !== get(EN, pth), `${tag} ${pth} 가 en 과 같음(번역 안 됨)`));
      ok(T.faq[0].q !== EN.faq[0].q, `${tag} faq 가 en 과 같음`);
    }
    Object.entries(T.errors).forEach(([k, v]) => ok(typeof v === 'string' && v.length > 5, `${tag} errors.${k} 비었음`));
    CORE.MODES.forEach((m) => ['tab', 'title', 'desc', 'a', 'b'].forEach((k) => ok(typeof T.modes[m][k] === 'string' && T.modes[m][k].trim(), `${tag} modes.${m}.${k} 비었음`)));
    // 360px 폭 문구 (탭 3칸 두 줄 · 반반 버튼 · 칩 4칸 · 입력 라벨 2칸)
    CORE.MODES.forEach((m) => ok(width(T.modes[m].tab) <= 22, `${tag} modes.${m}.tab 가 김 (폭 ${width(T.modes[m].tab)} > 22): ${T.modes[m].tab}`));
    CORE.MODES.forEach((m) => ['a', 'b'].forEach((k) => ok(width(T.modes[m][k]) <= 26, `${tag} modes.${m}.${k} 라벨이 김 (폭 ${width(T.modes[m][k])} > 26): ${T.modes[m][k]}`)));
    ['adjust', 'reverse'].forEach((m) => ['down', 'up'].forEach((k) => ok(width(T.modes[m][k]) <= 22, `${tag} modes.${m}.${k} 가 김 (폭 ${width(T.modes[m][k])}): ${T.modes[m][k]}`)));
    [['ui.finish', 28], ['ui.copy', 22], ['ui.again', 30], ['hero.h1Kicker', 30], ['modes.adjust.chips', 30]].forEach(([pth, max]) => { const v = get(T, pth); ok(typeof v === 'string' && width(v) <= max, `${tag} ${pth} 가 김 (폭 ${width(v)} > ${max}): ${v}`); });
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
  // seo 검색어 (작업 지시의 현지 검색어)
  const SEO = { en: 'Percentage Calculator', ko: '퍼센트 계산기', ja: 'パーセント計算', zh: '百分比计算器', fr: 'Calcul pourcentage', de: 'Prozentrechner', th: 'คำนวณเปอร์เซ็นต์', vi: 'Tính phần trăm', es: 'Calcular porcentaje', it: 'Calcolo percentuale', pt: 'Calcular porcentagem', ru: 'Калькулятор процентов' };
  Object.entries(SEO).forEach(([l, s]) => ok(L10N[l].meta.title.startsWith(s) && APP.title[l] === s, `[${l}] 제목 검색어 "${s}"`));
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-percent"[\s\S]*?<\/section>/);
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
  ok(/<link rel="canonical" href="https:\/\/percent\.example\.com\//.test(html), `${tag} canonical 없음`);
  ok(/<header class="mg-top">/.test(html), `${tag} 공통 타이틀 바(G.topBar) 없음`);
  ok(!/FAQPage/.test(html), `${tag} FAQPage JSON-LD 금지`);
  ok(!/aggregateRating/.test(html), `${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/percent\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!S) { bad(`${tag} 첫 화면(#screen-percent) 없음`); return; }
      ok(!/<section id="screen-percent"[^>]*hidden/.test(html), `${tag} 첫 화면이 hidden`);
      ok((html.match(/<section[\s>]/g) || []).length === 1, `${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      ok((S.match(/class="mg-ad\b/g) || []).length === 1 && /<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S), `${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      ok((html.match(/class="mg-ad\b/g) || []).length === 1, `${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      ok(S.includes(`<span class="pc-kicker">${G.esc(T.hero.h1Kicker)}</span>`), `${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const order = ['class="pc-h1"', 'role="tablist"', ...CORE.MODES.map((m) => `id="tab-${m}"`), ...CORE.MODES.map((m) => `id="panel-${m}"`), 'id="finish-btn"', 'id="finish-err"', 'id="result"', 'id="summary-card"', '<div data-mg-end="percent"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 첫 화면 순서(h1 → 탭 → 카드 → 요약 보기 → 요약 → 끝 화면 → 광고)가 아님`);
      ok((S.match(/role="tab"/g) || []).length === 6 && (S.match(/role="tabpanel"/g) || []).length === 6, `${tag} 탭·카드 6개씩`);
      ok((S.match(/aria-selected="true"/g) || []).length === 1 && /id="tab-of"[^>]*aria-selected="true"/.test(S), `${tag} 처음 선택된 탭 = of 하나`);
      ok(!/id="panel-of"[^>]*hidden/.test(S) && CORE.MODES.slice(1).every((m) => new RegExp(`id="panel-${m}"[^>]*hidden`).test(S)), `${tag} 처음엔 첫 카드만 보임`);
      ok((S.match(/inputmode="decimal"/g) || []).length === 12 && !/type="number"/.test(S), `${tag} 입력 칸 12개 = type=text inputmode=decimal ("," 입력 허용)`);
      ok(!/<input[^>]*\svalue=/.test(S), `${tag} 입력 칸에 미리 채운 값`);
      ok((S.match(/class="pc-chip"/g) || []).length === 4, `${tag} 할인 칩 4개`);
      ok((S.match(/data-copy/g) || []).length === 6 && (S.match(/data-how\b/g) || []).length === 6, `${tag} 카드마다 복사 버튼·계산식 줄`);
      ok(/<div id="result" class="pc-result" hidden>/.test(S), `${tag} 요약·끝 화면(#result)은 처음에 hidden`);
      ok((html.match(/data-mg-end=/g) || []).length === 1, `${tag} data-mg-end 는 1개`);
      ok(/id="live" class="visually-hidden" aria-live="polite"/.test(S), `${tag} 결과 읽어 주기(aria-live) 없음`);
      ok(/id="finish-err" class="pc-error" role="alert" hidden/.test(S), `${tag} 오류 안내(role=alert) 없음`);
      ok(!/mg-faq|<details/.test(S), `${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      ok(!T.faq.some((q) => bodyNoJson.includes(G.esc(q.q))), `${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ok(/window\.MG_FAQ = \[/.test(html), `${tag} MG_FAQ 없음`);
      ok(/window\.PAGE_I18N = /.test(html), `${tag} PAGE_I18N 없음`);
      ok(html.indexOf('percent-core.js') > 0 && html.indexOf('percent-core.js') < html.indexOf('percent.js"'), `${tag} percent-core.js 가 percent.js 보다 먼저여야 함`);
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
  ok(APP.id === 'percent' && APP.category === 'create' && APP.added === '2026-10-22' && APP.order === 1 && APP.emoji === '💯' && APP.path === 'https://percent.example.com/', 'app.config.js 기본값');
  G.LOCALES.forEach(({ code }) => { ok(APP.title[code] && APP.desc[code], `app.config ${code} 제목·설명`); ok(width(APP.title[code]) <= 28, `app.config title ${code} 가 김(포털 아이콘): ${APP.title[code]}`); });
  ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg');
  let link = '';
  try { link = fs.readlinkSync(path.join(SITE, 'shared')); } catch (e) { /* noop */ }
  ok(link === '../../shared', 'shared → ../../shared 심볼릭 링크');
  const js = read('percent.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');   // 주석 빼고
  ok((js.match(/track\('start'\)/g) || []).length === 1 && (js.match(/track\('done'\)/g) || []).length === 1, 'percent.js: track start/done 각 1곳');
  ok(/setRetry\(/.test(js) && /setShareData\(/.test(js), 'percent.js: setRetry·setShareData');
  const storeCalls = js.match(/localStorage\.(get|set|remove)Item\([^)]*\)/g) || [];
  ok(storeCalls.length === 2 && storeCalls.every((s) => /MODE_KEY/.test(s)) && /MODE_KEY = 'mg_percent_mode'/.test(js), 'percent.js: localStorage 는 마지막 탭(mg_percent_mode)만');
  ok(!/sessionStorage|indexedDB|document\.cookie/.test(js), 'percent.js: 다른 저장소 없음');
  ok((js.match(/try \{ return window\.localStorage/g) || []).length === 1 && (js.match(/try \{ window\.localStorage/g) || []).length === 1, 'percent.js: localStorage 를 try/catch 로 감쌈');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js), 'percent.js: 서버 전송 없음');
  ok(!/location\.hash\s*=|history\.(push|replace)State|#d=/.test(js), 'percent.js: 주소에 숫자를 넣지 않음');
  ok(/mgCleanUrl/.test(js), 'percent.js: 공유 주소 = mgCleanUrl');
  ok(/maximumFractionDigits: 10/.test(js), 'percent.js: 소수 10자리까지 표시');
  ok(!/[가-힯]/.test(read('percent.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')), 'percent.js: 코드에 화면 문구(한글) 없음');
}

checkLogic();
checkLocales();
const pages = checkHtml();
checkMisc();

if (problems.length) {
  console.log(`\n✗ check-percent: 문제 ${problems.length}건 (통과 ${passes})`);
  problems.forEach((m) => console.log('  - ' + m));
  process.exit(1);
}
console.log(`PASS check-percent: 로직·언어 12개·HTML ${pages}쪽·사이트맵 — 검사 ${passes}건 통과`);
