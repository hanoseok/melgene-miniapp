// aim 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/aim/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'aim',
  emoji: '🎯',
  category: 'game',
  added: '2026-11-06',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://aim.example.com/',
  title: {
    ko: '에임 연습',
    en: 'Aim Trainer',
    ja: 'エイム練習',
    zh: '瞄准训练',
    fr: 'Aim trainer',
    de: 'Aim Trainer',
    th: 'ฝึกเอม',
    vi: 'Luyện aim',
    es: 'Aim trainer',
    it: 'Aim trainer',
    pt: 'Treino de mira',
    ru: 'Аим тренер',
  },
  desc: {
    ko: '나타나는 과녁을 최대한 빨리 맞히세요. 과녁 30개 클래식·30초 타임어택으로 평균 반응 시간과 정확도를 재요.',
    en: 'Hit targets as fast as you can: 30-target Classic or a 30-second Timed run. See your average time per target, accuracy and rank.',
    ja: '現れる的をすばやくクリック。30個のクラシックと30秒タイムアタックで、平均タイムと命中率を測ります。',
    zh: '尽快点中随机出现的靶子：30个靶的经典模式或30秒限时模式，测出平均用时和命中率。',
    fr: 'Touche les cibles le plus vite possible : 30 cibles en mode Classique ou 30 secondes en Chrono. Temps moyen et précision.',
    de: 'Triff die Ziele so schnell du kannst: 30 Ziele im Klassik-Modus oder 30 Sekunden auf Zeit. Mit Durchschnittszeit und Trefferquote.',
    th: 'คลิกเป้าที่โผล่ขึ้นมาให้ไวที่สุด โหมดคลาสสิก 30 เป้า หรือจับเวลา 30 วินาที ดูเวลาเฉลี่ยและความแม่นยำ',
    vi: 'Bấm trúng mục tiêu nhanh nhất có thể: 30 mục tiêu chế độ Cổ điển hoặc 30 giây Tính giờ. Xem thời gian trung bình và độ chính xác.',
    es: 'Acierta los objetivos lo más rápido que puedas: 30 objetivos en Clásico o 30 segundos en Contrarreloj. Tiempo medio y precisión.',
    it: 'Colpisci i bersagli il più in fretta possibile: 30 bersagli in Classica o 30 secondi a Tempo. Tempo medio e precisione.',
    pt: 'Acerte os alvos o mais rápido que puder: 30 alvos no Clássico ou 30 segundos no Cronometrado. Tempo médio e precisão.',
    ru: 'Попадай по мишеням как можно быстрее: 30 мишеней в «Классике» или 30 секунд на время. Среднее время и точность.',
  },
};
