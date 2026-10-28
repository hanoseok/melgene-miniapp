/**
 * 새해 운세 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)   — id = newyear-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 금빛 해돋이 + 수정 구슬 + 물음표 — 결과를 알 수 없음)
 *   dawnSvg(c)      — 둥근 카드 한 장: 새벽 하늘(남색 → 복숭아빛)·별·지평선 위로 떠오르는 해(결과 색)·햇살·먼 산·잔잔한 물결·작은 불꽃.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'newyear-core.js'));

// 시작 화면용: 특정 결과를 암시하지 않는 금빛 해 (결과 색과 겹치지 않게)
const MYSTERY = { emoji: '🔮', main: '#ffd36e', deep: '#c98f1e', ink: '#2b2008' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

let seq = 0;
function dawnSvg(c) {
  const k = ++seq;
  const stars = [[30, 28], [56, 46], [150, 22], [176, 50], [100, 30], [20, 66], [184, 82]]
    .map(([x, y], i) => `<circle class="ny-star" cx="${x}" cy="${y}" r="${i % 3 ? 1.3 : 1.9}" fill="#fff8e8" style="animation-delay:-${i * 0.6}s"/>`).join('');
  const rays = Array.from({ length: 9 }, (_, i) => {
    const a = (Math.PI * (i + 1)) / 10;
    const x1 = 100 - Math.cos(a) * 44, y1 = 132 - Math.sin(a) * 44;
    const x2 = 100 - Math.cos(a) * 70, y2 = 132 - Math.sin(a) * 70;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join('');
  return `<svg class="ny-dawn" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <linearGradient id="ny-sky-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f4a"/><stop offset=".55" stop-color="#5b3a78"/><stop offset="1" stop-color="#f29e7c"/></linearGradient>
    <radialGradient id="ny-glow-${k}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${c.main}" stop-opacity=".7"/><stop offset="1" stop-color="${c.main}" stop-opacity="0"/></radialGradient>
    <clipPath id="ny-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="34"/></clipPath>
  </defs>
  <g clip-path="url(#ny-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="url(#ny-sky-${k})"/>
    ${stars}
    <g class="ny-spark"><circle cx="44" cy="40" r="2" fill="${c.main}"/><path d="M44 30v6M44 44v6M34 40h6M48 40h6M37 33l4 4M47 43l4 4M51 33l-4 4M41 43l-4 4" stroke="${c.main}" stroke-width="1.6" stroke-linecap="round"/></g>
    <circle cx="100" cy="132" r="76" fill="url(#ny-glow-${k})"/>
    <g class="ny-rays" stroke="${c.main}" stroke-width="3" stroke-linecap="round" opacity=".75">${rays}</g>
    <circle class="ny-sun" cx="100" cy="132" r="34" fill="${c.main}"/>
    <path d="M0 140 L34 112 L58 128 L88 104 L118 130 L146 110 L176 126 L200 116 V200 H0z" fill="#2a2150" opacity=".85"/>
    <rect x="0" y="146" width="200" height="54" fill="#1b1838"/>
    <g fill="${c.main}" opacity=".55"><rect x="62" y="152" width="76" height="3" rx="1.5"/><rect x="74" y="162" width="52" height="3" rx="1.5" opacity=".75"/><rect x="86" y="172" width="28" height="3" rx="1.5" opacity=".55"/></g>
  </g>
  <rect x="4" y="4" width="192" height="192" rx="34" fill="none" stroke="${c.main}" stroke-opacity=".6" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="ny-q" aria-hidden="true">?</span>' : '';
  return `<div class="ny-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${dawnSvg(c)}
      <span class="ny-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, dawnSvg, MYSTERY };
