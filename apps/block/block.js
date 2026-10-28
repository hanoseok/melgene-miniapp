/* apps/block/block.js — 시작(티징) → 블록 퍼즐(8×8 DOM 판 + 조각 3개) → 끝 화면(점수 카드 + 공통 끝 화면)
 * 게임 규칙·점수는 block-core.js(BLOCK_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 게임 화면에는 광고가 없다. 끝 화면 광고·공유·FAQ·다시 하기는 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작(또는 다시 하기)을 누를 때 track('start') 한 번, 끝 화면에 닿을 때 track('done') 한 번.
 * 숫자 원칙: 상위 %는 supa.submitScore 가 돌려준 실제 분포로만. 서버가 없거나 실패하거나 비교할 다른 기록이 없으면 통째로 숨긴다.
 * 입력:
 *   - 끌어 놓기(pointer events): 아래 조각을 누르고 움직이면 판 칸 크기의 조각이 손가락 위로 떠서 따라온다(터치는 손가락보다 위, 마우스는 가운데).
 *     놓을 수 있는 자리면 판에 미리보기 + 지워질 줄 반짝임, 손을 떼면 놓는다. 안 되는 자리면 조각은 제자리로.
 *   - 눌러서 고르고 눌러서 놓기: 조각을 탭하면 골라지고, 판의 칸을 탭하면 그 칸을 덮는 자리에 놓는다(가운데 우선).
 *   - 키보드: 1·2·3 조각 고르기, 화살표로 옮기기, Enter/Space 놓기, Esc 취소. 판(#board)에 포커스.
 * 탭을 떠나면(visibilitychange·pagehide) 끌던 조각을 제자리로 돌린다(시간 제한이 없는 게임이라 멈출 것은 없음).
 * prefers-reduced-motion 이면 놓기·줄 지우기·점수 떠오름 애니메이션을 끄고 끝 화면도 빨리.
 * 디버그/검사용 핸들: window.BLOCK_APP (phase(), state(), place(slot, r, c), botStep(), autoplay(n), select(slot), best())
 */
