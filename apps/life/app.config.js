// life 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/life/ 로 바꾼다).
module.exports = {
  id: 'life',
  emoji: '🎞️',
  category: 'create',
  added: '2026-09-26',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://life.example.com/',
  title: {
    ko: '내 인생 애니메이션',
    en: 'My Life, Animated',
    ja: 'わたしの人生アニメ',
    zh: '我的人生动画',
    fr: 'Ma vie en animation',
    de: 'Mein Leben als Animation',
    th: 'แอนิเมชันชีวิตฉัน',
    vi: 'Cuộc đời tôi thành hoạt hình',
    es: 'Mi vida animada',
    it: 'Animazione della mia vita',
    pt: 'Animação da minha vida',
    ru: 'Анимация моей жизни',
  },
  desc: {
    ko: '태어난 날부터 오늘까지, 펜으로 그려지는 1분 인생 만화.',
    en: 'Your life from birth to today, drawn line by line in one minute.',
    ja: '生まれた日から今日まで、ペンで描く1分の人生マンガ。',
    zh: '从出生到今天，一分钟用画笔画出你的人生漫画。',
    fr: 'Votre vie, de la naissance à aujourd’hui, dessinée trait par trait en une minute.',
    de: 'Dein Leben von der Geburt bis heute – Strich für Strich in einer Minute gezeichnet.',
    th: 'ชีวิตคุณตั้งแต่เกิดจนถึงวันนี้ วาดทีละเส้นในหนึ่งนาที',
    vi: 'Cuộc đời bạn từ lúc chào đời đến hôm nay, vẽ từng nét trong một phút.',
    es: 'Tu vida desde que naciste hasta hoy, dibujada trazo a trazo en un minuto.',
    it: 'La tua vita dalla nascita a oggi, disegnata tratto dopo tratto in un minuto.',
    pt: 'Sua vida do nascimento até hoje, desenhada traço a traço em um minuto.',
    ru: 'Твоя жизнь от рождения до сегодня — линия за линией, за одну минуту.',
  },
};
