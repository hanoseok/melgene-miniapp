// partytype 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/partytype/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안) — 앱 h1·title 은 검색어 그대로.
// 재미용, 임상·심리 검사 아님.
module.exports = {
  id: 'partytype',
  emoji: '🎉',
  category: 'test',
  added: '2026-11-16',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://partytype.example.com/',
  title: {
    ko: '파티 유형 테스트',
    en: 'Party Personality Test',
    ja: 'パーティータイプ診断',
    zh: '派对人格测试',
    fr: 'Test : quel fêtard es-tu',
    de: 'Party-Typ-Test',
    th: 'แบบทดสอบสายปาร์ตี้',
    vi: 'Bạn là kiểu người đi tiệc nào',
    es: 'Test de tipo fiestero',
    it: 'Test che festaiolo sei',
    pt: 'Teste de tipo festeiro',
    ru: 'Какой ты на вечеринке',
  },
  desc: {
    ko: '송년회, 생일파티, 홈파티의 흔한 장면 12개, 2분이면 끝. 모임에서 나는 어떤 역할일까? 나의 파티 유형과 내 답으로 계산한 파티 에너지 점수를 재미로 알아봐요.',
    en: '12 moments at a get-together, 2 minutes. Holiday parties, birthdays, game nights: what kind of guest are you? Get your party personality and your own party energy score, just for fun.',
    ja: '忘年会や誕生日会でよくある場面12問、約2分。集まりでのあなたの役割は？自分の回答から出るパーティーエネルギーと、あなたのパーティータイプを気軽に診断。',
    zh: '年会、生日聚会、朋友局里的12个常见场景，2分钟。在聚会上你是哪种人？测出你的派对人格和由自己答案算出的派对能量值，仅供娱乐。',
    fr: '12 moments de soirée, 2 minutes. Réveillon, anniversaire, soirée jeux : quel genre d’invité es-tu ? Découvre ta personnalité de fête et ton score d’énergie festive, pour s’amuser.',
    de: '12 Partymomente, 2 Minuten. Weihnachtsfeier, Geburtstag, Spieleabend: Was für ein Gast bist du? Entdecke deinen Party-Typ und deinen eigenen Partyenergie-Wert – zum Spaß.',
    th: '12 สถานการณ์ในงานปาร์ตี้ ใช้เวลา 2 นาที ปาร์ตี้ปีใหม่ วันเกิด งานเลี้ยงบริษัท คุณเป็นแขกแบบไหน มาดูสายปาร์ตี้และพลังปาร์ตี้ของคุณ ทำเล่นสนุก ๆ',
    vi: '12 khoảnh khắc trong buổi tiệc, 2 phút. Tiệc tất niên, sinh nhật, liên hoan: bạn là kiểu khách nào? Xem tính cách khi đi tiệc và điểm năng lượng tiệc của bạn, cho vui.',
    es: '12 momentos de fiesta, 2 minutos. Cena de empresa, cumpleaños, noche de juegos: ¿qué tipo de invitado eres? Descubre tu personalidad fiestera y tu energía de fiesta, por diversión.',
    it: '12 momenti di festa, 2 minuti. Cenone, compleanno, serata giochi: che tipo di invitato sei? Scopri la tua personalità alle feste e il tuo punteggio di energia, per gioco.',
    pt: '12 momentos de festa, 2 minutos. Confraternização, aniversário, noite de jogos: que tipo de convidado você é? Descubra sua personalidade na festa e sua energia festeira, só por diversão.',
    ru: '12 моментов на вечеринке, 2 минуты. Корпоратив, день рождения, игровой вечер — какой ты гость? Узнай свой тип и свой уровень тусовочной энергии — для развлечения.',
  },
};
