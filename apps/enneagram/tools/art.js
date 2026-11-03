/**
 * 에니어그램 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)   — id = enneagram-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 특정 점을 강조하지 않는 금색 + 물음표)
 *   artSvg(c, num)  — 둥근 카드 한 장: 원 위의 아홉 점 + 안쪽 삼각형(3-6-9)·육각 별(1-4-2-8-5-7-1). num 이 있으면 그 점만 크게.
 * 시작 화면 그림에는 숫자·유형 이름을 쓰지 않는다(스포일러 금지). 결과 그림은 그 유형의 점 하나만 강조한다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'enneagram-core.js'));

// 시작 화면용: 특정 결과를 암시하지 않는 금색 + 남색 (결과 색과 겹치지 않게)
const MYSTERY = { emoji: '🔷', main: '#f4b740', deep: '#2b2350', ink: '#fff7e3' };
const INK = '#2b2350';

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

// 점 k(1~9)의 위치: 9 가 맨 위, 시계 방향으로 40°씩
function pt(k, r = 66, cx = 100, cy = 104) {
  const a = ((-90 + 40 * (k % 9)) * Math.PI) / 180;
  return [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)];
}
const poly = (ks) => ks.map((k) => pt(k).join(',')).join(' ');

let seq = 0;
function artSvg(c, num) {
  const k = ++seq;
  const dots = [];
  for (let y = 16; y < 200; y += 24) for (let x = (y / 24) % 2 ? 28 : 16; x < 200; x += 24) dots.push(`<circle cx="${x}" cy="${y}" r="1.8"/>`);
  const points = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
    const [x, y] = pt(n);
    const on = n === num;
    return `<circle cx="${x}" cy="${y}" r="${on ? 12 : 6}" fill="${on ? c.main : '#fff'}" stroke="${INK}" stroke-width="${on ? 4 : 3}"${on ? ' class="eg-on"' : ''}/>`;
  }).join('');
  return `<svg class="eg-art" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
    <clipPath id="eg-clip-${k}"><rect x="4" y="4" width="192" height="192" rx="40"/></clipPath>
  </defs>
  <g clip-path="url(#eg-clip-${k})">
    <rect x="0" y="0" width="200" height="200" fill="${c.ink}"/>
    <g fill="${c.main}" fill-opacity=".25">${dots.join('')}</g>
    <g class="eg-spin">
      <circle cx="100" cy="104" r="66" fill="${c.main}" fill-opacity=".14" stroke="${INK}" stroke-width="3.5"/>
      <polygon points="${poly([3, 6, 9])}" fill="none" stroke="${INK}" stroke-opacity=".55" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="${poly([1, 4, 2, 8, 5, 7])}" fill="none" stroke="${c.main}" stroke-width="2.5" stroke-linejoin="round"/>
    </g>
    ${points}
  </g>
  <rect x="4" y="4" width="192" height="192" rx="40" fill="none" stroke="${INK}" stroke-opacity=".9" stroke-width="3"/>
</svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const num = id === 'mystery' ? 0 : CORE.TYPES[id].num;
  const q = id === 'mystery' ? '<span class="eg-q" aria-hidden="true">?</span>' : '';
  return `<div class="eg-hero ${cls}" style="--h-main:${c.main}" aria-hidden="true">
      ${artSvg(c, num)}
      <span class="eg-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, artSvg, MYSTERY };
