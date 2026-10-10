// randnum 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/randnum/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'randnum',
  emoji: '🔢',
  category: 'vote',
  added: '2026-10-11',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://randnum.example.com/',
  title: {
    ko: '랜덤 숫자 뽑기',
    en: 'Random Number Generator',
    ja: '乱数生成',
    zh: '随机数生成器',
    fr: 'Nombres aléatoires',
    de: 'Zufallszahlen',
    th: 'สุ่มตัวเลข',
    vi: 'Quay số ngẫu nhiên',
    es: 'Números aleatorios',
    it: 'Numeri casuali',
    pt: 'Sorteio de números',
    ru: 'Случайные числа',
  },
  desc: {
    ko: '최소·최대만 정하면 끝. 숫자 1~1000개를 중복 없이 공정하게 뽑고, 뺄 번호·정렬·추첨 결과 링크 공유까지 돼요.',
    en: 'Pick random numbers in any range, from one to a thousand, with or without repeats. Exclude numbers, sort, and share a giveaway result link.',
    ja: '最小と最大を決めるだけ。1〜1000個の数字を重複なしで公平に抽選。除外する数字や並べ替え、抽選結果のリンク共有も。',
    zh: '设定最小值和最大值，就能公平抽出1到1000个随机数。可选不重复、排除号码、排序，还能分享抽奖结果链接。',
    fr: 'Tire des nombres au hasard dans n’importe quelle plage, de un à mille, avec ou sans doublons. Exclusions, tri et lien de tirage à partager.',
    de: 'Zufallszahlen in jedem Bereich ziehen, eine bis tausend, mit oder ohne Wiederholung. Zahlen ausschließen, sortieren, Ergebnis-Link teilen.',
    th: 'สุ่มตัวเลขในช่วงที่ต้องการ ได้ 1 ถึง 1000 ตัว เลือกไม่ให้ซ้ำ ตัดเลขที่ไม่ต้องการ เรียงลำดับ และแชร์ลิงก์ผลจับรางวัลได้',
    vi: 'Quay số ngẫu nhiên trong khoảng bất kỳ, từ một đến một nghìn số, có hoặc không lặp. Loại trừ số, sắp xếp và chia sẻ link kết quả.',
    es: 'Saca números al azar en cualquier rango, de uno a mil, con o sin repetición. Excluye números, ordena y comparte el resultado del sorteo.',
    it: 'Estrai numeri a caso in qualsiasi intervallo, da uno a mille, con o senza ripetizioni. Escludi numeri, ordina e condividi il risultato.',
    pt: 'Sorteie números em qualquer intervalo, de um a mil, com ou sem repetição. Exclua números, ordene e compartilhe o link do resultado.',
    ru: 'Случайные числа в любом диапазоне, от одного до тысячи, с повторами или без. Исключения, сортировка и ссылка на итог розыгрыша.',
  },
};
