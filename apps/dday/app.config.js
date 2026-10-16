// dday 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/dday/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'dday',
  emoji: '📅',
  category: 'create',
  added: '2026-10-17',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://dday.example.com/',
  title: {
    ko: '디데이 계산기',
    en: 'D-Day Calculator',
    ja: '日数計算・あと何日',
    zh: '倒数日计算器',
    fr: 'Compte à rebours',
    de: 'Countdown Rechner',
    th: 'นับวันถอยหลัง',
    vi: 'Đếm ngược ngày',
    es: 'Cuenta regresiva',
    it: 'Conto alla rovescia',
    pt: 'Contagem regressiva',
    ru: 'Обратный отсчёт',
  },
  desc: {
    ko: '목표일까지 D-day, 사귄 날부터 며칠째(100일·1000일·주년), 날짜 더하기 빼기까지. 실시간 카운트다운 카드를 저장·공유해요.',
    en: 'Count down to any date, count days since a start date with day 100 and 1000 milestones, or add days. Save or share a live card.',
    ja: '目標日まであと何日か、記念日から何日目か（100日・1000日・周年）、日付の足し算・引き算まで。カードを保存・共有できます。',
    zh: '倒数到任何日子、计算在一起第几天（100天、1000天、周年），还能日期加减。实时倒计时卡片可保存分享。',
    fr: 'Compte à rebours jusqu’à une date, jours écoulés depuis un début (jour 100, 1000, anniversaires) ou ajout de jours. Carte à partager.',
    de: 'Countdown bis zu jedem Datum, Tage seit einem Start mit Tag 100 und 1000, oder Tage addieren. Live-Karte speichern und teilen.',
    th: 'นับวันถอยหลังถึงวันสำคัญ นับวันที่คบกัน (100 วัน 1000 วัน ครบรอบ) และบวกลบวัน พร้อมการ์ดนับแบบเรียลไทม์ให้แชร์',
    vi: 'Đếm ngược đến ngày bất kỳ, đếm số ngày bên nhau (100, 1000 ngày, kỷ niệm) hoặc cộng trừ ngày. Lưu và chia sẻ thẻ đếm trực tiếp.',
    es: 'Cuenta regresiva hasta cualquier fecha, días desde un inicio con hitos de 100 y 1000 días, o suma días. Guarda o comparte la tarjeta.',
    it: 'Conto alla rovescia fino a una data, giorni da un inizio con traguardi di 100 e 1000 giorni, o somma giorni. Card da salvare e condividere.',
    pt: 'Contagem regressiva até qualquer data, dias desde um início com marcos de 100 e 1000 dias, ou soma de dias. Salve ou compartilhe o card.',
    ru: 'Обратный отсчёт до любой даты, дни с начала отношений (100, 1000 дней, годовщины) или прибавить дни. Живая карточка для шаринга.',
  },
};
