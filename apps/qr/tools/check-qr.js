#!/usr/bin/env node
/**
 * QR코드 생성기 검사 (의존성 없음 — jsQR 같은 외부 디코더 없이 혼자 돈다).
 *   1) 인코더(qr-core.js)
 *      - 알려진 답(KAT): "HELLO WORLD" 1-M · 1-Q 데이터·RS 코드워드(Thonky 예제), 형식 정보 32개(L/M/Q/H × 마스크 0~7, ISO 표),
 *        버전 정보(v7·v8·v9·v10·v40), 정렬 무늬 위치, 용량 표(ISO 18004 표 7 일부), "HELLO WORLD" 1-Q 기준 행렬(jsQR 로 확인한 것).
 *      - 표 정합성: 버전 1~40 × L/M/Q/H 모두 코드워드 수·블록 길이·자리 수가 맞는지.
 *      - 구조: 찾기·타이밍·정렬 무늬·dark module, 형식 정보 두 사본이 같고 표와 맞는지, v7+ 버전 정보 두 사본.
 *      - 자체 디코더로 되읽기: 형식 정보로 수준·마스크 찾기 → 마스크 풀기 → 지그재그로 읽기 → 블록 풀기 → RS 확인 → 모드·길이·데이터 해석 → 원래 바이트와 같은지.
 *        (ASCII·숫자·영숫자·한글·일본어·이모지·와이파이·긴 글 ~1,000바이트, 모든 수준, 버전 강제 1~40, 마스크 강제 0~7)
 *      - 내용 만들기: 와이파이 escape(\ ; , : "), 링크 https:// 자동, mailto, tel, 색 대비·반전.
 *   2) 언어 파일 12개: en.js 와 키 구조, TODO-TRANSLATE 없음, 자리표시자, FAQ 3~5개("무료인가요?" 류 금지, 서버 전송 없음 설명),
 *      제목·설명 길이, 360px 폭 문구, h1 검색어, fr 좁은 공백, ru 키릴 글꼴, 한국어 파일 밖에 한글 없음.
 *   3) 생성된 HTML(언어 폴더 + 숨은 변형 _l/): title / h1 하나 / hreflang / canonical / og / 타이틀 바 / appLd(create) / FAQPage 없음 /
 *      첫 화면(#screen-qr) 마지막 요소 = mg-ad-start 정확히 1개 / h1 → 종류 → 미리보기 → 저장 → 옵션 → 결과(hidden) 안 data-mg-end="qr" → 광고 순서 /
 *      FAQ 는 MG_FAQ 로만 / 스크립트 순서 / qr.js 는 네트워크·저장소를 쓰지 않음, 공유에 사용자 내용 없음.
 *   4) sitemap.xml URL 수(guide.html 제외), OG 이미지 1200×630, app.config.js, favicon, shared 링크.
 *
 * 실행: node tools/check-qr.js
 */
const fs = require('fs');
const path = require('path');
const SITE = path.join(__dirname, '..');
const G = require(path.join(SITE, '..', '..', 'tools', 'lib', 'i18n-gen.js'));
const Q = require(path.join(SITE, 'qr-core.js'));
const APP = require(path.join(SITE, 'app.config.js'));
const L10N = G.loadSiteLocales(SITE);
const I = Q._;

const problems = [];
const bad = (m) => problems.push(m);
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) bad(`${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`); };
const len = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).length;
const WIDE = /[ᄀ-ᇿ⺀-鿿가-힯豈-﫿＀-￯　-〿]/;
const width = (s) => Array.from(String(s).replace(/[ัิ-ฺ็-๎]/g, '')).reduce((u, ch) => u + (WIDE.test(ch) ? 2 : 1), 0);
let decodedCount = 0;

// ---------------------------------------------------------------- 1) 인코더
// ISO/IEC 18004 표 C.1 — 형식 정보 (마스크 XOR 뒤 15비트)
const FORMAT_TABLE = {
  L: ['111011111000100', '111001011110011', '111110110101010', '111100010011101', '110011000101111', '110001100011000', '110110001000001', '110100101110110'],
  M: ['101010000010010', '101000100100101', '101111001111100', '101101101001011', '100010111111001', '100000011001110', '100111110010111', '100101010100000'],
  Q: ['011010101011111', '011000001101000', '011111100110001', '011101000000110', '010010010110100', '010000110000011', '010111011011010', '010101111101101'],
  H: ['001011010001001', '001001110111110', '001110011100111', '001100111010000', '000011101100010', '000001001010101', '000110100001100', '000100000111011'],
};
// 표 D.1 — 버전 정보 18비트
const VERSION_TABLE = { 7: 0x07C94, 8: 0x085BC, 9: 0x09A99, 10: 0x0A4D3, 40: 0x28C69 };
// 부록 E — 정렬 무늬 중심
const ALIGN_TABLE = { 1: [], 2: [6, 18], 6: [6, 34], 7: [6, 22, 38], 14: [6, 26, 46, 66], 23: [6, 30, 54, 78, 102], 32: [6, 34, 60, 86, 112, 138], 40: [6, 30, 58, 86, 114, 142, 170] };
// 표 7 — 용량 (문자 수; 바이트 모드는 바이트)
const CAPACITY_TABLE = [
  [1, 'L', 'numeric', 41], [1, 'L', 'alphanumeric', 25], [1, 'L', 'byte', 17], [1, 'M', 'byte', 14], [1, 'Q', 'byte', 11], [1, 'H', 'byte', 7],
  [1, 'H', 'numeric', 17], [2, 'L', 'byte', 32], [2, 'M', 'byte', 26], [5, 'H', 'byte', 44], [5, 'Q', 'byte', 60], [10, 'M', 'byte', 213],
  [40, 'L', 'numeric', 7089], [40, 'L', 'alphanumeric', 4296], [40, 'L', 'byte', 2953], [40, 'M', 'byte', 2331], [40, 'Q', 'byte', 1663], [40, 'H', 'byte', 1273],
];
// "HELLO WORLD" 1-Q 기준 행렬 (마스크 0) — scratchpad 의 jsQR 왕복 검사로 확인한 값
const HELLO_1Q = [
  '111111101100001111111', '100000101001001000001', '101110101001101011101', '101110101000001011101', '101110101010001011101', '100000100010001000001', '111111101010101111111',
  '000000001000000000000', '011010110000101011111', '010000001111000010001', '001101110110001011000', '011011010011010101110', '100010101011101110101', '000000001101001000101',
  '111111101010000101100', '100000100101101101000', '101110101010001111111', '101110100101010100010', '101110101001011101001', '100000101011110001011', '111111100001011100001',
];

