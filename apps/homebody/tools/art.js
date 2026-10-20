/**
 * 집 그림(SVG) — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(결과 HTML 에 인라인).
 *   svg(id, { uid })  — id = homebody-core.js 의 단계 id, 또는 'mystery'(시작 화면·기본 OG: 어떤 단계인지 알 수 없는 중간 불빛의 집)
 *   orb(id, uid)      — 찰떡·상극 유형용 작은 아이콘(작은 집, 불빛 세기만 다름)
 * 그림: 은은한 빛 번짐 + 집(지붕·벽·문·창문) + 단계별 소품. 단계가 높을수록 창문 불빛이 따뜻하고 밝으며 밖이 어두워진다.
 * 한 페이지에 SVG 가 여러 개라서 gradient/filter id 에 uid 를 붙인다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'homebody-core.js'));

const MYSTERY = { core: '#fff6ea', mid: '#ffc48a', edge: '#b8662f', ink: '#ffe3bd' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}
function levelOf(id) {
  return id === 'mystery' ? 2.5 : CORE.ORDER.indexOf(id);
}

// 단계별 소품 (밖이 밝은 쪽: 해·나무·길 / 집 쪽: 달·별·김 오르는 머그잔)
function props(id, c) {
  const lv = levelOf(id);
  const out = [];
  if (id === 'mystery') {
    out.push(`<circle cx="156" cy="48" r="13" fill="${c.core}" opacity=".85"/>`);
    return out.join('');
  }
  if (lv <= 1) {
    out.push(`<circle cx="158" cy="44" r="16" fill="#ffe27a"/>`);
    out.push(`<g stroke="#ffe27a" stroke-width="3" stroke-linecap="round">${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = a * Math.PI / 180; return `<line x1="${158 + Math.cos(r) * 22}" y1="${44 + Math.sin(r) * 22}" x2="${158 + Math.cos(r) * 28}" y2="${44 + Math.sin(r) * 28}"/>`; }).join('')}</g>`);
    out.push(`<circle cx="30" cy="132" r="17" fill="${c.mid}"/><rect x="28" y="140" width="5" height="30" rx="2" fill="${c.edge}"/>`);
    if (lv === 0) out.push(`<path d="M104 176 Q130 186 170 190" stroke="${c.core}" stroke-width="6" stroke-linecap="round" fill="none" opacity=".7"/>`);
  } else if (lv === 2) {
    out.push(`<circle cx="160" cy="46" r="13" fill="#ffe27a"/>`);
    out.push(`<ellipse cx="146" cy="56" rx="22" ry="9" fill="${c.core}" opacity=".9"/>`);
    out.push(`<circle cx="30" cy="140" r="14" fill="${c.mid}"/><rect x="28" y="146" width="5" height="26" rx="2" fill="${c.edge}"/>`);
  } else if (lv === 3) {
    out.push(`<ellipse cx="150" cy="52" rx="24" ry="10" fill="${c.core}" opacity=".55"/>`);
    out.push(`<rect x="148" y="158" width="18" height="16" rx="3" fill="${c.core}"/><path d="M166 162h6a5 5 0 0 1 0 10h-6" fill="none" stroke="${c.core}" stroke-width="3"/>`);
    out.push(`<path class="hb-spark hb-spark-0" d="M152 150c-4-6 4-8 0-14M160 150c-4-6 4-8 0-14" stroke="${c.core}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`);
  } else {
    out.push(`<path d="M164 30a17 17 0 1 0 14 26a14 14 0 0 1-14-26z" fill="${c.core}"/>`);
    [[40, 40, 2.2], [70, 24, 1.6], [120, 30, 1.8], [26, 84, 1.6], [180, 100, 1.6]].forEach(([x, y, r], i) => out.push(`<circle class="hb-spark hb-spark-${i % 3}" cx="${x}" cy="${y}" r="${r}" fill="${c.core}"/>`));
    if (lv === 5) out.push(`<text x="150" y="146" font-size="15" font-weight="800" fill="${c.core}" opacity=".85">z</text><text x="162" y="134" font-size="12" font-weight="800" fill="${c.core}" opacity=".7">z</text>`);
    else out.push(`<rect x="148" y="158" width="18" height="16" rx="3" fill="${c.core}"/><path d="M166 162h6a5 5 0 0 1 0 10h-6" fill="none" stroke="${c.core}" stroke-width="3"/>`);
  }
  return out.join('');
}

function defs(c, u) {
  return `<defs>
    <radialGradient id="${u}-g" cx="50%" cy="52%" r="50%">
      <stop offset="0%" stop-color="${c.core}" stop-opacity="1"/>
      <stop offset="30%" stop-color="${c.mid}" stop-opacity=".9"/>
      <stop offset="65%" stop-color="${c.edge}" stop-opacity=".5"/>
      <stop offset="100%" stop-color="${c.edge}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${u}-w" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2c1b14"/>
      <stop offset="100%" stop-color="#1a0f0b"/>
    </linearGradient>
    <filter id="${u}-b" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
  </defs>`;
}

function svg(id, opts = {}) {
  const c = colors(id);
  const u = `hb-${opts.uid || id}`;
  const lv = levelOf(id);
  const lit = (0.35 + lv * 0.13).toFixed(2);   // 창문 불빛 밝기: 단계가 높을수록 밝다
  const glow = (0.35 + lv * 0.1).toFixed(2);   // 집 둘레 빛 번짐
  return `<svg class="hb-art" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  ${defs(c, u)}
  <g class="hb-layer hb-outer" filter="url(#${u}-b)"><ellipse cx="100" cy="108" rx="92" ry="88" fill="url(#${u}-g)" opacity="${glow}"/></g>
  ${props(id, c)}
  <g class="hb-house">
    <path d="M40 104 100 52l60 52" fill="${c.edge}" stroke="${c.core}" stroke-opacity=".55" stroke-width="3" stroke-linejoin="round"/>
    <rect x="52" y="102" width="96" height="70" rx="5" fill="url(#${u}-w)"/>
    <rect x="52" y="102" width="96" height="70" rx="5" fill="${c.mid}" opacity=".14"/>
    <rect class="hb-window" x="66" y="116" width="30" height="26" rx="4" fill="${c.core}" opacity="${lit}"/>
    <path d="M81 116v26M66 129h30" stroke="#1a0f0b" stroke-width="2.4" opacity=".55"/>
    <rect x="112" y="124" width="24" height="48" rx="4" fill="${c.mid}" opacity=".85"/>
    <circle cx="130" cy="150" r="2.2" fill="${c.core}"/>
    <rect x="124" y="56" width="12" height="26" rx="2" fill="${c.edge}"/>
    <path d="M40 172h120" stroke="${c.core}" stroke-opacity=".45" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;
}

function orb(id, uid) {
  const c = colors(id);
  const u = `hb-o-${uid || id}`;
  const lit = (0.4 + levelOf(id) * 0.12).toFixed(2);
  return `<svg class="hb-orb" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${u}-g" cx="50%" cy="55%" r="55%">
      <stop offset="0%" stop-color="${c.core}"/>
      <stop offset="45%" stop-color="${c.mid}" stop-opacity=".8"/>
      <stop offset="100%" stop-color="${c.edge}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="54" r="46" fill="url(#${u}-g)" opacity=".7"/>
  <path d="M22 54 50 28l28 26" fill="${c.edge}" stroke="${c.core}" stroke-opacity=".6" stroke-width="2" stroke-linejoin="round"/>
  <rect x="28" y="53" width="44" height="32" rx="3" fill="#2a1912"/>
  <rect x="35" y="60" width="14" height="12" rx="2" fill="${c.core}" opacity="${lit}"/>
  <rect x="56" y="64" width="11" height="21" rx="2" fill="${c.mid}"/>
</svg>`;
}

module.exports = { svg, orb, colors, MYSTERY };
