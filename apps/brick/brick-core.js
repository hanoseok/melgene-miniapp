/* apps/brick/brick-core.js — 벽돌깨기 규칙·물리 (언어 무관, UMD: 브라우저 window.BRICK_CORE + Node 검사 공용)
 *
 * 판: 논리 좌표 W×H(360×520, 화면은 이 좌표를 캔버스 크기에 맞춰 늘린다). 위·왼쪽·오른쪽은 벽, 아래로 공이 빠지면 그 공은 사라진다.
 *   벽돌 8칸 × 최대 8줄(LEVELS 무늬: '.' 빈칸, '1' 한 번, '2' 두 번 맞아야 깨짐). 줄이 위일수록 점수가 크다(ROW_POINTS).
 *   단계(stage)를 다 깨면 보너스(STAGE_BONUS × 단계) 후 다음 단계 — 공이 조금씩 빨라진다(speedFor). 무늬는 LEVELS 를 돌아가며 쓴다.
 *   목숨 3개. 공이 모두 빠지면 목숨 −1, 0이 되면 게임 끝(over).
 *   서브: 공은 패들 위에 붙어 있다가 launch(s) (또는 SERVE_AUTO ms 뒤 자동)로 위로 출발.
 *   아이템(깨진 벽돌에서 가끔 떨어짐, 패들로 받으면 적용): wide = 패들이 WIDE_MS 동안 넓어짐, multi = 공마다 둘씩 더(최대 MAX_BALLS).
 * 물리: step(s, dt) — dt ms 진행. 공 하나가 한 번에 r/2 이하로만 움직이도록 잘게 나눠(substep) 벽돌을 뚫고 지나가지 않는다.
 *   벽돌: 원-사각형 겹침 → 겹친 깊이가 얕은 축으로 반사(한 substep 에 벽돌 하나). 패들: 내려오는 공만, 맞은 위치에 따라 각도(±MAX_ANGLE).
 *   공의 세로 속도가 너무 작아지지 않게(MIN_VY_RATIO) 각도를 고친다(옆으로만 오가며 갇히지 않게).
 * 사건: step 이 [{type:'brick'|'wall'|'paddle'|'drop'|'catch'|'lose'|'stage'|'over'|'launch', …}] 를 돌려준다(화면은 이걸로 소리·파편을 그린다).
 * 시드 난수(mulberry32, 상태는 s.rng) — 같은 시드 + 같은 입력 순서 = 같은 판(재현).
 * 서버 점수 분포(supa.submitScore): bucket(score) = round(score / 20) (0..1999 — 서버 한도 2000 구간 안).
 * 등급: tierOf(score) → 0..5 (TIERS 문턱, 이름은 언어 파일 result.tiers, 이모지는 TIER_EMOJI).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BRICK_CORE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var W = 360, H = 520;
  var GAME = 'brick';
  var MAX_BUCKET = 1999, BUCKET_STEP = 20;
  var LIVES = 3;
  var COLS = 8, PAD_X = 10, GAP = 4, BRICK_H = 16, TOP = 56;
  var BRICK_W = (W - PAD_X * 2 - GAP * (COLS - 1)) / COLS;       // 39
  var PADDLE_Y = H - 36, PADDLE_H = 12, PADDLE_W = 66, PADDLE_WIDE = 104;
  var BALL_R = 6;
  var MAX_ANGLE = Math.PI / 3;          // 패들 끝에 맞으면 60°
  var MIN_VY_RATIO = 0.34;              // |vy| ≥ 속도 × 이 값
  var SERVE_AUTO = 3000;                // 서브 자동 출발(ms)
  var WIDE_MS = 15000;
  var MAX_BALLS = 6;
  var DROP_CHANCE = 0.12, DROP_SPEED = 130, DROP_W = 30, DROP_H = 12;
  var ROW_POINTS = [50, 40, 30, 30, 20, 20, 10, 10];
  var TOUGH_HIT = 5;                     // 두 번 벽돌의 첫 타
  var STAGE_BONUS = 200;
  var TIERS = [0, 500, 1400, 3000, 5500, 10000];
  var TIER_EMOJI = ['🐣', '🕹️', '🧱', '⚡', '🔥', '👑'];
  // 단계 무늬 (8칸) — 위에서 아래로
  var LEVELS = [
    ['11111111', '11111111', '11111111', '11111111', '11111111'],
    ['...11...', '..1111..', '.111111.', '11111111', '11111111', '11.11.11'],
    ['22222222', '1.1.1.1.', '.1.1.1.1', '1.1.1.1.', '.1.1.1.1', '11111111'],
    ['...22...', '..2112..', '.211112.', '21111112', '.211112.', '..2112..', '...22...'],
    ['21212121', '11111111', '2.2..2.2', '11111111', '12121212', '11111111', '1.1..1.1'],
    ['22222222', '11111111', '12222221', '11111111', '21111112', '11111111', '11111111', '22222222']
  ];

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // mulberry32 (상태는 s.rng 에)
  function rnd(s) {
    var a = (s.rng = (s.rng + 0x6D2B79F5) >>> 0);
    var t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function speedFor(stage) { return Math.min(640, 300 + 40 * (stage - 1)); }   // 단계 시작 속도(논리 단위/초)
  function speedCap(stage) { return speedFor(stage) + 100; }                    // 패들에 맞을 때마다 조금씩 빨라지는 상한
  function patternOf(stage) { return LEVELS[(stage - 1) % LEVELS.length]; }

  function buildBricks(stage) {
    var rows = patternOf(stage), out = [];
    rows.forEach(function (row, r) {
      for (var c = 0; c < COLS; c++) {
        var ch = row.charAt(c);
        if (ch !== '1' && ch !== '2') continue;
        out.push({
          id: r * COLS + c, row: r, col: c,
          x: PAD_X + c * (BRICK_W + GAP), y: TOP + r * (BRICK_H + GAP), w: BRICK_W, h: BRICK_H,
          hp: ch === '2' ? 2 : 1, max: ch === '2' ? 2 : 1
        });
      }
    });
    return out;
  }

  function paddleW(s) { return s.wideUntil > s.t ? PADDLE_WIDE : PADDLE_W; }

  function serveBall(s) {
    s.balls = [{ x: s.paddle.x, y: PADDLE_Y - BALL_R, vx: 0, vy: 0, stuck: true }];
    s.serveAt = s.t;
    s.serving = true;
  }

  function newGame(seed) {
    if (seed == null || !isFinite(Number(seed))) seed = Math.floor(Math.random() * 4294967296);
    var s = {
      seed: seed >>> 0, rng: seed >>> 0,
      t: 0, stage: 1, lives: LIVES, score: 0, broken: 0,
      speed: speedFor(1), paddle: { x: W / 2 }, wideUntil: 0,
      bricks: buildBricks(1), balls: [], drops: [],
      serving: true, serveAt: 0, over: false
    };
    serveBall(s);
    return s;
  }

  // 패들 가운데를 x 로 (벽 안으로 자름)
  function setPaddle(s, x) {
    var half = paddleW(s) / 2;
    s.paddle.x = clamp(Number(x) || 0, half, W - half);
    if (s.serving) s.balls.forEach(function (b) { if (b.stuck) b.x = s.paddle.x; });
  }

  function setAngle(b, speed, ang) {   // ang: 위쪽 기준 좌우 각도
    b.vx = speed * Math.sin(ang);
    b.vy = -speed * Math.cos(ang);
  }

  function launch(s, events) {
    if (!s.serving || s.over) return false;
    var ang = (0.25 + 0.3 * rnd(s)) * (rnd(s) < 0.5 ? -1 : 1);
    s.balls.forEach(function (b) { b.stuck = false; setAngle(b, s.speed, ang); });
    s.serving = false;
    if (events) events.push({ type: 'launch' });
    return true;
  }

  // 세로 속도가 너무 작으면 각도를 고친다 (속도 크기는 그대로)
  function fixAngle(b) {
    var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
    if (!sp) return;
    var min = sp * MIN_VY_RATIO;
    if (Math.abs(b.vy) < min) {
      b.vy = (b.vy < 0 ? -1 : 1) * min;
      b.vx = (b.vx < 0 ? -1 : 1) * Math.sqrt(sp * sp - min * min);
    }
  }

  function hitBrick(s, br, events) {
    br.hp--;
    if (br.hp > 0) {
      s.score += TOUGH_HIT;
      events.push({ type: 'brick', id: br.id, row: br.row, x: br.x + br.w / 2, y: br.y + br.h / 2, broken: false, points: TOUGH_HIT });
      return;
    }
    var i = s.bricks.indexOf(br);
    if (i >= 0) s.bricks.splice(i, 1);
    var pts = ROW_POINTS[Math.min(br.row, ROW_POINTS.length - 1)];
    s.score += pts;
    s.broken++;
    events.push({ type: 'brick', id: br.id, row: br.row, x: br.x + br.w / 2, y: br.y + br.h / 2, broken: true, points: pts });
    if (rnd(s) < DROP_CHANCE) {
      var kind = rnd(s) < 0.5 ? 'wide' : 'multi';
      s.drops.push({ kind: kind, x: br.x + br.w / 2, y: br.y + br.h / 2 });
      events.push({ type: 'drop', kind: kind });
    }
  }

  // 공 하나를 h 초 움직이고 벽·벽돌·패들과 부딪힘을 처리. 아래로 빠지면 true.
  function moveBall(s, b, h, events) {
    var px = b.x, py = b.y;
    b.x += b.vx * h;
    b.y += b.vy * h;
    var r = BALL_R;
    // 벽
    if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx); events.push({ type: 'wall' }); }
    else if (b.x > W - r) { b.x = W - r; b.vx = -Math.abs(b.vx); events.push({ type: 'wall' }); }
    if (b.y < r) { b.y = r; b.vy = Math.abs(b.vy); events.push({ type: 'wall' }); }
    // 벽돌: 가장 깊이 겹친 것 하나
    var best = null, bestD = Infinity;
    for (var i = 0; i < s.bricks.length; i++) {
      var br = s.bricks[i];
      if (b.x + r < br.x || b.x - r > br.x + br.w || b.y + r < br.y || b.y - r > br.y + br.h) continue;
      var cx = clamp(b.x, br.x, br.x + br.w), cy = clamp(b.y, br.y, br.y + br.h);
      var dx = b.x - cx, dy = b.y - cy, d2 = dx * dx + dy * dy;
      if (d2 < r * r && d2 < bestD) { bestD = d2; best = br; }
    }
    if (best) {
      var bx = best.x, by = best.y, bw = best.w, bh = best.h;
      // 이전 위치가 벽돌의 가로 범위 밖이었으면 옆면, 세로 범위 밖이었으면 윗면/아랫면
      var wasLeft = px < bx, wasRight = px > bx + bw, wasAbove = py < by, wasBelow = py > by + bh;
      var side;
      if ((wasAbove || wasBelow) && !(wasLeft || wasRight)) side = 'y';
      else if ((wasLeft || wasRight) && !(wasAbove || wasBelow)) side = 'x';
      else {
        // 모서리: 겹친 깊이가 얕은 축
        var ox = Math.min(b.x + r - bx, bx + bw - (b.x - r));
        var oy = Math.min(b.y + r - by, by + bh - (b.y - r));
        side = ox < oy ? 'x' : 'y';
      }
      if (side === 'y') {
        if (b.y < by + bh / 2) { b.vy = -Math.abs(b.vy); b.y = by - r; } else { b.vy = Math.abs(b.vy); b.y = by + bh + r; }
      } else {
        if (b.x < bx + bw / 2) { b.vx = -Math.abs(b.vx); b.x = bx - r; } else { b.vx = Math.abs(b.vx); b.x = bx + bw + r; }
        b.x = clamp(b.x, r, W - r);
      }
      fixAngle(b);
      hitBrick(s, best, events);
    }
    // 패들 (내려오는 공만)
    var pw = paddleW(s), pl = s.paddle.x - pw / 2;
    if (b.vy > 0 && b.y + r >= PADDLE_Y && py + r <= PADDLE_Y + PADDLE_H && b.x + r >= pl && b.x - r <= pl + pw) {
      var off = clamp((b.x - s.paddle.x) / (pw / 2 + r), -1, 1);
      s.speed = Math.min(speedCap(s.stage), s.speed + 3);
      setAngle(b, s.speed, off * MAX_ANGLE);
      b.y = PADDLE_Y - r;
      events.push({ type: 'paddle', x: b.x });
    }
    return b.y - r > H;
  }

  function nextStage(s, events) {
    var bonus = STAGE_BONUS * s.stage;
    s.score += bonus;
    s.stage++;
    s.speed = speedFor(s.stage);
    s.bricks = buildBricks(s.stage);
    s.drops = [];
    s.wideUntil = 0;
    setPaddle(s, s.paddle.x);
    serveBall(s);
    events.push({ type: 'stage', stage: s.stage, bonus: bonus });
  }

  function loseBall(s, events) {
    s.lives--;
    s.drops = [];
    s.wideUntil = 0;
    events.push({ type: 'lose', lives: s.lives });
    if (s.lives <= 0) {
      s.balls = [];
      s.over = true;
      events.push({ type: 'over' });
      return;
    }
    s.speed = speedFor(s.stage);
    setPaddle(s, s.paddle.x);
    serveBall(s);
  }

  function applyDrop(s, d, events) {
    if (d.kind === 'wide') {
      s.wideUntil = s.t + WIDE_MS;
      setPaddle(s, s.paddle.x);
    } else {
      var add = [];
      s.balls.forEach(function (b) {
        if (b.stuck) return;
        var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy) || s.speed;
        var a = Math.atan2(b.vx, -b.vy);
        [-0.45, 0.45].forEach(function (da) {
          if (s.balls.length + add.length >= MAX_BALLS) return;
          var nb = { x: b.x, y: b.y, vx: 0, vy: 0, stuck: false };
          setAngle(nb, sp, clamp(a + da, -MAX_ANGLE - 0.3, MAX_ANGLE + 0.3));
          if (nb.vy > 0) nb.vy = -nb.vy;
          fixAngle(nb);
          add.push(nb);
        });
      });
      s.balls = s.balls.concat(add);
    }
    events.push({ type: 'catch', kind: d.kind });
  }

  // dt ms 진행 → 사건 목록
  function step(s, dt) {
    var events = [];
    if (s.over) return events;
    dt = Math.max(0, Number(dt) || 0);
    var sec = dt / 1000;
    if (s.serving) {
      s.t += dt;
      if (s.t - s.serveAt >= SERVE_AUTO) launch(s, events);
      else return events;
      sec = 0;
    } else s.t += dt;
    if (s.wideUntil && s.wideUntil <= s.t) { s.wideUntil = 0; setPaddle(s, s.paddle.x); }
    // 아이템
    for (var k = s.drops.length - 1; k >= 0; k--) {
      var d = s.drops[k];
      d.y += DROP_SPEED * sec;
      var pw = paddleW(s);
      if (d.y + DROP_H / 2 >= PADDLE_Y && d.y - DROP_H / 2 <= PADDLE_Y + PADDLE_H && Math.abs(d.x - s.paddle.x) <= pw / 2 + DROP_W / 2) {
        s.drops.splice(k, 1);
        applyDrop(s, d, events);
      } else if (d.y - DROP_H / 2 > H) s.drops.splice(k, 1);
    }
    // 공 (잘게 나눠 움직임)
    var maxV = 0;
    s.balls.forEach(function (b) { maxV = Math.max(maxV, Math.abs(b.vx), Math.abs(b.vy)); });
    var n = Math.max(1, Math.ceil((maxV * sec) / (BALL_R * 0.5)));
    var h = sec / n;
    for (var i = 0; i < n && !s.serving; i++) {
      for (var j = s.balls.length - 1; j >= 0; j--) {
        if (moveBall(s, s.balls[j], h, events)) s.balls.splice(j, 1);
      }
      if (!s.bricks.length) { nextStage(s, events); break; }
      if (!s.balls.length) { loseBall(s, events); break; }
    }
    return events;
  }

  function tierOf(score) {
    var t = 0;
    for (var i = 0; i < TIERS.length; i++) if (score >= TIERS[i]) t = i;
    return t;
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (mole 과 같은 방식)
  function bucket(score) {
    var n = Math.round(Number(score) / BUCKET_STEP);
    return isFinite(n) ? clamp(n, 0, MAX_BUCKET) : 0;
  }
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
  // 내 구간이 분포에서 어디쯤인지 (높을수록 좋음). → { total, others, lower, same, higher, first, beat, top, beatPct } / 실패 null
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
    W: W, H: H, GAME: GAME, MAX_BUCKET: MAX_BUCKET, BUCKET_STEP: BUCKET_STEP, LIVES: LIVES,
    COLS: COLS, BRICK_W: BRICK_W, BRICK_H: BRICK_H, TOP: TOP, PADDLE_Y: PADDLE_Y, PADDLE_H: PADDLE_H, PADDLE_W: PADDLE_W, PADDLE_WIDE: PADDLE_WIDE,
    BALL_R: BALL_R, MAX_BALLS: MAX_BALLS, SERVE_AUTO: SERVE_AUTO, WIDE_MS: WIDE_MS, DROP_W: DROP_W, DROP_H: DROP_H,
    ROW_POINTS: ROW_POINTS, STAGE_BONUS: STAGE_BONUS, TOUGH_HIT: TOUGH_HIT, LEVELS: LEVELS, TIERS: TIERS, TIER_EMOJI: TIER_EMOJI,
    newGame: newGame, step: step, launch: function (s) { var ev = []; launch(s, ev); return ev; }, setPaddle: setPaddle, paddleW: paddleW,
    speedFor: speedFor, speedCap: speedCap, buildBricks: buildBricks, applyDrop: function (s, kind) { var ev = []; applyDrop(s, { kind: kind }, ev); return ev; },
    tierOf: tierOf, bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
});
