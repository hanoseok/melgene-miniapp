/* apps/team/team.js — 시작(티징) → 이름 입력 → 섞기(카드가 팀 상자로 날아가는 약 1.5초 애니메이션) → 팀 결과 + 공통 끝 화면
 * 섞기·팀 수·공유 인코딩은 team-core.js(TEAM_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 입력 화면 섞기 버튼 아래 .mg-ad 한 자리뿐(시작 화면에는 없음). 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 섞기를 누를 때 track('start') 한 번, 결과가 다 보일 때 track('done') 한 번(다시 섞기마다 또). 공유 링크로 연 결과는 세지 않는다.
 * 숫자: 서버 숫자는 쓰지 않는다(보이는 숫자는 입력한 사람 수·팀 수뿐).
 * 저장: 마지막 이름 목록·나누기 방식은 이 브라우저 localStorage(team_last_v1)에만. 공유 링크 #d= 는 이름·팀을 링크 안에 담는다(서버 저장 없음).
 * 디버그/검사용 읽기 전용 핸들: window.TEAM_APP (result(), shared(), text(), shareUrl(), busy())
 */
(function () {
  'use strict';

  var CORE = window.TEAM_CORE;
  var UI = window.PAGE_I18N || {};
  var I = UI.input || {};
  var R = UI.result || {};
  var NAMES = UI.teams || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LS_KEY = 'team_last_v1';
  var ANIM_MS = 1500;     // 섞기 애니메이션 전체 길이(대략)
  var FLY_MS = 520;       // 카드 한 장이 날아가는 시간

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), input: $('screen-input'), result: $('screen-result'),
    startBtn: $('start-btn'), names: $('names'), count: $('people-count'), warn: $('names-warn'),
    sample: $('sample-btn'), clear: $('clear-btn'),
    modeTeams: $('mode-teams'), modeSize: $('mode-size'), minus: $('step-minus'), plus: $('step-plus'), num: $('step-num'),
    preview: $('preview'), leaders: $('leaders'), leadersNote: $('leaders-note'), shuffle: $('shuffle-btn'),
    sharedNote: $('shared-note'), title: $('result-title'), deck: $('deck'), teams: $('teams'),
    actions: $('result-actions'), rename: $('rename-btn'), again: $('again-btn'), edit: $('edit-btn'),
    makeOwn: $('make-own-btn'), copy: $('copy-btn'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var state = { mode: 'teams', value: { teams: 2, size: 3 }, leaders: false };
  var parsed = { people: [], dropped: 0 };
  var result = null;     // { people, leaders, teams, animals }
  var shared = false;    // 공유 링크로 연 결과
  var busy = false;      // 애니메이션 중
  var doneSent = false;
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 사생활 보호 모드 등 */ } }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function toast(m) { if (window.toast) window.toast(m); }
  var plural = null;
  try { plural = new Intl.PluralRules(UI.lang || 'en'); } catch (e) { /* noop */ }
  function peopleText(n) {
    var P = UI.people || {};
    var cat = plural ? plural.select(n) : (n === 1 ? 'one' : 'other');
    return fmt(P[cat] || P.other, { n: n });
  }
  function teamOf(a) { return CORE.TEAMS[a]; }
  function teamName(a) { return NAMES[teamOf(a).id] || teamOf(a).id; }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.input.hidden = name !== 'input';
    els.result.hidden = name !== 'result';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 저장
  function save() {
    lsSet(LS_KEY, JSON.stringify({ text: els.names.value, mode: state.mode, value: state.value, leaders: state.leaders }));
  }
  var saveTimer = null;
  function saveSoon() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 250); }
  function load() {
    try {
      var s = JSON.parse(lsGet(LS_KEY) || 'null');
      if (!s || typeof s !== 'object') return;
      if (typeof s.text === 'string') els.names.value = s.text.slice(0, 4000);
      if (s.mode === 'teams' || s.mode === 'size') state.mode = s.mode;
      if (s.value && typeof s.value === 'object') {
        if (s.value.teams > 0) state.value.teams = Number(s.value.teams) | 0;
        if (s.value.size > 0) state.value.size = Number(s.value.size) | 0;
      }
      state.leaders = !!s.leaders;
    } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 입력 화면
  function rangeNow(n) { return state.mode === 'size' ? CORE.sizeRange(n) : CORE.teamRange(n); }
  function refresh() {
    parsed = CORE.parseNames(els.names.value);
    var n = parsed.people.length;
    var nn = Math.max(n, CORE.MIN_TEAMS);
    var r = rangeNow(nn);
    var v = CORE.clamp(state.value[state.mode], r);
    els.num.textContent = String(v);
    els.minus.disabled = n < 2 || v <= r.min;
    els.plus.disabled = n < 2 || v >= r.max;
    els.modeTeams.setAttribute('aria-checked', String(state.mode === 'teams'));
    els.modeSize.setAttribute('aria-checked', String(state.mode === 'size'));
    els.count.textContent = peopleText(n);
    var warn = '';
    if (parsed.dropped) warn = fmt(I.tooMany, { max: CORE.MAX_NAMES });
    else if (n < 2 && els.names.value.trim()) warn = I.needMore;
    els.warn.textContent = warn;
    els.warn.hidden = !warn;
    if (n >= 2) {
      var k = CORE.teamCount(n, state.mode, v);
      var sizes = CORE.sizesFor(n, k);
      var mn = sizes[sizes.length - 1];
      var mx = sizes[0];
      els.preview.textContent = mn === mx ? fmt(I.previewEq, { k: k, size: mx }) : fmt(I.previewRange, { k: k, min: mn, max: mx });
    } else {
      els.preview.textContent = I.needMore;
    }
    var leads = parsed.people.filter(function (p) { return p.leader; }).length;
    els.leaders.checked = state.leaders;
    els.leadersNote.textContent = leads ? fmt(I.leadersCount, { n: leads }) : I.leadersNone;
    els.shuffle.disabled = n < 2;
  }
  function step(d) {
    var n = Math.max(parsed.people.length, CORE.MIN_TEAMS);
    var r = rangeNow(n);
    state.value[state.mode] = CORE.clamp(CORE.clamp(state.value[state.mode], r) + d, r);
    refresh();
    saveSoon();
  }
  function setMode(m) {
    if (state.mode === m) return;
    // 방식을 바꿔도 지금 팀 수가 유지되도록 다른 쪽 값을 맞춘다
    var n = parsed.people.length;
    if (n >= 2) {
      var k = CORE.teamCount(n, state.mode, state.value[state.mode]);
      if (m === 'size') state.value.size = CORE.clamp(Math.ceil(n / k), CORE.sizeRange(n));
      else state.value.teams = k;
    }
    state.mode = m;
    refresh();
    saveSoon();
  }

  // ---------------------------------------------------------------- 결과 그리기
  function renderTeams(animate) {
    var r = result;
    els.teams.innerHTML = '';
    var chips = [];
    r.teams.forEach(function (members, t) {
      var a = r.animals[t];
      var box = document.createElement('section');
      box.className = 'tm-team';
      box.style.setProperty('--team', teamOf(a).color);
      box.setAttribute('data-team', teamOf(a).id);
      var h = document.createElement('h3');
      h.className = 'tm-team-head';
      var em = document.createElement('span');
      em.className = 'tm-team-emoji';
      em.setAttribute('aria-hidden', 'true');
      em.textContent = teamOf(a).emoji;
      var nm = document.createElement('span');
      nm.className = 'tm-team-name';
      nm.textContent = teamName(a);
      var ct = document.createElement('span');
      ct.className = 'tm-team-count';
      ct.textContent = String(members.length);
      ct.setAttribute('aria-label', peopleText(members.length));
      h.appendChild(em); h.appendChild(nm); h.appendChild(ct);
      box.appendChild(h);
      var ul = document.createElement('ul');
      ul.className = 'tm-members';
      members.forEach(function (i, m) {
        var p = r.people[i];
        var li = document.createElement('li');
        li.className = 'tm-chip' + (r.leaders && p.leader ? ' is-lead' : '');
        if (r.leaders && p.leader) {
          var star = document.createElement('span');
          star.className = 'tm-star';
          star.textContent = '★';
          star.setAttribute('title', R.captain);
          star.setAttribute('aria-label', R.captain);
          li.appendChild(star);
        }
        var s = document.createElement('span');
        s.className = 'tm-chip-name';
        s.textContent = p.name;
        li.appendChild(s);
        ul.appendChild(li);
        chips.push({ el: li, team: t, pos: m });
      });
      box.appendChild(ul);
      els.teams.appendChild(box);
    });
    if (!animate || REDUCED || !els.teams.animate) { els.deck.hidden = true; return 0; }
    // 카드 돌리듯: 1번 팀 첫 사람, 2번 팀 첫 사람 … 순서로 덱(주사위)에서 날아간다
    chips.sort(function (x, y) { return x.pos - y.pos || x.team - y.team; });
    els.deck.hidden = false;
    var d = els.deck.getBoundingClientRect();
    var cx = d.left + d.width / 2;
    var cy = d.top + d.height / 2;
    var stepMs = chips.length > 1 ? Math.min(90, (ANIM_MS - FLY_MS) / (chips.length - 1)) : 0;
    Array.prototype.forEach.call(els.teams.children, function (box, t) {
      box.animate([{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'none' }], { duration: 260, delay: t * 40, easing: 'ease-out', fill: 'backwards' });
    });
    chips.forEach(function (c, k) {
      var b = c.el.getBoundingClientRect();
      var dx = cx - (b.left + b.width / 2);
      var dy = cy - (b.top + b.height / 2);
      var rot = (k % 2 ? 1 : -1) * (8 + (k * 7) % 14);
      c.el.animate([
        { transform: 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg) scale(.55)', opacity: 0 },
        { opacity: 1, offset: 0.18 },
        { transform: 'none', opacity: 1 }
      ], { duration: FLY_MS, delay: 120 + k * stepMs, easing: 'cubic-bezier(.2,.8,.25,1)', fill: 'backwards' });
    });
    return 120 + (chips.length - 1) * stepMs + FLY_MS;
  }

  function setBusy(b) {
    busy = b;
    [els.rename, els.again, els.edit, els.copy, els.makeOwn].forEach(function (e) { e.disabled = b; });
    els.result.classList.toggle('is-shuffling', b);
  }

  function showResult(animate) {
    clearTimers();
    els.title.textContent = shared ? R.sharedTitle : R.title;
    els.sharedNote.hidden = !shared;
    els.actions.hidden = shared;
    els.makeOwn.hidden = !shared;
    if (window.setRetry) window.setRetry(shared ? { label: R.makeOwn, action: makeOwn } : { label: R.again, action: again });
    show('result');
    setBusy(true);
    var ms = renderTeams(animate);
    later(function () {
      els.deck.hidden = true;
      setBusy(false);
      if (!shared && !doneSent) { doneSent = true; track('done'); }
    }, ms);
  }

  // ---------------------------------------------------------------- 섞기
  function shuffleNow() {
    refresh();
    var n = parsed.people.length;
    if (n < 2 || busy) return;
    var k = CORE.teamCount(n, state.mode, state.value[state.mode]);
    var t = CORE.makeTeams(parsed.people, k, state.leaders);
    if (!t) return;
    result = { people: parsed.people.map(function (p) { return { name: p.name, leader: p.leader }; }), leaders: state.leaders, teams: t.teams, animals: t.animals };
    shared = false;
    doneSent = false;
    clearHash();
    save();
    track('start');
    showResult(true);
  }
  function again() {
    if (busy) return;
    if (shared || !result) { makeOwn(); return; }
    var k = result.teams.length;
    var t = CORE.makeTeams(result.people, k, result.leaders);
    result = { people: result.people, leaders: result.leaders, teams: t.teams, animals: t.animals };
    doneSent = false;
    track('start');
    showResult(true);
  }
  function rename() {
    if (busy || !result) return;
    var prev = result.animals.join();
    var next;
    for (var i = 0; i < 5; i++) { next = CORE.pickAnimals(result.teams.length); if (next.join() !== prev) break; }
    result.animals = next;
    renderTeams(false);
    if (!REDUCED && els.teams.animate) {
      Array.prototype.forEach.call(els.teams.querySelectorAll('.tm-team-head'), function (h, k) {
        h.animate([{ transform: 'rotateX(90deg)' }, { transform: 'none' }], { duration: 320, delay: k * 50, easing: 'ease-out', fill: 'backwards' });
      });
    }
  }
  function edit() {
    if (busy) return;
    clearHash();
    refresh();
    show('input');
  }
  function makeOwn() {
    shared = false;
    result = null;
    clearHash();
    refresh();
    show('input');
    try { els.names.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 공유 · 복사
  function baseUrl() {
    var u = window.location.href.split('#')[0];
    return window.mgCleanUrl ? window.mgCleanUrl(u) : u;
  }
  function shareUrl() {
    var code = result ? CORE.encodeShare(result) : null;
    return baseUrl() + (code ? '#d=' + code : '');
  }
  function clearHash() {
    if (!/^#d=/.test(window.location.hash)) return;
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
  }
  function asText() {
    if (!result) return '';
    var blocks = result.teams.map(function (members, t) {
      var a = result.animals[t];
      var lines = [teamOf(a).emoji + ' ' + teamName(a) + ' (' + members.length + ')'];
      members.forEach(function (i) {
        var p = result.people[i];
        lines.push((result.leaders && p.leader ? '★ ' : '- ') + p.name);
      });
      return lines.join('\n');
    });
    return blocks.join('\n\n') + '\n\n' + shareUrl();
  }
  function copyText(text) {
    var done = function () { toast(R.copied); };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* noop */ }
      document.body.removeChild(ta);
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  if (window.setShareData) {
    window.setShareData(function () {
      return {
        title: R.shareTitle,
        text: result ? fmt(R.shareText, { k: result.teams.length }) : R.shareTitle,
        url: shareUrl()
      };
    });
  }

  // ---------------------------------------------------------------- 이벤트
  els.startBtn.addEventListener('click', function () { refresh(); show('input'); });
  els.names.addEventListener('input', function () { refresh(); saveSoon(); });
  els.names.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); shuffleNow(); }
  });
  els.sample.addEventListener('click', function () {
    els.names.value = (UI.sample || []).join('\n');
    refresh(); save();
  });
  els.clear.addEventListener('click', function () {
    els.names.value = '';
    refresh(); save();
    els.names.focus();
  });
  els.modeTeams.addEventListener('click', function () { setMode('teams'); });
  els.modeSize.addEventListener('click', function () { setMode('size'); });
  els.minus.addEventListener('click', function () { step(-1); });
  els.plus.addEventListener('click', function () { step(1); });
  els.leaders.addEventListener('change', function () { state.leaders = els.leaders.checked; refresh(); saveSoon(); });
  els.shuffle.addEventListener('click', shuffleNow);
  els.rename.addEventListener('click', rename);
  els.again.addEventListener('click', again);
  els.edit.addEventListener('click', edit);
  els.makeOwn.addEventListener('click', makeOwn);
  els.copy.addEventListener('click', function () { if (result) copyText(asText()); });

  // ---------------------------------------------------------------- 시작: 공유 링크(#d=) → 결과, 아니면 시작 화면
  load();
  refresh();
  window.TEAM_APP = {
    result: function () { return result && JSON.parse(JSON.stringify(result)); },
    shared: function () { return shared; },
    busy: function () { return busy; },
    text: asText,
    shareUrl: shareUrl
  };
  function openShared() {
    var h = window.location.hash || '';
    if (!/^#d=/.test(h)) return false;
    var r = CORE.decodeShare(h.slice(3));
    if (r) {
      result = r;
      shared = true;
      showResult(false);
      return true;
    }
    clearHash();
    setTimeout(function () { toast(R.badShare); }, 400);
    return false;
  }
  // 같은 탭에서 다른 공유 링크를 붙여 넣은 경우
  window.addEventListener('hashchange', function () { if (!busy) openShared(); });
  if (!openShared()) show('start');
})();
