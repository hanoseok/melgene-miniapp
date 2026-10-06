// fancytext 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/fancytext/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'fancytext',
  emoji: '✨',
  category: 'create',
  added: '2026-10-07',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://fancytext.example.com/',
  title: {
    ko: '글꼴 변환기',
    en: 'Fancy Text Generator',
    ja: 'おしゃれ文字変換',
    zh: '花式字体生成器',
    fr: 'Générateur de police',
    de: 'Schriftarten Generator',
    th: 'แปลงฟอนต์ตัวอักษร',
    vi: 'Tạo chữ nghệ thuật',
    es: 'Generador de letras',
    it: 'Generatore di font',
    pt: 'Gerador de letras',
    ru: 'Генератор шрифтов',
  },
  desc: {
    ko: '글을 입력하면 굵게·필기체·동그라미·거꾸로 등 멋진 글씨체로 바꿔 줘요. 누르면 바로 복사, 한글도 꾸미기 OK.',
    en: 'Type anything and see it in bold, script, bubble, upside-down and more fancy styles. Tap one to copy and paste it anywhere.',
    ja: '文字を入れるだけで、太字・筆記体・丸文字・上下反転などおしゃれな文字に変換。タップでコピー、日本語の飾りも。',
    zh: '输入文字，一键变成粗体、手写体、圆圈字、颠倒等花式字体，点一下即可复制，中文也能加装饰。',
    fr: 'Écris ton texte et vois-le en gras, cursive, bulles, à l’envers et plus. Touche un style pour le copier et le coller partout.',
    de: 'Text eingeben und in Fett, Schreibschrift, Kreisen, kopfüber und mehr sehen. Stil antippen, kopieren und überall einfügen.',
    th: 'พิมพ์ข้อความแล้วดูเป็นตัวหนา ลายมือ วงกลม กลับหัว และอีกหลายสไตล์ แตะเพื่อคัดลอกไปวางได้ทุกที่',
    vi: 'Gõ chữ và xem nó thành chữ đậm, viết tay, bong bóng, lộn ngược và nhiều kiểu khác. Chạm để sao chép rồi dán ở đâu cũng được.',
    es: 'Escribe tu texto y míralo en negrita, cursiva, burbujas, al revés y más. Toca un estilo para copiarlo y pégalo donde quieras.',
    it: 'Scrivi il testo e guardalo in grassetto, corsivo, bolle, capovolto e altro. Tocca uno stile per copiarlo e incollarlo ovunque.',
    pt: 'Digite seu texto e veja em negrito, cursiva, bolhas, de cabeça para baixo e mais. Toque num estilo para copiar e colar onde quiser.',
    ru: 'Введи текст и посмотри его жирным, рукописным, в пузырьках, вверх ногами и не только. Нажми на стиль, скопируй и вставь куда угодно.',
  },
};
