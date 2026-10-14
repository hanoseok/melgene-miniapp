// wordcount 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/wordcount/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'wordcount',
  emoji: '📝',
  category: 'create',
  added: '2026-10-15',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://wordcount.example.com/',
  title: {
    ko: '글자수 세기',
    en: 'Word Counter',
    ja: '文字数カウント',
    zh: '字数统计',
    fr: 'Compteur de mots',
    de: 'Zeichenzähler',
    th: 'นับจำนวนตัวอักษร',
    vi: 'Đếm ký tự',
    es: 'Contador de palabras',
    it: 'Contatore di parole',
    pt: 'Contador de palavras',
    ru: 'Счётчик символов',
  },
  desc: {
    ko: '붙여 넣으면 공백 포함·제외 글자수, 단어, 바이트(자소서·나이스)가 바로. 목표 글자수 막대와 읽는 시간까지, 서버 전송 없이.',
    en: 'Paste your text to count characters with and without spaces, words, sentences and bytes live. Target limit bar, reading time, nothing uploaded.',
    ja: '貼り付けるだけで空白込み・なしの文字数、単語数、バイト数をリアルタイム表示。目標文字数バーと読む時間も、送信なし。',
    zh: '粘贴文本即可实时统计含空格/不含空格字数、词数、句数和字节数。目标字数进度条和阅读时间，不上传任何内容。',
    fr: 'Colle ton texte : caractères avec et sans espaces, mots, phrases et octets en direct. Barre d’objectif, temps de lecture, rien n’est envoyé.',
    de: 'Text einfügen: Zeichen mit und ohne Leerzeichen, Wörter, Sätze und Bytes live. Zielbalken und Lesezeit, nichts wird hochgeladen.',
    th: 'วางข้อความแล้วนับตัวอักษรรวมและไม่รวมช่องว่าง คำ ประโยค และไบต์ได้ทันที มีแถบเป้าหมายและเวลาอ่าน ไม่ส่งข้อมูลออกไป',
    vi: 'Dán văn bản để đếm ký tự có và không có dấu cách, số từ, câu và byte ngay lập tức. Có thanh giới hạn, thời gian đọc, không gửi đi đâu.',
    es: 'Pega tu texto y cuenta caracteres con y sin espacios, palabras, frases y bytes al instante. Barra de límite y tiempo de lectura, sin subir nada.',
    it: 'Incolla il testo e conta caratteri con e senza spazi, parole, frasi e byte in tempo reale. Barra obiettivo e tempo di lettura, nulla viene inviato.',
    pt: 'Cole seu texto e conte caracteres com e sem espaços, palavras, frases e bytes na hora. Barra de limite e tempo de leitura, nada é enviado.',
    ru: 'Вставь текст и сразу узнай число символов с пробелами и без, слов, предложений и байтов. Шкала лимита, время чтения, ничего не отправляется.',
  },
};
