/**
 * 오라 그림(SVG) — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(결과 HTML 에 인라인).
 *   svg(id, { uid })  — id = aura-core.js 의 유형 id, 또는 'mystery'(시작 화면·기본 OG: 어떤 색인지 알 수 없는 진주빛)
 *   orb(id, uid)      — 찰떡·상극 오라용 작은 구슬(실루엣 없음)
 * 그림: 여러 겹의 흐릿한 빛(바깥 → 안쪽) + 가운데 사람 실루엣(머리·어깨) + 작은 반짝임.
 * 한 페이지에 SVG 가 여러 개라서 gradient/filter id 에 uid 를 붙인다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'aura-core.js'));

const MYSTERY = { core: '#ffffff', mid: '#dcd6ff', edge: '#7f8cff', ink: '#e9e4ff' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function defs(c, u) {
  return `<defs>
    <radialGradient id="${u}-g" cx="50%" cy="46%" r="50%">
      <stop offset="0%" stop-color="${c.core}" stop-opacity="1"/>
      <stop offset="28%" stop-color="${c.mid}" stop-opacity=".95"/>
      <stop offset="62%" stop-color="${c.edge}" stop-opacity=".55"/>
      <stop offset="100%" stop-color="${c.edge}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${u}-h" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${c.mid}" stop-opacity=".85"/>
      <stop offset="100%" stop-color="${c.mid}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${u}-s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1b1236"/>
      <stop offset="100%" stop-color="#0c0820"/>
    </linearGradient>
    <filter id="${u}-b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
    <filter id="${u}-b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>`;
}

function sparkles(c) {
  const pts = [[38, 52, 2.2], [160, 44, 1.8], [170, 128, 2.4], [30, 138, 1.6], [104, 22, 1.5], [146, 170, 1.4], [58, 176, 1.8]];
  return pts.map(([x, y, r], i) => `<circle class="au-spark au-spark-${i % 3}" cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? c.core : c.mid}"/>`).join('');
}

function svg(id, opts = {}) {
  const c = colors(id);
  const u = `au-${opts.uid || id}`;
  return `<svg class="au-art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  ${defs(c, u)}
  <g class="au-layer au-outer" filter="url(#${u}-b)">
    <ellipse cx="100" cy="100" rx="92" ry="94" fill="url(#${u}-g)" opacity=".55"/>
    <ellipse cx="82" cy="92" rx="54" ry="66" fill="url(#${u}-h)" opacity=".7"/>
    <ellipse cx="122" cy="108" rx="52" ry="62" fill="url(#${u}-h)" opacity=".6"/>
  </g>
  <g class="au-layer au-inner" filter="url(#${u}-b)">
    <ellipse cx="100" cy="108" rx="76" ry="88" fill="url(#${u}-g)"/>
  </g>
  <g class="au-sparks">${sparkles(c)}</g>
  <g class="au-person">
    <path d="M52 200 C52 160 72 142 100 142 C128 142 148 160 148 200 Z" fill="url(#${u}-s)"/>
    <circle cx="100" cy="104" r="27" fill="url(#${u}-s)"/>
    <path d="M52 200 C52 160 72 142 100 142 C128 142 148 160 148 200 Z" fill="${c.mid}" opacity=".14"/>
    <circle cx="100" cy="104" r="27" fill="${c.mid}" opacity=".14"/>
    <path d="M52 200 C52 160 72 142 100 142 C128 142 148 160 148 200" fill="none" stroke="${c.core}" stroke-opacity=".55" stroke-width="2.2" filter="url(#${u}-b2)"/>
    <circle cx="100" cy="104" r="27" fill="none" stroke="${c.core}" stroke-opacity=".6" stroke-width="2.2" filter="url(#${u}-b2)"/>
  </g>
</svg>`;
}

function orb(id, uid) {
  const c = colors(id);
  const u = `au-o-${uid || id}`;
  return `<svg class="au-orb" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${u}-g" cx="42%" cy="38%" r="60%">
      <stop offset="0%" stop-color="${c.core}"/>
      <stop offset="35%" stop-color="${c.mid}"/>
      <stop offset="80%" stop-color="${c.edge}" stop-opacity=".6"/>
      <stop offset="100%" stop-color="${c.edge}" stop-opacity="0"/>
    </radialGradient>
    <filter id="${u}-b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>
  </defs>
  <circle cx="50" cy="50" r="44" fill="url(#${u}-g)" filter="url(#${u}-b)"/>
  <circle cx="50" cy="50" r="26" fill="url(#${u}-g)"/>
</svg>`;
}

module.exports = { svg, orb, colors, MYSTERY };
