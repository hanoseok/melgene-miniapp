#!/usr/bin/env node
/**
 * 블록 퍼즐(Block Puzzle) 검사.
 *   1) 로직(block-core.js): 조각 모양(정규화·연결됨·크기·가족별 회전 수·중복 없음·가중치), canPlace 경계·겹침,
 *      가로줄만·세로줄만·가로+세로 동시에 지우기(교차 칸 한 번만)·점수(놓은 칸 + 줄 보너스 × 콤보)·콤보 유지/끊김(COMBO_GRACE),
 *      3개를 다 놓으면 새로 3개, 같은 시드 + 같은 놓기 = 같은 판, 첫 손은 언제나 놓을 수 있음(시드 2,000개),
 *      나눠 줄 때 하나도 안 들어가면 다시 뽑기(REROLLS), 끝 판정(over ⇔ 남은 조각 중 어디에도 들어가는 것이 없음 — 전수 확인),
 *      무작위 봇 1,500판 + 욕심쟁이 봇 250판: 오류 없음 · 점수는 정수이고 놓은 칸 + 보너스 합과 같음 · 판 칸 값 범위 · 가득 찬 줄이 남지 않음,
 *      공정함(욕심쟁이 봇이 무작위 봇보다 훨씬 오래 버팀, 너무 쉽지도 않음 — 판이 언젠가 끝남). 서버 인코딩: game 이름, bucket 0..1999, percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?"·인기순 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원), 제목(= app.config 제목·h1 검색어 포함)·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(GameApplication) / FAQPage·aggregateRating 없음 / Supabase 값 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음 /
 *      게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="block" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 / 숨은 변형 noindex.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크.
 *
 * 실행: node tools/check-block.js   (cwd = apps/block)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'block-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const N = C.N;
const P = (id) => C.BY_ID[id];
function boardFrom(rows) { const b = C.emptyBoard(); rows.forEach((row, r) => [...row].forEach((ch, c) => { if (ch !== '.') b[r * N + c] = Number(ch) || 1; })); return b; }
function gameWith(board, ids, seed = 1) { const s = C.newGame(seed); s.board = board; s.hand = ids.map((id) => (id ? P(id) : null)); s.over = !C.anyFits(s.board, s.hand); return s; }
function connected(cells) {
  const key = (p) => p[0] + ',' + p[1];
  const set = new Set(cells.map(key)); const seen = new Set([key(cells[0])]); const q = [cells[0]];
  while (q.length) { const [r, c] = q.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dr, dc]) => { const k = (r + dr) + ',' + (c + dc); if (set.has(k) && !seen.has(k)) { seen.add(k); q.push([r + dr, c + dc]); } }); }
  return seen.size === cells.length;
}
// 끝 판정 전수 확인(코어의 fits 를 쓰지 않고)
function bruteAnyFits(board, hand) {
  return hand.some((p) => {
    if (!p) return false;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (p.cells.every(([dr, dc]) => r + dr < N && c + dc < N && !board[(r + dr) * N + c + dc])) return true;
    }
    return false;
  });
}

// 한 판을 끝까지(또는 maxMoves) — chooser(s) → {slot, r, c}. 매 수 불변식을 확인하고 요약을 돌려준다.
function playOut(seed, chooser, maxMoves = 5000) {
  const s = C.newGame(seed);
  if (!C.anyFits(s.board, s.hand)) bad(`seed ${seed}: 첫 손을 놓을 수 없음`);
  let sum = 0, moves = 0, both = 0;
  while (!s.over && moves < maxMoves) {
    const mv = chooser(s);
    if (!mv) { bad(`seed ${seed}: over 가 아닌데 놓을 수가 없음`); break; }
    const before = s.score;
    const res = C.place(s, mv.slot, mv.r, mv.c);
    if (!res) { bad(`seed ${seed}: 올바른 자리인데 place 가 null ${JSON.stringify(mv)}`); break; }
    moves++;
    sum += res.gained;
    if (res.rows.length && res.cols.length) both++;
    if (!Number.isInteger(s.score) || !Number.isInteger(res.gained) || res.gained < res.piece.n) { bad(`seed ${seed}: 점수가 정수가 아니거나 이상함 ${s.score} / +${res.gained}`); break; }
    if (s.score !== before + res.gained) { bad(`seed ${seed}: 점수 합이 맞지 않음`); break; }
    if (res.gained !== res.piece.n + C.lineBonus(res.k) * res.mult) { bad(`seed ${seed}: gained ≠ 칸 + 보너스 × 콤보`); break; }
    if (s.board.some((v) => !Number.isInteger(v) || v < 0 || v > C.COLORS)) { bad(`seed ${seed}: 판 칸 값 범위 밖`); break; }
    const fl = C.fullLines(s.board);
    if (fl.rows.length || fl.cols.length) { bad(`seed ${seed}: 놓은 뒤 가득 찬 줄이 남아 있음`); break; }
    if (s.hand.every((h) => !h)) { bad(`seed ${seed}: 손이 비어 있음(새로 나눠 주지 않음)`); break; }
    const any = bruteAnyFits(s.board, s.hand);
    if (s.over === any) { bad(`seed ${seed}: 끝 판정 틀림 over=${s.over} 실제로 놓을 수 있음=${any}`); break; }
  }
  if (!s.over && moves >= maxMoves) warn(`seed ${seed}: ${maxMoves}수 안에 끝나지 않음`);
  if (s.score !== sum) bad(`seed ${seed}: 최종 점수 ≠ 얻은 점수 합`);
  return { score: s.score, placed: s.placed, lines: s.lines, bestCombo: s.bestCombo, both, over: s.over };
}
function randomChooser(rnd) {
  return (s) => {
    const all = [];
    s.hand.forEach((p, slot) => { if (p) C.positions(s.board, p).forEach(([r, c]) => all.push({ slot, r, c })); });
    return all.length ? all[Math.floor(rnd() * all.length)] : null;
  };
}
const median = (a) => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };

function checkCore() {
  // 조각
  if (N !== 8) bad('판은 8×8');
  const keys = new Set();
  const famCount = {};
  C.PIECES.forEach((p) => {
    const k = p.cells.map((q) => q.join('.')).join('|');
    if (keys.has(k)) bad(`조각 모양 중복 ${p.id}`);
    keys.add(k);
    famCount[p.fam] = (famCount[p.fam] || 0) + 1;
    if (Math.min(...p.cells.map((q) => q[0])) !== 0 || Math.min(...p.cells.map((q) => q[1])) !== 0) bad(`${p.id} 정규화 안 됨`);
    if (p.h !== Math.max(...p.cells.map((q) => q[0])) + 1 || p.w !== Math.max(...p.cells.map((q) => q[1])) + 1 || p.n !== p.cells.length) bad(`${p.id} h/w/n`);
    if (p.h > 5 || p.w > 5 || p.n > 9) bad(`${p.id} 너무 큼`);
    if (!connected(p.cells)) bad(`${p.id} 이어지지 않은 모양`);
    if (!(p.weight > 0) || !(p.color >= 1 && p.color <= C.COLORS)) bad(`${p.id} 가중치/색`);
  });
  const EXPECT = { dot: 1, i2: 2, i3: 2, i4: 2, i5: 2, o2: 1, o3: 1, r23: 2, v3: 4, l4: 4, j4: 4, v5: 4, t4: 4, s4: 2, z4: 2 };
  Object.entries(EXPECT).forEach(([f, n]) => { if (famCount[f] !== n) bad(`가족 ${f} 회전 수 ${famCount[f]} ≠ ${n}`); });
  if (C.PIECES.length !== Object.values(EXPECT).reduce((a, b) => a + b, 0)) bad(`조각 수 ${C.PIECES.length}`);
  // L4 와 J4 는 서로 거울(같은 모양 아님) — 위 중복 검사로 확인됨

  // canPlace
  const E = C.emptyBoard();
  if (!C.canPlace(E, P('i5-0'), 0, 3) || C.canPlace(E, P('i5-0'), 0, 4) || C.canPlace(E, P('dot-0'), -1, 0) || C.canPlace(E, P('dot-0'), 0, 8)) bad('canPlace 경계');
  if (!C.canPlace(E, P('o3-0'), 5, 5) || C.canPlace(E, P('o3-0'), 6, 5)) bad('canPlace 3×3 경계');
  const occ = boardFrom(['....', '.1..']);
  if (C.canPlace(occ, P('o2-0'), 0, 0) || !C.canPlace(occ, P('o2-0'), 0, 2)) bad('canPlace 겹침');

  // 가로줄 하나
  let s = gameWith(boardFrom(['1111111.']), ['dot-0', 'dot-0', 'dot-0']);
  let res = C.place(s, 0, 0, 7);
  if (!res || res.k !== 1 || res.rows.join() !== '0' || res.cols.length || res.cleared.length !== 8 || s.board.slice(0, 8).some(Boolean)) bad(`가로줄 지우기 ${JSON.stringify(res && { k: res.k, rows: res.rows, cols: res.cols })}`);
  if (res && (res.gained !== 1 + 10 || res.mult !== 1 || s.combo !== 1 || s.score !== 11)) bad(`가로줄 점수 ${res && res.gained}`);
  // 세로줄 하나
  s = gameWith(boardFrom(['1', '1', '1', '1', '1', '1', '1', '.']), ['dot-0', 'dot-0', 'dot-0']);
  res = C.place(s, 0, 7, 0);
  if (!res || res.k !== 1 || res.cols.join() !== '0' || res.rows.length || res.cleared.length !== 8) bad('세로줄 지우기');
  // 가로 + 세로 동시에 (교차 칸 한 번만): 3행·3열이 각각 한 칸(3,3)만 빈 상태
  const rows = []; for (let r = 0; r < N; r++) rows.push([...Array(N)].map((_, c) => ((r === 3 || c === 3) && !(r === 3 && c === 3) ? '2' : '.')).join(''));
  s = gameWith(boardFrom(rows), ['dot-0', 'i2-0', 'i3-0']);
  res = C.place(s, 0, 3, 3);
  if (!res || res.k !== 2 || res.rows.join() !== '3' || res.cols.join() !== '3' || res.cleared.length !== 15 || s.board.some(Boolean)) bad(`가로+세로 동시 지우기 ${JSON.stringify(res && { k: res.k, cleared: res.cleared.length })}`);
  if (res && res.gained !== 1 + 30) bad(`가로+세로 동시 점수 ${res.gained} ≠ 31`);
  // 3×3 이 가로 3줄 + 세로 3줄을 한 번에(6줄): 3~5행, 3~5열이 (3..5,3..5) 를 빼고 가득
  const rows6 = []; for (let r = 0; r < N; r++) rows6.push([...Array(N)].map((_, c) => (((r >= 3 && r <= 5) || (c >= 3 && c <= 5)) && !(r >= 3 && r <= 5 && c >= 3 && c <= 5) ? '4' : '.')).join(''));
  s = gameWith(boardFrom(rows6), ['o3-0', 'dot-0', 'dot-0']);
  res = C.place(s, 0, 3, 3);
  if (!res || res.k !== 6 || res.cleared.length !== 39 || s.board.some(Boolean) || res.gained !== 9 + C.lineBonus(6)) bad(`3×3 로 6줄 동시 ${JSON.stringify(res && { k: res.k, cleared: res.cleared.length, gained: res.gained })}`);
  if (C.lineBonus(1) !== 10 || C.lineBonus(2) !== 30 || C.lineBonus(3) !== 60 || C.lineBonus(4) !== 100 || C.lineBonus(0) !== 0) bad('lineBonus 10/30/60/100');
  // 콤보: 지우기 → 지우기 = ×2, 못 지우기 2번은 유지, 3번이면 끊김
  s = gameWith(boardFrom(['1111111.', '1111111.']), ['dot-0', 'dot-0', 'dot-0']);
  C.place(s, 0, 0, 7);
  res = C.place(s, 1, 1, 7);
  if (!res || res.mult !== 2 || res.gained !== 1 + 20 || s.combo !== 2 || s.bestCombo !== 2) bad(`콤보 ×2 ${JSON.stringify(res && { mult: res.mult, gained: res.gained })}`);
  s = gameWith(boardFrom(['1111111.', '........', '........', '........', '1111111.']), ['dot-0', 'dot-0', 'dot-0']);
  C.place(s, 0, 0, 7); // 지움 → combo 1
  s.hand = [P('dot-0'), P('dot-0'), P('dot-0')];
  C.place(s, 0, 2, 0); C.place(s, 1, 2, 2); // 못 지움 2번
  if (s.combo !== 1) bad(`못 지운 놓기 2번은 콤보 유지 (${s.combo})`);
  res = C.place(s, 2, 4, 7); // 지움 → ×2
  if (!res || res.mult !== 2) bad('콤보가 못 지운 2번 뒤에도 이어져야 함');
  s.hand = [P('dot-0'), P('dot-0'), P('dot-0')];
  C.place(s, 0, 6, 0); C.place(s, 1, 6, 2); C.place(s, 2, 6, 4);
  if (s.combo !== 0) bad(`못 지운 놓기 ${C.COMBO_GRACE}번이면 콤보 0 (${s.combo})`);
  // 다 놓으면 새로 3개 · 놓은 자리는 null · 잘못된 놓기는 null
  s = C.newGame(42);
  const first = s.hand.slice();
  const pos = (slot) => C.positions(s.board, s.hand[slot])[0];
  if (C.place(s, 0, 9, 9) !== null) bad('판 밖 놓기는 null');
  let p0 = pos(0); C.place(s, 0, p0[0], p0[1]);
  if (s.hand[0] !== null || C.place(s, 0, 0, 0) !== null) bad('놓은 조각은 null, 다시 못 놓음');
  p0 = pos(1); C.place(s, 1, p0[0], p0[1]);
  p0 = pos(2); res = C.place(s, 2, p0[0], p0[1]);
  if (!res || !res.dealt || s.hand.some((h) => !h) || s.deals !== 2) bad('3개를 다 놓으면 새로 3개');
  if (first.some((h) => !h)) bad('첫 손에 빈 자리');
  // 재현
  const replay = (seed) => { const g = C.newGame(seed); const log = []; while (!g.over && log.length < 400) { const b = C.bot(g); C.place(g, b.slot, b.r, b.c); log.push(b.slot + ':' + b.r + ':' + b.c); } return log.join(',') + '|' + g.score + '|' + g.hand.map((h) => h && h.id).join(); };
  if (replay(77) !== replay(77)) bad('같은 시드 + 같은 놓기 = 같은 판이어야 함');
  if (replay(77) === replay(78)) bad('다른 시드인데 같은 판');
  // 첫 손은 언제나 놓을 수 있음
  for (let seed = 1; seed <= 2000; seed++) { const g = C.newGame(seed); if (g.over || !bruteAnyFits(g.board, g.hand)) { bad(`seed ${seed}: 첫 손이 놓을 수 없음`); break; } }
  // 다시 뽑기: 3×3 만 빠진 판에서 큰 조각만 나오는 일이 적어야 함(하나라도 들어가는 손을 더 자주)
  const tight = boardFrom(['11111111', '11111111', '11111111', '11111.11', '11111111', '11111111', '1.111111', '11111111'].map((r, i) => (i === 7 ? '1111111.' : r)));
  let okHands = 0;
  for (let seed = 1; seed <= 400; seed++) { const g = C.newGame(seed); g.board = tight.slice(); C.deal(g); if (C.anyFits(g.board, g.hand)) okHands++; }
  const pDot = C.PIECES.filter((p) => p.n === 1).reduce((a, p) => a + p.weight, 0) / C.PIECES.reduce((a, p) => a + p.weight, 0);
  const noReroll = 1 - Math.pow(1 - pDot, 3);
  if (okHands / 400 < noReroll * 1.6) bad(`다시 뽑기가 약함: 들어가는 손 ${okHands}/400 (다시 뽑기 없이 ≈ ${Math.round(noReroll * 400)})`);

  // 무작위 봇 1,500판 + 욕심쟁이 봇 250판
  const rnd = (seed) => C.mulberry32(seed * 7919 + 13);
  const randStats = [], botStats = [];
  for (let seed = 1; seed <= 1500 && problems.length < 20; seed++) randStats.push(playOut(seed, randomChooser(rnd(seed))));
  for (let seed = 5001; seed <= 5250 && problems.length < 20; seed++) botStats.push(playOut(seed, (g) => C.bot(g)));
  if (!randStats.every((x) => x.over) || !botStats.every((x) => x.over)) bad('어떤 판은 끝나지 않음');
  const bothCount = randStats.concat(botStats).reduce((a, x) => a + x.both, 0);
  if (bothCount < 20) bad(`실제 판에서 가로+세로 동시 지우기가 너무 드묾 (${bothCount})`);
  const rMed = median(randStats.map((x) => x.placed)), bMed = median(botStats.map((x) => x.placed));
  const bScore = median(botStats.map((x) => x.score)), bMax = Math.max(...botStats.map((x) => x.score));
  if (!(bMed > rMed * 2)) bad(`욕심쟁이 봇이 무작위보다 오래 버텨야 함 (놓은 조각 중앙값 ${bMed} vs ${rMed}) — 실력이 통하는 게임`);
  if (rMed < 6) bad(`무작위로 둬도 몇 수는 버텨야 함 (중앙값 ${rMed})`);
  if (bMed > 1000) bad(`봇 판이 너무 길다 (중앙값 ${bMed}) — 너무 쉬움`);
  if (C.bucket(bMax) >= C.MAX_BUCKET) warn(`봇 최고 점수 ${bMax} 가 bucket 끝에 닿음`);
  console.log(`  로직: 무작위 봇 ${randStats.length}판(놓은 조각 중앙값 ${rMed}) · 욕심쟁이 봇 ${botStats.length}판(놓은 조각 중앙값 ${bMed}, 점수 중앙값 ${bScore}, 최고 ${bMax}) · 가로+세로 동시 지우기 ${bothCount}번`);

  // 서버 인코딩
  if (C.GAME !== 'block' || !/^[a-z0-9-]{1,32}$/.test(C.GAME)) bad('GAME 이름');
  if (C.bucket(0) !== 0 || C.bucket(-5) !== 0 || C.bucket(1e9) !== C.MAX_BUCKET || C.bucket('x') !== 0 || C.bucket(39) !== 2 || !Number.isInteger(C.bucket(123.4))) bad('bucket');
  if (C.MAX_BUCKET > 1999) bad('bucket 은 서버 한도 2000 구간 안');
  const pc = C.percentile([{ score_bucket: 1, players: 2 }, { score_bucket: 5, players: 1 }, { score_bucket: 9, players: 3 }], 5);
  if (!pc || pc.first || pc.others !== 5 || pc.top < 1 || pc.top > 100) bad(`percentile ${JSON.stringify(pc)}`);
  if (!C.percentile([{ score_bucket: 5, players: 1 }], 5).first) bad('혼자면 first');
  if (C.percentile(null, 5) !== null) bad('실패(null)면 null');
  if (C.percentile([{ score_bucket: 'x', players: 'y' }, null, { score_bucket: 3, players: 4 }], 9).others !== 4) bad('잘못된 행 무시');
  const hi = C.percentile([{ score_bucket: 2, players: 9 }], 50), lo = C.percentile([{ score_bucket: 50, players: 9 }], 2);
  if (!(hi.top < lo.top)) bad('높은 점수가 더 상위여야 함');
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
// 제목 글꼴 폭 보정 (Fredoka 600 은 조금 넓은 편, Rubik 700·Baloo 2·Mitr 도 넓은 편)
const displayFactor = (T) => ({ Fredoka: 1.1, Rubik: 1.12, 'Baloo 2': 1.05, Mitr: 1.1 }[firstFont(T.fonts.display)] || 1.05);
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
// 360px 폭(본문 칸 328px) 예산
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 42, size: 20, max: 1, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 2, what: 'h1 검색어 칸 두 줄까지' },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 1, what: '사실 한 줄' },
  { key: 'start.how.drag', get: (T) => T.start.how.drag, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.lines', get: (T) => T.start.how.lines, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  { key: 'start.how.plan', get: (T) => T.start.how.plan, px: 104 - 15, size: 13.5, max: 2, what: '방법 칸 두 줄까지', word: 104 - 15 },
  // HUD 칸: (328 - 12) = 316 → 1.3 : 1 : 1 → 124 / 96 / 96, 안쪽 여백 20+3 → 101 / 73 (이름표 한 줄)
  { key: 'play.score', get: (T) => T.play.score, px: 101, size: 11, max: 1, what: 'HUD 점수 이름표', track: 0.06 },
  { key: 'play.best', get: (T) => T.play.best, px: 73, size: 11, max: 1, what: 'HUD 최고 이름표', track: 0.06 },
  { key: 'play.combo', get: (T) => T.play.combo, px: 73, size: 11, max: 1, what: 'HUD 콤보 이름표', track: 0.06 },
  { key: 'play.hint', get: (T) => T.play.hint, px: 328, size: 14, max: 2, what: '안내 두 줄까지' },
  { key: 'play.hintSelected', get: (T) => T.play.hintSelected, px: 328, size: 14, max: 2, what: '안내 두 줄까지' },
  { key: 'play.hintNoFit', get: (T) => T.play.hintNoFit, px: 328, size: 14, max: 2, what: '안내 두 줄까지' },
  { key: 'play.noRoom', get: (T) => T.play.noRoom, px: 328 - 12 - 32 - 36, size: 26, max: 2, what: '끝 알림 두 줄까지' },
  { key: 'result.over', get: (T) => T.result.over, px: 328 - 32 - 32, size: 16, max: 2, what: '끝 배지 두 줄까지' },
  { key: 'result.points', get: (T) => T.result.points, px: 120, size: 20, max: 1, what: '점수 옆 단위(64px 숫자 옆)' },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 28, size: 16, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{n}', '1,234'), px: 328 - 32, size: 16, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.lines', get: (T) => T.result.lines, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.combo', get: (T) => T.result.combo, px: (328 - 36 - 8) / 2 - 15, size: 13, max: 2, what: '통계 칸 이름 두 줄까지', word: (328 - 36 - 8) / 2 - 15 },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 36 - 24, size: 30, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 36 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 36 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 36 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
const PLACEHOLDERS = [['result.best', ['n']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareText', ['n']], ['result.comboValue', ['n']], ['play.comboValue', ['n']], ['play.pieceAria', ['n']], ['play.pieceNoFit', ['n']]];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Rubik', 'Nunito', 'Unbounded', 'Oswald', 'Montserrat Alternates'];
const VIET_FONTS = ['Baloo 2', 'Be Vietnam Pro', 'Nunito', 'Mitr', 'Unbounded', 'Oswald'];
const LATIN_EXT_FONTS = ['Fredoka', 'Rubik', 'Nunito', 'Baloo 2'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
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
  if (!/<link rel="canonical" href="https:\/\/block\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/block\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|blk-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="blk-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="blk-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-score', 'hud-best', 'hud-combo', 'board', 'pops', 'over-overlay', 'play-hint', 'tray'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if ((playS.match(/class="blk-slot"/g) || []).length !== 3) bad(`${tag} 조각 칸은 3개`);
      if (!/id="play-hint"[^>]*aria-live="polite"/.test(playS)) bad(`${tag} 안내는 aria-live`);
      const resAt = end.indexOf('class="blk-result"');
      const endAt = end.indexOf('<div data-mg-end="block"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="block" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-score', 'res-newbest', 'res-best', 'res-lines', 'res-combo', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="blk-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('block-core.js') > 0 && html.indexOf('block-core.js') < html.indexOf('block.js"'))) bad(`${tag} block-core.js 가 block.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://block.example.com/</loc>') || !sm.includes('<loc>https://block.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('block.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('block.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("block.js track('start')/track('done') 는 한 곳씩");
  if (!/visibilitychange/.test(js) || !/prefers-reduced-motion/.test(js)) bad('block.js: 탭 전환(끌기 취소)·움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('block.js: setShareData/setRetry 없음');
  if (!/pointerdown/.test(js) || !/pointermove/.test(js) || !/setPointerCapture/.test(js) || !/pointercancel/.test(js)) bad('block.js: pointer events 로 끌어 놓기');
  if (!/ArrowUp/.test(js) || !/'Enter'/.test(js)) bad('block.js: 키보드(화살표 + Enter) 놓기');
  if (!/localStorage/.test(js)) bad('block.js: 최고 기록 localStorage');
  if (!/supa\.submitScore\(C\.GAME/.test(js)) bad('block.js: supa.submitScore(C.GAME, …) 로 실제 백분위');
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
  if (APP.id !== 'block' || APP.category !== 'game' || APP.path !== 'https://block.example.com/' || APP.added !== '2026-10-29' || APP.order !== 1) bad('app.config.js id/category/path/added/order');
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
console.log('\n결과: 통과 — 게임 로직(조각·놓기·가로세로 동시 지우기·점수·콤보·나눠 주기·끝 판정·재현·봇 1,750판)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
