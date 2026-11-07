// brain 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/brain/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안) — 앱 h1·title 은 검색어 그대로.
// 정직하게: 좌뇌·우뇌 "우세"는 속설이고, 이 테스트는 생각 습관의 선호를 재미로 본다.
module.exports = {
  id: 'brain',
  emoji: '🧠',
  category: 'test',
  added: '2026-11-08',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://brain.example.com/',
  title: {
    ko: '좌뇌 우뇌 테스트',
    en: 'Left or Right Brain Test',
    ja: '右脳左脳診断',
    zh: '左脑右脑测试',
    fr: 'Cerveau gauche/droit',
    de: 'Linkshirn Rechtshirn Test',
    th: 'สมองซีกซ้ายหรือขวา',
    vi: 'Test não trái hay phải',
    es: 'Test de hemisferios',
    it: 'Test degli emisferi',
    pt: 'Teste dos hemisférios',
    ru: 'Тест на полушария мозга',
  },
  desc: {
    ko: '일상 질문 12개, 2분이면 끝. 따져 보는 쪽일까, 느낌을 따르는 쪽일까? 나의 좌뇌식·우뇌식 생각 습관 비율과 나를 닮은 뇌 캐릭터를 재미로 알아봐요.',
    en: '12 everyday questions, 2 minutes. Logic or intuition, plans or flow? See your left/right thinking-style balance and the brain character that fits you, just for fun.',
    ja: '日常の12問、約2分。理屈派？それとも直感派？あなたの左脳タイプ・右脳タイプの思考バランスと、ぴったりの脳キャラを気軽に診断。',
    zh: '12道日常小题，2分钟。你更讲逻辑还是更凭直觉？测出你的左脑式·右脑式思维比例和专属大脑角色，仅供娱乐。',
    fr: '12 questions du quotidien, 2 minutes. Logique ou intuition, plans ou spontanéité ? Découvre ton équilibre de style de pensée gauche/droite et ton personnage cerveau, pour s’amuser.',
    de: '12 Alltagsfragen, 2 Minuten. Logik oder Bauchgefühl, Plan oder spontan? Entdecke deine Links-rechts-Balance beim Denkstil und deine Gehirn-Figur – zum Spaß.',
    th: 'คำถามชีวิตประจำวัน 12 ข้อ ใช้เวลา 2 นาที คุณใช้เหตุผลหรือใช้ความรู้สึก มาดูสัดส่วนสไตล์ความคิดแบบสมองซีกซ้ายและซีกขวา พร้อมคาแรกเตอร์สมองของคุณ ทำเล่นสนุก ๆ',
    vi: '12 câu hỏi đời thường, 2 phút. Lý trí hay trực giác, kế hoạch hay ngẫu hứng? Xem tỷ lệ phong cách tư duy não trái/não phải và nhân vật bộ não của bạn, cho vui.',
    es: '12 preguntas cotidianas, 2 minutos. ¿Lógica o intuición, plan o espontaneidad? Descubre tu equilibrio de estilo de pensamiento izquierdo/derecho y tu personaje cerebral, por diversión.',
    it: '12 domande di tutti i giorni, 2 minuti. Logica o intuito, piani o istinto? Scopri il tuo equilibrio di stile di pensiero sinistro/destro e il tuo personaggio cervello, per gioco.',
    pt: '12 perguntas do dia a dia, 2 minutos. Lógica ou intuição, plano ou improviso? Descubra seu equilíbrio de estilo de pensamento esquerdo/direito e seu personagem cérebro, só por diversão.',
    ru: '12 бытовых вопросов, 2 минуты. Логика или интуиция, план или импровизация? Узнай баланс своего стиля мышления «левое/правое полушарие» и своего персонажа-мозг — для развлечения.',
  },
};
