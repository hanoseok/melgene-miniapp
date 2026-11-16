// advent 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/advent/ 로 바꾼다).
module.exports = {
  id: 'advent',
  emoji: '🎄',
  category: 'create',
  added: '2026-11-17',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://advent.example.com/',
  title: {
    ko: '어드벤트 캘린더 만들기',
    en: 'Advent Calendar Maker',
    ja: 'アドベントカレンダー作成',
    zh: '降临节日历制作',
    fr: 'Calendrier de l’Avent',
    de: 'Adventskalender erstellen',
    th: 'ปฏิทินแอดเวนต์',
    vi: 'Lịch Advent',
    es: 'Calendario de Adviento',
    it: 'Calendario dell’Avvento',
    pt: 'Calendário do Advento',
    ru: 'Адвент-календарь',
  },
  desc: {
    ko: '친구·연인·가족에게 줄 24칸 어드벤트 캘린더를 만들어요. 칸마다 짧은 메시지를 숨기면 12월 1일부터 하루에 한 칸씩 열려요. 메시지는 링크 안에만 담겨요.',
    en: 'Make a 24-door advent calendar for a friend, partner or family. Hide a short note behind each door and one opens every day from December 1. Messages live only in the link.',
    ja: '友だち・恋人・家族に贈る24窓のアドベントカレンダーを作ろう。窓ごとに短いメッセージを隠すと、12月1日から毎日ひとつずつ開きます。メッセージはリンクの中だけ。',
    zh: '为朋友、恋人或家人做一份24格降临节日历。每格藏一句短短的话，从12月1日起每天开一格。留言只保存在链接里。',
    fr: 'Créez un calendrier de l’Avent à 24 cases pour un ami, votre moitié ou la famille. Un petit mot derrière chaque case, une case s’ouvre chaque jour dès le 1er décembre.',
    de: 'Erstelle einen Adventskalender mit 24 Türchen für Freunde, Partner oder Familie. Hinter jedem Türchen eine kurze Nachricht – ab dem 1. Dezember öffnet sich täglich eins.',
    th: 'ทำปฏิทินแอดเวนต์ 24 ช่องให้เพื่อน แฟน หรือครอบครัว ซ่อนข้อความสั้น ๆ ไว้หลังประตูแต่ละบาน แล้วจะเปิดได้วันละบานตั้งแต่ 1 ธันวาคม',
    vi: 'Tạo lịch Advent 24 ô tặng bạn bè, người yêu hay gia đình. Giấu một lời nhắn ngắn sau mỗi ô, từ ngày 1/12 mỗi ngày mở được một ô. Lời nhắn chỉ nằm trong link.',
    es: 'Crea un calendario de Adviento de 24 puertas para un amigo, tu pareja o la familia. Esconde un mensaje en cada puerta y se abre una cada día desde el 1 de diciembre.',
    it: 'Crea un calendario dell’Avvento da 24 finestrelle per un amico, il partner o la famiglia. Un messaggio dietro ogni finestrella, che si apre un giorno alla volta dal 1° dicembre.',
    pt: 'Monte um calendário do Advento com 24 portinhas para um amigo, seu amor ou a família. Esconda um recado em cada uma: a partir de 1º de dezembro, abre uma por dia.',
    ru: 'Сделай адвент-календарь на 24 окошка для друга, любимого человека или семьи. Спрячь в каждом короткое послание — с 1 декабря открывается по одному окошку в день.',
  },
};
