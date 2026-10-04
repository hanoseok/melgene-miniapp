// reaction 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/reaction/ 로 바꾼다).
module.exports = {
  id: 'reaction',
  emoji: '⚡',
  category: 'game',
  added: '2026-09-27',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://reaction.example.com/',
  title: {
    ko: '반응속도 테스트',
    en: 'Reaction Time Test',
    ja: '反応速度テスト',
    zh: '反应速度测试',
    fr: 'Test de réflexes',
    de: 'Reaktionstest',
    th: 'ทดสอบความไวในการตอบสนอง',
    vi: 'Kiểm tra tốc độ phản xạ',
    es: 'Test de reflejos',
    it: 'Test di reazione',
    pt: 'Teste de reação',
    ru: 'Тест на реакцию',
  },
  desc: {
    ko: '초록색이 되면 탭! 내 반응속도는 전체에서 상위 몇 %?',
    en: 'Tap when it turns green. How fast are you compared to everyone?',
    ja: '緑になったらタップ！ あなたの反応速度は上位何％？',
    zh: '变绿就点！你的反应速度排在前百分之几？',
    fr: 'Touchez quand ça devient vert. Êtes-vous plus rapide que les autres ?',
    de: 'Tippe, sobald es grün wird. Wie schnell bist du im Vergleich?',
    th: 'แตะเมื่อเป็นสีเขียว! ความไวของคุณอยู่ท็อปกี่เปอร์เซ็นต์?',
    vi: 'Chạm khi màn hình chuyển xanh! Bạn nhanh hơn bao nhiêu phần trăm người chơi?',
    es: 'Toca cuando se ponga verde. ¿Qué tan rápido eres comparado con todos?',
    it: 'Tocca quando diventa verde. Quanto sei veloce rispetto agli altri?',
    pt: 'Toque quando ficar verde. Você é mais rápido que os outros?',
    ru: 'Нажми, когда станет зелёным. Насколько ты быстрее остальных?',
  },
};
