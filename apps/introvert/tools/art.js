/**
 * 내향형 외향형 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = introvert-core.js 의 결과 id, 또는 'mystery'(시작 화면·분석 중·기본 OG: 물음표 배지 — 결과를 암시하지 않음)
 *   artSvg(id)     — 둥근 카드 한 장(왼쪽 조용한 밤 색 · 오른쪽 환한 낮 색으로 나뉜 바탕) 위에 얼굴을 단 말랑한 "에너지 콩" 하나(SVG 도형만).
 *                    결과마다: 바탕·볼 색 = 결과 색, recharge 축(0 혼자 → 달 / 1 사람들 → 해), circle 축(0 → 작은 친구 1 / 1 → 작은 친구 3),
 *                    voice 축(0 → 생각 풍선 / 1 → 말풍선). 'mystery' 는 장식 없이 콩만.
 *   mini(id)       — 단짝·라이벌 카드용 작은 그림(같은 콩, 그 결과 색 동그라미 바탕, 이모지 없음).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'introvert-core.js'));

const INK = '#262a4a';
const NIGHT = '#e9ebfb';
const DAY = '#fff3dc';
const MYSTERY = { emoji: '❔', main: '#8a7ae0', deep: '#3b2f86', ink: '#f3f0ff', v: null };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function face(x, y, s = 1) {
  const e = 13 * s;
  return `<g class="iv-face">
      <ellipse cx="${x - e}" cy="${y}" rx="${3.6 * s}" ry="${4.4 * s}" fill="${INK}"/>
      <ellipse cx="${x + e}" cy="${y}" rx="${3.6 * s}" ry="${4.4 * s}" fill="${INK}"/>
      <circle cx="${x - e - 1}" cy="${y - 1.5 * s}" r="${1.2 * s}" fill="#fff"/>
      <circle cx="${x + e - 1}" cy="${y - 1.5 * s}" r="${1.2 * s}" fill="#fff"/>
      <circle cx="${x - e * 1.9}" cy="${y + 8 * s}" r="${4.6 * s}" fill="#ff6f8e" fill-opacity=".5"/>
      <circle cx="${x + e * 1.9}" cy="${y + 8 * s}" r="${4.6 * s}" fill="#ff6f8e" fill-opacity=".5"/>
      <path d="M${x - 6 * s} ${y + 7 * s} Q${x} ${y + 13 * s} ${x + 6 * s} ${y + 7 * s}" fill="none" stroke="${INK}" stroke-width="${2.8 * s}" stroke-linecap="round"/>
    </g>`;
}

// 말랑한 콩 본체 (200×200 좌표, 가운데 아래쪽)
function bean(main, deep) {
  return `<path d="M100 62 C140 62 158 92 158 124 C158 156 132 170 100 170 C68 170 42 156 42 124 C42 92 60 62 100 62 Z" fill="#fff" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M100 62 C140 62 158 92 158 124 C158 156 132 170 100 170 C68 170 42 156 42 124 C42 92 60 62 100 62 Z" fill="${main}" fill-opacity=".28"/>
    <path d="M62 96 C66 84 76 76 88 72" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-opacity=".9"/>
    <path d="M70 168 L72 178 M130 168 L128 178" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <rect x="86" y="140" width="28" height="12" rx="4" fill="#fff" stroke="${deep}" stroke-width="2.4"/>`;
}

function moon(x, y) {
  return `<path d="M${x + 8} ${y - 14} A16 16 0 1 0 ${x + 12} ${y + 10} A12 12 0 1 1 ${x + 8} ${y - 14} Z" fill="#ffe27a" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
}
function sun(x, y) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const r = (a * Math.PI) / 180;
    return `M${(x + Math.cos(r) * 16).toFixed(1)} ${(y + Math.sin(r) * 16).toFixed(1)} L${(x + Math.cos(r) * 22).toFixed(1)} ${(y + Math.sin(r) * 22).toFixed(1)}`;
  }).join(' ');
  return `<path d="${rays}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="11" fill="#ffc23d" stroke="${INK}" stroke-width="2.6"/>`;
}
function buddy(x, y, r, fill) {
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${INK}" stroke-width="2.4"/><circle cx="${x - r * 0.35}" cy="${y - r * 0.1}" r="${r * 0.13}" fill="${INK}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.1}" r="${r * 0.13}" fill="${INK}"/></g>`;
}
function thought(x, y, fill) {
  return `<circle cx="${x - 22}" cy="${y + 22}" r="3.5" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${x - 13}" cy="${y + 13}" r="5" fill="#fff" stroke="${INK}" stroke-width="2"/>
    <ellipse cx="${x + 8}" cy="${y - 4}" rx="20" ry="14" fill="#fff" stroke="${INK}" stroke-width="2.6"/><circle cx="${x + 1}" cy="${y - 4}" r="2.2" fill="${fill}"/><circle cx="${x + 8}" cy="${y - 4}" r="2.2" fill="${fill}"/><circle cx="${x + 15}" cy="${y - 4}" r="2.2" fill="${fill}"/>`;
}
function speech(x, y, fill) {
  return `<path d="M${x - 20} ${y - 18} H${x + 22} A6 6 0 0 1 ${x + 28} ${y - 12} V${y + 4} A6 6 0 0 1 ${x + 22} ${y + 10} H${x - 4} L${x - 16} ${y + 20} L${x - 12} ${y + 10} H${x - 20} A6 6 0 0 1 ${x - 26} ${y + 4} V${y - 12} A6 6 0 0 1 ${x - 20} ${y - 18} Z" fill="#fff" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M${x - 14} ${y - 8} H${x + 16} M${x - 14} ${y + 1} H${x + 6}" stroke="${fill}" stroke-width="3.2" stroke-linecap="round"/>`;
}

// 결과 장식: v = [recharge, circle, voice] 또는 null(mystery)
function props(c) {
  if (!c.v) return '';
  const [recharge, circle, voice] = c.v;
  const sky = recharge ? sun(166, 34) : moon(164, 34);
  const friends = circle
    ? `${buddy(30, 158, 11, c.ink)}${buddy(170, 160, 11, c.ink)}${buddy(178, 128, 8, c.ink)}`
    : buddy(170, 158, 12, c.ink);
  const bubble = voice ? speech(52, 40, c.main) : thought(48, 38, c.main);
  return `${sky}${friends}${bubble}`;
}

function character(c) {
  return `${bean(c.main, c.deep)}
    ${face(100, 118, 1)}
    ${props(c)}`;
}

let seq = 0;
function artSvg(id) {
  const k = ++seq;
  const c = colors(id);
  const dots = [];
  for (let y = 16; y < 200; y += 24) for (let x = (y / 24) % 2 ? 28 : 16; x < 200; x += 26) dots.push(`<circle cx="${x}" cy="${y}" r="2"/>`);
  return `<svg class="iv-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs><clipPath id="iv-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="44"/></clipPath></defs>
  <g clip-path="url(#iv-clip-${k})">
    <rect x="0" y="0" width="100" height="200" fill="${NIGHT}"/>
    <rect x="100" y="0" width="100" height="200" fill="${DAY}"/>
    <rect x="0" y="0" width="200" height="200" fill="${c.main}" fill-opacity=".12"/>
    <g fill="${c.main}" fill-opacity=".22">${dots.join('')}</g>
    <ellipse cx="100" cy="186" rx="80" ry="12" fill="${c.deep}" fill-opacity=".14"/>
  </g>
  <g class="iv-char">${character(c)}</g>
  <rect x="4" y="4" width="192" height="192" rx="44" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const badge = id === 'mystery'
    ? '<span class="iv-q" aria-hidden="true">?</span>'
    : `<span class="iv-emo" aria-hidden="true">${c.emoji}</span>`;
  return `<div class="iv-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(id)}${badge}
    </div>`;
}

// 단짝·라이벌 카드용 작은 그림 (같은 콩, 그 결과 색 동그라미 바탕, 이모지 없음)
function mini(id) {
  const c = colors(id);
  return `<svg class="iv-mini" viewBox="10 14 180 180" aria-hidden="true"><circle cx="100" cy="104" r="86" fill="${c.ink}" stroke="${c.main}" stroke-width="5"/><g>${character(c)}</g></svg>`;
}

module.exports = { hero, colors, artSvg, mini, MYSTERY, INK, NIGHT, DAY };
