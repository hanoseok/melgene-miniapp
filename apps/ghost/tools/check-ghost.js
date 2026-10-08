#!/usr/bin/env node
/**
 * 나만의 유령 만들기 검사.
 *   1) 로직(ghost-core.js): 부품 수(몸 5·색 6·눈 10·입 10·볼 4·모자 8·소품 6·배경 4), id 중복, 무작위 디자인이 모두 유효하고 모든 값이 나오는지,
 *      #d= 인코딩 ↔ 디코딩 왕복(이름: 한글·일본어·태국어·키릴·이모지·긴 이름), 잘못된 링크는 null, 이름 정리(<>·제어 문자·20자),
 *      그림(render/thumb)이 모든 부품에서 NaN·undefined 없이 닫힌 SVG 인지.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(일반 텍스트, "무료인가요?" 류 금지),
 *      한국어가 아닌 파일에 한글 없음, 글꼴(ru 키릴·vi 베트남어 지원 제목 글꼴), 제목·설명 길이, h1 모양, 360px 폭 예산.
 *   3) 생성된 HTML: title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 맨 끝 mg-ad-start 1개·FAQ·끝 화면·부품 버튼 없음 / 편집기 화면 mg-ad 1개(그 밖 페이지 전체 0개) /
 *      끝 화면: 결과 카드 → data-mg-end="ghost" 순서, MG_FAQ·PAGE_I18N, 스크립트 순서. style.css 의 둥실둥실은 prefers-reduced-motion 에서 멈춤.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG.
 *
 * 실행: node tools/check-ghost.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'ghost-core.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const warns = [];
const bad = (m) => problems.push(m);
const warn = (m) => warns.push(m);

// ---------------------------------------------------------------- 1) 로직
const NAMES = ['', 'Boo', '둥실이 꼬마 유령', 'ふわりんおばけ', 'ผีน้อยน่ารัก', 'Бубу-Привидение', 'Fantôme « Bouh »', '👻🎃🦇 Boo!', 'Gespenst-Günter ß', 'Bé Bồng Bềnh', '小幽灵飘飘', 'a'.repeat(40), '  spaced   out  '];
function svgOk(s) {
  return typeof s === 'string' && s.startsWith('<svg ') && s.endsWith('</svg>') && !/NaN|undefined|null/.test(s) &&
    (s.match(/<g[\s>]/g) || []).length === (s.match(/<\/g>/g) || []).length;
}
function checkCore() {
  const MIN = { b: 5, c: 6, e: 10, m: 10, k: 4, h: 8, i: 6, g: 4 };
  CORE.KEYS.forEach((k) => { if (!(CORE.COUNTS[k] >= MIN[k])) bad(`부품 수 ${k} = ${CORE.COUNTS[k]} (< ${MIN[k]})`); });
  [['SHAPES', CORE.SHAPES.map((x) => x.id)], ['COLORS', CORE.COLORS.map((x) => x.id)], ['EYES', CORE.EYES.map((x) => x.id)], ['MOUTHS', CORE.MOUTHS.map((x) => x.id)],
    ['CHEEKS', CORE.CHEEKS.map((x) => x.id)], ['HATS', CORE.HATS], ['ITEMS', CORE.ITEMS], ['BGS', CORE.BGS]].forEach(([n, ids]) => {
    if (new Set(ids).size !== ids.length) bad(`${n} id 중복`);
  });
  if (CORE.PARTS.length !== CORE.KEYS.length || new Set(CORE.PARTS.map((p) => p.key)).size !== CORE.KEYS.length || CORE.PARTS.some((p) => !CORE.KEYS.includes(p.key))) bad('PARTS 는 KEYS 마다 탭 하나(8개)');
  if (CORE.BG_FILL.length !== CORE.COUNTS.g) bad('BG_FILL 은 배경 수만큼');
  if (!CORE.normalize(CORE.defaults())) bad('defaults() 가 유효하지 않음');

  // 무작위 디자인: 모두 유효 + 모든 값이 한 번 이상
  const seen = {}; CORE.KEYS.forEach((k) => { seen[k] = new Set(); });
  let invalid = 0;
  for (let i = 0; i < 4000; i++) {
    const base = CORE.defaults();
    base.name = NAMES[i % NAMES.length];
    const d = CORE.random(base);
    if (!CORE.normalize(d)) invalid++;
    CORE.KEYS.forEach((k) => seen[k].add(d[k]));
    if (d.name !== base.name) { bad('random() 이 이름을 바꿈'); break; }
  }
  if (invalid) bad(`random() 이 유효하지 않은 디자인 ${invalid}개`);
  CORE.KEYS.forEach((k) => { if (seen[k].size !== CORE.COUNTS[k]) bad(`random() 에서 ${k} 값 ${seen[k].size}/${CORE.COUNTS[k]}종만 나옴`); });

  // 왕복
  let rt = 0;
  for (let i = 0; i < 3000; i++) {
    const d = CORE.random(CORE.defaults());
    d.name = NAMES[i % NAMES.length];
    const enc = CORE.encode(d);
    if (!enc || !/^[A-Za-z0-9_-]+$/.test(enc)) { bad(`encode 실패/형식 이상: ${JSON.stringify(d)}`); continue; }
    if (enc.length > 300) bad(`#d= 링크가 너무 김 (${enc.length}자)`);
    const back = CORE.decode(enc);
    const want = CORE.normalize(d);
    if (!CORE.same(back, want)) { bad(`왕복 불일치: ${JSON.stringify(d)} → ${JSON.stringify(back)}`); continue; }
    rt++;
  }
  // 이름 정리
  const cn = CORE.cleanName;
  if (cn('<b>Hi</b>') !== 'Hi' || cn('a<b') !== 'ab') bad(`cleanName 태그·꺾쇠 제거: "${cn('<b>Hi</b>')}"`);
  if (cn('  a\u0000\u200b b\n c  ') !== 'a b c') bad(`cleanName 제어 문자·공백: "${cn('  a\u0000\u200b b\n c  ')}"`);
  if (Array.from(cn('🎃'.repeat(30))).length !== CORE.MAX_NAME) bad('cleanName 은 코드 포인트 20자로 자른다');
  if (cn(null) !== '' || cn(undefined) !== '') bad('cleanName(null) = ""');
  // 잘못된 링크
  const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o), 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const okP = [0, 0, 0, 0, 1, 0, 0, 0];
  const badInputs = {
    empty: '', garbage: '!!!', spaces: 'ab cd', longStr: 'A'.repeat(700), notJson: b64('hello'), wrongV: b64({ v: 2, p: okP }),
    shortP: b64({ v: 1, p: okP.slice(0, 7) }), longP: b64({ v: 1, p: okP.concat([0]) }), range: b64({ v: 1, p: [0, 0, 99, 0, 1, 0, 0, 0] }), neg: b64({ v: 1, p: [0, -1, 0, 0, 1, 0, 0, 0] }),
    bgRange: b64({ v: 1, p: [0, 0, 0, 0, 1, 0, 0, 4] }), frac: b64({ v: 1, p: [0, 0.5, 0, 0, 1, 0, 0, 0] }), str: b64({ v: 1, p: ['0', 0, 0, 0, 1, 0, 0, 0] }), nameObj: b64({ v: 1, p: okP, n: { x: 1 } }),
    badUtf8: Buffer.from([0x7b, 0xff, 0xfe, 0x7d]).toString('base64').replace(/=+$/, ''), arr: b64([1, 2, 3]), nul: b64('null'),
  };
  Object.entries(badInputs).forEach(([k, v]) => { if (CORE.decode(v) !== null) bad(`decode(${k}) 는 null 이어야 함`); });
  if (CORE.decode(null) !== null || CORE.decode(42) !== null) bad('decode(비문자열) 은 null');
  const withName = CORE.decode(b64({ v: 1, p: okP, n: '<script>x</script>' + 'z'.repeat(40) }));
  if (!withName || /[<>]/.test(withName.name) || Array.from(withName.name).length > CORE.MAX_NAME) bad('decode 가 이름을 정리하지 않음');

  // 그림: 모든 부품 × 배경 4개 × 몸 모양 5개 + 무작위 300개, thumb 모든 얼굴 부품 × 색
  let svgs = 0;
  CORE.KEYS.forEach((k) => {
    for (let i = 0; i < CORE.COUNTS[k]; i++) {
      for (let v = 0; v < CORE.COUNTS.g * CORE.COUNTS.b; v++) {
        const d = CORE.defaults(); d.g = v % CORE.COUNTS.g; d.b = Math.floor(v / CORE.COUNTS.g); d[k] = i;
        const s = CORE.render(d, { prefix: `t${k}${i}` });
        if (!svgOk(s)) bad(`render ${k}=${i} b=${d.b} g=${d.g} SVG 이상`);
        if (!s.includes(`id="t${k}${i}-body"`) || !s.includes(`id="t${k}${i}-bg"`)) bad(`render prefix 가 id 에 안 붙음 (${k}=${i})`);
        if (!/<g class="gh-float">/.test(s) || !/class="gh-shadow"/.test(s)) bad(`render 에 둥실둥실 그룹(.gh-float/.gh-shadow)이 없음 (${k}=${i})`);
        svgs++;
      }
    }
  });
  for (let i = 0; i < 300; i++) { const s = CORE.render(CORE.random(CORE.defaults()), { simple: i % 2 === 0 }); if (!svgOk(s)) bad('render(random) SVG 이상'); svgs++; }
  const glowC = CORE.COLORS.findIndex((c) => c.id === 'glow');
  const glowD = Object.assign(CORE.defaults(), { c: glowC });
  if (/filter=/.test(CORE.render(glowD, { simple: true }))) bad('simple 인데 블러 필터가 있음');
  if (!/filter=/.test(CORE.render(glowD, {}))) bad('야광 유령 그림에 빛 필터가 없음');
  if (/filter=/.test(CORE.render(CORE.defaults(), {}))) bad('흰 유령 기본 그림에 빛 필터가 있음');
  const blank = CORE.render(CORE.defaults(), { blank: true });
  if (/gh-face/.test(blank) || !svgOk(blank)) bad('blank(티저) 그림에 얼굴이 있거나 SVG 이상');
  [['eyes', 'e'], ['mouth', 'm'], ['cheeks', 'k']].forEach(([kind, k]) => {
    for (let i = 0; i < CORE.COUNTS[k]; i++) for (let c = 0; c < CORE.COUNTS.c; c++) { if (!svgOk(CORE.thumb(kind, i, { color: c }))) bad(`thumb ${kind} ${i} SVG 이상`); svgs++; }
  });
  console.log(`\n=== 로직: 무작위 4,000개 유효 · #d= 왕복 ${rt.toLocaleString()}개 · 잘못된 링크 ${Object.keys(badInputs).length}종 거부 · SVG ${svgs.toLocaleString()}개 ===`);
  console.log(`부품: 몸 ${CORE.COUNTS.b} · 색 ${CORE.COUNTS.c} · 눈 ${CORE.COUNTS.e} · 입 ${CORE.COUNTS.m} · 볼 ${CORE.COUNTS.k} · 모자 ${CORE.COUNTS.h} · 소품 ${CORE.COUNTS.i} · 배경 ${CORE.COUNTS.g}`);
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(o, p = '') {
  if (Array.isArray(o)) return [`${p}[${o.length}]`, ...o.flatMap((v, i) => (v && typeof v === 'object' ? shape(v, `${p}[${i}]`) : []))];
  if (o && typeof o === 'object') return Object.keys(o).sort().flatMap((k) => [`${p}.${k}`, ...(o[k] && typeof o[k] === 'object' ? shape(o[k], `${p}.${k}`) : [])]);
  return [];
}
const THAI_MARK = (c) => c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e);
const WIDE = (c) => (c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef) || (c >= 0x3000 && c <= 0x303f);
function emWidth(str) {
  let w = 0;
  for (const ch of String(str).replace(/<[^>]+>/g, '')) {
    const c = ch.codePointAt(0);
    if (/\p{Extended_Pictographic}/u.test(ch)) w += 1.2;
    else if (c === 0xfe0f || c === 0x200d) w += 0;
    else if (THAI_MARK(c)) w += 0;
    else if (c >= 0x0e00 && c <= 0x0e7f) w += 0.62;
    else if (WIDE(c)) w += 1;
    else if (ch === ' ' || ch === '\u00a0' || ch === '\u202f') w += 0.28;
    else if (/[A-ZÀ-ÞĀ-ŽА-ЯЁ]/.test(ch)) w += 0.68;
    else if (/[а-яё]/.test(ch)) w += 0.6;
    else if (/[0-9]/.test(ch)) w += 0.58;
    else if (/[.,:;!?'’"“”«»„()\-–—…·|/]/.test(ch)) w += 0.32;
    else w += 0.56;
  }
  return w;
}
// 보이는 글자 수 (태국어 결합 부호 제외)
const visLen = (s) => Array.from(String(s)).filter((ch) => !THAI_MARK(ch.codePointAt(0))).length;
const isWideLang = (lang) => ['ja', 'zh', 'ko', 'th'].includes(lang);
const longestWord = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/[\s\u00a0]+|-/).reduce((a, w) => (emWidth(w) > emWidth(a) ? w : a), '');

// 360px 화면 = 328px 안쪽 폭 (style.css 글자 크기 기준, 굵은 글꼴 여유 8%). hard = 실패, 아니면 (참고)
const BUDGET = [
  { key: 'start.start', get: (T) => T.start.start, px: 328 - 36, size: 19 * 1.08, hard: true, what: '시작 버튼 한 줄' },
  { key: 'start.badge', get: (T) => T.start.badge, px: 328 - 28, size: 14 * 1.08, hard: true, what: '배지 한 줄' },
  { key: 'start.h1Kicker', get: (T) => T.start.h1Kicker, px: 328, size: 15 * 1.12, hard: true, what: 'h1 검색어 줄' },
  { key: 'editor.random', get: (T) => T.editor.random, px: (328 - 10) / 2 - 24 - 26, size: 17 * 1.08, hard: true, what: '랜덤 버튼 한 줄' },
  { key: 'editor.done', get: (T) => T.editor.done, px: (328 - 10) / 2 - 24, size: 17 * 1.08, hard: true, what: '완성 버튼 한 줄' },
  { key: 'result.save', get: (T) => T.result.save, px: 304 - 24 - 28, size: 16 * 1.08, hard: true, what: '이미지 저장 버튼 한 줄' },
  { key: 'result.edit', get: (T) => T.result.edit, px: 304 - 24 - 28, size: 16 * 1.08, hard: true, what: '고치기 버튼 한 줄' },
  { key: 'result.retry', get: (T) => T.result.retry, px: 328 - 24, size: 16 * 1.08, hard: true, what: '다시 하기 버튼 한 줄' },
  { key: 'result.retryFriend', get: (T) => T.result.retryFriend, px: 328 - 24, size: 16 * 1.08, hard: true, what: '나도 만들기 버튼 한 줄' },
  { key: 'editor.title', get: (T) => T.editor.title, px: 328, size: 22 * 1.08, hard: false, what: '편집기 제목 한 줄' },
  { key: 'result.untitled', get: (T) => T.result.untitled, px: 296 * 2, size: 30 * 1.08, hard: false, what: '이름 없는 유령 제목 두 줄' },
];
// Google Fonts 메타데이터(subsets)로 확인한 제목 글꼴
const CYRILLIC_DISPLAY = ['Nunito', 'Rubik', 'Comfortaa', 'Balsamiq Sans', 'M PLUS Rounded 1c', 'Pangolin', 'Unbounded', 'Russo One', 'Montserrat Alternates', 'Neucha'];
const VIET_DISPLAY = ['Nunito', 'Baloo 2', 'Be Vietnam Pro', 'Plus Jakarta Sans', 'Comfortaa', 'Pangolin', 'Unbounded', 'Montserrat Alternates'];
const FREE_Q = /\bfree\b|무료|無料|免费|免費|gratuit|kostenlos|ฟรี|miễn phí|gratis|grátis|бесплатн/i;
const RANK_Q = /인기|하트|별점|popular|ranking|rating|heart|ランキング|人気|排名|人气|classement|beliebt|อันดับ|xếp hạng|clasificación|classifica|ranking|рейтинг/i;

function checkLocales() {
  const base = new Set(shape(L10N.en));
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8');
    if (/TODO-TRANSLATE/.test(src)) bad(`${tag} // TODO-TRANSLATE 가 남아 있음 (진짜 번역 필요)`);
    if (lang !== 'en') {
      const s = new Set(shape(T));
      const missing = [...base].filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !base.has(k));
      if (missing.length) bad(`${tag} en.js 에 있는 키 없음: ${missing.slice(0, 6).join(' ')}${missing.length > 6 ? ' …' : ''}`);
      if (extra.length) bad(`${tag} en.js 에 없는 키: ${extra.slice(0, 6).join(' ')}${extra.length > 6 ? ' …' : ''}`);
      // 번역 안 한 문구(영어 그대로) 찾기 — 짧은 고유 문구·URL 은 제외
      const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [[`${p}${k}`, v]]));
      const en = Object.fromEntries(flat(L10N.en));
      flat(T).forEach(([k, v]) => {
        if (typeof v !== 'string' || k.startsWith('fonts.') || k === 'result.fileName' || k === 'editor.optionAria') return;
        if (v.length > 12 && v === en[k]) bad(`${tag} ${k} 가 영어 그대로`);
      });
    }
    // 빈 값
    const empties = [];
    (function walk(o, p) { Object.entries(o).forEach(([k, v]) => { if (v && typeof v === 'object') walk(v, `${p}${k}.`); else if (typeof v === 'string' && !v.trim() && !/^fonts\.sans$/.test(`${p}${k}`)) empties.push(`${p}${k}`); }); })(T, '');
    if (empties.length) bad(`${tag} 빈 문구: ${empties.join(', ')}`);
    // 부품 탭 = CORE.PARTS
    CORE.PARTS.forEach((p) => { if (!T.editor.tabs[p.id]) bad(`${tag} editor.tabs.${p.id} 없음`); });
    Object.keys(T.editor.tabs).forEach((id) => { if (!CORE.PARTS.some((p) => p.id === id)) bad(`${tag} 모르는 탭 ${id}`); });
    // 자리표시자
    if (!T.result.shareText.includes('{name}')) bad(`${tag} result.shareText 에 {name} 없음`);
    if (/\{name\}/.test(T.result.shareTextNoName)) bad(`${tag} result.shareTextNoName 에 {name} 이 있으면 안 됨`);
    if (!T.result.imageAlt.includes('{name}')) bad(`${tag} result.imageAlt 에 {name} 없음`);
    if (!T.editor.optionAria.includes('{part}') || !T.editor.optionAria.includes('{n}')) bad(`${tag} editor.optionAria 에 {part}·{n} 없음`);
    if (!/^[a-z0-9-]+$/i.test(T.result.fileName) && lang !== 'ko') warn(`${tag} result.fileName "${T.result.fileName}" (영문·숫자·- 권장)`);
    if (/[\\/:*?"<>|]/.test(T.result.fileName)) bad(`${tag} result.fileName 에 파일 이름으로 못 쓰는 글자`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} faq 는 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f || !f.q || !f.a || /<[a-z]/i.test(f.q + f.a)) bad(`${tag} faq[${i}] 는 {q, a} 일반 텍스트`);
      else if (FREE_Q.test(f.q)) bad(`${tag} faq[${i}] "무료인가요?" 류 질문 금지: ${f.q}`);
      else if (RANK_Q.test(f.q)) bad(`${tag} faq[${i}] 인기순·하트·별점 류 질문 금지: ${f.q}`);
    });
    // 글꼴
    const F = T.fonts || {};
    if (!F.css || !F.display || !/^https:\/\/fonts\.googleapis\.com\/css2\?/.test(F.css)) bad(`${tag} fonts.css / fonts.display 이상`);
    const first = String(F.display || '').split(',')[0].replace(/['"]/g, '').trim();
    if (lang === 'ru' && !CYRILLIC_DISPLAY.includes(first)) bad(`${tag} 제목 글꼴 "${first}" 는 키릴 문자를 지원하지 않음`);
    if (lang === 'vi' && !VIET_DISPLAY.includes(first)) bad(`${tag} 제목 글꼴 "${first}" 는 베트남어 성조를 지원하지 않음`);
    if (!isWideLang(lang) && first !== 'Nunito') warn(`${tag} 제목 글꼴 ${first} (라틴 확장·베트남어·키릴 모두 되는 Nunito 권장)`);
    if (F.css && !F.css.includes(first.replace(/ /g, '+'))) bad(`${tag} fonts.css 에 제목 글꼴 ${first} 가 없음`);
    // h1
    const h1 = T.start.h1Html;
    if ((h1.match(/<br\s*\/?>/gi) || []).length !== 1 || !/<em>[^<]+<\/em>/.test(h1) || /<(?!br|\/?em)/i.test(h1)) bad(`${tag} start.h1Html 은 <br> 1개 + <em> 강조만`);
    if (!T.meta.title.toLowerCase().includes(T.start.h1Kicker.toLowerCase())) warn(`${tag} meta.title 이 h1Kicker "${T.start.h1Kicker}" 를 그대로 담지 않음`);
    // 제목·설명 길이 (seo.md: 라틴 60자 안팎·CJK/태국 32자 안팎, 설명 110~155자·CJK 60~90자)
    const full = `${T.meta.title} | ${G.brandOf(lang)}`;
    const wide = isWideLang(lang) && lang !== 'ko';
    const tl = visLen(T.meta.title);
    if (wide ? tl > 32 : tl > 52) bad(`${tag} meta.title ${tl}자 (${wide ? 'CJK/태국 32' : '라틴·키릴·한글 52'}자 이하, 브랜드 포함 "${full}")`);
    if (tl < 8) bad(`${tag} meta.title 이 너무 짧음`);
    const dl = visLen(T.meta.description);
    const [dmin, dmax] = lang === 'th' ? [60, 160] : wide ? [45, 110] : lang === 'ko' ? [60, 110] : [100, 170];
    if (dl < dmin || dl > dmax) bad(`${tag} meta.description ${dl}자 (${dmin}~${dmax}자)`);
    if (lang !== 'ko') {
      const m = JSON.stringify(T).match(/[가-힯ᄀ-ᇿ]+/);
      if (m) bad(`${tag} 한글이 남아 있음: "${m[0]}"`);
    }
    // 시작 전 문구(메타·시작 화면·OG)에 부품 목록을 늘어놓지 않는다 (티징만): 탭 이름이 4개 이상 나오면 참고
    const pre = [T.start.badge, T.start.hook, T.start.h1Html, T.start.start].join(' ');
    const listed = Object.values(T.editor.tabs).filter((t) => t.length > 1 && pre.includes(t)).length;
    if (listed >= 4) warn(`${tag} 시작 화면 문구에 부품 이름이 ${listed}개 — 티징만`);
    // 폭 예산
    BUDGET.forEach((b) => {
      const v = b.get(T) || '';
      const need = emWidth(v) * b.size;
      if (need > b.px) (b.hard ? bad : warn)(`${tag} ${b.key} "${v}" ≈ ${Math.round(need)}px > ${Math.round(b.px)}px (${b.what})`);
    });
    // h1 큰 줄: 단어 하나가 360px(34px 글자)·375px(40px 글자, 343px 폭) 안에
    h1.split(/<br\s*\/?>/i).forEach((line) => {
      const txt = line.replace(/<[^>]+>/g, '');
      const unit = isWideLang(lang) ? txt : longestWord(txt);
      const w34 = emWidth(unit) * 34 * 1.05;
      const w40 = emWidth(unit) * 40 * 1.05;
      if (w34 > 328 || w40 > 343) (isWideLang(lang) ? warn : bad)(`${tag} h1 "${unit}" ≈ ${Math.round(w40)}px @40px (한 줄 343px)`);
    });
    // 탭: 가로 스크롤이지만 한 탭이 너무 길면 참고
    Object.entries(T.editor.tabs).forEach(([id, v]) => { if (emWidth(v) * 15 * 1.08 + 32 > 150) warn(`${tag} 탭 ${id} "${v}" 가 김`); });
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
  return m ? m[0] : '';
}
function commonHtml(tag, html, lang) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/ghost\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/ghost\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  // 스크립트 순서: site.config → i18n → common → supa
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|service_role/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
}
function checkHtml() {
  let pages = 0;
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const f = G.fileOf(lang, 'index.html');
    const html = read(f);
    const tag = `[${lang}] ${f}`;
    commonHtml(tag, html, lang);
    pages++;
    if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
    if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"MultimediaApplication"/.test(html)) bad(`${tag} appLd(WebApplication, create) 없음`);
    const start = section(html, 'screen-start');
    const edit = section(html, 'screen-edit');
    const end = section(html, 'screen-end');
    if (!start || !edit || !end) { bad(`${tag} 시작/편집기/끝 화면 중 없는 것이 있음`); return; }
    if (!/<section id="screen-edit"[^>]*hidden/.test(html) || !/<section id="screen-end"[^>]*hidden/.test(html)) bad(`${tag} 편집기·끝 화면은 처음에 hidden`);
    if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
    if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
    if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
    if (/data-mg-end|mg-faq|more-test|gh-opt|gh-tab|<details|gh-face/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/부품 목록/완성 얼굴`);
    if (!/<h1 class="gh-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
    if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
    const startText = start.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (T.faq.some((q) => startText.includes(G.esc(q.q)))) bad(`${tag} 시작 화면에 FAQ 문구`);
    if ((edit.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 편집기 화면 mg-ad 는 1개`);
    if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 편집기의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
    if (edit.indexOf('class="mg-ad"') < edit.indexOf('id="done-btn"')) bad(`${tag} 편집기 광고는 편집기 아래`);
    if ((edit.match(/class="gh-tab[ "]/g) || []).length !== CORE.PARTS.length) bad(`${tag} 편집기 탭 ${CORE.PARTS.length}개가 아님`);
    ['preview', 'options', 'name-input', 'random-btn', 'done-btn'].forEach((id) => { if (!edit.includes(`id="${id}"`)) bad(`${tag} 편집기에 #${id} 없음`); });
    if (!new RegExp(`maxlength="${CORE.MAX_NAME * 3}"`).test(edit)) bad(`${tag} 이름 입력 maxlength ${CORE.MAX_NAME * 3}`);
    const cardAt = end.indexOf('class="gh-card"');
    const endAt = end.indexOf('<div data-mg-end="ghost"></div>');
    if (!(cardAt > 0 && endAt > cardAt)) bad(`${tag} 끝 화면: 결과 카드 → data-mg-end="ghost" 순서가 아님`);
    if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
    ['save-btn', 'edit-btn', 'end-art', 'end-name'].forEach((id) => { if (!end.includes(`id="${id}"`)) bad(`${tag} 끝 화면에 #${id} 없음`); });
    if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
    if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
    if (!(html.indexOf('ghost-core.js') > 0 && html.indexOf('ghost-core.js') < html.indexOf('ghost.js"'))) bad(`${tag} ghost-core.js 가 ghost.js 보다 먼저여야 함`);
    // 개인정보
    const pf = G.fileOf(lang, 'privacy.html');
    commonHtml(`[${lang}] ${pf}`, read(pf), lang);
    pages++;
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://ghost.example.com/</loc>') || !sm.includes('<loc>https://ghost.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  // 둥실둥실은 큰 그림에만, 움직임 줄이기 설정이면 멈춤
  const css = read('style.css');
  if (!/@keyframes gh-float/.test(css) || !/prefers-reduced-motion: reduce\)[\s\S]*\.gh-float[^}]*animation: none/.test(css)) bad('style.css: gh-float 애니메이션 / prefers-reduced-motion 멈춤 규칙 없음');
  return pages;
}

// ---------------------------------------------------------------- 4) OG 이미지
function checkOg() {
  let n = 0;
  G.LOCALES.forEach(({ dir }) => {
    const f = path.join(SITE, 'og', dir, 'default.png');
    if (!fs.existsSync(f)) return bad(`OG 없음: og/${dir ? dir + '/' : ''}default.png (node tools/gen-og.js all)`);
    const b = fs.readFileSync(f);
    if (b.toString('ascii', 1, 4) !== 'PNG' || b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) bad(`OG 크기/형식: ${path.relative(SITE, f)}`);
    n++;
  });
  return n;
}

checkCore();
checkLocales();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개 · OG 이미지 ${ogs}장 검사`);
warns.forEach((w) => console.log('  (참고) ' + w));
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 부품·무작위·#d= 왕복·SVG, 언어 파일 12개(키·번역·FAQ·글꼴·제목 길이·폭 예산), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), 움직임 줄이기, OG 이미지 모두 OK');
