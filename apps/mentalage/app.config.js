// mentalage 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/mentalage/ 로 바꾼다).
// 스포일러 금지: 설명에 결과 나이대 이름·질문을 쓰지 않는다.
module.exports = {
  id: 'mentalage',
  emoji: '🧠',
  category: 'test',
  added: '2026-10-08',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://mentalage.example.com/',
  title: {
    ko: '정신연령 테스트',
    en: 'Mental Age Test',
    ja: '精神年齢診断',
    zh: '心理年龄测试',
    fr: 'Test d’âge mental',
    de: 'Mentales Alter Test',
    th: 'ทดสอบอายุทางจิตใจ',
    vi: 'Trắc nghiệm tuổi tâm lý',
    es: 'Test de edad mental',
    it: 'Test dell’età mentale',
    pt: 'Teste de idade mental',
    ru: 'Психологический возраст',
  },
  desc: {
    ko: '주말 아침, 단톡방, 비 오는 휴일… 12가지 일상 질문으로 알아보는 내 마음의 나이. 2~3분이면 끝나요.',
    en: '12 light everyday questions, 2–3 minutes. Find out how old your mind really is, down to the number.',
    ja: '週末の朝、グループLINE、雨の休日…12の日常の質問でわかる心の年齢。2〜3分で完了。',
    zh: '周末早晨、群聊、下雨的假日……12道日常小题，2~3分钟测出你的心理年龄。',
    fr: '12 petites questions du quotidien, 2 à 3 minutes. Découvre l’âge réel de ton esprit, au chiffre près.',
    de: '12 leichte Alltagsfragen, 2–3 Minuten. Finde heraus, wie alt dein Kopf wirklich ist – auf das Jahr genau.',
    th: 'คำถามชีวิตประจำวัน 12 ข้อ ใช้เวลา 2–3 นาที รู้เลยว่าใจคุณอายุเท่าไหร่กันแน่',
    vi: '12 câu hỏi đời thường, 2–3 phút. Khám phá tâm hồn bạn thật ra bao nhiêu tuổi.',
    es: '12 preguntas ligeras del día a día, 2 o 3 minutos. Descubre cuántos años tiene de verdad tu mente.',
    it: '12 domande leggere di tutti i giorni, 2-3 minuti. Scopri quanti anni ha davvero la tua testa.',
    pt: '12 perguntas leves do dia a dia, 2 a 3 minutos. Descubra quantos anos sua mente tem de verdade.',
    ru: '12 лёгких житейских вопросов, 2–3 минуты. Узнай, сколько лет на самом деле твоей душе.',
  },
};
