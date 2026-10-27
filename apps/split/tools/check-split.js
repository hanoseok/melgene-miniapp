#!/usr/bin/env node
/**
 * 더치페이 계산기 검사 (Node, 브라우저 없음 — 실제 화면 흐름은 tools/check-flow.js).
 *   1) 로직(split-core.js): 입력 해석(parseAmount — "," "." 소수점·천 단위 구분, 전각 숫자, 통화 기호, 잘못된 입력 / parsePct),
 *      퍼센트 반올림, allocate(큰 나머지 — 무작위 3000번: 합계 = 총액, 단위 배수, 차이 ≤ 1단위(골고루)·총무만 더 냄(총무 부담)),
 *      똑같이 나누기(100,000원 ÷ 3 = 33,300 ×2 + 총무 33,400 · $100 ÷ 3 · 팁), 항목별(무작위 1000번: 합계 = 소계 + 세금 + 팁, 안 먹은 메뉴 0원),
 *      정산(무작위 2000번: 송금 뒤 잔액 0, 송금 횟수 ≤ 사람 수 − 1, 금액 > 0, 같은 금액 짝 1번에), 공유·저장 모양(되돌림·잘못된 링크 거부).
 *   2) 언어 파일 12개: en.js 와 키 구조 동일, TODO-TRANSLATE 없음, 자리표시자, 기본 통화 = LANG_CURRENCY, 팁 프리셋,
 *      FAQ 3~5개("무료인가요?" 류 금지), 제목·설명 길이, 360px 폭 문구, h1 검색어 = app.config title, 한국어 파일 밖에 한글 없음,
 *      fr 좁은 공백, ru 키릴 글꼴, vi 성조 글꼴, th 태국어 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title = "검색어 | 브랜드" / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 /
 *      appLd(create) / FAQPage 없음 / 첫 화면(#screen-split) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      h1 → 방법 → 입력 → 정리 단위 → 결과 → 먼저 낸 사람 → 복사·링크 → 정산 완료 → 결과(#result, 처음 hidden) → data-mg-end="split" 순서,
 *      통화 기본값, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 12장, app.config.js, favicon, shared 링크,
 *      split.js 규칙(track 1곳씩·서버 전송 없음·저장은 mg_split_v1 만 try/catch·공유 깨끗한 주소·코드에 화면 문구 없음).
 *
 * 실행: node tools/check-split.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'split-core.js'));
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
let seed = 7;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const ri = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const sumOf = (a) => a.reduce((x, y) => x + y, 0);

function checkLogic() {
  // 입력 해석 [입력, 통화, 기대값(최소 단위) | 'empty' | 'badNum' | 'tooBig']
  const P = [
    ['12000', 'KRW', 12000], ['12,000', 'KRW', 12000], ['12.000', 'KRW', 12000], ['1,234,567', 'KRW', 1234567], ['１２，０００', 'KRW', 12000], ['₩12,000', 'KRW', 12000], ['12,000원', 'KRW', 12000],
    ['12.5', 'KRW', 13], ['12.4', 'KRW', 12], ['3,333円', 'JPY', 3333],
    ['12.50', 'USD', 1250], ['12,50', 'EUR', 1250], ['12.5', 'USD', 1250], ['12,5', 'EUR', 1250], ['.5', 'USD', 50], ['5.', 'USD', 500], ['$20', 'USD', 2000], ['20 €', 'EUR', 2000],
    ['1,234.56', 'USD', 123456], ['1.234,56', 'EUR', 123456], ['1 234,56', 'EUR', 123456], ['1 234,56', 'RUB', 123456], ['R$ 10,00', 'BRL', 1000], ['1.000.000', 'VND', 1000000], ['100.000đ', 'VND', 100000],
    ['1,000', 'USD', 100000], ['0,123', 'EUR', 'badNum'],
    ['', 'USD', 'empty'], ['  ', 'KRW', 'empty'], ['abc', 'USD', 'badNum'], ['1,2,3', 'USD', 'badNum'], ['-5', 'USD', 'badNum'], ['1e3', 'USD', 'badNum'], ['12.345.6', 'EUR', 'badNum'],
    ['1,23,456', 'KRW', 'badNum'], ['1.2.3', 'KRW', 'badNum'], ['.', 'USD', 'badNum'], ['99999999999999', 'KRW', 'tooBig'],
  ];
  P.forEach(([s, c, want]) => {
    const r = CORE.parseAmount(s, c);
    const got = r.empty ? 'empty' : r.error ? r.error : r.value;
    ok(got === want, `parseAmount(${JSON.stringify(s)}, ${c}) = ${got} ≠ ${want}`);
  });
  [['15', 15], ['18,5', 18.5], ['8.875', 'badPct'], ['8.88', 8.88], ['0', 0], ['100', 100], ['101', 'badPct'], ['x', 'badPct'], ['', 'empty'], ['10%', 10]].forEach(([s, want]) => {
    const r = CORE.parsePct(s);
    ok((r.empty ? 'empty' : r.error ? r.error : r.value) === want, `parsePct(${JSON.stringify(s)}) ≠ ${want}`);
  });
  eq([CORE.pctOf(10000, 15), CORE.pctOf(4001, 8.88), CORE.pctOf(5, 10), CORE.pctOf(15, 10), CORE.pctOf(100, 0)], [1500, 355, 1, 2, 0], 'pctOf 반올림(0.5 올림)');

  // allocate 무작위 3000번
  let good = 0;
  for (let k = 0; k < 3000; k++) {
    const n = ri(1, 30);
    const unit = [1, 5, 10, 100, 500, 1000][ri(0, 5)];
    const total = rnd() < 0.1 ? ri(0, 50) : ri(0, 5e7);
    const even = rnd() < 0.5;
    const w = Array.from({ length: n }, () => (even ? 1 : rnd() < 0.15 ? 0 : ri(1, 1e6)));
    const mode = rnd() < 0.5 ? 'host' : 'even';
    const host = ri(0, n - 1);
    const out = CORE.allocate(w, total, unit, mode, host);
    let fine = out.length === n && sumOf(out) === total && out.every((x) => Number.isInteger(x) && x >= 0);
    const rem = total % unit;
    const offUnit = out.filter((x) => x % unit !== 0).length;
    fine = fine && offUnit <= (rem ? 1 : 0);
    if (even) {
      const base = out.map((x) => x - (x % unit === rem && rem ? rem : 0));
      if (mode === 'even') fine = fine && Math.max(...base) - Math.min(...base) <= unit;
      else fine = fine && out.every((x, i) => i === host || x === out[(host + 1) % n] || n === 1) && (n === 1 || out[host] >= out[(host + 1) % n]) && (n === 1 || out[host] - out[(host + 1) % n] < n * unit);
    }
    if (fine) good++; else if (problems.length < 30) bad(`allocate ${JSON.stringify({ w: w.slice(0, 5), n, total, unit, mode, host })} → ${JSON.stringify(out.slice(0, 6))}`);
  }
  ok(good === 3000, `allocate 무작위 3000번 (통과 ${good})`);
  // 비율 나누기 = 정확한 몫과 1단위 이내 (골고루)
  let prop = 0;
  for (let k = 0; k < 500; k++) {
    const n = ri(2, 20), w = Array.from({ length: n }, () => ri(0, 1e5)), total = ri(1, 1e7);
    const out = CORE.allocate(w, total, 1, 'even', 0);
    const W = sumOf(w) || n;
    if (out.every((x, i) => Math.abs(x - (sumOf(w) ? w[i] : 1) * total / W) < 1 + 1e-6)) prop++;
  }
  ok(prop === 500, `allocate 비율 오차 < 1 (500번, 통과 ${prop})`);

  // 똑같이 나누기
  const a1 = CORE.calcEven({ total: 100000, people: 3, tip: 0, unit: 100, mode: 'host' });
  eq([a1.grand, a1.shares, a1.groups], [100000, [33400, 33300, 33300], [{ amount: 33300, count: 2, host: false }, { amount: 33400, count: 1, host: true }]], '100,000원 ÷ 3 (100원 단위, 총무 부담) = 33,300 ×2 + 총무 33,400');
  eq(CORE.calcEven({ total: 100000, people: 3, tip: 0, unit: 1000, mode: 'host' }).shares, [34000, 33000, 33000], '100,000원 ÷ 3 (1000원 단위) = 33,000 ×2 + 총무 34,000');
  eq(CORE.calcEven({ total: 100000, people: 3, tip: 0, unit: 1000, mode: 'even' }).shares, [34000, 33000, 33000], '1000원 단위 골고루');
  eq(CORE.calcEven({ total: 100000, people: 4, tip: 0, unit: 1000, mode: 'even' }).shares, [25000, 25000, 25000, 25000], '100,000원 ÷ 4 = 25,000');
  eq(CORE.calcEven({ total: 10000, people: 3, tip: 0, unit: 1, mode: 'even' }).shares, [3334, 3333, 3333], '$100 ÷ 3 = 33.34 + 33.33 ×2');
  eq(CORE.calcEven({ total: 10000, people: 3, tip: 0, unit: 1, mode: 'host' }).shares, [3334, 3333, 3333], '$100 ÷ 3 총무 부담');
  eq(CORE.calcEven({ total: 10000, people: 3, tip: 0, unit: 500, mode: 'even' }).shares, [3500, 3500, 3000], '$100 ÷ 3 ($5 단위 골고루) = 35 + 35 + 30');
  const tip = CORE.calcEven({ total: 8642, people: 4, tip: 18, unit: 1, mode: 'even' });
  eq([tip.tip, tip.grand, sumOf(tip.shares)], [1556, 10198, 10198], '$86.42 + 팁 18% = $101.98');
  eq(CORE.calcEven({ total: 100, people: 1, tip: 0, unit: 1, mode: 'even' }).error, 'peopleRange', '1명 → peopleRange');
  eq(CORE.calcEven({ total: 100, people: 31, tip: 0, unit: 1, mode: 'even' }).error, 'peopleRange', '31명 → peopleRange');
  eq(CORE.calcEven({ total: 0, people: 3, tip: 0, unit: 1, mode: 'even' }), { empty: true }, '총액 0 → empty');
  // 똑같이 무작위: 합계 = 총액 + 팁
  let ev = 0;
  for (let k = 0; k < 1000; k++) {
    const cur = CORE.CODES[ri(0, CORE.CODES.length - 1)], C = CORE.CURRENCIES[cur];
    const r = CORE.calcEven({ total: ri(1, 1e8), people: ri(2, 30), tip: [0, 5, 10, 15, 18, 20, 12.5][ri(0, 6)], unit: C.units[ri(0, C.units.length - 1)], mode: rnd() < 0.5 ? 'host' : 'even' });
    if (r.ok && sumOf(r.shares) === r.grand && r.grand === r.sub + r.tip && sumOf(r.groups.map((g) => g.amount * g.count)) === r.grand) ev++;
  }
  ok(ev === 1000, `똑같이 나누기 무작위 1000번 합계 = 총액 (통과 ${ev})`);

  // 항목별
  const b1 = CORE.calcItems({ people: 3, items: [{ price: 3000, who: [0, 1, 2] }, { price: 1001, who: [0, 1] }], tax: 8.88, tip: 18, unit: 1, mode: 'even' });
  eq([b1.sub, b1.tax, b1.tip, b1.grand, sumOf(b1.subs), sumOf(b1.shares)], [4001, 355, 720, 5076, 4001, 5076], '항목별 소계·세금·팁·합계');
  ok(b1.shares[2] < b1.shares[0] && b1.subs[2] === 1000, '항목별: 메뉴를 덜 먹은 사람이 덜 냄');
  const b0 = CORE.calcItems({ people: 3, items: [{ price: 9000, who: [0, 1] }], tax: 10, tip: 0, unit: 1, mode: 'even' });
  eq(b0.shares, [4950, 4950, 0], '항목별: 아무것도 안 먹은 사람 0');
  eq(CORE.calcItems({ people: 2, items: [{ price: 100, who: [] }], tax: 0, tip: 0, unit: 1, mode: 'even' }), { error: 'noSharer', item: 0 }, '항목별: 함께 먹은 사람 없음 → noSharer');
  eq(CORE.calcItems({ people: 2, items: [{ price: null, who: [0] }], tax: 0, tip: 0, unit: 1, mode: 'even' }), { empty: true }, '항목별: 가격 없음 → empty');
  eq(CORE.calcItems({ people: 21, items: [], tax: 0, tip: 0, unit: 1, mode: 'even' }).error, 'peopleRange', '항목별 21명 → peopleRange');
  const bh = CORE.calcItems({ people: 3, items: [{ price: 100000, who: [0, 1, 2] }], tax: 0, tip: 0, unit: 100, mode: 'host', host: 1 });
  eq(bh.shares, [33300, 33400, 33300], '항목별 총무(2번째 사람) 부담');
  let it = 0;
  for (let k = 0; k < 1000; k++) {
    const n = ri(2, 20), items = Array.from({ length: ri(1, 15) }, () => {
      const who = []; for (let p = 0; p < n; p++) if (rnd() < 0.5) who.push(p);
      if (!who.length) who.push(ri(0, n - 1));
      return { price: rnd() < 0.05 ? null : ri(1, 5e6), who };
    });
    const mode = rnd() < 0.5 ? 'host' : 'even';
    const r = CORE.calcItems({ people: n, items, tax: [0, 7, 8.88, 10][ri(0, 3)], tip: [0, 10, 15, 20][ri(0, 3)], unit: [1, 10, 100, 1000][ri(0, 3)], mode, host: ri(0, n - 1) });
    if (r.empty) { it++; continue; }
    const sub = sumOf(items.map((x) => x.price || 0));
    let fine = r.ok && r.sub === sub && sumOf(r.subs) === sub && sumOf(r.shares) === r.grand && r.grand === sub + r.tax + r.tip;
    // 아무것도 안 먹은 사람은 (총무가 아니면) 0원
    const ate = new Set(items.filter((x) => x.price).flatMap((x) => x.who));
    if (mode === 'even') for (let p = 0; p < n; p++) if (!ate.has(p) && r.shares[p] !== 0 && !(r.shares[p] < 1000 && r.shares[p] === Math.max(...r.shares))) fine = false;
    if (fine) it++; else if (problems.length < 30) bad(`calcItems ${JSON.stringify({ n, items: items.slice(0, 3) })} → ${JSON.stringify(r).slice(0, 200)}`);
  }
  ok(it === 1000, `항목별 무작위 1000번 합계 = 소계 + 세금 + 팁 (통과 ${it})`);

  // 정산 (최소 송금)
  eq(CORE.settle([300, 300, 400], [1000, 0, 0]), { ok: true, transfers: [{ from: 2, to: 0, amount: 400 }, { from: 1, to: 0, amount: 300 }] }, '한 명이 전액 → 2건');
  eq(CORE.settle([500, 500], [500, 500]), { ok: true, transfers: [] }, '각자 냄 → 송금 없음');
  eq(CORE.settle([100, 100], [150, 0]), { error: 'paidMismatch', diff: -50 }, '모자람 → paidMismatch');
  eq(CORE.settle([100, 100, 100, 100], [250, 0, 150, 0]).transfers.length, 3, '잔액 +150 −100 +50 −100 → 3건');
  eq(CORE.settle([50, 300, 100, 50], [0, 0, 500, 0]).transfers, [{ from: 1, to: 2, amount: 300 }, { from: 0, to: 2, amount: 50 }, { from: 3, to: 2, amount: 50 }], '큰 빚부터 받을 사람에게');
  eq(CORE.settle([0, 300, 0, 300], [300, 0, 300, 0]).transfers, [{ from: 1, to: 0, amount: 300 }, { from: 3, to: 2, amount: 300 }], '같은 금액끼리 짝');
  let se = 0;
  for (let k = 0; k < 2000; k++) {
    const n = ri(2, 30);
    const owes = Array.from({ length: n }, () => ri(0, 1e6));
    const G0 = sumOf(owes);
    const payers = ri(1, Math.min(n, 5));
    const paid = new Array(n).fill(0);
    let left = G0;
    for (let q = 0; q < payers; q++) { const p = ri(0, n - 1); const a = q === payers - 1 ? left : ri(0, left); paid[p] += a; left -= a; }
    const r = CORE.settle(owes, paid);
    if (!r.ok) { bad(`settle 실패 ${JSON.stringify(r)}`); continue; }
    const bal = owes.map((o, i) => paid[i] - o);
    r.transfers.forEach((t) => { bal[t.from] += t.amount; bal[t.to] -= t.amount; });
    const nonzero = owes.filter((o, i) => paid[i] - o !== 0).length;
    if (bal.every((x) => x === 0) && r.transfers.every((t) => t.amount > 0 && t.from !== t.to && paid[t.from] - owes[t.from] < 0 && paid[t.to] - owes[t.to] > 0) && r.transfers.length <= Math.max(0, nonzero - 1)) se++;
    else if (problems.length < 30) bad(`settle ${JSON.stringify({ owes, paid })} → ${JSON.stringify(r)}`);
  }
  ok(se === 2000, `정산 무작위 2000번: 잔액 0 · 송금 ≤ 사람 수 − 1 · 빚진 사람 → 받을 사람 (통과 ${se})`);

  // 공유·저장 모양
  const s0 = CORE.defaultState('ko');
  eq([s0.c, s0.u, s0.m, s0.r], ['KRW', 100, 'a', 'h'], '기본 상태(ko): KRW 100원 단위');
  G.LOCALES.forEach(({ code }) => ok(CORE.validState(CORE.defaultState(code)) && CORE.defaultState(code).c === CORE.LANG_CURRENCY[code], `기본 상태(${code}) 유효`));
  const s1 = { m: 'b', c: 'EUR', u: 1, r: 'e', a: { t: 10000, n: 4, p: 10 }, b: { p: ['Zoë', '김민지', ''], i: [['Pizza 🍕', 2450, [0, 1, 2]], ['Vino', null, [0]]], x: 0, q: 12.5, h: 0 }, s: [[1, 3000], [2, null]] };
  ok(CORE.validState(s1), '예시 상태 유효');
  const enc = CORE.encodeShare(s1);
  ok(/^[A-Za-z0-9_-]+$/.test(enc), '공유: base64url');
  eq(CORE.decodeShare(enc), s1, '공유: 되돌림(UTF-8 이름·이모지)');
  eq(JSON.parse(CORE.b64urlDecode(enc)).v, 1, '공유: v=1');
  ['', 'abc', '!!!', CORE.b64urlEncode('{"v":2}'), CORE.b64urlEncode('[1]'), CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), z: 1 })),
    CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), c: 'XYZ' })), CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), u: 7 })),
    CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), a: { t: -1, n: 4, p: 0 } })), CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), a: { t: 1, n: 31, p: 0 } })),
    CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), s: [[5, 100]] })), CORE.b64urlEncode(JSON.stringify({ ...CORE.toWire(s1), b: { ...s1.b, i: [['x', 1, [9]]] } })),
    'A'.repeat(9000)].forEach((bad1, i) => ok(CORE.decodeShare(bad1) === null, `공유: 잘못된 링크 ${i} 거부`));
  const dirty = CORE.fromWire({ ...CORE.toWire(s1), b: { ...s1.b, p: ['<b>Al</b>', 'B', 'C'] } });
  ok(dirty && dirty.b.p[0] === 'bAl/b', '공유: 이름의 < > 제거');
  // 통화 표
  CORE.CODES.forEach((c) => { const C = CORE.CURRENCIES[c]; ok([0, 2].includes(C.dec) && C.units.includes(C.def) && C.units[0] >= 1, `통화 ${c} 설정`); });
  eq([CORE.CURRENCIES.KRW.units, CORE.CURRENCIES.JPY.units], [[1, 10, 100, 1000], [1, 10, 100]], 'KRW 1·10·100·1000원 / JPY 1·10·100円');
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
  'ui.personN': ['n'], 'ui.removePerson': ['name'], 'ui.subLine': ['sub'], 'ui.taxLine': ['amount'], 'ui.tipLine': ['amount'], 'ui.groupLine': ['amount', 'n'],
  'ui.hostLine': ['amount'], 'ui.personLine': ['sub', 'extra'], 'ui.sumOk': ['total'], 'ui.transfer': ['from', 'to', 'amount'], 'ui.paidOver': ['diff'], 'ui.paidUnder': ['diff'],
  'ui.copyTotal': ['total', 'n'], 'errors.noSharer': ['item'],
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
    const enTok = {};
    walk(EN, (s, pth) => { enTok[pth] = tokens(s); });
    walk(T, (s, pth) => {
      if (/^(privacy|faq|cur)/.test(pth) || enTok[pth] == null) return;
      const allowed = enTok[pth].split(',').filter(Boolean);
      tokens(s).split(',').filter(Boolean).forEach((t) => ok(allowed.includes(t), `${tag} ${pth} 에 모르는 자리표시자 ${t}`));
    });
    Object.entries(MUST).forEach(([pth, need]) => {
      const v = get(T, pth);
      need.forEach((k) => ok(typeof v === 'string' && v.includes(`{${k}}`), `${tag} ${pth} 에 {${k}} 없음: ${v}`));
    });
    // 통화·팁
    ok(T.cur.def === CORE.LANG_CURRENCY[lang] && CORE.CURRENCIES[T.cur.def], `${tag} cur.def ${T.cur.def} ≠ ${CORE.LANG_CURRENCY[lang]}`);
    ok(T.cur.local === '' || (T.cur.local.includes('{n}') && tokens(T.cur.local) === '{n}'), `${tag} cur.local 모양: ${T.cur.local}`);
    ok(Array.isArray(T.tip.presets) && T.tip.presets.length <= 4 && T.tip.presets.every((p) => p > 0 && p <= 30), `${tag} tip.presets`);
    ok(typeof T.tip.open === 'boolean', `${tag} tip.open`);
    if (['ko', 'ja', 'zh', 'vi', 'th'].includes(lang)) ok(!T.tip.open, `${tag} 팁 문화가 없는 언어는 팁 칸을 접어 둔다`);
    if (lang === 'en') ok(T.tip.open && JSON.stringify(T.tip.presets) === '[15,18,20]', `${tag} 미국식 팁 15·18·20% 열림`);
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.finish', 'ui.waiting', 'ui.again', 'ui.modeEven', 'ui.remHost', 'ui.payToggle', 'errors.badNum'].forEach((pth) => ok(get(T, pth) !== get(EN, pth), `${tag} ${pth} 가 en 과 같음(번역 안 됨)`));
      ok(T.faq[0].q !== EN.faq[0].q, `${tag} faq 가 en 과 같음`);
    }
    Object.entries(T.errors).forEach(([k, v]) => ok(typeof v === 'string' && v.length > 5, `${tag} errors.${k} 비었음`));
    // 360px 폭 문구
    [['ui.modeEven', 18], ['ui.modeItems', 18], ['ui.remHost', 22], ['ui.remEven', 22], ['ui.tipNone', 8], ['ui.tipOther', 10], ['ui.copy', 22], ['ui.link', 22],
      ['ui.finish', 30], ['ui.again', 30], ['ui.addPerson', 24], ['ui.addItem', 24], ['ui.addPayer', 24], ['ui.total', 16], ['ui.people', 16], ['ui.tipLabel', 16],
      ['ui.taxLabel', 16], ['ui.payer', 16], ['ui.currency', 16], ['ui.sharedBy', 16], ['ui.namePh', 12], ['ui.itemPh', 12], ['ui.pricePh', 12], ['ui.paidPh', 12],
      ['ui.payToggle', 32], ['ui.roundLabel', 32], ['ui.remainderLabel', 32], ['ui.personN', 12], ['ui.me', 10], ['ui.tipMore', 30], ['ui.extrasMore', 30], ['hero.h1Kicker', 30]]
      .forEach(([pth, max]) => { const v = get(T, pth); ok(typeof v === 'string' && v.trim() && width(v) <= max, `${tag} ${pth} 가 김 (폭 ${width(v)} > ${max}): ${v}`); });
    ok(/<em>/.test(T.hero.h1Html) && !/<(?!\/?(br|em)>)/.test(T.hero.h1Html), `${tag} hero.h1Html 은 <br>·<em> 만`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      ok(f.q && f.a && !/<|>/.test(f.q + f.a), `${tag} faq[${i}] 비었거나 HTML`);
      ok(!/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q), `${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (lang !== 'ko') walk(T, (s, pth) => ok(!/[가-힯]/.test(s), `${tag} ${pth} 에 한글`));
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    ok(T.meta.title.toLowerCase().startsWith(APP.title[lang].toLowerCase()), `${tag} meta.title 이 현지 검색어(app.config title "${APP.title[lang]}")로 시작하지 않음`);
    ok(T.siteName === APP.title[lang], `${tag} siteName 이 app.config title 과 다름`);
    ok(T.hero.h1Kicker === APP.title[lang], `${tag} h1 검색어가 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    ok(len(title) <= (cjk ? 40 : 78), `${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    ok(dl >= (cjk ? 50 : 100) && dl <= (cjk ? 130 : 230), `${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, pth) => { const t = s.replace(/https?:\/\/\S+/g, '').replace(/\{\w+\}/g, 'x'); if (/[^\s«(  ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t)) bad(`${tag} ${pth} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 50)}`); });
    if (lang === 'ru') ok(/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css), `${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi') ok(/Be\+Vietnam|Plus\+Jakarta|Baloo/.test(T.fonts.css), `${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
    if (lang === 'th') ok(/Mitr|Prompt|Kanit|Noto\+Sans\+Thai/.test(T.fonts.css), `${tag} 태국어 글꼴이 아님`);
  });
  const SEO = { en: 'Split Bill Calculator', ko: '더치페이 계산기', ja: '割り勘計算', zh: 'AA制计算器' };
  Object.entries(SEO).forEach(([l, s]) => ok(L10N[l].meta.title.startsWith(s) && APP.title[l] === s, `[${l}] 제목 검색어 "${s}"`));
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) {
  const m = html.match(/<section id="screen-split"[\s\S]*?<\/section>/);
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
  ok(/<link rel="canonical" href="https:\/\/split\.example\.com\//.test(html), `${tag} canonical 없음`);
  ok(/<header class="mg-top">/.test(html), `${tag} 공통 타이틀 바(G.topBar) 없음`);
  ok(!/FAQPage/.test(html), `${tag} FAQPage JSON-LD 금지`);
  ok(!/aggregateRating/.test(html), `${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/split\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      ok(/"@type":"WebApplication"/.test(html), `${tag} appLd(WebApplication) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-split) 없음`); return; }
      ok(!/<section id="screen-split"[^>]*hidden/.test(html), `${tag} 첫 화면이 hidden`);
      ok((html.match(/<section[\s>]/g) || []).length === 1, `${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      ok((S.match(/class="mg-ad\b/g) || []).length === 1 && /<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S), `${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      ok((html.match(/class="mg-ad\b/g) || []).length === 1, `${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      ok(S.includes(`<span class="sp-kicker">${G.esc(T.hero.h1Kicker)}</span>`), `${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const order = ['class="sp-h1"', 'data-mode="a"', 'data-mode="b"', 'id="currency"', 'id="in-total"', 'id="in-people"', 'id="people-list"', 'id="item-list"', 'id="unit-chips"', 'data-rem="h"',
        'id="out"', 'id="pay-toggle"', 'id="transfers"', 'id="copy-btn"', 'id="link-btn"', 'id="finish-btn"', 'id="finish-err"', 'id="result"', 'id="summary-card"', '<div data-mg-end="split"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 첫 화면 순서(h1 → 방법 → 입력 → 정리 단위 → 결과 → 먼저 낸 사람 → 복사·링크 → 정산 완료 → 요약 → 끝 화면 → 광고)가 아님`);
      ok(new RegExp(`<option value="${T.cur.def}" selected>`).test(S) && (S.match(/<option /g) || []).length === CORE.CODES.length, `${tag} 통화 기본값 ${T.cur.def}`);
      ok(/data-mode="a" aria-pressed="true"/.test(S) && /id="box-b" class="sp-box" data-box="b" hidden/.test(S), `${tag} 처음엔 똑같이 나누기`);
      ok(!/type="number"/.test(S) && /id="in-total"[^>]*inputmode="decimal"/.test(S), `${tag} 금액 칸 = type=text inputmode=decimal ("," 입력 허용)`);
      ok(/<div id="result" class="sp-result" hidden>/.test(S) && /<div id="pay-box" hidden>/.test(S), `${tag} 요약·정산 칸은 처음에 hidden`);
      ok((html.match(/data-mg-end=/g) || []).length === 1, `${tag} data-mg-end 는 1개`);
      ok(/id="live" class="visually-hidden" aria-live="polite"/.test(S), `${tag} 결과 읽어 주기(aria-live) 없음`);
      ok(/class="sp-err" id="out-err" role="alert" hidden/.test(S) && /id="finish-err" class="sp-error" role="alert" hidden/.test(S), `${tag} 오류 안내(role=alert) 없음`);
      ok(!/mg-faq|<details/.test(S), `${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      ok(!T.faq.some((q) => bodyNoJson.includes(G.esc(q.q))), `${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ok(/window\.MG_FAQ = \[/.test(html) && /window\.PAGE_I18N = /.test(html), `${tag} MG_FAQ·PAGE_I18N 없음`);
      ok(html.indexOf('split-core.js') > 0 && html.indexOf('split-core.js') < html.indexOf('split.js"'), `${tag} split-core.js 가 split.js 보다 먼저여야 함`);
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
  G.LOCALES.forEach(({ code, dir }) => { const f = path.join(SITE, 'og', dir || '', 'default.png'); ok(fs.existsSync(f) && fs.readFileSync(f).readUInt32BE(16) === 1200, `OG 이미지 ${code} (node tools/gen-og.js all)`); });
  return pages;
}

// ---------------------------------------------------------------- 4) 그 밖
function checkMisc() {
  ok(APP.id === 'split' && APP.category === 'create' && APP.added === '2026-10-28' && APP.order === 1 && APP.emoji === '💸' && APP.path === 'https://split.example.com/', 'app.config.js 기본값');
  G.LOCALES.forEach(({ code }) => ok(APP.title[code] && APP.desc[code], `app.config ${code} 제목·설명`));
  ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg');
  let link = '';
  try { link = fs.readlinkSync(path.join(SITE, 'shared')); } catch (e) { /* noop */ }
  ok(link === '../../shared', 'shared → ../../shared 심볼릭 링크');
  const src = read('split.js');
  const js = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok((js.match(/track\('start'\)/g) || []).length === 1 && (js.match(/track\('done'\)/g) || []).length === 1, 'split.js: track start/done 각 1곳');
  ok(/setRetry\(/.test(js) && /setShareData\(/.test(js), 'split.js: setRetry·setShareData');
  const storeCalls = js.match(/localStorage\.(get|set|remove)Item\([^)]*\)/g) || [];
  ok(storeCalls.length === 2 && storeCalls.every((s) => /STORE_KEY/.test(s)) && /STORE_KEY = 'mg_split_v1'/.test(js), 'split.js: localStorage 는 mg_split_v1 만');
  ok((js.match(/try \{ return window\.localStorage/g) || []).length === 1 && (js.match(/try \{ window\.localStorage/g) || []).length === 1, 'split.js: localStorage 를 try/catch 로 감쌈');
  ok(!/sessionStorage|indexedDB|document\.cookie/.test(js), 'split.js: 다른 저장소 없음');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js), 'split.js: 서버 전송 없음');
  ok(!/location\.hash\s*=|history\.pushState/.test(js) && /'#d=' \+ d/.test(js), 'split.js: 공유 상태는 링크 복사(#d=)로만, 주소창을 바꾸지 않음');
  ok(/mgCleanUrl/.test(js) && /setShareData\(function \(\) \{ return \{ title: U\.shareTitle, text: U\.shareText, url: baseUrl\(\) \}/.test(js), 'split.js: 끝 화면 공유 = 깨끗한 주소 + 고정 문구');
  ok(!/[가-힯]/.test(js), 'split.js: 코드에 화면 문구(한글) 없음');
  const core = read('split-core.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok(!/fetch\(|XMLHttpRequest|localStorage|document\./.test(core), 'split-core.js: 화면·저장·전송 없음(순수 로직)');
}

checkLogic();
checkLocales();
const pages = checkHtml();
checkMisc();

if (problems.length) {
  console.log(`\n✗ check-split: 문제 ${problems.length}건 (통과 ${passes})`);
  problems.slice(0, 80).forEach((m) => console.log('  - ' + m));
  process.exit(1);
}
console.log(`PASS check-split: 로직(무작위 합계·반올림·끝돈·최소 송금)·언어 12개·HTML ${pages}쪽·사이트맵·OG — 검사 ${passes}건 통과`);
