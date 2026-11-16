/* apps/proscons/proscons.js — 장단점 저울: 시작(고민·모드) → 저울판(실시간 저울 + 목록) → 끝(판정)
 * 로직은 proscons-core.js(PROSCONS_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 저울: 항목을 넣거나 무게를 바꿀 때마다 tiltAngle 로 목표 각도를 정하고 requestAnimationFrame + easeStep 으로 부드럽게 따라간다.
 *       움직임 줄이기(prefers-reduced-motion)면 바로 그 각도로.
 * 기록: 한 판에서 첫 항목을 넣을 때 track('start') 한 번, 판정(끝 화면)에 닿을 때 track('done') 한 번. 공유받은 저울을 보기만 하면 세지 않는다.
 * 저장: 초안(고민·모드·이름·목록)만 localStorage proscons_draft(try/catch). 서버로 보내지 않는다.
 * 공유 링크(#d=…): 받은 사람은 같은 저울을 읽기 전용으로 본다 → "사본 고치기"로 자기 초안이 된다.
 * 사용자 글은 언제나 textContent 로만 넣는다(innerHTML 은 비우기에만).
 * 디버그/검사용 읽기 전용 핸들: window.PROSCONS_APP
 */
(function () {
  'use strict';

  var CORE = window.PROSCONS_CORE;
  var I = window.PAGE_I18N || {};
  var S = I.start || {};
  var B = I.board || {};
  var R = I.result || {};
  var E = I.errors || {};
  var PTS = I.pts || {};
  var LANG = I.lang || 'en';
  var STORE = 'proscons_draft';
  var CX = 160, CY = 48, HALF = 120;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), form: $('pc-form'), q: $('q'),
    modeS: $('mode-s'), modeAb: $('mode-ab'), hintS: $('mode-hint-s'), hintAb: $('mode-hint-ab'),
    abNames: $('ab-names'), nameA: $('name-a'), nameB: $('name-b'),
    draftRow: $('draft-row'), draftNote: $('draft-note'), fresh: $('fresh-btn'),
    error: $('error'), go: $('go-btn'),
    board: $('screen-board'), roBadge: $('ro-badge'), roNote: $('ro-note'), bdTitle: $('bd-title'),
    scaleDesc: $('scale-desc'), scaleLive: $('scale-live'),
    beam: $('sc-beam'), panL: $('sc-pan-l'), panR: $('sc-pan-r'),
    ideas: $('ideas'), chips: Array.prototype.slice.call(document.querySelectorAll('.pc-chip')),
    lists: $('lists'), bdError: $('bd-error'), weigh: $('weigh-btn'), copyEdit: $('copy-edit-btn'), back: $('back-btn'),
    end: $('screen-end'), badge: $('shared-badge'), resQ: $('res-q'), verdict: $('res-verdict'),
    barL: $('res-bar-l'), barR: $('res-bar-r'), legL: $('res-leg-l'), legR: $('res-leg-r'),
    tie: $('tie-box'), flip: $('flip-btn'), coin: $('coin'),
    topLHead: $('top-l-head'), topRHead: $('top-r-head'), topL: $('top-l'), topR: $('top-r'),
    link: $('link-btn'), png: $('png-btn'), edit: $('edit-btn')
  };

  var st = CORE.cleanState(null);  // 지금 내 저울 { m, q, a, b, l }
  var shared = null;               // 공유 링크로 보고 있으면 그 저울(읽기 전용)
  var phase = 'start';
  var started = false;             // 이번 판 track('start') 했는지
  var doneTracked = false;         // 이번 판 track('done') 했는지
  var lastInput = null;            // 칩을 넣을 입력칸(마지막으로 누른 "항목 추가" 칸)
  var angle = 0, target = 0, raf = 0, lastT = 0;
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }
  var plural = null;
  try { plural = new Intl.PluralRules(LANG); } catch (e) { plural = null; }

  function fmt(tpl, v) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; });
  }
  function pts(n) {
    var k = plural ? plural.select(n) : (n === 1 ? 'one' : 'other');
    return PTS[k] || PTS.other || '';
  }
  function track(ev) { try { if (window.track) window.track(ev, {}); } catch (e) { /* 통계 실패는 무시 */ } }
  function toast(msg) { try { if (window.toast) window.toast(msg); } catch (e) { /* noop */ } }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function scrollTop() { try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); } }
  function short(s, max) { var a = Array.from(String(s)); return a.length > max ? a.slice(0, max - 1).join('') + '…' : String(s); }

  function view() { return shared || st; }
  function nameA(x) { return (x || view()).a || B.aDefault; }
  function nameB(x) { return (x || view()).b || B.bDefault; }
  function sideNames(x) {
    var s = x || view();
    return s.m === 'ab' ? [nameA(s), nameB(s)] : [B.pros, B.cons];
  }
  function title(x) {
    var s = x || view();
    if (s.q) return s.q;
    return s.m === 'ab' ? fmt(B.defaultAb, { a: nameA(s), b: nameB(s) }) : B.defaultSingle;
  }
  function listTitle(key, s) {
    if (s.m !== 'ab') return key === 'p' ? B.pros : B.cons;
    var name = key.charAt(0) === 'a' ? nameA(s) : nameB(s);
    return fmt(key.charAt(1) === 'p' ? B.prosFor : B.consFor, { name: name });
  }

  // ---------------------------------------------------------------- 저장 (localStorage, try/catch)
  function loadDraft() {
    try { return CORE.cleanState(JSON.parse(window.localStorage.getItem(STORE) || 'null')); } catch (e) { return CORE.cleanState(null); }
  }
  function saveDraft() {
    try { window.localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* 저장이 안 돼도 동작은 한다 */ }
  }

  // ---------------------------------------------------------------- 화면 전환
  function show(name) {
    phase = name;
    els.start.hidden = name !== 'start';
    els.board.hidden = name !== 'board';
    els.end.hidden = name !== 'end';
    scrollTop();
  }
  function setError(node, msg) {
    if (!msg) { node.hidden = true; node.textContent = ''; return; }
    node.textContent = msg;
    node.hidden = false;
  }
  function pressed(btn, on) { btn.setAttribute('aria-pressed', on ? 'true' : 'false'); }

  // ---------------------------------------------------------------- 시작 화면
  function renderStart() {
    pressed(els.modeS, st.m === 's');
    pressed(els.modeAb, st.m === 'ab');
    els.hintS.hidden = st.m !== 's';
    els.hintAb.hidden = st.m !== 'ab';
    els.abNames.hidden = st.m !== 'ab';
    if (els.q.value !== st.q) els.q.value = st.q;
    if (els.nameA.value !== st.a) els.nameA.value = st.a;
    if (els.nameB.value !== st.b) els.nameB.value = st.b;
    var n = CORE.countItems(st);
    els.draftRow.hidden = n === 0;
    els.draftNote.textContent = n ? fmt(S.draftNote, { n: n, pts: pts(n) }) : '';
  }

  function goStart() {
    shared = null;
    clearHash();
    renderStart();
    setError(els.error, null);
    show('start');
    setRetryMode();
  }

  function readStart() {
    st.q = CORE.cleanText(els.q.value, CORE.MAX_Q);
    st.a = CORE.cleanText(els.nameA.value, CORE.MAX_NAME);
    st.b = CORE.cleanText(els.nameB.value, CORE.MAX_NAME);
  }

  function goBoard() {
    readStart();
    saveDraft();
    shared = null;
    clearHash();
    renderBoard();
    show('board');
    setRetryMode();
  }

  // ---------------------------------------------------------------- 저울판
  function renderBoard() {
    var s = view();
    var ro = !!shared;
    els.board.classList.toggle('is-readonly', ro);
    els.roBadge.hidden = !ro;
    els.roNote.hidden = !ro;
    els.ideas.hidden = ro;
    els.copyEdit.hidden = !ro;
    els.back.hidden = ro;
    els.bdTitle.textContent = title(s);
    setError(els.bdError, null);
    var names = sideNames(s);
    els.panL.querySelector('.pc-pan-name').textContent = short(names[0], 12);
    els.panR.querySelector('.pc-pan-name').textContent = short(names[1], 12);
    renderLists();
    updateScale(true);
  }

  function dotsFor(item, key, idx, ro) {
    var wrap = el('span', 'pc-dots');
    for (var w = CORE.W_MIN; w <= CORE.W_MAX; w++) {
      var on = w <= item[0];
      var d;
      if (ro) {
        d = el('span', 'pc-dot' + (on ? ' is-on' : ''));
      } else {
        d = el('button', 'pc-dot' + (on ? ' is-on' : ''));
        d.type = 'button';
        d.setAttribute('data-key', key);
        d.setAttribute('data-idx', String(idx));
        d.setAttribute('data-w', String(w));
        d.setAttribute('aria-label', fmt(B.weightLabel, { w: w }));
        pressed(d, w === item[0]);
      }
      wrap.appendChild(d);
    }
    if (ro) wrap.setAttribute('aria-label', fmt(B.weightLabel, { w: item[0] }));
    return wrap;
  }

  function listBlock(key, s, ro) {
    var pro = key.charAt(key.length - 1) === 'p';
    var box = el('div', 'pc-list ' + (pro ? 'pc-list-pro' : 'pc-list-con'));
    box.setAttribute('data-key', key);
    var headRow = el('div', 'pc-list-head');
    headRow.appendChild(el('span', 'pc-list-title', listTitle(key, s)));
    var sum = el('span', 'pc-list-sum', String(CORE.sumList(s.l[key])));
    sum.setAttribute('data-sum', key);
    headRow.appendChild(sum);
    box.appendChild(headRow);

    var items = s.l[key];
    if (!items.length) box.appendChild(el('p', 'pc-empty', B.emptyList));
    else {
      var ul = el('ul', 'pc-items');
      items.forEach(function (it, i) {
        var li = el('li', 'pc-item');
        li.appendChild(el('span', 'pc-item-text', it[1]));
        li.appendChild(dotsFor(it, key, i, ro));
        if (!ro) {
          var x = el('button', 'pc-x', '×');
          x.type = 'button';
          x.setAttribute('data-key', key);
          x.setAttribute('data-idx', String(i));
          x.setAttribute('aria-label', B.remove + ': ' + it[1]);
          li.appendChild(x);
        }
        ul.appendChild(li);
      });
      box.appendChild(ul);
    }

    if (!ro) {
      var full = items.length >= CORE.MAX_ITEMS;
      var f = el('form', 'pc-add');
      f.setAttribute('data-key', key);
      f.noValidate = true;
      var inp = el('input', 'pc-add-input');
      inp.type = 'text';
      inp.maxLength = CORE.MAX_TEXT;
      inp.placeholder = B.addPh;
      inp.setAttribute('enterkeyhint', 'enter');
      inp.setAttribute('aria-label', fmt(B.addLabel, { list: listTitle(key, s) }));
      inp.setAttribute('data-key', key);
      inp.disabled = full;
      var btn = el('button', 'pc-add-btn', B.add);
      btn.type = 'submit';
      btn.disabled = full;
      f.appendChild(inp);
      f.appendChild(btn);
      box.appendChild(f);
      if (full) box.appendChild(el('p', 'pc-hint pc-full', B.full));
    }
    return box;
  }

  function renderLists() {
    var s = view();
    var ro = !!shared;
    els.lists.innerHTML = '';
    if (s.m === 'ab') {
      [['a', nameA(s)], ['b', nameB(s)]].forEach(function (o) {
        var card = el('div', 'pc-card pc-option pc-option-' + o[0]);
        card.appendChild(el('h3', 'pc-option-name', o[1]));
        card.appendChild(listBlock(o[0] + 'p', s, ro));
        card.appendChild(listBlock(o[0] + 'c', s, ro));
        els.lists.appendChild(card);
      });
    } else {
      ['p', 'c'].forEach(function (k) {
        var card = el('div', 'pc-card pc-side');
        card.appendChild(listBlock(k, s, ro));
        els.lists.appendChild(card);
      });
    }
  }

  function focusAdd(key) {
    var inp = els.lists.querySelector('.pc-add-input[data-key="' + key + '"]');
    if (inp && !inp.disabled) { try { inp.focus({ preventScroll: false }); } catch (e) { inp.focus(); } lastInput = inp; }
  }

  function updateSums() {
    var s = view();
    Array.prototype.forEach.call(els.lists.querySelectorAll('[data-sum]'), function (n) {
      n.textContent = String(CORE.sumList(s.l[n.getAttribute('data-sum')]));
    });
  }

  // ---------------------------------------------------------------- 저울 그림
  function applyAngle(a) {
    var e = CORE.beamEnds(a, CX, CY, HALF);
    els.beam.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' ' + CX + ' ' + CY + ')');
    els.panL.setAttribute('transform', 'translate(' + e.lx.toFixed(2) + ' ' + e.ly.toFixed(2) + ')');
    els.panR.setAttribute('transform', 'translate(' + e.rx.toFixed(2) + ' ' + e.ry.toFixed(2) + ')');
  }
  function tick(t) {
    var dt = lastT ? Math.min(64, t - lastT) : 16;
    lastT = t;
    angle = CORE.easeStep(angle, target, dt, 170);
    applyAngle(angle);
    if (angle !== target) raf = window.requestAnimationFrame(tick);
    else { raf = 0; lastT = 0; }
  }
  function updateScale(instant) {
    var sc = CORE.score(view());
    target = CORE.tiltAngle(sc.left, sc.right);
    els.panL.querySelector('.pc-pan-num').textContent = String(sc.left);
    els.panR.querySelector('.pc-pan-num').textContent = String(sc.right);
    var names = sideNames();
    var desc = fmt(B.scaleLabel, { left: names[0] + ' ' + sc.left, right: names[1] + ' ' + sc.right });
    els.scaleDesc.textContent = desc;
    if (!instant) els.scaleLive.textContent = desc;
    if (reduced || instant || !window.requestAnimationFrame) {
      if (raf) { window.cancelAnimationFrame(raf); raf = 0; lastT = 0; }
      angle = target;
      applyAngle(angle);
      return;
    }
    if (!raf) raf = window.requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------------- 항목 편집
  function changed() {
    saveDraft();
    updateSums();
    updateScale(false);
  }

  function onAdd(key, inp) {
    var err = CORE.addItem(st, key, inp.value);
    if (err === 'empty') { inp.focus(); return; }
    if (err === 'full') { setError(els.bdError, B.full); return; }
    if (err) return;
    setError(els.bdError, null);
    if (!started) { started = true; track('start'); }
    renderLists();
    changed();
    focusAdd(key);
  }

  els.lists.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.classList || !f.classList.contains('pc-add')) return;
    e.preventDefault();
    if (shared) return;
    var key = f.getAttribute('data-key');
    onAdd(key, f.querySelector('.pc-add-input'));
  });
  els.lists.addEventListener('click', function (e) {
    if (shared) return;
    var t = e.target;
    if (!t || !t.getAttribute) return;
    var key = t.getAttribute('data-key');
    var idx = Number(t.getAttribute('data-idx'));
    if (!key || !st.l[key] || !st.l[key][idx]) return;
    if (t.classList.contains('pc-dot')) {
      var w = CORE.cleanWeight(t.getAttribute('data-w'));
      st.l[key][idx][0] = w;
      Array.prototype.forEach.call(t.parentNode.querySelectorAll('.pc-dot'), function (d) {
        var dw = Number(d.getAttribute('data-w'));
        d.classList.toggle('is-on', dw <= w);
        pressed(d, dw === w);
      });
      changed();
    } else if (t.classList.contains('pc-x')) {
      st.l[key].splice(idx, 1);
      setError(els.bdError, null);
      renderLists();
      changed();
      focusAdd(key);
    }
  });
  els.lists.addEventListener('focusin', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('pc-add-input')) lastInput = e.target;
  });

  els.chips.forEach(function (c) {
    c.addEventListener('click', function () {
      if (shared) return;
      var inp = lastInput && document.body.contains(lastInput) && !lastInput.disabled ? lastInput : els.lists.querySelector('.pc-add-input:not([disabled])');
      if (!inp) return;
      var topic = B.chips[Number(c.getAttribute('data-chip'))] || '';
      var prefix = fmt(B.chipFormat, { topic: topic });
      if (inp.value.indexOf(prefix) !== 0) inp.value = (prefix + inp.value).slice(0, CORE.MAX_TEXT);
      try { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) { /* noop */ }
      lastInput = inp;
    });
  });

  // ---------------------------------------------------------------- 끝 화면
  function weigh() {
    var s = view();
    if (!CORE.countItems(s)) { setError(els.bdError, B.needPoint); return; }
    renderEnd(s, !!shared);
    show('end');
    if (!shared && !doneTracked) { doneTracked = true; track('done'); }
  }

  function verdictText(s, v) {
    if (v.kind === 'tie') return fmt(R.tie, { left: v.left, right: v.right });
    var vars = { n: v.margin, pts: pts(v.margin), pct: v.pct };
    if (s.m === 'ab') { vars.name = v.kind === 'left' ? nameA(s) : nameB(s); return fmt(R.verdictWin, vars); }
    return fmt(v.kind === 'left' ? R.verdictPros : R.verdictCons, vars);
  }

  function reasonTag(s, key) {
    if (s.m !== 'ab') return '';
    var name = key.charAt(0) === 'a' ? nameA(s) : nameB(s);
    return fmt(key.charAt(1) === 'p' ? R.tagPro : R.tagCon, { name: name });
  }

  function fillTop(ol, s, side) {
    ol.innerHTML = '';
    var top = CORE.topReasons(s, side, 3);
    if (!top.length) { ol.appendChild(el('li', 'pc-top-empty', B.emptyList)); return; }
    top.forEach(function (r) {
      var li = el('li', 'pc-top-item');
      li.appendChild(el('span', 'pc-top-w', '●●●'.slice(0, r.w) + '○○○'.slice(0, CORE.W_MAX - r.w)));
      var txt = el('span', 'pc-top-text', r.t);
      li.appendChild(txt);
      var tag = reasonTag(s, r.key);
      if (tag) li.appendChild(el('span', 'pc-tag ' + (r.key.charAt(1) === 'p' ? 'is-pro' : 'is-con'), tag));
      ol.appendChild(li);
    });
  }

  function renderEnd(s, isShared) {
    var v = CORE.verdict(s);
    var names = sideNames(s);
    els.badge.hidden = !isShared;
    els.resQ.textContent = title(s);
    els.verdict.textContent = verdictText(s, v);
    els.verdict.className = 'pc-verdict is-' + v.kind;
    var lp = v.total ? Math.round((v.left / v.total) * 100) : 50;
    els.barL.style.width = lp + '%';
    els.barR.style.width = (100 - lp) + '%';
    els.legL.textContent = names[0] + ' ' + v.left;
    els.legR.textContent = names[1] + ' ' + v.right;
    els.tie.hidden = v.kind !== 'tie';
    els.coin.hidden = true;
    els.coin.textContent = '';
    els.coin.classList.remove('is-spin');
    if (s.m === 'ab') {
      els.topLHead.textContent = fmt(R.topFor, { name: names[0] });
      els.topRHead.textContent = fmt(R.topFor, { name: names[1] });
    } else {
      els.topLHead.textContent = R.topPros;
      els.topRHead.textContent = R.topCons;
    }
    fillTop(els.topL, s, 'left');
    fillTop(els.topR, s, 'right');
    els.edit.textContent = isShared ? B.editCopy : R.edit;
    setShare();
    setRetryMode();
  }

  function flipCoin() {
    var s = view();
    var side = CORE.coinFlip();
    var msg = s.m === 'ab' ? fmt(R.coinAb, { name: side === 0 ? nameA(s) : nameB(s) }) : (side === 0 ? R.coinYes : R.coinNo);
    els.coin.hidden = false;
    els.coin.textContent = '🪙';
    els.flip.disabled = true;
    var finish = function () { els.coin.classList.remove('is-spin'); els.coin.textContent = msg; els.flip.disabled = false; };
    if (reduced) { finish(); return; }
    els.coin.classList.remove('is-spin');
    void els.coin.offsetWidth;
    els.coin.classList.add('is-spin');
    setTimeout(finish, 900);
  }

  // ---------------------------------------------------------------- 공유
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function shareUrl(s) {
    var enc = CORE.encodeShare(s);
    return enc ? baseUrl() + '#d=' + enc : null;
  }
  function setShare() {
    if (!window.setShareData) return;
    window.setShareData(function () {
      return { title: R.shareTitle, text: R.shareText, url: shareUrl(view()) || baseUrl() };
    });
  }
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }

  function copyText(text, msg) {
    var done = function () { toast(msg); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* 복사 불가 */ }
    document.body.removeChild(ta);
  }

  // 다시 하기: 새 고민(초안 비우기). 공유 저울을 보고 있으면 "내 고민 달아 보기".
  function setRetryMode() {
    if (!window.setRetry) return;
    window.setRetry({ label: shared ? R.againShared : R.again, action: newDecision });
  }
  function newDecision() {
    var m = shared ? 's' : st.m;
    shared = null;
    st = CORE.cleanState({ m: m });
    saveDraft();
    started = false;
    doneTracked = false;
    lastInput = null;
    goStart();
  }

  function editCopy() {
    if (!shared) return;
    st = CORE.cleanState(shared);
    shared = null;
    started = false;
    doneTracked = false;
    clearHash();
    saveDraft();
    renderBoard();
    show('board');
    setRetryMode();
  }

  // ---------------------------------------------------------------- PNG 카드 (canvas)
  function cssVar(name, fallback) {
    try { var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fallback; } catch (e) { return fallback; }
  }
  function wrapLines(ctx, text, maxW, maxLines) {
    var chars = Array.from(String(text));
    var lines = [], line = '';
    var spaced = /\s/.test(text);
    var tokens = spaced ? String(text).split(/(\s+)/) : chars;
    tokens.forEach(function (tk) {
      var test = line + tk;
      if (ctx.measureText(test).width > maxW && line.trim()) {
        lines.push(line.trim());
        line = tk.trim() ? tk : '';
        while (ctx.measureText(line).width > maxW) {
          var a = Array.from(line), cut = a.length;
          while (cut > 1 && ctx.measureText(a.slice(0, cut).join('')).width > maxW) cut--;
          lines.push(a.slice(0, cut).join(''));
          line = a.slice(cut).join('');
        }
      } else line = test;
    });
    if (line.trim()) lines.push(line.trim());
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = Array.from(lines[maxLines - 1]).slice(0, -1).join('') + '…'; }
    return lines;
  }
  function drawCard() {
    var s = view();
    var v = CORE.verdict(s);
    var names = sideNames(s);
    var W = 1080, H = 1350, P = 80;
    var c = document.createElement('canvas');
    c.width = W; c.height = H;
    var ctx = c.getContext('2d');
    var sans = cssVar('--font-sans', 'sans-serif');
    var disp = cssVar('--font-display', sans);
    var dw = cssVar('--display-weight', '800');
    ctx.fillStyle = '#f6f1e7'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1f2a44'; ctx.fillRect(0, H - 110, W, 110);
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#b5532b';
    ctx.font = '800 34px ' + sans;
    ctx.fillText(R.cardBrand, P, P);
    var y = P + 80;
    ctx.fillStyle = '#1f2a44';
    ctx.font = '700 44px ' + sans;
    wrapLines(ctx, title(s), W - P * 2, 3).forEach(function (ln) { ctx.fillText(ln, P, y); y += 60; });
    y += 30;
    ctx.font = dw + ' 72px ' + disp;
    ctx.fillStyle = v.kind === 'right' ? '#a23b3b' : (v.kind === 'tie' ? '#1f2a44' : '#2f6b4f');
    wrapLines(ctx, verdictText(s, v), W - P * 2, 3).forEach(function (ln) { ctx.fillText(ln, P, y); y += 92; });
    y += 20;
    var lp = v.total ? v.left / v.total : 0.5;
    ctx.fillStyle = '#2f6b4f'; ctx.fillRect(P, y, (W - P * 2) * lp, 36);
    ctx.fillStyle = '#c4644a'; ctx.fillRect(P + (W - P * 2) * lp, y, (W - P * 2) * (1 - lp), 36);
    y += 56;
    ctx.font = '700 32px ' + sans;
    ctx.fillStyle = '#1f2a44';
    ctx.fillText(short(names[0], 16) + ' ' + v.left, P, y);
    ctx.textAlign = 'right';
    ctx.fillText(short(names[1], 16) + ' ' + v.right, W - P, y);
    ctx.textAlign = 'left';
    y += 80;
    var colW = (W - P * 2 - 40) / 2;
    var heads = s.m === 'ab' ? [fmt(R.topFor, { name: names[0] }), fmt(R.topFor, { name: names[1] })] : [R.topPros, R.topCons];
    ['left', 'right'].forEach(function (side, i) {
      var x = P + i * (colW + 40), yy = y;
      ctx.fillStyle = i ? '#a23b3b' : '#2f6b4f';
      ctx.font = '800 32px ' + sans;
      wrapLines(ctx, heads[i], colW, 2).forEach(function (ln) { ctx.fillText(ln, x, yy); yy += 42; });
      yy += 10;
      ctx.fillStyle = '#1f2a44';
      CORE.topReasons(s, side, 3).forEach(function (r) {
        ctx.font = '700 26px ' + sans;
        ctx.fillStyle = '#b5532b';
        ctx.fillText('●●●'.slice(0, r.w) + '○○○'.slice(0, CORE.W_MAX - r.w), x, yy);
        yy += 38;
        ctx.fillStyle = '#1f2a44';
        ctx.font = '600 30px ' + sans;
        wrapLines(ctx, r.t, colW, 3).forEach(function (ln) { ctx.fillText(ln, x, yy); yy += 40; });
        yy += 14;
      });
    });
    ctx.fillStyle = '#f6f1e7';
    ctx.font = '700 30px ' + sans;
    ctx.textBaseline = 'middle';
    ctx.fillText('melgene.com', P, H - 55);
    return c;
  }
  function savePng() {
    var c;
    try { c = drawCard(); } catch (e) { return; }
    var name = (R.fileName || 'pros-and-cons') + '.png';
    var finish = function (href, revoke) {
      var a = document.createElement('a');
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (revoke) setTimeout(function () { URL.revokeObjectURL(href); }, 4000);
      toast(R.saved);
    };
    if (c.toBlob && window.URL && URL.createObjectURL) c.toBlob(function (b) { if (b) finish(URL.createObjectURL(b), true); }, 'image/png');
    else finish(c.toDataURL('image/png'), false);
  }

  // ---------------------------------------------------------------- 공유 링크로 열기 (#d=)
  function loadShared() {
    if (!/^#d=/.test(window.location.hash)) return false;
    var rec = CORE.decodeShare(window.location.hash.slice(3));
    if (!rec) {
      goStart();
      setError(els.error, E.badLink);
      return true;
    }
    shared = rec;
    renderBoard();
    show('board');
    setRetryMode();
    setShare();
    return true;
  }

  // ---------------------------------------------------------------- 연결
  [els.modeS, els.modeAb].forEach(function (b) {
    b.addEventListener('click', function () { readStart(); st.m = b.getAttribute('data-mode') === 'ab' ? 'ab' : 's'; renderStart(); saveDraft(); });
  });
  [els.q, els.nameA, els.nameB].forEach(function (inp) {
    inp.addEventListener('input', function () { setError(els.error, null); st.q = els.q.value; st.a = els.nameA.value; st.b = els.nameB.value; saveDraft(); });
  });
  els.form.addEventListener('submit', function (e) { e.preventDefault(); goBoard(); });
  els.form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') { e.preventDefault(); if (e.target === els.nameA) els.nameB.focus(); else goBoard(); }
  });
  els.fresh.addEventListener('click', function () { st = CORE.cleanState({ m: st.m }); saveDraft(); started = false; doneTracked = false; renderStart(); });
  els.go.addEventListener('click', goBoard);
  els.weigh.addEventListener('click', weigh);
  els.copyEdit.addEventListener('click', editCopy);
  els.back.addEventListener('click', goStart);
  els.flip.addEventListener('click', flipCoin);
  els.link.addEventListener('click', function () {
    var u = shareUrl(view());
    if (u) copyText(u, R.linkCopied);
    else copyText(baseUrl(), R.linkTooLong);
  });
  els.png.addEventListener('click', savePng);
  els.edit.addEventListener('click', function () {
    if (shared) { editCopy(); return; }
    renderBoard();
    show('board');
  });
  window.addEventListener('hashchange', function () { loadShared(); });

  window.PROSCONS_APP = {
    phase: function () { return phase; },
    shared: function () { return !!shared; },
    state: function () { return JSON.parse(JSON.stringify(view())); },
    angle: function () { return angle; },
    target: function () { return target; },
    verdict: function () { return els.verdict.textContent; },
    link: function () { return shareUrl(view()) || ''; },
    card: function () { try { return drawCard().toDataURL('image/png').length; } catch (e) { return 0; } }
  };

  // 처음 열면 시작 화면(이 기기의 초안 복원). #d= 링크로 열면 그 저울을 읽기 전용으로.
  st = loadDraft();
  renderStart();
  show('start');
  setRetryMode();
  loadShared();
})();
