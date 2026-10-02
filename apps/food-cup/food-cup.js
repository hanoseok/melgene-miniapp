/* apps/food-cup/food-cup.js — 시작(티징) → 경기 15번(두 카드 + VS) → 끝 화면(우승 음식 + 나의 4강 + 공통 끝 화면)
 * 대진·서버 인코딩은 food-cup-core.js(FOODCUP_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 광고는 경기 화면 카드 아래 .mg-ad 한 자리 + 시작 화면 맨 아래 .mg-ad-start 한 자리(시작 화면이 보일 때만). 끝 화면은 공통 컴포넌트(data-mg-end)가 그린다.
 * 기록: 사용자가 시작을 누를 때 track('start') 한 번, 우승이 정해져 끝 화면에 닿을 때 track('done') 한 번(다시 하기마다 또).
 * 숫자 원칙: %는 supa.pollResults 로 받은 실제 합계로만 — 경기는 합계 ≥ 10, 우승은 합계 ≥ 20 일 때만 보인다.
 *   합계는 시작할 때 한 번 받아 둔다(내 표는 더하지 않는다 = "다른 사람들" 비율). 투표는 보내고 기다리지 않는다.
 *   같은 브라우저는 같은 대결을 한 번만, 우승도 한 번만 센다(localStorage fc_votes_v1).
 * 디버그/검사용 읽기 전용 핸들: window.FOODCUP_APP (game(), results(), votes())
 */
