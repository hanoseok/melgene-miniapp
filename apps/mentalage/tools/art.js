/**
 * 정신연령 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = mentalage-core.js 의 유형 id, 또는 'mystery'(시작 화면·기본 OG: 물음표 달린 뇌 — 결과를 알 수 없음)
 *   mini(id)       — 단짝·라이벌 카드용 작은 그림
 * 그림 = 공책에 붙인 파스텔 포스트잇(살짝 기울임) + 이모지 + 연필 낙서(별·소용돌이). 색은 인라인 CSS 변수로만 넣는다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'mentalage-core.js'));

// 시작 화면용 — 결과 색과 겹치지 않는 색(검사: index 에 결과 색이 없어야 함)
const MYSTERY = { emoji: '🧠', color: '#f7a8c4', deep: '#7a4fb8', ink: '#fff1f6' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="ma-q" aria-hidden="true">?</span>' : '';
  return `<div class="ma-hero ${cls}" style="--h-main:${c.color};--h-ink:${c.ink};--h-deep:${c.deep}" aria-hidden="true">
      <span class="ma-note"></span>
      <svg class="ma-scribble" viewBox="0 0 200 200" aria-hidden="true"><path d="M22 40c8-10 18-10 22 0s14 10 22 0M150 28l6 12 13 2-10 9 3 13-12-6-12 6 3-13-10-9 13-2z M30 160c10 8 24 8 34-2M160 150c-6 10 0 20 10 18s8-14-2-16-14 10-6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="ma-emo">${c.emoji}</span>${q}
    </div>`;
}

function mini(id) {
  const c = colors(id);
  return `<span class="ma-mini" style="--h-main:${c.color}" aria-hidden="true">${c.emoji}</span>`;
}

module.exports = { hero, mini, colors, MYSTERY };
