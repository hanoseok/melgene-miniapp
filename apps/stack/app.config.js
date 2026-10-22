// stack 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/stack/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'stack',
  emoji: '🏗️',
  category: 'game',
  added: '2026-10-23',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://stack.example.com/',
  title: {
    ko: '탑 쌓기',
    en: 'Stack Tower',
    ja: 'タワー積みゲーム',
    zh: '叠叠高',
    fr: 'Tour de blocs',
    de: 'Turm stapeln',
    th: 'เกมต่อตึก',
    vi: 'Game xếp tháp',
    es: 'Apilar bloques',
    it: 'Impila blocchi',
    pt: 'Empilhar blocos',
    ru: 'Башня из блоков',
  },
  desc: {
    ko: '좌우로 움직이는 블록을 딱 맞춰 떨어뜨려 탑을 높이 쌓아요. 삐져나온 만큼 잘려 나가고, 퍼펙트가 이어지면 다시 넓어져요.',
    en: 'Tap to drop the sliding block and stack your tower as high as you can. Overhangs get sliced off; perfect drops in a row grow it back.',
    ja: '左右に動くブロックをタップで落として、タワーを高く積み上げよう。はみ出た分は切り落とされ、パーフェクトが続くと少し広がる。',
    zh: '点击放下来回移动的方块，把塔叠得越高越好。多出来的部分会被切掉，连续完美对齐还能让方块变宽。',
    fr: 'Lâche le bloc qui glisse au bon moment et monte ta tour le plus haut possible. Ce qui dépasse est coupé, les parfaits l’élargissent.',
    de: 'Lass den gleitenden Block im richtigen Moment fallen und staple hoch hinaus. Überstand wird abgeschnitten, Perfekt-Serien verbreitern.',
    th: 'แตะเพื่อปล่อยบล็อกที่เลื่อนไปมา ต่อตึกให้สูงที่สุด ส่วนที่เกินจะถูกตัดทิ้ง วางเป๊ะติดกันหลายครั้งบล็อกจะกว้างขึ้น',
    vi: 'Chạm để thả khối đang trượt và xếp tháp cao nhất có thể. Phần thừa bị cắt rơi, đặt khớp hoàn hảo liên tiếp sẽ nới rộng khối.',
    es: 'Suelta el bloque que se desliza en el momento justo y apila tu torre bien alto. Lo que sobra se corta y los perfectos la ensanchan.',
    it: 'Sgancia il blocco che scorre al momento giusto e impila la torre più in alto che puoi. Ciò che sporge cade, i perfetti la allargano.',
    pt: 'Toque para soltar o bloco que desliza e empilhe sua torre o mais alto possível. O que sobra é cortado; perfeitos seguidos alargam o bloco.',
    ru: 'Нажимай, чтобы сбросить скользящий блок, и строй башню как можно выше. Всё лишнее срезается, а серия идеальных ходов расширяет блок.',
  },
};
