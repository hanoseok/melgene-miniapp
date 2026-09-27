#!/usr/bin/env node
/**
 * 돌림판 검증 (roulette-core.js 를 브라우저와 같은 코드로 돌린다)
 *  1) 가중치 추첨 분포: 여러 가중치 조합 × 100,000회 (crypto 난수) — 항목별 관측 비율이 기대값 ± 허용오차 안인지
 *     허용오차 = max(0.35%p, 4.5σ), σ = sqrt(p(1-p)/N). 카이제곱 통계도 같이 출력.
 *  2) 각도 → 칸 매핑: 항목 2~16개 × 무작위 가중치 × 모든 칸 × 여러 시작 각도/멈출 위치/바퀴 수에서
 *     planSpin 의 최종 각도가 항상 뽑힌 칸에 멈추는지, angleAt 이 끝에서 정확히 plan.to 인지,
 *     windup 이후 각도가 단조 증가하는지, 경계 여백(LAND_MARGIN) 안쪽인지
 *  3) 공유 해시 왕복: ko/ja/ru/emoji(ZWJ·국기·피부색)/제어문자/초과 길이 → decode(encode(x)) === normalize(x),
 *     URL 안전 문자만 쓰는지, 망가진 입력은 null 인지
 *  4) 언어 파일: 모든 언어의 ui 키, 프리셋 키·개수 일치, 프리셋 항목 길이(24자) 이하, 테마 이름, FAQ 4~5개,
 *     SEO 본문 길이(600~900자 권장 — 벗어나면 경고), meta 길이
 *
 * 실행: node tools/check-roulette.js
 */
const path = require('path');
const assert = require('assert');
const CORE = require(path.join(__dirname, '..', 'roulette-core.js'));
const DRAW = require(path.join(__dirname, '..', 'roulette-draw.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(path.join(__dirname, '..'));

const failures = [];
const warnings = [];
function fail(msg) { failures.push(msg); }

// 테스트 안에서만 쓰는 재현 가능한 난수 (시나리오 생성용 — 추첨 자체는 crypto)
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260927);
const rint = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));

// ---------------------------------------------------------------
// 1) 분포
// ---------------------------------------------------------------
function checkDistribution() {
  const N = 100000;
  const cases = [
    { name: '균등 2개', w: [1, 1] },
    { name: '균등 8개', w: [1, 1, 1, 1, 1, 1, 1, 1] },
    { name: '가중치 2·1·1', w: [2, 1, 1] },
    { name: '가중치 5·1·3·2·4', w: [5, 1, 3, 2, 4] },
    { name: '극단 16개 (1×15 + 5)', w: [...Array(15).fill(1), 5] },
  ];
  const rows = [];
  let draws = 0;
  cases.forEach((c) => {
    const counts = new Array(c.w.length).fill(0);
    for (let i = 0; i < N; i++) counts[CORE.pickIndex(c.w)]++;
    draws += N;
    const total = c.w.reduce((a, b) => a + b, 0);
    let worst = 0;
    let chi2 = 0;
    c.w.forEach((w, i) => {
      const p = w / total;
      const obs = counts[i] / N;
      const sigma = Math.sqrt((p * (1 - p)) / N);
      const tol = Math.max(0.0035, 4.5 * sigma);
      const dev = Math.abs(obs - p);
      worst = Math.max(worst, dev / tol);
      chi2 += ((counts[i] - p * N) ** 2) / (p * N);
      if (dev > tol) fail(`[분포] ${c.name} 항목${i}: 관측 ${(obs * 100).toFixed(2)}% vs 기대 ${(p * 100).toFixed(2)}% (허용 ±${(tol * 100).toFixed(2)}%p)`);
    });
    rows.push(`  ${c.name.padEnd(22)} 최대 편차/허용 = ${worst.toFixed(2)}  χ²=${chi2.toFixed(1)} (자유도 ${c.w.length - 1})`);
  });

  // randomInt 치우침: 3으로 나눈 값(2^32 가 3의 배수가 아님)도 고른지
  const m = 3;
  const cc = [0, 0, 0];
  for (let i = 0; i < N; i++) cc[CORE.randomInt(m)]++;
  cc.forEach((v, i) => { if (Math.abs(v / N - 1 / 3) > 0.006) fail(`[분포] randomInt(3) ${i}: ${(v / N * 100).toFixed(2)}%`); });
  draws += N;
  return { rows, draws };
}

