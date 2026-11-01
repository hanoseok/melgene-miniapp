// timer 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/timer/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'timer',
  emoji: '⏱️',
  category: 'game',
  added: '2026-11-02',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://timer.example.com/',
  title: {
    ko: '10초 맞추기',
    en: '10 Second Challenge',
    ja: '10秒ストップ',
    zh: '10秒挑战',
    fr: 'Défi 10 secondes',
    de: '10-Sekunden-Challenge',
    th: 'ท้าจับเวลา 10 วินาที',
    vi: 'Thử thách 10 giây',
    es: 'Reto de los 10 segundos',
    it: 'Sfida dei 10 secondi',
    pt: 'Desafio dos 10 segundos',
    ru: 'Игра «10 секунд»',
  },
  desc: {
    ko: '스톱워치를 감으로 딱 10.00초에 멈춰 보세요. 3번 도전, 숫자가 사라지는 블라인드 모드까지.',
    en: 'Start the stopwatch and stop it at exactly 10.00 seconds by feel. Three tries, plus a blind mode where the digits vanish.',
    ja: 'ストップウォッチを感覚だけでぴったり10.00秒に止めよう。3回挑戦、数字が消えるブラインドモードも。',
    zh: '全凭感觉把秒表停在正好10.00秒。每局3次机会，还有数字会消失的盲测模式。',
    fr: 'Lance le chrono et arrête-le pile à 10,00 secondes, au feeling. Trois essais, et un mode aveugle où les chiffres disparaissent.',
    de: 'Starte die Stoppuhr und stoppe sie nach Gefühl genau bei 10,00 Sekunden. Drei Versuche plus Blind-Modus ohne Ziffern.',
    th: 'กดเริ่มนาฬิกาจับเวลาแล้วหยุดให้ตรง 10.00 วินาทีด้วยความรู้สึก เล่นได้ 3 ครั้ง มีโหมดปิดตาที่ตัวเลขหายไป',
    vi: 'Bấm đồng hồ và dừng đúng 10,00 giây chỉ bằng cảm giác. 3 lượt, thêm chế độ che số khiến con số biến mất.',
    es: 'Inicia el cronómetro y páralo justo en 10,00 segundos a ojo. Tres intentos y un modo a ciegas donde los números desaparecen.',
    it: 'Avvia il cronometro e fermalo esattamente a 10,00 secondi a sensazione. Tre tentativi e una modalità alla cieca senza cifre.',
    pt: 'Inicie o cronômetro e pare em 10,00 segundos cravados no feeling. Três tentativas e um modo às cegas em que os números somem.',
    ru: 'Запусти секундомер и останови его ровно на 10,00 секунды на ощупь. Три попытки и слепой режим, где цифры исчезают.',
  },
};
