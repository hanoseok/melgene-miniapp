/* apps/candy-catch/candy-catch-core.js — 할로윈 사탕 받기 게임 로직 (언어 무관, UMD: 브라우저 window.CANDY_CORE + Node 검사 공용)
 *
 * 필드는 논리 좌표 W×H = 400×600 (화면 크기와 무관 — 캔버스가 비율대로 늘린다). 시간 단위는 ms.
 *   - 한 판 DURATION(50초), 목숨 LIVES(3). 시간이 다 되거나 목숨이 0 이 되면 끝.
 *   - 떨어지는 것: 사탕 4종(점수 10/20/30/50) + 방해물 2종(거미·유령: 받으면 목숨 -1, 콤보 초기화, 잠깐 무적).
 *   - 콤보: 사탕을 연달아 받은 수. 사탕을 놓치거나 방해물을 받으면 0. 배수 ×1(0~4) ×2(5~9) ×3(10~19) ×4(20~).
 *   - 난이도 d = t / DURATION (0→1): 낙하 속도·생성 간격·방해물 비율이 d 에 따라 오른다.
 *   - 난수는 상태 안의 mulberry32(시드) — 같은 시드 + 같은 입력이면 같은 판(검사 재현용).
 * step(state, dt, input) 은 상태를 제자리에서 바꾸고(60fps 라 복사하지 않음) 이번 틱의 사건 목록을 돌려준다.
 *   input = { target: 필드 x | null (끌기·마우스), dir: -1 | 0 | 1 (방향키) }
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 10) (0..1999 — 서버 한도 2000 구간 안).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CANDY_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 400;
  var H = 600;
  var DURATION = 50000;
  var LIVES = 3;
  var BASKET_W = 92;          // 바구니 입구 폭
  var BASKET_Y = H - 52;      // 바구니 몸통 가운데
  var RIM_Y = H - 84;         // 입구 선: 물건 가운데가 이 선을 위에서 아래로 지날 때 받는다
  var FOLLOW_SPEED = 1700;    // 끌기/마우스로 따라가는 최고 속도 (단위/초)
  var KEY_SPEED = 560;        // 방향키 속도 (단위/초)
  var INVULN_MS = 900;        // 방해물에 맞은 뒤 무적 시간
  var FIRST_SPAWN = 500;
  var MAX_STEP = 50;          // 한 번에 진행하는 최대 ms (탭 전환·느린 프레임 보호)
  var GAME = 'candy-catch';   // 서버 점수 분포 이름
  var MAX_BUCKET = 1999;

  // 순서 바꾸지 않음(검사·언어 파일이 id 로 참조). weight 는 사탕끼리의 뽑힐 비율.
  var ITEMS = [
    { id: 'wrap', kind: 'candy', points: 10, r: 20, weight: 42, speed: 1, color: '#ff5fa2' },
    { id: 'lolly', kind: 'candy', points: 20, r: 21, weight: 27, speed: 1, color: '#ffb020' },
    { id: 'choco', kind: 'candy', points: 30, r: 21, weight: 17, speed: 1.08, color: '#9a5b34' },
    { id: 'star', kind: 'candy', points: 50, r: 19, weight: 6, speed: 1.3, color: '#ffe066' },
    { id: 'spider', kind: 'hazard', points: 0, r: 21, weight: 0, speed: 1.15, color: '#1b1026' },
    { id: 'ghost', kind: 'hazard', points: 0, r: 23, weight: 0, speed: 0.9, color: '#eef2ff', wobble: true }
  ];
  var BY_ID = {};
  ITEMS.forEach(function (it, i) { it.index = i; BY_ID[it.id] = it; });
  var CANDIES = ITEMS.filter(function (it) { return it.kind === 'candy'; });
  var CANDY_WEIGHT = CANDIES.reduce(function (a, it) { return a + it.weight; }, 0);

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // mulberry32 — 상태(uint32)를 state.rng 에 둔다
  function rnd(s) {
    s.rng = (s.rng + 0x6D2B79F5) >>> 0;
    var t = s.rng;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // 난이도 곡선 (d = 0..1)
  function fallSpeed(d) { return 165 + 235 * clamp(d, 0, 1); }            // 단위/초: 165 → 400
  function spawnGap(d) { return 760 - 420 * clamp(d, 0, 1); }             // ms: 760 → 340
  function hazardChance(d) { return 0.13 + 0.19 * clamp(d, 0, 1); }       // 13% → 32%
  function multiplier(combo) { return combo >= 20 ? 4 : combo >= 10 ? 3 : combo >= 5 ? 2 : 1; }

  function newGame(seed) {
    if (seed == null) seed = Math.floor(Math.random() * 4294967296);
    seed = seed >>> 0;
    return {
      seed: seed, rng: seed, t: 0,
      score: 0, lives: LIVES, combo: 0, maxCombo: 0,
      caught: 0, missed: 0, hits: 0, dodged: 0, spawned: 0,
      x: W / 2, items: [], nextId: 1, spawnAt: FIRST_SPAWN, lastX: W / 2,
      invulnUntil: -1, over: false, reason: null
    };
  }

  function pickType(s, d) {
    if (rnd(s) < hazardChance(d)) {
      // 유령은 10초 뒤부터 (처음엔 곧게 떨어지는 거미만)
      return (s.t < 10000 || rnd(s) < 0.55) ? BY_ID.spider : BY_ID.ghost;
    }
    var r = rnd(s) * CANDY_WEIGHT;
    for (var i = 0; i < CANDIES.length; i++) {
      r -= CANDIES[i].weight;
      if (r < 0) return CANDIES[i];
    }
    return CANDIES[0];
  }

  function spawn(s, d) {
    var type = pickType(s, d);
    var margin = type.r + 8 + (type.wobble ? 26 : 0);
    var x = margin + rnd(s) * (W - 2 * margin);
    if (Math.abs(x - s.lastX) < 48) x = margin + rnd(s) * (W - 2 * margin); // 바로 앞과 겹치지 않게 한 번 더
    s.lastX = x;
    var v = fallSpeed(d) * type.speed * (0.9 + rnd(s) * 0.2);
    s.items.push({
      id: s.nextId++, type: type.id, x: x, baseX: x, y: -type.r - 4, vy: v,
      phase: rnd(s) * Math.PI * 2, spin: (rnd(s) - 0.5) * 4, born: s.t
    });
    s.spawned++;
  }

  function moveBasket(s, dt, input) {
    var half = BASKET_W / 2;
    var sec = dt / 1000;
    if (input && input.dir) {
      s.x += (input.dir < 0 ? -1 : 1) * KEY_SPEED * sec;
    } else if (input && input.target != null && isFinite(input.target)) {
      var want = clamp(input.target, half, W - half);
      var max = FOLLOW_SPEED * sec;
      var dx = want - s.x;
      s.x += Math.abs(dx) <= max ? dx : (dx < 0 ? -max : max);
    }
    s.x = clamp(s.x, half, W - half);
  }

  function inBasket(s, item, type) {
    return Math.abs(item.x - s.x) <= BASKET_W / 2 + type.r * 0.35;
  }

  // 한 틱 진행. 사건: catch {id,type,points,mult,x} · hit {type,x} · miss {type,x} · end {reason}
  function stepOnce(s, dt, input, events) {
    if (s.over || !(dt > 0)) return;
    dt = Math.min(dt, MAX_STEP);
    var nextT = Math.min(s.t + dt, DURATION);
    dt = nextT - s.t;
    s.t = nextT;
    var d = s.t / DURATION;
    moveBasket(s, dt, input);
    while (s.t >= s.spawnAt && s.t < DURATION - 250) {
      spawn(s, d);
      if (d > 0.55 && rnd(s) < 0.25) spawn(s, d); // 후반엔 가끔 두 개씩
      s.spawnAt += spawnGap(d) * (0.85 + rnd(s) * 0.3);
    }
    var keep = [];
    for (var i = 0; i < s.items.length; i++) {
      var it = s.items[i];
      var type = BY_ID[it.type];
      var prevY = it.y;
      it.y += it.vy * dt / 1000;
      if (type.wobble) it.x = clamp(it.baseX + Math.sin(it.phase + s.t * 0.0032) * 26, type.r, W - type.r);
      if (prevY < RIM_Y && it.y >= RIM_Y && inBasket(s, it, type)) {
        if (type.kind === 'candy') {
          s.combo++;
          if (s.combo > s.maxCombo) s.maxCombo = s.combo;
          var mult = multiplier(s.combo);
          var pts = type.points * mult;
          s.score += pts;
          s.caught++;
          events.push({ type: 'catch', item: type.id, points: pts, mult: mult, combo: s.combo, x: it.x });
          continue;
        }
        if (s.t >= s.invulnUntil) {
          s.lives--;
          s.hits++;
          s.combo = 0;
          s.invulnUntil = s.t + INVULN_MS;
          events.push({ type: 'hit', item: type.id, lives: s.lives, x: it.x });
          if (s.lives <= 0) {
            s.lives = 0;
            s.over = true;
            s.reason = 'lives';
            s.items = keep.concat(s.items.slice(i + 1)); // 남은 물건은 그대로(더 받지 않음)
            events.push({ type: 'end', reason: 'lives' });
            return;
          }
          continue;
        }
      }
      if (it.y - type.r > H) {
        if (type.kind === 'candy') {
          s.missed++;
          if (s.combo > 0) events.push({ type: 'miss', item: type.id, combo: s.combo, x: it.x });
          s.combo = 0;
        } else {
          s.dodged++;
        }
        continue;
      }
      keep.push(it);
    }
    s.items = keep;
    if (s.t >= DURATION) {
      s.over = true;
      s.reason = 'time';
      events.push({ type: 'end', reason: 'time' });
    }
  }

  // dt 가 크면(느린 프레임·빨리 감기) MAX_STEP 씩 나눠서 진행
  function step(s, dt, input) {
    var events = [];
    var left = Math.max(0, Number(dt) || 0);
    while (left > 0 && !s.over) {
      var d = Math.min(MAX_STEP, left);
      stepOnce(s, d, input, events);
      left -= d;
    }
    return events;
  }

  function timeLeft(s) { return Math.max(0, DURATION - s.t); }
  function secondsLeft(s) { return Math.ceil(timeLeft(s) / 1000); }
  function invulnerable(s) { return s.t < s.invulnUntil; }

  // ---------------------------------------------------------------- 서버 점수 분포 (높을수록 좋음)
  function bucket(score) {
    var n = Math.round(Number(score) / 10);
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
    W: W, H: H, DURATION: DURATION, LIVES: LIVES, BASKET_W: BASKET_W, BASKET_Y: BASKET_Y, RIM_Y: RIM_Y,
    FOLLOW_SPEED: FOLLOW_SPEED, KEY_SPEED: KEY_SPEED, INVULN_MS: INVULN_MS, MAX_STEP: MAX_STEP,
    GAME: GAME, MAX_BUCKET: MAX_BUCKET, ITEMS: ITEMS, BY_ID: BY_ID,
    fallSpeed: fallSpeed, spawnGap: spawnGap, hazardChance: hazardChance, multiplier: multiplier,
    newGame: newGame, step: step, timeLeft: timeLeft, secondsLeft: secondsLeft, invulnerable: invulnerable,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
