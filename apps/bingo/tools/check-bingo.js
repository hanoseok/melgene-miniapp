#!/usr/bin/env node
/**
 * 새해 목표 빙고 검사 (Node, 브라우저 없음 — 실제 화면 흐름은 tools/flow-test.js).
 *   1) 로직(bingo-core.js): 빙고 줄(3·4·5 × 무작위 3000번 = 직접 센 값), 자유칸, 토글, 크기 바꾸기(글 유지), 자유칸 켜기,
 *      아이디어 채우기(빈칸만·겹침 없음), 섞기(글 모음 같음·자유칸 고정), 공유 되돌림·잘못된 링크 거부·정리(제어 문자·길이·크기·비트), 줄바꿈.
 *   2) 언어 파일 12개: en.js 와 키 구조 동일(lines 복수형은 언어별), TODO-TRANSLATE 없음, 자리표시자, 아이디어 30~50개(짧게·겹침 없음),
 *      FAQ 3~5개(금지 질문 없음), 제목·설명 길이, 360px 폭 문구, h1 검색어 = app.config title, 한국어 파일 밖에 한글 없음,
 *      fr 좁은 공백, ru 복수형 one/few/many + 키릴 글꼴, vi·th 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang 12 + x-default / canonical / og:image / 타이틀 바 / appLd(create) /
 *      FAQPage 없음 / 시작 화면 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 / 편집·완성 화면은 처음 hidden /
 *      data-mg-end="bingo" 는 완성 화면 안 1개 / FAQ 는 MG_FAQ 로만 / 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 12장, app.config.js, favicon, shared 링크,
 *      bingo.js 규칙(track 1곳씩·서버 전송 없음·저장은 mg_bingo_v1 만 try/catch·innerHTML 없음·공유 깨끗한 주소·코드에 화면 문구 없음).
 *
 * 실행: node tools/check-bingo.js   (cwd 무관)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bingo-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));

const L10N = G.loadSiteLocales(SITE);
const problems = [];
let passes = 0;
const bad = (m) => problems.push(m);
const ok = (cond, m) => { if (cond) passes++; else bad(m); };
const THAI_MARKS = /[ัิ-ฺ็-๎]/g;
const len = (s) => Array.from(String(s).replace(THAI_MARKS, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(THAI_MARKS, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), `${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
const get = (o, pth) => pth.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

// ---------------------------------------------------------------- 1) 로직
let seed = 7;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const ri = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
function bruteLines(b) {
  const s = b.s, m = (r, c) => CORE.isMarked(b, r * s + c);
  let n = 0;
  for (let r = 0; r < s; r++) { let a = true, c2 = true; for (let c = 0; c < s; c++) { a = a && m(r, c); c2 = c2 && m(c, r); } n += a + c2; }
  let d1 = true, d2 = true;
  for (let i = 0; i < s; i++) { d1 = d1 && m(i, i); d2 = d2 && m(i, s - 1 - i); }
  return n + d1 + d2;
}
function checkLogic() {
  eq(CORE.SIZES, [3, 4, 5], '판 크기');
  ok(CORE.THEMES.length >= 4 && CORE.THEMES.length <= 6, '색 테마 4~6개');
  [3, 4, 5].forEach((s) => ok(CORE.lines(s).length === 2 * s + 2 && CORE.lines(s).every((l) => l.length === s), `${s}×${s} 줄 ${2 * s + 2}개`));
  eq(CORE.freeIndex(5, true), 12, '5×5 자유칸'); eq(CORE.freeIndex(3, true), 4, '3×3 자유칸'); eq(CORE.freeIndex(4, true), -1, '4×4 자유칸 없음'); eq(CORE.freeIndex(5, false), -1, '자유칸 끔');
  // 무작위 3000번: 빙고 줄 = 직접 센 값, 찍은 수, 전부 찍으면 full
  for (let k = 0; k < 3000; k++) {
    const s = [3, 4, 5][ri(0, 2)];
    const b = CORE.defaultBoard(s, 't');
    b.f = s % 2 === 1 && rnd() < 0.5;
    const p = rnd();
    for (let i = 0; i < s * s; i++) if (rnd() < p) CORE.toggle(b, i);
    const sc = CORE.score(b);
    if (sc.count !== bruteLines(b)) { bad(`빙고 줄 ${s}×${s} m=${b.m} ${sc.count} ≠ ${bruteLines(b)}`); break; }
    const fi = CORE.freeIndex(s, b.f);
    if (fi >= 0 && (b.m & (1 << fi))) { bad('자유칸에 도장 비트'); break; }
    if (sc.goals !== s * s - (fi >= 0 ? 1 : 0)) { bad(`목표 수 ${sc.goals}`); break; }
  }
  passes++;
  const full = CORE.defaultBoard(5, 'x'); for (let i = 0; i < 25; i++) CORE.toggle(full, i);
  const fs5 = CORE.score(full); ok(fs5.count === 12 && fs5.full && fs5.marked === 24, `5×5 전부 찍으면 12줄·full (${JSON.stringify(fs5)})`);
  const t = CORE.defaultBoard(3, ''); t.f = false; CORE.toggle(t, 0); CORE.toggle(t, 4); CORE.toggle(t, 8); eq(CORE.score(t).count, 1, '3×3 대각선 1줄');
  CORE.toggle(t, 4); eq(CORE.score(t).count, 0, '토글 취소');
  const fr = CORE.defaultBoard(5, ''); CORE.toggle(fr, 12); eq(fr.m, 0, '자유칸은 토글 안 됨');
  // 크기 바꾸기
  const r = CORE.defaultBoard(5, 'T'); ['a', 'b', 'c'].forEach((x, i) => { r.c[i] = x; }); r.c[20] = 'z'; r.h = 3;
  const r4 = CORE.resize(r, 4);
  ok(r4.s === 4 && r4.c.length === 16 && r4.c.slice(0, 4).join() === 'a,b,c,z' && !r4.f && r4.h === 3 && r4.t === 'T' && r4.m === 0, `크기 5→4 ${JSON.stringify(r4)}`);
  const r3 = CORE.resize(r4, 3);
  ok(r3.s === 3 && r3.f && r3.c[4] === '' && r3.c.filter(Boolean).join() === 'a,b,c,z', `크기 4→3 자유칸 ${JSON.stringify(r3.c)}`);
  // 자유칸 켜기: 가운데 글을 빈칸으로 옮김
  const sf = CORE.defaultBoard(3, ''); CORE.setFree(sf, false); sf.c = ['a', 'b', 'c', 'd', 'mid', '', 'g', 'h', 'i']; CORE.setFree(sf, true);
  ok(sf.c[4] === '' && sf.c[5] === 'mid' && sf.f, `자유칸 켜기 ${JSON.stringify(sf.c)}`);
  // 아이디어 채우기
  const ideas = Array.from({ length: 40 }, (_, i) => 'idea ' + i);
  for (let k = 0; k < 300; k++) {
    const s = [3, 4, 5][ri(0, 2)];
    const b = CORE.defaultBoard(s, ''); b.f = s % 2 === 1 && rnd() < 0.5;
    const own = [];
    for (let i = 0; i < s * s; i++) if (i !== CORE.freeIndex(s, b.f) && rnd() < 0.3) { b.c[i] = rnd() < 0.3 ? 'IDEA 1' : 'mine ' + i; own.push([i, b.c[i]]); }
    CORE.fillIdeas(b, ideas, rnd);
    const f = CORE.filledCount(b);
    const ownSet = new Set(own.map(([, v]) => v.toLowerCase())); const vals = b.c.filter((x, i) => x && !own.some(([j]) => j === i)).map((x) => x.toLowerCase());
    if (f.n !== f.total || new Set(vals).size !== vals.length || vals.some((v) => ownSet.has(v)) || own.some(([i, v]) => b.c[i] !== v)) { bad(`아이디어 채우기 ${JSON.stringify(b.c)}`); break; }
    if (b.f && b.c[CORE.freeIndex(s, true)] !== '') { bad('아이디어가 자유칸에 들어감'); break; }
  }
  passes++;
  const few = CORE.defaultBoard(5, ''); eq(CORE.fillIdeas(few, ['a', 'b'], rnd), 2, '아이디어가 모자라면 있는 만큼');
  // 섞기
  for (let k = 0; k < 300; k++) {
    const b = CORE.defaultBoard(5, ''); CORE.fillIdeas(b, ideas, rnd); CORE.toggle(b, 3);
    const before = b.c.slice().sort().join('|');
    CORE.shuffle(b, rnd);
    if (b.c.slice().sort().join('|') !== before || b.c[12] !== '' || b.m !== 0) { bad('섞기'); break; }
  }
  passes++;
  // 공유
  for (let k = 0; k < 500; k++) {
    const s = [3, 4, 5][ri(0, 2)];
    const b = CORE.defaultBoard(s, '나의 2027 빙고 🎯'); b.f = s % 2 === 1 && rnd() < 0.5; b.h = ri(0, CORE.THEMES.length - 1);
    CORE.fillIdeas(b, ['읽기', 'Run 5K', 'Лови момент', 'อ่านหนังสือ', '早起き', 'Ü ß é', '<b>x</b>', 'a & b', '"q"'].concat(ideas), rnd);
    for (let i = 0; i < s * s; i++) if (rnd() < 0.4) CORE.toggle(b, i);
    const d = CORE.encodeShare(b);
    const back = CORE.decodeShare(d);
    if (!d || !/^[A-Za-z0-9_-]+$/.test(d) || JSON.stringify(back) !== JSON.stringify(CORE.toWire(b))) { bad(`공유 되돌림 ${d}`); break; }
  }
  passes++;
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  ['', 'x', '!!!', 'a'.repeat(9000), enc([1]), enc({ s: 6, c: [] }), enc({ s: 3, c: ['a'] }), enc({ s: 3, c: 'abc' }), 'eyJzIjozf'].forEach((x, i) => ok(CORE.decodeShare(x) === null, `잘못된 링크 ${i} 거부`));
  const dirty = CORE.decodeShare(enc({ s: 3, t: 'T\u0000itle' + 'x'.repeat(80), f: true, h: 99, c: ['a‮b', 5, null, 'd', 'center', 'f', 'g', 'h', 'i'.repeat(90)], m: 0xffffffff, extra: 1 }));
  ok(dirty && dirty.t.length <= CORE.LIMIT.title && !/\u0000/.test(dirty.t) && dirty.h === 0 && dirty.c[1] === '' && dirty.c[4] === '' && !/‮/.test(dirty.c[0]) && Array.from(dirty.c[8]).length === CORE.LIMIT.cell && dirty.m === (511 & ~16), `정리 ${JSON.stringify(dirty)}`);
  ok(CORE.decodeShare(enc({ s: 4, t: 'x', f: true, h: 1, c: Array(16).fill('a'), m: -1 })).m === 0 && CORE.decodeShare(enc({ s: 4, t: 'x', f: true, h: 1, c: Array(16).fill('a'), m: 3 })).f === false, '4×4 자유칸 없음·음수 비트 거부');
  // 큰 판도 길이 제한 안
  const big = CORE.defaultBoard(5, '가'.repeat(40)); big.c = big.c.map((x, i) => (i === 12 ? '' : '漢'.repeat(40)));
  ok(CORE.encodeShare(big) && CORE.encodeShare(big).length <= CORE.LIMIT.link, '가장 긴 판도 링크 길이 제한 안');
  // 줄바꿈
  const mono = (s) => Array.from(s).length * 10;
  const w1 = CORE.wrap(mono, 'Read twelve books this year', 100, 'en');
  ok(w1.every((l) => mono(l) <= 100) && w1.join(' ') === 'Read twelve books this year', `줄바꿈 en ${JSON.stringify(w1)}`);
  const w2 = CORE.wrap(mono, 'อ่านหนังสือสิบสองเล่มในปีนี้', 60, 'th');
  ok(w2.length > 1 && w2.every((l) => mono(l) <= 60) && w2.join('') === 'อ่านหนังสือสิบสองเล่มในปีนี้', `줄바꿈 th ${JSON.stringify(w2)}`);
  const w3 = CORE.wrap(mono, 'Supercalifragilisticexpialidocious', 80, 'en');
  ok(w3.length > 1 && w3.every((l) => mono(l) <= 80), '긴 단어는 글자 단위로');
  eq(CORE.cleanText('  a \n\t b  ', 40), 'a b', 'cleanText 공백');
  eq(CORE.defaultYear(new Date(2026, 9, 30)), 2027, '10월 이후는 다음 해'); eq(CORE.defaultYear(new Date(2027, 2, 1)), 2027, '3월은 올해');
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(v, pth = '') {
  if (pth === 'ui.lines') return 'plural';
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shape(v[k], pth ? `${pth}.${k}` : k), o), {});
  return typeof v;
}
function keysDiff(a, b, pth, out) {
  if (typeof a !== typeof b || (typeof a === 'string' && a !== b)) { out.push(`${pth || '(루트)'} 모양 다름`); return; }
  if (typeof a !== 'object') return;
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    if (!(k in b)) out.push(`${pth}${k} 없음`);
    else if (!(k in a)) out.push(`${pth}${k} 이 더 있음`);
    else keysDiff(a[k], b[k], `${pth}${k}.`, out);
  });
}
const tokens = (s) => [...new Set(String(s).match(/\{\w+\}/g) || [])].sort().join(',');
function walk(obj, fn, pth = '') {
  if (typeof obj === 'string') return fn(obj, pth);
  if (Array.isArray(obj)) return obj.forEach((v, i) => walk(v, fn, `${pth}[${i}]`));
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, pth ? `${pth}.${k}` : k));
}
const MUST = { 'ui.defaultTitle': ['year'], 'ui.cellLabel': ['n'], 'ui.filled': ['n', 'total'], 'ui.goalsDone': ['n', 'total'], 'ui.imageAlt': ['title'] };
const PLURALS = { ru: ['one', 'few', 'many', 'other'], fr: ['one', 'other'], de: ['one', 'other'], es: ['one', 'other'], it: ['one', 'other'], pt: ['one', 'other'], en: ['one', 'other'] };
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  ok(langFiles.length === G.LOCALES.length, `언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    ok(!/TODO-TRANSLATE/.test(first), `${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shape(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    if (!diff.length) passes++;
    const enTok = {};
    walk(EN, (s, pth) => { enTok[pth] = tokens(s); });
    walk(T, (s, pth) => {
      if (/^(privacy|faq|ideas|ui\.lines)/.test(pth) || enTok[pth] == null) return;
      const allowed = enTok[pth].split(',').filter(Boolean);
      tokens(s).split(',').filter(Boolean).forEach((t) => ok(allowed.includes(t), `${tag} ${pth} 에 모르는 자리표시자 ${t}`));
    });
    Object.entries(MUST).forEach(([pth, need]) => { const v = get(T, pth); need.forEach((k) => ok(typeof v === 'string' && v.includes(`{${k}}`), `${tag} ${pth} 에 {${k}} 없음: ${v}`)); });
    // 복수형
    const L = T.ui.lines;
    ok(L && typeof L.other === 'string', `${tag} ui.lines.other`);
    Object.entries(L || {}).forEach(([k, v]) => ok(['zero', 'one', 'two', 'few', 'many', 'other'].includes(k) && tokens(v) === '{n}', `${tag} ui.lines.${k}`));
    (PLURALS[lang] || ['other']).forEach((k) => ok(L && L[k], `${tag} ui.lines.${k} 없음`));
    [0, 1, 2, 3, 5, 11, 12, 21, 22].forEach((n) => { const k = new Intl.PluralRules(lang).select(n); ok(L[k] || L.other, `${tag} ${n} 의 복수형 ${k}`); });
    // 테마 이름
    ok(CORE.THEMES.every((t) => T.themes[t.id] && width(T.themes[t.id]) <= 11), `${tag} themes 이름 없음/김`);
    // 아이디어
    ok(Array.isArray(T.ideas) && T.ideas.length >= 30 && T.ideas.length <= 50, `${tag} ideas ${T.ideas && T.ideas.length}개 (30~50)`);
    ok(new Set(T.ideas.map((x) => x.toLowerCase())).size === T.ideas.length, `${tag} ideas 겹침`);
    T.ideas.forEach((x, i) => ok(x && x === CORE.cleanText(x, CORE.LIMIT.cell) && width(x) <= 30, `${tag} ideas[${i}] 김/공백 (${width(x)}): ${x}`));
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.startBtn', 'ui.done', 'ui.again', 'ui.needAll', 'ui.tapHint', 'errors.badLink'].forEach((pth) => ok(get(T, pth) !== get(EN, pth), `${tag} ${pth} 가 en 과 같음(번역 안 됨)`));
      ok(T.faq[0].q !== EN.faq[0].q && T.ideas[0] !== EN.ideas[0], `${tag} faq·ideas 가 en 과 같음`);
    }
    // 360px 폭 문구
    [['ui.startBtn', 30], ['ui.continueBtn', 30], ['ui.done', 30], ['ui.again', 30], ['ui.download', 24], ['ui.link', 26], ['ui.edit', 24], ['ui.next', 10],
      ['ui.ideas', 26], ['ui.shuffle', 18], ['ui.clear', 18], ['ui.freeLabel', 28], ['ui.free', 10], ['ui.sizeLabel', 24], ['ui.titleLabel', 24], ['ui.themeLabel', 24],
      ['ui.cellLabel', 14], ['ui.cellPh', 22], ['hero.h1Kicker', 30], ['ui.editH', 28], ['ui.doneH', 28]]
      .forEach(([pth, max]) => { const v = get(T, pth); ok(typeof v === 'string' && v.trim() && width(v) <= max, `${tag} ${pth} 가 김 (폭 ${width(v)} > ${max}): ${v}`); });
    ok(width(T.ui.defaultTitle.replace('{year}', '2027')) <= 24, `${tag} defaultTitle 김`);
    ok(/<em>/.test(T.hero.h1Html) && !/<(?!\/?(br|em)>)/.test(T.hero.h1Html), `${tag} hero.h1Html 은 <br>·<em> 만`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      ok(f.q && f.a && !/<|>/.test(f.q + f.a), `${tag} faq[${i}] 비었거나 HTML`);
      ok(!/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q), `${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (lang !== 'ko') walk(T, (s, pth) => ok(!/[가-힯]/.test(s), `${tag} ${pth} 에 한글`));
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    ok(T.meta.title.toLowerCase().startsWith(APP.title[lang].toLowerCase()), `${tag} meta.title 이 현지 검색어(app.config title "${APP.title[lang]}")로 시작하지 않음`);
    ok(T.siteName === APP.title[lang] && T.hero.h1Kicker === APP.title[lang], `${tag} siteName·h1 검색어가 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    ok(len(title) <= (cjk ? 40 : 78), `${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    ok(dl >= (cjk ? 50 : 100) && dl <= (cjk ? 130 : 230), `${tag} meta.description 길이 ${dl}`);
    ok(width(APP.title[lang]) <= 26, `${tag} app.config title 이 포털 아이콘에 김: ${APP.title[lang]}`);
    if (lang === 'fr') walk(T, (s, pth) => { const t = s.replace(/https?:\/\/\S+/g, '').replace(/\{\w+\}/g, 'x'); if (/[^\s«(  ][?!:;](\s|$)/.test(t) || /[ ][?!:;](\s|$)/.test(t)) bad(`${tag} ${pth} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 50)}`); });
    if (lang === 'ru') ok(/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css) && !/\bвы\b|\bВы\b|\bвас\b|\bваш/.test(JSON.stringify([T.ui, T.hero, T.faq, T.errors])), `${tag} 키릴 글꼴 + 앱 문구는 «ты»`);
    if (lang === 'vi') ok(/Be\+Vietnam|Plus\+Jakarta|Baloo/.test(T.fonts.css), `${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
    if (lang === 'th') ok(/Mitr|Prompt|Kanit|Noto\+Sans\+Thai/.test(T.fonts.css), `${tag} 태국어 글꼴이 아님`);
  });
  const SEO = { en: 'Goal Bingo Card Maker', ko: '새해 목표 빙고', ja: '目標ビンゴ', zh: '新年目标宾果' };
  Object.entries(SEO).forEach(([l, s]) => ok(L10N[l].meta.title.startsWith(s) && APP.title[l] === s, `[${l}] 제목 검색어 "${s}"`));
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
const sectionOf = (html, id) => { const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`)); return m ? m[0] : ''; };
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  ok(title && title.trim(), `${tag} <title> 없음`);
  ok(html.includes(`<html lang="${lang}">`), `${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  ok(h1s === 1, `${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  ok(hl === G.LOCALES.length + 1, `${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  ok(/hreflang="x-default"/.test(html), `${tag} x-default 없음`);
  ok(/<link rel="canonical" href="https:\/\/bingo\.example\.com\//.test(html), `${tag} canonical 없음`);
  ok(/<header class="mg-top">/.test(html), `${tag} 공통 타이틀 바(G.topBar) 없음`);
  ok(!/FAQPage/.test(html) && !/aggregateRating/.test(html), `${tag} FAQPage·aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bingo\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  ok(og, `${tag} og:image 없음`);
  if (og) ok(fs.existsSync(path.join(SITE, og)) && fs.readFileSync(path.join(SITE, og)).readUInt32BE(16) === 1200, `${tag} og:image 파일 없음/크기 다름 ${og} (node tools/gen-og.js all)`);
  ok(/og:locale/.test(html), `${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  ok(!order.some((i) => i < 0) && !order.some((v, i) => i && v < order[i - 1]), `${tag} 공통 스크립트 순서가 다름`);
  ok(!/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html), `${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  ok(!/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, '')), `${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant) ok(/noindex/.test(html), `${tag} 숨은 변형(_l)은 noindex`);
  else ok(!/noindex/.test(html), `${tag} 언어 폴더 페이지에 noindex`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  modes.forEach(([mode, fileOf]) => {
    G.LOCALES.forEach(({ code: lang }) => {
      const T = L10N[lang];
      const f = fileOf(lang, 'index.html');
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음 (node tools/gen-i18n.js)`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      ok(html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`), `${tag} title 이 "검색어 | 브랜드" 가 아님`);
      ok(/"@type":"WebApplication"/.test(html) && /"applicationCategory"/.test(html), `${tag} appLd(WebApplication) 없음`);
      const S = sectionOf(html, 'screen-start'), E = sectionOf(html, 'screen-edit'), D = sectionOf(html, 'screen-done');
      if (!S || !E || !D) { bad(`${tag} 화면 3개(start/edit/done) 없음`); return; }
      ok((html.match(/<section[\s>]/g) || []).length === 3, `${tag} section 은 3개`);
      ok(!/<section id="screen-start"[^>]*hidden/.test(S) && /<section id="screen-edit" class="bg-screen" hidden>/.test(E) && /<section id="screen-done" class="bg-screen" hidden>/.test(D), `${tag} 처음엔 시작 화면만 보임`);
      ok((S.match(/class="mg-ad\b/g) || []).length === 1 && /<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S), `${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      ok((html.match(/class="mg-ad\b/g) || []).length === 1, `${tag} 페이지 전체 mg-ad 는 시작 화면 맨 끝 mg-ad-start 1개뿐(끝 화면 광고는 공통 컴포넌트)`);
      ok(S.includes(`<span class="bg-kicker">${G.esc(T.hero.h1Kicker)}</span>`), `${tag} h1 에 검색어 없음`);
      const at = (s) => S.indexOf(s);
      const so = ['class="bg-h1"', 'class="bg-hook"', 'id="size-start"', 'id="start-btn"', 'id="continue-btn"', 'class="mg-ad mg-ad-start"'].map(at);
      ok(!so.some((i) => i < 0) && !so.some((v, i) => i && v < so[i - 1]), `${tag} 시작 화면 순서(h1 → 훅 → 크기 → 시작 → 이어 하기 → 광고)`);
      ok(/id="continue-btn" class="bg-btn bg-btn-ghost" hidden/.test(S) && /id="link-err" class="bg-error" role="alert" hidden/.test(S), `${tag} 이어 하기·링크 오류는 처음 hidden`);
      ok(/data-size="5" aria-pressed="true"/.test(S) && (S.match(/data-size=/g) || []).length === 3, `${tag} 판 크기 3개, 기본 5×5`);
      const eo = ['id="title-input"', 'id="size-edit"', 'id="free-toggle"', 'id="themes"', 'id="grid"', 'id="cell-input"', 'id="next-btn"', 'id="filled"', 'id="ideas-btn"', 'id="shuffle-btn"', 'id="clear-btn"', 'id="done-btn"', 'id="edit-err"'].map((s) => E.indexOf(s));
      ok(!eo.some((i) => i < 0) && !eo.some((v, i) => i && v < eo[i - 1]), `${tag} 편집 화면 순서`);
      ok(/maxlength="40"/.test(E) && !/type="number"/.test(E), `${tag} 입력 길이 제한`);
      const dO = ['id="shared-note"', 'id="board-canvas"', 'id="tap-hint"', 'id="score-lines"', 'id="download-btn"', 'id="link-btn"', 'id="edit-btn"', 'id="live"', '<div data-mg-end="bingo"></div>'].map((s) => D.indexOf(s));
      ok(!dO.some((i) => i < 0) && !dO.some((v, i) => i && v < dO[i - 1]), `${tag} 완성 화면 순서(카드 → 점수 → 저장·링크·고치기 → 끝 화면)`);
      ok(/<canvas id="board-canvas" class="bg-canvas" width="1080" height="1350" role="img"/.test(D), `${tag} 캔버스 1080×1350 role=img`);
      ok((html.match(/data-mg-end=/g) || []).length === 1 && D.trim().endsWith('<div data-mg-end="bingo"></div>\n  </section>'), `${tag} data-mg-end 는 완성 화면 맨 끝 1개`);
      ok(!/mg-faq|<details/.test(S + E + D), `${tag} 화면에 FAQ 직접 넣음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      ok(!T.faq.some((q) => bodyNoJson.includes(G.esc(q.q))) && !T.ideas.slice(0, 5).some((x) => bodyNoJson.includes(G.esc(x))), `${tag} FAQ·아이디어 문구가 JSON 밖(HTML)에 있음`);
      ok(/window\.MG_FAQ = \[/.test(html) && /window\.PAGE_I18N = /.test(html), `${tag} MG_FAQ·PAGE_I18N 없음`);
      ok(html.indexOf('bingo-core.js') > 0 && html.indexOf('bingo-core.js') < html.indexOf('bingo.js"'), `${tag} bingo-core.js 가 bingo.js 보다 먼저여야 함`);
      ok(/guide\.html/.test(html) && /<meta name="mg-guide"/.test(html), `${tag} 가이드 링크(gen-guides) 없음`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  ok(pages === G.LOCALES.length * 4, `생성 페이지 ${pages}개 ≠ ${G.LOCALES.length * 4}`);
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  ok(urls === G.LOCALES.length, `sitemap.xml URL ${urls}개 ≠ ${G.LOCALES.length} (guide 제외)`);
  ok((sm.match(/<loc>[^<]*guide\.html/g) || []).length === G.LOCALES.length, 'sitemap.xml 에 guide.html 12개');
  ok(/<lastmod>/.test(sm) && /xhtml:link/.test(sm), 'sitemap lastmod·xhtml:link');
  G.LOCALES.forEach(({ code, dir }) => { const f = path.join(SITE, 'og', dir || '', 'default.png'); ok(fs.existsSync(f) && fs.readFileSync(f).readUInt32BE(16) === 1200, `OG 이미지 ${code} (node tools/gen-og.js all)`); });
  return pages;
}

// ---------------------------------------------------------------- 4) 그 밖
function checkMisc() {
  ok(APP.id === 'bingo' && APP.category === 'create' && APP.added === '2026-10-30' && APP.order === 1 && APP.emoji === '🎯' && APP.path === 'https://bingo.example.com/', 'app.config.js 기본값');
  G.LOCALES.forEach(({ code }) => ok(APP.title[code] && APP.desc[code], `app.config ${code} 제목·설명`));
  ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg');
  let link = '';
  try { link = fs.readlinkSync(path.join(SITE, 'shared')); } catch (e) { /* noop */ }
  ok(link === '../../shared', 'shared → ../../shared 심볼릭 링크');
  const src = read('bingo.js');
  const js = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok((js.match(/track\('start'\)/g) || []).length === 1 && (js.match(/track\('done'\)/g) || []).length === 1, 'bingo.js: track start/done 각 1곳');
  ok(/setRetry\(/.test(js) && /setShareData\(/.test(js), 'bingo.js: setRetry·setShareData');
  const storeCalls = js.match(/localStorage\.(get|set|remove)Item\([^)]*\)/g) || [];
  ok(storeCalls.length === 2 && storeCalls.every((s) => /STORE_KEY/.test(s)) && /STORE_KEY = 'mg_bingo_v1'/.test(js), 'bingo.js: localStorage 는 mg_bingo_v1 만');
  ok((js.match(/try \{ return window\.localStorage/g) || []).length === 1 && (js.match(/try \{ window\.localStorage/g) || []).length === 1, 'bingo.js: localStorage 를 try/catch 로 감쌈');
  ok(!/sessionStorage|indexedDB|document\.cookie/.test(js), 'bingo.js: 다른 저장소 없음');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js), 'bingo.js: 서버 전송 없음');
  ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(js), 'bingo.js: innerHTML 없음(사용자 글은 textContent·캔버스로만)');
  ok(!/location\.hash\s*=|history\.pushState/.test(js) && /'#d=' \+ d/.test(js), 'bingo.js: 판 링크(#d=)는 복사로만, 주소창을 바꾸지 않음');
  ok(/mgCleanUrl/.test(js) && /setShareData\(function \(\) \{ return \{ title: U\.shareTitle, text: U\.shareText, url: baseUrl\(\) \}/.test(js), 'bingo.js: 끝 화면 공유 = 깨끗한 주소 + 고정 문구');
  ok(!/[가-힯]/.test(js), 'bingo.js: 코드에 화면 문구(한글) 없음');
  const core = read('bingo-core.js').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  ok(!/fetch\(|XMLHttpRequest|localStorage|document\./.test(core), 'bingo-core.js: 화면·저장·전송 없음(순수 로직)');
}

checkLogic();
checkLocales();
const pages = checkHtml();
checkMisc();

if (problems.length) {
  console.log(`\n✗ check-bingo: 문제 ${problems.length}건 (통과 ${passes})`);
  problems.slice(0, 80).forEach((m) => console.log('  - ' + m));
  process.exit(1);
}
console.log(`PASS check-bingo: 로직(빙고 줄 무작위·크기·자유칸·아이디어·섞기·공유)·언어 12개·HTML ${pages}쪽·사이트맵·OG — 검사 ${passes}건 통과`);
