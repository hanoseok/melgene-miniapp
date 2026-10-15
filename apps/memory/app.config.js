// memory 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/memory/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'memory',
  emoji: '🃏',
  category: 'game',
  added: '2026-10-16',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://memory.example.com/',
  title: {
    ko: '카드 짝 맞추기',
    en: 'Memory Match Game',
    ja: '神経衰弱',
    zh: '记忆翻牌',
    fr: 'Jeu de mémoire',
    de: 'Memory Spiel',
    th: 'เกมจับคู่',
    vi: 'Trò chơi lật hình',
    es: 'Juego de memoria',
    it: 'Gioco di memoria',
    pt: 'Jogo da memória',
    ru: 'Найди пару',
  },
  desc: {
    ko: '할로윈 카드를 뒤집어 같은 그림 짝을 찾으세요. 쉬움·보통·어려움 3단계, 시간·횟수 기록과 실제 백분위.',
    en: 'Flip the Halloween cards and find every matching pair. Three levels, a timer, move count and your real rank.',
    ja: 'ハロウィンのカードをめくって同じ絵のペアを探そう。3つの難易度、タイムと手数を記録。',
    zh: '翻开万圣节卡牌，找出所有相同的图案。三种难度，记录用时和步数，看看你的真实排名。',
    fr: 'Retournez les cartes d’Halloween et trouvez toutes les paires. Trois niveaux, chrono, nombre de coups et vrai classement.',
    de: 'Dreh die Halloween-Karten um und finde alle Paare. Drei Stufen, Stoppuhr, Zugzähler und dein echter Rang.',
    th: 'เปิดการ์ดฮาโลวีนแล้วจับคู่ภาพที่เหมือนกันให้ครบ มี 3 ระดับ จับเวลาและนับจำนวนครั้ง',
    vi: 'Lật các lá bài Halloween và tìm hết các cặp giống nhau. Ba cấp độ, bấm giờ, đếm lượt và thứ hạng thật.',
    es: 'Voltea las cartas de Halloween y encuentra todas las parejas. Tres niveles, cronómetro, jugadas y tu posición real.',
    it: 'Gira le carte di Halloween e trova tutte le coppie. Tre livelli, cronometro, mosse e la tua posizione reale.',
    pt: 'Vire as cartas de Halloween e encontre todos os pares. Três níveis, cronômetro, jogadas e sua posição real.',
    ru: 'Переворачивай карточки на Хэллоуин и находи пары. Три уровня, таймер, счёт ходов и настоящий рейтинг.',
  },
};
