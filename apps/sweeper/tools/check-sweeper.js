#!/usr/bin/env node
/**
 * 지뢰찾기 검사.
 *   1) 로직(sweeper-core.js): 난이도 크기·지뢰 수, 첫 클릭 안전(3×3 안에 지뢰 없음 — 모든 난이도·시드 수백 번), 같은 시드 + 같은 첫 칸 = 같은 배치,
 *      숫자(adj) = 이웃 지뢰 수, 빈 칸 flood fill(이어진 빈 칸과 그 둘레 숫자만 열림·지뢰는 안 열림·반복문 — 큰 판도 안 터짐),
 *      깃발(켜기/끄기·열린 칸/첫 칸 전/끝난 판에서는 안 됨·깃발 칸은 안 열림), chord(깃발 수 = 숫자일 때만·틀린 깃발이면 터짐·열린 숫자만),
 *      승리(안전한 칸을 다 열면 won · 남은 지뢰 자동 깃발)·패배(지뢰를 열면 lost + exploded), 끝난 뒤에는 입력 무시, 봇 수백 판(안전 칸만 여는 풀이기 + 무작위 클릭)이 매 단계 불변식 유지,
 *      서버 인코딩: 난이도별 game 이름·bucket 0..1999 정수(빠를수록 큼)·percentile.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, 영어 그대로 남은 문구 없음, 자리표시자, FAQ 3~5개, 글꼴, 제목·설명 길이, 360px 폭 예산 등.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd / FAQPage 없음 / Supabase 값 없음 /
 *      시작 화면 맨 끝 mg-ad-start 1개·FAQ 없음·난이도 3개 / 게임 화면에 mg-ad 없음 / 끝 화면: 결과 카드 → data-mg-end="sweeper" 순서 / FAQ 는 MG_FAQ 로만 / 스크립트 순서 /
 *      앱 JS: track start·done 한 곳씩, 일시정지(visibilitychange), prefers-reduced-motion, 길게 누르기·chord, 언어별 주소 없음, 한글 문구 없음, 지뢰 배치 노출 없음.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, shared 심볼릭 링크, tools/hub-curation.json(12개 언어·2줄 길이).
 *
 * 실행: node tools/check-sweeper.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const C = require(path.join(SITE, 'sweeper-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NB = (w, h, i) => C.neighbors({ w, h }, i);
const idx = (s, x, y) => y * s.w + x;
function invariants(s, tag) {
  let opened = 0, flags = 0, mines = 0;
  for (let i = 0; i < s.n; i++) {
    if (s.open[i]) {
      opened++;
      if (s.mine[i]) bad(`${tag} 지뢰 칸이 열려 있음 (${i})`);
      if (s.flag[i]) bad(`${tag} 열린 칸에 깃발 (${i})`);
    }
    if (s.flag[i]) flags++;
    if (s.mine[i]) mines++;
  }
  if (opened !== s.opened) bad(`${tag} opened 카운터 ${s.opened} ≠ 실제 ${opened}`);
  if (flags !== s.flags) bad(`${tag} flags 카운터 ${s.flags} ≠ 실제 ${flags}`);
  if (s.status !== 'ready' && mines !== s.mineCount) bad(`${tag} 지뢰 수 ${mines} ≠ ${s.mineCount}`);
  if (s.status !== 'ready') {
    for (let i = 0; i < s.n; i++) {
      if (s.mine[i]) continue;
      const c = C.neighbors(s, i).reduce((a, j) => a + s.mine[j], 0);
      if (c !== s.adj[i]) { bad(`${tag} adj[${i}] = ${s.adj[i]} ≠ ${c}`); break; }
    }
  }
}
function fingerprint(s) { return Array.from(s.mine).join(''); }

// 안전한 칸만 여는 풀이기(단순 규칙 2개 + chord). 막히면 멈춘다. 반환: 푼 뒤 상태
function solve(s) {
  let guard = 0;
  while (s.status === 'play' && guard++ < 5000) {
    let moved = false;
    for (let i = 0; i < s.n && s.status === 'play'; i++) {
      if (!s.open[i] || s.adj[i] === 0) continue;
      const nb = C.neighbors(s, i);
      const closed = nb.filter((j) => !s.open[j]);
      const fl = nb.filter((j) => s.flag[j]).length;
      if (closed.length && closed.length === s.adj[i]) {
        closed.filter((j) => !s.flag[j]).forEach((j) => { if (C.toggleFlag(s, j)) moved = true; });
      }
      if (fl === s.adj[i] && nb.some((j) => !s.open[j] && !s.flag[j])) {
        const r = C.chord(s, i);
        if (r.ok) moved = true;
      }
    }
    if (!moved) break;
  }
  return s;
}

function checkCore() {
  // 난이도 크기·지뢰 수
  const D = C.DIFFS;
  if (D.beginner.w !== 9 || D.beginner.h !== 9 || D.beginner.mines !== 10) bad('초급은 9×9 / 지뢰 10');
  if (D.intermediate.w !== 12 || D.intermediate.h !== 12 || D.intermediate.mines !== 24) bad('중급은 12×12 / 지뢰 24');
  if (D.expert.w !== 14 || D.expert.h !== 14 || D.expert.mines !== 40) bad('고급은 14×14 / 지뢰 40');
  C.DIFF_ORDER.forEach((k) => { if (!D[k] || !/^sweeper-[a-z]$/.test(D[k].game)) bad(`난이도 ${k} game 이름`); });
  if (new Set(C.DIFF_ORDER.map((k) => D[k].game)).size !== 3) bad('난이도마다 game 이름이 달라야 함');
  C.DIFF_ORDER.forEach((k) => { if (D[k].w * D[k].h <= D[k].mines + 9) bad(`${k}: 첫 클릭 3×3 을 빼고도 지뢰를 놓을 칸이 있어야 함`); });

  // 새 판
  const g0 = C.newGame('beginner', 1);
  if (g0.status !== 'ready' || g0.opened !== 0 || g0.flags !== 0 || g0.mine.some((v) => v)) bad('새 판은 ready·열린 칸 0·지뢰 아직 없음');
  if (C.toggleFlag(g0, 0)) bad('첫 칸을 열기 전에는 깃발이 안 돼야 함');
  if (C.reveal(g0, -1).ok || C.reveal(g0, 81).ok || C.reveal(g0, 1.5).ok) bad('범위 밖 칸 열기가 거절돼야 함');
  if (g0.status !== 'ready') bad('범위 밖 입력으로 판이 시작됨');

  // 첫 클릭 안전: 모든 난이도 · 칸 위치(모서리 포함) · 시드 수백 번
  let firstChecks = 0;
  C.DIFF_ORDER.forEach((k) => {
    const d = D[k];
    for (let seed = 1; seed <= 150; seed++) {
      const first = [0, d.w - 1, d.w * (d.h - 1), d.w * d.h - 1, Math.floor((d.w * d.h) / 2), (seed * 37) % (d.w * d.h)][seed % 6];
      const s = C.newGame(k, seed);
      const r = C.reveal(s, first);
      firstChecks++;
      if (!r.ok || !r.started) { bad(`[${k} #${seed}] 첫 칸 열기 실패`); break; }
      if (r.boom || s.status === 'lost') { bad(`[${k} #${seed}] 첫 클릭에서 터짐`); break; }
      if (s.mine[first]) { bad(`[${k} #${seed}] 첫 칸에 지뢰`); break; }
      const hit = C.neighbors(s, first).filter((j) => s.mine[j]);
      if (hit.length) { bad(`[${k} #${seed}] 첫 칸 둘레에 지뢰 ${hit.length}개 (3×3 안전 영역)`); break; }
      if (s.adj[first] !== 0) { bad(`[${k} #${seed}] 첫 칸은 빈 칸(0)이어야 함`); break; }
      if (r.opened.length < 2) { bad(`[${k} #${seed}] 첫 클릭이 flood fill 로 둘레를 열지 않음`); break; }
      const total = s.mine.reduce((a, v) => a + v, 0);
      if (total !== d.mines) { bad(`[${k} #${seed}] 지뢰 ${total}개 ≠ ${d.mines}`); break; }
      if (seed % 25 === 0) invariants(s, `[${k} #${seed}]`);
    }
  });

  // 결정성: 같은 시드 + 같은 첫 칸 = 같은 배치, 다른 시드는 달라짐, 다른 첫 칸은 안전 영역이 다름
  const a = C.newGame('expert', 777), b = C.newGame('expert', 777), c = C.newGame('expert', 778);
  C.reveal(a, 50); C.reveal(b, 50); C.reveal(c, 50);
  if (fingerprint(a) !== fingerprint(b)) bad('같은 시드 + 같은 첫 칸인데 배치가 다름');
  if (fingerprint(a) === fingerprint(c)) bad('다른 시드인데 배치가 같음');
  const rng1 = C.mulberry32(5), rng2 = C.mulberry32(5);
  if (rng1() !== rng2()) bad('mulberry32 가 결정적이지 않음');

  // flood fill: 지뢰 하나도 없는 판(지뢰 0개 사용자 정의)은 한 번에 전부 열림
  const empty = C.newGame({ w: 30, h: 20, mines: 0, game: 'sweeper-x' }, 3);
  const re = C.reveal(empty, 0);
  if (empty.opened !== 600 || empty.status !== 'won' || re.opened.length !== 600) bad(`지뢰 없는 큰 판은 한 번에 전부 열리고 이겨야 함 (${empty.opened})`);
  // flood fill 경계: 열린 빈 칸의 이웃은 모두 열려 있고, 열린 칸은 지뢰가 아님
  const ff = C.newGame('intermediate', 42);
  const rf = C.reveal(ff, 6 * 12 + 6);
  rf.opened.forEach((i) => {
    if (ff.mine[i]) bad('flood fill 이 지뢰 칸을 엶');
    if (ff.adj[i] === 0 && C.neighbors(ff, i).some((j) => !ff.open[j])) bad('flood fill: 빈 칸 둘레가 안 열림');
  });
  invariants(ff, '[flood]');
  // 숫자 칸 (adj > 0) 은 flood 가 번져 나가지 않음
  const numbered = rf.opened.filter((i) => ff.adj[i] > 0);
  if (rf.opened.length && !numbered.length && ff.status === 'play') warn('flood fill 결과에 숫자 칸이 없음(우연)');

  // 깃발
  const f1 = C.newGame('beginner', 9);
  C.reveal(f1, 40);
  let hidden = -1;
  for (let i = 0; i < f1.n; i++) if (!f1.open[i]) { hidden = i; break; }
  if (!C.toggleFlag(f1, hidden) || !f1.flag[hidden] || f1.flags !== 1 || C.minesLeft(f1) !== f1.mineCount - 1) bad('깃발 켜기');
  if (C.reveal(f1, hidden).ok || f1.open[hidden]) bad('깃발 칸은 열리면 안 됨');
  if (!C.toggleFlag(f1, hidden) || f1.flag[hidden] || f1.flags !== 0) bad('깃발 끄기');
  const openIdx = f1.open.indexOf(1);
  if (C.toggleFlag(f1, openIdx)) bad('열린 칸에 깃발이 꽂힘');
  if (C.reveal(f1, openIdx).ok) bad('이미 열린 칸을 다시 열 수 있음');

  // chord: 깃발 수 = 숫자일 때만, 틀린 깃발이면 터짐
  let chordOk = false, chordBoom = false, chordRefuse = false;
  for (let seed = 1; seed <= 60 && !(chordOk && chordBoom && chordRefuse); seed++) {
    const s = C.newGame('intermediate', seed);
    C.reveal(s, 6 * 12 + 6);
    for (let i = 0; i < s.n; i++) {
      if (!s.open[i] || s.adj[i] === 0) continue;
      const nb = C.neighbors(s, i);
      const closed = nb.filter((j) => !s.open[j]);
      const mn = closed.filter((j) => s.mine[j]);
      const safe = closed.filter((j) => !s.mine[j]);
      if (mn.length === s.adj[i] && safe.length && !chordOk) {
        const t = C.newGame('intermediate', seed);
        C.reveal(t, 6 * 12 + 6);
        const r0 = C.chord(t, i);
        if (r0.ok) bad(`chord: 깃발 0개인데 열림 (seed ${seed})`);
        mn.forEach((j) => C.toggleFlag(t, j));
        const before = t.opened;
        const r = C.chord(t, i);
        if (!r.ok || r.boom || t.opened <= before) bad(`chord: 올바른 깃발인데 안 열림 (seed ${seed})`);
        safe.forEach((j) => { if (!t.open[j]) bad(`chord: 안전한 이웃 ${j} 이 안 열림`); });
        invariants(t, '[chord]');
        chordOk = true;
        chordRefuse = chordRefuse || !r0.ok;
      }
      if (mn.length === s.adj[i] && mn.length && safe.length && !chordBoom) {
        const t = C.newGame('intermediate', seed);
        C.reveal(t, 6 * 12 + 6);
        // 지뢰 하나 대신 안전한 칸에 깃발 → 개수는 맞지만 틀린 깃발
        mn.slice(1).forEach((j) => C.toggleFlag(t, j));
        C.toggleFlag(t, safe[0]);
        const r = C.chord(t, i);
        if (!r.ok || !r.boom || t.status !== 'lost') bad(`chord: 틀린 깃발이면 터져야 함 (seed ${seed})`);
        else if (t.exploded < 0 || !t.mine[t.exploded]) bad('chord: exploded 는 지뢰 칸이어야 함');
        chordBoom = true;
      }
    }
  }
  if (!chordOk) bad('chord 검사 사례를 못 찾음');
  if (!chordBoom) bad('chord 폭발 검사 사례를 못 찾음');
  const cn = C.newGame('beginner', 5);
  C.reveal(cn, 40);
  if (C.chord(cn, cn.mine.indexOf(0)).ok && !cn.open[cn.mine.indexOf(0)]) bad('닫힌 칸에 chord 가 됨');
  const zero = cn.open.findIndex((v, i) => v && cn.adj[i] === 0);
  if (zero >= 0 && C.chord(cn, zero).ok) bad('숫자 0 인 칸에 chord 가 됨');

  // 패배: 지뢰를 열면 lost, 이후 입력 무시
  const l = C.newGame('beginner', 11);
  C.reveal(l, 40);
  const mine = l.mine.indexOf(1);
  const rl = C.reveal(l, mine);
  if (!rl.ok || !rl.boom || l.status !== 'lost' || l.exploded !== mine) bad('지뢰를 열면 lost + exploded');
  const openedBefore = l.opened;
  const safeIdx = l.mine.findIndex((v, i) => !v && !l.open[i]);
  if (safeIdx >= 0 && (C.reveal(l, safeIdx).ok || l.opened !== openedBefore)) bad('끝난 뒤에도 칸이 열림');
  if (C.toggleFlag(l, safeIdx)) bad('끝난 뒤에도 깃발이 꽂힘');
  if (C.wrongFlags(l).length) bad('깃발이 없는데 wrongFlags');

  // 승리: 풀이기가 이길 수 있는 판(초급)에서 won + 지뢰 자동 깃발 + 입력 무시
  let won = 0, played = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const s = C.newGame('beginner', seed);
    C.reveal(s, 40);
    solve(s);
    played++;
    invariants(s, `[solve #${seed}]`);
    if (s.status === 'won') {
      won++;
      if (s.opened !== s.n - s.mineCount) bad(`승리인데 열린 칸 ${s.opened} ≠ ${s.n - s.mineCount}`);
      if (s.flags !== s.mineCount || C.minesLeft(s) !== 0) bad('승리 뒤 지뢰가 자동으로 깃발 표시돼야 함');
      if (C.progress(s) !== 1) bad('승리 progress 1');
      if (C.reveal(s, 0).ok || C.toggleFlag(s, 0)) bad('승리 뒤에도 입력됨');
    } else if (s.status === 'lost') bad(`풀이기가 안전한 수만 두는데 터짐 (seed ${seed})`);
    else if (s.opened >= s.n - s.mineCount) bad('안전한 칸을 다 열었는데 won 이 아님');
  }
  if (won < 60) bad(`풀이기가 초급 ${played}판 중 ${won}판만 이김 (규칙 오류 의심)`);
  // 마지막 안전 칸을 열면 바로 won
  const w = C.newGame('beginner', 21);
  C.reveal(w, 40);
  for (let i = 0; i < w.n && w.status === 'play'; i++) if (!w.mine[i] && !w.open[i]) C.reveal(w, i);
  if (w.status !== 'won') bad('안전한 칸을 모두 열면 won');
  else if (C.reveal(w, 0).ok) bad('won 뒤 열기');

  // 봇: 무작위 클릭·깃발·chord 를 섞어 수백 판, 매 단계 불변식
  const rnd = C.mulberry32(2026);
  let bots = 0, ended = 0;
  C.DIFF_ORDER.forEach((k) => {
    for (let n = 0; n < 60; n++) {
      const s = C.newGame(k, 1000 + n);
      for (let step = 0; step < 400 && (s.status === 'play' || s.status === 'ready'); step++) {
        const i = Math.floor(rnd() * s.n);
        const roll = rnd();
        if (roll < 0.6) C.reveal(s, i); else if (roll < 0.8) C.toggleFlag(s, i); else C.chord(s, i);
        if (step % 10 === 0) invariants(s, `[bot ${k} ${n}]`);
      }
      invariants(s, `[bot ${k} ${n} 끝]`);
      if (s.status === 'won' || s.status === 'lost') ended++;
      bots++;
    }
  });
  if (ended < bots / 2) bad(`무작위 봇 ${bots}판 중 ${ended}판만 끝남`);

  // 서버 인코딩: bucket 0..1999 정수, 빠를수록 큼
  if (C.bucket(0) !== C.MAX_BUCKET || C.bucket(10) <= C.bucket(60) || C.bucket(99999) !== 0) bad('bucket: 빠를수록 큼·0..1999');
  [0, 0.2, 7.3, 59, 1000, 1e6, NaN].forEach((t) => { const v = C.bucket(t); if (!Number.isInteger(v) || v < 0 || v > C.MAX_BUCKET) bad(`bucket(${t}) = ${v} 범위 밖`); });
  const rows = [{ score_bucket: 1990, players: 5 }, { score_bucket: 1950, players: 20 }, { score_bucket: 1900, players: 10 }];
  const p = C.percentile(rows, 1950);
  if (!p || p.total !== 35 || p.first || p.top < 1 || p.top > 100) bad('percentile 계산');
  if (!C.percentile([{ score_bucket: 1950, players: 1 }], 1950).first) bad('percentile: 혼자면 first');
  if (C.percentile(null, 5) !== null || C.percentile('x', 5) !== null) bad('percentile: 잘못된 입력은 null');
  if (C.percentile([{ score_bucket: 1990, players: 9 }], 1900).top < 90) bad('percentile: 느린 기록은 상위 % 가 커야 함');
  void NB; void idx;
  console.log(`  로직: 첫 클릭 ${firstChecks}판 · 풀이기 ${played}판(승 ${won}) · 봇 ${bots}판(종료 ${ended})`);
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
// 제목 글꼴 폭 보정 (Audiowide 는 아주 넓은 편, Russo One 도 넓은 편)
const displayFactor = (T) => ({ Audiowide: 1.3, 'Russo One': 1.15, 'Chakra Petch': 1.0, 'Do Hyeon': 0.9, DotGothic16: 1.0, 'ZCOOL QingKe HuangYou': 0.95 }[firstFont(T.fonts.display)] || 1.1);
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
// 360px 폭(본문 칸 328px) 예산. 통계 칸 = (328 − 32 − 8) / 2, 안쪽 여백 15
const STAT = (328 - 32 - 8) / 2 - 15;
const HUD = (328 - 16) / 3.6 - 16;  // HUD 칸(지뢰·시간) 안쪽 폭 (1 : 1 : 1.6)
const MODE = (328 - 16) * 1.6 / 3.6 - 20 - 20 - 6; // 모드 버튼 글자 폭 (안쪽 여백·아이콘·간격 뺌)
const TIER_PX = 328 - 32 - 24 - 50;    // 머리 줄: 카드 안쪽 폭 − 이모지(40px) − 간격
const DIFF = (328 - 16) / 3 - 8 - 4;   // 난이도 칸 글자 폭
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 40, size: 19, max: 1, what: '시작 버튼 한 줄', track: 0.02 },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 31, size: 13, max: 1, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328 - 24, size: 15, max: 1, what: 'h1 검색어 칸 한 줄', track: 0.02 },
  { key: 'start.facts', get: (T) => T.start.facts, px: 328, size: 13, max: 2, what: '사실 두 줄까지', factor: 1.05 },
  { key: 'start.diffLabel', get: (T) => T.start.diffLabel, px: 328, size: 13, max: 1, what: '난이도 안내 한 줄', factor: 1.05 },
  ...['reveal', 'flag', 'chord'].map((k) => ({ key: `start.how.${k}`, get: (T) => T.start.how[k], px: 104 - 15, size: 12.5, max: 3, what: '방법 칸 세 줄까지', word: 104 - 15 })),
  ...['beginner', 'intermediate', 'expert'].map((k) => ({ key: `start.diffs.${k}`, get: (T) => T.start.diffs[k], px: DIFF, size: 14, max: 2, what: '난이도 이름 두 줄까지', word: DIFF })),
  { key: 'play.mines', get: (T) => T.play.mines, px: HUD, size: 11, max: 1, what: 'HUD 지뢰 이름표', track: 0.06 },
  { key: 'play.time', get: (T) => T.play.time, px: HUD, size: 11, max: 1, what: 'HUD 시간 이름표', track: 0.06 },
  { key: 'play.digMode', get: (T) => T.play.digMode, px: MODE, size: 15, max: 2, what: '모드 버튼 두 줄까지', word: MODE },
  { key: 'play.flagMode', get: (T) => T.play.flagMode, px: MODE, size: 15, max: 2, what: '모드 버튼 두 줄까지', word: MODE },
  { key: 'play.paused', get: (T) => T.play.paused, px: 300, size: 20, max: 3, what: '일시정지 안내 세 줄까지' },
  { key: 'result.win', get: (T) => T.result.win, px: TIER_PX, size: 23, max: 2, what: '승리 머리 두 줄까지', word: TIER_PX },
  { key: 'result.lose', get: (T) => T.result.lose, px: TIER_PX, size: 23, max: 2, what: '패배 머리 두 줄까지', word: TIER_PX },
  { key: 'result.newBest', get: (T) => T.result.newBest, px: 328 - 32 - 24, size: 15, max: 1, what: '최고 기록 배지' },
  { key: 'result.best', get: (T) => T.result.best.replace('{t}', '123,4 ' + T.result.sec), px: 328 - 32, size: 15, max: 1, what: '최고 기록 한 줄' },
  { key: 'result.timeLabel', get: (T) => T.result.timeLabel, px: STAT, size: 12.5, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.clearedLabel', get: (T) => T.result.clearedLabel, px: STAT, size: 12.5, max: 2, what: '통계 칸 이름 두 줄까지', word: STAT },
  { key: 'result.top', get: (T) => T.result.top.replace('{n}', '100'), px: 328 - 32 - 24, size: 28, max: 1, what: '상위 % 한 줄' },
  { key: 'result.beat', get: (T) => T.result.beat.replace('{pct}', '100'), px: 328 - 32 - 24, size: 15, max: 2, what: '백분위 문장 두 줄까지', factor: 1.05 },
  { key: 'result.beatAll', get: (T) => T.result.beatAll, px: 328 - 32 - 24, size: 15, max: 2, what: '1등 문장 두 줄까지', factor: 1.05 },
  { key: 'result.others', get: (T) => T.result.others.replace('{n}', '12,345'), px: 328 - 32 - 24, size: 13, max: 2, what: '비교 수 두 줄까지', factor: 1.05 },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, max: 1, what: '다시 하기 버튼 한 줄', factor: 1.05 },
];
// Google Fonts 메타데이터(subsets)로 확인한 글꼴
const CYRILLIC_FONTS = ['Russo One', 'Rubik'];
const VIET_FONTS = ['Chakra Petch', 'Be Vietnam Pro'];
const LATIN_EXT_FONTS = ['Audiowide'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|рейтинг/i;
const PLACEHOLDERS = [['play.aNum', ['n']], ['result.best', ['t']], ['result.top', ['n']], ['result.beat', ['pct']], ['result.others', ['n']], ['result.shareWin', ['time', 'diff']], ['result.shareLose', ['pct', 'diff']]];
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
    // 난이도 이름
    if (!T.start.diffs || ['beginner', 'intermediate', 'expert'].some((k) => !T.start.diffs[k]) || new Set(Object.values(T.start.diffs)).size !== 3) bad(`${tag} start.diffs 는 서로 다른 이름 3개`);
    if (!T.play.aHidden || !T.play.aFlag || !T.play.aMine) bad(`${tag} 칸 접근성 문구(aHidden/aFlag/aMine)`);
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
    if (lang === 'th' && !['Chakra Petch', 'Mitr', 'Kanit'].includes(disp)) bad(`${tag} 태국어 글꼴 "${disp}"`);
    if (lang === 'ja' && F.wordBreak !== 'auto-phrase') warn(`${tag} ja wordBreak auto-phrase 권장`);
    if (lang === 'ko' && F.wordBreak !== 'keep-all') bad(`${tag} ko wordBreak 는 keep-all`);
    if (lang === 'ru' && /(^|[^а-яё])(вы|вас|вам|ваш)([^а-яё]|$)/i.test(JSON.stringify([T.start, T.play, T.result, T.faq]))) bad(`${tag} 게임 문구는 «ты» (вы 금지)`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || (h1.match(/<em>[^<]+<\/em>/g) || []).length !== 1 || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em>…</em> 강조 1개만`);
    const h1Size = isWideLang(lang) && lang !== 'th' ? 32 : 30;
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
    [T.meta.ogTitle, APP.desc[lang]].forEach((v) => { if (!String(v).trim()) bad(`${tag} 빈 문구`); });
    if (!low(T.meta.ogTitle).includes(low(APP.title[lang]))) warn(`${tag} ogTitle 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    if (!low(T.meta.description).includes(low(APP.title[lang]))) warn(`${tag} meta.description 에 검색어 "${APP.title[lang]}" 이 그대로 없음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 170] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 180];
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
  if (!/<link rel="canonical" href="https:\/\/sweeper\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/sweeper\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      if (/data-mg-end|mg-faq|<details|tf-result/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/결과`);
      if (!/<h1 class="tf-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(`<span class="tf-kicker">${G.esc(T.start.h1Kicker)}</span>`)) bad(`${tag} h1 에 검색어(h1Kicker)가 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if ((start.match(/<li>/g) || []).length !== 3) bad(`${tag} 짧은 방법은 3칸`);
      const startText = start.replace(/<[^>]+>/g, ' ');
      if (startText.replace(/\s+/g, ' ').length > 520) bad(`${tag} 시작 화면 글이 너무 김 (티징만)`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      ['hud-mines', 'hud-time', 'mode-btn', 'mode-ico', 'mode-txt', 'field', 'board', 'pause-btn'].forEach((id) => { if (!playS.includes(`id="${id}"`)) bad(`${tag} 게임 화면에 #${id} 없음`); });
      if (!/<div id="board" class="tf-board" role="group"/.test(playS)) bad(`${tag} 판은 <div id="board" class="tf-board" role="group">`);
      if (/<button[^>]*class="tf-cell"/.test(html) || /data-mine|is-mine/.test(html)) bad(`${tag} 칸/지뢰 배치가 HTML 에 미리 들어 있음 (판은 시작할 때 JS 로 만든다)`);
      if (!/<button id="pause-btn"[^>]*hidden/.test(playS)) bad(`${tag} 일시정지 덮개는 처음에 hidden`);
      if (!/<button id="mode-btn"[^>]*aria-pressed="false"/.test(playS)) bad(`${tag} 모드 버튼 aria-pressed`);
      if ((start.match(/role="radio"/g) || []).length !== 3 || !/id="diffs"[^>]*role="radiogroup"/.test(start)) bad(`${tag} 시작 화면 난이도 라디오 3개`);
      Object.keys(C.DIFFS).forEach((k) => { if (!start.includes(`data-diff="${k}"`)) bad(`${tag} 난이도 ${k} 버튼 없음`); });
      const resAt = end.indexOf('class="tf-result"');
      const endAt = end.indexOf('<div data-mg-end="sweeper"></div>');
      if (!(resAt > 0 && endAt > resAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="sweeper" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['res-reason', 'res-head-emoji', 'res-head', 'res-big', 'res-unit', 'res-newbest', 'res-best', 'res-time', 'res-clear', 'res-rank', 'res-rank-body', 'res-top', 'res-beat', 'res-others'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
      if (!/<div id="res-rank" class="tf-rank" hidden>/.test(end)) bad(`${tag} 백분위 칸은 처음에 숨김 (서버 값이 올 때만)`);
      if (/\d+\s?%/.test(end.replace(/<[^>]+>/g, ' '))) bad(`${tag} 끝 화면 HTML 에 고정된 % 숫자`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (!(html.indexOf('sweeper-core.js') > 0 && html.indexOf('sweeper-core.js') < html.indexOf('sweeper.js"'))) bad(`${tag} sweeper-core.js 가 sweeper.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://sweeper.example.com/</loc>') || !sm.includes('<loc>https://sweeper.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 JS: 문구를 코드에 두지 않는다, 언어별 주소를 만들지 않는다, track start/done
  const js = read('sweeper.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  if (/['"]\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\//.test(js)) bad('sweeper.js 에서 언어별 주소를 만듦');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("sweeper.js track('start')/track('done') 는 한 곳씩");
  if (!/prefers-reduced-motion/.test(js)) bad('sweeper.js: 움직임 줄이기 처리 없음');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('sweeper.js: setShareData/setRetry 없음');
  if (!/pointerdown/.test(js) || !/pointerup/.test(js) || !/contextmenu/.test(js) || !/keydown/.test(js) || !/ArrowLeft/.test(js)) bad('sweeper.js: 탭/길게 누르기(pointer)·오른쪽 클릭·키보드 입력 없음');
  if (!/LONG_MS/.test(js) || !/setTimeout/.test(js)) bad('sweeper.js: 길게 눌러 깃발 없음');
  if (!/C\.chord\(/.test(js)) bad('sweeper.js: 숫자 칸 chord 없음');
  if (!/visibilitychange/.test(js) || !/document\.hidden/.test(js)) bad('sweeper.js: 탭을 숨기면 일시정지(visibilitychange) 없음');
  if (!/localStorage/.test(js)) bad('sweeper.js: 최고 기록(localStorage) 없음');
  if (!/supa\.submitScore\(C\.DIFFS\[diff\]\.game/.test(js)) bad('sweeper.js: supa.submitScore(난이도 game 이름, …) 없음');
  if (!/status === 'won'/.test(js)) bad('sweeper.js: 이긴 판에서만 점수 전송');
  if (/supabase|\.supabase\.co/i.test(js)) bad('sweeper.js 에 Supabase 주소');
  if (/[가-힯]/.test(js.replace(/\/\/.*$/gm, ''))) bad('sweeper.js 코드에 한글 문구');
  const css = read('style.css');
  if (!/\.tf-board\s*\{[^}]*touch-action:\s*manipulation/.test(css)) bad('style.css: 판 touch-action: manipulation (더블탭 확대 막기)');
  if (!/user-select:\s*none/.test(css)) bad('style.css: 칸 user-select: none');
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
  if (APP.id !== 'sweeper' || APP.category !== 'game' || APP.path !== 'https://sweeper.example.com/' || APP.added !== '2026-10-10' || APP.order !== 1 || APP.emoji !== '💣') bad('app.config.js id/category/path/added/order/emoji');
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
    if (/[\u1100-\u11ff\u2e80-\u9fff\uac00-\ud7af\uff00-\uffef\u3000-\u303f]/.test(ch)) w += 1;
    else if (THAI_MARK(ch.codePointAt(0))) w += 0;
    else if (/[\u0e00-\u0e7f]/.test(ch)) w += 0.62;
    else if (/\s/.test(ch)) w += 0.28;
    else if (/[A-ZÀ-ÞĐƠƯА-ЯЁ]/.test(ch)) w += 0.66;
    else w += 0.54;
  }
  return w;
}
function hubLines(str, px, width) {
  const ws = /[\u0e00-\u0e7f\u3040-\u30ff\u4e00-\u9fff]/.test(str) ? [...str] : str.split(/(?<=\s)/);
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

checkCore();
checkCuration();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 게임 로직(첫 클릭 안전·flood fill·chord·승패·결정성·봇)·서버 점수 분포(bucket·백분위), 언어 파일 12개(키·번역·자리표시자·FAQ·글꼴·제목·360px 폭), 생성 HTML(SEO·타이틀 바·시작 화면 티징·시작 화면 맨 끝 광고 1개·난이도·게임 중 광고 없음·끝 화면 순서·FAQPage 없음), OG 이미지 모두 OK');