// 검사용 마스크 식 (core 와 따로 다시 씀)
const MASK = [
  (x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(y / 2) + Math.floor(x / 3)) % 2 === 0, (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0, (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];
const ALNUM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';
const bitsOf = (n, w) => n.toString(2).padStart(w, '0');
const ham = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d; };

// 자체 디코더: 행렬 → { ecc, mask, version, bytes }
function decode(m) {
  const size = m.length;
  const version = (size - 17) / 4;
  if (!Number.isInteger(version) || version < 1 || version > 40) throw new Error('size');
  // 형식 정보 (사본 1: 왼쪽 위 둘레, 비트 14 → 0)
  let f1 = '';
  for (let x = 0; x <= 5; x++) f1 += m[8][x] ? 1 : 0;
  f1 += m[8][7] ? 1 : 0; f1 += m[8][8] ? 1 : 0; f1 += m[7][8] ? 1 : 0;
  for (let y = 5; y >= 0; y--) f1 += m[y][8] ? 1 : 0;
  // 사본 2: 왼쪽 아래(비트 14..8) + 오른쪽 위(비트 7..0)
  let f2 = '';
  for (let y = size - 1; y >= size - 7; y--) f2 += m[y][8] ? 1 : 0;
  for (let x = size - 8; x < size; x++) f2 += m[8][x] ? 1 : 0;
  let best = null;
  for (const e of Object.keys(FORMAT_TABLE)) FORMAT_TABLE[e].forEach((s, k) => { const d = ham(s, f1); if (!best || d < best.d) best = { d, e, k }; });
  if (best.d !== 0) throw new Error(`format bits ${f1} not exact`);
  if (f2 !== f1) throw new Error(`format copy 2 ${f2} ≠ ${f1}`);
  const { e: ecc, k: mask } = best;
  if (version >= 7) {
    let v1 = 0, v2 = 0;
    for (let i = 17; i >= 0; i--) {
      const a = size - 11 + (i % 3), b = Math.floor(i / 3);
      v1 = v1 * 2 + (m[b][a] ? 1 : 0); // 오른쪽 위 블록
      v2 = v2 * 2 + (m[a][b] ? 1 : 0); // 왼쪽 아래 블록
    }
    if (v1 !== I.versionBits(version) || v2 !== v1) throw new Error('version info');
  }
  const fn = I.functionMask(version);
  // 마스크 풀고 지그재그로 읽기
  const bits = [];
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const up = ((right + 1) & 2) === 0;
        const y = up ? size - 1 - vert : vert;
        if (fn[y][x]) continue;
        bits.push((m[y][x] ? 1 : 0) ^ (MASK[mask](x, y) ? 1 : 0));
      }
    }
  }
  const raw = Math.floor(I.numRawDataModules(version) / 8);
  if (bits.length !== I.numRawDataModules(version)) throw new Error(`data modules ${bits.length}`);
  const cw = [];
  for (let i = 0; i < raw; i++) { let b = 0; for (let k = 0; k < 8; k++) b = b * 2 + bits[i * 8 + k]; cw.push(b); }
  // 블록 풀기
  const e = 'LMQH'.indexOf(ecc);
  const nb = I.NUM_ERROR_CORRECTION_BLOCKS[e][version], ecLen = I.ECC_CODEWORDS_PER_BLOCK[e][version];
  const nShort = nb - (raw % nb), shortLen = Math.floor(raw / nb);
  const blocks = Array.from({ length: nb }, (_, i) => ({ data: [], ec: [], dlen: shortLen - ecLen + (i < nShort ? 0 : 1) }));
  let p = 0;
  const maxD = shortLen - ecLen + 1;
  for (let c = 0; c < maxD; c++) for (const b of blocks) if (c < b.dlen) b.data.push(cw[p++]);
  for (let c = 0; c < ecLen; c++) for (const b of blocks) b.ec.push(cw[p++]);
  if (p !== raw) throw new Error('deinterleave');
  const div = I.rsDivisor(ecLen);
  blocks.forEach((b, i) => { if (JSON.stringify(I.rsRemainder(b.data, div)) !== JSON.stringify(b.ec)) throw new Error(`RS block ${i}`); });
  const data = blocks.flatMap((b) => b.data);
  // 세그먼트 해석
  let bp = 0;
  const dbits = data.flatMap((b) => bitsOf(b, 8).split('').map(Number));
  const take = (n) => { let v = 0; for (let i = 0; i < n; i++) v = v * 2 + dbits[bp++]; return v; };
  const mode = take(4);
  const cc = { 1: [10, 12, 14], 2: [9, 11, 13], 4: [8, 16, 16] }[mode];
  if (!cc) throw new Error(`mode ${mode}`);
  const count = take(cc[version <= 9 ? 0 : version <= 26 ? 1 : 2]);
  let out = [];
  if (mode === 4) for (let i = 0; i < count; i++) out.push(take(8));
  else {
    let s = '';
    if (mode === 1) { let r = count; while (r >= 3) { s += String(take(10)).padStart(3, '0'); r -= 3; } if (r === 2) s += String(take(7)).padStart(2, '0'); else if (r === 1) s += String(take(4)); }
    else { let r = count; while (r >= 2) { const v = take(11); s += ALNUM[Math.floor(v / 45)] + ALNUM[v % 45]; r -= 2; } if (r) s += ALNUM[take(6)]; }
    out = Array.from(Buffer.from(s, 'latin1'));
  }
  // 종료 표시와 채움 바이트
  const termLen = Math.min(4, dbits.length - bp);
  if (take(termLen) !== 0) throw new Error('terminator');
  bp = Math.ceil(bp / 8) * 8;
  for (let pad = 0xEC; bp < dbits.length; pad ^= 0xEC ^ 0x11) if (take(8) !== pad) throw new Error('pad bytes');
  return { ecc, mask, version, bytes: out };
}

