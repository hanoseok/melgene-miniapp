/* apps/pumpkin/pumpkin-core.js — 호박 조각(잭오랜턴) 만들기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="pumpkin-core.js">)와 Node(tools/check-pumpkin.js, tools/gen-og.js)가 같은 코드를 쓴다.
 *
 * 디자인 = { s 모양, c 색, e 눈, n 코, m 입, t 꼭지, x 장식, g 촛불(0/1), k 밤하늘(0/1), name 이름 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"p":[s,c,e,n,m,t,x,g,k],"n":"이름"} )>
 * 그림: render(design, { prefix, simple }) → 400×400 SVG 문자열 (손그림 느낌의 path, 좌표 고정 → 어디서나 같은 그림).
 *   blank: 얼굴·장식 없이(아직 파지 않은 호박).
 *   prefix: 한 페이지에 여러 SVG 가 있을 때 gradient/filter id 충돌 방지. simple: 블러 필터 없이(작은 미리보기).
 *   thumb(kind, index): 눈·코·입 고르기 버튼용 확대 그림 (100×100).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.PUMPKIN_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var MAX_NAME = 20; // 코드 포인트 기준

  // ---------------------------------------------------------------
  // 모양 · 색
  // ---------------------------------------------------------------
  // w/h = 몸통 반폭/반높이, cy = 중심 y, fs = 얼굴 배율
  var SHAPES = [
    { id: 'round', w: 150, h: 118, cy: 245, fs: 1.1 },
    { id: 'tall', w: 118, h: 138, cy: 240, fs: 0.96 },
    { id: 'wide', w: 172, h: 100, cy: 256, fs: 1 },
    { id: 'mini', w: 118, h: 94, cy: 264, fs: 0.84 }
  ];
  var COLORS = [
    { id: 'orange', base: '#ff8a1f', light: '#ffb54f', dark: '#c85600', line: '#7a3000' },
    { id: 'gold', base: '#ffc23d', light: '#ffe28c', dark: '#cf8a00', line: '#7a5000' },
    { id: 'white', base: '#f3eadb', light: '#ffffff', dark: '#cbbba2', line: '#7d6b52' },
    { id: 'green', base: '#86b84a', light: '#b0d876', dark: '#527f22', line: '#2c4a10' },
    { id: 'blue', base: '#92b6bb', light: '#bed9dc', dark: '#5f878c', line: '#2f5357' }
  ];

  // ---------------------------------------------------------------
  // 얼굴 부품 (얼굴 좌표: 원점 = 얼굴 가운데, 배율 전)
  //   c: 파낸 부분(촛불이 켜지면 빛남), r: 파내지 않고 남긴 껍질(이빨·동공 등)
  //   눈은 왼쪽 눈 기준으로 그리고 오른쪽은 좌우 반전. R 이 있으면 오른쪽 눈 따로.
  // ---------------------------------------------------------------
  var EYES = [
    { id: 'triangle', c: ['M-23 15 L1 -21 L24 13 Q1 19 -23 15Z'] },
    { id: 'round', c: ['M0 -20 C12 -21 20 -10 20 1 C20 13 11 21 0 21 C-12 21 -20 12 -19 0 C-19 -11 -11 -20 0 -20Z'] },
    { id: 'happy', c: ['M-25 11 Q-1 -31 25 10 Q0 -7 -25 11Z'] },
    { id: 'angry', c: ['M-24 -13 L23 4 Q20 22 0 22 Q-21 21 -24 -13Z'] },
    { id: 'star', c: ['M0 -23 L6 -8 L22 -7 L10 3 L14 19 L0 10 L-14 19 L-10 3 L-22 -7 L-6 -8Z'] },
    { id: 'heart', c: ['M0 19 C-27 3 -25 -18 -11 -19 C-4 -19 0 -13 0 -8 C0 -13 4 -19 11 -19 C25 -18 27 3 0 19Z'] },
    { id: 'diamond', c: ['M1 -24 L21 0 L0 23 L-20 1Z'] },
    { id: 'cat', c: ['M-25 1 Q-1 -25 25 -1 Q1 25 -25 1Z'], r: ['M1 -15 Q7 0 1 15 Q-5 0 1 -15Z'] },
    { id: 'wink', c: ['M-23 15 L1 -21 L24 13 Q1 19 -23 15Z'], R: { c: ['M-23 -2 Q0 17 23 -2 Q0 8 -23 -2Z'] } },
    { id: 'sleepy', c: ['M-23 -3 L23 -3 Q21 19 0 19 Q-21 19 -23 -3Z'] }
  ];
  var NOSES = [
    { id: 'triangle', c: ['M0 -13 L14 12 L-14 12Z'] },
    { id: 'down', c: ['M-14 -10 L14 -10 L1 13Z'] },
    { id: 'round', c: ['M0 -10 C6 -10 10 -6 10 0 C10 6 6 10 0 10 C-6 10 -10 6 -10 0 C-10 -6 -6 -10 0 -10Z'] },
    { id: 'heart', c: ['M0 12 C-17 2 -16 -12 -7 -12 C-3 -12 0 -8 0 -5 C0 -8 3 -12 7 -12 C16 -12 17 2 0 12Z'] },
    { id: 'nostrils', c: ['M-8 -8 C-4 -8 -3 -2 -4 4 C-5 9 -11 9 -12 4 C-13 -2 -12 -8 -8 -8Z', 'M8 -8 C12 -8 13 -2 12 4 C11 9 5 9 4 4 C3 -2 4 -8 8 -8Z'] },
    { id: 'diamond', c: ['M0 -13 L11 0 L0 13 L-11 0Z'] },
    { id: 'skull', c: ['M0 -13 C-7 -1 -11 7 -4 12 L0 7 L4 12 C11 7 7 -1 0 -13Z'] },
    { id: 'none', c: [] }
  ];
  var MOUTHS = [
    { id: 'grin', c: ['M-72 -16 Q0 58 72 -16 Q0 20 -72 -16Z'], r: ['M12 -6 L30 -8 L29 14 L13 13Z', 'M-12 -6 L-30 -8 L-29 14 L-13 13Z'] },
    { id: 'smile', c: ['M-60 -10 L60 -10 Q57 44 0 46 Q-57 44 -60 -10Z'] },
    { id: 'jagged', c: ['M-70 -10 L-52 5 L-35 -11 L-18 5 L0 -10 L18 5 L35 -11 L52 5 L70 -10 Q42 42 0 43 Q-42 42 -70 -10Z'] },
    { id: 'oh', c: ['M0 -24 C13 -24 20 -12 20 2 C20 16 12 26 0 26 C-12 26 -20 16 -20 2 C-20 -12 -13 -24 0 -24Z'] },
    { id: 'snaggle', c: ['M-66 -14 Q0 50 66 -14 Q0 14 -66 -14Z'], r: ['M8 30 L14 8 L26 7 L28 28Z'] },
    { id: 'fangs', c: ['M-64 -12 Q0 44 64 -12 Q0 6 -64 -12Z'], r: ['M-34 -5 L-16 -3 L-24 18Z', 'M34 -5 L16 -3 L24 18Z'] },
    { id: 'wavy', c: ['M-60 -4 Q-45 -18 -30 -4 Q-15 10 0 -4 Q15 -18 30 -4 Q45 10 60 -4 L60 9 Q45 23 30 9 Q15 -5 0 9 Q-15 23 -30 9 Q-45 -5 -60 9Z'] },
    { id: 'stitch', c: ['M-64 0 Q0 12 64 0 Q0 30 -64 0Z'], r: ['M-44 -8 L-38 -8 L-38 28 L-44 28Z', 'M-23 -6 L-17 -6 L-17 30 L-23 30Z', 'M-3 -4 L3 -4 L3 31 L-3 31Z', 'M17 -6 L23 -6 L23 30 L17 30Z', 'M38 -8 L44 -8 L44 28 L38 28Z'] },
    { id: 'tongue', c: ['M-58 -10 L58 -10 Q55 42 0 44 Q-55 42 -58 -10Z'], r: ['M-20 44 Q-22 18 0 18 Q22 18 20 44Z'] },
    { id: 'cat', c: ['M-34 -6 Q-17 18 0 0 Q17 18 34 -6 Q18 28 0 12 Q-18 28 -34 -6Z'] }
  ];
  var STEMS = ['stub', 'curly', 'tall', 'leaf'];
  var EXTRAS = ['none', 'hat', 'bat', 'bow', 'spider', 'crown', 'ghost'];

  var COUNTS = { s: SHAPES.length, c: COLORS.length, e: EYES.length, n: NOSES.length, m: MOUTHS.length, t: STEMS.length, x: EXTRAS.length, g: 2, k: 2 };
  var KEYS = ['s', 'c', 'e', 'n', 'm', 't', 'x', 'g', 'k'];
  // 편집기 탭 순서 (UI 문구는 언어 파일 editor.tabs.<id>)
  var PARTS = [
    { id: 'shape', key: 's' }, { id: 'color', key: 'c' }, { id: 'eyes', key: 'e' }, { id: 'nose', key: 'n' },
    { id: 'mouth', key: 'm' }, { id: 'stem', key: 't' }, { id: 'extra', key: 'x' }
  ];
  var DEFAULT = { s: 0, c: 0, e: 0, n: 0, m: 0, t: 0, x: 0, g: 1, k: 1, name: '' };

  // ---------------------------------------------------------------
  // 난수 (crypto 우선)
  // ---------------------------------------------------------------
  function randomInt(max) {
    var g = typeof globalThis !== 'undefined' ? globalThis : {};
    if (g.crypto && typeof g.crypto.getRandomValues === 'function') {
      var b = new Uint32Array(1);
      var limit = 4294967296 - (4294967296 % max);
      do { g.crypto.getRandomValues(b); } while (b[0] >= limit);
      return b[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  // ---------------------------------------------------------------
  // 정규화 · 이름
  // ---------------------------------------------------------------
  function cleanName(s) {
    var str = String(s == null ? '' : s)
      .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ')
      .replace(/<[^<>]*>/g, '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    var chars = Array.from(str);
    if (chars.length > MAX_NAME) str = chars.slice(0, MAX_NAME).join('').trim();
    return str;
  }
  function validIndex(v, n) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= 0 && v < n; }
  // 쓸 수 있는 디자인이면 새 객체, 아니면 null (모든 값이 범위 안이어야 한다)
  function normalize(d) {
    if (!d || typeof d !== 'object') return null;
    var out = {};
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      if (!validIndex(d[k], COUNTS[k])) return null;
      out[k] = d[k];
    }
    out.name = cleanName(d.name);
    return out;
  }
  function copy(d) { var o = {}; KEYS.forEach(function (k) { o[k] = d[k]; }); o.name = d.name || ''; return o; }
  function defaults() { return copy(DEFAULT); }

  // 모양·색·얼굴·꼭지·장식을 무작위로 (촛불·밤하늘·이름은 그대로)
  function random(base) {
    var d = copy(base || DEFAULT);
    ['s', 'c', 'e', 'n', 'm', 't'].forEach(function (k) { d[k] = randomInt(COUNTS[k]); });
    d.x = randomInt(3) === 0 ? 0 : 1 + randomInt(COUNTS.x - 1); // 장식은 2/3 확률로 하나
    return d;
  }
  function cycle(d, key, step) {
    var o = copy(d);
    o[key] = (o[key] + (step || 1) + COUNTS[key]) % COUNTS[key];
    return o;
  }
  function same(a, b) {
    return !!a && !!b && KEYS.every(function (k) { return a[k] === b[k]; }) && (a.name || '') === (b.name || '');
  }

  // ---------------------------------------------------------------
  // 공유 링크 (#d=...) — UTF-8 안전 base64url
  // ---------------------------------------------------------------
  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    return Buffer.from(str, 'utf8');
  }
  function b64urlEncode(str) {
    var bytes = utf8Bytes(str);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64urlDecode(s) {
    var b64 = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  function encode(design) {
    var d = normalize(design);
    if (!d) return null;
    var p = { v: 1, p: KEYS.map(function (k) { return d[k]; }) };
    if (d.name) p.n = d.name;
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > 600 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || p.v !== 1 || !Array.isArray(p.p) || p.p.length !== KEYS.length) return null;
      if (p.n != null && typeof p.n !== 'string') return null;
      var d = {};
      KEYS.forEach(function (k, i) { d[k] = p.p[i]; });
      d.name = p.n || '';
      return normalize(d);
    } catch (e) {
      return null;
    }
  }

  // ---------------------------------------------------------------
  // 그림 (SVG 문자열)
  // ---------------------------------------------------------------
  var STARS = [[40, 150, 1.6], [96, 36, 1.2], [150, 88, 1.8], [236, 30, 1.3], [282, 124, 1.5], [360, 40, 1.8], [372, 176, 1.2], [24, 250, 1.3], [380, 300, 1.5], [130, 20, 1]];
  var BAT = 'M32 10c2-4 5-5 5-5l1 4c3-3 9-4 13-2-3 1-4 4-4 6 4-1 9 0 13 3-5 0-8 2-10 5-3-2-7-2-10 0-2-2-5-3-8-3s-6 1-8 3c-3-2-7-2-10 0-2-3-5-5-10-5 4-3 9-4 13-3 0-2-1-5-4-6 4-2 10-1 13 2l1-4s3 1 5 5z';
  var STEM_FILL = '#7b8a33';
  var STEM_LINE = '#3e4715';
  var LEAF = '#5d9b2f';

  function paths(list, attrs) {
    return list.map(function (d) { return '<path d="' + d + '"' + (attrs || '') + '/>'; }).join('');
  }
  // 얼굴 한 부품: 파낸 부분과 남긴 껍질을 각각 모은다
  function collect(part, transform, carve, rind) {
    if (!part) return;
    if (part.c && part.c.length) carve.push('<g transform="' + transform + '">' + paths(part.c) + '</g>');
    if (part.r && part.r.length) rind.push('<g transform="' + transform + '">' + paths(part.r) + '</g>');
  }

  function stemSvg(t, top) {
    var y = function (v) { return (top + v).toFixed(1); };
    var stub = '<path d="M188 ' + y(14) + ' C188 ' + y(-6) + ' 190 ' + y(-22) + ' 194 ' + y(-30) + ' L210 ' + y(-28) + ' C208 ' + y(-17) + ' 211 ' + y(-3) + ' 214 ' + y(14) + 'Z" fill="' + STEM_FILL + '" stroke="' + STEM_LINE + '" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M195 ' + y(-24) + ' L203 ' + y(6) + '" stroke="' + STEM_LINE + '" stroke-width="3" stroke-linecap="round" opacity=".45"/>';
    if (t === 1) return stub + '<path d="M209 ' + y(-18) + ' C234 ' + y(-46) + ' 266 ' + y(-26) + ' 252 ' + y(-6) + ' C242 ' + y(8) + ' 224 ' + y(-6) + ' 238 ' + y(-17) + '" fill="none" stroke="' + LEAF + '" stroke-width="6" stroke-linecap="round"/>';
    if (t === 2) return '<path d="M189 ' + y(14) + ' C185 ' + y(-20) + ' 176 ' + y(-44) + ' 158 ' + y(-58) + ' L172 ' + y(-70) + ' C193 ' + y(-52) + ' 207 ' + y(-26) + ' 213 ' + y(14) + 'Z" fill="' + STEM_FILL + '" stroke="' + STEM_LINE + '" stroke-width="5" stroke-linejoin="round"/>';
    if (t === 3) return stub + '<path d="M211 ' + y(-12) + ' C236 ' + y(-44) + ' 278 ' + y(-38) + ' 290 ' + y(-20) + ' C266 ' + y(-2) + ' 232 ' + y(2) + ' 211 ' + y(-12) + 'Z" fill="' + LEAF + '" stroke="#2f5a14" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M216 ' + y(-12) + ' C240 ' + y(-24) + ' 262 ' + y(-24) + ' 282 ' + y(-20) + '" fill="none" stroke="#2f5a14" stroke-width="2.5" stroke-linecap="round"/>';
    return stub;
  }

  function extraSvg(x, top, sh, dark) {
    if (x === 1) { // 마녀 모자
      var tip = Math.max(10, top - 112);
      var rx = Math.round(sh.w * 0.62);
      return '<g stroke="#140a24" stroke-width="5" stroke-linejoin="round">' +
        '<ellipse cx="200" cy="' + (top + 6) + '" rx="' + rx + '" ry="17" fill="#2d1b4e"/>' +
        '<path d="M152 ' + (top + 2) + ' Q200 ' + (top - 10) + ' 248 ' + (top + 2) + ' L222 ' + (tip + 34) + ' Q228 ' + (tip + 10) + ' 250 ' + tip + ' Q214 ' + (tip + 4) + ' 196 ' + (tip + 30) + ' Z" fill="#3a2366"/>' +
        '<path d="M160 ' + (top - 12) + ' Q200 ' + (top - 24) + ' 240 ' + (top - 12) + ' L236 ' + (top - 1) + ' Q200 ' + (top - 12) + ' 156 ' + (top - 1) + 'Z" fill="#ff8a1f" stroke-width="3"/>' +
        '<rect x="191" y="' + (top - 19) + '" width="18" height="15" rx="3" fill="#ffd23f" stroke-width="3"/></g>';
    }
    if (x === 2) { // 박쥐
      var bf = dark ? '#4a2d80' : '#2a1b44';
      return '<g transform="translate(276 60) scale(1.35) rotate(-8 32 16)"><path d="' + BAT + '" fill="' + bf + '" stroke="#0b0518" stroke-width="1.5"/>' +
        '<circle cx="29" cy="12" r="1.8" fill="#ffd23f"/><circle cx="35" cy="12" r="1.8" fill="#ffd23f"/></g>';
    }
    if (x === 3) { // 리본
      var by = top + 26;
      return '<g transform="rotate(-18 150 ' + by + ')" stroke="#8f1c43" stroke-width="4" stroke-linejoin="round">' +
        '<path d="M150 ' + by + ' C130 ' + (by - 26) + ' 110 ' + (by - 14) + ' 116 ' + (by + 2) + ' C120 ' + (by + 16) + ' 138 ' + (by + 12) + ' 150 ' + by + 'Z" fill="#ff5c8a"/>' +
        '<path d="M150 ' + by + ' C170 ' + (by - 26) + ' 190 ' + (by - 14) + ' 184 ' + (by + 2) + ' C180 ' + (by + 16) + ' 162 ' + (by + 12) + ' 150 ' + by + 'Z" fill="#ff5c8a"/>' +
        '<ellipse cx="150" cy="' + by + '" rx="9" ry="10" fill="#ff8fb0"/></g>';
    }
    if (x === 4) { // 거미
      var sf = dark ? '#2b1a44' : '#1d1030';
      var legs = [-1, 1].map(function (s) {
        return [0, 1, 2, 3].map(function (i) {
          var yy = 128 + i * 6;
          return '<path d="M318 ' + yy + ' Q' + (318 + s * 22) + ' ' + (yy - 14 + i * 4) + ' ' + (318 + s * 30) + ' ' + (yy + 4 + i * 5) + '" fill="none"/>';
        }).join('');
      }).join('');
      return '<line x1="318" y1="0" x2="318" y2="118" stroke="' + (dark ? '#d8ccf0' : '#6d5c86') + '" stroke-width="2" opacity=".7"/>' +
        '<g stroke="' + sf + '" stroke-width="4" stroke-linecap="round">' + legs + '</g>' +
        '<ellipse cx="318" cy="136" rx="14" ry="16" fill="' + sf + '" stroke="#6b4fa0" stroke-width="2"/>' +
        '<circle cx="318" cy="120" r="9" fill="' + sf + '" stroke="#6b4fa0" stroke-width="2"/>' +
        '<circle cx="314" cy="119" r="2.4" fill="#fff"/><circle cx="322" cy="119" r="2.4" fill="#fff"/>';
    }
    if (x === 5) { // 왕관
      return '<g stroke="#9a6a00" stroke-width="4" stroke-linejoin="round">' +
        '<path d="M160 ' + (top + 8) + ' L156 ' + (top - 34) + ' L180 ' + (top - 12) + ' L200 ' + (top - 46) + ' L220 ' + (top - 12) + ' L244 ' + (top - 34) + ' L240 ' + (top + 8) + ' Q200 ' + (top - 2) + ' 160 ' + (top + 8) + 'Z" fill="#ffd23f"/>' +
        '<circle cx="200" cy="' + (top - 10) + '" r="6" fill="#e0457b" stroke-width="2.5"/>' +
        '<circle cx="174" cy="' + (top - 3) + '" r="4" fill="#5fc1e8" stroke-width="2"/><circle cx="226" cy="' + (top - 3) + '" r="4" fill="#5fc1e8" stroke-width="2"/></g>';
    }
    if (x === 6) { // 꼬마 유령
      return '<g><path d="M58 152 C56 112 70 92 90 92 C110 92 124 112 122 152 L114 144 L106 154 L98 144 L90 154 L82 144 L74 154 L66 144Z" fill="#f7f3ff" stroke="#b9aedb" stroke-width="3" stroke-linejoin="round" opacity=".95"/>' +
        '<ellipse cx="80" cy="118" rx="4.5" ry="6.5" fill="#2a1b44"/><ellipse cx="100" cy="118" rx="4.5" ry="6.5" fill="#2a1b44"/>' +
        '<path d="M84 132 Q90 138 96 132" fill="none" stroke="#2a1b44" stroke-width="3" stroke-linecap="round"/>' +
        '<ellipse cx="72" cy="129" rx="5" ry="3" fill="#ffb3c7" opacity=".8"/><ellipse cx="108" cy="129" rx="5" ry="3" fill="#ffb3c7" opacity=".8"/></g>';
    }
    return '';
  }

  function render(design, opt) {
    var d = normalize(design) || defaults();
    opt = opt || {};
    var P = String(opt.prefix || 'pk').replace(/[^a-z0-9_-]/gi, '');
    var sh = SHAPES[d.s];
    var col = COLORS[d.c];
    var glow = d.g === 1;
    var dark = d.k === 1;
    var fx = glow && !opt.simple;
    var cx = 200;
    var cy = sh.cy;
    var top = cy - sh.h;
    var W = sh.w;
    var H = sh.h;
    var out = [];

    out.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"' + (opt.attrs || '') + '>');
    out.push('<defs>');
    if (dark) out.push('<radialGradient id="' + P + '-bg" cx=".5" cy=".38" r=".85"><stop offset="0" stop-color="#3d1c70"/><stop offset=".55" stop-color="#1f0f3d"/><stop offset="1" stop-color="#110722"/></radialGradient>');
    else out.push('<linearGradient id="' + P + '-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6e6"/><stop offset="1" stop-color="#ffdcb8"/></linearGradient>');
    out.push('<radialGradient id="' + P + '-body" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="' + col.light + '"/><stop offset=".55" stop-color="' + col.base + '"/><stop offset="1" stop-color="' + col.dark + '"/></radialGradient>');
    out.push('<radialGradient id="' + P + '-carve" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fffbd2"/><stop offset=".45" stop-color="#ffd43f"/><stop offset="1" stop-color="#ff9214"/></radialGradient>');
    out.push('<radialGradient id="' + P + '-halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb347" stop-opacity=".55"/><stop offset=".6" stop-color="#ff8a1f" stop-opacity=".18"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient>');
    if (fx) out.push('<filter id="' + P + '-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>');
    out.push('</defs>');

    // 배경
    out.push('<rect width="400" height="400" fill="url(#' + P + '-bg)"/>');
    if (dark) {
      out.push(STARS.map(function (s) { return '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="#fff3c4" opacity=".8"/>'; }).join(''));
      out.push('<circle cx="62" cy="62" r="26" fill="#fff3c4" opacity=".85"/><circle cx="52" cy="56" r="5" fill="#e8d193" opacity=".6"/><circle cx="70" cy="72" r="3.5" fill="#e8d193" opacity=".6"/>');
    }
    out.push('<ellipse cx="200" cy="' + (cy + H - 2) + '" rx="' + Math.round(W * 0.96) + '" ry="16" fill="#000" opacity="' + (dark ? '.35' : '.12') + '"/>');
    if (glow && dark) out.push('<circle cx="200" cy="' + cy + '" r="' + (W + 80) + '" fill="url(#' + P + '-halo)"/>');

    // 꼭지 (몸통 뒤에서 시작해 위로)
    out.push(stemSvg(d.t, top));

    // 몸통: 바깥 → 안쪽 순서로 5개 골
    var lobes = [
      { dx: -0.5, rx: 0.5, ry: 0.86 }, { dx: 0.5, rx: 0.5, ry: 0.86 },
      { dx: -0.27, rx: 0.46, ry: 0.95 }, { dx: 0.27, rx: 0.46, ry: 0.95 },
      { dx: 0, rx: 0.44, ry: 1 }
    ];
    out.push('<g stroke="' + col.line + '" stroke-width="5" fill="url(#' + P + '-body)">');
    lobes.forEach(function (l) {
      out.push('<ellipse cx="' + (cx + l.dx * W).toFixed(1) + '" cy="' + cy + '" rx="' + (l.rx * W).toFixed(1) + '" ry="' + (l.ry * H).toFixed(1) + '"/>');
    });
    out.push('</g>');
    // 윤기
    out.push('<path d="M' + (cx - W * 0.2).toFixed(1) + ' ' + (top + H * 0.22).toFixed(1) + ' Q' + (cx - W * 0.12).toFixed(1) + ' ' + (top + H * 0.1).toFixed(1) + ' ' + (cx + W * 0.02).toFixed(1) + ' ' + (top + H * 0.12).toFixed(1) + '" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".35"/>');

    if (opt.blank) { out.push('</svg>'); return out.join(''); } // 시작 화면 티저: 아직 파지 않은 호박

    // 얼굴
    var carve = [];
    var rind = [];
    var eye = EYES[d.e];
    collect(eye, 'translate(-50 -35)', carve, rind);
    collect(eye.R || eye, eye.R ? 'translate(50 -35)' : 'translate(50 -35) scale(-1 1)', carve, rind);
    collect(NOSES[d.n], 'translate(0 8)', carve, rind);
    collect(MOUTHS[d.m], 'translate(0 50)', carve, rind);
    var carveFill = glow ? 'url(#' + P + '-carve)' : '#3d1c0a';
    var edge = glow ? '#a84200' : '#241004';
    out.push('<g transform="translate(200 ' + cy + ') scale(' + sh.fs + ')">');
    out.push('<g fill="' + carveFill + '" stroke="' + edge + '" stroke-width="3" stroke-linejoin="round"' + (fx ? ' filter="url(#' + P + '-glow)"' : '') + '>' + carve.join('') + '</g>');
    if (rind.length) out.push('<g fill="' + col.base + '" stroke="' + edge + '" stroke-width="2.5" stroke-linejoin="round">' + rind.join('') + '</g>');
    out.push('</g>');

    // 장식
    out.push(extraSvg(d.x, top, sh, dark));
    out.push('</svg>');
    return out.join('');
  }

  // 눈·코·입 고르기 버튼용 확대 그림 (100×100, 호박색 바탕 + 파낸 부분)
  function thumb(kind, index, opt) {
    opt = opt || {};
    var glow = opt.glow !== false;
    var bg = opt.color ? (COLORS[opt.color] || COLORS[0]) : COLORS[0];
    var carve = [];
    var rind = [];
    var tr;
    if (kind === 'eyes') {
      var eye = EYES[index];
      collect(eye, 'translate(-24 0) scale(.9)', carve, rind);
      collect(eye.R || eye, eye.R ? 'translate(24 0) scale(.9)' : 'translate(24 0) scale(-.9 .9)', carve, rind);
      tr = 'translate(50 50)';
    } else if (kind === 'nose') {
      collect(NOSES[index], 'scale(1.9)', carve, rind);
      tr = 'translate(50 50)';
    } else {
      collect(MOUTHS[index], 'scale(.6)', carve, rind);
      tr = 'translate(50 42)';
    }
    var fill = glow ? '#ffd43f' : '#3d1c0a';
    var edge = glow ? '#a84200' : '#241004';
    var empty = !carve.length && !rind.length;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">' +
      '<rect x="3" y="3" width="94" height="94" rx="26" fill="' + bg.base + '" stroke="' + bg.line + '" stroke-width="3"/>' +
      (empty ? '<path d="M34 34 L66 66 M66 34 L34 66" stroke="' + bg.line + '" stroke-width="5" stroke-linecap="round" opacity=".5"/>' : '') +
      '<g transform="' + tr + '"><g fill="' + fill + '" stroke="' + edge + '" stroke-width="3" stroke-linejoin="round">' + carve.join('') + '</g>' +
      (rind.length ? '<g fill="' + bg.base + '" stroke="' + edge + '" stroke-width="2.5">' + rind.join('') + '</g>' : '') + '</g></svg>';
  }

  return {
    SHAPES: SHAPES, COLORS: COLORS, EYES: EYES, NOSES: NOSES, MOUTHS: MOUTHS, STEMS: STEMS, EXTRAS: EXTRAS,
    COUNTS: COUNTS, KEYS: KEYS, PARTS: PARTS, MAX_NAME: MAX_NAME,
    defaults: defaults, normalize: normalize, cleanName: cleanName, random: random, cycle: cycle, copy: copy, same: same,
    encode: encode, decode: decode, render: render, thumb: thumb, randomInt: randomInt
  };
});
