// order 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/order/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'order',
  emoji: '🔢',
  category: 'vote',
  added: '2026-11-15',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://order.example.com/',
  title: {
    ko: '순서 정하기',
    en: 'Random Order Picker',
    ja: '順番決め',
    zh: '随机排序',
    fr: 'Ordre de passage',
    de: 'Reihenfolge auslosen',
    th: 'สุ่มลำดับ',
    vi: 'Bốc thăm thứ tự',
    es: 'Sortear orden',
    it: 'Ordine casuale',
    pt: 'Sortear ordem',
    ru: 'Случайный порядок',
  },
  desc: {
    ko: '발표 순서·게임 순서·청소 당번을 공정하게. 이름이나 번호를 섞어 1번부터 마지막까지 한 장씩 공개하고, 결과는 복사·링크로 공유해요.',
    en: 'Fair presentation order, game turns or chore rota: shuffle names or numbers, reveal 1st to last one card at a time, then copy or share the list.',
    ja: '発表の順番、ゲームの順番、掃除当番を公平に。名前や番号をシャッフルして1番から最後まで1枚ずつ発表、結果はコピーやリンクで共有。',
    zh: '公平决定汇报顺序、游戏顺序或值日表：打乱名字或号码，从第1名到最后逐张揭晓，结果可复制或用链接分享。',
    fr: 'Un ordre de passage équitable pour exposés, jeux ou corvées : mélangez noms ou numéros, révélez du 1er au dernier, puis copiez ou partagez la liste.',
    de: 'Faire Reihenfolge für Referate, Spielzüge oder den Putzplan: Namen oder Zahlen mischen, Platz für Platz aufdecken, Liste kopieren oder teilen.',
    th: 'สุ่มลำดับนำเสนองาน ลำดับเล่นเกม หรือเวรทำความสะอาดอย่างยุติธรรม เปิดทีละใบจากที่ 1 ถึงคนสุดท้าย แล้วคัดลอกหรือแชร์ลิงก์',
    vi: 'Bốc thăm thứ tự thuyết trình, lượt chơi hay trực nhật thật công bằng: xáo tên hoặc số, lật từng thẻ từ đầu đến cuối, sao chép hay chia sẻ.',
    es: 'Un orden justo para exposiciones, turnos de juego o limpieza: mezcla nombres o números, revela del 1.º al último y copia o comparte la lista.',
    it: 'Un ordine equo per presentazioni, turni di gioco o pulizie: mescola nomi o numeri, svela dal primo all’ultimo, poi copia o condividi la lista.',
    pt: 'Ordem justa para apresentações, vez no jogo ou escala de limpeza: embaralhe nomes ou números, revele do 1º ao último e copie ou compartilhe.',
    ru: 'Честный порядок выступлений, ходов в игре или дежурств: перемешай имена или числа, открывай с первого до последнего и поделись списком.',
  },
};
