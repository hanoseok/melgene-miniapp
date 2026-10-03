// costume 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/costume/ 로 바꾼다).
// 스포일러 금지: 설명에 코스튬 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'costume',
  emoji: '🎭',
  category: 'test',
  added: '2026-10-02',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://costume.example.com/',
  title: {
    ko: '할로윈 코스튬 추천',
    en: 'Halloween Costume Quiz',
    ja: 'ハロウィン仮装診断',
    zh: '万圣节装扮测试',
    fr: 'Quiz déguisement',
    de: 'Halloween-Kostüm-Test',
    th: 'ทดสอบชุดฮาโลวีน',
    vi: 'Test hóa trang Halloween',
    es: 'Test de disfraz de Halloween',
    it: 'Test costume di Halloween',
    pt: 'Teste de fantasia de Halloween',
    ru: 'Тест: какой костюм на Хэллоуин',
  },
  desc: {
    ko: '파티 속 12가지 순간으로 찾는 올해 나의 할로윈 코스튬. 만드는 팁까지 2분이면 끝!',
    en: '12 party moments, about 2 minutes. Find the Halloween costume that fits your personality — with easy DIY tips.',
    ja: 'パーティーの12シーンで、今年のあなたにぴったりの仮装を診断。手作りのコツ付き、約2分。',
    zh: '12个派对小场景，2分钟测出今年最适合你的万圣节装扮，附简单DIY小贴士。',
    fr: '12 moments de soirée, environ 2 minutes. Trouve le déguisement d’Halloween qui colle à ta personnalité, astuces DIY en prime.',
    de: '12 Partymomente, etwa 2 Minuten. Finde das Halloween-Kostüm, das zu deiner Persönlichkeit passt – mit DIY-Tipps.',
    th: '12 สถานการณ์ในปาร์ตี้ 2 นาทีรู้ผล ปีนี้ชุดฮาโลวีนแบบไหนเข้ากับนิสัยคุณที่สุด พร้อมทริคทำเอง',
    vi: '12 khoảnh khắc trong bữa tiệc, khoảng 2 phút. Tìm bộ hóa trang Halloween hợp tính cách bạn, kèm mẹo tự làm.',
    es: '12 momentos de fiesta, unos 2 minutos. Descubre el disfraz de Halloween que va con tu personalidad, con trucos para hacerlo tú.',
    it: '12 momenti di festa, circa 2 minuti. Scopri il costume di Halloween adatto alla tua personalità, con consigli fai-da-te.',
    pt: '12 momentos de festa, uns 2 minutos. Descubra a fantasia de Halloween que combina com você, com dicas para fazer em casa.',
    ru: '12 моментов с вечеринки, пара минут. Узнай, какой костюм на Хэллоуин подходит твоему характеру, — с идеями, как сделать его самому.',
  },
};
