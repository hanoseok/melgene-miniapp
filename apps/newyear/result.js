/* apps/newyear/result.js — 결과 페이지(r/<id>.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유(이 결과 페이지) · 다시 하기(같은 언어의 시작 화면).
 * 숫자는 진짜만:
 *   - "내 답이 기운 쪽" 게이지 = 이 브라우저에서 방금 고른 답으로 newyear.js 가 계산한 위치(sessionStorage ny_last, 같은 결과일 때만). 공유로 온 방문자에겐 숨김.
 *   - "N% 같은 결과" = 서버(poll_vote/poll_results)의 실제 합계가 20 이상일 때만. 꺼져 있거나 실패하면 숨김.
 * 값은 생성기가 window.NEWYEAR_RESULT 로 인라인한다 (tools/gen-i18n.js).
 */
(function () {
  'use strict';

  var P = window.NEWYEAR_RESULT || {};
  var CORE = window.NEWYEAR_CORE;
  var VOTED = 'ny_voted_' + (CORE && CORE.YEAR); // 해마다 따로(poll id 도 연도별)
  var MIN_TOTAL = 20; // 참여가 너무 적으면 비율이 의미 없어서 숨긴다
  var TIMEOUT = 6000;
  var lang = document.documentElement.lang || 'en';

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* noop */ }
    return null;
  }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { /* noop */ }
    return null;
  }

  if (P.share && window.setShareData) window.setShareData(P.share);
  if (P.retry && window.setRetry) window.setRetry(P.retry);

  // 내 답이 기운 쪽 (방금 이 결과를 받은 경우만)
  var mine = null;
  try {
    var last = JSON.parse(ss('ny_last') || 'null');
    if (last && last.id === P.id && Array.isArray(last.lean) && last.lean.length === 3 &&
        last.lean.every(function (x) { return typeof x === 'number' && x >= 0 && x <= 100; })) mine = last.lean;
  } catch (e) { mine = null; }
  var lean = document.getElementById('lean');
  if (lean && mine) {
    var dots = lean.querySelectorAll('.ny-lean-dot');
    for (var i = 0; i < 3; i++) if (dots[i]) dots[i].style.left = mine[i] + '%';
    lean.hidden = false;
  }

  // 공유 링크로 들어온 방문자(이 브라우저에서 방금 테스트를 안 한 경우)에게만 위쪽 "나도 해 보기"
  var took = ss('ny_took') === '1';
  var cta = document.getElementById('share-cta');
  if (cta && !took) {
    cta.hidden = false;
    cta.addEventListener('click', function () { if (window.track) window.track('cta_try'); });
  }

  // 같은 결과 비율 (실제 서버 값만)
  var el = document.getElementById('same-share');
  var supa = window.supa;
  if (!el || !CORE || !P.id || !supa || !supa.enabled()) return;

  function withTimeout(p) {
    return Promise.race([Promise.resolve(p), new Promise(function (r) { setTimeout(function () { r(null); }, TIMEOUT); })]);
  }

  var fresh = ss('ny_new') === P.id;
  if (fresh) ss('ny_new', null);
  var voteReq = Promise.resolve(null);
  // 한 브라우저는 한 번만 센다(처음 받은 결과). 다시 해도 현재 합계만 보여 준다.
  if (fresh && ls(VOTED) !== '1') {
    var slot = CORE.pollSlot(P.id);
    voteReq = withTimeout(supa.vote(CORE.POLL, slot.qid, slot.opt)).then(function (rows) {
      if (Array.isArray(rows)) ls(VOTED, '1');
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
