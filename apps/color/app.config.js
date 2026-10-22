// color 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/color/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 유형 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'color',
  emoji: '🎨',
  category: 'test',
  added: '2026-10-23',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://color.example.com/',
  title: {
    ko: '퍼스널 컬러 테스트',
    en: 'Personal Color Test',
    ja: 'パーソナルカラー診断',
    zh: '个人色彩测试',
    fr: 'Test de colorimétrie',
    de: 'Farbtyp-Test',
    th: 'ทดสอบ Personal Color',
    vi: 'Test màu cá nhân',
    es: 'Test de colorimetría',
    it: 'Test di armocromia',
    pt: 'Teste de coloração pessoal',
    ru: 'Тест на цветотип',
  },
  desc: {
    ko: '거울 앞에서 답하는 12문항으로 웜톤·쿨톤과 나에게 맞는 컬러 팔레트를 찾아요. 2분이면 끝나요.',
    en: '12 mirror-check questions, about 2 minutes. Warm or cool? Find the palette that makes you glow.',
    ja: '鏡の前で答える12問で、イエベかブルベか、似合う色のパレットを診断。約2分。',
    zh: '对着镜子回答12个问题，2分钟测出你是暖皮还是冷皮，找到适合你的色彩。',
    fr: '12 questions devant le miroir, environ 2 minutes. Chaud ou froid ? Trouve ta palette.',
    de: '12 Fragen vor dem Spiegel, etwa 2 Minuten. Warm oder kühl? Finde deine Farbpalette.',
    th: '12 คำถามที่เช็คได้หน้ากระจก ประมาณ 2 นาที ผิวโทนร้อนหรือโทนเย็น? หาพาเลตสีที่ใช่',
    vi: '12 câu hỏi soi gương, khoảng 2 phút. Tông ấm hay tông lạnh? Tìm bảng màu hợp với bạn.',
    es: '12 preguntas frente al espejo, unos 2 minutos. ¿Cálida o fría? Descubre tu paleta.',
    it: '12 domande davanti allo specchio, circa 2 minuti. Calda o fredda? Scopri la tua palette.',
    pt: '12 perguntas na frente do espelho, cerca de 2 minutos. Quente ou fria? Descubra sua cartela.',
    ru: '12 вопросов у зеркала, около 2 минут. Тёплый или холодный? Найди свою палитру.',
  },
};
