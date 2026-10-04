// aura 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/aura/ 로 바꾼다).
// 스포일러 금지: 설명에 오라 색 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'aura',
  emoji: '🔮',
  category: 'test',
  added: '2026-09-30',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://aura.example.com/',
  title: {
    ko: '오라 컬러 테스트',
    en: 'Aura Color Test',
    ja: 'オーラ診断',
    zh: '气场颜色测试',
    fr: 'Test couleur d’aura',
    de: 'Aura-Farben-Test',
    th: 'ทดสอบสีออร่า',
    vi: 'Test màu aura',
    es: 'Test de aura',
    it: 'Test dell’aura',
    pt: 'Teste da aura',
    ru: 'Тест на цвет ауры',
  },
  desc: {
    ko: '일상 속 12가지 순간으로 알아보는 나의 오라 색깔. 2분이면 끝나요.',
    en: '12 everyday moments, about 2 minutes. What color is the glow your energy gives off?',
    ja: '日常の12のシーンで、あなたのオーラカラーを診断。約2分でわかります。',
    zh: '12个日常小场景，2分钟测出你的气场是什么颜色。',
    fr: '12 petits moments du quotidien, environ 2 minutes. De quelle couleur est ton aura ?',
    de: '12 Alltagsmomente, etwa 2 Minuten. Welche Farbe hat deine Aura?',
    th: '12 สถานการณ์ในชีวิตประจำวัน 2 นาทีรู้ผล ออร่าของคุณสีอะไร?',
    vi: '12 khoảnh khắc thường ngày, khoảng 2 phút. Hào quang của bạn có màu gì?',
    es: '12 momentos del día a día, unos 2 minutos. ¿De qué color es tu aura?',
    it: '12 momenti di tutti i giorni, circa 2 minuti. Di che colore è la tua aura?',
    pt: '12 momentos do dia a dia, uns 2 minutos. Qual é a cor da sua aura?',
    ru: '12 житейских ситуаций, пара минут. Какого цвета твоя аура?',
  },
};