// ---------------------------------------------------------------
// 2) 각도 → 칸
// ---------------------------------------------------------------
function checkLanding() {
  let checks = 0;
  let monoChecks = 0;
  for (let n = CORE.MIN_ITEMS; n <= CORE.MAX_ITEMS; n++) {
    for (let trial = 0; trial < 60; trial++) {
      const weights = Array.from({ length: n }, () => (trial % 3 === 0 ? 1 : rint(1, 5)));
      const lay = CORE.layout(weights);
      // 칸 배치 자체: 비율, 연속성, 2π 로 끝남
      if (Math.abs(lay.ends[n - 1] - CORE.TAU) > 1e-12) fail(`[각도] n=${n} 마지막 칸이 2π에서 끝나지 않음`);
      for (let i = 0; i < n; i++) {
        const span = lay.ends[i] - lay.starts[i];
        const expect = (weights[i] / lay.total) * CORE.TAU;
        if (Math.abs(span - expect) > 1e-9) fail(`[각도] n=${n} 칸${i} 넓이 ${span} ≠ ${expect}`);
        if (i > 0 && lay.starts[i] !== lay.ends[i - 1]) fail(`[각도] n=${n} 칸${i} 틈`);
      }
      for (let idx = 0; idx < n; idx++) {
        const fracs = [CORE.LAND_MARGIN, 0.5, 1 - CORE.LAND_MARGIN, undefined, undefined];
        fracs.forEach((frac) => {
          const current = (rnd() - 0.3) * 60; // 음수·큰 각도 포함
          const plan = CORE.planSpin({ current, weights, index: idx, frac, reduced: rnd() < 0.2 });
          checks++;
          const landed = CORE.sliceAt(plan.to, plan.layout);
          if (landed !== idx) fail(`[각도] n=${n} w=${weights} idx=${idx} frac=${plan.frac} current=${current} → ${landed}`);
          if (CORE.angleAt(plan, CORE.totalTime(plan)) !== plan.to) fail(`[각도] 끝 각도 ≠ plan.to (n=${n})`);
          if (CORE.angleAt(plan, CORE.totalTime(plan) + 500) !== plan.to) fail('[각도] 끝난 뒤 각도가 변함');
          if (plan.to - plan.from < (plan.windup ? CORE.TAU : 0)) fail(`[각도] 한 바퀴도 안 돎 (n=${n})`);
          if (plan.frac < CORE.LAND_MARGIN - 1e-12 || plan.frac > 1 - CORE.LAND_MARGIN + 1e-12) fail(`[각도] 여백 밖 frac=${plan.frac}`);
          if (!(plan.duration >= (plan.windup ? 4000 : 1400) && plan.duration <= (plan.windup ? 7000 : 1800))) fail(`[각도] 길이 ${plan.duration}ms 범위 밖`);
          // 정규화한 각도(앱이 멈춘 뒤 저장하는 값)도 같은 칸
          if (CORE.sliceAt(CORE.normAngle(plan.to), plan.layout) !== idx) fail(`[각도] normAngle 후 칸이 바뀜 (n=${n})`);
          // 궤적: windup 뒤로는 감소하지 않는다, 마지막 프레임 근처에서 이미 목표 칸 안
          if (checks % 7 === 0) {
            let prev = -Infinity;
            const T = CORE.totalTime(plan);
            for (let t = plan.windup; t <= T; t += 16.7) {
              const a = CORE.angleAt(plan, t);
              if (a < prev - 1e-9) { fail(`[각도] 역행 t=${t}`); break; }
              prev = a;
              monoChecks++;
            }
            const nearEnd = CORE.angleAt(plan, T - 30);
            if (Math.abs(plan.to - nearEnd) > 0.02) fail(`[각도] 끝 30ms 전 남은 각도 ${(plan.to - nearEnd).toFixed(4)} rad (너무 급정거)`);
          }
        });
      }
    }
  }
  // 무작위 결과(index 미지정)에서도 매핑 일치
  for (let k = 0; k < 20000; k++) {
    const n = rint(2, 16);
    const weights = Array.from({ length: n }, () => rint(1, 5));
    const plan = CORE.planSpin({ current: rnd() * 100, weights });
    checks++;
    if (CORE.sliceAt(plan.to, plan.layout) !== plan.index) fail(`[각도] 무작위 스핀 불일치 n=${n}`);
  }
  // sliceAt 기준 점검: 회전 0이면 포인터 밑은 0번 칸의 시작, 살짝 반시계로 돌리면 0번 칸 안
  const lay4 = CORE.layout([1, 1, 1, 1]);
  assert.strictEqual(CORE.sliceAt(0, lay4), 0);
  assert.strictEqual(CORE.sliceAt(-0.1, lay4), 0); // 휠을 반시계로 0.1 → 포인터 밑은 휠 각도 0.1
  assert.strictEqual(CORE.sliceAt(0.1, lay4), 3); // 시계 방향으로 돌리면 마지막 칸이 포인터로 온다
  assert.strictEqual(CORE.sliceAt(-Math.PI / 2 - 0.01, lay4), 1);
  return { checks, monoChecks };
}

