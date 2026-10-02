/* apps/ghost/ghost-core.js — 나만의 할로윈 유령 만들기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="ghost-core.js">)와 Node(tools/check-ghost.js, tools/gen-og.js)가 같은 코드를 쓴다.
 *
 * 디자인 = { b 몸 모양, c 색, e 눈, m 입, k 볼, h 모자·장식, i 들고 있는 것, g 배경, name 이름 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"p":[b,c,e,m,k,h,i,g],"n":"이름"} )>
 * 그림: render(design, { prefix, simple, blank, attrs }) → 400×400 SVG 문자열 (좌표 고정 → 어디서나 같은 그림).
 *   유령(몸·얼굴·모자·들고 있는 것)은 <g class="gh-float"> 안, 그림자는 .gh-shadow — 둥실둥실 움직임은 페이지 CSS 가 준다
 *   (PNG 저장 때는 CSS 가 없어 가만히 있는 그림).
 *   blank: 얼굴·장식 없는 실루엣 + 물음표(시작 화면 티저). prefix: gradient/filter id 충돌 방지. simple: 블러 필터 없이(작은 미리보기).
 *   thumb(kind, index, { color }): 눈·입·볼 고르기 버튼용 확대 그림 (100×100).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.GHOST_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var MAX_NAME = 20; // 코드 포인트 기준
  var CX = 200;

  // ---------------------------------------------------------------
  // 몸 모양 (T = 머리 꼭대기 y, w = 머리 반지름, B = 아래 끝 y, fw = 아래 반폭, n = 물결 수, dep = 물결 깊이,
  //          fy = 얼굴 가운데 y, fs = 얼굴 배율, wisp = 꼬리형)
  // ---------------------------------------------------------------
  var SHAPES = [
    { id: 'sheet', T: 96, w: 92, B: 316, fw: 104, n: 4, dep: 16, fy: 186, fs: 1 },
    { id: 'blob', T: 112, w: 112, B: 300, fw: 112, n: 5, dep: 11, fy: 212, fs: 1.08 },
    { id: 'wispy', T: 78, w: 78, B: 300, fw: 78, n: 0, dep: 0, fy: 158, fs: 0.9, wisp: true },
    { id: 'chubby', T: 120, w: 122, B: 316, fw: 134, n: 4, dep: 15, fy: 226, fs: 1.12 },
    { id: 'tiny', T: 176, w: 62, B: 304, fw: 68, n: 3, dep: 11, fy: 234, fs: 0.72 }
  ];
  // 몸 색: base 가운데, light 밝은 쪽, shade 어두운 쪽, line 테두리, ink 눈·입, hi 눈 반짝이, mouth 입 속, halo 몸 둘레 빛(없으면 없음)
  var COLORS = [
    { id: 'white', base: '#f7f5ff', light: '#ffffff', shade: '#d6cfee', line: '#6b5f8f', ink: '#2a2144', hi: '#ffffff', mouth: '#4a1d3a', halo: '' },
    { id: 'mint', base: '#c8f7e1', light: '#eafff5', shade: '#8fdcbc', line: '#3a7a62', ink: '#1f3b33', hi: '#ffffff', mouth: '#3d1f33', halo: '' },
    { id: 'lavender', base: '#dccfff', light: '#f3edff', shade: '#ae98ee', line: '#56478f', ink: '#2a1f4d', hi: '#ffffff', mouth: '#431c45', halo: '' },
    { id: 'pink', base: '#ffd3e4', light: '#fff0f6', shade: '#f5a3c3', line: '#94486a', ink: '#43203a', hi: '#ffffff', mouth: '#5a1d3a', halo: '' },
    { id: 'glow', base: '#c6ff7a', light: '#f0ffd0', shade: '#86dc3c', line: '#3c7a14', ink: '#1d3a0a', hi: '#f7ffe6', mouth: '#23420d', halo: '#b6ff5c' },
    { id: 'midnight', base: '#4a4f96', light: '#6f75c4', shade: '#2c2f66', line: '#b9bef7', ink: '#fff3c4', hi: '#2c2f66', mouth: '#1a1238', halo: '#8f96ff' }
  ];

  // ---------------------------------------------------------------
  // 얼굴 부품 (얼굴 좌표: 원점 = 얼굴 가운데, 배율 전). 함수(ink, hi, col, side) → SVG 조각.
  //   눈은 (±30, 0), 입은 (0, 34), 볼은 (±47, 20) 에 놓인다. side = -1 왼쪽 / 1 오른쪽.
  // ---------------------------------------------------------------
  function stroke(ink, w) { return ' fill="none" stroke="' + ink + '" stroke-width="' + (w || 4.5) + '" stroke-linecap="round" stroke-linejoin="round"'; }
  var EYES = [
    { id: 'dot', f: function (ink, hi) { return '<ellipse rx="9" ry="12" fill="' + ink + '"/><circle cx="3" cy="-4.5" r="3.2" fill="' + hi + '"/>'; } },
    { id: 'sparkle', f: function (ink, hi) { return '<ellipse rx="13" ry="16" fill="' + ink + '"/><circle cx="4" cy="-6" r="5" fill="' + hi + '"/><circle cx="-5" cy="6" r="2.4" fill="' + hi + '"/>'; } },
    { id: 'happy', f: function (ink) { return '<path d="M-12 4 Q0 -13 12 4"' + stroke(ink, 5) + '/>'; } },
    { id: 'sleepy', f: function (ink) { return '<path d="M-12 -1 Q0 9 12 -1"' + stroke(ink, 4.5) + '/><path d="M-12 -1 L-16 -5"' + stroke(ink, 3) + '/>'; } },
    { id: 'wink', f: function (ink, hi, col, side) {
      if (side < 0) return '<ellipse rx="9" ry="12" fill="' + ink + '"/><circle cx="3" cy="-4.5" r="3.2" fill="' + hi + '"/>';
      return '<path d="M10 -8 L-8 0 L10 8"' + stroke(ink, 4.5) + '/>';
    } },
    { id: 'heart', f: function (ink, hi) { return '<path d="M0 12 C-18 0 -15 -14 -6.5 -13 C-2.5 -13 0 -9.5 0 -7 C0 -9.5 2.5 -13 6.5 -13 C15 -14 18 0 0 12Z" fill="#ff5c8a" stroke="' + ink + '" stroke-width="2.2" stroke-linejoin="round"/><circle cx="-6" cy="-6" r="2.4" fill="#fff" opacity=".85"/>'; } },
    { id: 'star', f: function (ink) { return '<path d="M0 -15 L4.4 -5 L15 -4.6 L6.8 2.4 L9.4 13 L0 7 L-9.4 13 L-6.8 2.4 L-15 -4.6 L-4.4 -5Z" fill="#ffd23f" stroke="' + ink + '" stroke-width="2.2" stroke-linejoin="round"/>'; } },
    { id: 'swirl', f: function (ink) { return '<path d="M0 0 C0 -3 4 -3 4 0 C4 5 -5 5 -5 0 C-5 -8 8 -8 8 0 C8 10 -9 11 -10 0 C-10 -12 12 -13 12 -1"' + stroke(ink, 3.2) + '/>'; } },
    { id: 'cross', f: function (ink) { return '<path d="M-8 -8 L8 8 M8 -8 L-8 8"' + stroke(ink, 5) + '/>'; } },
    { id: 'teary', f: function (ink, hi, col, side) {
      return '<ellipse rx="12" ry="14" fill="' + ink + '"/><circle cx="3.5" cy="-5" r="4.6" fill="' + hi + '"/><circle cx="-4" cy="5" r="2.2" fill="' + hi + '"/>' +
        '<path d="M' + (side * 9) + ' 11 C' + (side * 5) + ' 17 ' + (side * 6) + ' 23 ' + (side * 10) + ' 23 C' + (side * 14) + ' 23 ' + (side * 14) + ' 17 ' + (side * 9) + ' 11Z" fill="#8fd3ff" stroke="#3f8fc4" stroke-width="1.5"/>';
    } }
  ];
  var MOUTHS = [
    { id: 'smile', f: function (ink) { return '<path d="M-13 -2 Q0 11 13 -2"' + stroke(ink, 4.5) + '/>'; } },
    { id: 'oh', f: function (ink, col) { return '<ellipse cy="2" rx="8" ry="10" fill="' + col.mouth + '" stroke="' + ink + '" stroke-width="3"/><ellipse cy="7" rx="4.5" ry="3" fill="#ff7a9a"/>'; } },
    { id: 'tongue', f: function (ink) { return '<path d="M-3 3 Q-4 15 3 15 Q9 14 7 2Z" fill="#ff7a9a" stroke="' + ink + '" stroke-width="2.4" stroke-linejoin="round"/><path d="M-14 -2 Q0 10 14 -2"' + stroke(ink, 4.5) + '/>'; } },
    { id: 'cat', f: function (ink) { return '<path d="M-14 -3 Q-7 8 0 0 Q7 8 14 -3"' + stroke(ink, 4.2) + '/>'; } },
    { id: 'fang', f: function (ink, col) { return '<path d="M-16 -4 Q0 17 16 -4 Q0 2 -16 -4Z" fill="' + col.mouth + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><path d="M5 -1 L11 -1.6 L8 6Z" fill="#fff" stroke="' + ink + '" stroke-width="1.6" stroke-linejoin="round"/>'; } },
    { id: 'wobble', f: function (ink) { return '<path d="M-16 2 Q-10.5 -6 -5.3 2 Q0 9 5.3 2 Q10.5 -6 16 2"' + stroke(ink, 4) + '/>'; } },
    { id: 'laugh', f: function (ink, col) { return '<path d="M-16 -6 L16 -6 Q15 16 0 17 Q-15 16 -16 -6Z" fill="' + col.mouth + '" stroke="' + ink + '" stroke-width="3" stroke-linejoin="round"/><path d="M-8 12 Q0 5 8 12 Q0 17 -8 12Z" fill="#ff7a9a"/>'; } },
    { id: 'tiny', f: function (ink) { return '<ellipse rx="4" ry="3.2" fill="' + ink + '"/>'; } },
    { id: 'kiss', f: function (ink) { return '<path d="M-3 -9 Q8 -7 1 -1 Q9 4 -3 8"' + stroke(ink, 4) + '/>'; } },
    { id: 'boo', f: function (ink, col) { return '<ellipse cy="5" rx="12" ry="15" fill="' + col.mouth + '" stroke="' + ink + '" stroke-width="3"/><ellipse cy="13" rx="7" ry="4.5" fill="#ff7a9a"/>'; } }
  ];
  var CHEEKS = [
    { id: 'none', f: function () { return ''; } },
    { id: 'blush', f: function () { return '<ellipse rx="11" ry="6.5" fill="#ff8fb4" opacity=".72"/>'; } },
    { id: 'shy', f: function () { return '<path d="M-6 -5 L-10 5 M0 -5 L-4 5 M6 -5 L2 5" fill="none" stroke="#ff6f9c" stroke-width="2.6" stroke-linecap="round"/>'; } },
    { id: 'sparkle', f: function () { return '<path d="M0 -8 Q1.2 -1.2 8 0 Q1.2 1.2 0 8 Q-1.2 1.2 -8 0 Q-1.2 -1.2 0 -8Z" fill="#ffd23f" stroke="#c98f00" stroke-width="1.2" stroke-linejoin="round"/><circle cx="9" cy="-7" r="2" fill="#ffd23f"/>'; } }
  ];
  var HATS = ['none', 'witch', 'bow', 'crown', 'headphones', 'pumpkin', 'batwings', 'halo'];
  var ITEMS = ['none', 'lantern', 'candy', 'balloon', 'broom', 'cat'];
  var BGS = ['night', 'house', 'graveyard', 'plain'];

  var COUNTS = { b: SHAPES.length, c: COLORS.length, e: EYES.length, m: MOUTHS.length, k: CHEEKS.length, h: HATS.length, i: ITEMS.length, g: BGS.length };
  var KEYS = ['b', 'c', 'e', 'm', 'k', 'h', 'i', 'g'];
  // 편집기 탭 순서 (UI 문구는 언어 파일 editor.tabs.<id>)
  var PARTS = [
    { id: 'body', key: 'b' }, { id: 'color', key: 'c' }, { id: 'eyes', key: 'e' }, { id: 'mouth', key: 'm' },
    { id: 'cheeks', key: 'k' }, { id: 'hat', key: 'h' }, { id: 'item', key: 'i' }, { id: 'bg', key: 'g' }
  ];
  var DEFAULT = { b: 0, c: 0, e: 0, m: 0, k: 1, h: 0, i: 0, g: 0, name: '' };

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

  // 모든 부품을 무작위로 (이름은 그대로). 모자·들고 있는 것은 2/3 확률로 하나.
  function random(base) {
    var d = copy(base || DEFAULT);
    ['b', 'c', 'e', 'm', 'k', 'g'].forEach(function (k) { d[k] = randomInt(COUNTS[k]); });
    d.h = randomInt(3) === 0 ? 0 : 1 + randomInt(COUNTS.h - 1);
    d.i = randomInt(3) === 0 ? 0 : 1 + randomInt(COUNTS.i - 1);
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
  var STARS = [[36, 150, 1.6], [96, 40, 1.2], [150, 22, 1.8], [250, 34, 1.3], [300, 110, 1.5], [372, 60, 1.8], [380, 196, 1.2], [22, 244, 1.3], [60, 96, 1], [214, 70, 1]];
  var f1 = function (v) { return (Math.round(v * 10) / 10).toString(); };

  function isDark(g) { return g !== 3; }

  // 몸 테두리 path
  function bodyPath(sh) {
    var T = sh.T, w = sh.w, B = sh.B, fw = sh.fw;
    var top = 'M' + f1(CX - w) + ' ' + f1(T + w) +
      ' C' + f1(CX - w) + ' ' + f1(T + w * 0.44) + ' ' + f1(CX - w * 0.56) + ' ' + T + ' ' + CX + ' ' + T +
      ' C' + f1(CX + w * 0.56) + ' ' + T + ' ' + f1(CX + w) + ' ' + f1(T + w * 0.44) + ' ' + f1(CX + w) + ' ' + f1(T + w);
    if (sh.wisp) {
      var y = T + w;
      return top +
        ' C' + f1(CX + w) + ' ' + (y + 50) + ' ' + f1(CX + w - 8) + ' ' + (y + 92) + ' ' + (CX + 30) + ' ' + (y + 118) +
        ' C' + (CX + 58) + ' ' + (y + 136) + ' ' + (CX + 92) + ' ' + (y + 128) + ' ' + (CX + 102) + ' ' + (y + 102) +
        ' C' + (CX + 96) + ' ' + (y + 150) + ' ' + (CX + 20) + ' ' + (y + 164) + ' ' + (CX - 26) + ' ' + (y + 130) +
        ' C' + f1(CX - w + 2) + ' ' + (y + 100) + ' ' + f1(CX - w) + ' ' + (y + 52) + ' ' + f1(CX - w) + ' ' + y + 'Z';
    }
    var side = B - T - w;
    var d = top +
      ' C' + f1(CX + w) + ' ' + f1(T + w + side * 0.35) + ' ' + f1(CX + fw) + ' ' + f1(B - side * 0.4) + ' ' + f1(CX + fw) + ' ' + B;
    var step = (2 * fw) / sh.n;
    for (var i = 0; i < sh.n; i++) {
      var x0 = CX + fw - i * step;
      var x1 = x0 - step;
      var yEnd = i === sh.n - 1 ? B : B - sh.dep * 0.45;
      d += ' Q' + f1(x0 - step / 2) + ' ' + f1(B + sh.dep * 1.25) + ' ' + f1(x1) + ' ' + f1(yEnd);
    }
    d += ' C' + f1(CX - fw) + ' ' + f1(B - side * 0.4) + ' ' + f1(CX - w) + ' ' + f1(T + w + side * 0.35) + ' ' + f1(CX - w) + ' ' + f1(T + w) + 'Z';
    return d;
  }
  // 팔 위치 (오른손 = 들고 있는 것의 원점)
  function armsOf(sh) {
    var ay = sh.wisp ? sh.T + sh.w + 30 : sh.T + sh.w + (sh.B - sh.T - sh.w) * 0.28;
    var aw = sh.wisp ? sh.w : sh.w + (sh.fw - sh.w) * 0.3;
    return { ay: ay, aw: aw, hx: CX + aw + 16, hy: ay - 4 };
  }

  function background(g, P) {
    if (g === 0) { // 별이 뜬 밤하늘
      return '<rect width="400" height="400" fill="url(#' + P + '-bg)"/>' +
        STARS.map(function (s) { return '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="#fff3c4" opacity=".85"/>'; }).join('') +
        '<circle cx="330" cy="66" r="28" fill="#fff3c4" opacity=".9"/><circle cx="342" cy="58" r="24" fill="#2a1656"/>';
    }
    if (g === 1) { // 유령의 집
      return '<rect width="400" height="400" fill="url(#' + P + '-bg)"/>' +
        STARS.slice(0, 6).map(function (s) { return '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="#fff3c4" opacity=".7"/>'; }).join('') +
        '<circle cx="320" cy="72" r="34" fill="#ffe7a8" opacity=".92"/>' +
        '<path d="M0 318 Q90 286 170 306 Q260 330 400 300 V400 H0Z" fill="#150c2c"/>' +
        '<g fill="#1d1238" stroke="#0c0620" stroke-width="2" stroke-linejoin="round">' +
        '<path d="M22 312 L22 214 L12 214 L56 170 L100 214 L90 214 L90 312Z"/>' +
        '<path d="M38 206 L38 150 L30 150 L50 124 L70 150 L62 150 L62 206Z"/></g>' +
        '<g fill="#ffd23f"><rect x="34" y="228" width="12" height="16" rx="2"/><rect x="66" y="228" width="12" height="16" rx="2" opacity=".55"/>' +
        '<rect x="45" y="160" width="10" height="13" rx="5"/><rect x="48" y="272" width="16" height="40" rx="7" fill="#3a2366"/></g>' +
        '<path d="M110 118 q10 -10 20 0 q10 -10 20 0 q-10 4 -20 2 q-10 2 -20 -2Z" fill="#0c0620" opacity=".8"/>';
    }
    if (g === 2) { // 무덤가
      return '<rect width="400" height="400" fill="url(#' + P + '-bg)"/>' +
        STARS.slice(2, 8).map(function (s) { return '<circle cx="' + s[0] + '" cy="' + s[1] + '" r="' + s[2] + '" fill="#e8f4ff" opacity=".7"/>'; }).join('') +
        '<circle cx="74" cy="70" r="30" fill="#e8f4ff" opacity=".88"/>' +
        '<path d="M0 334 Q200 314 400 334 V400 H0Z" fill="#0f1a2e"/>' +
        '<g stroke="#27354f" stroke-width="3" stroke-linecap="round"><path d="M0 318 H400" opacity=".6"/>' +
        [12, 44, 76, 108, 292, 324, 356, 388].map(function (x) { return '<path d="M' + x + ' 336 V300"/>'; }).join('') + '</g>' +
        '<g fill="#3a4a66" stroke="#18233a" stroke-width="3" stroke-linejoin="round">' +
        '<path d="M26 344 V296 Q26 272 50 272 Q74 272 74 296 V344Z"/>' +
        '<path d="M340 342 V312 Q340 296 356 296 Q372 296 372 312 V342Z"/>' +
        '<path d="M86 346 V318 H76 V306 H86 V296 H98 V306 H108 V318 H98 V346Z"/></g>' +
        '<path d="M40 292 H60 M50 284 V306" stroke="#18233a" stroke-width="3" stroke-linecap="round"/>' +
        '<ellipse cx="120" cy="352" rx="130" ry="14" fill="#e8f4ff" opacity=".08"/><ellipse cx="300" cy="360" rx="120" ry="12" fill="#e8f4ff" opacity=".07"/>';
    }
    // 밝은 배경
    return '<rect width="400" height="400" fill="url(#' + P + '-bg)"/>' +
      '<g fill="#ffffff" opacity=".7"><circle cx="64" cy="80" r="4"/><circle cx="330" cy="60" r="3"/><circle cx="354" cy="250" r="4"/><circle cx="44" cy="286" r="3"/></g>' +
      '<g fill="#c9b8ff" opacity=".55"><path d="M84 132 Q86 124 88 132 Q96 134 88 136 Q86 144 84 136 Q76 134 84 132Z"/><path d="M314 150 Q316 142 318 150 Q326 152 318 154 Q316 162 314 154 Q306 152 314 150Z"/></g>';
  }
  function bgDefs(g, P) {
    if (g === 0) return '<radialGradient id="' + P + '-bg" cx=".5" cy=".35" r=".85"><stop offset="0" stop-color="#3b2272"/><stop offset=".55" stop-color="#1d1040"/><stop offset="1" stop-color="#0e0822"/></radialGradient>';
    if (g === 1) return '<linearGradient id="' + P + '-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1a5e"/><stop offset=".7" stop-color="#5a2a6e"/><stop offset="1" stop-color="#8a3f62"/></linearGradient>';
    if (g === 2) return '<linearGradient id="' + P + '-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a38"/><stop offset=".75" stop-color="#1f3a5a"/><stop offset="1" stop-color="#2d4f6a"/></linearGradient>';
    return '<linearGradient id="' + P + '-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1eaff"/><stop offset="1" stop-color="#ffe2ef"/></linearGradient>';
  }
  var BG_FILL = ['#0e0822', '#8a3f62', '#2d4f6a', '#ffe2ef']; // PNG 아래쪽 여백 색

  // 모자·장식: 머리 꼭대기 (CX, T) 기준, 반지름 92 짜리 머리 좌표로 그린 뒤 w/92 배율
  function hatFront(h) {
    if (h === 1) { // 마녀 모자
      return '<g transform="rotate(-8)" stroke="#140a24" stroke-width="4" stroke-linejoin="round">' +
        '<ellipse cx="0" cy="12" rx="76" ry="14" fill="#2d1b4e"/>' +
        '<path d="M-44 8 Q0 -2 44 8 L18 -52 Q22 -72 46 -80 Q10 -78 -6 -56 Z" fill="#3a2366"/>' +
        '<path d="M-39 -4 Q0 -14 39 -4 L35 7 Q0 -2 -42 7Z" fill="#9f86ff" stroke-width="3"/>' +
        '<rect x="-8" y="-11" width="16" height="14" rx="3" fill="#ffd23f" stroke-width="3"/></g>';
    }
    if (h === 2) { // 리본
      return '<g transform="translate(52 22) rotate(22)" stroke="#8f1c43" stroke-width="3.5" stroke-linejoin="round">' +
        '<path d="M0 0 C-20 -24 -38 -12 -34 4 C-30 18 -12 12 0 0Z" fill="#ff5c8a"/>' +
        '<path d="M0 0 C20 -24 38 -12 34 4 C30 18 12 12 0 0Z" fill="#ff5c8a"/>' +
        '<path d="M-4 4 L-12 24 M4 4 L12 24" fill="none" stroke="#ff5c8a" stroke-width="6" stroke-linecap="round"/>' +
        '<ellipse cx="0" cy="0" rx="8" ry="9" fill="#ff8fb0"/></g>';
    }
    if (h === 3) { // 왕관
      return '<g stroke="#9a6a00" stroke-width="4" stroke-linejoin="round">' +
        '<path d="M-32 8 L-36 -28 L-14 -8 L0 -40 L14 -8 L36 -28 L32 8 Q0 0 -32 8Z" fill="#ffd23f"/>' +
        '<circle cx="0" cy="-8" r="6" fill="#e0457b" stroke-width="2.5"/>' +
        '<circle cx="-20" cy="0" r="4" fill="#5fc1e8" stroke-width="2"/><circle cx="20" cy="0" r="4" fill="#5fc1e8" stroke-width="2"/></g>';
    }
    if (h === 4) { // 헤드폰
      return '<g stroke="#1a1238" stroke-width="4" stroke-linejoin="round">' +
        '<path d="M-96 86 C-96 -20 96 -20 96 86" fill="none" stroke="#3a2366" stroke-width="11" stroke-linecap="round"/>' +
        '<path d="M-96 86 C-96 -20 96 -20 96 86" fill="none" stroke="#9f86ff" stroke-width="4" stroke-linecap="round"/>' +
        '<rect x="-112" y="64" width="28" height="46" rx="12" fill="#ff5c8a"/><rect x="84" y="64" width="28" height="46" rx="12" fill="#ff5c8a"/>' +
        '<rect x="-106" y="72" width="10" height="30" rx="5" fill="#ffc2d6" stroke="none"/><rect x="96" y="72" width="10" height="30" rx="5" fill="#ffc2d6" stroke="none"/></g>';
    }
    if (h === 5) { // 호박 모자
      return '<g transform="translate(0 -6) rotate(10)" stroke="#7a3000" stroke-width="3.5">' +
        '<path d="M-2 -22 Q-2 -34 6 -40 L12 -36 Q6 -30 7 -22Z" fill="#7b8a33" stroke="#3e4715" stroke-linejoin="round"/>' +
        '<ellipse cx="-14" cy="-6" rx="17" ry="17" fill="#ff8a1f"/><ellipse cx="14" cy="-6" rx="17" ry="17" fill="#ff8a1f"/>' +
        '<ellipse cx="0" cy="-6" rx="15" ry="19" fill="#ffa23a"/>' +
        '<path d="M8 -36 C20 -46 32 -40 26 -32" fill="none" stroke="#5d9b2f" stroke-width="3.5" stroke-linecap="round"/></g>';
    }
    if (h === 7) { // 천사 고리
      return '<ellipse cx="0" cy="-24" rx="38" ry="10" fill="none" stroke="#ffe07a" stroke-width="11" opacity=".35"/>' +
        '<ellipse cx="0" cy="-24" rx="36" ry="9" fill="none" stroke="#ffd23f" stroke-width="6"/>' +
        '<path d="M-22 -30 Q0 -34 20 -31" fill="none" stroke="#fff6c2" stroke-width="2.5" stroke-linecap="round"/>';
    }
    return '';
  }
  function hatBack(h) {
    if (h !== 6) return '';
    var wing = 'M0 0 C16 -30 46 -40 70 -30 C60 -22 58 -12 62 -2 C50 -8 42 -4 38 6 C30 -2 18 0 12 10 Z';
    return '<g fill="#3a2366" stroke="#140a24" stroke-width="3.5" stroke-linejoin="round">' +
      '<path transform="translate(76 70) rotate(-12)" d="' + wing + '"/>' +
      '<path transform="translate(-76 70) scale(-1 1) rotate(-12)" d="' + wing + '"/></g>';
  }

  // 들고 있는 것: 오른손(hx, hy) 기준
  function itemSvg(i) {
    if (i === 1) { // 등불
      return '<path d="M0 0 Q10 6 6 18" fill="none" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="6" cy="40" r="26" fill="#ffd23f" opacity=".18"/>' +
        '<g stroke="#2b1a0c" stroke-width="3" stroke-linejoin="round"><rect x="-6" y="18" width="24" height="6" rx="2" fill="#4a3320"/>' +
        '<rect x="-8" y="24" width="28" height="30" rx="6" fill="#ffe07a"/><rect x="-6" y="54" width="24" height="6" rx="2" fill="#4a3320"/></g>' +
        '<path d="M6 30 Q12 38 6 46 Q0 38 6 30Z" fill="#ff9214"/><path d="M-1 26 V52 M13 26 V52" stroke="#2b1a0c" stroke-width="2" opacity=".5"/>';
    }
    if (i === 2) { // 막대사탕
      return '<path d="M0 2 L8 -38" stroke="#f4efe6" stroke-width="5" stroke-linecap="round"/><path d="M0 2 L8 -38" stroke="#b9ad9a" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>' +
        '<circle cx="10" cy="-54" r="18" fill="#ff8fb4" stroke="#b03a6a" stroke-width="3"/>' +
        '<path d="M10 -54 C10 -58 16 -58 16 -53 C16 -46 4 -46 4 -54 C4 -64 22 -64 22 -52 C22 -40 -2 -40 -3 -54" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>';
    }
    if (i === 3) { // 풍선
      return '<path d="M0 0 C8 -30 -4 -64 6 -96" fill="none" stroke="#6b5f8f" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M6 -96 L1 -88 L11 -88Z" fill="#ff7a1f" stroke="#a34700" stroke-width="2" stroke-linejoin="round"/>' +
        '<ellipse cx="6" cy="-120" rx="22" ry="26" fill="#ff8a1f" stroke="#a34700" stroke-width="3"/>' +
        '<path d="M-5 -133 Q-1 -141 6 -142" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
        '<path d="M-2 -122 L2 -128 L6 -122Z M8 -122 L12 -128 L16 -122Z M-2 -113 Q7 -106 16 -113" fill="#5a2400" stroke="#5a2400" stroke-width="1.6" stroke-linejoin="round"/>';
    }
    if (i === 4) { // 빗자루
      return '<path d="M-34 52 L30 -64" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/><path d="M-34 52 L30 -64" stroke="#b07a40" stroke-width="2.5" stroke-linecap="round"/>' +
        '<path d="M-30 44 L-44 50 Q-66 80 -62 92 Q-50 84 -40 80 Q-44 90 -36 96 Q-30 80 -24 70 Q-20 58 -30 44Z" fill="#e6b04a" stroke="#8a5a14" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M-38 50 L-30 58" stroke="#b03a6a" stroke-width="5" stroke-linecap="round"/>';
    }
    return '';
  }
  function catSvg() { // 검은 고양이 친구 (땅 위, 오른쪽 아래)
    return '<g transform="translate(336 296) scale(1.3)" stroke="#07040f" stroke-width="3" stroke-linejoin="round">' +
      '<path d="M22 44 C44 44 48 22 36 14 C30 10 30 20 36 22" fill="none" stroke="#1b1030" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M-22 48 C-26 20 -16 4 0 4 C16 4 26 20 22 48Z" fill="#1b1030"/>' +
      '<path d="M-18 -8 L-16 -30 L-4 -16 L4 -16 L16 -30 L18 -8 C18 8 10 14 0 14 C-10 14 -18 8 -18 -8Z" fill="#1b1030"/>' +
      '<ellipse cx="-7" cy="-4" rx="3.6" ry="4.6" fill="#ffd23f" stroke="none"/><ellipse cx="7" cy="-4" rx="3.6" ry="4.6" fill="#ffd23f" stroke="none"/>' +
      '<path d="M-2 4 L2 4 L0 6.5Z" fill="#ff8fb4" stroke="none"/></g>';
  }

  // 얼굴 (얼굴 좌표)
  function faceSvg(d, col) {
    var eye = EYES[d.e];
    var ch = CHEEKS[d.k];
    var out = '';
    if (d.k) out += '<g transform="translate(-47 20)">' + ch.f(col) + '</g><g transform="translate(47 20) scale(-1 1)">' + ch.f(col) + '</g>';
    out += '<g transform="translate(-30 0)">' + eye.f(col.ink, col.hi, col, -1) + '</g>';
    out += '<g transform="translate(30 0)">' + eye.f(col.ink, col.hi, col, 1) + '</g>';
    out += '<g transform="translate(0 34)">' + MOUTHS[d.m].f(col.ink, col) + '</g>';
    return out;
  }

  function render(design, opt) {
    var d = normalize(design) || defaults();
    opt = opt || {};
    var P = String(opt.prefix || 'gh').replace(/[^a-z0-9_-]/gi, '');
    var sh = SHAPES[d.b];
    var col = COLORS[d.c];
    var dark = isDark(d.g);
    var blank = !!opt.blank;
    var fx = !!col.halo && !opt.simple && !blank;
    var hs = sh.w / 92;
    var arm = armsOf(sh);
    var body = bodyPath(sh);
    var out = [];

    out.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"' + (opt.attrs || '') + '>');
    out.push('<defs>');
    out.push(bgDefs(d.g, P));
    if (blank) out.push('<radialGradient id="' + P + '-body" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#4b3d8a"/><stop offset="1" stop-color="#241a4d"/></radialGradient>');
    else out.push('<radialGradient id="' + P + '-body" cx=".4" cy=".28" r=".85"><stop offset="0" stop-color="' + col.light + '"/><stop offset=".6" stop-color="' + col.base + '"/><stop offset="1" stop-color="' + col.shade + '"/></radialGradient>');
    var haloColor = blank ? '#b9a6ff' : (col.halo || '#ffffff');
    out.push('<radialGradient id="' + P + '-halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="' + haloColor + '" stop-opacity=".5"/><stop offset=".6" stop-color="' + haloColor + '" stop-opacity=".14"/><stop offset="1" stop-color="' + haloColor + '" stop-opacity="0"/></radialGradient>');
    if (fx) out.push('<filter id="' + P + '-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>');
    out.push('</defs>');

    out.push(background(d.g, P));
    // 그림자 (둥실 떠 있는 느낌: 몸 아래로 조금 떨어져서)
    out.push('<ellipse class="gh-shadow" cx="200" cy="356" rx="' + Math.round(sh.fw * 0.78) + '" ry="11" fill="#000" opacity="' + (dark ? '.32' : '.12') + '"/>');
    if (col.halo || blank || (dark && !opt.simple)) {
      var hr = Math.round(sh.w + (col.halo || blank ? 86 : 50));
      out.push('<circle cx="200" cy="' + Math.round(sh.T + sh.w) + '" r="' + hr + '" fill="url(#' + P + '-halo)"' + (col.halo || blank ? '' : ' opacity=".35"') + '/>');
    }

    out.push('<g class="gh-float">');
    // 뒤쪽 장식(박쥐 날개)
    if (!blank) out.push('<g transform="translate(' + CX + ' ' + sh.T + ') scale(' + f1(hs * 100) / 100 + ')">' + hatBack(d.h) + '</g>');
    var fill = 'url(#' + P + '-body)';
    var line = blank ? '#8f7fd6' : col.line;
    // 팔 (몸 뒤에서 튀어나옴): 왼팔은 인사, 오른팔은 물건 들기
    out.push('<g fill="' + fill + '" stroke="' + line + '" stroke-width="4.5">' +
      '<ellipse cx="' + f1(CX - arm.aw - 4) + '" cy="' + f1(arm.ay - 8) + '" rx="20" ry="11" transform="rotate(-38 ' + f1(CX - arm.aw - 4) + ' ' + f1(arm.ay - 8) + ')"/>' +
      '<ellipse cx="' + f1(CX + arm.aw + 5) + '" cy="' + f1(arm.ay) + '" rx="20" ry="11" transform="rotate(-22 ' + f1(CX + arm.aw + 5) + ' ' + f1(arm.ay) + ')"/></g>');
    // 몸
    out.push('<path d="' + body + '" fill="' + fill + '" stroke="' + line + '" stroke-width="5" stroke-linejoin="round"' + (fx ? ' filter="url(#' + P + '-glow)"' : '') + '/>');
    // 윤기
    out.push('<path d="M' + f1(CX - sh.w * 0.62) + ' ' + f1(sh.T + sh.w * 0.62) + ' Q' + f1(CX - sh.w * 0.55) + ' ' + f1(sh.T + sh.w * 0.2) + ' ' + f1(CX - sh.w * 0.18) + ' ' + f1(sh.T + sh.w * 0.12) + '" fill="none" stroke="#fff" stroke-width="' + f1(Math.max(4, sh.w * 0.07)) + '" stroke-linecap="round" opacity="' + (blank ? '.14' : '.55') + '"/>');

    if (blank) {
      // 물음표 (아직 모르는 유령)
      out.push('<g transform="translate(200 ' + sh.fy + ')" fill="none" stroke="#d9ccff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M-17 -18 Q-17 -40 1 -40 Q20 -40 20 -21 Q20 -8 5 -1 Q0 3 0 14"/><circle cx="0" cy="34" r="3" fill="#d9ccff"/></g>');
      out.push('</g></svg>');
      return out.join('');
    }

    // 얼굴
    out.push('<g class="gh-face" transform="translate(200 ' + sh.fy + ') scale(' + sh.fs + ')">' + faceSvg(d, col) + '</g>');
    // 앞쪽 장식
    if (d.h !== 6) out.push('<g transform="translate(' + CX + ' ' + sh.T + ') scale(' + f1(hs * 100) / 100 + ')">' + hatFront(d.h) + '</g>');
    // 들고 있는 것
    if (d.i && d.i !== 5) {
      var is = Math.max(1, Math.min(1.3, sh.w / 92 * 1.25));
      out.push('<g transform="translate(' + f1(arm.hx) + ' ' + f1(arm.hy) + ') scale(' + f1(is * 100) / 100 + ')">' + itemSvg(d.i) + '</g>');
    }
    out.push('</g>');
    if (d.i === 5) out.push(catSvg());
    out.push('</svg>');
    return out.join('');
  }

  // 눈·입·볼 고르기 버튼용 확대 그림 (100×100, 유령 색 바탕)
  function thumb(kind, index, opt) {
    opt = opt || {};
    var col = COLORS[opt.color] || COLORS[0];
    var inner;
    var empty = false;
    if (kind === 'eyes') {
      var eye = EYES[index];
      inner = '<g transform="translate(50 50) scale(1.15)"><g transform="translate(-22 0)">' + eye.f(col.ink, col.hi, col, -1) + '</g><g transform="translate(22 0)">' + eye.f(col.ink, col.hi, col, 1) + '</g></g>';
    } else if (kind === 'mouth') {
      inner = '<g transform="translate(50 46) scale(2)">' + MOUTHS[index].f(col.ink, col) + '</g>';
    } else {
      empty = index === 0;
      inner = '<g transform="translate(50 46) scale(.62)"><g transform="translate(-30 0)">' + EYES[0].f(col.ink, col.hi, col, -1) + '</g><g transform="translate(30 0)">' + EYES[0].f(col.ink, col.hi, col, 1) + '</g>' +
        '<g transform="translate(0 34)">' + MOUTHS[0].f(col.ink, col) + '</g></g>' +
        (empty ? '' : '<g transform="translate(20 64) scale(1.1)">' + CHEEKS[index].f(col) + '</g><g transform="translate(80 64) scale(-1.1 1.1)">' + CHEEKS[index].f(col) + '</g>');
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true">' +
      '<rect x="3" y="3" width="94" height="94" rx="30" fill="' + col.base + '" stroke="' + col.line + '" stroke-width="3"/>' +
      inner +
      (empty ? '<path d="M70 70 L86 86 M86 70 L70 86" stroke="' + col.line + '" stroke-width="4" stroke-linecap="round" opacity=".55"/>' : '') +
      '</svg>';
  }

  return {
    SHAPES: SHAPES, COLORS: COLORS, EYES: EYES, MOUTHS: MOUTHS, CHEEKS: CHEEKS, HATS: HATS, ITEMS: ITEMS, BGS: BGS, BG_FILL: BG_FILL,
    COUNTS: COUNTS, KEYS: KEYS, PARTS: PARTS, MAX_NAME: MAX_NAME,
    defaults: defaults, normalize: normalize, cleanName: cleanName, random: random, cycle: cycle, copy: copy, same: same,
    encode: encode, decode: decode, render: render, thumb: thumb, randomInt: randomInt, isDark: isDark
  };
});
