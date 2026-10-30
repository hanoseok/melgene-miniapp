// bracket 미니앱 등록 정보 — tools/gen-sites.js 가 모아 shared/site.config.js 의 SITE_CONFIG.SITES 를 만든다.
// title/desc: 12개 언어(shared/i18n.js LOCALES). category: game | test | create | vote. added: 등록일(5일간 포털 NEW).
// path 는 자리표시자 주소(deploy-prep.sh 가 https://melgene.com/bracket/ 로 바꾼다).
// title 은 앱 페이지 <title> 의 현지 검색어와 같은 이름(포털 아이콘에 들어가게 짧게).
// food-cup(정해진 음식 토너먼트)과 달리, 이 앱은 사용자가 직접 넣은 이름·항목으로 대진표를 만든다.
module.exports = {
  id: 'bracket',
  emoji: '🏆',
  category: 'vote',
  added: '2026-10-30',
  order: 2, // 같은 날(added) 등록한 앱 사이의 순서
  path: 'https://bracket.example.com/',
  title: {
    ko: '토너먼트 대진표',
    en: 'Tournament Bracket Maker',
    ja: 'トーナメント表作成',
    zh: '淘汰赛对阵表',
    fr: 'Tableau de tournoi',
    de: 'Turnierbaum erstellen',
    th: 'สร้างสายการแข่งขัน',
    vi: 'Tạo sơ đồ thi đấu',
    es: 'Cuadro de torneo',
    it: 'Tabellone torneo',
    pt: 'Chaveamento de torneio',
    ru: 'Турнирная сетка',
  },
  desc: {
    ko: '이름이나 항목을 넣으면 공정하게 섞어 토너먼트 대진표를 만들어요. 한 판씩 골라 우승자를 정하는 나만의 이상형 월드컵도 OK.',
    en: 'Type 2 to 64 names or items and get a fair, randomly drawn bracket. Pick winners match by match or just draw the bracket for real games.',
    ja: '名前や項目を入れるだけで、公平にシャッフルしたトーナメント表を作成。1試合ずつ勝者を選んで優勝を決めることもできます。',
    zh: '输入2到64个名字或选项，公平随机抽签生成淘汰赛对阵表。可以一场场选出胜者，也可以只生成对阵用于真实比赛。',
    fr: 'Entre 2 à 64 noms ou choix et obtiens un tableau de tournoi tiré au sort équitablement. Choisis les gagnants duel par duel ou affiche juste le tableau.',
    de: 'Gib 2 bis 64 Namen ein und erhalte einen fair ausgelosten Turnierbaum. Wähle die Sieger Spiel für Spiel oder lose nur die Paarungen aus.',
    th: 'ใส่ชื่อหรือตัวเลือก 2–64 รายการ แล้วสุ่มสายการแข่งขันอย่างยุติธรรม เลือกผู้ชนะทีละคู่ หรือจับสายไว้ใช้แข่งจริงก็ได้',
    vi: 'Nhập 2–64 tên hoặc lựa chọn để tạo sơ đồ thi đấu loại trực tiếp được bốc thăm công bằng. Chọn người thắng từng cặp hoặc chỉ bốc thăm nhánh đấu.',
    es: 'Escribe de 2 a 64 nombres u opciones y obtén un cuadro de torneo sorteado de forma justa. Elige ganadores duelo a duelo o solo haz el sorteo.',
    it: 'Inserisci da 2 a 64 nomi o voci e crea un tabellone sorteggiato in modo equo. Scegli i vincitori sfida per sfida o fai solo il sorteggio.',
    pt: 'Digite de 2 a 64 nomes ou opções e gere um chaveamento sorteado de forma justa. Escolha os vencedores confronto a confronto ou só sorteie as chaves.',
    ru: 'Впиши от 2 до 64 имён или вариантов и получи честно разыгранную турнирную сетку. Выбирай победителей в каждой паре или просто проведи жеребьёвку.',
  },
};
