// snake 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/snake/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'snake',
  emoji: '🐍',
  category: 'game',
  added: '2026-10-21',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://snake.example.com/',
  title: {
    ko: '뱀 게임',
    en: 'Snake Game',
    ja: 'スネークゲーム',
    zh: '贪吃蛇',
    fr: 'Jeu du serpent',
    de: 'Snake Spiel',
    th: 'เกมงู',
    vi: 'Game rắn săn mồi',
    es: 'Juego de la serpiente',
    it: 'Gioco del serpente',
    pt: 'Jogo da cobrinha',
    ru: 'Змейка',
  },
  desc: {
    ko: '스와이프나 방향키로 뱀을 움직여 사과를 먹고 길어져요. 벽과 내 꼬리를 조심! 먹을수록 빨라지는 추억의 지렁이 게임.',
    en: 'The classic snake game: swipe or use arrow keys, eat apples and grow without hitting a wall or your own tail. It speeds up as you score.',
    ja: 'スワイプか矢印キーでヘビを操作して、リンゴを食べて長く育てよう。壁としっぽに注意。食べるほど速くなる定番のスネークゲーム。',
    zh: '滑动屏幕或用方向键控制小蛇，吃苹果变长，小心别撞墙或咬到自己的尾巴。越吃越快的经典贪吃蛇。',
    fr: 'Le Snake classique : glisse ou utilise les flèches, mange des pommes et grandis sans toucher un mur ni ta queue. Ça accélère à chaque pomme.',
    de: 'Der Klassiker: Wische oder nutze die Pfeiltasten, friss Äpfel und wachse, ohne Wand oder Schwanz zu treffen. Mit jedem Apfel schneller.',
    th: 'เกมงูสุดคลาสสิก ปัดหรือกดปุ่มลูกศรไปกินแอปเปิล ตัวยาวขึ้นแต่ห้ามชนกำแพงหรือหางตัวเอง ยิ่งกินยิ่งเร็ว',
    vi: 'Game rắn săn mồi kinh điển: vuốt hoặc dùng phím mũi tên, ăn táo để dài ra mà không đâm vào tường hay đuôi mình. Càng ăn càng nhanh.',
    es: 'El Snake de siempre: desliza o usa las flechas, come manzanas y crece sin chocar con la pared ni con tu cola. Cada manzana lo acelera.',
    it: 'Il classico Snake: scorri o usa le frecce, mangia le mele e cresci senza sbattere contro il muro o la tua coda. Più mangi, più va veloce.',
    pt: 'O clássico jogo da cobrinha: deslize ou use as setas, coma maçãs e cresça sem bater na parede nem no rabo. Fica mais rápido a cada maçã.',
    ru: 'Классическая «Змейка»: проводи пальцем или жми стрелки, ешь яблоки и расти, не врезаясь в стену и в хвост. С каждым яблоком быстрее.',
  },
};
