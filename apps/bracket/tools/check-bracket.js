#!/usr/bin/env node
/**
 * 토너먼트 대진표 검사.
 *   1) 로직(bracket-core.js): 거부 샘플링(uniformInt), 섞기 균등(카이제곱 p=0.001, 4개 = 24가지),
 *      항목 수 2..64 전부: 대진표 크기·bye 수 = size − n, bye 끼리 없음, bye 가 절반마다 고르게(차이 ≤ 1, 재귀),
 *      1라운드에 모든 항목이 정확히 한 번, 무작위로 끝까지 골랐을 때 진짜 경기 = n − 1 · 우승자 1명 · 각 경기 승자는 그 경기 두 사람 중 하나,
 *      입력 순서 시드(1번 시드 = 첫 줄, bye 는 상위 시드부터), 승자 바꾸기/지우기 → 이어지는 결과 지움, 라운드 이름, 항목 정리(중복·꺾쇠·24자·쉼표),
 *      #d= 왕복(UTF-8)·변조/쓰레기 거절·길이 한도, sanitize(정해지지 않은 경기 결과 지움), toText.
 *   2) 언어 파일 12개: 키 구조, 자리표시자(ui.rOf 는 {n}·{h} 중), 번역됨, FAQ 3~5개(getRandomValues, 무료·인기 류 금지),
 *      제목·설명 길이, 360px 문구 폭, h1 검색어, fr 좁은 공백, ru «ты», 글꼴, 한글은 ko 만.
 *   3) 생성 HTML(언어 폴더 + _l): SEO 기본, 타이틀 바, appLd(vote), FAQPage 없음, 시작 화면 마지막 = mg-ad-start 1개(페이지 전체 mg-ad 1개),
 *      화면 순서·처음 hidden, data-mg-end 는 #done 안 마지막, FAQ 는 MG_FAQ 로만, 스크립트 순서, 사용자 항목 칸은 빈 칸.
 *   4) sitemap(guide 제외 12), OG 12장 1200×630, app.config, favicon, shared 링크, bracket.js 규칙
 *      (Math.random 없음, track start 1곳(startBracket)·done 1곳(markDone), innerHTML 은 '' 만, localStorage try/catch, 네트워크 호출 없음).
 *
 * 실행: node tools/check-bracket.js   (tools/check-all.js 가 apps/bracket 에서 자동으로 돌린다)
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'bracket-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
const passed = [];
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const fmt = (t, v) => String(t).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));

// ---------------------------------------------------------------- 1) 로직
const CHI_23 = 49.73; // 자유도 23, p = 0.001
function chi(counts) {
  const N = counts.reduce((a, b) => a + b, 0);
  const e = N / counts.length;
  return counts.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
}
function balanced(a) {
  if (a.length < 2) return true;
  const h = a.length / 2;
  const x = a.slice(0, h).filter((v) => v === -1).length, y = a.slice(h).filter((v) => v === -1).length;
  return Math.abs(x - y) <= 1 && balanced(a.slice(0, h)) && balanced(a.slice(h));
}
function checkLogic() {
  eq([CORE.MIN_ITEMS, CORE.MAX_ITEMS, CORE.MAX_NAME, CORE.MAX_TITLE], [2, 64, 24, 40], '한도');
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(10, seq([4294967295, 4294967290, 13])), 3, 'uniformInt(10): limit 이상 버림');
  eq(CORE.uniformInt(1, seq([77])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(10, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');

  // 섞기 균등 (4! = 24)
  {
    const perms = [];
    (function go(a, rest) { if (!rest.length) { perms.push(a.join('')); return; } rest.forEach((x, i) => go(a.concat(x), rest.filter((_, j) => j !== i))); })([], ['a', 'b', 'c', 'd']);
    const pos = new Map(perms.map((k, i) => [k, i]));
    let x = Infinity;
    for (let t = 0; t < 2 && x > CHI_23; t++) {
      const c = new Array(24).fill(0);
      for (let i = 0; i < 24000; i++) c[pos.get(CORE.shuffle(['a', 'b', 'c', 'd']).join(''))]++;
      x = chi(c);
    }
    if (x > CHI_23) bad(`shuffle(4) 균등 아님: 카이제곱 ${x.toFixed(2)}`);
    passed.push(`shuffle4 χ²=${x.toFixed(1)}`);
    // 무작위 시드에서 1번 자리(첫 경기 위쪽)에 누가 오는지 균등 (8개, 자유도 7, p=0.001 → 24.32)
    let y = Infinity;
    for (let t = 0; t < 2 && y > 24.32; t++) {
      const c = new Array(8).fill(0);
      const items = Array.from({ length: 8 }, (_, i) => 'I' + i);
      for (let i = 0; i < 16000; i++) { const st = CORE.create(CORE.validate({ items: items.join('\n') })); c[Number(st.n[0].slice(1))]++; }
      y = chi(c);
    }
    if (y > 24.32) bad(`무작위 시드 1번 자리 균등 아님: 카이제곱 ${y.toFixed(2)}`);
    passed.push(`seed1 χ²=${y.toFixed(1)}`);
  }

  // 항목 수 2..64 전부
  let counts = 0;
  for (let n = 2; n <= 64; n++) {
    const items = Array.from({ length: n }, (_, i) => 'P' + i);
    for (const seed of ['r', 'o']) {
      for (let rep = 0; rep < (seed === 'r' ? 3 : 1); rep++) {
        const st = CORE.create(CORE.validate({ items: items.join('\n'), seed }));
        const tag = `${n}개(${seed})`;
        const size = CORE.bracketSize(n);
        if (size < n || size / 2 >= n && n > 1 && size !== 2) bad(`${tag}: 크기 ${size}`);
        if (st.w.length !== size - 1) bad(`${tag}: 경기 칸 ${st.w.length} ≠ ${size - 1}`);
        let res = CORE.resolve(st);
        const s0 = res.slots[0];
        const byes = s0.filter((v) => v === -1).length;
        if (byes !== size - n) bad(`${tag}: bye ${byes} ≠ ${size - n}`);
        for (let i = 0; i < s0.length; i += 2) if (s0[i] === -1 && s0[i + 1] === -1) bad(`${tag}: bye 끼리 만남`);
        if (!balanced(s0)) bad(`${tag}: bye 가 고르게 퍼지지 않음 ${JSON.stringify(s0)}`);
        const ent = s0.filter((v) => v >= 0).sort((a, b) => a - b);
        if (ent.length !== n || ent.some((v, i) => v !== i)) bad(`${tag}: 1라운드에 모든 항목이 한 번씩이 아님`);
        if (res.real !== n - 1) bad(`${tag}: 진짜 경기 ${res.real} ≠ ${n - 1}`);
        if (seed === 'o') {
          if (st.n.join() !== items.join()) bad(`${tag}: 입력 순서가 유지되지 않음`);
          // bye 를 받는 사람 = 상위 시드(0..byes-1)
          const byeTakers = res.matches.filter((m) => m.bye).map((m) => m.win).sort((a, b) => a - b);
          if (byeTakers.some((v, i) => v !== i)) bad(`${tag}: bye 를 상위 시드가 받지 않음 ${byeTakers}`);
        }
        let picks = 0, mt;
        while ((mt = CORE.nextMatch(st))) {
          if (!mt.ready || mt.bye || mt.a < 0 || mt.b < 0) { bad(`${tag}: 준비 안 된 경기를 다음으로 줌`); break; }
          CORE.setPick(st, mt.idx, CORE.cryptoInt(2));
          picks++;
          if (picks > 200) { bad(`${tag}: 끝나지 않음`); break; }
        }
        res = CORE.resolve(st);
        if (picks !== n - 1) bad(`${tag}: 고른 경기 ${picks} ≠ ${n - 1}`);
        if (res.champion < 0 || res.decided !== n - 1) bad(`${tag}: 우승자 없음`);
        res.matches.forEach((m) => { if (!m.bye && m.win !== m.a && m.win !== m.b) bad(`${tag}: 경기 승자가 두 사람 중 하나가 아님`); });
        // 우승자는 정확히 한 명: 결승 승자 = champion, 다른 모든 사람은 한 번 짐
        const losers = new Set();
        res.matches.forEach((m) => { if (!m.bye) losers.add(m.win === m.a ? m.b : m.a); });
        if (losers.size !== n - 1 || losers.has(res.champion)) bad(`${tag}: 패자 수 ${losers.size} 또는 우승자가 짐`);
        // 왕복
        const d = CORE.decode(CORE.encode(st));
        if (JSON.stringify(d) !== JSON.stringify(st)) bad(`${tag}: #d= 왕복이 다름`);
        counts++;
      }
    }
  }
  passed.push(`counts2..64:${counts}`);

  // 승자 바꾸기 → 이어지는 결과 지움
  {
    const st = CORE.create(CORE.validate({ items: 'A\nB\nC\nD', seed: 'o' })); // 자리: A D B C → (A v D), (B v C)
    eq(CORE.resolve(st).slots[0], [0, 3, 1, 2], '4개 표준 배치(1v4, 2v3)');
    CORE.setPick(st, 0, 0); CORE.setPick(st, 1, 1); CORE.setPick(st, 2, 0);
    eq(CORE.resolve(st).champion, 0, '우승 A');
    eq(CORE.setPick(st, 0, 1), true, '1경기 승자 바꿈');
    eq(st.w, [1, 1, -1], '결승 결과 지워짐');
    eq(CORE.setPick(st, 2, 0), true, '결승 다시');
    eq(CORE.resolve(st).champion, 3, '우승 D');
    eq(CORE.clearPick(st, 1), true, '2경기 지우기');
    eq(st.w, [1, -1, -1], '2경기 지우면 결승도 지움');
    eq(CORE.setPick(st, 2, 0), false, '준비 안 된 결승은 못 고름');
    eq(CORE.setPick(st, 0, 1), false, '같은 승자는 바뀜 없음');
    eq(CORE.downstream(8, 0), [4, 6], 'downstream(8, 0)');
    eq(CORE.downstream(8, 5), [6], 'downstream(8, 5)');
  }
  // 5개: bye 3개, 1라운드 진짜 경기 1개
  {
    const st = CORE.create(CORE.validate({ items: '1\n2\n3\n4\n5', seed: 'o' }));
    const r = CORE.resolve(st);
    eq(r.matches.filter((m) => m.r === 0 && m.bye).length, 3, '5개: bye 3');
    eq(r.matches.filter((m) => m.r === 0 && !m.bye).map((m) => [m.a, m.b]), [[3, 4]], '5개: 1라운드 경기는 4번 vs 5번 시드');
    eq(CORE.nextMatch(st).idx, 1, '5개: 첫 경기');
  }
  // 라운드 이름
  eq([0, 1, 2, 3, 4, 5].map((r) => CORE.roundInfo(r, 6).key + CORE.roundInfo(r, 6).n), ['of64', 'of32', 'of16', 'quarter8', 'semi4', 'final2'], '라운드 이름(64)');
  eq(CORE.roundInfo(0, 1), { key: 'final', n: 2, h: 1 }, '2개 = 결승뿐');

  // 항목 정리
  eq(CORE.parseItems('Pizza\n pizza \nTacos\n\nSushi').items, ['Pizza', 'Tacos', 'Sushi'], '중복(대소문자)·빈 줄 제거');
  eq(CORE.parseItems('Pizza\npizza').dupes, 1, '중복 수');
  eq(CORE.parseItems('a, b, c').items, ['a', 'b', 'c'], '한 줄이면 쉼표로 나눔');
  eq(CORE.parseItems('Paris, France\nTokyo').items, ['Paris, France', 'Tokyo'], '여러 줄이면 쉼표 유지');
  eq(CORE.parseItems('<b>Al</b>\nBo\u0007b').items, ['b Al /b', 'Bo b'], '꺾쇠·제어 문자 정리');
  const lp = CORE.parseItems('x'.repeat(60));
  eq([Array.from(lp.items[0]).length, lp.long], [24, true], '24자 제한');
  eq(CORE.validate({ items: 'A' }).error, 'tooFew', '1개');
  eq(CORE.validate({ items: Array.from({ length: 65 }, (_, i) => 'P' + i).join('\n') }), { ok: false, error: 'tooMany', n: 65 }, '65개');
  eq(CORE.validate({ items: 'A\nB', title: ' <Cup> ', seed: 'x', mode: 'zz' }).title, 'Cup', '제목 정리');

  // #d= 변조 · 쓰레기
  const st = CORE.create(CORE.validate({ items: '민준\nМаша\nZoë\n🍕', title: '회사 컵' }));
  CORE.setPick(st, CORE.nextMatch(st).idx, 0);
  const enc = CORE.encode(st);
  if (!/^[A-Za-z0-9_-]+$/.test(enc)) bad('encode: base64url 아님');
  eq(CORE.decode(enc), st, '#d= 왕복(UTF-8)');
  const raw = (o) => Buffer.from(JSON.stringify(o), 'utf8').toString('base64url');
  const good = { v: 1, t: 'T', n: ['A', 'B', 'C'], s: 'r', m: 'p', w: '---' };
  eq(CORE.decode(raw(good)) && CORE.decode(raw(good)).n, ['A', 'B', 'C'], 'decode 기본');
  [['버전', { v: 2 }], ['이름 1개', { n: ['A'], w: '-' }], ['중복 이름', { n: ['A', 'a', 'B'] }], ['빈 이름', { n: ['A', '', 'B'] }], ['숫자 이름', { n: ['A', 5, 'B'] }],
    ['w 길이', { w: '--' }], ['w 문자', { w: '-2-' }], ['w 배열', { w: [-1, -1, -1] }], ['모르는 키', { x: 1 }], ['긴 이름', { n: ['A', 'x'.repeat(80), 'B'] }], ['65개', { n: Array.from({ length: 65 }, (_, i) => 'P' + i) }]]
    .forEach(([nm, o]) => { if (CORE.decode(raw(Object.assign({}, good, o)))) bad(`decode: ${nm} 를 거절해야 함`); });
  ['', 'abc$', '!!!', null, 123, 'x'.repeat(13000), raw([1, 2])].forEach((s) => { if (CORE.decode(s)) bad(`decode 쓰레기 허용: ${String(s).slice(0, 10)}`); });
  // 정해지지 않은 경기 결과(결승만 1)는 지움, bye 경기 결과도 지움
  eq(CORE.decode(raw(Object.assign({}, good, { w: '--1' }))).w, [-1, -1, -1], 'sanitize: 준비 안 된 결승 결과 지움');
  eq(CORE.decode(raw(Object.assign({}, good, { w: '1--' }))).w[0], -1, 'sanitize: bye 경기 결과 지움(3개: 첫 경기 = 1번 시드 vs bye)');
  const dirty = CORE.decode(raw(Object.assign({}, good, { n: ['<img src=x onerror=1>', 'B', 'C'] })));
  if (!dirty || /[<>]/.test(dirty.n[0])) bad('decode: 꺾쇠 정리');
  // 64개 × 24자 한글도 링크 한도 안
  const big = CORE.create(CORE.validate({ items: Array.from({ length: 64 }, (_, i) => '가'.repeat(21) + String(i).padStart(3, '0')).join('\n') }));
  const be = CORE.encode(big);
  if (!be || be.length > CORE.MAX_LINK) bad(`64개 × 24자 링크 길이 ${be && be.length}`);
  else passed.push(`maxLink:${be.length}`);
  // 글로 복사
  const tx = CORE.toText(CORE.decode(raw({ v: 1, t: 'Cup', n: ['A', 'B', 'C'], s: 'o', m: 'p', w: '-0-' })), { title: 'T', round: (i) => i.key, vs: 'vs', bye: 'bye', champion: 'Champ' });
  eq(tx, '🏆 Cup\n\n[semi]\n• A (bye)\n• B vs C → B\n\n[final]\n• A vs B', 'toText');
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(val) {
  if (Array.isArray(val)) return 'array';
  if (val && typeof val === 'object') return Object.keys(val).sort().reduce((o, k) => (o[k] = shape(val[k]), o), {});
  return typeof val;
}
function keysDiff(a, b, p, out) {
  if (typeof a !== typeof b || (typeof a === 'string' && a !== b)) { out.push(`${p || '(루트)'} 모양 다름`); return; }
  if (typeof a !== 'object') return;
  new Set([...Object.keys(a), ...Object.keys(b)]).forEach((k) => {
    if (!(k in b)) out.push(`${p}${k} 없음`);
    else if (!(k in a)) out.push(`${p}${k} 이 더 있음`);
    else keysDiff(a[k], b[k], `${p}${k}.`, out);
  });
}
const tokens = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(',');
function walk(obj, fn, p = '') {
  if (typeof obj === 'string') return fn(obj, p);
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, val]) => walk(val, fn, p ? `${p}.${k}` : k));
}
const get = (o, p) => p.split('.').reduce((a, k) => a[k], o);
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const files = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  if (files.length !== G.LOCALES.length) bad(`언어 파일 ${files.length}개 ≠ ${G.LOCALES.length}`);
  G.LOCALES.forEach(({ code: lang }) => {
    const T = L10N[lang];
    const tag = `[${lang}]`;
    const first = fs.readFileSync(path.join(SITE, 'tools', 'i18n', `${lang}.js`), 'utf8').split('\n')[0];
    if (/TODO-TRANSLATE/.test(first)) bad(`${tag} 번역 대기(TODO-TRANSLATE)`);
    const diff = [];
    keysDiff(enShape, shape(T), '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => {
      if (/^(privacy|faq)\./.test(p)) return;
      if (p === 'ui.rOf') { if (!/^(\{h\}|\{n\})$/.test(tokens(s))) bad(`${tag} ui.rOf 는 {n} 또는 {h} 하나: ${s}`); return; }
      if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`);
    });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.create', 'ui.itemsLabel', 'ui.tapWinner', 'ui.undo', 'ui.modePick', 'ui.drawHint', 'result.again', 'errors.tooFew', 'ui.rSemi'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 문구
    const W = [['ui.create', 26], ['ui.resumeBtn', 14], ['ui.seedRandom', 24], ['ui.seedOrder', 26], ['ui.modePick', 26], ['ui.modeDraw', 28], ['ui.undo', 18], ['ui.png', 18],
      ['ui.copyText', 18], ['ui.shareLink', 18], ['ui.newBracket', 34], ['ui.tapWinner', 30], ['ui.bye', 14], ['ui.advance', 14], ['ui.tbd', 12], ['ui.champion', 12],
      ['ui.rFinal', 16], ['ui.rSemi', 16], ['ui.rQuarter', 18], ['ui.titleLabel', 26], ['ui.itemsLabel', 30], ['ui.seedLabel', 30], ['ui.modeLabel', 34], ['ui.optional', 16],
      ['ui.bracketTitle', 30], ['result.again', 32], ['result.kicker', 20]];
    W.forEach(([p, max]) => { const val = get(T, p); if (width(val) > max) bad(`${tag} ${p} 가 김 (폭 ${width(val)} > ${max}, 360px): ${val}`); });
    if (width(fmt(T.ui.rOf, { n: 64, h: 32 })) > 18) bad(`${tag} ui.rOf 가 김: ${T.ui.rOf}`);
    if (width(fmt(T.ui.count, { n: 64 })) > 16) bad(`${tag} ui.count 가 김: ${T.ui.count}`);
    if (width(fmt(T.ui.matchOf, { k: 63, n: 63 })) > 30) bad(`${tag} ui.matchOf 가 김: ${T.ui.matchOf}`);
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking|順位|排名|рейтинг/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문: ${f.q}`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 공정성(crypto.getRandomValues) 설명 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름("${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s«(][?!:;](\s|$)/.test(t) || /[\u00a0 ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru') walk(T, (s, p) => { if (!p.startsWith('privacy.') && /(^|[^а-яё])(вы|вас|вам|ваш[а-я]*)([^а-яё]|$)/i.test(s)) bad(`${tag} ${p} 는 «ты» 로: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Rubik|Nunito|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 글꼴 아님`);
    if (lang === 'vi' && !/Be\+Vietnam/.test(T.fonts.css)) bad(`${tag} 베트남어 본문 글꼴 아님`);
    if (lang === 'th' && !/Kanit|Mitr|Prompt|Sarabun/.test(T.fonts.css)) bad(`${tag} 태국어 글꼴 아님`);
    if (lang === 'zh' && !/ZCOOL|Noto\+Sans\+SC/.test(T.fonts.css)) bad(`${tag} 간체자 글꼴 아님`);
    if (/^(en|fr|de|es|it|pt|vi)$/.test(lang) && !/Baloo\+2/.test(T.fonts.css)) bad(`${tag} 라틴 확장 글꼴(Baloo 2) 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
const section = (html, id) => (html.match(new RegExp(`<section id="${id}"[\\s\\S]*?<\\/section>`)) || [''])[0];
const stripRuntime = (html) => html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
function commonHtml(tag, html, lang, variant) {
  if (!/<title>[^<]+<\/title>/.test(html)) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개`);
  if (!/<link rel="canonical" href="https:\/\/bracket\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바 없음`);
  if (/FAQPage|aggregateRating/.test(html)) bad(`${tag} FAQPage/aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/bracket\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og || !fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 없음/파일 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((x, i) => i && x < order[i - 1])) bad(`${tag} 공통 스크립트 순서`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 값이 HTML 에`);
  if (variant !== /noindex/.test(html)) bad(`${tag} noindex 는 숨은 변형(_l)에만`);
  if (/#d=/.test(html)) bad(`${tag} #d= 링크가 HTML 에`);
}
function checkHtml() {
  let pages = 0;
  const modes = [['folder', (lang, rel) => G.folderFileOf(lang, rel)], ['variant', (lang, rel) => `_l/${lang}/${rel}`]];
  modes.forEach(([mode, fileOf]) => {
    G.LOCALES.forEach(({ code: lang }) => {
      const T = L10N[lang];
      const f = fileOf(lang, 'index.html');
      if (!fs.existsSync(path.join(SITE, f))) { bad(`${f} 없음`); return; }
      const html = read(f);
      const tag = `[${lang}] ${f}`;
      commonHtml(tag, html, lang, mode === 'variant');
      pages++;
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 아님`);
      if (!/"@type":"WebApplication"/.test(html)) bad(`${tag} appLd 없음`);
      const S = section(html, 'screen-setup');
      const P = section(html, 'screen-play');
      if (!S || !P) { bad(`${tag} 화면 없음`); return; }
      if ((html.match(/<section[\s>]/g) || []).length !== 2) bad(`${tag} section 은 2개(대진표 라운드는 JS 가 그림)`);
      if (!/<section id="screen-play" class="bk-screen bk-play" hidden>/.test(html)) bad(`${tag} 대진 화면은 처음 hidden`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 시작 화면 맨 끝 mg-ad-start 정확히 하나`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 1개`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      const inOrder = (X, ids, what) => { const at = ids.map((s) => X.indexOf(s)); if (at.some((i) => i < 0) || at.some((x, i) => i && x < at[i - 1])) bad(`${tag} ${what} 순서`); };
      inOrder(S, ['class="bk-h1"', 'class="bk-hook"', 'id="resume"', 'id="title"', 'id="items"', 'id="items-count"', 'id="seed-r"', 'id="seed-o"', 'id="mode-p"', 'id="mode-d"', 'id="error"', 'id="create-btn"', 'class="bk-fair"', 'class="mg-ad mg-ad-start"'], '시작 화면');
      inOrder(P, ['id="ev-title"', 'id="duel"', 'id="side-a"', 'id="side-b"', 'id="board"', 'id="undo-btn"', 'id="png-btn"', 'id="text-btn"', 'id="link-btn"', 'id="new-btn"', 'id="live"', 'id="done"', 'id="champ-name"', '<div data-mg-end="bracket"></div>'], '대진 화면');
      ['<div id="resume" class="bk-resume" hidden>', '<div id="duel" class="bk-duel" hidden>', '<div id="done" class="bk-done" hidden>', '<p id="error" class="bk-error" role="alert" hidden>'].forEach((s) => { if (!html.includes(s)) bad(`${tag} 처음 hidden: ${s.slice(0, 30)}`); });
      if (!/<div id="done"[\s\S]*?<div data-mg-end="bracket"><\/div>\s*<\/div>\s*<\/section>$/.test(P)) bad(`${tag} data-mg-end 는 #done 안 마지막`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 1개`);
      [/<div id="board" class="bk-board"><\/div>/, /<h2 class="bk-h2 bk-champ" id="champ-name"><\/h2>/, /<span class="bk-side-name" id="side-a-name"><\/span>/, /<textarea id="items"[^>]*><\/textarea>/]
        .forEach((re) => { if (!re.test(html)) bad(`${tag} 빈 칸이어야 함: ${re.source.slice(1, 30)}`); });
      if (!/name="seed" id="seed-r" value="r" checked/.test(S) || !/name="mode" id="mode-p" value="p" checked/.test(S)) bad(`${tag} 기본값(랜덤·한 판씩)`);
      const rt = (html.match(/<script>window\.PAGE_I18N = ([\s\S]*?);?<\/script>/) || [])[1];
      let runtime = null;
      try { runtime = JSON.parse(rt); } catch (e) { bad(`${tag} PAGE_I18N JSON`); }
      if (runtime && Object.keys(runtime).sort().join() !== 'errors,lang,result,ui') bad(`${tag} PAGE_I18N 키`);
      if (/mg-faq|<details/.test(S + P)) bad(`${tag} 화면에 FAQ`);
      if (T.faq.some((q) => stripRuntime(html).includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖에`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (html.indexOf('bracket-core.js') < 0 || html.indexOf('bracket-core.js') > html.indexOf('bracket.js"')) bad(`${tag} bracket-core.js 가 먼저`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  if ((sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length !== G.LOCALES.length) bad('sitemap.xml URL 수(guide 제외)');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 _l');
  G.LOCALES.forEach(({ code }) => { if (!fs.existsSync(path.join(SITE, 'tools', 'guide', `${code}.js`))) bad(`가이드 ${code} 없음`); });
  if (!fs.existsSync(path.join(SITE, 'README.md'))) bad('README.md 없음');

  // 코드 규칙
  const js = fs.readFileSync(path.join(SITE, 'bracket.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js) || /'[A-Z][a-z]+ [a-z]+[^']*'/.test(js)) bad('bracket.js 에 언어 문구');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("bracket.js: track start/done 각 1곳");
  const fnBody = (name) => { const i = js.indexOf(`function ${name}(`); return i < 0 ? '' : js.slice(i, js.indexOf('\n  }\n', i)); };
  if (!fnBody('startBracket').includes("track('start')")) bad("track('start') 는 startBracket 안");
  if (!fnBody('markDone').includes("track('done')") || !fnBody('markDone').includes('doneTracked')) bad("track('done') 은 markDone 안(한 번)");
  if (!fnBody('loadLink').includes('doneTracked = true')) bad('받은 링크는 done 을 세지 않음');
  if (/Math\.random/.test(js)) bad('bracket.js Math.random');
  if (/innerHTML\s*=\s*(?!\s*'')/.test(js)) bad("bracket.js: innerHTML 은 '' 만");
  if (/fetch\(|XMLHttpRequest|sendBeacon|supa\./.test(js)) bad('bracket.js 네트워크 호출');
  const lines = js.split('\n');
  lines.forEach((line, i) => { if (/localStorage\./.test(line) && !/try\s*\{/.test(line) && !/try\s*\{/.test(lines[i - 1] || '') && !/try\s*\{/.test(lines[i - 2] || '')) bad(`bracket.js ${i + 1}행: localStorage 는 try/catch 안`); });
  if (!/setShareData/.test(js) || !/setRetry/.test(js) || !/mgCleanUrl/.test(js)) bad('bracket.js: setShareData / setRetry / mgCleanUrl');
  if (!/CORE\.decode/.test(js) || !/#d=/.test(js)) bad('bracket.js: #d= 열기 없음');
  if (!/toBlob|toDataURL/.test(js) || !/fonts\.ready/.test(js)) bad('bracket.js: PNG(캔버스, 글꼴 준비 뒤)');
  const core = fs.readFileSync(path.join(SITE, 'bracket-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('bracket-core.js 는 crypto.getRandomValues 만');
  const css = fs.readFileSync(path.join(SITE, 'style.css'), 'utf8');
  if (!/\.bk-shell \{[^}]*max-width: var\(--app-width\)/.test(css) || !/overflow-x: clip/.test(css)) bad('style.css: 앱 폭·가로 넘침 막기');
  if (/overflow-x:\s*(auto|scroll)/.test(css)) bad('style.css: 가로 스크롤 영역 금지(대진표는 세로 목록)');
  return pages;
}

function checkOg() {
  let n = 0;
  G.LOCALES.forEach(({ dir }) => {
    const f = path.join(SITE, 'og', dir, 'default.png');
    if (!fs.existsSync(f)) return bad(`OG 없음: og/${dir ? dir + '/' : ''}default.png`);
    const b = fs.readFileSync(f);
    if (b.toString('ascii', 1, 4) !== 'PNG' || b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) bad(`OG 크기/형식 ${f}`);
    n++;
  });
  return n;
}
function checkApp() {
  if (APP.id !== 'bracket' || APP.category !== 'vote' || APP.path !== 'https://bracket.example.com/' || APP.added !== '2026-10-30' || APP.emoji !== '🏆' || APP.order !== 2) bad('app.config.js id/emoji/category/path/added/order');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 160) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])})`);
      if (width(APP.title[code]) > 34) bad(`app.config.js ${code} 포털 이름이 김`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n토너먼트 대진표 로직(항목 2~64 전부: bye 수·bye 끼리 없음·고른 분포·n−1 경기·우승 1명)·섞기 공정성·승자 변경·#d= 왕복/거절 · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개 · OG ${ogs}장 검사`);
if (passed.length) console.log(`  ${passed.join(' ')}`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 대진표 로직(2~64)·공정한 섞기·#d=, 언어 파일 12개, 생성 HTML(SEO·타이틀 바·시작 화면 맨 끝 mg-ad-start 1개·#done 안 data-mg-end), OG 모두 OK');
