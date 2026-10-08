// hangul-name 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/hangul-name/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'hangul-name',
  emoji: '🔤',
  category: 'create',
  added: '2026-10-09',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://hangul-name.example.com/',
  title: {
    ko: '내 이름 한글로',
    en: 'Your Name in Korean',
    ja: '名前を韓国語に',
    zh: '名字翻译成韩文',
    fr: 'Ton prénom en coréen',
    de: 'Name auf Koreanisch',
    th: 'ชื่อภาษาเกาหลี',
    vi: 'Tên tiếng Hàn của bạn',
    es: 'Tu nombre en coreano',
    it: 'Il tuo nome in coreano',
    pt: 'Seu nome em coreano',
    ru: 'Имя на корейском',
  },
  desc: {
    ko: '영어·외국 이름을 넣으면 한글로 바꿔 주고, 글자마다 읽는 법까지. 예쁜 이름 카드로 저장하고 공유해요. 한글날 기념!',
    en: 'Type your name and see it written in Korean Hangul, block by block with pronunciation. Save it as a pretty name card.',
    ja: '名前を入れるとハングル表記に変換。1文字ずつ読み方つきで、かわいい名前カードに保存・シェアできます。',
    zh: '输入名字，马上变成韩文（谚文）写法，每个字都附读音，还能存成漂亮的名字卡片分享。',
    fr: 'Écris ton prénom et vois-le en hangeul, syllabe par syllabe avec la prononciation. Enregistre-le en jolie carte.',
    de: 'Gib deinen Namen ein und sieh ihn in koreanischer Schrift (Hangul) mit Aussprache. Als schöne Namenskarte speichern.',
    th: 'พิมพ์ชื่อแล้วดูชื่อเป็นอักษรเกาหลี (ฮันกึล) พร้อมคำอ่านทีละพยางค์ บันทึกเป็นการ์ดชื่อสวย ๆ ได้',
    vi: 'Nhập tên và xem tên bạn viết bằng chữ Hàn (Hangul), kèm cách đọc từng âm tiết. Lưu thành thẻ tên thật xinh.',
    es: 'Escribe tu nombre y míralo en coreano (hangul), sílaba por sílaba con pronunciación. Guárdalo como tarjeta bonita.',
    it: 'Scrivi il tuo nome e guardalo in coreano (hangul), sillaba per sillaba con la pronuncia. Salvalo come card carina.',
    pt: 'Digite seu nome e veja-o em coreano (hangul), sílaba por sílaba com a pronúncia. Salve como um cartão bonito.',
    ru: 'Введи имя и посмотри, как оно пишется по-корейски (хангыль), с чтением каждого слога. Сохрани красивую карточку.',
  },
};
