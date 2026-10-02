#!/usr/bin/env node
/**
 * 반응속도 테스트 검증 (reaction-core.js + 언어 파일 + 생성된 HTML).
 *   1) 분포 → 상위 % 계산: 빈 분포, 나 혼자, 한 구간에 전부(동점), 가장 빠름/느림, 가운데, 동점 절반,
 *      부동소수 경계(0.88), 응답에 내 구간이 빠진 경우, 잘못된 행/문자열 숫자, 실패(null)
 *   2) 등급 경계(220/260/300/350/449/450), 평균 반올림, 단조성
 *   3) 10ms 구간 반올림(Math.round(avg/10)), 잘못된 값, 상한
 *   4) 대기 시간 난수 범위(1.5~4.5초), 요약(평균/최고), 차트 구간 묶기
 *   5) 언어 파일 12개(en/ja/zh/ko/fr/de/th/vi/es/it/pt/ru) 키 구조가 같은지, ui 문자열의 {자리표시자}가 같은지, 등급 문구 수 = TIERS 수,
 *      제목 글꼴을 fontCss 로 불러오는지, 키릴 문구(ru)의 제목 글꼴이 키릴을 지원하는지(Archivo 에는 키릴이 없다),
 *      FAQ 3~5개(끝 화면 전용), title="검색어 | 브랜드" 형태와 길이(라틴/CJK·태국 구간)
 *   6) 생성된 index.html 의 구조화 데이터(G.appLd: WebApplication + BreadcrumbList, FAQPage 없음)가 올바른 JSON 인지,
 *      스크립트 순서(MG_FAQ 포함), 광고 자리 없음, 공통 끝 화면·타이틀 바 자리, 제거 대상 잔존 여부
 *
 * 실행: node tools/check-reaction.js
 */