(function () {
  'use strict';

  var C = window.BLOCK_CORE;
  var N = C.N;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var BEST_KEY = 'block_best_v1';
  var END_DELAY = REDUCED ? 500 : 1300;
  var CLEAR_MS = REDUCED ? 0 : 340;
  var LANG = document.documentElement.lang || 'en';
  var NF = (function () { try { return new Intl.NumberFormat(LANG); } catch (e) { return null; } })();

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'), startBtn: $('start-btn'),
    score: $('hud-score'), best: $('hud-best'), combo: $('hud-combo'),
    board: $('board'), pops: $('pops'), over: $('over-overlay'), hint: $('play-hint'), tray: $('tray'),
    resScore: $('res-score'), newBest: $('res-newbest'), bestLine: $('res-best'),
    lines: $('res-lines'), resCombo: $('res-combo'), rank: $('res-rank'), comparing: $('res-comparing'),
    rankBody: $('res-rank-body'), top: $('res-top'), beat: $('res-beat'), others: $('res-others'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();
  var slots = [].slice.call(els.tray.querySelectorAll('.blk-slot'));

  var phase = 'start';      // start | play | over | end
  var s = null;
  var runId = 0, doneSent = false, endTimer = 0;
  var sel = -1;             // 고른 조각(탭·키보드)
  var kbd = false;          // 키보드로 고르는 중이면 판에 커서 미리보기
  var cursor = { r: 0, c: 0 };
  var drag = null;          // { slot, id, x0, y0, active, ghost, touch, anchor }
  var justDragged = 0;
  var clearing = null;      // { map: { idx: color }, timer }
  var fresh = null;         // 방금 놓은 칸 { idx: 1 }
  var hintKey = 'hint';

  // 판 칸 만들기
  var cells = [];
  (function () {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < N * N; i++) {
      var d = document.createElement('div');
      d.className = 'blk-cell';
      frag.appendChild(d);
      cells.push(d);
    }
    els.board.appendChild(frag);
  })();

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function num(n) { return NF ? NF.format(n) : String(n); }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 최고 기록 (이 브라우저)
  function getBest() {
    try { var v = Number(localStorage.getItem(BEST_KEY)); return isFinite(v) && v > 0 ? Math.floor(v) : 0; } catch (e) { return 0; }
  }
  function setBest(v) { try { localStorage.setItem(BEST_KEY, String(v)); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 판 위치(화면 px)
  function metrics() {
    var a = cells[0].getBoundingClientRect(), b = cells[1].getBoundingClientRect(), z = cells[N].getBoundingClientRect();
    return { x: a.left, y: a.top, size: a.width, pitch: b.left - a.left || a.width, pitchY: z.top - a.top || a.height };
  }
  function cellAt(x, y) {
    var m = metrics();
    var c = Math.floor((x - m.x + (m.pitch - m.size) / 2) / m.pitch);
    var r = Math.floor((y - m.y + (m.pitchY - m.size) / 2) / m.pitchY);
    return r >= 0 && r < N && c >= 0 && c < N ? { r: r, c: c } : null;
  }

  // ---------------------------------------------------------------- 그리기
  function preview() {
    // 지금 보여 줄 미리보기: 끌기 중 놓을 수 있는 자리, 또는 키보드 커서
    if (!s || phase !== 'play') return null;
    if (drag && drag.active) return drag.anchor ? { piece: s.hand[drag.slot], r: drag.anchor.r, c: drag.anchor.c, ok: true } : null;
    if (sel >= 0 && kbd && s.hand[sel]) {
      var p = s.hand[sel];
      return { piece: p, r: cursor.r, c: cursor.c, ok: C.canPlace(s.board, p, cursor.r, cursor.c) };
    }
    return null;
  }
  function renderBoard() {
    if (!s) return;
    var pv = preview(), pvSet = {}, lineSet = {};
    if (pv) {
      pv.piece.cells.forEach(function (q) { pvSet[(pv.r + q[0]) * N + pv.c + q[1]] = 1; });
      if (pv.ok) {
        var L = C.previewLines(s.board, pv.piece, pv.r, pv.c);
        if (L) {
          L.rows.forEach(function (r) { for (var c = 0; c < N; c++) lineSet[r * N + c] = 1; });
          L.cols.forEach(function (c) { for (var r = 0; r < N; r++) lineSet[r * N + c] = 1; });
        }
      }
    }
    for (var i = 0; i < cells.length; i++) {
      var cls = 'blk-cell';
      var col = s.board[i];
      if (clearing && clearing.map[i]) cls += ' c' + clearing.map[i] + ' clr';
      else if (col) cls += ' c' + col + (fresh && fresh[i] ? ' new' : '') + (lineSet[i] ? ' pl' : '');
      if (pvSet[i]) cls += ' pv c' + pv.piece.color + (pv.ok ? '' : ' bad') + (lineSet[i] ? ' pl' : '');
      else if (!col && lineSet[i]) cls += ' pl';
      if (cells[i].className !== cls) cells[i].className = cls;
    }
    els.board.classList.toggle('kbd', !!(sel >= 0 && kbd));
  }

  function miniHtml(p) {
    var grid = [];
    for (var r = 0; r < p.h; r++) for (var c = 0; c < p.w; c++) grid.push('<i></i>');
    p.cells.forEach(function (q) { grid[q[0] * p.w + q[1]] = '<i class="on c' + p.color + '"></i>'; });
    return '<span class="blk-mini" style="grid-template-columns:repeat(' + p.w + ',var(--mc));grid-template-rows:repeat(' + p.h + ',var(--mc))">' + grid.join('') + '</span>';
  }
  function renderTray() {
    if (!s) return;
    slots.forEach(function (b, i) {
      var p = s.hand[i];
      var key = p ? p.id : '';
      if (b.getAttribute('data-piece') !== key) { b.setAttribute('data-piece', key); b.innerHTML = p ? miniHtml(p) : ''; }
      var fit = p && C.fits(s.board, p);
      b.disabled = !p || phase !== 'play';
      b.classList.toggle('empty', !p);
      b.classList.toggle('nofit', !!p && !fit);
      b.classList.toggle('sel', i === sel);
      b.classList.toggle('dragging', !!(drag && drag.active && drag.slot === i));
      b.setAttribute('aria-label', p ? fmt(fit ? P.pieceAria : P.pieceNoFit, { n: i + 1 }) : '');
      b.setAttribute('aria-pressed', i === sel ? 'true' : 'false');
    });
  }
  function renderHud() {
    if (!s) return;
    els.score.textContent = num(s.score);
    els.combo.textContent = s.combo > 0 ? fmt(P.comboValue, { n: s.combo }) : '–';
    els.combo.parentNode.classList.toggle('on', s.combo > 1);
  }
  function setHint(key) {
    hintKey = key;
    var t = P[key] || P.hint;
    if (els.hint.textContent !== t) els.hint.textContent = t;
  }
  function render() { renderBoard(); renderTray(); renderHud(); }

  function pop(text, r, c, cls) {
    var d = document.createElement('div');
    d.className = 'blk-pop' + (cls ? ' ' + cls : '') + (REDUCED ? ' still' : '');
    d.textContent = text;
    d.style.left = ((c + 0.5) / N * 100).toFixed(2) + '%';
    d.style.top = ((r + 0.5) / N * 100).toFixed(2) + '%';
    els.pops.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, REDUCED ? 700 : 950);
    while (els.pops.children.length > 6) els.pops.removeChild(els.pops.firstChild);
  }

  // ---------------------------------------------------------------- 놓기
  function commit(slot, r, c) {
    if (phase !== 'play' || !s) return null;
    var before = s.board.slice();
    var piece = s.hand[slot];
    var res = C.place(s, slot, r, c);
    if (!res) return null;
    // 지워지는 칸은 잠깐 원래 색으로 반짝인 뒤 사라진다
    if (clearing && clearing.timer) clearTimeout(clearing.timer);
    clearing = null;
    if (res.cleared.length && CLEAR_MS) {
      var map = {};
      res.cleared.forEach(function (i) { map[i] = res.cells.indexOf(i) >= 0 ? piece.color : before[i]; });
      clearing = { map: map, timer: setTimeout(function () { clearing = null; renderBoard(); }, CLEAR_MS) };
    }
    fresh = {};
    if (!REDUCED) res.cells.forEach(function (i) { if (res.cleared.indexOf(i) < 0) fresh[i] = 1; });
    // 점수 떠오름
    var pr = r + (piece.h - 1) / 2, pc = c + (piece.w - 1) / 2;
    pop('+' + num(res.gained), pr, pc, res.k ? 'big' : '');
    if (res.mult >= 2) pop(P.combo + ' ' + fmt(P.comboValue, { n: res.mult }), Math.max(0, pr - 1.2), Math.min(N - 2, Math.max(1, pc)), 'combo');
    // 다음 고르기: 키보드면 남은 조각 중 첫 번째를 바로 고른다
    sel = -1;
    if (kbd) {
      for (var i = 0; i < 3; i++) if (s.hand[i]) { sel = i; break; }
      if (sel >= 0) cursor = clampCursor(s.hand[sel], cursor.r, cursor.c);
    }
    setHint(kbd && sel >= 0 ? 'hintSelected' : 'hint');
    render();
    if (res.over) gameOver();
    return res;
  }

  function gameOver() {
    phase = 'over';
    sel = -1;
    cancelDrag();
    setHint('noRoom');
    render();
    els.over.hidden = false;
    var myRun = runId;
    clearTimeout(endTimer);
    endTimer = setTimeout(function () { if (myRun === runId) finish(); }, END_DELAY);
  }

  function clampCursor(p, r, c) {
    return { r: Math.max(0, Math.min(N - p.h, r)), c: Math.max(0, Math.min(N - p.w, c)) };
  }
  // 고를 때 커서: 가운데에 가장 가까운 놓을 수 있는 자리(없으면 가운데)
  function startCursor(p) {
    var ps = C.positions(s.board, p);
    var cr = (N - p.h) / 2, cc = (N - p.w) / 2;
    if (!ps.length) return clampCursor(p, Math.round(cr), Math.round(cc));
    ps.sort(function (a, b) { return (Math.abs(a[0] - cr) + Math.abs(a[1] - cc)) - (Math.abs(b[0] - cr) + Math.abs(b[1] - cc)); });
    return { r: ps[0][0], c: ps[0][1] };
  }
  function select(slot, byKey) {
    if (phase !== 'play' || !s || !s.hand[slot]) return;
    kbd = !!byKey;
    if (sel === slot && !byKey) { sel = -1; setHint('hint'); render(); return; }
    sel = slot;
    cursor = startCursor(s.hand[slot]);
    setHint('hintSelected');
    render();
  }
  function deselect() { sel = -1; setHint('hint'); render(); }

  // 탭한 칸에 놓기: 조각 가운데를 그 칸에 → 안 되면 그 칸을 덮는 다른 자리(가까운 것부터)
  function tapPlace(r, c) {
    var p = s.hand[sel];
    if (!p) return;
    var tries = [];
    var a = clampCursor(p, r - Math.floor((p.h - 1) / 2), c - Math.floor((p.w - 1) / 2));
    tries.push([a.r, a.c]);
    p.cells.forEach(function (q) { tries.push([r - q[0], c - q[1]]); });
    tries.sort(function (x, y) { return (Math.abs(x[0] - a.r) + Math.abs(x[1] - a.c)) - (Math.abs(y[0] - a.r) + Math.abs(y[1] - a.c)); });
    for (var i = 0; i < tries.length; i++) {
      if (C.canPlace(s.board, p, tries[i][0], tries[i][1])) { commit(sel, tries[i][0], tries[i][1]); return; }
    }
    setHint('hintNoFit');
    els.board.classList.remove('shake');
    if (!REDUCED) { void els.board.offsetWidth; els.board.classList.add('shake'); }
  }

  // ---------------------------------------------------------------- 끌어 놓기
  function makeGhost(p, m) {
    var g = document.createElement('div');
    g.className = 'blk-ghost';
    g.style.width = ((p.w - 1) * m.pitch + m.size) + 'px';
    g.style.height = ((p.h - 1) * m.pitchY + m.size) + 'px';
    p.cells.forEach(function (q) {
      var i = document.createElement('i');
      i.className = 'c' + p.color;
      i.style.left = (q[1] * m.pitch) + 'px';
      i.style.top = (q[0] * m.pitchY) + 'px';
      i.style.width = i.style.height = m.size + 'px';
      g.appendChild(i);
    });
    document.body.appendChild(g);
    return g;
  }
  function moveDrag(x, y) {
    var p = s.hand[drag.slot];
    var m = drag.m;
    var pw = (p.w - 1) * m.pitch + m.size, ph = (p.h - 1) * m.pitchY + m.size;
    var gx = x - pw / 2;
    var gy = drag.touch ? y - ph - Math.max(28, m.size * 1.1) : y - ph / 2;
    drag.ghost.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
    var r = Math.round((gy - m.y) / m.pitchY), c = Math.round((gx - m.x) / m.pitch);
    var anchor = C.canPlace(s.board, p, r, c) ? { r: r, c: c } : null;
    var prev = drag.anchor;
    if ((prev && anchor && prev.r === anchor.r && prev.c === anchor.c) || (!prev && !anchor)) return;
    drag.anchor = anchor;
    drag.ghost.classList.toggle('ok', !!anchor);
    renderBoard();
  }
  function endDrag(drop) {
    if (!drag) return;
    var d = drag;
    drag = null;
    if (d.ghost && d.ghost.parentNode) d.ghost.parentNode.removeChild(d.ghost);
    if (d.active) justDragged = Date.now();
    if (d.active && drop && d.anchor && phase === 'play') { commit(d.slot, d.anchor.r, d.anchor.c); return; }
    render();
  }
  function cancelDrag() { if (drag) endDrag(false); }

  slots.forEach(function (b) {
    var slot = Number(b.getAttribute('data-slot'));
    b.addEventListener('pointerdown', function (e) {
      justDragged = 0; // 새로 누름 = 지난 끌기 뒤에 오는 click 무시는 끝
      if (phase !== 'play' || !s || !s.hand[slot] || drag) return;
      if (e.button != null && e.button > 0) return;
      e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      drag = { slot: slot, id: e.pointerId, x0: e.clientX, y0: e.clientY, active: false, ghost: null, anchor: null, touch: e.pointerType === 'touch' || e.pointerType === 'pen' };
    });
    b.addEventListener('pointermove', function (e) {
      if (!drag || drag.id !== e.pointerId) return;
      if (!drag.active) {
        if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) < 6) return;
        drag.active = true;
        drag.m = metrics();
        drag.ghost = makeGhost(s.hand[drag.slot], drag.m);
        sel = -1; kbd = false;
        setHint('hint');
        renderTray();
      }
      e.preventDefault();
      moveDrag(e.clientX, e.clientY);
    });
    b.addEventListener('pointerup', function (e) { if (drag && drag.id === e.pointerId) { if (drag.active) e.preventDefault(); endDrag(true); } });
    b.addEventListener('pointercancel', function (e) { if (drag && drag.id === e.pointerId) endDrag(false); });
    b.addEventListener('lostpointercapture', function (e) { if (drag && drag.id === e.pointerId && drag.active) endDrag(true); });
    b.addEventListener('click', function (e) {
      if (Date.now() - justDragged < 450) { e.preventDefault(); return; }
      select(slot, e.detail === 0);
      if (e.detail === 0) { try { els.board.focus({ preventScroll: true }); } catch (err) { /* noop */ } }
    });
    b.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });

  els.board.addEventListener('click', function (e) {
    if (phase !== 'play' || !s) return;
    var at = cellAt(e.clientX, e.clientY);
    if (!at) return;
    if (sel < 0) { setHint('hint'); return; }
    kbd = false;
    tapPlace(at.r, at.c);
  });
  els.board.addEventListener('animationend', function () { els.board.classList.remove('shake'); });

  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || phase !== 'play' || e.altKey || e.ctrlKey || e.metaKey) return;
    var k = e.key;
    if (k === '1' || k === '2' || k === '3') {
      var i = Number(k) - 1;
      if (s.hand[i]) { select(i, true); try { els.board.focus({ preventScroll: true }); } catch (err) { /* noop */ } }
      e.preventDefault();
      return;
    }
    if (document.activeElement !== els.board) return;
    if (k === 'Escape') { deselect(); e.preventDefault(); return; }
    var dr = k === 'ArrowUp' ? -1 : k === 'ArrowDown' ? 1 : 0;
    var dc = k === 'ArrowLeft' ? -1 : k === 'ArrowRight' ? 1 : 0;
    if (dr || dc || k === 'Enter' || k === ' ' || k === 'Spacebar') e.preventDefault();
    if (sel < 0 || !kbd) {
      if (!(dr || dc || k === 'Enter' || k === ' ')) return;
      for (var j = 0; j < 3; j++) if (s.hand[j]) { select(j, true); break; }
      return;
    }
    var p = s.hand[sel];
    if (dr || dc) { cursor = clampCursor(p, cursor.r + dr, cursor.c + dc); setHint('hintSelected'); renderBoard(); return; }
    if (k === 'Enter' || k === ' ' || k === 'Spacebar') {
      if (C.canPlace(s.board, p, cursor.r, cursor.c)) commit(sel, cursor.r, cursor.c);
      else setHint('hintNoFit');
    }
  });

  document.addEventListener('visibilitychange', function () { if (document.hidden) cancelDrag(); });
  window.addEventListener('pagehide', cancelDrag);
  window.addEventListener('resize', cancelDrag);
  window.addEventListener('blur', cancelDrag);

  // ---------------------------------------------------------------- 시작 · 끝
  function start() {
    runId++;
    clearTimeout(endTimer);
    cancelDrag();
    if (clearing && clearing.timer) clearTimeout(clearing.timer);
    clearing = null; fresh = null;
    s = C.newGame();
    sel = -1; kbd = false; cursor = { r: 0, c: 0 };
    doneSent = false;
    phase = 'play';
    els.over.hidden = true;
    els.pops.innerHTML = '';
    els.best.textContent = num(getBest());
    setHint('hint');
    show('play');
    render();
    track('start');
  }

  function finish() {
    if (phase === 'end' || !s) return;
    phase = 'end';
    cancelDrag();
    var myRun = runId;
    var prev = getBest();
    var isNew = s.score > prev;
    if (isNew) setBest(s.score);
    els.resScore.textContent = num(s.score);
    els.newBest.hidden = !isNew;
    els.bestLine.textContent = fmt(R.best, { n: num(Math.max(prev, s.score)) });
    els.bestLine.hidden = isNew;
    els.lines.textContent = num(s.lines);
    els.resCombo.textContent = s.bestCombo > 0 ? fmt(R.comboValue, { n: s.bestCombo }) : '0';
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    submitScore(s, myRun);
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

  // 한 판에 한 번 점수를 보내고, 돌아온 실제 분포로 상위 %를 계산한다. 서버 없음·실패·다른 기록 없음 → 통째로 숨김.
  function submitScore(st, myRun) {
    var supa = window.supa;
    els.rank.hidden = true;
    els.rankBody.hidden = true;
    if (!supa || !supa.enabled || !supa.enabled() || st.submitted) return;
    st.submitted = true;
    els.rank.hidden = false;
    els.comparing.hidden = false;
    var b = C.bucket(st.score);
    withTimeout(supa.submitScore(C.GAME, b), 8000).then(function (rows) {
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

  els.startBtn.addEventListener('click', start);

  if (window.setShareData) {
    window.setShareData(function () {
      var done = s && (phase === 'over' || phase === 'end');
      return {
        title: R.shareTitle,
        text: done ? fmt(R.shareText, { n: num(s.score) }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  function summary(res) {
    return res ? { k: res.k, gained: res.gained, mult: res.mult, cleared: res.cleared.length, over: res.over, dealt: res.dealt } : null;
  }
  window.BLOCK_APP = {
    phase: function () { return phase; },
    state: function () {
      if (!s) return null;
      return { seed: s.seed, score: s.score, lines: s.lines, combo: s.combo, bestCombo: s.bestCombo, placed: s.placed, over: s.over,
        hand: s.hand.map(function (p) { return p ? p.id : null; }), board: s.board.slice(), sel: sel, hint: hintKey };
    },
    place: function (slot, r, c) { return summary(commit(slot, r, c)); },
    botStep: function () { if (phase !== 'play' || !s) return null; var b = C.bot(s); return b ? summary(commit(b.slot, b.r, b.c)) : null; },
    autoplay: function (n) { var k = 0; while (phase === 'play' && k < (n || 1e4)) { if (!this.botStep()) break; k++; } return k; },
    select: function (slot) { select(slot, false); return sel; },
    best: getBest
  };
  show('start');
})();
