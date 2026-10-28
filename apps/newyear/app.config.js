// newyear 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/newyear/ 로 바꾼다).
// 연도는 newyear-core.js 의 YEAR 하나만 쓴다(th 는 불기 = YEAR + 543).
// 스포일러 금지: 설명에 결과 키워드·질문을 쓰지 않는다. 제목은 포털 아이콘 이름이라 짧게(3줄 안).
const Y = require('./newyear-core.js').YEAR;

module.exports = {
  id: 'newyear',
  emoji: '🌅',
  category: 'test',
  added: '2026-10-29',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://newyear.example.com/',
  title: {
    ko: `${Y} 새해 운세`,
    en: `${Y} New Year Fortune`,
    ja: `${Y}年 運勢診断`,
    zh: `${Y}新年运势测试`,
    fr: `Test du Nouvel An ${Y}`,
    de: `Neujahrsorakel ${Y}`,
    th: `ดูดวงปีใหม่ ${Y + 543}`,
    vi: `Bói vui năm mới ${Y}`,
    es: `Test de la suerte ${Y}`,
    it: `Test della fortuna ${Y}`,
    pt: `Teste da sorte ${Y}`,
    ru: `Каким будет твой ${Y}?`,
  },
  desc: {
    ko: `가벼운 질문 11개, 2분이면 끝. 나의 ${Y}년 키워드와 행운의 색·달·물건은? 재미로 보는 신년 운세예요.`,
    en: `11 light questions, 2 minutes. What’s your keyword for ${Y}, with a lucky color, month and item? Just for fun.`,
    ja: `かんたんな11問、約2分。あなたの${Y}年のキーワードとラッキーカラー・月・アイテムは？お遊び診断です。`,
    zh: `11道轻松小题，2分钟。你的${Y}年度关键词、幸运色、幸运月和幸运物是什么？仅供娱乐。`,
    fr: `11 petites questions, 2 minutes. Quel est ton mot-clé pour ${Y}, avec couleur, mois et objet porte-bonheur ? Juste pour rire.`,
    de: `11 leichte Fragen, 2 Minuten. Was ist dein Motto für ${Y} – mit Glücksfarbe, Glücksmonat und Glücksbringer? Nur zum Spaß.`,
    th: `คำถามง่าย ๆ 11 ข้อ ใช้เวลา 2 นาที คีย์เวิร์ดปี ${Y + 543} ของคุณคืออะไร พร้อมสี เดือน และของนำโชค ทำเล่นสนุก ๆ`,
    vi: `11 câu hỏi nhẹ nhàng, 2 phút. Từ khóa năm ${Y} của bạn là gì, cùng màu, tháng và món đồ may mắn? Chỉ để vui.`,
    es: `11 preguntas ligeras, 2 minutos. ¿Cuál es tu palabra para ${Y}, con color, mes y objeto de la suerte? Solo por diversión.`,
    it: `11 domande leggere, 2 minuti. Qual è la tua parola per il ${Y}, con colore, mese e oggetto portafortuna? Solo per gioco.`,
    pt: `11 perguntas leves, 2 minutos. Qual é a sua palavra para ${Y}, com cor, mês e objeto da sorte? Só por diversão.`,
    ru: `11 лёгких вопросов, 2 минуты. Какое слово станет твоим в ${Y} году, какой цвет, месяц и талисман принесут удачу? Просто для развлечения.`,
  },
};
