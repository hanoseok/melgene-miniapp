// teto 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/teto/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 유형 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'teto',
  emoji: '⚡',
  category: 'test',
  added: '2026-10-16',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://teto.example.com/',
  title: {
    ko: '테토 에겐 테스트',
    en: 'Teto or Egen Test',
    ja: 'テトエゲン診断',
    zh: '泰托埃根测试',
    fr: 'Test Teto ou Egen',
    de: 'Teto-oder-Egen-Test',
    th: 'แบบทดสอบ Teto Egen',
    vi: 'Test Teto hay Egen',
    es: 'Test Teto o Egen',
    it: 'Test Teto o Egen',
    pt: 'Teste Teto ou Egen',
    ru: 'Тест Тето или Эген',
  },
  desc: {
    ko: '나는 테토일까 에겐일까? 일상 상황 12개, 2분이면 끝. 내 답으로 계산한 테토 % vs 에겐 % 까지 확인해 보세요.',
    en: 'Bold teto or gentle egen? 12 everyday moments, 2 minutes. See your own teto vs egen energy mix.',
    ja: 'あなたはテト？それともエゲン？日常の12シーン、2分で完了。自分の答えから出るテト％とエゲン％もチェック。',
    zh: '你是泰托（Teto）还是埃根（Egen）？12个日常情境，2分钟测出你的能量比例。',
    fr: 'Plutôt teto audacieux ou egen tout en douceur ? 12 moments du quotidien, 2 minutes. Découvre ton mélange d’énergies.',
    de: 'Eher mutiges Teto oder sanftes Egen? 12 Alltagsmomente, 2 Minuten. Finde deinen Energie-Mix heraus.',
    th: 'คุณเป็นสาย Teto หรือ Egen? 12 สถานการณ์ในชีวิตประจำวัน ใช้เวลา 2 นาที ดูสัดส่วนพลังงานของคุณ',
    vi: 'Bạn là Teto mạnh mẽ hay Egen dịu dàng? 12 tình huống đời thường, 2 phút. Xem tỷ lệ năng lượng của bạn.',
    es: '¿Teto atrevido o Egen sensible? 12 momentos cotidianos, 2 minutos. Descubre tu mezcla de energías.',
    it: 'Teto deciso o Egen gentile? 12 momenti di vita quotidiana, 2 minuti. Scopri il tuo mix di energie.',
    pt: 'Teto ousado ou Egen sensível? 12 momentos do dia a dia, 2 minutos. Descubra sua mistura de energias.',
    ru: 'Ты Тето или Эген? 12 жизненных ситуаций, 2 минуты. Узнай свой баланс энергии.',
  },
};
