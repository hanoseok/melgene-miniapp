// qr 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/qr/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'qr',
  emoji: '🔳',
  category: 'create',
  added: '2026-10-11',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://qr.example.com/',
  title: {
    ko: 'QR코드 생성기',
    en: 'QR Code Generator',
    ja: 'QRコード作成',
    zh: '二维码生成器',
    fr: 'Générateur de QR code',
    de: 'QR-Code Generator',
    th: 'สร้าง QR Code',
    vi: 'Tạo mã QR',
    es: 'Generador de códigos QR',
    it: 'Generatore di QR code',
    pt: 'Gerador de QR Code',
    ru: 'Генератор QR-кода',
  },
  desc: {
    ko: '링크·글자·와이파이·이메일·전화번호를 QR코드로 바로 만들어요. 색·크기 바꾸고 PNG·SVG로 저장, 입력한 내용은 서버로 가지 않아요.',
    en: 'Turn a link, text, Wi-Fi login, email or phone number into a QR code. Pick colors and size, save as PNG or SVG. Nothing leaves your browser.',
    ja: 'URL・テキスト・Wi-Fi・メール・電話番号をすぐQRコードに。色とサイズを選んでPNG・SVGで保存。入力内容はサーバーに送られません。',
    zh: '把网址、文字、Wi-Fi、邮箱或电话号码马上变成二维码。可选颜色和尺寸，保存为PNG或SVG，内容不会上传服务器。',
    fr: 'Transforme un lien, un texte, un Wi-Fi, un e-mail ou un numéro en QR code. Couleurs, taille, export PNG ou SVG. Rien ne quitte ton navigateur.',
    de: 'Link, Text, WLAN, E-Mail oder Telefonnummer als QR-Code. Farben und Größe wählen, als PNG oder SVG speichern. Nichts verlässt deinen Browser.',
    th: 'เปลี่ยนลิงก์ ข้อความ Wi-Fi อีเมล หรือเบอร์โทรเป็น QR Code ได้ทันที เลือกสีและขนาด บันทึกเป็น PNG หรือ SVG ข้อมูลไม่ถูกส่งไปเซิร์ฟเวอร์',
    vi: 'Biến link, văn bản, Wi-Fi, email hay số điện thoại thành mã QR. Chọn màu, kích thước, lưu PNG hoặc SVG. Dữ liệu không rời trình duyệt.',
    es: 'Convierte un enlace, texto, wifi, correo o teléfono en código QR. Elige colores y tamaño y guárdalo en PNG o SVG. Nada sale de tu navegador.',
    it: 'Trasforma link, testo, Wi-Fi, e-mail o numero di telefono in un QR code. Colori, dimensioni, PNG o SVG. Nulla lascia il tuo browser.',
    pt: 'Transforme link, texto, Wi-Fi, e-mail ou telefone em QR Code. Escolha cores e tamanho e salve em PNG ou SVG. Nada sai do seu navegador.',
    ru: 'Ссылка, текст, Wi-Fi, почта или телефон — в QR-код за секунду. Цвета, размер, сохранение в PNG и SVG. Данные не покидают браузер.',
  },
};
