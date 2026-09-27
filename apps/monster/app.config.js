// monster 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 11개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(14일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/monster/ 로 바꾼다).
module.exports = {
  id: 'monster',
  emoji: '🎃',
  category: 'test',
  added: '2026-09-27',
  order: 4, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://monster.example.com/',
  title: {
    ko: '할로윈 몬스터 테스트',
    en: 'Which Monster Are You?',
    ja: 'モンスター診断',
    zh: '万圣节怪物测试',
    fr: 'Quel monstre es-tu ?',
    de: 'Welches Monster bist du?',
    th: 'คุณคือปีศาจฮาโลวีนตัวไหน?',
    vi: 'Bạn là quái vật nào?',
    es: '¿Qué monstruo eres?',
    it: 'Che mostro sei?',
    pt: 'Que monstro você é?',
  },
  desc: {
    ko: '할로윈 밤 10문항, 1분이면 끝. 나를 닮은 몬스터는 누구?',
    en: '10 spooky-cute questions for Halloween night. Which monster is your twin?',
    ja: 'ハロウィンの夜の10問で診断。あなたにそっくりなモンスターは？',
    zh: '万圣节之夜10道题，1分钟测出和你最像的怪物。',
    fr: '10 questions mignonnes et un brin effrayantes pour Halloween. Quel monstre te ressemble ?',
    de: '10 schaurig-süße Fragen zur Halloween-Nacht. Welches Monster passt zu dir?',
    th: '10 คำถามคืนฮาโลวีน 1 นาทีรู้ผล ปีศาจตัวไหนเหมือนคุณที่สุด?',
    vi: '10 câu hỏi đêm Halloween, 1 phút có kết quả. Quái vật nào giống bạn nhất?',
    es: '10 preguntas tiernamente terroríficas para Halloween. ¿Qué monstruo se parece a ti?',
    it: '10 domande tra brividi e tenerezza per la notte di Halloween. Quale mostro ti somiglia?',
    pt: '10 perguntas fofas e assustadoras para a noite de Halloween. Qual monstro combina com você?',
  },
};
