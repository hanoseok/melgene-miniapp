// animal 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/animal/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 동물 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'animal',
  emoji: '🦊',
  category: 'test',
  added: '2026-10-06',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://animal.example.com/',
  title: {
    ko: '나와 닮은 동물 테스트',
    en: 'Which Animal Are You?',
    ja: '動物診断',
    zh: '你是什么动物测试',
    fr: 'Quel animal es-tu ?',
    de: 'Welches Tier bist du?',
    th: 'ทดสอบสัตว์ที่ใช่คุณ',
    vi: 'Bạn là con vật nào?',
    es: '¿Qué animal eres?',
    it: 'Che animale sei?',
    pt: 'Que animal você é?',
    ru: 'Какое ты животное?',
  },
  desc: {
    ko: '약속 취소, 한밤중 전화, 낯선 파티까지 8가지 순간으로 알아보는 나와 닮은 동물. 2~3분이면 끝나요.',
    en: '8 everyday moments, 2–3 minutes. Find the animal that matches your personality, plus your best match.',
    ja: '予定のドタキャンから真夜中の電話まで、8つの場面で分かるあなたに似た動物。約2〜3分。',
    zh: '从临时放鸽子到半夜来电，8个日常小场景，2~3分钟测出和你最像的动物。',
    fr: '8 petits moments du quotidien, 2 à 3 minutes. Découvre l’animal qui te ressemble, et ton match idéal.',
    de: '8 Alltagsmomente, 2–3 Minuten. Finde das Tier, das zu deiner Persönlichkeit passt – und dein perfektes Match.',
    th: '8 สถานการณ์ในชีวิตประจำวัน ใช้เวลา 2–3 นาที รู้เลยว่าคุณคล้ายสัตว์อะไรที่สุด พร้อมคู่ที่เข้ากัน',
    vi: '8 khoảnh khắc đời thường, 2–3 phút. Tìm con vật giống tính cách bạn nhất và người hợp với bạn nhất.',
    es: '8 momentos cotidianos, 2 o 3 minutos. Descubre qué animal se parece a tu personalidad y con quién haces match.',
    it: '8 momenti quotidiani, 2-3 minuti. Scopri quale animale somiglia alla tua personalità e chi è la tua anima affine.',
    pt: '8 momentos do dia a dia, 2 a 3 minutos. Descubra qual animal combina com sua personalidade e quem é seu par ideal.',
    ru: '8 житейских ситуаций, 2–3 минуты. Узнай, на какое животное ты похож и кто тебе подходит больше всех.',
  },
};
