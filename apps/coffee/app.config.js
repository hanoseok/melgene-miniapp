// coffee 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/coffee/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 커피 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'coffee',
  emoji: '☕',
  category: 'test',
  added: '2026-10-10',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://coffee.example.com/',
  title: {
    ko: '나는 어떤 커피?',
    en: 'What Coffee Are You?',
    ja: 'コーヒー性格診断',
    zh: '咖啡性格测试',
    fr: 'Quel café es-tu ?',
    de: 'Welcher Kaffee bist du?',
    th: 'ทดสอบ คุณคือกาแฟอะไร',
    vi: 'Bạn là loại cà phê nào?',
    es: '¿Qué café eres?',
    it: 'Che caffè sei?',
    pt: 'Que café você é?',
    ru: 'Какой ты кофе?',
  },
  desc: {
    ko: '일상 속 12가지 질문, 2분이면 끝. 내 성격과 닮은 커피를 찾아보세요.',
    en: '12 everyday questions, 2 minutes. Find out which coffee matches your personality.',
    ja: '日常の12の質問、2分で完了。あなたの性格に似たコーヒーが見つかります。',
    zh: '12道日常小题，2分钟测出和你性格最像的咖啡。',
    fr: '12 questions du quotidien, 2 minutes. Découvre quel café te ressemble.',
    de: '12 Alltagsfragen, 2 Minuten. Finde heraus, welcher Kaffee zu dir passt.',
    th: 'คำถามชีวิตประจำวัน 12 ข้อ ใช้เวลา 2 นาที รู้เลยว่ากาแฟแก้วไหนเหมือนคุณที่สุด',
    vi: '12 câu hỏi đời thường, 2 phút. Tìm ra ly cà phê giống tính cách bạn nhất.',
    es: '12 preguntas del día a día, 2 minutos. Descubre qué café se parece a tu personalidad.',
    it: '12 domande di tutti i giorni, 2 minuti. Scopri quale caffè somiglia alla tua personalità.',
    pt: '12 perguntas do dia a dia, 2 minutos. Descubra qual café combina com a sua personalidade.',
    ru: '12 житейских вопросов, 2 минуты. Узнай, какой кофе похож на твой характер.',
  },
};
