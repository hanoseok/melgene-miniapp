/* apps/ballot/ballot.js — 비밀 투표: 시작 화면(템플릿·이름 목록·질문·인원) → 휴대폰 돌리기(가림 → 투표용지 → 저장됨, 반복) → 한 질문씩 발표 → 최종 결과 → 공통 끝 화면
 * 로직은 ballot-core.js(BALLOT_CORE, 언어 무관), 문구는 페이지에 인라인된 PAGE_I18N(언어별).
 * 비밀: 표 한 장은 표 수(counts)에 더해지고 곧바로 투표용지 DOM 째 지워진다. 누가 무엇을 골랐는지는 메모리·저장소 어디에도 남지 않는다.
 *   투표 중에는 표 수를 화면에 보여주지 않는다(진행 줄은 "몇 번째 사람"만).
 * 발표: 질문마다 두구두구(3·2·1) 뒤 1등과 막대. 움직임 줄이기면 바로. 동점이면 "공정하게 동점 깨기"(crypto 거부 샘플링, 추첨이라고 표시).
 * 결과 링크 #d=: 최종 표 수만(CORE.encodeResult). 링크로 연 사람은 공유 결과 화면(#screen-shared)만 보고 start/done 을 세지 않는다.
 * 저장(localStorage, try/catch): 초안 mg_ballot_v1(템플릿·이름·질문·인원), 진행 mg_ballot_run_v1(질문·표 수·투표한 수·동점 깨기·단계) — 새로고침해도 이어 하기.
 * 기록: 투표를 시작할 때(startVoting) track('start') 한 번, 최종 결과가 보일 때(showSummary) track('done') 한 번. 서버로 보내는 것 없음.
 * 디버그/검사용 읽기 전용 핸들: window.BALLOT_APP
 */
