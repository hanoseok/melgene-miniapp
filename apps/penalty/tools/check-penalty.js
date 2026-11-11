#!/usr/bin/env node
/**
 * 벌칙 카드 뒤집기 검사 (cwd = apps/penalty 에서 실행하거나 tools/check-all.js 가 부른다).
 *   1) 등록 정보(app.config.js): id·카테고리 vote·12개 언어 제목/설명·경로 자리표시자
 *   2) 로직(penalty-core.js): 기본 장수, 검사(validate), 배정 개수·벌칙 문구 중복 없음, 뒤집기 한 번만, 공정성(카이제곱 근사),
 *      #d= 링크 왕복·변조 거절, 저장 값 정리
 *   3) 언어 파일 12개: 키 구조가 en 과 같음, 번역 대기 표시 없음, 벌칙 문구 10개·30자 이내, FAQ 3~5개, 개인정보 섹션 수 같음
 *   4) 생성된 HTML(언어 폴더·숨은 _l 변형): 시작 화면 맨 끝 mg-ad-start 1개, 광고 자리 1개, 끝 화면 data-mg-end 1개, h1 1개,
 *      시작 화면에 벌칙 문구·FAQ 없음(스포일러), FAQPage JSON-LD 없음, hreflang 12개 + x-default, lang 속성
 *   5) 스크립트 문법(node --check), OG 이미지 12장 존재
 * 실패가 있으면 종료 코드 1. 먼저 node tools/gen-i18n.js (두 번) 로 페이지를 만든다.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'penalty-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

let pass = 0;
const fails = [];
function ok(cond, msg) {
  if (cond) pass++;
  else fails.push(msg);
}
const LANGS = G.LOCALES.map((l) => l.code);

// ---------------------------------------------------------------- 1) 등록 정보
ok(APP.id === 'penalty', 'app.config id 는 penalty');
ok(APP.category === 'vote', 'app.config category 는 vote');
ok(/^\d{4}-\d{2}-\d{2}$/.test(APP.added), 'app.config added 는 YYYY-MM-DD');
LANGS.forEach((l) => {
  ok(!!(APP.title && APP.title[l]), `app.config title.${l} 있음`);
  ok(!!(APP.desc && APP.desc[l]), `app.config desc.${l} 있음`);
});

// ---------------------------------------------------------------- 2) 로직
ok(CORE.autoPenalties(2) === 1, '기본 벌칙 장수: 2명 → 1장');
ok(CORE.autoPenalties(6) === 2, '기본 벌칙 장수: 6명 → 2장');
ok(CORE.autoPenalties(12) === 4, '기본 벌칙 장수: 12명 → 4장');
ok(CORE.autoPenalties(1) === 1, '기본 벌칙 장수: 1명(범위 밖) 이어도 최소 1');

ok(CORE.validate({ players: 1, penalties: 1, items: ['a'] }).indexOf('playersRange') >= 0, '인원 1명은 거절');
ok(CORE.validate({ players: 13, penalties: 1, items: ['a'] }).indexOf('playersRange') >= 0, '인원 13명은 거절');
ok(CORE.validate({ players: 4, penalties: 1, items: '   \n ' }).indexOf('itemsEmpty') >= 0, '빈 벌칙 문구는 거절');
ok(CORE.validate({ players: 4, penalties: 0, items: ['a'] }).indexOf('penaltiesRange') >= 0, '벌칙 0장은 거절');
ok(CORE.validate({ players: 4, penalties: 5, items: ['a'] }).indexOf('penaltiesRange') >= 0, '벌칙이 인원보다 많으면 거절');
ok(CORE.validate({ players: 2, penalties: 1, items: ['a'], names: 'a\nb\nc' }).indexOf('namesTooMany') >= 0, '이름이 인원보다 많으면 거절');
ok(CORE.validate({ players: 3, penalties: 1, items: ['a', 'b'], names: 'a\nb' }).length === 0, '이름이 적은 것은 허용');
ok(CORE.validate({ players: 3, penalties: 1, items: Array.from({ length: 31 }, (_, i) => 'x' + i) }).indexOf('itemsTooMany') >= 0, '31개 벌칙은 거절');

// 결정적 난수(검사용): 고정 시드 xorshift 로 randInt 주입
function seeded(seed) {
  let s = seed >>> 0 || 1;
  return function (max) {
    s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    return s % max;
  };
}

const items = ['노래', '건배', '애교', '물', '로봇', '자기소개', '음악', '농담', '예고편', '추측'];
{
  const r = seeded(42);
  const s = CORE.newSession({ players: 6, penalties: 2, items, randInt: r });
  ok(s.deck.length === 6, '6명이면 카드 6장');
  ok(s.deck.filter((x) => !!x).length === 2, '벌칙 2장 + 무사 4장');
  const texts = s.deck.filter((x) => !!x);
  ok(new Set(texts).size === texts.length, '벌칙 문구는 목록에서 중복 없이 뽑힘(목록이 충분할 때)');
  ok(texts.every((t) => items.indexOf(t) >= 0), '벌칙 문구는 모두 목록에 있음');
}
{
  // 목록이 벌칙보다 짧으면 섞은 목록을 되풀이
  const s = CORE.newSession({ players: 8, penalties: 5, items: ['a', 'b'], randInt: seeded(7) });
  ok(s.deck.filter((x) => !!x).length === 5, '목록이 짧아도 벌칙 5장을 채움');
}
{
  // 뒤집기: 한 번만, 순서·이름 대응
  const s = CORE.newSession({ players: 3, penalties: 1, items: ['벌'], names: '가\n나', randInt: seeded(3) });
  ok(s.names && s.names.length === 2, '이름이 2개만 있으면 names 배열 길이 2(나머지는 번호)');
  const a = CORE.flip(s, 0);
  ok(a && a.k === 1 && a.name === '가', '첫 번째 뒤집기는 1번째 이름');
  ok(CORE.flip(s, 0) === null, '같은 카드를 두 번 뒤집을 수 없음');
  const b = CORE.flip(s, 2);
  ok(b && b.k === 2 && b.name === '나', '두 번째 뒤집기는 2번째 이름');
  const c = CORE.flip(s, 1);
  ok(c && c.k === 3 && c.name === null, '이름이 없으면 null(화면에서 번호 표시)');
  ok(CORE.isDone(s), '모두 뒤집으면 done');
  ok(CORE.results(s).length === 3, '결과는 뒤집은 수만큼');
}
{
  // 공정성: 6명·벌칙 2장, 위치별 벌칙 확률 ≈ 1/3. 20000판 중 위치 0 의 벌칙 횟수
  const trials = 20000;
  const r = CORE.cryptoInt;
  const hits = [0, 0, 0, 0, 0, 0];
  const txt = {};
  for (let t = 0; t < trials; t++) {
    const d = CORE.deal(6, 2, items, r);
    d.forEach((x, p) => { if (x) hits[p]++; if (x) txt[x] = (txt[x] || 0) + 1; });
  }
  const p = 2 / 6;
  const sd = Math.sqrt(trials * p * (1 - p));
  const maxDev = Math.max(...hits.map((h) => Math.abs(h - trials * p)));
  ok(maxDev < 5 * sd, `위치별 벌칙 확률 치우침 없음 (최대 편차 ${maxDev.toFixed(0)} < 5σ ${(5 * sd).toFixed(0)})`);
  // 문구 균등성: 벌칙 한 장 + 목록 10개 → 각 문구 1/10
  const counts = {};
  const N2 = 30000;
  for (let t = 0; t < N2; t++) {
    const d = CORE.deal(4, 1, items, r);
    const x = d.find((v) => !!v);
    counts[x] = (counts[x] || 0) + 1;
  }
  const exp = N2 / items.length;
  const sd2 = Math.sqrt(N2 * 0.1 * 0.9);
  const dev2 = Math.max(...items.map((it) => Math.abs((counts[it] || 0) - exp)));
  ok(dev2 < 5 * sd2, `벌칙 문구 선택 치우침 없음 (최대 편차 ${dev2.toFixed(0)} < 5σ ${(5 * sd2).toFixed(0)})`);
}
{
  // 공유 링크 왕복
  const rec = { n: 3, names: ['민지', '', '철수'], r: ['노래 한 곡 ☆ 🎤', null, '건배 "짧게" <b>'] };
  const enc = CORE.encodeShare(rec);
  ok(/^[A-Za-z0-9_-]+$/.test(enc), '공유 값은 base64url 문자만');
  const dec = CORE.decodeShare(enc);
  ok(!!dec && dec.n === 3, '공유 링크 왕복: 인원');
  ok(!!dec && dec.r[0] === '노래 한 곡 ☆ 🎤' && dec.r[1] === null, '공유 링크 왕복: 벌칙·무사');
  ok(!!dec && dec.names[0] === '민지' && dec.names[1] === null, '공유 링크 왕복: 이름(빈 칸 null)');
  ok(!!dec && dec.r[2] === '건배 "짧게" b', '꺾쇠는 정리되어 들어옴');
  ok(CORE.decodeShare('') === null, '빈 링크는 거절');
  ok(CORE.decodeShare('!!!') === null, '깨진 링크는 거절');
  const bad = (o) => CORE.b64urlEncode(JSON.stringify(o));
  ok(CORE.decodeShare(bad({ v: 1, n: 3, r: [0, 0] })) === null, '길이가 맞지 않는 링크는 거절');
  ok(CORE.decodeShare(bad({ v: 1, n: 3, r: [0, 0, 0] })) === null, '벌칙이 하나도 없는 링크는 거절');
  ok(CORE.decodeShare(bad({ v: 1, n: 1, r: ['x'] })) === null, '인원 1명 링크는 거절');
  ok(CORE.decodeShare(bad({ v: 2, n: 2, r: ['x', 0] })) === null, '버전이 다르면 거절');
  ok(CORE.decodeShare(bad({ v: 1, n: 2, r: [{}, 0] })) === null, '문자열이 아닌 벌칙은 거절');
}
{
  const st = CORE.cleanState({ players: 99, penalties: 9, names: 'a', items: ['  노래  ', '', '<script>'] });
  ok(st.players === 6, '저장 값: 범위 밖 인원은 기본값');
  ok(st.penalties === null, '저장 값: 범위 밖 벌칙 장수는 자동');
  ok(st.items.length === 2 && st.items[0] === '노래', '저장 값: 문구 정리(빈 줄 제외·공백 정리)');
  ok(CORE.cleanState('garbage').players === 6, '저장 값이 깨졌으면 기본값');
}

// ---------------------------------------------------------------- 3) 언어 파일
function keysOf(o, prefix, out) {
  if (Array.isArray(o)) { out.push(prefix + '[]'); return out; }
  if (o && typeof o === 'object') {
    Object.keys(o).sort().forEach((k) => keysOf(o[k], prefix ? prefix + '.' + k : k, out));
    return out;
  }
  out.push(prefix);
  return out;
}
const enKeys = keysOf(L10N.en, '', []).join('\n');
LANGS.forEach((l) => {
  const T = L10N[l];
  const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', l + '.js'), 'utf8');
  ok(!/^\/\/\s*TODO-TRANSLATE/.test(src), `${l}: 번역 대기 표시가 없어야 함`);
  ok(keysOf(T, '', []).join('\n') === enKeys, `${l}: 키 구조가 en 과 같음`);
  ok(Array.isArray(T.defaults) && T.defaults.length >= 6 && T.defaults.length <= 12, `${l}: 기본 벌칙 6~12개`);
  T.defaults.forEach((d, i) => {
    ok(String(d).length <= CORE.MAX_ITEM_LEN, `${l}: 기본 벌칙 ${i + 1} 이 ${CORE.MAX_ITEM_LEN}자 이내`);
  });
  ok(Array.isArray(T.faq) && T.faq.length >= 3 && T.faq.length <= 5, `${l}: FAQ 3~5개`);
  ok(T.privacy.sections.length === L10N.en.privacy.sections.length, `${l}: 개인정보 섹션 수가 en 과 같음`);
  ok(/\{k\}/.test(T.result.safeList) === false, `${l}: 무사 목록 문구는 {names} 를 쓴다`);
  ok(T.ui.begin && T.ui.setupTitle, `${l}: begin/setupTitle 있음`);
  ok(!/벌칙 예시|\bTODO\b/.test(JSON.stringify(T.faq)), `${l}: FAQ 에 대기 표시 없음`);
});
// 벌칙 문구의 예시 모음이 시작 화면과 섞이지 않도록: 기본 목록은 설정 화면에만 쓴다(생성기 검사에서 확인)

// ---------------------------------------------------------------- 4) 생성된 HTML
const htmlFiles = [];
LANGS.forEach((l) => {
  const { dir } = G.LOCALES.find((x) => x.code === l);
  const folder = dir ? path.join(SITE, dir, 'index.html') : path.join(SITE, 'index.html');
  const variant = path.join(SITE, '_l', l, 'index.html');
  htmlFiles.push({ lang: l, file: folder, variant: false });
  htmlFiles.push({ lang: l, file: variant, variant: true });
});

htmlFiles.forEach(({ lang, file, variant }) => {
  const tag = `${lang}${variant ? '(_l)' : ''}`;
  if (!fs.existsSync(file)) { ok(false, `${tag}: 생성된 index.html 이 없음 (${file})`); return; }
  const html = fs.readFileSync(file, 'utf8');
  const T = L10N[lang];

  ok(new RegExp(`<html lang="${lang}"`).test(html), `${tag}: <html lang> 맞음`);
  ok((html.match(/<h1[\s>]/g) || []).length === 1, `${tag}: h1 한 개`);
  ok((html.match(/class="mg-ad mg-ad-start"/g) || []).length === 1, `${tag}: 시작 화면 광고 자리 정확히 1개`);
  ok((html.match(/class="mg-ad[ "]/g) || []).length === 1, `${tag}: 광고 자리 HTML 은 1개(끝 화면은 공통 컴포넌트가 JS 로 넣는다)`);
  ok((html.match(/data-mg-end="penalty"/g) || []).length === 1, `${tag}: data-mg-end="penalty" 한 개`);
  ok(!/FAQPage/.test(html), `${tag}: FAQPage JSON-LD 없음`);

  // 시작 화면 = 맨 끝 광고가 시작 화면의 마지막 요소
  const startMatch = /<section id="screen-start"[\s\S]*?<\/section>/.exec(html);
  const startHtml = startMatch ? startMatch[0] : '';
  ok(!!startMatch, `${tag}: 시작 화면 section 있음`);
  ok(/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(startHtml), `${tag}: mg-ad-start 는 시작 화면 맨 끝 요소`);
  // 스포일러: 시작 화면에 벌칙 문구·FAQ 질문이 없어야 함
  const leaked = T.defaults.filter((d) => startHtml.indexOf(d) >= 0);
  ok(leaked.length === 0, `${tag}: 시작 화면에 벌칙 문구를 보여 주지 않음 (${leaked.length})`);
  const faqLeak = T.faq.filter((f) => startHtml.indexOf(f.q) >= 0);
  ok(faqLeak.length === 0, `${tag}: 시작 화면에 FAQ 없음`);

  // FAQ 는 MG_FAQ 로 한 번, 3~5개
  const faqMatch = /window\.MG_FAQ\s*=\s*(\[[\s\S]*?\]);?\s*<\/script>|<script[^>]*>\s*window\.MG_FAQ\s*=\s*(\[[\s\S]*?\]);/.exec(html);
  const faqText = faqMatch ? (faqMatch[1] || faqMatch[2]) : null;
  let faqCount = 0;
  if (faqText) { try { faqCount = JSON.parse(faqText).length; } catch (e) { faqCount = -1; } }
  ok(faqCount >= 3 && faqCount <= 5, `${tag}: FAQ 3~5개 (실제 ${faqCount})`);

  ok((html.match(/hreflang="/g) || []).length >= 13, `${tag}: hreflang 12 + x-default`);
  ok(/<link rel="canonical" href="[^"]+"/.test(html), `${tag}: canonical 있음`);
  ok(/href="[^"]*penalty-core\.js"|src="[^"]*penalty-core\.js"/.test(html), `${tag}: penalty-core.js 로드`);
  ok(/src="[^"]*penalty\.js"/.test(html), `${tag}: penalty.js 로드`);
  ok(/<script src="[^"]*shared\/common\.js"><\/script>/.test(html), `${tag}: 공통 common.js 로드`);
  if (variant) ok(/noindex/.test(html), `${tag}: 숨은 변형은 noindex`);
});

// ---------------------------------------------------------------- 5) 스크립트 문법·OG
['penalty-core.js', 'penalty.js'].forEach((f) => {
  try { execFileSync(process.execPath, ['--check', path.join(SITE, f)], { stdio: 'pipe' }); ok(true, ''); }
  catch (e) { ok(false, `${f}: 문법 오류 ${String(e.stderr || e.message).split('\n').slice(0, 3).join(' ')}`); }
});
LANGS.forEach((l) => {
  const { dir } = G.LOCALES.find((x) => x.code === l);
  const og = path.join(SITE, 'og', dir ? dir : '', 'default.png');
  ok(fs.existsSync(og), `${l}: OG 이미지 있음 (${path.relative(SITE, og)})`);
});
ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg 있음');
ok(fs.existsSync(path.join(SITE, 'shared', 'common.js')), 'shared 심볼릭 링크 동작');

// ---------------------------------------------------------------- 결과
console.log(`check-penalty: 통과 ${pass} · 실패 ${fails.length}`);
fails.forEach((m) => console.log('  ✗ ' + m));
if (fails.length) process.exit(1);
console.log('check-penalty: 모두 통과');