function structure(qr, tag) {
  const m = qr.modules, n = qr.size;
  if (n !== qr.version * 4 + 17 || m.length !== n || m.some((r) => r.length !== n)) return bad(`${tag}: 크기`);
  const finder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= n || y >= n) continue;
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      if (m[y][x] !== (d !== 2 && d !== 4)) return false;
    }
    return true;
  };
  if (!finder(3, 3) || !finder(n - 4, 3) || !finder(3, n - 4)) bad(`${tag}: 찾기 무늬`);
  for (let i = 8; i < n - 8; i++) if (m[6][i] !== (i % 2 === 0) || m[i][6] !== (i % 2 === 0)) { bad(`${tag}: 타이밍 무늬`); break; }
  if (!m[n - 8][8]) bad(`${tag}: dark module`);
  const pos = ALIGN_TABLE[qr.version] || I.alignmentPositions(qr.version);
  pos.forEach((ay, a) => pos.forEach((ax, b) => {
    if ((a === 0 && b === 0) || (a === 0 && b === pos.length - 1) || (a === pos.length - 1 && b === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) if (m[ay + dy][ax + dx] !== (Math.max(Math.abs(dx), Math.abs(dy)) !== 1)) { bad(`${tag}: 정렬 무늬 (${ax},${ay})`); return; }
  }));
}

function roundTrip(text, opts, tag) {
  let qr;
  try { qr = Q.encode(text, opts); } catch (e) { return bad(`${tag}: encode 오류 ${e.message}`); }
  structure(qr, tag);
  try {
    const d = decode(qr.modules);
    if (d.ecc !== qr.ecc || d.mask !== qr.mask || d.version !== qr.version) bad(`${tag}: 되읽은 수준/마스크/버전 ${d.ecc}/${d.mask}/${d.version} ≠ ${qr.ecc}/${qr.mask}/${qr.version}`);
    if (Buffer.compare(Buffer.from(d.bytes), Buffer.from(Q.utf8Bytes(text))) !== 0) bad(`${tag}: 되읽은 내용이 다름`);
    else decodedCount++;
  } catch (e) { bad(`${tag}: 자체 디코더 실패 (${e.message}) v${qr.version} ${qr.ecc} m${qr.mask}`); }
  return qr;
}

