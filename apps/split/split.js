/* apps/split/split.js — 한 화면 더치페이 계산기.
 *   방법: 똑같이 나누기(a: 총액·인원·팁 %) / 항목별로 나누기(b: 사람 이름·메뉴(가격·함께 먹은 사람)·세금·팁 %).
 *   공통: 통화(언어 기본값), 정리 단위(통화별), 끝돈(총무 부담 h / 골고루 e), 누가 먼저 냈어요(낸 사람·금액 → 최소 송금 목록).
 * 로직은 split-core.js(SPLIT_CORE, 정수 최소 단위), 문구는 PAGE_I18N(언어별). 금액 모양은 Intl.NumberFormat(통화).
 * 기록: 한 판 = 이번 판에서 처음으로 계산이 제대로 나온 순간 track('start') 한 번 → "정산 완료"를 처음 누르면 track('done') 한 번.
 *       다시 하기(setRetry) = 입력을 비우고 새 판(방법·통화·정리 단위는 그대로).
 * 저장: localStorage 'mg_split_v1' 에 마지막 입력(공유 링크와 같은 모양). 링크로 공유 = #d=<UTF-8 base64url JSON>(서버 없음).
 *       서버로는 아무것도 보내지 않는다. 공통 끝 화면 공유는 깨끗한 주소(mgCleanUrl, 이름·금액 없음).
 * 디버그/검사용 읽기 전용 핸들: window.SPLIT_APP (state(), calc(), transfers(), rounds(), copyText())
 */
