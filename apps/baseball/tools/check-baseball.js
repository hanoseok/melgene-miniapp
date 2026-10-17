#!/usr/bin/env node
/**
 * baseball(숫자 야구 · Bulls and Cows) 검사.
 *   1) 로직(baseball-core.js): 난이도 2개(3·4자리), 비밀 숫자 = 서로 다른 숫자·맨 앞 0 허용·crypto 거부 샘플링 Fisher–Yates 고름, 판정(스트라이크·볼·아웃)을
 *      3자리 전수(720×720)·4자리 표본으로 정의 그대로 센 값과 대조 + 손계산, 입력 검사(길이·모양·중복·이미 시도), 시도 횟수·기록·정답·포기,
 *      후보 지우기 봇(검사 전용) 수백 판이 끝까지 가고 불변식 유지, 서버 인코딩(난이도별 game 이름·bucket = 1000 − 시도·percentile·plausible).
 *   2) 언어 파일 12개: en.js 와 키 구조, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(무료·인기 질문 금지), 글꼴(숫자용 Fredoka 포함), 제목·설명 길이, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd / FAQPage 없음 / Supabase 값 없음 /
 *      시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음·자릿수 2개·타이머 선택·한 줄 방법 / 게임 화면에 mg-ad 없음·비밀 숫자 미리 없음·숫자 패드 10개 / 끝 화면: 결과 카드 → data-mg-end="baseball" / 스크립트 순서 /
 *      앱 JS: track start·done 한 곳씩, pointerdown 입력, 포기 두 번 누르기, 힌트·후보 계산 코드 없음, 일시정지(visibilitychange), prefers-reduced-motion, 언어별 주소 없음, 한글 문구 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크, tools/hub-curation.json(12개 언어·2줄 길이).
 *
 * 실행: node tools/check-baseball.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'baseball-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const allDistinct = (s) => new Set(s.split('')).size === s.length;
function brute(secret, guess) {   // 정의 그대로 센 판정 (core.judge 와 대조)
  let s = 0, b = 0;
  for (let i = 0; i < guess.length; i++) for (let j = 0; j < secret.length; j++) if (guess[i] === secret[j]) { if (i === j) s++; else b++; }
  return { s, b };
}
function allNumbers(d) {
  const out = [];
  const rec = (cur) => { if (cur.length === d) { out.push(cur); return; } for (let k = 0; k < 10; k++) if (!cur.includes(String(k))) rec(cur + k); };
  rec('');
  return out;
}
function checkCore() {
  if (!same(C.LEVEL_ORDER, ['d3', 'd4'])) bad('난이도 순서 d3, d4');
  if (C.LEVELS.d3.digits !== 3 || C.LEVELS.d4.digits !== 4) bad('자릿수 3·4');
  Object.values(C.LEVELS).forEach((m) => { if (!/^[a-z0-9-]{1,32}$/.test(m.game) || !/^baseball-/.test(m.game)) bad(`game 이름 "${m.game}" 은 ^baseball-[a-z0-9-]+$ (서버 규칙)`); });
  if (new Set(Object.values(C.LEVELS).map((m) => m.game)).size !== 2) bad('난이도마다 game 이름이 달라야 함');

  // crypto 난수 범위·고름
  for (const n of [1, 2, 3, 7, 10]) for (let k = 0; k < 500; k++) { const v = C.cryptoRandInt(n); if (!Number.isInteger(v) || v < 0 || v >= n) bad(`cryptoRandInt(${n}) = ${v}`); }
  const perm = {};
  const N = 60000;
  for (let k = 0; k < N; k++) { const a = C.shuffle([0, 1, 2], C.cryptoRandInt).join(''); perm[a] = (perm[a] || 0) + 1; }
  const pv = Object.values(perm);
  if (pv.length !== 6 || Math.min(...pv) < N / 6 * 0.93 || Math.max(...pv) > N / 6 * 1.07) bad(`섞기가 고르지 않음 ${JSON.stringify(perm)}`);

  // 비밀 숫자: 길이·서로 다른 숫자·맨 앞 0 허용·모든 숫자·모든 자리가 고르게 (기본 = crypto)
  const first = {}, any = {};
  let leadZero = 0;
  const T3 = 30000;
  for (let k = 0; k < T3; k++) {
    const s = C.newSecret(3);
    if (s.length !== 3 || !/^[0-9]+$/.test(s) || !allDistinct(s)) bad(`비밀 숫자 모양 ${s}`);
    first[s[0]] = (first[s[0]] || 0) + 1;
    if (s[0] === '0') leadZero++;
    s.split('').forEach((c) => { any[c] = (any[c] || 0) + 1; });
  }
  const fv = Object.values(first);
  if (fv.length !== 10 || Math.min(...fv) < T3 / 10 * 0.9 || Math.max(...fv) > T3 / 10 * 1.1) bad(`맨 앞 숫자 분포가 고르지 않음 ${JSON.stringify(first)}`);
  if (leadZero === 0) bad('맨 앞이 0 인 비밀 숫자가 한 번도 안 나옴 (0 허용 규칙)');
  const av = Object.values(any);
  if (av.length !== 10 || Math.min(...av) < T3 * 3 / 10 * 0.93 || Math.max(...av) > T3 * 3 / 10 * 1.07) bad(`숫자 분포가 고르지 않음 ${JSON.stringify(any)}`);
  const sec4 = {};
  for (let k = 0; k < 20000; k++) { const s = C.newSecret(4); if (s.length !== 4 || !allDistinct(s)) bad(`4자리 비밀 숫자 ${s}`); sec4[s] = 1; }
  if (Object.keys(sec4).length < 4000) bad(`4자리 비밀 숫자 가짓수 ${Object.keys(sec4).length} (5040 중 4000 이상 나와야 함)`);
  if (C.newSecret(3, C.seededRandInt(5)) !== C.newSecret(3, C.seededRandInt(5))) bad('같은 시드 = 같은 비밀 숫자');
  try { C.newSecret(5); bad('5자리에 오류가 없음'); } catch (e) { /* ok */ }
  try { C.newGame('nope'); bad('모르는 난이도에 오류가 없음'); } catch (e) { /* ok */ }

  // 판정: 전수(3자리 720 × 720, 4자리 5040 중 표본)를 정의 그대로 센 값과 대조 + 몇 가지 손계산
  const A3 = allNumbers(3);
  if (A3.length !== 720) bad(`3자리 전체 ${A3.length} ≠ 720`);
  let n = 0;
  A3.forEach((sec) => A3.forEach((g) => {
    const j = C.judge(sec, g), b = brute(sec, g);
    n++;
    if (j.s !== b.s || j.b !== b.b || j.out !== (b.s + b.b === 0)) bad(`judge(${sec},${g}) = ${JSON.stringify(j)} ≠ ${JSON.stringify(b)}`);
    if (j.s + j.b > 3 || (j.s === 2 && j.b === 1)) bad(`judge(${sec},${g}) 불가능한 값 ${JSON.stringify(j)}`);
  }));
  const A4 = allNumbers(4);
  if (A4.length !== 5040) bad(`4자리 전체 ${A4.length} ≠ 5040`);
  const rnd = C.seededRandInt(2026);
  for (let k = 0; k < 20000; k++) {
    const sec = A4[rnd(A4.length)], g = A4[rnd(A4.length)];
    const j = C.judge(sec, g), b = brute(sec, g);
    if (j.s !== b.s || j.b !== b.b) bad(`judge(${sec},${g}) 4자리`);
    if (j.s + j.b > 4 || (j.s === 3 && j.b === 1)) bad(`judge(${sec},${g}) 4자리 불가능한 값`);
  }
  const hand = [['123', '123', 3, 0], ['123', '132', 1, 2], ['123', '312', 0, 3], ['123', '145', 1, 0], ['123', '456', 0, 0], ['123', '321', 1, 2], ['072', '270', 1, 2], ['072', '075', 2, 0], ['9876', '6789', 0, 4], ['1234', '1243', 2, 2], ['1234', '1567', 1, 0], ['0123', '0124', 3, 0]];
  hand.forEach(([sec, g, s, b]) => { const j = C.judge(sec, g); if (j.s !== s || j.b !== b || j.out !== (s + b === 0)) bad(`손계산 judge(${sec},${g}) = ${j.s}S${j.b}B (기대 ${s}S${b}B)`); });

  // 입력 검사
  const V = [['123', 3, null], ['012', 3, null], ['12', 3, 'len'], ['1234', 3, 'len'], ['', 3, 'len'], ['112', 3, 'dup'], ['1a3', 3, 'char'], ['12 ', 3, 'char'], ['-12', 3, 'char'], ['１２３', 3, 'char'], ['1234', 4, null], ['1123', 4, 'dup']];
  V.forEach(([s, d, want]) => { const got = C.validate(s, d); if (got !== want) bad(`validate("${s}", ${d}) = ${got} (기대 ${want})`); });
  if (C.validate(123, 3) !== 'char' || C.validate(null, 3) !== 'char') bad('validate: 문자열이 아니면 char');

  // 한 판 진행
  const g = C.newGame('d3', C.seededRandInt(11));
  if (g.status !== 'play' || g.tries !== 0 || g.history.length || g.digits !== 3 || g.secret.length !== 3) bad('새 판 상태');
  const wrongG = [...A3].find((x) => x !== g.secret && C.judge(g.secret, x).s === 0);
  let r = C.guess(g, '12');
  if (r.ok || r.err !== 'len' || g.tries !== 0) bad('틀린 길이는 시도로 세지 않음');
  r = C.guess(g, '11x');
  if (r.ok || g.tries !== 0) bad('틀린 모양은 시도로 세지 않음');
  r = C.guess(g, '112');
  if (r.ok || r.err !== 'dup' || g.tries !== 0) bad('중복 숫자는 시도로 세지 않음');
  r = C.guess(g, wrongG);
  if (!r.ok || g.tries !== 1 || g.history.length !== 1 || g.history[0].guess !== wrongG || r.done) bad('첫 시도: tries 1, 기록 1');
  r = C.guess(g, wrongG);
  if (r.ok || r.err !== 'again' || g.tries !== 1) bad('이미 시도한 숫자는 다시 세지 않음');
  const stray = C.guess(g, g.secret);
  if (!stray.ok || !stray.done || g.status !== 'won' || g.tries !== 2 || stray.s !== 3) bad('정답: done, won, 3 스트라이크');
  if (C.guess(g, wrongG).ok) bad('끝난 판은 입력을 받지 않음');
  if (C.giveUp(g) !== null) bad('끝난 판은 포기 불가');
  const h = C.newGame('d4', C.seededRandInt(12));
  C.guess(h, '0123' === h.secret ? '4567' : '0123');
  if (C.giveUp(h) !== h.secret || h.status !== 'gaveup' || C.guess(h, '0123').ok) bad('포기: 정답 공개, 이후 입력 안 받음');
  if (!C.plausible('d3', 1)) bad('plausible: 첫 시도 정답도 가능');

  // 봇: 후보를 하나씩 지우는 풀이 봇(검사 전용 — 앱에는 이런 코드가 없다)이 수백 판을 끝까지 풀고 불변식을 지킨다
  let games = 0, worst3 = 0, worst4 = 0;
  [['d3', 400, A3], ['d4', 300, A4]].forEach(([lv, count, all]) => {
    for (let k = 0; k < count; k++) {
      const st = C.newGame(lv, C.seededRandInt(5000 + k));
      let cand = all.slice();
      let guard = 0;
      while (st.status === 'play' && guard++ < 40) {
        const pick = cand[rnd(cand.length)];
        const res = C.guess(st, pick);
        if (!res.ok) { bad(`[${lv} #${k}] 후보 추리가 거부됨 ${pick} ${res.err}`); break; }
        cand = cand.filter((c) => { const j = C.judge(c, pick); return j.s === res.s && j.b === res.b; });
        if (!cand.includes(st.secret)) { bad(`[${lv} #${k}] 후보에서 정답이 사라짐`); break; }
        if (st.history.length !== st.tries) bad(`[${lv} #${k}] 기록 수 ≠ tries`);
      }
      games++;
      if (st.status !== 'won' || st.history[st.history.length - 1].guess !== st.secret) bad(`[${lv} #${k}] 끝까지 못 감`);
      if (lv === 'd3') worst3 = Math.max(worst3, st.tries); else worst4 = Math.max(worst4, st.tries);
      if (!C.plausible(lv, st.tries)) bad(`[${lv} #${k}] plausible(${st.tries}) 거짓`);
    }
  });
  if (worst3 > 12 || worst4 > 14) bad(`후보 지우기 봇이 너무 오래 걸림 (3자리 최대 ${worst3}, 4자리 최대 ${worst4}) — 판정이 이상할 수 있음`);

  // 서버 인코딩
  if (C.bucket(1) !== 999 || C.bucket(5) <= C.bucket(9) || C.bucket(0) !== 999 || C.bucket(99999) !== 1) bad('bucket: 적을수록 큼');
  [1, 2, 7, 30, 999, 1e6, NaN].forEach((t) => { const v = C.bucket(t); if (!Number.isInteger(v) || v < 0 || v > 100000) bad(`bucket(${t}) = ${v} 범위 밖`); });
  if (C.bucket(6) !== 994) bad('bucket(6) = 1000 − 6');
  const rows = [{ score_bucket: 990, players: 10 }, { score_bucket: 994, players: 5 }, { score_bucket: 996, players: 20 }];
  const p = C.percentile(rows, 994);
  if (!p || p.total !== 35 || p.first || p.top < 1 || p.top > 100) bad('percentile 계산');
  if (!C.percentile([{ score_bucket: 994, players: 1 }], 994).first) bad('percentile: 혼자면 first');
  if (!C.percentile([], 994).first) bad('percentile: 빈 분포면 first(숨김)');
  if (C.percentile(null, 5) !== null || C.percentile('x', 5) !== null) bad('percentile: 잘못된 입력은 null');
  if (C.percentile([{ score_bucket: 999, players: 9 }], 980).top < 90) bad('percentile: 많이 걸린 기록은 상위 % 가 커야 함');
  if (C.plausible('d3', 0) || C.plausible('d3', 1.5) || C.plausible('x', 5) || C.plausible('d4', NaN) || C.plausible('d4', 1000) || !C.plausible('d4', 7)) bad('plausible: 말이 안 되는 기록은 보내지 않음');
  return games;
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
// 제목 글꼴 폭 보정
const displayFactor = (T) => ({ Fredoka: 1.05, Jua: 0.95, 'M PLUS Rounded 1c': 1.0, 'ZCOOL KuaiLe': 1.0, Mitr: 1.08, 'Baloo 2': 1.0, Rubik: 1.06 }[firstFont(T.fonts.display)] || 1.1);
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
// 360px 폭(본문 칸 328px) 예산 — style.css 와 맞춘다
const LEVEL = (328 - 10) / 2 - 12 - 4;            // 자릿수 칸 글자 폭
const HUD_S = 160 - 16 - 2;                       // HUD 칸 (max 160px)
const HEAD = 328 - 32 - 4 - 46;                   // 결과 머리 줄 (이모지 36 + 간격 10)
const STAT = 140 - 24 - 3;                        // 결과 시간 칸
const KEYTXT = (328 - 32) / 5 * 2 + 8 - 8 - 34;   // 지우기 키 글자 폭 (⌫ 아이콘 제외)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄' },
  { key: 'start.hook', get: (T) => T.start.hook, px: 328, size: 16, max: 5, what: '훅 다섯 줄까지', factor: 1.0 },
  { key: 'start.how', get: (T) => T.start.how, px: 328, size: 14, max: 3, what: '한 줄 방법 세 줄까지' },
  { key: 'start.timer', get: (T) => T.start.timer, px: 328 - 28, size: 15, max: 1, what: '타이머 선택 한 줄', factor: 1.0 },
  ...['d3', 'd4'].map((k) => ({ key: `start.levels.${k}`, get: (T) => T.start.levels[k], px: LEVEL, size: 18, max: 1, what: '자릿수 이름 한 줄', word: LEVEL })),
  ...['d3', 'd4'].map((k) => ({ key: `start.levelSub.${k}`, get: (T) => T.start.levelSub[k], px: LEVEL, size: 14, max: 1, what: '자릿수 부제 한 줄', word: LEVEL, factor: 1.0 })),
  { key: 'play.tries', get: (T) => T.play.tries, px: HUD_S, size: 12, max: 1, what: 'HUD 시도 이름표', factor: 1.0 },
  { key: 'play.time', get: (T) => T.play.time, px: HUD_S, size: 12, max: 1, what: 'HUD 시간 이름표', factor: 1.0 },
  { key: 'play.enter', get: (T) => T.play.enter, px: (328 - 32) / 5 * 3 + 16 - 8, size: 20, max: 1, what: '맞히기 키 한 줄' },
  { key: 'play.del', get: (T) => T.play.del, px: KEYTXT, size: 14, max: 2, what: '지우기 키 두 줄까지', word: KEYTXT },
  { key: 'play.giveUp', get: (T) => T.play.giveUp, px: 328 - 28, size: 15, max: 1, what: '포기 버튼 한 줄', factor: 1.0 },
  { key: 'play.giveUpSure', get: (T) => T.play.giveUpSure, px: 328 - 28, size: 15, max: 2, what: '포기 확인 두 줄까지', factor: 1.0 },
  { key: 'play.historyTitle', get: (T) => T.play.historyTitle, px: 328, size: 16, max: 1, what: '기록 제목 한 줄' },
  { key: 'play.historyEmpty', get: (T) => T.play.historyEmpty, px: 328 - 30, size: 14, max: 2, what: '기록 빈 안내 두 줄까지', factor: 1.0 },
  { key: 'play.errLen', get: (T) => T.play.errLen.replace('{n}', '4'), px: 328, size: 15, max: 2, what: '자릿수 오류 두 줄까지', factor: 1.0 },
  { key: 'play.errDup', get: (T) => T.play.errDup, px: 328, size: 15, max: 2, what: '중복 오류 두 줄까지', factor: 1.0 },
  { key: 'play.errAgain', get: (T) => T.play.errAgain, px: 328, size: 15, max: 2, what: '이미 시도 오류 두 줄까지', factor: 1.0 },
  { key: 'play.legend', get: (T) => T.play.legend, px: 328, size: 13, max: 3, what: '범례 세 줄까지', factor: 1.0 },
  { key: 'play.strike', get: (T) => T.play.strike + ' 3', px: 200, size: 13, max: 1, what: '스트라이크 칩 한 줄', factor: 1.0 },
  { key: 'play.ball', get: (T) => T.play.ball + ' 3', px: 200, size: 13, max: 1, what: '볼 칩 한 줄', factor: 1.0 },
  { key: 'play.out', get: (T) => T.play.out, px: 200, size: 13, max: 1, what: '아웃 칩 한 줄', factor: 1.0 },
  { key: 'result.done', get: (T) => T.result.done, px: HEAD, size: 24, max: 2, what: '결과 머리 두 줄까지', word: HEAD },
  { key: 'result.gaveUp', get: (T) => T.result.gaveUp, px: HEAD, size: 24, max: 2, what: '결과 머리 두 줄까지', word: HEAD },
  { key: 'result.secretLabel', get: (T) => T.result.secretLabel, px: 296, size: 13, max: 1, what: '정답 이름표', factor: 1.0 },
  { key: 'result.triesCaption', get: (T) => T.result.triesCaption, px: 296, size: 13, max: 1, what: '횟수 이름표', factor: 1.0 },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 24, size: 15, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '12') + ' · 123,4 ' + T.result.sec, px: 328 - 32, size: 15, max: 2, what: '최고 기록 두 줄까지', factor: 1.0 },
  { key: 'result.timeLabel', get: (T) => T.result.timeLabel, px: STAT, size: 13, max: 2, what: '시간 칸 이름 두 줄까지', word: STAT },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 32 - 24, size: 28, max: 1, what: '상위 % 한 줄', factor: 1.0 },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 32 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 32 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 32 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro'];
