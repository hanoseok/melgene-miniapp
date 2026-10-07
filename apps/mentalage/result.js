/* apps/mentalage/result.js — 결과 페이지(r/<id>.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유(이 결과 페이지 + 숫자 나이 #a=<나이>) · 다시 하기(같은 언어의 시작 화면).
 * 숫자 나이: 주소의 #a=<나이> 가 이 나이대 범위 안의 숫자일 때만 정적 범위(예: 24–29) 대신 보여 준다.
 * "같은 나이대가 나온 비율"은 서버(poll_vote/poll_results)의 실제 합계로만 보여 주고, 꺼져 있거나 실패하면 숨긴다.
 * 값은 생성기가 window.MENTALAGE_RESULT 로 인라인한다 (tools/gen-i18n.js).
 */
(function () {
  'use strict';

  var P = window.MENTALAGE_RESULT || {};
  var CORE = window.MENTALAGE_CORE;
  var MIN_TOTAL = 20; // 참여가 너무 적으면 비율이 의미 없어서 숨긴다
  var TIMEOUT = 6000;
  var lang = document.documentElement.lang || 'en';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 숫자 나이 (#a=27) — 범위 밖·이상한 값이면 무시하고 정적 범위를 그대로 둔다
  var m = /(?:^#|&)a=(\d{1,3})(?:&|$)/.exec(window.location.hash || '');
  var age = m && CORE ? CORE.validAge(P.id, m[1]) : null;
  function ageTpl(n) {
    var forms = P.age || {};
    var cat = 'other';
    try { cat = new Intl.PluralRules(lang).select(n); } catch (e) { /* other */ }
    return forms[cat] || forms.other || '{n}';
  }
  if (age != null) {
    var stamp = document.getElementById('age-stamp');
    if (stamp) {
      var parts = String(ageTpl(age)).split('{n}');
      stamp.textContent = '';
      parts.forEach(function (p, i) {
        if (i > 0) {
          var b = document.createElement('b');
          b.className = 'ma-age-num';
          b.textContent = String(age);
          stamp.appendChild(b);
        }
        if (p.trim()) {
          var u = document.createElement('span');
          u.className = 'ma-age-unit';
          u.textContent = p.trim();
          stamp.appendChild(u);
        }
      });
      stamp.classList.add('is-exact');
    }
  }

  if (window.setShareData) {
    window.setShareData(function () {
      var s = P.share || {};
      if (age == null) return s;
      return {
        title: s.title,
        text: String(P.shareTpl || '').replace('{age}', ageTpl(age).replace('{n}', String(age))),
        url: String(s.url || window.location.href).split('#')[0] + '#a=' + age
      };
    });
  }
  if (P.retry && window.setRetry) window.setRetry(P.retry);

  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* noop */ }
    return null;
  }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { /* noop */ }
    return null;
  }

  // 공유 링크로 들어온 방문자(이 브라우저에서 방금 테스트를 안 한 경우)에게만 위쪽 "나도 해 보기"
  var took = ss('ma_took') === '1';
  var cta = document.getElementById('share-cta');
  if (cta && !took) {
    cta.hidden = false;
    cta.addEventListener('click', function () { if (window.track) window.track('cta_try'); });
  }

  // 같은 나이대 비율 (실제 서버 값만)
  var el = document.getElementById('same-share');
  var supa = window.supa;
  if (!el || !CORE || !P.id || !supa || !supa.enabled()) return;

  function withTimeout(p) {
    return Promise.race([Promise.resolve(p), new Promise(function (r) { setTimeout(function () { r(null); }, TIMEOUT); })]);
  }

  var fresh = ss('ma_new') === P.id;
  if (fresh) ss('ma_new', null);
  var voteReq = Promise.resolve(null);
  // 한 브라우저는 한 번만 센다(처음 받은 결과). 다시 해도 현재 합계만 보여 준다.
  if (fresh && ls('ma_voted_v1') !== '1') {
    var slot = CORE.pollSlot(P.id);
    voteReq = withTimeout(supa.vote(CORE.POLL, slot.qid, slot.opt)).then(function (rows) {
      if (Array.isArray(rows)) ls('ma_voted_v1', '1');
      return rows;
    }, function () { return null; });
  }

  voteReq.then(function () { return withTimeout(supa.pollResults(CORE.POLL)); })
    .then(function (rows) {
      var c = CORE.pollCounts(rows);
      if (!c || c.total < MIN_TOTAL || !c.counts[P.id]) return;
      var pct = (c.counts[P.id] / c.total) * 100;
      var txt;
      try { txt = pct.toLocaleString(lang, { maximumFractionDigits: pct < 10 ? 1 : 0 }); } catch (e) { txt = String(Math.round(pct)); }
      el.textContent = String(P.sameShare || '').replace('{pct}', txt);
      el.hidden = false;
    })
    .catch(function () { /* 숨긴 채로 둔다 */ });
})();
