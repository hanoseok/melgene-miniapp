/**
 * 선물 스타일 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = giftstyle-core.js 의 결과 id, 또는 'mystery'(시작 화면·분석 중·기본 OG: 물음표 배지 단 선물 상자 — 결과를 암시하지 않음)
 *   artSvg(id)     — 둥근 "포장지" 카드 한 장(짙은 초록 위 줄무늬·눈송이 점·리본 줄) 위에 얼굴을 단 동글동글 캐릭터 하나(SVG 도형만, 저작권 캐릭터 없음).
 *                    결과마다 다른 소품을 든다(번개 쇼핑백·공구 상자·불꽃 막대·케이크 두 조각·돋보기·두루마리 목록·털실과 바늘·티켓 두 장).
 *   mini(id)       — 단짝·정반대 카드용 작은 그림(같은 캐릭터, 그 결과 색 동그라미 바탕, 이모지 없음).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'giftstyle-core.js'));

const INK = '#2a2a3a';
const NIGHT = '#1f4d43';
const NIGHT2 = '#2b6457';
const MYSTERY = { emoji: '❔', main: '#e2a63b', deep: '#7a4a06', ink: '#fff4e0', v: null };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function face(x, y, s = 1) {
  const e = 12 * s;
  return `<g class="gs-face">
      <ellipse cx="${x - e}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="${INK}"/>
      <ellipse cx="${x + e}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="${INK}"/>
      <circle cx="${x - e - 1}" cy="${y - 1.5 * s}" r="${1.2 * s}" fill="#fff"/>
      <circle cx="${x + e - 1}" cy="${y - 1.5 * s}" r="${1.2 * s}" fill="#fff"/>
      <circle cx="${x - e * 1.85}" cy="${y + 8 * s}" r="${4.4 * s}" fill="#ff6f8e" fill-opacity=".5"/>
      <circle cx="${x + e * 1.85}" cy="${y + 8 * s}" r="${4.4 * s}" fill="#ff6f8e" fill-opacity=".5"/>
      <path d="M${x - 6 * s} ${y + 7 * s} Q${x} ${y + 13 * s} ${x + 6 * s} ${y + 7 * s}" fill="none" stroke="${INK}" stroke-width="${2.8 * s}" stroke-linecap="round"/>
    </g>`;
}

const S = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;
// 동글동글 몸통(선물하는 사람) + 발
const body = (c, cx = 100, cy = 124, rx = 48, ry = 46) => `<ellipse cx="${cx - 18}" cy="${cy + ry - 2}" rx="12" ry="6" fill="${c.deep}" ${S}/>
    <ellipse cx="${cx + 18}" cy="${cy + ry - 2}" rx="12" ry="6" fill="${c.deep}" ${S}/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.main}" ${S}/>
    <path d="M${cx - rx + 12} ${cy - 18} C${cx - rx + 16} ${cy - 30} ${cx - 20} ${cy - ry + 6} ${cx - 8} ${cy - ry + 4}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>`;
// 머리 위 작은 리본(선물하는 사람 표시)
const bow = (x, y, col = '#f05545') => `<path d="M${x} ${y} C${x - 16} ${y - 14} ${x - 22} ${y + 4} ${x} ${y} Z M${x} ${y} C${x + 16} ${y - 14} ${x + 22} ${y + 4} ${x} ${y} Z" fill="${col}" ${S} stroke-width="3"/><circle cx="${x}" cy="${y}" r="4" fill="${col}" ${S} stroke-width="2.6"/>`;
// 작은 선물 상자
const box = (x, y, w, h, col, rib = '#ffd23f') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${col}" ${S} stroke-width="3"/><rect x="${x + w / 2 - 4}" y="${y}" width="8" height="${h}" fill="${rib}"/><rect x="${x}" y="${y + h / 2 - 3}" width="${w}" height="6" fill="${rib}"/>`;

const DRAW = {
  // 순발력 히어로: 망토 + 번개 표시 쇼핑백 + 속도선
  quickfind: (c) => `<path d="M60 100 Q40 150 52 176 L100 150 Z" fill="#f05545" ${S} stroke-width="3"/>
    <path d="M20 120 H44 M16 136 H40 M24 152 H46" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>
    ${body(c)}
    ${bow(100, 80)}
    <path d="M122 128 L164 128 L160 174 L126 174 Z" fill="#fff3d6" ${S}/>
    <path d="M134 128 Q143 112 152 128" fill="none" ${S} stroke-width="3"/>
    <path d="M146 136 L136 154 L145 154 L139 168 L154 148 L145 148 L150 136 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>
    ${face(92, 118, 0.95)}`,
  // 실속 해결사: 공구 상자(머그·드라이버) 들기
  helper: (c) => `${body(c)}
    ${bow(84, 82, '#ffd23f')}
    <rect x="112" y="140" width="56" height="32" rx="5" fill="#f05545" ${S}/>
    <path d="M128 140 L128 130 L152 130 L152 140" fill="none" ${S} stroke-width="3"/>
    <rect x="112" y="150" width="56" height="5" fill="${INK}" fill-opacity=".35"/>
    <rect x="120" y="116" width="16" height="16" rx="3" fill="#fff" ${S} stroke-width="2.6"/><path d="M136 120 Q142 124 136 128" fill="none" stroke="${INK}" stroke-width="2.4"/>
    <path d="M152 108 L156 132" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><rect x="150" y="100" width="10" height="12" rx="3" fill="#5fb0e8" ${S} stroke-width="2.4"/>
    ${face(94, 116, 0.95)}`,
  // 순간 연출가: 불꽃 막대(스파클러) + 반짝이
  moment: (c) => `${body(c)}
    ${bow(110, 82, '#ffd23f')}
    <path d="M128 140 L156 86" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="158" cy="82" r="7" fill="#fff6c2" ${S} stroke-width="2.4"/>
    <path d="M158 62 V72 M158 92 V100 M138 82 H148 M168 82 H178 M144 68 L150 74 M172 68 L166 74 M144 96 L150 90 M172 96 L166 90" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 66 L43 74 L51 77 L43 80 L40 88 L37 80 L29 77 L37 74 Z" fill="#fff" ${S} stroke-width="2"/>
    <circle cx="34" cy="120" r="4" fill="#ff8fb0"/><circle cx="176" cy="130" r="4" fill="#8fe0c0"/>
    ${face(96, 118, 1)}`,
  // 기쁨 나눔이: 케이크 두 조각(같이 먹자)
  together: (c) => `${body(c)}
    ${bow(100, 80, '#8fe0c0')}
    <ellipse cx="148" cy="152" rx="30" ry="7" fill="#fff" ${S} stroke-width="3"/>
    <path d="M124 148 L132 126 L146 148 Z" fill="#fff3d6" ${S} stroke-width="3"/><path d="M128 138 L140 138" stroke="#ff8fb0" stroke-width="4"/>
    <path d="M150 148 L158 126 L172 148 Z" fill="#fff3d6" ${S} stroke-width="3"/><path d="M154 138 L166 138" stroke="#ff8fb0" stroke-width="4"/>
    <circle cx="132" cy="124" r="3.5" fill="#f05545"/><circle cx="158" cy="124" r="3.5" fill="#f05545"/>
    <path d="M40 92 C34 84 44 78 48 86 C52 78 62 84 56 92 L48 100 Z" fill="#ff8fb0" ${S} stroke-width="2.4"/>
    ${face(90, 118, 0.95)}`,
  // 선물 탐정: 체크 모자 + 돋보기
  detective: (c) => `${body(c)}
    <path d="M58 92 Q100 58 142 92 L136 100 Q100 86 64 100 Z" fill="#c9a46b" ${S}/>
    <path d="M80 74 L82 96 M100 68 L100 90 M120 74 L118 96" stroke="${INK}" stroke-opacity=".35" stroke-width="2.4"/>
    <path d="M136 98 L160 104 L140 108 Z" fill="#c9a46b" ${S} stroke-width="2.6"/>
    <circle cx="146" cy="138" r="16" fill="#cfe9fb" fill-opacity=".85" ${S}/>
    <path d="M140 132 Q144 128 150 130" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M134 152 L120 168" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    ${face(90, 120, 0.95)}`,
  // 위시리스트 마법사: 별 모자 + 길게 풀린 목록 두루마리
  wishlist: (c) => `${body(c)}
    <path d="M70 90 L100 34 L130 90 Z" fill="${c.deep}" ${S}/>
    <path d="M100 48 L103 56 L111 56 L105 61 L107 69 L100 64 L93 69 L95 61 L89 56 L97 56 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>
    <rect x="62" y="86" width="76" height="10" rx="5" fill="${c.deep}" ${S} stroke-width="3"/>
    <path d="M124 118 L166 118 L166 176 Q156 168 146 176 Q136 168 124 176 Z" fill="#fffdf4" ${S} stroke-width="3"/>
    <rect x="120" y="112" width="50" height="10" rx="5" fill="#f6d9a8" ${S} stroke-width="3"/>
    <path d="M130 132 L133 135 L138 129 M130 146 L133 149 L138 143 M130 160 L133 163 L138 157" fill="none" stroke="#43b98a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M143 132 H160 M143 146 H160 M143 160 H156" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    ${face(90, 124, 0.95)}`,
  // 손끝 장인: 털실 뭉치 + 뜨개바늘 + 목도리
  crafter: (c) => `${body(c)}
    ${bow(116, 82, '#ffd23f')}
    <path d="M62 132 Q100 150 138 132 L138 144 Q100 162 62 144 Z" fill="#8fd16a" ${S} stroke-width="3"/>
    <path d="M70 138 L72 146 M84 142 L85 150 M98 144 L98 152 M112 142 L111 150 M126 138 L124 146" stroke="${INK}" stroke-opacity=".35" stroke-width="2"/>
    <circle cx="152" cy="156" r="18" fill="#5fb0e8" ${S}/>
    <path d="M138 150 Q152 140 166 152 M136 160 Q152 150 168 162 M142 170 Q154 162 166 168" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.4"/>
    <path d="M140 126 L170 176 M164 124 L146 178" stroke="#c9a46b" stroke-width="4" stroke-linecap="round"/>
    <path d="M152 174 Q140 186 120 180" fill="none" stroke="#5fb0e8" stroke-width="3" stroke-linecap="round"/>
    ${face(96, 116, 0.95)}`,
  // 경험 큐레이터: 티켓 두 장 + 작은 지도 핀
  curator: (c) => `${body(c)}
    ${bow(92, 80, '#ff8fb0')}
    <g transform="rotate(-12 148 132)"><rect x="122" y="118" width="52" height="28" rx="4" fill="#ffd23f" ${S} stroke-width="3"/><path d="M160 118 V146" stroke="${INK}" stroke-width="2" stroke-dasharray="3 3"/><path d="M132 128 H152 M132 136 H148" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>
    <g transform="rotate(8 150 154)"><rect x="126" y="142" width="52" height="28" rx="4" fill="#ff8fb0" ${S} stroke-width="3"/><path d="M164 142 V170" stroke="${INK}" stroke-width="2" stroke-dasharray="3 3"/><path d="M136 152 H156 M136 160 H152" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>
    <path d="M44 100 C30 84 40 66 54 66 C68 66 78 84 64 100 L54 114 Z" fill="#f05545" ${S} stroke-width="3"/><circle cx="54" cy="82" r="6" fill="#fff"/>
    ${face(92, 118, 0.95)}`,
  // 선물 상자(시작 화면·분석 중): 결과를 암시하지 않는 중립 색
  mystery: (c) => `<rect x="54" y="92" width="92" height="80" rx="10" fill="${c.main}" ${S}/>
    <rect x="46" y="76" width="108" height="24" rx="8" fill="${c.main}" ${S}/>
    <rect x="92" y="76" width="16" height="96" fill="#f05545" ${S} stroke-width="3"/>
    <path d="M100 76 C80 50 60 64 76 76 Z M100 76 C120 50 140 64 124 76 Z" fill="#f05545" ${S} stroke-width="3"/>
    <path d="M62 106 C64 100 70 96 76 95" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>
    ${face(100, 132, 0.9)}`,
};

function character(id, c) {
  return (DRAW[id] || DRAW.mystery)(c);
}

let seq = 0;
function artSvg(id) {
  const k = ++seq;
  const c = colors(id);
  const dots = [
    [26, 30], [62, 18], [150, 24], [178, 46], [20, 90], [182, 104], [30, 150], [172, 160], [100, 22], [44, 58],
  ].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" fill-opacity=".55"/>`).join('');
  const stripes = [0, 40, 80, 120, 160, 200, 240].map((x) => `<path d="M${x - 60} 200 L${x + 40} 0" stroke="#fff" stroke-opacity=".07" stroke-width="14"/>`).join('');
  const bulbs = [30, 58, 86, 114, 142, 170].map((x, i) => `<circle cx="${x}" cy="${14 + (i % 2) * 6}" r="4.5" fill="${['#ffd23f', '#ff8fb0', '#f05545'][i % 3]}"/>`).join('');
  return `<svg class="gs-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs><clipPath id="gs-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="40"/></clipPath></defs>
  <g clip-path="url(#gs-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="${NIGHT}"/>
    <circle cx="100" cy="112" r="92" fill="${NIGHT2}"/>
    <circle cx="100" cy="112" r="80" fill="${c.main}" fill-opacity=".22"/>
    <path d="M0 10 Q50 30 100 14 T200 12" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/>
    ${stripes}${bulbs}${dots}
    <ellipse cx="100" cy="186" rx="80" ry="12" fill="#000" fill-opacity=".2"/>
  </g>
  <g class="gs-char">${character(id, c)}</g>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const badge = id === 'mystery'
    ? '<span class="gs-q" aria-hidden="true">?</span>'
    : `<span class="gs-emo" aria-hidden="true">${c.emoji}</span>`;
  return `<div class="gs-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(id)}${badge}
    </div>`;
}

// 단짝·정반대 카드용 작은 그림 (같은 캐릭터, 그 결과 색 동그라미 바탕, 이모지 없음)
function mini(id) {
  const c = colors(id);
  return `<svg class="gs-mini" viewBox="10 14 180 180" aria-hidden="true"><circle cx="100" cy="104" r="86" fill="${c.ink}" stroke="${c.main}" stroke-width="5"/><g>${character(id, c)}</g></svg>`;
}

module.exports = { hero, colors, artSvg, mini, MYSTERY, INK, NIGHT };
