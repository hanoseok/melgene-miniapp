// job 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/job/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·추천 직업·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안).
module.exports = {
  id: 'job',
  emoji: '💼',
  category: 'test',
  added: '2026-10-31',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://job.example.com/',
  title: {
    ko: '직업 적성 테스트',
    en: 'Career Personality Test',
    ja: '適職診断',
    zh: '职业性格测试',
    fr: 'Test d’orientation métier',
    de: 'Berufstest',
    th: 'แบบทดสอบอาชีพ',
    vi: 'Test nghề nghiệp',
    es: 'Test vocacional',
    it: 'Test attitudinale lavoro',
    pt: 'Teste vocacional',
    ru: 'Тест на профориентацию',
  },
  desc: {
    ko: '가벼운 질문 11개, 2분이면 끝. 나는 어떤 방식으로 일할 때 빛날까? 내 일 스타일과 어울리는 직업을 재미로 알아봐요.',
    en: '11 light questions, 2 minutes. How do you work best, and which jobs might suit your style? A fun career personality test.',
    ja: 'かんたんな11問、約2分。あなたが輝く働き方と、向いていそうな仕事は？気軽に楽しむ適職診断です。',
    zh: '11道轻松小题，2分钟。你在什么样的工作方式里最闪光？看看适合你的职业，仅供娱乐。',
    fr: '11 petites questions, 2 minutes. Comment aimes-tu travailler, et quels métiers pourraient te correspondre ? Un test pour s’amuser.',
    de: '11 leichte Fragen, 2 Minuten. Wie arbeitest du am liebsten – und welche Berufe könnten zu dir passen? Ein Test zum Spaß.',
    th: 'คำถามง่าย ๆ 11 ข้อ ใช้เวลา 2 นาที คุณเปล่งประกายเมื่อทำงานแบบไหน และอาชีพไหนน่าจะเข้ากับคุณ ทำเล่นสนุก ๆ',
    vi: '11 câu hỏi nhẹ nhàng, 2 phút. Bạn làm việc tốt nhất theo cách nào và nghề nào có thể hợp với bạn? Chỉ để vui.',
    es: '11 preguntas ligeras, 2 minutos. ¿Cómo trabajas mejor y qué profesiones podrían encajar contigo? Un test vocacional para divertirse.',
    it: '11 domande leggere, 2 minuti. Come lavori al meglio e quali mestieri potrebbero fare per te? Un test per divertirsi.',
    pt: '11 perguntas leves, 2 minutos. Como você trabalha melhor e quais profissões podem combinar com você? Um teste vocacional por diversão.',
    ru: '11 лёгких вопросов, 2 минуты. Как тебе лучше всего работается и какие профессии могут тебе подойти? Тест для развлечения.',
  },
};
