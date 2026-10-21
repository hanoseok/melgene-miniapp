#!/usr/bin/env node
/**
 * 동물 달리기 시합 검사.
 *   1) 로직(race-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), Fisher–Yates(주입 난수), 도착 순서 = 순열,
 *      공정성 카이제곱(p = 0.001): 인원 2~10명마다 1등 레인·꼴찌 레인이 고르게 · 4명 24가지 순서 전체가 고르게 · 레인별 등수 분포 ·
 *      실제 흐름(finishOrder → planRace → 위치를 시간으로 따라가 결승선을 넘는 순서)으로 본 1등도 고르게,
 *      연출 계획: 위치 0→1 단조 증가, 도착 시각에 정확히 1, 화면 속 도착 순서 = 정한 순서(모든 인원·모드), 1등 6.0~7.6초·전체 9초 이내,
 *      승부 자리(win: 1·2등, lose: 꼴찌·그 앞) 차이 0.03~0.1초, 선두가 바뀌는 경기가 대부분(극적), 모드가 순위 확률을 바꾸지 않음,
 *      이름 정리(빈 칸 → 기본 이름, 중복 " 2", 꺾쇠·제어 문자), 인원 한도, 기록 10개·손상된 기록 버림, #d= 왕복/변조 거절(결과 없음).
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, 번역됨, FAQ 3~5개(getRandomValues, "무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴(th/vi/ru/zh/라틴), ru 는 «ты», 한글은 ko 파일만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 시작 화면(#screen-setup) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 순서, 경주 화면(#screen-race)·결과(#result) 처음 hidden, 결과 안 마지막이 data-mg-end="race", FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, race.js 규칙.
 *
 * 실행: node tools/check-race.js   (tools/check-all.js 가 apps/race 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'race-core.js'));
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
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32, 8: 26.12, 9: 27.88, 23: 49.73 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
const passed = [];
// 계획을 시간으로 따라가며(2ms 간격) 결승선(위치 1)을 넘는 순서를 직접 잰다
function crossingOrder(plan) {
  const at = [];
  for (let i = 0; i < plan.n; i++) {
    let t = 0;
    while (CORE.positionAt(plan, i, t) < 1 && t < 20000) t += 2;
    at.push([t, i]);
  }
  return at.sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[1]);
}
function checkLogic() {
  eq([CORE.MIN_RUNNERS, CORE.MAX_RUNNERS, CORE.DEFAULT_RUNNERS, CORE.MAX_NAME, CORE.HISTORY_MAX], [2, 10, 4, 14, 10], '한도');
  eq([CORE.WIN_MIN_MS, CORE.WIN_MAX_MS, CORE.MAX_TOTAL_MS, CORE.CLOSE_MIN_MS, CORE.CLOSE_MAX_MS], [6000, 7600, 9000, 30, 100], '연출 한도(1등 6~7.6초, 전체 9초, 접전 0.03~0.1초)');
  if (CORE.ANIMALS.length !== CORE.MAX_RUNNERS || new Set(CORE.ANIMALS).size !== CORE.MAX_RUNNERS) bad('ANIMALS 는 서로 다른 10개');
  // 거부 샘플링
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit(4294967290) 이상 버림');
  eq(CORE.uniformInt(10, seq([4294967289])), 4294967289 % 10, 'uniformInt(10): limit-1 은 받음');
  eq(CORE.uniformInt(3, seq([4294967295, 4294967294])), 4294967294 % 3, 'uniformInt(3): 4294967295 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');
  eq(CORE.shuffle([1, 2, 3, 4], (m) => m - 1), [1, 2, 3, 4], 'shuffle j=i 면 그대로');
  eq(CORE.shuffle([1, 2, 3, 4], () => 0), [2, 3, 4, 1], 'shuffle j=0');
  for (let n = 2; n <= 10; n++) {
    const o = CORE.finishOrder(n);
    if (o.slice().sort((a, b) => a - b).join() !== Array.from({ length: n }, (_, i) => i).join()) bad(`finishOrder(${n}) 가 순열이 아님: ${o}`);
  }

  // 공정성 (a) 인원마다 1등 레인·꼴찌 레인 고르게
  for (let n = CORE.MIN_RUNNERS; n <= CORE.MAX_RUNNERS; n++) {
    const first = new Array(n).fill(0);
    const last = new Array(n).fill(0);
    const N = 4000 * n;
    for (let k = 0; k < N; k++) { const o = CORE.finishOrder(n); first[o[0]]++; last[o[n - 1]]++; }
    const x1 = chi(first);
    const x2 = chi(last);
    if (x1 > CHI_001[n - 1]) bad(`공정성 ${n}명 1등 레인: 카이제곱 ${x1.toFixed(2)} > ${CHI_001[n - 1]}`);
    if (x2 > CHI_001[n - 1]) bad(`공정성 ${n}명 꼴찌 레인: 카이제곱 ${x2.toFixed(2)} > ${CHI_001[n - 1]}`);
    passed.push(`${n}:${x1.toFixed(1)}/${x2.toFixed(1)}`);
  }
  // (b) 4명: 24가지 순서 전체 고르게 + 레인별 등수 분포 고르게
  const perm = {};
  const rankByLane = [0, 1, 2, 3].map(() => new Array(4).fill(0));
  for (let k = 0; k < 48000; k++) {
    const o = CORE.finishOrder(4);
    perm[o.join('')] = (perm[o.join('')] || 0) + 1;
    o.forEach((lane, r) => rankByLane[lane][r]++);
  }
  const pc = Object.values(perm);
  if (pc.length !== 24) bad(`4명 순서가 24가지가 아님 (${pc.length})`);
  const xp = chi(pc);
  if (xp > CHI_001[23]) bad(`공정성 4명 순서 24가지: 카이제곱 ${xp.toFixed(2)} > ${CHI_001[23]}`);
  rankByLane.forEach((c, lane) => { const x = chi(c); if (x > CHI_001[3]) bad(`공정성 4명 레인 ${lane + 1} 등수 분포: 카이제곱 ${x.toFixed(2)}`); });
  // (c) 실제 흐름: 순서 → 연출 계획 → 위치를 따라가 잰 결승 순서 = 정한 순서, 그 1등이 고르게(6명, 모드 번갈아)
  const flowFirst = new Array(6).fill(0);
  for (let k = 0; k < 3000; k++) {
    const o = CORE.finishOrder(6);
    const p = CORE.planRace(o, k % 2 ? 'lose' : 'win');
    let first = -1;
    let ft = Infinity;
    p.runners.forEach((R) => { if (R.finish < ft) { ft = R.finish; first = R.lane; } });
    if (first !== o[0]) { bad(`흐름: 가장 먼저 도착하는 레인 ${first} ≠ 정한 1등 ${o[0]}`); break; }
    flowFirst[first]++;
  }
  const xf = chi(flowFirst);
  if (xf > CHI_001[5]) bad(`공정성 흐름(6명) 1등: 카이제곱 ${xf.toFixed(2)}`);

  // (d) 연출 계획: 단조·도착 시각·순서·시간 한도·접전·선두 바뀜
  let races = 0;
  let leadChange = 0;
  let multi = 0;
  for (let n = CORE.MIN_RUNNERS; n <= CORE.MAX_RUNNERS; n++) {
    ['win', 'lose'].forEach((mode) => {
      for (let k = 0; k < 60; k++) {
        const o = CORE.finishOrder(n);
        const p = CORE.planRace(o, mode);
        races++;
        if (p.winMs < 6000 || p.winMs > 7600 || p.total > 9000) bad(`planRace ${n}명 ${mode}: 1등 ${p.winMs}ms / 전체 ${p.total}ms (6000~7600 / ≤ 9000)`);
        const fin = o.map((lane) => p.runners[lane].finish);
        for (let r = 1; r < n; r++) {
          const g = fin[r] - fin[r - 1];
          if (!(g >= 30)) bad(`planRace ${n}명 ${mode}: ${r}등↔${r + 1}등 차이 ${g}ms (30ms 이상)`);
        }
        const close = mode === 'lose' ? fin[n - 1] - fin[n - 2] : fin[1] - fin[0];
        if (close < 30 || close > 100) bad(`planRace ${n}명 ${mode}: 승부 자리 차이 ${close}ms (30~100)`);
        if (k < 8) {
          const got = crossingOrder(p);
          if (got.join() !== o.join()) bad(`planRace ${n}명 ${mode}: 화면 속 도착 순서 ${got} ≠ 정한 순서 ${o}`);
          for (let i = 0; i < n; i++) {
            let prev = -1;
            const R = p.runners[i];
            for (let t = 0; t <= R.finish + 200; t += 25) {
              const x = CORE.positionAt(p, i, t);
              if (x < prev - 1e-12 || x < 0 || x > 1) { bad(`positionAt 단조/범위 위반 ${n}명 레인 ${i} t=${t}: ${x}`); break; }
              if (t > 0 && t < R.finish && !(x < 1)) { bad(`positionAt 도착 전 위치가 1 ${n}명 레인 ${i} t=${t}`); break; }
              prev = x;
            }
            if (CORE.positionAt(p, i, 0) !== 0 || CORE.positionAt(p, i, R.finish) !== 1) bad(`positionAt 시작 0·도착 1 이 아님 ${n}명 레인 ${i}`);
            if (CORE.fxAt(p, i, R.finish) !== 'done') bad('fxAt 도착 = done');
          }
        }
        if (n >= 3) {
          let prevL = -1;
          let c = 0;
          for (let t = 500; t <= p.total; t += 50) { const l = CORE.leaderAt(p, t); if (prevL >= 0 && l !== prevL) c++; prevL = l; }
          multi++;
          if (c > 0) leadChange++;
        }
      }
    });
  }
  const lcRate = leadChange / multi;
  if (lcRate < 0.7) bad(`극적 연출: 선두가 바뀌는 경기 ${(lcRate * 100).toFixed(0)}% (70% 이상)`);
  passed.push(`lead:${(lcRate * 100).toFixed(0)}%`);
  let threw2 = false;
  try { CORE.planRace([0], 'win'); } catch (e) { threw2 = true; }
  if (!threw2) bad('planRace: 1명은 오류');
  // 모드는 확률을 바꾸지 않는다: planRace 는 받은 순서를 그대로 쓴다
  const o5 = [3, 1, 4, 0, 2];
  eq(CORE.planRace(o5, 'lose').order, o5, 'planRace 는 순서를 바꾸지 않음(lose)');
  eq(CORE.planRace(o5, 'win').order, o5, 'planRace 는 순서를 바꾸지 않음(win)');

  // 이름 · 입력 검사
  const ph = (i) => `Player ${i + 1}`;
  eq(CORE.resolveNames(['', 'Bo', ' '], ph), ['Player 1', 'Bo', 'Player 3'], '빈 칸 → 기본 이름');
  eq(CORE.resolveNames(['Mina', 'mina', 'Mina'], ph), ['Mina', 'mina 2', 'Mina 3'], '이름 중복 → " 2" " 3"');
  eq(CORE.resolveNames(['<b>Al</b>', 'Bo\u0007b'], ph), ['b Al /b', 'Bo b'], '이름 꺾쇠·제어 문자 정리');
  eq(Array.from(CORE.resolveNames(['x'.repeat(40), 'B'], ph)[0]).length, CORE.MAX_NAME, '이름 14자 제한');
  eq(CORE.resolveNames(['Player 2', ''], ph), ['Player 2', 'Player 2 2'], '입력 이름과 기본 이름이 겹쳐도 구분');
  eq(CORE.validate({ names: ['A'] }).error, 'tooFew', '1명');
  eq(CORE.validate({ names: Array.from({ length: 11 }, () => '') }).error, 'tooMany', '11명');
  eq(CORE.validate({ names: ['', ''] }, ph).cfg, { mode: 'win', names: ['Player 1', 'Player 2'] }, '기본 모드 win + 기본 이름');
  eq(CORE.validate({ mode: 'lose', names: ['A', 'B'] }).cfg.mode, 'lose', '모드 lose');
  eq(CORE.validate({ names: ['x'.repeat(20), 'B'] }).longName, true, '긴 이름 표시');
  eq([CORE.clampCount(1), CORE.clampCount(11), CORE.clampCount('abc'), CORE.clampCount(5.4)], [2, 10, 4, 5], 'clampCount');

  // 기록
  let h = [];
  for (let k = 1; k <= 14; k++) h = CORE.pushHistory(h, { t: k, m: 'win', n: 3, who: 'N' + k });
  eq([h.length, h[0].who, h[9].who], [10, 'N14', 'N5'], '기록 10개, 최신이 맨 앞');
  eq(CORE.sanitizeHistory([{ t: 1, m: 'win', n: 3, who: 'A' }, { t: 'x', m: 'win', n: 3, who: 'B' }, { t: 2, m: 'tie', n: 3, who: 'C' }, { t: 3, m: 'lose', n: 11, who: 'D' }, { t: 4, m: 'lose', n: 2, who: '' }, null, 5, { t: 6, m: 'lose', n: 2, who: '<i>E' }]),
    [{ t: 1, m: 'win', n: 3, who: 'A' }, { t: 6, m: 'lose', n: 2, who: 'i E' }], 'sanitizeHistory: 모양이 틀린 기록은 버리고 이름 정리');
  eq(CORE.sanitizeHistory('nope'), [], 'sanitizeHistory: 배열 아님');

  // #d= (이름 칸 + 모드만, 결과 없음)
  const enc = CORE.encodeShare({ names: ['민준', '', 'Маша', 'สมชาย'], mode: 'lose' });
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeShare: base64url 아님');
  eq(CORE.decodeShare(enc), { names: ['민준', '', 'Маша', 'สมชาย'], mode: 'lose' }, '#d= 왕복(UTF-8, 빈 칸 유지)');
  const raw = JSON.parse(Buffer.from(enc.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));
  eq(Object.keys(raw).sort(), ['m', 'o', 'v'], '#d= 에는 이름·모드·버전만(결과 없음)');
  eq(CORE.encodeShare({ names: ['A'] }), null, 'encodeShare: 1명은 null');
  eq(CORE.encodeShare({ names: Array.from({ length: 11 }, (_, i) => 'P' + i) }), null, 'encodeShare: 11명은 null');
  const mk = (o) => CORE.b64urlEncode(JSON.stringify(Object.assign({ v: 1, m: ['A', 'B', 'C'], o: 'w' }, o)));
  eq(CORE.decodeShare(mk({})), { names: ['A', 'B', 'C'], mode: 'win' }, 'decode 기본');
  [['버전', { v: 2 }], ['이름 1명', { m: ['A'] }], ['이름 11명', { m: Array.from({ length: 11 }, (_, i) => 'P' + i) }], ['이름 형식', { m: ['A', 3] }],
    ['긴 이름', { m: ['A', 'x'.repeat(40)] }], ['모드 값', { o: 'x' }], ['모드 없음', { o: undefined }]].forEach(([nm, o]) => {
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
      ['meta.title', 'hero.hook', 'ui.start', 'ui.modeWin', 'ui.modeLose', 'ui.playerN', 'result.again', 'result.winTitle', 'result.loseSub', 'errors.tooFew'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·세그먼트·레인 이름)
    const W = [['ui.start', 26], ['ui.modeWin', 20], ['ui.modeLose', 20], ['ui.modeLabel', 34], ['ui.countLabel', 14], ['ui.namesLabel', 34], ['ui.go', 10],
      ['ui.bannerWin', 44], ['ui.bannerLose', 44], ['result.again', 24], ['result.edit', 30], ['result.shareNames', 34], ['result.winKicker', 34], ['result.loseKicker', 34],
      ['result.rankingTitle', 26], ['result.tagWin', 12], ['result.tagLose', 12], ['result.history', 26], ['result.historyClear', 12]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    if (width(fmt(T.ui.countValue, { n: 10 })) > 15) bad(`${tag} ui.countValue 가 김: ${T.ui.countValue}`);
    if (width(fmt(T.ui.playerN, { n: 10 })) > 14) bad(`${tag} ui.playerN 이 김(레인 이름 칸): ${T.ui.playerN}`);
    if (width(fmt(T.result.historyMeta, { n: 10 })) > 16) bad(`${tag} result.historyMeta 가 김: ${T.result.historyMeta}`);
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
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/race\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/race\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const RC = section(html, 'screen-race');
      if (!S || !RC) { bad(`${tag} 화면(#screen-setup / #screen-race) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 2) bad(`${tag} section 은 시작·경주 화면 2개`);
      if (/<section id="screen-setup"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (!/<section id="screen-race" class="rc-screen rc-race" hidden>/.test(html)) bad(`${tag} 경주 화면은 처음에 hidden`);
      if (html.indexOf('id="screen-setup"') > html.indexOf('id="screen-race"')) bad(`${tag} 시작 화면이 경주 화면보다 먼저여야 함`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="rc-h1">/.test(S)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const inOrder = (X, ids, what) => { const at = ids.map((s) => X.indexOf(s)); if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${tag} ${what} 순서가 아님`); };
      inOrder(S, ['class="rc-h1"', 'class="rc-hook"', 'id="mode-win"', 'id="mode-lose"', 'id="count-less"', 'id="count-out"', 'id="count-more"', 'id="entries"', 'id="error"', 'id="start-btn"', 'class="rc-fair"', 'class="mg-ad mg-ad-start"'],
        '시작 화면(h1 → 훅 → 모드 → 인원 → 이름 → 출발 → 광고)');
      inOrder(RC, ['id="race-banner"', 'id="track"', 'id="countdown"', 'id="live"', 'id="result"', 'id="result-card"', 'id="res-title"', 'id="ranking"', 'id="edit-btn"', 'id="link-btn"', 'id="history"', '<div data-mg-end="race"></div>'],
        '경주 화면(안내 → 트랙 → 결과 → 기록 → 공통 끝 화면)');
      if (!/<div id="result" class="rc-result" hidden>/.test(RC)) bad(`${tag} 결과(#result)는 처음에 hidden`);
      if (!/<div id="result"[\s\S]*?<div data-mg-end="race"><\/div>\s*<\/div>\s*<\/section>$/.test(RC)) bad(`${tag} data-mg-end="race" 는 결과(#result) 안의 마지막 요소여야 함`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/id="mode-win" role="radio" aria-checked="true"/.test(S) || (S.match(/role="radio"/g) || []).length !== 2) bad(`${tag} 모드 라디오 2개, 기본 = 1등 승리`);
      if (!S.includes(`>${G.esc(fmt(T.ui.countValue, { n: CORE.DEFAULT_RUNNERS }))}</output>`)) bad(`${tag} 기본 인원 표시(${CORE.DEFAULT_RUNNERS}명)`);
      if (!/id="error" class="rc-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(RC)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S + RC)) bad(`${tag} 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('race-core.js') < 0 || html.indexOf('race-core.js') > html.indexOf('race.js"')) bad(`${tag} race-core.js 가 race.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://race.example.com/</loc>') || !sm.includes('<loc>https://race.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  G.LOCALES.forEach(({ code: lang }) => { if (!fs.existsSync(path.join(SITE, 'tools', 'guide', `${lang}.js`))) bad(`가이드 ${lang} 없음`); });
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'race.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js) || /'[A-Z][a-z]+ [a-z]+[^']*'/.test(js)) bad('race.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("race.js: track('start') 는 출발 1곳, track('done') 은 결과 1곳");
  if (js.indexOf("track('start')") > js.indexOf('function run()')) bad("race.js: track('start') 는 달리기(run) 전에");
  if (js.indexOf("track('done')") < js.indexOf('function finishRace()')) bad("race.js: track('done') 은 결과(finishRace) 안에");
  if (/Math\.random/.test(js)) bad('race.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('race.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if (!/requestAnimationFrame/.test(js)) bad('race.js: requestAnimationFrame 애니메이션 없음');
  if (!/finishOrder\([\s\S]*planRace\([\s\S]*requestAnimationFrame/.test(js)) bad('race.js: 순서(finishOrder) → 연출 계획(planRace) → 애니메이션 순서가 아님');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`race.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('race.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('race.js: #d= 이름 링크 불러오기 없음');
  if (!/mgCleanUrl/.test(js)) bad('race.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*(?!\s*'')/.test(js)) bad("race.js: 사용자 글자를 innerHTML 로 넣지 않는다(textContent 만, innerHTML = '' 만 허용)");
  const core = fs.readFileSync(path.join(SITE, 'race-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('race-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'race' || APP.category !== 'vote' || APP.path !== 'https://race.example.com/' || APP.added !== '2026-10-22' || APP.emoji !== '🏁' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 160) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (width(APP.title[code]) > 24) bad(`app.config.js ${code} 포털 이름이 김 (폭 ${width(APP.title[code])})`);
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
console.log(`\n동물 달리기 시합 로직·공정성(카이제곱: 인원 2~10명 1등/꼴찌 ${passed.length - 1}종 + 4명 순서 24가지 + 레인별 등수 + 흐름 1등)·연출 계획(단조·도착 순서·시간·접전·선두 바뀜)·#d= 왕복/변조 거절 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
if (passed.length) console.log(`  인원:카이제곱(1등/꼴찌) ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 순위 먼저 정하기(crypto 거부 샘플링 + Fisher–Yates)·공정성·연출 계획(정한 순서대로 도착)·이름·기록·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·결과 안 data-mg-end), OG 이미지 모두 OK');
