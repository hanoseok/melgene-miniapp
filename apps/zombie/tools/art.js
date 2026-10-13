/**
 * 좀비 생존 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = zombie-core.js 의 역할 id, 또는 'mystery'(시작 화면·기본 OG: 물음표 달린 좀비 — 결과를 알 수 없음)
 *   mini(id)       — 최고/최악의 파트너 카드용 작은 그림
 *   badgeSvg(gid)  — 생존자 패치(SVG): 위험 표시 줄무늬 테두리 + 리벳 + 빛나는 안쪽 원. OG 도 같은 SVG 를 크게 쓴다.
 * 그림 = 밤에 빛나는 생존자 패치(천 패치 느낌의 원형 엠블럼) + 가운데 이모지. 색은 인라인 CSS 변수로만 넣는다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'zombie-core.js'));

// 시작 화면용 — 결과 색과 겹치지 않는 색(검사: index 에 결과 색이 없어야 함)
const MYSTERY = { emoji: '🧟', color: '#c6f432', deep: '#5d7a12', ink: '#18210b' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

// 생존자 패치. 색은 var(--h-*) — 부르는 쪽이 style 로 넣는다.
function badgeSvg(gid = 'zbg') {
  const rivets = [0, 60, 120, 180, 240, 300].map((deg) => {
    const r = (deg * Math.PI) / 180;
    const x = (100 + 78 * Math.cos(r)).toFixed(1), y = (100 + 78 * Math.sin(r)).toFixed(1);
    return `<circle cx="${x}" cy="${y}" r="3.2" fill="var(--h-main)" opacity=".9"/>`;
  }).join('');
  return `<svg class="zb-patch" viewBox="0 0 200 200" aria-hidden="true">
        <defs><radialGradient id="${gid}" cx="50%" cy="38%" r="65%"><stop offset="0" stop-color="var(--h-main)" stop-opacity=".55"/><stop offset=".55" stop-color="var(--h-ink)" stop-opacity=".95"/><stop offset="1" stop-color="var(--h-ink)"/></radialGradient></defs>
        <circle cx="100" cy="100" r="95" fill="none" stroke="var(--h-main)" stroke-width="8" stroke-dasharray="14 9" opacity=".95"/>
        <circle cx="100" cy="100" r="86" fill="url(#${gid})" stroke="var(--h-deep)" stroke-width="3"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="var(--h-main)" stroke-width="1.6" stroke-dasharray="3 5" opacity=".7"/>
        ${rivets}
        <path d="M44 150c18 14 38 20 56 20s38-6 56-20" fill="none" stroke="var(--h-main)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>
      </svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="zb-q" aria-hidden="true">?</span>' : '';
  return `<div class="zb-hero ${cls}" style="--h-main:${c.color};--h-ink:${c.ink};--h-deep:${c.deep}" aria-hidden="true">
      ${badgeSvg('zbg-' + (cls.replace(/[^a-z0-9-]/gi, '') || 'x'))}
      <span class="zb-emo">${c.emoji}</span>${q}
    </div>`;
}

function mini(id) {
  const c = colors(id);
  return `<span class="zb-mini" style="--h-main:${c.color};--h-ink:${c.ink}" aria-hidden="true">${c.emoji}</span>`;
}

module.exports = { hero, mini, colors, badgeSvg, MYSTERY };
