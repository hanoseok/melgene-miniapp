// game2048 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/game2048/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'game2048',
  emoji: '🔢',
  category: 'game',
  added: '2026-10-04',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://game2048.example.com/',
  title: {
    ko: '2048 게임',
    en: '2048 Game',
    ja: '2048 ゲーム',
    zh: '2048 小游戏',
    fr: 'Jeu 2048',
    de: '2048 Spiel',
    th: 'เกม 2048',
    vi: 'Game 2048',
    es: 'Juego 2048',
    it: 'Gioco 2048',
    pt: 'Jogo 2048',
    ru: 'Игра 2048',
  },
  desc: {
    ko: '밀어서 같은 숫자끼리 합치고 2048까지! 스와이프·방향키로 하는 할로윈판 숫자 퍼즐.',
    en: 'Slide the tiles, merge matching numbers and reach 2048. The classic number puzzle with a Halloween twist — swipe or use arrow keys.',
    ja: 'スライドして同じ数字を合体、2048を目指そう。スワイプでも矢印キーでも遊べるハロウィン版の数字パズル。',
    zh: '滑动方块，合并相同数字，一路合成2048！支持滑动和方向键的万圣节版数字益智游戏。',
    fr: 'Fais glisser les tuiles, fusionne les nombres identiques et atteins 2048. Le casse-tête culte, version Halloween.',
    de: 'Kacheln schieben, gleiche Zahlen verschmelzen und die 2048 knacken. Das Zahlenrätsel-Kultspiel als Halloween-Edition.',
    th: 'ปัดแผ่นตัวเลข รวมเลขเดียวกัน แล้วไปให้ถึง 2048 เกมตัวเลขสุดคลาสสิกฉบับฮาโลวีน เล่นด้วยการปัดหรือปุ่มลูกศร',
    vi: 'Trượt các ô, ghép những số giống nhau và đạt tới 2048. Trò xếp số kinh điển phiên bản Halloween.',
    es: 'Desliza las fichas, fusiona los números iguales y llega al 2048. El puzle clásico con un toque de Halloween.',
    it: 'Fai scorrere le tessere, unisci i numeri uguali e arriva a 2048. Il rompicapo classico in versione Halloween.',
    pt: 'Deslize as peças, junte os números iguais e chegue ao 2048. O quebra-cabeça clássico com clima de Halloween.',
    ru: 'Сдвигай плитки, соединяй одинаковые числа и дойди до 2048. Классическая головоломка в хэллоуинском стиле.',
  },
};
