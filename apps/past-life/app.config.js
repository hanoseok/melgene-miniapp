// past-life 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/past-life/ 로 바꾼다).
module.exports = {
  id: 'past-life',
  emoji: '🔮',
  category: 'test',
  added: '2026-09-26',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://past-life.example.com/',
  title: {
    ko: '나의 전생 테스트',
    en: 'Past Life Test',
    ja: '前世診断テスト',
    zh: '前世测试',
    fr: 'Test de vie antérieure',
    de: 'Früheres-Leben-Test',
    th: 'ทดสอบชาติที่แล้ว',
    vi: 'Trắc nghiệm kiếp trước',
    es: 'Test de vidas pasadas',
    it: 'Test vita precedente',
    pt: 'Teste de vida passada',
    ru: 'Кем я был в прошлой жизни',
  },
  desc: {
    ko: '12문항, 2분이면 끝. 당신은 전생에 누구였을까?',
    en: '12 questions, 2 minutes. Who were you in a past life?',
    ja: '12問・2分で完了。あなたの前世はだれだった？',
    zh: '12道题，2分钟搞定。你的前世是谁？',
    fr: '12 questions, 2 minutes. Qui étiez-vous dans une vie antérieure ?',
    de: '12 Fragen, 2 Minuten. Wer warst du in einem früheren Leben?',
    th: '12 ข้อ 2 นาทีจบ ชาติที่แล้วคุณเป็นใคร?',
    vi: '12 câu hỏi, 2 phút. Kiếp trước bạn là ai?',
    es: '12 preguntas, 2 minutos. ¿Quién fuiste en una vida pasada?',
    it: '12 domande, 2 minuti. Chi eri in una vita precedente?',
    pt: '12 perguntas, 2 minutos. Quem você foi em uma vida passada?',
    ru: '12 вопросов, 2 минуты — и ты узнаешь свою прошлую жизнь.',
  },
};
