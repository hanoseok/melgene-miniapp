/**
 * 몬스터 12종 + 시작 화면용 "정체불명" 그림 (인라인 SVG, 언어 무관). 생성기(gen-i18n.js)와 OG(gen-og.js)가 쓴다.
 * 무섭지 않은 귀여운 얼굴 스타일(굵은 외곽선·동그란 눈·볼터치). viewBox 0 0 200 200.
 * 시작 화면은 결과를 인용하지 않도록 mystery 그림만 쓴다(스포일러 금지).
 */
const O = '#2a1540'; // 외곽선
const SW = 5;

function eyes(x1, x2, y, r = 8) {
  return `<g fill="${O}"><ellipse cx="${x1}" cy="${y}" rx="${r - 1}" ry="${r + 1}"/><ellipse cx="${x2}" cy="${y}" rx="${r - 1}" ry="${r + 1}"/></g>` +
    `<g fill="#fff"><circle cx="${x1 + 2.5}" cy="${y - 3}" r="2.6"/><circle cx="${x2 + 2.5}" cy="${y - 3}" r="2.6"/></g>`;
}
function blush(x1, x2, y) {
  return `<g fill="#ff7aa8" opacity=".45"><ellipse cx="${x1}" cy="${y}" rx="10" ry="6"/><ellipse cx="${x2}" cy="${y}" rx="10" ry="6"/></g>`;
}
const st = `stroke="${O}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;

const ART = {
  vampire: `
    <path d="M28 196 L48 118 L100 146 L152 118 L172 196Z" fill="#8c1538" ${st}/>
    <path d="M60 196 L70 140 L100 156 L130 140 L140 196Z" fill="#e0445c"/>
    <circle cx="100" cy="104" r="54" fill="#f6eaf6" ${st}/>
    <path d="M47 98 C44 48 156 48 153 98 C140 82 120 74 100 94 C80 74 60 82 47 98Z" fill="${O}"/>
    ${eyes(80, 120, 110)}
    ${blush(68, 132, 128)}
    <path d="M84 134 Q100 146 116 134" fill="none" ${st}/>
    <path d="M89 138 L93 149 L97 140Z M103 140 L107 149 L111 138Z" fill="#fff" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>`,

  werewolf: `
    <path d="M48 86 L58 22 L98 62Z" fill="#8a5a3c" ${st}/>
    <path d="M152 86 L142 22 L102 62Z" fill="#8a5a3c" ${st}/>
    <path d="M62 70 L66 40 L84 60Z M138 70 L134 40 L116 60Z" fill="#f2a9b8"/>
    <path d="M38 110 L30 122 L42 126 L36 140 L52 140 C60 172 140 172 148 140 L164 140 L158 126 L170 122 L162 110 C160 70 40 70 38 110Z" fill="#a8744f" ${st}/>
    <ellipse cx="100" cy="138" rx="34" ry="24" fill="#efd3b0" ${st}/>
    <ellipse cx="100" cy="124" rx="10" ry="7" fill="${O}"/>
    ${eyes(74, 126, 102)}
    <path d="M64 88 L84 94 M136 88 L116 94" fill="none" ${st}/>
    <path d="M88 144 Q94 150 100 144 Q106 150 112 144" fill="none" ${st}/>
    <path d="M106 146 L109 155 L112 146Z" fill="#fff" stroke="${O}" stroke-width="2.5" stroke-linejoin="round"/>`,

  witch: `
    <path d="M52 110 C40 150 50 180 60 190 M148 110 C160 150 150 180 140 190" fill="none" stroke="#6b3fb8" stroke-width="16" stroke-linecap="round"/>
    <circle cx="100" cy="122" r="50" fill="#a6e27a" ${st}/>
    <ellipse cx="100" cy="80" rx="80" ry="15" fill="#3b1f6b" ${st}/>
    <path d="M58 78 L108 8 Q116 4 118 14 L142 78Z" fill="#5a31a3" ${st}/>
    <path d="M66 70 L136 70 L139 78 L62 78Z" fill="#ff8a1f"/>
    <rect x="92" y="64" width="16" height="16" rx="3" fill="#ffd23f" stroke="${O}" stroke-width="3"/>
    ${eyes(82, 118, 122)}
    ${blush(70, 130, 140)}
    <path d="M100 126 L106 136 L98 136" fill="none" stroke="${O}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M86 148 Q100 158 114 148" fill="none" ${st}/>`,

  ghost: `
    <path d="M44 172 V96 C44 42 156 42 156 96 V172 L137 158 L118 174 L100 158 L82 174 L63 158Z" fill="#ffffff" ${st}/>
    <g fill="${O}"><ellipse cx="80" cy="100" rx="9" ry="13"/><ellipse cx="120" cy="100" rx="9" ry="13"/></g>
    <g fill="#fff"><circle cx="83" cy="95" r="3"/><circle cx="123" cy="95" r="3"/></g>
    ${blush(66, 134, 122)}
    <ellipse cx="100" cy="128" rx="7" ry="9" fill="${O}"/>`,

  zombie: `
    <rect x="46" y="48" width="108" height="124" rx="42" fill="#9ccc6a" ${st}/>
    <path d="M50 88 C44 44 76 36 100 44 C120 30 160 40 152 88 C140 70 132 78 124 64 C112 80 96 66 88 76 C78 64 66 80 50 88Z" fill="#4a6b2a" ${st}/>
    <path d="M110 92 L140 86 M116 84 L118 96 M126 82 L128 94 M134 80 L136 92" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="78" cy="114" r="12" fill="#fff" ${st}/>
    <circle cx="80" cy="116" r="5" fill="${O}"/>
    <circle cx="122" cy="116" r="11" fill="#fff" ${st}/>
    <path d="M110 112 L134 112" stroke="${O}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="121" cy="120" r="4" fill="${O}"/>
    <path d="M78 148 Q88 142 98 150 Q110 158 122 146" fill="none" ${st}/>
    <rect x="98" y="148" width="9" height="9" rx="2" fill="#fff" stroke="${O}" stroke-width="2.5"/>
    <rect x="58" y="132" width="26" height="11" rx="5" fill="#f6c89f" stroke="${O}" stroke-width="3" transform="rotate(-20 71 137)"/>`,

  mummy: `
    <rect x="48" y="40" width="104" height="134" rx="48" fill="#efe0bd" ${st}/>
    <g fill="none" stroke="#c9b487" stroke-width="4" stroke-linecap="round">
      <path d="M56 70 L144 58"/><path d="M52 88 L148 80"/><path d="M52 132 L148 124"/><path d="M54 150 L146 146"/><path d="M62 164 L140 160"/><path d="M60 52 L130 46"/>
    </g>
    <path d="M50 100 Q100 92 150 100 L150 118 Q100 110 50 118Z" fill="${O}"/>
    <circle cx="82" cy="108" r="9" fill="#fff"/><circle cx="84" cy="109" r="4.5" fill="${O}"/>
    <path d="M110 108 Q120 101 130 108" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    ${blush(70, 130, 136)}
    <path d="M148 140 C166 146 170 160 176 170 C168 168 160 162 150 158" fill="#efe0bd" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>`,

  frank: `
    <rect x="32" y="122" width="18" height="18" rx="4" fill="#b9b3c9" ${st}/>
    <rect x="150" y="122" width="18" height="18" rx="4" fill="#b9b3c9" ${st}/>
    <rect x="50" y="44" width="100" height="126" rx="20" fill="#7fd49a" ${st}/>
    <path d="M46 42 H154 V74 L142 64 L130 76 L118 64 L106 76 L94 64 L82 76 L70 64 L58 76 L46 66Z" fill="${O}"/>
    <path d="M64 88 L96 84 M72 80 L72 92 M82 79 L82 91 M90 78 L90 90" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
    ${eyes(80, 120, 114)}
    ${blush(68, 132, 134)}
    <path d="M78 146 H122" fill="none" ${st}/>
    <path d="M86 140 V152 M100 140 V152 M114 140 V152" fill="none" stroke="${O}" stroke-width="3" stroke-linecap="round"/>`,

  pumpkin: `
    <path d="M100 52 C98 36 104 26 116 20" fill="none" stroke="#4d7a2a" stroke-width="10" stroke-linecap="round"/>
    <path d="M104 40 C118 30 138 34 142 44 C128 50 114 48 104 40Z" fill="#6fbf3f" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>
    <ellipse cx="66" cy="118" rx="42" ry="58" fill="#f07a14" ${st}/>
    <ellipse cx="134" cy="118" rx="42" ry="58" fill="#f07a14" ${st}/>
    <ellipse cx="100" cy="116" rx="44" ry="62" fill="#ff8a1f" ${st}/>
    <path d="M70 100 L86 84 L96 104Z M130 100 L114 84 L104 104Z" fill="#ffe066" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M94 116 L100 106 L106 116Z" fill="#ffe066" stroke="${O}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M66 128 Q100 168 134 128 L124 134 L116 128 L108 138 L100 130 L92 138 L84 128 L76 134Z" fill="#ffe066" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>`,

  blackcat: `
    <path d="M46 96 L52 30 L96 64Z" fill="#2e2346" ${st}/>
    <path d="M154 96 L148 30 L104 64Z" fill="#2e2346" ${st}/>
    <path d="M60 74 L63 46 L82 64Z M140 74 L137 46 L118 64Z" fill="#f2a9b8"/>
    <ellipse cx="100" cy="116" rx="64" ry="54" fill="#2e2346" ${st}/>
    <ellipse cx="76" cy="108" rx="15" ry="17" fill="#ffd23f" stroke="${O}" stroke-width="3"/>
    <ellipse cx="124" cy="108" rx="15" ry="17" fill="#ffd23f" stroke="${O}" stroke-width="3"/>
    <ellipse cx="76" cy="109" rx="4" ry="12" fill="${O}"/><ellipse cx="124" cy="109" rx="4" ry="12" fill="${O}"/>
    <circle cx="80" cy="102" r="3" fill="#fff"/><circle cx="128" cy="102" r="3" fill="#fff"/>
    <path d="M94 130 L106 130 L100 137Z" fill="#f2a9b8"/>
    <path d="M88 142 Q94 148 100 140 Q106 148 112 142" fill="none" stroke="#e9e1ff" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 126 L70 130 M40 140 L70 136 M160 126 L130 130 M160 140 L130 136" stroke="#e9e1ff" stroke-width="2.5" stroke-linecap="round"/>`,

  reaper: `
    <path d="M150 30 Q186 40 188 80" fill="none" stroke="#c9c3dc" stroke-width="9" stroke-linecap="round"/>
    <path d="M146 26 L150 196" stroke="#8a6a4a" stroke-width="7" stroke-linecap="round"/>
    <path d="M38 190 C36 96 58 34 100 34 C142 34 164 96 162 190Z" fill="#3e3172" ${st}/>
    <path d="M60 190 C66 150 80 140 100 140 C120 140 134 150 140 190" fill="#322860"/>
    <ellipse cx="100" cy="108" rx="38" ry="44" fill="#120a22" stroke="${O}" stroke-width="3"/>
    <g fill="#9fe8ff"><ellipse cx="85" cy="104" rx="8" ry="10"/><ellipse cx="115" cy="104" rx="8" ry="10"/></g>
    <g fill="#9fe8ff" opacity=".3"><circle cx="85" cy="104" r="16"/><circle cx="115" cy="104" r="16"/></g>
    <path d="M90 128 Q100 134 110 128" fill="none" stroke="#9fe8ff" stroke-width="3.5" stroke-linecap="round"/>`,

  fox: `
    <g stroke="${O}" stroke-width="4" stroke-linejoin="round">
      <ellipse cx="100" cy="112" rx="16" ry="58" fill="#ff9a55" transform="rotate(-48 100 170)"/>
      <ellipse cx="100" cy="112" rx="16" ry="58" fill="#ff9a55" transform="rotate(-22 100 170)"/>
      <ellipse cx="100" cy="112" rx="16" ry="58" fill="#ff9a55" transform="rotate(22 100 170)"/>
      <ellipse cx="100" cy="112" rx="16" ry="58" fill="#ff9a55" transform="rotate(48 100 170)"/>
    </g>
    <g fill="#fff6e6"><circle cx="25.7" cy="103" r="10"/><circle cx="62.5" cy="77" r="10"/><circle cx="137.5" cy="77" r="10"/><circle cx="174.3" cy="103" r="10"/></g>
    <path d="M52 92 L56 30 L94 66Z" fill="#ff7a3d" ${st}/>
    <path d="M148 92 L144 30 L106 66Z" fill="#ff7a3d" ${st}/>
    <path d="M56 44 L57 32 L67 42Z M144 44 L143 32 L133 42Z" fill="${O}"/>
    <path d="M42 94 Q100 50 158 94 Q162 140 100 176 Q38 140 42 94Z" fill="#ff7a3d" ${st}/>
    <path d="M46 110 Q70 112 100 150 Q130 112 154 110 Q150 146 100 176 Q50 146 46 110Z" fill="#fff6e6"/>
    <path d="M42 94 Q100 50 158 94 Q162 140 100 176 Q38 140 42 94Z" fill="none" ${st}/>
    <path d="M68 108 Q78 98 88 108 M112 108 Q122 98 132 108" fill="none" ${st}/>
    ${blush(66, 134, 124)}
    <ellipse cx="100" cy="150" rx="8" ry="6" fill="${O}"/>`,

  skeleton: `
    <rect x="68" y="120" width="64" height="44" rx="16" fill="#f7f3e8" ${st}/>
    <circle cx="100" cy="94" r="56" fill="#f7f3e8" ${st}/>
    <path d="M70 130 Q100 142 130 130" fill="#f7f3e8"/>
    <g fill="${O}"><ellipse cx="78" cy="98" rx="15" ry="17"/><ellipse cx="122" cy="98" rx="15" ry="17"/></g>
    <g fill="#fff"><circle cx="83" cy="92" r="4"/><circle cx="127" cy="92" r="4"/></g>
    <path d="M100 116 C94 110 92 120 100 126 C108 120 106 110 100 116Z" fill="${O}"/>
    <path d="M78 142 H122 M86 136 V154 M100 136 V156 M114 136 V154" fill="none" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>
    ${blush(58, 142, 122)}`,

  // 시작 화면·기본 OG: 결과가 아닌 정체불명의 그림자 + 물음표
  mystery: `
    <path d="M44 184 C40 110 60 52 100 52 C140 52 160 110 156 184 L136 170 L118 186 L100 170 L82 186 L64 170Z" fill="#3a1f66" stroke="#140a24" stroke-width="5" stroke-linejoin="round"/>
    <g fill="#ffe066"><ellipse cx="82" cy="112" rx="9" ry="12"/><ellipse cx="118" cy="112" rx="9" ry="12"/></g>
    <g fill="#ffe066" opacity=".25"><circle cx="82" cy="112" r="20"/><circle cx="118" cy="112" r="20"/></g>
    <path d="M86 140 Q100 150 114 140" fill="none" stroke="#ffe066" stroke-width="4" stroke-linecap="round"/>
    <path d="M84 30 C84 12 116 12 116 30 C116 42 100 42 100 54" fill="none" stroke="#ff8a1f" stroke-width="8" stroke-linecap="round"/>
    <circle cx="100" cy="68" r="5" fill="#ff8a1f"/>`,
};

function svg(id, cls = 'mon-art-svg', label = '') {
  const body = ART[id];
  if (!body) throw new Error(`art 없음: ${id}`);
  const a11y = label ? ` role="img" aria-label="${String(label).replace(/"/g, '&quot;')}"` : ' aria-hidden="true"';
  return `<svg class="${cls}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"${a11y}>${body.replace(/\n\s*/g, '')}</svg>`;
}

module.exports = { ART, svg };
