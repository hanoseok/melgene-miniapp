/* apps/hub/script.js — 미니앱 포털.
 * 생성기가 정적으로 그려 둔 두 부분에 동작을 붙인다.
 *   1) 큐레이션 캐러셀: 실제 참여 수·별점 채우기, 점/화살표, 스와이프 위치 표시
 *   2) 홈 화면식 아이콘 격자: 카테고리·검색·정렬로 다시 그리기(아이콘 아래 ★·참여 수)
 *   + 누적 참여 알약("지금까지 N명이 참여했어요", 0이면 숨김)
 * 로드 순서: site.config.js → i18n.js → PAGE_I18N(인라인) → common.js → supa.js → hub-core.js → 이 파일.
 * 숫자는 Supabase 에 실제 데이터가 있을 때만 보여 준다(실패·비활성·0이면 아무것도 표시하지 않음). 가짜 숫자는 만들지 않는다.
 */
(function () {
  'use strict';

  var CORE = window.HUB_CORE;
  var CFG = window.SITE_CONFIG || {};
  var UI = window.PAGE_I18N || {};
  var LANG = window.PAGE_LANG || (document.documentElement.lang || 'en').split('-')[0];
  var grid = document.getElementById('hub-grid');
  if (!CORE || !grid) return;

  var CATS = CORE.CATS; // game → test → create
  var SORTS = ['popular', 'rating', 'newest'];
  var STORE_KEY = 'mg_hub_view';
  var reduceMotion = false;
  try { reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* noop */ }

  function fmt(tpl, map) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; });
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  var apps = (CFG.SITES || []).map(function (s, i) {
    var L = window.localizeSite ? window.localizeSite(s, LANG) : { title: s.title, desc: s.desc, href: s.path };
    return {
      id: s.id,
      emoji: s.emoji,
      category: CORE.catOf(s.category),
      added: s.added || '',
      order: i,
      title: L.title,
      desc: L.desc,
      href: L.href,
      hueStyle: CORE.hueStyle(s.id)
    };
  });
  var byId = {};
  apps.forEach(function (a) { byId[a.id] = a; });
  var today = new Date();

  // ---------------------------------------------------------------
  // 상태 (카테고리·정렬은 기억, 검색어는 기억하지 않음)
  // ---------------------------------------------------------------
  var state = { cat: 'all', sort: 'popular', q: '' };
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved && (saved.cat === 'all' || CATS.indexOf(saved.cat) >= 0)) state.cat = saved.cat;
    if (saved && SORTS.indexOf(saved.sort) >= 0) state.sort = saved.sort;
  } catch (e) { /* 저장소 차단 */ }
  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ cat: state.cat, sort: state.sort })); } catch (e) { /* noop */ }
  }
  // 저장된 카테고리 칩이 이 언어 페이지에 없으면(앱 0개 카테고리) 전체로
  if (state.cat !== 'all' && !document.querySelector('.chip[data-cat="' + state.cat + '"]')) state.cat = 'all';

  var loading = true; // summary 기다리는 중 → 스켈레톤
  var stats = null;   // null = 모름(비활성·실패) → 숫자를 숨긴다. {} 는 "아직 0" 이다.

  // 보여 줄 실제 숫자가 있는 앱만 { plays, avg, votes } — 없으면 null
  function realStats(id) {
    if (!stats) return null;
    var st = CORE.statOf(stats, id);
    var hasRating = st.votes > 0 && st.avg != null;
    if (!(st.plays > 0) && !hasRating && !(st.hearts > 0)) return null;
    return { plays: st.plays, avg: hasRating ? Math.max(0, Math.min(5, st.avg)) : null, votes: st.votes, hearts: st.hearts };
  }
  function srText(st) {
    var parts = [];
    if (st.hearts > 0 && window.t) parts.push(fmt(window.t('heartCount'), { n: CORE.num(st.hearts, LANG) }));
    if (st.avg != null) parts.push(fmt(UI.ratingAria, { avg: st.avg.toFixed(1), votes: CORE.num(st.votes, LANG) }));
    if (st.plays > 0) parts.push(fmt(UI.plays, { n: CORE.compact(st.plays, LANG) }));
    return parts.join(', ');
  }

  // ---------------------------------------------------------------
  // 아이콘 (생성기 iconHtml() 과 같은 구조)
  // ---------------------------------------------------------------
  function iconWrap(app) {
    var wrap = el('span', 'app-icon-wrap');
    var icon = el('span', 'app-icon');
    icon.setAttribute('aria-hidden', 'true');
    icon.appendChild(el('span', 'app-emoji', app.emoji));
    wrap.appendChild(icon);
    if (CORE.isNew(app.added, today)) wrap.appendChild(el('span', 'app-badge', UI.newBadge || 'NEW'));
    return wrap;
  }

  // ---------------------------------------------------------------
  // 1) 홈 화면 아이콘 격자
  // ---------------------------------------------------------------
  function tileMeta(app) {
    if (loading) {
      var sk = el('span', 'tile-meta');
      sk.setAttribute('aria-hidden', 'true');
      sk.appendChild(el('span', 'sk sk-tiny'));
      return sk;
    }
    var st = realStats(app.id);
    if (!st) return null;
    var m = el('span', 'tile-meta');
    var vis = el('span', 'tile-meta-vis');
    vis.setAttribute('aria-hidden', 'true');
    // 아이콘 아래는 자리가 좁다: 하트·별점 우선, 둘 다 없으면 참여 수
    if (st.hearts > 0) vis.appendChild(el('span', 't-hearts', CORE.compact(st.hearts, LANG)));
    if (st.avg != null) vis.appendChild(el('span', 't-star', st.avg.toFixed(1)));
    if (!(st.hearts > 0) && st.avg == null && st.plays > 0) vis.appendChild(el('span', 't-plays', CORE.compact(st.plays, LANG)));
    m.appendChild(vis);
    m.appendChild(el('span', 'visually-hidden', srText(st)));
    return m;
  }

  // 생성기 tileHtml() 과 같은 구조 — 한쪽을 바꾸면 다른 쪽도 바꾼다.
  function tileEl(app) {
    var li = el('li', 'tile');
    li.setAttribute('data-id', app.id);
    li.setAttribute('data-cat', app.category);
    var a = el('a', 'tile-link');
    a.href = app.href;
    a.title = app.desc;
    a.setAttribute('style', app.hueStyle);
    a.appendChild(iconWrap(app));
    a.appendChild(el('span', 'tile-name', app.title));
    var meta = tileMeta(app);
    if (meta) a.appendChild(meta);
    li.appendChild(a);
    return li;
  }

  var chips = document.querySelectorAll('.chip[data-cat]');
  var sortEl = document.getElementById('hub-sort');
  var countEl = document.getElementById('hub-count');
  var emptyEl = document.getElementById('hub-empty');
  var emptyText = document.getElementById('hub-empty-text');
  var searchEl = document.getElementById('hub-q');
  var resetBtn = document.getElementById('hub-reset');

  function renderGrid(animate) {
    var shown = CORE.sortApps(apps.filter(function (a) {
      return (state.cat === 'all' || a.category === state.cat) && CORE.matches(a, state.q);
    }), stats, state.sort);
    var frag = document.createDocumentFragment();
    shown.forEach(function (a) { frag.appendChild(tileEl(a)); });
    grid.innerHTML = '';
    grid.appendChild(frag);
    grid.classList.toggle('is-loading', loading);
    grid.hidden = !shown.length;
    if (animate && !reduceMotion) {
      grid.classList.remove('is-swap');
      void grid.offsetWidth; // 애니메이션 다시 시작
      grid.classList.add('is-swap');
    }
    each(chips, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === state.cat)); });
    if (sortEl) sortEl.value = state.sort;
    if (countEl) countEl.textContent = shown.length === 1 ? UI.countOne : fmt(UI.count, { n: shown.length });
    if (emptyEl) {
      emptyEl.hidden = !!shown.length;
      if (!shown.length && emptyText) emptyText.textContent = state.q ? fmt(UI.emptySearch, { q: state.q.trim() }) : UI.emptyCat;
    }
  }

  // ---------------------------------------------------------------
  // 2) 큐레이션 카드: 실제 숫자 채우기 + NEW 배지를 오늘 날짜로 맞추기
  // ---------------------------------------------------------------
  function hydrateCuration() {
    each(document.querySelectorAll('.cur-item[data-id]'), function (item) {
      var app = byId[item.getAttribute('data-id')];
      var box = item.querySelector('.cur-stats');
      if (!app || !box) return;
      var wrap = item.querySelector('.app-icon-wrap');
      if (wrap) {
        var badge = wrap.querySelector('.app-badge');
        var fresh = CORE.isNew(app.added, today);
        if (badge && !fresh) badge.parentNode.removeChild(badge);
        else if (!badge && fresh) wrap.appendChild(el('span', 'app-badge', UI.newBadge || 'NEW'));
      }
      if (loading) return;
      box.innerHTML = '';
      var st = realStats(app.id);
      if (!st) { box.hidden = true; return; }
      box.hidden = false;
      box.removeAttribute('aria-hidden');
      var vis = el('span', 'cur-stats-vis');
      vis.setAttribute('aria-hidden', 'true');
      if (st.hearts > 0) vis.appendChild(el('span', 'c-hearts', CORE.compact(st.hearts, LANG)));
      if (st.avg != null) vis.appendChild(el('span', 'c-star', st.avg.toFixed(1)));
      if (st.plays > 0) vis.appendChild(el('span', 'c-plays', fmt(UI.plays, { n: CORE.compact(st.plays, LANG) })));
      box.appendChild(vis);
      box.appendChild(el('span', 'visually-hidden', srText(st)));
    });
  }

  // ---------------------------------------------------------------
  // 캐러셀: scroll-snap 이 스와이프를 맡고, 여기서는 점·화살표·현재 위치만 맞춘다
  // ---------------------------------------------------------------
  function initCarousel() {
    var track = document.getElementById('cur-track');
    if (!track) return;
    var items = track.querySelectorAll('.cur-item');
    var dots = document.querySelectorAll('.cur-dot');
    var arrows = document.querySelectorAll('.cur-arrow');
    if (!items.length) return;
    var behavior = reduceMotion ? 'auto' : 'smooth';

    function offsetOf(i) { return items[i].offsetLeft - items[0].offsetLeft; }
    function stepPx() { return items.length > 1 ? offsetOf(1) : track.clientWidth; }
    function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
    function current() {
      if (atEnd()) return items.length - 1;
      return Math.max(0, Math.min(items.length - 1, Math.round(track.scrollLeft / Math.max(1, stepPx()))));
    }
    function update() {
      var i = current();
      each(dots, function (d, k) {
        if (k === i) d.setAttribute('aria-current', 'true');
        else d.removeAttribute('aria-current');
      });
      each(arrows, function (b) {
        b.disabled = b.getAttribute('data-dir') === '-1' ? track.scrollLeft <= 4 : atEnd();
      });
    }
    var raf = 0;
    function onScroll() {
      if (raf) return;
      raf = window.requestAnimationFrame(function () { raf = 0; update(); });
    }
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    each(dots, function (d) {
      d.addEventListener('click', function () {
        track.scrollTo({ left: offsetOf(Number(d.getAttribute('data-i')) || 0), behavior: behavior });
      });
    });
    each(arrows, function (b) {
      b.addEventListener('click', function () {
        track.scrollBy({ left: Number(b.getAttribute('data-dir')) * stepPx(), behavior: behavior });
      });
    });
    track.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a.cur-card');
      if (a && a.parentNode) track_('hub_curation_click', a.parentNode.getAttribute('data-id'));
    });
    update();
  }

  // ---------------------------------------------------------------
  // 누적 참여 ("지금까지 N명이 참여했어요") — 0이면 숨김
  // ---------------------------------------------------------------
  function renderTotal() {
    var box = document.getElementById('hub-total');
    if (!box) return;
    var total = 0;
    if (stats) apps.forEach(function (a) { total += CORE.statOf(stats, a.id).plays; });
    if (!(total > 0)) { box.hidden = true; return; }
    // totalHtml 은 우리 언어 파일의 고정 HTML, {n} 자리에는 숫자 span 만 들어간다
    box.innerHTML = '<span class="live-dot" aria-hidden="true"></span><span>' +
      fmt(UI.totalHtml, { n: '<span class="total-n">' + CORE.num(total, LANG) + '</span>' }) + '</span>';
    box.hidden = false;
    // 숫자를 0부터 세어 올리지 않는다(중간값도 실제 숫자가 아니므로). 실제 값 그대로 한 번 나타나기만 한다.
    if (!reduceMotion) box.classList.add('is-in');
  }

  function track_(event, id) {
    try { if (window.track) window.track(event, { site: id }); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------
  // 이벤트
  // ---------------------------------------------------------------
  each(chips, function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-cat');
      if (c === state.cat) return;
      state.cat = c;
      saveState();
      renderGrid(true);
    });
  });
  if (sortEl) {
    sortEl.addEventListener('change', function () {
      if (SORTS.indexOf(sortEl.value) < 0) return;
      state.sort = sortEl.value;
      saveState();
      renderGrid(true);
    });
  }
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      state.q = searchEl.value;
      renderGrid(false);
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      state.cat = 'all';
      state.q = '';
      if (searchEl) searchEl.value = '';
      saveState();
      renderGrid(true);
      if (searchEl) searchEl.focus();
    });
  }
  grid.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a.tile-link');
    if (a && a.parentNode) track_('hub_card_click', a.parentNode.getAttribute('data-id'));
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = today.getFullYear();

  // ---------------------------------------------------------------
  // 참여 수·별점 불러오기. 너무 오래 걸리면(3.5초) 숫자 없이 먼저 보여 주고, 늦게 오면 그때 채운다.
  // supa.summary() 는 실패하면 null, 성공하면 { <id>: {...} } (데이터가 없으면 빈 객체).
  // ---------------------------------------------------------------
  function paint() {
    renderGrid(false);
    hydrateCuration();
    renderTotal();
  }
  function finish(map) {
    loading = false;
    stats = map;
    paint();
  }

  initCarousel();
  renderGrid(false); // 저장된 탭/정렬을 바로 반영 (스켈레톤 상태)
  hydrateCuration();

  var supa = window.supa;
  if (!supa || !supa.enabled || !supa.enabled()) {
    finish(null);
    return;
  }
  var settled = false;
  var timer = setTimeout(function () { if (!settled) { settled = true; finish(null); } }, 3500);
  supa.summary().then(function (map) {
    var known = map && typeof map === 'object' ? map : null;
    if (!settled) {
      settled = true;
      clearTimeout(timer);
      finish(known);
    } else if (known) {
      stats = known;
      paint();
    }
  }, function () {
    if (!settled) { settled = true; clearTimeout(timer); finish(null); }
  });
})();
