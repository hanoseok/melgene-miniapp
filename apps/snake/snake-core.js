/* apps/snake/snake-core.js — 뱀 게임(Snake) 로직 (언어 무관, UMD: 브라우저 window.SNAKE_CORE + Node 검사 공용)
 *
 * 격자 COLS×ROWS = 17×17. 뱀은 머리부터 앞에서 뒤로 배열(snake[0] = 머리). 방향 0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽.
 *   - 한 칸 이동 = 한 틱. 틱 간격 interval(먹은 수) = max(75, 165 - 3 × 먹은 수) ms (많이 먹을수록 빨라짐).
 *   - 사과 한 개 = 10 + 2 × min(레벨 - 1, 10) 점, 레벨 = 1 + floor(먹은 수 / 5). 먹으면 한 칸 자라고 새 사과가 빈 칸에 생김.
 *   - 벽에 닿거나(reason 'wall') 자기 몸에 닿으면(reason 'self') 끝. 빈 칸이 없으면(reason 'full') 끝(클리어).
 *   - turn(): 반대 방향·같은 방향은 무시, 한 틱 사이에 두 번까지 줄 세움(빠른 연속 스와이프).
 *   - 난수는 상태 안의 mulberry32(시드) — 같은 시드 + 같은 입력이면 같은 판(검사 재현용).
 * step(state, dt) 은 상태를 제자리에서 바꾸고 이번에 일어난 사건 목록({type:'eat'|'crash'})을 돌려준다.
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 10) (0..1999 — 서버 한도 2000 구간 안).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SNAKE_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var COLS = 17;
  var ROWS = 17;
  var START_LEN = 3;
  var BASE_MS = 165;
  var MIN_MS = 75;
  var STEP_MS = 3;
  var FOODS_PER_LEVEL = 5;
  var MAX_QUEUE = 2;
  var MAX_STEP = 250;         // 한 번에 진행하는 최대 ms (탭 전환·느린 프레임 보호)
  var GAME = 'snake';         // 서버 점수 분포 이름
  var MAX_BUCKET = 1999;
  var DX = [0, 1, 0, -1];
  var DY = [-1, 0, 1, 0];

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
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

  function interval(ate) { return Math.max(MIN_MS, BASE_MS - STEP_MS * ate); }
  function level(ate) { return 1 + Math.floor(ate / FOODS_PER_LEVEL); }
  function foodPoints(ate) { return 10 + 2 * Math.min(level(ate) - 1, 10); }

  function occupied(s) {
    var grid = [];
    for (var i = 0; i < s.snake.length; i++) grid[s.snake[i].y * COLS + s.snake[i].x] = true;
    return grid;
  }
  // 빈 칸 중 하나(시드 난수). 빈 칸이 없으면 null.
  function placeFood(s) {
    var grid = occupied(s);
    var free = [];
    for (var i = 0; i < COLS * ROWS; i++) if (!grid[i]) free.push(i);
    if (!free.length) return null;
    var k = free[Math.floor(s.rnd() * free.length)];
    return { x: k % COLS, y: Math.floor(k / COLS) };
  }

  function newGame(seed) {
    var sd = seed == null ? (Math.random() * 4294967296) >>> 0 : seed >>> 0;
    var cx = Math.floor(COLS / 2), cy = Math.floor(ROWS / 2);
    var snake = [];
    for (var i = 0; i < START_LEN; i++) snake.push({ x: cx - i, y: cy });
    var s = {
      seed: sd, rnd: mulberry32(sd), snake: snake, dir: 1, queue: [], food: null,
      score: 0, ate: 0, ticks: 0, acc: 0, t: 0, over: false, reason: ''
    };
    s.food = placeFood(s);
    return s;
  }

  // 방향 입력. 현재(또는 마지막으로 줄 선) 방향과 같거나 반대면 무시. 받아들였으면 true.
  function turn(s, d) {
    if (s.over || d !== d || d < 0 || d > 3) return false;
    var ref = s.queue.length ? s.queue[s.queue.length - 1] : s.dir;
    if (d === ref || d === (ref + 2) % 4) return false;
    if (s.queue.length >= MAX_QUEUE) return false;
    s.queue.push(d);
    return true;
  }

  // 한 칸 이동. 사건 목록을 돌려준다.
  function tick(s) {
    var events = [];
    if (s.over) return events;
    if (s.queue.length) s.dir = s.queue.shift();
    var head = s.snake[0];
    var nx = head.x + DX[s.dir], ny = head.y + DY[s.dir];
    s.ticks++;
    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) {
      s.over = true; s.reason = 'wall';
      events.push({ type: 'crash', reason: 'wall', x: head.x, y: head.y });
      return events;
    }
    var eating = !!s.food && nx === s.food.x && ny === s.food.y;
    var bodyLen = eating ? s.snake.length : s.snake.length - 1;  // 먹지 않으면 꼬리가 비켜 준다
    for (var i = 0; i < bodyLen; i++) {
      if (s.snake[i].x === nx && s.snake[i].y === ny) {
        s.over = true; s.reason = 'self';
        events.push({ type: 'crash', reason: 'self', x: head.x, y: head.y });
        return events;
      }
    }
    s.snake.unshift({ x: nx, y: ny });
    if (eating) {
      var pts = foodPoints(s.ate);
      s.score += pts;
      s.ate++;
      events.push({ type: 'eat', x: nx, y: ny, points: pts });
      s.food = placeFood(s);
      if (!s.food) {
        s.over = true; s.reason = 'full';
        events.push({ type: 'crash', reason: 'full', x: nx, y: ny });
      }
    } else {
      s.snake.pop();
    }
    return events;
  }

  // dt(ms) 만큼 진행. 큰 dt 는 틱 단위로 나눠 같은 결과.
  function step(s, dt) {
    var events = [];
    if (s.over) return events;
    var left = clamp(Number(dt) || 0, 0, MAX_STEP);
    s.acc += left;
    var guard = 0;
    while (!s.over && guard++ < 64) {
      var iv = interval(s.ate);
      if (s.acc < iv) break;
      s.acc -= iv;
      s.t += iv;
      var ev = tick(s);
      for (var i = 0; i < ev.length; i++) events.push(ev[i]);
    }
    return events;
  }

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
    COLS: COLS, ROWS: ROWS, START_LEN: START_LEN, BASE_MS: BASE_MS, MIN_MS: MIN_MS, STEP_MS: STEP_MS,
    FOODS_PER_LEVEL: FOODS_PER_LEVEL, MAX_QUEUE: MAX_QUEUE, MAX_STEP: MAX_STEP, GAME: GAME, MAX_BUCKET: MAX_BUCKET, DX: DX, DY: DY,
    interval: interval, level: level, foodPoints: foodPoints, newGame: newGame, turn: turn, tick: tick, step: step,
    bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
