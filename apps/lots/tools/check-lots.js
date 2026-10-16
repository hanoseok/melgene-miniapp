#!/usr/bin/env node
/**
 * 제비뽑기 검사.
 *   1) 로직(lots-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), Fisher–Yates(주입 난수), 입력 검사(쪽지 2~50·이름·간단/직접·
 *      당첨 수·종류 1~10·라벨 20자·중복 라벨·합계 불일치), 글자 정리(제어 문자·꺾쇠 제거), 이름 중복 처리, 뽑기 판(pick 중복·범위 밖 거절, 결과·tally),
 *      공정성 카이제곱(쪽지 위치 고르게 · 3장 순열 6가지 · 첫 사람/마지막 사람 당첨률 · 종류 비율, p≈0.001 기준),
 *      #d= 인코딩/디코딩(왕복, UTF-8 라벨·이름, 변조 거절: 종류 번호 범위 밖·장수 초과·이름 수 불일치·빈 라벨·중복 라벨·결과 수 초과·버전·시각·쓰레기 값, 꺾쇠 정리),
 *      최근 설정 5개(중복 합치기·정리).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, "무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구(버튼·라벨·세그먼트), h1 검색어, 예시 쪽지·당첨/꽝 라벨 길이, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      설정 순서, 뽑기·끝 화면 처음 hidden, data-mg-end="lots" 는 끝 화면 안, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, lots.js 규칙.
 *
 * 실행: node tools/check-lots.js   (tools/check-all.js 가 apps/lots 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'lots-core.js'));
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
const CHI_001 = { 1: 10.83, 4: 18.47, 5: 20.52, 9: 27.88 };
function chi(counts, expected) {
  const N = counts.reduce((a, b) => a + b, 0);
  return counts.reduce((a, x, i) => { const e = expected ? expected[i] * N : N / counts.length; return a + (x - e) * (x - e) / e; }, 0);
}
function checkLogic() {
  eq([CORE.MIN_SLIPS, CORE.MAX_SLIPS, CORE.MAX_KINDS, CORE.MAX_LABEL, CORE.MAX_NAME, CORE.HISTORY_MAX], [2, 50, 10, 20, 20, 5], '한도');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(3, seq([4294967295, 4294967294])), 4294967294 % 3, 'uniformInt(3): 4294967295 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');
  // Fisher–Yates (주입 난수)
  eq(CORE.shuffle([1, 2, 3, 4], (m) => m - 1), [1, 2, 3, 4], 'shuffle j=i 면 그대로');
  eq(CORE.shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1], 'shuffle j=0');
  const orig = [5, 6, 7];
  CORE.shuffle(orig);
  eq(orig, [5, 6, 7], 'shuffle 은 원본을 바꾸지 않음');

  // 입력 검사
  const base = { count: 6, mode: 'simple', winners: 1, winLabel: 'Winner', blankLabel: 'Blank', names: '' };
  const v = (o) => CORE.validate(Object.assign({}, base, o));
  const err = (o) => v(o).error || 'ok';
  eq(err({}), 'ok', 'validate 기본');
  eq(v({}).p.k, [{ l: 'Winner', n: 1, w: true }, { l: 'Blank', n: 5, w: false }], '간단 모드 = 당첨 1 + 꽝 5');
  eq(err({ count: 1 }), 'countRange', '쪽지 1'); eq(err({ count: 51 }), 'countRange', '쪽지 51'); eq(err({ count: 'x' }), 'countRange', '쪽지 글자');
  eq(err({ count: '2.5' }), 'countRange', '쪽지 소수'); eq(err({ count: 2 }), 'ok', '쪽지 2'); eq(err({ count: 50 }), 'ok', '쪽지 50');
  eq(err({ winners: 0 }), 'winnersRange', '당첨 0'); eq(err({ winners: 7 }), 'winnersRange', '당첨 > 쪽지'); eq(v({ winners: 6 }).p.k.length, 1, '당첨 = 쪽지면 꽝 없음');
  eq(v({ winLabel: 'Same', blankLabel: 'same' }).p.k.map((k) => k.l).length, 2, '당첨·꽝 라벨이 같아도 두 종류');
  if (v({ winLabel: 'Same', blankLabel: 'same' }).p.k[0].l.toLowerCase() === v({ winLabel: 'Same', blankLabel: 'same' }).p.k[1].l.toLowerCase()) bad('당첨·꽝 라벨이 같으면 구분해야 함');
  // 이름
  eq(v({ names: 'Mina\nJoon\nMina\n  \n' }).p.names, ['Mina', 'Joon', 'Mina 2'], '이름 중복 → " 2"');
  eq(v({ names: 'A, B; C、D' }).p.total, 4, '이름 구분자 쉼표·세미콜론·、 → 쪽지 수 = 이름 수');
  eq(err({ names: 'Solo' }), 'namesTooFew', '이름 1명'); eq(err({ names: Array.from({ length: 51 }, (_, i) => 'P' + i).join('\n') }), 'namesTooMany', '이름 51명');
  eq(v({ names: 'x'.repeat(40) + '\nB' }).p.names[0].length, CORE.MAX_NAME, '이름 20자 제한'); eq(v({ names: 'x'.repeat(40) + '\nB' }).longName, true, '긴 이름 표시');
  eq(v({ names: '<b>Al</b>\nBo\u0007b' }).p.names, ['b Al /b', 'Bo b'], '이름 꺾쇠·제어 문자 정리');
  // 직접 쓰기
  const c = (kinds, o) => CORE.validate(Object.assign({ count: 6, mode: 'custom', kinds }, o || {}));
  eq(c([{ l: 'Coffee', n: 1 }, { l: 'Dishes', n: 2, w: false }, { l: 'Blank', n: 3, w: false }]).ok, true, '직접 쓰기 합계 6');
  eq(c([{ l: 'Coffee', n: 1 }]).error, 'totalMismatch', '합계 불일치'); eq(c([{ l: 'Coffee', n: 1 }]).sum, 1, '합계 불일치 sum');
  eq(c([]).error, 'kindsEmpty', '종류 없음');
  eq(c(Array.from({ length: 11 }, (_, i) => ({ l: 'K' + i, n: 1 }))).error, 'kindsTooMany', '종류 11개');
  eq(c([{ l: '  ', n: 6 }]).error, 'kindLabel', '빈 라벨'); eq(c([{ l: '<>', n: 6 }]).error, 'kindLabel', '꺾쇠뿐인 라벨');
  eq(c([{ l: 'A', n: 0 }, { l: 'B', n: 6 }]).error, 'kindCount', '장수 0'); eq(c([{ l: 'A', n: 'x' }, { l: 'B', n: 6 }]).error, 'kindCount', '장수 글자');
  eq(c([{ l: 'Tea', n: 3 }, { l: ' tea ', n: 3 }]).error, 'kindDup', '라벨 중복(대소문자·공백 무시)');
  eq(c([{ l: 'x'.repeat(30), n: 6 }]).p.k[0].l.length, CORE.MAX_LABEL, '라벨 20자 제한');
  eq(Array.from(c([{ l: '🎉'.repeat(25), n: 6 }]).p.k[0].l).length, CORE.MAX_LABEL, '라벨 20자 = 코드 포인트 기준(이모지 안 잘림)');
  if (/[<>{}\u0000-\u001f]/.test(c([{ l: '<script>{x}\u0001', n: 6 }]).p.k[0].l)) bad('라벨에 < > { } 제어 문자가 남음');
  eq(c([{ l: 'A', n: 1 }, { l: 'B', n: 1 }], { names: 'x\ny' }).ok, true, '이름 2명 + 종류 합계 2');
  eq(c([{ l: 'A', n: 1 }, { l: 'B', n: 1 }], { names: 'x\ny\nz' }).error, 'totalMismatch', '이름 3명인데 종류 합계 2');
  eq(c([{ l: 'A', n: 1 }, { l: 'B', n: 5 }]).p.k[0].w, true, '축하 기본값 true'); eq(c([{ l: 'A', n: 1, w: false }, { l: 'B', n: 5 }]).p.k[0].w, false, '축하 끄기');
  eq(v({ hide: false, fx: false }).p.hide, false, 'hide 끔'); eq(v({}).p.hide, true, 'hide 기본 켬');

  // 뽑기 판
  const p6 = v({ winners: 2 }).p;
  const deck = CORE.makeDeck(p6);
  eq(deck.slice().sort(), [0, 0, 1, 1, 1, 1], 'deck = 종류를 장수만큼');
  const s = CORE.newSession(p6, (m) => m - 1, 1000);
  eq(s.deck, [0, 0, 1, 1, 1, 1], 'newSession 주입 난수(섞지 않음)');
  eq([CORE.pick(s, 4), CORE.pick(s, 0), CORE.pick(s, 4), CORE.pick(s, 9), CORE.pick(s, -1), CORE.pick(s, 1.5)], [1, 0, -1, -1, -1, -1], 'pick: 이미 뽑은 쪽지·범위 밖 거절');
  eq(CORE.results(s), [1, 0], 'results = 차례 순서 종류');
  eq(CORE.isDone(s), false, 'isDone 아님');
  [1, 2, 3, 5].forEach((i) => CORE.pick(s, i));
  eq(CORE.isDone(s), true, 'isDone');
  eq(CORE.tally(p6, CORE.results(s)).map((t) => t.who.length), [2, 4], 'tally 종류별 인원');

  // 공정성
  // (a) 10장 Fisher–Yates: 0번 카드가 놓이는 위치, 0번 위치에 오는 카드 — 각 10칸 고르게
  const where = new Array(10).fill(0); const first = new Array(10).fill(0);
  const ten = Array.from({ length: 10 }, (_, i) => i);
  for (let i = 0; i < 50000; i++) { const sh = CORE.shuffle(ten); where[sh.indexOf(0)]++; first[sh[0]]++; }
  [['0번 카드 위치', where], ['0번 위치 카드', first]].forEach(([n, arr]) => { const x = chi(arr); if (x > CHI_001[9]) bad(`공정성 ${n}: 카이제곱 ${x.toFixed(2)} > ${CHI_001[9]}`); });
  // (b) 3장 순열 6가지 고르게
  const perms = {};
  for (let i = 0; i < 36000; i++) { const k = CORE.shuffle([0, 1, 2]).join(''); perms[k] = (perms[k] || 0) + 1; }
  eq(Object.keys(perms).length, 6, '3장 순열 6가지가 모두 나옴');
  let x2 = chi(Object.values(perms)); if (x2 > CHI_001[5]) bad(`공정성 3장 순열: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[5]}`);
  // (c) 당첨 1 / 쪽지 5: 사람이 늘 왼쪽부터 고를 때 첫 사람·마지막 사람의 당첨률 = 1/5 (고르는 방법과 무관)
  const p5 = v({ count: 5, winners: 1 }).p;
  const firstWin = [0, 0]; const lastWin = [0, 0]; const posWin = new Array(5).fill(0);
  const N5 = 40000;
  for (let i = 0; i < N5; i++) {
    const d = CORE.makeDeck(p5);
    firstWin[d[0] === 0 ? 0 : 1]++;
    lastWin[d[4] === 0 ? 0 : 1]++;
    posWin[d.indexOf(0)]++;
  }
  [['첫 사람', firstWin], ['마지막 사람', lastWin]].forEach(([n, arr]) => { const x = chi(arr, [0.2, 0.8]); if (x > CHI_001[1]) bad(`공정성 ${n} 당첨률 ${(arr[0] / N5).toFixed(4)} (카이제곱 ${x.toFixed(2)})`); });
  x2 = chi(posWin); if (x2 > CHI_001[4]) bad(`공정성 당첨 쪽지 위치: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[4]}`);
  // (d) 종류 비율 3:2:5 (쪽지 10장) — 한 위치(3번)의 종류 분포가 장수 비율대로
  const pk = c([{ l: 'A', n: 3 }, { l: 'B', n: 2 }, { l: 'C', n: 5 }], { count: 10 }).p;
  const kc = [0, 0, 0];
  for (let i = 0; i < 30000; i++) kc[CORE.makeDeck(pk)[3]]++;
  x2 = chi(kc, [0.3, 0.2, 0.5]); if (x2 > 13.82) bad(`공정성 종류 비율 3:2:5: 카이제곱 ${x2.toFixed(2)} > 13.82`);

  // #d= 인코딩/디코딩
  const pr = c([{ l: '커피 쏘기 ☕', n: 1 }, { l: '«Gage»', n: 1 }, { l: '꽝', n: 1, w: false }], { count: 3, names: '민준\nLéa\nМаша' }).p;
  const rec = { p: pr, r: [2, 0], t: 1792195200123 };
  const enc = CORE.encodeShare(rec);
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeShare: base64url 아님');
  const dec = CORE.decodeShare(enc);
  if (!dec) bad('decodeShare: 왕복 실패');
  else {
    eq(dec.r, rec.r, '왕복 결과'); eq(dec.p.k, pr.k, '왕복 종류(UTF-8)'); eq(dec.p.names, ['민준', 'Léa', 'Маша'], '왕복 이름(UTF-8)');
    eq(dec.p.total, 3, '왕복 쪽지 수'); eq(dec.t, 1792195200000, '왕복 시각(초 단위)');
  }
  if (CORE.encodeShare({ p: pr, r: [], t: 1 }) !== null) bad('encodeShare: 결과가 없으면 null');
  const mk = (o) => CORE.b64urlEncode(JSON.stringify(Object.assign({ v: 1, k: [['Win', 1, 1], ['Blank', 2, 0]], r: [1, 0], t: 1792195200 }, o)));
  eq(!!CORE.decodeShare(mk({})), true, 'decode 기본');
  eq(!!CORE.decodeShare(mk({ m: ['A', 'B', 'C'] })), true, 'decode 이름');
  eq(!!CORE.decodeShare(mk({ r: [1, 0, 1] })), true, 'decode 전부 뽑음');
  [['종류 번호 범위 밖', { r: [2] }], ['종류 번호 음수', { r: [-1] }], ['종류 번호 소수', { r: [0.5] }], ['장수 초과', { r: [0, 0] }], ['결과 수 > 쪽지 수', { r: [1, 1, 0, 1] }],
    ['결과 없음', { r: [] }], ['이름 수 불일치', { m: ['A', 'B'] }], ['이름 형식', { m: ['A', 'B', 3] }], ['빈 라벨', { k: [['', 1, 1], ['B', 2, 0]] }],
    ['꺾쇠뿐인 라벨', { k: [['<>', 1, 1], ['B', 2, 0]] }], ['중복 라벨', { k: [['A', 1, 1], ['a', 2, 0]] }], ['장수 0', { k: [['A', 0, 1], ['B', 3, 0]] }],
    ['축하 값', { k: [['A', 1, 2], ['B', 2, 0]] }], ['종류 모양', { k: [['A', 1], ['B', 2, 0]] }], ['쪽지 1장', { k: [['A', 1, 1]], r: [0] }],
    ['쪽지 51장', { k: [['A', 51, 1]], r: [0] }], ['종류 11개', { k: Array.from({ length: 11 }, (_, i) => ['K' + i, 1, 1]), r: [0] }],
    ['긴 라벨', { k: [['x'.repeat(41), 1, 1], ['B', 2, 0]] }], ['버전', { v: 2 }], ['시각', { t: -1 }], ['시각 소수', { t: 1.5 }]].forEach(([n, o]) => {
    if (CORE.decodeShare(mk(o))) bad(`decodeShare: ${n} 를 거절해야 함`);
  });
  const dirty = CORE.decodeShare(mk({ k: [['<img src=x onerror=1>Win', 1, 1], ['Blank', 2, 0]], m: ['<b>A</b>', 'B', 'C'] }));
  if (!dirty) bad('decodeShare: 정리할 수 있는 라벨은 정리해서 받아야 함');
  else if (/[<>]/.test(dirty.p.k[0].l + dirty.p.names.join(''))) bad('decodeShare: 꺾쇠가 정리되지 않음');
  ['', 'abc$', '!!!', 'e30', null, 123, 'x'.repeat(9000), CORE.b64urlEncode('not json'), CORE.b64urlEncode('[1,2]')].forEach((str) => { if (CORE.decodeShare(str)) bad(`decodeShare 쓰레기 값 허용: ${String(str).slice(0, 10)}`); });
  // 큰 판(50장, 이름 50명, 종류 10개, 라벨 20자)도 왕복
  const bigKinds = Array.from({ length: 10 }, (_, i) => ({ l: ('Prize ' + i + ' ').padEnd(20, '★'), n: 5 }));
  const bigP = c(bigKinds, { count: 50, names: Array.from({ length: 50 }, (_, i) => ('Name' + i).padEnd(20, 'é')).join('\n') }).p;
  if (!bigP) bad('큰 판 validate 실패');
  else {
    const bs = CORE.newSession(bigP);
    for (let i = 0; i < 50; i++) CORE.pick(bs, i);
    const bigEnc = CORE.encodeShare({ p: bigP, r: CORE.results(bs), t: Date.now() });
    const bd = CORE.decodeShare(bigEnc);
    if (!bd || bd.r.length !== 50) bad(`decodeShare: 큰 판 왕복 실패 (길이 ${bigEnc.length})`);
  }

  // 최근 설정
  let h = [];
  for (let i = 1; i <= 7; i++) h = CORE.pushHistory(h, { mode: 'simple', p: v({ count: i + 1 }).p, t: i });
  eq(h.length, 5, '최근 설정 5개'); eq(h[0].p.total, 8, '최근 설정 최신이 맨 앞');
  h = CORE.pushHistory(h, { mode: 'simple', p: v({ count: 5 }).p, t: 99 });
  eq([h.length, h[0].t, h.filter((x) => x.p.total === 5).length], [5, 99, 1], '같은 설정은 합쳐서 맨 앞으로');
  eq(CORE.cleanHistory([null, 'x', { p: { k: [] }, t: 1 }, { mode: 'custom', p: { k: [{ l: 'A', n: 1 }, { l: 'B', n: 1 }], total: 2, names: [] }, t: 5 }, { mode: 'custom', p: { k: [{ l: 'A', n: 9 }], total: 2, names: [] }, t: 5 }]).length, 1, 'cleanHistory');
  eq(CORE.cleanHistory('nope'), [], 'cleanHistory 배열 아님');
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
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.') || p.startsWith('ui.customExample')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.countLabel', 'ui.start', 'draw.next', 'result.again', 'result.heading', 'errors.totalMismatch'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·세그먼트·칩)
    const W = [['ui.start', 24], ['ui.countLabel', 24], ['ui.winnersLabel', 22], ['ui.modeSimple', 20], ['ui.modeCustom', 20], ['ui.namesBtn', 36], ['ui.kindAdd', 22],
      ['ui.fillBlank', 24], ['ui.fxLabel', 30], ['ui.hideLabel', 40], ['ui.recentTitle', 24], ['ui.recentClear', 12], ['ui.kindPh', 24], ['ui.winLabel', 12], ['ui.blankLabel', 12],
      ['draw.next', 22], ['draw.seeResults', 22], ['draw.finish', 22], ['draw.finishConfirm', 30], ['draw.ready', 20], ['draw.progress', 20], ['draw.winTag', 24], ['draw.blankTag', 30],
      ['result.copy', 22], ['result.copyLink', 22], ['result.edit', 28], ['result.again', 24], ['result.makeOwn', 28], ['result.sharedBadge', 34], ['result.heading', 24], ['result.byPrize', 24]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    // 당첨/꽝 라벨·예시 쪽지
    if (!T.ui.winLabel || !T.ui.blankLabel || T.ui.winLabel.toLowerCase() === T.ui.blankLabel.toLowerCase()) bad(`${tag} 당첨/꽝 라벨이 비었거나 같음`);
    [T.ui.winLabel, T.ui.blankLabel].forEach((l) => { if (CORE.cleanText(l, CORE.MAX_LABEL) !== l) bad(`${tag} 당첨/꽝 라벨이 20자 넘거나 정리됨: ${l}`); });
    const ex = T.ui.customExample;
    if (!Array.isArray(ex) || ex.length < 1 || ex.length > 3) bad(`${tag} ui.customExample 1~3개`);
    else {
      const sum = ex.reduce((a, k) => a + k.n, 0);
      if (sum >= CORE.DEFAULTS.count) bad(`${tag} 예시 쪽지 합계 ${sum} 은 기본 쪽지 수(${CORE.DEFAULTS.count})보다 작아야 꽝이 남음`);
      const chk = CORE.validate({ mode: 'custom', count: CORE.DEFAULTS.count, kinds: ex.concat([{ l: T.ui.blankLabel, n: CORE.DEFAULTS.count - sum, w: false }]) });
      if (!chk.ok) bad(`${tag} 예시 쪽지 + 꽝이 검사를 통과하지 못함: ${chk.error}`);
      ex.forEach((k) => { if (CORE.cleanText(k.l, CORE.MAX_LABEL) !== k.l) bad(`${tag} 예시 쪽지 라벨 길이/글자: ${k.l}`); });
    }
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
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Rubik|Nunito|Dela\+Gothic|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Alfa\+Slab|Be\+Vietnam|Dela\+Gothic|Kanit/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 제목 글꼴이 아님`);
    if (lang === 'th' && !/Kanit|Mitr|Prompt|Sarabun/.test(T.fonts.css)) bad(`${tag} 태국어 제목 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`));
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
  if (!/<link rel="canonical" href="https:\/\/lots\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/lots\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const Dr = section(html, 'screen-draw');
      const En = section(html, 'screen-end');
      if (!S || !Dr || !En) { bad(`${tag} 화면(#screen-setup / #screen-draw / #screen-end) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 3) bad(`${tag} section 은 시작·뽑기·끝 화면 3개`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (!/<section id="screen-draw"[^>]*hidden>/.test(html) || !/<section id="screen-end"[^>]*hidden>/.test(html)) bad(`${tag} 뽑기·끝 화면은 처음에 hidden`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐 (뽑기 화면 광고 없음)`);
      if (!/<h1 class="lt-h1">/.test(S)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="lt-h1"', 'id="count"', 'id="names-btn"', 'id="names"', 'id="mode-simple"', 'id="mode-custom"', 'id="winners"', 'id="kinds"', 'id="kind-add"', 'id="fill-blank"',
        'id="hide"', 'id="fx"', 'id="error"', 'id="start-btn"', 'id="recent"', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((x, i) => i && x < seq[i - 1])) bad(`${tag} 시작 화면 순서(h1 → 쪽지 수 → 이름 → 내용 → 옵션 → 시작 → 최근 설정 → 광고)가 아님`);
      if (!/<div id="names-box" class="lt-names" hidden>/.test(S)) bad(`${tag} 이름 칸은 처음에 접힘`);
      if (!/<div id="custom-box" class="lt-custom" hidden>/.test(S)) bad(`${tag} 직접 쓰기 칸은 처음에 숨김`);
      if (!/<div id="recent" class="lt-card lt-recent" hidden>/.test(S)) bad(`${tag} 최근 설정은 처음에 숨김`);
      if (!/id="count"[^>]*value="6"/.test(S) || !/id="winners"[^>]*value="1"/.test(S)) bad(`${tag} 기본값 쪽지 6장, 당첨 1장`);
      if (!/id="hide" role="switch" checked/.test(S) || !/id="fx" role="switch" checked/.test(S)) bad(`${tag} 가리기·꽃가루 스위치 기본 켬`);
      if (!/id="error" class="lt-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if ((S.match(/role="radio"/g) || []).length !== 2) bad(`${tag} 모드 선택(라디오 2개) 접근성`);
      ['id="progress"', 'id="turn"', 'id="grid"', 'id="finish-btn"', 'id="reveal"', 'id="paper"', 'id="next-btn"', 'id="pass"', 'id="ready-btn"'].forEach((s) => { if (!Dr.includes(s)) bad(`${tag} 뽑기 화면에 ${s} 없음`); });
      if (!/id="reveal" class="lt-cover lt-reveal" hidden/.test(Dr) || !/id="pass" class="lt-cover lt-pass" hidden/.test(Dr)) bad(`${tag} 펼친 쪽지·폰 넘기기 덮개는 처음에 hidden`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(Dr)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      const eSeq = ['id="result-card"', 'id="shared-badge"', 'id="summary"', 'id="tally"', 'id="copy-btn"', 'id="link-btn"', 'id="edit-btn"', '<div data-mg-end="lots"></div>'].map((s) => En.indexOf(s));
      if (eSeq.some((i) => i < 0) || eSeq.some((x, i) => i && x < eSeq[i - 1])) bad(`${tag} 끝 화면 순서(결과 카드 → 복사·링크·설정 → 공통 끝 화면)가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/id="shared-badge" class="lt-badge" hidden/.test(En)) bad(`${tag} 공유 결과 배지는 처음에 hidden`);
      if (/mg-faq|<details/.test(S + Dr)) bad(`${tag} 시작·뽑기 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('lots-core.js') < 0 || html.indexOf('lots-core.js') > html.indexOf('lots.js"')) bad(`${tag} lots-core.js 가 lots.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://lots.example.com/</loc>') || !sm.includes('<loc>https://lots.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'lots.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('lots.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("lots.js: track('start') 는 뽑기 시작 1곳, track('done') 은 결과 1곳");
  if (/Math\.random/.test(js)) bad('lots.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('lots.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  const lines = js.split('\n');
  if (!lines.some((l) => /localStorage\./.test(l))) bad('lots.js: 최근 설정을 localStorage 에 저장해야 함');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`lots.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('lots.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('lots.js: #d= 공유 결과 보기 없음');
  if (!/mgCleanUrl/.test(js)) bad('lots.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*(?!\s|'')/.test(js)) bad('lots.js: 사용자 글자를 innerHTML 로 넣지 않는다(textContent 만)');
  const core = fs.readFileSync(path.join(SITE, 'lots-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('lots-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'lots' || APP.category !== 'vote' || APP.path !== 'https://lots.example.com/' || APP.added !== '2026-10-17' || APP.emoji !== '🎟️' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
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
console.log(`\n제비뽑기 로직·입력 검사·공정성(카이제곱 7종)·#d= 왕복/변조 거절 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 쪽지 섞기(crypto 거부 샘플링 + Fisher–Yates)·입력 검사·공정성·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·끝 화면), OG 이미지 모두 OK');
