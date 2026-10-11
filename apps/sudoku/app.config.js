// sudoku 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/sudoku/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'sudoku',
  emoji: '🔢',
  category: 'game',
  added: '2026-10-12',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://sudoku.example.com/',
  title: {
    ko: '스도쿠',
    en: 'Sudoku',
    ja: '数独',
    zh: '数独',
    fr: 'Sudoku',
    de: 'Sudoku',
    th: 'ซูโดกุ',
    vi: 'Sudoku',
    es: 'Sudoku',
    it: 'Sudoku',
    pt: 'Sudoku',
    ru: 'Судоку',
  },
  desc: {
    ko: '가로·세로·3×3 칸에 1~9를 한 번씩! 쉬움부터 전문가까지 4단계, 메모·힌트·오늘의 퍼즐까지.',
    en: 'Fill every row, column and box with 1 to 9. Four levels from Easy to Expert, pencil notes, hints and a daily puzzle.',
    ja: '縦・横・3×3のブロックに1〜9を1つずつ。かんたん〜エキスパートの4段階、メモ・ヒント・今日の問題つき。',
    zh: '让每行、每列、每个九宫格都填满1到9。简单到专家四种难度，支持笔记、提示和每日一题。',
    fr: 'Remplissez lignes, colonnes et carrés de 1 à 9. Quatre niveaux, notes au crayon, indices et grille du jour.',
    de: 'Jede Zeile, Spalte und jedes Kästchen mit 1 bis 9 füllen. Vier Stufen, Notizen, Tipps und ein Tagesrätsel.',
    th: 'เติมเลข 1–9 ให้ครบทุกแถว ทุกคอลัมน์ และทุกช่อง 3×3 มี 4 ระดับ จดโน้ต ใบ้ และปริศนาประจำวัน',
    vi: 'Điền 1 đến 9 vào mỗi hàng, cột và ô 3×3. Bốn cấp độ, ghi chú bút chì, gợi ý và câu đố mỗi ngày.',
    es: 'Llena cada fila, columna y caja con del 1 al 9. Cuatro niveles, notas a lápiz, pistas y un sudoku diario.',
    it: 'Riempi righe, colonne e riquadri con i numeri da 1 a 9. Quattro livelli, note a matita, aiuti e sudoku del giorno.',
    pt: 'Preencha linhas, colunas e quadrados com 1 a 9. Quatro níveis, anotações a lápis, dicas e o sudoku do dia.',
    ru: 'Заполни строки, столбцы и квадраты цифрами от 1 до 9. Четыре уровня, заметки, подсказки и судоку дня.',
  },
};
