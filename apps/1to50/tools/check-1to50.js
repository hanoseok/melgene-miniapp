#!/usr/bin/env node
/**
 * 1to50 검사.
 *   1) 로직(1to50-core.js): 판 = 1..25 순열, classic 줄 = 26..50 순열·quick 줄 없음, 같은 시드 = 같은 판,
 *      맞게 누르면 classic 은 1..25 칸에 줄의 다음 숫자·26..50 칸은 빈칸, quick 은 바로 빈칸, 틀리면 실수 +1(판 그대로)·빈 칸은 무시,
 *      봇 수백 판(정답 + 무작위 실수)이 매 단계 불변식 유지(판에 같은 숫자 두 번 없음·다음 숫자는 언제나 판 위에 있음)하고 끝까지 가면 done·판이 모두 빈칸,
 *      끝난 뒤 입력 무시, 벌점 = 실수 × 0.5초, 서버 인코딩(모드별 game 이름·bucket 0..1999 정수·빠를수록 큼·percentile·plausible).
 *   2) 언어 파일 12개: en.js 와 키 구조, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개, 글꼴(숫자용 Fredoka 포함), 제목·설명 길이, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd / FAQPage 없음 / Supabase 값 없음 /
 *      시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음·모드 2개·방법 3칸(벌점 안내) / 게임 화면에 mg-ad 없음·숫자 칸 미리 없음 / 끝 화면: 결과 카드 → data-mg-end="1to50" / 스크립트 순서 /
 *      앱 JS: track start·done 한 곳씩, pointerdown 입력, 3-2-1, 일시정지(visibilitychange), prefers-reduced-motion, 언어별 주소 없음, 한글 문구 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크, tools/hub-curation.json(12개 언어·2줄 길이).
 *
 * 실행: node tools/check-1to50.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, '1to50-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const sorted = (a) => a.slice().sort((x, y) => x - y);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function invariants(s, tag) {
  const nums = s.cells.filter(Boolean);
  if (new Set(nums).size !== nums.length) bad(`${tag} 판에 같은 숫자가 두 번`);
  if (nums.some((v) => v < s.next)) bad(`${tag} 이미 누른 숫자가 판에 남음`);
  if (s.status === 'play' && s.cells.indexOf(s.next) < 0) bad(`${tag} 다음 숫자 ${s.next} 가 판에 없음 (진행 불가)`);
  if (s.cells.length !== C.CELLS) bad(`${tag} 칸 수 ${s.cells.length}`);
}
function checkCore() {
  if (C.SIZE !== 5 || C.CELLS !== 25) bad('판은 5×5');
  if (!same(C.MODE_ORDER, ['classic', 'quick']) || C.MODES.classic.max !== 50 || C.MODES.quick.max !== 25) bad('모드: classic 1→50, quick 1→25');
  Object.values(C.MODES).forEach((m) => { if (!/^[a-z0-9-]{1,32}$/.test(m.game)) bad(`game 이름 "${m.game}" 은 ^[a-z0-9-]{1,32}$ (서버 규칙)`); });
  if (C.MODES.classic.game === C.MODES.quick.game) bad('모드마다 game 이름이 달라야 함');
  if (C.PENALTY_MS !== 500) bad('벌점은 0.5초 (안내 문구와 같게)');
  // 새 판
  for (let seed = 1; seed <= 200; seed++) {
    const a = C.newGame('classic', seed);
    if (!same(sorted(a.cells), range(1, 25))) bad(`classic 판이 1..25 순열이 아님 (seed ${seed})`);
    if (!same(sorted(a.queue), range(26, 50))) bad(`classic 줄이 26..50 순열이 아님 (seed ${seed})`);
    const q = C.newGame('quick', seed);
    if (!same(sorted(q.cells), range(1, 25)) || q.queue.length) bad(`quick 판/줄 (seed ${seed})`);
    if (a.next !== 1 || a.mistakes !== 0 || a.status !== 'play') bad('새 판 상태');
  }
  if (!same(C.newGame('classic', 7), C.newGame('classic', 7))) bad('같은 시드 = 같은 판이어야 함');
  if (same(C.newGame('classic', 7).cells, C.newGame('classic', 8).cells)) bad('다른 시드인데 판이 같음');
  // 판이 고르게 섞이는지 (1 이 놓이는 칸 분포)
  const pos = new Array(25).fill(0);
  for (let seed = 1; seed <= 5000; seed++) pos[C.newGame('quick', seed).cells.indexOf(1)]++;
  if (Math.min(...pos) < 120 || Math.max(...pos) > 290) bad(`숫자 1 의 위치가 고르지 않음 ${Math.min(...pos)}..${Math.max(...pos)}`);
  try { C.newGame('nope'); bad('모르는 모드에 오류가 없음'); } catch (e) { /* ok */ }

  // 한 번 누르기
  const s = C.newGame('classic', 3);
  const i1 = C.indexOf(s, 1), i2 = C.indexOf(s, 2), q0 = s.queue[0];
  const w = C.tap(s, i2);
  if (!w.ok || !w.wrong || s.mistakes !== 1 || s.cells[i2] !== 2 || s.next !== 1) bad('틀린 칸: 실수 +1, 판 그대로');
  const r = C.tap(s, i1);
  if (!r.ok || !r.correct || r.replaced !== q0 || s.cells[i1] !== q0 || s.next !== 2 || s.queue.length !== 24) bad('classic: 1 을 누르면 그 칸에 줄의 첫 숫자(26..50)');
  if (C.tap(s, -1).ok || C.tap(s, 25).ok || C.tap(s, 1.5).ok || C.tap(s, '3').ok) bad('범위 밖 칸 입력이 받아짐');
  const qq = C.newGame('quick', 3);
  const qi = C.indexOf(qq, 1);
  C.tap(qq, qi);
  if (qq.cells[qi] !== 0 || qq.next !== 2) bad('quick: 누른 칸은 바로 빈칸');
  const blank = C.tap(qq, qi);
  if (blank.ok || !blank.blank || qq.mistakes !== 0) bad('빈 칸은 무시(실수 아님)');
  if (C.penaltyMs({ mistakes: 3 }) !== 1500) bad('벌점 = 실수 × 500ms');

  // 봇: 정답 + 무작위 실수/빈칸, 매 단계 불변식
  const rnd = C.mulberry32(2026);
  let games = 0;
  C.MODE_ORDER.forEach((m) => {
    for (let n = 0; n < 250; n++) {
      const g = C.newGame(m, 1000 + n);
      const seen = new Set(g.cells);
      let wrongs = 0, guard = 0;
      while (g.status === 'play' && guard++ < 2000) {
        if (rnd() < 0.2) {
          const j = Math.floor(rnd() * 25);
          const v = g.cells[j];
          const want = g.next;
          const res = C.tap(g, j);
          if (v && v !== want) { wrongs++; if (!res.wrong) bad(`[${m} #${n}] 틀린 칸이 실수로 안 셈`); }
          if (res.replaced) seen.add(res.replaced);
        } else {
          const res = C.tap(g, C.indexOf(g, g.next));
          if (!res.correct) bad(`[${m} #${n}] 다음 숫자를 눌렀는데 정답 아님`);
          if (res.replaced) seen.add(res.replaced);
        }
        invariants(g, `[${m} #${n}]`);
      }
      games++;
      if (g.status !== 'done' || g.next !== g.max + 1) bad(`[${m} #${n}] 끝까지 못 감 (next ${g.next})`);
      if (g.cells.some(Boolean)) bad(`[${m} #${n}] 끝났는데 판에 숫자가 남음`);
      if (g.mistakes !== wrongs) bad(`[${m} #${n}] 실수 ${g.mistakes} ≠ ${wrongs}`);
      if (!same(sorted([...seen]), range(1, g.max))) bad(`[${m} #${n}] 판에 나온 숫자가 1..${g.max} 한 번씩이 아님`);
      if (C.tap(g, 0).ok) bad(`[${m} #${n}] 끝난 뒤에도 입력됨`);
      if (C.progress(g) !== 1) bad('끝난 판 progress 1');
    }
  });

  // 서버 인코딩
  if (C.bucket(0) !== C.MAX_BUCKET || C.bucket(10) <= C.bucket(60) || C.bucket(99999) !== 0) bad('bucket: 빠를수록 큼·0..1999');
  if (C.bucket(23.45) !== 1999 - 235 || C.bucket(23.44) !== 1999 - 234) bad('bucket: 0.1초 단위');
  [0, 0.2, 7.3, 59, 199.9, 1000, 1e6, NaN].forEach((t) => { const v = C.bucket(t); if (!Number.isInteger(v) || v < 0 || v > C.MAX_BUCKET) bad(`bucket(${t}) = ${v} 범위 밖`); });
  const rows = [{ score_bucket: 1900, players: 10 }, { score_bucket: 1950, players: 5 }, { score_bucket: 1990, players: 20 }];
  const p = C.percentile(rows, 1950);
  if (!p || p.total !== 35 || p.first || p.top < 1 || p.top > 100) bad('percentile 계산');
  if (!C.percentile([{ score_bucket: 1950, players: 1 }], 1950).first) bad('percentile: 혼자면 first');
  if (!C.percentile([], 1950).first) bad('percentile: 빈 분포면 first(숨김)');
  if (C.percentile(null, 5) !== null || C.percentile('x', 5) !== null) bad('percentile: 잘못된 입력은 null');
  if (C.percentile([{ score_bucket: 1990, players: 9 }], 1900).top < 90) bad('percentile: 느린 기록은 상위 % 가 커야 함');
  if (C.plausible('classic', 3) || !C.plausible('classic', 20) || C.plausible('quick', 1) || !C.plausible('quick', 9) || C.plausible('x', 20) || C.plausible('classic', NaN)) bad('plausible: 말이 안 되게 빠른 기록은 보내지 않음');
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
const HOW = (328 - 16) / 3 - 12;                 // 방법 칸 글자 폭
const MODE = (328 - 10) / 2 - 12 - 4;            // 모드 칸 글자 폭
const HUD_S = (328 - 16) / 3.3 - 16;             // HUD 다음·진행 칸 (1 : 1.3 : 1)
const HUD_T = (328 - 16) * 1.3 / 3.3 - 16;       // HUD 시간 칸
const STAT = (328 - 32 - 8) / 2 - 12 - 3;        // 통계 칸
const HEAD = 328 - 32 - 4 - 48;                  // 결과 머리 줄 (이모지 38 + 간격 10)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄' },
  { key: 'start.hook', get: (T) => T.start.hook, px: 328, size: 16, max: 5, what: '훅 다섯 줄까지', factor: 1.0 },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지', factor: 1.0 },
  ...['order', 'swap', 'penalty'].map((k) => ({ key: `start.how.${k}`, get: (T) => T.start.how[k], px: HOW, size: 13, max: 3, what: '방법 칸 세 줄까지', word: HOW })),
  ...['classic', 'quick'].map((k) => ({ key: `start.modes.${k}`, get: (T) => T.start.modes[k], px: MODE, size: 16, max: 1, what: '모드 이름 한 줄', word: MODE })),
  { key: 'play.next', get: (T) => T.play.next, px: HUD_S, size: 12, max: 1, what: 'HUD 다음 이름표', factor: 1.0 },
  { key: 'play.progress', get: (T) => T.play.progress, px: HUD_S, size: 12, max: 1, what: 'HUD 진행 이름표', factor: 1.0 },
  { key: 'play.time', get: (T) => T.play.time, px: HUD_T, size: 12, max: 1, what: 'HUD 시간 이름표', factor: 1.0 },
  { key: 'play.go', get: (T) => T.play.go, px: 300, size: 96, max: 1, what: '카운트다운 GO 한 줄', factor: 0.62 },
  { key: 'play.paused', get: (T) => T.play.paused, px: 290, size: 21, max: 3, what: '일시정지 안내 세 줄까지' },
  { key: 'result.done', get: (T) => T.result.done, px: HEAD, size: 24, max: 1, what: '결과 머리 한 줄', word: HEAD },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 24, size: 15, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{t}', '123,45 ' + T.result.sec), px: 328 - 32, size: 15, max: 1, what: '최고 기록 한 줄', factor: 1.0 },
  { key: 'result.mistakesLabel', get: (T) => T.result.mistakesLabel, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.perLabel', get: (T) => T.result.perLabel, px: STAT, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.penNote', get: (T) => T.result.penNote.replace('{s}', '12,5'), px: 328 - 32, size: 13, max: 2, what: '벌점 안내 두 줄까지', factor: 1.0 },
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
const PLACEHOLDERS = [['result.best', ['t']], ['result.penNote', ['s']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['time', 'max']]];
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
    if (!T.start.modes || C.MODE_ORDER.some((k) => !T.start.modes[k]) || new Set(Object.values(T.start.modes)).size !== 2) bad(`${tag} start.modes 는 서로 다른 이름 2개`);
    // 벌점 안내: 시작 화면 방법 칸에 0.5 가 보여야 함 (규칙을 숨기지 않는다)
    if (!/0[.,]5/.test(T.start.how.penalty)) bad(`${tag} start.how.penalty 에 벌점 0.5초가 안 보임`);
    if (!T.play.aBlank || !T.play.go) bad(`${tag} play.aBlank / play.go`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·랭킹·하트·별점 류 질문 금지: ${f.q}`);
    });
    if (!T.faq.some((f) => /0[.,]5/.test(f.a))) bad(`${tag} FAQ 에 벌점(0.5초) 설명이 없음`);
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
  if (!/<link rel="canonical" href="https:\/\/1to50\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/1to50\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|ot-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="ot-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="ot-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      if (!start.includes(G.esc(T.start.how.penalty))) bad(`${tag} 시작 화면 방법 칸에 벌점 안내가 없음`);
      if (start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').length > 560) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-next', 'hud-time', 'hud-pen', 'hud-prog', 'bar-fill', 'field', 'board', 'count', 'pause-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<div id="board" class="ot-board" role="group"/.test(playS)) bad(`${tag} 판은 <div id="board" class="ot-board" role="group">`);
      if (/class="ot-cell/.test(html)) bad(`${tag} 숫자 칸이 HTML 에 미리 들어 있음 (판은 시작할 때 JS 로 만든다)`);
      if (!/<button id="pause-btn"[^>]*hidden/.test(playS) || !/<div id="count"[^>]*hidden/.test(playS)) bad(`${tag} 일시정지·카운트다운 덮개는 처음에 hidden`);
      if ((start.match(/role="radio"/g) || []).length !== 2 || !/id="modes"[^>]*role="radiogroup"/.test(start)) bad(`${tag} 시작 화면 모드 라디오 2개`);
      C.MODE_ORDER.forEach((k) => { if (!start.includes(`data-mode="${k}"`)) bad(`${tag} 모드 ${k} 버튼 없음`); });
      const resAt = end.indexOf('class="ot-result"');
      const endAt = end.indexOf('<div data-mg-end="1to50"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="1to50" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-mode', 'res-head', 'res-big', 'res-newbest', 'res-best', 'res-miss', 'res-per', 'res-pen', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="ot-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('1to50-core.js') > 0 && html.indexOf('1to50-core.js') < html.indexOf('1to50.js"'))) bad(`${tag} 1to50-core.js 가 1to50.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://1to50.example.com/</loc>') || !sm.includes('<loc>https://1to50.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  const js = read('1to50.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('1to50.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("1to50.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('1to50.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('1to50.js: setShareData/setRetry 없음');
  if (!/addEventListener\('pointerdown'/.test(js)) bad('1to50.js: 칸 입력은 pointerdown (300ms 지연 없음)');
  if (!/COUNT_STEP/.test(js) || !/P\.go/.test(js)) bad('1to50.js: 3-2-1 카운트다운 없음');
  if (!/visibilitychange/.test(js) || !/document\.hidden/.test(js)) bad('1to50.js: 탭을 숨기면 일시정지(visibilitychange) 없음');
  if (!/localStorage/.test(js)) bad('1to50.js: 최고 기록(localStorage) 없음');
  if (!/supa\.submitScore\(C\.MODES\[mode\]\.game/.test(js)) bad('1to50.js: supa.submitScore(모드 game 이름, …) 없음');
  if (!/C\.plausible\(/.test(js)) bad('1to50.js: 말이 안 되게 빠른 기록 거르기 없음');
  if (!/C\.penaltyMs\(/.test(js)) bad('1to50.js: 벌점을 시간에 더하지 않음');
  if (!/requestAnimationFrame/.test(js) || !/secs2/.test(js)) bad('1to50.js: 0.01초 시계 없음');
  if (/supabase|\.supabase\.co/i.test(js)) bad('1to50.js 에 Supabase 주소');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('1to50.js 코드에 한글 문구');
  const css = read('style.css');
  if (!/\.ot-board\s*\{[^}]*touch-action:\s*manipulation/.test(css)) bad('style.css: 판 touch-action: manipulation (더블탭 확대 막기)');
  if (!/\.ot-cell\s*\{[^}]*touch-action:\s*manipulation/.test(css)) bad('style.css: 칸 touch-action: manipulation');
  if (!/user-select:\s*none/.test(css)) bad('style.css: 판 user-select: none');
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
  if (APP.id !== '1to50' || APP.category !== 'game' || APP.path !== 'https://1to50.example.com/' || APP.added !== '2026-10-14' || APP.order !== 1 || APP.emoji !== '🔢') bad('app.config.js id/category/path/added/order/emoji');
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
console.log(`\n봇 ${games}판 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 게임 로직(1..25 판·26..50 줄·정답/실수/빈칸·벌점·결정성·봇)·서버 점수 분포(bucket 0.1초·백분위·plausible), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·모드 2개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
