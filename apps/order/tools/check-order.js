#!/usr/bin/env node
/**
 * 순서 정하기 검사 (cwd = apps/order 에서 실행하거나 tools/check-all.js 가 부른다).
 *   1) 등록 정보(app.config.js): id·카테고리 vote·12개 언어 제목/설명·경로 자리표시자
 *   2) 로직(order-core.js): 이름 정리·검사, 섞기 결과가 입력의 순열, 공개 순서(1번부터/마지막부터),
 *      공정성 — 4명 순열 24가지 카이제곱 + 10명 자리별 균등(5σ) + 번호 모드, 거부 샘플링 경계
 *   3) 공유 링크(#r=): 왕복, 글자 정리(꺾쇠·제어 문자), 길이 제한(인코딩 null), 깨진/변조 값 거절(순열 아님·범위·타입·버전·길이)
 *   4) 언어 파일 12개: 키 구조가 en 과 같음, 번역 대기 표시 없음, 프리셋 4개, FAQ 3~5개, 개인정보 섹션 수 같음, 자리표시자 유지,
 *      360px 에 들어갈 짧은 버튼·칩 문구(표시 폭 한도)
 *   5) 생성된 HTML(언어 폴더·숨은 _l 변형): 입력 화면 맨 끝 요소가 mg-ad-start, 광고 자리 1개, 공개 화면 광고 없음,
 *      data-mg-end 1개, h1 1개, FAQPage 없음, MG_FAQ 3~5, hreflang 12 + x-default, lang 속성, 스크립트 순서, 변형 noindex, 사이트맵
 *   6) 앱 JS 가 사용자 글을 innerHTML 로 넣지 않음, 스크립트 문법(node --check), OG 이미지 12장
 * 실패가 있으면 종료 코드 1. 먼저 node tools/gen-i18n.js (두 번) 로 페이지를 만든다.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'order-core.js'));
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
ok(APP.id === 'order', 'app.config id 는 order');
ok(APP.category === 'vote', 'app.config category 는 vote');
ok(APP.added === '2026-11-15', 'app.config added 는 2026-11-15');
ok(APP.path === 'https://order.example.com/', 'app.config path 자리표시자');
LANGS.forEach((l) => {
  ok(!!(APP.title && APP.title[l]), `app.config title.${l} 있음`);
  ok(!!(APP.desc && APP.desc[l]), `app.config desc.${l} 있음`);
});

// ---------------------------------------------------------------- 2) 로직
ok(CORE.cleanNames('  민지 \n\n철수,영희\t<b>x</b>\n').join('|') === '민지|철수|영희|b x /b', '이름 정리: 빈 줄·쉼표·탭·꺾쇠');
ok(CORE.cleanNames('a'.repeat(50))[0].length === CORE.MAX_NAME, `이름은 ${CORE.MAX_NAME}자까지`);
ok(CORE.validate({ mode: 'names', names: 'a' }) === 'namesFew', '이름 1개는 거절');
ok(CORE.validate({ mode: 'names', names: 'a\nb' }) === null, '이름 2개는 통과');
ok(CORE.validate({ mode: 'names', names: Array.from({ length: 41 }, (_, i) => 'n' + i).join('\n') }) === 'namesMany', '이름 41개는 거절');
ok(CORE.validate({ mode: 'names', names: Array.from({ length: 40 }, (_, i) => 'n' + i).join('\n') }) === null, '이름 40개는 통과');
ok(CORE.validate({ mode: 'numbers', n: 1 }) === 'numbersRange', '번호 1개는 거절');
ok(CORE.validate({ mode: 'numbers', n: 41 }) === 'numbersRange', '번호 41개는 거절');
ok(CORE.validate({ mode: 'numbers', n: 40 }) === null, '번호 40개는 통과');

{
  const names = ['가', '나', '다', '라', '마', '바'];
  const r = CORE.makeOrder({ mode: 'names', names: names.join('\n'), preset: 2, from: 'last' });
  ok(r.items.length === 6 && r.items.slice().sort().join() === names.slice().sort().join(), '섞기 결과는 입력 이름의 순열');
  ok(r.preset === 2 && r.from === 'last' && r.mode === 'names', '판 정보(프리셋·방향·모드) 유지');
  const nr = CORE.makeOrder({ mode: 'numbers', n: 12, preset: 9 });
  ok(nr.items.slice().sort((a, b) => a - b).join() === CORE.numberList(12).join(), '번호 모드는 1..N 의 순열');
  ok(nr.preset === 0 && nr.from === 'first', '범위 밖 프리셋은 0, 기본 방향은 first');
  let threw = false;
  try { CORE.makeOrder({ mode: 'names', names: 'x' }); } catch (e) { threw = true; }
  ok(threw, '검사에 걸리면 섞지 않고 예외');
}
ok(CORE.revealSequence(4, 'first').join() === '0,1,2,3', '1번부터 공개 순서');
ok(CORE.revealSequence(4, 'last').join() === '3,2,1,0', '마지막부터 공개 순서');
{
  // 거부 샘플링: limit 이상 값은 버린다
  const vals = [4294967295, 4294967293, 7]; // max 6 → limit 4294967292
  let i = 0;
  ok(CORE.uniformInt(6, () => vals[i++]) === 7 % 6 && i === 3, '거부 샘플링: 경계 밖 값을 버리고 다시 뽑음');
}

// 공정성 1: 4명 → 24가지 순열, 48000판 카이제곱 (자유도 23, 0.1% 임계값 49.7)
{
  const N = 48000;
  const counts = {};
  for (let t = 0; t < N; t++) {
    const k = CORE.shuffle(['a', 'b', 'c', 'd']).join('');
    counts[k] = (counts[k] || 0) + 1;
  }
  const keys = Object.keys(counts);
  const exp = N / 24;
  const chi = keys.reduce((s, k) => s + Math.pow(counts[k] - exp, 2) / exp, 0) + (24 - keys.length) * exp;
  ok(keys.length === 24, `4명 순열 24가지가 모두 나옴 (${keys.length})`);
  ok(chi < 49.7, `4명 순열 균등 (카이제곱 ${chi.toFixed(1)} < 49.7, df=23)`);
}
// 공정성 2: 10명, 30000판 — 각 사람이 각 자리에 올 횟수 ≈ 3000 (5σ 안)
{
  const N = 30000, n = 10;
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  const base = Array.from({ length: n }, (_, i) => i);
  for (let t = 0; t < N; t++) CORE.shuffle(base).forEach((who, pos) => { grid[who][pos]++; });
  const exp = N / n;
  const sd = Math.sqrt(N * (1 / n) * (1 - 1 / n));
  let maxDev = 0;
  grid.forEach((row) => row.forEach((c) => { maxDev = Math.max(maxDev, Math.abs(c - exp)); }));
  ok(maxDev < 5 * sd, `10명 자리별 균등 (최대 편차 ${maxDev.toFixed(0)} < 5σ ${(5 * sd).toFixed(0)})`);
  // 1번 자리 카이제곱 (df=9, 0.1% 임계값 27.9)
  const chi1 = grid.reduce((s, row) => s + Math.pow(row[0] - exp, 2) / exp, 0);
  ok(chi1 < 27.9, `10명 1번 자리 카이제곱 ${chi1.toFixed(1)} < 27.9`);
}
// 공정성 3: makeOrder 번호 모드(3개) 6가지 순열, 18000판 (df=5, 0.1% 임계값 20.5)
{
  const N = 18000;
  const counts = {};
  for (let t = 0; t < N; t++) {
    const k = CORE.makeOrder({ mode: 'numbers', n: 3 }).items.join('');
    counts[k] = (counts[k] || 0) + 1;
  }
  const exp = N / 6;
  const chi = Object.keys(counts).reduce((s, k) => s + Math.pow(counts[k] - exp, 2) / exp, 0);
  ok(Object.keys(counts).length === 6 && chi < 20.5, `번호 3개 순열 균등 (카이제곱 ${chi.toFixed(1)} < 20.5)`);
}

// ---------------------------------------------------------------- 3) 공유 링크
{
  const rec = { mode: 'names', items: ['민지 ☆', 'Émile', '철수 🎤', 'O\'Neil "Q"'], preset: 1 };
  const enc = CORE.encodeShare(rec);
  ok(/^[A-Za-z0-9_-]+$/.test(enc), '공유 값은 base64url 문자만');
  const dec = CORE.decodeShare(enc);
  ok(!!dec && dec.mode === 'names' && dec.items.join('|') === rec.items.join('|') && dec.preset === 1, '이름 공유 왕복');
  const nenc = CORE.encodeShare({ mode: 'numbers', items: [3, 1, 2], preset: 3 });
  const ndec = CORE.decodeShare(nenc);
  ok(!!ndec && ndec.mode === 'numbers' && ndec.items.join() === '3,1,2' && ndec.preset === 3, '번호 공유 왕복');
  const big = { mode: 'names', items: Array.from({ length: 40 }, (_, i) => '가나다라마바사아자차카타파하'.repeat(3).slice(0, 30) + i).map((s) => s.slice(0, 30)), preset: 0 };
  const benc = CORE.encodeShare(big);
  ok(benc === null || benc.length <= CORE.SHARE_MAX, '공유 값은 길이 한도 안 (아니면 null)');
  ok(CORE.encodeShare({ mode: 'names', items: Array.from({ length: 40 }, () => '😀'.repeat(30)) }) === null || true, '이모지 40×30 도 예외 없이 처리');

  const bad = (o) => CORE.b64urlEncode(JSON.stringify(o));
  const xss = CORE.decodeShare(bad({ v: 1, p: 0, o: ['<img src=x onerror=alert(1)>', 'b\u0000c\u2028d', '{x}`y`'] }));
  ok(!!xss && xss.items.every((s) => !/[<>{}`\u0000-\u001f\u2028]/.test(s)), '받은 이름의 꺾쇠·중괄호·백틱·제어 문자는 정리됨');
  ok(CORE.decodeShare('') === null, '빈 값 거절');
  ok(CORE.decodeShare('!!!') === null, 'base64url 이 아닌 값 거절');
  ok(CORE.decodeShare('a'.repeat(9000)) === null, '너무 긴 값 거절');
  ok(CORE.decodeShare(CORE.b64urlEncode('not json')) === null, 'JSON 이 아니면 거절');
  ok(CORE.decodeShare(bad([1, 2])) === null, '배열 최상위 거절');
  ok(CORE.decodeShare(bad({ v: 2, o: ['a', 'b'] })) === null, '버전이 다르면 거절');
  ok(CORE.decodeShare(bad({ v: 1, o: ['a'] })) === null, '이름 1개 거절');
  ok(CORE.decodeShare(bad({ v: 1, o: Array.from({ length: 41 }, (_, i) => 'n' + i) })) === null, '이름 41개 거절');
  ok(CORE.decodeShare(bad({ v: 1, o: ['a', 5] })) === null, '문자열이 아닌 이름 거절');
  ok(CORE.decodeShare(bad({ v: 1, o: ['a', '   '] })) === null, '빈 이름 거절');
  ok(CORE.decodeShare(bad({ v: 1, n: [1, 1, 2] })) === null, '중복 번호 거절');
  ok(CORE.decodeShare(bad({ v: 1, n: [1, 2, 4] })) === null, '범위 밖 번호 거절(순열 아님)');
  ok(CORE.decodeShare(bad({ v: 1, n: [1, 2.5] })) === null, '정수 아닌 번호 거절');
  ok(CORE.decodeShare(bad({ v: 1, n: [2, 1], o: ['a', 'b'] })) === null, '이름·번호가 함께 있으면 거절');
  ok(CORE.decodeShare(bad({ v: 1 })) === null, '내용 없으면 거절');
  const pr = CORE.decodeShare(bad({ v: 1, p: 99, o: ['a', 'b'] }));
  ok(!!pr && pr.preset === 0, '범위 밖 프리셋은 0');
}
{
  const st = CORE.cleanState({ mode: 'hack', names: 'a\nb', n: 999, preset: -1, from: 'x' });
  ok(st.mode === 'names' && st.n === 8 && st.preset === 0 && st.from === 'first' && st.names === 'a\nb', '저장 값 정리(범위 밖은 기본값)');
  ok(CORE.cleanState('garbage').mode === 'names', '깨진 저장 값은 기본값');
  ok(CORE.cleanState({ mode: 'numbers', n: 12, from: 'last', preset: 3 }).n === 12, '저장 값: 번호 모드 유지');
}

// ---------------------------------------------------------------- 4) 언어 파일
function keysOf(o, prefix, out) {
  if (Array.isArray(o)) { out.push(prefix + '[]'); return out; }
  if (o && typeof o === 'object') {
    Object.keys(o).sort().forEach((k) => keysOf(o[k], prefix ? prefix + '.' + k : k, out));
    return out;
  }
  out.push(prefix);
  return out;
}
// 표시 폭: 한중일 = 2, 태국 결합 문자 = 0, 그 밖 = 1
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const TH_MARK = /[ัิ-ฺ็-๎]/;
function units(s) { let u = 0; for (const ch of String(s)) u += WIDE.test(ch) ? 2 : TH_MARK.test(ch) ? 0 : 1; return u; }
const enKeys = keysOf(L10N.en, '', []).join('\n');
const PLACEHOLDERS = [['ui.namesCount', ['{n}', '{max}']], ['ui.numberItem', ['{n}']], ['reveal.progress', ['{k}', '{n}']], ['reveal.live', ['{k}', '{who}']], ['result.summary', ['{n}']], ['result.textTitle', ['{heading}']]];
const get = (o, p) => p.split('.').reduce((x, k) => (x ? x[k] : undefined), o);
LANGS.forEach((l) => {
  const T = L10N[l];
  const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', l + '.js'), 'utf8');
  ok(!/^\/\/\s*TODO-TRANSLATE/.test(src), `${l}: 번역 대기 표시가 없어야 함`);
  ok(keysOf(T, '', []).join('\n') === enKeys, `${l}: 키 구조가 en 과 같음`);
  ok(Array.isArray(T.presets) && T.presets.length === CORE.PRESETS && T.presets.every((p) => p.label && p.heading), `${l}: 프리셋 ${CORE.PRESETS}개(label·heading)`);
  ok(Array.isArray(T.faq) && T.faq.length >= 3 && T.faq.length <= 5, `${l}: FAQ 3~5개`);
  ok(T.privacy.sections.length === L10N.en.privacy.sections.length, `${l}: 개인정보 섹션 수가 en 과 같음`);
  PLACEHOLDERS.forEach(([p, need]) => {
    const v = get(T, p) || '';
    ok(need.every((x) => v.indexOf(x) >= 0), `${l}: ${p} 에 ${need.join(' ')} 유지`);
  });
  // 360px 에서 넘치지 않을 짧은 문구 (반쪽 버튼·칩·세그먼트)
  [['ui.modeNames', 16], ['ui.modeNumbers', 16], ['ui.fromFirst', 18], ['ui.fromLast', 18], ['reveal.auto', 18], ['reveal.autoStop', 18], ['reveal.showAll', 18]].forEach(([p, max]) => {
    ok(units(get(T, p)) <= max, `${l}: ${p} 표시 폭 ${units(get(T, p))} ≤ ${max} (360px 반쪽 버튼)`);
  });
  T.presets.forEach((p, i) => ok(units(p.label) <= 18, `${l}: 프리셋 ${i} 칩 폭 ${units(p.label)} ≤ 18`));
  ok(units(T.ui.shuffle) <= 30 && units(T.result.again) <= 30 && units(T.result.againShared) <= 34, `${l}: 큰 버튼 문구가 한 줄 안`);
  ok(!/<(?!br>|\/?em>)/i.test(T.hero.h1Html), `${l}: h1Html 은 <br>·<em> 만`);
});

// ---------------------------------------------------------------- 5) 생성된 HTML
const htmlFiles = [];
LANGS.forEach((l) => {
  const { dir } = G.LOCALES.find((x) => x.code === l);
  htmlFiles.push({ lang: l, file: dir ? path.join(SITE, dir, 'index.html') : path.join(SITE, 'index.html'), variant: false });
  htmlFiles.push({ lang: l, file: path.join(SITE, '_l', l, 'index.html'), variant: true });
});
htmlFiles.forEach(({ lang, file, variant }) => {
  const tag = `${lang}${variant ? '(_l)' : ''}`;
  if (!fs.existsSync(file)) { ok(false, `${tag}: 생성된 index.html 이 없음 (${file})`); return; }
  const html = fs.readFileSync(file, 'utf8');
  const T = L10N[lang];

  ok(new RegExp(`<html lang="${lang}"`).test(html), `${tag}: <html lang> 맞음`);
  ok((html.match(/<h1[\s>]/g) || []).length === 1, `${tag}: h1 한 개`);
  ok((html.match(/class="mg-ad mg-ad-start"/g) || []).length === 1, `${tag}: 첫 화면 광고 자리 정확히 1개`);
  ok((html.match(/class="mg-ad[ "]/g) || []).length === 1, `${tag}: 광고 자리 HTML 은 1개(끝 화면은 공통 컴포넌트)`);
  ok((html.match(/data-mg-end="order"/g) || []).length === 1, `${tag}: data-mg-end="order" 한 개`);
  ok(!/FAQPage/.test(html), `${tag}: FAQPage JSON-LD 없음`);
  ok(/"@type":\s*"WebApplication"/.test(html), `${tag}: WebApplication JSON-LD`);

  const inputHtml = (/<section id="screen-input"[\s\S]*?<\/section>/.exec(html) || [''])[0];
  ok(!!inputHtml, `${tag}: 입력 화면 section 있음`);
  ok(/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(inputHtml), `${tag}: mg-ad-start 는 입력 화면 맨 끝 요소`);
  ok(/id="shuffle-btn"/.test(inputHtml) && /id="names"/.test(inputHtml), `${tag}: 입력 화면에 이름 입력·섞기 버튼`);
  ok(T.faq.every((f) => inputHtml.indexOf(f.q) < 0), `${tag}: 입력 화면에 FAQ 없음`);
  const revealHtml = (/<section id="screen-reveal"[\s\S]*?<\/section>/.exec(html) || [''])[0];
  ok(!!revealHtml && !/mg-ad/.test(revealHtml), `${tag}: 공개 화면에 광고 없음`);
  const endHtml = (/<section id="screen-end"[\s\S]*?<\/section>/.exec(html) || [''])[0];
  ok(/data-mg-end="order"><\/div>\s*<\/section>$/.test(endHtml), `${tag}: 끝 화면은 결과 바로 아래 data-mg-end`);

  const faqMatch = /window\.MG_FAQ\s*=\s*(\[[\s\S]*?\]);?\s*<\/script>/.exec(html);
  let faqCount = 0;
  if (faqMatch) { try { faqCount = JSON.parse(faqMatch[1]).length; } catch (e) { faqCount = -1; } }
  ok(faqCount >= 3 && faqCount <= 5, `${tag}: MG_FAQ 3~5개 (실제 ${faqCount})`);

  ok((html.match(/hreflang="/g) || []).length >= 13, `${tag}: hreflang 12 + x-default`);
  ok(/<link rel="canonical" href="[^"]+"/.test(html), `${tag}: canonical 있음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js', 'order-core.js', 'order.js'].map((s) => html.indexOf(s + '"'));
  ok(order.every((x) => x > 0) && order.every((x, i) => i === 0 || x > order[i - 1]), `${tag}: 스크립트 순서 site.config → i18n → common → supa → core → app`);
  ok(html.indexOf(T.meta.title) > 0, `${tag}: <title> 에 현지 검색어 제목`);
  if (variant) ok(/noindex/.test(html), `${tag}: 숨은 변형은 noindex`);
});
{
  const sm = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
  ok((sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length === LANGS.length, `sitemap.xml 앱 URL ${LANGS.length}개`);
}

// ---------------------------------------------------------------- 6) 안전·문법·OG
{
  const js = fs.readFileSync(path.join(SITE, 'order.js'), 'utf8');
  const inner = js.match(/\.innerHTML\s*=\s*([^;]+);/g) || [];
  ok(inner.every((s) => /=\s*''/.test(s)), `order.js: innerHTML 은 비우기('')에만 사용 (${inner.length}곳)`);
  ok(!/insertAdjacentHTML|document\.write|eval\(/.test(js), 'order.js: insertAdjacentHTML·document.write·eval 없음');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon/.test(js), 'order.js: 이름을 서버로 보내는 코드 없음');
}
['order-core.js', 'order.js'].forEach((f) => {
  try { execFileSync(process.execPath, ['--check', path.join(SITE, f)], { stdio: 'pipe' }); ok(true, ''); }
  catch (e) { ok(false, `${f}: 문법 오류 ${String(e.stderr || e.message).split('\n').slice(0, 3).join(' ')}`); }
});
LANGS.forEach((l) => {
  const { dir } = G.LOCALES.find((x) => x.code === l);
  ok(fs.existsSync(path.join(SITE, 'og', dir || '', 'default.png')), `${l}: OG 이미지 있음`);
});
ok(fs.existsSync(path.join(SITE, 'favicon.svg')), 'favicon.svg 있음');
ok(fs.existsSync(path.join(SITE, 'shared', 'common.js')), 'shared 심볼릭 링크 동작');

// ---------------------------------------------------------------- 결과
console.log(`check-order: 통과 ${pass} · 실패 ${fails.length}`);
fails.forEach((m) => console.log('  ✗ ' + m));
if (fails.length) process.exit(1);
console.log('check-order: 모두 통과');
