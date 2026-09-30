/* apps/team/team-core.js — 랜덤 팀 나누기 언어 무관 로직 (UMD: 브라우저 window.TEAM_CORE + Node 검사 공용)
 *   - 이름 읽기: 줄바꿈·쉼표(, ， 、 ; ；)로 나눔, 앞뒤 공백 제거, 최대 60명 · 이름 20자. 앞이나 뒤의 * ＊ ★ = 주장(리더) 표시
 *   - 팀 수: 팀 개수로(2~20, 사람 수 이하) 또는 팀당 인원으로(2 이상, 팀 수 = ceil(n / 인원), 20팀 이하)
 *   - 섞기: crypto.getRandomValues 로 치우침 없는 정수(거부 샘플링) → Fisher–Yates. 모든 배치가 같은 확률.
 *     주장 모드면 주장들을 먼저 섞어 팀마다 한 명씩 돌려 넣고(주장이 팀보다 많으면 두 번째 바퀴), 나머지를 섞어 이어서 돌려 넣는다
 *     → 팀 인원 차이는 언제나 1명 이하. 마지막에 팀 순서를 섞어 누가 1명 더 많은 팀이 될지도 무작위.
 *   - 팀 이름: 동물 20개(id·이모지·색은 여기, 이름은 tools/i18n/<lang>.js 의 teams[id]) 중 무작위, 이름만 다시 뽑기 가능
 *   - 공유 링크 #d= : { v, n: 이름(주장은 앞에 *), t: 팀별 사람 번호, a: 팀별 동물 번호 } JSON → UTF-8 base64url. 서버에 저장하지 않는다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TEAM_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MAX_NAMES = 60;
  var MAX_LEN = 20;
  var MIN_TEAMS = 2;
  var MAX_TEAMS = 20;
  var MIN_SIZE = 2;
  var SHARE_VERSION = 1;
  // 순서(번호)는 공유 링크에 쓰이므로 바꾸지 않는다(뒤에 붙이는 것만 가능).
  var TEAMS = [
    { id: 'tiger', emoji: '🐯', color: '#ff8a1f' },
    { id: 'eagle', emoji: '🦅', color: '#7a5230' },
    { id: 'shark', emoji: '🦈', color: '#2f7fd8' },
    { id: 'wolf', emoji: '🐺', color: '#5d6b82' },
    { id: 'fox', emoji: '🦊', color: '#e8561c' },
    { id: 'panda', emoji: '🐼', color: '#2b2b33' },
    { id: 'lion', emoji: '🦁', color: '#d9a400' },
    { id: 'owl', emoji: '🦉', color: '#8a5cd1' },
    { id: 'dolphin', emoji: '🐬', color: '#12a4c9' },
    { id: 'bear', emoji: '🐻', color: '#9a5b2e' },
    { id: 'rabbit', emoji: '🐰', color: '#e0609a' },
    { id: 'penguin', emoji: '🐧', color: '#1f3b73' },
    { id: 'dragon', emoji: '🐉', color: '#1e9e5a' },
    { id: 'unicorn', emoji: '🦄', color: '#c04fd8' },
    { id: 'octopus', emoji: '🐙', color: '#e0413f' },
    { id: 'frog', emoji: '🐸', color: '#5fae1e' },
    { id: 'koala', emoji: '🐨', color: '#7d8a96' },
    { id: 'parrot', emoji: '🦜', color: '#18a88a' },
    { id: 'bee', emoji: '🐝', color: '#e5b300' },
    { id: 'turtle', emoji: '🐢', color: '#3c8d2f' },
  ];
  var SPLIT_RE = /[\n\r,，、;；]+/;
  var MARK_RE = /^[\s*＊★]+|[\s*＊★]+$/g;
  var LEAD_RE = /^\s*[*＊★]|[*＊★]\s*$/;

  // ---------------------------------------------------------------- 이름 읽기
  function cut(s, max) { var a = Array.from(s); return a.length > max ? a.slice(0, max).join('') : s; }
  function parseNames(text) {
    var parts = String(text || '').split(SPLIT_RE);
    var people = [];
    var dropped = 0;
    parts.forEach(function (raw) {
      var leader = LEAD_RE.test(raw);
      var name = cut(raw.replace(MARK_RE, '').replace(/\s+/g, ' ').trim(), MAX_LEN).trim();
      if (!name) return;
      if (people.length >= MAX_NAMES) { dropped++; return; }
      people.push({ name: name, leader: leader });
    });
    return { people: people, dropped: dropped };
  }
  function toText(people) {
    return people.map(function (p) { return (p.leader ? '*' : '') + p.name; }).join('\n');
  }

  // ---------------------------------------------------------------- 팀 수
  function teamRange(n) { return { min: MIN_TEAMS, max: Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, n)) }; }
  function sizeRange(n) {
    return { min: Math.max(MIN_SIZE, Math.ceil(n / MAX_TEAMS)), max: Math.max(MIN_SIZE, Math.ceil(n / 2)) };
  }
  function clamp(v, r) { v = Math.round(Number(v)); if (!isFinite(v)) v = r.min; return Math.min(r.max, Math.max(r.min, v)); }
  // mode 'teams' = 팀 개수, 'size' = 팀당 인원. 사람이 2명보다 적으면 0 (섞을 수 없음)
  function teamCount(n, mode, value) {
    if (n < MIN_TEAMS) return 0;
    if (mode === 'size') return Math.min(MAX_TEAMS, n, Math.max(MIN_TEAMS, Math.ceil(n / clamp(value, sizeRange(n)))));
    return clamp(value, teamRange(n));
  }
  function sizesFor(n, k) {
    var out = [];
    for (var i = 0; i < k; i++) out.push(Math.floor(n / k) + (i < n % k ? 1 : 0));
    return out;
  }

  // ---------------------------------------------------------------- 난수 (crypto, 치우침 없음)
  function cryptoObj() {
    if (typeof crypto !== 'undefined' && crypto && crypto.getRandomValues) return crypto;
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
  function shuffle(arr, randInt) {
    var a = arr.slice();
    var ri = randInt || cryptoInt;
    for (var i = a.length - 1; i > 0; i--) {
      var j = ri(i + 1);
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

  // ---------------------------------------------------------------- 팀 만들기
  function pickAnimals(k, randInt) { return shuffle(range(TEAMS.length), randInt).slice(0, k); }
  // people: [{ name, leader }], k: 팀 수, leaders: 주장 나누기 켜짐 → { teams: [[사람 번호]], animals: [동물 번호] }
  function makeTeams(people, k, leaders, randInt) {
    var n = people.length;
    k = Math.min(MAX_TEAMS, Math.max(MIN_TEAMS, k | 0));
    if (n < k) return null;
    var lead = [];
    var rest = [];
    people.forEach(function (p, i) { (leaders && p.leader ? lead : rest).push(i); });
    var order = shuffle(lead, randInt).concat(shuffle(rest, randInt));
    var teams = range(k).map(function () { return []; });
    order.forEach(function (p, i) { teams[i % k].push(p); });
    return { teams: shuffle(teams, randInt), animals: pickAnimals(k, randInt) };
  }

  // ---------------------------------------------------------------- 공유 링크 (#d=...) — UTF-8 안전 base64url
  function b64urlEncode(str) {
    var bytes = new TextEncoder().encode(str);
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
  // result = { people: [{ name, leader }], leaders: bool, teams: [[i]], animals: [a] }
  function validResult(r) {
    if (!r || !Array.isArray(r.people) || !Array.isArray(r.teams) || !Array.isArray(r.animals)) return false;
    var n = r.people.length;
    var k = r.teams.length;
    if (n < MIN_TEAMS || n > MAX_NAMES || k < MIN_TEAMS || k > MAX_TEAMS || k > n || r.animals.length !== k) return false;
    if (!r.people.every(function (p) { return p && typeof p.name === 'string' && p.name.trim() && Array.from(p.name).length <= MAX_LEN && !/[\n\r]/.test(p.name); })) return false;
    var seen = new Array(n).fill(false);
    var count = 0;
    var sizes = [];
    for (var t = 0; t < k; t++) {
      var team = r.teams[t];
      if (!Array.isArray(team) || !team.length) return false;
      sizes.push(team.length);
      for (var m = 0; m < team.length; m++) {
        var i = team[m];
        if (typeof i !== 'number' || i !== (i | 0) || i < 0 || i >= n || seen[i]) return false;
        seen[i] = true; count++;
      }
    }
    if (count !== n) return false;
    var aSeen = {};
    for (var a = 0; a < k; a++) {
      var x = r.animals[a];
      if (typeof x !== 'number' || x !== (x | 0) || x < 0 || x >= TEAMS.length || aSeen[x]) return false;
      aSeen[x] = 1;
    }
    return true;
  }
  function encodeShare(r) {
    if (!validResult(r)) return null;
    return b64urlEncode(JSON.stringify({
      v: SHARE_VERSION,
      n: r.people.map(function (p) { return (r.leaders && p.leader ? '*' : '') + p.name; }),
      t: r.teams,
      a: r.animals,
    }));
  }
  function decodeShare(str) {
    if (!str || typeof str !== 'string' || str.length > 12000 || !/^[A-Za-z0-9_-]+$/.test(str)) return null;
    try {
      var p = JSON.parse(b64urlDecode(str));
      if (!p || p.v !== SHARE_VERSION || !Array.isArray(p.n)) return null;
      var leaders = false;
      var people = p.n.map(function (s) {
        s = String(s);
        var lead = s.charAt(0) === '*';
        if (lead) leaders = true;
        return { name: lead ? s.slice(1) : s, leader: lead };
      });
      var r = { people: people, leaders: leaders, teams: p.t, animals: p.a };
      return validResult(r) ? r : null;
    } catch (e) {
      return null;
    }
  }

  return {
    MAX_NAMES: MAX_NAMES,
    MAX_LEN: MAX_LEN,
    MIN_TEAMS: MIN_TEAMS,
    MAX_TEAMS: MAX_TEAMS,
    MIN_SIZE: MIN_SIZE,
    TEAMS: TEAMS,
    parseNames: parseNames,
    toText: toText,
    teamRange: teamRange,
    sizeRange: sizeRange,
    clamp: clamp,
    teamCount: teamCount,
    sizesFor: sizesFor,
    cryptoInt: cryptoInt,
    shuffle: shuffle,
    pickAnimals: pickAnimals,
    makeTeams: makeTeams,
    validResult: validResult,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    b64urlEncode: b64urlEncode,
    b64urlDecode: b64urlDecode,
  };
});
