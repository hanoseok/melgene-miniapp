#!/usr/bin/env node
/**
 * 폭탄 돌리기 검사.
 *   1) 로직(bomb-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), 심지 길이 범위(양 끝 포함) ·
 *      공정성 카이제곱(p = 0.001): 짧게/보통/길게마다 터지는 시각이 범위 안에서 고르게(15칸) · 첫 사람(2~12명)이 고르게,
 *      심지 시계(멈춤): 멈춘 동안 시간이 흐르지 않음, 두 번 시작·두 번 멈춤에도 그대로, 다시 붙이면 이어서, 전체 길이에서 멈춤, fuseDone,
 *      째깍 박자(planTicks): 0 에서 시작·증가·전체 길이 전·최소 간격, 끝으로 갈수록 빨라짐, 그러나 남은 시간을 박자로 정확히 알 수 없음
 *      (같은 "남은 6초"에도 판마다 간격이 크게 다름 · "남은 1.5초"와 "남은 4초"의 간격 분포가 겹침 · 같은 길이라도 판마다 다른 박자),
 *      넘기기(순서대로 돌기·연타 방지), 이름 정리(줄바꿈·쉼표, 중복 " 2", 꺾쇠·제어 문자, 14자), 인원 한도, 벌칙 덱(다 쓰기 전 반복 없음·연속 반복 없음),
 *      기록 10개·손상된 기록 버림, #d= 왕복(이름만)·변조 거절.
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, 번역됨, FAQ 3~5개(getRandomValues, "무료인가요?"·인기순 류 금지, 미션 인용 금지),
 *      벌칙 미션 12장(서로 다름·짧음·HTML 없음·가족용), 제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴, ru 는 «ты», 한글은 ko 파일만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 순서, 게임 화면·결과·멈춤·펑 처음 hidden, 결과 안 마지막이 data-mg-end="bomb", FAQ 는 MG_FAQ 로만, 스크립트 순서,
 *      **벌칙 미션은 목록으로 노출되지 않음**: PAGE_I18N 밖(보이는 HTML·메타·OG·개인정보·가이드)에 미션 문구 0개, 미션 칸은 빈 문단 1개뿐.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지 1200×630 PNG, app.config.js, favicon, shared 링크, bomb.js 규칙
 *      (Math.random 없음, track start/done 1곳씩, visibilitychange → fusePause, 소리는 사용자 동작 뒤에만, vibrate 확인, 움직임 줄이기).
 *
 * 실행: node tools/check-bomb.js   (tools/check-all.js 가 apps/bomb 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bomb-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const quant = (xs, q) => { const s = xs.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32, 8: 26.12, 9: 27.88, 10: 29.59, 11: 31.26, 14: 36.12 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
const passed = [];
function checkLogic() {
  eq([CORE.MIN_PLAYERS, CORE.MAX_PLAYERS, CORE.MAX_NAME, CORE.HISTORY_MAX, CORE.PASS_COOLDOWN_MS, CORE.MIN_TICK_MS], [2, 12, 14, 10, 600, 90], '한도');
  eq(CORE.FUSES, { short: [10000, 25000], normal: [20000, 45000], long: [40000, 80000] }, '심지 범위(짧게 10~25초 · 보통 20~45초 · 길게 40~80초)');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(15001, seq([4294967000, 4294966312, 4294966311])), 4294966311 % 15001, 'uniformInt(15001): limit(4294966312) 이상 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 심지 길이: 양 끝 포함 · 범위 밖 없음 · 고르게
  Object.entries(CORE.FUSES).forEach(([k, [a, b]]) => {
    eq(CORE.drawFuse(k, () => 0), a, `drawFuse(${k}) 최솟값`);
    eq(CORE.drawFuse(k, (m) => m - 1), b, `drawFuse(${k}) 최댓값(양 끝 포함)`);
    const bins = new Array(15).fill(0);
    const N = 30000;
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < N; i++) {
      const ms = CORE.drawFuse(k);
      if (!(ms >= a && ms <= b) || ms !== Math.floor(ms)) { bad(`drawFuse(${k}) 범위 밖/정수 아님: ${ms}`); break; }
      lo = Math.min(lo, ms); hi = Math.max(hi, ms);
      bins[Math.min(14, Math.floor((ms - a) / ((b - a + 1) / 15)))]++;
    }
    let x = chi(bins);
    if (x > CHI_001[14]) { // 우연한 걸림은 한 번 더 뽑아 본다
      const again = new Array(15).fill(0);
      for (let i = 0; i < N; i++) again[Math.min(14, Math.floor((CORE.drawFuse(k) - a) / ((b - a + 1) / 15)))]++;
      x = chi(again);
    }
    if (x > CHI_001[14]) bad(`공정성 심지(${k}) 15칸: 카이제곱 ${x.toFixed(2)} > ${CHI_001[14]}`);
    if (lo > a + (b - a) * 0.01 || hi < b - (b - a) * 0.01) bad(`drawFuse(${k}) 가 범위 끝까지 닿지 않음 (${lo}~${hi})`);
    passed.push(`${k}:${x.toFixed(1)}`);
  });
  eq(CORE.drawFuse('nope', () => 0), 20000, '모르는 심지 = 보통');

  // 첫 사람: 2~12명 고르게
  for (let n = CORE.MIN_PLAYERS; n <= CORE.MAX_PLAYERS; n++) {
    // 진짜 난수라 검사 14개 중 하나가 우연히 걸릴 수 있다(p = 0.001) — 두 번 연속 넘을 때만 실패
    let x = Infinity;
    for (let t = 0; t < 2 && x > CHI_001[n - 1]; t++) {
      const c = new Array(n).fill(0);
      for (let i = 0; i < 3000 * n; i++) c[CORE.firstHolder(n)]++;
      x = chi(c);
    }
    if (x > CHI_001[n - 1]) bad(`공정성 첫 사람 ${n}명: 카이제곱 ${x.toFixed(2)} > ${CHI_001[n - 1]}`);
  }
  eq(CORE.firstHolder(0), -1, 'firstHolder(0)');
  eq([CORE.nextHolder(0, 3), CORE.nextHolder(2, 3), CORE.nextHolder(-1, 0)], [1, 0, -1], 'nextHolder: 순서대로 돌고 처음으로');
  eq([CORE.canPass(null, 5), CORE.canPass(1000, 1599), CORE.canPass(1000, 1600)], [true, false, true], 'canPass: 넘긴 뒤 600ms 연타 방지');

  // 심지 시계(멈춤)
  const f = CORE.newFuse(10000);
  eq([CORE.fuseElapsed(f, 500), CORE.fuseRunning(f)], [0, false], '불붙이기 전 0');
  CORE.fuseStart(f, 1000);
  eq(CORE.fuseElapsed(f, 3000), 2000, '타는 중 흐른 시간');
  CORE.fuseStart(f, 2500);
  eq(CORE.fuseElapsed(f, 3000), 2000, '두 번 불붙여도 처음 시각 그대로');
  CORE.fusePause(f, 3000);
  eq([CORE.fuseElapsed(f, 3000), CORE.fuseElapsed(f, 60000), CORE.fuseRunning(f)], [2000, 2000, false], '멈춘 동안(숨은 탭) 시간이 흐르지 않음');
  CORE.fusePause(f, 9000);
  eq(CORE.fuseElapsed(f, 9000), 2000, '두 번 멈춰도 그대로');
  CORE.fuseStart(f, 20000);
  eq(CORE.fuseElapsed(f, 21500), 3500, '다시 붙이면 멈춘 자리부터 이어서');
  eq([CORE.fuseDone(f, 27999), CORE.fuseDone(f, 28000)], [false, true], 'fuseDone: 멈춘 시간은 빼고 전체 길이에서 터짐');
  eq(CORE.fuseElapsed(f, 99999), 10000, '흐른 시간은 전체 길이에서 멈춤');
  CORE.fusePause(f, 22000);
  eq([CORE.fuseElapsed(f, 90000), CORE.fuseDone(f, 90000)], [4000, false], '멈춘 상태로는 아무리 기다려도 터지지 않음');
  // 여러 번 숨겼다 돌아와도: 흐른 시간 = 탄 구간의 합
  const g = CORE.newFuse(30000);
  let t = 0, burned = 0;
  for (let k = 0; k < 40; k++) { CORE.fuseStart(g, t); const on = 100 + k * 37; t += on; burned += on; CORE.fusePause(g, t); t += 5000 + k * 11; }
  eq(CORE.fuseElapsed(g, t), Math.min(30000, burned), '멈춤·재개 40번: 흐른 시간 = 탄 구간의 합');

  // 째깍 박자
  let monoBad = 0, trendOk = 0;
  const runs = 300;
  for (let k = 0; k < runs; k++) {
    const mode = CORE.FUSE_KEYS[k % 3];
    const total = CORE.drawFuse(mode);
    const tk = CORE.planTicks(total);
    if (tk[0] !== 0 || tk[tk.length - 1] >= total) monoBad++;
    for (let i = 1; i < tk.length; i++) if (!(tk[i] - tk[i - 1] >= CORE.MIN_TICK_MS - 1)) { monoBad++; break; }
    const gaps = tk.slice(1).map((x, i) => x - tk[i]);
    const head = gaps.filter((_, i) => tk[i] < total * 0.2);
    const tail = gaps.filter((_, i) => tk[i] > total * 0.92);
    if (head.length && tail.length && mean(head) > 2.2 * mean(tail)) trendOk++;
  }
  if (monoBad) bad(`planTicks: 0 에서 시작·증가·전체 길이 전·최소 간격 90ms 위반 ${monoBad}판`);
  if (trendOk / runs < 0.97) bad(`planTicks: 끝으로 갈수록 빨라지는 판 ${(trendOk / runs * 100).toFixed(0)}% (97% 이상)`);
  // 박자로 남은 시간을 정확히 알 수 없음
  const at = (rem) => { const xs = []; for (let k = 0; k < 2000; k++) { const total = CORE.drawFuse('normal'); xs.push(CORE.tickGap(CORE.planTicks(total), total - rem)); } return xs; };
  const g6 = at(6000), g4 = at(4000), g15 = at(1500);
  const cv6 = Math.sqrt(mean(g6.map((x) => (x - mean(g6)) ** 2))) / mean(g6);
  if (cv6 < 0.15) bad(`박자 예측 가능: 남은 6초의 간격 변동계수 ${cv6.toFixed(2)} (0.15 이상이어야 판마다 다름)`);
  const overlap = g4.filter((x) => x <= quant(g15, 0.9)).length / g4.length;
  if (overlap < 0.3) bad(`박자 예측 가능: 남은 4초 간격의 ${(overlap * 100).toFixed(0)}% 만 남은 1.5초 분포(90%) 안 (30% 이상)`);
  const same = [CORE.planTicks(30000), CORE.planTicks(30000)];
  if (same[0].join() === same[1].join()) bad('planTicks: 같은 길이인데 박자가 똑같음(판마다 섞여야 함)');
  passed.push(`cv6:${cv6.toFixed(2)} overlap:${(overlap * 100).toFixed(0)}% trend:${(trendOk / runs * 100).toFixed(0)}%`);
  eq([CORE.tickGap([0, 500, 800], 100), CORE.tickGap([0, 500, 800], 600), CORE.tickGap([0, 500, 800], 999), CORE.tickGap([0], 5)], [500, 300, 300, 600], 'tickGap');

  // 이름 · 입력 검사
  eq(CORE.parseNames('Mina\nJun, Bo；Lee\n\n').names, ['Mina', 'Jun', 'Bo', 'Lee'], '이름 나누기(줄바꿈·쉼표·전각)');
  eq(CORE.parseNames('Mina\nmina\nMina').names, ['Mina', 'mina 2', 'Mina 3'], '이름 중복 → " 2" " 3"');
  eq(CORE.parseNames('<b>Al</b>\nBo\u0007b').names, ['b Al /b', 'Bo b'], '이름 꺾쇠·제어 문자 정리');
  const lp = CORE.parseNames('x'.repeat(40));
  eq([Array.from(lp.names[0]).length, lp.long], [CORE.MAX_NAME, true], '이름 14자 제한 + 긴 이름 표시');
  eq(CORE.validate({ mode: 'names', names: 'A' }).error, 'namesTooFew', '이름 1명');
  eq(CORE.validate({ mode: 'names', names: Array.from({ length: 13 }, (_, i) => 'P' + i).join('\n') }).error, 'namesTooMany', '이름 13명');
  eq(CORE.validate({ mode: 'names', names: Array.from({ length: 13 }, (_, i) => 'P' + i).join('\n') }).n, 13, '이름 13명 수');
  eq(CORE.validate({}).cfg, { mode: 'free', names: [], fuse: 'normal', hints: false, missions: false }, '기본: 그냥 하기 · 보통 · 힌트·벌칙 꺼짐');
  eq(CORE.validate({ mode: 'free', names: 'ignored' }).cfg.names, [], '그냥 하기는 이름을 쓰지 않음');
  eq(CORE.validate({ mode: 'names', names: 'A\nB', fuse: 'long', hints: 1, missions: 1 }).cfg, { mode: 'names', names: ['A', 'B'], fuse: 'long', hints: true, missions: true }, '이름 모드 설정');

  // 벌칙 덱
  const d = CORE.missionDeck(12);
  const firstRound = Array.from({ length: 12 }, () => CORE.nextMission(d));
  if (new Set(firstRound).size !== 12) bad('벌칙 덱: 12장을 다 쓰기 전에 반복');
  let last = firstRound[11], repeat = false;
  for (let k = 0; k < 600; k++) { const nx = CORE.nextMission(d); if (nx === last) repeat = true; last = nx; }
  if (repeat) bad('벌칙 덱: 다시 섞을 때 같은 카드가 연속으로 나옴');
  eq(CORE.nextMission(CORE.missionDeck(0)), -1, '벌칙 덱 빈 목록');
  eq(CORE.nextMission(CORE.missionDeck(1)), 0, '벌칙 덱 1장');

  // 기록
  let h = [];
  for (let k = 1; k <= 14; k++) h = CORE.pushHistory(h, { t: k, who: 'N' + k, n: 3, p: k, ms: 30000, f: 'normal' });
  eq([h.length, h[0].who, h[9].who], [10, 'N14', 'N5'], '기록 10개, 최신이 맨 앞');
  const ok = { t: 1, who: 'A', n: 3, p: 4, ms: 22000, f: 'normal' };
  eq(CORE.sanitizeHistory([ok, { t: 2, who: '', n: 0, p: 7, ms: 12000, f: 'short' }, Object.assign({}, ok, { t: 'x' }), Object.assign({}, ok, { f: 'huge' }), Object.assign({}, ok, { n: 13 }),
    Object.assign({}, ok, { ms: 90000 }), Object.assign({}, ok, { who: '' }), Object.assign({}, ok, { n: 0 }), Object.assign({}, ok, { p: -1 }), null, 5, Object.assign({}, ok, { who: '<i>E' })]),
  [ok, { t: 2, who: '', n: 0, p: 7, ms: 12000, f: 'short' }, Object.assign({}, ok, { who: 'i E' })], 'sanitizeHistory: 모양이 틀린 기록은 버리고 이름 정리');
  eq(CORE.sanitizeHistory('nope'), [], 'sanitizeHistory: 배열 아님');

  // #d= (이름만, 결과·심지 없음)
  const enc = CORE.encodeShare({ names: ['민준', 'Маша', 'สมชาย', 'Lea'] });
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeShare: base64url 아님');
  eq(CORE.decodeShare(enc), { names: ['민준', 'Маша', 'สมชาย', 'Lea'] }, '#d= 왕복(UTF-8)');
  const raw = JSON.parse(Buffer.from(enc.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  eq(Object.keys(raw).sort(), ['m', 'v'], '#d= 에는 이름·버전만(결과·심지 없음)');
  eq(CORE.encodeShare({ names: ['A'] }), null, 'encodeShare: 1명은 null');
  eq(CORE.encodeShare({ names: Array.from({ length: 13 }, (_, i) => 'P' + i) }), null, 'encodeShare: 13명은 null');
  const mk = (o) => CORE.b64urlEncode(JSON.stringify(Object.assign({ v: 1, m: ['A', 'B', 'C'] }, o)));
  eq(CORE.decodeShare(mk({})), { names: ['A', 'B', 'C'] }, 'decode 기본');
  [['버전', { v: 2 }], ['이름 1명', { m: ['A'] }], ['이름 13명', { m: Array.from({ length: 13 }, (_, i) => 'P' + i) }], ['이름 형식', { m: ['A', 3] }],
    ['긴 이름', { m: ['A', 'x'.repeat(40)] }], ['결과 끼워 넣기', { r: 2 }], ['심지 끼워 넣기', { ms: 20000 }], ['빈 이름만', { m: [' ', ''] }]].forEach(([nm, o]) => {
    if (CORE.decodeShare(mk(o))) bad(`decodeShare: ${nm} 를 거절해야 함`);
  });
  const dirty = CORE.decodeShare(mk({ m: ['<img src=x onerror=1>Al', 'B'] }));
  if (!dirty) bad('decodeShare: 정리할 수 있는 이름은 받아야 함');
  else if (/[<>]/.test(dirty.names.join(''))) bad('decodeShare: 꺾쇠가 정리되지 않음');
  ['', 'abc$', '!!!', 'e30', null, 123, 'x'.repeat(3000), CORE.b64urlEncode('not json'), CORE.b64urlEncode('[1,2]')].forEach((str) => { if (CORE.decodeShare(str)) bad(`decodeShare 쓰레기 값 허용: ${String(str).slice(0, 10)}`); });
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
const NOT_FAMILY = /kiss|bisou|küss|beij|bacio|besar|beso|поцел|키스|뽀뽀|キス|亲吻|接吻|จูบ|hôn|beer|bière|bier|cerveza|birra|cerveja|пив|맥주|ビール|啤酒|เบียร์|bia|shot|vodka|водк|소주|술|お酒|喝酒|เหล้า|rượu|alcohol|alcool|alkohol|алкогол|strip|undress|ausziehen|déshabill|desnud|spogli|tirar a roupa|раздева|벗|脱|ถอด|cởi/i;
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
    walk(T, (s, p) => { if (/^(privacy|faq|missions)\./.test(p)) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.start', 'ui.modeFree', 'ui.modeNames', 'ui.holding', 'ui.passTo', 'ui.pausedText', 'result.again', 'result.loserSub', 'errors.namesTooFew'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
      if (T.missions.some((m, i) => m === EN.missions[i])) bad(`${tag} 벌칙 미션이 en 과 같음`);
    }
    // 벌칙 미션 12장
    const M = T.missions;
    if (!Array.isArray(M) || M.length !== 12) bad(`${tag} missions 12장 (${M && M.length})`);
    else {
      if (new Set(M.map((x) => x.toLowerCase())).size !== M.length) bad(`${tag} missions 중복`);
      M.forEach((x, i) => {
        if (typeof x !== 'string' || !x.trim() || len(x) > 90) bad(`${tag} missions[${i}] 비었거나 90자 넘음: ${x}`);
        if (/[<>{}]/.test(x)) bad(`${tag} missions[${i}] HTML·자리표시자`);
        if (NOT_FAMILY.test(x)) bad(`${tag} missions[${i}] 가족용이 아닌 문구(키스·술·벗기 류): ${x}`);
      });
    }
    // 360px 폭 문구 (버튼·라벨·세그먼트)
    const W = [['ui.start', 26], ['ui.modeFree', 20], ['ui.modeNames', 20], ['ui.modeLabel', 34], ['ui.namesLabel', 40], ['ui.fuseLabel', 34],
      ['ui.fuseShort', 10], ['ui.fuseNormal', 10], ['ui.fuseLong', 10], ['ui.hintsLabel', 34], ['ui.missionsLabel', 34], ['ui.stop', 10], ['ui.resume', 24],
      ['ui.pausedTitle', 20], ['ui.boom', 12], ['ui.bannerShort', 40], ['ui.bannerNormal', 40], ['ui.bannerLong', 40], ['ui.holdingFree', 44], ['ui.passFree', 26],
      ['result.again', 24], ['result.edit', 30], ['result.shareNames', 34], ['result.kicker', 20], ['result.freeTitle', 24], ['result.missionTitle', 24],
      ['result.history', 26], ['result.historyClear', 12], ['result.historyFree', 20]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    CORE.FUSE_KEYS.forEach((k) => { const r = fmt(T.ui.fuseRange, { a: CORE.FUSES[k][0] / 1000, b: CORE.FUSES[k][1] / 1000 }); if (width(r) > 13) bad(`${tag} ui.fuseRange 가 김: ${r}`); });
    if (width(fmt(T.ui.namesCount, { n: 12 })) > 14) bad(`${tag} ui.namesCount 가 김: ${T.ui.namesCount}`);
    if (width(fmt(T.ui.passCount, { p: 999 })) > 22) bad(`${tag} ui.passCount 가 김: ${T.ui.passCount}`);
    if (width(fmt(T.result.historyMeta, { s: '79.9', p: 999 })) > 24) bad(`${tag} result.historyMeta 가 김: ${T.result.historyMeta}`);
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking|順位|排名|рейтинг/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
      if (T.missions.some((m) => f.a.includes(m) || f.q.includes(m))) bad(`${tag} faq[${i}] 에 벌칙 미션 인용 (스포일러)`);
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
// 미션 문구가 PAGE_I18N 밖(보이는 HTML·메타·OG)에 있으면 목록 노출(스포일러)
function missionLeak(tag, html, lang) {
  const outside = stripRuntime(html);
  const M = L10N[lang].missions;
  const leaked = M.filter((m) => outside.includes(m) || outside.includes(G.esc(m)));
  if (leaked.length) bad(`${tag} 벌칙 미션 ${leaked.length}장이 PAGE_I18N 밖(보이는 HTML·메타)에 있음 (목록 노출 금지): ${leaked[0]}`);
  // 다른 언어의 미션도 새지 않게
  G.LOCALES.forEach(({ code }) => { if (code !== lang && L10N[code].missions.some((m) => outside.includes(m))) bad(`${tag} 다른 언어(${code}) 미션 문구가 보이는 HTML 에 있음`); });
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
  if (!/<link rel="canonical" href="https:\/\/bomb\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bomb\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((x, i) => i && x < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
  missionLeak(tag, html, lang);
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
      if ((html.match(/<section[\s>]/g) || []).length !== 2) bad(`${tag} section 은 시작·게임 화면 2개`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (!/<section id="screen-play" class="bm-screen bm-play" hidden>/.test(html)) bad(`${tag} 게임 화면은 처음에 hidden`);
      if (html.indexOf('id="screen-setup"') > html.indexOf('id="screen-play"')) bad(`${tag} 시작 화면이 게임 화면보다 먼저여야 함`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="bm-h1">/.test(S)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const inOrder = (X, ids, what) => { const at = ids.map((s) => X.indexOf(s)); if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${tag} ${what} 순서가 아님`); };
      inOrder(S, ['class="bm-h1"', 'class="bm-hook"', 'id="mode-free"', 'id="mode-names"', 'id="names-box"', 'id="names"', 'id="fuse-short"', 'id="fuse-normal"', 'id="fuse-long"', 'id="hints"', 'id="missions"', 'id="error"', 'id="start-btn"', 'class="bm-fair"', 'class="mg-ad mg-ad-start"'],
        '시작 화면(h1 → 훅 → 누가 → 이름 → 심지 → 힌트·벌칙 → 불붙이기 → 광고)');
      inOrder(P, ['id="play-banner"', 'id="mute-btn"', 'id="stop-btn"', 'id="holder"', 'id="bomb-btn"', 'id="pass-msg"', 'id="pass-count"', 'id="paused"', 'id="resume-btn"', 'id="boom"', 'id="live"', 'id="result"', 'id="result-card"', 'id="res-title"', 'id="mission-card"', 'id="edit-btn"', 'id="link-btn"', 'id="history"', '<div data-mg-end="bomb"></div>'],
        '게임 화면(안내 → 폭탄 → 넘기기 → 멈춤 → 펑 → 결과 → 기록 → 공통 끝 화면)');
      if (!/<div id="result" class="bm-result" hidden>/.test(P)) bad(`${tag} 결과(#result)는 처음에 hidden`);
      if (!/<div id="paused" class="bm-paused" hidden>/.test(P) || !/<div id="boom" class="bm-boom" aria-hidden="true" hidden>/.test(P) || !/<div id="names-box" class="bm-names" hidden>/.test(S)) bad(`${tag} 멈춤·펑·이름 칸은 처음에 hidden`);
      if (!/<div id="result"[\s\S]*?<div data-mg-end="bomb"><\/div>\s*<\/div>\s*<\/section>$/.test(P)) bad(`${tag} data-mg-end="bomb" 는 결과(#result) 안의 마지막 요소여야 함`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/id="mode-free" role="radio" aria-checked="true"/.test(S) || (S.match(/role="radio"/g) || []).length !== 5) bad(`${tag} 라디오 5개(누가 2 + 심지 3), 기본 = 그냥 하기`);
      if (!/id="fuse-normal" role="radio" aria-checked="true"/.test(S)) bad(`${tag} 기본 심지 = 보통`);
      CORE.FUSE_KEYS.forEach((k) => { if (!S.includes(G.esc(fmt(T.ui.fuseRange, { a: CORE.FUSES[k][0] / 1000, b: CORE.FUSES[k][1] / 1000 })))) bad(`${tag} 심지(${k}) 범위 문구가 bomb-core 와 다름`); });
      if (/id="(hints|missions)" role="switch" checked/.test(S)) bad(`${tag} 힌트·벌칙은 기본 꺼짐`);
      if (!/id="error" class="bm-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="live" class="visually-hidden" aria-live="assertive"/.test(P) || !/id="pass-msg" class="bm-pass" aria-live="polite"/.test(P)) bad(`${tag} 읽어 주기(aria-live) 없음`);
      // 벌칙 미션: 칸은 빈 문단 하나(한 장씩만), PAGE_I18N 안에만 12장
      const mc = (P.match(/<div id="mission-card"[\s\S]*?<\/div>/) || [''])[0];
      if (!/<p id="mission-text" class="bm-mission-text"><\/p>/.test(mc) || /<(ul|ol|li)[\s>]/.test(mc) || (mc.match(/<p[\s>]/g) || []).length !== 1) bad(`${tag} 미션 칸은 빈 문단 1개뿐이어야 함(목록 금지)`);
      if (!/<div id="mission-card" class="bm-mission" hidden>/.test(P)) bad(`${tag} 미션 칸은 처음에 hidden`);
      const rt = (html.match(/<script>window\.PAGE_I18N = ([\s\S]*?);?<\/script>/) || [])[1];
      let runtime = null;
      try { runtime = JSON.parse(rt); } catch (e) { bad(`${tag} PAGE_I18N JSON 읽기 실패`); }
      if (runtime && JSON.stringify(runtime.missions) !== JSON.stringify(T.missions)) bad(`${tag} PAGE_I18N.missions 가 언어 파일과 다름`);
      if (runtime && /total|fuseMs|boomAt/.test(Object.keys(runtime).join())) bad(`${tag} PAGE_I18N 에 심지 시간 같은 값이 있음`);
      if (/mg-faq|<details/.test(S + P)) bad(`${tag} 화면에 FAQ`);
      if (T.faq.some((q) => stripRuntime(html).includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('bomb-core.js') < 0 || html.indexOf('bomb-core.js') > html.indexOf('bomb.js"')) bad(`${tag} bomb-core.js 가 bomb.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
      const gf = fileOf(lang, 'guide.html');
      if (fs.existsSync(path.join(SITE, gf))) missionLeak(`[${lang}] ${gf}`, read(gf), lang);
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://bomb.example.com/</loc>') || !sm.includes('<loc>https://bomb.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 가이드 글(원본)에도 미션 문구 없음
  G.LOCALES.forEach(({ code: lang }) => {
    const gp = path.join(SITE, 'tools', 'guide', `${lang}.js`);
    if (!fs.existsSync(gp)) { bad(`가이드 ${lang} 없음`); return; }
    const gtxt = JSON.stringify(require(gp));
    if (L10N[lang].missions.some((m) => gtxt.includes(m))) bad(`[${lang}] 가이드 글에 벌칙 미션 문구가 있음 (스포일러)`);
    const ogTxt = JSON.stringify([L10N[lang].og, L10N[lang].meta, L10N[lang].hero, L10N[lang].faq, APP.desc[lang]]);
    if (L10N[lang].missions.some((m) => ogTxt.includes(m))) bad(`[${lang}] OG·메타·소개·FAQ·포털 설명에 벌칙 미션 문구가 있음`);
  });
  const readme = fs.existsSync(path.join(SITE, 'README.md')) ? read('README.md') : '';
  if (!readme) bad('README.md 없음');
  else if (G.LOCALES.some(({ code }) => L10N[code].missions.some((m) => readme.includes(m)))) bad('README.md 에 벌칙 미션 문구가 있음');
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'bomb.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js) || /'[A-Z][a-z]+ [a-z]+[^']*'/.test(js)) bad('bomb.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("bomb.js: track('start') 는 불붙이기 1곳, track('done') 은 펑 1곳");
  const fnBody = (name) => { const i = js.indexOf(`function ${name}(`); return i < 0 ? '' : js.slice(i, js.indexOf('\n  }\n', i)); };
  if (!fnBody('startGame').includes("track('start')")) bad("bomb.js: track('start') 는 startGame 안에");
  if (!fnBody('explode').includes("track('done')")) bad("bomb.js: track('done') 은 explode(펑) 안에");
  if (/Math\.random/.test(js)) bad('bomb.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('bomb.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if (!/addEventListener\('visibilitychange'[^\n]*pause\(\)/.test(js) || !fnBody('pause').includes('CORE.fusePause(') || !fnBody('resume').includes('CORE.fuseStart(')) bad('bomb.js: 탭이 숨으면(visibilitychange) 심지 멈춤(fusePause), 계속하기에서 다시(fuseStart)');
  if (!/drawFuse\([\s\S]*planTicks\([\s\S]*fuseStart\(/.test(fnBody('startGame'))) bad('bomb.js: 불붙일 때 심지 길이(drawFuse) → 박자(planTicks) → 시계 시작(fuseStart) 순서가 아님');
  if ((js.match(/new AC\(/g) || []).length !== 1 || !fnBody('ensureAudio').includes('new AC(')) bad('bomb.js: AudioContext 는 ensureAudio 안에서만 만든다');
  const ensureCalls = js.split('\n').filter((l) => /ensureAudio\(\)/.test(l) && !/function ensureAudio/.test(l)).length;
  if (ensureCalls !== 2 || !fnBody('startGame').includes('ensureAudio()') || !fnBody('resume').includes('ensureAudio()')) bad('bomb.js: 소리는 사용자 동작(불붙이기·계속하기) 뒤에만 준비');
  if (!/navigator\.vibrate\)/.test(js)) bad('bomb.js: 진동은 navigator.vibrate 가 있을 때만');
  if (/fuse\.total/.test(fnBody('step') + fnBody('pass') + fnBody('renderHolder') + fnBody('startGame').replace('CORE.planTicks(fuse.total)', ''))) bad('bomb.js: 심지 길이(fuse.total)를 게임 중 화면에 쓰면 안 됨');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`bomb.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('bomb.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('bomb.js: #d= 이름 링크 불러오기 없음');
  if (!/mgCleanUrl/.test(js)) bad('bomb.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*(?!\s*'')/.test(js)) bad("bomb.js: 사용자 글자를 innerHTML 로 넣지 않는다(textContent 만, innerHTML = '' 만 허용)");
  if ((js.match(/MISSIONS\[/g) || []).length !== 1 || !fnBody('explode').includes('MISSIONS[CORE.nextMission(')) bad('bomb.js: 벌칙 미션은 펑 때 덱에서 한 장만 꺼낸다(목록으로 그리지 않음)');
  const core = fs.readFileSync(path.join(SITE, 'bomb-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('bomb-core.js 는 crypto.getRandomValues 만 써야 함');
  const css = fs.readFileSync(path.join(SITE, 'style.css'), 'utf8');
  if (!/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.bm-boom \{ animation: bm-fade/.test(css)) bad('style.css: 움직임 줄이기면 펑은 짧은 번쩍임(bm-fade)만');
  if (!/\.bm-boom \{[^}]*max-width: var\(--app-width\)/.test(css)) bad('style.css: 펑 전체 화면은 앱 폭(--app-width) 안');
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
  if (APP.id !== 'bomb' || APP.category !== 'vote' || APP.path !== 'https://bomb.example.com/' || APP.added !== '2026-10-24' || APP.emoji !== '💣' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
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
console.log(`\n폭탄 돌리기 로직·공정성(카이제곱: 심지 3종 15칸 + 첫 사람 2~12명)·심지 시계(멈춤·재개)·째깍 박자(빨라짐·예측 불가)·넘기기·벌칙 덱·#d= 왕복/변조 거절 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
if (passed.length) console.log(`  ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 터지는 시각 먼저 정하기(crypto 거부 샘플링, 범위 안 균등)·멈춤 시계·예측할 수 없는 박자·넘기기·벌칙 덱(목록 노출 없음)·기록·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·미션·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·결과 안 data-mg-end), OG 이미지 모두 OK');
