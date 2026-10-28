// block 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/block/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'block',
  emoji: '🧩',
  category: 'game',
  added: '2026-10-29',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://block.example.com/',
  title: {
    ko: '블록 퍼즐',
    en: 'Block Puzzle',
    ja: 'ブロックパズル',
    zh: '方块消除',
    fr: 'Puzzle de blocs',
    de: 'Block-Puzzle',
    th: 'เกมเรียงบล็อก',
    vi: 'Xếp khối',
    es: 'Puzzle de bloques',
    it: 'Puzzle a blocchi',
    pt: 'Jogo de blocos',
    ru: 'Блок-пазл',
  },
  desc: {
    ko: '조각 세 개를 8×8 판에 끌어다 놓아요. 가로줄이나 세로줄을 꽉 채우면 사라지고, 연달아 지우면 콤보 점수가 붙어요.',
    en: 'Drag three pieces at a time onto an 8×8 board. Fill a row or column to clear it, and clear lines back to back for combo points.',
    ja: '3つのブロックを8×8の盤面にドラッグ。横か縦の列をそろえると消えて、続けて消すとコンボでスコアアップ。',
    zh: '每次把三个方块拖到 8×8 棋盘上。填满一行或一列就会消除，连续消除还有连击加分。',
    fr: 'Glisse trois pièces sur une grille 8×8. Remplis une ligne ou une colonne pour l’effacer et enchaîne les combos.',
    de: 'Zieh jeweils drei Teile auf ein 8×8-Feld. Volle Reihen und Spalten verschwinden – räum mehrmals hintereinander ab für Combos.',
    th: 'ลากบล็อกทีละสามชิ้นลงกระดาน 8×8 เติมแถวหรือคอลัมน์ให้เต็มเพื่อเคลียร์ เคลียร์ติดกันได้คอมโบ',
    vi: 'Kéo ba khối vào bàn 8×8. Lấp đầy một hàng hoặc một cột để xóa, xóa liên tiếp để ăn combo.',
    es: 'Arrastra tres piezas a un tablero de 8×8. Completa filas o columnas para borrarlas y encadena combos.',
    it: 'Trascina tre pezzi alla volta su una griglia 8×8. Riempi righe o colonne per eliminarle e concatena le combo.',
    pt: 'Arraste três peças por vez para um tabuleiro 8×8. Complete linhas ou colunas para limpar e emende combos.',
    ru: 'Перетаскивай по три фигуры на поле 8×8. Заполни ряд или столбец, чтобы он исчез, и собирай комбо.',
  },
};
