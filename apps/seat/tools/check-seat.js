#!/usr/bin/env node
/**
 * 자리 바꾸기(랜덤 자리 배치) 검사.
 *   1) 로직(seat-core.js): 거부 샘플링(uniformInt), 이름 읽기(줄바꿈·쉼표·중복 이름·숫자 하나 = 번호·100명·20자), 교실(줄·칸 1~10, 막은 자리, remapSeat),
 *      검사(validate: 이름 없음·자리 부족·고정 자리 충돌·앞자리 부족·떨어뜨릴 짝이 붙어서 고정), 섞기(arrange: 결과가 모든 규칙을 지키는지 여러 경우,
 *      불가능한 경우 impossible), 공정성 카이제곱(규칙 없는 3명 3자리 순열 6가지, 빈자리가 있을 때 자리별, 고정·앞자리 규칙이 있을 때 나머지 자리별, p≈0.001),
 *      화면 순서(학생 쪽/선생님 쪽), 텍스트 표, #d= 인코딩/디코딩(왕복·번호 이름 압축·UTF-8, 변조·중복·막은 자리에 앉음·범위 밖 거절).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, "무료인가요?" 류 금지),
 *      예시 이름 20개(한도 안·중복 없음), 제목·설명 길이, 360px 폭 문구, h1 검색어 = app.config 제목, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-seat) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 이름 → 줄·칸 → 자리 지도 → 규칙(접힘) → 섞기 → 결과(#result, 처음 hidden) 안 자리표 카드 → data-mg-end="seat" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, seat.js 규칙.
 *
 * 실행: node tools/check-seat.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'seat-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------------------------------------------------------------- 1) 로직
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 7: 24.32, 9: 27.88 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
function plan(o) {
  return Object.assign({ names: CORE.numberNames(10), rows: 3, cols: 4, blocked: [], fixed: [], front: [], apart: [] }, o);
}
function checkLogic() {
  eq([CORE.MAX_NAMES, CORE.MAX_LEN, CORE.MAX_ROWS, CORE.MAX_COLS, CORE.FRONT_ROWS], [100, 20, 10, 10, 2], '한도');
  eq([CORE.DEFAULTS.rows, CORE.DEFAULTS.cols], [5, 6], '기본 교실 5×6');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');
  eq(CORE.shuffle([1, 2, 3, 4], (m) => m - 1), [1, 2, 3, 4], 'shuffle: 늘 마지막을 고르면 그대로');
  eq(CORE.shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1], 'shuffle: 늘 0 이면 한 칸씩 밀림');

  // 이름 읽기
  const pn = (t) => CORE.parseNames(t);
  eq(pn(' Ava ,Noah\n\nMia；Leo、Zoe\tKai ').names, ['Ava', 'Noah', 'Mia', 'Leo', 'Zoe', 'Kai'], '이름 나누기');
  eq(pn('Ava\nava\nAva').names, ['Ava', 'ava 2', 'Ava 3'], '같은 이름(대소문자 무시)은 번호');
  eq(pn('28'), { names: CORE.numberNames(28), numbered: true, dropped: 0 }, '숫자 하나 = 번호');
  eq(pn('150').names.length, 100, '번호 150 → 100'); eq(pn('150').dropped, 50, '번호 150 → 50 버림');
  eq(pn('0').names, ['0'], '0 은 이름 하나');
  eq(pn('1, 2, 3').numbered, false, '숫자 여러 개는 이름');
  eq(pn(Array.from({ length: 105 }, (_, i) => 'N' + i).join('\n')).dropped, 5, '100명 넘으면 버림');
  eq(Array.from(pn('가'.repeat(30)).names[0]).length, 20, '이름 20자');
  if (/[<>]/.test(pn('<b>x</b>').names.join(''))) bad('이름에 < > 가 남음');
  eq(pn('김민준 \n  김민준').names, ['김민준', '김민준 2'], '한글 같은 이름');

  // 교실
  eq(CORE.clampSide(0, 10), 1, 'clampSide 0'); eq(CORE.clampSide(11, 10), 10, 'clampSide 11'); eq(CORE.clampSide('x', 10), 1, 'clampSide 글자');
  eq(CORE.cleanBlocked([3, 3, -1, 12, 1.5, 0], 12), [0, 3], 'cleanBlocked');
  eq(CORE.remapSeat(7, 4, 3, 6), 9, 'remapSeat (1,3) → 6칸'); eq(CORE.remapSeat(7, 4, 3, 3), null, 'remapSeat 범위 밖');
  eq([CORE.adjacent(0, 1, 4), CORE.adjacent(0, 5, 4), CORE.adjacent(0, 2, 4), CORE.adjacent(3, 4, 4), CORE.adjacent(0, 0, 4)], [true, true, false, false, false], 'adjacent (대각선 포함, 줄 끝 넘김 없음)');
  eq(CORE.displayOrder(2, 3, 'student'), [0, 1, 2, 3, 4, 5], '학생 쪽 순서'); eq(CORE.displayOrder(2, 3, 'teacher'), [5, 4, 3, 2, 1, 0], '선생님 쪽 순서(180°)');

  // 검사
  const err = (o) => { const v = CORE.validate(plan(o)); return v.ok ? 'ok' : v.error; };
  eq(err({}), 'ok', 'validate 기본');
  eq(err({ names: [] }), 'noNames', '이름 없음');
  eq(err({ names: CORE.numberNames(13) }), 'notEnoughSeats', '자리 부족 13 > 12');
  eq(err({ names: CORE.numberNames(11), blocked: [0, 1] }), 'notEnoughSeats', '막은 자리 고려한 자리 부족');
  eq(CORE.validate(plan({ names: CORE.numberNames(13) })).vars, { n: 13, s: 12 }, 'notEnoughSeats 값');
  eq(err({ fixed: [[0, 3]], blocked: [3] }), 'pinBlocked', '막은 자리에 고정');
  eq(err({ fixed: [[0, 3], [0, 4]] }), 'pinTwice', '한 사람 두 자리');
  eq(err({ fixed: [[0, 3], [1, 3]] }), 'pinSame', '두 사람 한 자리');
  eq(err({ fixed: [[0, 11]], front: [0] }), 'pinNotFront', '앞자리인데 뒤에 고정');
  eq(err({ fixed: [[0, 5]], front: [0] }), 'ok', '앞자리 + 둘째 줄 고정은 OK');
  eq(err({ names: CORE.numberNames(10), front: [0, 1, 2, 3, 4, 5, 6, 7, 8] }), 'frontFull', '앞자리 9명 > 앞 두 줄 8자리');
  eq(err({ front: [0, 1, 2, 3, 4, 5, 6, 7], blocked: [] }), 'ok', '앞자리 8명 = 8자리');
  eq(err({ front: [0, 1, 2, 3, 4, 5, 6], blocked: [1, 2] }), 'frontFull', '앞자리 7명 > 막은 뒤 6자리');
  eq(err({ fixed: [[0, 0], [1, 5]], apart: [[0, 1]] }), 'apartPinned', '떨어뜨릴 짝이 대각선으로 고정');
  eq(err({ fixed: [[0, 0], [1, 2]], apart: [[0, 1]] }), 'ok', '떨어뜨릴 짝이 떨어져 고정');
  eq(CORE.validate(plan({ apart: [[0, 0], [1, 2], [2, 1], [3, 99]] })).p.apart, [[1, 2]], 'apart 정리(자기 자신·중복·범위 밖 제거)');

  // 섞기: 규칙을 지키는지
  const cases = [
    plan({}),
    plan({ names: CORE.numberNames(12) }),
    plan({ names: CORE.numberNames(8), blocked: [1, 5, 9] }),
    plan({ fixed: [[0, 0], [1, 11]], front: [2, 3, 4], apart: [[5, 6], [5, 7], [6, 7]] }),
    plan({ names: CORE.numberNames(30), rows: 5, cols: 6, fixed: [[0, 2]], front: [1, 2, 3, 4, 5, 6], apart: [[7, 8], [9, 10], [7, 9], [11, 12]] }),
    plan({ names: CORE.numberNames(100), rows: 10, cols: 10, apart: [[0, 1], [2, 3], [4, 5]], front: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] }),
    plan({ names: CORE.numberNames(5), rows: 3, cols: 3, apart: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2]] }),
    plan({ names: CORE.numberNames(1), rows: 1, cols: 1 }),
  ];
  cases.forEach((c, ci) => {
    const v = CORE.validate(c);
    if (!v.ok) { bad(`case ${ci} validate ${v.error}`); return; }
    for (let t = 0; t < 40; t++) {
      const r = CORE.arrange(v.p);
      if (!r.ok) { bad(`case ${ci}: 배치를 못 찾음 (${r.error})`); break; }
      if (!CORE.satisfies(v.p, r.seats)) { bad(`case ${ci}: 규칙을 어긴 배치`); break; }
      if (r.seats.filter((k) => k >= 0).length !== c.names.length) { bad(`case ${ci}: 앉은 사람 수`); break; }
    }
  });
  // 빽빽한 경우: 거절 단계로 안 되면 탐색(search)으로
  const tight = CORE.validate(plan({ names: CORE.numberNames(9), rows: 3, cols: 3, apart: [[0, 1], [0, 2], [1, 2], [3, 4]] })).p;
  const rt = CORE.arrange(tight);
  if (!rt.ok || !CORE.satisfies(tight, rt.seats)) bad('빽빽한 3×3 + 떨어뜨리기 3쌍: 배치를 찾아야 함');
  // 불가능
  [plan({ names: CORE.numberNames(4), rows: 2, cols: 2, apart: [[0, 1]] }),
    plan({ names: CORE.numberNames(3), rows: 1, cols: 3, apart: [[0, 1], [1, 2]], fixed: [[1, 1]] }),
    plan({ names: CORE.numberNames(9), rows: 3, cols: 3, apart: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 5], [4, 6], [4, 7], [4, 8]] })].forEach((c, i) => {
    const v = CORE.validate(c);
    if (!v.ok) return;
    const r = CORE.arrange(v.p);
    if (r.ok) bad(`불가능 case ${i}: 배치가 나오면 안 됨`);
    else if (r.error !== 'impossible') bad(`불가능 case ${i}: error ${r.error}`);
  });
  // satisfies 가 위반을 잡는지
  const sp = CORE.validate(plan({ names: CORE.numberNames(3), rows: 1, cols: 5, blocked: [4], fixed: [[2, 2]], apart: [[0, 1]] })).p;
  eq(CORE.satisfies(sp, [0, -1, 2, 1, -1]), true, 'satisfies: 맞는 배치');
  eq(CORE.satisfies(sp, [0, -1, 2, -1, -1]), false, 'satisfies: 사람이 빠짐');
  eq(CORE.satisfies(sp, [0, -1, 2, -1, 1]), false, 'satisfies: 막은 자리에 앉음');
  eq(CORE.satisfies(sp, [0, 1, 2, -1, -1]), false, 'satisfies: 떨어뜨릴 짝이 붙음');
  eq(CORE.satisfies(sp, [2, 0, -1, 1, -1]), false, 'satisfies: 고정 자리 어김');
  eq(CORE.satisfies(sp, [0, 0, 2, 1, -1]), false, 'satisfies: 같은 사람 두 번');

  // 공정성
  // (a) 규칙 없음, 3명 3자리: 순열 6가지가 고르게 (60,000번)
  const pa = CORE.validate(plan({ names: CORE.numberNames(3), rows: 1, cols: 3 })).p;
  const perm = {};
  for (let i = 0; i < 60000; i++) { const k = CORE.arrange(pa).seats.join(''); perm[k] = (perm[k] || 0) + 1; }
  if (Object.keys(perm).length !== 6) bad(`공정성 3명 순열 ${Object.keys(perm).length}가지 (6)`);
  else { const x2 = chi(Object.values(perm)); if (x2 > CHI_001[5]) bad(`공정성 3명 순열: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[5]}`); }
  // (b) 빈자리가 있을 때: 1번 학생이 6자리 중 어디에 앉나 (막은 자리 제외), 학생 4명
  const pb = CORE.validate(plan({ names: CORE.numberNames(4), rows: 2, cols: 4, blocked: [1, 6] })).p;
  const posB = new Array(8).fill(0);
  for (let i = 0; i < 30000; i++) posB[CORE.arrange(pb).seats.indexOf(0)]++;
  if (posB[1] || posB[6]) bad('공정성: 막은 자리에 앉음');
  let x2 = chi(posB.filter((_, i) => i !== 1 && i !== 6)); if (x2 > CHI_001[5]) bad(`공정성 빈자리 있을 때 자리별: 카이제곱 ${x2.toFixed(2)}`);
  // (c) 앞자리 규칙: 앞자리 학생은 앞 두 줄 8자리 중 고르게, 나머지 학생 한 명은 남은 자리 중 고르게
  const pc = CORE.validate(plan({ names: CORE.numberNames(6), rows: 3, cols: 4, front: [0], fixed: [[5, 11]] })).p;
  const posF = new Array(12).fill(0); const posO = new Array(12).fill(0);
  for (let i = 0; i < 40000; i++) { const s = CORE.arrange(pc).seats; posF[s.indexOf(0)]++; posO[s.indexOf(1)]++; }
  if (posF.slice(8).some((v) => v)) bad('공정성: 앞자리 학생이 셋째 줄에');
  x2 = chi(posF.slice(0, 8)); if (x2 > CHI_001[7]) bad(`공정성 앞자리 학생 자리별: 카이제곱 ${x2.toFixed(2)}`);
  if (posO[11]) bad('공정성: 고정 자리에 다른 학생');
  // 나머지 학생: 앞 두 줄 8자리끼리, 셋째 줄 3자리끼리 고르게(앞자리 학생이 앞 줄을 하나 차지하므로 두 묶음의 확률은 다르다 — 균등 배치에서 기대값 7/40 : 1/5)
  x2 = chi(posO.slice(0, 8)); if (x2 > CHI_001[7]) bad(`공정성 나머지 학생 앞 두 줄: 카이제곱 ${x2.toFixed(2)}`);
  x2 = chi(posO.slice(8, 11)); if (x2 > CHI_001[2]) bad(`공정성 나머지 학생 셋째 줄: 카이제곱 ${x2.toFixed(2)}`);
  const frontShare = posO.slice(0, 8).reduce((a, b) => a + b, 0) / 40000;
  if (Math.abs(frontShare - 0.7) > 0.015) bad(`공정성 나머지 학생이 앞 두 줄에 앉는 비율 ${frontShare.toFixed(3)} (기대 0.7)`);
  // (d) 떨어뜨리기(거절 단계 균등): 1×4 에서 0·1 떨어뜨리기 → 허용 배치 12가지가 고르게
  const pd = CORE.validate(plan({ names: CORE.numberNames(4), rows: 1, cols: 4, apart: [[0, 1]] })).p;
  const pdC = {};
  for (let i = 0; i < 36000; i++) { const r = CORE.arrange(pd); pdC[r.seats.join(',')] = (pdC[r.seats.join(',')] || 0) + 1; }
  const pdK = Object.keys(pdC);
  if (pdK.length !== 12) bad(`공정성 떨어뜨리기 허용 배치 ${pdK.length}가지 (12)`);
  else { x2 = chi(Object.values(pdC)); if (x2 > 31.26) bad(`공정성 떨어뜨리기 배치: 카이제곱 ${x2.toFixed(2)}`); }

  // 텍스트 표
  const res = { rows: 2, cols: 3, blocked: [1], names: ['Ava', 'Bo', '김민준'], seats: [0, -1, 1, 2, -1, -1] };
  const L = { title: 'Seating chart', desk: 'Desk', empty: 'empty', aisle: '—' };
  const ts = CORE.toText(res, L, 'student').split('\n');
  eq(ts[0], 'Seating chart', '텍스트 제목');
  if (!/\[ Desk \]/.test(ts[2]) || !/^\| Ava/.test(ts[4]) || !ts[5].includes('김민준') || !ts[4].includes('—') || !ts[5].includes('empty')) bad(`텍스트 표(학생 쪽): ${JSON.stringify(ts)}`);
  const tt = CORE.toText(res, L, 'teacher').split('\n');
  if (!/\[ Desk \]$/.test(tt[tt.length - 1]) || !/^\| empty/.test(tt[2])) bad(`텍스트 표(선생님 쪽): ${JSON.stringify(tt)}`);
  if (new Set(ts.slice(4).map(CORE.textWidth)).size !== 1) bad('텍스트 표 줄 폭이 다름(한글 2칸 계산)');

  // #d= 인코딩/디코딩
  const rec = Object.assign({ t: 1791676800123 }, res);
  const enc = CORE.encodeShare(rec);
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeShare: base64url 아님');
  const dec = CORE.decodeShare(enc);
  if (!dec) bad('decodeShare: 왕복 실패');
  else { eq([dec.rows, dec.cols, dec.blocked, dec.names, dec.seats, dec.t], [2, 3, [1], ['Ava', 'Bo', '김민준'], [0, -1, 1, 2, -1, -1], 1791676800000], '왕복'); }
  const numRec = { rows: 1, cols: 3, blocked: [], names: CORE.numberNames(3), seats: [2, 0, 1], t: 0 };
  const numEnc = JSON.parse(CORE.b64urlDecode(CORE.encodeShare(numRec)));
  if (numEnc.k !== 3 || numEnc.n) bad('번호 이름은 k 로 압축');
  eq((CORE.decodeShare(CORE.encodeShare(numRec)) || {}).names, ['1', '2', '3'], '번호 이름 왕복');
  const mk = (o) => CORE.b64urlEncode(JSON.stringify(Object.assign({ v: 1, r: 1, c: 3, n: ['A', 'B'], s: [0, 1, -1], t: 1791676800 }, o)));
  eq(!!CORE.decodeShare(mk({})), true, 'decode 기본');
  [['같은 사람 두 번', { s: [0, 0, -1] }], ['사람 빠짐', { s: [0, -1, -1] }], ['범위 밖 번호', { s: [0, 2, -1] }], ['자리 수 불일치', { s: [0, 1] }],
    ['막은 자리에 앉음', { b: [1] }], ['줄 0', { r: 0 }], ['칸 11', { c: 11, s: new Array(11).fill(-1) }], ['버전', { v: 2 }], ['시각', { t: -5 }],
    ['이름 중복', { n: ['A', 'a'] }], ['이름에 <', { n: ['<A>', 'B'] }], ['이름 빈 값', { n: ['', 'B'] }], ['n·k 동시', { k: 2 }], ['소수', { s: [0, 1.5, -1] }],
    ['막은 자리 형식', { b: 'x' }], ['자리 부족', { n: ['A', 'B', 'C', 'D'], s: [0, 1, 2] }]].forEach(([n, o]) => {
    if (CORE.decodeShare(mk(o))) bad(`decodeShare: ${n} 를 거절해야 함`);
  });
  ['', 'abc$', '!!!', 'e30', null, 123, 'x'.repeat(30000)].forEach((s) => { if (CORE.decodeShare(s)) bad(`decodeShare 쓰레기 값 허용: ${String(s).slice(0, 10)}`); });
  // 100명(20자 이름) 왕복 길이
  const bigNames = Array.from({ length: 100 }, (_, i) => ('학생' + i).padEnd(20, '가'));
  const bigP = CORE.validate({ names: bigNames, rows: 10, cols: 10 }).p;
  const bigRec = { rows: 10, cols: 10, blocked: [], names: bigNames, seats: CORE.arrange(bigP).seats, t: Date.now() };
  const bigEnc = CORE.encodeShare(bigRec);
  if (!CORE.decodeShare(bigEnc)) bad(`decodeShare: 100명 왕복 실패 (길이 ${bigEnc.length})`);
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
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.') || p.startsWith('sample.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.namesLabel', 'ui.shuffle', 'ui.mapHint', 'result.again', 'result.heading', 'errors.impossible'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
      if (T.sample.join() === EN.sample.join()) bad(`${tag} 예시 이름이 en 과 같음(그 나라 이름으로)`);
    }
    // 예시 이름
    if (!Array.isArray(T.sample) || T.sample.length !== 20) bad(`${tag} sample 은 20명`);
    else {
      const p = CORE.parseNames(T.sample.join('\n'));
      if (p.names.join('|') !== T.sample.join('|')) bad(`${tag} sample 이 이름 규칙(20자·중복 없음·쉼표 없음)에 맞지 않음`);
      if (T.sample.length > CORE.DEFAULTS.rows * CORE.DEFAULTS.cols) bad(`${tag} sample 이 기본 교실보다 많음`);
    }
    // 360px 폭 문구 (버튼·라벨·칩)
    const W = [['ui.shuffle', 24], ['ui.shuffling', 20], ['result.again', 22], ['result.makeOwn', 28], ['result.copy', 16], ['result.png', 16], ['result.copyLink', 16],
      ['ui.sample', 20], ['ui.clear', 10], ['ui.modeBlock', 18], ['ui.modePin', 18], ['result.viewStudent', 14], ['result.viewTeacher', 14], ['result.skip', 16],
      ['ui.rowsLabel', 20], ['ui.colsLabel', 20], ['ui.apartAdd', 12], ['ui.frontAdd', 12], ['ui.more', 32], ['result.sharedBadge', 30], ['ui.desk', 22], ['ui.namesCount', 18], ['ui.seatsCount', 22]];
    W.forEach(([p, max]) => { const v = get(T, p).replace(/\{n\}/g, '100'); if (width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    // 제목·h1
    if (T.hero.h1Kicker !== APP.title[lang]) bad(`${tag} h1 검색어(hero.h1Kicker)가 app.config 제목과 다름`);
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
    if (!T.meta.title.toLowerCase().startsWith(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 이 현지 검색어(app.config title "${APP.title[lang]}")로 시작하지 않음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-seat"[\s\S]*?<\/section>/);
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
  if (!/<link rel="canonical" href="https:\/\/seat\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/seat\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!S) { bad(`${tag} 첫 화면(#screen-seat) 없음`); return; }
      if (/<section id="screen-seat"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="st-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(`<span class="st-kicker">${G.esc(T.hero.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="st-h1"', 'id="sample-btn"', 'id="names"', 'id="names-count"', 'id="rows"', 'id="cols"', 'id="mode-block"', 'id="mode-pin"', 'id="pin-name"', 'id="map"',
        'id="more-btn"', 'id="apart-a"', 'id="apart-b"', 'id="front-name"', 'id="pin-list"', 'id="error"', 'id="shuffle-btn"', 'id="result"', 'id="result-card"',
        'id="view-student"', 'id="view-teacher"', 'id="skip-btn"', 'id="board"', 'id="copy-btn"', 'id="png-btn"', 'id="link-btn"', '<div data-mg-end="seat"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((v, i) => i && v < seq[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 이름 → 줄·칸 → 지도 → 규칙 → 섞기 → 자리표 카드 → 끝 화면 → 광고)가 아님`);
      [['<div id="result" class="st-result" hidden>', '결과·끝 화면(#result)은 처음에 hidden'], ['<div id="more" class="st-card st-more" hidden>', '규칙(#more)은 처음에 접힘'],
        ['id="pin-pick" for="pin-name" hidden', '고정할 이름 고르기는 처음에 숨김'], ['<button type="button" id="skip-btn" class="st-mini" hidden>', '건너뛰기는 처음에 숨김'],
        ['id="shared-badge" class="st-badge" hidden', '공유 배지는 처음에 hidden'], ['id="error" class="st-error" role="alert" hidden', '오류 안내(role=alert)'],
        ['id="live" class="visually-hidden" aria-live="polite"', '결과 읽어 주기(aria-live)']].forEach(([s, m]) => { if (!S.includes(s)) bad(`${tag} ${m}`); });
      if (!new RegExp(`<output class="st-step-num" id="rows"[^>]*>${CORE.DEFAULTS.rows}</output>`).test(S) || !new RegExp(`<output class="st-step-num" id="cols"[^>]*>${CORE.DEFAULTS.cols}</output>`).test(S)) bad(`${tag} 기본 교실 ${CORE.DEFAULTS.rows}×${CORE.DEFAULTS.cols}`);
      if ((S.match(/role="radio"/g) || []).length !== 4) bad(`${tag} 라디오(탭 방식 2 + 보는 쪽 2) 접근성`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (T.sample.some((n) => bodyNoJson.includes(`>${G.esc(n)}<`))) bad(`${tag} 예시 이름이 HTML 에 미리 들어 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('seat-core.js') < 0 || html.indexOf('seat-core.js') > html.indexOf('seat.js"')) bad(`${tag} seat-core.js 가 seat.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://seat.example.com/</loc>') || !sm.includes('<loc>https://seat.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'seat.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('seat.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("seat.js: track('start') 는 섞기 1곳, track('done') 은 공개 끝 1곳");
  if (/Math\.random/.test(js)) bad('seat.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('seat.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  const lines = js.split('\n');
  if (!lines.some((l) => /localStorage\./.test(l))) bad('seat.js: 마지막 입력을 localStorage 에 저장해야 함');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`seat.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('seat.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('seat.js: #d= 공유 자리표 보기 없음');
  if (/[?&]d=|searchParams/.test(js)) bad('seat.js: 공유 상태는 #d= (쿼리 금지)');
  if (!/mgCleanUrl/.test(js)) bad('seat.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*[^'"]/.test(js.replace(/innerHTML = ''/g, ''))) bad('seat.js: 이름을 innerHTML 로 넣으면 안 됨(textContent)');
  const core = fs.readFileSync(path.join(SITE, 'seat-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('seat-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'seat' || APP.category !== 'vote' || APP.path !== 'https://seat.example.com/' || APP.added !== '2026-10-13' || APP.emoji !== '🪑' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
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
console.log(`\n자리 바꾸기 로직·검사·공정성(카이제곱 5종)·#d= 왕복 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 자리 배치 로직(규칙·불가능 판정)·공정성(crypto 거부 샘플링, Fisher–Yates)·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 끝 화면), OG 이미지 모두 OK');
