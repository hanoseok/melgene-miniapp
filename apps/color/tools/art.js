/**
 * 퍼스널 컬러 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)   — id = color-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 무채색에서 무지개로 번지는 꽃잎 + 물음표 — 결과를 알 수 없음)
 *   fanSvg(colors)  — 가운데 동그라미를 둘러싼 꽃잎 8장(컬러 칩 부채). 결과 그림은 그 결과의 베스트 컬러 8개.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'color-core.js'));

// 시작 화면용: 특정 결과를 암시하지 않도록 색상환을 고르게 도는 8색
const MYSTERY = {
  emoji: '🎨', main: '#c97b9a', deep: '#6b3a55', ink: '#fbf5f7',
  best: ['#f4a6a6', '#f7c59f', '#f3e3a0', '#b9dfa8', '#9fd8d0', '#a8c4ef', '#c3b1ea', '#e9b0d3'],
};

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function fanSvg(list) {
  const petals = list.map((c, i) => {
    const a = (i * 360) / list.length;
    return `<ellipse cx="100" cy="46" rx="25" ry="40" fill="${c}" stroke="#ffffff" stroke-width="3" transform="rotate(${a} 100 100)"/>`;
  }).join('');
  return `<svg class="pc-fan" viewBox="0 0 200 200" aria-hidden="true">${petals}<circle cx="100" cy="100" r="40" fill="#ffffff"/><circle cx="100" cy="100" r="34" fill="var(--h-ink, #fbf5f7)" stroke="var(--h-main, #c97b9a)" stroke-width="3" stroke-dasharray="4 5"/></svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="pc-q" aria-hidden="true">?</span>' : '';
  return `<div class="pc-hero ${cls}" style="--h-main:${c.main};--h-ink:${c.ink}" aria-hidden="true">
      ${fanSvg(c.best)}
      <span class="pc-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, fanSvg, MYSTERY };
