/**
 * 공포영화 생존 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)   — id = horror-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 창문에 불 켜진 언덕 위 집 + 물음표 — 결과를 알 수 없음)
 *   posterSvg(c)    — 둥근 영화 포스터 한 장: 밤하늘·별·보름달(결과 색)·언덕 위 낡은 집 실루엣·나무. 피·무기·괴물 없음(PG).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'horror-core.js'));

// 시작 화면용: 특정 결과를 암시하지 않는 촛불빛
const MYSTERY = { emoji: '🎃', main: '#f4a259', deep: '#a8601c', ink: '#2a1a0c' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

let seq = 0;
function posterSvg(c) {
  const k = ++seq;
  const stars = [[34, 30], [58, 52], [150, 26], [172, 58], [118, 40], [22, 74], [184, 92]]
    .map(([x, y], i) => `<circle class="hr-star" cx="${x}" cy="${y}" r="${i % 3 ? 1.4 : 2}" fill="#fff6e0" style="animation-delay:-${i * 0.7}s"/>`).join('');
  return `<svg class="hr-poster" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <radialGradient id="hr-glow-${k}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c.main}" stop-opacity=".55"/><stop offset="1" stop-color="${c.main}" stop-opacity="0"/></radialGradient>
    <linearGradient id="hr-skyg-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1030"/><stop offset="1" stop-color="#3a1d3f"/></linearGradient>
    <clipPath id="hr-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="34"/></clipPath>
  </defs>
  <g clip-path="url(#hr-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="url(#hr-skyg-${k})"/>
    ${stars}
    <circle cx="140" cy="62" r="46" fill="url(#hr-glow-${k})"/>
    <circle cx="140" cy="62" r="24" fill="${c.main}"/>
    <circle cx="131" cy="56" r="4" fill="#000" opacity=".08"/><circle cx="148" cy="70" r="3" fill="#000" opacity=".08"/>
    <path class="hr-bat" d="M52 70 q5 -6 10 0 q3 -3 6 0 q-4 1 -8 4 q-4 -3 -8 -4z" fill="#0b0712"/>
    <path d="M0 160 Q50 128 100 138 T200 150 V200 H0z" fill="#140a1d"/>
    <g fill="#0b0712">
      <path d="M70 140 V104 L96 82 L122 104 V140z"/>
      <path d="M108 92 V78 h7 v20z"/>
      <path d="M62 140 L46 140 L46 118 L58 110 L70 118z"/>
      <path d="M150 150 c-2 -18 2 -30 0 -44 c6 10 4 20 8 30 c3 -10 2 -14 6 -22 c0 14 -4 24 -6 36z"/>
      <path d="M22 156 c0 -16 -6 -22 -2 -36 c4 8 6 14 8 22 c2 -8 6 -12 6 -18 c2 12 -2 22 -4 32z"/>
    </g>
    <rect class="hr-win" x="88" y="104" width="8" height="10" rx="1" fill="${c.main}"/>
    <rect class="hr-win hr-win-2" x="104" y="116" width="7" height="9" rx="1" fill="${c.main}" opacity=".85"/>
    <rect x="52" y="122" width="5" height="7" fill="${c.main}" opacity=".55"/>
    <path d="M0 176 Q60 164 120 172 T200 168 V200 H0z" fill="#fff" opacity=".07"/>
  </g>
  <rect x="4" y="4" width="192" height="192" rx="34" fill="none" stroke="${c.main}" stroke-opacity=".55" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="hr-q" aria-hidden="true">?</span>' : '';
  return `<div class="hr-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${posterSvg(c)}
      <span class="hr-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, posterSvg, MYSTERY };
