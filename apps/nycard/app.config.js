// nycard 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/nycard/ 로 바꾼다).
module.exports = {
  id: 'nycard',
  emoji: '🐐',
  category: 'create',
  added: '2026-11-07',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://nycard.example.com/',
  title: {
    ko: '2027 연하장',
    en: 'New Year Card Maker 2027',
    ja: '年賀状 作成 2027',
    zh: '2027 新年贺卡制作',
    fr: 'Carte de vœux 2027',
    de: 'Neujahrskarte 2027',
    th: 'การ์ดปีใหม่ 2027',
    vi: 'Thiệp năm mới 2027',
    es: 'Tarjeta de Año Nuevo 2027',
    it: 'Biglietti di Buon Anno 2027',
    pt: 'Cartão de Ano Novo 2027',
    ru: 'Открытка 2027',
  },
  desc: {
    ko: '디자인과 새해 인사말을 고르고 이름과 덕담을 적어 2027 양띠 해 연하장을 만들어 보세요. 이미지로 저장하거나, 링크로 보내면 봉투가 열리며 카드가 나와요.',
    en: 'Pick a design and greeting, add names and a short wish, and make a 2027 New Year card. Save it as an image or send a link that opens like an envelope.',
    ja: 'デザインとあいさつを選び、宛名とひと言を入れて2027年（ひつじ年）の年賀状を作ろう。画像で保存、リンクで送ると封筒が開いて届きます。',
    zh: '选样式和祝福语，写上名字和一句祝福，做一张 2027 羊年新年贺卡。可存成图片，或发链接，对方打开时信封会慢慢展开。',
    fr: 'Choisissez un style et une formule, ajoutez les prénoms et quelques vœux pour créer votre carte de bonne année 2027. Image à enregistrer ou lien qui s’ouvre comme une enveloppe.',
    de: 'Motiv und Neujahrsgruß wählen, Namen und gute Wünsche eintragen – fertig ist die Neujahrskarte 2027. Als Bild speichern oder als Link schicken, der sich wie ein Umschlag öffnet.',
    th: 'เลือกแบบและคำอวยพร ใส่ชื่อและข้อความ แล้วทำการ์ดสวัสดีปีใหม่ 2027 บันทึกเป็นรูป หรือส่งลิงก์ที่เปิดออกมาเหมือนซองจดหมาย',
    vi: 'Chọn mẫu và lời chúc, ghi tên và vài lời nhắn để làm thiệp chúc mừng năm mới 2027. Lưu thành ảnh hoặc gửi link mở ra như phong thư.',
    es: 'Elige un diseño y un saludo, escribe los nombres y un buen deseo y crea tu tarjeta de Año Nuevo 2027. Guárdala como imagen o envía un enlace que se abre como un sobre.',
    it: 'Scegli uno stile e un augurio, aggiungi i nomi e due righe e crea il tuo biglietto di Buon Anno 2027. Salvalo come immagine o invia un link che si apre come una busta.',
    pt: 'Escolha um modelo e uma saudação, escreva os nomes e uma mensagem e crie seu cartão de Ano Novo 2027. Salve como imagem ou mande um link que abre como um envelope.',
    ru: 'Выбери оформление и поздравление, впиши имена и пожелание — и открытка с Новым годом 2027 готова. Сохрани картинку или отправь ссылку, которая открывается как конверт.',
  },
};
