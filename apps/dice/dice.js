/* apps/dice/dice.js — 한 화면 주사위 굴리기: 개수(1~6)·종류(d4~d20) → 굴리기 → 판에 결과 + 합계 → 최근 10번 기록 (+ 공통 끝 화면)
 * 로직은 dice-core.js(DICE_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 결과는 먼저 crypto 로 뽑고, 굴리는 연출(d6 = CSS 3D 정육면체 굴림, 그 밖 = 돌며 튀는 다각형)은 그 값에 멈추는 모습만 보여 준다.
 * 움직임 줄이기(prefers-reduced-motion)면 연출 없이 바로 결과.
 * 광고: 첫 화면 맨 아래 .mg-ad-start 한 자리(첫 굴림 뒤 기록·끝 화면이 나오면 숨김 — 끝 화면 광고와 겹치지 않게). 끝 화면은 공통 컴포넌트(data-mg-end).
 * 기록: 굴리기를 누를 때 track('start') 한 번, 결과가 판에 보일 때 track('done') 한 번(다시 굴릴 때마다 또).
 * 숫자: 서버 숫자 없음. 최근 10번 기록은 메모리에만(저장하지 않음, 새로 고치면 사라짐).
 * 키보드: Space(입력·버튼에 초점이 없을 때) = 굴리기.
 * 디버그/검사용 읽기 전용 핸들: window.DICE_APP (busy(), last(), history(), settings())
 */
