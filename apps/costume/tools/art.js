/**
 * 코스튬 그림(SVG) — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(결과 HTML 에 인라인).
 *   svg(id, { uid })  — id = costume-core.js 의 유형 id, 또는 'mystery'(시작 화면·기본 OG: 무엇이 나올지 알 수 없는 옷걸이 + 천 + 물음표)
 *   mini(id, uid)     — 찰떡 단짝·라이벌 카드용 작은 얼굴(후광 없음)
 * 그림: 둥근 후광(유형 색) + 가운데 귀여운 캐릭터 얼굴(코스튬). 한 페이지에 SVG 가 여러 개라서 gradient id 에 uid 를 붙인다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'costume-core.js'));

const MYSTERY = { color: '#ff9a3c', deep: '#3d1a7a', ink: '#ffd9a8' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

const INK = '#1d1430';
const eyes = (y = 104, dx = 18, r = 6) => `<ellipse cx="${100 - dx}" cy="${y}" rx="${r}" ry="${r + 1.5}" fill="${INK}"/><ellipse cx="${100 + dx}" cy="${y}" rx="${r}" ry="${r + 1.5}" fill="${INK}"/><circle cx="${100 - dx + 2}" cy="${y - 2.5}" r="1.8" fill="#fff"/><circle cx="${100 + dx + 2}" cy="${y - 2.5}" r="1.8" fill="#fff"/>`;
const blush = (y = 118, dx = 30) => `<ellipse cx="${100 - dx}" cy="${y}" rx="7" ry="4" fill="#ff7a9a" opacity=".45"/><ellipse cx="${100 + dx}" cy="${y}" rx="7" ry="4" fill="#ff7a9a" opacity=".45"/>`;

// 캐릭터 몸통(얼굴) — 200×200 좌표, 가운데 (100, 108)
const FACE = {
  vampire: () => `
    <path d="M38 196 L62 132 L100 150 L138 132 L162 196 Z" fill="#20101e"/>
    <path d="M52 140 L40 110 L78 134 Z M148 140 L160 110 L122 134 Z" fill="#c4213d"/>
    <circle cx="100" cy="106" r="40" fill="#f3e6f0"/>
    <path d="M60 98 C60 70 80 60 100 60 C120 60 140 70 140 98 C132 86 118 80 108 80 L100 94 L92 80 C82 80 68 86 60 98 Z" fill="#20101e"/>
    ${eyes(106, 16, 5)}
    <path d="M86 124 Q100 132 114 124" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M91 126 L94 134 L97 127 Z M103 127 L106 134 L109 126 Z" fill="#fff"/>
    ${blush(118, 28)}`,
  witch: () => `
    <path d="M48 196 C52 150 72 138 100 138 C128 138 148 150 152 196 Z" fill="#3a1c6e"/>
    <path d="M60 112 C52 132 58 150 70 160 L74 118 Z M140 112 C148 132 142 150 130 160 L126 118 Z" fill="#7b3fd6"/>
    <circle cx="100" cy="112" r="38" fill="#ffe2c8"/>
    <path d="M100 6 L132 76 L68 76 Z" fill="#241040"/>
    <path d="M100 6 C110 20 118 30 116 40" fill="none" stroke="#241040" stroke-width="2"/>
    <ellipse cx="100" cy="78" rx="58" ry="12" fill="#241040"/>
    <rect x="72" y="62" width="56" height="10" rx="3" fill="#9b5cff"/>
    <rect x="94" y="61" width="12" height="12" rx="2" fill="#ffd23f"/>
    ${eyes(112, 15, 5)}
    <path d="M90 128 Q100 136 110 128" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    ${blush(124, 26)}`,
  ghost: () => `
    <path d="M52 186 L52 104 C52 72 74 50 100 50 C126 50 148 72 148 104 L148 186 Q138 176 128 186 Q118 196 108 186 Q100 178 92 186 Q82 196 72 186 Q62 176 52 186 Z" fill="#f7fbff"/>
    <path d="M128 70 C140 80 146 94 146 110" fill="none" stroke="#c8e4f7" stroke-width="5" stroke-linecap="round" opacity=".8"/>
    <ellipse cx="84" cy="104" rx="9" ry="13" fill="${INK}"/><ellipse cx="116" cy="104" rx="9" ry="13" fill="${INK}"/>
    <circle cx="87" cy="99" r="3" fill="#fff"/><circle cx="119" cy="99" r="3" fill="#fff"/>
    <ellipse cx="100" cy="132" rx="7" ry="9" fill="${INK}"/>
    ${blush(124, 30)}`,
  zombie: () => `
    <path d="M48 196 C52 152 72 140 100 140 C128 140 148 152 152 196 Z" fill="#5b6f8a"/>
    <path d="M70 160 L80 172 L74 182 M128 156 L120 170 L130 178" fill="none" stroke="#3c4a5e" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="106" r="40" fill="#9fd36a"/>
    <path d="M62 92 C64 66 84 58 100 60 C118 58 138 68 138 92 L130 80 L122 90 L114 76 L104 88 L96 74 L86 88 L78 76 L70 90 Z" fill="#4a3b2a"/>
    <ellipse cx="84" cy="106" rx="7" ry="7" fill="${INK}"/><path d="M110 104 Q118 100 126 104 Q118 110 110 104 Z" fill="${INK}"/>
    <circle cx="86" cy="104" r="2" fill="#fff"/>
    <path d="M88 128 L112 126" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M94 124 L94 131 M101 123 L101 130 M108 123 L108 130" stroke="${INK}" stroke-width="2"/>
    <path d="M120 84 L132 96 M124 82 L122 88 M130 88 L128 94" stroke="#5a7f3a" stroke-width="2.4" stroke-linecap="round"/>`,
  blackcat: () => `
    <path d="M50 196 C54 150 74 140 100 140 C126 140 146 150 150 196 Z" fill="#231a33"/>
    <path d="M62 86 L58 40 L92 70 Z M138 86 L142 40 L108 70 Z" fill="#231a33"/>
    <path d="M66 78 L64 52 L84 70 Z M134 78 L136 52 L116 70 Z" fill="#ff8fb1" opacity=".75"/>
    <circle cx="100" cy="108" r="42" fill="#231a33"/>
    <ellipse cx="82" cy="104" rx="10" ry="11" fill="#ffd23f"/><ellipse cx="118" cy="104" rx="10" ry="11" fill="#ffd23f"/>
    <ellipse cx="82" cy="104" rx="3.2" ry="9" fill="${INK}"/><ellipse cx="118" cy="104" rx="3.2" ry="9" fill="${INK}"/>
    <path d="M95 120 L105 120 L100 126 Z" fill="#ff8fb1"/>
    <path d="M100 126 Q94 134 88 130 M100 126 Q106 134 112 130" fill="none" stroke="#f2e9ff" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M70 120 L46 116 M70 126 L46 130 M130 120 L154 116 M130 126 L154 130" stroke="#f2e9ff" stroke-width="2" stroke-linecap="round" opacity=".85"/>`,
  mummy: () => `
    <path d="M48 196 C52 152 72 140 100 140 C128 140 148 152 152 196 Z" fill="#e8d8b4"/>
    <path d="M56 168 L144 156 M52 186 L148 176" stroke="#c9b48a" stroke-width="5"/>
    <circle cx="100" cy="106" r="42" fill="#efe1c0"/>
    <path d="M60 86 L140 76 M58 104 L142 98 M60 124 L140 120 M66 140 L134 136" stroke="#cdb98f" stroke-width="7" stroke-linecap="round"/>
    <path d="M64 96 L136 88" stroke="#d9c69c" stroke-width="6" stroke-linecap="round"/>
    <rect x="70" y="102" width="62" height="16" rx="8" fill="#3a2a1a"/>
    <circle cx="86" cy="110" r="6" fill="#fff"/><circle cx="87" cy="111" r="3.4" fill="${INK}"/>
    <path d="M108 110 Q116 106 124 110" fill="none" stroke="#efe1c0" stroke-width="3" stroke-linecap="round"/>
    <path d="M138 128 C150 134 152 146 146 152" fill="none" stroke="#e5d4ae" stroke-width="6" stroke-linecap="round"/>
    ${blush(128, 26)}`,
  pumpkin: () => `
    <path d="M48 196 C52 156 72 146 100 146 C128 146 148 156 152 196 Z" fill="#3c2a5c"/>
    <path d="M92 58 C92 48 96 42 104 38 L108 44 C102 48 100 52 100 60 Z" fill="#3f8a2e"/>
    <path d="M104 52 C118 40 132 46 134 54 C122 52 114 54 106 60 Z" fill="#5fb04a"/>
    <ellipse cx="72" cy="110" rx="30" ry="46" fill="#f07a12"/>
    <ellipse cx="128" cy="110" rx="30" ry="46" fill="#f07a12"/>
    <ellipse cx="100" cy="108" rx="34" ry="50" fill="#ff8a1f"/>
    <path d="M100 60 C90 80 90 140 100 158 M100 60 C110 80 110 140 100 158" fill="none" stroke="#e06a08" stroke-width="2.4" opacity=".7"/>
    <path d="M70 96 L86 96 L78 82 Z M114 96 L130 96 L122 82 Z" fill="#3a1600"/>
    <path d="M70 120 Q100 146 130 120 L122 124 L116 118 L108 126 L100 118 L92 126 L84 118 L78 124 Z" fill="#3a1600"/>
    <path d="M84 50 L90 34 L98 46 L106 30 L114 46 L120 34 L126 50 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="2" stroke-linejoin="round" transform="translate(-6 -14) rotate(-8 105 40)"/>`,
  skeleton: () => `
    <path d="M52 196 C56 154 74 144 100 144 C126 144 144 154 148 196 Z" fill="#231a33"/>
    <path d="M100 150 L100 196 M80 160 L120 160 M76 172 L124 172 M80 184 L120 184" stroke="#f2efe6" stroke-width="5" stroke-linecap="round"/>
    <path d="M58 104 C58 72 78 56 100 56 C122 56 142 72 142 104 C142 120 134 128 128 132 L128 146 L72 146 L72 132 C66 128 58 120 58 104 Z" fill="#f7f4ec"/>
    <ellipse cx="82" cy="104" rx="13" ry="14" fill="${INK}"/><ellipse cx="118" cy="104" rx="13" ry="14" fill="${INK}"/>
    <circle cx="85" cy="100" r="3.4" fill="#fff"/><circle cx="121" cy="100" r="3.4" fill="#fff"/>
    <path d="M100 116 L94 126 L106 126 Z" fill="${INK}"/>
    <path d="M78 134 L122 134 M86 130 L86 140 M94 130 L94 140 M102 130 L102 140 M110 130 L110 140 M118 130 L118 140" stroke="#c9c4b6" stroke-width="2.2" stroke-linecap="round"/>`,
  mystery: () => `
    <path d="M100 30 C92 30 88 36 88 42 C88 48 94 50 100 54" fill="none" stroke="#ffd9a8" stroke-width="5" stroke-linecap="round"/>
    <path d="M100 54 L40 88 L160 88 Z" fill="none" stroke="#ffd9a8" stroke-width="5" stroke-linejoin="round"/>
    <path d="M46 88 L154 88 C158 120 160 150 164 186 Q148 178 134 188 Q118 178 100 188 Q82 178 66 188 Q52 178 36 186 C40 150 42 120 46 88 Z" fill="#4b2391"/>
    <path d="M60 96 C58 130 56 160 54 180 M140 96 C142 130 144 160 146 180" stroke="#6c3fc4" stroke-width="4" stroke-linecap="round" opacity=".8"/>
    <text x="100" y="158" text-anchor="middle" font-family="Nunito, Arial Rounded MT Bold, sans-serif" font-weight="900" font-size="66" fill="#ffc27a">?</text>`,
};

function sparkles(c) {
  const pts = [[30, 50, 2.4], [172, 42, 2], [176, 132, 2.6], [24, 140, 1.8], [150, 18, 1.6], [48, 20, 1.6]];
  return pts.map(([x, y, r], i) => `<circle class="cs-spark cs-spark-${i % 3}" cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#fff6e0' : c.color}"/>`).join('');
}

function svg(id, opts = {}) {
  const c = colors(id);
  const u = `cs-${opts.uid || id}`;
  return `<svg class="cs-art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${u}-g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.color}" stop-opacity=".7"/>
      <stop offset="55%" stop-color="${c.color}" stop-opacity=".22"/>
      <stop offset="100%" stop-color="${c.color}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle class="cs-halo" cx="100" cy="104" r="98" fill="url(#${u}-g)"/>
  <g class="cs-sparks">${sparkles(c)}</g>
  <g class="cs-char">${FACE[id]()}</g>
</svg>`;
}

function mini(id, uid) {
  const c = colors(id);
  return `<svg class="cs-mini" viewBox="20 20 160 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-uid="${uid || id}">
  <circle cx="100" cy="108" r="78" fill="${c.color}" opacity=".18"/>
  ${FACE[id]()}
</svg>`;
}

module.exports = { svg, mini, colors, MYSTERY };
