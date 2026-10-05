/**
 * 동물 캐릭터 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = animal-core.js 의 유형 id, 또는 'mystery'(시작 화면·기본 OG: 무엇이 나올지 알 수 없는 발자국 + 물음표)
 *   mini(id)       — 찰떡궁합·앙숙 카드용 작은 캐릭터
 * 그림 = 유형 색 후광(동그라미) + 귀여운 동물 이모지 + 둥실 떠다니는 발자국. 색은 인라인 CSS 변수로만 넣는다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'animal-core.js'));

// 시작 화면용 — 결과 색과 겹치지 않는 색(검사: index 에 결과 색이 없어야 함)
const MYSTERY = { emoji: '🐾', color: '#3fae8a', deep: '#14684f', ink: '#dff5ec' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="an-q" aria-hidden="true">?</span>' : '';
  return `<div class="an-hero ${cls}" style="--h-main:${c.color};--h-ink:${c.ink}" aria-hidden="true">
      <span class="an-halo"></span>
      <span class="an-heart an-heart-1">🐾</span><span class="an-heart an-heart-2">🐾</span><span class="an-heart an-heart-3">🐾</span>
      <span class="an-emo">${c.emoji}</span>${q}
    </div>`;
}

function mini(id) {
  const c = colors(id);
  return `<span class="an-mini" style="--h-main:${c.color}" aria-hidden="true">${c.emoji}</span>`;
}

module.exports = { hero, mini, colors, MYSTERY };
