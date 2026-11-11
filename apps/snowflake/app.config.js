// snowflake 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/snowflake/ 로 바꾼다).
module.exports = {
  id: 'snowflake',
  emoji: '❄️',
  category: 'create',
  added: '2026-11-11',
  order: 1,
  path: 'https://snowflake.example.com/',
  title: {
    ko: '눈꽃 만들기',
    en: 'Snowflake Maker',
    ja: '雪の結晶メーカー',
    zh: '雪花制作器',
    fr: 'Créateur de flocons',
    de: 'Schneeflocken-Maker',
    th: 'สร้างเกล็ดหิมะ',
    vi: 'Tạo bông tuyết',
    es: 'Crear copos de nieve',
    it: 'Crea fiocchi di neve',
    pt: 'Criar flocos de neve',
    ru: 'Создать снежинку',
  },
  desc: {
    ko: '몇 번 누르는 것만으로 나만의 대칭 눈 결정을 만들고 PNG 이미지로 저장하는 눈꽃 만들기 도구.',
    en: 'Create your own symmetrical snowflake in a few taps and save it as a PNG image.',
    ja: 'タップ数回で左右対称の雪の結晶を作り、PNG画像として保存できます。',
    zh: '几次点击就能做出对称的雪花图案，并保存为 PNG 图片。',
    fr: 'Crée ton flocon symétrique en quelques touches et enregistre-le en image PNG.',
    de: 'Erstelle mit wenigen Klicks deine eigene symmetrische Schneeflocke und speichere sie als PNG.',
    th: 'สร้างเกล็ดหิมะสมมาตรของคุณเองด้วยการแตะไม่กี่ครั้ง แล้วบันทึกเป็นไฟล์ PNG',
    vi: 'Tạo bông tuyết đối xứng của riêng bạn chỉ với vài lần chạm và lưu thành ảnh PNG.',
    es: 'Crea tu propio copo de nieve simétrico con unos toques y guárdalo como imagen PNG.',
    it: 'Crea il tuo fiocco di neve simmetrico con pochi tocchi e salvalo come immagine PNG.',
    pt: 'Crie seu próprio floco de neve simétrico com alguns toques e salve como imagem PNG.',
    ru: 'Создай свою симметричную снежинку за несколько касаний и сохрани её как PNG.',
  },
};
