/* apps/sudoku/sudoku.js — 시작(티징 + 난이도 + 이어 하기/오늘의 퍼즐) → 게임(HUD + 판 + 도구 + 숫자 패드, 광고 없음) → 끝 화면(결과 카드 + 공통 끝 화면)
 * 규칙·생성기는 sudoku-core.js(SUDOKU_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 입력: 칸 탭 = 고르기, 숫자 패드 = 넣기(메모 모드면 작은 후보 숫자), 지우기·되돌리기·힌트(한 판 3번)·틀린 숫자 표시(Check) 켜고 끄기.
 *   키보드: ← ↑ → ↓ 이동 · 1~9 넣기 · Backspace/Delete/0 지우기 · N 메모 · Z(또는 Ctrl/⌘+Z) 되돌리기.
 * 강조: 고른 칸의 줄·열·상자, 같은 숫자, 규칙 충돌(같은 줄·열·상자에 같은 숫자)은 늘 빨간 테두리, 정답과 다른 숫자는 Check 를 켰을 때만 빨간 글자.
 * 실수 = 정답과 다른 숫자를 넣은 횟수(Check 와 무관하게 센다).
 * 저장: 진행 중인 판은 localStorage sudoku_save_v1 (움직일 때마다·5초마다·탭을 떠날 때) → 시작 화면 "이어 하기". 다 풀면 지운다.
 *   최고 기록(난이도별 최단 ms): sudoku_best_v1, 마지막 난이도: sudoku_diff_v1.
 * 기록: 새 퍼즐을 시작할 때 track('start') 한 번, 다 풀어 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만(힌트 없이 푼 판만). 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 탭을 숨기면 시간이 멈추고 판이 가려진다(돌아와 탭하면 이어서). prefers-reduced-motion 이면 움직임을 끈다.
 * 디버그/검사용 핸들: window.SUDOKU_APP (phase(), game(), elapsed(), solveAll())
 */
