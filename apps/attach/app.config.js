// attach 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/attach/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안).
module.exports = {
  id: 'attach',
  emoji: '🫂',
  category: 'test',
  added: '2026-11-02',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://attach.example.com/',
  title: {
    ko: '애착 유형 테스트',
    en: 'Attachment Style Test',
    ja: '愛着スタイル診断',
    zh: '依恋类型测试',
    fr: 'Test d’attachement',
    de: 'Bindungstyp-Test',
    th: 'แบบทดสอบรูปแบบความผูกพัน',
    vi: 'Trắc nghiệm kiểu gắn bó',
    es: 'Test de estilo de apego',
    it: 'Test di attaccamento',
    pt: 'Teste de estilo de apego',
    ru: 'Тест на тип привязанности',
  },
  desc: {
    ko: '친구·가족·연인과의 일상 질문 11개, 2분이면 끝. 나는 사람과 어떻게 가까워질까? 내 애착 유형과 관계 팁을 재미로 알아봐요.',
    en: '11 everyday questions about friends, family and partners, 2 minutes. How do you bond with people? Discover your attachment style, just for fun.',
    ja: '友だち・家族・恋人との日常の11問、約2分。あなたは人とどう距離を縮める？愛着スタイルと関係のヒントを気軽にチェック。',
    zh: '关于朋友、家人和伴侣的11道日常小题，2分钟。你是怎样和人亲近的？测测你的依恋类型，仅供娱乐。',
    fr: '11 questions du quotidien sur les amis, la famille et le couple, 2 minutes. Comment tisses-tu des liens ? Découvre ton style d’attachement, pour s’amuser.',
    de: '11 Alltagsfragen zu Freunden, Familie und Partnerschaft, 2 Minuten. Wie gehst du Nähe ein? Entdecke deinen Bindungstyp – zum Spaß.',
    th: 'คำถามชีวิตประจำวัน 11 ข้อ เรื่องเพื่อน ครอบครัว และคนรัก ใช้เวลา 2 นาที คุณผูกพันกับคนอื่นแบบไหน ทำเล่นสนุก ๆ',
    vi: '11 câu hỏi đời thường về bạn bè, gia đình và người yêu, 2 phút. Bạn gắn bó với mọi người ra sao? Khám phá cho vui.',
    es: '11 preguntas cotidianas sobre amigos, familia y pareja, 2 minutos. ¿Cómo creas vínculos? Descubre tu estilo de apego, solo por diversión.',
    it: '11 domande quotidiane su amici, famiglia e partner, 2 minuti. Come crei legami? Scopri il tuo stile di attaccamento, per gioco.',
    pt: '11 perguntas do dia a dia sobre amigos, família e parceiros, 2 minutos. Como você cria vínculos? Descubra seu estilo de apego, por diversão.',
    ru: '11 житейских вопросов о друзьях, семье и партнёрах, 2 минуты. Как ты сближаешься с людьми? Узнай свой тип привязанности — для развлечения.',
  },
};
