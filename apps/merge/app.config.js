// merge 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://miniapp.melgene.com/merge/ 로 바꾼다).
// title 은 각 언어의 현지 검색어(앱 페이지 h1·title 과 같은 이름).
module.exports = {
  id: 'merge',
  emoji: '🎃',
  category: 'game',
  added: '2026-10-02',
  order: 1, // 같은 날(added) 등록한 앱 사이의 순서 (없으면 뒤로)
  path: 'https://merge.example.com/',
  title: {
    ko: '할로윈 수박게임',
    en: 'Suika Game Halloween',
    ja: 'スイカゲーム ハロウィン',
    zh: '合成大西瓜 万圣节版',
    fr: 'Jeu de la pastèque – Halloween',
    de: 'Suika Game Halloween',
    th: 'เกมแตงโม ฮาโลวีน',
    vi: 'Game dưa hấu Halloween',
    es: 'Juego de la sandía – Halloween',
    it: 'Gioco dell’anguria',
    pt: 'Jogo da melancia – Halloween',
    ru: 'Арбузная игра на Хэллоуин',
  },
  desc: {
    ko: '사탕을 병에 떨어뜨려 같은 것끼리 합치면 더 큰 것으로! 선을 넘기지 않고 거대 잭오랜턴까지 키워 보는 할로윈 수박 게임.',
    en: 'Drop treats into the jar and merge matching pairs into bigger ones. Keep the pile under the line and grow a giant jack-o’-lantern.',
    ja: 'お菓子をビンに落として、同じもの同士をくっつけると大きく進化。線を越えないように巨大ジャック・オー・ランタンを目指そう。',
    zh: '把糖果丢进罐子，两个一样的碰在一起就合成更大的！别让它们越过红线，一路合成巨型南瓜灯。',
    fr: 'Lâche des friandises dans le bocal et fusionne les paires identiques. Reste sous la ligne et fais grandir une citrouille géante.',
    de: 'Lass Süßes ins Glas fallen und verschmelze gleiche Paare zu größeren. Bleib unter der Linie und züchte die Riesen-Kürbislaterne.',
    th: 'ปล่อยขนมลงขวดโหล ของเหมือนกันชนกันจะรวมร่างเป็นชิ้นใหญ่ขึ้น อย่าให้ล้นเส้น แล้วไปให้ถึงฟักทองยักษ์',
    vi: 'Thả kẹo vào hũ, hai món giống nhau chạm vào sẽ gộp thành món lớn hơn. Đừng để tràn vạch và nuôi đèn bí ngô khổng lồ.',
    es: 'Suelta dulces en el frasco y fusiona las parejas iguales en algo más grande. No pases la línea y llega a la calabaza gigante.',
    it: 'Lascia cadere i dolcetti nel barattolo e unisci le coppie uguali. Resta sotto la linea e fai crescere la zucca gigante.',
    pt: 'Solte doces no pote e junte os pares iguais em algo maior. Não passe da linha e chegue à abóbora gigante.',
    ru: 'Бросай сладости в банку и соединяй одинаковые в более крупные. Не переходи черту и вырасти гигантский фонарь Джека.',
  },
};