(function () {
  'use strict';

  var CORE = window.SPLIT_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var E = I.errors || {};
  var LANG = I.lang || 'en';
  var CUR = I.cur || { def: 'USD', local: '' };
  var TIP = I.tip || { presets: [], open: false };
  var STORE_KEY = 'mg_split_v1';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var L = CORE.LIMIT;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    modes: [].slice.call(document.querySelectorAll('[data-mode]')), boxA: $('box-a'), boxB: $('box-b'), currency: $('currency'),
    total: $('in-total'), people: $('in-people'), minus: $('people-minus'), plus: $('people-plus'),
    tipMoreA: $('tip-more-a'), tipA: $('tip-a'), tipMoreB: $('tip-more-b'), tipB: $('tip-b'), tax: $('in-tax'),
    peopleList: $('people-list'), addPerson: $('add-person'), itemList: $('item-list'), addItem: $('add-item'),
    unitChips: $('unit-chips'), rems: [].slice.call(document.querySelectorAll('[data-rem]')), remNote: $('rem-host-note'),
    out: $('out'), lead: $('out-lead'), body: $('out-body'), grand: $('out-grand'), brk: $('out-break'), shares: $('out-shares'), sum: $('out-sum'), err: $('out-err'),
    payToggle: $('pay-toggle'), payBox: $('pay-box'), payerList: $('payer-list'), addPayer: $('add-payer'), transfers: $('transfers'), paySum: $('pay-sum'),
    copy: $('copy-btn'), link: $('link-btn'), finish: $('finish-btn'), finishErr: $('finish-err'), result: $('result'), summary: $('summary-card'),
    sumGrand: $('sum-grand'), sumBreak: $('sum-break'), sumShares: $('sum-shares'), sumPay: $('sum-pay'), sumTransfers: $('sum-transfers'), sumCopy: $('sum-copy'),
    shared: $('shared-note'), live: $('live'), adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }

  // ---------------------------------------------------------------- 상태 (공유·저장과 같은 모양 + 화면 전용 문자열)
  var st = CORE.defaultState(LANG);
  var tipStr = { a: '', b: '' };      // 팁 칸에 쓴 글자 그대로 (직접 %)
  var raw = { total: '', prices: [], paid: [] };
  var res = null, pay = null;
  var started = false, doneRound = false;
  var touched = false;                 // 사용자가 이번 판에서 무언가를 입력·눌렀나 (저장값·공유 링크만으로는 start 를 세지 않는다)
  var rounds = { start: 0, done: 0 };

  function track(ev) {
    rounds[ev] = (rounds[ev] || 0) + 1;
    try { if (window.track) window.track(ev, {}); } catch (e) { /* noop */ }
  }
  function storeGet() { try { return window.localStorage.getItem(STORE_KEY); } catch (e) { return null; } }
  function storeSet(v) { try { window.localStorage.setItem(STORE_KEY, v); } catch (e) { /* noop */ } }

  // ---------------------------------------------------------------- 금액 모양
  var nfCache = {};
  function nf(code) {
    if (nfCache[code]) return nfCache[code];
    var dec = CORE.CURRENCIES[code].dec, f = null;
    try { f = new Intl.NumberFormat(LANG, { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol', minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    catch (e) { try { f = new Intl.NumberFormat(LANG, { style: 'currency', currency: code, minimumFractionDigits: dec, maximumFractionDigits: dec }); } catch (e2) { f = null; } }
    var g = null;
    try { g = new Intl.NumberFormat(LANG, { minimumFractionDigits: dec, maximumFractionDigits: dec }); } catch (e) { g = null; }
    nfCache[code] = { cur: f, num: g, dec: dec };
    return nfCache[code];
  }
  function money(minor, code) {
    code = code || st.c;
    var F = nf(code), v = minor / CORE.scale(code);
    if (CUR.local && code === CUR.def) return fmt(CUR.local, { n: F.num ? F.num.format(v) : v.toFixed(F.dec) });
    return F.cur ? F.cur.format(v) : v.toFixed(F.dec) + ' ' + code;
  }
  function symbol(code) {
    if (CUR.local && code === CUR.def) return CUR.local.replace('{n}', '').trim();
    try {
      var parts = new Intl.NumberFormat(LANG, { style: 'currency', currency: code, currencyDisplay: 'narrowSymbol' }).formatToParts(0);
      for (var i = 0; i < parts.length; i++) if (parts[i].type === 'currency') return parts[i].value;
    } catch (e) { /* noop */ }
    return code;
  }
  // 입력 칸에 다시 넣을 글자 (구분 기호 없이, 그 언어의 소수점)
  function plain(minor, code) {
    if (minor == null) return '';
    var dec = CORE.CURRENCIES[code].dec;
    var s = dec ? (minor / CORE.scale(code)).toFixed(dec).replace(/\.?0+$/, '') : String(minor);
    try { if (dec && (1.5).toLocaleString(LANG).indexOf(',') >= 0) s = s.replace('.', ','); } catch (e) { /* noop */ }
    return s;
  }
  function pctText(p) { try { return new Intl.NumberFormat(LANG, { maximumFractionDigits: 2 }).format(p) + '%'; } catch (e) { return p + '%'; } }

  // ---------------------------------------------------------------- 사람 이름
  function nameB(i) { var n = st.b.p[i]; return n ? n : fmt(U.personN, { n: i + 1 }); }
  function nameA(i) { return i === 0 ? U.me : fmt(U.personN, { n: i + 1 }); }
  function nameOf(i) { return st.m === 'a' ? nameA(i) : nameB(i); }
  function peopleCount() { return st.m === 'a' ? st.a.n : st.b.p.length; }

  // ---------------------------------------------------------------- 화면 그리기 (목록)
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function chipBtn(label, pressed, onClick) {
    var b = el('button', 'sp-chip', label);
    b.type = 'button';
    b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    b.addEventListener('click', onClick);
    return b;
  }
  function moneyInput(cls, value, label, onInput) {
    var w = el('div', 'sp-inwrap ' + (cls || ''));
    var i = el('input', 'sp-input');
    i.type = 'text'; i.inputMode = 'decimal'; i.autocomplete = 'off'; i.spellcheck = false;
    i.value = value || '';
    i.placeholder = label;
    i.setAttribute('aria-label', label);
    i.addEventListener('input', function () { onInput(i); });
    w.appendChild(i);
    var s = el('span', 'sp-suffix', symbol(st.c)); s.setAttribute('aria-hidden', 'true'); s.setAttribute('data-sym', '');
    w.appendChild(s);
    return w;
  }
  function xBtn(label, onClick, disabled) {
    var b = el('button', 'sp-x', '×');
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.disabled = !!disabled;
    b.addEventListener('click', onClick);
    return b;
  }

  function drawPeople() {
    els.peopleList.innerHTML = '';
    st.b.p.forEach(function (nm, i) {
      var row = el('div', 'sp-person');
      var inp = el('input', 'sp-input sp-name');
      inp.type = 'text'; inp.maxLength = L.name; inp.autocomplete = 'off'; inp.value = nm;
      inp.placeholder = fmt(U.personN, { n: i + 1 });
      inp.setAttribute('aria-label', U.namePh + ' ' + (i + 1));
      inp.addEventListener('input', function () { st.b.p[i] = CORE.cleanName(inp.value, L.name); refreshNames(); calc(); });
      row.appendChild(inp);
      row.appendChild(xBtn(fmt(U.removePerson, { name: nameB(i) }), function () { removePerson(i); }, st.b.p.length <= L.itemPeople[0]));
      els.peopleList.appendChild(row);
    });
    els.addPerson.disabled = st.b.p.length >= L.itemPeople[1];
  }
  function drawItems() {
    els.itemList.innerHTML = '';
    st.b.i.forEach(function (it, i) {
      var box = el('div', 'sp-item');
      var top = el('div', 'sp-item-top');
      var nameIn = el('input', 'sp-input sp-iname');
      nameIn.type = 'text'; nameIn.maxLength = L.itemName; nameIn.autocomplete = 'off'; nameIn.value = it[0];
      nameIn.placeholder = U.itemPh + ' ' + (i + 1);
      nameIn.setAttribute('aria-label', U.itemPh + ' ' + (i + 1));
      nameIn.addEventListener('input', function () { it[0] = CORE.cleanName(nameIn.value, L.itemName); calc(); });
      top.appendChild(nameIn);
      top.appendChild(moneyInput('sp-price', raw.prices[i] != null ? raw.prices[i] : plain(it[1], st.c), U.pricePh, function (inp) { raw.prices[i] = inp.value; calc(); }));
      top.appendChild(xBtn(U.removeItem, function () { removeItem(i); }, st.b.i.length <= 1));
      box.appendChild(top);
      var who = el('div', 'sp-chips sp-who');
      who.setAttribute('role', 'group');
      who.setAttribute('aria-label', U.sharedBy);
      st.b.p.forEach(function (x, p) {
        who.appendChild(chipBtn(nameB(p), it[2].indexOf(p) >= 0, function (e) {
          var k = it[2].indexOf(p);
          if (k >= 0) it[2].splice(k, 1); else { it[2].push(p); it[2].sort(function (a, b) { return a - b; }); }
          e.currentTarget.setAttribute('aria-pressed', k >= 0 ? 'false' : 'true');
          calc();
        }));
      });
      box.appendChild(who);
      els.itemList.appendChild(box);
    });
    els.addItem.disabled = st.b.i.length >= L.items;
  }
  function refreshNames() {
    // 이름이 바뀌면 메뉴 칩·낸 사람 선택의 이름만 다시 쓴다 (입력 칸 포커스 유지)
    [].slice.call(els.itemList.querySelectorAll('.sp-who')).forEach(function (w) {
      [].slice.call(w.children).forEach(function (b, p) { b.textContent = nameB(p); });
    });
    [].slice.call(els.payerList.querySelectorAll('select')).forEach(function (s) {
      [].slice.call(s.options).forEach(function (o, p) { o.textContent = nameOf(p); });
    });
  }
  function drawPayers() {
    els.payerList.innerHTML = '';
    var rows = st.s || [];
    var n = peopleCount();
    rows.forEach(function (row, i) {
      var r = el('div', 'sp-payer');
      var sel = el('select', 'sp-select');
      sel.setAttribute('aria-label', U.payer);
      for (var p = 0; p < n; p++) { var o = el('option', null, nameOf(p)); o.value = String(p); if (p === row[0]) o.selected = true; sel.appendChild(o); }
      sel.addEventListener('change', function () { row[0] = Number(sel.value); calc(); });
      r.appendChild(sel);
      r.appendChild(moneyInput('sp-paid', raw.paid[i] != null ? raw.paid[i] : plain(row[1], st.c), U.paidPh, function (inp) { raw.paid[i] = inp.value; calc(); }));
      r.appendChild(xBtn(U.removePayer, function () { removePayer(i); }, rows.length <= 1));
      els.payerList.appendChild(r);
    });
    els.addPayer.disabled = rows.length >= Math.min(L.payers, n);
  }
  function drawTipChips(which) {
    var box = document.querySelector('[data-tip-chips="' + which + '"]');
    var cur = which === 'a' ? st.a.p : st.b.q;
    box.innerHTML = '';
    var presets = [0].concat(TIP.presets || []);
    var isPreset = presets.indexOf(cur) >= 0 && !tipStr[which];
    presets.forEach(function (p) {
      box.appendChild(chipBtn(p ? pctText(p) : U.tipNone, isPreset && cur === p, function () {
        tipStr[which] = '';
        if (which === 'a') st.a.p = p; else st.b.q = p;
        drawTipChips(which); calc();
      }));
    });
    var w = el('div', 'sp-inwrap sp-tip-in');
    var inp = el('input', 'sp-input');
    inp.type = 'text'; inp.inputMode = 'decimal'; inp.autocomplete = 'off';
    inp.placeholder = U.tipOther; inp.setAttribute('aria-label', U.tipLabel + ' ' + U.tipOther);
    inp.value = tipStr[which] || (!isPreset && cur ? String(cur) : '');
    inp.addEventListener('input', function () {
      tipStr[which] = inp.value;
      var r = CORE.parsePct(inp.value);
      var v = r.value != null ? r.value : 0;
      if (which === 'a') st.a.p = v; else st.b.q = v;
      [].slice.call(box.querySelectorAll('.sp-chip')).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      calc();
    });
    w.appendChild(inp);
    var s = el('span', 'sp-suffix', '%'); s.setAttribute('aria-hidden', 'true');
    w.appendChild(s);
    box.appendChild(w);
  }
  function drawUnits() {
    els.unitChips.innerHTML = '';
    CORE.CURRENCIES[st.c].units.forEach(function (u) {
      els.unitChips.appendChild(chipBtn(money(u), st.u === u, function () { st.u = u; drawUnits(); calc(); }));
    });
  }
  function drawSymbols() {
    var sym = symbol(st.c);
    [].slice.call(document.querySelectorAll('[data-sym]')).forEach(function (s) { s.textContent = sym; });
    document.documentElement.style.setProperty('--sym-pad', Math.max(34, 14 + sym.length * 11) + 'px');
  }
  function drawMode() {
    els.modes.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-mode') === st.m ? 'true' : 'false'); });
    els.boxA.hidden = st.m !== 'a';
    els.boxB.hidden = st.m !== 'b';
    els.rems.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-rem') === st.r ? 'true' : 'false'); });
    els.remNote.hidden = !(st.m === 'b' && st.r === 'h');
  }
  function setOpen(btn, box, open) { box.hidden = !open; btn.hidden = open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  function drawAll() {
    els.currency.value = st.c;
    els.total.value = raw.total !== '' ? raw.total : plain(st.a.t, st.c);
    els.people.value = String(st.a.n);
    els.tax.value = st.b.x ? String(st.b.x) : '';
    setOpen(els.tipMoreA, els.tipA, !!TIP.open || st.a.p > 0);
    setOpen(els.tipMoreB, els.tipB, !!TIP.open || st.b.q > 0 || st.b.x > 0);
    els.payToggle.checked = st.s !== null;
    els.payBox.hidden = st.s === null;
    drawMode(); drawUnits(); drawTipChips('a'); drawTipChips('b'); drawPeople(); drawItems(); drawPayers(); drawSymbols();
  }

  // ---------------------------------------------------------------- 목록 바꾸기
  function removePerson(i) {
    if (st.b.p.length <= L.itemPeople[0]) return;
    st.b.p.splice(i, 1);
    st.b.i.forEach(function (it) { it[2] = it[2].filter(function (x) { return x !== i; }).map(function (x) { return x > i ? x - 1 : x; }); });
    if (st.b.h >= st.b.p.length) st.b.h = 0;
    if (st.s && st.m === 'b') st.s.forEach(function (r) { if (r[0] === i) r[0] = 0; else if (r[0] > i) r[0]--; });
    drawPeople(); drawItems(); drawPayers(); calc();
  }
  function addPerson() {
    if (st.b.p.length >= L.itemPeople[1]) return;
    var idx = st.b.p.length;
    st.b.p.push('');
    st.b.i.forEach(function (it) { if (it[2].length === idx) it[2].push(idx); }); // 모두가 함께 먹은 메뉴면 새 사람도 넣는다
    drawPeople(); drawItems(); drawPayers(); calc();
    try { els.peopleList.lastChild.querySelector('input').focus(); } catch (e) { /* noop */ }
  }
  function addItem() {
    if (st.b.i.length >= L.items) return;
    st.b.i.push(['', null, st.b.p.map(function (x, k) { return k; })]);
    raw.prices.push('');
    drawItems(); calc();
    try { els.itemList.lastChild.querySelector('input').focus(); } catch (e) { /* noop */ }
  }
  function removeItem(i) {
    if (st.b.i.length <= 1) return;
    st.b.i.splice(i, 1); raw.prices.splice(i, 1);
    drawItems(); calc();
  }
  function addPayer() {
    if (!st.s) st.s = [];
    var used = st.s.map(function (r) { return r[0]; });
    var p = 0;
    while (used.indexOf(p) >= 0 && p < peopleCount() - 1) p++;
    st.s.push([p, null]); raw.paid.push('');
    drawPayers(); calc();
  }
  function removePayer(i) {
    if (!st.s || st.s.length <= 1) return;
    st.s.splice(i, 1); raw.paid.splice(i, 1);
    drawPayers(); calc();
  }

  // ---------------------------------------------------------------- 계산
  function setText(e, t) { e.textContent = t || ''; e.hidden = !t; }
  function li(text, cls) { return el('li', cls || null, text); }
  function fillShares(ul, r) {
    ul.innerHTML = '';
    if (st.m === 'a') {
      r.groups.forEach(function (g) {
        ul.appendChild(li(g.host ? fmt(U.hostLine, { amount: money(g.amount) }) : fmt(U.groupLine, { amount: money(g.amount), n: g.count }), g.host ? 'is-host' : ''));
      });
    } else {
      r.shares.forEach(function (a, i) {
        var x = el('li', st.r === 'h' && i === st.b.h ? 'is-host' : '');
        x.appendChild(el('span', 'sp-who-n', nameB(i)));
        x.appendChild(el('b', 'sp-amt', money(a)));
        if (r.tax || r.tip) x.appendChild(el('small', 'sp-why', fmt(U.personLine, { sub: money(r.subs[i]), extra: money(r.extras[i]) })));
        ul.appendChild(x);
      });
    }
  }
  function breakdown(r) {
    var parts = [];
    if (r.tax || r.tip) parts.push(fmt(U.subLine, { sub: money(r.sub) }));
    if (r.tax) parts.push(fmt(U.taxLine, { amount: money(r.tax) }));
    if (r.tip) parts.push(fmt(U.tipLine, { amount: money(r.tip) }));
    return parts.join(' + ');
  }
  function fillTransfers(ul, list) {
    ul.innerHTML = '';
    if (!list.length) { ul.appendChild(li(U.noTransfers, 'is-none')); return; }
    list.forEach(function (t) { ul.appendChild(li(fmt(U.transfer, { from: nameOf(t.from), to: nameOf(t.to), amount: money(t.amount) }))); });
  }
  function showErr(msg) {
    setText(els.err, msg);
    els.out.classList.toggle('is-err', !!msg);
  }

  function markStart() { if (!started) { started = true; track('start'); } }
  function clampPayers() {
    if (!st.s) return;
    var n = peopleCount();
    st.s.forEach(function (r) { if (r[0] >= n) r[0] = 0; });
  }
  function calc() {
    var error = null;
    res = null; pay = null;
    if (st.m === 'a') {
      var t = CORE.parseAmount(els.total.value, st.c);
      raw.total = els.total.value;
      st.a.t = t.value != null ? t.value : null;
      if (t.error) error = E[t.error] || E.badNum;
      var n = Math.round(Number(String(els.people.value).replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); })));
      if (!(n >= L.people[0] && n <= L.people[1])) error = error || E.peopleRange;
      else if (n !== st.a.n) { st.a.n = n; drawPayers(); }
      var ta = CORE.parsePct(tipStr.a || '');
      if (tipStr.a && ta.error) error = error || E.badPct;
      if (!error && st.a.t > 0) {
        var r = CORE.calcEven({ total: st.a.t, people: st.a.n, tip: st.a.p, unit: st.u, mode: st.r === 'h' ? 'host' : 'even' });
        if (r.ok) res = r; else if (r.error) error = E[r.error];
      }
    } else {
      st.b.i.forEach(function (it, i) {
        var p = CORE.parseAmount(raw.prices[i] != null ? raw.prices[i] : plain(it[1], st.c), st.c);
        it[1] = p.value != null ? p.value : null;
        if (p.error && !error) error = E[p.error] || E.badNum;
      });
      var tx = CORE.parsePct(els.tax.value);
      st.b.x = tx.value != null ? tx.value : 0;
      if (tx.error) error = error || E.badPct;
      var tb = CORE.parsePct(tipStr.b || '');
      if (tipStr.b && tb.error) error = error || E.badPct;
      if (!error) {
        var r2 = CORE.calcItems({ people: st.b.p.length, items: st.b.i.map(function (it) { return { price: it[1], who: it[2] }; }), tax: st.b.x, tip: st.b.q, unit: st.u, mode: st.r === 'h' ? 'host' : 'even', host: st.b.h });
        if (r2.ok) res = r2;
        else if (r2.error === 'noSharer') error = fmt(E.noSharer, { item: st.b.i[r2.item][0] || (U.itemPh + ' ' + (r2.item + 1)) });
        else if (r2.error) error = E[r2.error];
      }
    }
    // 정산
    clampPayers();
    if (res && st.s) {
      var paid = [], n2 = peopleCount(), i2;
      for (i2 = 0; i2 < n2; i2++) paid.push(0);
      st.s.forEach(function (row, k) {
        var a = CORE.parseAmount(raw.paid[k] != null ? raw.paid[k] : plain(row[1], st.c), st.c);
        row[1] = a.value != null ? a.value : null;
        if (a.error && !error) error = E[a.error] || E.badNum;
        if (row[0] < n2) paid[row[0]] += a.value || 0;
      });
      // 한 사람만 있고 금액이 비었으면 전액을 낸 것으로 본다
      if (st.s.length === 1 && st.s[0][1] == null) paid[st.s[0][0]] = res.grand;
      pay = CORE.settle(res.shares, paid);
    }
    render(error);
    save();
  }

  function render(error) {
    showErr(error);
    if (!res) {
      els.body.hidden = true;
      els.lead.hidden = false;
      els.lead.textContent = st.m === 'a' ? U.waiting : U.waitingItems;
      els.transfers.innerHTML = '';
      setText(els.paySum, '');
      return;
    }
    if (touched) markStart();
    els.lead.hidden = true;
    els.body.hidden = false;
    els.grand.textContent = money(res.grand);
    setText(els.brk, breakdown(res));
    fillShares(els.shares, res);
    var total = res.shares.reduce(function (a, b) { return a + b; }, 0);
    els.sum.textContent = total === res.grand ? fmt(U.sumOk, { total: money(res.grand) }) : '';
    if (pay) {
      if (pay.ok) { fillTransfers(els.transfers, pay.transfers); setText(els.paySum, U.paidOk); els.paySum.className = 'sp-ok'; }
      else {
        els.transfers.innerHTML = '';
        setText(els.paySum, fmt(pay.diff > 0 ? U.paidOver : U.paidUnder, { diff: money(Math.abs(pay.diff)) }));
        els.paySum.className = 'sp-ok is-bad';
      }
    } else { els.transfers.innerHTML = ''; setText(els.paySum, ''); }
    if (els.finishErr) els.finishErr.hidden = true;
    if (!els.result.hidden) fillSummary();
    announce();
  }
  var liveTimer = null;
  function announce() {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () { if (res && els.live) els.live.textContent = money(res.grand) + ' — ' + [].slice.call(els.shares.children).map(function (x) { return x.textContent; }).join(', '); }, 800);
  }

  // ---------------------------------------------------------------- 결과 글 (메신저용)
  function copyText() {
    if (!res) return '';
    var lines = [U.copyHead, fmt(U.copyTotal, { total: money(res.grand), n: peopleCount() })];
    var b = breakdown(res);
    if (b) lines.push(b);
    if (st.m === 'a') res.groups.forEach(function (g) { lines.push('· ' + (g.host ? fmt(U.hostLine, { amount: money(g.amount) }) : fmt(U.groupLine, { amount: money(g.amount), n: g.count }))); });
    else res.shares.forEach(function (a, i) { lines.push('· ' + nameB(i) + ' ' + money(a)); });
    if (pay && pay.ok && pay.transfers.length) {
      lines.push(U.copyTransfers);
      pay.transfers.forEach(function (t) { lines.push('· ' + fmt(U.transfer, { from: nameOf(t.from), to: nameOf(t.to), amount: money(t.amount) })); });
    }
    lines.push(baseUrl());
    return lines.join('\n');
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
  function needResult() {
    if (res) return true;
    els.finishErr.textContent = U.needOne;
    els.finishErr.hidden = false;
    return false;
  }
  function baseUrl() {
    var base = window.location.href.split('#')[0].split('?')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(base) : base;
  }
  function linkUrl() { var d = CORE.encodeShare(st); return d ? baseUrl() + '#d=' + d : baseUrl(); }
  els.copy.addEventListener('click', function () { if (needResult()) copy(copyText(), U.copied); });
  els.sumCopy.addEventListener('click', function () { if (needResult()) copy(copyText(), U.copied); });
  els.link.addEventListener('click', function () { if (needResult()) copy(linkUrl(), U.linkCopied); });

  // ---------------------------------------------------------------- 저장·공유 링크 불러오기
  var saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { var w = CORE.toWire(st); if (w) storeSet(JSON.stringify(w)); }, 300);
  }
  function load() {
    var h = window.location.hash;
    if (/^#d=/.test(h)) {
      var s = CORE.decodeShare(h.slice(3));
      if (s) { st = s; els.shared.hidden = false; return; }
      showErr(E.badLink);
      return 'bad';
    }
    var savedRaw = storeGet();
    if (savedRaw) {
      var o = null;
      try { o = CORE.fromWire(JSON.parse(savedRaw)); } catch (e) { o = null; }
      if (o) st = o;
    }
  }
  function clearHash() {
    if (/^#d=/.test(window.location.hash)) {
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    }
  }

  // ---------------------------------------------------------------- 이벤트
  els.modes.forEach(function (b) { b.addEventListener('click', function () { st.m = b.getAttribute('data-mode'); drawMode(); drawPayers(); calc(); }); });
  els.rems.forEach(function (b) { b.addEventListener('click', function () { st.r = b.getAttribute('data-rem'); drawMode(); calc(); }); });
  els.currency.addEventListener('change', function () {
    var c = CORE.currencyOf(els.currency.value);
    // 들어 있던 글자는 새 통화로 다시 읽는다 (금액 숫자는 그대로)
    st.c = c; st.u = CORE.CURRENCIES[c].def;
    drawUnits(); drawSymbols(); drawItems(); drawPayers(); calc();
  });
  els.total.addEventListener('input', calc);
  els.people.addEventListener('input', calc);
  function step(d) {
    var n = Math.min(L.people[1], Math.max(L.people[0], (Number(els.people.value) || st.a.n) + d));
    els.people.value = String(n);
    calc();
  }
  els.minus.addEventListener('click', function () { step(-1); });
  els.plus.addEventListener('click', function () { step(1); });
  els.tax.addEventListener('input', calc);
  els.tipMoreA.addEventListener('click', function () { setOpen(els.tipMoreA, els.tipA, true); });
  els.tipMoreB.addEventListener('click', function () { setOpen(els.tipMoreB, els.tipB, true); });
  els.addPerson.addEventListener('click', addPerson);
  els.addItem.addEventListener('click', addItem);
  els.addPayer.addEventListener('click', addPayer);
  els.payToggle.addEventListener('change', function () {
    if (els.payToggle.checked) { if (!st.s) { st.s = []; raw.paid = []; addPayer(); } }
    else { st.s = null; raw.paid = []; }
    els.payBox.hidden = st.s === null;
    drawPayers(); calc();
  });

  var screenEl = document.getElementById('screen-split');
  ['input', 'change', 'click'].forEach(function (ev) {
    screenEl.addEventListener(ev, function (e) { if (!els.result.contains(e.target)) touched = true; }, true);
  });

  // ---------------------------------------------------------------- 정산 완료 → 요약 + 공통 끝 화면
  function fillSummary() {
    if (!res) return;
    els.sumGrand.textContent = money(res.grand);
    setText(els.sumBreak, breakdown(res));
    fillShares(els.sumShares, res);
    var showPay = !!(pay && pay.ok);
    els.sumPay.hidden = !showPay;
    if (showPay) fillTransfers(els.sumTransfers, pay.transfers);
  }
  function smoothTo(e, offset) {
    if (!e) return;
    var top = e.getBoundingClientRect().top + window.pageYOffset - (offset || 70);
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (x) { window.scrollTo(0, Math.max(0, top)); }
  }
  function finish() {
    if (!needResult()) return;
    markStart();
    els.finishErr.hidden = true;
    fillSummary();
    els.result.hidden = false;
    if (els.adStart) els.adStart.hidden = true; // 요약·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다
    if (!doneRound) { doneRound = true; track('done'); }
    setTimeout(function () { smoothTo(els.summary, 70); }, 20);
  }
  els.finish.addEventListener('click', finish);

  // 다시 하기: 요약을 닫고 입력을 비운 뒤 새 판 (방법·통화·정리 단위·끝돈 방식은 그대로)
  function reset() {
    var keep = { m: st.m, c: st.c, u: st.u, r: st.r };
    st = CORE.defaultState(LANG);
    st.m = keep.m; st.c = keep.c; st.u = keep.u; st.r = keep.r;
    tipStr = { a: '', b: '' };
    raw = { total: '', prices: [], paid: [] };
    started = false; doneRound = false; touched = false;
    els.result.hidden = true;
    if (els.adStart) els.adStart.hidden = false;
    els.finishErr.hidden = true;
    els.shared.hidden = true;
    clearHash();
    drawAll(); calc();
    try { window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
  }
  window.addEventListener('hashchange', function () {
    if (!/^#d=/.test(window.location.hash)) return;
    raw = { total: '', prices: [], paid: [] }; tipStr = { a: '', b: '' };
    load(); drawAll(); calc();
  });

  // 공통 끝 화면 공유: 깨끗한 주소(이름·금액 없음) + 고정 문구
  if (window.setShareData) window.setShareData(function () { return { title: U.shareTitle, text: U.shareText, url: baseUrl() }; });
  if (window.setRetry) window.setRetry({ label: U.again, action: reset });

  window.SPLIT_APP = {
    state: function () { return JSON.parse(JSON.stringify(st)); },
    calc: function () { return res ? JSON.parse(JSON.stringify(res)) : null; },
    transfers: function () { return pay ? JSON.parse(JSON.stringify(pay)) : null; },
    rounds: function () { return { start: rounds.start, done: rounds.done }; },
    copyText: copyText
  };

  var bad = load();
  if (!CORE.CURRENCIES[st.c]) st.c = CORE.langCurrency(LANG);
  drawAll();
  calc();
  if (bad) showErr(E.badLink);
})();
