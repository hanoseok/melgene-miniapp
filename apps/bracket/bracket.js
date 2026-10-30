/* apps/bracket/bracket.js — 토너먼트 대진표: 시작 화면(제목·항목 2~64·시드·방식) → 대진 화면
 *   (한 판씩 고르기: 큰 맞대결 카드 두 장 → 누르면 승자 · 대진표만: 대진표에서 이름을 눌러 승자) → 우승 → 공통 끝 화면.
 * 로직은 bracket-core.js(BRACKET_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 사용자 글자는 모두 textContent 로만 넣는다(innerHTML 금지 — 비울 때만 '').
 * 기록: 대진표를 만들 때(만들기·다시 하기) track('start') 한 번, 우승자가 처음 정해질 때 track('done') 한 번(markDone).
 *       공유 링크(#d=)로 연 대진표는 세지 않는다.
 * 저장: 입력(mg_bracket_in_v1)과 진행 중 대진표(mg_bracket_v1: 상태·되돌리기 기록·done 셈 여부) — localStorage(try/catch). 서버로 보내지 않는다.
 * 내보내기: PNG(canvas, 페이지 글꼴 그대로) · 글로 복사 · 상태를 담은 링크(#d=).
 */
(function () {
  'use strict';

  var CORE = window.BRACKET_CORE;
  var I = window.PAGE_I18N || {};
  var LANG = I.lang || 'en';
  var U = I.ui || {};
  var E = I.errors || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_bracket_v1';
  var INPUT = 'mg_bracket_in_v1';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), play: $('screen-play'), form: $('bk-form'), title: $('title'), items: $('items'), count: $('items-count'), dupes: $('items-dupes'),
    seedR: $('seed-r'), seedO: $('seed-o'), modeP: $('mode-p'), modeD: $('mode-d'), error: $('error'), create: $('create-btn'),
    resume: $('resume'), resumeText: $('resume-text'), resumeBtn: $('resume-btn'),
    evTitle: $('ev-title'), evMeta: $('ev-meta'), duel: $('duel'), duelRound: $('duel-round'), duelProgress: $('duel-progress'),
    sideA: $('side-a'), sideB: $('side-b'), sideAName: $('side-a-name'), sideBName: $('side-b-name'),
    board: $('board'), boardHint: $('board-hint'), undo: $('undo-btn'), png: $('png-btn'), text: $('text-btn'), link: $('link-btn'), newB: $('new-btn'),
    live: $('live'), done: $('done'), champ: $('champ-name'), champSummary: $('champ-summary'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var cur = null;        // 지금 대진표 (CORE 상태)
  var hist = [];         // 되돌리기용: 고른 경기 번호 순서
  var doneTracked = false;
  var duelMatch = null;
  var busy = false;

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, key) { return vars[key] != null ? vars[key] : m; }); }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function focusSoft(x) { try { x.focus({ preventScroll: true }); } catch (e) { /* noop */ } }
  function scrollTo(x, block) { try { x.scrollIntoView({ block: block || 'start', behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { /* noop */ } }
  function toast(msg) { if (window.toast) window.toast(msg); }
  function roundName(info) {
    var key = info.key === 'final' ? 'rFinal' : info.key === 'semi' ? 'rSemi' : info.key === 'quarter' ? 'rQuarter' : 'rOf';
    return fmt(U[key], { n: info.n, h: info.h });
  }
  function titleOf(st) { return st.t || U.titleDefault; }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function saveInput() {
    try {
      window.localStorage.setItem(INPUT, JSON.stringify({ t: els.title.value.slice(0, CORE.MAX_TITLE), items: els.items.value.slice(0, 4000), s: els.seedO.checked ? 'o' : 'r', m: els.modeD.checked ? 'd' : 'p' }));
    } catch (e) { /* noop */ }
  }
  function loadInput() {
    try {
      var o = JSON.parse(window.localStorage.getItem(INPUT) || 'null');
      if (o && typeof o === 'object') {
        if (typeof o.t === 'string') els.title.value = o.t.slice(0, CORE.MAX_TITLE);
        if (typeof o.items === 'string') els.items.value = o.items.slice(0, 4000);
        els.seedO.checked = o.s === 'o'; els.seedR.checked = o.s !== 'o';
        els.modeD.checked = o.m === 'd'; els.modeP.checked = o.m !== 'd';
      }
    } catch (e) { /* noop */ }
  }
  function saveState() {
    try { if (cur) window.localStorage.setItem(STORE, JSON.stringify({ st: CORE.compact(cur), h: hist.slice(-200), dk: doneTracked })); } catch (e) { /* noop */ }
  }
  function loadState() {
    try {
      var o = JSON.parse(window.localStorage.getItem(STORE) || 'null');
      if (!o || typeof o !== 'object') return null;
      var st = CORE.sanitize(o.st);
      if (!st) return null;
      var h = Array.isArray(o.h) ? o.h.filter(function (x) { return typeof x === 'number' && x >= 0 && x < st.w.length; }) : [];
      return { st: st, h: h, dk: !!o.dk };
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------- 시작 화면
  function updateCount() {
    var p = CORE.parseItems(els.items.value);
    var n = p.items.length;
    els.count.textContent = n ? fmt(U.count, { n: n }) : '';
    els.count.classList.toggle('is-bad', n > CORE.MAX_ITEMS || n === 1);
    els.dupes.textContent = p.dupes ? fmt(U.dupes, { d: p.dupes }) : '';
    els.dupes.hidden = !p.dupes;
  }
  function clearError() { els.error.hidden = true; els.error.textContent = ''; }
  function showError(msg) { els.error.textContent = msg; els.error.hidden = false; scrollTo(els.error, 'center'); }
  function updateResume() {
    els.resume.hidden = !cur;
    if (cur) els.resumeText.textContent = fmt(U.resumeText, { title: titleOf(cur) });
  }

  // ---------------------------------------------------------------- 만들기
  function startBracket(st) {
    cur = st;
    hist = [];
    doneTracked = false;
    saveState();
    clearHash();
    track('start');
    showPlay();
    els.live.textContent = fmt(U.liveCreated, { n: cur.n.length });
    scrollTo(els.play, 'start');
  }
  function doCreate() {
    clearError();
    var v = CORE.validate({ items: els.items.value, title: els.title.value, seed: els.seedO.checked ? 'o' : 'r', mode: els.modeD.checked ? 'd' : 'p' });
    if (!v.ok) { showError(fmt(E[v.error] || E.tooFew, { n: v.n })); return; }
    saveInput();
    startBracket(CORE.create(v));
  }
  function retry() {
    // 같은 항목·제목·방식으로 다시 섞어 새 대진표
    if (!cur) { backToSetup(); return; }
    startBracket(CORE.create({ items: cur.n.slice(), title: cur.t, seed: 'r', mode: cur.m }));
  }
  function markDone() {
    if (doneTracked) return;
    doneTracked = true;
    track('done');
  }

  // ---------------------------------------------------------------- 대진 화면
  function showPlay() {
    els.setup.hidden = true;
    els.play.hidden = false;
    els.evTitle.textContent = titleOf(cur);
    var res = CORE.resolve(cur);
    els.evMeta.textContent = fmt(U.meta, { n: cur.n.length, m: res.real });
    render(false);
  }
  function render(justPicked) {
    var res = CORE.resolve(cur);
    renderDuel(res);
    renderBoard(res);
    els.undo.disabled = !hist.length;
    els.boardHint.hidden = res.champion >= 0;
    if (res.champion >= 0) {
      els.champ.textContent = cur.n[res.champion];
      els.champSummary.textContent = fmt(R.summary, { n: cur.n.length, m: res.real, title: titleOf(cur) });
      var wasHidden = els.done.hidden;
      els.done.hidden = false;
      if (justPicked && wasHidden) {
        markDone();
        saveState();
        els.live.textContent = fmt(U.liveChampion, { name: cur.n[res.champion] });
        scrollTo(els.done, 'start');
      }
    } else {
      els.done.hidden = true;
    }
  }
  function renderDuel(res) {
    duelMatch = null;
    if (cur.m !== 'p' || res.champion >= 0) { els.duel.hidden = true; return; }
    var mt = null;
    for (var i = 0; i < res.matches.length; i++) { if (res.matches[i].ready && res.matches[i].win < 0) { mt = res.matches[i]; break; } }
    if (!mt) { els.duel.hidden = true; return; }
    duelMatch = mt;
    els.duel.hidden = false;
    els.duelRound.textContent = roundName(CORE.roundInfo(mt.r, res.rounds));
    els.duelProgress.textContent = fmt(U.matchOf, { k: res.decided + 1, n: res.real });
    els.sideAName.textContent = cur.n[mt.a];
    els.sideBName.textContent = cur.n[mt.b];
    els.sideA.setAttribute('aria-label', fmt(U.pickAria, { name: cur.n[mt.a] }));
    els.sideB.setAttribute('aria-label', fmt(U.pickAria, { name: cur.n[mt.b] }));
    els.sideA.classList.remove('is-picked'); els.sideB.classList.remove('is-picked');
  }
  function slotEl(mt, side, res) {
    var x = side === 0 ? mt.a : mt.b;
    if (x === -1) { var s0 = el('span', 'bk-slot is-bye', U.bye); return s0; }
    if (x === -2) return el('span', 'bk-slot is-tbd', U.tbd);
    var name = cur.n[x];
    var won = mt.win >= 0 && mt.win === x;
    var lost = mt.win >= 0 && mt.win !== x;
    if (!mt.ready) {
      var s = el('span', 'bk-slot' + (won ? ' is-win' : ''));
      s.appendChild(el('span', 'bk-slot-name', name));
      if (mt.bye) s.appendChild(el('span', 'bk-tag', U.advance));
      return s;
    }
    var b = el('button', 'bk-slot bk-slot-btn' + (won ? ' is-win' : '') + (lost ? ' is-lose' : ''));
    b.type = 'button';
    b.setAttribute('aria-pressed', String(won));
    b.setAttribute('aria-label', fmt(U.pickAria, { name: name }));
    b.appendChild(el('span', 'bk-slot-name', name));
    if (won) b.appendChild(el('span', 'bk-tag bk-tag-win', '✓'));
    b.addEventListener('click', function () { pick(mt.idx, side); });
    return b;
  }
  function renderBoard(res) {
    els.board.innerHTML = '';
    for (var r = 0; r < res.rounds; r++) {
      var sec = el('section', 'bk-round');
      var info = CORE.roundInfo(r, res.rounds);
      sec.appendChild(el('h4', 'bk-round-h', roundName(info)));
      var list = el('div', 'bk-round-list');
      res.matches.forEach(function (mt) {
        if (mt.r !== r) return;
        var box = el('div', 'bk-match' + (mt.bye ? ' is-bye-match' : '') + (duelMatch && duelMatch.idx === mt.idx ? ' is-current' : ''));
        box.appendChild(slotEl(mt, 0, res));
        box.appendChild(slotEl(mt, 1, res));
        list.appendChild(box);
      });
      sec.appendChild(list);
      els.board.appendChild(sec);
    }
    var ch = el('div', 'bk-board-champ' + (res.champion >= 0 ? ' is-on' : ''));
    ch.appendChild(el('span', 'bk-board-champ-k', '🏆 ' + U.champion));
    ch.appendChild(el('span', 'bk-board-champ-n', res.champion >= 0 ? cur.n[res.champion] : U.tbd));
    els.board.appendChild(ch);
  }
  function pick(idx, side) {
    if (!cur) return;
    if (!CORE.setPick(cur, idx, side)) return;
    hist = hist.filter(function (h) { return cur.w[h] !== -1 && h !== idx; });
    hist.push(idx);
    saveState();
    render(true);
  }
  function duelPick(side) {
    if (!duelMatch || busy) return;
    var mt = duelMatch;
    var btn = side === 0 ? els.sideA : els.sideB;
    btn.classList.add('is-picked');
    busy = true;
    setTimeout(function () {
      busy = false;
      pick(mt.idx, side);
      if (!els.duel.hidden) focusSoft(els.sideA);
    }, REDUCED ? 0 : 220);
  }
  function undo() {
    if (!cur) return;
    while (hist.length) {
      var idx = hist.pop();
      if (CORE.clearPick(cur, idx)) break;
    }
    hist = hist.filter(function (h) { return cur.w[h] !== -1; });
    saveState();
    render(false);
    els.live.textContent = U.liveUndo;
    if (!els.duel.hidden) scrollTo(els.duel, 'start');
  }

  // ---------------------------------------------------------------- 내보내기
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function stateUrl() {
    var enc = cur ? CORE.encode(cur) : null;
    return enc ? baseUrl() + '#d=' + enc : '';
  }
  function copyText(text, done) {
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) { /* noop */ }
      done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(fallback);
    else fallback();
  }
  function asText() {
    return CORE.toText(cur, { title: U.titleDefault, round: roundName, vs: U.vs, bye: U.bye, champion: U.champion });
  }
  function fontOf(sel) {
    var x = document.querySelector(sel);
    return x ? getComputedStyle(x).fontFamily : 'sans-serif';
  }
  // 대진표 그림: 라운드마다 한 열, 1라운드 경기는 세로로 쌓고 다음 라운드는 두 경기의 가운데에
  function drawCanvas() {
    var res = CORE.resolve(cur);
    var size = res.size, R = res.rounds;
    var boxW = 190, colW = 226, rowH = 26, unit = 68, left = 32, top = 108, champW = 240;
    var W = left * 2 + R * colW + champW;
    var H = top + (size / 2) * unit + 70;
    if (W < 640) W = 640;
    var scale = size <= 16 ? 2 : 1;
    var cv = document.createElement('canvas');
    cv.width = W * scale; cv.height = H * scale;
    var g = cv.getContext('2d');
    g.scale(scale, scale);
    var display = fontOf('.bk-kicker');
    var sans = getComputedStyle(document.body).fontFamily;
    g.fillStyle = '#14213d'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#fcbf49'; g.font = '800 30px ' + display; g.textBaseline = 'middle';
    function fit(text, max) {
      var t = String(text);
      if (g.measureText(t).width <= max) return t;
      var chars = Array.from(t);
      while (chars.length > 1 && g.measureText(chars.join('') + '…').width > max) chars.pop();
      return chars.join('') + '…';
    }
    g.fillText(fit('🏆 ' + titleOf(cur), W - left * 2), left, 44);
    g.fillStyle = 'rgba(255,248,231,0.75)'; g.font = '600 15px ' + sans;
    g.fillText(fit(fmt(U.meta, { n: cur.n.length, m: res.real }), W - left * 2), left, 78);
    var centers = [];
    for (var r = 0; r < R; r++) {
      var x = left + r * colW;
      var cnt = size >> (r + 1);
      centers.push([]);
      g.fillStyle = '#fcbf49'; g.font = '700 13px ' + sans;
      g.fillText(fit(roundName(CORE.roundInfo(r, R)), boxW), x, top - 14);
      for (var m = 0; m < cnt; m++) {
        var cy = top + (m + 0.5) * unit * Math.pow(2, r);
        centers[r].push(cy);
        var mt = res.matches[CORE.matchIndex(size, r, m)];
        // 이전 라운드에서 이어지는 선
        if (r > 0) {
          g.strokeStyle = 'rgba(255,248,231,0.35)'; g.lineWidth = 2;
          [centers[r - 1][2 * m], centers[r - 1][2 * m + 1]].forEach(function (py) {
            g.beginPath(); g.moveTo(x - colW + boxW, py); g.lineTo(x - (colW - boxW) / 2, py); g.lineTo(x - (colW - boxW) / 2, cy); g.lineTo(x, cy); g.stroke();
          });
        }
        [0, 1].forEach(function (side) {
          var who = side === 0 ? mt.a : mt.b;
          var y = cy - rowH + side * rowH;
          var win = mt.win >= 0 && who === mt.win;
          g.fillStyle = who === -1 ? 'rgba(255,248,231,0.12)' : win ? '#fcbf49' : '#fff8e7';
          g.fillRect(x, y + 1, boxW, rowH - 2);
          g.fillStyle = who === -1 ? 'rgba(255,248,231,0.55)' : '#14213d';
          g.font = (win ? '800 ' : '500 ') + '14px ' + sans;
          var label = who >= 0 ? cur.n[who] : who === -1 ? U.bye : '';
          g.globalAlpha = mt.win >= 0 && who >= 0 && !win ? 0.5 : 1;
          g.fillText(fit(label, boxW - 16), x + 8, y + rowH / 2);
          g.globalAlpha = 1;
        });
      }
    }
    // 우승자
    var fx = left + R * colW, fy = centers[R - 1][0];
    g.strokeStyle = 'rgba(255,248,231,0.35)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(fx - colW + boxW, fy); g.lineTo(fx, fy); g.stroke();
    g.fillStyle = res.champion >= 0 ? '#fcbf49' : 'rgba(255,248,231,0.12)';
    g.fillRect(fx, fy - 24, champW - 20, 48);
    g.fillStyle = '#14213d'; g.font = '800 17px ' + display;
    g.fillText(fit('🏆 ' + (res.champion >= 0 ? cur.n[res.champion] : U.tbd), champW - 40), fx + 10, fy);
    g.fillStyle = 'rgba(255,248,231,0.6)'; g.font = '600 13px ' + sans;
    g.fillText(fit(U.pngBrand, W - left * 2), left, H - 28);
    return cv;
  }
  function savePng() {
    if (!cur) return;
    var go = function () {
      var cv;
      try { cv = drawCanvas(); } catch (e) { toast(U.pngFail); return; }
      var name = 'bracket.png';
      var finish = function (url, revoke) {
        var a = document.createElement('a');
        a.href = url; a.download = name; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        if (revoke) setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        toast(U.pngDone);
      };
      if (cv.toBlob) cv.toBlob(function (blob) { if (blob) finish(URL.createObjectURL(blob), true); else finish(cv.toDataURL('image/png'), false); }, 'image/png');
      else finish(cv.toDataURL('image/png'), false);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(go, go); else go();
  }

  // ---------------------------------------------------------------- 화면 전환
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }
  function backToSetup() {
    els.play.hidden = true;
    els.done.hidden = true;
    els.setup.hidden = false;
    updateCount();
    updateResume();
    scrollTo(els.setup, 'start');
  }
  function loadLink() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var st = CORE.decode(window.location.hash.slice(3));
    clearHash();
    if (!st) { backToSetup(); showError(E.badLink); return true; }
    cur = st;
    hist = [];
    doneTracked = true; // 받은 링크는 세지 않는다
    saveState();
    showPlay();
    return true;
  }

  if (window.setShareData) {
    window.setShareData(function () {
      var res = cur ? CORE.resolve(cur) : null;
      var text = res && res.champion >= 0 ? fmt(R.shareText, { name: cur.n[res.champion], title: titleOf(cur) }) : R.shareTextPlain;
      return { title: R.shareTitle, text: text, url: stateUrl() || baseUrl() };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.again, action: retry });

  // ---------------------------------------------------------------- 이벤트
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  var saveTimer = null;
  els.items.addEventListener('input', function () { clearError(); updateCount(); clearTimeout(saveTimer); saveTimer = setTimeout(saveInput, 250); });
  els.title.addEventListener('input', function () { clearTimeout(saveTimer); saveTimer = setTimeout(saveInput, 250); });
  [els.seedR, els.seedO, els.modeP, els.modeD].forEach(function (x) { x.addEventListener('change', saveInput); });
  els.create.addEventListener('click', doCreate);
  els.resumeBtn.addEventListener('click', function () { if (cur) { showPlay(); scrollTo(els.play, 'start'); } });
  els.sideA.addEventListener('click', function () { duelPick(0); });
  els.sideB.addEventListener('click', function () { duelPick(1); });
  els.undo.addEventListener('click', undo);
  els.png.addEventListener('click', savePng);
  els.text.addEventListener('click', function () { if (cur) copyText(asText(), function () { toast(U.toastText); }); });
  els.link.addEventListener('click', function () {
    if (!cur) return;
    var u = stateUrl();
    if (!u) { toast(U.linkTooLong); return; }
    copyText(u, function () { toast(U.toastLink); });
  });
  els.newB.addEventListener('click', function () { backToSetup(); focusSoft(els.items); });
  window.addEventListener('hashchange', function () { loadLink(); });

  // 검사용 읽기 전용 핸들
  window.BRACKET_APP = {
    state: function () { return cur ? CORE.compact(cur) : null; },
    text: function () { return cur ? asText() : ''; },
    link: function () { return cur ? stateUrl() : ''; },
    png: function () { if (!cur) return null; var cv = drawCanvas(); return { w: cv.width, h: cv.height, data: cv.toDataURL('image/png').length }; }
  };

  loadInput();
  updateCount();
  if (!loadLink()) {
    var saved = loadState();
    if (saved) {
      cur = saved.st; hist = saved.h; doneTracked = saved.dk;
      showPlay();
    }
  }
  updateResume();
})();
