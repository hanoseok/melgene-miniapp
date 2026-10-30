// hue 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/hue/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'hue',
  emoji: '🎨',
  category: 'game',
  added: '2026-10-31',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://hue.example.com/',
  title: {
    ko: '다른 색 찾기',
    en: 'Find the Different Color',
    ja: '色彩感覚テスト',
    zh: '找不同颜色',
    fr: 'Trouve la couleur intruse',
    de: 'Finde die andere Farbe',
    th: 'เกมหาสีที่ต่าง',
    vi: 'Tìm màu khác biệt',
    es: 'Encuentra el color diferente',
    it: 'Trova il colore diverso',
    pt: 'Encontre a cor diferente',
    ru: 'Найди другой цвет',
  },
  desc: {
    ko: '똑같아 보이는 색 타일 중 딱 하나만 살짝 달라요. 60초 안에 몇 단계까지 찾을 수 있을까요? 절대색감 테스트 게임.',
    en: 'All tiles look the same, but one is a slightly different shade. How many levels can you clear in 60 seconds?',
    ja: '同じに見えるタイルの中に、ほんの少しだけ色が違う1枚。60秒で何レベルまで見つけられる？',
    zh: '一模一样的色块里，只有一块颜色稍有不同。60 秒内你能找到第几关？',
    fr: 'Toutes les cases semblent identiques, mais une a une teinte légèrement différente. Combien de niveaux en 60 secondes ?',
    de: 'Alle Kacheln sehen gleich aus – nur eine hat einen etwas anderen Farbton. Wie viele Level schaffst du in 60 Sekunden?',
    th: 'ช่องสีดูเหมือนกันหมด แต่มีช่องเดียวที่สีต่างไปนิดเดียว 60 วินาทีจะหาได้กี่ด่าน',
    vi: 'Các ô trông y hệt nhau, nhưng có một ô khác màu một chút. Trong 60 giây bạn qua được bao nhiêu màn?',
    es: 'Todas las casillas parecen iguales, pero una tiene un tono un poco distinto. ¿Cuántos niveles superas en 60 segundos?',
    it: 'Le caselle sembrano tutte uguali, ma una ha una tonalità leggermente diversa. Quanti livelli superi in 60 secondi?',
    pt: 'Todos os quadrados parecem iguais, mas um tem um tom um pouco diferente. Quantas fases você passa em 60 segundos?',
    ru: 'Все плитки кажутся одинаковыми, но одна чуть другого оттенка. Сколько уровней ты пройдёшь за 60 секунд?',
  },
};