function checkEncoder() {
  // KAT: Thonky "HELLO WORLD"
  const m1 = I.dataCodewords('HELLO WORLD', 'M', {});
  eq([m1.version, m1.mode], [1, 'alphanumeric'], 'HELLO WORLD 1-M 버전·모드');
  eq(m1.data, [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17], 'HELLO WORLD 1-M 데이터 코드워드');
  eq(I.rsRemainder(m1.data, I.rsDivisor(10)), [196, 35, 39, 119, 235, 215, 231, 226, 93, 23], 'HELLO WORLD 1-M RS 10개');
  const q1 = I.dataCodewords('HELLO WORLD', 'Q', {});
  eq(q1.data, [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236], 'HELLO WORLD 1-Q 데이터 코드워드');
  eq(I.rsRemainder(q1.data, I.rsDivisor(13)), [168, 72, 22, 82, 217, 54, 156, 0, 46, 15, 180, 122, 16], 'HELLO WORLD 1-Q RS 13개');
  eq(I.gfMul(0x53, 0xCA), I.gfMul(0xCA, 0x53), 'GF 곱셈 교환법칙');
  eq(I.gfMul(2, 128), 0x1D, 'GF: α^8 = 0x1D (다항식 0x11D)');
  // 형식·버전 정보, 정렬 무늬, 용량
  Object.keys(FORMAT_TABLE).forEach((e) => FORMAT_TABLE[e].forEach((s, k) => eq(bitsOf(I.formatBits(e, k), 15), s, `형식 정보 ${e}${k}`)));
  Object.keys(VERSION_TABLE).forEach((v) => eq(I.versionBits(Number(v)), VERSION_TABLE[v], `버전 정보 v${v}`));
  Object.keys(ALIGN_TABLE).forEach((v) => eq(I.alignmentPositions(Number(v)), ALIGN_TABLE[v], `정렬 무늬 v${v}`));
  CAPACITY_TABLE.forEach(([v, e, mo, n]) => eq(Q.capacity(v, e, mo), n, `용량 ${v}-${e} ${mo}`));
  // 표 정합성
  for (let v = 1; v <= 40; v++) {
    const raw = I.numRawDataModules(v);
    if (v <= 6 && raw % 8 !== [0, 0, 7, 7, 7, 7, 7][v]) bad(`v${v} 남는 비트 ${raw % 8}`);
    ['L', 'M', 'Q', 'H'].forEach((e, k) => {
      const nd = I.numDataCodewords(v, e);
      const nb = I.NUM_ERROR_CORRECTION_BLOCKS[k][v], ec = I.ECC_CODEWORDS_PER_BLOCK[k][v];
      if (!(nd > 0 && nb > 0 && ec > 0) || nd + nb * ec !== Math.floor(raw / 8)) bad(`표 v${v}-${e}`);
      if (Math.floor(Math.floor(raw / 8) / nb) - ec < 1) bad(`표 v${v}-${e} 블록이 비어 있음`);
      if (v > 1 && I.numDataCodewords(v - 1, e) >= nd) bad(`표 v${v}-${e} 용량이 늘지 않음`);
    });
  }
  // 기준 행렬
  const hq = Q.encode('HELLO WORLD', { ecc: 'Q' });
  eq([hq.version, hq.mask], [1, 0], 'HELLO WORLD 1-Q 버전·마스크');
  eq(hq.modules.map((r) => r.map((b) => (b ? 1 : 0)).join('')), HELLO_1Q, 'HELLO WORLD 1-Q 기준 행렬');
  // 되읽기 (자체 디코더)
  const SAMPLES = {
    ascii: 'Hello, world!', url: 'https://melgene.com/qr/?utm=1#x', numeric: '0123456789012345678901', alnum: 'HELLO WORLD $%*+-./: 42',
    korean: '안녕하세요, QR코드 생성기! 한글 테스트', japanese: 'こんにちは世界。QRコード作成', chinese: '二维码生成器测试', emoji: '🔳🎉👍🏽👨‍👩‍👧 ok', russian: 'Генератор QR-кода «ёлка»',
    wifi: Q.wifiPayload({ ssid: 'Cafe;5G', password: 'p@ss:w,o"rd\\', auth: 'WPA' }), mail: Q.emailPayload({ to: 'a@b.co', subject: 'Hi & bye', body: '줄1\n줄2' }), tel: Q.phonePayload('+82 10-1234-5678'),
    one: 'a', digit: '7', empty: '',
  };
  for (const [k, s] of Object.entries(SAMPLES)) for (const e of Q.ECC_LEVELS) roundTrip(s, { ecc: e }, `${k}/${e}`);
  for (let mk = 0; mk < 8; mk++) for (const e of Q.ECC_LEVELS) roundTrip(`mask ${mk} 마스크`, { ecc: e, mask: mk }, `mask${mk}/${e}`);
  const filler = 'QR코드 test 123 – ';
  for (let v = 1; v <= 40; v++) {
    const e = Q.ECC_LEVELS[v % 4];
    const cap = Q.capacity(v, e, 'byte');
    let s = '', i = 0;
    while (Q.utf8Bytes(s + filler[i % filler.length]).length <= Math.floor(cap * 0.9)) { s += filler[i % filler.length]; i++; }
    roundTrip(s || 'x', { ecc: e, minVersion: v, maxVersion: v, mask: v % 8 }, `v${v}/${e}`);
    const cap2 = Q.capacity(v, 'H', 'byte');
    roundTrip('x'.repeat(cap2), { ecc: 'H', minVersion: v, maxVersion: v }, `v${v}/H 꽉 참(${cap2}B)`);
    let threw = false;
    try { Q.encode('x'.repeat(cap2 + 1), { ecc: 'H', minVersion: v, maxVersion: v }); } catch (err) { threw = err.code === 'TOO_LONG'; }
    if (!threw) bad(`v${v}/H: 용량 +1 이 TOO_LONG 이 아님`);
  }
  for (const n of [100, 500, 1000]) roundTrip(Array.from({ length: n }, (_, i) => String.fromCharCode(33 + ((i * 7) % 90))).join(''), { ecc: 'M' }, `ascii${n}`);
  roundTrip('가'.repeat(333), { ecc: 'L' }, 'ko 999B');
  // 자동 버전 = 가장 작은 버전
  const auto = Q.encode('x'.repeat(Q.capacity(5, 'M', 'byte')), { ecc: 'M' });
  eq(auto.version, 5, '자동 버전: v5-M 꽉 찬 내용 → v5');
  eq(Q.encode('x'.repeat(Q.capacity(5, 'M', 'byte') + 1), { ecc: 'M' }).version, 6, '자동 버전: +1 바이트 → v6');
  let tooLong = false;
  try { Q.encode('x'.repeat(2954), { ecc: 'L' }); } catch (e) { tooLong = e.code === 'TOO_LONG'; }
  if (!tooLong) bad('2954바이트는 TOO_LONG');
  // 마스크 자동 선택 = 벌점 최소
  const pm = Q.encode('Penalty check 123', { ecc: 'M' });
  if (!pm.penalties || pm.penalties[pm.mask] !== Math.min(...pm.penalties)) bad('마스크 자동 선택이 벌점 최소가 아님');
  // 모드 고르기, UTF-8
  eq([Q.pickMode('123'), Q.pickMode('ABC 1'), Q.pickMode('abc'), Q.pickMode('é')], ['numeric', 'alphanumeric', 'byte', 'byte'], 'pickMode');
  eq(Q.utf8Bytes('A가😀'), [0x41, 0xEA, 0xB0, 0x80, 0xF0, 0x9F, 0x98, 0x80], 'utf8Bytes');
  // 내용 만들기
  eq(Q.escapeWifi('a\\b;c,d:e"f'), 'a\\\\b\\;c\\,d\\:e\\"f', 'escapeWifi');
  eq(Q.wifiPayload({ ssid: 'Home', password: 'pw', auth: 'WPA' }), 'WIFI:T:WPA;S:Home;P:pw;;', 'wifi WPA');
  eq(Q.wifiPayload({ ssid: 'Open', auth: 'nopass', hidden: true }), 'WIFI:T:nopass;S:Open;H:true;;', 'wifi nopass hidden');
  eq(Q.wifiPayload({ ssid: 'Old', password: 'x', auth: 'WEP' }), 'WIFI:T:WEP;S:Old;P:x;;', 'wifi WEP');
  eq(Q.wifiPayload({ ssid: '', password: 'x' }), '', 'wifi SSID 없음 → 빈 내용');
  eq(Q.linkPayload(' example.com/menu '), 'https://example.com/menu', 'link https 자동');
  eq(Q.linkPayload('http://a.b'), 'http://a.b', 'link scheme 유지');
  eq(Q.linkPayload('mailto:x@y.z'), 'mailto:x@y.z', 'link 다른 scheme 유지');
  eq(Q.linkPayload('hello world'), 'hello world', 'link 도메인 아님 → 그대로');
  eq(Q.emailPayload({ to: ' a@b.co ', subject: 'Hi & bye' }), 'mailto:a@b.co?subject=Hi%20%26%20bye', 'mailto');
  eq(Q.phonePayload('+82 10-1234-5678'), 'tel:+821012345678', 'tel +');
  eq(Q.phonePayload('(02) 123-4567'), 'tel:021234567', 'tel');
  eq(Q.phonePayload('abc'), '', 'tel 숫자 없음');
  eq(Q.buildPayload('text', { text: '  keep spaces ' }), '  keep spaces ', 'text 그대로');
  // 색
  if (Math.abs(Q.contrastRatio('#000', '#fff') - 21) > 1e-9) bad('대비 검정/흰색 = 21');
  if (!Q.colorCheck('#bbbbbb', '#ffffff').low) bad('대비 낮음 경고');
  if (!Q.colorCheck('#ffffff', '#000000').inverted) bad('반전 경고');
  if (!Q.colorCheck('#111111', '#ffffff').ok) bad('기본 색은 ok');
  // SVG
  const svg = Q.toSvg(Q.encode('svg', { ecc: 'L' }), { fg: '#123456', bg: '#fedcba', margin: 4, px: 512 });
  if (!/^<\?xml/.test(svg) || !/viewBox="0 0 29 29"/.test(svg) || !/width="512"/.test(svg) || !/fill="#123456"/.test(svg) || !/fill="#fedcba"/.test(svg)) bad('toSvg 모양');
  eq(Q.cellEdges(3, 10), [0, 3, 7, 10], 'cellEdges');
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
const tokens = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(',');
function walk(obj, fn, p = '') {
  if (typeof obj === 'string') return fn(obj, p);
  if (obj && typeof obj === 'object') Object.entries(obj).forEach(([k, v]) => walk(v, fn, p ? `${p}.${k}` : k));
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
    walk(T, (s, p) => { if (p.startsWith('privacy.') || p.startsWith('faq.')) return; if (enTok[p] != null && enTok[p] !== tokens(s)) bad(`${tag} ${p} 자리표시자 ${tokens(s) || '없음'} ≠ ${enTok[p]}`); });
    if (lang !== 'en') {
      ['meta.title', 'hero.hook', 'ui.typeLabel', 'ui.downloadPng', 'result.again', 'ui.localNote'].forEach((p) => { if (get(T, p) === get(EN, p)) bad(`${tag} ${p} 가 en 과 같음(번역 안 됨)`); });
      if (T.faq[0].q === EN.faq[0].q) bad(`${tag} faq 가 en 과 같음`);
    }
    // 360px 폭 (종류 버튼 5칸·저장 버튼 2칸·칩)
    Object.entries(T.ui.types).forEach(([k, v]) => { if (width(v) > 8) bad(`${tag} ui.types.${k} 가 김 (폭 ${width(v)} > 8, 360px 5칸): ${v}`); });
    [['ui.downloadPng', 26], ['ui.downloadSvg', 16], ['ui.copyImage', 16], ['result.again', 28], ['ui.fg', 12], ['ui.bg', 14], ['ui.resetColors', 14], ['ui.options', 40], ['result.doneTitle', 30]].forEach(([p, max]) => {
      const v = get(T, p); if (width(v) > max) bad(`${tag} ${p} 가 김 (폭 ${width(v)} > ${max}, 360px): ${v}`);
    });
    if (!T.hero.h1Kicker || !T.meta.title.includes(T.hero.h1Kicker)) bad(`${tag} h1 검색어(hero.h1Kicker)가 제목에 없음`);
    if (!/<em>/.test(T.hero.h1Html) || /<(?!\/?(br|em)>)/.test(T.hero.h1Html)) bad(`${tag} hero.h1Html 은 <br>·<em> 만`);
    if (!Array.isArray(T.faq) || T.faq.length < 3 || T.faq.length > 5) bad(`${tag} FAQ 3~5개`);
    else T.faq.forEach((f, i) => {
      if (!f.q || !f.a || /<|>/.test(f.q + f.a)) bad(`${tag} faq[${i}] 비었거나 HTML`);
      if (/무료|free\b|gratuit|kostenlos|gratis|grátis|miễn phí|ฟรี|免费|無料|бесплатн|popular|인기|별점|ranking/i.test(f.q)) bad(`${tag} faq[${i}] 금지 질문(무료·인기순 류): ${f.q}`);
    });
    if (!T.faq.some((f) => /JavaScript|자바스크립트/.test(f.a))) bad(`${tag} FAQ 에 브라우저 안에서만 처리(JavaScript) 설명 없음`);
    if (!T.faq.some((f) => /WIFI:/.test(f.a))) bad(`${tag} FAQ 에 와이파이 QR(WIFI:) 설명 없음`);
    if (lang !== 'ko') walk(T, (s, p) => { if (/[가-힯]/.test(s)) bad(`${tag} ${p} 에 한글`); });
    const title = `${T.meta.title} | ${G.brandOf(lang)}`;
    if (!T.meta.title.toLowerCase().includes(APP.title[lang].toLowerCase())) bad(`${tag} meta.title 에 포털 이름("${APP.title[lang]}") 없음`);
    if (T.siteName !== APP.title[lang]) bad(`${tag} siteName 이 app.config title 과 다름`);
    const cjk = /^(ja|zh|ko|th)$/.test(lang);
    if (len(title) > (cjk ? 40 : 70)) bad(`${tag} <title> 이 김 (${len(title)}자): ${title}`);
    const dl = len(T.meta.description);
    if (dl < (cjk ? 50 : 100) || dl > (cjk ? 130 : 220)) bad(`${tag} meta.description 길이 ${dl}`);
    if (!/^[a-z0-9-]+$/.test(T.fileName)) bad(`${tag} fileName 은 영문 소문자·숫자·- 만`);
    if (lang === 'fr') walk(T, (s, p) => { const t = s.replace(/https?:\/\/\S+/g, '').replace(/\{ratio\}:1/g, '').replace(/WIFI:/g, ''); if (!p.startsWith('privacy.') && (/[^\s «( ][?!:;](\s|$)/.test(t) || /[  ][?!:;](\s|$)/.test(t))) bad(`${tag} ${p} 의 ? ! : ; 앞에 좁은 공백(\\u202f) 없음: ${s.slice(0, 40)}`); });
    if (lang === 'ru' && !/Unbounded|Nunito|Rubik/.test(T.fonts.css)) bad(`${tag} 키릴 문자를 지원하는 글꼴이 아님`);
    if (lang === 'vi' && !/Unbounded|Be\+Vietnam|Plus\+Jakarta/.test(T.fonts.css)) bad(`${tag} 베트남어 성조를 지원하는 글꼴이 아님`);
  });
}

