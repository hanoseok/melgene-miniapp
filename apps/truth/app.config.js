// truth 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/truth/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'truth',
  emoji: '🎲',
  category: 'vote',
  added: '2026-11-05',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://truth.example.com/',
  title: {
    ko: '진실 게임',
    en: 'Truth or Dare',
    ja: '真実か挑戦か',
    zh: '真心话大冒险',
    fr: 'Action ou vérité',
    de: 'Wahrheit oder Pflicht',
    th: 'จริงหรือกล้า',
    vi: 'Thật hay thách',
    es: 'Verdad o reto',
    it: 'Obbligo o verità',
    pt: 'Verdade ou desafio',
    ru: 'Правда или действие',
  },
  desc: {
    ko: '송년회·모임용 진실 혹은 도전. 이름을 넣고 팩을 고르면 공평한 순서로 깔끔한 질문과 도전 카드를 한 장씩 뒤집어요.',
    en: 'Clean truth or dare for parties and year-end get-togethers. Add names, pick a pack and flip one card at a time with fair turns.',
    ja: '忘年会やパーティーで遊べる真実か挑戦か。名前を入れてパックを選ぶと、公平な順番でカードが1枚ずつめくれます。',
    zh: '适合聚会和年会的真心话大冒险。输入名字、选择卡包，按公平顺序一张张翻开干净有趣的卡片。',
    fr: 'Action ou vérité sans dérapage pour les soirées et pots de fin d’année : des prénoms, un paquet, une carte à la fois.',
    de: 'Wahrheit oder Pflicht für Partys und Weihnachtsfeiern: Namen eintragen, Paket wählen und faire Reihenfolge, eine Karte nach der anderen.',
    th: 'เกมจริงหรือกล้าแบบสุภาพสำหรับปาร์ตี้และงานเลี้ยงปีใหม่ ใส่ชื่อ เลือกชุดการ์ด แล้วเปิดทีละใบตามลำดับที่ยุติธรรม',
    vi: 'Thật hay thách lành mạnh cho tiệc tùng và tất niên. Nhập tên, chọn bộ thẻ và lật từng thẻ theo lượt công bằng.',
    es: 'Verdad o reto sin sustos para fiestas y cenas de empresa: añade nombres, elige un paquete y gira una carta cada vez.',
    it: 'Obbligo o verità pulito per feste e cene di fine anno: inserisci i nomi, scegli un mazzo e gira una carta alla volta.',
    pt: 'Verdade ou desafio tranquilo para festas e confraternizações: coloque os nomes, escolha um pacote e vire uma carta por vez.',
    ru: 'Правда или действие без пошлостей для вечеринок и корпоративов: впиши имена, выбери набор и открывай по одной карточке.',
  },
};
