/* apps/stack/stack-core.js — 탑 쌓기(Stack Tower) 로직 (언어 무관, UMD: 브라우저 window.STACK_CORE + Node 검사 공용)
 *
 * 좌표(단위 = 게임 단위, 화면 px 아님): 바닥판 BASE×BASE(100×100), 블록 높이 BLOCK_H. 블록 = { x, z, w, d, level }
 *   (x..x+w, z..z+d — 아이소메트릭 화면의 두 바닥 축). 맨 아래 받침 블록이 level 0, 쌓은 블록이 1, 2, 3 …
 *   - 움직이는 블록은 맨 위 블록과 같은 크기로, 한 축(x 또는 z, 한 층마다 번갈아)을 따라 맨 위 블록 위치 기준
 *     offset ∈ [-SPAN, +SPAN] 사이를 왕복한다(벽에 닿으면 반대로). 속도 speed(쌓은 수) = min(MAX_SPEED, BASE_SPEED + SPEED_STEP × 쌓은 수) 단위/초.
 *   - drop(): 움직이는 축에서 맨 위 블록과 겹치는 부분만 남긴다.
 *       |어긋남| ≤ PERFECT_TOL → "퍼펙트": 맨 위 블록 자리에 딱 맞추고 크기 그대로, 연속 퍼펙트(combo) +1.
 *         combo ≥ GROW_AFTER 이면 그 축으로 GROW 만큼 넓어진다(가운데 기준, BASE 넘지 않음).
 *       겹침 > 0 → 겹친 만큼만 남고, 삐져나온 조각(cut)은 떨어진다. combo = 0.
 *       겹침 ≤ 0 → 완전히 빗나감 → 게임 끝(over, 블록 전체가 떨어짐).
 *   - 점수 = 쌓은 블록 수(score). 퍼펙트 수(perfects)·최고 연속 퍼펙트(bestCombo)도 센다.
 *   - 난수는 상태 안의 mulberry32(시드) — 첫 색(hue0)과 각 층의 출발 방향만 정한다(같은 시드 + 같은 입력 = 같은 판).
 * step(state, dt) 은 움직이는 블록을 제자리에서 옮긴다. drop(state) 는 사건({type:'place'|'miss', …})을 돌려준다.
 * 서버 점수 분포(supa.submitScore): bucket(score) = score (0..1999 정수 — 서버 한도 2000 구간 안).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.STACK_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var BASE = 100;            // 받침 블록 크기 (단위)
  var BLOCK_H = 14;          // 블록 높이 (단위)
  var SPAN = 115;            // 움직이는 블록이 맨 위 블록에서 벗어나는 최대 거리 (단위)
  var BASE_SPEED = 120;      // 단위/초 (처음)
  var SPEED_STEP = 4;        // 블록 하나 쌓을 때마다 +단위/초
  var MAX_SPEED = 290;       // 상한
  var PERFECT_TOL = 3;       // 이 이하로 어긋나면 퍼펙트(딱 맞춤)
  var GROW_AFTER = 3;        // 연속 퍼펙트가 이 수 이상이면 넓어짐
  var GROW = 5;              // 한 번에 넓어지는 양 (단위)
  var MIN_SIZE = 0.5;        // 남은 폭이 이보다 작으면 빗나간 것으로 본다(부동소수 찌꺼기)
  var MAX_STEP = 100;        // 한 번에 진행하는 최대 ms (탭 전환·느린 프레임 보호)
  var GAME = 'stack';        // 서버 점수 분포 이름
  var MAX_BUCKET = 1999;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function round3(v) { return Math.round(v * 1000) / 1000; }
  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function speed(stacked) { return Math.min(MAX_SPEED, BASE_SPEED + SPEED_STEP * Math.max(0, stacked)); }
  function axisOf(level) { return level % 2 === 1 ? 'x' : 'z'; }   // 1층 x, 2층 z, 3층 x …
  function sizeKey(axis) { return axis === 'x' ? 'w' : 'd'; }

  // 1차원 겹침: 맨 위 [a, a+len) 와 움직이는 [b, b+len) (같은 길이)
  //   → { delta, perfect, keep:{pos,len}|null, cut:{pos,len}|null }
  function overlap1(a, b, len) {
    var delta = b - a;
    if (Math.abs(delta) <= PERFECT_TOL) return { delta: delta, perfect: true, keep: { pos: a, len: len }, cut: null };
    var keepLen = len - Math.abs(delta);
    if (keepLen < MIN_SIZE) return { delta: delta, perfect: false, keep: null, cut: { pos: b, len: len } };
    if (delta > 0) return { delta: delta, perfect: false, keep: { pos: b, len: keepLen }, cut: { pos: a + len, len: delta } };
    return { delta: delta, perfect: false, keep: { pos: a, len: keepLen }, cut: { pos: b, len: -delta } };
  }

  // 맨 위 블록 위에 새 움직이는 블록을 만든다 (축은 층마다 번갈아, 출발 쪽은 시드 난수)
  function spawn(s) {
    var top = s.blocks[s.blocks.length - 1];
    var level = top.level + 1;
    var axis = axisOf(level);
    var side = s.rnd() < 0.5 ? -1 : 1;
    s.moving = { x: top.x, z: top.z, w: top.w, d: top.d, level: level, axis: axis, offset: side * SPAN, dir: -side };
    s.moving[axis] = top[axis] + s.moving.offset;
    return s.moving;
  }

  function newGame(seed) {
    var sd = seed == null ? (Math.random() * 4294967296) >>> 0 : seed >>> 0;
    var rnd = mulberry32(sd);
    var s = {
      seed: sd, rnd: rnd, hue0: Math.floor(rnd() * 360),
      blocks: [{ x: -BASE / 2, z: -BASE / 2, w: BASE, d: BASE, level: 0 }],
      moving: null, score: 0, combo: 0, bestCombo: 0, perfects: 0, drops: 0, t: 0, over: false
    };
    spawn(s);
    return s;
  }

  // dt(ms) 만큼 움직이는 블록을 왕복시킨다. 큰 dt 는 MAX_STEP 으로 자른다.
  function step(s, dt) {
    if (s.over || !s.moving) return;
    var m = s.moving;
    var left = clamp(Number(dt) || 0, 0, MAX_STEP);
    s.t += left;
    var dist = speed(s.score) * left / 1000;
    var o = m.offset + m.dir * dist;
    var guard = 0;
    while ((o > SPAN || o < -SPAN) && guard++ < 8) {
      if (o > SPAN) { o = 2 * SPAN - o; m.dir = -1; }
      else if (o < -SPAN) { o = -2 * SPAN - o; m.dir = 1; }
    }
    m.offset = clamp(o, -SPAN, SPAN);
    var top = s.blocks[s.blocks.length - 1];
    m[m.axis] = top[m.axis] + m.offset;
  }

  // 지금 위치에 떨어뜨린다. 사건을 돌려준다.
  //   { type:'place', perfect, grow, block, cut:{x,z,w,d,level}|null, combo, score }
  //   { type:'miss', piece:{x,z,w,d,level}, score }
  function drop(s) {
    if (s.over || !s.moving) return null;
    var m = s.moving;
    var top = s.blocks[s.blocks.length - 1];
    var axis = m.axis, sk = sizeKey(axis);
    var r = overlap1(top[axis], m[axis], top[sk]);
    s.drops++;
    var piece = { x: m.x, z: m.z, w: m.w, d: m.d, level: m.level };
    if (!r.keep) {
      s.over = true;
      s.moving = null;
      s.combo = 0;
      return { type: 'miss', piece: piece, score: s.score };
    }
    var block = { x: top.x, z: top.z, w: top.w, d: top.d, level: m.level };
    block[axis] = r.keep.pos;
    block[sk] = r.keep.len;
    var cut = null, grow = false;
    if (r.perfect) {
      s.combo++;
      s.perfects++;
      if (s.combo > s.bestCombo) s.bestCombo = s.combo;
      if (s.combo >= GROW_AFTER && block[sk] < BASE) {
        var g = Math.min(GROW, BASE - block[sk]);
        block[axis] -= g / 2;
        block[sk] += g;
        grow = true;
      }
    } else {
      s.combo = 0;
      cut = { x: m.x, z: m.z, w: m.w, d: m.d, level: m.level };
      cut[axis] = r.cut.pos;
      cut[sk] = r.cut.len;
    }
    block.x = round3(block.x); block.z = round3(block.z); block.w = round3(block.w); block.d = round3(block.d);
    s.blocks.push(block);
    s.score++;
    spawn(s);
    return { type: 'place', perfect: r.perfect, grow: grow, block: block, cut: cut, combo: s.combo, score: s.score, delta: r.delta };
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (높을수록 좋음)
  function bucket(score) {
    var n = Math.round(Number(score));
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }

  // Supabase 응답 [{ score_bucket, players }] → [{ bucket, players }] (정렬, 같은 구간 합치기, 잘못된 행 버리기)
  function normalizeHist(rows) {
    if (!Array.isArray(rows)) return null;
    var map = {};
    rows.forEach(function (r) {
      if (!r) return;
      var b = Number(r.score_bucket != null ? r.score_bucket : r.bucket);
      var n = Number(r.players);
      if (!isFinite(b) || !isFinite(n) || n <= 0 || b < 0) return;
      b = Math.round(b);
      map[b] = (map[b] || 0) + Math.round(n);
    });
    return Object.keys(map).map(Number).sort(function (a, b) { return a - b; })
      .map(function (b) { return { bucket: b, players: map[b] }; });
  }

  /* 분포에서 내 위치 (rows = 내 점수를 넣은 뒤의 전체 분포, submit_score 응답. 내 구간이 없으면 한 명 더한다).
   * 같은 구간은 절반만 이긴 것으로 친다.
   *   beat   : 다른 참가자 중 나보다 낮은 점수의 비율 (0~1)
   *   top    : "상위 N%" 의 N — ceil((1 - beat) × 100), 1~100
   *   beatPct: "N%보다 높아요" 의 N — floor(beat × 100), 0~100
   * 다른 사람이 없으면 { first: true }(화면에는 숨김). rows 가 배열이 아니면(실패) null.
   */
  function percentile(rows, myBucket) {
    var hist = normalizeHist(rows);
    if (!hist || myBucket == null || !isFinite(Number(myBucket))) return null;
    myBucket = Math.round(Number(myBucket));
    var lower = 0, same = 0, higher = 0;
    hist.forEach(function (h) {
      if (h.bucket < myBucket) lower += h.players;
      else if (h.bucket > myBucket) higher += h.players;
      else same += h.players;
    });
    if (same === 0) same = 1;
    var total = lower + same + higher;
    var others = total - 1;
    var base = { total: total, others: others, lower: lower, same: same, higher: higher };
    if (others <= 0) { base.first = true; return base; }
    var beat = (lower + (same - 1) / 2) / others;
    var topRaw = Math.round((1 - beat) * 1e6) / 1e4;
    base.first = false;
    base.beat = beat;
    base.top = clamp(Math.ceil(topRaw), 1, 100);
    base.beatPct = clamp(Math.floor(Math.round(beat * 1e6) / 1e4), 0, 100);
    return base;
  }

  return {
    BASE: BASE, BLOCK_H: BLOCK_H, SPAN: SPAN, BASE_SPEED: BASE_SPEED, SPEED_STEP: SPEED_STEP, MAX_SPEED: MAX_SPEED,
    PERFECT_TOL: PERFECT_TOL, GROW_AFTER: GROW_AFTER, GROW: GROW, MIN_SIZE: MIN_SIZE, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET,
    speed: speed, axisOf: axisOf, overlap1: overlap1, newGame: newGame, step: step, drop: drop,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
