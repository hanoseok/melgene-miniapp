// sweeper 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/sweeper/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'sweeper',
  emoji: '💣',
  category: 'game',
  added: '2026-10-10',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://sweeper.example.com/',
  title: {
    ko: '지뢰찾기',
    en: 'Minesweeper',
    ja: 'マインスイーパー',
    zh: '扫雷',
    fr: 'Démineur',
    de: 'Minesweeper',
    th: 'เกมกู้ระเบิด',
    vi: 'Dò mìn',
    es: 'Buscaminas',
    it: 'Campo minato',
    pt: 'Campo minado',
    ru: 'Сапёр',
  },
  desc: {
    ko: '숫자를 단서로 지뢰를 피해 판을 싹 열어 보세요! 초급·중급·고급, 첫 터치는 언제나 안전해요.',
    en: 'Use the numbers to dodge every mine and clear the board. Three levels, a safe first tap and a clock to beat.',
    ja: '数字を手がかりに地雷をよけて、盤面を全部開けよう。3レベル、最初の1手は必ず安全。',
    zh: '根据数字推理，避开地雷清空雷区。三种难度，第一下必定安全，还能挑战最快用时。',
    fr: 'Appuyez-vous sur les chiffres pour éviter les mines et vider la grille. Trois niveaux, premier clic sûr, chrono à battre.',
    de: 'Zahlen lesen, Minen meiden, Feld räumen. Drei Stufen, ein sicherer erster Tipp und eine Bestzeit zum Knacken.',
    th: 'ใช้ตัวเลขช่วยคิด หลบทุ่นระเบิดแล้วเปิดช่องให้หมดกระดาน มี 3 ระดับ แตะแรกปลอดภัย พร้อมเวลาให้ท้าทาย',
    vi: 'Dựa vào các con số để né mìn và dọn sạch bảng. Ba cấp độ, lần chạm đầu an toàn và đồng hồ để thử thách.',
    es: 'Usa los números para esquivar las minas y despejar el tablero. Tres niveles, primer toque seguro y un tiempo que batir.',
    it: 'Usa i numeri per evitare le mine e liberare la griglia. Tre livelli, primo tocco sicuro e un tempo da battere.',
    pt: 'Use os números para fugir das minas e limpar o tabuleiro. Três níveis, primeiro toque seguro e um tempo para bater.',
    ru: 'Читай цифры, обходи мины и очисти поле. Три уровня, безопасный первый ход и время, которое нужно побить.',
  },
};
