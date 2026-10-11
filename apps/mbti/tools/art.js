/**
 * MBTI 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = mbti-core.js 의 유형 id, 또는 'mystery'(시작 화면·기본 OG: 물음표 타일 네 장 — 결과를 알 수 없음)
 *   mini(id)       — 찰떡궁합·상극 카드용 작은 그림(이모지)
 * 그림 = 2×2 글자 타일(살짝 기울어진 스티커) + 가운데 이모지 배지. 색은 인라인 CSS 변수로만 넣는다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'mbti-core.js'));

// 시작 화면용 — 그룹 색과 겹치지 않는 색(검사: index 에 결과 색이 없어야 함)
const MYSTERY = { code: '????', emoji: '🧩', color: '#ff7a8a', deep: '#2b2140', ink: '#fff0f2' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function hero(id, cls = '') {
  const c = colors(id);
  const tiles = c.code.split('').map((ch, i) => `<span class="mb-tile mb-tile-${i + 1}">${ch}</span>`).join('');
  return `<div class="mb-hero ${cls}" style="--h-main:${c.color};--h-ink:${c.ink};--h-deep:${c.deep}" aria-hidden="true">
      <span class="mb-tiles">${tiles}</span>
      <span class="mb-emo">${c.emoji}</span>
    </div>`;
}

function mini(id) {
  const c = colors(id);
  return `<span class="mb-mini" style="--h-main:${c.color}" aria-hidden="true">${c.emoji}</span>`;
}

module.exports = { hero, mini, colors, MYSTERY };