(function () {
  'use strict';

  var CORE = window.FOODCUP_CORE;
  var UI = window.PAGE_I18N || {};
  var P = UI.play || {};
  var R = UI.result || {};
  var NAMES = UI.foods || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var VOTES_KEY = 'fc_votes_v1';
  var RESULTS_TIMEOUT = 2500;
  var PICK_MS = REDUCED ? 180 : 430;     // 고른 카드 강조 시간
  var STAT_MS = REDUCED ? 900 : 1050;    // "N% 같은 선택" 을 보여 주는 시간

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    start: $('screen-start'), play: $('screen-play'), end: $('screen-end'),
    startBtn: $('start-btn'), round: $('round-label'), progress: $('progress'), bar: $('progress-bar'),
    arena: $('arena'), a: $('card-a'), b: $('card-b'), stat: $('pick-stat'),
    champEmoji: $('champ-emoji'), champName: $('champ-name'), champStat: $('champ-stat'), four: $('four'), year: $('year')
  };
  if (els.year) els.year.textContent = new Date().getFullYear();

  var game = null;
  var busy = false;      // 고른 뒤 다음 경기까지 입력 막기
  var doneSent = false;  // track('done') 은 한 판에 한 번
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; }); }
  function food(i) { return CORE.FOODS[i]; }
  function nameOf(i) { return NAMES[food(i).id] || food(i).id; }
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function show(name) {
    els.start.hidden = name !== 'start';
    els.play.hidden = name !== 'play';
    els.end.hidden = name !== 'end';
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- 서버 (합계 한 번 · 투표는 보내기만)
  function online() { return !!(window.supa && window.supa.enabled && window.supa.enabled()); }
  var votes = (function () {
    try { var v = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
  })();
  function remember(key) {
    votes[key] = 1;
    try { localStorage.setItem(VOTES_KEY, JSON.stringify(votes)); } catch (e) { /* noop */ }
  }
  var results = { map: null, at: 0, loading: null };
  function loadResults(force) {
    if (!online()) return Promise.resolve(null);
    if (results.loading) return results.loading;
    if (results.map && !force && Date.now() - results.at < 60000) return Promise.resolve(results.map);
    results.loading = new Promise(function (resolve) {
      var settled = false;
      var t = setTimeout(function () { if (!settled) { settled = true; resolve(null); } }, RESULTS_TIMEOUT);
      Promise.resolve(window.supa.pollResults(CORE.POLL)).then(function (rows) {
        if (settled) return;
        settled = true; clearTimeout(t);
        resolve(Array.isArray(rows) ? CORE.resultsMap(rows) : null);
      }, function () { if (!settled) { settled = true; clearTimeout(t); resolve(null); } });
    }).then(function (map) {
      results.loading = null;
      if (map) { results.map = map; results.at = Date.now(); }
      return map;
    });
    return results.loading;
  }
  function send(qid, opt, key) {
    if (!online() || votes[key] || !CORE.validVote(qid, opt)) return;
    remember(key);
    try { Promise.resolve(window.supa.vote(CORE.POLL, qid, opt)).catch(function () { /* noop */ }); } catch (e) { /* noop */ }
  }

  // ---------------------------------------------------------------- 경기
  function fillCard(el, i) {
    var f = food(i);
    el.querySelector('.fc-emoji').textContent = f.emoji;
    el.querySelector('.fc-plate').style.setProperty('--plate', f.plate);
    el.querySelector('.fc-name').textContent = nameOf(i);
    el.setAttribute('aria-label', fmt(P.pickAria, { food: nameOf(i) }));
    el.setAttribute('data-food', f.id);
    el.classList.remove('is-win', 'is-lose');
    el.disabled = false;
  }
  function renderMatch() {
    var c = CORE.current(game);
    if (!c) return;
    var round = P.rounds[c.round];
    els.round.textContent = c.matches > 1 ? fmt(P.roundFmt, { round: round, n: c.match, total: c.matches }) : round;
    els.round.setAttribute('data-round', c.round);
    var done = CORE.picks(game);
    els.bar.style.width = (done / CORE.TOTAL_MATCHES * 100) + '%';
    els.progress.setAttribute('aria-valuenow', String(done));
    els.progress.setAttribute('aria-label', fmt(P.progressAria, { n: c.overall, total: CORE.TOTAL_MATCHES }));
    fillCard(els.a, c.a);
    fillCard(els.b, c.b);
    els.stat.textContent = '';
    els.stat.classList.remove('is-on');
    els.arena.classList.remove('is-picked');
    if (!REDUCED) {
      els.arena.classList.remove('is-enter');
      void els.arena.offsetWidth; // 애니메이션 다시 시작
      els.arena.classList.add('is-enter');
    }
    busy = false;
  }
  function choose(side) {
    if (busy || !game || CORE.isDone(game)) return;
    busy = true;
    var c = CORE.current(game);
    var winner = side === 1 ? c.b : c.a;
    var winEl = side === 1 ? els.b : els.a;
    var loseEl = side === 1 ? els.a : els.b;
    winEl.classList.add('is-win');
    loseEl.classList.add('is-lose');
    els.arena.classList.add('is-picked');
    els.a.disabled = true; els.b.disabled = true;

    var qid = CORE.pairQid(c.a, c.b);
    var stat = CORE.pairStat(results.map, c.a, c.b, winner); // 내 표 넣기 전 = 다른 사람들
    send(qid, CORE.pairOpt(c.a, c.b, winner), qid);
    game = CORE.pick(game, winner, true);

    var wait = PICK_MS;
    if (stat) {
      later(function () {
        els.stat.textContent = fmt(P.same, { pct: stat.pct });
        els.stat.classList.add('is-on');
      }, REDUCED ? 0 : 220);
      wait = PICK_MS + STAT_MS;
    }
    later(function () {
      if (CORE.isDone(game)) finish();
      else renderMatch();
    }, wait);
  }

  // ---------------------------------------------------------------- 끝 화면
  function finish() {
    var champ = game.champion;
    var f = food(champ);
    els.champEmoji.textContent = f.emoji;
    els.champEmoji.parentNode.style.setProperty('--plate', f.plate);
    els.champName.textContent = nameOf(champ);
    var st = CORE.champStat(results.map, champ); // 내 표 넣기 전
    if (online() && results.map) { // 합계를 못 받았으면(꺼짐·오류) 아무 말도 하지 않는다
      els.champStat.hidden = false;
      els.champStat.textContent = st ? fmt(R.champPct, { pct: st.pct, food: nameOf(champ) }) : R.champFirst;
      els.champStat.classList.toggle('is-first', !st);
    } else {
      els.champStat.hidden = true;
      els.champStat.textContent = '';
    }
    send(CORE.champQid(champ), CORE.champOpt(champ), 'champ');
    // 나의 4강 (우승 → 준우승 → 4강 두 음식)
    var four = CORE.finalFour(game);
    var fin = CORE.finalists(game);
    var runner = fin[0] === champ ? fin[1] : fin[0];
    var order = [champ, runner].concat(four.filter(function (i) { return i !== champ && i !== runner; }));
    els.four.innerHTML = '';
    order.forEach(function (i, k) {
      var li = document.createElement('li');
      li.className = 'fc-chip' + (k === 0 ? ' is-champ' : '');
      var em = document.createElement('span');
      em.className = 'fc-chip-emoji';
      em.setAttribute('aria-hidden', 'true');
      em.textContent = food(i).emoji;
      em.style.setProperty('--plate', food(i).plate);
      var nm = document.createElement('span');
      nm.className = 'fc-chip-name';
      nm.textContent = nameOf(i);
      li.appendChild(em);
      li.appendChild(nm);
      els.four.appendChild(li);
    });
    show('end');
    if (!doneSent) { doneSent = true; track('done'); }
    track('fc_champion', { food: f.id });
  }

  // ---------------------------------------------------------------- 시작 · 다시 하기
  function start() {
    clearTimers();
    game = CORE.newGame();
    doneSent = false;
    track('start');
    loadResults(false);
    renderMatch();
    show('play');
  }

  els.startBtn.addEventListener('click', start);
  els.a.addEventListener('click', function () { choose(0); });
  els.b.addEventListener('click', function () { choose(1); });
  document.addEventListener('keydown', function (e) {
    if (els.play.hidden || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowLeft') { choose(0); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { choose(1); e.preventDefault(); }
  });

  if (window.setShareData) {
    window.setShareData(function () {
      var champ = game && CORE.isDone(game) ? game.champion : null;
      return {
        title: R.shareTitle,
        text: champ != null ? fmt(R.shareText, { emoji: food(champ).emoji, food: nameOf(champ) }) : R.shareTitle,
        url: window.mgCleanUrl ? window.mgCleanUrl() : window.location.href.split('#')[0]
      };
    });
  }
  if (window.setRetry) window.setRetry({ label: R.retry, action: start });

  // 합계는 페이지를 열 때 미리 받아 둔다(첫 경기부터 % 가 보이게)
  loadResults(false);
  window.FOODCUP_APP = {
    game: function () { return game && CORE.copy(game); },
    results: function () { return results.map; },
    votes: function () { return JSON.parse(JSON.stringify(votes)); }
  };
  show('start');
})();
