/**
 * 좌뇌 우뇌 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = brain-core.js 의 결과 id, 또는 'mystery'(시작 화면·분석 중·기본 OG: 물음표 배지 — 결과를 암시하지 않음)
 *   artSvg(id)     — 둥근 카드 한 장(왼쪽 따뜻한 색 · 오른쪽 차가운 색으로 나뉜 바탕) 위에 얼굴을 단 귀여운 뇌 하나(SVG 도형만).
 *                    결과마다 바탕 색·주름 색이 그 결과 색, 그 결과의 생각 쪽(think 축) 반구 위에 반짝이.
 *   mini(id)       — 단짝·라이벌 카드용 작은 그림(같은 뇌, 그 결과 색 동그라미 바탕, 이모지 없음).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'brain-core.js'));

const INK = '#23304a';
const WARM = '#ff9466';
const WARM_2 = '#ffb48f';
const COOL = '#5fb1ee';
const COOL_2 = '#8fcaf5';
const MYSTERY = { emoji: '❔', main: '#8a7ae0', deep: '#3b2f86', ink: '#f3f0ff', v: null };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

const L_HEMI = 'M100 52 C88 38 64 40 58 54 C42 54 32 70 38 84 C26 94 28 116 42 122 C40 138 56 150 72 146 C80 158 96 158 100 150 Z';
const R_HEMI = 'M100 52 C112 38 136 40 142 54 C158 54 168 70 162 84 C174 94 172 116 158 122 C160 138 144 150 128 146 C120 158 104 158 100 150 Z';
const L_GYRI = 'M60 68 C70 66 76 74 72 82 M44 100 C54 96 62 102 60 112 M70 124 C78 118 88 124 86 134 M82 60 C90 64 92 74 86 80';
const R_GYRI = 'M140 68 C130 66 124 74 128 82 M156 100 C146 96 138 102 140 112 M130 124 C122 118 112 124 114 134 M118 60 C110 64 108 74 114 80';

function face(x, y, s = 1) {
  const e = 12 * s;
  return `<g class="br-face">
      <ellipse cx="${x - e}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="${INK}"/>
      <ellipse cx="${x + e}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="${INK}"/>
      <circle cx="${x - e - 1}" cy="${y - 1.4 * s}" r="${1.1 * s}" fill="#fff"/>
      <circle cx="${x + e - 1}" cy="${y - 1.4 * s}" r="${1.1 * s}" fill="#fff"/>
      <circle cx="${x - e * 1.9}" cy="${y + 8 * s}" r="${4.4 * s}" fill="#ff6f8e" fill-opacity=".5"/>
      <circle cx="${x + e * 1.9}" cy="${y + 8 * s}" r="${4.4 * s}" fill="#ff6f8e" fill-opacity=".5"/>
      <path d="M${x - 6 * s} ${y + 7 * s} Q${x} ${y + 13 * s} ${x + 6 * s} ${y + 7 * s}" fill="none" stroke="${INK}" stroke-width="${2.8 * s}" stroke-linecap="round"/>
    </g>`;
}

function sparkle(x, y, r, fill) {
  return `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
}

// 뇌 본체(200×200 좌표). side = 0(왼쪽 반짝) | 1(오른쪽 반짝) | null(반짝이 없음)
function brain(side, gyri = INK) {
  const spark = side == null ? '' : side === 0
    ? `${sparkle(40, 42, 11, '#ffd23f')}${sparkle(24, 66, 6, '#fff')}`
    : `${sparkle(160, 42, 11, '#ffd23f')}${sparkle(176, 66, 6, '#fff')}`;
  return `<path d="${L_HEMI}" fill="${WARM}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="${R_HEMI}" fill="${COOL}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M58 60 C52 72 50 84 52 92" fill="none" stroke="${WARM_2}" stroke-width="6" stroke-linecap="round"/>
    <path d="M142 60 C148 72 150 84 148 92" fill="none" stroke="${COOL_2}" stroke-width="6" stroke-linecap="round"/>
    <path d="${L_GYRI}" fill="none" stroke="${gyri}" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    <path d="${R_GYRI}" fill="none" stroke="${gyri}" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    <path d="M100 54 C96 80 104 120 100 150" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    ${face(100, 104, 1)}
    ${spark}`;
}

let seq = 0;
function artSvg(id) {
  const k = ++seq;
  const c = colors(id);
  const side = c.v ? c.v[0] : null;
  const dots = [];
  for (let y = 16; y < 200; y += 24) for (let x = (y / 24) % 2 ? 28 : 16; x < 200; x += 26) dots.push(`<circle cx="${x}" cy="${y}" r="2"/>`);
  return `<svg class="br-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs><clipPath id="br-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="44"/></clipPath></defs>
  <g clip-path="url(#br-clip-${k})">
    <rect x="0" y="0" width="100" height="200" fill="#fff1e7"/>
    <rect x="100" y="0" width="100" height="200" fill="#e9f4fe"/>
    <rect x="0" y="0" width="200" height="200" fill="${c.main}" fill-opacity=".14"/>
    <g fill="${c.main}" fill-opacity=".22">${dots.join('')}</g>
    <ellipse cx="100" cy="186" rx="80" ry="12" fill="${c.deep}" fill-opacity=".14"/>
  </g>
  <g class="br-char">${brain(side, c.deep)}</g>
  <rect x="4" y="4" width="192" height="192" rx="44" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const badge = id === 'mystery'
    ? '<span class="br-q" aria-hidden="true">?</span>'
    : `<span class="br-emo" aria-hidden="true">${c.emoji}</span>`;
  return `<div class="br-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(id)}${badge}
    </div>`;
}

// 단짝·라이벌 카드용 작은 그림 (같은 뇌, 그 결과 색 동그라미 바탕, 이모지 없음)
function mini(id) {
  const c = colors(id);
  return `<svg class="br-mini" viewBox="10 20 180 170" aria-hidden="true"><circle cx="100" cy="102" r="82" fill="${c.ink}" stroke="${c.main}" stroke-width="5"/><g>${brain(c.v ? c.v[0] : null, c.deep)}</g></svg>`;
}

module.exports = { hero, colors, artSvg, mini, MYSTERY, INK, WARM, COOL };
