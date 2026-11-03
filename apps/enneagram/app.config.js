// enneagram 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/enneagram/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안).
module.exports = {
  id: 'enneagram',
  emoji: '🔷',
  category: 'test',
  added: '2026-11-04',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://enneagram.example.com/',
  title: {
    ko: '에니어그램 테스트',
    en: 'Enneagram Test',
    ja: 'エニアグラム診断',
    zh: '九型人格测试',
    fr: 'Test ennéagramme',
    de: 'Enneagramm-Test',
    th: 'แบบทดสอบนพลักษณ์',
    vi: 'Trắc nghiệm Enneagram',
    es: 'Test de eneagrama',
    it: 'Test dell’enneagramma',
    pt: 'Teste de eneagrama',
    ru: 'Тест эннеаграммы',
  },
  desc: {
    ko: '일상 질문 12개, 2분이면 끝. 나를 움직이는 진짜 동기는 뭘까? 9가지 중 내 에니어그램 유형과 성장 팁을 재미로 알아봐요.',
    en: '12 everyday questions, 2 minutes. What really drives you? Find your Enneagram type among nine, plus strengths and growth tips, just for fun.',
    ja: '日常の12問、約2分。あなたを動かす本当の動機は？9つの中からエニアグラムのタイプと成長のヒントを気軽にチェック。',
    zh: '12道日常小题，2分钟。真正驱动你的是什么？在九种类型中找到你的九型人格和成长建议，仅供娱乐。',
    fr: '12 questions du quotidien, 2 minutes. Qu’est-ce qui te motive vraiment ? Découvre ton type parmi neuf et des conseils pour grandir, pour s’amuser.',
    de: '12 Alltagsfragen, 2 Minuten. Was treibt dich wirklich an? Finde deinen Enneagramm-Typ unter neun – mit Stärken und Wachstumstipps, zum Spaß.',
    th: 'คำถามชีวิตประจำวัน 12 ข้อ ใช้เวลา 2 นาที อะไรคือแรงขับเคลื่อนตัวจริงของคุณ ค้นหาลักษณ์ของคุณจาก 9 แบบ ทำเล่นสนุก ๆ',
    vi: '12 câu hỏi đời thường, 2 phút. Điều gì thật sự thúc đẩy bạn? Tìm nhóm Enneagram của bạn trong chín nhóm, kèm mẹo phát triển, cho vui.',
    es: '12 preguntas cotidianas, 2 minutos. ¿Qué te mueve de verdad? Descubre tu tipo de eneagrama entre nueve, con fortalezas y consejos, por diversión.',
    it: '12 domande quotidiane, 2 minuti. Cosa ti spinge davvero? Scopri il tuo tipo di enneagramma tra nove, con punti di forza e consigli, per gioco.',
    pt: '12 perguntas do dia a dia, 2 minutos. O que realmente te move? Descubra seu tipo de eneagrama entre nove, com forças e dicas, por diversão.',
    ru: '12 житейских вопросов, 2 минуты. Что на самом деле тобой движет? Узнай свой тип эннеаграммы из девяти и советы для роста — для развлечения.',
  },
};
