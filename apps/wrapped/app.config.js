// wrapped 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/wrapped/ 로 바꾼다).
// 연도는 쓰지 않는다(카드 안의 연도는 브라우저가 오늘 날짜로 계산 — wrapped-core.js reviewYear).
module.exports = {
  id: 'wrapped',
  emoji: '🎁',
  category: 'create',
  added: '2026-11-03',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://wrapped.example.com/',
  title: {
    ko: '올해 결산 카드',
    en: 'Year in Review Card',
    ja: '今年の振り返りカード',
    zh: '年度总结卡片',
    fr: 'Mon bilan de l’année',
    de: 'Jahresrückblick-Karte',
    th: 'การ์ดสรุปปีของฉัน',
    vi: 'Thẻ tổng kết năm',
    es: 'Resumen del año',
    it: 'Il mio anno in breve',
    pt: 'Retrospectiva do ano',
    ru: 'Итоги года',
  },
  desc: {
    ko: '올해의 한 단어, 최고의 순간, 올해의 노래·음식·장소, 고마운 사람, 내년 목표를 적고 테마를 고르면 나만의 연말 결산 카드가 완성돼요. 이미지 저장·링크 공유.',
    en: 'Fill in your word of the year, best moment, song, food, place, someone to thank and next year’s goal, pick a theme and get your own year-in-review card to save or share.',
    ja: '今年の一文字、最高の瞬間、今年の曲・ごはん・場所、ありがとうを伝えたい人、来年の目標を書いてテーマを選べば、自分だけの振り返りカードが完成。画像保存・リンク共有OK。',
    zh: '写下年度关键词、最难忘的瞬间、年度歌曲、美食、地点、想感谢的人和明年的目标，选个主题，就能生成你的年度总结卡片，可存图也可发链接。',
    fr: 'Ton mot de l’année, ton meilleur moment, ta chanson, ton plat, ton lieu, la personne à remercier et ton objectif : choisis un thème et obtiens ta carte bilan à enregistrer ou partager.',
    de: 'Wort des Jahres, schönster Moment, Song, Essen, Ort, wem du danken willst und dein Ziel fürs nächste Jahr – Design wählen und deine Jahresrückblick-Karte speichern oder teilen.',
    th: 'เขียนคำประจำปี ช่วงเวลาที่ดีที่สุด เพลง อาหาร สถานที่ คนที่อยากขอบคุณ และเป้าหมายปีหน้า เลือกธีม แล้วได้การ์ดสรุปปีของคุณ บันทึกเป็นรูปหรือแชร์ลิงก์ได้',
    vi: 'Ghi từ khóa của năm, khoảnh khắc đẹp nhất, bài hát, món ăn, nơi chốn, người muốn cảm ơn và mục tiêu năm sau, chọn chủ đề để có thẻ tổng kết năm của riêng bạn.',
    es: 'Escribe tu palabra del año, tu mejor momento, canción, comida, lugar, a quién agradecer y tu meta para el próximo año, elige un tema y obtén tu tarjeta de resumen del año.',
    it: 'Scrivi la tua parola dell’anno, il momento più bello, la canzone, il piatto, il posto, chi vuoi ringraziare e l’obiettivo per l’anno nuovo: scegli un tema e salva o condividi la tua card.',
    pt: 'Escreva sua palavra do ano, o melhor momento, a música, a comida, o lugar, quem você quer agradecer e a meta do ano que vem, escolha um tema e salve ou compartilhe sua retrospectiva.',
    ru: 'Слово года, лучший момент, песня, еда, место, кого хочешь поблагодарить и цель на следующий год — выбери оформление и получи свою карточку итогов года. Сохрани или поделись.',
  },
};
