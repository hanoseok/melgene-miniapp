#!/usr/bin/env node
/**
 * data.js의 채점 가중치로 200,000개의 무작위 답변 조합을 뽑아
 * 16개 결과 타입의 도달 분포를 검증한다.
 * 목표: 어떤 타입도 2% 미만 또는 12% 초과로 쏠리지 않을 것.
 * 가중치는 data.js 한 곳에만 있으므로 모든 언어가 같은 분포를 가진다. 추가로 모든 언어 파일(12개)
 * (tools/i18n/<lang>.js)을 검사한다:
 *   - data.js와 같은 타입 16종·문항 수·보기 수, en.js 와 키 구조가 완전히 같은지(typography 제외)
 *   - 자리표시자({name}/{emoji}/{tagline}), FAQ 3~5개({q,a}), 한국어 파일이 아닌데 한글이 남았는지
 *   - 스포일러: 메타·OG·시작 화면·FAQ 문구에 결과 이름이 들어가지 않았는지
 *   - 360px 화면 폭 예산(글자 폭 추정): 배지·시작 버튼·다시 하기 한 줄, 결과 이름이 OG 이미지에 들어가는지
 *   - 생성된 결과 페이지(r/<type>.html): 인연·악연은 보여주기만 — 다른 결과 페이지로 가는 링크가 하나도 없는지
 *
 * 실행: node tools/check-reach.js
 * (node를 못 찾으면: source "$NVM_DIR/nvm.sh" 먼저 실행)
 */
const path = require('path');
const DATA = require(path.join(__dirname, '..', 'data.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const L10N = G.loadSiteLocales(path.join(__dirname, '..'));
const NAMES = L10N[G.DEFAULT_LOCALE].types;

const TRIALS = 200000;
const LO = 0.02;
const HI = 0.12;

function pickResult(totals) {
  // 동점 시 order 배열의 앞쪽(먼저 등장한 타입)이 우선 — data.js의 order와 동일한 규칙
  let best = DATA.order[0];
  let bestVal = -Infinity;
  for (const id of DATA.order) {
    const v = totals[id] || 0;
    if (v > bestVal) {
      bestVal = v;
      best = id;
    }
  }
  return best;
}

// ---------------------------------------------------------------
// 언어 파일 검사
// ---------------------------------------------------------------
// 키 구조(배열은 길이까지). typography 는 언어마다 글꼴이 달라 제외한다.
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
  if (o && typeof o === 'object') {
    return Object.keys(o).filter((k) => !(p === '' && k === 'typography')).sort()
      .flatMap((k) => [`${p}.${k}`, ...(o[k] && typeof o[k] === 'object' ? shape(o[k], `${p}.${k}`) : [])]);
  }
  return [];
}

// 360px 화면에서의 대략적인 글자 폭(em). 한중일 1, 태국어 결합 기호 0, 라틴 소문자 0.55 …
function emWidth(str) {
  let w = 0;
  for (const ch of String(str).replace(/<[^>]+>/g, '')) {
    const c = ch.codePointAt(0);
    if (/\p{Extended_Pictographic}/u.test(ch)) w += 1.2;
    else if (c === 0xfe0f || c === 0x200d) w += 0;
    else if ((c >= 0x0e31 && c === 0x0e31) || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e)) w += 0; // 태국어 위·아래 기호
    else if (c >= 0x0e00 && c <= 0x0e7f) w += 0.62;
    else if ((c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x3000 && c <= 0x303f)) w += 1;
    else if (ch === ' ' || ch === '\u00a0' || ch === '\u202f') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-Ž]/.test(ch) && ch === ch.toUpperCase() && ch !== ch.toLowerCase()) w += 0.68;
    else if (/[А-ЯЁ]/.test(ch)) w += 0.74; // 키릴 대문자 (Pretendard 실측 평균 0.74em)
    else if (/[жмфшщъыю]/.test(ch)) w += 0.8; // 넓은 키릴 소문자
    else if (/[а-яё]/.test(ch)) w += 0.58; // 그 밖 키릴 소문자
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[.,:;!?'’"“”«»()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.56;
  }
  return w;
}
const plainLines = (html) => String(html).split(/<br\s*\/?>/i).map((l) => l.replace(/<[^>]+>/g, ''));

