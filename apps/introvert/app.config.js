// introvert 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/introvert/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안) — 앱 h1·title 은 검색어 그대로.
// mbti 앱과 겹치지 않게: 성격 유형 글자가 아니라 사회적 에너지의 스펙트럼(내향↔외향). 재미용, 임상 검사 아님.
module.exports = {
  id: 'introvert',
  emoji: '🔌',
  category: 'test',
  added: '2026-11-10',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://introvert.example.com/',
  title: {
    ko: '내향형 외향형 테스트',
    en: 'Introvert or Extrovert Test',
    ja: '内向型 外向型 診断',
    zh: '内向外向测试',
    fr: 'Introverti ou extraverti',
    de: 'Intro- oder extrovertiert',
    th: 'อินโทรเวิร์ต เอ็กซ์โทรเวิร์ต',
    vi: 'Hướng nội hay hướng ngoại',
    es: 'Intro o extrovertido',
    it: 'Introverso o estroverso',
    pt: 'Intro ou extrovertido',
    ru: 'Интро или экстраверт',
  },
  desc: {
    ko: '일상 상황 12개, 2분이면 끝. 혼자 있을 때 충전될까, 사람들 속에서 충전될까? 내향과 외향 사이 나의 위치와 나를 닮은 에너지 캐릭터를 재미로 알아봐요.',
    en: '12 everyday situations, 2 minutes. Do you recharge alone or with people? See where you sit between introvert and extrovert and the social energy character that fits you, just for fun.',
    ja: '日常の12シーン、約2分。ひとり時間で充電する？それとも人といると元気になる？内向型と外向型のあいだのあなたの位置と、ぴったりのエネルギーキャラを気軽に診断。',
    zh: '12个日常场景，2分钟。你是独处充电，还是和人在一起才有电？测出你在内向与外向之间的位置和专属能量角色，仅供娱乐。',
    fr: '12 situations du quotidien, 2 minutes. Tu te ressources seul ou entouré ? Découvre ta place entre introverti et extraverti et ton personnage d’énergie sociale, pour s’amuser.',
    de: '12 Alltagssituationen, 2 Minuten. Tankst du allein auf oder unter Menschen? Finde heraus, wo du zwischen introvertiert und extrovertiert stehst – und deine Energie-Figur, zum Spaß.',
    th: 'สถานการณ์ในชีวิตประจำวัน 12 ข้อ ใช้เวลา 2 นาที คุณชาร์จพลังตอนอยู่คนเดียวหรือตอนอยู่กับผู้คน มาดูว่าคุณอยู่ตรงไหนระหว่างอินโทรเวิร์ตกับเอ็กซ์โทรเวิร์ต ทำเล่นสนุก ๆ',
    vi: '12 tình huống đời thường, 2 phút. Bạn nạp năng lượng khi ở một mình hay khi ở cạnh mọi người? Xem vị trí của bạn giữa hướng nội và hướng ngoại, cho vui.',
    es: '12 situaciones cotidianas, 2 minutos. ¿Recargas energía a solas o con gente? Descubre dónde estás entre introvertido y extrovertido y tu personaje de energía social, por diversión.',
    it: '12 situazioni di tutti i giorni, 2 minuti. Ti ricarichi da solo o in compagnia? Scopri dove ti trovi tra introverso ed estroverso e il tuo personaggio di energia sociale, per gioco.',
    pt: '12 situações do dia a dia, 2 minutos. Você recarrega sozinho ou com gente por perto? Descubra onde você está entre introvertido e extrovertido e seu personagem de energia social, só por diversão.',
    ru: '12 бытовых ситуаций, 2 минуты. Ты заряжаешься в одиночестве или среди людей? Узнай, где ты между интровертом и экстравертом, и своего персонажа социальной энергии — для развлечения.',
  },
};
