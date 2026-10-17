/* apps/baseball/baseball-core.js — 숫자 야구(불스 앤 카우스) 규칙 (언어 무관, UMD: 브라우저 window.BASEBALL_CORE + Node require)
 * 비밀 숫자 = 서로 다른 숫자 3개(또는 4개). 0 도 쓰고 맨 앞이 0 이어도 된다. 뽑기 = 0..9 를 편향 없는 Fisher–Yates 로 섞어 앞에서 digits 개.
 * 난수 = randInt(n)(0..n-1 정수) — 브라우저는 crypto.getRandomValues + 거부 샘플링(cryptoRandInt).
 * 판정: 스트라이크 = 숫자와 자리가 모두 맞음, 볼 = 숫자만 맞고 자리가 다름, 둘 다 0 이면 아웃. 내 추리도 서로 다른 숫자여야 한다(중복·모양 틀림은 시도로 세지 않음).
 * 힌트·풀이 도움 없음: 이 파일에는 남은 후보를 세거나 추천하는 코드가 없다. 포기하면 정답만 보여 준다.
 * 서버 점수 분포(supa.submitScore): 난이도마다 game 이름 하나(baseball-3 / baseball-4), bucket = 1000 − 시도 횟수(작을수록 좋음 → 클수록 좋음).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BASEBALL_CORE = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var LEVELS = {
    d3: { digits: 3, game: 'baseball-3' },
    d4: { digits: 4, game: 'baseball-4' }
  };
  var LEVEL_ORDER = ['d3', 'd4'];
  var BUCKET_BASE = 1000;
  var MAX_TRIES = 999;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  // crypto 난수로 0..n-1 정수 (거부 샘플링 — 나머지 편향 없음)
  function cryptoRandInt(n) {
    n = Math.floor(n);
    if (!(n > 0) || n > 4294967296) throw new Error('bad range');
    var c = (typeof globalThis !== 'undefined' && globalThis.crypto) || (typeof self !== 'undefined' && self.crypto) || null;
    if (!c || !c.getRandomValues) return Math.floor(Math.random() * n);
    var lim = 4294967296 - (4294967296 % n);   // 이 값 이상은 버린다
    var a = new Uint32Array(1);
    for (;;) {
      c.getRandomValues(a);
      if (a[0] < lim) return a[0] % n;
    }
  }
  // 시드 난수(검사용): mulberry32 → randInt
  function seededRandInt(seed) {
    var a = seed >>> 0;
    return function (n) {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * n);
    };
  }
  // 편향 없는 Fisher–Yates (제자리)
  function shuffle(arr, randInt) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = randInt(i + 1);
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // 비밀 숫자: 0..9 를 섞어 앞에서 digits 개 → 문자열 ("072" 처럼 맨 앞 0 가능)
  function newSecret(digits, randInt) {
    if (digits !== 3 && digits !== 4) throw new Error('bad digits');
    var rnd = randInt || cryptoRandInt;
    return shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rnd).slice(0, digits).join('');
  }

  // 추리 검사 → null(괜찮음) | 'len' | 'char' | 'dup'
  function validate(str, digits) {
    if (typeof str !== 'string') return 'char';
    if (!/^[0-9]*$/.test(str)) return 'char';
    var seen = {};
    for (var i = 0; i < str.length; i++) {
      if (seen[str[i]]) return 'dup';
      seen[str[i]] = true;
    }
    if (str.length !== digits) return 'len';
    return null;
  }

  // 판정 → { s: 스트라이크, b: 볼, out: 둘 다 0 }
  function judge(secret, guess) {
    var s = 0, b = 0;
    for (var i = 0; i < guess.length; i++) {
      if (guess[i] === secret[i]) s++;
      else if (secret.indexOf(guess[i]) >= 0) b++;
    }
    return { s: s, b: b, out: s === 0 && b === 0 };
  }

  // 새 판. randInt 를 안 주면 crypto
  function newGame(level, randInt) {
    var L = LEVELS[level];
    if (!L) throw new Error('unknown level');
    return {
      level: level,
      digits: L.digits,
      secret: newSecret(L.digits, randInt),
      history: [],       // { guess, s, b, out }
      tries: 0,
      status: 'play'     // play → won | gaveup
    };
  }

  // 추리 하나 → { ok, err, s, b, out, done, tries } (잘못된 입력은 ok:false, 횟수에 안 셈)
  function guess(st, str) {
    if (!st || st.status !== 'play') return { ok: false, err: 'over' };
    var err = validate(str, st.digits);
    if (err) return { ok: false, err: err };
    for (var i = 0; i < st.history.length; i++) if (st.history[i].guess === str) return { ok: false, err: 'again' };
    var j = judge(st.secret, str);
    st.tries++;
    st.history.push({ guess: str, s: j.s, b: j.b, out: j.out });
    var done = j.s === st.digits;
    if (done) st.status = 'won';
    return { ok: true, s: j.s, b: j.b, out: j.out, done: done, tries: st.tries };
  }

  // 포기 → 정답. 이미 끝난 판이면 null
  function giveUp(st) {
    if (!st || st.status !== 'play') return null;
    st.status = 'gaveup';
    return st.secret;
  }

  function plausible(level, tries) {
    return !!LEVELS[level] && Number.isInteger(tries) && tries >= 1 && tries <= MAX_TRIES;
  }

  // ---------------------------------------------------------------- 서버 점수 분포 (memory·1to50 와 같은 방식)
  function bucket(tries) {
    var n = Math.round(Number(tries));
    return isFinite(n) ? BUCKET_BASE - clamp(n, 1, MAX_TRIES) : 0;
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
  // 내 구간이 분포에서 어디쯤인지 (bucket 이 클수록 적은 시도). → { total, others, first, top, beatPct, … } / 실패 null
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
    LEVELS: LEVELS, LEVEL_ORDER: LEVEL_ORDER, BUCKET_BASE: BUCKET_BASE, MAX_TRIES: MAX_TRIES,
    cryptoRandInt: cryptoRandInt, seededRandInt: seededRandInt, shuffle: shuffle,
    newSecret: newSecret, validate: validate, judge: judge, newGame: newGame, guess: guess, giveUp: giveUp,
    plausible: plausible, bucket: bucket, normalizeHist: normalizeHist, percentile: percentile
  };
}));
