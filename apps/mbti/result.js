/* apps/mbti/result.js — 결과 페이지(r/<id>.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유(이 결과 페이지 + 축 비율 #d=) · 다시 하기(같은 언어의 시작 화면).
 * 축 비율 막대는 주소의 #d=(방금 푼 답에서 계산한 값, 또는 친구가 공유한 값)가 이 유형과 맞을 때만 보여 주고, 없으면 숨긴다.
 * "같은 유형이 나온 비율"은 서버(poll_vote/poll_results)의 실제 합계로만 보여 주고, 꺼져 있거나 실패하면 숨긴다.
 * 값은 생성기가 window.MBTI_RESULT 로 인라인한다 (tools/gen-i18n.js).
 */
(function () {
  'use strict';

  var P = window.MBTI_RESULT || {};
  var CORE = window.MBTI_CORE;
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

  // 축 비율 (#d=) — 유형 글자와 맞는 값만
  var m = /(?:^#|&)d=([A-Za-z0-9_-]+)/.exec(window.location.hash || '');
  var pctRaw = m ? m[1] : '';
  var pct = CORE && pctRaw ? CORE.decodePct(pctRaw, P.id) : null;
  var bars = document.getElementById('axis-bars');
  if (pct && bars) {
    for (var a = 0; a < 4; a++) {
      var fill = bars.querySelector('[data-axis="' + a + '"]');
      var pa = bars.querySelector('[data-pct-a="' + a + '"]');
      var pb = bars.querySelector('[data-pct-b="' + a + '"]');
      if (fill) fill.style.width = pct[a] + '%';
      if (pa) pa.textContent = pct[a] + '%';
      if (pb) pb.textContent = (100 - pct[a]) + '%';
    }
    bars.hidden = false;
  }

  if (window.setShareData && P.share) {
    window.setShareData(function () {
      var s = { title: P.share.title, text: P.share.text, url: P.share.url };
      if (pct) s.url = P.share.url + '#d=' + pctRaw;
      return s;
    });
  }
  if (P.retry && window.setRetry) window.setRetry(P.retry);

  // 공유 링크로 들어온 방문자(이 브라우저에서 방금 테스트를 안 한 경우)에게만 위쪽 "나도 해 보기"
  var took = ss('mb_took') === '1';
  var cta = document.getElementById('share-cta');
  if (cta && !took) {
    cta.hidden = false;
    cta.addEventListener('click', function () { if (window.track) window.track('cta_try'); });
  }

  // 같은 유형 비율 (실제 서버 값만)
  var el = document.getElementById('same-share');
  var supa = window.supa;
  if (!el || !CORE || !P.id || !supa || !supa.enabled()) return;

  function withTimeout(p) {
    return Promise.race([Promise.resolve(p), new Promise(function (r) { setTimeout(function () { r(null); }, TIMEOUT); })]);
  }

  var fresh = ss('mb_new') === P.id;
  if (fresh) ss('mb_new', null);
  var voteReq = Promise.resolve(null);
  // 한 브라우저는 한 번만 센다(처음 받은 결과). 다시 해도 현재 합계만 보여 준다.
  if (fresh && ls('mb_voted_v1') !== '1') {
    var slot = CORE.pollSlot(P.id);
    voteReq = withTimeout(supa.vote(CORE.POLL, slot.qid, slot.opt)).then(function (rows) {
      if (Array.isArray(rows)) ls('mb_voted_v1', '1');
      return rows;
    }, function () { return null; });
  }

  voteReq.then(function () { return withTimeout(supa.pollResults(CORE.POLL)); })
    .then(function (rows) {
      var c = CORE.pollCounts(rows);
      if (!c || c.total < MIN_TOTAL || !c.counts[P.id]) return;
      var p = (c.counts[P.id] / c.total) * 100;
      var txt;
      try { txt = p.toLocaleString(lang, { maximumFractionDigits: p < 10 ? 1 : 0 }); } catch (e) { txt = String(Math.round(p)); }
      el.textContent = String(P.sameShare || '').replace('{pct}', txt);
      el.hidden = false;
    })
    .catch(function () { /* 숨긴 채로 둔다 */ });
})();
