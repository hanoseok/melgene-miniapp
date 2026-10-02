/* apps/past-life/data.js
 * 나의 전생 테스트 — 언어와 무관한 데이터: 결과 16종의 id/이모지/색/인연·악연 + 문항 12개의 채점 가중치.
 * 문구(결과 이름·스토리, 질문·보기 텍스트)는 언어별 tools/i18n/<lang>.js 에 있고,
 * questions[i].choices[j] 의 순서가 각 언어 파일의 questions[i].choices[j] 와 1:1로 대응한다.
 * → 모든 언어가 같은 가중치로 채점된다 (tools/check-reach.js 가 검증).
 * 브라우저(<script src="data.js">)와 Node(tools/*.js에서 require) 양쪽에서 쓸 수 있도록 UMD 스타일로 export 한다.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
  } else {
    root.PAST_LIFE_DATA = data;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  // 결과 타입 우선순위(동점 시 앞쪽이 우선). check-reach.js 로 검증된 분포를 유지하려면
  // order와 questions의 weights 키를 함께 바꾸지 않도록 주의.
  var order = [
    'sura', 'celadon', 'hwarang', 'viking', 'pharaoh_cat', 'renaissance', 'jeongi', 'silkroad',
    'monk_scribe', 'pirate_cook', 'amhaeng', 'gladiator', 'teahouse', 'ninja_mailman', 'atlantis', 'balhae'
  ];

  var types = {
    sura: { id: 'sura', emoji: '🍲', best: 'jeongi', worst: 'amhaeng', color: '#C7452B' },
    celadon: { id: 'celadon', emoji: '🏺', best: 'monk_scribe', worst: 'pirate_cook', color: '#3E7C6A' },
    hwarang: { id: 'hwarang', emoji: '⚔️', best: 'viking', worst: 'teahouse', color: '#B23A48' },
    viking: { id: 'viking', emoji: '⛵', best: 'hwarang', worst: 'monk_scribe', color: '#3E668E' },
    pharaoh_cat: { id: 'pharaoh_cat', emoji: '🐈‍⬛', best: 'silkroad', worst: 'ninja_mailman', color: '#D9A441' },
    renaissance: { id: 'renaissance', emoji: '🎨', best: 'atlantis', worst: 'gladiator', color: '#8A5A9E' },
    jeongi: { id: 'jeongi', emoji: '📖', best: 'sura', worst: 'amhaeng', color: '#C4622D' },
    silkroad: { id: 'silkroad', emoji: '🐫', best: 'pharaoh_cat', worst: 'monk_scribe', color: '#C98A3A' },
    monk_scribe: { id: 'monk_scribe', emoji: '✒️', best: 'celadon', worst: 'viking', color: '#6E5B45' },
    pirate_cook: { id: 'pirate_cook', emoji: '🍖', best: 'gladiator', worst: 'celadon', color: '#3D8A88' },
    amhaeng: { id: 'amhaeng', emoji: '🕵️', best: 'ninja_mailman', worst: 'jeongi', color: '#2F4A7A' },
    gladiator: { id: 'gladiator', emoji: '🛡️', best: 'pirate_cook', worst: 'renaissance', color: '#A5462F' },
    teahouse: { id: 'teahouse', emoji: '🍵', best: 'balhae', worst: 'hwarang', color: '#5E8C61' },
    ninja_mailman: { id: 'ninja_mailman', emoji: '🥷', best: 'amhaeng', worst: 'pharaoh_cat', color: '#4A4458' },
    atlantis: { id: 'atlantis', emoji: '🔱', best: 'renaissance', worst: 'silkroad', color: '#1E6E78' },
    balhae: { id: 'balhae', emoji: '🏹', best: 'teahouse', worst: 'gladiator', color: '#3E5E8C' }
  };

  var questions = [
    // Q1
    { choices: [
      { weights: { sura: 3, monk_scribe: 1 } },
      { weights: { atlantis: 3, pirate_cook: 1 } },
      { weights: { hwarang: 3, amhaeng: 1 } },
      { weights: { viking: 3, gladiator: 1 } }
    ] },
    // Q2
    { choices: [
      { weights: { pharaoh_cat: 3, teahouse: 1 } },
      { weights: { monk_scribe: 3, ninja_mailman: 1 } },
      { weights: { jeongi: 3, atlantis: 1 } }
    ] },
    // Q3
    { choices: [
      { weights: { silkroad: 3, balhae: 1 } },
      { weights: { silkroad: 3, sura: 1 } },
      { weights: { pirate_cook: 3, celadon: 1 } }
    ] },
    // Q4
    { choices: [
      { weights: { amhaeng: 3, hwarang: 1 } },
      { weights: { balhae: 3, viking: 1 } },
      { weights: { teahouse: 3, pharaoh_cat: 1 } },
      { weights: { ninja_mailman: 3, renaissance: 1 } }
    ] },
    // Q5
    { choices: [
      { weights: { atlantis: 3, jeongi: 1 } },
      { weights: { balhae: 3, silkroad: 1 } },
      { weights: { sura: 3, monk_scribe: 1 } }
    ] },
    // Q6
    { choices: [
      { weights: { celadon: 3, pirate_cook: 1 } },
      { weights: { gladiator: 3, amhaeng: 1 } }
    ] },
    // Q7
    { choices: [
      { weights: { viking: 3, gladiator: 1 } },
      { weights: { ninja_mailman: 3, teahouse: 1 } },
      { weights: { renaissance: 3, ninja_mailman: 1 } }
    ] },
    // Q8
    { choices: [
      { weights: { hwarang: 3, atlantis: 1 } },
      { weights: { silkroad: 3, balhae: 1 } },
      { weights: { monk_scribe: 3, sura: 1 } },
      { weights: { pirate_cook: 3, celadon: 1 } }
    ] },
    // Q9
    { choices: [
      { weights: { amhaeng: 3, hwarang: 1 } },
      { weights: { gladiator: 3, viking: 1 } },
      { weights: { teahouse: 3, pharaoh_cat: 1 } }
    ] },
    // Q10
    { choices: [
      { weights: { ninja_mailman: 3, renaissance: 1 } },
      { weights: { atlantis: 3, jeongi: 1 } },
      { weights: { balhae: 3, silkroad: 1 } }
    ] },
    // Q11
    { choices: [
      { weights: { teahouse: 3, monk_scribe: 1 } },
      { weights: { celadon: 3, pirate_cook: 1 } },
      { weights: { hwarang: 3, amhaeng: 1 } },
      { weights: { viking: 3, gladiator: 1 } }
    ] },
    // Q12
    { choices: [
      { weights: { pharaoh_cat: 3, teahouse: 1 } },
      { weights: { renaissance: 3, ninja_mailman: 1 } },
      { weights: { jeongi: 3, atlantis: 1 } }
    ] }
  ];

  return { order: order, types: types, questions: questions };
});
