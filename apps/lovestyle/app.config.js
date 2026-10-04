// lovestyle 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/lovestyle/ 로 바꾼다).
// 스포일러 금지: 설명에 연애 유형(동물) 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'lovestyle',
  emoji: '💘',
  category: 'test',
  added: '2026-10-04',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://lovestyle.example.com/',
  title: {
    ko: '연애 유형 테스트',
    en: 'Love Style Test',
    ja: '恋愛タイプ診断',
    zh: '恋爱类型测试',
    fr: 'Test amoureux',
    de: 'Liebestyp-Test',
    th: 'ทดสอบสไตล์ความรัก',
    vi: 'Trắc nghiệm tình yêu',
    es: 'Test del amor',
    it: 'Test dell’amore',
    pt: 'Teste do amor',
    ru: 'Тест на тип любви',
  },
  desc: {
    ko: '썸부터 데이트, 사소한 다툼까지 10가지 순간으로 알아보는 나의 연애 스타일. 2~3분이면 끝나요.',
    en: '10 little dating moments, 2–3 minutes. Discover what kind of partner you really are, plus your best match.',
    ja: '片思いからデート、ちょっとしたケンカまで。10の場面で分かるあなたの恋愛タイプ。約2〜3分。',
    zh: '从暧昧到约会再到小争吵，10个恋爱小场景，2~3分钟测出你是哪种恋人。',
    fr: '10 petits moments amoureux, 2 à 3 minutes. Découvre quel genre de partenaire tu es vraiment, et ton match idéal.',
    de: '10 kleine Dating-Momente, 2–3 Minuten. Finde heraus, welcher Liebestyp du wirklich bist – und wer am besten zu dir passt.',
    th: '10 สถานการณ์ความรักเล็ก ๆ ใช้เวลา 2–3 นาที รู้เลยว่าเวลามีความรักคุณเป็นแฟนแบบไหน พร้อมคู่ที่เข้ากันที่สุด',
    vi: '10 khoảnh khắc hẹn hò nhỏ, 2–3 phút. Khám phá kiểu người yêu thật sự của bạn và người hợp với bạn nhất.',
    es: '10 momentos de pareja, 2 o 3 minutos. Descubre qué tipo de pareja eres de verdad y con quién haces match.',
    it: '10 piccoli momenti di coppia, 2-3 minuti. Scopri che tipo di partner sei davvero e chi è la tua anima affine.',
    pt: '10 momentos de namoro, 2 a 3 minutos. Descubra que tipo de namorado(a) você é de verdade e quem combina com você.',
    ru: '10 ситуаций из отношений, 2–3 минуты. Узнай, какой ты в любви на самом деле и кто тебе подходит больше всех.',
  },
};