const fs = require('fs');
const path = require('path');
const C = require(path.join(__dirname, '..', 'reaction-core.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));

const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);

let pass = 0;
const fails = [];
function ok(cond, name, detail) {
  if (cond) pass++;
  else fails.push(`${name}${detail ? ' — ' + detail : ''}`);
}
function eq(actual, expected, name) {
  ok(JSON.stringify(actual) === JSON.stringify(expected), name, `기대 ${JSON.stringify(expected)}, 실제 ${JSON.stringify(actual)}`);
}
const H = (pairs) => pairs.map(([b, n]) => ({ score_bucket: b, players: n }));
const pick = (p, keys) => (p ? Object.fromEntries(keys.map((k) => [k, p[k]])) : p);

// ---------------------------------------------------------------- 1) 상위 %
function checkPercentile() {
  eq(C.percentile(null, 25), null, 'percentile: 실패 응답(null) → null');
  eq(C.percentile(undefined, 25), null, 'percentile: undefined → null');
  eq(C.percentile(H([[25, 3]]), null), null, 'percentile: 구간 없음 → null');
  eq(pick(C.percentile([], 25), ['total', 'others', 'first']), { total: 1, others: 0, first: true }, 'percentile: 빈 분포 → 나 혼자(first)');
  eq(pick(C.percentile(H([[25, 1]]), 25), ['total', 'first']), { total: 1, first: true }, 'percentile: 나만 있는 분포 → first');

  // 한 구간에 전부 (나 포함 10명, 모두 동점) → 절반 이김 → 상위 50%
  eq(pick(C.percentile(H([[25, 10]]), 25), ['others', 'top', 'beatPct', 'first']),
    { others: 9, top: 50, beatPct: 50, first: false }, 'percentile: 단일 구간 동점');

  // 가장 빠름: 나보다 느린 사람만 19명
  eq(pick(C.percentile(H([[20, 1], [25, 9], [30, 10]]), 20), ['faster', 'slower', 'top', 'beatPct']),
    { faster: 0, slower: 19, top: 1, beatPct: 100 }, 'percentile: 가장 빠름 → 상위 1%, 100%보다 빠름');
  // 가장 느림
  eq(pick(C.percentile(H([[20, 5], [30, 1]]), 30), ['faster', 'slower', 'top', 'beatPct']),
    { faster: 5, slower: 0, top: 100, beatPct: 0 }, 'percentile: 가장 느림 → 상위 100%, 0%');
  // 가운데: 50명 빠름, 나, 50명 느림
  eq(pick(C.percentile(H([[20, 50], [25, 1], [30, 50]]), 25), ['top', 'beatPct']), { top: 50, beatPct: 50 }, 'percentile: 정가운데');
  // 동점 절반: 나 포함 3명 동점 + 1명 느림 → (1 + 1) / 3 = 66.7% → 상위 34%
  eq(pick(C.percentile(H([[25, 3], [30, 1]]), 25), ['top', 'beatPct']), { top: 34, beatPct: 66 }, 'percentile: 동점은 절반만 이김');
  // 부동소수 경계: 다른 100명 중 88명이 느림 → 정확히 상위 12% (13 이 되면 안 된다)
  eq(pick(C.percentile(H([[20, 12], [25, 1], [40, 88]]), 25), ['top', 'beatPct']), { top: 12, beatPct: 88 }, 'percentile: 0.88 경계 반올림');
  // 응답에 내 구간이 빠짐 → 나를 한 명 더해서 계산
  eq(pick(C.percentile(H([[20, 4], [30, 5]]), 25), ['total', 'faster', 'same', 'slower']),
    { total: 10, faster: 4, same: 1, slower: 5 }, 'percentile: 내 구간 없음 → 나를 더함');
  // 잘못된 행·문자열 숫자·중복 구간
  const messy = [{ score_bucket: '25', players: '2' }, { score_bucket: 25, players: 1 }, { score_bucket: 30, players: 0 },
    null, { score_bucket: 'x', players: 3 }, { score_bucket: 40, players: -1 }, { score_bucket: 35, players: 3 }];
  eq(pick(C.percentile(messy, 25), ['total', 'same', 'slower']), { total: 6, same: 3, slower: 3 }, 'percentile: 잘못된 행 무시·중복 합침');

  // 성질 검사: 무작위 분포에서 top ∈ [1,100], beatPct ∈ [0,100], top + beatPct ∈ {100, 101}, 빠를수록 top 이 작다
  let rnd = 12345;
  const rand = () => ((rnd = (rnd * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let t = 0; t < 400; t++) {
    const rows = [];
    for (let b = 12; b < 70; b++) if (rand() < 0.6) rows.push({ score_bucket: b, players: 1 + Math.floor(rand() * 40) });
    if (!rows.length) continue;
    let prevTop = 0;
    for (let b = 10; b <= 72; b++) {
      const p = C.percentile(rows, b);
      if (p.first) continue;
      ok(p.top >= 1 && p.top <= 100 && p.beatPct >= 0 && p.beatPct <= 100, 'percentile 범위', JSON.stringify({ b, p }));
      ok(p.top + p.beatPct === 100 || p.top + p.beatPct === 101, 'percentile top+beat', JSON.stringify({ b, top: p.top, beat: p.beatPct }));
      if (p.top < prevTop) fails.push(`percentile 단조성: 구간 ${b} 에서 top ${p.top} < 이전 ${prevTop}`);
      prevTop = p.top;
    }
  }
}

// ---------------------------------------------------------------- 2) 등급
function checkTiers() {
  const id = (ms) => C.TIERS[C.tierIndex(ms)].id;
  eq([0, 150, 220, 220.4].map(id), ['eagle', 'eagle', 'eagle', 'eagle'], 'tier: ≤220 독수리');
  eq([220.6, 221, 260].map(id), ['cheetah', 'cheetah', 'cheetah'], 'tier: 221~260 치타');
  eq([261, 300].map(id), ['cat', 'cat'], 'tier: 261~300 고양이');
  eq([301, 350].map(id), ['rabbit', 'rabbit'], 'tier: 301~350 토끼');
  eq([351, 449, 449.4].map(id), ['puppy', 'puppy', 'puppy'], 'tier: 351~449 강아지');
  eq([449.5, 450, 800, 99999].map(id), ['turtle', 'turtle', 'turtle', 'turtle'], 'tier: ≥450 거북이');
  eq(id(NaN), 'turtle', 'tier: NaN → 마지막 등급');
  let prev = 0;
  for (let ms = 0; ms <= 2000; ms++) {
    const i = C.tierIndex(ms);
    if (i < prev) { fails.push(`tier 단조성: ${ms}ms 에서 ${i} < ${prev}`); break; }
    prev = i;
  }
  pass++;
  ok(C.TIERS.every((t, i) => i === 0 || t.max > C.TIERS[i - 1].max), 'tier: max 가 오름차순');
  ok(C.TIERS[C.TIERS.length - 1].max === Infinity, 'tier: 마지막 등급은 상한 없음');
  ok(new Set(C.TIERS.map((t) => t.emoji)).size === C.TIERS.length, 'tier: 이모지 중복 없음');
}

// ---------------------------------------------------------------- 3) 구간
function checkBuckets() {
  eq([247.4, 244.9, 245, 254.99, 255, 0, 4.9, 5].map(C.toBucket), [25, 24, 25, 25, 26, 0, 0, 1], 'bucket: Math.round(avg/10)');
  eq([-1, NaN, Infinity, null, '', undefined, 'abc'].map(C.toBucket), [null, null, null, null, null, null, null], 'bucket: 잘못된 값 → null');
  eq(C.toBucket(20000), C.MAX_BUCKET, 'bucket: 상한');
  eq(C.toBucket('312'), 31, 'bucket: 문자열 숫자');
  ok(C.MAX_BUCKET <= 100000, 'bucket: DB 허용 범위(0~100000) 안');
}

// ---------------------------------------------------------------- 4) 대기·요약·차트
function checkMisc() {
  eq([0, 0.5, 0.9999999999, -3, 7].map(C.randomDelay), [1500, 3000, 4500, 1500, 4500], 'delay: 경계값');
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < 20000; i++) {
    const d = C.randomDelay();
    if (d < min) min = d;
    if (d > max) max = d;
    if (!Number.isInteger(d)) { fails.push('delay: 정수가 아님'); break; }
  }
  ok(min >= C.MIN_DELAY && max <= C.MAX_DELAY, 'delay: 1500~4500 범위', `${min}~${max}`);
  ok(min < 1600 && max > 4400, 'delay: 범위 전체에 퍼짐', `${min}~${max}`);
  ok(C.MIN_DELAY === 1500 && C.MAX_DELAY === 4500, 'delay: 1.5~4.5초');

  eq(C.summarize([200, 250, 300, 350, 400]), { avg: 300, best: 200, worst: 400, n: 5 }, 'summarize: 평균·최고');
  eq(C.summarize([]), null, 'summarize: 빈 배열');
  eq(C.summarize([231, 'x', -5, 269]).avg, 250, 'summarize: 잘못된 값 무시');

  const bins = C.chartBins(H([[5, 2], [15, 1], [30, 4], [60, 3], [90, 1]]), 15, 60);
  eq(bins.length, 46, 'chartBins: 길이');
  eq([bins[0].players, bins[0].edge, bins[15].players, bins[45].players, bins[45].edge], [3, 'lo', 4, 4, 'hi'], 'chartBins: 양 끝으로 모음');
  eq(bins.reduce((a, b) => a + b.players, 0), 11, 'chartBins: 인원 합 보존');
  eq(C.chartBins(null, 15, 60).every((b) => b.players === 0), true, 'chartBins: null → 0');
  ok(C.ROUNDS === 5 && C.ANTICIPATION_MS === 100 && C.MISS_MS === 2000 && C.BUCKET_MS === 10, 'core 상수');
  ok(C.toBucket(C.MISS_MS) < C.MAX_BUCKET, '놓침 기준보다 느린 평균은 나올 수 없고 상한 안에 든다');
}

// ---------------------------------------------------------------- 5) 언어 파일
function shape(v) {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape(v[k])]));
  return typeof v;
}
function flat(obj, pre = '', out = {}) {
  Object.entries(obj).forEach(([k, v]) => {
    const key = pre ? `${pre}.${k}` : k;
    if (v && typeof v === 'object') flat(v, key, out);
    else out[key] = v;
  });
  return out;
}
// 제목 글꼴 중 키릴 문자를 지원하는 것 (fonts.google.com/metadata/fonts 의 subsets 에 cyrillic 이 있는지 확인해 넣는다)
const CYRILLIC_FONTS = ['Sofia Sans Condensed'];
const vars = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

