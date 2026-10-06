/* apps/lotto/lotto-core.js — 로또 번호 생성기 언어 무관 로직 (UMD: 브라우저 window.LOTTO_CORE + Node 검사 공용)
 *   - 프리셋: Korea 6/45, Euro 5/50 + 2/12, US 5/69 + 1/26, 직접 정하기(1..M 중 N개).
 *   - 뽑기: crypto.getRandomValues 거부 샘플링 → 편향 없음. 고정 번호는 항상 포함, 제외 번호는 절대 뽑지 않는다.
 *   - 보너스/스타 번호(extra)는 본 번호와 따로 뽑는 별도 풀. 고정·제외는 본 번호에만 적용한다.
 *   - 연출(공이 굴러 나오는 모습)은 결과를 먼저 뽑은 뒤 보여 주기만 한다. 당첨 확률 계산·예측은 하지 않는다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LOTTO_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_GAMES = 5;
  var PRESETS = {
    kr: { pick: 6, max: 45, xPick: 0, xMax: 0 },
    euro: { pick: 5, max: 50, xPick: 2, xMax: 12 },
    us: { pick: 5, max: 69, xPick: 1, xMax: 26 },
  };
  var CUSTOM_LIMITS = { minMax: 2, maxMax: 100, minPick: 1, maxPick: 10 };

  function cryptoObj() {
    if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.getRandomValues) return globalThis.crypto;
    try { return require('crypto').webcrypto; } catch (e) { return null; }
  }
  // 0 <= r < max 인 정수. 2^32 를 max 로 나눈 나머지 구간은 버리고 다시 뽑는다(거부 샘플링).
  function cryptoInt(max) {
    if (!(max >= 1)) return 0;
    var c = cryptoObj();
    if (!c) return Math.floor(Math.random() * max);
    var buf = new Uint32Array(1);
    var limit = Math.floor(4294967296 / max) * max;
    for (;;) {
      c.getRandomValues(buf);
      if (buf[0] < limit) return buf[0] % max;
    }
  }

  function clampInt(v, lo, hi, fallback) {
    v = Math.floor(Number(v));
    if (!(v >= lo && v <= hi)) return fallback;
    return v;
  }
  function clampGames(n) { return clampInt(n, 1, MAX_GAMES, 1); }

  // 프리셋 id 또는 직접 정하기({pick,max}) → 설정. 잘못된 값은 맞춰 준다.
  function configFor(preset, custom) {
    if (PRESETS[preset]) return Object.assign({ preset: preset }, PRESETS[preset]);
    var max = clampInt(custom && custom.max, CUSTOM_LIMITS.minMax, CUSTOM_LIMITS.maxMax, 45);
    var pick = clampInt(custom && custom.pick, CUSTOM_LIMITS.minPick, Math.min(CUSTOM_LIMITS.maxPick, max - 1), Math.min(6, max - 1));
    return { preset: 'custom', pick: pick, max: max, xPick: 0, xMax: 0 };
  }

  // "3, 7 12" 같은 입력 → { list: [정수…], bad: 범위 밖·숫자 아님 개수 }
  function parseNumbers(text, max) {
    var out = [];
    var bad = 0;
    String(text == null ? '' : text).split(/[\s,;.、，·/]+/).forEach(function (tok) {
      if (!tok) return;
      if (!/^\d{1,3}$/.test(tok)) { bad++; return; }
      var n = Number(tok);
      if (n < 1 || n > max) { bad++; return; }
      if (out.indexOf(n) < 0) out.push(n);
    });
    out.sort(function (a, b) { return a - b; });
    return { list: out, bad: bad };
  }

  // 고정·제외 검사. 문제 코드: ok | bad | overlap | tooManyFixed | notEnough
  function validate(cfg, fixed, excluded) {
    var inter = fixed.filter(function (n) { return excluded.indexOf(n) >= 0; });
    if (inter.length) return { ok: false, code: 'overlap', numbers: inter };
    if (fixed.length > cfg.pick) return { ok: false, code: 'tooManyFixed' };
    var pool = cfg.max - excluded.length;
    if (pool < cfg.pick) return { ok: false, code: 'notEnough' };
    return { ok: true, code: 'ok' };
  }

  function sortNum(a) { return a.slice().sort(function (x, y) { return x - y; }); }

  // 풀에서 k 개를 부분 Fisher-Yates 로 뽑는다 (뽑힌 순서 그대로 반환)
  function pickFrom(pool, k, randInt) {
    var ri = randInt || cryptoInt;
    var a = pool.slice();
    var out = [];
    for (var i = 0; i < k && a.length; i++) {
      var j = i + ri(a.length - i);
      var t = a[i]; a[i] = a[j]; a[j] = t;
      out.push(a[i]);
    }
    return out;
  }
  function range(lo, hi) { var a = []; for (var i = lo; i <= hi; i++) a.push(i); return a; }

  // 한 게임: { order: 뽑힌 순서(본 번호), main: 정렬, extra: 정렬 }
  function drawGame(cfg, fixed, excluded, randInt) {
    fixed = fixed || []; excluded = excluded || [];
    var pool = range(1, cfg.max).filter(function (n) { return excluded.indexOf(n) < 0 && fixed.indexOf(n) < 0; });
    var drawn = pickFrom(pool, cfg.pick - fixed.length, randInt);
    var order = pickFrom(fixed.concat(drawn), cfg.pick, randInt); // 보여 주는 순서만 섞는다(집합은 그대로)
    var extra = cfg.xPick ? sortNum(pickFrom(range(1, cfg.xMax), cfg.xPick, randInt)) : [];
    return { order: order, main: sortNum(order), extra: extra };
  }
  function drawGames(cfg, count, fixed, excluded, randInt) {
    var out = [];
    for (var i = 0; i < clampGames(count); i++) out.push(drawGame(cfg, fixed, excluded, randInt));
    return out;
  }

  // 공 색 0~4: 1~10 노랑 · 11~20 파랑 · 21~30 빨강 · 31~40 회색 · 41~ 초록 (한국 로또 색 구간, 46 이상은 10 단위로 되풀이)
  function colorIndex(n) { return Math.floor((n - 1) / 10) % 5; }

  function pad(n) { return n < 10 ? '0' + n : String(n); }
  // 복사용 문장: "A  03 11 24 27 38 41 + 07"
  function gamesText(games, labels, plusMark) {
    var letters = 'ABCDE';
    return games.map(function (g, i) {
      var line = (labels || letters)[i] ? (labels || letters)[i] : letters[i];
      line += '  ' + g.main.map(pad).join(' ');
      if (g.extra.length) line += ' ' + (plusMark || '+') + ' ' + g.extra.map(pad).join(' ');
      return line;
    }).join('\n');
  }

  return {
    MAX_GAMES: MAX_GAMES, PRESETS: PRESETS, CUSTOM_LIMITS: CUSTOM_LIMITS,
    cryptoInt: cryptoInt, clampGames: clampGames, configFor: configFor, parseNumbers: parseNumbers, validate: validate,
    pickFrom: pickFrom, drawGame: drawGame, drawGames: drawGames, colorIndex: colorIndex, pad: pad, gamesText: gamesText,
  };
});
