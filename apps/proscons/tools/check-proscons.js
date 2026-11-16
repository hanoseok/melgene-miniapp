#!/usr/bin/env node
/**
 * 장단점 저울 검사 (cwd = apps/proscons 에서 실행하거나 tools/check-all.js 가 부른다).
 *   1) 등록 정보(app.config.js): id·카테고리 vote·added·order·12개 언어 제목/설명·경로 자리표시자
 *   2) 로직(proscons-core.js): 글 정리(제어 문자·꺾쇠·60자), 무게 1..3, 목록 12개 한도, 점수(할까 말까 / A냐 B냐 — A 단점은 B 쪽),
 *      판정(빈 저울·동점·이긴 쪽·점수 차이·%), 기울기(부호·최대각·작은 합 완화), 부드럽게 따라가기, 저울대 끝, 무거운 이유 3개,
 *      동전(거부 샘플링 경계, 0/1 균등)
 *   3) 공유 링크(#d=): 왕복, 글자 정리, 길이 한도(인코딩 null), 깨진/변조 값 거절(버전·모드·목록 키·무게·타입·개수·빈 글·빈 저울)
 *   4) 언어 파일 12개: 키 구조가 en 과 같음, 번역 대기 표시 없음, 칩 8개, FAQ 3~5개, 개인정보 섹션 수 같음, 자리표시자 유지,
 *      fr 의 ? ! : 앞 좁은 줄바꿈 없는 공백, 360px 에 들어갈 짧은 버튼·칩 문구(표시 폭 한도)
 *   5) 생성된 HTML(언어 폴더·숨은 _l 변형): 시작 화면 맨 끝 요소가 mg-ad-start, 광고 자리 1개, 저울판 광고 없음,
 *      data-mg-end 1개, h1 1개, FAQPage 없음, MG_FAQ 3~5, hreflang 12 + x-default, lang 속성, 스크립트 순서, 변형 noindex, 사이트맵
 *   6) 앱 JS 가 사용자 글을 innerHTML 로 넣지 않음, 서버로 보내지 않음, 스크립트 문법(node --check), OG 이미지 12장
 * 실패가 있으면 종료 코드 1. 먼저 node tools/gen-i18n.js (두 번) 로 페이지를 만든다.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'proscons-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

let pass = 0;
const fails = [];
function ok(cond, msg) {
  if (cond) pass++;
  else fails.push(msg);
}
const LANGS = G.LOCALES.map((l) => l.code);
const near = (a, b, eps) => Math.abs(a - b) < (eps || 1e-6);

// ---------------------------------------------------------------- 1) 등록 정보
ok(APP.id === 'proscons', 'app.config id 는 proscons');
ok(APP.emoji === '⚖️', 'app.config emoji ⚖️');
ok(APP.category === 'vote', 'app.config category 는 vote');
ok(APP.added === '2026-11-17' && APP.order === 2, 'app.config added 2026-11-17, order 2');
ok(APP.path === 'https://proscons.example.com/', 'app.config path 자리표시자');
LANGS.forEach((l) => {
  ok(!!(APP.title && APP.title[l]), `app.config title.${l} 있음`);
  ok(!!(APP.desc && APP.desc[l]), `app.config desc.${l} 있음`);
});

// ---------------------------------------------------------------- 2) 로직
ok(CORE.cleanText('  a\u0000b\u2028c  <i>x</i> {y} `z`  ') === 'a b c i x /i y z', '글 정리: 제어 문자·꺾쇠·중괄호·백틱·공백');
ok(Array.from(CORE.cleanText('가'.repeat(80))).length === CORE.MAX_TEXT, `항목 글은 ${CORE.MAX_TEXT}자까지`);
ok(Array.from(CORE.cleanText('😀'.repeat(70))).length === CORE.MAX_TEXT, '이모지도 글자 단위로 자름');
ok(CORE.cleanWeight(0) === 1 && CORE.cleanWeight(9) === 3 && CORE.cleanWeight('x') === 2 && CORE.cleanWeight(2.4) === 2, '무게는 1..3 (틀리면 2)');
ok(CORE.listKeys('s').join() === 'p,c' && CORE.listKeys('ab').join() === 'ap,ac,bp,bc' && CORE.listKeys('zz').join() === 'p,c', '모드별 목록 키');

{
  const st = CORE.cleanState(null);
  ok(st.m === 's' && st.q === '' && Object.keys(st.l).length === 6 && CORE.countItems(st) === 0, '빈 상태');
  ok(CORE.addItem(st, 'p', '   ') === 'empty', '빈 글은 추가 안 됨');
  ok(CORE.addItem(st, 'zz', 'x') === 'badList', '모르는 목록 거절');
  for (let i = 0; i < CORE.MAX_ITEMS; i++) CORE.addItem(st, 'p', 'pro ' + i);
  ok(st.l.p.length === 12 && CORE.addItem(st, 'p', 'one more') === 'full', '목록 하나에 12개까지');
  ok(st.l.p.every((it) => it[0] === CORE.W_DEFAULT), `새 항목 기본 무게 ${CORE.W_DEFAULT}`);
  const cs = CORE.cleanState({ m: 'ab', q: 'Q'.repeat(200), a: 'A'.repeat(50), b: 'B', l: { ap: [[5, 'x'], { w: 0, t: 'y' }, [2, '  '], 'bad', [1, '<z>']], zz: [[1, 'no']] } });
  ok(cs.m === 'ab' && cs.q.length === CORE.MAX_Q && cs.a.length === CORE.MAX_NAME, '저장 값: 질문·이름 길이 자름');
  ok(JSON.stringify(cs.l.ap) === JSON.stringify([[3, 'x'], [1, 'y'], [1, 'z']]), '저장 값: 항목 정리(무게 자름, 빈 글·틀린 모양 버림, 꺾쇠 정리)');
  ok(!cs.l.zz, '저장 값: 모르는 목록 무시');
  ok(CORE.cleanState('garbage').m === 's' && CORE.cleanState([1]).m === 's', '깨진 저장 값은 빈 상태');
}

// 점수·판정
{
  const s = CORE.cleanState({ m: 's', l: { p: [[3, 'a'], [2, 'b']], c: [[1, 'c']] } });
  const sc = CORE.score(s);
  ok(sc.left === 5 && sc.right === 1 && sc.total === 6 && sc.diff === 4, '할까 말까: 왼쪽 = 장점 합, 오른쪽 = 단점 합');
  const v = CORE.verdict(s);
  ok(v.kind === 'left' && v.margin === 4 && v.pct === 83, `판정: 장점 4점 차, 83% (${v.pct})`);
  const v2 = CORE.verdict(CORE.cleanState({ l: { p: [[1, 'a']], c: [[3, 'b'], [3, 'c']] } }));
  ok(v2.kind === 'right' && v2.margin === 5 && v2.pct === 86, '판정: 단점 5점 차, 86%');
  const t = CORE.verdict(CORE.cleanState({ l: { p: [[2, 'a']], c: [[1, 'b'], [1, 'c']] } }));
  ok(t.kind === 'tie' && t.margin === 0 && t.pct === 50 && t.left === 2, '판정: 동점');
  ok(CORE.verdict(CORE.cleanState(null)).kind === 'empty', '판정: 빈 저울');
  // A냐 B냐: 왼쪽 = A 장점 + B 단점, 오른쪽 = B 장점 + A 단점
  const ab = CORE.cleanState({ m: 'ab', l: { ap: [[3, 'a1']], ac: [[2, 'a2']], bp: [[1, 'b1']], bc: [[1, 'b2'], [1, 'b3']], p: [[3, 'ignored']] } });
  const sab = CORE.score(ab);
  ok(sab.left === 5 && sab.right === 3, `A냐 B냐: A 단점은 B 쪽, B 단점은 A 쪽 (${sab.left}:${sab.right})`);
  ok(sab.diff === (3 - 2) - (1 - 2), 'A냐 B냐: 차이 = (A 장점 − A 단점) − (B 장점 − B 단점)');
  ok(CORE.countItems(ab) === 5, 'A냐 B냐: 다른 모드 목록은 세지 않음');
  const top = CORE.topReasons(ab, 'left', 3);
  ok(top.length === 3 && top[0].key === 'ap' && top[0].w === 3 && top[1].t === 'b2' && top[2].t === 'b3', '무거운 이유: 무게 순, 같으면 넣은 순, 접시에 실린 목록에서');
  const many = CORE.cleanState({ l: { p: [[1, 'a'], [3, 'b'], [2, 'c'], [3, 'd'], [1, 'e']] } });
  ok(CORE.topReasons(many, 'left').map((r) => r.t).join('') === 'bdc', '무거운 이유 3개만');
  ok(CORE.topReasons(many, 'right').length === 0, '빈 쪽은 이유 없음');
}

// 기울기·움직임
{
  ok(CORE.tiltAngle(0, 0) === 0 && CORE.tiltAngle(5, 5) === 0, '같으면 수평');
  ok(CORE.tiltAngle(0, 3) > 0 && CORE.tiltAngle(3, 0) < 0, '오른쪽이 무거우면 +, 왼쪽이면 −');
  ok(near(CORE.tiltAngle(0, 3), CORE.MAX_ANGLE * 3 / 6, 0.01), '무게 합이 작으면 덜 기움(분모 하한 6)');
  ok(CORE.tiltAngle(0, 36) === CORE.MAX_ANGLE && CORE.tiltAngle(36, 0) === -CORE.MAX_ANGLE, `최대 ±${CORE.MAX_ANGLE}도`);
  ok(Math.abs(CORE.tiltAngle(30, 1000)) <= CORE.MAX_ANGLE && CORE.tiltAngle(-5, 'x') === 0, '각도는 언제나 범위 안, 이상한 값은 0');
  let a = 0;
  for (let i = 0; i < 200; i++) a = CORE.easeStep(a, 12, 16, 170);
  ok(a === 12, '부드럽게 따라가면 결국 목표 각도에 멈춤');
  const one = CORE.easeStep(0, 10, 16, 170);
  ok(one > 0 && one < 10, '한 걸음은 목표 쪽으로 조금');
  ok(CORE.easeStep(3, -4, 100000) === -4, '오래 지나면 바로 목표');
  const e = CORE.beamEnds(0, 160, 48, 120);
  ok(near(e.lx, 40) && near(e.rx, 280) && near(e.ly, 48) && near(e.ry, 48), '수평 저울대 끝 = (40,48) (280,48)');
  const e2 = CORE.beamEnds(10, 160, 48, 120);
  ok(e2.ry > 48 && e2.ly < 48 && near(Math.hypot(e2.rx - 160, e2.ry - 48), 120), '+ 각도면 오른쪽 끝이 내려가고 팔 길이 유지');
}

// 동전
{
  ok(CORE.coinFlip(() => 7) === 1 && CORE.coinFlip(() => 4294967294) === 0, '동전: 주입한 난수로 0/1');
  const vals = [4294967295, 7];
  let i = 0;
  ok(CORE.uniformInt(3, () => vals[i++]) === 1 && i === 2, '거부 샘플링: 경계 밖 값을 버리고 다시 뽑음');
  let heads = 0;
  const N = 20000;
  for (let k = 0; k < N; k++) heads += CORE.coinFlip();
  const z = Math.abs(heads - N / 2) / Math.sqrt(N / 4);
  ok(z < 5, `동전 0/1 균등 (z=${z.toFixed(2)} < 5)`);
}

// ---------------------------------------------------------------- 3) 공유 링크
{
  const st = CORE.cleanState({ m: 'ab', q: '이사 갈까? 🏠', a: 'Seoul', b: '東京', l: { ap: [[3, 'Émile’s café ☕']], ac: [[1, 'far']], bp: [[2, 'новый']], bc: [], p: [[3, 'other mode']] } });
  const enc = CORE.encodeShare(st);
  ok(/^[A-Za-z0-9_-]+$/.test(enc), '공유 값은 base64url 문자만');
  const dec = CORE.decodeShare(enc);
  ok(!!dec && dec.m === 'ab' && dec.q === st.q && dec.a === 'Seoul' && dec.b === '東京', '공유 왕복: 모드·질문·이름');
  ok(!!dec && JSON.stringify(dec.l.ap) === JSON.stringify(st.l.ap) && dec.l.bp[0][1] === 'новый' && dec.l.p.length === 0, '공유 왕복: 지금 모드 목록만, 글·무게 그대로');
  ok(JSON.parse(CORE.b64urlDecode(enc)).l.p === undefined, '공유 값에 다른 모드 목록을 담지 않음');
  const s1 = CORE.decodeShare(CORE.encodeShare(CORE.cleanState({ l: { c: [[2, 'x']] } })));
  ok(!!s1 && s1.m === 's' && s1.q === '' && s1.l.c.length === 1, '공유 왕복: 질문 없는 할까 말까');
  const full = CORE.cleanState({ m: 'ab', q: '가'.repeat(80), a: '가'.repeat(24), b: '나'.repeat(24), l: { ap: Array.from({ length: 12 }, () => [3, '가'.repeat(60)]), ac: Array.from({ length: 12 }, () => [3, '나'.repeat(60)]), bp: Array.from({ length: 12 }, () => [3, '다'.repeat(60)]), bc: Array.from({ length: 12 }, () => [3, '라'.repeat(60)]) } });
  ok(CORE.encodeShare(full) === null, '공유 값이 너무 길면 null(페이지 주소만 복사)');
  const mid = CORE.cleanState({ l: { p: Array.from({ length: 12 }, () => [3, '가'.repeat(60)]), c: Array.from({ length: 12 }, () => [1, 'b'.repeat(60)]) } });
  const menc = CORE.encodeShare(mid);
  ok(!!menc && menc.length <= CORE.SHARE_MAX && !!CORE.decodeShare(menc), '한쪽 12개 × 한글 60자도 링크에 담김');

  const bad = (o) => CORE.b64urlEncode(JSON.stringify(o));
  const xss = CORE.decodeShare(bad({ v: 1, m: 's', q: '<img src=x onerror=alert(1)>', l: { p: [[2, '<script>x</script>\u0000\u2028']] } }));
  ok(!!xss && !/[<>{}`\u0000-\u001f\u2028]/.test(xss.q + xss.l.p[0][1]), '받은 글의 꺾쇠·제어 문자는 정리됨');
  ok(CORE.decodeShare('') === null, '빈 값 거절');
  ok(CORE.decodeShare('!!!') === null, 'base64url 이 아닌 값 거절');
  ok(CORE.decodeShare('a'.repeat(13000)) === null, '너무 긴 값 거절');
  ok(CORE.decodeShare(CORE.b64urlEncode('not json')) === null, 'JSON 이 아니면 거절');
  ok(CORE.decodeShare(bad([1, 2])) === null, '배열 최상위 거절');
  ok(CORE.decodeShare(bad({ v: 2, m: 's', l: { p: [[1, 'a']] } })) === null, '버전이 다르면 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 'x', l: { p: [[1, 'a']] } })) === null, '모르는 모드 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { ap: [[1, 'a']] } })) === null, '모드에 없는 목록 키 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: [[4, 'a']] } })) === null, '무게 4 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: [[1.5, 'a']] } })) === null, '정수 아닌 무게 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: [['2', 'a']] } })) === null, '문자열 무게 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: [[1, 5]] } })) === null, '문자열 아닌 글 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: [[1, '   ']] } })) === null, '빈 글 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: [[1, 'a', 'x']] } })) === null, '항목 모양이 틀리면 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: { p: Array.from({ length: 13 }, () => [1, 'a']) } })) === null, '13개 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: {} })) === null, '항목이 없으면 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', q: 5, l: { p: [[1, 'a']] } })) === null, '문자열 아닌 질문 거절');
  ok(CORE.decodeShare(bad({ v: 1, m: 's', l: [[1, 'a']] })) === null, '목록이 객체가 아니면 거절');
  const s2 = CORE.decodeShare(bad({ v: 1, m: 's', a: 'A', l: { p: [[1, 'a']] } }));
  ok(!!s2 && s2.a === '', '할까 말까 모드에서는 A/B 이름을 버림');
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
const PLACEHOLDERS = [
  ['start.draftNote', ['{n}']], ['board.defaultAb', ['{a}', '{b}']], ['board.prosFor', ['{name}']], ['board.consFor', ['{name}']],
  ['board.addLabel', ['{list}']], ['board.chipFormat', ['{topic}']], ['board.weightLabel', ['{w}']], ['board.scaleLabel', ['{left}', '{right}']],
  ['result.verdictPros', ['{n}', '{pts}', '{pct}']], ['result.verdictCons', ['{n}', '{pts}', '{pct}']], ['result.verdictWin', ['{name}', '{n}', '{pts}', '{pct}']],
  ['result.tie', ['{left}', '{right}']], ['result.coinAb', ['{name}']], ['result.topFor', ['{name}']], ['result.tagPro', ['{name}']], ['result.tagCon', ['{name}']],
];
const get = (o, p) => p.split('.').reduce((x, k) => (x ? x[k] : undefined), o);
LANGS.forEach((l) => {
  const T = L10N[l];
  const src = fs.readFileSync(path.join(SITE, 'tools', 'i18n', l + '.js'), 'utf8');
  ok(!/^\/\/\s*TODO-TRANSLATE/.test(src), `${l}: 번역 대기 표시가 없어야 함`);
  ok(keysOf(T, '', []).join('\n') === enKeys, `${l}: 키 구조가 en 과 같음`);
  ok(Array.isArray(T.board.chips) && T.board.chips.length === 8 && T.board.chips.every((c) => c && units(c) <= 14), `${l}: 주제 칩 8개(짧은 낱말)`);
  ok(['one', 'few', 'many', 'other'].every((k) => !!T.pts[k]), `${l}: 점수 복수형 4개`);
  ok(Array.isArray(T.faq) && T.faq.length >= 3 && T.faq.length <= 5, `${l}: FAQ 3~5개`);
  ok(T.privacy.sections.length === L10N.en.privacy.sections.length, `${l}: 개인정보 섹션 수가 en 과 같음`);
  ok(T.meta.title.length > 0 && units(`${T.meta.title} | ${G.brandOf(l)}`) <= 70, `${l}: <title> 표시 폭 ≤ 70 (${units(`${T.meta.title} | ${G.brandOf(l)}`)})`);
  PLACEHOLDERS.forEach(([p, need]) => {
    const v = get(T, p) || '';
    ok(need.every((x) => v.indexOf(x) >= 0), `${l}: ${p} 에 ${need.join(' ')} 유지`);
  });
  // 360px 에서 넘치지 않을 짧은 문구 (반쪽 세그먼트·추가 버튼·큰 버튼)
  [['start.modeSingle', 18], ['start.modeAb', 18], ['board.add', 10], ['start.fresh', 18]].forEach(([p, max]) => {
    ok(units(get(T, p)) <= max, `${l}: ${p} 표시 폭 ${units(get(T, p))} ≤ ${max} (360px)`);
  });
  [['start.go', 30], ['board.weigh', 30], ['board.editCopy', 30], ['result.again', 30], ['result.againShared', 34], ['result.copyLink', 30], ['result.save', 30], ['result.edit', 30], ['result.flip', 30]].forEach(([p, max]) => {
    ok(units(get(T, p)) <= max, `${l}: ${p} 큰 버튼 문구가 한 줄 안 (${units(get(T, p))} ≤ ${max})`);
  });
  ok(!/<(?!br>|\/?em>)/i.test(T.hero.h1Html), `${l}: h1Html 은 <br>·<em> 만`);
  ok(T.meta.title.indexOf(T.hero.h1Kicker.split(/[ –—-]/)[0]) >= 0, `${l}: h1 머리말이 <title> 검색어와 이어짐`);
});
{
  // fr: ? ! : ; 앞에는 좁은 줄바꿈 없는 공백(U+202F) — 일반 공백·붙여 쓰기 금지 (URL·자리표시자 제외)
  const fr = [];
  (function walk(o) {
    if (typeof o === 'string') fr.push(o);
    else if (o && typeof o === 'object') Object.values(o).forEach(walk);
  })({ ...L10N.fr, fonts: null, privacy: { ...L10N.fr.privacy, sections: L10N.fr.privacy.sections.map((s) => s.map((x) => x.replace(/<a [^>]*>|https?:\/\/\S+/g, ''))) } });
  const badFr = fr.filter((s) => /[^ \s(][?!;]|[^ \s(]:(?!\/\/)|[  ][?!:;]/.test(s.replace(/\{\w+\}/g, 'X')));
  ok(badFr.length === 0, `fr: ? ! : ; 앞 좁은 공백 (${badFr.slice(0, 2).join(' / ')})`);
}

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
  ok((html.match(/class="mg-ad mg-ad-start"/g) || []).length === 1, `${tag}: 시작 화면 광고 자리 정확히 1개`);
  ok((html.match(/class="mg-ad[ "]/g) || []).length === 1, `${tag}: 광고 자리 HTML 은 1개(끝 화면은 공통 컴포넌트)`);
  ok((html.match(/data-mg-end="proscons"/g) || []).length === 1, `${tag}: data-mg-end="proscons" 한 개`);
  ok(!/FAQPage/.test(html), `${tag}: FAQPage JSON-LD 없음`);
  ok(/"@type":\s*"WebApplication"/.test(html), `${tag}: WebApplication JSON-LD`);

  const startHtml = (/<section id="screen-start"[\s\S]*?<\/section>/.exec(html) || [''])[0];
  ok(!!startHtml, `${tag}: 시작 화면 section 있음`);
  ok(/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(startHtml), `${tag}: mg-ad-start 는 시작 화면 맨 끝 요소`);
  ok(/id="go-btn"/.test(startHtml) && /id="q"/.test(startHtml) && /id="mode-ab"/.test(startHtml), `${tag}: 시작 화면에 고민 입력·모드·시작 버튼`);
  ok(T.faq.every((f) => startHtml.indexOf(G.esc(f.q)) < 0), `${tag}: 시작 화면에 FAQ 없음`);
  const boardHtml = (/<section id="screen-board"[\s\S]*?<\/section>/.exec(html) || [''])[0];
  ok(!!boardHtml && !/mg-ad/.test(boardHtml), `${tag}: 저울판에 광고 없음`);
  ok(/id="sc-beam"/.test(boardHtml) && /id="sc-pan-l"/.test(boardHtml) && /id="sc-pan-r"/.test(boardHtml), `${tag}: 저울 SVG(저울대·접시 2개)`);
  ok((boardHtml.match(/class="pc-chip"/g) || []).length === 8, `${tag}: 주제 칩 8개`);
  const endHtml = (/<section id="screen-end"[\s\S]*?<\/section>/.exec(html) || [''])[0];
  ok(/data-mg-end="proscons"><\/div>\s*<\/section>$/.test(endHtml), `${tag}: 끝 화면은 결과 바로 아래 data-mg-end`);

  const faqMatch = /window\.MG_FAQ\s*=\s*(\[[\s\S]*?\]);?\s*<\/script>/.exec(html);
  let faqCount = 0;
  if (faqMatch) { try { faqCount = JSON.parse(faqMatch[1]).length; } catch (e) { faqCount = -1; } }
  ok(faqCount >= 3 && faqCount <= 5, `${tag}: MG_FAQ 3~5개 (실제 ${faqCount})`);

  ok((html.match(/hreflang="/g) || []).length >= 13, `${tag}: hreflang 12 + x-default`);
  ok(/<link rel="canonical" href="[^"]+"/.test(html), `${tag}: canonical 있음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js', 'proscons-core.js', 'proscons.js'].map((s) => html.indexOf(s + '"'));
  ok(order.every((x) => x > 0) && order.every((x, i) => i === 0 || x > order[i - 1]), `${tag}: 스크립트 순서 site.config → i18n → common → supa → core → app`);
  ok(html.indexOf(G.esc(T.meta.title)) > 0, `${tag}: <title> 에 현지 검색어 제목`);
  if (variant) ok(/noindex/.test(html), `${tag}: 숨은 변형은 noindex`);
});
{
  const sm = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
  ok((sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length === LANGS.length, `sitemap.xml 앱 URL ${LANGS.length}개`);
}

// ---------------------------------------------------------------- 6) 안전·문법·OG
{
  const js = fs.readFileSync(path.join(SITE, 'proscons.js'), 'utf8');
  const inner = js.match(/\.innerHTML\s*=\s*([^;]+);/g) || [];
  ok(inner.every((s) => /=\s*''/.test(s)), `proscons.js: innerHTML 은 비우기('')에만 사용 (${inner.length}곳)`);
  ok(!/insertAdjacentHTML|outerHTML|document\.write|eval\(/.test(js), 'proscons.js: insertAdjacentHTML·outerHTML·document.write·eval 없음');
  ok(!/fetch\(|XMLHttpRequest|sendBeacon/.test(js), 'proscons.js: 글을 서버로 보내는 코드 없음');
  ok(/prefers-reduced-motion/.test(js) && /track\('start'\)/.test(js) && /track\('done'\)/.test(js), 'proscons.js: 움직임 줄이기 · track start/done');
  ok(/setShareData/.test(js) && /setRetry/.test(js), 'proscons.js: setShareData · setRetry 등록');
}
['proscons-core.js', 'proscons.js'].forEach((f) => {
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
console.log(`check-proscons: 통과 ${pass} · 실패 ${fails.length}`);
fails.forEach((m) => console.log('  ✗ ' + m));
if (fails.length) process.exit(1);
console.log('check-proscons: 모두 통과');
