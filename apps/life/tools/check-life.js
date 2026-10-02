#!/usr/bin/env node
/**
 * 내 인생 애니메이션 검증 (Node 전용, 배포되지 않음) — 모든 언어(shared/i18n.js LOCALES, 지금 12개)
 *   1) 공유 링크(#d=) 인코딩/디코딩 왕복 — 한·일·중·타이·베트남·러시아어·이모지 이름과 나만의 장면 포함
 *   2) 시드 결정성 — 같은 입력이면 같은 장면 계획·같은 획 계획(엔진 buildAll 해시), 다른 입력이면 다른 시드
 *   3) 시간순 정렬과 나이 계산 — 출생 연도 1950~2025 × 무작위 장면 조합, 연도를 비운 장면의 보간
 *   4) 장면 길이 — 전체 40~60초, 모든 획이 자기 장면 안에서 끝나는지
 *   5) 자막 길이 — 가장 좁은 패널(3컷 페이지)에서 캡션이 3줄 이내(타이어는 단어 단위, 결합 부호를 쪼개지 않음),
 *      끝 장면 제목이 과하게 줄지 않는지, 타이 불기 표시
 *   6) 언어 파일 구조 — 모든 언어에 같은 키, 모든 장면 id 에 label/line, FAQ 3~5개(짧게), 제목·설명 길이, 검색어,
 *      복수형 표(ui.plural, ru) — Intl.PluralRules 범주가 모두 있고 자리표시자가 같은지
 *   7) 360px 화면 — 줄바꿈 안 되는 버튼·칩 문구가 폭 안에 들어가는지(어림)
 *   8) 생성된 HTML — 공통 타이틀 바·h1 하나(검색어 포함)·data-mg-end 하나·MG_FAQ, FAQPage/SEO 글/다른 테스트 목록/광고 자리 없음
 *
 * 실행: node tools/check-life.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const CORE = require(path.join(__dirname, '..', 'life-core.js'));
const ENGINE = require(path.join(__dirname, '..', 'life-engine.js'));
const G = require(path.join(__dirname, '..', '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const SITE_DIR = path.join(__dirname, '..');
const L10N = G.loadSiteLocales(SITE_DIR);
const LANGS = G.LOCALES.map((l) => l.code);

const NOW = { y: 2026, m: 9 };
const failures = [];
const TODO = G.todoLocales(SITE_DIR); // 번역 대기(// TODO-TRANSLATE, en 사본) 언어의 문구 문제는 (참고)로만
const todoNotes = [];
const fail = (msg) => { if (G.isTodoMessage(msg, TODO)) { todoNotes.push(msg); return; } if (failures.length < 200) failures.push(msg); };
const rnd = CORE.mulberry32(20260926);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const sha = (obj) => crypto.createHash('sha1').update(JSON.stringify(obj, (k, v) => (v instanceof Float32Array ? Array.from(v, (x) => Math.round(x * 100)) : v))).digest('hex').slice(0, 12);

function randomInput(lang, opts = {}) {
  const birth = opts.birth != null ? opts.birth : 1950 + Math.floor(rnd() * 76); // 1950..2025
  const avail = CORE.momentsFor(lang).map((m) => m.id);
  const n = 3 + Math.floor(rnd() * 6); // 3..8
  const ids = [];
  while (ids.length < n) { const id = pick(avail); if (!ids.includes(id)) ids.push(id); }
  const withCustom = rnd() < 0.4 && ids.length < CORE.MAX_MOMENTS + 1;
  if (withCustom && ids.length >= CORE.MAX_MOMENTS) ids.pop();
  const span = NOW.y - birth;
  const moments = ids.map((id) => ({ id, year: rnd() < 0.3 ? birth + Math.floor(rnd() * (span + 1)) : null }));
  return CORE.normalizeInput({
    name: pick(['', '지수', 'Sam', 'ゆい', '민준🎈', 'Élodie', '김하늘바다구름별', '小雨', 'มิว', 'Nguyễn Linh', 'Jürgen', 'Lucía', 'Ксюша', 'Александрина']),
    birth, month: Math.floor(rnd() * 13), pen: pick(CORE.PENS), moments,
    custom: withCustom ? { text: pick(['제주도 한 달 살기', 'A summer in Lisbon', '沖縄でひと夏すごした', '첫 마라톤 완주 🏃', '가'.repeat(20), '在大理住了一个月', 'ไปอยู่เชียงใหม่หนึ่งเดือน', 'Một tháng ở Đà Lạt', 'Ein Sommer an der Ostsee', 'Лето на Байкале', 'Первый марафон — финиш!']), year: rnd() < 0.5 ? birth + Math.floor(rnd() * (span + 1)) : null } : null,
  }, NOW);
}

// ---------------------------------------------------------------
// 1) 공유 링크 왕복
// ---------------------------------------------------------------
function checkShare() {
  let n = 0;
  const fixed = [
    { name: '지수', birth: 1996, month: 3, pen: 'brush', moments: [{ id: 'school' }, { id: 'love', year: 2012 }, { id: 'job' }], custom: { text: '제주도 한 달 살기', year: 2020 } },
    { name: 'ゆい', birth: 2001, month: 0, pen: 'fountain', moments: [{ id: 'steps' }, { id: 'gapyear' }, { id: 'college' }], custom: { text: '沖縄でひと夏すごした', year: null } },
    { name: '🎈 Élodie', birth: 1950, month: 12, pen: 'ballpoint', moments: [{ id: 'wedding' }, { id: 'baby' }, { id: 'travel' }, { id: 'pet' }] },
  ].map((r) => CORE.normalizeInput(r, NOW));
  const inputs = fixed.concat(Array.from({ length: 450 }, () => randomInput(pick(LANGS))));
  inputs.forEach((inp) => {
    n++;
    const enc = CORE.encodeShare(CORE.toPayload(inp));
    if (!/^[A-Za-z0-9_-]+$/.test(enc)) fail(`share: base64url 가 아닌 문자 포함 ${enc.slice(0, 30)}`);
    const back = CORE.fromPayload(CORE.decodeShare(enc));
    if (JSON.stringify(back) !== JSON.stringify(inp)) fail(`share: 왕복 불일치 ${JSON.stringify(inp).slice(0, 120)}`);
    const url = decodeURIComponent(encodeURIComponent(enc));
    if (url !== enc) fail('share: URL 인코딩 후 달라짐');
  });
  // 잘못된 링크는 null
  ['', '!!!', CORE.encodeShare({ v: 2 }), CORE.encodeShare({ v: 1, b: 1800, k: [] }), CORE.encodeShare({ v: 1, b: 1990, y: 2026, k: ['nope'] })].forEach((bad) => {
    let r;
    try { r = CORE.fromPayload(CORE.decodeShare(bad)); } catch (e) { r = null; }
    if (r && CORE.isPlayable(r)) fail(`share: 잘못된 링크가 재생 가능으로 해석됨 ${bad}`);
  });
  return n;
}

// ---------------------------------------------------------------
// 2) 결정성
// ---------------------------------------------------------------
function checkDeterminism() {
  let n = 0;
  const seeds = new Set();
  for (let i = 0; i < 60; i++) {
    const lang = pick(LANGS);
    const inp = randomInput(lang);
    const ui = L10N[lang].ui;
    const p1 = CORE.planFilm(inp, ui), p2 = CORE.planFilm(JSON.parse(JSON.stringify(inp)), ui);
    if (JSON.stringify(p1) !== JSON.stringify(p2)) fail('determinism: 같은 입력인데 장면 계획이 다름');
    const fonts = { hand: 'x', weight: '400', scale: ui.canvasFont.scale };
    const h1 = sha(ENGINE.buildAll(p1, { fonts }).scenes);
    const h2 = sha(ENGINE.buildAll(p2, { fonts }).scenes);
    if (h1 !== h2) fail('determinism: 같은 입력인데 획 계획이 다름');
    // 공유 링크로 되살린 입력도 같은 필름
    const p3 = CORE.planFilm(CORE.fromPayload(CORE.decodeShare(CORE.encodeShare(CORE.toPayload(inp)))), ui);
    if (sha(ENGINE.buildAll(p3, { fonts }).scenes) !== h1) fail('determinism: 공유 링크로 연 필름이 다름');
    seeds.add(p1.seed);
    n++;
  }
  // 입력이 하나만 달라도 시드가 달라야 한다
  const base = CORE.normalizeInput({ birth: 1990, pen: 'brush', moments: [{ id: 'school' }, { id: 'love' }, { id: 'job' }] }, NOW);
  const variants = [
    { ...base, name: 'a' }, { ...base, birth: 1991 }, { ...base, pen: 'pencil' }, { ...base, month: 5 },
    { ...base, moments: [{ id: 'school', year: 1998 }, { id: 'love', year: null }, { id: 'job', year: null }] },
  ];
  variants.forEach((v) => { if (CORE.seedOf(v) === CORE.seedOf(base)) fail('determinism: 다른 입력인데 시드가 같음'); });
  if (seeds.size < 55) fail(`determinism: 시드 충돌이 많음 (${seeds.size}/60)`);
  return n;
}

// ---------------------------------------------------------------
// 3) 시간순·나이
// ---------------------------------------------------------------
function checkChronology() {
  let n = 0;
  for (let birth = 1950; birth <= 2025; birth++) {
    for (let k = 0; k < 12; k++) {
      const lang = pick(LANGS);
      const inp = randomInput(lang, { birth });
      if (!inp) { fail(`chrono: ${birth} 입력이 거부됨`); continue; }
      n++;
      const span = NOW.y - birth;
      const items = CORE.estimateYears(inp);
      const plan = CORE.planFilm(inp, L10N[lang].ui);
      const sc = plan.scenes;
      if (sc[0].key !== 'birth' || sc[0].year !== birth || sc[0].age !== 0) fail(`chrono: 첫 장면이 출생이 아님 (${birth})`);
      const today = sc.find((s) => s.key === 'today');
      if (!today || sc[sc.length - 1].key !== 'end' || sc[sc.length - 2] !== today) fail('chrono: 마지막이 오늘 → 끝 순서가 아님');
      const N = CORE.lifeYears(birth, inp.month, NOW.y, NOW.m);
      if (today.age !== N) fail(`chrono: 오늘 나이 ${today.age} ≠ ${N}`);
      if (N !== span - (inp.month && NOW.m < inp.month ? 1 : 0)) fail('chrono: 만 나이 계산 오류');
      for (let i = 1; i < sc.length - 1; i++) {
        const s = sc[i];
        if (s.year < sc[i - 1].year) fail(`chrono: 연도 역순 ${sc[i - 1].year} → ${s.year} (${birth})`);
        if (s.year < birth || s.year > NOW.y) fail(`chrono: 범위 밖 연도 ${s.year} (${birth}~${NOW.y})`);
        if (s.key !== 'today' && s.age !== s.year - birth) fail(`chrono: 나이 ${s.age} ≠ ${s.year}-${birth}`);
      }
      // 연도를 넣은 장면은 그 연도 그대로
      inp.moments.forEach((m) => {
        if (m.year == null) return;
        const it = items.find((x) => x.id === m.id);
        if (!it || it.year !== m.year) fail(`chrono: 지정한 연도 ${m.id}=${m.year} 가 바뀜`);
      });
      // 연도를 비운 장면: 보통 나이가 지금 나이 이하면 정확히 birth + 보통 나이
      const maxTypical = Math.max(0, ...items.filter((x) => x.estimated && x.kind === 'moment').map((x) => x.typical));
      items.filter((x) => x.estimated && x.kind === 'moment').forEach((x) => {
        if (maxTypical <= span && x.year !== birth + x.typical) fail(`chrono: ${x.id} 보간 ${x.year} ≠ ${birth + x.typical}`);
      });
    }
  }
  // 대표 사례 몇 개
  const a = CORE.estimateYears(CORE.normalizeInput({ birth: 1996, moments: [{ id: 'school' }, { id: 'love' }, { id: 'job' }] }, NOW));
  if (a.map((x) => x.year).join() !== '2003,2012,2022') fail(`chrono: 1996 기본 사례 ${a.map((x) => x.year)}`);
  const b = CORE.estimateYears(CORE.normalizeInput({ birth: 2005, moments: [{ id: 'school' }, { id: 'wedding' }, { id: 'baby' }] }, NOW));
  if (!(b[0].year === 2012 && b[1].year > 2012 && b[2].year === 2026)) fail(`chrono: 어린 사람 압축 사례 ${b.map((x) => x.year)}`);
  const c = CORE.estimateYears(CORE.normalizeInput({ birth: 1980, moments: [{ id: 'job', year: 2001 }, { id: 'college' }, { id: 'wedding' }] }, NOW));
  if (c.map((x) => x.id).join() !== 'college,job,wedding') fail(`chrono: 지정 연도와 보간 섞인 순서 ${c.map((x) => x.id)}`);
  // 기본 선택은 나이에 맞게, 최소 3개
  [1950, 1980, 1996, 2008, 2020, 2025].forEach((y) => {
    LANGS.forEach((lang) => {
      const d = CORE.defaultMoments(NOW.y - y, lang);
      if (d.length < CORE.MIN_MOMENTS || d.length > 5) fail(`defaults: ${y} ${lang} 개수 ${d.length}`);
      if (d.some((id) => !CORE.momentsFor(lang).find((m) => m.id === id))) fail(`defaults: ${lang} 에 없는 장면`);
    });
  });
  // 범위 검사
  if (CORE.normalizeInput({ birth: 1949, moments: [] }, NOW)) fail('range: 1949 가 허용됨');
  if (CORE.normalizeInput({ birth: 2026, moments: [] }, NOW)) fail('range: 올해 출생이 허용됨');
  if (!CORE.normalizeInput({ birth: 2025, moments: [] }, NOW)) fail('range: 2025 가 거부됨');
  const over = CORE.normalizeInput({ birth: 1990, moments: CORE.MOMENTS.map((m) => ({ id: m.id })), custom: { text: 'x' } }, NOW);
  if (CORE.momentCount(over) !== CORE.MAX_MOMENTS) fail('range: 장면 수가 8개로 잘리지 않음');
  return n;
}

// ---------------------------------------------------------------
// 4) 길이 / 5) 자막
// ---------------------------------------------------------------
function checkTimingAndCaptions() {
  let films = 0, captions = 0;
  const M = ENGINE.heuristicMeasure;
  LANGS.forEach((lang) => {
    const ui = L10N[lang].ui;
    const fonts = { hand: 'x', weight: ui.canvasFont.weight, scale: ui.canvasFont.scale, lh: ui.canvasFont.lh };
    for (let n = 3; n <= 8; n++) {
      const ids = CORE.momentsFor(lang).map((m) => m.id).slice(0, n);
      const inp = CORE.normalizeInput({ birth: 1985, pen: 'brush', moments: ids.map((id) => ({ id })) }, NOW);
      const plan = CORE.planFilm(inp, ui);
      if (plan.total < 40 || plan.total > 60) fail(`timing: [${lang}] 장면 ${n}개 전체 ${plan.total.toFixed(1)}초 (40~60 밖)`);
    }
    for (let i = 0; i < 25; i++) {
      const inp = randomInput(lang);
      const plan = CORE.planFilm(inp, ui);
      const all = ENGINE.buildAll(plan, { fonts });
      plan.scenes.forEach((s, si) => {
        const end = Math.max(...all.scenes[si].map((o) => o.t0 + o.dur));
        const start = Math.min(...all.scenes[si].map((o) => o.t0));
        if (start < s.t0 - 1e-6 || end > s.t0 + s.dur + 1e-6) fail(`timing: [${lang}] ${s.key} 획이 장면 밖 (${(start - s.t0).toFixed(2)}~${(end - s.t0).toFixed(2)} / ${s.dur})`);
      });
      films++;
    }
    // 가장 좁은 패널: 3컷 페이지의 아래 두 칸 (≈ 435 디자인 단위) → 캡션 최대폭 0.94배, 좌우 여백 24
    const narrowMaxW = 0.94 * 420 - 48;
    const size = 36 * fonts.scale;
    const font = `${fonts.weight} ${size}px x`;
    const mfont = `${fonts.weight} ${size * 0.72}px x`;
    const lines = [];
    Object.entries(ui.moments).forEach(([id, m]) => {
      if (!m.label || !m.line) fail(`i18n: [${lang}] moments.${id} label/line 없음`);
      lines.push(m.line);
    });
    // 나만의 장면(최대 20자)은 사용자가 쓰는 글자라 가장 넓은 경우를 넣어 본다
    lines.push(ui.birthLine, ui.todayLine, '가'.repeat(CORE.CUSTOM_MAX), 'W'.repeat(CORE.CUSTOM_MAX), 'あ'.repeat(CORE.CUSTOM_MAX),
      '画'.repeat(CORE.CUSTOM_MAX), 'ก'.repeat(CORE.CUSTOM_MAX), 'ĐƯỜNG'.repeat(4), 'ไปอยู่เชียงใหม่หนึ่งเดือนเต็ม', 'Щ'.repeat(CORE.CUSTOM_MAX), 'Переквалификация'.slice(0, CORE.CUSTOM_MAX));
    lines.forEach((ln) => {
      captions++;
      const wrapped = ENGINE.balanceWrap(ln, narrowMaxW, font, M); // 캡션이 실제로 쓰는 줄바꿈(줄 수는 wrapText 와 같다)
      if (wrapped.length > 3) fail(`caption: [${lang}] "${ln}" 좁은 칸에서 ${wrapped.length}줄`);
      if (wrapped.join('').replace(/\s/g, '') !== ln.replace(/\s/g, '')) fail(`caption: [${lang}] 줄바꿈에서 글자가 바뀜 "${ln}"`);
      // 줄 머리에 결합 부호(타이 모음·성조, U+0300~)가 오면 글자가 깨진다
      wrapped.forEach((w) => { if (/^[\u0300-\u036f\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/.test(w)) fail(`caption: [${lang}] 줄이 결합 부호로 시작 "${w}"`); });
      // 줄 머리에 대시(—/–)가 오지 않는다 (ru 타이포그래피, 엔진이 앞 단어에 붙인다)
      wrapped.slice(1).forEach((w) => { if (/^[\u2013\u2014]/.test(w)) fail(`caption: [${lang}] 줄이 대시로 시작 "${w}"`); });
      wrapped.slice(0, -1).forEach((w) => { if (/[\u0e40-\u0e44]$/.test(w)) fail(`caption: [${lang}] 줄이 타이 앞 모음으로 끝남 "${w}"`); });
    });
    const yo = ui.yearOffset || 0;
    // 나이 문구는 복수형(ru: 21 год · 74 года · 76 лет)까지 가장 긴 것을 본다
    const ages = [1, 2, 21, 22, 74, 76].map((n) => CORE.fmt(ui.metaTpl, { year: 2026 + yo, age: CORE.ageText(ui, n) }));
    ages.concat([CORE.fmt(ui.birthMetaMonth, { year: 1996 + yo, month: 12, monthName: (ui.months || [])[8] || 12 })]).forEach((mt) => {
      captions++;
      if (M(mt, mfont) > narrowMaxW) fail(`caption: [${lang}] 메타 "${mt}" 가 한 줄을 넘음`);
    });
    // 끝 장면 제목: 가장 긴 이름(12자)에서도 글자 크기가 60% 이상 유지
    const titleMax = 1016 - 64 - 40;
    const longName = { en: 'Christopherr', fr: 'Marie-Hélène', de: 'Maximilianne', es: 'María José G', vi: 'Nguyễn Thảo', ja: 'たかはしゆいなつみ', zh: '欧阳小雨晴天', th: 'ปิยะวัฒน์ชัย', ko: '김하늘바다구름별빛나', ru: 'Александрина' }[lang] || 'Christopherr';
    const t2 = [2, 22, 75].map((n) => [CORE.fmt(CORE.plural(ui, 'endTitle2', n), { n }), 112]);
    [[CORE.fmt(ui.endTitle, { name: longName }), 78], ...t2, [ui.endTitleZero, 112]].concat(ui.endTitleOne ? [[ui.endTitleOne, 112]] : []).forEach(([tt, sz]) => {
      captions++;
      const w = M(tt, `${fonts.weight} ${sz * fonts.scale}px x`);
      if (titleMax / w < 0.6) fail(`caption: [${lang}] 끝 제목 "${tt}" 이 너무 많이 줄어듦 (${(titleMax / w).toFixed(2)})`);
    });
    (ui.closings || []).concat(ui.toBeContinued).forEach((cl) => {
      captions++;
      if (ENGINE.wrapText(cl, 860 - 48, `${fonts.weight} ${46 * fonts.scale}px x`, M).length > 2) fail(`caption: [${lang}] 맺음말 "${cl}" 이 2줄을 넘음`);
    });
  });
  return { films, captions };
}

// 타이 불기 표시: 화면 문구만 +543, 입력·링크는 서기
function checkYearOffset() {
  let n = 0;
  LANGS.forEach((lang) => {
    const ui = L10N[lang].ui;
    const yo = ui.yearOffset || 0;
    const inp = CORE.normalizeInput({ birth: 1996, month: 3, pen: 'brush', moments: [{ id: 'school' }, { id: 'love' }, { id: 'job', year: 2020 }] }, NOW);
    const plan = CORE.planFilm(inp, ui);
    n++;
    if (plan.yearOffset !== yo) fail(`year: [${lang}] plan.yearOffset ${plan.yearOffset} ≠ ${yo}`);
    const job = plan.scenes.find((x) => x.id === 'job');
    if (job.year !== 2020 || job.meta.indexOf(String(2020 + yo)) === -1) fail(`year: [${lang}] 표시 연도 "${job.meta}" (기대 ${2020 + yo})`);
    if (plan.scenes[0].meta.indexOf(String(1996 + yo)) === -1) fail(`year: [${lang}] 출생 장면 표시 연도 "${plan.scenes[0].meta}"`);
    if (JSON.stringify(CORE.toPayload(inp)).indexOf(String(1996 + 543)) !== -1) fail(`year: [${lang}] 공유 데이터에 불기가 섞임`);
  });
  if ((L10N.th.ui.yearOffset || 0) !== 543) fail('year: [th] yearOffset 543 이 아님');
  return n;
}

// ---------------------------------------------------------------
// 6) 언어 파일 구조
// ---------------------------------------------------------------
// 검색어: 제목·h1 에 들어가야 하는 현지 검색어 (Update 4 표)
const SEARCH = { en: 'life animation', ja: '人生アニメ', zh: '人生动画', ko: '인생 애니메이션', fr: 'ma vie en animation', de: 'lebens-animation', th: 'แอนิเมชันชีวิต', vi: 'hoạt hình cuộc đời', es: 'animación de', it: 'animazione della', pt: 'animação da', ru: 'анимация моей жизни' };
function checkLocales() {
  const base = L10N[G.DEFAULT_LOCALE];
  const keysOf = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' && !Array.isArray(v) ? keysOf(v, p + k + '.') : [p + k]));
  const optional = (k) => k.startsWith('ui.months') || k.startsWith('ui.plural.') || /ui\.(ageZero|ageOne|endTitleOne|yearOffset)$/.test(k) || /canvasFont\.lh$/.test(k);
  const baseKeys = keysOf(base).filter((k) => !optional(k));
  const U = CORE.textUnits;
  Object.entries(L10N).forEach(([lang, T]) => {
    const ks = new Set(keysOf(T));
    baseKeys.forEach((k) => { if (!ks.has(k)) fail(`i18n: [${lang}] ${k} 없음`); });
    [...ks].filter((k) => !optional(k) && !baseKeys.includes(k)).forEach((k) => fail(`i18n: [${lang}] 기준(en)에 없는 키 ${k}`));
    CORE.MOMENTS.forEach((m) => { if (!T.ui.moments[m.id]) fail(`i18n: [${lang}] ui.moments.${m.id} 없음`); });
    CORE.PENS.forEach((p) => { if (!T.form.pens[p]) fail(`i18n: [${lang}] form.pens.${p} 없음`); });
    CORE.STAGES.forEach((st) => { if (!T.form.groups[st]) fail(`i18n: [${lang}] form.groups.${st} 없음`); });
    if (T.ui.lang !== lang) fail(`i18n: [${lang}] ui.lang 이 ${T.ui.lang}`);
    // 복수형 표: 그 언어의 Intl.PluralRules 범주가 모두 있고, 기본 문구와 자리표시자가 같다
    const cats = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
    const holders = (str) => (String(str).match(/\{\w+\}/g) || []).sort().join();
    Object.entries(T.ui.plural || {}).forEach(([key, tab]) => {
      if (typeof T.ui[key] !== 'string') fail(`i18n: [${lang}] ui.plural.${key} 의 기본 문구 ui.${key} 가 없음`);
      cats.forEach((cat) => { if (typeof tab[cat] !== 'string') fail(`i18n: [${lang}] ui.plural.${key}.${cat} 없음 (${cats.join('/')})`); });
      Object.entries(tab).forEach(([cat, str]) => {
        if (!cats.includes(cat)) fail(`i18n: [${lang}] ui.plural.${key}.${cat} 는 이 언어의 복수형 범주가 아님`);
        if (holders(str) !== holders(T.ui[key])) fail(`i18n: [${lang}] ui.plural.${key}.${cat} 자리표시자가 ui.${key} 와 다름 "${str}"`);
      });
    });
    if (lang === 'ru') {
      const want = { 1: '1 год', 2: '2 года', 5: '5 лет', 11: '11 лет', 21: '21 год', 22: '22 года', 25: '25 лет' };
      Object.entries(want).forEach(([n, w]) => { if (CORE.ageText(T.ui, Number(n)) !== w) fail(`i18n: [ru] 나이 ${n} → "${CORE.ageText(T.ui, Number(n))}" (기대 "${w}")`); });
    }
    if (!/\{name\}/.test(T.ui.endTitle) || !/\{n\}/.test(T.ui.endTitle2)) fail(`i18n: [${lang}] 끝 제목 자리표시자 누락`);
    if (/\{monthName\}/.test(T.ui.birthMetaMonth) && (!T.ui.months || T.ui.months.length !== 12)) fail(`i18n: [${lang}] monthName 을 쓰는데 months 12개가 없음`);
    if (/\{name\}/.test(T.form.monthTpl) && (!T.ui.months || T.ui.months.length !== 12)) fail(`i18n: [${lang}] monthTpl 이 {name} 인데 months 없음`);
    if (T.seo || T.faqTitle || T.moreTests) fail(`i18n: [${lang}] 시작 화면용 SEO 글/FAQ 제목/다른 테스트 문구가 남아 있음(규칙 2)`);
    // FAQ 는 끝 화면에서만, 3~5개, 짧게
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) fail(`i18n: [${lang}] FAQ ${T.faq && T.faq.length}개 (3~5)`);
    (T.faq || []).forEach(([q, a]) => {
      if (!q || !a) fail(`i18n: [${lang}] FAQ 항목이 비어 있음`);
      if (U(q) > 34 || U(a) > 170) fail(`i18n: [${lang}] FAQ 가 김 "${q}" (${U(q).toFixed(0)}/${U(a).toFixed(0)})`);
    });
    // 검색: 제목은 현지 검색어로 시작 + " | 브랜드", 길이, 설명 길이
    const brand = G.brandOf(lang);
    const title = T.meta.title;
    if (!title.endsWith(' | ' + brand)) fail(`seo: [${lang}] 제목이 " | ${brand}" 로 끝나지 않음`);
    if (title.toLowerCase().indexOf(SEARCH[lang]) !== 0 && title.toLowerCase().indexOf(SEARCH[lang]) > 4) fail(`seo: [${lang}] 제목이 검색어 "${SEARCH[lang]}" 로 시작하지 않음`);
    if (U(title) > 36) fail(`seo: [${lang}] 제목이 김 (${U(title).toFixed(1)}u) "${title}"`);
    const du = U(T.meta.description);
    if (du < 50 || du > 95) fail(`seo: [${lang}] 설명 길이 ${du.toFixed(0)}u (50~95) "${T.meta.description}"`);
    if (T.meta.description.toLowerCase().indexOf(SEARCH[lang].split(' ')[0]) === -1) fail(`seo: [${lang}] 설명에 검색어 없음`);
    const h1 = (T.hero.brand + ' ' + T.hero.h1).toLowerCase();
    if (h1.indexOf(SEARCH[lang]) === -1) fail(`seo: [${lang}] h1 에 검색어 "${SEARCH[lang]}" 없음`);
  });
  return Object.keys(L10N).length;
}

// ---------------------------------------------------------------
// 7) 360px 화면: 줄바꿈하지 않는 문구의 폭 어림 (본문 글꼴 기준 1em ≈ 글자 크기, 굵은 글꼴 여유 8%)
//   - 뒤로 버튼(13.5px) + 받은 사람 배너가 한 줄: 버튼은 200px 이내
//   - 속도 토글(13px) 110px, 재생 버튼(16.5px) 250px, 끝 카드 버튼(16px) 280px, 히어로 버튼(17px) 290px
//   - 장면 칩(14.5px) 한 개가 한 줄 폭(328px)을 넘지 않게, 연표 칸 이름은 말줄임이라 제외
// ---------------------------------------------------------------
function checkWidths() {
  let n = 0;
  const W = (str, px) => CORE.textUnits(str) * px * 1.08;
  LANGS.forEach((lang) => {
    const T = L10N[lang];
    const budget = [
      [T.film.back, 13.5, 200], [T.film.makeMine, 13.5, 200],
      [T.ui.slow, 13, 110], [T.ui.normal, 13, 110],
      // 재생 버튼은 두 줄까지 줄바꿈(360px 에서 글자 칸 ≈ 110px × 2줄). 한 단어는 한 줄 안에
      [T.form.play, 16.5, 220],
      ...(/^(ja|zh|th)$/.test(lang) ? [] : T.form.play.split(/\s+/).map((wd) => [wd, 16.5, 110])), // 일·중·타이는 글자/단어 사전 단위로 줄바꿈
      [T.end.save, 16, 280], [T.end.recipientCta, 16, 280], [T.ui.recDownload, 16, 280], [T.ui.recShare, 16, 280], [T.ui.recCancel, 16, 280],
      [T.hero.cta, 17, 290],
    ];
    CORE.momentsFor(lang).forEach((m) => budget.push([T.ui.moments[m.id].label, 14.5, 328 - 50]));
    budget.push([[[T.ui.todayLabel, 14.5], [T.form.todayNote, 11.5]], 0, 328 - 50]);
    budget.forEach(([str, px, max]) => {
      n++;
      const w = Array.isArray(str) ? str.reduce((a, [t, p2]) => a + W(t, p2), 0) : W(str, px);
      if (Array.isArray(str)) str = str.map((x) => x[0]).join(' ');
      if (w > max) fail(`width: [${lang}] "${str}" ≈${Math.round(w)}px > ${max}px (360px 화면)`);
    });
  });
  return n;
}

// ---------------------------------------------------------------
// 8) 생성된 HTML (규칙: 타이틀 바, 시작 화면은 티징만, FAQ 는 끝 화면에만, 끝 화면 하나)
// ---------------------------------------------------------------
function checkHtml() {
  let n = 0;
  LANGS.forEach((lang) => {
    const file = path.join(SITE_DIR, G.fileOf(lang, 'index.html'));
    if (!fs.existsSync(file)) { fail(`html: [${lang}] ${G.fileOf(lang, 'index.html')} 없음 — gen-i18n.js 실행`); return; }
    const html = fs.readFileSync(file, 'utf8');
    n++;
    const count = (re) => (html.match(re) || []).length;
    if (!new RegExp(`<html lang="${lang}"`).test(html)) fail(`html: [${lang}] <html lang> 불일치`);
    if (count(/<header class="mg-top">/g) !== 1) fail(`html: [${lang}] 공통 타이틀 바(mg-top)가 1개가 아님`);
    if (count(/<h1[\s>]/g) !== 1) fail(`html: [${lang}] h1 이 ${count(/<h1[\s>]/g)}개`);
    const h1 = (/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html) || [])[1] || '';
    if (h1.replace(/<[^>]+>/g, '').toLowerCase().indexOf(SEARCH[lang]) === -1) fail(`html: [${lang}] h1 에 검색어 없음`);
    if (count(/data-mg-end="life"/g) !== 1) fail(`html: [${lang}] data-mg-end 가 1개가 아님`);
    if (count(/class="mg-ad"/g) !== 0) fail(`html: [${lang}] 시작 화면 광고(mg-ad-start) 말고 따로 둔 mg-ad 가 있음(끝 화면 광고는 공통 컴포넌트가 가짐)`);
    // 시작 화면(screen-home) 맨 아래 광고 하나 (규칙 2026-10-02)
    const home = html.slice(html.indexOf('id="screen-home"'), html.indexOf('id="screen-film"'));
    if (count(/class="mg-ad mg-ad-start"/g) !== 1 || !/<\/form>\s*<div class="mg-ad mg-ad-start"><\/div>\s*<\/div>\s*(<!--[^>]*-->\s*)?<div id="screen-film"/.test(home + 'id="screen-film"')) fail(`html: [${lang}] 시작 화면 맨 끝(폼 다음)에 mg-ad-start 가 정확히 하나가 아님`);
    if (/FAQPage/.test(html)) fail(`html: [${lang}] FAQPage JSON-LD 가 있음`);
    if (/lf-seo|lf-faq|id="more-tests"|data-mg-rating|data-mg-social|id="link-btn"/.test(html)) fail(`html: [${lang}] 없어야 할 섹션/버튼(SEO 글·FAQ·다른 테스트·자체 별점/공유)이 남아 있음`);
    if (!/window\.MG_FAQ = \[\{"q":/.test(html)) fail(`html: [${lang}] MG_FAQ 가 없음`);
    if (!/"@type":"WebApplication"/.test(html) || !/"@type":"BreadcrumbList"/.test(html)) fail(`html: [${lang}] appLd(WebApplication+BreadcrumbList) 없음`);
    if (/aggregateRating/.test(html)) fail(`html: [${lang}] aggregateRating 이 있음`);
    const title = (/<title>([^<]*)<\/title>/.exec(html) || [])[1] || '';
    if (title.indexOf(G.brandOf(lang)) === -1) fail(`html: [${lang}] <title> 에 브랜드 없음`);
  });
  // 예전 /en/ 주소는 루트로 넘기는 리다이렉트(쿼리·해시 유지)
  ['index.html', 'privacy.html'].forEach((rel) => {
    const f = path.join(SITE_DIR, 'en', rel);
    n++;
    if (!fs.existsSync(f)) { fail(`html: en/${rel} 리다이렉트 없음`); return; }
    const h = fs.readFileSync(f, 'utf8');
    if (!/noindex/.test(h) || !/location\.search \+ location\.hash/.test(h)) fail(`html: en/${rel} 리다이렉트가 noindex·쿼리/해시 유지를 안 함`);
  });
  return n;
}

const nShare = checkShare();
const nDet = checkDeterminism();
const nChrono = checkChronology();
const tc = checkTimingAndCaptions();
const nYear = checkYearOffset();
const nLoc = checkLocales();
const nWidth = checkWidths();
const nHtml = checkHtml();

console.log('\n=== 내 인생 애니메이션 검증 ===\n');
console.log(`공유 링크 왕복: ${nShare}개 입력 (${LANGS.length}개 언어·이모지 이름, 나만의 장면 포함)`);
console.log(`결정성: ${nDet}개 입력 × (장면 계획 + 획 계획 해시 + 링크 복원)`);
console.log(`시간순·나이: 출생 1950~2025 × 12 = ${nChrono}개 조합`);
console.log(`장면 길이·획 타이밍: 필름 ${tc.films}개, 자막 길이: ${tc.captions}건`);
console.log(`타이 불기 표시: ${nYear}개 언어 확인`);
console.log(`언어 파일: ${nLoc}개 (${Object.keys(L10N).join(', ')}) — 키 일치, FAQ 3~5개, 제목·설명 길이, 검색어`);
console.log(`360px 폭 어림: 문구 ${nWidth}건`);
console.log(`생성된 HTML: ${nHtml}개 (타이틀 바, h1 1개+검색어, data-mg-end 1개, MG_FAQ, FAQPage·SEO 글·광고 자리 없음, /en/ 리다이렉트)`);
if (todoNotes.length) console.log(`\n(참고) 번역 대기(// TODO-TRANSLATE): ${TODO.join(', ')} — 실패로 세지 않은 ${todoNotes.length}건: ${todoNotes.slice(0, 6).join(' / ')}`);
if (failures.length) {
  console.log(`\n실패 ${failures.length}건${failures.length >= 200 ? ' (앞 200건)' : ''}:`);
  failures.slice(0, 40).forEach((f) => console.log('  - ' + f));
  console.log('\n결과: FAIL');
  process.exit(1);
}
console.log('\n결과: PASS — 링크 왕복, 결정성, 시간순/나이, 길이, 자막, 불기, 언어 파일, 360px, HTML 모두 통과');
