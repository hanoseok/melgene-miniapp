// xmastype 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/xmastype/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안).
module.exports = {
  id: 'xmastype',
  emoji: '🎄',
  category: 'test',
  added: '2026-11-06',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://xmastype.example.com/',
  title: {
    ko: '크리스마스 성격 테스트',
    en: 'Christmas Personality Test',
    ja: 'クリスマス性格診断',
    zh: '圣诞节性格测试',
    fr: 'Test de personnalité de Noël',
    de: 'Weihnachtstyp-Test',
    th: 'แบบทดสอบนิสัยคริสต์มาส',
    vi: 'Test tính cách Noel',
    es: 'Test navideño',
    it: 'Test della personalità di Natale',
    pt: 'Teste de personalidade de Natal',
    ru: 'Новогодний тест личности',
  },
  desc: {
    ko: '연말 일상 질문 12개, 2분이면 끝. 나는 크리스마스의 어떤 상징을 닮았을까? 나의 연말 캐릭터와 찰떡궁합을 재미로 알아봐요.',
    en: '12 holiday-season questions, 2 minutes. Which Christmas symbol matches your personality? Meet your holiday character and your best match, just for fun.',
    ja: '年末の12問、約2分。あなたはクリスマスのどのシンボルに似ている？自分らしいクリスマスキャラと相性ぴったりの相手を気軽にチェック。',
    zh: '12道节日小题，2分钟。你最像哪一个圣诞符号？测出你的圣诞性格角色和最佳搭档，仅供娱乐。',
    fr: '12 questions de fin d’année, 2 minutes. Quel symbole de Noël te ressemble ? Découvre ton personnage des fêtes et ton duo idéal, pour s’amuser.',
    de: '12 Fragen rund um die Feiertage, 2 Minuten. Welches Weihnachtssymbol passt zu dir? Entdecke deine Weihnachtsfigur und dein bestes Match – zum Spaß.',
    th: 'คำถามช่วงเทศกาล 12 ข้อ ใช้เวลา 2 นาที คุณเหมือนสัญลักษณ์คริสต์มาสแบบไหน มาดูคาแรกเตอร์คริสต์มาสของคุณกับคู่ที่เข้ากันที่สุด ทำเล่นสนุก ๆ',
    vi: '12 câu hỏi mùa lễ hội, 2 phút. Bạn giống biểu tượng Giáng sinh nào? Khám phá nhân vật Giáng sinh của bạn và người hợp cạ nhất, cho vui.',
    es: '12 preguntas de temporada navideña, 2 minutos. ¿Qué símbolo de la Navidad se parece a ti? Descubre tu personaje navideño y tu pareja ideal, por diversión.',
    it: '12 domande sulle feste, 2 minuti. Quale simbolo del Natale ti somiglia? Scopri il tuo personaggio natalizio e la tua anima gemella delle feste, per gioco.',
    pt: '12 perguntas de fim de ano, 2 minutos. Qual símbolo do Natal combina com você? Descubra seu personagem natalino e seu par perfeito, só por diversão.',
    ru: '12 праздничных вопросов, 2 минуты. На какой символ Нового года и Рождества ты похож? Узнай своего праздничного персонажа и идеальную пару — для развлечения.',
  },
};
