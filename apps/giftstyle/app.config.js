// giftstyle 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/giftstyle/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 이름·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안) — 앱 h1·title 은 검색어 그대로.
// 재미용, 임상·심리 검사 아님.
module.exports = {
  id: 'giftstyle',
  emoji: '🎁',
  category: 'test',
  added: '2026-11-18',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://giftstyle.example.com/',
  title: {
    ko: '선물 스타일 테스트',
    en: 'Gift Giver Test',
    ja: 'プレゼント診断',
    zh: '送礼风格测试',
    fr: 'Ton style cadeau',
    de: 'Geschenke-Typ-Test',
    th: 'สไตล์ให้ของขวัญ',
    vi: 'Phong cách tặng quà',
    es: 'Estilo para regalar',
    it: 'Stile dei regali',
    pt: 'Estilo de presentear',
    ru: 'Какой ты даритель',
  },
  desc: {
    ko: '생일·마니또·연말 속 12가지 선물 순간, 2분이면 나의 선물 스타일을 알 수 있어요. 재미로 보는 테스트예요.',
    en: '12 everyday gift moments, 2 minutes. Birthdays, holidays, Secret Santa: what kind of gift giver are you? Get your gifting style and your own planning score, just for fun.',
    ja: '誕生日やプレゼント交換など12の場面に答えるだけ。約2分であなたの贈り方のスタイルがわかる、お楽しみ診断です。',
    zh: '生日、圣诞、交换礼物中的12个送礼瞬间，约2分钟测出你的送礼风格。仅供娱乐的小测试。',
    fr: '12 moments cadeaux du quotidien, 2 minutes : découvre ta façon d’offrir. Un quiz juste pour s’amuser.',
    de: '12 Geschenk-Momente aus dem Alltag, 2 Minuten: Finde deinen Schenk-Stil heraus. Ein Quiz nur zum Spaß.',
    th: '12 ช่วงเวลาให้ของขวัญ ใช้เวลา 2 นาที มาดูว่าคุณเป็นคนให้ของขวัญสไตล์ไหน เล่นเพื่อความสนุกเท่านั้น',
    vi: '12 khoảnh khắc tặng quà, chỉ 2 phút để biết phong cách tặng quà của bạn. Chơi cho vui thôi nhé!',
    es: '¿Cómo eres cuando regalas? 12 momentos de regalos, 2 minutos, para descubrir tu forma de regalar. Solo para divertirse.',
    it: '12 momenti di regali di tutti i giorni, 2 minuti: scopri il tuo stile nel fare regali. Un quiz solo per gioco.',
    pt: 'Como você é na hora de dar presente? 12 momentos de presente, 2 minutos, para descobrir o seu jeito de presentear. Só por diversão.',
    ru: 'Как ты выбираешь подарки? 12 ситуаций с подарками, 2 минуты — узнай свой стиль дарить. Просто для развлечения.',
  },
};
