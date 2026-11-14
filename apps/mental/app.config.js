// mental 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/mental/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안) — 앱 h1·title 은 검색어 그대로.
// 재미용, 임상·심리 검사 아님.
module.exports = {
  id: 'mental',
  emoji: '🛡️',
  category: 'test',
  added: '2026-11-14',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://mental.example.com/',
  title: {
    ko: '멘탈 강도 테스트',
    en: 'Mental Strength Test',
    ja: 'メンタル強度診断',
    zh: '心理韧性测试',
    fr: 'Test de force mentale',
    de: 'Mentale Stärke Test',
    th: 'ทดสอบความแกร่งทางใจ',
    vi: 'Sức mạnh tinh thần',
    es: 'Fortaleza mental',
    it: 'Forza mentale',
    pt: 'Força mental',
    ru: 'Сила духа',
  },
  desc: {
    ko: '일상 속 작은 위기 12개, 2분이면 끝. 늦잠, 잔소리, 갑자기 취소된 약속 앞에서 나는 얼마나 단단할까? 나의 멘탈 점수와 나를 닮은 재료 캐릭터를 재미로 알아봐요.',
    en: '12 everyday mini-crises, 2 minutes. Missed alarms, harsh feedback, canceled plans: how tough is your mind? Get your own mental strength score and the material that matches you, just for fun.',
    ja: '日常のピンチ12問、約2分。寝坊、ダメ出し、ドタキャン…あなたのメンタルはどれくらい強い？自分の回答から出るメンタル強度スコアと、あなたに似た「素材」キャラを気軽に診断。',
    zh: '12个日常小危机，2分钟。闹钟没响、被挑毛病、计划临时取消，你的内心有多抗压？测出你的心理韧性分数和专属“材料”角色，仅供娱乐。',
    fr: '12 petites galères du quotidien, 2 minutes. Réveil raté, critique sèche, plan annulé : ton mental tient-il le coup ? Découvre ton score de force mentale et la matière qui te ressemble, pour s’amuser.',
    de: '12 kleine Alltagskrisen, 2 Minuten. Verschlafen, harte Kritik, abgesagte Pläne: Wie stark ist deine Psyche? Hol dir deinen Mentale-Stärke-Wert und das Material, das zu dir passt – zum Spaß.',
    th: 'วิกฤตเล็ก ๆ ในชีวิตประจำวัน 12 ข้อ ใช้เวลา 2 นาที ตื่นสาย โดนติ แผนล่ม ใจคุณแกร่งแค่ไหน มาดูคะแนนความแข็งแกร่งทางจิตใจและวัสดุที่เหมือนคุณ ทำเล่นสนุก ๆ',
    vi: '12 tình huống “xui” đời thường, 2 phút. Lỡ báo thức, bị chê, kèo bị hủy: tinh thần bạn vững cỡ nào? Xem điểm sức mạnh tinh thần và “chất liệu” giống bạn, cho vui.',
    es: '12 mini crisis cotidianas, 2 minutos. Alarma que no suena, críticas, planes cancelados: ¿qué tan fuerte es tu mente? Descubre tu puntaje de fortaleza mental y el material que te representa, por diversión.',
    it: '12 piccole crisi quotidiane, 2 minuti. Sveglia mancata, critiche, piani saltati: quanto è forte la tua mente? Scopri il tuo punteggio di forza mentale e il materiale che ti somiglia, per gioco.',
    pt: '12 perrengues do dia a dia, 2 minutos. Despertador que não tocou, crítica, rolê cancelado: quão forte é a sua mente? Descubra sua pontuação de força mental e o material que combina com você, só por diversão.',
    ru: '12 бытовых мини-кризисов, 2 минуты. Проспал, раскритиковали, планы сорвались — насколько крепка твоя психика? Узнай свой балл силы духа и материал, на который ты похож, — для развлечения.',
  },
};
