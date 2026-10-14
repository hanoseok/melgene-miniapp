// yesno 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/yesno/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
module.exports = {
  id: 'yesno',
  emoji: '🎱',
  category: 'vote',
  added: '2026-10-15',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://yesno.example.com/',
  title: {
    ko: '예스 노 결정기',
    en: 'Yes or No Generator',
    ja: 'YES NO 占い',
    zh: '是或否决定器',
    fr: 'Oui ou non',
    de: 'Ja oder Nein Orakel',
    th: 'สุ่ม ใช่ หรือ ไม่',
    vi: 'Có hay không',
    es: 'Sí o no',
    it: 'Sì o no',
    pt: 'Sim ou não',
    ru: 'Да или нет',
  },
  desc: {
    ko: '고민되는 질문을 적고 버튼만 누르면 YES 또는 NO. 예스·노·글쎄, 신비한 구슬 답, 3판 2선승까지 골라 보세요.',
    en: 'Type a question and get a yes or no in seconds. Plain yes/no, yes/no/maybe, a mystic orb answer or best of 3 and 5.',
    ja: '迷っている質問を入れてボタンを押すだけでYESかNO。YES・NO・たぶん、占い玉の答え、3本・5本勝負も選べます。',
    zh: '写下让你纠结的问题，按一下就得到是或否。还有是/否/也许、神秘水晶球回答和三局两胜、五局三胜。',
    fr: 'Pose ta question et obtiens un oui ou un non en un clic : oui/non, oui/non/peut-être, boule mystique ou deux manches gagnantes.',
    de: 'Frage eintippen, Antwort bekommen: Ja oder Nein, Ja/Nein/Vielleicht, ein Orakelspruch oder Best of 3 und Best of 5.',
    th: 'พิมพ์คำถามที่ลังเลแล้วกดปุ่ม ได้คำตอบใช่หรือไม่ทันที มีโหมด ใช่/ไม่/อาจจะ ลูกแก้วทำนาย และชนะ 2 ใน 3',
    vi: 'Gõ câu hỏi đang phân vân, bấm nút là có câu trả lời có hay không. Có/không/có thể, quả cầu tiên tri, thắng 2/3 và 3/5.',
    es: 'Escribe tu pregunta y recibe un sí o un no al instante: sí/no, sí/no/quizás, respuesta de la bola mística o al mejor de 3 y 5.',
    it: 'Scrivi la domanda e ricevi un sì o un no all’istante: sì/no, sì/no/forse, il responso della sfera magica o al meglio di 3 e 5.',
    pt: 'Escreva sua pergunta e receba um sim ou não na hora: sim/não, sim/não/talvez, resposta da bola mística ou melhor de 3 e de 5.',
    ru: 'Напиши вопрос и получи «да» или «нет» за секунду: да/нет, да/нет/может быть, ответ шара-оракула или до двух и трёх побед.',
  },
};
