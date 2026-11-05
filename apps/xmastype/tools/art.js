/**
 * 크리스마스 성격 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = xmastype-core.js 의 결과 id, 또는 'mystery'(시작 화면·로딩·기본 OG: 리본 묶은 선물 상자 + 물음표 — 결과를 암시하지 않음)
 *   artSvg(id)     — 둥근 카드 한 장(옅은 바탕 + 눈송이 점) 위에 귀여운 얼굴을 단 캐릭터 하나(SVG 도형만).
 *   mini(id)       — 찰떡궁합·라이벌 카드용 작은 그림(같은 캐릭터).
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'xmastype-core.js'));

const INK = '#1d3b2f';
const MYSTERY = { emoji: '🎁', main: '#c8323f', deep: '#1d4a37', ink: '#fdf3e4' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

// 귀여운 얼굴: 눈 두 개 + 볼 + 웃는 입
function face(x, y, s = 1, cheek = '#ff8fa3') {
  const e = 6 * s, m = 7 * s;
  return `<g class="xt-face">
      <ellipse cx="${x - e * 1.6}" cy="${y}" rx="${3 * s}" ry="${3.6 * s}" fill="${INK}"/>
      <ellipse cx="${x + e * 1.6}" cy="${y}" rx="${3 * s}" ry="${3.6 * s}" fill="${INK}"/>
      <circle cx="${x - e * 2.6}" cy="${y + 6 * s}" r="${3.6 * s}" fill="${cheek}" fill-opacity=".55"/>
      <circle cx="${x + e * 2.6}" cy="${y + 6 * s}" r="${3.6 * s}" fill="${cheek}" fill-opacity=".55"/>
      <path d="M${x - m * 0.7} ${y + 5 * s} Q${x} ${y + 11 * s} ${x + m * 0.7} ${y + 5 * s}" fill="none" stroke="${INK}" stroke-width="${2.6 * s}" stroke-linecap="round"/>
    </g>`;
}

const STROKE = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;

// 캐릭터 도형 (200×200 좌표, 가운데 100,106 근처)
const CHAR = {
  star: () => {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 30 : 66;
      const a = ((-90 + 36 * i) * Math.PI) / 180;
      pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(110 + r * Math.sin(a)).toFixed(1)}`);
    }
    return `<polygon points="${pts.join(' ')}" fill="#ffd23f" ${STROKE}/>
    <polygon points="${pts.join(' ')}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" transform="translate(100 110) scale(.82) translate(-100 -110)"/>
    ${face(100, 112, 1)}`;
  },
  bell: () => `<path d="M100 40 C68 40 60 70 58 100 C56 124 46 136 40 146 L160 146 C154 136 144 124 142 100 C140 70 132 40 100 40 Z" fill="#f7c948" ${STROKE}/>
    <rect x="34" y="144" width="132" height="14" rx="7" fill="#e3a813" ${STROKE}/>
    <circle cx="100" cy="166" r="11" fill="#e3a813" ${STROKE}/>
    <path d="M100 42 C88 26 72 28 74 38 C76 46 92 44 100 42 C108 44 124 46 126 38 C128 28 112 26 100 42 Z" fill="#c8323f" ${STROKE}/>
    <path d="M74 66 C70 80 70 92 70 100" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-linecap="round"/>
    ${face(100, 104, 1)}`,
  reindeer: () => `<path d="M70 66 L58 36 M58 36 L46 30 M58 36 L62 22 M64 52 L50 50" fill="none" stroke="#8b5a3c" stroke-width="8" stroke-linecap="round"/>
    <path d="M130 66 L142 36 M142 36 L154 30 M142 36 L138 22 M136 52 L150 50" fill="none" stroke="#8b5a3c" stroke-width="8" stroke-linecap="round"/>
    <ellipse cx="56" cy="84" rx="16" ry="9" fill="#b07a52" ${STROKE} transform="rotate(-25 56 84)"/>
    <ellipse cx="144" cy="84" rx="16" ry="9" fill="#b07a52" ${STROKE} transform="rotate(25 144 84)"/>
    <ellipse cx="100" cy="112" rx="46" ry="52" fill="#b07a52" ${STROKE}/>
    <ellipse cx="100" cy="140" rx="28" ry="20" fill="#f1dcc6"/>
    <ellipse cx="100" cy="132" rx="10" ry="8" fill="#4a2c1a"/>
    ${face(100, 104, 0.95, '#ff9d8a')}`,
  candy: () => `<path d="M88 172 L88 84 C88 46 140 46 140 84 L140 96" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>
    <path d="M88 172 L88 84 C88 46 140 46 140 84 L140 96" fill="none" stroke="#fff" stroke-width="22" stroke-linecap="round"/>
    <path d="M88 172 L88 84 C88 46 140 46 140 84 L140 96" fill="none" stroke="#e23b4e" stroke-width="22" stroke-dasharray="11 11"/>
    <rect x="62" y="112" width="52" height="34" rx="14" fill="#fff" ${STROKE}/>
    ${face(88, 124, 0.85)}`,
  candle: () => `<path d="M100 26 C112 42 114 54 100 64 C86 54 88 42 100 26 Z" fill="#ffb238" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M100 40 C105 48 105 54 100 58 C95 54 95 48 100 40 Z" fill="#fff3b0"/>
    <line x1="100" y1="64" x2="100" y2="74" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <rect x="66" y="72" width="68" height="104" rx="14" fill="#fff4e6" ${STROKE}/>
    <path d="M66 90 C74 90 76 104 82 104 C88 104 88 90 96 90 L134 90" fill="none" stroke="#f3c9a5" stroke-width="6" stroke-linecap="round"/>
    <rect x="52" y="170" width="96" height="14" rx="7" fill="#d9662b" ${STROKE}/>
    ${face(100, 122, 0.95)}`,
  cookie: () => `<g fill="#c98a4b" ${STROKE}>
      <path d="M68 92 L132 92 C152 92 166 98 166 112 C166 124 150 124 138 122 L138 134 L150 170 C154 180 140 186 134 178 L100 146 L66 178 C60 186 46 180 50 170 L62 134 L62 122 C50 124 34 124 34 112 C34 98 48 92 68 92 Z"/>
      <path d="M100 62 m-30 0 a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0" />
    </g>
    <path d="M48 106 q6 6 12 0 M140 106 q6 6 12 0" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="100" cy="110" r="5" fill="#e23b4e"/><circle cx="100" cy="128" r="5" fill="#2e9e5b"/>
    ${face(100, 60, 0.85)}`,
  snowman: () => `<circle cx="100" cy="142" r="40" fill="#fff" ${STROKE}/>
    <circle cx="100" cy="82" r="32" fill="#fff" ${STROKE}/>
    <rect x="76" y="40" width="48" height="10" rx="4" fill="${INK}"/>
    <rect x="84" y="18" width="32" height="26" rx="5" fill="${INK}"/>
    <rect x="84" y="34" width="32" height="6" fill="#c8323f"/>
    <path d="M70 108 C86 116 114 116 130 108 L132 118 C114 126 86 126 68 118 Z" fill="#c8323f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M116 118 L124 146 L112 146 L108 120 Z" fill="#c8323f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 90 L120 94 L100 97 Z" fill="#f28c28" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="100" cy="140" r="4" fill="${INK}"/><circle cx="100" cy="158" r="4" fill="${INK}"/>
    ${face(100, 78, 0.8)}`,
  snowflake: () => {
    const arm = (deg) => `<g transform="rotate(${deg} 100 104)">
      <line x1="100" y1="104" x2="100" y2="34" stroke="#7fd3e6" stroke-width="10" stroke-linecap="round"/>
      <path d="M100 58 L86 46 M100 58 L114 46 M100 44 L90 36 M100 44 L110 36" fill="none" stroke="#7fd3e6" stroke-width="7" stroke-linecap="round"/>
    </g>`;
    return `<g stroke="${INK}">${[0, 60, 120, 180, 240, 300].map(arm).join('')}</g>
    <circle cx="100" cy="104" r="30" fill="#e3f6f9" ${STROKE}/>
    ${face(100, 102, 0.85)}`;
  },
  mystery: () => `<rect x="48" y="84" width="104" height="86" rx="10" fill="#c8323f" ${STROKE}/>
    <rect x="40" y="66" width="120" height="26" rx="8" fill="#e04a57" ${STROKE}/>
    <rect x="92" y="66" width="16" height="104" fill="#f2b705" stroke="${INK}" stroke-width="3"/>
    <path d="M100 66 C84 40 60 44 66 58 C70 66 88 66 100 66 C112 66 130 66 134 58 C140 44 116 40 100 66 Z" fill="#f2b705" ${STROKE}/>`,
};

let seq = 0;
function artSvg(id) {
  const k = ++seq;
  const c = colors(id);
  const flakes = [];
  for (let y = 18; y < 200; y += 26) for (let x = (y / 26) % 2 ? 30 : 16; x < 200; x += 28) flakes.push(`<circle cx="${x}" cy="${y}" r="2.2"/>`);
  return `<svg class="xt-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs><clipPath id="xt-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="44"/></clipPath></defs>
  <g clip-path="url(#xt-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="${c.ink}"/>
    <g fill="${c.main}" fill-opacity=".22">${flakes.join('')}</g>
    <ellipse cx="100" cy="190" rx="110" ry="26" fill="#fff" fill-opacity=".85"/>
  </g>
  <g class="xt-char">${CHAR[id]()}</g>
  <rect x="4" y="4" width="192" height="192" rx="44" fill="none" stroke="${INK}" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="xt-q" aria-hidden="true">?</span>' : '';
  return `<div class="xt-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(id)}${q}
    </div>`;
}

// 찰떡궁합·라이벌 카드용 작은 그림 (같은 캐릭터, 바탕 카드 없음)
function mini(id) {
  return `<svg class="xt-mini" viewBox="20 10 160 180" aria-hidden="true"><g>${CHAR[id]()}</g></svg>`;
}

module.exports = { hero, colors, artSvg, mini, MYSTERY, INK };
