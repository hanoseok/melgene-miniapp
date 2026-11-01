/**
 * 애착 유형 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)   — id = attach-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 결과를 알 수 없는 산호색 + 물음표)
 *   artSvg(c)       — 둥근 카드 한 장: 점무늬 바탕 위에서 천천히 다가가는 두 동그라미(두 사람)와 겹친 자리의 작은 하트.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'attach-core.js'));

// 시작 화면용: 특정 결과를 암시하지 않는 산호색 + 자두색 (결과 색과 겹치지 않게)
const MYSTERY = { emoji: '🫂', main: '#ff8a72', deep: '#3d2c4e', ink: '#fff1ec' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

let seq = 0;
function artSvg(c) {
  const k = ++seq;
  const dots = [];
  for (let y = 18; y < 200; y += 24) for (let x = (y / 24) % 2 ? 30 : 18; x < 200; x += 24) dots.push(`<circle cx="${x}" cy="${y}" r="2.2"/>`);
  return `<svg class="at-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <clipPath id="at-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="40"/></clipPath>
  </defs>
  <g clip-path="url(#at-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="${c.ink}"/>
    <g fill="${c.main}" fill-opacity=".22">${dots.join('')}</g>
    <g class="at-pair-l"><circle cx="78" cy="104" r="50" fill="${c.main}" fill-opacity=".38" stroke="#3d2c4e" stroke-width="4"/></g>
    <g class="at-pair-r"><circle cx="122" cy="104" r="50" fill="${c.main}" fill-opacity=".62" stroke="#3d2c4e" stroke-width="4"/></g>
    <path d="M100 150c-6-5-17-12-17-21a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 9-11 16-17 21z" fill="#fff" stroke="#3d2c4e" stroke-width="3" stroke-linejoin="round"/>
  </g>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="#3d2c4e" stroke-opacity=".9" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="at-q" aria-hidden="true">?</span>' : '';
  return `<div class="at-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(c)}
      <span class="at-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, artSvg, MYSTERY };
