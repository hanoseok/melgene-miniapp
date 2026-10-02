/* apps/life/life-core.js — 내 인생 애니메이션 핵심 로직 (언어 무관, UMD)
 * 브라우저(<script src="life-core.js">)와 Node(tools/check-life.js)가 같은 코드를 쓴다.
 *   - 장면(moment) 카탈로그: id, 인생 단계, 보통 나이
 *   - 입력 정규화 / 공유 링크(#d=) 인코딩(UTF-8 safe base64url)
 *   - 연도 추정(연도를 비운 장면은 나이에 맞게 보간) + 시간순 정렬 + 나이 계산
 *   - 장면 계획(planFilm): 자막 문구, 장면 길이, 시드
 * 화면에 보이는 문구는 tools/i18n/<lang>.js 의 ui 에서 온다 (window.PAGE_I18N).
 */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = core;
  } else {
    root.LIFE_CORE = core;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var MIN_BIRTH = 1950;
  var MIN_MOMENTS = 3;
  var MAX_MOMENTS = 8; // 나만의 장면 포함
  var NAME_MAX = 12;
  var CUSTOM_MAX = 20;
  var PENS = ['brush', 'pencil', 'ballpoint', 'fountain'];
  var STAGES = ['early', 'school', 'youth', 'adult', 'today'];

  // age: 보통 그 일이 일어나는 나이(해 기준). langs 가 있으면 그 언어에서만 칩으로 보인다
  // (공유 링크로 다른 언어 페이지에서 열어도 문구는 모든 언어에 있다).
  //   military: 징병이 인생의 한 장면인 곳만 — ko 군대, th เกณฑ์ทหาร(21살 추첨), vi nghĩa vụ quân sự, ru армия(проводы в армию)
  //   gapyear : ko·ru 를 뺀 전부 — en gap year, ja 留学・ワーホリ, zh 出国留学, fr/es Erasmus, de Auslandsjahr, th Work and Travel, vi du học
  //   dacha   : ru 만 — 여름방학마다 할머니 다차(텃밭 딸린 시골집)에서 보낸 어린 시절
  var MOMENTS = [
    { id: 'steps', stage: 'early', age: 1 },
    { id: 'kinder', stage: 'early', age: 5 },
    { id: 'school', stage: 'early', age: 7 },
    { id: 'friend', stage: 'early', age: 8 },
    { id: 'dacha', stage: 'early', age: 10, langs: ['ru'] },
    { id: 'teen', stage: 'school', age: 14 },
    { id: 'love', stage: 'school', age: 16 },
    { id: 'exam', stage: 'school', age: 18 },
    { id: 'military', stage: 'youth', age: 21, langs: ['ko', 'th', 'vi', 'ru'] },
    { id: 'gapyear', stage: 'youth', age: 19, langs: ['en', 'ja', 'zh', 'fr', 'de', 'th', 'vi', 'es', 'it', 'pt'] },
    { id: 'college', stage: 'youth', age: 19 },
    { id: 'parttime', stage: 'youth', age: 18 },
    { id: 'travel', stage: 'youth', age: 23 },
    { id: 'job', stage: 'adult', age: 26 },
    { id: 'ownplace', stage: 'adult', age: 27 },
    { id: 'move', stage: 'adult', age: 29 },
    { id: 'pet', stage: 'adult', age: 28 },
    { id: 'wedding', stage: 'adult', age: 31 },
    { id: 'baby', stage: 'adult', age: 33 },
    { id: 'newjob', stage: 'adult', age: 32 },
    { id: 'startup', stage: 'adult', age: 35 },
    { id: 'challenge', stage: 'adult', age: 37 }
  ];
  var MOMENT_INDEX = {};
  MOMENTS.forEach(function (m, i) { MOMENT_INDEX[m.id] = i; });

  // 입력하지 않았을 때 기본으로 골라 두는 장면 (나이에 맞는 것만, 앞에서부터 5개)
  var DEFAULT_PREF = ['steps', 'school', 'love', 'job', 'wedding', 'college', 'travel', 'baby'];

  // ---------------------------------------------------------------
  // 유틸
  // ---------------------------------------------------------------
  function clampInt(v, lo, hi) {
    v = Math.round(Number(v));
    if (!isFinite(v)) return null;
    return Math.max(lo, Math.min(hi, v));
  }
  function toInt(v) {
    if (v === '' || v == null) return null;
    var n = Number(v);
    return isFinite(n) ? Math.round(n) : null;
  }
  function fmt(tpl, vars) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) {
      return vars[k] != null ? vars[k] : m;
    });
  }
  function chars(str) { return Array.from ? Array.from(String(str)) : String(str).split(''); }
  function cut(str, max) { return chars(String(str || '').replace(/[\u0000-\u001f]/g, '').trim()).slice(0, max).join(''); }

  // 시드 난수 (mulberry32) + 문자열 해시 (FNV-1a 32bit)
  function mulberry32(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash32(str) {
    var h = 0x811c9dc5;
    str = String(str);
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  // ---------------------------------------------------------------
  // base64url (UTF-8 safe) — 사다리와 같은 방식
  // ---------------------------------------------------------------
  function encodeShare(obj) {
    var bytes = new TextEncoder().encode(JSON.stringify(obj));
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeShare(str) {
    var b64 = String(str).replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  // ---------------------------------------------------------------
  // 카탈로그
  // ---------------------------------------------------------------
  function momentById(id) { return MOMENT_INDEX[id] != null ? MOMENTS[MOMENT_INDEX[id]] : null; }
  function momentsFor(lang) {
    return MOMENTS.filter(function (m) { return !m.langs || m.langs.indexOf(lang) !== -1; });
  }
  function maxBirth(nowY) { return nowY - 1; }

  // 만 나이 기준 "지금까지 N년"
  function lifeYears(birth, month, nowY, nowM) {
    var n = nowY - birth;
    if (month && nowM && nowM < month) n -= 1;
    return Math.max(0, n);
  }

  function defaultMoments(span, lang) {
    var avail = momentsFor(lang || 'ko');
    var ok = {};
    avail.forEach(function (m) { ok[m.id] = true; });
    var picked = DEFAULT_PREF.filter(function (id) { return ok[id] && momentById(id).age <= span; }).slice(0, 5);
    if (picked.length < MIN_MOMENTS) {
      // 아주 어린 경우: 나이가 가장 이른 장면으로 채운다 (연도는 태어난 해 쪽으로 압축된다)
      avail.slice().sort(function (a, b) { return a.age - b.age; }).forEach(function (m) {
        if (picked.length < MIN_MOMENTS && picked.indexOf(m.id) === -1) picked.push(m.id);
      });
    }
    return picked;
  }

  // ---------------------------------------------------------------
  // 입력 정규화. 잘못된 값은 고치거나 버리고, 출생 연도가 범위를 벗어나면 null.
  // raw: { name, birth, month, pen, moments:[{id, year}], custom:{text, year}|null, now:{y,m} }
  // ---------------------------------------------------------------
  function normalizeInput(raw, now) {
    if (!raw) return null;
    now = raw.now && raw.now.y ? raw.now : now;
    var nowY = clampInt(now && now.y, 2000, 2200);
    var nowM = clampInt(now && now.m, 1, 12) || 1;
    if (!nowY) return null;
    var birth = toInt(raw.birth);
    if (birth == null || birth < MIN_BIRTH || birth > maxBirth(nowY)) return null;
    var month = toInt(raw.month);
    if (!(month >= 1 && month <= 12)) month = 0;
    var pen = PENS.indexOf(raw.pen) !== -1 ? raw.pen : PENS[0];

    var seen = {};
    var moments = [];
    (raw.moments || []).forEach(function (m) {
      if (!m || !momentById(m.id) || seen[m.id]) return;
      seen[m.id] = true;
      var y = toInt(m.year);
      if (y != null && (y < birth || y > nowY)) y = Math.max(birth, Math.min(nowY, y));
      moments.push({ id: m.id, year: y });
    });
    var custom = null;
    if (raw.custom && cut(raw.custom.text, CUSTOM_MAX)) {
      var cy = toInt(raw.custom.year);
      if (cy != null && (cy < birth || cy > nowY)) cy = Math.max(birth, Math.min(nowY, cy));
      custom = { text: cut(raw.custom.text, CUSTOM_MAX), year: cy };
    }
    var room = MAX_MOMENTS - (custom ? 1 : 0);
    moments = moments.slice(0, room);

    return {
      name: cut(raw.name, NAME_MAX),
      birth: birth,
      month: month,
      pen: pen,
      moments: moments,
      custom: custom,
      now: { y: nowY, m: nowM }
    };
  }

  function momentCount(input) { return input.moments.length + (input.custom ? 1 : 0); }
  function isPlayable(input) {
    var c = momentCount(input);
    return c >= MIN_MOMENTS && c <= MAX_MOMENTS;
  }

  // 공유 링크용 짧은 형태
  function toPayload(input) {
    return {
      v: 1,
      n: input.name || '',
      b: input.birth,
      m: input.month || 0,
      y: input.now.y,
      o: input.now.m,
      p: input.pen,
      k: input.moments.map(function (m) { return m.year == null ? m.id : [m.id, m.year]; }),
      c: input.custom ? [input.custom.text, input.custom.year == null ? 0 : input.custom.year] : 0
    };
  }
  function fromPayload(p) {
    if (!p || p.v !== 1 || !Array.isArray(p.k)) return null;
    var raw = {
      name: p.n,
      birth: p.b,
      month: p.m,
      pen: p.p,
      now: { y: p.y, m: p.o },
      moments: p.k.map(function (k) {
        return Array.isArray(k) ? { id: k[0], year: k[1] } : { id: k, year: null };
      }),
      custom: Array.isArray(p.c) ? { text: p.c[0], year: p.c[1] || null } : null
    };
    return normalizeInput(raw, raw.now);
  }

  function seedOf(input) { return hash32(JSON.stringify(toPayload(input))); }

  // ---------------------------------------------------------------
  // 연도 추정: 연도를 넣은 장면은 그대로, 비운 장면은 보통 나이로 추정.
  // 보통 나이가 지금 나이보다 많은 장면(예: 21살이 고른 "결혼")은
  // 인생 후반부(55%~100%)로 눌러 담아 항상 태어난 해~올해 사이가 되게 한다.
  // 결과는 시간순(같은 해면 보통 나이 → 카탈로그 순).
  // ---------------------------------------------------------------
  function estimateYears(input) {
    var birth = input.birth;
    var nowY = input.now.y;
    var span = Math.max(0, nowY - birth);
    var items = input.moments.map(function (m) {
      return { kind: 'moment', id: m.id, typical: momentById(m.id).age, fixed: m.year, order: MOMENT_INDEX[m.id] };
    });
    if (input.custom) {
      items.push({
        kind: 'custom', id: 'custom', text: input.custom.text,
        typical: Math.max(1, Math.round(span * 0.8)), fixed: input.custom.year, order: 999
      });
    }
    var maxR = 0;
    items.forEach(function (it) { if (it.fixed == null) maxR = Math.max(maxR, it.typical); });
    var knee = span * 0.55;
    function squash(r) {
      if (maxR <= span) return r;
      if (r <= knee) return r;
      return knee + (r - knee) * (span - knee) / (maxR - knee);
    }
    items.forEach(function (it) {
      it.anchor = it.fixed != null ? it.fixed - birth : squash(it.typical);
    });
    items.sort(function (a, b) {
      return (a.anchor - b.anchor) || (a.typical - b.typical) || (a.order - b.order);
    });
    items.forEach(function (it) {
      var y = it.fixed != null ? it.fixed : Math.round(birth + it.anchor);
      it.year = Math.max(birth, Math.min(nowY, y));
      it.age = it.year - birth;
      it.estimated = it.fixed == null;
    });
    return items;
  }

  // 장면 길이(초): 전체 40~58초
  var DUR = { birth: 6, today: 6, end: 8.5 };
  function momentDuration(n) {
    return Math.max(4.6, Math.min(7, 30 / Math.max(1, n)));
  }

  // 복수형: ui.plural[key] = { one, few, many, other } (Intl.PluralRules 범주 — ru: 1 год · 2 года · 5 лет · 21 год).
  // 표가 없는 언어·키는 ui[key] 그대로.
  var prCache = {};
  function pluralCat(lang, n) {
    try {
      if (typeof Intl === 'undefined' || !Intl.PluralRules) return 'other';
      var pr = prCache[lang] || (prCache[lang] = new Intl.PluralRules(lang || 'en'));
      return pr.select(Number(n));
    } catch (e) { return 'other'; }
  }
  function plural(ui, key, n) {
    var t = ui.plural && ui.plural[key];
    if (!t) return ui[key];
    var c = pluralCat(ui.lang, n);
    return t[c] != null ? t[c] : (t.other != null ? t.other : ui[key]);
  }

  function ageText(ui, n) {
    if (n === 0 && ui.ageZero) return ui.ageZero;
    return fmt(n === 1 && ui.ageOne ? ui.ageOne : plural(ui, 'ageTpl', n), { n: n });
  }

  // ---------------------------------------------------------------
  // 장면 계획. opts.hero: 랜딩용(끝 장면 없이 반복)
  // ---------------------------------------------------------------
  function planFilm(input, ui, opts) {
    opts = opts || {};
    var seed = seedOf(input);
    var rnd = mulberry32(seed ^ 0x5bd1e995);
    var items = estimateYears(input);
    var N = lifeYears(input.birth, input.month, input.now.y, input.now.m);
    var d = opts.hero ? 4.6 : momentDuration(items.length);
    var name = input.name;
    var scenes = [];
    // 화면에 쓰는 연도만 바꾼다(타이: 불기 = 서기 + 543). 입력·계산·공유 링크는 항상 서기.
    var yo = ui.yearOffset || 0;

    var birthMeta = input.month
      ? fmt(ui.birthMetaMonth, { year: input.birth + yo, month: input.month, monthName: (ui.months || [])[input.month - 1] || input.month })
      : fmt(ui.birthMeta, { year: input.birth + yo });
    scenes.push({
      key: 'birth', motif: 'birth', year: input.birth, age: 0,
      meta: birthMeta, line: ui.birthLine, dur: opts.hero ? 4.8 : DUR.birth
    });

    items.forEach(function (it) {
      var line = it.kind === 'custom' ? it.text : ((ui.moments[it.id] || {}).line || '');
      scenes.push({
        key: it.kind, id: it.id, motif: it.kind === 'custom' ? 'custom' : it.id,
        year: it.year, age: it.age, estimated: it.estimated,
        meta: fmt(ui.metaTpl, { year: it.year + yo, age: ageText(ui, it.age) }),
        line: line, dur: d
      });
    });

    scenes.push({
      key: 'today', motif: 'today', year: input.now.y, age: N,
      meta: fmt(ui.metaTpl, { year: input.now.y + yo, age: ageText(ui, N) }),
      line: ui.todayLine, dur: opts.hero ? 4.8 : DUR.today
    });

    if (!opts.hero) {
      var who = name || ui.endNoName;
      var closings = ui.closings || [''];
      scenes.push({
        key: 'end', motif: 'end', year: input.now.y, age: N,
        title1: fmt(name ? ui.endTitle : ui.endTitleNoName, { name: who }),
        title2: N === 0 ? ui.endTitleZero : fmt(N === 1 && ui.endTitleOne ? ui.endTitleOne : plural(ui, 'endTitle2', N), { n: N }),
        closing: closings[Math.floor(rnd() * closings.length)],
        tbc: ui.toBeContinued || '',
        dur: DUR.end
      });
    }

    var t = 0;
    scenes.forEach(function (s, i) { s.index = i; s.t0 = t; t += s.dur; });

    return {
      seed: seed,
      pen: input.pen,
      name: name,
      birth: input.birth,
      month: input.month,
      now: input.now,
      years: N,
      yearOffset: yo,
      hero: !!opts.hero,
      scenes: scenes,
      total: t
    };
  }

  // 텍스트 폭 어림(em): 한글·가나·한자 1, 라틴 대문자 0.62, 소문자 0.5, 숫자 0.55, 공백/구두점 0.3.
  // 악센트 붙은 라틴 글자(é, ß, ơ, ế …)는 밑글자와 같게, 결합 부호(타이 모음·성조, U+0300~)는 0, 타이 글자 0.56.
  // 키릴 문자(ru)는 라틴보다 15% 남짓 넓다(실측: 시스템 고딕·Caveat) — 대문자 0.68, 소문자 0.58.
  // 손글씨 글꼴 기준이라 조금 넉넉하게 잡는다. check-life.js 와 캔버스 없는 환경의 측정에 쓴다.
  function isMark(c) {
    return (c >= 0x0300 && c <= 0x036f) || c === 0x0e31 || (c >= 0x0e34 && c <= 0x0e3a) || (c >= 0x0e47 && c <= 0x0e4e) ||
      c === 0x200b || c === 0x200c || c === 0x200d || (c >= 0xfe00 && c <= 0xfe0f);
  }
  function isLatinExt(c) { return (c >= 0x00c0 && c <= 0x024f && c !== 0x00d7 && c !== 0x00f7) || (c >= 0x1e00 && c <= 0x1eff); }
  function textUnits(str) {
    var u = 0;
    chars(str).forEach(function (ch) {
      var c = ch.codePointAt(0);
      if (isMark(c)) return;
      if ((c >= 0x1100 && c <= 0x11ff) || (c >= 0x3000 && c <= 0x9fff) || (c >= 0xac00 && c <= 0xd7af) || (c >= 0xff00 && c <= 0xffef)) u += 1;
      else if (c >= 0x0e00 && c <= 0x0e7f) u += 0.56;
      else if (c >= 0x0400 && c <= 0x04ff) u += ch !== ch.toLowerCase() ? 0.68 : 0.58;
      else if (isLatinExt(c)) u += ch !== ch.toLowerCase() ? 0.62 : 0.5;
      else if (c > 0x2000) u += 1; // 이모지·기호
      else if (/[A-Z]/.test(ch)) u += 0.62;
      else if (/[a-z]/.test(ch)) u += 0.5;
      else if (/[0-9]/.test(ch)) u += 0.55;
      else u += 0.3;
    });
    return u;
  }

  return {
    MIN_BIRTH: MIN_BIRTH,
    MIN_MOMENTS: MIN_MOMENTS,
    MAX_MOMENTS: MAX_MOMENTS,
    NAME_MAX: NAME_MAX,
    CUSTOM_MAX: CUSTOM_MAX,
    PENS: PENS,
    STAGES: STAGES,
    MOMENTS: MOMENTS,
    DEFAULT_PREF: DEFAULT_PREF,
    mulberry32: mulberry32,
    hash32: hash32,
    fmt: fmt,
    chars: chars,
    encodeShare: encodeShare,
    decodeShare: decodeShare,
    momentById: momentById,
    momentsFor: momentsFor,
    maxBirth: maxBirth,
    lifeYears: lifeYears,
    defaultMoments: defaultMoments,
    normalizeInput: normalizeInput,
    momentCount: momentCount,
    isPlayable: isPlayable,
    toPayload: toPayload,
    fromPayload: fromPayload,
    seedOf: seedOf,
    estimateYears: estimateYears,
    momentDuration: momentDuration,
    plural: plural,
    ageText: ageText,
    planFilm: planFilm,
    textUnits: textUnits
  };
});