// ---------------------------------------------------------------
// 3) 공유 해시
// ---------------------------------------------------------------
function checkShare() {
  const samples = [
    '짜장면', '김치찌개 🍲', 'ラーメン', '牛丼（大盛り）', 'はい', '👨‍👩‍👧‍👦 가족', '🇰🇷🇯🇵', '👍🏽 OK', 'café crème', 'Ω≈ç√',
    'Пельмени', 'Ёжик в тумане', 'a"b\\c', '<script>', '  공백  많은   항목  ', 'tab\there', 'line\nbreak', '𠮷野家', 'ẞ', '١٢٣', '😀'.repeat(20), 'x'.repeat(40),
  ];
  let trips = 0;
  const pick = () => samples[rint(0, samples.length - 1)];
  for (let k = 0; k < 3000; k++) {
    const n = rint(2, 16);
    const raw = {
      items: Array.from({ length: n }, () => (rnd() < 0.15 ? String(rint(0, 999)) : pick())),
      weights: Array.from({ length: n }, () => rint(1, 5)),
      weighted: rnd() < 0.5,
      theme: CORE.THEME_IDS[rint(0, CORE.THEME_IDS.length - 1)],
    };
    if (!raw.weighted) raw.weights = raw.weights.map(() => 1);
    const norm = CORE.normalizeSetup(raw);
    if (!norm) { fail(`[공유] 정규화 실패 ${JSON.stringify(raw)}`); continue; }
    const code = CORE.encodeShare(raw);
    trips++;
    if (!/^[A-Za-z0-9_-]+$/.test(code)) fail(`[공유] URL 안전하지 않은 문자: ${code.slice(0, 40)}`);
    const back = CORE.decodeShare(code);
    try {
      assert.deepStrictEqual(back.items, norm.items);
      assert.deepStrictEqual(back.weights, norm.weights);
      assert.strictEqual(back.theme, norm.theme);
      // 가중치가 모두 1이면 링크에서 w 를 생략하므로 받는 쪽은 "확률 조절 꺼짐"으로 연다 (의도된 동작)
      assert.strictEqual(back.weighted, norm.weights.some((w) => w !== 1));
    } catch (e) {
      fail(`[공유] 왕복 불일치: ${JSON.stringify(norm.items).slice(0, 80)} → ${back && JSON.stringify(back.items).slice(0, 80)}`);
    }
    norm.items.forEach((s) => {
      if (s.length > CORE.MAX_LABEL) fail(`[공유] ${CORE.MAX_LABEL}자 초과 "${s}"`);
      if (/[\uD800-\uDBFF]$/.test(s)) fail(`[공유] 서로게이트 쌍이 잘림 "${s}"`);
      if (/[\u0000-\u001f]/.test(s)) fail('[공유] 제어문자가 남음');
    });
    // 두 번 인코딩해도 같은 코드 (정규화가 멱등)
    if (CORE.encodeShare(back) !== code) fail('[공유] 재인코딩 결과가 다름');
  }
  // 망가진 입력
  const bad = ['', '!!!', 'e30', CORE.b64urlEncode('{"i":["하나"]}'), CORE.b64urlEncode('not json'), CORE.b64urlEncode('{"i":"x"}'),
    CORE.b64urlEncode(JSON.stringify({ i: [1, null, {}, '', '   '] })), '_-_-', 'A'.repeat(9000)];
  bad.forEach((b) => { if (CORE.decodeShare(b) !== null) fail(`[공유] 망가진 입력이 통과: ${b.slice(0, 30)}`); });
  // 잘못된 UTF-8 바이트
  const invalidUtf8 = Buffer.from([0x7b, 0x22, 0x69, 0x22, 0x3a, 0x5b, 0x22, 0xff, 0xfe, 0x22, 0x5d, 0x7d]).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  if (CORE.decodeShare(invalidUtf8) !== null) fail('[공유] 잘못된 UTF-8 이 통과');
  // 초과 항목 수·가중치 범위는 잘라서 받아들인다
  const over = CORE.decodeShare(CORE.b64urlEncode(JSON.stringify({ v: 1, i: Array.from({ length: 30 }, (_, i) => `#${i}`), w: Array(30).fill(99), t: 'nope' })));
  if (!over || over.items.length !== CORE.MAX_ITEMS || over.weights.some((w) => w !== CORE.MAX_WEIGHT) || over.theme !== CORE.DEFAULT_THEME) fail('[공유] 초과 입력 정리 실패');
  // 기본값은 링크에서 생략 (짧은 링크)
  const short = JSON.parse(CORE.b64urlDecode(CORE.encodeShare({ items: ['a', 'b'], weights: [1, 1], weighted: true, theme: 'candy' })));
  if (short.w || short.t) fail('[공유] 기본값(w·t)이 생략되지 않음');
  return { trips, bad: bad.length + 1 };
}

