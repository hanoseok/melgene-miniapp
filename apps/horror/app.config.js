// horror 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/horror/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 캐릭터 이름·상황 질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안).
module.exports = {
  id: 'horror',
  emoji: '🎃',
  category: 'test',
  added: '2026-10-25',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://horror.example.com/',
  title: {
    ko: '공포영화 생존 테스트',
    en: 'Horror Survival Test',
    ja: 'ホラー映画 生存診断',
    zh: '恐怖片生存测试',
    fr: 'Test de survie film d’horreur',
    de: 'Horrorfilm-Überlebenstest',
    th: 'แบบทดสอบรอดในหนังสยองขวัญ',
    vi: 'Test sống sót phim kinh dị',
    es: 'Test de supervivencia de terror',
    it: 'Test di sopravvivenza horror',
    pt: 'Sobrevivência no terror',
    ru: 'Выживешь в фильме ужасов?',
  },
  desc: {
    ko: '공포영화 단골 장면 11개, 2분이면 끝. 공포영화 속 나는 어떤 캐릭터이고 엔딩까지 살아남을까요? 재미로 해 보세요.',
    en: '11 classic horror-movie scenes, 2 minutes. Which character would you be, and would you make it to the credits? Just for fun.',
    ja: 'ホラー映画おなじみの11シーン、約2分。映画の中のあなたはどんなキャラ？エンドロールまで生き残れる？お遊び診断です。',
    zh: '11个恐怖片经典场景，2分钟。恐怖片里的你会是哪种角色？能活到片尾字幕吗？仅供娱乐。',
    fr: '11 scènes cultes de films d’horreur, 2 minutes. Quel personnage serais-tu, et tiendrais-tu jusqu’au générique ? Juste pour rire.',
    de: '11 typische Horrorfilm-Szenen, 2 Minuten. Welche Rolle hättest du, und schaffst du es bis zum Abspann? Nur zum Spaß.',
    th: '11 ฉากคลาสสิกในหนังสยองขวัญ ใช้เวลา 2 นาที ในหนังผีคุณจะเป็นตัวละครแบบไหน และจะรอดถึงเครดิตท้ายเรื่องไหม? ทำเล่นๆ ขำๆ',
    vi: '11 cảnh kinh điển trong phim kinh dị, 2 phút. Trong phim bạn sẽ là nhân vật nào và có sống tới đoạn kết không? Chỉ để vui.',
    es: '11 escenas clásicas de películas de terror, 2 minutos. ¿Qué personaje serías y llegarías vivo a los créditos? Solo por diversión.',
    it: '11 scene classiche dei film horror, 2 minuti. Che personaggio saresti e arriveresti vivo ai titoli di coda? Solo per gioco.',
    pt: '11 cenas clássicas de filme de terror, 2 minutos. Que personagem você seria e chegaria vivo aos créditos? Só por diversão.',
    ru: '11 классических сцен из фильмов ужасов, 2 минуты. Каким персонажем ты был бы и дожил бы до титров? Просто для развлечения.',
  },
};
