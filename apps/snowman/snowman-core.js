/* apps/snowman/snowman-core.js — 눈사람 만들기 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="snowman-core.js">)와 Node(tools/check-snowman.js)가 같은 코드를 쓴다.
 *
 * 눈사람 = { b 몸(눈덩이), e 눈, m 입, n 코, h 모자, s 목도리 색, p 무늬, a 팔, x 비트(1 빗자루 · 2 단추 · 4 새 · 8 반짝이), g 배경, t 이름 }
 * 공유 링크: #d=<UTF-8 base64url( {"v":1,"b":0,"e":0,…,"t":".."} )> — 빈 이름은 키째 생략. 서버 저장 없음.
 * 그림은 snowman.js 가 canvas 로 그린다. 여기에는 선택지 목록, 눈덩이 배치(layout), 무작위(seeded), 눈송이, 글 정리·검증·인코딩, 줄바꿈만 둔다.
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  else root.SNOWMAN_CORE = core;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var W = 1080;
  var H = 1350;
  var CX = W / 2;
  var GROUND = 1170; // 눈사람이 서는 땅 높이
  var LIMITS = { t: 20 };
  // 몸: r = 아래→위 눈덩이 반지름, k = 겹침(다음 공 중심 거리 = (r1 + r2) × k)
  var BODIES = [
    { id: 'classic', r: [215, 160, 120], k: 0.82 },
    { id: 'duo', r: [240, 168], k: 0.82 },
    { id: 'chubby', r: [250, 172, 112], k: 0.8 },
    { id: 'slim', r: [175, 140, 115], k: 0.9 },
  ];
  var EYES = [{ id: 'coal' }, { id: 'buttons' }, { id: 'sparkly' }, { id: 'sleepy' }];
  var MOUTHS = [{ id: 'pebbles' }, { id: 'smile' }, { id: 'grin' }, { id: 'oh' }];
  var NOSES = [{ id: 'carrot' }, { id: 'long' }, { id: 'berry' }, { id: 'pinecone' }];
  var HATS = [{ id: 'top' }, { id: 'beanie' }, { id: 'santa' }, { id: 'bucket' }, { id: 'earmuffs' }, { id: 'none' }];
  var SCARVES = [
    { id: 'red', c: '#e23d4f' },
    { id: 'green', c: '#2e9e5b' },
    { id: 'blue', c: '#3d7bff' },
    { id: 'yellow', c: '#f4c430' },
    { id: 'purple', c: '#8e5cf0' },
    { id: 'none', c: '' },
  ];
  var PATTERNS = [{ id: 'solid' }, { id: 'stripes' }, { id: 'dots' }];
  var ARMS = [{ id: 'twigs' }, { id: 'mittens' }, { id: 'wave' }, { id: 'none' }];
  var EXTRAS = [{ id: 'broom', bit: 1 }, { id: 'buttons', bit: 2 }, { id: 'bird', bit: 4 }, { id: 'flakes', bit: 8 }];
  var ALL_X = 15;
  var SCENES = [{ id: 'night' }, { id: 'sunny' }, { id: 'village' }];
  // 단계 (편집 화면 순서) — 그룹 키는 위 필드
  var STEPS = [
    { id: 'body', groups: ['b'] },
    { id: 'face', groups: ['e', 'm'] },
    { id: 'nose', groups: ['n'] },
    { id: 'hat', groups: ['h'] },
    { id: 'scarf', groups: ['s', 'p'] },
    { id: 'arms', groups: ['a'] },
    { id: 'extras', groups: ['x'] },
    { id: 'scene', groups: ['g'] },
    { id: 'name', groups: ['t'] },
  ];
  var FIELDS = { b: BODIES, e: EYES, m: MOUTHS, n: NOSES, h: HATS, s: SCARVES, p: PATTERNS, a: ARMS, g: SCENES };
  var KEYS = ['b', 'e', 'm', 'n', 'h', 's', 'p', 'a', 'x', 'g'];

  // ---------------------------------------------------------------
  // 글 정리
  // ---------------------------------------------------------------
  function cleanText(s, max) {
    var str = String(s == null ? '' : s)
      .replace(/[\u0000-\u001f\u007f-\u009f\u200b\u200c\u200e\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ')
      .replace(/<[^<>]*>/g, '')
      .replace(/[<>]/g, '')
      .replace(/[ \t\n\r\f\v\u1680\u2000-\u200a\u2028\u2029\u205f\u3000]+/g, ' ') // \u00a0·\u202f(프랑스어 ?! 앞 좁은 공백)는 남긴다
      .replace(/^ +| +$/g, '');
    var chars = Array.from(str);
    if (chars.length > max) str = chars.slice(0, max).join('').trim();
    return str;
  }
  function validIndex(v, n) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= 0 && v < n; }
  function size(k) { return k === 'x' ? ALL_X + 1 : FIELDS[k].length; }

  // 쓸 수 있는 눈사람이면 새 객체, 아니면 null
  function normalize(o) {
    if (!o || typeof o !== 'object') return null;
    var out = {};
    for (var i = 0; i < KEYS.length; i++) {
      var k = KEYS[i];
      if (!validIndex(o[k], size(k))) return null;
      out[k] = o[k];
    }
    if (o.t != null && typeof o.t !== 'string') return null;
    out.t = cleanText(o.t, LIMITS.t);
    return out;
  }
  function copy(o) {
    var out = {};
    KEYS.forEach(function (k) { out[k] = o[k]; });
    out.t = o.t || '';
    return out;
  }
  function defaults() { return { b: 0, e: 0, m: 0, n: 0, h: 0, s: 0, p: 1, a: 0, x: 2, g: 0, t: '' }; }
  function hasExtra(o, id) {
    for (var i = 0; i < EXTRAS.length; i++) if (EXTRAS[i].id === id) return (o.x & EXTRAS[i].bit) !== 0;
    return false;
  }
  function same(a, b) {
    var na = normalize(a);
    var nb = normalize(b);
    if (!na || !nb) return false;
    return KEYS.every(function (k) { return na[k] === nb[k]; }) && na.t === nb.t;
  }

  // ---------------------------------------------------------------
  // 무작위 (seeded)
  // ---------------------------------------------------------------
  function rng(seed) {
    var s = (seed * 2654435761 + 12345) >>> 0 || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  // 이름은 그대로 두고 나머지를 무작위로. 모자 없음·목도리 없음·팔 없음은 덜 자주.
  function randomize(seed, keep) {
    var r = rng(seed);
    var pick = function (n, rare) { var v = Math.floor(r() * n); if (rare != null && v === rare && r() < 0.6) v = Math.floor(r() * (n - 1)); return v; };
    var x = 0;
    EXTRAS.forEach(function (e) { if (r() < (e.id === 'buttons' ? 0.7 : 0.4)) x |= e.bit; });
    return {
      b: pick(BODIES.length), e: pick(EYES.length), m: pick(MOUTHS.length), n: pick(NOSES.length),
      h: pick(HATS.length, HATS.length - 1), s: pick(SCARVES.length, SCARVES.length - 1), p: pick(PATTERNS.length),
      a: pick(ARMS.length, ARMS.length - 1), x: x, g: pick(SCENES.length), t: keep && keep.t ? keep.t : '',
    };
  }

  // ---------------------------------------------------------------
  // 눈덩이 배치: [{x, y, r}] 아래→위, head = 맨 위, torso = 팔·단추가 붙는 공
  // ---------------------------------------------------------------
  function layout(b) {
    var B = BODIES[b];
    var balls = [];
    var y = GROUND - B.r[0] * 0.92;
    for (var i = 0; i < B.r.length; i++) {
      if (i) y -= (B.r[i - 1] + B.r[i]) * B.k;
      balls.push({ x: CX, y: y, r: B.r[i] });
    }
    var head = balls[balls.length - 1];
    var torso = balls.length >= 3 ? balls[1] : balls[0];
    return { balls: balls, head: head, torso: torso, top: head.y - head.r, ground: GROUND };
  }

  function snowflakes(seed, n) {
    var rnd = rng(seed);
    var out = [];
    for (var i = 0; i < n; i++) out.push({ x: rnd() * W, y: rnd() * H, r: 2.5 + rnd() * 7, a: 0.45 + rnd() * 0.5, sp: 26 + rnd() * 46, dr: rnd() * Math.PI * 2 });
    return out;
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
  var MAX_HASH = 400;
  function encode(o) {
    var x = normalize(o);
    if (!x) return null;
    var p = { v: 1 };
    KEYS.forEach(function (k) { p[k] = x[k]; });
    if (x.t) p.t = x.t;
    return b64urlEncode(JSON.stringify(p));
  }
  function decode(str) {
    if (!str || typeof str !== 'string' || str.length > MAX_HASH || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || typeof p !== 'object' || Array.isArray(p) || p.v !== 1) return null;
      return normalize(p);
    } catch (e) {
      return null;
    }
  }

  // ---------------------------------------------------------------
  // 줄바꿈 (canvas 용)
  // ---------------------------------------------------------------
  function graphemes(s) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(String(s)), function (x) { return x.segment; });
    }
    return Array.from(String(s));
  }
  // 한 줄에 안 들어가면 글자 단위로 자르고 … 를 붙인다
  function fit(measure, text, maxW) {
    var s = String(text || '');
    if (measure(s) <= maxW) return s;
    var g = graphemes(s);
    while (g.length > 1 && measure(g.join('') + '…') > maxW) g.pop();
    return g.join('').trim() + '…';
  }

  return {
    W: W, H: H, CX: CX, GROUND: GROUND, LIMITS: LIMITS, MAX_HASH: MAX_HASH,
    BODIES: BODIES, EYES: EYES, MOUTHS: MOUTHS, NOSES: NOSES, HATS: HATS, SCARVES: SCARVES, PATTERNS: PATTERNS, ARMS: ARMS,
    EXTRAS: EXTRAS, ALL_X: ALL_X, SCENES: SCENES, STEPS: STEPS, FIELDS: FIELDS, KEYS: KEYS,
    cleanText: cleanText, normalize: normalize, copy: copy, defaults: defaults, hasExtra: hasExtra, same: same,
    rng: rng, randomize: randomize, layout: layout, snowflakes: snowflakes, encode: encode, decode: decode,
    graphemes: graphemes, fit: fit,
  };
});