// 폭 예산: 360px - 좌우 16px 여백 = 328px (style.css / base.css 글자 크기 기준, 굵은 글꼴 5% 여유)
const BUDGET = [
  { key: 'landing.badge', get: (T) => T.landing.badge, px: 328 - 28, size: 12.5 * 1.05, hard: true, what: '배지 한 줄' },
  { key: 'landing.start', get: (T) => T.landing.start, px: 328 - 40, size: 16 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'landing.h1Kicker', get: (T) => T.landing.h1Kicker, px: 328 - 56, size: 13 * 1.25, hard: true, what: 'h1 검색어 줄(자간 포함)' },
  { key: 'result.good', get: (T) => T.result.good, px: (328 - 10) / 2 - 24, size: 11 * 1.1, hard: false, what: '인연 라벨 한 줄' },
  { key: 'result.bad', get: (T) => T.result.bad, px: (328 - 10) / 2 - 24, size: 11 * 1.1, hard: false, what: '악연 라벨 한 줄' },
];

function checkLocales() {
  const problems = [];
  const warns = [];
  const EN = L10N.en;
  const base = new Set(shape(EN));
  Object.keys(L10N).forEach((lang) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    // 1) 구조
    DATA.order.forEach((id) => {
      const t = T.types && T.types[id];
      if (!t) { problems.push(`${tag} types.${id} 없음`); return; }
      ['name', 'tagline', 'story', 'advice'].forEach((k) => { if (!t[k]) problems.push(`${tag} types.${id}.${k} 비어 있음`); });
      if (!Array.isArray(t.traits) || t.traits.length !== 3) problems.push(`${tag} types.${id}.traits 는 3개여야 함`);
    });
    Object.keys(T.types || {}).forEach((id) => { if (!DATA.types[id]) problems.push(`${tag} data.js에 없는 타입 ${id}`); });
    if (!Array.isArray(T.questions) || T.questions.length !== DATA.questions.length) {
      problems.push(`${tag} 문항 수 ${T.questions && T.questions.length} ≠ ${DATA.questions.length}`);
    } else {
      DATA.questions.forEach((q, qi) => {
        const lq = T.questions[qi];
        if (!lq.q) problems.push(`${tag} Q${qi + 1} 질문 비어 있음`);
        if (!Array.isArray(lq.choices) || lq.choices.length !== q.choices.length) {
          problems.push(`${tag} Q${qi + 1} 보기 수 ${lq.choices && lq.choices.length} ≠ ${q.choices.length}`);
        } else if (lq.choices.some((c) => !c)) problems.push(`${tag} Q${qi + 1} 빈 보기`);
      });
    }
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) problems.push(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) problems.push(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
    }
    // 2) 자리표시자·FAQ·글꼴 설정
    if (!/\{name\}/.test(T.result.title || '')) problems.push(`${tag} result.title 에 {name} 없음`);
    ['{name}', '{emoji}', '{tagline}'].forEach((ph) => { if (!(T.result.shareText || '').includes(ph)) problems.push(`${tag} result.shareText 에 ${ph} 없음`); });
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) problems.push(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => { if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) problems.push(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`); });
    if (!T.typography || typeof T.typography !== 'object') problems.push(`${tag} typography 없음`);
    if ((T.landing.h1Html.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>.+<\/em>/.test(T.landing.h1Html)) problems.push(`${tag} landing.h1Html 은 <br> 1개 + <em> 강조`);
    // 3) 번역 누락: 한국어 파일이 아닌데 한글이 남음
    if (lang !== 'ko') {
      const json = JSON.stringify(T);
      const m = json.match(/[\uac00-\ud7af\u1100-\u11ff]+/);
      if (m) problems.push(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    // 4) 스포일러: 시작 전 화면·메타·OG·FAQ 에 결과 이름 금지
    const pre = JSON.stringify([T.meta, T.og, T.landing, T.faq]);
    DATA.order.forEach((id) => {
      const name = T.types[id] && T.types[id].name;
      if (name && pre.includes(name)) problems.push(`${tag} 스포일러: 결과 이름 "${name}" 이 메타/OG/시작 화면/FAQ 에 있음`);
    });
    // 5) 360px 폭 예산
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const need = emWidth(v) * b.size + (b.key === 'landing.h1Kicker' && !/^(th)$/.test(lang) ? [...v].length * 13 * 0.16 : 0);
      if (need > b.px) (b.hard ? problems : warns).push(`${tag} ${b.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(b.px)}px (${b.what})`);
    });
    const h1Size = lang === 'de' ? 27 : 30;
    plainLines(T.landing.h1Html).forEach((line, i) => {
      const need = emWidth(line) * h1Size * 1.05;
      if (need > 328) warns.push(`${tag} h1 ${i + 1}번째 줄 "${line}" ≈ ${Math.round(need)}px > 328px (줄바꿈됨)`);
    });
    DATA.order.forEach((id) => {
      const name = T.types[id].name;
      const og = emWidth(name) * 30;
      if (og > 880 * 2) problems.push(`${tag} types.${id}.name 이 OG 이미지 두 줄에도 안 들어감 (≈${Math.round(og)}px)`);
      else if (og > 880) warns.push(`${tag} types.${id}.name 은 OG 이미지에서 두 줄로 표시됨`);
    });
  });
  warns.forEach((w) => console.log('  (참고) ' + w));
  return problems;
}

// 결과 페이지에 다른 결과로 가는 링크 금지 (인연·악연 카드도 링크 아님 — 스포일러 금지)
function checkResultLinks() {
  const fs = require('fs');
  const SITE = path.join(__dirname, '..');
  const out = [];
  G.LOCALES.forEach((l) => {
    DATA.order.forEach((id) => {
      const f = path.join(SITE, G.fileOf(l.code, `r/${id}.html`));
      if (!fs.existsSync(f)) return;
      const html = fs.readFileSync(f, 'utf8');
      const links = [...html.matchAll(/href="(?:\.\/)?([a-z-]+)\.html"/g)].map((m) => m[1]).filter((x) => DATA.types[x] && x !== id); // 자기 자신(언어 링크)은 괜찮다
      if (links.length) out.push(`[${l.code}] r/${id}.html 에 다른 결과 링크(${links.join(', ')}) — 인연·악연도 링크 금지`);
      if ((html.match(/<div class="pl-match-card">/g) || []).length !== 2) out.push(`[${l.code}] r/${id}.html 인연·악연 카드(div) 2개가 아님`);
    });
  });
  return out;
}

function run() {
  const counts = {};
  DATA.order.forEach((id) => { counts[id] = 0; });

  for (let t = 0; t < TRIALS; t++) {
    const totals = {};
    for (const q of DATA.questions) {
      const choice = q.choices[(Math.random() * q.choices.length) | 0];
      for (const [typeId, w] of Object.entries(choice.weights)) {
        totals[typeId] = (totals[typeId] || 0) + w;
      }
    }
    const result = pickResult(totals);
    counts[result]++;
  }

  console.log(`\n=== 전생 테스트 도달 분포 (무작위 ${TRIALS.toLocaleString()}회 시뮬레이션) ===\n`);

  let minPct = Infinity;
  let maxPct = -Infinity;
  let minId = '', maxId = '';
  let fail = false;

  DATA.order.forEach((id) => {
    const pct = counts[id] / TRIALS;
    const type = DATA.types[id];
    const bar = '█'.repeat(Math.round(pct * 200));
    const flag = pct < LO || pct > HI ? '  <-- 범위 밖!' : '';
    console.log(
      `${(type.emoji + ' ' + NAMES[id].name).padEnd(28, ' ')} ${(pct * 100).toFixed(2).padStart(6)}%  ${bar}${flag}`
    );
    if (pct < LO || pct > HI) fail = true;
    if (pct < minPct) { minPct = pct; minId = id; }
    if (pct > maxPct) { maxPct = pct; maxId = id; }
  });

  console.log(`\n최소: ${NAMES[minId].name} (${(minPct * 100).toFixed(2)}%)`);
  console.log(`최대: ${NAMES[maxId].name} (${(maxPct * 100).toFixed(2)}%)`);
  console.log(`기준: 2.00% ~ 12.00%\n`);

  const problems = checkLocales().concat(checkResultLinks());
  const langs = Object.keys(L10N);
  console.log(`언어 파일 ${langs.length}개: ${langs.join(', ')} — ${problems.length ? '문제 ' + problems.length + '건' : '구조·자리표시자·FAQ·스포일러·길이 모두 통과'}`);
  problems.forEach((p) => console.error('  - ' + p));

  if (fail || problems.length) {
    if (fail) console.error('결과: 실패 — 분포가 범위 밖입니다. 가중치를 조정하세요 (data.js의 questions[].choices[].weights).');
    if (problems.length) console.error('결과: 실패 — 언어 파일(tools/i18n/<lang>.js)을 고치세요.');
    process.exit(1);
  } else {
    console.log(`결과: 통과 — 모든 타입이 2%~12% 범위 안에 있고, ${langs.length}개 언어 파일이 모두 맞습니다.`);
    process.exit(0);
  }
}

run();
