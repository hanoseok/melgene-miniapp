#!/usr/bin/env node
/**
 * 할로윈 사탕 받기 게임 검사.
 *   1) 로직(candy-catch-core.js): 물건 6종(id 중복 없음, 사탕 점수 > 0, 방해물 0점), 난이도 곡선(속도·간격·방해물 비율 단조),
 *      콤보 배수 경계, 같은 시드 + 같은 입력 = 같은 판(재현), 큰 dt 는 50ms 로 나눠 같은 결과,
 *      봇 수천 판(잘 받는 봇·가만히·무작위·방해물 쫓기): 언제나 끝남, 시간 끝 = 50초·목숨 > 0, 목숨 끝 = 0개·50초 이전,
 *      점수 = 받은 사탕 사건 점수 합, 각 사건 점수 = 기본 점수 × multiplier(콤보), 놓치거나 맞으면 콤보 0,
 *      물건 수 계산(받음 + 놓침 + 맞음 + 피함 + 남음 = 생성), 바구니는 필드 안, 무적 시간 중 두 번째 방해물은 목숨을 안 깎음,
 *      잘 받는 봇은 대부분 시간 끝까지 살아남고 점수가 충분히 나옴(공정함), 후반 방해물 비율·낙하 속도가 전반보다 큼.
 *      서버 인코딩: game 이름 ^[a-z0-9-]{1,32}$, bucket 0..1999 정수, percentile(높을수록 좋음)·잘못된 행 무시·실패 null·혼자면 first.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 영어 그대로 남은 문구 없음, 자리표시자,
 *      FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순/랭킹 류 금지), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원),
 *      제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산(버튼·배지·방법 3칸·HUD 이름표·끝 화면 문구).
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음(시작 화면 것 말고 페이지 전체 0개 — 끝 화면 광고는 공통 컴포넌트) / 끝 화면: 결과 카드 → data-mg-end="candy-catch" 순서 /
 *      FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-candy-catch.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'candy-catch-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const kindOf = (id) => C.BY_ID[id].kind;
function mulberry(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// 봇: 매 틱 입력을 정한다
const BOTS = {
  good(s) {
    const hz = s.items.filter((i) => kindOf(i.type) === 'hazard' && i.y < C.RIM_Y && i.y > C.RIM_Y - 130);
    const c = s.items.filter((i) => kindOf(i.type) === 'candy' && i.y < C.RIM_Y).sort((a, b) => b.y - a.y)[0];
    let target = c ? c.x : null;
    const danger = hz.find((h) => Math.abs(h.x - (target == null ? s.x : target)) < 62);
    if (danger) target = danger.x < C.W / 2 ? danger.x + 130 : danger.x - 130;
    return { target, dir: 0 };
  },
  idle() { return { target: null, dir: 0 }; },
  random(s, rnd) { return rnd() < 0.5 ? { target: rnd() * C.W, dir: 0 } : { target: null, dir: rnd() < 0.33 ? -1 : rnd() < 0.5 ? 1 : 0 }; },
  chaser(s) { const h = s.items.filter((i) => kindOf(i.type) === 'hazard').sort((a, b) => b.y - a.y)[0]; return { target: h ? h.x : C.W / 2, dir: 0 }; },
};
function play(seed, bot, rnd, dt = 1000 / 60) {
  const s = C.newGame(seed);
  const ev = [];
  let guard = 0;
  let outside = false;
  let comboOk = true;
  while (!s.over && guard++ < 10000) {
    const before = s.combo;
    const e = C.step(s, dt, BOTS[bot](s, rnd));
    e.forEach((x) => {
      ev.push(x);
      if (x.type === 'catch' && x.points !== C.BY_ID[x.item].points * C.multiplier(x.combo)) comboOk = false;
    });
    if (e.some((x) => x.type === 'hit' || x.type === 'miss') && !e.some((x) => x.type === 'catch') && s.combo !== 0) comboOk = false;
    if (s.combo > s.maxCombo) comboOk = false;
    if (s.x < C.BASKET_W / 2 - 1e-9 || s.x > C.W - C.BASKET_W / 2 + 1e-9) outside = true;
    void before;
  }
  return { s, ev, guard, outside, comboOk };
}

function checkCore() {
  // 물건 표
  const ids = C.ITEMS.map((i) => i.id);
  if (new Set(ids).size !== ids.length || ids.join() !== 'wrap,lolly,choco,star,spider,ghost') bad(`ITEMS id 순서/중복: ${ids}`);
  C.ITEMS.forEach((it) => {
    if (it.kind === 'candy' && !(it.points > 0 && it.weight > 0)) bad(`사탕 ${it.id} 점수/비율`);
    if (it.kind === 'hazard' && it.points !== 0) bad(`방해물 ${it.id} 점수는 0`);
    if (!(it.r > 10 && it.r < 30)) bad(`물건 ${it.id} 반지름 ${it.r}`);
  });
  if (C.DURATION < 45000 || C.DURATION > 60000) bad(`한 판 길이 ${C.DURATION}ms (45~60초)`);
  // 곡선
  let prev = null;
  for (let d = 0; d <= 1.0001; d += 0.05) {
    const cur = { v: C.fallSpeed(d), g: C.spawnGap(d), h: C.hazardChance(d) };
    if (prev && !(cur.v > prev.v && cur.g < prev.g && cur.h > prev.h)) bad(`난이도 곡선이 단조롭지 않음 (d=${d.toFixed(2)})`);
    if (cur.h > 0.4 || cur.g < 300) bad(`난이도가 너무 가파름 (d=${d.toFixed(2)})`);
    prev = cur;
  }
  [[0, 1], [4, 1], [5, 2], [9, 2], [10, 3], [19, 3], [20, 4], [99, 4]].forEach(([c, m]) => { if (C.multiplier(c) !== m) bad(`multiplier(${c}) ≠ ${m}`); });

  // 재현 · 큰 dt
  const a = play(777, 'random', mulberry(1));
  const b = play(777, 'random', mulberry(1));
  if (JSON.stringify(a.s) !== JSON.stringify(b.s)) bad('같은 시드 + 같은 입력인데 결과가 다름');
  const s1 = C.newGame(42), s2 = C.newGame(42);
  C.step(s1, 12000, { target: 300, dir: 0 });
  for (let i = 0; i < 240; i++) C.step(s2, 50, { target: 300, dir: 0 });
  if (JSON.stringify(s1) !== JSON.stringify(s2)) bad('step(12000) 과 step(50)×240 결과가 다름 (큰 dt 나누기)');
  const s3 = C.newGame(1); C.step(s3, -5, {}); C.step(s3, NaN, {});
  if (s3.t !== 0) bad('음수/NaN dt 는 무시해야 함');

  // 바구니 이동
  const m = C.newGame(3);
  C.step(m, 100, { target: null, dir: 1 });
  if (Math.abs(m.x - (C.W / 2 + C.KEY_SPEED * 0.1)) > 1e-6) bad(`방향키 이동 ${m.x}`);
  C.step(m, 5000, { target: null, dir: 1 });
  if (m.x !== C.W - C.BASKET_W / 2) bad('방향키로 오른쪽 끝을 넘음');
  C.step(m, 20, { target: 0, dir: 0 });
  if (Math.abs(m.x - (C.W - C.BASKET_W / 2 - C.FOLLOW_SPEED * 0.02)) > 1e-6) bad('끌기 최고 속도 제한이 다름');

  // 무적
  const inv = C.newGame(5);
  inv.spawnAt = 1e9;
  inv.items = [
    { id: 1, type: 'spider', x: 200, baseX: 200, y: C.RIM_Y - 5, vy: 300, phase: 0, spin: 0, born: 0 },
    { id: 2, type: 'spider', x: 200, baseX: 200, y: C.RIM_Y - 40, vy: 300, phase: 0, spin: 0, born: 0 },
  ];
  const ie = C.step(inv, 200, { target: 200, dir: 0 });
  if (inv.lives !== C.LIVES - 1 || ie.filter((e) => e.type === 'hit').length !== 1) bad(`무적 시간 중 두 번째 방해물이 목숨을 깎음 (lives ${inv.lives})`);
  // 콤보 · 놓침
  const cm = C.newGame(6);
  cm.spawnAt = 1e9;
  cm.items = [0, 1, 2, 3, 4, 5].map((k) => ({ id: k + 1, type: 'wrap', x: 200, baseX: 200, y: C.RIM_Y - 3 - k * 6, vy: 200, phase: 0, spin: 0, born: 0 }));
  C.step(cm, 200, { target: 200, dir: 0 });
  if (cm.combo !== 6 || cm.score !== 10 * 4 + 20 * 2) bad(`콤보 6개 점수 ${cm.score} (기대 80), combo ${cm.combo}`);
  cm.items = [{ id: 9, type: 'lolly', x: 30, baseX: 30, y: C.H + 5, vy: 200, phase: 0, spin: 0, born: 0 }];
  const me = C.step(cm, 200, { target: 300, dir: 0 });
  if (cm.combo !== 0 || cm.missed !== 1 || !me.some((e) => e.type === 'miss')) bad('사탕을 놓쳤는데 콤보가 그대로');

  // 봇 판
  const stats = {};
  let early = { hz: 0, n: 0, v: 0 }, late = { hz: 0, n: 0, v: 0 };
  Object.keys(BOTS).forEach((bot) => {
    const st = (stats[bot] = { games: 0, time: 0, lives: 0, score: 0, maxScore: 0 });
    const N = bot === 'good' ? 300 : 700;
    for (let i = 0; i < N; i++) {
      const seed = (i * 2654435761 + bot.length * 97) >>> 0;
      const rnd = mulberry(seed ^ 0x9e3779b9);
      // 난이도 관찰: 생성 기록
      const r = play(seed, bot, rnd, i % 3 === 0 ? 1000 / 30 : 1000 / 60);
      const { s, ev } = r;
      const tag = `[${bot} seed ${seed}]`;
      st.games++;
      if (!s.over || r.guard >= 10000) { bad(`${tag} 끝나지 않음`); continue; }
      if (s.reason === 'time') { st.time++; if (s.t !== C.DURATION || s.lives <= 0) bad(`${tag} 시간 끝인데 t=${s.t} lives=${s.lives}`); }
      else if (s.reason === 'lives') { st.lives++; if (s.lives !== 0 || s.t > C.DURATION || s.hits !== C.LIVES) bad(`${tag} 목숨 끝 상태 이상 lives=${s.lives} hits=${s.hits}`); }
      else bad(`${tag} 끝 이유 ${s.reason}`);
      const sum = ev.filter((e) => e.type === 'catch').reduce((x, e) => x + e.points, 0);
      if (sum !== s.score) bad(`${tag} 점수 ${s.score} ≠ 사건 합 ${sum}`);
      if (ev.filter((e) => e.type === 'catch').length !== s.caught || ev.filter((e) => e.type === 'hit').length !== s.hits) bad(`${tag} 사건 수와 합계가 다름`);
      if (s.caught + s.missed + s.hits + s.dodged + s.items.length < s.spawned || s.caught + s.missed + s.dodged + s.items.length > s.spawned) bad(`${tag} 물건 수 계산이 안 맞음`);
      if (ev.filter((e) => e.type === 'end').length !== 1) bad(`${tag} end 사건 ${ev.filter((e) => e.type === 'end').length}개`);
      if (r.outside) bad(`${tag} 바구니가 필드 밖`);
      if (!r.comboOk) bad(`${tag} 콤보·배수 계산 이상`);
      if (s.score % 10 !== 0) bad(`${tag} 점수가 10의 배수가 아님`);
      if (C.bucket(s.score) > C.MAX_BUCKET) bad(`${tag} bucket 한도 밖`);
      st.score += s.score;
      st.maxScore = Math.max(st.maxScore, s.score);
    }
  });
  // 전반/후반 비교 (생성 직후 상태를 보려고 짧게 한 번 더 돌린다)
  for (let i = 0; i < 60; i++) {
    const s = C.newGame(1000 + i);
    const seen = new Set();
    while (!s.over) {
      C.step(s, 1000 / 60, BOTS.good(s));
      s.items.forEach((it) => {
        if (seen.has(it.id)) return;
        seen.add(it.id);
        const bin = it.born < 15000 ? early : it.born > C.DURATION - 15000 ? late : null;
        if (!bin) return;
        bin.n++; bin.v += it.vy; if (kindOf(it.type) === 'hazard') bin.hz++;
      });
    }
  }
  if (!(late.hz / late.n > early.hz / early.n * 1.3)) bad(`후반 방해물 비율(${(late.hz / late.n).toFixed(2)})이 전반(${(early.hz / early.n).toFixed(2)})보다 충분히 크지 않음`);
  if (!(late.v / late.n > early.v / early.n * 1.4)) bad('후반 낙하 속도가 전반보다 충분히 빠르지 않음');
  if (!(late.n / 15 > early.n / 15 * 1.3)) bad('후반 생성 수가 전반보다 충분히 많지 않음');
  const gd = stats.good;
  if (gd.time / gd.games < 0.8) bad(`잘 받는 봇이 시간 끝까지 살아남는 비율 ${(gd.time / gd.games * 100).toFixed(0)}% (80% 이상이어야 공정)`);
  if (gd.score / gd.games < 1500) bad(`잘 받는 봇 평균 점수 ${Math.round(gd.score / gd.games)} (너무 어려움)`);
  if (stats.chaser.lives !== stats.chaser.games) bad(`방해물을 쫓는 봇이 목숨을 다 잃지 않은 판이 있음 (${stats.chaser.lives}/${stats.chaser.games})`);
  if (stats.idle.score / stats.idle.games > gd.score / gd.games / 5) bad('가만히 있는 봇 점수가 너무 높음');
  if (gd.maxScore / 10 > C.MAX_BUCKET * 0.8) warn(`최고 점수 ${gd.maxScore} 가 bucket 한도에 가까움`);

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
  const p4 = C.percentile([{ score_bucket: 50, players: 3 }, { score_bucket: 80, players: 2 }], 50);
  if (!p4 || p4.beatPct !== 25 || p4.top !== 75) bad(`동점 절반 ${JSON.stringify(p4)}`);
  if (C.percentile(null, 1) !== null || C.percentile({}, 1) !== null || C.percentile(rows, null) !== null) bad('실패 응답이면 null');
  const junk = C.normalizeHist([null, { score_bucket: 'x', players: 3 }, { score_bucket: 3, players: -1 }, { bucket: 7, players: 2 }, { score_bucket: 7, players: 1 }]);
  if (JSON.stringify(junk) !== '[{"bucket":7,"players":3}]') bad(`normalizeHist 가 잘못된 행을 거르지 않음 ${JSON.stringify(junk)}`);
  // 백분위가 점수에 대해 단조
  const hist = [];
  for (let bk = 0; bk < 600; bk += 7) hist.push({ score_bucket: bk, players: 1 + (bk % 5) });
  let last = -1;
  for (let bk = 0; bk < 600; bk += 13) { const q = C.percentile(hist, bk); if (q.beat < last - 1e-9) bad(`percentile 이 점수에 대해 줄어듦 (${bk})`); last = q.beat; }

  const g = stats.good, n = (x) => Math.round(x.score / x.games);
  console.log(`\n=== 로직: 봇 ${Object.values(stats).reduce((x, s) => x + s.games, 0).toLocaleString()}판 — 잘 받는 봇 평균 ${n(g)}점(최고 ${g.maxScore}, 시간 끝 ${Math.round(g.time / g.games * 100)}%) · 가만히 ${n(stats.idle)}점 · 무작위 ${n(stats.random)}점 · 방해물 쫓기 목숨 끝 ${stats.chaser.lives}/${stats.chaser.games} · 방해물 비율 전반 ${(early.hz / early.n * 100).toFixed(0)}% → 후반 ${(late.hz / late.n * 100).toFixed(0)}% ===`);
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
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 1, what: '사실 한 줄' },
  { key: 'start.how.move', get: (T) => T.start.how.move, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.catch', get: (T) => T.start.how.catch, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.avoid', get: (T) => T.start.how.avoid, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  // HUD 칸: (328 - 44 - 18) = 266 → 1.25 : 1 : 1 → 102 / 82 / 82, 안쪽 여백 16+3 → 83 / 63 / 63 (이름표 한 줄, 넘치면 … 로 잘림)
  { key: 'play.score', get: (T) => T.play.score, px: 83, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.time', get: (T) => T.play.time, px: 63, size: 11, max: 1, what: 'HUD 시간 이름표', track: 0.06 },
  { key: 'play.lives', get: (T) => T.play.lives, px: 63, size: 11, max: 1, what: 'HUD 목숨 이름표', track: 0.06 },
  { key: 'play.combo', get: (T) => T.play.combo.replace('{n}', '4'), px: 328 - 60, size: 18, max: 1, what: '콤보 알약 한 줄' },
  { key: 'play.go', get: (T) => T.play.go, px: 328 - 36, size: 52, max: 1, what: '카운트다운 시작 글자' },
  { key: 'play.paused', get: (T) => T.play.paused, px: 328 - 36, size: 34, max: 1, what: '일시정지 제목' },
  { key: 'play.resume', get: (T) => T.play.resume, px: 328 - 90, size: 18, max: 1, what: '계속하기 버튼' },
  { key: 'result.timeUp', get: (T) => T.result.timeUp, px: 328 - 32 - 32, size: 16, max: 1, what: '끝 이유 배지' },
  { key: 'result.outOfLives', get: (T) => T.result.outOfLives, px: 328 - 32 - 32, size: 16, max: 1, what: '끝 이유 배지' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '12,340'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.caught', get: (T) => T.result.caught, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.streak', get: (T) => T.result.streak, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Lilita One', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['play.livesAria', ['n']], ['play.combo', ['n']], ['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['score']]];
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
      if (f && f.a && /\b(10|20|30|50)\s?(points|pts|점|点|分|แต้ม|điểm|puntos|punti|pontos|Punkte|очк)/i.test(f.a)) bad(`${tag} faq[${i}] 사탕별 점수표를 늘어놓지 않는다`);
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
    if (!low(T.meta.description).includes(low(APP.title[lang]).split(/[\s-]/)[0])) warn(`${tag} meta.description 에 검색어가 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 175];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr' && /[^  ][?!:;](?=\s|$|')/.test(JSON.stringify([T.start, T.play, T.result, T.og, T.faq]).replace(/https?:[^"]+/g, '').replace(/\\u[0-9a-f]{4}/g, ''))) {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq]);
      const hit = s.match(/.{0,12} [?!:;]/);
      if (hit) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    // 폭 예산 (360px)
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = (b.factor || displayFactor(T)) * (1 + (b.track || 0));
      const n = lines(T, lang, v, b.size, b.px, f);
      if (n > b.max) bad(`${tag} ${b.key} "${v}" 가 360px 에서 ${n}줄 (${b.what})`);
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
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/candy-catch\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/candy-catch\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
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
      if (/mg-ad/.test(playS)) bad(`${tag} 게임 화면에 mg-ad (액션 게임은 진행 중 광고 없음)`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 0) bad(`${tag} 시작 화면 mg-ad-start 말고 따로 둔 mg-ad 가 있음 (끝 화면 광고는 공통 컴포넌트가 넣는다)`);
      if (/data-mg-end|mg-faq|<details|cc-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="cc-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="cc-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-time', 'hud-timebar', 'hud-lives', 'pause-btn', 'field', 'cc-canvas', 'combo', 'countdown', 'pause-overlay', 'resume-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<canvas id="cc-canvas"/.test(playS)) bad(`${tag} 캔버스 없음`);
      const resAt = end.indexOf('class="cc-result"');
      const endAt = end.indexOf('<div data-mg-end="candy-catch"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="candy-catch" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-score', 'res-newbest', 'res-best', 'res-caught', 'res-streak', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="cc-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('candy-catch-core.js') > 0 && html.indexOf('candy-catch-core.js') < html.indexOf('candy-catch.js"'))) bad(`${tag} candy-catch-core.js 가 candy-catch.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://candy-catch.example.com/</loc>') || !sm.includes('<loc>https://candy-catch.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('candy-catch.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('candy-catch.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("candy-catch.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('candy-catch.js: 탭 전환 일시정지·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('candy-catch.js: setShareData/setRetry 없음');
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
  if (APP.id !== 'candy-catch' || APP.category !== 'game' || APP.path !== 'https://candy-catch.example.com/' || APP.added !== '2026-09-30' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
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
console.log('\n결과: 통과 — 게임 로직(재현·점수·콤보·목숨·난이도·공정함)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
