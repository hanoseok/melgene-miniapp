/* apps/balance/balance.js — 밸런스 게임 앱 (팩 고르기 → 질문 카드 → 결과)
 * 문구는 페이지에 인라인된 window.PAGE_I18N(언어별), 팩·질문 id·계산은 balance-core.js(언어 무관).
 * 끝 화면 = 내 결과(유형·대세 일치율·고민 시간·친구와 같은 수) + 공통 <div data-mg-end="balance">
 *   (별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱). 이 파일은 공유 내용(setShareData)과 다시 하기(setRetry)만 등록한다.
 *   스포일러 금지: 푼 질문 목록·"가장 팽팽했던 질문"은 보여 주지 않는다 (.claude/skills/melgene-miniapp).
 *
 * 숫자 원칙: 퍼센트·인원은 supa.vote / supa.pollResults 가 돌려준 실제 합계로만 그린다.
 * 서버가 꺼져 있거나 실패하면 숫자 없이 "내 선택"만 보여 준다(가짜 숫자 금지).
 * 같은 브라우저는 질문마다 한 번만 투표한다(localStorage bal_votes_v1). 다시 하면 현재 합계만 보여 준다.
 */
(function () {
  'use strict';

  var CORE = window.BALANCE_CORE;
  var UI = window.PAGE_I18N || {};
  var QT = UI.questions || {};
  var FMT = window.mgFormat || {};
  var fill = FMT.fill || function (s, m) { return String(s).replace(/\{(\w+)\}/g, function (x, k) { return m[k] != null ? m[k] : x; }); };
  var num = FMT.num || function (n) { return String(n); };
  var LANG = (document.documentElement.getAttribute('lang') || '').split('-')[0] || undefined;
  // 넓은 글자 문자(한글·가나·한자 등)는 글자 수가 적어도 자리를 많이 차지한다 (gen-i18n: <html class="bal-dense">)
  var DENSE = document.documentElement.classList.contains('bal-dense');
  function pct(n) { return fill(UI.pct || '{n}%', { n: num(n) }); }
  // 복수형 문구 { one, other, ... } → Intl.PluralRules 로 고른다 (문자열이면 그대로)
  var pluralRules = null;
  try { pluralRules = new Intl.PluralRules(LANG); } catch (e) { pluralRules = null; }
  function plural(forms, n) {
    if (!forms || typeof forms === 'string') return fill(forms || '{n}', { n: num(n) });
    var cat = pluralRules ? pluralRules.select(n) : 'other';
    return fill(forms[cat] || forms.other, { n: num(n) });
  }
  // "A 62%, 1,234명" (스크린리더·막대 설명용)
  function resultText(k, p, n) {
    return fill(UI.resultAria, { side: k ? UI.sideB : UI.sideA, pct: pct(p), people: plural(UI.people, n) });
  }
  function decimal1(x) {
    try { return x.toLocaleString(LANG, { minimumFractionDigits: 1, maximumFractionDigits: 1 }); } catch (e) { return x.toFixed(1); }
  }

  var VOTES_KEY = 'bal_votes_v1';
  var VOTE_TIMEOUT = 3500;   // 이보다 늦으면 숫자 없이 진행 (늦게라도 투표가 저장되면 투표 기록에는 남긴다)
  var READ_MS = 1200;        // 결과가 다 그려진 뒤 다음 질문으로 넘어가기까지
  var REVEAL_MS = 650;       // 경계선 이동·숫자 카운트업 시간
  var STAMP_MS = 360;        // "내 선택" 스탬프가 찍힌 뒤 결과를 여는 최소 시간

  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var COARSE = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var raf = window.requestAnimationFrame || function (f) { return setTimeout(function () { f(Date.now()); }, 16); };
  var now = function () { return (window.performance && performance.now) ? performance.now() : Date.now(); };

  function $(id) { return document.getElementById(id); }
  var els = {
    home: $('screen-home'), play: $('screen-play'), end: $('screen-end'),
    packs: $('packs'),
    back: $('back-btn'), skip: $('skip-btn'), progress: $('progress'), progressNum: $('progress-num'),
    friendBanner: $('friend-banner'),
    qPack: $('q-pack'), prompt: $('q-prompt'),
    duel: $('duel'), note: $('note'), next: $('next-btn'),
    rPack: $('r-pack'), rType: $('r-type'), rDesc: $('r-desc'),
    rRateBox: $('r-rate-box'), rRate: $('r-rate'), rSpeedBox: $('r-speed-box'), rSpeed: $('r-speed'),
    rFriendBox: $('r-friend-box'), rFriend: $('r-friend'), rMeter: $('r-meter'), rLine: $('r-line'),
    year: $('year')
  };
  if (!CORE || !els.duel) return;
  if (els.year) els.year.textContent = new Date().getFullYear();

  var sides = [els.duel.querySelector('.bal-side--a'), els.duel.querySelector('.bal-side--b')];
  function part(side, cls) { return side.querySelector('.' + cls); }

  // 스크린리더용 결과 알림
  var live = document.createElement('p');
  live.className = 'visually-hidden';
  live.setAttribute('aria-live', 'polite');
  els.play.appendChild(live);

  // ------------------------------------------------------------------ 저장소
  var votes = (function () {
    try {
      var v = JSON.parse(localStorage.getItem(VOTES_KEY) || '{}');
      return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
    } catch (e) { return {}; }
  })();
  function rememberVote(qid, opt) {
    votes[qid] = opt;
    try { localStorage.setItem(VOTES_KEY, JSON.stringify(votes)); } catch (e) { /* noop */ }
  }

  function track(ev) { try { if (window.track) window.track(ev); } catch (e) { /* noop */ } }

  // ------------------------------------------------------------------ 서버
  function online() { return !!(window.supa && window.supa.enabled && window.supa.enabled()); }

  function withTimeout(p, ms) {
    return new Promise(function (resolve) {
      var done = false;
      var t = setTimeout(function () { if (!done) { done = true; resolve(null); } }, ms);
      Promise.resolve(p).then(function (v) {
        if (!done) { done = true; clearTimeout(t); resolve(v); }
      }, function () {
        if (!done) { done = true; clearTimeout(t); resolve(null); }
      });
    });
  }

  // 전체 합계 { qid: [A,B] }. 불러오지 못하면 null (실패한 결과는 캐시하지 않는다)
  var results = { promise: null, at: 0 };
  function pollResults(force) {
    if (!online()) return Promise.resolve(null);
    if (!results.promise || force || Date.now() - results.at > 60000) {
      results.at = Date.now();
      results.promise = withTimeout(window.supa.pollResults(CORE.POLL), VOTE_TIMEOUT).then(function (rows) {
        if (!Array.isArray(rows)) { results.promise = null; return null; }
        return CORE.resultsMap(rows);
      });
    }
    return results.promise;
  }

  function castVote(qid, opt) {
    var req = Promise.resolve(window.supa.vote(CORE.POLL, qid, opt));
    // 화면은 VOTE_TIMEOUT 뒤 숫자 없이 넘어가도, 서버에 저장된 표는 기록해 둔다 → 다시 해도 두 번 세지 않는다
    req.then(function (rows) { if (CORE.countsFromRows(rows)) rememberVote(qid, opt); }, function () { /* noop */ });
    return withTimeout(req, VOTE_TIMEOUT).then(function (rows) {
      var c = CORE.countsFromRows(rows);
      return { counts: c, self: c ? opt : null, reason: c ? 'voted' : 'failed' };
    });
  }

  // → { counts: [A,B] | null, self: counts 에 들어 있는 내 표(0|1|null), reason: 'voted' | 'already' | 'failed' | 'offline' }
  function countsFor(qid, opt) {
    if (!online()) return Promise.resolve({ counts: null, self: null, reason: 'offline' });
    if (votes[qid] === 0 || votes[qid] === 1) {
      return pollResults().then(function (map) {
        // 합계를 못 불러왔으면 다시 투표하지 않고(이중 집계 방지) 숫자 없이 진행
        if (!map) return { counts: null, self: null, reason: 'failed' };
        // 서버에 그 질문 기록이 아예 없으면(초기화 등) 이번 선택을 새로 투표한다
        return map[qid] ? { counts: map[qid], self: votes[qid], reason: 'already' } : castVote(qid, opt);
      });
    }
    return castVote(qid, opt);
  }

  // ------------------------------------------------------------------ 상태
  var S = {
    screen: 'home', pack: null, seed: null, qids: [], idx: 0, entries: [],
    friend: null, doneTracked: false, run: 0, shownAt: 0, timer: null
  };

  function packLabel(id) {
    var p = CORE.packById(id);
    var t = (UI.packs || {})[id] || {};
    return { emoji: p ? p.emoji : '', name: t.name || id };
  }

  function showScreen(name) {
    S.screen = name;
    ['home', 'play', 'end'].forEach(function (n) { els[n].hidden = n !== name; });
    document.body.setAttribute('data-screen', name);
  }

  function scrollTop() { window.scrollTo(0, 0); }

  // ------------------------------------------------------------------ 시작
  function startPack(packId, opts) {
    opts = opts || {};
    var seed = packId === CORE.RANDOM_ID ? (opts.seed || CORE.freshSeed(votes)) : null;
    var qids = CORE.questionsFor(packId, seed);
    if (!qids) return;
    cancelAdvance();
    S.run++;
    S.pack = packId;
    S.seed = seed;
    S.qids = qids;
    S.idx = 0;
    S.doneTracked = false;
    S.friend = opts.friend && opts.friend.length === qids.length ? opts.friend : null;
    S.entries = qids.map(function (q) { return { qid: q, pick: null, counts: null, self: null, ms: null, reason: null, pending: false }; });

    if (S.friend) {
      // 친구가 보낸 세트: 어떤 질문인지는 미리 알려 주지 않는다 (문제 수만)
      els.friendBanner.textContent = fill(UI.friendBanner, { n: qids.length });
      els.friendBanner.hidden = false;
    } else {
      els.friendBanner.hidden = true;
    }
    // 예전에 투표한 질문이 있으면 현재 합계를 미리 받아 둔다
    if (online() && qids.some(function (q) { return votes[q] === 0 || votes[q] === 1; })) pollResults(true);

    buildProgress();
    showScreen('play');
    openPlayHistory();
    renderQuestion(0);
    scrollTop();
    track('balance_start');
    track('start');
  }

  // ------------------------------------------------------------------ 진행 표시 (고른 쪽 색으로 칠해진다)
  function buildProgress() {
    els.progress.innerHTML = '';
    S.qids.forEach(function () {
      var li = document.createElement('li');
      els.progress.appendChild(li);
    });
  }
  function paintProgress() {
    var lis = els.progress.children;
    for (var i = 0; i < lis.length; i++) {
      var e = S.entries[i];
      var cls = e.pick === 0 ? 'is-a' : e.pick === 1 ? 'is-b' : i < S.idx ? 'is-skip' : '';
      if (i === S.idx) cls += ' is-current';
      lis[i].className = cls;
    }
    els.progressNum.textContent = fill(UI.progress, { i: S.idx + 1, n: S.qids.length });
  }

  // ------------------------------------------------------------------ 질문 카드
  function renderQuestion(i) {
    cancelAdvance();
    S.idx = i;
    var e = S.entries[i];
    var qt = QT[e.qid] || { a: '', b: '' };
    var origin = CORE.packOfQid(e.qid);
    var lab = packLabel(origin ? origin.id : S.pack);

    // 이전 질문의 경계선·막대가 되돌아가는 모습이 보이지 않게 잠깐 transition 을 끈다
    els.duel.classList.add('no-anim');
    els.duel.scrollTop = 0; // overflow: clip 을 모르는 브라우저에서 초점 이동으로 안쪽이 밀려 있었다면 되돌린다
    els.qPack.textContent = lab.emoji + ' ' + lab.name;
    var prompt = qt.q || UI.prompt;
    els.prompt.textContent = prompt;
    els.prompt.classList.toggle('is-long', prompt.length > 26);
    els.play.classList.toggle('has-long-prompt', prompt.length > 26);
    els.back.setAttribute('aria-label', i === 0 ? (els.back.getAttribute('data-home') || '') : (els.back.getAttribute('data-prev') || ''));

    [qt.a, qt.b].forEach(function (text, k) {
      var side = sides[k];
      part(side, 'bal-opt').textContent = text;
      part(side, 'bal-pct').textContent = '';
      part(side, 'bal-pct')._cu = null; // 이전 질문의 카운트업 중단
      part(side, 'bal-cnt').textContent = '';
      part(side, 'bal-meter-fill').style.width = '0%';
      side.classList.remove('is-chosen', 'is-other', 'has-friend', 'is-roomy');
      side.style.flexBasis = '';
      side.setAttribute('aria-pressed', 'false');
      side.setAttribute('aria-label', fill(UI.pickAria, { side: k ? UI.sideB : UI.sideA, text: text }));
    });
    els.duel.setAttribute('data-state', 'idle');
    els.duel.setAttribute('data-long', (qt.a.length + qt.b.length > (DENSE ? 30 : 70)) ? '1' : '0');
    els.note.textContent = '';
    live.textContent = '';
    els.next.hidden = true;
    els.next.classList.remove('is-counting');
    els.skip.hidden = false;

    if (!reduceMotion) {
      els.duel.classList.remove('is-entering');
      void els.duel.offsetWidth;
      els.duel.classList.add('is-entering');
    }

    paintProgress();
    S.shownAt = now();

    // 이미 답한 질문(뒤로 가기)은 저장된 결과를 애니메이션 없이 다시 보여 준다
    if (e.pick === 0 || e.pick === 1) {
      markChosen(e.pick);
      if (!e.pending) showResult(e, false);
    }
    void els.duel.offsetWidth;
    els.duel.classList.remove('no-anim');
  }

  function markChosen(opt) {
    els.duel.setAttribute('data-state', 'picked');
    sides[opt].classList.add('is-chosen');
    sides[opt].setAttribute('aria-pressed', 'true');
    sides[1 - opt].classList.add('is-other');
    if (S.friend && (S.friend[S.idx] === 0 || S.friend[S.idx] === 1)) sides[S.friend[S.idx]].classList.add('has-friend');
    els.skip.hidden = true;
  }

  function onPick(opt, viaKeyboard) {
    if (S.screen !== 'play') return;
    var e = S.entries[S.idx];
    if (e.pick === 0 || e.pick === 1) {
      if (!e.pending) advance(); // 결과가 떠 있을 때 카드를 누르면 바로 다음으로
      return;
    }
    e.pick = opt;
    e.ms = Math.round(now() - S.shownAt);
    e.pending = true;
    markChosen(opt);
    paintProgress();
    // 터치 기기에서만 짧은 진동 (사용자 입력이 있을 때만 — 없으면 Chrome 이 콘솔에 경고를 남긴다)
    try {
      var act = navigator.userActivation;
      if (navigator.vibrate && COARSE && (!act || act.isActive)) navigator.vibrate(12);
    } catch (err) { /* noop */ }
    track('balance_pick');

    var run = S.run, idx = S.idx;
    var wait = new Promise(function (r) { setTimeout(r, reduceMotion ? 0 : STAMP_MS); });
    Promise.all([countsFor(e.qid, opt), wait]).then(function (out) {
      var r = out[0];
      e.pending = false;
      e.counts = r.counts;
      e.self = r.self;
      e.reason = r.reason;
      if (run !== S.run || S.screen !== 'play' || S.idx !== idx) return;
      showResult(e, true);
      scheduleAdvance(viaKeyboard, e);
    });
  }

  function countUp(el, to, dur) {
    var token = {};
    el._cu = token;
    if (reduceMotion || !dur) { el.textContent = pct(to); return; }
    var t0 = now();
    // 탭이 가려지면 requestAnimationFrame 이 멈춘다 → 시간이 지나면 최종 값은 반드시 쓴다
    setTimeout(function () { if (el._cu === token) el.textContent = pct(to); }, dur + 60);
    (function step() {
      if (el._cu !== token) return;
      var k = Math.min(1, (now() - t0) / dur);
      el.textContent = pct(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf(step);
    })();
  }

  // 결과 경계선은 선택률 쪽으로 밀리되(30~70%), 좁아진 쪽에 선택지·퍼센트·인원이 다 들어가는 데까지만 민다.
  // 화면 밖 복제본(probe)에 실제 결과 상태를 그려서 잰다 → 언어·글자 수·화면 높이와 상관없이 넘치지 않는다.
  var probe = null;
  function fitsIn(side, k) {
    var r = side.getBoundingClientRect();
    var o = part(side, 'bal-opt').getBoundingClientRect();
    var st = part(side, 'bal-stat').getBoundingClientRect();
    // 아래쪽 18px 은 정확한 막대(.bal-meter) 자리, 경계선 쪽 37px 은 VS 스티커 자리(반지름 31px + 테두리 4px + 여유)
    return o.top >= r.top + (k ? 37 : 4) && st.bottom <= r.bottom - (k ? 18 : 37) &&
      o.left >= r.left - 0.5 && o.right <= r.right + 0.5;
  }
  function fitVisual(want, texts, pcs, people) {
    if (want === 50 || !els.duel.offsetHeight) return want;
    try {
      if (!probe) {
        probe = els.duel.cloneNode(true);
        probe.removeAttribute('id');
        probe.setAttribute('aria-hidden', 'true');
        probe.setAttribute('inert', '');
        els.duel.parentNode.insertBefore(probe, els.duel.nextSibling);
      }
      probe.className = 'bal-duel bal-duel--probe no-anim';
      probe.style.width = els.duel.offsetWidth + 'px';
      probe.style.height = els.duel.offsetHeight + 'px';
      probe.setAttribute('data-state', 'result');
      probe.setAttribute('data-long', els.duel.getAttribute('data-long'));
      var ps = [probe.querySelector('.bal-side--a'), probe.querySelector('.bal-side--b')];
      ps.forEach(function (side, k) {
        side.className = 'bal-side bal-side--' + (k ? 'b' : 'a');
        part(side, 'bal-opt').textContent = texts[k];
        part(side, 'bal-pct').textContent = pct(pcs[k]);
        part(side, 'bal-cnt').textContent = people[k];
      });
      var v = want;
      for (var i = 0; i < 8; i++) {
        ps[0].style.flexBasis = v + '%';
        ps[1].style.flexBasis = (100 - v) + '%';
        ps[0].classList.toggle('is-roomy', v >= 56);
        ps[1].classList.toggle('is-roomy', v <= 44);
        if (v === 50 || (fitsIn(ps[0], 0) && fitsIn(ps[1], 1))) break;
        v = v < 50 ? Math.min(50, v + 4) : Math.max(50, v - 4);
      }
      return v;
    } catch (err) { return want; }
  }

  function showResult(e, animate) {
    var qt = QT[e.qid] || { a: '', b: '' };
    var texts = [qt.a, qt.b];
    if (e.counts) {
      var pc = CORE.percents(e.counts);
      var people = [plural(UI.people, e.counts[0]), plural(UI.people, e.counts[1])];
      // 경계선은 30~70% 사이에서 움직인다(글자가 들어갈 자리). 정확한 값은 숫자와 막대가 보여 준다.
      var visual = fitVisual(Math.max(30, Math.min(70, pc[0])), texts, pc, people);
      els.duel.setAttribute('data-state', 'result');
      sides[0].style.flexBasis = visual + '%';
      sides[1].style.flexBasis = (100 - visual) + '%';
      sides[0].classList.toggle('is-roomy', visual >= 56);
      sides[1].classList.toggle('is-roomy', visual <= 44);
      [0, 1].forEach(function (k) {
        var side = sides[k];
        countUp(part(side, 'bal-pct'), pc[k], animate ? REVEAL_MS : 0);
        part(side, 'bal-cnt').textContent = people[k];
        part(side, 'bal-meter-fill').style.width = pc[k] + '%';
        side.setAttribute('aria-label', fill(UI.pickAria, { side: k ? UI.sideB : UI.sideA, text: texts[k] }) + ' — ' +
          resultText(k, pc[k], e.counts[k]));
      });
      var total = e.counts[0] + e.counts[1];
      els.note.textContent = e.reason === 'already' ? UI.already : total === 1 ? UI.firstVote : '';
      live.textContent = resultText(0, pc[0], e.counts[0]) + ' / ' + resultText(1, pc[1], e.counts[1]);
    } else {
      els.duel.setAttribute('data-state', 'nodata');
      els.note.textContent = UI.noData;
      live.textContent = '';
    }
    var last = S.idx === S.qids.length - 1;
    part(els.next, 'bal-next-label').textContent = last ? UI.finish : UI.next;
    els.next.hidden = false;
  }

  // ------------------------------------------------------------------ 넘어가기
  function scheduleAdvance(viaKeyboard, e) {
    cancelAdvance();
    // 키보드로 고른 사람에게는 자동으로 넘기지 않고 "다음" 버튼에 초점을 준다
    if (viaKeyboard) { els.next.focus(); return; }
    if (document.hidden) return;
    var ms = (e && e.counts ? READ_MS + (reduceMotion ? 0 : REVEAL_MS) : 1000);
    els.next.style.setProperty('--advance', ms + 'ms');
    els.next.classList.remove('is-counting');
    void els.next.offsetWidth;
    els.next.classList.add('is-counting');
    S.timer = setTimeout(advance, ms);
  }

  function cancelAdvance() {
    if (S.timer) { clearTimeout(S.timer); S.timer = null; }
    els.next.classList.remove('is-counting');
  }

  function advance() {
    cancelAdvance();
    if (S.screen !== 'play') return;
    if (S.idx < S.qids.length - 1) renderQuestion(S.idx + 1);
    else finish();
  }

  function goBack() {
    cancelAdvance();
    if (S.idx === 0) { goHome(); return; }
    renderQuestion(S.idx - 1);
  }

  // ------------------------------------------------------------------ 결과 화면
  function finish() {
    cancelAdvance();
    var entries = S.entries;
    var sum = CORE.summarize(entries);
    var picks = entries.map(function (e) { return e.pick; });
    var cmp = CORE.compareFriend(picks, S.friend);
    var lab = packLabel(S.pack);
    var type = (UI.types || {})[sum.type] || { name: sum.type, desc: '' };
    // 대세 일치율은 유형을 정할 만큼(MIN_FOR_TYPE 문제 이상) 비교할 수 있을 때만 보여 주고 공유한다
    var rate = sum.typeBasis === 'majority' ? sum.rate : null;

    els.rPack.textContent = lab.emoji + ' ' + fill(UI.packResult, { pack: lab.name });
    els.rType.textContent = type.name;
    els.rDesc.textContent = type.desc;

    els.rRateBox.hidden = rate == null;
    els.rRate.textContent = rate == null ? '' : pct(rate);
    els.rMeter.hidden = rate == null;
    els.rMeter.firstElementChild.style.width = '0%';
    els.rSpeedBox.hidden = sum.avgMs == null;
    els.rSpeed.textContent = sum.avgMs == null ? '' : fill(UI.seconds, { s: decimal1(sum.avgMs / 1000) });
    els.rFriendBox.hidden = !(cmp && cmp.both);
    els.rFriend.textContent = cmp && cmp.both ? fill(UI.friendCount, { k: cmp.same, m: cmp.both }) : '';

    if (sum.typeBasis === 'majority') els.rLine.textContent = fill(UI.matchLine, { m: sum.considered, k: sum.matches });
    else if (sum.typeBasis === 'speed') els.rLine.textContent = sum.withData ? UI.fewNote : UI.speedNote;
    else els.rLine.textContent = '';

    S.share = {
      text: rate != null
        ? fill(UI.shareRate, { pack: lab.name, rate: rate, type: type.name })
        : fill(UI.sharePlain, { pack: lab.name, type: type.name }),
      url: shareUrl(picks)
    };

    showScreen('end');
    scrollTop();
    if (rate != null) {
      setTimeout(function () { els.rMeter.firstElementChild.style.width = rate + '%'; }, 60);
    }
    els.rType.setAttribute('tabindex', '-1');
    try { els.rType.focus({ preventScroll: true }); } catch (err) { /* noop */ }
    if (!S.doneTracked) { S.doneTracked = true; track('done'); }
  }

  function shareUrl(picks) {
    var base = window.location.href.split('#')[0].split('?')[0];
    return base + '#' + CORE.encodeShare({ pack: S.pack, seed: S.seed, picks: picks });
  }

  // ------------------------------------------------------------------ 홈 / 기록
  function openPlayHistory() {
    try { if (!(history.state && history.state.bal)) history.pushState({ bal: 1 }, ''); } catch (e) { /* noop */ }
  }
  function showHome() {
    cancelAdvance();
    S.run++;
    showScreen('home');
  }
  function goHome(toPacks) {
    var inHistory = false;
    try { inHistory = !!(history.state && history.state.bal); } catch (e) { /* noop */ }
    if (inHistory) history.back(); // popstate → showHome
    else showHome();
    if (toPacks) setTimeout(function () { els.packs.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' }); }, 60);
  }
  window.addEventListener('popstate', function () { if (S.screen !== 'home') showHome(); });

  // ------------------------------------------------------------------ 이벤트
  els.packs.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-pack]');
    if (b) startPack(b.getAttribute('data-pack'));
  });
  sides.forEach(function (side, k) {
    side.addEventListener('click', function (ev) { onPick(k, ev.detail === 0); });
  });
  els.next.addEventListener('click', advance);
  els.skip.addEventListener('click', function () {
    var e = S.entries[S.idx];
    if (e && e.pending) return;
    advance();
  });
  els.back.addEventListener('click', goBack);

  // 공통 끝 화면(data-mg-end): 공유 = 내 유형·대세 일치율 문구 + 친구가 같은 질문을 푸는 링크(#p=…&v=…),
  // 다시 하기 = 팩 고르기로 (같은 팩을 다시 하면 이미 투표한 질문이라 숫자가 늘지 않으므로)
  if (window.setShareData) {
    window.setShareData(function () {
      return S.share ? { title: UI.shareTitle, text: S.share.text, url: S.share.url } : { title: UI.shareTitle };
    });
  }
  if (window.setRetry) window.setRetry({ label: UI.retry, action: function () { goHome(true); } });

  document.addEventListener('keydown', function (ev) {
    if (S.screen !== 'play' || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var t = ev.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    var k = String(ev.key || '').toLowerCase();
    if (k === 'a' || k === '1') { ev.preventDefault(); onPick(0, true); }
    else if (k === 'b' || k === '2') { ev.preventDefault(); onPick(1, true); }
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) cancelAdvance(); });

  // ------------------------------------------------------------------ 시작: 공유 링크(#p=…)면 그 세트로 바로
  function openSharedFromHash() {
    var shared = CORE.decodeShare(window.location.hash);
    if (!shared) return false;
    try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) { /* noop */ }
    startPack(shared.pack, { seed: shared.seed, friend: shared.picks });
    track('balance_from_link');
    return true;
  }
  showScreen('home');
  openSharedFromHash();
  // 이미 이 페이지를 연 상태에서 공유 링크를 열면 새로고침 없이 해시만 바뀐다
  window.addEventListener('hashchange', openSharedFromHash);

  // 디버그/검증용 읽기 전용 핸들
  window.BALANCE_APP = { state: function () { return S; }, votes: function () { return votes; } };
})();
