#!/usr/bin/env node
/**
 * ladder-core.js의 사다리 생성 알고리즘을 다양한 인원 수(2~10)와 무작위 시드로 검증한다.
 * 1) 참가자→결과 매핑이 항상 순열(permutation)인지 (모두 서로 다른 결과를 받는지)
 * 2) 같은 줄(row)에서 이웃한 두 칸(gap)에 동시에 가로줄이 생기지 않는지 (adjacency rule)
 * 3) 언어 파일(tools/i18n/<lang>.js)의 ui 문자열이 모든 언어에 빠짐없이 있는지
 *    (순서 라벨이 MAX_N개 이상, 프리셋 결과가 입력칸 최대 길이 12자 이하)
 *
 * 실행: node tools/check-ladder.js
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'ladder-core.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(path.join(__dirname, '..'));
const INPUT_MAX = 12; // ladder.js input.maxLength

function checkLocales() {
  const problems = [];
  const keys = Object.keys(L10N[G.DEFAULT_LOCALE].ui);
  Object.entries(L10N).forEach(([lang, T]) => {
    keys.forEach((k) => { if (T.ui[k] == null || T.ui[k] === '') problems.push(`[${lang}] ui.${k} 없음`); });
    if (!Array.isArray(T.ui.order) || T.ui.order.length < CORE.MAX_N) problems.push(`[${lang}] ui.order 는 ${CORE.MAX_N}개 이상이어야 함`);
    const presetValues = [T.ui.win, T.ui.lose, T.ui.coffeeWin, T.ui.coffeeLose, ...(T.ui.order || []),
      ...Object.values(T.ui.pools || {}).flat()];
    for (let n = 1; n <= CORE.MAX_N; n++) presetValues.push(G.fmt(T.ui.defaultName, { n }));
    presetValues.forEach((v) => { if ([...String(v)].length > INPUT_MAX) problems.push(`[${lang}] "${v}" 가 ${INPUT_MAX}자 초과`); });
    ['lunch', 'clean'].forEach((k) => { if (!(T.ui.pools && T.ui.pools[k] && T.ui.pools[k].length)) problems.push(`[${lang}] ui.pools.${k} 비어 있음`); });
    ['lunch', 'coffee', 'clean', 'order'].forEach((k) => { if (!T.setup.presets[k]) problems.push(`[${lang}] setup.presets.${k} 없음`); });
  });
  return problems;
}

const TRIALS_PER_N = 2000;

function checkPermutation(mapping, n) {
  if (mapping.length !== n) return false;
  const seen = new Array(n).fill(false);
  for (const v of mapping) {
    if (v < 0 || v >= n) return false;
    if (seen[v]) return false; // 중복 = 순열 아님
    seen[v] = true;
  }
  return seen.every(Boolean);
}

function checkAdjacency(rungs) {
  for (const row of rungs) {
    for (let g = 0; g < row.length - 1; g++) {
      if (row[g] && row[g + 1]) return false; // 이웃한 두 칸에 동시에 가로줄
    }
  }
  return true;
}

function run() {
  let total = 0;
  let permOk = 0;
  let adjOk = 0;
  const failures = [];

  for (let n = CORE.MIN_N; n <= CORE.MAX_N; n++) {
    const rows = CORE.rowsForN(n);
    for (let t = 0; t < TRIALS_PER_N; t++) {
      total++;
      const seed = Math.floor(Math.random() * 0xffffffff);
      const rand = CORE.mulberry32(seed);
      const rungs = CORE.generateRungs(n, rows, rand);
      const mapping = CORE.computeMapping(n, rows, rungs);

      const isPerm = checkPermutation(mapping, n);
      const isAdjOk = checkAdjacency(rungs);
      if (isPerm) permOk++;
      if (isAdjOk) adjOk++;

      if (!isPerm || !isAdjOk) {
        failures.push({ n, rows, seed, mapping, isPerm, isAdjOk });
      }
    }

    // 같은 시드는 항상 같은 결과를 내는지(재현성)도 함께 확인
    const seed = 424242 + n;
    const rand1 = CORE.mulberry32(seed);
    const rungs1 = CORE.generateRungs(n, rows, rand1);
    const mapping1 = CORE.computeMapping(n, rows, rungs1);
    const rand2 = CORE.mulberry32(seed);
    const rungs2 = CORE.generateRungs(n, rows, rand2);
    const mapping2 = CORE.computeMapping(n, rows, rungs2);
    const reproducible = JSON.stringify(mapping1) === JSON.stringify(mapping2);
    if (!reproducible) {
      failures.push({ n, rows, seed, reason: 'not reproducible', mapping1, mapping2 });
    }
  }

  console.log(`\n=== 사다리타기 알고리즘 검증 (인원 ${CORE.MIN_N}~${CORE.MAX_N}, 각 ${TRIALS_PER_N}회 시도) ===\n`);
  console.log(`전체 시도: ${total}`);
  console.log(`순열(permutation) 통과: ${permOk} / ${total}`);
  console.log(`인접 규칙(adjacency) 통과: ${adjOk} / ${total}`);
  console.log(`시드 재현성: 인원 ${CORE.MIN_N}~${CORE.MAX_N} 전부 확인`);

  const localeProblems = checkLocales();
  console.log(`언어 파일: ${Object.keys(L10N).join(', ')} — ${localeProblems.length ? '문제 ' + localeProblems.length + '건' : 'ui 문자열/프리셋 길이 모두 통과'}`);
  localeProblems.forEach((p) => console.log('  - ' + p));
  if (localeProblems.length) failures.push({ reason: 'locale', localeProblems });

  if (failures.length) {
    console.log(`\n실패 사례 ${failures.length}건 (최대 5건 출력):`);
    failures.slice(0, 5).forEach((f) => console.log(JSON.stringify(f)));
    console.log('\n결과: FAIL');
    process.exit(1);
  } else {
    console.log('\n결과: PASS — 모든 시도에서 순열/인접 규칙/재현성 통과');
    process.exit(0);
  }
}

run();