// ---------------------------------------------------------------
// 4) 언어 파일
// ---------------------------------------------------------------
function deepKeys(obj, prefix = '') {
  return Object.keys(obj).flatMap((k) => {
    const v = obj[k];
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) return deepKeys(v, p);
    return [p];
  });
}
function checkLocales() {
  const base = L10N[G.DEFAULT_LOCALE];
  const baseKeys = deepKeys(base).filter((k) => !k.startsWith('ui.presets.'));
  const presetKeys = Object.keys(base.ui.presets);
  const report = [];
  Object.entries(L10N).forEach(([lang, T]) => {
    const keys = new Set(deepKeys(T));
    baseKeys.forEach((k) => { if (!keys.has(k)) fail(`[언어] ${lang}: ${k} 없음`); });
    const pk = Object.keys(T.ui.presets || {});
    if (pk.join() !== presetKeys.join()) fail(`[언어] ${lang}: 프리셋 키 ${pk} ≠ ${presetKeys}`);
    presetKeys.forEach((k) => {
      const list = (T.ui.presets || {})[k] || [];
      if (list.length !== base.ui.presets[k].length) fail(`[언어] ${lang}: 프리셋 ${k} 개수 ${list.length} ≠ ${base.ui.presets[k].length}`);
      if (list.length < CORE.MIN_ITEMS || list.length > CORE.MAX_ITEMS) fail(`[언어] ${lang}: 프리셋 ${k} 개수 범위 밖`);
      list.forEach((s) => { if (CORE.cleanLabel(s) !== s || !s) fail(`[언어] ${lang}: 프리셋 항목 "${s}" 이 정규화에서 바뀜/24자 초과`); });
      if (new Set(list).size !== list.length) fail(`[언어] ${lang}: 프리셋 ${k} 에 같은 항목`);
      if (!T.editor.presets[k]) fail(`[언어] ${lang}: editor.presets.${k} 없음`);
    });
    CORE.THEME_IDS.forEach((id) => { if (!T.ui.themes[id]) fail(`[언어] ${lang}: 테마 이름 ${id} 없음`); });
    // FAQ는 공통 끝 화면(MG_FAQ)에서만 접이식으로 보여준다 — { q, a } 객체 3~5개, 스포일러(항목·결과 인용) 없이
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) fail(`[언어] ${lang}: FAQ ${T.faq && T.faq.length}개 (3~5개)`);
    (T.faq || []).forEach((it, i) => {
      if (!it || !it.q || !it.a) fail(`[언어] ${lang}: faq[${i}] 에 q/a 없음`);
    });
    // title: "검색어 | 브랜드" 형식, 라틴·키릴(ru)은 ~60자, CJK/태국어는 ~32자 권장
    const titleLen = [...T.meta.title].length;
    const latinTitle = (T.meta.title.match(/[A-Za-z\u00C0-\u024F\u0400-\u04FF]/g) || []).length / Math.max(1, [...T.meta.title.replace(/\s/g, '')].length);
    const titleLim = latinTitle > 0.5 ? 62 : 34;
    if (titleLen > titleLim) warnings.push(`[언어] ${lang}: title ${titleLen}자 (권장 ≤${titleLim})`);
    if (!/ \| /.test(T.meta.title)) warnings.push(`[언어] ${lang}: title 에 " | 브랜드" 구분자 없음`);
    if (![...T.meta.description].length || [...T.meta.description].length > 170) warnings.push(`[언어] ${lang}: description ${[...T.meta.description].length}자`);
    ['itemN', 'ariaItem', 'ariaHandle', 'ariaDelete', 'ariaWeight'].forEach((k) => { if (!/\{n\}/.test(T.ui[k])) fail(`[언어] ${lang}: ui.${k} 에 {n} 없음`); });
    if (!/\{label\}/.test(T.ui.announce)) fail(`[언어] ${lang}: ui.announce 에 {label} 없음`);
    report.push(`  ${lang}: 프리셋 ${presetKeys.map((k) => `${k}=${T.ui.presets[k].length}`).join(' ')} · FAQ ${T.faq.length} · title ${titleLen}자`);
  });
  return report;
}

