#!/usr/bin/env node
/**
 * 주사위 굴리기 검사.
 *   1) 로직(dice-core.js): 거부 샘플링(uniformInt 가 limit 이상 값을 버리는지), 종류별 값 범위(d4~d20, 1~면 수), 개수 1~6,
 *      공정성 카이제곱(종류마다 crypto 로 면 수 × 6000 번, p≈0.001 기준), 2d6 합 분포(7 이 가장 흔함), 표기(2d6·d20·3W6), 기록 10개, 정육면체 회전.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개(getRandomValues 언급, "무료인가요?" 류 금지),
 *      제목·설명 길이, 360px 폭 문구 길이, h1 검색어, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나 / hreflang 12개 + x-default / canonical / og:image / 타이틀 바 / appLd(vote) /
 *      FAQPage 없음 / Supabase 값 없음 / 첫 화면(#screen-dice) 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음 /
 *      판(#tray) → 굴리기 버튼 → 기록(#history, 처음 hidden) 안 data-mg-end="dice" 순서, 개수 버튼 1~6·종류 버튼 6개, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js, favicon, shared 링크.
 *
 * 실행: node tools/check-dice.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'dice-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
// 보이는 글자 수 (태국어 윗·아랫 기호는 세지 않는다)
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
// 360px 폭: 한중일 글자는 2칸
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);

// ---------------------------------------------------------------- 1) 로직
// 카이제곱 임계값(p = 0.001), 자유도 = 면 수 - 1
const CHI_001 = { 3: 16.27, 5: 20.52, 7: 24.32, 9: 27.88, 11: 31.26, 19: 43.82 };
function checkLogic() {
  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
  eq(CORE.TYPES, [4, 6, 8, 10, 12, 20], '종류');
  eq([CORE.MIN_DICE, CORE.MAX_DICE, CORE.HISTORY_MAX], [1, 6, 10], '개수·기록 한도');
  // 거부 샘플링: limit 이상 값은 버리고 다음 값을 쓴다
  const seq = (arr) => { let i = 0; return () => arr[i++]; };
  eq(CORE.uniformInt(6, seq([4294967295, 4294967292, 7])), 1, 'uniformInt(6): 2^32-1, 2^32-4(=limit) 는 버리고 7 → 1');
  eq(CORE.uniformInt(6, seq([4294967291])), 4294967291 % 6, 'uniformInt(6): limit-1 은 받음');
  eq(CORE.uniformInt(20, seq([4294967295, 4294967280, 39])), 19, 'uniformInt(20): limit(4294967280) 이상 버림');
  eq(CORE.uniformInt(1, seq([123])), 0, 'uniformInt(1)');
  let threw = false;
  try { CORE.uniformInt(6, () => 4294967295); } catch (e) { threw = true; }
  if (!threw) bad('uniformInt: 늘 버려지는 값만 주면 오류로 멈춰야 함');
  // 개수·종류 맞추기
  eq(CORE.clampCount(0), 1, 'clampCount 0'); eq(CORE.clampCount(6), 6, 'clampCount 6'); eq(CORE.clampCount(7), 1, 'clampCount 7'); eq(CORE.clampCount('3'), 3, 'clampCount "3"'); eq(CORE.clampCount(NaN), 1, 'clampCount NaN');
  eq(CORE.clampSides(20), 20, 'clampSides 20'); eq(CORE.clampSides(7), 6, 'clampSides 7'); eq(CORE.clampSides('10'), 10, 'clampSides "10"'); eq(CORE.clampSides(100), 6, 'clampSides 100');
  // roll: 주입 난수, 개수
  eq(CORE.roll(3, 20, () => 0), [1, 1, 1], 'roll 최소'); eq(CORE.roll(2, 8, (m) => m - 1), [8, 8], 'roll 최대');
  eq(CORE.roll(9, 6, () => 2).length, 1, 'roll 개수 범위 밖 = 1개'); eq(CORE.roll(6, 4).length, 6, 'roll 6개');
  let seenMax = 0; CORE.roll(1, 12, (m) => { seenMax = m; return 0; }); eq(seenMax, 12, 'roll 은 면 수만큼 뽑음');
  eq(CORE.sum([1, 2, 6]), 9, 'sum');
  eq(CORE.notation(2, 6), '2d6', 'notation 2d6'); eq(CORE.notation(1, 20), 'd20', 'notation d20'); eq(CORE.notation(3, 6, 'W'), '3W6', 'notation 3W6');
  // 기록 10개, 최신이 앞
  let h = [];
  for (let i = 1; i <= 12; i++) h = CORE.pushHistory(h, { n: i });
  eq(h.length, 10, '기록 10개'); eq(h[0].n, 12, '기록 최신이 맨 앞'); eq(h[9].n, 3, '기록 가장 오래된 것');
  // 정육면체 회전: 6면 모두 다른 방향, 범위 밖은 0
  const rots = [1, 2, 3, 4, 5, 6].map((v) => JSON.stringify(CORE.cubeRotation(v)));
  if (new Set(rots).size !== 6) bad('cubeRotation 6면이 서로 달라야 함');
  eq(CORE.cubeRotation(1), { x: 0, y: 0 }, 'cubeRotation 1');
  // 합 분포: 2d6 에서 7 = 6/36 이 가장 흔함, 3d6 은 10·11
  const d2 = CORE.sumDistribution(2, 6);
  if (Math.abs(d2[7] - 6 / 36) > 1e-12 || Math.abs(d2[2] - 1 / 36) > 1e-12) bad('2d6 분포');
  const mode = (d) => Object.keys(d).filter((k) => d[k] === Math.max(...Object.values(d))).map(Number);
  eq(mode(d2), [7], '2d6 최빈값'); eq(mode(CORE.sumDistribution(3, 6)), [10, 11], '3d6 최빈값');
  if (Math.abs(Object.values(CORE.sumDistribution(4, 20)).reduce((a, b) => a + b, 0) - 1) > 1e-9) bad('4d20 분포 합 1');

  // 공정성: 종류마다 crypto 로 면 수 × 6000 번 → 범위 + 카이제곱
  CORE.TYPES.forEach((s) => {
    const N = s * 6000;
    const c = new Array(s).fill(0);
    let out = 0;
    for (let i = 0; i < N; i++) {
      const v = CORE.roll(1, s)[0];
      if (!(Number.isInteger(v) && v >= 1 && v <= s)) out++; else c[v - 1]++;
    }
    if (out) bad(`d${s}: 범위 밖 값 ${out}개`);
    const e = N / s;
    const chi = c.reduce((a, x) => a + (x - e) * (x - e) / e, 0);
    if (chi > CHI_001[s - 1]) bad(`공정성 d${s}: 카이제곱 ${chi.toFixed(2)} > ${CHI_001[s - 1]} (p 0.001)`);
  });
  // 여러 개 굴림: 6d6 각 자리도 범위 안, 2d6 합 7 비율 ≈ 1/6
  let seven = 0; const M = 60000;
  for (let i = 0; i < M; i++) { const r = CORE.roll(2, 6); if (r[0] + r[1] === 7) seven++; }
  if (Math.abs(seven / M - 1 / 6) > 0.012) bad(`공정성: 2d6 합 7 비율 ${(seven / M).toFixed(4)} (0.1667)`);
  for (let i = 0; i < 2000; i++) { const r = CORE.roll(6, 20); if (r.length !== 6 || r.some((v) => v < 1 || v > 20)) { bad('6d20 범위 밖'); break; } }
}

// ---------------------------------------------------------------- 2) 언어 파일
function shape(v) {
  if (Array.isArray(v)) return 'array';
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => (o[k] = shape(v[k]), o), {});
  return typeof v;
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
function tokens(s) { return (String(s).match(/\{\w+\}/g) || []).sort().join(','); }
function walk(obj, fn, p = '') {
  if (typeof obj === 'string') return fn(obj, p);
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, p ? `${p}.${k}` : k));
}
function checkLocales() {
  const EN = L10N.en;
  const enShape = shape(EN);
  const langFiles = fs.readdirSync(path.join(SITE, 'tools', 'i18n')).filter((f) => f.endsWith('.js'));
  if (langFiles.length !== G.LOCALES.length) bad(`언어 파일 ${langFiles.length}개 ≠ ${G.LOCALES.length}`);
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
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.countLabel', 'result.again', 'history.title'].forEach((p) => {
        const get = (o) => p.split('.').reduce((a, k) => a[k], o);
        if (get(T) === get(EN)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`);
      });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 표기 글자: 한 글자(d / W)
    if (!/^[A-Za-zА-Яа-я]$/.test(T.ui.dieLetter)) bad(`${tag} ui.dieLetter 는 한 글자: ${T.ui.dieLetter}`);
    if (lang === 'de' && T.ui.dieLetter !== 'W') bad(`${tag} 독일어 주사위 표기는 W (W6, W20)`);
    // 360px 폭 문구 (버튼·라벨·칩)
    const W = [['ui.roll', 24], ['ui.rolling', 20], ['result.again', 24], ['ui.countLabel', 28], ['ui.typeLabel', 28], ['ui.idle', 30], ['history.title', 30]];
    W.forEach(([p, max]) => { const v = p.split('.').reduce((a, k) => a[k], T); if (width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`); });
    if (width(G.fmt(T.ui.total, { n: 120 })) > 22) bad(`${tag} ui.total 가 김 (360px 판)`);
    // 제목·h1
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 공정성(crypto.getRandomValues) 설명 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s «(][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
// 첫 화면: <section id="screen-dice"> ~ 그 짝 </section> (안에 section 이 없으므로 다음 </section>)
function screen(html) {
  const m = html.match(/<section id="screen-dice"[\s\S]*?<\/section>/);
  return m ? m[0] : '';
}
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개 (1개여야 함)`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/dice\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/dice\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서가 다름`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더가 들어감`);
  if (variant && !/noindex/.test(html)) bad(`${tag} 숨은 변형(_l)은 noindex`);
  if (!variant && /noindex/.test(html)) bad(`${tag} 언어 폴더 페이지에 noindex`);
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
      if (!html.includes(`<title>${G.esc(T.meta.title)} | ${G.esc(G.brandOf(lang))}</title>`)) bad(`${tag} title 이 "검색어 | 브랜드" 가 아님`);
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"UtilitiesApplication"/.test(html)) bad(`${tag} appLd(WebApplication, vote) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-dice) 없음`); return; }
      if (/<section id="screen-dice"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐(시작 화면이 따로 없는 도구 앱)`);
      // 광고: 첫 화면 마지막 요소 = mg-ad-start 정확히 1개, 그 밖 mg-ad 없음(끝 화면 광고는 공통 컴포넌트)
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 첫 화면 맨 끝 mg-ad-start 1개뿐`);
      if (!/<h1 class="dc-h1">/.test(S)) bad(`${tag} h1 이 첫 화면에 없음`);
      if (!S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      // 순서: h1 → 설정 → 판 → 굴리기 → 기록(끝 화면 포함) → 광고
      const at = (s) => S.indexOf(s);
      const seq = ['class="dc-h1"', 'id="count-label"', 'id="type-label"', 'id="tray"', 'id="roll-btn"', 'id="history"', 'id="history-list"', '<div data-mg-end="dice"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((v, i) => i && v < seq[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 개수 → 종류 → 판 → 굴리기 → 기록·끝 화면 → 광고)가 아님`);
      if (!/<div id="history" class="dc-history" hidden>/.test(S)) bad(`${tag} 기록·끝 화면(#history)은 처음에 hidden`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      [1, 2, 3, 4, 5, 6].forEach((n) => { if (!S.includes(`data-count="${n}"`)) bad(`${tag} 개수 버튼 ${n} 없음`); });
      if (S.includes('data-count="7"')) bad(`${tag} 개수 버튼은 6까지`);
      CORE.TYPES.forEach((s) => { if (!S.includes(`data-sides="${s}"`) || !S.includes(`>${G.esc(T.ui.dieLetter)}${s}</button>`)) bad(`${tag} 종류 버튼 ${T.ui.dieLetter}${s} 없음`); });
      if ((S.match(/aria-checked="true"/g) || []).length !== 2 || !/data-count="2" aria-checked="true"/.test(S) || !/data-sides="6" aria-checked="true"/.test(S)) bad(`${tag} 기본 선택은 2개 · d6`);
      if ((S.match(/role="radiogroup"/g) || []).length !== 2) bad(`${tag} 라디오 그룹(개수·종류) 접근성`);
      if (!/id="live" class="visually-hidden" aria-live="polite"/.test(S)) bad(`${tag} 결과 읽어 주기(aria-live) 없음`);
      if (/mg-faq|<details/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('dice-core.js') < 0 || html.indexOf('dice-core.js') > html.indexOf('dice.js"')) bad(`${tag} dice-core.js 가 dice.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://dice.example.com/</loc>') || !sm.includes('<loc>https://dice.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지, 기록 이벤트, 난수
  const js = fs.readFileSync(path.join(SITE, 'dice.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('dice.js 에 언어 문구가 있음 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("dice.js: track('start') 는 굴리기 1곳, track('done') 은 결과 1곳");
  if (/Math\.random/.test(js)) bad('dice.js 가 Math.random 을 씀 (crypto 만)');
  if (/localStorage|sessionStorage|indexedDB/.test(js)) bad('dice.js 가 기록을 저장함 (메모리에만)');
  if (!/prefers-reduced-motion/.test(js)) bad('dice.js: 움직임 줄이기(prefers-reduced-motion) 처리 없음');
  const core = fs.readFileSync(path.join(SITE, 'dice-core.js'), 'utf8');
  if (!/getRandomValues/.test(core) || /Math\.random/.test(core)) bad('dice-core.js 는 crypto.getRandomValues 만 써야 함');
  return pages;
}

// ---------------------------------------------------------------- 4) OG · 등록
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
function checkApp() {
  if (APP.id !== 'dice' || APP.category !== 'vote' || APP.path !== 'https://dice.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added) || APP.emoji !== '🎲') bad('app.config.js id/emoji/category/path/added');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 140) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (len(APP.title[code]) > 22) bad(`app.config.js ${code} 포털 이름이 김 (${len(APP.title[code])}자)`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkLogic();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n주사위 로직·거부 샘플링·공정성(종류별 카이제곱) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 주사위 로직·공정성(crypto, d4~d20), 언어 파일 12개(키·자리표시자·FAQ·제목·360px 문구·번역), 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·기록 안 끝 화면), OG 이미지 모두 OK');
