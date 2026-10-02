/* apps/past-life/result.js — 결과 페이지(r/*.html)
 * 별점·하트·광고·공유·FAQ·다시 하기·다른 미니앱은 공통 끝 화면(<div data-mg-end>, shared/common.js)이 그린다.
 * 여기서는 앱별 값만 등록한다: 공유 문구/주소(canonical)와 다시 하기(같은 언어의 시작 화면).
 * 값은 생성기가 window.PL_RESULT 로 인라인한다 (tools/gen-results.js).
 */
(function () {
  'use strict';

  var P = window.PL_RESULT || {};
  if (P.share && window.setShareData) window.setShareData(P.share);
  if (P.retry && window.setRetry) window.setRetry(P.retry);

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 공유 링크로 들어온 방문자(이 브라우저에서 퀴즈를 직접 안 푼 경우)에게만 상단 "나도 해보기" 안내
  var cta = document.getElementById('share-cta');
  if (cta) {
    var tookQuiz = false;
    try { tookQuiz = sessionStorage.getItem('pl_took_quiz') === '1'; } catch (e) { /* noop */ }
    if (!tookQuiz) {
      cta.classList.add('show');
      cta.addEventListener('click', function () { if (window.track) window.track('cta_try'); });
    }
  }
})();
