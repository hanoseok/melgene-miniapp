#!/usr/bin/env node
/**
 * 마니또 뽑기 검사.
 *   1) 로직(santa-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), 순열(randomPerm) 균등,
 *      뽑기 유효성(자기 자신 없음 · 모두 한 번씩 받음 · 제외 쌍 양방향 · 2-cycle 없음 옵션)을 여러 인원·조건에서 수천 번,
 *      공정성 카이제곱(p = 0.001): 조건을 만족하는 모든 배정을 전수 열거한 뒤 뽑기 결과가 그 위에서 고르게 나오는지
 *      (4명 무조건 9가지 · 4명 2-cycle 금지 6가지 · 5명 제외 쌍 1개 · 6명 제외 2쌍 + 2-cycle 금지) — 우연한 걸림은 한 번 더,
 *      불가능 판정(3명 + 제외 쌍 · 4명 중 한 사람이 모두와 제외 · 3명 2-cycle 금지는 가능) · 'tooHard' 는 치우친 결과를 내지 않음,
 *      이름 정리(줄바꿈·쉼표, 중복 " 2", 꺾쇠·제어 문자, 16자), 인원 3~30, 제외 쌍 정리, 날짜, 저장된 뽑기 검사(sanitizeDraw),
 *      #d= 왕복(UTF-8)·가림(받는 사람 이름이 base64 로도 그대로 보이지 않음)·변조 거절.
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, 번역됨, FAQ 3~5개(getRandomValues, "무료인가요?"·인기순 류 금지),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴, ru 는 «ты», 한글은 ko 파일만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 순서, 확인 화면·상자·확인 창·완료 처음 hidden, 완료(#done) 안 마지막이 data-mg-end="santa", FAQ 는 MG_FAQ 로만, 스크립트 순서,
 *      **배정이 HTML 에 없음**: 이름 버튼·링크·전체 결과 목록은 빈 칸, PAGE_I18N 에 이름·배정 없음, #d= 링크 없음.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지 1200×630 PNG, app.config.js, favicon, shared 링크, santa.js 규칙
 *      (Math.random 없음, track start 1곳(doDraw)·done 1곳(markDone), 전체 결과는 확인 창 뒤에만, 사용자 글자는 textContent, localStorage try/catch).
 *
 * 실행: node tools/check-santa.js   (tools/check-all.js 가 apps/santa 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'santa-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32, 8: 26.12, 9: 27.88, 10: 29.59, 11: 31.26, 12: 32.91, 13: 34.53, 14: 36.12, 15: 37.70, 19: 43.82, 23: 49.73 };
function chiCrit(df) {
  if (CHI_001[df]) return CHI_001[df];
  // Wilson–Hilferty 근사(p = 0.001, z = 3.0902)
  const z = 3.0902;
  return df * Math.pow(1 - 2 / (9 * df) + z * Math.sqrt(2 / (9 * df)), 3);
}
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
function allPerms(n) {
  const out = [];
  const a = Array.from({ length: n }, (_, i) => i);
  (function go(k) {
    if (k === n) { out.push(a.slice()); return; }
    for (let i = k; i < n; i++) { [a[k], a[i]] = [a[i], a[k]]; go(k + 1); [a[k], a[i]] = [a[i], a[k]]; }
  })(0);
  return out;
}
// 조건을 만족하는 모든 배정(전수) — 검사 쪽 독립 구현
function validAll(n, pairs, noPairs) {
  const ex = new Set(pairs.flatMap(([x, y]) => [`${x},${y}`, `${y},${x}`]));
  return allPerms(n).filter((a) => a.every((r, g) => r !== g && !ex.has(`${g},${r}`) && !(noPairs && a[r] === g)));
}
// 독립 검사: 배정이 조건을 지키는가
function okAssign(cfg, a) {
  const n = cfg.names.length;
  if (!Array.isArray(a) || a.length !== n || new Set(a).size !== n || a.some((r) => !(r >= 0 && r < n))) return 'not a permutation';
  if (a.some((r, g) => r === g)) return 'self';
  const idx = Object.fromEntries(cfg.names.map((x, i) => [x, i]));
  for (const [x, y] of cfg.pairs) { const i = idx[x], j = idx[y]; if (a[i] === j || a[j] === i) return `excluded ${x}-${y}`; }
  if (cfg.noPairs && a.some((r, g) => a[r] === g)) return '2-cycle';
  return '';
}
const passed = [];
function uniformTest(label, n, pairsIdx, noPairs, perValid) {
  const names = Array.from({ length: n }, (_, i) => 'N' + i);
  const cfg = CORE.validate({ names, pairs: pairsIdx.map(([x, y]) => [names[x], names[y]]), noPairs }).cfg;
  const valid = validAll(n, pairsIdx, noPairs);
  const key = (a) => a.join(',');
  const pos = new Map(valid.map((a, i) => [key(a), i]));
  const df = valid.length - 1;
  let x = Infinity;
  for (let t = 0; t < 2 && x > chiCrit(df); t++) { // 진짜 난수라 우연히 걸릴 수 있다(p = 0.001) — 두 번 연속 넘을 때만 실패
    const counts = new Array(valid.length).fill(0);
    const N = perValid * valid.length;
    for (let i = 0; i < N; i++) {
      const r = CORE.draw(cfg);
      if (!r.ok) { bad(`${label}: 가능한데 뽑기 실패 (${r.error})`); return; }
      const p = pos.get(key(r.a));
      if (p == null) { bad(`${label}: 조건을 어긴 배정 ${key(r.a)}`); return; }
      counts[p]++;
    }
    x = chi(counts);
  }
  if (x > chiCrit(df)) bad(`공정성 ${label}: 카이제곱 ${x.toFixed(2)} > ${chiCrit(df).toFixed(2)} (자유도 ${df})`);
  passed.push(`${label}(${valid.length}가지):${x.toFixed(1)}`);
}
function checkLogic() {
  eq([CORE.MIN_PEOPLE, CORE.MAX_PEOPLE, CORE.MAX_NAME, CORE.MAX_EVENT, CORE.MAX_BUDGET, CORE.MAX_EXCL], [3, 30, 16, 40, 24, 40], '한도');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');
  // 순열 균등(4! = 24칸)
  {
    const all = allPerms(4).map((a) => a.join(','));
    const pos = new Map(all.map((k, i) => [k, i]));
    let x = Infinity;
    for (let t = 0; t < 2 && x > chiCrit(23); t++) {
      const c = new Array(24).fill(0);
      for (let i = 0; i < 24000; i++) c[pos.get(CORE.randomPerm(4).join(','))]++;
      x = chi(c);
    }
    if (x > chiCrit(23)) bad(`randomPerm(4) 균등 아님: 카이제곱 ${x.toFixed(2)}`);
    passed.push(`perm4:${x.toFixed(1)}`);
  }

  // 뽑기 유효성: 여러 인원·조건 × 여러 번
  let invalid = 0, runs = 0;
  const mk = (n, pairs, noPairs) => {
    const names = Array.from({ length: n }, (_, i) => 'P' + i);
    return CORE.validate({ names, pairs: pairs.map(([x, y]) => [names[x], names[y]]), noPairs }).cfg;
  };
  const cases = [
    mk(3, [], false), mk(3, [], true), mk(4, [[0, 1]], false), mk(5, [[0, 1], [2, 3]], true), mk(8, [[0, 1], [2, 3], [4, 5], [6, 7]], true),
    mk(12, [[0, 1], [0, 2], [3, 4]], false), mk(30, Array.from({ length: 15 }, (_, i) => [2 * i, 2 * i + 1]), true), mk(30, [], false),
  ];
  cases.forEach((cfg) => {
    for (let k = 0; k < 400; k++) {
      runs++;
      const r = CORE.draw(cfg);
      const why = r.ok ? okAssign(cfg, r.a) : `실패 ${r.error}`;
      if (why) { invalid++; if (invalid < 4) bad(`뽑기 ${cfg.names.length}명(제외 ${cfg.pairs.length}, 2-cycle 금지 ${cfg.noPairs}): ${why}`); }
      if (r.ok && !CORE.isValid(r.a, cfg.names.length, CORE.allowMatrix(cfg.names.length, CORE.pairIndexes(cfg)), cfg.noPairs)) invalid++;
    }
  });
  if (invalid) bad(`뽑기 유효성: ${runs}번 중 ${invalid}번 조건 위반`);
  passed.push(`valid:${runs}`);

  // 공정성(전수 열거 위에서 균등)
  uniformTest('4명', 4, [], false, 2000);
  uniformTest('4명·2-cycle 금지', 4, [], true, 2000);
  uniformTest('5명·제외 1쌍', 5, [[0, 1]], false, 600);
  uniformTest('6명·제외 2쌍·2-cycle 금지', 6, [[0, 1], [2, 3]], true, 120);

  // 불가능 판정
  const imp = (n, pairs, noPairs) => CORE.draw(mk(n, pairs, noPairs));
  eq(imp(3, [[0, 1]], false), { ok: false, error: 'impossible' }, '3명 + 제외 1쌍 = 불가능');
  eq(imp(4, [[0, 1], [0, 2], [0, 3]], false), { ok: false, error: 'impossible' }, '4명 중 한 사람이 모두와 제외 = 불가능');
  eq(imp(5, [[0, 1], [0, 2], [0, 3], [4, 1], [4, 2], [4, 3]], false).ok, true, '5명: 0·4 가 서로만 뽑는 경우는 가능(2-cycle 허용)');
  eq(imp(5, [[0, 1], [0, 2], [0, 3], [4, 1], [4, 2], [4, 3]], true), { ok: false, error: 'impossible' }, '같은 조건 + 2-cycle 금지 = 불가능');
  eq(imp(3, [], true).ok, true, '3명 2-cycle 금지 = 가능(3-cycle)');
  if (validAll(5, [[0, 1], [0, 2], [0, 3], [4, 1], [4, 2], [4, 3]], true).length !== 0) bad('검사 자체 오류: 불가능 사례가 전수 열거로 가능함');
  eq(CORE.feasible(4, CORE.allowMatrix(4, [[0, 1], [0, 2], [0, 3]]), false), 'no', 'feasible: 불가능');
  eq(CORE.feasible(4, CORE.allowMatrix(4, []), true), 'yes', 'feasible: 가능');
  // 샘플링이 한도 안에 못 찾으면 'tooHard' (치우친 결과를 대신 내놓지 않음)
  {
    const cfg = mk(5, [], false);
    const r = CORE.draw(cfg, (m) => m - 1, { maxTries: 50 }); // j = k 만 → 늘 항등 순열 → 늘 거절
    eq(r, { ok: false, error: 'tooHard' }, 'tooHard: 샘플링 실패 시 결과 없음');
  }
  // 무작위 작은 사례: 전수 열거로 가능/불가능이 draw 와 일치
  for (let k = 0; k < 120; k++) {
    const n = 3 + CORE.cryptoInt(4);
    const pairs = [];
    const m = CORE.cryptoInt(n + 2);
    for (let i = 0; i < m; i++) { const x = CORE.cryptoInt(n), y = CORE.cryptoInt(n); if (x !== y) pairs.push([x, y]); }
    const np = CORE.cryptoInt(2) === 1;
    const exists = validAll(n, pairs, np).length > 0;
    const r = CORE.draw(mk(n, pairs, np));
    if (exists !== r.ok) { bad(`가능/불가능 판정 불일치: ${n}명 ${JSON.stringify(pairs)} 2-cycle 금지 ${np} → 전수 ${exists}, draw ${JSON.stringify(r)}`); break; }
  }

  // 이름 · 입력 검사
  eq(CORE.parseNames('Mina\nJun, Bo；Lee\n\n').names, ['Mina', 'Jun', 'Bo', 'Lee'], '이름 나누기(줄바꿈·쉼표·전각)');
  eq(CORE.parseNames('Mina\nmina\nMina').names, ['Mina', 'mina 2', 'Mina 3'], '이름 중복 → " 2" " 3"');
  eq(CORE.parseNames('<b>Al</b>\nBo\u0007b').names, ['b Al /b', 'Bo b'], '이름 꺾쇠·제어 문자 정리');
  const lp = CORE.parseNames('x'.repeat(40));
  eq([Array.from(lp.names[0]).length, lp.long], [CORE.MAX_NAME, true], '이름 16자 제한 + 긴 이름 표시');
  eq(CORE.validate({ names: 'A\nB' }).error, 'namesTooFew', '이름 2명');
  eq(CORE.validate({ names: Array.from({ length: 31 }, (_, i) => 'P' + i).join('\n') }), { ok: false, error: 'namesTooMany', n: 31 }, '이름 31명');
  eq(CORE.validate({ names: 'A\nB\nC' }).cfg, { event: '', names: ['A', 'B', 'C'], budget: '', date: '', pairs: [], noPairs: false }, '기본 설정');
  eq(CORE.validate({ names: 'A\nB\nC\nD', pairs: [['A', 'B'], ['B', 'A'], ['A', 'A'], ['A', 'Z'], ['D', 'C'], 'x', ['C']] }).cfg.pairs, [['A', 'B'], ['C', 'D']], '제외 쌍 정리(중복·자기·없는 이름·모양)');
  eq(CORE.validate({ names: 'A\nB\nC', event: ' <Party> ', budget: '$25', date: '2026-12-24' }).cfg, { event: 'Party', names: ['A', 'B', 'C'], budget: '$25', date: '2026-12-24', pairs: [], noPairs: false }, '모임·예산·날짜');
  eq(['2026-02-30', '2026-13-01', '24.12.2026', '', null].map(CORE.cleanDate), ['', '', '', '', ''], '잘못된 날짜는 비움');

  // 저장된 뽑기 검사
  const sv = { v: 1, event: 'E', names: ['A', 'B', 'C', 'D'], budget: '', date: '', pairs: [['A', 'B']], noPairs: false, a: [2, 3, 1, 0], checked: [true, false, 1, 0], done: false };
  eq(CORE.sanitizeDraw(sv) && CORE.sanitizeDraw(sv).checked, [true, false, true, false], 'sanitizeDraw: 정상');
  [['자기 자신', { a: [0, 3, 1, 2] }], ['제외 쌍 위반', { a: [1, 2, 3, 0] }], ['순열 아님', { a: [2, 2, 1, 0] }], ['버전', { v: 2 }], ['이름 수', { names: ['A', 'B'] }], ['배열 아님', { a: 'x' }]].forEach(([nm, o]) => {
    if (CORE.sanitizeDraw(Object.assign({}, sv, o))) bad(`sanitizeDraw: ${nm} 를 거절해야 함`);
  });
  eq(CORE.sanitizeDraw(null), null, 'sanitizeDraw(null)');

  // #d= (한 사람 결과, 가림)
  const o = { e: '회사 송년회', g: '민준', r: 'Маша', b: '3만원', t: '2026-12-24' };
  const enc = CORE.encodeLink(o);
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeLink: base64url 아님');
  eq(CORE.decodeLink(enc), o, '#d= 왕복(UTF-8)');
  const plain = Buffer.from(enc.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const plainTxt = plain.toString('utf8') + plain.toString('latin1');
  if (/Маша|"r"|"g"|\{"v"/.test(plainTxt)) bad('#d= 가 base64 를 풀면 그대로 읽힘(가림 없음)');
  const enc2 = CORE.encodeLink({ e: '', g: 'Alice', r: 'Bob', b: '', t: '' });
  if (Buffer.from(enc2.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('latin1').includes('Bob')) bad('#d= 에 받는 사람 이름이 그대로 보임');
  if (enc2 === CORE.encodeLink({ e: '', g: 'Alice', r: 'Bob', b: '', t: '' })) bad('#d= 가 매번 같은 문자열(씨앗이 섞이지 않음)');
  eq(CORE.decodeLink(CORE.encodeLink({ g: 'A', r: 'B', t: 'nope' }, 12345)), { e: '', g: 'A', r: 'B', b: '', t: '' }, '#d= 잘못된 날짜는 비움');
  eq([CORE.encodeLink({ g: 'A', r: 'A' }), CORE.encodeLink({ g: '', r: 'B' }), CORE.encodeLink(null)], [null, null, null], 'encodeLink: 같은 사람·빈 이름 거절');
  // 변조 거절
  const mkRaw = (obj, seed) => {
    const s = seed >>> 0;
    const body = CORE.maskBytes(Buffer.from(JSON.stringify(obj), 'utf8'), s);
    const all = Buffer.concat([Buffer.from([(s >>> 24) & 255, (s >>> 16) & 255, (s >>> 8) & 255, s & 255]), Buffer.from(body)]);
    return all.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  eq(CORE.decodeLink(mkRaw({ v: 1, e: 'E', g: 'A', r: 'B', b: '', t: '' }, 777)), { e: 'E', g: 'A', r: 'B', b: '', t: '' }, 'decode 기본');
  [['버전', { v: 2, g: 'A', r: 'B' }], ['같은 사람', { v: 1, g: 'A', r: 'A' }], ['빈 받는 사람', { v: 1, g: 'A', r: '' }], ['모르는 키', { v: 1, g: 'A', r: 'B', all: [1, 2] }],
    ['숫자 이름', { v: 1, g: 'A', r: 5 }], ['긴 이름', { v: 1, g: 'A', r: 'x'.repeat(60) }], ['배열', [1, 2]]].forEach(([nm, obj]) => {
    if (CORE.decodeLink(mkRaw(obj, 99))) bad(`decodeLink: ${nm} 를 거절해야 함`);
  });
  const dirty = CORE.decodeLink(mkRaw({ v: 1, g: '<img src=x onerror=1>Al', r: 'B' }, 5));
  if (!dirty) bad('decodeLink: 정리할 수 있는 이름은 받아야 함');
  else if (/[<>]/.test(dirty.g)) bad('decodeLink: 꺾쇠가 정리되지 않음');
  // 한 글자만 바꿔도(가림이 틀어져) 거절되거나 다른 값 — 적어도 오류 없이 끝남
  const flipped = enc.slice(0, 8) + (enc[8] === 'A' ? 'B' : 'A') + enc.slice(9);
  try { CORE.decodeLink(flipped); } catch (e) { bad('decodeLink: 변조된 값에서 예외'); }
  ['', 'abc$', '!!!', 'e30', null, 123, 'x'.repeat(3000), Buffer.from('{"v":1,"g":"A","r":"B"}').toString('base64url')].forEach((str) => { if (CORE.decodeLink(str)) bad(`decodeLink 쓰레기 값 허용: ${String(str).slice(0, 12)}`); });
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
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.draw', 'ui.namesLabel', 'ui.confirmQ', 'ui.yourTarget', 'ui.hide', 'ui.passTitle', 'ui.allSub', 'ui.exclLabel', 'result.doneTitle', 'errors.impossible'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨)
    const W = [['ui.draw', 26], ['ui.confirmYes', 24], ['ui.cancel', 16], ['ui.hide', 26], ['ui.linksBtn', 30], ['ui.doneBtn', 22], ['ui.allBtn', 22], ['ui.redraw', 22], ['ui.edit', 22],
      ['ui.allYes', 26], ['ui.redrawYes', 26], ['ui.editYes', 26], ['ui.linkCopy', 14], ['ui.linkCopied', 14], ['ui.exclAdd', 20], ['ui.exclPick', 12], ['ui.allHide', 16],
      ['ui.noPairsLabel', 34], ['ui.exclLabel', 40], ['ui.eventLabel', 26], ['ui.namesLabel', 34], ['ui.budgetLabel', 14], ['ui.dateLabel', 18], ['ui.optional', 16],
      ['ui.passTitle', 30], ['ui.orgTitle', 34], ['ui.allTitle', 30], ['ui.seenMark', 14], ['result.again', 32], ['result.kicker', 20]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    if (width(fmt(T.ui.namesCount, { n: 30 })) > 14) bad(`${tag} ui.namesCount 가 김: ${T.ui.namesCount}`);
    if (width(fmt(T.ui.progress, { k: 30, n: 30 })) > 30) bad(`${tag} ui.progress 가 김: ${T.ui.progress}`);
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
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
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
  if (!/<link rel="canonical" href="https:\/\/santa\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/santa\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((x, i) => i && x < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
  if (/#d=/.test(html)) bad(`${tag} 개인 링크(#d=)가 HTML 에 있음`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  // 언어 파일 예시 이름(placeholder) 말고는 이름이 HTML 에 나오면 안 된다 — 예시 이름도 시작 화면 placeholder 밖에는 없어야 한다
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
      if ((html.match(/<section[\s>]/g) || []).length !== 2) bad(`${tag} section 은 시작·확인 화면 2개`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (!/<section id="screen-play" class="sn-screen sn-play" hidden>/.test(html)) bad(`${tag} 확인 화면은 처음에 hidden`);
      if (html.indexOf('id="screen-setup"') > html.indexOf('id="screen-play"')) bad(`${tag} 시작 화면이 확인 화면보다 먼저여야 함`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="sn-h1">/.test(S)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const inOrder = (X, ids, what) => { const at = ids.map((s) => X.indexOf(s)); if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${tag} ${what} 순서가 아님`); };
      inOrder(S, ['class="sn-h1"', 'class="sn-hook"', 'id="event"', 'id="names"', 'id="names-count"', 'id="budget"', 'id="date"', 'id="excl-a"', 'id="excl-b"', 'id="excl-add"', 'id="excl-list"', 'id="no-pairs"', 'id="error"', 'id="draw-btn"', 'class="sn-fair"', 'class="mg-ad mg-ad-start"'],
        '시작 화면(h1 → 훅 → 모임 → 이름 → 예산·날짜 → 제외 쌍 → 2명끼리 막기 → 뽑기 → 광고)');
      inOrder(P, ['id="ev-title"', 'id="ev-meta"', 'id="pass"', 'id="progress"', 'id="who-list"', 'id="secret"', 'id="gift-btn"', 'id="secret-body"', 'id="secret-name"', 'id="hide-btn"', 'id="org"', 'id="links-btn"', 'id="done-btn"', 'id="all-btn"', 'id="redraw-btn"', 'id="edit-btn"', 'id="links-list"', 'id="all-list"', 'id="ask"', 'id="ask-yes"', 'id="live"', 'id="done"', 'id="done-title"', '<div data-mg-end="santa"></div>'],
        '확인 화면(모임 → 휴대폰 돌리기 → 선물 상자 → 진행자 도구 → 확인 창 → 완료 → 공통 끝 화면)');
      ['<div id="secret" class="sn-card sn-secret" hidden>', '<div id="secret-body" class="sn-secret-body" hidden>', '<div id="links" class="sn-links" hidden>', '<div id="all" class="sn-all" hidden>',
        '<div id="ask" class="sn-ask" role="dialog" aria-modal="true" aria-labelledby="ask-text" hidden>', '<div id="done" class="sn-done" hidden>'].forEach((s) => { if (!P.includes(s)) bad(`${tag} 처음에 hidden 이어야 함: ${s.slice(0, 40)}`); });
      if (!/<div id="done"[\s\S]*?<div data-mg-end="santa"><\/div>\s*<\/div>\s*<\/section>$/.test(P)) bad(`${tag} data-mg-end="santa" 는 완료(#done) 안의 마지막 요소여야 함`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      // 배정이 HTML 에 없음: 이름·링크·전체 결과 칸은 비어 있음, 받는 사람 이름 칸도 비어 있음
      [/<div id="who-list" class="sn-who" role="list"><\/div>/, /<ol id="links-list" class="sn-links-list"><\/ol>/, /<ol id="all-list" class="sn-all-list"><\/ol>/, /<p id="secret-name" class="sn-secret-name"><\/p>/, /<ul id="excl-list" class="sn-excl-list" aria-labelledby="excl-label"><\/ul>/]
        .forEach((re) => { if (!re.test(P + S)) bad(`${tag} 빈 칸이어야 함: ${re.source.slice(1, 40)}`); });
      if (/role="switch" checked/.test(S)) bad(`${tag} 2명끼리 막기는 기본 꺼짐`);
      if (!/id="error" class="sn-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="live" class="visually-hidden" aria-live="assertive"/.test(P) || !/id="progress" class="sn-progress" aria-live="polite"/.test(P)) bad(`${tag} 읽어 주기(aria-live) 없음`);
      const rt = (html.match(/<script>window\.PAGE_I18N = ([\s\S]*?);?<\/script>/) || [])[1];
      let runtime = null;
      try { runtime = JSON.parse(rt); } catch (e) { bad(`${tag} PAGE_I18N JSON 읽기 실패`); }
      if (runtime && Object.keys(runtime).sort().join() !== 'errors,lang,result,ui') bad(`${tag} PAGE_I18N 은 문구만(lang·ui·errors·result): ${Object.keys(runtime).join()}`);
      if (runtime && /"(a|names|pairs|assign\w*)":/.test(JSON.stringify(runtime))) bad(`${tag} PAGE_I18N 에 이름·배정 같은 값이 있음`);
      if (/mg-faq|<details/.test(S + P)) bad(`${tag} 화면에 FAQ`);
      if (T.faq.some((q) => stripRuntime(html).includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('santa-core.js') < 0 || html.indexOf('santa-core.js') > html.indexOf('santa.js"')) bad(`${tag} santa-core.js 가 santa.js 보다 먼저여야 함`);
      // 예시 이름은 placeholder 에만 (배정처럼 보이는 "A → B" 문구 없음)
      if (/→\s*<\/?span/.test(stripRuntime(html))) bad(`${tag} 배정처럼 보이는 화살표 목록이 HTML 에 있음`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://santa.example.com/</loc>') || !sm.includes('<loc>https://santa.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  G.LOCALES.forEach(({ code: lang }) => {
    if (!fs.existsSync(path.join(SITE, 'tools', 'guide', `${lang}.js`))) bad(`가이드 ${lang} 없음`);
  });
  if (!fs.existsSync(path.join(SITE, 'README.md'))) bad('README.md 없음');

  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'santa.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js) || /'[A-Z][a-z]+ [a-z]+[^']*'/.test(js)) bad('santa.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("santa.js: track('start') 는 뽑기 1곳, track('done') 은 markDone 1곳");
  const fnBody = (name) => { const i = js.indexOf(`function ${name}(`); return i < 0 ? '' : js.slice(i, js.indexOf('\n  }\n', i)); };
  if (!fnBody('doDraw').includes("track('start')") || !/CORE\.draw\([\s\S]*track\('start'\)/.test(fnBody('doDraw'))) bad("santa.js: track('start') 는 doDraw 안, 뽑은 뒤에");
  if (!fnBody('markDone').includes("track('done')") || !fnBody('markDone').includes('doneTracked')) bad("santa.js: track('done') 은 markDone 안에서 한 번만(doneTracked)");
  ['finish', 'openGift'].forEach((f) => { if (!fnBody(f).includes('markDone()')) bad(`santa.js: ${f} 에서 markDone() 을 부르지 않음`); });
  if (/Math\.random/.test(js)) bad('santa.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('santa.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if ((js.match(/showAll\b/g) || []).length < 2 || !/ask\(U\.allQ, U\.allSub, U\.allYes, U\.cancel, showAll\)/.test(js) || /addEventListener\('click', showAll\)/.test(js)) bad('santa.js: 전체 결과는 확인 창(ask) 뒤에만 보여 준다');
  if (!/ask\(fmt\(seen \? U\.againQ : U\.confirmQ/.test(fnBody('tapName'))) bad('santa.js: 이름을 누르면 "정말 ○○님인가요?" 확인 뒤에만 상자');
  if (!fnBody('hideSecret').includes('cur.checked[viewer] = true') || !fnBody('hideSecret').includes('saveDraw()')) bad('santa.js: 가리기를 누르면 확인 표시·저장');
  if (!fnBody('doDraw').includes('saveDraw()') || !/removeItem\(DRAW\)/.test(fnBody('clearDraw'))) bad('santa.js: 이번 뽑기는 저장하고, 명단 고치기에서 지운다');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`santa.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/'mg_santa_v1'/.test(js)) bad("santa.js: 설정 저장 키 'mg_santa_v1'");
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('santa.js: setShareData / setRetry 등록 없음');
  if (!/decodeLink/.test(js) || !/#d=/.test(js) || !/encodeLink/.test(js)) bad('santa.js: #d= 개인 링크 만들기·열기 없음');
  if (!/mgCleanUrl/.test(js)) bad('santa.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*(?!\s*'')/.test(js)) bad("santa.js: 사용자 글자를 innerHTML 로 넣지 않는다(textContent 만, innerHTML = '' 만 허용)");
  if (/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js)) bad('santa.js: 이름을 서버로 보내지 않는다(네트워크 호출 없음)');
  const core = fs.readFileSync(path.join(SITE, 'santa-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('santa-core.js 는 crypto.getRandomValues 만 써야 함');
  const css = fs.readFileSync(path.join(SITE, 'style.css'), 'utf8');
  if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.sn-lid/.test(css)) bad('style.css: 움직임 줄이기면 상자 뚜껑 애니메이션 없음');
  if (!/\.sn-ask \{[^}]*max-width: var\(--app-width\)/.test(css)) bad('style.css: 확인 창 전체 화면은 앱 폭(--app-width) 안');
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
  if (APP.id !== 'santa' || APP.category !== 'vote' || APP.path !== 'https://santa.example.com/' || APP.added !== '2026-10-28' || APP.emoji !== '🎁' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 160) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 34) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
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
console.log(`\n마니또 뽑기 로직·뽑기 유효성(자기 자신·제외 쌍·2-cycle)·공정성(카이제곱: 전수 열거한 유효 배정 위 균등)·불가능 판정·#d= 왕복/가림/변조 거절 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
if (passed.length) console.log(`  ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 조건을 지키는 균등한 뽑기(crypto 거부 샘플링)·불가능 판정·개인 링크(가림), 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·완료 안 data-mg-end·배정 없음), OG 이미지 모두 OK');
