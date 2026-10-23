/* apps/bmi/bmi-core.js — BMI 계산기 언어 무관 로직 (UMD: 브라우저 window.BMI_CORE + Node 검사 공용)
 *   BMI = 몸무게(kg) ÷ 키(m)². 미국식 단위는 1 in = 2.54 cm, 1 lb = 0.45359237 kg 으로 바꿔 같은 식으로 계산한다.
 *   화면 값 = 소수 1자리 반올림(bmi1). 단계는 이 bmi1 로 정한다(24.96 → 25.0 → 과체중, 화면과 단계가 어긋나지 않게).
 *   기준(scale) — cuts = 단계 경계(이 값 "이상"이면 다음 단계). 1번 단계(인덱스 1)가 언제나 정상.
 *     who  세계보건기구(WHO): <18.5 저체중 · 18.5–24.9 정상 · 25–29.9 과체중 · 30–34.9 비만 1 · 35–39.9 비만 2 · 40+ 비만 3
 *     asia 아시아·태평양(WHO 서태평양 지역, 2000): <18.5 · 18.5–22.9 · 23–24.9 과체중(위험) · 25–29.9 비만 1 · 30+ 비만 2
 *     kr   대한비만학회(2022): <18.5 · 18.5–22.9 · 23–24.9 비만 전단계 · 25–29.9 1단계 · 30–34.9 2단계 · 35+ 3단계
 *     jp   日本肥満学会(JASSO): <18.5 低体重 · 18.5–24.9 普通体重 · 25–29.9 肥満1度 · 30–34.9 2度 · 35–39.9 3度 · 40+ 4度
 *     cn   中国成人标准(WS/T 428-2013): <18.5 偏瘦 · 18.5–23.9 正常 · 24–27.9 超重 · 28+ 肥胖
 *   "아시아 기준" 토글: 언어마다 그 나라 기준(ALT_SCALE), 기본 켜짐은 ASIA_ON 언어만.
 *   입력 = 문자열. parseNum 은 "," 와 "." 를 모두 소수점으로 받는다(70,5 = 70.5). 공백·전각 숫자 허용, 자릿수 구분·부호·지수 표기는 받지 않는다.
 *   서버로 보내는 것도, 주소에 넣는 것도 없다.
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BMI_CORE = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var IN_CM = 2.54;
  var LB_KG = 0.45359237;
  var SCALES = {
    who: [18.5, 25, 30, 35, 40],
    asia: [18.5, 23, 25, 30],
    kr: [18.5, 23, 25, 30, 35],
    jp: [18.5, 25, 30, 35, 40],
    cn: [18.5, 24, 28],
  };
  var ALT_SCALE = { ko: 'kr', ja: 'jp', zh: 'cn' };          // 그 밖 언어 = asia
  var ASIA_ON = ['ko', 'ja', 'zh', 'th', 'vi'];               // "아시아 기준"이 처음부터 켜진 언어
  // 받는 범위 (성인 계산기 — 이 밖이면 오타로 본다)
  var LIMIT = { cm: [50, 272], kg: [10, 650], age: [2, 120] };
  var BAR = [14, 42];                                          // 색 막대가 보여 주는 BMI 범위

  function altScale(lang) { return ALT_SCALE[lang] || 'asia'; }
  function asiaDefault(lang) { return ASIA_ON.indexOf(lang) >= 0; }
  function round1(x) { return Math.round(x * 10 + 1e-9) / 10; }

  // 문자열 → { value } | { empty: true } | { error: 'badNum' }
  function parseNum(input) {
    var s = String(input == null ? '' : input).trim();
    s = s.replace(/[\s   ]/g, '');
    s = s.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }).replace(/[，、]/g, ',').replace(/[．。]/g, '.');
    if (s === '') return { empty: true };
    if (!/^[0-9]*[.,]?[0-9]*$/.test(s) || !/[0-9]/.test(s)) return { error: 'badNum' };
    var v = Number(s.replace(',', '.'));
    if (!isFinite(v)) return { error: 'badNum' };
    return { value: v };
  }

  // 키(cm)·몸무게(kg) → BMI (반올림 전)
  function bmi(cm, kg) { var m = cm / 100; return kg / (m * m); }
  function ftInToCm(ft, inch) { return (ft * 12 + inch) * IN_CM; }
  function cmToFtIn(cm) {
    var total = cm / IN_CM;
    var ft = Math.floor(total / 12 + 1e-9);
    var inch = round1(total - ft * 12);
    if (inch >= 12) { ft += 1; inch = round1(inch - 12); }
    return { ft: ft, inch: inch };
  }
  function lbToKg(lb) { return lb * LB_KG; }
  function kgToLb(kg) { return kg / LB_KG; }

  // 단계 인덱스 (bmi1 기준)
  function category(b1, scale) {
    var cuts = SCALES[scale] || SCALES.who;
    var i = 0;
    while (i < cuts.length && b1 >= cuts[i]) i++;
    return i;
  }
  // 정상 범위 BMI (아래 18.5, 위 = 다음 경계 − 0.1)
  function healthyBmi(scale) {
    var cuts = SCALES[scale] || SCALES.who;
    return [cuts[0], round1(cuts[1] - 0.1)];
  }
  // 색 막대 위 위치 0~1
  function barPos(b) { return Math.max(0, Math.min(1, (b - BAR[0]) / (BAR[1] - BAR[0]))); }

  // 입력 문자열 → 결과 | { empty, started } | { error, field }
  //   o = { unit: 'metric'|'imperial', cm, kg, ft, inch, lb, age, scale }
  //   started = 숫자가 하나라도 제대로 들어왔나(track start 용)
  function run(o) {
    var imperial = o.unit === 'imperial';
    var fields = imperial ? ['ft', 'inch', 'lb'] : ['cm', 'kg'];
    var p = {}, started = false;
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      p[f] = parseNum(o[f]);
      if (p[f].error) return { error: 'badNum', field: f };
      if (!p[f].empty) started = true;
    }
    var pa = parseNum(o.age);
    if (pa.error) return { error: 'badNum', field: 'age' };
    var age = pa.empty ? null : pa.value;
    if (age != null && (age < LIMIT.age[0] || age > LIMIT.age[1] || Math.floor(age) !== age)) return { error: 'ageRange', field: 'age' };
    var cm, kg;
    if (imperial) {
      if (p.ft.empty && p.inch.empty) return { empty: true, started: started };
      cm = ftInToCm(p.ft.empty ? 0 : p.ft.value, p.inch.empty ? 0 : p.inch.value);
      if (!p.inch.empty && p.inch.value >= 12 && !p.ft.empty && p.ft.value > 0) return { error: 'inchRange', field: 'inch' };
      if (p.lb.empty) return { empty: true, started: started };
      kg = lbToKg(p.lb.value);
    } else {
      if (p.cm.empty || p.kg.empty) return { empty: true, started: started };
      cm = p.cm.value;
      kg = p.kg.value;
    }
    if (cm < LIMIT.cm[0] || cm > LIMIT.cm[1]) return { error: 'heightRange', field: imperial ? 'ft' : 'cm', started: started };
    if (kg < LIMIT.kg[0] || kg > LIMIT.kg[1]) return { error: 'weightRange', field: imperial ? 'lb' : 'kg', started: started };
    var scale = SCALES[o.scale] ? o.scale : 'who';
    var raw = bmi(cm, kg);
    var b1 = round1(raw);
    var cat = category(b1, scale);
    var hb = healthyBmi(scale);
    var m2 = (cm / 100) * (cm / 100);
    var minKg = hb[0] * m2, maxKg = hb[1] * m2;
    var diffKg = cat === 0 ? minKg - kg : cat > 1 ? kg - maxKg : 0;    // 정상까지 (늘릴 / 줄일) kg
    return {
      ok: true, started: true, unit: imperial ? 'imperial' : 'metric', scale: scale,
      cm: cm, kg: kg, raw: raw, bmi: b1, cat: cat, bands: SCALES[scale].length + 1,
      healthy: hb, minKg: minKg, maxKg: maxKg, diffKg: Math.max(0, diffKg), dir: cat === 0 ? 'gain' : cat > 1 ? 'lose' : 'in',
      pos: barPos(raw), age: age, minor: age != null && age < 18, senior: age != null && age >= 65,
    };
  }

  // 몸무게 차이·범위를 화면 단위로 (소수 1자리, 차이는 올림 — 0.0 으로 보이지 않게)
  function weightIn(kg, unit) { return round1(unit === 'imperial' ? kgToLb(kg) : kg); }
  function diffIn(kg, unit) {
    var v = unit === 'imperial' ? kgToLb(kg) : kg;
    return v <= 0 ? 0 : Math.max(0.1, Math.ceil(v * 10 - 1e-9) / 10);
  }

  return {
    IN_CM: IN_CM, LB_KG: LB_KG, SCALES: SCALES, ALT_SCALE: ALT_SCALE, ASIA_ON: ASIA_ON, LIMIT: LIMIT, BAR: BAR,
    altScale: altScale, asiaDefault: asiaDefault, round1: round1, parseNum: parseNum, bmi: bmi,
    ftInToCm: ftInToCm, cmToFtIn: cmToFtIn, lbToKg: lbToKg, kgToLb: kgToLb,
    category: category, healthyBmi: healthyBmi, barPos: barPos, run: run, weightIn: weightIn, diffIn: diffIn,
  };
});