(function () {
  'use strict';

  var CORE = window.BALLOT_CORE;
  var I = window.PAGE_I18N || {};
  var U = I.ui || {};
  var R = I.result || {};
  var PRESETS = Array.isArray(U.presets) ? U.presets : [];
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STORE = 'mg_ballot_v1';
  var RUN = 'mg_ballot_run_v1';
  var DRUM_STEP = 650;

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    setup: $('screen-setup'), vote: $('screen-vote'), result: $('screen-result'), shared: $('screen-shared'),
    resumeBox: $('resume-box'), resumeText: $('resume-text'), resumeBtn: $('resume-btn'), discardBtn: $('discard-btn'),
    form: $('bl-form'), people: $('people'), questions: $('questions'), addQ: $('add-q'),
    votersLess: $('voters-less'), votersMore: $('voters-more'), votersValue: $('voters-value'), error: $('form-error'), start: $('start-btn'),
    progressText: $('progress-text'), progressFill: $('progress-fill'),
    cover: $('stage-cover'), coverTitle: $('cover-title'), ready: $('ready-btn'),
    ballot: $('stage-ballot'), ballotQs: $('ballot-qs'), cast: $('cast-btn'), castNeed: $('cast-need'),
    saved: $('stage-saved'), next: $('next-btn'), allin: $('stage-allin'), allinTitle: $('allin-title'), revealBtn: $('reveal-btn'),
    host: $('host-tools'), finish: $('finish-btn'), cancel: $('cancel-btn'), live: $('live'),
    reveal: $('reveal'), revealStep: $('reveal-step'), revealCard: $('reveal-card'), revealNext: $('reveal-next'), revealAll: $('reveal-all'),
    summary: $('summary'), sumSub: $('sum-sub'), sumCards: $('sum-cards'), copyText: $('copy-text'), copyLink: $('copy-link'), shareLink: $('share-link'), edit: $('edit-btn'),
    sharedSub: $('shared-sub'), sharedCards: $('shared-cards'), sharedBad: $('shared-bad'), sharedTitle: $('shared-title'), makeOwn: $('make-own'),
    year: $('year')
  };
  var presetBtns = Array.prototype.slice.call(document.querySelectorAll('.bl-preset'));
  if (els.year) els.year.textContent = new Date().getFullYear();

  var draft = null;          // { preset, people(문자열), questions:[{ t, people, o(문자열) }], voters, votersTouched }
  var session = null;        // CORE.createSession(...) — 표 수만
  var run = null;            // { phase: 'voting'|'results', done: bool }
  var stage = 'setup';       // setup | cover | ballot | saved | allin | reveal | summary | shared
  var revealIdx = 0;
  var timers = [];

  function track(ev, p) { try { if (window.track) window.track(ev, p || {}); } catch (e) { /* noop */ } }
  function fmt(tpl, vars) { return String(tpl || '').replace(/\{(\w+)\}/g, function (m, key) { return vars[key] != null ? vars[key] : m; }); }
  function vibrate(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* noop */ } }
  function later(fn, ms) { var id = setTimeout(fn, ms); timers.push(id); return id; }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function say(msg) { if (!els.live) return; els.live.textContent = ''; later(function () { els.live.textContent = msg; }, 30); }

  // ---------------------------------------------------------------- 저장 (localStorage, 실패해도 동작)
  function readJson(key) {
    try { return JSON.parse(window.localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function writeJson(key, val) {
    try { window.localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* noop */ }
  }
  function dropKey(key) {
    try { window.localStorage.removeItem(key); } catch (e) { /* noop */ }
  }
  function presetQuestions(id) {
    var p = PRESETS.filter(function (x) { return x.id === id; })[0] || PRESETS[0];
    return (p ? p.questions : [{ t: '', o: [] }]).map(function (q) { return { t: q.t || '', people: !!q.people, o: (q.o || []).join('\n') }; });
  }
  function loadDraft() {
    var o = readJson(STORE);
    if (o && typeof o === 'object' && Array.isArray(o.questions) && o.questions.length) {
      return {
        preset: typeof o.preset === 'string' ? o.preset : '',
        people: typeof o.people === 'string' ? o.people.slice(0, 2000) : '',
        questions: o.questions.slice(0, CORE.MAX_Q).map(function (q) {
          q = q && typeof q === 'object' ? q : {};
          return { t: String(q.t || '').slice(0, CORE.MAX_TITLE), people: !!q.people, o: String(q.o || '').slice(0, 2000) };
        }),
        voters: CORE.normalizeDraft({ voters: o.voters }).voters,
        votersTouched: !!o.votersTouched
      };
    }
    var first = PRESETS[0] ? PRESETS[0].id : '';
    return { preset: first, people: '', questions: presetQuestions(first), voters: 6, votersTouched: false };
  }
  function saveDraft() { writeJson(STORE, draft); }
  function saveRun() {
    if (!session || !run) { dropKey(RUN); return; }
    writeJson(RUN, { phase: run.phase, done: !!run.done, qs: session.qs, voters: session.voters, cast: session.cast, counts: session.counts, tb: session.tb });
  }
  function loadRun() {
    var o = readJson(RUN);
    if (!o || (o.phase !== 'voting' && o.phase !== 'results')) return null;
    var s = CORE.sanitizeSession(o);
    if (!s || (o.phase === 'results' && s.cast < 1)) return null;
    return { session: s, run: { phase: o.phase, done: !!o.done } };
  }

  // ---------------------------------------------------------------- 화면 전환
  function show(screen) {
    els.setup.hidden = screen !== 'setup';
    els.vote.hidden = screen !== 'vote';
    els.result.hidden = screen !== 'result';
    els.shared.hidden = screen !== 'shared';
  }
  function toTop() { try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); } }

  // ---------------------------------------------------------------- 시작 화면
  function renderPresets() {
    presetBtns.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-preset') === draft.preset)); });
  }
  function renderVoters() {
    els.votersValue.textContent = fmt(U.votersValue, { n: draft.voters });
    els.votersLess.disabled = draft.voters <= CORE.MIN_VOTERS;
    els.votersMore.disabled = draft.voters >= CORE.MAX_VOTERS;
  }
  function autoVoters() {
    if (draft.votersTouched) return;
    var n = CORE.cleanList(draft.people).length;
    if (n >= CORE.MIN_VOTERS && draft.questions.some(function (q) { return q.people; })) {
      draft.voters = Math.min(CORE.MAX_VOTERS, n);
      renderVoters();
    }
  }
  function renderQuestions() {
    els.questions.textContent = '';
    draft.questions.forEach(function (q, i) {
      var box = el('fieldset', 'bl-q');
      var head = el('div', 'bl-q-head');
      var lg = el('legend', 'bl-q-label', fmt(U.qLabel, { i: i + 1 }));
      box.appendChild(lg);
      if (draft.questions.length > 1) {
        var rm = el('button', 'bl-mini bl-q-remove', U.removeQ);
        rm.type = 'button';
        rm.setAttribute('aria-label', U.removeQ + ' — ' + fmt(U.qLabel, { i: i + 1 }));
        rm.addEventListener('click', function () { draft.questions.splice(i, 1); draft.preset = ''; onDraftChange(true); });
        head.appendChild(rm);
        box.appendChild(head);
      }
      var title = el('input', 'bl-input bl-q-title');
      title.type = 'text';
      title.maxLength = CORE.MAX_TITLE;
      title.value = q.t;
      title.placeholder = U.qTitlePh;
      title.setAttribute('aria-label', fmt(U.qLabel, { i: i + 1 }));
      title.addEventListener('input', function () { q.t = title.value; saveDraft(); });
      box.appendChild(title);

      var tg = el('label', 'bl-toggle');
      var cb = el('input');
      cb.type = 'checkbox';
      cb.checked = q.people;
      cb.className = 'bl-q-people';
      tg.appendChild(cb);
      tg.appendChild(el('span', null, U.usePeople));
      box.appendChild(tg);

      var area = el('textarea', 'bl-input bl-area bl-q-opts');
      area.rows = 4;
      area.value = q.o;
      area.placeholder = U.optionsPh;
      area.spellcheck = false;
      area.setAttribute('aria-label', fmt(U.qLabel, { i: i + 1 }) + ' — ' + U.optionsLabel);
      area.hidden = q.people;
      area.addEventListener('input', function () { q.o = area.value; saveDraft(); });
      box.appendChild(area);
      cb.addEventListener('change', function () { q.people = cb.checked; area.hidden = q.people; autoVoters(); saveDraft(); });
      els.questions.appendChild(box);
    });
    els.addQ.hidden = draft.questions.length >= CORE.MAX_Q;
  }
  function onDraftChange(rerender) {
    if (rerender) renderQuestions();
    renderPresets();
    autoVoters();
    renderVoters();
    els.error.hidden = true;
    saveDraft();
  }
  function applyPreset(id) {
    draft.preset = id;
    draft.questions = presetQuestions(id);
    onDraftChange(true);
  }
  function errorText(e) {
    if (e.code === 'people') return U.errPeople;
    if (e.code === 'peopleMany') return U.errPeopleMany;
    if (e.code === 'few') return fmt(U.errFew, { i: e.q });
    return fmt(U.errMany, { i: e.q });
  }

  // ---------------------------------------------------------------- 투표
  function startVoting() {
    var v = CORE.validate({ people: draft.people, voters: draft.voters, questions: draft.questions });
    if (!v.ok) {
      show('setup');
      els.error.textContent = v.errors.map(errorText).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' ');
      els.error.hidden = false;
      els.error.scrollIntoView({ block: 'center' });
      return;
    }
    var qs = v.qs.map(function (q, i) { return { t: q.t || fmt(U.qDefault, { i: i + 1 }), o: q.o }; });
    session = CORE.createSession(qs, v.voters);
    run = { phase: 'voting', done: false };
    saveRun();
    track('start');
    els.resumeBox.hidden = true;
    show('vote');
    toTop();
    showStage(CORE.isComplete(session) ? 'allin' : 'cover');
  }
  function renderProgress() {
    var i = Math.min(session.cast + 1, session.voters);
    els.progressText.textContent = stage === 'allin' ? fmt(U.progress, { i: session.cast, n: session.voters }) : fmt(U.progress, { i: i, n: session.voters });
    els.progressFill.style.width = Math.round((session.cast * 100) / session.voters) + '%';
  }
  function showStage(s) {
    stage = s;
    els.cover.hidden = s !== 'cover';
    els.ballot.hidden = s !== 'ballot';
    els.saved.hidden = s !== 'saved';
    els.allin.hidden = s !== 'allin';
    els.host.hidden = s === 'ballot';
    els.finish.hidden = s === 'allin';
    els.finish.disabled = session.cast < 1;
    if (s !== 'ballot') els.ballotQs.textContent = '';
    if (s === 'cover') els.coverTitle.textContent = fmt(U.coverTitle, { i: session.cast + 1 });
    if (s === 'allin') els.allinTitle.textContent = fmt(U.allInTitle, { n: session.cast });
    renderProgress();
    var focus = { cover: els.ready, saved: els.next, allin: els.revealBtn }[s];
    if (focus) try { focus.focus({ preventScroll: true }); } catch (e) { /* noop */ }
  }
  function buildBallot() {
    els.ballotQs.textContent = '';
    session.qs.forEach(function (q, qi) {
      var fs = el('fieldset', 'bl-card bl-bq');
      fs.appendChild(el('legend', 'bl-bq-title', q.t));
      var grid = el('div', 'bl-opts');
      q.o.forEach(function (name, oi) {
        var lab = el('label', 'bl-opt');
        var r = el('input');
        r.type = 'radio';
        r.name = 'q' + qi;
        r.value = String(oi);
        r.addEventListener('change', updateCast);
        lab.appendChild(r);
        lab.appendChild(el('span', 'bl-opt-name', name));
        grid.appendChild(lab);
      });
      fs.appendChild(grid);
      els.ballotQs.appendChild(fs);
    });
    updateCast();
  }
  function readPicks() {
    return session.qs.map(function (_, qi) {
      var c = els.ballot.querySelector('input[name="q' + qi + '"]:checked');
      return c ? parseInt(c.value, 10) : -1;
    });
  }
  function updateCast() {
    var ok = CORE.validPicks(session, readPicks());
    els.cast.disabled = !ok;
    els.castNeed.hidden = ok;
  }
  function castNow() {
    var picks = readPicks();
    if (!CORE.castBallot(session, picks)) return;
    picks = null;
    els.ballotQs.textContent = '';   // 고른 흔적을 화면에서 바로 지운다
    els.ballot.reset();
    saveRun();
    vibrate(30);
    say(U.liveSaved);
    toTop();
    showStage(CORE.isComplete(session) ? 'allin' : 'saved');
  }
  function cancelVote() {
    clearTimers();
    session = null; run = null;
    dropKey(RUN);
    stage = 'setup';
    show('setup');
    toTop();
  }

  // ---------------------------------------------------------------- 발표·결과
  function dataOf(qi) { return { t: session.qs[qi].t, o: session.qs[qi].o, c: session.counts[qi], b: session.tb[qi] }; }
  function namesOf(d, idx) { return idx.map(function (i) { return d.o[i]; }).join(', '); }

  // 질문 하나의 결과 카드. opts: { suspense, canBreak, qi }
  function buildCard(d, opts) {
    opts = opts || {};
    var t = CORE.tally(d.c);
    var win = CORE.winnerOf(d.c, d.b);
    var card = el('article', 'bl-card bl-cat');
    card.appendChild(el('h3', 'bl-cat-title', d.t));
    var top = el('div', 'bl-top');
    if (t.tie && win < 0) {
      top.appendChild(el('p', 'bl-winner bl-tie', R.tie));
      top.appendChild(el('p', 'bl-tie-names', fmt(R.tieBetween, { names: namesOf(d, t.leaders) })));
      if (opts.canBreak) {
        var tb = el('button', 'bl-btn bl-btn-go bl-tie-btn', R.tieBreak);
        tb.type = 'button';
        tb.addEventListener('click', function () { breakTie(opts.qi, card, opts); });
        top.appendChild(tb);
      }
    } else if (win >= 0) {
      top.appendChild(el('p', 'bl-winner', fmt(R.winner, { name: d.o[win] })));
      if (t.tie) {
        top.appendChild(el('p', 'bl-tie-names', fmt(R.tieBetween, { names: namesOf(d, t.leaders) })));
        top.appendChild(el('p', 'bl-drawn', fmt(R.tieBroken, { name: d.o[win] })));
        top.appendChild(el('p', 'bl-note', R.tieNote));
      }
    }
    card.appendChild(top);
    var list = el('ol', 'bl-bars');
    t.order.forEach(function (oi) {
      var li = el('li', 'bl-bar' + (oi === win || (win < 0 && t.leaders.indexOf(oi) >= 0) ? ' is-win' : ''));
      var row = el('div', 'bl-bar-row');
      row.appendChild(el('span', 'bl-bar-name', d.o[oi]));
      row.appendChild(el('span', 'bl-bar-count', fmt(R.bar, { c: d.c[oi], p: CORE.percent(d.c[oi], t.total) })));
      li.appendChild(row);
      var barTrack = el('div', 'bl-bar-track');
      var fill = el('span', 'bl-bar-fill');
      var w = t.max > 0 ? Math.round((d.c[oi] * 100) / t.max) : 0;
      fill.style.width = (opts.suspense && !REDUCED ? 0 : w) + '%';
      fill.setAttribute('data-w', String(w));
      barTrack.appendChild(fill);
      li.appendChild(barTrack);
      list.appendChild(li);
    });
    card.appendChild(list);
    return card;
  }
  function growBars(card) {
    Array.prototype.forEach.call(card.querySelectorAll('.bl-bar-fill'), function (f) { f.style.width = f.getAttribute('data-w') + '%'; });
  }
  function breakTie(qi, card, opts) {
    var btn = card.querySelector('.bl-tie-btn');
    if (btn) btn.disabled = true;
    var t = CORE.tally(session.counts[qi]);
    CORE.resolveTie(session, qi);
    saveRun();
    var settle = function () {
      var fresh = buildCard(dataOf(qi), { canBreak: opts.canBreak, qi: qi });
      card.replaceWith(fresh);
      fresh.classList.add('is-pop');
      vibrate([40, 30, 90]);
      say(fmt(R.tieBroken, { name: session.qs[qi].o[session.tb[qi]] }));
    };
    if (REDUCED) { settle(); return; }
    // 동점 후보들을 잠깐 번갈아 비춘다(결과는 이미 정해짐, 연출만)
    var rows = Array.prototype.slice.call(card.querySelectorAll('.bl-bar')).filter(function (li, k) { return t.leaders.indexOf(t.order[k]) >= 0; });
    var k = 0;
    var spin = function () {
      rows.forEach(function (r, j) { r.classList.toggle('is-flash', j === k % rows.length); });
      k++;
      if (k < 9) later(spin, 110);
      else settle();
    };
    spin();
  }
  function startReveal() {
    clearTimers();
    run.phase = 'results';
    saveRun();
    show('result');
    toTop();
    els.summary.hidden = true;
    els.reveal.hidden = false;
    showReveal(0);
  }
  function showReveal(i) {
    clearTimers();
    stage = 'reveal';
    revealIdx = i;
    var last = i >= session.qs.length - 1;
    els.revealStep.textContent = fmt(R.catOf, { i: i + 1, n: session.qs.length });
    els.revealNext.textContent = last ? R.finish : R.next;
    els.revealAll.hidden = last;
    els.revealCard.textContent = '';
    var card = buildCard(dataOf(i), { suspense: true, canBreak: true, qi: i });
    if (REDUCED) {
      els.revealCard.appendChild(card);
      els.revealNext.disabled = false;
      say(card.querySelector('.bl-top').textContent);
      return;
    }
    // 두구두구: 3 · 2 · 1 → 카드
    els.revealNext.disabled = true;
    var drum = el('div', 'bl-card bl-drum');
    drum.appendChild(el('h3', 'bl-cat-title', session.qs[i].t));
    drum.appendChild(el('p', 'bl-drum-kicker', R.drum));
    var num = el('p', 'bl-drum-num', '3');
    num.setAttribute('aria-hidden', 'true');
    drum.appendChild(num);
    els.revealCard.appendChild(drum);
    vibrate(20);
    later(function () { num.textContent = '2'; vibrate(20); }, DRUM_STEP);
    later(function () { num.textContent = '1'; vibrate(20); }, DRUM_STEP * 2);
    later(function () {
      els.revealCard.textContent = '';
      els.revealCard.appendChild(card);
      card.classList.add('is-pop');
      later(function () { growBars(card); }, 40);
      els.revealNext.disabled = false;
      vibrate([60, 40, 140]);
      say(card.querySelector('.bl-top').textContent);
    }, DRUM_STEP * 3);
  }
  function showSummary() {
    clearTimers();
    stage = 'summary';
    show('result');
    els.reveal.hidden = true;
    els.summary.hidden = false;
    els.sumSub.textContent = fmt(R.summarySub, { c: session.cast });
    els.sumCards.textContent = '';
    session.qs.forEach(function (_, qi) { els.sumCards.appendChild(buildCard(dataOf(qi), { canBreak: true, qi: qi })); });
    els.shareLink.hidden = !navigator.share;
    if (!run.done) { run.done = true; saveRun(); track('done'); }
    toTop();
  }
  function resultText() {
    var lines = [fmt(R.textHead, { c: session.cast })];
    session.qs.forEach(function (q, qi) {
      var d = dataOf(qi);
      var t = CORE.tally(d.c);
      var win = CORE.winnerOf(d.c, d.b);
      var top = win >= 0 ? d.o[win] + (t.tie ? ' (' + R.textTie + ')' : '') : R.tie;
      lines.push('');
      lines.push('🗳️ ' + q.t + ' → ' + top);
      t.order.forEach(function (oi) { lines.push('· ' + d.o[oi] + ': ' + fmt(R.bar, { c: d.c[oi], p: CORE.percent(d.c[oi], t.total) })); });
    });
    return lines.join('\n');
  }
  function baseUrl() {
    var base = window.location.href.split('#')[0];
    return (window.mgCleanUrl ? window.mgCleanUrl(base) : base).split('#')[0];
  }
  function resultLink() { return baseUrl() + '#d=' + CORE.encodeResult(CORE.resultOf(session)); }
  function copy(text) {
    var done = function () { if (window.toast) window.toast(R.copied); };
    var fallback = function () {
      var ta = el('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(fallback);
    else fallback();
  }
  function backToSetup() {
    cancelVote();
    renderQuestions();
    onDraftChange(false);
  }

  // ---------------------------------------------------------------- 공유 결과 화면 (#d=)
  function openShared(code) {
    stage = 'shared';
    show('shared');
    var r = CORE.decodeResult(code);
    els.sharedCards.textContent = '';
    if (!r) {
      els.sharedBad.hidden = false;
      els.sharedSub.textContent = '';
      return;
    }
    els.sharedBad.hidden = true;
    els.sharedSub.textContent = fmt(R.sharedSub, { c: r.n });
    r.q.forEach(function (d) { els.sharedCards.appendChild(buildCard(d, {})); });
  }
  function hashCode() {
    var m = /^#d=([A-Za-z0-9_-]+)$/.exec(window.location.hash || '');
    return m ? m[1] : '';
  }

  // ---------------------------------------------------------------- 연결
  presetBtns.forEach(function (b) { b.addEventListener('click', function () { applyPreset(b.getAttribute('data-preset')); }); });
  els.people.addEventListener('input', function () { draft.people = els.people.value; autoVoters(); saveDraft(); els.error.hidden = true; });
  els.addQ.addEventListener('click', function () {
    if (draft.questions.length >= CORE.MAX_Q) return;
    draft.questions.push({ t: '', people: false, o: '' });
    draft.preset = '';
    onDraftChange(true);
    var t = els.questions.querySelectorAll('.bl-q-title');
    if (t.length) t[t.length - 1].focus();
  });
  els.votersLess.addEventListener('click', function () { draft.voters = Math.max(CORE.MIN_VOTERS, draft.voters - 1); draft.votersTouched = true; renderVoters(); saveDraft(); });
  els.votersMore.addEventListener('click', function () { draft.voters = Math.min(CORE.MAX_VOTERS, draft.voters + 1); draft.votersTouched = true; renderVoters(); saveDraft(); });
  els.start.addEventListener('click', startVoting);
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.ready.addEventListener('click', function () { buildBallot(); showStage('ballot'); toTop(); });
  els.ballot.addEventListener('submit', function (e) { e.preventDefault(); castNow(); });
  els.next.addEventListener('click', function () { showStage('cover'); });
  els.revealBtn.addEventListener('click', startReveal);
  els.finish.addEventListener('click', function () {
    if (!session || session.cast < 1) return;
    if (window.confirm(fmt(U.finishConfirm, { c: session.cast, n: session.voters }))) startReveal();
  });
  els.cancel.addEventListener('click', function () { if (window.confirm(U.cancelConfirm)) cancelVote(); });
  els.revealNext.addEventListener('click', function () {
    if (revealIdx >= session.qs.length - 1) showSummary();
    else { showReveal(revealIdx + 1); toTop(); }
  });
  els.revealAll.addEventListener('click', showSummary);
  els.copyText.addEventListener('click', function () { copy(resultText()); });
  els.copyLink.addEventListener('click', function () { copy(resultLink()); });
  els.shareLink.addEventListener('click', function () {
    if (navigator.share) navigator.share({ title: R.sharedTitle, text: fmt(R.textHead, { c: session.cast }), url: resultLink() }).catch(function () {});
  });
  els.edit.addEventListener('click', backToSetup);
  els.resumeBtn.addEventListener('click', function () {
    els.resumeBox.hidden = true;
    if (run.phase === 'results') { showSummary(); return; }
    show('vote');
    showStage(CORE.isComplete(session) ? 'allin' : 'cover');
  });
  els.discardBtn.addEventListener('click', function () { els.resumeBox.hidden = true; cancelVote(); });
  els.makeOwn.addEventListener('click', function () {
    try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { window.location.hash = ''; }
    stage = 'setup';
    show('setup');
    toTop();
  });

  if (window.setShareData) window.setShareData(function () { return { title: R.shareTitle, text: R.shareText, url: baseUrl() }; });
  if (window.setRetry) window.setRetry({ label: R.again, action: function () { cancelVote(); startVoting(); } });

  // ---------------------------------------------------------------- 시작
  draft = loadDraft();
  els.people.value = draft.people;
  renderQuestions();
  renderPresets();
  renderVoters();
  var saved = loadRun();
  if (saved) {
    session = saved.session; run = saved.run;
    els.resumeText.textContent = run.phase === 'results' ? U.resumeResults : fmt(U.resumeText, { c: session.cast, n: session.voters });
    els.resumeBox.hidden = false;
  }
  var code = hashCode();
  if (code) openShared(code);
  else show('setup');

  window.BALLOT_APP = {
    stage: function () { return stage; },
    draft: function () { return JSON.parse(JSON.stringify(draft)); },
    progress: function () { return session ? { cast: session.cast, voters: session.voters, questions: session.qs.length } : null; },
    // 결과 단계에서만 표 수를 돌려준다(투표 중에는 null)
    results: function () { return session && run && run.phase === 'results' ? CORE.resultOf(session) : null; }
  };
})();
