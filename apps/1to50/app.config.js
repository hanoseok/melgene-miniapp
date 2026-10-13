// 1to50 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/1to50/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: '1to50',
  emoji: '🔢',
  category: 'game',
  added: '2026-10-14',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://1to50.example.com/',
  title: {
    ko: '1to50',
    en: '1 to 50 Game',
    ja: '1to50 数字タッチ',
    zh: '1到50 舒尔特方格',
    fr: 'Jeu 1 à 50',
    de: '1 bis 50 Spiel',
    th: 'เกมกดเลข 1 ถึง 50',
    vi: 'Game 1 đến 50',
    es: 'Juego del 1 al 50',
    it: 'Gioco da 1 a 50',
    pt: 'Jogo de 1 a 50',
    ru: 'Игра от 1 до 50',
  },
  desc: {
    ko: '1부터 50까지 순서대로 최대한 빨리 터치! 0.01초 기록과 실제 백분위로 손 빠르기를 겨뤄 보세요.',
    en: 'Tap the numbers from 1 to 50 in order as fast as you can. Timed to 0.01 s, with a quick 1 to 25 mode.',
    ja: '1から50まで順番にできるだけ速くタッチ！0.01秒のタイムと実際の順位で指の速さを競おう。',
    zh: '按顺序尽快点击1到50！计时精确到0.01秒，还有1到25快速模式，测测你的专注力和手速。',
    fr: 'Touchez les nombres de 1 à 50 dans l’ordre, le plus vite possible. Chrono au centième et mode rapide 1 à 25.',
    de: 'Tippe die Zahlen von 1 bis 50 der Reihe nach so schnell du kannst. Zeit auf 0,01 s genau, dazu ein 1-bis-25-Modus.',
    th: 'กดตัวเลขจาก 1 ถึง 50 ตามลำดับให้เร็วที่สุด จับเวลาละเอียด 0.01 วินาที พร้อมโหมดเร็ว 1 ถึง 25',
    vi: 'Chạm các số từ 1 đến 50 theo thứ tự nhanh nhất có thể. Bấm giờ tới 0,01 giây, có chế độ nhanh 1 đến 25.',
    es: 'Toca los números del 1 al 50 en orden lo más rápido posible. Cronómetro de centésimas y modo rápido del 1 al 25.',
    it: 'Tocca i numeri da 1 a 50 in ordine il più in fretta possibile. Tempo al centesimo e modalità rapida da 1 a 25.',
    pt: 'Toque os números de 1 a 50 em ordem o mais rápido possível. Cronômetro de centésimos e modo rápido de 1 a 25.',
    ru: 'Нажимай числа от 1 до 50 по порядку как можно быстрее. Время до сотых и быстрый режим от 1 до 25.',
  },
};