// ---------------------------------------------------------------- 3) 생성된 HTML
const read = (f) => fs.readFileSync(path.join(SITE, f), 'utf8');
function screen(html) { const m = html.match(/<section id="screen-qr"[\s\S]*?<\/section>/); return m ? m[0] : ''; }
function commonHtml(tag, html, lang, variant) {
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title || !title.trim()) bad(`${tag} <title> 없음`);
  if (!html.includes(`<html lang="${lang}">`)) bad(`${tag} <html lang="${lang}"> 아님`);
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) bad(`${tag} <h1> ${h1s}개`);
  const hl = (html.match(/<link rel="alternate" hreflang=/g) || []).length;
  if (hl !== G.LOCALES.length + 1) bad(`${tag} hreflang ${hl}개 ≠ ${G.LOCALES.length + 1}`);
  if (!/hreflang="x-default"/.test(html)) bad(`${tag} x-default 없음`);
  if (!/<link rel="canonical" href="https:\/\/qr\.example\.com\//.test(html)) bad(`${tag} canonical 없음`);
  if (!/<header class="mg-top">/.test(html)) bad(`${tag} 공통 타이틀 바(G.topBar) 없음`);
  if (/FAQPage/.test(html)) bad(`${tag} FAQPage JSON-LD 금지`);
  if (/aggregateRating/.test(html)) bad(`${tag} aggregateRating 금지`);
  const og = (html.match(/<meta property="og:image" content="https:\/\/qr\.example\.com\/(og\/[^"]+\.png)">/) || [])[1];
  if (!og) bad(`${tag} og:image 없음`);
  else if (!fs.existsSync(path.join(SITE, og))) bad(`${tag} og:image 파일 없음 ${og}`);
  if (!/og:locale/.test(html)) bad(`${tag} og:locale 없음`);
  const order = ['shared/site.config.js', 'shared/i18n.js', 'shared/common.js', 'shared/supa.js'].map((s) => html.indexOf(s));
  if (order.some((i) => i < 0) || order.some((v, i) => i && v < order[i - 1])) bad(`${tag} 공통 스크립트 순서`);
  if (/supabase\.co|sb_publishable|sb_secret|service_role|eyJhbGci/i.test(html)) bad(`${tag} Supabase 주소/키가 원본 HTML 에 있음`);
  if (/\/(ko|ja|zh|fr|de|th|vi|es|it|pt|ru)\/[^"]*"/.test((html.match(/<main[\s\S]*<\/main>/) || [''])[0].replace(/https:\/\/[^"]+/g, ''))) bad(`${tag} 본문 링크에 언어 폴더`);
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
      if (!/"@type":"WebApplication"/.test(html) || !/"applicationCategory":"MultimediaApplication"/.test(html)) bad(`${tag} appLd(WebApplication, create) 없음`);
      const S = screen(html);
      if (!S) { bad(`${tag} 첫 화면(#screen-qr) 없음`); return; }
      if (/<section id="screen-qr"[^>]*hidden/.test(html)) bad(`${tag} 첫 화면이 hidden`);
      if ((html.match(/<section[\s>]/g) || []).length !== 1) bad(`${tag} section 은 첫 화면 하나뿐`);
      if ((S.match(/class="mg-ad\b/g) || []).length !== 1 || !/<div class="mg-ad mg-ad-start"><\/div>\s*<\/section>$/.test(S)) bad(`${tag} 첫 화면 맨 끝에 mg-ad-start 가 정확히 하나여야 함`);
      if ((html.match(/class="mg-ad\b/g) || []).length !== 1) bad(`${tag} 페이지 전체 mg-ad 는 mg-ad-start 1개뿐`);
      if (!/<h1 class="qr-h1">/.test(S) || !S.includes(G.esc(T.hero.h1Kicker))) bad(`${tag} h1(검색어)이 첫 화면에 없음`);
      const at = (s) => S.indexOf(s);
      const seq = ['class="qr-h1"', 'class="qr-types"', 'id="f-link"', 'id="preview"', 'id="dl-png"', 'id="dl-svg"', 'id="options"', 'class="qr-local"', 'id="result"', '<div data-mg-end="qr"></div>', 'class="mg-ad mg-ad-start"'].map(at);
      if (seq.some((i) => i < 0) || seq.some((v, i) => i && v < seq[i - 1])) bad(`${tag} 첫 화면 순서(h1 → 종류·입력 → 미리보기 → 저장 → 옵션 → 결과·끝 화면 → 광고)가 아님`);
      if (!/<div id="result" class="qr-result" hidden>/.test(S)) bad(`${tag} 결과·끝 화면(#result)은 처음에 hidden`);
      if ((html.match(/data-mg-end=/g) || []).length !== 1) bad(`${tag} data-mg-end 는 1개`);
      Q.TYPES.forEach((t) => { if (!S.includes(`data-type="${t}"`)) bad(`${tag} 종류 버튼 ${t} 없음`); });
      Q.ECC_LEVELS.forEach((e) => { if (!S.includes(`data-ecc="${e}"`)) bad(`${tag} 오류 정정 ${e} 없음`); });
      if (!/data-ecc="M" aria-checked="true"/.test(S) || !/data-type="link" aria-checked="true"/.test(S) || !/data-size="1024" aria-checked="true"/.test(S)) bad(`${tag} 기본 선택(링크·M·1024)`);
      ['f-ssid', 'f-pass', 'f-sec', 'f-hidden', 'f-to', 'f-subject', 'f-body', 'f-phone', 'f-text', 'c-fg', 'c-bg', 'margin'].forEach((id) => { if (!S.includes(`id="${id}"`)) bad(`${tag} #${id} 없음`); });
      if (!/<option value="WPA">/.test(S) || !/<option value="WEP">/.test(S) || !/<option value="nopass">/.test(S)) bad(`${tag} 와이파이 보안 선택`);
      if (/<details[^>]*id="options"[^>]*open/.test(S)) bad(`${tag} 옵션은 처음에 접혀 있어야 함`);
      if (/mg-faq/.test(S)) bad(`${tag} 첫 화면에 FAQ`);
      if (!S.includes(G.esc(T.ui.localNote))) bad(`${tag} "브라우저 안에서만" 안내 없음`);
      const bodyNoJson = html.replace(/<script>window\.(PAGE_I18N|MG_FAQ)[\s\S]*?<\/script>/g, '');
      if (T.faq.some((q) => bodyNoJson.includes(G.esc(q.q)))) bad(`${tag} FAQ 문구가 MG_FAQ 밖에 있음`);
      if (!/window\.MG_FAQ = \[/.test(html) || !/window\.PAGE_I18N = /.test(html)) bad(`${tag} MG_FAQ/PAGE_I18N 없음`);
      if (html.indexOf('qr-core.js') < 0 || html.indexOf('qr-core.js') > html.indexOf('qr.js"')) bad(`${tag} qr-core.js 가 qr.js 보다 먼저여야 함`);
      const pf = fileOf(lang, 'privacy.html');
      if (!fs.existsSync(path.join(SITE, pf))) { bad(`${pf} 없음`); return; }
      commonHtml(`[${lang}] ${pf}`, read(pf), lang, mode === 'variant');
      pages++;
    });
  });
  const sm = read('sitemap.xml');
  const urls = (sm.match(/<loc>(?![^<]*guide\.html)/g) || []).length;
  if (urls !== G.LOCALES.length) bad(`sitemap.xml URL ${urls} ≠ ${G.LOCALES.length} (guide.html 제외)`);
  if (!sm.includes('<loc>https://qr.example.com/</loc>') || !sm.includes('<loc>https://qr.example.com/ko/</loc>')) bad('sitemap.xml 주소');
  if (/_l\//.test(sm)) bad('sitemap.xml 에 숨은 변형(_l) 주소');
  // 앱 코드: 문구 없음, 기록 이벤트, 개인정보(네트워크·저장소 없음), 공유에 사용자 내용 없음
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const js = strip(fs.readFileSync(path.join(SITE, 'qr.js'), 'utf8'));
  const core = strip(fs.readFileSync(path.join(SITE, 'qr-core.js'), 'utf8'));
  if (/[가-힯぀-ヿ一-鿿฀-๿Ѐ-ӿ]/.test(js)) bad('qr.js 에 언어 문구 (tools/i18n 으로)');
  if ((js.match(/track\('start'\)/g) || []).length !== 1 || (js.match(/track\('done'\)/g) || []).length !== 1) bad("qr.js: track('start') 1곳, track('done') 1곳");
  if (/track\('(start|done)',/.test(js)) bad('qr.js: track 에 내용을 넘기지 않는다');
  [['qr.js', js], ['qr-core.js', core]].forEach(([n, src]) => {
    if (/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|document\.cookie|window\.supa/.test(src)) bad(`${n} 가 네트워크·저장소를 씀 (입력 내용은 브라우저 안에서만)`);
  });
  const shareBlock = (js.match(/setShareData\([\s\S]*?\}\);/) || [''])[0];
  if (!shareBlock || /payload|fields\(|\.value/.test(shareBlock)) bad('qr.js: 공유 데이터에 사용자 내용이 들어갈 수 있음 (앱 주소만)');
  if (/require\(/.test(core.replace(/module\.exports/g, ''))) bad('qr-core.js 에 외부 의존성');
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
  if (APP.id !== 'qr' || APP.category !== 'create' || APP.path !== 'https://qr.example.com/' || !/^\d{4}-\d{2}-\d{2}$/.test(APP.added) || !APP.emoji) bad('app.config.js id/emoji/category/path/added');
  G.LOCALES.forEach(({ code }) => {
    if (!APP.title[code] || !APP.desc[code]) bad(`app.config.js ${code} 제목/설명 없음`);
    else {
      if (len(APP.desc[code]) > 150) bad(`app.config.js ${code} 설명이 김 (${len(APP.desc[code])}자)`);
      if (len(APP.title[code]) > 24) bad(`app.config.js ${code} 포털 이름이 김 (${len(APP.title[code])}자)`);
      if (/[가-힯]/.test(APP.desc[code]) !== (code === 'ko')) bad(`app.config.js ${code} 설명 언어`);
    }
  });
  if (!fs.existsSync(path.join(SITE, 'favicon.svg'))) bad('favicon.svg 없음');
  try { if (fs.readlinkSync(path.join(SITE, 'shared')) !== '../../shared') bad('shared 링크가 ../../shared 가 아님'); } catch (e) { bad('shared 심볼릭 링크 없음'); }
}

checkEncoder();
checkLocales();
checkApp();
const pages = checkHtml();
const ogs = checkOg();
console.log(`\nQR 인코더(KAT·형식/버전 정보·용량 표·기준 행렬·자체 디코더 되읽기 ${decodedCount}건) · 언어 파일 ${G.LOCALES.length}개 · 생성 HTML ${pages}개(언어 폴더 + _l) · OG 이미지 ${ogs}장 검사`);
problems.slice(0, 80).forEach((p) => console.error('  ✗ ' + p));
if (problems.length > 80) console.error(`  … 외 ${problems.length - 80}건`);
if (problems.length) { console.error(`\n결과: 실패 — 문제 ${problems.length}건`); process.exit(1); }
console.log('\n결과: 통과 — QR 인코더(Reed–Solomon·블록·마스크·형식/버전 정보, 버전 1~40 × L/M/Q/H 되읽기), 내용 만들기(와이파이 escape 등), 언어 파일 12개, 생성 HTML(SEO·타이틀 바·첫 화면 맨 끝 mg-ad-start 1개·결과 안 끝 화면·개인정보), OG 이미지 모두 OK');
