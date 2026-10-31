// xmascard 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/xmascard/ 로 바꾼다).
module.exports = {
  id: 'xmascard',
  emoji: '🎄',
  category: 'create',
  added: '2026-11-01',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://xmascard.example.com/',
  title: {
    ko: '크리스마스 카드',
    en: 'Christmas Card Maker',
    ja: 'クリスマスカード作成',
    zh: '圣诞贺卡制作',
    fr: 'Carte de Noël',
    de: 'Weihnachtskarte',
    th: 'การ์ดคริสต์มาส',
    vi: 'Thiệp Giáng sinh',
    es: 'Tarjeta de Navidad',
    it: 'Biglietto di Natale',
    pt: 'Cartão de Natal',
    ru: 'Новогодняя открытка',
  },
  desc: {
    ko: '테마와 인사말을 고르고 받는 사람·보내는 사람·메시지를 적어 크리스마스 카드를 만들어 보세요. 이미지 저장, 링크로 보내면 봉투가 열리며 카드가 나와요.',
    en: 'Pick a theme and a greeting, add names and a warm message, and make a Christmas card. Save it as an image or send a link that opens like an envelope.',
    ja: 'テーマとあいさつを選び、宛名・差出人・メッセージを入れてクリスマスカードを作ろう。画像で保存、リンクで送ると封筒が開いてカードが届きます。',
    zh: '选主题和祝福语，写上收件人、署名和祝福，做一张圣诞贺卡。可存成图片，或发链接，对方打开时信封会慢慢展开。',
    fr: 'Choisis un thème et une formule, ajoute les prénoms et un mot chaleureux pour créer ta carte de Noël. Enregistre l’image ou envoie un lien qui s’ouvre comme une enveloppe.',
    de: 'Motiv und Gruß wählen, Namen und ein paar liebe Worte eintragen – fertig ist die Weihnachtskarte. Als Bild speichern oder als Link schicken, der sich wie ein Umschlag öffnet.',
    th: 'เลือกธีมและคำอวยพร ใส่ชื่อผู้รับ ผู้ส่ง และข้อความ แล้วทำการ์ดคริสต์มาส บันทึกเป็นรูป หรือส่งลิงก์ที่เปิดออกมาเหมือนซองจดหมาย',
    vi: 'Chọn chủ đề và lời chúc, ghi tên người nhận, người gửi và lời nhắn để làm thiệp Giáng sinh. Lưu thành ảnh hoặc gửi link mở ra như phong thư.',
    es: 'Elige un tema y un saludo, escribe los nombres y un mensaje cariñoso y crea tu tarjeta de Navidad. Guárdala como imagen o envía un enlace que se abre como un sobre.',
    it: 'Scegli un tema e un augurio, aggiungi i nomi e un messaggio affettuoso e crea il tuo biglietto di Natale. Salvalo come immagine o invia un link che si apre come una busta.',
    pt: 'Escolha um tema e uma saudação, escreva os nomes e uma mensagem carinhosa e crie seu cartão de Natal. Salve como imagem ou mande um link que abre como um envelope.',
    ru: 'Выбери оформление и поздравление, впиши имена и тёплые слова — и открытка готова. Сохрани картинку или отправь ссылку, которая открывается как конверт.',
  },
};
