/* apps/merge/merge-core.js — 수박 게임(할로윈 머지) 규칙 + 2D 원 물리 (언어 무관, UMD: 브라우저 window.MERGE_CORE + Node 검사 공용)
 *
 * 필드: 논리 좌표 400 × 600 (가로 × 세로, 2:3). 병(jar) 안쪽 = x 0..400, 바닥 y 600. 위쪽 y < LINE_Y 는 떨어뜨리는 자리.
 * 조각 11단계(TIERS, **순서 바꾸지 않음** — 점수·서버 분포가 이 순서에 묶여 있다): 0 캔디콘 → … → 9 호박 → 10 잭오랜턴.
 *   같은 단계 두 개가 닿으면 다음 단계 하나로 합쳐진다(두 개의 가운데, 반지름은 120ms 동안 자란다).
 *   잭오랜턴 두 개가 닿으면 둘 다 사라지고 큰 보너스(66점).
 * 점수: 단계 k(1..10)를 만들면 k(k+1)/2 점(1, 3, 6 … 55), 잭오랜턴 둘 = 66점. 떨어뜨리기만으로는 0점.
 * 다음 조각: 시드 난수(mulberry32)로 0..4 단계 중 하나(작은 것일수록 자주).
 * 물리: 위치 기반(PBD) — 1/240초 작은 단계, 중력 → 위치 이동 → 겹침 풀기(질량 = r², 2회) → 벽·바닥 → 속도 = 위치 변화 / dt
 *   → 접촉 속도 보정(반발 계수 REST, 마찰) → 약한 감쇠·속도 한도. 같은 시드 + 같은 입력(같은 dt) = 같은 판(재현).
 * 끝: 태어난 지 SETTLE_MS 가 지난 조각의 윗부분이 선(LINE_Y) 위에 DANGER_MS(2초) 동안 계속 있으면 끝(reason 'full').
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 10) (0..1999 — 서버 한도 2000 구간 안).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MERGE_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 400, H = 600;
  var LINE_Y = 112;          // 넘으면 안 되는 선
  var DROP_Y = 46;           // 들고 있는 조각의 중심 높이
  var GRAVITY = 1500;        // 단위/초²
  var SUB = 1 / 240;         // 물리 작은 단계(초)
  var ITER = 4;              // 겹침 풀기 반복
  var REST = 0.16;           // 반발 계수
  var FRICTION = 0.03;       // 조각끼리 접촉 접선 속도 감쇠(작은 단계마다)
  var FLOOR_FRICTION = 0.02; // 바닥 미끄럼 감쇠(작은 단계마다)
  var MAX_V = 2400;          // 속도 한도
  var GROW_S = 0.12;         // 합쳐진 조각이 자라는 시간(초)
  var DROP_COOLDOWN = 520;   // ms: 떨어뜨린 뒤 다음 조각이 손에 오기까지
  var DANGER_MS = 2000;      // 선 위에 이만큼 있으면 끝
  var SETTLE_MS = 900;       // 막 떨어뜨렸거나 막 합쳐진 조각은 이 시간 동안 선 검사에서 뺀다
  var MAX_ACC = 0.25;        // 한 번의 step 에 밀린 시간 한도(초)
  var GAME = 'merge';        // 서버 점수 분포 이름
  var MAX_BUCKET = 1999;

  // 단계: id(그림 이름) · r(반지름) · color(원 색) · emoji(그림에 쓰는 이모지, 빈 값은 직접 그림)
  var TIERS = [
    { id: 'corn', r: 13, color: '#ffe08a', emoji: '' },
    { id: 'candy', r: 17, color: '#ff8cc0', emoji: '🍬' },
    { id: 'lolly', r: 23, color: '#c9a2ff', emoji: '🍭' },
    { id: 'chestnut', r: 29, color: '#d79a5c', emoji: '🌰' },
    { id: 'apple', r: 35, color: '#ff6b6b', emoji: '🍎' },
    { id: 'mushroom', r: 42, color: '#f4e6c8', emoji: '🍄' },
    { id: 'bat', r: 50, color: '#7a64c8', emoji: '🦇' },
    { id: 'ghost', r: 58, color: '#e4e9ff', emoji: '👻' },
    { id: 'crystal', r: 67, color: '#6fd0ff', emoji: '🔮' },
    { id: 'pumpkin', r: 77, color: '#ff8a1f', emoji: '' },
    { id: 'jack', r: 88, color: '#ffb020', emoji: '' }
  ];
  var TOP = TIERS.length - 1;
  var SPAWN_WEIGHTS = [30, 26, 20, 14, 10]; // 다음 조각: 0..4 단계
  var SPAWN_TOTAL = SPAWN_WEIGHTS.reduce(function (a, b) { return a + b; }, 0);
  var POP_POINTS = 66;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function mergePoints(tier) { return tier >= 1 && tier <= TOP ? tier * (tier + 1) / 2 : 0; }

  // mulberry32 (상태는 s.rng 에)
  function rnd(s) {
    var a = (s.rng = (s.rng + 0x6D2B79F5) >>> 0);
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function pickTier(s) {
    var x = rnd(s) * SPAWN_TOTAL;
    for (var i = 0; i < SPAWN_WEIGHTS.length; i++) { x -= SPAWN_WEIGHTS[i]; if (x < 0) return i; }
    return 0;
  }

  function newGame(seed) {
    if (seed == null) seed = Math.floor(Math.random() * 4294967296);
    var s = {
      seed: seed >>> 0, rng: seed >>> 0, t: 0, acc: 0,
      bodies: [], nextId: 1,
      score: 0, merges: 0, pops: 0, drops: 0, maxTier: 0,
      aimX: W / 2, cur: 0, next: 0, cooldown: 0,
      danger: 0, over: false, reason: null
    };
    s.cur = pickTier(s);
    s.next = pickTier(s);
    s.maxTier = s.cur;
    return s;
  }

  function aimRange(s) { var r = TIERS[s.cur].r; return [r, W - r]; }
  function aim(s, x) {
    if (!isFinite(x)) return s.aimX;
    var rg = aimRange(s);
    s.aimX = clamp(x, rg[0], rg[1]);
    return s.aimX;
  }
  function canDrop(s) { return !s.over && s.cooldown <= 0; }

  function makeBody(s, tier, x, y, vx, vy, r0) {
    var R = TIERS[tier].r;
    var r = r0 == null ? R : Math.min(R, r0);
    return { id: s.nextId++, tier: tier, x: x, y: y, px: x, py: y, vx: vx || 0, vy: vy || 0, r: r, R: R,
      grow: (R - r) / GROW_S, born: s.t, a: 0 };
  }

  // 손에 든 조각을 떨어뜨린다 → 새 몸 또는 null(쿨다운 중·끝)
  function drop(s) {
    if (!canDrop(s)) return null;
    var rg = aimRange(s);
    var b = makeBody(s, s.cur, clamp(s.aimX, rg[0], rg[1]), DROP_Y, 0, 0);
    s.bodies.push(b);
    s.drops++;
    s.cur = s.next;
    s.next = pickTier(s);
    if (s.cur > s.maxTier) s.maxTier = s.cur;
    s.cooldown = DROP_COOLDOWN;
    aim(s, s.aimX); // 새 조각 반지름으로 다시 맞춤
    return b;
  }

  // ---------------------------------------------------------------- 물리 한 걸음
  var order = []; // 겹침 검사용 정렬 (재사용)
  function substep(s, events) {
    var dt = SUB;
    var bs = s.bodies;
    var n = bs.length, i, j, a, b;
    s.t += dt * 1000;
    if (s.cooldown > 0) s.cooldown = Math.max(0, s.cooldown - dt * 1000);

    // 1) 적분
    for (i = 0; i < n; i++) {
      a = bs[i];
      if (a.r < a.R) a.r = Math.min(a.R, a.r + a.grow * dt);
      a.px = a.x; a.py = a.y;
      a.pvx = a.vx; a.pvy = a.vy;
      a.vy += GRAVITY * dt;
      a.x += a.vx * dt;
      a.y += a.vy * dt;
      a.dead = false;
      a.floor = false;
    }

    // 2) 겹침 풀기 (왼쪽 끝으로 정렬 + 훑기), 같은 단계는 합치기 예약
    var contacts = [];
    var merges = [];
    for (var it = 0; it < ITER; it++) {
      order.length = n;
      for (i = 0; i < n; i++) order[i] = i;
      order.sort(function (p, q) { return (bs[p].x - bs[p].r) - (bs[q].x - bs[q].r) || bs[p].id - bs[q].id; });
      for (var oi = 0; oi < n; oi++) {
        a = bs[order[oi]];
        if (a.dead) continue;
        var right = a.x + a.r;
        for (var oj = oi + 1; oj < n; oj++) {
          b = bs[order[oj]];
          if (b.x - b.r > right) break;
          if (b.dead) continue;
          var dx = b.x - a.x, dy = b.y - a.y;
          var rs = a.r + b.r;
          var d2 = dx * dx + dy * dy;
          if (d2 >= rs * rs) continue;
          if (a.tier === b.tier) {
            a.dead = true; b.dead = true;
            merges.push(a.id < b.id ? [a, b] : [b, a]);
            break;
          }
          var d = Math.sqrt(d2);
          var nx, ny;
          if (d < 1e-6) { nx = 0; ny = 1; d = 0; } else { nx = dx / d; ny = dy / d; }
          var over = rs - d;
          var ma = a.R * a.R, mb = b.R * b.R;
          var wa = mb / (ma + mb), wb = ma / (ma + mb);
          a.x -= nx * over * wa; a.y -= ny * over * wa;
          b.x += nx * over * wb; b.y += ny * over * wb;
          if (it === 0) contacts.push({ a: a, b: b, nx: nx, ny: ny, vn: (b.pvx - a.pvx) * nx + (b.pvy - a.pvy) * ny, wa: wa, wb: wb });
        }
      }
      // 벽·바닥
      for (i = 0; i < n; i++) {
        a = bs[i];
        if (a.x < a.r) a.x = a.r;
        else if (a.x > W - a.r) a.x = W - a.r;
        if (a.y > H - a.r) { a.y = H - a.r; a.floor = true; }
      }
    }

    // 3) 속도 = 위치 변화 / dt, 접촉 반발·마찰
    for (i = 0; i < n; i++) {
      a = bs[i];
      a.vx = (a.x - a.px) / dt;
      a.vy = (a.y - a.py) / dt;
      if (a.floor) {
        if (a.pvy > GRAVITY * dt * 4) a.vy = Math.min(a.vy, -a.pvy * REST);
        a.vx *= (1 - FLOOR_FRICTION);
      }
      if ((a.x <= a.r + 1e-6 && a.pvx < 0) || (a.x >= W - a.r - 1e-6 && a.pvx > 0)) {
        if (Math.abs(a.pvx) > 60) a.vx = -a.pvx * REST;
      }
    }
    for (var c = 0; c < contacts.length; c++) {
      var ct = contacts[c];
      a = ct.a; b = ct.b;
      if (a.dead || b.dead) continue;
      var rvx = b.vx - a.vx, rvy = b.vy - a.vy;
      var vn = rvx * ct.nx + rvy * ct.ny;
      var target = ct.vn < -GRAVITY * dt * 4 ? -ct.vn * REST : 0;
      if (vn < target) {
        var dv = target - vn;
        a.vx -= ct.nx * dv * ct.wa; a.vy -= ct.ny * dv * ct.wa;
        b.vx += ct.nx * dv * ct.wb; b.vy += ct.ny * dv * ct.wb;
      }
      // 접선 마찰
      var tx = -ct.ny, ty = ct.nx;
      var vt = (b.vx - a.vx) * tx + (b.vy - a.vy) * ty;
      var f = vt * FRICTION;
      a.vx += tx * f * ct.wa; a.vy += ty * f * ct.wa;
      b.vx -= tx * f * ct.wb; b.vy -= ty * f * ct.wb;
    }
    for (i = 0; i < n; i++) {
      a = bs[i];
      a.vx *= 0.9996; a.vy *= 0.9996;
      var sp = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
      if (sp > MAX_V) { a.vx *= MAX_V / sp; a.vy *= MAX_V / sp; }
      a.a += (a.vx / a.R) * dt; // 굴러가는 모양(그림용)
    }

    // 4) 합치기
    if (merges.length) {
      var gone = {};
      merges.forEach(function (m) {
        var p = m[0], q = m[1];
        gone[p.id] = gone[q.id] = true;
        var mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
        if (p.tier >= TOP) {
          s.pops++;
          s.score += POP_POINTS;
          events.push({ type: 'pop', tier: p.tier, x: mx, y: my, points: POP_POINTS });
          return;
        }
        var nt = p.tier + 1;
        var nb = makeBody(s, nt, clamp(mx, p.R, W - p.R), Math.min(my, H - p.R), (p.vx + q.vx) / 2, Math.min(0, (p.vy + q.vy) / 2), p.R);
        nb.mergedFrom = [p.id, q.id];
        s.newBodies = s.newBodies || [];
        s.newBodies.push(nb);
        var pts = mergePoints(nt);
        s.score += pts;
        s.merges++;
        if (nt > s.maxTier) s.maxTier = nt;
        events.push({ type: 'merge', tier: nt, x: nb.x, y: nb.y, points: pts, id: nb.id });
      });
      s.bodies = bs.filter(function (x) { return !gone[x.id]; }).concat(s.newBodies || []);
      s.newBodies = null;
    }

    // 5) 선 검사
    var high = false;
    for (i = 0; i < s.bodies.length; i++) {
      a = s.bodies[i];
      if (s.t - a.born > SETTLE_MS && a.y - a.r < LINE_Y) { high = true; break; }
    }
    if (high) {
      s.danger += dt * 1000;
      if (s.danger >= DANGER_MS) {
        s.over = true;
        s.reason = 'full';
        events.push({ type: 'end', reason: 'full' });
      }
    } else s.danger = 0;
  }

  // dtMs 만큼 시간을 흘린다 (1/240초 작은 단계로 나눔). 사건 목록을 돌려준다.
  function step(s, dtMs) {
    var events = [];
    if (s.over) return events;
    s.acc = Math.min(MAX_ACC, s.acc + Math.max(0, Number(dtMs) || 0) / 1000);
    while (s.acc >= SUB - 1e-9 && !s.over) {
      substep(s, events);
      s.acc -= SUB;
    }
    return events;
  }

  // 조각 윗부분 가운데 가장 높은 곳(그림·검사용)
  function topY(s) {
    var m = H;
    for (var i = 0; i < s.bodies.length; i++) m = Math.min(m, s.bodies[i].y - s.bodies[i].r);
    return m;
  }

  // ---------------------------------------------------------------- 서버 점수 분포
  function bucket(score) {
    var n = Math.round(Number(score) / 10);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }
  // Supabase 응답 [{ score_bucket, players }] → [{ bucket, players }] (정렬, 같은 구간 합치기, 잘못된 행 버리기)
  function normalizeHist(rows) {
    if (!Array.isArray(rows)) return null;
    var map = {};
    rows.forEach(function (r) {
      if (!r || typeof r !== 'object') return;
      var b = Number(r.score_bucket != null ? r.score_bucket : r.bucket);
      var p = Number(r.players);
      if (!isFinite(b) || !isFinite(p) || p <= 0 || b < 0 || Math.floor(b) !== b) return;
      map[b] = (map[b] || 0) + Math.floor(p);
    });
    return Object.keys(map).map(Number).sort(function (a, b) { return a - b; })
      .map(function (b) { return { bucket: b, players: map[b] }; });
  }
  // 내 구간(myBucket)이 분포에서 어디쯤인지 (높을수록 좋음). 내 기록은 이미 분포에 들어 있다고 본다(없으면 한 명 더함).
  //   → { total, others, lower, same, higher, first, beat(0..1), top(1..100), beatPct(0..100) } / 실패 null
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
    W: W, H: H, LINE_Y: LINE_Y, DROP_Y: DROP_Y, GRAVITY: GRAVITY, SUB: SUB, REST: REST,
    DROP_COOLDOWN: DROP_COOLDOWN, DANGER_MS: DANGER_MS, SETTLE_MS: SETTLE_MS,
    GAME: GAME, MAX_BUCKET: MAX_BUCKET, TIERS: TIERS, TOP: TOP, SPAWN_WEIGHTS: SPAWN_WEIGHTS, POP_POINTS: POP_POINTS,
    newGame: newGame, aim: aim, aimRange: aimRange, canDrop: canDrop, drop: drop, step: step, topY: topY,
    mergePoints: mergePoints, bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
