#!/usr/bin/env node
/**
 * 랜덤 팀 나누기 검사.
 *   1) 로직(team-core.js): 이름 읽기(줄바꿈·쉼표·전각 구분자, 공백, 주장 표시 * ＊ ★, 60명·20자 제한),
 *      팀 수 범위(팀 수 2~20·사람 수 이하 / 팀당 인원 → ceil(n/인원), 20팀 이하),
 *      무작위 수천 판: 모든 사람이 정확히 한 번, 팀 수, 인원 차이 ≤ 1, 주장 고르게(팀당 ≤ ceil(L/k)), 동물 이름 중복 없음,
 *      공정성: 4명→2팀 세 가지 나눔이 각 1/3, 6명 중 첫 사람이 들어가는 팀이 고르게, 주장 모드에서도 치우침 없음, cryptoInt 범위·고르게,
 *      공유 인코딩: UTF-8(한글·태국어·키릴·이모지) 왕복, 잘못된 링크(중복·빠짐·범위 밖·버전·크기·쓰레기) 거부.
 *   2) 언어 파일 12개: en.js 와 키 구조가 같은지, // TODO-TRANSLATE 없음, 자리표시자, 팀 이름 20개(짧게), 예시 이름(20자 이하·구분자 없음),
 *      사람 수 복수형(Intl.PluralRules 범주 모두), FAQ 3~5개(공정성 언급, "무료인가요?" 류 금지), 한국어가 아닌 파일에 한글 없음,
 *      제목(= app.config 제목 포함)·설명 길이, fr 물음표 앞 좁은 공백, ru 키릴 글꼴.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title("검색어 | 브랜드") / h1 하나(검색어) / hreflang 12개 + x-default / canonical / og:image /
 *      타이틀 바 / appLd(vote) / FAQPage 없음 / Supabase 값 없음 / 시작 화면 티징(FAQ·입력 없음, 맨 끝 mg-ad-start 1개) / 그 밖 mg-ad 페이지 전체 1개 = 입력 화면 섞기 버튼 아래 /
 *      결과: 팀 카드(#teams) → data-mg-end="team" 순서, FAQ 는 MG_FAQ 로만, 스크립트 순서.
 *   4) sitemap.xml URL 수, OG 이미지(언어별 default.png) 1200×630 PNG, app.config.js.
 *
 * 실행: node tools/check-team.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const CORE = require(path.join(SITE, 'team-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);

const problems = [];
const bad = (m) => problems.push(m);
// 보이는 글자 수 (태국어 윗·아랫 기호는 세지 않는다)
const len = (s) => Array.from(String(s).replace(/[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/g, '')).length;

// 시드 난수 (검사용 재현) → randInt
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const seeded = (seed) => { const r = mulberry32(seed); return (max) => Math.floor(r() * max); };

// ---------------------------------------------------------------- 1) 로직
function checkParse() {
  const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`parseNames ${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
  const names = (t) => CORE.parseNames(t).people.map((p) => (p.leader ? '*' : '') + p.name);
  eq(names('Emma\nLiam\r\n\n  Olivia  '), ['Emma', 'Liam', 'Olivia'], '줄바꿈·공백');
  eq(names('a, b,c ,, d'), ['a', 'b', 'c', 'd'], '쉼표');
  eq(names('王伟，李娜、张敏；刘洋'), ['王伟', '李娜', '张敏', '刘洋'], '전각 구분자');
  eq(names('*Kim\nLee*\n＊佐藤\n★ Ana\n* \n**'), ['*Kim', '*Lee', '*佐藤', '*Ana'], '주장 표시');
  eq(names('Mary   Jane'), ['Mary Jane'], '안쪽 공백 하나로');
  const long = CORE.parseNames('가나다라마바사아자차카타파하가나다라마바사아자');
  if (len(long.people[0].name) !== CORE.MAX_LEN) bad(`이름 ${CORE.MAX_LEN}자 제한 안 됨 (${len(long.people[0].name)})`);
  const emoji = CORE.parseNames('👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦👩‍👩‍👧‍👦');
  if (!emoji.people.length || len(emoji.people[0].name) > CORE.MAX_LEN) bad('이모지 이름 자르기');
  const many = CORE.parseNames(Array.from({ length: 75 }, (_, i) => 'P' + i).join('\n'));
  if (many.people.length !== CORE.MAX_NAMES || many.dropped !== 15) bad(`60명 제한: ${many.people.length}명 / 버림 ${many.dropped}`);
  if (CORE.parseNames('').people.length || CORE.parseNames(' , \n ').people.length) bad('빈 입력인데 이름이 나옴');
  eq(CORE.toText(CORE.parseNames('*A\nB').people).split('\n'), ['*A', 'B'], 'toText');
}
function checkCounts() {
  for (let n = 2; n <= CORE.MAX_NAMES; n++) {
    const tr = CORE.teamRange(n);
    if (tr.min !== 2 || tr.max !== Math.min(20, n)) bad(`teamRange(${n}) = ${JSON.stringify(tr)}`);
    for (let v = -3; v <= 25; v++) {
      const k = CORE.teamCount(n, 'teams', v);
      if (k < 2 || k > tr.max) bad(`teamCount(${n}, teams, ${v}) = ${k}`);
    }
    const sr = CORE.sizeRange(n);
    if (sr.min > sr.max) bad(`sizeRange(${n}) 뒤집힘 ${JSON.stringify(sr)}`);
    for (let s = sr.min; s <= sr.max; s++) {
      const k = CORE.teamCount(n, 'size', s);
      if (k < 2 || k > 20 || k > n) bad(`teamCount(${n}, size, ${s}) = ${k}`);
      if (k !== Math.max(2, Math.ceil(n / s))) bad(`teamCount(${n}, size, ${s}) = ${k} ≠ max(2, ceil(n/size)) ${Math.ceil(n / s)}`);
      const sizes = CORE.sizesFor(n, k);
      if (sizes[0] > s) bad(`size 모드 ${n}명 인원 ${s}: 가장 큰 팀 ${sizes[0]}명이 인원보다 큼`);
    }
    for (let k = 2; k <= Math.min(20, n); k++) {
      const sz = CORE.sizesFor(n, k);
      if (sz.reduce((a, b) => a + b, 0) !== n || sz[0] - sz[sz.length - 1] > 1) bad(`sizesFor(${n}, ${k}) = ${sz}`);
    }
  }
  if (CORE.teamCount(1, 'teams', 2) !== 0 || CORE.teamCount(0, 'size', 2) !== 0) bad('사람이 2명 미만인데 팀 수가 0 이 아님');
}
function checkTeamsRandom() {
  let trials = 0;
  for (let i = 0; i < 6000; i++) {
    const ri = seeded(1000 + i);
    const n = 2 + ri(CORE.MAX_NAMES - 1);
    const k = 2 + ri(Math.min(20, n) - 1);
    const leaders = ri(2) === 1;
    const L = ri(Math.min(n, 25) + 1);
    const lead = new Set(CORE.shuffle([...Array(n).keys()], ri).slice(0, L));
    const people = Array.from({ length: n }, (_, j) => ({ name: 'P' + j, leader: lead.has(j) }));
    const r = CORE.makeTeams(people, k, leaders, ri);
    const tag = `n=${n} k=${k} L=${L} leaders=${leaders}`;
    if (!r) { bad(`${tag}: makeTeams 가 null`); continue; }
    trials++;
    if (r.teams.length !== k || r.animals.length !== k) bad(`${tag}: 팀 ${r.teams.length}개 / 이름 ${r.animals.length}개`);
    const flat = r.teams.flat();
    if (flat.length !== n || new Set(flat).size !== n || flat.some((x) => x < 0 || x >= n)) bad(`${tag}: 모든 사람이 한 번씩이 아님`);
    const sizes = r.teams.map((t) => t.length);
    if (Math.max(...sizes) - Math.min(...sizes) > 1) bad(`${tag}: 인원 차이 > 1 (${sizes})`);
    if (new Set(r.animals).size !== k || r.animals.some((a) => a < 0 || a >= CORE.TEAMS.length)) bad(`${tag}: 팀 이름 중복/범위`);
    if (leaders && L) {
      const per = r.teams.map((t) => t.filter((x) => people[x].leader).length);
      if (Math.max(...per) > Math.ceil(L / k) || Math.min(...per) < Math.floor(L / k)) bad(`${tag}: 주장이 고르게 나뉘지 않음 (${per})`);
    }
    const res = { people, leaders, teams: r.teams, animals: r.animals };
    if (!CORE.validResult(res)) bad(`${tag}: validResult 가 거부`);
    const back = CORE.decodeShare(CORE.encodeShare(res));
    if (!back || JSON.stringify(back.teams) !== JSON.stringify(r.teams) || JSON.stringify(back.animals) !== JSON.stringify(r.animals) || back.people.map((p) => p.name).join() !== people.map((p) => p.name).join()) bad(`${tag}: 공유 왕복이 다름`);
    else if (leaders && back.people.some((p, j) => p.leader !== people[j].leader)) bad(`${tag}: 공유 왕복에서 주장 표시가 바뀜`);
    else if (!leaders && back.people.some((p) => p.leader)) bad(`${tag}: 주장 모드가 꺼졌는데 공유에 주장 표시`);
  }
  if (CORE.makeTeams([{ name: 'a' }, { name: 'b' }], 3, false) !== null) bad('사람보다 팀이 많은데 null 이 아님');
  return trials;
}
function checkFair() {
  // 4명 → 2팀: {01|23}, {02|13}, {03|12} 세 가지가 각 1/3 (crypto 난수 그대로)
  const N = 30000;
  const splits = {};
  const people4 = [0, 1, 2, 3].map((i) => ({ name: 'P' + i, leader: false }));
  for (let i = 0; i < N; i++) {
    const r = CORE.makeTeams(people4, 2, false);
    const withZero = r.teams.find((t) => t.includes(0));
    const mate = withZero.find((x) => x !== 0);
    splits[mate] = (splits[mate] || 0) + 1;
  }
  [1, 2, 3].forEach((m) => { const p = (splits[m] || 0) / N; if (Math.abs(p - 1 / 3) > 0.02) bad(`공정성: 0번과 ${m}번이 같은 팀 ${(p * 100).toFixed(1)}% (기대 33.3%)`); });
  // 6명 → 3팀: 0번이 몇 번째 팀(출력 순서)에 들어가는지 고르게, 팀 크기와 무관하게 5명/2팀일 때 큰 팀이 어느 자리인지도 고르게
  const pos = [0, 0, 0];
  const people6 = [...Array(6).keys()].map((i) => ({ name: 'P' + i }));
  for (let i = 0; i < N; i++) { const r = CORE.makeTeams(people6, 3, false); pos[r.teams.findIndex((t) => t.includes(0))]++; }
  pos.forEach((c, i) => { if (Math.abs(c / N - 1 / 3) > 0.02) bad(`공정성: 0번이 ${i + 1}번째 팀 ${(c / N * 100).toFixed(1)}%`); });
  let bigFirst = 0;
  const people5 = [...Array(5).keys()].map((i) => ({ name: 'P' + i }));
  for (let i = 0; i < N; i++) { const r = CORE.makeTeams(people5, 2, false); if (r.teams[0].length === 3) bigFirst++; }
  if (Math.abs(bigFirst / N - 0.5) > 0.02) bad(`공정성: 5명/2팀에서 큰 팀이 첫 자리 ${(bigFirst / N * 100).toFixed(1)}%`);
  // 5명 → 2팀: 각 사람이 큰 팀(3명)에 들어갈 확률 3/5
  const inBig = [0, 0, 0, 0, 0];
  for (let i = 0; i < N; i++) { const r = CORE.makeTeams(people5, 2, false); r.teams.find((t) => t.length === 3).forEach((x) => inBig[x]++); }
  inBig.forEach((c, i) => { if (Math.abs(c / N - 0.6) > 0.02) bad(`공정성: ${i}번이 큰 팀 ${(c / N * 100).toFixed(1)}% (기대 60%)`); });
  // 주장 모드: 주장 2명(0·1)과 일반 4명 → 3팀(2·2·2). 주장 팀마다 빈자리 1개, 주장 없는 팀 2개 → 일반 2번이 0번 주장과 같은 팀일 확률 = 1/4
  const peopleL = [...Array(6).keys()].map((i) => ({ name: 'P' + i, leader: i < 2 }));
  let with0 = 0;
  for (let i = 0; i < N; i++) { const r = CORE.makeTeams(peopleL, 3, true); if (r.teams.find((t) => t.includes(0)).includes(2)) with0++; }
  if (Math.abs(with0 / N - 1 / 4) > 0.02) bad(`공정성(주장): 2번이 0번 주장 팀 ${(with0 / N * 100).toFixed(1)}% (기대 25%)`);
  // cryptoInt: 범위 + 고르게
  const bins = new Array(7).fill(0);
  for (let i = 0; i < 70000; i++) { const x = CORE.cryptoInt(7); if (x < 0 || x > 6 || x !== (x | 0)) { bad(`cryptoInt 범위 밖 ${x}`); break; } bins[x]++; }
  bins.forEach((c, i) => { if (Math.abs(c / 70000 - 1 / 7) > 0.01) bad(`cryptoInt(7) 치우침: ${i} → ${c}`); });
  if (CORE.cryptoInt(1) !== 0) bad('cryptoInt(1) ≠ 0');
  // team.js 가 Math.random 을 쓰지 않는지(섞기는 crypto)
  const src = fs.readFileSync(path.join(SITE, 'team.js'), 'utf8') + fs.readFileSync(path.join(SITE, 'team-core.js'), 'utf8').replace(/if \(!c\) return Math\.floor\(Math\.random\(\) \* max\);/, '');
  if (/Math\.random/.test(src)) bad('섞기에 Math.random 이 쓰임 (crypto.getRandomValues 만)');
  if (!/getRandomValues/.test(fs.readFileSync(path.join(SITE, 'team-core.js'), 'utf8'))) bad('team-core.js 에 crypto.getRandomValues 없음');
}
function checkShare() {
  const langs = Object.keys(L10N);
  langs.forEach((lang) => {
    const people = L10N[lang].sample.map((name, i) => ({ name, leader: i < 2 }));
    people.push({ name: '🐯 Ünïcødé ж ท', leader: false });
    const t = CORE.makeTeams(people, 3, true);
    const res = { people, leaders: true, teams: t.teams, animals: t.animals };
    const code = CORE.encodeShare(res);
    if (!/^[A-Za-z0-9_-]+$/.test(code || '')) bad(`[${lang}] 공유 코드 모양`);
    const back = CORE.decodeShare(code);
    if (!back || back.people.map((p) => p.name).join('|') !== people.map((p) => p.name).join('|')) bad(`[${lang}] 공유 왕복 이름이 다름`);
  });
  // 60명 × 20자 한글도 링크 한도(12000자) 안
  const big = Array.from({ length: 60 }, (_, i) => ({ name: '가나다라마바사아자차카타파하가나다라' + String(i).padStart(2, '0'), leader: i % 3 === 0 }));
  const bt = CORE.makeTeams(big, 20, true);
  const bigCode = CORE.encodeShare({ people: big, leaders: true, teams: bt.teams, animals: bt.animals });
  if (!bigCode || !CORE.decodeShare(bigCode)) bad(`60명 × 20자 공유 링크가 안 됨 (${bigCode ? bigCode.length : 0}자)`);
  // 잘못된 링크
  const ok = { v: 1, n: ['A', 'B', 'C', 'D'], t: [[0, 1], [2, 3]], a: [0, 1] };
  const enc = (o) => CORE.b64urlEncode(JSON.stringify(o));
  if (!CORE.decodeShare(enc(ok))) bad('정상 공유 코드를 거부');
  const cases = {
    '중복': { ...ok, t: [[0, 1], [1, 3]] },
    '빠짐': { ...ok, t: [[0, 1], [2]] },
    '범위 밖': { ...ok, t: [[0, 1], [2, 4]] },
    '소수': { ...ok, t: [[0, 1.5], [2, 3]] },
    '빈 팀': { ...ok, t: [[0, 1, 2, 3], []] },
    '팀 1개': { ...ok, t: [[0, 1, 2, 3]], a: [0] },
    '이름 중복': { ...ok, a: [1, 1] },
    '이름 범위': { ...ok, a: [0, 99] },
    '버전': { ...ok, v: 2 },
    '빈 이름': { ...ok, n: ['A', '', 'C', 'D'] },
    '긴 이름': { ...ok, n: ['A'.repeat(21), 'B', 'C', 'D'] },
    '줄바꿈': { ...ok, n: ['A\nB', 'B', 'C', 'D'] },
    '61명': { v: 1, n: Array.from({ length: 61 }, (_, i) => 'P' + i), t: [[...Array(31).keys()], [...Array(30).keys()].map((x) => x + 31)], a: [0, 1] },
    '21팀': { v: 1, n: Array.from({ length: 21 }, (_, i) => 'P' + i), t: [...Array(21).keys()].map((x) => [x]), a: [...Array(21).keys()].map((x) => x % 20) },
    '모양': { v: 1, n: 'ABCD', t: 'x', a: 1 },
  };
  Object.entries(cases).forEach(([k, o]) => { if (CORE.decodeShare(enc(o))) bad(`잘못된 공유 코드(${k})를 받아들임`); });
  ['', '!!!', 'a b', 'x'.repeat(12001), '%E0%A4', CORE.b64urlEncode('not json'), CORE.b64urlEncode('null')].forEach((s) => { if (CORE.decodeShare(s)) bad(`쓰레기 공유 코드를 받아들임: ${s.slice(0, 20)}`); });
  if (CORE.decodeShare('_-_-')) bad('잘못된 UTF-8 을 받아들임');
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
    const sh = shape(T);
    // people 은 언어마다 복수형 범주가 다르다 → 모양 비교에서 뺀다
    delete sh.people; const enS = { ...enShape }; delete enS.people;
    keysDiff(enS, sh, '', diff);
    diff.forEach((d) => bad(`${tag} 키 구조: ${d}`));
    // 자리표시자
    const enTok = {};
    walk(EN, (s, p) => { enTok[p] = tokens(s); });
    walk(T, (s, p) => { if (p.startsWith('people.') || p.startsWith('privacy.') || p.startsWith('faq.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    // 사람 수 복수형
    if (!T.people || !T.people.other) bad(`${tag} people.other 없음`);
    else {
      const cats = new Intl.PluralRules(lang).resolvedOptions().pluralCategories.filter((c) => c !== 'many' || lang === 'ru');
      cats.forEach((c) => { if (lang === 'ru' && !T.people[c]) bad(`${tag} people.${c} 없음`); });
      Object.entries(T.people).forEach(([c, s]) => { if (!/\{n\}/.test(s)) bad(`${tag} people.${c} 에 {n} 없음`); });
      if (lang === 'ru') {
        const pr = new Intl.PluralRules('ru');
        const want = { 1: 'человек', 2: 'человека', 5: 'человек', 21: 'человек', 22: 'человека', 11: 'человек' };
        Object.entries(want).forEach(([n, w]) => { const s = G.fmt(T.people[pr.select(Number(n))] || T.people.other, { n }); if (s !== `${n} ${w}`) bad(`${tag} 복수형 ${n}: "${s}"`); });
      }
    }
    // 팀 이름
    const ids = CORE.TEAMS.map((t) => t.id);
    if (Object.keys(T.teams).sort().join() !== ids.slice().sort().join()) bad(`${tag} teams 키가 team-core.js TEAMS 와 다름`);
    const tn = Object.values(T.teams);
    if (new Set(tn).size !== tn.length) bad(`${tag} 팀 이름 중복`);
    tn.forEach((n) => { if (!n.trim() || len(n) > 18) bad(`${tag} 팀 이름 "${n}" 가 길거나 비어 있음 (18자 이하)`); });
    // 예시 이름
    if (!Array.isArray(T.sample) || T.sample.length < 8 || T.sample.length > 20) bad(`${tag} sample 8~20개`);
    else {
      const parsed = CORE.parseNames(T.sample.join('\n')).people.map((p) => p.name);
      if (parsed.join('|') !== T.sample.join('|')) bad(`${tag} sample 이 그대로 읽히지 않음(구분자·주장 표시·20자)`);
      if (new Set(T.sample).size !== T.sample.length) bad(`${tag} sample 중복`);
    }
    const ph = CORE.parseNames(T.input.placeholder).people;
    if (ph.length < 4 || !ph.some((p) => p.leader)) bad(`${tag} input.placeholder 는 이름 4개 이상 + 주장 예시(*)`);
    // FAQ
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /getRandomValues/.test(f.a))) bad(`${tag} FAQ 에 공정성(crypto.getRandomValues) 설명 없음`);
    // 한글
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    // 제목·설명
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름(app.config title "${APP.title[lang]}") 없음`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (!T.start.h1Kicker || !T.meta.title.includes(T.start.h1Kicker.split(' · ')[0])) bad(`${tag} h1 검색어(start.h1Kicker)가 제목과 다름`);
    if (!/<em>/.test(T.start.h1Html) || /<(?!\/?(br|em)>)/.test(T.start.h1Html)) bad(`${tag} start.h1Html 은 <br>·<em> 만`);
    // 360px 폭에 들어가는 짧은 버튼 문구
    ['modeTeams', 'modeSize'].forEach((k) => { if (len(T.input[k]) > 18) bad(`${tag} input.${k} 가 김 (${len(T.input[k])}자, 반쪽 버튼)`); });
    ['rename', 'again', 'edit'].forEach((k) => { if (len(T.result[k]) > 22) bad(`${tag} result.${k} 가 김`); });
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, ''); if (!p.startsWith('privacy.') && (/[^\s\u202f«(][?!:;](\s|$)/.test(t) || /[ \u00a0][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Nunito|Balsamiq|Rubik|Unbounded|Oswald/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function section(html, id) {
  const m = html.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`));
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
  if (!/<link rel="canonical" href="https:\/\/team\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/team\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
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
      const start = section(html, 'screen-start');
      const input = section(html, 'screen-input');
      const result = section(html, 'screen-result');
      if (!start || !input || !result) { bad(`${tag} 시작/입력/결과 화면 중 없는 것이 있음`); return; }
      if (!/<section id="screen-input"[^>]*hidden/.test(html) || !/<section id="screen-result"[^>]*hidden/.test(html)) bad(`${tag} 입력·결과 화면은 처음에 hidden`);
      if (/<section id="screen-start"[^>]*hidden/.test(html)) bad(`${tag} 시작 화면이 hidden`);
      if ((start.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(start)) bad(`${tag} 시작 화면 맨 끝에 <div class="mg-ad mg-ad-start"> 가 정확히 하나여야 함 (규칙 2026-10-02)`);
      if ((html.match(/class="mg-ad mg-ad-start"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad-start 는 시작 화면의 1개뿐`);
      if (/data-mg-end|mg-faq|<details|<textarea|tm-team"|tm-chip/.test(start)) bad(`${tag} 시작 화면에 끝 화면/FAQ/입력/팀 카드`);
      if (!/<h1 class="tm-h1">/.test(start)) bad(`${tag} h1 이 시작 화면에 없음`);
      if (!start.includes(G.esc(T.start.h1Kicker))) bad(`${tag} h1 에 검색어 없음`);
      if (!/id="start-btn"/.test(start)) bad(`${tag} 시작 버튼 없음`);
      if (T.sample.some((n) => len(n) > 1 && start.includes(n))) bad(`${tag} 시작 화면에 예시 이름`);
      if (T.faq.some((q) => html.replace(/<script>window\.MG_FAQ[\s\S]*?<\/script>/, '').includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖(HTML)에 있음`);
      if ((html.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad(시작 화면 mg-ad-start 제외)는 입력 화면의 1개뿐 (끝 화면 광고는 공통 컴포넌트)`);
      if ((input.match(/class="mg-ad"/g) || []).length !== 1) bad(`${tag} 입력 화면 mg-ad 는 1개`);
      if (input.indexOf('class="mg-ad"') < input.indexOf('id="shuffle-btn"')) bad(`${tag} 입력 화면 광고는 섞기 버튼 아래`);
      ['names', 'people-count', 'sample-btn', 'clear-btn', 'mode-teams', 'mode-size', 'step-minus', 'step-num', 'step-plus', 'preview', 'leaders', 'shuffle-btn'].forEach((id) => { if (!input.includes(`id="${id}"`)) bad(`${tag} 입력 화면에 #${id} 없음`); });
      const teamsAt = result.indexOf('id="teams"');
      const copyAt = result.indexOf('id="copy-btn"');
      const endAt = result.indexOf('<div data-mg-end="team"></div>');
      if (!(teamsAt > 0 && copyAt > teamsAt && endAt > copyAt)) bad(`${tag} 결과: 팀 카드 → 복사 → data-mg-end="team" 순서가 아님`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      ['deck', 'rename-btn', 'again-btn', 'edit-btn', 'make-own-btn', 'shared-note', 'result-title'].forEach((id) => { if (!result.includes(`id="${id}"`)) bad(`${tag} 결과 화면에 #${id} 없음`); });
      if (!/window\.MG_FAQ = \[/.test(html)) bad(`${tag} MG_FAQ 없음`);
      if (!/window\.PAGE_I18N = /.test(html)) bad(`${tag} PAGE_I18N 없음`);
      if (html.indexOf('team-core.js') < 0 || html.indexOf('team-core.js') > html.indexOf('team.js"')) bad(`${tag} team-core.js 가 team.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length}`);
  if (!sm.includes('<loc>https://team.example.com/</loc>') || !sm.includes('<loc>https://team.example.com/ko/</loc>')) bad('sitemap.xml 주소가 이상함');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 코드·템플릿에 문구 금지: team.js 에 한글·일본어 등 사람 문구가 없는지 (주석 제외)
  const js = fs.readFileSync(path.join(SITE, 'team.js'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('team.js 에 언어 문구가 있음 (tools/i18n 으로)');
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
  if (APP.id !== 'team' || APP.category !== 'vote' || APP.path !== 'https://team.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added)) bad('app.config.js id/category/path/added');
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

checkParse();
checkCounts();
const trials = checkTeamsRandom();
checkFair();
checkShare();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\n무작위 팀 나누기 ${trials}판 · 공정성(4명·5명·6명·주장 모드 각 30000판, cryptoInt 70000회) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.forEach((p) => console.error('  ✗ ' + p));
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — 이름 읽기·팀 수 범위·팀 나누기(모두 한 번·인원 차 ≤ 1·주장 고르게)·공정성(crypto)·공유 링크 왕복/거부, 언어 파일 12개(키·자리표시자·복수형·팀 이름·예시 이름·FAQ·제목), 생성 HTML(SEO·타이틀 바·시작 화면 티징·광고 위치(시작 화면 맨 끝 1개 포함)·끝 화면), OG 이미지 모두 OK');
