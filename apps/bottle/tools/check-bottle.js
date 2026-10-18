#!/usr/bin/env node
/**
 * 병 돌리기 검사.
 *   1) 로직(bottle-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), Fisher–Yates(주입 난수), 입력 검사(모드·이름 2~12·
 *      이름 정리/중복·미션 목록), 각도 ↔ 자리 왕복(칸 중심·경계·흔들기 ±OFFSET_SPREAD·음수·360 넘는 각도, 2~12명 모두),
 *      회전 계획(시계/반시계, 바퀴 수, 최종 각도가 목표와 같은 자리), 돌리기 계획(3~6초, 4~7바퀴), ease 단조,
 *      공정성 카이제곱: 자리 2~12명 각각 고르게(p≈0.001) · 실제 흐름(자리 → 목표 각도 → 회전 → angleToSeat) 그대로 고르게 ·
 *      그냥 돌리기 각도 12구간 고르게 · 겹치지 않기(한 라운드에 모두 한 번씩, 첫 번째로 뽑히는 사람 고르게, 다음 라운드),
 *      미션 덱(다 쓰기 전 반복 없음, 다시 섞을 때 바로 반복 없음), 기록 10개, #d= 왕복/변조 거절.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, "무료인가요?" 류 금지),
 *      미션 카드 12개 안팎(짧게, 중복 없음, HTML 없음), 제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, 글꼴(th/vi/ru/zh), 한글은 ko 파일만.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-bottle) 마지막 요소 = mg-ad-start 정확히 1개, 페이지 전체 mg-ad 1개 /
 *      화면 순서, 결과(#result) 처음 hidden 이고 그 안 마지막이 data-mg-end="bottle", FAQ 는 MG_FAQ 로만, 미션 카드는 PAGE_I18N 밖(보이는 HTML)에 없음, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), 가이드 글에 미션 카드 인용 없음, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크, bottle.js 규칙.
 *
 * 실행: node tools/check-bottle.js   (tools/check-all.js 가 apps/bottle 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bottle-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001): 자유도 → 값
const CHI_001 = { 1: 10.83, 2: 13.82, 3: 16.27, 4: 18.47, 5: 20.52, 6: 22.46, 7: 24.32, 8: 26.12, 9: 27.88, 10: 29.59, 11: 31.26 };
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
const passed = [];
function checkLogic() {
  eq([CORE.MIN_SEATS, CORE.MAX_SEATS, CORE.MAX_NAME, CORE.MAX_PROMPTS, CORE.MAX_PROMPT, CORE.HISTORY_MAX], [2, 12, 16, 30, 80, 10], '한도');
  eq([CORE.MIN_MS, CORE.MAX_MS, CORE.MIN_TURNS, CORE.MAX_TURNS], [3000, 6000, 4, 7], '연출 한도(3~6초, 4~7바퀴)');
  if (!(CORE.OFFSET_SPREAD > 0 && CORE.OFFSET_SPREAD < 0.5)) bad('OFFSET_SPREAD 는 0 < x < 0.5 (칸 밖으로 나가면 안 됨)');
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

  // 입력 검사
  const v = (o) => CORE.validate(o);
  eq(v({}).ok && v({}).cfg.mode, 'free', 'validate 기본 = 그냥 돌리기');
  eq(v({ mode: 'names', names: 'Solo' }).error, 'namesTooFew', '이름 1명');
  eq(v({ mode: 'names', names: '' }).error, 'namesTooFew', '이름 없음');
  eq(v({ mode: 'names', names: Array.from({ length: 13 }, (_, i) => 'P' + i).join('\n') }).error, 'namesTooMany', '이름 13명');
  eq(v({ mode: 'names', names: Array.from({ length: 13 }, (_, i) => 'P' + i).join('\n') }).n, 13, '이름 13명 n');
  eq(v({ mode: 'names', names: Array.from({ length: 12 }, (_, i) => 'P' + i).join('\n') }).ok, true, '이름 12명');
  eq(v({ mode: 'names', names: 'Mina\nJoon\nMina\n \n' }).cfg.names, ['Mina', 'Joon', 'Mina 2'], '이름 중복 → " 2"');
  eq(v({ mode: 'names', names: 'A, B; C、D' }).cfg.names.length, 4, '이름 구분자 쉼표·세미콜론·、');
  eq(v({ mode: 'names', names: '<b>Al</b>\nBo\u0007b' }).cfg.names, ['b Al /b', 'Bo b'], '이름 꺾쇠·제어 문자 정리');
  eq(v({ mode: 'names', names: 'x'.repeat(40) + '\nB' }).cfg.names[0].length, CORE.MAX_NAME, '이름 16자 제한');
  eq(v({ mode: 'names', names: 'x'.repeat(40) + '\nB' }).longName, true, '긴 이름 표시');
  eq(v({ mode: 'free', names: 'Solo' }).ok, true, '그냥 돌리기는 이름 검사 안 함');
  eq(v({ prompts: true, promptSrc: 'custom', custom: '  \n ' }).error, 'promptsEmpty', '직접 쓴 미션 없음');
  eq(v({ prompts: true, promptSrc: 'custom', custom: 'Sing\nsing\nDance' }).cfg.custom, ['Sing', 'Dance'], '미션 중복 합치기');
  eq(v({ prompts: false, promptSrc: 'custom', custom: '' }).ok, true, '미션 꺼짐이면 검사 안 함');
  eq(CORE.parsePrompts(Array.from({ length: 40 }, (_, i) => 'M' + i).join('\n')).length, CORE.MAX_PROMPTS, '미션 30개 제한');
  eq(CORE.parsePrompts('y'.repeat(120))[0].length, CORE.MAX_PROMPT, '미션 80자 제한');
  eq(v({}).cfg.skip, true, '겹치지 않기 기본 켬'); eq(v({ skip: false }).cfg.skip, false, '겹치지 않기 끔');

  // 각도 ↔ 자리 (0° = 위, 시계 방향)
  for (let n = CORE.MIN_SEATS; n <= CORE.MAX_SEATS; n++) {
    const s = 360 / n;
    for (let i = 0; i < n; i++) {
      const c = CORE.seatAngle(i, n);
      if (CORE.angleToSeat(c, n) !== i) bad(`angleToSeat(중심) n=${n} i=${i}`);
      if (CORE.angleToSeat(c + 360 * 3, n) !== i || CORE.angleToSeat(c - 360 * 2, n) !== i) bad(`angleToSeat(여러 바퀴) n=${n} i=${i}`);
      if (CORE.angleToSeat(c - s / 2 + 1e-9, n) !== i) bad(`angleToSeat(칸 시작 직후) n=${n} i=${i}`);
      if (CORE.angleToSeat(c + s / 2 - 1e-6, n) !== i) bad(`angleToSeat(칸 끝 직전) n=${n} i=${i}`);
      if (CORE.angleToSeat(c + s / 2 + 1e-9, n) !== (i + 1) % n) bad(`angleToSeat(다음 칸 시작 직후) n=${n} i=${i}`);
      [-1, -0.5, 0, 0.5, 1].forEach((f) => {
        const t = CORE.targetAngle(i, n, f);
        if (!(t >= 0 && t < 360)) bad(`targetAngle 범위 n=${n} i=${i} f=${f}: ${t}`);
        if (CORE.angleToSeat(t, n) !== i) bad(`targetAngle → angleToSeat 왕복 n=${n} i=${i} f=${f}`);
      });
    }
  }
  eq(CORE.targetAngle(0, 4, 5), CORE.targetAngle(0, 4, 1), 'targetAngle frac 은 ±1 로 자름');
  // 회전 계획
  [[0, 90, 4, 1], [350, 10, 5, 1], [10, 350, 5, 1], [720.5, 0, 6, 1], [0, 90, 4, -1], [350, 10, 5, -1], [10, 350, 7, -1], [-123.4, 271.2, 4, -1]].forEach(([cur, tgt, turns, dir]) => {
    const to = CORE.planRotation(cur, tgt, turns, dir);
    const moved = (to - cur) * dir;
    if (Math.abs(CORE.norm(to) - CORE.norm(tgt)) > 1e-9 && Math.abs(Math.abs(CORE.norm(to) - CORE.norm(tgt)) - 360) > 1e-9) bad(`planRotation(${cur},${tgt},${turns},${dir}) 최종 각도 ${to} ≠ 목표`);
    if (!(moved >= turns * 360 && moved < (turns + 1) * 360)) bad(`planRotation(${cur},${tgt},${turns},${dir}) 회전량 ${moved} 이 ${turns}~${turns + 1} 바퀴가 아님`);
  });
  for (let k = 0; k < 2000; k++) {
    const p = CORE.spinPlan();
    if (p.ms < 3000 || p.ms > 6000 || p.turns < 4 || p.turns > 7 || p.turns % 1) { bad(`spinPlan 범위 밖: ${JSON.stringify(p)}`); break; }
  }
  let prev = -1;
  for (let t = 0; t <= 1.0001; t += 0.01) { const e = CORE.ease(t); if (e < prev - 1e-12) { bad('ease 가 단조 증가가 아님'); break; } prev = e; }
  eq([CORE.ease(0), CORE.ease(1)], [0, 1], 'ease(0)=0, ease(1)=1');
  if (!(CORE.ease(0.5) > 0.5)) bad('ease 는 감속(ease-out) — 절반 시간에 절반 넘게 가야 함');

  // 공정성 (a) 자리 2~12명: chooseSeat(겹치지 않기 끔) 고르게
  for (let n = CORE.MIN_SEATS; n <= CORE.MAX_SEATS; n++) {
    const st = CORE.newRound(n);
    const c = new Array(n).fill(0);
    const N = 3000 * n;
    for (let k = 0; k < N; k++) c[CORE.chooseSeat(st, false)]++;
    const x = chi(c);
    if (x > CHI_001[n - 1]) bad(`공정성 자리 ${n}명: 카이제곱 ${x.toFixed(2)} > ${CHI_001[n - 1]}`);
    else passed.push(`${n}:${x.toFixed(1)}`);
  }
  // (b) 실제 흐름 그대로: 자리 고르기 → 목표 각도(칸 안 흔들기) → 회전 계획 → 멈춘 각도로 자리 읽기 = 고른 자리, 그리고 고르게
  [3, 7, 12].forEach((n) => {
    const st = CORE.newRound(n);
    const c = new Array(n).fill(0);
    let rot = 0;
    for (let k = 0; k < 2500 * n; k++) {
      const seat = CORE.chooseSeat(st, false);
      const plan = CORE.spinPlan();
      rot = CORE.norm(CORE.planRotation(rot, CORE.targetAngle(seat, n, CORE.randomFrac()), plan.turns, k % 2 ? -1 : 1));
      const got = CORE.angleToSeat(rot, n);
      if (got !== seat) { bad(`흐름 n=${n}: 멈춘 자리 ${got} ≠ 고른 자리 ${seat}`); break; }
      c[got]++;
    }
    const x = chi(c);
    if (x > CHI_001[n - 1]) bad(`공정성 흐름 ${n}명: 카이제곱 ${x.toFixed(2)}`);
  });
  // (c) 그냥 돌리기: 각도 12구간 고르게, 범위 0~359.9
  const ac = new Array(12).fill(0);
  for (let k = 0; k < 36000; k++) { const a = CORE.randomAngle(); if (!(a >= 0 && a < 360)) { bad(`randomAngle 범위 ${a}`); break; } ac[Math.floor(a / 30)]++; }
  let x2 = chi(ac); if (x2 > CHI_001[11]) bad(`공정성 그냥 돌리기 각도: 카이제곱 ${x2.toFixed(2)}`);
  // (d) 흔들기 frac 은 −1~1 고르게(5구간)
  const fc = new Array(5).fill(0);
  for (let k = 0; k < 25000; k++) { const f = CORE.randomFrac(); fc[Math.min(4, Math.floor((f + 1) / 0.4))]++; }
  x2 = chi(fc); if (x2 > CHI_001[4] + 6) bad(`randomFrac 분포 치우침: 카이제곱 ${x2.toFixed(2)}`);
  // (e) 겹치지 않기: 한 라운드 n번에 모두 한 번씩, 다음 라운드 번호, 각 라운드 첫 사람 고르게
  for (let n = CORE.MIN_SEATS; n <= CORE.MAX_SEATS; n++) {
    const st = CORE.newRound(n);
    for (let r = 1; r <= 3; r++) {
      const got = [];
      for (let k = 0; k < n; k++) got.push(CORE.chooseSeat(st, true));
      if (got.slice().sort((a, b) => a - b).join() !== Array.from({ length: n }, (_, i) => i).join()) { bad(`겹치지 않기 n=${n} 라운드 ${r}: ${got.join(',')}`); break; }
      if (st.round !== r || st.left.length !== 0) bad(`겹치지 않기 n=${n}: 라운드 ${st.round} / 남음 ${st.left.length}`);
    }
  }
  const firsts = new Array(5).fill(0); const lasts = new Array(5).fill(0);
  for (let k = 0; k < 20000; k++) {
    const st = CORE.newRound(5);
    const order = [0, 1, 2, 3, 4].map(() => CORE.chooseSeat(st, true));
    firsts[order[0]]++; lasts[order[4]]++;
  }
  [['첫 번째', firsts], ['마지막', lasts]].forEach(([nm, arr]) => { const x = chi(arr); if (x > CHI_001[4]) bad(`공정성 겹치지 않기 ${nm}로 뽑히는 사람: 카이제곱 ${x.toFixed(2)}`); });
  // (f) 미션 덱
  const d = CORE.promptDeck(12);
  const firstRound = Array.from({ length: 12 }, () => CORE.nextPrompt(d));
  eq(firstRound.slice().sort((a, b) => a - b), Array.from({ length: 12 }, (_, i) => i), '미션 덱: 한 바퀴에 12장 모두 한 번씩');
  let repeat = false;
  let last = firstRound[11];
  for (let k = 0; k < 600; k++) { const nx = CORE.nextPrompt(d); if (nx === last) repeat = true; last = nx; }
  if (repeat) bad('미션 덱: 같은 카드가 연속으로 나옴');
  eq(CORE.nextPrompt(CORE.promptDeck(0)), -1, '미션 덱 빈 목록');
  eq(CORE.nextPrompt(CORE.promptDeck(1)), 0, '미션 덱 1장');
  // (g) 기록 10개
  let h = [];
  for (let k = 1; k <= 14; k++) h = CORE.pushHistory(h, { name: 'N' + k });
  eq([h.length, h[0].name, h[9].name], [10, 'N14', 'N5'], '기록 10개, 최신이 맨 앞');

  // #d= (이름 목록만)
  const enc = CORE.encodeShare({ names: ['민준', 'Léa', 'Маша', 'สมชาย'], skip: false });
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encodeShare: base64url 아님');
  eq(CORE.decodeShare(enc), { names: ['민준', 'Léa', 'Маша', 'สมชาย'], skip: false }, '#d= 왕복(UTF-8)');
  eq(CORE.encodeShare({ names: ['A'] }), null, 'encodeShare: 1명은 null');
  eq(CORE.encodeShare({ names: Array.from({ length: 13 }, (_, i) => 'P' + i) }), null, 'encodeShare: 13명은 null');
  const mk = (o) => CORE.b64urlEncode(JSON.stringify(Object.assign({ v: 1, m: ['A', 'B', 'C'], s: 1 }, o)));
  eq(!!CORE.decodeShare(mk({})), true, 'decode 기본');
  [['버전', { v: 2 }], ['이름 1명', { m: ['A'] }], ['이름 13명', { m: Array.from({ length: 13 }, (_, i) => 'P' + i) }], ['이름 형식', { m: ['A', 3] }],
    ['빈 이름', { m: ['A', ' '] }], ['꺾쇠뿐인 이름', { m: ['A', '<>'] }], ['긴 이름', { m: ['A', 'x'.repeat(40)] }], ['s 값', { s: 2 }], ['s 없음', { s: undefined }]].forEach(([nm, o]) => {
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
    walk(T, (s, p) => { if (/^(privacy|faq|prompts)\./.test(p)) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.spin', 'ui.modeFree', 'result.again', 'result.pointsAt', 'errors.namesTooFew'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
      if (T.prompts[0] === EN.prompts[0]) bad(`${tag} 미션 카드가 en 과 같음`);
    }
    // 360px 폭 문구 (버튼·라벨·세그먼트)
    const W = [['ui.spin', 26], ['ui.spinning', 22], ['ui.modeFree', 18], ['ui.modeNames', 18], ['ui.srcBuiltin', 18], ['ui.srcCustom', 18], ['ui.skipLabel', 30],
      ['ui.promptsLabel', 40], ['ui.modeLabel', 34], ['ui.namesLabel', 34], ['ui.customLabel', 34], ['ui.tapHint', 52], ['ui.namesCount', 18],
      ['result.again', 24], ['result.reset', 30], ['result.shareNames', 34], ['result.pointsAt', 34], ['result.freeTitle', 36], ['result.promptTitle', 24], ['result.history', 26]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    // 미션 카드: 10~15개, 짧게, 중복 없음, 글자 정리 통과(80자), HTML 없음
    const P = T.prompts;
    if (!Array.isArray(P) || P.length < 10 || P.length > 15) bad(`${tag} prompts 10~15개 (${P && P.length})`);
    else {
      if (new Set(P.map((x) => x.toLowerCase())).size !== P.length) bad(`${tag} prompts 중복`);
      P.forEach((x, i) => { if (CORE.cleanText(x, CORE.MAX_PROMPT) !== x) bad(`${tag} prompts[${i}] 80자 넘거나 정리됨: ${x}`); if (/[<>]/.test(x)) bad(`${tag} prompts[${i}] HTML`); });
      if (P.some((x) => /kiss|bisou|küss|beij|bacio|besar|beso|поцел|키스|뽀뽀|キス|亲吻|接吻|จูบ|hôn/i.test(x))) bad(`${tag} prompts 에 키스 류 문구 (가족용으로만)`);
    }
    walk(T, (s, p) => { if (!p.startsWith('privacy.') && /kiss|bisou|küss|beij|bacio|besar|beso|поцел|키스|뽀뽀|キス|亲吻|接吻|จูบ|\bhôn\b/i.test(s)) bad(`${tag} ${p} 에 키스 류 문구`); });
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
      if (T.prompts.some((x) => f.a.includes(x))) bad(`${tag} faq[${i}] 에 미션 카드 인용 (스포일러)`);
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
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
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
  if (!/<link rel="canonical" href="https:\/\/bottle\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bottle\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const S = section(html, 'screen-bottle');
      if (!S) { bad(`${tag} 화면(#screen-bottle) 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 한 화면(#screen-bottle) 1개`);
      if (/<section id="screen-bottle"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="bt-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="bt-h1"', 'id="mode-free"', 'id="mode-names"', 'id="names"', 'id="skip"', 'id="prompts"', 'id="src-builtin"', 'id="custom"', 'id="error"',
        'id="stage"', 'id="seats"', 'id="bottle"', 'id="spin-btn"', 'id="result"', 'id="result-card"', 'id="prompt-card"', 'id="history"', '<div data-mg-end="bottle"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((x, i) => i && x < seq[i - 1])) bad(`${tag} 화면 순서(h1 → 옵션 → 테이블·병 → 돌리기 → 결과 → 기록 → 공통 끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="bt-result" hidden>/.test(S)) bad(`${tag} 결과(#result)는 처음에 hidden`);
      const R = (S.match(/<div id="result"[\s\S]*?<div data-mg-end="bottle"><\/div>\s*<\/div>/) || [])[0];
      if (!R) bad(`${tag} data-mg-end="bottle" 은 결과(#result) 안의 마지막 요소여야 함`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      if (!/<div id="names-box" class="bt-names" hidden>/.test(S)) bad(`${tag} 이름 칸은 처음에 숨김(그냥 돌리기 기본)`);
      if (!/<div id="prompts-box" class="bt-prompts" hidden>/.test(S) || /id="prompts" role="switch" checked/.test(S)) bad(`${tag} 미션 카드는 기본 꺼짐`);
      if (!/id="skip" role="switch" checked/.test(S)) bad(`${tag} 겹치지 않기 기본 켬`);
      if (!/id="mode-free" role="radio" aria-checked="true"/.test(S)) bad(`${tag} 기본 모드 = 그냥 돌리기`);
      if (!/id="error" class="bt-error" role="alert" hidden/.test(S)) bad(`${tag} 오류 안내(role=alert) 없음`);
      if ((S.match(/role="radio"/g) || []).length !== 4) bad(`${tag} 모드·미션 선택(라디오 4개) 접근성`);
      if (!/id="bottle" class="bt-bottle" role="button" tabindex="0" aria-label="/.test(S)) bad(`${tag} 병은 키보드로도 돌릴 수 있어야 함(role=button, tabindex)`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (T.prompts.some((p) => bodyNoJson.includes(G.esc(p)) || bodyNoJson.includes(p))) bad(`${tag} 미션 카드 문구가 PAGE_I18N 밖(보이는 HTML·메타)에 있음 (스포일러)`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('bottle-core.js') < 0 || html.indexOf('bottle-core.js') > html.indexOf('bottle.js"')) bad(`${tag} bottle-core.js 가 bottle.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://bottle.example.com/</loc>') || !sm.includes('<loc>https://bottle.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 가이드 글에 미션 카드 인용 없음(스포일러)
  G.LOCALES.forEach(({ code: lang }) => {
    const gp = path.join(SITE, 'tools', 'guide', `${lang}.js`);
    if (!fs.existsSync(gp)) { bad(`가이드 ${lang} 없음`); return; }
    const gtxt = JSON.stringify(require(gp));
    if (L10N[lang].prompts.some((p) => gtxt.includes(p))) bad(`[${lang}] 가이드 글에 미션 카드 문구가 있음 (스포일러)`);
  });
  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'bottle.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('bottle.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("bottle.js: track('start') 는 돌리기 1곳, track('done') 은 결과 1곳");
  if (js.indexOf("track('start')") > js.indexOf('animateTo(from, to, REDUCED')) bad("bottle.js: track('start') 는 애니메이션 전에");
  if (/Math\.random/.test(js)) bad('bottle.js 가 Math.random 을 씀 (crypto 만)');
  if (!/prefers-reduced-motion/.test(js)) bad('bottle.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  if (!/pointerdown/.test(js) || !/pointerup/.test(js)) bad('bottle.js: 병 튕기기(pointer events) 없음');
  if (!/navigator\.vibrate/.test(js)) bad('bottle.js: 멈출 때 진동 없음');
  if (!/chooseSeat[\s\S]*targetAngle[\s\S]*planRotation[\s\S]*animateTo/.test(js)) bad('bottle.js: 결과(chooseSeat) → 목표 각도 → 회전 계획 → 애니메이션 순서가 아님');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`bottle.js ${i + 1}행: localStorage 는 try/catch 안에서만`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('bottle.js: setShareData / setRetry 등록 없음');
  if (!/decodeShare/.test(js) || !/#d=/.test(js)) bad('bottle.js: #d= 이름 링크 불러오기 없음');
  if (!/mgCleanUrl/.test(js)) bad('bottle.js: 공유 주소는 mgCleanUrl(언어 없는 주소)');
  if (/innerHTML\s*=\s*(?!\s*'')/.test(js)) bad("bottle.js: 사용자 글자를 innerHTML 로 넣지 않는다(textContent 만, innerHTML = '' 만 허용)");
  if (!/adStart\.hidden = true/.test(js)) bad('bottle.js: 결과가 보이면 첫 화면 맨 아래 광고(mg-ad-start)를 숨겨야 함(한 화면 광고 1개)');
  const core = fs.readFileSync(path.join(SITE, 'bottle-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('bottle-core.js 는 crypto.getRandomValues 만 써야 함');
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
  if (APP.id !== 'bottle' || APP.category !== 'vote' || APP.path !== 'https://bottle.example.com/' || APP.added !== '2026-10-19' || APP.emoji !== '🍾' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
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
console.log(`\n병 돌리기 로직·각도↔자리 왕복·공정성(카이제곱: 자리 2~12명 ${passed.length}종 + 흐름 3종 + 각도 + 겹치지 않기 2종)·#d= 왕복/변조 거절 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
if (passed.length) console.log(`  자리 수:카이제곱 ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 결과 먼저 정하기(crypto 거부 샘플링)·각도↔자리·회전 계획·공정성·겹치지 않기·미션 덱·공유 링크, 언어 파일 12개(키·자리표시자·FAQ·미션 카드·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 data-mg-end·스포일러 없음), OG 이미지 모두 OK');
