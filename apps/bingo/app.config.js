// bingo 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bingo/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'bingo',
  emoji: '🎯',
  category: 'create',
  added: '2026-10-30',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bingo.example.com/',
  title: {
    ko: '새해 목표 빙고',
    en: 'Goal Bingo Card Maker',
    ja: '目標ビンゴ',
    zh: '新年目标宾果',
    fr: 'Bingo des résolutions',
    de: 'Vorsätze-Bingo',
    th: 'บิงโกเป้าหมายปีใหม่',
    vi: 'Bingo mục tiêu năm mới',
    es: 'Bingo de propósitos',
    it: 'Bingo dei buoni propositi',
    pt: 'Bingo de metas',
    ru: 'Бинго целей',
  },
  desc: {
    ko: '3×3·4×4·5×5 빙고판에 새해 목표를 적고 색을 골라 예쁜 카드 이미지로 저장해요. 이룬 목표는 도장을 찍고 빙고 줄을 세어 보세요.',
    en: 'Write your goals on a 3×3, 4×4 or 5×5 bingo card, pick a colour and save it as an image. Stamp each goal you reach and count your bingo lines.',
    ja: '3×3・4×4・5×5のビンゴに新年の目標を書いて、色を選んで画像で保存。達成した目標にスタンプを押してビンゴの数を数えよう。',
    zh: '在3×3、4×4或5×5宾果格里写下新年目标，选好配色保存成图片。完成一个就盖个章，看看连成几条宾果。',
    fr: 'Écris tes résolutions sur une grille de bingo 3×3, 4×4 ou 5×5, choisis une couleur et enregistre-la en image. Tamponne chaque objectif atteint.',
    de: 'Schreib deine Vorsätze auf ein 3×3-, 4×4- oder 5×5-Bingo, wähl eine Farbe und speichere es als Bild. Stemple jedes erreichte Ziel ab.',
    th: 'เขียนเป้าหมายปีใหม่ลงตารางบิงโก 3×3, 4×4 หรือ 5×5 เลือกสี แล้วเซฟเป็นรูป ทำสำเร็จข้อไหนก็กดประทับตรา แล้วนับเส้นบิงโก',
    vi: 'Viết mục tiêu năm mới lên bảng bingo 3×3, 4×4 hoặc 5×5, chọn màu rồi lưu thành ảnh. Đạt mục tiêu nào thì đóng dấu và đếm số hàng bingo.',
    es: 'Escribe tus propósitos en un bingo de 3×3, 4×4 o 5×5, elige colores y guárdalo como imagen. Sella cada meta cumplida y cuenta tus líneas.',
    it: 'Scrivi i tuoi buoni propositi su un bingo 3×3, 4×4 o 5×5, scegli i colori e salvalo come immagine. Timbra ogni obiettivo raggiunto.',
    pt: 'Escreva suas metas num bingo 3×3, 4×4 ou 5×5, escolha as cores e salve como imagem. Carimbe cada meta cumprida e conte suas linhas.',
    ru: 'Впиши свои цели в бинго 3×3, 4×4 или 5×5, выбери цвет и сохрани картинкой. Отмечай штампом каждую достигнутую цель и считай линии.',
  },
};
