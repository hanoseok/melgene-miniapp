// split 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/split/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'split',
  emoji: '💸',
  category: 'create',
  added: '2026-10-28',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://split.example.com/',
  title: {
    ko: '더치페이 계산기',
    en: 'Split Bill Calculator',
    ja: '割り勘計算',
    zh: 'AA制计算器',
    fr: 'Calcul partage addition',
    de: 'Rechnung teilen Rechner',
    th: 'คำนวณหารค่าอาหาร',
    vi: 'Tính tiền chia đều',
    es: 'Calculadora dividir cuenta',
    it: 'Calcolatore dividi conto',
    pt: 'Calculadora de dividir conta',
    ru: 'Разделить счёт',
  },
  desc: {
    ko: '총액과 인원만 넣으면 1인당 금액이 바로 나와요. 메뉴별로 나누기, 100원·1000원 단위 올림, 총무 부담, 먼저 낸 사람에게 누가 얼마 보낼지까지 계산해 카톡으로 복사.',
    en: 'Split a bill evenly or by item, add tip and tax, round each share and see who sends whom how much when someone paid first. Copy the result or share it as a link.',
    ja: '合計と人数を入れるだけで1人あたりの金額がすぐ出ます。メニューごとの割り勘、100円単位の端数処理、幹事の負担、立て替え精算もまとめて計算。',
    zh: '输入总金额和人数，马上算出每人该付多少。支持按菜品分摊、服务费、抹零取整，以及谁先垫付后谁该转给谁多少钱，一键复制发群里。',
    fr: 'Partagez l’addition à parts égales ou selon ce que chacun a pris, avec pourboire et arrondi, puis voyez qui doit rembourser qui quand quelqu’un a avancé.',
    de: 'Rechnung gleichmäßig oder nach Bestellung teilen, mit Trinkgeld und Rundung – und sehen, wer wem wie viel überweist, wenn jemand ausgelegt hat.',
    th: 'ใส่ยอดรวมกับจำนวนคน ก็รู้ทันทีว่าต้องจ่ายคนละเท่าไร หารตามเมนูที่สั่ง บวกเซอร์วิสชาร์จ ปัดเศษ และดูว่าใครต้องโอนให้ใครเท่าไร',
    vi: 'Nhập tổng tiền và số người là biết ngay mỗi người trả bao nhiêu. Chia theo món, cộng phí phục vụ, làm tròn và xem ai cần chuyển cho ai bao nhiêu.',
    es: 'Divide la cuenta a partes iguales o por lo que pidió cada uno, con propina y redondeo, y mira quién le paga a quién si alguien adelantó el dinero.',
    it: 'Dividi il conto alla romana o in base a cosa ha preso ciascuno, con mancia e arrotondamento, e scopri chi deve dare quanto a chi ha anticipato.',
    pt: 'Divida a conta igualmente ou pelo que cada um pediu, com os 10% e arredondamento, e veja quem manda Pix para quem quando alguém pagou tudo.',
    ru: 'Раздели счёт поровну или по блюдам, добавь чаевые и округление и посмотри, кто кому сколько переводит, если кто-то заплатил за всех.',
  },
};