// 테마 색: 이웃 칸(마지막↔첫 칸 포함)이 같은 색이 아닌지
function checkColors() {
  let n2 = 0;
  CORE.THEME_IDS.forEach((id) => {
    for (let n = 2; n <= 16; n++) {
      const c = DRAW.sliceColors(n, id);
      n2++;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        if (c[i] === c[j]) fail(`[색] ${id} n=${n}: 칸 ${i}·${j} 같은 색 ${c[i]}`);
      }
    }
  });
  return n2;
}

const t0 = Date.now();
const dist = checkDistribution();
const land = checkLanding();
const share = checkShare();
const loc = checkLocales();
const colors = checkColors();

console.log('\n=== 돌림판 검증 ===\n');
console.log(`1) 가중치 추첨 분포 — 총 ${dist.draws.toLocaleString()}회 (crypto.getRandomValues)`);
dist.rows.forEach((r) => console.log(r));
console.log(`2) 각도→칸 매핑 — 스핀 계획 ${land.checks.toLocaleString()}건 (항목 2~16개, 무작위 가중치, 모든 칸, 여백/중앙/무작위 위치), 궤적 단조성 ${land.monoChecks.toLocaleString()}프레임`);
console.log(`3) 공유 해시 왕복 — ${share.trips.toLocaleString()}건 (ko/ja/ru/이모지 ZWJ·국기·피부색/제어문자/초과 길이), 망가진 입력 ${share.bad}건 거절`);
console.log(`4) 언어 파일 — ${Object.keys(L10N).join(', ')}`);
loc.forEach((r) => console.log(r));
console.log(`5) 테마 색 — ${CORE.THEME_IDS.length}테마 × 2~16칸 = ${colors}조합, 이웃 칸 색 겹침 없음`);
if (warnings.length) { console.log('\n경고:'); warnings.forEach((w) => console.log('  - ' + w)); }
console.log(`\n(${((Date.now() - t0) / 1000).toFixed(1)}초)`);
if (failures.length) {
  console.log(`\n실패 ${failures.length}건 (최대 15건):`);
  failures.slice(0, 15).forEach((f) => console.log('  - ' + f));
  console.log('\n결과: FAIL');
  process.exit(1);
}
console.log('\n결과: PASS');
