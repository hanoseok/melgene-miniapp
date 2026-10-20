/* apps/homebody/result.js — 결과 페이지(r/<id>.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유(이 결과 페이지, 현재 언어) · 다시 하기(같은 언어의 시작 화면).
 * 방금 테스트를 푼 브라우저에서는 정확한 지수(%)를 보여 주고 공유 문구에도 넣는다. 공유 링크로 온 방문자는 이 단계의 범위만 본다.
 * "나보다 집순이·집돌이인 사람 비율"은 서버(poll_vote/poll_results)의 실제 합계로만 보여 주고, 20표 미만이거나 꺼져 있거나 실패하면 숨긴다.
 * 값은 생성기가 window.HOMEBODY_RESULT 로 인라인한다 (tools/gen-i18n.js).
 */
(function () {
  'use strict';

  var P = window.HOMEBODY_RESULT || {};
  var CORE = window.HOMEBODY_CORE;
  var MIN_TOTAL = 20; // 참여가 너무 적으면 백분위가 의미 없어서 숨긴다
  var TIMEOUT = 6000;

  if (P.share && window.setShareData) window.setShareData(P.share);
  if (P.retry && window.setRetry) window.setRetry(P.retry);

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

  // 공유 링크로 들어온 방문자(이 브라우저에서 방금 테스트를 안 한 경우)에게만 위쪽 "나도 해 보기"
  var took = ss('hb_took') === '1';
  var cta = document.getElementById('share-cta');
  if (cta && !took) {
    cta.hidden = false;
    cta.addEventListener('click', function () { if (window.track) window.track('cta_try'); });
  }

  if (!CORE || !P.id) return;
  var lang = document.documentElement.lang || 'en';
  function fmtNum(n, digits) {
    try { return n.toLocaleString(lang, { maximumFractionDigits: digits }); } catch (e) { return String(Math.round(n)); }
  }

  // 방금 푼 결과면(같은 단계) 정확한 지수를 보여 준다. 새로고침해도 같은 세션 동안 유지.
  var fresh = ss('hb_new') === P.id;
  var pct = null;
  var saved = Number(ss('hb_score'));
  if (took && saved >= 0 && saved <= 100 && CORE.tierOf(saved) === P.id) pct = saved;
  if (pct != null) {
    var numEl = document.getElementById('meter-num');
    var fillEl = document.getElementById('meter-fill');
    if (numEl) numEl.textContent = fmtNum(pct, 0) + '%';
    if (fillEl) fillEl.style.width = pct + '%';
    if (P.share && P.shareTextPct && window.setShareData) {
      window.setShareData({ title: P.share.title, url: P.share.url, text: String(P.shareTextPct).replace('{pct}', fmtNum(pct, 0)) });
    }
  }

  // 나보다 집순이·집돌이인 사람 비율 (실제 서버 값만, 방금 푼 사람에게만)
  var el = document.getElementById('same-share');
  var supa = window.supa;
  if (!el || pct == null || !supa || !supa.enabled()) return;

  function withTimeout(p) {
    return Promise.race([Promise.resolve(p), new Promise(function (r) { setTimeout(function () { r(null); }, TIMEOUT); })]);
  }

  var voteReq = Promise.resolve(null);
  if (fresh) ss('hb_new', null);
  // 한 브라우저는 한 번만 센다(처음 받은 결과). 다시 해도 현재 합계만 보여 준다.
  if (fresh && ls('hb_voted_v1') !== '1') {
    var slot = CORE.pollSlot(pct);
    voteReq = withTimeout(supa.vote(CORE.POLL, slot.qid, slot.opt)).then(function (rows) {
      if (Array.isArray(rows)) ls('hb_voted_v1', '1');
      return rows;
    }, function () { return null; });
  }

  voteReq.then(function () { return withTimeout(supa.pollResults(CORE.POLL)); })
    .then(function (rows) {
      var c = CORE.pollCounts(rows);
      if (!c || c.total < MIN_TOTAL) return;
      var share = CORE.moreHomebodyShare(c.counts, c.total, pct);
      if (share == null) return;
      el.textContent = String(P.moreShare || '').replace('{pct}', fmtNum(share, share < 10 ? 1 : 0));
      el.hidden = false;
    })
    .catch(function () { /* 숨긴 채로 둔다 */ });
})();
