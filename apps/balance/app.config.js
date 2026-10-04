// balance 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/balance/ 로 바꾼다).
module.exports = {
  id: 'balance',
  emoji: '⚖️',
  category: 'test',
  added: '2026-09-27',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://balance.example.com/',
  title: {
    ko: '밸런스 게임',
    en: 'Would You Rather',
    ja: '究極の二択',
    zh: '二选一',
    fr: 'Tu préfères ?',
    de: 'Würdest du lieber?',
    th: 'จะเลือกอะไร?',
    vi: 'Bạn chọn bên nào?',
    es: '¿Qué prefieres?',
    it: 'Preferiresti?',
    pt: 'O que você prefere?',
    ru: 'Что бы ты выбрал?',
  },
  desc: {
    ko: '둘 중 하나만 고른다면? 다른 사람들은 몇 %가 골랐는지 바로 확인.',
    en: 'Pick one of two — then see what percent of everyone chose the same.',
    ja: 'どっちを選ぶ？ みんなの選択率がすぐわかる究極の二択。',
    zh: '只能选一个的话？马上看看大家的选择比例。',
    fr: 'Choisissez l’un des deux, puis voyez quel pourcentage a fait le même choix.',
    de: 'Wähle eins von zwei – und sieh, wie viel Prozent genauso gewählt haben.',
    th: 'ถ้าเลือกได้แค่ทางเดียว? ดูทันทีว่าคนอื่นเลือกกี่เปอร์เซ็นต์',
    vi: 'Chỉ được chọn một? Xem ngay bao nhiêu phần trăm mọi người chọn giống bạn.',
    es: 'Elige una de dos y mira qué porcentaje eligió lo mismo.',
    it: 'Scegli una delle due e scopri che percentuale ha fatto la tua stessa scelta.',
    pt: 'Escolha uma de duas opções e veja quantos por cento escolheram igual a você.',
    ru: 'Выбери одно из двух — и узнай, сколько процентов людей выбрали то же самое.',
  },
};