(function () {
  'use strict';

  var CORE = window.DICE_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var H = I.history || {};
  var R = I.result || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CUBE_MS = 1100;
  var POLY_MS = 950;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  // 다각형 주사위 모양(viewBox 0 0 100 100): [바깥 점들, 안쪽 면 선, 숫자 y]
  var SHAPES = {
    4: ['50,6 96,90 4,90', '', 70],
    8: ['50,3 97,50 50,97 3,50', '3,50 97,50', 53],
    10: ['50,3 96,40 50,97 4,40', '4,40 50,58 96,40 M50,58 50,97', 50],
    12: ['50,3 97,37 79,94 21,94 3,37', '', 56],
    20: ['50,3 93,27 93,73 50,97 7,73 7,27', '50,24 79,72 21,72 50,24', 58],
  };

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    dice: $('dice'), total: $('total'), live: $('live'), roll: $('roll-btn'),
    counts: document.querySelectorAll('[data-count]'), types: document.querySelectorAll('[data-sides]'),
    history: $('history'), historyList: $('history-list'), tray: $('tray'),
    adStart: document.querySelector('.mg-ad-start'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var count = 2;
  var sides = CORE.DEFAULT_SIDES;
  var busy = false;
  var last = null;           // { count, sides, values, total }
  var history = [];
  var timers = [];
  var shuffles = [];
  var cubes = [];            // d6 정육면체 상태 { el, x, y } (돌린 각도 누적)
  var trayKey = '';          // 판에 그려진 개수/종류 — 같으면 다시 그리지 않고 지금 모습에서 굴린다

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() {
    timers.forEach(clearTimeout); timers = [];
    shuffles.forEach(clearInterval); shuffles = [];
  }
  var numFmt = null;
  try { numFmt = new Intl.NumberFormat(I.lang || 'en'); } catch (e) { /* noop */ }
  function num(n) { return numFmt ? numFmt.format(n) : String(n); }
  function notation(c, s) { return CORE.notation(c, s, U.dieLetter || 'd'); }
  function valuesText(values) { return values.map(num).join(' + '); }

  // ---------------------------------------------------------------- 주사위 그림
  function pips() { var s = ''; for (var i = 0; i < 9; i++) s += '<i></i>'; return s; }
  function cubeHtml() {
    var f = '';
    for (var v = 1; v <= 6; v++) f += '<span class="dc-face dc-f' + v + '" data-v="' + v + '">' + pips() + '</span>';
    return '<span class="dc-die dc-d6"><span class="dc-cube">' + f + '</span><span class="dc-shadow"></span></span>';
  }
  function polyEl(s, v) {
    var shape = SHAPES[s];
    var wrap = document.createElement('span');
    wrap.className = 'dc-die dc-poly dc-d' + s;
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'dc-poly-svg');
    var poly = document.createElementNS(SVG_NS, 'polygon');
    poly.setAttribute('points', shape[0]);
    poly.setAttribute('class', 'dc-poly-body');
    svg.appendChild(poly);
    if (shape[1]) {
      var facet = document.createElementNS(SVG_NS, 'path');
      facet.setAttribute('d', 'M' + shape[1]);
      facet.setAttribute('class', 'dc-poly-facet');
      svg.appendChild(facet);
    }
    var text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', '50');
    text.setAttribute('y', String(shape[2]));
    text.setAttribute('class', 'dc-poly-num');
    text.textContent = String(v);
    svg.appendChild(text);
    wrap.appendChild(svg);
    return wrap;
  }
  function setPoly(el, v) {
    var t = el.querySelector('text');
    t.textContent = String(v);
    el.setAttribute('data-v', String(v));
    t.setAttribute('font-size', String(v).length > 1 ? '34' : '42');
  }
  function setCube(c, v, spin) {
    var r = CORE.cubeRotation(v);
    // 돌린 각도는 누적해서 늘 앞으로 굴러가게(돌아가는 거리는 연출용 — 결과와 무관)
    var bx = Math.ceil(c.x / 360) * 360;
    var by = Math.ceil(c.y / 360) * 360;
    c.x = bx + (spin ? 720 + 360 * CORE.cryptoInt(2) : 0) + r.x;
    c.y = by + (spin ? 360 + 360 * CORE.cryptoInt(2) : 0) + r.y;
    c.el.querySelector('.dc-cube').style.transform = 'rotateX(' + c.x + 'deg) rotateY(' + c.y + 'deg)';
    c.el.setAttribute('data-v', String(v));
  }

  // 판을 지금 설정(개수·종류)으로 다시 그린다. values 가 있으면 그 값으로.
  function buildTray(values) {
    clearTimers();
    trayKey = count + '/' + sides;
    els.dice.innerHTML = '';
    els.dice.className = 'dc-dice dc-count-' + count + ' dc-type-' + sides;
    cubes = [];
    var idle = [6, 3, 5, 2, 4, 1];
    for (var i = 0; i < count; i++) {
      var v = values ? values[i] : (sides === 6 ? idle[i] : sides);
      if (sides === 6) {
        var holder = document.createElement('span');
        holder.innerHTML = cubeHtml();
        var el = holder.firstChild;
        els.dice.appendChild(el);
        var c = { el: el, x: 0, y: 0 };
        var cube = el.querySelector('.dc-cube');
        cube.style.transition = 'none';
        setCube(c, v, false);
        cubes.push(c);
      } else {
        var p = polyEl(sides, v);
        setPoly(p, v);
        els.dice.appendChild(p);
      }
    }
  }
  function idleTotal() {
    els.total.textContent = U.idle;
    els.total.classList.add('is-idle');
  }

  // ---------------------------------------------------------------- 설정
  function setCount(n) {
    if (busy) return;
    count = CORE.clampCount(n);
    els.counts.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-count')) === count)); });
    buildTray(null); idleTotal();
  }
  function setSides(s) {
    if (busy) return;
    sides = CORE.clampSides(s);
    els.types.forEach(function (b) { b.setAttribute('aria-checked', String(Number(b.getAttribute('data-sides')) === sides)); });
    buildTray(null); idleTotal();
  }
  function lock(on) {
    busy = on;
    els.roll.disabled = on;
    els.roll.setAttribute('aria-busy', String(on));
    els.counts.forEach(function (b) { b.disabled = on; });
    els.types.forEach(function (b) { b.disabled = on; });
  }

  // ---------------------------------------------------------------- 굴리기
  function roll() {
    if (busy) return;
    var values = CORE.roll(count, sides);   // 결과 먼저 — 연출은 이 값으로 멈춘다
    last = { count: count, sides: sides, values: values, total: CORE.sum(values) };
    lock(true);
    track('start');
    if (trayKey !== count + '/' + sides) buildTray(null);
    clearTimers();
    els.dice.classList.remove('is-landed');
    els.total.textContent = U.rolling;
    els.total.classList.add('is-idle');
    if (REDUCED) {
      buildTray(values);
      later(land, 60);
      return;
    }
    void els.dice.offsetHeight;
    els.dice.classList.add('is-rolling');
    if (sides === 6) {
      cubes.forEach(function (c, i) {
        var cube = c.el.querySelector('.dc-cube');
        cube.style.transition = 'transform ' + (CUBE_MS - i * 40) + 'ms cubic-bezier(0.18, 0.75, 0.25, 1)';
        setCube(c, values[i], true);
      });
      later(land, CUBE_MS + 60);
    } else {
      var polys = els.dice.querySelectorAll('.dc-poly');
      shuffles.push(setInterval(function () {
        Array.prototype.forEach.call(polys, function (p) { setPoly(p, CORE.cryptoInt(sides) + 1); });
      }, 80));
      later(function () {
        shuffles.forEach(clearInterval); shuffles = [];
        Array.prototype.forEach.call(polys, function (p, i) { setPoly(p, values[i]); });
        land();
      }, POLY_MS);
    }
  }

  function land() {
    els.dice.classList.remove('is-rolling');
    els.dice.classList.add('is-landed');
    var v = last.values;
    els.total.classList.remove('is-idle');
    els.total.textContent = v.length > 1 ? fmt(U.total, { n: num(last.total) }) : notation(1, last.sides) + ' → ' + num(v[0]);
    els.live.textContent = v.length > 1 ? fmt(U.live, { values: valuesText(v), total: num(last.total) }) : fmt(U.liveOne, { values: num(v[0]) });
    history = CORE.pushHistory(history, last);
    renderHistory();
    lock(false);
    track('done');
  }

  function renderHistory() {
    els.historyList.innerHTML = '';
    history.forEach(function (h) {
      var li = document.createElement('li');
      var dice = document.createElement('span');
      dice.className = 'dc-h-dice';
      dice.textContent = notation(h.count, h.sides);
      var vals = document.createElement('span');
      vals.className = 'dc-h-vals';
      vals.textContent = h.values.length > 1 ? valuesText(h.values) + ' = ' : valuesText(h.values);
      li.appendChild(dice);
      li.appendChild(vals);
      if (h.values.length > 1) {
        var tot = document.createElement('b');
        tot.className = 'dc-h-total';
        tot.textContent = num(h.total);
        li.appendChild(tot);
      }
      li.setAttribute('aria-label', h.values.length > 1
        ? fmt(H.item, { dice: notation(h.count, h.sides), values: valuesText(h.values), total: num(h.total) })
        : fmt(H.itemOne, { dice: notation(h.count, h.sides), values: valuesText(h.values) }));
      els.historyList.appendChild(li);
    });
    els.history.hidden = history.length === 0;
    // 기록·끝 화면(광고 포함)이 보이면 첫 화면 맨 아래 광고는 숨긴다(한 화면 광고 1개)
    if (els.adStart) els.adStart.hidden = history.length > 0;
  }

  function again() {
    if (busy) return;
    var top = els.tray.getBoundingClientRect().top + window.pageYOffset - 70;
    try { window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, Math.max(0, top)); }
    roll();
  }

  if (window.setRetry) window.setRetry({ label: R.again, action: again });
  if (window.setShareData) {
    window.setShareData(function () {
      var base = window.location.href.split('#')[0];
      var text = R.shareTitle;
      if (last) {
        text = last.values.length > 1
          ? fmt(R.shareText, { dice: notation(last.count, last.sides), values: valuesText(last.values), total: num(last.total) })
          : fmt(R.shareTextOne, { dice: notation(1, last.sides), values: num(last.values[0]) });
      }
      return { title: R.shareTitle, text: text, url: window.mgCleanUrl ? window.mgCleanUrl(base) : base };
    });
  }

  // ---------------------------------------------------------------- 이벤트
  els.counts.forEach(function (b) { b.addEventListener('click', function () { setCount(b.getAttribute('data-count')); }); });
  els.types.forEach(function (b) { b.addEventListener('click', function () { setSides(b.getAttribute('data-sides')); }); });
  // 라디오 그룹 화살표 이동
  [els.counts, els.types].forEach(function (group) {
    var list = Array.prototype.slice.call(group);
    list.forEach(function (b, i) {
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var to = list[(i + d + list.length) % list.length];
        to.focus(); to.click();
      });
    });
  });
  els.roll.addEventListener('click', roll);
  els.dice.addEventListener('click', roll);
  document.addEventListener('keydown', function (e) {
    if (e.code !== 'Space' && e.key !== ' ') return;
    if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    var tag = t && t.tagName ? t.tagName.toLowerCase() : '';
    if (/^(input|textarea|select|button|a|summary|details)$/.test(tag) || (t && t.isContentEditable)) return;
    e.preventDefault();
    roll();
  });

  window.DICE_APP = {
    busy: function () { return busy; },
    last: function () { return last ? { count: last.count, sides: last.sides, values: last.values.slice(), total: last.total } : null; },
    history: function () { return history.map(function (h) { return { count: h.count, sides: h.sides, values: h.values.slice(), total: h.total }; }); },
    settings: function () { return { count: count, sides: sides }; }
  };

  buildTray(null);
  idleTotal();
})();