function checkLocales() {
  const base = L10N[G.DEFAULT_LOCALE];
  const langs = Object.keys(L10N);
  // faq 는 문항 수가 언어마다 달라도 되지만(3~5개), 나머지 구조는 같아야 한다
  const strip = (T) => { const c = { ...T }; delete c.faq; return c; };
  const baseShape = JSON.stringify(shape(strip(base)));
  const baseFlat = flat(base.ui);
  langs.forEach((lang) => {
    const T = L10N[lang];
    ok(JSON.stringify(shape(strip(T))) === baseShape, `[${lang}] 키 구조가 ${G.DEFAULT_LOCALE} 와 같음`);
    const f = flat(T.ui);
    Object.keys(baseFlat).forEach((k) => {
      ok(f[k] != null && f[k] !== '', `[${lang}] ui.${k} 있음`);
      if (f[k] != null) ok(vars(f[k]) === vars(baseFlat[k]), `[${lang}] ui.${k} 자리표시자`, `${vars(f[k])} ≠ ${vars(baseFlat[k])}`);
    });
    ok(Array.isArray(T.ui.tiers) && T.ui.tiers.length === C.TIERS.length, `[${lang}] ui.tiers ${C.TIERS.length}개`);
    // FAQ는 끝 화면(MG_FAQ)에서만 접이식으로 보여준다: 3~5개, 짧게, {q,a} 형태
    ok(Array.isArray(T.faq) && T.faq.length >= 3 && T.faq.length <= 5, `[${lang}] FAQ 3~5개`, String(T.faq && T.faq.length));
    ok(T.faq.every((it) => it && it.q && it.a && it.a.length >= 20 && it.a.length <= 220), `[${lang}] FAQ 항목 {q,a}, 답변 20~220자`);
    // 글자 밀도가 높은 문자(한글·가나·한자) 및 태국 문자는 같은 내용이 더 짧다 → 문자 종류로 범위를 고른다 (언어 목록 없이)
    const isDenseCh = (ch) => { const cp = ch.codePointAt(0); return cp >= 0x2e80 || (cp >= 0x0e00 && cp <= 0x0e7f); };
    const titleText = T.meta.title;
    const dense = [...titleText].filter(isDenseCh).length / titleText.length > 0.3;
    const tl = [...T.meta.title].length, dl = [...T.meta.description].length;
    ok(tl <= (dense ? 32 : 60), `[${lang}] title 길이(검색어 + | + 브랜드)`, String(tl));
    ok(dl >= (dense ? 60 : 110) && dl <= (dense ? 90 : 155), `[${lang}] description 길이`, String(dl));
    ok(!!T.seoKeyword && T.meta.title.includes(T.seoKeyword), `[${lang}] title 이 검색어 "${T.seoKeyword}" 로 시작`);
    ok(T.meta.title.includes(' | ') && T.meta.title.endsWith(G.brandOf(lang)), `[${lang}] title = 검색어 | 브랜드(${G.brandOf(lang)})`);
    const ty = T.typography || {};
    ok(typeof ty.display === 'string' && /^'[^'<>{};]+'$/.test(ty.display), `[${lang}] typography.display 는 '글꼴 이름'`, ty.display);
    ok(['scale', 'scaleSmall', 'leading', 'bodyLeading', 'displayWeight'].every((k) => typeof ty[k] === 'number' && ty[k] > 0), `[${lang}] typography 숫자 값`);
    ok(ty.scale <= 1.2 && ty.scaleSmall <= 1.2 && ty.leading >= 0.8 && ty.leading <= 1.5, `[${lang}] typography 범위`);
    ok(['normal', 'keep-all', 'auto-phrase', 'break-word'].includes(ty.wordBreak), `[${lang}] typography.wordBreak`, ty.wordBreak);
    ok(typeof T.fontCss === 'string' && /^https:\/\/fonts\.googleapis\.com\//.test(T.fontCss) && T.fontCss.includes('Archivo'), `[${lang}] fontCss 에 Archivo(숫자 글꼴)`);
    const fam = String(ty.display || '').replace(/'/g, '');
    const famParam = fam.replace(/ /g, '+').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    ok(new RegExp(`[?&]family=${famParam}(:|&)`).test(T.fontCss), `[${lang}] 제목 글꼴(${fam})을 fontCss 로 불러옴`, T.fontCss);
    // 키릴 문구가 있으면 제목 글꼴은 키릴을 지원해야 한다 (Google Fonts subsets 에 cyrillic 이 있는 글꼴만 — Archivo 는 latin/vietnamese 뿐)
    if (/[\u0400-\u04ff]/.test(JSON.stringify([T.hero, T.result, T.ui, T.og]))) {
      ok(CYRILLIC_FONTS.includes(fam), `[${lang}] 키릴 문구 → 제목 글꼴이 키릴 지원 글꼴(${CYRILLIC_FONTS.join(', ')})`, fam);
    }
  });
  return langs;
}

// ---------------------------------------------------------------- 6) 생성된 HTML
function checkHtml() {
  G.LOCALES.forEach(({ code }) => {
    const file = path.join(SITE_DIR, G.fileOf(code, 'index.html'));
    if (!fs.existsSync(file)) { fails.push(`[${code}] ${G.fileOf(code, 'index.html')} 없음 — node tools/gen-i18n.js 먼저`); return; }
    const html = fs.readFileSync(file, 'utf8');
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
    // G.appLd 는 하나의 <script> 안에 @graph 로 WebApplication + BreadcrumbList 를 담는다 (별점·FAQPage 없음)
    let types = [];
    try {
      blocks.forEach((b) => {
        const obj = JSON.parse(b);
        if (Array.isArray(obj['@graph'])) types.push(...obj['@graph'].map((g) => g['@type']));
        else if (obj['@type']) types.push(obj['@type']);
      });
    } catch (e) { fails.push(`[${code}] JSON-LD 파싱 실패: ${e.message}`); }
    eq(types.sort(), ['BreadcrumbList', 'WebApplication'], `[${code}] 구조화 데이터 종류 (별점·FAQPage 없음)`);
    const order = ['shared/site.config.js', 'shared/i18n.js', 'window.PAGE_I18N', 'window.MG_FAQ', 'shared/common.js', 'shared/supa.js', 'reaction-core.js', 'reaction.js"'];
    const idx = order.map((s) => html.indexOf(s));
    ok(idx.every((v, i) => v > 0 && (i === 0 || v > idx[i - 1])), `[${code}] 스크립트 순서`, JSON.stringify(idx));
    ok(!/ad-slot|adsbygoogle|data-ad-/.test(html), `[${code}] 광고 자리 없음`);
    // 시작(대기) 화면 맨 아래 광고 하나 (규칙 2026-10-02) — 측정 중에는 .rx-idle 째 숨는다. 페이지 전체 mg-ad 는 이 1개뿐(끝 화면은 공통 컴포넌트)
    const idle = html.slice(html.indexOf('<div class="rx-idle">'), html.indexOf('<div class="rx-signal"'));
    ok((html.match(/class="mg-ad\b/g) || []).length === 1 && /<div class="mg-ad mg-ad-start" data-no-tap><\/div>\s*<\/div>\s*$/.test(idle), `[${code}] 시작 화면(.rx-idle) 맨 끝에 mg-ad-start 하나(페이지 전체 1개)`);
    ok(html.includes('class="mg-top"'), `[${code}] 맨 위 타이틀 바(G.topBar) 있음`);
    ok(html.includes('data-mg-end="reaction"'), `[${code}] 공통 끝 화면(data-mg-end) 자리`);
    ok(!/id="share-btn"|id="again-btn"|id="more-tests"|class="rx-faq"|class="rx-seo"|class="rx-top"|FAQPage/.test(html),
      `[${code}] 제거 대상(공유·다시하기 버튼, 다른테스트 목록, SEO본문, FAQ, 자체 헤더, FAQPage) 없음`);
    ok((html.match(/class="rx-lap"/g) || []).length === C.ROUNDS, `[${code}] 라운드 칸 ${C.ROUNDS}개`);
    ok(/<style>:root \{ --font-display: /.test(html), `[${code}] typography CSS 변수 주입`);
  });
}

// 7) 화면 코드(reaction.js / style.css)에 언어 코드나 언어별 선택자가 없는지 (언어는 LOCALES·언어 파일만 안다)
function checkNeutral() {
  const codes = G.LOCALES.map((l) => l.code);
  const js = fs.readFileSync(path.join(SITE_DIR, 'reaction.js'), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  const css = fs.readFileSync(path.join(SITE_DIR, 'style.css'), 'utf8');
  ok(!/:lang\(/.test(css), 'style.css 에 :lang() 선택자 없음');
  codes.forEach((c) => ok(!new RegExp(`['"]${c}['"]`).test(js), `reaction.js 에 언어 코드 '${c}' 없음`));
  ok(!/[\u3040-\u30ff\uac00-\ud7af\u4e00-\u9fff]/.test(js), 'reaction.js 에 한글·가나·한자 문구 없음 (문구는 언어 파일에)');
  ok(C.TIERS.every((t) => /^[a-z]+$/.test(t.id)), '등급 id 는 언어와 무관한 영문 id');
}

function main() {
  checkNeutral();
  checkPercentile();
  checkTiers();
  checkBuckets();
  checkMisc();
  const langs = checkLocales();
  checkHtml();

  console.log('\n=== 반응속도 테스트 검증 ===');
  console.log(`등급: ${C.TIERS.map((t) => `${t.emoji}≤${t.max === Infinity ? '∞' : t.max}`).join(' ')}`);
  console.log(`대기 ${C.MIN_DELAY}~${C.MAX_DELAY}ms, 예측 탭 < ${C.ANTICIPATION_MS}ms, 놓침 > ${C.MISS_MS}ms, 구간 ${C.BUCKET_MS}ms, 라운드 ${C.ROUNDS}`);
  console.log(`언어 파일: ${langs.join(', ')}`);
  console.log(`통과 ${pass}건, 실패 ${fails.length}건`);
  if (fails.length) {
    fails.slice(0, 40).forEach((f) => console.log('  - ' + f));
    console.log('\n결과: FAIL');
    process.exit(1);
  }
  console.log('\n결과: PASS — 순위 계산·등급·구간·대기 난수·언어 파일·생성 HTML 모두 통과');
}

main();
