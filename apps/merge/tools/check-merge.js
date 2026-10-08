#!/usr/bin/env node
/**
 * 할로윈 수박게임 검사.
 *   1) 로직(merge-core.js): 단계 11개(id 순서·반지름 증가·다음 조각은 0..4), 점수표(k(k+1)/2 · 잭오랜턴 둘 66),
 *      같은 시드 + 같은 입력 = 같은 판(재현), 작은 dt 로 나눠도 같은 결과, 음수/NaN dt 무시, 조준 범위·쿨다운,
 *      두 조각 실험(같은 단계 → 합쳐짐·점수, 다른 단계 → 안 합쳐지고 쌓임, 잭오랜턴 둘 → 사라짐),
 *      봇 판(무작위·같은 것 노리기): 언제나 끝남(선 위 2초), NaN 없음, 벽·바닥 밖으로 안 나감, 쌓인 뒤 겹침 작음,
 *      점수 = 합치기 사건 점수 합, 조각 수 = 떨어뜨림 − 합치기 − 2×잭오랜턴 터뜨림, 같은 것 노리는 봇이 무작위보다 점수가 높음(실력이 통함).
 *      서버 인코딩: game 이름 = 앱 id, bucket 0..1999 정수, percentile(높을수록 좋음)·잘못된 행 무시·실패 null·혼자면 first.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자, tiers 11개,
 *      FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순/랭킹 류 금지), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원),
 *      제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, fr 좁은 공백, 360px 폭 예산(버튼·배지·방법 3칸·HUD 이름표·끝 화면 문구·조각 이름).
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음(시작 화면 것 말고 페이지 전체 0개 — 끝 화면 광고는 공통 컴포넌트) / 끝 화면: 결과 카드 → data-mg-end="merge" 순서 /
 *      FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex / 공통 컴포넌트 클래스(mg-end 등)와 겹치는 클래스 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-merge.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'merge-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const FRAME = 1000 / 60;
const BOTS = {
  random: (s, rnd) => rnd() * C.W,
  // 손에 든 것과 같은 단계 중 가장 위에 있는 것을 노린다. 없으면 작은 건 왼쪽, 큰 건 오른쪽.
  greedy: (s, rnd) => {
    const same = s.bodies.filter((b) => b.tier === s.cur).sort((a, b) => (a.y - a.r) - (b.y - b.r))[0];
    if (same) return same.x;
    return s.cur <= 1 ? 30 + rnd() * 60 : C.W - 40 - rnd() * 120;
  },
};
function play(seed, bot, rnd, frames = 36) {
  const s = C.newGame(seed);
  const ev = [];
  let guard = 0, nan = false, outside = false, early = false;
  while (!s.over && guard++ < 700) {
    C.aim(s, BOTS[bot](s, rnd));
    if (!C.drop(s)) early = true;
    for (let k = 0; k < frames && !s.over; k++) {
      C.step(s, FRAME).forEach((e) => ev.push(e));
      for (const b of s.bodies) {
        if (!isFinite(b.x) || !isFinite(b.y) || !isFinite(b.vx) || !isFinite(b.vy)) nan = true;
        if (b.x < b.r - 0.5 || b.x > C.W - b.r + 0.5 || b.y > C.H - b.r + 0.5) outside = true;
      }
    }
  }
  return { s, ev, guard, nan, outside, early };
}
function maxOverlap(s) {
  let m = 0;
  for (let i = 0; i < s.bodies.length; i++) {
    for (let j = i + 1; j < s.bodies.length; j++) {
      const a = s.bodies[i], b = s.bodies[j];
      const o = (a.r + b.r - Math.hypot(a.x - b.x, a.y - b.y)) / Math.min(a.r, b.r);
      if (o > m) m = o;
    }
  }
  return m;
}
const stripState = (s) => JSON.stringify(s, (k, v) => (k === 'acc' ? undefined : v));

function checkCore() {
  // 단계 표
  const ids = C.TIERS.map((t) => t.id);
  if (ids.join() !== 'corn,candy,lolly,chestnut,apple,mushroom,bat,ghost,crystal,pumpkin,jack') bad(`TIERS id 순서/중복: ${ids}`);
  C.TIERS.forEach((t, i) => {
    if (i && !(t.r > C.TIERS[i - 1].r)) bad(`단계 ${t.id} 반지름이 앞 단계보다 크지 않음`);
    if (!/^#[0-9a-f]{6}$/i.test(t.color)) bad(`단계 ${t.id} 색`);
    if (!t.emoji && !['corn', 'pumpkin', 'jack'].includes(t.id)) bad(`단계 ${t.id} 그림(이모지) 없음`);
  });
  if (C.TIERS[C.TOP].r * 2 > C.W * 0.5) bad('가장 큰 조각이 병 폭의 절반보다 큼');
  if (C.DROP_Y + C.TIERS[4].r > C.LINE_Y) bad('손에 든 가장 큰 조각(4단계)이 선에 걸림');
  if (C.SPAWN_WEIGHTS.length !== 5) bad('다음 조각은 0..4 단계 중에서');
  for (let k = 1; k <= C.TOP; k++) if (C.mergePoints(k) !== k * (k + 1) / 2) bad(`mergePoints(${k})`);
  if (C.mergePoints(0) !== 0 || C.POP_POINTS !== 66) bad('점수표 0단계/잭오랜턴');
  const seen = new Set();
  const sp = C.newGame(9);
  for (let i = 0; i < 400; i++) { seen.add(sp.cur); sp.cooldown = 0; C.drop(sp); sp.bodies.length = 0; }
  if ([...seen].some((t) => t < 0 || t > 4) || seen.size !== 5) bad(`다음 조각 단계 ${[...seen].sort()}`);

  // 재현 · 작은 dt · 잘못된 dt
  const a = play(777, 'random', mulberry(1));
  const b = play(777, 'random', mulberry(1));
  if (stripState(a.s) !== stripState(b.s)) bad('같은 시드 + 같은 입력인데 결과가 다름');
  const s1 = C.newGame(42), s2 = C.newGame(42);
  [s1, s2].forEach((s) => { C.aim(s, 120); C.drop(s); });
  for (let i = 0; i < 120; i++) C.step(s1, FRAME);
  for (let i = 0; i < 240; i++) C.step(s2, FRAME / 2);
  if (stripState(s1) !== stripState(s2)) bad('step(1/60초)×120 과 step(1/120초)×240 결과가 다름');
  const s3 = C.newGame(1); C.step(s3, -5); C.step(s3, NaN);
  if (s3.t !== 0) bad('음수/NaN dt 는 무시해야 함');
  const s4 = C.newGame(1); C.step(s4, 60000);
  if (s4.t > 260) bad('한 번에 밀린 시간은 0.25초까지만 (탭 복귀 때 폭주 방지)');

  // 조준 · 쿨다운
  const m = C.newGame(3);
  const r0 = C.TIERS[m.cur].r;
  if (C.aim(m, -100) !== r0 || C.aim(m, 9999) !== C.W - r0 || C.aim(m, NaN) !== C.W - r0) bad('조준이 병 안으로 묶이지 않음');
  C.aim(m, 200);
  const first = C.drop(m);
  if (!first || first.x !== 200 || first.y !== C.DROP_Y || m.drops !== 1) bad('drop 이 조준 위치에 안 떨어뜨림');
  if (C.drop(m) || C.canDrop(m)) bad('쿨다운 중에 또 떨어뜨림');
  for (let i = 0; i < Math.ceil((C.DROP_COOLDOWN + 20) / FRAME); i++) C.step(m, FRAME);
  if (!C.canDrop(m)) bad('쿨다운이 끝나지 않음');

  // 같은 단계 두 개 → 합쳐짐
  const mg = C.newGame(11);
  mg.bodies.push({ id: 900, tier: 3, x: 150, y: C.H - 29, px: 150, py: C.H - 29, vx: 0, vy: 0, r: 29, R: 29, grow: 0, born: -5000, a: 0 });
  mg.bodies.push({ id: 901, tier: 3, x: 150, y: C.H - 120, px: 150, py: C.H - 120, vx: 0, vy: 0, r: 29, R: 29, grow: 0, born: -5000, a: 0 });
  const me = [];
  for (let i = 0; i < 90; i++) C.step(mg, FRAME).forEach((e) => me.push(e));
  if (mg.bodies.length !== 1 || mg.bodies[0].tier !== 4 || mg.score !== C.mergePoints(4) || mg.merges !== 1 || me.filter((e) => e.type === 'merge').length !== 1) bad(`같은 단계 두 개가 합쳐지지 않음 (조각 ${mg.bodies.length}, 점수 ${mg.score})`);
  else if (Math.abs(mg.bodies[0].r - C.TIERS[4].r) > 1e-9 || mg.bodies[0].y > C.H - C.TIERS[4].r + 0.5) bad('합쳐진 조각이 다 자라지 않았거나 바닥 밖');
  // 다른 단계 → 쌓임
  const st = C.newGame(12);
  st.bodies.push({ id: 900, tier: 5, x: 200, y: C.H - 42, px: 200, py: C.H - 42, vx: 0, vy: 0, r: 42, R: 42, grow: 0, born: -5000, a: 0 });
  st.bodies.push({ id: 901, tier: 2, x: 200, y: C.H - 200, px: 200, py: C.H - 200, vx: 0, vy: 0, r: 23, R: 23, grow: 0, born: -5000, a: 0 });
  for (let i = 0; i < 240; i++) C.step(st, FRAME);
  if (st.bodies.length !== 2 || st.score !== 0) bad('다른 단계가 합쳐짐');
  else {
    const [p, q] = st.bodies;
    const gap = Math.hypot(p.x - q.x, p.y - q.y) - p.r - q.r;
    if (gap < -1.5) bad(`쌓인 두 조각이 많이 겹침 (${gap.toFixed(2)})`);
    if (Math.abs(p.vy) > 30 || Math.abs(q.vy) > 30) bad('4초 뒤에도 조각이 가라앉지 않음');
  }
  // 잭오랜턴 둘 → 사라짐
  const pj = C.newGame(13);
  pj.bodies.push({ id: 900, tier: C.TOP, x: 100, y: C.H - 88, px: 100, py: C.H - 88, vx: 0, vy: 0, r: 88, R: 88, grow: 0, born: -5000, a: 0 });
  pj.bodies.push({ id: 901, tier: C.TOP, x: 274, y: C.H - 88, px: 274, py: C.H - 88, vx: -200, vy: 0, r: 88, R: 88, grow: 0, born: -5000, a: 0 });
  const pe = [];
  for (let i = 0; i < 60; i++) C.step(pj, FRAME).forEach((e) => pe.push(e));
  if (pj.bodies.length !== 0 || pj.score !== C.POP_POINTS || pj.pops !== 1 || !pe.some((e) => e.type === 'pop')) bad(`잭오랜턴 둘이 사라지지 않음 (조각 ${pj.bodies.length}, 점수 ${pj.score})`);
  // 선 위 2초 → 끝, 그 전엔 안 끝남
  const ov = C.newGame(14);
  ov.bodies.push({ id: 900, tier: 0, x: 200, y: 60, px: 200, py: 60, vx: 0, vy: 0, r: 13, R: 13, grow: 0, born: -5000, a: 0 });
  // 공중에 붙잡아 두려고 매 프레임 위치를 되돌린다
  let tEnd = null;
  for (let i = 0; i < 200 && !ov.over; i++) { ov.bodies[0].x = 200; ov.bodies[0].y = 60; ov.bodies[0].vx = ov.bodies[0].vy = 0; C.step(ov, FRAME); if (ov.over) tEnd = ov.t; }
  if (!ov.over || ov.reason !== 'full' || Math.abs(tEnd - C.DANGER_MS) > 30) bad(`선 위 2초 뒤 끝나지 않음 (t=${tEnd})`);
  const fresh = C.newGame(15);
  C.aim(fresh, 200); C.drop(fresh);
  for (let i = 0; i < 30; i++) C.step(fresh, FRAME);
  if (fresh.danger !== 0) bad('막 떨어뜨린 조각이 선 검사에 걸림');

  // 봇 판
  const stats = { random: { games: 0, score: 0, max: 0, tier: 0, drops: 0 }, greedy: { games: 0, score: 0, max: 0, tier: 0, drops: 0 } };
  let worstOverlap = 0;
  Object.keys(stats).forEach((bot) => {
    for (let g = 0; g < 14; g++) {
      const r = play(1000 + g, bot, mulberry(50 + g));
      const s = r.s;
      const tag = `[${bot} #${g}]`;
      if (!s.over) bad(`${tag} 700번 떨어뜨려도 끝나지 않음`);
      if (r.nan) bad(`${tag} 위치/속도에 NaN`);
      if (r.outside) bad(`${tag} 조각이 벽·바닥 밖으로 나감`);
      if (r.early) bad(`${tag} 쿨다운이 끝났는데 떨어뜨리지 못함`);
      const sum = r.ev.filter((e) => e.type === 'merge' || e.type === 'pop').reduce((x, e) => x + e.points, 0);
      if (sum !== s.score) bad(`${tag} 점수 ${s.score} ≠ 사건 합 ${sum}`);
      if (s.bodies.length !== s.drops - s.merges - 2 * s.pops) bad(`${tag} 조각 수 ${s.bodies.length} ≠ 떨어뜨림 ${s.drops} − 합치기 ${s.merges} − 2×${s.pops}`);
      if (r.ev.filter((e) => e.type === 'end').length !== 1 || s.reason !== 'full') bad(`${tag} end 사건/이유`);
      if (s.maxTier < Math.max(...s.bodies.map((x) => x.tier), 0)) bad(`${tag} maxTier 가 실제 최대 단계보다 작음`);
      if (C.bucket(s.score) > C.MAX_BUCKET) bad(`${tag} bucket 한도 밖`);
      worstOverlap = Math.max(worstOverlap, maxOverlap(s));
      const t = stats[bot];
      t.games++; t.score += s.score; t.max = Math.max(t.max, s.score); t.tier += s.maxTier; t.drops += s.drops;
    }
  });
  if (worstOverlap > 0.2) bad(`끝난 판에서 조각 겹침이 큼 (반지름의 ${(worstOverlap * 100).toFixed(0)}%)`);
  const avg = (t) => Math.round(t.score / t.games);
  if (!(avg(stats.greedy) > avg(stats.random) * 1.15)) bad(`같은 것 노리는 봇(${avg(stats.greedy)})이 무작위(${avg(stats.random)})보다 충분히 높지 않음 — 실력이 안 통함`);
  if (stats.random.drops / stats.random.games < 35) bad('무작위 봇 판이 너무 짧음 (병이 너무 작음)');
  if (stats.greedy.tier / stats.greedy.games < 6) bad('같은 것 노리는 봇이 6단계에도 못 감 (너무 어려움)');
  if (stats.greedy.max / 10 > C.MAX_BUCKET * 0.5) warn('최고 점수가 bucket 한도에 가까움');

  // 서버 인코딩 · 백분위
  if (!/^[a-z0-9-]{1,32}$/.test(C.GAME) || C.GAME !== APP.id) bad(`GAME 이름 ${C.GAME}`);
  [[0, 0], [4, 0], [5, 1], [12340, 1234], [19990, 1999], [1e9, 1999], [-50, 0], [NaN, 0], ['x', 0]].forEach(([sc, want]) => {
    const got = C.bucket(sc);
    if (got !== want || !Number.isInteger(got)) bad(`bucket(${sc}) = ${got} ≠ ${want}`);
  });
  if (C.MAX_BUCKET + 1 > 2000) bad('bucket 가짓수가 서버 한도(2000)를 넘음');
  const rows = [{ score_bucket: 10, players: 5 }, { score_bucket: 20, players: 1 }, { score_bucket: 30, players: 4 }];
  const p = C.percentile(rows, 20);
  if (!p || p.first || p.others !== 9 || p.lower !== 5 || p.higher !== 4 || p.beatPct !== 55 || p.top !== 45) bad(`percentile 기본 ${JSON.stringify(p)}`);
  const p2 = C.percentile([{ score_bucket: 5, players: 3 }], 50);
  if (!p2 || p2.others !== 3 || p2.beatPct !== 100 || p2.top !== 1) bad(`percentile 내 구간 없음(한 명 더함) / 1등 ${JSON.stringify(p2)}`);
  const p3 = C.percentile([{ score_bucket: 50, players: 1 }], 50);
  if (!p3 || !p3.first) bad('혼자면 first');
  if (C.percentile(null, 1) !== null || C.percentile({}, 1) !== null || C.percentile(rows, null) !== null) bad('실패 응답이면 null');
  const junk = C.normalizeHist([null, { score_bucket: 'x', players: 3 }, { score_bucket: 3, players: -1 }, { bucket: 7, players: 2 }, { score_bucket: 7, players: 1 }]);
  if (JSON.stringify(junk) !== '[{"bucket":7,"players":3}]') bad(`normalizeHist 가 잘못된 행을 거르지 않음 ${JSON.stringify(junk)}`);

  const n = (t) => `${avg(t)}점(최고 ${t.max}, 평균 ${(t.tier / t.games).toFixed(1)}단계, ${Math.round(t.drops / t.games)}번 떨어뜨림)`;
  console.log(`\n=== 로직: 봇 ${stats.random.games + stats.greedy.games}판 — 같은 것 노리기 ${n(stats.greedy)} · 무작위 ${n(stats.random)} · 최대 겹침 ${(worstOverlap * 100).toFixed(1)}% ===`);
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
  if (o && typeof o === 'object') return Object.keys(o).sort().flatMap((k) => [`${p}.${k}`, ...(o[k] && typeof o[k] === 'object' ? shape(o[k], `${p}.${k}`) : [])]);
  return [];
}
const THAI_MARK = (c) => c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e);
const WIDE = (c) => (c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x3000 && c <= 0x303f);
function emWidth(str) {
  let w = 0;
  for (const ch of String(str).replace(/<[^>]+>/g, '')) {
    const c = ch.codePointAt(0);
    if (/\p{Extended_Pictographic}/u.test(ch)) w += 1.2;
    else if (c === 0xfe0f || c === 0x200d) w += 0;
    else if (THAI_MARK(c)) w += 0;
    else if (c >= 0x0e00 && c <= 0x0e7f) w += 0.62;
    else if (WIDE(c)) w += 1;
    else if (ch === ' ' || ch === ' ' || ch === ' ') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.68;
    else if (/[а-яё]/.test(ch)) w += 0.6;
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[.,:;!?'’"“”«»„()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.56;
  }
  return w;
}
const visLen = (s) => Array.from(String(s)).filter((ch) => !THAI_MARK(ch.codePointAt(0))).length;
const isWideLang = (lang) => ['ja', 'zh', 'ko', 'th'].includes(lang);
const words = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s  ]+|-/).filter(Boolean);
const longestWord = (s) => words(s).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');
const firstFont = (s) => String(s || '').split(',')[0].replace(/['"]/g, '').trim();
// 제목 글꼴 폭 보정 (Lilita One 은 좁은 편, Rubik 800·Baloo 2·Mitr 는 넓은 편)
const displayFactor = (T) => ({ 'Lilita One': 1.0, Rubik: 1.12, 'Baloo 2': 1.05, Mitr: 1.1 }[firstFont(T.fonts.display)] || 1.05);
// 줄 수 계산 (라틴·키릴: 단어 단위, CJK·태국어: 글자 단위)
function lines(T, lang, text, size, px, factor) {
  const f = factor == null ? displayFactor(T) : factor;
  if (isWideLang(lang)) return Math.ceil((emWidth(text) * size * f) / px);
  let n = 1, cur = 0;
  const space = 0.28 * size * f;
  words(text).forEach((w) => {
    const ww = emWidth(w) * size * f;
    if (cur && cur + space + ww > px) { n++; cur = ww; } else cur += (cur ? space : 0) + ww;
  });
  return n;
}
// 360px 폭(본문 칸 328px) 예산
// HUD 칸: (328 - 44 - 18) = 266 → 1.2 : 1 : 0.9 → 103 / 86 / 77, 안쪽 여백 16+3 → 84 / 67 / (58 − 다음 그림 38) 이름표 한 줄(넘치면 … 로 잘림)
const STAT = (328 - 32 - 8) / 2 - 15;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지' },
  { key: 'start.how.aim', get: (T) => T.start.how.aim, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.match', get: (T) => T.start.how.match, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.line', get: (T) => T.start.how.line, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'play.score', get: (T) => T.play.score, px: 84, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 67, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.next', get: (T) => T.play.next, px: 58, size: 11, max: 1, what: 'HUD 다음 이름표', track: 0.06 },
  { key: 'play.full', get: (T) => T.play.full, px: 328 - 60, size: 30, max: 1, what: '병 가득 참 글자' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'result.full', get: (T) => T.result.full, px: 328 - 32 - 32, size: 16, max: 1, what: '끝 이유 배지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '12,340'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.biggest', get: (T) => T.result.biggest, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.merges', get: (T) => T.result.merges, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 32 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 32 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 32 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 32 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
  ...Array.from({ length: 11 }, (_, i) => ({ key: `tiers[${i}]`, get: (T) => T.tiers[i], px: STAT, size: 15, max: 2, what: '가장 큰 조각 이름 두 줄까지', word: STAT })),
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Lilita One', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['play.nextAria', ['name']], ['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['score']]];
const get = (o, k) => k.split('.').reduce((x, p) => (x ? x[p] : undefined), o);

function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
      const en = Object.fromEntries(flat(L10N.en));
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.')) return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = flat(T).filter(([k, v]) => typeof v === 'string' && !v.trim() && k !== 'fonts.sans').map(([k]) => k);
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    if (!Array.isArray(T.tiers) || T.tiers.length !== C.TIERS.length || T.tiers.some((x) => typeof x !== 'string' || !x.trim())) bad(`${tag} tiers 는 이름 ${C.TIERS.length}개`);
    else if (new Set(T.tiers).size !== T.tiers.length) bad(`${tag} tiers 이름이 겹침`);
    // 자리표시자
    PLACEHOLDERS.forEach(([k, keys]) => {
      const v = String(get(T, k) || '');
      keys.forEach((p) => { if (!v.includes(`{${p}}`)) bad(`${tag} ${k} 에 {${p}} 없음`); });
      (v.match(/\{(\w+)\}/g) || []).forEach((mm) => { if (!keys.includes(mm.slice(1, -1))) bad(`${tag} ${k} 모르는 자리표시자 ${mm}`); });
    });
    flat(T).forEach(([k, v]) => {
      if (typeof v !== 'string' || PLACEHOLDERS.some(([pk]) => pk === k) || k.startsWith('fonts.')) return;
      if (/\{\w+\}/.test(v)) bad(`${tag} ${k} 에 쓰지 않는 자리표시자`);
    });
    if (/\d/.test(T.result.beatAll) || /\d/.test(T.result.comparing)) bad(`${tag} beatAll/comparing 에 숫자 금지 (가짜 숫자처럼 보임)`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
      if (f && f.a && T.tiers.slice(2).some((name) => f.a.includes(name))) bad(`${tag} faq[${i}] 조각 이름을 늘어놓지 않는다 (진화 순서 스포일러)`);
    });
    // 글꼴
    const F = T.fonts || {};
    if (!F.css || !F.display || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display 이상`);
    const disp = firstFont(F.display);
    if (F.css && !F.css.includes(disp.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${disp} 가 없음`);
    if (F.sans && F.css && !F.css.includes(firstFont(F.sans).replace(/ /g, '+'))) bad(`${tag} fonts.css 에 본문 글꼴 ${firstFont(F.sans)} 가 없음`);
    if (lang === 'ru' && !CYRILLIC_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 는 키릴 문자를 지원하지 않음`);
    if (lang === 'vi') {
      if (!VIET_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 는 베트남어 성조를 지원하지 않음`);
      if (!F.sans || !VIET_FONTS.includes(firstFont(F.sans))) bad(`${tag} 본문 글꼴은 베트남어 지원 글꼴(Be Vietnam Pro 등)`);
    }
    if (['en', 'fr', 'de', 'es', 'it', 'pt'].includes(lang) && !LATIN_EXT_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 라틴 확장 확인 필요`);
    if (lang === 'th' && !['Mitr', 'Kanit', 'Mali', 'Prompt'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    if (lang === 'ru' && /\b(вы|вас|вам|ваш)\b/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : ['ru', 'vi'].includes(lang) ? 31 : 34;
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const n = lines(T, lang, txt, h1Size, 328);
      if (n > 1) (isWideLang(lang) ? warn : bad)(`${tag} h1 한 줄 "${txt}" 이 360px 에서 ${n}줄`);
    });
    // 제목·설명 (seo.md)
    const tl = visLen(T.meta.title);
    const wide = isWideLang(lang) && lang !== 'ko';
    if (wide ? tl > 34 : tl > 56) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 34' : '라틴·키릴·한글 56'}자 이하)`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    const low = (x) => String(x || '').toLowerCase();
    if (!low(T.meta.title).includes(low(APP.title[lang]))) bad(`${tag} meta.title 에 app.config 제목 "${APP.title[lang]}" 이 없음`);
    if (!low(T.meta.title).includes(low(T.start.h1Kicker))) bad(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 담지 않음`);
    if (!low(T.start.h1Kicker).includes(low(APP.title[lang]))) bad(`${tag} h1Kicker 에 app.config 제목이 없음`);
    if (!low(T.siteName).includes(low(APP.title[lang]))) bad(`${tag} siteName 에 app.config 제목이 없음`);
    if (!low(T.meta.description).includes(low(APP.title[lang]).split(/[\s–-]/)[0])) warn(`${tag} meta.description 에 검색어가 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 180];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr') {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.meta]);
      const hit = s.match(/.{0,12}[^\u202f\u00a0"][?!:;](?=\s|"|$|')/);
      if (hit && !/https?:/.test(hit[0])) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    // 폭 예산 (360px)
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = (b.factor || displayFactor(T)) * (1 + (b.track || 0));
      const n = lines(T, lang, v, b.size, b.px, f);
      if (n > b.max) (b.soft ? warn : bad)(`${tag} ${b.key} "${v}" 가 360px 에서 ${n}줄 (${b.what})`);
      if (b.word && !isWideLang(lang)) {
        const lw = longestWord(v);
        const ww = emWidth(lw) * b.size * f;
        if (ww > b.word) bad(`${tag} ${b.key} 단어 "${lw}" ≈ ${Math.round(ww)}px > ${Math.round(b.word)}px (단어 잘림)`);
      }
    });
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const mm = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  return mm ? mm[0] : '';
}
// 공통 컴포넌트(shared/base.css·common.js)가 쓰는 mg- 클래스 — 앱이 같은 이름을 쓰면 모양이 섞인다
const SHARED_CLASSES = new Set((fs.readFileSync(path.join(SITE, 'shared', 'base.css'), 'utf8') + fs.readFileSync(path.join(SITE, 'shared', 'common.js'), 'utf8')).match(/\.mg-[a-z0-9-]+/g).map((s) => s.slice(1)).filter((c) => c !== 'mg-ad' && c !== 'mg-ad-start')); // mg-ad·mg-ad-start = 앱이 두라고 정한 광고 자리
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/merge\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/merge\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  const main = (html.match(/<main[\s\S]*<\/main>/) || [''])[0];
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test(main.replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  (main.match(/class="([^"]+)"/g) || []).forEach((m) => m.slice(7, -1).split(/\s+/).forEach((c) => { if (SHARED_CLASSES.has(c)) bad(`${tag} 공통 컴포넌트 클래스 "${c}" 를 앱이 씀`); }));
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
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-all.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"GameApplication"/.test(html)) bad(`${tag} appLd(WebApplication, GameApplication) 없음`);
      const start = section(html, 'screen-start');
      const playS = section(html, 'screen-play');
      const end = section(html, 'screen-end');
      if (!start || !playS || !end) { bad(`${tag} 시작/게임/끝 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-play"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 게임·끝 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (게임 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음 (끝 화면 광고는 공통 컴포넌트가 넣는다)`);
      if (/data-mg-end|mg-faq|<details|sk-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="sk-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="sk-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.tiers.slice(1).some((name) => start.includes(G.esc(name)))) bad(`${tag} 시작 화면에 조각 이름 (스포일러)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-best', 'hud-next', 'pause-btn', 'sk-chain', 'field', 'sk-canvas', 'full-overlay', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="sk-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      const resAt = end.indexOf('class="sk-result"');
      const endAt = end.indexOf('<div data-mg-end="merge"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="merge" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-score', 'res-newbest', 'res-best', 'res-biggest', 'res-biggest-ico', 'res-merges', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="sk-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('merge-core.js') > 0 && html.indexOf('merge-core.js') < html.indexOf('merge.js"'))) bad(`${tag} merge-core.js 가 merge.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://merge.example.com/</loc>') || !sm.includes('<loc>https://merge.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('merge.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('merge.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("merge.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('merge.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('merge.js: setShareData/setRetry 없음');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('merge.js 코드에 한글 문구');
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
  if (APP.id !== 'merge' || APP.category !== 'game' || APP.path !== 'https://merge.example.com/' || APP.added !== '2026-10-02' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
  });
  if (!fs.lstatSync(path.join(SITE, 'shared')).isSymbolicLink() || fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 는 ../../shared 심볼릭 링크');
}

checkCore();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 게임 로직(재현·물리·합치기·점수·끝 조건·실력)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
