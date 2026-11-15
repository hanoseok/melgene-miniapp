/**
 * 파티 유형 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = partytype-core.js 의 결과 id, 또는 'mystery'(시작 화면·분석 중·기본 OG: 물음표 리본 단 선물 상자 — 결과를 암시하지 않음)
 *   artSvg(id)     — 둥근 "파티 초대장" 카드 한 장(밤하늘 남색 위 색종이·전구 줄) 위에 얼굴을 단 동글동글 캐릭터 하나(SVG 도형만).
 *                    결과마다 다른 소품을 든다(머그와 촛불·작은 새·컵케이크·카메라·파티 나팔·쟁반·헤드폰·클립보드).
 *   mini(id)       — 단짝·정반대 카드용 작은 그림(같은 캐릭터, 그 결과 색 동그라미 바탕, 이모지 없음).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'partytype-core.js'));

const INK = '#2a2346';
const NIGHT = '#2f2a5a';
const NIGHT2 = '#463c86';
const MYSTERY = { emoji: '❔', main: '#f2a93b', deep: '#7a4a06', ink: '#fff4e0', v: null };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function face(x, y, s = 1) {
  const e = 12 * s;
  return `<g class="pt-face">
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
// 동글동글 몸통(파티 손님) + 발
const body = (c, cx = 100, cy = 124, rx = 48, ry = 46) => `<ellipse cx="${cx - 18}" cy="${cy + ry - 2}" rx="12" ry="6" fill="${c.deep}" ${S}/>
    <ellipse cx="${cx + 18}" cy="${cy + ry - 2}" rx="12" ry="6" fill="${c.deep}" ${S}/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.main}" ${S}/>
    <path d="M${cx - rx + 12} ${cy - 18} C${cx - rx + 16} ${cy - 30} ${cx - 20} ${cy - ry + 6} ${cx - 8} ${cy - ry + 4}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>`;
const hat = (x, y, col, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><path d="M${x - 18} ${y} L${x} ${y - 40} L${x + 18} ${y} Z" fill="${col}" ${S}/>
    <path d="M${x - 10} ${y - 12} L${x + 10} ${y - 16} M${x - 5} ${y - 26} L${x + 6} ${y - 28}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y - 42}" r="6" fill="#ffd23f" ${S} stroke-width="3"/></g>`;

const DRAW = {
  // 속마음 단짝: 방석에 앉아 따뜻한 머그 + 작은 촛불
  confidant: (c) => `<ellipse cx="100" cy="172" rx="66" ry="12" fill="#f6c6d6" ${S}/>
    ${body(c, 100, 126, 46, 42)}
    <rect x="114" y="128" width="26" height="24" rx="5" fill="#fff" ${S}/><path d="M140 134 Q150 140 140 146" fill="none" ${S}/>
    <path d="M120 120 Q122 112 120 106 M130 120 Q132 112 130 106" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <rect x="40" y="136" width="14" height="26" rx="3" fill="#fff3d6" ${S} stroke-width="3"/>
    <path d="M47 136 C40 126 46 118 47 112 C50 120 56 126 47 136 Z" fill="#ffb238" ${S} stroke-width="2.6"/>
    ${face(98, 118, 0.95)}`,
  // 해피 얼리버드: 목도리 두른 작은 새 + 노을 해
  earlybird: (c) => `<circle cx="46" cy="62" r="16" fill="#ffcf6a" ${S} stroke-width="3"/>
    <path d="M86 172 L82 182 M114 172 L118 182" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="100" cy="122" rx="50" ry="50" fill="${c.main}" ${S}/>
    <path d="M58 128 C44 120 44 104 56 100 C64 112 68 120 58 128 Z" fill="${c.deep}" fill-opacity=".85" ${S} stroke-width="3"/>
    <path d="M90 70 C86 58 96 54 100 62 C104 54 114 58 110 70" fill="${c.main}" ${S} stroke-width="3"/>
    <path d="M60 142 Q100 160 140 142 L140 152 Q100 170 60 152 Z" fill="#f05545" ${S} stroke-width="3"/>
    <path d="M126 150 L134 176 L120 172 Z" fill="#f05545" ${S} stroke-width="3"/>
    <path d="M94 120 L106 120 L100 130 Z" fill="#ff9a2e" ${S} stroke-width="2.6"/>
    ${face(100, 108, 0.9).replace(/<path d="M[^"]*Q[^"]*" fill="none"[^>]*\/>/, '')}`,
  // 간식 탐험대: 커다란 컵케이크를 든 손님 + 부스러기
  snack: (c) => `${body(c)}
    ${hat(80, 84, '#8fd16a', -14)}
    <path d="M118 144 L124 172 L156 172 L162 144 Z" fill="#f6d9a8" ${S}/>
    <path d="M128 146 L130 170 M140 146 L140 170 M152 146 L150 170" stroke="${INK}" stroke-width="2.4" stroke-opacity=".5"/>
    <path d="M114 146 C110 128 126 118 140 122 C154 116 170 128 166 146 Z" fill="#fff" ${S}/>
    <circle cx="140" cy="114" r="7" fill="#f05545" ${S} stroke-width="3"/>
    <circle cx="128" cy="134" r="2.4" fill="#ff7aa2"/><circle cx="148" cy="132" r="2.4" fill="#5fb0e8"/><circle cx="140" cy="140" r="2.4" fill="#ffd23f"/>
    ${face(92, 118, 0.95)}`,
  // 추억 기록가: 카메라를 든 손님 + 반짝 플래시
  memory: (c) => `${body(c)}
    ${hat(118, 84, '#ffd23f', 12)}
    <rect x="66" y="128" width="68" height="44" rx="9" fill="#3b3f58" ${S}/>
    <rect x="78" y="120" width="20" height="10" rx="3" fill="#3b3f58" ${S} stroke-width="3"/>
    <circle cx="100" cy="150" r="14" fill="#9ccbef" ${S}/><circle cx="96" cy="146" r="4" fill="#fff"/>
    <circle cx="124" cy="138" r="3.5" fill="#ffd23f"/>
    <path d="M150 112 L154 122 L164 126 L154 130 L150 140 L146 130 L136 126 L146 122 Z" fill="#fff" ${S} stroke-width="2.6"/>
    ${face(100, 106, 0.9)}`,
  // 분위기 메이커: 파티 나팔 + 색종이 폭죽
  spark: (c) => `${body(c)}
    ${hat(100, 82, '#ffd23f', 0)}
    <path d="M126 128 L170 112 L172 132 Z" fill="#5fb0e8" ${S} stroke-width="3"/>
    <path d="M170 110 Q182 104 180 92 M172 132 Q186 138 186 150" fill="none" stroke="#ff7aa2" stroke-width="3" stroke-linecap="round"/>
    <rect x="34" y="62" width="8" height="8" fill="#ffd23f" transform="rotate(20 38 66)"/><rect x="152" y="58" width="8" height="8" fill="#8fd16a" transform="rotate(-25 156 62)"/>
    <circle cx="44" cy="100" r="4" fill="#5fb0e8"/><circle cx="168" cy="80" r="4" fill="#fff"/>
    <path d="M70 138 Q80 150 92 140" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-opacity=".35"/>
    ${face(96, 118, 1)}`,
  // 다정한 호스트: 나비넥타이 + 컵 둘 올린 쟁반
  host: (c) => `${body(c)}
    <path d="M88 142 L100 148 L88 154 Z M112 142 L100 148 L112 154 Z" fill="#f05545" ${S} stroke-width="3"/>
    <circle cx="100" cy="148" r="4" fill="#f05545" ${S} stroke-width="2.6"/>
    <ellipse cx="150" cy="118" rx="30" ry="6" fill="#d9dbe6" ${S} stroke-width="3"/>
    <path d="M136 112 L138 92 L148 92 L150 112 Z" fill="#fff" ${S} stroke-width="3"/><path d="M139 100 L147 100" stroke="#ffb238" stroke-width="5"/>
    <path d="M154 112 L156 96 L166 96 L168 112 Z" fill="#fff" ${S} stroke-width="3"/><path d="M157 104 L165 104" stroke="#ff7aa2" stroke-width="5"/>
    ${face(96, 114, 0.95)}`,
  // 무드 DJ: 헤드폰 + 작은 턴테이블
  dj: (c) => `${body(c)}
    <path d="M58 116 C56 70 144 70 142 116" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <rect x="46" y="106" width="18" height="28" rx="8" fill="#ffd23f" ${S} stroke-width="3"/>
    <rect x="136" y="106" width="18" height="28" rx="8" fill="#ffd23f" ${S} stroke-width="3"/>
    <rect x="64" y="148" width="72" height="26" rx="6" fill="#3b3f58" ${S}/>
    <circle cx="88" cy="160" r="9" fill="#1b1d2c" stroke="#fff" stroke-width="2"/><circle cx="88" cy="160" r="2.5" fill="#ff7aa2"/>
    <circle cx="116" cy="156" r="3" fill="#8fd16a"/><circle cx="126" cy="156" r="3" fill="#f05545"/><rect x="112" y="164" width="18" height="4" rx="2" fill="#fff"/>
    <path d="M160 70 Q166 62 172 70 M168 52 L168 66 M178 44 L178 60" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${face(100, 116, 0.95)}`,
  // 파티 캡틴: 별 달린 모자 + 클립보드 체크리스트
  captain: (c) => `${body(c)}
    <path d="M62 86 Q100 58 138 86 L132 96 Q100 84 68 96 Z" fill="#fff" ${S}/>
    <path d="M100 66 L103 74 L111 74 L105 79 L107 87 L100 82 L93 87 L95 79 L89 74 L97 74 Z" fill="#ffd23f" stroke="${INK}" stroke-width="2"/>
    <rect x="122" y="118" width="40" height="52" rx="5" fill="#f6d9a8" ${S}/>
    <rect x="134" y="112" width="16" height="10" rx="3" fill="#9aa0b8" ${S} stroke-width="3"/>
    <path d="M130 134 L134 138 L140 130 M130 148 L134 152 L140 144" fill="none" stroke="#43b98a" stroke-width="3" stroke-linecap="round"/>
    <path d="M144 134 H156 M144 148 H156 M130 160 H156" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
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
  const confetti = [
    [26, 30, '#ffd23f'], [62, 18, '#ff7aa2'], [150, 24, '#8fd16a'], [178, 46, '#5fb0e8'], [20, 90, '#8fd16a'], [182, 104, '#ffd23f'], [30, 150, '#5fb0e8'], [172, 160, '#ff7aa2'],
  ].map(([x, y, f], i) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1.5" fill="${f}" transform="rotate(${(i * 37) % 90} ${x + 3} ${y + 3})"/>`).join('');
  const bulbs = [30, 58, 86, 114, 142, 170].map((x, i) => `<circle cx="${x}" cy="${14 + (i % 2) * 6}" r="4.5" fill="${['#ffd23f', '#ff8fb0', '#8fe0c0'][i % 3]}"/>`).join('');
  return `<svg class="pt-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs><clipPath id="pt-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="40"/></clipPath></defs>
  <g clip-path="url(#pt-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="${NIGHT}"/>
    <circle cx="100" cy="112" r="92" fill="${NIGHT2}"/>
    <circle cx="100" cy="112" r="80" fill="${c.main}" fill-opacity=".22"/>
    <path d="M0 10 Q50 30 100 14 T200 12" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/>
    ${bulbs}${confetti}
    <ellipse cx="100" cy="186" rx="80" ry="12" fill="#000" fill-opacity=".2"/>
  </g>
  <g class="pt-char">${character(id, c)}</g>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const badge = id === 'mystery'
    ? '<span class="pt-q" aria-hidden="true">?</span>'
    : `<span class="pt-emo" aria-hidden="true">${c.emoji}</span>`;
  return `<div class="pt-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(id)}${badge}
    </div>`;
}

// 단짝·정반대 카드용 작은 그림 (같은 캐릭터, 그 결과 색 동그라미 바탕, 이모지 없음)
function mini(id) {
  const c = colors(id);
  return `<svg class="pt-mini" viewBox="10 14 180 180" aria-hidden="true"><circle cx="100" cy="104" r="86" fill="${c.ink}" stroke="${c.main}" stroke-width="5"/><g>${character(id, c)}</g></svg>`;
}

module.exports = { hero, colors, artSvg, mini, MYSTERY, INK, NIGHT };
