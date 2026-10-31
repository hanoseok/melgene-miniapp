#!/usr/bin/env node
/**
 * 손가락 룰렛 검사.
 *   1) 로직(finger-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), 설정 정리(normalize)·최소 인원(minTouches)·canDecide,
 *      기다림 시계(holdProgress/holdDone), 공정성 카이제곱(p = 0.001, 진짜 난수라 한 번 걸리면 한 번 더 뽑아 두 번 연속일 때만 실패):
 *      1명 뽑기 2~10개 손가락마다 고르게 · 여러 명 뽑기에서 각 손가락이 뽑히는 횟수 고르게 + 뽑힌 수 = N·서로 다름 ·
 *      팀 나누기에서 팀 크기 차이 ≤ 1, 한 사람이 어느 팀에 가는지 고르게, 팀 크기 분포(시작 팀)도 고르게, decide 모양, 기록 10개.
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, 번역됨, FAQ 3~5개(getRandomValues, "무료인가요?"·인기순 류 금지),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴(th·vi·zh·ru 글자), ru 는 «ты», 한글은 ko 파일만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 순서, 판 화면·결과 처음 hidden, 결과 안 마지막이 data-mg-end="finger", FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지 1200×630 PNG, app.config.js, favicon, shared 링크, finger.js 규칙
 *      (Math.random 없음, track start/done 1곳씩, Pointer Events + touch-action:none + 스크롤·길게 누르기 막기, 뽑기는 decide 안 CORE.decide, 진동 확인, 움직임 줄이기, 기록은 메모리에만).
 *
 * 실행: node tools/check-finger.js   (tools/check-all.js 가 apps/finger 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'finger-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎⁠]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32, 8: 26.12, 9: 27.88, 10: 29.59, 11: 31.26 };
function chi(counts, expected) {
  const N = counts.reduce((a, b) => a + b, 0);
  return counts.reduce((a, x, i) => { const e = expected ? expected[i] * N : N / counts.length; return a + (x - e) * (x - e) / e; }, 0);
}
// 진짜 난수라 검사 여러 개 중 하나가 우연히 걸릴 수 있다(p = 0.001) — 한 번 더 뽑아 두 번 연속 넘을 때만 실패
function fairOnce(name, df, sample) {
  let x = sample();
  if (x > CHI_001[df]) x = sample();
  if (x > CHI_001[df]) bad(`공정성 ${name}: 카이제곱 ${x.toFixed(2)} > ${CHI_001[df]} (두 번 연속)`);
  return x;
}
const passed = [];
const ids = (k) => Array.from({ length: k }, (_, i) => 'p' + i);
function checkLogic() {
  eq([CORE.MAX_TOUCHES, CORE.MAX_N, CORE.MIN_TEAMS, CORE.MAX_TEAMS, CORE.STABLE_MS, CORE.GO_MS, CORE.HISTORY_MAX], [10, 9, 2, 4, 2500, 1500, 10], '한도');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(7, seq([4294967294, 4294967292, 4294967291])), 4294967291 % 7, 'uniformInt(7): limit(4294967292) 이상 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 설정 · 최소 인원
  eq(CORE.normalize({}), { mode: 'one', n: 2, teams: 2 }, '기본 설정 = 1명 · N 2 · 2팀');
  eq(CORE.normalize({ mode: 'x', n: 99, teams: 9 }), { mode: 'one', n: 9, teams: 4 }, '설정 범위 밖 → 끝값');
  eq(CORE.normalize({ mode: 'n', n: 0, teams: 1 }), { mode: 'n', n: 1, teams: 2 }, '설정 범위 밖(작음)');
  eq(CORE.normalize({ mode: 'teams', n: 'abc', teams: '3' }), { mode: 'teams', n: 2, teams: 3 }, '설정 문자열');
  eq([CORE.minTouches({ mode: 'one' }), CORE.minTouches({ mode: 'n', n: 3 }), CORE.minTouches({ mode: 'n', n: 9 }), CORE.minTouches({ mode: 'teams', teams: 4 })], [2, 4, 10, 4], 'minTouches');
  eq([CORE.canDecide({}, 1), CORE.canDecide({}, 2), CORE.canDecide({}, 10), CORE.canDecide({}, 11)], [false, true, true, false], 'canDecide(1명 뽑기)');
  eq(CORE.decide({}, ['a']), null, 'decide: 손가락 1개는 뽑지 않음');
  eq(CORE.decide({ mode: 'n', n: 3 }, ids(3)), null, 'decide: N=3 인데 3개면 뽑지 않음');
  // 기다림 시계
  eq([CORE.holdProgress(null, 5000), CORE.holdProgress(1000, 1000), CORE.holdProgress(1000, 2250), CORE.holdProgress(1000, 9000)], [0, 0, 0.5, 1], 'holdProgress');
  eq([CORE.holdDone(null, 9e9), CORE.holdDone(1000, 3499), CORE.holdDone(1000, 3500), CORE.holdDone(1000, 2499, 1500), CORE.holdDone(1000, 2500, 1500)], [false, false, true, false, true], 'holdDone (STABLE 2500ms · Go 1500ms)');

  // 1명 뽑기: 손가락 2~10개마다 고르게
  for (let k = 2; k <= CORE.MAX_TOUCHES; k++) {
    const x = fairOnce(`1명 뽑기 ${k}개`, k - 1, () => {
      const c = new Array(k).fill(0);
      const list = ids(k);
      for (let i = 0; i < 2500 * k; i++) {
        const r = CORE.decide({ mode: 'one' }, list);
        c[list.indexOf(r.winners[0])]++;
      }
      return chi(c);
    });
    if (k === 5) passed.push(`one5:${x.toFixed(1)}`);
  }
  // 여러 명 뽑기: 뽑힌 수 = N · 서로 다름 · 각 손가락이 고르게
  [[2, 5], [3, 7], [4, 10]].forEach(([n, k]) => {
    let shape = 0;
    const x = fairOnce(`${n}명 뽑기 ${k}개`, k - 1, () => {
      const c = new Array(k).fill(0);
      const list = ids(k);
      for (let i = 0; i < 3000 * k; i++) {
        const r = CORE.decide({ mode: 'n', n }, list);
        if (r.winners.length !== n || new Set(r.winners).size !== n || r.winners.some((w) => !list.includes(w))) shape++;
        r.winners.forEach((w) => c[list.indexOf(w)]++);
      }
      return chi(c);
    });
    if (shape) bad(`${n}명 뽑기: 뽑힌 수가 ${n} 이 아니거나 겹침 (${shape}번)`);
    passed.push(`n${n}/${k}:${x.toFixed(1)}`);
  });
  // 순서 없는 부분집합(2명/4개 = 6가지)도 고르게
  fairOnce('2명 뽑기 4개 조합 6가지', 5, () => {
    const c = {};
    for (let i = 0; i < 30000; i++) { const w = CORE.pickWinners(ids(4), 2).sort().join(); c[w] = (c[w] || 0) + 1; }
    const v = Object.values(c);
    if (v.length !== 6) return 999;
    return chi(v);
  });
  // 팀 나누기: 크기 차이 ≤ 1 · 한 사람의 팀이 고르게 · 큰 팀이 어느 색이 될지도 고르게
  [[2, 5], [3, 7], [4, 10], [4, 4]].forEach(([T, k]) => {
    let sizeBad = 0;
    const x = fairOnce(`${T}팀 ${k}명: 0번의 팀`, T - 1, () => {
      const c = new Array(T).fill(0);
      for (let i = 0; i < 4000 * T; i++) {
        const r = CORE.decide({ mode: 'teams', teams: T }, ids(k));
        if (Math.max(...r.sizes) - Math.min(...r.sizes) > 1 || r.sizes.reduce((a, b) => a + b, 0) !== k || Object.keys(r.assign).length !== k) sizeBad++;
        c[r.assign.p0]++;
      }
      return chi(c);
    });
    if (sizeBad) bad(`${T}팀 ${k}명: 팀 크기 차이 > 1 또는 빠진 사람 (${sizeBad}번)`);
    if (k % T) {
      fairOnce(`${T}팀 ${k}명: 큰 팀이 되는 색`, T - 1, () => {
        const c = new Array(T).fill(0);
        for (let i = 0; i < 3000 * T; i++) { const s = CORE.decide({ mode: 'teams', teams: T }, ids(k)).sizes; const mx = Math.max(...s); s.forEach((v, j) => { if (v === mx) c[j]++; }); }
        return chi(c);
      });
    }
    passed.push(`t${T}/${k}:${x.toFixed(1)}`);
  });
  // 같은 손가락끼리 같은 팀이 될 확률도 균등 배정과 같은지(쌍 검사): 3팀 6명 → (2-1)/(6-1) = 0.2
  {
    let same = 0; const N = 30000;
    for (let i = 0; i < N; i++) { const a = CORE.splitTeams(ids(6), 3); if (a.p0 === a.p1) same++; }
    if (Math.abs(same / N - 0.2) > 0.012) bad(`팀 쌍 확률 ${(same / N).toFixed(3)} ≠ 0.2`);
  }
  eq(CORE.teamSizes({ a: 0, b: 1, c: 0 }, 3), [2, 1, 0], 'teamSizes');
  // 섞기는 원본을 건드리지 않음
  const orig = ids(5); CORE.shuffle(orig); eq(orig, ids(5), 'shuffle 원본 보존');
  // 기록
  let h = [];
  for (let k = 1; k <= 14; k++) h = CORE.pushHistory(h, { t: k, mode: 'one', k: 3, n: 1 });
  eq([h.length, h[0].t, h[9].t], [10, 14, 5], '기록 10개, 최신이 맨 앞');
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
    walk(T, (s, p) => { if (/^(privacy|faq)\./.test(p)) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (T.result.teamNames.length !== CORE.MAX_TEAMS || new Set(T.result.teamNames).size !== CORE.MAX_TEAMS) bad(`${tag} result.teamNames 는 서로 다른 ${CORE.MAX_TEAMS}개`);
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.start', 'ui.modeLabel', 'ui.waitTouch', 'ui.waitClick', 'ui.hold', 'ui.clickHint', 'result.titleOne', 'result.subOne', 'result.again', 'result.edit'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
      if (T.result.teamNames.join() === EN.result.teamNames.join()) bad(`${tag} teamNames 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·세그먼트 3칸)
    const W = [['ui.start', 26], ['ui.modeOne', 13], ['ui.modeN', 13], ['ui.modeTeams', 13], ['ui.modeLabel', 34], ['ui.nLabel', 34], ['ui.teamsLabel', 34],
      ['ui.settings', 12], ['ui.go', 12], ['ui.clear', 12], ['ui.hold', 22], ['ui.picking', 22], ['ui.maxed', 34], ['ui.waitTouch', 44], ['ui.waitClick', 60],
      ['ui.clickHint', 56], ['result.again', 24], ['result.edit', 30], ['result.kicker', 30], ['result.titleOne', 24], ['result.history', 26], ['result.historyClear', 12]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    for (let t = CORE.MIN_TEAMS; t <= CORE.MAX_TEAMS; t++) if (width(fmt(T.ui.teamsValue, { t })) > 13) bad(`${tag} ui.teamsValue 가 김: ${T.ui.teamsValue}`);
    if (width(fmt(T.ui.nValue, { n: 9 })) > 16) bad(`${tag} ui.nValue 가 김: ${T.ui.nValue}`);
    [['ui.bannerOne', {}], ['ui.bannerN', { n: 9 }], ['ui.bannerTeams', { t: 4 }]].forEach(([p, v]) => { if (width(fmt(get(T, p), v)) > 30) bad(`${tag} ${p} 가 김`); });
    if (width(fmt(T.ui.needMore, { c: 9, m: 10 })) > 40) bad(`${tag} ui.needMore 가 김: ${T.ui.needMore}`);
    if (width(fmt(T.result.titleN, { n: 9 })) > 24 || width(fmt(T.result.titleTeams, { t: 4 })) > 24) bad(`${tag} result.titleN/titleTeams 가 김`);
    T.result.teamNames.forEach((nm) => { if (width(fmt(T.result.teamLine, { name: nm, c: 5 })) > 20) bad(`${tag} 팀 줄이 김(2칸 격자, 360px): ${fmt(T.result.teamLine, { name: nm, c: 5 })}`); });
    if (width('🎨 ' + fmt(T.result.historyTeams, { k: 10, t: 4 }) + ' (3·3·2·2)') > 34) bad(`${tag} result.historyTeams 가 김`);
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking|順位|排名|рейтинг/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
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
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«( ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru') walk(T, (s, p) => { if (!p.startsWith('privacy.') && /(^|[^а-яё])(вы|вас|вам|ваш[а-я]*)([^а-яё]|$)/i.test(s)) bad(`${tag} ${p} 는 «ты» 로 (вы 금지): ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Baloo\+2|Be\+Vietnam|Kanit/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 제목 글꼴이 아님`);
    if (lang === 'th' && !/Kanit|Mitr|Prompt|Sarabun/.test(T.fonts.css)) bad(`${tag} 태국어 제목 글꼴이 아님`);
    if (lang === 'zh' && !/ZCOOL|Noto\+Sans\+SC/.test(T.fonts.css)) bad(`${tag} 간체자 제목 글꼴이 아님`);
    if (/^(en|fr|de|es|it|pt|vi)$/.test(lang) && !/Baloo\+2/.test(T.fonts.css)) bad(`${tag} 라틴 확장(à ã ç ß ơ) 글꼴(Baloo 2)이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`));
  return m ? m[0] : '';
}
const stripRuntime = (html) => html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/finger\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/finger\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!S || !P) { bad(`${tag} 화면(#screen-setup / #screen-play) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 2) bad(`${tag} section 은 시작·판 화면 2개`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (!/<section id="screen-play" class="fg-screen fg-play" hidden>/.test(html)) bad(`${tag} 판 화면은 처음에 hidden`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="fg-h1">/.test(S)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const inOrder = (X, list, what) => { const at = list.map((s) => X.indexOf(s)); if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${tag} ${what} 순서가 아님`); };
      inOrder(S, ['class="fg-h1"', 'class="fg-hook"', 'id="mode-one"', 'id="mode-n"', 'id="mode-teams"', 'id="n-box"', 'id="n-less"', 'id="n-value"', 'id="n-more"', 'id="teams-box"', 'id="teams-2"', 'id="teams-3"', 'id="teams-4"', 'id="start-btn"', 'class="fg-fair"', 'class="mg-ad mg-ad-start"'],
        '시작 화면(h1 → 훅 → 무엇을 → 몇 명 → 몇 팀 → 열기 → 공정성 → 광고)');
      inOrder(P, ['id="play-banner"', 'id="settings-btn"', 'id="pad"', 'id="dots"', 'id="pad-status"', 'id="click-bar"', 'id="clear-btn"', 'id="go-btn"', 'id="live"', 'id="result"', 'id="result-card"', 'id="res-title"', 'id="res-teams"', 'id="edit-btn"', 'id="history"', '<div data-mg-end="finger"></div>'],
        '판 화면(안내 → 판 → 클릭 버튼 → 결과 → 기록 → 공통 끝 화면)');
      if (!/<div id="result" class="fg-result" hidden>/.test(P) || !/<div id="click-bar" class="fg-click-bar" hidden>/.test(P)) bad(`${tag} 결과·클릭 버튼 줄은 처음에 hidden`);
      if (!/<div id="n-box" class="fg-sub" hidden>/.test(S) || !/<div id="teams-box" class="fg-sub" hidden>/.test(S)) bad(`${tag} N·팀 칸은 처음에 hidden(기본 = 1명)`);
      if (!/<div id="result"[\s\S]*?<div data-mg-end="finger"><\/div>\s*<\/div>\s*<\/section>$/.test(P)) bad(`${tag} data-mg-end="finger" 는 결과(#result) 안의 마지막 요소여야 함`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/id="mode-one" role="radio" aria-checked="true"/.test(S) || (S.match(/role="radio"/g) || []).length !== 6) bad(`${tag} 라디오 6개(무엇 3 + 팀 3), 기본 = 1명`);
      if (!/id="go-btn" class="fg-btn fg-btn-go" disabled/.test(P)) bad(`${tag} Go 는 처음에 disabled`);
      if (!/id="live" class="visually-hidden" aria-live="assertive"/.test(P)) bad(`${tag} 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S + P)) bad(`${tag} 화면에 FAQ`);
      if (T.faq.some((q) => stripRuntime(html).includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html) || !/window\.PAGE_I18N = /.test(html)) bad(`${tag} MG_FAQ / PAGE_I18N 없음`);
      if (html.indexOf('finger-core.js') < 0 || html.indexOf('finger-core.js') > html.indexOf('finger.js"')) bad(`${tag} finger-core.js 가 finger.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://finger.example.com/</loc>') || !sm.includes('<loc>https://finger.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  if (!fs.existsSync(path.join(SITE, 'README.md'))) bad('README.md 없음');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'finger.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js) || /'[A-Z][a-z]+ [a-z]+[^']*'/.test(js)) bad('finger.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("finger.js: track('start') 는 첫 손가락 1곳, track('done') 은 결과 1곳");
  const fnBody = (name) => { const i = js.indexOf(`function ${name}(`); return i < 0 ? '' : js.slice(i, js.indexOf('\n  }\n', i)); };
  if (!fnBody('changed').includes("track('start')")) bad("finger.js: track('start') 는 changed(첫 손가락/점) 안에");
  if (!fnBody('showResult').includes("track('done')")) bad("finger.js: track('done') 은 showResult(결과 화면) 안에");
  if (!fnBody('decide').includes('CORE.decide(') || (js.match(/CORE\.decide\(/g) || []).length !== 1) bad('finger.js: 뽑기는 decide() 안에서 CORE.decide 한 번만(정하는 순간)');
  if (/Math\.random/.test(js)) bad('finger.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('finger.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'].forEach((ev) => { if (!js.includes(`addEventListener('${ev}'`)) bad(`finger.js: ${ev} 처리 없음`); });
  ['touchstart', 'touchmove', 'contextmenu', 'gesturestart'].forEach((ev) => { if (!js.includes(`addEventListener('${ev}'`)) bad(`finger.js: ${ev} 막기 없음`); });
  if (!/passive: false/.test(js)) bad('finger.js: touchstart/touchmove 는 passive:false 로 막아야 함(iOS 스크롤·확대)');
  if (!/navigator\.vibrate\)/.test(js)) bad('finger.js: 진동은 navigator.vibrate 가 있을 때만');
  if (!/CORE\.MAX_TOUCHES/.test(fnBody('onDown'))) bad('finger.js: 손가락 10개 제한(onDown)');
  if (/localStorage\.setItem\([^)]*history/i.test(js) || /HIST/.test(js)) bad('finger.js: 최근 결과는 메모리에만(저장 금지)');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '')) bad(`finger.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('finger.js: setShareData / setRetry 등록 없음');
  if (!/mgCleanUrl/.test(js)) bad('finger.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*(?!\s*'')/.test(js)) bad("finger.js: innerHTML 은 '' 로 비울 때만");
  const core = fs.readFileSync(path.join(SITE, 'finger-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('finger-core.js 는 crypto.getRandomValues 만 써야 함');
  const css = fs.readFileSync(path.join(SITE, 'style.css'), 'utf8');
  const padCss = (css.match(/\.fg-pad \{[^}]*\}/) || [''])[0];
  if (!/touch-action: none/.test(padCss) || !/-webkit-touch-callout: none/.test(padCss) || !/user-select: none/.test(padCss)) bad('style.css: 판은 touch-action:none · -webkit-touch-callout:none · user-select:none');
  if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.fg-dot[\s\S]*animation: none/.test(css)) bad('style.css: 움직임 줄이기면 점 애니메이션 없음');
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
  if (APP.id !== 'finger' || APP.category !== 'vote' || APP.path !== 'https://finger.example.com/' || APP.added !== '2026-11-01' || APP.emoji !== '👆' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 160) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 18) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
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
console.log(`\n손가락 룰렛 로직·공정성(카이제곱: 1명 뽑기 2~10개 · 여러 명 3종 + 조합 · 팀 4종 + 큰 팀 색 · 쌍 확률)·설정·기다림 시계 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
if (passed.length) console.log(`  ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 정하는 순간 뽑기(crypto 거부 샘플링, 손가락마다 균등)·여러 명·팀(크기 차이 ≤ 1, 팀 배정 균등)·기다림 시계, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역·글꼴), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·결과 안 data-mg-end), 입력 막기(touch-action·passive:false), OG 이미지 모두 OK');
