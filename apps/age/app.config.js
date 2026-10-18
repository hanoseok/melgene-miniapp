// age 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/age/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'age',
  emoji: '🎂',
  category: 'create',
  added: '2026-10-19',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://age.example.com/',
  title: {
    ko: '만 나이 계산기',
    en: 'Age Calculator',
    ja: '年齢計算',
    zh: '年龄计算器',
    fr: 'Calcul de l’âge',
    de: 'Altersrechner',
    th: 'คำนวณอายุ',
    vi: 'Tính tuổi',
    es: 'Calculadora de edad',
    it: 'Calcolo età',
    pt: 'Calculadora de idade',
    ru: 'Калькулятор возраста',
  },
  desc: {
    ko: '생년월일만 넣으면 만 나이를 년·개월·일까지, 다음 생일 D-day, 살아온 날수, 태어난 요일, 별자리·띠, 1만 일 기념일까지 알려 줘요.',
    en: 'Enter your birth date to get your exact age in years, months and days, a birthday countdown, days lived, your birth weekday and zodiac signs.',
    ja: '生年月日を入れるだけで満年齢を年・か月・日まで計算。次の誕生日まであと何日、生まれてからの日数、曜日、星座・干支もわかります。',
    zh: '输入出生日期，算出精确到年、月、天的周岁，下次生日倒数、已活天数、出生星期、星座和生肖，还有一万天纪念日。',
    fr: 'Entrez votre date de naissance : âge exact en années, mois et jours, compte à rebours avant l’anniversaire, jours vécus, signe du zodiaque.',
    de: 'Geburtsdatum eingeben und das genaue Alter in Jahren, Monaten und Tagen sehen, dazu Countdown zum Geburtstag, gelebte Tage und Sternzeichen.',
    th: 'ใส่วันเกิดแล้วรู้อายุแบบละเอียดเป็นปี เดือน วัน นับถอยหลังวันเกิด จำนวนวันที่มีชีวิต วันในสัปดาห์ที่เกิด ราศี และปีนักษัตร',
    vi: 'Nhập ngày sinh để biết tuổi chính xác theo năm, tháng, ngày, đếm ngược sinh nhật, số ngày đã sống, thứ trong tuần lúc sinh, cung và con giáp.',
    es: 'Introduce tu fecha de nacimiento y descubre tu edad exacta en años, meses y días, cuenta atrás al cumpleaños, días vividos y tu signo.',
    it: 'Inserisci la data di nascita: età esatta in anni, mesi e giorni, conto alla rovescia al compleanno, giorni vissuti, giorno della settimana e segno.',
    pt: 'Digite sua data de nascimento e veja a idade exata em anos, meses e dias, quanto falta para o aniversário, dias vividos e seu signo.',
    ru: 'Введи дату рождения и узнай точный возраст в годах, месяцах и днях, сколько дней до дня рождения, сколько дней прожито и свой знак зодиака.',
  },
};
