/* apps/mental/result.js — 결과 페이지(r/<id>.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유(이 결과 페이지, 게이지 값이 있으면 #s=) · 다시 하기(같은 언어의 시작 화면).
 * 멘탈 게이지: 본인 12개 답으로 계산한 값(주소 #s=<0~100> 또는 방금 푼 세션의 mt_score). 없으면 게이지를 숨긴다 — 지어낸 값 없음.
 * 숫자는 진짜만: "N% 같은 결과" = 서버(poll_vote/poll_results)의 실제 합계가 20 이상일 때만. 꺼져 있거나 실패하면 숨김.
 * 값은 생성기가 window.MENTAL_RESULT 로 인라인한다 (tools/gen-i18n.js).
 */
(function () {
  'use strict';

  var P = window.MENTAL_RESULT || {};
  var CORE = window.MENTAL_CORE;
  var VOTED = 'mt_voted'; // 한 브라우저 한 번만
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
  function num(n) {
    try { return Number(n).toLocaleString(lang); } catch (e) { return String(n); }
  }

  var took = ss('mt_took') === '1';
  var fresh = ss('mt_new') === P.id;

  // 멘탈 게이지 (본인 답으로 계산한 값만)
  var score = CORE ? CORE.parseScore(location.hash) : null;
  if (score == null && fresh && CORE) score = CORE.parseScore('#s=' + (ss('mt_score') || ''));
  var bar = document.getElementById('g-bar');
  if (bar && score != null) {
    document.getElementById('g-fill').style.width = score + '%';
    document.getElementById('g-num').textContent = String(P.scoreFmt || '{n}').replace('{n}', num(score));
    document.getElementById('g-lean').textContent = [P.bandLow, P.bandMid, P.bandHigh][CORE.band(score)] || '';
    bar.setAttribute('aria-valuenow', String(score));
    bar.hidden = false;
  }

  if (P.share && window.setShareData) {
    var share = { title: P.share.title, text: P.share.text, url: P.share.url + (score != null ? '#s=' + score : '') };
    window.setShareData(share);
  }
  if (P.retry && window.setRetry) window.setRetry(P.retry);

  // 공유 링크로 들어온 방문자(이 브라우저에서 방금 테스트를 안 한 경우)에게만 위쪽 "나도 해 보기"
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

  if (fresh) ss('mt_new', null);
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
