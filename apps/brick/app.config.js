// brick 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/brick/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'brick',
  emoji: '🧱',
  category: 'game',
  added: '2026-10-08',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://brick.example.com/',
  title: {
    ko: '벽돌깨기',
    en: 'Brick Breaker',
    ja: 'ブロック崩し',
    zh: '打砖块',
    fr: 'Casse-briques',
    de: 'Breakout-Spiel',
    th: 'เกมตีบล็อก',
    vi: 'Game phá gạch',
    es: 'Rompe ladrillos',
    it: 'Spaccamattoni',
    pt: 'Quebra-tijolos',
    ru: 'Арканоид',
  },
  desc: {
    ko: '패들로 공을 튕겨 알록달록 벽돌을 와르르! 목숨 3개로 몇 단계까지 깰 수 있을까요?',
    en: 'Bounce the ball off your paddle and smash the neon bricks. Three lives, faster stages — how far can you go?',
    ja: 'パドルでボールを打ち返して、カラフルなブロックを崩そう。ライフは3つ、どこまで進める？',
    zh: '用挡板把球弹回去，砸碎一排排霓虹砖块。三条命，关卡越来越快，你能闯几关？',
    fr: 'Renvoie la balle avec ta raquette et casse les briques néon. Trois vies, des niveaux de plus en plus rapides.',
    de: 'Lenk den Ball mit dem Schläger zurück und zerleg die Neon-Steine. Drei Leben, jedes Level etwas schneller.',
    th: 'ใช้ไม้ตีลูกบอลเด้งกลับไปทุบบล็อกสีนีออน มี 3 ชีวิต ด่านยิ่งเร็วขึ้น ไปได้ถึงด่านไหน?',
    vi: 'Đỡ bóng bằng thanh trượt để phá những hàng gạch neon. 3 mạng, màn sau nhanh hơn — bạn đi được bao xa?',
    es: 'Rebota la pelota con tu paleta y rompe los ladrillos neón. Tres vidas y niveles cada vez más rápidos.',
    it: 'Rimanda la palla con la racchetta e distruggi i mattoni al neon. Tre vite, livelli sempre più veloci.',
    pt: 'Rebata a bola com a raquete e quebre os tijolos neon. Três vidas e fases cada vez mais rápidas.',
    ru: 'Отбивай мяч платформой и разбивай неоновые блоки. Три жизни, уровни всё быстрее — как далеко пройдёшь?',
  },
};
