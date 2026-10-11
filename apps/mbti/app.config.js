// mbti 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/mbti/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 유형(네 글자 코드·별명)·질문을 쓰지 않는다. 비공식 재미 테스트(공식 MBTI® 검사 아님).
module.exports = {
  id: 'mbti',
  emoji: '🧩',
  category: 'test',
  added: '2026-10-12',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://mbti.example.com/',
  title: {
    ko: 'MBTI 테스트',
    en: 'Free MBTI Test',
    ja: 'MBTI診断',
    zh: 'MBTI测试',
    fr: 'Test MBTI gratuit',
    de: 'Kostenloser MBTI-Test',
    th: 'แบบทดสอบ MBTI',
    vi: 'Trắc nghiệm MBTI',
    es: 'Test MBTI gratis',
    it: 'Test MBTI gratis',
    pt: 'Teste MBTI grátis',
    ru: 'Тест MBTI',
  },
  desc: {
    ko: '일상 질문 20개, 3분이면 끝. 16가지 성격유형 중 나는 어떤 유형인지, 축별 비율까지 확인해 보세요.',
    en: '20 everyday statements, 3 minutes. Find your 4-letter type out of 16, with real percentage bars.',
    ja: '日常の20問、3分で完了。16タイプのうち自分はどれか、4つの指標の割合まで分かります。',
    zh: '20道日常小题，3分钟测出你是16型人格中的哪一型，还能看到每个维度的比例。',
    fr: '20 affirmations du quotidien, 3 minutes. Découvre ton type en 4 lettres parmi 16, avec tes pourcentages.',
    de: '20 Alltagsaussagen, 3 Minuten. Finde deinen 4-Buchstaben-Typ von 16 – mit echten Prozentbalken.',
    th: 'ข้อความชีวิตประจำวัน 20 ข้อ ใช้เวลา 3 นาที รู้เลยว่าคุณคือ MBTI แบบไหนใน 16 แบบ พร้อมเปอร์เซ็นต์แต่ละด้าน',
    vi: '20 câu đời thường, 3 phút. Tìm ra nhóm tính cách 4 chữ cái của bạn trong 16 nhóm, kèm tỉ lệ từng cặp.',
    es: '20 frases del día a día, 3 minutos. Descubre tu tipo de 4 letras entre 16, con porcentajes reales.',
    it: '20 frasi di tutti i giorni, 3 minuti. Scopri il tuo tipo di 4 lettere tra 16, con le percentuali.',
    pt: '20 frases do dia a dia, 3 minutos. Descubra seu tipo de 4 letras entre os 16, com porcentagens reais.',
    ru: '20 житейских утверждений, 3 минуты. Узнай свой тип из 4 букв среди 16 — с процентами по каждой шкале.',
  },
};
