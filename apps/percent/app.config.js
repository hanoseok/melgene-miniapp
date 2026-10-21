// percent 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/percent/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'percent',
  emoji: '💯',
  category: 'create',
  added: '2026-10-22',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://percent.example.com/',
  title: {
    ko: '퍼센트 계산기',
    en: 'Percentage Calculator',
    ja: 'パーセント計算',
    zh: '百分比计算器',
    fr: 'Calcul pourcentage',
    de: 'Prozentrechner',
    th: 'คำนวณเปอร์เซ็นต์',
    vi: 'Tính phần trăm',
    es: 'Calcular porcentaje',
    it: 'Calcolo percentuale',
    pt: 'Calcular porcentagem',
    ru: 'Калькулятор процентов',
  },
  desc: {
    ko: '200의 15%, 몇 퍼센트인지, 증가율·감소율, 할인가와 아낀 돈, 원래 가격 역산, %포인트 차이까지 입력하는 대로 바로 계산하고 계산식도 보여 줘요.',
    en: 'Work out X% of Y, what percent one number is of another, percent change, discounts and price rises, the original price and percentage point gaps, with the formula shown.',
    ja: '〇〇の何%、何パーセントか、増加率・減少率、割引後の価格、元の値段の逆算、ポイント差まで、入力するとすぐ計算して式も表示します。',
    zh: '算出某数的百分之几、占比多少、增长率与下降率、打折价与省下的钱、原价反推、百分点差，边输入边出结果并显示算式。',
    fr: 'Calculez X % de Y, quel pourcentage représente un nombre, une évolution en %, une remise ou une hausse, le prix d’origine et l’écart en points.',
    de: 'Prozentrechner für X % von Y, Prozentanteil, prozentuale Veränderung, Rabatt und Aufschlag, Grundwert zurückrechnen und Prozentpunkte – mit Rechenweg.',
    th: 'คำนวณ X% ของ Y เป็นกี่เปอร์เซ็นต์ เปอร์เซ็นต์เพิ่มขึ้นลดลง ราคาหลังลด เงินที่ประหยัด ราคาเดิม และส่วนต่างจุดเปอร์เซ็นต์ พร้อมสูตร',
    vi: 'Tính X% của Y, một số chiếm bao nhiêu phần trăm, phần trăm tăng giảm, giá sau giảm, tiết kiệm bao nhiêu, giá gốc và chênh lệch điểm phần trăm.',
    es: 'Calcula el X % de Y, qué porcentaje es un número de otro, variación porcentual, descuentos y aumentos, precio original y diferencia en puntos.',
    it: 'Calcola il X% di Y, che percentuale è un numero di un altro, variazione percentuale, sconti e aumenti, prezzo iniziale e punti percentuali.',
    pt: 'Calcule X% de Y, quantos por cento um número é de outro, variação percentual, descontos e aumentos, preço original e diferença em pontos percentuais.',
    ru: 'Считай X % от числа, сколько процентов одно число от другого, изменение в процентах, скидки и наценки, исходную цену и разницу в процентных пунктах.',
  },
};
