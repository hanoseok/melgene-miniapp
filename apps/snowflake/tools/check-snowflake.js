#!/usr/bin/env node
/**
 * 눈꽃 만들기 검사 (cwd = apps/snowflake, check-all 이 자동으로 돌린다).
 *   1) 등록 정보(app.config.js): id·카테고리·12개 언어 제목·설명
 *   2) 로직(snowflake-core.js): 파라미터 검증, 같은 설정 = 같은 그림, #d= 왕복, 잘못된 값 거부
 *   3) 언어 파일 12개: 키 구조가 en 과 같고, 번역 대기 표시 없음, 선택지 개수, FAQ 3~5개, 질문에 무료 류 금지
 *   4) 생성 HTML 12개×2: 시작 화면 티징만 + 맨 아래 mg-ad-start 1개, 끝 화면 data-mg-end, FAQPage JSON-LD 없음
 *   5) 화면 동작(snowflake.js): track('start')·track('done'), 움직임 줄이기, 외부 이미지·서버 없음
 *   6) OG 이미지 12장(1200×630 PNG)
 * 실패하면 항목을 모두 보여 주고 exit 1.
 */
const fs = require('fs');
const path = require('path');

const SITE = path.join(__dirname, '..');
const REPO = path.join(SITE, '..', '..');
const G = require(path.join(REPO, 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'snowflake-core.js'));
const CONFIG = require(path.join(SITE, 'app.config.js'));

const problems = [];
const bad = (msg) => problems.push(msg);
const read = (p) => fs.readFileSync(p, 'utf8');
const LANGS = G.LOCALES.map((l) => l.code);

// ---------------------------------------------------------------- 1) 등록 정보
function checkConfig() {
  if (CONFIG.id !== 'snowflake') bad(`app.config.js id = ${CONFIG.id} (snowflake 여야 한다)`);
  if (CONFIG.category !== 'create') bad(`app.config.js category = ${CONFIG.category} (create 여야 한다)`);
  LANGS.forEach((c) => {
    if (!CONFIG.title || !CONFIG.title[c]) bad(`app.config.js title.${c} 없음`);
    if (!CONFIG.desc || !CONFIG.desc[c]) bad(`app.config.js desc.${c} 없음`);
  });
}

// ---------------------------------------------------------------- 2) 로직
function checkCore() {
  const p = { s: 123456, n: 4, c: 2, z: 1, h: 0, k: 0 };
  const a = JSON.stringify(CORE.armPrims(p));
  const b = JSON.stringify(CORE.armPrims({ ...p }));
  if (a !== b) bad('같은 설정인데 그림(가지 목록)이 다르다');
  if (JSON.stringify(CORE.armPrims({ ...p, s: 654321 })) === a) bad('시드가 달라도 그림이 같다');
  if (CORE.armPrims({ ...p, c: 3, n: 6, h: 3 }).length < CORE.armPrims(p).length) bad('복잡도가 높을수록 도형이 줄었다');
  const code = CORE.encode(p);
  if (!code || !CORE.same(CORE.decode(code), p)) bad('#d= 왕복(encode → decode) 실패');
  if (CORE.decode('!!!') !== null) bad('잘못된 문자열을 받아들였다');
  if (CORE.decode(code + 'A'.repeat(300)) !== null) bad('너무 긴 공유 값을 받아들였다');
  if (CORE.normalize({ ...p, n: 9 }) !== null) bad('가지 수 범위(2~6) 밖을 받아들였다');
  if (CORE.normalize({ ...p, k: 5 }) !== null) bad('색 번호 범위(0~4) 밖을 받아들였다');
  if (CORE.normalize({ ...p, s: 1.5 }) !== null) bad('정수가 아닌 시드를 받아들였다');
  if (CORE.PALETTES.length !== 5 || CORE.SHAPES.length !== 4) bad('색 5개·모양 4개가 아니다');
  if (CORE.sparkles(p.s).length !== 42) bad('배경 반짝이 개수 변경');
}

// ---------------------------------------------------------------- 3) 언어 파일
function shape(o, prefix = '') {
  const out = [];
  Object.keys(o || {}).sort().forEach((k) => {
    const v = o[k];
    const key = prefix + k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...shape(v, key + '.'));
    else out.push(key);
  });
  return out;
}
function checkLocales() {
  const en = require(path.join(SITE, 'tools', 'i18n', 'en.js'));
  const enKeys = shape(en).join('\n');
  LANGS.forEach((c) => {
    const file = path.join(SITE, 'tools', 'i18n', `${c}.js`);
    if (!fs.existsSync(file)) return bad(`언어 파일 없음: tools/i18n/${c}.js`);
    if (/^\/\/ TODO-TRANSLATE/.test(read(file))) bad(`tools/i18n/${c}.js 첫 줄이 TODO-TRANSLATE (번역을 넣고 줄을 지운다)`);
    const T = require(file);
    if (shape(T).join('\n') !== enKeys) bad(`tools/i18n/${c}.js 키 구조가 en 과 다르다`);
    if (!T.editor || T.editor.palettes.length !== 5) bad(`[${c}] 색 이름은 5개여야 한다`);
    if (!T.editor || Object.keys(T.editor.shapes).length !== 4) bad(`[${c}] 모양 이름은 4개여야 한다`);
    if (!T.editor || T.editor.levels.complexity.length !== 3 || T.editor.levels.size.length !== 3) bad(`[${c}] 단계 이름은 3개씩이어야 한다`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`[${c}] FAQ 는 3~5개`);
    (T.faq || []).forEach((f, i) => {
      if (/무료|free|gratis|kostenlos|gratuit|бесплатн|ฟรี|miễn phí|gratuito/i.test(f.q)) bad(`[${c}] FAQ ${i + 1} 질문이 무료 류 (금지)`);
    });
    if (T.result && !T.result.retryFriend) bad(`[${c}] 나도 만들기 문구 없음`);
    if (!T.privacy || T.privacy.sections.length < 5) bad(`[${c}] 개인정보처리방침 항목 부족`);
  });
}