(function () {
  'use strict';

  var C = window.SUDOKU_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var S = UI.start || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SAVE_KEY = 'sudoku_save_v1';
  var BEST_KEY = 'sudoku_best_v1';
  var LAST_KEY = 'sudoku_diff_v1';
  var HINTS = 3;
  var UNDO_MAX = 300;
  var END_DELAY = REDUCED ? 300 : 900;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'),
    startBtn: $('start-btn'), dailyBtn: $('daily-btn'), resumeBtn: $('resume-btn'), resumeInfo: $('resume-info'), diffs: $('diffs'),
    level: $('hud-level'), mistakes: $('hud-mistakes'), time: $('hud-time'),
    field: $('field'), board: $('board'), pause: $('pause-btn'), pad: $('pad'),
    undo: $('undo-btn'), erase: $('erase-btn'), notes: $('notes-btn'), hint: $('hint-btn'), hintLeft: $('hint-left'), check: $('check-btn'),
    reason: $('res-reason'), big: $('res-big'), newBest: $('res-newbest'), resBest: $('res-best'),
    resMistakes: $('res-mistakes'), resHints: $('res-hints'),
    rank: $('res-rank'), comparing: $('res-comparing'), rankBody: $('res-rank-body'),
    top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var phase = 'start';     // start | play | ending | end
  var diff = 'easy';
  var game = null;         // { diff, daily, date, seed, puzzle[], solution[], values[], notes[], locked[], mistakes, hints, check, submitted }
  var sel = -1;
  var notesMode = false;
  var undoStack = [];
  var cells = [];
  var keys = [];
  var runId = 0, doneSent = false, endTimer = 0, tickTimer = 0, saveTimer = 0;
  var baseMs = 0, t0 = 0, running = false, paused = false;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }
  function clock(ms) {
    var s = Math.floor(Math.max(0, ms) / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
  }
  function diffName(d) { return (S.diffs || {})[d] || d; }
  function toast(msg) { if (window.toast) window.toast(msg); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 저장 (이 브라우저)
  function readJson(key) { try { var o = JSON.parse(localStorage.getItem(key) || 'null'); return o && typeof o === 'object' ? o : null; } catch (e) { return null; } }
  function writeJson(key, o) { try { if (o == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(o)); } catch (e) { /* noop */ } }
  function getBest(d) { var v = Number((readJson(BEST_KEY) || {})[d]); return isFinite(v) && v > 0 ? v : 0; }
  function setBest(d, ms) { var o = readJson(BEST_KEY) || {}; o[d] = Math.round(ms); writeJson(BEST_KEY, o); }
  function loadDiff() { try { var d = localStorage.getItem(LAST_KEY); if (d && C.DIFFS[d]) return d; } catch (e) { /* noop */ } return 'easy'; }
  function saveDiff(d) { try { localStorage.setItem(LAST_KEY, d); } catch (e) { /* noop */ } }

  function saveGame() {
    if (!game || phase !== 'play') return;
    writeJson(SAVE_KEY, {
      v: 1, diff: game.diff, daily: game.daily, date: game.date, seed: game.seed,
      puzzle: C.toStr(game.puzzle), solution: C.toStr(game.solution), values: C.toStr(game.values),
      notes: game.notes.slice(), locked: game.locked.map(function (x) { return x ? 1 : 0; }).join(''),
      mistakes: game.mistakes, hints: game.hints, check: !!game.check, ms: Math.round(elapsed())
    });
  }
  // 저장본이 온전한지 확인한다: 81칸 문자열, 정답이 규칙에 맞고 단서가 정답과 같을 것
  function loadSave() {
    var o = readJson(SAVE_KEY);
    if (!o || o.v !== 1 || !C.DIFFS[o.diff]) return null;
    var puzzle = C.fromStr(o.puzzle), solution = C.fromStr(o.solution), values = C.fromStr(o.values);
    if (!puzzle || !solution || !values || !Array.isArray(o.notes) || o.notes.length !== 81 || typeof o.locked !== 'string' || o.locked.length !== 81) return null;
    if (solution.indexOf(0) >= 0 || C.conflicts(solution).length) return null;
    for (var i = 0; i < 81; i++) if (puzzle[i] && (puzzle[i] !== solution[i] || values[i] !== puzzle[i])) return null;
    return {
      diff: o.diff, daily: !!o.daily, date: String(o.date || ''), seed: Number(o.seed) >>> 0,
      puzzle: puzzle, solution: solution, values: values,
      notes: o.notes.map(function (n) { n = Number(n); return isFinite(n) ? n & 0x1ff : 0; }),
      locked: o.locked.split('').map(function (x, j) { return x === '1' || !!puzzle[j]; }),
      mistakes: Math.max(0, Number(o.mistakes) || 0), hints: clampInt(o.hints, 0, HINTS), check: !!o.check,
      ms: Math.max(0, Number(o.ms) || 0), submitted: false
    };
  }
  function clampInt(v, lo, hi) { v = Math.floor(Number(v) || 0); return v < lo ? lo : v > hi ? hi : v; }
  function drawResume() {
    var s = loadSave();
    els.resumeBtn.hidden = !s;
    if (s) els.resumeInfo.textContent = fmt(S.resumeInfo, { diff: diffName(s.diff) + (s.daily ? ' · ' + P.daily : ''), time: clock(s.ms) });
  }

  // ---------------------------------------------------------------- 난이도 고르기
  function selectDiff(d) {
    diff = d;
    Array.prototype.forEach.call(els.diffs.querySelectorAll('.sd-diff'), function (b) {
      var on = b.getAttribute('data-diff') === d;
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
  }
  els.diffs.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.sd-diff') : null;
    if (!b) return;
    selectDiff(b.getAttribute('data-diff'));
    saveDiff(diff);
  });
  els.diffs.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'ArrowUp' && k !== 'ArrowDown') return;
    e.preventDefault();
    var i = C.DIFF_ORDER.indexOf(diff) + (k === 'ArrowLeft' || k === 'ArrowUp' ? -1 : 1);
    i = (i + C.DIFF_ORDER.length) % C.DIFF_ORDER.length;
    selectDiff(C.DIFF_ORDER[i]);
    saveDiff(diff);
    var b = els.diffs.querySelector('[data-diff="' + diff + '"]');
    if (b) b.focus();
  });

  // ---------------------------------------------------------------- 시간 (탭을 숨기면 멈춘다)
  function elapsed() { return baseMs + (running ? performance.now() - t0 : 0); }
  function drawTime() { els.time.textContent = clock(elapsed()); }
  function startClock() {
    if (running) return;
    t0 = performance.now();
    running = true;
    clearInterval(tickTimer);
    tickTimer = setInterval(drawTime, 250);
  }
  function stopClock() {
    if (running) { baseMs += performance.now() - t0; running = false; }
    clearInterval(tickTimer);
    drawTime();
  }
  function pauseNow() {
    if (phase !== 'play' || paused) return;
    paused = true;
    stopClock();
    saveGame();
    els.pause.hidden = false;
  }
  function resumeNow() {
    if (!paused) return;
    paused = false;
    els.pause.hidden = true;
    if (phase === 'play') startClock();
    if (sel >= 0) focusCell(sel);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseNow(); });
  window.addEventListener('pagehide', saveGame);
  els.pause.addEventListener('click', resumeNow);

  // ---------------------------------------------------------------- 판 그리기
  function cellLabel(i) {
    var g = game, r = C.ROW[i] + 1, c = C.COL[i] + 1;
    if (g.puzzle[i]) return fmt(P.aGiven, { r: r, c: c, n: g.puzzle[i] });
    if (g.values[i]) return fmt(P.aValue, { r: r, c: c, n: g.values[i] });
    if (g.notes[i]) {
      var list = [];
      for (var d = 1; d <= 9; d++) if (g.notes[i] & (1 << (d - 1))) list.push(d);
      return fmt(P.aNotes, { r: r, c: c, list: list.join(' ') });
    }
    return fmt(P.aEmpty, { r: r, c: c });
  }
  function buildBoard() {
    els.board.textContent = '';
    cells = [];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 81; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sd-cell';
      b.setAttribute('data-i', String(i));
      b.tabIndex = -1;
      cells.push(b);
      frag.appendChild(b);
    }
    els.board.appendChild(frag);
    sizeBoard();
  }
  function sizeBoard() {
    if (!game) return;
    var avail = Math.min(456, (els.play.clientWidth || 448)) - 8;
    var byW = Math.floor(avail / 9);
    var vh = window.innerHeight || 800;
    var byH = Math.floor((vh - 300) / 9);
    var px = Math.max(30, Math.min(byW, Math.max(byH, 34), 50));
    els.board.style.setProperty('--cell', px + 'px');
  }
  function renderAll() {
    var g = game;
    var conflicts = {};
    C.conflicts(g.values).forEach(function (i) { conflicts[i] = 1; });
    var sv = sel >= 0 ? g.values[sel] : 0;
    for (var i = 0; i < 81; i++) {
      var el = cells[i], v = g.values[i];
      var cls = 'sd-cell';
      if (C.COL[i] === 2 || C.COL[i] === 5) cls += ' bR';
      if (C.ROW[i] === 2 || C.ROW[i] === 5) cls += ' bB';
      if (g.puzzle[i]) cls += ' is-given';
      else if (g.locked[i]) cls += ' is-hint';
      else if (v) cls += ' is-user';
      if (v && conflicts[i]) cls += ' is-conflict';
      if (v && g.check && !g.puzzle[i] && v !== g.solution[i]) cls += ' is-wrong';
      if (i === sel) cls += ' is-sel';
      else if (sel >= 0 && (C.ROW[i] === C.ROW[sel] || C.COL[i] === C.COL[sel] || C.BOX[i] === C.BOX[sel])) cls += ' is-peer';
      if (sv && v === sv && i !== sel) cls += ' is-same';
      if (el.className !== cls) el.className = cls;
      var html = '';
      if (v) html = String(v);
      else if (g.notes[i]) {
        html = '<span class="sd-notes">';
        for (var d = 1; d <= 9; d++) html += '<i' + (sv === d ? ' class="on"' : '') + '>' + (g.notes[i] & (1 << (d - 1)) ? d : '') + '</i>';
        html += '</span>';
      }
      if (el._h !== html) { el.innerHTML = html; el._h = html; }
      el.setAttribute('aria-label', cellLabel(i));
      el.tabIndex = i === (sel >= 0 ? sel : 40) ? 0 : -1;
    }
    var counts = C.digitCounts(g.values);
    keys.forEach(function (k, j) {
      var d = j + 1, left = Math.max(0, 9 - counts[d]);
      k.querySelector('.sd-key-left').textContent = left ? String(left) : '';
      k.classList.toggle('is-done', left === 0);
      k.classList.toggle('is-same', !!sv && sv === d);
      k.setAttribute('aria-label', fmt(P.aKey, { n: d, left: left }));
    });
    els.mistakes.textContent = String(g.mistakes);
    els.hintLeft.textContent = String(HINTS - g.hints);
    els.hint.classList.toggle('is-empty', g.hints >= HINTS);
    els.undo.disabled = !undoStack.length;
    els.notes.setAttribute('aria-pressed', notesMode ? 'true' : 'false');
    els.check.setAttribute('aria-pressed', g.check ? 'true' : 'false');
  }
  function focusCell(i) {
    if (!cells[i]) return;
    try { cells[i].focus({ preventScroll: true }); } catch (e) { cells[i].focus(); }
  }
  function select(i, focus) {
    sel = i;
    renderAll();
    if (focus) focusCell(i);
  }

  // ---------------------------------------------------------------- 동작
  function editable(i) { return i >= 0 && !game.puzzle[i] && !game.locked[i]; }
  // 바꿀 칸(과 메모가 지워질 이웃)의 이전 상태를 한 묶음으로 쌓는다
  function snapshot(list) {
    var seen = {}, items = [];
    list.forEach(function (i) { if (!seen[i]) { seen[i] = 1; items.push([i, game.values[i], game.notes[i]]); } });
    undoStack.push(items);
    if (undoStack.length > UNDO_MAX) undoStack.shift();
  }
  function peersWithNote(i, d) {
    var bit = 1 << (d - 1);
    return C.PEERS[i].filter(function (j) { return !game.values[j] && (game.notes[j] & bit); });
  }
  function input(d) {
    if (phase !== 'play' || paused || sel < 0) return;
    if (!editable(sel)) { select(sel); return; }
    var g = game, i = sel, bit = 1 << (d - 1);
    if (notesMode) {
      if (g.values[i]) return;
      snapshot([i]);
      g.notes[i] ^= bit;
    } else {
      if (g.values[i] === d) {
        snapshot([i]);
        g.values[i] = 0;
      } else {
        var peers = peersWithNote(i, d);
        snapshot([i].concat(peers));
        g.values[i] = d;
        g.notes[i] = 0;
        peers.forEach(function (j) { g.notes[j] &= ~bit; });
        if (d !== g.solution[i]) g.mistakes++;
      }
    }
    afterMove();
  }
  function erase() {
    if (phase !== 'play' || paused || !editable(sel)) return;
    var g = game;
    if (!g.values[sel] && !g.notes[sel]) return;
    snapshot([sel]);
    g.values[sel] = 0;
    g.notes[sel] = 0;
    afterMove();
  }
  function undo() {
    if (phase !== 'play' || paused || !undoStack.length) return;
    var items = undoStack.pop();
    items.forEach(function (it) {
      if (!editable(it[0])) return;
      game.values[it[0]] = it[1];
      game.notes[it[0]] = it[2];
    });
    if (items.length) sel = items[0][0];
    afterMove();
  }
  function hint() {
    if (phase !== 'play' || paused) return;
    var g = game;
    if (g.hints >= HINTS) { toast(P.noHints); return; }
    var i = C.hintCell(g.values, g.solution, g.puzzle, sel);
    if (i < 0) return;
    var d = g.solution[i];
    peersWithNote(i, d).forEach(function (j) { g.notes[j] &= ~(1 << (d - 1)); });
    g.values[i] = d;
    g.notes[i] = 0;
    g.locked[i] = true;
    g.hints++;
    undoStack = [];      // 힌트로 채운 칸은 되돌리지 않는다
    sel = i;
    afterMove();
    focusCell(i);
  }
  function afterMove() {
    renderAll();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveGame, 300);
    if (C.isSolved(game.values, game.solution)) finish();
  }
  function setNotes(on) { notesMode = !!on; renderAll(); }
  function toggleCheck() { if (!game) return; game.check = !game.check; renderAll(); saveGame(); }

  els.board.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.sd-cell') : null;
    if (!t || phase !== 'play' || paused) return;
    select(Number(t.getAttribute('data-i')), e.detail === 0);
  });
  els.pad.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.sd-key') : null;
    if (t) input(Number(t.getAttribute('data-n')));
  });
  els.undo.addEventListener('click', undo);
  els.erase.addEventListener('click', erase);
  els.notes.addEventListener('click', function () { setNotes(!notesMode); });
  els.hint.addEventListener('click', hint);
  els.check.addEventListener('click', toggleCheck);
  els.board.addEventListener('selectstart', function (e) { e.preventDefault(); });
  // 키보드 (게임 화면에서만, 언어 선택 같은 입력 칸은 건드리지 않는다)
  document.addEventListener('keydown', function (e) {
    if (phase !== 'play' || paused) return;
    var tg = e.target && e.target.tagName;
    if (tg === 'SELECT' || tg === 'INPUT' || tg === 'TEXTAREA') return;
    var k = e.key;
    if ((e.ctrlKey || e.metaKey) && (k === 'z' || k === 'Z')) { e.preventDefault(); undo(); return; }
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (/^[1-9]$/.test(k)) { e.preventDefault(); input(Number(k)); return; }
    if (k === 'Backspace' || k === 'Delete' || k === '0') { e.preventDefault(); erase(); return; }
    if (k === 'n' || k === 'N') { setNotes(!notesMode); return; }
    if (k === 'z' || k === 'Z') { undo(); return; }
    var i = sel >= 0 ? sel : 40, r = C.ROW[i], c = C.COL[i];
    if (k === 'ArrowLeft') c = (c + 8) % 9; else if (k === 'ArrowRight') c = (c + 1) % 9;
    else if (k === 'ArrowUp') r = (r + 8) % 9; else if (k === 'ArrowDown') r = (r + 1) % 9;
    else return;
    e.preventDefault();
    select(r * 9 + c, true);
  });

  // ---------------------------------------------------------------- 끝
  function finish() {
    if (phase !== 'play') return;
    phase = 'ending';
    stopClock();
    clearTimeout(saveTimer);
    writeJson(SAVE_KEY, null);
    sel = -1;
    renderAll();
    els.board.classList.add('is-solved');
    var myRun = runId;
    clearTimeout(endTimer);
    endTimer = setTimeout(function () { if (myRun === runId) showEnd(myRun); }, END_DELAY);
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var timer = setTimeout(function () { if (!done) { done = true; resolve(null); } }, ms);
      Promise.resolve(promise).then(function (v) {
        if (done) return;
        done = true; clearTimeout(timer); resolve(v);
      }, function () {
        if (done) return;
        done = true; clearTimeout(timer); resolve(null);
      });
    });
  }

  // 힌트 없이 푼 판에서만 한 번 시간을 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(sec, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || game.submitted || game.hints > 0) return;
    game.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(sec);
    withTimeout(supa.submitScore(C.DIFFS[game.diff].game, b), 8000).then(function (rows) {
      if (myRun !== runId) return;
      var p = C.percentile(rows, b);
      if (!p || p.first) { els.rank.hidden = true; return; }
      els.comparing.hidden = true;
      els.rankBody.hidden = false;
      els.top.textContent = fmt(R.top, { n: p.top });
      els.beat.textContent = p.beatPct >= 100 ? R.beatAll : fmt(R.beat, { pct: p.beatPct });
      els.others.textContent = fmt(R.others, { n: num(p.others) });
    });
  }

  function showEnd(myRun) {
    var g = game, ms = elapsed();
    phase = 'end';
    els.reason.textContent = diffName(g.diff) + (g.daily ? ' · ' + P.daily : '');
    els.big.textContent = clock(ms);
    els.resMistakes.textContent = String(g.mistakes);
    els.resHints.textContent = String(g.hints);
    els.newBest.hidden = true;
    var prev = getBest(g.diff);
    if (g.hints === 0 && (!prev || ms < prev)) {
      setBest(g.diff, ms);
      els.newBest.hidden = !prev;   // 첫 기록은 "새 최고 기록!" 이라 하지 않는다
      prev = ms;
    }
    els.resBest.textContent = prev ? fmt(R.best, { t: clock(prev) }) : '';
    els.resBest.hidden = !prev;
    submitScore(ms / 1000, myRun);
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
  }

  // ---------------------------------------------------------------- 시작 · 이어 하기
  function begin(g, ms) {
    runId++;
    clearTimeout(endTimer);
    clearInterval(tickTimer);
    game = g;
    doneSent = false;
    paused = false;
    running = false;
    baseMs = ms || 0;
    sel = -1;
    notesMode = false;
    undoStack = [];
    els.pause.hidden = true;
    els.board.classList.remove('is-solved');
    els.level.textContent = (g.daily ? '📅 ' : '') + diffName(g.diff);
    phase = 'play';
    show('play');
    buildBoard();
    var first = g.values.indexOf(0);
    sel = first >= 0 ? first : 40;
    renderAll();
    drawTime();
    startClock();
    saveGame();
  }
  function newGame(daily) {
    var date = daily ? C.utcDate() : '';
    var p = C.generate(diff, daily ? C.dailySeed(date, diff) : null);
    begin({
      diff: p.diff, daily: !!daily, date: date, seed: p.seed,
      puzzle: p.puzzle, solution: p.solution, values: p.puzzle.slice(),
      notes: p.puzzle.map(function () { return 0; }), locked: p.puzzle.map(function (x) { return !!x; }),
      mistakes: 0, hints: 0, check: !!(game && game.check), submitted: false
    }, 0);
    track('start');
  }
  els.startBtn.addEventListener('click', function () { newGame(false); });
  els.dailyBtn.addEventListener('click', function () { newGame(true); });
  els.resumeBtn.addEventListener('click', function () {
    var s = loadSave();
    if (!s) { drawResume(); return; }
    selectDiff(s.diff);
    begin(s, s.ms);
  });
  window.addEventListener('resize', sizeBoard);
  if (window.ResizeObserver) new ResizeObserver(sizeBoard).observe(els.play);
  setInterval(function () { if (phase === 'play' && !paused) saveGame(); }, 5000);

  // 숫자 패드 버튼을 모아 둔다
  keys = Array.prototype.slice.call(els.pad.querySelectorAll('.sd-key'));
  selectDiff(loadDiff());
  drawResume();

  if (window.setShareData) {
    window.setShareData(function () {
      var done = phase === 'end' && game;
      return {
        title: R.shareTitle,
        text: done ? fmt(game.daily ? R.shareDaily : R.shareText, { time: clock(elapsed()), diff: diffName(game.diff) }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: function () { show('start'); drawResume(); phase = 'start'; } });

  window.SUDOKU_APP = {
    phase: function () { return phase; },
    game: function () { return game; },
    elapsed: elapsed,
    diff: function () { return diff; },
    // 검사용: 마지막 한 칸만 남기고 정답을 채운다(그 칸은 sel 로 고른다)
    fillAllButOne: function () {
      if (phase !== 'play') return -1;
      var last = -1;
      for (var i = 0; i < 81; i++) if (!game.puzzle[i]) { game.values[i] = game.solution[i]; last = i; }
      if (last >= 0) { game.values[last] = 0; sel = last; renderAll(); }
      return last;
    }
  };
}());
