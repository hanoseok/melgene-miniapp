#!/usr/bin/env node
/**
 * 음식 월드컵 검사.
 *   1) 로직(food-cup-core.js): 음식 16개(id·이모지 중복 없음), 시드 셔플이 순열이고 같은 시드면 같은 대진(재현),
 *      무작위 대진 × 무작위 선택 수천 판: 언제나 15경기, 16강에 모든 음식이 한 번씩, 라운드 8→4→2→1 경기,
 *      다음 라운드 = 앞 라운드 승자(순서대로), 우승 = 결승 진출자 중 하나, 4강 = 8강 승자, 끝난 뒤 pick 은 그대로.
 *      서버 인코딩: 모든 경기 qid(m<lo>-<hi>, 120개)·우승 qid(c0/c1) 가 ^[a-z0-9_-]{1,32}$, opt 0..9, qid 500개 이하, 되돌림 가능.
 *      합계 기준: 경기 합계 < 10 · 우승 합계 < 20 이면 숫자 없음(null), 잘못된 행은 무시.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 음식 이름 16개(카드 폭 360/375px 안에),
 *      FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지), 한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어),
 *      제목(= app.config 제목 포함)·설명 길이, h1 모양, 360px 폭 예산, 시작 전 문구(메타·시작·OG)에 음식 이름 없음(스포일러).
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(vote) / FAQPage 없음 / Supabase 값 없음 / 시작 화면에 mg-ad·FAQ·음식 이름 없음 / 경기 화면 mg-ad 1개(페이지 전체 1개) /
 *      끝 화면: 결과 카드 → data-mg-end="food-cup" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-food-cup.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'food-cup-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
function playRandom(seed, rnd) {
  let g = CORE.newGame(seed);
  const log = [];
  let guard = 0;
  while (!CORE.isDone(g) && guard++ < 40) {
    const c = CORE.current(g);
    const side = rnd() < 0.5 ? 0 : 1;
    log.push({ c, winner: side ? c.b : c.a });
    g = CORE.pick(g, side);
  }
  return { g, log };
}
function checkCore() {
  const F = CORE.FOODS;
  if (F.length !== 16 || CORE.N !== 16) bad(`음식은 16개여야 함 (${F.length})`);
  if (new Set(F.map((f) => f.id)).size !== F.length) bad('음식 id 중복');
  if (new Set(F.map((f) => f.emoji)).size !== F.length) bad('음식 이모지 중복');
  F.forEach((f) => {
    if (!/^[a-z]{2,16}$/.test(f.id)) bad(`음식 id 모양: ${f.id}`);
    if (!/^#[0-9a-f]{6}$/i.test(f.plate)) bad(`${f.id} plate 색 모양`);
    if (!/\p{Extended_Pictographic}/u.test(f.emoji)) bad(`${f.id} 이모지가 아님: ${f.emoji}`);
  });
  if (CORE.TOTAL_MATCHES !== 15) bad('TOTAL_MATCHES 는 15');

  // 시드 셔플: 순열 + 재현 + 고르게
  const pos0 = new Array(16).fill(0);
  const seen = new Set();
  const SEEDS = 16000;
  const rnd = CORE.mulberry32(20260929);
  for (let i = 0; i < SEEDS; i++) {
    const seed = Math.floor(rnd() * 4294967296) >>> 0;
    const a = CORE.shuffle(16, seed);
    const b = CORE.newGame(seed).rounds[0];
    if (a.slice().sort((x, y) => x - y).join() !== [...Array(16).keys()].join()) { bad(`shuffle 이 순열이 아님 (seed ${seed})`); break; }
    if (a.join() !== b.join() || CORE.newGame(seed).rounds[0].join() !== b.join()) { bad(`같은 시드인데 대진이 다름 (seed ${seed})`); break; }
    pos0[a[0]]++;
    seen.add(a.join());
  }
  const expect = SEEDS / 16;
  pos0.forEach((n, i) => { if (n < expect * 0.8 || n > expect * 1.2) bad(`셔플이 치우침: 음식 ${i} 가 첫 자리 ${n}회 (기대 ${expect})`); });
  if (seen.size < SEEDS * 0.99) bad(`서로 다른 대진이 너무 적음 ${seen.size}/${SEEDS}`);
  if (CORE.newGame(1).rounds[0].join() === CORE.newGame(2).rounds[0].join()) bad('시드 1·2 대진이 같음');

  // 무작위 판
  let games = 0;
  const champSeen = new Set();
  const qidSeen = new Set();
  for (let i = 0; i < 5000; i++) {
    const seed = (i * 2654435761) >>> 0;
    const { g, log } = playRandom(seed, CORE.mulberry32(i + 7));
    const tag = `seed ${seed}`;
    if (log.length !== 15) { bad(`${tag}: 경기 수 ${log.length} ≠ 15`); continue; }
    if (!CORE.isDone(g) || CORE.picks(g) !== 15 || CORE.current(g) !== null) { bad(`${tag}: 15경기 뒤 끝나지 않음`); continue; }
    const r = g.rounds;
    if (r.length !== 4 || r.map((x) => x.length).join() !== '16,8,4,2') { bad(`${tag}: 라운드 크기 ${r.map((x) => x.length)}`); continue; }
    if (new Set(r[0]).size !== 16) bad(`${tag}: 16강에 음식이 한 번씩이 아님`);
    // 경기 로그: 라운드·경기 번호·짝
    const perRound = { r16: 8, qf: 4, sf: 2, f: 1 };
    const cnt = { r16: 0, qf: 0, sf: 0, f: 0 };
    log.forEach(({ c, winner }, k) => {
      cnt[c.round]++;
      if (c.matches !== perRound[c.round]) bad(`${tag}: ${c.round} 경기 수 표시 ${c.matches}`);
      if (c.overall !== k + 1) bad(`${tag}: overall ${c.overall} ≠ ${k + 1}`);
      if (c.a === c.b) bad(`${tag}: 같은 음식끼리 경기`);
      const field = r[c.roundIndex];
      if (field[2 * (c.match - 1)] !== c.a || field[2 * (c.match - 1) + 1] !== c.b) bad(`${tag}: 대진 짝이 라운드 순서와 다름`);
      const q = CORE.pairQid(c.a, c.b);
      const o = CORE.pairOpt(c.a, c.b, winner);
      if (!CORE.validVote(q, o)) bad(`${tag}: 서버 한도 밖 ${q}/${o}`);
      qidSeen.add(q);
    });
    Object.keys(perRound).forEach((k) => { if (cnt[k] !== perRound[k]) bad(`${tag}: ${k} 경기 ${cnt[k]}회`); });
    // 승자 진출
    const winners = log.map((x) => x.winner);
    const w16 = winners.slice(0, 8), w8 = winners.slice(8, 12), w4 = winners.slice(12, 14), w2 = winners[14];
    if (r[1].join() !== w16.join() || r[2].join() !== w8.join() || r[3].join() !== w4.join()) bad(`${tag}: 다음 라운드가 승자 순서와 다름`);
    if (g.champion !== w2 || !r[3].includes(g.champion)) bad(`${tag}: 우승이 결승 진출자가 아님`);
    if (CORE.finalFour(g).join() !== r[2].join() || CORE.finalists(g).join() !== r[3].join()) bad(`${tag}: finalFour/finalists 이상`);
    // 각 라운드 승자는 그 경기의 두 음식 중 하나
    for (let ri = 1; ri < 4; ri++) r[ri].forEach((x, m) => { if (x !== r[ri - 1][2 * m] && x !== r[ri - 1][2 * m + 1]) bad(`${tag}: 라운드 ${ri} 진출자가 경기에 없던 음식`); });
    // 끝난 뒤 pick 은 그대로, 불변(원래 상태를 바꾸지 않음)
    const again = CORE.pick(g, 0);
    if (again !== g) bad(`${tag}: 끝난 뒤 pick 이 상태를 바꿈`);
    champSeen.add(g.champion);
    games++;
  }
  const g0 = CORE.newGame(5);
  const snap = JSON.stringify(g0);
  CORE.pick(g0, 1);
  if (JSON.stringify(g0) !== snap) bad('pick 이 원래 상태를 바꿈 (불변이어야 함)');
  let threw = false;
  try { CORE.pick(g0, 99, true); } catch (e) { threw = true; }
  if (!threw) bad('경기에 없는 음식을 승자로 넣으면 오류여야 함');
  if (champSeen.size !== 16) bad(`무작위 판에서 우승 음식이 ${champSeen.size}/16종만 나옴`);

  // 서버 인코딩
  const all = CORE.allQids();
  if (all.length !== 122 || new Set(all).size !== all.length || all.length > 500) bad(`qid 수 ${all.length} (122, 중복 없음, 500 이하)`);
  all.forEach((q) => { if (!CORE.QID_RE.test(q) || q.length > 32) bad(`qid 모양 ${q}`); });
  if (qidSeen.size !== 120) warn(`무작위 판에서 나온 경기 qid ${qidSeen.size}/120`);
  for (let a = 0; a < 16; a++) for (let b = 0; b < 16; b++) {
    if (a === b) continue;
    const q = CORE.pairQid(a, b);
    if (q !== CORE.pairQid(b, a)) bad(`pairQid 가 순서에 따라 다름 ${a},${b}`);
    const oa = CORE.pairOpt(a, b, a), ob = CORE.pairOpt(a, b, b);
    if (oa === ob || ![0, 1].includes(oa) || ![0, 1].includes(ob)) bad(`pairOpt ${a},${b}`);
    if (oa !== (a < b ? 0 : 1)) bad(`pairOpt: opt 0 은 작은 번호가 이긴 것 (${a},${b})`);
  }
  for (let i = 0; i < 16; i++) {
    const q = CORE.champQid(i), o = CORE.champOpt(i);
    if (!CORE.validVote(q, o)) bad(`우승 인코딩 한도 밖 ${i} → ${q}/${o}`);
    const back = q === 'c0' ? o : o + 10;
    if (back !== i) bad(`우승 인코딩 되돌림 실패 ${i}`);
  }
  ['M0-1', 'm0-1'.repeat(9), '', 'a b'].forEach((q) => { if (CORE.validVote(q, 0)) bad(`validVote 가 ${q} 를 통과시킴`); });
  [-1, 10, 0.5, '1', NaN].forEach((o) => { if (CORE.validVote('m0-1', o)) bad(`validVote 가 opt ${o} 를 통과시킴`); });

  // 합계 기준
  const rows = (qid, arr) => arr.map((v, o) => ({ qid, option: o, votes: v }));
  let m = CORE.resultsMap(rows('m2-5', [6, 3]));
  if (CORE.pairStat(m, 2, 5, 2) !== null) bad('경기 합계 9 인데 숫자가 나옴');
  m = CORE.resultsMap(rows('m2-5', [7, 3]));
  const st = CORE.pairStat(m, 5, 2, 2);
  if (!st || st.pct !== 70 || st.total !== 10) bad(`경기 합계 10: ${JSON.stringify(st)} (70%)`);
  if (CORE.pairStat(m, 2, 5, 5).pct !== 30) bad('경기 hi 승 비율');
  m = CORE.resultsMap([...rows('c0', [0, 0, 0, 5]), ...rows('c1', [0, 0, 14])]);
  if (CORE.champStat(m, 3) !== null) bad('우승 합계 19 인데 숫자가 나옴');
  m = CORE.addVote(m, 'c1', 2);
  const cs = CORE.champStat(m, 12);
  if (!cs || cs.total !== 20 || cs.pct !== 75) bad(`우승 합계 20: ${JSON.stringify(cs)} (75%)`);
  if (CORE.champStat(m, 3).pct !== 25) bad('우승 c0 비율');
  const junk = CORE.resultsMap([null, { qid: 5 }, { qid: 'm0-1', option: 12, votes: 3 }, { qid: 'm0-1', option: 0, votes: 'x' }, { qid: 'm0-1', option: 1, votes: 4 }]);
  if (JSON.stringify(junk) !== '{"m0-1":[0,4]}') bad(`resultsMap 이 잘못된 행을 걸러내지 않음 ${JSON.stringify(junk)}`);
  if (CORE.pairStat(null, 0, 1, 0) !== null || CORE.champStat(null, 0) !== null || JSON.stringify(CORE.resultsMap(null)) !== '{}') bad('합계 없음(null)이면 숫자 없음');

  console.log(`\n=== 로직: 셔플 ${SEEDS.toLocaleString()}개(순열·재현·고르게) · 무작위 판 ${games.toLocaleString()}개(15경기·진출·우승) · qid ${all.length}개 서버 한도 OK ===`);
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
const isCJK = (lang) => ['ja', 'zh', 'ko'].includes(lang);
const words = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s  ]+|-/).filter(Boolean);
const longestWord = (s) => words(s).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');
// 제목 글꼴 Unbounded 는 넓다(라틴 약 1.25배), 이름 글꼴 Oswald 는 좁다(약 0.85배) — 보수적으로 잡는다
const displayFactor = (T) => (/Unbounded/.test(String(T.fonts.display).split(',')[0]) ? 1.28 : 1.08);
const nameFactor = (T) => (/Oswald/.test(String(T.fonts.name).split(',')[0]) ? 0.9 : 1.05);

// 카드 이름 칸: 360px = (328 - 12)/2 - 안쪽 여백 16 - 테두리 6 = 136px (글자 18px, CJK 21px) · 375px = (343 - 14)/2 - 20 - 6 = 138px (글자 20px, CJK 21px)
const NAME_BOX = [{ w: 360, px: 136, size: 18, cjk: 21 }, { w: 375, px: 138, size: 20, cjk: 21 }];
// 끝 화면 4강 칩(2×2, 이모지 위·이름 아래) 이름 칸 (360px): ((328 - 32 - 6) - 8)/2 - 안쪽 여백 16 - 테두리 4 = 121px → 여유 두고 114px (15px)
const CHIP_PX = 114;
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 18, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 28, size: 13, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 20, size: 15, hard: true, what: 'h1 검색어 줄' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 12.5, hard: true, what: '사실 한 줄' },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328, size: 14, hard: false, what: '경기 안내 한 줄' },
  { key: 'play.round', get: (T) => `${T.play.rounds.qf} · 4/4`.replace(/ · /, T.play.roundFmt.includes(' · ') ? ' · ' : ' '), px: 328 - 28 - 6, size: 15, hard: true, what: '라운드 표시 한 줄(가장 긴 이름으로)', longest: true },
  { key: 'result.eyebrow', get: (T) => `🏆 ${T.result.eyebrow}`, px: 290 - 28, size: 14, hard: true, what: '우승 배지 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄', plain: true },
  { key: 'result.fourTitle', get: (T) => T.result.fourTitle, px: 290, size: 14, hard: true, what: '4강 제목 한 줄' },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Unbounded', 'Oswald', 'Nunito', 'Rubik', 'Dela Gothic One', 'Montserrat Alternates'];
const VIET_FONTS = ['Unbounded', 'Oswald', 'Nunito', 'Be Vietnam Pro', 'Kanit', 'Dela Gothic One', 'Montserrat Alternates'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const firstFont = (s) => String(s || '').split(',')[0].replace(/['"]/g, '').trim();

function checkLocales() {
  const base = new Set(shape(L10N.en));
  const ids = CORE.FOODS.map((f) => f.id);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
      const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
      const en = Object.fromEntries(flat(L10N.en));
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.') || k.startsWith('foods.') || /^\W*(\{\w+\}\W*)+$/.test(v)) return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    const empties = [];
    (function walk(o, p) { Object.entries(o).forEach(([k, v]) => { if (v && typeof v === 'object') walk(v, `${p}${k}.`); else if (typeof v === 'string' && !v.trim() && `${p}${k}` !== 'fonts.sans') empties.push(`${p}${k}`); }); })(T, '');
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    // 라운드 이름
    CORE.ROUNDS.forEach((r) => { if (!T.play.rounds[r]) bad(`${tag} play.rounds.${r} 없음`); });
    if (Object.keys(T.play.rounds).length !== CORE.ROUNDS.length) bad(`${tag} play.rounds 는 ${CORE.ROUNDS.join('/')} 네 개`);
    // 자리표시자
    const need = [['play.roundFmt', T.play.roundFmt, ['round', 'n', 'total']], ['play.progressAria', T.play.progressAria, ['n', 'total']], ['play.pickAria', T.play.pickAria, ['food']],
      ['play.same', T.play.same, ['pct']], ['result.champPct', T.result.champPct, ['pct']], ['result.shareText', T.result.shareText, ['emoji', 'food']]];
    need.forEach(([k, v, keys]) => {
      keys.forEach((p) => { if (!String(v).includes(`{${p}}`)) bad(`${tag} ${k} 에 {${p}} 없음`); });
      (String(v).match(/\{(\w+)\}/g) || []).forEach((m) => { if (!['{round}', '{n}', '{total}', '{food}', '{pct}', '{emoji}'].includes(m)) bad(`${tag} ${k} 모르는 자리표시자 ${m}`); });
    });
    if (/\{/.test(T.result.champFirst)) bad(`${tag} result.champFirst 에 자리표시자(숫자)를 넣지 않는다`);
    if (/\d/.test(T.result.champFirst)) bad(`${tag} result.champFirst 에 숫자 금지 (가짜 숫자처럼 보임)`);
    // 음식 이름 16개
    const names = T.foods || {};
    const keys = Object.keys(names);
    if (keys.length !== 16 || ids.some((id) => !names[id]) || keys.some((k) => !ids.includes(k))) bad(`${tag} foods 는 core 의 16개 id 와 같아야 함 (${keys.length}개)`);
    const uniq = new Set(Object.values(names).map((n) => String(n).toLowerCase()));
    if (uniq.size !== keys.length) bad(`${tag} 음식 이름 중복`);
    Object.entries(names).forEach(([id, n]) => {
      if (/[<>{}]/.test(n) || n !== n.trim()) bad(`${tag} foods.${id} "${n}" 글자 이상`);
      if (visLen(n) > (isWideLang(lang) ? 8 : 18)) bad(`${tag} foods.${id} "${n}" ${visLen(n)}자 (${isWideLang(lang) ? 8 : 18}자 이하)`);
      NAME_BOX.forEach((b) => {
        const size = isCJK(lang) ? b.cjk : b.size;
        const f = nameFactor(T);
        if (isWideLang(lang)) {
          const lines = Math.ceil((emWidth(n) * size * f) / b.px);
          if (lines > 2) bad(`${tag} foods.${id} "${n}" ${b.w}px 카드에서 ${lines}줄`);
          else if (lines > 1 && isCJK(lang)) warn(`${tag} foods.${id} "${n}" ${b.w}px 카드에서 두 줄`);
        } else {
          const lw = longestWord(n);
          const ww = emWidth(lw) * size * f;
          if (ww > b.px) bad(`${tag} foods.${id} 단어 "${lw}" ≈ ${Math.round(ww)}px > ${b.px}px (${b.w}px 카드 한 줄)`);
          if (emWidth(n) * size * f > b.px * 2 * 0.92) bad(`${tag} foods.${id} "${n}" ${b.w}px 카드에서 두 줄 넘음`);
        }
      });
      // 끝 화면 4강 칩
      const cw = isWideLang(lang) ? emWidth(n) * 15 * nameFactor(T) / 2 : emWidth(longestWord(n)) * 15 * nameFactor(T);
      if (cw > CHIP_PX) bad(`${tag} foods.${id} "${n}" 4강 칩(${CHIP_PX}px)에서 단어가 잘림 ≈ ${Math.round(cw)}px`);
      // 우승 이름 (32px, 360px 카드 안쪽 290px)
      const hw = isWideLang(lang) ? emWidth(n) * 28 * displayFactor(T) / 2 : emWidth(longestWord(n)) * 28 * displayFactor(T);
      if (hw > 290) bad(`${tag} foods.${id} "${n}" 우승 이름(28px)에서 단어가 넘침 ≈ ${Math.round(hw)}px`);
    });
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·하트·별점 류 질문 금지: ${f.q}`);
      if (f && f.a && Object.values(names).filter((n) => n.length > 2 && f.a.includes(n)).length >= 3) bad(`${tag} faq[${i}] 답에 음식 이름을 늘어놓음 (스포일러)`);
    });
    // 글꼴
    const F = T.fonts || {};
    if (!F.css || !F.display || !F.name || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / display / name 이상`);
    const disp = firstFont(F.display), nm = firstFont(F.name);
    [disp, nm].forEach((font) => { if (F.css && !F.css.includes(font.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 글꼴 ${font} 가 없음`); });
    if (lang === 'ru') [disp, nm].forEach((font) => { if (!CYRILLIC_FONTS.includes(font)) bad(`${tag} 글꼴 "${font}" 는 키릴 문자를 지원하지 않음`); });
    if (lang === 'vi') [disp, nm].forEach((font) => { if (!VIET_FONTS.includes(font)) bad(`${tag} 글꼴 "${font}" 는 베트남어 성조를 지원하지 않음`); });
    if (!isWideLang(lang) && (disp !== 'Unbounded' || nm !== 'Oswald')) warn(`${tag} 글꼴 ${disp}/${nm} (라틴 확장·베트남어·키릴 모두 되는 Unbounded/Oswald 권장)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const unit = isWideLang(lang) ? txt : longestWord(txt);
      const w = emWidth(unit) * 28 * displayFactor(T);
      if (w > 328) (isWideLang(lang) ? warn : bad)(`${tag} h1 "${unit}" ≈ ${Math.round(w)}px @28px (360px 한 줄 328px)`);
    });
    // 제목·설명 (seo.md) — 제목에 포털 이름(app.config title)이 들어 있어야 한다
    const tl = visLen(T.meta.title);
    const wide = isWideLang(lang) && lang !== 'ko';
    if (wide ? tl > 32 : tl > 52) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 32' : '라틴·키릴·한글 52'}자 이하)`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    if (!T.meta.title.toLowerCase().includes(String(APP.title[lang] || '').toLowerCase())) bad(`${tag} meta.title 에 app.config 제목 "${APP.title[lang]}" 이 없음`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) bad(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 담지 않음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 170];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    // 스포일러: 시작 전 문구(메타·시작 화면·OG·등록 설명)에 음식 이름이 없어야 한다
    const pre = [T.meta.title, T.meta.description, T.meta.ogTitle, T.meta.ogDescription, T.start.badge, T.start.h1Kicker, T.start.h1Html, T.start.hook, T.start.facts, T.start.start,
      T.og.brand, T.og.defaultKicker, T.og.defaultTitle, T.og.defaultDesc, APP.title[lang], APP.desc[lang]].join(' \n ').toLowerCase();
    Object.entries(names).forEach(([id, n]) => {
      const low = n.toLowerCase();
      const hit = isWideLang(lang) ? pre.includes(low) : new RegExp(`(^|[^\\p{L}])${low.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u').test(pre);
      if (hit) bad(`${tag} 시작 전 문구에 음식 이름 "${n}" (${id}) — 스포일러 금지`);
    });
    CORE.FOODS.forEach((f) => { if (pre.includes(f.emoji)) bad(`${tag} 시작 전 문구에 음식 이모지 ${f.emoji}`); });
    // 폭 예산
    BUDGET.forEach((b) => {
      let v = b.get(T) || '';
      if (b.longest) {
        const longest = Object.values(T.play.rounds).reduce((a, r) => (emWidth(r) > emWidth(a) ? r : a), '');
        v = T.play.roundFmt.replace('{round}', longest).replace('{n}', '8').replace('{total}', '8');
      }
      const f = b.plain ? 1 : displayFactor(T);
      const need = emWidth(v) * b.size * f;
      if (need > b.px) (b.hard ? bad : warn)(`${tag} ${b.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(b.px)}px (${b.what})`);
    });
    // "N% 같은 선택" 은 두 줄까지 (328px, 15px)
    const same = T.play.same.replace('{pct}', '100');
    if (emWidth(same) * 15 * displayFactor(T) > 328 * 2) bad(`${tag} play.same "${same}" 가 두 줄을 넘음`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
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
  if (!/<link rel="canonical" href="https:\/\/food-cup\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/food-cup\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
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
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"UtilitiesApplication"/.test(html)) bad(`${tag} appLd(WebApplication, vote) 없음`);
      const start = section(html, 'screen-start');
      const play = section(html, 'screen-play');
      const end = section(html, 'screen-end');
      if (!start || !play || !end) { bad(`${tag} 시작/경기/끝 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-play"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 경기·끝 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if (/mg-ad/.test(start)) bad(`${tag} 시작 화면에 mg-ad`);
      if (/data-mg-end|mg-faq|<details|fc-card|fc-chip/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/카드`);
      if (!/<h1 class="fc-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      const startText = start.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      Object.values(T.foods).forEach((n) => { if (n.length > 1 && new RegExp(`(^|[^\\p{L}])${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u').test(startText)) bad(`${tag} 시작 화면에 음식 이름 "${n}"`); });
      CORE.FOODS.forEach((fd) => { if (start.includes(fd.emoji)) bad(`${tag} 시작 화면에 음식 이모지 ${fd.emoji}`); });
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if ((play.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 경기 화면 mg-ad 는 1개`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 경기 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if (play.indexOf('class="mg-ad"') < play.indexOf('id="card-b"')) bad(`${tag} 경기 화면 광고는 카드 아래`);
      ['round-label', 'progress', 'progress-bar', 'arena', 'card-a', 'card-b', 'pick-stat'].forEach((id) => { if (!play.includes(`id="${id}"`)) bad(`${tag} 경기 화면에 #${id} 없음`); });
      if ((play.match(/class="fc-card"/g) || []).length !== 2) bad(`${tag} 경기 카드는 2장`);
      const champAt = end.indexOf('class="fc-champ"');
      const endAt = end.indexOf('<div data-mg-end="food-cup"></div>');
      if (!(champAt > 0 && endAt > champAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="food-cup" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['champ-emoji', 'champ-name', 'champ-stat', 'four'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('food-cup-core.js') > html.indexOf('food-cup.js"')) bad(`${tag} food-cup-core.js 가 food-cup.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://food-cup.example.com/</loc>') || !sm.includes('<loc>https://food-cup.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
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
  if (APP.id !== 'food-cup' || APP.category !== 'vote' || APP.path !== 'https://food-cup.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else if (visLen(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${visLen(APP.desc[code])}자)`);
  });
}

checkCore();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개(음식 이름 ${G.LOCALES.length * 16}개) · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 대진(15경기·진출·우승·시드 재현)·서버 인코딩(qid/opt 한도)·숫자 기준(10/20), 언어 파일 12개(키·번역·음식 이름 폭·FAQ·글꼴·제목·스포일러), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치·끝 화면), OG 이미지 모두 OK');
