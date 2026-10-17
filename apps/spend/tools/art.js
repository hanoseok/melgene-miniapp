/**
 * 소비 성향 테스트 그림 — 생성기(gen-i18n.js)와 OG 이미지(gen-og.js)가 같이 쓴다. 배포되지 않는다(HTML 에 인라인).
 *   hero(id, cls)  — id = spend-core.js 의 결과 id, 또는 'mystery'(시작 화면·기본 OG: 물음표 달린 동전 — 결과를 알 수 없음)
 *   orbSvg(gid)    — 동전(SVG): 금빛 테두리 + 결과색 점선 고리 + 반짝이. OG 도 같은 SVG 를 크게 쓴다.
 * 색은 인라인 CSS 변수(--h-main, --h-ink, --h-teto(금색 바깥), --h-egen(금색 안쪽))로만 넣는다.
 */
const path = require('path');
const CORE = require(path.join(__dirname, '..', 'spend-core.js'));

// 동전 바깥/안쪽 금색(모든 그림 공통) — 결과 색과 겹치지 않는다
const HALF = { teto: '#ffd36b', egen: '#ffb020' };
// 시작 화면용
const MYSTERY = { emoji: '💸', color: '#ffc83d', deep: '#a86300', ink: '#fff8e8' };

function colors(id) {
  return id === 'mystery' ? MYSTERY : CORE.TYPES[id];
}

function orbSvg(gid = 'sog') {
  const sparks = [[30, 38], [168, 44], [176, 150], [24, 160]].map(([x, y], i) =>
    `<path d="M${x} ${y - 7}l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="var(--h-main)" opacity="${i % 2 ? 0.7 : 0.95}"/>`).join('');
  return `<svg class="sp-orb" viewBox="0 0 200 200" aria-hidden="true">
        <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--h-teto)"/><stop offset="1" stop-color="var(--h-egen)"/></linearGradient></defs>
        <circle cx="100" cy="100" r="92" fill="none" stroke="var(--h-main)" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round"/>
        <circle cx="100" cy="100" r="80" fill="url(#${gid})"/>
        <circle cx="100" cy="100" r="70" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round" opacity=".85"/>
        <circle cx="100" cy="100" r="58" fill="var(--h-ink)" stroke="#ffffff" stroke-width="4"/>
        ${sparks}
      </svg>`;
}

function hero(id, cls = '') {
  const c = colors(id);
  const q = id === 'mystery' ? '<span class="sp-q" aria-hidden="true">?</span>' : '';
  return `<div class="sp-hero ${cls}" style="--h-main:${c.color};--h-ink:${c.ink};--h-teto:${HALF.teto};--h-egen:${HALF.egen}" aria-hidden="true">
      ${orbSvg('sog-' + (cls.replace(/[^a-z0-9-]/gi, '') || 'x'))}
      <span class="sp-emo">${c.emoji}</span>${q}
    </div>`;
}

module.exports = { hero, colors, orbSvg, MYSTERY, HALF };
