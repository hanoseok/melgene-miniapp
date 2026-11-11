// penalty 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/penalty/ 로 바꾼다).
module.exports = {
  id: 'penalty',
  emoji: '🃏',
  category: 'vote',
  added: '2026-11-11',
  order: 2,
  path: 'https://penalty.example.com/',
  title: {
    ko: '벌칙 카드 뒤집기',
    en: 'Penalty Card Flip',
    ja: '罰ゲーム くじ',
    zh: '惩罚翻牌',
    fr: 'Tirage de gages',
    de: 'Strafkarten-Ziehen',
    th: 'สุ่มบทลงโทษ',
    vi: 'Bốc hình phạt',
    es: 'Castigo con cartas',
    it: 'Penitenze con le carte',
    pt: 'Sorteio de penitência',
    ru: 'Карты наказаний',
  },
  desc: {
    ko: '카드를 한 장씩 뒤집어 벌칙을 정하는 송년회·술자리용 벌칙 뽑기. 누가 무엇을 할지 바로 정한다.',
    en: 'Flip the cards one by one to draw a penalty at a party or drinks night. Quick, fair and fun.',
    ja: 'カードを1枚ずつめくって罰ゲームを決める、飲み会やパーティー向けのくじ。',
    zh: '一张张翻牌抽取惩罚，适合聚会和饮酒场合，快速又公平。',
    fr: 'Retourne les cartes une par une pour tirer un gage pendant une soirée. Rapide et drôle.',
    de: 'Drehe die Karten nacheinander um und zieh eine Strafe, ideal für Partys und Trinkabende.',
    th: 'พลิกการ์ดทีละใบเพื่อสุ่มบทลงโทษในงานปาร์ตี้หรือวงดื่ม เร็วและสนุก',
    vi: 'Lật từng lá bài để bốc hình phạt trong bữa tiệc hay buổi nhậu. Nhanh và vui.',
    es: 'Voltea las cartas una a una para sacar un castigo en fiestas o noches de copas.',
    it: 'Gira le carte una alla volta per estrarre una penitenza a feste e serate.',
    pt: 'Vire as cartas uma por uma para sortear uma penitência em festas e noites de bebida.',
    ru: 'Переворачивай карты по одной и вытаскивай наказание для вечеринки или застолья.',
  },
};
