// coinflip 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/coinflip/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'coinflip',
  emoji: '🪙',
  category: 'vote',
  added: '2026-10-05',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://coinflip.example.com/',
  title: {
    ko: '동전 던지기',
    en: 'Coin Flip',
    ja: 'コイントス',
    zh: '抛硬币',
    fr: 'Pile ou face',
    de: 'Münzwurf',
    th: 'โยนเหรียญ',
    vi: 'Tung đồng xu',
    es: 'Cara o cruz',
    it: 'Testa o croce',
    pt: 'Cara ou coroa',
    ru: 'Орёл и решка',
  },
  desc: {
    ko: '앞면이냐 뒷면이냐, 동전을 던져 바로 정해요. 두 선택지 이름을 바꿀 수 있고 주사위도 1~3개 굴릴 수 있어요.',
    en: 'Heads or tails? Flip a coin to decide, name the two sides yourself, or roll one to three dice instead.',
    ja: 'コイントスで表か裏かをすぐ決められます。2つの選択肢の名前も変えられて、サイコロも1〜3個振れます。',
    zh: '正面还是反面，抛一枚硬币马上决定。两面的名字可以自己改，也可以掷1到3个骰子。',
    fr: 'Pile ou face ? Lance la pièce pour trancher, nomme les deux côtés, ou lance de un à trois dés.',
    de: 'Kopf oder Zahl? Münze werfen und entscheiden, beide Seiten selbst benennen oder ein bis drei Würfel rollen.',
    th: 'หัวหรือก้อย โยนเหรียญตัดสินได้ทันที ตั้งชื่อสองด้านเองได้ และทอยลูกเต๋าได้ 1-3 ลูก',
    vi: 'Sấp hay ngửa? Tung đồng xu để quyết định, tự đặt tên hai mặt hoặc gieo từ một đến ba xúc xắc.',
    es: '¿Cara o cruz? Lanza la moneda para decidir, ponle nombre a los dos lados o tira de uno a tres dados.',
    it: 'Testa o croce? Lancia la moneta per decidere, dai un nome ai due lati o tira da uno a tre dadi.',
    pt: 'Cara ou coroa? Jogue a moeda para decidir, dê nome aos dois lados ou role de um a três dados.',
    ru: 'Орёл или решка? Подбрось монетку и реши, назови обе стороны сам или брось от одного до трёх кубиков.',
  },
};
