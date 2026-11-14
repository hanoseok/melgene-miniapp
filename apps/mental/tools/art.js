/**
 * 멘탈 강도 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = mental-core.js 의 결과 id, 또는 'mystery'(시작 화면·분석 중·기본 OG: 물음표 배지 단 "강도 측정기" — 결과를 암시하지 않음)
 *   artSvg(id)     — 둥근 "재료 견본" 카드 한 장(왼쪽 말랑한 분홍 · 오른쪽 단단한 하늘색으로 나뉜 바탕, 모눈) 위에 얼굴을 단 재료 캐릭터 하나(SVG 도형만).
 *                    결과마다 다른 재료를 그린다(실타래·불씨·조개 속 진주·참나무·푸딩·파도·대나무·보석). 'mystery' 는 눈금 달린 측정기 캡슐.
 *   mini(id)       — 단짝·라이벌 카드용 작은 그림(같은 캐릭터, 그 결과 색 동그라미 바탕, 이모지 없음).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'mental-core.js'));

const INK = '#27304a';
const SOFT = '#fdeef4';
const SOLID = '#e5eefb';
const MYSTERY = { emoji: '❔', main: '#7a86e0', deep: '#323b86', ink: '#eef0ff', v: null };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function face(x, y, s = 1) {
  const e = 12 * s;
  return `<g class="mt-face">
      <ellipse cx="${x - e}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="${INK}"/>
      <ellipse cx="${x + e}" cy="${y}" rx="${3.4 * s}" ry="${4.2 * s}" fill="${INK}"/>
      <circle cx="${x - e - 1}" cy="${y - 1.5 * s}" r="${1.2 * s}" fill="#fff"/>
      <circle cx="${x + e - 1}" cy="${y - 1.5 * s}" r="${1.2 * s}" fill="#fff"/>
      <circle cx="${x - e * 1.85}" cy="${y + 8 * s}" r="${4.4 * s}" fill="#ff6f8e" fill-opacity=".45"/>
      <circle cx="${x + e * 1.85}" cy="${y + 8 * s}" r="${4.4 * s}" fill="#ff6f8e" fill-opacity=".45"/>
      <path d="M${x - 6 * s} ${y + 7 * s} Q${x} ${y + 13 * s} ${x + 6 * s} ${y + 7 * s}" fill="none" stroke="${INK}" stroke-width="${2.8 * s}" stroke-linecap="round"/>
    </g>`;
}

const S = `stroke="${INK}" stroke-width="4" stroke-linejoin="round"`;

// 재료별 캐릭터 (200×200 좌표, 가운데 아래쪽)
const DRAW = {
  // 실타래: 감긴 실 + 위아래 나무 테 + 풀린 실 한 가닥
  silk: (c) => `<path d="M156 148 C176 150 182 168 168 176 C156 182 150 170 160 166" fill="none" stroke="${c.main}" stroke-width="4" stroke-linecap="round"/>
    <rect x="62" y="74" width="76" height="92" rx="10" fill="${c.main}" ${S}/>
    <path d="M64 92 Q100 100 136 88 M64 110 Q100 118 136 106 M64 128 Q100 136 136 124 M64 146 Q100 154 136 142" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    <rect x="50" y="62" width="100" height="16" rx="7" fill="#f3d9b4" ${S}/>
    <rect x="50" y="162" width="100" height="16" rx="7" fill="#f3d9b4" ${S}/>
    <path d="M138 150 C148 152 152 150 156 148" fill="none" stroke="${c.main}" stroke-width="4" stroke-linecap="round"/>
    ${face(100, 116, 0.95)}`,
  // 불씨: 바깥 불꽃 + 안쪽 노란 불꽃 + 장작
  ember: (c) => `<rect x="58" y="160" width="84" height="14" rx="7" fill="#a8693a" ${S} transform="rotate(-8 100 167)"/>
    <rect x="58" y="160" width="84" height="14" rx="7" fill="#c07a44" ${S} transform="rotate(8 100 167)"/>
    <path d="M100 46 C122 74 156 96 152 134 C149 160 128 170 100 170 C72 170 51 160 48 134 C45 108 66 100 74 78 C82 92 88 96 94 92 C90 76 92 62 100 46 Z" fill="${c.main}" ${S}/>
    <path d="M100 96 C112 112 128 122 126 142 C124 156 114 162 100 162 C86 162 76 156 74 142 C72 126 90 118 100 96 Z" fill="#ffd25a"/>
    ${face(100, 132, 0.9)}`,
  // 진주: 아래 조개껍데기 + 둥근 진주
  pearl: (c) => `<path d="M34 140 Q100 196 166 140 Q160 176 100 180 Q40 176 34 140 Z" fill="${c.deep}" fill-opacity=".85" ${S}/>
    <path d="M60 158 L66 172 M82 166 L84 178 M118 166 L116 178 M140 158 L134 172" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
    <circle cx="100" cy="112" r="44" fill="#fff" ${S}/>
    <circle cx="100" cy="112" r="44" fill="${c.main}" fill-opacity=".22"/>
    <path d="M74 92 C80 82 90 76 100 75" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    ${face(100, 116, 1)}`,
  // 참나무: 둥근 잎 덩어리 + 줄기 + 도토리
  oak: (c) => `<path d="M86 118 L82 174 L118 174 L114 118 Z" fill="#a8723e" ${S}/>
    <path d="M70 120 C40 122 34 92 52 80 C46 56 74 42 90 54 C100 36 132 40 136 60 C162 58 170 92 150 104 C156 124 128 132 116 120 C106 130 86 130 70 120 Z" fill="${c.main}" ${S}/>
    <path d="M62 86 C66 76 74 70 84 68" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="146" cy="160" rx="9" ry="11" fill="#c98a4a" ${S}/><path d="M136 152 Q146 142 156 152 Z" fill="#7a4e24" ${S}/>
    ${face(100, 92, 0.9)}`,
  // 푸딩: 접시 + 몸통 + 캐러멜 윗면 + 흔들림 선
  jelly: (c) => `<ellipse cx="100" cy="172" rx="64" ry="10" fill="#fff" ${S}/>
    <path d="M60 168 L72 92 Q100 80 128 92 L140 168 Q100 176 60 168 Z" fill="${c.main}" ${S}/>
    <path d="M72 92 Q100 80 128 92 L126 108 Q114 116 104 106 Q92 118 82 108 Q76 114 70 106 Z" fill="${c.deep}" fill-opacity=".9"/>
    <path d="M70 130 C72 120 74 114 76 110" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>
    <path d="M40 120 Q34 130 40 140 M160 120 Q166 130 160 140" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-opacity=".5"/>
    ${face(100, 136, 0.95)}`,
  // 파도: 말려 올라가는 물결 + 거품
  wave: (c) => `<path d="M30 172 C30 120 60 72 108 66 C146 62 170 86 164 112 C160 130 140 136 128 126 C120 118 124 104 136 104 C128 92 104 92 92 108 C80 124 84 150 100 172 Z" fill="${c.main}" ${S}/>
    <path d="M136 104 C148 100 158 108 154 118" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <circle cx="150" cy="70" r="6" fill="#fff" ${S}/><circle cx="166" cy="84" r="4.5" fill="#fff" ${S}/><circle cx="134" cy="58" r="4" fill="#fff" ${S}/>
    <path d="M24 172 H176" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    ${face(66, 136, 0.9)}`,
  // 대나무: 마디 있는 줄기 둘 + 잎
  bamboo: (c) => `<rect x="128" y="58" width="22" height="116" rx="8" fill="${c.main}" fill-opacity=".7" ${S}/>
    <path d="M128 98 H150 M128 136 H150" stroke="${INK}" stroke-width="3"/>
    <rect x="74" y="44" width="52" height="130" rx="14" fill="${c.main}" ${S}/>
    <path d="M74 84 H126 M74 152 H126" stroke="${INK}" stroke-width="3.4"/>
    <path d="M84 56 V78" stroke="#fff" stroke-opacity=".6" stroke-width="5" stroke-linecap="round"/>
    <path d="M74 84 C54 70 40 72 30 80 C44 88 58 90 74 84 Z" fill="#8fd16a" ${S}/>
    <path d="M150 98 C166 84 178 86 186 92 C174 102 162 104 150 98 Z" fill="#8fd16a" ${S}/>
    ${face(100, 116, 0.85)}`,
  // 보석: 윗면이 평평한 다이아몬드 + 면 선 + 반짝
  diamond: (c) => `<path d="M54 90 L78 62 L122 62 L146 90 L100 170 Z" fill="${c.main}" ${S}/>
    <path d="M54 90 H146 M78 62 L90 90 L100 170 M122 62 L110 90 L100 170 M90 90 L100 62 L110 90" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M78 62 L90 90 L54 90 Z" fill="#fff" fill-opacity=".35"/>
    <path d="M160 52 L164 62 L174 66 L164 70 L160 80 L156 70 L146 66 L156 62 Z" fill="#fff" ${S} stroke-width="2.6"/>
    ${face(100, 108, 0.9)}`,
  // 측정기 캡슐(시작 화면·분석 중): 눈금 + 결과를 암시하지 않는 중립 색
  mystery: (c) => `<rect x="62" y="52" width="76" height="120" rx="38" fill="#fff" ${S}/>
    <path d="M62 120 H138 V134 A38 38 0 0 1 62 134 Z" fill="${c.main}" fill-opacity=".45"/>
    <rect x="62" y="52" width="76" height="120" rx="38" fill="none" ${S}/>
    <path d="M128 76 H136 M128 92 H136 M128 108 H136 M128 124 H136 M128 140 H136" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M76 70 C80 64 86 60 92 58" fill="none" stroke="${c.main}" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
    ${face(98, 100, 0.9)}`,
};

function character(id, c) {
  return (DRAW[id] || DRAW.mystery)(c);
}

let seq = 0;
function artSvg(id) {
  const k = ++seq;
  const c = colors(id);
  const grid = [];
  for (let x = 24; x < 200; x += 24) grid.push(`M${x} 0 V200`);
  for (let y = 24; y < 200; y += 24) grid.push(`M0 ${y} H200`);
  return `<svg class="mt-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs><clipPath id="mt-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="40"/></clipPath></defs>
  <g clip-path="url(#mt-clip-${k})">
    <rect x="0" y="0" width="100" height="200" fill="${SOFT}"/>
    <rect x="100" y="0" width="100" height="200" fill="${SOLID}"/>
    <rect x="0" y="0" width="200" height="200" fill="${c.main}" fill-opacity=".12"/>
    <path d="${grid.join(' ')}" stroke="${c.main}" stroke-opacity=".18" stroke-width="1.4"/>
    <ellipse cx="100" cy="186" rx="80" ry="12" fill="${c.deep}" fill-opacity=".14"/>
  </g>
  <g class="mt-char">${character(id, c)}</g>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const badge = id === 'mystery'
    ? '<span class="mt-q" aria-hidden="true">?</span>'
    : `<span class="mt-emo" aria-hidden="true">${c.emoji}</span>`;
  return `<div class="mt-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(id)}${badge}
    </div>`;
}

// 단짝·라이벌 카드용 작은 그림 (같은 캐릭터, 그 결과 색 동그라미 바탕, 이모지 없음)
function mini(id) {
  const c = colors(id);
  return `<svg class="mt-mini" viewBox="10 14 180 180" aria-hidden="true"><circle cx="100" cy="104" r="86" fill="${c.ink}" stroke="${c.main}" stroke-width="5"/><g>${character(id, c)}</g></svg>`;
}

module.exports = { hero, colors, artSvg, mini, MYSTERY, INK, SOFT, SOLID };
