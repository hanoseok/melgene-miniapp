/**
 * 새해 목표 빙고 — 화면 동작 (시작 → 편집 → 완성 카드).
 * 로직은 bingo-core.js(BINGO_CORE), 문구는 PAGE_I18N(언어별). 사용자 글은 textContent·캔버스로만 그린다(innerHTML 금지).
 * 기록: 편집 화면에 처음 들어갈 때 track('start') 한 번 → 그 판이 완성 카드에 닿을 때 track('done') 한 번.
 *       다시 하기(setRetry) = 새 판(크기·색은 그대로). 공유 링크로 받은 판을 보기만 하면 세지 않는다.
 * 저장: localStorage 'mg_bingo_v1' = { b: 판, p: 'edit' | 'done' } (try/catch). 판 링크 = #d=<UTF-8 base64url JSON>(서버 없음).
 *       서버로는 아무것도 보내지 않는다. 공통 끝 화면 공유는 깨끗한 주소(mgCleanUrl, 목표 글 없음).
 */
(function () {
  'use strict';
  var CORE = window.BINGO_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var LANG = I.lang || 'en';
  var IDEAS = I.ideas || [];
  var STORE_KEY = 'mg_bingo_v1';
  var EMOJI = "'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji'";
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NO_SPACE = /[\u0E00-\u0E7F\u3040-\u30ff\u3400-\u9fff\uac00-\ud7a3]/;
  var W = 1080, H = 1350, GX = 60, GY = 300, GS = 960, GAP = 10;

  function $(id) { return document.getElementById(id); }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? String(vars[k]) : m; }); }
  function track(ev) { try { if (window.track) window.track(ev, {}); } catch (e) { /* noop */ } }
  function storeGet() { try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function storeSet(v) { try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* noop */ } }
  function plural(forms, n) {
    var k = 'other';
    try { k = new Intl.PluralRules(LANG).select(n); } catch (e) { /* noop */ }
    return fmt(forms[k] || forms.other, { n: n });
  }

  var els = {
    start: $('screen-start'), edit: $('screen-edit'), done: $('screen-done'),
    sizeStart: $('size-start'), sizeEdit: $('size-edit'), startBtn: $('start-btn'), contBtn: $('continue-btn'), linkErr: $('link-err'),
    title: $('title-input'), freeWrap: $('free-wrap'), free: $('free-toggle'), themes: $('themes'), grid: $('grid'),
    cellLabel: $('cell-label'), cell: $('cell-input'), next: $('next-btn'), filled: $('filled'),
    ideas: $('ideas-btn'), shuffle: $('shuffle-btn'), clear: $('clear-btn'), doneBtn: $('done-btn'), editErr: $('edit-err'),
    sharedNote: $('shared-note'), doneH: $('done-h'), canvas: $('board-canvas'), tapHint: $('tap-hint'),
    lines: $('score-lines'), goals: $('score-goals'), download: $('download-btn'), link: $('link-btn'), editBtn: $('edit-btn'), live: $('live'),
  };

  var board = null;
  var phase = 'start';
  var sizePick = 5;
  var sel = 0;
  var started = false, doneRound = false, shared = false;

  function defaultTitle() { return fmt(U.defaultTitle, { year: CORE.defaultYear() }); }
  function theme() { return CORE.THEMES[board.h] || CORE.THEMES[0]; }
  function freeIdx() { return CORE.freeIndex(board.s, board.f); }

  function save() {
    if (shared || !board) return;
    var w = CORE.toWire(board);
    if (w) storeSet(JSON.stringify({ b: w, p: phase === 'done' ? 'done' : 'edit' }));
  }
  function loadSaved() {
    var raw = storeGet();
    if (!raw) return null;
    try { var o = JSON.parse(raw); var b = CORE.sanitize(o && o.b); return b ? { b: b, p: o.p === 'done' ? 'done' : 'edit' } : null; } catch (e) { return null; }
  }

  function show(which) {
    phase = which;
    els.start.hidden = which !== 'start';
    els.edit.hidden = which !== 'edit';
    els.done.hidden = which !== 'done';
    try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
  }

  // ---------------------------------------------------------------- 편집 화면
  function pressSize(seg, s) {
    Array.prototype.forEach.call(seg.querySelectorAll('[data-size]'), function (b) { b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-size')) === s)); });
  }
  function applyThemeVars(el) {
    var t = theme();
    el.style.setProperty('--cell', t.cell);
    el.style.setProperty('--cell2', t.cell2);
    el.style.setProperty('--cell-ink', t.ink);
    el.style.setProperty('--cell-accent', t.accent);
    el.style.setProperty('--cell-bg', t.card);
  }
  function drawThemes() {
    els.themes.textContent = '';
    CORE.THEMES.forEach(function (t, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bg-theme';
      b.setAttribute('aria-pressed', String(i === board.h));
      var sw = document.createElement('span');
      sw.className = 'bg-swatch';
      sw.setAttribute('aria-hidden', 'true');
      sw.style.background = 'linear-gradient(135deg, ' + t.bg + ' 0 50%, ' + t.accent + ' 50% 100%)';
      var nm = document.createElement('span');
      nm.className = 'bg-theme-n';
      nm.textContent = (I.themes || {})[t.id] || t.id;
      b.appendChild(sw); b.appendChild(nm);
      b.addEventListener('click', function () { board.h = i; drawThemes(); drawGrid(); save(); });
      els.themes.appendChild(b);
    });
  }
  function cellNo(i) {
    var fi = freeIdx();
    return fi >= 0 && i > fi ? i : i + 1;
  }
  function drawGrid() {
    var s = board.s, fi = freeIdx();
    els.grid.textContent = '';
    els.grid.style.setProperty('--n', String(s));
    els.grid.className = 'bg-grid bg-grid-' + s;
    applyThemeVars(els.grid);
    for (var i = 0; i < s * s; i++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bg-gcell' + ((Math.floor(i / s) + i % s) % 2 ? ' alt' : '');
      b.setAttribute('data-i', String(i));
      if (i === fi) {
        b.className += ' free';
        b.textContent = U.free;
        b.setAttribute('aria-disabled', 'true');
      } else {
        var txt = String(board.c[i] || '').trim();
        if (txt) b.textContent = txt;
        else { var n = document.createElement('span'); n.className = 'bg-num'; n.textContent = String(cellNo(i)); b.appendChild(n); }
        b.setAttribute('aria-label', fmt(U.cellLabel, { n: cellNo(i) }) + (txt ? ': ' + txt : ''));
        b.setAttribute('aria-pressed', String(i === sel));
        if (i === sel) b.className += ' sel';
      }
      els.grid.appendChild(b);
    }
    drawFilled();
  }
  function drawFilled() {
    var f = CORE.filledCount(board);
    els.filled.textContent = fmt(U.filled, { n: f.n, total: f.total });
  }
  function select(i, focus) {
    var fi = freeIdx();
    if (i === fi) i = (i + 1) % (board.s * board.s);
    sel = i;
    els.cellLabel.textContent = fmt(U.cellLabel, { n: cellNo(i) });
    els.cell.value = board.c[i] || '';
    Array.prototype.forEach.call(els.grid.children, function (b) {
      var on = Number(b.getAttribute('data-i')) === i;
      b.classList.toggle('sel', on);
      if (!b.classList.contains('free')) b.setAttribute('aria-pressed', String(on));
    });
    if (focus) { try { els.cell.focus({ preventScroll: true }); } catch (e) { els.cell.focus(); } }
  }
  function firstEmpty() {
    var fi = freeIdx();
    for (var i = 0; i < board.s * board.s; i++) if (i !== fi && !String(board.c[i] || '').trim()) return i;
    return fi === 0 ? 1 : 0;
  }
  function updateCellButton(i) {
    var b = els.grid.querySelector('[data-i="' + i + '"]');
    if (!b) return;
    var txt = String(board.c[i] || '').trim();
    b.textContent = '';
    if (txt) b.textContent = txt;
    else { var n = document.createElement('span'); n.className = 'bg-num'; n.textContent = String(cellNo(i)); b.appendChild(n); }
    b.setAttribute('aria-label', fmt(U.cellLabel, { n: cellNo(i) }) + (txt ? ': ' + txt : ''));
  }
  function drawEditor() {
    els.title.value = board.t;
    pressSize(els.sizeEdit, board.s);
    els.freeWrap.hidden = board.s % 2 === 0;
    els.free.checked = !!board.f;
    els.editErr.hidden = true;
    drawThemes();
    drawGrid();
    select(firstEmpty(), false);
  }
  function enterEditor() {
    shared = false;
    els.sharedNote.hidden = true;
    show('edit');
    if (!started) { started = true; track('start'); }
    drawEditor();
    save();
  }
  function cleanBoard() {
    board.t = CORE.cleanText(board.t, CORE.LIMIT.title) || defaultTitle();
    var fi = freeIdx();
    board.c = board.c.map(function (x, i) { return i === fi ? '' : CORE.cleanText(x, CORE.LIMIT.cell); });
  }

  els.grid.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-i]') : null;
    if (!b || b.classList.contains('free')) return;
    select(Number(b.getAttribute('data-i')), true);
  });
  els.cell.addEventListener('input', function () {
    board.c[sel] = els.cell.value.slice(0, CORE.LIMIT.cell * 2);
    board.m = 0;
    updateCellButton(sel);
    drawFilled();
    els.editErr.hidden = true;
    save();
  });
  function nextCell() {
    var n = board.s * board.s, fi = freeIdx(), i = sel;
    do { i = (i + 1) % n; } while (i === fi);
    select(i, true);
  }
  els.next.addEventListener('click', nextCell);
  els.cell.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); nextCell(); } });
  els.title.addEventListener('input', function () { board.t = els.title.value.slice(0, CORE.LIMIT.title); save(); });
  els.sizeEdit.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-size]') : null;
    if (!b) return;
    board = CORE.resize(board, Number(b.getAttribute('data-size')));
    sizePick = board.s;
    drawEditor(); save();
  });
  els.free.addEventListener('change', function () { CORE.setFree(board, els.free.checked); drawGrid(); select(firstEmpty(), false); save(); });
  els.ideas.addEventListener('click', function () { CORE.fillIdeas(board, IDEAS); drawGrid(); select(sel, false); els.editErr.hidden = true; save(); });
  els.shuffle.addEventListener('click', function () { CORE.shuffle(board); drawGrid(); select(sel, false); save(); });
  els.clear.addEventListener('click', function () {
    board.c = board.c.map(function () { return ''; }); board.m = 0;
    drawGrid(); select(firstEmpty(), false); save();
  });
  els.doneBtn.addEventListener('click', function () {
    cleanBoard();
    var f = CORE.filledCount(board);
    if (f.n < f.total) {
      els.editErr.textContent = U.needAll; els.editErr.hidden = false;
      drawGrid(); select(firstEmpty(), true);
      return;
    }
    showDone();
  });

  // ---------------------------------------------------------------- 완성 카드 (canvas)
  function fontsOf() {
    var d = window.getComputedStyle(els.doneH), b = window.getComputedStyle(document.body);
    return { display: d.fontFamily || 'sans-serif', dw: d.fontWeight || '700', sans: b.fontFamily || 'sans-serif' };
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function cellRect(i) {
    var s = board.s, cw = (GS - GAP * (s - 1)) / s;
    var r = Math.floor(i / s), c = i % s;
    return { x: GX + c * (cw + GAP), y: GY + r * (cw + GAP), w: cw };
  }
  function drawCard() {
    var cv = els.canvas, ctx = cv.getContext('2d');
    if (!ctx) return;
    var t = theme(), F = fontsOf(), s = board.s, fi = freeIdx(), sc = CORE.score(board);
    var measure = function (x) { return ctx.measureText(x).width; };
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, t.bg); g.addColorStop(1, t.bg2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // 장식 동그라미
    ctx.globalAlpha = 0.18; ctx.fillStyle = t.accent;
    ctx.beginPath(); ctx.arc(980, 90, 120, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(70, 1290, 90, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // 제목 (두 줄까지 들어가는 가장 큰 글자)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = t.ink;
    var size = 88, tl;
    for (; size > 36; size -= 4) {
      ctx.font = F.dw + ' ' + size + 'px ' + F.display + ', ' + EMOJI;
      tl = CORE.wrap(measure, board.t || defaultTitle(), 920, LANG);
      if (tl.length <= 2) break;
    }
    tl = tl.slice(0, 2);
    var lh = size * 1.18, ty = tl.length === 1 ? 150 : 150 - lh / 2;
    tl.forEach(function (ln, k) { ctx.fillText(ln, W / 2, ty + k * lh); });
    // 판
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.12)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    rr(ctx, GX - 22, GY - 22, GS + 44, GS + 44, 36); ctx.fillStyle = t.card; ctx.fill();
    ctx.restore();
    var cw = (GS - GAP * (s - 1)) / s;
    var base = { 3: 50, 4: 40, 5: 32 }[s];
    for (var j = 0; j < s * s; j++) {
      var Rb = cellRect(j);
      rr(ctx, Rb.x, Rb.y, Rb.w, Rb.w, 18);
      ctx.fillStyle = j === fi ? t.accent : ((Math.floor(j / s) + j % s) % 2 ? t.cell2 : t.cell);
      ctx.fill();
    }
    // 빙고 줄
    ctx.save();
    ctx.strokeStyle = t.line; ctx.globalAlpha = 0.45; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(10, cw * 0.1);
    sc.lines.forEach(function (ln) {
      var a = cellRect(ln[0]), b = cellRect(ln[ln.length - 1]);
      ctx.beginPath(); ctx.moveTo(a.x + a.w / 2, a.y + a.w / 2); ctx.lineTo(b.x + b.w / 2, b.y + b.w / 2); ctx.stroke();
    });
    ctx.restore();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (var i = 0; i < s * s; i++) {
      var R = cellRect(i);
      var cx = R.x + R.w / 2, cy = R.y + R.w / 2;
      if (i === fi) {
        ctx.fillStyle = t.id === 'night' ? '#1b1f3b' : '#ffffff';
        ctx.font = F.dw + ' ' + Math.round(base * 1.25) + 'px ' + F.display + ', ' + EMOJI;
        var fl = CORE.wrap(measure, '★ ' + U.free, R.w - 20, LANG).slice(0, 2);
        fl.forEach(function (ln, k) { ctx.fillText(ln, cx, cy + (k - (fl.length - 1) / 2) * base * 1.4); });
        continue;
      }
      var marked = CORE.isMarked(board, i);
      if (marked) {
        // 도장(뒤): 옅은 동그라미 + 테두리 — 글은 그 위에 그려서 읽힌다
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(-0.2);
        ctx.fillStyle = t.stamp; ctx.globalAlpha = 0.16;
        ctx.beginPath(); ctx.arc(0, 0, R.w * 0.42, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.9; ctx.strokeStyle = t.stamp; ctx.lineWidth = Math.max(4, R.w * 0.035);
        ctx.setLineDash([R.w * 0.09, R.w * 0.035]);
        ctx.beginPath(); ctx.arc(0, 0, R.w * 0.42, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      var txt = String(board.c[i] || '');
      var px = base, lines;
      for (; px >= 14; px -= 2) {
        ctx.font = '600 ' + px + 'px ' + F.sans + ', ' + EMOJI;
        lines = CORE.wrap(measure, txt, R.w - 26, LANG);
        // 띄어쓰기로 나뉘는 말은 낱말이 잘리지 않는 크기까지 줄인다
        var whole = NO_SPACE.test(txt) || txt.split(/\s+/).every(function (w) { return measure(w) <= R.w - 26; });
        if (whole && lines.length * px * 1.25 <= R.w - 26) break;
      }
      var lhc = px * 1.25, maxL = Math.max(1, Math.floor((R.w - 20) / lhc));
      if (lines.length > maxL) { lines = lines.slice(0, maxL); lines[maxL - 1] = lines[maxL - 1].replace(/.$/, '…'); }
      ctx.fillStyle = t.ink;
      lines.forEach(function (ln, k) { ctx.fillText(ln, cx, cy + (k - (lines.length - 1) / 2) * lhc); });
      if (marked) {
        // 도장(앞): 칸 오른쪽 위 작은 체크 배지
        var br = Math.max(14, R.w * 0.13), bx = R.x + R.w - br - 6, by = R.y + br + 6;
        ctx.save();
        ctx.fillStyle = t.accent;
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = t.id === 'night' ? '#1b1f3b' : '#ffffff'; ctx.lineWidth = Math.max(3, br * 0.28); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(bx - br * 0.45, by + br * 0.02); ctx.lineTo(bx - br * 0.1, by + br * 0.38); ctx.lineTo(bx + br * 0.48, by - br * 0.32); ctx.stroke();
        ctx.restore();
      }
    }
    // 아래 줄
    ctx.fillStyle = t.dim; ctx.textBaseline = 'middle';
    ctx.font = '600 30px ' + F.sans + ', ' + EMOJI;
    ctx.textAlign = 'left'; ctx.fillText(sc.count ? '🎯 ' + plural(U.lines, sc.count) : (I.brand || ''), GX - 10, 1312);
    ctx.textAlign = 'right'; ctx.fillText('melgene.com', GX + GS + 10, 1312);
    cv.setAttribute('aria-label', fmt(U.imageAlt, { title: board.t }) + ' · ' + fmt(U.goalsDone, { n: sc.marked, total: sc.goals }));
  }
  function drawScore() {
    var sc = CORE.score(board);
    els.lines.textContent = sc.full ? U.blackout : plural(U.lines, sc.count);
    els.goals.textContent = fmt(U.goalsDone, { n: sc.marked, total: sc.goals });
    return sc;
  }
  function whenFonts(fn) {
    var F = fontsOf();
    var sample = (board.t || '') + board.c.join('') + U.free;
    var jobs = [];
    if (document.fonts && document.fonts.load) {
      jobs.push(document.fonts.load(F.dw + ' 40px ' + F.display, sample).catch(function () {}));
      jobs.push(document.fonts.load('600 40px ' + F.sans, sample).catch(function () {}));
    }
    var timer = new Promise(function (r) { setTimeout(r, 1500); });
    Promise.race([Promise.all(jobs), timer]).then(fn, fn);
  }
  function showDone() {
    phase = 'done';
    show('done');
    els.tapHint.hidden = shared;
    els.editBtn.hidden = shared;
    els.link.hidden = shared;
    els.sharedNote.hidden = !shared;
    drawCard(); drawScore();
    whenFonts(drawCard);
    if (!shared) save();
    if (started && !doneRound) { doneRound = true; track('done'); }
  }
  function canvasIndex(ev) {
    var r = els.canvas.getBoundingClientRect();
    if (!r.width) return -1;
    var k = W / r.width, x = (ev.clientX - r.left) * k, y = (ev.clientY - r.top) * k;
    if (x < GX || y < GY || x > GX + GS || y > GY + GS) return -1;
    var s = board.s, cw = (GS - GAP * (s - 1)) / s;
    var c = Math.min(s - 1, Math.floor((x - GX) / (cw + GAP))), rw = Math.min(s - 1, Math.floor((y - GY) / (cw + GAP)));
    return rw * s + c;
  }
  function stamp(i) {
    if (shared || i < 0 || i === freeIdx()) return;
    var before = CORE.score(board).count;
    CORE.toggle(board, i);
    save();
    drawCard();
    var sc = drawScore();
    els.live.textContent = sc.count > before ? plural(U.lines, sc.count) : fmt(U.goalsDone, { n: sc.marked, total: sc.goals });
  }
  els.canvas.addEventListener('click', function (e) { stamp(canvasIndex(e)); });

  function baseUrl() {
    var base = window.location.href.split('#')[0].split('?')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  function copy(text, msg) {
    var done = function () { if (window.toast) window.toast(msg); };
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      } catch (e) { /* noop */ }
      done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(fallback);
    else fallback();
  }
  function linkUrl() { var d = CORE.encodeShare(board); return d ? baseUrl() + '#d=' + d : baseUrl(); }
  els.link.addEventListener('click', function () { copy(linkUrl(), U.linkCopied); });
  els.download.addEventListener('click', function () {
    var name = 'bingo-' + CORE.defaultYear() + '.png';
    function go(href, revoke) {
      var a = document.createElement('a');
      a.href = href; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      if (revoke) setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
      if (window.toast) window.toast(U.saved);
    }
    try {
      if (els.canvas.toBlob) els.canvas.toBlob(function (blob) { if (blob) go(URL.createObjectURL(blob), true); else go(els.canvas.toDataURL('image/png'), false); }, 'image/png');
      else go(els.canvas.toDataURL('image/png'), false);
    } catch (e) { /* noop */ }
  });
  els.editBtn.addEventListener('click', function () { phase = 'edit'; enterEditor(); });

  // ---------------------------------------------------------------- 시작 화면
  els.sizeStart.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('[data-size]') : null;
    if (!b) return;
    sizePick = Number(b.getAttribute('data-size'));
    pressSize(els.sizeStart, sizePick);
  });
  els.startBtn.addEventListener('click', function () {
    var h = board && !shared ? board.h : 0;
    board = CORE.defaultBoard(sizePick, defaultTitle());
    board.h = h;
    sel = 0;
    clearHash();
    enterEditor();
  });
  els.contBtn.addEventListener('click', function () {
    var saved = loadSaved();
    if (!saved) { els.contBtn.hidden = true; return; }
    board = saved.b; shared = false;
    if (saved.p === 'done' && CORE.filledCount(board).n === CORE.filledCount(board).total) showDone();
    else enterEditor();
  });
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }

  // 다시 하기: 새 판(크기·색은 그대로)
  function newBoard() {
    var s = board ? board.s : sizePick, h = board ? board.h : 0;
    clearHash();
    started = false; doneRound = false; shared = false;
    board = CORE.defaultBoard(s, defaultTitle());
    board.h = h; sel = 0;
    enterEditor();
  }

  // ---------------------------------------------------------------- 처음 열 때
  function init() {
    pressSize(els.sizeStart, sizePick);
    var h = window.location.hash;
    if (/^#d=/.test(h)) {
      var b = CORE.decodeShare(h.slice(3));
      if (b) { board = b; shared = true; showDone(); return; }
      els.linkErr.hidden = false;
    }
    var saved = loadSaved();
    els.contBtn.hidden = !saved;
    if (saved) { sizePick = saved.b.s; pressSize(els.sizeStart, sizePick); }
  }
  window.addEventListener('hashchange', function () {
    if (!/^#d=/.test(window.location.hash)) return;
    var b = CORE.decodeShare(window.location.hash.slice(3));
    if (b) { board = b; shared = true; showDone(); }
  });

  if (window.setShareData) window.setShareData(function () { return { title: U.shareTitle, text: U.shareText, url: baseUrl() }; });
  if (window.setRetry) window.setRetry({ label: U.again, action: newBoard });

  init();

  window.BINGO_APP = {
    board: function () { return board ? JSON.parse(JSON.stringify(board)) : null; },
    phase: function () { return phase; },
    score: function () { return board ? CORE.score(board) : null; },
    shared: function () { return shared; },
    cellCenter: function (i) {
      var R = cellRect(i), r = els.canvas.getBoundingClientRect(), k = r.width / W;
      return { x: r.left + (R.x + R.w / 2) * k, y: r.top + (R.y + R.w / 2) * k };
    },
  };
})();
