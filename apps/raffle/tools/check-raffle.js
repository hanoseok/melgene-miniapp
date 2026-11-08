#!/usr/bin/env node
/**
 * 경품 추첨기 검사.
 *   1) 로직(raffle-core.js): 거부 샘플링(uniformInt), 이름 붙여 넣기(줄·쉼표, "이름*3" 응모권, 중복 경고, 한도), 경품 정리(빈 이름·개수 한도),
 *      설정 검사(이름 2명 이상·번호표 2~9999·경품 1개 이상·당첨자 합 500·한 번만 당첨이면 인원 ≥ 당첨자·중복 허용이면 상별 인원),
 *      추첨 순서(up = 작은 상부터, down = 큰 상부터), **한 번만 당첨**(끝까지 뽑으면 모두 다른 사람 — 이름·번호표 × 여러 번),
 *      중복 허용(같은 상 안에서는 다름), 남은 인원 한꺼번에(같은 묶음), 되돌리기(묶음 단위), 끝낸 추첨은 뽑기·되돌리기 안 됨,
 *      저장 상태 검사(sanitize: 모양·자격·순서·버전), 공유 링크(#r=) 왕복·거부, 공정성 카이제곱(첫 당첨자 고르게 · 응모권 가중치 비율 · 번호표).
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, 번역 여부, FAQ 3~5개(getRandomValues, "무료인가요?" 류 금지),
 *      기본 경품 3개(1·2·5), 예시 이름 12개(서로 다름), 제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴(th/vi/ru/zh), 한글은 ko 파일만, 제목 = app.config title.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 준비 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개(추첨 화면 광고 없음) /
 *      화면 순서(준비 → 추첨 → 결과), 추첨·결과 화면 처음 hidden, 결과 화면 마지막 = data-mg-end="raffle", FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, raffle.js 규칙.
 *
 * 실행: node tools/check-raffle.js   (tools/check-all.js 가 apps/raffle 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'raffle-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const uniq = (a) => new Set(a).size === a.length;

// ---------------------------------------------------------------- 1) 로직
const CHI_001 = { 3: 16.27, 4: 18.47, 9: 27.88, 11: 31.26, 19: 43.82 };
function chi(counts, expect) {
  const N = counts.reduce((a, b) => a + b, 0);
  const tot = expect ? expect.reduce((a, b) => a + b, 0) : counts.length;
  return counts.reduce((a, x, i) => { const e = N * (expect ? expect[i] : 1) / tot; return a + (x - e) * (x - e) / e; }, 0);
}
const passed = [];
let fullRuns = 0;
const P3 = [{ n: 'A', c: 1 }, { n: 'B', c: 2 }, { n: 'C', c: 5 }];
const names = (k) => Array.from({ length: k }, (_, i) => ({ n: 'P' + (i + 1), w: 1 }));
function drawAll(r) { const out = []; for (let k = 0; k < 2000; k++) { const w = CORE.draw(r); if (!w) break; out.push(w); } return out; }
function checkLogic() {
  eq([CORE.MAX_ENTRIES, CORE.MAX_LEN, CORE.MAX_TICKETS, CORE.MIN_ENTRIES, CORE.NUM_MIN, CORE.NUM_MAX, CORE.MAX_PRIZES, CORE.MAX_PRIZE_COUNT, CORE.MAX_SLOTS, CORE.PRIZE_LEN], [1000, 40, 50, 2, 2, 9999, 12, 200, 500, 30], '한도');
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit 이상 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 이름 붙여 넣기
  const p = CORE.parseEntries(' Kim \n\nLee*3\nPark , Choi × 2\nkim\n  Jung  *  0 \nX*999\n*5\n');
  eq(p.entries, [{ n: 'Kim', w: 1 }, { n: 'Lee', w: 3 }, { n: 'Park', w: 1 }, { n: 'Choi', w: 2 }, { n: 'kim', w: 1 }, { n: 'Jung', w: 1 }, { n: 'X', w: 50 }, { n: '*5', w: 1 }], 'parseEntries');
  eq(p.dups, [{ name: 'Kim', count: 2 }], '중복(대소문자 무시)');
  eq([p.tickets, p.weighted, p.dropped], [60, true, 0], '응모권 합·가중치·버림');
  eq(CORE.parseEntries('a\nb').weighted, false, '가중치 없음');
  eq(CORE.parseEntries('가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하').entries[0].n.length, 40, '이름 40자');
  eq(CORE.parseEntries(Array.from({ length: 1005 }, (_, i) => 'n' + i).join('\n')).dropped, 5, '1000명 한도');
  eq(CORE.parseEntries('Ann、Bob，Cy;Di').entries.length, 4, '、，; 도 구분');
  // 경품 정리
  eq(CORE.cleanPrizes([{ n: '  ', c: 0 }, { n: 'B', c: 999 }, { n: 'C', c: 2.4 }], (i) => 'P' + i), [{ n: 'P1', c: 1 }, { n: 'B', c: 200 }, { n: 'C', c: 2 }], 'cleanPrizes');
  eq(CORE.cleanPrizes(Array.from({ length: 20 }, () => ({ n: 'x', c: 1 }))).length, 12, '경품 12개 한도');
  // 설정 검사
  eq(CORE.validate({ mode: 'names', entries: names(1), prizes: P3 }).error, 'noEntries', '1명');
  eq(CORE.validate({ mode: 'numbers', N: 1, prizes: P3 }).error, 'numRange', '번호 1');
  eq(CORE.validate({ mode: 'numbers', N: 10000, prizes: P3 }).error, 'numRange', '번호 10000');
  eq(CORE.validate({ mode: 'numbers', N: 2.5, prizes: P3 }).error, 'numRange', '번호 소수');
  eq(CORE.validate({ mode: 'names', entries: names(9), prizes: [] }).error, 'noPrizes', '경품 없음');
  eq(CORE.validate({ mode: 'names', entries: names(7), prizes: P3 }), { ok: false, error: 'tooFew', need: 8, have: 7 }, '7명·당첨 8');
  eq(CORE.validate({ mode: 'names', entries: names(8), prizes: P3 }).ok, true, '8명·당첨 8');
  eq(CORE.validate({ mode: 'names', entries: names(4), prizes: P3, unique: false }), { ok: false, error: 'prizeTooBig', need: 5, have: 4, n: 'C' }, '중복 허용·상 하나가 인원보다 큼');
  eq(CORE.validate({ mode: 'names', entries: names(5), prizes: P3, unique: false }).ok, true, '중복 허용 5명·당첨 8');
  eq(CORE.validate({ mode: 'numbers', N: 9999, prizes: [{ n: 'x', c: 200 }, { n: 'y', c: 200 }, { n: 'z', c: 101 }] }).error, 'tooManySlots', '당첨자 501');
  eq(CORE.newRaffle({ mode: 'names', entries: names(3), prizes: P3 }), null, '검사 실패면 null');
  // 순서
  const up = CORE.newRaffle({ mode: 'names', entries: names(10), prizes: P3, order: 'up' });
  const down = CORE.newRaffle({ mode: 'names', entries: names(10), prizes: P3, order: 'down' });
  eq(CORE.slots(up).join(''), '22222110', 'up = 작은 상부터');
  eq(CORE.slots(down).join(''), '01122222', 'down = 큰 상부터');
  eq([CORE.currentPrize(up), CORE.currentPrize(down), CORE.total(up)], [2, 0, 8], '첫 상·전체');
  eq(CORE.newRaffle({ mode: 'names', entries: names(10), prizes: P3, order: 'x' }).order, 'up', '모르는 순서 → up');

  // 한 번만 당첨: 끝까지 뽑으면 모두 다른 사람
  const cases = [
    { mode: 'names', entries: names(8), prizes: P3 },
    { mode: 'names', entries: names(30), prizes: P3, order: 'down' },
    { mode: 'names', entries: CORE.parseEntries('a*3\nb*50\nc\nd*2\ne\nf\ng\nh').entries, prizes: P3 },
    { mode: 'numbers', N: 8, prizes: P3 },
    { mode: 'numbers', N: 500, prizes: [{ n: 'x', c: 200 }, { n: 'y', c: 200 }, { n: 'z', c: 100 }] },
    { mode: 'names', entries: names(2), prizes: [{ n: 'only', c: 2 }] },
  ];
  cases.forEach((cfg, ci) => {
    for (let rep = 0; rep < (cfg.N === 500 ? 3 : 40); rep++) {
      const r = CORE.newRaffle(cfg);
      const ws = drawAll(r);
      if (ws.length !== CORE.total(r)) { bad(`한 번만 당첨 #${ci}: ${ws.length} ≠ ${CORE.total(r)}`); break; }
      if (!uniq(ws.map((w) => w.e))) { bad(`한 번만 당첨 #${ci}: 같은 사람이 두 번`); break; }
      if (ws.map((w) => w.p).join() !== CORE.slots(r).join()) { bad(`한 번만 당첨 #${ci}: 상 순서가 다름`); break; }
      if (ws.some((w) => (cfg.mode === 'numbers' ? w.e < 1 || w.e > cfg.N : w.e < 0 || w.e >= cfg.entries.length))) { bad(`#${ci}: 범위 밖 당첨`); break; }
      if (CORE.draw(r) !== null || !CORE.isComplete(r) || CORE.currentPrize(r) !== -1) { bad(`#${ci}: 다 뽑은 뒤 null 이 아님`); break; }
      fullRuns++;
    }
  });
  // 8명·당첨 8 = 모든 사람이 한 번씩(순열)
  { const r = CORE.newRaffle(cases[0]); eq(drawAll(r).map((w) => w.e).sort((a, b) => a - b), [0, 1, 2, 3, 4, 5, 6, 7], '8명 8자리 = 모두'); }
  // 중복 허용: 같은 상 안에서는 다름, 다른 상에는 또 나올 수 있음
  {
    let again = 0;
    for (let rep = 0; rep < 200; rep++) {
      const r = CORE.newRaffle({ mode: 'names', entries: names(5), prizes: P3, unique: false });
      const ws = drawAll(r);
      if (ws.length !== 8) { bad('중복 허용: 8명이 아님'); break; }
      [0, 1, 2].forEach((p) => { if (!uniq(ws.filter((w) => w.p === p).map((w) => w.e))) bad('중복 허용: 같은 상에 같은 사람'); });
      if (!uniq(ws.map((w) => w.e))) again++;
    }
    if (!again) bad('중복 허용인데 다른 상에 다시 당첨된 적이 없음');
    passed.push(`중복허용:${again}/200`);
  }
  // 한꺼번에 · 되돌리기(묶음)
  {
    const r = CORE.newRaffle({ mode: 'names', entries: names(12), prizes: P3 });
    const w1 = CORE.draw(r, null, 1000);
    eq([w1.p, w1.b, r.t0], [2, 1, 1000], '첫 뽑기');
    const rest = CORE.drawRest(r);
    eq([rest.length, rest.every((w) => w.p === 2 && w.b === 2), CORE.currentPrize(r)], [4, true, 1], '남은 4명 한꺼번에(같은 묶음)');
    eq(CORE.leftIn(r, 1), 2, '다음 상 남은 수');
    const un = CORE.undo(r);
    eq([un.length, r.wins.length, CORE.currentPrize(r), r.t0], [4, 1, 2, 1000], '되돌리기 = 묶음 전체');
    eq(CORE.undo(r).length, 1, '마지막 하나 되돌리기');
    eq([r.wins.length, r.t0, CORE.undo(r).length], [0, 0, 0], '빈 추첨 되돌리기');
    drawAll(r);
    eq(CORE.drawRest(r), [], '다 뽑은 뒤 한꺼번에 = []');
    eq(CORE.end(r, 5000), true, 'end');
    eq(CORE.end(r, 6000), false, 'end 두 번째');
    eq([CORE.draw(r), CORE.undo(r).length], [null, 0], '끝낸 추첨은 뽑기·되돌리기 안 됨');
  }
  // 결과 묶음
  {
    const r = CORE.newRaffle({ mode: 'numbers', N: 20, prizes: P3, order: 'down' });
    drawAll(r);
    const g = CORE.grouped(r);
    eq(g.map((x) => [x.n, x.winners.length]), [['A', 1], ['B', 2], ['C', 5]], 'grouped 상 목록 순서');
    if (!g.every((x) => x.winners.every((n) => Number.isInteger(n) && n >= 1 && n <= 20))) bad('grouped 번호표 값');
  }
  // 저장 상태
  {
    const r = CORE.newRaffle({ mode: 'names', entries: CORE.parseEntries('a\nb*2\nc\nd\ne\nf\ng\nh\ni').entries, prizes: P3 });
    CORE.draw(r, null, 1700000000000); CORE.drawRest(r); CORE.draw(r);
    const back = CORE.sanitize(JSON.parse(JSON.stringify(r)));
    eq(back && back.wins, r.wins, 'sanitize 왕복');
    eq(back && [back.t0, back.entries.length, back.order], [1700000000000, 9, 'up'], 'sanitize 시각·명단');
    eq(CORE.sanitize(null), null, 'sanitize(null)');
    eq(CORE.sanitize({ ...r, v: 2 }), null, '버전 다름');
    eq(CORE.sanitize({ ...r, mode: 'x' }), null, '모드 다름');
    eq(CORE.sanitize({ ...r, wins: [{ p: 0, e: 0, b: 1 }] }), null, '상 순서가 다른 당첨');
    eq(CORE.sanitize({ ...r, wins: [r.wins[0], { ...r.wins[1], e: r.wins[0].e }] }), null, '한 번만 당첨인데 같은 사람');
    eq(CORE.sanitize({ ...r, wins: [{ ...r.wins[0], e: 99 }] }), null, '없는 사람');
    eq(CORE.sanitize({ ...r, wins: [r.wins[1], { ...r.wins[0], b: 0 }] }), null, '묶음 번호가 거꾸로');
    eq(CORE.sanitize({ ...r, entries: [{ n: 'a', w: 1 }] }), null, '명단 1명');
    eq(CORE.sanitize({ ...r, entries: r.entries.map((e) => ({ ...e, w: 51 })) }), null, '응모권 51');
    eq(CORE.sanitize({ ...r, prizes: [{ n: '', c: 1 }] }), null, '빈 경품 이름');
    eq(CORE.sanitize({ ...r, prizes: [{ n: 'x', c: 30 }] }), null, '인원보다 많은 당첨');
    const n = CORE.newRaffle({ mode: 'numbers', N: 50, prizes: P3, unique: false });
    drawAll(n);
    eq(CORE.sanitize(JSON.parse(JSON.stringify(n))).wins.length, 8, '번호표·중복 허용 왕복');
    eq(CORE.sanitize({ ...n, N: 10000 }), null, '번호 10000');
  }
  // 공유 링크(#r=)
  {
    const r = CORE.newRaffle({ mode: 'names', entries: CORE.parseEntries('김민지\n이서준\nÉmile\n😀 Joy\nA\nB\nC\nD\nE').entries, prizes: [{ n: '1등 🎁', c: 1 }, { n: '2등', c: 2 }, { n: '3등', c: 5 }] });
    eq(CORE.encodeResult(r), null, '당첨 없으면 null');
    CORE.draw(r); CORE.draw(r);
    const code = CORE.encodeResult(r);
    if (!/^[A-Za-z0-9_-]+$/.test(code)) bad('encodeResult 는 base64url');
    const dec = CORE.decodeResult(code);
    eq(dec, { mode: 'names', groups: [{ n: '3등', winners: CORE.grouped(r)[2].winners }] }, '공유 왕복(당첨 있는 상만)');
    drawAll(r);
    eq(CORE.decodeResult(CORE.encodeResult(r)).groups.map((g) => g.winners.length), [1, 2, 5], '공유 왕복 전체');
    const nr = CORE.newRaffle({ mode: 'numbers', N: 99, prizes: P3 }); drawAll(nr);
    const nd = CORE.decodeResult(CORE.encodeResult(nr));
    eq([nd.mode, nd.groups.every((g) => g.winners.every((x) => Number.isInteger(x)))], ['numbers', true], '번호표 공유');
    const enc = (o) => CORE.b64urlEncode(JSON.stringify(o));
    eq(CORE.decodeResult('!!'), null, '잘못된 글자');
    eq(CORE.decodeResult(enc({ v: 2, m: 'a', p: [['x', ['y']]] })), null, '버전');
    eq(CORE.decodeResult(enc({ v: 1, m: 'a', p: [] })), null, '빈 목록');
    eq(CORE.decodeResult(enc({ v: 1, m: 'n', p: [['x', [0]]] })), null, '번호 0');
    eq(CORE.decodeResult(enc({ v: 1, m: 'n', p: [['x', ['3']]] })), null, '번호가 글자');
    eq(CORE.decodeResult(enc({ v: 1, m: 'a', p: [['x', ['a'.repeat(41)]]] })), null, '이름 41자');
    eq(CORE.decodeResult(enc({ v: 1, m: 'a', p: [['x'.repeat(31), ['a']]] })), null, '경품 31자');
    eq(CORE.decodeResult(enc({ v: 1, m: 'a', p: [['x', []]] })), null, '당첨자 없는 상');
    eq(CORE.decodeResult('x'.repeat(12001)), null, '너무 김');
  }
  // 공정성: 첫 당첨자 고르게(이름 10명), 응모권 비율(1:2:3:4), 번호표 1~20
  {
    const c = new Array(10).fill(0);
    for (let k = 0; k < 30000; k++) { const r = CORE.newRaffle({ mode: 'names', entries: names(10), prizes: [{ n: 'x', c: 1 }] }); c[CORE.draw(r).e]++; }
    const x = chi(c); if (x > CHI_001[9]) bad(`공정성 첫 당첨자: 카이제곱 ${x.toFixed(2)}`); else passed.push(`첫당첨10:${x.toFixed(1)}`);
  }
  {
    const ents = CORE.parseEntries('a\nb*2\nc*3\nd*4').entries;
    const c = new Array(4).fill(0);
    for (let k = 0; k < 40000; k++) { const r = CORE.newRaffle({ mode: 'names', entries: ents, prizes: [{ n: 'x', c: 1 }] }); c[CORE.draw(r).e]++; }
    const x = chi(c, [1, 2, 3, 4]); if (x > CHI_001[3]) bad(`공정성 응모권 가중치: 카이제곱 ${x.toFixed(2)} (${c.join(',')})`); else passed.push(`응모권1:2:3:4:${x.toFixed(1)}`);
  }
  {
    const c = new Array(20).fill(0);
    for (let k = 0; k < 40000; k++) { const r = CORE.newRaffle({ mode: 'numbers', N: 20, prizes: [{ n: 'x', c: 3 }] }); CORE.draw(r); CORE.draw(r); c[CORE.draw(r).e - 1]++; }
    const x = chi(c); if (x > CHI_001[19]) bad(`공정성 세 번째 번호: 카이제곱 ${x.toFixed(2)}`); else passed.push(`3번째번호:${x.toFixed(1)}`);
  }
  // 연출용 이름은 뽑을 수 있는 사람 중에서
  {
    const r = CORE.newRaffle({ mode: 'names', entries: names(3), prizes: [{ n: 'x', c: 3 }] });
    CORE.draw(r); CORE.draw(r);
    const left = CORE.eligible(r)[0];
    for (let i = 0; i < 20; i++) if (CORE.teaseId(r) !== left) { bad('teaseId 가 남은 사람이 아님'); break; }
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
      ['meta.title', 'hero.hook', 'ui.start', 'ui.draw', 'ui.undo', 'ui.rest', 'ui.newConfirm', 'end.title', 'errors.tooFew', 'ui.uniqueLabel'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 기본 경품·예시 이름
    if (!Array.isArray(T.ui.defaultPrizes) || T.ui.defaultPrizes.map((p) => p.c).join() !== '1,2,5' || !T.ui.defaultPrizes.every((p) => p.n && len(p.n) <= CORE.PRIZE_LEN)) bad(`${tag} ui.defaultPrizes 는 3개(1·2·5명)`);
    if (!Array.isArray(T.ui.sampleNames) || T.ui.sampleNames.length !== 12 || !uniq(T.ui.sampleNames) || CORE.parseEntries(T.ui.sampleNames.join('\n')).entries.length !== 12) bad(`${tag} ui.sampleNames 는 서로 다른 12명`);
    if (!/\*3/.test(T.ui.namesHint) || CORE.parseEntries(T.ui.namesPlaceholder).tickets !== 6) bad(`${tag} 응모권(*3) 안내·예시`);
    if (!/\{n\}/.test(T.ui.prizeAuto)) bad(`${tag} ui.prizeAuto 에 {n}`);
    // 360px 폭 문구 (버튼·칩·스위치 — 표시 폭 단위, 한중일 = 2)
    const W = [['ui.start', 26], ['ui.draw', 26], ['ui.drawFirst', 26], ['ui.drawing', 26], ['ui.allDone', 26], ['ui.undo', 28], ['ui.skip', 24], ['ui.results', 12],
      ['ui.newRaffle', 26], ['ui.whoLabel', 34], ['ui.orderUp', 22], ['ui.orderDown', 22], ['ui.uniqueLabel', 32], ['ui.addPrize', 24], ['ui.sample', 20], ['ui.clear', 12],
      ['ui.winnersTitle', 30], ['ui.ready', 46], ['ui.prizesLabel', 34], ['ui.namesLabel', 34], ['ui.numLabel', 28],
      ['end.again', 28], ['end.edit', 28], ['end.own', 28], ['end.copy', 28], ['end.kicker', 30], ['end.sharedKicker', 30], ['end.title', 40]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    CORE.MODES.forEach((k) => {
      if (width(T.ui.modes[k].name) > 16) bad(`${tag} ui.modes.${k}.name 가 김`);
      if (width(T.ui.modes[k].desc) > 36) bad(`${tag} ui.modes.${k}.desc 가 김`);
    });
    if (width(G.fmt(T.ui.rest, { k: 199 })) > 30) bad(`${tag} ui.rest 가 김`);
    if (width(G.fmt(T.ui.progress, { n: 500, m: 500 })) > 22) bad(`${tag} ui.progress 가 김`);
    if (width(G.fmt(T.ui.statTickets, { n: 1000, t: 50000 })) > 40) bad(`${tag} ui.statTickets 가 김`);
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
    if (!/9/.test(T.privacy.sections[5][1]) || T.privacy.sections.length !== 6) bad(`${tag} privacy 6절·시행일`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>\\n\\n`));
  return m ? m[0].trim() : '';
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
  if (!/<link rel="canonical" href="https:\/\/raffle\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/raffle\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const D = section(html, 'screen-draw');
      const E = section(html, 'screen-end');
      if (!S || !D || !E) { bad(`${tag} 화면(#screen-setup / #screen-draw / #screen-end) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 3) bad(`${tag} section 은 3개(준비·추첨·결과)`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 준비 화면이 hidden`);
      if (!/<section id="screen-draw"[^>]*hidden>/.test(html) || !/<section id="screen-end"[^>]*hidden>/.test(html)) bad(`${tag} 추첨·결과 화면은 처음에 hidden`);
      if (!(html.indexOf('id="screen-setup"') < html.indexOf('id="screen-draw"') && html.indexOf('id="screen-draw"') < html.indexOf('id="screen-end"'))) bad(`${tag} 화면 순서(준비 → 추첨 → 결과)`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 준비 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 준비 화면 맨 끝 mg-ad-start 1개뿐`);
      if (/mg-ad/.test(D)) bad(`${tag} 추첨 화면(발표·TV)에 광고 자리`);
      if (!/<h1 class="rf-h1">/.test(S) || !S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1(검색어)이 준비 화면에 없음`);
      inOrder(S, ['class="rf-h1"', 'class="rf-hook"', 'id="pm-names"', 'id="pm-numbers"', 'id="names-box"', 'id="names"', 'id="names-stat"', 'id="sample-btn"', 'id="dup-warn"', 'id="numbers-box"', 'id="num-n"',
        'id="prize-list"', 'id="add-prize"', 'id="order-up"', 'id="order-down"', 'id="unique"', 'id="slots-info"', 'id="error"', 'id="start-btn"', 'class="rf-fair"', 'class="mg-ad mg-ad-start"'],
        `${tag} 준비 화면 순서(h1 → 훅 → 참가자 → 경품 → 순서 → 한 번만 → 시작 → 광고)`);
      if (!/<div id="numbers-box" class="rf-numbers" hidden>/.test(S) || /<div id="names-box"[^>]*hidden/.test(S)) bad(`${tag} 처음엔 이름 명단(번호표 숨김)`);
      if (!/id="pm-names" role="radio" aria-checked="true"/.test(S) || !/id="order-up" role="radio" aria-checked="true"/.test(S)) bad(`${tag} 기본 = 이름 명단·큰 상은 마지막`);
      if (!/id="unique" role="switch" checked>/.test(S)) bad(`${tag} 한 번만 당첨은 처음에 켜짐`);
      if ((S.match(/class="rf-prize"/g) || []).length !== 3) bad(`${tag} 기본 경품 3줄`);
      if (!/id="dup-warn" class="rf-warn" role="status" hidden/.test(S)) bad(`${tag} 중복 경고는 처음에 숨김`);
      inOrder(D, ['id="prog"', 'id="present-btn"', 'id="finish-btn"', 'id="stage"', 'id="prize-now"', 'id="prize-sub"', 'id="slot"', 'id="slot-name"', 'id="ready"', 'id="draw-btn"', 'id="skip-btn"', 'id="rest-btn"', 'id="undo-btn"', 'id="left-info"', 'id="board"', 'id="new-btn"', 'id="live"'],
        `${tag} 추첨 화면 순서(막대 → 무대 → 뽑기 → 건너뛰기 → 한꺼번에·되돌리기 → 당첨자 → 새 추첨)`);
      if (!/id="skip-btn"[^>]*hidden/.test(D) || !/id="rest-btn"[^>]*hidden/.test(D) || !/id="board-wrap"[^>]*hidden/.test(D)) bad(`${tag} 건너뛰기·한꺼번에·당첨자 목록은 처음에 숨김`);
      if (!/<div data-mg-end="raffle"><\/div>\s*<\/section>$/.test(E)) bad(`${tag} data-mg-end="raffle" 는 결과 화면의 마지막 요소`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      inOrder(E, ['id="end-kicker"', 'id="end-title"', 'id="results"', 'id="copy-btn"', 'id="own-btn"', 'id="edit-btn"', 'data-mg-end="raffle"'], `${tag} 결과 화면 순서(당첨자 → 복사 → 만들기 → 공통 끝 화면)`);
      if (/<h1/.test(E) || /<h1/.test(D)) bad(`${tag} h1 은 준비 화면에만`);
      if (!/id="error" class="rf-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(D)) bad(`${tag} 당첨 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 준비 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('raffle-core.js') < 0 || html.indexOf('raffle-core.js') > html.indexOf('raffle.js"')) bad(`${tag} raffle-core.js 가 raffle.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://raffle.example.com/</loc>') || !sm.includes('<loc>https://raffle.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  G.LOCALES.forEach(({ code: lang }) => { if (!fs.existsSync(path.join(SITE, 'tools', 'guide', `${lang}.js`))) bad(`가이드 ${lang} 없음`); });
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'raffle.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('raffle.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 2 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("raffle.js: track('start') 는 한 명·한꺼번에 뽑기 2곳(첫 뽑기일 때만), track('done') 은 markDone 1곳");
  if ((js.match(/var first = !raffle\.t0;[\s\S]*?CORE\.draw(Rest)?\(raffle\)[\s\S]*?if \(first\) track\('start'\)/g) || []).length !== 2) bad("raffle.js: track('start') 는 추첨의 첫 당첨자를 뽑을 때");
  if (!/function markDone\(\) \{\s*if \(!raffle \|\| raffle\.done \|\| !raffle\.t0\) return;\s*raffle\.done = true;\s*track\('done'\)/.test(js)) bad("raffle.js: track('done') 은 markDone 에서 추첨마다 한 번");
  if (!/function finish[\s\S]*?markDone\(\)/.test(js) || !/isComplete\(raffle\)\) \{ markDone\(\)/.test(js)) bad('raffle.js: 결과 보기·모두 뽑음 둘 다 markDone');
  if (/Math\.random/.test(js)) bad('raffle.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('raffle.js: 움직임 줄이기 처리 없음');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`raffle.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/'raffle_state'/.test(js)) bad('raffle.js: 저장 키는 raffle_state');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('raffle.js: setShareData / setRetry 등록 없음');
  if (!/mgCleanUrl/.test(js) || !/'#r=' \+/.test(js)) bad('raffle.js: 공유 주소는 mgCleanUrl(언어 없는 주소) + #r=');
  if (/innerHTML/.test(js)) bad('raffle.js: innerHTML 금지(textContent 만)');
  if (!/CORE\.draw\(/.test(js) || !/CORE\.drawRest\(/.test(js) || !/CORE\.undo\(/.test(js) || !/CORE\.sanitize\(/.test(js) || !/CORE\.decodeResult\(/.test(js)) bad('raffle.js: 뽑기·한꺼번에·되돌리기·저장 읽기·공유 읽기는 raffle-core 로');
  if (!/ask\(U\.newConfirm\)/.test(js) || !/ask\(U\.finishConfirm\)/.test(js)) bad('raffle.js: 새 추첨·중간 결과는 확인을 받는다');
  if (/fetch\(|XMLHttpRequest|supa\./.test(js)) bad('raffle.js: 명단을 서버로 보내지 않는다');
  const core = fs.readFileSync(path.join(SITE, 'raffle-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('raffle-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'raffle' || APP.category !== 'vote' || APP.path !== 'https://raffle.example.com/' || APP.added !== '2026-11-09' || APP.emoji !== '🎁' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 170) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 24) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
    }
  });
  if (/[^  ][:;?!](\s|$)/.test(APP.desc.fr.replace(/https?:\/\/\S+/g, ''))) bad('app.config.js fr 설명의 : 앞 좁은 공백');
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n경품 추첨기 로직(이름·응모권·경품·설정 검사·순서·끝까지 뽑기 ${fullRuns}번·중복 허용·한꺼번에·되돌리기·저장 검사·공유 링크)·공정성(${passed.join(' ')}) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 그 순간 뽑는 공정한 추첨(crypto, 한 번만 당첨이면 모두 다른 사람)·한꺼번에·되돌리기·저장 복원·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구), 생성 HTML(SEO·타이틀 바·준비 화면 맨 끝 mg-ad-start 1개·추첨 화면 광고 없음·결과 화면 data-mg-end), OG 이미지 모두 OK');
