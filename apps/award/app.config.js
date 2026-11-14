// award 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/award/ 로 바꾼다).
module.exports = {
  id: 'award',
  emoji: '🏆',
  category: 'create',
  added: '2026-11-15',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://award.example.com/',
  title: {
    ko: '상장 만들기',
    en: 'Award Certificate Maker',
    ja: '表彰状 作成',
    zh: '奖状制作',
    fr: 'Créer un diplôme',
    de: 'Urkunde erstellen',
    th: 'ทำเกียรติบัตร',
    vi: 'Tạo giấy khen',
    es: 'Crear diploma',
    it: 'Creare attestato',
    pt: 'Fazer certificado',
    ru: 'Создать грамоту',
  },
  desc: {
    ko: '상 이름과 받는 사람, 수상 이유를 적고 디자인과 도장을 골라 웃기고 따뜻한 상장을 만들어요. 이미지로 저장하거나 링크로 보내면 상장 수여식이 열려요.',
    en: 'Write an award title, the winner’s name and a reason, pick a frame and seal, and make a funny or heartfelt certificate. Save it as an image or send a link that opens like an award ceremony.',
    ja: '賞の名前・受賞者・理由を書いて、デザインとハンコを選ぶだけ。おもしろくて温かい表彰状を作ろう。画像で保存、リンクで送ると表彰式が始まります。',
    zh: '写上奖项名称、获奖人和获奖理由，选好样式和印章，做一张搞笑又暖心的奖状。可存成图片，或发链接让对方体验一场颁奖仪式。',
    fr: 'Écrivez le nom du prix, du lauréat et la raison, choisissez un cadre et un sceau : votre diplôme drôle ou touchant est prêt. Image à enregistrer ou lien qui ouvre une petite remise de prix.',
    de: 'Titel, Name und Begründung eintragen, Rahmen und Siegel wählen – fertig ist die lustige oder herzliche Urkunde. Als Bild speichern oder als Link schicken, der eine kleine Verleihung startet.',
    th: 'ใส่ชื่อรางวัล ชื่อผู้รับ และเหตุผล เลือกกรอบและตราประทับ แล้วทำเกียรติบัตรสุดฮาหรืออบอุ่นใจ บันทึกเป็นรูป หรือส่งลิงก์ที่เปิดเป็นพิธีมอบรางวัล',
    vi: 'Ghi tên giải, tên người nhận và lý do, chọn khung và con dấu để tạo giấy khen vui nhộn hoặc ấm áp. Lưu thành ảnh hoặc gửi link mở ra như một lễ trao giải.',
    es: 'Escribe el nombre del premio, del ganador y el motivo, elige marco y sello, y crea un diploma divertido o emotivo. Guárdalo como imagen o envía un enlace que abre una entrega de premios.',
    it: 'Scrivi il nome del premio, del vincitore e la motivazione, scegli cornice e timbro e crea un attestato divertente o affettuoso. Salvalo come immagine o invia un link che apre una premiazione.',
    pt: 'Escreva o nome do prêmio, de quem ganha e o motivo, escolha a moldura e o selo e faça um certificado divertido ou carinhoso. Salve como imagem ou mande um link que abre uma cerimônia de premiação.',
    ru: 'Впиши название награды, имя и за что, выбери рамку и печать — и шуточная или трогательная грамота готова. Сохрани картинку или отправь ссылку, которая открывается как церемония награждения.',
  },
};
