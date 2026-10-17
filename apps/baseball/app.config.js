// baseball 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/baseball/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'baseball',
  emoji: '⚾',
  category: 'game',
  added: '2026-10-18',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://baseball.example.com/',
  title: {
    ko: '숫자 야구',
    en: 'Bulls and Cows',
    ja: 'ヒット&ブロー',
    zh: '猜数字',
    fr: 'Taureaux et vaches',
    de: 'Zahlenraten – Bulls and Cows',
    th: 'เกมทายตัวเลข',
    vi: 'Đoán số (Bulls and Cows)',
    es: 'Toros y vacas',
    it: 'Tori e vacche',
    pt: 'Touros e vacas',
    ru: 'Быки и коровы',
  },
  desc: {
    ko: '컴퓨터가 정한 서로 다른 3자리·4자리 숫자를 스트라이크·볼·아웃 힌트로 맞혀 보세요. 난이도별 최고 기록과 실제 백분위.',
    en: 'Crack the secret 3 or 4 digit number from strike, ball and out clues. Fewest tries wins, with your real rank.',
    ja: 'コンピューターが決めた3桁・4桁の数字を、ヒットとブローのヒントで当てよう。少ない回数で実際の順位も。',
    zh: '根据位置对、数字对的提示，猜出电脑设定的 3 位或 4 位数字。次数越少越好，还能看真实排名。',
    fr: 'Devinez le nombre secret de 3 ou 4 chiffres grâce aux indices. Le moins d’essais possible, avec votre vrai classement.',
    de: 'Errate die geheime 3- oder 4-stellige Zahl mit Treffer-Hinweisen. Je weniger Versuche, desto besser – mit echtem Rang.',
    th: 'ทายเลขลับ 3 หรือ 4 หลักจากคำใบ้ถูกที่ ผิดที่ ใช้ครั้งน้อยที่สุดคือชนะ พร้อมอันดับจริง',
    vi: 'Đoán số bí mật 3 hoặc 4 chữ số qua gợi ý đúng/sai vị trí. Càng ít lượt càng tốt, kèm thứ hạng thật.',
    es: 'Adivina el número secreto de 3 o 4 cifras con pistas de toros y vacas. Cuantos menos intentos, mejor, con tu posición real.',
    it: 'Indovina il numero segreto di 3 o 4 cifre con gli indizi toro e vacca. Meno tentativi fai, meglio è, con la tua posizione reale.',
    pt: 'Descubra o número secreto de 3 ou 4 dígitos com pistas de certo e quase. Quanto menos tentativas, melhor, com sua posição real.',
    ru: 'Угадай секретное число из 3 или 4 цифр по подсказкам про быков и коров. Чем меньше попыток, тем лучше, с реальным местом в рейтинге.',
  },
};