// ---------------------------------------------------------------- 4) 생성 HTML
function checkHtml() {
  let n = 0;
  G.LOCALES.forEach(({ code }) => {
    const file = path.join(SITE, G.fileOf(code, 'index.html'));
    if (!fs.existsSync(file)) return bad(`생성 HTML 없음: ${G.fileOf(code, 'index.html')} (node tools/gen-i18n.js)`);
    const html = read(file);
    n++;
    if (!new RegExp(`<html lang="${code}">`).test(html)) bad(`${code}: <html lang> 이 틀리다`);
    if (!/<title>[^<]+<\/title>/.test(html)) bad(`${code}: <title> 없음`);
    if (!html.includes(`| ${G.brandOf(code)}</title>`)) bad(`${code}: 제목 끝에 브랜드(${G.brandOf(code)})가 없다`);
    if (!/<link rel="canonical"/.test(html)) bad(`${code}: canonical 없음`);
    if (/FAQPage/.test(html)) bad(`${code}: FAQPage JSON-LD 가 있다 (끝 화면에만 FAQ)`);
    const start = html.slice(html.indexOf('id="screen-start"'), html.indexOf('id="screen-edit"'));
    const ads = (start.match(/class="mg-ad mg-ad-start"/g) || []).length;
    if (ads !== 1) bad(`${code}: 시작 화면 mg-ad-start 가 ${ads}개 (1개여야 한다)`);
    if (!/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>/.test(start)) bad(`${code}: mg-ad-start 가 시작 화면 맨 끝이 아니다`);
    if (/<details|mg-end-faq|sf-faq|<ul|<ol/.test(start)) bad(`${code}: 시작 화면에 FAQ·목록이 있다 (티징만)`);
    if (!/data-mg-end="snowflake"/.test(html)) bad(`${code}: data-mg-end="snowflake" 없음`);
    if (!/src="[^"]*snowflake-core\.js"/.test(html) || !/src="[^"]*snowflake\.js"/.test(html)) bad(`${code}: 앱 스크립트 연결 없음`);
    if (!/id="flake-canvas"/.test(html) || !/id="end-canvas"/.test(html)) bad(`${code}: canvas 가 없다`);
    if (/TODO|undefined|\{\{/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) bad(`${code}: 빈 값 또는 TODO 가 페이지에 남았다`);
  });
  return n;
}

// ---------------------------------------------------------------- 5) 화면 동작
function checkJs() {
  const js = read(path.join(SITE, 'snowflake.js'));
  if (!/track\('start'\)/.test(js) || !/track\('done'\)/.test(js)) bad("snowflake.js: track('start') / track('done') 없음");
  if (!/REDUCED\.matches/.test(js) || !/prefers-reduced-motion/.test(js)) bad('snowflake.js: 움직임 줄이기(prefers-reduced-motion)를 보지 않음');
  if (/\.src\s*=|new Image\(|url\(|fetch\(|XMLHttpRequest|sendBeacon/.test(js + read(path.join(SITE, 'snowflake-core.js')))) bad('외부 자원·전송 코드가 있다 (눈꽃은 코드로만 그리고 서버로 보내지 않는다)');
  if (/supabase\.co|sb_publishable|service_role/i.test(js)) bad('snowflake.js 에 Supabase 값');
  if (!/setShareData/.test(js) || !/setRetry/.test(js)) bad('setShareData / setRetry 등록 없음');
}

// ---------------------------------------------------------------- 6) OG
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

checkConfig();
checkCore();
checkLocales();
const pages = checkHtml();
checkJs();
const ogs = checkOg();
console.log(`언어 ${LANGS.length}개 · 생성 HTML ${pages}개 · OG ${ogs}장 검사`);
if (problems.length) {
  problems.forEach((p) => console.error('  ✗ ' + p));
  console.error(`\n결과: 실패 — 문제 ${problems.length}건`);
  process.exit(1);
}
console.log('결과: 통과 — 등록 정보, 눈꽃 로직(같은 설정·#d=·범위), 언어 12개(키·대기 표시·선택지·FAQ), 생성 HTML(티징만·광고 1개·끝 화면·JSON-LD), 화면 동작, OG 이미지');
