/* apps/spend/result.js — 결과 페이지(r/<id>.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유(이 결과 페이지) · 다시 하기(같은 언어의 시작 화면).
 * 숫자는 진짜만:
 *   - 스타일 비율 막대 = 이 브라우저에서 방금 고른 답으로 spend.js 가 계산한 값(sessionStorage sp_last, 같은 결과일 때만). 공유로 온 방문자에겐 숨김.
 *   - "같은 유형 N%" = 서버(poll_vote/poll_results)의 실제 합계가 20 이상일 때만. 꺼져 있거나 실패하면 숨김.
 * 값은 생성기가 window.SPEND_RESULT 로 인라인한다 (tools/gen-i18n.js).
 */
(function () {
  'use strict';

  var P = window.SPEND_RESULT || {};
  var CORE = window.SPEND_CORE;
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

  // 내 답으로 계산한 스타일 비율 (방금 이 결과를 받은 경우만)
  var mine = null;
  try {
    var last = JSON.parse(ss('sp_last') || 'null');
    if (last && last.id === P.id && Array.isArray(last.pct) && last.pct.length === 4 &&
        last.pct.every(function (x) { return typeof x === 'number' && x >= 0 && x <= 100; })) mine = last.pct.map(Math.round);
  } catch (e) { mine = null; }

  // 공유: 내 비율이 있으면 그 숫자를 넣은 문구, 없으면 결과만
  if (window.setShareData && P.share) {
    window.setShareData(function () {
      var s = { title: P.share.title, text: P.share.text, url: P.share.url };
      if (mine && P.shareTextPct) {
        s.text = P.shareTextPct.replace('{s}', num(mine[0])).replace('{v}', num(mine[1])).replace('{f}', num(mine[2])).replace('{i}', num(mine[3]));
      }
      return s;
    });
  }
  if (P.retry && window.setRetry) window.setRetry(P.retry);

  var mix = document.getElementById('mix');
  if (mix && mine) {
    var fills = mix.querySelectorAll('.sp-mix-fill'), pcts = mix.querySelectorAll('.sp-mix-pct');
    for (var i = 0; i < 4; i++) {
      if (pcts[i]) pcts[i].textContent = num(mine[i]) + '%';
      if (fills[i]) fills[i].style.width = mine[i] + '%';
    }
    mix.hidden = false;
  }

  // 공유 링크로 들어온 방문자(이 브라우저에서 방금 테스트를 안 한 경우)에게만 위쪽 "나도 해 보기"
  var took = ss('sp_took') === '1';
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

  var fresh = ss('sp_new') === P.id;
  if (fresh) ss('sp_new', null);
  var voteReq = Promise.resolve(null);
  // 한 브라우저는 한 번만 센다(처음 받은 결과). 다시 해도 현재 합계만 보여 준다.
  if (fresh && ls('sp_voted_v1') !== '1') {
    var slot = CORE.pollSlot(P.id);
    voteReq = withTimeout(supa.vote(CORE.POLL, slot.qid, slot.opt)).then(function (rows) {
      if (Array.isArray(rows)) ls('sp_voted_v1', '1');
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
