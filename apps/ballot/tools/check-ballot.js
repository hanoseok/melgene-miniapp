#!/usr/bin/env node
/**
 * 비밀 투표 검사.
 *   1) 로직(ballot-core.js): 거부 샘플링(uniformInt), 이름·선택지 정리(공백·중복·쉼표·40자), 초안 검사(validate 오류 코드),
 *      진행(createSession/castBallot: 표 수만 더함, 잘못된 표·다 찬 투표 거절, 세션에 표(picks)가 남지 않음, 무작위 1000판에서 질문별 합계 = 투표 수),
 *      집계(tally: 많은 순·입력 순, 1등 묶음, 동점, 0표), winnerOf·resolveTie(한 번만 깸), percent,
 *      동점 깨기 공정성 카이제곱(p = 0.001, 진짜 난수라 한 번 걸리면 한 번 더 뽑아 두 번 연속일 때만 실패): 동점 2~6개 + 흩어진 번호,
 *      결과 링크(#d=) 왕복(한글·이모지·태국어), 변조 거절(합계·동점 깨기·선택지 수·글자·형식), 저장된 진행 검사(sanitizeSession).
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, 번역됨, 템플릿(같은 id·질문 수·사람 뽑기 여부, 선택지 2~12개 서로 다름),
 *      FAQ 3~5개(getRandomValues, "무료인가요?"·인기순 류 금지), 제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴, ru 는 «ты», 한글은 ko 파일만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 4개(시작·투표·결과·공유 결과, 시작 말고는 처음 hidden), 화면 순서, 최종 결과(#summary) 안 마지막이 data-mg-end="ballot", FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지 1200×630 PNG, app.config.js, favicon, shared 링크, ballot.js 규칙
 *      (Math.random 없음, track start 는 startVoting 1곳 · done 은 showSummary 1곳, 공유 결과 화면은 track 없음, 진행 저장에 표(picks) 없음,
 *       localStorage 는 try 안에서만, 움직임 줄이기, 진동 확인, innerHTML 금지, mgCleanUrl, setShareData/setRetry).
 *
 * 실행: node tools/check-ballot.js   (tools/check-all.js 가 apps/ballot 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'ballot-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎⁠]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
const b64 = (obj) => Buffer.from(JSON.stringify(obj), 'utf8').toString('base64url');

// ---------------------------------------------------------------- 1) 로직
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  return counts.reduce((a, x) => { const e = N / counts.length; return a + (x - e) * (x - e) / e; }, 0);
}
function fairOnce(name, df, sample) {
  let x = sample();
  if (x > CHI_001[df]) x = sample();
  if (x > CHI_001[df]) bad(`공정성 ${name}: 카이제곱 ${x.toFixed(2)} > ${CHI_001[df]} (두 번 연속)`);
  return x;
}
const passed = [];
function checkLogic() {
  eq([CORE.MIN_Q, CORE.MAX_Q, CORE.MIN_OPT, CORE.MAX_OPT, CORE.MIN_VOTERS, CORE.MAX_VOTERS, CORE.MAX_NAME, CORE.MAX_TITLE], [1, 5, 2, 12, 2, 40, 40, 60], '한도');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(3, seq([4294967295, 4294967294])), 4294967294 % 3, 'uniformInt(3): limit(4294967295) 이상 버림');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 이름·선택지 정리
  eq(CORE.cleanList('  Mina \nJun, mina\n\n , Sora ,JUN'), ['Mina', 'Jun', 'Sora'], 'cleanList: 공백·빈 칸·대소문자 무시 중복 제거·쉼표');
  eq(CORE.cleanList('민지、준호，민지'), ['민지', '준호'], 'cleanList: 、，');
  eq(CORE.cleanList(['a  b', 'A B']), ['a b'], 'cleanList: 배열 + 안쪽 공백');
  eq(CORE.cleanList('x'.repeat(60))[0].length, 40, 'cleanList: 40자');
  eq(CORE.cleanList('👍🏽'.repeat(30))[0], Array.from('👍🏽'.repeat(30)).slice(0, 40).join(''), 'cleanList: 코드 포인트 단위로 자름');

  // 초안 검사
  const v1 = CORE.validate({ people: 'a', questions: [{ t: 'x', people: true }] });
  eq([v1.ok, v1.errors.map((e) => e.code)], [false, ['people']], 'validate: 이름 1명');
  const v2 = CORE.validate({ people: '', questions: [{ t: 'x', o: 'one' }, { t: 'y', o: Array.from({ length: 13 }, (_, i) => 'o' + i) }] });
  eq(v2.errors, [{ code: 'few', q: 1 }, { code: 'many', q: 2 }], 'validate: 선택지 1개 / 13개');
  const v3 = CORE.validate({ people: Array.from({ length: 13 }, (_, i) => 'p' + i), questions: [{ t: '', people: true }] });
  eq(v3.errors.map((e) => e.code), ['peopleMany'], 'validate: 이름 13명');
  const v4 = CORE.validate({ people: 'A\nB\nC', voters: 99, questions: [{ t: '  ', people: true }, { t: 'Food', o: 'pizza\nPizza\nsushi' }] });
  eq([v4.ok, v4.voters, v4.qs], [true, 40, [{ t: null, o: ['A', 'B', 'C'] }, { t: 'Food', o: ['pizza', 'sushi'] }]], 'validate: 통과 + 인원 40 + 빈 제목 null + 중복 제거');
  eq(CORE.normalizeDraft({ voters: 1 }).voters, 2, 'normalizeDraft: 인원 최소 2');
  eq(CORE.normalizeDraft({ questions: new Array(9).fill({ t: 'q', o: 'a,b' }) }).questions.length, 5, 'normalizeDraft: 질문 5개까지');

  // 진행
  const s = CORE.createSession([{ t: 'MVP', o: ['A', 'B', 'C'] }, { t: 'Food', o: ['x', 'y'] }], 4);
  eq(Object.keys(s).sort(), ['cast', 'counts', 'qs', 'tb', 'voters'], '세션에는 질문·인원·투표 수·표 수·동점 깨기만 (표 자체 없음)');
  eq([CORE.castBallot(s, [0, 1]), CORE.castBallot(s, [2, 1])], [true, true], 'castBallot 2장');
  eq([CORE.castBallot(s, [3, 0]), CORE.castBallot(s, [0]), CORE.castBallot(s, [0, -1]), CORE.castBallot(s, [0.5, 0]), CORE.castBallot(s, ['0', 0])], [false, false, false, false, false], 'castBallot: 잘못된 표 거절');
  eq([s.cast, s.counts], [2, [[1, 0, 1], [0, 2]]], 'castBallot: 표 수만 더함');
  CORE.castBallot(s, [0, 0]); CORE.castBallot(s, [1, 1]);
  eq([CORE.isComplete(s), CORE.castBallot(s, [0, 0]), s.cast], [true, false, 4], '다 찬 투표는 더 받지 않음');
  if (JSON.stringify(s).includes('picks')) bad('세션에 picks 가 남음');
  let threw2 = false;
  try { CORE.createSession([{ t: 'x', o: ['a'] }], 3); } catch (e) { threw2 = true; }
  if (!threw2) bad('createSession: 선택지 1개면 오류');
  // 무작위 1000판: 질문별 합계 = 투표 수, 표 수는 음수 없음
  let sumBad = 0;
  for (let k = 0; k < 1000; k++) {
    const nq = 1 + CORE.cryptoInt(5);
    const qs = Array.from({ length: nq }, (_, i) => ({ t: 'q' + i, o: Array.from({ length: 2 + CORE.cryptoInt(11) }, (_, j) => 'o' + j) }));
    const n = 2 + CORE.cryptoInt(39);
    const ss = CORE.createSession(qs, n);
    const stop = 1 + CORE.cryptoInt(n);
    for (let v = 0; v < stop; v++) CORE.castBallot(ss, qs.map((q) => CORE.cryptoInt(q.o.length)));
    if (ss.counts.some((c) => c.reduce((a, x) => a + x, 0) !== stop || c.some((x) => x < 0))) sumBad++;
    const back = CORE.decodeResult(CORE.encodeResult(CORE.resultOf(ss)));
    if (!back || back.n !== stop || JSON.stringify(back.q.map((q) => q.c)) !== JSON.stringify(ss.counts)) sumBad++;
  }
  if (sumBad) bad(`무작위 1000판 중 ${sumBad}판에서 합계 ≠ 투표 수 또는 링크 왕복 실패`);

  // 집계
  eq(CORE.tally([1, 3, 3, 0]), { total: 7, order: [1, 2, 0, 3], max: 3, leaders: [1, 2], tie: true }, 'tally: 동점 2개(입력 순)');
  eq(CORE.tally([0, 5, 2]), { total: 7, order: [1, 2, 0], max: 5, leaders: [1], tie: false }, 'tally: 1등 하나');
  eq(CORE.tally([0, 0, 0]), { total: 0, order: [0, 1, 2], max: 0, leaders: [], tie: false }, 'tally: 0표는 1등 없음');
  eq(CORE.tally([2, 2, 2, 2]).leaders, [0, 1, 2, 3], 'tally: 모두 같음');
  eq([CORE.winnerOf([1, 3, 3], -1), CORE.winnerOf([1, 3, 3], 2), CORE.winnerOf([1, 3, 3], 0), CORE.winnerOf([4, 1], -1), CORE.winnerOf([0, 0], -1)], [-1, 2, -1, 0, -1], 'winnerOf (동점 깨기 전/후, 1등 아닌 번호 무시)');
  eq([CORE.percent(1, 3), CORE.percent(2, 3), CORE.percent(0, 0), CORE.percent(5, 5)], [33, 67, 0, 100], 'percent');
  let threw3 = false;
  try { CORE.breakTie([3]); } catch (e) { threw3 = true; }
  if (!threw3) bad('breakTie: 동점이 아니면 오류');
  const s2 = CORE.createSession([{ t: 'x', o: ['a', 'b', 'c'] }], 2);
  CORE.castBallot(s2, [0]); CORE.castBallot(s2, [2]);
  const first = CORE.resolveTie(s2, 0);
  if (![0, 2].includes(first)) bad(`resolveTie: 동점 밖 결과 ${first}`);
  let same = true;
  for (let k = 0; k < 50; k++) if (CORE.resolveTie(s2, 0) !== first) same = false;
  if (!same || s2.tb[0] !== first) bad('resolveTie: 한 번 깬 결과는 그대로여야 함');
  const s3 = CORE.createSession([{ t: 'x', o: ['a', 'b'] }], 2);
  CORE.castBallot(s3, [1]); CORE.castBallot(s3, [1]);
  eq([CORE.resolveTie(s3, 0), s3.tb[0]], [1, -1], 'resolveTie: 동점이 아니면 1등, tb 그대로');

  // 동점 깨기 공정성: 동점 2~6개(흩어진 번호) 각각 고르게
  [[0, 1], [1, 4, 7], [2, 3, 5, 11], [0, 2, 4, 6, 8], [0, 1, 2, 3, 4, 5]].forEach((leaders) => {
    const k = leaders.length;
    const x = fairOnce(`동점 ${k}개 깨기`, k - 1, () => {
      const c = new Array(k).fill(0);
      for (let i = 0; i < 3000 * k; i++) {
        const w = CORE.breakTie(leaders);
        const at = leaders.indexOf(w);
        if (at < 0) { bad(`breakTie: 동점 밖 결과 ${w}`); return 0; }
        c[at]++;
      }
      return chi(c);
    });
    passed.push(`tie${k}:${x.toFixed(1)}`);
  });
  // resolveTie 를 통한 실제 경로도 고르게 (3개 동점, 매번 새 세션)
  const x3 = fairOnce('resolveTie 3개', 2, () => {
    const c = [0, 0, 0];
    for (let i = 0; i < 9000; i++) {
      const ss = CORE.createSession([{ t: 't', o: ['a', 'b', 'c', 'd'] }], 3);
      CORE.castBallot(ss, [0]); CORE.castBallot(ss, [1]); CORE.castBallot(ss, [2]);
      c[CORE.resolveTie(ss, 0)]++;
    }
    return chi(c);
  });
  passed.push(`resolve3:${x3.toFixed(1)}`);

  // 결과 링크
  const s4 = CORE.createSession([{ t: '올해의 MVP 🏆', o: ['민지', 'Jun', 'สมชาย', 'Ólafur 👍🏽'] }, { t: 'Где поедим?', o: ['Пицца', 'Суши'] }], 5);
  [[0, 1], [1, 0], [0, 1], [1, 1], [3, 0]].forEach((p) => CORE.castBallot(s4, p));
  CORE.resolveTie(s4, 0);
  const r4 = CORE.resultOf(s4);
  const code = CORE.encodeResult(r4);
  if (!/^[A-Za-z0-9_-]+$/.test(code)) bad('encodeResult: base64url 이 아님');
  eq(CORE.decodeResult(code), r4, '결과 링크 왕복(한글·이모지·태국어·키릴)');
  eq(Buffer.from(code, 'base64url').toString('utf8'), JSON.stringify(r4), '결과 링크 = UTF-8 JSON base64url');
  if (!JSON.stringify(r4).match(/"b":[01]/)) bad('결과 링크에 동점 깨기 결과(b) 없음');
  const base = JSON.parse(JSON.stringify(r4));
  const tamper = (fn) => { const o = JSON.parse(JSON.stringify(base)); fn(o); return CORE.decodeResult(b64(o)); };
  eq(tamper((o) => { o.q[0].c[0] += 1; }), null, '변조: 합계 ≠ n');
  eq(tamper((o) => { o.n = 41; }), null, '변조: n > 40');
  eq(tamper((o) => { o.v = 2; }), null, '변조: 버전');
  eq(tamper((o) => { o.q[0].o.push('x'); }), null, '변조: 선택지 수 ≠ 표 수 칸');
  eq(tamper((o) => { o.q[1].o = ['only']; o.q[1].c = [5]; }), null, '변조: 선택지 1개');
  eq(tamper((o) => { o.q[0].c[1] = -1; o.q[0].c[0] += 1; }), null, '변조: 음수 표');
  eq(tamper((o) => { o.q[0].t = ''; }), null, '변조: 빈 제목');
  eq(tamper((o) => { o.q = []; }), null, '변조: 질문 없음');
  eq(tamper((o) => { o.q[0].b = 3; }).q[0].b, -1, '변조: 1등 아닌 동점 깨기는 무시(-1)');
  eq(tamper((o) => { o.q[1].b = 0; }).q[1].b, -1, '변조: 동점 아닌 질문의 b 는 무시');
  eq(tamper((o) => { o.q[0].o[0] = '<b>x</b>'; }).q[0].o[0], '<b>x</b>', '글자는 그대로(화면은 textContent 로만 그림)');
  eq([CORE.decodeResult(''), CORE.decodeResult('%%%'), CORE.decodeResult('abc'), CORE.decodeResult('a'.repeat(13000)), CORE.decodeResult(Buffer.from([0xff, 0xfe, 0x00]).toString('base64url'))], [null, null, null, null, null], '깨진 링크 거절');

  // 저장된 진행 검사
  const s5 = CORE.createSession([{ t: 'a', o: ['x', 'y'] }], 3);
  CORE.castBallot(s5, [1]); CORE.castBallot(s5, [0]);
  const st = JSON.parse(JSON.stringify(Object.assign({ phase: 'voting' }, s5)));
  eq(CORE.sanitizeSession(st), s5, 'sanitizeSession: 왕복');
  eq(CORE.sanitizeSession(Object.assign({}, st, { cast: 3 })), null, 'sanitizeSession: 합계 ≠ cast');
  eq(CORE.sanitizeSession(Object.assign({}, st, { cast: 4, voters: 3 })), null, 'sanitizeSession: cast > voters');
  eq(CORE.sanitizeSession(Object.assign({}, st, { counts: [[1, 1, 0]] })), null, 'sanitizeSession: 칸 수');
  eq(CORE.sanitizeSession(null), null, 'sanitizeSession: null');
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
    walk(T, (s, p) => { if (/^(privacy|faq|ui\.presets)\./.test(p)) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    // 템플릿: en 과 같은 id·질문 수·사람 뽑기 여부, 선택지 2~12개 서로 다름, 직접 만들기는 빈 질문 1개
    const P = T.ui.presets;
    if (P.map((p) => p.id).join() !== EN.ui.presets.map((p) => p.id).join()) bad(`${tag} 템플릿 id 가 en 과 다름`);
    P.forEach((p, i) => {
      const E = EN.ui.presets[i] || { questions: [] };
      if (!p.label || width(p.label) > 26) bad(`${tag} 템플릿 ${p.id} 이름이 없거나 김(2칸 칩, 360px): ${p.label}`);
      if (p.questions.length !== E.questions.length) bad(`${tag} 템플릿 ${p.id} 질문 수 ${p.questions.length} ≠ en ${E.questions.length}`);
      p.questions.forEach((q, j) => {
        const e = E.questions[j] || {};
        if (!!q.people !== !!e.people) bad(`${tag} 템플릿 ${p.id} 질문 ${j + 1} 사람 뽑기 여부가 en 과 다름`);
        if (p.id === 'custom') { if (q.t !== '' || (q.o || []).length) bad(`${tag} 직접 만들기 템플릿은 빈 질문`); return; }
        if (!q.t || len(q.t) > CORE.MAX_TITLE) bad(`${tag} 템플릿 ${p.id} 질문 ${j + 1} 제목 없음/김`);
        if (!q.people) {
          const o = q.o || [];
          if (o.length < 2 || o.length > CORE.MAX_OPT || CORE.cleanList(o).length !== o.length) bad(`${tag} 템플릿 ${p.id} 선택지 2~12개·서로 다름: ${o.join(', ')}`);
          o.forEach((x) => { if (width(x) > 22) bad(`${tag} 템플릿 선택지가 김(2칸 투표 버튼): ${x}`); });
        }
      });
    });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.start', 'ui.coverHint', 'ui.ballotHint', 'ui.cast', 'ui.savedHint', 'result.tieBreak', 'result.summaryTitle', 'result.again', 'result.makeOwn'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
      if (T.ui.presets[1].questions[0].o.join() === EN.ui.presets[1].questions[0].o.join()) bad(`${tag} 음식 템플릿이 en 그대로(현지 예시로)`);
    }
    // 360px 폭 문구
    const W = [['ui.start', 34], ['ui.ready', 34], ['ui.cast', 30], ['ui.next', 30], ['ui.reveal', 30], ['ui.addQ', 30], ['ui.resume', 14], ['ui.discard', 14],
      ['ui.finishEarly', 22], ['ui.cancelVote', 22], ['ui.removeQ', 10], ['ui.presetLabel', 34], ['ui.peopleLabel', 34], ['ui.votersLabel', 34], ['ui.usePeople', 40],
      ['ui.castNeed', 44], ['result.tieBreak', 32], ['result.next', 30], ['result.finish', 30], ['result.copyText', 34], ['result.copyLink', 34], ['result.shareLink', 34],
      ['result.edit', 34], ['result.again', 24], ['result.makeOwn', 34], ['result.tie', 22], ['result.kicker', 30], ['result.summaryTitle', 26]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    if (width(fmt(T.ui.votersValue, { n: 40 })) > 16) bad(`${tag} ui.votersValue 가 김: ${T.ui.votersValue}`);
    if (width(fmt(T.ui.progress, { i: 40, n: 40 })) > 30) bad(`${tag} ui.progress 가 김: ${T.ui.progress}`);
    if (width(fmt(T.result.bar, { c: 40, p: 100 })) > 14) bad(`${tag} result.bar 가 김: ${T.result.bar}`);
    if (width(fmt(T.ui.qLabel, { i: 5 })) > 16) bad(`${tag} ui.qLabel 가 김`);
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking|順位|排名|рейтинг/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 동점 깨기 공정성(crypto.getRandomValues) 설명 없음`);
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
  if (!/<link rel="canonical" href="https:\/\/ballot\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/ballot\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const V = section(html, 'screen-vote');
      const RS = section(html, 'screen-result');
      const SH = section(html, 'screen-shared');
      if (!S || !V || !RS || !SH) { bad(`${tag} 화면(#screen-setup / -vote / -result / -shared) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 4) bad(`${tag} section 은 시작·투표·결과·공유 결과 4개`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      ['vote', 'result', 'shared'].forEach((id) => { if (!new RegExp(`<section id="screen-${id}" class="bl-screen bl-${id}" hidden>`).test(html)) bad(`${tag} #screen-${id} 는 처음에 hidden`); });
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="bl-h1">/.test(S)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const inOrder = (X, list, what) => { const at = list.map((s) => X.indexOf(s)); if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${tag} ${what} 순서가 아님`); };
      inOrder(S, ['class="bl-h1"', 'class="bl-hook"', 'id="resume-box"', 'id="preset-awards"', 'id="preset-food"', 'id="preset-movie"', 'id="preset-custom"', 'id="people"', 'id="questions"', 'id="add-q"', 'id="voters-less"', 'id="voters-value"', 'id="voters-more"', 'id="form-error"', 'id="start-btn"', 'class="bl-fair"', 'mg-ad-start'],
        '시작 화면(h1 → 훅 → 이어 하기 → 템플릿 → 이름 → 질문 → 인원 → 오류 → 시작 → 공정성 → 광고)');
      inOrder(V, ['id="progress-text"', 'id="stage-cover"', 'id="ready-btn"', 'id="stage-ballot"', 'id="ballot-qs"', 'id="cast-btn"', 'id="stage-saved"', 'id="next-btn"', 'id="stage-allin"', 'id="reveal-btn"', 'id="host-tools"', 'id="finish-btn"', 'id="cancel-btn"', 'id="live"'],
        '투표 화면(진행 → 가림 → 투표용지 → 저장됨 → 모두 끝 → 진행자 도구)');
      inOrder(RS, ['id="reveal"', 'id="reveal-step"', 'id="reveal-card"', 'id="reveal-next"', 'id="summary"', 'id="sum-cards"', 'id="copy-text"', 'id="copy-link"', 'id="share-link"', 'id="edit-btn"', 'data-mg-end'],
        '결과 화면(발표 → 최종 결과 → 복사·링크 → 끝 화면)');
      ['stage-cover', 'stage-saved', 'stage-allin', 'resume-box', 'reveal', 'summary'].forEach((id) => { if (!new RegExp(`id="${id}"[^>]*\\shidden[\\s>]`).test(html)) bad(`${tag} #${id} 는 처음에 hidden`); });
      if (!/<form id="stage-ballot"[^>]*hidden/.test(V)) bad(`${tag} 투표용지는 처음에 hidden`);
      if (!/id="cast-btn"[^>]*disabled/.test(V)) bad(`${tag} 투표하기 버튼은 처음에 disabled`);
      if (/bl-bar|\d+%/.test(V.replace(/<[^>]+style="[^"]*"/g, ''))) bad(`${tag} 투표 화면에 표 수 자리가 있음`);
      if (!/<div id="summary"[\s\S]*?<div data-mg-end="ballot"><\/div>\s*<\/div>\s*<\/section>$/.test(RS)) bad(`${tag} data-mg-end="ballot" 는 최종 결과(#summary) 안의 마지막 요소여야 함`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (/data-mg-end/.test(SH)) bad(`${tag} 공유 결과 화면에는 끝 화면 없음`);
      if ((S.match(/role="radio"/g) || []).length !== 4 || !/id="preset-awards" role="radio" aria-checked="true"/.test(S)) bad(`${tag} 템플릿 라디오 4개, 기본 = 시상식`);
      if (!/id="live" class="visually-hidden" aria-live="assertive"/.test(V)) bad(`${tag} 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S + V + RS + SH)) bad(`${tag} 화면에 FAQ`);
      if (T.faq.some((q) => stripRuntime(html).includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html) || !/window\.PAGE_I18N = /.test(html)) bad(`${tag} MG_FAQ / PAGE_I18N 없음`);
      if (html.indexOf('ballot-core.js') < 0 || html.indexOf('ballot-core.js') > html.indexOf('ballot.js"')) bad(`${tag} ballot-core.js 가 ballot.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://ballot.example.com/</loc>') || !sm.includes('<loc>https://ballot.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  if (!fs.existsSync(path.join(SITE, 'README.md'))) bad('README.md 없음');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'ballot.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js) || /'[A-Z][a-z]+ [a-z]+[^']*'/.test(js)) bad('ballot.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("ballot.js: track('start') 1곳, track('done') 1곳");
  const fnBody = (name) => { const i = js.indexOf(`function ${name}(`); return i < 0 ? '' : js.slice(i, js.indexOf('\n  }\n', i)); };
  if (!fnBody('startVoting').includes("track('start')")) bad("ballot.js: track('start') 는 startVoting(투표 시작) 안에");
  if (!fnBody('showSummary').includes("track('done')")) bad("ballot.js: track('done') 은 showSummary(최종 결과) 안에");
  if (/track\(/.test(fnBody('openShared'))) bad('ballot.js: 공유 결과 화면(openShared)은 start/done 을 세지 않음');
  if (/picks/.test(fnBody('saveRun')) || /picks/.test(fnBody('saveDraft'))) bad('ballot.js: 저장에 표(picks)가 들어감');
  if (!/ballotQs\.textContent = ''/.test(fnBody('castNow'))) bad('ballot.js: 투표 뒤 투표용지를 바로 지워야 함(castNow)');
  if (/Math\.random/.test(js)) bad('ballot.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('ballot.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if (!/navigator\.vibrate\)/.test(js)) bad('ballot.js: 진동은 navigator.vibrate 가 있을 때만');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '')) bad(`ballot.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('ballot.js: setShareData / setRetry 등록 없음');
  if (!/mgCleanUrl/.test(js)) bad('ballot.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML|insertAdjacentHTML|outerHTML/.test(js)) bad('ballot.js: innerHTML 금지(이름은 textContent 로만)');
  const core = fs.readFileSync(path.join(SITE, 'ballot-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('ballot-core.js 는 crypto.getRandomValues 만 써야 함');
  const css = fs.readFileSync(path.join(SITE, 'style.css'), 'utf8');
  if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.bl-drum-num[\s\S]*animation: none/.test(css)) bad('style.css: 움직임 줄이기면 두구두구 애니메이션 없음');
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
  if (APP.id !== 'ballot' || APP.category !== 'vote' || APP.path !== 'https://ballot.example.com/' || APP.added !== '2026-11-03' || APP.emoji !== '🗳️' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
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
console.log(`\n비밀 투표 로직(정리·검사·표 넣기·집계·동점·무작위 1000판·결과 링크 왕복/변조·진행 저장)·동점 깨기 공정성(카이제곱 6종) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
if (passed.length) console.log(`  ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 표 수만 남기는 투표(잘못된 표·초과 거절, 합계 = 투표 수)·집계·동점 감지·동점 깨기(crypto 거부 샘플링, 균등)·결과 링크(#d= UTF-8 base64url 왕복, 변조 거절), 언어 파일 12개(키·자리표시자·템플릿·FAQ·제목·360px 문구·번역·글꼴), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·최종 결과 안 data-mg-end), OG 이미지 모두 OK');
