/**
 * 직업 적성 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)   — id = job-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 서류 가방 + 물음표 — 결과를 알 수 없음)
 *   badgeSvg(c)     — 둥근 카드 한 장: 모눈 바탕 위 목걸이 줄에 매달린 사원증(결과 색), 가운데 동그란 사진 자리, 이름 줄 자리.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'job-core.js'));

// 시작 화면용: 특정 결과를 암시하지 않는 남색 + 겨자색 (결과 색과 겹치지 않게)
const MYSTERY = { emoji: '💼', main: '#ffb547', deep: '#26304f', ink: '#fff6e6' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

let seq = 0;
function badgeSvg(c) {
  const k = ++seq;
  const grid = [];
  for (let i = 20; i < 200; i += 20) grid.push(`<path d="M${i} 0V200M0 ${i}H200"/>`);
  return `<svg class="jb-badge-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <clipPath id="jb-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="34"/></clipPath>
  </defs>
  <g clip-path="url(#jb-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="${c.ink}"/>
    <g stroke="${c.main}" stroke-opacity=".18" stroke-width="1">${grid.join('')}</g>
    <path class="jb-strap" d="M72 -4 L96 58 M128 -4 L104 58" stroke="${c.main}" stroke-width="10" stroke-linecap="round" fill="none"/>
    <g class="jb-swing">
      <rect x="88" y="50" width="24" height="16" rx="4" fill="#26304f"/>
      <rect x="46" y="60" width="108" height="128" rx="16" fill="#fff" stroke="#26304f" stroke-width="4"/>
      <rect x="46" y="60" width="108" height="26" rx="14" fill="${c.main}"/>
      <rect x="46" y="74" width="108" height="12" fill="${c.main}"/>
      <rect x="78" y="70" width="44" height="6" rx="3" fill="#fff" opacity=".85"/>
      <circle cx="100" cy="124" r="27" fill="${c.ink}" stroke="${c.main}" stroke-width="4"/>
      <rect x="66" y="160" width="68" height="7" rx="3.5" fill="#26304f" opacity=".75"/>
      <rect x="78" y="172" width="44" height="6" rx="3" fill="${c.main}" opacity=".7"/>
    </g>
  </g>
  <rect x="4" y="4" width="192" height="192" rx="34" fill="none" stroke="#26304f" stroke-opacity=".9" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="jb-q" aria-hidden="true">?</span>' : '';
  return `<div class="jb-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${badgeSvg(c)}
      <span class="jb-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, badgeSvg, MYSTERY };
