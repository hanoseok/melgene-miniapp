// lunch 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/lunch/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'lunch',
  emoji: '🍽️',
  category: 'vote',
  added: '2026-10-03',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://lunch.example.com/',
  title: {
    ko: '오늘 뭐 먹지',
    en: 'What Should I Eat?',
    ja: '今日のご飯 何食べる',
    zh: '今天吃什么',
    fr: 'On mange quoi\u202f?',
    de: 'Was esse ich heute?',
    th: 'วันนี้กินอะไรดี',
    vi: 'Hôm nay ăn gì',
    es: '¿Qué como hoy?',
    it: 'Cosa mangio oggi?',
    pt: 'O que comer hoje?',
    ru: 'Что съесть сегодня?',
  },
  desc: {
    ko: '아침·점심·저녁·야식과 기분만 고르고 슬롯머신 릴을 돌려 메뉴를 뽑아요. 마음에 안 드는 메뉴는 제외하고 다시 뽑기.',
    en: 'Pick a meal and a mood, spin the slot-machine reels and get a dish to eat. Skip what you don’t like and spin again.',
    ja: '朝・昼・夜・夜食と気分を選んでスロットを回すだけ。食べたくないメニューは除外して、もう一度回せます。',
    zh: '选好早餐、午餐、晚餐或宵夜和心情，转动老虎机就能抽到今天吃什么。不想吃的可以排除后重抽。',
    fr: 'Choisis le repas et l’humeur, fais tourner les rouleaux et découvre quoi manger. Écarte un plat et relance.',
    de: 'Mahlzeit und Stimmung wählen, die Walzen drehen und ein Gericht bekommen. Unliebsames überspringen und neu drehen.',
    th: 'เลือกมื้อและอารมณ์ แล้วหมุนสล็อตเพื่อสุ่มเมนูอาหาร ไม่อยากกินอะไรก็ตัดออกแล้วหมุนใหม่ได้',
    vi: 'Chọn bữa và tâm trạng rồi quay cuộn máy xèng để ra món ăn. Món không thích thì loại ra và quay lại.',
    es: 'Elige la comida y el ánimo, gira los rodillos y descubre qué comer. Descarta lo que no te apetece y vuelve a girar.',
    it: 'Scegli il pasto e l’umore, fai girare i rulli e scopri cosa mangiare. Escludi ciò che non ti va e rigira.',
    pt: 'Escolha a refeição e o humor, gire os rolos e descubra o que comer. Tire o que não quer e gire de novo.',
    ru: 'Выбери приём пищи и настроение, крути барабаны и узнай, что съесть. Не нравится блюдо — убери и крути снова.',
  },
};