const LATIN_EXT_FONTS = ['Fredoka'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['play.slotAria', ['n']], ['play.errLen', ['n']], ['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['d', 'n']]];
const get = (o, k) => k.split('.').reduce((x, p) => (x ? x[p] : undefined), o);

function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE|__PRIVACY__/.test(src)) bad(`${tag} 번역 대기/자리표시 문구가 남아 있음`);
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
    if (!T.start.levels || C.LEVEL_ORDER.some((k) => !T.start.levels[k] || !T.start.levelSub[k]) || new Set(Object.values(T.start.levels)).size !== 2) bad(`${tag} start.levels·levelSub 는 서로 다른 이름 2개`);
    if (!/3/.test(T.start.levels.d3) || !/4/.test(T.start.levels.d4)) bad(`${tag} start.levels 에 자릿수 3·4 가 없음`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
    });
    // FAQ 의 가능한 비밀 숫자 수 = 실제 (10×9×8)
    const faqText = T.faq.map((f) => f.a).join(' ');
    if (!faqText.includes('720')) bad(`${tag} FAQ 에 3자리 가능한 수 720 이 없음`);
    if (!/\b0\b/.test(T.faq[1].a) && !/072/.test(faqText)) bad(`${tag} FAQ 에 맨 앞 0 허용 설명(072)이 없음`);
    // 글꼴
    const F = T.fonts || {};
    if (!F.css || !F.display || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display 이상`);
    if (F.css && !F.css.includes('family=Fredoka')) bad(`${tag} fonts.css 에 숫자용 Fredoka 가 없음`);
    const disp = firstFont(F.display);
    if (F.css && !F.css.includes(disp.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${disp} 가 없음`);
    if (F.sans && F.css && !F.css.includes(firstFont(F.sans).replace(/ /g, '+'))) bad(`${tag} fonts.css 에 본문 글꼴 ${firstFont(F.sans)} 가 없음`);
    if (lang === 'ru' && !CYRILLIC_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 는 키릴 문자를 지원하지 않음`);
    if (lang === 'vi') {
      if (!VIET_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 는 베트남어 성조를 지원하지 않음`);
      if (!F.sans || !VIET_FONTS.includes(firstFont(F.sans))) bad(`${tag} 본문 글꼴은 베트남어 지원 글꼴(Be Vietnam Pro 등)`);
    }
    if (['en', 'fr', 'de', 'es', 'it', 'pt'].includes(lang) && !LATIN_EXT_FONTS.includes(disp)) bad(`${tag} 글꼴 "${disp}" 라틴 확장 확인 필요`);
    if (lang === 'th' && !['Mitr', 'Kanit', 'Chakra Petch'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    if (lang === 'ru' && /(^|[^а-яё])(вы|вас|вам|ваш)([^а-яё]|$)/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || (h1.match(/<em>[^<]+<\/em>/g) || []).length !== 1 || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em>…</em> 강조 1개만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : 31;
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const n = lines(T, lang, txt, h1Size, 328);
      if (n > 1) (isWideLang(lang) ? warn : bad)(`${tag} h1 한 줄 "${txt}" 이 360px 에서 ${n}줄`);
    });
    // 제목·설명 (seo.md) — 검색어 = app.config 제목(현지 이름)
    const tl = visLen(T.meta.title);
    const wide = isWideLang(lang) && lang !== 'ko';
    if (wide ? tl > 34 : tl > 56) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 34' : '라틴·키릴·한글 56'}자 이하)`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    const low = (x) => String(x || '').toLowerCase();
    if (!low(T.meta.title).startsWith(low(APP.title[lang]))) bad(`${tag} meta.title 이 app.config 제목 "${APP.title[lang]}" 으로 시작하지 않음`);
    if (low(T.start.h1Kicker) !== low(APP.title[lang])) bad(`${tag} h1Kicker 는 app.config 제목 그대로`);
    if (!low(T.siteName).includes(low(APP.title[lang]))) bad(`${tag} siteName 에 app.config 제목이 없음`);
    if (!low(T.meta.ogTitle).includes(low(APP.title[lang]))) warn(`${tag} ogTitle 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    if (!low(T.meta.description).includes(low(APP.title[lang]))) warn(`${tag} meta.description 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 190];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const mm = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (mm) bad(`${tag} 한글이 남아 있음: "${mm[0]}"`);
    }
    if (lang === 'fr') {
      const s = JSON.stringify([T.start, T.play, T.result, T.og, T.faq, T.meta]);
      const hit = s.match(/.{0,12}[^  "][?!:;](?=\s|"|$|')/);
      if (hit && !/https?:/.test(hit[0])) bad(`${tag} ?·!·:·; 앞은 좁은 줄바꿈 없는 공백(U+202F): "${hit[0]}"`);
    }
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const f = b.factor || displayFactor(T);
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
const SHARED_CLASSES = new Set((fs.readFileSync(path.join(SITE, 'shared', 'base.css'), 'utf8') + fs.readFileSync(path.join(SITE, 'shared', 'common.js'), 'utf8')).match(/\.mg-[a-z0-9-]+/g).map((s) => s.slice(1)).filter((c) => c !== 'mg-ad' && c !== 'mg-ad-start'));
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/baseball\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/baseball\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js && MG_I18N_MODE=variant node tools/gen-i18n.js)`); return; }
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
      if (/data-mg-end|mg-faq|<details|bb-result|bb-history/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과/기록`);
      if (!/<h1 class="bb-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="bb-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if (!start.includes(`<p class="bb-how">${G.esc(T.start.how)}</p>`)) bad(`${tag} 시작 화면 한 줄 방법이 없음`);
      if (start.indexOf('id="start-btn"') > start.indexOf('class="bb-how"')) bad(`${tag} 한 줄 방법은 시작 버튼 아래`);
      if (start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-tries', 'hud-time-box', 'hud-time', 'slots', 'msg', 'pad', 'del-btn', 'enter-btn', 'history', 'history-empty', 'giveup-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<div id="slots" class="bb-slots" role="group"[^>]*><\/div>/.test(playS)) bad(`${tag} 입력칸은 비어 있는 <div id="slots"> (자릿수는 시작할 때 JS 가 만든다)`);
      if ((playS.match(/class="bb-key" data-d="\d"/g) || []).length !== 10 || new Set(playS.match(/data-d="(\d)"/g)).size !== 10) bad(`${tag} 숫자 패드 0~9 열 개`);
      if (!/<div id="hud-time-box"[^>]*hidden>/.test(playS)) bad(`${tag} 시간 칸은 처음에 hidden (타이머는 선택)`);
      if (/class="bb-(row|tile)"|bb-secret/.test(playS) || /bb-tile/.test(start)) bad(`${tag} 비밀 숫자/추리 기록이 HTML 에 미리 들어 있음`);
      if (!/<div id="res-secret" class="bb-secret"[^>]*><\/div>/.test(end)) bad(`${tag} 끝 화면 정답 칸은 비어 있음 (정답은 JS 가 판마다 채움)`);
      if ((start.match(/role="radio"/g) || []).length !== 2 || !/id="levels"[^>]*role="radiogroup"/.test(start)) bad(`${tag} 시작 화면 자릿수 라디오 2개`);
      if (!/<input id="timer-opt" type="checkbox">/.test(start) || /id="timer-opt"[^>]*checked/.test(start)) bad(`${tag} 타이머 선택 체크박스(처음엔 꺼짐)`);
      C.LEVEL_ORDER.forEach((k) => { if (!start.includes(`data-level="${k}"`)) bad(`${tag} 난이도 ${k} 버튼 없음`); });
      const resAt = end.indexOf('class="bb-result"');
      const endAt = end.indexOf('<div data-mg-end="baseball"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="baseball" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-level', 'res-head', 'res-secret-label', 'res-secret', 'res-big', 'res-newbest', 'res-best', 'res-time-box', 'res-time', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="bb-rank" hidden>/.test(end) || !/<div id="res-time-box" class="bb-stat" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('baseball-core.js') > 0 && html.indexOf('baseball-core.js') < html.indexOf('baseball.js"'))) bad(`${tag} baseball-core.js 가 baseball.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://baseball.example.com/</loc>') || !sm.includes('<loc>https://baseball.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  const js = read('baseball.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('baseball.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("baseball.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('baseball.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('baseball.js: setShareData/setRetry 없음');
  if (!/addEventListener\('pointerdown'/.test(js)) bad('baseball.js: 패드 입력은 pointerdown (300ms 지연 없음)');
  if (!/addEventListener\('keydown'/.test(js) || !/Backspace/.test(js)) bad('baseball.js: 키보드 입력(숫자·Backspace·Enter) 없음');
  if (!/C\.giveUp\(/.test(js) || !/sureArmed/.test(js)) bad('baseball.js: 포기는 두 번 눌러야 정답 공개');
  if (/\b(candidates?|remaining|possible|hints?|solver?|suggest\w*|entropy|eliminat\w*)\b/i.test(js) || /\b(candidates?|remaining|possible|hints?|solver?|suggest\w*|entropy|eliminat\w*)\b/i.test(read('baseball-core.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''))) bad('힌트·풀이 도움 코드로 보이는 이름이 있음 (앱은 힌트 없음)');
  if (!/visibilitychange/.test(js) || !/document\.hidden/.test(js)) bad('baseball.js: 탭을 숨기면 일시정지(visibilitychange) 없음');
  if (!/localStorage/.test(js)) bad('baseball.js: 최고 기록(localStorage) 없음');
  if (!/supa\.submitScore\(C\.LEVELS\[level\]\.game/.test(js) || !/C\.bucket\(tries\)/.test(js)) bad('baseball.js: supa.submitScore(난이도 game 이름, bucket(tries)) 없음');
  if (!/state\.status !== 'won'/.test(js)) bad('baseball.js: 서버 점수는 맞힌 판만 (포기한 판은 보내지 않음)');
  if (!/BEST_KEY/.test(js) || !/baseball_best_v1/.test(js)) bad('baseball.js: 난이도별 최고 기록 키');
  if (!/C\.plausible\(/.test(js)) bad('baseball.js: 말이 안 되는 기록 거르기 없음');
  if (!/C\.newGame\(level\)/.test(js)) bad('baseball.js: 판은 crypto 난수(newGame 기본)로');
  if (!/requestAnimationFrame/.test(js) || !/secs1/.test(js) || !/baseball_timer_v1/.test(js)) bad('baseball.js: 선택형 0.1초 시계 없음');
  if (/supabase|\.supabase\.co/i.test(js)) bad('baseball.js 에 Supabase 주소');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('baseball.js 코드에 한글 문구');
  const core = read('baseball-core.js');
  if (!/getRandomValues/.test(core) || !/4294967296 % n/.test(core)) bad('baseball-core.js: crypto 거부 샘플링 없음');
  const css = read('style.css');
  if (!/\.bb-pad\s*\{[^}]*touch-action:\s*manipulation/.test(css)) bad('style.css: 패드 touch-action: manipulation (더블탭 확대 막기)');
  if (!/\.bb-key\s*\{[^}]*touch-action:\s*manipulation/.test(css)) bad('style.css: 키 touch-action: manipulation');
  if (!/user-select:\s*none/.test(css)) bad('style.css: 패드 user-select: none');
  if (!/prefers-reduced-motion/.test(css)) bad('style.css: prefers-reduced-motion 없음');
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
  if (APP.id !== 'baseball' || APP.category !== 'game' || APP.path !== 'https://baseball.example.com/' || APP.added !== '2026-10-18' || APP.order !== 1 || APP.emoji !== '⚾') bad('app.config.js id/category/path/added/order/emoji');
  if (path.basename(SITE) !== APP.id || !/^[a-z0-9-]{1,32}$/.test(APP.id)) bad('app.config.js id ≠ 폴더 이름');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
  });
  if (!fs.lstatSync(path.join(SITE, 'shared')).isSymbolicLink() || fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 는 ../../shared 심볼릭 링크');
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
}

// 포털 큐레이션 문구(머지용): apps/hub/tools/i18n/<lang>.js curation.items 와 같은 모양·같은 2줄 추정 (check-hub.js 의 em/linesAt)
function hubEm(str) {
  let w = 0;
  for (const ch of String(str)) {
    if (/[ᄀ-ᇿ⺀-鿿가-힯＀-￯　-〿]/.test(ch)) w += 1;
    else if (THAI_MARK(ch.codePointAt(0))) w += 0;
    else if (/[฀-๿]/.test(ch)) w += 0.62;
    else if (/\s/.test(ch)) w += 0.28;
    else if (/[A-ZÀ-ÞĐƠƯА-ЯЁ]/.test(ch)) w += 0.66;
    else w += 0.54;
  }
  return w;
}
function hubLines(str, px, width) {
  const ws = /[฀-๿぀-ヿ一-鿿]/.test(str) ? [...str] : str.split(/(?<=\s)/);
  let n = 1, cur = 0;
  ws.forEach((w) => { const ww = hubEm(w) * px; if (cur + ww > width && cur > 0) { n++; cur = ww; } else cur += ww; });
  return n;
}
function checkCuration() {
  const f = path.join(SITE, 'tools', 'hub-curation.json');
  if (!fs.existsSync(f)) return bad('tools/hub-curation.json 없음 (포털 큐레이션 문구)');
  let J;
  try { J = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return bad(`hub-curation.json 파싱 실패 ${e.message}`); }
  G.LOCALES.forEach(({ code: lang }) => {
    const it = J[lang];
    if (!it || !it.kicker || !it.headline || !it.blurb || Object.keys(it).length !== 3) return bad(`[${lang}] hub-curation: kicker/headline/blurb 셋만`);
    if (hubEm(it.kicker) * 13 > 190) bad(`[${lang}] hub-curation 키커가 한 줄에 안 들어감: ${it.kicker}`);
    if (hubLines(it.headline, 20, 250) > 2) bad(`[${lang}] hub-curation 헤드라인 2줄 초과: ${it.headline}`);
    if (hubLines(it.blurb, 13.5, 262) > 2) bad(`[${lang}] hub-curation 소개 2줄 초과: ${it.blurb}`);
    if (lang !== 'ko' && /[가-힯]/.test(JSON.stringify(it))) bad(`[${lang}] hub-curation 에 한글`);
  });
  if (Object.keys(J).length !== G.LOCALES.length) bad('hub-curation.json 언어 수 ≠ 12');
}

const games = checkCore();
checkCuration();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n봇 ${games}판 · 판정 전수 대조(3자리 720×720) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 게임 로직(비밀 숫자 crypto 고름·맨 앞 0·판정 전수 대조·입력 검사·시도/포기·후보 지우기 봇·서버 점수 bucket·percentile·plausible), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·자릿수 2개·타이머 선택·게임 중 광고 없음·정답 미리 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
