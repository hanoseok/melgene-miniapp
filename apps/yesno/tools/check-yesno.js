#!/usr/bin/env node
/**
 * 예스 노 결정기 검사.
 *   1) 로직(yesno-core.js): 모드별 답 범위, 주입 난수로 결정되는지, cryptoInt 범위, best-of 종료 규칙(과반에 닿는 순간 끝·최대 N판·이긴 쪽),
 *      공정성 카이제곱(classic 2칸 · maybe 3칸 · oracle 12칸 · best3/best5 이긴 쪽 · best3/best5 판 수 분포, p≈0.001 기준),
 *      validFlips(규칙 위반 거절), 질문 다듬기, #d= 인코딩/디코딩(왕복, UTF-8 질문, 변조·범위 밖·규칙 위반·긴 질문·모양 틀림 거절), 누적, 기록 10개.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, oracle 12개(서로 다름), FAQ 3~5개(getRandomValues·재미로 언급,
 *      "무료인가요?" 류 금지), 제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-yn) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 질문 → 모드 → 묻기 → 결과(#result, 처음 hidden) 안 답 카드 → 누적 → 기록 → data-mg-end="yesno" 순서, 모드 5개, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, yesno.js 규칙.
 *
 * 실행: node tools/check-yesno.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'yesno-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const get = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 1: 10.83, 2: 13.82, 11: 31.26 };
function chiP(counts, probs) {
  const N = counts.reduce((a, b) => a + b, 0);
  return counts.reduce((a, x, i) => { const e = N * probs[i]; return a + (x - e) * (x - e) / e; }, 0);
}
const uniform = (k) => Array(k).fill(1 / k);
function seq(list) { let i = 0; return () => list[i++]; }

function checkLogic() {
  eq(CORE.MODES, ['classic', 'maybe', 'oracle', 'best3', 'best5'], 'MODES');
  eq(CORE.ORACLE_N, 12, 'ORACLE_N');
  // 주입 난수로 결정
  eq(CORE.ask('classic', () => 1), { m: 'classic', a: 1 }, 'classic 주입');
  eq(CORE.ask('maybe', () => 2), { m: 'maybe', a: 2 }, 'maybe 주입');
  eq(CORE.ask('oracle', () => 11), { m: 'oracle', a: 11 }, 'oracle 주입');
  eq(CORE.ask('nope', () => 0), { m: 'classic', a: 0 }, '모르는 모드 = classic');
  let maxSeen = {};
  CORE.MODES.forEach((m) => { CORE.ask(m, (k) => { maxSeen[m] = k; return 0; }); });
  eq(maxSeen, { classic: 2, maybe: 3, oracle: 12, best3: 2, best5: 2 }, '모드별 뽑기 칸 수');
  // best-of 종료 규칙
  eq(CORE.ask('best3', seq([0, 0])), { m: 'best3', a: 0, f: [0, 0] }, 'best3 2:0 에서 끝');
  eq(CORE.ask('best3', seq([1, 0, 1])), { m: 'best3', a: 1, f: [1, 0, 1] }, 'best3 1:2');
  eq(CORE.ask('best5', seq([1, 1, 1])), { m: 'best5', a: 1, f: [1, 1, 1] }, 'best5 0:3 에서 끝');
  eq(CORE.ask('best5', seq([0, 1, 0, 1, 0, 1, 1])), { m: 'best5', a: 0, f: [0, 1, 0, 1, 0] }, 'best5 3:2 에서 끝(더 던지지 않음)');
  for (let i = 0; i < 3000; i++) {
    ['best3', 'best5'].forEach((m) => {
      const r = CORE.ask(m);
      const n = CORE.bestN(m);
      if (!CORE.validFlips(m, r.a, r.f) || r.f.length > n || r.f.length < CORE.need(n)) bad(`${m} 종료 규칙 위반 ${JSON.stringify(r)}`);
      const w = CORE.score(r);
      if (Math.max(w[0], w[1]) !== CORE.need(n) || w[r.a] !== CORE.need(n)) bad(`${m} 이긴 쪽/점수 이상 ${JSON.stringify(r)}`);
    });
    if (problems.length > 5) break;
  }
  // validFlips 거절
  [['best3', 0, [0]], ['best3', 0, [0, 0, 1]], ['best3', 1, [0, 0]], ['best3', 0, [0, 2]], ['best5', 0, [0, 0, 1, 1]], ['best5', 0, [0, 0, 0, 1]], ['best5', 1, [1, 1, 0, 0, 0]], ['classic', 0, [0, 0]], ['best3', 0, 'xx']]
    .forEach(([m, a, f]) => { if (CORE.validFlips(m, a, f)) bad(`validFlips 가 받아들임: ${m} ${a} ${JSON.stringify(f)}`); });
  if (!CORE.validFlips('best5', 0, [1, 0, 1, 0, 0])) bad('validFlips best5 3:2 거절됨');
  // 톤·분류
  eq([0, 3, 4, 7, 8, 11].map(CORE.tone), ['positive', 'positive', 'neutral', 'neutral', 'negative', 'negative'], 'tone');
  eq([{ m: 'classic', a: 0 }, { m: 'classic', a: 1 }, { m: 'maybe', a: 2 }, { m: 'oracle', a: 5 }, { m: 'oracle', a: 9 }, { m: 'best3', a: 0, f: [0, 0] }].map(CORE.outcome), ['yes', 'no', 'maybe', 'maybe', 'no', 'yes'], 'outcome');
  // cryptoInt 범위
  for (const max of [1, 2, 3, 7, 12, 100]) {
    for (let i = 0; i < 2000; i++) { const v = CORE.cryptoInt(max); if (!(Number.isInteger(v) && v >= 0 && v < max)) { bad(`cryptoInt(${max}) 범위 밖 ${v}`); break; } }
  }
  // 공정성: 카이제곱 (p≈0.001)
  const N = 60000;
  const tally = (mode, k, key) => { const c = Array(k).fill(0); for (let i = 0; i < N; i++) c[key(CORE.ask(mode))]++; return c; };
  const tests = [
    ['classic 예/아니오', tally('classic', 2, (r) => r.a), uniform(2), 1],
    ['maybe 예/아니오/글쎄', tally('maybe', 3, (r) => r.a), uniform(3), 2],
    ['oracle 12칸', tally('oracle', 12, (r) => r.a), uniform(12), 11],
    ['best3 이긴 쪽', tally('best3', 2, (r) => r.a), uniform(2), 1],
    ['best5 이긴 쪽', tally('best5', 2, (r) => r.a), uniform(2), 1],
    ['best3 판 수(2·3)', tally('best3', 2, (r) => r.f.length - 2), [1 / 2, 1 / 2], 1],
    ['best5 판 수(3·4·5)', tally('best5', 3, (r) => r.f.length - 3), [1 / 4, 3 / 8, 3 / 8], 2],
  ];
  tests.forEach(([name, counts, probs, df]) => { const x = chiP(counts, probs); if (x > CHI_001[df]) bad(`공정성: ${name} χ²=${x.toFixed(2)} > ${CHI_001[df]} (${counts.join('/')})`); });

  // 질문 다듬기
  eq(CORE.cleanQuestion('  Pizza   tonight?  '), 'Pizza tonight?', 'cleanQuestion 공백');
  eq(CORE.cleanQuestion('a\nb\tc'), 'a b c', 'cleanQuestion 제어 문자');
  if (/[<>]/.test(CORE.cleanQuestion('<b>x</b>'))) bad('cleanQuestion 꺾쇠가 남음');
  eq(Array.from(CORE.cleanQuestion('가'.repeat(150))).length, CORE.MAX_Q, 'cleanQuestion 100자 제한');
  eq(CORE.cleanQuestion(null), '', 'cleanQuestion null');

  // #d= 왕복
  const recs = [
    { m: 'classic', a: 1, q: '오늘 치킨 시킬까? 🍗', t: 1760500000000 },
    { m: 'maybe', a: 2, q: '', t: 1760500001000 },
    { m: 'oracle', a: 7, q: 'Ça va marcher, crème brûlée', t: 1760500002000 },
    { m: 'best3', a: 0, f: [1, 0, 0], q: 'Да или нет', t: 1760500003000 },
    { m: 'best5', a: 1, f: [0, 1, 1, 0, 1], q: 'x'.repeat(100), t: 1760500004000 },
  ];
  recs.forEach((r, i) => {
    const s = CORE.encodeShare(r);
    if (!s || !/^[A-Za-z0-9_-]+$/.test(s)) { bad(`encodeShare[${i}] 실패`); return; }
    const d = CORE.decodeShare(s);
    if (!d) { bad(`decodeShare[${i}] 왕복 실패`); return; }
    eq({ m: d.m, a: d.a, f: d.f, q: d.q, t: d.t }, { m: r.m, a: r.a, f: r.f, q: r.q, t: r.t }, `#d= 왕복 ${i}`);
  });
  if (CORE.decodeShare(CORE.encodeShare({ m: 'classic', a: 0, t: 0 })).q !== '') bad('질문 없는 공유는 q = ""');
  if (/q/.test(CORE.b64urlDecode(CORE.encodeShare({ m: 'classic', a: 0, q: '  ', t: 0 })))) bad('빈 질문은 링크에 넣지 않음');
  if (CORE.encodeShare({ m: 'best3', a: 0, f: [0], t: 0 }) !== null) bad('encodeShare 가 규칙 위반 기록을 받아들임');
  // 변조 거절
  const raw = (o) => CORE.b64urlEncode(JSON.stringify(o));
  const base = { v: 1, m: 'classic', a: 0, t: 1760500000 };
  const rejects = [
    ['v 2', { ...base, v: 2 }], ['모드 없음', { ...base, m: 'magic' }], ['classic a=2', { ...base, a: 2 }], ['maybe a=3', { ...base, m: 'maybe', a: 3 }],
    ['oracle a=12', { ...base, m: 'oracle', a: 12 }], ['oracle a=-1', { ...base, m: 'oracle', a: -1 }], ['a 소수', { ...base, a: 0.5 }], ['a 문자열', { ...base, a: '0' }],
    ['classic f 있음', { ...base, f: [0] }], ['best3 f 없음', { ...base, m: 'best3' }], ['best3 이긴 쪽 틀림', { ...base, m: 'best3', a: 1, f: [0, 0] }],
    ['best3 끝난 뒤 더 던짐', { ...base, m: 'best3', a: 0, f: [0, 0, 1] }], ['best5 덜 끝남', { ...base, m: 'best5', a: 0, f: [0, 0, 1, 1] }],
    ['best5 판 값 2', { ...base, m: 'best5', a: 0, f: [0, 2, 0, 0] }], ['질문 101자', { ...base, q: 'x'.repeat(101) }], ['질문 꺾쇠', { ...base, q: '<script>' }],
    ['질문 앞 공백', { ...base, q: ' hi' }], ['질문 빈 문자열', { ...base, q: '' }], ['질문 숫자', { ...base, q: 5 }], ['t 음수', { ...base, t: -1 }], ['t 없음', { ...base, t: undefined }],
  ];
  rejects.forEach(([name, o]) => { if (CORE.decodeShare(raw(o))) bad(`decodeShare 가 변조를 받아들임: ${name}`); });
  if (!CORE.decodeShare(raw(base))) bad('decodeShare 기본 레코드 거절');
  ['', '!!!', 'a b', 'x'.repeat(3000), raw([1, 2]), CORE.b64urlEncode('not json'), 'AAAA'].forEach((s) => { if (CORE.decodeShare(s)) bad(`decodeShare 쓰레기 입력 받아들임: ${s.slice(0, 20)}`); });
  // 잘못된 UTF-8
  if (CORE.decodeShare(Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''))) bad('잘못된 UTF-8 받아들임');

  // 누적 · 기록
  const t = CORE.newTally();
  [{ m: 'classic', a: 0 }, { m: 'maybe', a: 2 }, { m: 'oracle', a: 10 }, { m: 'best5', a: 0, f: [0, 0, 0] }].forEach((r) => CORE.addTally(t, r));
  eq(t, { yes: 2, no: 1, maybe: 1 }, '누적');
  eq(CORE.tallyTotal(t), 4, 'tallyTotal');
  let h = [];
  for (let i = 0; i < 13; i++) h = CORE.pushHistory(h, { m: 'classic', a: i % 2, t: i });
  eq(h.length, CORE.HISTORY_MAX, '기록 최대 10개');
  eq(h[0].t, 12, '기록 최신이 맨 앞');
  eq(CORE.cleanHistory([{ m: 'classic', a: 0, t: 1 }, { m: 'classic', a: 5, t: 1 }, { m: 'best3', a: 0, f: [0], t: 1 }, null, 'x', { m: 'oracle', a: 3, t: 'x' }, { m: 'maybe', a: 1, q: '<x>', t: 2 }]).length, 1, 'cleanHistory 모양 틀린 항목 버림');
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
      ['meta.title', 'hero.hook', 'ui.ask', 'ui.modeLabel', 'result.again', 'history.title', 'oracle.0'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 구슬 답 12개
    if (!Array.isArray(T.oracle) || T.oracle.length !== CORE.ORACLE_N) bad(`${tag} oracle 은 ${CORE.ORACLE_N}개`);
    else {
      if (new Set(T.oracle).size !== T.oracle.length) bad(`${tag} oracle 에 같은 답이 있음`);
      T.oracle.forEach((o, i) => { if (!o || width(o) > 30) bad(`${tag} oracle[${i}] 이 비었거나 김 (폭 ${width(o)} > 30, 구슬 창): ${o}`); });
    }
    CORE.MODES.forEach((m) => { if (!T.ui.modes[m] || !T.ui.modeHints[m]) bad(`${tag} ui.modes/modeHints.${m} 없음`); });
    if (new Set(Object.values(T.answers)).size !== 3) bad(`${tag} answers 세 개가 서로 달라야 함`);
    // 360px 폭 문구 (버튼·라벨·칩·구슬 창)
    const W = [['ui.ask', 24], ['ui.asking', 24], ['result.copyLink', 26], ['result.again', 22], ['result.askOwn', 22], ['history.clear', 12], ['history.title', 24],
      ['tally.title', 24], ['ui.questionLabel', 36], ['ui.modeLabel', 36], ['result.sharedBadge', 28], ['result.heading', 24], ['result.flipYes', 4], ['result.flipNo', 4],
      ['answers.yes', 12], ['answers.no', 12], ['answers.maybe', 12], ['tones.positive', 20], ['tones.neutral', 20], ['tones.negative', 20], ['hero.h1Kicker', 26],
      ...CORE.MODES.map((m) => [`ui.modes.${m}`, 22])];
    W.forEach(([p, max]) => { const v = get(T, p); if (typeof v !== 'string' || width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    if (len(T.ui.questionPh) > 40) bad(`${tag} ui.questionPh 가 김`);
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
    if (T.hero.h1Kicker !== APP.title[lang]) bad(`${tag} h1 검색어가 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Baloo|Nunito|Be\+Vietnam|Plus\+Jakarta|Unbounded/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-yn"[\s\S]*?<\/section>/);
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
  if (!/<link rel="canonical" href="https:\/\/yesno\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/yesno\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!S) { bad(`${tag} 첫 화면(#screen-yn) 없음`); return; }
      if (/<section id="screen-yn"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="yn-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(`<span class="yn-kicker">${G.esc(T.hero.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const order = ['class="yn-h1"', 'id="question"', 'data-mode="classic"', 'data-mode="best5"', 'id="ask-btn"', 'id="result"', 'id="result-card"', 'id="orb"', 'id="link-btn"',
        'id="tally-card"', 'id="history-card"', '<div data-mg-end="yesno"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 질문 → 모드 → 묻기 → 답 카드 → 누적 → 기록 → 끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="yn-result" hidden>/.test(S)) bad(`${tag} 결과·끝 화면(#result)은 처음에 hidden`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      CORE.MODES.forEach((m) => { if (!S.includes(`data-mode="${m}"`)) bad(`${tag} 모드 ${m} 없음`); });
      if ((S.match(/role="radio"/g) || []).length !== CORE.MODES.length || !/role="radiogroup"/.test(S)) bad(`${tag} 모드 칩 접근성(radiogroup/radio)`);
      if ((S.match(/aria-checked="true"/g) || []).length !== 1 || !/data-mode="classic" aria-checked="true"/.test(S)) bad(`${tag} 기본 모드 표시는 classic 하나`);
      if (!new RegExp(`id="question"[^>]*maxlength="${CORE.MAX_Q}"`).test(S)) bad(`${tag} 질문 입력 maxlength ${CORE.MAX_Q}`);
      if (/id="question"[^>]*\bvalue=/.test(S)) bad(`${tag} 질문 입력에 미리 채운 값`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 답 읽어 주기(aria-live) 없음`);
      if (!/id="error" class="yn-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="shared-badge" class="yn-badge" hidden/.test(S)) bad(`${tag} 공유 답 배지는 처음에 hidden`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (T.oracle.some((o) => bodyNoJson.includes(`>${G.esc(o)}<`))) bad(`${tag} 구슬 답이 HTML 에 미리 보임(스포일러)`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('yesno-core.js') < 0 || html.indexOf('yesno-core.js') > html.indexOf('yesno.js"')) bad(`${tag} yesno-core.js 가 yesno.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://yesno.example.com/</loc>') || !sm.includes('<loc>https://yesno.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'yesno.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('yesno.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("yesno.js: track('start') 는 묻기 1곳, track('done') 은 답 1곳");
  if (/Math\.random/.test(js)) bad('yesno.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('yesno.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if (!(js.match(/localStorage\.[a-zA-Z]+\(/g) || []).length) bad('yesno.js: 최근 기록을 localStorage 에 저장해야 함');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && ![line, lines[i - 1] || '', lines[i - 2] || ''].some((l) => /try\s*\{/.test(l))) bad(`yesno.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('yesno.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('yesno.js: #d= 공유 답 보기 없음');
  if (!/mgCleanUrl/.test(js)) bad('yesno.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  // 공통 끝 화면 공유는 질문 없는 깨끗한 주소 — setShareData 안에서 encodeShare/#d= 를 쓰지 않는다
  const sd = (js.match(/setShareData\(function \(\) \{[\s\S]*?\n {4}\}\);/) || [''])[0];
  if (!sd || /encodeShare|answerUrl|#d=/.test(sd)) bad('yesno.js: 공통 공유(setShareData)는 깨끗한 주소여야 함 (질문은 "이 답 공유하기"로만)');
  if (/supa\.|\.rpc\(|fetch\(/.test(js)) bad('yesno.js: 질문·답을 서버로 보내면 안 됨');
  if (/track\('[a-z]+',\s*\{[^}]*q/.test(js)) bad('yesno.js: track 에 질문을 넣으면 안 됨');
  const core = fs.readFileSync(path.join(SITE, 'yesno-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('yesno-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'yesno' || APP.category !== 'vote' || APP.path !== 'https://yesno.example.com/' || APP.added !== '2026-10-15' || APP.emoji !== '🎱' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 150) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 20) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
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
console.log(`\n예스 노 로직·best-of 종료·공정성(카이제곱 7종)·#d= 왕복/변조 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 모드 로직·best-of 종료 규칙·공정성(crypto 거부 샘플링, 카이제곱)·공유 링크(왕복·변조 거절), 언어 파일 12개(키·자리표시자·구슬 답 12개·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 끝 화면·FAQPage 없음), OG 이미지 모두 OK');
