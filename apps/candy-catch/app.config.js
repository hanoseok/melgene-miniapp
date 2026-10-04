// candy-catch 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/candy-catch/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'candy-catch',
  emoji: '🍬',
  category: 'game',
  added: '2026-09-30',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://candy-catch.example.com/',
  title: {
    ko: '할로윈 사탕 받기 게임',
    en: 'Halloween Candy Catch',
    ja: 'ハロウィン お菓子キャッチ',
    zh: '万圣节接糖果',
    fr: 'Attrape-bonbons',
    de: 'Halloween-Süßigkeiten fangen',
    th: 'เกมรับขนมฮาโลวีน',
    vi: 'Hứng kẹo Halloween',
    es: 'Atrapa dulces de Halloween',
    it: 'Acchiappa caramelle',
    pt: 'Pegar doces de Halloween',
    ru: 'Лови конфеты на Хэллоуин',
  },
  desc: {
    ko: '하늘에서 쏟아지는 사탕을 호박 바구니로 받아요. 거미와 유령은 피하고 콤보로 점수를 올리는 50초 아케이드 게임.',
    en: 'Candy is raining down: slide your pumpkin bucket to catch it, dodge spiders and ghosts, and build combos in 50 seconds.',
    ja: '空から降ってくるお菓子をかぼちゃバケツでキャッチ。クモとおばけをよけて、コンボでスコアを伸ばす50秒ゲーム。',
    zh: '糖果从天而降，左右移动南瓜桶接住它们，躲开蜘蛛和幽灵，用连击刷高分。一局50秒。',
    fr: 'Les bonbons tombent du ciel : glisse ton seau citrouille pour les attraper, évite araignées et fantômes et enchaîne les combos en 50 s.',
    de: 'Süßigkeiten regnen vom Himmel: Schieb deinen Kürbiseimer hin und her, weich Spinnen und Geistern aus und sammle Combos – 50 Sekunden.',
    th: 'ขนมร่วงลงมาจากฟ้า เลื่อนถังฟักทองไปรับ หลบแมงมุมกับผี แล้วทำคอมโบเก็บแต้มใน 50 วินาที',
    vi: 'Kẹo rơi từ trên trời: kéo xô bí ngô để hứng, né nhện và ma, nối combo để ghi điểm trong 50 giây.',
    es: 'Llueven dulces del cielo: mueve tu cubeta de calabaza para atraparlos, esquiva arañas y fantasmas y haz combos en 50 segundos.',
    it: 'Piovono caramelle dal cielo: sposta il secchiello a zucca per prenderle, schiva ragni e fantasmi e fai combo in 50 secondi.',
    pt: 'Chovem doces do céu: mova seu balde de abóbora para pegar, desvie de aranhas e fantasmas e faça combos em 50 segundos.',
    ru: 'С неба сыплются конфеты: двигай ведёрко-тыкву, лови сладости, уворачивайся от пауков и призраков и собирай комбо за 50 секунд.',
  },
};
