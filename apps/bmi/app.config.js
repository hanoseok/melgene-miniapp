// bmi 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bmi/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'bmi',
  emoji: '⚖️',
  category: 'create',
  added: '2026-10-24',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bmi.example.com/',
  title: {
    ko: 'BMI 계산기',
    en: 'BMI Calculator',
    ja: 'BMI計算',
    zh: 'BMI计算器',
    fr: 'Calcul IMC',
    de: 'BMI Rechner',
    th: 'คำนวณ BMI',
    vi: 'Tính BMI',
    es: 'Calcular IMC',
    it: 'Calcolo BMI',
    pt: 'Calcular IMC',
    ru: 'Калькулятор ИМТ',
  },
  desc: {
    ko: '키와 몸무게만 넣으면 BMI(체질량지수)와 비만도 단계, 내 키의 정상 체중 범위, 정상까지 몇 kg인지 바로 보여 줘요. 대한비만학회 아시아 기준도 함께.',
    en: 'Enter your height and weight in cm/kg or ft/lb to get your BMI, its WHO category on a color scale, the healthy weight range for your height and how far you are from it.',
    ja: '身長と体重を入れるだけでBMIと肥満度（日本肥満学会の判定）、身長に合った普通体重の範囲、あと何kgで普通体重かをすぐ表示します。',
    zh: '输入身高体重，马上算出BMI、胖瘦等级（WHO标准与中国成人标准）、你身高对应的健康体重范围，以及离健康范围还差几公斤。',
    fr: 'Calculez votre IMC en cm/kg ou en pieds/livres : catégorie OMS sur une échelle de couleurs, poids santé pour votre taille et écart à cette fourchette.',
    de: 'BMI berechnen in cm/kg oder ft/lb: Einstufung nach WHO auf einer Farbskala, Normalgewicht für Ihre Größe und wie viel Sie bis dahin fehlt.',
    th: 'ใส่ส่วนสูงและน้ำหนัก ดูค่า BMI ทันที พร้อมเกณฑ์อ้วนผอมแบบเอเชีย ช่วงน้ำหนักที่เหมาะกับส่วนสูง และต้องลดหรือเพิ่มอีกกี่กิโล',
    vi: 'Nhập chiều cao, cân nặng để tính BMI ngay, xem mức gầy béo theo chuẩn châu Á, khoảng cân nặng hợp lý cho chiều cao và còn cách bao nhiêu kg.',
    es: 'Calcula tu IMC en cm/kg o pies/libras: categoría de la OMS en una escala de colores, peso saludable para tu estatura y cuánto te falta para llegar.',
    it: 'Calcola il BMI in cm/kg o piedi/libbre: categoria OMS su una scala a colori, peso forma per la tua altezza e quanto manca per rientrarci.',
    pt: 'Calcule seu IMC em cm/kg ou pés/libras: classificação da OMS em uma escala colorida, peso ideal para a sua altura e quanto falta para chegar lá.',
    ru: 'Считай ИМТ по росту и весу в см/кг или футах/фунтах: категория ВОЗ на цветной шкале, нормальный вес для твоего роста и сколько до него осталось.',
  },
};
