// homebody 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/homebody/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 유형 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'homebody',
  emoji: '🏠',
  category: 'test',
  added: '2026-10-21',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://homebody.example.com/',
  title: {
    ko: '집순이·집돌이 테스트',
    en: 'Homebody Test',
    ja: '引きこもり度診断',
    zh: '宅度测试',
    fr: 'Test casanier',
    de: 'Stubenhocker-Test',
    th: 'ทดสอบสายติดบ้าน',
    vi: 'Trắc nghiệm mê ở nhà',
    es: 'Test de hogareño',
    it: 'Test da pantofolaio',
    pt: 'Teste de caseiro',
    ru: 'Тест на домоседа',
  },
  desc: {
    ko: '일상 속 10가지 상황으로 알아보는 나의 집콕 지수(%). 1분이면 끝나요.',
    en: '10 everyday situations, about 1 minute. How homebody are you, in percent?',
    ja: '日常の10シーンで、あなたのインドア度を%で診断。約1分でわかります。',
    zh: '10个日常场景，1分钟测出你的宅度是多少百分比。',
    fr: '10 situations du quotidien, environ 1 minute. À quel point es-tu casanier, en % ?',
    de: '10 Alltagssituationen, etwa 1 Minute. Wie sehr bist du Stubenhocker, in Prozent?',
    th: '10 สถานการณ์ในชีวิตประจำวัน 1 นาทีรู้ผล คุณติดบ้านกี่เปอร์เซ็นต์?',
    vi: '10 tình huống đời thường, khoảng 1 phút. Bạn ghiền nhà bao nhiêu phần trăm?',
    es: '10 situaciones del día a día, 1 minuto aprox. ¿Cuánto de hogareño eres, en %?',
    it: '10 situazioni di tutti i giorni, circa 1 minuto. Quanto sei pantofolaio, in percentuale?',
    pt: '10 situações do dia a dia, cerca de 1 minuto. Quanto você é caseiro, em %?',
    ru: '10 житейских ситуаций, около минуты. Насколько ты домосед, в процентах?',
  },
};
