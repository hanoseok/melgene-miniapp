/**
 * 테토·에겐 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = teto-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 물음표 달린 에너지 구슬 — 결과를 알 수 없음)
 *   mini(id)       — 찰떡 케미/티격태격 라이벌 카드용 작은 그림
 *   orbSvg(gid)    — 에너지 구슬(SVG): 왼쪽 반 테토색 · 오른쪽 반 에겐색 + 결과색 점선 고리 + 반짝이. OG 도 같은 SVG 를 크게 쓴다.
 * 색은 인라인 CSS 변수(--h-main, --h-ink, --h-teto, --h-egen)로만 넣는다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'teto-core.js'));

// 구슬 두 반쪽(모든 그림 공통) — 결과 색과 겹치지 않는 색 (검사: index 에 결과 색이 없어야 함)
const HALF = { teto: '#ff7a45', egen: '#f78fc4' };
// 시작 화면용
const MYSTERY = { emoji: '⚡', color: '#ffb547', deep: '#a8620c', ink: '#fff6e8' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function orbSvg(gid = 'tog') {
  const sparks = [[30, 38], [168, 44], [176, 150], [24, 160]].map(([x, y], i) =>
    `<path d="M${x} ${y - 7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="var(--h-main)" opacity="${i % 2 ? 0.7 : 0.95}"/>`).join('');
  return `<svg class="tt-orb" viewBox="0 0 200 200" aria-hidden="true">
        <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="var(--h-teto)"/><stop offset=".5" stop-color="var(--h-teto)"/><stop offset=".5" stop-color="var(--h-egen)"/><stop offset="1" stop-color="var(--h-egen)"/></linearGradient></defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--h-main)" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round"/>
        <circle cx="100" cy="100" r="80" fill="url(#${gid})"/>
        <circle cx="100" cy="100" r="62" fill="var(--h-ink)" stroke="#ffffff" stroke-width="4"/>
        <path d="M100 20v18M100 162v18" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity=".9"/>
        ${sparks}
      </svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="tt-q" aria-hidden="true">?</span>' : '';
  return `<div class="tt-hero ${cls}" style="--h-main:${c.color};--h-ink:${c.ink};--h-teto:${HALF.teto};--h-egen:${HALF.egen}" aria-hidden="true">
      ${orbSvg('tog-' + (cls.replace(/[^a-z0-9-]/gi, '') || 'x'))}
      <span class="tt-emo">${c.emoji}</span>${q}
    </div>`;
}

function mini(id) {
  const c = colors(id);
  return `<span class="tt-mini" style="--h-main:${c.color};--h-ink:${c.ink}" aria-hidden="true">${c.emoji}</span>`;
}

module.exports = { hero, mini, colors, orbSvg, MYSTERY, HALF };
